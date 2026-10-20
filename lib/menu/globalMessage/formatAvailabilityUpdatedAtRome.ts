const ROME = 'Europe/Rome'

/** Ora del file in Europe/Rome, formato `HH:mm` (24 h). */
export function formatAvailabilityUpdatedAtRome(updatedAtIso: string): string {
  const date = new Date(updatedAtIso)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: ROME,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}
