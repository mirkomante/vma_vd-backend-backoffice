import { TOUCH_MEASURE_FN } from './touch.mjs'

function initialsFromEmail(email) {
  const local = email.split('@')[0] ?? ''
  const parts = local.split(/[._-]/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return local.slice(0, 2).toUpperCase()
}

export const LAUNCHER_VERSION = '3.9.0'

let shellPercorsoPiattiDiagnosticDone = false

export const SEGNAPOSTO_H1 = {
  '/app/menu': 'Piatti',
  '/app/hours': 'Orari',
  '/app/reservations': 'Prenotazioni',
}

const ENGLISH_A11Y = [
  'Toggle Sidebar',
  'Close',
  'Sidebar',
  'breadcrumb',
  'More',
  'Displays the mobile sidebar',
]

const PERCORSO_ATTESO_FALLBACK = {
  '/app': { breadcrumb: ['Area App'], active: null },
  '/app/menu': { breadcrumb: ['Menù', 'Piatti'], active: 'Piatti' },
  '/app/hours': { breadcrumb: ['Orari'], active: 'Orari' },
  '/app/reservations': { breadcrumb: ['Prenotazioni', 'Elenco'], active: 'Elenco' },
}

export function breadcrumbLabelsFromLib(parts) {
  return parts.map((p) => (p.type === 'link' ? p.label : p.label))
}

export function buildPercorsoAttesoMap(navJson) {
  const map = { ...PERCORSO_ATTESO_FALLBACK }
  if (!navJson?.breadcrumbCases) return map
  for (const { path, parts } of navJson.breadcrumbCases) {
    map[path] = {
      breadcrumb: breadcrumbLabelsFromLib(parts),
      active: navJson.activeNavByPath?.[path] ?? null,
    }
  }
  return map
}

export async function isSegnapostoMain(page) {
  const desc = await page.locator('main p').first().innerText().catch(() => '')
  return desc.includes('Questa sezione sarà disponibile a breve.')
}

export function withinTolerance(value, expected, tol = 0) {
  return Math.abs(value - expected) <= tol
}

export async function checkAmbiente(page) {
  const r = await page.evaluate(() => {
    const portal = document.querySelector('nextjs-portal')
    if (portal) return { found: true, selector: 'nextjs-portal' }
    const byTag = [...document.querySelectorAll('*')].find((e) => e.localName === 'nextjs-portal')
    if (byTag) return { found: true, selector: 'nextjs-portal (localName)' }
    const dev = document.querySelector('[data-nextjs-toast], #__next-build-watcher, [data-next-mark]')
    if (dev) {
      const id = dev.id ? `#${dev.id}` : dev.tagName.toLowerCase()
      const cls = dev.className && typeof dev.className === 'string' ? `.${dev.className.split(' ')[0]}` : ''
      return { found: true, selector: id || cls || dev.tagName }
    }
    return { found: false, selector: null }
  })
  return {
    ok: !r.found,
    misurato: r.found ? `presente (${r.selector})` : 'assente',
    atteso: 'assente (nessun indicatore dev Next)',
    selector: r.selector,
  }
}

export async function checkScrollOrizzontale(page) {
  const sw = await page.evaluate(() => document.documentElement.scrollWidth)
  const iw = await page.evaluate(() => window.innerWidth)
  return { ok: sw <= iw, misurato: `${sw} vs innerWidth ${iw}`, atteso: 'scrollWidth <= innerWidth' }
}

export async function checkTemaClasse(page, htmlDark) {
  const has = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  const ok = has === htmlDark
  return { ok, misurato: has ? 'dark presente' : 'dark assente', atteso: htmlDark ? 'dark presente' : 'dark assente' }
}

export async function checkToccoMinimo(page, { stableFirst = false, waitAnimations = true } = {}) {
  if (waitAnimations) {
    const { waitForAnimationsSettled } = await import('./measure-stable.mjs')
    const dialog = page.locator('[role=alertdialog]')
    if ((await dialog.count()) > 0) {
      await waitForAnimationsSettled(page, { rootSelector: '[role=alertdialog]' })
    } else if ((await page.locator('[data-slot=sheet-content]').count()) > 0) {
      await waitForAnimationsSettled(page, { rootSelector: '[data-slot=sheet-content]' })
    } else {
      await waitForAnimationsSettled(page)
    }
  }
  if (stableFirst) {
    const { waitForPageLayoutStable } = await import('./measure-stable.mjs')
    await waitForPageLayoutStable(page)
  }
  const list = await page.evaluate(TOUCH_MEASURE_FN)
  return {
    ok: list.length === 0,
    misurato: list.length ? list.join('; ') : 'nessun elemento',
    atteso: 'nessun elemento sotto 44 px',
  }
}

export async function checkAltezzaMouse(page) {
  const heights = await page.evaluate(() => {
    const out = []
    const base =
      'button, input:not([type=hidden]), select, [role=combobox], [role=tab], [role=menuitem]'
    document.querySelectorAll(base).forEach((e) => {
      const r = e.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) return
      if (getComputedStyle(e).visibility === 'hidden') return
      out.push({ h: Math.round(r.height), tag: e.tagName })
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
        (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' || cls.includes('inline-flex') || cls.includes('h-11'))
      if (buttonLike) out.push({ h: Math.round(r.height), tag: 'A' })
    })
    return out
  })
  const outOf = heights.filter((x) => x.h < 28 || x.h > 48)
  return {
    ok: outOf.length === 0,
    avviso: true,
    misurato: outOf.length
      ? `fuori intervallo: ${outOf.map((x) => x.h).join(', ')} px`
      : `tutte in [28,48] (${heights.length} elementi)`,
    atteso: 'altezze in [28, 48] px (no collegamenti di testo)',
  }
}

export async function installNoLampoObserver(page) {
  await page.addInitScript(() => {
    window.__htmlClassChanges = []
    const obs = new MutationObserver(() => {
      window.__htmlClassChanges.push(document.documentElement.className)
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    window.__stopHtmlObs = () => obs.disconnect()
  })
}

export async function checkNoLampo(page) {
  await page.waitForFunction(() => document.readyState === 'complete')
  await page.evaluate(() => {
    if (window.__stopHtmlObs) window.__stopHtmlObs()
  })
  const changes = await page.evaluate(() => window.__htmlClassChanges ?? [])
  const afterDom = changes.length > 1
  return {
    ok: !afterDom,
    misurato: afterDom ? `${changes.length} mutazioni classe html` : 'nessuna mutazione dopo load',
    atteso: 'nessuna variazione classe <html> dopo DOMContentLoaded',
  }
}

export async function checkTemaCambioSistema(page, baseUrl) {
  const { logHandlerStep } = await import('./progress.mjs')
  const step = (label, fn) => {
    logHandlerStep(`C3-cambio-sistema: ${label}`)
    return fn()
  }
  await step('cookie app-theme=system', () =>
    page.context().addCookies([{ name: 'app-theme', value: 'system', url: baseUrl }]),
  )
  await step('emulateMedia light', () => page.emulateMedia({ colorScheme: 'light' }))
  await step('goto /app/login domcontentloaded', () =>
    page.goto(`${baseUrl}/app/login`, { waitUntil: 'domcontentloaded', timeout: 45_000 }),
  )
  let hasDark = await step('evaluate dark (light OS)', () =>
    page.evaluate(() => document.documentElement.classList.contains('dark')),
  )
  if (hasDark) {
    return { ok: false, misurato: 'dark già presente con sistema chiaro', atteso: 'no dark con colorScheme light' }
  }
  await step('emulateMedia dark', () => page.emulateMedia({ colorScheme: 'dark' }))
  await step('wait 200ms dopo dark', () => page.waitForTimeout(200))
  hasDark = await step('evaluate dark (dark OS)', () =>
    page.evaluate(() => document.documentElement.classList.contains('dark')),
  )
  await step('cookie app-theme=light', () =>
    page.context().addCookies([{ name: 'app-theme', value: 'light', url: baseUrl }]),
  )
  await step('reload domcontentloaded', () => page.reload({ waitUntil: 'domcontentloaded', timeout: 45_000 }))
  await step('emulateMedia dark (post reload)', () => page.emulateMedia({ colorScheme: 'dark' }))
  await step('wait 200ms post reload', () => page.waitForTimeout(200))
  const stillLight = !(await step('evaluate still light con cookie light', () =>
    page.evaluate(() => document.documentElement.classList.contains('dark')),
  ))
  const ok = hasDark && stillLight
  return {
    ok,
    misurato: `dopo emulate dark: ${hasDark}; con cookie light ignore OS: ${stillLight}`,
    atteso: 'dark con system+OS scuro; no cambio con cookie light/dark fisso',
  }
}

export async function checkLoginTexts(page) {
  const data = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim()
    const desc = document.querySelector('main p')?.textContent?.trim()
    const google = [...document.querySelectorAll('a')].find((a) => a.textContent?.includes('Google'))?.textContent?.trim()
    const accedi = [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Accedi')?.textContent?.trim()
    const sep = document.body.innerText.includes('oppure')
    const labels = [...document.querySelectorAll('label')].map((l) => l.textContent?.trim())
    const textLinks = [...document.querySelectorAll('main a')].filter((a) => {
      const d = getComputedStyle(a).textDecorationLine
      return d.includes('underline') || a.textContent?.includes('Password')
    }).map((a) => a.textContent?.trim())
    return { h1, desc, google, accedi, sep, labels, textLinks }
  })
  const atteso = {
    h1: 'Area App',
    desc: 'Accedi con Google oppure con email e password.',
    google: 'Accedi con Google',
    accedi: 'Accedi',
    labels: ['Email', 'Password'],
    textLinks: ['Password dimenticata?'],
  }
  const ok =
    data.h1 === atteso.h1 &&
    data.desc === atteso.desc &&
    data.google === atteso.google &&
    data.accedi === atteso.accedi &&
    data.sep &&
    JSON.stringify(data.labels) === JSON.stringify(atteso.labels) &&
    JSON.stringify(data.textLinks) === JSON.stringify(atteso.textLinks)
  return { ok, misurato: JSON.stringify(data), atteso: JSON.stringify(atteso) }
}

export async function checkLoginLinkDestinazioni(page) {
  const data = await page.evaluate(() => {
    const map = {}
    document.querySelectorAll('main a').forEach((a) => {
      const t = a.textContent?.trim()
      if (t) map[t] = a.getAttribute('href')
    })
    return map
  })
  const ok = data['Password dimenticata?'] === '/app/login/forgot' && data['Torna al sito'] == null
  return {
    ok,
    misurato: JSON.stringify(data),
    atteso: '{"Password dimenticata?":"/app/login/forgot"}',
  }
}

/** P19: campi ora dentro la scheda e coppie Inizio/Fine senza sovrapposizione (WebKit Playwright). */
export async function checkOrariCampiDentroScheda(page, tol = 0.5) {
  const failures = await page.evaluate((tolerance) => {
    const out = []
    const pairs = [
      ['hours-lunch-start', 'hours-lunch-end'],
      ['hours-dinner-start', 'hours-dinner-end'],
      ['hours-bnb-check-in', 'hours-bnb-check-out'],
    ]
    const timeInputs = [...document.querySelectorAll('main input[type="time"]')]
    for (const input of timeInputs) {
      const card = input.closest('[data-slot="card-content"]')
      if (!card) {
        out.push(`${input.id}: card-content assente`)
        continue
      }
      const ir = input.getBoundingClientRect()
      const cr = card.getBoundingClientRect()
      if (ir.right > cr.right + tolerance) {
        out.push(`${input.id}: dx ${ir.right.toFixed(1)} > scheda ${cr.right.toFixed(1)}`)
      }
    }
    for (const [idA, idB] of pairs) {
      const a = document.getElementById(idA)
      const b = document.getElementById(idB)
      if (!a || !b) {
        out.push(`coppia ${idA}/${idB}: elemento assente`)
        continue
      }
      const ra = a.getBoundingClientRect()
      const rb = b.getBoundingClientRect()
      if (ra.right > rb.left + tolerance) {
        out.push(`sovrapposizione ${idA}/${idB}: ${ra.right.toFixed(1)} > ${rb.left.toFixed(1)}`)
      }
    }
    const cards = new Set(timeInputs.map((i) => i.closest('[data-slot="card-content"]')).filter(Boolean))
    for (const card of cards) {
      const cr = card.getBoundingClientRect()
      for (const btn of card.querySelectorAll('button')) {
        const br = btn.getBoundingClientRect()
        if (br.right > cr.right + tolerance) {
          out.push(`pulsante «${(btn.textContent ?? '').trim().slice(0, 40)}»: dx oltre scheda`)
        }
      }
    }
    return out
  }, tol)
  return {
    ok: failures.length === 0,
    misurato: failures.length ? failures.join('; ') : 'tutti i campi dentro scheda, nessuna sovrapposizione',
    atteso: 'nessuna uscita dalla scheda e nessuna sovrapposizione',
  }
}

export async function checkLoginCampi(page) {
  return await page.evaluate(() => {
    const email = document.querySelector('input[name=email]')
    const password = document.querySelector('input[name=password]')
    const form = document.querySelector('form')
    if (!email || !password || !form) return { ok: false, detail: 'elementi mancanti' }
    const ok =
      email.getAttribute('type') === 'email' &&
      email.getAttribute('autocomplete') === 'username' &&
      email.required &&
      password.getAttribute('type') === 'password' &&
      password.getAttribute('autocomplete') === 'current-password' &&
      password.required &&
      form.getAttribute('method')?.toLowerCase() === 'post' &&
      form.getAttribute('action') === '/api/users/login/app'
    return { ok, detail: `form ${form.getAttribute('action')}` }
  }).then((r) => ({
    ok: r.ok,
    misurato: r.detail,
    atteso: 'email/password + POST /api/users/login/app',
  }))
}

export async function checkGerarchiaLogin(page) {
  return await page
    .evaluate(() => {
      const google = [...document.querySelectorAll('a')].find((a) => a.textContent?.includes('Google'))
      const accedi = [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Accedi')
      if (!google || !accedi) return { ok: false, detail: 'elementi non trovati' }
      const bgG = getComputedStyle(google).backgroundColor
      const bgA = getComputedStyle(accedi).backgroundColor
      const primaryEl = document.querySelector('.bg-primary')
      const primaryBg = primaryEl ? getComputedStyle(primaryEl).backgroundColor : ''
      const primaryMatch = bgG === primaryBg || bgG === getComputedStyle(document.documentElement).getPropertyValue('--primary')
      return { ok: bgG !== bgA, bgG, bgA, primaryMatch }
    })
    .then((r) => ({
      ok: r.ok,
      misurato: typeof r.detail === 'string' ? r.detail : `Google ${r.bgG}, Accedi ${r.bgA}, primary≈Google:${r.primaryMatch}`,
      atteso: 'sfondi Google e Accedi diversi; Google ≈ primary',
    }))
}

export async function checkForgotTesti(page) {
  const data = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    desc: document.querySelector('main > div > div > p, main p')?.textContent?.trim(),
    labels: [...document.querySelectorAll('label')].map((l) => l.textContent?.trim()),
    button: [...document.querySelectorAll('button')].map((b) => b.textContent?.trim()).find((t) => t === 'Invia istruzioni'),
    links: [...document.querySelectorAll('main a')].map((a) => a.textContent?.trim()).filter(Boolean),
  }))
  const atteso = {
    h1: 'Password dimenticata',
    desc: 'Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.',
    labels: ['Email'],
    button: 'Invia istruzioni',
    links: ['Torna al login'],
  }
  const ok = JSON.stringify({ ...data, button: data.button }) === JSON.stringify(atteso)
  return { ok, misurato: JSON.stringify(data), atteso: JSON.stringify(atteso) }
}

