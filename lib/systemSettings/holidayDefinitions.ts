/** Definizione di festività a data fissa (mese 1–12, giorno del mese). */
export type FixedHolidayDefinition = {
  kind: 'fixed'
  month: number
  day: number
  label: string
}

/** Definizione di festività calcolata rispetto alla Pasqua gregoriana. */
export type EasterOffsetHolidayDefinition = {
  kind: 'easter'
  offsetDays: number
  label: string
}

export type PublicHolidayDefinition = FixedHolidayDefinition | EasterOffsetHolidayDefinition

/** 12 festività nazionali italiane (ADR-107 §1 / fase-7.2). */
export const ITALIAN_NATIONAL_PUBLIC_HOLIDAY_DEFINITIONS: readonly PublicHolidayDefinition[] = [
  { kind: 'fixed', month: 1, day: 1, label: 'Capodanno' },
  { kind: 'fixed', month: 1, day: 6, label: 'Epifania' },
  { kind: 'easter', offsetDays: 0, label: 'Pasqua' },
  { kind: 'easter', offsetDays: 1, label: 'Lunedì dell’Angelo' },
  { kind: 'fixed', month: 4, day: 25, label: 'Festa della Liberazione' },
  { kind: 'fixed', month: 5, day: 1, label: 'Festa del Lavoro' },
  { kind: 'fixed', month: 6, day: 2, label: 'Festa della Repubblica' },
  { kind: 'fixed', month: 8, day: 15, label: 'Ferragosto' },
  { kind: 'fixed', month: 11, day: 1, label: 'Ognissanti' },
  { kind: 'fixed', month: 12, day: 8, label: 'Immacolata Concezione' },
  { kind: 'fixed', month: 12, day: 25, label: 'Natale' },
  { kind: 'fixed', month: 12, day: 26, label: 'Santo Stefano' },
]

/** Festività patronale di Milano (strutture in città). */
export const MILAN_LOCAL_PUBLIC_HOLIDAY_DEFINITIONS: readonly FixedHolidayDefinition[] = [
  { kind: 'fixed', month: 12, day: 7, label: 'Sant’Ambrogio' },
]
