import { test, expect } from '../fixtures'
import { projectTag } from '../lib/matrix-projects'
import { withMenuGeneralBackup } from '../lib/global-message/backup'
import {
  readMenuGeneralTexts,
  writeMenuGeneralTexts,
} from '../lib/global-message/payload-helpers'
import {
  confirmRemoveGlobalMessage,
  fillGlobalMessageEn,
  fillGlobalMessageIt,
  globalMessageField,
  gotoGlobalMessage,
  openRemoveGlobalMessage,
  publishedPanel,
  saveGlobalMessage,
} from '../lib/global-message/ui-helpers'
import {
  GLOBAL_MESSAGE_DISCARD,
  GLOBAL_MESSAGE_FIELD_EN,
  GLOBAL_MESSAGE_FIELD_HINT,
  GLOBAL_MESSAGE_FIELD_LABEL,
  GLOBAL_MESSAGE_PANEL_NONE,
  GLOBAL_MESSAGE_PANEL_PUBLISHING,
  GLOBAL_MESSAGE_PANEL_TITLE,
  GLOBAL_MESSAGE_PAGE_DESCRIPTION,
  GLOBAL_MESSAGE_PAGE_TITLE,
  GLOBAL_MESSAGE_REMOVE,
  GLOBAL_MESSAGE_SAVE,
  GLOBAL_MESSAGE_SAVE_PENDING,
  GLOBAL_MESSAGE_TOAST_REMOVED,
  GLOBAL_MESSAGE_TOAST_SAVED,
  GLOBAL_MESSAGE_TRANSLATION_HINT,
  globalMessagePanelSavedFallback,
} from '@/lib/menu/globalMessage/copy'
import { assertNoForbiddenEnglishInUi } from '../lib/checks'

const PROFILE = projectTag('telefono-390-chiaro')

test.describe.configure({ mode: 'serial' })

