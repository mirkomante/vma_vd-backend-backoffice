/** Orario locale del ristorante, 24h, senza data né fuso (ADR-109, emendamento §1). */
export const TIME_OF_DAY_HH_MM_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/

export function isValidTimeOfDay(value: unknown): value is string {
  return typeof value === 'string' && TIME_OF_DAY_HH_MM_REGEX.test(value)
}

export function validateTimeOfDayField(value: unknown): true | string {
  if (value == null || value === '') {
    return 'Orario obbligatorio.'
  }
  if (!isValidTimeOfDay(value)) {
    return 'Formato non valido: usa HH:mm in 24 ore (es. 09:30).'
  }
  return true
}
