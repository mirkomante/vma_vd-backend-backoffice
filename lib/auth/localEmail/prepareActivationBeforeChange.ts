import type { CollectionBeforeChangeHook } from 'payload'

import { isLocalAppUserProfile } from '@/lib/auth/localAppUserAdmin'
import type { UserWriteData } from '@/lib/auth/roles'

import { setPendingActivationToken } from './activationContext'
import { generateAuthEmailToken } from './tokens'

type ActivationWriteData = UserWriteData & {
  emailVerified?: boolean | null
  emailVerificationToken?: string | null
}

/**
 * Con `disableLocalStrategy` Payload non genera `_verificationToken` in create
 * (e `auth.verify` nativo non è abilitato, per evitare l’email verso `/admin/...`).
 * Solo utenti App con metodo locale: il seed super-admin (`appRole: none`) è escluso.
 */
export const prepareActivationBeforeChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (!data || typeof data !== 'object') {
    return data
  }

  const writeData = data as ActivationWriteData

  if (operation === 'update' && writeData.emailVerified === true) {
    writeData.emailVerificationToken = null
    return data
  }

  if (operation !== 'create') {
    return data
  }

  if (!isLocalAppUserProfile(writeData)) {
    return data
  }

  if (!writeData.password) {
    return data
  }

  writeData.emailVerified = false
  const token = generateAuthEmailToken()
  writeData.emailVerificationToken = token
  setPendingActivationToken(req, token)
  return data
}
