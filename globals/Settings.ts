import type { GlobalConfig } from 'payload'

import {
  prepareAllowedDomains,
  SETTINGS_SLUG,
  type SettingsWriteData,
} from '@/lib/auth/allowedDomains'
import { isStaffAdminRequest, isSuperAdminRequest } from '@/lib/auth/userAccess'

/**
 * Allow-list domini Google Workspace (claim `hd`).
 * Slug di catalogo `settings`; etichetta Admin distinta dai Global
 * `impostazioni-*` di dominio (sito, prenotazioni, sistema).
 */
export const Settings: GlobalConfig = {
  slug: SETTINGS_SLUG,
  label: 'Identità autorizzate',
  admin: {
    description:
      'Domini Google Workspace ammessi al login SSO, con flag separati per Area Admin e Area App. Almeno un dominio è obbligatorio.',
  },
  access: {
    read: ({ req }) => isStaffAdminRequest(req),
    update: ({ req }) => isSuperAdminRequest(req),
  },
  fields: [
    {
      name: 'allowedDomains',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Dominio',
        plural: 'Domini autorizzati',
      },
      admin: {
        description:
          'Un dominio per riga (es. vietnamonamour.com). I flag scelgono in quale area quel dominio è ammesso.',
      },
      fields: [
        {
          name: 'domain',
          type: 'text',
          required: true,
          label: 'Dominio',
          admin: {
            placeholder: 'esempio.com',
          },
        },
        {
          name: 'allowAdmin',
          type: 'checkbox',
          defaultValue: false,
          label: 'Consenti Area Admin',
        },
        {
          name: 'allowApp',
          type: 'checkbox',
          defaultValue: false,
          label: 'Consenti Area App',
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        const incoming = (data ?? {}) as SettingsWriteData
        const current = originalDoc as SettingsWriteData | undefined

        // `??` e non `||`: un array vuoto è un tentativo esplicito di svuotare la lista.
        incoming.allowedDomains = prepareAllowedDomains({
          allowedDomains: incoming.allowedDomains ?? current?.allowedDomains,
        })

        return incoming
      },
    ],
  },
}
