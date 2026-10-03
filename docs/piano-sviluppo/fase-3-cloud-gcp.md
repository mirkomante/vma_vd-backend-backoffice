---
stato: validato
---
> **Nota locale di progetto**: questo file copre solo l'hosting del backend Payload/backoffice
> ((payload) + (app)), su Cloud Run. I siti esterni pubblici (vietnamonamour.com,
> villadoree.com, menu.vietnamonamour.com) usano **Firebase Hosting**, non Cloud Run — decisione
> già presa in `ADR-105-strategia-rendering-comunicazione-siti-esterni.md` (ISR on-demand,
> rebuild manuale via Cloud Build). Le due cose convivono nello stesso progetto GCP senza
> conflitto: hosting diverso per parti diverse dell'architettura a 4 aree.


# Fase 3 — Variante ambiente cloud: Google Cloud Run

> Istruzioni operative per la sottofase **3.2 (Parte B — Secret Manager e Parte C — configurazione/deploy Cloud Run)** di `fase-3-deploy.md`, oltre ad alcuni dettagli cloud-specifici di 3.4 e 3.5. Da allegare insieme a `fase-3-deploy.md` nella chat dedicata a quella sottofase. Vedi anche `stack/01b-cloud-gcp.mdc` nel catalogo regole per le convenzioni architetturali che questa variante rispetta.

---

## 3.2 Parte B — Secret Manager (umano, dipende da 3.1)

**Checklist per l'umano** (console GCP, manuale — non scriptato, coerente con la frequenza molto bassa di questa operazione):
- [x] Creare un secret per ciascuna credenziale necessaria: connection string database (§ 3.1), secret applicativo (stringa random nuova, es. `openssl rand -base64 32` — **non riusare quello di sviluppo**), credenziali del provider auth **dedicate alla produzione** (Client ID/Secret nuovi, non quelli di sviluppo — stesso progetto/organizzazione, credenziali separate), credenziali del provider email, credenziali del seed super-admin di bootstrap.
- [x] Variabili non-secret (es. l'indirizzo mittente email di produzione, l'URL pubblico) **non vanno nel gestore di secret** — sono variabili d'ambiente normali sul servizio Cloud Run.
- [x] IAM: assegnare `roles/secretmanager.secretAccessor` al service account runtime **solo sui secret specifici di questo progetto**, non a livello di intero progetto GCP — evita che il servizio possa leggere secret futuri non pertinenti.

---

## 3.2 Parte C — Configurazione e deploy Cloud Run (umano, dipende da Parte A + Parte B)

**Checklist per l'umano**:
- [x] Creare un **service account dedicato** al servizio (non il default Compute Engine), con solo `secretAccessor` sui secret di cui sopra (`vma-vd-backoffice-run@…`).
- [x] Configurare il servizio:
  - Region allineata al database di produzione (§ 3.1).
  - CPU allocation: "CPU allocata solo durante l'elaborazione delle richieste" (default), a meno che il progetto richieda job in background/cron.
  - Scaling: minimo **0** istanze (scale-to-zero, accettato il piccolo ritardo da cold start) — massimo basso (es. 4) come tetto di contenimento costi, regolabile in seguito.
  - Risorse: partire da una configurazione minima (es. 1 vCPU / 512 MiB), regolabile senza impatto architetturale se emergessero problemi di memoria nei log.
  - Collegare tutti i secret come variabili d'ambiente da Secret Manager (mapping diretto "un secret → una env var"); impostare le variabili non-secret (indirizzo mittente email, ecc.); lasciare la variabile URL pubblico vuota/placeholder per ora — va impostata in § 3.3, dopo aver ottenuto l'URL assegnato.
