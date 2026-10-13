# GCP per menù e job schedulati — Scheduler, bucket e secret

> Riferimento operativo Fase 6.0 (eseguita il 2026-10-12). Progetto `vma-vd`, regione `europe-west1`. **Nessun segreto in questo file.**

Predispone le risorse usate da 6.4 (reset della disponibilità e `disponibilita.json`) e da 5.3 (anonimizzazione GDPR). **I job di Cloud Scheduler non sono creati qui**: li creano 6.4 e 5.3. Servizio e service account esistenti: `docs/operativo/cloud-run-produzione.md`.

## Risorse create

| Risorsa | Nome | Dettaglio |
|--------|------|-----------|
| API | `cloudscheduler.googleapis.com` | Abilitata il 2026-10-12. Già abilitate prima: `storage`, `secretmanager`, `iamcredentials` |
| Service account dello Scheduler | `vma-vd-scheduler@vma-vd.iam.gserviceaccount.com` | Nessun ruolo a livello di progetto |
| Bucket | `gs://vma-vd-menu-availability` | `EUROPE-WEST1`, accesso uniforme a livello di bucket, `public_access_prevention: inherited`, **nessun CORS** (rimandato a 6.9), cancellazione temporanea predefinita di 7 giorni (non modificata) |
| Secret della disponibilità | `scheduler-secret-availability` | Replica automatica (come `DATABASE_URL`); versione 1. Variabile `SCHEDULER_SECRET_AVAILABILITY` (montaggio sul servizio in 6.4) |
| Secret dell'anonimizzazione | `scheduler-secret-anonymization` | Replica automatica; versione 1. Variabile `SCHEDULER_SECRET_ANONYMIZATION` (montaggio sul servizio in 5.3) |

## Ruoli assegnati (e su cosa)

| Chi | Ruolo | Su quale risorsa |
|-----|-------|------------------|
| `vma-vd-scheduler@…` | `roles/run.invoker` | solo il servizio Cloud Run `vma-vd-backend-backoffice-git` |
| `allUsers` | `roles/storage.objectViewer` | solo il bucket `vma-vd-menu-availability` |
| `vma-vd-backoffice-run@…` (runtime) | `roles/storage.objectAdmin` | solo il bucket `vma-vd-menu-availability` |
| `vma-vd-backoffice-run@…` (runtime) | `roles/secretmanager.secretAccessor` | solo `scheduler-secret-availability` |
| `vma-vd-backoffice-run@…` (runtime) | `roles/secretmanager.secretAccessor` | solo `scheduler-secret-anonymization` |

Nessun ruolo a livello di progetto aggiunto o modificato; servizio Cloud Run, altri service account e altri secret non toccati.

