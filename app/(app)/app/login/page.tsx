import Link from 'next/link'

import { GoogleOAuthLoginLink } from '@/components/auth/GoogleOAuthLoginLink'
import { LoginFailureNotice } from '@/components/auth/LoginFailureNotice'
import { googleOAuthAppAuthorizeHref } from '@/lib/auth/googleOAuth/pluginOptions'

type AppLoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function AppLoginPage({ searchParams }: AppLoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  return (
    <main className="flex min-h-dvh w-full flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-sm flex-col items-stretch gap-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Area App</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Accedi con l’account Google del team.
          </p>
        </div>

        <LoginFailureNotice searchParams={resolvedSearchParams} />

        <GoogleOAuthLoginLink href={googleOAuthAppAuthorizeHref()}>
          Accedi con Google
        </GoogleOAuthLoginLink>

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
