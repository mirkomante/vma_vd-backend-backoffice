/** Elenco degli id controllo attesi nel rapporto, per ambiente e perimetro opzionale. */
export function allControlIds(controlli, ambiente, opts = {}) {
  const { livello = null, schermate = null, levels = null } = opts
  const levelMap = levels ?? buildLevelMapInline(controlli)

  function levelOk(id) {
    if (livello == null) return true
    return (levelMap.get(id) ?? 1) <= livello
  }

  if (ambiente === 'locale-dev') {
    const ids = []
    const orariScreen = controlli.schermate?.find((s) => s.id === 'orari')
    const orariInScope = !schermate || schermate.has('orari')
    if (orariScreen && orariInScope) {
      for (const c of orariScreen.controlli ?? []) {
        if (!levelOk(c.id)) continue
        if (c.ambienti && !c.ambienti.includes('locale-dev')) continue
        ids.push(c.id)
      }
    } else if (levelOk('CONSOLE')) {
      ids.push('CONSOLE')
    }
    if (levelOk('webkit-giro-essenziale')) ids.push('webkit-giro-essenziale')
    return [...new Set(ids)].sort()
  }

  if (ambiente === 'online') {
    const ids = ['AMBIENTE', 'on1', 'on2', 'on3', 'on4', 'on5', 'on6']
    if (livello == null) ids.push('verify-link-valido')
    return ids.filter(levelOk)
  }

  const ids = new Set()

  for (const c of controlli.comuni ?? []) {
    if (c.id === 'CONSOLE') continue
    if (c.ambienti && !c.ambienti.includes('locale-prod') && ambiente === 'locale-prod') continue
    if (!levelOk(c.id)) continue
    ids.add(c.id)
  }

  const accessCommon = controlli.schermate?.find((s) => s.id === 'pagine-accesso-comuni')
  const accessCommonIds = (accessCommon?.controlli ?? []).map((c) => c.id)

  for (const s of controlli.schermate ?? []) {
    if (s.id === 'pagine-accesso-comuni') continue
    if (schermate && !schermate.has(s.id)) continue

    if (s.fuori_dalla_shell) {
      for (const cid of accessCommonIds) {
        if (levelOk(cid)) ids.add(cid)
      }
    }

    for (const c of s.controlli ?? []) {
      if (levelOk(c.id)) ids.add(c.id)
    }
    for (const g of s.guardia ?? []) {
      if (levelOk(g.id)) ids.add(g.id)
    }
  }

  if (livello == null || schermatesIncludesShell(schermate)) {
    ids.add('verify-link-valido')
    ids.add('shell-admin-link')
  } else if (schermate?.has('verify')) {
    ids.add('verify-link-valido')
  }

  return [...ids].sort()
}

function schermatesIncludesShell(schermate) {
  if (!schermate) return true
  return schermate.has('shell')
}

function buildLevelMapInline(controlli) {
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
  return map
}
