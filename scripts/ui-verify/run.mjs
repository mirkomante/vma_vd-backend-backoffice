#!/usr/bin/env node
/**
 * Lanciatore verifica UI Area App v2 — docs/design/verifica/README.md
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import net from 'node:net'
import { chromium, webkit } from '@playwright/test'

import { loadAuthMessages } from './lib/messages.mjs'
import { initReport } from './lib/report.mjs'
import { DEV_PORT, PROD_PORT, devBaseUrl, prodBaseUrl } from './lib/ports.mjs'
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
  checkHomeNessunaRigaStato,
  checkHomeColonne,
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
} from './lib/engine.mjs'

const ROOT = join(import.meta.dirname, '../..')
const CONTROLLI = JSON.parse(readFileSync(join(ROOT, 'docs/design/verifica/controlli-8.2.json'), 'utf8'))
const DATA = '2026-10-11'
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

async function isPortFree(port) {
  return new Promise((resolve) => {
    const s = net.createServer()
    s.once('error', () => resolve(false))
    s.once('listening', () => s.close(() => resolve(true)))
    s.listen(port, '127.0.0.1')
  })
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

function resultToEsito(r, gravitaAvviso = false) {
  if (r.avviso || gravitaAvviso) return r.ok ? 'OK' : 'AVVISO'
  return r.ok ? 'OK' : 'FALLITO'
}

async function screenshot(page, report, name) {
  const path = join(report.imgDir, `${name}.png`)
  await page.screenshot({ path, fullPage: true })
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
  const browser = await chromium.launch()
  const profiles = ['notebook-1280', 'telefono-390']
  const accessPaths = [
    ...new Set([
      ...visitableAccessStates().map((s) => s.path),
      ...(CONTROLLI.schermate.find((x) => x.id === 'pagine-accesso-comuni')?.percorsi ?? []).map((p) =>
        p.replace(/^https?:\/\/[^/]+/, ''),
      ),
    ]),
  ].filter((p) => !p.includes('<token'))

  const shellPaths = ['/app', '/app/menu', '/app/hours', '/app/reservations']

  for (const profiloKey of profiles) {
    for (const path of accessPaths) {
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

    if (!testUser.email) continue
    const { ctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    for (const p of shellPaths) {
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

  if (['scuro', 'sistema-scuro'].includes(temaKey)) {
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

async function runLocaleProd(baseUrl, report) {
  const browser = await chromium.launch()
  const browserVersion = await browser.version()
  report.meta.browsers = `Chromium ${browserVersion}`

  await runAmbienteCheck(baseUrl, report, browserVersion)

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

  report.addNonProvato('verify-link-valido', 'facoltativo: token reale monouso non ottenuto')
  report.addNonProvato('shell-admin-link', 'NON PROVABILE con utente solo App (adminRole none)')

  const accessScreens = CONTROLLI.schermate.filter((s) => s.fuori_dalla_shell)
  const profiliAll = ['telefono-360', 'telefono-390', 'notebook-1280', 'tablet-820']

  for (const screen of accessScreens) {
    for (const stato of screen.stati) {
      if (stato.da_visitare === false) continue
      if (stato.stato_prova?.includes('facoltativo')) {
        report.addNonProvato(`${screen.id}/${stato.id}`, stato.stato_prova)
        continue
      }
      const path = `${screen.percorso}${stato.query ?? ''}`
      for (const temaKey of Object.keys(CONTROLLI.temi)) {
        for (const profiloKey of profiliAll) {
          const { ctx, page } = await newPage(browser, profiloKey, temaKey, baseUrl)
          await page.goto(path, { waitUntil: 'networkidle' })
          const sch = `${screen.id}/${stato.id}`
          const pt = `${profiloKey}/${temaKey}`
          await runAccessScreenChecks(page, report, screen.id, stato.id, sch, pt, path, profiloKey, temaKey, stato)
          if (SHOT_PROFILES.includes(profiloKey) && SHOT_TEMI.includes(temaKey)) {
            await screenshot(page, report, `${screen.id}-${stato.id}-${profiloKey}-${temaKey}`)
          }
          await ctx.close()
        }
      }
    }
  }

  {
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

  {
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

  const shell = CONTROLLI.schermate.find((s) => s.id === 'shell')
  for (const g of shell.guardia) {
    for (const da of Array.isArray(g.da) ? g.da : [g.da]) {
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

  let temaSceltaDone = false

  for (const stato of shell.stati) {
    for (const temaKey of Object.keys(CONTROLLI.temi)) {
      for (const profiloKey of ['telefono-390', 'notebook-1280', 'soglia-767', 'soglia-768', 'tablet-820']) {
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
          r = await checkHomeTesti(page)
          addRow(report, { id: 'home-testi', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
          r = await checkHomeNessunaRigaStato(page)
          addRow(report, { id: 'home-nessuna-riga-di-stato', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
          r = await checkHomeColonne(page, profiloKey)
          addRow(report, { id: 'home-colonne', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }

        if (['telefono-390', 'soglia-768', 'notebook-1280'].includes(profiloKey)) {
          r = await checkShellBarraAlta(page)
          addRow(report, { id: 'shell-barra-alta', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }
        if (['telefono-390', 'soglia-768', 'notebook-1280'].includes(profiloKey)) {
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
          r = await checkShellMenuVoci(page)
          addRow(report, { id: 'shell-menu-voci', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
          r = await checkShellBloccoInCima(page)
          addRow(report, { id: 'shell-blocco-in-cima', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
          r = await checkShellBloccoUtente(page, testUser.email)
          addRow(report, { id: 'shell-blocco-utente', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: testUser.email })
        }
        if (stato.id === 'home' && temaKey === 'chiaro' && ['notebook-1280', 'telefono-390'].includes(profiloKey)) {
          r = await checkShellMenuUtente(page, { mobilePanelFirst: profiloKey === 'telefono-390' })
          addRow(report, { id: 'shell-menu-utente', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }
        if (!temaSceltaDone && profiloKey === 'notebook-1280' && stato.id === 'home' && temaKey === 'chiaro') {
          r = await checkShellTemaScelta(page, baseUrl)
          addRow(report, {
            id: 'shell-tema-scelta',
            schermata: sch,
            profiloTema: pt,
            esito: resultToEsito(r),
            misurato: r.misurato,
            atteso: r.atteso,
            evidenza: r.evidenza ?? 'menu utente',
          })
          temaSceltaDone = true
          await loginApp(page, baseUrl, testUser.email, testPassword)
          await page.goto(stato.percorso, { waitUntil: 'networkidle' })
        }

        r = await checkShellPercorsoVoceAttiva(page, stato.percorso)
        addRow(report, { id: 'shell-percorso-voce-attiva', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })

        r = await checkShellNomiAccessibili(page)
        addRow(report, { id: 'shell-nomi-accessibili', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })

        if (stato.id !== 'home' && temaKey === 'chiaro' && profiloKey === 'telefono-390') {
          const h1 = await page.locator('h1').innerText()
          const desc = await page.locator('main p').first().innerText()
          const expH1 = SEGNAPOSTO_H1[stato.percorso]
          addRow(report, {
            id: 'shell-segnaposto',
            schermata: sch,
            profiloTema: pt,
            esito: h1 === expH1 && desc.includes('Questa sezione sarà disponibile a breve.') ? 'OK' : 'FALLITO',
            misurato: `${h1} / ${desc.slice(0, 40)}`,
            atteso: `${expH1} + descrizione segnaposto`,
            evidenza: stato.percorso,
          })
        }

        if (stato.id === 'home' && SHOT_PROFILES.includes(profiloKey) && SHOT_TEMI.includes(temaKey)) {
          await page.goto(stato.percorso, { waitUntil: 'networkidle' })
          await page.keyboard.press('Escape')
          await screenshot(page, report, `shell-${stato.id}-${profiloKey}-${temaKey}`)
          if (profiloKey === 'telefono-390') {
            await openMobileSidebar(page)
            await screenshot(page, report, `shell-home-menu-aperto-${profiloKey}-${temaKey}`)
          }
          await openUserMenu(page, { mobilePanelFirst: profiloKey === 'telefono-390' })
          await page.getByRole('menuitemradio', { name: 'Chiaro' }).waitFor({ state: 'visible', timeout: 10000 })
          await screenshot(page, report, `shell-home-menu-utente-${profiloKey}-${temaKey}`)
          await page.keyboard.press('Escape')
          if (profiloKey === 'telefono-390') await page.keyboard.press('Escape')
        }
        if (stato.id === 'segnaposto-menu' && SHOT_PROFILES.includes(profiloKey) && SHOT_TEMI.includes(temaKey)) {
          await screenshot(page, report, `shell-segnaposto-menu-${profiloKey}-${temaKey}`)
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

  await probeWebKitProdLoginCookies(baseUrl, report)

  {
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
  const wk = await webkit.launch()
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
  })
}

async function main() {
  const mode = process.argv[2] ?? 'all'
  const commit = gitCommit()
  let devChild = null
  let prodChild = null

  try {
    if (mode === 'all' || mode === 'locale-prod' || mode === 'locale-dev') {
      await provisionUser()
    }

    if (mode === 'all' || mode === 'locale-dev') {
      if (!(await isPortFree(DEV_PORT))) {
        throw new Error(`Porta ${DEV_PORT} occupata: liberare prima di locale-dev`)
      }
      const t0 = Date.now()
      devChild = startProcess('pnpm', ['dev'], { PORT: String(DEV_PORT) })
      await waitForUrl(devBaseUrl())
      const browser = await chromium.launch()
      const browserVersion = await browser.version()
      await browser.close()
      const report = makeReport('locale-dev', commit)
      await runConsoleClean(devBaseUrl(), report, browserVersion)
      const wkVer = await runWebkitEssential(devBaseUrl(), report)
      report.meta.browsers = `Chromium ${browserVersion}; WebKit ${wkVer}`
      report.meta.durataMs = Date.now() - t0
      console.log(`Esiti locale-dev: ${report.write()}`)
      devChild.kill('SIGTERM')
      devChild = null
      await sleep(2000)
    }

    if (mode === 'all' || mode === 'locale-prod') {
      if (!(await isPortFree(PROD_PORT))) {
        throw new Error(`Porta ${PROD_PORT} occupata: liberare prima di locale-prod`)
      }
      const t0 = Date.now()
      const build = spawnSync('pnpm', ['build'], { cwd: ROOT, stdio: 'inherit' })
      if (build.status !== 0) throw new Error('pnpm build fallito')
      prodChild = startProcess('pnpm', ['start'], { PORT: String(PROD_PORT) })
      await waitForUrl(prodBaseUrl())
      const report = makeReport('locale-prod', commit)
      await runLocaleProd(prodBaseUrl(), report)
      report.meta.durataMs = Date.now() - t0
      console.log(`Esiti locale-prod: ${report.write()}`)
      prodChild.kill('SIGTERM')
      prodChild = null
    }

    if (mode === 'all' || mode === 'online') {
      const t0 = Date.now()
      const report = makeReport('online', commit)
      await runOnline(report)
      report.meta.durataMs = Date.now() - t0
      console.log(`Esiti online: ${report.write()}`)
    }
  } finally {
    if (devChild) devChild.kill('SIGTERM')
    if (prodChild) prodChild.kill('SIGTERM')
    await deleteUser()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
