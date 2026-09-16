import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'

import { assertLocalPasswordAllowed } from '@/lib/auth/localPasswordGuard'
import { validatePasswordPolicy } from '@/lib/auth/passwordPolicy'
import {
  ADMIN_ROLE_OPTIONS,
  APP_ROLE_OPTIONS,
  LOGIN_METHOD_OPTIONS,
  type UserAccessFields,
} from '@/lib/auth/roles'
import { canAccessAdminPanel, isStaffAdminRequest, isSuperAdminRequest } from '@/lib/auth/userAccess'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'adminRole', 'appRole', 'loginMethod', 'active'],
  },
  access: {
    admin: ({ req }) => canAccessAdminPanel(req.user as UserAccessFields),
    create: ({ req }) => isStaffAdminRequest(req),
    read: ({ req }) => isStaffAdminRequest(req),
    update: ({ req }) => isStaffAdminRequest(req),
    delete: ({ req }) => isSuperAdminRequest(req),
  },
  fields: [
    {
      name: 'adminRole',
      type: 'select',
      required: true,
      defaultValue: 'none',
      options: [...ADMIN_ROLE_OPTIONS],
      admin: {
        description:
          'Accesso al pannello Payload (/admin). Un solo valore per area; non cumulabile con altri valori nello stesso campo.',
      },
    },
    {
      name: 'appRole',
      type: 'select',
      required: true,
      defaultValue: 'none',
      options: [...APP_ROLE_OPTIONS],
      admin: {
        description:
          'Ruolo nell’Area App (/app). Separato da adminRole; enforcement per sezione nelle fasi di dominio.',
      },
    },
    {
      name: 'loginMethod',
      type: 'select',
      required: true,
      defaultValue: 'sso',
      options: [...LOGIN_METHOD_OPTIONS],
      admin: {
        description:
          'SSO: tipico per Admin e utenti solo Google. Locale o misto: Area App (ADR-003 login locale di default).',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Utente disattivato: nessun login ammesso (SSO o locale).',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        assertLocalPasswordAllowed({
          data: data as UserAccessFields | undefined,
          originalDoc: originalDoc as UserAccessFields | undefined,
        })

        const password = (data as { password?: string } | undefined)?.password
        if (!password) {
          return data
        }

        const result = validatePasswordPolicy(password)
        if (result !== true) {
          throw new ValidationError({
            collection: 'users',
            errors: [{ message: result, path: 'password' }],
          })
        }

        return data
      },
    ],
  },
}
