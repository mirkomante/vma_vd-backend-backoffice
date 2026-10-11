/** Evita l’email «Account creato» per l’intera richiesta (es. seed super-admin). */
export const SKIP_ACCOUNT_CREATED_EMAIL_CONTEXT_KEY = 'skipAccountCreatedEmail'

/** Id utenti per cui saltare l’invio (es. subito dopo invio riuscito, prima di scrivere il timestamp). */
export const SKIP_ACCOUNT_CREATED_EMAIL_IDS_CONTEXT_KEY = 'skipAccountCreatedEmailIds'

function skipIdsSet(req: { context?: Record<string, unknown> }): Set<string> {
  const existing = req.context?.[SKIP_ACCOUNT_CREATED_EMAIL_IDS_CONTEXT_KEY]
  if (existing instanceof Set) {
    return existing
  }
  const set = new Set<string>()
  if (req.context) {
    req.context[SKIP_ACCOUNT_CREATED_EMAIL_IDS_CONTEXT_KEY] = set
  }
  return set
}

/**
 * @param userId — se assente, salta per tutta la richiesta (seed). Se presente, solo quel documento.
 */
export function setSkipAccountCreatedEmail(
  req: { context?: Record<string, unknown> },
  userId?: number | string,
): void {
  req.context = req.context ?? {}
  if (userId === undefined || userId === null || userId === '') {
    req.context[SKIP_ACCOUNT_CREATED_EMAIL_CONTEXT_KEY] = true
    return
  }
  skipIdsSet(req).add(String(userId))
}

export function shouldSkipAccountCreatedEmail(
  req: { context?: Record<string, unknown> },
  userId?: number | string,
): boolean {
  if (req.context?.[SKIP_ACCOUNT_CREATED_EMAIL_CONTEXT_KEY] === true) {
    return true
  }
  if (userId === undefined || userId === null || userId === '') {
    return false
  }
  const set = req.context?.[SKIP_ACCOUNT_CREATED_EMAIL_IDS_CONTEXT_KEY]
  if (set instanceof Set) {
    return set.has(String(userId))
  }
  return false
}
