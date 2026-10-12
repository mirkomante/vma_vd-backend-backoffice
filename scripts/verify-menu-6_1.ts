/**
 * Verifica fase 6.1: permessi, idempotenza seed, relazioni obbligatorie, ripiego locale en,
 * admin.hidden per adminRole manager (config, non browser).
 *
 *   pnpm verify:menu-6_1
 * REST: richiede `pnpm dev` su APP_PUBLIC_URL (default localhost:3000).
 */
import config from '@payload-config'
import {
  APIError,
  type CollectionSlug,
  getFieldsToSign,
  getPayload,
  jwtSign,
  ValidationError,
} from 'payload'

import { hideFromAdminRoleManager } from '@/lib/auth/adminPanelVisibility'
import { withSessionStrategyClaim } from '@/lib/auth/jwt/sessionStrategyClaim'
import { LOCAL_JWT_STRATEGY_ADMIN } from '@/lib/auth/localLogin/constants'
import {
  ALLERGENS_SLUG,
  APPELLATIONS_SLUG,
  CLASSIFICATIONS_SLUG,
  COUNTRIES_SLUG,
  DISH_CATEGORIES_SLUG,
  DRINK_TYPES_SLUG,
  MENU_GENERAL_SLUG,
  MENU_TAXONOMY_SLUGS,
  REGIONS_SLUG,
  SPIRIT_TYPES_SLUG,
  WINE_TYPES_SLUG,
} from '@/lib/menu/constants'
import type { User } from '@/payload-types'

import { runMenuTaxonomiesSeed } from './seed-menu-taxonomies'

const TEST_RUN_ID = Date.now().toString(36)
const TEST_EMAIL_PREFIX = `verify-6_1-${TEST_RUN_ID}-`
const TEST_PASSWORD = 'Verify6_1!AaBbCc'

const EXPECTED_COUNTS: Record<string, number> = {
  [COUNTRIES_SLUG]: 13,
  [REGIONS_SLUG]: 16,
  [APPELLATIONS_SLUG]: 3,
  [CLASSIFICATIONS_SLUG]: 6,
  [ALLERGENS_SLUG]: 14,
}

type PayloadInstance = Awaited<ReturnType<typeof getPayload>>

function appPublicUrl(): string {
  return (process.env.APP_PUBLIC_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}

function isAccessDenied(error: unknown): boolean {
  return error instanceof APIError && error.status === 403
}

function isValidationError(error: unknown): boolean {
  return error instanceof ValidationError
}

async function restFetch(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.headers as Record<string, string>),
  }
  if (init.token) {
    headers.Authorization = `JWT ${init.token}`
    headers.Cookie = `payload-token=${init.token}`
  }
  return fetch(`${appPublicUrl()}${path}`, { ...init, headers })
}

