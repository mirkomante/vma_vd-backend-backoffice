import type { CollectionBeforeChangeHook } from 'payload'

import type { UserWriteData } from '@/lib/auth/roles'

import { hashLocalPassword } from './hash'

/**
 * Con `disableLocalStrategy`, Payload non hash più in create; in update hash ancora
 * se `enableFields: true`, ma l’hook garantisce lo stesso formato anche in create.
 * I guardrail su chi può avere password restano in `assertLocalPasswordAllowed` (beforeValidate).
 */
export const hashLocalCredentialsBeforeChange: CollectionBeforeChangeHook = async ({ data }) => {
  if (!data || typeof data !== 'object') {
    return data
  }

  const writeData = data as UserWriteData & { hash?: string; salt?: string }
  const password = writeData.password

  if (!password || typeof password !== 'string') {
    return data
  }

  const { hash, salt } = await hashLocalPassword(password)
  writeData.hash = hash
  writeData.salt = salt
  delete writeData.password

  return data
}
