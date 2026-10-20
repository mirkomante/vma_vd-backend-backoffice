'use client'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import {
  createSpecialDayAction,
  deleteSpecialDayAction,
  listSpecialDaysAction,
  loadSpecialDayFormAction,
  patchSpecialDayDisabledAction,
  updateSpecialDayAction,
} from '@/app/(app)/app/(shell)/menu/special-days-actions'
import { MenuDeleteDialog } from '@/components/app/menu/menu-delete-dialog'
import {
  MenuListEmptyState,
  MenuListErrorState,
  MenuListLoadingState,
} from '@/components/app/menu/menu-list-states'
import { MenuOutcomeAlert } from '@/components/app/menu/menu-outcome-alert'
import { MenuPageHeader } from '@/components/app/menu/menu-page-header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import { anticipateSpecialDayOverlap } from '@/lib/menu/specialDays/anticipateSpecialDayOverlap'
import type { SpecialDayScope } from '@/lib/menu/validateSpecialDayOverlap'
import {
  firstInvalidSpecialDayField,
  SPECIAL_DAY_FIELD_DOM_IDS,
  validateSpecialDayForm,
  type SpecialDayFieldErrors,
} from '@/lib/app/specialDays/formModel'
import type { SpecialDaysPageContext } from '@/lib/app/specialDays/loadSpecialDaysPageContext'
import {
  emptySpecialDayFormValues,
  type SpecialDayListRow,
} from '@/lib/app/specialDays/types'
import {
  SPECIAL_DAYS_BADGE_DISABLED,
  SPECIAL_DAYS_COL_ACTIONS_SR,
  SPECIAL_DAYS_COL_ACTIVE,
  SPECIAL_DAYS_COL_DATE,
  SPECIAL_DAYS_COL_MENUS,
  SPECIAL_DAYS_COL_SCOPE,
  SPECIAL_DAYS_EMPTY,
  SPECIAL_DAYS_GROUP_PAST,
  SPECIAL_DAYS_GROUP_UPCOMING,
  SPECIAL_DAYS_LABEL_TODAY,
  SPECIAL_DAYS_LOAD_ERROR_DESCRIPTION,
  SPECIAL_DAYS_LOAD_ERROR_TITLE,
  SPECIAL_DAYS_LOAD_RETRY,
  SPECIAL_DAYS_ACTION_ERROR_DESCRIPTION,
  SPECIAL_DAYS_ACTION_ERROR_TITLE,
  SPECIAL_DAYS_NEW_BUTTON,
  SPECIAL_DAYS_NO_UPCOMING,
  SPECIAL_DAYS_PAGE_DESCRIPTION,
  SPECIAL_DAYS_PAGE_TITLE,
  SPECIAL_DAYS_ROW_ACTIVE_LABEL,
  SPECIAL_DAYS_TOAST_ADDED,
  SPECIAL_DAYS_TOAST_DELETED,
  SPECIAL_DAYS_TOAST_DELETED_REBUILD_HINT,
  SPECIAL_DAYS_TOAST_DISABLED,
  SPECIAL_DAYS_TOAST_ENABLED,
  SPECIAL_DAYS_TOAST_REBUILD_HINT,
  SPECIAL_DAYS_TOAST_SAVED,
  specialDayActiveAriaLabel,
  specialDayDeleteAriaLabel,
  specialDayDeleteDescription,
  specialDayDeleteTitle,
  specialDayEditAriaLabel,
  specialDayMessageRowPrefix,
  specialDayRowSubtitle,
  specialDayScopeLabel,
  specialDaysGroupCountLabel,
} from '@/lib/menu/specialDays/copy'
import { formatSpecialDayListDate as formatListDate } from '@/lib/menu/specialDays/formatSpecialDayListDate'

import { SpecialDayFormSheet } from './special-day-form-sheet'

type PageNotice =
  | { kind: 'enabled' }
  | { kind: 'disabled' }
  | { kind: 'savedNew' }
  | { kind: 'saved' }
  | { kind: 'deleted' }

type SpecialDaysPageProps = {
  context: SpecialDaysPageContext
}

