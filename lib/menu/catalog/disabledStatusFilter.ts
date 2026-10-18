export type CatalogDisabledFilter = 'all' | 'enabled' | 'disabled'

export type CatalogStatusFilterLabels = {
  all: string
  enabled: string
  disabled: string
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
