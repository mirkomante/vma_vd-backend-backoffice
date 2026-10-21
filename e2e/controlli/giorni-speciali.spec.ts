import { test, expect } from '../fixtures'
import { projectTag } from '../lib/matrix-projects'
import {
  createSpecialDayAsManager,
  ensureTwoVerifyFixedMenus,
  findSpecialDayDeleteLog,
  readSpecialDayAsManager,
} from '../lib/special-days/payload-helpers'
import {
  clickSpecialDaySave,
  confirmSpecialDayDelete,
  gotoSpecialDays,
  openNewSpecialDay,
  setSpecialDayDate,
  setSpecialDayDisabled,
  setSpecialDayMessageEn,
  setSpecialDayMessageIt,
  setSpecialDayScope,
  specialDayDeleteButton,
  specialDayEditButton,
  specialDayListActiveSwitch,
  toggleFixedMenu,
} from '../lib/special-days/ui-helpers'
import { FIXED_MENUS_SLUG, SPECIAL_DAYS_SLUG } from '@/lib/menu/constants'
import type { SeedSlug } from '../lib/menu-list/ensure-fixtures'
import {
  SPECIAL_DAYS_BADGE_DISABLED,
  SPECIAL_DAYS_TOAST_DISABLED,
  SPECIAL_DAYS_TOAST_ENABLED,
  specialDayEditAriaLabel,
} from '@/lib/menu/specialDays/copy'
import { formatSpecialDayListDate } from '@/lib/menu/specialDays/formatSpecialDayListDate'
import { SPECIAL_DAY_OVERLAP_MESSAGE } from '@/lib/menu/validateSpecialDayOverlap'
import {
  SPECIAL_DAYS_COL_ACTIONS_SR,
  SPECIAL_DAYS_COL_ACTIVE,
  SPECIAL_DAYS_COL_DATE,
  SPECIAL_DAYS_COL_MENUS,
  SPECIAL_DAYS_COL_SCOPE,
  SPECIAL_DAYS_ERROR_DATE,
  SPECIAL_DAYS_ERROR_MENUS,
  SPECIAL_DAYS_GROUP_PAST,
  SPECIAL_DAYS_EMPTY,
  SPECIAL_DAYS_GROUP_UPCOMING,
  SPECIAL_DAYS_NEW_BUTTON,
  SPECIAL_DAYS_PAGE_DESCRIPTION,
  SPECIAL_DAYS_PAGE_TITLE,
} from '@/lib/menu/specialDays/copy'
import { assertNoForbiddenEnglishInUi } from '../lib/checks'

const PROFILE = projectTag('telefono-390-chiaro')

