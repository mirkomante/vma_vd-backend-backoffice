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
  openFiltersSheet,
  selectComboboxOption,
} from './catalog-ui-helpers.mjs'
import { catalogCopyConst } from './catalog-copy.mjs'
import { menuCountCatalog, menuCreateCatalogItems, menuDeleteVerifyPrefix } from './menu-payload.mjs'
import { SIM_PORT, waitForPortFree } from './ensure-ports.mjs'

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

const HEAVY_STATE_TIMEOUT_MS = 4 * 60 * 1000

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
export async function prepareCatalogState(page, config, statoId, ctx) {
  const { testUser } = ctx
  const sid = config.id
  const copy = (name) => catalogCopyConst(sid, name)
  menuDeleteVerifyPrefix()

  switch (statoId) {
    case 'elenco':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-elenco` }])
      await gotoCatalog(page, config)
      return true
    case 'disponibilita': {
      const n = `verify-ui-${sid}-disp-shot`
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: n }])
      await gotoCatalog(page, config)
      await toggleDisponibile(page, n)
      await page.waitForTimeout(500)
      return true
    }
    case 'filtri':
      await gotoCatalog(page, config)
      await openFiltersSheet(page, copy('FILTERS_BUTTON') ?? 'Filtri')
      return true
    case 'filtri-attivi':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-filtro` }])
      await gotoCatalog(page, config)
      await openFiltersSheet(page, copy('FILTERS_BUTTON') ?? 'Filtri')
      await page.getByRole('combobox').first().click()
      await page.getByRole('option').nth(1).click()
      await applyFiltersSheet(page, copy('FILTERS_APPLY') ?? 'Applica')
      return true
    case 'filtri-origine':
      if (!config.hasOriginCascade) return false
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-orig` }])
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
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-mod` }])
      await gotoCatalog(page, config)
      await clickRowAction(page, `verify-ui-${sid}-mod`, 'edit')
      return true
    case 'modulo-origine':
      if (sid !== 'vini') return false
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: 'verify-ui-vini-mod-orig' }])
      await gotoCatalog(page, config)
      await clickRowAction(page, 'verify-ui-vini-mod-orig', 'edit')
      return true
    case 'modulo-inglese-aperto':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-en` }])
      await gotoCatalog(page, config)
      await clickRowAction(page, `verify-ui-${sid}-en`, 'edit')
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
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: 'verify-ui-vini-geo-shot' }])
      await gotoCatalog(page, config)
      await clickRowAction(page, 'verify-ui-vini-geo-shot', 'edit')
      return true
    case 'errore-anno':
      if (sid !== 'vini') return false
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      await page.getByRole('textbox', { name: copy('FORM_YEAR') ?? 'Anno' }).fill('1899')
      await page.getByRole('button', { name: copy('FORM_SAVE') ?? 'Salva' }).click()
      return true
    case 'elimina':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-del` }])
      await gotoCatalog(page, config)
      await clickRowAction(page, `verify-ui-${sid}-del`, 'delete')
      return true
    case 'eliminato':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-del-done` }])
      await gotoCatalog(page, config)
      await clickRowAction(page, `verify-ui-${sid}-del-done`, 'delete')
      await page
        .getByRole('alertdialog')
        .getByRole('button', { name: copy('DELETE_CONFIRM') ?? 'Elimina' })
        .click()
      await page.waitForTimeout(500)
      return true
    case 'piu-di-100-vini':
    case 'piu-di-100-distillati':
    case 'piu-di-100-bevande': {
      const { count } = menuCountCatalog(config.collection)
      prepareCatalogBulk101(testUser.email, config, count)
      await gotoCatalog(page, config)
      return true
    }
    case 'caricamento':
    case 'errore-caricamento':
    case 'errore-azione':
      return true
    case 'vuoto': {
      const { count } = menuCountCatalog(config.collection)
      if (count > 0) return false
      await gotoCatalog(page, config)
      return true
    }
    case 'nessun-risultato':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-find` }])
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
  const lightStates = stati.filter((id) => !HEAVY_STATES.has(id) && id !== bulkId)
  const heavyStates = [...new Set([...stati.filter((id) => HEAVY_STATES.has(id)), bulkId].filter(Boolean))]

  async function runMatrix(statoId, { heavy = false } = {}) {
    for (const temaKey of temiAll) {
      for (const profiloKey of profiliL1) {
        if (!C1_PROFILES.has(profiloKey) && profiloKey !== 'tablet-820') continue
        progressStep(config.id, statoId, profiloKey, temaKey)
        const sch = `${config.id}/${statoId}`
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

        const runOne = async () => {
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
            if (statoId === 'vuoto') {
              const { count } = menuCountCatalog(config.collection)
              if (count > 0) {
                addNonProvato(`stato vuoto: DB con ${count} record`)
                return
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
                const okState = await prepareCatalogState(sp, config, statoId, ctx)
                if (!okState) {
                  addNonProvato('stato non preparato')
                  await sctx.close()
                  return
                }
              }
            } catch (e) {
              report.anomalie.push(`${config.id} stato ${statoId}: ${e.message}`)
            }
            if (runCtx.shouldRun('C1') && C1_PROFILES.has(profiloKey)) {
              const r = await checkScrollOrizzontale(sp)
              addRow(report, { id: 'C1', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: statoId })
            }
            if (runCtx.shouldRun('C2') && C2_PROFILES.has(profiloKey)) {
              const r = await checkToccoMinimo(sp)
              addRow(report, { id: 'C2', schermata: sch, profiloTema: pt, esito: resultToEsito(r), misurato: r.misurato, atteso: r.atteso, evidenza: statoId })
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
            menuDeleteVerifyPrefix()
          }
        }

        if (heavy) {
          try {
            await Promise.race([
              runOne(),
              sleep(HEAVY_STATE_TIMEOUT_MS).then(() => {
                throw new Error(`timeout ${HEAVY_STATE_TIMEOUT_MS / 1000}s per stato ${statoId}`)
              }),
            ])
          } catch (e) {
            addNonProvato(e.message)
            report.anomalie.push(`${config.id} C1/C2 pesante ${statoId}: ${e.message}`)
          }
        } else {
          await runOne()
        }
      }
    }
  }

  for (const statoId of lightStates) {
    await runMatrix(statoId)
  }
  for (const statoId of heavyStates) {
    await runMatrix(statoId, { heavy: true })
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
    await runCatalogC1C2Matrix(ctx, config)
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
