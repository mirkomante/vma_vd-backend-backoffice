import { applyDevPublishReadDelay } from '@/lib/app/globalMessage/devPublishReadDelay'
import { resolveAvailabilityStorage } from '@/lib/menu/availability/gcsAvailabilityWriter'
import {
  summarizePublishedGlobalMessageFromRaw,
  type PublishedGlobalMessageSummary,
} from '@/lib/menu/globalMessage/summarizePublishedGlobalMessage'

export type PublishedSnapshotReadResult =
  | { ok: true; summary: PublishedGlobalMessageSummary | null }
  | { ok: false; error: 'read' }

/** Lettura grezza del file (senza ritardo simulato). */
export async function readActualPublishedGlobalMessageSnapshot(): Promise<PublishedGlobalMessageSummary | null> {
  const storage = resolveAvailabilityStorage()
  if (!storage) {
    return null
  }
  const raw = await storage.readCurrentObject()
  return summarizePublishedGlobalMessageFromRaw(raw)
}

/** Lettura per la UI, con ritardo di pubblicazione simulato se attivo. */
export async function readPublishedGlobalMessageForUi(
  nowMs: number = Date.now(),
): Promise<PublishedSnapshotReadResult> {
  try {
    const actual = await readActualPublishedGlobalMessageSnapshot()
    const summary = applyDevPublishReadDelay(actual, nowMs)
    return { ok: true, summary }
  } catch {
    return { ok: false, error: 'read' }
  }
}
