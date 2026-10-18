'use server'

import { APIError, ValidationError } from 'payload'

import {
  dishFormToWriteData,
  dishFormValuesFromDish,
  mergeEnglishFields,
  type DishFieldErrors,
  validateDishForm,
} from '@/lib/app/dishes/formModel'
import { resolveDishSearchIds } from '@/lib/app/dishes/searchDishIds'
import type { DishFormValues, DishListQuery } from '@/lib/app/dishes/types'
import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import {
  getMenuDevSimulateLoadDelayMs,
  shouldSimulateMenuLoadError,
  shouldSimulateMenuSaveError,
} from '@/lib/app/menu/devSimulate'
import { appLocalApiContext } from '@/lib/menu/appPayloadContext'
import { buildDishesListWhere } from '@/lib/menu/dishes/buildDishesWhere'
import { groupDishesByCategory, type DishListRow } from '@/lib/menu/dishes/groupByCategory'
import { formatFixedMenusBlockedDeleteDescription } from '@/lib/menu/dishes/formatDeleteBlocked'
import {
  DISHES_SLUG,
  FIXED_MENUS_SLUG,
} from '@/lib/menu/constants'
import type { Dish, FixedMenu } from '@/payload-types'
import { compareItalianNames } from '@/lib/menu/display/sortByItalianName'

const DISH_LIST_LIMIT = 100

export type ListDishesResult =
  | {
      ok: true
      groups: ReturnType<typeof groupDishesByCategory>
      totalDocs: number
      partial: boolean
      emptyDatabase: boolean
    }
  | { ok: false; error: 'load' }

export type SaveDishResult =
  | { ok: true; dish: DishListRow }
  | {
      ok: false
      error: 'server' | 'validation'
      fieldErrors?: DishFieldErrors
    }

export type PatchDishAvailabilityResult =
  | { ok: true; dish: DishListRow }
  | { ok: false; error: 'server' }

export type DeleteDishResult =
  | { ok: true }
  | { ok: false; error: 'server' | 'blocked'; blockedMessage?: string; blockedTitle?: string }

export type FixedMenusUsingDishResult =
  | { ok: true; names: string[]; description: string }
  | { ok: false; error: 'server' }

function categoryIdFromDish(dish: Dish): string {
  const cat = dish.category
  if (typeof cat === 'object' && cat != null) {
    return String(cat.id)
  }
  return String(cat)
}

function categoryNameFromDish(dish: Dish): string {
  const cat = dish.category
  if (typeof cat === 'object' && cat != null) {
    return cat.name
  }
  return ''
}

function dishToListRow(dish: Dish): DishListRow {
  return {
    id: dish.id,
    name: dish.name,
    price: dish.price,
    disabled: dish.disabled,
    soldOut: dish.soldOut,
    categoryId: categoryIdFromDish(dish),
    categoryName: categoryNameFromDish(dish),
  }
}

async function sleepLoadDelay() {
  const ms = getMenuDevSimulateLoadDelayMs()
  if (ms > 0) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
}

function baseWhereWithoutSearch(query: DishListQuery) {
  return buildDishesListWhere({
    categoryId: query.categoryId || null,
    status: query.status,
    noAllergens: query.noAllergens,
    searchDishIds: null,
  })
}

export async function listDishesAction(query: DishListQuery): Promise<ListDishesResult> {
  if (shouldSimulateMenuLoadError()) {
    return { ok: false, error: 'load' }
  }

  await sleepLoadDelay()

  try {
    const req = await createAppPayloadRequest('/app/menu')
    const baseWhere = baseWhereWithoutSearch(query)

    let searchIds: Array<number | string> | null = null
    if (query.search.trim()) {
      const resolved = await resolveDishSearchIds(
        req.payload,
        req,
        query.search,
        baseWhere,
      )
      searchIds = resolved.ids
    }

    const where = buildDishesListWhere({
      categoryId: query.categoryId || null,
      status: query.status,
      noAllergens: query.noAllergens,
      searchDishIds: searchIds,
    })

    const [countRes, found] = await Promise.all([
      req.payload.count({
        collection: DISHES_SLUG,
        overrideAccess: false,
        req,
        where,
      }),
      req.payload.find({
        collection: DISHES_SLUG,
        depth: 1,
        limit: DISH_LIST_LIMIT,
        locale: 'it',
        overrideAccess: false,
        pagination: true,
        req,
        sort: 'name',
        where,
      }),
    ])

    const totalDocs = countRes.totalDocs
    const rows = (found.docs as Dish[]).map(dishToListRow)
    rows.sort((a, b) => compareItalianNames(a.name, b.name))

    const hasActiveFilters =
      Boolean(query.search.trim()) ||
      Boolean(query.categoryId) ||
      query.status !== 'all' ||
      query.noAllergens

    const emptyDatabase = totalDocs === 0 && !hasActiveFilters

    return {
      ok: true,
      groups: groupDishesByCategory(rows),
      totalDocs,
      partial: totalDocs > DISH_LIST_LIMIT,
      emptyDatabase,
    }
  } catch {
    return { ok: false, error: 'load' }
  }
}

export async function loadDishFormAction(dishId: string): Promise<
  | { ok: true; values: DishFormValues }
  | { ok: false; error: 'load' }
