import {
  SPECIAL_DAY_OVERLAP_MESSAGE,
  specialDayScopesOverlap,
  type SpecialDayScope,
} from '@/lib/menu/validateSpecialDayOverlap'

export type SpecialDayOverlapCandidate = {
  id?: string | number
  date: string
  scope: SpecialDayScope
  disabled: boolean
}

export type SpecialDayOverlapExisting = {
  id?: string | number
  date: string
  scope: SpecialDayScope
  disabled?: boolean | null
}

function normalizeDateKey(date: string): string {
  return date.slice(0, 10)
}

/** Anticipo modulo: stesso messaggio del server; ignora disattivati e il giorno in modifica. */
export function anticipateSpecialDayOverlap(
  existingDays: readonly SpecialDayOverlapExisting[],
  candidate: SpecialDayOverlapCandidate,
): string | null {
  if (candidate.disabled) {
    return null
  }
  const dateKey = normalizeDateKey(candidate.date)
  const selfId = candidate.id != null ? String(candidate.id) : null

  for (const day of existingDays) {
    if (day.disabled) {
      continue
    }
    if (selfId != null && day.id != null && String(day.id) === selfId) {
      continue
    }
    if (normalizeDateKey(day.date) !== dateKey) {
      continue
    }
    if (specialDayScopesOverlap(candidate.scope, day.scope)) {
      return SPECIAL_DAY_OVERLAP_MESSAGE
    }
  }
  return null
}
