/** Testi UI Vini (docs/design/schermate/vini/spec.md §6). Una costante per riga. */

export const VINI_PAGE_TITLE = 'Vini'
export const VINI_PAGE_DESCRIPTION = 'La carta dei vini del ristorante.'
export const VINI_NEW_BUTTON = 'Nuovo vino'

export const VINI_SEARCH_PLACEHOLDER = 'Cerca un vino o una cantina'
export const VINI_FILTERS_BUTTON = 'Filtri'
export const VINI_FILTERS_SHEET_TITLE = 'Filtri'
export const VINI_FILTERS_SHEET_DESCRIPTION = 'Restringi l’elenco dei vini.'
export const VINI_FILTERS_APPLY = 'Applica'
export const VINI_FILTERS_RESET = 'Azzera'
export const VINI_FILTERS_ALL_TYPES = 'Tutte le tipologie'
export const VINI_FILTERS_ALL_COUNTRIES = 'Tutti i paesi'
export const VINI_FILTERS_ALL_REGIONS = 'Tutte le regioni'
export const VINI_FILTERS_ALL_APPELLATIONS = 'Tutte le denominazioni'
export const VINI_FILTER_STATE_ALL = 'Tutti'
export const VINI_FILTER_STATE_ENABLED = 'Abilitati'
export const VINI_FILTER_STATE_DISABLED = 'Disabilitati'

export const VINI_COLUMN_NAME = 'Nome'
export const VINI_COLUMN_ORIGIN = 'Origine'
export const VINI_COLUMN_PRICE = 'Prezzo'
export const VINI_COLUMN_AVAILABLE = 'Disponibile'
export const VINI_COLUMN_ACTIONS_SR = 'Azioni'

export const VINI_BADGE_DISABLED = 'Disabilitato'
export const VINI_TOGGLE_LABEL = 'Disponibile'
export const VINI_GLASS_PRICE_PREFIX = 'calice'

export const VINI_TOAST_ENABLED = 'Vino abilitato'
export const VINI_TOAST_DISABLED = 'Vino disabilitato'
export const VINI_TOAST_PUBLIC_MINUTES = 'Il menù pubblico si aggiorna entro pochi minuti.'
export const VINI_TOAST_SAVED_NEW = 'Vino aggiunto'
export const VINI_TOAST_SAVED = 'Vino salvato'
export const VINI_REBUILD_HINT_SAVED =
  'Per vederlo sul menù pubblico serve «Ricompila il menù pubblico».'
export const VINI_TOAST_DELETED = 'Vino eliminato'
export const VINI_REBUILD_HINT_DELETED =
  'Per toglierlo dal menù pubblico serve «Ricompila il menù pubblico».'

export const VINI_DELETE_CONFIRM_TITLE = (name: string) => `Eliminare ${name}?`
export const VINI_DELETE_CONFIRM_IRREVERSIBLE = 'Non si può annullare.'
export const VINI_DELETE_BACK = 'Indietro'
export const VINI_DELETE_CONFIRM = 'Elimina'

export const VINI_ACTION_ERROR_TITLE = 'Operazione non riuscita'
export const VINI_ACTION_ERROR_DESCRIPTION =
  'Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore.'

export const VINI_LOAD_ERROR_TITLE = 'Impossibile caricare i vini'
export const VINI_LOAD_ERROR_DESCRIPTION =
  'Riprova tra qualche istante; se il problema continua, avvisa l’amministratore.'
export const VINI_LOAD_RETRY = 'Riprova'

export const VINI_EMPTY_TITLE = 'Nessun vino in carta.'
export const VINI_NO_RESULTS_TITLE = 'Nessun risultato con questi filtri.'
export const VINI_CLEAR_FILTERS = 'Azzera filtri'

export const VINI_LIST_PARTIAL_TITLE_PREFIX = 'Mostrati 100 vini su '
export const VINI_LIST_PARTIAL_DESCRIPTION =
  'Restringi l’elenco con la ricerca o i filtri, oppure mostra gli altri.'
export const VINI_SHOW_MORE = 'Mostra altri vini'

export const VINI_ENTITY_SINGULAR = 'vino'
export const VINI_ENTITY_PLURAL = 'vini'

