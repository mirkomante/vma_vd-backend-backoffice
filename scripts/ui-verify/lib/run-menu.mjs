import { existsSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'

import {
  checkScrollOrizzontale,
  checkTemaClasse,
  checkToccoMinimo,
  checkAltezzaMouse,
  isSegnapostoMain,
  openMobileSidebar,
  openUserMenu,
  withinTolerance,
} from './engine.mjs'
import { loadNavExpectations, loadPiattiCopyFromLib, readTsStringExport } from './lib-readers.mjs'
import { measureDeleteDialogButtons } from './catalog-ui-helpers.mjs'
import { SIM_PORT, isPortFree, waitForPortFree } from './ensure-ports.mjs'
import {
  menuCountDishes,
  menuCountSoldOut,
  menuCreateDishes,
  menuDeleteVerifyPrefix,
  menuUpdateDish,
} from './menu-payload.mjs'
import {
  preparePiattiState,
  runPiattiFlowControls,
  runPiattiStatiUi,
  runRicompilaAssenteCheck,
} from './run-piatti.mjs'
import { CATALOG_SCREENS, CATALOG_SCREEN_IDS } from './catalog-config.mjs'
import { runCatalogScreens } from './run-catalog.mjs'
import { runCatalogConsoleForScreen, runCatalogStatiUi } from './run-catalog-flows.mjs'
import { runMenuListScreens, runMenuListStatiUi } from './run-menu-list.mjs'
import { runWithStateTimeout } from './timeouts.mjs'

const ROOT_MENU = join(import.meta.dirname, '../../..')

const ROOT = join(import.meta.dirname, '../../..')
const C1_PROFILES = new Set(['telefono-360', 'telefono-390', 'notebook-1280'])
const C2_PROFILES = new Set(['telefono-390', 'tablet-820'])

const NAV_ICON_EXPECTED = {
  Piatti: 'lucide-utensils-crossed',
  Vini: 'lucide-wine',
  Bevande: 'lucide-cup-soda',
  Distillati: 'lucide-martini',
  'Menù fissi': 'lucide-book-open',
  Servizi: 'lucide-concierge-bell',
  'Giorni speciali': 'lucide-calendar-heart',
  'Messaggio globale': 'lucide-megaphone',
}

const NAV_FLOW_CASES = [
  { path: '/app', voce_attiva: null },
  { path: '/app/menu', voce_attiva: 'Piatti' },
  { path: '/app/menu/wines', voce_attiva: 'Vini' },
  { path: '/app/menu/drinks', voce_attiva: 'Bevande' },
  { path: '/app/menu/spirits', voce_attiva: 'Distillati' },
  { path: '/app/menu/fixed', voce_attiva: 'Menù fissi' },
  { path: '/app/menu/fixed/categories', voce_attiva: 'Menù fissi' },
  { path: '/app/menu/services', voce_attiva: 'Servizi' },
  { path: '/app/menu/special-days', voce_attiva: 'Giorni speciali' },
  { path: '/app/menu/message', voce_attiva: 'Messaggio globale' },
  { path: '/app/hours', voce_attiva: 'Orari' },
  { path: '/app/reservations', voce_attiva: 'Elenco' },
  { path: '/app/reservations/day-exceptions', voce_attiva: 'Eccezioni giorno' },
]

const HEAVY_PIATTI_C1_STATES = new Set(['piu-di-100', 'caricamento', 'errore-caricamento', 'vuoto'])

const PIATTI_CONTROL_IDS = [
  'piatti-testi',
  'piatti-colonna-elenco',
  'piatti-azioni-pagina',
  'piatti-righe-azioni',
  'piatti-terminato',
  'piatti-disabilita',
  'piatti-elimina-libero',
  'piatti-elimina-registro',
  'piatti-elimina-bloccato',
  'piatti-elimina-concorrenza',
  'piatti-elimina-permessi',
  'piatti-modulo-campi',
  'piatti-modulo-validazione',
  'piatti-modulo-inglese',
  'piatti-modulo-footer',
  'piatti-tassonomie',
  'piatti-persistenza',
  'piatti-filtri-ricerca',
  'piatti-ordine-100',
  'piatti-stati-ui',
  'piatti-nomi-accessibili',
  'piatti-accesso',
  'piatti-ricompila',
  'piatti-disabilitato-ovunque',
  'piatti-confronto-visivo',
  'piatti-casella-misure',
  'piatti-allergeni-selezione',
]

function controlDef(controlli, screenId, controlId) {
  const screen = controlli.schermate?.find((s) => s.id === screenId)
  return screen?.controlli?.find((c) => c.id === controlId)
}

function isRinviato65(ctrl) {
  return ctrl?.rinviato_a === '6.5' || (ctrl?.stato_prova ?? '').includes('NON PROVABILE')
}

function enabledHrefSet(navJson) {
  const set = new Set(['/app', '/app/hours', '/app/reservations'])
  for (const g of navJson.navGroups ?? []) {
    for (const item of g.items) set.add(item.href)
  }
  return set
}

function allMenuVoicesEnabled(navJson) {
  const menuGroup = navJson.navGroups?.find((g) => g.label === 'Menù')
  return (menuGroup?.items?.length ?? 0) >= 8
}

async function isHomeIntegrationReady(page) {
  const h1 = (await page.locator('h1').innerText().catch(() => '')).trim()
  return h1 === 'Oggi'
}

async function isPiattiScreenReady(page) {
  const h1 = (await page.locator('h1').innerText().catch(() => '')).trim()
  if (h1 !== 'Piatti') return false
  return !(await isSegnapostoMain(page))
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
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
    await sleep(600)
  }
  throw new Error(`Server non raggiungibile: ${baseUrl}`)
}

