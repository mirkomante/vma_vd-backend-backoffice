/**
 * Prove integrazione fase-8.3 (F1, accesso manager CMS, login locale App).
 * DB: vma_vd_dev o vma_vd_migr (stesso DATABASE_URL di `pnpm dev` per REST).
 * REST: `pnpm dev` su APP_PUBLIC_URL.
 *
 *   pnpm payload run scripts/verify-roles-8_3.ts
 */
import config from '@payload-config'
import { APIError, getFieldsToSign, getPayload, jwtSign, ValidationError } from 'payload'

import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'
import { SETTINGS_SLUG } from '@/lib/auth/allowedDomains'
import { withSessionStrategyClaim } from '@/lib/auth/jwt/sessionStrategyClaim'
import { canAccessSection } from '@/lib/auth/canAccessSection'
import { LOCAL_JWT_STRATEGY_ADMIN } from '@/lib/auth/localLogin/constants'
import { assertLocalPasswordAllowed } from '@/lib/auth/localPasswordGuard'
import { SYSTEM_SETTINGS_SLUG } from '@/globals/SystemSettings'
import type { User } from '@/payload-types'

const TEST_RUN_ID = Date.now().toString(36)
const TEST_EMAIL_PREFIX = `verify-8_3-${TEST_RUN_ID}-`
const TEST_PASSWORD = 'Verify8_3!AaBbCc'

function appPublicUrl(): string {
  return (process.env.APP_PUBLIC_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}

function isAccessDenied(error: unknown): boolean {
  return error instanceof APIError && error.status === 403
}

function isValidationError(error: unknown): boolean {
  return error instanceof ValidationError
}

async function restFetch(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.headers as Record<string, string>),
  }
  if (init.token) {
    headers.Authorization = `JWT ${init.token}`
    headers.Cookie = `payload-token=${init.token}`
  }
  return fetch(`${appPublicUrl()}${path}`, { ...init, headers })
}

