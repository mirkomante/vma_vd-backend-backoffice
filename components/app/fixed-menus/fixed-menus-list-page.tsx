'use client'

import { Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import {
  createFixedMenuAction,
  deleteFixedMenuAction,
  listFixedMenusAction,
  loadFixedMenuDeleteImpactAction,
  loadFixedMenuFormAction,
  patchFixedMenuDisabledAction,
  updateFixedMenuAction,
} from '@/app/(app)/app/(shell)/menu/fixed-menus-actions'
import { CatalogListPage, type CatalogPageNotice } from '@/components/app/menu/catalog/catalog-list-page'
import { Button } from '@/components/ui/button'
import {
  firstInvalidFixedMenuField,
  validateFixedMenuForm,
  type FixedMenuFieldErrors,
} from '@/lib/app/fixedMenus/formModel'
import type { FixedMenusPageContext } from '@/lib/app/fixedMenus/loadFixedMenusPageContext'
import { emptyFixedMenuFormValues, type FixedMenuListRow } from '@/lib/app/fixedMenus/types'
import type { CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'
import { formatFixedMenuDeleteDescription } from '@/lib/menu/formatCascadeDeleteDescription'
import { MENU_FISSI_NEW_BUTTON, menuFissiDeleteConfirmTitle } from '@/lib/menu/fixed-menus/copy'
import { FixedMenuFormSheet } from './fixed-menu-form-sheet'
import { FixedMenusShell } from './fixed-menus-shell'
import { fixedMenusCatalogConfig } from './fixed-menus-catalog-config'

const LIST_FEATURES = {
  search: false,
  filters: false,
  typeGrouping: true,
  partialAlert: false,
  listCountWhenGrouped: true,
}

type FixedMenusListPageProps = {
  context: FixedMenusPageContext
}

export function FixedMenusListPage({ context }: FixedMenusListPageProps) {
  const [rows, setRows] = useState<FixedMenuListRow[]>([])
  const [groups, setGroups] = useState<CatalogTypeGroup<FixedMenuListRow>[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [listPage, setListPage] = useState(1)
  const [emptyDatabase, setEmptyDatabase] = useState(false)
  const [loading, setLoading] = useState(!context.loadError)
  const [loadError, setLoadError] = useState(context.loadError)
  const [notice, setNotice] = useState<CatalogPageNotice | null>(null)
  const [pendingRowId, setPendingRowId] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [formSessionKey, setFormSessionKey] = useState(0)
  const [formMode, setFormMode] = useState<'new' | 'edit'>('new')
  const [editMenuId, setEditMenuId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [formValues, setFormValues] = useState(emptyFixedMenuFormValues())
  const [formSaving, setFormSaving] = useState(false)
  const [formActionError, setFormActionError] = useState(false)
  const [formFieldErrors, setFormFieldErrors] = useState<FixedMenuFieldErrors>({})

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<FixedMenuListRow | null>(null)
  const [deleteDescription, setDeleteDescription] = useState('')
  const [deletePending, setDeletePending] = useState(false)
  const [deleteActionError, setDeleteActionError] = useState(false)

  const reload = useCallback(async (page: number, previous: readonly FixedMenuListRow[]) => {
    setLoading(true)
    setLoadError(false)
    const result = await listFixedMenusAction(page, previous)
    setLoading(false)
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
  }, [])

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
      await reload(1, [])
    })()
    return () => {
      cancelled = true
    }
  }, [context.loadError, reload])

  const openNewForm = () => {
    setNotice(null)
    setFormMode('new')
    setEditMenuId(null)
    setEditName('')
    setFormValues(emptyFixedMenuFormValues())
    setFormFieldErrors({})
    setFormActionError(false)
    setFormSessionKey((k) => k + 1)
    setFormOpen(true)
  }

  const handleSave = async (values: typeof formValues) => {
    const fieldErrors = validateFixedMenuForm(values)
    if (Object.keys(fieldErrors).length > 0) {
      setFormFieldErrors(fieldErrors)
      const first = firstInvalidFixedMenuField(fieldErrors)
      if (first) {
        const id =
          first === 'name'
            ? 'fixed-menu-field-name'
            : first === 'price'
              ? 'fixed-menu-field-price'
              : first === 'categoryId'
                ? 'fixed-menu-field-category'
                : 'fixed-menu-dishes-section'
        document.getElementById(id)?.focus()
      }
      return
    }
    setFormSaving(true)
    setFormActionError(false)
    const result =
      formMode === 'new'
        ? await createFixedMenuAction(values)
        : await updateFixedMenuAction(editMenuId!, values)
    setFormSaving(false)
    if (!result.ok) {
      if (result.error === 'validation' && result.fieldErrors) {
        setFormFieldErrors(result.fieldErrors)
      } else {
        setFormActionError(true)
      }
      return
    }
    setFormOpen(false)
    setNotice({ kind: formMode === 'new' ? 'savedNew' : 'saved' })
    void reload(1, [])
  }

  const newMenuButton = (
    <Button type="button" size="lg" className="w-full md:w-auto" onClick={openNewForm}>
      <Plus className="size-4" aria-hidden />
      {MENU_FISSI_NEW_BUTTON}
    </Button>
  )

  return (
    <FixedMenusShell
      activeTab="menus"
      tabAction={emptyDatabase && !loading && !loadError ? undefined : newMenuButton}
    >
      <CatalogListPage
        showPageHeader={false}
        config={fixedMenusCatalogConfig}
        features={LIST_FEATURES}
        groups={groups}
        totalDocs={totalDocs}
        hasMore={hasMore}
        emptyDatabase={emptyDatabase}
        loading={loading}
        loadError={loadError}
        searchValue=""
        onSearchChange={() => {}}
        activeFilterCount={0}
        filterChips={[]}
        onRemoveFilterChip={() => {}}
        onOpenFilters={() => {}}
        onShowMore={() => void reload(listPage + 1, rows)}
        onNew={openNewForm}
        onRetryLoad={() => void reload(1, [])}
        onClearFilters={() => {}}
        pendingRowId={pendingRowId}
        onToggleAvailable={async (row, checked) => {
          setNotice(null)
          setPendingRowId(String(row.id))
          const result = await patchFixedMenuDisabledAction(String(row.id), !checked)
          setPendingRowId(null)
          if (!result.ok) {
            setFormActionError(true)
            return
          }
          setNotice({ kind: checked ? 'enabled' : 'disabled' })
          void reload(listPage, rows)
        }}
        onEdit={async (row) => {
          setNotice(null)
          const loaded = await loadFixedMenuFormAction(String(row.id))
          if (!loaded.ok) {
            setFormActionError(true)
            return
          }
          setFormMode('edit')
          setEditMenuId(String(row.id))
          setEditName(row.name)
          setFormValues(loaded.values)
          setFormFieldErrors({})
          setFormActionError(false)
          setFormSessionKey((k) => k + 1)
          setFormOpen(true)
        }}
        onDeleteRequest={async (row) => {
          setDeleteTarget(row)
          setDeleteActionError(false)
          const impact = await loadFixedMenuDeleteImpactAction(String(row.id))
          if (!impact.ok) {
            setDeleteDescription('')
          } else {
            setDeleteDescription(formatFixedMenuDeleteDescription(impact.specialDayDates))
          }
          setDeleteOpen(true)
        }}
        notice={notice}
        deleteDialog={{
          open: deleteOpen,
          title: deleteTarget ? menuFissiDeleteConfirmTitle(deleteTarget.name) : '',
          description: deleteDescription,
          pending: deletePending,
          actionError: deleteActionError,
          onOpenChange: setDeleteOpen,
          onConfirm: async () => {
            if (!deleteTarget) return
            setDeletePending(true)
            const result = await deleteFixedMenuAction(String(deleteTarget.id))
            setDeletePending(false)
            if (!result.ok) {
              setDeleteActionError(true)
              return
            }
            setDeleteOpen(false)
            setNotice({ kind: 'deleted' })
            void reload(1, [])
          },
        }}
        filterSheet={null}
        formSheet={
          <FixedMenuFormSheet
            key={formSessionKey}
            open={formOpen}
            mode={formMode}
            editName={editName}
            initialValues={formValues}
            categories={context.categories}
            dishes={context.dishes}
            services={context.services}
            saving={formSaving}
            actionError={formActionError}
            fieldErrors={formFieldErrors}
            onOpenChange={setFormOpen}
            onSubmit={handleSave}
          />
        }
      />
    </FixedMenusShell>
  )
}
