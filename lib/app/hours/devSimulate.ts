/**
 * Simulazione errori solo in sviluppo (8.5). Mai attiva con NODE_ENV=production.
 *
 * - `APP_HOURS_DEV_SIMULATE_LOAD_ERROR=1` → la lettura del Global fallisce (errore di caricamento).
 * - `APP_HOURS_DEV_SIMULATE_SAVE_ERROR=1` → il salvataggio fallisce (errore del server).
 */
export function shouldSimulateHoursLoadError(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.APP_HOURS_DEV_SIMULATE_LOAD_ERROR === '1'
  )
}

export function shouldSimulateHoursSaveError(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.APP_HOURS_DEV_SIMULATE_SAVE_ERROR === '1'
  )
}
