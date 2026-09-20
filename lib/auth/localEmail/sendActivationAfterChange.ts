import type { CollectionAfterChangeHook } from 'payload'

import type { User } from '@/payload-types'

import { takePendingActivationToken } from './activationContext'
import { activationEmailContent, sendAppAuthEmail } from './send'

/**
 * Invio esplicito: con `disableLocalStrategy` il flusso nativo di verifica
 * non parte (e `auth.verify` è volutamente spento per evitare duplicati / URL Admin).
 */
export const sendActivationAfterChange: CollectionAfterChangeHook<User> = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') {
    return
  }

  const token = takePendingActivationToken(req)
  if (!token || doc.emailVerified !== false || !doc.email) {
    return
  }

  // Token da req.context (prepareActivationBeforeChange), non da doc — field access.read: false

  const { subject, html } = activationEmailContent(token)
  await sendAppAuthEmail({
    payload: req.payload,
    req,
    to: doc.email,
    subject,
    html,
  })
}
