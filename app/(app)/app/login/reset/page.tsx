import Link from 'next/link'

import { AppAuthField, AppAuthInput } from '@/components/auth/AppAuthField'
import { GENERIC_RESET_FAILURE_MESSAGE } from '@/lib/auth/localEmail/messages'

type ResetPasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function firstString(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    return value[0]
  }
  return undefined
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const token = firstString(resolvedSearchParams?.token)?.trim() ?? ''
  const failedRaw = resolvedSearchParams?.resetFailed
  const failed =
    failedRaw === '1' || failedRaw === 'true' || (Array.isArray(failedRaw) && failedRaw.includes('1'))

  return (
    <main className="flex min-h-dvh w-full flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-sm flex-col items-stretch gap-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nuova password</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.
          </p>
        </div>

        {failed ? (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
          >
            {GENERIC_RESET_FAILURE_MESSAGE}
          </p>
        ) : null}

        {!token ? (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
          >
            {GENERIC_RESET_FAILURE_MESSAGE}
          </p>
        ) : (
          <form className="flex w-full flex-col gap-3" method="POST" action="/api/users/reset-password/app">
            <input type="hidden" name="token" value={token} />
            <AppAuthField label="Nuova password">
              <AppAuthInput
                type="password"
                name="password"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </AppAuthField>
            <button className="google-oauth-login-button" type="submit">
              Aggiorna password
            </button>
          </form>
        )}

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
