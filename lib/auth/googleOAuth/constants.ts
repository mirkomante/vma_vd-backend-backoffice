export const GOOGLE_ADMIN_STRATEGY = 'google-admin'
export const GOOGLE_APP_STRATEGY = 'google-app'

export const GOOGLE_ADMIN_AUTHORIZE_PATH = '/oauth/google-admin'
export const GOOGLE_APP_AUTHORIZE_PATH = '/oauth/google-app'

export const GOOGLE_ADMIN_CALLBACK_PATH = '/oauth/google-admin/callback'
export const GOOGLE_APP_CALLBACK_PATH = '/oauth/google-app/callback'

export const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
export const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
export const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

export const GOOGLE_OAUTH_SCOPES = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
] as const
