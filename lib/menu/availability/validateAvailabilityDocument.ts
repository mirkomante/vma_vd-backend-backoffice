import type { AvailabilityDocumentV1 } from './types'

const ITEM_STATUSES = new Set(['available', 'soldOut', 'hidden'])
const GROUP_KEYS = [
  'dishes',
  'wines',
  'drinks',
  'spirits',
  'fixedMenus',
  'services',
] as const

export type AvailabilityValidationResult =
  | { ok: true }
  | { ok: false; errors: string[] }

function isIsoUtc(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false
  }
  const parsed = Date.parse(value)
  return !Number.isNaN(parsed) && value.endsWith('Z')
}

function validateGroup(
  label: string,
  group: unknown,
  allowSoldOut: boolean,
  errors: string[],
): void {
  if (group === null || typeof group !== 'object' || Array.isArray(group)) {
    errors.push(`${label}: deve essere un oggetto.`)
    return
  }
  for (const [id, entry] of Object.entries(group as Record<string, unknown>)) {
    if (typeof id !== 'string' || id.length === 0) {
      errors.push(`${label}: chiave id non valida.`)
      continue
    }
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(`${label}[${id}]: voce non valida.`)
      continue
    }
    const status = (entry as { status?: unknown }).status
    if (typeof status !== 'string' || !ITEM_STATUSES.has(status)) {
      errors.push(`${label}[${id}]: status non valido.`)
      continue
    }
    if (!allowSoldOut && status === 'soldOut') {
      errors.push(`${label}[${id}]: soldOut non ammesso.`)
    }
  }
}

/** Validatore schema ADR-112 §3 per verify 6.4. */
export function validateAvailabilityDocument(doc: unknown): AvailabilityValidationResult {
  const errors: string[] = []

  if (doc === null || typeof doc !== 'object' || Array.isArray(doc)) {
    return { ok: false, errors: ['Radice: deve essere un oggetto.'] }
  }

  const root = doc as Record<string, unknown>

  if (root.schemaVersion !== 1) {
    errors.push('schemaVersion deve essere 1.')
  }
  if (!isIsoUtc(root.updatedAt)) {
    errors.push('updatedAt deve essere ISO 8601 UTC.')
  }

  for (const key of GROUP_KEYS) {
    validateGroup(key, root[key], key === 'dishes', errors)
  }

  if (root.globalMessage !== undefined) {
    const gm = root.globalMessage
    if (gm === null || typeof gm !== 'object' || Array.isArray(gm)) {
      errors.push('globalMessage deve essere un oggetto { it, en }.')
    } else {
      const g = gm as Record<string, unknown>
      if (typeof g.it !== 'string' || typeof g.en !== 'string') {
        errors.push('globalMessage.it e globalMessage.en devono essere stringhe.')
      }
    }
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors }
}

export function assertValidAvailabilityDocument(doc: AvailabilityDocumentV1): void {
  const result = validateAvailabilityDocument(doc)
  if (!result.ok) {
    throw new Error(`disponibilita.json non valido: ${result.errors.join(' ')}`)
  }
}
