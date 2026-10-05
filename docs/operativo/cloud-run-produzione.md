# Cloud Run di produzione — deploy e IAM

> Riferimento operativo Fase 3.2 (chiusa 2026-10-03: build Cloud Build + deploy servizio OK). Progetto `vma-vd`, regione `europe-west1`. Nessun segreto in questo file.

## Servizio

| Campo | Valore |
|--------|--------|
| Servizio Cloud Run | `vma-vd-backend-backoffice-git` (nome generato dal wizard deploy continuo) |
| Deploy | Trigger Cloud Build su branch `main`, `Dockerfile` in root repo |
| Porta container | `8080` |
| Runtime Node | 24 (`nodejs24`, immagine `node:24-alpine`) |

## Due service account (non mescolare)

| Ruolo | Service account | Permessi minimi |
|--------|-----------------|-----------------|
| **Build + deploy** (trigger Cloud Build) | `437074136999-compute@developer.gserviceaccount.com` | Artifact Registry Writer (repo `cloud-run-source-deploy`); Cloud Run Admin; Service Account User **su** runtime SA; Logs Writer; Developer Connect (se GitHub via Developer Connect). **Evitare** `roles/editor`. |
| **Runtime** (Sicurezza → account di servizio del servizio) | `vma-vd-backoffice-run@vma-vd.iam.gserviceaccount.com` | Cloud SQL Client; Secret Manager Secret Accessor **per singolo secret** (non a livello progetto). **Non** Run Admin, **non** Artifact Registry Writer. |

Service agent (Google-managed): `service-437074136999@gcp-sa-cloudbuild.iam.gserviceaccount.com` → `roles/developerconnect.tokenAccessor` sul progetto, se richiesto dalla console per GitHub.

**Verifica post-modifica trigger:** avviare una **nuova** build (Run trigger o push), non solo Retry. Nel log dello step `gcloud run services update`, la riga `authenticated as …` deve essere il SA **build**, non `vma-vd-backoffice-run`.

## Secret e env

- Secret montati a runtime: `DATABASE_URL`, `PAYLOAD_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY` (montato sul servizio, come le altre chiavi: conferma dell'umano del 2026-10-04, non verificata sul servizio).
- Env plain: `RESEND_FROM_ADDRESS`, `RESEND_FROM_NAME`, **`APP_PUBLIC_URL`** (URL HTTPS Cloud Run, senza slash finale). Dettaglio tecnico, cambio dominio e anti-pattern: **`docs/operativo/app-public-url.md`**.

## Connessioni al database

L'adapter Postgres (`payload.config.ts`, `pool.max: 3`) apre al massimo **3 connessioni per istanza** del container Cloud Run.

Il servizio è configurato con **`--max-instances` = 4** (conferma dell'umano del 2026-10-04): al picco, le connessioni dall'applicazione sono al massimo **4 × 3 = 12**. Devono restare sotto il `max_connections` dell'istanza Cloud SQL, lasciando margine per `scripts/prod-db.sh` e per le migrazioni eseguite da locale.

Sull'istanza **`db-f1-micro`** il `max_connections` predefinito è **25** (confermato in produzione con `SHOW max_connections;` dall'umano il 2026-10-05: **25**). Margine indicativo: 25 − 12 = **13** slot; di solito **3** sono riservati al superuser di PostgreSQL, quindi restano circa **10** per sessioni dal proxy Auth e migrazioni da locale.

Vedi **`ADR-110`** (pool di connessioni) nel piano di sviluppo.

## OAuth — redirect_uri localhost in produzione

Se Google segnala `redirect_uri=http://localhost:3000/...` da Cloud Run: vedi **`docs/operativo/app-public-url.md`** (immagine pre-fix con `NEXT_PUBLIC_*` al build, oppure manca `APP_PUBLIC_URL` sul servizio).

Formato `DATABASE_URL` su Cloud Run: vedi `docs/operativo/cloud-sql-produzione.md`.

## Cookie sessione (`payload-token`)

Payload legge `users.auth.cookies` (in questo progetto: `secure: true` se `NODE_ENV === 'production'`, `sameSite: Lax`). Senza `secure`, il cookie può risultare **HttpOnly** ma **senza flag Secure** in DevTools pur servendo su HTTPS — insufficiente per lo spike § 3.3. Dopo deploy, verificare in Application → Cookies dopo login SSO.

## Errori incontrati in Fase 3.2 (e fix)

1. **`Dockerfile` not found** — push su `main` senza commit Parte A (`bc4a190`+).
2. **Artifact Registry `downloadArtifacts` denied** — Writer sul SA di **build**, repo `europe-west1` / `cloud-run-source-deploy`.
3. **`run.services.get` denied**, `authenticated as vma-vd-backoffice-run` — lo step deploy usava il **runtime SA**; allineare `serviceAccount` nella config build al SA **build**; runtime SA resta solo su Cloud Run → Sicurezza.

Dettaglio checklist template: `docs/piano-sviluppo/fase-3-cloud-gcp.md` § «Errori comuni deploy continuo».
