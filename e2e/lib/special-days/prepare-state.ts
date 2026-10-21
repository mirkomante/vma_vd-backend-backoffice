import type { Page } from '@playwright/test'

import { SPECIAL_DAYS_ERROR_DATE, SPECIAL_DAYS_ERROR_MENUS } from '@/lib/menu/specialDays/copy'
import { SPECIAL_DAY_OVERLAP_MESSAGE } from '@/lib/menu/validateSpecialDayOverlap'
import { FIXED_MENUS_SLUG, SPECIAL_DAYS_SLUG } from '@/lib/menu/constants'
import type { Payload } from 'payload'

import type { PayloadFixture } from '../../fixtures'
import { ensureWorkerMenuSeeds, type SeedSlug } from '../menu-list/ensure-fixtures'
import type { PrepareOutcome } from '../catalog/prepare-state'
import {
  createSpecialDayAsManager,
  ensureTwoVerifyFixedMenus,
} from './payload-helpers'
import {
  clickSpecialDaySave,
  confirmSpecialDayDelete,
  gotoSpecialDays,
  openNewSpecialDay,
  setSpecialDayDate,
  setSpecialDayScope,
  specialDayDeleteButton,
  specialDayEditButton,
  toggleFixedMenu,
} from './ui-helpers'

export async function prepareSpecialDayState(
  page: Page,
  statoId: string,
  payload: PayloadFixture,
  payloadWorker: Payload,
): Promise<PrepareOutcome> {
  const nome = payload.nome.bind(payload)
  const managerEmail = payload.managerEmail
  const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
  const registerMenu = (id: number | string) => payload.registerCreated(FIXED_MENUS_SLUG, id)

  switch (statoId) {
    case 'elenco': {
      await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
      const { menuAId } = await ensureTwoVerifyFixedMenus(
        payloadWorker,
        managerEmail,
        nome,
        register,
        registerMenu,
      )
      const id = await createSpecialDayAsManager(payloadWorker, managerEmail, {
        date: '2099-07-07',
        scope: 'lunch',
        fixedMenuIds: [menuAId],
        messageIt: nome('msg-elenco'),
      })
      payload.registerCreated(SPECIAL_DAYS_SLUG, id)
      await gotoSpecialDays(page)
      return { ok: true }
    }
    case 'modulo': {
      await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
      const { menuAId } = await ensureTwoVerifyFixedMenus(
        payloadWorker,
        managerEmail,
        nome,
        register,
        registerMenu,
      )
      const date = '2099-07-08'
      const id = await createSpecialDayAsManager(payloadWorker, managerEmail, {
        date,
        scope: 'day',
        fixedMenuIds: [menuAId],
        messageIt: nome('msg-mod'),
      })
      payload.registerCreated(SPECIAL_DAYS_SLUG, id)
      await gotoSpecialDays(page)
      await specialDayEditButton(page, date).click()
      await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 15_000 })
      return { ok: true }
    }
    case 'modulo-menu': {
      await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
      const { menuAId } = await ensureTwoVerifyFixedMenus(
        payloadWorker,
        managerEmail,
        nome,
        register,
        registerMenu,
      )
      const date = '2099-07-09'
      const id = await createSpecialDayAsManager(payloadWorker, managerEmail, {
        date,
        scope: 'dinner',
        fixedMenuIds: [menuAId],
        messageIt: nome('msg-menu'),
      })
      payload.registerCreated(SPECIAL_DAYS_SLUG, id)
      await gotoSpecialDays(page)
      await specialDayEditButton(page, date).click()
      await page.locator('#special-day-field-first-fixed-menu').scrollIntoViewIfNeeded()
      return { ok: true }
    }
    case 'modulo-inglese-aperto': {
      await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
      const { menuAId } = await ensureTwoVerifyFixedMenus(
        payloadWorker,
        managerEmail,
        nome,
        register,
        registerMenu,
      )
      const date = '2099-07-10'
      const id = await createSpecialDayAsManager(payloadWorker, managerEmail, {
        date,
        scope: 'lunch',
        fixedMenuIds: [menuAId],
        messageIt: nome('msg-it'),
        messageEn: 'verify-ui-en',
      })
      payload.registerCreated(SPECIAL_DAYS_SLUG, id)
      await gotoSpecialDays(page)
      await specialDayEditButton(page, date).click()
      await page.getByText('Traduzione inglese (facoltativa)').click()
      await page.locator('#special-day-message-en').waitFor({ timeout: 12_000 })
      return { ok: true }
    }
    case 'nuovo':
      await gotoSpecialDays(page)
      await openNewSpecialDay(page)
      return { ok: true }
    case 'nuovo-errori':
      await gotoSpecialDays(page)
      await openNewSpecialDay(page)
      await clickSpecialDaySave(page)
      await page.getByText(SPECIAL_DAYS_ERROR_MENUS).waitFor({ timeout: 12_000 })
      return { ok: true }
    case 'sovrapposizione': {
      await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
      const { menuA, menuAId } = await ensureTwoVerifyFixedMenus(
        payloadWorker,
        managerEmail,
        nome,
        register,
        registerMenu,
      )
      const conflictDate = '2099-07-11'
      const id = await createSpecialDayAsManager(payloadWorker, managerEmail, {
        date: conflictDate,
        scope: 'dinner',
        fixedMenuIds: [menuAId],
        messageIt: nome('sov'),
      })
      payload.registerCreated(SPECIAL_DAYS_SLUG, id)
      await gotoSpecialDays(page)
      await openNewSpecialDay(page)
      await setSpecialDayDate(page, conflictDate)
      await setSpecialDayScope(page, 'dinner')
      await page.getByText(SPECIAL_DAY_OVERLAP_MESSAGE).waitFor({ timeout: 12_000 })
      await toggleFixedMenu(page, menuA, true)
      return { ok: true }
    }
    case 'data-passata':
      await gotoSpecialDays(page)
      await openNewSpecialDay(page)
      await setSpecialDayDate(page, '2001-01-01')
      await page.getByText(SPECIAL_DAYS_ERROR_DATE).waitFor({ timeout: 12_000 })
      return { ok: true }
    case 'elimina': {
      await ensureWorkerMenuSeeds(payloadWorker, managerEmail, nome, register)
      const { menuAId } = await ensureTwoVerifyFixedMenus(
        payloadWorker,
        managerEmail,
        nome,
        register,
        registerMenu,
      )
      const date = '2099-07-12'
      const id = await createSpecialDayAsManager(payloadWorker, managerEmail, {
        date,
        scope: 'lunch',
        fixedMenuIds: [menuAId],
        messageIt: nome('del'),
      })
      payload.registerCreated(SPECIAL_DAYS_SLUG, id)
      await gotoSpecialDays(page)
      await specialDayDeleteButton(page, date).click()
      await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
      return { ok: true }
    }
    default:
      return { ok: false, reason: `stato ${statoId} non preparato` }
  }
}

export async function assertSpecialDayStateVisible(page: Page, statoId: string): Promise<void> {
  if (statoId === 'elimina') {
    await page.locator('[role=alertdialog]').waitFor({ timeout: 12_000 })
    return
  }
  if (statoId === 'nuovo-errori') {
    await page.getByText(SPECIAL_DAYS_ERROR_MENUS).waitFor({ timeout: 12_000 })
    return
  }
  if (statoId === 'sovrapposizione') {
    await page.getByText(SPECIAL_DAY_OVERLAP_MESSAGE).waitFor({ timeout: 12_000 })
    return
  }
  if (statoId === 'data-passata') {
    await page.getByText(SPECIAL_DAYS_ERROR_DATE).waitFor({ timeout: 12_000 })
    return
  }
  if (
    statoId.startsWith('modulo') ||
    statoId === 'nuovo' ||
    statoId === 'modulo-inglese-aperto'
  ) {
    await page.locator('[data-slot=sheet-content]').waitFor({ timeout: 12_000 })
    return
  }
  await page.getByRole('heading', { level: 1, name: 'Giorni speciali' }).waitFor({ timeout: 12_000 })
}
