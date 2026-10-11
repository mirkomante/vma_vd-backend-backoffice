import type { ImpostazioniSistema } from '@/payload-types'
import { sortAnnualClosuresByDate } from '@/lib/systemSettings/annualClosures'
import { annualClosureDateKey, normalizeAnnualClosureDate } from '@/lib/systemSettings/dayOnlyDate'
import type { SystemSettingsWriteData } from '@/lib/systemSettings/validateSystemSettings'

import type { AnnualClosureLike } from '@/lib/systemSettings/italianPublicHolidays'

import type { AnnualClosureFormRow, HoursFormValues, WeekdayValue } from './types'

export const WEEKDAY_ITEMS: { value: WeekdayValue; short: string; aria: string }[] = [
  { value: 'monday', short: 'Lun', aria: 'Lunedì' },
  { value: 'tuesday', short: 'Mar', aria: 'Martedì' },
  { value: 'wednesday', short: 'Mer', aria: 'Mercoledì' },
  { value: 'thursday', short: 'Gio', aria: 'Giovedì' },
  { value: 'friday', short: 'Ven', aria: 'Venerdì' },
  { value: 'saturday', short: 'Sab', aria: 'Sabato' },
  { value: 'sunday', short: 'Dom', aria: 'Domenica' },
]

let closureIdCounter = 0

export function newClosureClientId(): string {
  closureIdCounter += 1
  return `closure-${closureIdCounter}-${Date.now()}`
}

function emptyServiceTimes(): { startTime: string; endTime: string } {
  return { startTime: '', endTime: '' }
}

export function emptyHoursFormValues(): HoursFormValues {
  return {
    servicesNotConfigured: true,
    lunch: emptyServiceTimes(),
    dinner: emptyServiceTimes(),
    weeklyClosedDays: [],
    annualClosures: [],
    bnb: emptyServiceTimes(),
  }
}

function serviceFromGlobal(
  services: ImpostazioniSistema['services'],
  name: 'lunch' | 'dinner',
): { startTime: string; endTime: string } {
  const row = services?.find((s) => s.name === name)
  return {
    startTime: row?.startTime ?? '',
    endTime: row?.endTime ?? '',
  }
}

export function hoursFormValuesFromGlobal(doc: ImpostazioniSistema): HoursFormValues {
  const servicesNotConfigured = !doc.services?.length
  const sortedClosures = sortAnnualClosuresByDate(doc.annualClosures ?? [])

  return {
    servicesNotConfigured,
    lunch: serviceFromGlobal(doc.services, 'lunch'),
    dinner: serviceFromGlobal(doc.services, 'dinner'),
    weeklyClosedDays: [...(doc.weeklyClosedDays ?? [])] as WeekdayValue[],
    annualClosures: sortedClosures.map((row) => ({
      clientId: row.id ?? newClosureClientId(),
      date: row.date ?? '',
      label: row.label ?? '',
      payloadId: row.id ?? null,
    })),
    bnb: {
      startTime: doc.bnb?.checkInTime ?? '',
      endTime: doc.bnb?.checkOutTime ?? '',
    },
  }
}

/** Converte i valori del modulo nel payload della tab Orari e chiusure. */
export function hoursFormValuesToWriteData(values: HoursFormValues): SystemSettingsWriteData {
  return {
    services: [
      { name: 'lunch', startTime: values.lunch.startTime, endTime: values.lunch.endTime },
      { name: 'dinner', startTime: values.dinner.startTime, endTime: values.dinner.endTime },
    ],
    weeklyClosedDays: values.weeklyClosedDays,
    annualClosures: values.annualClosures.map((row) => ({
      id: row.payloadId ?? undefined,
      date: row.date ? normalizeAnnualClosureDate(row.date) : row.date,
      label: row.label,
    })),
    bnb: {
      checkInTime: values.bnb.startTime || null,
      checkOutTime: values.bnb.endTime || null,
    },
  }
}

function normalizeClosuresForCompare(rows: AnnualClosureFormRow[]): string {
  return JSON.stringify(
    sortAnnualClosuresByDate(
      rows.map((r) => ({ date: r.date, label: r.label.trim() })),
    ),
  )
}

export function hoursFormValuesEqual(a: HoursFormValues, b: HoursFormValues): boolean {
  return (
    a.servicesNotConfigured === b.servicesNotConfigured &&
    a.lunch.startTime === b.lunch.startTime &&
    a.lunch.endTime === b.lunch.endTime &&
    a.dinner.startTime === b.dinner.startTime &&
    a.dinner.endTime === b.dinner.endTime &&
    a.bnb.startTime === b.bnb.startTime &&
    a.bnb.endTime === b.bnb.endTime &&
    JSON.stringify([...a.weeklyClosedDays].sort()) ===
      JSON.stringify([...b.weeklyClosedDays].sort()) &&
    normalizeClosuresForCompare(a.annualClosures) === normalizeClosuresForCompare(b.annualClosures)
  )
}

export function sortFormClosures(values: HoursFormValues): HoursFormValues {
  const sorted = sortAnnualClosuresByDate(values.annualClosures)
  return {
    ...values,
    annualClosures: sorted.map((row) => {
      const prev = values.annualClosures.find(
        (r) => r.date === row.date && r.label === row.label,
      )
      return {
        clientId: prev?.clientId ?? newClosureClientId(),
        date: row.date ?? '',
        label: row.label ?? '',
        payloadId: prev?.payloadId ?? null,
      }
    }),
  }
}

export function mapLibClosuresToFormRows(
  previous: AnnualClosureFormRow[],
  rows: AnnualClosureLike[],
): AnnualClosureFormRow[] {
  const byDateKey = new Map(
    previous
      .filter((row) => row.date)
      .map((row) => [annualClosureDateKey(row.date), row] as const),
  )
  return rows.map((row) => {
    const key = row.date ? annualClosureDateKey(row.date) : ''
    const existing = key ? byDateKey.get(key) : undefined
    return {
      clientId: existing?.clientId ?? newClosureClientId(),
      date: row.date ?? '',
      label: row.label ?? '',
      payloadId: existing?.payloadId ?? row.id ?? null,
    }
  })
}

export function closureYearFromDate(iso: string): number | null {
  if (!iso) {
    return null
  }
  try {
    const d = new Date(normalizeAnnualClosureDate(iso))
    return d.getUTCFullYear()
  } catch {
    return null
  }
}

export function groupClosuresByYear(
  rows: AnnualClosureFormRow[],
): { year: number; rows: AnnualClosureFormRow[] }[] {
  const byYear = new Map<number, AnnualClosureFormRow[]>()
  for (const row of rows) {
    const year = closureYearFromDate(row.date)
    if (year == null) {
      continue
    }
    const list = byYear.get(year) ?? []
    list.push(row)
    byYear.set(year, list)
  }
  return [...byYear.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, yearRows]) => ({ year, rows: yearRows }))
}

export function isoToDateInputValue(iso: string): string {
  if (!iso) {
    return ''
  }
  return annualClosureDateKey(normalizeAnnualClosureDate(iso))
}

export function dateInputValueToIso(value: string): string {
  const parts = value.split('-').map((p) => Number.parseInt(p, 10))
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    throw new Error('Data non valida')
  }
  const [year, month, day] = parts
  return normalizeAnnualClosureDate(
    new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0)).toISOString(),
  )
}

export function isHolidayYearValid(yearText: string): boolean {
  if (!/^\d{4}$/.test(yearText)) {
    return false
  }
  const year = Number.parseInt(yearText, 10)
  return year >= 1900 && year <= 2100
}
