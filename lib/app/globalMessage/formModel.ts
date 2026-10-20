import { normalizeGlobalMessageForSave } from '@/lib/menu/globalMessage/normalizeGlobalMessageText'

import type { GlobalMessageFormValues } from './types'

export function globalMessageFormValuesEqual(
  a: GlobalMessageFormValues,
  b: GlobalMessageFormValues,
): boolean {
  return (
    a.messageIt === b.messageIt &&
    a.messageEn === b.messageEn
  )
}

export function hasSavedGlobalMessage(values: GlobalMessageFormValues): boolean {
  return Boolean(values.messageIt.trim() || values.messageEn.trim())
}

export function hasEnglishGlobalMessage(values: GlobalMessageFormValues): boolean {
  return values.messageEn.trim().length > 0
}

export function normalizeGlobalMessageFormForSave(
  values: GlobalMessageFormValues,
): GlobalMessageFormValues {
  return {
    messageIt: normalizeGlobalMessageForSave(values.messageIt),
    messageEn: normalizeGlobalMessageForSave(values.messageEn),
  }
}
