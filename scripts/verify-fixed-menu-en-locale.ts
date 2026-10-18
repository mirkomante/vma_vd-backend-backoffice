/**
 * Verifica: dopo update EN su fixed-menus, ordine/piatti/porzioni IT restano invariati.
 *   pnpm payload run scripts/verify-fixed-menu-en-locale.ts
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { buildFixedMenuEnglishUpdateData } from '@/lib/app/fixedMenus/writeFixedMenuEnglish'
import type { FixedMenuFormValues } from '@/lib/app/fixedMenus/types'
import { appLocalApiContext } from '@/lib/menu/appPayloadContext'
import {
  DISHES_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
} from '@/lib/menu/constants'
import { relationshipId } from '@/lib/menu/relationshipId'
import type { FixedMenu } from '@/payload-types'

import { assertDevDatabaseFromEnv } from './import-menu-vtn-backend/databaseUrl'

const PREFIX = 'verify-ui-fm-en-'

function dishRowsSignature(doc: FixedMenu): string {
  return JSON.stringify(
    doc.dishes?.map((row) => ({
      id: row.id,
      dish: relationshipId(row.dish),
      portion: row.portion ?? '',
    })) ?? [],
  )
}

try {
  assertDevDatabaseFromEnv()
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: FIXED_MENUS_SLUG,
    where: { name: { like: `${PREFIX}%` } },
    limit: 50,
    depth: 0,
    overrideAccess: true,
  })
  for (const doc of existing.docs) {
    await payload.delete({ collection: FIXED_MENUS_SLUG, id: doc.id, overrideAccess: true })
  }

  const cat = await payload.create({
    collection: FIXED_MENU_CATEGORIES_SLUG,
    data: { name: `${PREFIX}cat`, visibility: 'always' },
    overrideAccess: true,
  })

  const dishes = await payload.find({
    collection: DISHES_SLUG,
    limit: 2,
    depth: 0,
    overrideAccess: true,
  })
  if (dishes.docs.length < 2) {
    throw new Error('Servono almeno due piatti nel DB dev')
  }
  const [d1, d2] = dishes.docs

  const created = (await payload.create({
    collection: FIXED_MENUS_SLUG,
    data: {
      name: `${PREFIX}menu`,
      description: 'porzione A',
      price: 25,
      category: cat.id,
      visibility: 'always',
      dishes: [
        { dish: d1.id, portion: '2 pezzi' },
        { dish: d2.id, portion: '1 porzione' },
      ],
    },
    depth: 0,
    locale: 'it',
    overrideAccess: true,
  })) as FixedMenu

  const itBefore = (await payload.findByID({
    collection: FIXED_MENUS_SLUG,
    id: created.id,
    depth: 0,
    locale: 'it',
    overrideAccess: true,
  })) as FixedMenu

  const values: FixedMenuFormValues = {
    name: itBefore.name,
    description: itBefore.description ?? '',
    nameEn: '',
    descriptionEn: 'EN desc only',
    priceInput: '25',
    categoryId: String(cat.id),
    visibility: 'always',
    visibilityTouched: true,
    specialOnly: false,
    disabled: false,
    serviceIds: [],
    dishes: (itBefore.dishes ?? []).map((row, index) => {
      const dishId = relationshipId(row.dish)
      return {
        rowId: row.id ?? `row-${index}`,
        dishId: String(dishId),
        dishName: `dish-${dishId}`,
        dishStatus: 'available',
        portionIt: row.portion ?? '',
        portionEn: index === 0 ? '2 pieces' : '',
      }
    }),
  }

  const enData = buildFixedMenuEnglishUpdateData(itBefore, values)
  await payload.update({
    id: created.id,
    collection: FIXED_MENUS_SLUG,
    context: appLocalApiContext().context,
    data: enData,
    depth: 0,
    fallbackLocale: false,
    locale: 'en',
    overrideAccess: true,
  })

  const itAfter = (await payload.findByID({
    collection: FIXED_MENUS_SLUG,
    id: created.id,
    depth: 0,
    locale: 'it',
    overrideAccess: true,
  })) as FixedMenu

  if (dishRowsSignature(itBefore) !== dishRowsSignature(itAfter)) {
    throw new Error('IT dishes/order/portions changed after EN update')
  }
  if (itAfter.name !== itBefore.name || (itAfter.description ?? '') !== (itBefore.description ?? '')) {
    throw new Error('IT name/description changed after EN update')
  }

  await payload.delete({ collection: FIXED_MENUS_SLUG, id: created.id, overrideAccess: true })
  await payload.delete({ collection: FIXED_MENU_CATEGORIES_SLUG, id: cat.id, overrideAccess: true })
  await payload.destroy()
  console.log('OK: verify-fixed-menu-en-locale')
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
