'use client'

import { Button, useDocumentForm } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import React, { useCallback, useState } from 'react'

import { mergeItalianPublicHolidays } from '@/lib/systemSettings/italianPublicHolidays'

const ANNUAL_CLOSURES_PATH = 'annualClosures'

/**
 * Precompila `annualClosures` con le 12 festività nazionali dell'anno scelto (fase-7.2).
 * Le righe restano modificabili; le date già presenti non vengono duplicate.
 */
export const AddItalianPublicHolidaysButton: UIFieldClientComponent = () => {
    const { addFieldRow, getDataByPath, setModified } = useDocumentForm()
  const [yearInput, setYearInput] = useState(String(new Date().getFullYear()))

  const handleClick = useCallback(() => {
    const year = Number.parseInt(yearInput, 10)
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      window.alert('Inserisci un anno valido (1900–2100).')
      return
    }

    const existing = getDataByPath(ANNUAL_CLOSURES_PATH) as
      | Array<{ date?: string; label?: string }>
      | undefined
    const merged = mergeItalianPublicHolidays(existing, year)
    const startIndex = existing?.length ?? 0
    const toAdd = merged.slice(startIndex)

    if (toAdd.length === 0) {
      window.alert(`Le festività del ${year} sono già tutte presenti.`)
      return
    }

    toAdd.forEach((row) => {
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

    setModified(true)
  }, [addFieldRow, getDataByPath, setModified, yearInput])

  return (
    <div className="field-type ui" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label" htmlFor="italian-holidays-year">
        Festività nazionali
      </label>
      <p className="field-description" style={{ marginBottom: '0.75rem' }}>
        Aggiunge le 12 festività italiane dell&apos;anno indicato alle chiusure annuali, senza
        duplicare date già presenti.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <input
          className="field-type text__input"
          id="italian-holidays-year"
          inputMode="numeric"
          maxLength={4}
          onChange={(event) => setYearInput(event.target.value)}
          style={{ maxWidth: '6rem' }}
          type="text"
          value={yearInput}
        />
        <Button buttonStyle="secondary" onClick={handleClick} type="button">
          Aggiungi festività
        </Button>
      </div>
    </div>
  )
}
