/** Indirizzo email normalizzato (trim, minuscolo) per mittenti e contatti staff (fase-7.3). */
export const EMAIL_ADDRESS_FORMAT_REGEX =
  /^[a-z0-9](?:[a-z0-9._+-]*[a-z0-9])?@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/

export function normalizeEmailAddress(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }
  return value.trim().toLowerCase()
}

export function isValidEmailAddress(value: string): boolean {
  return EMAIL_ADDRESS_FORMAT_REGEX.test(value)
}

export function validateEmailAddressField(value: unknown): true | string {
  if (value == null || value === '') {
    return 'Indirizzo email obbligatorio.'
  }
  const normalized = normalizeEmailAddress(value)
  if (!normalized) {
    return 'Indirizzo email obbligatorio.'
  }
  if (!isValidEmailAddress(normalized)) {
    return 'Indirizzo email non valido.'
  }
  return true
}

/** Hook `beforeValidate` su campi email: persiste la forma normalizzata. */
export function normalizeEmailAddressFieldHook(value: unknown): unknown {
  if (value == null || value === '') {
    return value
  }
  if (typeof value !== 'string') {
    return value
  }
  return normalizeEmailAddress(value)
}
