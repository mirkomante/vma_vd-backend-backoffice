/**
 * Simulazioni solo in sviluppo (6.6). Mai attive con NODE_ENV=production.
 *
 * - `APP_MENU_DEV_SIMULATE_LOAD_ERROR=1` → la lettura fallisce (riga assente in home).
 * - `APP_MENU_DEV_SIMULATE_SAVE_ERROR=1` → il salvataggio fallisce (schermate Menù).
 * - `APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS` → ritardo in millisecondi sulla lettura.
 * - `APP_MENU_DEV_SIMULATE_PUBLISH_DELAY_MS` → ritardo **solo in lettura** del file pubblicato
 *   su Messaggio globale: dopo un salvataggio, `readPublishedGlobalMessage` restituisce lo snapshot
 *   precedente finché non sono passati N ms (stato in `lib/app/globalMessage/devPublishReadDelay.ts`).
 */
export function shouldSimulateMenuLoadError(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.APP_MENU_DEV_SIMULATE_LOAD_ERROR === '1'
  )
}

export function shouldSimulateMenuSaveError(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.APP_MENU_DEV_SIMULATE_SAVE_ERROR === '1'
  )
}

export function getMenuDevSimulateLoadDelayMs(): number {
  if (process.env.NODE_ENV === 'production') {
    return 0
  }
  const raw = process.env.APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS
  if (!raw) {
    return 0
  }
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

export function getMenuDevSimulatePublishDelayMs(): number {
  if (process.env.NODE_ENV === 'production') {
    return 0
  }
  const raw = process.env.APP_MENU_DEV_SIMULATE_PUBLISH_DELAY_MS
  if (!raw) {
    return 0
  }
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}
