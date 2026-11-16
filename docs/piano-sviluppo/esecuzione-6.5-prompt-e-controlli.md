# Esecuzione della 6.5: ordine, prompt e controlli

**Stato**: approvato da Mirko il 2026-11-16. Non autorizza nulla da sola: ogni passo parte quando Mirko lo avvia. La 6.5 ha un mandato proprio (passaggio M-02, `fase-6-menu-digitale.md` §6.9): nessun trigger, IAM incrociato, esecuzione Cloud Build o pulsante CMS prima del «via» di Mirko al passo 1.

La regola di lavoro resta quella di `00-come-eseguire-il-piano.md`. Rispetto alla 6.6 questo piano è **volutamente corto**: dieci passi, un solo giro di controlli meccanici e un solo collaudo dal vivo (preferenza di Mirko: test solo per la meccanica e per «UI = design», niente ripetizioni).

---

## 1. Come si usa questo documento

| Tipo di passo | Passi | Cosa incolli / fai |
|---|---|---|
| **Implementazione** (Composer scrive codice) | 1, 5 | Blocco comune (§5) + prompt del passo, nello stesso primo messaggio |
| **Documentazione** (Composer, solo documenti) | 9 | Solo il prompt del passo (compilato dal pianificatore dopo il passo 8) |
| **Passi tuoi su GCP** (comandi esatti) | 2, 4, 7 | Esegui i comandi nell'ordine scritto; incolli qui l'output dove indicato |
| **Repository del menù** (mandato esplicito, un solo file) | 3 | Prompt del passo, in una chat Cursor aperta su `vma-vd-menu` |
| **Collaudi dal vivo** (tuoi, con i dati) | 6, 8 | Segui la scheda; incolli qui gli esiti |
| **Chiusura** (pianificatore) | 10 | Scrivi «push fatto»; controllo io da clone pulito |

**Ciclo dei passi di Composer (1, 5)**: incolli → Cursor risponde con la **Parte A** (solo proposta) e si ferma → la incolli qui → ti rispondo con le correzioni e il «procedi» → incolli la mia risposta in Cursor → implementa, verifica, commit **locale** → incolli qui la risposta finale, fai il push e scrivi «push fatto». Ogni chat di Cursor è nuova. Il passo 9 non ha Parte A (solo documenti).

**Stato**: vive solo nella tabella del §4 (🔲 da fare; 🔶 fatto, da controllare; ✅ controllato dal pianificatore, con hash). Lo aggiorno io dopo il tuo «push fatto» con un prompt già compilato.

---

## 2. Cosa risulta dalle fonti ufficiali (consultate il 2026-11-16) e cosa cambia

