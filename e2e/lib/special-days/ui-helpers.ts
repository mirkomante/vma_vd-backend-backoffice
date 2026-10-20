import type { Page } from '@playwright/test'

import { SPECIAL_DAYS_FORM_SCOPE } from '@/lib/menu/specialDays/copy'
import { SPECIAL_DAY_SCOPE_OPTIONS } from '@/lib/menu/validateSpecialDayOverlap'
import type { SpecialDayScope } from '@/lib/menu/validateSpecialDayOverlap'
import { formatSpecialDayListDate } from '@/lib/menu/specialDays/formatSpecialDayListDate'

import { selectComboboxOption } from '../menu-list/ui-helpers'

const SPECIAL_DAYS_PATH = '/app/menu/special-days'

export async function gotoSpecialDays(page: Page): Promise<void> {
  await page.goto(SPECIAL_DAYS_PATH, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { level: 1, name: 'Giorni speciali' }).waitFor({ timeout: 20_000 })
}

export async function openNewSpecialDay(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Nuovo giorno speciale' }).click()
  await page.getByRole('heading', { name: 'Nuovo giorno speciale' }).waitFor()
}

export async function setSpecialDayDate(page: Page, isoDate: string): Promise<void> {
  await page.locator('#special-day-field-date').fill(isoDate)
}

export async function setSpecialDayScope(page: Page, scope: SpecialDayScope): Promise<void> {
  const label = SPECIAL_DAY_SCOPE_OPTIONS.find((o) => o.value === scope)?.label
  if (!label) throw new Error(`ambito sconosciuto: ${scope}`)
  await selectComboboxOption(page, SPECIAL_DAYS_FORM_SCOPE, label)
  await page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined)
}

export async function toggleFixedMenu(page: Page, menuName: string, on: boolean): Promise<void> {
  const checkbox = page.locator('[data-slot="field"]').filter({ hasText: menuName }).getByRole('checkbox')
  const checked = await checkbox.getAttribute('aria-checked')
  const isOn = checked === 'true'
  if (isOn !== on) {
    await checkbox.click({ timeout: 15_000 })
  }
}

export async function setSpecialDayMessageIt(page: Page, text: string): Promise<void> {
  await page.locator('#special-day-message-it').fill(text)
}

export async function setSpecialDayMessageEn(page: Page, text: string): Promise<void> {
  await page.getByText('Traduzione inglese (facoltativa)').click()
  await page.locator('#special-day-message-en').fill(text)
}

export async function setSpecialDayDisabled(page: Page, disabled: boolean): Promise<void> {
  const switchEl = page.locator('[data-slot="sheet-content"]').getByRole('switch')
  const checked = await switchEl.isChecked()
  if (checked !== disabled) {
    await switchEl.click()
  }
}

export async function clickSpecialDaySave(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Salva', exact: true }).click()
}

export async function expectSpecialDaySaveDisabled(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Salva', exact: true }).waitFor({ state: 'visible' })
}

export function specialDayDeleteButton(page: Page, dateIso: string) {
  const label = `Elimina il giorno speciale di ${formatSpecialDayListDate(dateIso)}`
  return page.getByRole('button', { name: label, exact: true })
}

export function specialDayEditButton(page: Page, dateIso: string) {
  const label = `Modifica il giorno speciale di ${formatSpecialDayListDate(dateIso)}`
  return page.getByRole('button', { name: label, exact: true })
}

export async function confirmSpecialDayDelete(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Elimina' }).click()
}
