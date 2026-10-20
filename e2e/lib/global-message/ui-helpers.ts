import type { Page } from '@playwright/test'

import {
  GLOBAL_MESSAGE_REMOVE,
  GLOBAL_MESSAGE_REMOVE_CONFIRM,
  GLOBAL_MESSAGE_SAVE,
  GLOBAL_MESSAGE_SAVE_PENDING,
  GLOBAL_MESSAGE_PAGE_TITLE,
} from '@/lib/menu/globalMessage/copy'

const MESSAGE_PATH = '/app/menu/message'

export async function gotoGlobalMessage(page: Page): Promise<void> {
  await page.goto(MESSAGE_PATH, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { level: 1, name: GLOBAL_MESSAGE_PAGE_TITLE }).waitFor({ timeout: 20_000 })
}

export async function fillGlobalMessageIt(page: Page, text: string): Promise<void> {
  await page.locator('#global-message-it').fill(text)
}

export async function fillGlobalMessageEn(page: Page, text: string): Promise<void> {
  await page.getByText('Traduzione inglese (facoltativa)').click()
  await page.locator('#global-message-en').fill(text)
}

export async function saveGlobalMessage(page: Page): Promise<void> {
  await page.getByRole('button', { name: GLOBAL_MESSAGE_SAVE }).click()
}

export async function waitForGlobalSavePending(page: Page): Promise<void> {
  await page.getByRole('button', { name: GLOBAL_MESSAGE_SAVE_PENDING }).waitFor({ timeout: 10_000 })
}

export async function openRemoveGlobalMessage(page: Page): Promise<void> {
  await page.getByRole('button', { name: GLOBAL_MESSAGE_REMOVE }).click()
}

export async function confirmRemoveGlobalMessage(page: Page): Promise<void> {
  await page.getByRole('button', { name: GLOBAL_MESSAGE_REMOVE_CONFIRM }).click()
}

export function publishedPanel(page: Page) {
  return page.locator('[data-block="stato-pubblicato"]')
}

export function globalMessageField(page: Page) {
  return page.locator('#global-message-it')
}
