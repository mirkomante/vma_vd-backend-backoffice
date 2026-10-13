import type { GlobalConfig } from 'payload'

import { hideFromAdminRoleManager } from '@/lib/auth/adminPanelVisibility'
import { canReadMenuGeneralRequest, canUpdateMenuGeneralRequest } from '@/lib/menu/access'
import { MENU_GENERAL_SLUG } from '@/lib/menu/constants'
import { menuGeneralAvailabilityAfterChange } from '@/lib/menu/availability/menuAvailabilityHooks'
import { menuGeneralGlobalMessageFieldAccess } from '@/lib/menu/fieldAccess'

/** Global «Generali» del menù: solo `globalMessage` (ADR-109 §2, fase 6.1). */
export const MenuGeneral: GlobalConfig = {
  slug: MENU_GENERAL_SLUG,
  label: 'Generali',
  versions: false,
  admin: {
    group: 'Menù digitale',
    description:
      'Messaggio immediato sul menù pubblico (alimenta disponibilita.json in 6.4). Nessun campo orario.',
    hidden: ({ user }) => hideFromAdminRoleManager(user),
  },
  access: {
    read: ({ req }) => canReadMenuGeneralRequest(req),
    update: ({ req }) => canUpdateMenuGeneralRequest(req),
  },
  hooks: {
    afterChange: [menuGeneralAvailabilityAfterChange],
  },
  fields: [
    {
      name: 'globalMessage',
      type: 'text',
      localized: true,
      label: 'Messaggio globale',
      access: menuGeneralGlobalMessageFieldAccess,
      admin: {
        description: 'Avviso breve (es. «oggi cucina chiusa»); modificabile dal manager nell’App.',
      },
    },
  ],
}
