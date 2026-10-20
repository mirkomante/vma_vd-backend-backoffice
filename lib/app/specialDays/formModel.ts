import { todayRomeAsSpecialDayDate } from '@/lib/menu/specialDayDate'
import {
  SPECIAL_DAYS_ERROR_DATE,
  SPECIAL_DAYS_ERROR_MENUS,
  SPECIAL_DAYS_ERROR_SCOPE,
} from '@/lib/menu/specialDays/copy'
import type { SpecialDayScope } from '@/lib/menu/validateSpecialDayOverlap'

import type { SpecialDayFormValues } from './types'

export type SpecialDayFieldErrors = Partial<
  Record<'dateInput' | 'scope' | 'fixedMenuIds' | 'overlap', string>
>

export const SPECIAL_DAY_FIELD_DOM_IDS = {
  dateInput: 'special-day-field-date',
  scope: 'special-day-field-scope',
} as const

export function isSpecialDayDateBeforeToday(
  dateInput: string,
  todayNoonUtc: string = todayRomeAsSpecialDayDate(),
): boolean {
  if (!dateInput) {
    return false
  }
  return dateInput.slice(0, 10) < todayNoonUtc.slice(0, 10)
}

export function validateSpecialDayForm(
  values: SpecialDayFormValues,
  overlapMessage: string | null,
): SpecialDayFieldErrors {
  const errors: SpecialDayFieldErrors = {}
  if (!values.dateInput.trim()) {
    errors.dateInput = SPECIAL_DAYS_ERROR_DATE
  }
  if (!values.scope) {
    errors.scope = SPECIAL_DAYS_ERROR_SCOPE
  }
  if (values.fixedMenuIds.length === 0) {
    errors.fixedMenuIds = SPECIAL_DAYS_ERROR_MENUS
  }
  if (overlapMessage) {
    errors.overlap = overlapMessage
  }
  return errors
}

export function firstInvalidSpecialDayField(
  errors: SpecialDayFieldErrors,
): keyof SpecialDayFieldErrors | null {
  const order: (keyof SpecialDayFieldErrors)[] = ['dateInput', 'scope', 'fixedMenuIds', 'overlap']
  for (const key of order) {
    if (errors[key]) {
      return key
    }
  }
  return null
}

export function hasEnglishSpecialDayMessage(values: SpecialDayFormValues): boolean {
  return values.messageEn.trim().length > 0
}

export function specialDayFormToWriteData(values: SpecialDayFormValues): {
  date: string
  scope: SpecialDayScope
  disabled: boolean
  content: { fixedMenus: number[]; message: string }
} {
  return {
    date: values.dateInput.trim(),
    scope: values.scope as SpecialDayScope,
    disabled: values.disabled,
    content: {
      fixedMenus: values.fixedMenuIds.map((id) => Number(id)),
      message: values.messageIt.trim(),
    },
  }
}
