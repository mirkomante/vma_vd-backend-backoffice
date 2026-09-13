# ADR — Strategia di rendering e comunicazione con i siti esterni

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-09-13
**Arco di decisione**: Fase 4.3 → Fase 4.4 (`arco-05` di `piano.yaml`): il vincolo Draft Mode/Cookies chiuso in `ADR-004-meccanismo-preview-contenuti.md` esclude lo static export puro (`output: 'export'`) per vietnamonamour.com e villadoree.com e restringe la scelta di compilazione a SSR pieno o ISR selettivo. Fase 4.4 → Fase 6.5 (`arco-19`): lo stesso principio trasversale (CI/CD sempre su Cloud Build, mai GitHub Actions) e lo stesso meccanismo verificato di trigger si applicano identicamente al rebuild del menù SSG. Dipende da `ADR-004-meccanismo-preview-contenuti.md` (vincolo tecnico già chiuso, non riaperto qui).

## Contesto

Questo ADR **documenta una decisione già presa** in sessione di analisi (`riepilogo-sessione-bucket-d.md` §2 e §5), non la prende: la scelta finale — ISR on-demand, non SSR pieno, non a intervallo fisso — è chiusa e non va rimessa in discussione qui.

Restava da fissare, dopo che `ADR-004` aveva già chiuso il meccanismo di preview e il vincolo tecnico che esclude lo static export puro: (a) come i due siti CMS e il menù comunicano con `(payload)`/`(app)` per il contenuto pubblicato e per gli aggiornamenti strutturali, e (b) come si tiene aggiornata la cache delle pagine renderizzate una volta esclusa sia la rigenerazione ad ogni richiesta (SSR pieno, sprecato su contenuti che cambiano 1-2 volte l'anno) sia l'export statico puro (incompatibile con le route di preview dinamiche). Fase 4.4 e Fase 6.5 non possono procedere senza questa scelta fissata, perché condiziona sia la modalità di deploy dei due siti su Firebase Hosting sia il meccanismo di rebuild del menù SSG.

## Decisione

**Comunicazione `(payload)`/`(app)` ↔ siti esterni**:
- Letture di contenuto pubblicato (vietnamonamour.com, villadoree.com): REST diretto, **nessun token** — è dato già pubblico. Il token resta riservato esclusivamente al meccanismo di preview delle bozze (`ADR-004`, invariato).
- Form "Prenota un tavolo": resta una POST pubblica REST verso il sistema prenotazioni, `create` aperto con validazione lato Payload, nessun token — form per visitatori anonimi.
- Aggiornamento `disponibilita.json`: invariato — Cloud Scheduler → endpoint Payload → riscrittura su GCS.
- Rebuild del menù SSG per modifiche strutturali: **pulsante manuale "Ricompila il menù pubblico"** nel backoffice `(app)`, non hook automatico `afterChange`. I cambi strutturali del menù sono rari e tipicamente in batch (un manager compone un nuovo menù in un'unica sessione); il trigger manuale evita rebuild ridondanti e dà controllo esplicito su "quando pubblico davvero".

**Meccanismo di rebuild verificato** (sempre Cloud Build, mai GitHub Actions — principio trasversale di progetto):
1. Trigger Cloud Build manuale (non da push) collegato a `vtn-menu-ristorante-next` tramite l'integrazione nativa Cloud Build↔GitHub (GitHub resta solo hosting sorgente).
2. Un endpoint Payload custom invoca l'API `projects.triggers.run` di Cloud Build.
3. Step di build sull'immagine ufficiale `us-docker.pkg.dev/firebase-cli/us/firebase`, che esegue `firebase deploy --project PROJECT_ID --only hosting`.
4. IAM: il service account di Payload necessita `roles/cloudbuild.builds.editor` (+ `iam.serviceAccountUser` sul service account della build, se dedicato).
5. Feedback fire-and-forget: id della build loggato in `activityLog`; la conferma dell'esito del deploy (vs. solo "avviato") resta un punto aperto non bloccante.

**Revalidation dei due siti CMS**: **ISR on-demand**. Un hook `afterChange` su Payload chiama l'endpoint di revalidation (`revalidatePath`/`revalidateTag`) del sito interessato, protetto da secret condiviso.

Motivazione: i contenuti di entrambi i siti cambiano 1-2 volte l'anno, il che rende uno SSR pieno uno spreco di costo e latenza su Firebase Hosting (una funzione invocata ad ogni visita per rileggere un contenuto che non cambia da mesi). ISR serve le pagine dalla CDN di Firebase Hosting per il traffico ordinario e rigenera solo alla pubblicazione effettiva. La modalità on-demand, rispetto a un intervallo fisso, evita finestre di attesa arbitrarie tra pubblicazione e aggiornamento pubblico, e riusa lo stesso pattern "notifica esterna al cambiamento" già adottato per il rebuild del menù. Il vincolo Draft Mode di `ADR-004` resta soddisfatto: le route di preview restano dinamiche (Cloud Functions/Cloud Run dietro Firebase Hosting), le pagine pubbliche restano statiche/cacheate.

## Alternative considerate

- **SSR pieno** — scartato: rigenera ad ogni visita un contenuto che cambia 1-2 volte l'anno, spreco di costo/latenza su Firebase Hosting.
- **Static export puro (`output: 'export'`)** — già escluso da `ADR-004`: Draft Mode e Cookies richiedono un runtime Node per-request, incompatibile con l'export statico.
- **ISR a intervallo fisso** — scartato rispetto a on-demand: introduce una finestra di attesa arbitraria tra pubblicazione e aggiornamento pubblico, senza motivo dato che esiste già un evento preciso (il salvataggio in Payload) da cui far scattare la rigenerazione.
- **Hook automatico `afterChange` per il rebuild del menù SSG** — scartato in favore del pulsante manuale: i cambi strutturali sono rari e in batch, un hook automatico produrrebbe rebuild multipli e ridondanti durante una singola sessione di modifica.
- **Token anche per le letture di contenuto pubblicato** — scartato: il contenuto è già pubblico, un token aggiungerebbe solo overhead di gestione senza alcun beneficio di sicurezza.
- **GitHub Actions per il CI/CD del rebuild** — escluso dal principio trasversale di progetto: CI/CD sempre su Cloud Build, GitHub resta solo hosting del codice sorgente (anche perché Cloud Source Repositories non è più disponibile per nuovi clienti dal giugno 2024).

## Conseguenze

Fase 4.4 eredita la modalità di compilazione (ISR on-demand su Firebase Hosting) per entrambi i siti CMS, il pattern di comunicazione REST senza token per il contenuto pubblicato e senza token per il form prenotazioni, e l'hook `afterChange` di revalidation da implementare lato Payload.

Fase 6.5 eredita l'intero meccanismo Cloud Build (trigger manuale, endpoint custom, builder `firebase-tools`, IAM) come pattern già verificato, da applicare al rebuild del menù SSG invocato dal pulsante di backoffice — nessuna nuova valutazione di alternative CI/CD necessaria a valle.

Restano punti aperti, non bloccanti per questo ADR: nome/percorso esatto dell'endpoint di revalidation e del secret condiviso con i due siti CMS; credenziali/service account dedicati al trigger Cloud Build; meccanismo di notifica di completamento/fallimento del rebuild menù (candidato: Pub/Sub su cambio stato build), oggi solo fire-and-forget con log dell'id build.
