import { unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { spawn } from 'node:child_process'

import { readTsStringExport } from './lib-readers.mjs'
import { withinTolerance, openUserMenu } from './engine.mjs'
import { SIM_PORT, isPortFree, waitForPortFree } from './ensure-ports.mjs'

const ROOT_PIATTI = join(import.meta.dirname, '../../..')

const PIATTI_CONFRONTO_STATI = [
  'elenco',
  'terminato',
  'disabilita',
  'elimina-libero',
  'elimina-bloccato',
  'eliminato',
  'filtri',
  'filtri-attivi',
  'modulo',
  'modulo-allergeni',
  'modulo-inglese-aperto',
  'nuovo',
  'nuovo-errori',
  'errore-azione',
  'piu-di-100',
  'caricamento',
  'errore-caricamento',
  'vuoto',
  'nessun-risultato',
]

const PIATTI_SIM_STATES = {
  caricamento: { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '2500' },
  'errore-caricamento': { APP_MENU_DEV_SIMULATE_LOAD_ERROR: '1' },
  'errore-azione': { APP_MENU_DEV_SIMULATE_SAVE_ERROR: '1' },
}

function startMenuDevServerLocal(port, extraEnv) {
  try {
    unlinkSync(join(ROOT_PIATTI, '.next/dev/lock'))
  } catch {
    /* nessun lock */
  }
  return spawn('pnpm', ['exec', 'next', 'dev', '--port', String(port)], {
    cwd: ROOT_PIATTI,
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
import {
  menuAddDishToFixedMenu,
  menuCountDishes,
  menuCreateDishes,
  menuCreateFixedMenuFixture,
  menuDeleteVerifyPrefix,
  menuFindDeleteLog,
  menuFindDish,
  menuFindStaffUser,
  menuListTaxonomies,
  menuReadDishEn,
  menuTryCreateDish,
  menuTryCreateTaxonomy,
  menuTryDeleteDish,
  menuUpdateDish,
} from './menu-payload.mjs'

const REBUILD_PHRASES = [
  'Ricompila il menù pubblico',
  'Ricompilare il menù pubblico?',
  'serve «Ricompila il menù pubblico»',
]

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function copyConst(name) {
  return readTsStringExport('lib/menu/dishes/copy.ts', name)
}

async function gotoPiatti(page) {
  await page.goto('/app/menu', { waitUntil: 'networkidle' })
  await page.locator('h1', { hasText: 'Piatti' }).waitFor({ timeout: 20000 })
}

async function rowLocator(page, name) {
  return page.locator(`[aria-label^="${name},"]`).first()
}

async function clickRowAction(page, name, action) {
  const row = await rowLocator(page, name)
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

async function toggleTerminato(page, name) {
  await page.getByRole('switch', { name: `Terminato: ${name}` }).click()
}

function pageHasRebuildText(text) {
  return REBUILD_PHRASES.some((p) => text.includes(p))
}

export async function runRicompilaAssenteCheck(ctx) {
  const { browser, baseUrl, report, runCtx, newPage, loginApp, testUser, testPassword, addRow } = ctx
  if (!runCtx.shouldRun('RICOMPILA-ASSENTE')) return
  const failures = []
  try {
    try {
    menuDeleteVerifyPrefix()
    menuCreateDishes(testUser.email, [{ name: 'verify-ui-ricompila-save' }])
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await gotoPiatti(page)
    const body0 = await page.locator('main').innerText()
    if (pageHasRebuildText(body0)) failures.push('pagina elenco contiene testo Ricompila')
    await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
    await page.locator('#dish-field-name').fill('verify-ui-ricompila-temp')
    await page.locator('#dish-field-price').fill('10,00')
    await page.getByRole('combobox', { name: copyConst('PIATTI_FORM_CATEGORY') ?? 'Categoria' }).click()
    await page.getByRole('option').first().click()
    await page.getByRole('button', { name: copyConst('PIATTI_FORM_SAVE') ?? 'Salva' }).click()
    await page.waitForTimeout(800)
    const afterSave = await page.locator('main').innerText()
    const savedTitle = copyConst('PIATTI_TOAST_SAVED_NEW') ?? 'Piatto aggiunto'
    if (!afterSave.includes(savedTitle)) failures.push(`avviso salvataggio: manca «${savedTitle}»`)
    if (pageHasRebuildText(afterSave)) failures.push('avviso salvataggio menziona Ricompila')
    menuCreateDishes(testUser.email, [{ name: 'verify-ui-ricompila-del' }])
    await page.reload({ waitUntil: 'networkidle' })
    await clickRowAction(page, 'verify-ui-ricompila-del', 'delete')
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: copyConst('PIATTI_DELETE_CONFIRM') ?? 'Elimina' })
      .click()
    await page.waitForTimeout(800)
    const afterDel = await page.locator('main').innerText()
    const delTitle = copyConst('PIATTI_TOAST_DELETED') ?? 'Piatto eliminato'
    if (!afterDel.includes(delTitle)) failures.push(`avviso eliminazione: manca «${delTitle}»`)
    if (pageHasRebuildText(afterDel)) failures.push('avviso eliminazione menziona Ricompila')
    await pctx.close()
    } catch (e) {
      failures.push(`eccezione: ${e.message}`)
    }
  } finally {
    menuDeleteVerifyPrefix()
  }
  addRow(report, {
    id: 'RICOMPILA-ASSENTE',
    schermata: 'piatti',
    profiloTema: 'telefono-390/chiaro',
    esito: failures.length ? 'FALLITO' : 'OK',
    misurato: failures.join(' | ') || 'nessun pulsante né frase Ricompila negli avvisi',
    atteso: 'assente in UI e avvisi solo titolo',
    evidenza: '/app/menu',
  })
}

export async function preparePiattiState(page, statoId, ctx) {
  const { testUser, baseUrl, browser, newPage, loginApp, testPassword } = ctx
  menuDeleteVerifyPrefix()
  switch (statoId) {
    case 'elenco':
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-elenco' }])
      await gotoPiatti(page)
      return
    case 'terminato':
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-terminato' }])
      await gotoPiatti(page)
      await toggleTerminato(page, 'verify-ui-terminato')
      await page.waitForTimeout(500)
      return
    case 'disabilita':
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-dis', disabled: true }])
      await gotoPiatti(page)
      return
    case 'elimina-libero':
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-libero' }])
      await gotoPiatti(page)
      await clickRowAction(page, 'verify-ui-libero', 'delete')
      return
    case 'elimina-bloccato':
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-in-uso' }])
      menuCreateFixedMenuFixture(testUser.email, {
        dishName: 'verify-ui-in-uso',
        categoryName: 'verify-ui-cat',
        menuNames: ['verify-ui-menu-1'],
      })
      await gotoPiatti(page)
      await clickRowAction(page, 'verify-ui-in-uso', 'delete')
      return
    case 'eliminato':
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-eliminato' }])
      await gotoPiatti(page)
      await clickRowAction(page, 'verify-ui-eliminato', 'delete')
      await page
        .getByRole('alertdialog')
        .getByRole('button', { name: copyConst('PIATTI_DELETE_CONFIRM') ?? 'Elimina' })
        .click()
      await page.waitForTimeout(400)
      return
    case 'filtri':
      await gotoPiatti(page)
      await page.getByRole('button', { name: copyConst('PIATTI_FILTERS_BUTTON') ?? 'Filtri' }).click()
      return
    case 'filtri-attivi':
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-filtro' }])
      await gotoPiatti(page)
      await page.getByRole('button', { name: copyConst('PIATTI_FILTERS_BUTTON') ?? 'Filtri' }).click()
      await page.getByRole('combobox').first().click()
      await page.getByRole('option').nth(1).click()
      await page.getByRole('button', { name: copyConst('PIATTI_FILTERS_APPLY') ?? 'Applica' }).click()
      return
    case 'modulo':
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-mod' }])
      await gotoPiatti(page)
      await clickRowAction(page, 'verify-ui-mod', 'edit')
      return
    case 'modulo-allergeni':
      await gotoPiatti(page)
      await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
      await page.locator('[data-slot=sheet-content]').evaluate((el) => {
        el.scrollTop = el.scrollHeight
      })
      return
    case 'modulo-inglese-aperto':
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-en', nameEn: 'English name' }])
      await gotoPiatti(page)
      await clickRowAction(page, 'verify-ui-en', 'edit')
      return
    case 'nuovo':
      await gotoPiatti(page)
      await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
      return
    case 'nuovo-errori':
      await gotoPiatti(page)
      await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
      await page.getByRole('button', { name: copyConst('PIATTI_FORM_SAVE') ?? 'Salva' }).click()
      return
    case 'errore-azione':
      await gotoPiatti(page)
      await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
      return
    case 'piu-di-100':
      menuDeleteVerifyPrefix()
      const bulk = Array.from({ length: 101 }, (_, i) => ({
        name: `verify-ui-bulk-${String(i + 1).padStart(3, '0')}`,
      }))
      menuCreateDishes(testUser.email, bulk)
      await gotoPiatti(page)
      return
    case 'caricamento':
    case 'errore-caricamento':
      return
    case 'vuoto': {
      const { count } = menuCountDishes()
      if (count > 0) return
      await gotoPiatti(page)
      return
    }
    case 'nessun-risultato':
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-findme' }])
      await gotoPiatti(page)
      await page.getByPlaceholder(copyConst('PIATTI_SEARCH_PLACEHOLDER') ?? 'Cerca un piatto').fill('verify-ui-zzzz-no')
      await page.waitForTimeout(600)
      return
    default:
      await gotoPiatti(page)
  }
}

async function safePiattiStep(add, id, fn, profiloTema = 'telefono-390/chiaro') {
  if (!fn) return
  try {
    await fn()
  } catch (e) {
    add(id, 'FALLITO', e.message, 'flusso senza eccezione', '/app/menu', 'piatti', profiloTema)
  }
}

export async function runPiattiFlowControls(ctx) {
  try {
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
    screenshot,
    SHOT_PROFILES,
    SHOT_TEMI,
  } = ctx

  const add = (id, esito, misurato, atteso, evidenza, schermata = 'piatti', profiloTema = 'telefono-390/chiaro') => {
    if (!runCtx.shouldRun(id)) return
    addRow(report, { id, schermata, profiloTema, esito, misurato, atteso, evidenza })
  }

  try {
    if (runCtx.shouldRun('piatti-testi')) {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoPiatti(page)
      const main = await page.locator('main').innerText()
      const ph = await page.getByPlaceholder(copyConst('PIATTI_SEARCH_PLACEHOLDER') ?? 'Cerca un piatto').count()
      const checks = [
        [copyConst('PIATTI_PAGE_TITLE'), 'Piatti'],
        [copyConst('PIATTI_PAGE_DESCRIPTION'), 'Il menù digitale del ristorante.'],
        [copyConst('PIATTI_NEW_BUTTON'), 'Nuovo piatto'],
        [copyConst('PIATTI_FILTERS_BUTTON'), 'Filtri'],
      ]
      const missing = checks.filter(([, fallback]) => !main.includes(fallback))
      if (ph < 1) missing.push('placeholder ricerca')
      add(
        'piatti-testi',
        missing.length ? 'FALLITO' : 'OK',
        missing.length ? `mancano: ${missing.map((c) => c[1]).join(', ')}` : 'testi principali ok',
        'testi §6 piatti/spec',
        '/app/menu',
      )
      await pctx.close()
    }

    if (runCtx.shouldRun('piatti-colonna-elenco')) {
      for (const profiloKey of ['telefono-390', 'notebook-1280']) {
        const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoPiatti(page)
        const m = await page.evaluate(() => {
          const table = document.querySelector('main table')
          const tableVisible = table ? table.getBoundingClientRect().width > 0 : false
          const card = document.querySelector('main [data-slot=card]')
          const col = document.querySelector('main .mx-auto')
          const dishCard = [...document.querySelectorAll('main [data-slot=card]')].find((c) =>
            c.getAttribute('aria-label')?.includes(','),
          )
          const nameEl = dishCard?.querySelector('p.truncate.font-medium')
          return {
            tableVisible,
            card: Boolean(card),
            colW: col ? Math.round(col.getBoundingClientRect().width) : 0,
            nameW: nameEl ? Math.round(nameEl.getBoundingClientRect().width) : 0,
          }
        })
        let esito = 'OK'
        let misurato = JSON.stringify(m)
        if (profiloKey === 'notebook-1280') {
          if (!m.tableVisible || m.colW > 1024 + 2) esito = 'FALLITO'
          misurato = `col=${m.colW}px; table=${m.tableVisible}`
        } else if (m.tableVisible) {
          esito = 'FALLITO'
        } else if (m.nameW && m.nameW < 100) {
          esito = 'FALLITO'
          misurato = `nameW=${m.nameW}px (soglia minima 100); colW=${m.colW}px`
        } else if (m.nameW && (m.nameW < 127 || m.nameW > 147)) {
          esito = 'AVVISO'
        }
        add('piatti-colonna-elenco', esito, misurato, 'layout colonna/schede', '/app/menu', 'piatti/elenco', `${profiloKey}/chiaro`)
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('piatti-azioni-pagina')) {
      for (const profiloKey of ['telefono-390', 'notebook-1280']) {
        const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoPiatti(page)
        const m = await page.evaluate(() => {
          const btn = [...document.querySelectorAll('main button')].find((b) =>
            b.textContent?.includes('Nuovo piatto'),
          )
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
        })
        const attesoW = profiloKey === 'telefono-390' ? 358 : null
        const ok =
          profiloKey === 'telefono-390'
            ? m.h >= 44 && m.w >= m.colW - 2
            : m.inline && m.h >= 28
        const misurato =
          profiloKey === 'telefono-390'
            ? `larghezza=${m.w}px, colonna=${m.colW}px, altezza=${m.h}px`
            : JSON.stringify(m)
        const atteso =
          profiloKey === 'telefono-390'
            ? `larghezza colonna ${attesoW}px (±2), altezza ≥44px`
            : 'pulsante in riga col titolo, altezza ≥28px'
        add(
          'piatti-azioni-pagina',
          ok ? 'OK' : 'FALLITO',
          misurato,
          atteso,
          '/app/menu',
          'piatti/elenco',
          `${profiloKey}/chiaro`,
        )
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('piatti-righe-azioni')) {
      menuDeleteVerifyPrefix()
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-row', disabled: true }])
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoPiatti(page)
      const m = await page.evaluate(() => {
        const row = document.querySelector('[aria-label^="verify-ui-row,"]')
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
      const ok =
        m.btn?.startsWith('Modifica ') &&
        m.btnSize &&
        !m.linkOnName &&
        m.switchDisabled
      add('piatti-righe-azioni', ok ? 'OK' : 'FALLITO', JSON.stringify(m), 'tre icone, switch disabilitato su disabled', '/app/menu')
      await pctx.close()
      menuDeleteVerifyPrefix()
    }

    await safePiattiStep(add, 'piatti-terminato', async () => {
      const failures = []
      try {
        menuDeleteVerifyPrefix()
        menuCreateDishes(testUser.email, [{ name: 'verify-ui-terminato' }])
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoPiatti(page)
        await toggleTerminato(page, 'verify-ui-terminato')
        await page.waitForTimeout(700)
        const body = await page.locator('main').innerText()
        if (!body.includes(copyConst('PIATTI_TOAST_SOLD_OUT') ?? 'Piatto segnato come terminato')) {
          failures.push('avviso terminato')
        }
        const dish = menuFindDish(testUser.email, 'verify-ui-terminato')
        if (!dish.dish?.soldOut) failures.push('soldOut API falso')
        await page.getByRole('button', { name: copyConst('PIATTI_FILTERS_BUTTON') ?? 'Filtri' }).click()
        await page.locator('[data-slot=sheet-content]').getByRole('combobox').nth(1).click()
        await page.getByRole('option', { name: copyConst('PIATTI_FILTER_STATE_SOLD_OUT') ?? 'Terminati' }).click()
        await page.getByRole('button', { name: copyConst('PIATTI_FILTERS_APPLY') ?? 'Applica' }).click()
        await page.waitForTimeout(500)
        const vis = await page.locator(`[aria-label^="verify-ui-terminato,"]`).count()
        if (vis < 1) failures.push('filtro Terminati')
        await toggleTerminato(page, 'verify-ui-terminato')
        await page.waitForTimeout(500)
        const body2 = await page.locator('main').innerText()
        if (!body2.includes(copyConst('PIATTI_TOAST_AVAILABLE_AGAIN') ?? 'Piatto di nuovo disponibile')) {
          failures.push('avviso disponibile')
        }
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      add(
        'piatti-terminato',
        failures.length ? 'FALLITO' : 'OK',
        failures.length ? failures.join(' | ') : 'interruttore, avvisi, soldOut API, filtro Terminati nel foglio Filtri, ripristino',
        'flusso §9 punto 5 (terminato + filtro Stato Terminati)',
        '/app/menu',
      )
    })

    if (runCtx.shouldRun('piatti-disabilita')) {
      const failures = []
      try {
        menuDeleteVerifyPrefix()
        menuCreateDishes(testUser.email, [{ name: 'verify-ui-terminato' }])
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoPiatti(page)
        await clickRowAction(page, 'verify-ui-terminato', 'disable')
        await page.waitForTimeout(600)
        let body = await page.locator('main').innerText()
        if (!body.includes(copyConst('PIATTI_TOAST_DISABLED') ?? 'Piatto disabilitato')) failures.push('disabilita')
        const dish = menuFindDish(testUser.email, 'verify-ui-terminato')
        if (!dish.dish?.disabled) failures.push('disabled API')
        await clickRowAction(page, 'verify-ui-terminato', 'enable')
        await page.waitForTimeout(600)
        body = await page.locator('main').innerText()
        if (!body.includes(copyConst('PIATTI_TOAST_ENABLED') ?? 'Piatto abilitato')) failures.push('abilita')
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      add('piatti-disabilita', failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'disabilita/abilita', '/app/menu')
    }

    if (runCtx.shouldRun('piatti-elimina-libero')) {
      const failures = []
      let docId = null
      try {
        menuDeleteVerifyPrefix()
        menuCreateDishes(testUser.email, [{ name: 'verify-ui-libero' }])
        docId = menuFindDish(testUser.email, 'verify-ui-libero').dish?.id ?? null
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoPiatti(page)
        await clickRowAction(page, 'verify-ui-libero', 'delete')
        const dlg = await page.locator('[role=alertdialog]').innerText()
        if (!dlg.includes('verify-ui-libero')) failures.push('titolo dialog')
        if (!dlg.includes(copyConst('PIATTI_DELETE_CONFIRM_IRREVERSIBLE') ?? 'Non si può annullare.')) {
          failures.push('irreversibile')
        }
        await page.getByRole('button', { name: copyConst('PIATTI_DELETE_BACK') ?? 'Indietro' }).click()
        if (await page.locator(`[aria-label^="verify-ui-libero,"]`).count() === 0) failures.push('indietro')
        await clickRowAction(page, 'verify-ui-libero', 'delete')
        await page
          .getByRole('alertdialog')
          .getByRole('button', { name: copyConst('PIATTI_DELETE_CONFIRM') ?? 'Elimina' })
          .click()
        await page.waitForTimeout(700)
        if (await page.locator(`[aria-label^="verify-ui-libero,"]`).count() > 0) failures.push('riga resta')
        const after = menuFindDish(testUser.email, 'verify-ui-libero')
        if (after.found) failures.push('API ancora presente')
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      add('piatti-elimina-libero', failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'conferma elimina', '/app/menu')
      if (runCtx.shouldRun('piatti-elimina-registro') && docId && failures.length === 0) {
        const log = menuFindDeleteLog(testUser.email, docId, 'verify-ui-libero')
        const ok =
          log.found &&
          log.eventType === 'delete' &&
          log.area === 'app' &&
          log.detail === log.expectedDetail
        add('piatti-elimina-registro', ok ? 'OK' : 'FALLITO', JSON.stringify(log), 'registro delete', 'Local API')
      }
    }

    if (runCtx.shouldRun('piatti-elimina-bloccato')) {
      const failures = []
      try {
        menuDeleteVerifyPrefix()
        menuCreateDishes(testUser.email, [{ name: 'verify-ui-in-uso' }])
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-in-uso',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-1'],
        })
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoPiatti(page)
        await clickRowAction(page, 'verify-ui-in-uso', 'delete')
        let dlg = await page.locator('[role=alertdialog]').innerText()
        if (!dlg.includes('verify-ui-menu-1')) failures.push('menu 1')
        await page.getByRole('button', { name: copyConst('PIATTI_DELETE_CLOSE') ?? 'Chiudi' }).click()
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-in-uso',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-2', 'verify-ui-menu-3', 'verify-ui-menu-4'],
        })
        await clickRowAction(page, 'verify-ui-in-uso', 'delete')
        dlg = await page.locator('[role=alertdialog]').innerText()
        if (!dlg.includes('4 menù fissi') && !dlg.includes('4 menù')) failures.push('conteggio 4')
        if (dlg.toLowerCase().includes('disabilit')) failures.push('suggerisce disabilita')
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      add('piatti-elimina-bloccato', failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'blocco menù fissi', '/app/menu')
    }

    if (runCtx.shouldRun('piatti-elimina-concorrenza')) {
      const failures = []
      const errTitle = copyConst('PIATTI_ACTION_ERROR_TITLE') ?? 'Operazione non riuscita'
      const errDesc =
        copyConst('PIATTI_ACTION_ERROR_DESCRIPTION') ??
        'Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore.'
      try {
        menuDeleteVerifyPrefix()
        menuCreateDishes(testUser.email, [{ name: 'verify-ui-corsa' }])
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoPiatti(page)
        await clickRowAction(page, 'verify-ui-corsa', 'delete')
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-corsa',
          categoryName: 'verify-ui-cat-corsa',
          menuNames: ['verify-ui-menu-corsa'],
        })
        await page
          .getByRole('alertdialog')
          .getByRole('button', { name: copyConst('PIATTI_DELETE_CONFIRM') ?? 'Elimina' })
          .click()
        await page.waitForTimeout(900)
        const dlg = await page.locator('[role=alertdialog]').innerText().catch(() => '')
        const blockTitle = `Non si può eliminare verify-ui-corsa`
        const isBlock = dlg.includes(blockTitle)
        const isDbRace = dlg.includes(errTitle)
        if (!isBlock && !isDbRace) {
          failures.push(`dialogo inatteso (letto: ${dlg.slice(0, 120).replace(/\s+/g, ' ')}…)`)
        }
        if (isDbRace && !dlg.includes(errDesc.slice(0, 40))) {
          failures.push('descrizione «Operazione non riuscita» mancante')
        }
        if (isBlock && !dlg.includes('verify-ui-menu-corsa')) {
          failures.push('blocco senza elenco menù aggiornato (verify-ui-menu-corsa)')
        }
        const still = menuFindDish(testUser.email, 'verify-ui-corsa')
        if (!still.found) failures.push('piatto non più in API')
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      const misuratoConc =
        failures.length === 0
          ? 'finestra blocco o «Operazione non riuscita»; piatto verify-ui-corsa ancora in API'
          : failures.join(' | ')
      add(
        'piatti-elimina-concorrenza',
        failures.length ? 'FALLITO' : 'OK',
        misuratoConc,
        '«Non si può eliminare {nome}» con menù aggiornati oppure «Operazione non riuscita»; piatto resta',
        '/app/menu',
      )
    }

    if (runCtx.shouldRun('piatti-elimina-permessi')) {
      const failures = []
      const notes = []
      try {
        menuDeleteVerifyPrefix()
        menuCreateDishes(testUser.email, [{ name: 'verify-ui-perm' }])
        const staffAdmin = menuFindStaffUser('admin')
        const staffSuper = menuFindStaffUser('super-admin')
        notes.push('utente senza ruolo: NON PROVATO (Users vieta record senza Admin/App role)')
        if (staffAdmin.email) {
          const d = menuTryDeleteDish(staffAdmin.email, 'verify-ui-perm')
          if (!d.ok) failures.push(`admin: ${d.reason}`)
        } else {
          notes.push('admin: non trovato in DB dev')
        }
        menuCreateDishes(testUser.email, [{ name: 'verify-ui-perm2' }])
        if (staffSuper.email) {
          const d2 = menuTryDeleteDish(staffSuper.email, 'verify-ui-perm2')
          if (!d2.ok) failures.push(`super-admin: ${d2.reason}`)
        }
      } finally {
        menuDeleteVerifyPrefix()
      }
      add(
        'piatti-elimina-permessi',
        failures.length ? 'FALLITO' : 'OK',
        `${failures.join(' | ') || 'admin/super-admin API ok'}; ${notes.join('; ')}`,
        'manager/admin ok, norole no',
        'payload',
      )
    }

    if (runCtx.shouldRun('piatti-modulo-campi')) {
      for (const temaKey of ['chiaro', 'scuro']) {
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', temaKey, baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoPiatti(page)
        await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
        const sheet = await page.locator('[data-slot=sheet-content]').innerText()
        const need = [
          copyConst('PIATTI_FORM_NEW_TITLE'),
          copyConst('PIATTI_FORM_NAME'),
          copyConst('PIATTI_FORM_DESCRIPTION'),
          copyConst('PIATTI_FORM_PRICE'),
          copyConst('PIATTI_FORM_SAVE'),
          copyConst('PIATTI_FORM_CANCEL'),
        ].filter(Boolean)
        const missing = need.filter((t) => !sheet.includes(t))
        add(
          'piatti-modulo-campi',
          missing.length ? 'FALLITO' : 'OK',
          missing.length ? `mancano: ${missing.join(', ')}` : 'campi modulo',
          'attributi modulo',
          '/app/menu',
          'piatti/modulo',
          `telefono-390/${temaKey}`,
        )
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('piatti-modulo-validazione')) {
      const failures = []
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoPiatti(page)
      await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
      await page.getByRole('button', { name: copyConst('PIATTI_FORM_SAVE') ?? 'Salva' }).click()
      const err = copyConst('PIATTI_ERROR_REQUIRED') ?? 'Campo obbligatorio.'
      if ((await page.locator('[data-slot=sheet-content]').innerText()).split(err).length < 2) failures.push('obbligatorio')
      const price = page.locator('#dish-field-price')
      for (const v of ['9,5', '9,50', '9.50']) {
        await price.fill(v)
        await page.getByRole('button', { name: copyConst('PIATTI_FORM_SAVE') ?? 'Salva' }).click()
        await page.waitForTimeout(200)
      }
      for (const v of ['abc', '9,555']) {
        await price.fill(v)
        await page.getByRole('button', { name: copyConst('PIATTI_FORM_SAVE') ?? 'Salva' }).click()
        const t = await page.locator('[data-slot=sheet-content]').innerText()
        if (!t.includes(copyConst('PIATTI_ERROR_PRICE') ?? 'Inserisci un prezzo valido')) failures.push(`prezzo ${v}`)
      }
      add('piatti-modulo-validazione', failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'validazione', '/app/menu')
      await pctx.close()
    }

    if (runCtx.shouldRun('piatti-modulo-inglese')) {
      const failures = []
      const badgeMissing = copyConst('PIATTI_BADGE_MISSING') ?? 'Manca'
      const badgePresent = copyConst('PIATTI_BADGE_PRESENT') ?? 'Presente'
      menuDeleteVerifyPrefix()
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-noen', description: 'Desc IT' }])
      menuCreateDishes(testUser.email, [{ name: 'verify-ui-yesen', nameEn: 'Plate', descriptionEn: 'Desc' }])
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoPiatti(page)
      await clickRowAction(page, 'verify-ui-noen', 'edit')
      let sheet = await page.locator('[data-slot=sheet-content]').innerText()
      if (!sheet.includes(badgeMissing)) failures.push(`badge: atteso «${badgeMissing}» nel foglio`)
      await page.keyboard.press('Escape')
      await clickRowAction(page, 'verify-ui-yesen', 'edit')
      sheet = await page.locator('[data-slot=sheet-content]').innerText()
      if (!sheet.includes(badgePresent)) failures.push(`badge: atteso «${badgePresent}» nel foglio`)
      const en = menuReadDishEn(testUser.email, 'verify-ui-noen')
      const attesoEn = { name: 'verify-ui-noen', description: 'Desc IT' }
      if (en.name !== attesoEn.name || en.description !== attesoEn.description) {
        failures.push(
          `locale=en: name=${JSON.stringify(en.name)} desc=${JSON.stringify(en.description)}; atteso name=${JSON.stringify(attesoEn.name)} desc=${JSON.stringify(attesoEn.description)}`,
        )
      }
      const misurato =
        failures.length > 0
          ? failures.join(' | ')
          : `badge Manca/Presente ok; locale=en name=${JSON.stringify(en.name)} desc=${JSON.stringify(en.description)}`
      add(
        'piatti-modulo-inglese',
        failures.length ? 'FALLITO' : 'OK',
        misurato,
        'Manca/Presente; con inglese vuoto locale=en ricade su italiano per nome e descrizione',
        '/app/menu',
      )
      await pctx.close()
      menuDeleteVerifyPrefix()
    }

    if (runCtx.shouldRun('piatti-modulo-footer')) {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoPiatti(page)
      await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
      await page.locator('[data-slot=sheet-content]').evaluate((el) => {
        el.scrollTop = el.scrollHeight
      })
      const m = await page.evaluate(() => {
        const footer = document.querySelector('[data-slot=sheet-footer]')
        const btns = footer ? [...footer.querySelectorAll('button')] : []
        const h = btns[0]?.getBoundingClientRect().height ?? 0
        const sheet = document.querySelector('[data-slot=sheet-content]')
        const maxH = sheet ? parseFloat(getComputedStyle(sheet).maxHeight) : 0
        return { footerH: Math.round(h), maxH: Math.round(maxH), btnCount: btns.length }
      })
      const ok = m.btnCount === 2 && m.footerH >= 43 && m.maxH > 0
      add('piatti-modulo-footer', ok ? 'OK' : 'FALLITO', JSON.stringify(m), 'footer 44px, max 90vh', '/app/menu')
      await pctx.close()
    }

    if (runCtx.shouldRun('piatti-tassonomie')) {
      const failures = []
      let tax = { categories: [], allergens: [] }
      try {
      tax = menuListTaxonomies(testUser.email)
      const catDenied = menuTryCreateTaxonomy(testUser.email, 'category')
      const allDenied = menuTryCreateTaxonomy(testUser.email, 'allergen')
      if (catDenied.ok) failures.push(`creazione categoria: atteso rifiuto, ottenuto ok=${catDenied.ok}`)
      if (allDenied.ok) failures.push(`creazione allergene: atteso rifiuto, ottenuto ok=${allDenied.ok}`)
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoPiatti(page)
      await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
      const catField = copyConst('PIATTI_FORM_CATEGORY') ?? 'Categoria'
      await page.getByRole('combobox', { name: catField }).click()
      const listbox = page.getByRole('listbox')
      await listbox.waitFor({ state: 'visible', timeout: 12000 })
      await listbox.getByRole('option').first().waitFor({ timeout: 12000 })
      const catOpts = (await listbox.getByRole('option').allTextContents()).map((t) => t.trim()).filter(Boolean)
      const apiCatNames = tax.categories.map((c) => c.name)
      const missingCats = apiCatNames.filter((n) => !catOpts.some((o) => o.includes(n)))
      const idLike = catOpts.filter((o) => /^\d+$/.test(o))
      if (idLike.length) failures.push(`categorie con identificativo al posto del nome: ${idLike.join(', ')}`)
      if (missingCats.length) {
        failures.push(`categorie UI mancanti: ${missingCats.join(', ')} (opzioni=[${catOpts.join(' | ')}]; API=[${apiCatNames.join(', ')}])`)
      }
      await page.keyboard.press('Escape')
      await page.waitForTimeout(200)
      const formSheet = page.locator('[data-slot=sheet-content]').first()
      await formSheet.evaluate((el) => {
        el.scrollTop = el.scrollHeight
      })
      const allergenLabels = await page.evaluate(() =>
        [...document.querySelectorAll('[data-slot=sheet-content] button[type=button]')]
          .map((b) => b.textContent?.trim())
          .filter((t) => t && t.length > 1),
      )
      await page.getByRole('button', { name: copyConst('PIATTI_FORM_CANCEL') ?? 'Annulla' }).click()
      await formSheet.waitFor({ state: 'hidden', timeout: 8000 })
      const allCatsLabel = copyConst('PIATTI_FILTERS_ALL_CATEGORIES') ?? 'Tutte le categorie'
      const allStatesLabel = copyConst('PIATTI_FILTERS_ALL_STATES') ?? 'Tutti'
      const filtriBtn = page.locator('main button').filter({ hasText: copyConst('PIATTI_FILTERS_BUTTON') ?? 'Filtri' })
      await filtriBtn.click()
      const filterSheet = page.locator('[data-slot=sheet-content]').last()
      await filterSheet.waitFor({ state: 'visible' })
      const filterCombos = filterSheet.getByRole('combobox')
      const catFilterText = (await filterCombos.nth(0).innerText()).trim()
      const stateFilterText = (await filterCombos.nth(1).innerText()).trim()
      if (!catFilterText.includes(allCatsLabel)) {
        failures.push(`filtro categoria: atteso «${allCatsLabel}», letto «${catFilterText}»`)
      }
      if (!stateFilterText.includes(allStatesLabel)) {
        failures.push(`filtro stato: atteso «${allStatesLabel}», letto «${stateFilterText}»`)
      }
      await filterCombos.nth(0).click()
      const filterListbox = page.getByRole('listbox')
      await filterListbox.waitFor({ state: 'visible', timeout: 8000 })
      const filterCatOpts = (await filterListbox.getByRole('option').allTextContents()).map((t) => t.trim())
      if (!filterCatOpts.some((o) => o.includes(allCatsLabel))) {
        failures.push(`opzioni filtro categoria senza «${allCatsLabel}»: [${filterCatOpts.join(' | ')}]`)
      }
      const filterIdLike = filterCatOpts.filter((o) => o !== allCatsLabel && /^\d+$/.test(o))
      if (filterIdLike.length) failures.push(`filtro categorie con id: ${filterIdLike.join(', ')}`)
      await page.keyboard.press('Escape')
      await page.keyboard.press('Escape')
      const apiAllergens = tax.allergens?.map((a) => a.name) ?? []
      const missingAllergens = apiAllergens.filter((n) => !allergenLabels.some((l) => l?.includes(n)))
      if (apiAllergens.length && missingAllergens.length) {
        failures.push(`allergeni UI mancanti: ${missingAllergens.join(', ')}`)
      }
      const misurato = [
        `modulo categorie (${catOpts.length}): ${catOpts.slice(0, 8).join(' | ')}${catOpts.length > 8 ? '…' : ''}`,
        `filtro categorie (${filterCatOpts.length}): ${filterCatOpts.slice(0, 6).join(' | ')}`,
        `filtro UI categoria/stato: «${catFilterText}» / «${stateFilterText}»`,
        `categorie API (${apiCatNames.length}): ${apiCatNames.slice(0, 8).join(', ')}`,
        `crea categoria: ok=${catDenied.ok} motivo=${catDenied.reason ?? '—'}`,
        `crea allergene: ok=${allDenied.ok} motivo=${allDenied.reason ?? '—'}`,
      ].join('; ')
      add(
        'piatti-tassonomie',
        failures.length ? 'FALLITO' : 'OK',
        failures.length ? `${misurato}; ${failures.join(' | ')}` : misurato,
        'opzioni = collection; creazioni category/allergen rifiutate (overrideAccess false)',
        '/app/menu',
      )
      await pctx.close()
      } catch (e) {
        add(
          'piatti-tassonomie',
          'FALLITO',
          `eccezione lanciatore: ${e.message}`,
          'opzioni = collection; creazioni rifiutate',
          '/app/menu',
        )
      }
    }

    if (runCtx.shouldRun('piatti-persistenza')) {
      const failures = []
      const notes = []
      try {
        menuDeleteVerifyPrefix()
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoPiatti(page)
        await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
        await page.locator('#dish-field-name').fill('verify-ui-nuovo')
        await page.locator('#dish-field-price').fill('12,50')
        await page.getByRole('combobox', { name: copyConst('PIATTI_FORM_CATEGORY') ?? 'Categoria' }).click()
        await page.getByRole('option').first().click()
        await page.getByRole('button', { name: copyConst('PIATTI_FORM_SAVE') ?? 'Salva' }).click()
        await page.waitForTimeout(800)
        const saved = menuFindDish(testUser.email, 'verify-ui-nuovo')
        if (!saved.found || saved.dish?.price !== 12.5) failures.push('create read')
        notes.push('norole create: NON PROVATO (schema Users)')
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      add(
        'piatti-persistenza',
        failures.length ? 'FALLITO' : 'OK',
        `${failures.join(' | ') || 'ok'}; ${notes.join('; ')}`,
        'persistenza',
        '/app/menu',
      )
    }

    if (runCtx.shouldRun('piatti-filtri-ricerca')) {
      const failures = []
      try {
        menuDeleteVerifyPrefix()
        menuCreateDishes(testUser.email, [{ name: 'verify-ui-it', nameEn: 'verify-ui-en-name' }])
        for (const profiloKey of ['telefono-390', 'notebook-1280']) {
          const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
          await loginApp(page, baseUrl, testUser.email, testPassword)
          await gotoPiatti(page)
          await page.getByPlaceholder(copyConst('PIATTI_SEARCH_PLACEHOLDER') ?? 'Cerca un piatto').fill('verify-ui-en-name')
          await page.waitForTimeout(500)
          if (await page.locator('[aria-label^="verify-ui-it,"]').count() < 1) failures.push(`en search ${profiloKey}`)
          await pctx.close()
        }
      } finally {
        menuDeleteVerifyPrefix()
      }
      add('piatti-filtri-ricerca', failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'ricerca/filtri', '/app/menu')
    }

    if (runCtx.shouldRun('piatti-ordine-100')) {
      const failures = []
      const attesoBanner = 'Mostrati 100 piatti su 101'
      const attesoSotto = 'Restringi l’elenco con la ricerca o i filtri per trovare gli altri.'
      let misurato = '—'
      try {
        menuDeleteVerifyPrefix()
        const { count: dishCountBefore } = menuCountDishes()
        const toCreate = Math.max(0, 101 - dishCountBefore)
        if (toCreate > 0) {
          const bulk = Array.from({ length: toCreate }, (_, i) => ({
            name: `verify-ui-bulk-${String(i + 1).padStart(3, '0')}`,
          }))
          menuCreateDishes(testUser.email, bulk)
        }
        const { ctx: pctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoPiatti(page)
        const body = await page.locator('main').innerText()
        const rowCount = await page.locator('main table tbody tr').count()
        const hasBanner = body.includes(attesoBanner)
        const hasSotto = body.includes(attesoSotto)
        const { count: dishCountAfter } = menuCountDishes()
        misurato = `totale API=${dishCountAfter} (prima=${dishCountBefore}, creati=${toCreate}); righe tabella=${rowCount}; banner100/101=${hasBanner}; sottoBanner=${hasSotto}; estratto=${body.includes('100 piatti') ? body.split('\n').find((l) => l.includes('100 piatti'))?.trim() : 'assente'}`
        if (!hasBanner) failures.push(`banner: atteso «${attesoBanner}»`)
        if (!hasSotto) failures.push(`sotto-banner: atteso testo con «Restringi l'elenco»`)
        if (rowCount !== 100) failures.push(`righe visibili=${rowCount}; atteso 100`)
        await pctx.close()
      } finally {
        menuDeleteVerifyPrefix()
      }
      add(
        'piatti-ordine-100',
        failures.length ? 'FALLITO' : 'OK',
        failures.length ? `${misurato}; ${failures.join(' | ')}` : misurato,
        `${attesoBanner}; ${attesoSotto}; 100 righe in tabella`,
        '/app/menu',
        'piatti/piu-di-100',
        'notebook-1280/chiaro',
      )
    }

    if (runCtx.shouldRun('piatti-nomi-accessibili')) {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoPiatti(page)
      const labels = await page.evaluate(() =>
        [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')),
      )
      const banned = ['Close', 'Edit', 'Delete', 'Remove', 'Save', 'Cancel', 'Add', 'Toggle', 'Disable', 'Enable']
      const hit = banned.filter((w) => labels.some((l) => l === w || l?.includes(w)))
      add('piatti-nomi-accessibili', hit.length ? 'FALLITO' : 'OK', hit.join(', ') || 'nessun inglese', 'italiano T1', '/app/menu')
      await pctx.close()
    }

    if (runCtx.shouldRun('piatti-accesso')) {
      add(
        'piatti-accesso',
        'NON PROVATO',
        '—',
        'stesso esito di /app/hours per utente senza ruolo',
        'impossibile creare utente senza ruoli (validazione Users); controllo dubbio se la guardia è solo canAccessAppArea',
      )
    }

    if (runCtx.shouldRun('piatti-casella-misure')) {
      for (const temaKey of ['chiaro', 'scuro']) {
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', temaKey, baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoPiatti(page)
        await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
        const labels = [
          copyConst('PIATTI_FORM_GLUTEN_FREE') ?? 'Senza glutine',
          copyConst('PIATTI_FORM_DAIRY_FREE') ?? 'Senza latticini',
          copyConst('PIATTI_FORM_VEGAN') ?? 'Vegano',
          copyConst('PIATTI_FORM_EGG_FREE') ?? 'Senza uova',
          copyConst('PIATTI_FORM_SOLD_OUT_LABEL') ?? 'Terminato per il servizio',
          copyConst('PIATTI_FORM_DISABLED_LABEL') ?? 'Disabilitato',
        ]
        const m = await page.evaluate((names) => {
          const out = []
          for (const name of names) {
            const root = document.querySelector(`[role=checkbox][aria-label="${name}"]`)
            const box = root?.querySelector('[data-slot=checkbox-box]')
            const rr = root?.getBoundingClientRect()
            const br = box?.getBoundingClientRect()
            out.push({
              name,
              root: rr ? `${Math.round(rr.width)}x${Math.round(rr.height)}` : '—',
              box: br ? `${Math.round(br.width)}x${Math.round(br.height)}` : '—',
            })
          }
          return out
        }, labels)
        const failures = []
        for (const row of m) {
          const [rw, rh] = (row.root || '0x0').split('x').map(Number)
          const [bw, bh] = (row.box || '0x0').split('x').map(Number)
          if (rw < 43 || rh < 43) failures.push(`${row.name} root ${row.root}`)
          if (bw < 15 || bw > 17 || bh < 15 || bh > 17) failures.push(`${row.name} box ${row.box}`)
        }
        add(
          'piatti-casella-misure',
          failures.length ? 'FALLITO' : 'OK',
          failures.length ? failures.join('; ') : JSON.stringify(m),
          'radice ≥44×44; box 16×16 (±1)',
          '/app/menu',
          'piatti/modulo',
          `telefono-390/${temaKey}`,
        )
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('piatti-allergeni-selezione')) {
      for (const temaKey of ['chiaro', 'scuro']) {
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', temaKey, baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoPiatti(page)
        await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
        const allergenButtons = page.locator('[data-slot=sheet-content] [role=group] button')
        const count = await allergenButtons.count()
        const failures = []
        if (count < 2) failures.push('meno di due allergeni nel modulo')
        else {
          await allergenButtons.nth(0).click()
          await allergenButtons.nth(1).click()
        }
        await page.getByRole('checkbox', { name: copyConst('PIATTI_FORM_DAIRY_FREE') ?? 'Senza latticini' }).click()
        const hint = await page.locator('[data-slot=sheet-content]').innerText()
        if (!hint.includes('Selezionati: 2.')) failures.push('conteggio allergeni')
        const pressed = await page.evaluate(() =>
          [...document.querySelectorAll('[data-slot=sheet-content] button[aria-pressed=true]')].length,
        )
        if (pressed < 2) failures.push(`aria-pressed=${pressed}`)
        if (screenshot) {
          await screenshot(page, report, `piatti-modulo-allergeni-telefono-390-${temaKey}`, temaKey)
        }
        add(
          'piatti-allergeni-selezione',
          failures.length ? 'FALLITO' : 'OK',
          failures.join(' | ') || '2 allergeni + Senza latticini; screenshot modulo-allergeni',
          'Selezionati: 2.; stato selezionato visibile',
          'img/',
          'piatti/modulo-allergeni',
          `telefono-390/${temaKey}`,
        )
        await pctx.close()
      }
    }

    if (runCtx.shouldRun('piatti-confronto-visivo')) {
      const expectedShots = PIATTI_CONFRONTO_STATI.length * SHOT_PROFILES.length * SHOT_TEMI.length
      let shotCount = 0
      const skipped = []
      for (const statoId of PIATTI_CONFRONTO_STATI) {
        for (const profiloKey of SHOT_PROFILES) {
          for (const temaKey of SHOT_TEMI) {
            let simChild = null
            try {
              let pageBase = baseUrl
              const simEnv = PIATTI_SIM_STATES[statoId]
              if (simEnv) {
                await waitForPortFree(SIM_PORT)
                simChild = startMenuDevServerLocal(SIM_PORT, simEnv)
                pageBase = `http://localhost:${SIM_PORT}`
                await waitForUrlLocal(pageBase)
              } else if (statoId === 'vuoto') {
                const { count } = menuCountDishes()
                if (count > 0) {
                  skipped.push(`${statoId}/${profiloKey}/${temaKey}: DB con ${count} piatti`)
                  continue
                }
              }
              const { ctx: pctx, page } = await newPage(browser, profiloKey, temaKey, pageBase)
              await loginApp(page, pageBase, testUser.email, testPassword)
              if (simEnv && statoId === 'caricamento') {
                await page.goto('/app/menu', { waitUntil: 'commit' })
                await sleep(800)
              } else if (simEnv && statoId === 'errore-caricamento') {
                await page.goto('/app/menu', { waitUntil: 'networkidle' })
              } else if (simEnv && statoId === 'errore-azione') {
                await gotoPiatti(page)
                await page.getByRole('button', { name: copyConst('PIATTI_NEW_BUTTON') ?? 'Nuovo piatto' }).click()
                await page.locator('#dish-field-name').fill('verify-ui-err-shot')
                await page.locator('#dish-field-price').fill('9,00')
                await page.getByRole('combobox', { name: copyConst('PIATTI_FORM_CATEGORY') ?? 'Categoria' }).click()
                await page.getByRole('option').nth(1).click()
                await page.getByRole('button', { name: copyConst('PIATTI_FORM_SAVE') ?? 'Salva' }).click()
                await page.waitForTimeout(600)
              } else {
                await preparePiattiState(page, statoId, {
                  ...ctx,
                  page,
                  browser,
                  newPage,
                  loginApp,
                  testPassword,
                  baseUrl: pageBase,
                })
              }
              if (screenshot) {
                await screenshot(page, report, `piatti-${statoId}-${profiloKey}-${temaKey}`, temaKey)
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
        'piatti-confronto-visivo',
        esito,
        `screenshot=${shotCount}/${expectedShots}${skipped.length ? `; saltati: ${skipped.slice(0, 5).join('; ')}${skipped.length > 5 ? ` (+${skipped.length - 5})` : ''}` : ''}`,
        `${PIATTI_CONFRONTO_STATI.length} stati × ${SHOT_PROFILES.length} profili × ${SHOT_TEMI.length} temi (sezione immagini JSON)`,
        'img/',
      )
    }

    if (runCtx.shouldRun('piatti-stato-vuoto')) {
      const { count } = menuCountDishes()
      add(
        'piatti-stato-vuoto',
        'NON PROVATO',
        count > 0 ? `database con ${count} piatti (il lanciatore non svuota il DB)` : 'database vuoto ma stato non preparato in questo giro',
        '«Nessun piatto nel menù.» con pulsante Nuovo piatto',
        'stato_prova JSON: giudizio nel confronto visivo',
      )
    }

    const rinviati = ['piatti-ricompila', 'piatti-disabilitato-ovunque']
    for (const id of rinviati) {
      if (!runCtx.shouldRun(id)) continue
      add(id, 'NON PROVATO', '—', '—', 'rinviato alla 6.5')
    }
  } finally {
    menuDeleteVerifyPrefix()
  }
  } catch (e) {
    ctx.report?.anomalie?.push(`runPiattiFlowControls: ${e.message}`)
    if (ctx.runCtx?.shouldRun('piatti-flow-runtime')) {
      ctx.addRow(ctx.report, {
        id: 'piatti-flow-runtime',
        schermata: 'piatti',
        profiloTema: '—',
        esito: 'FALLITO',
        misurato: e.message,
        atteso: 'flussi piatti senza eccezione',
        evidenza: 'run-piatti.mjs',
      })
    }
  }
}

export async function runPiattiStatiUi(ctx) {
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
  if (!startMenuDevServer || !waitForUrl) {
    addRow(report, {
      id: 'piatti-stati-ui',
      schermata: 'piatti',
      profiloTema: '—',
      esito: 'NON PROVATO',
      misurato: '—',
      atteso: 'simulazioni dev',
      evidenza: 'helper server mancante nel contesto',
    })
    return
  }
  if (!runCtx.shouldRun('piatti-stati-ui')) return
  const failures = []

  if (await isPortFree(SIM_PORT)) {
    await waitForPortFree(SIM_PORT)
    const delayChild = startMenuDevServer(SIM_PORT, { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '2500' })
    try {
      const simUrl = `http://localhost:${SIM_PORT}`
      await waitForUrl(simUrl)
      progressStep('piatti', 'caricamento', 'telefono-390', 'chiaro')
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', simUrl)
      await loginApp(page, simUrl, testUser.email, testPassword)
      await page.goto('/app/menu', { waitUntil: 'commit' })
      const sk = await page.locator('[data-slot=skeleton]').count()
      if (sk < 4) failures.push(`caricamento: skeleton=${sk}`)
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
    await page.goto('/app/menu', { waitUntil: 'networkidle' })
    const body = await page.locator('main').innerText()
    if (!body.includes(copyConst('PIATTI_LOAD_ERROR_TITLE') ?? 'Impossibile caricare i piatti')) {
      failures.push('errore caricamento')
    }
    await pctx.close()
  } catch (e) {
    failures.push(`errore: ${e.message}`)
  } finally {
    errChild.kill('SIGTERM')
    await waitForPortFree(SIM_PORT)
  }

  addRow(report, {
    id: 'piatti-stati-ui',
    schermata: 'piatti',
    profiloTema: 'telefono-390/chiaro',
    esito: failures.length ? 'FALLITO' : 'OK',
    misurato: failures.join(' | ') || 'simulazioni caricamento ed errore caricamento ok',
    atteso: 'skeleton caricamento; avviso errore caricamento (stato vuoto in piatti-stato-vuoto)',
    evidenza: `localhost:${SIM_PORT}`,
  })
}