/** REST senza cookie né Authorization (anonimo). */
async function restFetchAnon(
  path: string,
  method: string,
  body: Record<string, unknown> = {},
): Promise<Response> {
  return fetch(`${appPublicUrl()}${path}`, {
    method,
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

function expectAnonRestWriteStatus(label: string, res: Response): void {
  if (res.status !== 403) {
    throw new Error(`REST anonimo ${label}: atteso 403, ottenuto ${res.status}`)
  }
  console.log(`OK: REST anonimo ${label} → ${res.status}`)
}

async function assertCounts(payload: PayloadInstance): Promise<void> {
  for (const [slug, expected] of Object.entries(EXPECTED_COUNTS)) {
    const { totalDocs } = await payload.find({
      collection: slug as CollectionSlug,
      depth: 0,
      limit: 0,
      overrideAccess: true,
    })
    if (totalDocs !== expected) {
      throw new Error(`Conteggio ${slug}: atteso ${expected}, ottenuto ${totalDocs}`)
    }
    console.log(`OK: conteggio ${slug} = ${expected}`)
  }
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

async function tryGlobalRead(payload: PayloadInstance, user: User | undefined): Promise<void> {
  await payload.findGlobal({
    slug: MENU_GENERAL_SLUG,
    overrideAccess: false,
    depth: 0,
    ...(user ? { user } : {}),
  })
}

async function expectGlobalRead(
  payload: PayloadInstance,
  user: User | undefined,
  allow: boolean,
  roleLabel: string,
): Promise<void> {
  try {
    await tryGlobalRead(payload, user)
    if (!allow) {
      throw new Error(`${roleLabel} read menu-general: atteso 403, ottenuto OK`)
    }
    console.log(`OK: ${roleLabel} read menu-general`)
  } catch (error) {
    if (allow) {
      throw error
    }
    if (!isAccessDenied(error)) {
      throw error
    }
    console.log(`OK: ${roleLabel} read menu-general negata (403)`)
  }
}

async function expectGlobalUpdate(
  payload: PayloadInstance,
  user: User,
  allow: boolean,
  roleLabel: string,
): Promise<void> {
  try {
    await payload.updateGlobal({
      slug: MENU_GENERAL_SLUG,
      overrideAccess: false,
      depth: 0,
      locale: 'it',
      user,
      data: { globalMessage: `verify-${TEST_RUN_ID}-${roleLabel}` },
    })
    if (!allow) {
      throw new Error(`${roleLabel} update menu-general: atteso 403, ottenuto OK`)
    }
    console.log(`OK: ${roleLabel} update menu-general`)
  } catch (error) {
    if (allow) {
      throw error
    }
    if (!isAccessDenied(error)) {
      throw error
    }
    console.log(`OK: ${roleLabel} update menu-general negata (403)`)
  }
}

async function expectCollectionCreate(
  payload: PayloadInstance,
  slug: CollectionSlug,
  user: User | undefined,
  data: Record<string, unknown>,
  allow: boolean,
  roleLabel: string,
  locale?: 'it',
): Promise<void> {
  try {
    await payload.create({
      collection: slug,
      overrideAccess: false,
      depth: 0,
      draft: false,
      ...(locale ? { locale } : {}),
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
  user: User,
  allow: boolean,
  roleLabel: string,
  data: Record<string, unknown>,
  locale?: 'it',
): Promise<void> {
  try {
    await payload.update({
      collection: slug,
      id,
      overrideAccess: false,
      depth: 0,
      user,
      ...(locale ? { locale } : {}),
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

async function expectCollectionDelete(
  payload: PayloadInstance,
  slug: CollectionSlug,
  id: number | string,
  user: User,
  allow: boolean,
  roleLabel: string,
): Promise<void> {
  try {
    await payload.delete({
      collection: slug,
      id,
      overrideAccess: false,
      depth: 0,
      user,
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

function assertAdminHiddenForManagerCms(
  label: string,
  hidden: unknown,
  managerCms: User,
  staff: User,
): void {
  if (typeof hidden !== 'function') {
    throw new Error(`${label}: admin.hidden assente o non è una funzione`)
  }
  const hideFn = hidden as (args: { user: unknown }) => boolean
  if (!hideFn({ user: managerCms })) {
    throw new Error(`${label}: admin.hidden doveva essere true per adminRole manager`)
  }
  if (hideFn({ user: staff })) {
    throw new Error(`${label}: admin.hidden non deve nascondere admin staff`)
  }
  console.log(`OK: admin.hidden ${label} nasconde manager CMS`)
}

async function main(): Promise<void> {
  const payload = await getPayload({ config })
  const createdUserIds: (number | string)[] = []
  const createdDocIds: Array<{ collection: CollectionSlug; id: number | string }> = []
  const usersCollection = payload.collections.users.config
  const jwtSecret = payload.secret

  async function signRestJwt(user: User, strategy: string): Promise<string> {
    const sessionUser = Object.assign({ ...user, collection: 'users' as const }, { _strategy: strategy })
    const fieldsToSign = withSessionStrategyClaim(
      getFieldsToSign({
        collectionConfig: usersCollection,
        email: user.email || '',
        user: sessionUser,
      }),
      strategy,
    )
    const { token } = await jwtSign({
      fieldsToSign,
      secret: jwtSecret,
      tokenExpiration: 7200,
    })
    return token
  }

  async function createUser(data: {
    email: string
    adminRole: User['adminRole']
    appRole: User['appRole']
    withLocalPassword?: boolean
  }): Promise<User> {
    const baseData = {
      email: data.email,
      adminRole: data.adminRole,
      appRole: data.appRole,
      loginMethod: data.withLocalPassword ? ('local' as const) : ('sso' as const),
      active: true,
      emailVerified: true,
      ...(data.withLocalPassword
        ? { password: TEST_PASSWORD, passwordConfirm: TEST_PASSWORD }
        : {}),
    }
    const doc = await payload.create({
      collection: 'users',
      overrideAccess: true,
      depth: 0,
      data: baseData,
    })
    createdUserIds.push(doc.id)
    return doc as User
  }

  const probeDocIds: Array<{ collection: CollectionSlug; id: number | string }> = []

  async function cleanup(): Promise<void> {
    for (const { collection, id } of [...createdDocIds].reverse()) {
      await payload.delete({ collection, id, overrideAccess: true, depth: 0 })
    }
    createdDocIds.length = 0
    for (const { collection, id } of [...probeDocIds].reverse()) {
      await payload.delete({ collection, id, overrideAccess: true, depth: 0 })
    }
    probeDocIds.length = 0
    for (const id of [...createdUserIds].reverse()) {
      await payload.delete({ collection: 'users', id, overrideAccess: true, depth: 0 })
    }
    createdUserIds.length = 0
  }

  try {
    console.log('--- Seed idempotente (due esecuzioni) ---')
    await runMenuTaxonomiesSeed(payload)
    const afterFirst = await payload.find({
      collection: COUNTRIES_SLUG,
      depth: 0,
      limit: 0,
      overrideAccess: true,
    })
    await runMenuTaxonomiesSeed(payload)
    const afterSecond = await payload.find({
      collection: COUNTRIES_SLUG,
      depth: 0,
      limit: 0,
      overrideAccess: true,
    })
    if (afterFirst.totalDocs !== afterSecond.totalDocs) {
      throw new Error('Secondo seed ha cambiato il numero di paesi')
    }
    await assertCounts(payload)

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

    const superAdmin = (
      await payload.find({
        collection: 'users',
        overrideAccess: true,
        depth: 0,
        limit: 1,
        where: { adminRole: { equals: 'super-admin' } },
      })
    ).docs[0] as User | undefined
    if (!superAdmin) {
      throw new Error('Nessun super-admin nel DB')
    }

    const italy = await payload.find({
      collection: COUNTRIES_SLUG,
      locale: 'it',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { name: { equals: 'Italia' } },
    })
    const italyId = italy.docs[0]?.id
    if (!italyId) {
      throw new Error('Italia non trovata nel seed')
    }
    const fvg = await payload.find({
      collection: REGIONS_SLUG,
      locale: 'it',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { name: { equals: 'Friuli Venezia Giulia' } },
    })
    const regionId = fvg.docs[0]?.id
    if (!regionId) {
      throw new Error('FVG non trovata nel seed')
    }

    function minimalCreateData(slug: CollectionSlug): Record<string, unknown> {
      const tag = `Verify ${TEST_RUN_ID}`
      switch (slug) {
        case COUNTRIES_SLUG:
          return { name: tag, enabled: true }
        case REGIONS_SLUG:
          return { name: tag, enabled: true, country: italyId }
        case APPELLATIONS_SLUG:
          return { name: tag, region: regionId }
        case CLASSIFICATIONS_SLUG:
          return { name: tag, country: italyId }
        default:
          return { name: tag }
      }
    }

    function createLocale(slug: CollectionSlug): 'it' | undefined {
      if (
        slug === APPELLATIONS_SLUG ||
        slug === CLASSIFICATIONS_SLUG
      ) {
        return undefined
      }
      return 'it'
    }

    function updateLocale(slug: CollectionSlug): 'it' | undefined {
      return createLocale(slug)
    }

    async function firstTaxonomyDocId(slug: CollectionSlug): Promise<number | string> {
      const { docs } = await payload.find({
        collection: slug,
        depth: 0,
        limit: 1,
        overrideAccess: true,
        locale: updateLocale(slug) ?? 'it',
      })
      const existing = docs[0]?.id
      if (existing != null) {
        return existing
      }
      const probe = await payload.create({
        collection: slug,
        overrideAccess: true,
        depth: 0,
        draft: false,
        ...(updateLocale(slug) ? { locale: updateLocale(slug) } : {}),
        data: minimalCreateData(slug) as never,
      })
      probeDocIds.push({ collection: slug, id: probe.id })
      return probe.id
    }

    function minimalUpdateData(
      slug: CollectionSlug,
      doc: Record<string, unknown>,
    ): Record<string, unknown> {
      if (slug === COUNTRIES_SLUG || slug === REGIONS_SLUG) {
        return { enabled: doc.enabled !== false }
      }
      if (slug === APPELLATIONS_SLUG || slug === CLASSIFICATIONS_SLUG) {
        return { name: doc.name as string }
      }
      return { name: doc.name as string }
    }

    console.log('--- admin.hidden (config, adminRole manager) ---')
    for (const slug of MENU_TAXONOMY_SLUGS) {
      const coll = payload.collections[slug]?.config
      if (!coll) {
        throw new Error(`Collection ${slug} non registrata`)
      }
      assertAdminHiddenForManagerCms(
        slug,
        coll.admin?.hidden,
        managerCmsOnly,
        adminUser,
      )
    }
    const menuGeneralConfig = payload.config.globals?.find((g) => g.slug === MENU_GENERAL_SLUG)
    if (!menuGeneralConfig) {
      throw new Error('Global menu-general non registrato')
    }
    assertAdminHiddenForManagerCms(
      MENU_GENERAL_SLUG,
      menuGeneralConfig.admin?.hidden,
      managerCmsOnly,
      adminUser,
    )
    if (!hideFromAdminRoleManager(managerCmsOnly)) {
      throw new Error('hideFromAdminRoleManager(manager CMS) doveva essere true')
    }
    console.log('NON PROVATO: visibilità voci Menù digitale nel browser Admin (solo config)')

    const readRoles: Array<{ label: string; user: User | undefined; allow: boolean }> = [
      { label: 'anonimo', user: undefined, allow: true },
      { label: 'noRole', user: noRole, allow: false },
      { label: 'managerApp', user: managerApp, allow: true },
      { label: 'managerCmsSenzaApp', user: managerCmsOnly, allow: false },
      { label: 'managerCmsConApp', user: managerBoth, allow: true },
      { label: 'admin', user: adminUser, allow: true },
      { label: 'super-admin', user: superAdmin, allow: true },
    ]

    console.log('--- Lettura Local API (9 collection + menu-general) ---')
    for (const role of readRoles) {
      for (const slug of MENU_TAXONOMY_SLUGS) {
        await expectCollectionRead(payload, slug, role.user, role.allow, role.label)
      }
      await expectGlobalRead(payload, role.user, role.allow, role.label)
    }

    console.log('--- Scrittura tassonomie: create (dati validi, accesso negato) ---')
    const writeDenyUsers: Array<{ label: string; user: User | undefined }> = [
      { label: 'anonimo', user: undefined },
      { label: 'noRole', user: noRole },
      { label: 'managerApp', user: managerApp },
      { label: 'managerCmsSenzaApp', user: managerCmsOnly },
      { label: 'managerCmsConApp', user: managerBoth },
    ]
    for (const role of writeDenyUsers) {
      for (const slug of MENU_TAXONOMY_SLUGS) {
        await expectCollectionCreate(
          payload,
          slug,
          role.user,
          minimalCreateData(slug),
          false,
          role.label,
          createLocale(slug),
        )
      }
    }

    console.log('--- Scrittura tassonomie: update (ogni slug, manager App negato / staff OK) ---')
    for (const slug of MENU_TAXONOMY_SLUGS) {
      const docId = await firstTaxonomyDocId(slug)
      const doc = await payload.findByID({
        collection: slug,
        id: docId,
        depth: 0,
        overrideAccess: true,
        locale: updateLocale(slug) ?? 'it',
      })
      const patch = minimalUpdateData(slug, doc as Record<string, unknown>)
      await expectCollectionUpdate(
        payload,
        slug,
        docId,
        managerApp,
        false,
        'managerApp',
        patch,
        updateLocale(slug),
      )
      await expectCollectionUpdate(
        payload,
        slug,
        docId,
        adminUser,
        true,
        'admin',
        patch,
        updateLocale(slug),
      )
      await expectCollectionUpdate(
        payload,
        slug,
        docId,
        superAdmin,
        true,
        'super-admin',
        patch,
        updateLocale(slug),
      )
    }

    console.log('--- Scrittura tassonomie: create/delete staff (ogni slug) ---')
    for (const slug of MENU_TAXONOMY_SLUGS) {
      const created = await payload.create({
        collection: slug,
        overrideAccess: false,
        depth: 0,
        draft: false,
        user: adminUser,
        ...(createLocale(slug) ? { locale: createLocale(slug) } : {}),
        data: minimalCreateData(slug) as never,
      })
      console.log(`OK: admin create ${slug}`)
      createdDocIds.push({ collection: slug, id: created.id })
      await expectCollectionDelete(payload, slug, created.id, managerApp, false, 'managerApp')
      await expectCollectionDelete(payload, slug, created.id, adminUser, true, 'admin')
      createdDocIds.pop()
      const superCreated = await payload.create({
        collection: slug,
        overrideAccess: false,
        depth: 0,
        draft: false,
        user: superAdmin,
        ...(createLocale(slug) ? { locale: createLocale(slug) } : {}),
        data: { ...minimalCreateData(slug), name: `Verify SA ${TEST_RUN_ID}` } as never,
      })
      createdDocIds.push({ collection: slug, id: superCreated.id })
      await payload.delete({
        collection: slug,
        id: superCreated.id,
        overrideAccess: false,
        depth: 0,
        user: superAdmin,
      })
      createdDocIds.pop()
      console.log(`OK: super-admin create+delete ${slug}`)
    }

    console.log('--- Global menu-general: update ---')
    try {
      await payload.updateGlobal({
        slug: MENU_GENERAL_SLUG,
        overrideAccess: false,
        depth: 0,
        locale: 'it',
        data: { globalMessage: 'anon' },
      })
      throw new Error('anonimo update menu-general: atteso 403, ottenuto OK')
    } catch (error) {
      if (!isAccessDenied(error)) {
        throw error
      }
    }
    console.log('OK: anonimo update menu-general negata (403)')
    await expectGlobalUpdate(payload, noRole, false, 'noRole')
    await expectGlobalUpdate(payload, managerCmsOnly, false, 'managerCmsSenzaApp')
    await expectGlobalUpdate(payload, managerApp, true, 'managerApp')
    await expectGlobalUpdate(payload, managerBoth, true, 'managerCmsConApp')
    await expectGlobalUpdate(payload, adminUser, true, 'admin')
    await expectGlobalUpdate(payload, superAdmin, true, 'super-admin')

    console.log('--- Relazioni obbligatorie ---')
    try {
      await payload.create({
        collection: REGIONS_SLUG,
        overrideAccess: true,
        depth: 0,
        locale: 'it',
        draft: false,
        data: { name: 'Regione orfana', enabled: true } as never,
      })
      throw new Error('regions.country: attesa ValidationError')
    } catch (error) {
      if (!isValidationError(error)) {
        throw error
      }
    }
    console.log('OK: regions.country rifiuta riferimento vuoto')

    try {
      await payload.create({
        collection: APPELLATIONS_SLUG,
        overrideAccess: true,
        depth: 0,
        draft: false,
        data: { name: 'Den orfana' } as never,
      })
      throw new Error('appellations.region: attesa ValidationError')
    } catch (error) {
      if (!isValidationError(error)) {
        throw error
      }
    }
    console.log('OK: appellations.region rifiuta riferimento vuoto')

    try {
      await payload.create({
        collection: CLASSIFICATIONS_SLUG,
        overrideAccess: true,
        depth: 0,
        draft: false,
        data: { name: 'Cla orfana' } as never,
      })
      throw new Error('classifications.country: attesa ValidationError')
    } catch (error) {
      if (!isValidationError(error)) {
        throw error
      }
    }
    console.log('OK: classifications.country rifiuta riferimento vuoto')

    console.log('--- Ripiego locale en (Local API) ---')
    const enOnly = await payload.findByID({
      collection: COUNTRIES_SLUG,
      id: italyId,
      locale: 'en',
      depth: 0,
      overrideAccess: true,
    })
    if (enOnly.name !== 'Italia') {
      throw new Error(`Ripiego en Local: atteso «Italia», ottenuto «${enOnly.name}»`)
    }
    console.log('OK: ripiego it su findByID locale=en (Italia)')

    console.log('--- REST (se dev attivo) ---')
    let anonRes: Response | null = null
    try {
      anonRes = await restFetch(`/api/${COUNTRIES_SLUG}?locale=en&limit=1&depth=0`)
    } catch {
      console.log('NON ESEGUITO: REST — fetch fallita (avviare pnpm dev)')
      anonRes = null
    }
    if (anonRes?.ok) {
      const body = (await anonRes.json()) as { docs: Array<{ name?: string }> }
      console.log(`OK: REST anonimo read countries locale=en (primo name=${body.docs[0]?.name})`)

      const cmsToken = await signRestJwt(managerCmsOnly, LOCAL_JWT_STRATEGY_ADMIN)
      const appToken = await signRestJwt(managerApp, LOCAL_JWT_STRATEGY_ADMIN)
      const bothToken = await signRestJwt(managerBoth, LOCAL_JWT_STRATEGY_ADMIN)
      const noRoleToken = await signRestJwt(noRole, LOCAL_JWT_STRATEGY_ADMIN)
      const adminToken = await signRestJwt(adminUser, LOCAL_JWT_STRATEGY_ADMIN)

      for (const slug of MENU_TAXONOMY_SLUGS) {
        const cmsRes = await restFetch(`/api/${slug}?limit=1`, { token: cmsToken })
        if (cmsRes.status !== 403 && cmsRes.status !== 401) {
          throw new Error(`REST managerCmsSenzaApp ${slug}: atteso 401/403, ${cmsRes.status}`)
        }
        const appRes = await restFetch(`/api/${slug}?limit=1`, { token: appToken })
        if (!appRes.ok) {
          throw new Error(`REST managerApp ${slug}: atteso 200, ${appRes.status}`)
        }
        const bothRes = await restFetch(`/api/${slug}?limit=1`, { token: bothToken })
        if (!bothRes.ok) {
          throw new Error(`REST managerCmsConApp ${slug}: atteso 200, ${bothRes.status}`)
        }
        const adminRes = await restFetch(`/api/${slug}?limit=1`, { token: adminToken })
        if (!adminRes.ok) {
          throw new Error(`REST admin ${slug}: atteso 200, ${adminRes.status}`)
        }
      }
      console.log('OK: REST read tutte le collection (cms negato, app/both/admin OK)')

      const noRoleRes = await restFetch(`/api/globals/${MENU_GENERAL_SLUG}?locale=it`, {
        token: noRoleToken,
      })
      if (noRoleRes.status !== 403 && noRoleRes.status !== 401) {
        throw new Error(`REST noRole global: atteso 401/403, ${noRoleRes.status}`)
      }
      console.log('OK: REST noRole read menu-general negata')

      const enRest = await restFetch(`/api/${COUNTRIES_SLUG}/${italyId}?locale=en&depth=0`)
      if (!enRest.ok) {
        throw new Error(`REST ripiego en: atteso 200, ${enRest.status}`)
      }
      const doc = (await enRest.json()) as { name?: string }
      if (doc.name !== 'Italia') {
        throw new Error(`REST ripiego en: atteso Italia, ${doc.name}`)
      }
      console.log('OK: REST ripiego locale=en su Italia')

      console.log('--- REST anonimo write (senza cookie, body {}) ---')
      const anonPostCountries = await restFetchAnon(
        `/api/${COUNTRIES_SLUG}?locale=it&depth=0`,
        'POST',
        {},
      )
      expectAnonRestWriteStatus(`POST /api/${COUNTRIES_SLUG}`, anonPostCountries)

      const anonPatchCountries = await restFetchAnon(
        `/api/${COUNTRIES_SLUG}/${italyId}?locale=it&depth=0`,
        'PATCH',
        {},
      )
      expectAnonRestWriteStatus(`PATCH /api/${COUNTRIES_SLUG}/${italyId}`, anonPatchCountries)

      const anonDeleteCountries = await restFetchAnon(
        `/api/${COUNTRIES_SLUG}/${italyId}?depth=0`,
        'DELETE',
        {},
      )
      expectAnonRestWriteStatus(`DELETE /api/${COUNTRIES_SLUG}/${italyId}`, anonDeleteCountries)

      const anonPatchGlobal = await restFetchAnon(
        `/api/globals/${MENU_GENERAL_SLUG}?locale=it&depth=0`,
        'PATCH',
        {},
      )
      if (anonPatchGlobal.status === 404) {
        console.log(
          `OK: REST anonimo PATCH /api/globals/${MENU_GENERAL_SLUG} → 404 (PATCH non esposto; update Global via POST)`,
        )
      } else {
        expectAnonRestWriteStatus(`PATCH /api/globals/${MENU_GENERAL_SLUG}`, anonPatchGlobal)
      }

      const anonPostGlobal = await restFetchAnon(
        `/api/globals/${MENU_GENERAL_SLUG}?locale=it&depth=0`,
        'POST',
        {},
      )
      expectAnonRestWriteStatus(`POST /api/globals/${MENU_GENERAL_SLUG}`, anonPostGlobal)

      console.log(
        'NON ESEGUITO: REST write (POST/PATCH/DELETE) per altri ruoli/slug — coperto da Local API',
      )
      console.log('NON ESEGUITO: REST super-admin write — coperto da Local API')
    } else if (anonRes) {
      console.log(`NON ESEGUITO: REST (${anonRes.status}) — avviare pnpm dev`)
    }
  } finally {
    await cleanup()
  }
}

try {
  await main()
  console.log('Verifica 6.1 completata.')
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Verifica 6.1 non riuscita: ${message}`)
  process.exit(1)
}
