import type { PublishedGlobalMessageSummary } from '@/lib/menu/globalMessage/summarizePublishedGlobalMessage'

/** File di disponibilità leggibile e valido per il pannello «Sul menù pubblico» (ora e pubblicazione). */
export function isPublishedGlobalMessageReadable(
  summary: PublishedGlobalMessageSummary | null | undefined,
): summary is PublishedGlobalMessageSummary {
  return summary != null
}
