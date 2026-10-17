import type { CollectionConfig } from 'payload'

import {
  ALLERGENS_SLUG,
  APPELLATIONS_SLUG,
  CLASSIFICATIONS_SLUG,
  COUNTRIES_SLUG,
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  DRINK_TYPES_SLUG,
  DRINKS_SLUG,
  FIXED_MENU_CATEGORIES_SLUG,
  FIXED_MENUS_SLUG,
  MENU_SERVICES_SLUG,
  REGIONS_SLUG,
  SPIRIT_TYPES_SLUG,
  SPIRITS_SLUG,
  WINE_TYPES_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'
import { fixedMenuCategoryAccess, menuContentAccess, menuContentAdminMeta } from '@/lib/menu/contentCollection'
import { menuContentCollectionHooks } from '@/lib/menu/menuContentCollectionHooks'
import { menuVisibilityField } from '@/lib/menu/visibilityField'
import { validateFixedMenuDishesField } from '@/lib/menu/validateFixedMenuDishes'
import { validateWineGeography } from '@/lib/menu/validateWineGeography'

import { SpecialDays } from './specialDays'

const disabledField = {
  name: 'disabled',
  type: 'checkbox' as const,
  label: 'Disabilitato',
  defaultValue: false,
  admin: {
    description: 'Assenza a tempo indefinito dalla carta (alternativa all’eliminazione definitiva).',
  },
}

export const Dishes: CollectionConfig = {
  slug: DISHES_SLUG,
  labels: { singular: 'Piatto', plural: 'Piatti' },
  versions: false,
  defaultSort: 'name',
  admin: menuContentAdminMeta(),
  access: menuContentAccess,
  hooks: menuContentCollectionHooks,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nome',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Descrizione',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Prezzo',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: DISH_CATEGORIES_SLUG,
      required: true,
      label: 'Categoria',
    },
    {
      name: 'allergens',
      type: 'relationship',
      relationTo: ALLERGENS_SLUG,
      hasMany: true,
      label: 'Allergeni',
    },
    {
      name: 'glutenFree',
      type: 'checkbox',
      label: 'Senza glutine',
      defaultValue: false,
    },
    {
      name: 'dairyFree',
      type: 'checkbox',
      label: 'Senza latticini',
      defaultValue: false,
    },
    {
      name: 'vegan',
      type: 'checkbox',
      label: 'Vegano',
      defaultValue: false,
    },
    {
      name: 'eggFree',
      type: 'checkbox',
      label: 'Senza uovo',
      defaultValue: false,
    },
    {
      name: 'soldOut',
      type: 'checkbox',
      label: 'Terminato per servizio',
      defaultValue: false,
      admin: {
        description: 'Esaurimento temporaneo; reset automatico ai confini di servizio (6.4).',
      },
    },
    disabledField,
  ],
}

export const Wines: CollectionConfig = {
  slug: WINES_SLUG,
  labels: { singular: 'Vino', plural: 'Vini' },
  versions: false,
  defaultSort: 'name',
  admin: menuContentAdminMeta(),
  access: menuContentAccess,
  hooks: {
    ...menuContentCollectionHooks,
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        if (!data) {
          return
        }
        await validateWineGeography(req, data, originalDoc ?? undefined)
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Descrizione',
    },
    {
      name: 'winery',
      type: 'text',
      label: 'Cantina',
    },
    {
      name: 'year',
      type: 'text',
      label: 'Anno',
    },
    {
      name: 'volume',
      type: 'text',
      label: 'Capacità',
      admin: { description: 'Es. «75 cl».' },
    },
    {
      name: 'abv',
      type: 'text',
      label: 'Grado alcolico',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Prezzo',
    },
    {
      name: 'glassPrice',
      type: 'number',
      label: 'Prezzo al calice',
    },
    {
      name: 'classification',
      type: 'relationship',
      relationTo: CLASSIFICATIONS_SLUG,
      label: 'Classificazione',
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: COUNTRIES_SLUG,
      required: true,
      label: 'Paese',
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: REGIONS_SLUG,
      label: 'Regione',
    },
    {
      name: 'appellation',
      type: 'relationship',
      relationTo: APPELLATIONS_SLUG,
      label: 'Denominazione',
    },
    {
      name: 'type',
      type: 'relationship',
      relationTo: WINE_TYPES_SLUG,
      required: true,
      label: 'Tipologia',
    },
    disabledField,
  ],
}

