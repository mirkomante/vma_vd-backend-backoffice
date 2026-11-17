# Rebuild del menù pubblico — Cloud Build, trigger e IAM incrociato

> Riferimento operativo **Fase 6.5** (chiusa il 2026-11-17). Progetto Cloud Build e trigger: **`vma-vd`**, regione **`europe-west1`**. Deploy Hosting su progetto distinto **`vma-vd-menu`**. **Nessun segreto in questo file.**

Il pulsante «Ricompila il menù pubblico» nell’App invoca POST same-origin su `/api/menu/rebuild`; il backend chiama la REST Cloud Build `…/triggers/{id}:run` sul trigger manuale. Il repository del menù ha un secondo trigger al push su `main`. Dettaglio funzionale e scostamenti: `docs/piano-sviluppo/fase-6-menu-digitale.md` §6.5, `docs/piano-sviluppo/ADR-105-strategia-rendering-comunicazione-siti-esterni.md` (nota 2026-11-17).

## Repository e connessione GitHub (2ª generazione)

| Elemento | Valore |
|----------|--------|
| Repository GitHub | `mirkomante/vma-vd-menu`, ramo `main` — **privato** dal 2026-11-17 |
| Connessione | `github-mirkomante`, regione `europe-west1`, stato **COMPLETE** — lettura del sorgente via connessione confermata (build `584ec4f5-5cd5-4af9-98fc-79b7c601c6b1`, 2026-11-17) |
| Risorsa repository collegata | `projects/vma-vd/locations/europe-west1/connections/github-mirkomante/repositories/vma-vd-menu` |

Il `cloudbuild.yaml` del repo menù include `options.logging: CLOUD_LOGGING_ONLY` (commit `17edc31`, mandato 2026-11-16): **obbligatorio** con service account dedicato sulla build. Le variabili di sostituzione (`_FIREBASE_PROJECT_ID`, URL CMS e disponibilità, immagine Firebase CLI) restano come **valori predefiniti nel file**, non sui trigger (scostamento rispetto al testo originale del piano).

## Trigger Cloud Build (progetto `vma-vd`, regione `europe-west1`)

Tutti usano il service account **`vma-vd-menu-build@vma-vd.iam.gserviceaccount.com`**.

| Nome | ID risorsa | Uso |
|------|------------|-----|
| `menu-rebuild-manuale` | `projects/vma-vd/locations/europe-west1/triggers/c0f365e8-f395-4581-be2c-1e0d0a13e5ab` | Avvio dal pulsante CMS (`cloudbuild.yaml` del repo) |
| `menu-rebuild-push-main` | `projects/vma-vd/locations/europe-west1/triggers/33b71a43-7e76-47a8-a4a0-6a1d08ac1116` | Push su `main` del repo menù, stesso `cloudbuild.yaml` |
| `menu-rebuild-prova` | `projects/vma-vd/locations/europe-west1/triggers/2d469a58-8751-410b-92f1-618818818469` | Configurazione inline senza deploy; **eliminato** il 2026-11-17 a fine 6.5 |

## Service account della build e ruoli IAM

### Su `vma-vd` — identità `vma-vd-menu-build@vma-vd.iam.gserviceaccount.com`

| Ruolo | Motivo |
|-------|--------|
| `roles/logging.logWriter` | Con service account dedicato sulla build, i log devono andare su Cloud Logging (o bucket proprio); senza questo ruolo la build fallisce |

### Su `vma-vd` — runtime Cloud Run `vma-vd-backoffice-run@vma-vd.iam.gserviceaccount.com`

| Ruolo | Su cosa | Motivo |
|-------|---------|--------|
| `roles/cloudbuild.builds.editor` | progetto `vma-vd` | Avviare trigger e build (API `triggers.run`) |
| `roles/iam.serviceAccountUser` | service account `vma-vd-menu-build` | Il runtime deve impersonare il SA della build all’avvio |

### Su `vma-vd` — service agent Cloud Build `service-437074136999@gcp-sa-cloudbuild.iam.gserviceaccount.com`

| Ruolo | Motivo |
|-------|--------|
| `roles/cloudbuild.serviceAgent` | Identità gestita del service agent Cloud Build |
| `roles/developerconnect.tokenAccessor` | Accesso token per la connessione GitHub (2ª generazione) |

`roles/secretmanager.admin` era stato concesso per creare la connessione GitHub ed è stato **rimosso il 2026-11-17** dopo prova (build `37f0d4e8-4dbf-4b31-93d7-03e2f1b42bf4` SUCCESS); policy IAM verificata assente dopo la build.

### Su `vma-vd-menu` — stesso `vma-vd-menu-build@…`

| Ruolo | Motivo |
|-------|--------|
| `roles/firebasehosting.admin` | Deploy cross-progetto su Firebase Hosting |

