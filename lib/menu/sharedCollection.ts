import type { CollectionConfig, Field } from 'payload'

import { hideFromAdminRoleManager } from '@/lib/auth/adminPanelVisibility'

import { canReadMenuTaxonomiesRequest, canWriteMenuTaxonomiesRequest } from './access'
import { MENU_ADMIN_GROUP } from './constants'

type LocalizedTaxonomyOptions = {
  slug: string
  labels: { singular: string; plural: string }
  description?: string
  extraFields?: Field[]
}

export function localizedTaxonomyCollection(options: LocalizedTaxonomyOptions): CollectionConfig {
  const fields: Field[] = [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nome',
    },
    ...(options.extraFields ?? []),
  ]

  return {
    slug: options.slug,
    labels: options.labels,
    versions: false,
    admin: {
      group: MENU_ADMIN_GROUP,
      useAsTitle: 'name',
      hidden: ({ user }) => hideFromAdminRoleManager(user),
      description: options.description,
    },
    access: {
      create: ({ req }) => canWriteMenuTaxonomiesRequest(req),
      read: ({ req }) => canReadMenuTaxonomiesRequest(req),
      update: ({ req }) => canWriteMenuTaxonomiesRequest(req),
      delete: ({ req }) => canWriteMenuTaxonomiesRequest(req),
    },
    fields,
  }
}

export function menuTaxonomyAdminMeta(description?: string): CollectionConfig['admin'] {
  return {
    group: MENU_ADMIN_GROUP,
    useAsTitle: 'name',
    hidden: ({ user }) => hideFromAdminRoleManager(user),
    description,
  }
}

export const menuTaxonomyAccess = {
  create: ({ req }: { req: Parameters<typeof canWriteMenuTaxonomiesRequest>[0] }) =>
    canWriteMenuTaxonomiesRequest(req),
  read: ({ req }: { req: Parameters<typeof canReadMenuTaxonomiesRequest>[0] }) =>
    canReadMenuTaxonomiesRequest(req),
  update: ({ req }: { req: Parameters<typeof canWriteMenuTaxonomiesRequest>[0] }) =>
    canWriteMenuTaxonomiesRequest(req),
  delete: ({ req }: { req: Parameters<typeof canWriteMenuTaxonomiesRequest>[0] }) =>
    canWriteMenuTaxonomiesRequest(req),
}
