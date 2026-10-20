import { pluralizeIt } from '@/lib/menu/display/pluralizeIt'
import { SPECIAL_DAY_SCOPE_OPTIONS, type SpecialDayScope } from '@/lib/menu/validateSpecialDayOverlap'

import { formatSpecialDayListDate } from './formatSpecialDayListDate'

export const SPECIAL_DAYS_PAGE_TITLE = 'Giorni speciali'
export const SPECIAL_DAYS_PAGE_DESCRIPTION =
  'Un giorno, o un solo servizio, con un menù che sostituisce l’offerta normale.'
export const SPECIAL_DAYS_NEW_BUTTON = 'Nuovo giorno speciale'

export const SPECIAL_DAYS_GROUP_UPCOMING = 'Prossimi'
export const SPECIAL_DAYS_GROUP_PAST = 'Passati'
export const SPECIAL_DAYS_NO_UPCOMING = 'Nessun giorno speciale in programma.'
export const SPECIAL_DAYS_EMPTY = 'Nessun giorno speciale.'

export function specialDaysGroupCountLabel(count: number): string {
  return pluralizeIt(count, 'giorno', 'giorni')
}

export const SPECIAL_DAYS_COL_DATE = 'Data'
export const SPECIAL_DAYS_COL_SCOPE = 'Ambito'
export const SPECIAL_DAYS_COL_MENUS = 'Menù fissi'
export const SPECIAL_DAYS_COL_ACTIVE = 'Attivo'
export const SPECIAL_DAYS_COL_ACTIONS_SR = 'Azioni'

export const SPECIAL_DAYS_LABEL_TODAY = 'Oggi'
export const SPECIAL_DAYS_BADGE_DISABLED = 'Disattivato'
export const SPECIAL_DAYS_ROW_ACTIVE_LABEL = 'Attivo'

export function specialDayMessageRowPrefix(text: string): string {
  return `Messaggio: ${text}`
}

export function specialDayScopeLabel(scope: SpecialDayScope): string {
  return SPECIAL_DAY_SCOPE_OPTIONS.find((o) => o.value === scope)?.label ?? scope
}

export function specialDayRowSubtitle(scope: SpecialDayScope, menuNames: string): string {
  return `${specialDayScopeLabel(scope)} · ${menuNames}`
}

export function specialDayActiveAriaLabel(date: string, scope: SpecialDayScope): string {
  return `Attivo: ${formatSpecialDayListDate(date)}, ${specialDayScopeLabel(scope)}`
}

export function specialDayEditAriaLabel(date: string): string {
  return `Modifica il giorno speciale di ${formatSpecialDayListDate(date)}`
}

export function specialDayDeleteAriaLabel(date: string): string {
  return `Elimina il giorno speciale di ${formatSpecialDayListDate(date)}`
}

export const SPECIAL_DAYS_TOAST_ENABLED = 'Giorno speciale attivato'
export const SPECIAL_DAYS_TOAST_DISABLED = 'Giorno speciale disattivato'
export const SPECIAL_DAYS_TOAST_REBUILD_HINT =
  'Per vederlo sul menù pubblico serve «Ricompila il menù pubblico».'

export const SPECIAL_DAYS_TOAST_ADDED = 'Giorno speciale aggiunto'
export const SPECIAL_DAYS_TOAST_SAVED = 'Giorno speciale salvato'

export function specialDayDeleteTitle(date: string): string {
  return `Eliminare il giorno speciale di ${formatSpecialDayListDate(date)}?`
}

export function specialDayDeleteDescription(scope: SpecialDayScope): string {
  return `${specialDayScopeLabel(scope)}. Non si può annullare.`
}

export const SPECIAL_DAYS_TOAST_DELETED = 'Giorno speciale eliminato'
export const SPECIAL_DAYS_TOAST_DELETED_REBUILD_HINT =
  'Per toglierlo dal menù pubblico serve «Ricompila il menù pubblico».'

export const SPECIAL_DAYS_FORM_NEW_TITLE = 'Nuovo giorno speciale'
export const SPECIAL_DAYS_FORM_NEW_SUBTITLE =
  'Compare nel menù pubblico dopo la ricompilazione.'
export function specialDayFormEditTitle(): string {
  return `Modifica giorno speciale`
}
export function specialDayFormEditSubtitle(date: string): string {
  return formatSpecialDayListDate(date)
}

export const SPECIAL_DAYS_FORM_INFO =
  'Il giorno speciale sostituisce l’offerta normale (alla carta e menù fissi) per la data e l’ambito scelti.'

export const SPECIAL_DAYS_FORM_SECTION_WHEN = 'Quando'
export const SPECIAL_DAYS_FORM_DATE = 'Data'
export const SPECIAL_DAYS_FORM_DATE_PAST_WARNING =
  'La data è passata: il giorno speciale non avrà effetto.'
export const SPECIAL_DAYS_FORM_SCOPE = 'Ambito'
export const SPECIAL_DAYS_FORM_SCOPE_PLACEHOLDER = 'Scegli'
export const SPECIAL_DAYS_FORM_SCOPE_HINT =
  'La giornata intera sostituisce pranzo e cena; pranzo o cena lasciano l’altro servizio sul menù normale.'

export const SPECIAL_DAYS_FORM_SECTION_MENUS = 'Menù fissi'
export const SPECIAL_DAYS_BADGE_SPECIAL_ONLY = 'Solo giorni speciali'
export const SPECIAL_DAYS_BADGE_MENU_DISABLED = 'Disabilitato'

export const SPECIAL_DAYS_FORM_SECTION_MESSAGE = 'Messaggio sul giorno speciale'
export const SPECIAL_DAYS_FORM_MESSAGE_HINT =
  'Facoltativo: un banner sul giorno speciale.'
export const SPECIAL_DAYS_FORM_MESSAGE_EN = 'Message'
export const SPECIAL_DAYS_FORM_TRANSLATION_HINT =
  'Facoltativa. Se resta vuota, il menù mostra il testo italiano.'

export const SPECIAL_DAYS_FORM_SECTION_STATE = 'Stato'
export const SPECIAL_DAYS_FORM_DISABLED_LABEL = 'Disattivato'
export const SPECIAL_DAYS_FORM_DISABLED_HINT =
  'Assente a tempo indefinito: il giorno speciale non si applica e non conta per la sovrapposizione.'

export const SPECIAL_DAYS_FORM_SAVE = 'Salva'
export const SPECIAL_DAYS_FORM_SAVE_PENDING = 'Salvataggio…'
export const SPECIAL_DAYS_FORM_CANCEL = 'Annulla'

export const SPECIAL_DAYS_ERROR_DATE = 'Scegli una data.'
export const SPECIAL_DAYS_ERROR_SCOPE = 'Scegli un ambito.'
export const SPECIAL_DAYS_ERROR_MENUS = 'Scegli almeno un menù fisso.'

export const SPECIAL_DAYS_ACTION_ERROR_TITLE = 'Operazione non riuscita'
export const SPECIAL_DAYS_ACTION_ERROR_DESCRIPTION =
  'Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore.'

export const SPECIAL_DAYS_LOAD_ERROR_TITLE = 'Impossibile caricare i giorni speciali'
export const SPECIAL_DAYS_LOAD_ERROR_DESCRIPTION =
  'Riprova tra qualche istante; se il problema continua, avvisa l’amministratore.'
export const SPECIAL_DAYS_LOAD_RETRY = 'Riprova'
