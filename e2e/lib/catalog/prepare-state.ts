import type { Page } from '@playwright/test'

import type { PayloadFixture } from '../../fixtures'
import { selectComboboxOption } from '../menu-list/ui-helpers'
import type { CatalogScreenConfig, CatalogScreenId } from './config'
import { createCatalogItems } from './payload-catalog'

async function gotoCatalog(page: Page, config: CatalogScreenConfig): Promise<void> {
  await page.goto(config.path, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { level: 1, name: config.h1 }).waitFor({ timeout: 20_000 })
}

async function clickRowAction(page: Page, name: string, action: 'edit' | 'delete'): Promise<void> {
  const label = action === 'edit' ? `Modifica ${name}` : `Elimina ${name}`
  await page.locator('main').getByRole('button', { name: label, exact: true }).click({ timeout: 20_000 })
}

async function openFilters(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Filtri' }).click()
  await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
}

function itemName(screenId: CatalogScreenId, slug: string, payload: PayloadFixture): string {
  return payload.nome(`${screenId}-${slug}`)
}

async function applyDb(
  screenId: CatalogScreenId,
  config: CatalogScreenConfig,
  statoId: string,
  payload: PayloadFixture,
): Promise<{ ok: boolean; reason?: string }> {
  const n = (slug: string) => itemName(screenId, slug, payload)
  switch (statoId) {
    case 'elenco':
      await createCatalogItems(config, payload, [{ name: n('elenco') }])
      return { ok: true }
    case 'disponibilita':
      await createCatalogItems(config, payload, [{ name: n('disp') }])
      return { ok: true }
    case 'filtri-attivi':
      await createCatalogItems(config, payload, [{ name: n('filtro') }])
      return { ok: true }
    case 'filtri-origine':
      if (!config.hasOriginCascade) return { ok: false, reason: 'stato non preparato' }
      await createCatalogItems(config, payload, [{ name: n('orig') }])
      return { ok: true }
    case 'modulo':
    case 'modulo-origine':
      await createCatalogItems(config, payload, [{ name: n('mod') }])
      return { ok: true }
    case 'modulo-inglese-aperto':
      await createCatalogItems(config, payload, [{ name: n('en'), descriptionEn: 'EN' }])
      return { ok: true }
    case 'errore-geografia':
      if (screenId !== 'vini') return { ok: false, reason: 'solo vini' }
      await createCatalogItems(config, payload, [{ name: n('geo') }])
      return { ok: true }
    case 'elimina':
      await createCatalogItems(config, payload, [{ name: n('del') }])
      return { ok: true }
    case 'eliminato':
      await createCatalogItems(config, payload, [{ name: n('gone') }])
      return { ok: true }
    case 'nessun-risultato':
      await createCatalogItems(config, payload, [{ name: n('find') }])
      return { ok: true }
    default:
      return { ok: true }
  }
}

export type PrepareOutcome = { ok: true } | { ok: false; reason: string }

