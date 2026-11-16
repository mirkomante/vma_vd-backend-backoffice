export const MENU_REBUILD_ENDPOINT_PATH = '/menu/rebuild' as const

/** Finestra anti-doppio avvio (ADR-115 / esecuzione 6.5 §3.6). */
export const MENU_REBUILD_DEBOUNCE_MS = 120_000

export const MENU_REBUILD_BRANCH = 'main' as const

export const MENU_REBUILD_TRIGGER_NAME_ENV = 'MENU_REBUILD_TRIGGER_NAME' as const

export const MENU_REBUILD_CLIENT_TIMEOUT_MS = 15_000

export const REBUILD_STARTED_DETAIL_PREFIX = 'rebuild-started:' as const

export const MENU_REBUILD_BUILD_ID_UNAVAILABLE = 'id non disponibile' as const

export const CLOUDBUILD_API_BASE_URL = 'https://cloudbuild.googleapis.com/v1' as const

export const CLOUDBUILD_METADATA_TOKEN_URL =
  'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token' as const

export const MENU_REBUILD_RUN_BODY_JSON = JSON.stringify({
  source: { branchName: MENU_REBUILD_BRANCH },
})