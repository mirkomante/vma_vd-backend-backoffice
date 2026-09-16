import { ValidationError } from 'payload'

import {
  loginMethodIncludesLocal,
  type AdminRole,
  type LoginMethod,
  type UserAccessFields,
  type UserWriteData,
} from './roles'

type LocalCredentialsContext = {
  adminRole: AdminRole
  loginMethod: LoginMethod
}

function resolveLocalCredentialsContext(
  data: UserWriteData | undefined,
  originalDoc: UserAccessFields | undefined,
): LocalCredentialsContext {
  return {
    adminRole: (data?.adminRole ?? originalDoc?.adminRole ?? 'none') as AdminRole,
    loginMethod: (data?.loginMethod ?? originalDoc?.loginMethod ?? 'sso') as LoginMethod,
  }
}

/**
 * True se il payload di create darebbe a un Admin di pannello (non super-admin)
 * un metodo locale o una password. Usato dall'access control: senza `data`
 * (es. pulsante Crea in lista) non si può giudicare, quindi resta false.
 */
export function grantsLocalCredentialsToPanelAdmin(data?: UserWriteData): boolean {
  if (!data || data.adminRole !== 'admin') {
    return false
  }

  if (loginMethodIncludesLocal(data.loginMethod)) {
    return true
  }

  return Boolean(data.password)
}

/**
 * Solo i super-admin, tra chi ha un ruolo Admin, possono avere credenziali locali.
 * `loginMethod: sso` esclude qualsiasi password. Gli utenti solo App (adminRole none)
 * restano liberi di usare il login locale (ADR-003).
 */
export function assertLocalPasswordAllowed(args: {
  data?: UserWriteData
  originalDoc?: UserAccessFields
}): void {
  const { adminRole, loginMethod } = resolveLocalCredentialsContext(
    args.data,
    args.originalDoc,
  )
  const password = args.data?.password

  if (adminRole === 'admin' && loginMethodIncludesLocal(loginMethod)) {
    throw new ValidationError({
      collection: 'users',
      errors: [
        {
          message:
            'Gli utenti Admin (non super-admin) non possono avere credenziali locali; usare SSO.',
          path: 'loginMethod',
        },
      ],
    })
  }

  if (!password) {
    return
  }

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
