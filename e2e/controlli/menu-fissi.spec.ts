import { test, expect } from '../fixtures'
import { assertNoForbiddenEnglishInUi } from '../lib/checks'
import { projectTag } from '../lib/matrix-projects'
import { ensureWorkerMenuSeeds, type SeedSlug } from '../lib/menu-list/ensure-fixtures'
import {
  createFixedMenuFixtureLocal,
  createSpecialDayForMenuLocal,
  managerUser,
} from '../lib/menu-list/payload-actions'
import {
  findFixedMenuDeleteLog,
  findFixedMenuIdByName,
  readFixedMenuAsManager,
  readFixedMenuLocale,
  sortedFixedMenuCategoryNames,
  sortedFixedMenuNames,
  specialDayContainsMenu,
} from '../lib/menu-fissi/payload-helpers'
import { MENU_LIST_SCREENS } from '../lib/menu-list/config'
import { clickRowAction, gotoMenuList, selectComboboxOption } from '../lib/menu-list/ui-helpers'
import { createSpecialDayAsManager } from '../lib/special-days/payload-helpers'
import {
  DISHES_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
  SPECIAL_DAYS_SLUG,
} from '@/lib/menu/constants'
import { PIATTI_STATUS_DISABLED, PIATTI_STATUS_SOLD_OUT } from '@/lib/menu/dishes/copy'
import { compareItalianNames } from '@/lib/menu/display/sortByItalianName'
import {
  MENU_FISSI_BADGE_DISABLED,
  MENU_FISSI_CATEGORY_TOAST_DISABLED,
  MENU_FISSI_CATEGORY_TOAST_ENABLED,
  MENU_FISSI_FORM_CATEGORY,
  MENU_FISSI_FORM_DISHES_ADD,
  MENU_FISSI_FORM_DISHES_ADD_OR_EDIT,
  MENU_FISSI_FORM_NAME,
  MENU_FISSI_FORM_PORTION,
  MENU_FISSI_FORM_PORTIONS_EN_LEGEND,
  MENU_FISSI_FORM_PRICE,
  MENU_FISSI_FORM_SAVE,
  MENU_FISSI_NEW_BUTTON,
  MENU_FISSI_PICKER_DONE,
  MENU_FISSI_TOAST_DELETED,
  MENU_FISSI_TOAST_DISABLED,
  MENU_FISSI_TOAST_ENABLED,
  MENU_FISSI_TOAST_PUBLIC_MINUTES,
  MENU_FISSI_TOAST_SAVED,
  MENU_FISSI_DELETE_BACK,
  MENU_FISSI_DELETE_CONFIRM,
  MENU_FISSI_ERROR_CATEGORY,
  MENU_FISSI_ERROR_DISHES,
  MENU_FISSI_ERROR_PRICE,
  MENU_FISSI_ERROR_REQUIRED,
} from '@/lib/menu/fixed-menus/copy'
import { CASCADE_DELETE_IRREVERSIBLE } from '@/lib/menu/formatCascadeDeleteDescription'

