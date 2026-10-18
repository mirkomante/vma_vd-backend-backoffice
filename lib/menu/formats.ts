/**
 * Forme canoniche e validazione server per campi testo del menù (ADR-108, D15).
 * Nessun import runtime da Payload: solo tipi locali per le funzioni `validate` dei campi.
 */

export const WINE_YEAR_ERROR_MESSAGE = (currentYear: number): string =>
  `L'anno deve avere quattro cifre, tra 1900 e ${currentYear}, oppure essere NV.`

export const WINE_VOLUME_ERROR_MESSAGE =
  'La capacità deve essere una tra: 25 cl, 33 cl, 37,5 cl, 50 cl, 75 cl, 150 cl.'

export const WINE_ABV_ERROR_MESSAGE =
  'Il grado deve andare da 5% a 20% a passi di 0,5 (per esempio 13% o 13,5%).'

export const SPIRIT_AGING_ERROR_MESSAGE =
  "L'invecchiamento deve essere uno tra: 5, 7, 10, 12, 14, 15, 16, 18, 21, 24 anni."

export const SPIRIT_ABV_ERROR_MESSAGE = 'Il grado deve essere un valore intero da 30% a 45%.'

export const DRINK_VOLUME_ERROR_MESSAGE =
  'La capacità deve essere una tra: 25 cl, 33 cl, 50 cl, 75 cl.'

export const DRINK_ABV_ERROR_MESSAGE =
  'Il grado deve essere un valore da 3% a 12%, a passi di 0,5 (per esempio 5% o 5,5%).'

export const WINE_VOLUME_CANONICAL = [
  '25 cl',
  '33 cl',
  '37,5 cl',
  '50 cl',
  '75 cl',
  '150 cl',
] as const

export const DRINK_VOLUME_CANONICAL = ['25 cl', '33 cl', '50 cl', '75 cl'] as const

/** Capacità distillati scritte dall'import (non validate in collection). */
export const SPIRIT_VOLUME_CANONICAL = ['50 cl', '75 cl'] as const

export const SPIRIT_AGING_CANONICAL = [
  '5 anni',
  '7 anni',
  '10 anni',
  '12 anni',
  '14 anni',
  '15 anni',
  '16 anni',
  '18 anni',
  '21 anni',
  '24 anni',
] as const

const SPIRIT_AGING_YEARS = new Set([5, 7, 10, 12, 14, 15, 16, 18, 21, 24])

const WINE_VOLUME_SET = new Set<string>(WINE_VOLUME_CANONICAL)
const DRINK_VOLUME_SET = new Set<string>(DRINK_VOLUME_CANONICAL)
const SPIRIT_VOLUME_SET = new Set<string>(SPIRIT_VOLUME_CANONICAL)
const SPIRIT_AGING_SET = new Set<string>(SPIRIT_AGING_CANONICAL)

function buildAbvCanonicalList(minPercent: number, maxPercent: number, step: number): string[] {
  const out: string[] = []
  for (let p = minPercent; p <= maxPercent + 1e-9; p += step) {
    const whole = Math.floor(p)
    if (Math.abs(p - whole) < 1e-9) {
      out.push(`${whole}%`)
    } else if (step === 0.5 && Math.abs(p - whole - 0.5) < 1e-9) {
      out.push(`${whole},5%`)
    } else {
      out.push(`${Math.round(p)}%`)
    }
  }
  return out
}

const WINE_ABV_SET = new Set(buildAbvCanonicalList(5, 20, 0.5))
const DRINK_ABV_SET = new Set(buildAbvCanonicalList(3, 12, 0.5))
const SPIRIT_ABV_SET = new Set(buildAbvCanonicalList(30, 45, 1))

export type NormalizeResult =
  | { ok: true; canonical?: string; raw: string | null }
  | { ok: false; raw: string; reason: string }

export type MenuFieldValidateOptions = {
  data?: Partial<Record<string, unknown>>
  operation?: 'create' | 'update' | 'delete' | 'read'
  previousValue?: unknown
}

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
}

function asTrimmedString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null
  }
  if (typeof value !== 'string') {
    return String(value).trim()
  }
  const s = value.trim()
  return s.length === 0 ? null : s
}

function fieldPresentInUpdateData(data: Partial<Record<string, unknown>> | undefined, fieldName: string): boolean {
  return data != null && Object.prototype.hasOwnProperty.call(data, fieldName)
}

