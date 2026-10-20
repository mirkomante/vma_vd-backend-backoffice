/**
 * Elimina record verify-ui-* da menu-services, fixed-menus, fixed-menu-categories e special-days
 * (delete-prefix del lanciatore non li copre). Solo database di sviluppo.
 *
 *   pnpm payload run scripts/cleanup-verify-ui-menu-fixtures.ts
 */
import config from '@payload-config'
import type { CollectionSlug } from 'payload'
import { getPayload } from 'payload'

import {
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
  MENU_SERVICES_SLUG,
  SPECIAL_DAYS_SLUG,
} from '@/lib/menu/constants'
import { relationshipId } from '@/lib/menu/relationshipId'
import type { FixedMenu, SpecialDay } from '@/payload-types'

import { assertDevDatabaseFromEnv } from './import-menu-vtn-backend/databaseUrl'

const PREFIX = 'verify-ui-'

const SLUGS: CollectionSlug[] = [
  MENU_SERVICES_SLUG,
  FIXED_MENUS_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  SPECIAL_DAYS_SLUG,
]

async function deleteByNamePrefix(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: CollectionSlug,
): Promise<number> {
  let deleted = 0
  for (;;) {
    const found = await payload.find({
      collection: slug,
      where: { name: { like: `${PREFIX}%` } },
      limit: 100,
      depth: 0,
      overrideAccess: true,
    })
    if (found.docs.length === 0) {
      break
    }
    for (const doc of found.docs) {
      await payload.delete({ collection: slug, id: doc.id, overrideAccess: true })
      deleted += 1
    }
  }
  return deleted
}

async function findVerifyUiFixedMenuIds(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<Set<string>> {
  const ids = new Set<string>()
  for (let page = 1; ; page += 1) {
    const found = await payload.find({
      collection: FIXED_MENUS_SLUG,
      where: { name: { like: `${PREFIX}%` } },
      limit: 100,
      page,
      depth: 0,
      overrideAccess: true,
    })
    for (const doc of found.docs as FixedMenu[]) {
      ids.add(String(doc.id))
    }
    if (!found.hasNextPage) {
      break
    }
  }
  return ids
}

async function deleteSpecialDaysReferencingFixtureMenus(
  payload: Awaited<ReturnType<typeof getPayload>>,
  fixtureMenuIds: ReadonlySet<string>,
): Promise<number> {
  if (fixtureMenuIds.size === 0) {
    return 0
  }
  let deleted = 0
  const found = await payload.find({
    collection: SPECIAL_DAYS_SLUG,
    limit: 200,
    depth: 1,
    overrideAccess: true,
  })
  for (const doc of found.docs as SpecialDay[]) {
    const menuIds =
      doc.content?.fixedMenus
        ?.map((m) => relationshipId(m))
        .filter((id): id is number | string => id != null)
        .map(String) ?? []
    if (menuIds.some((id) => fixtureMenuIds.has(id))) {
      await payload.delete({ collection: SPECIAL_DAYS_SLUG, id: doc.id, overrideAccess: true })
      deleted += 1
    }
  }
  return deleted
}

/** Categorie attese da L1 menu-fissi-visibilita-categoria (ricreate dopo la pulizia). */
async function ensureVisibilitySeedCategories(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<{ created: string[] }> {
  const seeds = [
    { name: 'verify-ui-pranzo', visibility: 'lunch_only' as const },
    { name: 'verify-ui-sempre', visibility: 'always' as const },
  ]
  const created: string[] = []
  for (const seed of seeds) {
    const found = await payload.find({
      collection: FIXED_MENU_CATEGORIES_SLUG,
      where: { name: { equals: seed.name } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (found.docs.length === 0) {
      await payload.create({
        collection: FIXED_MENU_CATEGORIES_SLUG,
        data: { name: seed.name, visibility: seed.visibility },
        overrideAccess: true,
      })
      created.push(seed.name)
    }
  }
  return { created }
}

try {
  assertDevDatabaseFromEnv()
  const payload = await getPayload({ config })
  const fixtureMenuIds = await findVerifyUiFixedMenuIds(payload)
  const bySlug: Record<string, number> = {}
  bySlug[SPECIAL_DAYS_SLUG] = await deleteSpecialDaysReferencingFixtureMenus(payload, fixtureMenuIds)
  for (const slug of SLUGS) {
    if (slug === SPECIAL_DAYS_SLUG) {
      continue
    }
    bySlug[slug] = await deleteByNamePrefix(payload, slug)
  }
  const seed = await ensureVisibilitySeedCategories(payload)
  await payload.destroy()
  console.log(JSON.stringify({ deleted: bySlug, seedCategoriesCreated: seed.created }))
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
