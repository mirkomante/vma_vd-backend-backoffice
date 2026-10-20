#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const base = process.env.BASE_URL?.trim().replace(/\/$/, '')
if (!base) {
  console.error('BASE_URL obbligatoria')
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
let failed = false
const emit = (id, ok, measured) => {
  console.log(`${ok ? 'OK' : 'FALLITO'} ${id} ${measured}`)
  if (!ok) failed = true
}
const fetchOpts = { redirect: 'manual', credentials: 'omit' }
const loginDest = `${base}/app/login`
const loginLoc = (loc) => loc === '/app/login' || loc === loginDest || loc.endsWith('/app/login')

const on1 = await fetch(`${base}/app/login`, fetchOpts)
emit('on1', on1.status === 200 && (await on1.text()).includes('Area App'), `status=${on1.status}`)
const on2 = await fetch(`${base}/app`, fetchOpts)
const loc2 = on2.headers.get('location') ?? ''
emit('on2', on2.status === 307 && loginLoc(loc2), `status=${on2.status} location=${loc2}`)
const t0 = Date.now()
const on3 = await fetch(`${base}/app/logout`, { ...fetchOpts, method: 'POST' })
const loc3 = on3.headers.get('location') ?? ''
const setCookie = on3.headers.get('set-cookie') ?? ''
const expM = setCookie.match(/Expires=([^;]+)/i)
const expOk = expM && new Date(expM[1].trim()).getTime() <= t0 + 5000 && setCookie.toLowerCase().includes('payload-token')
emit('on3', on3.status === 303 && loginLoc(loc3) && expOk, `status=${on3.status} location=${loc3}`)
const on4Html = await (await fetch(`${base}/app/login/reset`, fetchOpts)).text()
const on4Bad = /<(form|input|button)\b/i.test(on4Html)
emit('on4', !on4Bad, `interactive=${on4Bad}`)
const on5Html = await (await fetch(`${base}/app/login/reset?token=prova&resetFailed=1`, fetchOpts)).text()
emit('on5', on5Html.includes('name="password"') && on5Html.includes(RESET_FAIL), `password+msg`)
const on6 = await fetch(`${base}/app/login/verify`, fetchOpts)
emit('on6', on6.status === 200 && (await on6.text()).includes(VERIFY_FAIL), `status=${on6.status}`)
const menuParts = []
let menuOk = true
for (const route of MENU_ROUTES) {
  const r = await fetch(`${base}${route}`, fetchOpts)
  const loc = r.headers.get('location') ?? ''
  const ok = r.status >= 300 && r.status < 400 && r.status !== 404 && r.status < 500 && loginLoc(loc) && !loc.includes('localhost')
  if (!ok) menuOk = false
  menuParts.push(`${route}:${r.status}->${loc}`)
}
emit('on-menu-1', menuOk, menuParts.join('; '))
process.exit(failed ? 1 : 0)
