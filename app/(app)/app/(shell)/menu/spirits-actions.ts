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
  mapSpiritServerFieldErrors,
  mergeSpiritEnglishDescription,
  spiritFormToUpdateData,
  spiritFormToWriteData,
  spiritFormValuesFromSpirit,
  validateSpiritForm,
  type SpiritFieldErrors,
} from '@/lib/app/spirits/formModel'
import { resolveSpiritSearchIds } from '@/lib/app/spirits/searchSpiritIds'
import type { SpiritFormValues, SpiritListQuery, SpiritListRow } from '@/lib/app/spirits/types'
import { appLocalApiContext } from '@/lib/menu/appPayloadContext'
import {
  buildSpiritsListWhere,
  spiritQueryHasActiveFilters,
} from '@/lib/menu/spirits/buildSpiritsWhere'
import { COUNTRIES_SLUG, SPIRITS_SLUG } from '@/lib/menu/constants'
import type { Country, Spirit } from '@/payload-types'

const SPIRITS_PATH = '/app/menu/spirits'

export type TaxonomyOption = { id: string; name: string }

function typeFromSpirit(spirit: Spirit): { id: string; name: string } {
  const t = spirit.type
  if (typeof t === 'object' && t != null) {
    return { id: String(t.id), name: t.name }
  }
  return { id: String(t), name: '' }
}

function countryNameFromSpirit(spirit: Spirit): string {
  const c = spirit.country
  if (typeof c === 'object' && c != null) {
    return c.name
  }
  return ''
}

function spiritToListRow(spirit: Spirit): SpiritListRow {
  const type = typeFromSpirit(spirit)
  return {
    id: spirit.id,
    name: spirit.name,
    aging: spirit.aging ?? '',
    abv: spirit.abv ?? '',
    typeId: type.id,
    typeName: type.name,
    countryName: countryNameFromSpirit(spirit),
    price: spirit.price,
    disabled: spirit.disabled,
  }
}

async function countriesWithSaved(
  req: Awaited<ReturnType<typeof createAppPayloadRequest>>,
  savedCountryId?: string,
): Promise<TaxonomyOption[]> {
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
  if (savedCountryId && !countries.some((c) => c.id === savedCountryId)) {
    try {
      const c = await req.payload.findByID({
        collection: COUNTRIES_SLUG,
        id: savedCountryId,
        depth: 0,
        locale: 'it',
        overrideAccess: false,
        req,
      })
      countries.push({ id: savedCountryId, name: (c as Country).name })
    } catch {
      // ignore
    }
  }
  return countries
}

export type ListSpiritsResult =
  | {
      ok: true
      groups: CatalogTypeGroup<SpiritListRow>[]
      rows: SpiritListRow[]
      totalDocs: number
      hasMore: boolean
      emptyDatabase: boolean
      page: number
    }
  | { ok: false; error: 'load' }

