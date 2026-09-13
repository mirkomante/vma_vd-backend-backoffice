# ADR — Global di configurazione trasversale (`impostazioni-sistema`)

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-09-13
**Arco di decisione**: Fase 5.1 (`arco-21`) e Fase 6.1 (`arco-22` di `piano.yaml`) → Fase 7.2 — fonte unica orari/chiusure del ristorante: i due Global esistenti ("Impostazioni prenotazioni", "Generali" del menù) convergono nel nuovo Global `impostazioni-sistema`. Include come archi "output", richiamati solo in Conseguenze: `arco-23` (Fase 2 → Fase 7.4, meccanismo di access control nativo Payload già convenzionato) e `arco-24` (Fase 5.4 → Fase 7.3, id Google Calendar come riferimento non sensibile). **Dipendenza reale** da `ADR-007-modello-dati-sistema-prenotazioni.md` §1, che questo ADR emenda (rimozione di tre campi orario/chiusura) — e tocca per sola inferenza il Global "Generali" del menù, mai formalizzato campo-per-campo in `ADR-008-modello-dati-menu-digitale.md` (nessun amendment necessario lì, vedi §4). Sbloccato dalla sessione dedicata `riepilogo-sessione-impostazioni-sistema.md`. **Ultimo ADR della sequenza del punto 3** di `tracciamento-processo-adr-dag.md`.

## Contesto

