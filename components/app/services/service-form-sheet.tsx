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
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  SERVICE_FIELD_DOM_IDS,
  hasEnglishServiceName,
  type ServiceFieldErrors,
} from '@/lib/app/services/formModel'
import type { ServiceFormValues } from '@/lib/app/services/types'
import {
  SERVIZI_ACTION_ERROR_DESCRIPTION,
  SERVIZI_ACTION_ERROR_TITLE,
  SERVIZI_FORM_CANCEL,
  SERVIZI_FORM_DISABLED_DESCRIPTION,
  SERVIZI_FORM_DISABLED_LABEL,
  SERVIZI_FORM_EDIT_TITLE,
  SERVIZI_FORM_NAME,
  SERVIZI_FORM_NAME_EN,
  SERVIZI_FORM_NAME_EN_PLACEHOLDER,
  SERVIZI_FORM_NEW_SUBTITLE,
  SERVIZI_FORM_NEW_TITLE,
  SERVIZI_FORM_PRICE,
  SERVIZI_FORM_SAVE,
  SERVIZI_FORM_SAVE_PENDING,
  SERVIZI_FORM_TRANSLATION_HINT,
} from '@/lib/menu/services/copy'

type ServiceFormSheetProps = {
  open: boolean
  mode: 'new' | 'edit'
  editName?: string
  initialValues: ServiceFormValues
  saving: boolean
  actionError: boolean
  fieldErrors: ServiceFieldErrors
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ServiceFormValues) => void
}

export function ServiceFormSheet({
  open,
  mode,
  editName,
  initialValues,
  saving,
  actionError,
  fieldErrors,
  onOpenChange,
  onSubmit,
}: ServiceFormSheetProps) {
  const isMobile = useIsMobile()
  const [values, setValues] = useState(initialValues)
  const [translationOpen, setTranslationOpen] = useState(() => hasEnglishServiceName(initialValues))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className="flex flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-4 py-4 text-left">
          <SheetTitle>
            {mode === 'new' ? SERVIZI_FORM_NEW_TITLE : `${SERVIZI_FORM_EDIT_TITLE} (${editName})`}
          </SheetTitle>
          {mode === 'new' ? (
            <p className="text-sm text-muted-foreground">{SERVIZI_FORM_NEW_SUBTITLE}</p>
          ) : null}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {actionError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{SERVIZI_ACTION_ERROR_TITLE}</AlertTitle>
              <AlertDescription>{SERVIZI_ACTION_ERROR_DESCRIPTION}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={SERVICE_FIELD_DOM_IDS.name}>{SERVIZI_FORM_NAME}</FieldLabel>
              <Input
                id={SERVICE_FIELD_DOM_IDS.name}
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                aria-invalid={Boolean(fieldErrors.name)}
              />
              <FieldError>{fieldErrors.name}</FieldError>
            </Field>

            <LocalizedTranslationCollapsible
              open={translationOpen}
              onOpenChange={setTranslationOpen}
              hasEnglish={hasEnglishServiceName(values)}
            >
              <Field>
                <FieldLabel htmlFor={SERVICE_FIELD_DOM_IDS.nameEn}>{SERVIZI_FORM_NAME_EN}</FieldLabel>
                <Input
                  id={SERVICE_FIELD_DOM_IDS.nameEn}
                  value={values.nameEn}
                  placeholder={values.name.trim() || SERVIZI_FORM_NAME_EN_PLACEHOLDER}
                  onChange={(e) => setValues((v) => ({ ...v, nameEn: e.target.value }))}
                />
                <FieldDescription>{SERVIZI_FORM_TRANSLATION_HINT}</FieldDescription>
              </Field>
            </LocalizedTranslationCollapsible>

            <Field>
              <FieldLabel htmlFor={SERVICE_FIELD_DOM_IDS.price}>{SERVIZI_FORM_PRICE}</FieldLabel>
              <Input
                id={SERVICE_FIELD_DOM_IDS.price}
                value={values.priceInput}
                onChange={(e) => setValues((v) => ({ ...v, priceInput: e.target.value }))}
                aria-invalid={Boolean(fieldErrors.price)}
                inputMode="decimal"
              />
              <FieldError>{fieldErrors.price}</FieldError>
            </Field>

            <Field>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <FieldLabel htmlFor="service-field-disabled">{SERVIZI_FORM_DISABLED_LABEL}</FieldLabel>
                  <FieldDescription>{SERVIZI_FORM_DISABLED_DESCRIPTION}</FieldDescription>
                </div>
                <Switch
                  id="service-field-disabled"
                  checked={values.disabled}
                  onCheckedChange={(checked) => setValues((v) => ({ ...v, disabled: checked }))}
                />
              </div>
            </Field>
          </FieldGroup>
        </div>

        <SheetFooter className="border-t border-border px-4 py-4">
          <Button type="button" variant="outline" size="lg" disabled={saving} onClick={() => onOpenChange(false)}>
            {SERVIZI_FORM_CANCEL}
          </Button>
          <Button
            type="button"
            size="lg"
            disabled={saving}
            onClick={() => onSubmit(values)}
          >
            {saving ? <Spinner className="size-4" aria-hidden /> : null}
            {saving ? SERVIZI_FORM_SAVE_PENDING : SERVIZI_FORM_SAVE}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
