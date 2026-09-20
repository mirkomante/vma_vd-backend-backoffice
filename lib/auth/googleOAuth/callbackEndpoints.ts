import type { Endpoint } from 'payload'

import { createGoogleOAuthCallbackEndpoints } from './callbackEndpoint'
import {
  buildGoogleOAuthAdminPluginOptions,
  buildGoogleOAuthAppPluginOptions,
} from './pluginOptions'
import { isGoogleOAuthConfigured } from './env'

export function googleOAuthUserCallbackEndpoints(): Endpoint[] {
  if (!isGoogleOAuthConfigured()) {
    return []
  }

  return [
    ...createGoogleOAuthCallbackEndpoints(buildGoogleOAuthAdminPluginOptions()),
    ...createGoogleOAuthCallbackEndpoints(buildGoogleOAuthAppPluginOptions()),
  ]
}
