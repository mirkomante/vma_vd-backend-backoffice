import type { PayloadRequest } from 'payload'

import { ACTIVITY_LOG_SLUG } from '@/lib/activityLog/constants'

/**
 * Elimina le voci di `activity-log` collegate all'utente prima della cancellazione del record `users`.
 * Lo schema Postgres ha FK `ON DELETE SET NULL` ma `user_id` è NOT NULL (campo required): senza questo
 * passaggio la DELETE su `users` fallisce con violazione del vincolo.
 */
export async function purgeActivityLogForUserBeforeDelete(
  req: PayloadRequest,
  userId: number | string,
): Promise<void> {
  await req.payload.delete({
    collection: ACTIVITY_LOG_SLUG,
    overrideAccess: true,
    req,
    where: {
      user: {
        equals: userId,
      },
    },
  })
}
