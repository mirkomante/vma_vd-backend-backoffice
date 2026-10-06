import { ValidationError } from 'payload'

import { validateRequiredTextField } from '@/lib/systemSettings/requiredTextField'

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

export const RESEND_SENDER_NAME_REQUIRED_MESSAGE =
  'Nome mittente obbligatorio: indica il nome che i clienti vedranno nell’email.'

export const STAFF_NOTIFICATION_NAME_REQUIRED_MESSAGE =
  'Nome obbligatorio: indica il nome del contatto per le notifiche staff.'

export const RESEND_SENDER_SITE_REQUIRED_MESSAGE =
  'Sito obbligatorio: scegli vietnamonamour.com o villadoree.com.'

const SITE_LABEL_BY_VALUE: Record<string, string> = Object.fromEntries(
  RESEND_SENDER_SITE_OPTIONS.map((option) => [option.value, option.label]),
)

export function getResendSenderSiteLabel(site: string): string {
  return SITE_LABEL_BY_VALUE[site] ?? site
}

/** Indice riga array da `path` di Payload (es. `resendSenders`, 1, `site` → 1). */
export function resendSenderRowIndexFromValidatePath(path: (number | string)[] | undefined): number | null {
  if (!path || path.length < 2) {
    return null
  }
  const index = path[path.length - 2]
  return typeof index === 'number' ? index : null
}

/**
 * Un solo errore sulla seconda (e successive) righe che ripetono lo stesso `site`;
 * la prima occorrenza resta valida (Payload 3.90.2: `path` include l’indice riga).
 */
export function resendSenderSiteDuplicateError(
  site: string,
  rowIndex: number,
  rows: ResendSenderRow[],
): true | string {
  const indices: number[] = []
  rows.forEach((row, index) => {
    if (row.site === site) {
      indices.push(index)
    }
  })
  if (indices.length <= 1) {
    return true
  }
  if (rowIndex === indices[0]) {
    return true
  }
  const siteLabel = getResendSenderSiteLabel(site)
  return `Il sito ${siteLabel} ha già un mittente: ogni sito può averne uno solo. Modifica o elimina l'altra riga.`
}

type ResendSenderSiteValidateOptions = {
  data?: { resendSenders?: ResendSenderRow[] | null } & Record<string, unknown>
  path?: (number | string)[]
}

export function validateResendSenderSiteField(
  value: unknown,
  { data, path }: ResendSenderSiteValidateOptions,
): true | string {
  if (value == null || value === '') {
    return RESEND_SENDER_SITE_REQUIRED_MESSAGE
  }
  const rows = data?.resendSenders
  if (!Array.isArray(rows)) {
    return true
  }
  const rowIndex = resendSenderRowIndexFromValidatePath(path)
  if (rowIndex == null) {
    return true
  }
  return resendSenderSiteDuplicateError(String(value), rowIndex, rows as ResendSenderRow[])
}

export function validateResendSenderNameField(value: unknown): true | string {
  return validateRequiredTextField(value, RESEND_SENDER_NAME_REQUIRED_MESSAGE)
}

/**
 * Garantisce unicità `site` anche quando `validate` sul sottocampo non riceve `path`
 * (es. Local API). In Admin, con `path` presente, la stessa regola vale sul campo `site`.
 */
export function resendSendersBeforeValidateHook({ value }: { value: unknown }): unknown {
  if (!Array.isArray(value)) {
    return value
  }
  const rows = value as ResendSenderRow[]
  for (let index = 0; index < rows.length; index++) {
    const site = rows[index]?.site
    if (!site || typeof site !== 'string') {
      continue
    }
    const duplicateMessage = resendSenderSiteDuplicateError(site, index, rows)
    if (duplicateMessage !== true) {
      throw new ValidationError({
        errors: [{ message: duplicateMessage, path: `resendSenders.${index}.site` }],
      })
    }
  }
  return value
}

export function validateStaffNotificationNameField(value: unknown): true | string {
  return validateRequiredTextField(value, STAFF_NOTIFICATION_NAME_REQUIRED_MESSAGE)
}