Letture fatte sulla documentazione Google Cloud (Cloud Build: riferimento REST dei trigger, service account specificati dall'utente, trigger manuali e GitHub, «Deploy to Firebase»). Dove la documentazione è ambigua lo scrivo.

| # | Fatto | Conseguenza nel piano |
|---|---|---|
| F1 | Con un **service account dedicato** per la build, i log devono andare su Cloud Logging o su un bucket creato da noi; il bucket predefinito non è ammesso. Il `cloudbuild.yaml` del repo menù (M-02) **non ha** `options.logging`. | Senza una riga in più (`options: logging: CLOUD_LOGGING_ONLY`) la build con il service account dedicato **fallisce**. Passo 3 (repo menù, mandato esplicito) e `roles/logging.logWriter` al service account (passo 2). |
| F2 | I repository GitHub di **2ª generazione** richiedono una **regione** per il trigger; la 1ª generazione usa `global`. La regione del trigger deve coincidere con quella della connessione. | L'endpoint non deve conoscere la regione: la variabile di Cloud Run contiene il **nome completo della risorsa** del trigger (vale per entrambi i casi). Proposta: 2ª generazione in `europe-west1`. |
| F3 | `triggers.run` per i trigger regionali (`projects.locations.triggers.run`) prende un corpo `RunBuildTriggerRequest` con il campo `source` (ramo o tag, senza espressioni regolari); il corpo `{"branchName":...}` vale solo per i trigger globali. | L'endpoint passa `{"source":{"branchName":"main"}}`; la forma si conferma alla prima chiamata reale (passo 4). La risposta è un'`Operation`; l'id build si legge in `metadata.build.id` (altrimenti «id non disponibile»). |
| F4 | La guida «Deploy to Firebase» elenca per il service account di build: ruolo del Cloud Build Service Account, **Firebase Admin** e un ruolo sulle chiavi API (Admin in una versione della pagina, Viewer in un'altra). | Documentazione non univoca tra le versioni lette. Si parte dal **minimo** (`firebasehosting.admin` + `serviceusage.apiKeysViewer` sul progetto `vma-vd-menu`) e si sale solo se l'errore nomina un permesso mancante (passo 7). Si registra ciò che serve davvero. |
| F5 | Un trigger può avere un service account proprio, usato per `triggers.run`, `builds.create` e `builds.cancel`. Il service account sta in `vma-vd` (lo stesso progetto del trigger): il vincolo di organizzazione sull'uso incrociato dei service account non entra in gioco. | Service account dedicato `vma-vd-menu-build@vma-vd.iam.gserviceaccount.com` in `vma-vd`; i **permessi** sul progetto Firebase `vma-vd-menu` sono il caso incrociato. |
| F6 | **Non verificato** (si scopre nel passo 7): il deploy su Hosting di un progetto in piano **Spark**, senza fatturazione, lanciato da una build in un altro progetto. | Se fallisce, il messaggio dice perché; si ferma e si decide, non si aggira. |
| F7 | **Non verificato**: l'immagine `node:26.11.1` e l'installazione di Corepack con npm nello step di build funzionano in Cloud Build (il file non è mai stato eseguito). | Emerge nella prima build vera da riga di comando (passo 7). Il trigger di prova (passo 4) ha una configurazione propria e non lo prova. |

---

## 3. Decisioni proposte (valgono se non le cambi)

1. **Tre trigger**, tutti in `vma-vd`, regione `europe-west1`, con il service account dedicato: `menu-rebuild-prova` (manuale, configurazione inline che stampa un messaggio, **nessun deploy**: serve alla Parte A e si elimina a fine 6.5), `menu-rebuild-manuale` (manuale, usa il `cloudbuild.yaml` del repo; lo avvia il pulsante), `menu-rebuild-push-main` (al push su `main`, stesso file).
2. **Variabile di Cloud Run `MENU_REBUILD_TRIGGER_NAME`** = nome completo della risorsa del trigger da avviare (`projects/vma-vd/locations/europe-west1/triggers/<id>`). Un nome per variabile, nessun alias. Assente → l'endpoint risponde 503 e il pulsante mostra l'errore generico. Si cambia con `gcloud run services update --update-env-vars` (mai `--set-env-vars`), senza nuovo deploy del codice.
3. **Ramo**: `main` fisso nel codice.
4. **Autenticazione verso Cloud Build**: token del service account di runtime letto dal server dei metadati di Cloud Run, con `fetch` (**nessuna nuova dipendenza**). In locale e nei test l'endpoint non chiama mai GCP: il client è iniettabile.
5. **Chi può avviare**: sessione valida e `canAccessSection(user, 'menu')` (oggi: `appRole: manager` o admin e super-admin, `ADR-113`). Senza sessione 401; senza accesso 403.
6. **Doppio avvio**: se esiste una riga `rebuild-started:` negli ultimi **120 secondi**, la richiesta è ignorata con un messaggio e non si chiama Cloud Build.
7. **Registro attività** (`ADR-115`): riga `systemAction`, **senza utente** (come previsto dall'ADR), `detail` = `rebuild-started: <id build>`. Nessuna migrazione: il prefisso e `detail` esistono dalla 6.4. Un avvio **fallito** non scrive nel registro (l'elenco dei prefissi è chiuso): errore nel log del server e avviso all'utente.
8. **Esito mostrato all'utente**: la finestra di conferma resta aperta e mostra l'esito, con «Chiudi» (il layout delle intestazioni non cambia). Testi proposti (le specifiche non li definiscono: assunzione da confermare in Parte A, la differenza sarebbe un rilievo A):
   - avviata: «Pubblicazione avviata. Il menù pubblico si aggiorna tra alcuni minuti.»
   - già avviata: «Una pubblicazione è già stata avviata da poco. Attendi qualche minuto prima di riprovare.»
   - errore: «Non è stato possibile avviare la pubblicazione. Riprova tra poco; se succede ancora, avvisa l'amministratore.»
9. **Variabili di sostituzione** (`_FIREBASE_PROJECT_ID`, `_MENU_CMS_URL`, `_MENU_AVAILABILITY_URL`, immagine Firebase CLI): restano come **valori predefiniti nel `cloudbuild.yaml`** (già revisionati in M-02), non duplicati sui trigger. **Scostamento dal testo del piano** («entrambi i trigger passano le variabili»): si registra. Conseguenza: cambiare un URL richiede un commit nel repo menù.
10. **Bandiera** `PUBLIC_MENU_REBUILD_UI_ENABLED`: resta `false` al passo 1 e si accende al passo 5, **dopo** che il trigger di prova e la variabile esistono. Il pulsante non compare mai in produzione senza un trigger dietro.
11. **Collaudo dal vivo senza toccare contenuti veri**: un piatto temporaneo per la prova del contenuto, il primo piatto mostrato dalla pagina per «terminato» (reversibile, c'è il precedente dell'L3 della 6.6), un messaggio globale poi svuotato. Il menù attuale (vecchio backend) non viene mai toccato.

---

## 4. Tabella unica: l'ordine completo

Gli identificativi seguono l'ordine di esecuzione.

| Passo | Sigla | Chi | Cosa | Stato |
|---|---|---|---|---|
| 1 | I1 | Composer | Endpoint di avvio, client Cloud Build, registro, debounce, testi, verifica meccanica (`verify:menu-6_5`). Bandiera spenta | ✅ b987c36 |
| 2 | E1 | Mirko | Connessione GitHub ↔ Cloud Build, service account dedicato, IAM in `vma-vd` | 🔲 |
| 3 | M1 | Cursor sul repo menù | Una riga nel `cloudbuild.yaml` (`options.logging`), mandato esplicito di Mirko | 🔲 |
| 4 | E2 | Mirko | Trigger di prova, prova da riga di comando, variabile su Cloud Run | 🔲 |
| 5 | I2 | Composer | Accende la bandiera, sblocca i controlli rinviati, un giro mirato | 🔲 |
| 6 | V1 | Mirko | Collaudo Parte A dal vivo (pulsante → build di prova, registro, accessi) | 🔲 |
| 7 | E3 | Mirko | Permessi sul progetto Firebase, due trigger veri, prova da riga di comando, cambio variabile | 🔲 |
| 8 | V2 | Mirko | Collaudo Parte B: sequenza di sei passaggi con il Firebase del menù | 🔲 |
| 9 | I3 | Composer | Documentazione operativa e chiusura documentale | 🔲 |
| 10 | C1 | Pianificatore | Controllo da clone pulito e chiusura 6.5 | 🔲 |

**Ultimo aggiornamento**: 2026-11-16 (commit `b987c36`). Prossimi passi: 2 (E1, tuo, GCP) e 3 (M1, repo menù); poi 4, 5, 6, 7, 8, 9, 10. Rilievi A1, A2 e il JSX da correggere nel passo 5.

---

## 5. Blocco comune (da incollare PRIMA del prompt nei passi 1 e 5)

```text
BLOCCO COMUNE: vale per le chat di implementazione della sottofase 6.5.

Sei Composer nel repository VMA VD (Payload CMS e Next.js). Lavori sulla sottofase 6.5 di
docs/piano-sviluppo/fase-6-menu-digitale.md, che si esegue in più chat; questa è UNA di quelle chat e fa solo
quello che il prompt dice. Le regole di .cursor/rules si caricano da sole. Il piano di esecuzione è
docs/piano-sviluppo/esecuzione-6.5-prompt-e-controlli.md.

REGOLE
1. Leggi per intero, prima di scrivere codice, i documenti elencati nel prompt. Non assumere nulla oltre la
   documentazione: quello che non è scritto, chiedilo. Non modificare docs/design/schermate/** né
   docs/design/decisioni-layout-app.md. Se trovi un conflitto tra documenti e codice, dichiaralo in Parte A.
2. PARTE A, solo proposta, nessun codice: (a) i file che crei o modifichi, in ordine; (b) ogni ambiguità o punto
   non coperto, con la lettura che scegli, dichiarata ora e non a posteriori; (c) le verifiche che farai;
   (d) quello che NON farai. Poi FERMATI e aspetta il mio «procedi».
3. PARTE B, implementazione di quanto approvato. Nessuna nuova dipendenza e nessuna migrazione, salvo dove il
   prompt lo dice. Nessun colore o misura fuori dai token. I testi sono quelli del prompt: non riscriverli.
4. Dati: Local API con la sessione dell'utente (overrideAccess: false) nelle schermate; ADR-116: overrideAccess e
   depth sempre espliciti.
5. Verifiche. A ogni passaggio: pnpm typecheck, pnpm lint, pnpm ui:check, test unitari di lib/. PRIMA DI OGNI
   COMMIT, anche di soli script o documenti: pnpm typecheck e pnpm lint sull'INTERO repo (la build di Cloud Build
   controlla anche scripts/**). Un solo giro di Playwright per volta. Non modificare mai controlli, soglie o
   tolleranze, salvo dove il prompt lo autorizza.
6. FERMATI e riferisci, senza aggirare, se: un pacchetto non si installa; serve un passaggio fuori dal codice
   (database, credenziali, GCP, deploy); un ambiente non c'è. Mai produzione: niente scripts/prod-db.sh, niente
   credenziali di produzione, niente chiamate reali a Google Cloud (gcloud, API di Cloud Build, metadata server).
7. CHIUSURA. Voce in docs/piano-sviluppo/CHANGELOG.md sotto [Unreleased]: per ogni ambiguità risolta scrivi
   Ufficiale (cosa prevedeva il piano), Percepito (la lettura dichiarata in Parte A), Osservato (cosa è successo);
   esiti di test anche negativi o parziali. Nella tabella del §4 di esecuzione-6.5-prompt-e-controlli.md segna
   la riga del TUO passo «🔶 fatto, da controllare» (non ✅, nessun'altra riga). Commit locale (git add + git
   commit, messaggio che nomina la chat); MAI git push.
8. RISPOSTA FINALE: tabella «Esiti reali» (cosa hai eseguito, comando, OK / FALLITO / NON PROVATO, evidenza),
   poi deviazioni, poi punti aperti. Non dichiarare fatto ciò che non hai provato.
```

---

## 6. Una scheda per ogni passo

### Passo 1 — I1: avvio del rebuild dal CMS (solo backend, bandiera spenta)

**Incolla in Cursor**: Blocco comune (§5) + il prompt che segue. Chat nuova.

```text
PASSO 1 — I1: avvio del rebuild dal CMS. Segue il Blocco comune. La bandiera
PUBLIC_MENU_REBUILD_UI_ENABLED RESTA false.

LEGGI
- docs/piano-sviluppo/fase-6-menu-digitale.md: §6.5 e «Variabili d'ambiente introdotte dalla Fase 6»
- docs/piano-sviluppo/esecuzione-6.5-prompt-e-controlli.md: §2 (fatti) e §3 (decisioni 2-8)
- ADR-105 (meccanismo e note), ADR-115 (registro; elenco chiuso dei prefissi), ADR-113 §3
- lib/menu/availability/availabilitySchedulerEndpoint.ts e gcsAvailabilityWriter.ts (pattern di endpoint e di
  client esterno); lib/activityLog/logSystemAction.ts e constants.ts; lib/auth/canAccessSection.ts;
  payload.config.ts; scripts/verify-menu-6_4.ts (pattern dello script di verifica)
- components/app/menu/public-menu-rebuild-actions.tsx, menu-outcome-alert.tsx, lib/menu/publicMenuRebuild.ts
- la pagina ufficiale di Cloud Build «projects.triggers.run» e «projects.locations.triggers.run» (REST): in Parte A
  dichiara la forma esatta di richiesta e risposta e DOVE sta l'id della build nella risposta. Se la pagina non è
  raggiungibile, dillo: non indovinare.

COSA FARE (dopo la Parte A approvata)
1. lib/menu/rebuild/ (nomi proposti, confermali in Parte A):
   - constants: percorso endpoint «/menu/rebuild», finestra anti-doppio-avvio 120 s, ramo «main», nome della
     variabile MENU_REBUILD_TRIGGER_NAME.
   - cloudBuildClient: funzione che fa POST https://cloudbuild.googleapis.com/v1/<MENU_REBUILD_TRIGGER_NAME>:run con
     corpo {"source":{"branchName":"main"}} e intestazione Authorization con il token del service account di runtime, letto dal
     server dei metadati (http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token,
     intestazione Metadata-Flavor: Google). Solo fetch, NESSUNA nuova dipendenza. Timeout 15 s. fetch e fonte del
     token INIETTABILI. Estrae l'id della build come dichiarato in Parte A; se la risposta è 2xx ma l'id non si
     trova, lo scrive come «id non disponibile» (la build è partita).
   - endpoint post «/menu/rebuild», in questo ordine: nessun req.user → 401; canAccessSection(user,'menu') falso
     → 403; variabile assente → 503 (log del server, messaggio generico al client); ultima riga systemAction con
     detail che comincia per «rebuild-started:» negli ultimi 120 s → 200 {status:'already-started'} SENZA chiamare
     Cloud Build; chiamata al client; errore o timeout → 502 {status:'error'}, dettagli solo nel log del server;
     successo → logSystemAction(req, {detail:'rebuild-started: <id>'}) → 202 {status:'started', buildId}.
     Nessuna informazione di Google Cloud nelle risposte al client.
   - Registrazione in payload.config.ts, accanto all'endpoint della disponibilità.
2. UI: collega onConfirm di PublicMenuRebuildActions alla POST same-origin su /api/menu/rebuild (cookie di
   sessione). Durante la chiamata il pulsante «Ricompila» è disabilitato e dice «Avvio…». La finestra RESTA APERTA e
   mostra l'esito con un Alert (destructive per l'errore) e un solo pulsante «Chiudi». Testi, esatti:
   - «Pubblicazione avviata. Il menù pubblico si aggiorna tra alcuni minuti.»
   - «Una pubblicazione è già stata avviata da poco. Attendi qualche minuto prima di riprovare.»
   - «Non è stato possibile avviare la pubblicazione. Riprova tra poco; se succede ancora, avvisa l'amministratore.»
   La bandiera resta false: il componente continua a non comparire. Se la finestra che mostra l'esito contrasta con
   la specifica integrazione §5, dichiaralo in Parte A.
3. scripts/verify-menu-6_5.ts + script pnpm «verify:menu-6_5» (stesso pattern di verify:menu-6_4, su vma_vd_dev,
   client FINTO, mai Google Cloud). Casi, ciascuno con esito OK/FALLITO:
   (a) senza sessione → 401; (b) utente senza accesso all'App → 403; (c) manager e (d) admin → 202 con una riga
   systemAction «rebuild-started: <id>» e senza utente; (e) secondo avvio entro 120 s → already-started, il client
   finto NON è richiamato e NON si aggiunge una riga; (f) variabile assente → 503, nessuna riga; (g) client che
   fallisce → 502, nessuna riga; (h) risposta senza id → 202 con «id non disponibile». Test unitari di lib/ per il
   calcolo della finestra e l'estrazione dell'id.
4. Documenti: la variabile MENU_REBUILD_TRIGGER_NAME nella tabella delle variabili di fase-6 (Dove: Cloud Run; Uso:
   nome completo della risorsa del trigger manuale; Sottofase: 6.5) e in .env.example se esiste. Nessuna
   migrazione: esegui migrate:create e conferma che NON genera differenze.

NON FARE: accendere la bandiera; modificare controlli, specifiche, schema o migrazioni; chiamare Google Cloud;
toccare il repo del menù; spuntare caselle della checklist di 6.5 (Parte A/B si spuntano ai passi 6 e 8).
```

**Cosa fai tu**: incolla la Parte A qui; poi il «procedi» in Cursor; alla fine incolla la risposta finale, fai il push e scrivi «push fatto». Il push fa partire il deploy di Cloud Run: nessun effetto visibile (bandiera spenta, variabile assente).

---

### Passo 2 — E1: connessione GitHub, service account dedicato, IAM in `vma-vd` (tuo)

**Niente in Cursor.** Dal terminale con `gcloud` autenticato come owner. Se un comando non è riconosciuto o dà un errore, **incollalo qui e fermati**: non improvvisare.

```sh
gcloud config set project vma-vd

# 1. Servizio dedicato alla build
gcloud iam service-accounts create vma-vd-menu-build \
  --display-name="Rebuild menù pubblico (Cloud Build)"

# 2. Può scrivere i log della build (obbligatorio con un service account dedicato)
gcloud projects add-iam-policy-binding vma-vd \
  --member="serviceAccount:vma-vd-menu-build@vma-vd.iam.gserviceaccount.com" \
  --role="roles/logging.logWriter"

# 3. Il runtime di Payload può avviare i trigger e usare quel service account
gcloud projects add-iam-policy-binding vma-vd \
  --member="serviceAccount:vma-vd-backoffice-run@vma-vd.iam.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.editor"
gcloud iam service-accounts add-iam-policy-binding \
  vma-vd-menu-build@vma-vd.iam.gserviceaccount.com \
  --member="serviceAccount:vma-vd-backoffice-run@vma-vd.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# 4. Connessione di 2ª generazione a GitHub (apri nel browser il link che il comando stampa e autorizza)
gcloud builds connections create github github-mirkomante --region=europe-west1

# 5. Collega il repository
gcloud builds repositories create vma-vd-menu \
  --remote-uri=https://github.com/mirkomante/vma-vd-menu.git \
  --connection=github-mirkomante --region=europe-west1
```

Se preferisci la console: Cloud Build → Repository → scheda «2ª generazione» → creare la connessione host con GitHub in `europe-west1`, poi collegare `mirkomante/vma-vd-menu` (le etichette possono differire).

**Verifica (sola lettura, incolla l'output qui)**:

```sh
gcloud builds repositories list --connection=github-mirkomante --region=europe-west1 --format="value(name)"
gcloud iam service-accounts get-iam-policy vma-vd-menu-build@vma-vd.iam.gserviceaccount.com
gcloud projects get-iam-policy vma-vd \
  --flatten="bindings[].members" \
  --filter="bindings.members:vma-vd-menu-build@vma-vd.iam.gserviceaccount.com OR bindings.members:vma-vd-backoffice-run@vma-vd.iam.gserviceaccount.com" \
  --format="table(bindings.role,bindings.members)"
```

Attesi: il nome del repository (`projects/vma-vd/locations/europe-west1/connections/github-mirkomante/repositories/vma-vd-menu`, **lo userai nei passi 4 e 7**); `iam.serviceAccountUser` per il runtime sul service account della build; `logging.logWriter` per il service account della build e `cloudbuild.builds.editor` per il runtime (oltre ai ruoli che il runtime ha già).

**Cosa dimostra**: l'identità e i permessi esistono prima di qualsiasi build. **Ritorno**: §7, riga E1.

---

### Passo 3 — M1: una riga nel `cloudbuild.yaml` del repo menù (mandato esplicito di Mirko)

**Incolla in Cursor**: una chat nuova **aperta su `vma-vd-menu`**, con le sue regole (`AGENTS.md`, `.method`). Mirko dà qui il mandato per **questo solo file**: la 6.5 non è altrimenti autorizzata a toccare quel repository.

```text
MANDATO: modifica minima del repository vma-vd-menu per la sottofase 6.5 del progetto madre VMA_VD.
Mirko lo autorizza esplicitamente, per questo solo file.

CONTESTO: i trigger Cloud Build useranno un service account dedicato. Con un service account dedicato i log della
build devono andare su Cloud Logging (o su un bucket nostro): senza l'opzione, la build fallisce. Il file non è
mai stato eseguito da un trigger.

FAI
1. In cloudbuild.yaml aggiungi, a livello principale (accanto a steps e substitutions), esattamente:
     options:
       logging: CLOUD_LOGGING_ONLY
   Nessun'altra modifica: né ai passi, né alle sostituzioni, né al digest dell'immagine Firebase CLI, né alle versioni.
2. Controlla che il file sia YAML valido (python3 -c "import yaml; yaml.safe_load(open('cloudbuild.yaml'))").
3. Registra la modifica come prevedono le regole di questo repository (AGENTS.md / docs): una riga datata
   «2026-11-16, mandato 6.5 di Mirko: aggiunta options.logging per il service account dedicato; cloudbuild.yaml
   ancora non eseguito da un trigger».
4. Commit locale con messaggio «chore: cloudbuild.yaml — logging su Cloud Logging per il service account dedicato (6.5)».
   Nessun push.

NON FARE: build, deploy, firebase, gcloud, modifiche a codice, dipendenze, documenti di consegna M-01/M-02,
evidenze, tag. Se una regola del repository impedisce questa modifica, fermati e dillo.
```

**Cosa fai tu**: controlla con `git show --stat HEAD` che sia cambiato **solo** `cloudbuild.yaml` (più la riga di registro, se la regola del repo la richiede, in un file di documentazione); poi `git push`. Non parte nessuna build: non esiste ancora alcun trigger. Scrivimi «push fatto sul menù».

**Ritorno**: `git revert` del commit.

---

### Passo 4 — E2: trigger di prova, prova da riga di comando, variabile su Cloud Run (tuo)

**Niente in Cursor.** Serve il nome del repository del passo 2 (`<REPO>`). Il trigger di prova **non fa deploy**.

```sh
cat > /tmp/menu-rebuild-prova.yaml <<'YAML_PROVA'
steps:
  - name: bash
    args: ['echo', 'Prova 6.5: nessun deploy']
options:
  logging: CLOUD_LOGGING_ONLY
YAML_PROVA

gcloud builds triggers create manual --region=europe-west1 --name=menu-rebuild-prova \
  --repository=<REPO> --branch=main --inline-config=/tmp/menu-rebuild-prova.yaml \
  --service-account=projects/vma-vd/serviceAccounts/vma-vd-menu-build@vma-vd.iam.gserviceaccount.com

# 1. Provalo SENZA l'App: deve finire SUCCESS in pochi secondi
gcloud builds triggers run menu-rebuild-prova --region=europe-west1 --branch=main
gcloud builds list --region=europe-west1 --limit=2 --format="table(id,status,createTime)"

# 2. Il nome completo della risorsa (è il valore della variabile)
gcloud builds triggers describe menu-rebuild-prova --region=europe-west1 --format="value(resourceName)"

# 3. Collega la variabile al servizio (mai --set-env-vars)
gcloud run services update vma-vd-backend-backoffice-git --region=europe-west1 \
  --update-env-vars=MENU_REBUILD_TRIGGER_NAME=<RISORSA_DEL_PUNTO_2>
```

Se `describe` non stampa il nome con `value(resourceName)`, usa `--format=json` e copia il campo `resourceName`. Se la build di prova **non** finisce in SUCCESS: `gcloud builds log <id> --region=europe-west1`, incolla l'errore qui e fermati.

**Incolla qui**: l'output di `builds list` e il valore della risorsa. **Cosa dimostra**: trigger, service account, log e sorgente collegata funzionano (F1, F2). **Ritorno**: §7, riga E2.

---

### Passo 5 — I2: accendere la bandiera e sbloccare i controlli rinviati

**Incolla in Cursor**: Blocco comune (§5) + il prompt che segue. Chat nuova.

```text
PASSO 5 — I2: accendere il pulsante «Ricompila il menù pubblico» e provare la sua presenza. Segue il Blocco comune.

LEGGI
- esecuzione-6.5-prompt-e-controlli.md §3 (decisioni 8 e 10)
- docs/design/schermate/integrazione/spec.md §5 e sezione 10; docs/design/verifica/controlli-6.6.json (solo i
  controlli elencati sotto); e2e/README.md e i test esistenti delle sette schermate
- components/app/menu/public-menu-rebuild-actions.tsx, menu-outcome-alert.tsx, lib/menu/publicMenuRebuild.ts

FAI (dopo la Parte A approvata)
1. Accendi la bandiera: PUBLIC_MENU_REBUILD_UI_ENABLED = true in lib/menu/publicMenuRebuild.ts (aggiorna il commento).
2. AUTORIZZAZIONE SPECIALE del pianificatore (proprietario dei controlli): in docs/design/verifica/controlli-6.6.json
   puoi cambiare SOLO i campi di stato di prova («stato_prova», «rinviato», «rinviato_a») e le relative note dei
   controlli: RICOMPILA-PRESENTE; piatti-ricompila, vini-ricompila, distillati-ricompila, bevande-ricompila,
   servizi-ricompila, menu-fissi-ricompila, giorni-speciali-ricompila; e la parte «coppia con Ricompila» di
   piatti-azioni-pagina, vini-azioni-pagina, distillati-azioni-pagina, bevande-azioni-pagina, servizi-azioni-pagina,
   menu-fissi-azioni-pagina, giorni-speciali-azioni-pagina. NON toccare piatti-disabilitato-ovunque: resta rinviato al
   collaudo dal vivo del passo 8. Elenca in Parte A, per ciascun controllo, come si prova e con quale test già esistente.
3. Prova mirata, UN solo giro: i test Playwright esistenti delle sette schermate e del Messaggio globale/home
   (assenza), usando i comandi della regola ui/03-ui-test-policy.mdc. La POST su /api/menu/rebuild va INTERCETTATA con
   una risposta finta (202, già avviata, errore): nessuna chiamata reale. Verifica: pulsante presente nelle sette
   intestazioni (anche nella scheda «Categorie» di Menù fissi), assente nel Messaggio globale e in home; finestra con il
   testo di docs/design; l'esito nella finestra; il pulsante «Ricompila» disabilitato durante la chiamata; la frase sul
   pulsante negli avvisi di salvataggio e di eliminazione. Niente matrice completa, niente screenshot, niente prove
   ripetute: solo ciò che i controlli sbloccati richiedono. Un controllo non eseguibile = NON PROVATO, dichiarato.
4. Aggiorna le note dello stato 6.6 SOLO dove dicono «bandiera spenta» o «rinviato alla 6.5» e ora non è più vero
   (esecuzione-6.6-prompt-e-controlli.md, §1.4 punto 1, con una riga datata; niente altro).

NON FARE: modificare i testi delle specifiche, aggiungere dipendenze, chiamare Google Cloud, toccare il repo del
menù, spuntare caselle della checklist di 6.5.
```

**Cosa fai tu**: Parte A qui, «procedi», risposta finale qui, push, «push fatto». **Attenzione**: dopo questo push il pulsante compare in produzione e punta al trigger di prova (variabile del passo 4): premerlo avvia una build che stampa un messaggio e non fa deploy. Oggi gli utenti in produzione sono due (admin e super-admin).

---

### Passo 6 — V1: collaudo della Parte A dal vivo (tuo)

**Prerequisiti (dichiarati prima, come da regola dei test live)**: un account **admin** con login Google sull'App di produzione (`https://vma-vd-backend-backoffice-git-437074136999.europe-west1.run.app/app`), da notebook; i passi 2, 4 e 5 fatti e pubblicati. L'«utente senza ruolo» **non esiste** in produzione: il suo caso è coperto da `verify:menu-6_5` (caso b), non si prova dal vivo.

1. Apri **Menù → Piatti**: il pulsante «Ricompila il menù pubblico» è nell'intestazione. Aprilo e premi **«Indietro»**: nessuna build deve partire (`gcloud builds list --region=europe-west1 --limit=1` invariato).
2. Riaprilo e premi **«Ricompila»**: la finestra mostra «Pubblicazione avviata…».
3. **Subito dopo** riaprilo e premi di nuovo: deve dire che una pubblicazione è già stata avviata e **non** partire una seconda build.
4. `gcloud builds list --region=europe-west1 --limit=3 --format="table(id,status,createTime)"`: **una sola** nuova build, `SUCCESS`, creata dal trigger di prova.
5. In **Admin → Registro attività**: una riga `rebuild-started: <id>` con lo **stesso id** della build, senza utente.
6. Senza sessione: `curl -s -o /dev/null -w "%{http_code}\n" -X POST https://vma-vd-backend-backoffice-git-437074136999.europe-west1.run.app/api/menu/rebuild` → deve stampare 401 (o 403).

**Incolla qui** l'output dei punti 4 e 6 e dimmi se i punti 1, 2, 3 e 5 sono andati come scritto. **Esito**: se tutti OK, la Parte A è collaudata (caselle «Parte A» e «utente senza ruolo» della checklist). Se un punto fallisce, **non proseguire al passo 7**.

---

### Passo 7 — E3: permessi sul Firebase del menù, due trigger veri, prova da riga di comando, cambio variabile (tuo)

**Niente in Cursor.** Prerequisito: il push del passo 3 è fatto (il `cloudbuild.yaml` con `options.logging` è su `main`). **Con la creazione del trigger al push, ogni push su `main` del repo menù avvierà un deploy sul sito pubblicato**: è voluto.

```sh
# 1. Permessi sul progetto Firebase del menù (PARTENZA MINIMA, caso incrociato)
gcloud projects add-iam-policy-binding vma-vd-menu \
  --member="serviceAccount:vma-vd-menu-build@vma-vd.iam.gserviceaccount.com" \
  --role="roles/firebasehosting.admin"
gcloud projects add-iam-policy-binding vma-vd-menu \
  --member="serviceAccount:vma-vd-menu-build@vma-vd.iam.gserviceaccount.com" \
  --role="roles/serviceusage.apiKeysViewer"

# 2. I due trigger veri (stesso cloudbuild.yaml; le variabili sono i valori predefiniti nel file)
gcloud builds triggers create manual --region=europe-west1 --name=menu-rebuild-manuale \
  --repository=<REPO> --branch=main --build-config=cloudbuild.yaml \
  --service-account=projects/vma-vd/serviceAccounts/vma-vd-menu-build@vma-vd.iam.gserviceaccount.com
gcloud builds triggers create github --region=europe-west1 --name=menu-rebuild-push-main \
  --repository=<REPO> --branch-pattern='^main$' --build-config=cloudbuild.yaml \
  --service-account=projects/vma-vd/serviceAccounts/vma-vd-menu-build@vma-vd.iam.gserviceaccount.com

# 3. PROVA SENZA L'APP: la prima build vera
gcloud builds triggers run menu-rebuild-manuale --region=europe-west1 --branch=main
gcloud builds list --region=europe-west1 --limit=1 --format="table(id,status,createTime)"
```

Se `triggers create github` non accetta `--repository`, usa `gcloud beta builds triggers create github` con gli stessi flag.

**Se la build fallisce** (`gcloud builds log <id> --region=europe-west1`):
- errore che nomina un permesso mancante sul progetto `vma-vd-menu` → aggiungi **solo** quello (prima `roles/serviceusage.serviceUsageConsumer`; come ultima scelta `roles/firebase.admin`, il ruolo che indica la guida), e **annota quale è servito**;
- errore sul piano Spark o sulla fatturazione (F6) → **fermati e incollami l'errore**, non aggirare;
- errore sull'immagine Node o su Corepack (F7) → fermati e incollami l'errore.

**Quando la build è `SUCCESS`**, controlla che il sito sia sano (`https://vma-vd-menu.web.app/it/test/`, quattro OK, «ora della build» nuova) e poi cambia la variabile:

```sh
gcloud builds triggers describe menu-rebuild-manuale --region=europe-west1 --format="value(resourceName)"
gcloud run services update vma-vd-backend-backoffice-git --region=europe-west1 \
  --update-env-vars=MENU_REBUILD_TRIGGER_NAME=<RISORSA_DI_menu-rebuild-manuale>
```

**Incolla qui**: l'output di `builds list`, i ruoli che sono serviti oltre alla partenza minima, e il valore della risorsa. **Cosa dimostra**: il deploy cross-progetto funziona con la build vera, prima di toccare l'App (F4, F6, F7). **Ritorno**: §7, riga E3.

---

### Passo 8 — V2: collaudo della Parte B, sequenza di sei passaggi (tuo)

**Prerequisiti**: passo 7 chiuso (variabile sul trigger manuale); account admin come al passo 6; il menù vecchio (vecchio backend) non c'entra e non si tocca. Pagina da guardare: `https://vma-vd-menu.web.app/it/test/` (build, numero piatti, nome del primo, disponibilità). Ogni «aspetta» è il tempo di una build: controlla con `gcloud builds list --region=europe-west1 --limit=1`.

| # | Fai | Atteso |
|---|---|---|
| 1 | In **Menù → Piatti** premi «Ricompila» e conferma | Avviata; nuova build `SUCCESS` del trigger **manuale**; riga `rebuild-started` con l'id nel registro |
| 2 | Aspetta la build e ricarica `/it/test/` | L'«ora della build» è cambiata |
| 3 | Crea il piatto **«0 Prova 6.5»** (nome italiano), salva, premi «Ricompila», aspetta, ricarica | Il numero dei piatti passa da 44 a **45** |
| 4 | Sul **primo piatto mostrato dalla pagina** (id e nome sono scritti lì) premi «Terminato»; **senza ricompilare** ricarica `/it/test/` dopo circa un minuto | La disponibilità mostra il nuovo stato; «ora della build» invariata. Poi ripristina il piatto |
| 5 | In **Messaggio globale** scrivi «Prova 6.5», salva; ricarica `/it/test/` dopo circa un minuto; poi svuota il messaggio e salva | Il messaggio compare e poi sparisce, senza ricompilare |
| 6 | Dalla radice del repo menù: `git commit --allow-empty -m "chore: prova trigger al push (6.5)"` e `git push` | Parte una build del trigger **al push**; l'«ora della build» cambia |
| 7 | **Pulizia**: elimina «0 Prova 6.5», premi «Ricompila», aspetta, ricarica | Il numero dei piatti torna a **44** |
| 8 | **Disabilitato**: su un piatto già disabilitato (ne sono 3) controlla `https://storage.googleapis.com/vma-vd-menu-availability/disponibilita.json` | Il piatto risulta come previsto dal contratto (`hidden`), senza ricompilare. Chiude il controllo rinviato `piatti-disabilitato-ovunque` |

Per ogni punto, se qualcosa non torna, **fermati e incollami cosa vedi** (schermata o output): non ripetere a caso.

**Incolla qui** una riga per punto: OK o cosa hai visto, con l'id e l'ora della build dei punti 1, 3 e 6. **Esito**: i sei passaggi della sequenza (1-6) verificati e i due trigger creati = casella «Parte B» della checklist; il punto 7 riporta i dati allo stato iniziale; il punto 8 chiude il controllo rinviato.

---

### Passo 9 — I3: documentazione operativa e chiusura documentale

**Incolla in Cursor**: solo questo prompt, **compilato da me dopo il passo 8** (i campi `<…>` sono quelli che cambiano). Chat nuova. Nessuna Parte A: solo documenti.

```text
PASSO 9 — I3: documentazione operativa e chiusura documentale della 6.5. Solo documenti; nessun codice, nessuna
infrastruttura, nessun comando gcloud o firebase.

FILE AMMESSI
docs/operativo/menu-rebuild-cloud-build.md (NUOVO); docs/piano-sviluppo/fase-6-menu-digitale.md;
docs/piano-sviluppo/00-piano-generale.md; docs/piano-sviluppo/piano.yaml;
docs/piano-sviluppo/ADR-105-strategia-rendering-comunicazione-siti-esterni.md;
docs/piano-sviluppo/CHANGELOG.md; docs/piano-sviluppo/esecuzione-6.5-prompt-e-controlli.md (solo la tabella del §4).

DATI REALI (usa solo questi)
- Trigger: menu-rebuild-manuale <id>, menu-rebuild-push-main <id>, menu-rebuild-prova <id> (<eliminato/da eliminare>),
  regione europe-west1, repository 2ª generazione <nome risorsa>, connessione github-mirkomante.
- Service account vma-vd-menu-build@vma-vd.iam.gserviceaccount.com; ruoli in vma-vd: <elenco>; sul progetto vma-vd-menu:
  <ruoli che sono serviti davvero>; per il runtime: cloudbuild.builds.editor e serviceAccountUser sul service account.
- Variabile Cloud Run MENU_REBUILD_TRIGGER_NAME = <risorsa del trigger manuale>.
- Prove: <id e ore delle build dei passi 4, 6, 7 e 8>; esiti dei punti 1-8 del passo 8: <esiti>.
- cloudbuild.yaml del repo menù: aggiunta options.logging: CLOUD_LOGGING_ONLY (commit <hash>, mandato 2026-11-16).
- Scostamenti da registrare: (1) variabili di sostituzione come valori predefiniti nel file e non sui trigger;
  (2) ruoli sul Firebase diversi/ulteriori rispetto alla partenza minima: <…>; (3) avvio non attribuito a un utente nel
  registro (ADR-115, systemAction senza utente); (4) conferma dell'esito della build (Pub/Sub) fuori dalla 6.5;
  (5) <altri emersi>.

FAI
1. Crea docs/operativo/menu-rebuild-cloud-build.md: risorse, service account e ruoli, trigger e regione, variabile e
   come si cambia (mai --set-env-vars), comandi per avviare e leggere una build, come si torna indietro. Nessun segreto,
   nessun indirizzo email.
2. fase-6 §6.5: stato ✅ SOLO se il passo 8 è andato OK per tutti i punti, altrimenti «🔶» con ciò che manca; spunta le
   voci di checklist sostenute dai dati sopra; scostamenti accanto alle voci; rimanda al documento operativo. NON
   dichiarare conclusa la fase 6 (restano la revisione a mano dei contenuti e la 6.7, fuori perimetro).
3. 00-piano-generale.md: riga della 6.5 e «Prossimi passi». piano.yaml: fase-6.5 stato e nota; validalo con
   python3 -c "import yaml; yaml.safe_load(open('docs/piano-sviluppo/piano.yaml'))".
4. ADR-105: nuova «Nota di chiarimento (<DATA>, esito della 6.5)» che non modifica la decisione: trigger, regione,
   service account, ruoli effettivi, scostamenti 1 e 3.
5. CHANGELOG: una voce in [Unreleased], una sola intestazione per sezione, con SOLO ciò che è stato eseguito.
6. Tabella del §4 di questo file: passi 1-9 con gli hash che ti do io; non toccare altro.

CONTROLLO PRIMA DEL COMMIT: con grep verifica che nome dei trigger, variabile, service account e ruoli coincidano in
tutti i file e che nessun file dichiari conclusa la fase 6. Commit locale: «docs: 6.5 — documentazione operativa e
chiusura documentale». Nessun push.
```

**Cosa fai tu**: incolli, controlli con `git show --stat HEAD` che i file siano quelli ammessi, push, «push fatto».

---

### Passo 10 — C1: controllo del pianificatore e chiusura

Faccio da clone pulito lo stesso controllo della 6.9: valori incrociati tra i documenti, `piano.yaml` valido, nessuna dichiarazione di fase 6 conclusa. In più leggo il diff del codice dei passi 1 e 5 (nessuna dipendenza nuova, nessuna migrazione, bandiera, `verify:menu-6_5` con esiti reali). Ti dico se la 6.5 si può dichiarare chiusa. Se qualcosa non torna, ti do un prompt di correzione.

---

## 7. Come si torna indietro

Nessun passo tocca il menù attuale, il database o i contenuti veri. Ogni passo si annulla da solo:

| Passo | Ritorno |
|---|---|
| I1, I2 | `git revert` del commit e push. Prima ancora: `gcloud run services update vma-vd-backend-backoffice-git --region=europe-west1 --remove-env-vars=MENU_REBUILD_TRIGGER_NAME` (il pulsante mostra l'errore e non parte nulla) |
| E1 | `gcloud iam service-accounts delete vma-vd-menu-build@vma-vd.iam.gserviceaccount.com`; rimozione dei due ruoli del runtime; eliminazione della connessione e del repository collegato in Cloud Build |
| M1 | `git revert` nel repo menù |
| E2 | `gcloud builds triggers delete menu-rebuild-prova --region=europe-west1` e rimozione della variabile come sopra |
| E3 | `gcloud builds triggers delete menu-rebuild-manuale --region=europe-west1` e lo stesso per `menu-rebuild-push-main`; rimozione dei ruoli sul progetto `vma-vd-menu`. Se un deploy di prova ha rotto il sito diagnostico, le versioni precedenti restano nella cronologia di Firebase Hosting (non è il menù in uso) |
| V1, V2 | Il piatto temporaneo si elimina, il messaggio globale si svuota, «terminato» si ripristina (il punto 7 del passo 8 lo fa) |

---

## 8. Limiti e debiti dichiarati in anticipo

- **L'avvio non è attribuito a un utente** nel registro (`ADR-115`: azioni di sistema senza utente). Non si sa chi ha premuto il pulsante.
- **La conferma dell'esito della build** (Pub/Sub sul cambio di stato) non è nella 6.5: l'App dice «avviata», non «pubblicata».
- **Le variabili di sostituzione** stanno nel file e non sui trigger (decisione 9): cambiare un URL richiede un commit nel repo menù.
- **Non verificati fino al passo 7**: deploy su Hosting in piano Spark da una build di un altro progetto (F6); immagine Node e Corepack in Cloud Build (F7); ruoli minimi esatti sul progetto Firebase (F4).
- **La bandiera sta nel codice**: spegnerla richiede un deploy (la variabile su Cloud Run, invece, si toglie subito).
- **Fuori dalla 6.5**: la revisione a mano dei contenuti, il frontend vero (6.7), il dominio definitivo, la conferma Pub/Sub e le voci `[ ]` residue di 6.6 e 6.8.
