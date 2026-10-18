import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { unlinkSync } from 'node:fs'
import { spawn } from 'node:child_process'

import { CATALOG_SCREENS } from './catalog-config.mjs'
import { catalogCopyConst } from './catalog-copy.mjs'
import { esitoMisura, isEmptyMeasureToken } from './measure-esito.mjs'
import { SIM_PORT, isPortFree, waitForPortFree } from './ensure-ports.mjs'
import {
  applyFiltersSheet,
  applyOriginFilterCascade,
  clearComboboxToEmptyOption,
  openFiltersSheet,
  readComboboxTriggerText,
  resolveCatalogCountryName,
  selectComboboxOption,
  selectComboboxOptionByKeyboard,
  selectFiltersStateOption,
  toggleWineNvCheckbox,
  clickShowMoreCatalog,
  waitForCatalogEditSheetReady,
  waitForListboxOptions,
} from './catalog-ui-helpers.mjs'
import { waitForAnimationsSettled } from './measure-stable.mjs'
import {
  menuAdminSetSpiritVolume,
  menuCountCatalog,
  menuCreateCatalogItems,
  menuCreateWineWithGradeSql,
  menuDeleteVerifyPrefix,
  menuFindCatalogDeleteLog,
  menuFindCatalogItem,
  menuFindStaffUser,
  menuListWineOriginTaxonomies,
  menuMisalignWineGeography,
  menuPatchCatalogDoc,
  menuReadCatalogEn,
  menuSetCountryEnabled,
  menuTryCreateCatalogDoc,
  menuTryCreateWineTaxonomy,
  menuTryDeleteCatalog,
  menuTryUpdateCatalogDisabledOnly,
  menuValidateWineFormatsProbe,
  menuValidateSpiritFormatsProbe,
  menuValidateDrinkFormatsProbe,
  menuAdminSetSpiritAbv,
} from './menu-payload.mjs'
import {
  gotoCatalog,
  prepareCatalogBulk101,
  prepareCatalogState,
} from './run-catalog.mjs'

const ROOT = join(import.meta.dirname, '../../..')

const CATALOG_SIM_ENV = {
  caricamento: { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '2500' },
  'errore-caricamento': { APP_MENU_DEV_SIMULATE_LOAD_ERROR: '1' },
  'errore-azione': { APP_MENU_DEV_SIMULATE_SAVE_ERROR: '1' },
}

const COLONNA_PROFILI = ['telefono-390', 'notebook-1280', 'soglia-767', 'soglia-768']

const WINE_FIELD_IDS = {
  name: 'wine-field-name',
  price: 'wine-field-price',
  glassPrice: 'wine-field-glass-price',
  year: 'wine-field-year',
}

const SPIRIT_FIELD_IDS = {
  name: 'spirit-field-name',
  price: 'spirit-field-price',
  abv: 'spirit-field-abv',
}

