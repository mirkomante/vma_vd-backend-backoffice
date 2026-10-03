---
stato: validato
---

# URL pubblico dell'app — `APP_PUBLIC_URL` (OAuth, email)

Nota operativa e tecnica. Copre il fix Fase 3.3 (2026-10-03, commit `583eb24`): OAuth Google in produzione non deve usare `NEXT_PUBLIC_*` nel build Docker.

## Problema emerso in produzione

- Su Cloud Run, Google OAuth rispondeva **`redirect_uri_mismatch`** con dettaglio  
  `redirect_uri=http://localhost:3000/api/users/oauth/google-admin/callback` anche aprendo l’app sull’URL HTTPS reale.
- Causa: nel `Dockerfile` fase **builder** c’era `ENV NEXT_PUBLIC_URL=http://localhost:3000` prima di `pnpm run build`.
- **Next.js** sostituisce al build ogni `process.env.NEXT_PUBLIC_*` con il valore letterale nel bundle (client **e** server). Le env impostate solo su Cloud Run **a runtime** non aggiornano quel valore → redirect OAuth restano su localhost.

## Cosa abbiamo fatto nel repo

OAuth e link email usano l’URL **solo lato server** (`lib/auth/googleOAuth/`, `lib/email/` — nessun componente client legge direttamente l’URL canonico).

1. Introdu **`APP_PUBLIC_URL`**, letta **a runtime** tramite `lib/appPublicUrl.ts` (`getAppPublicURL()`), **non** inlined al build.
2. In **sviluppo locale** resta valido il fallback **`NEXT_PUBLIC_URL`** nel `.env` (compatibilità con setup Fase 2).
3. Dal **`Dockerfile`** è stato rimosso il `NEXT_PUBLIC_URL` fisso al build (commento che rimanda a questa nota).
4. Consumatori:
   - `getGoogleOAuthServerURL()` → costruisce `redirect_uri` per Google (`lib/auth/googleOAuth/tokens.ts`);
   - `getPublicAppUrl()` → link nelle email transazionali.

Ordine di lettura in codice: `APP_PUBLIC_URL` → se assente, `NEXT_PUBLIC_URL`.

## Configurazione

| Ambiente | Dove | Variabile |
| -------- | ---- | --------- |
| Locale | `.env` | `APP_PUBLIC_URL=http://localhost:3000` (consigliato) oppure solo `NEXT_PUBLIC_URL` |
| Cloud Run | Env **plain** sul servizio (non Secret Manager obbligatorio) | **`APP_PUBLIC_URL`** = URL HTTPS assegnato ( **senza** slash finale ) |

Vedi anche: `docs/operativo/cloud-run-produzione.md`, `docs/operativo/credenziali-google-oauth.md`, `.env.example`.

## Cambio dominio / URL Cloud Run (dopo questo fix)

1. Aggiornare **`APP_PUBLIC_URL`** su Cloud Run (nuova revision del servizio).
2. Aggiornare **Authorized redirect URIs** e **JavaScript origins** sul client OAuth **produzione** in Google Cloud Console (stesso host).
3. **Non** è obbligatorio un rebuild dell’immagine **solo** per cambiare l’URL (a patto che l’immagine includa già il codice con `APP_PUBLIC_URL`).

Se l’immagine è ancora **pre-fix** (build con `NEXT_PUBLIC_URL=localhost` inlined), serve almeno **un** deploy con codice aggiornato; poi i cambi dominio sono solo env + Google Console.

## Anti-pattern da evitare

- Impostare solo `NEXT_PUBLIC_URL` su Cloud Run pensando che basti per OAuth in container Docker/Next — **non basta** se il nome variabile è `NEXT_PUBLIC_*` e il valore è stato fissato al build.
- Mettere l’URL di produzione nel `Dockerfile` al build — obbliga rebuild a ogni cambio host.
- Registrare redirect URI Google solo su localhost quando il login avviene su Cloud Run.

## Riferimenti codice

- `lib/appPublicUrl.ts`
- `lib/auth/googleOAuth/env.ts`, `lib/auth/googleOAuth/tokens.ts`
- `lib/email/env.ts`
- `Dockerfile` (stage `builder`)
