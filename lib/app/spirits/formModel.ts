import type { Spirit } from '@/payload-types'

import { parseMenuPriceInput } from '@/lib/menu/catalog/parseMenuPrice'
import { relationshipId } from '@/lib/menu/relationshipId'
import {
  DISTILLATI_ERROR_COUNTRY,
  DISTILLATI_ERROR_PRICE,
  DISTILLATI_ERROR_REQUIRED,
  DISTILLATI_ERROR_TYPE,
} from '@/lib/menu/spirits/copy'

import type { SpiritFormValues, SpiritFormatSnapshot } from './types'

export type SpiritFieldKey = 'name' | 'price' | 'typeId' | 'countryId' | 'abv' | 'aging'

export type SpiritFieldErrors = Partial<Record<SpiritFieldKey, string>>

export const SPIRIT_FIELD_DOM_IDS: Record<SpiritFieldKey, string> = {
  name: 'spirit-field-name',
  price: 'spirit-field-price',
  typeId: 'spirit-field-type',
  countryId: 'spirit-field-country',
  abv: 'spirit-field-abv',
  aging: 'spirit-field-aging',
}

export function spiritFormatSnapshotFromSpirit(spirit: Spirit): SpiritFormatSnapshot {
  return {
    abv: spirit.abv ?? null,
    aging: spirit.aging ?? null,
  }
}

export function spiritFormValuesFromSpirit(spirit: Spirit): SpiritFormValues {
  return {
    name: spirit.name ?? '',
    aging: spirit.aging ?? '',
    abv: spirit.abv ?? '',
    descriptionIt: spirit.description ?? '',
    descriptionEn: '',
    typeId: String(relationshipId(spirit.type) ?? ''),
    countryId: String(relationshipId(spirit.country) ?? ''),
    priceInput: spirit.price != null ? String(spirit.price).replace('.', ',') : '',
    disabled: Boolean(spirit.disabled),
    formatSnapshot: spiritFormatSnapshotFromSpirit(spirit),
  }
}

export function mergeSpiritEnglishDescription(
  base: SpiritFormValues,
  descriptionEn: string | null | undefined,
): SpiritFormValues {
  return { ...base, descriptionEn: descriptionEn ?? '' }
}

export function hasEnglishSpiritDescription(values: SpiritFormValues): boolean {
  return Boolean(values.descriptionEn.trim())
}

export function validateSpiritForm(values: SpiritFormValues): SpiritFieldErrors {
  const errors: SpiritFieldErrors = {}
  if (!values.name.trim()) {
    errors.name = DISTILLATI_ERROR_REQUIRED
  }
  const price = parseMenuPriceInput(values.priceInput)
  if (price === null) {
    errors.price = DISTILLATI_ERROR_PRICE
  }
  if (!values.typeId) {
    errors.typeId = DISTILLATI_ERROR_TYPE
  }
  if (!values.countryId) {
    errors.countryId = DISTILLATI_ERROR_COUNTRY
  }
  return errors
}

export function firstInvalidSpiritField(errors: SpiritFieldErrors): SpiritFieldKey | null {
  const order: SpiritFieldKey[] = ['name', 'price', 'typeId', 'countryId', 'abv', 'aging']
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

export function spiritFormToWriteData(values: SpiritFormValues): Record<string, unknown> {
  const price = parseMenuPriceInput(values.priceInput)
  if (price === null) {
    throw new Error('invalid price')
  }
  const data: Record<string, unknown> = {
    name: values.name.trim(),
    price,
    type: values.typeId,
    country: values.countryId,
    disabled: values.disabled,
    description: values.descriptionIt.trim() || undefined,
  }

  const aging = resolveOptionalText(values.aging, values.formatSnapshot?.aging)
  if (aging !== undefined) {
    data.aging = aging
  } else if (!values.aging.trim() && values.formatSnapshot?.aging) {
    data.aging = undefined
  }

  const abv = resolveOptionalText(values.abv, values.formatSnapshot?.abv)
  if (abv !== undefined) {
    data.abv = abv
  } else if (!values.abv.trim() && values.formatSnapshot?.abv) {
    data.abv = undefined
  }

  return data
}

export function spiritFormToUpdateData(
  initial: SpiritFormValues,
  values: SpiritFormValues,
): Record<string, unknown> {
  const full = spiritFormToWriteData(values)
  const patch: Record<string, unknown> = {}
  const initialData = spiritFormToWriteData(initial)

  for (const [key, val] of Object.entries(full)) {
    const prev = initialData[key]
    if (JSON.stringify(val) !== JSON.stringify(prev)) {
      patch[key] = val
    }
  }
  return patch
}

const SERVER_PATH_TO_FIELD: Record<string, SpiritFieldKey> = {
  abv: 'abv',
  aging: 'aging',
  name: 'name',
  price: 'price',
  type: 'typeId',
  country: 'countryId',
}

export function mapSpiritServerFieldErrors(
  raw: Partial<Record<string, string>>,
): SpiritFieldErrors {
  const out: SpiritFieldErrors = {}
  for (const [path, message] of Object.entries(raw)) {
    const key = SERVER_PATH_TO_FIELD[path]
    if (key && message) {
      out[key] = message
    }
  }
  return out
}
