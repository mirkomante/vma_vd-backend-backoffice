/** Metadati schermate catalogo 6.6 (Vini, Distillati, Bevande). */

export const CATALOG_SCREENS = {
  vini: {
    id: 'vini',
    path: '/app/menu/wines',
    h1: 'Vini',
    collection: 'wines',
    newButton: 'Nuovo vino',
    searchPlaceholder: 'Cerca un vino o una cantina',
    disabledBadge: 'Disabilitato',
    showMore: 'Mostra altri vini',
    bulkPrefix: 'verify-ui-vini-bulk-',
    hasOriginCascade: true,
  },
  distillati: {
    id: 'distillati',
    path: '/app/menu/spirits',
    h1: 'Distillati',
    collection: 'spirits',
    newButton: 'Nuovo distillato',
    searchPlaceholder: 'Cerca un distillato',
    disabledBadge: 'Disabilitato',
    showMore: 'Mostra altri distillati',
    bulkPrefix: 'verify-ui-distillati-bulk-',
    hasOriginCascade: false,
  },
  bevande: {
    id: 'bevande',
    path: '/app/menu/drinks',
    h1: 'Bevande',
    collection: 'drinks',
    newButton: 'Nuova bevanda',
    searchPlaceholder: 'Cerca una bevanda',
    disabledBadge: 'Disabilitata',
    showMore: 'Mostra altre bevande',
    bulkPrefix: 'verify-ui-bevande-bulk-',
    hasOriginCascade: false,
  },
}

export const CATALOG_SCREEN_IDS = Object.keys(CATALOG_SCREENS)
