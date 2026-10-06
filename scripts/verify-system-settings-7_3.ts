import config from '@payload-config'
import { getPayload, ValidationError } from 'payload'

import { runSystemSettingsPureTests } from '@/lib/systemSettings/runPureTests'
import { SYSTEM_SETTINGS_SLUG } from '@/globals/SystemSettings'

const validServices = [
  { name: 'lunch' as const, startTime: '12:30', endTime: '14:30' },
  { name: 'dinner' as const, startTime: '19:30', endTime: '22:00' },
]

const validBnb = { checkInTime: '15:00', checkOutTime: '11:00' }

function validationErrors(error: unknown): { path: string; message: string }[] {
  if (!(error instanceof ValidationError)) {
    return []
  }
  return error.data.errors.map((entry) => ({ path: entry.path, message: entry.message }))
}

async function expectReject(label: string, fn: () => Promise<unknown>): Promise<void> {
  try {
    await fn()
    throw new Error(`${label}: atteso rifiuto, update riuscito`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('atteso rifiuto')) {
      throw error
    }
    console.log(`OK rifiuto — ${label}`)
  }
}

async function main(): Promise<void> {
  runSystemSettingsPureTests()

  const payload = await getPayload({ config })

  const baseOrari = {
    services: validServices,
    bnb: validBnb,
  }

  // Normalizzazione email mittente
  await payload.updateGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    data: {
      ...baseOrari,
      resendSenders: [
        {
          site: 'vietnamonamour',
          name: 'Vietnamonamour',
          address: 'Info@Dominio.IT ',
        },
      ],
    },
    depth: 0,
    overrideAccess: true,
  })

  const afterNormalize = await payload.findGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    depth: 0,
    overrideAccess: true,
  })
  const senderAddress = afterNormalize.resendSenders?.[0]?.address
  if (senderAddress !== 'info@dominio.it') {
    throw new Error(`Normalizzazione address: atteso info@dominio.it, trovato ${senderAddress}`)
  }
  console.log('OK normalizzazione resendSenders[].address → info@dominio.it')

  await expectReject('email mittente non valida', () =>
    payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      data: {
        ...baseOrari,
        resendSenders: [
          {
            site: 'vietnamonamour',
            name: 'Test',
            address: 'non-valido',
          },
        ],
      },
      depth: 0,
      overrideAccess: true,
    }),
  )

  try {
    await payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      data: {
        ...baseOrari,
        resendSenders: [
          { site: 'vietnamonamour', name: 'A', address: 'a@example.com' },
          { site: 'vietnamonamour', name: 'B', address: 'b@example.com' },
        ],
      },
      depth: 0,
      overrideAccess: true,
    })
    throw new Error('doppio site: atteso rifiuto, update riuscito')
  } catch (error) {
    if (error instanceof Error && error.message.includes('doppio site: atteso rifiuto')) {
      throw error
    }
    const errors = validationErrors(error)
    if (errors.length !== 1) {
      throw new Error(
        `doppio site: atteso 1 errore, trovati ${errors.length}: ${JSON.stringify(errors)}`,
      )
    }
    const only = errors[0]
    if (only?.path !== 'resendSenders.1.site') {
      throw new Error(`doppio site: path atteso resendSenders.1.site, trovato ${only?.path}`)
    }
    if (!only.message.includes('vietnamonamour.com')) {
      throw new Error(`doppio site: messaggio inatteso: ${only.message}`)
    }
    console.log('OK doppio site → 1 errore su resendSenders.1.site')
  }

  await payload.updateGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    data: {
      ...baseOrari,
      resendSenders: [
        { site: 'vietnamonamour', name: 'VN', address: 'vn@example.com' },
        { site: 'villadoree', name: 'VD', address: 'vd@example.com' },
      ],
    },
    depth: 0,
    overrideAccess: true,
  })
  console.log('OK due record con site diversi accettati')

  await payload.updateGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    data: {
      ...baseOrari,
      googleCalendarId: '',
      resendSenders: [],
      staffNotificationContacts: [],
    },
    depth: 0,
    overrideAccess: true,
  })

  const emptyRefs = await payload.findGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    depth: 0,
    overrideAccess: true,
  })
  if (emptyRefs.googleCalendarId != null && emptyRefs.googleCalendarId !== '') {
    throw new Error(`googleCalendarId vuoto atteso, trovato ${emptyRefs.googleCalendarId}`)
  }
  if ((emptyRefs.resendSenders?.length ?? 0) !== 0) {
    throw new Error('resendSenders doveva essere vuoto')
  }
  if ((emptyRefs.staffNotificationContacts?.length ?? 0) !== 0) {
    throw new Error('staffNotificationContacts doveva essere vuoto')
  }
  console.log('OK googleCalendarId vuoto e array vuoti')

  console.log('\nVerifica 7.3 completata.')
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Verifica 7.3 non riuscita: ${message}`)
  process.exit(1)
}