export async function checkResetTesti(page) {
  const data = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    desc: document.querySelector('main h1')?.parentElement?.querySelector('p')?.textContent?.trim(),
    labels: [...document.querySelectorAll('label')].map((l) => l.textContent?.trim()),
    button: [...document.querySelectorAll('button')].find((b) => b.textContent?.includes('Aggiorna'))?.textContent?.trim(),
    links: [...document.querySelectorAll('main a')].map((a) => a.textContent?.trim()).filter(Boolean),
  }))
  const atteso = {
    h1: 'Nuova password',
    desc: 'Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.',
    labels: ['Nuova password'],
    button: 'Aggiorna password',
    links: ['Torna al login'],
  }
  const hasForm = await page.locator('input[name=password]').count()
  if (!hasForm) return { ok: true, misurato: 'senza modulo (stato senza-token)', atteso: 'solo con modulo' }
  const ok = data.h1 === atteso.h1 && data.desc === atteso.desc && data.button === atteso.button && JSON.stringify(data.links) === JSON.stringify(atteso.links)
  return { ok, misurato: JSON.stringify(data), atteso: JSON.stringify(atteso) }
}

export async function checkResetCampi(page) {
  return await page.evaluate(() => {
    const password = document.querySelector('input[name=password]')
    const token = document.querySelector('input[name=token]')
    const form = document.querySelector('form')
    if (!password || !form) return { ok: false, detail: 'modulo assente' }
    const ok =
      password.getAttribute('type') === 'password' &&
      password.getAttribute('autocomplete') === 'new-password' &&
      password.getAttribute('minlength') === '8' &&
      password.required &&
      token?.getAttribute('type') === 'hidden' &&
      token?.value === 'prova' &&
      form.getAttribute('method')?.toLowerCase() === 'post' &&
      form.getAttribute('action') === '/api/users/reset-password/app'
    return { ok, detail: `token=${token?.value}` }
  }).then((r) => ({ ok: r.ok, misurato: r.detail, atteso: 'password + hidden token + POST reset' }))
}

