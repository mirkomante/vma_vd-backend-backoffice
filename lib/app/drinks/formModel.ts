import type { Drink } from '@/payload-types'

import { parseMenuPriceInput } from '@/lib/menu/catalog/parseMenuPrice'
import { relationshipId } from '@/lib/menu/relationshipId'
import {
  BEVANDE_ERROR_PRICE,
  BEVANDE_ERROR_REQUIRED,
  BEVANDE_ERROR_TYPE,
} from '@/lib/menu/drinks/copy'

import type { DrinkFormValues, DrinkFormatSnapshot } from './types'

export type DrinkFieldKey = 'name' | 'price' | 'typeId' | 'volume' | 'abv'

export type DrinkFieldErrors = Partial<Record<DrinkFieldKey, string>>

export const DRINK_FIELD_DOM_IDS: Record<DrinkFieldKey, string> = {
  name: 'drink-field-name',
  price: 'drink-field-price',
  typeId: 'drink-field-type',
  volume: 'drink-field-volume',
  abv: 'drink-field-abv',
}

export function drinkFormatSnapshotFromDrink(drink: Drink): DrinkFormatSnapshot {
  return {
    volume: drink.volume ?? null,
    abv: drink.abv ?? null,
  }
}

export function drinkFormValuesFromDrink(drink: Drink): DrinkFormValues {
  return {
    name: drink.name ?? '',
    volume: drink.volume ?? '',
    abv: drink.abv ?? '',
    descriptionIt: drink.description ?? '',
    nameEn: '',
    descriptionEn: '',
    typeId: String(relationshipId(drink.type) ?? ''),
    countryId: String(relationshipId(drink.country) ?? ''),
    priceInput: drink.price != null ? String(drink.price).replace('.', ',') : '',
    disabled: Boolean(drink.disabled),
    formatSnapshot: drinkFormatSnapshotFromDrink(drink),
  }
}

export function mergeDrinkEnglishFields(
  base: DrinkFormValues,
  nameEn: string | null | undefined,
  descriptionEn: string | null | undefined,
): DrinkFormValues {
  return {
    ...base,
    nameEn: nameEn ?? '',
    descriptionEn: descriptionEn ?? '',
  }
}

export function hasEnglishDrinkFields(values: DrinkFormValues): boolean {
  return Boolean(values.nameEn.trim() || values.descriptionEn.trim())
}

export function validateDrinkForm(values: DrinkFormValues): DrinkFieldErrors {
  const errors: DrinkFieldErrors = {}
  if (!values.name.trim()) {
    errors.name = BEVANDE_ERROR_REQUIRED
  }
  const price = parseMenuPriceInput(values.priceInput)
  if (price === null) {
    errors.price = BEVANDE_ERROR_PRICE
  }
  if (!values.typeId) {
    errors.typeId = BEVANDE_ERROR_TYPE
  }
  return errors
}

export function firstInvalidDrinkField(errors: DrinkFieldErrors): DrinkFieldKey | null {
  const order: DrinkFieldKey[] = ['name', 'price', 'typeId', 'volume', 'abv']
  for (const key of order) {
    if (errors[key]) {
      return key
    }
  }
  return null
}

function resolveOptionalText(
  current: string,
  snapshot: string | null | undefined,
): string | undefined {
  if (!current.trim()) {
    return undefined
  }
  if (snapshot != null && current === snapshot) {
    return snapshot
  }
  return current
}

export function drinkFormToWriteData(values: DrinkFormValues): Record<string, unknown> {
  const price = parseMenuPriceInput(values.priceInput)
  if (price === null) {
    throw new Error('invalid price')
  }
  const data: Record<string, unknown> = {
    name: values.name.trim(),
    price,
    type: values.typeId,
    disabled: values.disabled,
    description: values.descriptionIt.trim() || undefined,
    country: values.countryId || undefined,
  }

  const volume = resolveOptionalText(values.volume, values.formatSnapshot?.volume)
  if (volume !== undefined) {
    data.volume = volume
  } else if (!values.volume.trim() && values.formatSnapshot?.volume) {
    data.volume = undefined
  }

  const abv = resolveOptionalText(values.abv, values.formatSnapshot?.abv)
  if (abv !== undefined) {
    data.abv = abv
  } else if (!values.abv.trim() && values.formatSnapshot?.abv) {
    data.abv = undefined
  }

  if (!values.countryId) {
    data.country = undefined
  }

  return data
}

export function drinkFormToUpdateData(
  initial: DrinkFormValues,
  values: DrinkFormValues,
): Record<string, unknown> {
  const full = drinkFormToWriteData(values)
  const patch: Record<string, unknown> = {}
  const initialData = drinkFormToWriteData(initial)

  for (const [key, val] of Object.entries(full)) {
    const prev = initialData[key]
    if (JSON.stringify(val) !== JSON.stringify(prev)) {
      patch[key] = val
    }
  }
  return patch
}

const SERVER_PATH_TO_FIELD: Record<string, DrinkFieldKey> = {
  volume: 'volume',
  abv: 'abv',
  name: 'name',
  price: 'price',
  type: 'typeId',
}

export function mapDrinkServerFieldErrors(
  raw: Partial<Record<string, string>>,
): DrinkFieldErrors {
  const out: DrinkFieldErrors = {}
  for (const [path, message] of Object.entries(raw)) {
    const key = SERVER_PATH_TO_FIELD[path]
    if (key && message) {
      out[key] = message
    }
  }
  return out
}
