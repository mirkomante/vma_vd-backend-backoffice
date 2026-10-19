import { menuScreenCopyConst } from './menu-screen-copy.mjs'
import {
  clickRowAction,
  gotoMenuList,
  measureMoveButtons,
  waitForSheetReady,
} from './menu-list-ui-helpers.mjs'
import { waitForAnimationsSettled } from './measure-stable.mjs'
import {
  menuAddDishToFixedMenu,
  menuCreateFixedMenuFixture,
  menuCreateMenuService,
  menuCreateSpecialDayForMenu,
  menuDeleteVerifyPrefix,
  menuEnsureMenuListFixtures,
  menuFindFixedMenu,
  menuFindDish,
} from './menu-payload.mjs'
import { runMenuListSupplementaryFlows } from './run-menu-list-supplementary-flows.mjs'
import { selectComboboxOptionByKeyboard } from './catalog-ui-helpers.mjs'

const ENGLISH_BANNED = ['Close', 'Edit', 'Delete', 'Remove', 'Save', 'Cancel', 'Add', 'Toggle', 'Move']

function copy(screenId, name) {
  return menuScreenCopyConst(screenId, name)
}

function addRow(ctx, id, screenId, esito, misurato, atteso, evidenza, profiloTema = 'telefono-390/chiaro') {
  ctx.addRow(ctx.report, {
    id,
    schermata: screenId,
    profiloTema,
    esito,
    misurato,
    atteso,
    evidenza,
  })
}

function controlDef(CONTROLLI, screenId, controlId) {
  const screen = CONTROLLI.schermate?.find((s) => s.id === screenId)
  return screen?.controlli?.find((c) => c.id === controlId)
}

function isRinviato65(ctrl) {
  return ctrl?.rinviato_a === '6.5' || (ctrl?.stato_prova ?? '').includes('NON PROVABILE')
}

