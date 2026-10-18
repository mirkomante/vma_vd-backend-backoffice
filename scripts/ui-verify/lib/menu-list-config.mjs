/** Metadati schermate elenco Menù 6.6 (Servizi, Menù fissi). */

export const MENU_LIST_SCREENS = {
  servizi: {
    id: 'servizi',
    path: '/app/menu/services',
    h1: 'Servizi',
    collection: 'menu-services',
    newButton: 'Nuovo servizio',
    disabledBadge: 'Disabilitato',
  },
  'menu-fissi': {
    id: 'menu-fissi',
    path: '/app/menu/fixed',
    paths: ['/app/menu/fixed', '/app/menu/fixed/categories'],
    h1: 'Menù fissi',
    categoriesPath: '/app/menu/fixed/categories',
    newMenuButton: 'Nuovo menù fisso',
    newCategoryButton: 'Nuova categoria',
    disabledBadge: 'Disabilitato',
    categoryDisabledBadge: 'Disabilitata',
  },
}

export const MENU_LIST_SCREEN_IDS = Object.keys(MENU_LIST_SCREENS)
