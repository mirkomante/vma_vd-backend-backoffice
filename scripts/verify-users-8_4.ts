/**
 * Prove fase-8.4 (email account, reinvio attivazione).
 * DB: vma_vd_dev (stesso DATABASE_URL di `pnpm dev` per REST opzionale).
 *
 *   pnpm payload run scripts/verify-users-8_4.ts
 */
import config from '@payload-config'
import { APIError, getPayload } from 'payload'

import { setSkipAccountCreatedEmail } from '@/lib/auth/accountEmail/context'
import { accountCreatedEmailContent } from '@/lib/auth/accountEmail/content'
import { shouldSendAccountCreatedEmail } from '@/lib/auth/accountEmail/eligibility'
import { createResendActivationEndpoint } from '@/lib/auth/localEmail/resendActivationEndpoint'
import { verifyAppEmailToken } from '@/lib/auth/localEmail/verifyEmail'
import { isResendConfigured } from '@/lib/email/env'
import type { PayloadRequest } from 'payload'
import type { User } from '@/payload-types'

const TEST_RUN_ID = Date.now().toString(36)
const TEST_EMAIL_PREFIX = `verify-8_4-${TEST_RUN_ID}-`
const TEST_PASSWORD = 'Verify8_4!AaBbCc'

const resendActivationHandler = createResendActivationEndpoint().handler

async function callResendActivation(
  req: PayloadRequest,
  id: number | string,
): Promise<Response> {
  return resendActivationHandler({
    ...req,
    json: async () => ({ id }),
  } as PayloadRequest)
}

function isAccessDenied(error: unknown): boolean {
  return error instanceof APIError && error.status === 403
}