export const Spirits: CollectionConfig = {
  slug: SPIRITS_SLUG,
  labels: { singular: 'Distillato', plural: 'Distillati' },
  versions: false,
  defaultSort: 'name',
  admin: menuContentAdminMeta(),
  access: menuContentAccess,
  hooks: menuContentCollectionHooks,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Descrizione',
    },
    {
      name: 'abv',
      type: 'text',
      label: 'Grado alcolico',
    },
    {
      name: 'aging',
      type: 'text',
      label: 'Invecchiamento',
    },
    {
      name: 'volume',
      type: 'text',
      label: 'Capacità',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Prezzo',
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: COUNTRIES_SLUG,
      required: true,
      label: 'Paese',
    },
    {
      name: 'type',
      type: 'relationship',
      relationTo: SPIRIT_TYPES_SLUG,
      required: true,
      label: 'Tipologia',
    },
    disabledField,
  ],
}

export const Drinks: CollectionConfig = {
  slug: DRINKS_SLUG,
  labels: { singular: 'Bevanda', plural: 'Bevande' },
  versions: false,
  defaultSort: 'name',
  admin: menuContentAdminMeta('Include le birre (tipologia «Birre»).'),
  access: menuContentAccess,
  hooks: menuContentCollectionHooks,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nome',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Descrizione',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Prezzo',
    },
    {
      name: 'type',
      type: 'relationship',
      relationTo: DRINK_TYPES_SLUG,
      required: true,
      label: 'Tipologia',
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: COUNTRIES_SLUG,
      label: 'Paese',
    },
    {
      name: 'abv',
      type: 'text',
      label: 'Grado alcolico',
    },
    {
      name: 'volume',
      type: 'text',
      label: 'Capacità',
    },
    {
      name: 'allergens',
      type: 'relationship',
      relationTo: ALLERGENS_SLUG,
      hasMany: true,
      label: 'Allergeni',
    },
    disabledField,
  ],
}

export const MenuServices: CollectionConfig = {
  slug: MENU_SERVICES_SLUG,
  labels: { singular: 'Servizio', plural: 'Servizi' },
  versions: false,
  defaultSort: 'name',
  admin: menuContentAdminMeta('Coperto, diritto di dolce, diritto di tappo'),
  access: menuContentAccess,
  hooks: menuContentCollectionHooks,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nome',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Prezzo',
    },
    disabledField,
  ],
}

export const FixedMenuCategories: CollectionConfig = {
  slug: FIXED_MENU_CATEGORIES_SLUG,
  labels: { singular: 'Categoria menu fisso', plural: 'Categorie menu fisso' },
  versions: false,
  defaultSort: 'name',
  admin: menuContentAdminMeta(),
  access: fixedMenuCategoryAccess,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nome',
    },
    menuVisibilityField(true),
    disabledField,
  ],
}

export const FixedMenus: CollectionConfig = {
  slug: FIXED_MENUS_SLUG,
  labels: { singular: 'Menu fisso', plural: 'Menu fissi' },
  versions: false,
  defaultSort: 'name',
  admin: menuContentAdminMeta(),
  access: menuContentAccess,
  hooks: menuContentCollectionHooks,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nome',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Descrizione',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Prezzo',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: FIXED_MENU_CATEGORIES_SLUG,
      required: true,
      label: 'Categoria',
    },
    menuVisibilityField(true),
    {
      name: 'specialOnly',
      type: 'checkbox',
      label: 'Solo giorni speciali',
      defaultValue: false,
      admin: {
        description:
          'Se attivo, il menu non compare nelle pagine normali del menù pubblico (solo tramite giorni speciali).',
      },
    },
    {
      name: 'dishes',
      type: 'array',
      label: 'Piatti',
      labels: { singular: 'Piatto nel menu', plural: 'Piatti nel menu' },
      validate: validateFixedMenuDishesField,
      fields: [
        {
          name: 'dish',
          type: 'relationship',
          relationTo: DISHES_SLUG,
          required: true,
          label: 'Piatto',
        },
        {
          name: 'portion',
          type: 'text',
          localized: true,
          label: 'Porzione',
          admin: {
            description:
              'Facoltativa; solo se la quantità nel menu fisso differisce dalla porzione à la carte.',
          },
        },
      ],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: MENU_SERVICES_SLUG,
      hasMany: true,
      label: 'Servizi',
    },
    disabledField,
  ],
}

export const menuContentCollections: CollectionConfig[] = [
  Dishes,
  Wines,
  Spirits,
  Drinks,
  MenuServices,
  FixedMenuCategories,
  FixedMenus,
  SpecialDays,
]