export async function checkVerifyTesti(page) {
  const data = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    links: [...document.querySelectorAll('main a')].map((a) => a.textContent?.trim()).filter(Boolean),
  }))
  const atteso = { h1: 'Conferma email', links: ['Vai al login'] }
  const ok = data.h1 === atteso.h1 && JSON.stringify(data.links) === JSON.stringify(atteso.links)
  return { ok, misurato: JSON.stringify(data), atteso: JSON.stringify(atteso) }
}

export async function checkAccFuoriShell(page) {
  const n = await page.locator('[data-slot=sidebar], [data-slot=sidebar-trigger], nav[aria-label="Percorso"]').count()
  return { ok: n === 0, misurato: `${n} elementi shell`, atteso: '0' }
}

export async function checkCollegamentiSottolineati(page) {
  const res = await page.evaluate(() => {
    const links = [...document.querySelectorAll('main .flex.flex-col.items-center a')]
    return links.map((a) => getComputedStyle(a).textDecorationLine)
  })
  const bad = res.filter((d) => !d.includes('underline'))
  return {
    ok: res.length > 0 && bad.length === 0,
    misurato: res.join(', ') || 'nessun link',
    atteso: 'underline su tutti i collegamenti sotto la scheda',
  }
}

export async function checkAccAvvisi(page) {
  const res = await page.evaluate(() => {
    const alerts = [...document.querySelectorAll('[role=alert], [role=status]')]
    if (!alerts.length) return { ok: true, detail: 'nessun avviso in pagina' }
    const bad = alerts.filter((el) => {
      const role = el.getAttribute('role')
      if (role !== 'alert' && role !== 'status') return true
      return !el.querySelector('svg')
    })
    return { ok: bad.length === 0, detail: `${alerts.length} avvisi, ${bad.length} senza svg/role` }
  })
  return { ok: res.ok, misurato: res.detail, atteso: 'role alert/status + icona svg' }
}

