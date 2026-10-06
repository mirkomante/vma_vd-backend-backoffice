export const RESEND_SENDER_SITE_OPTIONS = [
  { label: 'vietnamonamour.com', value: 'vietnamonamour' },
  { label: 'villadoree.com', value: 'villadoree' },
] as const

export type ResendSenderSite = (typeof RESEND_SENDER_SITE_OPTIONS)[number]['value']

export type ResendSenderRow = {
  site?: ResendSenderSite | string | null
  name?: string | null
  address?: string | null
  id?: string | null
}

export type StaffNotificationContactRow = {
  name?: string | null
  email?: string | null
  id?: string | null
}

const DUPLICATE_SITE_MESSAGE =
  'Mittenti email: ogni sito (vietnamonamour / villadoree) può comparire una sola volta.'

export function countResendSenderSite(rows: ResendSenderRow[] | null | undefined, site: string): number {
  if (!rows?.length) {
    return 0
  }
  return rows.filter((row) => row.site === site).length
}

export function validateResendSendersArray(value: unknown): true | string {
  if (!Array.isArray(value) || value.length === 0) {
    return true
  }
  const sites = value.map((row) => row?.site).filter((site): site is string => typeof site === 'string' && site.length > 0)
  if (new Set(sites).size !== sites.length) {
    return DUPLICATE_SITE_MESSAGE
  }
  return true
}

type ResendSenderSiteFieldArgs = {
  data?: Record<string, unknown>
}

/** Validazione sul sottocampo `site` (errore vicino al campo se duplicato). */
export function validateResendSenderSiteField(
  value: unknown,
  { data }: ResendSenderSiteFieldArgs,
): true | string {
  if (value == null || value === '') {
    return 'Sito obbligatorio.'
  }
  const rows = data?.resendSenders
  if (!Array.isArray(rows)) {
    return true
  }
  if (countResendSenderSite(rows as ResendSenderRow[], String(value)) > 1) {
    return 'Questo sito è già presente in un altro mittente.'
  }
  return true
}
