import { TOUCH_MEASURE_FN } from './touch.mjs'

function initialsFromEmail(email) {
  const local = email.split('@')[0] ?? ''
  const parts = local.split(/[._-]/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return local.slice(0, 2).toUpperCase()
}

export const LAUNCHER_VERSION = '2.0.0'

export const SEGNAPOSTO_H1 = {
  '/app/menu': 'Piatti',
  '/app/hours': 'Orari',
  '/app/reservations': 'Prenotazioni',
}

const ENGLISH_A11Y = [
  'Toggle Sidebar',
  'Close',
  'Sidebar',
  'breadcrumb',
  'More',
  'Displays the mobile sidebar',
]

const PERCORSO_ATTESO = {
  '/app': { breadcrumb: ['Area App'], active: null },
  '/app/menu': { breadcrumb: ['Menù', 'Piatti'], active: 'Piatti' },
  '/app/hours': { breadcrumb: ['Orari'], active: 'Orari' },
  '/app/reservations': { breadcrumb: ['Prenotazioni', 'Elenco'], active: 'Elenco' },
}

export function withinTolerance(value, expected, tol = 0) {
  return Math.abs(value - expected) <= tol
}

export async function checkAmbiente(page) {
  const r = await page.evaluate(() => {
    const portal = document.querySelector('nextjs-portal')
    if (portal) return { found: true, selector: 'nextjs-portal' }
    const byTag = [...document.querySelectorAll('*')].find((e) => e.localName === 'nextjs-portal')
    if (byTag) return { found: true, selector: 'nextjs-portal (localName)' }
    const dev = document.querySelector('[data-nextjs-toast], #__next-build-watcher, [data-next-mark]')
    if (dev) {
      const id = dev.id ? `#${dev.id}` : dev.tagName.toLowerCase()
      const cls = dev.className && typeof dev.className === 'string' ? `.${dev.className.split(' ')[0]}` : ''
      return { found: true, selector: id || cls || dev.tagName }
    }
    return { found: false, selector: null }
  })
  return {
    ok: !r.found,
    misurato: r.found ? `presente (${r.selector})` : 'assente',
    atteso: 'assente (nessun indicatore dev Next)',
    selector: r.selector,
  }
}

export async function checkScrollOrizzontale(page) {
  const sw = await page.evaluate(() => document.documentElement.scrollWidth)
  const iw = await page.evaluate(() => window.innerWidth)
  return { ok: sw <= iw, misurato: `${sw} vs innerWidth ${iw}`, atteso: 'scrollWidth <= innerWidth' }
}

export async function checkTemaClasse(page, htmlDark) {
  const has = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  const ok = has === htmlDark
  return { ok, misurato: has ? 'dark presente' : 'dark assente', atteso: htmlDark ? 'dark presente' : 'dark assente' }
}

export async function checkToccoMinimo(page) {
  const list = await page.evaluate(TOUCH_MEASURE_FN)
  return {
    ok: list.length === 0,
    misurato: list.length ? list.join('; ') : 'nessun elemento',
    atteso: 'nessun elemento sotto 44 px',
  }
}

export async function checkAltezzaMouse(page) {
  const heights = await page.evaluate(() => {
    const out = []
    const base =
      'button, input:not([type=hidden]), select, textarea, [role=combobox], [role=tab], [role=menuitem]'
    document.querySelectorAll(base).forEach((e) => {
      const r = e.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) return
      if (getComputedStyle(e).visibility === 'hidden') return
      out.push({ h: Math.round(r.height), tag: e.tagName })
    })
    document.querySelectorAll('a[href]').forEach((a) => {
      const style = getComputedStyle(a)
      if (style.visibility === 'hidden') return
      if (style.textDecorationLine.includes('underline')) return
      const r = a.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) return
      const bg = style.backgroundColor
      const cls = a.className?.toString() ?? ''
      const buttonLike =
        r.height >= 28 &&
        (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' || cls.includes('inline-flex') || cls.includes('h-11'))
      if (buttonLike) out.push({ h: Math.round(r.height), tag: 'A' })
    })
    return out
  })
  const outOf = heights.filter((x) => x.h < 28 || x.h > 48)
  return {
    ok: outOf.length === 0,
    avviso: true,
    misurato: outOf.length
      ? `fuori intervallo: ${outOf.map((x) => x.h).join(', ')} px`
      : `tutte in [28,48] (${heights.length} elementi)`,
    atteso: 'altezze in [28, 48] px (no collegamenti di testo)',
  }
}