export async function checkAccColonna(page, profilo) {
  const w = profilo.larghezza
  const margin = w >= 768 ? 24 : 16
  const expected = Math.min(384, w - 2 * margin)
  const cardW = await page.evaluate(() => {
    const card = document.querySelector('[data-slot=card], .rounded-xl.border')
    return card ? card.getBoundingClientRect().width : 0
  })
  return {
    ok: withinTolerance(cardW, expected, 1),
    misurato: `${Math.round(cardW)} px`,
    atteso: `${expected} px (min(384, ${w}-2*${margin}))`,
  }
}

export async function checkAccMargine(page, profilo) {
  const left = await page.evaluate(() => {
    const card = document.querySelector('[data-slot=card], .rounded-xl.border')
    return card ? card.getBoundingClientRect().left : -1
  })
  const expected = profilo.larghezza >= 768 ? 24 : 16
  return {
    ok: withinTolerance(left, expected, 1.5),
    misurato: `${Math.round(left)} px`,
    atteso: `${expected} px`,
  }
}

export async function checkAccIcona(page) {
  const size = await page.evaluate(() => {
    const box = document.querySelector('main .size-10, main [class*="size-10"]')
    if (!box) return null
    const r = box.getBoundingClientRect()
    return { w: r.width, h: r.height }
  })
  if (!size) return { ok: false, misurato: 'icona non trovata', atteso: '40×40' }
  return {
    ok: withinTolerance(size.w, 40, 1) && withinTolerance(size.h, 40, 1),
    misurato: `${Math.round(size.w)}×${Math.round(size.h)}`,
    atteso: '40×40',
  }
}

export async function checkAccSpazi16(page) {
  const m = await page.evaluate(() => {
    const col = document.querySelector('main > div')
    const header = col?.querySelector(':scope > div:first-child')
    const card = col?.querySelector('[data-slot=card], .rounded-xl.border')
    const links = col?.querySelector(':scope > div:last-child')
    if (!header || !card) return null
    const gap1 = card.getBoundingClientRect().top - header.getBoundingClientRect().bottom
    let gap2 = null
    if (links && links !== card && links.querySelector('a')) {
      gap2 = links.getBoundingClientRect().top - card.getBoundingClientRect().bottom
    }
    return { gap1, gap2 }
  })
  if (!m) return { ok: false, misurato: 'layout non trovato', atteso: '16 px' }
  const ok1 = withinTolerance(m.gap1, 16, 1.5)
  const ok2 = m.gap2 == null || withinTolerance(m.gap2, 16, 1.5)
  return {
    ok: ok1 && ok2,
    misurato: `header→card ${Math.round(m.gap1)}px; card→link ${m.gap2 != null ? Math.round(m.gap2) : 'n/a'}px`,
    atteso: '16 px entrambe',
  }
}

export async function checkAccPaddingScheda(page) {
  const pad = await page.evaluate(() => {
    const card = document.querySelector('main [data-slot=card]')
    const inner = card?.querySelector('[data-slot=card-content]')
    if (!card || !inner) return null
    const first = inner.firstElementChild
    if (!first) return null
    return first.getBoundingClientRect().top - card.getBoundingClientRect().top
  })
  if (pad == null) return { ok: false, misurato: 'non misurato', atteso: '16 px' }
  return {
    ok: withinTolerance(pad, 16, 1.5),
    misurato: `${Math.round(pad)} px`,
    atteso: '16 px padding scheda',
  }
}

export async function checkAccCentratura(page) {
  const d = await page.evaluate(() => {
    const col = document.querySelector('main > div')
    if (!col) return null
    const r = col.getBoundingClientRect()
    const above = r.top
    const below = window.innerHeight - r.bottom
    return { diff: Math.abs(above - below) }
  })
  if (!d) return { ok: false, misurato: 'colonna non trovata', atteso: 'diff <= 96 px' }
  return {
    ok: d.diff <= 96,
    misurato: `|sopra-sotto|=${Math.round(d.diff)} px`,
    atteso: 'differenza assoluta <= 2*48 px',
  }
}

export async function checkHomeTesti(page, expected) {
  const data = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim()
    const desc = document.querySelector('main p')?.textContent?.trim()
    const cards = [...document.querySelectorAll('main a[href^="/app/"]')].map((a) => ({
      titolo: a.querySelector('.text-sm.font-medium')?.textContent?.trim(),
      desc: a.querySelector('.text-xs')?.textContent?.trim(),
      href: a.getAttribute('href'),
    }))
    return { h1, desc, cards }
  })
  const attesoOrder = (expected.schede ?? expected.schede_in_ordine ?? []).map((s) => ({
    titolo: s.titolo,
    desc: s.descrizione ?? s.desc,
    href: s.href,
  }))
  const ok =
    data.h1 === expected.h1 &&
    data.desc === expected.descrizione &&
    JSON.stringify(data.cards) === JSON.stringify(attesoOrder)
  return {
    ok,
    misurato: JSON.stringify(data),
    atteso: JSON.stringify({ h1: expected.h1, desc: expected.descrizione, cards: attesoOrder }),
  }
}

/** controlli-8.2 v4: la scheda Menù deve avere la riga di stato (dettaglio in controlli-6.6). */
export async function checkHomeRigheDiStato(page) {
  const menuCard = await page.evaluate(() => {
    const a = document.querySelector('main a[href="/app/menu"]')
    if (!a) return { found: false, hasRow: false, text: '' }
    const content = a.querySelector('[data-slot=card-content]')
    const status =
      content?.querySelector('[data-menu-home-status]') ??
      content?.querySelector('[data-slot=card-content] .text-sm.font-medium + .text-xs + *')
    const extraLines = content
      ? [...content.querySelectorAll(':scope > div > *')].filter(
          (el) => el.classList?.contains('text-sm') || el.classList?.contains('text-xs'),
        ).length
      : 0
    const text = (status?.textContent ?? '').replace(/\s+/g, ' ').trim()
    const hasRow = Boolean(text) || extraLines > 2
    return { found: true, hasRow, text }
  })
  if (!menuCard.found) {
    return { ok: false, misurato: 'scheda Menù assente', atteso: 'riga di stato sulla scheda Menù' }
  }
  return {
    ok: menuCard.hasRow,
    misurato: menuCard.hasRow ? `riga: ${menuCard.text.slice(0, 80)}` : 'nessuna riga sulla scheda Menù',
    atteso: 'la scheda Menù ha la riga di stato',
  }
}

