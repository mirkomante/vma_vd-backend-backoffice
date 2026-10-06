'use client'

import { Button, ConfirmationModal, toast, useDocumentForm, useModal } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import React, { useCallback, useId, useMemo, useState } from 'react'

import { isAnnualClosureDateKeyInSet, sortAnnualClosuresByDate } from '@/lib/systemSettings/annualClosures'
import {
  mergeItalianPublicHolidays,
  publicHolidayDateKeysForYear,
  type AnnualClosureLike,
} from '@/lib/systemSettings/italianPublicHolidays'
import { reorderAnnualClosuresInForm } from '@/lib/systemSettings/reorderAnnualClosuresInForm'

const ANNUAL_CLOSURES_PATH = 'annualClosures'

function parseYearInput(raw: string): number | null {
  const year = Number.parseInt(raw, 10)
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return null
  }
  return year
}

/**
 * Aggiunge / rimuove festività predefinite su `annualClosures` (solo stato form fino al salvataggio).
 */
export const ItalianPublicHolidaysUi: UIFieldClientComponent = () => {
  const { addFieldRow, getDataByPath, moveFieldRow, removeFieldRow, setModified } =
    useDocumentForm()
  const { openModal } = useModal()
  const componentId = useId()
  const removeModalSlug = useMemo(() => `remove-italian-holidays-${componentId}`, [componentId])

  const [addYearInput, setAddYearInput] = useState(String(new Date().getFullYear()))
  const [removeYearInput, setRemoveYearInput] = useState(String(new Date().getFullYear()))
  const [pendingRemoveCount, setPendingRemoveCount] = useState(0)
  const [pendingRemoveYear, setPendingRemoveYear] = useState<number | null>(null)

  const appendSortedRows = useCallback(
    (rowsToAdd: AnnualClosureLike[]) => {
      const sortedToAdd = sortAnnualClosuresByDate(rowsToAdd)
      sortedToAdd.forEach((row) => {
        addFieldRow({
          path: ANNUAL_CLOSURES_PATH,
          schemaPath: ANNUAL_CLOSURES_PATH,
          subFieldState: {
            date: {
              initialValue: row.date,
              passesCondition: true,
              valid: true,
              value: row.date,
            },
            label: {
              initialValue: row.label,
              passesCondition: true,
              valid: true,
              value: row.label,
            },
          },
        })
      })
      reorderAnnualClosuresInForm(ANNUAL_CLOSURES_PATH, getDataByPath, moveFieldRow)
      setModified(true)
    },
    [addFieldRow, getDataByPath, moveFieldRow, setModified],
  )

  const handleAdd = useCallback(() => {
    const year = parseYearInput(addYearInput)
    if (year === null) {
      window.alert('Inserisci un anno valido (1900–2100).')
      return
    }

    const existing = getDataByPath(ANNUAL_CLOSURES_PATH) as AnnualClosureLike[] | undefined
    const { addedCount, alreadyPresentCount, rows } = mergeItalianPublicHolidays(existing, year)

    if (addedCount === 0) {
      window.alert(`Le festività del ${year} sono già tutte presenti.`)
      return
    }

    const startIndex = existing?.length ?? 0
    appendSortedRows(rows.slice(startIndex))

    toast.success(
      `Aggiunte ${addedCount} festività del ${year} (${alreadyPresentCount} già presenti). Salva per confermare.`,
    )
  }, [addYearInput, appendSortedRows, getDataByPath])

  const countRemovableForYear = useCallback(
    (year: number): number => {
      const rows = (getDataByPath(ANNUAL_CLOSURES_PATH) as AnnualClosureLike[] | undefined) ?? []
      const holidayKeys = publicHolidayDateKeysForYear(year)
      return rows.filter((row) => isAnnualClosureDateKeyInSet(row.date, holidayKeys)).length
    },
    [getDataByPath],
  )

  const handleRemoveRequest = useCallback(() => {
    const year = parseYearInput(removeYearInput)
    if (year === null) {
      window.alert('Inserisci un anno valido (1900–2100).')
      return
    }

    const count = countRemovableForYear(year)
    if (count === 0) {
      toast.info(`Nessuna festività predefinita da rimuovere per il ${year}.`)
      return
    }

    setPendingRemoveCount(count)
    setPendingRemoveYear(year)
    openModal(removeModalSlug)
  }, [countRemovableForYear, openModal, removeModalSlug, removeYearInput])

  const handleRemoveConfirm = useCallback(async () => {
    if (pendingRemoveYear === null) {
      return
    }

    const year = pendingRemoveYear
    const rows = (getDataByPath(ANNUAL_CLOSURES_PATH) as AnnualClosureLike[] | undefined) ?? []
    const holidayKeys = publicHolidayDateKeysForYear(year)

    const indicesToRemove = rows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => isAnnualClosureDateKeyInSet(row.date, holidayKeys))
      .map(({ index }) => index)
      .sort((a, b) => b - a)

    indicesToRemove.forEach((rowIndex) => {
      removeFieldRow({ path: ANNUAL_CLOSURES_PATH, rowIndex })
    })

    reorderAnnualClosuresInForm(ANNUAL_CLOSURES_PATH, getDataByPath, moveFieldRow)
    setModified(true)

    toast.success(
      `Rimosse ${indicesToRemove.length} festività del ${year}. Salva per confermare.`,
    )
  }, [getDataByPath, moveFieldRow, pendingRemoveYear, removeFieldRow, setModified])

  return (
    <div className="field-type ui" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label">Festività predefinite</label>
      <p className="field-description" style={{ marginBottom: '0.75rem' }}>
        13 festività (nazionali e Sant’Ambrogio). Le righe restano modificabili; le chiusure
        personalizzate non coincidono con le date predefinite e non vengono rimosse.
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'flex-end',
          marginBottom: '0.75rem',
        }}
      >
        <div>
          <label className="field-label" htmlFor="italian-holidays-add-year">
            Anno (aggiungi)
          </label>
          <input
            className="field-type text__input"
            id="italian-holidays-add-year"
            inputMode="numeric"
            maxLength={4}
            onChange={(event) => setAddYearInput(event.target.value)}
            style={{ maxWidth: '6rem', display: 'block' }}
            type="text"
            value={addYearInput}
          />
        </div>
        <Button buttonStyle="secondary" onClick={handleAdd} type="button">
          Aggiungi festività
        </Button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
        <div>
          <label className="field-label" htmlFor="italian-holidays-remove-year">
            Anno (rimuovi)
          </label>
          <input
            className="field-type text__input"
            id="italian-holidays-remove-year"
            inputMode="numeric"
            maxLength={4}
            onChange={(event) => setRemoveYearInput(event.target.value)}
            style={{ maxWidth: '6rem', display: 'block' }}
            type="text"
            value={removeYearInput}
          />
        </div>
        <Button buttonStyle="secondary" onClick={handleRemoveRequest} type="button">
          Rimuovi festività di un anno
        </Button>
      </div>

      <ConfirmationModal
        body={
          pendingRemoveCount > 0 && pendingRemoveYear !== null
            ? `Verranno rimosse ${pendingRemoveCount} righe corrispondenti alle festività predefinite del ${pendingRemoveYear}. Le chiusure personalizzate restano.`
            : null
        }
        confirmLabel="Rimuovi"
        heading="Rimuovere festività predefinite?"
        modalSlug={removeModalSlug}
        onConfirm={handleRemoveConfirm}
      />
    </div>
  )
}
