import type { PayloadRequest } from 'payload'
import { ValidationError } from 'payload'

import { SPECIAL_DAYS_SLUG } from '@/lib/menu/constants'
import { parseAndNormalizeSpecialDayDate } from '@/lib/menu/specialDayDate'

export const SPECIAL_DAY_SCOPE_OPTIONS = [
  { label: 'Giornata intera', value: 'day' },
  { label: 'Solo pranzo', value: 'lunch' },
  { label: 'Solo cena', value: 'dinner' },
] as const

export type SpecialDayScope = (typeof SPECIAL_DAY_SCOPE_OPTIONS)[number]['value']

export const SPECIAL_DAY_OVERLAP_MESSAGE =
  'Esiste già un giorno speciale attivo per questa data e questo servizio. La giornata intera non può sovrapporsi a pranzo o cena, e viceversa.'

export function specialDayScopesOverlap(a: SpecialDayScope, b: SpecialDayScope): boolean {
  if (a === 'day' || b === 'day') {
    return true
  }
  return a === b
}

type SpecialDayLike = {
  id?: number | string
  date?: string | null
  scope?: SpecialDayScope | null
  disabled?: boolean | null
}

export async function validateSpecialDayOverlap(
  req: PayloadRequest,
  data: SpecialDayLike | undefined,
  originalDoc?: SpecialDayLike | null,
): Promise<void> {
  if (!data) {
    return
  }

  const disabled = data.disabled ?? originalDoc?.disabled ?? false
  if (disabled) {
    return
  }

  const scope = (data.scope ?? originalDoc?.scope) as SpecialDayScope | undefined
  const dateRaw = data.date ?? originalDoc?.date
  if (!scope || dateRaw == null || dateRaw === '') {
    return
  }

  const normalizedDate = parseAndNormalizeSpecialDayDate(dateRaw)
  const currentId = originalDoc?.id ?? data.id

  const existing = await req.payload.find({
    collection: SPECIAL_DAYS_SLUG,
    where: {
      and: [
        { date: { equals: normalizedDate } },
        { disabled: { equals: false } },
        ...(currentId != null ? [{ id: { not_equals: currentId } }] : []),
      ],
    },
    limit: 50,
    overrideAccess: true,
    depth: 0,
  })

  for (const doc of existing.docs) {
    const otherScope = doc.scope as SpecialDayScope
    if (specialDayScopesOverlap(scope, otherScope)) {
      throw new ValidationError({
        collection: SPECIAL_DAYS_SLUG,
        errors: [{ message: SPECIAL_DAY_OVERLAP_MESSAGE, path: 'scope' }],
      })
    }
  }
}
