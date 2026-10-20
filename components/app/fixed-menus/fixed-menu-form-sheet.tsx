'use client'

import { ArrowLeft, ArrowDown, ArrowUp, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

import { FixedMenuVisibilityAlerts } from '@/components/app/fixed-menus/fixed-menu-visibility-alerts'
import { LocalizedTranslationCollapsible } from '@/components/app/menu/localized-translation-collapsible'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  FIXED_MENU_FIELD_DOM_IDS,
  hasEnglishFixedMenuFields,
  type FixedMenuFieldErrors,
} from '@/lib/app/fixedMenus/formModel'
import type {
  FixedMenuCategoryOption,
  FixedMenuDishOption,
  FixedMenuFormValues,
  FixedMenuServiceOption,
} from '@/lib/app/fixedMenus/types'
import { applyDishPickerSelection } from '@/lib/menu/fixedMenus/applyDishPickerSelection'
import { moveListItem } from '@/lib/menu/fixedMenus/moveListItem'
import { prefillMenuVisibilityFromCategory } from '@/lib/menu/fixedMenus/effectiveVisibility'
import { dishDisplayStatusLabel } from '@/lib/menu/dishes/displayStatus'
import { formatMenuPriceEuro } from '@/lib/menu/display/formatPrice'
import {
  MENU_FISSI_ACTION_ERROR_DESCRIPTION,
  MENU_FISSI_ACTION_ERROR_TITLE,
  MENU_FISSI_COLUMN_VISIBILITY,
  MENU_FISSI_FORM_CANCEL,
  MENU_FISSI_FORM_CATEGORY,
  MENU_FISSI_FORM_CATEGORY_EMPTY,
  MENU_FISSI_FORM_CATEGORY_PLACEHOLDER,
  MENU_FISSI_FORM_DESCRIPTION,
  MENU_FISSI_FORM_DESCRIPTION_EN,
  MENU_FISSI_FORM_DISABLED_DESCRIPTION,
  MENU_FISSI_FORM_DISABLED_LABEL,
  MENU_FISSI_FORM_DISHES_ADD,
  MENU_FISSI_FORM_DISHES_ADD_OR_EDIT,
  MENU_FISSI_FORM_DISHES_EMPTY,
  MENU_FISSI_FORM_DISHES_LEGEND,
  MENU_FISSI_FORM_EDIT_TITLE,
  MENU_FISSI_FORM_SECTION_AVAILABILITY,
  MENU_FISSI_FORM_SECTION_CATEGORY_VISIBILITY,
  MENU_FISSI_FORM_SECTION_DATA,
  MENU_FISSI_FORM_NAME,
  MENU_FISSI_FORM_NAME_EN,
  MENU_FISSI_FORM_NEW_SUBTITLE,
  MENU_FISSI_FORM_NEW_TITLE,
  MENU_FISSI_FORM_PORTION,
  MENU_FISSI_FORM_PORTION_DESCRIPTION,
  MENU_FISSI_FORM_PORTION_HINT,
  MENU_FISSI_FORM_PORTIONS_EN_LEGEND,
  MENU_FISSI_FORM_PRICE,
  MENU_FISSI_FORM_SAVE,
  MENU_FISSI_FORM_SAVE_PENDING,
  MENU_FISSI_FORM_SERVICES_LEGEND,
  MENU_FISSI_FORM_SPECIAL_ONLY,
  MENU_FISSI_FORM_SPECIAL_ONLY_DESCRIPTION,
  MENU_FISSI_FORM_TRANSLATION_HINT,
  MENU_FISSI_FORM_VISIBILITY_DESCRIPTION,
  MENU_FISSI_PICKER_BACK,
  MENU_FISSI_PICKER_EMPTY,
  MENU_FISSI_PICKER_HINT,
  MENU_FISSI_PICKER_SEARCH,
  MENU_FISSI_PICKER_TITLE,
  menuFissiMoveDownAria,
  menuFissiMoveUpAria,
  menuFissiPickerDoneLabel,
  menuFissiRemoveDishAria,
} from '@/lib/menu/fixed-menus/copy'
import { MENU_VISIBILITY_OPTIONS } from '@/lib/menu/visibilityField'
import { compareItalianNames } from '@/lib/menu/display/sortByItalianName'

const visibilityItems = Object.fromEntries(
  MENU_VISIBILITY_OPTIONS.map((o) => [o.value, o.label]),
)

