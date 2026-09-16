import { ValidationError } from 'payload'
import type { PayloadRequest } from 'payload'

import { loginMethodIncludesLocal, type UserAccessFields, type UserWriteData } from './roles'

const LAST_LOCAL_SUPER_ADMIN_MESSAGE =
  'Non è possibile eliminare o disattivare l’ultimo super-admin locale rimasto.'

export function isActiveLocalSuperAdmin(
  user: UserAccessFields | null | undefined,
): boolean {
  if (!user || user.active === false) {
    return false
  }

  return user.adminRole === 'super-admin' && loginMethodIncludesLocal(user.loginMethod)
}

function resolveNextState(
  data: UserWriteData | undefined,
  current: UserAccessFields,
): UserAccessFields {
  return {
    ...current,
    adminRole: data?.adminRole ?? current.adminRole,
    loginMethod: data?.loginMethod ?? current.loginMethod,
    active: data?.active ?? current.active,
  }
}

/**
 * Impedisce un update o una delete che lascerebbe zero super-admin locali attivi.
 * Oltre a delete e `active = false` (testo della checklist 2.8), blocca anche
 * declassamento del ruolo o passaggio a solo-SSO: altrimenti il vincolo sarebbe
 * aggirabile senza cancellare il record.
 */
export async function assertNotLastLocalSuperAdmin(args: {
  req: PayloadRequest
  operation: 'update' | 'delete'
  id?: number | string
  data?: UserWriteData
  originalDoc?: UserAccessFields
}): Promise<void> {
  const current = await resolveCurrentUser(args)
  if (!isActiveLocalSuperAdmin(current)) {
    return
  }

  const next = args.operation === 'delete' ? null : resolveNextState(args.data, current)
  if (isActiveLocalSuperAdmin(next)) {
    return
  }

  const remaining = await args.req.payload.count({
    collection: 'users',
    overrideAccess: true,
    req: args.req,
    where: {
      and: [
        { id: { not_equals: current.id } },
        { adminRole: { equals: 'super-admin' } },
        { active: { not_equals: false } },
        { loginMethod: { in: ['local', 'sso-and-local'] } },
      ],
    },
  })

  if (remaining.totalDocs > 0) {
    return
  }

  throw new ValidationError({
    collection: 'users',
    errors: [
      {
        message: LAST_LOCAL_SUPER_ADMIN_MESSAGE,
        path: args.operation === 'delete' ? 'id' : pathForBlockedUpdate(args.data),
      },
    ],
  })
}

async function resolveCurrentUser(args: {
  req: PayloadRequest
  id?: number | string
  originalDoc?: UserAccessFields
}): Promise<UserAccessFields> {
  if (args.originalDoc) {
    return args.originalDoc
  }

  const id = args.id
  if (id === undefined || id === null || id === '') {
    return {}
  }

  const found = await args.req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    req: args.req,
    where: { id: { equals: id } },
  })

  return (found.docs[0] as UserAccessFields | undefined) ?? {}
}

function pathForBlockedUpdate(data: UserWriteData | undefined): string {
  if (data?.active === false) {
    return 'active'
  }
  if (data?.adminRole && data.adminRole !== 'super-admin') {
    return 'adminRole'
  }
  if (data?.loginMethod && !loginMethodIncludesLocal(data.loginMethod)) {
    return 'loginMethod'
  }
  return 'active'
}
