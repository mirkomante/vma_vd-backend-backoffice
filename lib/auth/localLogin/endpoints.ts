import type { Endpoint } from 'payload'

import { createAppLocalLoginEndpoint } from './appEndpoint'
import { createAdminLocalLoginEndpoint } from './endpoint'

export function localLoginEndpoints(): Endpoint[] {
  return [createAdminLocalLoginEndpoint(), createAppLocalLoginEndpoint()]
}
