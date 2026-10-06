import type { GlobalConfig } from 'payload'

import { isStaffAdminRequest } from '@/lib/auth/userAccess'

/** Slug Payload del Global di configurazione tecnica trasversale (ADR-109). */
export const SYSTEM_SETTINGS_SLUG = 'impostazioni-sistema'

/**
 * Configurazione tecnica trasversale (orari, calendario, comunicazioni).
 * Etichetta Admin distinta da `settings` («Identità autorizzate»).
 * Permessi granulari per tab/campo in fase-7.4; qui solo staff Admin.
 */
export const SystemSettings: GlobalConfig = {
  slug: SYSTEM_SETTINGS_SLUG,
  label: 'Impostazioni di sistema',
  versions: false,
  admin: {
    description:
      'Orari e chiusure, calendario, mittenti email verso i clienti e riferimenti per integrazioni future. I campi si aggiungono nelle sottofasi 7.2 e 7.3.',
  },
  access: {
    read: ({ req }) => isStaffAdminRequest(req),
    update: ({ req }) => isStaffAdminRequest(req),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Orari e chiusure',
          fields: [],
        },
        {
          label: 'Calendario',
          fields: [],
        },
        {
          label: 'Comunicazioni',
          fields: [],
        },
        {
          label: 'Integrazioni future',
          fields: [],
        },
      ],
    },
  ],
}