function unchangedOnUpdate(
  value: unknown,
  options: MenuFieldValidateOptions,
  fieldName: string,
): boolean {
  if (options.operation !== 'update') {
    return false
  }
  if (!fieldPresentInUpdateData(options.data, fieldName)) {
    return true
  }
  const prev = options.previousValue
  if (prev === undefined && isBlank(value)) {
    return true
  }
  const a = asTrimmedString(value)
  const b = asTrimmedString(prev)
  if (a === null && b === null) {
    return true
  }
  if (a !== null && b !== null && a === b) {
    return true
  }
  return false
}

function makeMenuFormatFieldValidate(
  fieldName: string,
  isCanonical: (value: string) => boolean,
  message: string | ((currentYear: number) => string),
  currentYear = new Date().getFullYear(),
): (value: unknown, options: MenuFieldValidateOptions) => true | string {
  const resolvedMessage = typeof message === 'function' ? message(currentYear) : message
  return (value, options) => {
    if (unchangedOnUpdate(value, options, fieldName)) {
      return true
    }
    if (isBlank(value)) {
      return true
    }
    const s = typeof value === 'string' ? value : String(value)
    if (isCanonical(s)) {
      return true
    }
    return resolvedMessage
  }
}

/** Forma canonica esatta (validate server): nessun trim né normalizzazione. */
export function isCanonicalWineYear(value: string, currentYear = new Date().getFullYear()): boolean {
  if (value === 'NV') {
    return true
  }
  if (!/^\d{4}$/.test(value)) {
    return false
  }
  const year = Number.parseInt(value, 10)
  return year >= 1900 && year <= currentYear
}

export function prepWineYearForImport(raw: string): string {
  const s = raw.trim()
  if (/^nv$/i.test(s)) {
    return 'NV'
  }
  return s
}

export function normalizeWineYearForImport(raw: unknown, currentYear = new Date().getFullYear()): NormalizeResult {
  if (raw === null || raw === undefined) {
    return { ok: true, raw: null }
  }
  const trimmed = String(raw).trim()
  if (trimmed.length === 0) {
    return { ok: true, raw: null }
  }
  const prepped = prepWineYearForImport(trimmed)
  if (isCanonicalWineYear(prepped, currentYear)) {
    return { ok: true, canonical: prepped, raw: trimmed }
  }
  return { ok: false, raw: trimmed, reason: 'forma anno non riconosciuta' }
}

export function prepVolumeCl(raw: string): string | null {
  const s = raw.trim().replace(/\s+/g, ' ')
  const m = /^(\d+(?:[.,]\d+)?)\s*cl$/i.exec(s)
  if (!m) {
    return null
  }
  const num = m[1].replace('.', ',')
  return `${num} cl`
}

function normalizeVolumeAgainstSet(
  raw: unknown,
  allowed: ReadonlySet<string>,
): NormalizeResult {
  if (raw === null || raw === undefined) {
    return { ok: true, raw: null }
  }
  const trimmed = String(raw).trim()
  if (trimmed.length === 0) {
    return { ok: true, raw: null }
  }
  const prepped = prepVolumeCl(trimmed)
  if (prepped === null) {
    return { ok: false, raw: trimmed, reason: 'forma capacità non riconosciuta' }
  }
  if (!allowed.has(prepped)) {
    return { ok: false, raw: trimmed, reason: 'capacità fuori elenco' }
  }
  return { ok: true, canonical: prepped, raw: trimmed }
}

export function normalizeWineVolumeForImport(raw: unknown): NormalizeResult {
  return normalizeVolumeAgainstSet(raw, WINE_VOLUME_SET)
}

export function normalizeSpiritVolumeForImport(raw: unknown): NormalizeResult {
  return normalizeVolumeAgainstSet(raw, SPIRIT_VOLUME_SET)
}

export function normalizeDrinkVolumeForImport(raw: unknown): NormalizeResult {
  return normalizeVolumeAgainstSet(raw, DRINK_VOLUME_SET)
}

export function prepAbvPercent(raw: string): string | null {
  let s = raw.trim()
  if (s.length === 0) {
    return null
  }
  if (/%/i.test(s)) {
    s = s.replace(/%\s*vol\.?/gi, '%')
  }
  s = s.replace(/\s+/g, '')
  if (s.length === 0) {
    return null
  }
  if (!s.endsWith('%')) {
    s = `${s}%`
  }
  const m = /^(\d+)(?:[.,](\d))?%$/.exec(s)
  if (!m) {
    return null
  }
  if (m[2] !== undefined && m[2] !== '5') {
    return null
  }
  if (m[2] === '5') {
    return `${m[1]},5%`
  }
  return `${m[1]}%`
}

