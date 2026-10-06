import { annualClosureDateKey, normalizeAnnualClosureDate } from '@/lib/systemSettings/dayOnlyDate'
import type { AnnualClosureLike } from '@/lib/systemSettings/italianPublicHolidays'

function closureSortKey(date: string | null | undefined): number | null {
  if (!date) {
    return null
  }
  try {
    return new Date(normalizeAnnualClosureDate(date)).getTime()
  } catch {
    return null
  }
}

/** Confronto righe: data crescente (UTC); righe senza data in fondo; pari data = ordine stabile. */
export function compareAnnualClosureRows(a: AnnualClosureLike, b: AnnualClosureLike): number {
  const keyA = closureSortKey(a.date)
  const keyB = closureSortKey(b.date)

  if (keyA === null && keyB === null) {
    return 0
  }
  if (keyA === null) {
    return 1
  }
  if (keyB === null) {
    return -1
  }
  if (keyA !== keyB) {
    return keyA - keyB
  }
  return 0
}

/** Ordina per data crescente; righe senza data in fondo (ordine relativo stabile). */
export function sortAnnualClosuresByDate<T extends AnnualClosureLike>(rows: T[] | null | undefined): T[] {
  if (!rows?.length) {
    return []
  }
  return rows
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const cmp = compareAnnualClosureRows(left.row, right.row)
      if (cmp !== 0) {
        return cmp
      }
      return left.index - right.index
    })
    .map(({ row }) => row)
}

/** gg/mm/aaaa in UTC (allineato al dayOnly Payload). */
export function formatAnnualClosureDateUtc(iso: string): string {
  const normalized = normalizeAnnualClosureDate(iso)
  const d = new Date(normalized)
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const year = d.getUTCFullYear()
  return `${day}/${month}/${year}`
}

export function formatAnnualClosureRowLabel(
  date?: string | null,
  label?: string | null,
): string {
  if (!date) {
    return 'Chiusura (nuova)'
  }
  try {
    const datePart = formatAnnualClosureDateUtc(date)
    const labelPart = label?.trim() ? ` · ${label.trim()}` : ''
    return `Chiusura ${datePart}${labelPart}`
  } catch {
    return 'Chiusura (nuova)'
  }
}

export function isAnnualClosureDateKeyInSet(
  date: string | null | undefined,
  keys: ReadonlySet<string>,
): boolean {
  if (!date) {
    return false
  }
  try {
    return keys.has(annualClosureDateKey(normalizeAnnualClosureDate(date)))
  } catch {
    return false
  }
}
