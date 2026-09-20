# Changelog

Tutte le modifiche rilevanti a questo progetto sono documentate in questo file.

Formato basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/). Versionamento semplificato legato alle fasi del progetto, non SemVer in senso stretto:
- **MINOR** (0.X.0): chiusura di una fase.
- **PATCH** (0.0.X): correzioni o modifiche minori dentro una fase già in corso.

Ogni voce sotto `[Unreleased]` va aggiunta prima di ogni commit (vedi `core/04-changelog-commit.mdc`), non a posteriori. Quando tutte le sottofasi di una fase risultano ✅, la sezione `[Unreleased]` va convertita nella versione corrispondente.

## [Unreleased]

### Changed

- Fase 2.1 / 2.6 / 2.7 / 2.8 (sessione 2026-09-20, commit unico): allineamento ADR-004 completo su `users` (default `active`/`emailVerified` false, matrice CRUD in `access.create`/`update`/`delete`, `passwordConfirm` virtual, UX form Admin); ridisegno credenziali bootstrap super-admin (`bootstrapCredentialHash`/`Salt`, `loginMethod: sso`, route `/admin/login/local`, migrazione legacy); `AppLocalPasswordField` al posto di `PasswordField` nativo con `disableLocalStrategy`; propagazione token attivazione email via `req.context` (`activationContext.ts`) perché `emailVerificationToken` con field access negato non compare nel `doc` di `afterChange`. **Deviazione (PasswordField) — Ufficiale**: diagnosi richiesta «solo diagnosi, non correggere ancora nulla». **Percepito**: fix applicato subito, comunicato a lavoro fatto. **Osservato**: create/edit Admin ok, e2e attivazione (form Admin → mail → verify → login App) ok in dev.
- Sincronizzate regole email dal catalogo prima di 2.6: `01-email-invarianti.mdc`, `01a-resend.mdc` (cursor-rules@a5c1b68), `fase-2-email-resend.md` (cursor-payload-template@e9bb93b) — scelta esplicita sandbox vs sottodominio verificato, invariante deliverability da chiudere in Fase 3.

### Fixed

- Fase 2.6 / email attivazione App locale non partiva: `emailVerificationToken` ha `access.read: false` quindi assente nel `doc` di `afterChange`; token passato via `req.context.pendingActivationToken` (`prepareActivationBeforeChange` → `sendActivationAfterChange`, helper `activationContext.ts`) senza allentare l’access sul campo.
- Fase 2.6 / Admin create utente App locale: crash browser `Cannot destructure property 'config'` su form-state quando comparivano i campi password — causa `PasswordField` nativo con `disableLocalStrategy`; sostituito con `AppLocalPasswordField` custom.

### Tests

- Fase 2.6 e2e attivazione (dev, 2026-09-20): create utente App locale da Admin → `POST /api/users` 201; link `/app/login/verify?token=…` 200; login `/api/users/login/app` 302 e `/app` 200 (verifica umana + log server).
- Fase 2.1/2.6 Admin create utente (dev, verifica umana 2026-09-20): nessun crash al passaggio Login Method → locale; compaiono password + conferma (una volta ciascuna); checkbox Active solo dopo assegnazione di un ruolo Admin o App.
- Fase 2.1 ADR-004 CRUD (dev, 2026-09-20): Local API con `overrideAccess: false` — matrice permessi admin/super-admin; REST e form Admin coerenti.

### Added

