const ROME = 'Europe/Rome'

/**
 * Data in lettere con giorno della settimana (giorni speciali §2), fuso Europe/Rome.
 * Accetta `YYYY-MM-DD` o istante ISO normalizzato a mezzogiorno UTC.
 */
export function formatSpecialDayDateLong(dateInput: string): string {
  const dateOnly = dateInput.slice(0, 10)
  const [year, month, day] = dateOnly.split('-').map((part) => Number.parseInt(part, 10))
  if (!year || !month || !day) {
    return dateOnly
  }

  const utcNoon = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0))
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: ROME,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(utcNoon)
}
