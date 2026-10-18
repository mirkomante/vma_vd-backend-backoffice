import type { DishDisplayStatus } from '@/lib/menu/dishes/displayStatus'
import type { MenuVisibilityValue } from '@/lib/menu/visibilityField'

export type FixedMenuCategoryOption = {
  id: string
  name: string
  visibility: MenuVisibilityValue
  disabled: boolean
}

export type FixedMenuServiceOption = {
  id: string
  name: string
  price: number
  disabled: boolean
}

export type FixedMenuDishOption = {
  id: string
  name: string
  categoryId: string
  categoryName: string
  status: DishDisplayStatus
}

export type FixedMenuDishFormRow = {
  rowId: string
  dishId: string
  dishName: string
  dishStatus: DishDisplayStatus
  portionIt: string
  portionEn: string
}

export type FixedMenuFormValues = {
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  priceInput: string
  categoryId: string
  visibility: MenuVisibilityValue
  visibilityTouched: boolean
  specialOnly: boolean
  dishes: FixedMenuDishFormRow[]
  serviceIds: string[]
  disabled: boolean
}

export type FixedMenuListRow = {
  id: number | string
  name: string
  price: number
  visibility: MenuVisibilityValue
  disabled?: boolean | null
  specialOnly?: boolean | null
  dishCount: number
  categoryId: string
  categoryName: string
  categoryDisabled: boolean
  categoryVisibility: MenuVisibilityValue
}

export type FixedMenuCategoryListRow = {
  id: number | string
  name: string
  visibility: MenuVisibilityValue
  disabled?: boolean | null
  menuCount: number
}

export type FixedMenuCategoryFormValues = {
  name: string
  nameEn: string
  visibility: MenuVisibilityValue
  disabled: boolean
}

export function emptyFixedMenuFormValues(): FixedMenuFormValues {
  return {
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    priceInput: '',
    categoryId: '',
    visibility: 'always',
    visibilityTouched: false,
    specialOnly: false,
    dishes: [],
    serviceIds: [],
    disabled: false,
  }
}

export function emptyFixedMenuCategoryFormValues(): FixedMenuCategoryFormValues {
  return {
    name: '',
    nameEn: '',
    visibility: 'always',
    disabled: false,
  }
}