export const VINI_FORM_NEW_TITLE = 'Nuovo vino'
export const VINI_FORM_NEW_SUBTITLE =
  'Il vino compare nel menù pubblico dopo la ricompilazione.'
export const VINI_FORM_EDIT_TITLE = 'Modifica vino'
export const VINI_FORM_SAVE = 'Salva'
export const VINI_FORM_SAVE_PENDING = 'Salvataggio…'
export const VINI_FORM_CANCEL = 'Annulla'

export const VINI_FORM_NAME = 'Nome'
export const VINI_FORM_WINERY = 'Cantina'
export const VINI_FORM_YEAR = 'Anno'
export const VINI_FORM_YEAR_NV = 'Senza annata (NV)'
export const VINI_FORM_VOLUME = 'Capacità'
export const VINI_FORM_ABV = 'Grado'
export const VINI_FORM_DESCRIPTION = 'Descrizione'
export const VINI_FORM_DESCRIPTION_EN = 'Description'
export const VINI_FORM_TRANSLATION_HINT =
  'Facoltativa. Se resta vuota, il menù mostra il testo italiano. Il nome del vino non si traduce.'
export const VINI_FORM_FORMAT_HINT =
  'Capacità e grado si scelgono da un elenco, così i dati restano uniformi.'
export const VINI_FORM_FORMAT_HINT_SAVED =
  'Un valore non in elenco resta finché non lo cambi.'
export const VINI_FORM_SELECT_PLACEHOLDER = 'Scegli'
export const VINI_FORM_VOLUME_EMPTY = 'Non indicata'
export const VINI_FORM_ABV_EMPTY = 'Non indicato'

export const VINI_FORM_TYPE = 'Tipologia'
export const VINI_FORM_COUNTRY = 'Paese'
export const VINI_FORM_REGION = 'Regione'
export const VINI_FORM_APPELLATION = 'Denominazione'
export const VINI_FORM_CLASSIFICATION = 'Classificazione'
export const VINI_FORM_CLASSIFICATION_HINT =
  'Le classificazioni mostrate seguono il paese scelto.'

export const VINI_FORM_REGION_NONE = 'Nessuna regione'
export const VINI_FORM_APPELLATION_NONE = 'Nessuna denominazione'
export const VINI_FORM_CLASSIFICATION_NONE = 'Nessuna classificazione'

export const VINI_FORM_REGION_PH_COUNTRY = 'Scegli prima il paese'
export const VINI_FORM_REGION_PH_OPTIONAL = 'Facoltativa'
export const VINI_FORM_REGION_PH_NONE = 'Nessuna regione per questo paese'
export const VINI_FORM_APPELLATION_PH_REGION = 'Scegli prima la regione'
export const VINI_FORM_APPELLATION_PH_NONE = 'Nessuna denominazione per questa regione'
export const VINI_FORM_CLASSIFICATION_PH_COUNTRY = 'Scegli prima il paese'
export const VINI_FORM_CLASSIFICATION_PH_OPTIONAL = 'Facoltativa'
export const VINI_FORM_CLASSIFICATION_PH_NONE = 'Nessuna classificazione per questo paese'

export const VINI_FORM_PRICE = 'Prezzo (€)'
export const VINI_FORM_GLASS_PRICE = 'Al calice (€)'
export const VINI_FORM_GLASS_HINT = 'Il prezzo al calice è facoltativo.'
export const VINI_FORM_DISABLED_LABEL = 'Disabilitato'
export const VINI_FORM_DISABLED_DESCRIPTION =
  'Assente a tempo indefinito: il vino non compare nel menù.'

export const VINI_ERROR_REQUIRED = 'Campo obbligatorio.'
export const VINI_ERROR_TYPE = 'Scegli una tipologia.'
export const VINI_ERROR_COUNTRY = 'Scegli un paese.'
export const VINI_ERROR_PRICE = 'Inserisci un prezzo valido (es. 28,50).'
export const VINI_ERROR_GLASS_PRICE = 'Inserisci un prezzo valido (es. 7,00).'
export const VINI_ERROR_YEAR = (currentYear: number) =>
  `Inserisci un anno di quattro cifre tra 1900 e ${currentYear}.`

export const VINI_FILTER_CHIP_REMOVE = (label: string) => `Rimuovi filtro ${label}`