- Script `pnpm migrate:bootstrap-credentials` (`scripts/migrate-bootstrap-credentials.ts`) per super-admin legacy (`loginMethod` locale + hash/salt standard → campi bootstrap + `loginMethod: sso`).
- Fase 2.9: collection `activity-log` e log eventi auth — schema in `collections/ActivityLog.ts`, scrittura in `lib/activityLog/logActivity.ts`, hook `afterLogin`/`afterLogout` su `users`; `accessDenied` quando l’utente è censito (callback OAuth e login locale Admin); campi `collection`/`documentId` solo in schema, senza hook CRUD su altre collection.
- Fase 2.7: login locale di emergenza Admin — hook `beforeChange` per hashing PBKDF2-SHA256 (`lib/auth/localCredentials/`), endpoint `POST /api/users/login/local` (cookie Payload + hook `afterLogin` espliciti), pagina non linkata `/admin/login/local`, `useSessions: false` su `users`; nota operativa `docs/operativo/login-locale-emergenza-admin.md`. Debito 2.8 punto 2 (hook hashing) chiuso.
- Fase 2.4 / 2.5: integrazione Google OAuth con `payload-oauth2` — istanze isolate `google-admin` e `google-app` (path authorize/callback distinti); validazione server del claim `hd` contro Global `settings`; `getUserInfo` limitato a `email`/`sub`; whitelist-per-record (`onUserNotFoundBehavior: error`); callback custom con `jwtSign` Payload; Admin `/admin/login` solo bottone Google (`disableLocalStrategy` + componente `beforeLogin`); pagina App `/app/login` con link all’istanza App; messaggio di rifiuto generico condiviso (`lib/auth/loginMessages.ts`).
- Fase 2.3: setup credenziali Google OAuth di sviluppo — variabili `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_URL` documentate in `.env.example` (valori reali solo in `.env`); nota operativa `docs/operativo/credenziali-google-oauth.md` (console GCP, redirect locali `google-admin` / `google-app`, dev vs produzione Fase 3); checklist variante auth allineata.
- Fase 2.2: Global Payload `settings` (`globals/Settings.ts`, etichetta Admin «Identità autorizzate») con array `allowedDomains` (`domain`, `allowAdmin`, `allowApp`). Hook `beforeValidate` in `lib/auth/allowedDomains.ts`: trim, lowercase, formato FQDN, prevenzione duplicati, rifiuto se la lista risultasse vuota (vincolo rimandato da 2.8). Scrittura solo super-admin.
- Fase 2.8: script `pnpm seed:super-admin` (`scripts/seed-super-admin.ts`) che crea un super-admin locale da `SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_PASSWORD` (nessuna credenziale in codice); idempotente se l'email è già un super-admin locale attivo. Guardrail applicativo: non si può eliminare, disattivare, declassare o passare a solo-SSO l'ultimo super-admin locale. Access control in create: un Admin di pannello non può nascere con metodo locale o password; hook `assertLocalPasswordAllowed` completato anche per `loginMethod` locale su Admin.
- Fase 2.1: collection Payload `users` con auth nativa, ruoli `adminRole`/`appRole`, `loginMethod`, `active`; accesso pannello Admin per admin/super-admin; policy password di catalogo e guardrail password locale parziale; stub `canAccessSection` per sezioni Area App future.

### Fixed

- Fase 2.9: messaggio generico di rifiuto login (`GENERIC_LOGIN_FAILURE_MESSAGE`) — rimosso il riferimento alle «credenziali», fuorviante su SSO quando l’utente è censito ma non autorizzato o non abilitato; resta un unico testo per tutti i fallimenti (invariante auth).
- Fase 2.7: login locale Admin falliva sempre — gli endpoint custom sulla collection non passano da `wrapInternalEndpoints`, quindi il body JSON non veniva parsato in `req.data`; aggiunto `addDataAndFileToRequest` all’handler `POST /api/users/login/local`.
- Fase 2.7: form emergenza mostrava sempre errore nonostante credenziali corrette — `fetch(..., { redirect: 'manual' })` espone redirect come status `0` (opaque), interpretato come fallimento; sostituito con form HTML `POST` (redirect 302 nativo del browser) e parsing `application/x-www-form-urlencoded` sull’endpoint.

### Changed

