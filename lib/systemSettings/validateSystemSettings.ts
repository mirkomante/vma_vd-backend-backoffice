import { ValidationError } from 'payload'

import { normalizeAnnualClosureDate } from '@/lib/systemSettings/dayOnlyDate'
import { isValidTimeOfDay } from '@/lib/systemSettings/timeOfDay'

const SERVICE_NAMES = ['lunch', 'dinner'] as const

export type ServiceRow = {
  name?: string | null
  startTime?: string | null
  endTime?: string | null
  id?: string | null
}

export type BnbGroup = {
  checkInTime?: string | null
  checkOutTime?: string | null
}

export type AnnualClosureRow = {
  date?: string | null
  label?: string | null
  id?: string | null
}

export type SystemSettingsWriteData = {
  services?: ServiceRow[] | null
  weeklyClosedDays?: string[] | null
  annualClosures?: AnnualClosureRow[] | null
  bnb?: BnbGroup | null
}

function invalidTimeMessage(fieldLabel: string): string {
  return `${fieldLabel}: formato non valido (usa HH:mm in 24 ore, es. 09:30).`
}

function assertValidTime(value: unknown, fieldLabel: string): void {
  if (value == null || value === '') {
    throw new ValidationError({
      errors: [{ message: `${fieldLabel}: valore obbligatorio.`, path: fieldLabel }],
    })
  }
  if (!isValidTimeOfDay(value)) {
    throw new ValidationError({
      errors: [{ message: invalidTimeMessage(fieldLabel), path: fieldLabel }],
    })
  }
}

function validateServices(services: ServiceRow[] | null | undefined): void {
  if (!services || services.length !== 2) {
    throw new ValidationError({
      errors: [
        {
          message: 'Servizi: servono esattamente due righe (Pranzo e Cena).',
          path: 'services',
        },
      ],
    })
  }

  const names = services.map((row) => row.name)
  if (names.some((name) => !name || !SERVICE_NAMES.includes(name as (typeof SERVICE_NAMES)[number]))) {
    throw new ValidationError({
      errors: [{ message: 'Servizi: ogni riga deve avere nome Pranzo o Cena.', path: 'services' }],
    })
  }

  if (new Set(names).size !== 2) {
    throw new ValidationError({
      errors: [
        {
          message: 'Servizi: Pranzo e Cena devono comparire una sola volta ciascuno.',
          path: 'services',
        },
      ],
    })
  }

  services.forEach((row, index) => {
    assertValidTime(row.startTime, `services.${index}.startTime`)
    assertValidTime(row.endTime, `services.${index}.endTime`)
  })
}

function validateBnb(bnb: BnbGroup | null | undefined): void {
  if (!bnb) {
    return
  }
  if (bnb.checkInTime != null && bnb.checkInTime !== '' && !isValidTimeOfDay(bnb.checkInTime)) {
    throw new ValidationError({
      errors: [{ message: invalidTimeMessage('bnb.checkInTime'), path: 'bnb.checkInTime' }],
    })
  }
  if (bnb.checkOutTime != null && bnb.checkOutTime !== '' && !isValidTimeOfDay(bnb.checkOutTime)) {
    throw new ValidationError({
      errors: [{ message: invalidTimeMessage('bnb.checkOutTime'), path: 'bnb.checkOutTime' }],
    })
  }
}

function normalizeAnnualClosures(
  rows: AnnualClosureRow[] | null | undefined,
): AnnualClosureRow[] | null | undefined {
  if (!rows) {
    return rows
  }
  return rows.map((row) => {
    if (!row.date) {
      return row
    }
    return {
      ...row,
      date: normalizeAnnualClosureDate(row.date),
    }
  })
}

/**
 * Validazione tab Orari e chiusure (fase-7.2). Normalizza le date di chiusura a mezzogiorno UTC.
 */
export function prepareSystemSettingsOrariChiusure(
  incoming: SystemSettingsWriteData,
): SystemSettingsWriteData {
  const result: SystemSettingsWriteData = { ...incoming }

  if (incoming.annualClosures !== undefined) {
    result.annualClosures = normalizeAnnualClosures(incoming.annualClosures)
  }

  if (incoming.services !== undefined) {
    validateServices(incoming.services)
  }

  if (incoming.bnb !== undefined) {
    validateBnb(incoming.bnb)
  }

  return result
}
