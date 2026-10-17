import type { CollectionBeforeDeleteHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

import { logActivity } from '@/lib/activityLog/logActivity'
import type { ActivityLogArea } from '@/lib/activityLog/constants'
import { isActiveAppManagerRequest, isStaffAdminRequest } from '@/lib/auth/userAccess'
import {
  DISHES_SLUG,
  DRINKS_SLUG,
  FIXED_MENUS_SLUG,
  MENU_SERVICES_SLUG,
  SPECIAL_DAYS_SLUG,
  SPIRITS_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'
import { parseAndNormalizeSpecialDayDate } from '@/lib/menu/specialDayDate'

/**
 * Area del registro per azioni Local API dall'App: passare
 * `context: { [ACTIVITY_AREA_CONTEXT_KEY]: 'app' }` (o `'admin'`) alla delete/update,
 * così un admin che opera dall'App risulta `area: app` nel registro.
 */
export const ACTIVITY_AREA_CONTEXT_KEY = 'activityArea'

const MENU_CONTENT_DELETE_LOG_CONTEXT_KEY = 'menuContentDeleteLog'

type DeleteLogContextPayload = {
  detail: string
  documentId: string
}

const LOGGED_COLLECTION_SLUGS = new Set<string>([
  DISHES_SLUG,
  WINES_SLUG,
  SPIRITS_SLUG,
  DRINKS_SLUG,
  MENU_SERVICES_SLUG,
  FIXED_MENUS_SLUG,
  SPECIAL_DAYS_SLUG,
])

export function formatMenuContentDeleteDetail(name: string, referenceCount: number): string {
  return `nome=${name}; riferimenti=${referenceCount}`
}

function readActivityAreaFromContext(context: Record<string, unknown> | undefined): ActivityLogArea | undefined {
  const raw = context?.[ACTIVITY_AREA_CONTEXT_KEY]
  if (raw === 'app' || raw === 'admin') {
    return raw
  }
  return undefined
}

/** Risoluzione `area` per voci `delete` del registro (ordine: context → API Admin → ruoli). */
export function resolveDeleteLogArea(req: PayloadRequest): ActivityLogArea | undefined {
  const fromContext = readActivityAreaFromContext(req.context)
  if (fromContext) {
    return fromContext
  }

  if (req.payloadAPI && req.payloadAPI !== 'local') {
    return 'admin'
  }

  if (isStaffAdminRequest(req)) {
    return 'admin'
  }
  if (isActiveAppManagerRequest(req)) {
    return 'app'
  }

  return undefined
}

function specialDayDateOnlyLabel(date: unknown): string {
  if (typeof date !== 'string' || !date.trim()) {
    return '?'
  }
  try {
    const normalized = parseAndNormalizeSpecialDayDate(date)
    return normalized.slice(0, 10)
  } catch {
    const iso = /^(\d{4}-\d{2}-\d{2})/.exec(date.trim())
    return iso?.[1] ?? '?'
  }
}

function displayNameForDelete(collectionSlug: string, doc: Record<string, unknown>): string {
  if (collectionSlug === SPECIAL_DAYS_SLUG) {
    const dateLabel = specialDayDateOnlyLabel(doc.date)
    const scope = typeof doc.scope === 'string' ? doc.scope : '?'
    return `${dateLabel} ambito=${scope}`
  }

  const name = doc.name
  if (typeof name === 'string' && name.trim()) {
    return name.trim()
  }
  return String(doc.id ?? '?')
}

async function countDeleteReferences(
  req: PayloadRequest,
  collectionSlug: string,
  id: number | string,
): Promise<number> {
  // Conteggio read-only interno: non deve dipendere dai permessi di chi cancella.
  const countOpts = {
    depth: 0 as const,
    overrideAccess: true as const,
    req,
  }

  if (collectionSlug === MENU_SERVICES_SLUG) {
    const result = await req.payload.count({
      collection: FIXED_MENUS_SLUG,
      where: {
        services: { contains: id },
      },
      ...countOpts,
    })
    return result.totalDocs
  }

  if (collectionSlug === FIXED_MENUS_SLUG) {
    const result = await req.payload.count({
      collection: SPECIAL_DAYS_SLUG,
      where: {
        'content.fixedMenus': { contains: id },
      },
      ...countOpts,
    })
    return result.totalDocs
  }

  return 0
}

export const menuContentDeleteBeforeDelete: CollectionBeforeDeleteHook = async ({ collection, req, id }) => {
  if (!LOGGED_COLLECTION_SLUGS.has(collection.slug)) {
    return
  }

  const needsLocale =
    collection.slug !== WINES_SLUG && collection.slug !== SPIRITS_SLUG && collection.slug !== SPECIAL_DAYS_SLUG

  const existing = await req.payload.findByID({
    collection: collection.slug,
    id,
    depth: 0,
    overrideAccess: true,
    req,
    ...(needsLocale ? { locale: 'it' as const } : {}),
  })

  const record = existing as unknown as Record<string, unknown>
  const documentId = String(id)
  const name = displayNameForDelete(collection.slug, record)
  const referenceCount = await countDeleteReferences(req, collection.slug, id)

  req.context = req.context ?? {}
  req.context[MENU_CONTENT_DELETE_LOG_CONTEXT_KEY] = {
    detail: formatMenuContentDeleteDetail(name, referenceCount),
    documentId,
  } satisfies DeleteLogContextPayload
}

export const menuContentDeleteAfterDelete: CollectionAfterDeleteHook = async ({ collection, req, id }) => {
  if (!LOGGED_COLLECTION_SLUGS.has(collection.slug)) {
    return
  }

  const userId = req.user?.id
  if (userId == null) {
    return
  }

  const stored = req.context?.[MENU_CONTENT_DELETE_LOG_CONTEXT_KEY] as DeleteLogContextPayload | undefined
  const documentId = stored?.documentId ?? String(id)
  const detail = stored?.detail ?? formatMenuContentDeleteDetail('?', 0)

  await logActivity(req, {
    user: userId,
    eventType: 'delete',
    area: resolveDeleteLogArea(req),
    collection: collection.slug,
    documentId,
    detail,
  })
}

export const menuContentDeleteLogHooks = {
  beforeDelete: [menuContentDeleteBeforeDelete],
  afterDelete: [menuContentDeleteAfterDelete],
}
