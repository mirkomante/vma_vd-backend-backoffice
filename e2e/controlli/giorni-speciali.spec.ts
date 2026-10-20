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
  toggleFixedMenu,
} from '../lib/special-days/ui-helpers'
import { FIXED_MENUS_SLUG, SPECIAL_DAYS_SLUG } from '@/lib/menu/constants'
import type { SeedSlug } from '../lib/menu-list/ensure-fixtures'
import { SPECIAL_DAY_OVERLAP_MESSAGE } from '@/lib/menu/validateSpecialDayOverlap'

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

    await specialDayEditButton(page, conflictDate).first().click()
    await clickSpecialDaySave(page)
    await expect(page.getByRole('status').filter({ hasText: 'Giorno speciale salvato' })).toBeVisible()
    await expect(page.getByText(SPECIAL_DAY_OVERLAP_MESSAGE)).toHaveCount(0)
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
    const { menuA, menuAId } = await ensureTwoVerifyFixedMenus(
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

  // control:giorni-speciali-console
  test.skip(`giorni-speciali-console ${PROFILE}`, () => {
    test.info().annotations.push({
      type: 'skip',
      description:
        'NON PROVATO: richiede server di sviluppo (porta 3200) per la console senza errori; locale-prod non copre questo controllo. Scadenza V6.',
    })
  })
})
