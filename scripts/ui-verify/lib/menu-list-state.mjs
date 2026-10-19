import { menuScreenCopyConst } from './menu-screen-copy.mjs'
import {
  clickRowAction,
  gotoMenuList,
  openTabByName,
  waitForSheetReady,
} from './menu-list-ui-helpers.mjs'
import { selectComboboxOptionByKeyboard } from './catalog-ui-helpers.mjs'
import {
  menuCreateFixedMenuFixture,
  menuCreateMenuService,
  menuCreateSpecialDayForMenu,
  menuDeleteVerifyPrefix,
  menuEnsureMenuListFixtures,
  menuAddDishToFixedMenu,
} from './menu-payload.mjs'

function copy(screenId, name) {
  return menuScreenCopyConst(screenId, name)
}

/**
 * Prepara uno stato UI per C1/C2/C3 e screenshot (servizi / menù fissi).
 */
export async function prepareMenuListState(page, config, statoId, ctx) {
  const { testUser } = ctx
  const sid = config.id
  menuDeleteVerifyPrefix()

  if (sid === 'servizi') {
    switch (statoId) {
      case 'elenco':
        menuCreateMenuService(testUser.email, { name: 'verify-ui-serv-elenco' })
        await gotoMenuList(page, config)
        return true
      case 'modulo':
        menuCreateMenuService(testUser.email, { name: 'verify-ui-serv-mod' })
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-serv-mod', 'edit')
        return true
      case 'modulo-inglese-aperto':
        menuCreateMenuService(testUser.email, { name: 'verify-ui-serv-en', nameEn: 'EN' })
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-serv-en', 'edit')
        await page.getByRole('button', { name: /Traduzione inglese/i }).click().catch(() => {})
        return true
      case 'nuovo':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        return true
      case 'nuovo-errori':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
        return true
      case 'elimina':
        menuCreateMenuService(testUser.email, { name: 'verify-ui-serv-del' })
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-serv-del', 'delete')
        await page.locator('[role=alertdialog]').waitFor({ timeout: 10000 })
        return true
      case 'elimina-senza-uso':
        menuCreateMenuService(testUser.email, { name: 'verify-ui-serv-lib' })
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-serv-lib', 'delete')
        await page.locator('[role=alertdialog]').waitFor({ timeout: 10000 })
        return true
      case 'caricamento':
      case 'errore-caricamento':
      case 'errore-azione':
        await gotoMenuList(page, config)
        return true
      default:
        await gotoMenuList(page, config)
        return true
    }
  }

  if (sid === 'menu-fissi') {
    menuEnsureMenuListFixtures(testUser.email)
    switch (statoId) {
      case 'elenco':
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-elenco'],
        })
        await gotoMenuList(page, config)
        return true
      case 'categorie':
        await gotoMenuList(page, config, config.categoriesPath)
        return true
      case 'categoria-modulo':
        await gotoMenuList(page, config, config.categoriesPath)
        await clickRowAction(page, 'verify-ui-cat', 'edit')
        return true
      case 'categoria-nuova-errori':
        await gotoMenuList(page, config, config.categoriesPath)
        await page.getByRole('button', { name: config.newCategoryButton }).click()
        await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
        return true
      case 'modulo':
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat-mod',
          menuNames: ['verify-ui-menu-mod'],
        })
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-mod', 'edit')
        return true
      case 'modulo-piatti':
      case 'modulo-servizi':
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-sez'],
        })
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-sez', 'edit')
        return true
      case 'modulo-inglese-aperto':
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-en'],
        })
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-en', 'edit')
        await page.getByRole('button', { name: /Traduzione inglese/i }).click().catch(() => {})
        return true
      case 'scegli-piatti':
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-scelta'],
        })
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-scelta', 'edit')
        await page.getByRole('button', { name: /Scegli piatti|Aggiungi piatti/i }).click()
        await waitForSheetReady(page)
        return true
      case 'nuovo':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newMenuButton }).click()
        return true
      case 'nuovo-errori':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newMenuButton }).click()
        await page.getByRole('button', { name: copy(sid, 'FORM_SAVE') ?? 'Salva' }).click()
        return true
      case 'visibilita-categoria':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newMenuButton }).click()
        await selectComboboxOptionByKeyboard(page, copy(sid, 'FORM_CATEGORY') ?? 'Categoria', 'verify-ui-pranzo')
        return true
      case 'visibilita-avviso':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newMenuButton }).click()
        await selectComboboxOptionByKeyboard(page, copy(sid, 'FORM_CATEGORY') ?? 'Categoria', 'verify-ui-pranzo')
        await selectComboboxOptionByKeyboard(page, copy(sid, 'FORM_VISIBILITY') ?? 'Visibilità', 'Solo cena')
        return true
      case 'disponibilita':
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-disp'],
        })
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-disp', 'edit')
        return true
      case 'elimina':
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-usato'],
        })
        menuCreateSpecialDayForMenu(testUser.email, 'verify-ui-menu-usato', '2099-06-01')
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-usato', 'delete')
        await page.locator('[role=alertdialog]').waitFor({ timeout: 10000 })
        return true
      case 'elimina-senza-uso':
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-lib'],
        })
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-lib', 'delete')
        await page.locator('[role=alertdialog]').waitFor({ timeout: 10000 })
        return true
      case 'eliminato':
        menuCreateFixedMenuFixture(testUser.email, {
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-gone'],
        })
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-gone', 'delete')
        await page.getByRole('button', { name: 'Elimina' }).click()
        await page.waitForTimeout(500)
        return true
      case 'caricamento':
      case 'errore-caricamento':
      case 'errore-azione':
        await gotoMenuList(page, config)
        return true
      case 'vuoto':
        await gotoMenuList(page, config)
        return true
      case 'categorie-vuoto':
      case 'nuovo-senza-categorie':
        return false
      default:
        await gotoMenuList(page, config)
        return true
    }
  }

  await gotoMenuList(page, config)
  return true
}
