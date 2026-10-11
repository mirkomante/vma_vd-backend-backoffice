'use client'

import { CircleAlert, CircleCheck, Info, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  loadHoursSettingsAction,
  saveHoursSettingsAction,
} from '@/app/(app)/app/(shell)/hours/actions'
import { AppFormColumn } from '@/components/app/form/app-form-column'
import { useAppSaveBar } from '@/components/app/shell/save-bar-slot'
import { AnnualClosureRow } from '@/components/app/hours/annual-closure-row'
import {
  ClosureSheetMode,
  HoursClosureSheet,
} from '@/components/app/hours/hours-closure-sheet'
import { HoursSaveBar } from '@/components/app/hours/hours-save-bar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  groupClosuresByYear,
  hoursFormValuesEqual,
  isHolidayYearValid,
  mapLibClosuresToFormRows,
  newClosureClientId,
  sortFormClosures,
  WEEKDAY_ITEMS,
} from '@/lib/app/hours/formModel'
import type { HoursFormValues } from '@/lib/app/hours/types'
import {
  addedHolidaysMessage,
  removedHolidaysMessage,
  removeHolidaysConfirmDescription,
} from '@/lib/app/hours/messages'
import type { HoursFieldKey } from '@/lib/app/hours/types'
import { HOURS_FIELD_DOM_IDS } from '@/lib/app/hours/types'
import {
  firstInvalidHoursField,
  type HoursFieldErrors,
  validateHoursForm,
} from '@/lib/app/hours/validateForm'
import {
  mergeItalianPublicHolidays,
  removeItalianPublicHolidaysForYear,
} from '@/lib/systemSettings/italianPublicHolidays'

type PageNotice =
  | { kind: 'saved' }
  | { kind: 'validation' }
  | { kind: 'server' }
  | { kind: 'info'; title: string; description?: string }
  | { kind: 'holiday-error' }

type HoursFormProps = {
  initialValues: HoursFormValues
  initialLoadError?: boolean
}