async function main(): Promise<void> {
  console.log('--- assertLocalPasswordAllowed (manager, loginMethod local) ---')
  try {
    assertLocalPasswordAllowed({
      data: { adminRole: 'manager', loginMethod: 'local' },
    })
    throw new Error('assertLocalPasswordAllowed: atteso ValidationError per manager+local')
  } catch (error) {
    if (!isValidationError(error)) {
      throw error
    }
    console.log('OK: manager + loginMethod local rifiutato in validazione')
  }

  const payload = await getPayload({ config })
  const createdUserIds: (number | string)[] = []
  const usersCollection = payload.collections.users.config
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

  async function createUser(data: {
    email: string
    adminRole: User['adminRole']
    appRole: User['appRole']
    loginMethod?: User['loginMethod']
    active?: boolean
    emailVerified?: boolean
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
        loginMethod: data.loginMethod ?? 'sso',
        active: data.active ?? true,
        emailVerified: data.emailVerified ?? true,
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

  async function cleanup(): Promise<void> {
    for (const id of [...createdUserIds].reverse()) {
      await payload.delete({ collection: 'users', id, overrideAccess: true, depth: 0 })
    }
    createdUserIds.length = 0
  }

  try {
    const superAdmin = (await payload.find({
      collection: 'users',
      overrideAccess: true,
      depth: 0,
      limit: 1,
      where: { adminRole: { equals: 'super-admin' } },
    })).docs[0] as User | undefined
    if (!superAdmin) {
      throw new Error('Nessun super-admin nel DB: impossibile prove F1')
    }

    const adminActor = await createUser({
      email: `${TEST_EMAIL_PREFIX}admin@test.local`,
      adminRole: 'admin',
      appRole: 'none',
    })
    const adminTarget = await createUser({
      email: `${TEST_EMAIL_PREFIX}admin-target@test.local`,
      adminRole: 'admin',
      appRole: 'none',
    })
    const managerCms = await createUser({
      email: `${TEST_EMAIL_PREFIX}manager-cms@test.local`,
      adminRole: 'manager',
      appRole: 'none',
    })
    const inactiveApp = await createUser({
      email: `${TEST_EMAIL_PREFIX}inactive@test.local`,
      adminRole: 'none',
      appRole: 'manager',
      active: false,
    })

    for (const section of ['menu', 'hours', 'reservations'] as const) {
      if (canAccessSection(inactiveApp, section)) {
        throw new Error(`inactive: canAccessSection(${section}) doveva essere false`)
      }
    }
    console.log('OK: canAccessSection false per utente inactive su tutte le sezioni')

    console.log('--- F1 Local API (overrideAccess: false) ---')
    for (const [label, target] of [
      ['self', adminActor],
      ['other-admin', adminTarget],
    ] as const) {
      try {
        await payload.update({
          collection: 'users',
          id: target.id,
          overrideAccess: false,
          depth: 0,
          user: adminActor,
          data: { adminRole: 'super-admin' },
        })
        throw new Error(`F1 Local: admin→super-admin (${label}) doveva fallire`)
      } catch (error) {
        if (!isValidationError(error)) {
          throw error
        }
        console.log(`OK: F1 Local admin escalation negata (${label})`)
      }
    }

    const promoted = await payload.update({
      collection: 'users',
      id: adminTarget.id,
      overrideAccess: false,
      depth: 0,
      user: superAdmin,
      data: { adminRole: 'super-admin' },
    })
    if (promoted.adminRole !== 'super-admin') {
      throw new Error('F1: super-admin non ha potuto promuovere')
    }
    console.log('OK: super-admin può assegnare super-admin')

    await payload.update({
      collection: 'users',
      id: adminTarget.id,
      overrideAccess: false,
      depth: 0,
      user: superAdmin,
      data: { adminRole: 'admin' },
    })
    await payload.update({
      collection: 'users',
      id: adminActor.id,
      overrideAccess: false,
      depth: 0,
      user: superAdmin,
      data: { adminRole: 'manager' },
    })
    console.log('OK: modifiche legittime none/manager/admin tra ruoli non super-admin')

    console.log('--- Accesso manager CMS (Local API, overrideAccess: false) ---')
    const deniedResources: Array<{
      label: string
      run: () => Promise<unknown>
    }> = [
      {
        label: 'users',
        run: () =>
          payload.find({
            collection: 'users',
            overrideAccess: false,
            depth: 0,
            user: managerCms,
            limit: 1,
          }),
      },
      {
        label: ACTIVITY_LOG_SLUG,
        run: () =>
          payload.find({
            collection: ACTIVITY_LOG_SLUG,
            overrideAccess: false,
            depth: 0,
            user: managerCms,
            limit: 1,
          }),
      },
      {
        label: SETTINGS_SLUG,
        run: () =>
          payload.findGlobal({
            slug: SETTINGS_SLUG,
            overrideAccess: false,
            depth: 0,
            user: managerCms,
          }),
      },
      {
        label: SYSTEM_SETTINGS_SLUG,
        run: () =>
          payload.findGlobal({
            slug: SYSTEM_SETTINGS_SLUG,
            overrideAccess: false,
            depth: 0,
            user: managerCms,
          }),
      },
    ]

    for (const resource of deniedResources) {
      try {
        await resource.run()
        throw new Error(`manager CMS: ${resource.label} doveva essere negato (Local API)`)
      } catch (error) {
        if (!isAccessDenied(error)) {
          throw error
        }
        console.log(`OK: Local API negato su ${resource.label}`)
      }
    }

    const managerToken = await signRestJwt(managerCms, LOCAL_JWT_STRATEGY_ADMIN)
    const adminToken = await signRestJwt(adminActor, LOCAL_JWT_STRATEGY_ADMIN)

    console.log('--- F1 REST ---')
    const selfEscalation = await restFetch(`/api/users/${adminActor.id}`, {
      method: 'PATCH',
      token: adminToken,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminRole: 'super-admin' }),
    })
    if (selfEscalation.status < 400) {
      throw new Error(`F1 REST self: atteso 4xx, ${selfEscalation.status}`)
    }
    console.log(`OK: F1 REST PATCH self → ${selfEscalation.status}`)

    const bulkEscalation = await restFetch(
      `/api/users?where[adminRole][equals]=admin&where[email][like]=${encodeURIComponent(TEST_EMAIL_PREFIX)}%`,
      {
        method: 'PATCH',
        token: adminToken,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminRole: 'super-admin' }),
      },
    )
    if (bulkEscalation.status < 400) {
      throw new Error(`F1 REST bulk: atteso 4xx, ${bulkEscalation.status}`)
    }
    console.log(`OK: F1 REST PATCH bulk → ${bulkEscalation.status}`)

    console.log('--- Accesso manager CMS (REST) ---')
    const restPaths = [
      '/api/users?limit=1',
      `/api/${ACTIVITY_LOG_SLUG}?limit=1`,
      `/api/globals/${SETTINGS_SLUG}`,
      `/api/globals/${SYSTEM_SETTINGS_SLUG}?locale=it`,
    ]
    for (const path of restPaths) {
      const res = await restFetch(path, { token: managerToken })
      if (res.status !== 403 && res.status !== 401) {
        throw new Error(`manager CMS REST ${path}: atteso 401/403, ${res.status}`)
      }
      console.log(`OK: REST ${path} → ${res.status}`)
    }

    const inactiveToken = await signRestJwt(inactiveApp, LOCAL_JWT_STRATEGY_ADMIN)
    for (const path of restPaths) {
      const res = await restFetch(path, { token: inactiveToken })
      if (res.status !== 403 && res.status !== 401) {
        throw new Error(`inactive REST ${path}: atteso 401/403, ${res.status}`)
      }
    }
    console.log('OK: utente inactive 403/401 su risorse staff')

    console.log('--- Login locale App (promozione adminRole) ---')
    const localAppEmail = `${TEST_EMAIL_PREFIX}local-app@test.local`
    let localUser = await createUser({
      email: localAppEmail,
      adminRole: 'none',
      appRole: 'manager',
      withLocalPassword: true,
    })

    async function tryAppLogin(): Promise<{ status: number; location: string }> {
      const res = await fetch(`${appPublicUrl()}/api/users/login/app`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: localAppEmail, password: TEST_PASSWORD }),
        redirect: 'manual',
      })
      return { status: res.status, location: res.headers.get('location') ?? '' }
    }

    let login = await tryAppLogin()
    if (login.status !== 302 || login.location.includes('authFailed')) {
      throw new Error(
        `login/app positivo fallito: ${login.status} ${login.location} (email verificata?)`,
      )
    }
    console.log('OK: login/app positivo prima della promozione')

    localUser = (await payload.update({
      collection: 'users',
      id: localUser.id,
      overrideAccess: true,
      depth: 0,
      data: { adminRole: 'admin', loginMethod: 'sso' },
    })) as User

    for (const appRole of ['manager', 'none'] as const) {
      await payload.update({
        collection: 'users',
        id: localUser.id,
        overrideAccess: true,
        depth: 0,
        data: { appRole },
      })
      login = await tryAppLogin()
      if (login.status !== 302 || !login.location.includes('authFailed')) {
        throw new Error(
          `login/app dopo promozione (appRole=${appRole}): atteso authFailed, ${login.status} ${login.location}`,
        )
      }
      console.log(`OK: login/app rifiutato dopo promozione admin (appRole=${appRole})`)
    }

    console.log('--- Login locale manager adminRole ---')
    const managerLocalEmail = `${TEST_EMAIL_PREFIX}manager-local@test.local`
    await createUser({
      email: managerLocalEmail,
      adminRole: 'manager',
      appRole: 'none',
      loginMethod: 'sso',
    })
    const mgrLogin = await fetch(`${appPublicUrl()}/api/users/login/app`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: managerLocalEmail, password: 'any' }),
      redirect: 'manual',
    })
    const mgrLoc = mgrLogin.headers.get('location') ?? ''
    if (mgrLogin.status !== 302 || !mgrLoc.includes('authFailed')) {
      throw new Error(`manager adminRole login locale: atteso authFailed, ${mgrLogin.status}`)
    }
    console.log('OK: login/app rifiutato per adminRole manager')

    console.log('[azione umana] SSO Google: super-admin appRole none su /app/login; manager CMS in Admin via SSO')
  } finally {
    await cleanup()
    const remaining = await payload.find({
      collection: 'users',
      overrideAccess: true,
      depth: 0,
      limit: 5,
      where: { email: { like: `${TEST_EMAIL_PREFIX}%` } },
    })
    if (remaining.totalDocs > 0) {
      throw new Error(`Pulizia incompleta: ${remaining.totalDocs} utenti ${TEST_EMAIL_PREFIX}*`)
    }
    console.log('OK: pulizia utenti di prova')
  }
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Verifica 8.3 non riuscita: ${message}`)
  process.exit(1)
}
