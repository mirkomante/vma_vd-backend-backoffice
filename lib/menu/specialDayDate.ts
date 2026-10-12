import { dayOnlyDateUtcNoon } from '@/lib/systemSettings/dayOnlyDate'

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/
const DATE_NOON_UTC = /^(\d{4})-(\d{2})-(\d{2})T12:00:00\.000Z$/

export const SPECIAL_DAY_DATE_INVALID_MESSAGE =
  'La data deve essere un giorno nel formato AAAA-MM-GG o un istante a mezzogiorno UTC (…T12:00:00.000Z).'

/**
 * Normalizza la data di un giorno speciale (fase 6.3).
 * Accetta solo `YYYY-MM-DD` o `YYYY-MM-DDT12:00:00.000Z` — non usa normalizeAnnualClosureDate
 * (che legge componenti UTC e slitta il giorno di calendario vicino a mezzanotte Roma).
 */
export function parseAndNormalizeSpecialDayDate(input: unknown): string {
  if (input == null || input === '') {
    throw new Error(SPECIAL_DAY_DATE_INVALID_MESSAGE)
  }

  if (input instanceof Date) {
    throw new Error(SPECIAL_DAY_DATE_INVALID_MESSAGE)
  }

  if (typeof input !== 'string') {
    throw new Error(SPECIAL_DAY_DATE_INVALID_MESSAGE)
  }

  const trimmed = input.trim()

  if (DATE_NOON_UTC.test(trimmed)) {
    return trimmed
  }

  const dateOnly = DATE_ONLY.exec(trimmed)
  if (dateOnly) {
    const year = Number(dateOnly[1])
    const month = Number(dateOnly[2])
    const day = Number(dateOnly[3])
    return dayOnlyDateUtcNoon(year, month, day)
  }

  throw new Error(SPECIAL_DAY_DATE_INVALID_MESSAGE)
}

/** Soglia «oggi» in Europe/Rome come mezzogiorno UTC (filtri REST e confronti build). */
export function todayRomeAsSpecialDayDate(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const year = Number(parts.find((p) => p.type === 'year')?.value)
  const month = Number(parts.find((p) => p.type === 'month')?.value)
  const day = Number(parts.find((p) => p.type === 'day')?.value)

  if (!year || !month || !day) {
    throw new Error('Impossibile calcolare la data odierna in Europe/Rome.')
  }

  return dayOnlyDateUtcNoon(year, month, day)
}
