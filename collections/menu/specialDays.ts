import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'

import { hideFromAdminRoleManager } from '@/lib/auth/adminPanelVisibility'

import { FIXED_MENUS_SLUG, MENU_ADMIN_GROUP, SPECIAL_DAYS_SLUG } from '@/lib/menu/constants'
import { menuContentAccess } from '@/lib/menu/contentCollection'
import { menuContentDeleteLogHooks } from '@/lib/menu/menuContentDeleteLog'
import {
  SPECIAL_DAY_DATE_INVALID_MESSAGE,
  parseAndNormalizeSpecialDayDate,
} from '@/lib/menu/specialDayDate'
import {
  SPECIAL_DAY_SCOPE_OPTIONS,
  validateSpecialDayOverlap,
} from '@/lib/menu/validateSpecialDayOverlap'

export const SpecialDays: CollectionConfig = {
  slug: SPECIAL_DAYS_SLUG,
  labels: { singular: 'Giorno speciale', plural: 'Giorni speciali' },
  versions: false,
  defaultSort: '-date',
  admin: {
    group: MENU_ADMIN_GROUP,
    useAsTitle: 'date',
    defaultColumns: ['date', 'scope', 'disabled', 'updatedAt'],
    hidden: ({ user }) => hideFromAdminRoleManager(user),
    description:
      'Sostituisce del tutto l’offerta normale (à la carte e menu fissi) per la data e l’ambito scelti. Richiede rebuild del menù pubblico.',
  },
  access: menuContentAccess,
  hooks: {
    ...menuContentDeleteLogHooks,
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        if (!data) {
          return data
        }

        if (data.date != null && data.date !== '') {
          try {
            data.date = parseAndNormalizeSpecialDayDate(data.date)
          } catch {
            throw new ValidationError({
              collection: SPECIAL_DAYS_SLUG,
              errors: [{ message: SPECIAL_DAY_DATE_INVALID_MESSAGE, path: 'date' }],
            })
          }
        }

        await validateSpecialDayOverlap(req, data, originalDoc ?? undefined)
        return data
      },
    ],
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Data',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Giorno di calendario (salvato a mezzogiorno UTC).',
      },
    },
    {
      name: 'scope',
      type: 'select',
      required: true,
      label: 'Ambito',
      options: [...SPECIAL_DAY_SCOPE_OPTIONS],
      admin: {
        description:
          'Giornata intera sostituisce pranzo e cena; pranzo o cena lasciano l’altro servizio sul menù normale.',
      },
    },
    {
      name: 'content',
      type: 'group',
      label: 'Contenuto',
      fields: [
        {
          name: 'fixedMenus',
          type: 'relationship',
          relationTo: FIXED_MENUS_SLUG,
          hasMany: true,
          required: true,
          label: 'Menu fissi',
          admin: {
            description:
              'Un menu fisso eliminato sparisce da qui (cascade); la conferma nell’App lo anticipa.',
          },
        },
        {
          name: 'message',
          type: 'textarea',
          localized: true,
          label: 'Messaggio',
          admin: {
            description: 'Banner facoltativo sul giorno speciale.',
          },
        },
      ],
    },
    {
      name: 'disabled',
      type: 'checkbox',
      label: 'Disabilitato',
      defaultValue: false,
      admin: {
        description: 'Assenza a tempo indefinito (alternativa all’eliminazione definitiva).',
      },
    },
  ],
}
