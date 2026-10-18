import type { Payload, PayloadRequest, Where } from 'payload'

import { WINES_SLUG } from '@/lib/menu/constants'

const SEARCH_ID_CAP = 5000

function escapeLike(term: string): string {
  return term.replace(/[%_\\]/g, '\\$&')
}

async function findIdsByField(
  payload: Payload,
  req: PayloadRequest,
  field: 'name' | 'winery',
  term: string,
  baseWhere: Where,
): Promise<Array<number | string>> {
  const like = escapeLike(term.trim())
  if (!like) {
    return []
  }
  const where: Where = {
    and: [baseWhere, { [field]: { like: `%${like}%` } }],
  }
  const found = await payload.find({
    collection: WINES_SLUG,
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

/** Prova `or` su nome e cantina; se fallisce, unione di due query. */
export async function resolveWineSearchIds(
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
  try {
    const where: Where = {
      and: [
        baseWhere,
        {
          or: [{ name: { like: `%${like}%` } }, { winery: { like: `%${like}%` } }],
        },
      ],
    }
    const found = await payload.find({
      collection: WINES_SLUG,
      depth: 0,
      limit: SEARCH_ID_CAP,
      locale: 'it',
      overrideAccess: false,
      pagination: false,
      req,
      where,
    })
    return found.docs.map((doc) => doc.id)
  } catch {
    const [byName, byWinery] = await Promise.all([
      findIdsByField(payload, req, 'name', q, baseWhere),
      findIdsByField(payload, req, 'winery', q, baseWhere),
    ])
    const merged = new Set<string>()
    for (const id of [...byName, ...byWinery]) {
      merged.add(String(id))
    }
    return [...merged]
  }
}
