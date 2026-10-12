/** Estrae l’ID da un valore relationship (ID scalare o documento popolato). */
export function relationshipId(value: unknown): number | string | null {
  if (value == null || value === '') {
    return null
  }
  if (typeof value === 'number' || typeof value === 'string') {
    return value
  }
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const id = Reflect.get(value, 'id')
    if (typeof id === 'number' || typeof id === 'string') {
      return id
    }
  }
  return null
}
