/**
 * F-EN: prova decisiva (a)–(e) su DB dev. Record verify-ui-fen-* eliminati a fine script.
 *   pnpm payload run scripts/verify-f-en-localized-name-repro.ts
 */
import config from '@payload-config'
import { getPayload, ValidationError } from 'payload'

import {
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  DRINK_TYPES_SLUG,
  DRINKS_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
  MENU_SERVICES_SLUG,
} from '@/lib/menu/constants'

import { assertDevDatabaseFromEnv } from './import-menu-vtn-backend/databaseUrl'

const PREFIX = 'verify-ui-fen-'

type CollectionSlug =
  | typeof DISHES_SLUG
  | typeof DRINKS_SLUG
  | typeof MENU_SERVICES_SLUG
  | typeof FIXED_MENU_CATEGORIES_SLUG
  | typeof FIXED_MENUS_SLUG

function formatError(error: unknown): string {
  if (error instanceof ValidationError) {
    const parts = error.data?.errors?.map((e) => {
      const label = e.label ?? e.path
      const msg = e.message
      return label && msg ? `${label}: ${msg}` : (msg ?? String(e.path))
    })
    if (parts?.length) {
      return parts.join('; ')
    }
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

function isValidationError(error: unknown): boolean {
  return error instanceof ValidationError
}

type RowResult = {
  a: string
  b: string
  c: string
  d: string
  e: string
}

async function main(): Promise<void> {
  assertDevDatabaseFromEnv()
  const payload = await getPayload({ config })
  const tag = `${PREFIX}${Date.now().toString(36)}`
  const itName = `${tag} it-name`
  const enDesc = `EN desc ${tag}`
  const enName = `EN name ${tag}`
  const created: { collection: CollectionSlug; id: number | string }[] = []
  const results: Record<CollectionSlug, RowResult> = {} as Record<CollectionSlug, RowResult>

  const dishCat = await payload.find({
    collection: DISH_CATEGORIES_SLUG,
    limit: 1,
    overrideAccess: true,
    depth: 0,
  })
  const drinkType = await payload.find({
    collection: DRINK_TYPES_SLUG,
    limit: 1,
    overrideAccess: true,
    depth: 0,
  })
  const fixedCat = await payload.create({
    collection: FIXED_MENU_CATEGORIES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: { name: itName, visibility: 'always' },
  })
  created.push({ collection: FIXED_MENU_CATEGORIES_SLUG, id: fixedCat.id })

  const categoryId = dishCat.docs[0]?.id
  const drinkTypeId = drinkType.docs[0]?.id
  if (!categoryId || !drinkTypeId) {
    throw new Error('Fixture tassonomie mancanti')
  }

  const fixtures: {
    collection: CollectionSlug
    id: number | string
    createData: Record<string, unknown>
    createNoName: Record<string, unknown>
  }[] = [
    {
      collection: DISHES_SLUG,
      id: 0,
      createData: {
        name: itName,
        description: 'IT desc',
        price: 1,
        category: categoryId,
      },
      createNoName: { description: 'x', price: 1, category: categoryId },
    },
    {
      collection: DRINKS_SLUG,
      id: 0,
      createData: {
        name: itName,
        description: 'IT desc',
        price: 2,
        type: drinkTypeId,
      },
      createNoName: { description: 'x', price: 2, type: drinkTypeId },
    },
    {
      collection: MENU_SERVICES_SLUG,
      id: 0,
      createData: { name: itName, price: 1 },
      createNoName: { price: 1 },
    },
    {
      collection: FIXED_MENU_CATEGORIES_SLUG,
      id: fixedCat.id,
      createData: { name: itName, visibility: 'always' },
      createNoName: { visibility: 'always' },
    },
    {
      collection: FIXED_MENUS_SLUG,
      id: 0,
      createData: {
        name: itName,
        description: 'IT menu desc',
        price: 10,
        category: fixedCat.id,
        visibility: 'always',
      },
      createNoName: {
        description: 'x',
        price: 10,
        category: fixedCat.id,
        visibility: 'always',
      },
    },
  ]

  for (const row of fixtures) {
    if (row.collection === FIXED_MENU_CATEGORIES_SLUG) {
      row.id = fixedCat.id
      continue
    }
    const doc = await payload.create({
      collection: row.collection,
      overrideAccess: true,
      depth: 0,
      locale: 'it',
      data: row.createData as never,
    })
    row.id = doc.id
    created.push({ collection: row.collection, id: doc.id })
  }

  for (const row of fixtures) {
    const slug = row.collection
    const id = row.id
    const out: RowResult = { a: '?', b: '?', c: '?', d: '?', e: '?' }

    // (a) update en: name '' + description only (or only name '' for services/categories)
    try {
      const data =
        slug === MENU_SERVICES_SLUG || slug === FIXED_MENU_CATEGORIES_SLUG
          ? { name: '' }
          : { name: '', description: enDesc }
      await payload.update({
        collection: slug,
        id,
        overrideAccess: true,
        depth: 0,
        locale: 'en',
        fallbackLocale: false,
        data,
      })
      out.a = 'OK'
    } catch (error) {
      out.a = `FAIL: ${formatError(error)}`
    }

    // (b) read en with fallback → IT name
    try {
      const withFb = await payload.findByID({
        collection: slug,
        id,
        locale: 'en',
        depth: 0,
        overrideAccess: true,
      })
      out.b = withFb.name === itName ? 'OK' : `FAIL: name=${String(withFb.name)}`
    } catch (error) {
      out.b = `FAIL: ${formatError(error)}`
    }

    // (c) read en fallbackLocale false → empty name
    try {
      const noFb = await payload.findByID({
        collection: slug,
        id,
        locale: 'en',
        fallbackLocale: false,
        depth: 0,
        overrideAccess: true,
      })
      const n = noFb.name
      out.c = n === '' || n == null ? 'OK' : `FAIL: name=${String(n)}`
    } catch (error) {
      out.c = `FAIL: ${formatError(error)}`
    }

    // (d) create it without name → rejected
    try {
      await payload.create({
        collection: slug,
        overrideAccess: true,
        depth: 0,
        locale: 'it',
        data: row.createNoName as never,
      })
      out.d = 'FAIL: create senza nome accettato'
    } catch (error) {
      out.d = isValidationError(error) ? 'OK' : `FAIL: ${formatError(error)}`
    }

    // (e) update en with real name → read back
    try {
      await payload.update({
        collection: slug,
        id,
        overrideAccess: true,
        depth: 0,
        locale: 'en',
        fallbackLocale: false,
        data: { name: enName },
      })
      const enDoc = await payload.findByID({
        collection: slug,
        id,
        locale: 'en',
        fallbackLocale: false,
        depth: 0,
        overrideAccess: true,
      })
      out.e = enDoc.name === enName ? 'OK' : `FAIL: name=${String(enDoc.name)}`
    } catch (error) {
      out.e = `FAIL: ${formatError(error)}`
    }

    results[slug] = out
  }

  console.log('--- F-EN prova decisiva (a)–(e) ---\n')
  for (const slug of Object.keys(results) as CollectionSlug[]) {
    const r = results[slug]
    console.log(`${slug}:`)
    console.log(`  (a) update en name '' + desc: ${r.a}`)
    console.log(`  (b) read en fallback → IT: ${r.b}`)
    console.log(`  (c) read en no fallback name vuoto: ${r.c}`)
    console.log(`  (d) create it senza nome: ${r.d}`)
    console.log(`  (e) update en nome vero: ${r.e}`)
    console.log('')
  }

  const allOk = Object.values(results).every((r) =>
    [r.a, r.b, r.c, r.d, r.e].every((cell) => cell === 'OK'),
  )
  if (!allOk) {
    throw new Error('Prova decisiva F-EN: almeno un controllo non OK — vedi log sopra')
  }

  console.log('--- cleanup verify-ui-fen-* ---')
  for (const row of [...created].reverse()) {
    if (row.collection === FIXED_MENU_CATEGORIES_SLUG && row.id === fixedCat.id) {
      await payload.delete({
        collection: row.collection,
        id: row.id,
        overrideAccess: true,
        depth: 0,
      })
      continue
    }
    await payload.delete({
      collection: row.collection,
      id: row.id,
      overrideAccess: true,
      depth: 0,
    })
  }
  console.log('OK: record di prova eliminati')
  console.log('F-EN prova decisiva: tutti OK')
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`F-EN repro non riuscita: ${message}`)
  process.exit(1)
}
