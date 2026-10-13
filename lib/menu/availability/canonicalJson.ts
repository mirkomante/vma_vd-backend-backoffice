import type { AvailabilityDocumentV1 } from './types'

/** Confronto contenuto ignorando `updatedAt` (ADR-112, fase 6.4). */
export function availabilityDocumentWithoutUpdatedAt(
  doc: AvailabilityDocumentV1,
): Omit<AvailabilityDocumentV1, 'updatedAt'> {
  const { updatedAt: _ignored, ...rest } = doc
  return rest
}

function sortRecordKeys<T extends Record<string, unknown>>(record: T): T {
  const sorted = {} as T
  for (const key of Object.keys(record).sort()) {
    sorted[key as keyof T] = record[key as keyof T]
  }
  return sorted
}

export function canonicalAvailabilityJson(doc: AvailabilityDocumentV1): string {
  const withoutTs = availabilityDocumentWithoutUpdatedAt(doc)
  const normalized = {
    ...withoutTs,
    dishes: sortRecordKeys(withoutTs.dishes),
    wines: sortRecordKeys(withoutTs.wines),
    drinks: sortRecordKeys(withoutTs.drinks),
    spirits: sortRecordKeys(withoutTs.spirits),
    fixedMenus: sortRecordKeys(withoutTs.fixedMenus),
    services: sortRecordKeys(withoutTs.services),
  }
  return JSON.stringify(normalized)
}

export function parseAvailabilityJsonFromGcs(text: string): AvailabilityDocumentV1 | null {
  try {
    const parsed = JSON.parse(text) as AvailabilityDocumentV1
    if (parsed?.schemaVersion !== 1) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}
