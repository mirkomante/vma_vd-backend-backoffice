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

- Secret montati a runtime: `DATABASE_URL`, `PAYLOAD_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY` (seed opzionale, di solito non montato sul servizio).
- Env plain: `RESEND_FROM_ADDRESS`, `RESEND_FROM_NAME`, `NEXT_PUBLIC_URL` (URL HTTPS Cloud Run — allineamento OAuth in § 3.3).

Formato `DATABASE_URL` su Cloud Run: vedi `docs/operativo/cloud-sql-produzione.md`.

## Errori incontrati in Fase 3.2 (e fix)

1. **`Dockerfile` not found** — push su `main` senza commit Parte A (`bc4a190`+).
2. **Artifact Registry `downloadArtifacts` denied** — Writer sul SA di **build**, repo `europe-west1` / `cloud-run-source-deploy`.
3. **`run.services.get` denied**, `authenticated as vma-vd-backoffice-run` — lo step deploy usava il **runtime SA**; allineare `serviceAccount` nella config build al SA **build**; runtime SA resta solo su Cloud Run → Sicurezza.

Dettaglio checklist template: `docs/piano-sviluppo/fase-3-cloud-gcp.md` § «Errori comuni deploy continuo».
