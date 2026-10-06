/**
 * Verifica permessi fase-7.4 su `impostazioni-sistema`.
 * Eseguire solo su `vma_vd_migr`:
 *   DATABASE_URL=postgresql://…/vma_vd_migr pnpm payload run scripts/verify-system-settings-7_4.ts
 *
 * REST: richiede dev su APP_PUBLIC_URL con lo **stesso** `DATABASE_URL` (solo `vma_vd_migr`), es.:
 *   `node scripts/run-with-vma-vd-migr-env.mjs pnpm dev`
 *   `node scripts/run-with-vma-vd-migr-env.mjs pnpm payload run scripts/verify-system-settings-7_4.ts`
 * Update Global via REST: **POST** (non PATCH). JWT admin di prova: firmare con `payload.secret` da `getPayload`.
 */
import config from '@payload-config'
import { APIError, createLocalReq, getFieldsToSign, getPayload, jwtSign } from 'payload'

import { withSessionStrategyClaim } from '@/lib/auth/jwt/sessionStrategyClaim'
import { LOCAL_JWT_STRATEGY_ADMIN } from '@/lib/auth/localLogin/constants'
import { SYSTEM_SETTINGS_SLUG } from '@/globals/SystemSettings'
import type { User } from '@/payload-types'

const TEST_RUN_ID = Date.now().toString(36)
const TEST_EMAIL_PREFIX = `verify-7_4-${TEST_RUN_ID}-`
const TEST_PASSWORD = 'Verify7_4!AaBbCc'
/** Chiavi ammesse in REST anonimo (Payload 3.90.2: array riservati restano come chiave con `[]`). */
const PUBLIC_REST_KEYS = new Set([
  'services',
  'weeklyClosedDays',
  'annualClosures',
  'bnb',
  'id',
  'createdAt',
  'updatedAt',
  'globalType',
  'resendSenders',
  'staffNotificationContacts',
])

const validServices = [
  { name: 'lunch' as const, startTime: '12:30', endTime: '14:30' },
  { name: 'dinner' as const, startTime: '19:30', endTime: '22:00' },
]

type Outcome = 'ok' | 'denied' | 'hidden' | 'unchanged' | 'changed' | 'error' | 'skipped'

const outcomeRows: string[] = []
const notTestedNotes: string[] = []

function logOutcome(profile: string, action: string, field: string, outcome: Outcome, detail = ''): void {
  const line = `${profile}\t${action}\t${field}\t${outcome}${detail ? `\t${detail}` : ''}`
  outcomeRows.push(line)
  console.log(line.replace(/\t/g, ' | '))
}

function noteNotTested(message: string): void {
  notTestedNotes.push(message)
  console.log(`[non provato] ${message}`)
}

function isAccessDenied(error: unknown): boolean {
  return error instanceof APIError && error.status === 403
}

function keysOf(doc: Record<string, unknown>): string[] {
  return Object.keys(doc).sort()
}

/** Campo riservato «visibile» solo se ha un valore sostanziale (array non vuoto o text valorizzato). */
function privateFieldHasValue(doc: Record<string, unknown>, field: string): boolean {
  if (!(field in doc)) {
    return false
  }
  const value = doc[field]
  if (value == null || value === '') {
    return false
  }
  if (Array.isArray(value)) {
    return value.length > 0
  }
  return true
}

function assertExactPublicKeys(doc: Record<string, unknown>, label: string): void {
  const keys = keysOf(doc)
  const expected = [...PUBLIC_REST_KEYS].sort()
  if (keys.length !== expected.length || keys.some((k, i) => k !== expected[i])) {
    throw new Error(
      `${label}: chiavi attese ${expected.join(', ')}, trovate ${keys.join(', ')}`,
    )
  }
}

function appPublicUrl(): string {
  return (process.env.APP_PUBLIC_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}

function restAuthHeaders(token: string, cookiePrefix = 'payload'): Record<string, string> {
  return {
    Accept: 'application/json',
    Authorization: `JWT ${token}`,
    Cookie: `${cookiePrefix}-token=${token}`,
  }
}

async function restGet(path: string, token?: string, cookiePrefix?: string): Promise<Response> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) {
    Object.assign(headers, restAuthHeaders(token, cookiePrefix))
  }
  return fetch(`${appPublicUrl()}${path}`, { headers })
}

