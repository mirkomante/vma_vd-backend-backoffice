#!/usr/bin/env node
// Smoke online senza credenziali (on1-on6 di controlli-8.2.json e on-menu-1 di controlli-6.6.json). Solo richieste HTTP.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const base = process.env.BASE_URL?.trim().replace(/\/$/, '')
if (!base || !/^https?:\/\//.test(base)) {
  console.error('BASE_URL obbligatoria (http o https, senza /app)')
  process.exit(1)
}
const msgSrc = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../lib/auth/localEmail/messages.ts'), 'utf8')
const extract = (name) => {
  const m = msgSrc.match(new RegExp(`export const ${name}\\s*=\\s*\\n?\\s*'([^']*)'`))
  if (!m) throw new Error(`costante ${name} non trovata`)
  return m[1]
}
const RESET_FAIL = extract('GENERIC_RESET_FAILURE_MESSAGE')
const VERIFY_FAIL = extract('GENERIC_VERIFY_FAILURE_MESSAGE')
const MENU_ROUTES = ['/app/menu', '/app/menu/wines', '/app/menu/spirits', '/app/menu/drinks', '/app/menu/services', '/app/menu/fixed', '/app/menu/fixed/categories', '/app/menu/special-days', '/app/menu/message']
const TIMEOUT_MS = Number(process.env.ONLINE_SMOKE_TIMEOUT_MS) || 15000
let failed = false
const emit = (id, ok, measured) => {
  console.log(`${ok ? 'OK' : 'FALLITO'} ${id} ${measured}`)
  if (!ok) failed = true
}
const get = (path, init = {}) => fetch(`${base}${path}`, { redirect: 'manual', credentials: 'omit', signal: AbortSignal.timeout(TIMEOUT_MS), ...init })
// Destinazione ammessa: /app/login relativa, oppure assoluta con l'origine di BASE_URL. Mai 0.0.0.0, mai localhost (se BASE_URL non lo è).
const toLogin = (loc) => loc === '/app/login' || loc === `${base}/app/login`
const check = async (id, fn) => {
  try {
    const [ok, measured] = await fn()
    emit(id, ok, measured)
  } catch (e) {
    emit(id, false, `errore: ${e?.cause?.code ?? e?.name ?? 'sconosciuto'} ${e?.message ?? ''}`.trim())
  }
}

await check('on1', async () => {
  const r = await get('/app/login')
  return [r.status === 200 && (await r.text()).includes('Area App'), `status=${r.status}`]
})
await check('on2', async () => {
  const r = await get('/app')
  const loc = r.headers.get('location') ?? ''
  return [r.status === 307 && toLogin(loc), `status=${r.status} location=${loc}`]
})
await check('on3', async () => {
  const t0 = Date.now()
  const r = await get('/app/logout', { method: 'POST' })
  const loc = r.headers.get('location') ?? ''
  const cookie = r.headers.get('set-cookie') ?? ''
  const exp = cookie.match(/Expires=([^;]+)/i)
  const expired = Boolean(exp) && new Date(exp[1].trim()).getTime() <= t0 + 5000 && cookie.toLowerCase().includes('payload-token')
  return [r.status === 303 && toLogin(loc) && expired, `status=${r.status} location=${loc} cookieScaduto=${expired}`]
})
await check('on4', async () => {
  const html = await (await get('/app/login/reset')).text()
  const interactive = /<(form|input|button)\b/i.test(html)
  return [!interactive, `interactive=${interactive}`]
})
await check('on5', async () => {
  const html = await (await get('/app/login/reset?token=prova&resetFailed=1')).text()
  return [html.includes('name="password"') && html.includes(RESET_FAIL), 'campo password e avviso']
})
await check('on6', async () => {
  const r = await get('/app/login/verify')
  return [r.status === 200 && (await r.text()).includes(VERIFY_FAIL), `status=${r.status}`]
})
await check('on-menu-1', async () => {
  const parts = []
  let ok = true
  for (const route of MENU_ROUTES) {
    const r = await get(route)
    const loc = r.headers.get('location') ?? ''
    if (!(r.status >= 300 && r.status < 400 && toLogin(loc))) ok = false
    parts.push(`${route}:${r.status}->${loc}`)
  }
  return [ok, parts.join('; ')]
})
process.exit(failed ? 1 : 0)
