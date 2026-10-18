import { parseMenuPriceInput } from '@/lib/menu/catalog/parseMenuPrice'
import { dishDisplayStatus } from '@/lib/menu/dishes/displayStatus'
import {
  MENU_FISSI_ERROR_CATEGORY,
  MENU_FISSI_ERROR_DISHES,
  MENU_FISSI_ERROR_PRICE,
  MENU_FISSI_ERROR_REQUIRED,
} from '@/lib/menu/fixed-menus/copy'
import { relationshipId } from '@/lib/menu/relationshipId'
import type { FixedMenu, MenuService } from '@/payload-types'

import type { FixedMenuDishFormRow, FixedMenuFormValues } from './types'

export type FixedMenuFieldErrors = Partial<
  Record<'name' | 'price' | 'categoryId' | 'dishes', string>
>

export const FIXED_MENU_FIELD_DOM_IDS = {
  name: 'fixed-menu-field-name',
  nameEn: 'fixed-menu-field-name-en',
  description: 'fixed-menu-field-description',
  descriptionEn: 'fixed-menu-field-description-en',
  price: 'fixed-menu-field-price',
  categoryId: 'fixed-menu-field-category',
  visibility: 'fixed-menu-field-visibility',
} as const

function dishRowFromDoc(
  row: NonNullable<FixedMenu['dishes']>[number],
  portionEnByDishId: Map<string, string>,
): FixedMenuDishFormRow | null {
  const dishId = relationshipId(row.dish)
  if (dishId == null) {
    return null
  }
  const dishObj = typeof row.dish === 'object' && row.dish !== null ? row.dish : null
  const dishName = dishObj && 'name' in dishObj ? String(dishObj.name) : ''
  const status = dishObj ? dishDisplayStatus(dishObj) : 'available'
  const rowId = row.id != null ? String(row.id) : `new-${dishId}`
  return {
    rowId,
    dishId: String(dishId),
    dishName,
    dishStatus: status,
    portionIt: row.portion ?? '',
    portionEn: portionEnByDishId.get(String(dishId)) ?? '',
  }
}

export function fixedMenuFormValuesFromDoc(
  doc: FixedMenu,
  en?: Pick<FixedMenu, 'name' | 'description' | 'dishes'> | null,
): FixedMenuFormValues {
  const categoryId = relationshipId(doc.category)

  const portionEnByDishId = new Map<string, string>()
  for (const row of en?.dishes ?? []) {
    const dishId = relationshipId(row?.dish)
    if (dishId != null) {
      portionEnByDishId.set(String(dishId), row?.portion ?? '')
    }
  }

  const dishes =
    doc.dishes
      ?.map((row) => dishRowFromDoc(row, portionEnByDishId))
      .filter((row): row is FixedMenuDishFormRow => row != null) ?? []

  const serviceIds =
    doc.services
      ?.map((s) => relationshipId(s))
      .filter((id): id is number | string => id != null)
      .map(String) ?? []

  return {
    name: doc.name ?? '',
    nameEn: en?.name ?? '',
    description: doc.description ?? '',
    descriptionEn: en?.description ?? '',
    priceInput: doc.price != null ? String(doc.price).replace('.', ',') : '',
    categoryId: categoryId != null ? String(categoryId) : '',
    visibility: doc.visibility ?? 'always',
    visibilityTouched: true,
    specialOnly: Boolean(doc.specialOnly),
    dishes,
    serviceIds,
    disabled: Boolean(doc.disabled),
  }
}

export function hasEnglishFixedMenuFields(values: FixedMenuFormValues): boolean {
  if (values.nameEn.trim() || values.descriptionEn.trim()) {
    return true
  }
  return values.dishes.some((row) => row.portionEn.trim().length > 0)
}

