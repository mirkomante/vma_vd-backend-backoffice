import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { findActiveNavItem } from './navRouteMatch.ts'
import type { NavItemForMatch } from './navRouteMatch.ts'

const integrationNavItems: NavItemForMatch[] = [
  { id: 'menu-dishes', label: 'Piatti', href: '/app/menu' },
  { id: 'menu-wines', label: 'Vini', href: '/app/menu/wines' },
  { id: 'menu-fixed', label: 'Menù fissi', href: '/app/menu/fixed' },
  { id: 'hours', label: 'Orari', href: '/app/hours' },
  { id: 'reservations-list', label: 'Elenco', href: '/app/reservations' },
  {
    id: 'reservations-day-exceptions',
    label: 'Eccezioni giorno',
    href: '/app/reservations/day-exceptions',
  },
]

describe('findActiveNavItem', () => {
  it('home senza voce attiva', () => {
    assert.equal(findActiveNavItem('/app', integrationNavItems), null)
    assert.equal(findActiveNavItem('/app/', integrationNavItems), null)
  })

  it('piatti sulla radice menu', () => {
    const active = findActiveNavItem('/app/menu', integrationNavItems)
    assert.equal(active?.id, 'menu-dishes')
  })

  it('vini non risulta piatti', () => {
    const active = findActiveNavItem('/app/menu/wines', integrationNavItems)
    assert.equal(active?.id, 'menu-wines')
  })

  it('menù fissi e categorie', () => {
    assert.equal(findActiveNavItem('/app/menu/fixed', integrationNavItems)?.id, 'menu-fixed')
    assert.equal(
      findActiveNavItem('/app/menu/fixed/categories', integrationNavItems)?.id,
      'menu-fixed',
    )
  })

  it('orari a un livello', () => {
    assert.equal(findActiveNavItem('/app/hours', integrationNavItems)?.id, 'hours')
  })

  it('elenco ed eccezioni giorno', () => {
    assert.equal(findActiveNavItem('/app/reservations', integrationNavItems)?.id, 'reservations-list')
    assert.equal(
      findActiveNavItem('/app/reservations/day-exceptions', integrationNavItems)?.id,
      'reservations-day-exceptions',
    )
  })
})
