'use client'

import { Pencil, Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import {
  createFixedMenuCategoryAction,
  listFixedMenuCategoriesAction,
  loadFixedMenuCategoryFormAction,
  patchFixedMenuCategoryDisabledAction,
  updateFixedMenuCategoryAction,
} from '@/app/(app)/app/(shell)/menu/fixed-menus-actions'
import { MenuListEmptyState, MenuListErrorState, MenuListLoadingState } from '@/components/app/menu/menu-list-states'
import { MenuOutcomeAlert } from '@/components/app/menu/menu-outcome-alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { validateFixedMenuCategoryForm } from '@/lib/app/fixedMenus/categoryFormModel'
import type { FixedMenuCategoriesPageContext } from '@/lib/app/fixedMenus/loadFixedMenusPageContext'
import {
  emptyFixedMenuCategoryFormValues,
  type FixedMenuCategoryListRow,
} from '@/lib/app/fixedMenus/types'
import {
  MENU_FISSI_ACTION_ERROR_DESCRIPTION,
  MENU_FISSI_ACTION_ERROR_TITLE,
  MENU_FISSI_BADGE_CATEGORY_DISABLED,
  MENU_FISSI_CATEGORY_TOAST_DISABLED,
  MENU_FISSI_CATEGORY_TOAST_ENABLED,
  MENU_FISSI_CATEGORY_TOAST_SAVED,
  MENU_FISSI_CATEGORY_TOAST_SAVED_NEW,
  MENU_FISSI_CATEGORY_TOGGLE_LABEL,
  MENU_FISSI_CATEGORIES_EMPTY_TITLE,
  MENU_FISSI_LOAD_ERROR_DESCRIPTION,
  MENU_FISSI_LOAD_ERROR_TITLE,
  MENU_FISSI_LOAD_RETRY,
  MENU_FISSI_NEW_CATEGORY_BUTTON,
  MENU_FISSI_TOAST_PUBLIC_MINUTES,
  menuFissiCategoriesListCount,
  menuFissiCategoryMenuCount,
} from '@/lib/menu/fixed-menus/copy'
import { menuVisibilityLabel } from '@/lib/menu/fixedMenus/visibilityLabels'
import { FixedMenuCategoryFormSheet } from './fixed-menu-category-form-sheet'
import { FixedMenusShell } from './fixed-menus-shell'

type CategoryNotice =
  | { kind: 'enabled' }
  | { kind: 'disabled' }
  | { kind: 'savedNew' }
  | { kind: 'saved' }

type FixedMenuCategoriesPageProps = {
  context: FixedMenuCategoriesPageContext
}

export function FixedMenuCategoriesPage({ context }: FixedMenuCategoriesPageProps) {
  const [rows, setRows] = useState<FixedMenuCategoryListRow[]>([])
  const [loading, setLoading] = useState(!context.loadError)
  const [loadError, setLoadError] = useState(context.loadError)
  const [emptyDatabase, setEmptyDatabase] = useState(false)
  const [notice, setNotice] = useState<CategoryNotice | null>(null)
  const [actionError, setActionError] = useState(false)
  const [pendingRowId, setPendingRowId] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [formSessionKey, setFormSessionKey] = useState(0)
  const [formMode, setFormMode] = useState<'new' | 'edit'>('new')
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [formValues, setFormValues] = useState(emptyFixedMenuCategoryFormValues())
  const [formSaving, setFormSaving] = useState(false)
  const [formActionError, setFormActionError] = useState(false)
  const [formFieldErrors, setFormFieldErrors] = useState<ReturnType<typeof validateFixedMenuCategoryForm>>({})

  const reload = useCallback(async () => {
    setLoading(true)
    setLoadError(false)
    const result = await listFixedMenuCategoriesAction()
    setLoading(false)
    if (!result.ok) {
      setLoadError(true)
      return
    }
    setRows(result.rows)
    setEmptyDatabase(result.emptyDatabase)
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

  const openNewForm = () => {
    setNotice(null)
    setFormMode('new')
    setEditCategoryId(null)
    setEditName('')
    setFormValues(emptyFixedMenuCategoryFormValues())
    setFormFieldErrors({})
    setFormActionError(false)
    setFormSessionKey((k) => k + 1)
    setFormOpen(true)
  }

  const handleSave = async (values: typeof formValues) => {
    const fieldErrors = validateFixedMenuCategoryForm(values)
    if (Object.keys(fieldErrors).length > 0) {
      setFormFieldErrors(fieldErrors)
      document.getElementById('fixed-menu-category-field-name')?.focus()
      return
    }
    setFormSaving(true)
    setFormActionError(false)
    const result =
      formMode === 'new'
        ? await createFixedMenuCategoryAction(values)
        : await updateFixedMenuCategoryAction(editCategoryId!, values)
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

  const countLabel = rows.length > 0 ? menuFissiCategoriesListCount(rows.length) : null

  const newCategoryButton = (
    <Button type="button" size="lg" className="w-full md:w-auto" onClick={openNewForm}>
      <Plus className="size-4" aria-hidden />
      {MENU_FISSI_NEW_CATEGORY_BUTTON}
    </Button>
  )

  return (
    <FixedMenusShell
      activeTab="categories"
      tabAction={emptyDatabase && !loading && !loadError ? undefined : newCategoryButton}
    >
      {notice ? (
        <>
          <MenuOutcomeAlert
            title={
              notice.kind === 'enabled'
                ? MENU_FISSI_CATEGORY_TOAST_ENABLED
                : notice.kind === 'disabled'
                  ? MENU_FISSI_CATEGORY_TOAST_DISABLED
                  : notice.kind === 'savedNew'
                    ? MENU_FISSI_CATEGORY_TOAST_SAVED_NEW
                    : MENU_FISSI_CATEGORY_TOAST_SAVED
            }
          />
          {notice.kind === 'enabled' || notice.kind === 'disabled' ? (
            <p className="text-sm text-muted-foreground" role="status">
              {MENU_FISSI_TOAST_PUBLIC_MINUTES}
            </p>
          ) : null}
        </>
      ) : null}

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {MENU_FISSI_ACTION_ERROR_TITLE}. {MENU_FISSI_ACTION_ERROR_DESCRIPTION}
        </p>
      ) : null}

      {loadError ? (
        <MenuListErrorState
          title={MENU_FISSI_LOAD_ERROR_TITLE}
          description={MENU_FISSI_LOAD_ERROR_DESCRIPTION}
          retryLabel={MENU_FISSI_LOAD_RETRY}
          onRetry={() => void reload()}
        />
      ) : loading ? (
        <MenuListLoadingState />
      ) : emptyDatabase ? (
        <MenuListEmptyState
          title={MENU_FISSI_CATEGORIES_EMPTY_TITLE}
          action={
            <Button type="button" size="lg" onClick={openNewForm}>
              {MENU_FISSI_NEW_CATEGORY_BUTTON}
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {countLabel ? (
            <p className="text-sm text-muted-foreground" role="status">
              {countLabel}
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            {rows.map((row) => {
              const disabledRow = Boolean(row.disabled)
              return (
                <Card key={String(row.id)} size="sm" className={disabledRow ? 'opacity-50' : undefined}>
                  <CardContent className="flex items-center justify-between gap-2 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{row.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {menuVisibilityLabel(row.visibility)} · {menuFissiCategoryMenuCount(row.menuCount)}
                      </p>
                      {disabledRow ? (
                        <Badge variant="outline" className="mt-1">
                          {MENU_FISSI_BADGE_CATEGORY_DISABLED}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={!disabledRow}
                        disabled={pendingRowId === String(row.id)}
                        onCheckedChange={async (checked) => {
                          setNotice(null)
                          setPendingRowId(String(row.id))
                          const result = await patchFixedMenuCategoryDisabledAction(
                            String(row.id),
                            !checked,
                          )
                          setPendingRowId(null)
                          if (!result.ok) {
                            setActionError(true)
                            return
                          }
                          setNotice({ kind: checked ? 'enabled' : 'disabled' })
                          void reload()
                        }}
                        aria-label={`${MENU_FISSI_CATEGORY_TOGGLE_LABEL}: ${row.name}`}
                      />
                      <span className="sr-only md:not-sr-only md:text-sm">{MENU_FISSI_CATEGORY_TOGGLE_LABEL}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Modifica ${row.name}`}
                        onClick={async () => {
                          const loaded = await loadFixedMenuCategoryFormAction(String(row.id))
                          if (!loaded.ok) {
                            setActionError(true)
                            return
                          }
                          setFormMode('edit')
                          setEditCategoryId(String(row.id))
                          setEditName(row.name)
                          setFormValues(loaded.values)
                          setFormFieldErrors({})
                          setFormActionError(false)
                          setFormSessionKey((k) => k + 1)
                          setFormOpen(true)
                        }}
                      >
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      <FixedMenuCategoryFormSheet
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
    </FixedMenusShell>
  )
}
