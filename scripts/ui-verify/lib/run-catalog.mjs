import {
  checkScrollOrizzontale,
  checkTemaClasse,
  checkToccoMinimo,
  checkAltezzaMouse,
  isSegnapostoMain,
} from './engine.mjs'
import { catalogControlIdsFromControlli } from './controlli-handlers.mjs'
import { CATALOG_SCREENS, CATALOG_SCREEN_IDS } from './catalog-config.mjs'
import {
  applyFiltersSheet,
  applyOriginFilterCascade,
  measureDeleteDialogButtons,
  openFiltersSheet,
  selectComboboxOption,
} from './catalog-ui-helpers.mjs'
import { waitForAnimationsSettled } from './measure-stable.mjs'
import { catalogCopyConst } from './catalog-copy.mjs'
import { menuCountCatalog, menuCreateCatalogItems, menuDeleteVerifyPrefix } from './menu-payload.mjs'
import { SIM_PORT, waitForPortFree } from './ensure-ports.mjs'
import { runWithStateTimeout } from './timeouts.mjs'
import { applyCatalogFixtures, catalogItemNameForState } from './catalog-fixtures.mjs'
import { MATRIX_SERIAL_STATES, runMatrixCellsParallel, matrixParallelism } from './matrix-parallel.mjs'

const C1_PROFILES = new Set(['telefono-360', 'telefono-390', 'notebook-1280'])
const C2_PROFILES = new Set(['telefono-390', 'tablet-820'])

const HEAVY_STATES = new Set([
  'piu-di-100-vini',
  'piu-di-100-distillati',
  'piu-di-100-bevande',
  'caricamento',
  'errore-caricamento',
  'vuoto',
])

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function isRinviato65(ctrl) {
  return ctrl?.rinviato_a === '6.5' || (ctrl?.stato_prova ?? '').includes('NON PROVABILE')
}

function controlDef(controlli, screenId, controlId) {
  const screen = controlli.schermate?.find((s) => s.id === screenId)
  return screen?.controlli?.find((c) => c.id === controlId)
}

function bulkStateId(config) {
  if (config.id === 'vini') return 'piu-di-100-vini'
  if (config.id === 'distillati') return 'piu-di-100-distillati'
  return 'piu-di-100-bevande'
}

async function clickRowAction(page, name, action) {
  const label =
    action === 'edit'
      ? `Modifica ${name}`
      : action === 'delete'
        ? `Elimina ${name}`
        : action === 'disable'
          ? `Disabilita ${name}`
          : `Abilita ${name}`
  await page.getByRole('button', { name: label }).click()
}

async function toggleDisponibile(page, name) {
  await page.getByRole('switch', { name: `Disponibile: ${name}` }).click()
}

export async function gotoCatalog(page, config) {
  await page.goto(config.path, { waitUntil: 'networkidle' })
  await page.locator('h1', { hasText: config.h1 }).waitFor({ timeout: 20000 })
}