- Fase 2.2/2.8 riaperte (✅ → 🔶) a seguito di correzione di catalogo (2026-09-20), tre problemi distinti: (1) l'allow-list del Global `settings` non ha mai avuto un dominio popolato — meccanismo e guardrail esistono, il dato reale no; (2) l'email del seed super-admin (`SEED_SUPERADMIN_EMAIL`) è un account Gmail personale, non del dominio Workspace `vietnamonamour.com` — non potrà autenticarsi via SSO data la policy di dominio ristretto; decisione presa di tenere due identità separate (Gmail per l'emergenza locale, un secondo utente Workspace da creare per il test SSO); (3) `disableLocalStrategy: { enableFields: true }` in `collections/Users.ts` (2.4) blocca l'operazione di login nativa Payload per l'intera collection `users`, non solo per l'Area Admin — 2.6 e 2.7, ancora da fare, non potranno usare la strategia nativa Payload come previsto dal template originale; serve un endpoint custom con hashing manuale e richiamo esplicito degli hook `afterLogin`/`afterLogout` (altrimenti `activityLog`, 2.9, resta silenziosamente incompleto). Verificato via ispezione diretta del DB: il record del super-admin esistente ha comunque `hash`/`salt` validi, riusabile senza rigenerazione. Pattern di correzione completo in `payload-pattern/04-auth-locale-con-sso-esclusivo.mdc` (nuovo file di catalogo, `stato: bozza`). Dettaglio per sottofase in `fase-2-login.md`, note di debito su 2.2 e 2.8.
- Fase 2.2, nome e accesso. **Ufficiale**: Global «Settings o equivalente»; scrittura solo super-admin; lettura non specificata. **Percepito**: slug `settings` (catalogo); etichetta Admin «Identità autorizzate» per non sovrapporsi ai Global `impostazioni-*` di dominio; lettura per staff Admin, come la collection `users`. **Osservato**: così in `globals/Settings.ts`.
- Fase 2.2, flag per area. **Ufficiale**: sotto-campi `allowAdmin`/`allowApp`. **Percepito**: default `false` (fail-closed: un dominio in lista non abilita un’area finché il flag non è esplicito). **Osservato**: checkbox con `defaultValue: false`.
- Fase 2.8, chiusura sessione — vincolo allow-list vuota. **Ufficiale**: 2.8 chiedeva anche «non è possibile salvare l'allow-list se risulterebbe vuota». **Percepito** (dichiarato in chat prima dell'implementazione): scelta **(b)** rimandare quel singolo vincolo, senza creare ora uno schema minimo della Global Settings (2.2 non ancora eseguita, sequenza pratica 2.8 dopo 2.1). **Osservato**: implementato in 2.2 insieme allo schema (`prepareAllowedDomains`); 2.8 non ha più debito pendente su questo punto.
- Fase 2.8, ultimo super-admin. **Ufficiale**: bloccare eliminazione e `active = false`. **Percepito**: estendere a declassamento `adminRole` e passaggio a `loginMethod: sso`, altrimenti il vincolo è aggirabile senza cancellare il record. **Osservato**: `assertNotLastLocalSuperAdmin` rifiuta tutte e quattro le operazioni se non resta un altro super-admin locale attivo.
- Note di chiusura Fase 1: conferma umana che Area App e Area Admin si avviano senza errori bloccanti; nessun utente Payload creato (atteso). Push del commit 1.7 (`f98a812`) verificato su `origin/main`.

### Tests

- Fase 2.7/2.8 (ridisegno bootstrap, 2026-09-20): `tsc`/`lint` OK; migrazione dev 1 record; `POST /api/users/login/local` con password seed → 302 `/admin`; password errata e email inesistente → stesso redirect `?authFailed=1`; `GET /api/users/1` autenticato super-admin senza campi `bootstrapCredential*` in JSON. Guardrail validazione super-admin+`loginMethod: local` non coperto da script automatico — comportamento atteso da hook `beforeValidate`. Rate-limit route emergenza: non testato (non implementato).
- Fase 2.2 / 2.8 (dati) / 2.4 (Admin): conferma umana (2026-09-20) — allow-list con `vietnamonamour.com`, utente Workspace censito in `users` (solo SSO), login Google su `/admin/login` → `/admin` OK. Debiti manuali 2.2 e 2.8.1 chiusi.
- Fase 2.7: conferma umana — login locale su `/admin/login/local` OK, messaggio generico su fallimento OK, `/admin/login` resta solo Google. Record `activityLog` (`method: local`) ancora non verificabile: collection 2.9 assente. Validazione codice: `tsc`/`lint` OK (sessione implementazione).
- Fase 2.5: conferma umana (2026-09-20) — login Google su `/app/login` → redirect `/app` OK (istanza `google-app`, claim `hd` dominio Workspace).
- Fase 2.4 / 2.5: `pnpm exec tsc --noEmit`, `pnpm lint` e `pnpm generate:importmap` senza errori. Spike e2e completo (2.10) ancora da fare.
- Fase 2.3: verifica agente che `.env` locale valorizza le tre variabili OAuth (senza committare segreti); nessun test runtime OAuth fino a 2.4. Conferma umana: client GCP e `.env` completati.
- Fase 2.2: `pnpm run generate:types`, `pnpm exec tsc --noEmit` e `pnpm lint` senza errori. Runtime Admin (salvataggio lista vuota / dominio non valido / duplicato / permesso admin vs super-admin) da verificare con l’umano.
- Fase 2.8: `pnpm exec tsc --noEmit` e `pnpm lint` senza errori. `pnpm seed:super-admin` senza credenziali in env → messaggio `SEED_SUPERADMIN_EMAIL mancante o vuota` (exit 1 dopo correzione del top-level await: `payload run` altrimenti non attendeva lo script e usciva 0). Conferma umana: test runtime ok (seed + accesso Admin). Guardrail allow-list vuota non testabile in 2.8: Global assente per scelta (b); coperto in 2.2.
- Fase 2.1: `pnpm run generate:types`, `pnpm exec tsc --noEmit` e `pnpm lint` senza errori (warning stub risolto).
- Conferma umana + controllo spot: `GET /`, `/app`, `/admin` → 200 su `http://localhost:3000`. `git status` allineato a `origin/main` sul commit 1.7.

