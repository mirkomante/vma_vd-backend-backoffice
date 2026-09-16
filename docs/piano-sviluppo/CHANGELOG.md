# Changelog

Tutte le modifiche rilevanti a questo progetto sono documentate in questo file.

Formato basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/). Versionamento semplificato legato alle fasi del progetto, non SemVer in senso stretto:
- **MINOR** (0.X.0): chiusura di una fase.
- **PATCH** (0.0.X): correzioni o modifiche minori dentro una fase già in corso.

Ogni voce sotto `[Unreleased]` va aggiunta prima di ogni commit (vedi `core/04-changelog-commit.mdc`), non a posteriori. Quando tutte le sottofasi di una fase risultano ✅, la sezione `[Unreleased]` va convertita nella versione corrispondente.

## [Unreleased]

### Added

- Fase 2.8: script `pnpm seed:super-admin` (`scripts/seed-super-admin.ts`) che crea un super-admin locale da `SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_PASSWORD` (nessuna credenziale in codice); idempotente se l'email è già un super-admin locale attivo. Guardrail applicativo: non si può eliminare, disattivare, declassare o passare a solo-SSO l'ultimo super-admin locale. Access control in create: un Admin di pannello non può nascere con metodo locale o password; hook `assertLocalPasswordAllowed` completato anche per `loginMethod` locale su Admin.
- Fase 2.1: collection Payload `users` con auth nativa, ruoli `adminRole`/`appRole`, `loginMethod`, `active`; accesso pannello Admin per admin/super-admin; policy password di catalogo e guardrail password locale parziale; stub `canAccessSection` per sezioni Area App future.

### Changed

- Fase 2.8, chiusura sessione — vincolo allow-list vuota. **Ufficiale**: 2.8 chiedeva anche «non è possibile salvare l'allow-list se risulterebbe vuota». **Percepito** (dichiarato in chat prima dell'implementazione): scelta **(b)** rimandare quel singolo vincolo, senza creare ora uno schema minimo della Global Settings (2.2 non ancora eseguita, sequenza pratica 2.8 dopo 2.1). **Osservato**: nessun Global Settings, nessun hook anti-lista-vuota; il debito è annotato in 2.2 e in 2.8 come pendente, da implementare insieme allo schema.
- Fase 2.8, ultimo super-admin. **Ufficiale**: bloccare eliminazione e `active = false`. **Percepito**: estendere a declassamento `adminRole` e passaggio a `loginMethod: sso`, altrimenti il vincolo è aggirabile senza cancellare il record. **Osservato**: `assertNotLastLocalSuperAdmin` rifiuta tutte e quattro le operazioni se non resta un altro super-admin locale attivo.
- Note di chiusura Fase 1: conferma umana che Area App e Area Admin si avviano senza errori bloccanti; nessun utente Payload creato (atteso). Push del commit 1.7 (`f98a812`) verificato su `origin/main`.

### Tests

- Fase 2.8: `pnpm exec tsc --noEmit` e `pnpm lint` senza errori. `pnpm seed:super-admin` senza credenziali in env → messaggio `SEED_SUPERADMIN_EMAIL mancante o vuota` (exit 1 dopo correzione del top-level await: `payload run` altrimenti non attendeva lo script e usciva 0). Conferma umana: test runtime ok (seed + accesso Admin). Guardrail allow-list vuota non testabile: Global assente per scelta (b).
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
