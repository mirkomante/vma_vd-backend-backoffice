/**
 * Esito controlli che richiedono misure numeriche (Menù / Piatti / catalogo).
 * OK solo se le misure sono state acquisite; «—» o assenza → NON PROVATO.
 */

const EMPTY_DASH = /^—$|^–$/

/**
 * @param {unknown} value
 */
export function isEmptyMeasureToken(value) {
  if (value == null) return true
  if (typeof value === 'number' && Number.isNaN(value)) return true
  const s = String(value).trim()
  if (!s) return true
  if (EMPTY_DASH.test(s)) return true
  if (s === '0x0' || s === '0×0') return true
  return false
}

/**
 * @param {string} misurato
 */
export function misuratoContainsEmptyMeasure(misurato) {
  const s = String(misurato ?? '')
  if (!s.trim()) return true
  if (EMPTY_DASH.test(s.trim())) return true
  if (/"root":"—"|"box":"—"|"btnSize":"—"|root=—|box=—/.test(s)) return true
  if (/:\s*—(\s|;|,|$)/.test(s)) return true
  return false
}

/**
 * @param {{ failures?: string[], misurato?: string, missingMeasures?: string[] }} opts
 * @returns {{ esito: 'OK' | 'FALLITO' | 'NON PROVATO', misurato: string }}
 */
export function esitoMisura({ failures = [], misurato = '', missingMeasures = [] }) {
  if (missingMeasures.length > 0) {
    return {
      esito: 'NON PROVATO',
      misurato: `misura non acquisita: ${missingMeasures.join('; ')}`,
    }
  }
  if (misuratoContainsEmptyMeasure(misurato)) {
    return {
      esito: 'NON PROVATO',
      misurato: 'misura attesa ma valore vuoto (— o assente)',
    }
  }
  if (failures.length > 0) {
    return { esito: 'FALLITO', misurato: failures.join('; ') }
  }
  return { esito: 'OK', misurato: String(misurato) }
}
