import { expect, type Page } from '@playwright/test'

export type CheckResult = { ok: boolean; misurato: string; atteso: string; avviso?: boolean }

const FORBIDDEN_EN_UI = [
  'Close',
  'Edit',
  'Delete',
  'Remove',
  'Save',
  'Cancel',
  'Add',
  'Toggle',
] as const

export type ConsoleMonitor = {
  errors: string[]
  warnings: string[]
  failedResponses: string[]
}

/** Ascolta console, pageerror e risposte 4xx/5xx: va attaccato prima del primo goto. */
export function attachConsoleMonitor(page: Page): ConsoleMonitor {
  const bag: ConsoleMonitor = { errors: [], warnings: [], failedResponses: [] }
  page.on('console', (msg) => {
    const text = msg.text()
    const loc = msg.location()
    const where = loc.url ? `${loc.url}:${loc.lineNumber ?? 0}` : 'console'
    if (msg.type() === 'error') bag.errors.push(`${where}: ${text}`)
    if (msg.type() === 'warning') bag.warnings.push(`${where}: ${text}`)
  })
  page.on('pageerror', (e) => bag.errors.push(`pageerror: ${String(e)}`))
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      bag.failedResponses.push(`${res.status()} ${res.url()}`)
    }
  })
  return bag
}

export function consoleMonitorSummary(bag: ConsoleMonitor): string {
  return [
    ...bag.errors.map((e) => `error: ${e}`),
    ...bag.warnings.map((w) => `warning: ${w}`),
    ...bag.failedResponses.map((r) => `http: ${r}`),
  ].join(' | ')
}

export async function assertConsoleMonitorClean(bag: ConsoleMonitor): Promise<void> {
  expect(bag.errors, 'error console/pageerror').toEqual([])
  expect(bag.warnings, 'warning console').toEqual([])
  expect(bag.failedResponses, 'risposte 4xx/5xx').toEqual([])
}

async function collectAriaLabelsInScope(scope: import('@playwright/test').Locator): Promise<string[]> {
  return scope.evaluate((root) => {
    const labels: string[] = []
    root.querySelectorAll('[aria-label]').forEach((el) => {
      const v = el.getAttribute('aria-label')?.trim()
      if (v) labels.push(v)
    })
    return labels
  })
}

/** Dopo il caricamento di main (e dialoghi aperti), nessuna stringa inglese vietata in testo né aria-label. */
export async function assertNoForbiddenEnglishInUi(
  page: Page,
  opts?: { extraScopes?: import('@playwright/test').Locator[] },
): Promise<void> {
  await expect(page.locator('main')).toBeVisible()
  const scopes = [page.locator('main'), ...(opts?.extraScopes ?? [])]
  const bodyText = await page.locator('main').innerText()
  for (const forbidden of FORBIDDEN_EN_UI) {
    expect(bodyText, `testo visibile contiene «${forbidden}»`).not.toContain(forbidden)
  }
  for (const scope of scopes) {
    const labels = await collectAriaLabelsInScope(scope)
    for (const label of labels) {
      for (const forbidden of FORBIDDEN_EN_UI) {
        expect(label, `aria-label «${label}» contiene «${forbidden}»`).not.toContain(forbidden)
      }
    }
  }
}

export async function checkScrollOrizzontale(page: Page): Promise<CheckResult> {
  const { sw, iw } = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
  }))
  const ok = sw <= iw
  return {
    ok,
    misurato: `${sw} px vs innerWidth ${iw} px`,
    atteso: 'scrollWidth <= innerWidth',
  }
}

export async function checkTemaClasse(page: Page, htmlDark: boolean): Promise<CheckResult> {
  const has = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  const ok = has === htmlDark
  return {
    ok,
    misurato: has ? 'classe dark presente su <html>' : 'classe dark assente su <html>',
    atteso: htmlDark ? 'classe dark presente su <html>' : 'classe dark assente su <html>',
  }
}

export async function checkAltezzaMouse(page: Page): Promise<CheckResult> {
  const heights = await page.evaluate(() => {
    const out: { h: number }[] = []
    const base =
      'button, input:not([type=hidden]), select, [role=combobox], [role=tab], [role=menuitem]'
    document.querySelectorAll(base).forEach((e) => {
      const r = e.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) return
      if (getComputedStyle(e).visibility === 'hidden') return
      out.push({ h: Math.round(r.height) })
    })
    document.querySelectorAll('a[href]').forEach((a) => {
      const style = getComputedStyle(a)
      if (style.visibility === 'hidden') return
      if (style.textDecorationLine.includes('underline')) return
      const r = a.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) return
      const bg = style.backgroundColor
      const cls = a.className?.toString() ?? ''
      const buttonLike =
        r.height >= 28 &&
        (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' ||
          cls.includes('inline-flex') ||
          cls.includes('h-11'))
      if (buttonLike) out.push({ h: Math.round(r.height) })
    })
    return out
  })
  const outOf = heights.filter((x) => x.h < 28 || x.h > 48)
  return {
    ok: outOf.length === 0,
    avviso: true,
    misurato: outOf.length
      ? `fuori intervallo [28,48] px: ${outOf.map((x) => x.h).join(', ')}`
      : `tutte in [28,48] px (${heights.length} elementi)`,
    atteso: 'altezze controlli in [28, 48] px (esclusi link di testo)',
  }
}

export async function installNoLampoObserver(page: Page): Promise<void> {
  await page.addInitScript(() => {
    ;(window as unknown as { __htmlClassChanges: string[] }).__htmlClassChanges = []
    const obs = new MutationObserver(() => {
      ;(window as unknown as { __htmlClassChanges: string[] }).__htmlClassChanges.push(
        document.documentElement.className,
      )
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    ;(window as unknown as { __stopHtmlObs: () => void }).__stopHtmlObs = () => obs.disconnect()
  })
}

export async function checkNoLampo(page: Page): Promise<CheckResult> {
  await page.waitForFunction(() => document.readyState === 'complete')
  await page.evaluate(() => {
    const w = window as unknown as { __stopHtmlObs?: () => void }
    w.__stopHtmlObs?.()
  })
  const changes = await page.evaluate(
    () => (window as unknown as { __htmlClassChanges?: string[] }).__htmlClassChanges ?? [],
  )
  const afterDom = changes.length > 1
  return {
    ok: !afterDom,
    misurato: afterDom ? `${changes.length} mutazioni classe <html> dopo load` : '0 mutazioni dopo DOMContentLoaded',
    atteso: '0 mutazioni classe <html> dopo DOMContentLoaded',
  }
}

export async function checkTemaCambioSistema(page: Page, baseUrl: string): Promise<CheckResult> {
  await page.context().addCookies([{ name: 'app-theme', value: 'system', url: baseUrl }])
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto(`${baseUrl}/app/login`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  let hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  if (hasDark) {
    return {
      ok: false,
      misurato: 'dark presente con system+OS chiaro',
      atteso: 'dark assente con system+OS chiaro',
    }
  }
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.waitForFunction(() => document.documentElement.classList.contains('dark'), undefined, {
    timeout: 10_000,
  })
  hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  await page.context().addCookies([{ name: 'app-theme', value: 'light', url: baseUrl }])
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto(`${baseUrl}/app/login`, { waitUntil: 'domcontentloaded' })
  const fixedLight = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  return {
    ok: hasDark && !fixedLight,
    misurato: `dark dopo emulate scuro=${hasDark}; dark con cookie light=${fixedLight}`,
    atteso: 'dark compare con system+OS scuro; con cookie light non cambia con OS',
  }
}
