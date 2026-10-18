import type { ReactNode } from 'react'

import type { CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'

export type CatalogListTexts = {
  pageTitle: string
  pageDescription: string
  newButton: string
  searchPlaceholder: string
  filtersButton: string
  partialTitlePrefix: string
  partialDescription: string
  showMoreLabel: string
  loadErrorTitle: string
  loadErrorDescription: string
  loadRetry: string
  emptyTitle: string
  noResultsTitle: string
  clearFilters: string
  disabledBadge: string
  toggleLabel: string
  columnName: string
  columnActionsSr: string
  toastEnabled: string
  toastDisabled: string
  toastPublicMinutes: string
  toastSavedNew: string
  toastSaved: string
  rebuildHintSaved: string
  toastDeleted: string
  rebuildHintDeleted: string
  deleteBack: string
  deleteConfirm: string
  deleteIrreversible: string
  actionErrorTitle: string
  actionErrorDescription: string
  filterChipRemove: (label: string) => string
}

export type CatalogTableColumn = {
  id: string
  header: string
  headerClassName?: string
}

export type CatalogListRowBase = {
  id: number | string
  name: string
  disabled?: boolean | null
}

export type CatalogListConfig<TRow extends CatalogListRowBase> = {
  texts: CatalogListTexts
  tableColumns: CatalogTableColumn[]
  /** Colonna interruttore «Disponibile» in tabella (prima delle azioni). */
  showAvailabilityColumn?: boolean
  renderTableCells: (row: TRow) => ReactNode[]
  renderCardSecondary: (row: TRow) => ReactNode
  renderCardTertiary?: (row: TRow) => ReactNode
  tableRowAriaLabel: (row: TRow) => string
}

export type CatalogListGroups<TRow extends CatalogListRowBase> = CatalogTypeGroup<TRow>[]
