/**
 * Variabili non ammesse con `NODE_ENV=production` (deploy Cloud Run).
 * Vedi `assertMenuAvailabilityDevOnlyEnvAllowed` in `gcsAvailabilityWriter.ts`.
 */
export const MENU_AVAILABILITY_FORBIDDEN_IN_PRODUCTION_ENV_KEYS = [
  'MENU_AVAILABILITY_IN_MEMORY',
  'MENU_AVAILABILITY_WRITE_TRACE_FILE',
  'MENU_AVAILABILITY_MIRROR_FILE',
  'MENU_AVAILABILITY_DISABLE_STATE_OVERLAY',
  'MENU_AVAILABILITY_DEBUG_HOOK_READ',
  'MENU_AVAILABILITY_SYNC_DEBUG_FILE',
] as const

export const MENU_AVAILABILITY_DISABLE_STATE_OVERLAY_ENV = 'MENU_AVAILABILITY_DISABLE_STATE_OVERLAY'

/**
 * In produzione rifiuta configurazioni di prova (memoria, trace, mirror, overlay disabilitato, debug).
 * Chiamato prima di risolvere lo storage GCS/in-memory.
 */
export function assertMenuAvailabilityDevOnlyEnvAllowed(
  env: NodeJS.ProcessEnv = process.env,
): void {
  if (env.NODE_ENV !== 'production') {
    return
  }
  for (const key of MENU_AVAILABILITY_FORBIDDEN_IN_PRODUCTION_ENV_KEYS) {
    const value = env[key]?.trim()
    if (value && value !== '0' && value !== 'false') {
      throw new Error(
        `[menu-availability] Con NODE_ENV=production la variabile ${key} non è ammessa (valore impostato). Rimuoverla dal deploy.`,
      )
    }
  }
}

/** Overlay hook sempre attivo in produzione (DISABLE vietato). */
export function isMenuAvailabilityStateOverlayEnabled(): boolean {
  assertMenuAvailabilityDevOnlyEnvAllowed()
  if (process.env.NODE_ENV === 'production') {
    return true
  }
  return process.env[MENU_AVAILABILITY_DISABLE_STATE_OVERLAY_ENV] !== '1'
}
