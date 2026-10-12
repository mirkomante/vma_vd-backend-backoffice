import type { FieldAccess } from 'payload'

import { isActiveAppManagerRequest, isStaffAdminRequest } from '@/lib/auth/userAccess'

import { canReadMenuGeneralRequest } from './access'

const staffAdminRead: FieldAccess = ({ req }) => isStaffAdminRequest(req)
const staffAdminUpdate: FieldAccess = ({ req }) => isStaffAdminRequest(req)

/**
 * Campi futuri su `menu-general`: solo staff Admin (lettura e scrittura).
 * Applicare a ogni nuovo campo tranne `globalMessage`.
 */
export const staffAdminOnlyMenuGeneralFieldAccess = {
  read: staffAdminRead,
  update: staffAdminUpdate,
}

const globalMessageRead: FieldAccess = ({ req }) => canReadMenuGeneralRequest(req)

const globalMessageUpdate: FieldAccess = ({ req }) =>
  isStaffAdminRequest(req) || isActiveAppManagerRequest(req)

/** `globalMessage`: lettura come il Global; modifica anche per manager App. */
export const menuGeneralGlobalMessageFieldAccess = {
  read: globalMessageRead,
  update: globalMessageUpdate,
}
