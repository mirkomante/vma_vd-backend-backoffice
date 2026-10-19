import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { unlinkSync } from 'node:fs'

import { menuScreenCopyConst } from './menu-screen-copy.mjs'
import {
  clickRowAction,
  gotoMenuList,
  measureMoveButtons,
  openTabByName,
  toggleCategoriaAttiva,
  toggleDisponibile,
  waitForSheetReady,
} from './menu-list-ui-helpers.mjs'
import { waitForAnimationsSettled } from './measure-stable.mjs'
import { esitoMisura, isEmptyMeasureToken } from './measure-esito.mjs'
import { SIM_PORT, isPortFree, waitForPortFree } from './ensure-ports.mjs'
import { selectComboboxOptionByKeyboard } from './catalog-ui-helpers.mjs'
import {
  menuAddDishToFixedMenu,
  menuCreateFixedMenuFixture,
  menuCreateFixedMenuWithServices,
  menuCreateMenuService,
  menuCreateSpecialDayForMenu,
  menuDeleteVerifyPrefix,
  menuEnsureMenuListFixtures,
  menuFindFixedMenu,
  menuFindFixedMenuDeleteLog,
  menuFindMenuService,
  menuFindMenuServiceDeleteLog,
  menuFindStaffUser,
  menuReadFixedMenuEn,
  menuTryCreateFixedMenuDuplicateDishes,
  menuTryCreateMenuService,
  menuTryDeleteFixedMenuCategory,
  menuTryDeleteMenuService,
  menuEnsureNoroleUser,
  menuDeleteUserEmail,
} from './menu-payload.mjs'

const ROOT = join(import.meta.dirname, '../../..')
const COLONNA_PROFILI = ['telefono-390', 'notebook-1280', 'soglia-767', 'soglia-768']

function copy(screenId, name) {
  return menuScreenCopyConst(screenId, name)
}

function addRow(ctx, id, screenId, esito, misurato, atteso, evidenza, profiloTema = 'telefono-390/chiaro') {
  ctx.addRow(ctx.report, { id, schermata: screenId, profiloTema, esito, misurato, atteso, evidenza })
}

function controlDef(CONTROLLI, screenId, controlId) {
  const screen = CONTROLLI.schermate?.find((s) => s.id === screenId)
  return screen?.controlli?.find((c) => c.id === controlId)
}

