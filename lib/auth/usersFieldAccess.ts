import type { FieldAccess } from 'payload'

import { isStaffAdminRequest } from '@/lib/auth/userAccess'

const staffAdminRead: FieldAccess = ({ req }) => isStaffAdminRequest(req)

/** Campi di sistema utente visibili solo ad admin e super-admin (fase-8.4). */
export const staffAdminOnlyUserFieldAccess = {
  create: () => false,
  read: staffAdminRead,
  update: () => false,
}
