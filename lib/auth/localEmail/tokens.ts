import crypto from 'crypto'

/**
 * Default Payload 3.89.0 (`forgotPassword.expiration`): 3_600_000 ms = 1 ora.
 * Verificato nel sorgente `forgotPasswordOperation`, non dalla sola documentazione.
 */
export const RESET_PASSWORD_TOKEN_EXPIRATION_MS = 3_600_000

/** Token di verifica email nativo Payload 3.89.0: nessun controllo di scadenza lato server. */
export function generateAuthEmailToken(): string {
  return crypto.randomBytes(20).toString('hex')
}

export function resetPasswordExpirationIso(now = Date.now()): string {
  return new Date(now + RESET_PASSWORD_TOKEN_EXPIRATION_MS).toISOString()
}
