import type { Page } from '@playwright/test'

import { FIXED_MENUS_SLUG, MENU_SERVICES_SLUG, SPECIAL_DAYS_SLUG } from '@/lib/menu/constants'
import type { Payload } from 'payload'

import type { PayloadFixture } from '../../fixtures'
import { ensureWorkerMenuSeeds, type SeedSlug } from './ensure-fixtures'
import {
  createFixedMenuFixtureLocal,
  createMenuServiceLocal,
  createSpecialDayForMenuLocal,
} from './payload-actions'
import type { MenuListScreenConfig, MenuListScreenId } from './config'
import { clickRowAction, gotoMenuList, selectComboboxOption } from './ui-helpers'


async function applyDbFixtures(
  screenId: MenuListScreenId,
  statoId: string,
  payload: PayloadFixture,
  payloadWorker: Payload,
): Promise<{ ok: boolean; reason?: string }> {
  const { nome, managerEmail, registerCreated } = payload
  const regSvc = (id: number | string) => registerCreated(MENU_SERVICES_SLUG, id)
  const regMenu = (id: number | string) => registerCreated(FIXED_MENUS_SLUG, id)
  const regSeed = (collection: SeedSlug, id: number | string) => registerCreated(collection, id)

  if (screenId === 'menu-fissi') {
    await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, regSeed)
  }

  if (screenId === 'servizi') {
    switch (statoId) {
      case 'elenco':
        regSvc(await createMenuServiceLocal(payloadWorker, managerEmail, { name: nome('serv-elenco') }))
        return { ok: true }
      case 'modulo':
        regSvc(await createMenuServiceLocal(payloadWorker, managerEmail, { name: nome('serv-mod') }))
        return { ok: true }
      case 'modulo-inglese-aperto':
        regSvc(
          await createMenuServiceLocal(payloadWorker, managerEmail, {
            name: nome('serv-en'),
            nameEn: 'EN',
          }),
        )
        return { ok: true }
      case 'elimina':
        regSvc(await createMenuServiceLocal(payloadWorker, managerEmail, { name: nome('serv-del') }))
        return { ok: true }
      case 'elimina-senza-uso':
        regSvc(await createMenuServiceLocal(payloadWorker, managerEmail, { name: nome('serv-lib') }))
        return { ok: true }
      case 'eliminato':
        regSvc(await createMenuServiceLocal(payloadWorker, managerEmail, { name: nome('serv-gone') }))
        return { ok: true }
      case 'disponibilita':
        regSvc(await createMenuServiceLocal(payloadWorker, managerEmail, { name: nome('serv-disp') }))
        return { ok: true }
      default:
        return { ok: true }
    }
  }

  if (screenId === 'menu-fissi') {
    const dish = nome('p1')
    const fixture = async (spec: { categoryName: string; menuSlug: string }) => {
      const ids = await createFixedMenuFixtureLocal(payloadWorker, managerEmail, {
        dishName: dish,
        categoryName: spec.categoryName,
        menuNames: [nome(spec.menuSlug)],
      })
      for (const id of ids) regMenu(id)
    }
    switch (statoId) {
      case 'elenco':
        await fixture({ categoryName: nome('cat'), menuSlug: 'menu-elenco' })
        return { ok: true }
      case 'modulo':
        await fixture({ categoryName: nome('cat-mod'), menuSlug: 'menu-mod' })
        return { ok: true }
      case 'modulo-piatti':
      case 'modulo-servizi':
        await fixture({ categoryName: nome('cat'), menuSlug: 'menu-sez' })
        return { ok: true }
      case 'modulo-inglese-aperto':
        await fixture({ categoryName: nome('cat'), menuSlug: 'menu-en' })
        return { ok: true }
      case 'scegli-piatti':
        await fixture({ categoryName: nome('cat'), menuSlug: 'menu-scelta' })
        return { ok: true }
      case 'disponibilita':
        await fixture({ categoryName: nome('cat'), menuSlug: 'menu-disp' })
        return { ok: true }
      case 'elimina':
        await fixture({ categoryName: nome('cat'), menuSlug: 'menu-usato' })
        registerCreated(
          SPECIAL_DAYS_SLUG,
          await createSpecialDayForMenuLocal(payloadWorker, managerEmail, nome('menu-usato'), '2099-06-01'),
        )
        return { ok: true }
      case 'elimina-senza-uso':
        await fixture({ categoryName: nome('cat'), menuSlug: 'menu-lib' })
        return { ok: true }
      case 'eliminato':
        await fixture({ categoryName: nome('cat'), menuSlug: 'menu-gone' })
        return { ok: true }
      case 'visibilita-categoria':
      case 'visibilita-avviso':
        return { ok: true }
      case 'categorie-vuoto':
      case 'nuovo-senza-categorie':
        return { ok: false, reason: 'stato non preparabile senza svuotare le categorie di prova nel database' }
      default:
        return { ok: true }
    }
  }

  return { ok: true }
}

