import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

import {
  DISHES_SLUG,
  DRINKS_SLUG,
  FIXED_MENUS_SLUG,
  MENU_SERVICES_SLUG,
  SPIRITS_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'

import { SUPPRESS_MENU_AVAILABILITY_SYNC_CONTEXT_KEY } from './constants'
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

  await syncMenuAvailabilityFile(req.payload, { req })
  return doc
}

export const menuAvailabilityAfterDelete: CollectionAfterDeleteHook = async ({ collection, req }) => {
  if (!AVAILABILITY_COLLECTION_SLUGS.has(collection.slug)) {
    return
  }
  if (isSyncSuppressed(req.context)) {
    return
  }
  await syncMenuAvailabilityFile(req.payload, { req })
}

export const menuGeneralAvailabilityAfterChange: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (isSyncSuppressed(req.context)) {
    return doc
  }
  await syncMenuAvailabilityFile(req.payload, { req })
  return doc
}

export const menuAvailabilityCollectionHooks = {
  afterChange: [menuAvailabilityAfterChange],
  afterDelete: [menuAvailabilityAfterDelete],
}