async function restPatchGlobal(
  token: string,
  data: Record<string, unknown>,
  locale = 'it',
  cookiePrefix = 'payload',
): Promise<Response> {
  return fetch(`${appPublicUrl()}/api/globals/impostazioni-sistema?locale=${locale}`, {
    method: 'POST',
    headers: {
      ...restAuthHeaders(token, cookiePrefix),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

function extractPayloadTokenFromSetCookie(res: Response): string {
  const rawCookies =
    typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : [res.headers.get('set-cookie')].filter((c): c is string => Boolean(c))

  for (const chunk of rawCookies) {
    const match = /(?:^|,\s*)payload-token=([^;]+)/.exec(chunk)
    if (match?.[1]) {
      return decodeURIComponent(match[1])
    }
  }
  throw new Error('Risposta login: cookie payload-token assente')
}

async function restLoginApp(email: string, password: string): Promise<string> {
  const res = await fetch(`${appPublicUrl()}/api/users/login/app`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
    redirect: 'manual',
  })
  if (res.status !== 302) {
    throw new Error(`login/app atteso 302, ricevuto ${res.status}`)
  }
  const location = res.headers.get('location') ?? ''
  if (location.includes('authFailed')) {
    throw new Error(
      `login/app rifiutato (${location}). Stesso DATABASE_URL su dev e script (vma_vd_migr)?`,
    )
  }
  return extractPayloadTokenFromSetCookie(res)
}

async function assertRestMeAuthenticates(
  token: string,
  expectedEmail: string,
  cookiePrefix = 'payload',
): Promise<void> {
  const res = await restGet('/api/users/me', token, cookiePrefix)
  if (!res.ok) {
    throw new Error(
      `JWT non autentica: GET /api/users/me → ${res.status}. Verificare PAYLOAD_SECRET e che le strategie JWT siano registrate (GOOGLE_CLIENT_ID/SECRET nel .env).`,
    )
  }
  const body = (await res.json()) as { user?: { email?: string } | null }
  const email = body.user?.email?.toLowerCase()
  if (email !== expectedEmail.toLowerCase()) {
    throw new Error(
      `JWT non autentica: /api/users/me email=${body.user?.email ?? 'null'}, atteso ${expectedEmail}`,
    )
  }
}

/** Manager App: `Users.access.read` è staff-only — il token si prova su GET Global (200 = autenticato). */
async function assertRestAppTokenAuthenticates(token: string, cookiePrefix = 'payload'): Promise<void> {
  const res = await restGet('/api/globals/impostazioni-sistema?locale=it', token, cookiePrefix)
  if (res.status === 401 || res.status === 403) {
    throw new Error(
      `Token login/app non autentica: GET impostazioni-sistema → ${res.status}. Stesso PAYLOAD_SECRET su dev e script?`,
    )
  }
  if (res.status !== 200) {
    throw new Error(`Token login/app: GET impostazioni-sistema → ${res.status} inatteso`)
  }
}

function assertStaffPrivateProbeValues(doc: Record<string, unknown>, label: string): void {
  if (doc.googleCalendarId !== probeGoogleId) {
    throw new Error(`${label}: googleCalendarId atteso ${probeGoogleId}, trovato ${doc.googleCalendarId}`)
  }
  const senders = doc.resendSenders as unknown[] | undefined
  if (!Array.isArray(senders) || senders.length < 1) {
    throw new Error(`${label}: resendSenders probe assente`)
  }
  const staff = doc.staffNotificationContacts as unknown[] | undefined
  if (!Array.isArray(staff) || staff.length < 1) {
    throw new Error(`${label}: staffNotificationContacts probe assente`)
  }
}

function assertRestPrivateFieldsWithoutValues(doc: Record<string, unknown>, label: string): void {
  if (
    'googleCalendarId' in doc &&
    doc.googleCalendarId != null &&
    doc.googleCalendarId !== ''
  ) {
    throw new Error(`${label}: googleCalendarId valorizzato nel JSON REST`)
  }
  for (const key of ['resendSenders', 'staffNotificationContacts'] as const) {
    if (!(key in doc)) {
      continue
    }
    const value = doc[key]
    if (Array.isArray(value) && value.length === 0) {
      continue
    }
    throw new Error(
      `${label}: ${key} deve essere assente o array vuoto (Payload 3.90.2), trovato ${JSON.stringify(value)}`,
    )
  }
}

function assertPublicOrariMatchRest(
  json: Record<string, unknown>,
  label: string,
  expectedBnb: { checkInTime: string; checkOutTime: string } = probeBnb,
): void {
  const bnb = json.bnb as { checkInTime?: string; checkOutTime?: string } | undefined
  if (bnb?.checkInTime !== expectedBnb.checkInTime || bnb?.checkOutTime !== expectedBnb.checkOutTime) {
    throw new Error(
      `${label}: bnb atteso ${JSON.stringify(expectedBnb)}, trovato ${JSON.stringify(bnb)}. ` +
        'Verificare che `pnpm dev` usi lo stesso DATABASE_URL (vma_vd_migr) dello script.',
    )
  }
  const days = json.weeklyClosedDays as string[] | undefined
  if (!Array.isArray(days) || days.length !== 1 || days[0] !== probeWeeklyClosedDays[0]) {
    throw new Error(
      `${label}: weeklyClosedDays atteso ${JSON.stringify(probeWeeklyClosedDays)}, trovato ${JSON.stringify(days)}. ` +
        'Verificare che `pnpm dev` usi lo stesso DATABASE_URL (vma_vd_migr) dello script.',
    )
  }
}

let probeGoogleId: string
let probeBnb: { checkInTime: string; checkOutTime: string }
let probeWeeklyClosedDays: string[]

async function main(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL ?? ''
  if (!/\/vma_vd_migr(\?|$)/.test(dbUrl)) {
    throw new Error('DATABASE_URL deve puntare esclusivamente al database vma_vd_migr.')
  }

  probeGoogleId = 'verify-7_4-calendar@test.local'
  probeBnb = { checkInTime: '15:00', checkOutTime: '09:47' }
  probeWeeklyClosedDays = ['monday' as const]
  const probeResend = [
    {
      site: 'vietnamonamour' as const,
      name: 'Verify VN',
      address: 'verify-vn@example.com',
    },
  ]
  const probeStaff = [{ name: 'Verify Staff', email: 'verify-staff@example.com' }]

  const payload = await getPayload({ config })
  const createdUserIds: (number | string)[] = []
  const usersCollection = payload.collections.users.config
  /** Stesso secret del dev (`getPayload`), non `process.env.PAYLOAD_SECRET` (può differire in lunghezza/formato). */
  const jwtSecret = payload.secret

  async function signRestJwt(user: User, strategy: string): Promise<string> {
    const sessionUser = Object.assign({ ...user, collection: 'users' as const }, { _strategy: strategy })
    const fieldsToSign = withSessionStrategyClaim(
      getFieldsToSign({
        collectionConfig: usersCollection,
        email: user.email || '',
        user: sessionUser,
      }),
      strategy,
    )
    const { token } = await jwtSign({
      fieldsToSign,
      secret: jwtSecret,
      tokenExpiration: 7200,
    })
    return token
  }

  async function createTestUser(data: {
    email: string
    adminRole: User['adminRole']
    appRole: User['appRole']
    active: boolean
    withLocalPassword?: boolean
  }): Promise<User> {
    const doc = await payload.create({
      collection: 'users',
      overrideAccess: true,
      depth: 0,
      data: {
        email: data.email,
        adminRole: data.adminRole,
        appRole: data.appRole,
        loginMethod: 'sso',
        active: data.active,
        emailVerified: true,
      },
    })
    createdUserIds.push(doc.id)
    let user = doc as User
    if (data.withLocalPassword) {
      user = (await payload.update({
        collection: 'users',
        id: doc.id,
        overrideAccess: true,
        depth: 0,
        data: {
          loginMethod: 'local',
          emailVerified: true,
          password: TEST_PASSWORD,
          passwordConfirm: TEST_PASSWORD,
        },
      })) as User
    }
    return user
  }

  async function cleanupUsers(): Promise<void> {
    for (const id of createdUserIds) {
      await payload.delete({ collection: 'users', id, overrideAccess: true, depth: 0 })
    }
  }

  try {
    const baseline = await payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
    })

    await payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
      data: {
        services: validServices,
        weeklyClosedDays: probeWeeklyClosedDays as ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[],
        bnb: probeBnb,
        googleCalendarId: probeGoogleId,
        resendSenders: probeResend,
        staffNotificationContacts: probeStaff,
      },
    })
    const afterProbeWrite = await payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
    })
    if (afterProbeWrite.googleCalendarId !== probeGoogleId) {
      throw new Error(
        `Probe write: googleCalendarId atteso ${probeGoogleId}, trovato ${afterProbeWrite.googleCalendarId}`,
      )
    }
    if ((afterProbeWrite.resendSenders?.length ?? 0) < 1) {
      throw new Error('Probe write: resendSenders vuoto')
    }
    if ((afterProbeWrite.staffNotificationContacts?.length ?? 0) < 1) {
      throw new Error('Probe write: staffNotificationContacts vuoto')
    }
    if (
      afterProbeWrite.bnb?.checkOutTime !== probeBnb.checkOutTime ||
      afterProbeWrite.bnb?.checkInTime !== probeBnb.checkInTime
    ) {
      throw new Error(
        `Probe write: bnb atteso ${JSON.stringify(probeBnb)}, trovato ${JSON.stringify(afterProbeWrite.bnb)}`,
      )
    }
    console.log('Valori di prova scritti su tutti i campi non pubblici e Orari.')

    const localOrariProbe = await payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
    })
    const restOrariProbeRes = await restGet('/api/globals/impostazioni-sistema?locale=it')
    if (!restOrariProbeRes.ok) {
      throw new Error(`REST preflight: atteso 200, ${restOrariProbeRes.status}`)
    }
    const restOrariProbe = (await restOrariProbeRes.json()) as Record<string, unknown>
    const localBnb = localOrariProbe.bnb
    const restBnb = restOrariProbe.bnb as { checkOutTime?: string } | undefined
    if (restBnb?.checkOutTime !== localBnb?.checkOutTime) {
      throw new Error(
        `REST e script non condividono lo stesso database (locale checkout ${localBnb?.checkOutTime}, REST ${restBnb?.checkOutTime}). ` +
          'Impostare DATABASE_URL=vma_vd_migr nel .env e riavviare `pnpm dev`.',
      )
    }

    const serverRead = await payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
    })
    if (
      serverRead.googleCalendarId !== probeGoogleId ||
      (serverRead.resendSenders?.length ?? 0) < 1 ||
      (serverRead.staffNotificationContacts?.length ?? 0) < 1
    ) {
      throw new Error(
        'Lettura server Fase 5 (findGlobal overrideAccess:true senza utente/context) non restituisce i campi riservati di prova',
      )
    }
    logOutcome('server-fase-5', 'Local API', 'findGlobal overrideAccess:true', 'ok', 'campi riservati presenti')

    const fase5RestReq = await createLocalReq({ depth: 0 }, payload)
    fase5RestReq.payloadAPI = 'REST'
    const fase5WithRestReq = await payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
      req: fase5RestReq,
    })
    assertStaffPrivateProbeValues(
      fase5WithRestReq as unknown as Record<string, unknown>,
      'Fase 5 findGlobal(req payloadAPI REST, overrideAccess:true)',
    )
    logOutcome(
      'server-fase-5',
      'Local API',
      'req payloadAPI:REST + overrideAccess:true',
      'ok',
      'campi riservati probe',
    )

    const restPaths = [
      '/api/globals/impostazioni-sistema?locale=it',
      '/api/globals/impostazioni-sistema?locale=it&depth=2',
      '/api/globals/impostazioni-sistema?locale=it&select[resendSenders]=true',
    ]
    for (const path of restPaths) {
      const res = await restGet(path)
      if (res.status !== 200) {
        throw new Error(`REST anonimo ${path}: atteso 200, ricevuto ${res.status}`)
      }
      const json = (await res.json()) as Record<string, unknown>
      assertRestPrivateFieldsWithoutValues(json, `REST anonimo ${path}`)
      if (path.includes('select[resendSenders]')) {
        assertRestPrivateFieldsWithoutValues(json, 'REST select resendSenders')
        if (!Array.isArray(json.resendSenders) || json.resendSenders.length !== 0) {
          throw new Error('REST select resendSenders: atteso [] senza righe')
        }
        logOutcome('anonimo', 'REST GET', 'select resendSenders', 'hidden', 'chiave con []')
      } else {
        assertExactPublicKeys(json, `REST anonimo ${path}`)
        assertPublicOrariMatchRest(json, `REST anonimo ${path}`)
        logOutcome('anonimo', 'REST GET', path.split('?')[0] ?? path, 'ok', 'chiavi pubbliche + orari probe')
      }
    }

    const adminUser = await createTestUser({
      email: `${TEST_EMAIL_PREFIX}admin@example.com`,
      adminRole: 'admin',
      appRole: 'none',
      active: true,
    })
    const superAdminUser = await createTestUser({
      email: `${TEST_EMAIL_PREFIX}super@example.com`,
      adminRole: 'super-admin',
      appRole: 'none',
      active: true,
    })
    const managerUser = await createTestUser({
      email: `${TEST_EMAIL_PREFIX}manager@example.com`,
      adminRole: 'none',
      appRole: 'manager',
      active: true,
      withLocalPassword: true,
    })
    const noRoleUser = {
      id: 0,
      adminRole: 'none',
      appRole: 'none',
      active: true,
      email: `${TEST_EMAIL_PREFIX}norole-synthetic@example.com`,
    } as User

    const inactiveAdmin = await createTestUser({
      email: `${TEST_EMAIL_PREFIX}inactive-admin@example.com`,
      adminRole: 'admin',
      appRole: 'none',
      active: true,
    })
    const inactiveManager = await createTestUser({
      email: `${TEST_EMAIL_PREFIX}inactive-mgr@example.com`,
      adminRole: 'none',
      appRole: 'manager',
      active: true,
      withLocalPassword: true,
    })

    const cookiePrefix = payload.config.cookiePrefix || 'payload'

    const managerRestToken = await restLoginApp(managerUser.email!, TEST_PASSWORD)
    await assertRestAppTokenAuthenticates(managerRestToken, cookiePrefix)
    logOutcome('manager', 'REST auth', 'login/app', 'ok', 'GET Global 200 (Users.read staff-only)')

    const inactiveManagerRestToken = await restLoginApp(inactiveManager.email!, TEST_PASSWORD)
    await assertRestAppTokenAuthenticates(inactiveManagerRestToken, cookiePrefix)

    const adminRestToken = await signRestJwt(adminUser, LOCAL_JWT_STRATEGY_ADMIN)
    await assertRestMeAuthenticates(adminRestToken, adminUser.email!, cookiePrefix)
    logOutcome('admin', 'REST auth', 'JWT local-jwt', 'ok', '/api/users/me verificato')

    const inactiveAdminRestToken = await signRestJwt(inactiveAdmin, LOCAL_JWT_STRATEGY_ADMIN)
    await assertRestMeAuthenticates(inactiveAdminRestToken, inactiveAdmin.email!, cookiePrefix)

    await payload.update({
      collection: 'users',
      id: inactiveAdmin.id,
      overrideAccess: true,
      depth: 0,
      data: { active: false },
    })
    await payload.update({
      collection: 'users',
      id: inactiveManager.id,
      overrideAccess: true,
      depth: 0,
      data: { active: false },
    })
    inactiveAdmin.active = false
    inactiveManager.active = false

    noteNotTested('super-admin REST (solo Local API in questo script)')
    noteNotTested('senza-ruoli REST (profilo sintetico, nessun utente DB con entrambi i ruoli none)')

    type Profile = { name: string; user?: User }

    const profiles: Profile[] = [
      { name: 'anonimo-local' },
      { name: 'admin', user: adminUser },
      { name: 'super-admin', user: superAdminUser },
      { name: 'manager', user: managerUser },
      { name: 'senza-ruoli', user: noRoleUser },
    ]

    async function tryRead(user: User | undefined): Promise<Record<string, unknown> | null> {
      try {
        const doc = await payload.findGlobal({
          slug: SYSTEM_SETTINGS_SLUG,
          depth: 0,
          overrideAccess: false,
          user,
        })
        return doc as unknown as Record<string, unknown>
      } catch (error) {
        if (isAccessDenied(error)) {
          return null
        }
        throw error
      }
    }

    for (const profile of profiles) {
      const doc = await tryRead(profile.user)
      if (doc === null) {
        logOutcome(profile.name, 'Local API read', 'global', 'denied')
        if (profile.name === 'senza-ruoli') {
          continue
        }
        throw new Error(`${profile.name}: lettura Local API doveva essere consentita`)
      }
      logOutcome(profile.name, 'Local API read', 'global', 'ok')

      const isStaff =
        profile.user?.adminRole === 'admin' || profile.user?.adminRole === 'super-admin'
      const isManager = profile.name === 'manager'
      const isAnon = !profile.user

      const pubOk = 'services' in doc && 'bnb' in doc
      logOutcome(profile.name, 'Local API read', 'services/bnb', pubOk ? 'ok' : 'error')
      if (!pubOk) {
        throw new Error(`${profile.name}: campi Orari mancanti`)
      }

      const privFields = ['googleCalendarId', 'resendSenders', 'staffNotificationContacts'] as const
      for (const field of privFields) {
        const hasValue = privateFieldHasValue(doc, field)
        if (isStaff) {
          logOutcome(profile.name, 'Local API read', field, hasValue ? 'ok' : 'error')
          if (!hasValue) {
            throw new Error(`${profile.name}: staff doveva leggere ${field}`)
          }
        } else if (isManager || isAnon) {
          logOutcome(profile.name, 'Local API read', field, hasValue ? 'error' : 'hidden')
          if (hasValue) {
            throw new Error(`${profile.name}: ${field} non doveva avere valore`)
          }
        } else if (profile.name === 'senza-ruoli') {
          logOutcome(profile.name, 'Local API read', field, hasValue ? 'error' : 'hidden')
          if (hasValue) {
            throw new Error('senza-ruoli: campo riservato visibile')
          }
        }
      }
    }

    async function tryUpdate(user: User | undefined, data: Record<string, unknown>): Promise<boolean> {
      try {
        await payload.updateGlobal({
          slug: SYSTEM_SETTINGS_SLUG,
          depth: 0,
          overrideAccess: false,
          user,
          data,
        })
        return true
      } catch (error) {
        if (isAccessDenied(error)) {
          return false
        }
        throw error
      }
    }

    for (const profile of profiles) {
      const orariOk = await tryUpdate(profile.user, {
        bnb: { checkInTime: probeBnb.checkInTime, checkOutTime: probeBnb.checkOutTime },
      })
      const privOk = await tryUpdate(profile.user, { googleCalendarId: probeGoogleId })
      const name = profile.name
      const staff = profile.user?.adminRole === 'admin' || profile.user?.adminRole === 'super-admin'
      const manager = profile.name === 'manager'
      const anon = !profile.user
      const noRole = name === 'senza-ruoli'

      if (noRole || anon) {
        logOutcome(name, 'Local API update', 'bnb', orariOk ? 'error' : 'denied')
        logOutcome(name, 'Local API update', 'googleCalendarId', privOk ? 'error' : 'denied')
        if (orariOk || privOk) {
          throw new Error(`${name}: update Local API doveva essere negato`)
        }
      } else if (staff) {
        logOutcome(name, 'Local API update', 'bnb', orariOk ? 'ok' : 'denied')
        logOutcome(name, 'Local API update', 'googleCalendarId', privOk ? 'ok' : 'denied')
        if (!orariOk || !privOk) {
          throw new Error(`${name}: staff doveva poter scrivere`)
        }
      } else if (manager) {
        logOutcome(name, 'Local API update', 'bnb (precheck)', orariOk ? 'ok' : 'denied')
        logOutcome(name, 'Local API update', 'googleCalendarId (precheck)', privOk ? 'ok' : 'denied')
      }
    }

    const managerNewCheckout = '10:30'
    await payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: false,
      user: managerUser,
      data: {
        bnb: { checkInTime: probeBnb.checkInTime, checkOutTime: managerNewCheckout },
        googleCalendarId: 'manager-must-not-write',
        resendSenders: [{ site: 'villadoree', name: 'X', address: 'x@example.com' }],
        staffNotificationContacts: [{ name: 'Mgr Hack', email: 'mgr-hack@example.com' }],
      },
    })

    const afterManager = await payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
    })
    if (afterManager.bnb?.checkOutTime !== managerNewCheckout) {
      throw new Error('Manager: checkOutTime non aggiornato')
    }
    logOutcome('manager', 'Local API update', 'bnb.checkOutTime', 'changed', managerNewCheckout)

    if (afterManager.googleCalendarId !== probeGoogleId) {
      throw new Error(`Manager: googleCalendarId alterato (${afterManager.googleCalendarId})`)
    }
    logOutcome('manager', 'Local API update', 'googleCalendarId', 'unchanged', probeGoogleId)

    const senderSite = afterManager.resendSenders?.[0]?.site
    if (senderSite !== 'vietnamonamour') {
      throw new Error('Manager: resendSenders alterato')
    }
    logOutcome('manager', 'Local API update', 'resendSenders', 'unchanged')

    const staffEmail = afterManager.staffNotificationContacts?.[0]?.email
    if (staffEmail !== probeStaff[0]!.email) {
      throw new Error(`Manager: staffNotificationContacts alterato (${staffEmail})`)
    }
    logOutcome('manager', 'Local API update', 'staffNotificationContacts', 'unchanged', probeStaff[0]!.email)

    for (const profile of [
      { name: 'admin-disattivato', user: inactiveAdmin },
      { name: 'manager-disattivato', user: inactiveManager },
    ]) {
      const readDoc = await tryRead(profile.user)
      logOutcome(profile.name, 'Local API read', 'global', readDoc === null ? 'denied' : 'error')
      if (readDoc !== null) {
        throw new Error(`${profile.name}: lettura Local API doveva essere negata`)
      }

      try {
        await payload.updateGlobal({
          slug: SYSTEM_SETTINGS_SLUG,
          depth: 0,
          overrideAccess: false,
          user: profile.user,
          data: { bnb: { checkInTime: probeBnb.checkInTime, checkOutTime: '09:00' } },
        })
        throw new Error(`${profile.name}: update Local API doveva essere negato`)
      } catch (error) {
        if (isAccessDenied(error)) {
          logOutcome(profile.name, 'Local API update', 'global', 'denied')
        } else if (error instanceof Error && error.message.includes('doveva essere negato')) {
          throw error
        } else {
          throw error
        }
      }
    }

    const adminRestRead = await restGet(
      '/api/globals/impostazioni-sistema?locale=it',
      adminRestToken,
      cookiePrefix,
    )
    if (adminRestRead.status !== 200) {
      throw new Error(`admin REST read: atteso 200, ${adminRestRead.status}`)
    }
    const adminRestJson = (await adminRestRead.json()) as Record<string, unknown>
    assertStaffPrivateProbeValues(adminRestJson, 'admin REST read')
    logOutcome('admin', 'REST read', 'campi riservati', 'ok', 'valori probe')

    const managerRestRead = await restGet(
      '/api/globals/impostazioni-sistema?locale=it',
      managerRestToken,
      cookiePrefix,
    )
    if (managerRestRead.status !== 200) {
      throw new Error(`manager REST read: atteso 200, ${managerRestRead.status}`)
    }
    const managerRestJson = (await managerRestRead.json()) as Record<string, unknown>
    assertRestPrivateFieldsWithoutValues(managerRestJson, 'manager REST read')
    assertPublicOrariMatchRest(managerRestJson, 'manager REST read', {
      checkInTime: probeBnb.checkInTime,
      checkOutTime: '10:30',
    })
    logOutcome('manager', 'REST read', 'campi riservati', 'hidden')

    const managerRestBnbPatch = await restPatchGlobal(
      managerRestToken,
      { bnb: { checkInTime: probeBnb.checkInTime, checkOutTime: '10:45' } },
      'it',
      cookiePrefix,
    )
    if (managerRestBnbPatch.status !== 200) {
      throw new Error(`manager REST PATCH bnb: atteso 200, ${managerRestBnbPatch.status}`)
    }
    logOutcome('manager', 'REST PATCH', 'bnb', 'ok')

    for (const [field, body] of [
      ['googleCalendarId', { googleCalendarId: 'mgr-rest-hack' }],
      ['resendSenders', { resendSenders: [{ site: 'villadoree', name: 'R', address: 'r@example.com' }] }],
      [
        'staffNotificationContacts',
        { staffNotificationContacts: [{ name: 'R', email: 'r-rest@example.com' }] },
      ],
    ] as const) {
      const res = await restPatchGlobal(managerRestToken, body, 'it', cookiePrefix)
      if (res.status === 403) {
        logOutcome('manager', 'REST PATCH', field, 'denied', '403')
      } else if (res.status === 200) {
        logOutcome('manager', 'REST PATCH', field, 'unchanged', '200 (campo ignorato)')
      } else {
        throw new Error(`manager REST PATCH ${field}: status inatteso ${res.status}`)
      }
    }

    const adminAfterMgrRest = await restGet(
      '/api/globals/impostazioni-sistema?locale=it',
      adminRestToken,
      cookiePrefix,
    )
    const adminAfterJson = (await adminAfterMgrRest.json()) as Record<string, unknown>
    assertStaffPrivateProbeValues(adminAfterJson, 'admin REST dopo update manager')
    if (
      (adminAfterJson.bnb as { checkOutTime?: string } | undefined)?.checkOutTime !== '10:45'
    ) {
      throw new Error('manager REST PATCH bnb non persistito')
    }
    logOutcome('admin', 'REST read', 'post-manager REST', 'ok', 'riservati invariati, bnb 10:45')

    for (const { name, token } of [
      { name: 'admin-disattivato', token: inactiveAdminRestToken },
      { name: 'manager-disattivato', token: inactiveManagerRestToken },
    ]) {
      const res = await restGet('/api/globals/impostazioni-sistema?locale=it', token, cookiePrefix)
      if (res.status !== 403) {
        throw new Error(
          `${name} REST read: atteso solo 403, ricevuto ${res.status} (token autenticava prima della disattivazione)`,
        )
      }
      logOutcome(name, 'REST read', 'global', 'denied', '403')
    }

    await payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
      data: {
        services: baseline.services ?? validServices,
        weeklyClosedDays: baseline.weeklyClosedDays ?? [],
        annualClosures: baseline.annualClosures ?? [],
        bnb: baseline.bnb ?? { checkInTime: '15:00', checkOutTime: '11:00' },
        googleCalendarId: baseline.googleCalendarId ?? '',
        resendSenders: baseline.resendSenders ?? [],
        staffNotificationContacts: baseline.staffNotificationContacts ?? [],
      },
    })
    console.log('Valori di prova ripuliti.')

    console.log('\n--- Tabella esiti (profile | action | field | outcome | detail) ---')
    for (const row of outcomeRows) {
      console.log(row)
    }
    if (notTestedNotes.length > 0) {
      console.log('\n--- Non provato in questo run ---')
      for (const n of notTestedNotes) {
        console.log(`- ${n}`)
      }
    }
    console.log('\nVerifica 7.4 completata.')
  } finally {
    await cleanupUsers().catch(() => undefined)
    await payload.destroy()
  }
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Verifica 7.4 non riuscita: ${message}`)
  process.exit(1)
}
