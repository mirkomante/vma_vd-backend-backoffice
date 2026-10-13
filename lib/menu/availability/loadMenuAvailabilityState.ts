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

import type { MenuAvailabilityStateOverlay } from './stateOverlay'
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

function applyOverlay(
  state: MenuAvailabilityCmsState,
  overlay?: MenuAvailabilityStateOverlay,
): MenuAvailabilityCmsState {
  if (!overlay) {
    return state
  }
  let next = state
  if (overlay.globalMessageIt !== undefined) {
    next = { ...next, globalMessageIt: overlay.globalMessageIt }
  }
  if (overlay.globalMessageEn !== undefined) {
    next = { ...next, globalMessageEn: overlay.globalMessageEn }
  }
  if (overlay.dishPatch) {
    const { id, disabled, soldOut } = overlay.dishPatch
    next = {
      ...next,
      dishes: next.dishes.map((d) =>
        d.id === id
          ? {
              ...d,
              ...(disabled !== undefined ? { disabled } : {}),
              ...(soldOut !== undefined ? { soldOut } : {}),
            }
          : d,
      ),
    }
  }
  if (overlay.binaryItemPatch) {
    const { collection, id, disabled } = overlay.binaryItemPatch
    const patch = (items: { id: number | string; disabled?: boolean | null }[]) =>
      items.map((d) => (d.id === id && disabled !== undefined ? { ...d, disabled } : d))
    if (collection === WINES_SLUG) {
      next = { ...next, wines: patch(next.wines) }
    } else if (collection === DRINKS_SLUG) {
      next = { ...next, drinks: patch(next.drinks) }
    } else if (collection === SPIRITS_SLUG) {
      next = { ...next, spirits: patch(next.spirits) }
    } else if (collection === FIXED_MENUS_SLUG) {
      next = { ...next, fixedMenus: patch(next.fixedMenus) }
    } else if (collection === MENU_SERVICES_SLUG) {
      next = { ...next, services: patch(next.services) }
    }
  }
  return next
}

/**
 * Legge lo stato per `disponibilita.json`. Con `req` (hook) vede anche modifiche non ancora committate,
 * salvo campi localizzati del Global: usare `overlay` dal `doc` dell'hook (REST Admin).
 */
export async function loadMenuAvailabilityState(
  payload: Payload,
  req?: PayloadRequest,
  overlay?: MenuAvailabilityStateOverlay,
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

  return applyOverlay(
    {
      dishes,
      wines,
      drinks,
      spirits,
      fixedMenus,
      services,
      globalMessageIt,
      globalMessageEn,
    },
    overlay,
  )
}
