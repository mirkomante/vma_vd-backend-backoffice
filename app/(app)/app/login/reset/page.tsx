import { AppAuthAlert } from '@/components/app/auth/app-auth-alert'
import { AppAuthLink } from '@/components/app/auth/app-auth-link'
import { AppAuthPage } from '@/components/app/auth/app-auth-page'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { GENERIC_RESET_FAILURE_MESSAGE } from '@/lib/auth/localEmail/messages'

type ResetPasswordPageProps = {
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

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const token = firstString(resolvedSearchParams?.token)?.trim() ?? ''
  const failedRaw = resolvedSearchParams?.resetFailed
  const failed =
    failedRaw === '1' || failedRaw === 'true' || (Array.isArray(failedRaw) && failedRaw.includes('1'))

  const showFailure = failed || !token

  return (
    <AppAuthPage
      title="Nuova password"
      description="Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra."
      links={<AppAuthLink href="/app/login">Torna al login</AppAuthLink>}
    >
      {showFailure ? (
        <AppAuthAlert variant="error">{GENERIC_RESET_FAILURE_MESSAGE}</AppAuthAlert>
      ) : null}

      {token && !failed ? (
        <form className="flex w-full flex-col gap-4" method="POST" action="/api/users/reset-password/app">
          <input type="hidden" name="token" value={token} />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="reset-password">Nuova password</FieldLabel>
              <Input
                id="reset-password"
                type="password"
                name="password"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </Field>
          </FieldGroup>
          <Button type="submit" size="lg" className="w-full">
            Aggiorna password
          </Button>
        </form>
      ) : null}
    </AppAuthPage>
  )
}
