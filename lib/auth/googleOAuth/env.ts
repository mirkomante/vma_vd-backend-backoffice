export function getGoogleOAuthServerURL(): string {
  const url = process.env.NEXT_PUBLIC_URL?.trim()
  if (!url) {
    throw new Error('NEXT_PUBLIC_URL mancante: necessario per OAuth Google.')
  }
  return url.replace(/\/$/, '')
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
    process.env.NEXT_PUBLIC_URL?.trim() &&
      process.env.GOOGLE_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CLIENT_SECRET?.trim(),
  )
}