Il Global `impostazioni-sistema` è stato individuato come necessario in `riepilogo-sessione-bucket-c.md` §3: un posto unico per la configurazione tecnica trasversale al backend (analogia con le Preferenze di Sistema di macOS/iOS), distinto sia dal contenuto di ciascun sito (`impostazioni-vma`/`impostazioni-villadoree`) sia dalla configurazione di ogni singola area funzionale. Quella sessione ha già fissato, e non viene qui rimesso in discussione: l'esistenza e il naming del Global; la distinzione tra vere credenziali (client secret, chiavi service account, API key — mai in un campo Payload, sempre in variabili d'ambiente o secret manager) e riferimenti non sensibili (es. l'id del calendario Google, che il Global può ospitare); le cinque esigenze cross-area enumerate (fonte unica orari/chiusure, id Google Calendar, mittenti Resend, contatti notifiche staff, slot per integrazioni future).

La struttura a tab e i campi per tab restavano però non progettati, bloccando l'intera Fase 7 e l'unico ADR della sequenza ancora non scrivibile. Una sessione dedicata (`riepilogo-sessione-impostazioni-sistema.md`) ha sbloccato fase-7.1 fissando: la struttura a 4 tab e i relativi campi; la riconciliazione campo-per-campo tra `impostazioni-sistema` e i due Global che oggi contengono dati di orario/chiusura duplicati — "Impostazioni prenotazioni", il cui schema è fissato in `ADR-007-modello-dati-sistema-prenotazioni.md` §1, e "Generali" del menù, mai formalizzato campo-per-campo in nessun ADR o riepilogo, ricostruito per inferenza; la tabella di permessi granulari campo-per-campo. Questo ADR formalizza quelle decisioni senza rimetterle in discussione, e ne rende esplicito l'impatto come amendment su `ADR-007` §1.

## Decisione

### 1. Struttura a tab

4 tab (non 5 — vedi Alternative considerate), puro raggruppamento visivo Payload, stesso precedente stilistico di `ADR-001-modello-contenuti-siti-esterni.md` §2 (tab Generali/Header/Footer): l'access control resta a livello di singolo campo, non di tab-container, coerente con `ADR-002-divisione-area-di-gestione.md` §6.

| Tab | Campi | Esigenza coperta (`riepilogo-sessione-bucket-c.md` §3) |
|---|---|---|
| **Orari e Chiusure** (`orari-chiusure`) | `servizi` (array, 2 voci fisse: `nome` select pranzo/cena, `orario-inizio` timeOnly, `orario-fine` timeOnly), `giorni-riposo-settimanale` (select `hasMany`), `chiusure-annuali` (array: `data` dayOnly, `etichetta` text) | Punto 1 — fonte unica orari/chiusure |
| **Calendario** (`calendario`) | `google-calendar-id` (text) — riferimento, non credenziale | Punto 2 |
| **Comunicazioni** (`comunicazioni`) | `mittenti-resend` (array: `mittente`, `dominio-riferimento`/etichetta di scope), `contatti-notifiche-staff` (array: `nome`, `email`) | Punti 3 e 4 |
| **Integrazioni future** (`integrazioni-future`) | nessun campo per ora — solo lo spazio riservato nella struttura a tab | Punto 5 |

Funzione di supporto ereditata da `ADR-007` §1: il pulsante che precompila `chiusure-annuali` con le festività italiane note resta valido, applicato ora al campo nella sua nuova collocazione su `impostazioni-sistema`.

### 2. Riconciliazione campo-per-campo tra i due Global esistenti e `impostazioni-sistema`

Criterio di split: "orari/chiusure" = quando il ristorante è fisicamente aperto, dato condiviso da menù e prenotazioni. I parametri operativi del solo sistema di prenotazione (durata slot, capienza, soglia gruppo numeroso) non sono orari in questo senso e restano locali al dominio prenotazioni.

| Campo | Oggi in | Destinazione | Motivo |
|---|---|---|---|
| `servizi[].nome`, `orario-inizio`, `orario-fine` | "Impostazioni prenotazioni" (`ADR-007` §1) | **→ `impostazioni-sistema`**, tab Orari e Chiusure | orario reale del ristorante, necessario anche al menù per `isOpen`/`activeSlot` |
| `giorni-riposo-settimanale` | "Impostazioni prenotazioni" (`ADR-007` §1) | **→ `impostazioni-sistema`**, tab Orari e Chiusure | idem |
| `chiusure-annuali` | "Impostazioni prenotazioni" (`ADR-007` §1) | **→ `impostazioni-sistema`**, tab Orari e Chiusure | idem |
| `servizi[].durata-slot` | "Impostazioni prenotazioni" (`ADR-007` §1) | **resta** in "Impostazioni prenotazioni" | granularità dello slot (15/30/60 min); il menù non consuma questo dato |
| `capienza-massima` | "Impostazioni prenotazioni" (`ADR-007` §1) | **resta** in "Impostazioni prenotazioni" | business rule di prenotazione, non un orario |
| `soglia-gruppo-numeroso-attiva`/`soglia-gruppo-numeroso` | "Impostazioni prenotazioni" (`ADR-007` §1) | **resta** in "Impostazioni prenotazioni" | idem |
| Campi orario/chiusura duplicati | "Generali" (menù) | **deprecati**, letti da `impostazioni-sistema` | elimina la duplicazione segnalata in `riepilogo-sessione-requisiti-architettura-menu-digitale.md` §3/§5 |
| `isSpecialPeriod` | "Generali" (menù) | **deprecato** | superato dalla Collection "Giorni Speciali" (`ADR-008-modello-dati-menu-digitale.md` §1) |
| `messaggioGlobale` | "Generali" (menù) | **resta** in "Generali" | contenuto pubblico specifico del menù, non configurazione di sistema — stesso principio già usato per l'indirizzo fisico nei Global per-sito (`riepilogo-sessione-bucket-c.md` §3) |

Nessuno dei due Global esistenti scompare: restano entrambi, più piccoli. "Impostazioni prenotazioni" perde i tre campi orario/chiusura (amendment, §3 sotto) e resta con `servizi[].durata-slot`, `capienza-massima`, soglia gruppo numeroso; "Generali" del menù perde gli stessi campi duplicati e `isSpecialPeriod`, mantiene `messaggioGlobale`. Il collegamento è applicativo, non di schema: i Global Payload non sono relazionabili tra loro con un campo `relationship` (vedi Alternative considerate) — ovunque il backend di prenotazioni o il build del menù leggano oggi orari/chiusure dal proprio Global, la lettura va reindirizzata a `impostazioni-sistema` via Local API (`payload.findGlobal({slug: 'impostazioni-sistema'})`).

**Migrazione dati**: nessuna richiesta. Fase 5.1 e fase-6.1 (scaffolding dei due Global) risultano ancora `da_fare` in `piano.yaml` — nessun contenuto reale esiste oggi su questi due Global nel nuovo backend Payload. La riconciliazione è quindi una decisione di schema da applicare in fase di scaffolding, non una migrazione di record esistenti (vedi punto aperto in Conseguenze).

### 3. Amendment ad `ADR-007-modello-dati-sistema-prenotazioni.md` §1

Questo ADR emenda lo schema del Global "Impostazioni prenotazioni" fissato in `ADR-007` §1, rimuovendo i tre campi ora spostati su `impostazioni-sistema` (§2 sopra):

- `servizi[].orario-inizio` e `servizi[].orario-fine` (restano solo `servizi[].nome` e `servizi[].durata-slot` sul Global "Impostazioni prenotazioni");
- `giorni-riposo-settimanale`;
- `chiusure-annuali` (e il relativo pulsante di precompilazione festività, che si sposta insieme al campo).

Stesso pattern già usato per l'amendment che ha introdotto `google-calendar-event-id` in `ADR-007` §3 (`riepilogo-sessione-bucket-c.md` §6): la modifica non riapre né lo schema delle altre due strutture di `ADR-007` (Collection "Eccezioni giorno", Collection "Prenotazioni"), né i cinque controlli automatici via hook, né la policy GDPR — resta un amendment puntuale, circoscritto ai tre campi elencati. Il controllo automatico #1 di `ADR-007` §4 ("Deduzione di `servizio` da `data-ora`") resta valido nella logica ma legge ora `orario-inizio`/`orario-fine` da `impostazioni-sistema` invece che dal proprio Global.

### 4. Nessun amendment simmetrico ad `ADR-008-modello-dati-menu-digitale.md`

Il Global "Generali" del menù non è mai stato formalizzato campo per campo in `ADR-008-modello-dati-menu-digitale.md`: quell'ADR copre le Collection e le tassonomie del dominio menù (Piatti, Vini, Birra, Giorni Speciali, tassonomie), non lo schema del Global "Generali", che resta un artefatto pregresso non ancora scaffoldato (fase-6.1, `da_fare`). La riconciliazione di §2 tocca "Generali" solo per inferenza, sulla base della ricostruzione di `riepilogo-sessione-impostazioni-sistema.md` §1 — non richiede quindi nessun amendment formale ad `ADR-008`, che non ha mai preso posizione su quei campi. Resta valido il punto aperto già segnalato in quella ricostruzione: se in fase di scaffolding di fase-6.1 emergono campi aggiuntivi non coperti qui, vanno riconciliati con lo stesso criterio di §2 prima di implementare.

### 5. Permessi granulari

Applicazione diretta del criterio già vincolante (`ADR-002-divisione-area-di-gestione.md` §6), con un chiarimento: il default per l'intero Global è **nessun accesso al manager**, non solo "competenza admin" — coerente con `riepilogo-sessione-bucket-c.md` §3 ("accesso ristretto a ruolo admin/tecnico, non ai manager"), che descrive il Global nel suo complesso. La tab Orari e Chiusure è l'unica eccezione esplicita a questo default.

| Tab | Manager | Admin/super-admin |
|---|---|---|
| Orari e Chiusure | **read + update** | read + update |
| Calendario | **nessun accesso** (nemmeno lettura) | read + update |
| Comunicazioni | **nessun accesso** (nemmeno lettura) | read + update |
| Integrazioni future | **nessun accesso** (nemmeno lettura) | read + update |

Meccanismo: funzione `access` Payload nativa a livello di singolo campo (non di tab-container), stesso meccanismo già convenzionato e usato per le Collection del menù (`ADR-002` §6, `riepilogo-sessione-bucket-d.md` §4) — nessuna funzionalità custom necessaria.

## Alternative considerate

- **5 tab, una per ciascuna delle 5 esigenze cross-area enumerate** — scartata: eccesso di frammentazione su due array di piccole dimensioni ("mittenti Resend" e "contatti notifiche staff") che condividono già lo stesso livello di accesso (admin) e lo stesso ambito concettuale; nessun vantaggio di access control da una separazione ulteriore — raggruppate nella tab unica "Comunicazioni".
- **Collegamento a livello di schema tra i Global tramite un campo `relationship`** — scartata: i Global Payload non sono relazionabili tra loro nativamente con un campo di questo tipo; il collegamento resta quindi applicativo (lettura via Local API), non di schema.
- **Migrazione dati contestuale alla riconciliazione** — scartata: nessun contenuto reale esiste oggi sui due Global nel nuovo backend (fase-5.1 e fase-6.1 ancora `da_fare`); la riconciliazione è una decisione di schema da applicare allo scaffolding, non una migrazione di record esistenti.

## Conseguenze

- **Fase 7.2** (`arco-21`, `arco-22`) eredita la struttura a tab (§1) e la riconciliazione campo-per-campo (§2) come schema definitivo di `impostazioni-sistema` da scaffoldare.
- **Fase 5.1** (scaffolding "Impostazioni prenotazioni") eredita lo schema ridotto di `ADR-007` §1 come emendato in §3: tre campi in meno, nessun altro impatto sulle altre due strutture di quell'ADR.
- **Fase 6.1** (scaffolding "Generali" del menù) eredita la deprecazione dei campi orario/chiusura duplicati e di `isSpecialPeriod` (§2), senza che questo richieda un amendment ad `ADR-008` (§4).
- **Fase 7.3** (`arco-24`) eredita il campo `google-calendar-id` nella tab Calendario come riferimento non sensibile, coerente con l'integrazione push già fissata in `ADR-007` §4.5.
- **Fase 7.4** (`arco-23`) eredita la tabella di permessi granulari di §5 come riferimento diretto per l'access control Payload, tramite il meccanismo nativo già convenzionato — nessuna nuova funzionalità da costruire.
- **Punto aperto non bloccante, riportato per l'implementazione** (`riepilogo-sessione-impostazioni-sistema.md` §5): lo schema campo-per-campo del Global "Generali" del menù qui riconciliato (§2) è stato ricostruito per inferenza, non verificato su una fonte che lo documenti esattamente — da controllare contro il codice/schema attuale prima dello scaffolding di fase-6.1, se possibile; analogamente, l'assenza di migrazione dati (§2) è assunta in base allo stato "da_fare" di fase-5.1/fase-6.1 in `piano.yaml`, non verificata contro eventuali dati già presenti nel sistema attuale (Bookly, backend menù attuale) — da confermare prima dello scaffolding se sussiste il dubbio.
- Resta punto aperto per il futuro, non trattato da questo ADR: il contenuto della tab "Integrazioni future", lasciata intenzionalmente vuota — lo schema va progettato quando TheFork o WhatsApp/SMS diventeranno requisiti reali.
- **Con questo ADR si esaurisce l'intero elenco degli ADR del punto 3 di `tracciamento-processo-adr-dag.md`**: nessun ADR della sequenza resta da scrivere. Prossimo passaggio: punto 4 ("Composizione — Passo 1 in Cursor").
