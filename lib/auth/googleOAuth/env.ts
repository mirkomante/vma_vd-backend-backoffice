import { getAppPublicURL, isAppPublicURLConfigured } from '@/lib/appPublicUrl'

export function getGoogleOAuthServerURL(): string {
  return getAppPublicURL()
}

export function getGoogleOAuthClientId(): string {
  const id = process.env.GOOGLE_CLIENT_ID?.trim()
  if (!id) {
    throw new Error('GOOGLE_CLIENT_ID mancante.')
  }
  return id
}

export function getGoogleOAuthClientSecret(): string {
  const secret = process.env.GOOGLE_CLIENT_SECRET?.trim()
  if (!secret) {
    throw new Error('GOOGLE_CLIENT_SECRET mancante.')
  }
  return secret
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(
    isAppPublicURLConfigured() &&
      process.env.GOOGLE_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CLIENT_SECRET?.trim(),
  )
}