- [x] **Modalità di deploy**: pipeline automatica via wizard nativo Cloud Run — "Continuously deploy from a repository", non comando manuale `gcloud run deploy`. Collegare il repository GitHub, branch di trigger `main`. Il wizard crea in autonomia il trigger Cloud Build corrispondente.
- [x] **IAM per il deploy**: il service account del **trigger** Cloud Build (`…-compute@developer…` in questo progetto) con `roles/run.admin` + `roles/iam.serviceAccountUser` sul runtime SA + Artifact Registry Writer — esegue build/deploy, **non** il runtime SA.
- [x] **Rollback**: comportamento nativo di Cloud Run (revision precedenti sempre disponibili, attivabili con `gcloud run services update-traffic --to-revisions=REVISION=100`) — nessuna procedura custom da preparare.
- [x] Verificare con un push su `main` che il trigger si attivi, la build parta, e il servizio risponda su una richiesta di base (es. `/`) — OK 2026-10-03.

**Attenzione — errore comune di build**: se la build fallisce durante il prerendering di una route protetta che chiama il database (nessun DB disponibile nel container di build), forzare il rendering dinamico su quella route/layout (`export const dynamic = 'force-dynamic'`).

**Attenzione — errore comune con `sharp`**: se il pacchetto `sharp`/`@img/sharp-libvips-*` non viene trovato a runtime nell'immagine standalone Next.js, verificare `outputFileTracingIncludes` in `next.config.ts` per assicurarsi che il pacchetto nativo sia incluso mantenendo la struttura di cartelle attesa dal binario — copie manuali nel Dockerfile tendono a rompere il path/RPATH atteso dal binario nativo.

### Errori comuni — deploy continuo (GitHub / Developer Connect)

Da non confondere con errori di runtime (secret, DB): questi bloccano **Cloud Build** prima o durante il deploy.

| Sintomo | Causa tipica | Fix |
|--------|--------------|-----|
| `Dockerfile: no such file or directory` | `main` senza Parte A committata | Push con `Dockerfile` + `.dockerignore` |
| `artifactregistry…downloadArtifacts` denied | SA **build** senza Writer sul repo `cloud-run-source-deploy` | `roles/artifactregistry.writer` sul SA del trigger |
| `run.services.get` denied, `authenticated as …-run@…` | Step `gcloud run update` con **runtime SA** invece del SA **build** | Allineare `serviceAccount` nella config build al SA build; runtime SA solo in Cloud Run → Sicurezza. **Non** dare Run Admin al runtime SA. |
| Retry build dopo fix IAM/trigger | Retry riusa config vecchia | **Nuova** build: Run trigger o nuovo push |

**Due SA obbligatori:** (1) build/deploy — Compute default o `@cloudbuild.gserviceaccount.com`; (2) runtime — SA dedicato con Cloud SQL Client + Secret Accessor per-secret. **Non** usare `roles/editor` sul SA build come scorciatoia.

**Validazione:** in una build nuova, nel log deploy verificare `authenticated as` = SA build. Riferimento progetto: `docs/operativo/cloud-run-produzione.md`.

---

## 3.4 (parte cloud) — Perché il seed va eseguito da locale

Ad integrazione della checklist generica in `fase-3-deploy.md` § 3.4: Cloud Run **Services** non espone accesso shell/console alle istanze in esecuzione. Un **Cloud Run Job** dedicato risolverebbe il problema, ma introdurrebbe una risorsa infrastrutturale permanente da mantenere solo per un'operazione una tantum — sproporzionato per questo scenario. Da qui la scelta di eseguire il seed da locale, puntato temporaneamente al database di produzione (vedi checklist generica).

---

## 3.5 (parte cloud) — Logging

Ad integrazione della checklist generica in `fase-3-deploy.md` § 3.5: **Cloud Logging** funziona senza configurazione aggiuntiva — i log applicativi (incluso `activityLog`, se scritto anche su stdout/log strutturato) sono visibili nativamente. I log delle richieste HTTP (`run.googleapis.com/requests`) mostrano severity WARNING per risposte 4xx — comportamento corretto e atteso, non un errore da correggere.

---

Al termine, torna a `fase-3-deploy.md` e prosegui con le sottofasi successive.
