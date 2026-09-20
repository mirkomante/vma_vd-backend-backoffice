import type { PluginTypes } from 'payload-oauth2'

import { loginFailureRedirectPath } from '@/lib/auth/loginMessages'

import type { OAuthLoginArea } from './areas'
import {
  GOOGLE_ADMIN_AUTHORIZE_PATH,
  GOOGLE_ADMIN_CALLBACK_PATH,
  GOOGLE_ADMIN_STRATEGY,
  GOOGLE_APP_AUTHORIZE_PATH,
  GOOGLE_APP_CALLBACK_PATH,
  GOOGLE_APP_STRATEGY,
  GOOGLE_AUTHORIZATION_URL,
  GOOGLE_OAUTH_SCOPES,
} from './constants'
import {
  getGoogleOAuthClientId,
  getGoogleOAuthClientSecret,
  getGoogleOAuthServerURL,
  isGoogleOAuthConfigured,
} from './env'
import { exchangeGoogleCodeForAccessToken } from './tokens'
import { createGoogleGetUserInfo } from './userInfo'

type InstanceConfig = {
  area: OAuthLoginArea
  strategyName: string
  authorizePath: string
  callbackPath: string
  successPath: string
  failureLoginPath: string
}

const ADMIN_INSTANCE: InstanceConfig = {
  area: 'admin',
  strategyName: GOOGLE_ADMIN_STRATEGY,
  authorizePath: GOOGLE_ADMIN_AUTHORIZE_PATH,
  callbackPath: GOOGLE_ADMIN_CALLBACK_PATH,
  successPath: '/admin',
  failureLoginPath: '/admin/login',
}

const APP_INSTANCE: InstanceConfig = {
  area: 'app',
  strategyName: GOOGLE_APP_STRATEGY,
  authorizePath: GOOGLE_APP_AUTHORIZE_PATH,
  callbackPath: GOOGLE_APP_CALLBACK_PATH,
  successPath: '/app',
  failureLoginPath: '/app/login',
}

function buildPluginOptions(instance: InstanceConfig): PluginTypes {
  const serverURL = getGoogleOAuthServerURL()

  return {
    enabled: isGoogleOAuthConfigured(),
    strategyName: instance.strategyName,
    serverURL,
    clientId: getGoogleOAuthClientId(),
    clientSecret: getGoogleOAuthClientSecret(),
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    providerAuthorizationUrl: GOOGLE_AUTHORIZATION_URL,
    scopes: [...GOOGLE_OAUTH_SCOPES],
    authorizePath: instance.authorizePath,
    callbackPath: instance.callbackPath,
    useEmailAsIdentity: true,
    onUserNotFoundBehavior: 'error',
    prompt: 'select_account',
    getToken: (code, req) =>
      exchangeGoogleCodeForAccessToken({
        code,
        req,
        area: instance.area,
        paths: { callbackPath: instance.callbackPath },
      }),
    getUserInfo: createGoogleGetUserInfo(),
    successRedirect: () => instance.successPath,
    failureRedirect: () => loginFailureRedirectPath(instance.failureLoginPath),
  }
}

export function buildGoogleOAuthAdminPluginOptions(): PluginTypes {
  return buildPluginOptions(ADMIN_INSTANCE)
}

export function buildGoogleOAuthAppPluginOptions(): PluginTypes {
  return buildPluginOptions(APP_INSTANCE)
}

export function googleOAuthAdminAuthorizeHref(): string {
  return `/api/users${GOOGLE_ADMIN_AUTHORIZE_PATH}`
}

export function googleOAuthAppAuthorizeHref(): string {
  return `/api/users${GOOGLE_APP_AUTHORIZE_PATH}`
}
