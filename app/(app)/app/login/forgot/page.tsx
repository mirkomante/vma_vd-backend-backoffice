import Link from 'next/link'

import { AppAuthField, AppAuthInput } from '@/components/auth/AppAuthField'
import { LoginInfoNotice } from '@/components/auth/LoginInfoNotice'
import { GENERIC_FORGOT_PASSWORD_SENT_MESSAGE } from '@/lib/auth/localEmail/messages'

type ForgotPasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const raw = resolvedSearchParams?.sent
  const sent = raw === '1' || raw === 'true' || (Array.isArray(raw) && raw.includes('1'))

  return (
    <main className="flex min-h-dvh w-full flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-sm flex-col items-stretch gap-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Password dimenticata</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.
          </p>
        </div>

        <LoginInfoNotice show={sent}>{GENERIC_FORGOT_PASSWORD_SENT_MESSAGE}</LoginInfoNotice>

        <form className="flex w-full flex-col gap-3" method="POST" action="/api/users/forgot-password/app">
          <AppAuthField label="Email">
            <AppAuthInput type="email" name="email" autoComplete="username" required />
          </AppAuthField>
          <button className="google-oauth-login-button" type="submit">
            Invia istruzioni
          </button>
        </form>

        <Link
          href="/app/login"
          className="text-sm text-neutral-600 underline underline-offset-2 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          Torna al login
        </Link>
      </div>
    </main>
  )
}
