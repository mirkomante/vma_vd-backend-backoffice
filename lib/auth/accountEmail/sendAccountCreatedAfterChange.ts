import type { CollectionAfterChangeHook } from 'payload'

import type { User } from '@/payload-types'

import { sendAppAuthEmail } from '@/lib/auth/localEmail/send'

import { shouldSkipAccountCreatedEmail, setSkipAccountCreatedEmail } from './context'
import { accountCreatedEmailContent } from './content'
import { shouldSendAccountCreatedEmail, userAccessFieldsFromDoc } from './eligibility'

const USERS_SLUG = 'users' as const

export const sendAccountCreatedAfterChange: CollectionAfterChangeHook<User> = async ({
  doc,
  operation,
  previousDoc,
  req,
}) => {
  if (shouldSkipAccountCreatedEmail(req)) {
    return
  }

  if (
    !shouldSendAccountCreatedEmail({
      doc,
      operation,
      previousDoc: previousDoc as User | undefined,
    })
  ) {
    return
  }

  const profile = userAccessFieldsFromDoc(doc)
  const { subject, html } = accountCreatedEmailContent(profile)
  const sent = await sendAppAuthEmail({
    payload: req.payload,
    req,
    to: doc.email,
    subject,
    html,
  })

  if (!sent) {
    return
  }

  setSkipAccountCreatedEmail(req)
  await req.payload.update({
    id: doc.id,
    collection: USERS_SLUG,
    data: {
      accountCreatedEmailSentAt: new Date().toISOString(),
    },
    depth: 0,
    overrideAccess: true,
    req,
  })
}
