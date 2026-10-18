import type { CollectionSlug, Where } from 'payload'
import { APIError, ValidationError } from 'payload'

import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import {
  getMenuDevSimulateLoadDelayMs,
  shouldSimulateMenuLoadError,
  shouldSimulateMenuSaveError,
} from '@/lib/app/menu/devSimulate'
import { appLocalApiContext } from '@/lib/menu/appPayloadContext'
import { CATALOG_LIST_LIMIT } from '@/lib/menu/catalog/constants'
import { groupRowsByType, type CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'
import { mergePaginatedRows } from '@/lib/menu/catalog/mergePaginatedRows'

export type CatalogListSuccess<TRow> = {
  ok: true
  rows: TRow[]
  groups: CatalogTypeGroup<TRow>[]
  totalDocs: number
  hasMore: boolean
  emptyDatabase: boolean
  page: number
}

export type CatalogListResult<TRow> = CatalogListSuccess<TRow> | { ok: false; error: 'load' }

export type CatalogFieldErrors = Partial<Record<string, string>>

export async function sleepCatalogLoadDelay(): Promise<void> {
  const ms = getMenuDevSimulateLoadDelayMs()
  if (ms > 0) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export function mapPayloadValidationErrors(error: unknown): CatalogFieldErrors {
  if (!(error instanceof ValidationError)) {
    return {}
  }
  const errors: CatalogFieldErrors = {}
  const list = error.data?.errors ?? []
  for (const item of list) {
    const rawPath = item.path as string | string[] | undefined
    const path = Array.isArray(rawPath) ? rawPath.join('.') : (rawPath ?? '')
    if (path && item.message) {
      errors[path] = item.message
    }
  }
  return errors
}

export async function listCatalogPage<TRow extends { id: number | string; name: string; typeId: string; typeName: string }>(
  path: string,
  opts: {
    collection: CollectionSlug
    page: number
    where: Where
    locale: 'it'
    mapDoc: (doc: unknown) => TRow
    typeOrder: ReadonlyArray<{ id: string; name: string }>
    entitySingular: string
    entityPlural: string
    queryHasFilters: boolean
    previousRows?: readonly TRow[]
  },
): Promise<CatalogListResult<TRow>> {
  if (shouldSimulateMenuLoadError()) {
    return { ok: false, error: 'load' }
  }

  await sleepCatalogLoadDelay()

  try {
    const req = await createAppPayloadRequest(path)
    const [countRes, found] = await Promise.all([
      req.payload.count({
        collection: opts.collection,
        overrideAccess: false,
        req,
        where: opts.where,
      }),
      req.payload.find({
        collection: opts.collection,
        depth: 1,
        limit: CATALOG_LIST_LIMIT,
        locale: opts.locale,
        overrideAccess: false,
        page: opts.page,
        pagination: true,
        req,
        sort: 'name',
        where: opts.where,
      }),
    ])

    const pageRows = found.docs.map((doc) => opts.mapDoc(doc))
    const totalDocs = countRes.totalDocs
    const merged =
      opts.page === 1
        ? pageRows
        : mergePaginatedRows(opts.previousRows ?? [], pageRows)

    const groups = groupRowsByType(merged, opts.entitySingular, opts.entityPlural, opts.typeOrder)
    const hasMore = merged.length < totalDocs
    const emptyDatabase = totalDocs === 0 && !opts.queryHasFilters

    return {
      ok: true,
      rows: merged,
      groups,
      totalDocs,
      hasMore,
      emptyDatabase,
      page: opts.page,
    }
  } catch {
    return { ok: false, error: 'load' }
  }
}

export async function patchCatalogDisabled(
  path: string,
  collection: CollectionSlug,
  id: string,
  disabled: boolean,
): Promise<{ ok: true } | { ok: false; error: 'server' }> {
  if (shouldSimulateMenuSaveError()) {
    return { ok: false, error: 'server' }
  }
  try {
    const req = await createAppPayloadRequest(path)
    await req.payload.update({
      id,
      collection,
      context: appLocalApiContext().context,
      data: { disabled },
      depth: 0,
      overrideAccess: false,
      req,
    })
    return { ok: true }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function deleteCatalogItem(
  path: string,
  collection: CollectionSlug,
  id: string,
): Promise<{ ok: true } | { ok: false; error: 'server' }> {
  if (shouldSimulateMenuSaveError()) {
    return { ok: false, error: 'server' }
  }
  try {
    const req = await createAppPayloadRequest(path)
    await req.payload.delete({
      id,
      collection,
      context: appLocalApiContext().context,
      depth: 0,
      overrideAccess: false,
      req,
    })
    return { ok: true }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function runCatalogSave<TFieldErrors extends CatalogFieldErrors>(
  path: string,
  run: () => Promise<void>,
): Promise<
  | { ok: true }
  | { ok: false; error: 'server' | 'validation'; fieldErrors?: TFieldErrors }
> {
  if (shouldSimulateMenuSaveError()) {
    return { ok: false, error: 'server' }
  }
  try {
    await run()
    return { ok: true }
  } catch (error) {
    if (error instanceof ValidationError) {
      return { ok: false, error: 'validation', fieldErrors: mapPayloadValidationErrors(error) as TFieldErrors }
    }
    if (error instanceof APIError && error.status === 403) {
      return { ok: false, error: 'server' }
    }
    return { ok: false, error: 'server' }
  }
}
