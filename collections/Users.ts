import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'

import { assertNotLastLocalSuperAdmin } from '@/lib/auth/lastLocalSuperAdmin'
import { assertLocalPasswordAllowed } from '@/lib/auth/localPasswordGuard'
import { validatePasswordPolicy } from '@/lib/auth/passwordPolicy'
import {
  ADMIN_ROLE_OPTIONS,
  APP_ROLE_OPTIONS,
  LOGIN_METHOD_OPTIONS,
  type UserAccessFields,
  type UserWriteData,
} from '@/lib/auth/roles'
import { logAuthLoginHook, logAuthLogoutHook } from '@/lib/activityLog/userAuthHooks'
import { localEmailEndpoints } from '@/lib/auth/localEmail/endpoints'
import { prepareActivationBeforeChange } from '@/lib/auth/localEmail/prepareActivationBeforeChange'
import { sendActivationAfterChange } from '@/lib/auth/localEmail/sendActivationAfterChange'
import { hashLocalCredentialsBeforeChange } from '@/lib/auth/localCredentials/hashLocalCredentialsBeforeChange'
import { localLoginEndpoints } from '@/lib/auth/localLogin/endpoints'
import { googleOAuthUserCallbackEndpoints } from '@/lib/auth/googleOAuth/callbackEndpoints'
import {
  isLocalAppUserProfile,
  showAppLocalPasswordFields,
} from '@/lib/auth/localAppUserAdmin'
import {
  canAccessAdminPanel,
  canCreateUser,
  isStaffAdminRequest,
  usersDeleteAccess,
  usersUpdateAccess,
} from '@/lib/auth/userAccess'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: {
      enableFields: true,
    },
    useSessions: false,
  },
  endpoints: [
    ...googleOAuthUserCallbackEndpoints(),
    ...localLoginEndpoints(),
    ...localEmailEndpoints(),
  ],
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'adminRole', 'appRole', 'loginMethod', 'emailVerified', 'active'],
  },
  access: {
    admin: ({ req }) => canAccessAdminPanel(req.user as UserAccessFields),
    create: ({ req, data }) => canCreateUser({ req, data }),
    read: ({ req }) => isStaffAdminRequest(req),
    update: usersUpdateAccess,
    delete: usersDeleteAccess,
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
      defaultValue: false,
      admin: {
        description:
          'Spuntare per consentire l’accesso. Default disattivato (ADR-004): compare solo dopo l’assegnazione di un ruolo.',
        condition: (_data, siblingData) => {
          const d = siblingData as UserAccessFields
          return d.adminRole !== 'none' || d.appRole !== 'none'
        },
      },
    },
    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
        description:
          'Gestito da hook (attivazione email App). Non modificare manualmente salvo casi eccezionali.',
      },
    },
    {
      name: 'password',
      type: 'text',
      admin: {
        description:
          'Obbligatoria in creazione per utenti App con login locale. Dopo il salvataggio parte l’email di attivazione.',
        condition: (_data, siblingData) =>
          showAppLocalPasswordFields(siblingData as UserAccessFields),
        components: {
          Field: '@/components/payload/AppLocalPasswordField#AppLocalPasswordField',
        },
      },
    },
    {
      name: 'passwordConfirm',
      type: 'text',
      virtual: true,
      admin: {
        description: 'Ripetere la password per conferma.',
        condition: (_data, siblingData) =>
          showAppLocalPasswordFields(siblingData as UserAccessFields),
        components: {
          Field: '@/components/payload/AppLocalPasswordField#AppLocalPasswordField',
        },
      },
    },
    {
      name: 'emailVerificationToken',
      type: 'text',
      hidden: true,
      access: {
        read: () => false,
        create: () => false,
        update: () => false,
      },
      admin: {
        disableListColumn: true,
      },
    },
    {
      name: 'bootstrapCredentialHash',
      type: 'text',
      hidden: true,
      access: {
        read: () => false,
        create: () => false,
        update: () => false,
      },
      admin: {
        disableListColumn: true,
      },
    },
    {
      name: 'bootstrapCredentialSalt',
      type: 'text',
      hidden: true,
      access: {
        read: () => false,
        create: () => false,
        update: () => false,
      },
      admin: {
        disableListColumn: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc, operation, req }) => {
        const writeData = data as UserWriteData | undefined
        const current = originalDoc as UserAccessFields | undefined

        assertLocalPasswordAllowed({
          data: writeData,
          originalDoc: current,
        })

        const mergedProfile = { ...current, ...writeData } as UserAccessFields

        if (operation === 'create' && writeData) {
          const hasAnyRole =
            mergedProfile.adminRole !== 'none' || mergedProfile.appRole !== 'none'
          const activeExplicit = writeData.active === true
          writeData.active = activeExplicit && hasAnyRole ? true : false
          if (isLocalAppUserProfile(mergedProfile)) {
            writeData.emailVerified = false
          } else if (writeData.emailVerified !== true) {
            writeData.emailVerified = false
          }
        }

        if (
          operation === 'create' &&
          mergedProfile.adminRole === 'none' &&
          mergedProfile.appRole === 'none'
        ) {
          throw new ValidationError({
            collection: 'users',
            errors: [
              {
                message:
                  'Assegnare almeno un ruolo (Admin Role o App Role): un utente senza ruoli non può accedere.',
                path: 'appRole',
              },
            ],
          })
        }

        if (operation === 'update' && current) {
          await assertNotLastLocalSuperAdmin({
            req,
            operation: 'update',
            data: writeData,
            originalDoc: current,
          })
        }

        const isLocalApp = isLocalAppUserProfile(mergedProfile)

        if (operation === 'create' && isLocalApp) {
          const password = writeData?.password
          if (!password) {
            throw new ValidationError({
              collection: 'users',
              errors: [
                {
                  message:
                    'Impostare una password per gli utenti App con login locale (campo sotto, visibile con App Role ≠ Nessuno).',
                  path: 'password',
                },
              ],
            })
          }
        }

        const password = writeData?.password
        if (password && isLocalApp) {
          if (password !== writeData?.passwordConfirm) {
            throw new ValidationError({
              collection: 'users',
              errors: [{ message: 'Le password non coincidono.', path: 'passwordConfirm' }],
            })
          }
        }

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
    beforeChange: [prepareActivationBeforeChange, hashLocalCredentialsBeforeChange],
    afterChange: [sendActivationAfterChange],
    afterLogin: [logAuthLoginHook],
    afterLogout: [logAuthLogoutHook],
    beforeDelete: [
      async ({ req, id }) => {
        await assertNotLastLocalSuperAdmin({
          req,
          operation: 'delete',
          id,
        })
      },
    ],
  },
}
