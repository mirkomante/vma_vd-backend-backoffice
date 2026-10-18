'use client'

import { useMemo, useState } from 'react'

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
  DRINK_FIELD_DOM_IDS,
  hasEnglishDrinkFields,
  type DrinkFieldErrors,
} from '@/lib/app/drinks/formModel'
import type { DrinkFormValues } from '@/lib/app/drinks/types'
import { buildSelectItems, optionsFromTaxonomy } from '@/lib/menu/catalog/selectItems'
import { DRINK_ABV_SELECT_OPTIONS, DRINK_VOLUME_SELECT_OPTIONS } from '@/lib/menu/formats'
import {
  BEVANDE_ACTION_ERROR_DESCRIPTION,
  BEVANDE_ACTION_ERROR_TITLE,
  BEVANDE_FORM_ABV,
  BEVANDE_FORM_ABV_EMPTY,
  BEVANDE_FORM_CANCEL,
  BEVANDE_FORM_COUNTRY,
  BEVANDE_FORM_COUNTRY_NONE,
  BEVANDE_FORM_COUNTRY_OPTIONAL,
  BEVANDE_FORM_DESCRIPTION,
  BEVANDE_FORM_DESCRIPTION_EN,
  BEVANDE_FORM_DISABLED_DESCRIPTION,
  BEVANDE_FORM_DISABLED_LABEL,
  BEVANDE_FORM_EDIT_TITLE,
  BEVANDE_FORM_FORMAT_HINT,
  BEVANDE_FORM_FORMAT_HINT_SAVED,
  BEVANDE_FORM_NAME,
  BEVANDE_FORM_NAME_EN,
  BEVANDE_FORM_NEW_SUBTITLE,
  BEVANDE_FORM_NEW_TITLE,
  BEVANDE_FORM_PRICE,
  BEVANDE_FORM_SAVE,
  BEVANDE_FORM_SAVE_PENDING,
  BEVANDE_FORM_SELECT_PLACEHOLDER,
  BEVANDE_FORM_TRANSLATION_HINT,
  BEVANDE_FORM_TYPE,
  BEVANDE_FORM_VOLUME,
  BEVANDE_FORM_VOLUME_EMPTY,
} from '@/lib/menu/drinks/copy'

const EMPTY_SELECT = '__empty__'
const NO_COUNTRY = '__no_country__'

type DrinkFormSheetProps = {
  open: boolean
  mode: 'new' | 'edit'
  editName?: string
  initialValues: DrinkFormValues
  drinkTypes: TaxonomyOption[]
  countries: TaxonomyOption[]
  saving: boolean
  actionError: boolean
  fieldErrors: DrinkFieldErrors
  onOpenChange: (open: boolean) => void
  onSubmit: (values: DrinkFormValues) => void
}

