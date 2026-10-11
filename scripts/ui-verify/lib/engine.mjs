import { TOUCH_MEASURE_FN } from './touch.mjs'

export const LAUNCHER_VERSION = '1.0.0'

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

export function withinTolerance(value, expected, tol = 0) {
  return Math.abs(value - expected) <= tol
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
    const sel =
      'button,a[href],input:not([type=hidden]),textarea,select,[role=menuitem],[role=tab]'
    const out = []
    document.querySelectorAll(sel).forEach((e) => {
      const r = e.getBoundingClientRect()
      if (r.width < 2 || r.height < 2) return
      if (getComputedStyle(e).visibility === 'hidden') return
      out.push(Math.round(r.height))
    })
    return out
  })
  const outOf = heights.filter((h) => h < 28 || h > 48)
  return {
    ok: outOf.length === 0,
    avviso: true,
    misurato: outOf.length ? `fuori intervallo: ${outOf.join(', ')} px (tutte: ${heights.slice(0, 12).join(',')}…)` : 'tutte in [28,48]',
    atteso: 'altezze in [28, 48] px',
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
  await page.context().addCookies([
    { name: 'app-theme', value: 'system', url: baseUrl },
  ])
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
    const links = [...document.querySelectorAll('main a')].map((a) => a.textContent?.trim()).filter(Boolean)
    return { h1, desc, google, accedi, sep, labels, links }
  })
  const atteso = {
    h1: 'Area App',
    desc: 'Accedi con Google oppure con email e password.',
    google: 'Accedi con Google',
    accedi: 'Accedi',
    labels: ['Email', 'Password'],
    links: ['Password dimenticata?', 'Torna al sito'],
  }
  const mis = JSON.stringify(data)
  const ok =
    data.h1 === atteso.h1 &&
    data.desc === atteso.desc &&
    data.google === atteso.google &&
    data.accedi === atteso.accedi &&
    data.sep &&
    JSON.stringify(data.labels) === JSON.stringify(atteso.labels) &&
    JSON.stringify(data.links) === JSON.stringify(atteso.links)
  return { ok, misurato: mis, atteso: JSON.stringify(atteso) }
}

export async function checkGerarchiaLogin(page) {
  return await page.evaluate(() => {
    const google = [...document.querySelectorAll('a')].find((a) => a.textContent?.includes('Google'))
    const accedi = [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Accedi')
    if (!google || !accedi) return { ok: false, detail: 'elementi non trovati' }
    const bgG = getComputedStyle(google).backgroundColor
    const bgA = getComputedStyle(accedi).backgroundColor
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary') || ''
    return { ok: bgG !== bgA, bgG, bgA, primary }
  }).then((r) => ({
    ok: r.ok,
    misurato: typeof r.detail === 'string' ? r.detail : `Google bg ${r.bgG}, Accedi bg ${r.bgA}`,
    atteso: 'sfondi Google e Accedi diversi; Google ≈ primary',
  }))
}

export async function checkAccFuoriShell(page) {
  const n = await page.locator('[data-slot=sidebar], [data-slot=sidebar-trigger], nav[aria-label="Percorso"]').count()
  return { ok: n === 0, misurato: `${n} elementi shell`, atteso: '0' }
}

export async function checkCollegamentiSottolineati(page) {
  const res = await page.evaluate(() => {
    const links = [...document.querySelectorAll('main .flex.flex-col.items-center a, main + div a, main ~ div a')]
    if (!links.length) {
      const alt = [...document.querySelectorAll('main')].flatMap((m) => [...m.parentElement?.querySelectorAll('a') ?? []])
      return alt.map((a) => getComputedStyle(a).textDecorationLine)
    }
    return links.map((a) => getComputedStyle(a).textDecorationLine)
  })
  const bad = res.filter((d) => !d.includes('underline'))
  return {
    ok: res.length > 0 && bad.length === 0,
    misurato: res.join(', ') || 'nessun link',
    atteso: 'underline su tutti i collegamenti sotto la scheda',
  }
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

export async function checkAccMargine(page) {
  const left = await page.evaluate(() => {
    const card = document.querySelector('[data-slot=card], .rounded-xl.border')
    return card ? card.getBoundingClientRect().left : -1
  })
  const expected = 16
  return {
    ok: withinTolerance(left, expected, 1.5),
    misurato: `${Math.round(left)} px`,
    atteso: '16 px sotto 768',
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

export async function checkHomeTesti(page) {
  const data = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim()
    const desc = document.querySelector('main p')?.textContent?.trim()
    const cards = [...document.querySelectorAll('main a[href^="/app/"]')].map((a) => ({
      titolo: a.querySelector('h2,h3')?.textContent?.trim(),
      desc: a.querySelector('p')?.textContent?.trim(),
      href: a.getAttribute('href'),
    }))
    return { h1, desc, cards }
  })
  const attesoOrder = [
    { titolo: 'Prenotazioni', descrizione: 'Elenco, eccezioni giorno, impostazioni', href: '/app/reservations' },
    { titolo: 'Menù', descrizione: 'Piatti, vini, bevande, distillati, menù fissi', href: '/app/menu' },
    { titolo: 'Orari', descrizione: 'Ristorante, B&B, giorni di riposo, chiusure', href: '/app/hours' },
  ]
  const ok =
    data.h1 === 'Area App' &&
    data.desc === 'Scegli una sezione.' &&
    JSON.stringify(data.cards) === JSON.stringify(attesoOrder.map((x) => ({ titolo: x.titolo, desc: x.descrizione, href: x.href })))
  return { ok, misurato: JSON.stringify(data), atteso: JSON.stringify(attesoOrder) }
}

export async function checkHomeColonne(page, profiloKey, profili) {
  const cols = await page.evaluate(() => {
    const lefts = new Set()
    document.querySelectorAll('main a[href^="/app/"] [data-slot=card], main a[href^="/app/"] .rounded-xl').forEach((el) => {
      const a = el.closest('a')
      if (a) lefts.add(Math.round(a.getBoundingClientRect().left))
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

export async function checkShellNomiAccessibili(page) {
  const text = await page.evaluate(() => document.body.innerText + ' ' + [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')).join(' '))
  const found = ENGLISH_A11Y.filter((t) => text.includes(t))
  return { ok: found.length === 0, misurato: found.join(', ') || 'nessuno', atteso: 'nessun testo inglese elencato' }
}

export async function openUserMenu(page) {
  const trigger = page.locator('[data-sidebar="menu-button"]').last()
  await trigger.click()
  await page.waitForTimeout(150)
}

export async function openMobileSidebar(page) {
  await page.getByRole('button', { name: 'Apri o chiudi il menu' }).click()
  await page.waitForTimeout(200)
}
