/** Elenco degli id controllo attesi nel rapporto (v2), per ambiente. */
export function allControlIds(controlli, ambiente) {
  if (ambiente === 'locale-dev') {
    return ['CONSOLE', 'webkit-giro-essenziale']
  }
  if (ambiente === 'online') {
    return ['AMBIENTE', 'on1', 'on2', 'on3', 'on4', 'on5', 'on6', 'verify-link-valido']
  }

  const ids = new Set()
  for (const c of controlli.comuni ?? []) {
    if (c.ambienti && !c.ambienti.includes('locale-prod') && ambiente === 'locale-prod') {
      if (c.id === 'CONSOLE') continue
    }
    if (c.id === 'CONSOLE') continue
    ids.add(c.id)
  }
  for (const s of controlli.schermate ?? []) {
    for (const c of s.controlli ?? []) ids.add(c.id)
    for (const g of s.guardia ?? []) ids.add(g.id)
  }
  ids.add('verify-link-valido')
  ids.add('shell-admin-link')
  return [...ids].sort()
}
