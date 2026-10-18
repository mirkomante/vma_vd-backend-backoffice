'use client'

import { useEffect, useMemo, useState } from 'react'

import { loadWineOriginOptionsAction } from '@/app/(app)/app/(shell)/menu/wines-actions'
import { LocalizedTranslationCollapsible } from '@/components/app/menu/localized-translation-collapsible'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
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
  WINE_FIELD_DOM_IDS,
  hasEnglishWineDescription,
  type WineFieldErrors,
} from '@/lib/app/wines/formModel'
import type { WineFormValues } from '@/lib/app/wines/types'
import { buildSelectItems, optionsFromTaxonomy } from '@/lib/menu/catalog/selectItems'
import {
  WINE_ABV_SELECT_OPTIONS,
  WINE_VOLUME_CANONICAL,
} from '@/lib/menu/formats'
import { applyWineOriginChange, wineOriginCascadeMeta } from '@/lib/menu/wines/wineOriginCascade'
import {
  VINI_ACTION_ERROR_DESCRIPTION,
  VINI_ACTION_ERROR_TITLE,
  VINI_FORM_ABV,
  VINI_FORM_ABV_EMPTY,
  VINI_FORM_APPELLATION,
  VINI_FORM_APPELLATION_NONE,
  VINI_FORM_CANCEL,
  VINI_FORM_CLASSIFICATION,
  VINI_FORM_CLASSIFICATION_HINT,
  VINI_FORM_CLASSIFICATION_NONE,
  VINI_FORM_COUNTRY,
  VINI_FORM_DESCRIPTION,
  VINI_FORM_DESCRIPTION_EN,
  VINI_FORM_DISABLED_DESCRIPTION,
  VINI_FORM_DISABLED_LABEL,
  VINI_FORM_EDIT_TITLE,
  VINI_FORM_FORMAT_HINT,
  VINI_FORM_FORMAT_HINT_SAVED,
  VINI_FORM_GLASS_HINT,
  VINI_FORM_GLASS_PRICE,
  VINI_FORM_NAME,
  VINI_FORM_NEW_SUBTITLE,
  VINI_FORM_NEW_TITLE,
  VINI_FORM_PRICE,
  VINI_FORM_REGION,
  VINI_FORM_REGION_NONE,
  VINI_FORM_SAVE,
  VINI_FORM_SAVE_PENDING,
  VINI_FORM_SELECT_PLACEHOLDER,
  VINI_FORM_TRANSLATION_HINT,
  VINI_FORM_TYPE,
  VINI_FORM_VOLUME,
  VINI_FORM_VOLUME_EMPTY,
  VINI_FORM_WINERY,
  VINI_FORM_YEAR,
  VINI_FORM_YEAR_NV,
} from '@/lib/menu/wines/copy'

type WineFormSheetProps = {
  open: boolean
  mode: 'new' | 'edit'
  editName?: string
  initialValues: WineFormValues
  wineTypes: TaxonomyOption[]
  saving: boolean
  actionError: boolean
  fieldErrors: WineFieldErrors
  onOpenChange: (open: boolean) => void
  onSubmit: (values: WineFormValues) => void
}