test.describe('Messaggio globale', () => {
  // control:messaggio-globale-salvataggio
  test(`messaggio-globale-salvataggio ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const managerEmail = payload.managerEmail
    await withMenuGeneralBackup(payloadWorker, managerEmail, async () => {
      await writeMenuGeneralTexts(payloadWorker, managerEmail, {
        messageIt: 'verify-ui-seed',
        messageEn: 'verify-ui-seed-en',
      })
      await gotoGlobalMessage(page)
      const enBefore = (await readMenuGeneralTexts(payloadWorker, managerEmail)).messageEn

      await fillGlobalMessageIt(page, 'verify-ui-nuovo')
      await saveGlobalMessage(page)
      await expect(page.getByRole('status').filter({ hasText: GLOBAL_MESSAGE_TOAST_SAVED })).toBeVisible({
        timeout: 15_000,
      })
      await expect(globalMessageField(page)).toHaveValue('verify-ui-nuovo')
      await expect(page.getByRole('button', { name: 'Salva modifiche' })).toBeDisabled()

      const global = await readMenuGeneralTexts(payloadWorker, managerEmail)
      expect(global.messageIt).toBe('verify-ui-nuovo')
      expect(global.messageEn).toBe(enBefore)

      const panel = publishedPanel(page)
      await expect(panel).toContainText(globalMessagePanelSavedFallback('verify-ui-nuovo'))
      await expect(panel.getByText(GLOBAL_MESSAGE_PANEL_PUBLISHING)).toHaveCount(0)
    })
  })

  // control:messaggio-globale-togli
  test(`messaggio-globale-togli ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const managerEmail = payload.managerEmail
    await withMenuGeneralBackup(payloadWorker, managerEmail, async () => {
      await writeMenuGeneralTexts(payloadWorker, managerEmail, {
        messageIt: 'verify-ui-tg',
        messageEn: 'verify-ui-tg-en',
      })
      await gotoGlobalMessage(page)

      await openRemoveGlobalMessage(page)
      await page.getByRole('button', { name: 'Indietro' }).click()
      await expect(globalMessageField(page)).toHaveValue('verify-ui-tg')

      await openRemoveGlobalMessage(page)
      await confirmRemoveGlobalMessage(page)
      await expect(page.getByRole('status').filter({ hasText: GLOBAL_MESSAGE_TOAST_REMOVED })).toBeVisible()
      await expect(publishedPanel(page)).toContainText(GLOBAL_MESSAGE_PANEL_NONE)
      await expect(globalMessageField(page)).toHaveValue('')
      await expect(page.getByRole('button', { name: 'Togli il messaggio' })).toHaveCount(0)

      const global = await readMenuGeneralTexts(payloadWorker, managerEmail)
      expect(global.messageIt).toBe('')
      expect(global.messageEn).toBe('')
    })
  })

  // control:messaggio-globale-file-non-leggibile
  test(`messaggio-globale-file-non-leggibile ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const managerEmail = payload.managerEmail
    await withMenuGeneralBackup(payloadWorker, managerEmail, async () => {
      await writeMenuGeneralTexts(payloadWorker, managerEmail, {
        messageIt: 'verify-ui-nl',
        messageEn: '',
      })
      await gotoGlobalMessage(page)
      await expect(publishedPanel(page)).toContainText(globalMessagePanelSavedFallback('verify-ui-nl'))
      await expect(publishedPanel(page).getByText(GLOBAL_MESSAGE_PANEL_PUBLISHING)).toHaveCount(0)

      await fillGlobalMessageIt(page, '')
      await fillGlobalMessageEn(page, '')
      await saveGlobalMessage(page)
      await expect(page.getByRole('status').filter({ hasText: GLOBAL_MESSAGE_TOAST_SAVED })).toBeVisible()
      await page.reload({ waitUntil: 'domcontentloaded' })
      await expect(publishedPanel(page)).toContainText(GLOBAL_MESSAGE_PANEL_NONE)

      await page.clock.install()
      const readCalls: string[] = []
      page.on('request', (req) => {
        if (req.url().includes('message') && req.method() === 'POST') {
          readCalls.push(req.url())
        }
      })
      await gotoGlobalMessage(page)

      await fillGlobalMessageIt(page, 'verify-ui-nl2')
      await saveGlobalMessage(page)
      await expect(publishedPanel(page)).toContainText(globalMessagePanelSavedFallback('verify-ui-nl2'))
      await expect(publishedPanel(page).getByText(GLOBAL_MESSAGE_PANEL_PUBLISHING)).toHaveCount(0)
      await expect(page.getByText(GLOBAL_MESSAGE_PANEL_PUBLISHING)).toHaveCount(0)

      const beforePoll = readCalls.length
      await page.clock.fastForward(20_000)
      expect(readCalls.length, 'nessuna richiesta POST ripetuta per 20 secondi').toBe(beforePoll)
    })
  })

  // control:messaggio-globale-testi
  test(`messaggio-globale-testi ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const managerEmail = payload.managerEmail
    await withMenuGeneralBackup(payloadWorker, managerEmail, async () => {
      await writeMenuGeneralTexts(payloadWorker, managerEmail, {
        messageIt: 'verify-ui-testi',
        messageEn: '',
      })
      await gotoGlobalMessage(page)
    await expect(page.getByRole('heading', { level: 1, name: GLOBAL_MESSAGE_PAGE_TITLE })).toBeVisible()
    await expect(page.getByText(GLOBAL_MESSAGE_PAGE_DESCRIPTION)).toBeVisible()
    const panel = publishedPanel(page)
    await expect(panel.getByRole('heading', { level: 2, name: GLOBAL_MESSAGE_PANEL_TITLE })).toBeVisible()
    await expect(panel.locator('p').first()).toBeVisible()
    await expect(page.getByLabel(GLOBAL_MESSAGE_FIELD_LABEL)).toBeVisible()
    await expect(page.getByText(GLOBAL_MESSAGE_FIELD_HINT)).toBeVisible()
    await expect(page.getByText('Traduzione inglese (facoltativa)')).toBeVisible()
    await page.getByText('Traduzione inglese (facoltativa)').click()
    await expect(page.locator('#global-message-en')).toBeVisible()
    await expect(page.getByText(GLOBAL_MESSAGE_FIELD_EN, { exact: true })).toBeVisible()
    await expect(page.getByText(GLOBAL_MESSAGE_TRANSLATION_HINT)).toBeVisible()
    await expect(page.getByRole('button', { name: GLOBAL_MESSAGE_SAVE })).toBeVisible()
    await expect(page.getByRole('button', { name: GLOBAL_MESSAGE_DISCARD })).toBeVisible()
    await expect(page.getByRole('button', { name: GLOBAL_MESSAGE_REMOVE })).toBeVisible()
    await expect(page.getByRole('button', { name: GLOBAL_MESSAGE_SAVE_PENDING })).toHaveCount(0)
    })
  })

  // control:messaggio-globale-nomi-accessibili
  test(`messaggio-globale-nomi-accessibili ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const managerEmail = payload.managerEmail
    await withMenuGeneralBackup(payloadWorker, managerEmail, async () => {
      await writeMenuGeneralTexts(payloadWorker, managerEmail, {
        messageIt: 'verify-ui-nomi',
        messageEn: '',
      })
      await gotoGlobalMessage(page)
    await assertNoForbiddenEnglishInUi(page)
    await openRemoveGlobalMessage(page)
    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    await assertNoForbiddenEnglishInUi(page, { extraScopes: [dialog] })
    await page.getByRole('button', { name: 'Indietro' }).click()
    })
  })

  // control:messaggio-globale-permessi
  test.skip(`messaggio-globale-permessi ${PROFILE}`, () => {
    test.info().annotations.push({
      type: 'skip',
      description: 'coperto da verify:menu-6_1',
    })
  })

})
