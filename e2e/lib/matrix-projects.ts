/** Suffisso titolo test: il progetto Playwright ha `grep` su questo pattern (nessun test saltato). */
export function projectTag(projectName: string): string {
  return `[${projectName}]`
}

export const MATRIX_PROJECTS = [
  'telefono-390-chiaro',
  'telefono-390-scuro',
  'notebook-1280-chiaro',
  'notebook-1280-scuro',
  'soglia-767-chiaro',
  'soglia-767-scuro',
  'soglia-768-chiaro',
  'soglia-768-scuro',
] as const

export const C1_PROJECTS = [
  'telefono-390-chiaro',
  'telefono-390-scuro',
  'notebook-1280-chiaro',
  'notebook-1280-scuro',
] as const

export const C2_PROJECTS = ['telefono-390-chiaro', 'telefono-390-scuro'] as const

export const C2_MOUSE_PROJECTS = ['notebook-1280-chiaro', 'notebook-1280-scuro'] as const

export const C3_NO_LAMPO_PROJECTS = MATRIX_PROJECTS.filter((p) => p.endsWith('-scuro'))

export const C3_CAMBIO_SISTEMA_PROJECTS = ['telefono-390-chiaro', 'telefono-390-scuro'] as const

/** Stati con server dev dedicato (progetto `simulazioni`). */
export const SIM_MATRIX_STATES = new Set(['caricamento', 'errore-caricamento', 'errore-azione'])

export const SIM_SCREENSHOT_PROJECTS = ['telefono-390-chiaro'] as const

export function grepForProject(projectName: string): RegExp {
  return new RegExp(`\\[${projectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]$`)
}
