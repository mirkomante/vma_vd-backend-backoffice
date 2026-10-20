'use client'

import { useMemo, useState } from 'react'

import { OptionalSelectField } from '@/components/app/menu/catalog/optional-select-field'
import { LocalizedTranslationCollapsible } from '@/components/app/menu/localized-translation-collapsible'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
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
import type { TaxonomyOption } from '@/lib/app/dishes/loadDishesPageContext'
import {
  SPIRIT_FIELD_DOM_IDS,
  hasEnglishSpiritDescription,
  type SpiritFieldErrors,
} from '@/lib/app/spirits/formModel'
import type { SpiritFormValues } from '@/lib/app/spirits/types'
import { buildSelectItems, optionsFromTaxonomy } from '@/lib/menu/catalog/selectItems'
import { SPIRIT_ABV_SELECT_OPTIONS, SPIRIT_AGING_SELECT_OPTIONS } from '@/lib/menu/formats'
import {
  DISTILLATI_ACTION_ERROR_DESCRIPTION,
  DISTILLATI_ACTION_ERROR_TITLE,
  DISTILLATI_FORM_ABV,
  DISTILLATI_FORM_ABV_EMPTY,
  DISTILLATI_FORM_AGING,
  DISTILLATI_FORM_AGING_EMPTY,
  DISTILLATI_FORM_CANCEL,
  DISTILLATI_FORM_COUNTRY,
  DISTILLATI_FORM_DESCRIPTION,
  DISTILLATI_FORM_DESCRIPTION_EN,
  DISTILLATI_FORM_DISABLED_DESCRIPTION,
  DISTILLATI_FORM_DISABLED_LABEL,
  DISTILLATI_FORM_EDIT_TITLE,
  DISTILLATI_FORM_FORMAT_HINT,
  DISTILLATI_FORM_FORMAT_HINT_SAVED,
  DISTILLATI_FORM_NAME,
  DISTILLATI_FORM_NEW_SUBTITLE,
  DISTILLATI_FORM_NEW_TITLE,
  DISTILLATI_FORM_PRICE,
  DISTILLATI_FORM_PRICE_HINT,
  DISTILLATI_FORM_SAVE,
  DISTILLATI_FORM_SAVE_PENDING,
  DISTILLATI_FORM_SELECT_PLACEHOLDER,
  DISTILLATI_FORM_TRANSLATION_HINT,
  DISTILLATI_FORM_TYPE,
} from '@/lib/menu/spirits/copy'

type SpiritFormSheetProps = {
  open: boolean
  mode: 'new' | 'edit'
  editName?: string
  initialValues: SpiritFormValues
  spiritTypes: TaxonomyOption[]
  countries: TaxonomyOption[]
  saving: boolean
  actionError: boolean
  fieldErrors: SpiritFieldErrors
  onOpenChange: (open: boolean) => void
  onSubmit: (values: SpiritFormValues) => void
}

