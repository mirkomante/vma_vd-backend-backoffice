# Segnalazione catalogo — URL pubblico OAuth/email e build Docker (Next.js)

**Progetto:** `vma_vd-backend-backoffice`  
**Data:** 2026-10-03  
**Destinatario:** agente / maintainer del template (`cursor-payload-template`, fase deploy, Dockerfile, varianti auth/cloud).

---

## Sintomo in produzione (Fase 3.3)

Login Google su Cloud Run: errore Google **`400 redirect_uri_mismatch`**, dettaglio:

`redirect_uri=http://localhost:3000/api/users/oauth/google-admin/callback`

L’utente apriva l’app sull’URL HTTPS Cloud Run; l’app chiedeva a Google un redirect su **localhost**.

---

## Causa radice (non intuitiva)

1. Template / Dockerfile Parte A Fase 3.2 tipico:  
   `ENV NEXT_PUBLIC_URL=http://localhost:3000` (o placeholder) **prima** di `next build`.
2. Documentazione deploy che dice di impostare **`NEXT_PUBLIC_URL`** su Cloud Run a runtime.
3. **Next.js** inlined le variabili **`NEXT_PUBLIC_*` al build** nel bundle server e client.
4. OAuth redirect (`redirect_uri`) è calcolato lato server ma legge il valore **già inlined** → runtime env su Cloud Run **ignorata** per quella variabile.

Esito: configurazione Google Console corretta su `https://….run.app/...` non basta; l’app continua a inviare localhost.

---

## Fix adottato nel progetto reale (da generalizzare nel catalogo)

| Prima (problematico in Docker prod) | Dopo |
| ----------------------------------- | ---- |
| `NEXT_PUBLIC_URL` per OAuth + email server-side | **`APP_PUBLIC_URL`** (o nome **senza** prefisso `NEXT_PUBLIC_`) letta a runtime |
| `ENV NEXT_PUBLIC_URL=...` nel Dockerfile build | **Nessun** URL pubblico nel build; placeholder solo per DB/secret build-time |
| Checklist «imposta NEXT_PUBLIC_URL su Cloud Run» | Checklist «imposta **APP_PUBLIC_URL** su Cloud Run» + nota anti-`NEXT_PUBLIC_` al build |

Implementazione minima:

- Modulo condiviso `getAppPublicURL()` (server-only consumers: OAuth plugin, email adapter).
- Fallback dev: `NEXT_PUBLIC_URL` in `.env` locale **accettabile** (build dev non Docker prod).
- `.env.example`, `fase-3-deploy.md` § 3.2/3.3, `fase-3-auth-google-oauth.md`, operativo cloud: allineati su **`APP_PUBLIC_URL`**.

Commit di riferimento nel repo reale: `583eb24`.

---

## Cosa aggiornare nel template (checklist maintainer)

1. **`stack/01-stile-codice.mdc` / Dockerfile template**  
   - Non documentare `NEXT_PUBLIC_URL` obbligatoria al build per OAuth.  
   - Commento esplicito: URL OAuth/email server-side = env **runtime**, non `NEXT_PUBLIC_*` nel stage builder.

2. **`fase-3-deploy.md` § 3.2 Parte A**  
   - Sostituire voce «variabile canonica `NEXT_PUBLIC_URL`» con **`APP_PUBLIC_URL`** (runtime) + link a nota «Next inlines NEXT_PUBLIC at build».

3. **`fase-3-cloud-gcp.md` / operativo Cloud Run**  
   - Env plain: **`APP_PUBLIC_URL`**.  
   - Sezione troubleshooting: `redirect_uri=localhost` da Cloud Run → build inlined / manca APP_PUBLIC_URL.

4. **`fase-3-auth-google-oauth.md`**  
   - Redirect URI costruite con base da **`getAppPublicURL()`**, non da `NEXT_PUBLIC_URL` in container.

5. **Regola per agenti**  
   - Se OAuth/email usano l’URL **solo server-side**, **non** usare `NEXT_PUBLIC_` per quell’URL in progetti deployati via Docker — usare env runtime standard.

6. **Cambio dominio**  
   - Documentare: post-fix, cambio host = aggiornare env Cloud Run + Google redirect URI, **senza** rebuild obbligatorio solo per URL.

---

## Cosa **non** proporre come fix template

- Solo aggiungere redirect `localhost` sul client OAuth **prod** (maschera il sintomo).
- Solo `ARG NEXT_PUBLIC_URL` al build Docker come unica soluzione (funziona ma **rebuild** a ogni cambio dominio — peggiore di env runtime).
- Assumere che env Cloud Run risolva sempre variabili «pubbliche» Next — **falso** per `NEXT_PUBLIC_*` già presenti al build.

---

## Evidenza nel repo reale

- `docs/operativo/app-public-url.md`
- `lib/appPublicUrl.ts`
- `docs/operativo/cloud-run-produzione.md` § OAuth localhost

---

## Aggiunta correlata (stessa sessione prod) — cookie `Secure`

Spike § 3.3: in prod `payload-token` era **HttpOnly** ma **senza Secure** finché non si imposta esplicitamente `collection.auth.cookies.secure` (Payload default). Template deploy/auth: documentare `auth.cookies.secure` per `NODE_ENV === 'production'` (o equivalente) su collection `users`, non assumere che HTTPS Cloud Run lo imposti da solo.

---

## Voce changelog catalogo suggerita

> **Fixed (deploy/OAuth):** Document and template `APP_PUBLIC_URL` for server-side OAuth redirect and email links; do not rely on `NEXT_PUBLIC_*` in Docker build for Cloud Run — Next inlines at build time, causing `redirect_uri_mismatch` to localhost in production.