function normalizeAbvForImport(raw: unknown, allowed: ReadonlySet<string>): NormalizeResult {
  if (raw === null || raw === undefined) {
    return { ok: true, raw: null }
  }
  const trimmed = String(raw).trim()
  if (trimmed.length === 0) {
    return { ok: true, raw: null }
  }
  const prepped = prepAbvPercent(trimmed)
  if (prepped === null) {
    return { ok: false, raw: trimmed, reason: 'forma grado non riconosciuta' }
  }
  if (!allowed.has(prepped)) {
    return { ok: false, raw: trimmed, reason: 'grado fuori elenco' }
  }
  return { ok: true, canonical: prepped, raw: trimmed }
}

export function normalizeWineAbvForImport(raw: unknown): NormalizeResult {
  return normalizeAbvForImport(raw, WINE_ABV_SET)
}

export function normalizeSpiritAbvForImport(raw: unknown): NormalizeResult {
  return normalizeAbvForImport(raw, SPIRIT_ABV_SET)
}

export function normalizeDrinkAbvForImport(raw: unknown): NormalizeResult {
  return normalizeAbvForImport(raw, DRINK_ABV_SET)
}

export function prepSpiritAging(raw: string): string | null {
  const s = raw.trim().replace(/\s+/g, ' ')
  const m = /^(\d+)\s+anni$/i.exec(s)
  if (!m) {
    return null
  }
  const years = Number.parseInt(m[1], 10)
  if (!SPIRIT_AGING_YEARS.has(years)) {
    return null
  }
  return `${years} anni`
}

export function normalizeSpiritAgingForImport(raw: unknown): NormalizeResult {
  if (raw === null || raw === undefined) {
    return { ok: true, raw: null }
  }
  const trimmed = String(raw).trim()
  if (trimmed.length === 0) {
    return { ok: true, raw: null }
  }
  const prepped = prepSpiritAging(trimmed)
  if (prepped === null) {
    return { ok: false, raw: trimmed, reason: 'forma invecchiamento non riconosciuta' }
  }
  return { ok: true, canonical: prepped, raw: trimmed }
}

export const validateWineYearField = makeMenuFormatFieldValidate(
  'year',
  (v) => isCanonicalWineYear(v),
  WINE_YEAR_ERROR_MESSAGE,
)

export const validateWineVolumeField = makeMenuFormatFieldValidate(
  'volume',
  (v) => WINE_VOLUME_SET.has(v),
  WINE_VOLUME_ERROR_MESSAGE,
)

export const validateWineAbvField = makeMenuFormatFieldValidate(
  'abv',
  (v) => WINE_ABV_SET.has(v),
  WINE_ABV_ERROR_MESSAGE,
)

export const validateSpiritAbvField = makeMenuFormatFieldValidate(
  'abv',
  (v) => SPIRIT_ABV_SET.has(v),
  SPIRIT_ABV_ERROR_MESSAGE,
)

export const validateSpiritAgingField = makeMenuFormatFieldValidate(
  'aging',
  (v) => SPIRIT_AGING_SET.has(v),
  SPIRIT_AGING_ERROR_MESSAGE,
)

export const validateDrinkVolumeField = makeMenuFormatFieldValidate(
  'volume',
  (v) => DRINK_VOLUME_SET.has(v),
  DRINK_VOLUME_ERROR_MESSAGE,
)

export const validateDrinkAbvField = makeMenuFormatFieldValidate(
  'abv',
  (v) => DRINK_ABV_SET.has(v),
  DRINK_ABV_ERROR_MESSAGE,
)

/** Elenchi per select UI (nessuna modifica a validate/normalize). */
export const WINE_ABV_SELECT_OPTIONS = buildAbvCanonicalList(5, 20, 0.5)
export const DRINK_ABV_SELECT_OPTIONS = buildAbvCanonicalList(3, 12, 0.5)
export const SPIRIT_ABV_SELECT_OPTIONS = buildAbvCanonicalList(30, 45, 1)
export const SPIRIT_AGING_SELECT_OPTIONS = [...SPIRIT_AGING_CANONICAL]
export const DRINK_VOLUME_SELECT_OPTIONS = [...DRINK_VOLUME_CANONICAL]