`roles/serviceusage.apiKeysViewer` era stato aggiunto seguendo la guida «Deploy to Firebase» ed è stato **rimosso il 2026-11-17** dopo prova (stessa build `37f0d4e8-…`); policy IAM verificata assente dopo la build.

### Requisito del caso incrociato (non previsto esplicitamente nel piano)

La build gira in **`vma-vd`** ma esegue deploy Firebase verso **`vma-vd-menu`**. Sul progetto **`vma-vd`** (consumer `projects/437074136999` nel messaggio di errore) vanno abilitate anche:

| API | Motivo |
|-----|--------|
| `firebase.googleapis.com` | Senza: deploy fallisce con `SERVICE_DISABLED` (build `24bac300-…`, 2026-11-17) |
| `firebasehosting.googleapis.com` | Senza: stesso tipo di errore (build `c2ac8507-…`, 2026-11-17) |

Il messaggio della CLI Firebase («Failed to get Firebase project…») è **generico** e non nomina l’API disabilitata: si scopre chiamando l’API con le credenziali del service account di build (vedi diagnostica sotto). Il piano **Spark** del progetto menù **non ha dato problemi** al deploy da build di un altro progetto.

## Variabile Cloud Run

| Variabile | Servizio | Valore (revisione `vma-vd-backend-backoffice-git-00294-qjk`, 2026-11-17) |
|-----------|----------|------------------------------------------------------------------------|
| `MENU_REBUILD_TRIGGER_NAME` | `vma-vd-backend-backoffice-git`, `europe-west1` | `projects/vma-vd/locations/europe-west1/triggers/c0f365e8-f395-4581-be2c-1e0d0a13e5ab` |

**Modifica**: solo con `--update-env-vars`, **mai** `--set-env-vars` (evita di cancellare le altre variabili del servizio).

```bash
gcloud config set project vma-vd
gcloud run services update vma-vd-backend-backoffice-git --region=europe-west1 \
  --update-env-vars=MENU_REBUILD_TRIGGER_NAME=NOME_O_ID_TRIGGER_MANUALE
```

Per tornare al trigger di prova (solo se esistesse ancora): stesso comando con la `resourceName` del trigger di prova. Per disabilitare l’avvio dal pulsante senza deploy del codice: `--remove-env-vars=MENU_REBUILD_TRIGGER_NAME` (l’endpoint risponde 503).

**Bandiera codice**: `PUBLIC_MENU_REBUILD_UI_ENABLED` sta nel codice; spegnerla richiede un deploy dell’app.

## Comandi operativi

Sostituire `NOME_O_ID` con il nome o l’ID reale (es. `menu-rebuild-manuale` o la risorsa completa del trigger).

### Avviare un trigger da riga di comando

```bash
gcloud config set project vma-vd
gcloud builds triggers run NOME_O_ID --region=europe-west1 --branch=main
```

Corpo usato dall’App (trigger **regionali**): `{"source":{"branchName":"main"}}` (non `{"branchName":"main"}`).

### Leggere stato e log di una build

```bash
gcloud builds list --region=europe-west1 --limit=5 --format="table(id,status,createTime,buildTriggerId)"
gcloud builds describe NOME_O_ID_BUILD --region=europe-west1 --format="yaml(status,finishTime,substitutions)"
gcloud builds log NOME_O_ID_BUILD --region=europe-west1
```

### Introspezione trigger

```bash
gcloud builds triggers describe menu-rebuild-manuale --region=europe-west1 --format="yaml(name,resourceName,serviceAccount,filename)"
gcloud builds triggers describe menu-rebuild-push-main --region=europe-west1 --format="yaml(name,resourceName)"
```

## Diagnostica deploy cross-progetto con messaggio generico

1. Leggere il log completo: `gcloud builds log NOME_O_ID_BUILD --region=europe-west1` e cercare `SERVICE_DISABLED`, `PERMISSION_DENIED`, `Firebase`.
2. Se il passo Firebase fallisce senza dettaglio utile, **impersonare il SA di build** (solo se si ha temporaneamente `roles/iam.serviceAccountTokenCreator` su quel SA — usato per diagnosi il 2026-11-17 e rimosso lo stesso giorno) e provare l’endpoint che fallisce, oppure verificare le API abilitate sul progetto **`vma-vd`**:

```bash
gcloud services list --enabled --project=vma-vd --filter="name:firebase"
```

3. Confermare i ruoli sul progetto **`vma-vd-menu`** per `vma-vd-menu-build@…` (tabella sopra).
4. Verificare che `options.logging: CLOUD_LOGGING_ONLY` sia presente nel `cloudbuild.yaml` su `main` del repo menù.

## Prove registrate (UTC, estratto)

