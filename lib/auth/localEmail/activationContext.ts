/** Token attivazione App locale: solo request interna create → afterChange (non esposto in API). */
export const PENDING_ACTIVATION_TOKEN_CONTEXT_KEY = 'pendingActivationToken'

export function setPendingActivationToken(req: { context?: Record<string, unknown> }, token: string): void {
  req.context = req.context ?? {}
  req.context[PENDING_ACTIVATION_TOKEN_CONTEXT_KEY] = token
}

export function takePendingActivationToken(req: {
  context?: Record<string, unknown>
}): string | undefined {
  const token = req.context?.[PENDING_ACTIVATION_TOKEN_CONTEXT_KEY]
  if (typeof token === 'string' && token.length > 0) {
    delete req.context![PENDING_ACTIVATION_TOKEN_CONTEXT_KEY]
    return token
  }
  return undefined
}
