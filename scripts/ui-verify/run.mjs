#!/usr/bin/env node
/**
 * Lanciatore verifica UI Area App v3 — docs/design/verifica/README.md
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { chromium, webkit } from '@playwright/test'

import { loadAuthMessages } from './lib/messages.mjs'
import { auditScreenshotThemeHashes, initReport } from './lib/report.mjs'
import { DEV_PORT, PROD_PORT, devBaseUrl, prodBaseUrl } from './lib/ports.mjs'
import { ensurePortsFree, SIM_PORT, waitForPortFree } from './lib/ensure-ports.mjs'
import {
  parseCli,
  loadControlli,
  timeoutMsForAmbiente,
  RunBudget,
  RunTimeoutError,
  logProgress,
} from './lib/cli.mjs'
import { resolveBuildReuse, markBuildSuccess } from './lib/build-cache.mjs'
import { acquireUiVerifyLock, releaseUiVerifyLock } from './lib/lock.mjs'
import {
  auditResidualProcesses,
  closeAllBrowsers,
  stopServers,
  trackBrowser,
} from './lib/cleanup.mjs'
import { guardExtraMs, screenBudgetMs } from './lib/timeouts.mjs'
import { createRunContext } from './lib/perimeter.mjs'
import {
  LAUNCHER_VERSION,
  SEGNAPOSTO_H1,
  checkAmbiente,
  checkScrollOrizzontale,
  checkTemaClasse,
  checkToccoMinimo,
  checkAltezzaMouse,
  installNoLampoObserver,
  checkNoLampo,
  checkTemaCambioSistema,
  checkLoginTexts,
  checkLoginLinkDestinazioni,
  checkLoginCampi,
  checkGerarchiaLogin,
  checkForgotTesti,
  checkResetTesti,
  checkResetCampi,
  checkVerifyTesti,
  checkAccFuoriShell,
  checkCollegamentiSottolineati,
  checkAccAvvisi,
  checkAccColonna,
  checkAccMargine,
  checkAccIcona,
  checkAccSpazi16,
  checkAccPaddingScheda,
  checkAccCentratura,
  checkHomeTesti,
  checkHomeRigheDiStato,
  checkHomeColonne,
  buildPercorsoAttesoMap,
  isSegnapostoMain,
  checkHomeLarghezza,
  checkShellBarraAlta,
  checkShellMargineContenuto,
  checkShellSticky,
  checkShellPassaggio768,
  checkShellMenuVoci,
  checkShellBloccoInCima,
  checkShellBloccoUtente,
  checkShellMenuUtente,
  checkShellTemaScelta,
  checkShellPercorsoVoceAttiva,
  checkShellNomiAccessibili,
  openUserMenu,
  openMobileSidebar,
  consoleShellInteractions,
  probeMobileMenuTriggerRemounts,
  waitForAppHydration,
} from './lib/engine.mjs'
import {
  runOrariChecks,
  runOrariDevSimulations,
  runOrariConsole,
  runOrariCampiDentroSchedaDevBrowsers,
} from './lib/run-orari.mjs'
import {
  runMenuChecks,
  runMenuComuniChecks,
  runMenuDevSimulations,
  runMenuConsole,
  buildShellHomeExpected,
} from './lib/run-menu.mjs'
import { loadNavExpectations } from './lib/lib-readers.mjs'
import { auditControlliWiring } from './lib/controlli-handlers.mjs'

const ROOT = join(import.meta.dirname, '../..')
const DATA = '2026-10-18'

/** @type {import('./lib/perimeter.mjs').ReturnType<typeof createRunContext>} */
let runCtx
/** @type {Record<string, unknown>} */
let CONTROLLI
/** @type {RunBudget | null} */
let budget = null
let controlliBasename = 'controlli-8.2.json'
let guardTimer = null
/** @type {import('node:child_process').ChildProcess | null} */
let devChildGlobal = null
/** @type {import('node:child_process').ChildProcess | null} */
let prodChildGlobal = null
const ONLINE_BASE = (process.env.BASE_URL ?? 'https://vma-vd-backend-backoffice-git-437074136999.europe-west1.run.app').replace(
  /\/$/,
  '',
)

const messages = loadAuthMessages()
const C1_PROFILES = new Set(['telefono-360', 'telefono-390', 'notebook-1280'])
const C2_PROFILES = new Set(['telefono-390', 'tablet-820'])
const SHOT_PROFILES = ['telefono-390', 'notebook-1280']
const SHOT_TEMI = ['chiaro', 'scuro']

let testUser = { email: null }
let testPassword = null
/** @type {ReturnType<typeof loadNavExpectations> | null} */
let navExpectations = null

function menuScreensInScope() {
  return (
    runCtx.screenIncluded('home') ||
    runCtx.screenIncluded('navigazione') ||
    runCtx.screenIncluded('piatti') ||
    runCtx.screenIncluded('vini') ||
    runCtx.screenIncluded('distillati') ||
    runCtx.screenIncluded('bevande')
  )
}

function ensureNavExpectations() {
  if (!navExpectations) navExpectations = loadNavExpectations()
  return navExpectations
}

function gitCommit() {
  const r = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' })
  return r.status === 0 ? r.stdout.trim().slice(0, 12) : 'unknown'
}

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

function profileContextOptions(key) {
  const p = CONTROLLI.profili[key]
  return {
    viewport: { width: p.larghezza, height: p.altezza },
    deviceScaleFactor: p.scala,
    isMobile: p.tocco,
    hasTouch: p.tocco,
  }
}

async function newPage(browser, profiloKey, temaKey, baseUrl) {
  const tema = CONTROLLI.temi[temaKey]
  const ctx = await browser.newContext({
    ...profileContextOptions(profiloKey),
    colorScheme: tema.colorScheme,
    baseURL: baseUrl,
  })
  await ctx.addCookies([{ name: 'app-theme', value: tema['cookie_app-theme'], url: baseUrl }])
  const page = await ctx.newPage()
  return { ctx, page, tema }
}

function addRow(report, row) {
  if (row.id && runCtx && !runCtx.shouldRun(row.id)) return
  budget?.check()
  report.add({
    id: row.id,
    schermata: row.schermata ?? '—',
    profiloTema: row.profiloTema ?? '—',
    esito: row.esito,
    misurato: row.misurato ?? '—',
    atteso: row.atteso ?? '—',
    evidenza: row.evidenza ?? '—',
  })
}

function progressStep(schermata, stato, profilo, tema) {
  logProgress([schermata, stato, profilo, tema])
  budget?.check()
}

function resultToEsito(r, gravitaAvviso = false) {
  if (r.avviso || gravitaAvviso) return r.ok ? 'OK' : 'AVVISO'
  return r.ok ? 'OK' : 'FALLITO'
}

