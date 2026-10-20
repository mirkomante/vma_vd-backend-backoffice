'use client'

import { useMemo, useState } from 'react'

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
  SPECIAL_DAY_FIELD_DOM_IDS,
  hasEnglishSpecialDayMessage,
  isSpecialDayDateBeforeToday,
  type SpecialDayFieldErrors,
} from '@/lib/app/specialDays/formModel'
import type { FixedMenuPickerOption, SpecialDayFormValues } from '@/lib/app/specialDays/types'
import {
  SPECIAL_DAYS_ACTION_ERROR_DESCRIPTION,
  SPECIAL_DAYS_ACTION_ERROR_TITLE,
  SPECIAL_DAYS_BADGE_MENU_DISABLED,
  SPECIAL_DAYS_BADGE_SPECIAL_ONLY,
  SPECIAL_DAYS_FORM_CANCEL,
  SPECIAL_DAYS_FORM_DATE,
  SPECIAL_DAYS_FORM_DATE_PAST_WARNING,
  SPECIAL_DAYS_FORM_DISABLED_HINT,
  SPECIAL_DAYS_FORM_DISABLED_LABEL,
  SPECIAL_DAYS_FORM_INFO,
  SPECIAL_DAYS_FORM_MESSAGE_EN,
  SPECIAL_DAYS_FORM_MESSAGE_HINT,
  SPECIAL_DAYS_FORM_NEW_SUBTITLE,
  SPECIAL_DAYS_FORM_NEW_TITLE,
  SPECIAL_DAYS_FORM_SAVE,
  SPECIAL_DAYS_FORM_SAVE_PENDING,
  SPECIAL_DAYS_FORM_SCOPE,
  SPECIAL_DAYS_FORM_SCOPE_HINT,
  SPECIAL_DAYS_FORM_SCOPE_PLACEHOLDER,
  SPECIAL_DAYS_FORM_SECTION_MENUS,
  SPECIAL_DAYS_FORM_SECTION_MESSAGE,
  SPECIAL_DAYS_FORM_SECTION_STATE,
  SPECIAL_DAYS_FORM_SECTION_WHEN,
  SPECIAL_DAYS_FORM_TRANSLATION_HINT,
  specialDayFormEditSubtitle,
  specialDayFormEditTitle,
} from '@/lib/menu/specialDays/copy'
import {
  anticipateSpecialDayOverlap,
  type SpecialDayOverlapExisting,
} from '@/lib/menu/specialDays/anticipateSpecialDayOverlap'
import { SPECIAL_DAY_SCOPE_OPTIONS, type SpecialDayScope } from '@/lib/menu/validateSpecialDayOverlap'

type SpecialDayFormSheetProps = {
  open: boolean
  mode: 'new' | 'edit'
  editDateLabel?: string
  initialValues: SpecialDayFormValues
  fixedMenuOptions: FixedMenuPickerOption[]
  saving: boolean
  actionError: boolean
  fieldErrors: SpecialDayFieldErrors
  existingDays: SpecialDayOverlapExisting[]
  editingId: string | null
  onOpenChange: (open: boolean) => void
  onSubmit: (values: SpecialDayFormValues) => void
}

