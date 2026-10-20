import { test, expect } from '../fixtures'
import { projectTag } from '../lib/matrix-projects'
import {
  readMenuGeneralTexts,
  writeMenuGeneralTexts,
} from '../lib/special-days/payload-helpers'
import {
  confirmRemoveGlobalMessage,
  fillGlobalMessageEn,
  fillGlobalMessageIt,
  globalMessageField,
  gotoGlobalMessage,
  openRemoveGlobalMessage,
  publishedPanel,
  saveGlobalMessage,
  waitForGlobalSavePending,
} from '../lib/global-message/ui-helpers'
import {
  GLOBAL_MESSAGE_PANEL_NONE,
  GLOBAL_MESSAGE_PANEL_PUBLISHING,
  GLOBAL_MESSAGE_TOAST_REMOVED,
  GLOBAL_MESSAGE_TOAST_SAVED,
  globalMessagePanelSavedFallback,
} from '@/lib/menu/globalMessage/copy'

const PROFILE = projectTag('telefono-390-chiaro')

async function withMenuGeneralBackup(
  payloadWorker: import('payload').Payload,
  managerEmail: string,
  run: () => Promise<void>,
): Promise<void> {
  const before = await readMenuGeneralTexts(payloadWorker, managerEmail)
  try {
    await run()
  } finally {
    await writeMenuGeneralTexts(payloadWorker, managerEmail, before)
  }
}

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
      await waitForGlobalSavePending(page)
      await expect(page.getByRole('status').filter({ hasText: GLOBAL_MESSAGE_TOAST_SAVED })).toBeVisible()
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

      const readCalls: string[] = []
      page.on('request', (req) => {
        if (req.url().includes('message') && req.method() === 'POST') {
          readCalls.push(req.url())
        }
      })

      await fillGlobalMessageIt(page, 'verify-ui-nl2')
      await saveGlobalMessage(page)
      await expect(publishedPanel(page)).toContainText(globalMessagePanelSavedFallback('verify-ui-nl2'))
      await expect(publishedPanel(page).getByText(GLOBAL_MESSAGE_PANEL_PUBLISHING)).toHaveCount(0)
      await expect(page.getByText(GLOBAL_MESSAGE_PANEL_PUBLISHING)).toHaveCount(0)

      const beforePoll = readCalls.length
      await expect
        .poll(() => readCalls.length, { timeout: 20_000, intervals: [2_000] })
        .toBe(beforePoll)
    })
  })

  // control:messaggio-globale-file-riceve-messaggio
  test.skip(`messaggio-globale-file-riceve-messaggio ${PROFILE}`, () => {
    test.info().annotations.push({
      type: 'skip',
      description:
        'NON PROVATO: richiede server di sviluppo separato con MENU_AVAILABILITY_IN_MEMORY=1 e file speculare; non disponibile su locale-prod (porta 3100). Scadenza V6.',
    })
  })

  // control:messaggio-globale-pubblicazione
  test.skip(`messaggio-globale-pubblicazione ${PROFILE}`, () => {
    test.info().annotations.push({
      type: 'skip',
      description:
        'NON PROVATO: controllo L2 con simulazione ritardo pubblicazione (server dev porta 3200); previsto V6 passo 28.',
    })
  })

  // control:messaggio-globale-permessi
  test.skip(`messaggio-globale-permessi ${PROFILE}`, () => {
    test.info().annotations.push({
      type: 'skip',
      description:
        'NON PROVATO: matrice ruoli (admin, super-admin, utente senza ruolo) oltre al manager di prova; coperta da verify-roles-8_3.ts.',
    })
  })

})
