/**
 * F-EN Parte A: riproduce update locale en (solo descrizione) con nome en vuoto.
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

async function tryEnDescriptionOnly(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: string,
  id: number | string,
  description: string,
): Promise<{ ok: boolean; detail: string }> {
  try {
    await payload.update({
      collection,
      id,
      overrideAccess: true,
      depth: 0,
      locale: 'en',
      fallbackLocale: false,
      data: { description },
    })
    return { ok: true, detail: 'riuscito' }
  } catch (error) {
    return { ok: false, detail: formatError(error) }
  }
}

async function main(): Promise<void> {
  assertDevDatabaseFromEnv()
  const payload = await getPayload({ config })
  const tag = `${PREFIX}${Date.now().toString(36)}`
  const created: { collection: string; id: number | string }[] = []

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
    data: { name: `${tag} cat`, visibility: 'always' },
  })
  created.push({ collection: FIXED_MENU_CATEGORIES_SLUG, id: fixedCat.id })

  const categoryId = dishCat.docs[0]?.id
  const drinkTypeId = drinkType.docs[0]?.id
  if (!categoryId || !drinkTypeId) {
    throw new Error('Fixture tassonomie mancanti (categoria piatto / tipologia bevanda)')
  }

  const dish = await payload.create({
    collection: DISHES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: {
      name: `${tag} dish`,
      description: 'IT dish desc',
      price: 1,
      category: categoryId,
    },
  })
  created.push({ collection: DISHES_SLUG, id: dish.id })

  const drink = await payload.create({
    collection: DRINKS_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: {
      name: `${tag} drink`,
      description: 'IT drink desc',
      price: 2,
      type: drinkTypeId,
    },
  })
  created.push({ collection: DRINKS_SLUG, id: drink.id })

  const service = await payload.create({
    collection: MENU_SERVICES_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: { name: `${tag} service`, price: 1 },
  })
  created.push({ collection: MENU_SERVICES_SLUG, id: service.id })

  const fixedMenu = await payload.create({
    collection: FIXED_MENUS_SLUG,
    overrideAccess: true,
    depth: 0,
    locale: 'it',
    data: {
      name: `${tag} menu`,
      description: 'IT menu desc',
      price: 10,
      category: fixedCat.id,
      visibility: 'always',
    },
  })
  created.push({ collection: FIXED_MENUS_SLUG, id: fixedMenu.id })

  console.log('--- F-EN: update en solo descrizione (nome en assente) ---\n')

  const cases: { collection: string; id: number | string; note?: string }[] = [
    { collection: DISHES_SLUG, id: dish.id },
    { collection: DRINKS_SLUG, id: drink.id },
    { collection: FIXED_MENUS_SLUG, id: fixedMenu.id },
    {
      collection: MENU_SERVICES_SLUG,
      id: service.id,
      note: 'nessun campo localizzato oltre al nome: update en con data {}',
    },
    {
      collection: FIXED_MENU_CATEGORIES_SLUG,
      id: fixedCat.id,
      note: 'nessun campo localizzato oltre al nome: update en con data {}',
    },
  ]

  for (const row of cases) {
    if (row.note) {
      try {
        await payload.update({
          collection: row.collection,
          id: row.id,
          overrideAccess: true,
          depth: 0,
          locale: 'en',
          fallbackLocale: false,
          data: {},
        })
        console.log(`${row.collection}: riuscito (${row.note})`)
      } catch (error) {
        console.log(`${row.collection}: FALLITO — ${formatError(error)} (${row.note})`)
      }
      continue
    }
    const result = await tryEnDescriptionOnly(
      payload,
      row.collection,
      row.id,
      `EN description ${tag}`,
    )
    console.log(
      `${row.collection}: ${result.ok ? 'riuscito' : 'FALLITO'} — ${result.detail}`,
    )
  }

  console.log('\n--- cleanup verify-ui-fen-* ---')
  for (const row of [...created].reverse()) {
    await payload.delete({
      collection: row.collection,
      id: row.id,
      overrideAccess: true,
      depth: 0,
    })
  }
  console.log('OK: record di prova eliminati')
}

try {
  await main()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`F-EN repro non riuscita: ${message}`)
  process.exit(1)
}
