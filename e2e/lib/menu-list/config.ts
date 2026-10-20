export type MenuListScreenId = 'servizi' | 'menu-fissi'

export type MenuListScreenConfig = {
  id: MenuListScreenId
  path: string
  h1: string
  newButton: string
  categoriesPath?: string
  newCategoryButton?: string
}

export const MENU_LIST_SCREENS: Record<MenuListScreenId, MenuListScreenConfig> = {
  servizi: {
    id: 'servizi',
    path: '/app/menu/services',
    h1: 'Servizi',
    newButton: 'Nuovo servizio',
  },
  'menu-fissi': {
    id: 'menu-fissi',
    path: '/app/menu/fixed',
    h1: 'Menù fissi',
    categoriesPath: '/app/menu/fixed/categories',
    newButton: 'Nuovo menù fisso',
    newCategoryButton: 'Nuova categoria',
  },
}
