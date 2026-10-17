'use client'

import { useState } from 'react'

import { LocalizedTranslationCollapsible } from '@/components/app/menu/localized-translation-collapsible'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useIsMobile } from '@/hooks/use-mobile'
import type { TaxonomyOption } from '@/lib/app/dishes/loadDishesPageContext'
import {
  DISH_FIELD_DOM_IDS,
  hasEnglishTranslation,
  type DishFieldErrors,
} from '@/lib/app/dishes/formModel'
import type { DishFormValues } from '@/lib/app/dishes/types'
import {
  PIATTI_ACTION_ERROR_DESCRIPTION,
  PIATTI_ACTION_ERROR_TITLE,
  PIATTI_FORM_ALLERGENS_HINT,
  PIATTI_FORM_ALLERGENS_SELECTED_PREFIX,
  PIATTI_FORM_CANCEL,
  PIATTI_FORM_CATEGORY,
  PIATTI_FORM_CATEGORY_PLACEHOLDER,
  PIATTI_FORM_DAIRY_FREE,
  PIATTI_FORM_DESCRIPTION,
  PIATTI_FORM_DESCRIPTION_EN,
  PIATTI_FORM_DISABLED_DESCRIPTION,
  PIATTI_FORM_DISABLED_LABEL,
  PIATTI_FORM_EGG_FREE,
  PIATTI_FORM_EDIT_TITLE,
  PIATTI_FORM_GLUTEN_FREE,
  PIATTI_FORM_NAME,
  PIATTI_FORM_NAME_EN,
  PIATTI_FORM_NEW_SUBTITLE,
  PIATTI_FORM_NEW_TITLE,
  PIATTI_FORM_PRICE,
  PIATTI_FORM_SAVE,
  PIATTI_FORM_SAVE_PENDING,
  PIATTI_FORM_SOLD_OUT_LABEL,
  PIATTI_FORM_TRANSLATION_HINT,
  PIATTI_FORM_VEGAN,
} from '@/lib/menu/dishes/copy'
import { formatSoldOutSwitchDescription } from '@/lib/menu/dishes/soldOutExpiryText'
import type { ServiceHoursRow } from '@/lib/menu/availability/serviceBoundaries'

type DishFormSheetProps = {
  open: boolean
  mode: 'new' | 'edit'
  editName?: string
  initialValues: DishFormValues
  categories: TaxonomyOption[]
  allergens: TaxonomyOption[]
  serviceHours: ServiceHoursRow[]
  now: Date
  saving: boolean
  actionError: boolean
  fieldErrors: DishFieldErrors
  onOpenChange: (open: boolean) => void
  onSubmit: (values: DishFormValues) => void
  onFieldErrorsChange?: (errors: DishFieldErrors) => void
}

