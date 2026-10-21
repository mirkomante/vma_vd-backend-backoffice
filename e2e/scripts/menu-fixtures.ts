/** Fixture e2e (solo DB dev): create-catalog-items, delete-prefix — `pnpm payload run e2e/scripts/menu-fixtures.ts -- …` */
import config from '@payload-config'
import { getPayload } from 'payload'

import {
  COUNTRIES_SLUG, DRINK_TYPES_SLUG, DRINKS_SLUG, DISHES_SLUG, FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG, MENU_SERVICES_SLUG, SPECIAL_DAYS_SLUG, SPIRIT_TYPES_SLUG, SPIRITS_SLUG,
  WINE_TYPES_SLUG, WINES_SLUG,
} from '@/lib/menu/constants'
import { relationshipId } from '@/lib/menu/relationshipId'
import type { User } from '@/payload-types'

import { assertDevDatabaseFromEnv } from '../../scripts/import-menu-vtn-backend/databaseUrl'

type Payload = Awaited<ReturnType<typeof getPayload>>

const argv = process.argv.slice(2)
const dash = argv.indexOf('--')
const cliArgs = dash >= 0 ? argv.slice(dash + 1) : argv.filter((a) => !a.includes('menu-fixtures'))
const action = cliArgs[0]
if (!action) {
  console.error('menu-fixtures: azione mancante (argv)', process.argv.join(' '))
  process.exit(1)
}

async function findUserByEmail(payload: Payload, email: string) {
  const res = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return (res.docs[0] as User | undefined) ?? null
}

async function runDeletePrefix(payload: Payload, args: string[]): Promise<void> {
  const prefix = args[1] ?? 'verify-ui-'
  let deleted = 0
  const fixtureMenuIds = new Set<string>()
  const fixtureMenus = await payload.find({
    collection: FIXED_MENUS_SLUG,
    where: { name: { like: `${prefix}%` } },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })
  for (const doc of fixtureMenus.docs) fixtureMenuIds.add(String(doc.id))

  for (;;) {
    const specialDays = await payload.find({
      collection: SPECIAL_DAYS_SLUG,
      limit: 100,
      depth: 0,
      overrideAccess: true,
    })
    let removed = 0
    for (const doc of specialDays.docs) {
      const menuIds =
        (doc as { content?: { fixedMenus?: unknown[] } }).content?.fixedMenus
          ?.map((m) => relationshipId(m))
          .filter((id): id is number | string => id != null)
          .map(String) ?? []
      if (menuIds.some((id) => fixtureMenuIds.has(id))) {
        await payload.delete({ collection: SPECIAL_DAYS_SLUG, id: doc.id, overrideAccess: true })
        deleted += 1
        removed += 1
      }
    }
    if (removed === 0) break
  }

  for (const slug of [FIXED_MENUS_SLUG, FIXED_MENU_CATEGORIES_SLUG, MENU_SERVICES_SLUG, DISHES_SLUG, WINES_SLUG, SPIRITS_SLUG, DRINKS_SLUG] as const) {
    for (let guard = 0; guard < 50; guard += 1) {
      const found = await payload.find({
        collection: slug,
        where: { name: { like: `${prefix}%` } },
        limit: 100,
        depth: 0,
        overrideAccess: true,
      })
      if (found.docs.length === 0) break
      for (const doc of found.docs) {
        await payload.delete({ collection: slug, id: doc.id, overrideAccess: true })
        deleted += 1
      }
    }
  }
  console.log(JSON.stringify({ deleted }))
}

async function runCreateCatalogItems(payload: Payload, args: string[]): Promise<void> {
  const email = args[1]
  const slug = args[2]
  const json = args[3]
  const user = email ? await findUserByEmail(payload, email) : null
  if (!user || !json) throw new Error('create-catalog-items: email, slug e json richiesti')
  if (slug !== WINES_SLUG && slug !== SPIRITS_SLUG && slug !== DRINKS_SLUG) {
    throw new Error('create-catalog-items: slug non valido')
  }
  const specs = JSON.parse(json) as Array<{ name: string; disabled?: boolean; description?: string; descriptionEn?: string }>
  const typeSlug = slug === WINES_SLUG ? WINE_TYPES_SLUG : slug === SPIRITS_SLUG ? SPIRIT_TYPES_SLUG : DRINK_TYPES_SLUG
  const typeRes = await payload.find({ collection: typeSlug, limit: 1, depth: 0, overrideAccess: true })
  const typeId = typeRes.docs[0]?.id
  let countryId: number | string | undefined
  if (slug === WINES_SLUG || slug === SPIRITS_SLUG) {
    const countryRes = await payload.find({
      collection: COUNTRIES_SLUG,
      where: { enabled: { equals: true } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    countryId = countryRes.docs[0]?.id
  }
  if (typeId == null || ((slug === WINES_SLUG || slug === SPIRITS_SLUG) && countryId == null)) {
    console.log(JSON.stringify({ ok: false, reason: 'missing_taxonomy' }))
    return
  }
  const ids: Array<number | string> = []
  for (const spec of specs) {
    const data: Record<string, unknown> = {
      name: spec.name,
      description: spec.description ?? 'verify-ui',
      price: 9.5,
      type: typeId,
      disabled: spec.disabled ?? false,
    }
    if (slug === WINES_SLUG || slug === SPIRITS_SLUG) data.country = countryId
    if (slug === DRINKS_SLUG) {
      data.volume = '33 cl'
      data.abv = '5%'
    }
    const doc = await payload.create({ collection: slug, data: data as never, overrideAccess: false, user })
    if (spec.descriptionEn) {
      await payload.update({
        collection: slug,
        id: doc.id,
        data: { name: spec.name, description: spec.descriptionEn },
        overrideAccess: false,
        user,
        locale: 'en',
      })
    }
    ids.push(doc.id)
  }
  console.log(JSON.stringify({ ok: true, ids }))
}

async function main() {
  if (process.env.NODE_ENV === 'production') throw new Error('menu-fixtures: vietato in produzione')
  assertDevDatabaseFromEnv()
  const payload = await getPayload({ config })
  try {
    const args = [action, ...cliArgs.slice(1)]
    if (action === 'delete-prefix') {
      await runDeletePrefix(payload, args)
      return
    }
    if (action === 'create-catalog-items') {
      await runCreateCatalogItems(payload, args)
      return
    }
    throw new Error(`menu-fixtures: azione non supportata: ${action}`)
  } finally {
    await payload.destroy()
  }
}

try {
  await main()
} catch (err) {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
}
