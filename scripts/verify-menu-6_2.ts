/**
 * Verifica fase 6.2: collection contenuti menù, permessi, REST, locale, menu fisso, vini.
 *
 *   pnpm verify:menu-6_2
 * Usa vma_vd_dev (DATABASE_URL da .env). REST: `pnpm dev` su APP_PUBLIC_URL.
 */
import config from '@payload-config'
import { APIError, type CollectionSlug, getPayload, ValidationError } from 'payload'

import {
  type MenuContentSlug,
  APPELLATIONS_SLUG,
  COUNTRIES_SLUG,
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  DRINK_TYPES_SLUG,
  DRINKS_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
  MENU_CONTENT_SLUGS,
  MENU_SERVICES_SLUG,
  REGIONS_SLUG,
  SPIRIT_TYPES_SLUG,
  SPIRITS_SLUG,
  WINE_TYPES_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'
import type { User } from '@/payload-types'

import { runMenuTaxonomiesSeed } from './seed-menu-taxonomies'

const TEST_RUN_ID = Date.now().toString(36)
const TEST_EMAIL_PREFIX = `verify-6_2-${TEST_RUN_ID}-`
const TEST_PASSWORD = 'Verify6_2!AaBbCc'

type PayloadInstance = Awaited<ReturnType<typeof getPayload>>

type FixtureIds = {
  dishCategoryId: number | string
  dishId: number | string
  dishDisabledId: number | string
  wineTypeId: number | string
  drinkTypeId: number | string
  spiritTypeId: number | string
  italyId: number | string
  franceId: number | string
  fvgId: number | string
  sicilyId: number | string
  carsoId: number | string
  wineCoherentId: number | string
  fixedCategoryId: number | string
  menuServiceId: number | string
  fixedMenuId: number | string
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

function validationHasPath(error: unknown, path: string): boolean {
  if (!isValidationError(error)) {
    return false
  }
  const validation = error as ValidationError
  return validation.data.errors.some((fieldError) => fieldError.path === path)
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

async function tryCollectionRead(
  payload: PayloadInstance,
  slug: CollectionSlug,
  user: User | undefined,
): Promise<void> {
  await payload.find({
    collection: slug,
    overrideAccess: false,
    depth: 0,
    limit: 1,
    locale: 'it',
    ...(user ? { user } : {}),
  })
}

async function expectCollectionRead(
  payload: PayloadInstance,
  slug: CollectionSlug,
  user: User | undefined,
  allow: boolean,
  roleLabel: string,
): Promise<void> {
  try {
    await tryCollectionRead(payload, slug, user)
    if (!allow) {
      throw new Error(`${roleLabel} read ${slug}: atteso 403, ottenuto OK`)
    }
    console.log(`OK: ${roleLabel} read ${slug}`)
  } catch (error) {
    if (allow) {
      throw error
    }
    if (!isAccessDenied(error)) {
      throw error
    }
    console.log(`OK: ${roleLabel} read ${slug} negata (403)`)
  }
}

async function expectCollectionCreate(
  payload: PayloadInstance,
  slug: CollectionSlug,
  user: User | undefined,
  data: Record<string, unknown>,
  allow: boolean,
  roleLabel: string,
): Promise<void> {
  try {
    await payload.create({
      collection: slug,
      overrideAccess: false,
      depth: 0,
      draft: false,
      ...(localeForContentSlug(slug) ? { locale: 'it' as const } : {}),
      ...(user ? { user } : {}),
      data: data as never,
    })
    if (!allow) {
      throw new Error(`${roleLabel} create ${slug}: atteso 403, ottenuto OK`)
    }
    console.log(`OK: ${roleLabel} create ${slug}`)
  } catch (error) {
    if (allow) {
      throw error
    }
    if (!isAccessDenied(error)) {
      throw error
    }
    console.log(`OK: ${roleLabel} create ${slug} negata (403)`)
  }
}

async function expectCollectionUpdate(
  payload: PayloadInstance,
  slug: CollectionSlug,
  id: number | string,
  user: User | undefined,
  data: Record<string, unknown>,
  allow: boolean,
  roleLabel: string,
  locale?: 'it',
): Promise<void> {
  try {
    await payload.update({
      collection: slug,
      id,
      overrideAccess: false,
      depth: 0,
      ...(locale ? { locale } : {}),
      ...(user ? { user } : {}),
      data: data as never,
    })
    if (!allow) {
      throw new Error(`${roleLabel} update ${slug}: atteso 403, ottenuto OK`)
    }
    console.log(`OK: ${roleLabel} update ${slug}`)
  } catch (error) {
    if (allow) {
      throw error
    }
    if (!isAccessDenied(error)) {
      throw error
    }
    console.log(`OK: ${roleLabel} update ${slug} negata (403)`)
  }
}

async function assertDocExists(
  payload: PayloadInstance,
  slug: CollectionSlug,
  id: number | string,
): Promise<void> {
  await payload.findByID({
    collection: slug,
    id,
    depth: 0,
    overrideAccess: true,
    ...(localeForContentSlug(slug) ? { locale: 'it' as const } : {}),
  })
}

function localeForContentSlug(slug: CollectionSlug): boolean {
  if (!(MENU_CONTENT_SLUGS as readonly string[]).includes(slug)) {
    return false
  }
  return slug !== WINES_SLUG && slug !== SPIRITS_SLUG
}

async function expectCollectionDelete(
  payload: PayloadInstance,
  slug: CollectionSlug,
  id: number | string,
  user: User | undefined,
  allow: boolean,
  roleLabel: string,
): Promise<void> {
  try {
    await payload.delete({
      collection: slug,
      id,
      overrideAccess: false,
      depth: 0,
      ...(user ? { user } : {}),
    })
    if (!allow) {
      throw new Error(`${roleLabel} delete ${slug}: atteso 403, ottenuto OK`)
    }
    console.log(`OK: ${roleLabel} delete ${slug}`)
  } catch (error) {
    if (allow) {
      throw error
    }
    if (!isAccessDenied(error)) {
      throw error
    }
    console.log(`OK: ${roleLabel} delete ${slug} negata (403)`)
  }
}

async function seedTaxonomiesIfNeeded(payload: PayloadInstance): Promise<void> {
  const countries = await payload.find({
    collection: COUNTRIES_SLUG,
    depth: 0,
    limit: 1,
    overrideAccess: true,
  })
  if (countries.totalDocs === 0) {
    await runMenuTaxonomiesSeed(payload)
    console.log('OK: seed tassonomie eseguito su DB dev')
  }
}

async function buildFixtures(payload: PayloadInstance): Promise<FixtureIds> {
  const tag = `6_2 ${TEST_RUN_ID}`

  const dishCategory = await payload.create({
    collection: DISH_CATEGORIES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: { name: `Cat ${tag}` },
  })

  const dish = await payload.create({
    collection: DISHES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: {
      name: `Piatto ${tag}`,
      description: 'Solo IT',
      price: 12,
      category: dishCategory.id,
    },
  })

  const dishDisabled = await payload.create({
    collection: DISHES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: {
      name: `Piatto off ${tag}`,
      price: 1,
      category: dishCategory.id,
      disabled: true,
    },
  })

  const wineType = await payload.create({
    collection: WINE_TYPES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: { name: `Vino tipo ${tag}` },
  })

  const drinkType = await payload.create({
    collection: DRINK_TYPES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: { name: `Bevanda tipo ${tag}` },
  })

  const spiritType = await payload.create({
    collection: SPIRIT_TYPES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: { name: `Spirit tipo ${tag}` },
  })

  const italy = await payload.find({
    collection: COUNTRIES_SLUG,
    locale: 'it',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { name: { equals: 'Italia' } },
  })
  const france = await payload.find({
    collection: COUNTRIES_SLUG,
    locale: 'it',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { name: { equals: 'Francia' } },
  })
  const fvg = await payload.find({
    collection: REGIONS_SLUG,
    locale: 'it',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { name: { equals: 'Friuli Venezia Giulia' } },
  })
  const sicily = await payload.find({
    collection: REGIONS_SLUG,
    locale: 'it',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { name: { equals: 'Sicilia' } },
  })
  const carso = await payload.find({
    collection: APPELLATIONS_SLUG,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { name: { equals: 'Carso' } },
  })

  const italyId = italy.docs[0]?.id
  const franceId = france.docs[0]?.id
  const fvgId = fvg.docs[0]?.id
  const sicilyId = sicily.docs[0]?.id
  const carsoId = carso.docs[0]?.id
  if (italyId == null || franceId == null || fvgId == null || sicilyId == null || carsoId == null) {
    throw new Error('Seed geografia incompleto (Italia/Francia/FVG/Sicilia/Carso)')
  }

  const wineCoherent = await payload.create({
    collection: WINES_SLUG,
    overrideAccess: true,
    depth: 0,
    data: {
      name: `Vino geo ${tag}`,
      price: 20,
      country: italyId,
      region: fvgId,
      appellation: carsoId,
      type: wineType.id,
    },
  })

  await payload.create({
    collection: SPIRITS_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: {
      name: `Spirit ${tag}`,
      price: 8,
      country: italyId,
      type: spiritType.id,
    },
  })

  await payload.create({
    collection: DRINKS_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: {
      name: `Bevanda ${tag}`,
      price: 4,
      type: drinkType.id,
    },
  })

  await payload.create({
    collection: MENU_SERVICES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: { name: `Servizio ${tag}`, price: 2 },
  })

  const fixedCategory = await payload.create({
    collection: FIXED_MENU_CATEGORIES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: { name: `Cat menu ${tag}`, visibility: 'lunch_only' },
  })

  const menuService = await payload.create({
    collection: MENU_SERVICES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: { name: `Coperto ${tag}`, price: 3 },
  })

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
      dishes: [{ dish: dish.id, portion: 'Porzione IT' }],
      services: [menuService.id],
    },
  })

  return {
    dishCategoryId: dishCategory.id,
    dishId: dish.id,
    dishDisabledId: dishDisabled.id,
    wineTypeId: wineType.id,
    drinkTypeId: drinkType.id,
    spiritTypeId: spiritType.id,
    italyId,
    franceId,
    fvgId,
    sicilyId,
    carsoId,
    wineCoherentId: wineCoherent.id,
    fixedCategoryId: fixedCategory.id,
    menuServiceId: menuService.id,
    fixedMenuId: fixedMenu.id,
  }
}

