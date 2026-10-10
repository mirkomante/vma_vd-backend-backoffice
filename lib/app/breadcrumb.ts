import type { VisibleAppNavGroup } from './navigationForUser'

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

  for (const group of navigation) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        const isSingleItemGroup = group.items.length === 1 && group.label === item.label
        if (isSingleItemGroup) {
          return [{ type: 'page', label: item.label }]
        }
        const firstItem = group.items[0]
        return [
          { type: 'link', label: group.label, href: firstItem.href },
          { type: 'page', label: item.label },
        ]
      }
    }
  }

  return [{ type: 'page', label: 'Area App' }]
}
