'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  createServiceAction,
  deleteServiceAction,
  listServicesAction,
  loadServiceDeleteImpactAction,
  loadServiceFormAction,
  patchServiceDisabledAction,
  updateServiceAction,
} from '@/app/(app)/app/(shell)/menu/services-actions'
import { CatalogListPage, type CatalogPageNotice } from '@/components/app/menu/catalog/catalog-list-page'
import type { ServicesPageContext } from '@/lib/app/services/loadServicesPageContext'
import {
  firstInvalidServiceField,
  validateServiceForm,
  type ServiceFieldErrors,
} from '@/lib/app/services/formModel'
import { emptyServiceFormValues, type ServiceListRow } from '@/lib/app/services/types'
import type { CatalogTypeGroup } from '@/lib/menu/catalog/groupByType'
import { formatServiceDeleteDescription } from '@/lib/menu/formatCascadeDeleteDescription'
import { serviziDeleteConfirmTitle } from '@/lib/menu/services/copy'
import { servicesCatalogConfig } from './services-catalog-config'
import { ServiceFormSheet } from './service-form-sheet'

const FLAT_CATALOG_FEATURES = {
  search: false,
  filters: false,
  typeGrouping: false,
  partialAlert: false,
}

type ServicesCatalogPageProps = {
  context: ServicesPageContext
}

export function ServicesCatalogPage({ context }: ServicesCatalogPageProps) {
  const [rows, setRows] = useState<ServiceListRow[]>([])
  const [groups, setGroups] = useState<CatalogTypeGroup<ServiceListRow>[]>([])
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
  const [editServiceId, setEditServiceId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [formValues, setFormValues] = useState(emptyServiceFormValues())
  const [formSaving, setFormSaving] = useState(false)
  const [formActionError, setFormActionError] = useState(false)
  const [formFieldErrors, setFormFieldErrors] = useState<ServiceFieldErrors>({})

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ServiceListRow | null>(null)
  const [deleteDescription, setDeleteDescription] = useState('')
  const [deletePending, setDeletePending] = useState(false)
  const [deleteActionError, setDeleteActionError] = useState(false)

  const reload = useCallback(async (page: number, previous: readonly ServiceListRow[]) => {
    setLoading(true)
    setLoadError(false)
    const result = await listServicesAction(page, previous)
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
    setEditServiceId(null)
    setEditName('')
    setFormValues(emptyServiceFormValues())
    setFormFieldErrors({})
    setFormActionError(false)
    setFormSessionKey((k) => k + 1)
    setFormOpen(true)
  }

  const handleSave = async (values: typeof formValues) => {
    const fieldErrors = validateServiceForm(values)
    if (Object.keys(fieldErrors).length > 0) {
      setFormFieldErrors(fieldErrors)
      const first = firstInvalidServiceField(fieldErrors)
      if (first) {
        document.getElementById(
          first === 'name' ? 'service-field-name' : 'service-field-price',
        )?.focus()
      }
      return
    }
    setFormSaving(true)
    setFormActionError(false)
    const result =
      formMode === 'new'
        ? await createServiceAction(values)
        : await updateServiceAction(editServiceId!, values)
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

  return (
    <CatalogListPage
      config={servicesCatalogConfig}
      features={FLAT_CATALOG_FEATURES}
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
      onShowMore={() => {}}
      onNew={openNewForm}
      onRetryLoad={() => void reload(1, [])}
      onClearFilters={() => {}}
      pendingRowId={pendingRowId}
      onToggleAvailable={async (row, checked) => {
        setNotice(null)
        setPendingRowId(String(row.id))
        const result = await patchServiceDisabledAction(String(row.id), !checked)
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
        const loaded = await loadServiceFormAction(String(row.id))
        if (!loaded.ok) {
          setFormActionError(true)
          return
        }
        setFormMode('edit')
        setEditServiceId(String(row.id))
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
        const impact = await loadServiceDeleteImpactAction(String(row.id))
        if (!impact.ok) {
          setDeleteDescription('')
        } else {
          setDeleteDescription(formatServiceDeleteDescription(impact.fixedMenuNames))
        }
        setDeleteOpen(true)
      }}
      notice={notice}
      deleteDialog={{
        open: deleteOpen,
        title: deleteTarget ? serviziDeleteConfirmTitle(deleteTarget.name) : '',
        description: deleteDescription,
        pending: deletePending,
        actionError: deleteActionError,
        onOpenChange: setDeleteOpen,
        onConfirm: async () => {
          if (!deleteTarget) return
          setDeletePending(true)
          const result = await deleteServiceAction(String(deleteTarget.id))
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
        <ServiceFormSheet
          key={formSessionKey}
          open={formOpen}
          mode={formMode}
          editName={editName}
          initialValues={formValues}
          saving={formSaving}
          actionError={formActionError}
          fieldErrors={formFieldErrors}
          onOpenChange={setFormOpen}
          onSubmit={handleSave}
        />
      }
    />
  )
}
