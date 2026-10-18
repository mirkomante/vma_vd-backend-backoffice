/**
 * Dati di prova «verify-ui-*» per ui:verify Menù (solo DB di sviluppo).
 *
 *   pnpm payload run scripts/ui-verify/menu-payload.ts -- count-sold-out <managerEmail>
 *   pnpm payload run scripts/ui-verify/menu-payload.ts -- create-dishes <managerEmail> <json>
 *   pnpm payload run scripts/ui-verify/menu-payload.ts -- delete-prefix verify-ui-
 */
import config from '@payload-config'
import { sql } from '@payloadcms/db-postgres'
import { APIError, getPayload, ValidationError } from 'payload'

import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'
import { formatMenuContentDeleteDetail } from '@/lib/menu/menuContentDeleteLog'
import {
  ALLERGENS_SLUG,
  COUNTRIES_SLUG,
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  DRINK_TYPES_SLUG,
  DRINKS_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
  APPELLATIONS_SLUG,
  CLASSIFICATIONS_SLUG,
  REGIONS_SLUG,
  SPIRIT_TYPES_SLUG,
  SPIRITS_SLUG,
  WINE_TYPES_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'
import {
  DRINK_ABV_ERROR_MESSAGE,
  DRINK_VOLUME_ERROR_MESSAGE,
  SPIRIT_ABV_ERROR_MESSAGE,
  SPIRIT_AGING_ERROR_MESSAGE,
  WINE_ABV_ERROR_MESSAGE,
  WINE_VOLUME_ERROR_MESSAGE,
  WINE_YEAR_ERROR_MESSAGE,
} from '@/lib/menu/formats'
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

function isValidationError(error: unknown): boolean {
  return error instanceof ValidationError
}

function validationMessageAtPath(error: unknown, path: string): string | undefined {
  if (!(error instanceof ValidationError)) return undefined
  return error.data.errors.find((fieldError: { path?: string; message?: string }) => fieldError.path === path)
    ?.message
}

function asNumericId(id: number | string): number {
  if (typeof id === 'number') return id
  const parsed = Number(id)
  if (Number.isNaN(parsed)) throw new Error(`ID non numerico: ${id}`)
  return parsed
}

type CatalogContentSlug = typeof WINES_SLUG | typeof SPIRITS_SLUG | typeof DRINKS_SLUG

async function catalogBaseData(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: CatalogContentSlug,
) {
  const typeSlug =
    slug === WINES_SLUG ? WINE_TYPES_SLUG : slug === SPIRITS_SLUG ? SPIRIT_TYPES_SLUG : DRINK_TYPES_SLUG
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
  return { typeId, countryId }
}

function parseCatalogSlug(raw: string): CatalogContentSlug | null {
  if (raw === WINES_SLUG || raw === SPIRITS_SLUG || raw === DRINKS_SLUG) return raw
  return null
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
    let deleted = 0
    for (const slug of [
      FIXED_MENUS_SLUG,
      DISHES_SLUG,
      FIXED_MENU_CATEGORIES_SLUG,
      WINES_SLUG,
      SPIRITS_SLUG,
      DRINKS_SLUG,
    ] as const) {
      const found = await payload.find({
        collection: slug,
        where: { name: { like: prefix } },
        limit: 500,
        depth: 0,
        overrideAccess: true,
      })
      for (const doc of found.docs) {
        await payload.delete({ collection: slug, id: doc.id, overrideAccess: true })
        deleted += 1
      }
    }
    console.log(JSON.stringify({ deleted }))
    return
  }

  if (action === 'count-dishes') {
    const res = await payload.count({ collection: DISHES_SLUG, overrideAccess: true })
    console.log(JSON.stringify({ count: res.totalDocs }))
    return
  }

  if (action === 'count-catalog') {
    const slug = args[1]
    if (slug !== WINES_SLUG && slug !== SPIRITS_SLUG && slug !== DRINKS_SLUG) {
      throw new Error('count-catalog: wines | spirits | drinks')
    }
    const res = await payload.count({ collection: slug, overrideAccess: true })
    console.log(JSON.stringify({ count: res.totalDocs }))
    return
  }

  if (action === 'create-catalog-items') {
    const email = args[1]
    const slug = args[2]
    const json = args[3]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !json) throw new Error('create-catalog-items: email, slug e json richiesti')
    if (slug !== WINES_SLUG && slug !== SPIRITS_SLUG && slug !== DRINKS_SLUG) {
      throw new Error('create-catalog-items: slug non valido')
    }
    const specs = JSON.parse(json) as Array<{
      name: string
      disabled?: boolean
      description?: string
      descriptionEn?: string
    }>
    const typeSlug =
      slug === WINES_SLUG ? WINE_TYPES_SLUG : slug === SPIRITS_SLUG ? SPIRIT_TYPES_SLUG : DRINK_TYPES_SLUG
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
      if (slug === WINES_SLUG || slug === SPIRITS_SLUG) {
        data.country = countryId
      }
      if (slug === DRINKS_SLUG) {
        data.volume = '33 cl'
        data.abv = '5%'
      }
      const doc = await payload.create({
        collection: slug,
        data: data as never,
        overrideAccess: false,
        user,
      })
      if (spec.descriptionEn) {
        await payload.update({
          collection: slug,
          id: doc.id,
          data: { description: spec.descriptionEn },
          overrideAccess: false,
          user,
          locale: 'en',
        })
      }
      ids.push(doc.id)
    }
    console.log(JSON.stringify({ ok: true, ids }))
    return
  }

  if (action === 'find-catalog-item') {
    const email = args[1]
    const slug = parseCatalogSlug(args[2] ?? '')
    const name = args[3]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !name || !slug) throw new Error('find-catalog-item: parametri mancanti')
    const found = await payload.find({
      collection: slug,
      where: { name: { equals: name } },
      limit: 1,
      depth: 1,
      locale: 'all',
      overrideAccess: false,
      user,
    })
    const doc = found.docs[0]
    console.log(JSON.stringify({ found: Boolean(doc), id: doc?.id ?? null, doc: doc ?? null }))
    return
  }

  if (action === 'try-delete-catalog') {
    const email = args[1]
    const slug = parseCatalogSlug(args[2] ?? '')
    const name = args[3]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !name || !slug) throw new Error('try-delete-catalog: parametri mancanti')
    const found = await payload.find({
      collection: slug,
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
      await payload.delete({
        collection: slug,
        id: doc.id,
        overrideAccess: false,
        user,
        context: { activityArea: 'app' },
      })
      console.log(JSON.stringify({ ok: true }))
    } catch (e) {
      if (isAccessDenied(e)) {
        console.log(JSON.stringify({ ok: false, reason: 'access_denied' }))
        return
      }
      throw e
    }
    return
  }

  if (action === 'find-catalog-delete-log') {
    const email = args[1]
    const collectionSlug = args[2]
    const docId = args[3]
    const itemName = args[4]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !docId) throw new Error('find-catalog-delete-log: parametri mancanti')
    const logs = await payload.find({
      collection: ACTIVITY_LOG_SLUG,
      overrideAccess: true,
      depth: 0,
      limit: 10,
      sort: '-createdAt',
      where: {
        and: [
          { user: { equals: user.id } },
          { eventType: { equals: 'delete' } },
          { area: { equals: 'app' } },
          { collection: { equals: collectionSlug } },
          { documentId: { equals: String(docId) } },
        ],
      },
    })
    const row = logs.docs[0]
    const expectedDetail = formatMenuContentDeleteDetail(itemName ?? '?', 0)
    console.log(
      JSON.stringify({
        found: Boolean(row),
        detail: row?.detail ?? null,
        expectedDetail,
      }),
    )
    return
  }

  if (action === 'find-dish') {
    const email = args[1]
    const name = args[2]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !name) throw new Error('find-dish: email e name richiesti')
    const found = await payload.find({
      collection: DISHES_SLUG,
      where: { name: { equals: name } },
      limit: 1,
      depth: 1,
      locale: 'all',
      overrideAccess: false,
      user,
    })
    const doc = found.docs[0]
    console.log(JSON.stringify({ found: Boolean(doc), id: doc?.id ?? null, dish: doc ?? null }))
    return
  }

  if (action === 'read-dish-en') {
    const email = args[1]
    const name = args[2]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !name) throw new Error('read-dish-en: email e name richiesti')
    const foundIt = await payload.find({
      collection: DISHES_SLUG,
      where: { name: { equals: name } },
      limit: 1,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      user,
    })
    const docIt = foundIt.docs[0]
    if (!docIt) {
      console.log(JSON.stringify({ name: null, description: null }))
      return
    }
    const foundEn = await payload.find({
      collection: DISHES_SLUG,
      where: { id: { equals: docIt.id } },
      limit: 1,
      depth: 0,
      locale: 'en',
      overrideAccess: false,
      user,
    })
    const doc = foundEn.docs[0]
    console.log(
      JSON.stringify({
        name: doc?.name ?? null,
        description: doc?.description ?? null,
      }),
    )
    return
  }

  if (action === 'list-taxonomies') {
    const email = args[1]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user) throw new Error('list-taxonomies: utente richiesto')
    const [cats, allergens] = await Promise.all([
      payload.find({
        collection: DISH_CATEGORIES_SLUG,
        limit: 200,
        depth: 0,
        overrideAccess: false,
        user,
      }),
      payload.find({
        collection: ALLERGENS_SLUG,
        limit: 50,
        depth: 0,
        overrideAccess: false,
        user,
      }),
    ])
    console.log(
      JSON.stringify({
        categories: cats.docs.map((d) => ({ id: d.id, name: d.name })),
        allergens: allergens.docs.map((d) => ({ id: d.id, name: d.name })),
      }),
    )
    return
  }

  if (action === 'try-create-taxonomy') {
    const email = args[1]
    const kind = args[2]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !kind) throw new Error('try-create-taxonomy: email e kind richiesti')
    const slug = kind === 'category' ? DISH_CATEGORIES_SLUG : ALLERGENS_SLUG
    try {
      await payload.create({
        collection: slug,
        data: { name: 'verify-ui-tax' },
        overrideAccess: false,
        user,
      })
      console.log(JSON.stringify({ ok: true }))
    } catch (e) {
      if (isAccessDenied(e)) {
        console.log(JSON.stringify({ ok: false, reason: 'access_denied' }))
        return
      }
      throw e
    }
    return
  }

  if (action === 'try-create-dish') {
    const email = args[1]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user) throw new Error('try-create-dish: email richiesto')
    const cat = await payload.find({
      collection: DISH_CATEGORIES_SLUG,
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const categoryId = cat.docs[0]?.id
    if (categoryId == null) {
      console.log(JSON.stringify({ ok: false, reason: 'no_category' }))
      return
    }
    try {
      await payload.create({
        collection: DISHES_SLUG,
        data: {
          name: 'verify-ui-api-probe',
          description: 'x',
          price: 1,
          category: categoryId,
        },
        overrideAccess: false,
        user,
      })
      console.log(JSON.stringify({ ok: true }))
    } catch (e) {
      if (isAccessDenied(e)) {
        console.log(JSON.stringify({ ok: false, reason: 'access_denied' }))
        return
      }
      throw e
    }
    return
  }

  if (action === 'try-delete-dish') {
    const email = args[1]
    const name = args[2]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !name) throw new Error('try-delete-dish: email e name richiesti')
    const found = await payload.find({
      collection: DISHES_SLUG,
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
      await payload.delete({
        collection: DISHES_SLUG,
        id: doc.id,
        overrideAccess: false,
        user,
        context: { activityArea: 'app' },
      })
      console.log(JSON.stringify({ ok: true }))
    } catch (e) {
      if (isAccessDenied(e)) {
        console.log(JSON.stringify({ ok: false, reason: 'access_denied' }))
        return
      }
      throw e
    }
    return
  }

  if (action === 'find-delete-log') {
    const email = args[1]
    const dishId = args[2]
    const dishName = args[3]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !dishId) throw new Error('find-delete-log: email e dishId richiesti')
    const logs = await payload.find({
      collection: ACTIVITY_LOG_SLUG,
      overrideAccess: true,
      depth: 0,
      limit: 10,
      sort: '-createdAt',
      where: {
        and: [
          { user: { equals: user.id } },
          { eventType: { equals: 'delete' } },
          { area: { equals: 'app' } },
          { collection: { equals: DISHES_SLUG } },
          { documentId: { equals: String(dishId) } },
        ],
      },
    })
    const row = logs.docs[0]
    const expectedDetail = formatMenuContentDeleteDetail(dishName ?? '?', 0)
    console.log(
      JSON.stringify({
        found: Boolean(row),
        detail: row?.detail ?? null,
        expectedDetail,
        eventType: row?.eventType ?? null,
        area: row?.area ?? null,
      }),
    )
    return
  }

  if (action === 'create-fixed-menu-fixture') {
    const email = args[1]
    const json = args[2]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !json) throw new Error('create-fixed-menu-fixture: email e json richiesti')
    const spec = JSON.parse(json) as {
      dishName: string
      categoryName: string
      menuNames: string[]
    }
    const cat = await payload.find({
      collection: FIXED_MENU_CATEGORIES_SLUG,
      where: { name: { equals: spec.categoryName } },
      limit: 1,
      overrideAccess: true,
    })
    let categoryId = cat.docs[0]?.id
    if (categoryId == null) {
      const created = await payload.create({
        collection: FIXED_MENU_CATEGORIES_SLUG,
        data: { name: spec.categoryName, visibility: 'always' },
        overrideAccess: false,
        user,
      })
      categoryId = created.id
    }
    const dishFound = await payload.find({
      collection: DISHES_SLUG,
      where: { name: { equals: spec.dishName } },
      limit: 1,
      overrideAccess: true,
    })
    const dishId = dishFound.docs[0]?.id
    if (dishId == null) {
      console.log(JSON.stringify({ ok: false, reason: 'dish_missing' }))
      return
    }
    const menuIds: number[] = []
    for (const menuName of spec.menuNames) {
      const doc = await payload.create({
        collection: FIXED_MENUS_SLUG,
        data: {
          name: menuName,
          description: 'verify-ui',
          price: 30,
          category: categoryId,
          visibility: 'always',
          dishes: [{ dish: dishId }],
        },
        overrideAccess: false,
        user,
      })
      menuIds.push(doc.id as number)
    }
    console.log(JSON.stringify({ ok: true, categoryId, menuIds, dishId }))
    return
  }

  if (action === 'add-dish-to-fixed-menu') {
    const email = args[1]
    const menuName = args[2]
    const dishName = args[3]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !menuName || !dishName) throw new Error('add-dish-to-fixed-menu: parametri mancanti')
    const menu = await payload.find({
      collection: FIXED_MENUS_SLUG,
      where: { name: { equals: menuName } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })
    const dish = await payload.find({
      collection: DISHES_SLUG,
      where: { name: { equals: dishName } },
      limit: 1,
      overrideAccess: true,
    })
    const menuDoc = menu.docs[0]
    const dishDoc = dish.docs[0]
    if (!menuDoc || !dishDoc) {
      console.log(JSON.stringify({ ok: false, reason: 'not_found' }))
      return
    }
    const dishes = Array.isArray(menuDoc.dishes) ? [...menuDoc.dishes] : []
    dishes.push({ dish: dishDoc.id })
    await payload.update({
      collection: FIXED_MENUS_SLUG,
      id: menuDoc.id,
      data: { dishes },
      overrideAccess: false,
      user,
    })
    console.log(JSON.stringify({ ok: true }))
    return
  }

  if (action === 'find-staff-user') {
    const role = args[1]
    if (role !== 'admin' && role !== 'super-admin') throw new Error('find-staff-user: admin o super-admin')
    const found = await payload.find({
      collection: 'users',
      where: { adminRole: { equals: role } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const u = found.docs[0] as User | undefined
    console.log(JSON.stringify({ email: u?.email ?? null, id: u?.id ?? null }))
    return
  }

  if (action === 'ensure-norole-user') {
    const email = `verify-ui-norole-${Date.now()}@test.local`
    const password = 'VerifyUiNorole1!'
    const doc = await payload.create({
      collection: 'users',
      overrideAccess: true,
      depth: 0,
      data: {
        email,
        adminRole: 'none',
        appRole: 'none',
        loginMethod: 'sso',
        active: true,
        emailVerified: true,
      },
    })
    await payload.update({
      collection: 'users',
      id: doc.id,
      overrideAccess: true,
      depth: 0,
      data: {
        loginMethod: 'local',
        emailVerified: true,
        password,
        passwordConfirm: password,
      },
    })
    console.log(JSON.stringify({ email, id: doc.id }))
    return
  }

  if (action === 'delete-user-email') {
    const email = args[1]
    if (!email?.includes('@test.local')) throw new Error('delete-user-email: email non valida')
    const found = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })
    const u = found.docs[0]
    if (u) await payload.delete({ collection: 'users', id: u.id, overrideAccess: true })
    console.log(JSON.stringify({ deleted: Boolean(u) }))
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
      description?: string
      descriptionEn?: string
      nameEn?: string
      price?: number
      categoryId?: number | string
      allergenIds?: Array<number | string>
      glutenFree?: boolean
      dairyFree?: boolean
      vegan?: boolean
      eggFree?: boolean
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
            description: spec.description ?? 'verify-ui',
            price: spec.price ?? 9.5,
            category: (spec.categoryId ?? categoryId) as number,
            soldOut: spec.soldOut ?? false,
            disabled: spec.disabled ?? false,
            glutenFree: spec.glutenFree ?? false,
            dairyFree: spec.dairyFree ?? false,
            vegan: spec.vegan ?? false,
            eggFree: spec.eggFree ?? false,
            ...(spec.allergenIds?.length
              ? { allergens: spec.allergenIds.map((id) => Number(id)) }
              : {}),
          },
          overrideAccess: false,
          user,
        })
        if (spec.nameEn || spec.descriptionEn) {
          await payload.update({
            collection: 'dishes',
            id: doc.id,
            data: {
              name: spec.nameEn ?? '',
              description: spec.descriptionEn ?? '',
            },
            overrideAccess: false,
            user,
            locale: 'en',
          })
        }
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

  if (action === 'try-create-catalog-doc') {
    const email = args[1]
    const slug = parseCatalogSlug(args[2] ?? '')
    const json = args[3]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !json || !slug) throw new Error('try-create-catalog-doc: parametri mancanti')
    const patch = JSON.parse(json) as Record<string, unknown>
    const { typeId, countryId } = await catalogBaseData(payload, slug)
    if (typeId == null || ((slug === WINES_SLUG || slug === SPIRITS_SLUG) && countryId == null)) {
      console.log(JSON.stringify({ ok: false, reason: 'missing_taxonomy' }))
      return
    }
    const data: Record<string, unknown> = {
      name: 'verify-ui-api-probe',
      description: 'verify-ui',
      price: 9.5,
      type: typeId,
      disabled: false,
      ...patch,
    }
    if (slug === WINES_SLUG || slug === SPIRITS_SLUG) {
      if (data.country == null) data.country = countryId
    }
    try {
      const doc = await payload.create({
        collection: slug,
        data: data as never,
        overrideAccess: false,
        user,
      })
      console.log(JSON.stringify({ ok: true, id: doc.id }))
    } catch (e) {
      if (isAccessDenied(e)) {
        console.log(JSON.stringify({ ok: false, reason: 'access_denied' }))
        return
      }
      if (e instanceof ValidationError) {
        console.log(
          JSON.stringify({
            ok: false,
            reason: 'validation',
            errors: e.data.errors.map((err: { path?: string; message?: string }) => ({
              path: err.path,
              message: err.message,
            })),
          }),
        )
        return
      }
      throw e
    }
    return
  }

  if (action === 'read-catalog-en') {
    const email = args[1]
    const slug = parseCatalogSlug(args[2] ?? '')
    const name = args[3]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !name || !slug) throw new Error('read-catalog-en: parametri mancanti')
    const foundIt = await payload.find({
      collection: slug,
      where: { name: { equals: name } },
      limit: 1,
      depth: 0,
      locale: 'it',
      overrideAccess: false,
      user,
    })
    const docIt = foundIt.docs[0]
    if (!docIt) {
      console.log(JSON.stringify({ name: null, description: null }))
      return
    }
    const foundEn = await payload.find({
      collection: slug,
      where: { id: { equals: docIt.id } },
      limit: 1,
      depth: 0,
      locale: 'en',
      overrideAccess: false,
      user,
    })
    const doc = foundEn.docs[0]
    console.log(
      JSON.stringify({
        name: doc?.name ?? null,
        description: doc?.description ?? null,
      }),
    )
    return
  }

  if (action === 'list-wine-origin-taxonomies') {
    const countriesRes = await payload.find({
      collection: COUNTRIES_SLUG,
      limit: 500,
      depth: 0,
      overrideAccess: true,
      sort: 'name',
    })
    const regionsRes = await payload.find({
      collection: REGIONS_SLUG,
      limit: 500,
      depth: 0,
      overrideAccess: true,
      sort: 'name',
    })
    console.log(
      JSON.stringify({
        countries: countriesRes.docs.map((c) => ({ name: c.name, enabled: (c as { enabled?: boolean }).enabled })),
        regions: regionsRes.docs.slice(0, 40).map((r) => ({
          name: r.name,
          enabled: (r as { enabled?: boolean }).enabled,
        })),
      }),
    )
    return
  }

  if (action === 'set-country-enabled') {
    const name = args[1]
    const enabled = args[2] === 'true'
    const found = await payload.find({
      collection: COUNTRIES_SLUG,
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
    await payload.update({
      collection: COUNTRIES_SLUG,
      id: doc.id,
      data: { enabled },
      overrideAccess: true,
    })
    console.log(JSON.stringify({ ok: true, id: doc.id, enabled }))
    return
  }

  if (action === 'patch-catalog-doc') {
    const email = args[1]
    const slug = parseCatalogSlug(args[2] ?? '')
    const name = args[3]
    const json = args[4]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !name || !json || !slug) throw new Error('patch-catalog-doc: parametri mancanti')
    const patch = JSON.parse(json) as Record<string, unknown>
    const found = await payload.find({
      collection: slug,
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
        collection: slug,
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
      if (e instanceof ValidationError) {
        console.log(
          JSON.stringify({
            ok: false,
            reason: 'validation',
            message: validationMessageAtPath(e, String(patch.__path ?? '')),
            errors: e.data.errors.map((err: { path?: string; message?: string }) => ({
              path: err.path,
              message: err.message,
            })),
          }),
        )
        return
      }
      throw e
    }
    return
  }

  if (action === 'try-create-wine-taxonomy') {
    const email = args[1]
    const kind = args[2]
    const taxName = args[3] ?? 'verify-ui-tax'
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !kind) throw new Error('try-create-wine-taxonomy: email e kind richiesti')
    const slugMap: Record<string, string> = {
      'wine-types': WINE_TYPES_SLUG,
      countries: COUNTRIES_SLUG,
      regions: REGIONS_SLUG,
      appellations: APPELLATIONS_SLUG,
      classifications: CLASSIFICATIONS_SLUG,
    }
    const collection = slugMap[kind]
    if (!collection) throw new Error('try-create-wine-taxonomy: kind non valido')
    try {
      await payload.create({
        collection: collection as never,
        data: {
          name: taxName,
          ...(kind === 'countries' ? { enabled: true } : {}),
        } as never,
        overrideAccess: false,
        user,
      })
      console.log(JSON.stringify({ ok: true }))
    } catch (e) {
      if (isAccessDenied(e)) {
        console.log(JSON.stringify({ ok: false, reason: 'access_denied' }))
        return
      }
      throw e
    }
    return
  }

  if (action === 'create-wine-with-grade-sql') {
    const email = args[1]
    const wineName = args[2] ?? 'verify-ui-grade-fmt'
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user) throw new Error('create-wine-with-grade-sql: email richiesto')
    const { typeId, countryId } = await catalogBaseData(payload, WINES_SLUG)
    if (typeId == null || countryId == null) {
      console.log(JSON.stringify({ ok: false, reason: 'missing_taxonomy' }))
      return
    }
    const doc = await payload.create({
      collection: WINES_SLUG,
      data: {
        name: wineName,
        description: 'verify-ui',
        price: 10,
        type: typeId,
        country: countryId,
        year: '2020',
        volume: '75 cl',
        abv: '13%',
      } as never,
      overrideAccess: false,
      user,
    })
    await payload.db.drizzle.execute(
      sql`UPDATE wines SET abv = ${'12,8%'} WHERE id = ${asNumericId(doc.id)}`,
    )
    console.log(JSON.stringify({ ok: true, id: doc.id, name: wineName }))
    return
  }

  if (action === 'try-update-catalog-disabled-only') {
    const email = args[1]
    const slug = parseCatalogSlug(args[2] ?? '')
    const name = args[3]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !name || !slug) throw new Error('try-update-catalog-disabled-only: parametri mancanti')
    const found = await payload.find({
      collection: slug,
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
        collection: slug,
        id: doc.id,
        data: { disabled: true },
        overrideAccess: false,
        user,
      })
      console.log(JSON.stringify({ ok: true, id: doc.id }))
    } catch (e) {
      if (isAccessDenied(e)) {
        console.log(JSON.stringify({ ok: false, reason: 'access_denied' }))
        return
      }
      if (e instanceof ValidationError) {
        console.log(JSON.stringify({ ok: false, reason: 'validation', errors: e.data.errors }))
        return
      }
      throw e
    }
    return
  }

  if (action === 'admin-set-spirit-abv') {
    const name = args[1]
    const abv = args[2] ?? '12,8%'
    const found = await payload.find({
      collection: SPIRITS_SLUG,
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
    await payload.db.drizzle.execute(
      sql`UPDATE spirits SET abv = ${abv} WHERE id = ${asNumericId(doc.id)}`,
    )
    console.log(JSON.stringify({ ok: true, id: doc.id, abv }))
    return
  }

  if (action === 'admin-set-spirit-volume') {
    const name = args[1]
    const volume = args[2] ?? '75 cl'
    const found = await payload.find({
      collection: SPIRITS_SLUG,
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
    await payload.db.drizzle.execute(
      sql`UPDATE spirits SET volume = ${volume} WHERE id = ${asNumericId(doc.id)}`,
    )
    console.log(JSON.stringify({ ok: true, id: doc.id, volume }))
    return
  }

  if (action === 'misalign-wine-geography') {
    const email = args[1]
    const wineName = args[2]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user || !wineName) throw new Error('misalign-wine-geography: parametri mancanti')
    const wine = await payload.find({
      collection: WINES_SLUG,
      where: { name: { equals: wineName } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const wineDoc = wine.docs[0]
    if (!wineDoc) {
      console.log(JSON.stringify({ ok: false, reason: 'wine_not_found' }))
      return
    }
    const italy = await payload.find({
      collection: COUNTRIES_SLUG,
      where: { name: { equals: 'Italia' } },
      limit: 1,
      overrideAccess: true,
    })
    const france = await payload.find({
      collection: COUNTRIES_SLUG,
      where: { name: { equals: 'Francia' } },
      limit: 1,
      overrideAccess: true,
    })
    const frRegion = await payload.find({
      collection: REGIONS_SLUG,
      where: { country: { equals: france.docs[0]?.id } },
      limit: 1,
      overrideAccess: true,
    })
    if (!italy.docs[0] || !frRegion.docs[0]) {
      console.log(JSON.stringify({ ok: false, reason: 'taxonomy_missing' }))
      return
    }
    await payload.update({
      collection: WINES_SLUG,
      id: wineDoc.id,
      data: { country: italy.docs[0].id, region: frRegion.docs[0].id },
      overrideAccess: true,
    })
    console.log(JSON.stringify({ ok: true, wineId: wineDoc.id }))
    return
  }

  if (action === 'validate-wine-formats-probe') {
    const email = args[1]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user) throw new Error('validate-wine-formats-probe: email richiesto')
    const { typeId, countryId } = await catalogBaseData(payload, WINES_SLUG)
    if (typeId == null || countryId == null) {
      console.log(JSON.stringify({ ok: false, reason: 'missing_taxonomy' }))
      return
    }
    const currentYear = new Date().getFullYear()
    const yearMsg = WINE_YEAR_ERROR_MESSAGE(currentYear)
    const probes: Array<{ label: string; data: Record<string, unknown>; path: string; expected: string }> = [
      { label: 'year-99', data: { year: '99' }, path: 'year', expected: yearMsg },
      { label: 'volume-70', data: { volume: '70 cl' }, path: 'volume', expected: WINE_VOLUME_ERROR_MESSAGE },
      { label: 'abv-128', data: { abv: '12,8%' }, path: 'abv', expected: WINE_ABV_ERROR_MESSAGE },
    ]
    const results: Array<{ label: string; rejected: boolean; message?: string; expected?: string }> = []
    for (const probe of probes) {
      try {
        await payload.create({
          collection: WINES_SLUG,
          data: {
            name: `verify-ui-fmt-${probe.label}`,
            description: 'x',
            price: 9,
            type: typeId,
            country: countryId,
            year: '2020',
            volume: '75 cl',
            abv: '13%',
            ...probe.data,
          } as never,
          overrideAccess: false,
          user,
        })
        results.push({ label: probe.label, rejected: false })
      } catch (e) {
        results.push({
          label: probe.label,
          rejected: true,
          message: validationMessageAtPath(e, probe.path),
          expected: probe.expected,
        })
      }
    }
    let canonicalOk = false
    try {
      await payload.create({
        collection: WINES_SLUG,
        data: {
          name: 'verify-ui-fmt-canonical',
          description: 'x',
          price: 9,
          type: typeId,
          country: countryId,
          year: '2022',
          volume: '75 cl',
          abv: '13%',
        } as never,
        overrideAccess: false,
        user,
      })
      canonicalOk = true
    } catch {
      canonicalOk = false
    }
    console.log(JSON.stringify({ results, canonicalOk, yearMsg }))
    return
  }

  if (action === 'validate-spirit-formats-probe') {
    const email = args[1]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user) throw new Error('validate-spirit-formats-probe: email richiesto')
    const { typeId, countryId } = await catalogBaseData(payload, SPIRITS_SLUG)
    if (typeId == null || countryId == null) {
      console.log(JSON.stringify({ ok: false, reason: 'missing_taxonomy' }))
      return
    }
    const probes: Array<{ label: string; data: Record<string, unknown>; path: string; expected: string }> = [
      { label: 'abv-46', data: { abv: '46%' }, path: 'abv', expected: SPIRIT_ABV_ERROR_MESSAGE },
      { label: 'aging-4', data: { aging: '4 anni' }, path: 'aging', expected: SPIRIT_AGING_ERROR_MESSAGE },
    ]
    const results: Array<{ label: string; rejected: boolean; message?: string; expected?: string }> = []
    for (const probe of probes) {
      try {
        await payload.create({
          collection: SPIRITS_SLUG,
          data: {
            name: `verify-ui-fmt-${probe.label}`,
            description: 'x',
            price: 9,
            type: typeId,
            country: countryId,
            abv: '40%',
            aging: '12 anni',
            ...probe.data,
          } as never,
          overrideAccess: false,
          user,
        })
        results.push({ label: probe.label, rejected: false })
      } catch (e) {
        results.push({
          label: probe.label,
          rejected: true,
          message: validationMessageAtPath(e, probe.path),
          expected: probe.expected,
        })
      }
    }
    let canonicalOk = false
    try {
      await payload.create({
        collection: SPIRITS_SLUG,
        data: {
          name: 'verify-ui-fmt-spirit-canonical',
          description: 'x',
          price: 9,
          type: typeId,
          country: countryId,
          abv: '45%',
          aging: '12 anni',
        } as never,
        overrideAccess: false,
        user,
      })
      canonicalOk = true
    } catch {
      canonicalOk = false
    }
    console.log(JSON.stringify({ results, canonicalOk }))
    return
  }

  if (action === 'validate-drink-formats-probe') {
    const email = args[1]
    const user = email ? await findUserByEmail(payload, email) : null
    if (!user) throw new Error('validate-drink-formats-probe: email richiesto')
    const { typeId } = await catalogBaseData(payload, DRINKS_SLUG)
    if (typeId == null) {
      console.log(JSON.stringify({ ok: false, reason: 'missing_taxonomy' }))
      return
    }
    const probes: Array<{ label: string; data: Record<string, unknown>; path: string; expected: string }> = [
      { label: 'volume-70', data: { volume: '70 cl' }, path: 'volume', expected: DRINK_VOLUME_ERROR_MESSAGE },
      { label: 'abv-128', data: { abv: '12,8%' }, path: 'abv', expected: DRINK_ABV_ERROR_MESSAGE },
    ]
    const results: Array<{ label: string; rejected: boolean; message?: string; expected?: string }> = []
    for (const probe of probes) {
      try {
        await payload.create({
          collection: DRINKS_SLUG,
          data: {
            name: `verify-ui-fmt-${probe.label}`,
            description: 'x',
            price: 9,
            type: typeId,
            volume: '33 cl',
            abv: '5%',
            ...probe.data,
          } as never,
          overrideAccess: false,
          user,
        })
        results.push({ label: probe.label, rejected: false })
      } catch (e) {
        results.push({
          label: probe.label,
          rejected: true,
          message: validationMessageAtPath(e, probe.path),
          expected: probe.expected,
        })
      }
    }
    let canonicalOk = false
    try {
      await payload.create({
        collection: DRINKS_SLUG,
        data: {
          name: 'verify-ui-fmt-drink-canonical',
          description: 'x',
          price: 9,
          type: typeId,
          volume: '33 cl',
          abv: '5%',
        } as never,
        overrideAccess: false,
        user,
      })
      canonicalOk = true
    } catch {
      canonicalOk = false
    }
    console.log(JSON.stringify({ results, canonicalOk }))
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
