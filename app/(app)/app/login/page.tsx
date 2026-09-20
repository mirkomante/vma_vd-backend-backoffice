import Link from 'next/link'

import { AppAuthField, AppAuthInput } from '@/components/auth/AppAuthField'
import { GoogleOAuthLoginLink } from '@/components/auth/GoogleOAuthLoginLink'
import { LoginFailureNotice } from '@/components/auth/LoginFailureNotice'
import { LoginInfoNotice } from '@/components/auth/LoginInfoNotice'
import { RESET_SUCCESS_MESSAGE } from '@/lib/auth/localEmail/messages'
import { googleOAuthAppAuthorizeHref } from '@/lib/auth/googleOAuth/pluginOptions'

type AppLoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function flagFromSearchParams(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  name: string,
): boolean {
  const raw = searchParams?.[name]
  return raw === '1' || raw === 'true' || (Array.isArray(raw) && raw.includes('1'))
}

export default async function AppLoginPage({ searchParams }: AppLoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  return (
    <main className="flex min-h-dvh w-full flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-sm flex-col items-stretch gap-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Area App</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Accedi con Google oppure con email e password.
          </p>
        </div>

        <LoginFailureNotice searchParams={resolvedSearchParams} />
        <LoginInfoNotice show={flagFromSearchParams(resolvedSearchParams, 'reset')}>
          {RESET_SUCCESS_MESSAGE}
        </LoginInfoNotice>

        <GoogleOAuthLoginLink href={googleOAuthAppAuthorizeHref()}>
          Accedi con Google
        </GoogleOAuthLoginLink>

        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-neutral-500">
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
          oppure
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
        </div>

        <form className="flex w-full flex-col gap-3" method="POST" action="/api/users/login/app">
          <AppAuthField label="Email">
            <AppAuthInput type="email" name="email" autoComplete="username" required />
          </AppAuthField>
          <AppAuthField label="Password">
            <AppAuthInput
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </AppAuthField>
          <button className="google-oauth-login-button" type="submit">
            Accedi
          </button>
        </form>

        <Link
          href="/app/login/forgot"
          className="text-sm text-neutral-600 underline underline-offset-2 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          Password dimenticata?
        </Link>

        <Link
          href="/"
          className="text-sm text-neutral-600 underline-offset-2 hover:underline dark:text-neutral-400"
        >
          Torna al sito
        </Link>
      </div>
    </main>
  )
}
