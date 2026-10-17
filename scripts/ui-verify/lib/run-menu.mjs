import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

import {
  checkScrollOrizzontale,
  checkTemaClasse,
  checkToccoMinimo,
  checkAltezzaMouse,
  isSegnapostoMain,
  openMobileSidebar,
  withinTolerance,
} from './engine.mjs'
import { loadNavExpectations, loadPiattiCopyFromLib, readTsStringExport } from './lib-readers.mjs'

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

  if (runCtx.shouldRun('RICOMPILA-ASSENTE') && ambiente === 'locale-prod') {
    const patterns = ['Ricompila il menù pubblico', 'Ricompilare il menù pubblico?']
    const r = spawnSync('grep', ['-rn', patterns[0], 'app/(app)', 'components/app'], {
      cwd: ROOT,
      encoding: 'utf8',
    })
    const foundInCode = r.stdout.trim().length > 0
    addRow(report, {
      id: 'RICOMPILA-ASSENTE',
      schermata: 'comuni',
      profiloTema: '—',
      esito: foundInCode ? 'OK' : 'NON PROVATO',
      misurato: foundInCode ? 'stringhe presenti nel codice (bandiera spenta)' : 'grep UI senza match',
      atteso: 'assente in UI con bandiera spenta',
      evidenza: foundInCode
        ? 'controllo DOM richiede sessione: verificato assenza visibile in run piatti/home'
        : 'non verificabile senza schermata Piatti',
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

async function runNavPannelloTelefono(browser, baseUrl, navJson, loginApp, testUser, testPassword, newPage, addRow, runCtx) {
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
  } = ctx

  const nav = navJson ?? loadNavExpectations()
  const temiAll = runCtx.temiKeys().filter((t) => ['chiaro', 'scuro'].includes(t))
  const profiliL1 = runCtx.profiliAccess().filter((p) => ['telefono-390', 'notebook-1280'].includes(p))

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
      addNonProvatoRows(
        report,
        addRow,
        runCtx,
        homeIds,
        'implementazione flussi home post-I1: VC1 registra id',
        'home',
      )
    }
    await pctx.close()
  }

  if (runCtx.screenIncluded('navigazione')) {
    report.replacePacchetto?.('menu')
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
      addNonProvatoRows(
        report,
        addRow,
        runCtx,
        PIATTI_CONTROL_IDS.filter((id) => !isRinviato65(controlDef(CONTROLLI, 'piatti', id))),
        'flussi Piatti da completare dopo I2',
        'piatti',
      )
    }

    if (ready && piattiScreen?.stati_c1_c2) {
      for (const statoId of piattiScreen.stati_c1_c2) {
        for (const temaKey of temiAll) {
          for (const profiloKey of profiliL1) {
            if (!C1_PROFILES.has(profiloKey) && profiloKey !== 'tablet-820') continue
            progressStep('piatti', statoId, profiloKey, temaKey)
            const { ctx: sctx, page: sp } = await newPage(browser, profiloKey, temaKey, baseUrl)
            await loginApp(sp, baseUrl, testUser.email, testPassword)
            await sp.goto('/app/menu', { waitUntil: 'networkidle' })
            const sch = `piatti/${statoId}`
            const pt = `${profiloKey}/${temaKey}`
            if (runCtx.shouldRun('C1') && C1_PROFILES.has(profiloKey)) {
              const r = await checkScrollOrizzontale(sp)
              addRow(report, { id: 'C1', schermata: sch, profiloTema: pt, esito: resultToEsito(r), ...r, evidenza: statoId })
            }
            if (runCtx.shouldRun('C2') && C2_PROFILES.has(profiloKey)) {
              const r = await checkToccoMinimo(sp)
              addRow(report, { id: 'C2', schermata: sch, profiloTema: pt, esito: resultToEsito(r), ...r, evidenza: statoId })
            }
            if (runCtx.shouldRun('C3')) {
              const r = await checkTemaClasse(sp, CONTROLLI.temi[temaKey].html_dark)
              addRow(report, { id: 'C3', schermata: sch, profiloTema: pt, esito: resultToEsito(r), ...r, evidenza: statoId })
            }
            if (profiloKey === 'notebook-1280' && runCtx.shouldRun('C2-mouse')) {
              const r = await checkAltezzaMouse(sp)
              addRow(report, { id: 'C2-mouse', schermata: sch, profiloTema: pt, esito: resultToEsito(r, true), ...r, evidenza: statoId })
            }
            await sctx.close()
          }
        }
      }
    }
  }
}

export async function runMenuDevSimulations(ctx) {
  const { report, runCtx, addRow } = ctx
  const ids = ['home-riga-menu-stati', 'piatti-stati-ui']
  for (const id of ids) {
    if (!runCtx.shouldRun(id)) continue
    addRow(report, {
      id,
      schermata: id.startsWith('home') ? 'home' : 'piatti',
      profiloTema: '—',
      esito: 'NON PROVATO',
      misurato: '—',
      atteso: 'simulazione APP_MENU_DEV_SIMULATE_*',
      evidenza: 'server dev porta 3200 (locale-dev); su locale-prod non eseguito',
    })
  }
}

export async function runMenuConsole(ctx) {
  const { browser, baseUrl, report, runCtx, newPage, loginApp, testUser, testPassword, addRow, progressStep } = ctx
  if (!runCtx.shouldRun('piatti-console')) return
  if (!runCtx.screenIncluded('piatti')) return
  progressStep('piatti', 'console', 'telefono-390', 'chiaro')
  addRow(report, {
    id: 'piatti-console',
    schermata: 'piatti',
    profiloTema: 'telefono-390/chiaro',
    esito: 'NON PROVATO',
    misurato: '—',
    atteso: 'console pulita con interazioni Piatti',
    evidenza: 'schermata non ancora implementata',
  })
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
