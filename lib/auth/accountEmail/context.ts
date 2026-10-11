/** Evita l’email «Account creato» (es. seed super-admin, scrittura timestamp post-invio). */
export const SKIP_ACCOUNT_CREATED_EMAIL_CONTEXT_KEY = 'skipAccountCreatedEmail'

export function setSkipAccountCreatedEmail(req: { context?: Record<string, unknown> }): void {
  req.context = req.context ?? {}
  req.context[SKIP_ACCOUNT_CREATED_EMAIL_CONTEXT_KEY] = true
}

export function shouldSkipAccountCreatedEmail(req: {
  context?: Record<string, unknown>
}): boolean {
  return req.context?.[SKIP_ACCOUNT_CREATED_EMAIL_CONTEXT_KEY] === true
}
