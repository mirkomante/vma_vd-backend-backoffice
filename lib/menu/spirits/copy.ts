/** Testi UI Distillati (docs/design/schermate/distillati/spec.md §6). */

export const DISTILLATI_PAGE_TITLE = 'Distillati'
export const DISTILLATI_PAGE_DESCRIPTION = 'I distillati del ristorante.'
export const DISTILLATI_NEW_BUTTON = 'Nuovo distillato'

export const DISTILLATI_SEARCH_PLACEHOLDER = 'Cerca un distillato'
export const DISTILLATI_FILTERS_BUTTON = 'Filtri'
export const DISTILLATI_FILTERS_SHEET_TITLE = 'Filtri'
export const DISTILLATI_FILTERS_SHEET_DESCRIPTION = 'Restringi l’elenco dei distillati.'
export const DISTILLATI_FILTERS_APPLY = 'Applica'
export const DISTILLATI_FILTERS_RESET = 'Azzera'
export const DISTILLATI_FILTERS_ALL_TYPES = 'Tutte le tipologie'
export const DISTILLATI_FILTERS_ALL_COUNTRIES = 'Tutti i paesi'
export const DISTILLATI_FILTER_STATE_ALL = 'Tutti'
export const DISTILLATI_FILTER_STATE_ENABLED = 'Abilitati'
export const DISTILLATI_FILTER_STATE_DISABLED = 'Disabilitati'

export const DISTILLATI_COLUMN_NAME = 'Nome'
export const DISTILLATI_COLUMN_COUNTRY = 'Paese'
export const DISTILLATI_COLUMN_PRICE = 'Prezzo'
export const DISTILLATI_COLUMN_AVAILABLE = 'Disponibile'
export const DISTILLATI_COLUMN_ACTIONS_SR = 'Azioni'

export const DISTILLATI_BADGE_DISABLED = 'Disabilitato'
export const DISTILLATI_TOGGLE_LABEL = 'Disponibile'

export const DISTILLATI_TOAST_ENABLED = 'Distillato abilitato'
export const DISTILLATI_TOAST_DISABLED = 'Distillato disabilitato'
export const DISTILLATI_TOAST_PUBLIC_MINUTES = 'Il menù pubblico si aggiorna entro pochi minuti.'
export const DISTILLATI_TOAST_SAVED_NEW = 'Distillato aggiunto'
export const DISTILLATI_TOAST_SAVED = 'Distillato salvato'
export const DISTILLATI_REBUILD_HINT_SAVED =
  'Per vederlo sul menù pubblico serve «Ricompila il menù pubblico».'
export const DISTILLATI_TOAST_DELETED = 'Distillato eliminato'
export const DISTILLATI_REBUILD_HINT_DELETED =
  'Per toglierlo dal menù pubblico serve «Ricompila il menù pubblico».'

export const DISTILLATI_DELETE_CONFIRM_TITLE = (name: string) => `Eliminare ${name}?`
export const DISTILLATI_DELETE_CONFIRM_IRREVERSIBLE = 'Non si può annullare.'
export const DISTILLATI_DELETE_BACK = 'Indietro'
export const DISTILLATI_DELETE_CONFIRM = 'Elimina'

export const DISTILLATI_ACTION_ERROR_TITLE = 'Operazione non riuscita'
export const DISTILLATI_ACTION_ERROR_DESCRIPTION =
  'Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore.'

export const DISTILLATI_LOAD_ERROR_TITLE = 'Impossibile caricare i distillati'
export const DISTILLATI_LOAD_ERROR_DESCRIPTION =
  'Riprova tra qualche istante; se il problema continua, avvisa l’amministratore.'
export const DISTILLATI_LOAD_RETRY = 'Riprova'

export const DISTILLATI_EMPTY_TITLE = 'Nessun distillato in carta.'
export const DISTILLATI_NO_RESULTS_TITLE = 'Nessun risultato con questi filtri.'
export const DISTILLATI_CLEAR_FILTERS = 'Azzera filtri'

export const DISTILLATI_LIST_PARTIAL_TITLE_PREFIX = 'Mostrati 100 distillati su '
export const DISTILLATI_LIST_PARTIAL_DESCRIPTION =
  'Restringi l’elenco con la ricerca o i filtri, oppure mostra gli altri.'
export const DISTILLATI_SHOW_MORE = 'Mostra altri distillati'

export const DISTILLATI_FORM_NEW_TITLE = 'Nuovo distillato'
export const DISTILLATI_FORM_NEW_SUBTITLE =
  'Il distillato compare nel menù pubblico dopo la ricompilazione.'
export const DISTILLATI_FORM_EDIT_TITLE = 'Modifica distillato'
export const DISTILLATI_FORM_SAVE = 'Salva'
export const DISTILLATI_FORM_SAVE_PENDING = 'Salvataggio…'
export const DISTILLATI_FORM_CANCEL = 'Annulla'

export const DISTILLATI_FORM_NAME = 'Nome'
export const DISTILLATI_FORM_AGING = 'Invecchiamento'
export const DISTILLATI_FORM_ABV = 'Grado'
export const DISTILLATI_FORM_DESCRIPTION = 'Descrizione'
export const DISTILLATI_FORM_DESCRIPTION_EN = 'Description'
export const DISTILLATI_FORM_TRANSLATION_HINT =
  'Facoltativa. Se resta vuota, il menù mostra il testo italiano. Il nome del distillato non si traduce.'
export const DISTILLATI_FORM_FORMAT_HINT =
  'Invecchiamento e grado si scelgono da un elenco, così i dati restano uniformi.'
export const DISTILLATI_FORM_FORMAT_HINT_SAVED =
  'Un valore non in elenco resta finché non lo cambi.'
export const DISTILLATI_FORM_SELECT_PLACEHOLDER = 'Scegli'
export const DISTILLATI_FORM_AGING_EMPTY = 'Non indicato'
export const DISTILLATI_FORM_ABV_EMPTY = 'Non indicato'

export const DISTILLATI_FORM_TYPE = 'Tipologia'
export const DISTILLATI_FORM_COUNTRY = 'Paese'
export const DISTILLATI_FORM_PRICE = 'Prezzo al bicchiere (€)'
export const DISTILLATI_FORM_PRICE_HINT = 'I distillati si servono solo al bicchiere.'
export const DISTILLATI_FORM_DISABLED_LABEL = 'Disabilitato'
export const DISTILLATI_FORM_DISABLED_DESCRIPTION =
  'Assente a tempo indefinito: il distillato non compare nel menù.'

export const DISTILLATI_ERROR_REQUIRED = 'Campo obbligatorio.'
export const DISTILLATI_ERROR_TYPE = 'Scegli una tipologia.'
export const DISTILLATI_ERROR_COUNTRY = 'Scegli un paese.'
export const DISTILLATI_ERROR_PRICE = 'Inserisci un prezzo valido (es. 9,50).'

export const DISTILLATI_FILTER_CHIP_REMOVE = (label: string) => `Rimuovi filtro ${label}`
