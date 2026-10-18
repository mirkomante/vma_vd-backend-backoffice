import type { CatalogDisabledFilter } from '@/lib/menu/catalog/disabledStatusFilter'

export type WineListQuery = {
  search: string
  typeId: string
  status: CatalogDisabledFilter
  countryId: string
  regionId: string
  appellationId: string
}

export const EMPTY_WINE_LIST_QUERY: WineListQuery = {
  search: '',
  typeId: '',
  status: 'all',
  countryId: '',
  regionId: '',
  appellationId: '',
}

export type WineListRow = {
  id: number | string
  name: string
  winery: string
  year: string
  typeId: string
  typeName: string
  countryName: string
  regionName: string
  price: number
  glassPrice: number | null
  disabled?: boolean | null
}

export type WineFormatSnapshot = {
  year: string | null
  volume: string | null
  abv: string | null
}

export type WineFormValues = {
  name: string
  winery: string
  yearNv: boolean
  yearInput: string
  volume: string
  abv: string
  descriptionIt: string
  descriptionEn: string
  typeId: string
  countryId: string
  regionId: string
  appellationId: string
  classificationId: string
  priceInput: string
  glassPriceInput: string
  disabled: boolean
  formatSnapshot: WineFormatSnapshot | null
}

export function emptyWineFormValues(): WineFormValues {
  return {
    name: '',
    winery: '',
    yearNv: false,
    yearInput: '',
    volume: '',
    abv: '',
    descriptionIt: '',
    descriptionEn: '',
    typeId: '',
    countryId: '',
    regionId: '',
    appellationId: '',
    classificationId: '',
    priceInput: '',
    glassPriceInput: '',
    disabled: false,
    formatSnapshot: null,
  }
}
