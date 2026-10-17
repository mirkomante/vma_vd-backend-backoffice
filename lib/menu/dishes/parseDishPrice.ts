/** Accetta virgola o punto, al massimo due decimali. */
export function parseDishPriceInput(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) {
    return null
  }
  const normalized = trimmed.replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null
  }
  const value = Number.parseFloat(normalized)
  return Number.isFinite(value) ? value : null
}
