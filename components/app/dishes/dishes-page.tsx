'use client'

import { Filter } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  createDishAction,
  deleteDishAction,
  listDishesAction,
  listFixedMenusUsingDishAction,
  loadDishFormAction,
  patchDishAvailabilityAction,
  updateDishAction,
} from '@/app/(app)/app/(shell)/menu/dishes-actions'
import { DishCategoryGroupBlock } from '@/components/app/dishes/dish-category-group'
import { DishFormSheet } from '@/components/app/dishes/dish-form-sheet'
import { MenuActiveFilterChips } from '@/components/app/menu/menu-active-filter-chips'
import { MenuDeleteDialog } from '@/components/app/menu/menu-delete-dialog'
import { MenuFilterSheet } from '@/components/app/menu/menu-filter-sheet'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DishesPageContext } from '@/lib/app/dishes/loadDishesPageContext'
import {
  firstInvalidDishField,
  validateDishForm,
  type DishFieldErrors,
} from '@/lib/app/dishes/formModel'
import {
  EMPTY_DISH_LIST_QUERY,
  emptyDishFormValues,
  type DishFormValues,
  type DishListQuery,
} from '@/lib/app/dishes/types'
import type { DishListStatusFilter } from '@/lib/menu/dishes/buildDishesWhere'
import type { DishCategoryGroup, DishListRow } from '@/lib/menu/dishes/groupByCategory'
import {
  PIATTI_CLEAR_FILTERS,
  PIATTI_DELETE_BACK,
  PIATTI_DELETE_CLOSE,
  PIATTI_DELETE_CONFIRM,
  PIATTI_DELETE_CONFIRM_IRREVERSIBLE,
  PIATTI_EMPTY_TITLE,
  PIATTI_FILTERS_ALL_CATEGORIES,
  PIATTI_FILTERS_ALL_STATES,
  PIATTI_FILTERS_BUTTON,
  PIATTI_FILTERS_SHEET_DESCRIPTION,
  PIATTI_FILTERS_SHEET_TITLE,
  PIATTI_FILTER_NO_ALLERGENS,
  PIATTI_FILTER_STATE_AVAILABLE,
  PIATTI_FILTER_STATE_DISABLED,
  PIATTI_FILTER_STATE_SOLD_OUT,
  PIATTI_LIST_PARTIAL_DESCRIPTION,
  PIATTI_LIST_PARTIAL_TITLE_PREFIX,
  PIATTI_LOAD_ERROR_DESCRIPTION,
  PIATTI_LOAD_ERROR_TITLE,
  PIATTI_LOAD_RETRY,
  PIATTI_NEW_BUTTON,
  PIATTI_NO_RESULTS_TITLE,
  PIATTI_PAGE_DESCRIPTION,
  PIATTI_PAGE_TITLE,
  PIATTI_REBUILD_HINT_DELETED,
  PIATTI_REBUILD_HINT_SAVED,
  PIATTI_SEARCH_PLACEHOLDER,
  PIATTI_TOAST_AVAILABLE_AGAIN,
  PIATTI_TOAST_DELETED,
  PIATTI_TOAST_DISABLED,
  PIATTI_TOAST_ENABLED,
  PIATTI_TOAST_PUBLIC_MINUTES,
  PIATTI_TOAST_SAVED,
  PIATTI_TOAST_SAVED_NEW,
  PIATTI_ACTION_ERROR_DESCRIPTION,
  PIATTI_ACTION_ERROR_TITLE,
  PIATTI_TOAST_SOLD_OUT,
} from '@/lib/menu/dishes/copy'
import { formatSoldOutToastExpiry } from '@/lib/menu/dishes/soldOutExpiryText'

type PageNotice =
  | { kind: 'soldOut' }
  | { kind: 'availableAgain' }
  | { kind: 'disabled' }
  | { kind: 'enabled' }
  | { kind: 'savedNew' }
  | { kind: 'saved' }
  | { kind: 'deleted' }

type DishesPageProps = {
  context: DishesPageContext
}

