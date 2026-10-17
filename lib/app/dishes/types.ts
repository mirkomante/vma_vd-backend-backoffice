import type { DishListStatusFilter } from '@/lib/menu/dishes/buildDishesWhere'

export type DishFormFieldKey = 'name' | 'description' | 'price' | 'categoryId'

export type DishFormValues = {
  nameIt: string
  descriptionIt: string
  nameEn: string
  descriptionEn: string
  priceInput: string
  categoryId: string
  allergenIds: string[]
  glutenFree: boolean
  dairyFree: boolean
  vegan: boolean
  eggFree: boolean
  soldOut: boolean
  disabled: boolean
}

export type DishListQuery = {
  search: string
  categoryId: string
  status: DishListStatusFilter
  noAllergens: boolean
}

export const EMPTY_DISH_LIST_QUERY: DishListQuery = {
  search: '',
  categoryId: '',
  status: 'all',
  noAllergens: false,
}

export function emptyDishFormValues(): DishFormValues {
  return {
    nameIt: '',
    descriptionIt: '',
    nameEn: '',
    descriptionEn: '',
    priceInput: '',
    categoryId: '',
    allergenIds: [],
    glutenFree: false,
    dairyFree: false,
    vegan: false,
    eggFree: false,
    soldOut: false,
    disabled: false,
  }
}
