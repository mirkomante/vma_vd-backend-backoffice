import { googleOAuthAdminAuthorizeHref } from '@/lib/auth/googleOAuth/pluginOptions'

import { LoginFailureNotice } from './LoginFailureNotice'

type AdminGoogleLoginBeforeProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

export default function AdminGoogleLoginBefore({ searchParams }: AdminGoogleLoginBeforeProps) {
  return (
    <div className="login-oauth">
      <LoginFailureNotice searchParams={searchParams} />
      <a className="btn btn--style-primary btn--size-large" href={googleOAuthAdminAuthorizeHref()}>
        Accedi con Google
      </a>
    </div>
  )
}
