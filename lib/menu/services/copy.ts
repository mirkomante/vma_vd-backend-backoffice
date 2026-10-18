export const SERVIZI_PAGE_TITLE = 'Servizi'
export const SERVIZI_PAGE_DESCRIPTION =
  'Voci accessorie: coperto, diritto di dolce, diritto di tappo.'
export const SERVIZI_NEW_BUTTON = 'Nuovo servizio'

export const SERVIZI_COLUMN_NAME = 'Nome'
export const SERVIZI_COLUMN_PRICE = 'Prezzo'
export const SERVIZI_COLUMN_AVAILABLE = 'Disponibile'
export const SERVIZI_COLUMN_ACTIONS_SR = 'Azioni'

export const SERVIZI_BADGE_DISABLED = 'Disabilitato'
export const SERVIZI_TOGGLE_LABEL = 'Disponibile'

export function serviziListCount(total: number): string {
  if (total === 1) {
    return '1 servizio'
  }
  return `${total} servizi`
}

export const SERVIZI_LOAD_ERROR_TITLE = 'Impossibile caricare i servizi'
export const SERVIZI_LOAD_ERROR_DESCRIPTION =
  'Riprova tra qualche istante; se il problema continua, avvisa l’amministratore.'
export const SERVIZI_LOAD_RETRY = 'Riprova'
export const SERVIZI_EMPTY_TITLE = 'Nessun servizio.'

export const SERVIZI_TOAST_ENABLED = 'Servizio abilitato'
export const SERVIZI_TOAST_DISABLED = 'Servizio disabilitato'
export const SERVIZI_TOAST_PUBLIC_MINUTES = 'Il menù pubblico si aggiorna entro pochi minuti.'
export const SERVIZI_TOAST_SAVED_NEW = 'Servizio aggiunto'
export const SERVIZI_TOAST_SAVED = 'Servizio salvato'
export const SERVIZI_REBUILD_HINT_SAVED =
  'Per vederlo sul menù pubblico serve «Ricompila il menù pubblico».'
export const SERVIZI_TOAST_DELETED = 'Servizio eliminato'
export const SERVIZI_REBUILD_HINT_DELETED =
  'Per toglierlo dal menù pubblico serve «Ricompila il menù pubblico».'

export const SERVIZI_DELETE_BACK = 'Indietro'
export const SERVIZI_DELETE_CONFIRM = 'Elimina'

export function serviziDeleteConfirmTitle(name: string): string {
  return `Eliminare ${name}?`
}

export const SERVIZI_ACTION_ERROR_TITLE = 'Operazione non riuscita'
export const SERVIZI_ACTION_ERROR_DESCRIPTION =
  'Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore.'

export const SERVIZI_FORM_NEW_TITLE = 'Nuovo servizio'
export const SERVIZI_FORM_NEW_SUBTITLE =
  'Il servizio compare nel menù pubblico dopo la ricompilazione.'
export const SERVIZI_FORM_EDIT_TITLE = 'Modifica servizio'
export const SERVIZI_FORM_NAME = 'Nome'
export const SERVIZI_FORM_NAME_EN = 'Name'
export const SERVIZI_FORM_NAME_EN_PLACEHOLDER = 'il nome italiano'
export const SERVIZI_FORM_TRANSLATION_HINT =
  'Facoltativa. Se resta vuota, il menù mostra il testo italiano.'
export const SERVIZI_FORM_PRICE = 'Prezzo (€)'
export const SERVIZI_FORM_DISABLED_LABEL = 'Disabilitato'
export const SERVIZI_FORM_DISABLED_DESCRIPTION =
  'Assente a tempo indefinito: il servizio non compare nel menù.'
export const SERVIZI_FORM_SAVE = 'Salva'
export const SERVIZI_FORM_SAVE_PENDING = 'Salvataggio…'
export const SERVIZI_FORM_CANCEL = 'Annulla'

export const SERVIZI_ERROR_REQUIRED = 'Campo obbligatorio.'
export const SERVIZI_ERROR_PRICE = 'Inserisci un prezzo valido (es. 2,50).'