export async function checkHomeColonne(page, profiloKey) {
  const cols = await page.evaluate(() => {
    const lefts = new Set()
    document.querySelectorAll('main a[href^="/app/"]').forEach((a) => {
      lefts.add(Math.round(a.getBoundingClientRect().left))
    })
    return lefts.size
  })
  const attesoMap = { 'telefono-390': 1, 'soglia-768': 2, 'tablet-820': 2, 'notebook-1280': 3 }
  const expected = attesoMap[profiloKey] ?? 1
  return { ok: cols === expected, misurato: `${cols} colonne`, atteso: `${expected}` }
}

/** D8 / A26: colonna home max 1024 px centrata; a 1280 riempie l'area contenuto; a 1920 si ferma a 1024. */
export async function checkHomeLarghezza(page, profiloKey, tol = 2) {
  const data = await page.evaluate(() => {
    const main = document.querySelector('[data-slot=sidebar-inset] main') ?? document.querySelector('main')
    const col = main?.querySelector('.max-w-5xl')
    if (!main || !col) return null
    const mr = main.getBoundingClientRect()
    const cr = col.getBoundingClientRect()
    return {
      colWidth: cr.width,
      mainWidth: mr.width,
      leftMargin: cr.left - mr.left,
      rightMargin: mr.right - cr.right,
    }
  })
  if (!data) {
    return { ok: false, misurato: 'colonna max-w-5xl non trovata', atteso: '≤1024 px centrata in main' }
  }
  const maxW = 1024
  const widthOk = data.colWidth <= maxW + tol
  const centerOk = Math.abs(data.leftMargin - data.rightMargin) <= tol * 2
  let profileOk = true
  let profileNote = ''
  if (profiloKey === 'notebook-1280') {
    const inner = data.mainWidth - data.leftMargin - data.rightMargin
    profileOk = withinTolerance(data.colWidth, inner, tol + 1)
    profileNote = `a 1280 col=${Math.round(data.colWidth)} px nell'area interna (${Math.round(inner)} px)`
  } else if (profiloKey === 'schermo-1920') {
    profileOk = withinTolerance(data.colWidth, maxW, tol + 1)
    profileNote = `a 1920 larghezza ≈${maxW} px`
  }
  const ok = widthOk && centerOk && profileOk
  const misurato = `col=${Math.round(data.colWidth)} main=${Math.round(data.mainWidth)} margini L/R=${Math.round(data.leftMargin)}/${Math.round(data.rightMargin)}; ${profileNote}`
  return {
    ok,
    misurato,
    atteso: '≤1024 px, centrata; 1280 riempie area; 1920 ferma a 1024',
  }
}

export async function checkShellBarraAlta(page) {
  const h = await page.evaluate(() => {
    const bar = document.querySelector('header')
    return bar ? bar.getBoundingClientRect().height : 0
  })
  return { ok: withinTolerance(h, 56, 1), misurato: `${Math.round(h)} px`, atteso: '56 px' }
}

export async function checkShellMargineContenuto(page, profiloKey) {
  const left = await page.evaluate(() => {
    const main = document.querySelector('[data-slot=sidebar-inset] main, main')
    const h1 = main?.querySelector('h1')
    if (!main || !h1) return -1
    return h1.getBoundingClientRect().left - main.getBoundingClientRect().left
  })
  const expected = { 'telefono-390': 16, 'soglia-768': 24, 'notebook-1280': 24 }[profiloKey] ?? 16
  const ok = withinTolerance(left, expected, 2)
  return {
    ok,
    avviso: true,
    misurato: `${Math.round(left)} px`,
    atteso: `${expected} px`,
  }
}

