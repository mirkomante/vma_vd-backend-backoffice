import type { CatalogDisabledFilter } from '@/lib/menu/catalog/disabledStatusFilter'

export type SpiritListQuery = {
  search: string
  typeId: string
  status: CatalogDisabledFilter
  countryId: string
}

export const EMPTY_SPIRIT_LIST_QUERY: SpiritListQuery = {
  search: '',
  typeId: '',
  status: 'all',
  countryId: '',
}

export type SpiritListRow = {
  id: number | string
  name: string
  aging: string
  abv: string
  typeId: string
  typeName: string
  countryName: string
  price: number
  disabled?: boolean | null
}

export type SpiritFormatSnapshot = {
  abv: string | null
  aging: string | null
}

export type SpiritFormValues = {
  name: string
  aging: string
  abv: string
  descriptionIt: string
  descriptionEn: string
  typeId: string
  countryId: string
  priceInput: string
  disabled: boolean
  formatSnapshot: SpiritFormatSnapshot | null
}

export function emptySpiritFormValues(): SpiritFormValues {
  return {
    name: '',
    aging: '',
    abv: '',
    descriptionIt: '',
    descriptionEn: '',
    typeId: '',
    countryId: '',
    priceInput: '',
    disabled: false,
    formatSnapshot: null,
  }
}
