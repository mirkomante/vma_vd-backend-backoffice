import { getMenuDevSimulatePublishDelayMs } from '@/lib/app/menu/devSimulate'
import type { PublishedGlobalMessageSummary } from '@/lib/menu/globalMessage/summarizePublishedGlobalMessage'

export type PublishedReadSnapshot = PublishedGlobalMessageSummary | null

type DelayState = {
  untilMs: number
  previousSnapshot: PublishedReadSnapshot
}

let delayState: DelayState | null = null

export function resetDevPublishReadDelayForTests(): void {
  delayState = null
}

/** Chiamato dopo «Salva modifiche» se la simulazione è attiva. */
export function markGlobalMessageSaveForDevPublishDelay(
  previousSnapshot: PublishedReadSnapshot,
  nowMs: number,
): void {
  const delayMs = getMenuDevSimulatePublishDelayMs()
  if (delayMs <= 0) {
    delayState = null
    return
  }
  delayState = { untilMs: nowMs + delayMs, previousSnapshot }
}

/** Restituisce lo snapshot precedente finché non scade il ritardo simulato. */
export function applyDevPublishReadDelay(
  actual: PublishedReadSnapshot,
  nowMs: number,
): PublishedReadSnapshot {
  const delayMs = getMenuDevSimulatePublishDelayMs()
  if (delayMs <= 0 || !delayState) {
    return actual
  }
  if (nowMs < delayState.untilMs) {
    return delayState.previousSnapshot
  }
  delayState = null
  return actual
}
