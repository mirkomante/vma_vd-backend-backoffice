import { LoginFailureNotice } from '@/components/auth/LoginFailureNotice'

type AdminLocalLoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminLocalLoginPage({ searchParams }: AdminLocalLoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  return (
    <main className="admin-local-login">
      <div className="admin-local-login__card">
        <h1 className="admin-local-login__title">Accesso locale (emergenza)</h1>
        <p className="admin-local-login__hint">
          Riservato al super-admin di bootstrap. Nessun link pubblico punta a questa pagina.
        </p>
        <LoginFailureNotice searchParams={resolvedSearchParams} />
        <form className="admin-local-login__form" method="POST" action="/api/users/login/local">
          <label className="admin-local-login__label">
            Email
            <input
              className="admin-local-login__input"
              type="email"
              name="email"
              autoComplete="username"
              required
            />
          </label>
          <label className="admin-local-login__label">
            Password
            <input
              className="admin-local-login__input"
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="admin-local-login__submit" type="submit">
            Accedi
          </button>
        </form>
      </div>
    </main>
  )
}
