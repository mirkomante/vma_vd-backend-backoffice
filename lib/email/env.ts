import { getAppPublicURL } from '@/lib/appPublicUrl'

export function getPublicAppUrl(): string {
  return getAppPublicURL()
}

export function isResendConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.RESEND_FROM_ADDRESS?.trim() &&
      process.env.RESEND_FROM_NAME?.trim(),
  )
}

export function getResendApiKey(): string {
  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) {
    throw new Error('RESEND_API_KEY mancante.')
  }
  return key
}

export function getResendFromAddress(): string {
  const address = process.env.RESEND_FROM_ADDRESS?.trim()
  if (!address) {
    throw new Error('RESEND_FROM_ADDRESS mancante.')
  }
  return address
}

export function getResendFromName(): string {
  const name = process.env.RESEND_FROM_NAME?.trim()
  if (!name) {
    throw new Error('RESEND_FROM_NAME mancante.')
  }
  return name
}
