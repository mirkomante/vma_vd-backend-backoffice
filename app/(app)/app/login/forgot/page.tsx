import { AppAuthAlert } from '@/components/app/auth/app-auth-alert'
import { AppAuthLink } from '@/components/app/auth/app-auth-link'
import { AppAuthPage } from '@/components/app/auth/app-auth-page'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { GENERIC_FORGOT_PASSWORD_SENT_MESSAGE } from '@/lib/auth/localEmail/messages'

type ForgotPasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const raw = resolvedSearchParams?.sent
  const sent = raw === '1' || raw === 'true' || (Array.isArray(raw) && raw.includes('1'))

  return (
    <AppAuthPage
      title="Password dimenticata"
      description="Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni."
      links={<AppAuthLink href="/app/login">Torna al login</AppAuthLink>}
    >
      {sent ? (
        <AppAuthAlert variant="success">{GENERIC_FORGOT_PASSWORD_SENT_MESSAGE}</AppAuthAlert>
      ) : null}

      <form className="flex w-full flex-col gap-4" method="POST" action="/api/users/forgot-password/app">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
            <Input
              id="forgot-email"
              type="email"
              name="email"
              autoComplete="username"
              required
            />
          </Field>
        </FieldGroup>
        <Button type="submit" size="lg" className="w-full">
          Invia istruzioni
        </Button>
      </form>
    </AppAuthPage>
  )
}
