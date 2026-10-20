import { DRINKS_SLUG, SPIRITS_SLUG, WINES_SLUG } from '@/lib/menu/constants'

export type CatalogScreenId = 'vini' | 'distillati' | 'bevande'

export type CatalogScreenConfig = {
  id: CatalogScreenId
  path: string
  h1: string
  collection: typeof WINES_SLUG | typeof SPIRITS_SLUG | typeof DRINKS_SLUG
  newButton: string
  searchPlaceholder: string
  hasOriginCascade: boolean
}

export const CATALOG_SCREENS: Record<CatalogScreenId, CatalogScreenConfig> = {
  vini: {
    id: 'vini',
    path: '/app/menu/wines',
    h1: 'Vini',
    collection: WINES_SLUG,
    newButton: 'Nuovo vino',
    searchPlaceholder: 'Cerca un vino o una cantina',
    hasOriginCascade: true,
  },
  distillati: {
    id: 'distillati',
    path: '/app/menu/spirits',
    h1: 'Distillati',
    collection: SPIRITS_SLUG,
    newButton: 'Nuovo distillato',
    searchPlaceholder: 'Cerca un distillato',
    hasOriginCascade: false,
  },
  bevande: {
    id: 'bevande',
    path: '/app/menu/drinks',
    h1: 'Bevande',
    collection: DRINKS_SLUG,
    newButton: 'Nuova bevanda',
    searchPlaceholder: 'Cerca una bevanda',
    hasOriginCascade: false,
  },
}