type SheetView = 'form' | 'picker'

type FixedMenuFormSheetProps = {
  open: boolean
  mode: 'new' | 'edit'
  editName?: string
  initialValues: FixedMenuFormValues
  categories: FixedMenuCategoryOption[]
  dishes: FixedMenuDishOption[]
  services: FixedMenuServiceOption[]
  saving: boolean
  actionError: boolean
  fieldErrors: FixedMenuFieldErrors
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FixedMenuFormValues) => void
}

export function FixedMenuFormSheet({
  open,
  mode,
  editName,
  initialValues,
  categories,
  dishes,
  services,
  saving,
  actionError,
  fieldErrors,
  onOpenChange,
  onSubmit,
}: FixedMenuFormSheetProps) {
  const isMobile = useIsMobile()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState(initialValues)
  const [view, setView] = useState<SheetView>('form')
  const [pickerSearch, setPickerSearch] = useState('')
  const [pickerSelected, setPickerSelected] = useState<Set<string>>(
    () => new Set(initialValues.dishes.map((d) => d.dishId)),
  )
  const [translationOpen, setTranslationOpen] = useState(() => hasEnglishFixedMenuFields(initialValues))

  const hasCategories = categories.length > 0
  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  )
  const selectedCategory = values.categoryId ? categoryById.get(values.categoryId) : undefined

  const categorySelectItems = useMemo(() => {
    const enabled = categories.filter((c) => !c.disabled || c.id === values.categoryId)
    return Object.fromEntries(enabled.map((c) => [c.id, c.name]))
  }, [categories, values.categoryId])

  const dishById = useMemo(() => new Map(dishes.map((d) => [d.id, d])), [dishes])

  const openPicker = () => {
    setPickerSelected(new Set(values.dishes.map((d) => d.dishId)))
    setPickerSearch('')
    setView('picker')
    scrollRef.current?.scrollTo({ top: 0 })
  }

  const applyPicker = () => {
    const nextDishes = applyDishPickerSelection(
      values.dishes,
      [...pickerSelected],
      (dishId) => {
        const meta = dishById.get(dishId)
        return {
          rowId: `new-${dishId}-${Date.now()}`,
          dishId,
          dishName: meta?.name ?? '',
          dishStatus: meta?.status ?? 'available',
          portionIt: '',
          portionEn: '',
        } satisfies FixedMenuFormValues['dishes'][number]
      },
    )
    setValues((v) => ({ ...v, dishes: nextDishes }))
    setView('form')
  }

  const pickerGroups = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase()
    const filtered = dishes.filter((d) => !q || d.name.toLowerCase().includes(q))
    const byCat = new Map<string, FixedMenuDishOption[]>()
    for (const d of filtered) {
      const key = d.categoryId || '_none'
      const list = byCat.get(key) ?? []
      list.push(d)
      byCat.set(key, list)
    }
    return [...byCat.entries()]
      .map(([categoryId, rows]) => ({
        categoryId,
        categoryName: rows[0]?.categoryName ?? '',
        rows: [...rows].sort((a, b) => compareItalianNames(a.name, b.name)),
      }))
      .sort((a, b) => compareItalianNames(a.categoryName, b.categoryName))
  }, [dishes, pickerSearch])

  const dishesAddLabel =
    values.dishes.length === 0 ? MENU_FISSI_FORM_DISHES_ADD : MENU_FISSI_FORM_DISHES_ADD_OR_EDIT

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className="flex flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-4 py-4 text-left">
          {view === 'picker' ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-11 shrink-0"
                aria-label={MENU_FISSI_PICKER_BACK}
                onClick={() => setView('form')}
              >
                <ArrowLeft className="size-4" aria-hidden />
              </Button>
              <SheetTitle>{MENU_FISSI_PICKER_TITLE}</SheetTitle>
            </div>
          ) : (
            <>
              <SheetTitle>
                {mode === 'new' ? MENU_FISSI_FORM_NEW_TITLE : MENU_FISSI_FORM_EDIT_TITLE}
              </SheetTitle>
              {mode === 'new' ? (
                <p className="text-sm text-muted-foreground">{MENU_FISSI_FORM_NEW_SUBTITLE}</p>
              ) : editName ? (
                <p className="text-sm text-muted-foreground">{editName}</p>
              ) : null}
            </>
          )}
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          {actionError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{MENU_FISSI_ACTION_ERROR_TITLE}</AlertTitle>
              <AlertDescription>{MENU_FISSI_ACTION_ERROR_DESCRIPTION}</AlertDescription>
            </Alert>
          ) : null}

          {view === 'picker' ? (
            <FieldGroup>
              <p className="text-sm text-muted-foreground">{MENU_FISSI_PICKER_HINT}</p>
              <Field>
                <FieldLabel htmlFor="fixed-menu-picker-search">{MENU_FISSI_PICKER_SEARCH}</FieldLabel>
                <Input
                  id="fixed-menu-picker-search"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                />
              </Field>
              {pickerGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground">{MENU_FISSI_PICKER_EMPTY}</p>
              ) : (
                pickerGroups.map((group) => (
                  <FieldSet key={group.categoryId}>
                    <FieldLegend>{group.categoryName}</FieldLegend>
                    {group.rows.map((dish) => {
                      const checked = pickerSelected.has(dish.id)
                      return (
                        <Field key={dish.id} orientation="horizontal">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(next) => {
                              setPickerSelected((prev) => {
                                const copy = new Set(prev)
                                if (next) {
                                  copy.add(dish.id)
                                } else {
                                  copy.delete(dish.id)
                                }
                                return copy
                              })
                            }}
                          />
                          <div className="flex flex-wrap items-center gap-2">
                            <span>{dish.name}</span>
                            {dish.status !== 'available' ? (
                              <Badge variant="outline">{dishDisplayStatusLabel(dish.status)}</Badge>
                            ) : null}
                          </div>
                        </Field>
                      )
                    })}
                  </FieldSet>
                ))
              )}
            </FieldGroup>
          ) : (
            <FieldGroup>
              <FieldSet>
                <FieldLegend>{MENU_FISSI_FORM_SECTION_DATA}</FieldLegend>
                <Field>
                  <FieldLabel htmlFor={FIXED_MENU_FIELD_DOM_IDS.name}>{MENU_FISSI_FORM_NAME}</FieldLabel>
                  <Input
                    id={FIXED_MENU_FIELD_DOM_IDS.name}
                    value={values.name}
                    onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                    aria-invalid={Boolean(fieldErrors.name)}
                  />
                  <FieldError>{fieldErrors.name}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor={FIXED_MENU_FIELD_DOM_IDS.description}>
                    {MENU_FISSI_FORM_DESCRIPTION}
                  </FieldLabel>
                  <Textarea
                    id={FIXED_MENU_FIELD_DOM_IDS.description}
                    value={values.description}
                    onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor={FIXED_MENU_FIELD_DOM_IDS.price}>{MENU_FISSI_FORM_PRICE}</FieldLabel>
                  <Input
                    id={FIXED_MENU_FIELD_DOM_IDS.price}
                    inputMode="decimal"
                    value={values.priceInput}
                    aria-invalid={Boolean(fieldErrors.price)}
                    onChange={(e) => setValues((v) => ({ ...v, priceInput: e.target.value }))}
                  />
                  <FieldError>{fieldErrors.price}</FieldError>
                </Field>
              </FieldSet>

              <FieldSet>
                <FieldLegend>{MENU_FISSI_FORM_SECTION_CATEGORY_VISIBILITY}</FieldLegend>
                <Field>
                  <FieldLabel htmlFor={FIXED_MENU_FIELD_DOM_IDS.categoryId}>
                    {MENU_FISSI_FORM_CATEGORY}
                  </FieldLabel>
                  <Select
                    items={categorySelectItems}
                    value={values.categoryId || undefined}
                    disabled={!hasCategories}
                    onValueChange={(value) => {
                      const categoryId = value ?? ''
                      setValues((v) => {
                        const cat = categoryById.get(categoryId)
                        const prefilled = cat
                          ? prefillMenuVisibilityFromCategory(cat.visibility, v.visibilityTouched)
                          : null
                        return {
                          ...v,
                          categoryId,
                          ...(prefilled ? { visibility: prefilled } : {}),
                        }
                      })
                    }}
                  >
                    <SelectTrigger
                      id={FIXED_MENU_FIELD_DOM_IDS.categoryId}
                      className="w-full"
                      aria-invalid={Boolean(fieldErrors.categoryId)}
                    >
                      <SelectValue
                        placeholder={
                          hasCategories ? MENU_FISSI_FORM_CATEGORY_PLACEHOLDER : MENU_FISSI_FORM_CATEGORY_EMPTY
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categorySelectItems).map(([id, label]) => (
                        <SelectItem key={id} value={id}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldErrors.categoryId}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor={FIXED_MENU_FIELD_DOM_IDS.visibility}>
                    {MENU_FISSI_COLUMN_VISIBILITY}
                  </FieldLabel>
                  <Select
                    items={visibilityItems}
                    value={values.visibility}
                    onValueChange={(value) =>
                      setValues((v) => ({
                        ...v,
                        visibility: (value ?? 'always') as FixedMenuFormValues['visibility'],
                        visibilityTouched: true,
                      }))
                    }
                  >
                    <SelectTrigger id={FIXED_MENU_FIELD_DOM_IDS.visibility} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MENU_VISIBILITY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>{MENU_FISSI_FORM_VISIBILITY_DESCRIPTION}</FieldDescription>
                </Field>

                {selectedCategory ? (
                  <FixedMenuVisibilityAlerts
                    menuVisibility={values.visibility}
                    categoryVisibility={selectedCategory.visibility}
                    categoryName={selectedCategory.name}
                  />
                ) : null}

                <Field orientation="horizontal">
                  <Switch
                    checked={values.specialOnly}
                    onCheckedChange={(checked) => setValues((v) => ({ ...v, specialOnly: checked }))}
                  />
                  <div>
                    <FieldLabel>{MENU_FISSI_FORM_SPECIAL_ONLY}</FieldLabel>
                    <FieldDescription>{MENU_FISSI_FORM_SPECIAL_ONLY_DESCRIPTION}</FieldDescription>
                  </div>
                </Field>
              </FieldSet>

              <FieldSet id="fixed-menu-dishes-section">
                <FieldLegend>{MENU_FISSI_FORM_DISHES_LEGEND}</FieldLegend>
                {values.dishes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{MENU_FISSI_FORM_DISHES_EMPTY}</p>
                ) : (
                  values.dishes.map((row, index) => (
                    <div key={row.rowId} className="mb-3 rounded-lg border border-border p-3">
                      <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">
                              {index + 1}. {row.dishName}
                            </span>
                            {row.dishStatus !== 'available' ? (
                              <Badge variant="outline">{dishDisplayStatusLabel(row.dishStatus)}</Badge>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-11"
                            disabled={index === 0}
                            aria-label={menuFissiMoveUpAria(row.dishName)}
                            onClick={() =>
                              setValues((v) => ({
                                ...v,
                                dishes: moveListItem(v.dishes, index, 'up'),
                              }))
                            }
                          >
                            <ArrowUp className="size-4" aria-hidden />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-11"
                            disabled={index === values.dishes.length - 1}
                            aria-label={menuFissiMoveDownAria(row.dishName)}
                            onClick={() =>
                              setValues((v) => ({
                                ...v,
                                dishes: moveListItem(v.dishes, index, 'down'),
                              }))
                            }
                          >
                            <ArrowDown className="size-4" aria-hidden />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-11"
                            aria-label={menuFissiRemoveDishAria(row.dishName)}
                            onClick={() =>
                              setValues((v) => ({
                                ...v,
                                dishes: v.dishes.filter((d) => d.rowId !== row.rowId),
                              }))
                            }
                          >
                            <X className="size-4" aria-hidden />
                          </Button>
                        </div>
                      </div>
                      <Field className="mt-2">
                        <FieldLabel htmlFor={`fixed-menu-portion-${row.rowId}`}>
                          {MENU_FISSI_FORM_PORTION}
                        </FieldLabel>
                        <Input
                          id={`fixed-menu-portion-${row.rowId}`}
                          value={row.portionIt}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              dishes: v.dishes.map((d) =>
                                d.rowId === row.rowId ? { ...d, portionIt: e.target.value } : d,
                              ),
                            }))
                          }
                        />
                        <FieldDescription>{MENU_FISSI_FORM_PORTION_DESCRIPTION}</FieldDescription>
                      </Field>
                    </div>
                  ))
                )}
                <FieldError>{fieldErrors.dishes}</FieldError>
                <Button type="button" variant="outline" className="mt-2 w-full" onClick={openPicker}>
                  {dishesAddLabel}
                </Button>
                <FieldDescription>{MENU_FISSI_FORM_PORTION_HINT}</FieldDescription>
              </FieldSet>

              <FieldSet>
                <FieldLegend>{MENU_FISSI_FORM_SERVICES_LEGEND}</FieldLegend>
                {services.map((service) => {
                  const checked = values.serviceIds.includes(service.id)
                  return (
                    <Field key={service.id} orientation="horizontal">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(next) =>
                          setValues((v) => ({
                            ...v,
                            serviceIds: next
                              ? [...v.serviceIds, service.id]
                              : v.serviceIds.filter((id) => id !== service.id),
                          }))
                        }
                      />
                      <span>
                        {service.name} · {formatMenuPriceEuro(service.price)}
                      </span>
                    </Field>
                  )
                })}
              </FieldSet>

              <LocalizedTranslationCollapsible
                open={translationOpen}
                onOpenChange={setTranslationOpen}
                hasEnglish={hasEnglishFixedMenuFields(values)}
              >
                <Field>
                  <FieldLabel htmlFor={FIXED_MENU_FIELD_DOM_IDS.nameEn}>{MENU_FISSI_FORM_NAME_EN}</FieldLabel>
                  <Input
                    id={FIXED_MENU_FIELD_DOM_IDS.nameEn}
                    value={values.nameEn}
                    placeholder={values.name.trim()}
                    onChange={(e) => setValues((v) => ({ ...v, nameEn: e.target.value }))}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={FIXED_MENU_FIELD_DOM_IDS.descriptionEn}>
                    {MENU_FISSI_FORM_DESCRIPTION_EN}
                  </FieldLabel>
                  <Textarea
                    id={FIXED_MENU_FIELD_DOM_IDS.descriptionEn}
                    value={values.descriptionEn}
                    placeholder={values.description.trim()}
                    onChange={(e) => setValues((v) => ({ ...v, descriptionEn: e.target.value }))}
                  />
                </Field>
                {values.dishes.some((d) => d.portionIt.trim()) ? (
                  <FieldSet>
                    <FieldLegend>{MENU_FISSI_FORM_PORTIONS_EN_LEGEND}</FieldLegend>
                    {values.dishes
                      .filter((d) => d.portionIt.trim())
                      .map((row) => (
                        <Field key={row.rowId}>
                          <FieldLabel htmlFor={`fixed-menu-portion-en-${row.rowId}`}>
                            {row.dishName}
                          </FieldLabel>
                          <Input
                            id={`fixed-menu-portion-en-${row.rowId}`}
                            value={row.portionEn}
                            placeholder={row.portionIt.trim()}
                            onChange={(e) =>
                              setValues((v) => ({
                                ...v,
                                dishes: v.dishes.map((d) =>
                                  d.rowId === row.rowId ? { ...d, portionEn: e.target.value } : d,
                                ),
                              }))
                            }
                          />
                        </Field>
                      ))}
                  </FieldSet>
                ) : null}
                <FieldDescription>{MENU_FISSI_FORM_TRANSLATION_HINT}</FieldDescription>
              </LocalizedTranslationCollapsible>

              <FieldSet>
                <FieldLegend>{MENU_FISSI_FORM_SECTION_AVAILABILITY}</FieldLegend>
                <Field orientation="horizontal">
                  <Switch
                    checked={values.disabled}
                    onCheckedChange={(checked) => setValues((v) => ({ ...v, disabled: checked }))}
                  />
                  <div>
                    <FieldLabel>{MENU_FISSI_FORM_DISABLED_LABEL}</FieldLabel>
                    <FieldDescription>{MENU_FISSI_FORM_DISABLED_DESCRIPTION}</FieldDescription>
                  </div>
                </Field>
              </FieldSet>
            </FieldGroup>
          )}
        </div>

        <SheetFooter className="flex-row gap-2 border-t border-border px-4 py-4">
          {view === 'picker' ? (
            <>
              <Button type="button" size="lg" className="flex-1" onClick={applyPicker}>
                {menuFissiPickerDoneLabel(pickerSelected.size)}
              </Button>
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setView('form')}>
                {MENU_FISSI_FORM_CANCEL}
              </Button>
            </>
          ) : (
            <>
              <Button type="button" size="lg" className="flex-1" disabled={saving} onClick={() => onSubmit(values)}>
                {saving ? <Spinner className="size-4" aria-hidden /> : null}
                {saving ? MENU_FISSI_FORM_SAVE_PENDING : MENU_FISSI_FORM_SAVE}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                disabled={saving}
                onClick={() => onOpenChange(false)}
              >
                {MENU_FISSI_FORM_CANCEL}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
