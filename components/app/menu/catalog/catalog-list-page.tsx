'use client'

import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'

import { MenuActiveFilterChips } from '@/components/app/menu/menu-active-filter-chips'
import { MenuDeleteDialog } from '@/components/app/menu/menu-delete-dialog'
import {
  MenuListEmptyState,
  MenuListErrorState,
  MenuListLoadingState,
} from '@/components/app/menu/menu-list-states'
import { MenuOutcomeAlert } from '@/components/app/menu/menu-outcome-alert'
import { MenuPageHeader } from '@/components/app/menu/menu-page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import type { CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'
import { CatalogPartialAlert } from './catalog-partial-alert'
import { CatalogTypeGroupBlock } from './catalog-type-group'
import {
  DEFAULT_CATALOG_LIST_FEATURES,
  type CatalogListConfig,
  type CatalogListFeatures,
  type CatalogListRowBase,
} from './catalog-list-config'

export type CatalogPageNotice =
  | { kind: 'enabled' }
  | { kind: 'disabled' }
  | { kind: 'savedNew' }
  | { kind: 'saved' }
  | { kind: 'deleted' }

type CatalogListPageProps<TRow extends CatalogListRowBase> = {
  config: CatalogListConfig<TRow>
  features?: CatalogListFeatures
  groups: CatalogTypeGroup<TRow>[]
  totalDocs: number
  hasMore: boolean
  emptyDatabase: boolean
  loading: boolean
  loadError: boolean
  showMorePending?: boolean
  searchValue: string
  onSearchChange: (value: string) => void
  activeFilterCount: number
  filterChips: { id: string; label: string }[]
  onRemoveFilterChip: (id: string) => void
  onOpenFilters: () => void
  onShowMore: () => void
  onNew: () => void
  onRetryLoad: () => void
  onClearFilters: () => void
  pendingRowId: string | null
  onToggleAvailable: (row: TRow, checked: boolean) => void
  onEdit: (row: TRow) => void
  onDeleteRequest: (row: TRow) => void
  notice: CatalogPageNotice | null
  deleteDialog: {
    open: boolean
    title: string
    description?: ReactNode
    pending: boolean
    actionError: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
  }
  filterSheet: ReactNode
  formSheet: ReactNode
}

export function CatalogListPage<TRow extends CatalogListRowBase>({
  config,
  features: featuresProp,
  groups,
  totalDocs,
  hasMore,
  emptyDatabase,
  loading,
  loadError,
  showMorePending,
  searchValue,
  onSearchChange,
  activeFilterCount,
  filterChips,
  onRemoveFilterChip,
  onOpenFilters,
  onShowMore,
  onNew,
  onRetryLoad,
  onClearFilters,
  pendingRowId,
  onToggleAvailable,
  onEdit,
  onDeleteRequest,
  notice,
  deleteDialog,
  filterSheet,
  formSheet,
}: CatalogListPageProps<TRow>) {
  const features = { ...DEFAULT_CATALOG_LIST_FEATURES, ...featuresProp }
  const { texts } = config
  const hasGroups = groups.some((g) => g.rows.length > 0)
  const noResults =
    !loading &&
    !loadError &&
    !emptyDatabase &&
    !hasGroups &&
    (features.search || features.filters)
  const listCountLabel =
    !features.typeGrouping && config.formatListCount && totalDocs > 0 && hasGroups
      ? config.formatListCount(totalDocs)
      : null

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <MenuPageHeader
        title={texts.pageTitle}
        description={texts.pageDescription}
        primaryAction={
          <Button type="button" size="lg" className="w-full md:w-auto" onClick={onNew}>
            <Plus className="size-4" aria-hidden />
            {texts.newButton}
          </Button>
        }
      />

      {notice ? (
        <>
          <MenuOutcomeAlert
            title={
              notice.kind === 'enabled'
                ? texts.toastEnabled
                : notice.kind === 'disabled'
                  ? texts.toastDisabled
                  : notice.kind === 'savedNew'
                    ? texts.toastSavedNew
                    : notice.kind === 'saved'
                      ? texts.toastSaved
                      : texts.toastDeleted
            }
            rebuildHint={
              notice.kind === 'savedNew' || notice.kind === 'saved'
                ? texts.rebuildHintSaved
                : notice.kind === 'deleted'
                  ? texts.rebuildHintDeleted
                  : undefined
            }
          />
          {notice.kind === 'disabled' || notice.kind === 'enabled' ? (
            <p className="text-sm text-muted-foreground" role="status">{texts.toastPublicMinutes}</p>
          ) : null}
        </>
      ) : null}

      {features.partialAlert && hasMore ? (
        <CatalogPartialAlert
          title={`${texts.partialTitlePrefix}${totalDocs}`}
          description={texts.partialDescription}
          showMoreLabel={texts.showMoreLabel}
          onShowMore={onShowMore}
          showMorePending={showMorePending}
        />
      ) : null}

      {features.search || features.filters ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {features.search ? (
              <div className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  placeholder={texts.searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            ) : null}
            {features.filters ? (
              <Button type="button" variant="outline" onClick={onOpenFilters}>
                <SlidersHorizontal className="size-4" aria-hidden />
                {texts.filtersButton}
                {activeFilterCount > 0 ? (
                  <Badge variant="default" className="ml-1">{activeFilterCount}</Badge>
                ) : null}
              </Button>
            ) : null}
          </div>
          {features.filters ? (
            <MenuActiveFilterChips filters={filterChips} onRemove={onRemoveFilterChip} />
          ) : null}
        </div>
      ) : null}

      {loadError ? (
        <MenuListErrorState
          title={texts.loadErrorTitle}
          description={texts.loadErrorDescription}
          retryLabel={texts.loadRetry}
          onRetry={onRetryLoad}
        />
      ) : loading ? (
        <MenuListLoadingState />
      ) : emptyDatabase ? (
        <MenuListEmptyState
          title={texts.emptyTitle}
          action={
            <Button type="button" size="lg" onClick={onNew}>{texts.newButton}</Button>
          }
        />
      ) : noResults ? (
        <MenuListEmptyState
          title={texts.noResultsTitle}
          action={
            <Button type="button" variant="outline" onClick={onClearFilters}>
              {texts.clearFilters}
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {listCountLabel ? (
            <p className="text-sm text-muted-foreground" role="status">{listCountLabel}</p>
          ) : null}
          {groups.map((group) =>
            group.rows.length > 0 ? (
              <CatalogTypeGroupBlock
                key={group.typeId}
                group={group}
                config={config}
                pendingRowId={pendingRowId}
                onToggleAvailable={onToggleAvailable}
                onEdit={onEdit}
                onDelete={onDeleteRequest}
              />
            ) : null,
          )}
        </div>
      )}

      {filterSheet}
      {formSheet}

      <MenuDeleteDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onOpenChange}
        title={deleteDialog.title}
        description={deleteDialog.description ?? texts.deleteIrreversible}
        cancelLabel={texts.deleteBack}
        confirmLabel={texts.deleteConfirm}
        pending={deleteDialog.pending}
        onConfirm={deleteDialog.onConfirm}
      />
    </div>
  )
}