export async function prepareCatalogState(
  page: Page,
  config: CatalogScreenConfig,
  statoId: string,
  payload: PayloadFixture,
): Promise<PrepareOutcome> {
  const screenId = config.id
  const n = (slug: string) => itemName(screenId, slug, payload)

  const fx = await applyDb(screenId, config, statoId, payload)
  if (!fx.ok) return { ok: false, reason: fx.reason ?? 'fixture non creata' }

  switch (statoId) {
    case 'elenco':
      await gotoCatalog(page, config)
      return { ok: true }
    case 'disponibilita':
      await gotoCatalog(page, config)
      await page.getByRole('switch', { name: `Disponibile: ${n('disp')}` }).click()
      return { ok: true }
    case 'filtri':
      await gotoCatalog(page, config)
      await openFilters(page)
      return { ok: true }
    case 'filtri-attivi':
      await gotoCatalog(page, config)
      await openFilters(page)
      await page.getByRole('combobox').first().click()
      await page.getByRole('option').nth(1).click()
      await page.getByRole('button', { name: 'Applica' }).click()
      return { ok: true }
    case 'filtri-origine':
      if (!config.hasOriginCascade) return { ok: false, reason: 'stato non preparato' }
      await gotoCatalog(page, config)
      await openFilters(page)
      await selectComboboxOption(page, 'Paese', 'Italia')
      await selectComboboxOption(page, 'Regione', 'Friuli Venezia Giulia')
      await selectComboboxOption(page, 'Denominazione', 'Collio')
      await page.getByRole('button', { name: 'Applica' }).click()
      return { ok: true }
    case 'modulo':
      await gotoCatalog(page, config)
      await clickRowAction(page, n('mod'), 'edit')
      await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
      return { ok: true }
    case 'modulo-origine':
      if (screenId !== 'vini') return { ok: false, reason: 'solo vini' }
      await gotoCatalog(page, config)
      await clickRowAction(page, n('mod'), 'edit')
      await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
      return { ok: true }
    case 'modulo-inglese-aperto':
      await gotoCatalog(page, config)
      await clickRowAction(page, n('en'), 'edit')
      await page.getByRole('button', { name: /Traduzione inglese/i }).click()
      await page.locator('[data-slot=sheet-content] input').nth(1).waitFor({ timeout: 12_000 })
      return { ok: true }
    case 'origine-senza-regioni':
      if (screenId !== 'vini') return { ok: false, reason: 'solo vini' }
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      await selectComboboxOption(page, 'Paese', 'Giappone')
      return { ok: true }
    case 'nuovo':
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
      return { ok: true }
    case 'nuovo-errori':
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      await page.getByRole('button', { name: 'Salva' }).click()
      await page.getByText('Campo obbligatorio.').first().waitFor({ timeout: 12_000 })
      return { ok: true }
    case 'errore-geografia':
      if (screenId !== 'vini') return { ok: false, reason: 'solo vini' }
      await gotoCatalog(page, config)
      await clickRowAction(page, n('geo'), 'edit')
      await selectComboboxOption(page, 'Paese', 'Francia')
      await page.getByRole('button', { name: 'Salva' }).click()
      await page.getByText(/geograf/i).first().waitFor({ timeout: 15_000 })
      return { ok: true }
    case 'errore-anno':
      if (screenId !== 'vini') return { ok: false, reason: 'solo vini' }
      await gotoCatalog(page, config)
      await page.getByRole('button', { name: config.newButton }).click()
      await page.getByRole('textbox', { name: 'Anno' }).fill('1899')
      await page.getByRole('button', { name: 'Salva' }).click()
      await page.getByText(/anno/i).first().waitFor({ timeout: 15_000 })
      return { ok: true }
    case 'elimina':
      await gotoCatalog(page, config)
      await clickRowAction(page, n('del'), 'delete')
      await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
      return { ok: true }
    case 'eliminato':
      await gotoCatalog(page, config)
      await clickRowAction(page, n('gone'), 'delete')
      await page.getByRole('button', { name: 'Elimina' }).click()
      await page.locator('[role=alertdialog]').waitFor({ state: 'hidden', timeout: 12_000 })
      return { ok: true }
    case 'nessun-risultato':
      await gotoCatalog(page, config)
      await page.getByPlaceholder(config.searchPlaceholder).fill('verify-ui-zzzz-no')
      await page.getByText(/nessun/i).first().waitFor({ timeout: 12_000 })
      return { ok: true }
    default:
      await gotoCatalog(page, config)
      return { ok: true }
  }
}

export async function assertCatalogStateVisible(
  page: Page,
  config: CatalogScreenConfig,
  statoId: string,
): Promise<void> {
  if (statoId === 'elimina') {
    await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
    return
  }
  if (statoId === 'nuovo-errori') {
    await page.getByText('Campo obbligatorio.').first().waitFor({ timeout: 12_000 })
    return
  }
  if (statoId.startsWith('modulo') || statoId === 'nuovo' || statoId === 'filtri' || statoId === 'filtri-attivi') {
    await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 12_000 })
    return
  }
  await page.getByRole('heading', { level: 1, name: config.h1 }).waitFor({ timeout: 12_000 })
}
