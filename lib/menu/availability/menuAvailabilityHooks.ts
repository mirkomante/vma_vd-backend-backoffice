import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

import {
  DISHES_SLUG,
  DRINKS_SLUG,
  FIXED_MENUS_SLUG,
  MENU_GENERAL_SLUG,
  MENU_SERVICES_SLUG,
  SPIRITS_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'

import { SUPPRESS_MENU_AVAILABILITY_SYNC_CONTEXT_KEY } from './constants'
import { isMenuAvailabilityStateOverlayEnabled } from './devOnlyEnvGuard'
import { overlayFromMenuGeneralHookDoc, type MenuAvailabilityStateOverlay } from './stateOverlay'
import { syncMenuAvailabilityFile } from './syncMenuAvailabilityFile'

const AVAILABILITY_COLLECTION_SLUGS = new Set<string>([
  DISHES_SLUG,
  WINES_SLUG,
  DRINKS_SLUG,
  SPIRITS_SLUG,
  FIXED_MENUS_SLUG,
  MENU_SERVICES_SLUG,
])

function isSyncSuppressed(context: Record<string, unknown> | undefined): boolean {
  return context?.[SUPPRESS_MENU_AVAILABILITY_SYNC_CONTEXT_KEY] === true
}

function dishChangeRelevant(
  doc: Record<string, unknown>,
  previousDoc: Record<string, unknown> | undefined,
  operation: string,
): boolean {
  if (operation === 'create' || operation === 'delete') {
    return true
  }
  return doc.disabled !== previousDoc?.disabled || doc.soldOut !== previousDoc?.soldOut
}

function binaryChangeRelevant(
  doc: Record<string, unknown>,
  previousDoc: Record<string, unknown> | undefined,
  operation: string,
): boolean {
  if (operation === 'create' || operation === 'delete') {
    return true
  }
  return doc.disabled !== previousDoc?.disabled
}

function overlayFromCollectionHook(
  slug: string,
  doc: Record<string, unknown>,
): MenuAvailabilityStateOverlay | undefined {
  const id = doc.id as number | string | undefined
  if (id == null) {
    return undefined
  }
  if (slug === DISHES_SLUG) {
    return {
      dishPatch: {
        id,
        disabled: doc.disabled as boolean | null | undefined,
        soldOut: doc.soldOut as boolean | null | undefined,
      },
    }
  }
  return {
    binaryItemPatch: {
      collection: slug,
      id,
      disabled: doc.disabled as boolean | null | undefined,
    },
  }
}

export const menuAvailabilityAfterChange: CollectionAfterChangeHook = async ({
  collection,
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (!AVAILABILITY_COLLECTION_SLUGS.has(collection.slug)) {
    return doc
  }
  if (isSyncSuppressed(req.context)) {
    return doc
  }

  const current = doc as Record<string, unknown>
  const previous = previousDoc as Record<string, unknown> | undefined
  const relevant =
    collection.slug === DISHES_SLUG
      ? dishChangeRelevant(current, previous, operation)
      : binaryChangeRelevant(current, previous, operation)

  if (!relevant) {
    return doc
  }

  const overlay = isMenuAvailabilityStateOverlayEnabled()
    ? overlayFromCollectionHook(collection.slug, current)
    : undefined
  await syncMenuAvailabilityFile(req.payload, {
    req,
    stateOverlay: overlay,
    origin: { kind: 'collection', slug: collection.slug },
  })
  return doc
}

export const menuAvailabilityAfterDelete: CollectionAfterDeleteHook = async ({ collection, req }) => {
  if (!AVAILABILITY_COLLECTION_SLUGS.has(collection.slug)) {
    return
  }
  if (isSyncSuppressed(req.context)) {
    return
  }
  await syncMenuAvailabilityFile(req.payload, {
    req,
    origin: { kind: 'collection', slug: collection.slug },
  })
}

function summarizeGlobalMessageField(value: unknown): string {
  if (typeof value === 'string') {
    return `string(len=${value.length})`
  }
  if (value && typeof value === 'object') {
    const o = value as { it?: unknown; en?: unknown }
    return `object(it=${typeof o.it},en=${typeof o.en})`
  }
  return String(value)
}

async function augmentMenuGeneralOverlayFromCommittedLocale(
  payload: Parameters<GlobalAfterChangeHook>[0]['req']['payload'],
  overlay: MenuAvailabilityStateOverlay | undefined,
  locale: Parameters<GlobalAfterChangeHook>[0]['req']['locale'],
): Promise<MenuAvailabilityStateOverlay | undefined> {
  if (!overlay) {
    return overlay
  }
  const otherLocale = locale === 'en' ? 'it' : 'en'
  const committed = await payload.findGlobal({
    slug: MENU_GENERAL_SLUG,
    depth: 0,
    locale: otherLocale,
    overrideAccess: true,
    fallbackLocale: false,
  })
  const msg = (committed as { globalMessage?: string | null }).globalMessage
  if (typeof msg !== 'string' || !msg.trim()) {
    return overlay
  }
  if (otherLocale === 'it') {
    return { ...overlay, globalMessageIt: msg }
  }
  return { ...overlay, globalMessageEn: msg }
}

export const menuGeneralAvailabilityAfterChange: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (isSyncSuppressed(req.context)) {
    return doc
  }

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.MENU_AVAILABILITY_DEBUG_HOOK_READ === '1'
  ) {
    const fromReq = await req.payload.findGlobal({
      slug: MENU_GENERAL_SLUG,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
      fallbackLocale: false,
      req,
    })
    const docRecord = doc as Record<string, unknown>
    req.payload.logger.info({
      msg: 'menu-availability-hook-read-compare',
      locale: req.locale ?? null,
      docGlobalMessage: summarizeGlobalMessageField(docRecord.globalMessage),
      findGlobalWithReqGlobalMessage: summarizeGlobalMessageField(
        (fromReq as { globalMessage?: unknown }).globalMessage,
      ),
      docGlobalMessagePreview:
        typeof docRecord.globalMessage === 'string'
          ? docRecord.globalMessage.slice(0, 80)
          : undefined,
      findGlobalPreview:
        typeof (fromReq as { globalMessage?: string }).globalMessage === 'string'
          ? (fromReq as { globalMessage: string }).globalMessage.slice(0, 80)
          : undefined,
    })
  }

  let overlay = isMenuAvailabilityStateOverlayEnabled()
    ? overlayFromMenuGeneralHookDoc(doc as Record<string, unknown>, req.locale)
    : undefined
  if (overlay) {
    overlay = await augmentMenuGeneralOverlayFromCommittedLocale(req.payload, overlay, req.locale)
  }
  await syncMenuAvailabilityFile(req.payload, {
    req,
    stateOverlay: overlay,
    origin: { kind: 'global', slug: MENU_GENERAL_SLUG },
  })
  return doc
}

export const menuAvailabilityCollectionHooks = {
  afterChange: [menuAvailabilityAfterChange],
  afterDelete: [menuAvailabilityAfterDelete],
}
