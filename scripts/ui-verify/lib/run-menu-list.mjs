import {
  checkScrollOrizzontale,
  checkTemaClasse,
  checkToccoMinimo,
  checkAltezzaMouse,
  isSegnapostoMain,
} from './engine.mjs'
import { catalogControlIdsFromControlli } from './controlli-handlers.mjs'
import { MENU_LIST_SCREENS, MENU_LIST_SCREEN_IDS } from './menu-list-config.mjs'
import { gotoMenuList } from './menu-list-ui-helpers.mjs'
import { runMenuListFlowControls } from './run-menu-list-flows.mjs'
import { runMenuListStatiUiForScreen } from './run-menu-list-supplementary-flows.mjs'
import { prepareMenuListState } from './menu-list-state.mjs'
import { SIM_PORT, waitForPortFree } from './ensure-ports.mjs'
import { measureDeleteDialogButtons } from './catalog-ui-helpers.mjs'

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

const C1_PROFILES = new Set(['telefono-360', 'telefono-390', 'notebook-1280'])
const C2_PROFILES = new Set(['telefono-390', 'tablet-820'])

function isRinviato65(ctrl) {
  return ctrl?.rinviato_a === '6.5' || (ctrl?.stato_prova ?? '').includes('NON PROVABILE')
}

function controlDef(controlli, screenId, controlId) {
  const screen = controlli.schermate?.find((s) => s.id === screenId)
  return screen?.controlli?.find((c) => c.id === controlId)
}

function markMenuListControls(ctx, config, evidenza) {
  const { CONTROLLI, runCtx, addRow, report } = ctx
  const ids = catalogControlIdsFromControlli(CONTROLLI, config.id)
  for (const id of ids) {
    if (!runCtx.shouldRun(id)) continue
    const ctrl = controlDef(CONTROLLI, config.id, id)
    if (isRinviato65(ctrl)) {
      addRow(report, {
        id,
        schermata: config.id,
        profiloTema: '—',
        esito: 'NON PROVATO',
        misurato: '—',
        atteso: '—',
        evidenza: 'rinviato alla 6.5',
      })
      continue
    }
    if (id.endsWith('-stato-vuoto') || id.endsWith('-accesso') || id.endsWith('-nessuna-categoria')) {
      addRow(report, {
        id,
        schermata: config.id,
        profiloTema: '—',
        esito: 'NON PROVATO',
        misurato: '—',
        atteso: '—',
        evidenza: ctrl?.stato_prova ?? 'NON PROVABILE',
      })
      continue
    }
    addRow(report, {
      id,
      schermata: config.id,
      profiloTema: '—',
      esito: 'NON PROVATO',
      misurato: '—',
      atteso: '—',
      evidenza,
    })
  }
}

async function isMenuListScreenReady(page, config) {
  const path = config.path
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  if (await isSegnapostoMain(page)) return false
  const h1 = (await page.locator('h1').innerText().catch(() => '')).trim()
  return h1 === config.h1
}

