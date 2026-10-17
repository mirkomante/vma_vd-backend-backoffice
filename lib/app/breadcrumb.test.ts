import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { buildAppBreadcrumb } from './navRouteMatch.ts'
import type { VisibleAppNavGroup } from './navigationForUser.ts'

const mockNav: VisibleAppNavGroup[] = [
  {
    id: 'menu',
    label: 'Menù',
    section: 'menu',
    items: [
      {
        id: 'menu-dishes',
        label: 'Piatti',
        href: '/app/menu',
        section: 'menu',
        enabled: true,
        iconKey: 'utensils-crossed',
      },
      {
        id: 'menu-wines',
        label: 'Vini',
        href: '/app/menu/wines',
        section: 'menu',
        enabled: true,
        iconKey: 'wine',
      },
      {
        id: 'menu-fixed',
        label: 'Menù fissi',
        href: '/app/menu/fixed',
        section: 'menu',
        enabled: true,
        iconKey: 'book-open',
      },
    ],
  },
  {
    id: 'hours',
    label: 'Orari',
    section: 'hours',
    items: [
      {
        id: 'hours',
        label: 'Orari',
        href: '/app/hours',
        section: 'hours',
        enabled: true,
        iconKey: 'clock',
      },
    ],
  },
  {
    id: 'reservations',
    label: 'Prenotazioni',
    section: 'reservations',
    items: [
      {
        id: 'reservations-list',
        label: 'Elenco',
        href: '/app/reservations',
        section: 'reservations',
        enabled: true,
        iconKey: 'calendar-days',
      },
      {
        id: 'reservations-day-exceptions',
        label: 'Eccezioni giorno',
        href: '/app/reservations/day-exceptions',
        section: 'reservations',
        enabled: true,
        iconKey: 'calendar-days',
      },
    ],
  },
]

describe('buildAppBreadcrumb', () => {
  it('home', () => {
    assert.deepEqual(buildAppBreadcrumb('/app', mockNav), [{ type: 'page', label: 'Area App' }])
  })

  it('orari a un livello', () => {
    assert.deepEqual(buildAppBreadcrumb('/app/hours', mockNav), [{ type: 'page', label: 'Orari' }])
  })

  it('piatti con gruppo', () => {
    assert.deepEqual(buildAppBreadcrumb('/app/menu', mockNav), [
      { type: 'link', label: 'Menù', href: '/app/menu' },
      { type: 'page', label: 'Piatti' },
    ])
  })

  it('vini', () => {
    assert.deepEqual(buildAppBreadcrumb('/app/menu/wines', mockNav), [
      { type: 'link', label: 'Menù', href: '/app/menu' },
      { type: 'page', label: 'Vini' },
    ])
  })

  it('menù fissi e categorie', () => {
    assert.deepEqual(buildAppBreadcrumb('/app/menu/fixed', mockNav), [
      { type: 'link', label: 'Menù', href: '/app/menu' },
      { type: 'page', label: 'Menù fissi' },
    ])
    assert.deepEqual(buildAppBreadcrumb('/app/menu/fixed/categories', mockNav), [
      { type: 'link', label: 'Menù', href: '/app/menu' },
      { type: 'link', label: 'Menù fissi', href: '/app/menu/fixed' },
      { type: 'page', label: 'Categorie' },
    ])
  })

  it('elenco prenotazioni ed eccezioni giorno', () => {
    assert.deepEqual(buildAppBreadcrumb('/app/reservations', mockNav), [
      { type: 'link', label: 'Prenotazioni', href: '/app/reservations' },
      { type: 'page', label: 'Elenco' },
    ])
    assert.deepEqual(buildAppBreadcrumb('/app/reservations/day-exceptions', mockNav), [
      { type: 'link', label: 'Prenotazioni', href: '/app/reservations' },
      { type: 'page', label: 'Eccezioni giorno' },
    ])
  })
})