export function HoursForm({ initialValues, initialLoadError }: HoursFormProps) {
  const router = useRouter()
  const { setSaveBar } = useAppSaveBar()

  const [loadError, setLoadError] = useState(Boolean(initialLoadError))
  const [savedValues, setSavedValues] = useState(initialValues)
  const [values, setValues] = useState(initialValues)
  const [fieldErrors, setFieldErrors] = useState<HoursFieldErrors>({})
  const [notice, setNotice] = useState<PageNotice | null>(null)
  const [saving, setSaving] = useState(false)
  const [holidayYear, setHolidayYear] = useState(() => String(new Date().getFullYear()))
  const [closureSheet, setClosureSheet] = useState<ClosureSheetMode>({ kind: 'closed' })
  const [removeHolidayYear, setRemoveHolidayYear] = useState<number | null>(null)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  const dirty = useMemo(() => !hoursFormValuesEqual(values, savedValues), [values, savedValues])
  const showNotConfigured = values.servicesNotConfigured && !dirty

  const focusField = useCallback((key: HoursFieldKey) => {
    const id = HOURS_FIELD_DOM_IDS[key]
    const el = document.getElementById(id)
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      el.focus()
    }
  }, [])

  const clearNotice = useCallback(() => setNotice(null), [])

  const handleDiscard = useCallback(() => {
    setValues(savedValues)
    setFieldErrors({})
    setNotice(null)
  }, [savedValues])

  const handleSave = useCallback(async () => {
    clearNotice()
    const errors = validateHoursForm(values)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setNotice({ kind: 'validation' })
      const first = firstInvalidHoursField(errors)
      if (first) {
        focusField(first)
      }
      return
    }

    setFieldErrors({})
    setSaving(true)
    const result = await saveHoursSettingsAction(values)
    setSaving(false)

    if (result.ok) {
      setSavedValues(result.values)
      setValues(result.values)
      setNotice({ kind: 'saved' })
      return
    }

    if (result.error === 'validation' && result.fieldErrors) {
      setFieldErrors(result.fieldErrors)
      setNotice({ kind: 'validation' })
      const first = firstInvalidHoursField(result.fieldErrors)
      if (first) {
        focusField(first)
      }
      return
    }

    setNotice({ kind: 'server' })
  }, [clearNotice, focusField, values])

  const handleRetryLoad = useCallback(async () => {
    setLoadError(false)
    const result = await loadHoursSettingsAction()
    if (!result.ok) {
      setLoadError(true)
      return
    }
    setSavedValues(result.values)
    setValues(result.values)
    setFieldErrors({})
    setNotice(null)
  }, [])

  useEffect(() => {
    setSaveBar(
      dirty || saving ? (
        <HoursSaveBar
          dirty={dirty}
          saving={saving}
          onDiscard={handleDiscard}
          onSave={() => void handleSave()}
        />
      ) : null,
    )
    return () => setSaveBar(null)
  }, [dirty, saving, handleDiscard, handleSave, setSaveBar])

  useEffect(() => {
    if (!dirty) {
      return
    }
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  useEffect(() => {
    if (!dirty) {
      return
    }
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) {
        return
      }
      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) {
        return
      }
      if (anchor.target === '_blank') {
        return
      }
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#')) {
        return
      }
      try {
        const url = new URL(anchor.href, window.location.href)
        if (url.origin !== window.location.origin) {
          return
        }
        if (url.pathname === window.location.pathname) {
          return
        }
      } catch {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      setPendingHref(anchor.href)
      setLeaveOpen(true)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [dirty])

  const applyClosure = (dateIso: string, label: string) => {
    clearNotice()
    if (closureSheet.kind === 'edit') {
      setValues((prev) =>
        sortFormClosures({
          ...prev,
          annualClosures: prev.annualClosures.map((row) =>
            row.clientId === closureSheet.clientId ? { ...row, date: dateIso, label } : row,
          ),
        }),
      )
    } else {
      setValues((prev) =>
        sortFormClosures({
          ...prev,
          annualClosures: [
            ...prev.annualClosures,
            { clientId: newClosureClientId(), date: dateIso, label, payloadId: null },
          ],
        }),
      )
    }
    setClosureSheet({ kind: 'closed' })
  }

  const sheetInitial =
    closureSheet.kind === 'edit'
      ? values.annualClosures.find((r) => r.clientId === closureSheet.clientId)
      : undefined

  const pendingRemoveCount =
    removeHolidayYear != null
      ? removeItalianPublicHolidaysForYear(values.annualClosures, removeHolidayYear).removedCount
      : 0

  if (loadError) {
    return (
      <AppFormColumn>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Orari</h1>
          <p className="text-sm text-muted-foreground">
            Orari di vietnamonamour.com: ristorante e B&amp;B.
          </p>
        </div>
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Impossibile caricare gli orari</AlertTitle>
          <AlertDescription>
            Riprova tra qualche istante; se il problema continua, avvisa l’amministratore.
          </AlertDescription>
          <div className="col-start-2 mt-2">
            <Button type="button" variant="outline" onClick={() => void handleRetryLoad()}>
              Riprova
            </Button>
          </div>
        </Alert>
      </AppFormColumn>
    )
  }

  return (
    <>
      <AppFormColumn>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Orari</h1>
          <p className="text-sm text-muted-foreground">
            Orari di vietnamonamour.com: ristorante e B&amp;B.
          </p>
        </div>

        <div role="status" className="flex flex-col gap-3">
          {notice?.kind === 'saved' ? (
            <Alert>
              <CircleCheck />
              <AlertTitle>Orari salvati</AlertTitle>
            </Alert>
          ) : null}
          {notice?.kind === 'validation' ? (
            <Alert variant="destructive" role="alert">
              <CircleAlert />
              <AlertTitle>Controlla i campi evidenziati</AlertTitle>
              <AlertDescription>
                Alcuni orari non sono validi: non è stato salvato nulla.
              </AlertDescription>
            </Alert>
          ) : null}
          {notice?.kind === 'server' ? (
            <Alert variant="destructive" role="alert">
              <CircleAlert />
              <AlertTitle>Salvataggio non riuscito</AlertTitle>
              <AlertDescription>
                Non è stato salvato nulla. Controlla la connessione e riprova; se il problema
                continua, avvisa l’amministratore.
              </AlertDescription>
            </Alert>
          ) : null}
          {notice?.kind === 'info' ? (
            <Alert>
              <Info />
              <AlertTitle>{notice.title}</AlertTitle>
              {notice.description ? (
                <AlertDescription>{notice.description}</AlertDescription>
              ) : null}
            </Alert>
          ) : null}
          {notice?.kind === 'holiday-error' ? (
            <Alert variant="destructive" role="alert">
              <CircleAlert />
              <AlertTitle>Inserisci un anno valido (1900–2100).</AlertTitle>
            </Alert>
          ) : null}
          {showNotConfigured ? (
            <Alert>
              <Info />
              <AlertTitle>Orari non configurati</AlertTitle>
              <AlertDescription>
                Pranzo e Cena non hanno ancora orari: compila i quattro campi e salva.
              </AlertDescription>
            </Alert>
          ) : null}
        </div>

        <fieldset disabled={saving} aria-busy={saving} className="contents">
          <Card>
            <CardHeader>
              <CardTitle>Servizi del ristorante</CardTitle>
              <CardDescription>
                Orario di inizio e fine di Pranzo e Cena (HH:mm, 24 ore).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend variant="label">Pranzo</FieldLegend>
                  <div className="grid grid-cols-2 gap-3">
                    <Field data-invalid={Boolean(fieldErrors['lunch.startTime'])}>
                      <FieldLabel htmlFor={HOURS_FIELD_DOM_IDS['lunch.startTime']}>Inizio</FieldLabel>
                      <Input
                        id={HOURS_FIELD_DOM_IDS['lunch.startTime']}
                        type="time"
                        step={60}
                        autoComplete="off"
                        aria-invalid={Boolean(fieldErrors['lunch.startTime'])}
                        value={values.lunch.startTime}
                        onChange={(e) => {
                          clearNotice()
                          setValues((v) => ({
                            ...v,
                            lunch: { ...v.lunch, startTime: e.target.value },
                            servicesNotConfigured: false,
                          }))
                        }}
                      />
                      <FieldError>{fieldErrors['lunch.startTime']}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(fieldErrors['lunch.endTime'])}>
                      <FieldLabel htmlFor={HOURS_FIELD_DOM_IDS['lunch.endTime']}>Fine</FieldLabel>
                      <Input
                        id={HOURS_FIELD_DOM_IDS['lunch.endTime']}
                        type="time"
                        step={60}
                        autoComplete="off"
                        aria-invalid={Boolean(fieldErrors['lunch.endTime'])}
                        value={values.lunch.endTime}
                        onChange={(e) => {
                          clearNotice()
                          setValues((v) => ({
                            ...v,
                            lunch: { ...v.lunch, endTime: e.target.value },
                            servicesNotConfigured: false,
                          }))
                        }}
                      />
                      <FieldError>{fieldErrors['lunch.endTime']}</FieldError>
                    </Field>
                  </div>
                </FieldSet>
                <FieldSet>
                  <FieldLegend variant="label">Cena</FieldLegend>
                  <div className="grid grid-cols-2 gap-3">
                    <Field data-invalid={Boolean(fieldErrors['dinner.startTime'])}>
                      <FieldLabel htmlFor={HOURS_FIELD_DOM_IDS['dinner.startTime']}>Inizio</FieldLabel>
                      <Input
                        id={HOURS_FIELD_DOM_IDS['dinner.startTime']}
                        type="time"
                        step={60}
                        autoComplete="off"
                        aria-invalid={Boolean(fieldErrors['dinner.startTime'])}
                        value={values.dinner.startTime}
                        onChange={(e) => {
                          clearNotice()
                          setValues((v) => ({
                            ...v,
                            dinner: { ...v.dinner, startTime: e.target.value },
                            servicesNotConfigured: false,
                          }))
                        }}
                      />
                      <FieldError>{fieldErrors['dinner.startTime']}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(fieldErrors['dinner.endTime'])}>
                      <FieldLabel htmlFor={HOURS_FIELD_DOM_IDS['dinner.endTime']}>Fine</FieldLabel>
                      <Input
                        id={HOURS_FIELD_DOM_IDS['dinner.endTime']}
                        type="time"
                        step={60}
                        autoComplete="off"
                        aria-invalid={Boolean(fieldErrors['dinner.endTime'])}
                        value={values.dinner.endTime}
                        onChange={(e) => {
                          clearNotice()
                          setValues((v) => ({
                            ...v,
                            dinner: { ...v.dinner, endTime: e.target.value },
                            servicesNotConfigured: false,
                          }))
                        }}
                      />
                      <FieldError>{fieldErrors['dinner.endTime']}</FieldError>
                    </Field>
                  </div>
                </FieldSet>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Giorni di riposo settimanali</CardTitle>
              <CardDescription>
                Giorni della settimana in cui il ristorante è chiuso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ToggleGroup
                multiple
                variant="outline"
                spacing={0}
                className="w-full sm:w-fit"
                aria-label="Giorni di riposo settimanali"
                value={values.weeklyClosedDays}
                onValueChange={(next) => {
                  clearNotice()
                  setValues((v) => ({ ...v, weeklyClosedDays: next as typeof v.weeklyClosedDays }))
                }}
              >
                {WEEKDAY_ITEMS.map((day) => (
                  <ToggleGroupItem
                    key={day.value}
                    value={day.value}
                    aria-label={day.aria}
                    className="flex-1 px-0 text-xs sm:w-14 sm:flex-none sm:text-sm"
                  >
                    {day.short}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chiusure annuali</CardTitle>
              <CardDescription>
                Giorni di chiusura eccezionali (festività, ferie, ecc.).
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <FieldSet>
                <FieldLegend variant="label">Festività predefinite</FieldLegend>
                <FieldDescription>
                  13 festività: nazionali e Sant’Ambrogio.
                </FieldDescription>
                <Field className="max-w-40">
                  <FieldLabel htmlFor="hours-holiday-year">Anno</FieldLabel>
                  <Input
                    id="hours-holiday-year"
                    inputMode="numeric"
                    value={holidayYear}
                    onChange={(e) => setHolidayYear(e.target.value)}
                  />
                </Field>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    onClick={() => {
                      clearNotice()
                      if (!isHolidayYearValid(holidayYear)) {
                        setNotice({ kind: 'holiday-error' })
                        return
                      }
                      const year = Number.parseInt(holidayYear, 10)
                      const result = mergeItalianPublicHolidays(values.annualClosures, year)
                      if (result.addedCount === 0) {
                        setNotice({
                          kind: 'info',
                          title: `Le festività del ${year} sono già tutte presenti.`,
                        })
                        return
                      }
                      setValues((v) =>
                        sortFormClosures({
                          ...v,
                          annualClosures: mapLibClosuresToFormRows(v.annualClosures, result.rows),
                        }),
                      )
                      setNotice({
                        kind: 'info',
                        title: addedHolidaysMessage(result.addedCount, year),
                        description: 'Salva le modifiche per renderle effettive.',
                      })
                    }}
                  >
                    Aggiungi festività
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      clearNotice()
                      if (!isHolidayYearValid(holidayYear)) {
                        setNotice({ kind: 'holiday-error' })
                        return
                      }
                      const year = Number.parseInt(holidayYear, 10)
                      const preview = removeItalianPublicHolidaysForYear(values.annualClosures, year)
                      if (preview.removedCount === 0) {
                        setNotice({
                          kind: 'info',
                          title: `Nessuna festività predefinita da rimuovere per il ${year}.`,
                        })
                        return
                      }
                      setRemoveHolidayYear(year)
                    }}
                  >
                    Rimuovi festività di un anno
                  </Button>
                </div>
              </FieldSet>

              <div className="flex flex-col">
                {values.annualClosures.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nessuna chiusura annuale.</p>
                ) : (
                  groupClosuresByYear(values.annualClosures).map(({ year, rows }) => (
                    <div key={year}>
                      <div className="pt-4 pb-1 text-base font-semibold text-foreground">{year}</div>
                      {rows.map((row) => (
                        <AnnualClosureRow
                          key={row.clientId}
                          label={row.label}
                          dateIso={row.date}
                          disabled={saving}
                          onEdit={() => {
                            setClosureSheet({ kind: 'edit', clientId: row.clientId })
                          }}
                          onDelete={() => {
                            clearNotice()
                            setValues((v) => ({
                              ...v,
                              annualClosures: v.annualClosures.filter((r) => r.clientId !== row.clientId),
                            }))
                          }}
                        />
                      ))}
                    </div>
                  ))
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                className="self-start"
                onClick={() => setClosureSheet({ kind: 'create' })}
              >
                <Plus data-icon="inline-start" />
                Aggiungi chiusura
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>B&amp;B (vietnamonamour.com)</CardTitle>
              <CardDescription>
                Orari di check-in e check-out. L’indicazione sulla colazione è contenuto del sito.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={Boolean(fieldErrors['bnb.checkInTime'])}>
                  <FieldLabel htmlFor={HOURS_FIELD_DOM_IDS['bnb.checkInTime']}>Check-in</FieldLabel>
                  <Input
                    id={HOURS_FIELD_DOM_IDS['bnb.checkInTime']}
                    type="time"
                    step={60}
                    autoComplete="off"
                    aria-invalid={Boolean(fieldErrors['bnb.checkInTime'])}
                    value={values.bnb.startTime}
                    onChange={(e) => {
                      clearNotice()
                      setValues((v) => ({
                        ...v,
                        bnb: { ...v.bnb, startTime: e.target.value },
                      }))
                    }}
                  />
                  <FieldError>{fieldErrors['bnb.checkInTime']}</FieldError>
                </Field>
                <Field data-invalid={Boolean(fieldErrors['bnb.checkOutTime'])}>
                  <FieldLabel htmlFor={HOURS_FIELD_DOM_IDS['bnb.checkOutTime']}>Check-out</FieldLabel>
                  <Input
                    id={HOURS_FIELD_DOM_IDS['bnb.checkOutTime']}
                    type="time"
                    step={60}
                    autoComplete="off"
                    aria-invalid={Boolean(fieldErrors['bnb.checkOutTime'])}
                    value={values.bnb.endTime}
                    onChange={(e) => {
                      clearNotice()
                      setValues((v) => ({
                        ...v,
                        bnb: { ...v.bnb, endTime: e.target.value },
                      }))
                    }}
                  />
                  <FieldError>{fieldErrors['bnb.checkOutTime']}</FieldError>
                </Field>
              </div>
            </CardContent>
          </Card>
        </fieldset>
      </AppFormColumn>

      <HoursClosureSheet
        mode={closureSheet}
        initialDate={sheetInitial?.date ?? ''}
        initialLabel={sheetInitial?.label ?? ''}
        disabled={saving}
        onClose={() => setClosureSheet({ kind: 'closed' })}
        onApply={applyClosure}
      />

      <AlertDialog open={removeHolidayYear != null} onOpenChange={(open) => !open && setRemoveHolidayYear(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Rimuovere le festività del {removeHolidayYear}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {removeHolidayYear != null
                ? removeHolidaysConfirmDescription(pendingRemoveCount, removeHolidayYear)
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (removeHolidayYear == null) {
                  return
                }
                const year = removeHolidayYear
                const result = removeItalianPublicHolidaysForYear(values.annualClosures, year)
                setValues((v) =>
                  sortFormClosures({
                    ...v,
                    annualClosures: mapLibClosuresToFormRows(v.annualClosures, result.rows),
                  }),
                )
                setNotice({
                  kind: 'info',
                  title: removedHolidaysMessage(result.removedCount, year),
                  description: 'Salva le modifiche per renderle effettive.',
                })
                setRemoveHolidayYear(null)
              }}
            >
              Rimuovi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Uscire senza salvare?</AlertDialogTitle>
            <AlertDialogDescription>
              Hai modifiche non salvate: se esci le perdi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Resta qui</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setLeaveOpen(false)
                setValues(savedValues)
                setFieldErrors({})
                setNotice(null)
                if (pendingHref) {
                  const url = new URL(pendingHref, window.location.href)
                  router.push(`${url.pathname}${url.search}${url.hash}`)
                }
                setPendingHref(null)
              }}
            >
              Esci senza salvare
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
