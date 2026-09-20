import type { Endpoint } from 'payload'

import { createAppForgotPasswordEndpoint } from './forgotPasswordEndpoint'
import { createAppResetPasswordEndpoint } from './resetPasswordEndpoint'

export function localEmailEndpoints(): Endpoint[] {
  return [createAppForgotPasswordEndpoint(), createAppResetPasswordEndpoint()]
}
