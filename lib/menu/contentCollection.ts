import type { CollectionConfig } from 'payload'

import { hideFromAdminRoleManager } from '@/lib/auth/adminPanelVisibility'

import {
  canDeleteMenuContentRequest,
  canReadMenuContentRequest,
  canWriteMenuContentRequest,
} from './access'
import { MENU_ADMIN_GROUP } from './constants'

export const menuContentAccess: CollectionConfig['access'] = {
  create: ({ req }) => canWriteMenuContentRequest(req),
  read: ({ req }) => canReadMenuContentRequest(req),
  update: ({ req }) => canWriteMenuContentRequest(req),
  delete: ({ req }) => canDeleteMenuContentRequest(req),
}

export function menuContentAdminMeta(description?: string): CollectionConfig['admin'] {
  return {
    group: MENU_ADMIN_GROUP,
    useAsTitle: 'name',
    defaultColumns: ['name', 'disabled', 'updatedAt'],
    hidden: ({ user }) => hideFromAdminRoleManager(user),
    description,
  }
}