async function main(): Promise<void> {
  const payload = await getPayload({ config })
  const createdUserIds: (number | string)[] = []
  async function createUser(
    data: Record<string, unknown>,
    req?: { context: Record<string, unknown> },
  ): Promise<User> {
    const doc = await payload.create({
      collection: 'users',
      data: data as never,
      depth: 0,
      overrideAccess: true,
      req: req as never,
    })
    createdUserIds.push(doc.id)
    return doc as User
  }

  async function reloadUser(id: number | string): Promise<User> {
    return (await payload.findByID({
      id,
      collection: 'users',
      depth: 0,
      overrideAccess: true,
      showHiddenFields: true,
    })) as User
  }

  let sendEmailCalls = 0
  const originalSendEmail = payload.sendEmail.bind(payload)
  payload.sendEmail = async (message) => {
    sendEmailCalls += 1
    return originalSendEmail(message)
  }

  console.log('--- Matrice shouldSendAccountCreatedEmail (senza invio) ---')
  const matrixCases = [
    {
      label: 'create SSO attivo',
      doc: { loginMethod: 'sso', active: true, email: 'a@test.it' } as User,
      operation: 'create' as const,
      expect: true,
    },
    {
      label: 'create SSO inattivo',
      doc: { loginMethod: 'sso', active: false, email: 'a@test.it' } as User,
      operation: 'create' as const,
      expect: false,
    },
    {
      label: 'create local attivo',
      doc: { loginMethod: 'local', active: true, email: 'a@test.it' } as User,
      operation: 'create' as const,
      expect: false,
    },
    {
      label: 'update attivazione SSO',
      doc: { loginMethod: 'sso', active: true, email: 'a@test.it' } as User,
      operation: 'update' as const,
      previousDoc: { loginMethod: 'sso', active: false } as User,
      expect: true,
    },
    {
      label: 'update attivazione già inviata',
      doc: {
        loginMethod: 'sso',
        active: true,
        email: 'a@test.it',
        accountCreatedEmailSentAt: '2026-01-01T00:00:00.000Z',
      } as User,
      operation: 'update' as const,
      previousDoc: { loginMethod: 'sso', active: false } as User,
      expect: false,
    },
  ]

  for (const row of matrixCases) {
    const result = shouldSendAccountCreatedEmail({
      doc: row.doc,
      operation: row.operation,
      previousDoc: row.previousDoc,
    })
    if (result !== row.expect) {
      throw new Error(`Matrice fallita: ${row.label} (atteso ${row.expect}, ottenuto ${result})`)
    }
    console.log(`OK: ${row.label}`)
  }

  const content = accountCreatedEmailContent({
    adminRole: 'manager',
    appRole: 'none',
    loginMethod: 'sso',
  })
  if (!content.html.includes('/admin') || content.html.includes('/app/login')) {
    throw new Error('Contenuto email manager: atteso solo link Admin')
  }
  const contentAdminApp = accountCreatedEmailContent({
    adminRole: 'admin',
    appRole: 'none',
    loginMethod: 'sso',
  })
  if (!contentAdminApp.html.includes('/admin') || !contentAdminApp.html.includes('/app/login')) {
    throw new Error('Contenuto email admin: attesi link Admin e App')
  }
  console.log('OK: contenuto email «Account creato» (link Admin/App)')

  sendEmailCalls = 0
  await createUser({
    email: `${TEST_EMAIL_PREFIX}sso-inactive@test.local`,
    adminRole: 'manager',
    appRole: 'none',
    loginMethod: 'sso',
    active: false,
  })
  if (sendEmailCalls !== 0) {
    throw new Error('create SSO inattivo: atteso nessun invio email')
  }
  console.log('OK: create SSO inattivo → nessuna email')

  sendEmailCalls = 0
  const ssoActive = await createUser({
    email: `${TEST_EMAIL_PREFIX}sso-active@test.local`,
    adminRole: 'manager',
    appRole: 'none',
    loginMethod: 'sso',
    active: true,
  })
  const ssoActiveReload = await reloadUser(ssoActive.id)
  if (isResendConfigured()) {
    if (sendEmailCalls !== 1) {
      throw new Error(`create SSO attivo: atteso 1 invio, ottenuti ${sendEmailCalls}`)
    }
    if (!ssoActiveReload.accountCreatedEmailSentAt) {
      throw new Error('create SSO attivo: accountCreatedEmailSentAt non impostato dopo invio')
    }
    console.log('OK: create SSO attivo → email account creato + timestamp')
  } else {
    console.log('SKIP: Resend non configurato — create SSO attivo (invio reale non verificato)')
  }

  sendEmailCalls = 0
  const ssoReactivate = await createUser({
    email: `${TEST_EMAIL_PREFIX}sso-reactivate@test.local`,
    adminRole: 'manager',
    appRole: 'none',
    loginMethod: 'sso',
    active: false,
  })
  await payload.update({
    id: ssoReactivate.id,
    collection: 'users',
    data: { active: true },
    depth: 0,
    overrideAccess: true,
  })
  const ssoReactivateReload = await reloadUser(ssoReactivate.id)
  if (isResendConfigured()) {
    if (sendEmailCalls !== 1) {
      throw new Error(`attivazione SSO: atteso 1 invio, ottenuti ${sendEmailCalls}`)
    }
    if (!ssoReactivateReload.accountCreatedEmailSentAt) {
      throw new Error('attivazione SSO: timestamp mancante')
    }
    sendEmailCalls = 0
    await payload.update({
      id: ssoReactivate.id,
      collection: 'users',
      data: { active: false },
      depth: 0,
      overrideAccess: true,
    })
    await payload.update({
      id: ssoReactivate.id,
      collection: 'users',
      data: { active: true },
      depth: 0,
      overrideAccess: true,
    })
    if (sendEmailCalls !== 0) {
      throw new Error('seconda attivazione SSO: atteso nessun nuovo invio')
    }
    console.log('OK: attivazione SSO una sola volta; seconda attivazione senza reinvio')
  } else {
    console.log('SKIP: Resend non configurato — attivazione SSO (invio reale non verificato)')
  }

  if (isResendConfigured()) {
    const sharedReq = { context: {} } as PayloadRequest
    const bulkA = await createUser({
      email: `${TEST_EMAIL_PREFIX}bulk-a@test.local`,
      adminRole: 'manager',
      appRole: 'none',
      loginMethod: 'sso',
      active: false,
    })
    const bulkB = await createUser({
      email: `${TEST_EMAIL_PREFIX}bulk-b@test.local`,
      adminRole: 'manager',
      appRole: 'none',
      loginMethod: 'sso',
      active: false,
    })
    sendEmailCalls = 0
    await payload.update({
      id: bulkA.id,
      collection: 'users',
      data: { active: true },
      depth: 0,
      overrideAccess: true,
      req: sharedReq,
    })
    await payload.update({
      id: bulkB.id,
      collection: 'users',
      data: { active: true },
      depth: 0,
      overrideAccess: true,
      req: sharedReq,
    })
    if (sendEmailCalls !== 2) {
      throw new Error(`attivazione bulk stesso req: attesi 2 invii, ottenuti ${sendEmailCalls}`)
    }
    const bulkAReload = await reloadUser(bulkA.id)
    const bulkBReload = await reloadUser(bulkB.id)
    if (!bulkAReload.accountCreatedEmailSentAt || !bulkBReload.accountCreatedEmailSentAt) {
      throw new Error('attivazione bulk: timestamp mancante su uno dei due utenti')
    }
    sendEmailCalls = 0
    await payload.update({
      id: bulkA.id,
      collection: 'users',
      data: { active: false },
      depth: 0,
      overrideAccess: true,
      req: sharedReq,
    })
    await payload.update({
      id: bulkA.id,
      collection: 'users',
      data: { active: true },
      depth: 0,
      overrideAccess: true,
      req: sharedReq,
    })
    if (sendEmailCalls !== 0) {
      throw new Error('terza attivazione bulk (già inviata): atteso nessun nuovo invio')
    }
    console.log(
      'OK: due SSO attivati con stesso req → due email e timestamp; riattivazione senza reinvio',
    )
  } else {
    console.log('SKIP: Resend non configurato — attivazione bulk stesso req')
  }

  sendEmailCalls = 0
  const localUser = await createUser({
    email: `${TEST_EMAIL_PREFIX}local@test.local`,
    adminRole: 'none',
    appRole: 'manager',
    loginMethod: 'local',
    active: true,
    password: TEST_PASSWORD,
    passwordConfirm: TEST_PASSWORD,
  })
  if (isResendConfigured()) {
    if (sendEmailCalls !== 1) {
      throw new Error(`create local: atteso solo attivazione (1 invio), ottenuti ${sendEmailCalls}`)
    }
    if (localUser.accountCreatedEmailSentAt) {
      throw new Error('create local: accountCreatedEmailSentAt non deve essere impostato')
    }
    console.log('OK: create local → solo attivazione, non account creato')
  } else {
    console.log('SKIP: Resend non configurato — create local')
  }

  sendEmailCalls = 0
  const seedLikeReq = { context: {} }
  setSkipAccountCreatedEmail(seedLikeReq)
  const bootstrapUser = await createUser(
    {
      email: `${TEST_EMAIL_PREFIX}bootstrap@test.local`,
      adminRole: 'super-admin',
      appRole: 'none',
      loginMethod: 'sso',
      active: true,
      bootstrapCredentialHash: 'fake-hash',
      bootstrapCredentialSalt: 'fake-salt',
    },
    seedLikeReq,
  )
  if (sendEmailCalls !== 0) {
    throw new Error('create bootstrap SSO: atteso nessun invio account creato')
  }
  if (bootstrapUser.accountCreatedEmailSentAt) {
    throw new Error('create bootstrap: timestamp non deve essere impostato')
  }
  console.log('OK: create tipo seed (bootstrap) → nessuna email account creato')

  payload.sendEmail = async () => {
    throw new Error('sendEmail simulato fallito')
  }
  const failUser = await createUser({
    email: `${TEST_EMAIL_PREFIX}fail-send@test.local`,
    adminRole: 'manager',
    appRole: 'none',
    loginMethod: 'sso',
    active: true,
  })
  const failReload = await reloadUser(failUser.id)
  if (failReload.accountCreatedEmailSentAt) {
    throw new Error('invio fallito: accountCreatedEmailSentAt non deve essere impostato')
  }
  payload.sendEmail = originalSendEmail
  console.log('OK: invio fallito simulato → timestamp vuoto (riprova su attivazione successiva)')

  const adminUser = await createUser({
    email: `${TEST_EMAIL_PREFIX}admin-staff@test.local`,
    adminRole: 'admin',
    appRole: 'none',
    loginMethod: 'sso',
    active: true,
  })
  const managerUser = await createUser({
    email: `${TEST_EMAIL_PREFIX}manager-staff@test.local`,
    adminRole: 'manager',
    appRole: 'none',
    loginMethod: 'sso',
    active: true,
  })
  const localUnverified = await createUser({
    email: `${TEST_EMAIL_PREFIX}resend-local@test.local`,
    adminRole: 'none',
    appRole: 'manager',
    loginMethod: 'local',
    active: true,
    password: TEST_PASSWORD,
    passwordConfirm: TEST_PASSWORD,
  })
  const localReload = await reloadUser(localUnverified.id)
  const firstToken = localReload.emailVerificationToken
  if (!firstToken) {
    throw new Error('utente local: token attivazione mancante')
  }

  const managerReq = { payload, user: managerUser } as PayloadRequest
  const managerRes = await callResendActivation(managerReq, localUnverified.id)
  if (managerRes.status !== 403) {
    throw new Error(`manager su resend: atteso 403, ottenuto ${managerRes.status}`)
  }
  console.log('OK: manager non può reinvio attivazione (403)')

  if (isResendConfigured()) {
    const adminReq = { payload, user: adminUser } as PayloadRequest
    const adminRes = await callResendActivation(adminReq, localUnverified.id)
    if (!adminRes.ok) {
      const text = await adminRes.text()
      throw new Error(`admin resend: atteso 200, ottenuto ${adminRes.status} ${text}`)
    }
    const afterResend = await reloadUser(localUnverified.id)
    const secondToken = afterResend.emailVerificationToken
    if (!secondToken || secondToken === firstToken) {
      throw new Error('reinvio: atteso nuovo token di verifica')
    }
    const firstStillValid = await verifyAppEmailToken({
      payload,
      token: firstToken,
    })
    if (firstStillValid) {
      throw new Error('token precedente ancora valido dopo reinvio')
    }
    const secondValid = await verifyAppEmailToken({
      payload,
      token: secondToken,
    })
    if (!secondValid) {
      throw new Error('nuovo token non valido dopo reinvio')
    }
    console.log('OK: reinvio attivazione (admin) — nuovo token, precedente invalidato')
  } else {
    console.log('SKIP: Resend non configurato — reinvio attivazione con invio reale')
  }

  for (const id of createdUserIds) {
    try {
      await payload.delete({
        id,
        collection: 'users',
        depth: 0,
        overrideAccess: true,
      })
    } catch (error) {
      if (!isAccessDenied(error)) {
        payload.logger.warn({ err: error, msg: `Pulizia utente ${id} non riuscita` })
      }
    }
  }

  await payload.destroy()
  console.log('--- verify-users-8_4 completato ---')
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`verify-users-8_4 fallito: ${message}`)
  process.exit(1)
}
