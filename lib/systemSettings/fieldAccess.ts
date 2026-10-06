import type { FieldAccess } from 'payload'

import { isStaffAdminRequest } from '@/lib/auth/userAccess'

const staffAdminRead: FieldAccess = ({ req }) => isStaffAdminRequest(req)
const staffAdminUpdate: FieldAccess = ({ req }) => isStaffAdminRequest(req)

/** Calendario, Comunicazioni, Integrazioni: lettura e scrittura solo staff Admin (ADR-109, fase-7.4). */
export const staffAdminOnlySystemSettingsFieldAccess = {
  read: staffAdminRead,
  update: staffAdminUpdate,
}
