import type { Endpoint } from 'payload'

import { createAppForgotPasswordEndpoint } from './forgotPasswordEndpoint'
import { createResendActivationEndpoint } from './resendActivationEndpoint'
import { createAppResetPasswordEndpoint } from './resetPasswordEndpoint'

export function localEmailEndpoints(): Endpoint[] {
  return [
    createAppForgotPasswordEndpoint(),
    createAppResetPasswordEndpoint(),
    createResendActivationEndpoint(),
  ]
}
