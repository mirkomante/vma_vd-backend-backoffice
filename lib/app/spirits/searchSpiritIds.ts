import type { Payload, PayloadRequest, Where } from 'payload'

import { SPIRITS_SLUG } from '@/lib/menu/constants'

const SEARCH_ID_CAP = 5000

function escapeLike(term: string): string {
  return term.replace(/[%_\\]/g, '\\$&')
}

export async function resolveSpiritSearchIds(
  payload: Payload,
  req: PayloadRequest,
  term: string,
  baseWhere: Where,
): Promise<Array<number | string> | null> {
  const q = term.trim()
  if (!q) {
    return null
  }
  const like = escapeLike(q)
  const where: Where = {
    and: [baseWhere, { name: { like: `%${like}%` } }],
  }
  const found = await payload.find({
    collection: SPIRITS_SLUG,
    depth: 0,
    limit: SEARCH_ID_CAP,
    locale: 'it',
    overrideAccess: false,
    pagination: false,
    req,
    where,
  })
  return found.docs.map((doc) => doc.id)
}
