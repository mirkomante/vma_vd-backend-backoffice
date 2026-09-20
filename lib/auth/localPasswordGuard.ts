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
 * True se il payload di create darebbe a un utente con ruolo Admin di pannello
 * (admin o super-admin) un metodo locale o una password sul campo auth standard.
 * Usato dall'access control: senza `data` (es. pulsante Crea in lista) non si può
 * giudicare, quindi resta false. Il bootstrap usa campi dedicati via script seed.
 */
export function grantsLocalCredentialsToPanelAdmin(data?: UserWriteData): boolean {
  if (!data || data.adminRole === 'none') {
    return false
  }

  if (loginMethodIncludesLocal(data.loginMethod)) {
    return true
  }

  return Boolean(data.password)
}

/**
 * ADR-004: nessun adminRole ≠ none può avere loginMethod locale né password sul
 * campo auth standard. Gli utenti solo App (adminRole none) restano liberi (ADR-003).
 * Credenziali emergenza super-admin: bootstrapCredentialHash/Salt (solo script).
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

  if (adminRole !== 'none' && loginMethodIncludesLocal(loginMethod)) {
    throw new ValidationError({
      collection: 'users',
      errors: [
        {
          message:
            'Gli utenti con accesso Admin non possono avere credenziali locali sul profilo; usare SSO.',
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

  if (adminRole !== 'none') {
    throw new ValidationError({
      collection: 'users',
      errors: [
        {
          message:
            'Gli utenti con accesso Admin non possono avere credenziali locali sul profilo; usare SSO.',
          path: 'password',
        },
      ],
    })
  }
}
