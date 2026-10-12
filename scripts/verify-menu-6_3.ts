/**
 * Verifica fase 6.3: giorni speciali, specialOnly, date, sovrapposizione, REST.
 *
 *   pnpm verify:menu-6_3
 * Usa vma_vd_dev. REST: `pnpm dev` su APP_PUBLIC_URL.
 */
import config from '@payload-config'
import { APIError, type CollectionSlug, getPayload, ValidationError } from 'payload'

import {
  ALLERGENS_SLUG,
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
  SPECIAL_DAYS_SLUG,
} from '@/lib/menu/constants'
import { todayRomeAsSpecialDayDate } from '@/lib/menu/specialDayDate'
import { SPECIAL_DAY_OVERLAP_MESSAGE } from '@/lib/menu/validateSpecialDayOverlap'
import type { User } from '@/payload-types'

import { assertDevDatabaseFromEnv } from './import-menu-vtn-backend/databaseUrl'
import {
  combinedImportFingerprintHash,
  fingerprintImportCollections,
} from './lib/import-menu-fingerprint'
import { maybeInjectControlledFailure } from './verify-menu-inject-fail'

const TEST_RUN_ID = Date.now().toString(36)
const TEST_EMAIL_PREFIX = `verify-6_3-${TEST_RUN_ID}-`
const TEST_PASSWORD = 'Verify6_3!AaBbCc'

type PayloadInstance = Awaited<ReturnType<typeof getPayload>>

type CreatedDocRef = { collection: CollectionSlug; id: number | string }

type FixtureIds = {
  dishCategoryId: number | string
  dishId: number | string
  allergenId: number | string
  fixedCategoryId: number | string
  fixedMenuId: number | string
  fixedMenuSecondId: number | string
}

