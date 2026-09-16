import { ValidationError } from 'payload'

import type { AdminRole, LoginMethod, UserAccessFields } from './roles'

type LocalPasswordContext = {
  adminRole: AdminRole
  loginMethod: LoginMethod
}

function resolveLocalPasswordContext(
  data: Partial<UserAccessFields> | undefined,
  originalDoc: UserAccessFields | undefined,
): LocalPasswordContext {
  return {
    adminRole: (data?.adminRole ?? originalDoc?.adminRole ?? 'none') as AdminRole,
    loginMethod: (data?.loginMethod ?? originalDoc?.loginMethod ?? 'sso') as LoginMethod,
  }
}

/**
 * Guardrail parziale (completato in 2.8): solo super-admin tra gli Admin può avere password locale;
 * loginMethod `sso` esclude qualsiasi password impostata.
 */
export function assertLocalPasswordAllowed(args: {
  data?: Partial<UserAccessFields>
  originalDoc?: UserAccessFields
}): void {
  const password = (args.data as { password?: string } | undefined)?.password
  if (!password) {
    return
  }

  const { adminRole, loginMethod } = resolveLocalPasswordContext(args.data, args.originalDoc)

  if (loginMethod === 'sso') {
    throw new ValidationError({
      collection: 'users',
      errors: [
        {
          message:
            'Con metodo di accesso solo SSO non è possibile impostare una password locale.',
          path: 'password',
        },
      ],
    })
  }

  if (adminRole === 'admin') {
    throw new ValidationError({
      collection: 'users',
      errors: [
        {
          message:
            'Gli utenti Admin (non super-admin) non possono avere credenziali locali; usare SSO.',
          path: 'password',
        },
      ],
    })
  }
}
