import {
  compareAnnualClosureRows,
  formatAnnualClosureRowLabel,
  sortAnnualClosuresByDate,
} from '@/lib/systemSettings/annualClosures'
import { dayOnlyDateUtcNoon } from '@/lib/systemSettings/dayOnlyDate'
import {
  MILAN_LOCAL_PUBLIC_HOLIDAY_DEFINITIONS,
  ITALIAN_NATIONAL_PUBLIC_HOLIDAY_DEFINITIONS,
} from '@/lib/systemSettings/holidayDefinitions'
import {
  getItalianPublicHolidaysForYear,
  mergeItalianPublicHolidays,
  removeItalianPublicHolidaysForYear,
} from '@/lib/systemSettings/italianPublicHolidays'
import {
  formatResendSenderRowLabel,
  formatStaffNotificationContactRowLabel,
} from '@/lib/systemSettings/comunicazioniRowLabels'
import {
  EMAIL_ADDRESS_INVALID_MESSAGE,
  isValidEmailAddress,
  normalizeEmailAddress,
  validateEmailAddressField,
} from '@/lib/systemSettings/emailAddress'
import {
  resendSenderRowIndexFromValidatePath,
  resendSenderSiteDuplicateError,
  validateResendSenderSiteField,
} from '@/lib/systemSettings/resendSenders'
import { formatServiceRowLabel } from '@/lib/systemSettings/serviceOptions'

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message)
  }
}

/** Test unitari delle funzioni pure di fase-7.2 (senza Admin UI). */
export function runSystemSettingsPureTests(): void {
  assert(ITALIAN_NATIONAL_PUBLIC_HOLIDAY_DEFINITIONS.length === 12, '12 definizioni nazionali')
  assert(MILAN_LOCAL_PUBLIC_HOLIDAY_DEFINITIONS.length === 1, '1 definizione locale Milano')
  assert(MILAN_LOCAL_PUBLIC_HOLIDAY_DEFINITIONS[0]?.label.includes('Ambrogio'), 'Sant’Ambrogio')

  const holidays2026 = getItalianPublicHolidaysForYear(2026)
  assert(holidays2026.length === 13, '13 festività totali')
  assert(
    holidays2026.some((h) => h.label.includes('Ambrogio') && h.date === dayOnlyDateUtcNoon(2026, 12, 7)),
    'Sant’Ambrogio 7 dicembre 2026',
  )

  const merge1 = mergeItalianPublicHolidays([], 2026)
  assert(merge1.addedCount === 13 && merge1.rows.length === 13, 'merge: 13 aggiunte')
  const merge2 = mergeItalianPublicHolidays(merge1.rows, 2026)
  assert(merge2.addedCount === 0 && merge2.alreadyPresentCount === 13, 'merge: deduplica')

  const custom = {
    date: dayOnlyDateUtcNoon(2026, 7, 15),
    label: 'Ferie custom',
  }
  const withCustom = [...merge1.rows, custom]
  const removed = removeItalianPublicHolidaysForYear(withCustom, 2026)
  assert(removed.removedCount === 13 && removed.rows.length === 1, 'remove: solo predefinite')
  assert(removed.rows[0]?.label === 'Ferie custom', 'remove: custom resta')

  const sorted = sortAnnualClosuresByDate([
    { date: dayOnlyDateUtcNoon(2026, 12, 26), label: 'Z' },
    { date: dayOnlyDateUtcNoon(2026, 1, 1), label: 'A' },
    { date: dayOnlyDateUtcNoon(2026, 1, 1), label: 'B' },
    { label: 'Senza data' },
  ])
  assert(sorted[0]?.label === 'A' && sorted[1]?.label === 'B', 'sort: stessa data stabile')
  assert(sorted[2]?.label === 'Z', 'sort: dicembre dopo gennaio')
  assert(sorted[3]?.label === 'Senza data', 'sort: senza data in fondo')

  assert(compareAnnualClosureRows({ label: 'x' }, { date: dayOnlyDateUtcNoon(2026, 1, 1) }) > 0, 'compare: vuoto dopo')

  assert(
    formatAnnualClosureRowLabel(dayOnlyDateUtcNoon(2026, 12, 25), 'Natale') ===
      'Chiusura 25/12/2026 · Natale',
    'format row label',
  )
  assert(formatAnnualClosureRowLabel(null, 'x') === 'Chiusura (nuova)', 'format nuova riga')

  assert(
    formatServiceRowLabel('lunch', '12:30', '14:30') === 'Pranzo 12:30 – 14:30',
    'format service row con orari',
  )
  assert(formatServiceRowLabel('dinner', null, '23:00') === 'Cena', 'format service senza orari completi')
  assert(formatServiceRowLabel(null, '12:00', '13:00') === 'Servizio (nuovo)', 'format service nuova riga')

  assert(normalizeEmailAddress('Info@Dominio.IT ') === 'info@dominio.it', 'normalize email')
  assert(isValidEmailAddress('info@dominio.it'), 'email valida')
  assert(!isValidEmailAddress('non-email'), 'email non valida')
  assert(validateEmailAddressField('bad@') === EMAIL_ADDRESS_INVALID_MESSAGE, 'validate rifiuta formato')
  assert(
    formatResendSenderRowLabel('Vietnam on Amour', 'info@vietnamonamour.com') ===
      'Vietnam on Amour · info@vietnamonamour.com',
    'row label mittente',
  )
  assert(formatResendSenderRowLabel(null, null) === 'Mittente (nuovo)', 'row label mittente nuovo')
  assert(
    formatStaffNotificationContactRowLabel('Mirko', 'm@example.com') === 'Mirko · m@example.com',
    'row label contatto',
  )
  assert(formatStaffNotificationContactRowLabel(null, null) === 'Contatto (nuovo)', 'row label contatto nuovo')
  assert(resendSenderRowIndexFromValidatePath(['resendSenders', 1, 'site']) === 1, 'path → indice riga')
  const dupRows = [
    { site: 'vietnamonamour', name: 'A', address: 'a@b.it' },
    { site: 'vietnamonamour', name: 'B', address: 'b@b.it' },
  ]
  assert(resendSenderSiteDuplicateError('vietnamonamour', 0, dupRows) === true, 'prima riga duplicato OK')
  assert(resendSenderSiteDuplicateError('vietnamonamour', 1, dupRows) !== true, 'seconda riga duplicato errore')
  assert(
    validateResendSenderSiteField('vietnamonamour', {
      data: { resendSenders: dupRows },
      path: ['resendSenders', 0, 'site'],
    }) === true,
    'validate site prima riga OK',
  )
  assert(
    validateResendSenderSiteField('vietnamonamour', {
      data: { resendSenders: dupRows },
      path: ['resendSenders', 1, 'site'],
    }) !== true,
    'validate site seconda riga errore',
  )

  console.log('OK funzioni pure (festività, sort, remove, RowLabel, email, mittenti)')
}
