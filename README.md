# VMA / Villa Dorée — backend e backoffice

Un solo progetto Next.js (App Router) con PayloadCMS v3. Stessa origine, stesso server, stesso build: nessuna configurazione CORS, nessun secondo deploy, nessun token Bearer per parlare col CMS.

Package manager: **pnpm**.

## Dove si trova cosa

La cartella di progetto `app/` è l'App Router di Next.js. **Non** coincide con il path URL `/app` (Area App).

| URL pubblica | Cosa | Cartella (route group) |
|---|---|---|
| `/` | Sito vetrina, pubblico | `app/(frontend)/` |
| `/app` | Area App (utenti autenticati) | `app/(app)/` → pagina in `app/(app)/app/page.tsx` |
| `/admin` | Area Admin Payload | `app/(payload)/` (auto-generato, non modificare a mano) |

Il layout in `app/layout.tsx` è pass-through (solo `children`): ogni route group gestisce il proprio `html`/`body`.

Altri file utili:

- `payload.config.ts` — configurazione Payload (adapter PostgreSQL su `DATABASE_URL`)
- `docs/piano-sviluppo/` — piano di sviluppo e stato delle fasi

## Avvio locale

1. Copiare `.env.example` in `.env` e valorizzare `PAYLOAD_SECRET` e `DATABASE_URL` (PostgreSQL locale, non produzione).
2. `pnpm install`
3. `pnpm dev`
4. Aprire [http://localhost:3000](http://localhost:3000) (vetrina), [http://localhost:3000/app](http://localhost:3000/app) (Area App), [http://localhost:3000/admin](http://localhost:3000/admin) (Admin).

Per autenticarsi in Admin prima del login SSO: valorizzare `SEED_SUPERADMIN_EMAIL` e `SEED_SUPERADMIN_PASSWORD` in `.env`, poi `pnpm seed:super-admin`. Lo script è idempotente sulla stessa email. Finché la route di emergenza (sottofase 2.7) non esiste, il form nativo di `/admin/login` accetta quelle credenziali.

I domini Google Workspace ammessi al login SSO si gestiscono in Admin → **Identità autorizzate** (Global `settings`). Serve almeno un dominio: il salvataggio con lista vuota è bloccato. Solo un super-admin può modificare l’elenco.
