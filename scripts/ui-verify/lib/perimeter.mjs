/** Mappa id controllo → livello minimo (default 1). */
export function buildLevelMap(controlli) {
  const map = new Map()
  for (const c of controlli.comuni ?? []) {
    if (c.id) map.set(c.id, c.livello ?? 1)
  }
  for (const s of controlli.schermate ?? []) {
    for (const c of s.controlli ?? []) {
      if (c.id) map.set(c.id, c.livello ?? 1)
    }
    for (const g of s.guardia ?? []) {
      if (g.id) map.set(g.id, g.livello ?? 1)
    }
  }
  map.set('login-titolo-documento', levelForScreenControl(controlli, 'login', 'login-titolo-documento'))
  map.set('forgot-titolo-documento', levelForScreenControl(controlli, 'forgot', 'forgot-titolo-documento'))
  map.set('reset-senza-token-vuoto', levelForScreenControl(controlli, 'reset', 'reset-senza-token-vuoto'))
  return map
}

function levelForScreenControl(controlli, screenId, controlId) {
  const screen = controlli.schermate?.find((s) => s.id === screenId)
  const c = screen?.controlli?.find((x) => x.id === controlId)
  return c?.livello ?? 1
}

function resolveListFromLivello(controlli, livello, key, cliOverride) {
  if (cliOverride?.length) return cliOverride
  if (livello == null) return null
  const block = controlli.livelli?.[String(livello)]
  const raw = block?.[key]
  if (raw === 'tutti' || raw == null) return null
  if (Array.isArray(raw)) return raw
  return null
}

export function createRunContext(controlli, cli) {
  const levels = buildLevelMap(controlli)
  const livello = cli.livello
  const schermate = cli.schermate

  const temiFromLivello = resolveListFromLivello(controlli, livello, 'temi', cli.temi)
  const profiliFromLivello = resolveListFromLivello(controlli, livello, 'profili', cli.profili)

  const livelloBlock = livello != null ? controlli.livelli?.[String(livello)] : null
  const runWebkitEssential =
    livello == null ? true : livelloBlock?.webkit === true

  function shouldRun(controlId) {
    if (livello == null) return true
    const minLevel = levels.get(controlId) ?? 1
    return minLevel <= livello
  }

  function screenIncluded(screenId) {
    if (screenId === 'pagine-accesso-comuni') return false
    if (!schermate) return true
    return schermate.has(screenId)
  }

  function temiKeys() {
    if (temiFromLivello) return temiFromLivello.filter((k) => controlli.temi[k])
    return Object.keys(controlli.temi)
  }

  function profiliAccess() {
    if (profiliFromLivello) return profiliFromLivello.filter((k) => controlli.profili[k])
    return ['telefono-360', 'telefono-390', 'notebook-1280', 'tablet-820']
  }

  function profiliShell() {
    if (profiliFromLivello) return profiliFromLivello.filter((k) => controlli.profili[k])
    return ['telefono-390', 'notebook-1280', 'soglia-767', 'soglia-768', 'tablet-820']
  }

  function profiliConsole() {
    if (profiliFromLivello) {
      return profiliFromLivello.filter((k) => ['notebook-1280', 'telefono-390'].includes(k) && controlli.profili[k])
    }
    return ['notebook-1280', 'telefono-390']
  }

  function runWebKitProdDiagnosis() {
    if (livello == null) return true
    return livello >= 2
  }

  function livelloLabel() {
    if (livello == null) return 'completo'
    return `L${livello}`
  }

  return {
    livello,
    schermate,
    levels,
    shouldRun,
    screenIncluded,
    temiKeys,
    profiliAccess,
    profiliShell,
    profiliConsole,
    runWebkitEssential,
    runWebKitProdDiagnosis,
    livelloLabel,
  }
}
