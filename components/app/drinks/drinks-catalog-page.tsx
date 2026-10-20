'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  createDrinkAction,
  deleteDrinkAction,
  listDrinksAction,
  loadDrinkFormAction,
  patchDrinkDisabledAction,
  updateDrinkAction,
} from '@/app/(app)/app/(shell)/menu/drinks-actions'
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
import type { DrinksPageContext } from '@/lib/app/drinks/loadDrinksPageContext'
import {
  firstInvalidDrinkField,
  validateDrinkForm,
  DRINK_FIELD_DOM_IDS,
  type DrinkFieldErrors,
} from '@/lib/app/drinks/formModel'
import {
  EMPTY_DRINK_LIST_QUERY,
  emptyDrinkFormValues,
  type DrinkListQuery,
  type DrinkListRow,
} from '@/lib/app/drinks/types'
import type { CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'
import { catalogStatusFilterItems } from '@/lib/menu/catalog/disabledStatusFilter'
import { buildSelectItems, optionsFromTaxonomy } from '@/lib/menu/catalog/selectItems'
import {
  BEVANDE_DELETE_CONFIRM_TITLE,
  BEVANDE_FILTERS_ALL_COUNTRIES,
  BEVANDE_FILTERS_ALL_TYPES,
  BEVANDE_FILTERS_SHEET_DESCRIPTION,
  BEVANDE_FILTERS_SHEET_TITLE,
  BEVANDE_FILTER_STATE_ALL,
  BEVANDE_FILTER_STATE_DISABLED,
  BEVANDE_FILTER_STATE_ENABLED,
  BEVANDE_FORM_COUNTRY,
  BEVANDE_FORM_TYPE,
} from '@/lib/menu/drinks/copy'
import { drinksCatalogConfig } from './drinks-catalog-config'
import { DrinkFormSheet } from './drink-form-sheet'

type DrinksCatalogPageProps = {
  context: DrinksPageContext
}

export function DrinksCatalogPage({ context }: DrinksCatalogPageProps) {
  const [query, setQuery] = useState<DrinkListQuery>(EMPTY_DRINK_LIST_QUERY)
  const [draftQuery, setDraftQuery] = useState<DrinkListQuery>(EMPTY_DRINK_LIST_QUERY)
  const [rows, setRows] = useState<DrinkListRow[]>([])
  const [groups, setGroups] = useState<CatalogTypeGroup<DrinkListRow>[]>([])
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
  const [formSessionKey, setFormSessionKey] = useState(0)
  const [formMode, setFormMode] = useState<'new' | 'edit'>('new')
  const [editDrinkId, setEditDrinkId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [formValues, setFormValues] = useState(emptyDrinkFormValues())
  const [formCountries, setFormCountries] = useState(context.countries)
  const [formSaving, setFormSaving] = useState(false)
  const [formActionError, setFormActionError] = useState(false)
  const [formFieldErrors, setFormFieldErrors] = useState<DrinkFieldErrors>({})

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DrinkListRow | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const [deleteActionError, setDeleteActionError] = useState(false)

  const typeOrder = context.drinkTypes

  const filterTypeItems = useMemo(
    () => ({
      __all__: BEVANDE_FILTERS_ALL_TYPES,
      ...Object.fromEntries(context.drinkTypes.map((t) => [t.id, t.name])),
    }),
    [context.drinkTypes],
  )

  const countryFilterItems = useMemo(
    () => buildSelectItems(optionsFromTaxonomy(context.countries), draftQuery.countryId),
    [context.countries, draftQuery.countryId],
  )

  const filterStatusItems = useMemo(
    () =>
      catalogStatusFilterItems({
        all: BEVANDE_FILTER_STATE_ALL,
        enabled: BEVANDE_FILTER_STATE_ENABLED,
        disabled: BEVANDE_FILTER_STATE_DISABLED,
      }),
    [],
  )

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (query.typeId) n += 1
    if (query.status !== 'all') n += 1
    if (query.countryId) n += 1
    return n
  }, [query])

  const filterChips = useMemo(() => {
    const chips: { id: string; label: string }[] = []
    if (query.typeId) {
      const t = context.drinkTypes.find((x) => x.id === query.typeId)
      chips.push({ id: 'type', label: t?.name ?? query.typeId })
    }
    if (query.status === 'enabled') {
      chips.push({ id: 'status', label: BEVANDE_FILTER_STATE_ENABLED })
    }
    if (query.status === 'disabled') {
      chips.push({ id: 'status', label: BEVANDE_FILTER_STATE_DISABLED })
    }
    if (query.countryId) {
      const c = context.countries.find((x) => x.id === query.countryId)
      chips.push({ id: 'country', label: c?.name ?? query.countryId })
    }
    return chips
  }, [query, context.drinkTypes, context.countries])

  const reload = useCallback(
    async (q: DrinkListQuery, page: number, prevRows: DrinkListRow[]) => {
      setLoading(page === 1)
      setLoadError(false)
      const result = await listDrinksAction(q, page, prevRows, typeOrder)
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
    let cancelled = false
    void (async () => {
      await Promise.resolve()
      if (cancelled) {
        return
      }
      await reload(query, 1, [])
    })()
    return () => {
      cancelled = true
    }
  }, [context.loadError, query, reload])

  const removeChip = (id: string) => {
    setNotice(null)
    if (id === 'type') setQuery((q) => ({ ...q, typeId: '' }))
    if (id === 'status') setQuery((q) => ({ ...q, status: 'all' }))
    if (id === 'country') setQuery((q) => ({ ...q, countryId: '' }))
  }

  const focusInvalid = (errors: DrinkFieldErrors) => {
    const first = firstInvalidDrinkField(errors)
    if (!first) return
    document.getElementById(DRINK_FIELD_DOM_IDS[first])?.focus()
  }

  const handleFormSubmit = async (values: typeof formValues) => {
    const errors = validateDrinkForm(values)
    if (Object.keys(errors).length > 0) {
      setFormFieldErrors(errors)
      focusInvalid(errors)
      return
    }
    setFormSaving(true)
    setFormActionError(false)
    const result =
      formMode === 'new'
        ? await createDrinkAction(values)
        : await updateDrinkAction(editDrinkId ?? '', values)
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
      config={drinksCatalogConfig}
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
        setFormSessionKey((k) => k + 1)
        setFormMode('new')
        setEditDrinkId(null)
        setEditName('')
        setFormValues(emptyDrinkFormValues())
        setFormCountries(context.countries)
        setFormFieldErrors({})
        setFormActionError(false)
        setFormOpen(true)
      }}
      onRetryLoad={() => void reload(query, 1, [])}
      onClearFilters={() => setQuery(EMPTY_DRINK_LIST_QUERY)}
      pendingRowId={pendingRowId}
      onToggleAvailable={async (row, checked) => {
        setNotice(null)
        setPendingRowId(String(row.id))
        const result = await patchDrinkDisabledAction(String(row.id), !checked)
        setPendingRowId(null)
        if (!result.ok) {
          return
        }
        setNotice({ kind: checked ? 'enabled' : 'disabled' })
        void reload(query, 1, [])
      }}
      onEdit={async (row) => {
        setNotice(null)
        const loaded = await loadDrinkFormAction(String(row.id))
        if (!loaded.ok) {
          setFormActionError(true)
          setFormMode('edit')
          setEditDrinkId(String(row.id))
          setEditName(row.name)
          setFormValues(emptyDrinkFormValues())
          setFormCountries(context.countries)
          setFormSessionKey((k) => k + 1)
          setFormOpen(true)
          return
        }
        setFormMode('edit')
        setEditDrinkId(String(row.id))
        setEditName(row.name)
        setFormValues(loaded.values)
        setFormCountries(loaded.countries)
        setFormFieldErrors({})
        setFormActionError(false)
        setFormSessionKey((k) => k + 1)
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
        title: deleteTarget ? BEVANDE_DELETE_CONFIRM_TITLE(deleteTarget.name) : '',
        pending: deletePending,
        actionError: deleteActionError,
        onOpenChange: setDeleteOpen,
        onConfirm: async () => {
          if (!deleteTarget) return
          setDeletePending(true)
          const result = await deleteDrinkAction(String(deleteTarget.id))
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
          title={BEVANDE_FILTERS_SHEET_TITLE}
          description={BEVANDE_FILTERS_SHEET_DESCRIPTION}
          onApply={() => {
            setNotice(null)
            setQuery({ ...draftQuery, search: query.search })
            setFiltersOpen(false)
          }}
          onReset={() => {
            const next = { ...EMPTY_DRINK_LIST_QUERY, search: query.search }
            setDraftQuery(next)
            setQuery(next)
            setFiltersOpen(false)
          }}
        >
          <Field>
            <FieldLabel>{BEVANDE_FORM_TYPE}</FieldLabel>
            <Select
              items={filterTypeItems}
              value={draftQuery.typeId || undefined}
              onValueChange={(v) =>
                setDraftQuery((q) => ({ ...q, typeId: !v || v === '__all__' ? '' : v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={BEVANDE_FILTERS_ALL_TYPES} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{BEVANDE_FILTERS_ALL_TYPES}</SelectItem>
                {context.drinkTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>{BEVANDE_FORM_COUNTRY}</FieldLabel>
            <Select
              items={countryFilterItems}
              value={draftQuery.countryId || undefined}
              onValueChange={(v) =>
                setDraftQuery((q) => ({
                  ...q,
                  countryId: v === '__all__' ? '' : (v ?? ''),
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={BEVANDE_FILTERS_ALL_COUNTRIES} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{BEVANDE_FILTERS_ALL_COUNTRIES}</SelectItem>
                {context.countries.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Stato</FieldLabel>
            <Select
              items={filterStatusItems}
              value={draftQuery.status}
              onValueChange={(v) =>
                setDraftQuery((q) => ({
                  ...q,
                  status: (v ?? 'all') as DrinkListQuery['status'],
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{BEVANDE_FILTER_STATE_ALL}</SelectItem>
                <SelectItem value="enabled">{BEVANDE_FILTER_STATE_ENABLED}</SelectItem>
                <SelectItem value="disabled">{BEVANDE_FILTER_STATE_DISABLED}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </MenuFilterSheet>
      }
      formSheet={
        <DrinkFormSheet
          key={formSessionKey}
          open={formOpen}
          mode={formMode}
          editName={editName}
          initialValues={formValues}
          drinkTypes={context.drinkTypes}
          countries={formCountries}
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