export type PrepareOutcome = { ok: true } | { ok: false; reason: string }

export async function prepareMenuListState(
  page: Page,
  config: MenuListScreenConfig,
  statoId: string,
  payload: PayloadFixture,
  payloadWorker: Payload,
  options: { skipDb?: boolean } = {},
): Promise<PrepareOutcome> {
  const screenId = config.id
  const { nome } = payload
  if (!options.skipDb) {
    const fx = await applyDbFixtures(screenId, statoId, payload, payloadWorker)
    if (!fx.ok) return { ok: false, reason: fx.reason ?? 'fixture non creata' }
  }

  if (screenId === 'servizi') {
    switch (statoId) {
      case 'elenco':
        await gotoMenuList(page, config)
        return { ok: true }
      case 'disponibilita':
        await gotoMenuList(page, config)
        await page.getByRole('switch', { name: `Disponibile: ${nome('serv-disp')}` }).click()
        return { ok: true }
      case 'modulo':
        await gotoMenuList(page, config)
        await clickRowAction(page, nome('serv-mod'), 'edit')
        await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'modulo-inglese-aperto':
        await gotoMenuList(page, config)
        await clickRowAction(page, nome('serv-en'), 'edit')
        await page.getByRole('button', { name: /Traduzione inglese/i }).click()
        await page.locator('[data-slot=sheet-content] input').nth(1).waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'nuovo':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'nuovo-errori':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await page.getByRole('button', { name: 'Salva' }).click()
        await page.getByText('Campo obbligatorio.').first().waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'elimina':
        await gotoMenuList(page, config)
        await clickRowAction(page, nome('serv-del'), 'delete')
        await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'elimina-senza-uso':
        await gotoMenuList(page, config)
        await clickRowAction(page, nome('serv-lib'), 'delete')
        await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'eliminato':
        await gotoMenuList(page, config)
        await clickRowAction(page, nome('serv-gone'), 'delete')
        await page.locator('[role=alertdialog]').getByRole('button', { name: 'Elimina' }).click()
        await page.locator('[role=alertdialog]').waitFor({ state: 'hidden', timeout: 12_000 })
        return { ok: true }
      case 'errore-azione':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await page.locator('#service-field-name').fill(nome('err'))
        await page.locator('#service-field-price').fill('9,00')
        await page.getByRole('button', { name: 'Salva' }).click()
        await page.getByText('Operazione non riuscita').waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'caricamento':
      case 'errore-caricamento':
        await page.goto(config.path, { waitUntil: 'domcontentloaded' })
        return { ok: true }
      default:
        await gotoMenuList(page, config)
        return { ok: true }
    }
  }

  if (screenId === 'menu-fissi') {
    switch (statoId) {
      case 'elenco':
        await gotoMenuList(page, config)
        return { ok: true }
      case 'categorie':
        await gotoMenuList(page, config, config.categoriesPath!)
        return { ok: true }
      case 'categoria-modulo':
        await gotoMenuList(page, config, config.categoriesPath!)
        await clickRowAction(page, nome('cat'), 'edit')
        await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'categoria-nuova-errori':
        await gotoMenuList(page, config, config.categoriesPath!)
        await page.getByRole('button', { name: config.newCategoryButton! }).click()
        await page.getByRole('button', { name: 'Salva' }).click()
        await page.getByText('Campo obbligatorio.').first().waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'modulo':
        await gotoMenuList(page, config)
        await clickRowAction(page, nome('menu-mod'), 'edit')
        await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'modulo-piatti':
      case 'modulo-servizi':
        await gotoMenuList(page, config)
        await clickRowAction(page, nome('menu-sez'), 'edit')
        await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'modulo-inglese-aperto':
        await gotoMenuList(page, config)
        await clickRowAction(page, nome('menu-en'), 'edit')
        await page.getByRole('button', { name: /Traduzione inglese/i }).click()
        await page.locator('[data-slot=sheet-content] input').nth(1).waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'scegli-piatti':
        await gotoMenuList(page, config)
        await clickRowAction(page, nome('menu-scelta'), 'edit')
        await page.getByRole('button', { name: /Scegli piatti|Aggiungi.*piatti/i }).click()
        await page.locator('[data-slot=sheet-content]').last().waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'nuovo':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'nuovo-errori':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await page.getByRole('button', { name: 'Salva' }).click()
        await page.getByText('Campo obbligatorio.').first().waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'visibilita-categoria':
      case 'visibilita-avviso':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
        await selectComboboxOption(page, 'Categoria', nome('pranzo'))
        if (statoId === 'visibilita-categoria') {
          await page
            .locator('[data-slot=sheet-content]')
            .getByText(nome('pranzo'))
            .first()
            .waitFor({ timeout: 10_000 })
          return { ok: true }
        }
        await selectComboboxOption(page, 'Visibilità', 'Solo cena')
        await page.getByText(/non comparirà mai/i).waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'disponibilita':
        await gotoMenuList(page, config)
        await page.getByRole('switch', { name: `Disponibile: ${nome('menu-disp')}` }).click()
        return { ok: true }
      case 'elimina':
        await gotoMenuList(page, config)
        await clickRowAction(page, nome('menu-usato'), 'delete')
        await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'elimina-senza-uso':
        await gotoMenuList(page, config)
        await clickRowAction(page, nome('menu-lib'), 'delete')
        await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'eliminato':
        await gotoMenuList(page, config)
        await clickRowAction(page, nome('menu-gone'), 'delete')
        await page.locator('[role=alertdialog]').getByRole('button', { name: 'Elimina' }).click()
        await page.locator('[role=alertdialog]').waitFor({ state: 'hidden', timeout: 12_000 })
        return { ok: true }
      case 'errore-azione':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await page.locator('#fixed-menu-field-name').fill(nome('err'))
        await page.locator('#fixed-menu-field-price').fill('18,00')
        await selectComboboxOption(page, 'Categoria', nome('cat'))
        await page.getByRole('button', { name: 'Salva' }).click()
        await page.getByText('Operazione non riuscita').waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'caricamento':
      case 'errore-caricamento':
        await page.goto(config.path, { waitUntil: 'domcontentloaded' })
        return { ok: true }
      case 'categorie-vuoto':
      case 'nuovo-senza-categorie':
        return { ok: false, reason: 'stato non preparabile senza svuotare le categorie di prova nel database' }
      default:
        await gotoMenuList(page, config)
        return { ok: true }
    }
  }

  await gotoMenuList(page, config)
  return { ok: true }
}

export async function assertStateVisible(page: Page, config: MenuListScreenConfig, statoId: string): Promise<void> {
  if (statoId === 'caricamento') {
    await page.locator('[data-slot=skeleton]').first().waitFor({ timeout: 12_000 })
    return
  }
  if (statoId === 'errore-caricamento') {
    await page.getByText(/Impossibile caricare/i).waitFor({ timeout: 15_000 })
    return
  }
  if (statoId === 'errore-azione') {
    await page.getByText('Operazione non riuscita').waitFor({ timeout: 12_000 })
    return
  }
  if (statoId === 'elimina' || statoId === 'elimina-senza-uso') {
    await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
    return
  }
  if (statoId === 'nuovo-errori' || statoId === 'categoria-nuova-errori') {
    await page.getByText('Campo obbligatorio.').first().waitFor({ timeout: 12_000 })
    return
  }
  if (statoId === 'modulo' || statoId === 'nuovo' || statoId.startsWith('modulo') || statoId === 'categoria-modulo') {
    await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 12_000 })
    return
  }
  await page.getByRole('heading', { level: 1, name: config.h1 }).waitFor({ timeout: 12_000 })
}
