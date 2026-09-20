export type OAuthLoginArea = 'admin' | 'app'

export const OAUTH_LOGIN_AREA_CONTEXT_KEY = 'oauthLoginArea'

export function setOAuthLoginArea(
  req: { context?: Record<string, unknown> },
  area: OAuthLoginArea,
): void {
  req.context = req.context ?? {}
  req.context[OAUTH_LOGIN_AREA_CONTEXT_KEY] = area
}

export function getOAuthLoginArea(req: {
  context?: Record<string, unknown>
}): OAuthLoginArea | undefined {
  const value = req.context?.[OAUTH_LOGIN_AREA_CONTEXT_KEY]
  return value === 'admin' || value === 'app' ? value : undefined
}