export function SpiritFormSheet({
  open,
  mode,
  editName,
  initialValues,
  spiritTypes,
  countries,
  saving,
  actionError,
  fieldErrors,
  onOpenChange,
  onSubmit,
}: SpiritFormSheetProps) {
  const isMobile = useIsMobile()
  const [values, setValues] = useState(initialValues)
  const [translationOpen, setTranslationOpen] = useState(() =>
    hasEnglishSpiritDescription(initialValues),
  )

  const typeItems = useMemo(
    () => Object.fromEntries(spiritTypes.map((t) => [t.id, t.name])),
    [spiritTypes],
  )
  const countryItems = useMemo(
    () =>
      buildSelectItems(
        optionsFromTaxonomy(countries),
        initialValues.countryId,
        initialValues.savedCountryName,
      ),
    [countries, initialValues.countryId, initialValues.savedCountryName],
  )
  const agingItems = useMemo(
    () => ({
      '': DISTILLATI_FORM_AGING_EMPTY,
      ...buildSelectItems(
        SPIRIT_AGING_SELECT_OPTIONS.map((v) => ({ id: v, label: v })),
        values.aging,
      ),
    }),
    [values.aging],
  )
  const abvItems = useMemo(
    () => ({
      '': DISTILLATI_FORM_ABV_EMPTY,
      ...buildSelectItems(
        SPIRIT_ABV_SELECT_OPTIONS.map((v) => ({ id: v, label: v })),
        values.abv,
      ),
    }),
    [values.abv],
  )

  const formatHint = values.formatSnapshot?.abv || values.formatSnapshot?.aging
    ? `${DISTILLATI_FORM_FORMAT_HINT} ${DISTILLATI_FORM_FORMAT_HINT_SAVED}`
    : DISTILLATI_FORM_FORMAT_HINT

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className="flex flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-4 py-4 text-left">
          <SheetTitle>
            {mode === 'new' ? DISTILLATI_FORM_NEW_TITLE : DISTILLATI_FORM_EDIT_TITLE}
          </SheetTitle>
          {mode === 'new' ? (
            <p className="text-sm text-muted-foreground">{DISTILLATI_FORM_NEW_SUBTITLE}</p>
          ) : editName ? (
            <p className="text-sm text-muted-foreground">{editName}</p>
          ) : null}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {actionError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{DISTILLATI_ACTION_ERROR_TITLE}</AlertTitle>
              <AlertDescription>{DISTILLATI_ACTION_ERROR_DESCRIPTION}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <FieldSet>
              <FieldLegend>Dati</FieldLegend>
              <Field>
                <FieldLabel htmlFor={SPIRIT_FIELD_DOM_IDS.name}>{DISTILLATI_FORM_NAME}</FieldLabel>
                <Input
                  id={SPIRIT_FIELD_DOM_IDS.name}
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                <FieldError>{fieldErrors.name}</FieldError>
              </Field>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <OptionalSelectField
                  id={SPIRIT_FIELD_DOM_IDS.aging}
                  label={DISTILLATI_FORM_AGING}
                  items={agingItems}
                  value={values.aging}
                  onChange={(aging) => setValues((s) => ({ ...s, aging }))}
                  placeholder={DISTILLATI_FORM_SELECT_PLACEHOLDER}
                  error={fieldErrors.aging}
                />
                <OptionalSelectField
                  id={SPIRIT_FIELD_DOM_IDS.abv}
                  label={DISTILLATI_FORM_ABV}
                  items={abvItems}
                  value={values.abv}
                  onChange={(abv) => setValues((s) => ({ ...s, abv }))}
                  placeholder={DISTILLATI_FORM_SELECT_PLACEHOLDER}
                  error={fieldErrors.abv}
                />
              </div>
              <FieldDescription>{formatHint}</FieldDescription>

              <Field>
                <FieldLabel htmlFor="spirit-field-description">{DISTILLATI_FORM_DESCRIPTION}</FieldLabel>
                <Textarea
                  id="spirit-field-description"
                  value={values.descriptionIt}
                  onChange={(e) => setValues((v) => ({ ...v, descriptionIt: e.target.value }))}
                />
              </Field>

              <LocalizedTranslationCollapsible
                open={translationOpen}
                onOpenChange={setTranslationOpen}
                hasEnglish={hasEnglishSpiritDescription(values)}
              >
                <p className="mb-3 text-sm text-muted-foreground">{DISTILLATI_FORM_TRANSLATION_HINT}</p>
                <Field>
                  <FieldLabel htmlFor="spirit-field-description-en">{DISTILLATI_FORM_DESCRIPTION_EN}</FieldLabel>
                  <Textarea
                    id="spirit-field-description-en"
                    value={values.descriptionEn}
                    onChange={(e) => setValues((v) => ({ ...v, descriptionEn: e.target.value }))}
                  />
                </Field>
              </LocalizedTranslationCollapsible>

              <Field>
                <FieldLabel htmlFor={SPIRIT_FIELD_DOM_IDS.typeId}>{DISTILLATI_FORM_TYPE}</FieldLabel>
                <Select
                  items={typeItems}
                  value={values.typeId || undefined}
                  onValueChange={(v) => setValues((s) => ({ ...s, typeId: v ?? '' }))}
                >
                  <SelectTrigger id={SPIRIT_FIELD_DOM_IDS.typeId} className="w-full">
                    <SelectValue placeholder={DISTILLATI_FORM_SELECT_PLACEHOLDER} />
                  </SelectTrigger>
                  <SelectContent>
                    {spiritTypes.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{fieldErrors.typeId}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor={SPIRIT_FIELD_DOM_IDS.countryId}>{DISTILLATI_FORM_COUNTRY}</FieldLabel>
                <Select
                  items={countryItems}
                  value={values.countryId || undefined}
                  onValueChange={(v) => setValues((s) => ({ ...s, countryId: v ?? '' }))}
                >
                  <SelectTrigger id={SPIRIT_FIELD_DOM_IDS.countryId} className="w-full">
                    <SelectValue placeholder={DISTILLATI_FORM_SELECT_PLACEHOLDER}>
                      {values.countryId ? countryItems[values.countryId] : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(countryItems).map(([id, label]) => (
                      <SelectItem key={id} value={id}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{fieldErrors.countryId}</FieldError>
              </Field>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Prezzo</FieldLegend>
              <Field>
                <FieldLabel htmlFor={SPIRIT_FIELD_DOM_IDS.price}>{DISTILLATI_FORM_PRICE}</FieldLabel>
                <Input
                  id={SPIRIT_FIELD_DOM_IDS.price}
                  inputMode="decimal"
                  value={values.priceInput}
                  onChange={(e) => setValues((v) => ({ ...v, priceInput: e.target.value }))}
                  aria-invalid={Boolean(fieldErrors.price)}
                />
                <FieldDescription>{DISTILLATI_FORM_PRICE_HINT}</FieldDescription>
                <FieldError>{fieldErrors.price}</FieldError>
              </Field>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Disponibilità</FieldLegend>
              <Field orientation="horizontal">
                <Switch
                  id="spirit-field-disabled"
                  checked={values.disabled}
                  onCheckedChange={(checked) => setValues((v) => ({ ...v, disabled: checked }))}
                />
                <div>
                  <FieldLabel htmlFor="spirit-field-disabled">{DISTILLATI_FORM_DISABLED_LABEL}</FieldLabel>
                  <FieldDescription>{DISTILLATI_FORM_DISABLED_DESCRIPTION}</FieldDescription>
                </div>
              </Field>
            </FieldSet>
          </FieldGroup>
        </div>

        <SheetFooter className="flex-row gap-2 border-t border-border px-4 py-4">
          <Button type="button" size="lg" className="flex-1" disabled={saving} onClick={() => onSubmit(values)}>
            {saving ? <Spinner className="size-4" aria-hidden /> : null}
            {saving ? DISTILLATI_FORM_SAVE_PENDING : DISTILLATI_FORM_SAVE}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={saving}
            onClick={() => onOpenChange(false)}
          >
            {DISTILLATI_FORM_CANCEL}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