export function DishesPage({ context }: DishesPageProps) {
  const [now] = useState(() => new Date())
  const [query, setQuery] = useState<DishListQuery>(EMPTY_DISH_LIST_QUERY)
  const [draftQuery, setDraftQuery] = useState<DishListQuery>(EMPTY_DISH_LIST_QUERY)
  const [groups, setGroups] = useState<DishCategoryGroup[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [partial, setPartial] = useState(false)
  const [emptyDatabase, setEmptyDatabase] = useState(false)
  const [loading, setLoading] = useState(!context.loadError)
  const [loadError, setLoadError] = useState(context.loadError)
  const [notice, setNotice] = useState<PageNotice | null>(null)
  const [pendingDishId, setPendingDishId] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'new' | 'edit'>('new')
  const [editDishId, setEditDishId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [formValues, setFormValues] = useState<DishFormValues>(emptyDishFormValues())
  const [formSaving, setFormSaving] = useState(false)
  const [formActionError, setFormActionError] = useState(false)
  const [formFieldErrors, setFormFieldErrors] = useState<DishFieldErrors>({})

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DishListRow | null>(null)
  const [deleteBlockedTitle, setDeleteBlockedTitle] = useState<string | null>(null)
  const [deleteBlockedMessage, setDeleteBlockedMessage] = useState<string | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const [deleteActionError, setDeleteActionError] = useState(false)

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (query.categoryId) n += 1
    if (query.status !== 'all') n += 1
    if (query.noAllergens) n += 1
    return n
  }, [query])

  const filterChips = useMemo(() => {
    const chips: { id: string; label: string }[] = []
    if (query.categoryId) {
      const cat = context.categories.find((c) => c.id === query.categoryId)
      chips.push({ id: 'category', label: cat?.name ?? query.categoryId })
    }
    if (query.status === 'available') chips.push({ id: 'status', label: PIATTI_FILTER_STATE_AVAILABLE })
    if (query.status === 'soldOut') chips.push({ id: 'status', label: PIATTI_FILTER_STATE_SOLD_OUT })
    if (query.status === 'disabled') chips.push({ id: 'status', label: PIATTI_FILTER_STATE_DISABLED })
    if (query.noAllergens) chips.push({ id: 'noAllergens', label: PIATTI_FILTER_NO_ALLERGENS })
    return chips
  }, [query, context.categories])

  const reload = useCallback(async (q: DishListQuery) => {
    setLoading(true)
    setLoadError(false)
    const result = await listDishesAction(q)
    setLoading(false)
    if (!result.ok) {
      setLoadError(true)
      return
    }
    setGroups(result.groups)
    setTotalDocs(result.totalDocs)
    setPartial(result.partial)
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
      await reload(query)
    })()
    return () => {
      cancelled = true
    }
  }, [context.loadError, query, reload])

  const clearNotice = () => setNotice(null)

  const handleSearchChange = (value: string) => {
    clearNotice()
    const next = { ...query, search: value }
    setQuery(next)
  }

  const applyFilters = () => {
    clearNotice()
    setQuery({ ...draftQuery, search: query.search })
    setFiltersOpen(false)
  }

  const resetFilters = () => {
    const next: DishListQuery = { ...query, categoryId: '', status: 'all', noAllergens: false }
    setDraftQuery(next)
    setQuery(next)
    setFiltersOpen(false)
  }

  const removeChip = (id: string) => {
    clearNotice()
    if (id === 'category') setQuery((q) => ({ ...q, categoryId: '' }))
    if (id === 'status') setQuery((q) => ({ ...q, status: 'all' }))
    if (id === 'noAllergens') setQuery((q) => ({ ...q, noAllergens: false }))
  }

  const openNewForm = () => {
    clearNotice()
    setFormMode('new')
    setEditDishId(null)
    setEditName('')
    setFormValues(emptyDishFormValues())
    setFormActionError(false)
    setFormFieldErrors({})
    setFormOpen(true)
  }

  const openEditForm = async (dish: DishListRow) => {
    clearNotice()
    const loaded = await loadDishFormAction(String(dish.id))
    if (!loaded.ok) {
      setFormActionError(true)
      setFormMode('edit')
      setEditDishId(String(dish.id))
      setEditName(dish.name)
      setFormValues(emptyDishFormValues())
      setFormOpen(true)
      return
    }
    setFormMode('edit')
    setEditDishId(String(dish.id))
    setEditName(dish.name)
    setFormValues(loaded.values)
    setFormActionError(false)
    setFormFieldErrors({})
    setFormOpen(true)
  }

  const focusInvalid = (errors: DishFieldErrors) => {
    const first = firstInvalidDishField(errors)
    if (!first) return
    const el = document.getElementById(
      first === 'name'
        ? 'dish-field-name'
        : first === 'price'
          ? 'dish-field-price'
          : 'dish-field-category',
    )
    el?.focus()
  }

  const handleFormSubmit = async (values: DishFormValues) => {
    const errors = validateDishForm(values)
    if (Object.keys(errors).length > 0) {
      setFormFieldErrors(errors)
      focusInvalid(errors)
      return
    }
    setFormSaving(true)
    setFormActionError(false)
    const result =
      formMode === 'new'
        ? await createDishAction(values)
        : await updateDishAction(editDishId ?? '', values)
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
    void reload(query)
  }

  const patchAvailability = async (
    dish: DishListRow,
    patch: { soldOut?: boolean; disabled?: boolean },
    successNotice: PageNotice,
  ) => {
    clearNotice()
    setPendingDishId(String(dish.id))
    const result = await patchDishAvailabilityAction(String(dish.id), patch)
    setPendingDishId(null)
    if (!result.ok) {
      return
    }
    setNotice(successNotice)
    void reload(query)
  }

  const startDelete = async (dish: DishListRow) => {
    clearNotice()
    setDeleteActionError(false)
    const menus = await listFixedMenusUsingDishAction(String(dish.id))
    if (!menus.ok) {
      return
    }
    if (menus.names.length > 0) {
      setDeleteTarget(dish)
      setDeleteBlockedTitle(`Non si può eliminare ${dish.name}`)
      setDeleteBlockedMessage(menus.description)
      setDeleteOpen(true)
      return
    }
    setDeleteTarget(dish)
    setDeleteBlockedTitle(null)
    setDeleteBlockedMessage(null)
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget || deleteBlockedTitle) {
      setDeleteOpen(false)
      return
    }
    setDeletePending(true)
    setDeleteActionError(false)
    const result = await deleteDishAction(String(deleteTarget.id))
    setDeletePending(false)
    if (!result.ok) {
      if (result.error === 'blocked') {
        setDeleteBlockedTitle(result.blockedTitle ?? null)
        setDeleteBlockedMessage(result.blockedMessage ?? null)
        return
      }
      setDeleteActionError(true)
      return
    }
    setDeleteOpen(false)
    setDeleteTarget(null)
    setNotice({ kind: 'deleted' })
    void reload(query)
  }

  const hasActiveFilters =
    Boolean(query.search.trim()) ||
    Boolean(query.categoryId) ||
    query.status !== 'all' ||
    query.noAllergens

  const showNoResults = !loading && !loadError && groups.length === 0 && hasActiveFilters
  const showEmpty = !loading && !loadError && emptyDatabase

  const soldOutToastExtra = formatSoldOutToastExpiry(now, context.serviceHours)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pb-8">
      <MenuPageHeader
        title={PIATTI_PAGE_TITLE}
        description={PIATTI_PAGE_DESCRIPTION}
        showRebuild={false}
        primaryAction={
          <Button type="button" size="lg" className="w-full md:w-auto" onClick={openNewForm}>
            {PIATTI_NEW_BUTTON}
          </Button>
        }
      />

      {notice?.kind === 'soldOut' ? (
        <Alert role="status">
          <AlertTitle>{PIATTI_TOAST_SOLD_OUT}</AlertTitle>
          <AlertDescription>
            {PIATTI_TOAST_PUBLIC_MINUTES}
            {soldOutToastExtra ? ` ${soldOutToastExtra}` : ''}
          </AlertDescription>
        </Alert>
      ) : notice ? (
        <>
          <MenuOutcomeAlert
            title={
              notice.kind === 'availableAgain'
                ? PIATTI_TOAST_AVAILABLE_AGAIN
                : notice.kind === 'disabled'
                  ? PIATTI_TOAST_DISABLED
                  : notice.kind === 'enabled'
                    ? PIATTI_TOAST_ENABLED
                    : notice.kind === 'savedNew'
                      ? PIATTI_TOAST_SAVED_NEW
                      : notice.kind === 'saved'
                        ? PIATTI_TOAST_SAVED
                        : PIATTI_TOAST_DELETED
            }
            rebuildHint={
              notice.kind === 'savedNew' || notice.kind === 'saved'
                ? PIATTI_REBUILD_HINT_SAVED
                : notice.kind === 'deleted'
                  ? PIATTI_REBUILD_HINT_DELETED
                  : undefined
            }
          />
          {notice.kind === 'disabled' || notice.kind === 'enabled' ? (
            <p className="text-sm text-muted-foreground" role="status">{PIATTI_TOAST_PUBLIC_MINUTES}</p>
          ) : null}
        </>
      ) : null}

      {partial ? (
        <Alert role="status">
          <AlertTitle>
            {PIATTI_LIST_PARTIAL_TITLE_PREFIX}
            {totalDocs}
          </AlertTitle>
          <AlertDescription>{PIATTI_LIST_PARTIAL_DESCRIPTION}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            placeholder={PIATTI_SEARCH_PLACEHOLDER}
            value={query.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={() => setFiltersOpen(true)}>
            <Filter className="size-4" aria-hidden />
            {PIATTI_FILTERS_BUTTON}
            {activeFilterCount > 0 ? (
              <Badge variant="default" className="ml-1">{activeFilterCount}</Badge>
            ) : null}
          </Button>
        </div>
        <MenuActiveFilterChips filters={filterChips} onRemove={removeChip} />
      </div>

      {loadError ? (
        <MenuListErrorState
          title={PIATTI_LOAD_ERROR_TITLE}
          description={PIATTI_LOAD_ERROR_DESCRIPTION}
          retryLabel={PIATTI_LOAD_RETRY}
          onRetry={() => void reload(query)}
        />
      ) : loading ? (
        <MenuListLoadingState />
      ) : showEmpty ? (
        <MenuListEmptyState
          title={PIATTI_EMPTY_TITLE}
          action={
            <Button type="button" size="lg" onClick={openNewForm}>
              {PIATTI_NEW_BUTTON}
            </Button>
          }
        />
      ) : showNoResults ? (
        <MenuListEmptyState
          title={PIATTI_NO_RESULTS_TITLE}
          action={
            <Button type="button" variant="outline" onClick={resetFilters}>
              {PIATTI_CLEAR_FILTERS}
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <DishCategoryGroupBlock
              key={String(group.categoryId)}
              group={group}
              serviceHours={context.serviceHours}
              now={now}
              pendingDishId={pendingDishId}
              onToggleSoldOut={(dish, checked) =>
                void patchAvailability(
                  dish,
                  { soldOut: checked },
                  checked ? { kind: 'soldOut' } : { kind: 'availableAgain' },
                )
              }
              onEdit={(dish) => void openEditForm(dish)}
              onVisibility={(dish) =>
                void patchAvailability(
                  dish,
                  { disabled: !dish.disabled },
                  dish.disabled ? { kind: 'enabled' } : { kind: 'disabled' },
                )
              }
              onDelete={(dish) => void startDelete(dish)}
            />
          ))}
        </div>
      )}

      <MenuFilterSheet
        open={filtersOpen}
        onOpenChange={(open) => {
          setFiltersOpen(open)
          if (open) setDraftQuery(query)
        }}
        title={PIATTI_FILTERS_SHEET_TITLE}
        description={PIATTI_FILTERS_SHEET_DESCRIPTION}
        onApply={applyFilters}
        onReset={resetFilters}
      >
        <Field>
          <FieldLabel>Categoria</FieldLabel>
          <Select
            value={draftQuery.categoryId || 'all'}
            onValueChange={(v) =>
              setDraftQuery((q) => ({
                ...q,
                categoryId: v === 'all' || v == null ? '' : v,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{PIATTI_FILTERS_ALL_CATEGORIES}</SelectItem>
              {context.categories.map((c) => (
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
              setDraftQuery((q) => ({ ...q, status: v as DishListStatusFilter }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{PIATTI_FILTERS_ALL_STATES}</SelectItem>
              <SelectItem value="available">{PIATTI_FILTER_STATE_AVAILABLE}</SelectItem>
              <SelectItem value="soldOut">{PIATTI_FILTER_STATE_SOLD_OUT}</SelectItem>
              <SelectItem value="disabled">{PIATTI_FILTER_STATE_DISABLED}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="dish-filter-no-allergens"
            checked={draftQuery.noAllergens}
            onCheckedChange={(c) => setDraftQuery((q) => ({ ...q, noAllergens: Boolean(c) }))}
          />
          <FieldLabel htmlFor="dish-filter-no-allergens">{PIATTI_FILTER_NO_ALLERGENS}</FieldLabel>
        </Field>
      </MenuFilterSheet>

      <DishFormSheet
        key={formOpen ? `${formMode}-${editDishId ?? 'new'}` : 'closed'}
        open={formOpen}
        mode={formMode}
        editName={editName}
        initialValues={formValues}
        categories={context.categories}
        allergens={context.allergens}
        serviceHours={context.serviceHours}
        now={now}
        saving={formSaving}
        actionError={formActionError}
        fieldErrors={formFieldErrors}
        onOpenChange={setFormOpen}
        onSubmit={(v) => void handleFormSubmit(v)}
        onFieldErrorsChange={setFormFieldErrors}
      />

      <MenuDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={
          deleteBlockedTitle ??
          (deleteTarget ? `Eliminare ${deleteTarget.name}?` : '')
        }
        description={
          deleteActionError
            ? `${PIATTI_ACTION_ERROR_TITLE} ${PIATTI_ACTION_ERROR_DESCRIPTION}`
            : deleteBlockedMessage ??
              (deleteBlockedTitle ? '' : PIATTI_DELETE_CONFIRM_IRREVERSIBLE)
        }
        confirmLabel={deleteBlockedTitle ? PIATTI_DELETE_CLOSE : PIATTI_DELETE_CONFIRM}
        cancelLabel={PIATTI_DELETE_BACK}
        hideCancel={Boolean(deleteBlockedTitle)}
        destructive={!deleteBlockedTitle}
        pending={deletePending}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  )
}
