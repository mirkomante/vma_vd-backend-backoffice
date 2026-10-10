import { canAccessSection } from '@/lib/auth/canAccessSection'
import type { UserAccessFields } from '@/lib/auth/roles'

import {
  APP_NAV_GROUPS,
  type AppNavGroupDef,
  type AppNavItemDef,
  HOME_SECTION_CARDS,
  type HomeSectionCardDef,
} from './navigation'

export type VisibleAppNavGroup = Omit<AppNavGroupDef, 'items'> & {
  items: AppNavItemDef[]
}

export function getVisibleNavigation(user: UserAccessFields): VisibleAppNavGroup[] {
  const groups: VisibleAppNavGroup[] = []

  for (const group of APP_NAV_GROUPS) {
    if (!canAccessSection(user, group.section)) {
      continue
    }
    const items = group.items.filter((item) => item.enabled)
    if (items.length === 0) {
      continue
    }
    groups.push({ ...group, items })
  }

  return groups
}

export function getVisibleHomeSectionCards(user: UserAccessFields): HomeSectionCardDef[] {
  return HOME_SECTION_CARDS.filter((card) => canAccessSection(user, card.section))
}

export function findNavItemByHref(
  navigation: VisibleAppNavGroup[],
  href: string,
): { group: VisibleAppNavGroup; item: AppNavItemDef } | null {
  for (const group of navigation) {
    for (const item of group.items) {
      if (item.href === href) {
        return { group, item }
      }
    }
  }
  return null
}
