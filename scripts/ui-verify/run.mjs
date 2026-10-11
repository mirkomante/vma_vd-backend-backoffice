#!/usr/bin/env node
/**
 * Lanciatore verifica UI Area App — docs/design/verifica/README.md
 * Uso: node scripts/ui-verify/run.mjs [locale-dev|locale-prod|online|all]
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { chromium, webkit } from '@playwright/test'

import { loadAuthMessages } from './lib/messages.mjs'
import { initReport } from './lib/report.mjs'
import {
  LAUNCHER_VERSION,
  SEGNAPOSTO_H1,
  checkScrollOrizzontale,
  checkTemaClasse,
  checkToccoMinimo,
  checkAltezzaMouse,
  installNoLampoObserver,
  checkNoLampo,
  checkTemaCambioSistema,
  checkLoginTexts,
  checkGerarchiaLogin,
  checkAccFuoriShell,
  checkCollegamentiSottolineati,
  checkAccColonna,
  checkAccMargine,
  checkAccIcona,
  checkHomeTesti,
  checkHomeColonne,
  checkShellBarraAlta,
  checkShellNomiAccessibili,
  openUserMenu,
  openMobileSidebar,
} from './lib/engine.mjs'

const ROOT = join(import.meta.dirname, '../..')
const CONTROLLI = JSON.parse(readFileSync(join(ROOT, 'docs/design/verifica/controlli-8.2.json'), 'utf8'))
const DATA = '2026-10-11'
const ONLINE_BASE = process.env.BASE_URL ?? 'https://vma-vd-backend-backoffice-git-437074136999.europe-west1.run.app'

const messages = loadAuthMessages()

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

async function waitForUrl(baseUrl, ms = 120000) {
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
  const child = spawn(cmd, args, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  return child
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

async function maybeScreenshot(page, report, name) {
  const path = join(report.imgDir, `${name}.png`)
  await page.screenshot({ path, fullPage: true })
  return path
}

async function loginApp(page, baseUrl, email, password) {
  await page.goto('/app/login', { waitUntil: 'networkidle' })
  await page.fill('input[name=email]', email)
  await page.fill('input[name=password]', password)
  await page.getByRole('button', { name: 'Accedi' }).click()
  try {
    await page.waitForURL(/\/app\/?$/, { timeout: 15000 })
  } catch {
    const url = page.url()
    throw new Error(`Login App fallito (atteso /app, ottenuto ${url})`)
  }
}

async function provisionUser() {
  testPassword = `Aa1${randomBytes(16).toString('base64url')}`
  const r = spawnSync('pnpm', ['payload', 'run', 'scripts/ui-verify/provision-user.ts', '--', 'create'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, UI_VERIFY_USER_PASSWORD: testPassword },
  })
  if (r.status !== 0) throw new Error(`provision-user create fallito: ${r.stderr || r.stdout}`)
  const data = parsePayloadStdout(r.stdout)
  testUser.email = data.email
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

function accessStates() {
  const out = []
  for (const s of CONTROLLI.schermate) {
    if (!s.stati) continue
    if (s.id === 'shell') continue
    for (const st of s.stati) {
      out.push({
        screen: s.id,
        stato: st.id,
        path: `${s.percorso ?? s.path}${st.query ?? ''}`,
      })
    }
  }
  for (const p of CONTROLLI.schermate.find((x) => x.id === 'pagine-accesso-comuni')?.percorsi ?? []) {
    out.push({ screen: 'accesso', stato: p, path: p.replace(/^https?:\/\/[^/]+/, '') })
  }
  return out
}

async function runConsoleClean(baseUrl, report, browserName) {
  const browser = await chromium.launch()
  const states = accessStates().filter((s) => s.screen !== 'accesso')
  const shellPaths = ['/app', '/app/menu', '/app/hours', '/app/reservations']
  const urls = [...new Set(states.map((s) => s.path))]
  if (testUser.email) {
    const { ctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    for (const p of shellPaths) {
      const errors = []
      const warnings = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text())
        if (msg.type() === 'warning') warnings.push(msg.text())
      })
      page.on('pageerror', (e) => errors.push(String(e)))
      const failed = []
      page.on('response', (res) => {
        if (res.status() >= 400 && !res.url().includes('favicon')) failed.push(`${res.status()} ${res.url()}`)
      })
      await page.goto(p, { waitUntil: 'networkidle' })
      await sleep(300)
      const ok = errors.length === 0 && warnings.length === 0 && failed.length === 0
      addRow(report, {
        id: 'CONSOLE',
        schermata: `${p} (shell)`,
        profiloTema: `notebook-1280/chiaro/${browserName}`,
        esito: ok ? 'OK' : 'FALLITO',
        misurato: `err:${errors.length} warn:${warnings.length} http:${failed.length}`,
        atteso: 'zero error/warning/pageerror/richieste fallite',
        evidenza: [...errors, ...warnings, ...failed].slice(0, 3).join(' | ') || '—',
      })
    }
    await ctx.close()
  }
  for (const path of urls.filter((p) => p.startsWith('/app/login'))) {
    const { ctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
    const errors = []
    const warnings = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
      if (msg.type() === 'warning') warnings.push(msg.text())
    })
    page.on('pageerror', (e) => errors.push(String(e)))
    const failed = []
    page.on('response', (res) => {
      if (res.status() >= 400 && !res.url().includes('favicon')) failed.push(`${res.status()} ${res.url()}`)
    })
    await page.goto(path, { waitUntil: 'networkidle' })
    await sleep(300)
    const ok = errors.length === 0 && warnings.length === 0 && failed.length === 0
    addRow(report, {
      id: 'CONSOLE',
      schermata: path,
      profiloTema: `notebook-1280/chiaro/${browserName}`,
      esito: ok ? 'OK' : 'FALLITO',
      misurato: `err:${errors.length} warn:${warnings.length} http:${failed.length}`,
      atteso: 'zero error/warning/pageerror/richieste fallite',
      evidenza: [...errors, ...warnings, ...failed].slice(0, 3).join(' | ') || '—',
    })
    await ctx.close()
  }
  await browser.close()
}

async function runAccessChecks(page, report, path, statoLabel, profiloKey, temaKey) {
  const pt = `${profiloKey}/${temaKey}`
  const sch = `${statoLabel}`

  let r = await checkScrollOrizzontale(page)
  addRow(report, { id: 'C1', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })

  if (['telefono-390', 'tablet-820'].includes(profiloKey)) {
    r = await checkToccoMinimo(page)
    addRow(report, { id: 'C2', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }
  if (profiloKey === 'notebook-1280') {
    r = await checkAltezzaMouse(page)
    addRow(report, { id: 'C2-mouse', schermata: sch, profiloTema: pt, esito: resultToEsito(r, true), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }

  r = await checkTemaClasse(page, CONTROLLI.temi[temaKey].html_dark)
  addRow(report, { id: 'C3', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })

  if (['scuro', 'sistema-scuro'].includes(temaKey)) {
    await installNoLampoObserver(page)
    await page.reload({ waitUntil: 'networkidle' })
    r = await checkNoLampo(page)
    addRow(report, { id: 'C3-no-lampo', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }

  r = await checkAccFuoriShell(page)
  addRow(report, { id: 'acc-fuori-shell', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })

  r = await checkCollegamentiSottolineati(page)
  addRow(report, { id: 'acc-collegamenti-sottolineati', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })

  if (['telefono-390', 'tablet-820', 'notebook-1280'].includes(profiloKey)) {
    r = await checkAccColonna(page, CONTROLLI.profili[profiloKey])
    addRow(report, { id: 'acc-colonna', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }
  if (['telefono-360', 'telefono-390'].includes(profiloKey)) {
    r = await checkAccMargine(page)
    addRow(report, { id: 'acc-margine', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }
  r = await checkAccIcona(page)
  addRow(report, { id: 'acc-icona', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })

  if (path.includes('/app/login') && statoLabel.includes('iniziale')) {
    r = await checkLoginTexts(page)
    addRow(report, { id: 'login-testi', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
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
    r = await checkGerarchiaLogin(page)
    addRow(report, { id: 'login-gerarchia', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: path })
  }
}

async function runLocaleProd(baseUrl, report) {
  const chromiumVer = chromium.name()
  const browser = await chromium.launch()
  const browserVersions = await browser.version()

  // C9
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
  const temiShot = ['chiaro', 'scuro']
  const profiliShot = ['telefono-390', 'notebook-1280']

  for (const screen of accessScreens) {
    for (const stato of screen.stati) {
      if (stato.stato_prova?.includes('facoltativo')) {
        report.addNonProvato(`${screen.id}/${stato.id}`, stato.stato_prova)
        continue
      }
      const path = `${screen.percorso}${stato.query ?? ''}`
      for (const temaKey of Object.keys(CONTROLLI.temi)) {
        for (const profiloKey of ['telefono-360', 'telefono-390', 'notebook-1280', 'tablet-820']) {
          const { ctx, page } = await newPage(browser, profiloKey, temaKey, baseUrl)
          await page.goto(path, { waitUntil: 'networkidle' })
          await runAccessChecks(page, report, path, `${screen.id}/${stato.id}`, profiloKey, temaKey)
          if (profiliShot.includes(profiloKey) && temiShot.includes(temaKey)) {
            await maybeScreenshot(page, report, `${screen.id}-${stato.id}-${profiloKey}-${temaKey}`)
          }
          await ctx.close()
        }
      }
      if (stato.avviso?.testo_da) {
        const constName = stato.avviso.testo_da.match(/\(([^)]+)\)/)?.[1]?.split('/').pop()?.replace('.ts', '')
        const key = constName
          ? Object.keys(messages).find((k) => stato.avviso.testo_da.includes(k))
          : null
        const expected = key ? messages[key] : null
        if (expected) {
          const { ctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
          await page.goto(path, { waitUntil: 'networkidle' })
          const body = await page.locator('main').innerText()
          addRow(report, {
            id: `avviso-${screen.id}-${stato.id}`,
            schermata: `${screen.id}/${stato.id}`,
            profiloTema: 'telefono-390/chiaro',
            esito: body.includes(expected) ? 'OK' : 'FALLITO',
            misurato: body.includes(expected) ? 'testo presente' : 'testo assente',
            atteso: expected.slice(0, 40) + '…',
            evidenza: path,
          })
          await ctx.close()
        }
      }
    }
  }

  // reset-senza-token conteggio
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

  // C3-cambio-sistema (una volta)
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
    const paths = Array.isArray(g.da) ? g.da : [g.da]
    for (const da of paths) {
    const { ctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
    const dest = await page.goto(da, { waitUntil: 'networkidle' })
    const finalUrl = page.url()
    const ok = finalUrl.includes('/app/login')
    addRow(report, {
      id: g.id,
      schermata: `guardia ${da}`,
      profiloTema: 'notebook-1280/chiaro',
      esito: ok ? 'OK' : 'FALLITO',
      misurato: finalUrl,
      atteso: g.a,
      evidenza: `status ${dest?.status()}`,
    })
    await ctx.close()
    }
  }

  for (const stato of shell.stati) {
    for (const temaKey of Object.keys(CONTROLLI.temi)) {
      for (const profiloKey of ['telefono-390', 'notebook-1280', 'soglia-767', 'soglia-768', 'tablet-820']) {
        const { ctx, page } = await newPage(browser, profiloKey, temaKey, baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await page.goto(stato.percorso, { waitUntil: 'networkidle' })

        const pt = `${profiloKey}/${temaKey}`
        const sch = `shell/${stato.id}`

        let r = await checkScrollOrizzontale(page)
        addRow(report, { id: 'C1', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })

        if (['telefono-390', 'tablet-820'].includes(profiloKey)) {
          r = await checkToccoMinimo(page)
          addRow(report, { id: 'C2', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
          if (profiloKey === 'telefono-390') {
            await openMobileSidebar(page)
            r = await checkToccoMinimo(page)
            addRow(report, { id: 'C2', schermata: `${sch} (menu aperto)`, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: 'pannello menu' })
          }
          await openUserMenu(page)
          r = await checkToccoMinimo(page)
          addRow(report, { id: 'C2', schermata: `${sch} (menu utente)`, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: 'dropdown utente' })
        }
        if (profiloKey === 'notebook-1280') {
          r = await checkAltezzaMouse(page)
          addRow(report, { id: 'C2-mouse', schermata: sch, profiloTema: pt, esito: resultToEsito(r, true), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }

        r = await checkTemaClasse(page, CONTROLLI.temi[temaKey].html_dark)
        addRow(report, { id: 'C3', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })

        if (stato.id === 'home' && temaKey === 'chiaro') {
          r = await checkHomeTesti(page)
          addRow(report, { id: 'home-testi', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
          r = await checkHomeColonne(page, profiloKey)
          addRow(report, { id: 'home-colonne', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }

        if (['telefono-390', 'soglia-768', 'notebook-1280'].includes(profiloKey)) {
          r = await checkShellBarraAlta(page)
          addRow(report, { id: 'shell-barra-alta', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: stato.percorso })
        }

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

        if (profiliShot.includes(profiloKey) && temiShot.includes(temaKey) && stato.id === 'home') {
          await maybeScreenshot(page, report, `shell-${stato.id}-${profiloKey}-${temaKey}`)
        }

        await ctx.close()
      }
    }
  }

  // WebKit giro essenziale (prima del logout)
  const wk = await webkit.launch()
  const wkVer = await wk.version()
  {
    const { ctx, page } = await newPage(wk, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await page.goto('/app', { waitUntil: 'networkidle' })
    await openMobileSidebar(page)
    await openUserMenu(page)
    addRow(report, {
      id: 'webkit-giro-essenziale',
      schermata: 'shell/home',
      profiloTema: 'telefono-390/chiaro/WebKit',
      esito: 'OK',
      misurato: 'login, home, menu, menu utente senza errore pagina',
      atteso: 'flusso essenziale WebKit',
      evidenza: `WebKit ${wkVer}`,
    })
    await ctx.close()
  }
  await wk.close()

  // shell-uscita (ultimo: invalida sessione)
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
    const appRedirect = await page.goto('/app', { waitUntil: 'networkidle' })
    const backLogin = page.url().includes('/app/login')
    const act = spawnSync('pnpm', ['payload', 'run', 'scripts/ui-verify/provision-user.ts', '--', 'activity-log', testUser.email], {
      cwd: ROOT,
      encoding: 'utf8',
    })
    const actOk = act.status === 0 && parsePayloadStdout(act.stdout).found
    const ok = logoutRes.status() === 303 && locOk && backLogin && tokenGone && actOk
    addRow(report, {
      id: 'shell-uscita',
      schermata: 'shell/home',
      profiloTema: 'notebook-1280/chiaro',
      esito: ok ? 'OK' : 'FALLITO',
      misurato: `POST ${logoutRes.status()} Location:${loc} token:${tokenGone} /app→login:${backLogin} log:${actOk}`,
      atteso: '303, Location relativo, login finale, cookie assente, activity logout',
      evidenza: page.url(),
    })
    await ctx.close()
  }

  await browser.close()

  report.meta.browsers = `Chromium ${browserVersions}; WebKit ${wkVer}`
}

async function runOnline(report) {
  const base = ONLINE_BASE.replace(/\/$/, '')
  // on1
  const r1 = await fetch(`${base}/app/login`)
  const html1 = await r1.text()
  addRow(report, {
    id: 'on1',
    schermata: '/app/login',
    profiloTema: '—',
    esito: r1.status === 200 && html1.includes('Area App') ? 'OK' : 'FALLITO',
    misurato: `${r1.status}, h1 ${html1.includes('<h1') && html1.includes('Area App')}`,
    atteso: '200 + h1 Area App',
    evidenza: base,
  })
  // on2
  const r2 = await fetch(`${base}/app`, { redirect: 'manual' })
  const loc2 = r2.headers.get('location') ?? ''
  const ok2 = r2.status >= 300 && r2.status < 400 && loc2.includes('/app/login') && !loc2.includes('0.0.0.0') && !loc2.includes('localhost')
  addRow(report, {
    id: 'on2',
    schermata: '/app',
    profiloTema: '—',
    esito: ok2 ? 'OK' : 'FALLITO',
    misurato: `${r2.status} → ${loc2}`,
    atteso: 'redirect a /app/login su origine pubblica',
    evidenza: base,
  })
  // on3
  const r3 = await fetch(`${base}/app/logout`, { method: 'POST', redirect: 'manual' })
  const loc3 = r3.headers.get('location') ?? ''
  const setCookie = r3.headers.get('set-cookie') ?? ''
  const ok3 = r3.status === 303 && (loc3 === '/app/login' || loc3.startsWith(base)) && !loc3.includes('0.0.0.0') && /payload-token/i.test(setCookie)
  addRow(report, {
    id: 'on3',
    schermata: 'POST /app/logout',
    profiloTema: '—',
    esito: ok3 ? 'OK' : 'FALLITO',
    misurato: `${r3.status} Location:${loc3} Set-Cookie:${setCookie.slice(0, 60)}…`,
    atteso: '303, Location ok, Set-Cookie payload-token',
    evidenza: base,
  })
  // on4
  const r4 = await fetch(`${base}/app/login/reset`)
  const html4 = await r4.text()
  const count4 = (html4.match(/<main[\s\S]*?<\/main>/i)?.[0]?.match(/<input|<button|<form/gi) ?? []).length
  addRow(report, {
    id: 'on4',
    schermata: '/app/login/reset',
    profiloTema: '—',
    esito: count4 === 0 ? 'OK' : 'FALLITO',
    misurato: `${count4} controlli in main`,
    atteso: '0',
    evidenza: base,
  })
  // on5
  const r5 = await fetch(`${base}/app/login/reset?token=prova&resetFailed=1`)
  const html5 = await r5.text()
  const ok5 = html5.includes('input') && html5.includes('name="password"') && html5.includes(messages.GENERIC_RESET_FAILURE_MESSAGE.slice(0, 20))
  addRow(report, {
    id: 'on5',
    schermata: 'reset token+resetFailed',
    profiloTema: '—',
    esito: ok5 ? 'OK' : 'FALLITO',
    misurato: `alert+password: ${ok5}`,
    atteso: 'avviso e campo password',
    evidenza: base,
  })
  // on6
  const r6 = await fetch(`${base}/app/login/verify`)
  const html6 = await r6.text()
  const ok6 = r6.status === 200 && html6.includes(messages.GENERIC_VERIFY_FAILURE_MESSAGE.slice(0, 25))
  addRow(report, {
    id: 'on6',
    schermata: '/app/login/verify',
    profiloTema: '—',
    esito: ok6 ? 'OK' : 'FALLITO',
    misurato: `${r6.status}, messaggio:${ok6}`,
    atteso: '200 + GENERIC_VERIFY_FAILURE_MESSAGE',
    evidenza: base,
  })
  report.meta.browsers = 'fetch (nessun browser)'
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
      devChild = startProcess('pnpm', ['dev'])
      await waitForUrl('http://localhost:3000')
      const report = initReport({
        ambiente: 'locale-dev',
        data: DATA,
        commit,
        launcherVersion: LAUNCHER_VERSION,
        browsers: 'Chromium (Playwright)',
        controlliVersion: CONTROLLI.versione,
      })
      await runConsoleClean('http://localhost:3000', report, 'Chromium')
      const dir = report.write()
      console.log(`Esiti locale-dev: ${dir}`)
      if (devChild) {
        devChild.kill('SIGTERM')
        devChild = null
        await sleep(2000)
      }
    }

    if (mode === 'all' || mode === 'locale-prod') {
      const build = spawnSync('pnpm', ['build'], { cwd: ROOT, stdio: 'inherit', env: process.env })
      if (build.status !== 0) throw new Error('pnpm build fallito')
      prodChild = startProcess('pnpm', ['start'])
      await waitForUrl('http://localhost:3000')
      const report = initReport({
        ambiente: 'locale-prod',
        data: DATA,
        commit,
        launcherVersion: LAUNCHER_VERSION,
        browsers: '(in corso)',
        controlliVersion: CONTROLLI.versione,
      })
      await runLocaleProd('http://localhost:3000', report)
      const dir = report.write()
      console.log(`Esiti locale-prod: ${dir}`)
      if (prodChild) {
        prodChild.kill('SIGTERM')
        prodChild = null
      }
    }

    if (mode === 'all' || mode === 'online') {
      const report = initReport({
        ambiente: 'online',
        data: DATA,
        commit,
        launcherVersion: LAUNCHER_VERSION,
        browsers: 'fetch',
        controlliVersion: CONTROLLI.versione,
      })
      await runOnline(report)
      const dir = report.write()
      console.log(`Esiti online: ${dir}`)
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
