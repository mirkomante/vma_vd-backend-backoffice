import { formatSpecialDayDateLong } from '@/lib/menu/display/formatSpecialDayDateLong'

/** Data in lettere per l’elenco, con la prima lettera maiuscola (giorni speciali §6). */
export function formatSpecialDayListDate(dateInput: string): string {
  const formatted = formatSpecialDayDateLong(dateInput)
  if (!formatted) {
    return formatted
  }
  return formatted.charAt(0).toLocaleUpperCase('it-IT') + formatted.slice(1)
}