export function DishFormSheet({
  open,
  mode,
  editName,
  initialValues,
  categories,
  allergens,
  serviceHours,
  now,
  saving,
  actionError,
  fieldErrors,
  onOpenChange,
  onSubmit,
}: DishFormSheetProps) {
  const isMobile = useIsMobile()
  const [values, setValues] = useState(initialValues)
  const [translationOpen, setTranslationOpen] = useState(
    () => hasEnglishTranslation(initialValues),
  )

  const soldOutDescription = formatSoldOutSwitchDescription(now, serviceHours)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{mode === 'new' ? PIATTI_FORM_NEW_TITLE : PIATTI_FORM_EDIT_TITLE}</SheetTitle>
          {mode === 'new' ? (
            <p className="text-sm text-muted-foreground">{PIATTI_FORM_NEW_SUBTITLE}</p>
          ) : editName ? (
            <p className="text-sm text-muted-foreground">{editName}</p>
          ) : null}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {actionError ? (
            <Alert variant="destructive" role="alert" className="mb-4">
              <AlertTitle>{PIATTI_ACTION_ERROR_TITLE}</AlertTitle>
              <AlertDescription>{PIATTI_ACTION_ERROR_DESCRIPTION}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={DISH_FIELD_DOM_IDS.name}>{PIATTI_FORM_NAME}</FieldLabel>
              <Input
                id={DISH_FIELD_DOM_IDS.name}
                value={values.nameIt}
                aria-invalid={Boolean(fieldErrors.name)}
                onChange={(e) => setValues((v) => ({ ...v, nameIt: e.target.value }))}
              />
              <FieldError>{fieldErrors.name}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor={DISH_FIELD_DOM_IDS.description}>{PIATTI_FORM_DESCRIPTION}</FieldLabel>
              <Textarea
                id={DISH_FIELD_DOM_IDS.description}
                value={values.descriptionIt}
                onChange={(e) => setValues((v) => ({ ...v, descriptionIt: e.target.value }))}
              />
            </Field>

            <LocalizedTranslationCollapsible
              open={translationOpen}
              onOpenChange={setTranslationOpen}
              hasEnglish={hasEnglishTranslation(values)}
            >
              <p className="mb-3 text-sm text-muted-foreground">{PIATTI_FORM_TRANSLATION_HINT}</p>
              <Field>
                <FieldLabel htmlFor="dish-field-name-en">{PIATTI_FORM_NAME_EN}</FieldLabel>
                <Input
                  id="dish-field-name-en"
                  value={values.nameEn}
                  placeholder={values.nameIt}
                  onChange={(e) => setValues((v) => ({ ...v, nameEn: e.target.value }))}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="dish-field-description-en">{PIATTI_FORM_DESCRIPTION_EN}</FieldLabel>
                <Textarea
                  id="dish-field-description-en"
                  value={values.descriptionEn}
                  onChange={(e) => setValues((v) => ({ ...v, descriptionEn: e.target.value }))}
                />
              </Field>
            </LocalizedTranslationCollapsible>

            <Field>
              <FieldLabel htmlFor={DISH_FIELD_DOM_IDS.price}>{PIATTI_FORM_PRICE}</FieldLabel>
              <Input
                id={DISH_FIELD_DOM_IDS.price}
                inputMode="decimal"
                value={values.priceInput}
                aria-invalid={Boolean(fieldErrors.price)}
                onChange={(e) => setValues((v) => ({ ...v, priceInput: e.target.value }))}
              />
              <FieldError>{fieldErrors.price}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor={DISH_FIELD_DOM_IDS.categoryId}>{PIATTI_FORM_CATEGORY}</FieldLabel>
              <Select
                value={values.categoryId || undefined}
                onValueChange={(value) => setValues((v) => ({ ...v, categoryId: value ?? '' }))}
              >
                <SelectTrigger
                  id={DISH_FIELD_DOM_IDS.categoryId}
                  aria-invalid={Boolean(fieldErrors.categoryId)}
                >
                  <SelectValue placeholder={PIATTI_FORM_CATEGORY_PLACEHOLDER} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{fieldErrors.categoryId}</FieldError>
            </Field>

            <Field>
              <FieldLabel>{PIATTI_FORM_ALLERGENS_HINT}</FieldLabel>
              <p className="text-sm text-muted-foreground">
                {PIATTI_FORM_ALLERGENS_SELECTED_PREFIX}
                {values.allergenIds.length}.
              </p>
              <ToggleGroup
                multiple
                value={values.allergenIds}
                onValueChange={(next) =>
                  setValues((v) => ({ ...v, allergenIds: [...(next as string[])] }))
                }
                className="flex flex-wrap justify-start gap-2"
              >
                {allergens.map((a) => (
                  <ToggleGroupItem key={a.id} value={a.id} className="text-xs">
                    {a.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>

            <FieldSet>
              <FieldLabel>Caratteristiche</FieldLabel>
              <div className="flex flex-col gap-2">
                <Field orientation="horizontal">
                  <Checkbox
                    id="dish-gluten-free"
                    checked={values.glutenFree}
                    onCheckedChange={(c) => setValues((v) => ({ ...v, glutenFree: Boolean(c) }))}
                  />
                  <FieldLabel htmlFor="dish-gluten-free">{PIATTI_FORM_GLUTEN_FREE}</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    id="dish-dairy-free"
                    checked={values.dairyFree}
                    onCheckedChange={(c) => setValues((v) => ({ ...v, dairyFree: Boolean(c) }))}
                  />
                  <FieldLabel htmlFor="dish-dairy-free">{PIATTI_FORM_DAIRY_FREE}</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    id="dish-vegan"
                    checked={values.vegan}
                    onCheckedChange={(c) => setValues((v) => ({ ...v, vegan: Boolean(c) }))}
                  />
                  <FieldLabel htmlFor="dish-vegan">{PIATTI_FORM_VEGAN}</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    id="dish-egg-free"
                    checked={values.eggFree}
                    onCheckedChange={(c) => setValues((v) => ({ ...v, eggFree: Boolean(c) }))}
                  />
                  <FieldLabel htmlFor="dish-egg-free">{PIATTI_FORM_EGG_FREE}</FieldLabel>
                </Field>
              </div>
            </FieldSet>

            <FieldSet>
              <FieldLabel>Disponibilità</FieldLabel>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{PIATTI_FORM_SOLD_OUT_LABEL}</p>
                    <p className="text-xs text-muted-foreground">{soldOutDescription}</p>
                  </div>
                  <Switch
                    checked={values.soldOut}
                    disabled={values.disabled}
                    onCheckedChange={(checked) => setValues((v) => ({ ...v, soldOut: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{PIATTI_FORM_DISABLED_LABEL}</p>
                    <p className="text-xs text-muted-foreground">{PIATTI_FORM_DISABLED_DESCRIPTION}</p>
                  </div>
                  <Switch
                    checked={values.disabled}
                    onCheckedChange={(checked) =>
                      setValues((v) => ({
                        ...v,
                        disabled: checked,
                        soldOut: checked ? false : v.soldOut,
                      }))
                    }
                  />
                </div>
              </div>
            </FieldSet>
          </FieldGroup>
        </div>

        <SheetFooter className="flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={saving}
            onClick={() => onOpenChange(false)}
          >
            {PIATTI_FORM_CANCEL}
          </Button>
          <Button
            type="button"
            size="lg"
            className="flex-1"
            disabled={saving}
            onClick={() => onSubmit(values)}
          >
            {saving ? <Spinner className="size-4" aria-hidden /> : null}
            {saving ? PIATTI_FORM_SAVE_PENDING : PIATTI_FORM_SAVE}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
