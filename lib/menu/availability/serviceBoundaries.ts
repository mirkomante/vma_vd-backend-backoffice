import type { ServiceName } from '@/lib/systemSettings/serviceOptions'

import { SERVICE_BOUNDARY_LOOKBACK_DAYS } from './constants'
import type { ServiceBoundaryKey } from './types'

const ROME_TZ = 'Europe/Rome'

const romeDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: ROME_TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const romePartsFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: ROME_TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function romeCalendarDateFromInstant(instant: Date): string {
  return romeDateFormatter.format(instant)
}

function romeWallClockMinutes(instant: Date): { date: string; minutes: number } {
  const parts = romePartsFormatter.formatToParts(instant)
  const year = parts.find((p) => p.type === 'year')?.value ?? ''
  const month = parts.find((p) => p.type === 'month')?.value ?? ''
  const day = parts.find((p) => p.type === 'day')?.value ?? ''
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')
  return {
    date: `${year}-${month}-${day}`,
    minutes: hour * 60 + minute,
  }
}

function parseHhMm(hhmm: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm.trim())
  if (!match) {
    return null
  }
  return Number(match[1]) * 60 + Number(match[2])
}

/**
 * Converte un orario parete `HH:mm` in un giorno di calendario Roma in istante UTC.
 *
 * **Cambio ora legale (ora non esistente):** se l'orario non compare mai su quel giorno
 * (es. 02:30 il 29 marzo quando le 02:00–02:59 non esistono), si usa il **primo istante
 * successivo** dello stesso giorno di calendario Roma in cui i minuti parete sono
 * strettamente maggiori dell'orario richiesto (tipicamente 03:00). Il confine non viene
 * saltato: avanza all'apertura effettiva dopo il salto.
 */
export function boundaryInstantRome(romeDate: string, startTimeHhMm: string): Date | null {
  const targetMinutes = parseHhMm(startTimeHhMm)
  if (targetMinutes === null) {
    return null
  }

  const [y, m, d] = romeDate.split('-').map(Number)
  if (!y || !m || !d) {
    return null
  }

  const searchStart = Date.UTC(y, m - 1, d - 1, 0, 0, 0)
  const searchEnd = Date.UTC(y, m - 1, d + 1, 23, 59, 0)

  let exact: Date | null = null
  let firstAfter: Date | null = null

  for (let t = searchStart; t <= searchEnd; t += 60_000) {
    const instant = new Date(t)
    const wall = romeWallClockMinutes(instant)
    if (wall.date !== romeDate) {
      continue
    }
    if (wall.minutes === targetMinutes) {
      exact = instant
      break
    }
    if (wall.minutes > targetMinutes && firstAfter === null) {
      firstAfter = instant
    }
  }

  return exact ?? firstAfter
}

export type ServiceHoursRow = {
  name: ServiceName
  startTime: string
  endTime: string
}

function addRomeCalendarDays(romeDate: string, days: number): string {
  const [y, m, d] = romeDate.split('-').map(Number)
  const noonUtc = Date.UTC(y, m - 1, d, 12, 0, 0)
  const shifted = new Date(noonUtc + days * 86_400_000)
  return romeCalendarDateFromInstant(shifted)
}

function enumerateRomeDatesBetween(fromRomeDate: string, toRomeDate: string): string[] {
  const dates: string[] = []
  let cursor = fromRomeDate
  while (cursor <= toRomeDate) {
    dates.push(cursor)
    cursor = addRomeCalendarDays(cursor, 1)
  }
  return dates
}

/**
 * Confini di **inizio** servizio (`startTime`) tra due istanti (esclusivo, inclusivo].
 * Giorni chiusi non filtrano l'elenco: il reset è idempotente anche in chiusura.
 */
export function listServiceStartBoundariesBetween(
  lastExclusive: Date,
  nowInclusive: Date,
  services: ServiceHoursRow[],
  options?: { maxLookbackDays?: number },
): ServiceBoundaryKey[] {
  const maxLookbackDays = options?.maxLookbackDays ?? SERVICE_BOUNDARY_LOOKBACK_DAYS
  const lookbackStart = new Date(nowInclusive.getTime() - maxLookbackDays * 86_400_000)

  const effectiveLast =
    lastExclusive.getTime() < lookbackStart.getTime() ? lookbackStart : lastExclusive

  const fromRome = romeCalendarDateFromInstant(effectiveLast)
  const toRome = romeCalendarDateFromInstant(nowInclusive)
  const boundaries: ServiceBoundaryKey[] = []

  for (const romeDate of enumerateRomeDatesBetween(fromRome, toRome)) {
    for (const row of services) {
      if (row.name !== 'lunch' && row.name !== 'dinner') {
        continue
      }
      const instant = boundaryInstantRome(romeDate, row.startTime)
      if (!instant) {
        continue
      }
      const ms = instant.getTime()
      if (ms > effectiveLast.getTime() && ms <= nowInclusive.getTime()) {
        boundaries.push({
          service: row.name,
          romeDate,
          instant,
        })
      }
    }
  }

  boundaries.sort((a, b) => a.instant.getTime() - b.instant.getTime())
  return boundaries
}

export function maxBoundaryAtOrBefore(now: Date, services: ServiceHoursRow[]): ServiceBoundaryKey | null {
  const romeToday = romeCalendarDateFromInstant(now)
  const lookbackStart = addRomeCalendarDays(romeToday, -SERVICE_BOUNDARY_LOOKBACK_DAYS)
  const dates = enumerateRomeDatesBetween(lookbackStart, romeToday)

  let best: ServiceBoundaryKey | null = null
  for (const romeDate of dates) {
    for (const row of services) {
      if (row.name !== 'lunch' && row.name !== 'dinner') {
        continue
      }
      const instant = boundaryInstantRome(romeDate, row.startTime)
      if (!instant) {
        continue
      }
      if (instant.getTime() <= now.getTime()) {
        if (!best || instant.getTime() > best.instant.getTime()) {
          best = { service: row.name, romeDate, instant }
        }
      }
    }
  }
  return best
}

/** Per cambiare la regola a confine = `endTime`, sostituire `row.startTime` con `row.endTime` qui e in `maxBoundaryAtOrBefore`. */
export function boundaryInstantForServiceRow(
  romeDate: string,
  row: ServiceHoursRow,
  useEndTime = false,
): Date | null {
  return boundaryInstantRome(romeDate, useEndTime ? row.endTime : row.startTime)
}