function isRinviato65(ctrl) {
  return ctrl?.rinviato_a === '6.5' || (ctrl?.stato_prova ?? '').includes('NON PROVABILE')
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
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

async function withFixtures(email, fn) {
  try {
    menuDeleteVerifyPrefix()
    menuEnsureMenuListFixtures(email)
    await fn()
  } finally {
    menuDeleteVerifyPrefix()
  }
}

export async function runMenuListSupplementaryFlows(ctx, config) {
  const { browser, baseUrl, runCtx, CONTROLLI, newPage, loginApp, testUser, testPassword } = ctx
  const sid = config.id

  const runIf = async (id, fn) => {
    if (!runCtx.shouldRun(id)) return
    const ctrl = controlDef(CONTROLLI, sid, id)
    if (isRinviato65(ctrl)) {
      addRow(ctx, id, sid, 'NON PROVATO', '—', '—', 'rinviato alla 6.5')
      return
    }
    if (id === `${sid}-stato-vuoto` || id === `${sid}-accesso` || id === 'menu-fissi-nessuna-categoria') {
      addRow(ctx, id, sid, 'NON PROVATO', '—', '—', ctrl?.stato_prova ?? 'NON PROVABILE')
      return
    }
    if (id === `${sid}-confronto-visivo`) {
      addRow(ctx, id, sid, 'NON PROVATO', '—', 'C10', 'agente V / screenshot')
      return
    }
    if (id === 'menu-fissi-console') {
      addRow(ctx, id, sid, 'NON PROVATO', '—', 'locale-dev', 'runMenuConsole include servizi/menu-fissi')
      return
    }
    await fn()
  }

  if (sid === 'servizi') {
    await runIf('servizi-testi', async () => {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoMenuList(page, config)
      const main = await page.locator('main').innerText()
      const need = [copy(sid, 'PAGE_TITLE'), copy(sid, 'PAGE_DESCRIPTION'), copy(sid, 'NEW_BUTTON')].filter(Boolean)
      const missing = need.filter((t) => !main.includes(t))
      addRow(ctx, 'servizi-testi', sid, missing.length ? 'FALLITO' : 'OK', missing.join(', ') || 'ok', 'testi §6', config.path)
      await pctx.close()
    })

    await runIf('servizi-colonna-elenco', async () => {
      for (const profiloKey of COLONNA_PROFILI) {
        const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        const m = await page.evaluate(() => {
          const table = document.querySelector('main table')
          const tableVisible = table ? table.getBoundingClientRect().width > 0 : false
          const card = document.querySelector('main [data-slot=card] p.truncate.font-medium')
          const col = document.querySelector('main .mx-auto')
          return {
            tableVisible,
            colW: col ? Math.round(col.getBoundingClientRect().width) : 0,
            nameW: card ? Math.round(card.getBoundingClientRect().width) : 0,
          }
        })
        let esito = 'OK'
        let misurato = JSON.stringify(m)
        if (profiloKey === 'notebook-1280' || profiloKey === 'soglia-768') {
          if (!m.tableVisible || m.colW > 1026) esito = 'FALLITO'
        } else if (m.tableVisible) esito = 'FALLITO'
        else if (profiloKey === 'telefono-390' && m.nameW && m.nameW < 130) esito = 'FALLITO'
        else if (profiloKey === 'telefono-390' && m.nameW && (m.nameW < 127 || m.nameW > 147)) esito = 'AVVISO'
        addRow(ctx, 'servizi-colonna-elenco', sid, esito, misurato, 'layout', config.path, `${profiloKey}/chiaro`)
        await pctx.close()
      }
    })

    await runIf('servizi-colonne-fisse', async () => {
      await withFixtures(testUser.email, async () => {
        menuCreateMenuService(testUser.email, { name: 'verify-ui-serv-col-a' })
        menuCreateMenuService(testUser.email, { name: 'verify-ui-serv-col-b' })
        const { ctx: pctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        const m = await page.evaluate(() => {
          const headers = [...document.querySelectorAll('main table thead th')]
          return { headers: headers.map((h) => h.textContent?.trim()), lefts: headers.map((h) => Math.round(h.getBoundingClientRect().left)) }
        })
        addRow(
          ctx,
          'servizi-colonne-fisse',
          sid,
          m.headers.length >= 3 ? 'OK' : 'FALLITO',
          JSON.stringify(m),
          'colonne fisse',
          config.path,
          'notebook-1280/chiaro',
        )
        await pctx.close()
      })
    })

    await runIf('servizi-azioni-pagina', async () => {
      for (const profiloKey of ['telefono-390', 'notebook-1280']) {
        const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        const m = await page.evaluate((label) => {
          const btn = [...document.querySelectorAll('main button')].find((b) => b.textContent?.includes(label))
          const r = btn?.getBoundingClientRect()
          const col = document.querySelector('main .mx-auto')
          const colW = col ? Math.round(col.getBoundingClientRect().width) : Math.round(window.innerWidth - 32)
          const header = document.querySelector('main h1')?.parentElement
          return {
            h: r ? Math.round(r.height) : 0,
            w: r ? Math.round(r.width) : 0,
            colW,
            inline: header && btn ? header.getBoundingClientRect().top === btn.getBoundingClientRect().top : false,
          }
        }, config.newButton)
        const ok = profiloKey === 'telefono-390' ? m.h >= 44 && m.w >= m.colW - 2 : m.inline
        addRow(ctx, 'servizi-azioni-pagina', sid, ok ? 'OK' : 'FALLITO', JSON.stringify(m), 'azioni pagina', config.path, `${profiloKey}/chiaro`)
        await pctx.close()
      }
    })

    await runIf('servizi-righe-azioni', async () => {
      await withFixtures(testUser.email, async () => {
        menuCreateMenuService(testUser.email, { name: 'verify-ui-serv-row', disabled: true })
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        const m = await page.evaluate(() => {
          const row = document.querySelector('[aria-label^="verify-ui-serv-row"]')
          const sample = row?.querySelector('button[aria-label^="Modifica "]')
          const r = sample?.getBoundingClientRect()
          const switchEl = row?.querySelector('[role=switch]')
          const rowText = row?.textContent ?? ''
          return {
            btn: sample?.getAttribute('aria-label'),
            btnSize: r ? `${Math.round(r.width)}x${Math.round(r.height)}` : '—',
            switchDisabled: switchEl?.getAttribute('aria-disabled') === 'true' || switchEl?.hasAttribute('disabled'),
            badgeDisabilitato: rowText.includes('Disabilitato'),
            switchActive: switchEl?.getAttribute('aria-checked') === 'true' || switchEl?.getAttribute('data-checked') === 'true',
          }
        })
        const failures = []
        if (!m.btn?.includes('verify-ui-serv-row')) failures.push('modifica')
        if (m.switchDisabled) failures.push('switch disabilitato su riga disabilitata')
        if (!m.badgeDisabilitato) failures.push('badge Disabilitato assente')
        const { esito, misurato } = esitoMisura({ failures, missingMeasures: isEmptyMeasureToken(m.btnSize) ? ['btn'] : [], misurato: JSON.stringify(m) })
        addRow(ctx, 'servizi-righe-azioni', sid, esito, misurato, 'righe azioni', config.path)
        await pctx.close()
      })
    })

    await runIf('servizi-disponibilita', async () => {
      const failures = []
      await withFixtures(testUser.email, async () => {
        menuCreateMenuService(testUser.email, { name: 'verify-ui-servizio-disp' })
        menuCreateFixedMenuWithServices(testUser.email, {
          menuName: 'verify-ui-menu-disp-svc',
          categoryName: 'verify-ui-cat',
          dishName: 'verify-ui-p1',
          serviceNames: ['verify-ui-servizio-disp'],
        })
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        await toggleDisponibile(page, 'verify-ui-servizio-disp')
        await page.waitForTimeout(700)
        let body = await page.locator('main').innerText()
        if (!/disabilitat/i.test(body)) failures.push('toast disabilita')
        const item = menuFindMenuService(testUser.email, 'verify-ui-servizio-disp')
        if (!item.doc?.disabled) failures.push('API disabled')
        await toggleDisponibile(page, 'verify-ui-servizio-disp')
        await page.waitForTimeout(600)
        body = await page.locator('main').innerText()
        if (!/abilitat/i.test(body)) failures.push('toast abilita')
        await pctx.close()
      })
      addRow(ctx, 'servizi-disponibilita', sid, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'disponibilità', config.path)
    })

    await runIf('servizi-elimina-usato', async () => {
      const failures = []
      let dlgText = ''
      await withFixtures(testUser.email, async () => {
        menuCreateMenuService(testUser.email, { name: 'verify-ui-servizio-usato' })
        menuCreateFixedMenuWithServices(testUser.email, {
          menuName: 'verify-ui-menu-1',
          categoryName: 'verify-ui-cat',
          dishName: 'verify-ui-p1',
          serviceNames: ['verify-ui-servizio-usato'],
        })
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-servizio-usato', 'delete')
        dlgText = await page.locator('[role=alertdialog]').innerText()
        if (!/menù fisso|1 menù/i.test(dlgText)) failures.push(`dlg1=${dlgText.slice(0, 80)}`)
        await page.getByRole('button', { name: 'Indietro' }).click()
        for (const n of ['verify-ui-menu-2', 'verify-ui-menu-3', 'verify-ui-menu-4']) {
          menuCreateFixedMenuWithServices(testUser.email, {
            menuName: n,
            categoryName: 'verify-ui-cat',
            dishName: 'verify-ui-p1',
            serviceNames: ['verify-ui-servizio-usato'],
          })
        }
        await page.reload({ waitUntil: 'networkidle' })
        await clickRowAction(page, 'verify-ui-servizio-usato', 'delete')
        dlgText = await page.locator('[role=alertdialog]').innerText()
        if (!/4 menù fissi|e altri 1/i.test(dlgText)) failures.push(`dlg4=${dlgText.slice(0, 120)}`)
        await page.getByRole('button', { name: 'Elimina' }).click()
        await page.waitForTimeout(800)
        if ((await page.getByText('verify-ui-servizio-usato').count()) > 0) failures.push('riga resta')
        await pctx.close()
      })
      addRow(ctx, 'servizi-elimina-usato', sid, failures.length ? 'FALLITO' : 'OK', failures.length ? `${failures.join(' | ')}; ${dlgText.slice(0, 160)}` : dlgText.slice(0, 160), 'cascade menù', config.path)
    })

    await runIf('servizi-elimina-cascade-registro-permessi', async () => {
      const failures = []
      const notes = []
      let misurato = '—'
      await withFixtures(testUser.email, async () => {
        menuCreateMenuService(testUser.email, { name: 'verify-ui-serv-perm' })
        menuCreateFixedMenuWithServices(testUser.email, {
          menuName: 'verify-ui-menu-perm',
          categoryName: 'verify-ui-cat',
          dishName: 'verify-ui-p1',
          serviceNames: ['verify-ui-serv-perm'],
        })
        const docId = menuFindMenuService(testUser.email, 'verify-ui-serv-perm').doc?.id
        const beforeMenu = menuFindFixedMenu(testUser.email, 'verify-ui-menu-perm', '0')
        const beforeSvcIds = JSON.stringify(beforeMenu.doc?.services ?? [])
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-serv-perm', 'delete')
        await page.locator('[role=alertdialog]').getByRole('button', { name: 'Elimina' }).click()
        await page.waitForTimeout(900)
        await pctx.close()
        const afterMenu = menuFindFixedMenu(testUser.email, 'verify-ui-menu-perm', '0')
        const afterSvcIds = JSON.stringify(afterMenu.doc?.services ?? [])
        const svcGone = !menuFindMenuService(testUser.email, 'verify-ui-serv-perm').found
        if (!svcGone) failures.push('servizio ancora presente')
        if (afterMenu.found && afterSvcIds !== '[]' && afterSvcIds.includes(String(docId))) {
          failures.push(`cascade menu services=${afterSvcIds}`)
        }
        const log = docId
          ? menuFindMenuServiceDeleteLog(testUser.email, docId, 'verify-ui-serv-perm', 1)
          : { found: false, detail: null, expectedDetail: '?' }
        if (!log.found || log.detail !== log.expectedDetail) {
          failures.push(`log found=${log.found} detail=${log.detail ?? 'null'}`)
        }
        misurato = `prima menu.services=${beforeSvcIds}; dopo=${afterSvcIds}; svcGone=${svcGone}; log=${log.detail ?? 'null'}`
        const staffAdmin = menuFindStaffUser('admin')
        if (staffAdmin.email) {
          const d = menuTryDeleteMenuService(staffAdmin.email, 'verify-ui-serv-perm')
          if (d.ok) notes.push('admin delete API: ok (post UI)')
        } else notes.push('admin assente')
        try {
          const noroleUser = menuEnsureNoroleUser()
          const norole = menuTryCreateMenuService(noroleUser.email)
          if (norole.ok) notes.push('norole create: inatteso')
          else notes.push(`norole rifiutato: ${norole.reason ?? 'ok'}`)
          menuDeleteUserEmail(noroleUser.email)
        } catch (e) {
          notes.push(`norole: NON PROVATO (${e.message?.slice(0, 80) ?? 'ensure-norole-user'})`)
        }
      })
      addRow(
        ctx,
        'servizi-elimina-cascade-registro-permessi',
        sid,
        failures.length ? 'FALLITO' : 'OK',
        `${misurato}; ${notes.join('; ')}`,
        'cascade depth0+registro dopo elimina UI',
        config.path,
      )
    })

    await runIf('servizi-modulo-campi', async () => {
      for (const temaKey of ['chiaro', 'scuro']) {
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', temaKey, baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        const sheet = await page.locator('[data-slot=sheet-content]').innerText()
        const need = [copy(sid, 'FORM_NEW_TITLE'), copy(sid, 'FORM_NAME'), copy(sid, 'FORM_SAVE')].filter(Boolean)
        const missing = need.filter((t) => !sheet.includes(t))
        addRow(ctx, 'servizi-modulo-campi', sid, missing.length ? 'FALLITO' : 'OK', missing.join(', ') || 'ok', 'modulo', config.path, `telefono-390/${temaKey}`)
        await pctx.close()
      }
    })

    await runIf('servizi-modulo-inglese', async () => {
      const failures = []
      let misurato = '—'
      await withFixtures(testUser.email, async () => {
        menuCreateMenuService(testUser.email, { name: 'verify-ui-serv-noen' })
        menuCreateMenuService(testUser.email, { name: 'verify-ui-serv-yesen', nameEn: 'Service EN' })
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-serv-yesen', 'edit')
        const trig = page.getByRole('button', { name: /Traduzione inglese/i })
        const badge = (await trig.innerText()).replace(/\s+/g, ' ')
        if (!/Presente|Manca/.test(badge)) failures.push(`badge=${badge}`)
        misurato = `badge=${badge}`
        await pctx.close()
      })
      addRow(ctx, 'servizi-modulo-inglese', sid, failures.length ? 'FALLITO' : 'OK', misurato, 'inglese', config.path)
    })

    await runIf('servizi-modulo-footer', async () => {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoMenuList(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      const m = await page.evaluate(() => {
        const footer = document.querySelector('[data-slot=sheet-footer]')
        const btns = footer ? [...footer.querySelectorAll('button')] : []
        return { footerH: Math.round(btns[0]?.getBoundingClientRect().height ?? 0), btnCount: btns.length }
      })
      addRow(ctx, 'servizi-modulo-footer', sid, m.btnCount === 2 && m.footerH >= 43 ? 'OK' : 'FALLITO', JSON.stringify(m), 'footer 44px', config.path)
      await pctx.close()
    })

    await runIf('servizi-persistenza', async () => {
      const failures = []
      const notes = []
      await withFixtures(testUser.email, async () => {
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await page.getByLabel(copy(sid, 'FORM_NAME') ?? 'Nome').fill('verify-ui-servizio-nuovo')
        await page.getByLabel(/Prezzo/i).fill('3,50')
        await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
        await page.waitForTimeout(800)
        const saved = menuFindMenuService(testUser.email, 'verify-ui-servizio-nuovo')
        if (!saved.found || saved.doc?.price !== 3.5) failures.push('create read')
        const staffAdmin = menuFindStaffUser('admin')
        if (staffAdmin.email) notes.push('admin read: skip')
        notes.push('norole: coperto in elimina-cascade')
        await pctx.close()
      })
      addRow(ctx, 'servizi-persistenza', sid, failures.length ? 'FALLITO' : 'OK', `${failures.join(' | ') || 'ok'}; ${notes.join('; ')}`, 'persistenza', config.path)
    })

    await runIf('servizi-ordine', async () => {
      await withFixtures(testUser.email, async () => {
        menuCreateMenuService(testUser.email, { name: 'verify-ui-zzzz' })
        menuCreateMenuService(testUser.email, { name: 'verify-ui-aaaa' })
        const { ctx: pctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        const names = await page.evaluate(() =>
          [...document.querySelectorAll('main table tbody tr td:first-child')].map((td) => td.textContent?.trim()).filter(Boolean),
        )
        const subset = names.filter((n) => n.startsWith('verify-ui-'))
        const sorted = [...subset].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
        const ok = JSON.stringify(subset) === JSON.stringify(sorted)
        addRow(ctx, 'servizi-ordine', sid, ok ? 'OK' : 'FALLITO', subset.join(' > '), 'ordine nome', config.path, 'notebook-1280/chiaro')
        await pctx.close()
      })
    })

    await runIf('servizi-ricompila', async () => {
      addRow(ctx, 'servizi-ricompila', sid, 'NON PROVATO', '—', '—', 'rinviato alla 6.5')
    })
  }

  if (sid === 'menu-fissi') {
    await runIf('menu-fissi-testi', async () => {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoMenuList(page, config)
      const main = await page.locator('main').innerText()
      const tabs = await page.getByRole('tab').allTextContents()
      const missing = []
      if (!main.includes('Menù fissi')) missing.push('h1')
      if (!tabs.some((t) => t.includes('Categorie'))) missing.push('tab Categorie')
      addRow(ctx, 'menu-fissi-testi', sid, missing.length ? 'FALLITO' : 'OK', missing.join(', ') || 'ok', 'testi', config.path)
      await pctx.close()
    })

    await runIf('menu-fissi-colonna-elenco', async () => {
      for (const profiloKey of COLONNA_PROFILI) {
        const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        const m = await page.evaluate(() => {
          const tableVisible = Boolean(document.querySelector('main table')?.getBoundingClientRect().width)
          const card = document.querySelector('main [data-slot=card] p.truncate.font-medium')
          const col = document.querySelector('main .mx-auto')
          return { tableVisible, colW: col ? Math.round(col.getBoundingClientRect().width) : 0, nameW: card ? Math.round(card.getBoundingClientRect().width) : 0 }
        })
        let esito = m.tableVisible && profiloKey !== 'notebook-1280' && profiloKey !== 'soglia-768' ? 'FALLITO' : 'OK'
        if ((profiloKey === 'notebook-1280' || profiloKey === 'soglia-768') && (!m.tableVisible || m.colW > 1026)) esito = 'FALLITO'
        addRow(ctx, 'menu-fissi-colonna-elenco', sid, esito, JSON.stringify(m), 'layout', config.path, `${profiloKey}/chiaro`)
        await pctx.close()
      }
    })

    await runIf('menu-fissi-colonne-fisse', async () => {
      await withFixtures(testUser.email, async () => {
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-col'],
        })
        const { ctx: pctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        const m = await page.evaluate(() => {
          const headers = [...document.querySelectorAll('main table thead th')]
          return { headers: headers.map((h) => h.textContent?.trim()) }
        })
        addRow(ctx, 'menu-fissi-colonne-fisse', sid, m.headers.length >= 4 ? 'OK' : 'FALLITO', JSON.stringify(m), 'colonne', config.path, 'notebook-1280/chiaro')
        await pctx.close()
      })
    })

    await runIf('menu-fissi-azioni-pagina', async () => {
      for (const profiloKey of ['telefono-390', 'notebook-1280']) {
        const { ctx: pctx, page } = await newPage(browser, profiloKey, 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        const m = await page.evaluate((label) => {
          const btn = [...document.querySelectorAll('main button')].find((b) => b.textContent?.includes(label))
          const r = btn?.getBoundingClientRect()
          const col = document.querySelector('main .mx-auto')
          return { h: r ? Math.round(r.height) : 0, w: r ? Math.round(r.width) : 0, colW: col ? Math.round(col.getBoundingClientRect().width) : 0 }
        }, config.newMenuButton)
        const ok = profiloKey === 'telefono-390' ? m.h >= 44 : m.h >= 28
        addRow(ctx, 'menu-fissi-azioni-pagina', sid, ok ? 'OK' : 'FALLITO', JSON.stringify(m), 'azioni', config.path, `${profiloKey}/chiaro`)
        await pctx.close()
      }
    })

    await runIf('menu-fissi-righe-azioni', async () => {
      await withFixtures(testUser.email, async () => {
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-row'],
        })
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        const trash = await page.getByRole('button', { name: /Elimina verify-ui-menu-row/ }).count()
        const edit = await page.getByRole('button', { name: /Modifica verify-ui-menu-row/ }).count()
        addRow(ctx, 'menu-fissi-righe-azioni', sid, trash && edit ? 'OK' : 'FALLITO', `edit=${edit}; delete=${trash}`, 'azioni riga', config.path)
        await pctx.close()
      })
    })

    await runIf('menu-fissi-disponibilita', async () => {
      const failures = []
      await withFixtures(testUser.email, async () => {
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-disp'],
        })
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        await toggleDisponibile(page, 'verify-ui-menu-disp')
        await page.waitForTimeout(600)
        let body = await page.locator('main').innerText()
        if (!/disabilitat/i.test(body)) failures.push('menu toast')
        await gotoMenuList(page, config, config.categoriesPath)
        await toggleCategoriaAttiva(page, 'verify-ui-cat')
        await page.waitForTimeout(600)
        body = await page.locator('main').innerText()
        if (!/categoria disabilitat/i.test(body)) failures.push('cat toast')
        await toggleCategoriaAttiva(page, 'verify-ui-cat')
        await gotoMenuList(page, config)
        await toggleDisponibile(page, 'verify-ui-menu-disp')
        await pctx.close()
      })
      addRow(ctx, 'menu-fissi-disponibilita', sid, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'disponibilità', config.path)
    })

    await runIf('menu-fissi-categorie-elenco', async () => {
      await withFixtures(testUser.email, async () => {
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config, config.categoriesPath)
        const body = await page.locator('main').innerText()
        const trash = await page.getByRole('button', { name: /Elimina/i }).count()
        const ok = /categor/i.test(body) && trash === 0
        addRow(ctx, 'menu-fissi-categorie-elenco', sid, ok ? 'OK' : 'FALLITO', `cestini=${trash}; ${body.slice(0, 120)}`, 'elenco categorie', config.categoriesPath)
        await pctx.close()
      })
    })

    await runIf('menu-fissi-categorie-niente-eliminazione', async () => {
      const failures = []
      await withFixtures(testUser.email, async () => {
        const mgr = menuTryDeleteFixedMenuCategory(testUser.email, 'verify-ui-cat')
        if (mgr.ok) failures.push('manager delete ok')
        const staffAdmin = menuFindStaffUser('admin')
        if (staffAdmin.email) {
          const adm = menuTryDeleteFixedMenuCategory(staffAdmin.email, 'verify-ui-sempre')
          if (!adm.ok) failures.push(`admin:${adm.reason}`)
        }
      })
      addRow(ctx, 'menu-fissi-categorie-niente-eliminazione', sid, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'permessi', 'payload')
    })

    await runIf('menu-fissi-modulo-campi', async () => {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoMenuList(page, config)
      await page.getByRole('button', { name: config.newMenuButton }).click()
      const sheet = await page.locator('[data-slot=sheet-content]').innerText()
      const ok = sheet.includes('Piatti') && sheet.includes('Salva')
      addRow(ctx, 'menu-fissi-modulo-campi', sid, ok ? 'OK' : 'FALLITO', sheet.slice(0, 200), 'campi modulo', config.path)
      await pctx.close()
    })

    await runIf('menu-fissi-doppioni', async () => {
      const failures = []
      let misurato = '—'
      await withFixtures(testUser.email, async () => {
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-dup'],
        })
        const dup = menuTryCreateFixedMenuDuplicateDishes(testUser.email, 'verify-ui-menu-dup')
        if (dup.ok) failures.push('API accetta doppioni')
        if (!dup.ok && dup.reason === 'validation' && !dup.message) failures.push('messaggio validation assente')
        misurato = JSON.stringify(dup)
      })
      addRow(ctx, 'menu-fissi-doppioni', sid, failures.length ? 'FALLITO' : 'OK', misurato, 'no doppioni', 'payload+API')
    })

    await runIf('menu-fissi-porzione-traduzione', async () => {
      const failures = []
      let misurato = '—'
      await withFixtures(testUser.email, async () => {
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-port'],
        })
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-port', 'edit')
        const portion = page.getByLabel(/Porzione/i).first()
        if ((await portion.count()) < 1) failures.push('campo porzione')
        else {
          await portion.fill('2 pezzi')
          await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
          await page.waitForTimeout(700)
        }
        const en = menuReadFixedMenuEn(testUser.email, 'verify-ui-menu-port')
        misurato = `en name=${en.name}; desc=${en.description}`
        await pctx.close()
      })
      addRow(ctx, 'menu-fissi-porzione-traduzione', sid, failures.length ? 'FALLITO' : 'OK', misurato, 'porzione+en', config.path)
    })

    await runIf('menu-fissi-servizi-piatti', async () => {
      const failures = []
      await withFixtures(testUser.email, async () => {
        menuCreateFixedMenuWithServices(testUser.email, {
          menuName: 'verify-ui-menu-svc',
          categoryName: 'verify-ui-cat',
          dishName: 'verify-ui-p1',
          serviceNames: ['verify-ui-servizio-a', 'verify-ui-servizio-b'],
        })
        const doc = menuFindFixedMenu(testUser.email, 'verify-ui-menu-svc')
        const svcCount = Array.isArray(doc.doc?.services) ? doc.doc.services.length : 0
        if (svcCount < 2) failures.push(`services=${svcCount}`)
      })
      addRow(ctx, 'menu-fissi-servizi-piatti', sid, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'servizi salvati', 'API')
    })

    await runIf('menu-fissi-tassonomie', async () => {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoMenuList(page, config)
      await page.getByRole('button', { name: config.newMenuButton }).click()
      await selectComboboxOptionByKeyboard(page, copy(sid, 'FORM_CATEGORY') ?? 'Categoria', 'verify-ui-sempre').catch(() => {})
      const sheet = await page.locator('[data-slot=sheet-content]').innerText()
      const bad = /crea.*piatt|nuovo servizio/i.test(sheet)
      addRow(ctx, 'menu-fissi-tassonomie', sid, bad ? 'FALLITO' : 'OK', bad ? 'pulsanti creazione extra' : 'select categorie', config.path)
      await pctx.close()
    })

    await runIf('menu-fissi-elimina-cascade-registro-permessi', async () => {
      const failures = []
      await withFixtures(testUser.email, async () => {
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-cascade'],
        })
        menuCreateSpecialDayForMenu(testUser.email, 'verify-ui-menu-cascade', '2026-11-01')
        const docId = menuFindFixedMenu(testUser.email, 'verify-ui-menu-cascade').doc?.id
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-cascade', 'delete')
        await page.getByRole('button', { name: 'Elimina' }).click()
        await page.waitForTimeout(800)
        await pctx.close()
        if (docId) {
          const log = menuFindFixedMenuDeleteLog(testUser.email, docId, 'verify-ui-menu-cascade', 1)
          if (!log.found) failures.push('log assente')
        }
      })
      addRow(ctx, 'menu-fissi-elimina-cascade-registro-permessi', sid, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'cascade+registro', config.path)
    })

    await runIf('menu-fissi-persistenza', async () => {
      const failures = []
      await withFixtures(testUser.email, async () => {
        const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
        await loginApp(page, baseUrl, testUser.email, testPassword)
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newMenuButton }).click()
        await page.getByLabel(/^Nome$/).fill('verify-ui-menu-nuovo')
        await page.getByLabel(/Prezzo/i).fill('18')
        await selectComboboxOptionByKeyboard(page, copy(sid, 'FORM_CATEGORY') ?? 'Categoria', 'verify-ui-sempre')
        await page.getByRole('button', { name: /Aggiungi piatti|Scegli piatti/i }).click()
        await waitForSheetReady(page)
        await page.getByRole('checkbox', { name: /verify-ui-p1/i }).first().click()
        await page.getByRole('button', { name: /Fatto/i }).click()
        await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
        await page.waitForTimeout(900)
        const saved = menuFindFixedMenu(testUser.email, 'verify-ui-menu-nuovo')
        if (!saved.found) failures.push('non salvato')
        await pctx.close()
      })
      addRow(ctx, 'menu-fissi-persistenza', sid, failures.length ? 'FALLITO' : 'OK', failures.join(' | ') || 'ok', 'persistenza', config.path)
    })

    await runIf('menu-fissi-ordine-liste', async () => {
      const { ctx: pctx, page } = await newPage(browser, 'notebook-1280', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoMenuList(page, config, config.categoriesPath)
      const names = await page.evaluate(() =>
        [...document.querySelectorAll('main table tbody tr td:first-child')].map((td) => td.textContent?.trim()).filter(Boolean),
      )
      const sorted = [...names].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
      addRow(ctx, 'menu-fissi-ordine-liste', sid, JSON.stringify(names) === JSON.stringify(sorted) ? 'OK' : 'FALLITO', names.slice(0, 8).join(' > '), 'ordine categorie', config.categoriesPath, 'notebook-1280/chiaro')
      await pctx.close()
    })

    await runIf('menu-fissi-nomi-accessibili', async () => {
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', baseUrl)
      await loginApp(page, baseUrl, testUser.email, testPassword)
      await gotoMenuList(page, config)
      const body = await page.locator('main').innerText()
      const hits = ['Close', 'Edit', 'Delete'].filter((w) => body.includes(w))
      addRow(ctx, 'menu-fissi-nomi-accessibili', sid, hits.length ? 'FALLITO' : 'OK', hits.join(', ') || 'ok', 'italiano', config.path)
      await pctx.close()
    })

    await runIf('menu-fissi-ricompila', async () => {
      addRow(ctx, 'menu-fissi-ricompila', sid, 'NON PROVATO', '—', '—', 'rinviato alla 6.5')
    })
  }
}

