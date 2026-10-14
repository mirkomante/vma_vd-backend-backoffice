# ADR — Istanza Cloud SQL for PostgreSQL di produzione: dedicata, sizing, disponibilità

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-09-26 (validata dall'utente in chat, stessa data)
**Arco di decisione**: nuovo — non presente in `piano.yaml` alla composizione iniziale (Passo 0, 2026-09-13), emerso durante la pianificazione operativa di Fase 3.1. Da registrare come **`arco-26`** (prossimo id libero): `fase-3` → `fase-3.4` (bootstrap, dipende solo dalla raggiungibilità dell'istanza) e, soprattutto, `fase-3` → `fase-5.x`/`fase-6.x` (migrazione dati reali di prenotazioni e go-live pubblico del menù, che condizionano la rivalutazione della disponibilità, §3). Risolve inoltre un rimando circolare tra `fase-3-db-postgres.md` §3.1 ("region allineata all'ambiente cloud, § 3.2") e `fase-3-cloud-gcp.md` §3.2 ("region allineata al database, § 3.1") fissando qui il valore concreto.

## Contesto

Fase 3 richiede la creazione di un'istanza Cloud SQL for PostgreSQL di produzione (`fase-3-db-postgres.md` §3.1). Il file di catalogo lascia aperti tier, disponibilità e rapporto con infrastruttura preesistente ("tier minimo adeguato alla scala attesa del progetto — rivalutare se il progetto si avvicina all'uso reale con carichi più alti"): non è quindi una deviazione da un default di catalogo, ma una scelta di progetto in un'area lasciata intenzionalmente aperta.

Il progetto ha già un'istanza Cloud SQL in uso reale — `vtn-postgres` (PostgreSQL 17, Enterprise, `db-f1-micro`, **alta affidabilità attiva**, europe-west1) — che serve oggi il menù digitale in produzione sul sistema legacy. Le prenotazioni girano invece su MySQL, droplet DigitalOcean singolo, **senza alcuna HA**. `vtn-postgres` verrà dismessa alla pubblicazione di VMA VD; non è quindi un'opzione di lungo periodo, e VMA VD vive comunque su un progetto GCP separato.

Fase 3 espone solo login/backoffice: nessun traffico ospiti tocca ancora questa istanza. Menù e prenotazioni reali migrano qui solo in Fase 6 e Fase 5. `core/01-proporzionalita.mdc` fissa il criterio rilevante per l'intero progetto: *"il traffico pubblico è reale — prenotazioni e consultazione menù arrivano da ospiti, non solo dallo staff: un disservizio è visibile ai clienti finali"* — criterio che oggi non si applica ancora a questa istanza specifica, ma che si riattiva integralmente non appena Fase 5/6 vi spostano carico reale.

## Decisione

**Nuova istanza dedicata**, non condivisione di `vtn-postgres`: progetto GCP separato, ciclo di vita indipendente da un'istanza in via di dismissione.

| Parametro | Scelta | Motivazione |
|---|---|---|
| Versione | PostgreSQL 18 | Schema nuovo da zero, nessun debito di migrazione dalla 17 di `vtn-postgres` |
| Edition | Enterprise | Enterprise Plus non supporta le classi shared-core (`db-f1-micro`) |
| Tipo macchina | `db-f1-micro` (1 vCPU burstable, 0,614 GB RAM) | Stesso tier già in produzione su `vtn-postgres` per un carico analogo o superiore (menù live); ampio margine per il solo backoffice di Fase 3; coerente con `pool: { max: 3 }` lato adapter Payload per il limite di connessioni shared-core |
| Regione | **europe-west1** | Coerente con `vtn-postgres` e con l'ambiente cloud di Fase 3.2 (fissa qui il rimando circolare tra `fase-3-db-postgres.md` §3.1 e `fase-3-cloud-gcp.md` §3.2) |
| Disponibilità | **Zona singola, nessuna HA all'avvio** — vedi §3 per il criterio di rivalutazione | Nessun carico critico H24 finché prenotazioni/menù reali non migrano qui; il sistema che questa istanza sostituisce per le prenotazioni (droplet MySQL) non ha HA |
| Storage | 10 GB SSD, aumento automatico | Database vuoto in partenza |
| Rete | IP pubblico + solo connessioni SSL, **nessuna rete autorizzata manuale** | Sia Cloud Run sia `scripts/prod-db.sh` (locale) passano da Cloud SQL Auth Proxy con IAM — nessuna allow-list IP da mantenere, nessun Private IP/VPC introdotto (coerente con `fase-3-db-postgres.md` §3.1, "non introdurre Private IP/VPC se il progetto non lo richiede esplicitamente") |
| Backup | Automatici + PITR, 7 giorni, protezione da eliminazione istanza | Costo trascurabile, alto valore — indipendente dalla scelta su HA |
| Utente database | Uno solo, permessi sul solo database di progetto | Standard di catalogo (`fase-3-db-postgres.md` §3.1), nessuna deviazione |

### §3 — Criterio di rivalutazione HA

Prima che dati reali di prenotazioni (Fase 5) o il go-live pubblico del menù (Fase 6) su questa istanza entrino in produzione, l'attivazione di HA va rivalutata **esplicitamente** come voce della checklist di chiusura di quella fase — non lasciata implicita né rimandata senza una scadenza concreta.

## Alternative considerate

- **Riuso di `vtn-postgres` condivisa** — scartata: è su un progetto GCP diverso destinato alla dismissione; condividerla legherebbe il ciclo di vita di VMA VD a un'istanza in uscita, oltre a mescolare PostgreSQL 17/18 e schemi di due progetti sulla stessa istanza.
- **HA attiva da subito** — scartata per questa fase: nessun carico ospiti dipende oggi da questa istanza (menù e prenotazioni restano sui sistemi legacy fino a Fase 5/6); l'SLA formale di Cloud SQL copre solo le istanze Multi-zone (99,95%, 99,99% con Enterprise Plus) — un'istanza a zona singola non ha un impegno contrattuale specifico, ma lo storico incidenti pubblico di GCP mostra per le zone europe-west un ordine di grandezza di 0-2 eventi/anno per zona, tipicamente da un'ora a poche ore quando capitano, senza impatto sui dati grazie a backup/PITR indipendenti dall'HA. Non riattivabile in silenzio: vedi trigger esplicito in §3.
- **Enterprise Plus** — scartata: non necessaria per raggiungere `db-f1-micro`/costo minimo; il salto di SLA (99,95% → 99,99%) ha senso solo insieme a HA, quando servirà davvero (§3).
- **Private IP / Serverless VPC Connector** — scartata: complessità di rete non richiesta esplicitamente dal progetto, stesso principio di proporzionalità già applicato all'allowlist Atlas nel gemello MongoDB (`fase-3-db-postgres.md` §3.1).

## Conseguenze

- **Fase 3.1** procede con la creazione dell'istanza secondo la tabella in §2.
- **Fase 3.4** (bootstrap) eredita solo il vincolo di raggiungibilità via Cloud SQL Auth Proxy/connessione nativa Cloud Run — nessun impatto da HA/no-HA.
- **Fase 3.2** (`fase-3-cloud-gcp.md`) eredita la regione **europe-west1** come vincolo fissato qui, chiudendo il rimando circolare col catalogo.
- **Fase 5.x e Fase 6.x** ereditano l'obbligo di rivalutare esplicitamente l'HA prima del go-live reale su questa istanza (§3) — punto aperto non bloccante ora, bloccante allora.
- `piano.yaml` va aggiornato con un nuovo nodo `arco-26` (tipo `decisione`, `da: fase-3`, `a: fase-5.x`/`fase-6.x`, `adr: "ADR-110-istanza-cloud-sql-produzione.md"`), non presente alla composizione iniziale.

## Nota di chiarimento (2026-10-12, rivalutazione dell'HA per il go-live del menù)

Chiude la rivalutazione di §3 per il **menù digitale** (`arco-27`). Non modifica i parametri dell'istanza né il criterio di §3 per la Fase 5 (`arco-26`), che resta aperto.

- **Decisione** (Mirko, 2026-10-12): **nessuna HA** per il go-live del menù. Si rivaluta **prima che dati reali di prenotazioni (5.3) entrino su questa istanza**, oppure prima di aggiungervi altri servizi, oppure se il menù diventa critico per il business.
- **Motivazione**: un fermo del database non è critico per il tipo di applicazione. Il menù pubblico è statico (pagine generate alla build, `ADR-105`) e lo stato delle voci sta in un file su un bucket (`ADR-112` §3): un fermo del database ferma il backoffice e i rebuild, non le pagine già pubblicate.
- **Fatti verificati sulla documentazione ufficiale di Google (consultata il 2026-10-12)**: lo SLA di Cloud SQL non copre le istanze shared-core né quelle a zona singola; l'impegno (99,95%) vale solo per l'edizione Enterprise con HA. `db-f1-micro` non è coperto dallo SLA **neppure con HA attiva**: per avere uno SLA servirebbero HA **e** un core dedicato, cioè un cambio di tipo di macchina, non solo l'attivazione dell'HA. Dove vale, lo SLA dà un credito sulle bollette future, non un tempo di ripristino garantito. Questa istanza **non ha quindi nessuno SLA**: la decisione non poggia su di esso. Precisa il testo di «Alternative considerate» («l'SLA formale copre solo le istanze Multi-zone»), che non nominava l'esclusione dello shared-core.
- **Configurazione verificata** (2026-10-12, `gcloud sql instances describe vma-vd-database`): `db-f1-micro`, `ZONAL`, `ENTERPRISE`. Il riquadro dell'edizione nella console («99,95% di disponibilità garantita dallo SLA», manutenzione pianificata sotto i 60 secondi) descrive l'edizione Enterprise in generale, non questa istanza: vale la definizione di «servizio coperto» dello SLA, che esclude shared-core e zona singola. La riga sui 60 secondi non è stata verificata.
- **Costo, per riferimento**: `db-f1-micro` on-demand, 0,0105 USD/ora in zona singola e 0,021 USD/ora con HA (circa 7,7 e 15,3 USD al mese). Cifre dalla pagina dei prezzi ufficiale, letta in una copia datata e senza indicazione della regione: **non verificate per `europe-west1`**. Prezzi di una macchina a core dedicato con HA: non raccolti.
- **Rischio accettato**: la durata di un fermo di zona non è garantita da nessun impegno contrattuale. I dati restano protetti dai backup automatici e dal ripristino a un istante preciso (7 giorni), indipendenti dall'HA.

## Nota di chiarimento (2026-10-13, nuovo criterio di rivalutazione dell'HA)

Sostituisce il criterio temporale di §3 e quello della nota del 2026-10-12 per **entrambi** gli archi (`arco-26` Fase 5, `arco-27` Fase 6). Non modifica i parametri dell'istanza.

- **Decisione** (Mirko, 2026-10-13): l'alta affidabilità si rivaluta **dopo la conclusione dello sviluppo e dopo il primo mese di utilizzo reale**, non più «prima che dati reali di prenotazioni entrino su questa istanza». Fino ad allora l'istanza resta in **zona singola, senza HA e senza SLA**, anche quando ospiterà le prenotazioni. Punto aperto `po-12`.
- **Cosa implica**: le prenotazioni conterranno dati personali dei clienti. I dati restano protetti da backup automatici e ripristino a un istante preciso (7 giorni), indipendenti dall'HA. Il rischio accettato è la **durata di un fermo di zona**, che nessun impegno contrattuale limita.
- **Alla rivalutazione**: verificare i prezzi aggiornati (le cifre della nota del 2026-10-12 non sono verificate per `europe-west1`) e tenere presente che uno SLA richiede HA **e** un core dedicato, cioè un cambio di tipo di macchina.
