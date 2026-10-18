/** Testi UI Bevande (docs/design/schermate/bevande/spec.md §6). */

export const BEVANDE_PAGE_TITLE = 'Bevande'
export const BEVANDE_PAGE_DESCRIPTION = 'Le bevande del ristorante, birre comprese.'
export const BEVANDE_NEW_BUTTON = 'Nuova bevanda'

export const BEVANDE_SEARCH_PLACEHOLDER = 'Cerca una bevanda'
export const BEVANDE_FILTERS_BUTTON = 'Filtri'
export const BEVANDE_FILTERS_SHEET_TITLE = 'Filtri'
export const BEVANDE_FILTERS_SHEET_DESCRIPTION = 'Restringi l’elenco delle bevande.'
export const BEVANDE_FILTERS_ALL_TYPES = 'Tutte le tipologie'
export const BEVANDE_FILTERS_ALL_COUNTRIES = 'Tutti i paesi'
export const BEVANDE_FILTER_STATE_ALL = 'Tutte'
export const BEVANDE_FILTER_STATE_ENABLED = 'Abilitate'
export const BEVANDE_FILTER_STATE_DISABLED = 'Disabilitate'

export const BEVANDE_COLUMN_NAME = 'Nome'
export const BEVANDE_COLUMN_COUNTRY = 'Paese'
export const BEVANDE_COLUMN_PRICE = 'Prezzo'
export const BEVANDE_COLUMN_AVAILABLE = 'Disponibile'
export const BEVANDE_COLUMN_ACTIONS_SR = 'Azioni'

export const BEVANDE_BADGE_DISABLED = 'Disabilitata'
export const BEVANDE_TOGGLE_LABEL = 'Disponibile'

export const BEVANDE_TOAST_ENABLED = 'Bevanda abilitata'
export const BEVANDE_TOAST_DISABLED = 'Bevanda disabilitata'
export const BEVANDE_TOAST_PUBLIC_MINUTES = 'Il menù pubblico si aggiorna entro pochi minuti.'
export const BEVANDE_TOAST_SAVED_NEW = 'Bevanda aggiunta'
export const BEVANDE_TOAST_SAVED = 'Bevanda salvata'
export const BEVANDE_REBUILD_HINT_SAVED =
  'Per vederla sul menù pubblico serve «Ricompila il menù pubblico».'
export const BEVANDE_TOAST_DELETED = 'Bevanda eliminata'
export const BEVANDE_REBUILD_HINT_DELETED =
  'Per toglierla dal menù pubblico serve «Ricompila il menù pubblico».'

export const BEVANDE_DELETE_CONFIRM_TITLE = (name: string) => `Eliminare ${name}?`
export const BEVANDE_DELETE_CONFIRM_IRREVERSIBLE = 'Non si può annullare.'
export const BEVANDE_DELETE_BACK = 'Indietro'
export const BEVANDE_DELETE_CONFIRM = 'Elimina'

export const BEVANDE_ACTION_ERROR_TITLE = 'Operazione non riuscita'
export const BEVANDE_ACTION_ERROR_DESCRIPTION =
  'Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore.'

export const BEVANDE_LOAD_ERROR_TITLE = 'Impossibile caricare le bevande'
export const BEVANDE_LOAD_ERROR_DESCRIPTION =
  'Riprova tra qualche istante; se il problema continua, avvisa l’amministratore.'
export const BEVANDE_LOAD_RETRY = 'Riprova'

export const BEVANDE_EMPTY_TITLE = 'Nessuna bevanda in carta.'
export const BEVANDE_NO_RESULTS_TITLE = 'Nessun risultato con questi filtri.'
export const BEVANDE_CLEAR_FILTERS = 'Azzera filtri'

export const BEVANDE_LIST_PARTIAL_TITLE_PREFIX = 'Mostrate 100 bevande su '
export const BEVANDE_LIST_PARTIAL_DESCRIPTION =
  'Restringi l’elenco con la ricerca o i filtri, oppure mostra le altre.'
export const BEVANDE_SHOW_MORE = 'Mostra altre bevande'

export const BEVANDE_FORM_NEW_TITLE = 'Nuova bevanda'
export const BEVANDE_FORM_NEW_SUBTITLE =
  'La bevanda compare nel menù pubblico dopo la ricompilazione.'
export const BEVANDE_FORM_EDIT_TITLE = 'Modifica bevanda'
export const BEVANDE_FORM_SAVE = 'Salva'
export const BEVANDE_FORM_SAVE_PENDING = 'Salvataggio…'
export const BEVANDE_FORM_CANCEL = 'Annulla'

export const BEVANDE_FORM_NAME = 'Nome'
export const BEVANDE_FORM_VOLUME = 'Capacità'
export const BEVANDE_FORM_ABV = 'Grado'
export const BEVANDE_FORM_DESCRIPTION = 'Descrizione'
export const BEVANDE_FORM_NAME_EN = 'Name'
export const BEVANDE_FORM_DESCRIPTION_EN = 'Description'
export const BEVANDE_FORM_TRANSLATION_HINT =
  'Facoltativa. Se resta vuota, il menù mostra il testo italiano.'
export const BEVANDE_FORM_FORMAT_HINT =
  'Capacità e grado si scelgono da un elenco, così i dati restano uniformi. Il grado è vuoto per le analcoliche.'
export const BEVANDE_FORM_FORMAT_HINT_SAVED =
  'Un valore non in elenco resta finché non lo cambi.'
export const BEVANDE_FORM_SELECT_PLACEHOLDER = 'Scegli'
export const BEVANDE_FORM_VOLUME_EMPTY = 'Non indicata'
export const BEVANDE_FORM_ABV_EMPTY = 'Non indicato'

export const BEVANDE_FORM_TYPE = 'Tipologia'
export const BEVANDE_FORM_COUNTRY = 'Paese'
export const BEVANDE_FORM_COUNTRY_OPTIONAL = 'Facoltativo'
export const BEVANDE_FORM_COUNTRY_NONE = 'Nessun paese'

export const BEVANDE_FORM_PRICE = 'Prezzo (€)'
export const BEVANDE_FORM_DISABLED_LABEL = 'Disabilitata'
export const BEVANDE_FORM_DISABLED_DESCRIPTION =
  'Assente a tempo indefinito: la bevanda non compare nel menù.'

export const BEVANDE_ERROR_REQUIRED = 'Campo obbligatorio.'
export const BEVANDE_ERROR_TYPE = 'Scegli una tipologia.'
export const BEVANDE_ERROR_PRICE = 'Inserisci un prezzo valido (es. 4,50).'

export const BEVANDE_FILTER_CHIP_REMOVE = (label: string) => `Rimuovi filtro ${label}`
