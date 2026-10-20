/** Profilo e tema dal nome progetto Playwright (es. `telefono-390-chiaro`). */
export function parseProjectName(name: string): { profilo: string; tema: 'chiaro' | 'scuro' } {
  const tema = name.endsWith('-scuro') ? 'scuro' : 'chiaro'
  const profilo = tema === 'scuro' ? name.slice(0, -'-scuro'.length) : name.slice(0, -'-chiaro'.length)
  return { profilo, tema }
}

export const C1_PROFILES = new Set(['telefono-390', 'notebook-1280'])
export const C2_PROFILES = new Set(['telefono-390'])
export const MATRIX_SERIAL_STATES = new Set(['caricamento', 'errore-caricamento'])
