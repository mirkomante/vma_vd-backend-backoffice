'use server'

import {
  deleteCatalogItem,
  listCatalogPage,
  patchCatalogDisabled,
  runCatalogSave,
} from '@/lib/app/menu/catalog/catalogActions'
import type { CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'
import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import {
  mergeWineEnglishDescription,
  validateWineForm,
  wineFormToUpdateData,
  wineFormToWriteData,
  wineFormValuesFromWine,
  type WineFieldErrors,
} from '@/lib/app/wines/formModel'
import { resolveWineSearchIds } from '@/lib/app/wines/searchWineIds'
import type { WineFormValues, WineListQuery, WineListRow } from '@/lib/app/wines/types'
import { appLocalApiContext } from '@/lib/menu/appPayloadContext'
import { buildWinesListWhere, wineQueryHasActiveFilters } from '@/lib/menu/wines/buildWinesWhere'
import {
  APPELLATIONS_SLUG,
  CLASSIFICATIONS_SLUG,
  COUNTRIES_SLUG,
  REGIONS_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'
import type { Appellation, Classification, Country, Region, Wine } from '@/payload-types'

const WINES_PATH = '/app/menu/wines'

function typeFromWine(wine: Wine): { id: string; name: string } {
  const t = wine.type
  if (typeof t === 'object' && t != null) {
    return { id: String(t.id), name: t.name }
  }
  return { id: String(t), name: '' }
}

function countryNameFromWine(wine: Wine): string {
  const c = wine.country
  if (typeof c === 'object' && c != null) {
    return c.name
  }
  return ''
}

function regionNameFromWine(wine: Wine): string {
  const r = wine.region
  if (typeof r === 'object' && r != null) {
    return r.name
  }
  return ''
}

function wineToListRow(wine: Wine): WineListRow {
  const type = typeFromWine(wine)
  return {
    id: wine.id,
    name: wine.name,
    winery: wine.winery ?? '',
    year: wine.year ?? '',
    typeId: type.id,
    typeName: type.name,
    countryName: countryNameFromWine(wine),
    regionName: regionNameFromWine(wine),
    price: wine.price,
    glassPrice: wine.glassPrice ?? null,
    disabled: wine.disabled,
  }
}

export type ListWinesResult =
  | {
      ok: true
      groups: CatalogTypeGroup<WineListRow>[]
      rows: WineListRow[]
      totalDocs: number
      hasMore: boolean
      emptyDatabase: boolean
      page: number
    }
  | { ok: false; error: 'load' }

export async function listWinesAction(
  query: WineListQuery,
  page: number,
  previousRows: WineListRow[],
  typeOrder: ReadonlyArray<{ id: string; name: string }>,
): Promise<ListWinesResult> {
  const req = await createAppPayloadRequest(WINES_PATH)
  const baseWhere = buildWinesListWhere(
    { ...query, search: '' },
    null,
  )
  let searchIds: Array<number | string> | null = null
  if (query.search.trim()) {
    searchIds = await resolveWineSearchIds(req.payload, req, query.search, baseWhere)
  }
  const where = buildWinesListWhere(query, searchIds)

  const result = await listCatalogPage(WINES_PATH, {
    collection: WINES_SLUG,
    page,
    where,
    locale: 'it',
    mapDoc: (doc) => wineToListRow(doc as Wine),
    typeOrder,
    entitySingular: 'vino',
    entityPlural: 'vini',
    queryHasFilters: wineQueryHasActiveFilters(query),
    previousRows: page > 1 ? previousRows : undefined,
  })

  if (!result.ok) {
    return result
  }

  return {
    ok: true,
    groups: result.groups,
    rows: result.rows,
    totalDocs: result.totalDocs,
    hasMore: result.hasMore,
    emptyDatabase: result.emptyDatabase,
    page: result.page,
  }
}

export async function loadWineFormAction(
  wineId: string,
): Promise<{ ok: true; values: WineFormValues } | { ok: false; error: 'load' }> {
  try {
    const req = await createAppPayloadRequest(WINES_PATH)
    const wine = (await req.payload.findByID({
      collection: WINES_SLUG,
      id: wineId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Wine

    let values = wineFormValuesFromWine(wine)
    try {
      const en = (await req.payload.findByID({
        collection: WINES_SLUG,
        id: wineId,
        depth: 0,
        fallbackLocale: false,
        locale: 'en',
        overrideAccess: false,
        req,
      })) as Wine
      values = mergeWineEnglishDescription(values, en.description)
    } catch {
      // nessuna traduzione
    }
    return { ok: true, values }
  } catch {
    return { ok: false, error: 'load' }
  }
}

async function writeWineEnglish(req: Awaited<ReturnType<typeof createAppPayloadRequest>>, id: string | number, values: WineFormValues) {
  const descriptionEn = values.descriptionEn.trim()
  if (!descriptionEn) {
    return
  }
  await req.payload.update({
    id,
    collection: WINES_SLUG,
    context: appLocalApiContext().context,
    data: { description: descriptionEn },
    depth: 0,
    fallbackLocale: false,
    locale: 'en',
    overrideAccess: false,
    req,
  })
}

export type SaveWineResult =
  | { ok: true; row: WineListRow }
  | { ok: false; error: 'server' | 'validation'; fieldErrors?: WineFieldErrors }

export async function createWineAction(values: WineFormValues): Promise<SaveWineResult> {
  const fieldErrors = validateWineForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  let createdId: string | number | null = null
  const saved = await runCatalogSave(WINES_PATH, async () => {
    const req = await createAppPayloadRequest(WINES_PATH)
    const data = wineFormToWriteData(values) as Omit<Wine, 'id' | 'updatedAt' | 'createdAt'>
    const created = (await req.payload.create({
      collection: WINES_SLUG,
      context: appLocalApiContext().context,
      data,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Wine
    createdId = created.id
    await writeWineEnglish(req, created.id, values)
  })

  if (!saved.ok) {
    return {
      ok: false,
      error: saved.error,
      fieldErrors: saved.fieldErrors,
    }
  }

  if (createdId == null) {
    return { ok: false, error: 'server' }
  }

  try {
    const req = await createAppPayloadRequest(WINES_PATH)
    const wine = (await req.payload.findByID({
      collection: WINES_SLUG,
      id: createdId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Wine
    return { ok: true, row: wineToListRow(wine) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function updateWineAction(wineId: string, values: WineFormValues): Promise<SaveWineResult> {
  const fieldErrors = validateWineForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  const saved = await runCatalogSave(WINES_PATH, async () => {
    const req = await createAppPayloadRequest(WINES_PATH)
    const existing = (await req.payload.findByID({
      collection: WINES_SLUG,
      id: wineId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Wine
    const initial = wineFormValuesFromWine(existing)
    const patch = wineFormToUpdateData(initial, values) as Partial<Wine>
    if (Object.keys(patch).length === 0) {
      return
    }
    await req.payload.update({
      id: wineId,
      collection: WINES_SLUG,
      context: appLocalApiContext().context,
      data: patch,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })
    await writeWineEnglish(req, wineId, values)
  })

  if (!saved.ok) {
    return {
      ok: false,
      error: saved.error,
      fieldErrors: saved.fieldErrors,
    }
  }

  try {
    const req = await createAppPayloadRequest(WINES_PATH)
    const wine = (await req.payload.findByID({
      collection: WINES_SLUG,
      id: wineId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Wine
    return { ok: true, row: wineToListRow(wine) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function patchWineDisabledAction(
  wineId: string,
  disabled: boolean,
): Promise<{ ok: true; row: WineListRow } | { ok: false; error: 'server' }> {
  const patched = await patchCatalogDisabled(WINES_PATH, WINES_SLUG, wineId, disabled)
  if (!patched.ok) {
    return patched
  }
  try {
    const req = await createAppPayloadRequest(WINES_PATH)
    const wine = (await req.payload.findByID({
      collection: WINES_SLUG,
      id: wineId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Wine
    return { ok: true, row: wineToListRow(wine) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function deleteWineAction(
  wineId: string,
): Promise<{ ok: true } | { ok: false; error: 'server' }> {
  return deleteCatalogItem(WINES_PATH, WINES_SLUG, wineId)
}

export type TaxonomyOption = { id: string; name: string }

export async function loadWineOriginOptionsAction(opts: {
  countryId?: string
  regionId?: string
  savedCountryId?: string
  savedRegionId?: string
  savedAppellationId?: string
  savedClassificationId?: string
}): Promise<{
  countries: TaxonomyOption[]
  regions: TaxonomyOption[]
  appellations: TaxonomyOption[]
  classifications: TaxonomyOption[]
}> {
  const req = await createAppPayloadRequest(WINES_PATH)

  const countriesRes = await req.payload.find({
    collection: COUNTRIES_SLUG,
    depth: 0,
    limit: 100,
    locale: 'it',
    overrideAccess: false,
    pagination: false,
    req,
    where: { enabled: { equals: true } },
    sort: 'name',
  })

  const countries = (countriesRes.docs as Country[]).map((c) => ({
    id: String(c.id),
    name: c.name,
  }))

  const mergeSaved = async (
    list: TaxonomyOption[],
    slug: typeof REGIONS_SLUG | typeof APPELLATIONS_SLUG | typeof CLASSIFICATIONS_SLUG,
    savedId?: string,
  ): Promise<TaxonomyOption[]> => {
    if (!savedId || list.some((x) => x.id === savedId)) {
      return list
    }
    try {
      const doc = await req.payload.findByID({
        collection: slug,
        id: savedId,
        depth: 0,
        locale: 'it',
        overrideAccess: false,
        req,
      })
      const name = (doc as Region | Appellation | Classification).name
      return [...list, { id: savedId, name }]
    } catch {
      return list
    }
  }

  let regions: TaxonomyOption[] = []
  if (opts.countryId) {
    const res = await req.payload.find({
      collection: REGIONS_SLUG,
      depth: 0,
      limit: 200,
      locale: 'it',
      overrideAccess: false,
      pagination: false,
      req,
      sort: 'name',
      where: {
        and: [
          { country: { equals: opts.countryId } },
          { enabled: { equals: true } },
        ],
      },
    })
    regions = (res.docs as Region[]).map((r) => ({ id: String(r.id), name: r.name }))
    regions = await mergeSaved(regions, REGIONS_SLUG, opts.savedRegionId)
  }

  let appellations: TaxonomyOption[] = []
  if (opts.regionId) {
    const res = await req.payload.find({
      collection: APPELLATIONS_SLUG,
      depth: 0,
      limit: 200,
      overrideAccess: false,
      pagination: false,
      req,
      sort: 'name',
      where: { region: { equals: opts.regionId } },
    })
    appellations = (res.docs as Appellation[]).map((a) => ({
      id: String(a.id),
      name: a.name,
    }))
    appellations = await mergeSaved(appellations, APPELLATIONS_SLUG, opts.savedAppellationId)
  }

  let classifications: TaxonomyOption[] = []
  if (opts.countryId) {
    const res = await req.payload.find({
      collection: CLASSIFICATIONS_SLUG,
      depth: 0,
      limit: 200,
      overrideAccess: false,
      pagination: false,
      req,
      sort: 'name',
      where: { country: { equals: opts.countryId } },
    })
    classifications = (res.docs as Classification[]).map((c) => ({
      id: String(c.id),
      name: c.name,
    }))
    classifications = await mergeSaved(
      classifications,
      CLASSIFICATIONS_SLUG,
      opts.savedClassificationId,
    )
  }

  if (opts.savedCountryId && !countries.some((c) => c.id === opts.savedCountryId)) {
    try {
      const c = await req.payload.findByID({
        collection: COUNTRIES_SLUG,
        id: opts.savedCountryId,
        depth: 0,
        locale: 'it',
        overrideAccess: false,
        req,
      })
      countries.push({ id: opts.savedCountryId, name: (c as Country).name })
    } catch {
      // ignore
    }
  }

  return { countries, regions, appellations, classifications }
}