export function DrinkFormSheet({
  open,
  mode,
  editName,
  initialValues,
  drinkTypes,
  countries,
  saving,
  actionError,
  fieldErrors,
  onOpenChange,
  onSubmit,
}: DrinkFormSheetProps) {
  const isMobile = useIsMobile()
  const [values, setValues] = useState(initialValues)
  const [translationOpen, setTranslationOpen] = useState(() => hasEnglishDrinkFields(initialValues))

  const typeItems = useMemo(
    () => Object.fromEntries(drinkTypes.map((t) => [t.id, t.name])),
    [drinkTypes],
  )
  const countryItems = useMemo(
    () => buildSelectItems(optionsFromTaxonomy(countries), values.countryId),
    [countries, values.countryId],
  )
  const volumeItems = useMemo(
    () => buildSelectItems(
      DRINK_VOLUME_SELECT_OPTIONS.map((v) => ({ id: v, label: v })),
      values.volume,
    ),
    [values.volume],
  )
  const abvItems = useMemo(
    () => buildSelectItems(
      DRINK_ABV_SELECT_OPTIONS.map((v) => ({ id: v, label: v })),
      values.abv,
    ),
    [values.abv],
  )

  const formatHint =
    values.formatSnapshot?.volume || values.formatSnapshot?.abv
      ? `${BEVANDE_FORM_FORMAT_HINT} ${BEVANDE_FORM_FORMAT_HINT_SAVED}`
      : BEVANDE_FORM_FORMAT_HINT

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className="flex flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-4 py-4 text-left">
          <SheetTitle>
            {mode === 'new' ? BEVANDE_FORM_NEW_TITLE : `${BEVANDE_FORM_EDIT_TITLE} (${editName})`}
          </SheetTitle>
          {mode === 'new' ? (
            <p className="text-sm text-muted-foreground">{BEVANDE_FORM_NEW_SUBTITLE}</p>
          ) : null}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {actionError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{BEVANDE_ACTION_ERROR_TITLE}</AlertTitle>
              <AlertDescription>{BEVANDE_ACTION_ERROR_DESCRIPTION}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <FieldSet>
              <FieldLegend>Dati</FieldLegend>
              <Field>
                <FieldLabel htmlFor={DRINK_FIELD_DOM_IDS.name}>{BEVANDE_FORM_NAME}</FieldLabel>
                <Input
                  id={DRINK_FIELD_DOM_IDS.name}
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                <FieldError>{fieldErrors.name}</FieldError>
              </Field>

              <Field>
                <FieldLabel>{BEVANDE_FORM_VOLUME}</FieldLabel>
                <Select
                  items={volumeItems}
                  value={values.volume || EMPTY_SELECT}
                  onValueChange={(v) =>
                    setValues((s) => ({ ...s, volume: v === EMPTY_SELECT ? '' : (v ?? '') }))
                  }
                >
                  <SelectTrigger id={DRINK_FIELD_DOM_IDS.volume} className="w-full">
                    <SelectValue placeholder={BEVANDE_FORM_SELECT_PLACEHOLDER} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EMPTY_SELECT}>{BEVANDE_FORM_VOLUME_EMPTY}</SelectItem>
                    {DRINK_VOLUME_SELECT_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                    {values.volume &&
                    !DRINK_VOLUME_SELECT_OPTIONS.includes(
                      values.volume as typeof DRINK_VOLUME_SELECT_OPTIONS[number],
                    ) ? (
                      <SelectItem value={values.volume}>{values.volume}</SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
                <FieldError>{fieldErrors.volume}</FieldError>
              </Field>

              <Field>
                <FieldLabel>{BEVANDE_FORM_ABV}</FieldLabel>
                <Select
                  items={abvItems}
                  value={values.abv || EMPTY_SELECT}
                  onValueChange={(v) =>
                    setValues((s) => ({ ...s, abv: v === EMPTY_SELECT ? '' : (v ?? '') }))
                  }
                >
                  <SelectTrigger id={DRINK_FIELD_DOM_IDS.abv} className="w-full">
                    <SelectValue placeholder={BEVANDE_FORM_SELECT_PLACEHOLDER} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EMPTY_SELECT}>{BEVANDE_FORM_ABV_EMPTY}</SelectItem>
                    {DRINK_ABV_SELECT_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                    {values.abv && !DRINK_ABV_SELECT_OPTIONS.includes(values.abv) ? (
                      <SelectItem value={values.abv}>{values.abv}</SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
                <FieldDescription>{formatHint}</FieldDescription>
                <FieldError>{fieldErrors.abv}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="drink-field-description">{BEVANDE_FORM_DESCRIPTION}</FieldLabel>
                <Textarea
                  id="drink-field-description"
                  value={values.descriptionIt}
                  onChange={(e) => setValues((v) => ({ ...v, descriptionIt: e.target.value }))}
                />
              </Field>

              <LocalizedTranslationCollapsible
                open={translationOpen}
                onOpenChange={setTranslationOpen}
                hasEnglish={hasEnglishDrinkFields(values)}
              >
                <p className="mb-3 text-sm text-muted-foreground">{BEVANDE_FORM_TRANSLATION_HINT}</p>
                <Field>
                  <FieldLabel htmlFor="drink-field-name-en">{BEVANDE_FORM_NAME_EN}</FieldLabel>
                  <Input
                    id="drink-field-name-en"
                    placeholder={values.name}
                    value={values.nameEn}
                    onChange={(e) => setValues((v) => ({ ...v, nameEn: e.target.value }))}
                  />
                </Field>
                <Field className="mt-3">
                  <FieldLabel htmlFor="drink-field-description-en">{BEVANDE_FORM_DESCRIPTION_EN}</FieldLabel>
                  <Textarea
                    id="drink-field-description-en"
                    value={values.descriptionEn}
                    onChange={(e) => setValues((v) => ({ ...v, descriptionEn: e.target.value }))}
                  />
                </Field>
              </LocalizedTranslationCollapsible>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Tipologia e paese</FieldLegend>
              <Field>
                <FieldLabel htmlFor={DRINK_FIELD_DOM_IDS.typeId}>{BEVANDE_FORM_TYPE}</FieldLabel>
                <Select
                  items={typeItems}
                  value={values.typeId || undefined}
                  onValueChange={(v) => setValues((s) => ({ ...s, typeId: v ?? '' }))}
                >
                  <SelectTrigger id={DRINK_FIELD_DOM_IDS.typeId} className="w-full">
                    <SelectValue placeholder={BEVANDE_FORM_SELECT_PLACEHOLDER} />
                  </SelectTrigger>
                  <SelectContent>
                    {drinkTypes.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{fieldErrors.typeId}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="drink-field-country">{BEVANDE_FORM_COUNTRY}</FieldLabel>
                <Select
                  items={countryItems}
                  value={values.countryId || NO_COUNTRY}
                  onValueChange={(v) =>
                    setValues((s) => ({
                      ...s,
                      countryId: v === NO_COUNTRY ? '' : (v ?? ''),
                    }))
                  }
                >
                  <SelectTrigger id="drink-field-country" className="w-full">
                    <SelectValue placeholder={BEVANDE_FORM_COUNTRY_OPTIONAL} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_COUNTRY}>{BEVANDE_FORM_COUNTRY_NONE}</SelectItem>
                    {countries.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Prezzo</FieldLegend>
              <Field>
                <FieldLabel htmlFor={DRINK_FIELD_DOM_IDS.price}>{BEVANDE_FORM_PRICE}</FieldLabel>
                <Input
                  id={DRINK_FIELD_DOM_IDS.price}
                  inputMode="decimal"
                  value={values.priceInput}
                  onChange={(e) => setValues((v) => ({ ...v, priceInput: e.target.value }))}
                  aria-invalid={Boolean(fieldErrors.price)}
                />
                <FieldError>{fieldErrors.price}</FieldError>
              </Field>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Disponibilità</FieldLegend>
              <Field orientation="horizontal">
                <Switch
                  id="drink-field-disabled"
                  checked={values.disabled}
                  onCheckedChange={(checked) => setValues((v) => ({ ...v, disabled: checked }))}
                />
                <div>
                  <FieldLabel htmlFor="drink-field-disabled">{BEVANDE_FORM_DISABLED_LABEL}</FieldLabel>
                  <FieldDescription>{BEVANDE_FORM_DISABLED_DESCRIPTION}</FieldDescription>
                </div>
              </Field>
            </FieldSet>
          </FieldGroup>
        </div>

        <SheetFooter className="border-t border-border px-4 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {BEVANDE_FORM_CANCEL}
          </Button>
          <Button type="button" disabled={saving} onClick={() => onSubmit(values)}>
            {saving ? (
              <>
                <Spinner className="mr-2" />
                {BEVANDE_FORM_SAVE_PENDING}
              </>
            ) : (
              BEVANDE_FORM_SAVE
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
