import {
  AUTH_FAILURE_QUERY_PARAM,
  GENERIC_LOGIN_FAILURE_MESSAGE,
} from '@/lib/auth/loginMessages'

type LoginFailureNoticeProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

export function LoginFailureNotice({ searchParams }: LoginFailureNoticeProps) {
  const raw = searchParams?.[AUTH_FAILURE_QUERY_PARAM]
  const failed = raw === '1' || raw === 'true' || (Array.isArray(raw) && raw.includes('1'))

  if (!failed) {
    return null
  }

  return (
    <p
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
    >
      {GENERIC_LOGIN_FAILURE_MESSAGE}
    </p>
  )
}