function minimalCreateForSlug(
  slug: CollectionSlug,
  fx: FixtureIds,
  label = 'Probe',
): Record<string, unknown> {
  const tag = `${label} ${TEST_RUN_ID}`
  switch (slug) {
    case DISHES_SLUG:
      return { name: tag, price: 1, category: fx.dishCategoryId }
    case WINES_SLUG:
      return { name: tag, price: 1, country: fx.italyId, type: fx.wineTypeId }
    case SPIRITS_SLUG:
      return { name: tag, price: 1, country: fx.italyId, type: fx.spiritTypeId }
    case DRINKS_SLUG:
      return { name: tag, price: 1, type: fx.drinkTypeId }
    case MENU_SERVICES_SLUG:
      return { name: tag, price: 1 }
    case FIXED_MENU_CATEGORIES_SLUG:
      return { name: tag, visibility: 'always' }
    case FIXED_MENUS_SLUG:
      return {
        name: tag,
        price: 1,
        category: fx.fixedCategoryId,
        visibility: 'always',
      }
    default:
      return { name: tag }
  }
}

function minimalUpdatePatch(slug: MenuContentSlug, doc: { disabled?: boolean | null }): Record<string, unknown> {
  if (slug === WINES_SLUG || slug === SPIRITS_SLUG) {
    return { disabled: doc.disabled !== true }
  }
  return { disabled: doc.disabled !== true }
}

