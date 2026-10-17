import type { ServiceHoursRow } from '@/lib/menu/availability/serviceBoundaries'
import {
  nextServiceStartBoundaryAfter,
  romeCalendarDateFromInstant,
} from '@/lib/menu/availability/serviceBoundaries'

function serviceOpeningPhrase(service: 'lunch' | 'dinner', romeDate: string, referenceRomeDate: string): string {
  const tomorrow = romeDate > referenceRomeDate
  if (service === 'dinner') {
    return tomorrow ? 'della cena di domani' : 'della cena'
  }
  return tomorrow ? 'del pranzo di domani' : 'del pranzo'
}

/** Riga sotto il badge «Terminato»: «fino all’apertura …»; null se orari assenti. */
export function formatSoldOutExpiryLine(
  now: Date,
  services: ServiceHoursRow[],
): string | null {
  const boundary = nextServiceStartBoundaryAfter(now, services)
  if (!boundary) {
    return null
  }
  const referenceDate = romeCalendarDateFromInstant(now)
  const phrase = serviceOpeningPhrase(boundary.service, boundary.romeDate, referenceDate)
  return `fino all’apertura ${phrase}`
}

/** Descrizione interruttore nel modulo quando gli orari sono configurati. */
export function formatSoldOutSwitchDescription(
  now: Date,
  services: ServiceHoursRow[],
): string {
  const line = formatSoldOutExpiryLine(now, services)
  if (!line) {
    return 'Temporaneo: si azzera da solo all’inizio del servizio successivo.'
  }
  const opening = line.replace(/^fino all’apertura /, '')
  return `Temporaneo: si azzera da solo all’apertura ${opening}.`
}

/** Seconda frase dell’avviso dopo «terminato». */
export function formatSoldOutToastExpiry(now: Date, services: ServiceHoursRow[]): string | null {
  const boundary = nextServiceStartBoundaryAfter(now, services)
  if (!boundary) {
    return null
  }
  const referenceDate = romeCalendarDateFromInstant(now)
  const phrase = serviceOpeningPhrase(boundary.service, boundary.romeDate, referenceDate)
  return `Torna disponibile da solo all’apertura ${phrase}.`
}
