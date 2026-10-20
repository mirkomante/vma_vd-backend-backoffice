import { test, expect } from '../fixtures'
import { projectTag } from '../lib/matrix-projects'
import { ensureWorkerMenuSeeds, type SeedSlug } from '../lib/menu-list/ensure-fixtures'
import {
  createFixedMenuFixtureLocal,
  createSpecialDayForMenuLocal,
} from '../lib/menu-list/payload-actions'
import {
  findFixedMenuDeleteLog,
  findFixedMenuIdByName,
  readFixedMenuAsManager,
  specialDayContainsMenu,
} from '../lib/menu-fissi/payload-helpers'
import { MENU_LIST_SCREENS } from '../lib/menu-list/config'
import { clickRowAction, gotoMenuList, selectComboboxOption } from '../lib/menu-list/ui-helpers'
import { createSpecialDayAsManager } from '../lib/special-days/payload-helpers'
import { FIXED_MENUS_SLUG, SPECIAL_DAYS_SLUG } from '@/lib/menu/constants'
import {
  MENU_FISSI_FORM_CATEGORY,
  MENU_FISSI_FORM_DISHES_ADD,
  MENU_FISSI_FORM_NAME,
  MENU_FISSI_FORM_PORTION,
  MENU_FISSI_FORM_PRICE,
  MENU_FISSI_FORM_SAVE,
  MENU_FISSI_NEW_BUTTON,
  MENU_FISSI_PICKER_DONE,
  MENU_FISSI_TOAST_DELETED,
  MENU_FISSI_TOAST_SAVED,
  MENU_FISSI_DELETE_BACK,
  MENU_FISSI_DELETE_CONFIRM,
} from '@/lib/menu/fixed-menus/copy'
import { CASCADE_DELETE_IRREVERSIBLE } from '@/lib/menu/formatCascadeDeleteDescription'

const PROFILE = projectTag('telefono-390-chiaro')
const ENGLISH_BANNED = ['Close', 'Edit', 'Delete', 'Remove', 'Save', 'Cancel', 'Add', 'Toggle', 'Move']
const mfConfig = MENU_LIST_SCREENS['menu-fissi']

async function gotoFixedMenus(page: import('@playwright/test').Page) {
  await gotoMenuList(page, mfConfig)
}
async function openNewFixedMenu(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: MENU_FISSI_NEW_BUTTON }).click()
  await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
}
function fixedMenuDeleteDialog(page: import('@playwright/test').Page) {
  return page.locator('[role=alertdialog]')
}
async function clickFixedMenuDelete(page: import('@playwright/test').Page, menuName: string) {
  await clickRowAction(page, menuName, 'delete')
}