async function createProbeDoc(
  payload: PayloadInstance,
  slug: MenuContentSlug,
  fx: FixtureIds,
  label: string,
  extra: Record<string, unknown> = {},
  createdDocIds: Array<{ collection: CollectionSlug; id: number | string }>,
): Promise<number | string> {
  const doc = await payload.create({
    collection: slug,
    overrideAccess: true,
    depth: 0,
    draft: false,
    ...(localeForContentSlug(slug) ? { locale: 'it' as const } : {}),
    data: { ...minimalCreateForSlug(slug, fx, label), ...extra } as never,
  })
  createdDocIds.push({ collection: slug, id: doc.id })
  return doc.id
}

async function main(): Promise<void> {
  const payload = await getPayload({ config })
  const createdUserIds: (number | string)[] = []
  const createdDocIds: Array<{ collection: CollectionSlug; id: number | string }> = []
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

  try {
    await seedTaxonomiesIfNeeded(payload)
    const fixtureIds = await buildFixtures(payload)
    createdDocIds.push(
      { collection: FIXED_MENUS_SLUG, id: fixtureIds.fixedMenuId },
      { collection: FIXED_MENU_CATEGORIES_SLUG, id: fixtureIds.fixedCategoryId },
      { collection: MENU_SERVICES_SLUG, id: fixtureIds.menuServiceId },
      { collection: WINES_SLUG, id: fixtureIds.wineCoherentId },
      { collection: DISHES_SLUG, id: fixtureIds.dishDisabledId },
      { collection: DISHES_SLUG, id: fixtureIds.dishId },
      { collection: DISH_CATEGORIES_SLUG, id: fixtureIds.dishCategoryId },
    )

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

    console.log('--- admin.hidden (config) ---')
    for (const slug of MENU_CONTENT_SLUGS) {
      const coll = payload.collections[slug]?.config
      if (!coll) {
        throw new Error(`Collection ${slug} non registrata`)
      }
      const hidden = coll.admin?.hidden
      if (typeof hidden !== 'function') {
        throw new Error(`${slug}: admin.hidden assente`)
      }
      const hideFn = hidden as (args: { user: unknown }) => boolean
      if (!hideFn({ user: managerCmsOnly })) {
        throw new Error(`${slug}: admin.hidden doveva nascondere manager CMS`)
      }
      console.log(`OK: admin.hidden ${slug}`)
    }
    console.log('NON PROVATO: visibilità voci Menù digitale nel browser Admin')

    const readRoles: Array<{ label: string; user: User | undefined; allow: boolean }> = [
      { label: 'anonimo', user: undefined, allow: true },
      { label: 'noRole', user: noRole, allow: false },
      { label: 'managerApp', user: managerApp, allow: true },
      { label: 'managerCmsSenzaApp', user: managerCmsOnly, allow: false },
      { label: 'managerCmsConApp', user: managerBoth, allow: true },
      { label: 'admin', user: adminUser, allow: true },
      { label: 'super-admin', user: superAdmin, allow: true },
    ]

    console.log('--- Lettura Local API (7 collection) ---')
    for (const role of readRoles) {
      for (const slug of MENU_CONTENT_SLUGS) {
        await expectCollectionRead(payload, slug, role.user, role.allow, role.label)
      }
    }

    console.log('--- Scrittura: create negata (anon / noRole / manager CMS senza app) ---')
    for (const role of [
      { label: 'anonimo', user: undefined },
      { label: 'noRole', user: noRole },
      { label: 'managerCmsSenzaApp', user: managerCmsOnly },
    ]) {
      for (const slug of MENU_CONTENT_SLUGS) {
        await expectCollectionCreate(
          payload,
          slug,
          role.user,
          minimalCreateForSlug(slug, fixtureIds),
          false,
          role.label,
        )
      }
    }

    console.log('--- Scrittura: create consentita (manager App) ---')
    for (const slug of MENU_CONTENT_SLUGS) {
      const created = await payload.create({
        collection: slug,
        overrideAccess: false,
        depth: 0,
        draft: false,
        ...(localeForContentSlug(slug) ? { locale: 'it' as const } : {}),
        user: managerApp,
        data: minimalCreateForSlug(slug, fixtureIds) as never,
      })
      createdDocIds.push({ collection: slug, id: created.id })
      console.log(`OK: managerApp create ${slug}`)
    }

    const updateProbes: Partial<Record<MenuContentSlug, number | string>> = {}
    console.log('--- Scrittura: update (probe per slug) ---')
    for (const slug of MENU_CONTENT_SLUGS) {
      updateProbes[slug] = await createProbeDoc(
        payload,
        slug,
        fixtureIds,
        'UpdProbe',
        {},
        createdDocIds,
      )
    }

    const updateRoles: Array<{ label: string; user: User | undefined; allow: boolean }> = [
      { label: 'anonimo', user: undefined, allow: false },
      { label: 'noRole', user: noRole, allow: false },
      { label: 'managerApp', user: managerApp, allow: true },
      { label: 'managerCmsSenzaApp', user: managerCmsOnly, allow: false },
      { label: 'managerCmsConApp', user: managerBoth, allow: true },
      { label: 'admin', user: adminUser, allow: true },
      { label: 'super-admin', user: superAdmin, allow: true },
    ]

    console.log('--- Scrittura: update per ruolo (7 profili × 7 collection) ---')
    for (const role of updateRoles) {
      for (const slug of MENU_CONTENT_SLUGS) {
        const probeId = updateProbes[slug]
        if (probeId == null) {
          throw new Error(`update probe mancante per ${slug}`)
        }
        const current = await payload.findByID({
          collection: slug,
          id: probeId,
          depth: 0,
          overrideAccess: true,
          ...(localeForContentSlug(slug) ? { locale: 'it' as const } : {}),
        })
        await expectCollectionUpdate(
          payload,
          slug,
          probeId,
          role.user,
          minimalUpdatePatch(slug, current),
          role.allow,
          role.label,
          localeForContentSlug(slug) ? 'it' : undefined,
        )
      }
    }

    const deleteDenyRoles: Array<{ label: string; user: User | undefined }> = [
      { label: 'anonimo', user: undefined },
      { label: 'noRole', user: noRole },
      { label: 'managerApp', user: managerApp },
      { label: 'managerCmsSenzaApp', user: managerCmsOnly },
      { label: 'managerCmsConApp', user: managerBoth },
    ]

    console.log('--- Cancellazione per ruolo (7 profili × 7 collection) ---')
    for (const slug of MENU_CONTENT_SLUGS) {
      const denyId = await createProbeDoc(payload, slug, fixtureIds, 'DelDeny', {}, createdDocIds)
      for (const role of deleteDenyRoles) {
        await expectCollectionDelete(payload, slug, denyId, role.user, false, role.label)
        await assertDocExists(payload, slug, denyId)
      }
      console.log(`OK: ${slug} delete negata per profili non staff; documento deny ancora presente`)

      const adminDelId = await createProbeDoc(payload, slug, fixtureIds, 'DelAdmin', {}, createdDocIds)
      await expectCollectionDelete(payload, slug, adminDelId, adminUser, true, 'admin')
      createdDocIds.splice(
        createdDocIds.findIndex((e) => e.collection === slug && e.id === adminDelId),
        1,
      )

      const superDelId = await createProbeDoc(
        payload,
        slug,
        fixtureIds,
        'DelSuper',
        {},
        createdDocIds,
      )
      await expectCollectionDelete(payload, slug, superDelId, superAdmin, true, 'super-admin')
      createdDocIds.splice(
        createdDocIds.findIndex((e) => e.collection === slug && e.id === superDelId),
        1,
      )

      await payload.delete({ collection: slug, id: denyId, overrideAccess: true, depth: 0 })
      createdDocIds.splice(
        createdDocIds.findIndex((e) => e.collection === slug && e.id === denyId),
        1,
      )
    }

    console.log('--- Scrittura: create consentita (manager CMS+App, admin, super-admin) ---')
    for (const role of [
      { label: 'managerCmsConApp', user: managerBoth },
      { label: 'admin', user: adminUser },
      { label: 'super-admin', user: superAdmin },
    ]) {
      for (const slug of MENU_CONTENT_SLUGS) {
        const created = await payload.create({
          collection: slug,
          overrideAccess: false,
          depth: 0,
          draft: false,
          ...(localeForContentSlug(slug) ? { locale: 'it' as const } : {}),
          user: role.user,
          data: minimalCreateForSlug(slug, fixtureIds, role.label) as never,
        })
        createdDocIds.push({ collection: slug, id: created.id })
        console.log(`OK: ${role.label} create ${slug}`)
      }
    }

    console.log('--- Coerenza vini ---')
    const borgogna = await payload.find({
      collection: REGIONS_SLUG,
      locale: 'it',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { name: { equals: 'Borgogna' } },
    })
    const borgognaId = borgogna.docs[0]?.id
    if (borgognaId == null) {
      throw new Error('Regione Borgogna mancante nel seed')
    }
    try {
      await payload.create({
        collection: WINES_SLUG,
        overrideAccess: true,
        depth: 0,
        data: {
          name: `Bad region ${TEST_RUN_ID}`,
          price: 1,
          country: asNumericId(fixtureIds.italyId),
          region: asNumericId(borgognaId),
          type: asNumericId(fixtureIds.wineTypeId),
        },
      })
      throw new Error('regione/paese incoerente: attesa ValidationError')
    } catch (error) {
      if (!validationHasPath(error, 'region')) {
        throw error
      }
    }
    console.log('OK: regione incoerente col paese rifiutata (path region)')

    try {
      await payload.create({
        collection: WINES_SLUG,
        overrideAccess: true,
        depth: 0,
        data: {
          name: `App no region ${TEST_RUN_ID}`,
          price: 1,
          country: asNumericId(fixtureIds.italyId),
          appellation: asNumericId(fixtureIds.carsoId),
          type: asNumericId(fixtureIds.wineTypeId),
        },
      })
      throw new Error('appellation senza region: attesa ValidationError')
    } catch (error) {
      if (!validationHasPath(error, 'appellation')) {
        throw error
      }
    }
    console.log('OK: denominazione senza regione rifiutata')

    try {
      await payload.create({
        collection: WINES_SLUG,
        overrideAccess: true,
        depth: 0,
        data: {
          name: `Bad app region ${TEST_RUN_ID}`,
          price: 1,
          country: asNumericId(fixtureIds.italyId),
          region: asNumericId(fixtureIds.sicilyId),
          appellation: asNumericId(fixtureIds.carsoId),
          type: asNumericId(fixtureIds.wineTypeId),
        },
      })
      throw new Error('denominazione/regione incoerente: attesa ValidationError')
    } catch (error) {
      if (!validationHasPath(error, 'appellation')) {
        throw error
      }
    }
    console.log('OK: denominazione incoerente con regione rifiutata')

    await payload.update({
      collection: WINES_SLUG,
      id: fixtureIds.wineCoherentId,
      overrideAccess: true,
      depth: 0,
      data: { price: 21 },
    })
    console.log('OK: PATCH parziale solo price')

    try {
      await payload.update({
        collection: WINES_SLUG,
        id: fixtureIds.wineCoherentId,
        overrideAccess: true,
        depth: 0,
        data: { country: asNumericId(fixtureIds.franceId) },
      })
      throw new Error('PATCH country che contraddice region: attesa ValidationError')
    } catch (error) {
      if (!validationHasPath(error, 'region')) {
        throw error
      }
    }
    console.log('OK: PATCH solo country che contraddice region salvata rifiutata')

    console.log('--- Menu fisso: doppione, portion, visibility ---')
    try {
      await payload.update({
        collection: FIXED_MENUS_SLUG,
        id: fixtureIds.fixedMenuId,
        overrideAccess: true,
        depth: 0,
        locale: 'it',
        data: {
          dishes: [
            { dish: asNumericId(fixtureIds.dishId), portion: 'A' },
            { dish: asNumericId(fixtureIds.dishId), portion: 'B' },
          ],
        },
      })
      throw new Error('doppione piatto: attesa ValidationError')
    } catch (error) {
      if (!isValidationError(error)) {
        throw error
      }
    }
    console.log('OK: doppione piatto nell’array rifiutato')

    await payload.update({
      collection: FIXED_MENUS_SLUG,
      id: fixtureIds.fixedMenuId,
      overrideAccess: true,
      depth: 0,
      locale: 'en',
      data: {
        name: `Menu EN ${TEST_RUN_ID}`,
        dishes: [{ dish: asNumericId(fixtureIds.dishId), portion: 'EN portion' }],
      },
    })
    const portionEn = await payload.findByID({
      collection: FIXED_MENUS_SLUG,
      id: fixtureIds.fixedMenuId,
      locale: 'en',
      fallbackLocale: false,
      depth: 1,
      overrideAccess: true,
    })
    const row = portionEn.dishes?.[0]
    if (!row || row.portion !== 'EN portion') {
      throw new Error(`portion localized: atteso «EN portion», ottenuto «${row?.portion}»`)
    }
    console.log('OK: portion localizzata su array dishes')

    const cat = await payload.findByID({
      collection: FIXED_MENU_CATEGORIES_SLUG,
      id: fixtureIds.fixedCategoryId,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
    })
    if (cat.visibility !== 'lunch_only') {
      throw new Error('visibility categoria menu fisso mancante o errata')
    }
    console.log('OK: visibility su categoria fixture (lunch_only)')

    console.log('--- Menu fisso: ordine piatti e visibility ---')
    const orderTag = `Ord ${TEST_RUN_ID}`
    const dishOrderZ = await payload.create({
      collection: DISHES_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: {
        name: `Z ${orderTag}`,
        price: 1,
        category: asNumericId(fixtureIds.dishCategoryId),
      },
    })
    const dishOrderM = await payload.create({
      collection: DISHES_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: {
        name: `M ${orderTag}`,
        price: 1,
        category: asNumericId(fixtureIds.dishCategoryId),
      },
    })
    const dishOrderA = await payload.create({
      collection: DISHES_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: {
        name: `A ${orderTag}`,
        price: 1,
        category: asNumericId(fixtureIds.dishCategoryId),
      },
    })
    createdDocIds.push(
      { collection: DISHES_SLUG, id: dishOrderZ.id },
      { collection: DISHES_SLUG, id: dishOrderM.id },
      { collection: DISHES_SLUG, id: dishOrderA.id },
    )

    const orderCategory = await payload.create({
      collection: FIXED_MENU_CATEGORIES_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: { name: `Cat ordine ${orderTag}`, visibility: 'dinner_only' },
    })
    createdDocIds.push({ collection: FIXED_MENU_CATEGORIES_SLUG, id: orderCategory.id })

    const orderMenu = await payload.create({
      collection: FIXED_MENUS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: {
        name: `Menu ordine ${orderTag}`,
        price: 50,
        category: orderCategory.id,
        visibility: 'dinner_only',
        dishes: [
          { dish: dishOrderZ.id },
          { dish: dishOrderM.id },
          { dish: dishOrderA.id },
        ],
      },
    })
    createdDocIds.push({ collection: FIXED_MENUS_SLUG, id: orderMenu.id })

    const orderRead = await payload.findByID({
      collection: FIXED_MENUS_SLUG,
      id: orderMenu.id,
      locale: 'it',
      depth: 1,
      overrideAccess: true,
    })
    const orderNames =
      orderRead.dishes?.map((row) => {
        const rel = row.dish
        if (rel && typeof rel === 'object' && 'name' in rel) {
          return String(rel.name)
        }
        throw new Error('ordine piatti: dish non popolato in depth 1')
      }) ?? []
    const expectedOrder = [`Z ${orderTag}`, `M ${orderTag}`, `A ${orderTag}`]
    if (orderNames.join('|') !== expectedOrder.join('|')) {
      throw new Error(
        `ordine piatti: atteso ${expectedOrder.join(' → ')}, ottenuto ${orderNames.join(' → ')}`,
      )
    }
    if (orderRead.visibility !== 'dinner_only') {
      throw new Error(`visibility menu ordine: atteso dinner_only, ottenuto ${orderRead.visibility}`)
    }
    const orderCatRead = await payload.findByID({
      collection: FIXED_MENU_CATEGORIES_SLUG,
      id: orderCategory.id,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
    })
    if (orderCatRead.visibility !== 'dinner_only') {
      throw new Error(
        `visibility categoria ordine: atteso dinner_only, ottenuto ${orderCatRead.visibility}`,
      )
    }
    console.log('OK: ordine piatti Z→M→A e visibility dinner_only su menu e categoria')

    console.log('--- Relazioni obbligatorie ---')
    for (const [slug, data] of [
      [DISHES_SLUG, { name: 'x', price: 1 }],
      [WINES_SLUG, { name: 'x', price: 1 }],
      [SPIRITS_SLUG, { name: 'x', price: 1 }],
      [DRINKS_SLUG, { name: 'x', price: 1 }],
      [FIXED_MENUS_SLUG, { name: 'x', price: 1, visibility: 'always' }],
    ] as const) {
      try {
        await payload.create({
          collection: slug,
          overrideAccess: true,
          depth: 0,
          locale: 'it',
          data: data as never,
        })
        throw new Error(`${slug}: attesa ValidationError per relazione obbligatoria`)
      } catch (error) {
        if (!isValidationError(error)) {
          throw error
        }
      }
      console.log(`OK: ${slug} rifiuta relazioni obbligatorie vuote`)
    }

    try {
      await payload.create({
        collection: FIXED_MENUS_SLUG,
        overrideAccess: true,
        depth: 0,
        locale: 'it',
        data: {
          name: 'No dish',
          price: 1,
          category: asNumericId(fixtureIds.fixedCategoryId),
          visibility: 'always',
          dishes: [{}] as never,
        },
      })
      throw new Error('fixed-menus.dish: attesa ValidationError')
    } catch (error) {
      if (!isValidationError(error)) {
        throw error
      }
    }
    console.log('OK: dish obbligatorio nella riga array')

    console.log('--- Locale (contenuto, non conteggi) ---')
    const enName = await payload.findByID({
      collection: DISHES_SLUG,
      id: fixtureIds.dishId,
      locale: 'en',
      depth: 0,
      overrideAccess: true,
    })
    if (enName.name !== `Piatto 6_2 ${TEST_RUN_ID}`) {
      throw new Error(`Ripiego en dish name: atteso IT, ottenuto «${enName.name}»`)
    }
    const enNoFallback = await payload.findByID({
      collection: DISHES_SLUG,
      id: fixtureIds.dishId,
      locale: 'en',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
    const descEn = enNoFallback.description
    if (descEn != null && descEn !== '') {
      throw new Error(`description en senza fallback doveva essere vuota, ottenuto «${descEn}»`)
    }
    const wineEn = await payload.findByID({
      collection: WINES_SLUG,
      id: fixtureIds.wineCoherentId,
      locale: 'en',
      fallbackLocale: false,
      depth: 0,
      overrideAccess: true,
    })
    if (wineEn.name !== `Vino geo 6_2 ${TEST_RUN_ID}`) {
      throw new Error('name vino non ha versione en separata (stesso valore IT)')
    }
    console.log('OK: ripiego e campi non localizzati (vino name)')

    async function assertLocaleMissingEn(
      slug: MenuContentSlug,
      id: number | string,
      localizedField: 'name' | 'description',
      itValue: string,
    ): Promise<void> {
      const enFallback = await payload.findByID({
        collection: slug,
        id,
        locale: 'en',
        depth: 0,
        overrideAccess: true,
      })
      const fieldVal = (enFallback as unknown as Record<string, unknown>)[localizedField]
      if (fieldVal !== itValue) {
        throw new Error(
          `${slug}.${localizedField} en con ripiego: atteso «${itValue}», ottenuto «${String(fieldVal)}»`,
        )
      }
      const enNoFb = await payload.findByID({
        collection: slug,
        id,
        locale: 'en',
        fallbackLocale: false,
        depth: 0,
        overrideAccess: true,
      })
      const missing = (enNoFb as unknown as Record<string, unknown>)[localizedField]
      if (missing != null && missing !== '') {
        throw new Error(
          `${slug}.${localizedField} en fallbackLocale false: atteso vuoto, ottenuto «${missing}»`,
        )
      }
    }

    console.log('--- Locale: drinks, menu-services, categorie e menu fisso (solo IT) ---')
    const locDrink = await payload.create({
      collection: DRINKS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: {
        name: `Loc drink ${TEST_RUN_ID}`,
        description: 'Desc IT drink',
        price: 2,
        type: asNumericId(fixtureIds.drinkTypeId),
      },
    })
    createdDocIds.push({ collection: DRINKS_SLUG, id: locDrink.id })
    await assertLocaleMissingEn(DRINKS_SLUG, locDrink.id, 'name', `Loc drink ${TEST_RUN_ID}`)
    await assertLocaleMissingEn(DRINKS_SLUG, locDrink.id, 'description', 'Desc IT drink')
    console.log('OK: drinks locale name/description')

    const locService = await payload.create({
      collection: MENU_SERVICES_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: { name: `Loc servizio ${TEST_RUN_ID}`, price: 1 },
    })
    createdDocIds.push({ collection: MENU_SERVICES_SLUG, id: locService.id })
    await assertLocaleMissingEn(
      MENU_SERVICES_SLUG,
      locService.id,
      'name',
      `Loc servizio ${TEST_RUN_ID}`,
    )
    console.log('OK: menu-services locale name')

    const locFixedCat = await payload.create({
      collection: FIXED_MENU_CATEGORIES_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: { name: `Loc cat ${TEST_RUN_ID}`, visibility: 'always' },
    })
    createdDocIds.push({ collection: FIXED_MENU_CATEGORIES_SLUG, id: locFixedCat.id })
    await assertLocaleMissingEn(
      FIXED_MENU_CATEGORIES_SLUG,
      locFixedCat.id,
      'name',
      `Loc cat ${TEST_RUN_ID}`,
    )
    console.log('OK: fixed-menu-categories locale name')

    const locFixedMenu = await payload.create({
      collection: FIXED_MENUS_SLUG,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: {
        name: `Loc menu ${TEST_RUN_ID}`,
        description: 'Desc IT menu',
        price: 10,
        category: asNumericId(fixtureIds.fixedCategoryId),
        visibility: 'always',
      },
    })
    createdDocIds.push({ collection: FIXED_MENUS_SLUG, id: locFixedMenu.id })
    await assertLocaleMissingEn(
      FIXED_MENUS_SLUG,
      locFixedMenu.id,
      'name',
      `Loc menu ${TEST_RUN_ID}`,
    )
    await assertLocaleMissingEn(
      FIXED_MENUS_SLUG,
      locFixedMenu.id,
      'description',
      'Desc IT menu',
    )
    console.log('OK: fixed-menus locale name/description')

    console.log('--- Cancellazione admin con riferimenti ---')
    let dishDeleteOutcome = 'non eseguito'
    try {
      await payload.delete({
        collection: DISHES_SLUG,
        id: fixtureIds.dishId,
        overrideAccess: false,
        depth: 0,
        user: adminUser,
      })
      dishDeleteOutcome = 'cancellato (nessun blocco)'
    } catch (error) {
      dishDeleteOutcome =
        error instanceof Error ? `${error.constructor.name}: ${error.message}` : String(error)
    }
    console.log(`OSSERVATO: delete piatto referenziato in menu fisso → ${dishDeleteOutcome}`)

    let categoryDeleteOutcome = 'non eseguito'
    try {
      await payload.delete({
        collection: DISH_CATEGORIES_SLUG,
        id: fixtureIds.dishCategoryId,
        overrideAccess: false,
        depth: 0,
        user: adminUser,
      })
      categoryDeleteOutcome = 'cancellato (nessun blocco)'
    } catch (error) {
      categoryDeleteOutcome =
        error instanceof Error ? `${error.constructor.name}: ${error.message}` : String(error)
    }
    console.log(`OSSERVATO: delete categoria usata da piatti → ${categoryDeleteOutcome}`)

    console.log('--- REST (pnpm dev) ---')
    let restOk = false
    try {
      const ping = await restFetchAnon(`/api/${DISHES_SLUG}?locale=it&limit=1&depth=0`, 'GET')
      restOk = ping.ok
    } catch {
      restOk = false
    }
    const restDisabledBySlug: Partial<Record<MenuContentSlug, number | string>> = {}
    console.log('--- REST: probe disabled per slug ---')
    for (const slug of MENU_CONTENT_SLUGS) {
      const id = await createProbeDoc(
        payload,
        slug,
        fixtureIds,
        'RestOff',
        { disabled: true },
        createdDocIds,
      )
      restDisabledBySlug[slug] = id
    }

    if (!restOk) {
      console.log('NON ESEGUITO: REST — avviare pnpm dev su vma_vd_dev')
    } else {
      for (const slug of MENU_CONTENT_SLUGS) {
        const getRes = await restFetchAnon(`/api/${slug}?locale=it&limit=100&depth=0`, 'GET')
        if (getRes.status !== 200) {
          throw new Error(`REST GET ${slug}: atteso 200, ${getRes.status}`)
        }
        expectAnonRestWriteStatus(`POST /api/${slug}`, await restFetchAnon(`/api/${slug}`, 'POST', {}))
        const list = (await getRes.json()) as { docs: Array<{ id: number | string }> }
        const anyId = list.docs[0]?.id ?? fixtureIds.dishId
        expectAnonRestWriteStatus(
          `PATCH /api/${slug}/${anyId}`,
          await restFetchAnon(`/api/${slug}/${anyId}`, 'PATCH', { name: 'hack' }),
        )
        expectAnonRestWriteStatus(
          `DELETE /api/${slug}/${anyId}`,
          await restFetchAnon(`/api/${slug}/${anyId}`, 'DELETE'),
        )
      }
      console.log('OK: REST anonimo GET 200 e write 403 su tutte le collection')

      for (const slug of MENU_CONTENT_SLUGS) {
        const probeId = restDisabledBySlug[slug]
        if (probeId == null) {
          throw new Error(`REST disabled probe mancante per ${slug}`)
        }
        const listRes = await restFetchAnon(`/api/${slug}?locale=it&limit=200&depth=0`, 'GET')
        if (!listRes.ok) {
          throw new Error(`REST GET ${slug} per disabled: ${listRes.status}`)
        }
        const body = (await listRes.json()) as {
          docs: Array<{ id: number | string; disabled?: boolean }>
        }
        const hit = body.docs.find((d) => String(d.id) === String(probeId))
        if (!hit || hit.disabled !== true) {
          throw new Error(`REST ${slug}: probe disabled:true non trovato in GET anonimo`)
        }
        console.log(`OK: REST ${slug} include disabled:true`)
      }

      const enRest = await restFetchAnon(
        `/api/${DISHES_SLUG}/${fixtureIds.dishId}?locale=en&depth=0`,
        'GET',
      )
      const enBody = (await enRest.json()) as { name?: string }
      if (enBody.name !== `Piatto 6_2 ${TEST_RUN_ID}`) {
        throw new Error('REST locale=en ripiego dish name')
      }
      const enNone = await restFetchAnon(
        `/api/${DISHES_SLUG}/${fixtureIds.dishId}?locale=en&fallback-locale=none&depth=0`,
        'GET',
      )
      const enNoneBody = (await enNone.json()) as { description?: string | null }
      if (enNoneBody.description != null && enNoneBody.description !== '') {
        throw new Error('REST fallback-locale=none: description doveva essere vuota')
      }
      console.log('OK: REST locale en e fallback-locale=none')
    }
  } finally {
    await cleanup()
  }
}

try {
  await main()
  console.log('Verifica 6.2 completata.')
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Verifica 6.2 non riuscita: ${message}`)
  process.exit(1)
}