export async function installNoLampoObserver(page) {
  await page.addInitScript(() => {
    window.__htmlClassChanges = []
    const obs = new MutationObserver(() => {
      window.__htmlClassChanges.push(document.documentElement.className)
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    window.__stopHtmlObs = () => obs.disconnect()
  })
}

export async function checkNoLampo(page) {
  await page.waitForFunction(() => document.readyState === 'complete')
  await page.evaluate(() => {
    if (window.__stopHtmlObs) window.__stopHtmlObs()
  })
  const changes = await page.evaluate(() => window.__htmlClassChanges ?? [])
  const afterDom = changes.length > 1
  return {
    ok: !afterDom,
    misurato: afterDom ? `${changes.length} mutazioni classe html` : 'nessuna mutazione dopo load',
    atteso: 'nessuna variazione classe <html> dopo DOMContentLoaded',
  }
}

export async function checkTemaCambioSistema(page, baseUrl) {
  await page.context().addCookies([{ name: 'app-theme', value: 'system', url: baseUrl }])
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto(`${baseUrl}/app/login`, { waitUntil: 'networkidle' })
  let hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  if (hasDark) {
    return { ok: false, misurato: 'dark già presente con sistema chiaro', atteso: 'no dark con colorScheme light' }
  }
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.waitForTimeout(200)
  hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  await page.context().addCookies([{ name: 'app-theme', value: 'light', url: baseUrl }])
  await page.reload({ waitUntil: 'networkidle' })
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.waitForTimeout(200)
  const stillLight = !(await page.evaluate(() => document.documentElement.classList.contains('dark')))
  const ok = hasDark && stillLight
  return {
    ok,
    misurato: `dopo emulate dark: ${hasDark}; con cookie light ignore OS: ${stillLight}`,
    atteso: 'dark con system+OS scuro; no cambio con cookie light/dark fisso',
  }
}

export async function checkLoginTexts(page) {
  const data = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim()
    const desc = document.querySelector('main p')?.textContent?.trim()
    const google = [...document.querySelectorAll('a')].find((a) => a.textContent?.includes('Google'))?.textContent?.trim()
    const accedi = [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Accedi')?.textContent?.trim()
    const sep = document.body.innerText.includes('oppure')
    const labels = [...document.querySelectorAll('label')].map((l) => l.textContent?.trim())
    const textLinks = [...document.querySelectorAll('main a')].filter((a) => {
      const d = getComputedStyle(a).textDecorationLine
      return d.includes('underline') || a.textContent?.includes('Password') || a.textContent?.includes('Torna al sito')
    }).map((a) => a.textContent?.trim())
    return { h1, desc, google, accedi, sep, labels, textLinks }
  })
  const atteso = {
    h1: 'Area App',
    desc: 'Accedi con Google oppure con email e password.',
    google: 'Accedi con Google',
    accedi: 'Accedi',
    labels: ['Email', 'Password'],
    textLinks: ['Password dimenticata?', 'Torna al sito'],
  }
  const ok =
    data.h1 === atteso.h1 &&
    data.desc === atteso.desc &&
    data.google === atteso.google &&
    data.accedi === atteso.accedi &&
    data.sep &&
    JSON.stringify(data.labels) === JSON.stringify(atteso.labels) &&
    JSON.stringify(data.textLinks) === JSON.stringify(atteso.textLinks)
  return { ok, misurato: JSON.stringify(data), atteso: JSON.stringify(atteso) }
}

export async function checkLoginLinkDestinazioni(page) {
  const data = await page.evaluate(() => {
    const map = {}
    document.querySelectorAll('main a').forEach((a) => {
      const t = a.textContent?.trim()
      if (t) map[t] = a.getAttribute('href')
    })
    return map
  })
  const ok =
    data['Password dimenticata?'] === '/app/login/forgot' && (data['Torna al sito'] === '/' || data['Torna al sito'] === '')
  return {
    ok,
    misurato: JSON.stringify(data),
    atteso: '{"Password dimenticata?":"/app/login/forgot","Torna al sito":"/"}',
  }
}

export async function checkLoginCampi(page) {
  return await page.evaluate(() => {
    const email = document.querySelector('input[name=email]')
    const password = document.querySelector('input[name=password]')
    const form = document.querySelector('form')
    if (!email || !password || !form) return { ok: false, detail: 'elementi mancanti' }
    const ok =
      email.getAttribute('type') === 'email' &&
      email.getAttribute('autocomplete') === 'username' &&
      email.required &&
      password.getAttribute('type') === 'password' &&
      password.getAttribute('autocomplete') === 'current-password' &&
      password.required &&
      form.getAttribute('method')?.toLowerCase() === 'post' &&
      form.getAttribute('action') === '/api/users/login/app'
    return { ok, detail: `form ${form.getAttribute('action')}` }
  }).then((r) => ({
    ok: r.ok,
    misurato: r.detail,
    atteso: 'email/password + POST /api/users/login/app',
  }))
}

export async function checkGerarchiaLogin(page) {
  return await page
    .evaluate(() => {
      const google = [...document.querySelectorAll('a')].find((a) => a.textContent?.includes('Google'))
      const accedi = [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Accedi')
      if (!google || !accedi) return { ok: false, detail: 'elementi non trovati' }
      const bgG = getComputedStyle(google).backgroundColor
      const bgA = getComputedStyle(accedi).backgroundColor
      const primaryEl = document.querySelector('.bg-primary')
      const primaryBg = primaryEl ? getComputedStyle(primaryEl).backgroundColor : ''
      const primaryMatch = bgG === primaryBg || bgG === getComputedStyle(document.documentElement).getPropertyValue('--primary')
      return { ok: bgG !== bgA, bgG, bgA, primaryMatch }
    })
    .then((r) => ({
      ok: r.ok,
      misurato: typeof r.detail === 'string' ? r.detail : `Google ${r.bgG}, Accedi ${r.bgA}, primary≈Google:${r.primaryMatch}`,
      atteso: 'sfondi Google e Accedi diversi; Google ≈ primary',
    }))
}

export async function checkForgotTesti(page) {
  const data = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    desc: document.querySelector('main > div > div > p, main p')?.textContent?.trim(),
    labels: [...document.querySelectorAll('label')].map((l) => l.textContent?.trim()),
    button: [...document.querySelectorAll('button')].map((b) => b.textContent?.trim()).find((t) => t === 'Invia istruzioni'),
    links: [...document.querySelectorAll('main a')].map((a) => a.textContent?.trim()).filter(Boolean),
  }))
  const atteso = {
    h1: 'Password dimenticata',
    desc: 'Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.',
    labels: ['Email'],
    button: 'Invia istruzioni',
    links: ['Torna al login'],
  }
  const ok = JSON.stringify({ ...data, button: data.button }) === JSON.stringify(atteso)
  return { ok, misurato: JSON.stringify(data), atteso: JSON.stringify(atteso) }
}

