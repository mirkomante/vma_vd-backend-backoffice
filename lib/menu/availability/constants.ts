/** Oggetto pubblico sul bucket GCS (ADR-112). */
export const MENU_AVAILABILITY_OBJECT_PATH = 'disponibilita.json'

/** Intestazione HTTP per il secret dello Scheduler (ADR-105, fase 6.4). */
export const SCHEDULER_AVAILABILITY_SECRET_HEADER = 'X-Scheduler-Availability-Secret'

/** Variabile d'ambiente: nome del bucket (senza prefisso gs://). */
export const MENU_AVAILABILITY_GCS_BUCKET_ENV = 'MENU_AVAILABILITY_GCS_BUCKET'

export const SCHEDULER_SECRET_AVAILABILITY_ENV = 'SCHEDULER_SECRET_AVAILABILITY'

/**
 * Flag su `context` della Local API (Payload 3.90): gli hook non riscrivono il file
 * finché è attivo; una sync esplicita va fatta alla fine dell'operazione di massa.
 */
export const SUPPRESS_MENU_AVAILABILITY_SYNC_CONTEXT_KEY = 'suppressMenuAvailabilitySync'

/** Timeout massimo per upload GCS dentro la richiesta (Cloud Run). */
export const MENU_AVAILABILITY_GCS_UPLOAD_TIMEOUT_MS = 8_000

/** Finestra massima di confini da considerare dopo un fermo lungo (fase 6.4). */
export const SERVICE_BOUNDARY_LOOKBACK_DAYS = 7

/** Risposta fissa per secret assente, errato o non configurato (403). */
export const SCHEDULER_FORBIDDEN_RESPONSE_BODY = '{"ok":false}'

export const SCHEDULER_OK_RESPONSE_BODY = '{"ok":true}'