test.describe('Giorni speciali', () => {
  // control:giorni-speciali-persistenza
  test(`giorni-speciali-persistenza ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const nome = payload.nome.bind(payload)
    const managerEmail = payload.managerEmail
    const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
    const registerMenu = (id: number | string) => payload.registerCreated(FIXED_MENUS_SLUG, id)
    const { menuA, menuB, menuAId, menuBId } = await ensureTwoVerifyFixedMenus(
      payloadWorker,
      managerEmail,
      nome,
      register,
      registerMenu,
    )
    const msgIt = 'verify-ui-nuovo'
    const msgEn = 'verify-ui-nuovo-en'
    const date1 = '2099-08-10'

    await gotoSpecialDays(page)
    await openNewSpecialDay(page)
    await setSpecialDayDate(page, date1)
    await setSpecialDayScope(page, 'dinner')
    await toggleFixedMenu(page, menuA, true)
    await toggleFixedMenu(page, menuB, true)
    await setSpecialDayMessageIt(page, msgIt)
    await setSpecialDayMessageEn(page, msgEn)
    await clickSpecialDaySave(page)
    await expect(page.getByRole('status').filter({ hasText: 'Giorno speciale aggiunto' })).toBeVisible()

    const listed = await payloadWorker.find({
      collection: SPECIAL_DAYS_SLUG,
      where: { 'content.message': { equals: msgIt } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const id = listed.docs[0]?.id
    expect(id, 'giorno creato nel database').toBeTruthy()
    payload.registerCreated(SPECIAL_DAYS_SLUG, id!)

    const read1 = await readSpecialDayAsManager(payloadWorker, managerEmail, id!)
    expect(read1.date.slice(0, 10), 'data calendario').toBe(date1)
    expect(read1.scope).toBe('dinner')
    expect(read1.menuIds.sort()).toEqual([menuAId, menuBId].sort())
    expect(read1.messageIt).toBe(msgIt)
    expect(read1.messageEn).toBe(msgEn)
    expect(read1.disabled).toBe(false)

    const date2 = '2099-08-11'
    const msg2 = 'verify-ui-mod'
    await specialDayEditButton(page, date1).click()
    await setSpecialDayDate(page, date2)
    await setSpecialDayScope(page, 'lunch')
    await toggleFixedMenu(page, menuB, false)
    await setSpecialDayMessageIt(page, msg2)
    await clickSpecialDaySave(page)
    await expect(page.getByRole('status').filter({ hasText: 'Giorno speciale salvato' })).toBeVisible()

    const read2 = await readSpecialDayAsManager(payloadWorker, managerEmail, id!)
    expect(read2.date.slice(0, 10)).toBe(date2)
    expect(read2.scope).toBe('lunch')
    expect(read2.menuIds).toEqual([menuAId])
    expect(read2.messageIt).toBe(msg2)
    expect(read2.messageEn).toBe(msgEn)
  })

  // control:giorni-speciali-sovrapposizione
  test(`giorni-speciali-sovrapposizione ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
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
    const conflictDate = '2099-06-01'
    const sovId = await createSpecialDayAsManager(payloadWorker, managerEmail, {
      date: conflictDate,
      scope: 'dinner',
      fixedMenuIds: [menuAId],
      messageIt: 'verify-ui-sov',
    })
    payload.registerCreated(SPECIAL_DAYS_SLUG, sovId)

    await gotoSpecialDays(page)
    await openNewSpecialDay(page)
    await setSpecialDayDate(page, conflictDate)
    await setSpecialDayScope(page, 'dinner')
    await expect(page.getByText(SPECIAL_DAY_OVERLAP_MESSAGE)).toBeVisible()

    await setSpecialDayScope(page, 'day')
    await expect(page.getByText(SPECIAL_DAY_OVERLAP_MESSAGE)).toBeVisible()

    await setSpecialDayScope(page, 'lunch')
    await expect(page.getByText(SPECIAL_DAY_OVERLAP_MESSAGE)).toHaveCount(0)

    await setSpecialDayDate(page, '2099-06-02')
    await expect(page.getByText(SPECIAL_DAY_OVERLAP_MESSAGE)).toHaveCount(0)

    await setSpecialDayDate(page, conflictDate)
    await setSpecialDayScope(page, 'dinner')
    await expect(page.getByText(SPECIAL_DAY_OVERLAP_MESSAGE)).toBeVisible()
    await toggleFixedMenu(page, menuA, true)
    await expect(page.getByRole('button', { name: 'Salva', exact: true })).toBeDisabled()

    await setSpecialDayDisabled(page, true)
    await expect(page.getByText(SPECIAL_DAY_OVERLAP_MESSAGE)).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Salva', exact: true })).toBeEnabled()
    await setSpecialDayMessageIt(page, 'verify-ui-sov-dis')
    await clickSpecialDaySave(page)
    await expect(page.getByRole('status').filter({ hasText: 'Giorno speciale aggiunto' })).toBeVisible()

    const disListed = await payloadWorker.find({
      collection: SPECIAL_DAYS_SLUG,
      where: { 'content.message': { equals: 'verify-ui-sov-dis' } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const disId = disListed.docs[0]?.id
    if (disId != null) payload.registerCreated(SPECIAL_DAYS_SLUG, disId)

    const listDate = formatSpecialDayListDate(conflictDate)
    const activeRow = page
      .locator('[data-slot=card]')
      .filter({ hasText: listDate })
      .filter({ hasNotText: SPECIAL_DAYS_BADGE_DISABLED })
    await activeRow.getByRole('button', { name: specialDayEditAriaLabel(conflictDate), exact: true }).click()
    await clickSpecialDaySave(page)
    await expect(page.getByRole('status').filter({ hasText: 'Giorno speciale salvato' })).toBeVisible()
    await expect(page.getByText(SPECIAL_DAY_OVERLAP_MESSAGE)).toHaveCount(0)

    const activeAfter = await readSpecialDayAsManager(payloadWorker, managerEmail, sovId)
    expect(activeAfter.disabled, 'giorno attivo resta abilitato').toBe(false)
    if (disId != null) {
      const disAfter = await readSpecialDayAsManager(payloadWorker, managerEmail, disId)
      expect(disAfter.disabled, 'giorno disattivato invariato').toBe(true)
      expect(disAfter.messageIt).toBe('verify-ui-sov-dis')
    }
  })

  // control:giorni-speciali-elimina-registro-permessi
  test(`giorni-speciali-elimina-registro-permessi ${PROFILE}`, async ({
    page,
    payload,
    payloadWorker,
  }) => {
    const nome = payload.nome.bind(payload)
    const managerEmail = payload.managerEmail
    const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
    const registerMenu = (id: number | string) => payload.registerCreated(FIXED_MENUS_SLUG, id)
    const { menuAId } = await ensureTwoVerifyFixedMenus(
      payloadWorker,
      managerEmail,
      nome,
      register,
      registerMenu,
    )
    const dateDel = '2099-05-05'
    const delId = await createSpecialDayAsManager(payloadWorker, managerEmail, {
      date: dateDel,
      scope: 'lunch',
      fixedMenuIds: [menuAId],
      messageIt: 'verify-ui-del',
    })
    const docId = String(delId)

    await gotoSpecialDays(page)
    await specialDayDeleteButton(page, dateDel).click()
    await page.getByRole('button', { name: 'Indietro' }).click()
    await expect(specialDayDeleteButton(page, dateDel)).toBeVisible()

    await specialDayDeleteButton(page, dateDel).click()
    await confirmSpecialDayDelete(page)
    await expect(page.getByRole('status').filter({ hasText: 'Giorno speciale eliminato' })).toBeVisible()

    const gone = await payloadWorker.findByID({
      collection: SPECIAL_DAYS_SLUG,
      id: delId,
      overrideAccess: true,
    }).catch(() => null)
    expect(gone).toBeNull()

    const log = await findSpecialDayDeleteLog(payloadWorker, managerEmail, docId, dateDel, 'lunch')
    expect(log.found, 'riga registro delete').toBe(true)
    expect(log.detail, 'dettaglio registro').toBe(log.expectedDetail)
  })

  // control:giorni-speciali-attivazione
  test(`giorni-speciali-attivazione ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const nome = payload.nome.bind(payload)
    const managerEmail = payload.managerEmail
    const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
    const registerMenu = (id: number | string) => payload.registerCreated(FIXED_MENUS_SLUG, id)
    const { menuAId } = await ensureTwoVerifyFixedMenus(
      payloadWorker,
      managerEmail,
      nome,
      register,
      registerMenu,
    )
    const dateAtt = '2099-04-04'
    const attId = await createSpecialDayAsManager(payloadWorker, managerEmail, {
      date: dateAtt,
      scope: 'dinner',
      fixedMenuIds: [menuAId],
      messageIt: 'verify-ui-att',
    })
    payload.registerCreated(SPECIAL_DAYS_SLUG, attId)

    await gotoSpecialDays(page)
    const listDate = formatSpecialDayListDate(dateAtt)
    const row = page.locator('[data-slot=card]').filter({ hasText: listDate })
    await specialDayListActiveSwitch(page, dateAtt, 'dinner').click()
    await expect(page.getByRole('status').filter({ hasText: SPECIAL_DAYS_TOAST_DISABLED })).toBeVisible()
    await expect(row).toHaveClass(/opacity-50/)
    await expect(row.getByText(SPECIAL_DAYS_BADGE_DISABLED)).toBeVisible()
    const off = await readSpecialDayAsManager(payloadWorker, managerEmail, attId)
    expect(off.disabled).toBe(true)

    await specialDayListActiveSwitch(page, dateAtt, 'dinner').click()
    await expect(page.getByRole('status').filter({ hasText: SPECIAL_DAYS_TOAST_ENABLED })).toBeVisible()
    const on = await readSpecialDayAsManager(payloadWorker, managerEmail, attId)
    expect(on.disabled).toBe(false)
  })

  // control:giorni-speciali-testi
  test(`giorni-speciali-testi ${PROFILE}`, async ({ page }) => {
    await gotoSpecialDays(page)
    await expect(page.getByRole('heading', { level: 1, name: SPECIAL_DAYS_PAGE_TITLE })).toBeVisible()
    await expect(page.getByText(SPECIAL_DAYS_PAGE_DESCRIPTION)).toBeVisible()
    await expect(page.getByRole('button', { name: SPECIAL_DAYS_NEW_BUTTON })).toBeVisible()

    await expect(
      page.locator('[data-slot=card]').first().or(page.getByText(SPECIAL_DAYS_EMPTY)),
    ).toBeVisible({ timeout: 20_000 })

    const upcoming = page.locator('section').filter({
      has: page.getByRole('heading', { name: SPECIAL_DAYS_GROUP_UPCOMING }),
    })
    const past = page.locator('section').filter({
      has: page.getByRole('heading', { name: SPECIAL_DAYS_GROUP_PAST }),
    })
    if (await page.getByRole('heading', { name: SPECIAL_DAYS_GROUP_UPCOMING }).isVisible()) {
      const rows = upcoming.locator('[data-slot=card]')
      await expect(rows.first()).toBeVisible()
      await expect(upcoming.getByText(/\d+ giorn/)).toBeVisible()
    }
    if (await page.getByRole('heading', { name: SPECIAL_DAYS_GROUP_PAST }).isVisible()) {
      await expect(past.locator('[data-slot=card]').first()).toBeVisible()
      await expect(past.getByText(/\d+ giorn/)).toBeVisible()
    }

    await expect(page.getByRole('columnheader', { name: SPECIAL_DAYS_COL_DATE })).toHaveCount(0)
    await expect(page.getByRole('columnheader', { name: SPECIAL_DAYS_COL_SCOPE })).toHaveCount(0)
    await expect(page.getByRole('columnheader', { name: SPECIAL_DAYS_COL_MENUS })).toHaveCount(0)
    await expect(page.getByRole('columnheader', { name: SPECIAL_DAYS_COL_ACTIVE })).toHaveCount(0)
    await expect(page.getByRole('columnheader', { name: SPECIAL_DAYS_COL_ACTIONS_SR })).toHaveCount(0)
  })

  // control:giorni-speciali-nomi-accessibili
  test(`giorni-speciali-nomi-accessibili ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const nome = payload.nome.bind(payload)
    const managerEmail = payload.managerEmail
    const register = (c: SeedSlug, id: number | string) => payload.registerCreated(c, id)
    const registerMenu = (id: number | string) => payload.registerCreated(FIXED_MENUS_SLUG, id)
    const { menuAId } = await ensureTwoVerifyFixedMenus(
      payloadWorker,
      managerEmail,
      nome,
      register,
      registerMenu,
    )
    const dateDel = '2099-01-15'
    const delId = await createSpecialDayAsManager(payloadWorker, managerEmail, {
      date: dateDel,
      scope: 'dinner',
      fixedMenuIds: [menuAId],
      messageIt: 'verify-ui-nomi',
    })
    payload.registerCreated(SPECIAL_DAYS_SLUG, delId)

    await gotoSpecialDays(page)
    await expect(page.locator('[data-slot=card]').first()).toBeVisible()
    await assertNoForbiddenEnglishInUi(page)
    await openNewSpecialDay(page)
    await assertNoForbiddenEnglishInUi(page, {
      extraScopes: [page.locator('[data-slot="sheet-content"]')],
    })
    await page.keyboard.press('Escape')
    await specialDayDeleteButton(page, dateDel).click()
    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    await assertNoForbiddenEnglishInUi(page, { extraScopes: [dialog] })
    await page.getByRole('button', { name: 'Indietro' }).click()
  })

  // control:giorni-speciali-modulo-validazione
  test(`giorni-speciali-modulo-validazione ${PROFILE}`, async ({ page }) => {
    const posts: string[] = []
    page.on('request', (req) => {
      if (req.method() === 'POST') posts.push(req.url())
    })

    await gotoSpecialDays(page)
    await openNewSpecialDay(page)
    const beforePosts = posts.length
    await clickSpecialDaySave(page)
    await expect(page.getByText(SPECIAL_DAYS_ERROR_DATE)).toBeVisible()
    await expect(page.getByText(SPECIAL_DAYS_ERROR_MENUS)).toBeVisible()
    expect(posts.length, 'nessuna richiesta POST con modulo vuoto').toBe(beforePosts)
    await expect(page.locator('#special-day-field-date')).toBeFocused()
    await expect(page.locator('#special-day-field-date')).toBeInViewport()

    await setSpecialDayDate(page, '2099-09-09')
    const beforeSecond = posts.length
    await clickSpecialDaySave(page)
    await expect(page.getByText(SPECIAL_DAYS_ERROR_MENUS)).toBeVisible()
    await expect(page.getByText(SPECIAL_DAYS_ERROR_DATE)).toHaveCount(0)
    expect(posts.length, 'nessuna richiesta POST senza menù').toBe(beforeSecond)
    const firstMenuCheckbox = page
      .locator('[data-slot="field"]')
      .filter({ has: page.getByRole('checkbox') })
      .getByRole('checkbox')
      .first()
    await expect(firstMenuCheckbox).toBeFocused()
    await expect(firstMenuCheckbox).toBeInViewport()
  })
})
