/** Claim JWT che distingue quale flusso ha emesso il cookie (ADR-002 / istanze SSO). */
export const JWT_SESSION_STRATEGY_CLAIM = 'strategy'

export function withSessionStrategyClaim(
  fieldsToSign: Record<string, unknown>,
  strategyName: string,
): Record<string, unknown> {
  return {
    ...fieldsToSign,
    [JWT_SESSION_STRATEGY_CLAIM]: strategyName,
  }
}

export function readSessionStrategyClaim(jwtPayload: Record<string, unknown>): string | undefined {
  const raw = jwtPayload[JWT_SESSION_STRATEGY_CLAIM]
  return typeof raw === 'string' && raw.length > 0 ? raw : undefined
}

export function jwtSessionStrategyMatches(
  jwtPayload: Record<string, unknown>,
  expectedStrategy: string,
  acceptMissingClaim: boolean,
): boolean {
  const claim = readSessionStrategyClaim(jwtPayload)
  if (claim === undefined) {
    return acceptMissingClaim
  }
  return claim === expectedStrategy
}
