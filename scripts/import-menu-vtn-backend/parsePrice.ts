const REQUIRED_PRICE_RE = /^\d+([.,]\d+)?$/

export type ParsedRequiredPrice =
  | { ok: true; value: number }
  | { ok: false; reason: string; raw: string }

export type ParsedOptionalPrice =
  | { kind: 'omit' }
  | { kind: 'value'; value: number; raw: string }

function normalizeDecimalString(raw: string): string {
  return raw.trim().replace(',', '.')
}

/** Prezzo obbligatorio: solo cifre con punto o virgola decimale. */
export function parseRequiredPrice(raw: unknown, label: string): ParsedRequiredPrice {
  if (raw === null || raw === undefined) {
    return { ok: false, reason: `${label}: valore mancante`, raw: String(raw) }
  }
  const s = String(raw).trim()
  if (s.length === 0) {
    return { ok: false, reason: `${label}: stringa vuota`, raw: s }
  }
  if (!REQUIRED_PRICE_RE.test(s)) {
    return { ok: false, reason: `${label}: formato non numerico`, raw: s }
  }
  const value = Number.parseFloat(normalizeDecimalString(s))
  if (!Number.isFinite(value)) {
    return { ok: false, reason: `${label}: conversione fallita`, raw: s }
  }
  return { ok: true, value }
}

export function isNonPositiveNumericPrice(value: number): boolean {
  return value <= 0
}

/** `prezzoCalice` facoltativo: vuoto/null → omesso; ≤0 → avviso report, non importato. */
export function parseOptionalGlassPrice(raw: unknown): ParsedOptionalPrice {
  if (raw === null || raw === undefined) {
    return { kind: 'omit' }
  }
  const s = String(raw).trim()
  if (s.length === 0) {
    return { kind: 'omit' }
  }
  if (!REQUIRED_PRICE_RE.test(s)) {
    return { kind: 'omit' }
  }
  const value = Number.parseFloat(normalizeDecimalString(s))
  if (!Number.isFinite(value)) {
    return { kind: 'omit' }
  }
  return { kind: 'value', value, raw: s }
}

export function isInvalidOptionalGlassRaw(raw: unknown): boolean {
  if (raw === null || raw === undefined) {
    return false
  }
  const s = String(raw).trim()
  if (s.length === 0) {
    return false
  }
  if (!REQUIRED_PRICE_RE.test(s)) {
    return true
  }
  const value = Number.parseFloat(normalizeDecimalString(s))
  return !Number.isFinite(value)
}
