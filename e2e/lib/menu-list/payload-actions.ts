import {
  DISHES_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
  MENU_SERVICES_SLUG,
  SPECIAL_DAYS_SLUG,
} from '@/lib/menu/constants'
import type { Payload } from 'payload'

import type { User } from '@/payload-types'

export async function managerUser(payload: Payload, email: string): Promise<User> {
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

export async function createMenuServiceLocal(
  payload: Payload,
  managerEmail: string,
  spec: { name: string; price?: number; disabled?: boolean; nameEn?: string },
): Promise<number | string> {
  const user = await managerUser(payload, managerEmail)
  const doc = await payload.create({
    collection: MENU_SERVICES_SLUG,
    data: {
      name: spec.name,
      price: spec.price ?? 2,
      disabled: spec.disabled ?? false,
    },
    overrideAccess: false,
    user,
  })
  if (spec.nameEn) {
    await payload.update({
      collection: MENU_SERVICES_SLUG,
      id: doc.id,
      data: { name: spec.nameEn },
      overrideAccess: false,
      user,
      locale: 'en',
    })
  }
  return doc.id
}

export async function createFixedMenuFixtureLocal(
  payload: Payload,
  managerEmail: string,
  spec: { dishName: string; categoryName: string; menuNames: string[] },
): Promise<number[]> {
  const user = await managerUser(payload, managerEmail)
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
  if (dishId == null) throw new Error(`piatto di prova mancante: ${spec.dishName}`)

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
  return menuIds
}

export async function createSpecialDayForMenuLocal(
  payload: Payload,
  managerEmail: string,
  menuName: string,
  dateIso: string,
): Promise<number | string> {
  const user = await managerUser(payload, managerEmail)
  const menu = await payload.find({
    collection: FIXED_MENUS_SLUG,
    where: { name: { equals: menuName } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const menuId = menu.docs[0]?.id
  if (menuId == null) throw new Error(`menù fisso mancante: ${menuName}`)
  const doc = await payload.create({
    collection: SPECIAL_DAYS_SLUG,
    data: {
      date: dateIso,
      scope: 'day',
      content: { fixedMenus: [menuId] },
    },
    overrideAccess: false,
    user,
  })
  return doc.id
}
