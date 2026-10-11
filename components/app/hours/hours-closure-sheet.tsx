'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { dateInputValueToIso, isoToDateInputValue } from '@/lib/app/hours/formModel'

export type ClosureSheetMode =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; clientId: string }

type HoursClosureSheetProps = {
  mode: ClosureSheetMode
  initialDate: string
  initialLabel: string
  disabled?: boolean
  onClose: () => void
  onApply: (dateIso: string, label: string) => void
}

type ClosureSheetFormProps = {
  initialDate: string
  initialLabel: string
  disabled?: boolean
  onClose: () => void
  onApply: (dateIso: string, label: string) => void
  side: 'bottom' | 'right'
  title: string
}

function ClosureSheetForm({
  initialDate,
  initialLabel,
  disabled,
  onClose,
  onApply,
  side,
  title,
}: ClosureSheetFormProps) {
  const [dateValue, setDateValue] = useState(() =>
    initialDate ? isoToDateInputValue(initialDate) : '',
  )
  const [label, setLabel] = useState(initialLabel)
  const canApply = dateValue.trim() !== '' && label.trim() !== ''

  return (
    <Sheet open onOpenChange={(next) => !next && onClose()}>
      <SheetContent side={side} className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Poi premi «Salva modifiche» nella pagina per renderla effettiva.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <Field>
            <FieldLabel htmlFor="hours-closure-date">Data</FieldLabel>
            <Input
              id="hours-closure-date"
              type="date"
              value={dateValue}
              disabled={disabled}
              onChange={(e) => setDateValue(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="hours-closure-label">Etichetta</FieldLabel>
            <Input
              id="hours-closure-label"
              value={label}
              disabled={disabled}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Field>
        </div>
        <SheetFooter className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            disabled={disabled || !canApply}
            onClick={() => {
              try {
                const iso = dateInputValueToIso(dateValue)
                onApply(iso, label.trim())
              } catch {
                // Il controllo nativo della data dovrebbe impedire valori non validi
              }
            }}
          >
            Applica
          </Button>
          <Button type="button" variant="outline" disabled={disabled} onClick={onClose}>
            Annulla
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function HoursClosureSheet({
  mode,
  initialDate,
  initialLabel,
  disabled,
  onClose,
  onApply,
}: HoursClosureSheetProps) {
  const isMobile = useIsMobile()
  if (mode.kind === 'closed') {
    return null
  }

  const sheetKey =
    mode.kind === 'edit' ? `edit-${mode.clientId}` : `create-${initialDate}-${initialLabel}`
  const title = mode.kind === 'edit' ? 'Modifica chiusura' : 'Nuova chiusura'

  return (
    <ClosureSheetForm
      key={sheetKey}
      initialDate={initialDate}
      initialLabel={initialLabel}
      disabled={disabled}
      onClose={onClose}
      onApply={onApply}
      side={isMobile ? 'bottom' : 'right'}
      title={title}
    />
  )
}