## [0.1.0] — 2026-09-15

Chiusura Fase 1 (setup progetto).

### Added

- Fase 1.7: verifica di chiusura Fase 1. Commit 1.1–1.6 presenti su `main` (`b29be1f`…`ba49241`); `.gitignore` esclude `.env`, `node_modules` e cartelle di build; nessuno dei commit della fase contiene `PAYLOAD_SECRET` valorizzato o credenziali database (`.env` mai tracciato; `.env.example` solo placeholder). I commit 1.1–1.6 erano già su `origin/main`; il push di questo commit di chiusura resta manuale.
- Fase 1.6: avvio locale verificato end-to-end su `http://localhost:3000`. `/` (vetrina), `/app` (placeholder Tailwind) e `/admin` (pannello Payload, redirect a `/admin/create-first-user`) raggiungibili. Warning non bloccanti annotati: email adapter assente (Fase 2), esperimento Turbopack `turbopackServerFastRefresh`, race ESM GraphQL già vista in 1.3 e non riprodotta in questo passaggio.
- Fase 1.5: verificata la struttura a tre route group (`app/(payload)/`, `app/(app)/`, `app/(frontend)/`) in un solo progetto Next.js+Payload (un `package.json`, nessun CORS). README di progetto sostituito al template `create-next-app` con mappa URL ↔ cartelle (`/` vetrina, `/app` Area App, `/admin` Payload) e avvio `pnpm`; commenti di disambiguazione cartella `app/` vs path URL `/app`.
- Fase 1.4: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/postcss`, `postcss.config.mjs`); `@import` / `@source` in `app/globals.css` per `app/(app)/**` e futura cartella `components/**`, senza scan di `(payload)`. Route group `(app)` con layout dedicato e placeholder `/app` con classi Tailwind di prova; nessuna libreria UI aggiuntiva (shadcn/ui in fasi successive).
- Fase 1.3: connessione PostgreSQL locale verificata. `DATABASE_URL` in `.env` (non committata) punta a `vma_vd_dev` su `127.0.0.1:5432`; `.env.example` aggiornato con commento esplicito sviluppo locale vs produzione (Fase 3). Adapter `postgresAdapter` e `push` solo in non-production già presenti da 1.2; Payload `3.89.0` (>= 3.73.0, CVE-2026-25544). All'avvio `push` ha creato le tabelle di sistema Payload (`payload_kv`, `payload_locked_documents`, `payload_preferences`, `payload_migrations`, `users` di default del CMS). Migrazioni `payload migrate` non generate: previste prima della Fase 3.
- Fase 1.2: Payload CMS v3.89.0 integrato nel progetto Next.js esistente (percorso manuale da documentazione ufficiale + file route del template blank): dipendenze `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `sharp`, `graphql`; route group `app/(payload)/` (admin, REST, GraphQL); `payload.config.ts` con `postgresAdapter` su `DATABASE_URL`, `collections: []`, secret da `PAYLOAD_SECRET`; `next.config.ts` con `withPayload`; alias `@payload-config`; script `payload` / `generate:importmap` / `generate:types`; `.env.example` (placeholder, committabile); layout root pass-through e vetrina spostata in `app/(frontend)/` per compatibilità Payload.
- Fase 1.1: progetto Next.js (App Router, TypeScript strict, pnpm) inizializzato nella root del repo con `create-next-app` (`--no-tailwind`, nessun Payload). Stack scaffold: Next.js 16.3.5, React 19.2.8; `packageManager` impostato a `pnpm@11.18.0`.

### Changed

- `fase-1-db-postgres.md`: checkbox della variante 1.3 allineate allo stato già chiuso in `fase-1-setup.md` (nessun cambio di configurazione database).
- `.gitignore`: esclusione esplicita di `.env` / `.env.*` (con eccezione `!.env.example`), artefatti macOS/Windows, build, log e file di segreti generici; `pnpm-workspace.yaml` con build script approvati per `sharp`/`esbuild`.
- Rinumerati i 9 ADR di progetto da `ADR-001`...`ADR-009` a `ADR-101`...`ADR-109` per eliminare la collisione di numerazione con le ADR di catalogo (`ADR-001-schema-ruoli-baseline.md`, `ADR-002-isolamento-istanze-sso.md`, `ADR-003-login-locale-app-default.md`, citate in `fase-2-login.md`). Rename puro: nessun contenuto decisionale modificato, nessuno stato cambiato (tutti restano `accettata`). Aggiornati i riferimenti incrociati in tutti i 9 file ADR, in `piano.yaml` (campi `file:` e note), in `.cursor/rules/core/01-proporzionalita.mdc` e in `fase-3-cloud-gcp.md`. `fase-2-login.md` non modificato (resta la versione di catalogo, non più ambigua con la nuova numerazione).

### Fixed

- Rimossa da `ADR-102-divisione-area-di-gestione.md` §5 una nota di disambiguazione testuale (catalogo vs progetto) resa superflua dalla rinumerazione sopra.


### Tests

- Fase 1.7: `git log` conferma i sei commit 1.1–1.6; `git check-ignore` su `.env`, `node_modules`, `.next`, `out`, `build`, `dist`; `git ls-files` / `git log -- .env` vuoti (`.env` mai tracciato); `git grep` su connection string reali e pattern di chiavi private: nessun match nei file tracciati. `HEAD` coincideva con `origin/main` prima di questo commit. Controllo spot sul `pnpm dev` già in ascolto: `GET /`, `/app`, `/admin` → 200 (non è un riavvio a freddo).
- Fase 1.6: `pnpm dev` già in ascolto; browser su `http://localhost:3000`: `GET /` 200 (vetrina Next.js), `GET /app` 200 con `bg-emerald-600` applicato (testo bianco, `border-radius` 8px sul badge), `GET /admin` 200 → redirect a `/admin/create-first-user` (Welcome / Create first user). `GET /api/users/me` 200 durante il redirect Admin. GraphQL 500 della 1.3 non riprodotto in questo passaggio.
- Fase 1.5: verifica su filesystem (non runtime — quella è 1.6): presenti `app/(payload)/`, `app/(app)/app/page.tsx`, `app/(frontend)/page.tsx`; unico `package.json` in root; `rg` su CORS/`SameSite`/`Bearer` solo in documentazione (divieto esplicito), non in codice. README non cita più `app/page.tsx`.
- Fase 1.4: `pnpm run build` OK (route statica `/app` presente); `pnpm exec tsc --noEmit` OK dopo tipizzazione layout `(app)`.
- Fase 1.3: `pg_isready` su `127.0.0.1:5432` OK (PostgreSQL 18.3 Homebrew); `psql "$DATABASE_URL"` connette come `vma_vd_app` su `vma_vd_dev`. Dev server già in ascolto: `GET /admin` → 200, nel browser reindirizza a `/admin/create-first-user` (Welcome / Create first user); `GET /api/users` → 403 (accesso negato da non autenticato, atteso); dopo l'avvio `\dt` elenca 8 tabelle Payload, `payload_migrations` contiene la riga `dev` (batch -1, tipica di `push`). `POST /api/graphql` → 500 per race ESM su `graphql@17` (`ERR_INTERNAL_ASSERTION` / modulo non ancora caricato): non è un errore di connessione al database, non bloccante per 1.3.
- Fase 1.2: `pnpm run generate:importmap` e `generate:types` OK (variabili d'ambiente placeholder in shell, senza `.env` locale); `pnpm exec tsc --noEmit`, `pnpm lint` e `pnpm run build` senza errori (route `/admin`, `/api/*` presenti). Avvio dev con PostgreSQL reale non verificato qui (sottofase 1.3).
- Fase 1.1: `pnpm dev` — server pronto su `http://localhost:3000`, `GET /` → 200; `pnpm exec tsc --noEmit` senza errori.