export async function checkResetTesti(page) {
  const data = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    desc: document.querySelector('main h1')?.parentElement?.querySelector('p')?.textContent?.trim(),
    labels: [...document.querySelectorAll('label')].map((l) => l.textContent?.trim()),
    button: [...document.querySelectorAll('button')].find((b) => b.textContent?.includes('Aggiorna'))?.textContent?.trim(),
    links: [...document.querySelectorAll('main a')].map((a) => a.textContent?.trim()).filter(Boolean),
  }))
  const atteso = {
    h1: 'Nuova password',
    desc: 'Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.',
    labels: ['Nuova password'],
    button: 'Aggiorna password',
    links: ['Torna al login'],
  }
  const hasForm = await page.locator('input[name=password]').count()
  if (!hasForm) return { ok: true, misurato: 'senza modulo (stato senza-token)', atteso: 'solo con modulo' }
  const ok = data.h1 === atteso.h1 && data.desc === atteso.desc && data.button === atteso.button && JSON.stringify(data.links) === JSON.stringify(atteso.links)
  return { ok, misurato: JSON.stringify(data), atteso: JSON.stringify(atteso) }
}

export async function checkResetCampi(page) {
  return await page.evaluate(() => {
    const password = document.querySelector('input[name=password]')
    const token = document.querySelector('input[name=token]')
    const form = document.querySelector('form')
    if (!password || !form) return { ok: false, detail: 'modulo assente' }
    const ok =
      password.getAttribute('type') === 'password' &&
      password.getAttribute('autocomplete') === 'new-password' &&
      password.getAttribute('minlength') === '8' &&
      password.required &&
      token?.getAttribute('type') === 'hidden' &&
      token?.value === 'prova' &&
      form.getAttribute('method')?.toLowerCase() === 'post' &&
      form.getAttribute('action') === '/api/users/reset-password/app'
    return { ok, detail: `token=${token?.value}` }
  }).then((r) => ({ ok: r.ok, misurato: r.detail, atteso: 'password + hidden token + POST reset' }))
}

