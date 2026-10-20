import { readFileSync } from 'node:fs'

import type { Page } from '@playwright/test'

import { withFixtureLock } from '../fixture-lock'
import { menuDeleteVerifyPrefix, menuPayload } from '../menu-payload-run'
import { E2E_RUN_META } from '../paths'
import type { MenuListScreenConfig, MenuListScreenId } from './config'
import { clickRowAction, gotoMenuList, selectComboboxOption } from './ui-helpers'

function fixtureName(worker: number, slug: string): string {
  const runId = JSON.parse(readFileSync(E2E_RUN_META, 'utf8')).runId as string
  return `verify-ui-${runId}-w${worker}-${slug}`
}

async function applyDbFixtures(
  screenId: MenuListScreenId,
  statoId: string,
  worker: number,
): Promise<{ ok: boolean; reason?: string }> {
  await menuDeleteVerifyPrefix()

  if (screenId === 'servizi') {
    switch (statoId) {
      case 'elenco':
        await menuPayload('create-menu-service', JSON.stringify({ name: 'verify-ui-serv-elenco' }))
        return { ok: true }
      case 'modulo':
        await menuPayload('create-menu-service', JSON.stringify({ name: 'verify-ui-serv-mod' }))
        return { ok: true }
      case 'modulo-inglese-aperto':
        await menuPayload('create-menu-service', JSON.stringify({ name: 'verify-ui-serv-en', nameEn: 'EN' }))
        return { ok: true }
      case 'elimina':
        await menuPayload('create-menu-service', JSON.stringify({ name: 'verify-ui-serv-del' }))
        return { ok: true }
      case 'elimina-senza-uso':
        await menuPayload('create-menu-service', JSON.stringify({ name: 'verify-ui-serv-lib' }))
        return { ok: true }
      case 'eliminato':
        await menuPayload('create-menu-service', JSON.stringify({ name: 'verify-ui-serv-gone' }))
        return { ok: true }
      case 'disponibilita':
        await menuPayload('create-menu-service', JSON.stringify({ name: 'verify-ui-serv-disp' }))
        return { ok: true }
      default:
        return { ok: true }
    }
  }

  if (screenId === 'menu-fissi') {
    await menuPayload('ensure-menu-list-fixtures')
    const fixture = (spec: object) =>
      menuPayload('create-fixed-menu-fixture', JSON.stringify(spec))
    switch (statoId) {
      case 'elenco':
        await fixture({
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-elenco'],
        })
        return { ok: true }
      case 'modulo':
        await fixture({
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat-mod',
          menuNames: ['verify-ui-menu-mod'],
        })
        return { ok: true }
      case 'modulo-piatti':
      case 'modulo-servizi':
        await fixture({
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-sez'],
        })
        return { ok: true }
      case 'modulo-inglese-aperto':
        await fixture({
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-en'],
        })
        return { ok: true }
      case 'scegli-piatti':
        await fixture({
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-scelta'],
        })
        return { ok: true }
      case 'disponibilita':
        await fixture({
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-disp'],
        })
        return { ok: true }
      case 'elimina':
        await fixture({
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-usato'],
        })
        await menuPayload('create-special-day-for-menu', 'verify-ui-menu-usato', '2099-06-01')
        return { ok: true }
      case 'elimina-senza-uso':
        await fixture({
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-lib'],
        })
        return { ok: true }
      case 'eliminato':
        await fixture({
          dishName: 'verify-ui-p1',
          categoryName: 'verify-ui-cat',
          menuNames: ['verify-ui-menu-gone'],
        })
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

/** Prepara lo stato UI; un'asserzione di conferma va nel test chiamante. */
export async function prepareMenuListState(
  page: Page,
  config: MenuListScreenConfig,
  statoId: string,
  options: { skipDb?: boolean } = {},
): Promise<PrepareOutcome> {
  const screenId = config.id
  if (!options.skipDb) {
    const fx = await withFixtureLock(() => applyDbFixtures(screenId, statoId, 0))
    if (!fx.ok) return { ok: false, reason: fx.reason ?? 'fixture non creata' }
  }

  if (screenId === 'servizi') {
    switch (statoId) {
      case 'elenco':
        await gotoMenuList(page, config)
        return { ok: true }
      case 'disponibilita':
        await gotoMenuList(page, config)
        await page.getByRole('switch', { name: 'Disponibile: verify-ui-serv-disp' }).click()
        return { ok: true }
      case 'modulo':
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-serv-mod', 'edit')
        await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'modulo-inglese-aperto':
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-serv-en', 'edit')
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
        await clickRowAction(page, 'verify-ui-serv-del', 'delete')
        await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'elimina-senza-uso':
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-serv-lib', 'delete')
        await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'eliminato':
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-serv-gone', 'delete')
        await page.getByRole('button', { name: 'Elimina' }).click()
        await page.locator('[role=alertdialog]').waitFor({ state: 'hidden', timeout: 12_000 })
        return { ok: true }
      case 'errore-azione':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await page.locator('#service-field-name').fill('verify-ui-err')
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
        await clickRowAction(page, 'verify-ui-cat', 'edit')
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
        await clickRowAction(page, 'verify-ui-menu-mod', 'edit')
        await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'modulo-piatti':
      case 'modulo-servizi':
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-sez', 'edit')
        await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'modulo-inglese-aperto':
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-en', 'edit')
        await page.getByRole('button', { name: /Traduzione inglese/i }).click()
        await page.locator('[data-slot=sheet-content] input').nth(1).waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'scegli-piatti':
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-scelta', 'edit')
        await page.getByRole('button', { name: /Scegli piatti|Aggiungi piatti/i }).click()
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
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await selectComboboxOption(page, 'Categoria', 'verify-ui-pranzo')
        await page.getByText('verify-ui-pranzo').waitFor({ timeout: 10_000 })
        return { ok: true }
      case 'visibilita-avviso':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await selectComboboxOption(page, 'Categoria', 'verify-ui-pranzo')
        await selectComboboxOption(page, 'Visibilità', 'Solo cena')
        await page.getByText(/non comparirà mai/i).waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'disponibilita':
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-disp', 'edit')
        await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
        return { ok: true }
      case 'elimina':
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-usato', 'delete')
        await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'elimina-senza-uso':
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-lib', 'delete')
        await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
        return { ok: true }
      case 'eliminato':
        await gotoMenuList(page, config)
        await clickRowAction(page, 'verify-ui-menu-gone', 'delete')
        await page.getByRole('button', { name: 'Elimina' }).click()
        await page.locator('[role=alertdialog]').waitFor({ state: 'hidden', timeout: 12_000 })
        return { ok: true }
      case 'errore-azione':
        await gotoMenuList(page, config)
        await page.getByRole('button', { name: config.newButton }).click()
        await page.locator('#fixed-menu-field-name').fill('verify-ui-err')
        await page.locator('#fixed-menu-field-price').fill('18,00')
        await selectComboboxOption(page, 'Categoria', 'verify-ui-cat')
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