export async function runMenuListStatiUiForScreen(ctx, config) {
  const { browser, report, runCtx, newPage, loginApp, testUser, testPassword, addRow, waitForUrl } = ctx
  const id = `${config.id}-stati-ui`
  if (!runCtx.shouldRun(id)) return
  if (!waitForUrl) {
    addRow(report, { id, schermata: config.id, profiloTema: '—', esito: 'NON PROVATO', misurato: '—', atteso: 'sim', evidenza: 'waitForUrl mancante' })
    return
  }
  const failures = []
  const loadTitle =
    config.id === 'servizi'
      ? copy('servizi', 'LOAD_ERROR_TITLE') ?? 'Impossibile caricare i servizi'
      : copy('menu-fissi', 'LOAD_ERROR_TITLE') ?? 'Impossibile caricare i menù fissi'

  if (await isPortFree(SIM_PORT)) {
    await waitForPortFree(SIM_PORT)
    const delayChild = startMenuDevServerLocal(SIM_PORT, { APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS: '2500' })
    try {
      const simUrl = `http://localhost:${SIM_PORT}`
      await waitForUrl(simUrl)
      const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', simUrl)
      await loginApp(page, simUrl, testUser.email, testPassword)
      await page.goto(config.path, { waitUntil: 'commit' })
      const sk = await page.locator('[data-slot=skeleton]').count()
      if (sk < 2) failures.push(`skeleton=${sk}`)
      await pctx.close()
    } catch (e) {
      failures.push(`caricamento: ${e.message}`)
    } finally {
      delayChild.kill('SIGTERM')
      await waitForPortFree(SIM_PORT)
    }
  }

  await waitForPortFree(SIM_PORT)
  const errChild = startMenuDevServerLocal(SIM_PORT, { APP_MENU_DEV_SIMULATE_LOAD_ERROR: '1' })
  try {
    const simUrl = `http://localhost:${SIM_PORT}`
    await waitForUrl(simUrl)
    const { ctx: pctx, page } = await newPage(browser, 'telefono-390', 'chiaro', simUrl)
    await loginApp(page, simUrl, testUser.email, testPassword)
    await page.goto(config.path, { waitUntil: 'networkidle' })
    const body = await page.locator('main').innerText()
    if (!body.includes(loadTitle)) failures.push('titolo errore')
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
    atteso: 'skeleton + errore caricamento',
    evidenza: `localhost:${SIM_PORT}`,
  })
}
