import config from '@payload-config'
import { getPayload } from 'payload'

import { AppAuthAlert } from '@/components/app/auth/app-auth-alert'
import { AppAuthLink } from '@/components/app/auth/app-auth-link'
import { AppAuthPage } from '@/components/app/auth/app-auth-page'
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
    <AppAuthPage
      title="Conferma email"
      links={<AppAuthLink href="/app/login">Vai al login</AppAuthLink>}
    >
      <AppAuthAlert variant={verified ? 'success' : 'error'}>
        {verified ? VERIFY_SUCCESS_MESSAGE : GENERIC_VERIFY_FAILURE_MESSAGE}
      </AppAuthAlert>
    </AppAuthPage>
  )
}
