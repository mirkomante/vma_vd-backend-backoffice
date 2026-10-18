#!/usr/bin/env node
/**
 * Prova mirata P1: due vini con paesi X/Y disabilitati — diagnosi trigger Paese.
 * Uso: node scripts/ui-verify/probe-p1-vini-dual-country.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { chromium } from '@playwright/test'

import { loadControlli } from './lib/cli.mjs'
import { resolveBuildReuse, markBuildSuccess } from './lib/build-cache.mjs'
import { PROD_PORT, prodBaseUrl } from './lib/ports.mjs'
import { acquireUiVerifyLock, releaseUiVerifyLock } from './lib/lock.mjs'
import { waitForPortFree } from './lib/ensure-ports.mjs'
import { waitForCatalogEditSheetReady } from './lib/catalog-ui-helpers.mjs'
import {
  menuCreateCatalogItems,
  menuDeleteVerifyPrefix,
  menuFindCatalogItem,
  menuListWineOriginTaxonomies,
  menuPatchCatalogDoc,
  menuPayloadRun,
  menuSetCountryEnabled,
} from './lib/menu-payload.mjs'

const ROOT = join(import.meta.dirname, '../..')
const OUT_DIR = join(ROOT, 'docs/design/verifica/esiti/2026-10-18-V3bis')
const IMG_DIR = join(OUT_DIR, 'img')
const WINE_A = 'verify-ui-vini-off-a'
const WINE_B = 'verify-ui-vini-off-b'
const STEP_MS_LIMIT = 3 * 60 * 1000
const TOTAL_MS_LIMIT = 10 * 60 * 1000

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function parsePayloadStdout(stdout) {
  const line = stdout.trim().split('\n').find((l) => l.startsWith('{'))
  if (!line) throw new Error(`Output JSON mancante: ${stdout.slice(0, 120)}`)
  return JSON.parse(line)
}

async function waitForUrl(baseUrl, ms = 180000) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(baseUrl, { redirect: 'manual' })
      if (res.status < 500) return
    } catch {
      /* retry */
    }
    await sleep(800)
  }
  throw new Error(`Server non raggiungibile: ${baseUrl}`)
}

