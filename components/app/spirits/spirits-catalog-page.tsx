'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  createSpiritAction,
  deleteSpiritAction,
  listSpiritsAction,
  loadSpiritFormAction,
  patchSpiritDisabledAction,
  updateSpiritAction,
} from '@/app/(app)/app/(shell)/menu/spirits-actions'
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
import type { SpiritsPageContext } from '@/lib/app/spirits/loadSpiritsPageContext'
import {
  firstInvalidSpiritField,
  validateSpiritForm,
  SPIRIT_FIELD_DOM_IDS,
  type SpiritFieldErrors,
} from '@/lib/app/spirits/formModel'
import {
  EMPTY_SPIRIT_LIST_QUERY,
  emptySpiritFormValues,
  type SpiritListQuery,
  type SpiritListRow,
} from '@/lib/app/spirits/types'
import type { CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'
import {
  DISTILLATI_DELETE_CONFIRM_TITLE,
  DISTILLATI_FILTERS_ALL_COUNTRIES,
  DISTILLATI_FILTERS_ALL_TYPES,
  DISTILLATI_FILTERS_SHEET_DESCRIPTION,
  DISTILLATI_FILTERS_SHEET_TITLE,
  DISTILLATI_FILTER_STATE_ALL,
  DISTILLATI_FILTER_STATE_DISABLED,
  DISTILLATI_FILTER_STATE_ENABLED,
  DISTILLATI_FORM_COUNTRY,
  DISTILLATI_FORM_TYPE,
} from '@/lib/menu/spirits/copy'
import { spiritsCatalogConfig } from './spirits-catalog-config'
import { SpiritFormSheet } from './spirit-form-sheet'

type SpiritsCatalogPageProps = {
  context: SpiritsPageContext
}

export function SpiritsCatalogPage({ context }: SpiritsCatalogPageProps) {
  const [query, setQuery] = useState<SpiritListQuery>(EMPTY_SPIRIT_LIST_QUERY)
  const [draftQuery, setDraftQuery] = useState<SpiritListQuery>(EMPTY_SPIRIT_LIST_QUERY)
  const [rows, setRows] = useState<SpiritListRow[]>([])
  const [groups, setGroups] = useState<CatalogTypeGroup<SpiritListRow>[]>([])
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
  const [editSpiritId, setEditSpiritId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [formValues, setFormValues] = useState(emptySpiritFormValues())
  const [formCountries, setFormCountries] = useState(context.countries)
  const [formSaving, setFormSaving] = useState(false)
  const [formActionError, setFormActionError] = useState(false)
  const [formFieldErrors, setFormFieldErrors] = useState<SpiritFieldErrors>({})

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<SpiritListRow | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const [deleteActionError, setDeleteActionError] = useState(false)

  const typeOrder = context.spiritTypes

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
      const t = context.spiritTypes.find((x) => x.id === query.typeId)
      chips.push({ id: 'type', label: t?.name ?? query.typeId })
    }
    if (query.status === 'enabled') {
      chips.push({ id: 'status', label: DISTILLATI_FILTER_STATE_ENABLED })
    }
    if (query.status === 'disabled') {
      chips.push({ id: 'status', label: DISTILLATI_FILTER_STATE_DISABLED })
    }
    if (query.countryId) {
      const c = context.countries.find((x) => x.id === query.countryId)
      chips.push({ id: 'country', label: c?.name ?? query.countryId })
    }
    return chips
  }, [query, context.spiritTypes, context.countries])

  const reload = useCallback(
    async (q: SpiritListQuery, page: number, prevRows: SpiritListRow[]) => {
      setLoading(page === 1)
      setLoadError(false)
      const result = await listSpiritsAction(q, page, prevRows, typeOrder)
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
    if (id === 'country') setQuery((q) => ({ ...q, countryId: '' }))
  }

  const focusInvalid = (errors: SpiritFieldErrors) => {
    const first = firstInvalidSpiritField(errors)
    if (!first) return
    document.getElementById(SPIRIT_FIELD_DOM_IDS[first])?.focus()
  }

  const handleFormSubmit = async (values: typeof formValues) => {
    const errors = validateSpiritForm(values)
    if (Object.keys(errors).length > 0) {
      setFormFieldErrors(errors)
      focusInvalid(errors)
      return
    }
    setFormSaving(true)
    setFormActionError(false)
    const result =
      formMode === 'new'
        ? await createSpiritAction(values)
        : await updateSpiritAction(editSpiritId ?? '', values)
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
      config={spiritsCatalogConfig}
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
        setEditSpiritId(null)
        setEditName('')
        setFormValues(emptySpiritFormValues())
        setFormCountries(context.countries)
        setFormFieldErrors({})
        setFormActionError(false)
        setFormOpen(true)
      }}
      onRetryLoad={() => void reload(query, 1, [])}
      onClearFilters={() => setQuery(EMPTY_SPIRIT_LIST_QUERY)}
      pendingRowId={pendingRowId}
      onToggleAvailable={async (row, checked) => {
        setNotice(null)
        setPendingRowId(String(row.id))
        const result = await patchSpiritDisabledAction(String(row.id), !checked)
        setPendingRowId(null)
        if (!result.ok) {
          return
        }
        setNotice({ kind: checked ? 'enabled' : 'disabled' })
        void reload(query, 1, [])
      }}
      onEdit={async (row) => {
        setNotice(null)
        const loaded = await loadSpiritFormAction(String(row.id))
        if (!loaded.ok) {
          setFormActionError(true)
          setFormMode('edit')
          setEditSpiritId(String(row.id))
          setEditName(row.name)
          setFormValues(emptySpiritFormValues())
          setFormCountries(context.countries)
          setFormOpen(true)
          return
        }
        setFormMode('edit')
        setEditSpiritId(String(row.id))
        setEditName(row.name)
        setFormValues(loaded.values)
        setFormCountries(loaded.countries)
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
        title: deleteTarget ? DISTILLATI_DELETE_CONFIRM_TITLE(deleteTarget.name) : '',
        pending: deletePending,
        actionError: deleteActionError,
        onOpenChange: setDeleteOpen,
        onConfirm: async () => {
          if (!deleteTarget) return
          setDeletePending(true)
          const result = await deleteSpiritAction(String(deleteTarget.id))
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
          title={DISTILLATI_FILTERS_SHEET_TITLE}
          description={DISTILLATI_FILTERS_SHEET_DESCRIPTION}
          onApply={() => {
            setNotice(null)
            setQuery({ ...draftQuery, search: query.search })
            setFiltersOpen(false)
          }}
          onReset={() => {
            const next = { ...EMPTY_SPIRIT_LIST_QUERY, search: query.search }
            setDraftQuery(next)
            setQuery(next)
            setFiltersOpen(false)
          }}
        >
          <Field>
            <FieldLabel>{DISTILLATI_FORM_TYPE}</FieldLabel>
            <Select
              value={draftQuery.typeId || undefined}
              onValueChange={(v) =>
                setDraftQuery((q) => ({ ...q, typeId: !v || v === '__all__' ? '' : v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={DISTILLATI_FILTERS_ALL_TYPES} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{DISTILLATI_FILTERS_ALL_TYPES}</SelectItem>
                {context.spiritTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>{DISTILLATI_FORM_COUNTRY}</FieldLabel>
            <Select
              value={draftQuery.countryId || undefined}
              onValueChange={(v) =>
                setDraftQuery((q) => ({
                  ...q,
                  countryId: v === '__all__' ? '' : (v ?? ''),
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={DISTILLATI_FILTERS_ALL_COUNTRIES} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{DISTILLATI_FILTERS_ALL_COUNTRIES}</SelectItem>
                {context.countries.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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
                  status: (v ?? 'all') as SpiritListQuery['status'],
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{DISTILLATI_FILTER_STATE_ALL}</SelectItem>
                <SelectItem value="enabled">{DISTILLATI_FILTER_STATE_ENABLED}</SelectItem>
                <SelectItem value="disabled">{DISTILLATI_FILTER_STATE_DISABLED}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </MenuFilterSheet>
      }
      formSheet={
        <SpiritFormSheet
          open={formOpen}
          mode={formMode}
          editName={editName}
          initialValues={formValues}
          spiritTypes={context.spiritTypes}
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
