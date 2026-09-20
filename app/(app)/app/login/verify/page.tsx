import Link from 'next/link'
import config from '@payload-config'
import { getPayload } from 'payload'

import {
  GENERIC_VERIFY_FAILURE_MESSAGE,
  VERIFY_SUCCESS_MESSAGE,
} from '@/lib/auth/localEmail/messages'
import { verifyAppEmailToken } from '@/lib/auth/localEmail/verifyEmail'

type VerifyEmailPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function firstString(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    return value[0]
  }
  return undefined
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const token = firstString(resolvedSearchParams?.token)?.trim() ?? ''

  let verified = false
  if (token) {
    const payload = await getPayload({ config })
    verified = await verifyAppEmailToken({ payload, token })
  }

  return (
    <main className="flex min-h-dvh w-full flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-sm flex-col items-stretch gap-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Conferma email</h1>
        </div>

        <p
          role={verified ? 'status' : 'alert'}
          className={
            verified
              ? 'rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-left text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100'
              : 'rounded-md border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100'
          }
        >
          {verified ? VERIFY_SUCCESS_MESSAGE : GENERIC_VERIFY_FAILURE_MESSAGE}
        </p>

        <Link
          href="/app/login"
          className="text-sm text-neutral-600 underline underline-offset-2 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          Vai al login
        </Link>
      </div>
    </main>
  )
}