async function runServiziFlows(ctx, config) {
  const { browser, baseUrl, runCtx, CONTROLLI, newPage, loginApp, testUser, testPassword } = ctx
  const sid = config.id

  const runIf = async (id, fn) => {
    if (!runCtx.shouldRun(id)) return
    const ctrl = controlDef(CONTROLLI, sid, id)
    if (isRinviato65(ctrl)) {
      addRow(ctx, id, sid, 'NON PROVATO', '—', '—', ctrl?.stato_prova?.includes('6.5') ? 'rinviato alla 6.5' : ctrl?.stato_prova ?? 'NON PROVABILE')
      return
    }
    await fn()
  }

  await runIf('servizi-senza-ricerca-filtri', async () => {
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await gotoMenuList(page, config)
    const hasSearch = (await page.getByPlaceholder(/cerca/i).count()) > 0
    const hasFiltri = (await page.getByRole('button', { name: 'Filtri' }).count()) > 0
    addRow(
      ctx,
      'servizi-senza-ricerca-filtri',
      sid,
      hasSearch || hasFiltri ? 'FALLITO' : 'OK',
      `search=${hasSearch}; filtri=${hasFiltri}`,
      'nessuna ricerca/filtri',
      config.path,
    )
    await pctx.close()
  })

  await runIf('servizi-modulo-validazione', async () => {
    const failures = []
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await gotoMenuList(page, config)
    await page.getByRole('button', { name: config.newButton }).click()
    await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
    const err = copy(sid, 'ERROR_REQUIRED') ?? 'Campo obbligatorio.'
    const sheet = await page.locator('[data-slot=sheet-content]').innerText()
    const errCount = (sheet.match(new RegExp(err, 'g')) ?? []).length
    if (errCount < 2) failures.push(`errori=${errCount}`)
    await pctx.close()
    addRow(ctx, 'servizi-modulo-validazione', sid, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'validazione vuoto', 'due obbligatori', config.path)
  })

  await runIf('servizi-elimina-senza-uso', async () => {
    const failures = []
    try {
      menuDeleteVerifyPrefix()
      menuCreateMenuService(testUser.email, { name: 'verify-ui-servizio-libero' })
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoMenuList(page, config)
      await clickRowAction(page, 'verify-ui-servizio-libero', 'delete')
      await waitForAnimationsSettled(page, { rootSelector: '[role=alertdialog]' })
      const dlg = await page.locator('[role=alertdialog]').innerText()
      if (!dlg.includes('verify-ui-servizio-libero')) failures.push('titolo dialogo')
      if (!dlg.includes('Non si può annullare')) failures.push('frase annullamento')
      if (/menù fisso/i.test(dlg)) failures.push('cascade inatteso')
      addRow(ctx, 'servizi-elimina-senza-uso', sid, failures.length ? 'FALLITO' : 'OK', dlg.slice(0, 200), 'solo Non si può annullare', config.path)
      await pctx.close()
    } finally {
      menuDeleteVerifyPrefix()
    }
  })

  await runIf('servizi-nomi-accessibili', async () => {
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await gotoMenuList(page, config)
    const body = await page.locator('main').innerText()
    const labels = await page.evaluate(() =>
      [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')),
    )
    const hits = ENGLISH_BANNED.filter((w) => body.includes(w) || labels.some((l) => l?.includes(w)))
    addRow(ctx, 'servizi-nomi-accessibili', sid, hits.length ? 'FALLITO' : 'OK', hits.join(', ') || 'nessuna stringa inglese', 'italiano', config.path)
    await pctx.close()
  })

  await runMenuListSupplementaryFlows(ctx, config)
}

async function runMenuFissiFlows(ctx, config) {
  const { browser, baseUrl, runCtx, CONTROLLI, newPage, loginApp, testUser, testPassword } = ctx
  const sid = config.id

  const runIf = async (id, fn) => {
    if (!runCtx.shouldRun(id)) return
    const ctrl = controlDef(CONTROLLI, sid, id)
    if (isRinviato65(ctrl)) {
      addRow(ctx, id, sid, 'NON PROVATO', '—', '—', 'rinviato alla 6.5')
      return
    }
    await fn()
  }

  await runIf('menu-fissi-schede-percorsi', async () => {
    const failures = []
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await gotoMenuList(page, config)
    const tabMenu = page.getByRole('tab', { name: 'Menù fissi' })
    const tabCat = page.getByRole('tab', { name: 'Categorie' })
    const menuHref = await tabMenu.getAttribute('href')
    const catHref = await tabCat.getAttribute('href')
    if (menuHref !== '/app/menu/fixed') failures.push(`href menu=${menuHref}`)
    if (catHref !== '/app/menu/fixed/categories') failures.push(`href cat=${catHref}`)
    await page.evaluate(() => {
      window.__v4 = 1
    })
    const docReloadedMarker = await page.evaluate(() => window.__v4 === 1)
    await Promise.all([page.waitForURL(/\/fixed\/categories/, { timeout: 20000 }), tabCat.click()])
    const docReloadedAfter = await page.evaluate(() => window.__v4 !== 1)
    const documentReloaded = docReloadedMarker && docReloadedAfter
    if (documentReloaded) failures.push('documentReloaded=true (atteso false con Link Next)')
    if (!page.url().includes('/categories')) failures.push(`url dopo tab=${page.url()}`)
    await page.goBack({ waitUntil: 'networkidle' })
    if (!page.url().includes('/menu/fixed') || page.url().includes('/categories')) failures.push(`back url=${page.url()}`)
    await page.goto(`${baseUrl}/app/menu/fixed/categories`, { waitUntil: 'networkidle' })
    const current = await tabCat.getAttribute('aria-current')
    if (current !== 'page') failures.push(`aria-current categorie=${current}`)
    addRow(
      ctx,
      'menu-fissi-schede-percorsi',
      sid,
      failures.length ? 'FALLITO' : 'OK',
      `${failures.join(' | ') || `href menu=${menuHref}; cat=${catHref}`}; documentReloaded=${documentReloaded}`,
      'schede come percorsi',
      config.path,
    )
    await pctx.close()
  })

  await runIf('menu-fissi-categoria-modulo', async () => {
    const failures = []
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await gotoMenuList(page, config, config.categoriesPath)
    await page.getByRole('button', { name: config.newCategoryButton }).click()
    await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
    const err = copy(sid, 'ERROR_REQUIRED') ?? 'Campo obbligatorio.'
    const sheet = await page.locator('[data-slot=sheet-content]').innerText()
    if (!sheet.includes(err)) failures.push('errore nome vuoto')
    if ((sheet.match(new RegExp(err, 'g')) ?? []).length > 1) failures.push('errori extra')
    addRow(ctx, 'menu-fissi-categoria-modulo', sid, failures.length ? 'FALLITO' : 'OK', sheet.slice(0, 160), 'Campo obbligatorio nome', config.categoriesPath)
    await pctx.close()
  })

  await runIf('menu-fissi-modulo-validazione', async () => {
    const failures = []
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await gotoMenuList(page, config)
    await page.getByRole('button', { name: config.newMenuButton }).click()
    await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
    const err = copy(sid, 'ERROR_REQUIRED') ?? 'Campo obbligatorio.'
    const sheet = await page.locator('[data-slot=sheet-content]').innerText()
    const errCount = (sheet.match(new RegExp(err, 'g')) ?? []).length
    if (errCount < 2) failures.push(`obbligatori=${errCount}`)
    if (!sheet.includes('Scegli una categoria')) failures.push('categoria')
    if (!sheet.includes('Aggiungi almeno un piatto')) failures.push('piatti')
    addRow(ctx, 'menu-fissi-modulo-validazione', sid, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'quattro errori', 'validazione modulo', config.path)
    await pctx.close()
  })

  await runIf('menu-fissi-composizione', async () => {
    const failures = []
    try {
      menuDeleteVerifyPrefix()
      menuEnsureMenuListFixtures(testUser.email)
      menuCreateFixedMenuFixture(testUser.email, {
        dishName: 'verify-ui-p1',
        categoryName: 'verify-ui-cat',
        menuNames: ['verify-ui-menu-comp'],
      })
      for (let i = 2; i <= 4; i++) {
        menuAddDishToFixedMenu(testUser.email, 'verify-ui-menu-comp', `verify-ui-p${i}`)
      }
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoMenuList(page, config)
      await clickRowAction(page, 'verify-ui-menu-comp', 'edit')
      await page.getByRole('button', { name: /Aggiungi o togli piatti|Scegli piatti|Aggiungi piatti/i }).click()
      await waitForSheetReady(page)
      const title = await page.locator('[data-slot=sheet-content] h2, [data-slot=sheet-content] [data-slot=sheet-title]').first().innerText()
      if (!title.includes('Scegli piatti')) failures.push(`titolo=${title}`)
      const back = page.getByRole('button', { name: /Indietro al modulo/i })
      if ((await back.count()) < 1) failures.push('freccia indietro')
      addRow(ctx, 'menu-fissi-composizione', sid, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || title, 'vista Scegli piatti', config.path)
      await pctx.close()
    } finally {
      menuDeleteVerifyPrefix()
    }
  })

  await runIf('menu-fissi-ordine-piatti', async () => {
    const failures = []
    let misurato = '—'
    try {
      menuDeleteVerifyPrefix()
      menuEnsureMenuListFixtures(testUser.email)
      menuCreateFixedMenuFixture(testUser.email, {
        dishName: 'verify-ui-p1',
        categoryName: 'verify-ui-cat-ord',
        menuNames: ['verify-ui-menu-ord'],
      })
      for (let i = 2; i <= 4; i++) menuAddDishToFixedMenu(testUser.email, 'verify-ui-menu-ord', `verify-ui-p${i}`)
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoMenuList(page, config)
      await clickRowAction(page, 'verify-ui-menu-ord', 'edit')
      const firstBtn = page.getByRole('button', { name: /^Sposta su / }).first()
      const dishName = (await firstBtn.getAttribute('aria-label'))?.replace(/^Sposta su /, '')?.trim()
      if (!dishName) {
        failures.push('piatto non trovato')
      } else {
        const dims = await measureMoveButtons(page, dishName)
        if (dims.upH < 43 || dims.downH < 43) failures.push(`frecce h=${dims.upH}/${dims.downH}`)
        const upBtn = page.getByRole('button', { name: `Sposta su ${dishName}` })
        const downBtns = page.getByRole('button', { name: /^Sposta giù / })
        if (!(await upBtn.isDisabled())) failures.push('primo Sposta su non disabilitato')
        const lastDown = downBtns.last()
        if (!(await lastDown.isDisabled())) failures.push('ultimo Sposta giù non disabilitato')
        await page.getByRole('button', { name: `Sposta giù ${dishName}` }).click()
        const third = page.getByRole('button', { name: /^Sposta su verify-ui-p/ }).nth(2)
        const thirdName = (await third.getAttribute('aria-label'))?.replace(/^Sposta su /, '')
        if (thirdName) await page.getByRole('button', { name: `Sposta su ${thirdName}` }).click()
        await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
        await page.waitForTimeout(800)
        const apiMenu = menuFindFixedMenu(testUser.email, 'verify-ui-menu-ord', '2')
        const dishOrder = (apiMenu.doc?.dishes ?? []).map((d) => {
          if (d == null) return ''
          if (typeof d === 'object') {
            const rel = d.dish
            if (rel && typeof rel === 'object' && rel.name) return String(rel.name)
            if (rel != null) return String(rel)
            if (d.name) return String(d.name)
          }
          return String(d)
        })
        const togliTarget = dishOrder.find((n) => n.startsWith('verify-ui-p')) ?? dishName
        await clickRowAction(page, 'verify-ui-menu-ord', 'edit')
        await page.getByRole('button', { name: `Togli ${togliTarget}` }).click()
        await page.waitForTimeout(400)
        const stillInCatalog = menuFindDish(testUser.email, String(togliTarget)).found
        if (!stillInCatalog) failures.push('piatto rimosso dalla collection')
        misurato = `dish=${dishName}; ordine API=${JSON.stringify(dishOrder)}; togli=${togliTarget}; catalogo=${stillInCatalog}`
      }
      addRow(ctx, 'menu-fissi-ordine-piatti', sid, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || misurato, 'frecce 44px+ordine+Togli', config.path)
      await pctx.close()
    } finally {
      menuDeleteVerifyPrefix()
    }
  })

  await runIf('menu-fissi-visibilita-categoria', async () => {
    const failures = []
    const snippets = []
    try {
      menuDeleteVerifyPrefix()
      menuEnsureMenuListFixtures(testUser.email)
    } catch {
      failures.push('fixture seed')
    }
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
    await loginApp(page, baseUrl, testUser.email, testPassword)
    await gotoMenuList(page, config)
    await page.getByRole('button', { name: config.newMenuButton }).click()
    await selectComboboxOptionByKeyboard(page, copy(sid, 'FORM_CATEGORY') ?? 'Categoria', 'verify-ui-pranzo').catch(() => {
      failures.push('categoria verify-ui-pranzo assente (seed)')
    })
    let sheet = await page.locator('[data-slot=sheet-content]').innerText()
    snippets.push(`pranzo:${sheet.match(/Solo pranzo|compare solo a pranzo/i)?.[0] ?? '—'}`)
    if (!/Solo pranzo/i.test(sheet)) failures.push('visibilità non precompilata Solo pranzo')
    await selectComboboxOptionByKeyboard(page, copy(sid, 'FORM_VISIBILITY') ?? 'Visibilità', 'Sempre').catch(() => {
      failures.push('combo Visibilità Sempre')
    })
    sheet = await page.locator('[data-slot=sheet-content]').innerText()
    if (!/compare solo a pranzo/i.test(sheet)) failures.push('avviso informativo pranzo assente')
    snippets.push(`sempre+pranzo:${sheet.match(/compare solo a pranzo[^.]*\./i)?.[0]?.slice(0, 80) ?? '—'}`)
    await selectComboboxOptionByKeyboard(page, copy(sid, 'FORM_VISIBILITY') ?? 'Visibilità', 'Solo cena').catch(() => {
      failures.push('combo Solo cena')
    })
    sheet = await page.locator('[data-slot=sheet-content]').innerText()
    if (!/non comparirà mai/i.test(sheet)) failures.push('avviso rosso non comparirà mai assente')
    snippets.push(`cena:${sheet.match(/non comparirà mai/i)?.[0] ?? '—'}`)
    await selectComboboxOptionByKeyboard(page, copy(sid, 'FORM_CATEGORY') ?? 'Categoria', 'verify-ui-sempre').catch(() => {
      failures.push('categoria verify-ui-sempre')
    })
    sheet = await page.locator('[data-slot=sheet-content]').innerText()
    if (/non comparirà mai/i.test(sheet)) failures.push('avviso rosso resta dopo verify-ui-sempre')
    if (!/Solo cena/i.test(sheet)) failures.push('visibilità manuale Solo cena sovrascritta')
    snippets.push(`sempre-cat:${sheet.includes('Solo cena') ? 'Solo cena mantenuta' : 'persa'}`)
    addRow(
      ctx,
      'menu-fissi-visibilita-categoria',
      sid,
      failures.length ? 'FALLITO' : 'OK',
      snippets.join(' | '),
      'avvisi visibilità (tutti i passi)',
      config.path,
    )
    await pctx.close()
  })

  await runIf('menu-fissi-elimina-senza-uso', async () => {
    const failures = []
    try {
      menuDeleteVerifyPrefix()
      menuCreateFixedMenuFixture(testUser.email, {
        dishName: 'verify-ui-p1',
        categoryName: 'verify-ui-cat',
        menuNames: ['verify-ui-menu-libero'],
      })
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoMenuList(page, config)
      await clickRowAction(page, 'verify-ui-menu-libero', 'delete')
      const dlg = await page.locator('[role=alertdialog]').innerText()
      if (!dlg.includes('verify-ui-menu-libero')) failures.push('titolo')
      if (!dlg.includes('Non si può annullare')) failures.push('frase')
      addRow(ctx, 'menu-fissi-elimina-senza-uso', sid, failures.length ? 'FALLITO' : 'OK', dlg.slice(0, 180), 'solo annullamento', config.path)
      await pctx.close()
    } finally {
      menuDeleteVerifyPrefix()
    }
  })

  await runIf('menu-fissi-elimina-usato', async () => {
    const failures = []
    try {
      menuDeleteVerifyPrefix()
      menuCreateFixedMenuFixture(testUser.email, {
        dishName: 'verify-ui-p1',
        categoryName: 'verify-ui-cat',
        menuNames: ['verify-ui-menu-usato'],
      })
      menuCreateSpecialDayForMenu(testUser.email, 'verify-ui-menu-usato', '2026-12-31')
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoMenuList(page, config)
      await clickRowAction(page, 'verify-ui-menu-usato', 'delete')
      const dlg = await page.locator('[role=alertdialog]').innerText()
      if (!/giorno speciale|giorni speciali/i.test(dlg)) failures.push('cascade giorni speciali')
      addRow(ctx, 'menu-fissi-elimina-usato', sid, failures.length ? 'FALLITO' : 'OK', dlg.slice(0, 220), 'cascade giorni speciali', config.path)
      await pctx.close()
    } finally {
      menuDeleteVerifyPrefix()
    }
  })

  await runMenuListSupplementaryFlows(ctx, config)
}

export async function runMenuListFlowControls(ctx, config) {
  if (config.id === 'servizi') await runServiziFlows(ctx, config)
  else await runMenuFissiFlows(ctx, config)
}