export async function checkVerifyTesti(page) {
  const data = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    links: [...document.querySelectorAll('main a')].map((a) => a.textContent?.trim()).filter(Boolean),
  }))
  const atteso = { h1: 'Conferma email', links: ['Vai al login'] }
  const ok = data.h1 === atteso.h1 && JSON.stringify(data.links) === JSON.stringify(atteso.links)
  return { ok, misurato: JSON.stringify(data), atteso: JSON.stringify(atteso) }
}

export async function checkAccFuoriShell(page) {
  const n = await page.locator('[data-slot=sidebar], [data-slot=sidebar-trigger], nav[aria-label="Percorso"]').count()
  return { ok: n === 0, misurato: `${n} elementi shell`, atteso: '0' }
}

export async function checkCollegamentiSottolineati(page) {
  const res = await page.evaluate(() => {
    const links = [...document.querySelectorAll('main .flex.flex-col.items-center a')]
    return links.map((a) => getComputedStyle(a).textDecorationLine)
  })
  const bad = res.filter((d) => !d.includes('underline'))
  return {
    ok: res.length > 0 && bad.length === 0,
    misurato: res.join(', ') || 'nessun link',
    atteso: 'underline su tutti i collegamenti sotto la scheda',
  }
}

export async function checkAccAvvisi(page) {
  const res = await page.evaluate(() => {
    const alerts = [...document.querySelectorAll('[role=alert], [role=status]')]
    if (!alerts.length) return { ok: true, detail: 'nessun avviso in pagina' }
    const bad = alerts.filter((el) => {
      const role = el.getAttribute('role')
      if (role !== 'alert' && role !== 'status') return true
      return !el.querySelector('svg')
    })
    return { ok: bad.length === 0, detail: `${alerts.length} avvisi, ${bad.length} senza svg/role` }
  })
  return { ok: res.ok, misurato: res.detail, atteso: 'role alert/status + icona svg' }
}

export async function checkAccColonna(page, profilo) {
  const w = profilo.larghezza
  const margin = w >= 768 ? 24 : 16
  const expected = Math.min(384, w - 2 * margin)
  const cardW = await page.evaluate(() => {
    const card = document.querySelector('[data-slot=card], .rounded-xl.border')
    return card ? card.getBoundingClientRect().width : 0
  })
  return {
    ok: withinTolerance(cardW, expected, 1),
    misurato: `${Math.round(cardW)} px`,
    atteso: `${expected} px (min(384, ${w}-2*${margin}))`,
  }
}

export async function checkAccMargine(page, profilo) {
  const left = await page.evaluate(() => {
    const card = document.querySelector('[data-slot=card], .rounded-xl.border')
    return card ? card.getBoundingClientRect().left : -1
  })
  const expected = profilo.larghezza >= 768 ? 24 : 16
  return {
    ok: withinTolerance(left, expected, 1.5),
    misurato: `${Math.round(left)} px`,
    atteso: `${expected} px`,
  }
}

export async function checkAccIcona(page) {
  const size = await page.evaluate(() => {
    const box = document.querySelector('main .size-10, main [class*="size-10"]')
    if (!box) return null
    const r = box.getBoundingClientRect()
    return { w: r.width, h: r.height }
  })
  if (!size) return { ok: false, misurato: 'icona non trovata', atteso: '40×40' }
  return {
    ok: withinTolerance(size.w, 40, 1) && withinTolerance(size.h, 40, 1),
    misurato: `${Math.round(size.w)}×${Math.round(size.h)}`,
    atteso: '40×40',
  }
}