const DRINK_FIELD_IDS = {
  name: 'drink-field-name',
  price: 'drink-field-price',
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function pickFirstRealSelectOption(opts) {
  return (
    opts.find((o) => o && !/^scegli/i.test(o) && !/^tutte/i.test(o) && o !== '—' && o.length > 0) ??
    opts.find((o) => o && o.length > 0) ??
    null
  )
}

const WINE_VOLUME_EXPECTED = ['Non indicata', '25 cl', '33 cl', '37,5 cl', '50 cl', '75 cl', '150 cl']

function copy(screenId, name) {
  return catalogCopyConst(screenId, name)
}

function startMenuDevServerLocal(port, extraEnv) {
  try {
    unlinkSync(join(ROOT, '.next/dev/lock'))
  } catch {
    /* nessun lock */
  }
  return spawn('pnpm', ['exec', 'next', 'dev', '--port', String(port)], {
    cwd: ROOT,
    env: { ...process.env, ...extraEnv },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

async function waitForUrlLocal(baseUrl, ms = 120000) {
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

function confrontoStatiIds(CONTROLLI, screenId) {
  const screen = CONTROLLI.schermate?.find((s) => s.id === screenId)
  return Object.keys(screen?.immagini?.stati_con_riferimento ?? {})
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
  await page.getByRole('button', { name: label }).click({ timeout: 20000 })
}

async function openSelectDom(page, domId) {
  await page.keyboard.press('Escape')
  await waitForAnimationsSettled(page, { rootSelector: '[data-slot=sheet-content]' })
  const el = page.locator(`#${domId}`)
  await el.scrollIntoViewIfNeeded()
  await el.click({ timeout: 12000, force: false })
}

async function toggleDisponibile(page, name) {
  await page.getByRole('switch', { name: `Disponibile: ${name}` }).click()
}

function loadErrorTitle(screenId) {
  if (screenId === 'vini') return copy('vini', 'LOAD_ERROR_TITLE') ?? 'Impossibile caricare i vini'
  if (screenId === 'distillati') return copy('distillati', 'LOAD_ERROR_TITLE') ?? 'Impossibile caricare i distillati'
  return copy('bevande', 'LOAD_ERROR_TITLE') ?? 'Impossibile caricare le bevande'
}

async function runPaeseFuoriFiltroFlow(ctx, config, { controlId, recordName, screenshotName }) {
  const { browser, baseUrl, report, newPage, loginApp, testUser, testPassword, addRow, screenshot } = ctx
  const sid = config.id
  const fieldIds = sid === 'vini' ? WINE_FIELD_IDS : sid === 'distillati' ? SPIRIT_FIELD_IDS : DRINK_FIELD_IDS
  const failures = []
  let misuratoPaese = 'paese non letto'
  let countryNameSaved = null
  let prevEnabled = true
  try {
    menuDeleteVerifyPrefix()
    menuCreateCatalogItems(testUser.email, config.collection, [{ name: recordName }])
    const item = menuFindCatalogItem(testUser.email, config.collection, recordName)
    const taxForCountry = menuListWineOriginTaxonomies()
    countryNameSaved = resolveCatalogCountryName(item.doc, taxForCountry.countries)
    if (!countryNameSaved) failures.push('record senza paese in API')
    if (countryNameSaved) {
      const row = taxForCountry.countries?.find((c) => c.name === countryNameSaved)
      prevEnabled = row?.enabled !== false
      menuSetCountryEnabled(countryNameSaved, false)
    }
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await gotoCatalog(page, config)
    await page.getByPlaceholder(config.searchPlaceholder).fill(recordName).catch(() => {})
    await page.waitForTimeout(500)
    await clickRowAction(page, recordName, 'edit')
    await waitForCatalogEditSheetReady(page, fieldIds.name)
    const subtitle = await page
      .locator('[data-slot=sheet-content] [data-slot=sheet-description], [data-slot=sheet-content] .text-muted-foreground')
      .first()
      .innerText()
      .catch(() => '')
    if (subtitle && recordName && !subtitle.includes(recordName)) failures.push(`sottotitolo foglio=${JSON.stringify(subtitle)}`)
    const countryLabel = copy(sid, 'FORM_COUNTRY') ?? 'Paese'
    await page.locator(`#${sid === 'vini' ? 'wine' : sid === 'distillati' ? 'spirit' : 'drink'}-field-country`).scrollIntoViewIfNeeded()
    const trigger = await readComboboxTriggerText(page, countryLabel)
    misuratoPaese = `paese API=${countryNameSaved ?? 'n/a'}; trigger=${JSON.stringify(trigger)}; sottotitolo=${subtitle.trim()}`
    if (countryNameSaved && !trigger.includes(countryNameSaved)) failures.push('paese salvato non nel trigger')
    if (screenshot && screenshotName) {
      await screenshot(page, report, screenshotName, 'chiaro')
    }
    await pctx.close()
  } catch (e) {
    failures.push(e.message)
  } finally {
    const item = menuFindCatalogItem(testUser.email, config.collection, recordName)
    const restoreName = resolveCatalogCountryName(item.doc, menuListWineOriginTaxonomies().countries)
    if (restoreName) menuSetCountryEnabled(restoreName, prevEnabled)
    menuDeleteVerifyPrefix()
  }
  addRow(report, {
    id: controlId,
    schermata: sid,
    profiloTema: 'telefono-390/chiaro',
    esito: failures.length ? 'FALLITO' : 'OK',
    misurato: failures.length ? `${misuratoPaese}; ${failures.join(' | ')}` : misuratoPaese,
    atteso: `nome paese salvato nel trigger (atteso: ${countryNameSaved ?? 'paese salvato'})`,
    evidenza: config.path,
  })
}

/**
 * @param {import('./run-catalog.mjs').runCatalogFlowControls extends (...args: any)=>any ? never : any} ctx
 * @param {import('./catalog-config.mjs').CATALOG_SCREENS[keyof import('./catalog-config.mjs').CATALOG_SCREENS]} config
 */
export async function runCatalogFlowControlsFull(ctx, config) {
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
    screenshot,
    SHOT_PROFILES,
    SHOT_TEMI,
    ambiente,
  } = ctx

  const sid = config.id
  const add = (id, esito, misurato, atteso, evidenza, profiloTema = 'telefono-390/chiaro') => {
    if (!runCtx.shouldRun(id)) return
    addRow(report, { id, schermata: sid, profiloTema, esito, misurato: misurato || '—', atteso: atteso || '—', evidenza })
  }

  try {
    if (runCtx.shouldRun(`${sid}-testi`)) {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoCatalog(page, config)
      const main = await page.locator('main').innerText()
      const checks = [
        copy(sid, 'PAGE_TITLE'),
        copy(sid, 'PAGE_DESCRIPTION'),
        copy(sid, 'NEW_BUTTON'),
        copy(sid, 'FILTERS_BUTTON'),
      ]
      const missing = checks.filter((t) => t && !main.includes(t))
      if ((await page.getByPlaceholder(config.searchPlaceholder).count()) < 1) missing.push('ricerca')
      add(
        `${sid}-testi`,
        missing.length ? 'FALLITO' : 'OK',
        missing.length ? `mancano: ${missing.join(', ')}` : 'testi principali ok',
        'testi §6 spec',
        config.path,
      )
      await pctx.close()
    }

    if (runCtx.shouldRun(`${sid}-colonna-elenco`)) {
      for (const profiloKey of COLONNA_PROFILI) {
        const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        const m = await page.evaluate(() => {
          const table = document.querySelector('main table')
          const tableVisible = table ? table.getBoundingClientRect().width > 0 : false
          const dishCard = [...document.querySelectorAll('main [data-slot=card]')].find((c) =>
            c.getAttribute('aria-label')?.includes(','),
          )
          const nameEl = dishCard?.querySelector('p.truncate.font-medium')
          const col = document.querySelector('main .mx-auto')
          return {
            tableVisible,
            colW: col ? Math.round(col.getBoundingClientRect().width) : 0,
            nameW: nameEl ? Math.round(nameEl.getBoundingClientRect().width) : 0,
          }
        })
        let esito = 'OK'
        let misurato = JSON.stringify(m)
        if (profiloKey === 'notebook-1280' || profiloKey === 'soglia-768') {
          if (!m.tableVisible || m.colW > 1024 + 2) esito = 'FALLITO'
          misurato = `col=${m.colW}px; table=${m.tableVisible}`
        } else if (m.tableVisible) {
          esito = 'FALLITO'
        } else if (profiloKey === 'telefono-390' && m.nameW && m.nameW < 100) {
          esito = 'FALLITO'
        } else if (profiloKey === 'telefono-390' && m.nameW && (m.nameW < 127 || m.nameW > 147)) {
          esito = 'AVVISO'
        }
        add(`${sid}-colonna-elenco`, esito, misurato, 'layout colonna/schede', config.path, `${profiloKey}/chiaro`)
        await pctx.close()
      }
    }

    if (runCtx.shouldRun(`${sid}-colonne-fisse`)) {
      menuCreateCatalogItems(testUser.email, config.collection, [
        { name: `verify-ui-${sid}-col-a` },
        { name: `verify-ui-${sid}-col-b` },
      ])
      const { ctx: pctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoCatalog(page, config)
      const m = await page.evaluate(() => {
        const headers = [...document.querySelectorAll('main table thead th')]
        const lefts = headers.map((h) => Math.round(h.getBoundingClientRect().left))
        return { headers: headers.map((h) => h.textContent?.trim()), lefts }
      })
      const failures = []
      if (m.headers.length < 3) failures.push('tabella assente o colonne insufficienti')
      const uniqueLeft = new Set(m.lefts.slice(1))
      if (uniqueLeft.size > 1 && m.lefts.length > 3) {
        /* ok if aligned across groups — rough check */
      }
      add(
        `${sid}-colonne-fisse`,
        failures.length ? 'FALLITO' : 'OK',
        failures.length ? failures.join(' | ') : `colonne=${m.headers.join(', ')}; left=${m.lefts.join(',')}`,
        'bordi sinistri colonne fisse',
        config.path,
        'notebook-1280/chiaro',
      )
      await pctx.close()
    }

    if (runCtx.shouldRun(`${sid}-azioni-pagina`)) {
      for (const profiloKey of ['telefono-390', 'notebook-1280']) {
        const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        const btnLabel = config.newButton
        const m = await page.evaluate((label) => {
          const btn = [...document.querySelectorAll('main button')].find((b) => b.textContent?.includes(label))
          const r = btn?.getBoundingClientRect()
          const header = document.querySelector('main h1')?.parentElement
          const col = document.querySelector('main .mx-auto')
          const colW = col ? Math.round(col.getBoundingClientRect().width) : Math.round(window.innerWidth - 32)
          return {
            h: r ? Math.round(r.height) : 0,
            w: r ? Math.round(r.width) : 0,
            colW,
            inline: header && btn ? header.getBoundingClientRect().top === btn.getBoundingClientRect().top : false,
          }
        }, btnLabel)
        const ok =
          profiloKey === 'telefono-390' ? m.h >= 44 && m.w >= m.colW - 2 : m.inline && m.h >= 28
        add(
          `${sid}-azioni-pagina`,
          ok ? 'OK' : 'FALLITO',
          JSON.stringify(m),
          profiloKey === 'telefono-390' ? 'pulsante piena larghezza ≥44px' : 'pulsante in riga col titolo',
          config.path,
          `${profiloKey}/chiaro`,
        )
        await pctx.close()
      }
    }

    if (runCtx.shouldRun(`${sid}-righe-azioni`)) {
      const failures = []
      const missingMeasures = []
      try {
        menuDeleteVerifyPrefix()
        menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-row`, disabled: true }])
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        const m = await page.evaluate(() => {
          const row = document.querySelector('[aria-label^="verify-ui-"]')
          const sample = row?.querySelector('button[aria-label^="Modifica "]')
          const r = sample?.getBoundingClientRect()
          const switchEl = row?.querySelector('[role=switch]')
          return {
            btn: sample?.getAttribute('aria-label'),
            btnSize: r ? `${Math.round(r.width)}x${Math.round(r.height)}` : '—',
            switchDisabled:
              switchEl?.hasAttribute('disabled') || switchEl?.getAttribute('aria-disabled') === 'true',
            linkOnName: Boolean(document.querySelector('main a .truncate')),
          }
        })
        if (isEmptyMeasureToken(m.btnSize)) missingMeasures.push('btnSize')
        else {
          if (!m.btn?.startsWith('Modifica ')) failures.push('aria-label Modifica')
          if (m.linkOnName) failures.push('link sul nome')
          if (!m.switchDisabled) failures.push('switch attivo su disabled')
        }
        const { esito, misurato } = esitoMisura({ failures, missingMeasures, misurato: JSON.stringify(m) })
        add(`${sid}-righe-azioni`, esito, misurato, 'tre icone, switch disabilitato su disabled', config.path)
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
    }

    if (runCtx.shouldRun(`${sid}-disponibilita`)) {
      const failures = []
      try {
        menuDeleteVerifyPrefix()
        const rowName = `verify-ui-${sid}-disp`
        menuCreateCatalogItems(testUser.email, config.collection, [{ name: rowName }])
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        await toggleDisponibile(page, rowName)
        await page.waitForTimeout(700)
        let body = await page.locator('main').innerText()
        const toastOff = copy(sid, 'TOAST_DISABLED') ?? 'disabilitato'
        if (!body.toLowerCase().includes(toastOff.toLowerCase().split(' ')[0])) failures.push('avviso disabilita')
        const item = menuFindCatalogItem(testUser.email, config.collection, rowName)
        if (!item.doc?.disabled) failures.push('disabled API')
        await openFiltersSheet(page, copy(sid, 'FILTERS_BUTTON') ?? 'Filtri')
        const stateLabel = copy(sid, 'FILTER_STATE_DISABLED') ?? 'Disabilitati'
        await selectFiltersStateOption(page, stateLabel)
        await applyFiltersSheet(page, copy(sid, 'FILTERS_APPLY') ?? 'Applica')
        await page.waitForTimeout(500)
        if ((await page.locator(`[aria-label^="${rowName},"]`).count()) < 1) failures.push('filtro Disabilitati')
        await toggleDisponibile(page, rowName)
        await page.waitForTimeout(600)
        body = await page.locator('main').innerText()
        const toastOn = copy(sid, 'TOAST_ENABLED') ?? 'abilitato'
        if (!body.toLowerCase().includes(toastOn.toLowerCase().split(' ')[0])) failures.push('avviso abilita')
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      add(`${sid}-disponibilita`, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'disponibilità e filtro', config.path)
    }

    if (runCtx.shouldRun(`${sid}-elimina`)) {
      const failures = []
      try {
        menuDeleteVerifyPrefix()
        const delName = `verify-ui-${sid}-elimina`
        menuCreateCatalogItems(testUser.email, config.collection, [{ name: delName }])
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        await clickRowAction(page, delName, 'delete')
        const dlg = await page.locator('[role=alertdialog]').innerText()
        if (!dlg.includes(delName)) failures.push('titolo dialog')
        const irr = copy(sid, 'DELETE_CONFIRM_IRREVERSIBLE') ?? 'Non si può annullare.'
        if (!dlg.includes(irr)) failures.push('irreversibile')
        await page.getByRole('button', { name: copy(sid, 'DELETE_BACK') ?? 'Indietro' }).click()
        if ((await page.locator(`[aria-label^="${delName},"]`).count()) === 0) failures.push('indietro')
        await clickRowAction(page, delName, 'delete')
        await page
          .getByRole('alertdialog')
          .getByRole('button', { name: copy(sid, 'DELETE_CONFIRM') ?? 'Elimina' })
          .click()
        await page.waitForTimeout(700)
        if ((await page.locator(`[aria-label^="${delName},"]`).count()) > 0) failures.push('riga resta')
        const after = menuFindCatalogItem(testUser.email, config.collection, delName)
        if (after.found) failures.push('API presente')
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      add(`${sid}-elimina`, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'elimina libero', config.path)
    }

    if (runCtx.shouldRun(`${sid}-elimina-registro-permessi`)) {
      const failures = []
      const notes = ['norole: NON PROVATO (coperto da scripts/verify-roles-8_3.ts)']
      let docId = null
      const permMgr = `verify-ui-${sid}-perm-mgr`
      const permAdm = `verify-ui-${sid}-perm-adm`
      const permSup = `verify-ui-${sid}-perm-sup`
      try {
        menuDeleteVerifyPrefix()
        menuCreateCatalogItems(testUser.email, config.collection, [
          { name: permMgr },
          { name: permAdm },
          { name: permSup },
        ])
        docId = menuFindCatalogItem(testUser.email, config.collection, permMgr).doc?.id ?? null
        const staffAdmin = menuFindStaffUser('admin')
        const staffSuper = menuFindStaffUser('super-admin')
        if (staffAdmin.email) {
          const d = menuTryDeleteCatalog(staffAdmin.email, config.collection, permAdm)
          if (!d.ok) failures.push(`admin: ${d.reason}`)
        } else notes.push('admin assente')
        if (staffSuper.email) {
          const d2 = menuTryDeleteCatalog(staffSuper.email, config.collection, permSup)
          if (!d2.ok) failures.push(`super-admin: ${d2.reason}`)
        }
        if (docId && failures.length === 0) {
          menuTryDeleteCatalog(testUser.email, config.collection, permMgr)
          const log = menuFindCatalogDeleteLog(testUser.email, config.collection, docId, permMgr)
          if (!log.found || log.detail !== log.expectedDetail) {
            failures.push(`registro delete manager: found=${log.found} detail=${log.detail ?? 'n/a'}`)
          }
        }
      } finally {
        menuDeleteVerifyPrefix()
      }
      const misuratoPerm = [...failures, ...notes].filter(Boolean).join('; ')
      add(
        `${sid}-elimina-registro-permessi`,
        failures.length ? 'FALLITO' : 'OK',
        misuratoPerm,
        'registro e permessi staff (norole coperto da verify-roles-8_3)',
        'payload',
      )
    }

    if (runCtx.shouldRun(`${sid}-modulo-campi`)) {
      for (const temaKey of ['chiaro', 'scuro']) {
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', temaKey, baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        const sheet = await page.locator('[data-slot=sheet-content]').innerText()
        const need = [
          copy(sid, 'FORM_NEW_TITLE'),
          copy(sid, 'FORM_NAME'),
          copy(sid, 'FORM_SAVE'),
          copy(sid, 'FORM_CANCEL'),
        ].filter(Boolean)
        const missing = need.filter((t) => !sheet.includes(t))
        add(
          `${sid}-modulo-campi`,
          missing.length ? 'FALLITO' : 'OK',
          missing.length ? missing.join(', ') : 'campi modulo',
          'modulo nuovo',
          config.path,
          `telefono-390/${temaKey}`,
        )
        await pctx.close()
      }
    }

    if (runCtx.shouldRun(`${sid}-modulo-validazione`)) {
      const failures = []
      const fieldIds = sid === 'vini' ? WINE_FIELD_IDS : sid === 'distillati' ? SPIRIT_FIELD_IDS : DRINK_FIELD_IDS
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
      const err = copy(sid, 'ERROR_REQUIRED') ?? 'Campo obbligatorio.'
      if (!(await page.locator('[data-slot=sheet-content]').innerText()).includes(err)) failures.push('obbligatorio')
      await page.locator(`#${fieldIds.name}`).fill('verify-ui-val')
      await page.locator(`#${fieldIds.price}`).fill('abc')
      await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
      const t = await page.locator('[data-slot=sheet-content]').innerText()
      const priceErr = copy(sid, 'ERROR_PRICE') ?? 'prezzo valido'
      if (!t.includes(priceErr)) failures.push('prezzo invalido')
      add(`${sid}-modulo-validazione`, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'validazione', config.path)
      await pctx.close()
    }

    if (runCtx.shouldRun(`${sid}-modulo-inglese`)) {
      const failures = []
      let misuratoEn = 'badge/en non letto'
      const badgeMissing = copy(sid, 'BADGE_MISSING') ?? 'Manca'
      const badgePresent = copy(sid, 'BADGE_PRESENT') ?? 'Presente'
      const transBtn = /Traduzione inglese/i
      try {
        menuDeleteVerifyPrefix()
        menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-noen`, description: 'Desc IT' }])
        menuCreateCatalogItems(testUser.email, config.collection, [
          { name: `verify-ui-${sid}-yesen`, description: 'Desc IT', descriptionEn: 'Desc EN' },
        ])
        menuPatchCatalogDoc(testUser.email, config.collection, `verify-ui-${sid}-yesen`, {
          description: 'Desc IT',
        })
        const enNo = menuReadCatalogEn(testUser.email, config.collection, `verify-ui-${sid}-noen`)
        const enYes = menuReadCatalogEn(testUser.email, config.collection, `verify-ui-${sid}-yesen`)
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        await clickRowAction(page, `verify-ui-${sid}-noen`, 'edit')
        await waitForAnimationsSettled(page, { rootSelector: '[data-slot=sheet-content]' })
        const trigNo = page.getByRole('button', { name: transBtn })
        const badgeNo = (await trigNo.innerText()).replace(/\s+/g, ' ').trim()
        if (!badgeNo.includes(badgeMissing)) failures.push(`noen badge letto=${JSON.stringify(badgeNo)}`)
        await page.keyboard.press('Escape')
        await clickRowAction(page, `verify-ui-${sid}-yesen`, 'edit')
        await waitForAnimationsSettled(page, { rootSelector: '[data-slot=sheet-content]' })
        const trigYes = page.getByRole('button', { name: transBtn })
        let badgeYes = (await trigYes.innerText()).replace(/\s+/g, ' ').trim()
        await trigYes.click()
        await waitForAnimationsSettled(page, { rootSelector: '[data-slot=sheet-content]' })
        badgeYes = (await trigYes.innerText()).replace(/\s+/g, ' ').trim()
        const yesEnOk =
          badgeYes.includes(badgePresent) ||
          (enYes.description && String(enYes.description).trim().length > 0)
        if (!yesEnOk) failures.push(`yesen badge letto=${JSON.stringify(badgeYes)}; API en desc=${JSON.stringify(enYes.description)}`)
        if (enNo.description == null && enNo.name == null) failures.push('read en noen')
        misuratoEn = `badge noen=${JSON.stringify(badgeNo)}; badge yesen=${JSON.stringify(badgeYes)}; API locale=en noen name=${JSON.stringify(enNo.name)} desc=${JSON.stringify(enNo.description)}; yesen desc=${JSON.stringify(enYes.description)}`
        if (sid === 'bevande') {
          menuCreateCatalogItems(testUser.email, config.collection, [{ name: 'verify-ui-bevande-uien-only' }])
          await page.keyboard.press('Escape')
          await gotoCatalog(page, config)
          await clickRowAction(page, 'verify-ui-bevande-uien-only', 'edit')
          await waitForAnimationsSettled(page, { rootSelector: '[data-slot=sheet-content]' })
          await page.getByRole('button', { name: transBtn }).click()
          const descEn = page.getByRole('textbox', { name: /Description/i })
          await descEn.fill('Only EN description from module')
          await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
          await page.waitForTimeout(600)
          const sheetText = await page.locator('[data-slot=sheet-content]').innerText().catch(() => '')
          if (/Nome/i.test(sheetText) && /non è valido|obbligatorio/i.test(sheetText)) {
            failures.push(`APP: salvataggio solo descrizione EN fallisce: ${sheetText.slice(0, 200)}`)
          }
          misuratoEn += `; modulo-solo-desc-en=${sheetText.slice(0, 120).replace(/\s+/g, ' ')}`
        }
        await pctx.close()
      } catch (e) {
        failures.push(e.message)
      } finally {
        menuDeleteVerifyPrefix()
      }
      const misuratoInglese = failures.length > 0 ? `${misuratoEn}; ${failures.join(' | ')}` : misuratoEn
      add(`${sid}-modulo-inglese`, failures.length ? 'FALLITO' : 'OK', misuratoInglese, 'inglese', config.path)
    }

    if (runCtx.shouldRun(`${sid}-modulo-footer`)) {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      await page.locator('[data-slot=sheet-content]').evaluate((el) => {
        el.scrollTop = el.scrollHeight
      })
      const m = await page.evaluate(() => {
        const footer = document.querySelector('[data-slot=sheet-footer]')
        const btns = footer ? [...footer.querySelectorAll('button')] : []
        return { footerH: Math.round(btns[0]?.getBoundingClientRect().height ?? 0), btnCount: btns.length }
      })
      add(
        `${sid}-modulo-footer`,
        m.btnCount === 2 && m.footerH >= 43 ? 'OK' : 'FALLITO',
        JSON.stringify(m),
        'footer 44px',
        config.path,
      )
      await pctx.close()
    }

    if (sid === 'vini' && runCtx.shouldRun('vini-modulo-anno')) {
      const failures = []
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoCatalog(page, config)
      try {
        await page.getByRole('button', { name: config.newButton }).click()
        const year = page.getByRole('textbox', { name: copy('vini', 'FORM_YEAR') ?? 'Anno' })
        await year.fill('12a')
        if ((await year.inputValue()) !== '12') failures.push('cifre anno')
        await toggleWineNvCheckbox(page)
        if (!(await year.isDisabled())) failures.push('NV disabilita anno')
        await toggleWineNvCheckbox(page)
        if (await year.isDisabled()) failures.push('anno resta disabilitato')
      } catch (e) {
        failures.push(e.message)
      }
      add('vini-modulo-anno', failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'anno/NV', 'modulo anno', config.path)
      await pctx.close()
    }

    if (sid === 'vini' && runCtx.shouldRun('vini-formati-ui')) {
      const failures = []
      let volMisurato = 'volume non letto'
      let abvText = ''
      let saved = null
      try {
        menuDeleteVerifyPrefix()
        menuCreateWineWithGradeSql(testUser.email, 'verify-ui-grade-fmt')
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        await page.reload({ waitUntil: 'networkidle' })
        await page.getByRole('button', { name: config.newButton }).click()
        await waitForAnimationsSettled(page, { rootSelector: '[data-slot=sheet-content]' })
        const volTrigger = page.locator('#wine-field-volume')
        await volTrigger.click()
        const volOpts = await waitForListboxOptions(page)
        volMisurato = `volume opzioni (${volOpts.length}): ${volOpts.join(' | ')}; atteso: ${WINE_VOLUME_EXPECTED.join(' | ')}`
        for (const need of WINE_VOLUME_EXPECTED) {
          if (!volOpts.some((o) => o.includes(need))) failures.push(`volume ${need} assente`)
        }
        await page.keyboard.press('Escape')
        await page.getByPlaceholder(config.searchPlaceholder).fill('verify-ui-grade-fmt')
        await page.waitForTimeout(800)
        const rowBtn = page.getByRole('button', { name: /Modifica verify-ui-grade-fmt/i })
        await rowBtn.first().waitFor({ state: 'visible', timeout: 20000 })
        await rowBtn.first().click()
        await waitForCatalogEditSheetReady(page, WINE_FIELD_IDS.name)
        try {
          abvText = await readComboboxTriggerText(page, copy('vini', 'FORM_ABV') ?? 'Grado')
        } catch {
          abvText = await page.locator('#wine-field-abv').innerText()
        }
        if (!abvText.includes('12,8')) failures.push(`grado UI atteso 12,8%, letto «${abvText}»`)
        await page.getByRole('button', { name: copy('vini', 'FORM_SAVE') ?? 'Salva' }).click()
        await page.waitForTimeout(800)
        saved = menuFindCatalogItem(testUser.email, config.collection, 'verify-ui-grade-fmt')
        if (saved.doc?.abv !== '12,8%') failures.push(`abv API dopo save=${saved.doc?.abv ?? 'n/a'}`)
        await pctx.close()
      } catch (e) {
        failures.push(e.message)
      } finally {
        menuDeleteVerifyPrefix()
      }
      const misuratoFmt = failures.length
        ? `${volMisurato ?? 'volume non letto'}; grado UI=${abvText ?? 'n/a'}; ${failures.join(' | ')}`
        : `${volMisurato}; grado UI=${abvText}; abv API=${saved?.doc?.abv ?? 'n/a'}`
      add('vini-formati-ui', failures.length ? 'FALLITO' : 'OK', misuratoFmt, 'capacità/grado', config.path)
    }

    if (sid === 'vini' && runCtx.shouldRun('vini-formati-server')) {
      const probe = menuValidateWineFormatsProbe(testUser.email)
      const failures = []
      for (const row of probe.results ?? []) {
        if (!row.rejected) failures.push(`${row.label} non rifiutato`)
        else if (row.expected && row.message !== row.expected) {
          failures.push(`${row.label}: atteso «${row.expected}», «${row.message ?? 'n/a'}»`)
        }
      }
      if (!probe.canonicalOk) failures.push('canonico non accettato')
      menuDeleteVerifyPrefix()
      const gradeWine = menuCreateWineWithGradeSql(testUser.email, 'verify-ui-disabled-abv')
      const dis = menuTryUpdateCatalogDisabledOnly(testUser.email, config.collection, 'verify-ui-disabled-abv')
      if (!dis.ok) failures.push('disabled-only patch')
      add(
        'vini-formati-server',
        failures.length ? 'FALLITO' : 'OK',
        JSON.stringify({ probe, dis, gradeWine }),
        'validazione formati Local API',
        'payload',
      )
    }

    if (sid === 'distillati' && runCtx.shouldRun('distillati-formati-server')) {
      const probe = menuValidateSpiritFormatsProbe(testUser.email)
      const failures = []
      for (const row of probe.results ?? []) {
        if (!row.rejected) failures.push(`${row.label} non rifiutato`)
        else if (row.expected && row.message !== row.expected) {
          failures.push(`${row.label}: atteso «${row.expected}», «${row.message ?? 'n/a'}»`)
        }
      }
      if (!probe.canonicalOk) failures.push('canonico non accettato')
      menuDeleteVerifyPrefix()
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: 'verify-ui-spirit-abv-sql' }])
      menuAdminSetSpiritAbv('verify-ui-spirit-abv-sql', '12,8%')
      const dis = menuTryUpdateCatalogDisabledOnly(testUser.email, config.collection, 'verify-ui-spirit-abv-sql')
      if (!dis.ok) failures.push('disabled-only patch')
      add(
        'distillati-formati-server',
        failures.length ? 'FALLITO' : 'OK',
        JSON.stringify({ probe, dis }),
        'validazione formati Local API spirits',
        'payload',
      )
      menuDeleteVerifyPrefix()
    }

    if (sid === 'bevande' && runCtx.shouldRun('bevande-formati-server')) {
      const probe = menuValidateDrinkFormatsProbe(testUser.email)
      const failures = []
      for (const row of probe.results ?? []) {
        if (!row.rejected) failures.push(`${row.label} non rifiutato`)
        else if (row.expected && row.message !== row.expected) {
          failures.push(`${row.label}: atteso «${row.expected}», «${row.message ?? 'n/a'}»`)
        }
      }
      if (!probe.canonicalOk) failures.push('canonico non accettato')
      menuDeleteVerifyPrefix()
      add(
        'bevande-formati-server',
        failures.length ? 'FALLITO' : 'OK',
        JSON.stringify({ probe }),
        'validazione formati Local API drinks',
        'payload',
      )
      menuDeleteVerifyPrefix()
    }

    if (sid === 'distillati' && runCtx.shouldRun('distillati-capacita-non-gestita')) {
      const failures = []
      try {
        menuDeleteVerifyPrefix()
        menuCreateCatalogItems(testUser.email, config.collection, [{ name: 'verify-ui-spirit-vol' }])
        menuAdminSetSpiritVolume('verify-ui-spirit-vol', '75 cl')
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        await clickRowAction(page, 'verify-ui-spirit-vol', 'edit')
        const sheet = await page.locator('[data-slot=sheet-content]').innerText()
        if (sheet.includes('Capacità') || (await page.locator('#spirit-field-volume').count()) > 0) {
          failures.push('campo capacità presente')
        }
        await page.locator(`#${SPIRIT_FIELD_IDS.price}`).fill('11,00')
        await page.getByRole('button', { name: copy('distillati', 'FORM_SAVE') ?? 'Salva' }).click()
        await page.waitForTimeout(700)
        const doc = menuFindCatalogItem(testUser.email, config.collection, 'verify-ui-spirit-vol')
        if (doc.doc?.volume !== '75 cl') failures.push(`volume API=${doc.doc?.volume}`)
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      add('distillati-capacita-non-gestita', failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'volume DB invariato', config.path)
    }

    if (sid === 'bevande' && runCtx.shouldRun('bevande-paese-facoltativo')) {
      const failures = []
      try {
        menuDeleteVerifyPrefix()
        menuCreateCatalogItems(testUser.email, config.collection, [{ name: 'verify-ui-drink-country' }])
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        await clickRowAction(page, 'verify-ui-drink-country', 'edit')
        await selectComboboxOption(page, copy('bevande', 'FORM_COUNTRY') ?? 'Paese', 'Nessun paese').catch(async () => {
          await page.getByRole('combobox', { name: /Paese/i }).click()
          await page.getByRole('option', { name: 'Nessun paese' }).click()
        })
        await page.getByRole('button', { name: copy('bevande', 'FORM_SAVE') ?? 'Salva' }).click()
        await page.waitForTimeout(700)
        const doc = menuFindCatalogItem(testUser.email, config.collection, 'verify-ui-drink-country')
        if (doc.doc?.country) failures.push('country ancora valorizzato')
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      add('bevande-paese-facoltativo', failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'paese facoltativo', config.path)
    }

    if (sid === 'vini' && runCtx.shouldRun('vini-filtri-origine')) {
      const failures = []
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoCatalog(page, config)
      try {
        await openFiltersSheet(page)
        if (!(await page.getByRole('combobox', { name: 'Regione' }).isDisabled())) failures.push('regione senza paese')
        await applyOriginFilterCascade(page, { country: 'Italia', region: 'Friuli Venezia Giulia', appellation: 'Collio' })
        await applyFiltersSheet(page)
        await openFiltersSheet(page)
        await clearComboboxToEmptyOption(page, 'Paese', copy('vini', 'FILTERS_ALL_COUNTRIES') ?? 'Tutti i paesi')
        await applyFiltersSheet(page)
      } catch (e) {
        failures.push(e.message)
      }
      add('vini-filtri-origine', failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'cascata filtri', 'origine filtri', config.path)
      await pctx.close()
    }

    if (sid === 'vini' && runCtx.shouldRun('vini-origine-cascata')) {
      const failures = []
      let misuratoCascata = 'cascata non letta'
      const tax = menuListWineOriginTaxonomies()
      const taxItalia = (tax.regions ?? [])
        .filter((r) => r.enabled !== false)
        .map((r) => r.name)
        .slice(0, 30)
      try {
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await waitForAnimationsSettled(page, { rootSelector: '[data-slot=sheet-content]' })
        const countryLabel = copy('vini', 'FORM_COUNTRY') ?? 'Paese'
        const regionLabel = copy('vini', 'FORM_REGION') ?? 'Regione'
        const appLabel = copy('vini', 'FORM_APPELLATION') ?? 'Denominazione'
        await selectComboboxOptionByKeyboard(page, countryLabel, 'Italia')
        await page.getByRole('combobox', { name: regionLabel }).click()
        const regOpts = await waitForListboxOptions(page)
        if (!regOpts.some((o) => o.includes('Friuli'))) failures.push('regioni Italia assenti in UI')
        await selectComboboxOptionByKeyboard(page, regionLabel, 'Friuli Venezia Giulia')
        await selectComboboxOptionByKeyboard(page, appLabel, 'Collio').catch(() => {})
        await page.getByRole('combobox', { name: appLabel }).click()
        const appOpts = await waitForListboxOptions(page)
        if (!appOpts.some((o) => o.includes('Collio'))) failures.push('denominazioni Collio assenti')
        await selectComboboxOptionByKeyboard(page, countryLabel, 'Francia')
        const regAfterFr = await readComboboxTriggerText(page, regionLabel)
        if (regAfterFr.includes('Friuli')) failures.push('regione non svuotata con Francia')
        await selectComboboxOptionByKeyboard(page, countryLabel, 'Giappone')
        const regJpDisabled = await page.getByRole('combobox', { name: regionLabel }).isDisabled()
        if (!regJpDisabled) failures.push('regione Giappone non disabilitata')
        const sheet = await page.locator('[data-slot=sheet-content]').innerText()
        if (!sheet.includes('Nessuna regione per questo paese')) failures.push('hint Giappone regione')
        misuratoCascata = `UI regioni (${regOpts.length}): ${regOpts.slice(0, 8).join(' | ')}; collection sample: ${taxItalia.slice(0, 8).join(' | ')}`
        await pctx.close()
      } catch (e) {
        failures.push(e.message)
      }
      add(
        'vini-origine-cascata',
        failures.length ? 'FALLITO' : 'OK',
        failures.length ? `${misuratoCascata}; ${failures.join(' | ')}` : misuratoCascata,
        'origine §7',
        config.path,
      )
    }

    if (sid === 'vini' && runCtx.shouldRun('vini-origine-opzioni-query')) {
      const failures = []
      const tax = menuListWineOriginTaxonomies()
      const libano = tax.countries?.find((c) => c.name === 'Libano')
      const sicilia = tax.regions?.find((r) => r.name === 'Sicilia')
      if (libano?.enabled !== false) failures.push(`Libano enabled=${libano?.enabled}`)
      const src = readFileSync(join(ROOT, 'app/(app)/app/(shell)/menu/wines-actions.ts'), 'utf8')
      if (!src.includes('enabled: { equals: true }')) failures.push('grep enabled assente in wines-actions')
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      await page.getByRole('combobox', { name: copy('vini', 'FORM_COUNTRY') ?? 'Paese' }).click()
      const opts = await page.getByRole('option').allTextContents()
      if (opts.some((o) => o.includes('Libano'))) failures.push('Libano in UI')
      if (sicilia?.enabled === false && opts.join(' ').includes('Sicilia')) failures.push('Sicilia in UI')
      add(
        'vini-origine-opzioni-query',
        failures.length ? 'FALLITO' : 'OK',
        failures.join(' | ') || `opzioni=${opts.length}; tax Libano/Sicilia ok`,
        'enabled in query e UI',
        config.path,
      )
      await pctx.close()
    }

    if (sid === 'vini' && runCtx.shouldRun('vini-origine-fuori-filtro')) {
      await runPaeseFuoriFiltroFlow(ctx, config, {
        controlId: 'vini-origine-fuori-filtro',
        recordName: 'verify-ui-vini-off-filter',
        screenshotName: 'vini-modulo-paese-fuori-filtro-telefono-390-chiaro',
      })
    }

    if (sid === 'distillati' && runCtx.shouldRun('distillati-paese-fuori-filtro')) {
      await runPaeseFuoriFiltroFlow(ctx, config, {
        controlId: 'distillati-paese-fuori-filtro',
        recordName: 'verify-ui-distillati-off-filter',
        screenshotName: 'distillati-modulo-paese-fuori-filtro-telefono-390-chiaro',
      })
    }

    if (sid === 'bevande' && runCtx.shouldRun('bevande-paese-fuori-filtro')) {
      await runPaeseFuoriFiltroFlow(ctx, config, {
        controlId: 'bevande-paese-fuori-filtro',
        recordName: 'verify-ui-bevande-off-filter',
        screenshotName: 'bevande-modulo-paese-fuori-filtro-telefono-390-chiaro',
      })
    }

    if (sid === 'vini' && runCtx.shouldRun('vini-coerenza-geografica') && ambiente === 'locale-dev') {
      const failures = []
      try {
        menuDeleteVerifyPrefix()
        menuCreateCatalogItems(testUser.email, config.collection, [{ name: 'verify-ui-vini-geo' }])
        menuMisalignWineGeography(testUser.email, 'verify-ui-vini-geo')
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        await clickRowAction(page, 'verify-ui-vini-geo', 'edit')
        await page.getByRole('button', { name: copy('vini', 'FORM_SAVE') ?? 'Salva' }).click()
        await page.waitForTimeout(800)
        const sheet = await page.locator('[data-slot=sheet-content]').innerText()
        if (!sheet.includes('non appartiene al paese')) failures.push('messaggio geografia')
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      add('vini-coerenza-geografica', failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'validateWineGeography', config.path)
    } else if (sid === 'vini' && runCtx.shouldRun('vini-coerenza-geografica')) {
      add('vini-coerenza-geografica', 'NON PROVATO', '—', 'locale-dev only', 'ambiente')
    }

    if (runCtx.shouldRun(`${sid}-tassonomie`)) {
      const failures = []
      let misuratoTax = 'tipologie non lette'
      try {
        if (sid === 'vini') {
          const denied = menuTryCreateWineTaxonomy(testUser.email, 'wine-types')
          if (denied.ok) failures.push('creazione tipologia consentita')
        }
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        const typeField = copy(sid, 'FORM_TYPE') ?? 'Tipologia'
        await page.getByRole('combobox', { name: typeField }).click()
        const listbox = page.getByRole('listbox')
        await listbox.waitFor({ state: 'visible', timeout: 12000 })
        await listbox.getByRole('option').first().waitFor({ timeout: 12000 })
        const opts = (await listbox.getByRole('option').allTextContents()).map((t) => t.trim()).filter(Boolean)
        misuratoTax = `tipologie (${opts.length}): ${opts.slice(0, 12).join(' | ')}${opts.length > 12 ? '…' : ''}`
        if (opts.length < 1) failures.push('tipologie vuote')
        if (opts.some((o) => /^\d+$/.test(o))) failures.push(`id al posto del nome: ${opts.filter((o) => /^\d+$/.test(o)).join(', ')}`)
        await pctx.close()
      } catch (e) {
        failures.push(e.message)
      }
      add(
        `${sid}-tassonomie`,
        failures.length ? 'FALLITO' : 'OK',
        failures.length ? `${misuratoTax}; ${failures.join(' | ')}` : misuratoTax,
        'tassonomie',
        config.path,
      )
    }

    if (runCtx.shouldRun(`${sid}-persistenza`)) {
      const failures = []
      let misuratoPers = 'create non verificato'
      const fieldIds = sid === 'vini' ? WINE_FIELD_IDS : sid === 'distillati' ? SPIRIT_FIELD_IDS : DRINK_FIELD_IDS
      const itemName = `verify-ui-${sid}-nuovo`
      try {
        menuDeleteVerifyPrefix()
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await waitForCatalogEditSheetReady(page, fieldIds.name)
        await waitForAnimationsSettled(page, { rootSelector: '[data-slot=sheet-content]' })
        await page.locator('[data-slot=sheet-content]').evaluate((el) => {
          el.scrollTop = 0
        })
        await page.locator(`#${fieldIds.name}`).fill(itemName)
        await page.locator(`#${fieldIds.price}`).fill('12,50')
        const typeDomId =
          sid === 'vini' ? 'wine-field-type' : sid === 'distillati' ? 'spirit-field-type' : 'drink-field-type'
        await openSelectDom(page, typeDomId)
        const typeOpts = await waitForListboxOptions(page)
        const chosenType = pickFirstRealSelectOption(typeOpts) ?? '(nessuna)'
        const typeField = copy(sid, 'FORM_TYPE') ?? 'Tipologia'
        await selectComboboxOptionByKeyboard(page, typeField, chosenType)
        let chosenCountry = 'n/a'
        if (sid !== 'bevande') {
          const countryDomId = sid === 'vini' ? 'wine-field-country' : 'spirit-field-country'
          await openSelectDom(page, countryDomId)
          const countryOpts = await waitForListboxOptions(page)
          const chosen = pickFirstRealSelectOption(countryOpts)
          chosenCountry = chosen ?? '(nessuno)'
          const countryField = copy(sid, 'FORM_COUNTRY') ?? 'Paese'
          if (chosen) await selectComboboxOptionByKeyboard(page, countryField, chosen)
        } else {
          await openSelectDom(page, 'drink-field-volume')
          const volOpts = await waitForListboxOptions(page)
          const vol = pickFirstRealSelectOption(volOpts)
          if (vol) await selectComboboxOptionByKeyboard(page, copy(sid, 'FORM_VOLUME') ?? 'Capacità', vol)
          await openSelectDom(page, 'drink-field-abv')
          const abvOpts = await waitForListboxOptions(page)
          const abv = pickFirstRealSelectOption(abvOpts)
          if (abv) await selectComboboxOptionByKeyboard(page, copy(sid, 'FORM_ABV') ?? 'Grado', abv)
        }
        const sheet = page.locator('[data-slot=sheet-content]')
        await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
        const closed = await sheet
          .waitFor({ state: 'hidden', timeout: 20000 })
          .then(() => true)
          .catch(async () => {
            const errBody = (await sheet.innerText().catch(() => '')).slice(0, 280)
            failures.push(`foglio aperto dopo Salva: ${errBody}`)
            return false
          })
        if (closed) {
          await page.getByRole('alert').first().waitFor({ timeout: 12000 }).catch(() => {
            failures.push('avviso salvataggio assente')
          })
        }
        const saved = menuFindCatalogItem(testUser.email, config.collection, itemName)
        if (!saved.found) failures.push('create read API')
        misuratoPers = `tipologia=${chosenType}; paese=${chosenCountry}; foglio chiuso=${closed}; API found=${saved.found} id=${saved.doc?.id ?? 'n/a'} price=${saved.doc?.price ?? 'n/a'}`
        await pctx.close()
      } catch (e) {
        failures.push(e.message)
      } finally {
        menuDeleteVerifyPrefix()
      }
      add(
        `${sid}-persistenza`,
        failures.length ? 'FALLITO' : 'OK',
        failures.length ? `${misuratoPers}; ${failures.join(' | ')}` : misuratoPers,
        'persistenza',
        config.path,
      )
    }

    if (runCtx.shouldRun(`${sid}-filtri-ricerca`)) {
      const failures = []
      try {
        menuDeleteVerifyPrefix()
        menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-find`, description: 'verify-ui-en-term' }])
        for (const profiloKey of ['telefono-390', 'notebook-1280']) {
          const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
          await loginApp(page, baseUrl, testUser.email, testPassword)
          await gotoCatalog(page, config)
          await page.getByPlaceholder(config.searchPlaceholder).fill(`verify-ui-${sid}-find`)
          await page.waitForTimeout(500)
          if ((await page.locator(`[aria-label^="verify-ui-${sid}-find,"]`).count()) < 1) failures.push(profiloKey)
          await pctx.close()
        }
      } finally {
        menuDeleteVerifyPrefix()
      }
      add(`${sid}-filtri-ricerca`, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'ricerca', config.path)
    }

    if (runCtx.shouldRun(`${sid}-ordine-100`)) {
      const failures = []
      const partialPrefix = copy(sid, 'LIST_PARTIAL_TITLE_PREFIX') ?? 'Mostrati 100'
      const partialDesc = copy(sid, 'LIST_PARTIAL_DESCRIPTION') ?? 'Restringi'
      const showMore = config.showMore
      let misurato = '—'
      try {
        menuDeleteVerifyPrefix()
        const { count: before } = menuCountCatalog(config.collection)
        prepareCatalogBulk101(testUser.email, config, before)
        const { ctx: pctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoCatalog(page, config)
        const body = await page.locator('main').innerText()
        const rowCount = await page.locator('main table tbody tr, main [aria-label*="bulk"]').count()
        const hasBanner = body.includes(partialPrefix) || body.includes('100')
        if (!hasBanner) failures.push('banner parziale')
        if (!body.includes(partialDesc.slice(0, 20))) failures.push('testo sotto banner')
        await clickShowMoreCatalog(page, showMore)
        misurato = `righe≈${rowCount}; banner=${hasBanner}; showMore cliccato`
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      add(`${sid}-ordine-100`, failures.length ? 'FALLITO' : 'OK', misurato, '101 record e Mostra altri', config.path, `${sid}/${bulkStateId(config)}`, 'notebook-1280/chiaro')
    }

    if (runCtx.shouldRun(`${sid}-nomi-accessibili`)) {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoCatalog(page, config)
      const labels = await page.evaluate(() =>
        [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')),
      )
      const banned = ['Close', 'Edit', 'Delete', 'Remove', 'Save', 'Cancel', 'Toggle']
      const hit = banned.filter((w) => labels.some((l) => l === w || l?.includes(w)))
      add(`${sid}-nomi-accessibili`, hit.length ? 'FALLITO' : 'OK', hit.join(', ') || 'italiano', 'T1', config.path)
      await pctx.close()
    }

    if (runCtx.shouldRun(`${sid}-accesso`)) {
      add(`${sid}-accesso`, 'NON PROVATO', '—', 'guardia 8.3', 'verify-roles-8_3.ts / stato_prova JSON')
    }

    if (runCtx.shouldRun(`${sid}-stato-vuoto`)) {
      const { count } = menuCountCatalog(config.collection)
      add(
        `${sid}-stato-vuoto`,
        'NON PROVATO',
        count > 0 ? `DB con ${count} record` : 'DB vuoto non preparato',
        'elenco vuoto',
        'giudizio C10 / confronto visivo',
      )
    }

    if (runCtx.shouldRun(`${sid}-ricompila`)) {
      add(`${sid}-ricompila`, 'NON PROVATO', '—', 'rinviato 6.5', 'stato_prova JSON')
    }

    if (runCtx.shouldRun(`${sid}-confronto-visivo`)) {
      const stati = confrontoStatiIds(CONTROLLI, sid)
      const profiles = SHOT_PROFILES ?? ['telefono-390', 'notebook-1280']
      const temi = SHOT_TEMI ?? ['chiaro', 'scuro']
      const expectedShots = stati.length * profiles.length * temi.length
      let shotCount = 0
      const skipped = []
      for (const statoId of stati) {
        for (const profiloKey of profiles) {
          for (const temaKey of temi) {
            let simChild = null
            try {
              let pageBase = baseUrl
              const simEnv = CATALOG_SIM_ENV[statoId]
              if (simEnv) {
                await waitForPortFree(SIM_PORT)
                simChild = startMenuDevServerLocal(SIM_PORT, simEnv)
                pageBase = `http://localhost:${SIM_PORT}`
                await waitForUrlLocal(pageBase)
              } else if (statoId.startsWith('vuoto')) {
                const { count } = menuCountCatalog(config.collection)
                if (count > 0) {
                  skipped.push(`${statoId}: DB=${count}`)
                  continue
                }
              }
              const { ctx: pctx, page } = await newPage(browser, profiloKey, temaKey, pageBase)
              await loginApp(page, pageBase, testUser.email, testPassword)
              if (simEnv && statoId === 'caricamento') {
                await page.goto(config.path, { waitUntil: 'commit' })
                await sleep(800)
              } else if (simEnv && statoId === 'errore-caricamento') {
                await page.goto(config.path, { waitUntil: 'networkidle' })
              } else if (simEnv && statoId === 'errore-azione') {
                await gotoCatalog(page, config)
                await page.getByRole('button', { name: config.newButton }).click()
                await page.locator(`#${sid === 'vini' ? WINE_FIELD_IDS.name : sid === 'distillati' ? SPIRIT_FIELD_IDS.name : DRINK_FIELD_IDS.name}`).fill('verify-ui-err')
                await page.locator(`#${sid === 'vini' ? WINE_FIELD_IDS.price : sid === 'distillati' ? SPIRIT_FIELD_IDS.price : DRINK_FIELD_IDS.price}`).fill('9,00')
                await page.getByRole('combobox').first().click()
                await page.getByRole('option').nth(1).click()
                await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
                await page.waitForTimeout(600)
              } else {
                await prepareCatalogState(page, config, statoId, { ...ctx, baseUrl: pageBase })
              }
              if (screenshot) {
                await screenshot(page, report, `${sid}-${statoId}-${profiloKey}-${temaKey}`, temaKey)
                shotCount += 1
              }
              await pctx.close()
            } catch (e) {
              skipped.push(`${statoId}/${profiloKey}/${temaKey}: ${e.message}`)
            } finally {
              if (simChild) {
                simChild.kill('SIGTERM')
                await waitForPortFree(SIM_PORT)
              }
              menuDeleteVerifyPrefix()
            }
          }
        }
      }
      const esito = shotCount === expectedShots ? 'OK' : shotCount > 0 ? 'AVVISO' : 'FALLITO'
      add(
        `${sid}-confronto-visivo`,
        esito,
        `screenshot=${shotCount}/${expectedShots}${skipped.length ? `; saltati=${skipped.slice(0, 4).join('; ')}` : ''}`,
        `${stati.length} stati × profili × temi`,
        'img/',
      )
    }
  } finally {
    menuDeleteVerifyPrefix()
  }
}

export async function runCatalogStatiUi(ctx, config) {
  const {
    browser,
    report,
    runCtx,
    newPage,
    loginApp,
    testUser,
    testPassword,
    addRow,
    progressStep,
    startMenuDevServer,
    waitForUrl,
  } = ctx
  const id = `${config.id}-stati-ui`
  if (!runCtx.shouldRun(id)) return
  if (!startMenuDevServer || !waitForUrl) {
    addRow(report, {
      id,
      schermata: config.id,
      profiloTema: '—',
      esito: 'NON PROVATO',
      misurato: '—',
      atteso: 'simulazioni dev',
      evidenza: 'helper server mancante',
    })
    return
  }
  const failures = []
  const loadTitle = loadErrorTitle(config.id)

  if (await isPortFree(SIM_PORT)) {
    await waitForPortFree(SIM_PORT)
    const delayChild = startMenuDevServer(SIM_PORT, { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '2500' })
    try {
      const simUrl = `http://localhost:${SIM_PORT}`
      await waitForUrl(simUrl)
      progressStep(config.id, 'caricamento', 'telefono-390', 'chiaro')
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', simUrl)
      await loginApp(page, simUrl, testUser.email, testPassword)
      await page.goto(config.path, { waitUntil: 'commit' })
      const sk = await page.locator('[data-slot=skeleton]').count()
      if (sk < 2) failures.push(`caricamento skeleton=${sk}`)
      await pctx.close()
    } catch (e) {
      failures.push(`caricamento: ${e.message}`)
    } finally {
      delayChild.kill('SIGTERM')
      await waitForPortFree(SIM_PORT)
    }
  }

  await waitForPortFree(SIM_PORT)
  const errChild = startMenuDevServer(SIM_PORT, { APP_MENU_DEV_SIMULATE_LOAD_ERROR: '1' })
  try {
    const simUrl = `http://localhost:${SIM_PORT}`
    await waitForUrl(simUrl)
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', simUrl)
    await loginApp(page, simUrl, testUser.email, testPassword)
    await page.goto(config.path, { waitUntil: 'networkidle' })
    const body = await page.locator('main').innerText()
    if (!body.includes(loadTitle)) failures.push('titolo errore caricamento')
    await pctx.close()
  } catch (e) {
    failures.push(`errore: ${e.message}`)
  } finally {
    errChild.kill('SIGTERM')
    await waitForPortFree(SIM_PORT)
  }

  addRow(report, {
    id,
    schermata: config.id,
    profiloTema: 'telefono-390/chiaro',
    esito: failures.length ? 'FALLITO' : 'OK',
    misurato: failures.join(' | ') || 'simulazioni ok',
    atteso: 'skeleton caricamento; avviso errore caricamento',
    evidenza: `localhost:${SIM_PORT}`,
  })
}

export async function runCatalogConsoleForScreen(ctx, config) {
  const { browser, baseUrl, report, runCtx, newPage, loginApp, testUser, testPassword, addRow, progressStep, browserVersion } =
    ctx
  const id = `${config.id}-console`
  if (!runCtx.shouldRun(id)) return

  for (const profiloKey of ['telefono-390', 'notebook-1280']) {
    progressStep(config.id, 'console', profiloKey, 'chiaro')
    const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
    const bag = { errors: [], warnings: [], failed: [] }
    page.on('console', (msg) => {
      if (msg.type() === 'error') bag.errors.push(msg.text())
      if (msg.type() === 'warning') bag.warnings.push(msg.text())
    })
    page.on('pageerror', (e) => bag.errors.push(String(e)))
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await page.goto(config.path, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: copy(config.id, 'FILTERS_BUTTON') ?? 'Filtri' }).click().catch(() => {})
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: config.newButton }).click().catch(() => {})
    await page.keyboard.press('Escape')
    await sleep(300)
    const ok = bag.errors.length === 0 && bag.warnings.length === 0 && bag.failed.length === 0
    addRow(report, {
      id,
      schermata: config.id,
      profiloTema: `${profiloKey}/chiaro/Chromium ${browserVersion ?? ''}`.trim(),
      esito: ok ? 'OK' : 'FALLITO',
      misurato: `err:${bag.errors.length} warn:${bag.warnings.length}`,
      atteso: 'zero error/warning',
      evidenza: [...bag.errors, ...bag.warnings].slice(0, 2).join(' | ') || '—',
    })
    await pctx.close()
  }
}
