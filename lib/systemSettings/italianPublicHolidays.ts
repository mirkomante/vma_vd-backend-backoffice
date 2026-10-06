import { annualClosureDateKey, dayOnlyDateUtcNoon } from '@/lib/systemSettings/dayOnlyDate'
import {
  ITALIAN_NATIONAL_PUBLIC_HOLIDAY_DEFINITIONS,
  MILAN_LOCAL_PUBLIC_HOLIDAY_DEFINITIONS,
  type PublicHolidayDefinition,
} from '@/lib/systemSettings/holidayDefinitions'

export type PublicHolidayRow = {
  date: string
  label: string
}

/** Domenica di Pasqua (calendario gregoriano), mesi 1–12. */
export function gregorianEasterSunday(year: number): { month: number; day: number } {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return { month, day }
}

function resolveHolidayDefinition(
  definition: PublicHolidayDefinition,
  year: number,
): PublicHolidayRow {
  if (definition.kind === 'fixed') {
    return {
      date: dayOnlyDateUtcNoon(year, definition.month, definition.day),
      label: definition.label,
    }
  }

  const easter = gregorianEasterSunday(year)
  const easterDate = dayOnlyDateUtcNoon(year, easter.month, easter.day)
  if (definition.offsetDays === 0) {
    return { date: easterDate, label: definition.label }
  }

  const shifted = new Date(easterDate)
  shifted.setUTCDate(shifted.getUTCDate() + definition.offsetDays)
  return {
    date: dayOnlyDateUtcNoon(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth() + 1,
      shifted.getUTCDate(),
    ),
    label: definition.label,
  }
}

function holidaysFromDefinitions(
  definitions: readonly PublicHolidayDefinition[],
  year: number,
): PublicHolidayRow[] {
  return definitions.map((definition) => resolveHolidayDefinition(definition, year))
}

/** 12 festività nazionali per l'anno indicato. */
export function getItalianNationalPublicHolidaysForYear(year: number): PublicHolidayRow[] {
  return holidaysFromDefinitions(ITALIAN_NATIONAL_PUBLIC_HOLIDAY_DEFINITIONS, year)
}

/** Festività locali di Milano (patrono). */
export function getMilanLocalPublicHolidaysForYear(year: number): PublicHolidayRow[] {
  return holidaysFromDefinitions(MILAN_LOCAL_PUBLIC_HOLIDAY_DEFINITIONS, year)
}

/** 13 festività precompilabili (nazionali + Milano). */
export function getItalianPublicHolidaysForYear(year: number): PublicHolidayRow[] {
  return [
    ...getItalianNationalPublicHolidaysForYear(year),
    ...getMilanLocalPublicHolidaysForYear(year),
  ]
}

export type AnnualClosureLike = {
  date?: string | null
  label?: string | null
  id?: string | null
}

export type MergeItalianPublicHolidaysResult = {
  rows: AnnualClosureLike[]
  addedCount: number
  alreadyPresentCount: number
  totalForYear: number
}

/** Chiavi UTC delle festività predefinite per un anno. */
export function publicHolidayDateKeysForYear(year: number): Set<string> {
  const keys = new Set<string>()
  for (const holiday of getItalianPublicHolidaysForYear(year)) {
    keys.add(annualClosureDateKey(holiday.date))
  }
  return keys
}

function dateKeyForRow(date: string | null | undefined): string | null {
  if (!date) {
    return null
  }
  try {
    return annualClosureDateKey(date)
  } catch {
    return null
  }
}

/** Aggiunge le festività mancanti; non duplica date già presenti (stessa chiave UTC). */
export function mergeItalianPublicHolidays(
  existing: AnnualClosureLike[] | null | undefined,
  year: number,
): MergeItalianPublicHolidaysResult {
  const rows = [...(existing ?? [])]
  const existingKeys = new Set(
    rows.map((row) => dateKeyForRow(row.date)).filter(Boolean) as string[],
  )

  const holidays = getItalianPublicHolidaysForYear(year)
  let addedCount = 0
  let alreadyPresentCount = 0

  for (const holiday of holidays) {
    const key = annualClosureDateKey(holiday.date)
    if (existingKeys.has(key)) {
      alreadyPresentCount += 1
      continue
    }
    existingKeys.add(key)
    addedCount += 1
    rows.push({ date: holiday.date, label: holiday.label })
  }

  return {
    rows,
    addedCount,
    alreadyPresentCount,
    totalForYear: holidays.length,
  }
}

export type RemoveItalianPublicHolidaysResult = {
  rows: AnnualClosureLike[]
  removedCount: number
}

/** Rimuove solo le righe la cui data coincide con una festività predefinita dell'anno. */
export function removeItalianPublicHolidaysForYear(
  existing: AnnualClosureLike[] | null | undefined,
  year: number,
): RemoveItalianPublicHolidaysResult {
  const holidayKeys = publicHolidayDateKeysForYear(year)
  const rows = existing ?? []
  const kept: AnnualClosureLike[] = []
  let removedCount = 0

  for (const row of rows) {
    const key = dateKeyForRow(row.date)
    if (key && holidayKeys.has(key)) {
      removedCount += 1
    } else {
      kept.push(row)
    }
  }

  return { rows: kept, removedCount }
}
