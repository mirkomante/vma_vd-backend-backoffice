import type { VisibleAppNavGroup } from './navigationForUser'

export type NavItemForMatch = {
  id: string
  href: string
  label: string
}

/** Sotto-pagine con briciola aggiuntiva (non sono voci di menu). */
export const APP_NAV_SUBPAGES: Readonly<Record<string, string>> = {
  '/app/menu/fixed/categories': 'Categorie',
}

export function flattenNavItems(navigation: readonly VisibleAppNavGroup[]): NavItemForMatch[] {
  return navigation.flatMap((group) =>
    group.items.map((item) => ({
      id: item.id,
      href: item.href,
      label: item.label,
    })),
  )
}

/** Tra le voci il cui percorso coincide o è prefisso, vale quella con il percorso più lungo. */
export function findActiveNavItem(
  pathname: string,
  items: readonly NavItemForMatch[],
): NavItemForMatch | null {
  if (pathname === '/app' || pathname === '/app/') {
    return null
  }

  let best: NavItemForMatch | null = null
  for (const item of items) {
    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
      if (!best || item.href.length > best.href.length) {
        best = item
      }
    }
  }
  return best
}

export function findActiveNavItemInNavigation(
  pathname: string,
  navigation: readonly VisibleAppNavGroup[],
): NavItemForMatch | null {
  return findActiveNavItem(pathname, flattenNavItems(navigation))
}

export type AppBreadcrumbPart =
  | { type: 'link'; label: string; href: string }
  | { type: 'page'; label: string }

export function buildAppBreadcrumb(
  pathname: string,
  navigation: VisibleAppNavGroup[],
): AppBreadcrumbPart[] {
  if (pathname === '/app' || pathname === '/app/') {
    return [{ type: 'page', label: 'Area App' }]
  }

  const items = flattenNavItems(navigation)
  const active = findActiveNavItem(pathname, items)
  if (!active) {
    return [{ type: 'page', label: 'Area App' }]
  }

  for (const group of navigation) {
    const item = group.items.find((entry) => entry.id === active.id)
    if (!item) {
      continue
    }

    const isSingleItemGroup = group.items.length === 1 && group.label === item.label
    if (isSingleItemGroup) {
      return [{ type: 'page', label: item.label }]
    }

    const firstItem = group.items[0]
    const subLabel = APP_NAV_SUBPAGES[pathname]

    if (subLabel && pathname !== item.href) {
      return [
        { type: 'link', label: group.label, href: firstItem.href },
        { type: 'link', label: item.label, href: item.href },
        { type: 'page', label: subLabel },
      ]
    }

    return [
      { type: 'link', label: group.label, href: firstItem.href },
      { type: 'page', label: item.label },
    ]
  }

  return [{ type: 'page', label: 'Area App' }]
}
