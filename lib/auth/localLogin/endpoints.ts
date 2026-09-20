import type { Endpoint } from 'payload'

import { createAdminLocalLoginEndpoint } from './endpoint'

export function localLoginEndpoints(): Endpoint[] {
  return [createAdminLocalLoginEndpoint()]
}
