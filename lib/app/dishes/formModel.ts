import type { Dish } from '@/payload-types'

import {
  PIATTI_ERROR_CATEGORY,
  PIATTI_ERROR_PRICE,
  PIATTI_ERROR_REQUIRED,
} from '@/lib/menu/dishes/copy'
import { parseDishPriceInput } from '@/lib/menu/dishes/parseDishPrice'

import type { DishFormFieldKey, DishFormValues } from './types'

export type DishFieldErrors = Partial<Record<DishFormFieldKey, string>>

export function dishFormValuesFromDish(dish: Dish, categoryId: string): DishFormValues {
  return {
    nameIt: dish.name ?? '',
    descriptionIt: dish.description ?? '',
    nameEn: '',
    descriptionEn: '',
    priceInput: dish.price != null ? String(dish.price).replace('.', ',') : '',
    categoryId,
    allergenIds: (dish.allergens ?? [])
      .map((a) => (typeof a === 'object' && a != null ? String(a.id) : String(a)))
      .filter(Boolean),
    glutenFree: Boolean(dish.glutenFree),
    dairyFree: Boolean(dish.dairyFree),
    vegan: Boolean(dish.vegan),
    eggFree: Boolean(dish.eggFree),
    soldOut: Boolean(dish.soldOut),
    disabled: Boolean(dish.disabled),
  }
}

export function mergeEnglishFields(
  base: DishFormValues,
  nameEn: string | null | undefined,
  descriptionEn: string | null | undefined,
): DishFormValues {
  return {
    ...base,
    nameEn: nameEn ?? '',
    descriptionEn: descriptionEn ?? '',
  }
}

export function validateDishForm(values: DishFormValues): DishFieldErrors {
  const errors: DishFieldErrors = {}
  if (!values.nameIt.trim()) {
    errors.name = PIATTI_ERROR_REQUIRED
  }
  const price = parseDishPriceInput(values.priceInput)
  if (price === null) {
    errors.price = PIATTI_ERROR_PRICE
  }
  if (!values.categoryId) {
    errors.categoryId = PIATTI_ERROR_CATEGORY
  }
  return errors
}

export function firstInvalidDishField(errors: DishFieldErrors): DishFormFieldKey | null {
  const order: DishFormFieldKey[] = ['name', 'price', 'categoryId']
  for (const key of order) {
    if (errors[key]) {
      return key
    }
  }
  return null
}

export const DISH_FIELD_DOM_IDS: Record<DishFormFieldKey, string> = {
  name: 'dish-field-name',
  description: 'dish-field-description',
  price: 'dish-field-price',
  categoryId: 'dish-field-category',
}

export function dishFormToWriteData(values: DishFormValues): {
  price: number
  category: number
  allergens: number[]
  glutenFree: boolean
  dairyFree: boolean
  vegan: boolean
  eggFree: boolean
  soldOut: boolean
  disabled: boolean
  name: string
  description: string
} {
  const price = parseDishPriceInput(values.priceInput)
  if (price === null) {
    throw new Error('prezzo non valido')
  }
  return {
    name: values.nameIt.trim(),
    description: values.descriptionIt.trim(),
    price,
    category: Number(values.categoryId),
    allergens: values.allergenIds.map((id) => Number(id)),
    glutenFree: values.glutenFree,
    dairyFree: values.dairyFree,
    vegan: values.vegan,
    eggFree: values.eggFree,
    soldOut: values.soldOut,
    disabled: values.disabled,
  }
}

export function hasEnglishTranslation(values: DishFormValues): boolean {
  return Boolean(values.nameEn.trim() || values.descriptionEn.trim())
}
