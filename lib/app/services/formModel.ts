import { parseMenuPriceInput } from '@/lib/menu/catalog/parseMenuPrice'
import {
  SERVIZI_ERROR_PRICE,
  SERVIZI_ERROR_REQUIRED,
} from '@/lib/menu/services/copy'
import type { MenuService } from '@/payload-types'

import type { ServiceFormValues } from './types'

export type ServiceFieldErrors = Partial<Record<'name' | 'price', string>>

export const SERVICE_FIELD_DOM_IDS = {
  name: 'service-field-name',
  nameEn: 'service-field-name-en',
  price: 'service-field-price',
} as const

export function serviceFormValuesFromDoc(doc: MenuService): ServiceFormValues {
  return {
    name: doc.name ?? '',
    nameEn: '',
    priceInput: doc.price != null ? String(doc.price).replace('.', ',') : '',
    disabled: Boolean(doc.disabled),
  }
}

export function mergeServiceEnglishName(values: ServiceFormValues, nameEn: string | null | undefined): ServiceFormValues {
  return {
    ...values,
    nameEn: nameEn ?? '',
  }
}

export function hasEnglishServiceName(values: ServiceFormValues): boolean {
  return values.nameEn.trim().length > 0
}

export function validateServiceForm(values: ServiceFormValues): ServiceFieldErrors {
  const errors: ServiceFieldErrors = {}
  if (!values.name.trim()) {
    errors.name = SERVIZI_ERROR_REQUIRED
  }
  const priceTrimmed = values.priceInput.trim()
  if (!priceTrimmed) {
    errors.price = SERVIZI_ERROR_REQUIRED
  } else if (parseMenuPriceInput(values.priceInput) === null) {
    errors.price = SERVIZI_ERROR_PRICE
  }
  return errors
}

export function firstInvalidServiceField(errors: ServiceFieldErrors): keyof ServiceFieldErrors | null {
  const order: (keyof ServiceFieldErrors)[] = ['name', 'price']
  for (const key of order) {
    if (errors[key]) {
      return key
    }
  }
  return null
}

export function serviceFormToWriteData(values: ServiceFormValues): {
  name: string
  price: number
  disabled: boolean
} {
  const price = parseMenuPriceInput(values.priceInput)
  if (price === null) {
    throw new Error('invalid price')
  }
  return {
    name: values.name.trim(),
    price,
    disabled: values.disabled,
  }
}

export function serviceFormToUpdateData(
  initial: ServiceFormValues,
  values: ServiceFormValues,
): Partial<{ name: string; price: number; disabled: boolean }> {
  const patch: Partial<{ name: string; price: number; disabled: boolean }> = {}
  const next = serviceFormToWriteData(values)
  const prev = serviceFormToWriteData({ ...initial, priceInput: initial.priceInput })
  if (next.name !== prev.name) {
    patch.name = next.name
  }
  if (next.price !== prev.price) {
    patch.price = next.price
  }
  if (next.disabled !== prev.disabled) {
    patch.disabled = next.disabled
  }
  return patch
}
