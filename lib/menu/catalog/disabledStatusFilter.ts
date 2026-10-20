export type CatalogDisabledFilter = 'all' | 'enabled' | 'disabled'

export type CatalogStatusFilterLabels = {
  all: string
  enabled: string
  disabled: string
}

/** Mappa valore → etichetta per Select «Stato» nei fogli filtri dei cataloghi. */
export function catalogStatusFilterItems(
  labels: CatalogStatusFilterLabels,
): Record<CatalogDisabledFilter, string> {
  return {
    all: labels.all,
    enabled: labels.enabled,
    disabled: labels.disabled,
  }
}

export function disabledFilterToWhere(
  status: CatalogDisabledFilter,
): { disabled?: { equals: boolean } } | null {
  if (status === 'enabled') {
    return { disabled: { equals: false } }
  }
  if (status === 'disabled') {
    return { disabled: { equals: true } }
  }
  return null
}
