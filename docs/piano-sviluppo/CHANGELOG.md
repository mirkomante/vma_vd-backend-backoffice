# Changelog

Tutte le modifiche rilevanti a questo progetto sono documentate in questo file.

Formato basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/). Versionamento semplificato legato alle fasi del progetto, non SemVer in senso stretto:
- **MINOR** (0.X.0): chiusura di una fase.
- **PATCH** (0.0.X): correzioni o modifiche minori dentro una fase già in corso.

Ogni voce sotto `[Unreleased]` va aggiunta prima di ogni commit (vedi `core/04-changelog-commit.mdc`), non a posteriori. Quando tutte le sottofasi di una fase risultano ✅, la sezione `[Unreleased]` va convertita nella versione corrispondente.

## [Unreleased]

### Added

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

- Fase 1.5: verifica su filesystem (non runtime — quella è 1.6): presenti `app/(payload)/`, `app/(app)/app/page.tsx`, `app/(frontend)/page.tsx`; unico `package.json` in root; `rg` su CORS/`SameSite`/`Bearer` solo in documentazione (divieto esplicito), non in codice. README non cita più `app/page.tsx`.
- Fase 1.4: `pnpm run build` OK (route statica `/app` presente); `pnpm exec tsc --noEmit` OK dopo tipizzazione layout `(app)`.
- Fase 1.3: `pg_isready` su `127.0.0.1:5432` OK (PostgreSQL 18.3 Homebrew); `psql "$DATABASE_URL"` connette come `vma_vd_app` su `vma_vd_dev`. Dev server già in ascolto: `GET /admin` → 200, nel browser reindirizza a `/admin/create-first-user` (Welcome / Create first user); `GET /api/users` → 403 (accesso negato da non autenticato, atteso); dopo l'avvio `\dt` elenca 8 tabelle Payload, `payload_migrations` contiene la riga `dev` (batch -1, tipica di `push`). `POST /api/graphql` → 500 per race ESM su `graphql@17` (`ERR_INTERNAL_ASSERTION` / modulo non ancora caricato): non è un errore di connessione al database, non bloccante per 1.3.
- Fase 1.2: `pnpm run generate:importmap` e `generate:types` OK (variabili d'ambiente placeholder in shell, senza `.env` locale); `pnpm exec tsc --noEmit`, `pnpm lint` e `pnpm run build` senza errori (route `/admin`, `/api/*` presenti). Avvio dev con PostgreSQL reale non verificato qui (sottofase 1.3).
- Fase 1.1: `pnpm dev` — server pronto su `http://localhost:3000`, `GET /` → 200; `pnpm exec tsc --noEmit` senza errori.
