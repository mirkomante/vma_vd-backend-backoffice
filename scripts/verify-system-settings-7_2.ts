import { execSync } from 'node:child_process'

import config from '@payload-config'
import { getPayload } from 'payload'

import { dayOnlyDateUtcNoon, normalizeAnnualClosureDate } from '@/lib/systemSettings/dayOnlyDate'
import {
  getItalianPublicHolidaysForYear,
  gregorianEasterSunday,
  mergeItalianPublicHolidays,
} from '@/lib/systemSettings/italianPublicHolidays'
import { SYSTEM_SETTINGS_SLUG } from '@/globals/SystemSettings'

const validServices = [
  { name: 'lunch' as const, startTime: '12:30', endTime: '14:30' },
  { name: 'dinner' as const, startTime: '19:30', endTime: '22:00' },
]

const validBnb = { checkInTime: '15:00', checkOutTime: '11:00' }

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
  const payload = await getPayload({ config })

  // (a) Validazione servizi e HH:mm
  await expectReject('services con una sola riga', () =>
    payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      data: {
        services: [validServices[0]],
        bnb: validBnb,
      },
      depth: 0,
      overrideAccess: true,
    }),
  )

  await expectReject('services con due righe lunch', () =>
    payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      data: {
        services: [validServices[0], { ...validServices[0] }],
        bnb: validBnb,
      },
      depth: 0,
      overrideAccess: true,
    }),
  )

  await expectReject('startTime 24:00', () =>
    payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      data: {
        services: [{ ...validServices[0], startTime: '24:00' }, validServices[1]],
        bnb: validBnb,
      },
      depth: 0,
      overrideAccess: true,
    }),
  )

  await expectReject('startTime 9:30 (manca zero)', () =>
    payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      data: {
        services: [{ ...validServices[0], startTime: '9:30' }, validServices[1]],
        bnb: validBnb,
      },
      depth: 0,
      overrideAccess: true,
    }),
  )

  await expectReject('checkInTime non valido', () =>
    payload.updateGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      data: {
        services: validServices,
        bnb: { ...validBnb, checkInTime: '24:00' },
      },
      depth: 0,
      overrideAccess: true,
    }),
  )

  const helperDate = dayOnlyDateUtcNoon(2026, 12, 25)
  await payload.updateGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    data: {
      services: validServices,
      bnb: validBnb,
      annualClosures: [{ date: helperDate, label: 'Natale (helper)' }],
    },
    depth: 0,
    overrideAccess: true,
  })

  // (b) Confronto forma date nel database (Payload 3.90.2)
  const adminPickerDate = '2026-01-06T12:00:00.000Z'
  const normalizedPicker = normalizeAnnualClosureDate(adminPickerDate)

  await payload.updateGlobal({
    slug: SYSTEM_SETTINGS_SLUG,
    data: {
      services: validServices,
      bnb: validBnb,
      annualClosures: [
        { date: normalizedPicker, label: 'Epifania (dayOnly)' },
        { date: helperDate, label: 'Natale (helper)' },
      ],
    },
    depth: 0,
    overrideAccess: true,
  })

  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl?.includes('127.0.0.1')) {
    throw new Error('DATABASE_URL deve puntare al Postgres locale per la query di verifica.')
  }

  const raw = execSync(
    `psql "${dbUrl}" -t -A -F '|' -c "SELECT date, label FROM impostazioni_sistema_annual_closures ORDER BY label"`,
    { encoding: 'utf8' },
  )
  const rows = raw
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [date, label] = line.split('|')
      return { date: new Date(date), label }
    })

  const epifania = rows.find((r) => r.label.includes('Epifania'))
  const natale = rows.find((r) => r.label.includes('Natale'))
  if (!epifania || !natale) {
    throw new Error('Righe annual_closures attese non trovate nel database.')
  }

  const epifaniaIso = epifania.date.toISOString()
  const nataleIso = natale.date.toISOString()
  console.log('DB Epifania (dayOnly normalizzata):', epifaniaIso)
  console.log('DB Natale (helper):', nataleIso)

  if (epifaniaIso !== normalizedPicker) {
    throw new Error(`Epifania: DB ${epifaniaIso} !== atteso ${normalizedPicker}`)
  }
  if (nataleIso !== helperDate) {
    throw new Error(`Natale: DB ${nataleIso} !== atteso ${helperDate}`)
  }
  if (!epifaniaIso.endsWith('T12:00:00.000Z') || !nataleIso.endsWith('T12:00:00.000Z')) {
    throw new Error('Le date non sono entrambe a mezzogiorno UTC su Payload 3.90.2.')
  }
  console.log('OK (b) dayOnly e helper coincidono (mezzogiorno UTC) su 3.90.2')

  // (c) Festività — lib pura (Pasqua e Lunedì dell’Angelo)
  for (const year of [2024, 2026]) {
    const easter = gregorianEasterSunday(year)
    const holidays = getItalianPublicHolidaysForYear(year)
    if (holidays.length !== 12) {
      throw new Error(`Anno ${year}: attese 12 festività, trovate ${holidays.length}`)
    }
    const pasqua = holidays.find((h) => h.label === 'Pasqua')
    const lunedi = holidays.find((h) => h.label === 'Lunedì dell’Angelo')
    const expectedPasqua = dayOnlyDateUtcNoon(year, easter.month, easter.day)
    if (!pasqua || pasqua.date !== expectedPasqua) {
      throw new Error(`Pasqua ${year} errata: ${pasqua?.date} !== ${expectedPasqua}`)
    }
    if (!lunedi) {
      throw new Error(`Lunedì dell’Angelo ${year} mancante`)
    }
    const pasquaDate = new Date(expectedPasqua)
    const expectedLunedi = dayOnlyDateUtcNoon(
      pasquaDate.getUTCFullYear(),
      pasquaDate.getUTCMonth() + 1,
      pasquaDate.getUTCDate() + 1,
    )
    if (lunedi.date !== expectedLunedi) {
      throw new Error(`Lunedì dell’Angelo ${year}: ${lunedi.date} !== ${expectedLunedi}`)
    }
    console.log(`OK Pasqua/Lunedì ${year}:`, pasqua.date, lunedi.date)
  }

  const mergedOnce = mergeItalianPublicHolidays([], 2026)
  if (mergedOnce.length !== 12) {
    throw new Error('mergeItalianPublicHolidays: attese 12 righe su array vuoto')
  }
  const mergedTwice = mergeItalianPublicHolidays(mergedOnce, 2026)
  if (mergedTwice.length !== 12) {
    throw new Error('mergeItalianPublicHolidays: duplicati al secondo click')
  }
  console.log('OK (c) 12 festività, Pasqua verificata, nessun duplicato al secondo merge')

  console.log('\nVerifica 7.2 completata.')
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Verifica 7.2 non riuscita: ${message}`)
  process.exit(1)
}
