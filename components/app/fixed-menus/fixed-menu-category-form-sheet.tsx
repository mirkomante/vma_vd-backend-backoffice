'use client'

import { useState } from 'react'

import { LocalizedTranslationCollapsible } from '@/components/app/menu/localized-translation-collapsible'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
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
import { useIsMobile } from '@/hooks/use-mobile'
import {
  FIXED_MENU_CATEGORY_FIELD_DOM_IDS,
  hasEnglishFixedMenuCategoryName,
  type FixedMenuCategoryFieldErrors,
} from '@/lib/app/fixedMenus/categoryFormModel'
import type { FixedMenuCategoryFormValues } from '@/lib/app/fixedMenus/types'
import {
  MENU_FISSI_ACTION_ERROR_DESCRIPTION,
  MENU_FISSI_ACTION_ERROR_TITLE,
  MENU_FISSI_CATEGORY_FORM_DISABLED_DESCRIPTION,
  MENU_FISSI_CATEGORY_FORM_DISABLED_LABEL,
  MENU_FISSI_CATEGORY_FORM_EDIT_TITLE,
  MENU_FISSI_CATEGORY_FORM_NAME,
  MENU_FISSI_CATEGORY_FORM_NAME_EN,
  MENU_FISSI_CATEGORY_FORM_NAME_EN_PLACEHOLDER,
  MENU_FISSI_CATEGORY_FORM_NEW_SUBTITLE,
  MENU_FISSI_CATEGORY_FORM_NEW_TITLE,
  MENU_FISSI_CATEGORY_FORM_TRANSLATION_HINT,
  MENU_FISSI_CATEGORY_FORM_VISIBILITY_DESCRIPTION,
  MENU_FISSI_COLUMN_VISIBILITY,
  MENU_FISSI_FORM_CANCEL,
  MENU_FISSI_FORM_SAVE,
  MENU_FISSI_FORM_SAVE_PENDING,
} from '@/lib/menu/fixed-menus/copy'
import { MENU_VISIBILITY_OPTIONS } from '@/lib/menu/visibilityField'

const visibilityItems = Object.fromEntries(
  MENU_VISIBILITY_OPTIONS.map((o) => [o.value, o.label]),
)

type FixedMenuCategoryFormSheetProps = {
  open: boolean
  mode: 'new' | 'edit'
  editName?: string
  initialValues: FixedMenuCategoryFormValues
  saving: boolean
  actionError: boolean
  fieldErrors: FixedMenuCategoryFieldErrors
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FixedMenuCategoryFormValues) => void
}

export function FixedMenuCategoryFormSheet({
  open,
  mode,
  editName,
  initialValues,
  saving,
  actionError,
  fieldErrors,
  onOpenChange,
  onSubmit,
}: FixedMenuCategoryFormSheetProps) {
  const isMobile = useIsMobile()
  const [values, setValues] = useState(initialValues)
  const [translationOpen, setTranslationOpen] = useState(() =>
    hasEnglishFixedMenuCategoryName(initialValues),
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className="flex flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-4 py-4 text-left">
          <SheetTitle>
            {mode === 'new'
              ? MENU_FISSI_CATEGORY_FORM_NEW_TITLE
              : `${MENU_FISSI_CATEGORY_FORM_EDIT_TITLE} (${editName})`}
          </SheetTitle>
          {mode === 'new' ? (
            <p className="text-sm text-muted-foreground">{MENU_FISSI_CATEGORY_FORM_NEW_SUBTITLE}</p>
          ) : null}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {actionError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{MENU_FISSI_ACTION_ERROR_TITLE}</AlertTitle>
              <AlertDescription>{MENU_FISSI_ACTION_ERROR_DESCRIPTION}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={FIXED_MENU_CATEGORY_FIELD_DOM_IDS.name}>
                {MENU_FISSI_CATEGORY_FORM_NAME}
              </FieldLabel>
              <Input
                id={FIXED_MENU_CATEGORY_FIELD_DOM_IDS.name}
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                aria-invalid={Boolean(fieldErrors.name)}
              />
              <FieldError>{fieldErrors.name}</FieldError>
            </Field>

            <LocalizedTranslationCollapsible
              open={translationOpen}
              onOpenChange={setTranslationOpen}
              hasEnglish={hasEnglishFixedMenuCategoryName(values)}
            >
              <Field>
                <FieldLabel htmlFor={FIXED_MENU_CATEGORY_FIELD_DOM_IDS.nameEn}>
                  {MENU_FISSI_CATEGORY_FORM_NAME_EN}
                </FieldLabel>
                <Input
                  id={FIXED_MENU_CATEGORY_FIELD_DOM_IDS.nameEn}
                  value={values.nameEn}
                  placeholder={values.name.trim() || MENU_FISSI_CATEGORY_FORM_NAME_EN_PLACEHOLDER}
                  onChange={(e) => setValues((v) => ({ ...v, nameEn: e.target.value }))}
                />
                <FieldDescription>{MENU_FISSI_CATEGORY_FORM_TRANSLATION_HINT}</FieldDescription>
              </Field>
            </LocalizedTranslationCollapsible>

            <Field>
              <FieldLabel htmlFor={FIXED_MENU_CATEGORY_FIELD_DOM_IDS.visibility}>
                {MENU_FISSI_COLUMN_VISIBILITY}
              </FieldLabel>
              <Select
                items={visibilityItems}
                value={values.visibility}
                onValueChange={(value) =>
                  setValues((v) => ({
                    ...v,
                    visibility: (value ?? 'always') as FixedMenuCategoryFormValues['visibility'],
                  }))
                }
              >
                <SelectTrigger id={FIXED_MENU_CATEGORY_FIELD_DOM_IDS.visibility} className="w-full">
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
              <FieldDescription>{MENU_FISSI_CATEGORY_FORM_VISIBILITY_DESCRIPTION}</FieldDescription>
            </Field>

            <Field orientation="horizontal">
              <Switch
                checked={values.disabled}
                onCheckedChange={(checked) => setValues((v) => ({ ...v, disabled: checked }))}
              />
              <div>
                <FieldLabel>{MENU_FISSI_CATEGORY_FORM_DISABLED_LABEL}</FieldLabel>
                <FieldDescription>{MENU_FISSI_CATEGORY_FORM_DISABLED_DESCRIPTION}</FieldDescription>
              </div>
            </Field>
          </FieldGroup>
        </div>

        <SheetFooter className="border-t border-border px-4 py-4">
          <Button type="button" variant="outline" size="lg" disabled={saving} onClick={() => onOpenChange(false)}>
            {MENU_FISSI_FORM_CANCEL}
          </Button>
          <Button type="button" size="lg" disabled={saving} onClick={() => onSubmit(values)}>
            {saving ? <Spinner className="size-4" aria-hidden /> : null}
            {saving ? MENU_FISSI_FORM_SAVE_PENDING : MENU_FISSI_FORM_SAVE}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
