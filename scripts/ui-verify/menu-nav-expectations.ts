/**
 * Attesi navigazione/briciole per ui:verify (solo sviluppo, lettura da lib/).
 *
 *   pnpm payload run scripts/ui-verify/menu-nav-expectations.ts
 */
import { writeFileSync } from 'node:fs'

import { APP_NAV_GROUPS, HOME_SECTION_CARDS } from '@/lib/app/navigation'
import { buildAppBreadcrumb } from '@/lib/app/breadcrumb'
import type { VisibleAppNavGroup } from '@/lib/app/navigationForUser'

function visibleNavigation(): VisibleAppNavGroup[] {
  return APP_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.enabled),
  }))
}

const PATHS = [
  '/app',
  '/app/menu',
  '/app/menu/wines',
  '/app/menu/drinks',
  '/app/menu/spirits',
  '/app/menu/fixed',
  '/app/menu/fixed/categories',
  '/app/menu/services',
  '/app/menu/special-days',
  '/app/menu/message',
  '/app/hours',
  '/app/reservations',
  '/app/reservations/day-exceptions',
]

function enabledNavItems() {
  const groups = APP_NAV_GROUPS.map((g) => ({
    label: g.label,
    items: g.items.filter((i) => i.enabled).map((i) => ({ label: i.label, href: i.href, iconKey: i.iconKey })),
  }))
  return groups
}

function breadcrumbCases() {
  return PATHS.map((path) => ({
    path,
    parts: buildAppBreadcrumb(path, visibleNavigation()),
  }))
}

function activeNavForPath(path: string): string | null {
  if (path === '/app') return null
  let best: { label: string; href: string } | null = null
  for (const group of APP_NAV_GROUPS) {
    for (const item of group.items) {
      if (!item.enabled) continue
      if (path === item.href || (path.startsWith(`${item.href}/`) && item.href !== '/app')) {
        if (!best || item.href.length > best.href.length) {
          best = { label: item.label, href: item.href }
        }
      }
    }
  }
  return best?.label ?? null
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('menu-nav-expectations: vietato in produzione')
  }

  const out = {
    homeSectionCards: HOME_SECTION_CARDS.map((c) => ({
      title: c.title,
      description: c.description,
      href: c.href,
    })),
    navGroups: enabledNavItems(),
    breadcrumbCases: breadcrumbCases(),
    activeNavByPath: Object.fromEntries(PATHS.map((p) => [p, activeNavForPath(p)])),
  }

  const target = process.env.UI_VERIFY_NAV_JSON
  if (target) {
    writeFileSync(target, JSON.stringify(out, null, 2), 'utf8')
  }
  console.log(JSON.stringify(out))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
