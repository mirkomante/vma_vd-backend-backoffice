/** Messaggio per campi testo obbligatori (validate al posto del solo `validation:required` generico). */
export function validateRequiredTextField(value: unknown, emptyMessage: string): true | string {
  if (value == null) {
    return emptyMessage
  }
  if (typeof value === 'string' && value.trim() === '') {
    return emptyMessage
  }
  return true
}
