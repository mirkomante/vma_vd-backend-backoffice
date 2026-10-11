/**
 * Backup/ripristino e prove Local API per ui:verify Orari (solo DB di sviluppo).
 *
 *   pnpm payload run scripts/ui-verify/system-settings-hours.ts -- snapshot
 *   UI_VERIFY_HOURS_SNAPSHOT=/path.json pnpm payload run ... -- restore
 *   pnpm payload run ... -- invalid-times
 *   pnpm payload run ... -- read-as <managerEmail>
 *   pnpm payload run ... -- clear-services
 *   pnpm payload run ... -- permissions
 */
import { readFileSync, writeFileSync } from 'node:fs'

import config from '@payload-config'
import { APIError, getPayload } from 'payload'

import { SYSTEM_SETTINGS_SLUG } from '@/globals/SystemSettings'
import type { ImpostazioniSistema, User } from '@/payload-types'
import { validateTimeOfDayField } from '@/lib/systemSettings/timeOfDay'

const argv = process.argv.slice(2)
const dash = argv.indexOf('--')
const args = dash >= 0 ? argv.slice(dash + 1) : argv.filter((a) => !a.includes('system-settings-hours'))
const action = args[0]

if (!action) {
  console.error('system-settings-hours: azione mancante (argv)', process.argv.join(' '))
}

type HoursSlice = {
  services?: ImpostazioniSistema['services']
  weeklyClosedDays?: ImpostazioniSistema['weeklyClosedDays']
  annualClosures?: ImpostazioniSistema['annualClosures']
  bnb?: ImpostazioniSistema['bnb']
}

function hoursSlice(doc: ImpostazioniSistema): HoursSlice {
  return {
    services: doc.services,
    weeklyClosedDays: doc.weeklyClosedDays,
    annualClosures: doc.annualClosures,
    bnb: doc.bnb,
  }
}

function isAccessDenied(error: unknown): boolean {
  return error instanceof APIError && error.status === 403
}

async function readGlobal(overrideAccess: boolean, user?: User) {
  const payload = await getPayload({ config })
  return payload.findGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    depth: 0,
    overrideAccess,
    user,
  }) as Promise<ImpostazioniSistema>
}

async function writeGlobal(data: Partial<ImpostazioniSistema>, overrideAccess: boolean, user?: User) {
  const payload = await getPayload({ config })
  return payload.updateGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    depth: 0,
    overrideAccess,
    user,
    data,
  }) as Promise<ImpostazioniSistema>
}

