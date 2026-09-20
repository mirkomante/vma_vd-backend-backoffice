import { GOOGLE_USERINFO_URL } from './constants'
import { OAuthLoginRejectedError } from './errors'

export type GoogleOAuthUserInfo = {
  email: string
  sub: string
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleOAuthUserInfo> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new OAuthLoginRejectedError()
  }

  const data = (await response.json()) as { email?: string; sub?: string }

  if (typeof data.email !== 'string' || !data.email.trim()) {
    throw new OAuthLoginRejectedError()
  }

  if (typeof data.sub !== 'string' || !data.sub.trim()) {
    throw new OAuthLoginRejectedError()
  }

  return {
    email: data.email.trim().toLowerCase(),
    sub: data.sub,
  }
}

export function createGoogleGetUserInfo() {
  return async (accessToken: string): Promise<GoogleOAuthUserInfo> => {
    return fetchGoogleUserInfo(accessToken)
  }
}