function markCatalogControls(ctx, config, evidenza) {
  const { CONTROLLI, runCtx, addRow, report } = ctx
  const ids = catalogControlIdsFromControlli(CONTROLLI, config.id)
  for (const id of ids) {
    const ctrl = controlDef(CONTROLLI, config.id, id)
    if (!runCtx.shouldRun(id)) continue
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
    if (id.endsWith('-accesso')) {
      addRow(report, {
        id,
        schermata: config.id,
        profiloTema: '—',
        esito: 'NON PROVATO',
        misurato: '—',
        atteso: '—',
        evidenza: 'coperto da verify-roles-8_3.ts (stato_prova JSON)',
      })
      continue
    }
    if (id.endsWith('-stato-vuoto')) {
      addRow(report, {
        id,
        schermata: config.id,
        profiloTema: '—',
        esito: 'NON PROVATO',
        misurato: '—',
        atteso: '—',
        evidenza: 'database di sviluppo non svuotato; giudizio C10',
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

/**
 * Prepara uno stato UI (C1/C2, confronto visivo, screenshot).
 */
export async function prepareCatalogState(page, config, statoId, ctx, options = {}) {
  const { skipFixture = false } = options
  const sid = config.id
  const copy = (name) => catalogCopyConst(sid, name)

  if (!skipFixture) {
    const fx = applyCatalogFixtures(config, statoId, ctx)
    if (!fx.ok) return false
  }

  const itemName = catalogItemNameForState(config, statoId)

  switch (statoId) {
    case 'elenco':
      await gotoCatalog(page, config)
      return true
    case 'disponibilita': {
      await gotoCatalog(page, config)
      await toggleDisponibile(page, itemName)
      await page.waitForTimeout(500)
      return true
    }
    case 'filtri':
      await gotoCatalog(page, config)
      await openFiltersSheet(page, copy('FILTERS_BUTTON') ?? 'Filtri')
      return true
    case 'filtri-attivi':
      await gotoCatalog(page, config)
      await openFiltersSheet(page, copy('FILTERS_BUTTON') ?? 'Filtri')
      await page.getByRole('combobox').first().click()
      await page.getByRole('option').nth(1).click()
      await applyFiltersSheet(page, copy('FILTERS_APPLY') ?? 'Applica')
      return true
    case 'filtri-origine':
      if (!config.hasOriginCascade) return false
      await gotoCatalog(page, config)
      await openFiltersSheet(page)
      await applyOriginFilterCascade(page, {
        country: 'Italia',
        region: 'Friuli Venezia Giulia',
        appellation: 'Collio',
      })
      await applyFiltersSheet(page)
      return true
    case 'modulo':
      await gotoCatalog(page, config)
      await clickRowAction(page, itemName, 'edit')
      return true
    case 'modulo-origine':
      if (sid !== 'vini') return false
      await gotoCatalog(page, config)
      await clickRowAction(page, itemName, 'edit')
      return true
    case 'modulo-inglese-aperto':
      await gotoCatalog(page, config)
      await clickRowAction(page, itemName, 'edit')
      await page.getByRole('button', { name: /Traduzione inglese/i }).click().catch(() => {})
      return true
    case 'origine-senza-regioni':
      if (sid !== 'vini') return false
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      await selectComboboxOption(page, copy('FORM_COUNTRY') ?? 'Paese', 'Giappone')
      return true
    case 'nuovo':
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      return true
    case 'modulo-anno':
      if (sid !== 'vini') return false
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      return true
    case 'nuovo-errori':
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      await page.getByRole('button', { name: copy('FORM_SAVE') ?? 'Salva' }).click()
      return true
    case 'errore-geografia':
      if (sid !== 'vini') return false
      await gotoCatalog(page, config)
      await clickRowAction(page, itemName, 'edit')
      return true
    case 'errore-anno':
      if (sid !== 'vini') return false
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      await page.getByRole('textbox', { name: copy('FORM_YEAR') ?? 'Anno' }).fill('1899')
      await page.getByRole('button', { name: copy('FORM_SAVE') ?? 'Salva' }).click()
      return true
    case 'elimina':
      await gotoCatalog(page, config)
      await clickRowAction(page, itemName, 'delete')
      await page.locator('[role=alertdialog]').waitFor({ timeout: 10000 })
      await waitForAnimationsSettled(page, { rootSelector: '[role=alertdialog]' })
      return true
    case 'eliminato':
      await gotoCatalog(page, config)
      await clickRowAction(page, itemName, 'delete')
      await page
        .getByRole('alertdialog')
        .getByRole('button', { name: copy('DELETE_CONFIRM') ?? 'Elimina' })
        .click()
      await page.waitForTimeout(500)
      return true
    case 'piu-di-100-vini':
    case 'piu-di-100-distillati':
    case 'piu-di-100-bevande':
      await gotoCatalog(page, config)
      return true
    case 'caricamento':
    case 'errore-caricamento':
    case 'errore-azione':
      return true
    case 'vuoto':
      await gotoCatalog(page, config)
      return true
    case 'nessun-risultato':
      await gotoCatalog(page, config)
      await page.getByPlaceholder(config.searchPlaceholder).fill('verify-ui-zzzz-no')
      await sleep(500)
      return true
    default:
      await gotoCatalog(page, config)
      return true
  }
}

export async function runCatalogFlowControls(ctx, config) {
  try {
    const { runCatalogFlowControlsFull } = await import('./run-catalog-flows.mjs')
    await runCatalogFlowControlsFull(ctx, config)
  } catch (e) {
    ctx.report?.anomalie?.push(`${config.id} runCatalogFlowControlsFull: ${e.message}`)
  }
}

export async function runCatalogC1C2Matrix(ctx, config) {
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
    startMenuDevServer,
    waitForUrl,
  } = ctx
  const screen = CONTROLLI.schermate?.find((s) => s.id === config.id)
  const stati = screen?.stati_c1_c2 ?? []
  const temiAll = runCtx.temiKeys().filter((t) => ['chiaro', 'scuro'].includes(t))
  const profiliL1 = runCtx.profiliAccess().filter((p) => ['telefono-390', 'notebook-1280'].includes(p))
  const bulkId = bulkStateId(config)
  let matrixStateIds = [
    ...stati.filter((id) => !HEAVY_STATES.has(id) && id !== bulkId),
    ...new Set([...stati.filter((id) => HEAVY_STATES.has(id)), bulkId].filter(Boolean)),
  ]
  if (runCtx.matrixStateIncluded) {
    matrixStateIds = matrixStateIds.filter((id) => runCtx.matrixStateIncluded(id))
  }

  function buildCellsForState(statoId) {
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
    return cells
  }

  function nonProvatoRows(sch, pt, motivo) {
    const rows = []
    for (const id of ['C1', 'C2', 'C3', 'C2-mouse']) {
      if (!runCtx.shouldRun(id)) continue
      const profiloOnly = pt.split('/')[0]
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
        evidenza: sch.split('/')[1] ?? '—',
      })
    }
    return rows
  }

  async function runMatrixCell(statoId, profiloKey, temaKey) {
    const sch = `${config.id}/${statoId}`
    const pt = `${profiloKey}/${temaKey}`
    progressStep(config.id, statoId, profiloKey, temaKey)

    const addNonProvato = (motivo) => nonProvatoRows(sch, pt, motivo)

    let activeCtx = null
    let activeSim = null
    const outRows = []

    const runOne = async () => {
      let simChild = null
      let pageBase = baseUrl
      try {
        if (MATRIX_SERIAL_STATES.has(statoId)) {
          if (startMenuDevServer && waitForUrl) {
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
        }
        const { ctx: sctx, page: sp } = await newPage(browser, profiloKey, temaKey, pageBase)
        activeCtx = sctx
        await loginApp(sp, pageBase, testUser.email, testPassword)
        try {
          if (statoId === 'caricamento') {
            await sp.goto(config.path, { waitUntil: 'commit' })
            await sleep(600)
          } else if (statoId === 'errore-caricamento') {
            await sp.goto(config.path, { waitUntil: 'networkidle' })
          } else {
            const okState = await prepareCatalogState(sp, config, statoId, ctx, { skipFixture: true })
            if (!okState) {
              outRows.push(...addNonProvato('stato non preparato'))
              await sctx.close()
              return
            }
          }
        } catch (e) {
          report.anomalie.push(`${config.id} stato ${statoId}: ${e.message}`)
        }
        if (runCtx.shouldRun('C1') && C1_PROFILES.has(profiloKey)) {
          const r = await checkScrollOrizzontale(sp)
          outRows.push({ id: 'C1', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: statoId })
        }
        if (runCtx.shouldRun('C2') && C2_PROFILES.has(profiloKey)) {
          const r = await checkToccoMinimo(sp)
          let misuratoC2 = r.misurato
          if (statoId === 'elimina') {
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
            evidenza: statoId,
          })
        }
        if (runCtx.shouldRun('C3')) {
          const r = await checkTemaClasse(sp, CONTROLLI.temi[temaKey].html_dark)
          outRows.push({ id: 'C3', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: statoId })
        }
        if (profiloKey === 'notebook-1280' && runCtx.shouldRun('C2-mouse')) {
          const r = await checkAltezzaMouse(sp)
          outRows.push({ id: 'C2-mouse', schermata: sch, profiloTema: pt, esito: resultToEsito(r, true), misurato: r.misurato, atteso: r.atteso, evidenza: statoId })
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
      await runWithStateTimeout(() => runOne(), statoId)
    } catch (e) {
      if (activeCtx) await activeCtx.close().catch(() => {})
      if (activeSim) {
        activeSim.kill('SIGTERM')
        await waitForPortFree(SIM_PORT).catch(() => {})
      }
      const motivo =
        e.code === 'UI_VERIFY_TIMEOUT' || String(e.message).startsWith('tempo:') ? `tempo: ${statoId}` : e.message
      outRows.push(...addNonProvato(motivo))
      report.anomalie.push(`${config.id} C1/C2 ${statoId} ${profiloKey}/${temaKey}: ${motivo}`)
    }
    return outRows
  }

  async function runMatrix(statoId) {
    progressStep(config.id, 'matrice', statoId, `parallelo×${matrixParallelism()}`)
    if (!MATRIX_SERIAL_STATES.has(statoId)) {
      const fx = applyCatalogFixtures(config, statoId, ctx)
      if (!fx.ok) {
        const cells = buildCellsForState(statoId)
        for (const cell of cells) {
          const sch = `${config.id}/${statoId}`
          const pt = `${cell.profiloKey}/${cell.temaKey}`
          for (const row of nonProvatoRows(sch, pt, fx.reason ?? 'stato non preparato')) addRow(report, row)
        }
        return
      }
    }

    const cells = buildCellsForState(statoId)
    if (MATRIX_SERIAL_STATES.has(statoId)) {
      for (const cell of cells) {
        const rows = await runMatrixCell(cell.statoId, cell.profiloKey, cell.temaKey)
        for (const row of rows) addRow(report, row)
      }
      menuDeleteVerifyPrefix()
      return
    }

    const parallelResults = await runMatrixCellsParallel(cells, async (cell) => {
      const rows = await runMatrixCell(cell.statoId, cell.profiloKey, cell.temaKey)
      return { sortKey: cell.sortKey, rows }
    })
    for (const pack of parallelResults) {
      for (const row of pack.rows) addRow(report, row)
    }
    menuDeleteVerifyPrefix()
  }

  for (const statoId of matrixStateIds) {
    await runMatrix(statoId)
  }
}

export async function runCatalogScreens(ctx) {
  for (const screenId of CATALOG_SCREEN_IDS) {
    if (!ctx.runCtx.screenIncluded(screenId)) continue
    const config = CATALOG_SCREENS[screenId]
    const { browser, baseUrl, newPage, loginApp, testUser, testPassword } = ctx
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await page.goto(config.path, { waitUntil: 'networkidle' })
    const ready = await isCatalogScreenReady(page, config)
    await pctx.close()

    if (!ready) {
      markCatalogControls(ctx, config, 'schermata non ancora implementata')
      continue
    }
    await runCatalogFlowControls(ctx, config)
    const matrixControlIds = ['C1', 'C2', 'C3', 'C2-mouse']
    if (matrixControlIds.some((id) => ctx.runCtx.shouldRun(id))) {
      await runCatalogC1C2Matrix(ctx, config)
    }
  }
}

async function isCatalogScreenReady(page, config) {
  const h1 = (await page.locator('h1').innerText().catch(() => '')).trim()
  if (h1 !== config.h1) return false
  return !(await isSegnapostoMain(page))
}

/** Helper per ordine-100: crea fino a 101 record verify-ui-…. */
export function prepareCatalogBulk101(managerEmail, config, existingCount) {
  const need = Math.max(0, 101 - existingCount)
  const specs = []
  for (let i = 1; i <= need; i += 1) {
    specs.push({ name: `${config.bulkPrefix}${String(i).padStart(3, '0')}` })
  }
  if (specs.length) menuCreateCatalogItems(managerEmail, config.collection, specs)
  return specs.length
}

export async function runCatalogShowMoreFlow(page, config) {
  const label = config.showMore
  await page.getByRole('button', { name: label }).click()
  await sleep(500)
}
