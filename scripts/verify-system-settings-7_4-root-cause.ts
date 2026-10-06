/**
 * Prova radice fase-7.4: solo `access` di campo (hook afterRead e beforeChange manager disattivati).
 * DATABASE_URL=…/vma_vd_migr pnpm payload run scripts/verify-system-settings-7_4-root-cause.ts
 * REST: richiede pnpm dev. Output chiave-per-chiave su stdout (per CHANGELOG).
 */
import { SYSTEM_SETTINGS_SLUG, SystemSettings } from '@/globals/SystemSettings'

const beforeValidateOnly = SystemSettings.hooks?.beforeValidate ?? []
SystemSettings.hooks = { beforeValidate: beforeValidateOnly }

import config from '@payload-config'
import { getPayload } from 'payload'

import type { User } from '@/payload-types'

const PROBE_CAL = 'root-cause-cal@test.local'
const PROBE_RESEND = [{ site: 'vietnamonamour' as const, name: 'RC', address: 'rc@example.com' }]
const PROBE_STAFF = [{ name: 'RC Staff', email: 'rc-staff@example.com' }]
const validServices = [
  { name: 'lunch' as const, startTime: '12:30', endTime: '14:30' },
  { name: 'dinner' as const, startTime: '19:30', endTime: '22:00' },
]

function keysReport(label: string, doc: Record<string, unknown>): void {
  const keys = Object.keys(doc).sort()
  console.log(`\n=== ${label} ===`)
  console.log(`chiavi: ${keys.join(', ')}`)
  for (const k of [
    'googleCalendarId',
    'resendSenders',
    'staffNotificationContacts',
    'services',
    'bnb',
  ]) {
    console.log(`  ${k}: ${JSON.stringify(doc[k] ?? null)}`)
  }
}

async function restGet(path: string): Promise<Record<string, unknown>> {
  const base = (process.env.APP_PUBLIC_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  const res = await fetch(`${base}${path}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`REST ${path} → ${res.status}`)
  }
  return (await res.json()) as Record<string, unknown>
}

async function main(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL ?? ''
  if (/\/vma_vd_dev(\?|$)/.test(dbUrl)) {
    throw new Error('Usare vma_vd_migr, non vma_vd_dev.')
  }

  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    depth: 0,
    overrideAccess: true,
    data: {
      services: validServices,
      bnb: { checkInTime: '15:00', checkOutTime: '11:00' },
      googleCalendarId: PROBE_CAL,
      resendSenders: PROBE_RESEND,
      staffNotificationContacts: PROBE_STAFF,
    },
  })

  const staffCheck = await payload.findGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    depth: 0,
    overrideAccess: true,
  })
  keysReport(
    'Local API overrideAccess:true (senza utente, hook maschera OFF)',
    staffCheck as unknown as Record<string, unknown>,
  )

  keysReport(
    'REST GET anonimo ?locale=it',
    await restGet('/api/globals/impostazioni-sistema?locale=it'),
  )
  keysReport(
    'REST GET anonimo ?select[resendSenders]=true',
    await restGet('/api/globals/impostazioni-sistema?locale=it&select[resendSenders]=true'),
  )

  const manager = (await payload.create({
    collection: 'users',
    overrideAccess: true,
    depth: 0,
    data: {
      email: `root-cause-mgr-${Date.now()}@example.com`,
      adminRole: 'none',
      appRole: 'manager',
      loginMethod: 'sso',
      active: true,
      emailVerified: true,
    },
  })) as User

  try {
    const mgrRead = await payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: false,
      user: manager,
    })
    keysReport(
      'Local API manager read overrideAccess:false',
      mgrRead as unknown as Record<string, unknown>,
    )

    await payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: false,
      user: manager,
      data: {
        googleCalendarId: 'manager-write-cal',
        resendSenders: [{ site: 'villadoree', name: 'X', address: 'x@example.com' }],
        staffNotificationContacts: [{ name: 'H', email: 'h@example.com' }],
      },
    })

    const afterMgrUpdate = await payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: true,
    })
    keysReport(
      'Dopo update manager (staff read overrideAccess:true)',
      afterMgrUpdate as unknown as Record<string, unknown>,
    )
  } finally {
    await payload.delete({ collection: 'users', id: manager.id, overrideAccess: true })
  }

  await payload.destroy()
  console.log('\nProva radice completata.')
}

try {
  await main()
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
