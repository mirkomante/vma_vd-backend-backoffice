import { unlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { test, expect } from '../fixtures'
import {
  assertConsoleMonitorClean,
  attachConsoleMonitor,
} from '../lib/checks'
import { withMenuDevServer } from '../lib/dev-menu-server'
import { withMenuGeneralBackup } from '../lib/global-message/backup'
import { expectMirrorGlobalMessage } from '../lib/global-message/mirror-file'
import {
  confirmRemoveGlobalMessage,
  fillGlobalMessageEn,
  fillGlobalMessageIt,
  gotoGlobalMessage,
  openRemoveGlobalMessage,
  publishedPanel,
  saveGlobalMessage,
} from '../lib/global-message/ui-helpers'
import { loginAppOnBase } from '../lib/login-dev'
import { projectTag } from '../lib/matrix-projects'
import { createSpecialDayAsManager, ensureTwoVerifyFixedMenus } from '../lib/special-days/payload-helpers'
import {
  gotoSpecialDays,
  openNewSpecialDay,
  setSpecialDayDate,
  setSpecialDayScope,
  setSpecialDayMessageEn,
  specialDayDeleteButton,
  specialDayListActiveSwitch,
  toggleFixedMenu,
} from '../lib/special-days/ui-helpers'
import { FIXED_MENUS_SLUG, SPECIAL_DAYS_SLUG } from '@/lib/menu/constants'
import type { SeedSlug } from '../lib/menu-list/ensure-fixtures'
import { GLOBAL_MESSAGE_PANEL_PUBLISHING } from '@/lib/menu/globalMessage/copy'

const PROFILE = projectTag('telefono-390-chiaro')

test.describe.configure({ mode: 'serial' })

async function openAppUserMenu(page: import('@playwright/test').Page, email: string): Promise<void> {
  await page.getByRole('button', { name: email }).click()
  await expect(page.getByRole('menuitem', { name: 'Esci' })).toBeVisible()
  await page.keyboard.press('Escape')
}

async function runGiorniSpecialiConsoleSteps(
  page: import('@playwright/test').Page,
  payload: import('../fixtures').PayloadFixture,
  payloadWorker: import('payload').Payload,
): Promise<void> {
  const nome = payload.nome.bind(payload)
  const managerEmail = payload.managerEmail
  const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
  const registerMenu = (id: number | string) => payload.registerCreated(FIXED_MENUS_SLUG, id)
  const { menuA, menuAId } = await ensureTwoVerifyFixedMenus(
    payloadWorker,
    managerEmail,
    nome,
    register,
    registerMenu,
  )
  const delDate = '2099-02-02'
  const delId = await createSpecialDayAsManager(payloadWorker, managerEmail, {
    date: delDate,
    scope: 'lunch',
    fixedMenuIds: [menuAId],
    messageIt: 'verify-ui-console-del',
  })
  payload.registerCreated(SPECIAL_DAYS_SLUG, delId)

  await gotoSpecialDays(page)
  await openNewSpecialDay(page)
  await setSpecialDayMessageEn(page, 'verify-ui-console-en')
  await page.locator('[data-slot="sheet-content"]').getByText('Menù fissi').scrollIntoViewIfNeeded()
  await setSpecialDayDate(page, '2001-06-06')
  await setSpecialDayScope(page, 'dinner')
  await toggleFixedMenu(page, menuA, true)
  await page.keyboard.press('Escape')

  await specialDayDeleteButton(page, delDate).click()
  await page.getByRole('button', { name: 'Indietro' }).click()

  await specialDayListActiveSwitch(page, delDate, 'lunch').click()
  await openAppUserMenu(page, managerEmail)
}

async function runMessaggioGlobaleConsoleSteps(page: import('@playwright/test').Page, email: string): Promise<void> {
  await gotoGlobalMessage(page)
  await fillGlobalMessageIt(page, 'verify-ui-console-gm')
  await page.getByText('Traduzione inglese (facoltativa)').click()
  await openRemoveGlobalMessage(page)
  await page.getByRole('button', { name: 'Indietro' }).click()
  await saveGlobalMessage(page)
  await openAppUserMenu(page, email)
}

test.describe('Server di sviluppo :3200', () => {
  // control:giorni-speciali-console
  test(`giorni-speciali-console ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    test.setTimeout(420_000)
    await withMenuDevServer({}, async (baseUrl) => {
      const bag = attachConsoleMonitor(page)
      await loginAppOnBase(page, baseUrl)

      await page.setViewportSize({ width: 390, height: 844 })
      await runGiorniSpecialiConsoleSteps(page, payload, payloadWorker)
      await page.setViewportSize({ width: 1280, height: 900 })
      await gotoSpecialDays(page)
      await openNewSpecialDay(page)
      await page.keyboard.press('Escape')

      await assertConsoleMonitorClean(bag)
    })
  })

  // control:messaggio-globale-console
  test(`messaggio-globale-console ${PROFILE}`, async ({ page, payload }) => {
    test.setTimeout(420_000)
    const managerEmail = payload.managerEmail
    await withMenuDevServer({}, async (baseUrl) => {
      const bag = attachConsoleMonitor(page)
      await loginAppOnBase(page, baseUrl)

      await page.setViewportSize({ width: 390, height: 844 })
      await runMessaggioGlobaleConsoleSteps(page, managerEmail)
      await page.setViewportSize({ width: 1280, height: 900 })
      await gotoGlobalMessage(page)

      await assertConsoleMonitorClean(bag)
    })
  })

  // control:messaggio-globale-file-riceve-messaggio
  test(`messaggio-globale-file-riceve-messaggio ${PROFILE}`, async ({
    page,
    payload,
    payloadWorker,
  }) => {
    test.setTimeout(420_000)
    const managerEmail = payload.managerEmail
    const mirrorPath = join(tmpdir(), `vma-verify-ui-mirror-${payload.runId}.json`)
    try {
      await withMenuGeneralBackup(payloadWorker, managerEmail, async () => {
        await withMenuDevServer(
          {
            MENU_AVAILABILITY_IN_MEMORY: '1',
            MENU_AVAILABILITY_MIRROR_FILE: mirrorPath,
          },
          async (baseUrl) => {
            await loginAppOnBase(page, baseUrl)
            await gotoGlobalMessage(page)

            await fillGlobalMessageIt(page, 'verify-ui-it')
            await fillGlobalMessageEn(page, 'verify-ui-en')
            await saveGlobalMessage(page)
            await expectMirrorGlobalMessage(mirrorPath, { it: 'verify-ui-it', en: 'verify-ui-en' })

            await fillGlobalMessageEn(page, '')
            await saveGlobalMessage(page)
            await expectMirrorGlobalMessage(mirrorPath, { it: 'verify-ui-it', en: 'verify-ui-it' })

            await fillGlobalMessageIt(page, '')
            await fillGlobalMessageEn(page, 'verify-ui-en')
            await saveGlobalMessage(page)
            await expectMirrorGlobalMessage(mirrorPath, { it: 'verify-ui-en', en: 'verify-ui-en' })

            await openRemoveGlobalMessage(page)
            await confirmRemoveGlobalMessage(page)
            await expectMirrorGlobalMessage(mirrorPath, null)
          },
        )
      })
    } finally {
      await unlink(mirrorPath).catch(() => undefined)
    }
  })

  // control:messaggio-globale-pubblicazione
  test(`messaggio-globale-pubblicazione ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    test.setTimeout(420_000)
    const managerEmail = payload.managerEmail
    await withMenuGeneralBackup(payloadWorker, managerEmail, async () => {
      await withMenuDevServer(
        {
          MENU_AVAILABILITY_IN_MEMORY: '1',
          APP_MENU_DEV_SIMULATE_PUBLISH_DELAY_MS: '8000',
        },
        async (baseUrl) => {
          await loginAppOnBase(page, baseUrl)
          await gotoGlobalMessage(page)

          await fillGlobalMessageIt(page, 'verify-ui-pub-1')
          await saveGlobalMessage(page)
          const panel = publishedPanel(page)
          await expect(panel.getByText(/Menù pubblico aggiornato alle/)).toBeVisible({ timeout: 15_000 })

          await fillGlobalMessageIt(page, 'verify-ui-pub-2')
          await saveGlobalMessage(page)
          await expect(panel).toContainText('verify-ui-pub-1')
          await expect(panel.getByText(GLOBAL_MESSAGE_PANEL_PUBLISHING)).toBeVisible()
          await expect(panel.locator('[class*="animate-spin"], svg')).toBeVisible()

          let seenNew = false
          await expect
            .poll(async () => {
              const text = await panel.innerText()
              if (text.includes('verify-ui-pub-2') && !text.includes(GLOBAL_MESSAGE_PANEL_PUBLISHING)) {
                seenNew = true
                return 'ok'
              }
              return 'wait'
            })
            .toBe('ok')

          expect(seenNew).toBe(true)
          await expect(panel.getByText(GLOBAL_MESSAGE_PANEL_PUBLISHING)).toHaveCount(0)

          await openRemoveGlobalMessage(page)
          await confirmRemoveGlobalMessage(page)
          await expect(panel.getByText(GLOBAL_MESSAGE_PANEL_PUBLISHING)).toHaveCount(0)
        },
      )
    })
  })
})
