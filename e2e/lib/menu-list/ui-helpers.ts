import type { Page } from '@playwright/test'

import type { MenuListScreenConfig } from './config'

export async function gotoMenuList(
  page: Page,
  config: MenuListScreenConfig,
  pathOverride?: string | null,
): Promise<void> {
  const path = pathOverride ?? config.path
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { level: 1, name: config.h1 }).waitFor({ timeout: 20_000 })
}

export async function clickRowAction(page: Page, name: string, action: 'edit' | 'delete'): Promise<void> {
  const label = action === 'edit' ? `Modifica ${name}` : `Elimina ${name}`
  await page.locator('main').getByRole('button', { name: label }).first().click({ timeout: 20_000 })
}

export async function selectComboboxOption(page: Page, fieldLabel: string, optionText: string): Promise<void> {
  const combo = page.getByRole('combobox', { name: fieldLabel })
  await combo.click()
  await page.getByRole('option', { name: optionText }).click({ timeout: 10_000 })
}