export async function checkAccSpazi16(page) {
  const m = await page.evaluate(() => {
    const col = document.querySelector('main > div')
    const header = col?.querySelector(':scope > div:first-child')
    const card = col?.querySelector('[data-slot=card], .rounded-xl.border')
    const links = col?.querySelector(':scope > div:last-child')
    if (!header || !card) return null
    const gap1 = card.getBoundingClientRect().top - header.getBoundingClientRect().bottom
    let gap2 = null
    if (links && links !== card && links.querySelector('a')) {
      gap2 = links.getBoundingClientRect().top - card.getBoundingClientRect().bottom
    }
    return { gap1, gap2 }
  })
  if (!m) return { ok: false, misurato: 'layout non trovato', atteso: '16 px' }
  const ok1 = withinTolerance(m.gap1, 16, 1.5)
  const ok2 = m.gap2 == null || withinTolerance(m.gap2, 16, 1.5)
  return {
    ok: ok1 && ok2,
    misurato: `header→card ${Math.round(m.gap1)}px; card→link ${m.gap2 != null ? Math.round(m.gap2) : 'n/a'}px`,
    atteso: '16 px entrambe',
  }
}

export async function checkAccPaddingScheda(page) {
  const pad = await page.evaluate(() => {
    const card = document.querySelector('main [data-slot=card]')
    const inner = card?.querySelector('[data-slot=card-content]')
    if (!card || !inner) return null
    const first = inner.querySelector('[role=alert], [role=status], label, input, button, a, form')
    if (!first) return parseFloat(getComputedStyle(inner).paddingTop)
    return first.getBoundingClientRect().top - inner.getBoundingClientRect().top
  })
  if (pad == null) return { ok: false, misurato: 'non misurato', atteso: '16 px' }
  return {
    ok: withinTolerance(pad, 16, 1.5),
    misurato: `${Math.round(pad)} px`,
    atteso: '16 px padding scheda',
  }
}

export async function checkAccCentratura(page) {
  const d = await page.evaluate(() => {
    const col = document.querySelector('main > div')
    if (!col) return null
    const r = col.getBoundingClientRect()
    const above = r.top
    const below = window.innerHeight - r.bottom
    return { diff: Math.abs(above - below) }
  })
  if (!d) return { ok: false, misurato: 'colonna non trovata', atteso: 'diff <= 96 px' }
  return {
    ok: d.diff <= 96,
    misurato: `|sopra-sotto|=${Math.round(d.diff)} px`,
    atteso: 'differenza assoluta <= 2*48 px',
  }
}

export async function checkHomeTesti(page) {
  const data = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim()
    const desc = document.querySelector('main p')?.textContent?.trim()
    const cards = [...document.querySelectorAll('main a[href^="/app/"]')].map((a) => ({
      titolo: a.querySelector('.text-sm.font-medium')?.textContent?.trim(),
      desc: a.querySelector('.text-xs')?.textContent?.trim(),
      href: a.getAttribute('href'),
    }))
    return { h1, desc, cards }
  })
  const attesoOrder = [
    { titolo: 'Prenotazioni', desc: 'Elenco, eccezioni giorno, impostazioni', href: '/app/reservations' },
    { titolo: 'Menù', desc: 'Piatti, vini, bevande, distillati, menù fissi', href: '/app/menu' },
    { titolo: 'Orari', desc: 'Ristorante, B&B, giorni di riposo, chiusure', href: '/app/hours' },
  ]
  const ok =
    data.h1 === 'Area App' &&
    data.desc === 'Scegli una sezione.' &&
    JSON.stringify(data.cards) === JSON.stringify(attesoOrder)
  return { ok, misurato: JSON.stringify(data), atteso: JSON.stringify(attesoOrder) }
}