function startMenuDevServer(port, extraEnv) {
  try {
    unlinkSync(join(ROOT_MENU, '.next/dev/lock'))
  } catch {
    /* nessun lock */
  }
  const child = spawn('pnpm', ['exec', 'next', 'dev', '--port', String(port)], {
    cwd: ROOT_MENU,
    env: { ...process.env, ...extraEnv },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stderr?.on('data', (chunk) => {
    const t = String(chunk)
    if (t.includes('Error') || t.includes('ready')) {
      process.stderr.write(`[sim-menu:${port}] ${t.slice(0, 120)}\n`)
    }
  })
  return child
}

/** Allineato a lib/app/home/menuSoldOutStatus.ts */
function formatMenuSoldOutStatusLine(count) {
  if (count <= 0) return 'Nessun piatto terminato'
  if (count === 1) return '1 piatto terminato'
  return `${count} piatti terminati`
}

async function readMenuCardStatus(page) {
  return page.evaluate(() => {
    const link = document.querySelector('main a[href="/app/menu"]')
    if (!link) return { found: false }
    const card = link.querySelector('[data-slot=card]') ?? link
    const flex = link.querySelector('[data-slot=card-content] .min-w-0.flex-1')
    const title = flex?.querySelector('.text-sm.font-medium')?.textContent?.trim() ?? ''
    const statusP = flex?.querySelector('p.min-h-4.text-xs')
    const skeleton = flex?.querySelector('[data-slot=skeleton], .animate-pulse')
    const skeletonWrap = flex?.querySelector('div[aria-hidden]')
    const text = (statusP?.textContent ?? '').replace(/\s+/g, ' ').trim()
    const hasSkeleton = Boolean(skeleton || skeletonWrap?.querySelector('[data-slot=skeleton]'))
    return {
      found: true,
      title,
      text,
      hasSkeleton,
      cardHeight: Math.round(card.getBoundingClientRect().height),
      skeletonBusy: skeletonWrap?.getAttribute('aria-busy') === 'true' || hasSkeleton,
    }
  })
}

async function waitForMenuStatusLine(page, timeoutMs = 20000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const s = await readMenuCardStatus(page)
    if (s.found && s.text && !s.hasSkeleton) return s
    await sleep(200)
  }
  return readMenuCardStatus(page)
}

function addNonProvatoRows(report, addRow, runCtx, ids, motivo, schermata = '—') {
  for (const id of ids) {
    if (!runCtx.shouldRun(id)) continue
    addRow(report, {
      id,
      schermata,
      profiloTema: '—',
      esito: 'NON PROVATO',
      misurato: '—',
      atteso: '—',
      evidenza: motivo,
    })
  }
}

export function runMenuComuniChecks(report, runCtx, addRow, { ambiente } = {}) {
  if (runCtx.shouldRun('NO-OVERRIDE')) {
    const paths = ['app/(app)', 'components/app', 'lib/app', 'lib/menu/ui'].filter((p) =>
      existsSync(join(ROOT, p)),
    )
    let ok = true
    let misurato = 'nessuna directory da controllare'
    let evidenza = paths.join(', ') || '—'
    if (paths.length) {
      const r = spawnSync('grep', ['-rn', 'overrideAccess: true', ...paths], { cwd: ROOT, encoding: 'utf8' })
      ok = r.status === 1 && !r.stdout.trim()
      misurato = r.stdout.trim() ? r.stdout.trim().slice(0, 200) : `exit ${r.status}`
      evidenza = `grep -rn overrideAccess: true ${paths.join(' ')}`
    }
    addRow(report, {
      id: 'NO-OVERRIDE',
      schermata: 'comuni',
      profiloTema: '—',
      esito: ok ? 'OK' : 'FALLITO',
      misurato,
      atteso: 'nessuna corrispondenza (exit 1)',
      evidenza,
    })
  }

  const ricompilaViaMenuScreen =
    runCtx.screenIncluded('piatti') ||
    runCtx.screenIncluded('vini') ||
    runCtx.screenIncluded('distillati') ||
    runCtx.screenIncluded('bevande') ||
    runCtx.screenIncluded('servizi') ||
    runCtx.screenIncluded('menu-fissi')
  if (runCtx.shouldRun('RICOMPILA-ASSENTE') && ambiente === 'locale-prod' && !ricompilaViaMenuScreen) {
    addRow(report, {
      id: 'RICOMPILA-ASSENTE',
      schermata: 'comuni',
      profiloTema: '—',
      esito: 'NON PROVATO',
      misurato: '—',
      atteso: 'assente in UI con bandiera spenta',
      evidenza: 'eseguito con schermata piatti (runRicompilaAssenteCheck)',
    })
  }

  if (runCtx.shouldRun('RICOMPILA-PRESENTE')) {
    addRow(report, {
      id: 'RICOMPILA-PRESENTE',
      schermata: 'comuni',
      profiloTema: '—',
      esito: 'NON PROVATO',
      misurato: '—',
      atteso: 'pulsante Ricompila presente',
      evidenza: 'rinviato alla 6.5',
    })
  }

  if (runCtx.shouldRun('nav-pannello-telefono') && runCtx.livello != null && runCtx.livello < 2) {
    addRow(report, {
      id: 'nav-pannello-telefono',
      schermata: 'navigazione',
      profiloTema: '—',
      esito: 'NON PROVATO',
      misurato: '—',
      atteso: 'misura pannello telefono',
      evidenza: 'solo livello 2',
    })
  }
}

async function readSidebarNav(page) {
  return page.evaluate(() => {
    const items = []
    document.querySelectorAll('[data-sidebar="menu-button"]').forEach((btn) => {
      const href = btn.getAttribute('href')
      const label = btn.querySelector('span')?.textContent?.trim() || btn.textContent?.trim()
      const svg = btn.querySelector('svg')
      const classes = svg?.getAttribute('class') ?? ''
      const active =
        btn.hasAttribute('data-active') || btn.getAttribute('aria-current') === 'page'
      if (label) items.push({ label, href, classes, active })
    })
    return items
  })
}

async function runNavVociMenu(page, navJson, profiloKey, addRow, report, runCtx) {
  const id = 'nav-voci-menu'
  if (!runCtx.shouldRun(id)) return
  const w = page.viewportSize()?.width ?? 1280
  if (w < 768) await openMobileSidebar(page)
  const items = await readSidebarNav(page)
  const expected = []
  for (const g of navJson.navGroups ?? []) {
    for (const item of g.items) {
      expected.push({ etichetta: item.label, href: item.href })
    }
  }
  const missing = expected.filter((e) => !items.some((i) => i.label === e.etichetta && i.href === e.href))
  const extra = items.filter(
    (i) => i.href?.startsWith('/app/') && !expected.some((e) => e.etichetta === i.label),
  )
  addRow(report, {
    id,
    schermata: 'navigazione',
    profiloTema: `${profiloKey}/chiaro`,
    esito: missing.length === 0 && extra.length === 0 ? 'OK' : 'FALLITO',
    misurato: `attese ${expected.length}; mancanti ${missing.map((m) => m.etichetta).join(', ') || '—'}; extra ${extra.map((e) => e.label).join(', ') || '—'}`,
    atteso: JSON.stringify(expected),
    evidenza: '/app',
  })
}

async function runNavIcone(page, navJson, profiloKey, addRow, report, runCtx) {
  const id = 'nav-icone'
  if (!runCtx.shouldRun(id)) return
  const w = page.viewportSize()?.width ?? 1280
  if (w < 768) await openMobileSidebar(page)
  const items = await readSidebarNav(page)
  const failures = []
  for (const g of navJson.navGroups ?? []) {
    for (const item of g.items) {
      const row = items.find((i) => i.label === item.label)
      const expectedClass = NAV_ICON_EXPECTED[item.label]
      if (!expectedClass) continue
      if (!row?.classes.includes(expectedClass)) {
        failures.push(`${item.label}: ${row?.classes ?? 'svg assente'}`)
      }
    }
  }
  const banned = items.filter((i) => i.classes.includes('lucide-beer') || i.classes.includes('lucide-list'))
  addRow(report, {
    id,
    schermata: 'navigazione',
    profiloTema: `${profiloKey}/chiaro`,
    esito: failures.length === 0 && banned.length === 0 ? 'OK' : 'FALLITO',
    misurato: failures.length ? failures.join('; ') : banned.length ? `icone vietate: ${banned.map((b) => b.label).join(', ')}` : 'icone ok',
    atteso: 'classi lucide attese per voci abilitate',
    evidenza: 'sidebar',
  })
}

async function pathReachable(page, baseUrl, path) {
  const res = await page.goto(path, { waitUntil: 'domcontentloaded' })
  if (!res || res.status() === 404) return false
  const title = await page.title()
  return !title.includes('404')
}

async function runNavFlows(page, baseUrl, navJson, profiloKey, addRow, report, runCtx, kind) {
  const id = kind === 'briciole' ? 'nav-briciole' : 'nav-voce-attiva'
  if (!runCtx.shouldRun(id)) return
  const enabled = enabledHrefSet(navJson)
  const failures = []
  const skipped = []
  for (const caso of NAV_FLOW_CASES) {
    if (!enabled.has(caso.path)) {
      skipped.push(caso.path)
      continue
    }
    await page.goto(caso.path, { waitUntil: 'networkidle' })
    if (await isSegnapostoMain(page) && caso.path.startsWith('/app/menu')) {
      skipped.push(`${caso.path} (segnaposto)`)
      continue
    }
    const w = page.viewportSize()?.width ?? 1280
    if (w < 768) await openMobileSidebar(page)
    const items = await readSidebarNav(page)
    const active = items.filter((i) => i.active).map((i) => i.label)
    if (kind === 'voce') {
      if (caso.voce_attiva === null) {
        if (active.length !== 0) failures.push(`${caso.path}: attive=${active.join(',')}`)
      } else if (!active.includes(caso.voce_attiva) || active.length !== 1) {
        failures.push(`${caso.path}: attese=${caso.voce_attiva} attive=${active.join(',')}`)
      }
    } else {
      const crumbs = await page.evaluate(() => {
        const nav = document.querySelector('nav[aria-label="Percorso"]')
        return nav
          ? [...nav.querySelectorAll('[data-slot=breadcrumb-item]')].map((li) => li.textContent?.trim()).filter(Boolean)
          : []
      })
      const bc = navJson.breadcrumbCases?.find((b) => b.path === caso.path)
      const labels = bc?.parts?.map((p) => p.label) ?? []
      if (!labels.every((l) => crumbs.join(' ').includes(l))) {
        failures.push(`${caso.path}: crumbs=${crumbs.join('›')} attese=${labels.join('›')}`)
      }
    }
    if (w < 768) await page.keyboard.press('Escape')
  }
  addRow(report, {
    id,
    schermata: 'navigazione',
    profiloTema: `${profiloKey}/chiaro`,
    esito: failures.length ? 'FALLITO' : 'OK',
    misurato: failures.length ? failures.join(' | ') : `casi ok; saltati: ${skipped.join(', ') || '—'}`,
    atteso: kind === 'voce' ? 'una voce attiva per caso' : 'briciole in ordine',
    evidenza: skipped.length ? `NON PROVATO parziale: ${skipped.join(', ')}` : baseUrl,
  })
}

async function runNavTitoli(page, navJson, profiloKey, addRow, report, runCtx) {
  const id = 'nav-titoli-pagina'
  if (!runCtx.shouldRun(id)) return
  const enabled = enabledHrefSet(navJson)
  const failures = []
  for (const caso of NAV_FLOW_CASES) {
    if (!enabled.has(caso.path) || caso.path === '/app') continue
    await page.goto(caso.path, { waitUntil: 'domcontentloaded' })
    if (await isSegnapostoMain(page) && caso.path.startsWith('/app/menu')) continue
    const title = await page.title()
    const pageName = caso.voce_attiva ?? 'Area App'
    const expected = `${pageName} · Area App`
    if (caso.path === '/app/menu/fixed/categories') {
      if (!title.includes('Menù fissi')) failures.push(`${caso.path}: ${title}`)
    } else if (!title.startsWith(expected)) {
      failures.push(`${caso.path}: ${title} atteso ${expected}`)
    }
  }
  await page.goto('/app', { waitUntil: 'networkidle' })
  const homeTitle = await page.title()
  if (!homeTitle.startsWith('Area App')) failures.push(`home title: ${homeTitle}`)
  addRow(report, {
    id,
    schermata: 'navigazione',
    profiloTema: `${profiloKey}/chiaro`,
    esito: failures.length ? 'FALLITO' : 'OK',
    misurato: failures.join(' | ') || 'titoli ok',
    atteso: '{Pagina} · Area App',
    evidenza: '/app',
  })
}

function runNavCasiUnit(report, addRow, runCtx) {
  const id = 'nav-casi-unit'
  if (!runCtx.shouldRun(id)) return
  const r = spawnSync('pnpm', ['payload', 'run', 'scripts/verify-lib-app-8_2.ts'], {
    cwd: ROOT,
    encoding: 'utf8',
  })
  addRow(report, {
    id,
    schermata: 'navigazione',
    profiloTema: '—',
    esito: r.status === 0 ? 'OK' : 'FALLITO',
    misurato: `exit ${r.status}`,
    atteso: 'exit 0',
    evidenza: (r.stderr || r.stdout).slice(0, 180),
  })
}

async function runHomeRigaMenuTesto(browser, baseUrl, testUser, testPassword, newPage, loginApp, addRow, report, runCtx) {
  const id = 'home-riga-menu-testo'
  if (!runCtx.shouldRun(id)) return
  const ctrl = controlDef(CONTROLLI_FROM_CTX, 'home', id)
  const profili = ctrl?.profili ?? ['telefono-390', 'notebook-1280']
  const temi = ctrl?.temi ?? ['chiaro', 'scuro']
  for (const profiloKey of profili) {
    for (const temaKey of temi) {
      const { ctx, page } = await newPage(browser, profiloKey, temaKey, baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await page.goto('/app', { waitUntil: 'networkidle' })
      const { count } = menuCountSoldOut(testUser.email)
      const attesoLine = formatMenuSoldOutStatusLine(count)
      const card = await waitForMenuStatusLine(page)
      const ok =
        card.found &&
        card.title === 'Menù' &&
        card.text === attesoLine
      addRow(report, {
        id,
        schermata: 'home/iniziale',
        profiloTema: `${profiloKey}/${temaKey}`,
        esito: ok ? 'OK' : 'FALLITO',
        misurato: card.found
          ? `scheda=${card.title}; riga=${card.text}; count API=${count}`
          : 'scheda Menù assente',
        atteso: `Menù; «${attesoLine}» (N=${count})`,
        evidenza: '/app',
      })
      await ctx.close()
    }
  }
}

let CONTROLLI_FROM_CTX = null

async function runHomeRigaMenuCasi(browser, baseUrl, testUser, testPassword, newPage, loginApp, addRow, report, runCtx) {
  const id = 'home-riga-menu-casi'
  if (!runCtx.shouldRun(id)) return
  const failures = []
  try {
    menuDeleteVerifyPrefix()
    const n0 = menuCountSoldOut(testUser.email).count
    menuCreateDishes(testUser.email, [
      { name: 'verify-ui-p1', soldOut: true },
      { name: 'verify-ui-p2', soldOut: true },
      { name: 'verify-ui-p3', soldOut: true },
      { name: 'verify-ui-p4', soldOut: true, disabled: true },
      { name: 'verify-ui-p5', soldOut: false, disabled: true },
    ])
    const { ctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)

    const checkLine = async (expectedCount, label) => {
      await page.goto('/app', { waitUntil: 'networkidle' })
      const card = await waitForMenuStatusLine(page)
      const atteso = formatMenuSoldOutStatusLine(expectedCount)
      if (card.text !== atteso) failures.push(`${label}: «${card.text}» atteso «${atteso}»`)
    }

    await checkLine(n0 + 3, 'dopo creazione')
    menuUpdateDish(testUser.email, 'verify-ui-p1', { soldOut: false })
    await checkLine(n0 + 2, 'dopo p1 non terminato')
    menuUpdateDish(testUser.email, 'verify-ui-p2', { disabled: true })
    menuUpdateDish(testUser.email, 'verify-ui-p3', { disabled: true })
    await checkLine(n0, 'dopo p2/p3 disabilitati')

    menuDeleteVerifyPrefix()
    menuCreateDishes(testUser.email, [{ name: 'verify-ui-sing', soldOut: true }])
    const countForSing = menuCountSoldOut(testUser.email).count
    await page.goto('/app', { waitUntil: 'networkidle' })
    const sing = await waitForMenuStatusLine(page)
    if (countForSing === 1) {
      if (sing.text !== '1 piatto terminato') failures.push(`singolare: «${sing.text}»`)
    } else {
      failures.push(`singolare: N=${countForSing} (serve N=1 isolato)`)
    }
    menuUpdateDish(testUser.email, 'verify-ui-sing', { soldOut: false })
    await page.goto('/app', { waitUntil: 'networkidle' })
    const zeroCard = await waitForMenuStatusLine(page)
    const countZero = menuCountSoldOut(testUser.email).count
    if (countZero === 0 && zeroCard.text !== 'Nessun piatto terminato') {
      failures.push(`zero: «${zeroCard.text}» con N=0`)
    }

    await ctx.close()
  } finally {
    menuDeleteVerifyPrefix()
  }
  addRow(report, {
    id,
    schermata: 'home',
    profiloTema: 'telefono-390/chiaro',
    esito: failures.length ? 'FALLITO' : 'OK',
    misurato: failures.join(' | ') || 'casi ok',
    atteso: 'conteggio e singolare/plurale come da specifica',
    evidenza: '/app',
  })
}

async function runHomeRigaMenuAltezza(browser, baseUrl, testUser, testPassword, newPage, loginApp, addRow, report, runCtx, ambiente) {
  const id = 'home-riga-menu-altezza'
  if (!runCtx.shouldRun(id)) return
  const ctrl = controlDef(CONTROLLI_FROM_CTX, 'home', id)
  const profili = ctrl?.profili ?? ['telefono-390', 'notebook-1280']
  const tol = ctrl?.tolleranza_px ?? 2

  const measureOnBase = async (profiloKey, simBaseUrl) => {
    const { ctx, page } = await newPage(browser, profiloKey, 'chiaro', simBaseUrl)
    await loginApp(page, simBaseUrl, testUser.email, testPassword)
    await page.goto('/app', { waitUntil: 'domcontentloaded' })
    let skeletonH = 0
    for (let i = 0; i < 40; i++) {
      const s = await readMenuCardStatus(page)
      if (s.found && s.hasSkeleton) {
        skeletonH = s.cardHeight
        break
      }
      await sleep(100)
    }
    const ready = await waitForMenuStatusLine(page)
    const readyH = ready.cardHeight
    await ctx.close()
    return { skeletonH, readyH }
  }

  for (const profiloKey of profili) {
    let skeletonH = 0
    let readyH = 0
    let evidenza = baseUrl

    const { ctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await page.goto('/app', { waitUntil: 'networkidle' })
    const ready = await waitForMenuStatusLine(page)
    readyH = ready.cardHeight
    await ctx.close()

    if (await isPortFree(SIM_PORT)) {
      await waitForPortFree(SIM_PORT)
      const child = startMenuDevServer(SIM_PORT, { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '2500' })
      try {
        const simUrl = `http://localhost:${SIM_PORT}`
        await waitForUrl(simUrl)
        const m = await measureOnBase(profiloKey, simUrl)
        skeletonH = m.skeletonH
        if (!skeletonH && m.readyH) skeletonH = m.readyH
        evidenza = `${baseUrl}; skeleton da ${simUrl}`
      } finally {
        child.kill('SIGTERM')
        await waitForPortFree(SIM_PORT)
      }
    }

    const ok =
      skeletonH > 0 &&
      readyH > 0 &&
      withinTolerance(skeletonH, readyH, tol)
    addRow(report, {
      id,
      schermata: 'home/caricamento',
      profiloTema: `${profiloKey}/chiaro`,
      esito: ok ? 'OK' : skeletonH ? 'FALLITO' : 'NON PROVATO',
      misurato: `skeleton=${skeletonH}px; con riga=${readyH}px`,
      atteso: `altezza scheda uguale (±${tol}px)`,
      evidenza: ambiente === 'locale-prod' ? evidenza : baseUrl,
    })
  }
}

async function runNavPannelloTelefono(browser, baseUrl, navJson, loginApp, testUser, testPassword, newPage, addRow, report, runCtx) {
  const id = 'nav-pannello-telefono'
  if (!runCtx.shouldRun(id)) return
  if (!allMenuVoicesEnabled(navJson)) {
    addRow(report, {
      id,
      schermata: 'navigazione',
      profiloTema: 'telefono-390/chiaro',
      esito: 'NON PROVATO',
      misurato: '—',
      atteso: 'altezza pannello con 8 voci Menù',
      evidenza: 'voci non ancora tutte accese',
    })
    return
  }
  for (const profiloKey of ['telefono-390', 'telefono-390-basso']) {
    const { ctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await page.goto('/app', { waitUntil: 'networkidle' })
    await openMobileSidebar(page)
    const panelH = await page.evaluate(() => {
      const sheet = document.querySelector('[data-sidebar="sidebar"][data-mobile="true"]')
      return sheet ? Math.round(sheet.getBoundingClientRect().height) : 0
    })
    addRow(report, {
      id,
      schermata: 'navigazione/pannello-aperto',
      profiloTema: `${profiloKey}/chiaro`,
      esito: profiloKey === 'telefono-390' ? (withinTolerance(panelH, 716, 24) ? 'OK' : 'AVVISO') : 'NON PROVATO',
      misurato: `${panelH} px`,
      atteso: profiloKey === 'telefono-390' ? '~716 px' : 'scroll con header/footer fissi',
      evidenza: 'misura preliminare VC1',
    })
    await ctx.close()
  }
}

export async function runMenuChecks(ctx) {
  const {
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
    navJson,
    ambiente = 'locale-prod',
  } = ctx

  CONTROLLI_FROM_CTX = CONTROLLI
  const nav = navJson ?? loadNavExpectations()
  const temiAll = runCtx.temiKeys().filter((t) => ['chiaro', 'scuro'].includes(t))
  const profiliL1 = runCtx.profiliAccess().filter((p) => ['telefono-390', 'notebook-1280'].includes(p))

  report.prepareMenuPackageRerun?.(runCtx)

  if (runCtx.screenIncluded('home')) {
    const homeIds = [
      'home-riga-menu-testo',
      'home-riga-menu-casi',
      'home-riga-menu-stati',
      'home-riga-menu-altezza',
    ]
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await page.goto('/app', { waitUntil: 'networkidle' })
    const ready = await isHomeIntegrationReady(page)
    if (!ready) {
      for (const id of homeIds) {
        if (!runCtx.shouldRun(id)) continue
        addRow(report, {
          id,
          schermata: 'home',
          profiloTema: '—',
          esito: 'NON PROVATO',
          misurato: '—',
          atteso: '—',
          evidenza: 'schermata non ancora implementata',
        })
      }
    } else {
      await runHomeRigaMenuTesto(browser, baseUrl, testUser, testPassword, newPage, loginApp, addRow, report, runCtx)
      await runHomeRigaMenuCasi(browser, baseUrl, testUser, testPassword, newPage, loginApp, addRow, report, runCtx)
      await runHomeRigaMenuAltezza(browser, baseUrl, testUser, testPassword, newPage, loginApp, addRow, report, runCtx, ambiente)
    }
    await pctx.close()
  }

  if (runCtx.screenIncluded('navigazione')) {
    for (const profiloKey of profiliL1) {
      progressStep('navigazione', 'menu-fisso-notebook', profiloKey, 'chiaro')
      const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await page.goto('/app', { waitUntil: 'networkidle' })
      await runNavVociMenu(page, nav, profiloKey, addRow, report, runCtx)
      await runNavIcone(page, nav, profiloKey, addRow, report, runCtx)
      await runNavFlows(page, baseUrl, nav, profiloKey, addRow, report, runCtx, 'voce')
      await runNavFlows(page, baseUrl, nav, profiloKey, addRow, report, runCtx, 'briciole')
      if (profiloKey === 'telefono-390') await runNavTitoli(page, nav, profiloKey, addRow, report, runCtx)
      await pctx.close()
    }
    runNavCasiUnit(report, addRow, runCtx)
    await runNavPannelloTelefono(
      browser,
      baseUrl,
      nav,
      loginApp,
      testUser,
      testPassword,
      newPage,
      addRow,
      report,
      runCtx,
    )
  }

  if (runCtx.screenIncluded('piatti')) {
    const piattiScreen = CONTROLLI.schermate?.find((s) => s.id === 'piatti')
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await page.goto('/app/menu', { waitUntil: 'networkidle' })
    const ready = await isPiattiScreenReady(page)
    await pctx.close()

    if (!ready) {
      for (const id of PIATTI_CONTROL_IDS) {
        const ctrl = controlDef(CONTROLLI, 'piatti', id)
        if (isRinviato65(ctrl)) {
          if (!runCtx.shouldRun(id)) continue
          addRow(report, {
            id,
            schermata: 'piatti',
            profiloTema: '—',
            esito: 'NON PROVATO',
            misurato: '—',
            atteso: '—',
            evidenza: 'rinviato alla 6.5',
          })
        } else if (runCtx.shouldRun(id)) {
          addRow(report, {
            id,
            schermata: 'piatti',
            profiloTema: '—',
            esito: 'NON PROVATO',
            misurato: '—',
            atteso: '—',
            evidenza: 'schermata non ancora implementata',
          })
        }
      }
      if (runCtx.shouldRun('RICOMPILA-ASSENTE')) {
        addRow(report, {
          id: 'RICOMPILA-ASSENTE',
          schermata: 'piatti',
          profiloTema: 'telefono-390/chiaro',
          esito: 'OK',
          misurato: 'segnaposto: nessun pulsante Ricompila visibile',
          atteso: 'assente',
          evidenza: '/app/menu segnaposto',
        })
      }
    } else {
      const copy = loadPiattiCopyFromLib()
      if (!copy) {
        report.anomalie.push('piatti: costanti lib/ non trovate')
      }
      const piattiCtx = {
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
        ambiente,
      }
      await runRicompilaAssenteCheck(piattiCtx)
      await runPiattiFlowControls(piattiCtx)
    }

    if (ready && piattiScreen?.stati_c1_c2) {
      let matrixStateIds = [
        ...piattiScreen.stati_c1_c2.filter((id) => !HEAVY_PIATTI_C1_STATES.has(id)),
        ...new Set([
          ...piattiScreen.stati_c1_c2.filter((id) => HEAVY_PIATTI_C1_STATES.has(id)),
          'piu-di-100',
        ]),
      ]
      if (runCtx.matrixStateIncluded) {
        matrixStateIds = matrixStateIds.filter((id) => runCtx.matrixStateIncluded(id))
      }
      const matrixControlIds = ['C1', 'C2', 'C3', 'C2-mouse']
      const runMatrix = matrixControlIds.some((id) => runCtx.shouldRun(id))

      async function runPiattiC1C2Matrix(statoId) {
        for (const temaKey of temiAll) {
          for (const profiloKey of profiliL1) {
            if (!C1_PROFILES.has(profiloKey) && profiloKey !== 'tablet-820') continue
            progressStep('piatti', statoId, profiloKey, temaKey)
            const sch = `piatti/${statoId}`
            const pt = `${profiloKey}/${temaKey}`
            const addNonProvato = (motivo) => {
              for (const id of ['C1', 'C2', 'C3', 'C2-mouse']) {
                if (!runCtx.shouldRun(id)) continue
                if (id === 'C1' && !C1_PROFILES.has(profiloKey)) continue
                if (id === 'C2' && !C2_PROFILES.has(profiloKey)) continue
                if (id === 'C2-mouse' && profiloKey !== 'notebook-1280') continue
                addRow(report, {
                  id,
                  schermata: sch,
                  profiloTema: pt,
                  esito: 'NON PROVATO',
                  misurato: motivo,
                  atteso: id === 'C1' ? 'scroll orizzontale' : id === 'C2' ? 'tocco ≥44px' : id === 'C3' ? 'classe tema' : 'altezza mouse',
                  evidenza: statoId,
                })
              }
            }

            let activeCtx = null
            let activeSim = null
            const runOne = async () => {
              let simChild = null
              let pageBase = baseUrl
              try {
                if (statoId === 'caricamento' || statoId === 'errore-caricamento') {
                  await waitForPortFree(SIM_PORT)
                  const env =
                    statoId === 'caricamento'
                      ? { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '2500' }
                      : { APP_MENU_DEV_SIMULATE_LOAD_ERROR: '1' }
                  simChild = startMenuDevServer(SIM_PORT, env)
                  activeSim = simChild
                  pageBase = `http://localhost:${SIM_PORT}`
                  await waitForUrl(pageBase)
                }
                if (statoId === 'vuoto') {
                  const { count } = menuCountDishes()
                  if (count > 0) {
                    addNonProvato(`stato vuoto: DB con ${count} piatti`)
                    return
                  }
                }
                const { ctx: sctx, page: sp } = await newPage(browser, profiloKey, temaKey, pageBase)
                activeCtx = sctx
                await loginApp(sp, pageBase, testUser.email, testPassword)
                try {
                  if (statoId === 'caricamento') {
                    await sp.goto('/app/menu', { waitUntil: 'commit' })
                    await sleep(600)
                  } else if (statoId === 'errore-caricamento') {
                    await sp.goto('/app/menu', { waitUntil: 'networkidle' })
                  } else {
                    await preparePiattiState(sp, statoId, {
                      testUser,
                      baseUrl: pageBase,
                      browser,
                      newPage,
                      loginApp,
                      testPassword,
                    })
                  }
                } catch (e) {
                  report.anomalie.push(`piatti stato ${statoId}: ${e.message}`)
                  await sp.goto('/app/menu', { waitUntil: 'networkidle' }).catch(() => {})
                }
                if (runCtx.shouldRun('C1') && C1_PROFILES.has(profiloKey)) {
                  const r = await checkScrollOrizzontale(sp)
                  addRow(report, { id: 'C1', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: statoId })
                }
                if (runCtx.shouldRun('C2') && C2_PROFILES.has(profiloKey)) {
                  const r = await checkToccoMinimo(sp)
                  let misuratoC2 = r.misurato
                  if (statoId === 'elimina-libero') {
                    const dims = await measureDeleteDialogButtons(sp)
                    if (dims?.indietro && dims?.elimina) {
                      misuratoC2 = `Indietro ${dims.indietro}; Elimina ${dims.elimina}${r.ok ? '' : `; violazioni C2: ${r.misurato}`}`
                    }
                  }
                  addRow(report, {
                    id: 'C2',
                    schermata: sch,
                    profiloTema: pt,
                    esito: resultToEsito(r),
                    misurato: misuratoC2,
                    atteso: r.atteso,
                    evidenza: statoId,
                  })
                }
                if (runCtx.shouldRun('C3')) {
                  const r = await checkTemaClasse(sp, CONTROLLI.temi[temaKey].html_dark)
                  addRow(report, { id: 'C3', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: statoId })
                }
                if (profiloKey === 'notebook-1280' && runCtx.shouldRun('C2-mouse')) {
                  const r = await checkAltezzaMouse(sp)
                  addRow(report, { id: 'C2-mouse', schermata: sch, profiloTema: pt, esito: resultToEsito(r, true), misurato: r.misurato, atteso: r.atteso, evidenza: statoId })
                }
                await sctx.close()
                activeCtx = null
              } finally {
                if (simChild) {
                  simChild.kill('SIGTERM')
                  activeSim = null
                  await waitForPortFree(SIM_PORT)
                }
                menuDeleteVerifyPrefix()
              }
            }

            try {
              await runWithStateTimeout(() => runOne(), statoId)
            } catch (e) {
              if (activeCtx) {
                await activeCtx.close().catch(() => {})
                activeCtx = null
              }
              if (activeSim) {
                activeSim.kill('SIGTERM')
                activeSim = null
                await waitForPortFree(SIM_PORT).catch(() => {})
              }
              const motivo =
                e.code === 'UI_VERIFY_TIMEOUT' || String(e.message).startsWith('tempo:')
                  ? `tempo: ${statoId}`
                  : e.message
              addNonProvato(motivo)
              report.anomalie.push(`piatti C1/C2 ${statoId} ${profiloKey}/${temaKey}: ${motivo}`)
            }
          }
        }
      }

      if (runMatrix) {
        for (const statoId of matrixStateIds) {
          await runPiattiC1C2Matrix(statoId)
        }
      }
    }
  }

  await runCatalogScreens({
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
    ambiente,
    startMenuDevServer,
    waitForUrl,
  })

  await runMenuListScreens({
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
    ambiente,
    startMenuDevServer,
    waitForUrl,
  })
}

export async function runMenuDevSimulations(ctx) {
  const {
    report,
    runCtx,
    addRow,
    browser,
    newPage,
    loginApp,
    testUser,
    testPassword,
    progressStep,
  } = ctx

  await runPiattiStatiUi({
    ...ctx,
    startMenuDevServer,
    waitForUrl,
  })

  for (const screenId of CATALOG_SCREEN_IDS) {
    if (!runCtx.screenIncluded(screenId)) continue
    await runCatalogStatiUi(
      {
        ...ctx,
        startMenuDevServer,
        waitForUrl,
      },
      CATALOG_SCREENS[screenId],
    )
  }

  await runMenuListStatiUi({
    ...ctx,
    startMenuDevServer,
    waitForUrl,
  })

  if (!runCtx.shouldRun('home-riga-menu-stati')) return

  if (!(await isPortFree(SIM_PORT))) {
    addRow(report, {
      id: 'home-riga-menu-stati',
      schermata: 'home',
      profiloTema: 'telefono-390/chiaro',
      esito: 'NON PROVATO',
      misurato: '—',
      atteso: 'Skeleton in attesa; errore senza riga',
      evidenza: `porta ${SIM_PORT} occupata`,
    })
    return
  }

  progressStep('home', 'caricamento', 'telefono-390', 'chiaro')
  const failures = []

  await waitForPortFree(SIM_PORT)
  const delayChild = startMenuDevServer(SIM_PORT, { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '2500' })
  try {
    const simUrl = `http://localhost:${SIM_PORT}`
    await waitForUrl(simUrl)
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', simUrl)
    await loginApp(page, simUrl, testUser.email, testPassword)
    await page.goto('/app', { waitUntil: 'commit' })
    let during = await readMenuCardStatus(page)
    for (let i = 0; i < 50 && !during.hasSkeleton && !during.skeletonBusy; i++) {
      await sleep(100)
      during = await readMenuCardStatus(page)
    }
    const otherCards = await page.evaluate(() => {
      const links = [...document.querySelectorAll('main a[href^="/app/"]')]
      return links.filter((a) => a.getAttribute('href') !== '/app/menu').length
    })
    if (!during.hasSkeleton && !during.skeletonBusy) {
      failures.push('caricamento: Skeleton non osservato prima della riga')
    }
    if (otherCards < 2) {
      failures.push(`caricamento: altre schede visibili=${otherCards}`)
    }
    await waitForMenuStatusLine(page, 15000)
    await pctx.close()
  } catch (e) {
    failures.push(`caricamento: ${e.message}`)
  } finally {
    delayChild.kill('SIGTERM')
    await waitForPortFree(SIM_PORT)
  }

  await waitForPortFree(SIM_PORT)
  const errChild = startMenuDevServer(SIM_PORT, { APP_MENU_DEV_SIMULATE_LOAD_ERROR: '1' })
  try {
    const simUrl = `http://localhost:${SIM_PORT}`
    await waitForUrl(simUrl)
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', simUrl)
    const bag = { errors: [] }
    page.on('pageerror', (e) => bag.errors.push(String(e)))
    await loginApp(page, simUrl, testUser.email, testPassword)
    await page.goto('/app', { waitUntil: 'networkidle' })
    const card = await readMenuCardStatus(page)
    const hrefOk = await page.evaluate(() => {
      const a = document.querySelector('main a[href="/app/menu"]')
      return a?.getAttribute('href') === '/app/menu'
    })
    const alertCount = await page.locator('main [role=alert]').count()
    if (card.text) failures.push(`errore: riga presente «${card.text}»`)
    if (!hrefOk) failures.push('errore: collegamento /app/menu assente')
    if (alertCount > 0) failures.push(`errore: avvisi=${alertCount}`)
    if (bag.errors.length) failures.push(`pageerror: ${bag.errors.length}`)
    await pctx.close()
  } catch (e) {
    failures.push(`errore: ${e.message}`)
  } finally {
    errChild.kill('SIGTERM')
    await waitForPortFree(SIM_PORT)
  }

  addRow(report, {
    id: 'home-riga-menu-stati',
    schermata: 'home',
    profiloTema: 'telefono-390/chiaro',
    esito: failures.length ? 'FALLITO' : 'OK',
    misurato: failures.join(' | ') || 'stati simulati ok',
    atteso: 'Skeleton in attesa; con errore nessuna riga e link ok',
    evidenza: `localhost:${SIM_PORT}`,
  })
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

export async function runCatalogConsole(ctx) {
  const base = { ...ctx }
  for (const screenId of CATALOG_SCREEN_IDS) {
    if (!ctx.runCtx.screenIncluded(screenId)) continue
    await runCatalogConsoleForScreen(base, CATALOG_SCREENS[screenId])
  }
}

export async function runMenuConsole(ctx) {
  const {
    browser,
    baseUrl,
    report,
    runCtx,
    newPage,
    loginApp,
    testUser,
    testPassword,
    addRow,
    progressStep,
    browserVersion,
  } = ctx
  await runCatalogConsole(ctx)
  if (!runCtx.shouldRun('piatti-console')) return
  if (!runCtx.screenIncluded('piatti')) return

  for (const profiloKey of ['telefono-390', 'notebook-1280']) {
    progressStep('piatti', 'console', profiloKey, 'chiaro')
    const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
    const bag = attachConsoleListeners(page)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await page.goto('/app/menu', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Filtri' }).click().catch(() => {})
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Nuovo piatto' }).click().catch(() => {})
    await page.keyboard.press('Escape')
    await openUserMenu(page, { mobilePanelFirst: profiloKey === 'telefono-390' })
    await page.keyboard.press('Escape')
    await sleep(300)
    const c = consoleEsito(bag)
    addRow(report, {
      id: 'piatti-console',
      schermata: 'piatti',
      profiloTema: `${profiloKey}/chiaro/Chromium ${browserVersion ?? ''}`.trim(),
      esito: c.ok ? 'OK' : 'FALLITO',
      misurato: c.misurato,
      atteso: 'zero error/warning/pageerror',
      evidenza: c.evidenza,
    })
    await pctx.close()
  }
}

export function buildShellHomeExpected(controlli, navJson) {
  const fromJson = controlli.schermate
    ?.find((s) => s.id === 'shell')
    ?.controlli?.find((c) => c.id === 'home-testi')?.atteso
  const h1 = readTsStringExport('lib/app/navigation.ts', 'HOME_PAGE_TITLE') ?? fromJson?.h1 ?? 'Oggi'
  const descrizione =
    readTsStringExport('lib/app/navigation.ts', 'HOME_PAGE_DESCRIPTION') ??
    fromJson?.descrizione ??
    'Situazione di oggi e accesso alle sezioni.'
  const schede = (navJson?.homeSectionCards ?? fromJson?.schede_in_ordine ?? []).map((c) => ({
    titolo: c.title ?? c.titolo,
    descrizione: c.description ?? c.descrizione,
    href: c.href,
  }))
  return { h1, descrizione, schede }
}
