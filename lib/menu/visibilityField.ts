import type { Field } from 'payload'

/** Valori congelati (contratto frontend): `always` | `lunch_only` | `dinner_only`. */
export const MENU_VISIBILITY_OPTIONS = [
  { label: 'Sempre', value: 'always' },
  { label: 'Solo pranzo', value: 'lunch_only' },
  { label: 'Solo cena', value: 'dinner_only' },
] as const

export type MenuVisibilityValue = (typeof MENU_VISIBILITY_OPTIONS)[number]['value']

export function menuVisibilityField(required = true): Field {
  return {
    name: 'visibility',
    type: 'select',
    required,
    defaultValue: 'always',
    label: 'Visibilità',
    options: [...MENU_VISIBILITY_OPTIONS],
    admin: {
      description: 'Quando il menu o la categoria compare nelle pagine del menù pubblico.',
    },
  }
}
