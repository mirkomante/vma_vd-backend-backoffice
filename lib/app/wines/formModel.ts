import type { Wine } from '@/payload-types'

import { parseMenuPriceInput } from '@/lib/menu/catalog/parseMenuPrice'
import { relationshipId, relationshipName } from '@/lib/menu/relationshipId'
import {
  VINI_ERROR_COUNTRY,
  VINI_ERROR_GLASS_PRICE,
  VINI_ERROR_PRICE,
  VINI_ERROR_REQUIRED,
  VINI_ERROR_TYPE,
  VINI_ERROR_YEAR,
} from '@/lib/menu/wines/copy'
import { isCanonicalWineYear } from '@/lib/menu/formats'

import type { WineFormValues, WineFormatSnapshot } from './types'

export type WineFieldKey =
  | 'name'
  | 'price'
  | 'glassPrice'
  | 'typeId'
  | 'countryId'
  | 'region'
  | 'appellation'
  | 'year'

export type WineFieldErrors = Partial<Record<WineFieldKey, string>>

export const WINE_FIELD_DOM_IDS: Record<WineFieldKey, string> = {
  name: 'wine-field-name',
  price: 'wine-field-price',
  glassPrice: 'wine-field-glass-price',
  typeId: 'wine-field-type',
  countryId: 'wine-field-country',
  region: 'wine-field-region',
  appellation: 'wine-field-appellation',
  year: 'wine-field-year',
}

export function wineFormatSnapshotFromWine(wine: Wine): WineFormatSnapshot {
  return {
    year: wine.year ?? null,
    volume: wine.volume ?? null,
    abv: wine.abv ?? null,
  }
}

export function wineFormValuesFromWine(wine: Wine): WineFormValues {
  const year = wine.year ?? ''
  const nv = year === 'NV'
  return {
    name: wine.name ?? '',
    winery: wine.winery ?? '',
    yearNv: nv,
    yearInput: nv ? '' : year,
    volume: wine.volume ?? '',
    abv: wine.abv ?? '',
    descriptionIt: wine.description ?? '',
    descriptionEn: '',
    typeId: String(relationshipId(wine.type) ?? ''),
    countryId: String(relationshipId(wine.country) ?? ''),
    regionId: String(relationshipId(wine.region) ?? ''),
    appellationId: String(relationshipId(wine.appellation) ?? ''),
    classificationId: String(relationshipId(wine.classification) ?? ''),
    savedCountryName: relationshipName(wine.country),
    savedRegionName: relationshipName(wine.region),
    savedAppellationName: relationshipName(wine.appellation),
    savedClassificationName: relationshipName(wine.classification),
    priceInput: wine.price != null ? String(wine.price).replace('.', ',') : '',
    glassPriceInput:
      wine.glassPrice != null ? String(wine.glassPrice).replace('.', ',') : '',
    disabled: Boolean(wine.disabled),
    formatSnapshot: wineFormatSnapshotFromWine(wine),
  }
}

export function mergeWineEnglishDescription(
  base: WineFormValues,
  descriptionEn: string | null | undefined,
): WineFormValues {
  return { ...base, descriptionEn: descriptionEn ?? '' }
}

export function hasEnglishWineDescription(values: WineFormValues): boolean {
  return Boolean(values.descriptionEn.trim())
}

export function validateWineForm(values: WineFormValues, now = new Date()): WineFieldErrors {
  const errors: WineFieldErrors = {}
  const year = now.getFullYear()
  if (!values.name.trim()) {
    errors.name = VINI_ERROR_REQUIRED
  }
  const price = parseMenuPriceInput(values.priceInput)
  if (price === null) {
    errors.price = VINI_ERROR_PRICE
  }
  if (values.glassPriceInput.trim()) {
    const glass = parseMenuPriceInput(values.glassPriceInput)
    if (glass === null) {
      errors.glassPrice = VINI_ERROR_GLASS_PRICE
    }
  }
  if (!values.typeId) {
    errors.typeId = VINI_ERROR_TYPE
  }
  if (!values.countryId) {
    errors.countryId = VINI_ERROR_COUNTRY
  }
  if (!values.yearNv && values.yearInput.trim()) {
    if (!/^\d{1,4}$/.test(values.yearInput.trim())) {
      errors.year = VINI_ERROR_YEAR(year)
    } else {
      const padded = values.yearInput.trim().padStart(4, '0')
      if (!isCanonicalWineYear(padded, year)) {
        errors.year = VINI_ERROR_YEAR(year)
      }
    }
  }
  return errors
}

export function firstInvalidWineField(errors: WineFieldErrors): WineFieldKey | null {
  const order: WineFieldKey[] = [
    'name',
    'year',
    'price',
    'glassPrice',
    'typeId',
    'countryId',
    'region',
    'appellation',
  ]
  for (const key of order) {
    if (errors[key]) {
      return key
    }
  }
  return null
}

function resolveYearForWrite(values: WineFormValues): string | undefined {
  if (values.yearNv) {
    return 'NV'
  }
  const raw = values.yearInput.trim()
  if (!raw) {
    return undefined
  }
  const snap = values.formatSnapshot?.year
  if (snap && raw === snap.replace(/^NV$/, '') && snap !== 'NV') {
    return snap
  }
  if (snap && values.yearInput === '' && !values.yearNv) {
    return undefined
  }
  if (/^\d{1,4}$/.test(raw)) {
    const four = raw.padStart(4, '0')
    if (values.formatSnapshot?.year === four && values.yearInput === raw) {
      return values.formatSnapshot.year ?? four
    }
    return four
  }
  return raw
}

function resolveOptionalText(
  current: string,
  snapshot: string | null | undefined,
): string | undefined {
  const trimmed = current.trim()
  if (!trimmed) {
    return undefined
  }
  if (snapshot != null && current === snapshot) {
    return snapshot
  }
  return current
}

export function wineFormToWriteData(values: WineFormValues): Record<string, unknown> {
  const price = parseMenuPriceInput(values.priceInput)
  if (price === null) {
    throw new Error('invalid price')
  }
  const data: Record<string, unknown> = {
    name: values.name.trim(),
    winery: values.winery.trim() || undefined,
    price,
    type: values.typeId,
    country: values.countryId,
    disabled: values.disabled,
    description: values.descriptionIt.trim() || undefined,
  }

  const year = resolveYearForWrite(values)
  if (year !== undefined) {
    data.year = year
  } else if (values.formatSnapshot?.year === null) {
    data.year = undefined
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

  if (values.glassPriceInput.trim()) {
    const glass = parseMenuPriceInput(values.glassPriceInput)
    if (glass !== null) {
      data.glassPrice = glass
    }
  } else {
    data.glassPrice = undefined
  }

  data.region = values.regionId || undefined
  data.appellation = values.appellationId || undefined
  data.classification = values.classificationId || undefined

  return data
}

/** Aggiornamento: solo campi modificati rispetto al valore iniziale (formati byte-identici se invariati). */
export function wineFormToUpdateData(
  initial: WineFormValues,
  values: WineFormValues,
): Record<string, unknown> {
  const full = wineFormToWriteData(values)
  const patch: Record<string, unknown> = {}
  const initialData = wineFormToWriteData(initial)

  for (const [key, val] of Object.entries(full)) {
    const prev = initialData[key]
    if (JSON.stringify(val) !== JSON.stringify(prev)) {
      patch[key] = val
    }
  }
  return patch
}