> {
  if (shouldSimulateMenuLoadError()) {
    return { ok: false, error: 'load' }
  }

  try {
    const req = await createAppPayloadRequest('/app/menu')
    const dish = (await req.payload.findByID({
      collection: DISHES_SLUG,
      id: dishId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Dish

    let values = dishFormValuesFromDish(dish, categoryIdFromDish(dish))

    try {
      const en = (await req.payload.findByID({
        collection: DISHES_SLUG,
        id: dishId,
        depth: 0,
        fallbackLocale: false,
        locale: 'en',
        overrideAccess: false,
        req,
      })) as Dish
      values = mergeEnglishFields(values, en.name, en.description)
    } catch {
      // nessuna traduzione inglese
    }

    return { ok: true, values }
  } catch {
    return { ok: false, error: 'load' }
  }
}

async function writeEnglishLocale(
  req: Awaited<ReturnType<typeof createAppPayloadRequest>>,
  dishId: number | string,
  values: DishFormValues,
) {
  const nameEn = values.nameEn.trim()
  const descriptionEn = values.descriptionEn.trim()
  if (!nameEn && !descriptionEn) {
    return
  }
  await req.payload.update({
    id: dishId,
    collection: DISHES_SLUG,
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

export async function createDishAction(values: DishFormValues): Promise<SaveDishResult> {
  if (shouldSimulateMenuSaveError()) {
    return { ok: false, error: 'server' }
  }

  const fieldErrors = validateDishForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  try {
    const req = await createAppPayloadRequest('/app/menu')
    const data = dishFormToWriteData(values)
    const created = (await req.payload.create({
      collection: DISHES_SLUG,
      context: appLocalApiContext().context,
      data,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Dish

    await writeEnglishLocale(req, created.id, values)

    const reloaded = (await req.payload.findByID({
      collection: DISHES_SLUG,
      id: created.id,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Dish

    return { ok: true, dish: dishToListRow(reloaded) }
  } catch (error) {
    if (error instanceof ValidationError) {
      return { ok: false, error: 'validation' }
    }
    if (error instanceof APIError && error.status === 403) {
      return { ok: false, error: 'server' }
    }
    return { ok: false, error: 'server' }
  }
}

export async function updateDishAction(
  dishId: string,
  values: DishFormValues,
): Promise<SaveDishResult> {
  if (shouldSimulateMenuSaveError()) {
    return { ok: false, error: 'server' }
  }

  const fieldErrors = validateDishForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  try {
    const req = await createAppPayloadRequest('/app/menu')
    const data = dishFormToWriteData(values)
    await req.payload.update({
      id: dishId,
      collection: DISHES_SLUG,
      context: appLocalApiContext().context,
      data,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })

    await writeEnglishLocale(req, dishId, values)

    const reloaded = (await req.payload.findByID({
      collection: DISHES_SLUG,
      id: dishId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as Dish

    return { ok: true, dish: dishToListRow(reloaded) }
  } catch (error) {
    if (error instanceof ValidationError) {
      return { ok: false, error: 'validation' }
    }
    return { ok: false, error: 'server' }
  }
}

export async function patchDishAvailabilityAction(
  dishId: string,
  patch: { soldOut?: boolean; disabled?: boolean },
): Promise<PatchDishAvailabilityResult> {
  if (shouldSimulateMenuSaveError()) {
    return { ok: false, error: 'server' }
  }

  try {
    const req = await createAppPayloadRequest('/app/menu')
    const updated = (await req.payload.update({
      id: dishId,
      collection: DISHES_SLUG,
      context: appLocalApiContext().context,
      data: patch,
      depth: 1,
      overrideAccess: false,
      req,
    })) as Dish

    return { ok: true, dish: dishToListRow(updated) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function listFixedMenusUsingDishAction(
  dishId: string,
): Promise<FixedMenusUsingDishResult> {
  try {
    const req = await createAppPayloadRequest('/app/menu')
    const found = await req.payload.find({
      collection: FIXED_MENUS_SLUG,
      depth: 0,
      limit: 100,
      locale: 'it',
      overrideAccess: false,
      pagination: false,
      req,
      sort: 'name',
      where: {
        'dishes.dish': { equals: dishId },
      },
    })

    const names = (found.docs as FixedMenu[])
      .map((m) => m.name)
      .sort((a, b) => compareItalianNames(a, b))

    return {
      ok: true,
      names,
      description: formatFixedMenusBlockedDeleteDescription(names),
    }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function deleteDishAction(dishId: string): Promise<DeleteDishResult> {
  if (shouldSimulateMenuSaveError()) {
    return { ok: false, error: 'server' }
  }

  const menus = await listFixedMenusUsingDishAction(dishId)
  if (menus.ok && menus.names.length > 0) {
    const dishReq = await createAppPayloadRequest('/app/menu')
    const dish = (await dishReq.payload.findByID({
      collection: DISHES_SLUG,
      id: dishId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req: dishReq,
    })) as Dish
    return {
      ok: false,
      error: 'blocked',
      blockedTitle: `Non si può eliminare ${dish.name}`,
      blockedMessage: menus.description,
    }
  }

  try {
    const req = await createAppPayloadRequest('/app/menu')
    await req.payload.delete({
      id: dishId,
      collection: DISHES_SLUG,
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
