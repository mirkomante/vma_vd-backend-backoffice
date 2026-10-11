/**
 * Crea o elimina l'utente di prova per ui:verify (solo DB di sviluppo).
 * Password: variabile d'ambiente UI_VERIFY_USER_PASSWORD (mai loggata).
 *
 *   UI_VERIFY_USER_PASSWORD='…' pnpm payload run scripts/ui-verify/provision-user.ts -- create
 *   pnpm payload run scripts/ui-verify/provision-user.ts -- delete <email>
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'
import type { User } from '@/payload-types'

const argv = process.argv.slice(2)
const dash = argv.indexOf('--')
const args = dash >= 0 ? argv.slice(dash + 1) : argv.filter((a) => !a.endsWith('.ts') && !a.includes('provision-user'))
const action = args[0]
const emailArg = args[1]

async function main(): Promise<void> {
  const payload = await getPayload({ config })

  if (action === 'create') {
    const password = process.env.UI_VERIFY_USER_PASSWORD
    if (!password || password.length < 12) {
      throw new Error('UI_VERIFY_USER_PASSWORD mancante o troppo corta')
    }
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
    process.stdout.write(JSON.stringify({ email, id: doc.id }))
    return
  }

  if (action === 'delete') {
    const email = emailArg
    if (!email?.includes('@test.local')) {
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
    process.stdout.write(JSON.stringify({ deleted: Boolean(user), email }))
    return
  }

  if (action === 'activity-log') {
    const email = emailArg
    if (!email) throw new Error('email richiesta')
    const user = (
      await payload.find({
        collection: 'users',
        overrideAccess: true,
        depth: 0,
        limit: 1,
        where: { email: { equals: email } },
      })
    ).docs[0] as User | undefined
    if (!user) {
      process.stdout.write(JSON.stringify({ found: false }))
      return
    }
    const logs = await payload.find({
      collection: ACTIVITY_LOG_SLUG,
      overrideAccess: true,
      depth: 0,
      limit: 5,
      sort: '-createdAt',
      where: {
        and: [
          { user: { equals: user.id } },
          { eventType: { equals: 'logout' } },
          { area: { equals: 'app' } },
        ],
      },
    })
    const row = logs.docs.find((d) => (d as { method?: string }).method === 'local')
    process.stdout.write(JSON.stringify({ found: Boolean(row) }))
    return
  }

  throw new Error(`Azione sconosciuta: ${action}`)
}

try {
  await main()
} catch (err) {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
}