export function WineFormSheet({
  open,
  mode,
  editName,
  initialValues,
  wineTypes,
  saving,
  actionError,
  fieldErrors,
  onOpenChange,
  onSubmit,
}: WineFormSheetProps) {
  const isMobile = useIsMobile()
  const [values, setValues] = useState(initialValues)
  const [translationOpen, setTranslationOpen] = useState(() => hasEnglishWineDescription(initialValues))
  const [originOptions, setOriginOptions] = useState({
    countries: [] as TaxonomyOption[],
    regions: [] as TaxonomyOption[],
    appellations: [] as TaxonomyOption[],
    classifications: [] as TaxonomyOption[],
  })

  useEffect(() => {
    if (!open) {
      return
    }
    let cancelled = false
    void loadWineOriginOptionsAction({
      countryId: values.countryId || undefined,
      regionId: values.regionId || undefined,
      savedCountryId: initialValues.countryId,
      savedRegionId: initialValues.regionId,
      savedAppellationId: initialValues.appellationId,
      savedClassificationId: initialValues.classificationId,
    }).then((opts) => {
      if (!cancelled) {
        setOriginOptions(opts)
      }
    })
    return () => {
      cancelled = true
    }
  }, [
    open,
    values.countryId,
    values.regionId,
    values.appellationId,
    values.classificationId,
    initialValues.countryId,
    initialValues.regionId,
    initialValues.appellationId,
    initialValues.classificationId,
  ])

  const cascade = wineOriginCascadeMeta(
    values.countryId,
    values.regionId,
    originOptions.regions.length,
    originOptions.appellations.length,
    originOptions.classifications.length,
  )

  const typeItems = useMemo(
    () => Object.fromEntries(wineTypes.map((t) => [t.id, t.name])),
    [wineTypes],
  )
  const countryItems = useMemo(
    () =>
      buildSelectItems(
        optionsFromTaxonomy(originOptions.countries),
        initialValues.countryId,
        initialValues.savedCountryName,
      ),
    [originOptions.countries, initialValues.countryId, initialValues.savedCountryName],
  )
  const regionItems = useMemo(
    () =>
      buildSelectItems(
        optionsFromTaxonomy(originOptions.regions),
        initialValues.regionId,
        initialValues.savedRegionName,
      ),
    [originOptions.regions, initialValues.regionId, initialValues.savedRegionName],
  )
  const appellationItems = useMemo(
    () =>
      buildSelectItems(
        optionsFromTaxonomy(originOptions.appellations),
        initialValues.appellationId,
        initialValues.savedAppellationName,
      ),
    [
      originOptions.appellations,
      initialValues.appellationId,
      initialValues.savedAppellationName,
    ],
  )
  const classificationItems = useMemo(
    () =>
      buildSelectItems(
        optionsFromTaxonomy(originOptions.classifications),
        initialValues.classificationId,
        initialValues.savedClassificationName,
      ),
    [
      originOptions.classifications,
      initialValues.classificationId,
      initialValues.savedClassificationName,
    ],
  )

  const volumeItems = useMemo(() => {
    const base: Record<string, string> = { '': VINI_FORM_VOLUME_EMPTY }
    for (const v of WINE_VOLUME_CANONICAL) {
      base[v] = v
    }
    if (values.volume && !base[values.volume]) {
      base[values.volume] = values.volume
    }
    return base
  }, [values.volume])

  const abvItems = useMemo(() => {
    const base: Record<string, string> = { '': VINI_FORM_ABV_EMPTY }
    for (const v of WINE_ABV_SELECT_OPTIONS) {
      base[v] = v
    }
    if (values.abv && !base[values.abv]) {
      base[values.abv] = values.abv
    }
    return base
  }, [values.abv])

  const setOrigin = (field: 'countryId' | 'regionId' | 'appellationId' | 'classificationId', v: string) => {
    const origin = applyWineOriginChange(
      {
        countryId: values.countryId,
        regionId: values.regionId,
        appellationId: values.appellationId,
        classificationId: values.classificationId,
      },
      field,
      v === '__empty__' ? '' : v,
    )
    setValues((prev) => ({ ...prev, ...origin }))
  }

  const hasSavedFormat =
    Boolean(values.formatSnapshot?.volume) ||
    Boolean(values.formatSnapshot?.abv) ||
    (values.formatSnapshot?.year && values.formatSnapshot.year !== 'NV')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? 'bottom' : 'right'} className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{mode === 'new' ? VINI_FORM_NEW_TITLE : VINI_FORM_EDIT_TITLE}</SheetTitle>
          {mode === 'new' ? (
            <p className="text-sm text-muted-foreground">{VINI_FORM_NEW_SUBTITLE}</p>
          ) : editName ? (
            <p className="text-sm text-muted-foreground">{editName}</p>
          ) : null}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {actionError ? (
            <Alert variant="destructive" role="alert" className="mb-4">
              <AlertTitle>{VINI_ACTION_ERROR_TITLE}</AlertTitle>
              <AlertDescription>{VINI_ACTION_ERROR_DESCRIPTION}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <FieldSet>
              <FieldLegend>Dati</FieldLegend>
              <Field>
                <FieldLabel htmlFor={WINE_FIELD_DOM_IDS.name}>{VINI_FORM_NAME}</FieldLabel>
                <Input
                  id={WINE_FIELD_DOM_IDS.name}
                  value={values.name}
                  aria-invalid={Boolean(fieldErrors.name)}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                />
                <FieldError>{fieldErrors.name}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="wine-field-winery">{VINI_FORM_WINERY}</FieldLabel>
                <Input
                  id="wine-field-winery"
                  value={values.winery}
                  onChange={(e) => setValues((v) => ({ ...v, winery: e.target.value }))}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={WINE_FIELD_DOM_IDS.year}>{VINI_FORM_YEAR}</FieldLabel>
                <Input
                  id={WINE_FIELD_DOM_IDS.year}
                  inputMode="numeric"
                  disabled={values.yearNv}
                  value={values.yearInput}
                  aria-invalid={Boolean(fieldErrors.year)}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      yearInput: e.target.value.replace(/\D/g, '').slice(0, 4),
                    }))
                  }
                />
                <div className="mt-2 flex items-center gap-2">
                  <Checkbox
                    id="wine-field-year-nv"
                    checked={values.yearNv}
                    onCheckedChange={(checked) =>
                      setValues((v) => ({
                        ...v,
                        yearNv: checked === true,
                        yearInput: checked === true ? '' : v.yearInput,
                      }))
                    }
                  />
                  <FieldLabel htmlFor="wine-field-year-nv">{VINI_FORM_YEAR_NV}</FieldLabel>
                </div>
                <FieldError>{fieldErrors.year}</FieldError>
              </Field>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="wine-field-volume">{VINI_FORM_VOLUME}</FieldLabel>
                  <Select
                    items={volumeItems}
                    value={values.volume || undefined}
                    onValueChange={(v) => setValues((s) => ({ ...s, volume: v ?? '' }))}
                  >
                    <SelectTrigger id="wine-field-volume" className="w-full">
                      <SelectValue placeholder={VINI_FORM_SELECT_PLACEHOLDER} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(volumeItems).map(([val, label]) => (
                        <SelectItem key={val || 'empty'} value={val || '__empty__'}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="wine-field-abv">{VINI_FORM_ABV}</FieldLabel>
                  <Select
                    items={abvItems}
                    value={values.abv || undefined}
                    onValueChange={(v) => setValues((s) => ({ ...s, abv: v ?? '' }))}
                  >
                    <SelectTrigger id="wine-field-abv" className="w-full">
                      <SelectValue placeholder={VINI_FORM_SELECT_PLACEHOLDER} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(abvItems).map(([val, label]) => (
                        <SelectItem key={val || 'empty'} value={val || '__empty__'}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <FieldDescription>
                {VINI_FORM_FORMAT_HINT}
                {hasSavedFormat ? ` ${VINI_FORM_FORMAT_HINT_SAVED}` : ''}
              </FieldDescription>
              <Field>
                <FieldLabel htmlFor="wine-field-description">{VINI_FORM_DESCRIPTION}</FieldLabel>
                <Textarea
                  id="wine-field-description"
                  value={values.descriptionIt}
                  onChange={(e) => setValues((v) => ({ ...v, descriptionIt: e.target.value }))}
                />
              </Field>
              <LocalizedTranslationCollapsible
                open={translationOpen}
                onOpenChange={setTranslationOpen}
                hasEnglish={hasEnglishWineDescription(values)}
              >
                <p className="mb-3 text-sm text-muted-foreground">{VINI_FORM_TRANSLATION_HINT}</p>
                <Field>
                  <FieldLabel htmlFor="wine-field-description-en">{VINI_FORM_DESCRIPTION_EN}</FieldLabel>
                  <Textarea
                    id="wine-field-description-en"
                    value={values.descriptionEn}
                    onChange={(e) => setValues((v) => ({ ...v, descriptionEn: e.target.value }))}
                  />
                </Field>
              </LocalizedTranslationCollapsible>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Origine</FieldLegend>
              <Field>
                <FieldLabel htmlFor={WINE_FIELD_DOM_IDS.typeId}>{VINI_FORM_TYPE}</FieldLabel>
                <Select
                  items={typeItems}
                  value={values.typeId || undefined}
                  onValueChange={(v) => setValues((s) => ({ ...s, typeId: v ?? '' }))}
                >
                  <SelectTrigger
                    id={WINE_FIELD_DOM_IDS.typeId}
                    className="w-full"
                    aria-invalid={Boolean(fieldErrors.typeId)}
                  >
                    <SelectValue placeholder={VINI_FORM_SELECT_PLACEHOLDER} />
                  </SelectTrigger>
                  <SelectContent>
                    {wineTypes.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{fieldErrors.typeId}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor={WINE_FIELD_DOM_IDS.countryId}>{VINI_FORM_COUNTRY}</FieldLabel>
                <Select
                  items={countryItems}
                  value={values.countryId || undefined}
                  onValueChange={(v) => setOrigin('countryId', v ?? '')}
                >
                  <SelectTrigger
                    id={WINE_FIELD_DOM_IDS.countryId}
                    className="w-full"
                    aria-invalid={Boolean(fieldErrors.countryId)}
                  >
                    <SelectValue placeholder={VINI_FORM_SELECT_PLACEHOLDER}>
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
              <Field>
                <FieldLabel htmlFor={WINE_FIELD_DOM_IDS.region}>{VINI_FORM_REGION}</FieldLabel>
                <Select
                  items={regionItems}
                  value={values.regionId || undefined}
                  disabled={cascade.regionDisabled}
                  onValueChange={(v) => setOrigin('regionId', v ?? '__empty__')}
                >
                  <SelectTrigger
                    id={WINE_FIELD_DOM_IDS.region}
                    className="w-full"
                    aria-invalid={Boolean(fieldErrors.region)}
                  >
                    <SelectValue placeholder={cascade.regionPlaceholder}>
                      {values.regionId ? regionItems[values.regionId] : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty__">{VINI_FORM_REGION_NONE}</SelectItem>
                    {Object.entries(regionItems).map(([id, label]) => (
                      <SelectItem key={id} value={id}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{fieldErrors.region}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor={WINE_FIELD_DOM_IDS.appellation}>{VINI_FORM_APPELLATION}</FieldLabel>
                <Select
                  items={appellationItems}
                  value={values.appellationId || undefined}
                  disabled={cascade.appellationDisabled}
                  onValueChange={(v) => setOrigin('appellationId', v ?? '__empty__')}
                >
                  <SelectTrigger
                    id={WINE_FIELD_DOM_IDS.appellation}
                    className="w-full"
                    aria-invalid={Boolean(fieldErrors.appellation)}
                  >
                    <SelectValue placeholder={cascade.appellationPlaceholder}>
                      {values.appellationId ? appellationItems[values.appellationId] : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty__">{VINI_FORM_APPELLATION_NONE}</SelectItem>
                    {Object.entries(appellationItems).map(([id, label]) => (
                      <SelectItem key={id} value={id}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{fieldErrors.appellation}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="wine-field-classification">{VINI_FORM_CLASSIFICATION}</FieldLabel>
                <Select
                  items={classificationItems}
                  value={values.classificationId || undefined}
                  disabled={cascade.classificationDisabled}
                  onValueChange={(v) => setOrigin('classificationId', v ?? '__empty__')}
                >
                  <SelectTrigger id="wine-field-classification" className="w-full">
                    <SelectValue placeholder={cascade.classificationPlaceholder}>
                      {values.classificationId ? classificationItems[values.classificationId] : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty__">{VINI_FORM_CLASSIFICATION_NONE}</SelectItem>
                    {Object.entries(classificationItems).map(([id, label]) => (
                      <SelectItem key={id} value={id}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>{VINI_FORM_CLASSIFICATION_HINT}</FieldDescription>
              </Field>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Prezzi</FieldLegend>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor={WINE_FIELD_DOM_IDS.price}>{VINI_FORM_PRICE}</FieldLabel>
                  <Input
                    id={WINE_FIELD_DOM_IDS.price}
                    inputMode="decimal"
                    value={values.priceInput}
                    aria-invalid={Boolean(fieldErrors.price)}
                    onChange={(e) => setValues((v) => ({ ...v, priceInput: e.target.value }))}
                  />
                  <FieldError>{fieldErrors.price}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor={WINE_FIELD_DOM_IDS.glassPrice}>{VINI_FORM_GLASS_PRICE}</FieldLabel>
                  <Input
                    id={WINE_FIELD_DOM_IDS.glassPrice}
                    inputMode="decimal"
                    value={values.glassPriceInput}
                    aria-invalid={Boolean(fieldErrors.glassPrice)}
                    onChange={(e) => setValues((v) => ({ ...v, glassPriceInput: e.target.value }))}
                  />
                  <FieldDescription>{VINI_FORM_GLASS_HINT}</FieldDescription>
                  <FieldError>{fieldErrors.glassPrice}</FieldError>
                </Field>
              </div>
            </FieldSet>

            <FieldSet>
              <FieldLegend>Disponibilità</FieldLegend>
              <Field>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <FieldLabel htmlFor="wine-field-disabled">{VINI_FORM_DISABLED_LABEL}</FieldLabel>
                    <FieldDescription>{VINI_FORM_DISABLED_DESCRIPTION}</FieldDescription>
                  </div>
                  <Switch
                    id="wine-field-disabled"
                    checked={values.disabled}
                    onCheckedChange={(checked) => setValues((v) => ({ ...v, disabled: checked }))}
                  />
                </div>
              </Field>
            </FieldSet>
          </FieldGroup>
        </div>

        <SheetFooter className="flex-row gap-2">
          <Button type="button" variant="outline" size="lg" className="flex-1" disabled={saving} onClick={() => onOpenChange(false)}>
            {VINI_FORM_CANCEL}
          </Button>
          <Button type="button" size="lg" className="flex-1" disabled={saving} onClick={() => onSubmit(values)}>
            {saving ? <Spinner className="size-4" aria-hidden /> : null}
            {saving ? VINI_FORM_SAVE_PENDING : VINI_FORM_SAVE}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