export async function listSpiritsAction(
  query: SpiritListQuery,
  page: number,
  previousRows: SpiritListRow[],
  typeOrder: ReadonlyArray<{ id: string; name: string }>,
): Promise<ListSpiritsResult> {
  const req = await createAppPayloadRequest(SPIRITS_PATH)
  const baseWhere = buildSpiritsListWhere({ ...query, search: '' }, null)
  let searchIds: Array<number | string> | null = null
  if (query.search.trim()) {
    searchIds = await resolveSpiritSearchIds(req.payload, req, query.search, baseWhere)
  }
  const where = buildSpiritsListWhere(query, searchIds)

  const result = await listCatalogPage(SPIRITS_PATH, {
    collection: SPIRITS_SLUG,
    page,
    where,
    locale: 'it',
    mapDoc: (doc) => spiritToListRow(doc as Spirit),
    typeOrder,
    entitySingular: 'distillato',
    entityPlural: 'distillati',
    queryHasFilters: spiritQueryHasActiveFilters(query),
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

export async function loadSpiritFormAction(
  spiritId: string,
): Promise<
  | { ok: true; values: SpiritFormValues; countries: TaxonomyOption[] }
  | { ok: false; error: 'load' }
> {
  try {
    const req = await createAppPayloadRequest(SPIRITS_PATH)
    const spirit = (await req.payload.findByID({
      collection: SPIRITS_SLUG,
      id: spiritId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Spirit

    let values = spiritFormValuesFromSpirit(spirit)
    try {
      const en = (await req.payload.findByID({
        collection: SPIRITS_SLUG,
        id: spiritId,
        depth: 0,
        fallbackLocale: false,
        locale: 'en',
        overrideAccess: false,
        req,
      })) as Spirit
      values = mergeSpiritEnglishDescription(values, en.description)
    } catch {
      // nessuna traduzione
    }

    const countries = await countriesWithSaved(req, values.countryId)
    return { ok: true, values, countries }
  } catch {
    return { ok: false, error: 'load' }
  }
}

async function writeSpiritEnglish(
  req: Awaited<ReturnType<typeof createAppPayloadRequest>>,
  id: string | number,
  values: SpiritFormValues,
) {
  const descriptionEn = values.descriptionEn.trim()
  if (!descriptionEn) {
    return
  }
  await req.payload.update({
    id,
    collection: SPIRITS_SLUG,
    context: appLocalApiContext().context,
    data: { description: descriptionEn },
    depth: 0,
    fallbackLocale: false,
    locale: 'en',
    overrideAccess: false,
    req,
  })
}

export type SaveSpiritResult =
  | { ok: true; row: SpiritListRow }
  | { ok: false; error: 'server' | 'validation'; fieldErrors?: SpiritFieldErrors }

export async function createSpiritAction(values: SpiritFormValues): Promise<SaveSpiritResult> {
  const fieldErrors = validateSpiritForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  let createdId: string | number | null = null
  const saved = await runCatalogSave(SPIRITS_PATH, async () => {
    const req = await createAppPayloadRequest(SPIRITS_PATH)
    const data = spiritFormToWriteData(values) as Omit<Spirit, 'id' | 'updatedAt' | 'createdAt'>
    const created = (await req.payload.create({
      collection: SPIRITS_SLUG,
      context: appLocalApiContext().context,
      data,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Spirit
    createdId = created.id
    await writeSpiritEnglish(req, created.id, values)
  })

  if (!saved.ok) {
    return {
      ok: false,
      error: saved.error,
      fieldErrors: saved.fieldErrors
        ? mapSpiritServerFieldErrors(saved.fieldErrors)
        : undefined,
    }
  }

  if (createdId == null) {
    return { ok: false, error: 'server' }
  }

  try {
    const req = await createAppPayloadRequest(SPIRITS_PATH)
    const spirit = (await req.payload.findByID({
      collection: SPIRITS_SLUG,
      id: createdId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Spirit
    return { ok: true, row: spiritToListRow(spirit) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function updateSpiritAction(
  spiritId: string,
  values: SpiritFormValues,
): Promise<SaveSpiritResult> {
  const fieldErrors = validateSpiritForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  const saved = await runCatalogSave(SPIRITS_PATH, async () => {
    const req = await createAppPayloadRequest(SPIRITS_PATH)
    const existing = (await req.payload.findByID({
      collection: SPIRITS_SLUG,
      id: spiritId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Spirit
    const initial = spiritFormValuesFromSpirit(existing)
    const patch = spiritFormToUpdateData(initial, values) as Partial<Spirit>
    if (Object.keys(patch).length === 0) {
      await writeSpiritEnglish(req, spiritId, values)
      return
    }
    await req.payload.update({
      id: spiritId,
      collection: SPIRITS_SLUG,
      context: appLocalApiContext().context,
      data: patch,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })
    await writeSpiritEnglish(req, spiritId, values)
  })

  if (!saved.ok) {
    return {
      ok: false,
      error: saved.error,
      fieldErrors: saved.fieldErrors
        ? mapSpiritServerFieldErrors(saved.fieldErrors)
        : undefined,
    }
  }

  try {
    const req = await createAppPayloadRequest(SPIRITS_PATH)
    const spirit = (await req.payload.findByID({
      collection: SPIRITS_SLUG,
      id: spiritId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Spirit
    return { ok: true, row: spiritToListRow(spirit) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function patchSpiritDisabledAction(
  spiritId: string,
  disabled: boolean,
): Promise<{ ok: true; row: SpiritListRow } | { ok: false; error: 'server' }> {
  const patched = await patchCatalogDisabled(SPIRITS_PATH, SPIRITS_SLUG, spiritId, disabled)
  if (!patched.ok) {
    return patched
  }
  try {
    const req = await createAppPayloadRequest(SPIRITS_PATH)
    const spirit = (await req.payload.findByID({
      collection: SPIRITS_SLUG,
      id: spiritId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Spirit
    return { ok: true, row: spiritToListRow(spirit) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function deleteSpiritAction(
  spiritId: string,
): Promise<{ ok: true } | { ok: false; error: 'server' }> {
  return deleteCatalogItem(SPIRITS_PATH, SPIRITS_SLUG, spiritId)
}
