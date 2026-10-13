import type { PayloadRequest } from 'payload'

/** Valori dall'hook `afterChange` quando `findGlobal`/`find` con `req` non vede ancora la riga aggiornata (REST Admin). */
export type MenuAvailabilityStateOverlay = {
  globalMessageIt?: string
  globalMessageEn?: string
  dishPatch?: {
    id: number | string
    disabled?: boolean | null
    soldOut?: boolean | null
  }
  binaryItemPatch?: {
    collection: string
    id: number | string
    disabled?: boolean | null
  }
}

export function overlayFromMenuGeneralHookDoc(
  doc: Record<string, unknown>,
  locale: PayloadRequest['locale'],
): MenuAvailabilityStateOverlay | undefined {
  const msg = doc.globalMessage
  if (typeof msg === 'string') {
    if (locale === 'en') {
      return { globalMessageEn: msg }
    }
    return { globalMessageIt: msg }
  }
  if (msg && typeof msg === 'object') {
    const record = msg as { it?: string | null; en?: string | null }
    if (locale === 'en' && typeof record.en === 'string') {
      return { globalMessageEn: record.en }
    }
    if (typeof record.it === 'string') {
      return { globalMessageIt: record.it }
    }
  }
  return undefined
}