function startProcess(cmd, args, env = {}) {
  return spawn(cmd, args, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function profileContextOptions(controlli, key) {
  const p = controlli.profili[key]
  return {
    viewport: { width: p.larghezza, height: p.altezza },
    deviceScaleFactor: p.scala,
    isMobile: p.tocco,
    hasTouch: p.tocco,
  }
}

async function loginApp(page, email, password) {
  await page.goto('/app/login', { waitUntil: 'networkidle' })
  await page.fill('input[name=email]', email)
  await page.fill('input[name=password]', password)
  await page.getByRole('button', { name: 'Accedi' }).click()
  await page.waitForURL(/\/app\/?$/, { timeout: 20000 })
}

function countryFromDoc(doc) {
  const c = doc?.country
  if (!c) return { id: null, name: null }
  if (typeof c === 'object') return { id: c.id ?? null, name: c.name ?? null }
  return { id: c, name: null }
}

function resolveCountryByName(name) {
  const tax = menuListWineOriginTaxonomies()
  const row = tax.countries?.find((c) => c.name === name)
  if (!row) return null
  const wasEnabled = row.enabled !== false
  const res = menuPayloadRun('set-country-enabled', [name, wasEnabled ? 'true' : 'false'])
  if (!res.ok || res.id == null) return null
  return { name, id: res.id, enabled: wasEnabled }
}

async function readCountryFieldDom(page) {
  const trigger = page.locator('#wine-field-country')
  await trigger.scrollIntoViewIfNeeded()
  let triggerText = ''
  try {
    triggerText = (await trigger.innerText()).trim()
  } catch {
    triggerText = ''
  }
  const domValue = await page.evaluate(() => {
    const triggerEl = document.getElementById('wine-field-country')
    if (!triggerEl) return { valueId: null, attrs: {} }
    const attrs = {}
    for (const a of triggerEl.attributes) attrs[a.name] = a.value
    const root = triggerEl.closest('[data-slot="select-root"]') ?? triggerEl.parentElement
    const hidden = root?.querySelector('input[type=hidden], select')
    return {
      valueId:
        triggerEl.getAttribute('data-value') ??
        triggerEl.getAttribute('value') ??
        hidden?.value ??
        null,
      attrs,
    }
  })
  return { triggerText: triggerText.trim(), ...domValue }
}

async function readOpenListbox(page) {
  await page.locator('#wine-field-country').click()
  const listbox = page.getByRole('listbox')
  await listbox.waitFor({ state: 'visible', timeout: 12000 })
  const options = await page.evaluate(() => {
    const lb = document.querySelector('[role=listbox]')
    if (!lb) return []
    return [...lb.querySelectorAll('[role=option]')].map((el) => ({
      text: (el.textContent ?? '').trim(),
      selected:
        el.getAttribute('aria-selected') === 'true' ||
        el.getAttribute('data-selected') === 'true' ||
        el.getAttribute('data-state') === 'checked',
    }))
  })
  await page.keyboard.press('Escape')
  return options
}

async function probeWine(page, wineName, imgSlug) {
  const t0 = Date.now()
  await page.goto('/app/menu/wines', { waitUntil: 'networkidle' })
  const search = page.getByPlaceholder(/cerca/i)
  if ((await search.count()) > 0) {
    await search.fill(wineName)
    await sleep(600)
  }
  const rowCount = await page.locator(`[aria-label^="${wineName},"]`).count()
  const listRows = await page.locator('main table tbody tr, main [aria-label*=","]').count()
  await page.getByRole('button', { name: `Modifica ${wineName}` }).click({ timeout: 25000 })
  await waitForCatalogEditSheetReady(page, 'wine-field-name')
  const nameVal = await page.locator('#wine-field-name').inputValue()
  const sheetTitle = (await page.locator('[data-slot=sheet-title]').innerText()).trim()
  let subtitle = ''
  try {
    subtitle = (await page.locator('[data-slot=sheet-header] p.text-muted-foreground').innerText()).trim()
  } catch {
    subtitle = ''
  }
  const field = await readCountryFieldDom(page)
  const shotPath = join(IMG_DIR, `${imgSlug}-paese-trigger-telefono-390-chiaro.png`)
  await page.locator('#wine-field-country').screenshot({ path: shotPath })
  const options = await readOpenListbox(page)
  const selectedOpts = options.filter((o) => o.selected).map((o) => o.text)
  if (Date.now() - t0 > STEP_MS_LIMIT) {
    throw new Error(`timeout passo UI per ${wineName} (>3 min)`)
  }
  return {
    rowCount,
    listRowsApprox: listRows,
    nameVal,
    sheetTitle,
    subtitle: subtitle.trim(),
    field,
    options: options.map((o) => o.text),
    selectedInListbox: selectedOpts,
    screenshot: shotPath.replace(ROOT + '/', ''),
  }
}

async function main() {
  const started = Date.now()
  mkdirSync(IMG_DIR, { recursive: true })
  const report = { started: new Date().toISOString(), wines: {}, countries: {}, conclusions: [] }
  let prodChild = null
  let browser = null
  let testEmail = null
  let testPassword = null
  const prevEnabled = {}

  acquireUiVerifyLock(ROOT)
  try {
    const { controlli } = loadControlli('controlli-6.6.json')
    const buildDecision = resolveBuildReuse(ROOT)
    if (!buildDecision.reuse) {
      const build = spawnSync('pnpm', ['build'], { cwd: ROOT, stdio: 'inherit' })
      if (build.status !== 0) throw new Error('pnpm build fallito')
      markBuildSuccess(ROOT, buildDecision.fingerprint)
    }
    prodChild = startProcess('pnpm', ['start'], { PORT: String(PROD_PORT) })
    const baseUrl = prodBaseUrl()
    await waitForUrl(baseUrl)

    testPassword = `Aa1${randomBytes(16).toString('base64url')}`
    const prov = spawnSync('pnpm', ['payload', 'run', 'scripts/ui-verify/provision-user.ts', '--', 'create'], {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, UI_VERIFY_USER_PASSWORD: testPassword },
    })
    if (prov.status !== 0) throw new Error(prov.stderr || prov.stdout)
    testEmail = parsePayloadStdout(prov.stdout).email

    const countryX = resolveCountryByName('Filippine')
    const countryY = resolveCountryByName('Vietnam')
    if (!countryX?.id || !countryY?.id) throw new Error('Paesi X/Y non trovati in tassonomia')

    report.countries = {
      X: { name: countryX.name, id: countryX.id },
      Y: { name: countryY.name, id: countryY.id },
    }

    menuDeleteVerifyPrefix()
    menuCreateCatalogItems(testEmail, 'wines', [{ name: WINE_A }, { name: WINE_B }])
    menuPatchCatalogDoc(testEmail, 'wines', WINE_A, { country: countryX.id })
    menuPatchCatalogDoc(testEmail, 'wines', WINE_B, { country: countryY.id })

    for (const c of [countryX, countryY]) {
      prevEnabled[c.name] = c.enabled !== false
      menuSetCountryEnabled(c.name, false)
    }

    const apiBefore = {}
    for (const [label, wineName] of [['A', WINE_A], ['B', WINE_B]]) {
      const item = menuFindCatalogItem(testEmail, 'wines', wineName)
      const co = countryFromDoc(item.doc)
      apiBefore[label] = {
        wineId: item.doc?.id ?? null,
        wineName,
        country: co,
      }
    }
    report.apiBeforeOpen = apiBefore

    browser = await chromium.launch()
    const ctx = await browser.newContext({
      ...profileContextOptions(controlli, 'telefono-390'),
      colorScheme: 'light',
      baseURL: baseUrl,
    })
    const page = await ctx.newPage()
    await loginApp(page, testEmail, testPassword)

    report.wines.A = await probeWine(page, WINE_A, 'p1-prova-vini-off-a')
    report.wines.B = await probeWine(page, WINE_B, 'p1-prova-vini-off-b')

    for (const key of ['A', 'B']) {
      const w = report.wines[key]
      const api = apiBefore[key].country
      const trig = w.field.triggerText
      const savedName = api.name ?? String(api.id)
      let line
      if (trig === savedName || (savedName && trig.includes(savedName))) {
        line = `vino ${key}: il trigger mostra il paese salvato (${trig})`
      } else if (/^\d+$/.test(trig)) {
        line = `vino ${key}: mostra l'identificativo (${trig})`
      } else {
        line = `vino ${key}: mostra un altro paese (${trig}); atteso ${savedName}; righe nome=${w.rowCount}; sottotitolo=${w.subtitle}; elenco≈${w.listRowsApprox}`
      }
      report.conclusions.push(line)
    }

    await ctx.close()
  } finally {
    try {
      for (const [name, was] of Object.entries(prevEnabled)) {
        if (name) menuSetCountryEnabled(name, was)
      }
      menuDeleteVerifyPrefix()
    } catch (e) {
      report.cleanupError = e.message
    }
    if (testEmail) {
      spawnSync('pnpm', ['payload', 'run', 'scripts/ui-verify/provision-user.ts', '--', 'delete', testEmail], {
        cwd: ROOT,
        encoding: 'utf8',
      })
    }
    if (browser) await browser.close()
    if (prodChild) {
      prodChild.kill('SIGTERM')
      await sleep(1500)
      await waitForPortFree(PROD_PORT, 20000).catch(() => {})
    }
    releaseUiVerifyLock(ROOT)
    report.durationMs = Date.now() - started
    if (report.durationMs > TOTAL_MS_LIMIT) report.overBudget = true
    writeFileSync(join(OUT_DIR, 'p1-prova-dual-country.json'), JSON.stringify(report, null, 2))
  }

  console.log(JSON.stringify(report, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