function appPublicUrl(): string {
  return (process.env.APP_PUBLIC_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}

function isAccessDenied(error: unknown): boolean {
  return error instanceof APIError && error.status === 403
}

function isValidationError(error: unknown): boolean {
  return error instanceof ValidationError
}

function trackCreated(created: CreatedDocRef[], collection: CollectionSlug, id: number | string): void {
  created.push({ collection, id })
}

function asNumericId(id: number | string): number {
  if (typeof id === 'number') {
    return id
  }
  const parsed = Number(id)
  if (Number.isNaN(parsed)) {
    throw new Error(`ID non numerico: ${id}`)
  }
  return parsed
}

async function restFetchAnon(path: string, method: string, body?: Record<string, unknown>): Promise<Response> {
  return fetch(`${appPublicUrl()}${path}`, {
    method,
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })
}

function expectAnonRestWriteStatus(label: string, res: Response): void {
  if (res.status !== 403) {
    throw new Error(`REST anonimo ${label}: atteso 403, ottenuto ${res.status}`)
  }
  console.log(`OK: REST anonimo ${label} → ${res.status}`)
}

async function buildFixtures(payload: PayloadInstance, created: CreatedDocRef[]): Promise<FixtureIds> {
  const tag = `6_3 ${TEST_RUN_ID}`

  const allergen = await payload.create({
    collection: ALLERGENS_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: { name: `Allergene ${tag}` },
  })
  trackCreated(created, ALLERGENS_SLUG, allergen.id)

  const dishCategory = await payload.create({
    collection: DISH_CATEGORIES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: { name: `Cat ${tag}` },
  })
  trackCreated(created, DISH_CATEGORIES_SLUG, dishCategory.id)

  const dish = await payload.create({
    collection: DISHES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: {
      name: `Piatto ${tag}`,
      price: 10,
      category: dishCategory.id,
      allergens: [allergen.id],
    },
  })
  trackCreated(created, DISHES_SLUG, dish.id)

  const fixedCategory = await payload.create({
    collection: FIXED_MENU_CATEGORIES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: { name: `CatFissa ${tag}`, visibility: 'always' },
  })
  trackCreated(created, FIXED_MENU_CATEGORIES_SLUG, fixedCategory.id)

  const fixedMenu = await payload.create({
    collection: FIXED_MENUS_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: {
      name: `Menu ${tag}`,
      price: 45,
      category: fixedCategory.id,
      visibility: 'always',
      specialOnly: false,
      dishes: [{ dish: dish.id }],
    },
  })
  trackCreated(created, FIXED_MENUS_SLUG, fixedMenu.id)

  const fixedMenuSecond = await payload.create({
    collection: FIXED_MENUS_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: {
      name: `Menu2 ${tag}`,
      price: 50,
      category: fixedCategory.id,
      visibility: 'always',
      dishes: [{ dish: dish.id }],
    },
  })
  trackCreated(created, FIXED_MENUS_SLUG, fixedMenuSecond.id)

  return {
    dishCategoryId: dishCategory.id,
    dishId: dish.id,
    allergenId: allergen.id,
    fixedCategoryId: fixedCategory.id,
    fixedMenuId: fixedMenu.id,
    fixedMenuSecondId: fixedMenuSecond.id,
  }
}

function minimalSpecialDayData(
  fixtureIds: FixtureIds,
  overrides: {
    date?: string
    scope?: 'day' | 'lunch' | 'dinner'
    disabled?: boolean
    fixedMenuIds?: Array<number | string>
  } = {},
): Record<string, unknown> {
  return {
    date: overrides.date ?? '2030-06-15',
    scope: overrides.scope ?? 'dinner',
    content: {
      fixedMenus: (overrides.fixedMenuIds ?? [fixtureIds.fixedMenuId]).map((id) => asNumericId(id)),
    },
    disabled: overrides.disabled ?? false,
  }
}

async function tryCreateSpecialDay(
  payload: PayloadInstance,
  data: Record<string, unknown>,
  user?: User,
): Promise<void> {
  await payload.create({
    collection: SPECIAL_DAYS_SLUG,
    overrideAccess: false,
    depth: 0,
    locale: 'it',
    ...(user ? { user } : {}),
    data: data as never,
  })
}

type MenuProbeCounts = { specialDays: number; fixedMenus: number }

async function countMenuProbeCollections(payload: PayloadInstance): Promise<MenuProbeCounts> {
  const [specialDays, fixedMenus] = await Promise.all([
    payload.find({
      collection: SPECIAL_DAYS_SLUG,
      depth: 0,
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: FIXED_MENUS_SLUG,
      depth: 0,
      limit: 0,
      overrideAccess: true,
    }),
  ])
  return { specialDays: specialDays.totalDocs, fixedMenus: fixedMenus.totalDocs }
}

function logMenuProbeCounts(label: string, counts: MenuProbeCounts): void {
  console.log(
    `${label} special-days=${counts.specialDays} fixed-menus=${counts.fixedMenus}`,
  )
}

async function expectSpecialDayCreateFailsValidation(
  payload: PayloadInstance,
  data: Record<string, unknown>,
  label: string,
): Promise<void> {
  try {
    await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: data as never,
    })
    throw new Error(`${label}: atteso ValidationError, create riuscita`)
  } catch (error) {
    if (!isValidationError(error)) {
      throw error
    }
    console.log(`OK: ${label} → ValidationError`)
  }
}

