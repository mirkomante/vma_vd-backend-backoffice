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

Solo utenti con `adminRole: super-admin`, `active: true` e credenziali bootstrap (`bootstrapCredentialHash` / `bootstrapCredentialSalt`, popolate dal seed o dalla migrazione una tantum). Sul profilo il `loginMethod` resta **solo SSO** (ADR-004): le credenziali di emergenza non vivono nel campo `password`/`hash`/`salt` standard.

Record creati con il seed **prima** del 2026-09-20 (modello legacy `loginMethod: local` + hash/salt standard): eseguire una volta `pnpm migrate:bootstrap-credentials` (copia hash/salt → bootstrap, imposta `loginMethod: sso`) **senza** cambiare la password in chiaro.

## Rotazione password bootstrap — lacuna operativa

**Non è previsto** oggi un comando o una UI Admin per **cambiare** la password di emergenza di un super-admin già creato.

| Azione | Effetto |
|--------|--------|
| Nuova versione di `SEED_SUPERADMIN_PASSWORD` in Secret Manager | Solo copia operativa per chi lancia il seed da locale; **non** aggiorna il DB e **non** cambia il login su Cloud Run (i `SEED_*` di solito **non** sono montati sul servizio — vedi `docs/operativo/cloud-run-produzione.md`). |
| Rilancio `pnpm seed:super-admin` con password nuova | **Nessuna modifica** se l’email esiste già come super-admin bootstrap attivo (`bootstrapCredentialHash` presente): lo script è idempotente e **non sovrascrive** hash/salt (evita di riscrivere credenziali su prod per errore). Vedi `scripts/seed-super-admin.ts`. |
| Modifica utente da pannello Admin | I campi `bootstrapCredentialHash` / `bootstrapCredentialSalt` sono nascosti e non aggiornabili via UI/API standard. |

**Password effettiva al login** (`POST /api/users/login/local`): quella codificata nel **record `users` su PostgreSQL**, non il valore in Secret Manager.

**Workaround accettato a questa scala** (database ancora gestibile, un solo utente seed):

1. Auth Proxy + `DATABASE_URL` prod come per migrate/seed (`docs/operativo/cloud-sql-produzione.md`).
2. Eliminare il record seed (es. `DELETE FROM users WHERE email = '<email seed>';` via `psql`) — attenzione a eventuali FK su `activity_log` se già popolato.
3. Eseguire di nuovo `pnpm seed:super-admin` con `SEED_SUPERADMIN_*` (nuova password) e `PAYLOAD_SECRET` prod inline.
4. Allineare Secret Manager alla nuova password (e verificare `/admin/login/local`).

**Fuori scope attuale**: script dedicato tipo `rotate-bootstrap-password` o flag `--force-rotate` sul seed — da introdurre solo se la rotazione diventa frequente o serve evitare DELETE manuale; se aggiunto, documentarlo qui e in `fase-2-login.md` § 2.8.

## Implementazione (riferimento tecnico)

- Seed: `pnpm seed:super-admin` scrive `bootstrapCredential*` via `hashLocalPassword`; `loginMethod: sso`.
- Hashing password **Area App** in create/update: hook `beforeChange` su `users` (`lib/auth/localCredentials/`), algoritmo PBKDF2-SHA256 allineato a Payload.
- Sessione: cookie generato con `generatePayloadCookie`; hook `afterLogin` della collection richiamati esplicitamente dall’endpoint (necessario per `activityLog` quando attivo in 2.9).
- `useSessions: false` sulla collection `users` (compatibilità SSO con `disableLocalStrategy`).

## Cosa non fa

- Non sostituisce l’SSO per l’uso quotidiano del team Admin su dominio Workspace.
- Non abilita login locale per utenti `admin` (non super-admin): guardrail invariati.
- **Lacuna preesistente (non in scope 2.7/2.8)**: nessun rate-limiting o lockout dedicato su `/admin/login/local` — da valutare in un passaggio sicurezza separato se necessario.
- **Lacuna documentata (2026-10-03)**: rotazione password bootstrap — vedi sezione «Rotazione password bootstrap» sopra.
