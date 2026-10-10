import { AppAuthAlert } from '@/components/app/auth/app-auth-alert'
import { AppAuthLink } from '@/components/app/auth/app-auth-link'
import { AppAuthPage } from '@/components/app/auth/app-auth-page'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { GENERIC_LOGIN_FAILURE_MESSAGE } from '@/lib/auth/loginMessages'
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
  const authFailed = flagFromSearchParams(resolvedSearchParams, 'authFailed')
  const resetOk = flagFromSearchParams(resolvedSearchParams, 'reset')

  return (
    <AppAuthPage
      title="Area App"
      description="Accedi con Google oppure con email e password."
      links={
        <>
          <AppAuthLink href="/app/login/forgot">Password dimenticata?</AppAuthLink>
          <AppAuthLink href="/" muted>Torna al sito</AppAuthLink>
        </>
      }
    >
      {authFailed ? <AppAuthAlert variant="error">{GENERIC_LOGIN_FAILURE_MESSAGE}</AppAuthAlert> : null}
      {resetOk ? <AppAuthAlert variant="success">{RESET_SUCCESS_MESSAGE}</AppAuthAlert> : null}

      <Button
        nativeButton={false}
        size="lg"
        className="w-full"
        render={<a href={googleOAuthAppAuthorizeHref()} />}
      >
        Accedi con Google
      </Button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <Separator className="flex-1" />
        oppure
        <Separator className="flex-1" />
      </div>

      <form className="flex w-full flex-col gap-4" method="POST" action="/api/users/login/app">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="login-email">Email</FieldLabel>
            <Input
              id="login-email"
              type="email"
              name="email"
              autoComplete="username"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
            <Input
              id="login-password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </Field>
        </FieldGroup>
        <Button type="submit" variant="outline" size="lg" className="w-full">
          Accedi
        </Button>
      </form>
    </AppAuthPage>
  )
}