export async function checkShellSticky(page) {
  await page.evaluate(() => {
    const main = document.querySelector('main')
    if (!main) return
    const tall = document.createElement('div')
    tall.setAttribute('data-ui-verify', 'tall')
    tall.style.height = '2000px'
    main.appendChild(tall)
  })
  await page.evaluate(() => window.scrollBy(0, 600))
  await page.waitForTimeout(100)
  const top = await page.evaluate(() => document.querySelector('header')?.getBoundingClientRect().top ?? -1)
  await page.evaluate(() => {
    document.querySelector('[data-ui-verify="tall"]')?.remove()
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(100)
  return {
    ok: withinTolerance(top, 0, 0.5),
    misurato: `top header=${Math.round(top * 10) / 10}`,
    atteso: 'top = 0 dopo scroll 600px',
  }
}

export async function checkShellPassaggio768(page, profiloKey) {
  if (profiloKey === 'soglia-767') {
    const btn = await page.getByRole('button', { name: 'Apri o chiudi il menu' }).isVisible()
    const desktopW = await page.evaluate(() => {
      const bar = document.querySelector('[data-sidebar=sidebar]:not([data-mobile="true"])')
      if (!bar) return 0
      const r = bar.getBoundingClientRect()
      return r.width > 0 && r.left >= 0 ? Math.round(r.width) : 0
    })
    await openMobileSidebar(page)
    const panelW = await page.evaluate(() => {
      const sheet = document.querySelector('[data-sidebar=sidebar][data-mobile="true"]')
      return sheet ? Math.round(sheet.getBoundingClientRect().width) : 0
    })
    await page.keyboard.press('Escape')
    const ok = btn && desktopW < 200 && withinTolerance(panelW, 288, 4)
    return {
      ok,
      misurato: `desktopVis=${desktopW}px pannello=${panelW}px`,
      atteso: 'no barra fissa; pannello ~288px',
    }
  }
  const sw = await page.evaluate(() => {
    const bar = document.querySelector('[data-sidebar=sidebar]:not([data-mobile="true"])')
    return bar ? Math.round(bar.getBoundingClientRect().width) : 0
  })
  const ok = sw >= 250 && sw <= 262
  return { ok, misurato: `sidebar ${sw}px`, atteso: 'barra fissa ~256px a 768' }
}

export async function checkShellMenuVoci(page, navExpectations) {
  const data = await page.evaluate(() => {
    const groups = [...document.querySelectorAll('[data-sidebar="group-label"]')].map((g) => g.textContent?.trim())
    const itemsByGroup = {}
    document.querySelectorAll('[data-sidebar="group"]').forEach((g) => {
      const label = g.querySelector('[data-sidebar="group-label"]')?.textContent?.trim()
      const items = [...g.querySelectorAll('[data-sidebar="menu-button"] span')]
        .map((s) => s.textContent?.trim())
        .filter(Boolean)
      if (label) itemsByGroup[label] = items
    })
    const navLinks = document.querySelectorAll(
      '[data-sidebar="group"] [data-sidebar="menu-button"][href], [data-sidebar="group"] a[data-sidebar="menu-button"]',
    ).length
    return { groups, itemsByGroup, navLinks }
  })
  const attesoGroups = navExpectations?.navGroups?.map((g) => g.label) ?? ['Menù', 'Orari', 'Prenotazioni']
  const attesoItems = {}
  for (const g of navExpectations?.navGroups ?? []) {
    attesoItems[g.label] = g.items.map((i) => i.label)
  }
  const enabledCount =
    navExpectations?.navGroups?.reduce((n, g) => n + g.items.length, 0) ??
    Object.values(attesoItems).flat().length
  const ok =
    JSON.stringify(data.groups) === JSON.stringify(attesoGroups) &&
    JSON.stringify(data.itemsByGroup) === JSON.stringify(attesoItems) &&
    data.navLinks === enabledCount
  return {
    ok,
    misurato: JSON.stringify(data),
    atteso: JSON.stringify({ groups: attesoGroups, items: attesoItems, navLinks: enabledCount }),
  }
}

export async function checkShellBloccoInCima(page) {
  const data = await page.evaluate(() => {
    const btn = document.querySelector('[data-sidebar="header"] [data-sidebar="menu-button"]')
    const title = btn?.querySelector('.font-medium')?.textContent?.trim()
    const role = btn?.querySelector('.text-xs')?.textContent?.trim()
    const link = btn?.querySelector('a[href]') ?? btn?.closest('a')
    const href = link?.getAttribute('href')
    return { title, role, href }
  })
  const ok = data.title === 'Area App' && data.role === 'Manager' && (data.href === '/app' || data.href?.endsWith('/app'))
  return { ok, misurato: JSON.stringify(data), atteso: 'Area App, Manager, /app' }
}

export async function checkShellBloccoUtente(page, email) {
  const expectedInitials = initialsFromEmail(email)
  const data = await page.evaluate(() => {
    const footer = document.querySelector('[data-sidebar=footer]')
    const text = footer?.textContent ?? ''
    const initials = footer?.querySelector('[data-slot=avatar-fallback], .rounded-lg')?.textContent?.trim()
    return { text, initials }
  })
  const ok = data.text.includes(email.split('@')[0].slice(0, 3)) && data.initials === expectedInitials
  return {
    ok,
    misurato: `iniziali=${data.initials}, attese=${expectedInitials}`,
    atteso: 'email visibile + iniziali corrette',
  }
}

/** Conta quante volte il trigger menu mobile entra nel DOM (rimontaggi; possibile difetto app se dopo idratazione). */
export async function probeMobileMenuTriggerRemounts(page, observeMs = 2800) {
  const hydrationMs = 1200
  return page.evaluate(
    ({ ms, hydrationMs: hydrMs }) => {
      const label = 'Apri o chiudi il menu'
      let mountEvents = 0
      let postHydrationMountEvents = 0
      let hydrated = false
      setTimeout(() => {
        hydrated = true
      }, hydrMs)
      const findInNode = (root) => {
        if (root.nodeType !== 1) return null
        if (root.matches?.(`button[aria-label="${label}"]`)) return root
        return root.querySelector?.(`button[aria-label="${label}"]`)
      }
      const onAdded = (el) => {
        mountEvents += 1
        if (hydrated) postHydrationMountEvents += 1
      }
      return new Promise((resolve) => {
        const observer = new MutationObserver((mutations) => {
          for (const m of mutations) {
            for (const n of m.addedNodes) {
              const btn = findInNode(n)
              if (btn) onAdded(btn)
            }
          }
        })
        observer.observe(document.body, { childList: true, subtree: true })
        const existing = document.querySelector(`button[aria-label="${label}"]`)
        if (existing) onAdded(existing)
        setTimeout(() => {
          observer.disconnect()
          resolve({
            mountEvents,
            remounts: Math.max(0, mountEvents - 1),
            postHydrationRemounts: Math.max(0, postHydrationMountEvents - (hydrated ? 0 : 0)),
            postHydrationMountEvents,
            hydrationMs: hydrMs,
            observeMs: ms,
            triggerPresent: Boolean(document.querySelector(`button[aria-label="${label}"]`)),
          })
        }, ms)
      })
    },
    { ms: observeMs, hydrationMs },
  )
}

export async function waitForAppHydration(page, ms = 1500) {
  await page.waitForLoadState('domcontentloaded')
  await page.waitForFunction(
    () => document.querySelector('header') && document.querySelector('main'),
    { timeout: 20000 },
  )
  await page.waitForTimeout(ms)
}

export async function checkShellMenuUtente(page, { mobilePanelFirst = false, remountProbe = null } = {}) {
  try {
    await openUserMenu(page, { mobilePanelFirst })
  } catch (e) {
    const probe = remountProbe ? ` remounts=${JSON.stringify(remountProbe)}` : ''
    return {
      ok: false,
      misurato: `menu non apribile: ${e.message}${probe}`,
      atteso: 'Tema+Esci, no riga utente, icone tema; Admin assente',
      adminIcone: 'NON_PROVATO',
    }
  }
  const data = await page.evaluate(() => {
    const menu = document.querySelector('[role=menu]')
    const items = [...document.querySelectorAll('[role=menuitem], [role=menuitemradio]')].map((e) =>
      e.textContent?.trim(),
    )
    const adminItem = [...document.querySelectorAll('[role=menuitem]')].find((e) =>
      e.textContent?.includes('Admin'),
    )
    const userRowInMenu = Boolean(
      menu?.querySelector('[data-slot=avatar], [data-slot=avatar-fallback]') ||
        menu?.querySelector('[role=menuitem] [data-slot=avatar]') ||
        [...(menu?.querySelectorAll('[data-slot=dropdown-menu-label]') ?? [])].some((el) =>
          /@/.test(el.textContent ?? ''),
        ),
    )
    const themeLabels = ['Chiaro', 'Scuro', 'Sistema']
    const themeIcons = themeLabels.map((label) => {
      const el = [...document.querySelectorAll('[role=menuitemradio]')].find((e) => e.textContent?.trim() === label)
      const svgCount = el ? el.querySelectorAll('svg').length : 0
      return { label, svgCount }
    })
    const adminSvg = adminItem ? adminItem.querySelectorAll('svg').length : 0
    return { items, admin: Boolean(adminItem), userRowInMenu, themeIcons, adminSvg }
  })
  await page.keyboard.press('Escape')
  const hasTheme =
    data.items.some((t) => t === 'Chiaro') &&
    data.items.some((t) => t === 'Scuro') &&
    data.items.some((t) => t === 'Sistema')
  const hasEsci = data.items.some((t) => t === 'Esci')
  const themeIconsOk = data.themeIcons.every((t) => t.svgCount >= 1)
  let adminIcone = 'NON_PROVATO'
  if (data.admin) {
    adminIcone = data.adminSvg >= 2 ? 'OK' : 'FALLITO'
  }
  const ok = hasTheme && hasEsci && !data.admin && !data.userRowInMenu && themeIconsOk && adminIcone !== 'FALLITO'
  const probe = remountProbe ? ` remounts=${JSON.stringify(remountProbe)}` : ''
  const misurato = `voci=${JSON.stringify(data.items)}; rigaUtente=${data.userRowInMenu}; iconeTema=${JSON.stringify(data.themeIcons)}; iconeAdmin=${data.admin ? data.adminSvg : 'assente'}${probe}`
  return {
    ok,
    misurato,
    atteso: 'Tema+Esci, no riga utente nel menu, svg su Chiaro/Scuro/Sistema; Admin assente (icone Admin NON PROVATO)',
    adminIcone,
  }
}

/** Clic normale su voce tema con diagnostica completa se Playwright va in timeout. */
export async function clickMenuItemRadioNormal(page, label) {
  const locator = page.getByRole('menuitemradio', { name: label })
  const callLog = []
  try {
    await locator.waitFor({ state: 'visible', timeout: 15000 })
    callLog.push(`visible: sì (attesa esplicita 15s)`)
  } catch (e) {
    callLog.push(`visible: no dopo 15s (${e.message})`)
    return { ok: false, callLog: callLog.join(' · '), diag: await radioClickDiagnostics(page, locator, label) }
  }
  try {
    await locator.click({ timeout: 30000 })
    return { ok: true, callLog: 'click completato (timeout 30s, senza force)' }
  } catch (e) {
    const diag = await radioClickDiagnostics(page, locator, label)
    return {
      ok: false,
      callLog: `${e.message}`,
      diag,
    }
  }
}

async function radioClickDiagnostics(page, locator, label) {
  const visible = await locator.isVisible().catch(() => false)
  const enabled = await locator.isEnabled().catch(() => false)
  const box = await locator.boundingBox().catch(() => null)
  let stable = 'non misurato'
  try {
    await locator.waitFor({ state: 'visible', timeout: 2000 })
    await page.waitForTimeout(100)
    stable = 'visibile (non verificato stabilità animazione)'
  } catch {
    stable = 'non stabile/visibile'
  }
  let covered = 'n/a'
  if (box) {
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2
    covered = await page.evaluate(
      ({ cx, cy, label }) => {
        const top = document.elementFromPoint(cx, cy)
        const radio = [...document.querySelectorAll('[role=menuitemradio]')].find((e) => e.textContent?.trim() === label)
        const same = top === radio || radio?.contains(top) || top?.contains(radio)
        return same ? 'punto centrale sul radio' : `coperto da ${top?.tagName}${top?.className ? '.' + String(top.className).split(' ')[0] : ''}`
      },
      { cx, cy, label },
    )
  }
  return { label, visible, enabled, stable, box, covered }
}

export async function checkShellTemaScelta(page, baseUrl) {
  for (const [label, cookie, dark] of [
    ['Scuro', 'dark', true],
    ['Chiaro', 'light', false],
    ['Sistema', 'system', false],
  ]) {
    await openUserMenu(page)
    const click = await clickMenuItemRadioNormal(page, label)
    if (!click.ok) {
      const diag = click.diag
      const mis = `click «${label}» fallito · log: ${click.callLog} · visibile=${diag?.visible} abilitato=${diag?.enabled} stabile=${diag?.stable} copertura=${diag?.covered}`
      return { ok: false, misurato: mis, atteso: 'click normale su menuitemradio', evidenza: click.callLog }
    }
    await page.waitForTimeout(150)
    const hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    const cookies = await page.context().cookies(baseUrl)
    const themeCookie = cookies.find((c) => c.name === 'app-theme')?.value
    if (hasDark !== dark && label !== 'Sistema') {
      return { ok: false, misurato: `${label}: dark=${hasDark}`, atteso: `dark=${dark}` }
    }
    if (themeCookie !== cookie) {
      return { ok: false, misurato: `cookie=${themeCookie}`, atteso: cookie }
    }
    await page.reload({ waitUntil: 'networkidle' })
    const hasDark2 = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    const checked = await openUserMenuAndGetChecked(page, label)
    if (label !== 'Sistema' && hasDark2 !== dark) {
      return { ok: false, misurato: `dopo reload ${label} dark=${hasDark2}`, atteso: `dark=${dark}` }
    }
    if (!checked) {
      return { ok: false, misurato: `radio ${label} non selezionato dopo reload`, atteso: 'selezionato' }
    }
    await page.keyboard.press('Escape')
  }
  return { ok: true, misurato: 'Scuro/Chiaro/Sistema ok', atteso: 'classe html, cookie, persistenza' }
}

async function openUserMenuAndGetChecked(page, label) {
  await openUserMenu(page)
  const checked = await page.getByRole('menuitemradio', { name: label }).getAttribute('aria-checked')
  return checked === 'true'
}

async function emitShellPercorsoPiattiDiagnostic(page, report) {
  if (!report || shellPercorsoPiattiDiagnosticDone) return
  const w = page.viewportSize()?.width ?? 0
  if (w < 768) return
  shellPercorsoPiattiDiagnosticDone = true
  const d = await page.evaluate(() => {
    const sidebar = document.querySelector('[data-sidebar="sidebar"]')
    const buttons = [...(sidebar ?? document).querySelectorAll('[data-sidebar="menu-button"]')]
    const piatti = buttons.find((btn) => (btn.textContent || '').includes('Piatti'))
    if (!piatti) return { found: false }
    const attrs = {}
    for (const a of piatti.attributes) attrs[a.name] = a.value
    return { found: true, outerHTML: piatti.outerHTML.slice(0, 8000), attrs }
  })
  if (!d.found) {
    report.anomalie.push('shell-percorso-voce-attiva diagnostica: pulsante «Piatti» non trovato @1280px')
    return
  }
  report.anomalie.push(
    `shell-percorso-voce-attiva diagnostica (Piatti @1280px): attributi=${JSON.stringify(d.attrs)}; outerHTML=${d.outerHTML}`,
  )
}

export async function checkShellPercorsoVoceAttiva(page, path, { report, percorsoMap } = {}) {
  const map = percorsoMap ?? PERCORSO_ATTESO_FALLBACK
  const atteso = map[path]
  if (!atteso) return { ok: false, misurato: `path ${path} sconosciuto`, atteso: '—' }
  const w = page.viewportSize()?.width ?? 1280
  const openedMobile = w < 768
  if (path === '/app/menu' && !openedMobile) {
    await emitShellPercorsoPiattiDiagnostic(page, report)
  }
  if (openedMobile && atteso.active && !(await isMobileSidebarOpen(page))) {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(150)
    const nav = await openMobileSidebar(page)
    if (!nav.opened && !(await isMobileSidebarOpen(page))) {
      await page.getByRole('button', { name: 'Apri o chiudi il menu' }).click({ timeout: 5000 }).catch(() => {})
    }
    await page.locator('[data-sidebar="sidebar"][data-mobile="true"]').waitFor({ state: 'visible', timeout: 10000 })
  }
  const data = await page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Percorso"]')
    const crumbs = nav
      ? [...nav.querySelectorAll('[data-slot=breadcrumb-item]')].map((li) => li.textContent?.trim()).filter(Boolean)
      : []
    const sidebars = [...document.querySelectorAll('[data-sidebar="sidebar"]')]
    const sidebar =
      sidebars.find((el) => {
        const r = el.getBoundingClientRect()
        return r.width > 50 && r.height > 50
      }) ??
      document.querySelector('[data-sidebar="sidebar"][data-mobile="true"]') ??
      document.querySelector('[data-sidebar="sidebar"]')
    const scope = sidebar ?? document
    const active = []
    scope.querySelectorAll('[data-sidebar="menu"] [data-sidebar="menu-button"]').forEach((btn) => {
      const isActive =
        btn.hasAttribute('data-active') ||
        btn.getAttribute('aria-current') === 'page'
      if (!isActive) return
      const label = btn.querySelector('span')?.textContent?.trim() || btn.textContent?.trim()
      if (label) active.push(label)
    })
    return { crumbs, active }
  })
  if (openedMobile) {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)
  }
  const crumbOk = atteso.breadcrumb.every((p) => data.crumbs.join(' ').includes(p))
  const activeOk = atteso.active === null ? data.active.length === 0 : data.active.includes(atteso.active)
  return {
    ok: crumbOk && activeOk,
    misurato: `crumbs=${data.crumbs.join('›')}; active=${data.active.join(',')}`,
    atteso: JSON.stringify(atteso),
  }
}

