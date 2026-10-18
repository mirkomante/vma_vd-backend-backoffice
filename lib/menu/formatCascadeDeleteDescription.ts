import {
  PIATTI_FIXED_MENU_LIST_OTHERS_PREFIX,
  PIATTI_FIXED_MENU_LIST_SEPARATOR,
} from '@/lib/menu/dishes/copy'
import { formatSpecialDayDateLong } from '@/lib/menu/display/formatSpecialDayDateLong'
import { pluralizeIt } from '@/lib/menu/display/pluralizeIt'

import { formatListedReferences } from './formatListedReferences'

export const CASCADE_DELETE_IRREVERSIBLE = 'Non si può annullare.'

/** Conferma eliminazione servizio (menù fissi che lo contengono). */
export function formatServiceDeleteDescription(fixedMenuNames: readonly string[]): string {
  const count = fixedMenuNames.length
  if (count === 0) {
    return CASCADE_DELETE_IRREVERSIBLE
  }
  const noun = pluralizeIt(count, 'menù fisso', 'menù fissi')
  const listed = formatListedReferences(
    fixedMenuNames,
    3,
    PIATTI_FIXED_MENU_LIST_SEPARATOR,
    PIATTI_FIXED_MENU_LIST_OTHERS_PREFIX,
  )
  return `Verrà tolto anche da ${noun}: ${listed}. ${CASCADE_DELETE_IRREVERSIBLE}`
}

/** Conferma eliminazione menù fisso (giorni speciali che lo contengono). */
export function formatFixedMenuDeleteDescription(specialDayDates: readonly string[]): string {
  const count = specialDayDates.length
  if (count === 0) {
    return CASCADE_DELETE_IRREVERSIBLE
  }
  const sorted = [...specialDayDates].sort()
  const labels = sorted.map((d) => formatSpecialDayDateLong(d))
  const noun = pluralizeIt(count, '1 giorno speciale', `${count} giorni speciali`)
  const listed = formatListedReferences(
    labels,
    3,
    PIATTI_FIXED_MENU_LIST_SEPARATOR,
    PIATTI_FIXED_MENU_LIST_OTHERS_PREFIX,
  )
  return `Verrà tolto anche da ${noun}: ${listed}. ${CASCADE_DELETE_IRREVERSIBLE}`
}
