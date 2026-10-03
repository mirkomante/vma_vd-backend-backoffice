/**
 * URL pubblico canonico dell'app (OAuth redirect, link email).
 * Usare APP_PUBLIC_URL (runtime) — non NEXT_PUBLIC_*: Next inlines le NEXT_PUBLIC al build
 * (Docker/Cloud Run), quindi cambiare solo l'env sul servizio non aggiorna OAuth in prod.
 */
export function getAppPublicURL(): string {
  const url = (process.env.APP_PUBLIC_URL ?? process.env.NEXT_PUBLIC_URL)?.trim()
  if (!url) {
    throw new Error(
      'APP_PUBLIC_URL mancante: necessario per OAuth Google e link email (in locale puoi usare NEXT_PUBLIC_URL).',
    )
  }
  return url.replace(/\/$/, '')
}

export function isAppPublicURLConfigured(): boolean {
  return Boolean(
    process.env.APP_PUBLIC_URL?.trim() || process.env.NEXT_PUBLIC_URL?.trim(),
  )
}
