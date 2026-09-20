import { decodeJwt } from 'jose'
import type { PayloadRequest } from 'payload'

import { assertHostedDomainAllowed } from './allowList'
import type { OAuthLoginArea } from './areas'
import { setOAuthLoginArea } from './areas'
import { OAuthLoginRejectedError } from './errors'
import { GOOGLE_TOKEN_ENDPOINT } from './constants'
import {
  getGoogleOAuthClientId,
  getGoogleOAuthClientSecret,
  getGoogleOAuthServerURL,
} from './env'

export type GoogleOAuthInstancePaths = {
  callbackPath: string
}

type GoogleTokenResponse = {
  access_token?: string
  id_token?: string
  error?: string
  error_description?: string
}

type GoogleIdTokenClaims = {
  aud?: string
  email?: string
  exp?: number
  hd?: string
  iss?: string
  sub?: string
}

const VALID_ISSUERS = new Set(['accounts.google.com', 'https://accounts.google.com'])

export async function exchangeGoogleCodeForAccessToken(args: {
  code: string
  req: PayloadRequest
  area: OAuthLoginArea
  paths: GoogleOAuthInstancePaths
}): Promise<string> {
  const { code, req, area, paths } = args
  const clientId = getGoogleOAuthClientId()
  const clientSecret = getGoogleOAuthClientSecret()
  const serverURL = getGoogleOAuthServerURL()
  const redirectUri = `${serverURL}/api/users${paths.callbackPath}`

  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })

  const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: params.toString(),
  })

  const tokenData = (await tokenResponse.json()) as GoogleTokenResponse
  const accessToken = tokenData.access_token
  const idToken = tokenData.id_token

  if (typeof accessToken !== 'string' || typeof idToken !== 'string') {
    throw new OAuthLoginRejectedError()
  }

  const claims = decodeJwt(idToken) as GoogleIdTokenClaims

  if (!claims.sub || typeof claims.sub !== 'string') {
    throw new OAuthLoginRejectedError()
  }

  if (claims.aud !== clientId) {
    throw new OAuthLoginRejectedError()
  }

  if (!claims.iss || !VALID_ISSUERS.has(claims.iss)) {
    throw new OAuthLoginRejectedError()
  }

  if (typeof claims.exp === 'number' && claims.exp * 1000 < Date.now()) {
    throw new OAuthLoginRejectedError()
  }

  if (typeof claims.hd !== 'string' || !claims.hd.trim()) {
    throw new OAuthLoginRejectedError()
  }

  await assertHostedDomainAllowed(req, claims.hd, area)
  setOAuthLoginArea(req, area)

  return accessToken
}
