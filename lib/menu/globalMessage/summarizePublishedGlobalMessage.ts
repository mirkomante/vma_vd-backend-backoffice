import { parseAvailabilityJsonFromGcs } from '@/lib/menu/availability/canonicalJson'
import type { AvailabilityDocumentV1 } from '@/lib/menu/availability/types'

export type PublishedGlobalMessageSummary = {
  effectiveIt: string
  updatedAtIso: string
}

/** Da JSON grezzo del file: messaggio italiano effettivo e `updatedAt`; `null` se non leggibile o non valido. */
export function summarizePublishedGlobalMessageFromRaw(
  raw: string | null,
): PublishedGlobalMessageSummary | null {
  if (raw == null || raw === '') {
    return null
  }
  const parsed = parseAvailabilityJsonFromGcs(raw)
  if (!parsed?.updatedAt) {
    return null
  }
  const effectiveIt = effectiveItFromPublishedDocument(parsed)
  return { effectiveIt, updatedAtIso: parsed.updatedAt }
}

export function effectiveItFromPublishedDocument(doc: AvailabilityDocumentV1): string {
  const gm = doc.globalMessage
  if (!gm) {
    return ''
  }
  const it = typeof gm.it === 'string' ? gm.it.trim() : ''
  if (it) {
    return it
  }
  const en = typeof gm.en === 'string' ? gm.en.trim() : ''
  return en
}
