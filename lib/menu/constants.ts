/** Gruppo Admin Payload per tassonomie e Global del menù digitale (fase 6.1). */
export const MENU_ADMIN_GROUP = 'Menù digitale'

export const DISH_CATEGORIES_SLUG = 'dish-categories'
export const ALLERGENS_SLUG = 'allergens'
export const COUNTRIES_SLUG = 'countries'
export const REGIONS_SLUG = 'regions'
export const APPELLATIONS_SLUG = 'appellations'
export const CLASSIFICATIONS_SLUG = 'classifications'
export const SPIRIT_TYPES_SLUG = 'spirit-types'
export const WINE_TYPES_SLUG = 'wine-types'
export const DRINK_TYPES_SLUG = 'drink-types'
export const MENU_GENERAL_SLUG = 'menu-general'

export const MENU_TAXONOMY_SLUGS = [
  DISH_CATEGORIES_SLUG,
  ALLERGENS_SLUG,
  COUNTRIES_SLUG,
  REGIONS_SLUG,
  APPELLATIONS_SLUG,
  CLASSIFICATIONS_SLUG,
  SPIRIT_TYPES_SLUG,
  WINE_TYPES_SLUG,
  DRINK_TYPES_SLUG,
] as const

export type MenuTaxonomySlug = (typeof MENU_TAXONOMY_SLUGS)[number]
