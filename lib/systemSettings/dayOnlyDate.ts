/**
 * Giorno intero a mezzogiorno UTC — stessa convenzione del selettore `dayOnly` di Payload
 * (audit F18, fase-7.2).
 */
export function dayOnlyDateUtcNoon(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0)).toISOString()
}

export function normalizeAnnualClosureDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Data di chiusura non valida: ${String(input)}`)
  }
  return dayOnlyDateUtcNoon(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())
}

/** Chiave YYYY-MM-DD (UTC) per confronto duplicati su `annualClosures[].date`. */
export function annualClosureDateKey(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return iso
  }
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
