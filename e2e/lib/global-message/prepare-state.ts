import type { Page } from '@playwright/test'

import {
  GLOBAL_MESSAGE_DISCARD,
  GLOBAL_MESSAGE_PANEL_NONE,
  GLOBAL_MESSAGE_REMOVE,
  GLOBAL_MESSAGE_SAVE,
} from '@/lib/menu/globalMessage/copy'

import type { PayloadFixture } from '../../fixtures'
import type { PrepareOutcome } from '../catalog/prepare-state'
import { writeMenuGeneralTexts } from './payload-helpers'
import {
  fillGlobalMessageIt,
  globalMessageField,
  gotoGlobalMessage,
  openRemoveGlobalMessage,
  publishedPanel,
} from './ui-helpers'

export async function prepareGlobalMessageState(
  page: Page,
  statoId: string,
  payload: PayloadFixture,
  payloadWorker: import('payload').Payload,
): Promise<PrepareOutcome> {
  const managerEmail = payload.managerEmail

  switch (statoId) {
    case 'elenco':
      await writeMenuGeneralTexts(payloadWorker, managerEmail, {
        messageIt: payload.nome('msg-elenco'),
        messageEn: '',
      })
      await gotoGlobalMessage(page)
      return { ok: true }
    case 'modificato':
      await writeMenuGeneralTexts(payloadWorker, managerEmail, {
        messageIt: payload.nome('msg-base'),
        messageEn: '',
      })
      await gotoGlobalMessage(page)
      await fillGlobalMessageIt(page, `${payload.nome('msg-base')}-mod`)
      await page.getByRole('button', { name: GLOBAL_MESSAGE_SAVE }).waitFor({ state: 'visible' })
      return { ok: true }
    case 'inglese-aperto':
      await writeMenuGeneralTexts(payloadWorker, managerEmail, {
        messageIt: payload.nome('msg-en'),
        messageEn: 'verify-ui-en',
      })
      await gotoGlobalMessage(page)
      await page.getByText('Traduzione inglese (facoltativa)').click()
      await page.locator('#global-message-en').waitFor({ timeout: 12_000 })
      return { ok: true }
    case 'file-non-leggibile':
      await writeMenuGeneralTexts(payloadWorker, managerEmail, {
        messageIt: payload.nome('msg-file'),
        messageEn: '',
      })
      await gotoGlobalMessage(page)
      return { ok: true }
    case 'nessun-messaggio':
      await writeMenuGeneralTexts(payloadWorker, managerEmail, { messageIt: '', messageEn: '' })
      await gotoGlobalMessage(page)
      return { ok: true }
    case 'togli':
      await writeMenuGeneralTexts(payloadWorker, managerEmail, {
        messageIt: payload.nome('msg-togli'),
        messageEn: '',
      })
      await gotoGlobalMessage(page)
      await openRemoveGlobalMessage(page)
      await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
      return { ok: true }
    default:
      return { ok: false, reason: `stato ${statoId} non preparato` }
  }
}

export async function assertGlobalMessageStateVisible(page: Page, statoId: string): Promise<void> {
  if (statoId === 'togli') {
    await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
    return
  }
  if (statoId === 'modificato') {
    await page.getByRole('button', { name: GLOBAL_MESSAGE_SAVE }).waitFor({ timeout: 12_000 })
    await page.getByRole('button', { name: GLOBAL_MESSAGE_DISCARD }).waitFor({ timeout: 12_000 })
    return
  }
  if (statoId === 'inglese-aperto') {
    await page.locator('#global-message-en').waitFor({ timeout: 12_000 })
    return
  }
  if (statoId === 'nessun-messaggio') {
    await publishedPanel(page).getByText(GLOBAL_MESSAGE_PANEL_NONE).waitFor({ timeout: 12_000 })
    return
  }
  await page.getByRole('heading', { level: 1, name: 'Messaggio globale' }).waitFor({ timeout: 12_000 })
}
