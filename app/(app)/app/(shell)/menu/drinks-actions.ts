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
  drinkFormToUpdateData,
  drinkFormToWriteData,
  drinkFormValuesFromDrink,
  mapDrinkServerFieldErrors,
  mergeDrinkEnglishFields,
  validateDrinkForm,
  type DrinkFieldErrors,
} from '@/lib/app/drinks/formModel'
import { resolveDrinkSearchIds } from '@/lib/app/drinks/searchDrinkIds'
import type { DrinkFormValues, DrinkListQuery, DrinkListRow } from '@/lib/app/drinks/types'
import { appLocalApiContext } from '@/lib/menu/appPayloadContext'
import {
  buildDrinksListWhere,
  drinkQueryHasActiveFilters,
} from '@/lib/menu/drinks/buildDrinksWhere'
import { COUNTRIES_SLUG, DRINKS_SLUG } from '@/lib/menu/constants'
import type { Country, Drink } from '@/payload-types'

const DRINKS_PATH = '/app/menu/drinks'

export type TaxonomyOption = { id: string; name: string }

function typeFromDrink(drink: Drink): { id: string; name: string } {
  const t = drink.type
  if (typeof t === 'object' && t != null) {
    return { id: String(t.id), name: t.name }
  }
  return { id: String(t), name: '' }
}

function countryNameFromDrink(drink: Drink): string {
  const c = drink.country
  if (c == null) {
    return ''
  }
  if (typeof c === 'object') {
    return c.name
  }
  return ''
}