export function validateFixedMenuForm(values: FixedMenuFormValues): FixedMenuFieldErrors {
  const errors: FixedMenuFieldErrors = {}
  if (!values.name.trim()) {
    errors.name = MENU_FISSI_ERROR_REQUIRED
  }
  const priceTrimmed = values.priceInput.trim()
  if (!priceTrimmed) {
    errors.price = MENU_FISSI_ERROR_REQUIRED
  } else if (parseMenuPriceInput(values.priceInput) === null) {
    errors.price = MENU_FISSI_ERROR_PRICE
  }
  if (!values.categoryId.trim()) {
    errors.categoryId = MENU_FISSI_ERROR_CATEGORY
  }
  if (values.dishes.length === 0) {
    errors.dishes = MENU_FISSI_ERROR_DISHES
  }
  return errors
}

export function firstInvalidFixedMenuField(
  errors: FixedMenuFieldErrors,
): keyof FixedMenuFieldErrors | null {
  const order: (keyof FixedMenuFieldErrors)[] = ['name', 'price', 'categoryId', 'dishes']
  for (const key of order) {
    if (errors[key]) {
      return key
    }
  }
  return null
}

export function fixedMenuDishesToWriteData(values: FixedMenuFormValues): {
  dish: number
  portion?: string
}[] {
  return values.dishes.map((row) => {
    const portion = row.portionIt.trim()
    return {
      dish: Number(row.dishId),
      ...(portion ? { portion } : {}),
    }
  })
}

export function fixedMenuFormToWriteData(values: FixedMenuFormValues): {
  name: string
  description?: string
  price: number
  category: number
  visibility: FixedMenuFormValues['visibility']
  specialOnly: boolean
  dishes: { dish: number; portion?: string }[]
  services: number[]
  disabled: boolean
} {
  const price = parseMenuPriceInput(values.priceInput)
  if (price === null) {
    throw new Error('invalid price')
  }
  const description = values.description.trim()
  return {
    name: values.name.trim(),
    ...(description ? { description } : {}),
    price,
    category: Number(values.categoryId),
    visibility: values.visibility,
    specialOnly: values.specialOnly,
    dishes: fixedMenuDishesToWriteData(values),
    services: values.serviceIds.map((id) => Number(id)),
    disabled: values.disabled,
  }
}

function normalizeWriteData(data: ReturnType<typeof fixedMenuFormToWriteData>) {
  return {
    ...data,
    services: [...data.services].sort((a, b) => a - b),
  }
}

export function fixedMenuFormToUpdateData(
  initial: FixedMenuFormValues,
  values: FixedMenuFormValues,
): Partial<ReturnType<typeof fixedMenuFormToWriteData>> {
  const patch: Partial<ReturnType<typeof fixedMenuFormToWriteData>> = {}
  const next = normalizeWriteData(fixedMenuFormToWriteData(values))
  const prev = normalizeWriteData(fixedMenuFormToWriteData({ ...initial, priceInput: initial.priceInput }))

  if (next.name !== prev.name) {
    patch.name = next.name
  }
  if ((next.description ?? '') !== (prev.description ?? '')) {
    patch.description = next.description
  }
  if (next.price !== prev.price) {
    patch.price = next.price
  }
  if (next.category !== prev.category) {
    patch.category = next.category
  }
  if (next.visibility !== prev.visibility) {
    patch.visibility = next.visibility
  }
  if (next.specialOnly !== prev.specialOnly) {
    patch.specialOnly = next.specialOnly
  }
  if (next.disabled !== prev.disabled) {
    patch.disabled = next.disabled
  }
  if (JSON.stringify(next.dishes) !== JSON.stringify(prev.dishes)) {
    patch.dishes = next.dishes
  }
  if (JSON.stringify(next.services) !== JSON.stringify(prev.services)) {
    patch.services = next.services
  }
  return patch
}

export function serviceOptionFromDoc(doc: MenuService): { id: string; name: string; price: number } {
  return {
    id: String(doc.id),
    name: doc.name,
    price: doc.price,
  }
}