export async function checkHomeNessunaRigaStato(page) {
  const bad = await page.evaluate(() => {
    const issues = []
    document.querySelectorAll('main a[href^="/app/"]').forEach((a) => {
      const content = a.querySelector('[data-slot=card-content]')
      if (!content) return
      const lines = content.querySelectorAll(':scope > div > .text-sm, :scope > div > .text-xs')
      if (lines.length > 2) issues.push(`card ${a.getAttribute('href')}: ${lines.length} righe testo`)
    })
    return issues
  })
  return {
    ok: bad.length === 0,
    misurato: bad.length ? bad.join('; ') : 'solo titolo+descrizione',
    atteso: 'nessuna riga di stato',
  }
}

export async function checkHomeColonne(page, profiloKey) {
  const cols = await page.evaluate(() => {
    const lefts = new Set()
    document.querySelectorAll('main a[href^="/app/"]').forEach((a) => {
      lefts.add(Math.round(a.getBoundingClientRect().left))
    })
    return lefts.size
  })
  const attesoMap = { 'telefono-390': 1, 'soglia-768': 2, 'tablet-820': 2, 'notebook-1280': 3 }
  const expected = attesoMap[profiloKey] ?? 1
  return { ok: cols === expected, misurato: `${cols} colonne`, atteso: `${expected}` }
}

export async function checkShellBarraAlta(page) {
  const h = await page.evaluate(() => {
    const bar = document.querySelector('header')
    return bar ? bar.getBoundingClientRect().height : 0
  })
  return { ok: withinTolerance(h, 56, 1), misurato: `${Math.round(h)} px`, atteso: '56 px' }
}

export async function checkShellMargineContenuto(page, profiloKey) {
  const left = await page.evaluate(() => {
    const main = document.querySelector('[data-slot=sidebar-inset] main, main')
    const h1 = main?.querySelector('h1')
    if (!main || !h1) return -1
    return h1.getBoundingClientRect().left - main.getBoundingClientRect().left
  })
  const expected = { 'telefono-390': 16, 'soglia-768': 24, 'notebook-1280': 24 }[profiloKey] ?? 16
  const ok = withinTolerance(left, expected, 2)
  return {
    ok,
    avviso: true,
    misurato: `${Math.round(left)} px`,
    atteso: `${expected} px`,
  }
}

