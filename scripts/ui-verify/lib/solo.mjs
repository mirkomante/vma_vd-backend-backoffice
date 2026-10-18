const MENU_PREFIX_SCREEN = {
  piatti: 'piatti',
  vini: 'vini',
  distillati: 'distillati',
  bevande: 'bevande',
  home: 'home',
  navigazione: 'nav',
  orari: 'orari',
}

/**
 * @param {Set<string>} solo
 * @param {Record<string, unknown>} controlli
 * @returns {Set<string>}
 */
export function inferScreensFromSolo(solo, controlli) {
  const screens = new Set()
  for (const id of solo) {
    for (const [screenId, prefix] of Object.entries(MENU_PREFIX_SCREEN)) {
      if (id === screenId || id.startsWith(`${prefix}-`) || id === `${screenId}-console`) {
        screens.add(screenId)
      }
    }
    if (id.startsWith('home-riga-')) screens.add('home')
    for (const s of controlli.schermate ?? []) {
      if (s.controlli?.some((c) => c.id === id)) screens.add(s.id)
      if (s.guardia?.some((g) => g.id === id)) screens.add(s.id)
    }
    for (const c of controlli.comuni ?? []) {
      if (c.id === id) {
        /* comuni: nessuna schermata obbligatoria */
      }
    }
  }
  return screens
}

/** Profili/temi minimi L1 se --solo senza override CLI. */
export const SOLO_DEFAULT_PROFILI = ['telefono-390', 'notebook-1280']
export const SOLO_DEFAULT_TEMI = ['chiaro', 'scuro']
