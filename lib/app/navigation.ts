import type { AppSection } from '@/lib/auth/roles'

import type { AppNavIconKey } from './nav-icon-keys'

export type AppNavItemId =
  | 'menu-dishes'
  | 'menu-wines'
  | 'menu-drinks'
  | 'menu-spirits'
  | 'menu-fixed'
  | 'menu-services'
  | 'menu-special-days'
  | 'menu-message'
  | 'hours'
  | 'reservations-list'
  | 'reservations-day-exceptions'
  | 'reservations-settings'

export type AppNavItemDef = {
  id: AppNavItemId
  label: string
  href: string
  section: AppSection
  enabled: boolean
  iconKey: AppNavIconKey
}

export type AppNavGroupDef = {
  id: 'menu' | 'hours' | 'reservations'
  label: string
  section: AppSection
  items: AppNavItemDef[]
}

/** Tabella di navigazione D1; `enabled` abilita la voce solo quando la pagina esiste. */
export const APP_NAV_GROUPS: readonly AppNavGroupDef[] = [
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
        id: 'menu-drinks',
        label: 'Bevande',
        href: '/app/menu/drinks',
        section: 'menu',
        enabled: true,
        iconKey: 'cup-soda',
      },
      {
        id: 'menu-spirits',
        label: 'Distillati',
        href: '/app/menu/spirits',
        section: 'menu',
        enabled: true,
        iconKey: 'martini',
      },
      {
        id: 'menu-fixed',
        label: 'Menù fissi',
        href: '/app/menu/fixed',
        section: 'menu',
        enabled: true,
        iconKey: 'book-open',
      },
      {
        id: 'menu-services',
        label: 'Servizi',
        href: '/app/menu/services',
        section: 'menu',
        enabled: true,
        iconKey: 'concierge-bell',
      },
      {
        id: 'menu-special-days',
        label: 'Giorni speciali',
        href: '/app/menu/special-days',
        section: 'menu',
        enabled: true,
        iconKey: 'calendar-heart',
      },
      {
        id: 'menu-message',
        label: 'Messaggio globale',
        href: '/app/menu/message',
        section: 'menu',
        enabled: true,
        iconKey: 'megaphone',
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
        enabled: false,
        iconKey: 'calendar-days',
      },
      {
        id: 'reservations-settings',
        label: 'Impostazioni',
        href: '/app/reservations/settings',
        section: 'reservations',
        enabled: false,
        iconKey: 'settings',
      },
    ],
  },
]

export type HomeSectionCardDef = {
  section: AppSection
  title: string
  description: string
  href: string
  iconKey: AppNavIconKey
}

/** Ordine home: Prenotazioni, Menù, Orari (shell spec §7.4). */
export const HOME_SECTION_CARDS: readonly HomeSectionCardDef[] = [
  {
    section: 'reservations',
    title: 'Prenotazioni',
    description: 'Elenco, eccezioni giorno, impostazioni',
    href: '/app/reservations',
    iconKey: 'calendar-days',
  },
  {
    section: 'menu',
    title: 'Menù',
    description: 'Piatti, vini, bevande, menù fissi e altro',
    href: '/app/menu',
    iconKey: 'utensils-crossed',
  },
  {
    section: 'hours',
    title: 'Orari',
    description: 'Ristorante, B&B, giorni di riposo, chiusure',
    href: '/app/hours',
    iconKey: 'clock',
  },
]
