import type { SpecialDayScope } from '@/lib/menu/validateSpecialDayOverlap'

export type FixedMenuPickerOption = {
  id: string
  name: string
  categoryId: string
  categoryName: string
  specialOnly: boolean
  disabled: boolean
}

export type SpecialDayListRow = {
  id: string
  date: string
  dateInput: string
  scope: SpecialDayScope
  disabled: boolean
  messageIt: string
  menuNames: string
  fixedMenuIds: string[]
  isToday: boolean
}

export type SpecialDayFormValues = {
  dateInput: string
  scope: SpecialDayScope | ''
  fixedMenuIds: string[]
  messageIt: string
  messageEn: string
  disabled: boolean
}

export function emptySpecialDayFormValues(): SpecialDayFormValues {
  return {
    dateInput: '',
    scope: 'dinner',
    fixedMenuIds: [],
    messageIt: '',
    messageEn: '',
    disabled: false,
  }
}
