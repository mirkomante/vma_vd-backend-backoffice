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
  clearComboboxToEmptyOption,
  openFiltersSheet,
  showMoreButtonLabel,
  toggleWineNvCheckbox,
} from './catalog-ui-helpers.mjs'
import { menuCreateCatalogItems, menuDeleteVerifyPrefix } from './menu-payload.mjs'

const C1_PROFILES = new Set(['telefono-360', 'telefono-390', 'notebook-1280'])
const C2_PROFILES = new Set(['telefono-390', 'tablet-820'])

const HEAVY_STATES = new Set(['piu-di-100-vini', 'piu-di-100-distillati', 'piu-di-100-bevande', 'caricamento', 'errore-caricamento', 'vuoto'])

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

async function isCatalogScreenReady(page, config) {
  const h1 = (await page.locator('h1').innerText().catch(() => '')).trim()
  if (h1 !== config.h1) return false
  return !(await isSegnapostoMain(page))
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

async function gotoCatalog(page, config) {
  await page.goto(config.path, { waitUntil: 'networkidle' })
  await page.locator('h1', { hasText: config.h1 }).waitFor({ timeout: 20000 })
}

/**
 * Prepara uno stato UI (usato da C1/C2 e confronto visivo dopo I3).
 * Restituisce false se lo stato non è ancora automatizzabile senza la pagina.
 */
export async function prepareCatalogState(page, config, statoId, ctx) {
  const { testUser } = ctx
  menuDeleteVerifyPrefix()
  switch (statoId) {
    case 'elenco':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${config.id}-elenco` }])
      await gotoCatalog(page, config)
      return true
    case 'filtri':
      await gotoCatalog(page, config)
      await openFiltersSheet(page)
      return true
    case 'filtri-origine':
      if (!config.hasOriginCascade) return false
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${config.id}-orig` }])
      await gotoCatalog(page, config)
      await openFiltersSheet(page)
      await applyOriginFilterCascade(page, {
        country: 'Italia',
        region: 'Friuli Venezia Giulia',
        appellation: 'Collio',
      })
      return true
    case 'nuovo':
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      return true
    case 'modulo-anno':
      if (config.id !== 'vini') return false
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      return true
    case 'nessun-risultato':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${config.id}-find` }])
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
  const { browser, baseUrl, report, runCtx, CONTROLLI, newPage, loginApp, testUser, testPassword, addRow } = ctx
  const executed = new Set()
  const add = (id, esito, misurato, atteso, evidenza, profiloTema = 'telefono-390/chiaro') => {
    if (!runCtx.shouldRun(id)) return
    executed.add(id)
    addRow(report, { id, schermata: config.id, profiloTema, esito, misurato, atteso, evidenza })
  }

  try {
    if (runCtx.shouldRun(`${config.id}-testi`)) {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoCatalog(page, config)
      const main = await page.locator('main').innerText()
      const missing = []
      if (!main.includes(config.h1)) missing.push('h1')
      if (!main.includes(config.newButton)) missing.push('pulsante')
      if ((await page.getByPlaceholder(config.searchPlaceholder).count()) < 1) missing.push('ricerca')
      add(
        `${config.id}-testi`,
        missing.length ? 'FALLITO' : 'OK',
        missing.length ? missing.join(', ') : 'testi principali',
        'testi §6 spec',
        config.path,
      )
      await pctx.close()
    }

    if (config.id === 'vini' && runCtx.shouldRun('vini-filtri-origine')) {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoCatalog(page, config)
      const failures = []
      try {
        await openFiltersSheet(page)
        const regionDisabled = await page.getByRole('combobox', { name: 'Regione' }).isDisabled()
        if (!regionDisabled) failures.push('regione senza paese non disabilitata')
        await applyOriginFilterCascade(page, {
          country: 'Italia',
          region: 'Friuli Venezia Giulia',
          appellation: 'Collio',
        })
        await applyFiltersSheet(page)
        await openFiltersSheet(page)
        await clearComboboxToEmptyOption(page, 'Paese', '—')
        await applyFiltersSheet(page)
      } catch (e) {
        failures.push(e.message)
      }
      add(
        'vini-filtri-origine',
        failures.length ? 'FALLITO' : 'OK',
        failures.join(' | ') || 'cascata filtri origine',
        'foglio filtri origine §7',
        config.path,
      )
      await pctx.close()
    }

    if (config.id === 'vini' && runCtx.shouldRun('vini-modulo-anno')) {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoCatalog(page, config)
      const failures = []
      try {
        await page.getByRole('button', { name: config.newButton }).click()
        const year = page.getByRole('textbox', { name: 'Anno' })
        await year.fill('12a')
        const val = await year.inputValue()
        if (val !== '12') failures.push(`anno accetta non-cifre: ${val}`)
        await toggleWineNvCheckbox(page)
        if (!(await year.isDisabled())) failures.push('anno non disabilitato con NV')
        await toggleWineNvCheckbox(page)
        if (await year.isDisabled()) failures.push('anno resta disabilitato senza NV')
      } catch (e) {
        failures.push(e.message)
      }
      add('vini-modulo-anno', failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'anno/NV', 'modulo anno', config.path)
      await pctx.close()
    }

    if (runCtx.shouldRun(`${config.id}-ordine-100`)) {
      add(
        `${config.id}-ordine-100`,
        'NON PROVATO',
        '—',
        '101 record e «Mostra altri …»',
        'completamento flusso dopo I3 (bulk verify-ui-…)',
      )
    }

    const rinviati = [`${config.id}-ricompila`]
    for (const id of rinviati) {
      if (!runCtx.shouldRun(id)) continue
      add(id, 'NON PROVATO', '—', '—', 'rinviato alla 6.5')
    }

    if (runCtx.shouldRun(`${config.id}-accesso`)) {
      add(`${config.id}-accesso`, 'NON PROVATO', '—', 'guardia 8.3', 'verify-roles-8_3.ts')
    }
    if (runCtx.shouldRun(`${config.id}-stato-vuoto`)) {
      add(`${config.id}-stato-vuoto`, 'NON PROVATO', '—', 'vuoto DB', 'non si svuota il DB dev')
    }
    if (runCtx.shouldRun(`${config.id}-confronto-visivo`)) {
      add(
        `${config.id}-confronto-visivo`,
        'NON PROVATO',
        '—',
        'screenshot C10',
        'esecuzione confronto visivo al passo V (dopo I3)',
      )
    }

    for (const id of catalogControlIdsFromControlli(CONTROLLI, config.id)) {
      if (!runCtx.shouldRun(id) || executed.has(id)) continue
      const ctrl = controlDef(CONTROLLI, config.id, id)
      if (isRinviato65(ctrl)) {
        add(id, 'NON PROVATO', '—', '—', 'rinviato alla 6.5')
        continue
      }
      add(
        id,
        'NON PROVATO',
        '—',
        ctrl?.tipo ?? 'flusso',
        'debito passo V: flusso da completare dopo implementazione I3',
      )
    }
  } finally {
    menuDeleteVerifyPrefix()
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
  } = ctx
  const screen = CONTROLLI.schermate?.find((s) => s.id === config.id)
  const stati = screen?.stati_c1_c2 ?? []
  const temiAll = runCtx.temiKeys().filter((t) => ['chiaro', 'scuro'].includes(t))
  const profiliL1 = runCtx.profiliAccess().filter((p) => ['telefono-390', 'notebook-1280'].includes(p))

  for (const statoId of stati) {
    if (HEAVY_STATES.has(statoId)) continue
    for (const temaKey of temiAll) {
      for (const profiloKey of profiliL1) {
        if (!C1_PROFILES.has(profiloKey) && profiloKey !== 'tablet-820') continue
        progressStep(config.id, statoId, profiloKey, temaKey)
        const sch = `${config.id}/${statoId}`
        const pt = `${profiloKey}/${temaKey}`
        const { ctx: sctx, page: sp } = await newPage(browser, profiloKey, temaKey, baseUrl)
        await loginApp(sp, baseUrl, testUser.email, testPassword)
        try {
          const okState = await prepareCatalogState(sp, config, statoId, ctx)
          if (!okState) {
            for (const id of ['C1', 'C2', 'C3', 'C2-mouse']) {
              if (!runCtx.shouldRun(id)) continue
              addRow(report, {
                id,
                schermata: sch,
                profiloTema: pt,
                esito: 'NON PROVATO',
                misurato: 'stato non preparato',
                atteso: id,
                evidenza: statoId,
              })
            }
            await sctx.close()
            continue
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
        } catch (e) {
          report.anomalie.push(`${config.id} C1/C2 ${statoId}: ${e.message}`)
        } finally {
          menuDeleteVerifyPrefix()
          await sctx.close()
        }
      }
    }
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

/** Helper per ordine-100 (dopo I3): crea fino a 101 record verify-ui-…. */
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
  const label = showMoreButtonLabel(config.id)
  await page.getByRole('button', { name: label }).click()
  await sleep(500)
}
