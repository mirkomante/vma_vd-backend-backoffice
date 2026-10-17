/** Denominazioni vino importabili (seed 6.1); Valdobbiadene non si crea né si accetta come zona. */
export const ALLOWED_APPELLATION_NAMES = new Set(['Carso', 'Collio', 'Franciacorta'])

/**
 * Nomi allergeni nello snapshot (`allergeni.json` / join piatti) → nomi seed 6.1 (normativi UE).
 * I nomi non presenti come chiave devono coincidere esattamente col seed.
 */
export const ALLERGEN_SNAPSHOT_TO_SEED: Readonly<Record<string, string>> = {
  Cereali: 'Cereali contenenti glutine',
  'Latte vaccino': 'Latte',
  Sesamo: 'Semi di sesamo',
  Solfiti: 'Anidride solforosa e solfiti',
}

export const CLASSIFICATION_NORMALIZE: Readonly<Record<string, string>> = {
  'D.O.C': 'D.O.C.',
  'A.O.P': 'A.O.P.',
}

export const KNOWN_MANUAL_REVIEW_WINE_NAMES = [
  'Cremant De Loire Blanc',
  'Chablis cuvée Hélène',
] as const

/** Refusi probabili nelle tassonomie: segnalati in report, non corretti in import. */
export const SUSPICIOUS_TAXONOMY_PATTERNS: ReadonlyArray<{ pattern: RegExp; hint: string }> = [
  { pattern: /vegeterian/i, hint: 'refuso probabile «vegetarian»' },
]

export const DEV_DB_HOST = '127.0.0.1'
export const DEV_DB_PORT = '5432'
export const DEV_DB_NAME = 'vma_vd_dev'
