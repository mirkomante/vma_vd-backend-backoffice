import type { CatalogDisabledFilter } from '@/lib/menu/catalog/disabledStatusFilter'

export type DrinkListQuery = {
  search: string
  typeId: string
  status: CatalogDisabledFilter
  countryId: string
}

export const EMPTY_DRINK_LIST_QUERY: DrinkListQuery = {
  search: '',
  typeId: '',
  status: 'all',
  countryId: '',
}

export type DrinkListRow = {
  id: number | string
  name: string
  volume: string
  abv: string
  typeId: string
  typeName: string
  countryName: string
  price: number
  disabled?: boolean | null
}

export type DrinkFormatSnapshot = {
  volume: string | null
  abv: string | null
}

export type DrinkFormValues = {
  name: string
  volume: string
  abv: string
  descriptionIt: string
  nameEn: string
  descriptionEn: string
  typeId: string
  countryId: string
  priceInput: string
  disabled: boolean
  formatSnapshot: DrinkFormatSnapshot | null
}

export function emptyDrinkFormValues(): DrinkFormValues {
  return {
    name: '',
    volume: '',
    abv: '',
    descriptionIt: '',
    nameEn: '',
    descriptionEn: '',
    typeId: '',
    countryId: '',
    priceInput: '',
    disabled: false,
    formatSnapshot: null,
  }
}