async function main(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('system-settings-hours: vietato in produzione')
  }

  const payload = await getPayload({ config })

  if (action === 'snapshot') {
    const doc = await payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
    })
    const slice = hoursSlice(doc as ImpostazioniSistema)
    const path = process.env.UI_VERIFY_HOURS_SNAPSHOT
    if (path) {
      writeFileSync(path, JSON.stringify(slice), 'utf8')
    }
    process.stdout.write(JSON.stringify(slice))
    return
  }

  if (action === 'restore') {
    const path = process.env.UI_VERIFY_HOURS_SNAPSHOT
    if (!path) throw new Error('UI_VERIFY_HOURS_SNAPSHOT mancante')
    const slice = JSON.parse(readFileSync(path, 'utf8')) as HoursSlice
    await payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
      data: slice,
    })
    process.stdout.write(JSON.stringify({ restored: true }))
    return
  }

  if (action === 'clear-services') {
    const doc = await payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
    })
    const next = { ...doc } as Record<string, unknown>
    delete next.services
    await payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
      data: next as Partial<ImpostazioniSistema>,
    })
    process.stdout.write(JSON.stringify({ cleared: true }))
    return
  }

  if (action === 'read-as') {
    const email = args[1]
    if (!email) throw new Error('email richiesta')
    const found = await payload.find({
      collection: 'users',
      overrideAccess: true,
      depth: 0,
      limit: 1,
      where: { email: { equals: email } },
    })
    const user = found.docs[0] as User | undefined
    if (!user) throw new Error('utente non trovato')
    const doc = await readGlobal(false, user)
    process.stdout.write(JSON.stringify(hoursSlice(doc)))
    return
  }

  if (action === 'invalid-times') {
    const managerEmail = process.env.UI_VERIFY_MANAGER_EMAIL
    if (!managerEmail) throw new Error('UI_VERIFY_MANAGER_EMAIL mancante')
    const found = await payload.find({
      collection: 'users',
      overrideAccess: true,
      depth: 0,
      limit: 1,
      where: { email: { equals: managerEmail } },
    })
    const manager = found.docs[0] as User | undefined
    if (!manager) throw new Error('manager non trovato')

    const base = await readGlobal(true)
    const services = base.services ?? [
      { name: 'lunch', startTime: '12:00', endTime: '14:00' },
      { name: 'dinner', startTime: '19:00', endTime: '22:00' },
    ]
    const results: { value: string; ok: boolean; message?: string }[] = []
    for (const value of ['25:99', '9:30']) {
      try {
        await writeGlobal(
          {
            services: services.map((s, i) =>
              i === 0 ? { ...s, startTime: value } : s,
            ) as ImpostazioniSistema['services'],
          },
          false,
          manager,
        )
        results.push({ value, ok: false, message: 'update non rifiutato' })
      } catch (error) {
        const msg =
          error instanceof APIError
            ? String(error.message)
            : error instanceof Error
              ? error.message
              : String(error)
        const expected = validateTimeOfDayField(value)
        const expectedStr = typeof expected === 'string' ? expected : ''
        results.push({
          value,
          ok: expectedStr ? msg.includes(expectedStr) : false,
          message: msg.slice(0, 200),
        })
      }
    }
    process.stdout.write(
      JSON.stringify({ results, expectedFormat: validateTimeOfDayField('9:30') }),
    )
    return
  }

  if (action === 'permissions') {
    const createdIds: (number | string)[] = []
    const runId = Date.now().toString(36)
    const prefix = `verify-hours-${runId}-`

    async function createUser(data: {
      email: string
      adminRole: User['adminRole']
      appRole: User['appRole']
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
          active: true,
          emailVerified: true,
        },
      })
      createdIds.push(doc.id)
      return doc as User
    }

    const admin = await createUser({
      email: `${prefix}admin@example.com`,
      adminRole: 'admin',
      appRole: 'none',
    })
    const superAdmin = await createUser({
      email: `${prefix}super@example.com`,
      adminRole: 'super-admin',
      appRole: 'none',
    })
    const noRole = {
      id: 0,
      adminRole: 'none' as const,
      appRole: 'none' as const,
      active: true,
      email: `${prefix}norole@example.com`,
    } as User

    const probe = { bnb: { checkInTime: '14:00', checkOutTime: '10:00' } }

    async function tryUpdate(user: User | undefined): Promise<boolean> {
      try {
        await payload.updateGlobal({
          slug: SYSTEM_SETTINGS_SLUG,
          depth: 0,
          overrideAccess: false,
          user,
          data: probe,
        })
        return true
      } catch (error) {
        if (isAccessDenied(error)) return false
        throw error
      }
    }

    async function tryRead(user: User | undefined): Promise<boolean> {
      try {
        await payload.findGlobal({
          slug: SYSTEM_SETTINGS_SLUG,
          depth: 0,
          overrideAccess: false,
          user,
        })
        return true
      } catch (error) {
        if (isAccessDenied(error)) return false
        throw error
      }
    }

    const out = {
      admin: { read: await tryRead(admin), write: await tryUpdate(admin) },
      superAdmin: { read: await tryRead(superAdmin), write: await tryUpdate(superAdmin) },
      noRole: { read: await tryRead(noRole), write: await tryUpdate(noRole) },
    }

    for (const id of createdIds) {
      await payload.delete({ collection: 'users', id, overrideAccess: true, depth: 0 })
    }

    process.stdout.write(JSON.stringify(out))
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
