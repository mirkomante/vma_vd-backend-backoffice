/**
 * Policy password di catalogo (baseline): minimo 8 caratteri, almeno una maiuscola,
 * una minuscola e una cifra. Payload valida nativamente solo la lunghezza minima di default (3)
 * sul campo auth — questa funzione applica la policy di progetto in hook dedicati.
 */

const MIN_LENGTH = 8

export function validatePasswordPolicy(password: string): string | true {
  if (password.length < MIN_LENGTH) {
    return `La password deve contenere almeno ${MIN_LENGTH} caratteri.`
  }

  if (!/[a-z]/.test(password)) {
    return 'La password deve contenere almeno una lettera minuscola.'
  }

  if (!/[A-Z]/.test(password)) {
    return 'La password deve contenere almeno una lettera maiuscola.'
  }

  if (!/[0-9]/.test(password)) {
    return 'La password deve contenere almeno una cifra.'
  }

  return true
}
