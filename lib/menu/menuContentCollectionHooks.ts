import type { CollectionConfig } from 'payload'

import { menuAvailabilityCollectionHooks } from '@/lib/menu/availability/menuAvailabilityHooks'
import { menuContentDeleteLogHooks } from '@/lib/menu/menuContentDeleteLog'

/** Availability (6.4) prima del log delete (6.6 Parte 0). */
export const menuContentCollectionHooks: CollectionConfig['hooks'] = {
  afterChange: menuAvailabilityCollectionHooks.afterChange,
  beforeDelete: menuContentDeleteLogHooks.beforeDelete,
  afterDelete: [
    ...(menuAvailabilityCollectionHooks.afterDelete ?? []),
    ...(menuContentDeleteLogHooks.afterDelete ?? []),
  ],
}
