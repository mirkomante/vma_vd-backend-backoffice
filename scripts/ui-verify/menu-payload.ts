/**
 * Dati di prova «verify-ui-*» per ui:verify Menù (solo DB di sviluppo).
 *
 *   pnpm payload run scripts/ui-verify/menu-payload.ts -- count-sold-out <managerEmail>
 *   pnpm payload run scripts/ui-verify/menu-payload.ts -- create-dishes <managerEmail> <json>
 *   pnpm payload run scripts/ui-verify/menu-payload.ts -- delete-prefix verify-ui-
 */
import config from '@payload-config'
import { APIError, getPayload } from 'payload'

import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'
import { formatMenuContentDeleteDetail } from '@/lib/menu/menuContentDeleteLog'
import {
  ALLERGENS_SLUG,
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
} from '@/lib/menu/constants'
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
    let deleted = 0
    for (const slug of [FIXED_MENUS_SLUG, DISHES_SLUG, FIXED_MENU_CATEGORIES_SLUG] as const) {
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
    const found = await payload.find({
      collection: DISHES_SLUG,
      where: { name: { equals: name } },
      limit: 1,
      depth: 0,
      locale: 'en',
      overrideAccess: false,
      user,
    })
    const doc = found.docs[0]
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
    let cat = await payload.find({
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

  throw new Error(`menu-payload: azione sconosciuta ${action ?? '(vuota)'}`)
}

try {
  await main()
} catch (err) {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
}
