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
import { applyMenuListFixtures, prepareMenuListState } from './menu-list-state.mjs'
import { SIM_PORT, waitForPortFree } from './ensure-ports.mjs'
import { measureDeleteDialogButtons } from './catalog-ui-helpers.mjs'
import { menuDeleteVerifyPrefix } from './menu-payload.mjs'
import { runWithStateTimeout } from './timeouts.mjs'
import { MATRIX_SERIAL_STATES, matrixParallelism, runMatrixCellsParallel } from './matrix-parallel.mjs'

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
        const statoIds = screen.stati_c1_c2.filter(
          (id) => !runCtx.matrixStateIncluded || runCtx.matrixStateIncluded(id),
        )
        for (const statoId of statoIds) {
          progressStep(screenId, 'matrice', statoId, `parallelo×${matrixParallelism()}`)
          const cells = []
          for (const temaKey of temiAll) {
            for (const profiloKey of profiliL1) {
              if (!C1_PROFILES.has(profiloKey) && profiloKey !== 'tablet-820') continue
              cells.push({
                statoId,
                temaKey,
                profiloKey,
                sortKey: `${statoId}\0${temaKey}\0${profiloKey}`,
              })
            }
          }

          const nonProvatoRows = (sch, pt, motivo) => {
            const profiloOnly = pt.split('/')[0]
            const rows = []
            for (const id of ['C1', 'C2', 'C3', 'C2-mouse']) {
              if (!runCtx.shouldRun(id)) continue
              if (id === 'C1' && !C1_PROFILES.has(profiloOnly)) continue
              if (id === 'C2' && !C2_PROFILES.has(profiloOnly)) continue
              if (id === 'C2-mouse' && profiloOnly !== 'notebook-1280') continue
              rows.push({
                id,
                schermata: sch,
                profiloTema: pt,
                esito: 'NON PROVATO',
                misurato: motivo,
                atteso: id,
                evidenza: statoId,
              })
            }
            return rows
          }

          if (!MATRIX_SERIAL_STATES.has(statoId)) {
            const fx = applyMenuListFixtures(config, statoId, ctx)
            if (!fx.ok) {
              for (const cell of cells) {
                const sch = `${screenId}/${statoId}`
                const pt = `${cell.profiloKey}/${cell.temaKey}`
                for (const row of nonProvatoRows(sch, pt, fx.reason ?? 'stato non preparato')) addRow(report, row)
              }
              continue
            }
          }

          const runCell = async (statoIdInner, profiloKey, temaKey) => {
            const sch = `${screenId}/${statoIdInner}`
            const pt = `${profiloKey}/${temaKey}`
            progressStep(screenId, statoIdInner, profiloKey, temaKey)
            const outRows = []
            let activeCtx = null
            let activeSim = null
            const runOne = async () => {
              let simChild = null
              let pageBase = baseUrl
              try {
                if (MATRIX_SERIAL_STATES.has(statoIdInner) && startMenuDevServer && waitForUrl) {
                  await waitForPortFree(SIM_PORT)
                  const env =
                    statoIdInner === 'caricamento'
                      ? { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '2500' }
                      : { APP_MENU_DEV_SIMULATE_LOAD_ERROR: '1' }
                  simChild = startMenuDevServer(SIM_PORT, env)
                  activeSim = simChild
                  pageBase = `http://localhost:${SIM_PORT}`
                  await waitForUrl(pageBase)
                }
                const { ctx: sctx, page: sp } = await newPage(browser, profiloKey, temaKey, pageBase)
                activeCtx = sctx
                await loginApp(sp, pageBase, testUser.email, testPassword)
                try {
                  if (statoIdInner === 'caricamento') {
                    await sp.goto(config.path, { waitUntil: 'commit' })
                    await sleep(600)
                  } else if (statoIdInner === 'errore-caricamento') {
                    await sp.goto(config.path, { waitUntil: 'networkidle' })
                  } else {
                    const okState = await prepareMenuListState(sp, config, statoIdInner, ctx, { skipFixture: true })
                    if (!okState) {
                      outRows.push(...nonProvatoRows(sch, pt, 'stato non preparato'))
                      await sctx.close()
                      return
                    }
                  }
                } catch (e) {
                  report.anomalie.push(`${screenId} stato ${statoIdInner}: ${e.message}`)
                }
                if (runCtx.shouldRun('C1') && C1_PROFILES.has(profiloKey)) {
                  const r = await checkScrollOrizzontale(sp)
                  outRows.push({ id: 'C1', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: statoIdInner })
                }
                if (runCtx.shouldRun('C2') && C2_PROFILES.has(profiloKey)) {
                  const r = await checkToccoMinimo(sp)
                  let misuratoC2 = r.misurato
                  if (statoIdInner === 'elimina' || statoIdInner === 'elimina-senza-uso') {
                    const dims = await measureDeleteDialogButtons(sp)
                    if (dims?.indietro && dims?.elimina) {
                      misuratoC2 = `Indietro ${dims.indietro}; Elimina ${dims.elimina}${r.ok ? '' : `; violazioni C2: ${r.misurato}`}`
                    }
                  }
                  outRows.push({
                    id: 'C2',
                    schermata: sch,
                    profiloTema: pt,
                    esito: resultToEsito(r),
                    misurato: misuratoC2,
                    atteso: r.atteso,
                    evidenza: statoIdInner,
                  })
                }
                if (runCtx.shouldRun('C3')) {
                  const r = await checkTemaClasse(sp, CONTROLLI.temi[temaKey].html_dark)
                  outRows.push({ id: 'C3', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: statoIdInner })
                }
                if (profiloKey === 'notebook-1280' && runCtx.shouldRun('C2-mouse')) {
                  const r = await checkAltezzaMouse(sp)
                  outRows.push({ id: 'C2-mouse', schermata: sch, profiloTema: pt, esito: resultToEsito(r, true), misurato: r.misurato, atteso: r.atteso, evidenza: statoIdInner })
                }
                await sctx.close()
                activeCtx = null
              } finally {
                if (simChild) {
                  simChild.kill('SIGTERM')
                  activeSim = null
                  await waitForPortFree(SIM_PORT)
                }
              }
            }
            try {
              await runWithStateTimeout(() => runOne(), statoIdInner)
            } catch (e) {
              if (activeCtx) await activeCtx.close().catch(() => {})
              if (activeSim) {
                activeSim.kill('SIGTERM')
                await waitForPortFree(SIM_PORT).catch(() => {})
              }
              const motivo =
                e.code === 'UI_VERIFY_TIMEOUT' || String(e.message).startsWith('tempo:')
                  ? `tempo: ${statoIdInner}`
                  : e.message
              outRows.push(...nonProvatoRows(sch, pt, motivo))
              report.anomalie.push(`${screenId} C1/C2 ${statoIdInner} ${profiloKey}/${temaKey}: ${motivo}`)
            }
            return outRows
          }

          if (MATRIX_SERIAL_STATES.has(statoId)) {
            for (const cell of cells) {
              const rows = await runCell(cell.statoId, cell.profiloKey, cell.temaKey)
              for (const row of rows) addRow(report, row)
            }
          } else {
            const packs = await runMatrixCellsParallel(cells, async (cell) => ({
              sortKey: cell.sortKey,
              rows: await runCell(cell.statoId, cell.profiloKey, cell.temaKey),
            }))
            for (const pack of packs) {
              for (const row of pack.rows) addRow(report, row)
            }
          }
          menuDeleteVerifyPrefix()
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
