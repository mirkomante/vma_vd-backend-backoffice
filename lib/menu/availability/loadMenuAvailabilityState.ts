import type { Payload, PayloadRequest } from 'payload'

import {
  DISHES_SLUG,
  DRINKS_SLUG,
  FIXED_MENUS_SLUG,
  MENU_GENERAL_SLUG,
  MENU_SERVICES_SLUG,
  SPIRITS_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'

import type { MenuAvailabilityCmsState } from './types'

const AVAILABILITY_COLLECTIONS = [
  DISHES_SLUG,
  WINES_SLUG,
  DRINKS_SLUG,
  SPIRITS_SLUG,
  FIXED_MENUS_SLUG,
  MENU_SERVICES_SLUG,
] as const

type AvailabilityCollectionSlug = (typeof AVAILABILITY_COLLECTIONS)[number]

async function findAllDocs<T extends { id: number | string }>(
  payload: Payload,
  collection: AvailabilityCollectionSlug,
  req?: PayloadRequest,
): Promise<T[]> {
  const docs: T[] = []
  let page = 1
  let hasNext = true
  while (hasNext) {
    const result = await payload.find({
      collection,
      depth: 0,
      limit: 100,
      page,
      overrideAccess: true,
      pagination: true,
      req,
      sort: 'id',
    })
    docs.push(...(result.docs as unknown as T[]))
    hasNext = result.hasNextPage
    page += 1
  }
  return docs
}

async function readGlobalMessage(
  payload: Payload,
  locale: 'it' | 'en',
  req?: PayloadRequest,
): Promise<string> {
  const global = await payload.findGlobal({
    slug: MENU_GENERAL_SLUG,
    depth: 0,
    locale,
    overrideAccess: true,
    fallbackLocale: false,
    req,
  })
  const message = (global as { globalMessage?: string | null }).globalMessage
  return typeof message === 'string' ? message : ''
}

/**
 * Legge lo stato per `disponibilita.json`. Con `req` (hook) vede anche modifiche non ancora committate.
 */
export async function loadMenuAvailabilityState(
  payload: Payload,
  req?: PayloadRequest,
): Promise<MenuAvailabilityCmsState> {
  const [dishes, wines, drinks, spirits, fixedMenus, services, globalMessageIt, globalMessageEn] =
    await Promise.all([
      findAllDocs<{ id: number | string; disabled?: boolean | null; soldOut?: boolean | null }>(
        payload,
        DISHES_SLUG,
        req,
      ),
      findAllDocs<{ id: number | string; disabled?: boolean | null }>(payload, WINES_SLUG, req),
      findAllDocs<{ id: number | string; disabled?: boolean | null }>(payload, DRINKS_SLUG, req),
      findAllDocs<{ id: number | string; disabled?: boolean | null }>(payload, SPIRITS_SLUG, req),
      findAllDocs<{ id: number | string; disabled?: boolean | null }>(
        payload,
        FIXED_MENUS_SLUG,
        req,
      ),
      findAllDocs<{ id: number | string; disabled?: boolean | null }>(
        payload,
        MENU_SERVICES_SLUG,
        req,
      ),
      readGlobalMessage(payload, 'it', req),
      readGlobalMessage(payload, 'en', req),
    ])

  return {
    dishes,
    wines,
    drinks,
    spirits,
    fixedMenus,
    services,
    globalMessageIt,
    globalMessageEn,
  }
}