async function screenshot(page, report, name, temaKey) {
  const expectedDark = CONTROLLI.temi[temaKey].html_dark
  const hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  if (hasDark !== expectedDark) {
    report.anomalie.push(
      `screenshot ${name}: html.dark=${hasDark} ma combinazione ${temaKey} richiede dark=${expectedDark}`,
    )
  }
  const path = join(report.imgDir, `${name}.png`)
  await page.screenshot({ path, fullPage: true })
  const hash = createHash('sha256').update(readFileSync(path)).digest('hex')
  report.screenshotHashes.push({ name, temaKey, hash })
}

function messageFromAvviso(testoDa) {
  const name = testoDa.split(' ')[0]
  return messages[name] ?? null
}

async function loginApp(page, baseUrl, email, password) {
  await page.goto('/app/login', { waitUntil: 'networkidle' })
  await page.fill('input[name=email]', email)
  await page.fill('input[name=password]', password)
  await page.getByRole('button', { name: 'Accedi' }).click()
  await page.waitForURL(/\/app\/?$/, { timeout: 20000 })
}

async function provisionUser() {
  testPassword = `Aa1${randomBytes(16).toString('base64url')}`
  const r = spawnSync('pnpm', ['payload', 'run', 'scripts/ui-verify/provision-user.ts', '--', 'create'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, UI_VERIFY_USER_PASSWORD: testPassword },
  })
  if (r.status !== 0) throw new Error(`provision-user create fallito: ${r.stderr || r.stdout}`)
  testUser.email = parsePayloadStdout(r.stdout).email
}

async function deleteUser() {
  if (!testUser.email) return
  spawnSync('pnpm', ['payload', 'run', 'scripts/ui-verify/provision-user.ts', '--', 'delete', testUser.email], {
    cwd: ROOT,
    encoding: 'utf8',
  })
  testUser.email = null
  testPassword = null
}

function visitableAccessStates() {
  const out = []
  for (const s of CONTROLLI.schermate) {
    if (!s.stati || s.id === 'shell' || s.id === 'pagine-accesso-comuni') continue
    if (!runCtx.screenIncluded(s.id)) continue
    for (const st of s.stati) {
      if (st.da_visitare === false) continue
      if (st.stato_prova?.includes('facoltativo')) continue
      if ((st.query ?? '').includes('<token')) continue
      out.push({
        screenId: s.id,
        statoId: st.id,
        path: `${s.percorso}${st.query ?? ''}`,
        stato: st,
        modulo: st.modulo,
      })
    }
  }
  return out
}

function attachConsoleListeners(page) {
  const bag = { errors: [], warnings: [], failed: [] }
  page.on('console', (msg) => {
    if (msg.type() === 'error') bag.errors.push(msg.text())
    if (msg.type() === 'warning') bag.warnings.push(msg.text())
  })
  page.on('pageerror', (e) => bag.errors.push(String(e)))
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('favicon')) bag.failed.push(`${res.status()} ${res.url()}`)
  })
  return bag
}

function consoleEsito(bag) {
  const ok = bag.errors.length === 0 && bag.warnings.length === 0 && bag.failed.length === 0
  return {
    ok,
    misurato: `err:${bag.errors.length} warn:${bag.warnings.length} http:${bag.failed.length}`,
    evidenza: [...bag.errors, ...bag.warnings, ...bag.failed].slice(0, 3).join(' | ') || '—',
  }
}

