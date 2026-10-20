import type { CollectionSlug, Payload } from 'payload'

import { relationshipId } from '@/lib/menu/relationshipId'
import {
  DISHES_SLUG,
  DRINKS_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
  MENU_SERVICES_SLUG,
  SPECIAL_DAYS_SLUG,
  SPIRITS_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'
import type { FixedMenu, SpecialDay } from '@/payload-types'

import { assertDevDatabaseFromEnv } from '../../scripts/import-menu-vtn-backend/databaseUrl'

const DELETE_ORDER: CollectionSlug[] = [
  SPECIAL_DAYS_SLUG,
  FIXED_MENUS_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  MENU_SERVICES_SLUG,
  WINES_SLUG,
  SPIRITS_SLUG,
  DRINKS_SLUG,
  DISHES_SLUG,
]

async function findVerifyUiFixedMenuIds(payload: Payload): Promise<Set<string>> {
  const ids = new Set<string>()
  for (let page = 1; ; page += 1) {
    const found = await payload.find({
      collection: FIXED_MENUS_SLUG,
      where: { name: { like: 'verify-ui-%' } },
      limit: 100,
      page,
      depth: 0,
      overrideAccess: true,
    })
    for (const doc of found.docs as FixedMenu[]) {
      ids.add(String(doc.id))
    }
    if (!found.hasNextPage) break
  }
  return ids
}

async function deleteSpecialDaysReferencingFixtureMenus(
  payload: Payload,
  fixtureMenuIds: ReadonlySet<string>,
): Promise<number> {
  if (fixtureMenuIds.size === 0) return 0
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

async function deleteByNamePrefix(payload: Payload, slug: CollectionSlug, prefix: string): Promise<number> {
  let deleted = 0
  for (;;) {
    const found = await payload.find({
      collection: slug,
      where: { name: { like: `${prefix}%` } },
      limit: 100,
      depth: 0,
      overrideAccess: true,
    })
    if (found.docs.length === 0) break
    for (const doc of found.docs) {
      await payload.delete({ collection: slug, id: doc.id, overrideAccess: true })
      deleted += 1
    }
  }
  return deleted
}

/** Cancella tutti i record con prefisso verify-ui- (ordine FK). */
export async function deleteAllVerifyUiPrefix(payload: Payload, prefix = 'verify-ui-'): Promise<number> {
  assertDevDatabaseFromEnv()
  let total = 0
  const fixtureMenuIds = await findVerifyUiFixedMenuIds(payload)
  total += await deleteSpecialDaysReferencingFixtureMenus(payload, fixtureMenuIds)
  for (const slug of DELETE_ORDER) {
    if (slug === SPECIAL_DAYS_SLUG) continue
    total += await deleteByNamePrefix(payload, slug, prefix)
  }
  return total
}

export async function countVerifyUiRecords(payload: Payload, prefix = 'verify-ui-'): Promise<number> {
  let total = 0
  for (const slug of DELETE_ORDER) {
    if (slug === SPECIAL_DAYS_SLUG) continue
    const res = await payload.count({
      collection: slug,
      where: { name: { like: `${prefix}%` } },
      overrideAccess: true,
    })
    total += res.totalDocs
  }
  return total
}
