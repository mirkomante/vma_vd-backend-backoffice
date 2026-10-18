'use server'

import {
  deleteCatalogItem,
  patchCatalogDisabled,
  runCatalogSave,
} from '@/lib/app/menu/catalog/catalogActions'
import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import {
  fixedMenuCategoryFormToUpdateData,
  fixedMenuCategoryFormToWriteData,
  fixedMenuCategoryFormValuesFromDoc,
  mergeFixedMenuCategoryEnglishName,
  validateFixedMenuCategoryForm,
  type FixedMenuCategoryFieldErrors,
} from '@/lib/app/fixedMenus/categoryFormModel'
import {
  fixedMenuFormToUpdateData,
  fixedMenuFormToWriteData,
  fixedMenuFormValuesFromDoc,
  validateFixedMenuForm,
  type FixedMenuFieldErrors,
} from '@/lib/app/fixedMenus/formModel'
import { buildFixedMenuEnglishUpdateData } from '@/lib/app/fixedMenus/writeFixedMenuEnglish'
import type {
  FixedMenuCategoryFormValues,
  FixedMenuCategoryListRow,
  FixedMenuFormValues,
  FixedMenuListRow,
} from '@/lib/app/fixedMenus/types'
import { appLocalApiContext } from '@/lib/menu/appPayloadContext'
import { CATALOG_LIST_LIMIT } from '@/lib/menu/catalog/constants'
import { mergePaginatedRows } from '@/lib/menu/catalog/mergePaginatedRows'
import {
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
  SPECIAL_DAYS_SLUG,
} from '@/lib/menu/constants'
import { groupFixedMenusByCategory } from '@/lib/menu/fixedMenus/groupFixedMenusByCategory'
import type { CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'
import { relationshipId, relationshipName } from '@/lib/menu/relationshipId'
import type { FixedMenu, FixedMenuCategory, SpecialDay } from '@/payload-types'

const FIXED_MENUS_PATH = '/app/menu/fixed'
const FIXED_CATEGORIES_PATH = '/app/menu/fixed/categories'

function fixedMenuToListRow(doc: FixedMenu): FixedMenuListRow | null {
  const categoryId = relationshipId(doc.category)
  if (categoryId == null) {
    return null
  }
  const categoryObj =
    typeof doc.category === 'object' && doc.category !== null ? doc.category : null
  return {
    id: doc.id,
    name: doc.name,
    price: doc.price,
    visibility: doc.visibility,
    disabled: doc.disabled,
    specialOnly: doc.specialOnly,
    dishCount: doc.dishes?.length ?? 0,
    categoryId: String(categoryId),
    categoryName: categoryObj?.name ?? relationshipName(doc.category),
    categoryDisabled: Boolean(categoryObj?.disabled),
    categoryVisibility: categoryObj?.visibility ?? 'always',
  }
}

export type ListFixedMenusResult =
  | {
      ok: true
      rows: FixedMenuListRow[]
      groups: CatalogTypeGroup<FixedMenuListRow>[]
      totalDocs: number
      hasMore: boolean
      emptyDatabase: boolean
      page: number
    }
  | { ok: false; error: 'load' }

export async function listFixedMenusAction(
  page: number,
  previousRows?: readonly FixedMenuListRow[],
): Promise<ListFixedMenusResult> {
  try {
    const req = await createAppPayloadRequest(FIXED_MENUS_PATH)
    const [countRes, found] = await Promise.all([
      req.payload.count({
        collection: FIXED_MENUS_SLUG,
        overrideAccess: false,
        req,
      }),
      req.payload.find({
        collection: FIXED_MENUS_SLUG,
        depth: 1,
        limit: CATALOG_LIST_LIMIT,
        locale: 'it',
        overrideAccess: false,
        page,
        pagination: true,
        req,
        sort: 'name',
      }),
    ])

    const pageRows = (found.docs as FixedMenu[])
      .map(fixedMenuToListRow)
      .filter((row): row is FixedMenuListRow => row != null)
    const totalDocs = countRes.totalDocs
    const merged = page === 1 ? pageRows : mergePaginatedRows(previousRows ?? [], pageRows)

    const groups = groupFixedMenusByCategory(merged)
    const hasMore = merged.length < totalDocs
    return {
      ok: true,
      rows: merged,
      groups,
      totalDocs,
      hasMore,
      emptyDatabase: totalDocs === 0,
      page,
    }
  } catch {
    return { ok: false, error: 'load' }
  }
}

export type LoadFixedMenuFormResult =
  | { ok: true; values: FixedMenuFormValues }
  | { ok: false; error: 'load' }

export async function loadFixedMenuFormAction(menuId: string): Promise<LoadFixedMenuFormResult> {
  try {
    const req = await createAppPayloadRequest(FIXED_MENUS_PATH)
    const doc = (await req.payload.findByID({
      collection: FIXED_MENUS_SLUG,
      id: menuId,
      depth: 2,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as FixedMenu

    let en: FixedMenu | null = null
    try {
      en = (await req.payload.findByID({
        collection: FIXED_MENUS_SLUG,
        id: menuId,
        depth: 0,
        fallbackLocale: false,
        locale: 'en',
        overrideAccess: false,
        req,
      })) as FixedMenu
    } catch {
      // nessuna traduzione
    }

    return { ok: true, values: fixedMenuFormValuesFromDoc(doc, en) }
  } catch {
    return { ok: false, error: 'load' }
  }
}

async function writeFixedMenuEnglish(
  req: Awaited<ReturnType<typeof createAppPayloadRequest>>,
  id: string | number,
  itDoc: FixedMenu,
  values: FixedMenuFormValues,
) {
  const data = buildFixedMenuEnglishUpdateData(itDoc, values)
  await req.payload.update({
    id,
    collection: FIXED_MENUS_SLUG,
    context: appLocalApiContext().context,
    data,
    depth: 0,
    fallbackLocale: false,
    locale: 'en',
    overrideAccess: false,
    req,
  })
}

export type SaveFixedMenuResult =
  | { ok: true; row: FixedMenuListRow }
  | { ok: false; error: 'server' | 'validation'; fieldErrors?: FixedMenuFieldErrors }

export async function createFixedMenuAction(values: FixedMenuFormValues): Promise<SaveFixedMenuResult> {
  const fieldErrors = validateFixedMenuForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  let createdId: string | number | null = null
  const saved = await runCatalogSave(FIXED_MENUS_PATH, async () => {
    const req = await createAppPayloadRequest(FIXED_MENUS_PATH)
    const data = fixedMenuFormToWriteData(values)
    const created = (await req.payload.create({
      collection: FIXED_MENUS_SLUG,
      context: appLocalApiContext().context,
      data,
      depth: 2,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as FixedMenu
    createdId = created.id
    await writeFixedMenuEnglish(req, created.id, created, values)
  })

  if (!saved.ok) {
    return { ok: false, error: saved.error, fieldErrors: saved.fieldErrors as FixedMenuFieldErrors }
  }
  if (createdId == null) {
    return { ok: false, error: 'server' }
  }

  try {
    const req = await createAppPayloadRequest(FIXED_MENUS_PATH)
    const doc = (await req.payload.findByID({
      collection: FIXED_MENUS_SLUG,
      id: createdId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as FixedMenu
    const row = fixedMenuToListRow(doc)
    if (!row) {
      return { ok: false, error: 'server' }
    }
    return { ok: true, row }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function updateFixedMenuAction(
  menuId: string,
  values: FixedMenuFormValues,
): Promise<SaveFixedMenuResult> {
  const fieldErrors = validateFixedMenuForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  const saved = await runCatalogSave(FIXED_MENUS_PATH, async () => {
    const req = await createAppPayloadRequest(FIXED_MENUS_PATH)
    const existing = (await req.payload.findByID({
      collection: FIXED_MENUS_SLUG,
      id: menuId,
      depth: 2,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as FixedMenu
    const initial = fixedMenuFormValuesFromDoc(existing, null)
    const patch = fixedMenuFormToUpdateData(initial, values)
    let itDoc = existing
    if (Object.keys(patch).length > 0) {
      itDoc = (await req.payload.update({
        id: menuId,
        collection: FIXED_MENUS_SLUG,
        context: appLocalApiContext().context,
        data: patch,
        depth: 2,
        locale: 'it',
        overrideAccess: false,
        req,
      })) as FixedMenu
    }
    await writeFixedMenuEnglish(req, menuId, itDoc, values)
  })

  if (!saved.ok) {
    return { ok: false, error: saved.error, fieldErrors: saved.fieldErrors as FixedMenuFieldErrors }
  }

  try {
    const req = await createAppPayloadRequest(FIXED_MENUS_PATH)
    const doc = (await req.payload.findByID({
      collection: FIXED_MENUS_SLUG,
      id: menuId,
      depth: 1,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as FixedMenu
    const row = fixedMenuToListRow(doc)
    if (!row) {
      return { ok: false, error: 'server' }
    }
    return { ok: true, row }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function patchFixedMenuDisabledAction(
  menuId: string,
  disabled: boolean,
): Promise<{ ok: true } | { ok: false; error: 'server' }> {
  return patchCatalogDisabled(FIXED_MENUS_PATH, FIXED_MENUS_SLUG, menuId, disabled)
}

export async function deleteFixedMenuAction(
  menuId: string,
): Promise<{ ok: true } | { ok: false; error: 'server' }> {
  return deleteCatalogItem(FIXED_MENUS_PATH, FIXED_MENUS_SLUG, menuId)
}

export type FixedMenuDeleteImpactResult =
  | { ok: true; specialDayDates: string[] }
  | { ok: false; error: 'load' }

export async function loadFixedMenuDeleteImpactAction(
  menuId: string,
): Promise<FixedMenuDeleteImpactResult> {
  try {
    const req = await createAppPayloadRequest(FIXED_MENUS_PATH)
    const found = await req.payload.find({
      collection: SPECIAL_DAYS_SLUG,
      depth: 0,
      limit: 100,
      overrideAccess: false,
      pagination: false,
      req,
      where: {
        'content.fixedMenus': { contains: menuId },
      },
    })
    const dates = (found.docs as SpecialDay[])
      .map((d) => d.date)
      .filter((d): d is string => typeof d === 'string')
    return { ok: true, specialDayDates: dates }
  } catch {
    return { ok: false, error: 'load' }
  }
}

function categoryToListRow(doc: FixedMenuCategory, menuCount: number): FixedMenuCategoryListRow {
  return {
    id: doc.id,
    name: doc.name,
    visibility: doc.visibility,
    disabled: doc.disabled,
    menuCount,
  }
}

export type ListFixedMenuCategoriesResult =
  | { ok: true; rows: FixedMenuCategoryListRow[]; emptyDatabase: boolean }
  | { ok: false; error: 'load' }

export async function listFixedMenuCategoriesAction(): Promise<ListFixedMenuCategoriesResult> {
  try {
    const req = await createAppPayloadRequest(FIXED_CATEGORIES_PATH)
    const [categoriesRes, menusRes] = await Promise.all([
      req.payload.find({
        collection: FIXED_MENU_CATEGORIES_SLUG,
        depth: 0,
        limit: 100,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
        sort: 'name',
      }),
      req.payload.find({
        collection: FIXED_MENUS_SLUG,
        depth: 0,
        limit: 500,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
      }),
    ])

    const countByCategory = new Map<string, number>()
    for (const menu of menusRes.docs as FixedMenu[]) {
      const categoryId = relationshipId(menu.category)
      if (categoryId == null) {
        continue
      }
      const key = String(categoryId)
      countByCategory.set(key, (countByCategory.get(key) ?? 0) + 1)
    }

    const rows = (categoriesRes.docs as FixedMenuCategory[]).map((c) =>
      categoryToListRow(c, countByCategory.get(String(c.id)) ?? 0),
    )
    return { ok: true, rows, emptyDatabase: rows.length === 0 }
  } catch {
    return { ok: false, error: 'load' }
  }
}

export type LoadFixedMenuCategoryFormResult =
  | { ok: true; values: FixedMenuCategoryFormValues }
  | { ok: false; error: 'load' }

export async function loadFixedMenuCategoryFormAction(
  categoryId: string,
): Promise<LoadFixedMenuCategoryFormResult> {
  try {
    const req = await createAppPayloadRequest(FIXED_CATEGORIES_PATH)
    const doc = (await req.payload.findByID({
      collection: FIXED_MENU_CATEGORIES_SLUG,
      id: categoryId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as FixedMenuCategory
    let values = fixedMenuCategoryFormValuesFromDoc(doc)
    try {
      const en = (await req.payload.findByID({
        collection: FIXED_MENU_CATEGORIES_SLUG,
        id: categoryId,
        depth: 0,
        fallbackLocale: false,
        locale: 'en',
        overrideAccess: false,
        req,
      })) as FixedMenuCategory
      values = mergeFixedMenuCategoryEnglishName(values, en.name)
    } catch {
      // nessuna traduzione
    }
    return { ok: true, values }
  } catch {
    return { ok: false, error: 'load' }
  }
}

async function writeFixedMenuCategoryEnglish(
  req: Awaited<ReturnType<typeof createAppPayloadRequest>>,
  id: string | number,
  values: FixedMenuCategoryFormValues,
) {
  await req.payload.update({
    id,
    collection: FIXED_MENU_CATEGORIES_SLUG,
    context: appLocalApiContext().context,
    data: {
      name: values.nameEn.trim(),
    },
    depth: 0,
    fallbackLocale: false,
    locale: 'en',
    overrideAccess: false,
    req,
  })
}

export type SaveFixedMenuCategoryResult =
  | { ok: true; row: FixedMenuCategoryListRow }
  | { ok: false; error: 'server' | 'validation'; fieldErrors?: FixedMenuCategoryFieldErrors }

export async function createFixedMenuCategoryAction(
  values: FixedMenuCategoryFormValues,
): Promise<SaveFixedMenuCategoryResult> {
  const fieldErrors = validateFixedMenuCategoryForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  let createdId: string | number | null = null
  const saved = await runCatalogSave(FIXED_CATEGORIES_PATH, async () => {
    const req = await createAppPayloadRequest(FIXED_CATEGORIES_PATH)
    const data = fixedMenuCategoryFormToWriteData(values)
    const created = (await req.payload.create({
      collection: FIXED_MENU_CATEGORIES_SLUG,
      context: appLocalApiContext().context,
      data,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as FixedMenuCategory
    createdId = created.id
    await writeFixedMenuCategoryEnglish(req, created.id, values)
  })

  if (!saved.ok) {
    return {
      ok: false,
      error: saved.error,
      fieldErrors: saved.fieldErrors as FixedMenuCategoryFieldErrors,
    }
  }
  if (createdId == null) {
    return { ok: false, error: 'server' }
  }

  try {
    const req = await createAppPayloadRequest(FIXED_CATEGORIES_PATH)
    const doc = (await req.payload.findByID({
      collection: FIXED_MENU_CATEGORIES_SLUG,
      id: createdId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as FixedMenuCategory
    return { ok: true, row: categoryToListRow(doc, 0) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function updateFixedMenuCategoryAction(
  categoryId: string,
  values: FixedMenuCategoryFormValues,
): Promise<SaveFixedMenuCategoryResult> {
  const fieldErrors = validateFixedMenuCategoryForm(values)
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'validation', fieldErrors }
  }

  const saved = await runCatalogSave(FIXED_CATEGORIES_PATH, async () => {
    const req = await createAppPayloadRequest(FIXED_CATEGORIES_PATH)
    const existing = (await req.payload.findByID({
      collection: FIXED_MENU_CATEGORIES_SLUG,
      id: categoryId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as FixedMenuCategory
    const initial = fixedMenuCategoryFormValuesFromDoc(existing)
    const patch = fixedMenuCategoryFormToUpdateData(initial, values)
    if (Object.keys(patch).length > 0) {
      await req.payload.update({
        id: categoryId,
        collection: FIXED_MENU_CATEGORIES_SLUG,
        context: appLocalApiContext().context,
        data: patch,
        depth: 0,
        locale: 'it',
        overrideAccess: false,
        req,
      })
    }
    await writeFixedMenuCategoryEnglish(req, categoryId, values)
  })

  if (!saved.ok) {
    return {
      ok: false,
      error: saved.error,
      fieldErrors: saved.fieldErrors as FixedMenuCategoryFieldErrors,
    }
  }

  try {
    const req = await createAppPayloadRequest(FIXED_CATEGORIES_PATH)
    const doc = (await req.payload.findByID({
      collection: FIXED_MENU_CATEGORIES_SLUG,
      id: categoryId,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      req,
    })) as FixedMenuCategory
    const menus = await req.payload.count({
      collection: FIXED_MENUS_SLUG,
      overrideAccess: false,
      req,
      where: { category: { equals: categoryId } },
    })
    return { ok: true, row: categoryToListRow(doc, menus.totalDocs) }
  } catch {
    return { ok: false, error: 'server' }
  }
}

export async function patchFixedMenuCategoryDisabledAction(
  categoryId: string,
  disabled: boolean,
): Promise<{ ok: true } | { ok: false; error: 'server' }> {
  return patchCatalogDisabled(FIXED_CATEGORIES_PATH, FIXED_MENU_CATEGORIES_SLUG, categoryId, disabled)
}