function SpecialDayGroup({
  title,
  count,
  rows,
  isMobile,
  pendingRowId,
  onToggle,
  onEdit,
  onDelete,
}: {
  title: string
  count: number
  rows: SpecialDayListRow[]
  isMobile: boolean
  pendingRowId: string | null
  onToggle: (row: SpecialDayListRow, active: boolean) => void
  onEdit: (row: SpecialDayListRow) => void
  onDelete: (row: SpecialDayListRow) => void
}) {
  if (rows.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-2" data-block={title === SPECIAL_DAYS_GROUP_UPCOMING ? 'gruppo-prossimi' : 'gruppo-passati'}>
      <h2 className="text-base font-semibold">
        {title} <span className="font-normal text-muted-foreground">{specialDaysGroupCountLabel(count)}</span>
      </h2>
      {!isMobile ? (
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">{SPECIAL_DAYS_COL_DATE}</TableHead>
              <TableHead className="w-36">{SPECIAL_DAYS_COL_SCOPE}</TableHead>
              <TableHead>{SPECIAL_DAYS_COL_MENUS}</TableHead>
              <TableHead className="w-28">{SPECIAL_DAYS_COL_ACTIVE}</TableHead>
              <TableHead className="w-24">
                <span className="sr-only">{SPECIAL_DAYS_COL_ACTIONS_SR}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className={row.disabled ? 'opacity-50' : undefined}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{formatListDate(row.date)}</span>
                      {row.isToday ? <Badge variant="outline">{SPECIAL_DAYS_LABEL_TODAY}</Badge> : null}
                      {row.disabled ? <Badge variant="outline">{SPECIAL_DAYS_BADGE_DISABLED}</Badge> : null}
                    </div>
                    {row.messageIt ? (
                      <span className="text-sm text-muted-foreground">
                        {specialDayMessageRowPrefix(row.messageIt)}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>{specialDayScopeLabel(row.scope)}</TableCell>
                <TableCell className="truncate">{row.menuNames}</TableCell>
                <TableCell>
                  <Switch
                    checked={!row.disabled}
                    disabled={pendingRowId === row.id}
                    onCheckedChange={(checked) => onToggle(row, checked)}
                    aria-label={specialDayActiveAriaLabel(row.date, row.scope)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-0">
                    <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(row)} aria-label={specialDayEditAriaLabel(row.date)}>
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => onDelete(row)} aria-label={specialDayDeleteAriaLabel(row.date)}>
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <Card key={row.id} size="sm" className={row.disabled ? 'opacity-50' : undefined}>
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{formatListDate(row.date)}</span>
                    {row.isToday ? <Badge variant="outline">{SPECIAL_DAYS_LABEL_TODAY}</Badge> : null}
                    {row.disabled ? <Badge variant="outline">{SPECIAL_DAYS_BADGE_DISABLED}</Badge> : null}
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {specialDayRowSubtitle(row.scope, row.menuNames)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <Switch
                    checked={!row.disabled}
                    disabled={pendingRowId === row.id}
                    onCheckedChange={(checked) => onToggle(row, checked)}
                    aria-label={specialDayActiveAriaLabel(row.date, row.scope)}
                  />
                  <span className="text-xs text-muted-foreground">{SPECIAL_DAYS_ROW_ACTIVE_LABEL}</span>
                  <div className="flex items-center">
                    <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(row)} aria-label={specialDayEditAriaLabel(row.date)}>
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => onDelete(row)} aria-label={specialDayDeleteAriaLabel(row.date)}>
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}

export function SpecialDaysPage({ context }: SpecialDaysPageProps) {
  const isMobile = useIsMobile()
  const [upcoming, setUpcoming] = useState<SpecialDayListRow[]>([])
  const [past, setPast] = useState<SpecialDayListRow[]>([])
  const [allDays, setAllDays] = useState<SpecialDayListRow[]>([])
  const [loading, setLoading] = useState(!context.loadError)
  const [loadError, setLoadError] = useState(context.loadError)
  const [notice, setNotice] = useState<PageNotice | null>(null)
  const [pendingRowId, setPendingRowId] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [formSessionKey, setFormSessionKey] = useState(0)
  const [formMode, setFormMode] = useState<'new' | 'edit'>('new')
  const [editId, setEditId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState(emptySpecialDayFormValues())
  const [formSaving, setFormSaving] = useState(false)
  const [formActionError, setFormActionError] = useState(false)
  const [formFieldErrors, setFormFieldErrors] = useState<SpecialDayFieldErrors>({})

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<SpecialDayListRow | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const [deleteActionError, setDeleteActionError] = useState(false)

  const reload = useCallback(async () => {
    setLoading(true)
    setLoadError(false)
    const result = await listSpecialDaysAction()
    setLoading(false)
    if (!result.ok) {
      setLoadError(true)
      return
    }
    setUpcoming(result.upcoming)
    setPast(result.past)
    setAllDays(result.allDays)
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
      await reload()
    })()
    return () => {
      cancelled = true
    }
  }, [context.loadError, reload])

  const openNew = () => {
    setNotice(null)
    setFormMode('new')
    setEditId(null)
    setFormValues(emptySpecialDayFormValues())
    setFormFieldErrors({})
    setFormActionError(false)
    setFormSessionKey((k) => k + 1)
    setFormOpen(true)
  }

  const handleSave = async (values: typeof formValues) => {
    const overlap = anticipateSpecialDayOverlap(
      allDays.map((d) => ({
        id: d.id,
        date: d.date,
        scope: d.scope,
        disabled: d.disabled,
      })),
      {
        id: editId ?? undefined,
        date: values.dateInput,
        scope: values.scope as SpecialDayScope,
        disabled: values.disabled,
      },
    )
    const fieldErrors = validateSpecialDayForm(values, overlap)
    if (Object.keys(fieldErrors).length > 0) {
      setFormFieldErrors(fieldErrors)
      const first = firstInvalidSpecialDayField(fieldErrors)
      if (first === 'dateInput') {
        document.getElementById(SPECIAL_DAY_FIELD_DOM_IDS.dateInput)?.focus()
      } else if (first === 'scope' || first === 'overlap') {
        document.getElementById(SPECIAL_DAY_FIELD_DOM_IDS.scope)?.focus()
      } else if (first === 'fixedMenuIds') {
        const el = document.getElementById(SPECIAL_DAY_FIELD_DOM_IDS.firstFixedMenu)
        el?.scrollIntoView({ block: 'nearest' })
        el?.focus()
      }
      return
    }

    setFormSaving(true)
    setFormActionError(false)
    const result =
      formMode === 'new'
        ? await createSpecialDayAction(values)
        : await updateSpecialDayAction(editId!, values)
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
    void reload()
  }

  const emptyAll = !loading && !loadError && upcoming.length === 0 && past.length === 0

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-8">
      <MenuPageHeader
        title={SPECIAL_DAYS_PAGE_TITLE}
        description={SPECIAL_DAYS_PAGE_DESCRIPTION}
        primaryAction={
          <Button type="button" size="lg" className="w-full md:w-auto" onClick={openNew}>
            <Plus className="size-4" aria-hidden />
            {SPECIAL_DAYS_NEW_BUTTON}
          </Button>
        }
      />

      {notice?.kind === 'enabled' || notice?.kind === 'disabled' ? (
        <MenuOutcomeAlert
          title={notice.kind === 'enabled' ? SPECIAL_DAYS_TOAST_ENABLED : SPECIAL_DAYS_TOAST_DISABLED}
          rebuildHint={SPECIAL_DAYS_TOAST_REBUILD_HINT}
        />
      ) : null}
      {notice?.kind === 'savedNew' || notice?.kind === 'saved' ? (
        <MenuOutcomeAlert
          title={notice.kind === 'savedNew' ? SPECIAL_DAYS_TOAST_ADDED : SPECIAL_DAYS_TOAST_SAVED}
          rebuildHint={SPECIAL_DAYS_TOAST_REBUILD_HINT}
        />
      ) : null}
      {notice?.kind === 'deleted' ? (
        <MenuOutcomeAlert
          title={SPECIAL_DAYS_TOAST_DELETED}
          rebuildHint={SPECIAL_DAYS_TOAST_DELETED_REBUILD_HINT}
        />
      ) : null}

      {loading ? <MenuListLoadingState /> : null}
      {loadError ? (
        <MenuListErrorState
          title={SPECIAL_DAYS_LOAD_ERROR_TITLE}
          description={SPECIAL_DAYS_LOAD_ERROR_DESCRIPTION}
          retryLabel={SPECIAL_DAYS_LOAD_RETRY}
          onRetry={() => void reload()}
        />
      ) : null}

      {!loading && !loadError ? (
        <>
          {upcoming.length === 0 && past.length > 0 ? (
            <p className="text-sm text-muted-foreground">{SPECIAL_DAYS_NO_UPCOMING}</p>
          ) : null}
          <SpecialDayGroup
            title={SPECIAL_DAYS_GROUP_UPCOMING}
            count={upcoming.length}
            rows={upcoming}
            isMobile={isMobile}
            pendingRowId={pendingRowId}
            onToggle={async (row, active) => {
              setNotice(null)
              setPendingRowId(row.id)
              const result = await patchSpecialDayDisabledAction(row.id, !active)
              setPendingRowId(null)
              if (!result.ok) {
                setFormActionError(true)
                return
              }
              setNotice({ kind: active ? 'enabled' : 'disabled' })
              void reload()
            }}
            onEdit={async (row) => {
              setNotice(null)
              const loaded = await loadSpecialDayFormAction(row.id)
              if (!loaded.ok) {
                setFormActionError(true)
                return
              }
              setFormMode('edit')
              setEditId(row.id)
              setFormValues(loaded.values)
              setFormFieldErrors({})
              setFormActionError(false)
              setFormSessionKey((k) => k + 1)
              setFormOpen(true)
            }}
            onDelete={(row) => {
              setDeleteTarget(row)
              setDeleteActionError(false)
              setDeleteOpen(true)
            }}
          />
          <SpecialDayGroup
            title={SPECIAL_DAYS_GROUP_PAST}
            count={past.length}
            rows={past}
            isMobile={isMobile}
            pendingRowId={pendingRowId}
            onToggle={async (row, active) => {
              setNotice(null)
              setPendingRowId(row.id)
              const result = await patchSpecialDayDisabledAction(row.id, !active)
              setPendingRowId(null)
              if (!result.ok) {
                setFormActionError(true)
                return
              }
              setNotice({ kind: active ? 'enabled' : 'disabled' })
              void reload()
            }}
            onEdit={async (row) => {
              setNotice(null)
              const loaded = await loadSpecialDayFormAction(row.id)
              if (!loaded.ok) {
                setFormActionError(true)
                return
              }
              setFormMode('edit')
              setEditId(row.id)
              setFormValues(loaded.values)
              setFormFieldErrors({})
              setFormActionError(false)
              setFormSessionKey((k) => k + 1)
              setFormOpen(true)
            }}
            onDelete={(row) => {
              setDeleteTarget(row)
              setDeleteActionError(false)
              setDeleteOpen(true)
            }}
          />
          {emptyAll ? (
            <MenuListEmptyState
              title={SPECIAL_DAYS_EMPTY}
              action={
                <Button type="button" size="lg" onClick={openNew}>
                  {SPECIAL_DAYS_NEW_BUTTON}
                </Button>
              }
            />
          ) : null}
        </>
      ) : null}

      <SpecialDayFormSheet
        key={formSessionKey}
        open={formOpen}
        mode={formMode}
        editDateLabel={formMode === 'edit' ? formValues.dateInput : undefined}
        initialValues={formValues}
        fixedMenuOptions={context.fixedMenuOptions}
        saving={formSaving}
        actionError={formActionError}
        fieldErrors={formFieldErrors}
        existingDays={allDays.map((d) => ({
          id: d.id,
          date: d.date,
          scope: d.scope,
          disabled: d.disabled,
        }))}
        editingId={editId}
        onOpenChange={setFormOpen}
        onSubmit={handleSave}
      />

      <MenuDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={deleteTarget ? specialDayDeleteTitle(deleteTarget.date) : ''}
        description={deleteTarget ? specialDayDeleteDescription(deleteTarget.scope) : ''}
        pending={deletePending}
        onConfirm={async () => {
          if (!deleteTarget) {
            return
          }
          setDeletePending(true)
          const result = await deleteSpecialDayAction(deleteTarget.id)
          setDeletePending(false)
          if (!result.ok) {
            setDeleteActionError(true)
            return
          }
          setDeleteOpen(false)
          setNotice({ kind: 'deleted' })
          void reload()
        }}
      />
      {deleteActionError ? (
        <Alert variant="destructive" role="alert">
          <AlertTitle>{SPECIAL_DAYS_ACTION_ERROR_TITLE}</AlertTitle>
          <AlertDescription>{SPECIAL_DAYS_ACTION_ERROR_DESCRIPTION}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
