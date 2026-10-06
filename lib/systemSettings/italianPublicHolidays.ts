import { annualClosureDateKey, dayOnlyDateUtcNoon } from '@/lib/systemSettings/dayOnlyDate'

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

function fixedHoliday(year: number, month: number, day: number, label: string): PublicHolidayRow {
  return {
    date: dayOnlyDateUtcNoon(year, month, day),
    label,
  }
}

/** Le 12 festività nazionali italiane per l'anno indicato (ADR-107 §1 / fase-7.2). */
export function getItalianPublicHolidaysForYear(year: number): PublicHolidayRow[] {
  const easter = gregorianEasterSunday(year)
  const easterDate = dayOnlyDateUtcNoon(year, easter.month, easter.day)
  const easterSunday = new Date(easterDate)
  const easterMonday = new Date(easterSunday)
  easterMonday.setUTCDate(easterMonday.getUTCDate() + 1)

  return [
    fixedHoliday(year, 1, 1, 'Capodanno'),
    fixedHoliday(year, 1, 6, 'Epifania'),
    {
      date: easterDate,
      label: 'Pasqua',
    },
    {
      date: dayOnlyDateUtcNoon(
        easterMonday.getUTCFullYear(),
        easterMonday.getUTCMonth() + 1,
        easterMonday.getUTCDate(),
      ),
      label: 'Lunedì dell’Angelo',
    },
    fixedHoliday(year, 4, 25, 'Festa della Liberazione'),
    fixedHoliday(year, 5, 1, 'Festa del Lavoro'),
    fixedHoliday(year, 6, 2, 'Festa della Repubblica'),
    fixedHoliday(year, 8, 15, 'Ferragosto'),
    fixedHoliday(year, 11, 1, 'Ognissanti'),
    fixedHoliday(year, 12, 8, 'Immacolata Concezione'),
    fixedHoliday(year, 12, 25, 'Natale'),
    fixedHoliday(year, 12, 26, 'Santo Stefano'),
  ]
}

export type AnnualClosureLike = {
  date?: string | null
  label?: string | null
  id?: string | null
}

/** Aggiunge le festività mancanti; non duplica date già presenti (stessa chiave UTC). */
export function mergeItalianPublicHolidays(
  existing: AnnualClosureLike[] | null | undefined,
  year: number,
): AnnualClosureLike[] {
  const rows = [...(existing ?? [])]
  const keys = new Set(
    rows.map((row) => (row.date ? annualClosureDateKey(row.date) : null)).filter(Boolean) as string[],
  )

  for (const holiday of getItalianPublicHolidaysForYear(year)) {
    const key = annualClosureDateKey(holiday.date)
    if (keys.has(key)) {
      continue
    }
    keys.add(key)
    rows.push({ date: holiday.date, label: holiday.label })
  }

  return rows
}