export function SpecialDayFormSheet({
  open,
  mode,
  editDateLabel,
  initialValues,
  fixedMenuOptions,
  saving,
  actionError,
  fieldErrors,
  existingDays,
  editingId,
  onOpenChange,
  onSubmit,
}: SpecialDayFormSheetProps) {
  const isMobile = useIsMobile()
  const [values, setValues] = useState(initialValues)
  const [translationOpen, setTranslationOpen] = useState(() => hasEnglishSpecialDayMessage(initialValues))

  const liveOverlapMessage = useMemo(
    () =>
      anticipateSpecialDayOverlap(existingDays, {
        id: editingId ?? undefined,
        date: values.dateInput,
        scope: values.scope as SpecialDayScope,
        disabled: values.disabled,
      }),
    [existingDays, editingId, values.dateInput, values.scope, values.disabled],
  )

  const overlapMessage = liveOverlapMessage ?? fieldErrors.overlap ?? null

  const scopeItems = useMemo(
    () => Object.fromEntries(SPECIAL_DAY_SCOPE_OPTIONS.map((o) => [o.value, o.label])),
    [],
  )

  const menuGroups = useMemo(() => {
    const map = new Map<string, { categoryName: string; options: FixedMenuPickerOption[] }>()
    for (const option of fixedMenuOptions) {
      const key = option.categoryId || option.categoryName
      const group = map.get(key) ?? { categoryName: option.categoryName, options: [] }
      group.options.push(option)
      map.set(key, group)
    }
    return [...map.values()]
  }, [fixedMenuOptions])

  const showPastWarning = isSpecialDayDateBeforeToday(values.dateInput)
  const firstFixedMenuId = menuGroups[0]?.options[0]?.id

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className="flex flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-4 py-4 text-left">
          <SheetTitle>
            {mode === 'new' ? SPECIAL_DAYS_FORM_NEW_TITLE : specialDayFormEditTitle()}
          </SheetTitle>
          {mode === 'new' ? (
            <p className="text-sm text-muted-foreground">{SPECIAL_DAYS_FORM_NEW_SUBTITLE}</p>
          ) : editDateLabel ? (
            <p className="text-sm text-muted-foreground">{specialDayFormEditSubtitle(editDateLabel)}</p>
          ) : null}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {actionError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{SPECIAL_DAYS_ACTION_ERROR_TITLE}</AlertTitle>
              <AlertDescription>{SPECIAL_DAYS_ACTION_ERROR_DESCRIPTION}</AlertDescription>
            </Alert>
          ) : null}

          <Alert className="mb-4">
            <AlertDescription>{SPECIAL_DAYS_FORM_INFO}</AlertDescription>
          </Alert>

          <FieldGroup>
            <FieldSet>
              <FieldLegend>{SPECIAL_DAYS_FORM_SECTION_WHEN}</FieldLegend>
              <Field>
                <FieldLabel htmlFor={SPECIAL_DAY_FIELD_DOM_IDS.dateInput}>{SPECIAL_DAYS_FORM_DATE}</FieldLabel>
                <Input
                  id={SPECIAL_DAY_FIELD_DOM_IDS.dateInput}
                  type="date"
                  value={values.dateInput}
                  aria-invalid={Boolean(fieldErrors.dateInput)}
                  onChange={(e) => setValues((v) => ({ ...v, dateInput: e.target.value }))}
                />
                <FieldError>{fieldErrors.dateInput}</FieldError>
                {showPastWarning ? (
                  <FieldDescription>{SPECIAL_DAYS_FORM_DATE_PAST_WARNING}</FieldDescription>
                ) : null}
              </Field>

              <Field>
                <FieldLabel htmlFor={SPECIAL_DAY_FIELD_DOM_IDS.scope}>{SPECIAL_DAYS_FORM_SCOPE}</FieldLabel>
                <Select
                  items={scopeItems}
                  value={values.scope || undefined}
                  onValueChange={(value) =>
                    setValues((v) => ({ ...v, scope: (value ?? '') as SpecialDayFormValues['scope'] }))
                  }
                >
                  <SelectTrigger
                    id={SPECIAL_DAY_FIELD_DOM_IDS.scope}
                    className="w-full"
                    aria-invalid={Boolean(fieldErrors.scope || overlapMessage)}
                  >
                    <SelectValue placeholder={SPECIAL_DAYS_FORM_SCOPE_PLACEHOLDER} />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIAL_DAY_SCOPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>{SPECIAL_DAYS_FORM_SCOPE_HINT}</FieldDescription>
                <FieldError>{fieldErrors.scope}</FieldError>
                <FieldError>{overlapMessage}</FieldError>
              </Field>
            </FieldSet>

            <FieldSet>
              <FieldLegend>{SPECIAL_DAYS_FORM_SECTION_MENUS}</FieldLegend>
              {menuGroups.map((group) => (
                <FieldSet key={group.categoryName}>
                  <FieldLegend>{group.categoryName}</FieldLegend>
                  {group.options.map((menu) => {
                    const checked = values.fixedMenuIds.includes(menu.id)
                    const isFirstFixedMenu = menu.id === firstFixedMenuId
                    return (
                      <Field key={menu.id} orientation="horizontal">
                        <Checkbox
                          id={
                            isFirstFixedMenu ? SPECIAL_DAY_FIELD_DOM_IDS.firstFixedMenu : undefined
                          }
                          checked={checked}
                          onCheckedChange={(next) => {
                            setValues((v) => {
                              const ids = new Set(v.fixedMenuIds)
                              if (next) {
                                ids.add(menu.id)
                              } else {
                                ids.delete(menu.id)
                              }
                              return { ...v, fixedMenuIds: [...ids] }
                            })
                          }}
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <span>{menu.name}</span>
                          {menu.specialOnly ? (
                            <Badge variant="outline">{SPECIAL_DAYS_BADGE_SPECIAL_ONLY}</Badge>
                          ) : null}
                          {menu.disabled ? (
                            <Badge variant="outline">{SPECIAL_DAYS_BADGE_MENU_DISABLED}</Badge>
                          ) : null}
                        </div>
                      </Field>
                    )
                  })}
                </FieldSet>
              ))}
              <FieldError>{fieldErrors.fixedMenuIds}</FieldError>
            </FieldSet>

            <FieldSet>
              <FieldLegend>{SPECIAL_DAYS_FORM_SECTION_MESSAGE}</FieldLegend>
              <Field>
                <FieldLabel htmlFor="special-day-message-it">{SPECIAL_DAYS_FORM_SECTION_MESSAGE}</FieldLabel>
                <Textarea
                  id="special-day-message-it"
                  value={values.messageIt}
                  onChange={(e) => setValues((v) => ({ ...v, messageIt: e.target.value }))}
                />
                <FieldDescription>{SPECIAL_DAYS_FORM_MESSAGE_HINT}</FieldDescription>
              </Field>

              <LocalizedTranslationCollapsible
                open={translationOpen}
                onOpenChange={setTranslationOpen}
                hasEnglish={hasEnglishSpecialDayMessage(values)}
              >
                <Field>
                  <FieldLabel htmlFor="special-day-message-en">{SPECIAL_DAYS_FORM_MESSAGE_EN}</FieldLabel>
                  <Textarea
                    id="special-day-message-en"
                    value={values.messageEn}
                    onChange={(e) => setValues((v) => ({ ...v, messageEn: e.target.value }))}
                  />
                  <FieldDescription>{SPECIAL_DAYS_FORM_TRANSLATION_HINT}</FieldDescription>
                </Field>
              </LocalizedTranslationCollapsible>
            </FieldSet>

            <FieldSet>
              <FieldLegend>{SPECIAL_DAYS_FORM_SECTION_STATE}</FieldLegend>
              <Field orientation="horizontal">
                <Switch
                  checked={values.disabled}
                  onCheckedChange={(checked) => setValues((v) => ({ ...v, disabled: checked }))}
                />
                <div>
                  <FieldLabel>{SPECIAL_DAYS_FORM_DISABLED_LABEL}</FieldLabel>
                  <FieldDescription>{SPECIAL_DAYS_FORM_DISABLED_HINT}</FieldDescription>
                </div>
              </Field>
            </FieldSet>
          </FieldGroup>
        </div>

        <SheetFooter className="border-t border-border px-4 py-4">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" size="lg" disabled={saving} onClick={() => onOpenChange(false)}>
              {SPECIAL_DAYS_FORM_CANCEL}
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={saving || Boolean(liveOverlapMessage)}
              onClick={() => onSubmit(values)}
            >
              {saving ? (
                <>
                  <Spinner className="size-4" aria-hidden />
                  {SPECIAL_DAYS_FORM_SAVE_PENDING}
                </>
              ) : (
                SPECIAL_DAYS_FORM_SAVE
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
