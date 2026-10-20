import type { Payload } from 'payload'

import {
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  MENU_SERVICES_SLUG,
} from '@/lib/menu/constants'
import type { User } from '@/payload-types'

async function findUser(payload: Payload, email: string): Promise<User> {
  const res = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const user = res.docs[0] as User | undefined
  if (!user) throw new Error('utente manager di prova non trovato')
  return user
}

/** Piatti, categorie menù e servizi seed per un worker (nomi da `nome()`). */
export type SeedSlug = typeof DISHES_SLUG | typeof FIXED_MENU_CATEGORIES_SLUG | typeof MENU_SERVICES_SLUG

export async function ensureWorkerMenuSeeds(
  payload: Payload,
  managerEmail: string,
  nome: (slug: string) => string,
  register: (collection: SeedSlug, id: number | string) => void,
): Promise<void> {
  const user = await findUser(payload, managerEmail)

  const catDish = await payload.find({
    collection: DISH_CATEGORIES_SLUG,
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const dishCategoryId = catDish.docs[0]?.id
  if (dishCategoryId == null) throw new Error('nessuna categoria piatti nel database')

  for (const slug of ['p1', 'p2', 'p3', 'p4']) {
    const name = nome(slug)
    const found = await payload.find({
      collection: DISHES_SLUG,
      where: { name: { equals: name } },
      limit: 1,
      overrideAccess: true,
    })
    if (!found.docs[0]) {
      const doc = await payload.create({
        collection: DISHES_SLUG,
        data: {
          name,
          description: 'verify-ui',
          price: 10,
          category: dishCategoryId,
        },
        overrideAccess: false,
        user,
      })
      register(DISHES_SLUG, doc.id)
    }
  }

  for (const seed of [
    { slug: 'pranzo', visibility: 'lunch_only' as const },
    { slug: 'sempre', visibility: 'always' as const },
    { slug: 'cat', visibility: 'always' as const },
  ]) {
    const name = nome(seed.slug)
    const found = await payload.find({
      collection: FIXED_MENU_CATEGORIES_SLUG,
      where: { name: { equals: name } },
      limit: 1,
      overrideAccess: true,
    })
    if (!found.docs[0]) {
      const doc = await payload.create({
        collection: FIXED_MENU_CATEGORIES_SLUG,
        data: { name, visibility: seed.visibility },
        overrideAccess: false,
        user,
      })
      register(FIXED_MENU_CATEGORIES_SLUG, doc.id)
    }
  }

  for (const slug of ['servizio-a', 'servizio-b']) {
    const name = nome(slug)
    const found = await payload.find({
      collection: MENU_SERVICES_SLUG,
      where: { name: { equals: name } },
      limit: 1,
      overrideAccess: true,
    })
    if (!found.docs[0]) {
      const doc = await payload.create({
        collection: MENU_SERVICES_SLUG,
        data: { name, price: 2 },
        overrideAccess: false,
        user,
      })
      register(MENU_SERVICES_SLUG, doc.id)
    }
  }
}
