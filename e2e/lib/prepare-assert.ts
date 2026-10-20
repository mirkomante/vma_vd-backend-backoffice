import type { PrepareOutcome } from './menu-list/prepare-state'

/** Preparazione stato fallita → eccezione (ERRORE-STRUMENTO nel reporter, non FALLITO). */
export function assertPrepared(prep: PrepareOutcome): void {
  if (!prep.ok) {
    throw new Error(prep.reason ?? 'stato non preparato')
  }
}
