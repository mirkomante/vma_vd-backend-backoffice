import type { Payload, PayloadRequest, Where } from 'payload'

import { DISHES_SLUG } from '@/lib/menu/constants'

export type DishSearchMode = 'or_single_locale' | 'union_locales'

const SEARCH_ID_CAP = 5000

function escapeLike(term: string): string {
  return term.replace(/[%_\\]/g, '\\$&')
}

async function findIdsForLocale(
  payload: Payload,
  req: PayloadRequest,
  locale: 'it' | 'en',
  term: string,
  baseWhere: Where,
): Promise<Array<number | string>> {
  const like = escapeLike(term.trim())
  if (!like) {
    return []
  }
  const where: Where = {
    and: [baseWhere, { name: { like: `%${like}%` } }],
  }
  const found = await payload.find({
    collection: DISHES_SLUG,
    depth: 0,
    limit: SEARCH_ID_CAP,
    locale,
    overrideAccess: false,
    pagination: false,
    req,
    where,
  })
  return found.docs.map((doc) => doc.id)
}

/** Prova `or` sul nome in due locale nella stessa where; se Payload rifiuta, unione it+en. */
export async function resolveDishSearchIds(
  payload: Payload,
  req: PayloadRequest,
  term: string,
  baseWhere: Where,
): Promise<{ ids: Array<number | string> | null; mode: DishSearchMode }> {
  const q = term.trim()
  if (!q) {
    return { ids: null, mode: 'or_single_locale' }
  }

  const like = escapeLike(q)
  try {
    const orWhere: Where = {
      and: [
        baseWhere,
        {
          or: [
            { name: { like: `%${like}%` } },
            { 'name.en': { like: `%${like}%` } },
          ],
        },
      ],
    }
    const found = await payload.find({
      collection: DISHES_SLUG,
      depth: 0,
      limit: SEARCH_ID_CAP,
      locale: 'it',
      overrideAccess: false,
      pagination: false,
      req,
      where: orWhere,
    })
    return { ids: found.docs.map((doc) => doc.id), mode: 'or_single_locale' }
  } catch {
    const itIds = await findIdsForLocale(payload, req, 'it', q, baseWhere)
    const enIds = await findIdsForLocale(payload, req, 'en', q, baseWhere)
    const union = [...new Set([...itIds, ...enIds])]
    return { ids: union, mode: 'union_locales' }
  }
}
