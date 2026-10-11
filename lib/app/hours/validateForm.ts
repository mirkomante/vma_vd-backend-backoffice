import { validateTimeOfDayField } from '@/lib/systemSettings/timeOfDay'

import type { HoursFieldKey, HoursFormValues } from './types'
import { HOURS_FIELD_ORDER } from './types'

export type HoursFieldErrors = Partial<Record<HoursFieldKey, string>>

function validateServiceTime(value: string): string | null {
  const result = validateTimeOfDayField(value)
  return result === true ? null : result
}

export function validateHoursForm(values: HoursFormValues): HoursFieldErrors {
  const errors: HoursFieldErrors = {}

  const lunchStart = validateServiceTime(values.lunch.startTime)
  if (lunchStart) {
    errors['lunch.startTime'] = lunchStart
  }
  const lunchEnd = validateServiceTime(values.lunch.endTime)
  if (lunchEnd) {
    errors['lunch.endTime'] = lunchEnd
  }
  const dinnerStart = validateServiceTime(values.dinner.startTime)
  if (dinnerStart) {
    errors['dinner.startTime'] = dinnerStart
  }
  const dinnerEnd = validateServiceTime(values.dinner.endTime)
  if (dinnerEnd) {
    errors['dinner.endTime'] = dinnerEnd
  }

  if (values.bnb.startTime) {
    const checkIn = validateServiceTime(values.bnb.startTime)
    if (checkIn) {
      errors['bnb.checkInTime'] = checkIn
    }
  }
  if (values.bnb.endTime) {
    const checkOut = validateServiceTime(values.bnb.endTime)
    if (checkOut) {
      errors['bnb.checkOutTime'] = checkOut
    }
  }

  return errors
}

export function firstInvalidHoursField(errors: HoursFieldErrors): HoursFieldKey | null {
  for (const key of HOURS_FIELD_ORDER) {
    if (errors[key]) {
      return key
    }
  }
  return null
}

/** Mappa `services.N.startTime` / `bnb.checkInTime` sugli id del modulo. */
export function mapServerValidationPath(path: string | undefined): HoursFieldKey | null {
  if (!path) {
    return null
  }
  if (path === 'bnb.checkInTime') {
    return 'bnb.checkInTime'
  }
  if (path === 'bnb.checkOutTime') {
    return 'bnb.checkOutTime'
  }
  const match = /^services\.(\d+)\.(startTime|endTime)$/.exec(path)
  if (!match) {
    return null
  }
  const index = Number.parseInt(match[1], 10)
  const field = match[2] as 'startTime' | 'endTime'
  if (index === 0) {
    return field === 'startTime' ? 'lunch.startTime' : 'lunch.endTime'
  }
  if (index === 1) {
    return field === 'startTime' ? 'dinner.startTime' : 'dinner.endTime'
  }
  return null
}