const PROFILE = projectTag('telefono-390-chiaro')
const PROFILE_NB = projectTag('notebook-1280-chiaro')
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
    const deleteBtn = page.locator('main').getByRole('button', { name: `Elimina ${menuName}`, exact: true })
    try {
      await expect(deleteBtn).toBeVisible({ timeout: 20_000 })
    } catch {
      await testInfo.attach('screenshot-elenco', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      })
      await testInfo.attach('dom-elenco', {
        body: await page.locator('main').innerHTML(),
        contentType: 'text/html',
      })
      throw new Error(
        `POSSIBILE DIFETTO DELL'APP: pulsante Elimina ${menuName} non trovato nell'elenco menù fissi`,
      )
    }
    await deleteBtn.click()
    const dlg = fixedMenuDeleteDialog(page)
    await expect(dlg).toBeVisible()
    await expect(dlg).toContainText(menuName)
    await expect(dlg).toContainText(CASCADE_DELETE_IRREVERSIBLE)
    await expect(dlg).not.toContainText(/giorn[oi] speciali/i)
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
    await expect(page.locator('main').getByRole('button', { name: /^Modifica / }).first()).toBeVisible()
    await assertNoForbiddenEnglishInUi(page)
    await openNewFixedMenu(page)
    await assertNoForbiddenEnglishInUi(page, {
      extraScopes: [page.locator('[data-slot=sheet-content]')],
    })
    await page.keyboard.press('Escape')
  })

  // control:menu-fissi-console
  test.skip(`menu-fissi-console ${PROFILE}`, () => {
    test.info().annotations.push({
      type: 'skip',
      description: 'NON PROVATO: eccezione firmata da Mirko 2026-10-21, policy §6 (riduzione di V6)',
    })
  })

  // control:menu-fissi-testi
  test.skip(`menu-fissi-testi ${PROFILE}`, () => {
    test.info().annotations.push({
      type: 'skip',
      description: 'NON PROVATO «tetto»: 28d (UI = design)',
    })
  })

  // control:menu-fissi-modulo-validazione
  test(`menu-fissi-modulo-validazione ${PROFILE}`, async ({ page }) => {
    const posts: string[] = []
    page.on('request', (req) => {
      if (req.method() === 'POST') posts.push(req.url())
    })
    await gotoFixedMenus(page)
    await openNewFixedMenu(page)
    const before = posts.length
    await page.getByRole('button', { name: MENU_FISSI_FORM_SAVE }).click()
    await expect(page.getByText(MENU_FISSI_ERROR_REQUIRED)).toHaveCount(2)
    await expect(page.getByText(MENU_FISSI_ERROR_CATEGORY)).toBeVisible()
    await expect(page.getByText(MENU_FISSI_ERROR_DISHES)).toBeVisible()
    expect(posts.length, 'nessuna richiesta POST con modulo vuoto').toBe(before)
    await expect(page.locator('#fixed-menu-field-name')).toBeFocused()

    const price = page.locator('#fixed-menu-field-price')
    for (const value of ['18', '18,5', '18,50', '18.50']) {
      await price.fill(value)
      await expect(page.getByText(MENU_FISSI_ERROR_PRICE)).toHaveCount(0)
    }
    for (const bad of ['abc', '18,555']) {
      await price.fill(bad)
      await page.getByRole('button', { name: MENU_FISSI_FORM_SAVE }).click()
      await expect(page.getByText(MENU_FISSI_ERROR_PRICE)).toBeVisible()
    }
  })

  // control:menu-fissi-disponibilita
  test(`menu-fissi-disponibilita ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const nome = payload.nome.bind(payload)
    const managerEmail = payload.managerEmail
    const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
    const catName = nome('cat-disp')
    const menuName = nome('menu-disp')
    await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
    const user = await managerUser(payloadWorker, managerEmail)
    let catId = (
      await payloadWorker.find({
        collection: FIXED_MENU_CATEGORIES_SLUG,
        where: { name: { equals: catName } },
        limit: 1,
        overrideAccess: true,
      })
    ).docs[0]?.id
    if (catId == null) {
      const created = await payloadWorker.create({
        collection: FIXED_MENU_CATEGORIES_SLUG,
        data: { name: catName, visibility: 'always' },
        overrideAccess: false,
        user,
      })
      catId = created.id
      register(FIXED_MENU_CATEGORIES_SLUG, catId)
    }
    const dishId = (
      await payloadWorker.find({
        collection: DISHES_SLUG,
        where: { name: { equals: nome('p1') } },
        limit: 1,
        overrideAccess: true,
      })
    ).docs[0]?.id
    if (dishId == null) throw new Error('piatto seed mancante')
    const menuDoc = await payloadWorker.create({
      collection: FIXED_MENUS_SLUG,
      data: {
        name: menuName,
        description: 'verify-ui',
        price: 20,
        category: catId,
        visibility: 'always',
        dishes: [{ dish: dishId }],
      },
      overrideAccess: false,
      user,
    })
    payload.registerCreated(FIXED_MENUS_SLUG, menuDoc.id)

    await gotoFixedMenus(page)
    await page.getByRole('switch', { name: `Disponibile: ${menuName}` }).click()
    await expect(page.getByRole('status').filter({ hasText: MENU_FISSI_TOAST_DISABLED })).toBeVisible()
    await expect(page.getByText(MENU_FISSI_TOAST_PUBLIC_MINUTES)).toBeVisible()
    await expect(
      page
        .locator('main')
        .filter({ hasText: menuName })
        .locator('[data-slot=badge]')
        .filter({ hasText: MENU_FISSI_BADGE_DISABLED }),
    ).toBeVisible()
    await page.getByRole('switch', { name: `Disponibile: ${menuName}` }).click()
    await expect(page.getByRole('status').filter({ hasText: MENU_FISSI_TOAST_ENABLED })).toBeVisible()

    await gotoMenuList(page, mfConfig, mfConfig.categoriesPath)
    await page.getByRole('switch', { name: `Attiva: ${catName}` }).click()
    const categoryStatus = page
      .getByRole('status')
      .filter({ hasText: MENU_FISSI_CATEGORY_TOAST_DISABLED })
    await expect(categoryStatus).toBeVisible()
    await expect(categoryStatus).not.toContainText(MENU_FISSI_TOAST_PUBLIC_MINUTES)
    await page.getByRole('switch', { name: `Attiva: ${catName}` }).click()
    await expect(
      page.getByRole('status').filter({ hasText: MENU_FISSI_CATEGORY_TOAST_ENABLED }),
    ).toBeVisible()
  })

  // control:menu-fissi-porzione-traduzione
  test(`menu-fissi-porzione-traduzione ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const nome = payload.nome.bind(payload)
    const managerEmail = payload.managerEmail
    const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
    const menuName = nome('menu-porz')
    const portionIt = '2 pezzi verify'
    await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
    const ids = await createFixedMenuFixtureLocal(payloadWorker, managerEmail, {
      dishName: nome('p1'),
      categoryName: nome('cat'),
      menuNames: [menuName],
    })
    const menuId = ids[0]
    payload.registerCreated(FIXED_MENUS_SLUG, menuId)

    await gotoFixedMenus(page)
    await clickRowAction(page, menuName, 'edit')
    const sheet = page.locator('[data-slot=sheet-content]')
    await sheet.getByLabel(MENU_FISSI_FORM_PORTION).first().fill(portionIt)
    await page.getByRole('button', { name: MENU_FISSI_FORM_SAVE }).click()
    await expect(page.getByRole('status').filter({ hasText: MENU_FISSI_TOAST_SAVED })).toBeVisible()

    await clickRowAction(page, menuName, 'edit')
    await sheet.getByRole('button', { name: /Traduzione inglese/i }).click()
    await expect(sheet.getByText(MENU_FISSI_FORM_PORTIONS_EN_LEGEND)).toBeVisible()
    await expect(sheet.getByLabel(MENU_FISSI_FORM_PORTION).first()).toHaveCount(1)

    const itRead = await readFixedMenuAsManager(payloadWorker, managerEmail, menuId)
    expect(itRead.portions[0]).toBe(portionIt)
    const enRead = await readFixedMenuLocale(payloadWorker, managerEmail, menuId, 'en')
    expect(enRead.portions[0]).toBe(portionIt)
  })

  // control:menu-fissi-servizi-piatti
  test(`menu-fissi-servizi-piatti ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const nome = payload.nome.bind(payload)
    const managerEmail = payload.managerEmail
    const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
    const menuName = nome('menu-serv')
    const svcA = nome('servizio-a')
    const svcB = nome('servizio-b')
    await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
    const user = await managerUser(payloadWorker, managerEmail)
    const dishCategoryId = payload.defaultDishCategoryId
    const dishDis = await payloadWorker.create({
      collection: DISHES_SLUG,
      data: {
        name: nome('p-dis'),
        description: 'verify-ui',
        price: 9,
        category: dishCategoryId,
        disabled: true,
      },
      overrideAccess: false,
      user,
    })
    register(DISHES_SLUG, dishDis.id)
    const dishOut = await payloadWorker.create({
      collection: DISHES_SLUG,
      data: {
        name: nome('p-out'),
        description: 'verify-ui',
        price: 9,
        category: dishCategoryId,
        soldOut: true,
      },
      overrideAccess: false,
      user,
    })
    register(DISHES_SLUG, dishOut.id)
    const ids = await createFixedMenuFixtureLocal(payloadWorker, managerEmail, {
      dishName: nome('p1'),
      categoryName: nome('cat'),
      menuNames: [menuName],
    })
    payload.registerCreated(FIXED_MENUS_SLUG, ids[0])

    await gotoFixedMenus(page)
    await clickRowAction(page, menuName, 'edit')
    const sheet = page.locator('[data-slot=sheet-content]')
    for (const svc of [svcA, svcB]) {
      const box = sheet.locator('[data-slot=field]').filter({ hasText: svc }).getByRole('checkbox')
      if ((await box.getAttribute('aria-checked')) !== 'true') await box.click()
    }
    await page.getByRole('button', { name: MENU_FISSI_FORM_SAVE }).click()
    await expect(page.getByRole('status').filter({ hasText: MENU_FISSI_TOAST_SAVED })).toBeVisible()

    const read = await readFixedMenuAsManager(payloadWorker, managerEmail, ids[0])
    expect(read.serviceNames.sort()).toEqual([svcA, svcB].sort())

    await clickRowAction(page, menuName, 'edit')
    await sheet.getByRole('button', { name: new RegExp(MENU_FISSI_FORM_DISHES_ADD_OR_EDIT) }).click()
    await expect(
      sheet.locator('[data-slot=field]').filter({ hasText: nome('p-dis') }).getByText(PIATTI_STATUS_DISABLED),
    ).toBeVisible()
    await expect(
      sheet.locator('[data-slot=field]').filter({ hasText: nome('p-out') }).getByText(PIATTI_STATUS_SOLD_OUT),
    ).toBeVisible()
    await sheet.locator('[data-slot=field]').filter({ hasText: nome('p-dis') }).getByRole('checkbox').click()
    await sheet.getByRole('button', { name: MENU_FISSI_PICKER_DONE }).click()
    await expect(sheet.getByText(nome('p-dis'))).toBeVisible()
  })

  // control:menu-fissi-ordine-liste
  test(`menu-fissi-ordine-liste ${PROFILE_NB}`, async ({ page, payload, payloadWorker }) => {
    const nome = payload.nome.bind(payload)
    const managerEmail = payload.managerEmail
    const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
    await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
    const user = await managerUser(payloadWorker, managerEmail)
    const dishId = (
      await payloadWorker.find({
        collection: DISHES_SLUG,
        where: { name: { equals: nome('p1') } },
        limit: 1,
        overrideAccess: true,
      })
    ).docs[0]?.id
    if (dishId == null) throw new Error('piatto seed mancante')

    const catZ = nome('sort-zorro')
    const catA = nome('sort-àgnello')
    const catB = nome('sort-beta')
    const menuZ = nome('menu-sort-z')
    const menuA = nome('menu-sort-a')
    const menuB = nome('menu-sort-b')
    const expectedCats = [catA, catB, catZ].sort(compareItalianNames)
    const expectedMenus = [menuA, menuB, menuZ].sort(compareItalianNames)

    for (const [catName, menuName] of [
      [catZ, menuZ],
      [catA, menuA],
      [catB, menuB],
    ] as const) {
      const cat = await payloadWorker.create({
        collection: FIXED_MENU_CATEGORIES_SLUG,
        data: { name: catName, visibility: 'always' },
        overrideAccess: false,
        user,
      })
      register(FIXED_MENU_CATEGORIES_SLUG, cat.id)
      const menu = await payloadWorker.create({
        collection: FIXED_MENUS_SLUG,
        data: {
          name: menuName,
          description: 'verify-ui',
          price: 15,
          category: cat.id,
          visibility: 'always',
          dishes: [{ dish: dishId }],
        },
        overrideAccess: false,
        user,
      })
      payload.registerCreated(FIXED_MENUS_SLUG, menu.id)
    }

    const apiCats = await sortedFixedMenuCategoryNames(payloadWorker, managerEmail)
    for (const name of [catA, catB, catZ]) {
      expect(apiCats).toContain(name)
    }
    const sliceCats = apiCats.filter((n) => [catA, catB, catZ].includes(n))
    expect(sliceCats).toEqual(expectedCats)

    const apiMenus = await sortedFixedMenuNames(payloadWorker, managerEmail)
    const sliceMenus = apiMenus.filter((n) => [menuA, menuB, menuZ].includes(n))
    expect(sliceMenus).toEqual(expectedMenus)

    await gotoFixedMenus(page)
    const editButtons = page.locator('main').getByRole('button', { name: /^Modifica / })
    await expect(editButtons.first()).toBeVisible()
    const uiMenus: string[] = []
    const n = await editButtons.count()
    for (let i = 0; i < n; i++) {
      const label = await editButtons.nth(i).getAttribute('aria-label')
      if (label?.startsWith('Modifica ')) uiMenus.push(label.slice('Modifica '.length))
    }
    const sliceUi = uiMenus.filter((n) => [menuA, menuB, menuZ].includes(n))
    expect(sliceUi).toEqual(expectedMenus)
  })
})
