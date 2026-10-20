export const GLOBAL_MESSAGE_PAGE_TITLE = 'Messaggio globale'
export const GLOBAL_MESSAGE_PAGE_DESCRIPTION =
  'Un avviso breve sul menù pubblico, per esempio «oggi cucina chiusa». Compare senza ricompilare.'

export const GLOBAL_MESSAGE_PANEL_TITLE = 'Sul menù pubblico'
export const GLOBAL_MESSAGE_PANEL_NONE = 'Nessun messaggio.'
export function globalMessagePanelSavedFallback(text: string): string {
  return `Messaggio salvato: «${text}»`
}
export function globalMessagePanelUpdatedAt(time: string): string {
  return `Menù pubblico aggiornato alle ${time}. Chi ha la pagina aperta lo vede entro circa cinque minuti.`
}
export const GLOBAL_MESSAGE_PANEL_PUBLISHING = 'In pubblicazione…'

export const GLOBAL_MESSAGE_FIELD_LABEL = 'Messaggio'
export const GLOBAL_MESSAGE_FIELD_HINT =
  'Un avviso breve, per esempio «oggi cucina chiusa». Vuoto vuol dire nessun messaggio.'
export const GLOBAL_MESSAGE_FIELD_EN = 'Message'
export const GLOBAL_MESSAGE_TRANSLATION_HINT =
  'Facoltativa. Se resta vuota, il menù mostra il testo italiano.'

export const GLOBAL_MESSAGE_SAVE = 'Salva modifiche'
export const GLOBAL_MESSAGE_SAVE_PENDING = 'Salvataggio…'
export const GLOBAL_MESSAGE_DISCARD = 'Annulla modifiche'
export const GLOBAL_MESSAGE_REMOVE = 'Togli il messaggio'

export const GLOBAL_MESSAGE_TOAST_SAVED = 'Messaggio salvato'
export const GLOBAL_MESSAGE_TOAST_SAVED_HINT =
  'Il menù pubblico lo mostra entro pochi minuti.'
export const GLOBAL_MESSAGE_TOAST_REMOVED = 'Messaggio tolto'
export const GLOBAL_MESSAGE_TOAST_REMOVED_HINT =
  'Il menù pubblico non lo mostra più entro pochi minuti.'

export const GLOBAL_MESSAGE_REMOVE_TITLE = 'Togliere il messaggio?'
export const GLOBAL_MESSAGE_REMOVE_DESCRIPTION = 'Il testo si perde.'
export const GLOBAL_MESSAGE_REMOVE_CONFIRM = 'Togli'

export const GLOBAL_MESSAGE_ACTION_ERROR_TITLE = 'Operazione non riuscita'
export const GLOBAL_MESSAGE_ACTION_ERROR_DESCRIPTION =
  'Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore.'

export const GLOBAL_MESSAGE_LOAD_ERROR_TITLE = 'Impossibile caricare il messaggio'
export const GLOBAL_MESSAGE_LOAD_ERROR_DESCRIPTION =
  'Riprova tra qualche istante; se il problema continua, avvisa l’amministratore.'
export const GLOBAL_MESSAGE_LOAD_RETRY = 'Riprova'
