import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'
import { FIXED_MENU_CATEGORIES_SLUG, FIXED_MENUS_SLUG, SPECIAL_DAYS_SLUG } from '@/lib/menu/constants'
import { compareItalianNames } from '@/lib/menu/display/sortByItalianName'
import { formatMenuContentDeleteDetail } from '@/lib/menu/menuContentDeleteLog'
import type { Payload } from 'payload'

import { managerUser } from '../menu-list/payload-actions'

export async function readFixedMenuAsManager(
  payload: Payload,
  managerEmail: string,
  id: number | string,
) {
  const user = await managerUser(payload, managerEmail)
  const doc = await payload.findByID({
    collection: FIXED_MENUS_SLUG,
    id,
    depth: 2,
    locale: 'it',
    overrideAccess: false,
    user,
  })
  const dishes = (doc as { dishes?: { dish?: unknown; portion?: string }[] }).dishes ?? []
  const dishNames: string[] = []
  const portions: string[] = []
  for (const row of dishes) {
    const rel = row.dish
    const name =
      rel && typeof rel === 'object' && 'name' in rel
        ? String((rel as { name: string }).name)
        : rel != null
          ? String(rel)
          : ''
    dishNames.push(name)
    portions.push(row.portion ?? '')
  }
  const services = (doc as { services?: unknown[] }).services ?? []
  const serviceNames = services
    .map((s) => {
      if (s && typeof s === 'object' && 'name' in s) return String((s as { name: string }).name)
      return s != null ? String(s) : ''
    })
    .filter(Boolean)
  const cat = (doc as { category?: { name?: string } | number }).category
  const categoryName =
    cat && typeof cat === 'object' && cat.name ? String(cat.name) : cat != null ? String(cat) : ''
  return {
    name: String((doc as { name: string }).name),
    price: Number((doc as { price?: number }).price ?? 0),
    categoryName,
    dishNames,
    portions,
    serviceNames,
  }
}

export async function findFixedMenuIdByName(
  payload: Payload,
  name: string,
): Promise<number | string | null> {
  const res = await payload.find({
    collection: FIXED_MENUS_SLUG,
    where: { name: { equals: name } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return res.docs[0]?.id ?? null
}

export async function specialDayContainsMenu(
  payload: Payload,
  menuId: number | string,
): Promise<boolean> {
  const res = await payload.find({
    collection: SPECIAL_DAYS_SLUG,
    where: { 'content.fixedMenus': { contains: menuId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return res.docs.length > 0
}

export async function findFixedMenuDeleteLog(
  payload: Payload,
  managerEmail: string,
  docId: string,
  itemName: string,
  refCount: number,
): Promise<{ found: boolean; detail: string | null; expectedDetail: string }> {
  const user = await managerUser(payload, managerEmail)
  const expectedDetail = formatMenuContentDeleteDetail(itemName, refCount)
  const logs = await payload.find({
    collection: ACTIVITY_LOG_SLUG,
    overrideAccess: true,
    depth: 0,
    limit: 5,
    sort: '-createdAt',
    where: {
      and: [
        { user: { equals: user.id } },
        { eventType: { equals: 'delete' } },
        { area: { equals: 'app' } },
        { collection: { equals: FIXED_MENUS_SLUG } },
        { documentId: { equals: docId } },
      ],
    },
  })
  const row = logs.docs[0] as { detail?: string } | undefined
  return { found: Boolean(row), detail: row?.detail ?? null, expectedDetail }
}

export async function readFixedMenuLocale(
  payload: Payload,
  managerEmail: string,
  id: number | string,
  locale: 'it' | 'en',
  fallbackLocale?: false,
) {
  const user = await managerUser(payload, managerEmail)
  const doc = await payload.findByID({
    collection: FIXED_MENUS_SLUG,
    id,
    depth: 2,
    locale,
    ...(fallbackLocale === false ? { fallbackLocale: false } : {}),
    overrideAccess: false,
    user,
  })
  const dishes = (doc as { dishes?: { dish?: unknown; portion?: string }[] }).dishes ?? []
  const dishNames: string[] = []
  const portions: string[] = []
  for (const row of dishes) {
    const rel = row.dish
    const name =
      rel && typeof rel === 'object' && 'name' in rel
        ? String((rel as { name: string }).name)
        : rel != null
          ? String(rel)
          : ''
    dishNames.push(name)
    portions.push(row.portion ?? '')
  }
  return {
    name: String((doc as { name?: string }).name ?? ''),
    description: String((doc as { description?: string }).description ?? ''),
    dishNames,
    portions,
  }
}

export async function sortedFixedMenuCategoryNames(
  payload: Payload,
  managerEmail: string,
): Promise<string[]> {
  const user = await managerUser(payload, managerEmail)
  const res = await payload.find({
    collection: FIXED_MENU_CATEGORIES_SLUG,
    sort: 'name',
    limit: 500,
    depth: 0,
    overrideAccess: false,
    user,
  })
  const names = res.docs.map((d) => String((d as { name: string }).name))
  return [...names].sort(compareItalianNames)
}

export async function sortedFixedMenuNames(
  payload: Payload,
  managerEmail: string,
): Promise<string[]> {
  const user = await managerUser(payload, managerEmail)
  const res = await payload.find({
    collection: FIXED_MENUS_SLUG,
    sort: 'name',
    limit: 500,
    depth: 0,
    overrideAccess: false,
    user,
  })
  const names = res.docs.map((d) => String((d as { name: string }).name))
  return [...names].sort(compareItalianNames)
}
