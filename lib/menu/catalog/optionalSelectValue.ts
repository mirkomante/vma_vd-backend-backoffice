/** Valore interno del Select per la voce che svuota il campo (non va mai persistito). */
export const OPTIONAL_SELECT_INTERNAL_VALUE = '__empty__'

/** Segnaposto legacy del paese bevande, normalizzato a stringa vuota in uscita. */
export const LEGACY_NO_COUNTRY_VALUE = '__no_country__'

const FORBIDDEN_PERSISTED = new Set([
  OPTIONAL_SELECT_INTERNAL_VALUE,
  LEGACY_NO_COUNTRY_VALUE,
])

/** Converte il valore emesso dal Select nella stringa da salvare ('' = nessuno). */
export function fromOptionalSelectValue(value: string | null | undefined): string {
  if (value == null || value === '' || FORBIDDEN_PERSISTED.has(value)) {
    return ''
  }
  return value
}

/** Mappa `items` (chiave '' = etichetta della voce vuota) per la prop `items` di Select.Root. */
export function optionalSelectItemsForRoot(items: Record<string, string>): Record<string, string> {
  const emptyLabel = items[''] ?? ''
  const root: Record<string, string> = {
    [OPTIONAL_SELECT_INTERNAL_VALUE]: emptyLabel,
  }
  for (const [key, label] of Object.entries(items)) {
    if (key !== '') {
      root[key] = label
    }
  }
  return root
}

export function assertNoOptionalSelectPlaceholders(value: string): void {
  if (FORBIDDEN_PERSISTED.has(value)) {
    throw new Error(`Valore non persistibile: ${value}`)
  }
}