export async function runMenuListScreens(ctx) {
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
    ambiente,
    startMenuDevServer,
    waitForUrl,
  } = ctx

  const temiAll = runCtx.temiKeys().filter((t) => ['chiaro', 'scuro'].includes(t))
  const profiliL1 = runCtx.profiliAccess().filter((p) => ['telefono-390', 'notebook-1280'].includes(p))

  for (const screenId of MENU_LIST_SCREEN_IDS) {
    if (!runCtx.screenIncluded(screenId)) continue
    const config = MENU_LIST_SCREENS[screenId]
    const screen = CONTROLLI.schermate?.find((s) => s.id === screenId)

    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    const ready = await isMenuListScreenReady(page, config)
    await pctx.close()

    if (!ready) {
      markMenuListControls(ctx, config, 'schermata non ancora implementata')
      if (runCtx.shouldRun('RICOMPILA-ASSENTE') && screenId === 'servizi') {
        addRow(report, {
          id: 'RICOMPILA-ASSENTE',
          schermata: screenId,
          profiloTema: 'telefono-390/chiaro',
          esito: 'OK',
          misurato: 'segnaposto: schermata non implementata',
          atteso: 'assente',
          evidenza: config.path,
        })
      }
      continue
    }

    await runMenuListFlowControls(ctx, config)

    if (screen?.stati_c1_c2?.length) {
      const matrixControlIds = ['C1', 'C2', 'C3', 'C2-mouse']
      const runMatrix = matrixControlIds.some((id) => runCtx.shouldRun(id))
      if (runMatrix) {
        for (const statoId of screen.stati_c1_c2) {
          if (runCtx.matrixStateIncluded && !runCtx.matrixStateIncluded(statoId)) continue
          for (const temaKey of temiAll) {
            for (const profiloKey of profiliL1) {
              if (!C1_PROFILES.has(profiloKey) && profiloKey !== 'tablet-820') continue
              progressStep(screenId, statoId, profiloKey, temaKey)
              const sch = `${screenId}/${statoId}`
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
                    atteso: id,
                    evidenza: statoId,
                  })
                }
              }

              let simChild = null
              let pageBase = baseUrl
              try {
                if (statoId === 'caricamento' || statoId === 'errore-caricamento') {
                  if (startMenuDevServer && waitForUrl) {
                    await waitForPortFree(SIM_PORT)
                    const env =
                      statoId === 'caricamento'
                        ? { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '2500' }
                        : { APP_MENU_DEV_SIMULATE_LOAD_ERROR: '1' }
                    simChild = startMenuDevServer(SIM_PORT, env)
                    pageBase = `http://localhost:${SIM_PORT}`
                    await waitForUrl(pageBase)
                  }
                }
                const { ctx: sctx, page: sp } = await newPage(browser, profiloKey, temaKey, pageBase)
                await loginApp(sp, pageBase, testUser.email, testPassword)
                try {
                  if (statoId === 'caricamento') {
                    await sp.goto(config.path, { waitUntil: 'commit' })
                    await sleep(600)
                  } else if (statoId === 'errore-caricamento') {
                    await sp.goto(config.path, { waitUntil: 'networkidle' })
                  } else {
                    const okState = await prepareMenuListState(sp, config, statoId, ctx)
                    if (!okState) {
                      addNonProvato('stato non preparato')
                      await sctx.close()
                      continue
                    }
                  }
                } catch (e) {
                  report.anomalie.push(`${screenId} stato ${statoId}: ${e.message}`)
                }
                if (runCtx.shouldRun('C1') && C1_PROFILES.has(profiloKey)) {
                  const r = await checkScrollOrizzontale(sp)
                  addRow(report, { id: 'C1', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: statoId })
                }
                if (runCtx.shouldRun('C2') && C2_PROFILES.has(profiloKey)) {
                  const r = await checkToccoMinimo(sp)
                  let misuratoC2 = r.misurato
                  if (statoId === 'elimina' || statoId === 'elimina-senza-uso') {
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
              } finally {
                if (simChild) {
                  simChild.kill('SIGTERM')
                  await waitForPortFree(SIM_PORT)
                }
              }
            }
          }
        }
      }
    }
  }
}

export async function runMenuListStatiUi(ctx) {
  const { runCtx, addRow, report, browser, newPage, loginApp, testUser, testPassword, baseUrl, startMenuDevServer, waitForUrl } =
    ctx
  for (const screenId of MENU_LIST_SCREEN_IDS) {
    const ctrlId = `${screenId}-stati-ui`
    if (!runCtx.shouldRun(ctrlId) || !runCtx.screenIncluded(screenId)) continue
    const config = MENU_LIST_SCREENS[screenId]
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    const ready = await isMenuListScreenReady(page, config)
    await pctx.close()
    if (!ready) {
      addRow(report, {
        id: ctrlId,
        schermata: screenId,
        profiloTema: 'telefono-390/chiaro',
        esito: 'NON PROVATO',
        misurato: '—',
        atteso: 'simulazioni',
        evidenza: 'schermata non ancora implementata',
      })
    } else {
      await runMenuListStatiUiForScreen({ ...ctx, addRow, report, waitForUrl, startMenuDevServer }, config)
    }
  }
}

export { MENU_LIST_SCREEN_IDS }