async function runConsoleClean(baseUrl, report, browserVersion) {
  if (!runCtx.shouldRun('CONSOLE')) return
  const browser = await chromium.launch()
  trackBrowser(browser)
  const profiles = runCtx.profiliConsole()
  const accessPaths = [
    ...new Set(visitableAccessStates().map((s) => s.path)),
  ].filter((p) => p && p.startsWith('/') && !p.includes('<token'))

  const shellPaths = runCtx.screenIncluded('shell')
    ? ['/app', '/app/menu', '/app/hours', '/app/reservations']
    : []

  for (const profiloKey of profiles) {
    for (const path of accessPaths) {
      progressStep(path, 'caricamento', profiloKey, 'chiaro')
      const { ctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
      const bag = attachConsoleListeners(page)
      await page.goto(path, { waitUntil: 'networkidle' })
      await sleep(300)
      const c = consoleEsito(bag)
      addRow(report, {
        id: 'CONSOLE',
        schermata: path,
        profiloTema: `${profiloKey}/chiaro/Chromium ${browserVersion}`,
        esito: c.ok ? 'OK' : 'FALLITO',
        misurato: c.misurato,
        atteso: 'zero error/warning/pageerror/richieste fallite',
        evidenza: c.evidenza,
      })
      await ctx.close()
    }

    if (!testUser.email || shellPaths.length === 0) continue
    const { ctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    for (const p of shellPaths) {
      progressStep(p, 'shell+menu', profiloKey, 'chiaro')
      const bag = attachConsoleListeners(page)
      await page.goto(p, { waitUntil: 'networkidle' })
      await consoleShellInteractions(page, profiloKey)
      await sleep(300)
      const c = consoleEsito(bag)
      addRow(report, {
        id: 'CONSOLE',
        schermata: `${p} (shell+menu)`,
        profiloTema: `${profiloKey}/chiaro/Chromium ${browserVersion}`,
        esito: c.ok ? 'OK' : 'FALLITO',
        misurato: c.misurato,
        atteso: 'zero error/warning/pageerror/richieste fallite',
        evidenza: c.evidenza,
      })
    }
    await ctx.close()
  }
  await browser.close()
}

async function runCommonAccess(page, report, sch, pt, path, profiloKey) {
  const profilo = CONTROLLI.profili[profiloKey]

  if (C1_PROFILES.has(profiloKey)) {
    const r = await checkScrollOrizzontale(page)
    addRow(report, { id: 'C1', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }
  if (C2_PROFILES.has(profiloKey)) {
    const r = await checkToccoMinimo(page)
    addRow(report, { id: 'C2', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }
  if (profiloKey === 'notebook-1280') {
    const r = await checkAltezzaMouse(page)
    addRow(report, { id: 'C2-mouse', schermata: sch, profiloTema: pt, esito: resultToEsito(r, true), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }

  let r = await checkAccFuoriShell(page)
  addRow(report, { id: 'acc-fuori-shell', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  r = await checkCollegamentiSottolineati(page)
  addRow(report, { id: 'acc-collegamenti-sottolineati', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  r = await checkAccAvvisi(page)
  addRow(report, { id: 'acc-avvisi', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })

  if (['telefono-390', 'tablet-820', 'notebook-1280'].includes(profiloKey)) {
    r = await checkAccColonna(page, profilo)
    addRow(report, { id: 'acc-colonna', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }
  if (['telefono-360', 'telefono-390'].includes(profiloKey)) {
    r = await checkAccMargine(page, profilo)
    addRow(report, { id: 'acc-margine', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }
  r = await checkAccIcona(page)
  addRow(report, { id: 'acc-icona', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  r = await checkAccSpazi16(page)
  addRow(report, { id: 'acc-spazi-16', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  r = await checkAccPaddingScheda(page)
  addRow(report, { id: 'acc-padding-scheda', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  r = await checkAccCentratura(page)
  addRow(report, { id: 'acc-centratura', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
}

async function runAccessScreenChecks(page, report, screenId, statoId, sch, pt, path, profiloKey, temaKey, stato) {
  await runCommonAccess(page, report, sch, pt, path, profiloKey)

  const r3 = await checkTemaClasse(page, CONTROLLI.temi[temaKey].html_dark)
  addRow(report, { id: 'C3', schermata: sch, profiloTema: pt, esito: resultToEsito(r3), misurato: r3.misurato, atteso: r3.atteso, evidenza: path })

  if (['scuro', 'sistema-scuro'].includes(temaKey) && runCtx.shouldRun('C3-no-lampo')) {
    await installNoLampoObserver(page)
    await page.reload({ waitUntil: 'networkidle' })
    const r = await checkNoLampo(page)
    addRow(report, { id: 'C3-no-lampo', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }

  if (screenId === 'login') {
    const title = await page.title()
    addRow(report, {
      id: 'login-titolo-documento',
      schermata: sch,
      profiloTema: pt,
      esito: title === 'Accesso · Area App' ? 'OK' : 'FALLITO',
      misurato: title,
      atteso: 'Accesso · Area App',
      evidenza: path,
    })
    if (statoId === 'iniziale') {
      let r = await checkLoginTexts(page)
      addRow(report, { id: 'login-testi', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
      r = await checkGerarchiaLogin(page)
      addRow(report, { id: 'login-gerarchia', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
      r = await checkLoginLinkDestinazioni(page)
      addRow(report, { id: 'login-link-destinazioni', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
      r = await checkLoginCampi(page)
      addRow(report, { id: 'login-campi', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
    }
  }
  if (screenId === 'forgot') {
    const title = await page.title()
    addRow(report, {
      id: 'forgot-titolo-documento',
      schermata: sch,
      profiloTema: pt,
      esito: title === 'Accesso · Area App' ? 'OK' : 'FALLITO',
      misurato: title,
      atteso: 'Accesso · Area App',
      evidenza: path,
    })
    if (statoId === 'iniziale') {
      const r = await checkForgotTesti(page)
      addRow(report, { id: 'forgot-testi', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
    }
  }
  if (screenId === 'reset') {
    if (statoId !== 'senza-token') {
      const r = await checkResetTesti(page)
      addRow(report, { id: 'reset-testi', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
    }
    if (['iniziale', 'link-scaduto'].includes(statoId)) {
      const r = await checkResetCampi(page)
      addRow(report, { id: 'reset-campi', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
    }
  }
  if (screenId === 'verify') {
    const r = await checkVerifyTesti(page)
    addRow(report, { id: 'verify-testi', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }

  if (stato.avviso?.testo_da) {
    const expected = messageFromAvviso(stato.avviso.testo_da)
    if (expected) {
      const body = await page.locator('main').innerText()
      addRow(report, {
        id: `avviso-${screenId}-${statoId}`,
        schermata: sch,
        profiloTema: pt,
        esito: body.includes(expected) ? 'OK' : 'FALLITO',
        misurato: body.includes(expected) ? 'testo presente' : 'testo assente',
        atteso: expected.slice(0, 50),
        evidenza: path,
      })
    }
  }
}

async function runAmbienteCheck(baseUrl, report, browserVersion) {
  const browser = await chromium.launch()
  trackBrowser(browser)
  const { ctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
  await page.goto('/app/login', { waitUntil: 'networkidle' })
  const r = await checkAmbiente(page)
  addRow(report, {
    id: 'AMBIENTE',
    schermata: '/app/login',
    profiloTema: `notebook-1280/chiaro/Chromium ${browserVersion}`,
    esito: r.ok ? 'OK' : 'FALLITO',
    misurato: r.misurato,
    atteso: r.atteso,
    evidenza: r.selector ? `selettore: ${r.selector}` : '—',
  })
  if (!r.ok) {
    report.invalidRun = true
    report.anomalie.push(
      `AMBIENTE fallito: indicatore dev Next presente (${r.selector}). Esiti di misura NON VALIDI finché prod non gira su porta libera separata da dev.`,
    )
  }
  await ctx.close()
  await browser.close()
  return r.ok
}

async function runLocaleProd(baseUrl, report, opts = {}) {
  const browser = await chromium.launch()
  trackBrowser(browser)
  const browserVersion = await browser.version()
  report.meta.browsers = `Chromium ${browserVersion}`

  if (!opts.skipAmbienteCheck && runCtx.shouldRun('AMBIENTE')) {
    await runAmbienteCheck(baseUrl, report, browserVersion)
  }

  if (runCtx.shouldRun('C9')) {
  const c9 = spawnSync('pnpm', ['ui:check'], { cwd: ROOT, encoding: 'utf8' })
  addRow(report, {
    id: 'C9',
    schermata: '—',
    profiloTema: '—',
    esito: c9.status === 0 ? 'OK' : 'FALLITO',
    misurato: `exit ${c9.status}`,
    atteso: 'exit 0',
    evidenza: c9.status === 0 ? 'pnpm ui:check' : (c9.stdout || c9.stderr).slice(0, 200),
  })
  }

  if (runCtx.shouldRun('verify-link-valido')) {
    report.addNonProvato('verify-link-valido', 'facoltativo: token reale monouso non ottenuto')
  }
  if (runCtx.shouldRun('shell-admin-link')) {
    report.addNonProvato('shell-admin-link', 'NON PROVABILE con utente solo App (adminRole none)')
  }

  if (menuScreensInScope() || controlliBasename.includes('6.6')) {
    runMenuComuniChecks(report, runCtx, addRow, { ambiente: 'locale-prod' })
  }

  const accessScreens = CONTROLLI.schermate.filter((s) => s.fuori_dalla_shell && runCtx.screenIncluded(s.id))
  const profiliAll = runCtx.profiliAccess()
  const temiAll = runCtx.temiKeys()

  if (accessScreens.length > 0) {
    report.replacePacchetto('accesso')
    report.pacchettoDefault = 'accesso'
  }

  for (const screen of accessScreens) {
    for (const stato of screen.stati) {
      if (stato.da_visitare === false) continue
      if (stato.stato_prova?.includes('facoltativo')) {
        report.addNonProvato(`${screen.id}/${stato.id}`, stato.stato_prova)
        continue
      }
      const path = `${screen.percorso}${stato.query ?? ''}`
      for (const temaKey of temiAll) {
        for (const profiloKey of profiliAll) {
          progressStep(screen.id, stato.id, profiloKey, temaKey)
          const { ctx, page } = await newPage(browser, profiloKey, temaKey, baseUrl)
          await page.goto(path, { waitUntil: 'networkidle' })
          const sch = `${screen.id}/${stato.id}`
          const pt = `${profiloKey}/${temaKey}`
          await runAccessScreenChecks(page, report, screen.id, stato.id, sch, pt, path, profiloKey, temaKey, stato)
          if (SHOT_PROFILES.includes(profiloKey) && SHOT_TEMI.includes(temaKey)) {
            await screenshot(page, report, `${screen.id}-${stato.id}-${profiloKey}-${temaKey}`, temaKey)
          }
          await ctx.close()
        }
      }
    }
  }

  if (runCtx.screenIncluded('reset') && runCtx.shouldRun('reset-senza-token-vuoto')) {
    progressStep('reset', 'senza-token', 'telefono-390', 'chiaro')
    const { ctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await page.goto('/app/login/reset', { waitUntil: 'networkidle' })
    const n = await page.locator('main input:not([type=hidden]), main button, main form').count()
    addRow(report, {
      id: 'reset-senza-token-vuoto',
      schermata: 'reset/senza-token',
      profiloTema: 'telefono-390/chiaro',
      esito: n === 0 ? 'OK' : 'FALLITO',
      misurato: `${n}`,
      atteso: '0',
      evidenza: '/app/login/reset',
    })
    await ctx.close()
  }

  if (runCtx.shouldRun('C3-cambio-sistema')) {
    progressStep('login', 'C3-cambio-sistema', 'notebook-1280', 'sistema')
    const { ctx, page } = await newPage(browser, 'notebook-1280', 'sistema-chiaro', baseUrl)
    const r = await checkTemaCambioSistema(page, baseUrl)
    addRow(report, {
      id: 'C3-cambio-sistema',
      schermata: 'login',
      profiloTema: 'notebook-1280/sistema',
      esito: resultToEsito(r),
      misurato: r.misurato,
      atteso: r.atteso,
      evidenza: 'emulateMedia prefers-color-scheme',
    })
    await ctx.close()
  }

  if (runCtx.screenIncluded('orari')) {
    report.replacePacchetto('orari')
    report.pacchettoDefault = 'orari'
    for (const id of ['orari-errore-server', 'orari-errore-caricamento']) {
      if (runCtx.shouldRun(id)) {
        report.addNonProvato(
          id,
          'simulazione APP_HOURS_DEV_SIMULATE_* solo su locale-dev (server separato porta 3200)',
        )
      }
    }
    const orariCtx = {
      browser,
      baseUrl,
      report,
      runCtx,
      CONTROLLI,
      newPage,
      loginApp,
      testUser,
      testPassword,
      addRow,
      progressStep,
      resultToEsito,
      screenshot,
      SHOT_PROFILES,
      SHOT_TEMI,
    }
    await runOrariChecks(orariCtx)
  }

  if (menuScreensInScope()) {
    report.prepareMenuPackageRerun(runCtx)
    report.pacchettoDefault = 'menu'
    const nav = ensureNavExpectations()
    await runMenuChecks({
      browser,
      baseUrl,
      report,
      runCtx,
      CONTROLLI,
      newPage,
      loginApp,
      testUser,
      testPassword,
      addRow,
      progressStep,
      resultToEsito,
      screenshot,
      SHOT_PROFILES,
      SHOT_TEMI,
      navJson: nav,
      ambiente: 'locale-prod',
    })
  }

  const shell = CONTROLLI.schermate.find((s) => s.id === 'shell')
  if (runCtx.screenIncluded('shell')) {
    report.replacePacchetto('shell')
    report.pacchettoDefault = 'shell'
  }
  if (!runCtx.screenIncluded('shell') || !shell) {
    await browser.close()
    report.meta.browsers = `Chromium ${browserVersion}`
    return
  }

  const percorsoMap = buildPercorsoAttesoMap(ensureNavExpectations())
  const shellHomeExpected = buildShellHomeExpected(CONTROLLI, navExpectations)
  const segnapostoPercorsi = new Set(
    shell.controlli?.find((c) => c.id === 'shell-segnaposto')?.percorsi ?? ['/app/reservations'],
  )

  for (const g of shell.guardia) {
    if (!runCtx.shouldRun(g.id)) continue
    for (const da of Array.isArray(g.da) ? g.da : [g.da]) {
      progressStep('shell', `guardia ${g.id}`, 'notebook-1280', 'chiaro')
      const { ctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
      await page.goto(da, { waitUntil: 'networkidle' })
      const ok = page.url().includes('/app/login')
      addRow(report, {
        id: g.id,
        schermata: `guardia ${da}`,
        profiloTema: 'notebook-1280/chiaro',
        esito: ok ? 'OK' : 'FALLITO',
        misurato: page.url(),
        atteso: g.a,
        evidenza: da,
      })
      await ctx.close()
    }
  }

  const profiliShell = runCtx.profiliShell()
  for (const stato of shell.stati) {
    for (const temaKey of temiAll) {
      for (const profiloKey of profiliShell) {
        progressStep('shell', stato.id, profiloKey, temaKey)
        const { ctx, page } = await newPage(browser, profiloKey, temaKey, baseUrl)
        const pt = `${profiloKey}/${temaKey}`
        const sch = `shell/${stato.id}`
        try {
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await page.goto(stato.percorso, { waitUntil: 'networkidle' })

        if (C1_PROFILES.has(profiloKey)) {
          const r = await checkScrollOrizzontale(page)
          addRow(report, { id: 'C1', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }
        if (C2_PROFILES.has(profiloKey)) {
          let r = await checkToccoMinimo(page)
          addRow(report, { id: 'C2', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
          if (profiloKey === 'telefono-390') {
            await openMobileSidebar(page)
            r = await checkToccoMinimo(page)
            addRow(report, { id: 'C2', schermata: `${sch} (menu aperto)`, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: 'menu' })
          }
          await openUserMenu(page)
          r = await checkToccoMinimo(page)
          addRow(report, { id: 'C2', schermata: `${sch} (menu utente)`, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: 'menu utente' })
          await page.keyboard.press('Escape')
          if (profiloKey === 'telefono-390') await page.keyboard.press('Escape')
        }
        if (profiloKey === 'notebook-1280') {
          const r = await checkAltezzaMouse(page)
          addRow(report, { id: 'C2-mouse', schermata: sch, profiloTema: pt, esito: resultToEsito(r, true), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }

        let r = await checkTemaClasse(page, CONTROLLI.temi[temaKey].html_dark)
        addRow(report, { id: 'C3', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })

        if (stato.id === 'home' && temaKey === 'chiaro') {
          r = await checkHomeTesti(page, shellHomeExpected)
          addRow(report, { id: 'home-testi', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
          if (runCtx.shouldRun('home-righe-di-stato')) {
            r = await checkHomeRigheDiStato(page)
            addRow(report, { id: 'home-righe-di-stato', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
          }
          r = await checkHomeColonne(page, profiloKey)
          addRow(report, { id: 'home-colonne', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }

        if (['telefono-390', 'soglia-768', 'notebook-1280'].includes(profiloKey)) {
          r = await checkShellBarraAlta(page)
          addRow(report, { id: 'shell-barra-alta', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }
        if (
          ['telefono-390', 'soglia-768', 'notebook-1280'].includes(profiloKey) &&
          stato.percorso !== '/app/menu'
        ) {
          r = await checkShellMargineContenuto(page, profiloKey)
          addRow(report, { id: 'shell-margine-contenuto', schermata: sch, profiloTema: pt, esito: resultToEsito(r, true), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }
        if (['telefono-390', 'notebook-1280'].includes(profiloKey) && stato.id === 'home') {
          r = await checkShellSticky(page)
          addRow(report, { id: 'shell-sticky', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }
        if (['soglia-767', 'soglia-768'].includes(profiloKey) && stato.id === 'home') {
          r = await checkShellPassaggio768(page, profiloKey)
          addRow(report, { id: 'shell-passaggio-768', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }
        if (profiloKey === 'notebook-1280' && stato.id === 'home' && temaKey === 'chiaro') {
          r = await checkShellMenuVoci(page, ensureNavExpectations())
          addRow(report, { id: 'shell-menu-voci', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
          r = await checkShellBloccoInCima(page)
          addRow(report, { id: 'shell-blocco-in-cima', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
          r = await checkShellBloccoUtente(page, testUser.email)
          addRow(report, { id: 'shell-blocco-utente', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: testUser.email })
        }
        if (stato.id === 'home' && temaKey === 'chiaro' && ['notebook-1280', 'telefono-390'].includes(profiloKey)) {
          let remountProbe = null
          if (profiloKey === 'telefono-390') {
            await waitForAppHydration(page)
            remountProbe = await probeMobileMenuTriggerRemounts(page)
            report.anomalie.push(
              `shell-menu trigger telefono-390: mountEvents=${remountProbe.mountEvents} remounts=${remountProbe.remounts} postHydration=${remountProbe.postHydrationMountEvents} (observe ${remountProbe.observeMs}ms, hydration ${remountProbe.hydrationMs}ms)`,
            )
            if (remountProbe.postHydrationMountEvents > 1) {
              report.anomalie.push(
                `shell-menu trigger: rimontato dopo idratazione (${remountProbe.postHydrationMountEvents} mount post-hydration) — possibile difetto app`,
              )
            }
          }
          r = await checkShellMenuUtente(page, {
            mobilePanelFirst: profiloKey === 'telefono-390',
            remountProbe,
          })
          addRow(report, {
            id: 'shell-menu-utente',
            schermata: sch,
            profiloTema: pt,
            esito: resultToEsito(r),
            misurato: r.misurato,
            atteso: r.atteso,
            evidenza: stato.percorso,
          })
          if (r.adminIcone === 'NON_PROVATO') {
            addRow(report, {
              id: 'shell-menu-utente',
              schermata: `${sch} (icone Admin)`,
              profiloTema: pt,
              esito: 'NON PROVATO',
              misurato: 'voce «Vai all\'Admin» assente con utente manager',
              atteso: 'due icone svg (pannello + freccia esterna) se presente',
              evidenza: 'A24; utente di prova senza canAccessAdminPanel',
            })
          }
        }
        if (stato.id === 'home' && runCtx.shouldRun('home-larghezza') && profiloKey === 'notebook-1280') {
          const r = await checkHomeLarghezza(page, profiloKey, 2)
          addRow(report, {
            id: 'home-larghezza',
            schermata: sch,
            profiloTema: pt,
            esito: resultToEsito(r),
            misurato: r.misurato,
            atteso: r.atteso,
            evidenza: stato.percorso,
          })
        }
        r = await checkShellPercorsoVoceAttiva(page, stato.percorso, { report, percorsoMap })
        addRow(report, { id: 'shell-percorso-voce-attiva', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })

        r = await checkShellNomiAccessibili(page)
        addRow(report, { id: 'shell-nomi-accessibili', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })

        if (
          stato.id !== 'home' &&
          temaKey === 'chiaro' &&
          profiloKey === 'telefono-390' &&
          runCtx.shouldRun('shell-segnaposto') &&
          segnapostoPercorsi.has(stato.percorso)
        ) {
          const h1 = await page.locator('h1').innerText()
          const desc = await page.locator('main p').first().innerText()
          const expH1 = SEGNAPOSTO_H1[stato.percorso]
          const isPlaceholder = await isSegnapostoMain(page)
          addRow(report, {
            id: 'shell-segnaposto',
            schermata: sch,
            profiloTema: pt,
            esito: isPlaceholder && h1 === expH1 ? 'OK' : 'FALLITO',
            misurato: `${h1} / ${desc.slice(0, 40)}`,
            atteso: `${expH1} + descrizione segnaposto`,
            evidenza: stato.percorso,
          })
        }

        if (stato.id === 'home' && SHOT_PROFILES.includes(profiloKey) && SHOT_TEMI.includes(temaKey)) {
          await page.goto(stato.percorso, { waitUntil: 'networkidle' })
          await page.keyboard.press('Escape')
          await screenshot(page, report, `shell-${stato.id}-${profiloKey}-${temaKey}`, temaKey)
          if (profiloKey === 'telefono-390') {
            await openMobileSidebar(page)
            await screenshot(page, report, `shell-home-menu-aperto-${profiloKey}-${temaKey}`, temaKey)
          }
          await openUserMenu(page, { mobilePanelFirst: profiloKey === 'telefono-390' })
          await page.getByRole('menuitemradio', { name: 'Chiaro' }).waitFor({ state: 'visible', timeout: 10000 })
          await screenshot(page, report, `shell-home-menu-utente-${profiloKey}-${temaKey}`, temaKey)
          await page.keyboard.press('Escape')
          if (profiloKey === 'telefono-390') await page.keyboard.press('Escape')
        }
        if (stato.id === 'segnaposto-menu' && SHOT_PROFILES.includes(profiloKey) && SHOT_TEMI.includes(temaKey)) {
          await screenshot(page, report, `shell-segnaposto-menu-${profiloKey}-${temaKey}`, temaKey)
        }
        } catch (err) {
          report.anomalie.push(`shell ${sch} ${pt}: ${err.message}`)
          addRow(report, {
            id: 'runtime-shell',
            schermata: sch,
            profiloTema: pt,
            esito: 'FALLITO',
            misurato: err.message,
            atteso: 'iterazione completata',
            evidenza: stato.percorso,
          })
        }
        await ctx.close()
      }
    }
  }

  if (runCtx.shouldRun('home-larghezza') && CONTROLLI.profili['schermo-1920']) {
    for (const temaKey of temiAll) {
      progressStep('shell', 'home-larghezza', 'schermo-1920', temaKey)
      const { ctx, page } = await newPage(browser, 'schermo-1920', temaKey, baseUrl)
      const pt = `schermo-1920/${temaKey}`
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await page.goto('/app', { waitUntil: 'networkidle' })
      const r = await checkHomeLarghezza(page, 'schermo-1920', 2)
      addRow(report, {
        id: 'home-larghezza',
        schermata: 'shell/home',
        profiloTema: pt,
        esito: resultToEsito(r),
        misurato: r.misurato,
        atteso: r.atteso,
        evidenza: '/app',
      })
      if (temaKey === 'chiaro') {
        await screenshot(page, report, `shell-home-schermo-1920-${temaKey}`, temaKey)
      }
      await ctx.close()
    }
  }

  if (runCtx.shouldRun('shell-tema-scelta')) {
    progressStep('shell', 'tema-scelta', 'notebook-1280', 'chiaro')
    const { ctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
    try {
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await page.goto('/app', { waitUntil: 'networkidle' })
      const r = await checkShellTemaScelta(page, baseUrl)
      addRow(report, {
        id: 'shell-tema-scelta',
        schermata: 'shell/home',
        profiloTema: 'notebook-1280/chiaro',
        esito: resultToEsito(r),
        misurato: r.misurato,
        atteso: r.atteso,
        evidenza: r.evidenza ?? 'menu utente (contesto isolato)',
      })
    } finally {
      await ctx.close()
    }
  }

  auditScreenshotThemeHashes(report)

  if (runCtx.runWebKitProdDiagnosis()) {
    await probeWebKitProdLoginCookies(baseUrl, report)
  }

  if (runCtx.shouldRun('shell-uscita')) {
    progressStep('shell', 'uscita', 'notebook-1280', 'chiaro')
    const { ctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    const logoutPromise = page.waitForResponse((res) => res.url().includes('/app/logout') && res.request().method() === 'POST')
    await openUserMenu(page)
    await page.getByRole('menuitem', { name: 'Esci' }).click()
    const logoutRes = await logoutPromise
    const loc = logoutRes.headers()['location'] ?? ''
    const locOk = loc === '/app/login' || (loc.startsWith('http') && !loc.includes('0.0.0.0'))
    await page.waitForURL('**/app/login**')
    const cookies = await ctx.cookies()
    const token = cookies.find((c) => c.name === 'payload-token')
    const tokenGone = !token || token.value === ''
    await page.goto('/app', { waitUntil: 'networkidle' })
    const backLogin = page.url().includes('/app/login')
    const act = spawnSync('pnpm', ['payload', 'run', 'scripts/ui-verify/provision-user.ts', '--', 'activity-log', testUser.email], {
      cwd: ROOT,
      encoding: 'utf8',
    })
    const actOk = act.status === 0 && parsePayloadStdout(act.stdout).found
    addRow(report, {
      id: 'shell-uscita',
      schermata: 'shell/home',
      profiloTema: 'notebook-1280/chiaro',
      esito: logoutRes.status() === 303 && locOk && backLogin && tokenGone && actOk ? 'OK' : 'FALLITO',
      misurato: `POST ${logoutRes.status()} Location:${loc} token:${tokenGone} /app→login:${backLogin} log:${actOk}`,
      atteso: '303, Location relativo, login finale, cookie assente, activity logout',
      evidenza: page.url(),
    })
    await ctx.close()
  }

  await browser.close()
  report.meta.browsers = `Chromium ${browserVersion}`
}

async function probeWebKitProdLoginCookies(baseUrl, report) {
  const wk = await webkit.launch()
  trackBrowser(wk)
  const wkVer = await wk.version()
  const setCookies = []
  try {
    const { ctx, page } = await newPage(wk, 'telefono-390', 'chiaro', baseUrl)
    page.on('response', (res) => {
      if (res.url().includes('/api/users/login') && res.request().method() === 'POST') {
        const sc = res.headers()['set-cookie']
        if (sc) setCookies.push(sc)
      }
    })
    await page.goto('/app/login', { waitUntil: 'networkidle' })
    await page.fill('input[name=email]', testUser.email)
    await page.fill('input[name=password]', testPassword)
    await page.getByRole('button', { name: 'Accedi' }).click()
    await sleep(3000)
    const finalUrl = page.url()
    const cookies = await ctx.cookies()
    const token = cookies.find((c) => c.name === 'payload-token')
    const tokenDesc = token
      ? `presente secure=${token.secure} httpOnly=${token.httpOnly} sameSite=${token.sameSite}`
      : 'assente nel contesto browser'
    const setDesc = setCookies.length ? setCookies.join(' | ') : '(nessun Set-Cookie catturato sulla risposta login)'
    report.anomalie.push(
      `WebKit ${wkVer} su ${baseUrl} (diagnosi login prod): URL finale=${finalUrl}; payload-token: ${tokenDesc}; Set-Cookie login: ${setDesc}`,
    )
    await ctx.close()
  } catch (e) {
    report.anomalie.push(`WebKit diagnosi login prod fallita: ${e.message}`)
  }
  await wk.close()
}

async function runWebkitEssential(baseUrl, report) {
  if (!runCtx.runWebkitEssential || !runCtx.shouldRun('webkit-giro-essenziale')) return null
  progressStep('shell', 'webkit-essenziale', 'telefono-390', 'chiaro')
  const wk = await webkit.launch()
  trackBrowser(wk)
  const wkVer = await wk.version()
  const { ctx, page } = await newPage(wk, 'telefono-390', 'chiaro', baseUrl)
  let wkOk = false
  let misurato = ''
  try {
    await loginApp(page, baseUrl, testUser.email, testPassword)
    const onApp = /\/app\/?$/.test(new URL(page.url()).pathname)
    await page.goto('/app', { waitUntil: 'networkidle' })
    await openMobileSidebar(page)
    await openUserMenu(page, { mobilePanelFirst: true })
    wkOk = onApp && page.url().includes('/app')
    misurato = wkOk ? `login→/app OK (${page.url()})` : `URL dopo login: ${page.url()}`
  } catch (e) {
    misurato = e.message
  }
  addRow(report, {
    id: 'webkit-giro-essenziale',
    schermata: 'shell/home',
    profiloTema: `telefono-390/chiaro/WebKit ${wkVer}`,
    esito: wkOk ? 'OK' : 'FALLITO',
    misurato,
    atteso: 'login, home, menu, menu utente (locale-dev)',
    evidenza: wkVer,
  })
  await ctx.close()
  await wk.close()
  return wkVer
}

async function runOnline(report) {
  const browser = await chromium.launch()
  trackBrowser(browser)
  const browserVersion = await browser.version()
  await runAmbienteCheck(ONLINE_BASE, report, browserVersion)
  await browser.close()

  const r1 = await fetch(`${ONLINE_BASE}/app/login`)
  const html1 = await r1.text()
  addRow(report, {
    id: 'on1',
    schermata: '/app/login',
    profiloTema: '—',
    esito: r1.status === 200 && html1.includes('Area App') ? 'OK' : 'FALLITO',
    misurato: `${r1.status}`,
    atteso: '200 + h1 Area App',
    evidenza: ONLINE_BASE,
  })
  const r2 = await fetch(`${ONLINE_BASE}/app`, { redirect: 'manual' })
  const loc2 = r2.headers.get('location') ?? ''
  addRow(report, {
    id: 'on2',
    schermata: '/app',
    profiloTema: '—',
    esito: r2.status >= 300 && r2.status < 400 && loc2.includes('/app/login') && !loc2.includes('0.0.0.0') ? 'OK' : 'FALLITO',
    misurato: `${r2.status} → ${loc2}`,
    atteso: 'redirect /app/login',
    evidenza: ONLINE_BASE,
  })
  const r3 = await fetch(`${ONLINE_BASE}/app/logout`, { method: 'POST', redirect: 'manual' })
  const loc3 = r3.headers.get('location') ?? ''
  const setCookie = r3.headers.get('set-cookie') ?? ''
  addRow(report, {
    id: 'on3',
    schermata: 'POST /app/logout',
    profiloTema: '—',
    esito: r3.status === 303 && !loc3.includes('0.0.0.0') && /payload-token/i.test(setCookie) ? 'OK' : 'FALLITO',
    misurato: `${r3.status} Location:${loc3}`,
    atteso: '303 + Set-Cookie payload-token',
    evidenza: ONLINE_BASE,
  })
  const r4 = await fetch(`${ONLINE_BASE}/app/login/reset`)
  const html4 = await r4.text()
  const count4 = (html4.match(/<main[\s\S]*?<\/main>/i)?.[0]?.match(/<input|<button|<form/gi) ?? []).length
  addRow(report, {
    id: 'on4',
    schermata: '/app/login/reset',
    profiloTema: '—',
    esito: count4 === 0 ? 'OK' : 'FALLITO',
    misurato: `${count4}`,
    atteso: '0',
    evidenza: ONLINE_BASE,
  })
  const r5 = await fetch(`${ONLINE_BASE}/app/login/reset?token=prova&resetFailed=1`)
  const html5 = await r5.text()
  addRow(report, {
    id: 'on5',
    schermata: 'reset token+resetFailed',
    profiloTema: '—',
    esito: html5.includes('name="password"') && html5.includes(messages.GENERIC_RESET_FAILURE_MESSAGE.slice(0, 20)) ? 'OK' : 'FALLITO',
    misurato: 'alert+campo',
    atteso: 'avviso e password',
    evidenza: ONLINE_BASE,
  })
  const r6 = await fetch(`${ONLINE_BASE}/app/login/verify`)
  const html6 = await r6.text()
  addRow(report, {
    id: 'on6',
    schermata: '/app/login/verify',
    profiloTema: '—',
    esito: r6.status === 200 && html6.includes(messages.GENERIC_VERIFY_FAILURE_MESSAGE.slice(0, 25)) ? 'OK' : 'FALLITO',
    misurato: `${r6.status}`,
    atteso: '200 + messaggio verify',
    evidenza: ONLINE_BASE,
  })
  report.meta.browsers = `fetch; AMBIENTE Chromium ${browserVersion}`
}

function makeReport(ambiente, commit) {
  return initReport({
    ambiente,
    data: DATA,
    commit,
    launcherVersion: LAUNCHER_VERSION,
    browsers: '—',
    controlliVersion: CONTROLLI.versione,
    controlli: CONTROLLI,
    controlliBasename,
    livelloEseguito: runCtx.livelloLabel(),
    expectedIdsOptions: {
      livello: runCtx.livello,
      schermate: runCtx.schermate,
      levels: runCtx.levels,
      solo: runCtx.solo,
    },
  })
}

async function closeBrowsersAndAudit(report, { logResidual = true } = {}) {
  await closeAllBrowsers()
  if (logResidual) {
    const residual = auditResidualProcesses()
    if (residual.length) {
      const line = `Processi residui dopo chiusura: ${residual.join('; ')}`
      if (report) report.anomalie.push(line)
      process.stderr.write(`[ui:verify] ${line}\n`)
    } else {
      process.stderr.write('[ui:verify] ps porte 3000/3100/3200: nessun listener residuo\n')
    }
  }
}

async function forceGuardShutdown(report) {
  await closeBrowsersAndAudit(report)
  stopServers(devChildGlobal, prodChildGlobal)
  devChildGlobal = null
  prodChildGlobal = null
  if (guardTimer) {
    clearTimeout(guardTimer)
    guardTimer = null
  }
  releaseUiVerifyLock(ROOT)
}

function armGuardTimer(report) {
  const ms = screenBudgetMs() + guardExtraMs()
  guardTimer = setTimeout(async () => {
    report.anomalie.push(
      `Timer di guardia scaduto (${Math.round(ms / 1000)}s = UI_VERIFY_BUDGET_MS + 2 min): chiusura forzata.`,
    )
    await forceGuardShutdown(report)
    if (report.meta) report.meta.durataMs = report.meta.durataMs ?? 0
    process.stderr.write('\n')
    console.log(`Esiti ${report.meta.ambiente}: ${report.write()}`)
    process.exit(0)
  }, ms)
}

async function runAmbienteWithBudget(ambiente, fn) {
  const report = makeReport(ambiente, gitCommit())
  budget = new RunBudget(timeoutMsForAmbiente(ambiente), report)
  armGuardTimer(report)
  const t0 = Date.now()
  try {
    report.anomalie = []
    await fn(report, budget)
  } catch (e) {
    if (!(e instanceof RunTimeoutError)) throw e
  } finally {
    if (guardTimer) {
      clearTimeout(guardTimer)
      guardTimer = null
    }
    report.meta.durataMs = Date.now() - t0
    budget = null
    await closeAllBrowsers()
    process.stderr.write('\n')
    console.log(`Esiti ${ambiente}: ${report.write()}`)
  }
  return report
}

async function main() {
  acquireUiVerifyLock(ROOT)
  const cli = parseCli(process.argv)
  const loaded = loadControlli(cli.controlliFile)
  CONTROLLI = loaded.controlli
  controlliBasename = loaded.controlliBasename
  runCtx = createRunContext(CONTROLLI, cli)

  if (controlliBasename.includes('6.6')) {
    const wiringIssues = auditControlliWiring(CONTROLLI, {
      screenIds: new Set(['vini', 'distillati', 'bevande', 'piatti']),
    })
    if (wiringIssues.length) {
      console.error('[ui:verify] cablaggio controlli incompleto:')
      for (const line of wiringIssues) console.error(`  - ${line}`)
      process.exit(1)
    }
  }

  const mode = cli.mode
  const hasShellInControlli = CONTROLLI.schermate?.some((s) => s.id === 'shell')
  const needsShellRegression =
    cli.livello === 2 && controlliBasename.includes('8.5') && (!hasShellInControlli || !runCtx.screenIncluded('shell'))
  let devChild = null
  let prodChild = null

  try {
    if (mode === 'all' || mode === 'locale-prod' || mode === 'locale-dev') {
      await provisionUser()
    }

    const portsToFree = []
    if (mode === 'all' || mode === 'locale-dev') portsToFree.push(DEV_PORT, SIM_PORT)
    if (mode === 'all' || mode === 'locale-prod') portsToFree.push(PROD_PORT)
    if (portsToFree.length) {
      const freed = await ensurePortsFree([...new Set(portsToFree)])
      if (freed.length) {
        process.stderr.write(`[ui:verify] porte liberate: ${freed.join(', ')}\n`)
      }
    }

    if (mode === 'all' || mode === 'locale-dev') {
      devChild = startProcess('pnpm', ['dev'], { PORT: String(DEV_PORT) })
      devChildGlobal = devChild
      await waitForUrl(devBaseUrl())
      const browser = await chromium.launch()
      trackBrowser(browser)
      const browserVersion = await browser.version()
      await browser.close()
      await runAmbienteWithBudget('locale-dev', async (report) => {
        const devBrowser = await chromium.launch()
        trackBrowser(devBrowser)
        const devL2Combined =
          runCtx.livello === 2 && controlliBasename.includes('8.5') && !runCtx.schermate?.size

        if (devL2Combined) {
          const shellLoaded = loadControlli('controlli-8.2.json')
          const saved = { c: CONTROLLI, b: controlliBasename, r: runCtx, cli: { ...cli } }
          CONTROLLI = shellLoaded.controlli
          controlliBasename = shellLoaded.controlliBasename
          runCtx = createRunContext(CONTROLLI, {
            ...cli,
            schermate: new Set(['shell']),
            livello: 2,
          })
          report.anomalie.push('locale-dev L2: regressione shell 8.2 (stesso rapporto)')
          report.replacePacchetto('shell')
          report.pacchettoDefault = 'shell'
          await runLocaleProd(devBaseUrl(), report, { skipAmbienteCheck: true })
          CONTROLLI = saved.c
          controlliBasename = saved.b
          runCtx = createRunContext(CONTROLLI, saved.cli)
        }

        if (menuScreensInScope()) {
          report.prepareMenuPackageRerun(runCtx)
          report.pacchettoDefault = 'menu'
          await runMenuDevSimulations({
            report,
            runCtx,
            addRow,
            browser: devBrowser,
            newPage,
            loginApp,
            testUser,
            testPassword,
            progressStep,
          })
          await runMenuConsole({
            browser: devBrowser,
            baseUrl: devBaseUrl(),
            report,
            runCtx,
            newPage,
            loginApp,
            testUser,
            testPassword,
            addRow,
            progressStep,
          })
        }

        if (runCtx.screenIncluded('orari') || devL2Combined) {
          if (runCtx.livello === 1 && runCtx.schermate?.size === 1 && runCtx.schermate.has('orari')) {
            report.replacePacchetto('shell')
            report.replacePacchetto('completo')
          }
          report.replacePacchetto('orari')
          report.pacchettoDefault = 'orari'
          await runOrariConsole({
            browser: devBrowser,
            baseUrl: devBaseUrl(),
            report,
            runCtx,
            newPage,
            loginApp,
            testUser,
            testPassword,
            addRow,
            progressStep,
            browserVersion,
          })
          try {
            await runOrariDevSimulations({
              browser: devBrowser,
              playwrightBrowser: devBrowser,
              baseUrl: devBaseUrl(),
              report,
              runCtx,
              newPage,
              loginApp,
              testUser,
              testPassword,
              addRow,
              progressStep,
              screenshot,
              SHOT_PROFILES,
            })
          } catch (e) {
            report.anomalie.push(`runOrariDevSimulations: ${e.stack ?? e.message}`)
          }
          try {
            await runOrariCampiDentroSchedaDevBrowsers({
              browser: devBrowser,
              baseUrl: devBaseUrl(),
              report,
              runCtx,
              newPage,
              loginApp,
              testUser,
              testPassword,
              addRow,
              progressStep,
            })
          } catch (e) {
            report.anomalie.push(`runOrariCampiDentroSchedaDevBrowsers: ${e.stack ?? e.message}`)
          }
        } else if (!devL2Combined) {
          await runConsoleClean(devBaseUrl(), report, browserVersion)
        }
        await devBrowser.close()
        const wkVer = await runWebkitEssential(devBaseUrl(), report)
        report.meta.browsers = wkVer
          ? `Chromium ${browserVersion}; WebKit ${wkVer}`
          : `Chromium ${browserVersion}`
      })
      devChild.kill('SIGTERM')
      devChild = null
      devChildGlobal = null
      await sleep(2000)
    }

    if (mode === 'all' || mode === 'locale-prod') {
      const buildDecision = resolveBuildReuse(ROOT)
      if (buildDecision.reuse) {
        process.stderr.write(`[ui:verify] build riusata (${buildDecision.reason}, hash ${buildDecision.fingerprint.hash.slice(0, 12)}…)\n`)
      } else {
        process.stderr.write(`[ui:verify] build rifatta (${buildDecision.reason})\n`)
        const build = spawnSync('pnpm', ['build'], { cwd: ROOT, stdio: 'inherit' })
        if (build.status !== 0) throw new Error('pnpm build fallito')
        markBuildSuccess(ROOT, buildDecision.fingerprint)
      }
      prodChild = startProcess('pnpm', ['start'], { PORT: String(PROD_PORT) })
      prodChildGlobal = prodChild
      await waitForUrl(prodBaseUrl())
      await runAmbienteWithBudget('locale-prod', async (report) => {
        await runLocaleProd(prodBaseUrl(), report)
        if (needsShellRegression) {
          const shellLoaded = loadControlli('controlli-8.2.json')
          const saved = { c: CONTROLLI, b: controlliBasename, r: runCtx }
          CONTROLLI = shellLoaded.controlli
          controlliBasename = shellLoaded.controlliBasename
          runCtx = createRunContext(CONTROLLI, {
            ...cli,
            schermate: new Set(['shell']),
            livello: 2,
          })
          report.anomalie.push('Regressione shell 8.2 (L2) nella stessa esecuzione locale-prod')
          await runLocaleProd(prodBaseUrl(), report, { skipAmbienteCheck: true })
          runCtx = createRunContext(CONTROLLI, {
            ...cli,
            schermate: new Set(['login', 'forgot', 'reset', 'verify']),
            livello: 2,
          })
          report.anomalie.push('Regressione accesso 8.2 (L2) nella stessa esecuzione locale-prod')
          report.replacePacchetto('accesso')
          report.pacchettoDefault = 'accesso'
          await runLocaleProd(prodBaseUrl(), report, { skipAmbienteCheck: true })
          CONTROLLI = saved.c
          controlliBasename = saved.b
          runCtx = saved.r
        }
      })
      prodChild.kill('SIGTERM')
      prodChild = null
      prodChildGlobal = null
      await sleep(1500)
      await waitForPortFree(PROD_PORT, 20000).catch(() => {})
    }

    if (mode === 'all' || mode === 'online') {
      await runAmbienteWithBudget('online', async (report) => {
        await runOnline(report)
      })
    }
  } finally {
    if (devChild) devChild.kill('SIGTERM')
    if (prodChild) prodChild.kill('SIGTERM')
    devChildGlobal = devChild
    prodChildGlobal = prodChild
    await closeAllBrowsers()
    stopServers(devChild, prodChild)
    await sleep(1500)
    const residual = auditResidualProcesses()
    if (residual.length) {
      process.stderr.write(`[ui:verify] finally — processi residui: ${residual.join('; ')}\n`)
    } else {
      process.stderr.write('[ui:verify] ps porte 3000/3100/3200: nessun listener residuo\n')
    }
    releaseUiVerifyLock(ROOT)
    await deleteUser()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