export async function checkShellNomiAccessibili(page) {
  const text = await page.evaluate(
    () =>
      document.body.innerText +
      ' ' +
      [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')).join(' '),
  )
  const found = ENGLISH_A11Y.filter((t) => text.includes(t))
  return { ok: found.length === 0, misurato: found.join(', ') || 'nessuno', atteso: 'nessun testo inglese elencato' }
}

export async function openUserMenu(page, { mobilePanelFirst = false } = {}) {
  const w = page.viewportSize()?.width ?? 1280
  const trigger = page.locator('[data-sidebar="footer"] [data-sidebar="menu-button"]').first()
  if (w < 768 || mobilePanelFirst) {
    const sheet = page.locator('[data-sidebar="sidebar"][data-mobile="true"]')
    if (!(await sheet.isVisible().catch(() => false))) {
      await openMobileSidebar(page)
      await page.waitForTimeout(400)
    }
  } else if (!(await trigger.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: 'Apri o chiudi il menu' }).click()
    await page.waitForTimeout(350)
  }
  await trigger.waitFor({ state: 'visible', timeout: 15000 })
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click({ timeout: 30000 })
  await page.getByRole('menuitemradio', { name: 'Chiaro' }).waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
  await page.waitForTimeout(200)
}

export async function isMobileSidebarOpen(page) {
  return page.locator('[data-sidebar="sidebar"][data-mobile="true"]').isVisible().catch(() => false)
}

