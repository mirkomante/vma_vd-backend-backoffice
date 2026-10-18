'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  createWineAction,
  deleteWineAction,
  listWinesAction,
  loadWineFormAction,
  loadWineOriginOptionsAction,
  patchWineDisabledAction,
  updateWineAction,
} from '@/app/(app)/app/(shell)/menu/wines-actions'
import { CatalogListPage, type CatalogPageNotice } from '@/components/app/menu/catalog/catalog-list-page'
import { MenuFilterSheet } from '@/components/app/menu/menu-filter-sheet'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { WinesPageContext } from '@/lib/app/wines/loadWinesPageContext'
import {
  firstInvalidWineField,
  validateWineForm,
  WINE_FIELD_DOM_IDS,
  type WineFieldErrors,
} from '@/lib/app/wines/formModel'
import {
  EMPTY_WINE_LIST_QUERY,
  emptyWineFormValues,
  type WineListQuery,
  type WineListRow,
} from '@/lib/app/wines/types'
import type { CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'
import { buildSelectItems, optionsFromTaxonomy } from '@/lib/menu/catalog/selectItems'
import { clearWineFilterOriginLevel } from '@/lib/menu/wines/wineOriginCascade'
import {
  VINI_DELETE_CONFIRM_TITLE,
  VINI_FILTERS_ALL_APPELLATIONS,
  VINI_FILTERS_ALL_COUNTRIES,
  VINI_FILTERS_ALL_REGIONS,
  VINI_FILTERS_ALL_TYPES,
  VINI_FILTERS_APPLY,
  VINI_FILTERS_RESET,
  VINI_FILTERS_SHEET_DESCRIPTION,
  VINI_FILTERS_SHEET_TITLE,
  VINI_FILTER_STATE_ALL,
  VINI_FILTER_STATE_DISABLED,
  VINI_FILTER_STATE_ENABLED,
  VINI_FORM_APPELLATION,
  VINI_FORM_COUNTRY,
  VINI_FORM_REGION,
  VINI_FORM_TYPE,
} from '@/lib/menu/wines/copy'
import { winesCatalogConfig } from './wines-catalog-config'
import { WineFormSheet } from './wine-form-sheet'

type WinesCatalogPageProps = {
  context: WinesPageContext
}

export function WinesCatalogPage({ context }: WinesCatalogPageProps) {
  const [query, setQuery] = useState<WineListQuery>(EMPTY_WINE_LIST_QUERY)
  const [draftQuery, setDraftQuery] = useState<WineListQuery>(EMPTY_WINE_LIST_QUERY)
  const [rows, setRows] = useState<WineListRow[]>([])
  const [groups, setGroups] = useState<CatalogTypeGroup<WineListRow>[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [listPage, setListPage] = useState(1)
  const [emptyDatabase, setEmptyDatabase] = useState(false)
  const [loading, setLoading] = useState(!context.loadError)
  const [loadError, setLoadError] = useState(context.loadError)
  const [showMorePending, setShowMorePending] = useState(false)
  const [notice, setNotice] = useState<CatalogPageNotice | null>(null)
  const [pendingRowId, setPendingRowId] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'new' | 'edit'>('new')
  const [editWineId, setEditWineId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [formValues, setFormValues] = useState(emptyWineFormValues())
  const [formSaving, setFormSaving] = useState(false)
  const [formActionError, setFormActionError] = useState(false)
  const [formFieldErrors, setFormFieldErrors] = useState<WineFieldErrors>({})

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<WineListRow | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const [deleteActionError, setDeleteActionError] = useState(false)
  const [filterOriginOptions, setFilterOriginOptions] = useState<{
    regions: { id: string; name: string }[]
    appellations: { id: string; name: string }[]
  }>({ regions: [], appellations: [] })

  const typeOrder = context.wineTypes

  useEffect(() => {
    if (!filtersOpen) {
      return
    }
    let cancelled = false
    void loadWineOriginOptionsAction({
      countryId: draftQuery.countryId || undefined,
      regionId: draftQuery.regionId || undefined,
      savedRegionId: draftQuery.regionId,
      savedAppellationId: draftQuery.appellationId,
    }).then((opts) => {
      if (!cancelled) {
        setFilterOriginOptions({
          regions: opts.regions,
          appellations: opts.appellations,
        })
      }
    })
    return () => {
      cancelled = true
    }
  }, [filtersOpen, draftQuery.countryId, draftQuery.regionId, draftQuery.appellationId])

  const countryFilterItems = useMemo(
    () => buildSelectItems(optionsFromTaxonomy(context.countries), draftQuery.countryId),
    [context.countries, draftQuery.countryId],
  )

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (query.typeId) n += 1
    if (query.status !== 'all') n += 1
    if (query.countryId) n += 1
    if (query.regionId) n += 1
    if (query.appellationId) n += 1
    return n
  }, [query])

  const filterChips = useMemo(() => {
    const chips: { id: string; label: string }[] = []
    if (query.typeId) {
      const t = context.wineTypes.find((x) => x.id === query.typeId)
      chips.push({ id: 'type', label: t?.name ?? query.typeId })
    }
    if (query.status === 'enabled') chips.push({ id: 'status', label: VINI_FILTER_STATE_ENABLED })
    if (query.status === 'disabled') chips.push({ id: 'status', label: VINI_FILTER_STATE_DISABLED })
    if (query.countryId) {
      const c = context.countries.find((x) => x.id === query.countryId)
      chips.push({ id: 'country', label: c?.name ?? query.countryId })
    }
    if (query.regionId) chips.push({ id: 'region', label: query.regionId })
    if (query.appellationId) chips.push({ id: 'appellation', label: query.appellationId })
    return chips
  }, [query, context.wineTypes, context.countries])

  const reload = useCallback(
    async (q: WineListQuery, page: number, prevRows: WineListRow[]) => {
      setLoading(page === 1)
      setLoadError(false)
      const result = await listWinesAction(q, page, prevRows, typeOrder)
      setLoading(false)
      setShowMorePending(false)
      if (!result.ok) {
        setLoadError(true)
        return
      }
      setRows(result.rows)
      setGroups(result.groups)
      setTotalDocs(result.totalDocs)
      setHasMore(result.hasMore)
      setEmptyDatabase(result.emptyDatabase)
      setListPage(result.page)
    },
    [typeOrder],
  )

  useEffect(() => {
    if (context.loadError) {
      return
    }
    void reload(query, 1, [])
  }, [context.loadError, query, reload])

  const removeChip = (id: string) => {
    setNotice(null)
    if (id === 'type') setQuery((q) => ({ ...q, typeId: '' }))
    if (id === 'status') setQuery((q) => ({ ...q, status: 'all' }))
    if (id === 'country') {
      setQuery((q) => ({
        ...q,
        ...clearWineFilterOriginLevel(
          {
            countryId: q.countryId,
            regionId: q.regionId,
            appellationId: q.appellationId,
            classificationId: '',
          },
          'country',
        ),
      }))
    }
    if (id === 'region') {
      setQuery((q) => ({
        ...q,
        ...clearWineFilterOriginLevel(
          {
            countryId: q.countryId,
            regionId: q.regionId,
            appellationId: q.appellationId,
            classificationId: '',
          },
          'region',
        ),
      }))
    }
    if (id === 'appellation') {
      setQuery((q) => ({ ...q, appellationId: '' }))
    }
  }

  const focusInvalid = (errors: WineFieldErrors) => {
    const first = firstInvalidWineField(errors)
    if (!first) return
    document.getElementById(WINE_FIELD_DOM_IDS[first])?.focus()
  }

  const handleFormSubmit = async (values: typeof formValues) => {
    const errors = validateWineForm(values)
    if (Object.keys(errors).length > 0) {
      setFormFieldErrors(errors)
      focusInvalid(errors)
      return
    }
    setFormSaving(true)
    setFormActionError(false)
    const result =
      formMode === 'new'
        ? await createWineAction(values)
        : await updateWineAction(editWineId ?? '', values)
    setFormSaving(false)
    if (!result.ok) {
      if (result.error === 'validation' && result.fieldErrors) {
        setFormFieldErrors(result.fieldErrors)
        focusInvalid(result.fieldErrors)
        return
      }
      setFormActionError(true)
      return
    }
    setFormOpen(false)
    setNotice({ kind: formMode === 'new' ? 'savedNew' : 'saved' })
    void reload(query, 1, [])
  }

  return (
    <CatalogListPage
      config={winesCatalogConfig}
      groups={groups}
      totalDocs={totalDocs}
      hasMore={hasMore}
      emptyDatabase={emptyDatabase}
      loading={loading}
      loadError={loadError}
      showMorePending={showMorePending}
      searchValue={query.search}
      onSearchChange={(value) => {
        setNotice(null)
        setQuery((q) => ({ ...q, search: value }))
      }}
      activeFilterCount={activeFilterCount}
      filterChips={filterChips}
      onRemoveFilterChip={removeChip}
      onOpenFilters={() => {
        setDraftQuery(query)
        setFiltersOpen(true)
      }}
      onShowMore={() => {
        setShowMorePending(true)
        void reload(query, listPage + 1, rows)
      }}
      onNew={() => {
        setNotice(null)
        setFormMode('new')
        setEditWineId(null)
        setEditName('')
        setFormValues(emptyWineFormValues())
        setFormFieldErrors({})
        setFormActionError(false)
        setFormOpen(true)
      }}
      onRetryLoad={() => void reload(query, 1, [])}
      onClearFilters={() => {
        setQuery(EMPTY_WINE_LIST_QUERY)
      }}
      pendingRowId={pendingRowId}
      onToggleAvailable={async (row, checked) => {
        setNotice(null)
        setPendingRowId(String(row.id))
        const result = await patchWineDisabledAction(String(row.id), !checked)
        setPendingRowId(null)
        if (!result.ok) {
          return
        }
        setNotice({ kind: checked ? 'enabled' : 'disabled' })
        void reload(query, 1, [])
      }}
      onEdit={async (row) => {
        setNotice(null)
        const loaded = await loadWineFormAction(String(row.id))
        if (!loaded.ok) {
          setFormActionError(true)
          setFormMode('edit')
          setEditWineId(String(row.id))
          setEditName(row.name)
          setFormValues(emptyWineFormValues())
          setFormOpen(true)
          return
        }
        setFormMode('edit')
        setEditWineId(String(row.id))
        setEditName(row.name)
        setFormValues(loaded.values)
        setFormFieldErrors({})
        setFormActionError(false)
        setFormOpen(true)
      }}
      onDeleteRequest={(row) => {
        setDeleteTarget(row)
        setDeleteActionError(false)
        setDeleteOpen(true)
      }}
      notice={notice}
      deleteDialog={{
        open: deleteOpen,
        title: deleteTarget ? VINI_DELETE_CONFIRM_TITLE(deleteTarget.name) : '',
        pending: deletePending,
        actionError: deleteActionError,
        onOpenChange: setDeleteOpen,
        onConfirm: async () => {
          if (!deleteTarget) return
          setDeletePending(true)
          const result = await deleteWineAction(String(deleteTarget.id))
          setDeletePending(false)
          if (!result.ok) {
            setDeleteActionError(true)
            return
          }
          setDeleteOpen(false)
          setNotice({ kind: 'deleted' })
          void reload(query, 1, [])
        },
      }}
      filterSheet={
        <MenuFilterSheet
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          title={VINI_FILTERS_SHEET_TITLE}
          description={VINI_FILTERS_SHEET_DESCRIPTION}
          onApply={() => {
            setNotice(null)
            setQuery({ ...draftQuery, search: query.search })
            setFiltersOpen(false)
          }}
          onReset={() => {
            const next = { ...EMPTY_WINE_LIST_QUERY, search: query.search }
            setDraftQuery(next)
            setQuery(next)
            setFiltersOpen(false)
          }}
        >
          <Field>
            <FieldLabel>{VINI_FORM_TYPE}</FieldLabel>
            <Select
              items={Object.fromEntries(
                context.wineTypes.map((t) => [t.id, t.name]),
              )}
              value={draftQuery.typeId || undefined}
              onValueChange={(v) =>
                setDraftQuery((q) => ({ ...q, typeId: !v || v === '__all__' ? '' : v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={VINI_FILTERS_ALL_TYPES} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{VINI_FILTERS_ALL_TYPES}</SelectItem>
                {context.wineTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>{VINI_FORM_COUNTRY}</FieldLabel>
            <Select
              items={countryFilterItems}
              value={draftQuery.countryId || undefined}
              onValueChange={(v) => {
                const countryId = v === '__all__' ? '' : (v ?? '')
                setDraftQuery((q) => ({
                  ...q,
                  countryId,
                  regionId: '',
                  appellationId: '',
                }))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={VINI_FILTERS_ALL_COUNTRIES} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{VINI_FILTERS_ALL_COUNTRIES}</SelectItem>
                {context.countries.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>{VINI_FORM_REGION}</FieldLabel>
            <Select
              value={draftQuery.regionId || undefined}
              disabled={!draftQuery.countryId}
              onValueChange={(v) =>
                setDraftQuery((q) => ({
                  ...q,
                  regionId: v === '__all__' ? '' : (v ?? ''),
                  appellationId: '',
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={VINI_FILTERS_ALL_REGIONS} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{VINI_FILTERS_ALL_REGIONS}</SelectItem>
                {filterOriginOptions.regions.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>{VINI_FORM_APPELLATION}</FieldLabel>
            <Select
              value={draftQuery.appellationId || undefined}
              disabled={!draftQuery.regionId}
              onValueChange={(v) =>
                setDraftQuery((q) => ({
                  ...q,
                  appellationId: v === '__all__' ? '' : (v ?? ''),
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={VINI_FILTERS_ALL_APPELLATIONS} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{VINI_FILTERS_ALL_APPELLATIONS}</SelectItem>
                {filterOriginOptions.appellations.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Stato</FieldLabel>
            <Select
              value={draftQuery.status}
              onValueChange={(v) =>
                setDraftQuery((q) => ({
                  ...q,
                  status: (v ?? 'all') as WineListQuery['status'],
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{VINI_FILTER_STATE_ALL}</SelectItem>
                <SelectItem value="enabled">{VINI_FILTER_STATE_ENABLED}</SelectItem>
                <SelectItem value="disabled">{VINI_FILTER_STATE_DISABLED}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </MenuFilterSheet>
      }
      formSheet={
        <WineFormSheet
          open={formOpen}
          mode={formMode}
          editName={editName}
          initialValues={formValues}
          wineTypes={context.wineTypes}
          saving={formSaving}
          actionError={formActionError}
          fieldErrors={formFieldErrors}
          onOpenChange={setFormOpen}
          onSubmit={handleFormSubmit}
        />
      }
    />
  )
}