function drinkToListRow(drink: Drink): DrinkListRow {
  const type = typeFromDrink(drink)
  return {
    id: drink.id,
    name: drink.name,
    volume: drink.volume ?? '',
    abv: drink.abv ?? '',
    typeId: type.id,
    typeName: type.name,
    countryName: countryNameFromDrink(drink),
    price: drink.price,
    disabled: drink.disabled,
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

export type ListDrinksResult =
  | {
      ok: true
      groups: CatalogTypeGroup<DrinkListRow>[]
      rows: DrinkListRow[]
      totalDocs: number
      hasMore: boolean
      emptyDatabase: boolean
      page: number
    }
  | { ok: false; error: 'load' }

export async function listDrinksAction(
  query: DrinkListQuery,
  page: number,
  previousRows: DrinkListRow[],
  typeOrder: ReadonlyArray<{ id: string; name: string }>,
): Promise<ListDrinksResult> {
  const req = await createAppPayloadRequest(DRINKS_PATH)
  const baseWhere = buildDrinksListWhere({ ...query, search: '' }, null)
  let searchIds: Array<number | string> | null = null
  if (query.search.trim()) {
    searchIds = await resolveDrinkSearchIds(req.payload, req, query.search, baseWhere)
  }
  const where = buildDrinksListWhere(query, searchIds)

  const result = await listCatalogPage(DRINKS_PATH, {
    collection: DRINKS_SLUG,
    page,
    where,
    locale: 'it',
    mapDoc: (doc) => drinkToListRow(doc as Drink),
    typeOrder,
    entitySingular: 'bevanda',
    entityPlural: 'bevande',
    queryHasFilters: drinkQueryHasActiveFilters(query),
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

export async function loadDrinkFormAction(
  drinkId: string,
): Promise<
  | { ok: true; values: DrinkFormValues; countries: TaxonomyOption[] }
  | { ok: false; error: 'load' }
> {
  try {
    const req = await createAppPayloadRequest(DRINKS_PATH)
    const drink = (await req.payload.findByID({
      collection: DRINKS_SLUG,
      id: drinkId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Drink

    let values = drinkFormValuesFromDrink(drink)
    try {
      const en = (await req.payload.findByID({
        collection: DRINKS_SLUG,
        id: drinkId,
        depth: 0,
        fallbackLocale: false,
        locale: 'en',
        overrideAccess: false,
        req,
      })) as Drink
      values = mergeDrinkEnglishFields(values, en.name, en.description)
    } catch {
      // nessuna traduzione
    }

    const countries = await countriesWithSaved(req, values.countryId)
    return { ok: true, values, countries }
  } catch {
    return { ok: false, error: 'load' }
  }
}

async function writeDrinkEnglish(
  req: Awaited<ReturnType<typeof createAppPayloadRequest>>,
  id: string | number,
  values: DrinkFormValues,
) {
  const nameEn = values.nameEn.trim()
  const descriptionEn = values.descriptionEn.trim()
  if (!nameEn && !descriptionEn) {
    return
  }
  await req.payload.update({
    id,
    collection: DRINKS_SLUG,
    context: appLocalApiContext().context,
    data: {
      name: nameEn,
      ...(descriptionEn ? { description: descriptionEn } : {}),
    },
    depth: 0,
    fallbackLocale: false,
    locale: 'en',
    overrideAccess: false,
    req,
  })
}

export type SaveDrinkResult =
  | { ok: true; row: DrinkListRow }
  | { ok: false; error: 'server' | 'validation'; fieldErrors?: DrinkFieldErrors }

export async function createDrinkAction(values: DrinkFormValues): Promise<SaveDrinkResult> {
  const fieldErrors = validateDrinkForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  let createdId: string | number | null = null
  const saved = await runCatalogSave(DRINKS_PATH, async () => {
    const req = await createAppPayloadRequest(DRINKS_PATH)
    const data = drinkFormToWriteData(values) as Omit<Drink, 'id' | 'updatedAt' | 'createdAt'>
    const created = (await req.payload.create({
      collection: DRINKS_SLUG,
      context: appLocalApiContext().context,
      data,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Drink
    createdId = created.id
    await writeDrinkEnglish(req, created.id, values)
  })

  if (!saved.ok) {
    return {
      ok: false,
      error: saved.error,
      fieldErrors: saved.fieldErrors
        ? mapDrinkServerFieldErrors(saved.fieldErrors)
        : undefined,
    }
  }

  if (createdId == null) {
    return { ok: false, error: 'server' }
  }

  try {
    const req = await createAppPayloadRequest(DRINKS_PATH)
    const drink = (await req.payload.findByID({
      collection: DRINKS_SLUG,
      id: createdId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Drink
    return { ok: true, row: drinkToListRow(drink) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function updateDrinkAction(
  drinkId: string,
  values: DrinkFormValues,
): Promise<SaveDrinkResult> {
  const fieldErrors = validateDrinkForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  const saved = await runCatalogSave(DRINKS_PATH, async () => {
    const req = await createAppPayloadRequest(DRINKS_PATH)
    const existing = (await req.payload.findByID({
      collection: DRINKS_SLUG,
      id: drinkId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Drink
    const initial = drinkFormValuesFromDrink(existing)
    const patch = drinkFormToUpdateData(initial, values) as Partial<Drink>
    if (Object.keys(patch).length === 0) {
      await writeDrinkEnglish(req, drinkId, values)
      return
    }
    await req.payload.update({
      id: drinkId,
      collection: DRINKS_SLUG,
      context: appLocalApiContext().context,
      data: patch,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })
    await writeDrinkEnglish(req, drinkId, values)
  })

  if (!saved.ok) {
    return {
      ok: false,
      error: saved.error,
      fieldErrors: saved.fieldErrors
        ? mapDrinkServerFieldErrors(saved.fieldErrors)
        : undefined,
    }
  }

  try {
    const req = await createAppPayloadRequest(DRINKS_PATH)
    const drink = (await req.payload.findByID({
      collection: DRINKS_SLUG,
      id: drinkId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Drink
    return { ok: true, row: drinkToListRow(drink) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function patchDrinkDisabledAction(
  drinkId: string,
  disabled: boolean,
): Promise<{ ok: true; row: DrinkListRow } | { ok: false; error: 'server' }> {
  const patched = await patchCatalogDisabled(DRINKS_PATH, DRINKS_SLUG, drinkId, disabled)
  if (!patched.ok) {
    return patched
  }
  try {
    const req = await createAppPayloadRequest(DRINKS_PATH)
    const drink = (await req.payload.findByID({
      collection: DRINKS_SLUG,
      id: drinkId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Drink
    return { ok: true, row: drinkToListRow(drink) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function deleteDrinkAction(
  drinkId: string,
): Promise<{ ok: true } | { ok: false; error: 'server' }> {
  return deleteCatalogItem(DRINKS_PATH, DRINKS_SLUG, drinkId)
}