/** Apre il pannello solo se chiuso e il trigger è visibile (es. non coperto da modal). */
export async function openMobileSidebar(page) {
  if (await isMobileSidebarOpen(page)) return { opened: false, reason: 'già aperto' }
  const trigger = page.getByRole('button', { name: 'Apri o chiudi il menu' })
  const visible = await trigger.isVisible().catch(() => false)
  if (!visible) {
    return { opened: false, reason: 'trigger non visibile (modal o barra?)' }
  }
  await trigger.click()
  await page.waitForTimeout(200)
  return { opened: true, reason: 'click' }
}

export async function closeMobileSidebarIfOpen(page) {
  if (!(await isMobileSidebarOpen(page))) return
  const trigger = page.getByRole('button', { name: 'Apri o chiudi il menu' })
  if (await trigger.isVisible().catch(() => false)) {
    await trigger.click()
    await page.waitForTimeout(200)
    return
  }
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
}

export async function consoleShellInteractions(page, profiloKey) {
  if (profiloKey === 'telefono-390') {
    await openMobileSidebar(page)
    await page.waitForTimeout(350)
  }
  await openUserMenu(page)
  for (const theme of ['Chiaro', 'Scuro', 'Sistema']) {
    await page.getByRole('menuitemradio', { name: theme }).click()
    await page.waitForTimeout(120)
  }
  await page.keyboard.press('Escape')
  if (profiloKey === 'telefono-390') await page.keyboard.press('Escape')
}
