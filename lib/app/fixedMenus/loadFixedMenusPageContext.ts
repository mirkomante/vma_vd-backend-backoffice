import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import {
  getMenuDevSimulateLoadDelayMs,
  shouldSimulateMenuLoadError,
} from '@/lib/app/menu/devSimulate'
import { dishDisplayStatus } from '@/lib/menu/dishes/displayStatus'
import {
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  MENU_SERVICES_SLUG,
} from '@/lib/menu/constants'
import { relationshipId, relationshipName } from '@/lib/menu/relationshipId'
import type { Dish, DishCategory, FixedMenuCategory, MenuService } from '@/payload-types'

import type {
  FixedMenuCategoryOption,
  FixedMenuDishOption,
  FixedMenuServiceOption,
} from './types'

export type FixedMenusPageContext = {
  loadError: boolean
  categories: FixedMenuCategoryOption[]
  dishes: FixedMenuDishOption[]
  services: FixedMenuServiceOption[]
}

const FIXED_MENUS_PATH = '/app/menu/fixed'

export async function loadFixedMenusPageContext(): Promise<FixedMenusPageContext> {
  if (shouldSimulateMenuLoadError()) {
    return { loadError: true, categories: [], dishes: [], services: [] }
  }

  const delayMs = getMenuDevSimulateLoadDelayMs()
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  try {
    const req = await createAppPayloadRequest(FIXED_MENUS_PATH)
    const [categoriesRes, dishesRes, servicesRes, dishCategoriesRes] = await Promise.all([
      req.payload.find({
        collection: FIXED_MENU_CATEGORIES_SLUG,
        depth: 0,
        limit: 100,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
        sort: 'name',
      }),
      req.payload.find({
        collection: DISHES_SLUG,
        depth: 1,
        limit: 500,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
        sort: 'name',
      }),
      req.payload.find({
        collection: MENU_SERVICES_SLUG,
        depth: 0,
        limit: 100,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
        sort: 'name',
      }),
      req.payload.find({
        collection: DISH_CATEGORIES_SLUG,
        depth: 0,
        limit: 200,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
        sort: 'name',
      }),
    ])

    const dishCategoryNames = new Map<string, string>()
    for (const cat of dishCategoriesRes.docs as DishCategory[]) {
      dishCategoryNames.set(String(cat.id), cat.name)
    }

    const categories = (categoriesRes.docs as FixedMenuCategory[]).map((c) => ({
      id: String(c.id),
      name: c.name,
      visibility: c.visibility,
      disabled: Boolean(c.disabled),
    }))

    const dishes = (dishesRes.docs as Dish[]).map((d) => {
      const categoryId = relationshipId(d.category)
      const categoryName =
        relationshipName(d.category) ||
        (categoryId != null ? dishCategoryNames.get(String(categoryId)) : '') ||
        ''
      return {
        id: String(d.id),
        name: d.name,
        categoryId: categoryId != null ? String(categoryId) : '',
        categoryName,
        status: dishDisplayStatus(d),
      }
    })

    const services = (servicesRes.docs as MenuService[]).map((s) => ({
      id: String(s.id),
      name: s.name,
      price: s.price,
      disabled: Boolean(s.disabled),
    }))

    return { loadError: false, categories, dishes, services }
  } catch {
    return { loadError: true, categories: [], dishes: [], services: [] }
  }
}

export type FixedMenuCategoriesPageContext = {
  loadError: boolean
}

export async function loadFixedMenuCategoriesPageContext(): Promise<FixedMenuCategoriesPageContext> {
  if (shouldSimulateMenuLoadError()) {
    return { loadError: true }
  }
  const delayMs = getMenuDevSimulateLoadDelayMs()
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  return { loadError: false }
}
