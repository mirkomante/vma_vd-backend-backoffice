/** Tipi di controllo gestiti dal lanciatore (docs/design/verifica/README.md §6). */
export const HANDLED_CONTROL_TYPES = new Set([
  'scroll-orizzontale',
  'tocco-minimo',
  'altezza-mouse',
  'tema-classe',
  'tema-no-lampo',
  'tema-cambio-sistema',
  'tema-persistenza',
  'console-pulita',
  'testo',
  'attributi',
  'presenza',
  'assenza',
  'conteggio',
  'misura',
  'reindirizzamento',
  'flusso',
  'comando',
])

/** Id di flusso/misura con runner dedicato (per schermata o comune). */
export const DEDICATED_FLOW_IDS = new Set([
  'piatti-casella-misure',
  'piatti-allergeni-selezione',
  'NO-OVERRIDE',
  'RICOMPILA-ASSENTE',
  'RICOMPILA-PRESENTE',
  'AMBIENTE',
  'C1',
  'C2',
  'C2-mouse',
  'C3',
  'C3-no-lampo',
  'C3-cambio-sistema',
  'C9',
  'CONSOLE',
])

const CATALOG_SCREEN_IDS = new Set(['vini', 'distillati', 'bevande'])

/** Controllo id → runner catalogo (run-catalog.mjs). */
export function isCatalogFlowControlId(id) {
  if (!id) return false
  return (
    id.startsWith('vini-') ||
    id.startsWith('distillati-') ||
    id.startsWith('bevande-')
  )
}

export function auditControlliWiring(controlli, { screenIds = null } = {}) {
  const issues = []
  const screens = (controlli.schermate ?? []).filter((s) => !screenIds || screenIds.has(s.id))

  for (const c of controlli.comuni ?? []) {
    if (!HANDLED_CONTROL_TYPES.has(c.tipo)) {
      issues.push(`comuni/${c.id}: tipo «${c.tipo}» non gestito`)
    }
  }

  for (const s of screens) {
    for (const c of s.controlli ?? []) {
      if (!HANDLED_CONTROL_TYPES.has(c.tipo)) {
        issues.push(`${s.id}/${c.id}: tipo «${c.tipo}» non gestito`)
        continue
      }
      if (c.tipo === 'flusso' || c.tipo === 'misura' || c.tipo === 'testo' || c.tipo === 'attributi') {
        if (CATALOG_SCREEN_IDS.has(s.id) && !isCatalogFlowControlId(c.id) && !DEDICATED_FLOW_IDS.has(c.id)) {
          issues.push(`${s.id}/${c.id}: id catalogo senza prefisso schermata`)
        }
      }
    }
  }

  return issues
}

export function catalogControlIdsFromControlli(controlli, screenId) {
  const screen = controlli.schermate?.find((s) => s.id === screenId)
  return (screen?.controlli ?? []).map((c) => c.id).filter(Boolean)
}