| Contesto | Build ID | Esito | Nota |
|----------|----------|-------|------|
| Trigger prova, CLI | `bda454f6-1735-4adc-8bfd-0eb509756b2a` | SUCCESS | 2026-11-16 20:59:45 |
| Trigger prova, pulsante (V1) | `2884fee5-454c-461d-a038-326f12f422a6` | SUCCESS | 2026-11-16 21:37:26; registro `rebuild-started:` stesso id, senza utente |
| Secondo avvio ravvicinato (V1) | `1cb0b537-3104-4dcc-b313-4b76f77978e7` | SUCCESS | 2026-11-17 15:18:22; messaggio «già avviata», una sola build nuova |
| POST senza sessione | — | 401 | `{"status":"unauthorized"}` |
| Prima build vera (manuale) | `24bac300-cb30-4e04-b0fa-d45442591920` | FAILURE | API `firebase.googleapis.com` non abilitata in `vma-vd` |
| Seconda tentativo | `c2ac8507-ec3e-46d9-8809-7bc73d418f50` | FAILURE | API `firebasehosting.googleapis.com` non abilitata in `vma-vd` |
| Manuale da CLI (E3) | `269521ec-90f5-4f6d-a785-727ec002fecc` | SUCCESS | 2026-11-17 16:31:31; pagina `/it/test/` istante build 16:32:24Z, 44 piatti IT/EN |
| Pulsante produzione | `3adacb92-fa8c-4997-9f41-56a23f5c2c2a` | SUCCESS | 2026-11-17 16:52:16; trigger `c0f365e8-…`; pagina 16:53:10Z |
| Push `main` (commit `974b12d`) | `0ab3262e-e054-467a-9fb9-5d531ea69657` | SUCCESS | 2026-11-17 16:58:45; trigger `33b71a43-…` |
| Repo già privato, ruoli ancora presenti | `584ec4f5-5cd5-4af9-98fc-79b7c601c6b1` | SUCCESS | 2026-11-17 20:25:33 UTC; trigger manuale; clone/build/deploy |
| Dopo rimozione `secretmanager.admin` e `apiKeysViewer` | `37f0d4e8-4dbf-4b31-93d7-03e2f1b42bf4` | SUCCESS | 2026-11-17 20:34:21 UTC; trigger manuale `c0f365e8-…`; IAM assenti post-build |

## Come si torna indietro

| Azione | Comando / nota |
|--------|----------------|
| Il pulsante non deve avviare build | `gcloud run services update vma-vd-backend-backoffice-git --region=europe-west1 --remove-env-vars=MENU_REBUILD_TRIGGER_NAME` |
| Elimina trigger manuale / push | `gcloud builds triggers delete menu-rebuild-manuale --region=europe-west1` (idem `menu-rebuild-push-main`) |
| Rimuovi ruoli su `vma-vd-menu` | `gcloud projects remove-iam-policy-binding vma-vd-menu --member=serviceAccount:vma-vd-menu-build@vma-vd.iam.gserviceaccount.com --role=…` |
| Elimina SA build | Solo se non più usato: `gcloud iam service-accounts delete vma-vd-menu-build@vma-vd.iam.gserviceaccount.com` dopo aver eliminato trigger e binding |
| Revert codice App (I1/I2) | `git revert` nel repo backoffice e deploy; bandiera o endpoint |
| Revert `cloudbuild.yaml` menù | `git revert` nel repo `vma-vd-menu` (commit `17edc31`) |
| Clone/build falliscono per accesso sorgente GitHub | Ripristinare `roles/secretmanager.admin` sul service agent Cloud Build in `vma-vd`, rilanciare il trigger manuale o al push, registrare l’esito |

Ripristino Hosting diagnostico: le release precedenti restano nella cronologia Firebase Hosting del progetto `vma-vd-menu` (non è il menù legacy in produzione).

## Limiti e debiti

- Due avvii quasi simultanei da **utenti diversi** possono avviare **entrambe** le build (il debounce è sulla finestra temporale, non un lock distribuito).
- Il token GitHub della connessione appartiene all’account che ha autorizzato la connessione: se revocato, il trigger al **push** smette di funzionare. La prova del 2026-11-17 è **una sola build** dopo la rimozione dei ruoli ampi: **non copre** il rinnovo nel tempo del token della connessione GitHub; se il trigger manuale o quello al push falliscono per l’accesso al sorgente, rimettere `roles/secretmanager.admin` al service agent di Cloud Build, riprovare e registrarlo.
- **Registro attività**: l’avvio è `systemAction` **senza utente** (`ADR-115`); non si sa chi ha premuto il pulsante.
- **Esito finale della build** (Pub/Sub): fuori dalla 6.5; l’App comunica solo «avviata».
- Collaudo V2 **ridotto** (2026-11-17): solo (A) pulsante e (B) push; `piatti-disabilitato-ovunque` **rinviato / non provato**.

## Riferimenti incrociati

- Piano esecuzione: `docs/piano-sviluppo/esecuzione-6.5-prompt-e-controlli.md`
- Progetto Firebase menù: `vma-vd-menu`; URL diagnostici `https://vma-vd-menu.web.app/it/test/` (registrati in fase 6.9)