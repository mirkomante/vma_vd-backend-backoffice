import { randomBytes } from 'node:crypto'

import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import type { User } from '@/payload-types'

import { assertDevDatabaseFromEnv } from '../../scripts/import-menu-vtn-backend/databaseUrl'

export type ProvisionedTestUser = {
  email: string
  id: number | string
  password: string
}

export function generateTestPassword(): string {
  return `Aa1${randomBytes(16).toString('base64url')}`
}

export async function provisionTestUser(
  payload: Payload,
  password: string,
): Promise<ProvisionedTestUser> {
  const timestamp = Date.now()
  const email = `verify-ui-${timestamp}@test.local`
  const doc = await payload.create({
    collection: 'users',
    overrideAccess: true,
    depth: 0,
    data: {
      email,
      adminRole: 'none',
      appRole: 'manager',
      loginMethod: 'sso',
      active: true,
      emailVerified: true,
    },
  })
  await payload.update({
    collection: 'users',
    id: doc.id,
    overrideAccess: true,
    depth: 0,
    data: {
      loginMethod: 'local',
      emailVerified: true,
      password,
      passwordConfirm: password,
    },
  })
  return { email, id: doc.id, password }
}

export async function deleteTestUser(payload: Payload, email: string): Promise<void> {
  if (!email.includes('@test.local')) {
    throw new Error('Email di eliminazione non valida')
  }
  const found = await payload.find({
    collection: 'users',
    overrideAccess: true,
    depth: 0,
    limit: 1,
    where: { email: { equals: email } },
  })
  const user = found.docs[0] as User | undefined
  if (user) {
    await payload.delete({ collection: 'users', id: user.id, overrideAccess: true, depth: 0 })
  }
}

export async function withPayloadForSetup<T>(
  fn: (payload: Payload) => Promise<T>,
): Promise<T> {
  assertDevDatabaseFromEnv()
  const payload = await getPayload({ config })
  try {
    return await fn(payload)
  } finally {
    await payload.destroy()
  }
}
