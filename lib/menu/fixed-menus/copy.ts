import { pluralizeIt } from '@/lib/menu/display/pluralizeIt'

export const MENU_FISSI_PAGE_TITLE = 'Menù fissi'
export const MENU_FISSI_PAGE_DESCRIPTION =
  'I menù a prezzo fisso e le loro categorie.'
export const MENU_FISSI_TAB_MENUS = 'Menù fissi'
export const MENU_FISSI_TAB_CATEGORIES = 'Categorie'

export const MENU_FISSI_NEW_BUTTON = 'Nuovo menù fisso'
export const MENU_FISSI_NEW_CATEGORY_BUTTON = 'Nuova categoria'

export const MENU_FISSI_COLUMN_NAME = 'Nome'
export const MENU_FISSI_COLUMN_VISIBILITY = 'Visibilità'
export const MENU_FISSI_COLUMN_PRICE = 'Prezzo'
export const MENU_FISSI_COLUMN_AVAILABLE = 'Disponibile'
export const MENU_FISSI_COLUMN_ACTIONS_SR = 'Azioni'

export const MENU_FISSI_BADGE_DISABLED = 'Disabilitato'
export const MENU_FISSI_BADGE_SPECIAL_ONLY = 'Solo giorni speciali'
export const MENU_FISSI_BADGE_CATEGORY_DISABLED = 'Disabilitata'

export const MENU_FISSI_TOGGLE_LABEL = 'Disponibile'
export const MENU_FISSI_CATEGORY_TOGGLE_LABEL = 'Attiva'

export const MENU_FISSI_VISIBILITY_ALWAYS = 'Sempre'
export const MENU_FISSI_VISIBILITY_LUNCH = 'Solo pranzo'
export const MENU_FISSI_VISIBILITY_DINNER = 'Solo cena'

export function menuFissiListCount(total: number): string {
  if (total === 0) {
    return ''
  }
  if (total === 1) {
    return '1 menù fisso, raggruppato per categoria.'
  }
  return `${total} menù fissi, raggruppati per categoria.`
}

export function menuFissiCategoriesListCount(total: number): string {
  if (total === 0) {
    return ''
  }
  if (total === 1) {
    return '1 categoria, in ordine per nome.'
  }
  return `${total} categorie, in ordine per nome.`
}

export function menuFissiDishCountLabel(count: number): string {
  return pluralizeIt(count, 'piatto', 'piatti')
}

export function menuFissiGroupMenuCount(count: number): string {
  return pluralizeIt(count, 'menù', 'menù')
}

export function menuFissiCategoryMenuCount(count: number): string {
  return pluralizeIt(count, 'menù', 'menù')
}

export const MENU_FISSI_GROUP_CATEGORY_DISABLED_SUFFIX = '· categoria disabilitata'

export const MENU_FISSI_LOAD_ERROR_TITLE = 'Impossibile caricare i menù fissi'
export const MENU_FISSI_LOAD_ERROR_DESCRIPTION =
  'Riprova tra qualche istante; se il problema continua, avvisa l’amministratore.'
export const MENU_FISSI_LOAD_RETRY = 'Riprova'
export const MENU_FISSI_EMPTY_TITLE = 'Nessun menù fisso.'

export const MENU_FISSI_CATEGORIES_EMPTY_TITLE =
  'Nessuna categoria. Creane una per poter comporre i menù fissi.'

export const MENU_FISSI_TOAST_ENABLED = 'Menù fisso abilitato'
export const MENU_FISSI_TOAST_DISABLED = 'Menù fisso disabilitato'
export const MENU_FISSI_TOAST_PUBLIC_MINUTES = 'Il menù pubblico si aggiorna entro pochi minuti.'
export const MENU_FISSI_TOAST_SAVED_NEW = 'Menù fisso aggiunto'
export const MENU_FISSI_TOAST_SAVED = 'Menù fisso salvato'
export const MENU_FISSI_REBUILD_HINT_SAVED =
  'Per vederlo sul menù pubblico serve «Ricompila il menù pubblico».'
export const MENU_FISSI_TOAST_DELETED = 'Menù fisso eliminato'
export const MENU_FISSI_REBUILD_HINT_DELETED =
  'Per toglierlo dal menù pubblico serve «Ricompila il menù pubblico».'

export const MENU_FISSI_CATEGORY_TOAST_ENABLED = 'Categoria abilitata'
export const MENU_FISSI_CATEGORY_TOAST_DISABLED = 'Categoria disabilitata'
export const MENU_FISSI_CATEGORY_TOAST_SAVED_NEW = 'Categoria aggiunta'
export const MENU_FISSI_CATEGORY_TOAST_SAVED = 'Categoria salvata'

export const MENU_FISSI_DELETE_BACK = 'Indietro'
export const MENU_FISSI_DELETE_CONFIRM = 'Elimina'

export function menuFissiDeleteConfirmTitle(name: string): string {
  return `Eliminare ${name}?`
}

export const MENU_FISSI_ACTION_ERROR_TITLE = 'Operazione non riuscita'
export const MENU_FISSI_ACTION_ERROR_DESCRIPTION =
  'Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore.'

export const MENU_FISSI_FORM_NEW_TITLE = 'Nuovo menù fisso'
export const MENU_FISSI_FORM_NEW_SUBTITLE =
  'Il menù compare nel menù pubblico dopo la ricompilazione.'
