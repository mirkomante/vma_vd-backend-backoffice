import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import {
  getMenuDevSimulateLoadDelayMs,
  shouldSimulateMenuLoadError,
} from '@/lib/app/menu/devSimulate'
import {
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
} from '@/lib/menu/constants'
import { compareItalianNames } from '@/lib/menu/display/sortByItalianName'
import { relationshipId, relationshipName } from '@/lib/menu/relationshipId'
import type { FixedMenu, FixedMenuCategory } from '@/payload-types'

import type { FixedMenuPickerOption } from './types'

export type SpecialDaysPageContext = {
  loadError: boolean
  fixedMenuOptions: FixedMenuPickerOption[]
}

const SPECIAL_DAYS_PATH = '/app/menu/special-days'

export async function loadSpecialDaysPageContext(): Promise<SpecialDaysPageContext> {
  if (shouldSimulateMenuLoadError()) {
    return { loadError: true, fixedMenuOptions: [] }
  }

  const delayMs = getMenuDevSimulateLoadDelayMs()
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  try {
    const req = await createAppPayloadRequest(SPECIAL_DAYS_PATH)
    const [menusRes, categoriesRes] = await Promise.all([
      req.payload.find({
        collection: FIXED_MENUS_SLUG,
        depth: 1,
        limit: 100,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
        sort: 'name',
      }),
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
    ])

    const categoryNameById = new Map<string, string>()
    for (const cat of categoriesRes.docs as FixedMenuCategory[]) {
      categoryNameById.set(String(cat.id), cat.name)
    }

    const options: FixedMenuPickerOption[] = (menusRes.docs as FixedMenu[])
      .map((menu) => {
        const categoryId = relationshipId(menu.category)
        const categoryName =
          categoryId != null
            ? (categoryNameById.get(String(categoryId)) ??
              relationshipName(menu.category) ??
              '—')
            : '—'
        return {
          id: String(menu.id),
          name: menu.name,
          categoryId: categoryId != null ? String(categoryId) : '',
          categoryName,
          specialOnly: Boolean(menu.specialOnly),
          disabled: Boolean(menu.disabled),
        }
      })
      .sort((a, b) => {
        const byCat = compareItalianNames(a.categoryName, b.categoryName)
        if (byCat !== 0) {
          return byCat
        }
        return compareItalianNames(a.name, b.name)
      })

    return { loadError: false, fixedMenuOptions: options }
  } catch {
    return { loadError: true, fixedMenuOptions: [] }
  }
}