test.describe('Menù fissi', () => {
  // control:menu-fissi-elimina-senza-uso
  test(`menu-fissi-elimina-senza-uso ${PROFILE}`, async ({ page, payload, payloadWorker }, testInfo) => {
      const nome = payload.nome.bind(payload)
      const managerEmail = payload.managerEmail
      const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
      const menuName = nome('menu-libero')
      await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
      const ids = await createFixedMenuFixtureLocal(payloadWorker, managerEmail, {
        dishName: nome('p1'),
        categoryName: nome('cat'),
        menuNames: [menuName],
      })
      payload.registerCreated(FIXED_MENUS_SLUG, ids[0])

      await gotoFixedMenus(page)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.getByRole('heading', { level: 1, name: mfConfig.h1 }).waitFor()
      const deleteBtn = page.locator('main').getByRole('button', { name: `Elimina ${menuName}`, exact: true })
      const count = await deleteBtn.count()
      if (count === 0) {
        await testInfo.attach('screenshot-elenco', {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        })
        await testInfo.attach('dom-elenco', {
          body: await page.locator('main').innerHTML(),
          contentType: 'text/html',
        })
      }
      expect(
        count,
        `POSSIBILE DIFETTO DELL'APP: pulsante Elimina ${menuName} non trovato nell'elenco menù fissi`,
      ).toBeGreaterThan(0)
      await deleteBtn.click()
      const dlg = await fixedMenuDeleteDialog(page).innerText()
      expect(dlg).toContain(menuName)
      expect(dlg).toContain(CASCADE_DELETE_IRREVERSIBLE)
      expect(dlg).not.toMatch(/giorn[oi] speciali/i)
  })

  // control:menu-fissi-persistenza
  test(`menu-fissi-persistenza ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const nome = payload.nome.bind(payload)
    const managerEmail = payload.managerEmail
    const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
    await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
    const menuName = nome('menu-nuovo')
    const dish1 = nome('p1')
    const dish2 = nome('p2')
    const catLabel = nome('sempre')
    const serviceName = nome('servizio-a')
    const portion = '2 pezzi verify'

    await gotoFixedMenus(page)
    await openNewFixedMenu(page)
    await page.getByLabel(MENU_FISSI_FORM_NAME, { exact: true }).fill(menuName)
    await page.getByLabel(MENU_FISSI_FORM_PRICE).fill('18')
    await selectComboboxOption(page, MENU_FISSI_FORM_CATEGORY, catLabel)
    const sheet = page.locator('[data-slot=sheet-content]')
    await sheet.getByRole('button', { name: new RegExp(MENU_FISSI_FORM_DISHES_ADD) }).click()
    for (const dish of [dish2, dish1]) {
      await sheet.locator('[data-slot=field]').filter({ hasText: dish }).getByRole('checkbox').click()
    }
    await sheet.getByRole('button', { name: MENU_FISSI_PICKER_DONE }).click()
    await expect(sheet.getByText(dish1)).toBeVisible()
    await sheet.getByLabel(MENU_FISSI_FORM_PORTION).first().fill(portion)
    const svc = page.locator('[data-slot=field]').filter({ hasText: serviceName }).getByRole('checkbox')
    if ((await svc.getAttribute('aria-checked')) !== 'true') await svc.click()
    await page.getByRole('button', { name: MENU_FISSI_FORM_SAVE }).click()
    await expect(page.getByRole('status').filter({ hasText: /Menù fisso/ })).toBeVisible()

    const menuId = await findFixedMenuIdByName(payloadWorker, menuName)
    expect(menuId).toBeTruthy()
    payload.registerCreated(FIXED_MENUS_SLUG, menuId!)

    const read1 = await readFixedMenuAsManager(payloadWorker, managerEmail, menuId!)
    expect(read1.name).toBe(menuName)
    expect(read1.price).toBe(18)
    expect(read1.categoryName).toBe(catLabel)
    expect(read1.dishNames).toEqual([dish2, dish1])
    expect(read1.portions[0]).toBe(portion)
    expect(read1.serviceNames).toContain(serviceName)

    await clickRowAction(page, menuName, 'edit')
    await sheet.getByLabel(MENU_FISSI_FORM_NAME, { exact: true }).fill(`${menuName}-mod`)
    await sheet.getByRole('button', { name: MENU_FISSI_FORM_SAVE }).click()
    await expect(page.getByRole('status').filter({ hasText: MENU_FISSI_TOAST_SAVED })).toBeVisible()
    const read2 = await readFixedMenuAsManager(payloadWorker, managerEmail, menuId!)
    expect(read2.name).toBe(`${menuName}-mod`)
  })

  // control:menu-fissi-elimina-usato
  test(`menu-fissi-elimina-usato ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const nome = payload.nome.bind(payload)
    const managerEmail = payload.managerEmail
    const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
    const menuName = nome('menu-usato')
    await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
    const ids = await createFixedMenuFixtureLocal(payloadWorker, managerEmail, {
      dishName: nome('p1'),
      categoryName: nome('cat'),
      menuNames: [menuName],
    })
    payload.registerCreated(FIXED_MENUS_SLUG, ids[0])
    const dayId = await createSpecialDayForMenuLocal(payloadWorker, managerEmail, menuName, '2099-12-31')
    payload.registerCreated(SPECIAL_DAYS_SLUG, dayId)

    await gotoFixedMenus(page)
    await clickFixedMenuDelete(page, menuName)
    let dlg = await fixedMenuDeleteDialog(page).innerText()
    expect(dlg).toContain(menuName)
    expect(dlg).toMatch(/giorno speciale/i)
    expect(dlg).toContain(CASCADE_DELETE_IRREVERSIBLE)
    await page.getByRole('button', { name: MENU_FISSI_DELETE_BACK }).click()

    for (const d of ['2099-11-01', '2099-10-01', '2099-09-01']) {
      const id = await createSpecialDayAsManager(payloadWorker, managerEmail, {
        date: d,
        scope: 'day',
        fixedMenuIds: [ids[0] as number],
        messageIt: nome(`sd-${d}`),
      })
      payload.registerCreated(SPECIAL_DAYS_SLUG, id)
    }
    await clickFixedMenuDelete(page, menuName)
    dlg = await fixedMenuDeleteDialog(page).innerText()
    expect(dlg).toMatch(/4 giorni speciali/i)
    await page.getByRole('button', { name: MENU_FISSI_DELETE_BACK }).click()
    await clickFixedMenuDelete(page, menuName)
    await fixedMenuDeleteDialog(page).getByRole('button', { name: MENU_FISSI_DELETE_CONFIRM }).click()
    await expect(page.getByRole('status').filter({ hasText: MENU_FISSI_TOAST_DELETED })).toBeVisible()
  })

  // control:menu-fissi-elimina-cascade-registro-permessi
  test(`menu-fissi-elimina-cascade-registro-permessi ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const nome = payload.nome.bind(payload)
    const managerEmail = payload.managerEmail
    const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
    const menuName = nome('menu-cascade')
    await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
    const ids = await createFixedMenuFixtureLocal(payloadWorker, managerEmail, {
      dishName: nome('p1'),
      categoryName: nome('cat'),
      menuNames: [menuName],
    })
    const menuId = ids[0] as number
    payload.registerCreated(FIXED_MENUS_SLUG, menuId)
    const sdId = await createSpecialDayForMenuLocal(payloadWorker, managerEmail, menuName, '2099-11-15')
    payload.registerCreated(SPECIAL_DAYS_SLUG, sdId)

    await gotoFixedMenus(page)
    await clickFixedMenuDelete(page, menuName)
    await fixedMenuDeleteDialog(page).getByRole('button', { name: MENU_FISSI_DELETE_CONFIRM }).click()
    await expect(page.getByRole('status').filter({ hasText: MENU_FISSI_TOAST_DELETED })).toBeVisible()

    expect(await specialDayContainsMenu(payloadWorker, menuId)).toBe(false)
    const log = await findFixedMenuDeleteLog(payloadWorker, managerEmail, String(menuId), menuName, 1)
    expect(log.found, 'riga registro delete').toBe(true)
    expect(log.detail).toBe(log.expectedDetail)
  })

  // control:menu-fissi-nomi-accessibili
  test(`menu-fissi-nomi-accessibili ${PROFILE}`, async ({ page }) => {
    await gotoFixedMenus(page)
    const body = await page.locator('main').innerText()
    const hits = ENGLISH_BANNED.filter((w) => body.includes(w))
    expect(hits, `stringhe inglesi vietate: ${hits.join(', ')}`).toEqual([])
  })

  // control:menu-fissi-console
  test.skip(`menu-fissi-console ${PROFILE}`, () => {
    test.info().annotations.push({
      type: 'skip',
      description:
        'NON PROVATO: richiede server di sviluppo (porta 3200) per la console senza errori; locale-prod non copre questo controllo. Scadenza V6.',
    })
  })

  // control:menu-fissi-testi
  test.skip(`menu-fissi-testi ${PROFILE}`, () => {
    test.info().annotations.push({
      type: 'skip',
      description: 'NON PROVATO «tetto»: limite di righe del passo 24d; eccezione scritta verso V6 (firmata da Mirko, 2026-10-20).',
    })
  })

  // control:menu-fissi-modulo-validazione
  test.skip(`menu-fissi-modulo-validazione ${PROFILE}`, () => {
    test.info().annotations.push({
      type: 'skip',
      description: 'NON PROVATO «tetto»: limite di righe del passo 24d; previsto V6 passo 28.',
    })
  })

  // control:menu-fissi-disponibilita
  test.skip(`menu-fissi-disponibilita ${PROFILE}`, () => {
    test.info().annotations.push({
      type: 'skip',
      description: 'NON PROVATO «tetto»: limite di righe del passo 24d; previsto V6 passo 28.',
    })
  })
})