export async function checkShellSticky(page) {
  await page.evaluate(() => {
    const main = document.querySelector('main')
    if (!main) return
    const tall = document.createElement('div')
    tall.setAttribute('data-ui-verify', 'tall')
    tall.style.height = '2000px'
    main.appendChild(tall)
  })
  await page.evaluate(() => window.scrollBy(0, 600))
  await page.waitForTimeout(100)
  const top = await page.evaluate(() => document.querySelector('header')?.getBoundingClientRect().top ?? -1)
  await page.evaluate(() => {
    document.querySelector('[data-ui-verify="tall"]')?.remove()
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(100)
  return {
    ok: withinTolerance(top, 0, 0.5),
    misurato: `top header=${Math.round(top * 10) / 10}`,
    atteso: 'top = 0 dopo scroll 600px',
  }
}

export async function checkShellPassaggio768(page, profiloKey) {
  if (profiloKey === 'soglia-767') {
    const btn = await page.getByRole('button', { name: 'Apri o chiudi il menu' }).isVisible()
    const desktopW = await page.evaluate(() => {
      const bar = document.querySelector('[data-sidebar=sidebar]:not([data-mobile="true"])')
      if (!bar) return 0
      const r = bar.getBoundingClientRect()
      return r.width > 0 && r.left >= 0 ? Math.round(r.width) : 0
    })
    await openMobileSidebar(page)
    const panelW = await page.evaluate(() => {
      const sheet = document.querySelector('[data-sidebar=sidebar][data-mobile="true"]')
      return sheet ? Math.round(sheet.getBoundingClientRect().width) : 0
    })
    await page.keyboard.press('Escape')
    const ok = btn && desktopW < 200 && withinTolerance(panelW, 288, 4)
    return {
      ok,
      misurato: `desktopVis=${desktopW}px pannello=${panelW}px`,
      atteso: 'no barra fissa; pannello ~288px',
    }
  }
  const sw = await page.evaluate(() => {
    const bar = document.querySelector('[data-sidebar=sidebar]:not([data-mobile="true"])')
    return bar ? Math.round(bar.getBoundingClientRect().width) : 0
  })
  const ok = sw >= 250 && sw <= 262
  return { ok, misurato: `sidebar ${sw}px`, atteso: 'barra fissa ~256px a 768' }
}

export async function checkShellMenuVoci(page) {
  const data = await page.evaluate(() => {
    const groups = [...document.querySelectorAll('[data-sidebar="group-label"]')].map((g) => g.textContent?.trim())
    const itemsByGroup = {}
    document.querySelectorAll('[data-sidebar="group"]').forEach((g) => {
      const label = g.querySelector('[data-sidebar="group-label"]')?.textContent?.trim()
      const items = [...g.querySelectorAll('[data-sidebar="menu-button"] span')].map((s) => s.textContent?.trim()).filter(Boolean)
      if (label) itemsByGroup[label] = items
    })
    const navLinks = document.querySelectorAll('[data-sidebar=menu-button][href], a[data-sidebar=menu-button]').length
    return { groups, itemsByGroup, navLinks }
  })
  const atteso = {
    groups: ['Menù', 'Orari', 'Prenotazioni'],
    items: { Menù: ['Piatti'], Orari: ['Orari'], Prenotazioni: ['Elenco'] },
  }
  const ok =
    JSON.stringify(data.groups) === JSON.stringify(atteso.groups) &&
    JSON.stringify(data.itemsByGroup) === JSON.stringify(atteso.items) &&
    data.navLinks >= 3
  return { ok, misurato: JSON.stringify(data), atteso: JSON.stringify(atteso) }
}

export async function checkShellBloccoInCima(page) {
  const data = await page.evaluate(() => {
    const btn = document.querySelector('[data-sidebar="header"] [data-sidebar="menu-button"]')
    const title = btn?.querySelector('.font-medium')?.textContent?.trim()
    const role = btn?.querySelector('.text-xs')?.textContent?.trim()
    const link = btn?.querySelector('a[href]') ?? btn?.closest('a')
    const href = link?.getAttribute('href')
    return { title, role, href }
  })
  const ok = data.title === 'Area App' && data.role === 'Manager' && (data.href === '/app' || data.href?.endsWith('/app'))
  return { ok, misurato: JSON.stringify(data), atteso: 'Area App, Manager, /app' }
}

export async function checkShellBloccoUtente(page, email) {
  const expectedInitials = initialsFromEmail(email)
  const data = await page.evaluate(() => {
    const footer = document.querySelector('[data-sidebar=footer]')
    const text = footer?.textContent ?? ''
    const initials = footer?.querySelector('[data-slot=avatar-fallback], .rounded-lg')?.textContent?.trim()
    return { text, initials }
  })
  const ok = data.text.includes(email.split('@')[0].slice(0, 3)) && data.initials === expectedInitials
  return {
    ok,
    misurato: `iniziali=${data.initials}, attese=${expectedInitials}`,
    atteso: 'email visibile + iniziali corrette',
  }
}

export async function checkShellMenuUtente(page) {
  try {
    await openUserMenu(page)
  } catch (e) {
    return { ok: false, misurato: `menu non apribile: ${e.message}`, atteso: 'Tema+Esci, no Admin' }
  }
  const data = await page.evaluate(() => {
    const items = [...document.querySelectorAll('[role=menuitem], [role=menuitemradio]')].map((e) => e.textContent?.trim())
    const admin = items.some((t) => t?.includes('Admin'))
    return { items, admin }
  })
  await page.keyboard.press('Escape')
  const hasTheme = data.items.some((t) => t === 'Chiaro') && data.items.some((t) => t === 'Scuro') && data.items.some((t) => t === 'Sistema')
  const hasEsci = data.items.some((t) => t === 'Esci')
  const ok = hasTheme && hasEsci && !data.admin
  return { ok, misurato: JSON.stringify(data.items), atteso: 'Tema+Esci, no Admin' }
}

export async function checkShellTemaScelta(page, baseUrl) {
  await openUserMenu(page)
  for (const [label, cookie, dark] of [
    ['Scuro', 'dark', true],
    ['Chiaro', 'light', false],
    ['Sistema', 'system', false],
  ]) {
    await page.getByRole('menuitemradio', { name: label }).click({ force: true })
    await page.waitForTimeout(150)
    const hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    const cookies = await page.context().cookies(baseUrl)
    const themeCookie = cookies.find((c) => c.name === 'app-theme')?.value
    if (hasDark !== dark && label !== 'Sistema') {
      return { ok: false, misurato: `${label}: dark=${hasDark}`, atteso: `dark=${dark}` }
    }
    if (themeCookie !== cookie) {
      return { ok: false, misurato: `cookie=${themeCookie}`, atteso: cookie }
    }
    await page.reload({ waitUntil: 'networkidle' })
    const hasDark2 = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    const checked = await openUserMenuAndGetChecked(page, label)
    if (label !== 'Sistema' && hasDark2 !== dark) {
      return { ok: false, misurato: `dopo reload ${label} dark=${hasDark2}`, atteso: `dark=${dark}` }
    }
    if (!checked) {
      return { ok: false, misurato: `radio ${label} non selezionato dopo reload`, atteso: 'selezionato' }
    }
    await page.keyboard.press('Escape')
  }
  return { ok: true, misurato: 'Scuro/Chiaro/Sistema ok', atteso: 'classe html, cookie, persistenza' }
}

async function openUserMenuAndGetChecked(page, label) {
  await openUserMenu(page)
  const checked = await page.getByRole('menuitemradio', { name: label }).getAttribute('aria-checked')
  return checked === 'true'
}

export async function checkShellPercorsoVoceAttiva(page, path) {
  const atteso = PERCORSO_ATTESO[path]
  if (!atteso) return { ok: false, misurato: `path ${path} sconosciuto`, atteso: '—' }
  const data = await page.evaluate(() => {
    const crumbs = [...document.querySelectorAll('nav[aria-label="Percorso"] *')].map((e) => e.textContent?.trim()).filter(Boolean)
    const active = [...document.querySelectorAll('[data-sidebar="menu-button"][data-active] span')].map((s) => s.textContent?.trim())
    return { crumbs, active }
  })
  const crumbOk = atteso.breadcrumb.every((p) => data.crumbs.join(' ').includes(p))
  const activeOk = atteso.active === null ? data.active.length === 0 : data.active.includes(atteso.active)
  return {
    ok: crumbOk && activeOk,
    misurato: `crumbs=${data.crumbs.join('›')}; active=${data.active.join(',')}`,
    atteso: JSON.stringify(atteso),
  }
}

export async function checkShellNomiAccessibili(page) {
  const text = await page.evaluate(
    () =>
      document.body.innerText +
      ' ' +
      [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')).join(' '),
  )
  const found = ENGLISH_A11Y.filter((t) => text.includes(t))
  return { ok: found.length === 0, misurato: found.join(', ') || 'nessuno', atteso: 'nessun testo inglese elencato' }
}

export async function openUserMenu(page) {
  const w = page.viewportSize()?.width ?? 1280
  const trigger = page.locator('[data-sidebar="footer"] [data-sidebar="menu-button"]').first()
  if (w < 768) {
    const sheet = page.locator('[data-sidebar="sidebar"][data-mobile="true"]')
    if (!(await sheet.isVisible().catch(() => false))) {
      await openMobileSidebar(page)
      await page.waitForTimeout(400)
    }
  } else if (!(await trigger.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: 'Apri o chiudi il menu' }).click()
    await page.waitForTimeout(350)
  }
  await trigger.waitFor({ state: 'visible', timeout: 15000 })
  await trigger.click({ force: true })
  await page.waitForTimeout(200)
}

export async function openMobileSidebar(page) {
  await page.getByRole('button', { name: 'Apri o chiudi il menu' }).click()
  await page.waitForTimeout(200)
}

export async function consoleShellInteractions(page, profiloKey) {
  if (profiloKey === 'telefono-390') {
    await openMobileSidebar(page)
    await page.waitForTimeout(350)
  }
  await openUserMenu(page)
  for (const theme of ['Chiaro', 'Scuro', 'Sistema']) {
    await page.getByRole('menuitemradio', { name: theme }).click()
    await page.waitForTimeout(120)
  }
  await page.keyboard.press('Escape')
  if (profiloKey === 'telefono-390') await page.keyboard.press('Escape')
}
