import { compareItalianNames } from '@/lib/menu/display/sortByItalianName'

export type CatalogRowWithId = { id: number | string; name: string }

/** Unisce pagine senza doppioni e ordina per nome (italiano). */
export function mergePaginatedRows<T extends CatalogRowWithId>(
  existing: readonly T[],
  incoming: readonly T[],
): T[] {
  const byId = new Map<string, T>()
  for (const row of existing) {
    byId.set(String(row.id), row)
  }
  for (const row of incoming) {
    byId.set(String(row.id), row)
  }
  const merged = [...byId.values()]
  merged.sort((a, b) => compareItalianNames(a.name, b.name))
  return merged
}