async function main(): Promise<void> {
  assertDevDatabaseFromEnv()
  const payload = await getPayload({ config })

  const createdDocIds: CreatedDocRef[] = []
  const createdUserIds: Array<number | string> = []
  const createdSpecialDayIds: Array<number | string> = []

  async function createUser(data: {
    email: string
    adminRole: User['adminRole']
    appRole: User['appRole']
    withLocalPassword?: boolean
  }): Promise<User> {
    const doc = await payload.create({
      collection: 'users',
      overrideAccess: true,
      depth: 0,
      data: {
        email: data.email,
        adminRole: data.adminRole,
        appRole: data.appRole,
        loginMethod: data.withLocalPassword ? 'local' : 'sso',
        active: true,
        emailVerified: true,
        ...(data.withLocalPassword
          ? { password: TEST_PASSWORD, passwordConfirm: TEST_PASSWORD }
          : {}),
      },
    })
    createdUserIds.push(doc.id)
    return doc as User
  }

  async function cleanup(): Promise<void> {
    for (const id of [...createdSpecialDayIds].reverse()) {
      try {
        await payload.delete({ collection: SPECIAL_DAYS_SLUG, id, overrideAccess: true, depth: 0 })
      } catch {
        /* best effort */
      }
    }
    createdSpecialDayIds.length = 0
    for (const { collection, id } of [...createdDocIds].reverse()) {
      try {
        await payload.delete({ collection, id, overrideAccess: true, depth: 0 })
      } catch {
        /* best effort */
      }
    }
    createdDocIds.length = 0
    for (const id of [...createdUserIds].reverse()) {
      await payload.delete({ collection: 'users', id, overrideAccess: true, depth: 0 })
    }
    createdUserIds.length = 0
  }

  const hashBefore = await fingerprintImportCollections(payload)
  const combinedBefore = combinedImportFingerprintHash(hashBefore)
  console.log(`HASH_IMPORT_PRIMA combined=${combinedBefore}`)

  const countsBeforeVerify = await countMenuProbeCollections(payload)
  logMenuProbeCounts('CONTEGGI_PRIMA', countsBeforeVerify)

  let countsAfterVerify: MenuProbeCounts | undefined

  try {
    const fixtureIds = await buildFixtures(payload, createdDocIds)

    const noRoleBase = await createUser({
      email: `${TEST_EMAIL_PREFIX}norole@test.local`,
      adminRole: 'none',
      appRole: 'manager',
      withLocalPassword: true,
    })
    const noRole = (await payload.update({
      collection: 'users',
      id: noRoleBase.id,
      overrideAccess: true,
      depth: 0,
      data: { appRole: 'none' },
    })) as User

    const managerCmsOnly = await createUser({
      email: `${TEST_EMAIL_PREFIX}cms@test.local`,
      adminRole: 'manager',
      appRole: 'none',
    })
    const managerApp = await createUser({
      email: `${TEST_EMAIL_PREFIX}app@test.local`,
      adminRole: 'none',
      appRole: 'manager',
      withLocalPassword: true,
    })
    const managerBoth = await createUser({
      email: `${TEST_EMAIL_PREFIX}both@test.local`,
      adminRole: 'manager',
      appRole: 'manager',
    })
    const adminUser = await createUser({
      email: `${TEST_EMAIL_PREFIX}admin@test.local`,
      adminRole: 'admin',
      appRole: 'none',
    })
    const superAdmin = await createUser({
      email: `${TEST_EMAIL_PREFIX}super@test.local`,
      adminRole: 'super-admin',
      appRole: 'none',
    })

    const probeSpecialDay = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: minimalSpecialDayData(fixtureIds, { date: '2030-01-10', scope: 'lunch' }) as never,
    })
    createdSpecialDayIds.push(probeSpecialDay.id)

    console.log('--- Permessi Local API (special-days) ---')
    const readRoles: Array<{ label: string; user: User | undefined; allow: boolean }> = [
      { label: 'anonimo', user: undefined, allow: true },
      { label: 'noRole', user: noRole, allow: false },
      { label: 'managerApp', user: managerApp, allow: true },
      { label: 'managerCmsSenzaApp', user: managerCmsOnly, allow: false },
      { label: 'managerCmsConApp', user: managerBoth, allow: true },
      { label: 'admin', user: adminUser, allow: true },
      { label: 'super-admin', user: superAdmin, allow: true },
    ]

    for (const role of readRoles) {
      try {
        await payload.find({
          collection: SPECIAL_DAYS_SLUG,
          overrideAccess: false,
          depth: 0,
          limit: 1,
          locale: 'it',
          ...(role.user ? { user: role.user } : {}),
        })
        if (!role.allow) {
          throw new Error(`${role.label} read: atteso 403`)
        }
        console.log(`OK: ${role.label} read special-days`)
      } catch (error) {
        if (role.allow || !isAccessDenied(error)) {
          throw error
        }
        console.log(`OK: ${role.label} read special-days negata (403)`)
      }
    }

    for (const role of [
      { label: 'anonimo', user: undefined },
      { label: 'noRole', user: noRole },
      { label: 'managerCmsSenzaApp', user: managerCmsOnly },
    ]) {
      try {
        await tryCreateSpecialDay(payload, minimalSpecialDayData(fixtureIds, { date: '2030-02-01' }), role.user)
        throw new Error(`${role.label} create: atteso 403`)
      } catch (error) {
        if (!isAccessDenied(error)) {
          throw error
        }
        await assertDocExistsAfterDeny(payload, probeSpecialDay.id)
        console.log(`OK: ${role.label} create negata; probe ancora presente`)
      }
    }

    const managerCreated = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: false,
      depth: 0,
      locale: 'it',
      user: managerApp,
      data: minimalSpecialDayData(fixtureIds, { date: '2030-02-02' }) as never,
    })
    createdSpecialDayIds.push(managerCreated.id)
    console.log('OK: managerApp create special-days')

    for (const role of [
      { label: 'anonimo', user: undefined, allow: false },
      { label: 'managerApp', user: managerApp, allow: true },
      { label: 'admin', user: adminUser, allow: true },
    ]) {
      try {
        await payload.update({
          collection: SPECIAL_DAYS_SLUG,
          id: probeSpecialDay.id,
          overrideAccess: false,
          depth: 0,
          locale: 'it',
          ...(role.user ? { user: role.user } : {}),
          data: { scope: 'dinner' },
        })
        if (!role.allow) {
          throw new Error(`${role.label} update: atteso 403`)
        }
        console.log(`OK: ${role.label} update special-days`)
      } catch (error) {
        if (role.allow || !isAccessDenied(error)) {
          throw error
        }
        console.log(`OK: ${role.label} update negata (403)`)
      }
    }

    const deleteProbeAdmin = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: minimalSpecialDayData(fixtureIds, { date: '2030-03-01' }) as never,
    })
    createdSpecialDayIds.push(deleteProbeAdmin.id)

    const deleteProbeSuper = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: minimalSpecialDayData(fixtureIds, { date: '2030-03-02' }) as never,
    })
    createdSpecialDayIds.push(deleteProbeSuper.id)

    try {
      await payload.delete({
        collection: SPECIAL_DAYS_SLUG,
        id: probeSpecialDay.id,
        overrideAccess: false,
        depth: 0,
        user: managerApp,
      })
      throw new Error('managerApp delete: atteso 403')
    } catch (error) {
      if (!isAccessDenied(error)) {
        throw error
      }
      await assertDocExistsAfterDeny(payload, probeSpecialDay.id)
      console.log('OK: managerApp delete negata; documento probe ancora presente')
    }

    await payload.delete({
      collection: SPECIAL_DAYS_SLUG,
      id: deleteProbeAdmin.id,
      overrideAccess: false,
      depth: 0,
      user: adminUser,
    })
    createdSpecialDayIds.splice(createdSpecialDayIds.indexOf(deleteProbeAdmin.id), 1)
    console.log('OK: admin delete special-days')

    await payload.delete({
      collection: SPECIAL_DAYS_SLUG,
      id: deleteProbeSuper.id,
      overrideAccess: false,
      depth: 0,
      user: superAdmin,
    })
    createdSpecialDayIds.splice(createdSpecialDayIds.indexOf(deleteProbeSuper.id), 1)
    console.log('OK: super-admin delete special-days')

    console.log('--- Date ---')
    const d1 = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: minimalSpecialDayData(fixtureIds, { date: '2026-02-14', scope: 'dinner' }) as never,
    })
    createdSpecialDayIds.push(d1.id)
    if (d1.date !== '2026-02-14T12:00:00.000Z') {
      throw new Error(`date YYYY-MM-DD: atteso 2026-02-14T12:00:00.000Z, ${d1.date}`)
    }
    console.log('OK: 2026-02-14 → 2026-02-14T12:00:00.000Z')

    const d2 = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: minimalSpecialDayData(fixtureIds, {
        date: '2026-02-15T12:00:00.000Z',
        scope: 'lunch',
      }) as never,
    })
    createdSpecialDayIds.push(d2.id)
    if (d2.date !== '2026-02-15T12:00:00.000Z') {
      throw new Error(`date noon UTC: atteso invariato, ${d2.date}`)
    }
    console.log('OK: T12:00:00.000Z → invariato')

    await expectSpecialDayCreateFailsValidation(
      payload,
      minimalSpecialDayData(fixtureIds, { date: '2026-02-14T23:00:00.000Z' }),
      '2026-02-14T23:00:00.000Z rifiutato',
    )

    console.log('--- content.fixedMenus obbligatorio ---')
    await expectSpecialDayCreateFailsValidation(
      payload,
      {
        date: '2030-04-01',
        scope: 'dinner',
        content: { fixedMenus: [] },
      },
      'fixedMenus elenco vuoto',
    )
    await expectSpecialDayCreateFailsValidation(
      payload,
      {
        date: '2030-04-02',
        scope: 'dinner',
        content: {},
      },
      'fixedMenus assente',
    )

    console.log('--- Sovrapposizione ---')
    const overlapDate = '2030-05-20'
    const dayDoc = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: minimalSpecialDayData(fixtureIds, { date: overlapDate, scope: 'day' }) as never,
    })
    createdSpecialDayIds.push(dayDoc.id)

    try {
      await payload.create({
        collection: SPECIAL_DAYS_SLUG,
        overrideAccess: true,
        depth: 0,
        locale: 'it',
        data: minimalSpecialDayData(fixtureIds, { date: overlapDate, scope: 'lunch' }) as never,
      })
      throw new Error('day+lunch stessa data: atteso rifiuto')
    } catch (error) {
      if (!isValidationError(error)) {
        throw error
      }
      const validation = error as ValidationError
      const overlapMsg = validation.data.errors.some((e) => e.message === SPECIAL_DAY_OVERLAP_MESSAGE)
      if (!overlapMsg) {
        throw new Error(
          `messaggio overlap inatteso: ${validation.data.errors.map((e) => e.message).join('; ')}`,
        )
      }
      console.log('OK: day + lunch stessa data rifiutata')
    }

    const lunchDoc = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: minimalSpecialDayData(fixtureIds, { date: '2030-05-21', scope: 'lunch' }) as never,
    })
    createdSpecialDayIds.push(lunchDoc.id)
    const dinnerSame = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: minimalSpecialDayData(fixtureIds, { date: '2030-05-21', scope: 'dinner' }) as never,
    })
    createdSpecialDayIds.push(dinnerSame.id)
    console.log('OK: lunch + dinner stessa data accettati')

    try {
      const firstDupDay = await payload.create({
        collection: SPECIAL_DAYS_SLUG,
        overrideAccess: true,
        depth: 0,
        locale: 'it',
        data: minimalSpecialDayData(fixtureIds, { date: '2030-05-22', scope: 'day' }) as never,
      })
      createdSpecialDayIds.push(firstDupDay.id)
      maybeInjectControlledFailure('after-two-day-first-6_3')
      await payload.create({
        collection: SPECIAL_DAYS_SLUG,
        overrideAccess: true,
        depth: 0,
        locale: 'it',
        data: minimalSpecialDayData(fixtureIds, { date: '2030-05-22', scope: 'day' }) as never,
      })
      throw new Error('due day: atteso rifiuto')
    } catch (error) {
      if (!isValidationError(error)) {
        throw error
      }
      console.log('OK: due day stessa data rifiutati')
    }

    await payload.update({
      collection: SPECIAL_DAYS_SLUG,
      id: lunchDoc.id,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: { content: { fixedMenus: [asNumericId(fixtureIds.fixedMenuId)] } },
    })
    console.log('OK: update senza cambiare data/ambito accettata')

    const disabledOverlap = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: minimalSpecialDayData(fixtureIds, {
        date: '2030-05-23',
        scope: 'day',
        disabled: true,
      }) as never,
    })
    createdSpecialDayIds.push(disabledOverlap.id)
    const activeSameSlot = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: minimalSpecialDayData(fixtureIds, { date: '2030-05-23', scope: 'lunch' }) as never,
    })
    createdSpecialDayIds.push(activeSameSlot.id)
    console.log('OK: disabled day non blocca lunch sulla stessa data')

    try {
      await payload.update({
        collection: SPECIAL_DAYS_SLUG,
        id: disabledOverlap.id,
        overrideAccess: true,
        depth: 0,
        locale: 'it',
        data: { disabled: false },
      })
      throw new Error('riabilitare day con lunch attivo: atteso rifiuto')
    } catch (error) {
      if (!isValidationError(error)) {
        throw error
      }
      console.log('OK: riabilitazione day in conflitto rifiutata')
    }

    console.log('--- specialOnly ---')
    const freshMenu = await payload.create({
      collection: FIXED_MENUS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: {
        name: `DefaultOnly ${TEST_RUN_ID}`,
        price: 1,
        category: asNumericId(fixtureIds.fixedCategoryId),
        visibility: 'always',
        dishes: [{ dish: asNumericId(fixtureIds.dishId) }],
      },
    })
    trackCreated(createdDocIds, FIXED_MENUS_SLUG, freshMenu.id)
    if (freshMenu.specialOnly !== false) {
      throw new Error(`specialOnly default: atteso false, ${String(freshMenu.specialOnly)}`)
    }
    console.log('OK: specialOnly default false su menu nuovo')

    console.log('--- San Valentino (prova) ---')
    const valentineMenu = await payload.create({
      collection: FIXED_MENUS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: {
        name: `San Valentino ${TEST_RUN_ID}`,
        price: 80,
        category: asNumericId(fixtureIds.fixedCategoryId),
        visibility: 'dinner_only',
        specialOnly: true,
        dishes: [{ dish: asNumericId(fixtureIds.dishId), portion: 'Menu coppia' }],
      },
    })
    trackCreated(createdDocIds, FIXED_MENUS_SLUG, valentineMenu.id)

    const valentineDay = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: {
        date: '2027-02-14',
        scope: 'dinner',
        content: {
          fixedMenus: [asNumericId(valentineMenu.id)],
          message: 'Solo IT banner',
        },
      },
    })
    createdSpecialDayIds.push(valentineDay.id)

    const valentineEn = await payload.findByID({
      collection: SPECIAL_DAYS_SLUG,
      id: valentineDay.id,
      depth: 2,
      locale: 'en',
      overrideAccess: true,
    })
    const msgIt = (valentineDay.content as { message?: string })?.message
    const msgEn = (valentineEn.content as { message?: string })?.message
    if (msgIt !== 'Solo IT banner') {
      throw new Error('message IT inatteso')
    }
    if (msgEn !== 'Solo IT banner') {
      throw new Error('message EN con ripiego: atteso IT')
    }
    const valentineEnNone = await payload.findByID({
      collection: SPECIAL_DAYS_SLUG,
      id: valentineDay.id,
      depth: 0,
      locale: 'en',
      fallbackLocale: false,
      overrideAccess: true,
    })
    const msgEnNone = (valentineEnNone.content as { message?: string | null })?.message
    if (msgEnNone != null && msgEnNone !== '') {
      throw new Error('message EN fallbackLocale false doveva essere vuoto')
    }
    console.log('OK: message localizzato (ripiego / none)')

    console.log('--- Cancellazione menu fisso referenziato (admin) ---')
    const menuForDelete = await payload.create({
      collection: FIXED_MENUS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: {
        name: `DaCancellare ${TEST_RUN_ID}`,
        price: 30,
        category: asNumericId(fixtureIds.fixedCategoryId),
        visibility: 'always',
        dishes: [{ dish: asNumericId(fixtureIds.dishId) }],
      },
    })
    trackCreated(createdDocIds, FIXED_MENUS_SLUG, menuForDelete.id)

    const dayWithMenu = await payload.create({
      collection: SPECIAL_DAYS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: minimalSpecialDayData(fixtureIds, {
        date: '2030-07-01',
        fixedMenuIds: [menuForDelete.id],
      }) as never,
    })
    createdSpecialDayIds.push(dayWithMenu.id)

    await payload.delete({
      collection: FIXED_MENUS_SLUG,
      id: menuForDelete.id,
      overrideAccess: false,
      depth: 0,
      user: adminUser,
    })
    createdDocIds.splice(
      createdDocIds.findIndex((r) => r.collection === FIXED_MENUS_SLUG && r.id === menuForDelete.id),
      1,
    )

    const afterDelete = await payload.findByID({
      collection: SPECIAL_DAYS_SLUG,
      id: dayWithMenu.id,
      depth: 2,
      overrideAccess: true,
      locale: 'it',
    })
    const menusAfter = (afterDelete.content as { fixedMenus?: unknown[] })?.fixedMenus
    const menuCount = Array.isArray(menusAfter) ? menusAfter.length : -1
    console.log(
      `OSSERVATO: dopo delete admin del menu fisso, special-day content.fixedMenus length=${menuCount} (atteso 0 se cascade sulla rel)`,
    )

    console.log('--- Cancellazione allergene referenziato (punto aperto) ---')
    const allergenProbe = await payload.create({
      collection: ALLERGENS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: { name: `AllergeneDel ${TEST_RUN_ID}` },
    })
    trackCreated(createdDocIds, ALLERGENS_SLUG, allergenProbe.id)

    const dishWithAllergen = await payload.create({
      collection: DISHES_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: {
        name: `PiattoAllergene ${TEST_RUN_ID}`,
        price: 5,
        category: asNumericId(fixtureIds.dishCategoryId),
        allergens: [asNumericId(allergenProbe.id)],
      },
    })
    trackCreated(createdDocIds, DISHES_SLUG, dishWithAllergen.id)

    await payload.delete({
      collection: ALLERGENS_SLUG,
      id: allergenProbe.id,
      overrideAccess: false,
      depth: 0,
      user: adminUser,
    })
    createdDocIds.splice(
      createdDocIds.findIndex((r) => r.collection === ALLERGENS_SLUG && r.id === allergenProbe.id),
      1,
    )

    const dishAfterAllergenDelete = await payload.findByID({
      collection: DISHES_SLUG,
      id: dishWithAllergen.id,
      depth: 2,
      overrideAccess: true,
      locale: 'it',
    })
    const allergensAfter = dishAfterAllergenDelete.allergens
    const allergenListLen = Array.isArray(allergensAfter) ? allergensAfter.length : -1
    console.log(
      `OSSERVATO: dopo delete admin allergene, piatto allergens length=${allergenListLen}`,
    )

    console.log('--- REST (pnpm dev) ---')
    let restOk = false
    try {
      const ping = await restFetchAnon(`/api/${SPECIAL_DAYS_SLUG}?locale=it&limit=1`, 'GET')
      restOk = ping.ok
    } catch {
      restOk = false
    }

    if (!restOk) {
      console.log('NON ESEGUITO: REST — avviare pnpm dev su vma_vd_dev')
    } else {
      const restDisabled = await payload.create({
        collection: SPECIAL_DAYS_SLUG,
        overrideAccess: true,
        depth: 0,
        locale: 'it',
        data: minimalSpecialDayData(fixtureIds, { date: '2030-08-01', disabled: true }) as never,
      })
      createdSpecialDayIds.push(restDisabled.id)

      const getRes = await restFetchAnon(`/api/${SPECIAL_DAYS_SLUG}?locale=it&limit=200&depth=0`, 'GET')
      if (getRes.status !== 200) {
        throw new Error(`REST GET special-days: ${getRes.status}`)
      }
      expectAnonRestWriteStatus('POST', await restFetchAnon(`/api/${SPECIAL_DAYS_SLUG}`, 'POST', {}))
      expectAnonRestWriteStatus(
        'PATCH',
        await restFetchAnon(`/api/${SPECIAL_DAYS_SLUG}/${probeSpecialDay.id}`, 'PATCH', {}),
      )
      expectAnonRestWriteStatus(
        'DELETE',
        await restFetchAnon(`/api/${SPECIAL_DAYS_SLUG}/${probeSpecialDay.id}`, 'DELETE'),
      )

      await getRes.json()
      const disabledGet = await restFetchAnon(
        `/api/${SPECIAL_DAYS_SLUG}/${restDisabled.id}?locale=it&depth=0`,
        'GET',
      )
      if (disabledGet.status !== 200) {
        throw new Error(`REST GET special-day disabled: ${disabledGet.status}`)
      }
      const disabledBody = (await disabledGet.json()) as { disabled?: boolean }
      if (disabledBody.disabled !== true) {
        throw new Error('REST: voce disabled:true non restituita in GET anonimo')
      }
      console.log('OK: REST anonima GET 200, write 403, disabled incluso')

      const threshold = todayRomeAsSpecialDayDate()
      const futureRes = await restFetchAnon(
        `/api/${SPECIAL_DAYS_SLUG}?locale=it&limit=100&where[date][greater_than_equal]=${encodeURIComponent(threshold)}`,
        'GET',
      )
      if (!futureRes.ok) {
        throw new Error(`REST filtro future: ${futureRes.status}`)
      }
      const futureBody = (await futureRes.json()) as { docs: Array<{ date?: string }> }
      for (const doc of futureBody.docs) {
        if (doc.date && doc.date < threshold) {
          throw new Error(`REST filtro future: doc ${doc.date} < ${threshold}`)
        }
      }
      console.log(`OK: REST where[date][greater_than_equal]=${threshold}`)

      const depthRes = await restFetchAnon(
        `/api/${SPECIAL_DAYS_SLUG}/${valentineDay.id}?locale=it&depth=3`,
        'GET',
      )
      if (!depthRes.ok) {
        throw new Error(`REST depth=3: ${depthRes.status}`)
      }
      const depthBody = (await depthRes.json()) as {
        content?: {
          fixedMenus?: Array<{
            dishes?: Array<{ dish?: { allergens?: Array<{ name?: string }> } }>
          }>
        }
      }
      const fm = depthBody.content?.fixedMenus?.[0]
      const allergenName = fm?.dishes?.[0]?.dish?.allergens?.[0]?.name
      if (!fm?.dishes?.[0]?.dish || allergenName == null) {
        throw new Error('REST depth=3: menu fisso / piatto / allergene non popolati')
      }
      console.log(`OK: REST depth=3 (allergene nome=${allergenName})`)

      const fixedRest = await restFetchAnon(
        `/api/${FIXED_MENUS_SLUG}/${freshMenu.id}?locale=it&depth=0`,
        'GET',
      )
      const fixedBody = (await fixedRest.json()) as { specialOnly?: boolean }
      if (fixedBody.specialOnly !== false) {
        throw new Error('REST fixed-menus specialOnly')
      }
      console.log('OK: REST fixed-menus espone specialOnly')
    }

    await payload.delete({
      collection: SPECIAL_DAYS_SLUG,
      id: valentineDay.id,
      overrideAccess: true,
      depth: 0,
    })
    createdSpecialDayIds.splice(createdSpecialDayIds.indexOf(valentineDay.id), 1)
    await payload.delete({
      collection: FIXED_MENUS_SLUG,
      id: valentineMenu.id,
      overrideAccess: true,
      depth: 0,
    })
    createdDocIds.splice(
      createdDocIds.findIndex((r) => r.collection === FIXED_MENUS_SLUG && r.id === valentineMenu.id),
      1,
    )
    console.log('OK: documenti San Valentino di prova rimossi')
  } finally {
    await cleanup()
    countsAfterVerify = await countMenuProbeCollections(payload)
    logMenuProbeCounts('CONTEGGI_DOPO', countsAfterVerify)
  }

  if (
    countsAfterVerify === undefined ||
    countsAfterVerify.specialDays !== countsBeforeVerify.specialDays ||
    countsAfterVerify.fixedMenus !== countsBeforeVerify.fixedMenus
  ) {
    throw new Error(
      `Conteggi special-days/fixed-menus non ripristinati: prima=${countsBeforeVerify.specialDays}/${countsBeforeVerify.fixedMenus} dopo=${countsAfterVerify?.specialDays ?? '?'}/${countsAfterVerify?.fixedMenus ?? '?'}`,
    )
  }
  console.log('OK: conteggi special-days e fixed-menus invariati (prima/dopo verify)')

  const payloadAfter = await getPayload({ config })
  try {
    const hashAfter = await fingerprintImportCollections(payloadAfter)
    const combinedAfter = combinedImportFingerprintHash(hashAfter)
    console.log(`HASH_IMPORT_DOPO combined=${combinedAfter}`)
    if (combinedAfter !== combinedBefore) {
      throw new Error('Hash import cambiato dopo verify 6.3')
    }
    console.log('OK: hash import invariato (prima/dopo verify 6.3)')
  } finally {
    await payloadAfter.destroy()
  }
}

async function assertDocExistsAfterDeny(payload: PayloadInstance, id: number | string): Promise<void> {
  await payload.findByID({
    collection: SPECIAL_DAYS_SLUG,
    id,
    depth: 0,
    overrideAccess: true,
    locale: 'it',
  })
}

try {
  await main()
  console.log('Verifica 6.3 completata.')
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Verifica 6.3 non riuscita: ${message}`)
  process.exit(1)
}
