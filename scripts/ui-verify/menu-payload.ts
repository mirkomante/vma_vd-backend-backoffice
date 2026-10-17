/**
 * Dati di prova «verify-ui-*» per ui:verify Menù (solo DB di sviluppo).
 *
 *   pnpm payload run scripts/ui-verify/menu-payload.ts -- count-sold-out <managerEmail>
 *   pnpm payload run scripts/ui-verify/menu-payload.ts -- create-dishes <managerEmail> <json>
 *   pnpm payload run scripts/ui-verify/menu-payload.ts -- delete-prefix verify-ui-
 */
import config from '@payload-config'
import { APIError, getPayload } from 'payload'

import type { User } from '@/payload-types'

const argv = process.argv.slice(2)
const dash = argv.indexOf('--')
const args = dash >= 0 ? argv.slice(dash + 1) : argv.filter((a) => !a.includes('menu-payload'))
const action = args[0]

if (!action) {
  console.error('menu-payload: azione mancante (argv)', process.argv.join(' '))
  process.exit(1)
}

function isAccessDenied(error: unknown): boolean {
  return error instanceof APIError && error.status === 403
}

async function findUserByEmail(payload: Awaited<ReturnType<typeof getPayload>>, email: string) {
  const res = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return (res.docs[0] as User | undefined) ?? null
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('menu-payload: vietato in produzione')
  }

  const payload = await getPayload({ config })

  if (action === 'count-sold-out') {
    const email = args[1]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user) throw new Error('utente manager non trovato')
    const res = await payload.count({
      collection: 'dishes',
      where: {
        and: [{ soldOut: { equals: true } }, { disabled: { not_equals: true } }],
      },
      overrideAccess: false,
      user,
    })
    console.log(JSON.stringify({ count: res.totalDocs }))
    return
  }

  if (action === 'delete-prefix') {
    const prefix = args[1] ?? 'verify-ui-'
    const found = await payload.find({
      collection: 'dishes',
      where: { name: { like: prefix } },
      limit: 500,
      depth: 0,
      overrideAccess: true,
    })
    let deleted = 0
    for (const doc of found.docs) {
      await payload.delete({ collection: 'dishes', id: doc.id, overrideAccess: true })
      deleted += 1
    }
    console.log(JSON.stringify({ deleted }))
    return
  }

  if (action === 'update-dish') {
    const email = args[1]
    const name = args[2]
    const json = args[3]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !name || !json) throw new Error('update-dish: email, name e json richiesti')
    const patch = JSON.parse(json) as { soldOut?: boolean; disabled?: boolean }
    const found = await payload.find({
      collection: 'dishes',
      where: { name: { equals: name } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const doc = found.docs[0]
    if (!doc) {
      console.log(JSON.stringify({ ok: false, reason: 'not_found' }))
      return
    }
    try {
      await payload.update({
        collection: 'dishes',
        id: doc.id,
        data: patch,
        overrideAccess: false,
        user,
      })
      console.log(JSON.stringify({ ok: true, id: doc.id }))
    } catch (e) {
      if (isAccessDenied(e)) {
        console.log(JSON.stringify({ ok: false, reason: 'access_denied' }))
        return
      }
      throw e
    }
    return
  }

  if (action === 'create-dishes') {
    const email = args[1]
    const json = args[2]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !json) throw new Error('create-dishes: email e json richiesti')
    const specs = JSON.parse(json) as Array<{
      name: string
      soldOut?: boolean
      disabled?: boolean
    }>
    const cat = await payload.find({
      collection: 'dish-categories',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const categoryId = cat.docs[0]?.id
    if (categoryId == null) {
      console.log(JSON.stringify({ ok: false, reason: 'no_category' }))
      return
    }
    const ids: number[] = []
    for (const spec of specs) {
      try {
        const doc = await payload.create({
          collection: 'dishes',
          data: {
            name: spec.name,
            description: 'verify-ui',
            price: 9.5,
            category: categoryId,
            soldOut: spec.soldOut ?? false,
            disabled: spec.disabled ?? false,
          },
          overrideAccess: false,
          user,
        })
        ids.push(doc.id as number)
      } catch (e) {
        if (isAccessDenied(e)) {
          console.log(JSON.stringify({ ok: false, reason: 'access_denied', name: spec.name }))
          return
        }
        throw e
      }
    }
    console.log(JSON.stringify({ ok: true, ids }))
    return
  }

  throw new Error(`menu-payload: azione sconosciuta ${action ?? '(vuota)'}`)
}

try {
  await main()
} catch (err) {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
}