**Da sapere:**
- **`run.invoker` non protegge nulla**: il servizio ha `run.googleapis.com/invoker-iam-disabled: true` (pubblico senza controllo IAM dell'invoker), perciò la sua policy IAM contiene solo il binding dello Scheduler e nessun `allUsers`. La protezione degli endpoint schedulati è il secret nell'intestazione (`ADR-105`, nota del 2026-10-04). Se un giorno si riattivasse il controllo IAM, il servizio smetterebbe di essere pubblico: non farlo.
- **Bucket, binding ereditati**: alla creazione GCS aggiunge da sé i ruoli *legacy* per i ruoli di progetto (`projectOwner`/`projectEditor` → `legacyBucketOwner` e `legacyObjectOwner`; `projectViewer` → reader). Quindi, oltre al runtime SA, **anche Owner ed Editor del progetto possono scrivere** nel bucket. Lasciati come sono (Owner scrive comunque via ruoli di progetto); nessun service account ha ruoli di progetto ampi.

## Comandi usati

```bash
P=vma-vd
RUN_SA=vma-vd-backoffice-run@vma-vd.iam.gserviceaccount.com
B=gs://vma-vd-menu-availability

# API
gcloud services enable cloudscheduler.googleapis.com --project=$P

# Service account dello Scheduler + run.invoker sul solo servizio
gcloud iam service-accounts create vma-vd-scheduler --project=$P \
  --display-name="Cloud Scheduler (menu e GDPR)" \
  --description="Identita dei job Cloud Scheduler; run.invoker sul solo servizio backoffice"
gcloud run services add-iam-policy-binding vma-vd-backend-backoffice-git \
  --region=europe-west1 --project=$P \
  --member="serviceAccount:vma-vd-scheduler@vma-vd.iam.gserviceaccount.com" \
  --role="roles/run.invoker"

# Bucket, lettura pubblica, scrittura del runtime SA sul solo bucket
gcloud storage buckets create $B --project=$P --location=europe-west1 --uniform-bucket-level-access
gcloud storage buckets add-iam-policy-binding $B --member=allUsers --role=roles/storage.objectViewer
gcloud storage buckets add-iam-policy-binding $B \
  --member="serviceAccount:$RUN_SA" --role=roles/storage.objectAdmin

# Secret: valore generato in pipe, mai stampato né salvato
for S in scheduler-secret-availability scheduler-secret-anonymization; do
  openssl rand -base64 48 | tr -d '\n' | \
    gcloud secrets create $S --project=$P --replication-policy=automatic --data-file=-
  gcloud secrets add-iam-policy-binding $S --project=$P \
    --member="serviceAccount:$RUN_SA" --role=roles/secretmanager.secretAccessor
done
```

Verifica (solo metadati, **mai** `gcloud secrets versions access`):

```bash
gcloud secrets versions list scheduler-secret-availability --project=$P
gcloud secrets get-iam-policy scheduler-secret-availability --project=$P
gcloud storage buckets get-iam-policy $B
gcloud run services get-iam-policy vma-vd-backend-backoffice-git --region=europe-west1 --project=$P
```

**Rotazione di un secret**: `openssl rand -base64 48 | tr -d '\n' | gcloud secrets versions add NOME --project=vma-vd --data-file=-`, poi aggiornare il job dello Scheduler (intestazione) e fare un nuovo deploy del servizio se il secret è montato con una versione fissa.

## Esito delle verifiche (2026-10-12)

| # | Verifica | Esito |
|---|----------|-------|
| 1 | Il blocco dell'accesso pubblico non impedisce la lettura pubblica | **OK**. Policy effettiva `storage.publicAccessPrevention` sul progetto: `booleanPolicy: {}` (non imposta); bucket `inherited`; oggetto di prova letto con `curl` anonimo: `HTTP/2 200` |
| 2 | Oggetto con `Cache-Control: public, max-age=60` servito con quell'intestazione | **OK**. `curl -I` anonimo: `cache-control: public, max-age=60`, `content-type: application/json`. Oggetto poi cancellato |
| 3 | Sovrascrittura da parte del runtime SA (`objectAdmin`) | **Non verificata, da provare in 6.4**. L'account umano (`roles/owner`) non può impersonare il runtime SA: `PERMISSION_DENIED … iam.serviceAccounts.getAccessToken` (serve `roles/iam.serviceAccountTokenCreator`, non concesso di proposito) |
| 4 | Richiesta con `Origin` ottiene le intestazioni CORS | **Rimandata a 6.9** (il progetto Firebase del menù non esiste). Controprova: con `Origin: https://example.web.app` nessuna intestazione `Access-Control-*`, come atteso senza CORS |

**Osservazione utile a 6.4**: dopo la cancellazione dell'oggetto di prova, l'URL pubblico ha continuato a rispondere `200` con il vecchio contenuto per circa un minuto, poi `404`. È la cache pubblica di `max-age=60`: vale anche per le sovrascritture di `disponibilita.json` (il browser può vedere lo stato precedente fino a 60 secondi). Inoltre, con la cancellazione temporanea predefinita di 7 giorni, ogni sovrascrittura conserva la versione precedente per 7 giorni: costo trascurabile per un file di pochi KB, da rivalutare in 6.4 solo se la frequenza di scrittura fosse molto alta.

## Rimandato

| Cosa | Sottofase |
|------|-----------|
| CORS del bucket (indirizzi `web.app` e `firebaseapp.com` del progetto Firebase del menù) | 6.9, prima della prova di lettura dal browser |
| Prova di sovrascrittura da parte del runtime SA (dall'applicazione su Cloud Run) | 6.4 |
| Job di Cloud Scheduler (disponibilità) e montaggio di `SCHEDULER_SECRET_AVAILABILITY` sul servizio | 6.4 |
| Job di Cloud Scheduler (anonimizzazione) e montaggio di `SCHEDULER_SECRET_ANONYMIZATION` sul servizio | 5.3 |
| Variabile del nome del bucket sul servizio | 6.4 |

### Comando CORS pronto per 6.9

Sostituire `ID_PROGETTO` con l'ID del progetto Firebase del menù; `http://localhost:3000` solo se serve allo sviluppo del frontend.

```bash
cat > /tmp/cors-menu.json <<'EOF'
[
  {
    "origin": ["https://ID_PROGETTO.web.app", "https://ID_PROGETTO.firebaseapp.com"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF
gcloud storage buckets update gs://vma-vd-menu-availability --cors-file=/tmp/cors-menu.json
gcloud storage buckets describe gs://vma-vd-menu-availability --format="value(cors_config)"

# Verifica (con un oggetto presente nel bucket)
curl -sI -H "Origin: https://ID_PROGETTO.web.app" \
  https://storage.googleapis.com/vma-vd-menu-availability/disponibilita.json | grep -i access-control
# atteso: access-control-allow-origin: https://ID_PROGETTO.web.app
```

## Job Cloud Scheduler — disponibilità (6.4)

**Stato**: da creare in produzione (non eseguito il 2026-10-13). L'applicazione espone `POST /api/menu/availability-scheduler` (config Payload `endpoints`).

| Campo | Valore |
|-------|--------|
| Frequenza | `*/5 * * * *` |
| Fuso | `Europe/Rome` |
| Metodo | `POST` |
| URL | `https://<host-cloud-run>/api/menu/availability-scheduler` |
| OIDC / SA | `vma-vd-scheduler@vma-vd.iam.gserviceaccount.com` (come gli altri job HTTP verso Cloud Run) |
| Intestazione | `X-Scheduler-Availability-Secret: <valore>` — il valore è quello del secret `scheduler-secret-availability` in Secret Manager; **non** leggerlo né stamparlo nei log |

Esempio di creazione (sostituire `HOST` con l'URL del servizio; il secret va passato senza eco in shell):

```bash
P=vma-vd
HOST="https://vma-vd-backend-backoffice-git-XXXX.europe-west1.run.app"
# Valore del secret: recuperarlo in subshell locale, mai in echo né in questo file
read -s SCHED_SECRET && export SCHED_SECRET
gcloud scheduler jobs create http menu-availability-reset \
  --project=$P --location=europe-west1 \
  --schedule="*/5 * * * *" --time-zone="Europe/Rome" \
  --uri="${HOST}/api/menu/availability-scheduler" \
  --http-method=POST \
  --oidc-service-account-email="vma-vd-scheduler@vma-vd.iam.gserviceaccount.com" \
  --headers="X-Scheduler-Availability-Secret=${SCHED_SECRET}"
unset SCHED_SECRET
```

**Cloud Run** (dopo il deploy 6.4): variabile `MENU_AVAILABILITY_GCS_BUCKET=vma-vd-menu-availability`; montaggio secret → env `SCHEDULER_SECRET_AVAILABILITY` (versione corrente o pin, come per `DATABASE_URL`).

**Verifica post-deploy**: `gcloud scheduler jobs run menu-availability-reset --location=europe-west1 --project=$P`; nel registro attività una voce `systemAction` con `availability-reset` o `availability-realigned`; `curl -I` su `https://storage.googleapis.com/vma-vd-menu-availability/disponibilita.json`.

## Deviazioni dal piano

- **Esecuzione.** **Ufficiale**: 6.0 è «lavoro dell'umano su GCP; Composer scrive solo la documentazione». **Percepito**: l'umano ha chiesto all'agente di eseguire i comandi dopo un'unica conferma, con il proprio account. **Osservato**: comandi eseguiti dall'agente con `mirko@vietnamonamour.com` dopo il «procedi»; le credenziali erano scadute ed è stato l'umano a rinnovarle (`gcloud auth login`), l'agente non ha tentato il login.
- **Prova di sovrascrittura.** **Ufficiale**: `objectAdmin` «da verificare nella prova». **Percepito**: provarla solo impersonando il runtime SA senza concedere permessi nuovi. **Osservato**: impersonazione negata; prova non eseguita, spostata a 6.4.
- **Scrittura «riservata» al runtime SA.** **Ufficiale**: scrittura riservata al runtime SA sul solo bucket. **Percepito**: nessun altro principal riceve ruoli di scrittura espliciti. **Osservato**: vero per i binding espliciti; restano i binding *legacy* predefiniti per Owner/Editor del progetto (vedi sopra), non rimossi.
