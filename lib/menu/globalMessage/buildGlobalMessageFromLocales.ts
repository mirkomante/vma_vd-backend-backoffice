import type { AvailabilityDocumentV1 } from '@/lib/menu/availability/types'

/** Replica di `buildGlobalMessage` in `buildAvailabilityDocument.ts` (ADR-112 §3). */
export function buildGlobalMessageFromLocales(
  it: string,
  en: string,
): AvailabilityDocumentV1['globalMessage'] | undefined {
  const itTrim = it.trim()
  const enTrim = en.trim()
  if (!itTrim && !enTrim) {
    return undefined
  }
  const messageIt = itTrim || enTrim
  const messageEn = enTrim || messageIt
  return { it: messageIt, en: messageEn }
}