export const MENU_FISSI_FORM_EDIT_TITLE = 'Modifica menù fisso'
export const MENU_FISSI_FORM_SECTION_DATA = 'Dati'
export const MENU_FISSI_FORM_SECTION_CATEGORY_VISIBILITY = 'Categoria e visibilità'
export const MENU_FISSI_FORM_SECTION_AVAILABILITY = 'Disponibilità'
export const MENU_FISSI_FORM_NAME = 'Nome'
export const MENU_FISSI_FORM_DESCRIPTION = 'Descrizione'
export const MENU_FISSI_FORM_PRICE = 'Prezzo (€)'
export const MENU_FISSI_FORM_CATEGORY = 'Categoria'
export const MENU_FISSI_FORM_CATEGORY_PLACEHOLDER = 'Scegli'
export const MENU_FISSI_FORM_CATEGORY_EMPTY =
  'Nessuna categoria: creane una nella scheda Categorie'
export const MENU_FISSI_FORM_VISIBILITY = 'Visibilità'
export const MENU_FISSI_FORM_VISIBILITY_DESCRIPTION =
  'Quando compare nel menù pubblico. Vale insieme alla visibilità della categoria.'
export const MENU_FISSI_FORM_SPECIAL_ONLY = 'Solo giorni speciali'
export const MENU_FISSI_FORM_SPECIAL_ONLY_DESCRIPTION =
  'Se attivo, il menù non compare nelle pagine normali del menù pubblico, solo tramite i giorni speciali.'
export const MENU_FISSI_FORM_DISHES_LEGEND = 'Piatti'
export const MENU_FISSI_FORM_DISHES_EMPTY = 'Nessun piatto nel menù.'
export const MENU_FISSI_FORM_DISHES_ADD = 'Aggiungi piatti'
export const MENU_FISSI_FORM_DISHES_ADD_OR_EDIT = 'Aggiungi o togli piatti'
export const MENU_FISSI_FORM_PORTION = 'Porzione'
export const MENU_FISSI_FORM_PORTION_DESCRIPTION =
  'Facoltativa, per esempio «2 pezzi».'
export const MENU_FISSI_FORM_PORTION_HINT =
  'La porzione serve solo se la quantità nel menù è diversa da quella alla carta.'
export const MENU_FISSI_FORM_SERVICES_LEGEND = 'Servizi'
export const MENU_FISSI_FORM_DISABLED_LABEL = 'Disabilitato'
export const MENU_FISSI_FORM_DISABLED_DESCRIPTION =
  'Assente a tempo indefinito: il menù fisso non compare nel menù.'
export const MENU_FISSI_FORM_SAVE = 'Salva'
export const MENU_FISSI_FORM_SAVE_PENDING = 'Salvataggio…'
export const MENU_FISSI_FORM_CANCEL = 'Annulla'

export const MENU_FISSI_FORM_NAME_EN = 'Name'
export const MENU_FISSI_FORM_DESCRIPTION_EN = 'Description'
export const MENU_FISSI_FORM_TRANSLATION_HINT =
  'Facoltativa. Quello che resta vuoto, il menù lo mostra in italiano.'
export const MENU_FISSI_FORM_PORTIONS_EN_LEGEND = 'Porzioni'

export const MENU_FISSI_PICKER_TITLE = 'Scegli piatti'
export const MENU_FISSI_PICKER_BACK = 'Indietro al modulo'
export const MENU_FISSI_PICKER_HINT =
  'Spunta i piatti del menù. Quelli già scelti sono spuntati.'
export const MENU_FISSI_PICKER_SEARCH = 'Cerca un piatto'
export const MENU_FISSI_PICKER_EMPTY = 'Nessun piatto trovato.'
export const MENU_FISSI_PICKER_DONE = 'Fatto'

export const MENU_FISSI_CATEGORY_FORM_NEW_TITLE = 'Nuova categoria'
export const MENU_FISSI_CATEGORY_FORM_NEW_SUBTITLE =
  'Raggruppa i menù fissi nel menù pubblico.'
export const MENU_FISSI_CATEGORY_FORM_EDIT_TITLE = 'Modifica categoria'
export const MENU_FISSI_CATEGORY_FORM_NAME = 'Nome'
export const MENU_FISSI_CATEGORY_FORM_NAME_EN = 'Name'
export const MENU_FISSI_CATEGORY_FORM_NAME_EN_PLACEHOLDER = 'il nome italiano'
export const MENU_FISSI_CATEGORY_FORM_TRANSLATION_HINT =
  'Facoltativa. Se resta vuota, il menù mostra il testo italiano.'
export const MENU_FISSI_CATEGORY_FORM_VISIBILITY_DESCRIPTION =
  'Quando la categoria compare nelle pagine del menù pubblico.'
export const MENU_FISSI_CATEGORY_FORM_DISABLED_LABEL = 'Disabilitata'
export const MENU_FISSI_CATEGORY_FORM_DISABLED_DESCRIPTION =
  'Assente a tempo indefinito: la categoria non compare nel menù.'

export const MENU_FISSI_ERROR_REQUIRED = 'Campo obbligatorio.'
export const MENU_FISSI_ERROR_PRICE = 'Inserisci un prezzo valido (es. 18,00).'
export const MENU_FISSI_ERROR_CATEGORY = 'Scegli una categoria.'
export const MENU_FISSI_ERROR_DISHES = 'Aggiungi almeno un piatto.'

export const MENU_FISSI_BADGE_MISSING = 'Manca'
export const MENU_FISSI_BADGE_PRESENT = 'Presente'

export function menuFissiMoveUpAria(name: string): string {
  return `Sposta su ${name}`
}

export function menuFissiMoveDownAria(name: string): string {
  return `Sposta giù ${name}`
}

export function menuFissiRemoveDishAria(name: string): string {
  return `Togli ${name} dal menù`
}

export function menuFissiPickerDoneLabel(count: number): string {
  return `${MENU_FISSI_PICKER_DONE} (${count})`
}
