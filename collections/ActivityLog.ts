import type { CollectionConfig } from 'payload'

import {
  ACTIVITY_LOG_AREAS,
  ACTIVITY_LOG_EVENT_TYPES,
  ACTIVITY_LOG_METHODS,
  ACTIVITY_LOG_SLUG,
} from '@/lib/activityLog/constants'
import { isStaffAdminRequest } from '@/lib/auth/userAccess'

export const ActivityLog: CollectionConfig = {
  slug: ACTIVITY_LOG_SLUG,
  labels: {
    singular: 'Voce registro attività',
    plural: 'Registro attività',
  },
  admin: {
    useAsTitle: 'eventType',
    defaultColumns: ['createdAt', 'user', 'eventType', 'area', 'method'],
    description:
      'Eventi di autenticazione e, in futuro, azioni sui documenti. Scrittura solo da hook di sistema.',
  },
  timestamps: true,
  access: {
    create: () => false,
    read: ({ req }) => isStaffAdminRequest(req),
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      admin: {
        description: 'Utente coinvolto nell’evento.',
      },
    },
    {
      name: 'area',
      type: 'select',
      options: [...ACTIVITY_LOG_AREAS],
      admin: {
        description: 'Area applicativa (Admin o App), quando applicabile.',
      },
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [...ACTIVITY_LOG_EVENT_TYPES],
      index: true,
    },
    {
      name: 'method',
      type: 'select',
      options: [...ACTIVITY_LOG_METHODS],
      admin: {
        description: 'Metodo di autenticazione (eventi auth).',
      },
    },
    {
      name: 'collection',
      type: 'text',
      admin: {
        description: 'Collection interessata (eventi CRUD futuri, non ancora attivi).',
        condition: (_, siblingData) =>
          siblingData?.eventType === 'create' ||
          siblingData?.eventType === 'update' ||
          siblingData?.eventType === 'delete',
      },
    },
    {
      name: 'documentId',
      type: 'text',
      admin: {
        description: 'Documento interessato (eventi CRUD futuri, non ancora attivi).',
        condition: (_, siblingData) =>
          siblingData?.eventType === 'create' ||
          siblingData?.eventType === 'update' ||
          siblingData?.eventType === 'delete',
      },
    },
  ],
}
