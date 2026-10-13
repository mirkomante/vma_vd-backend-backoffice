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
| 3 | Sovrascrittura da parte del runtime SA (`objectAdmin`) | **OK** (2026-10-13, chiusura 6.4). Il runtime SA con il solo `roles/storage.objectAdmin` sul bucket ha sovrascritto un oggetto esistente **quattro volte** (14:20:27, 15:27:55, 15:28:58, 15:47:00 UTC), osservato nella cronologia del bucket. La prova del 2026-10-12 via impersonazione non era eseguibile (`PERMISSION_DENIED` su `getAccessToken`) |
| 4 | Richiesta con `Origin` ottiene le intestazioni CORS | **Rimandata a 6.9** (il progetto Firebase del menù non esiste). Controprova: con `Origin: https://example.web.app` nessuna intestazione `Access-Control-*`, come atteso senza CORS |

**Osservazione utile a 6.4**: dopo la cancellazione dell'oggetto di prova, l'URL pubblico ha continuato a rispondere `200` con il vecchio contenuto per circa un minuto, poi `404`. È la cache pubblica di `max-age=60`: vale anche per le sovrascritture di `disponibilita.json` (il browser può vedere lo stato precedente fino a 60 secondi). Inoltre, con la cancellazione temporanea predefinita di 7 giorni, ogni sovrascrittura conserva la versione precedente per 7 giorni: costo trascurabile per un file di pochi KB, da rivalutare in 6.4 solo se la frequenza di scrittura fosse molto alta.

## Rimandato

| Cosa | Sottofase |
|------|-----------|
| CORS del bucket (indirizzi `web.app` e `firebaseapp.com` del progetto Firebase del menù) | 6.9, prima della prova di lettura dal browser |
| Job di Cloud Scheduler (anonimizzazione) e montaggio di `SCHEDULER_SECRET_ANONYMIZATION` sul servizio | 5.3 |

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

**Stato**: creato in produzione il **2026-10-13** (`menu-availability-reset`). L'applicazione espone `POST /api/menu/availability-scheduler` (config Payload `endpoints`).

| Campo | Valore |
|-------|--------|
| Frequenza | `*/5 * * * *` |
| Fuso | `Europe/Rome` |
| Metodo | `POST` |
| URL | `https://<host-cloud-run>/api/menu/availability-scheduler` |
| OIDC / SA | `vma-vd-scheduler@vma-vd.iam.gserviceaccount.com` (come gli altri job HTTP verso Cloud Run) |
| Intestazione | `X-Scheduler-Availability-Secret: <valore>` — da Secret Manager; **non** leggerlo né stamparlo nei log |

**Cloud Run** (deploy 6.4): `gcloud run services update` con `--update-env-vars=MENU_AVAILABILITY_GCS_BUCKET=vma-vd-menu-availability` e `--update-secrets=SCHEDULER_SECRET_AVAILABILITY=scheduler-secret-availability:latest`. **Mai** `--set-secrets` (sostituisce tutti i secret montati). Dopo l'aggiornamento il servizio ha **13** variabili (11 precedenti + le due nuove).

Esempio di creazione del job (sostituire `HOST`; **`read -s` non è utilizzabile** — il valore del secret è stato generato in 6.0 e non è noto a nessuno):

```bash
P=vma-vd
HOST="https://vma-vd-backend-backoffice-git-XXXX.europe-west1.run.app"
gcloud scheduler jobs create http menu-availability-reset \
  --project=$P --location=europe-west1 \
  --schedule="*/5 * * * *" --time-zone="Europe/Rome" \
  --uri="${HOST}/api/menu/availability-scheduler" \
  --http-method=POST \
  --oidc-service-account-email="vma-vd-scheduler@vma-vd.iam.gserviceaccount.com" \
  --headers="X-Scheduler-Availability-Secret=$(gcloud secrets versions access latest --secret=scheduler-secret-availability --project=$P)" \
  --format="value(name,state)"
```

Senza `--format="value(name,state)"` alla fine, `gcloud` stampa la definizione completa del job **inclusa l'intestazione** (cioè il secret). **Mai** `gcloud scheduler jobs describe` senza `--format` controllato: il valore va letto solo sul terminale dell'umano.

**Verifica post-deploy** (2026-10-13): prima scrittura job **13:23:22 UTC** — file valido, `schemaVersion: 1`, sei gruppi vuoti, `globalMessage` assente; `curl -I`: 200, `application/json`, `cache-control: public, max-age=60`; registro `availability-reset: baseline; boundary=2026-10-13T10:30:00.000Z; service=lunch; date=2026-10-13`. Dopo il fix sync REST (revisione 00141): scritture immediate su salvataggio Admin; log `menu-availability-sync` osservati.

## Deviazioni dal piano

- **Esecuzione.** **Ufficiale**: 6.0 è «lavoro dell'umano su GCP; Composer scrive solo la documentazione». **Percepito**: l'umano ha chiesto all'agente di eseguire i comandi dopo un'unica conferma, con il proprio account. **Osservato**: comandi eseguiti dall'agente con `mirko@vietnamonamour.com` dopo il «procedi»; le credenziali erano scadute ed è stato l'umano a rinnovarle (`gcloud auth login`), l'agente non ha tentato il login.
- **Prova di sovrascrittura.** **Ufficiale**: `objectAdmin` «da verificare nella prova». **Percepito**: provarla solo impersonando il runtime SA senza concedere permessi nuovi. **Osservato** (2026-10-12): impersonazione negata; prova eseguita in **6.4** (2026-10-13) tramite scritture Cloud Run sulla cronologia del bucket — **OK**.
- **Scrittura «riservata» al runtime SA.** **Ufficiale**: scrittura riservata al runtime SA sul solo bucket. **Percepito**: nessun altro principal riceve ruoli di scrittura espliciti. **Osservato**: vero per i binding espliciti; restano i binding *legacy* predefiniti per Owner/Editor del progetto (vedi sopra), non rimossi.
