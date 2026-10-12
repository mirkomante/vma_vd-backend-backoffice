import type { CollectionConfig } from 'payload'

import {
  ALLERGENS_SLUG,
  APPELLATIONS_SLUG,
  CLASSIFICATIONS_SLUG,
  COUNTRIES_SLUG,
  DISH_CATEGORIES_SLUG,
  DRINK_TYPES_SLUG,
  REGIONS_SLUG,
  SPIRIT_TYPES_SLUG,
  WINE_TYPES_SLUG,
} from '@/lib/menu/constants'
import { localizedTaxonomyCollection, menuTaxonomyAccess, menuTaxonomyAdminMeta } from '@/lib/menu/sharedCollection'

export const DishCategories: CollectionConfig = localizedTaxonomyCollection({
  slug: DISH_CATEGORIES_SLUG,
  labels: { singular: 'Categoria piatto', plural: 'Categorie piatti' },
  description: 'Popolata dall’import (6.8); il manager sceglie soltanto.',
})

export const Allergens: CollectionConfig = localizedTaxonomyCollection({
  slug: ALLERGENS_SLUG,
  labels: { singular: 'Allergene', plural: 'Allergeni' },
  description: '14 valori normativi UE; condivisi tra piatti e bevande.',
  extraFields: [
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Descrizione',
      admin: {
        description: 'Facoltativa; informazione normativa (es. solfiti).',
      },
    },
  ],
})

export const Countries: CollectionConfig = localizedTaxonomyCollection({
  slug: COUNTRIES_SLUG,
  labels: { singular: 'Paese', plural: 'Paesi' },
  extraFields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Abilitato',
      defaultValue: true,
      admin: {
        description: 'Se disattivato, il paese non compare nelle scelte del manager (6.6).',
      },
    },
  ],
})

export const Regions: CollectionConfig = {
  slug: REGIONS_SLUG,
  labels: { singular: 'Regione', plural: 'Regioni' },
  versions: false,
  admin: menuTaxonomyAdminMeta(
    'Relazione obbligatoria al paese; solo valori abilitati in scelta manager.',
  ),
  access: menuTaxonomyAccess,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nome',
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: COUNTRIES_SLUG,
      required: true,
      label: 'Paese',
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Abilitata',
      defaultValue: true,
    },
  ],
}

export const Appellations: CollectionConfig = {
  slug: APPELLATIONS_SLUG,
  labels: { singular: 'Denominazione', plural: 'Denominazioni' },
  versions: false,
  admin: menuTaxonomyAdminMeta('Nomi propri; non localizzati.'),
  access: menuTaxonomyAccess,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome',
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: REGIONS_SLUG,
      required: true,
      label: 'Regione',
    },
  ],
}

export const Classifications: CollectionConfig = {
  slug: CLASSIFICATIONS_SLUG,
  labels: { singular: 'Classificazione', plural: 'Classificazioni' },
  versions: false,
  admin: menuTaxonomyAdminMeta('Sigle normative; non localizzate.'),
  access: menuTaxonomyAccess,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome',
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: COUNTRIES_SLUG,
      required: true,
      label: 'Paese',
    },
  ],
}

export const SpiritTypes: CollectionConfig = localizedTaxonomyCollection({
  slug: SPIRIT_TYPES_SLUG,
  labels: { singular: 'Tipologia distillato', plural: 'Tipologie distillato' },
  description: 'Popolata dall’import (6.8).',
})

export const WineTypes: CollectionConfig = localizedTaxonomyCollection({
  slug: WINE_TYPES_SLUG,
  labels: { singular: 'Tipologia vino', plural: 'Tipologie vino' },
  description: 'Popolata dall’import (6.8).',
})

export const DrinkTypes: CollectionConfig = localizedTaxonomyCollection({
  slug: DRINK_TYPES_SLUG,
  labels: { singular: 'Tipologia bevanda', plural: 'Tipologie bevanda' },
  description: 'Popolata dall’import (6.8); «Birre» la crea un admin al primo inserimento.',
})

export const menuTaxonomyCollections: CollectionConfig[] = [
  DishCategories,
  Allergens,
  Countries,
  Regions,
  Appellations,
  Classifications,
  SpiritTypes,
  WineTypes,
  DrinkTypes,
]
