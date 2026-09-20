---
stato: validato
---

# Login locale di emergenza — Area Admin

Nota operativa per chi gestisce il backoffice. Copre la sottofase **2.7** di `docs/piano-sviluppo/fase-2-login.md`.

## Scopo

Con `disableLocalStrategy` attivo sulla collection `users`, il form standard di `/admin/login` mostra solo Google SSO. Resta una **via di accesso locale** riservata al super-admin creato con `pnpm seed:super-admin`, da usare se l’SSO non è disponibile o per recupero account.

## URL (non linkato da alcuna UI)

- **Pagina form**: `https://<host>/admin/login/local` (in locale: `http://localhost:3000/admin/login/local`)
- **Endpoint API**: `POST /api/users/login/local` (JSON `{ "email", "password" }`) — usato dal form; non esporre come API pubblica documentata oltre a questo scopo.

Digitare l’URL manualmente: nessun menu, link o pulsante nel pannello Payload punta a questa route.

## Credenziali

Stesse variabili del seed:

- `SEED_SUPERADMIN_EMAIL`
- `SEED_SUPERADMIN_PASSWORD`

Solo utenti con `adminRole: super-admin`, `active: true` e `loginMethod` che ammette locale (`local` o `sso-and-local`) possono autenticarsi su questo percorso.

## Implementazione (riferimento tecnico)

- Hashing password in create/update: hook `beforeChange` su `users` (`lib/auth/localCredentials/`), algoritmo PBKDF2-SHA256 allineato a Payload.
- Sessione: cookie generato con `generatePayloadCookie`; hook `afterLogin` della collection richiamati esplicitamente dall’endpoint (necessario per `activityLog` quando attivo in 2.9).
- `useSessions: false` sulla collection `users` (compatibilità SSO con `disableLocalStrategy`).

## Cosa non fa

- Non sostituisce l’SSO per l’uso quotidiano del team Admin su dominio Workspace.
- Non abilita login locale per utenti `admin` (non super-admin): guardrail invariati.
