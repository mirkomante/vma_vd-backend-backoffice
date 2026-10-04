# ADR — Global di configurazione trasversale (`impostazioni-sistema`)

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-09-13
**Arco di decisione**: Fase 5.1 (`arco-21`) e Fase 6.1 (`arco-22` di `piano.yaml`) → Fase 7.2 — fonte unica orari/chiusure del ristorante: i due Global esistenti ("Impostazioni prenotazioni", "Generali" del menù) convergono nel nuovo Global `impostazioni-sistema`. Include come archi "output", richiamati solo in Conseguenze: `arco-23` (Fase 2 → Fase 7.4, meccanismo di access control nativo Payload già convenzionato) e `arco-24` (Fase 5.4 → Fase 7.3, id Google Calendar come riferimento non sensibile). **Dipendenza reale** da `ADR-107-modello-dati-sistema-prenotazioni.md` §1, che questo ADR emenda (rimozione di tre campi orario/chiusura) — e tocca per sola inferenza il Global "Generali" del menù, mai formalizzato campo-per-campo in `ADR-108-modello-dati-menu-digitale.md` (nessun amendment necessario lì, vedi §4). Sbloccato dalla sessione dedicata `riepilogo-sessione-impostazioni-sistema.md`. **Ultimo ADR della sequenza del punto 3** di `tracciamento-processo-adr-dag.md`.

## Contesto

Il Global `impostazioni-sistema` è stato individuato come necessario in `riepilogo-sessione-bucket-c.md` §3: un posto unico per la configurazione tecnica trasversale al backend (analogia con le Preferenze di Sistema di macOS/iOS), distinto sia dal contenuto di ciascun sito (`impostazioni-vma`/`impostazioni-villadoree`) sia dalla configurazione di ogni singola area funzionale. Quella sessione ha già fissato, e non viene qui rimesso in discussione: l'esistenza e il naming del Global; la distinzione tra vere credenziali (client secret, chiavi service account, API key — mai in un campo Payload, sempre in variabili d'ambiente o secret manager) e riferimenti non sensibili (es. l'id del calendario Google, che il Global può ospitare); le cinque esigenze cross-area enumerate (fonte unica orari/chiusure, id Google Calendar, mittenti Resend, contatti notifiche staff, slot per integrazioni future).

La struttura a tab e i campi per tab restavano però non progettati, bloccando l'intera Fase 7 e l'unico ADR della sequenza ancora non scrivibile. Una sessione dedicata (`riepilogo-sessione-impostazioni-sistema.md`) ha sbloccato fase-7.1 fissando: la struttura a 4 tab e i relativi campi; la riconciliazione campo-per-campo tra `impostazioni-sistema` e i due Global che oggi contengono dati di orario/chiusura duplicati — "Impostazioni prenotazioni", il cui schema è fissato in `ADR-107-modello-dati-sistema-prenotazioni.md` §1, e "Generali" del menù, mai formalizzato campo-per-campo in nessun ADR o riepilogo, ricostruito per inferenza; la tabella di permessi granulari campo-per-campo. Questo ADR formalizza quelle decisioni senza rimetterle in discussione, e ne rende esplicito l'impatto come amendment su `ADR-107` §1.

## Decisione

### 1. Struttura a tab

4 tab (non 5 — vedi Alternative considerate), puro raggruppamento visivo Payload, stesso precedente stilistico di `ADR-101-modello-contenuti-siti-esterni.md` §2 (tab Generali/Header/Footer): l'access control resta a livello di singolo campo, non di tab-container, coerente con `ADR-102-divisione-area-di-gestione.md` §6.

| Tab | Campi | Esigenza coperta (`riepilogo-sessione-bucket-c.md` §3) |
|---|---|---|
| **Orari e Chiusure** (`orari-chiusure`) | `servizi` (array, 2 voci fisse: `nome` select pranzo/cena, `orario-inizio` timeOnly, `orario-fine` timeOnly), `giorni-riposo-settimanale` (select `hasMany`), `chiusure-annuali` (array: `data` dayOnly, `etichetta` text) | Punto 1 — fonte unica orari/chiusure |
| **Calendario** (`calendario`) | `google-calendar-id` (text) — riferimento, non credenziale | Punto 2 |
| **Comunicazioni** (`comunicazioni`) | `mittenti-resend` (array: `mittente`, `dominio-riferimento`/etichetta di scope — ridefinito dall'Emendamento a §1 in coda a questo ADR), `contatti-notifiche-staff` (array: `nome`, `email`) | Punti 3 e 4 |
| **Integrazioni future** (`integrazioni-future`) | nessun campo per ora — solo lo spazio riservato nella struttura a tab | Punto 5 |

Funzione di supporto ereditata da `ADR-107` §1: il pulsante che precompila `chiusure-annuali` con le festività italiane note resta valido, applicato ora al campo nella sua nuova collocazione su `impostazioni-sistema`.

### 2. Riconciliazione campo-per-campo tra i due Global esistenti e `impostazioni-sistema`

Criterio di split: "orari/chiusure" = quando il ristorante è fisicamente aperto, dato condiviso da menù e prenotazioni. I parametri operativi del solo sistema di prenotazione (durata slot, capienza, soglia gruppo numeroso) non sono orari in questo senso e restano locali al dominio prenotazioni.

| Campo | Oggi in | Destinazione | Motivo |
|---|---|---|---|
| `servizi[].nome`, `orario-inizio`, `orario-fine` | "Impostazioni prenotazioni" (`ADR-107` §1) | **→ `impostazioni-sistema`**, tab Orari e Chiusure | orario reale del ristorante, necessario anche al menù per `isOpen`/`activeSlot` |
| `giorni-riposo-settimanale` | "Impostazioni prenotazioni" (`ADR-107` §1) | **→ `impostazioni-sistema`**, tab Orari e Chiusure | idem |
| `chiusure-annuali` | "Impostazioni prenotazioni" (`ADR-107` §1) | **→ `impostazioni-sistema`**, tab Orari e Chiusure | idem |
| `servizi[].durata-slot` | "Impostazioni prenotazioni" (`ADR-107` §1) | **resta** in "Impostazioni prenotazioni" | granularità dello slot (15/30/60 min); il menù non consuma questo dato |
| `capienza-massima` | "Impostazioni prenotazioni" (`ADR-107` §1) | **resta** in "Impostazioni prenotazioni" | business rule di prenotazione, non un orario |
| `soglia-gruppo-numeroso-attiva`/`soglia-gruppo-numeroso` | "Impostazioni prenotazioni" (`ADR-107` §1) | **resta** in "Impostazioni prenotazioni" | idem |
| Campi orario/chiusura duplicati | "Generali" (menù) | **deprecati**, letti da `impostazioni-sistema` | elimina la duplicazione segnalata in `riepilogo-sessione-requisiti-architettura-menu-digitale.md` §3/§5 |
| `isSpecialPeriod` | "Generali" (menù) | **deprecato** | superato dalla Collection "Giorni Speciali" (`ADR-108-modello-dati-menu-digitale.md` §1) |
| `messaggioGlobale` | "Generali" (menù) | **resta** in "Generali" | contenuto pubblico specifico del menù, non configurazione di sistema — stesso principio già usato per l'indirizzo fisico nei Global per-sito (`riepilogo-sessione-bucket-c.md` §3) |

Nessuno dei due Global esistenti scompare: restano entrambi, più piccoli. "Impostazioni prenotazioni" perde i tre campi orario/chiusura (amendment, §3 sotto) e resta con `servizi[].durata-slot`, `capienza-massima`, soglia gruppo numeroso; "Generali" del menù perde gli stessi campi duplicati e `isSpecialPeriod`, mantiene `messaggioGlobale`. Il collegamento è applicativo, non di schema: i Global Payload non sono relazionabili tra loro con un campo `relationship` (vedi Alternative considerate) — ovunque il backend di prenotazioni o il build del menù leggano oggi orari/chiusure dal proprio Global, la lettura va reindirizzata a `impostazioni-sistema` via Local API (`payload.findGlobal({slug: 'impostazioni-sistema'})`).

**Migrazione dati**: nessuna richiesta. Fase 5.1 e fase-6.1 (scaffolding dei due Global) risultano ancora `da_fare` in `piano.yaml` — nessun contenuto reale esiste oggi su questi due Global nel nuovo backend Payload. La riconciliazione è quindi una decisione di schema da applicare in fase di scaffolding, non una migrazione di record esistenti (vedi punto aperto in Conseguenze).

### 3. Amendment ad `ADR-107-modello-dati-sistema-prenotazioni.md` §1

Questo ADR emenda lo schema del Global "Impostazioni prenotazioni" fissato in `ADR-107` §1, rimuovendo i tre campi ora spostati su `impostazioni-sistema` (§2 sopra):

- `servizi[].orario-inizio` e `servizi[].orario-fine` (restano solo `servizi[].nome` e `servizi[].durata-slot` sul Global "Impostazioni prenotazioni");
- `giorni-riposo-settimanale`;
- `chiusure-annuali` (e il relativo pulsante di precompilazione festività, che si sposta insieme al campo).

Stesso pattern già usato per l'amendment che ha introdotto `google-calendar-event-id` in `ADR-107` §3 (`riepilogo-sessione-bucket-c.md` §6): la modifica non riapre né lo schema delle altre due strutture di `ADR-107` (Collection "Eccezioni giorno", Collection "Prenotazioni"), né i cinque controlli automatici via hook, né la policy GDPR — resta un amendment puntuale, circoscritto ai tre campi elencati. Il controllo automatico #1 di `ADR-107` §4 ("Deduzione di `servizio` da `data-ora`") resta valido nella logica ma legge ora `orario-inizio`/`orario-fine` da `impostazioni-sistema` invece che dal proprio Global.

### 4. Nessun amendment simmetrico ad `ADR-108-modello-dati-menu-digitale.md`

Il Global "Generali" del menù non è mai stato formalizzato campo per campo in `ADR-108-modello-dati-menu-digitale.md`: quell'ADR copre le Collection e le tassonomie del dominio menù (Piatti, Vini, Birra, Giorni Speciali, tassonomie), non lo schema del Global "Generali", che resta un artefatto pregresso non ancora scaffoldato (fase-6.1, `da_fare`). La riconciliazione di §2 tocca "Generali" solo per inferenza, sulla base della ricostruzione di `riepilogo-sessione-impostazioni-sistema.md` §1 — non richiede quindi nessun amendment formale ad `ADR-108`, che non ha mai preso posizione su quei campi. Resta valido il punto aperto già segnalato in quella ricostruzione: se in fase di scaffolding di fase-6.1 emergono campi aggiuntivi non coperti qui, vanno riconciliati con lo stesso criterio di §2 prima di implementare.

### 5. Permessi granulari

Applicazione diretta del criterio già vincolante (`ADR-102-divisione-area-di-gestione.md` §6), con un chiarimento: il default per l'intero Global è **nessun accesso al manager**, non solo "competenza admin" — coerente con `riepilogo-sessione-bucket-c.md` §3 ("accesso ristretto a ruolo admin/tecnico, non ai manager"), che descrive il Global nel suo complesso. La tab Orari e Chiusure è l'unica eccezione esplicita a questo default.

| Tab | Manager | Admin/super-admin |
|---|---|---|
| Orari e Chiusure | **read + update** | read + update |
| Calendario | **nessun accesso** (nemmeno lettura) | read + update |
| Comunicazioni | **nessun accesso** (nemmeno lettura) | read + update |
| Integrazioni future | **nessun accesso** (nemmeno lettura) | read + update |

Meccanismo: funzione `access` Payload nativa a livello di singolo campo (non di tab-container), stesso meccanismo già convenzionato e usato per le Collection del menù (`ADR-102` §6, `riepilogo-sessione-bucket-d.md` §4) — nessuna funzionalità custom necessaria.

## Alternative considerate

- **5 tab, una per ciascuna delle 5 esigenze cross-area enumerate** — scartata: eccesso di frammentazione su due array di piccole dimensioni ("mittenti Resend" e "contatti notifiche staff") che condividono già lo stesso livello di accesso (admin) e lo stesso ambito concettuale; nessun vantaggio di access control da una separazione ulteriore — raggruppate nella tab unica "Comunicazioni".
- **Collegamento a livello di schema tra i Global tramite un campo `relationship`** — scartata: i Global Payload non sono relazionabili tra loro nativamente con un campo di questo tipo; il collegamento resta quindi applicativo (lettura via Local API), non di schema.
- **Migrazione dati contestuale alla riconciliazione** — scartata: nessun contenuto reale esiste oggi sui due Global nel nuovo backend (fase-5.1 e fase-6.1 ancora `da_fare`); la riconciliazione è una decisione di schema da applicare allo scaffolding, non una migrazione di record esistenti.

## Conseguenze

- **Fase 7.2** (`arco-21`, `arco-22`) eredita la struttura a tab (§1) e la riconciliazione campo-per-campo (§2) come schema definitivo di `impostazioni-sistema` da scaffoldare.
- **Fase 5.1** (scaffolding "Impostazioni prenotazioni") eredita lo schema ridotto di `ADR-107` §1 come emendato in §3: tre campi in meno, nessun altro impatto sulle altre due strutture di quell'ADR.
- **Fase 6.1** (scaffolding "Generali" del menù) eredita la deprecazione dei campi orario/chiusura duplicati e di `isSpecialPeriod` (§2), senza che questo richieda un amendment ad `ADR-108` (§4).
- **Fase 7.3** (`arco-24`) eredita il campo `google-calendar-id` nella tab Calendario come riferimento non sensibile, coerente con l'integrazione push già fissata in `ADR-107` §4.5.
- **Fase 7.4** (`arco-23`) eredita la tabella di permessi granulari di §5 come riferimento diretto per l'access control Payload, tramite il meccanismo nativo già convenzionato — nessuna nuova funzionalità da costruire.
- **Punto aperto non bloccante, riportato per l'implementazione** (`riepilogo-sessione-impostazioni-sistema.md` §5): lo schema campo-per-campo del Global "Generali" del menù qui riconciliato (§2) è stato ricostruito per inferenza, non verificato su una fonte che lo documenti esattamente — da controllare contro il codice/schema attuale prima dello scaffolding di fase-6.1, se possibile; analogamente, l'assenza di migrazione dati (§2) è assunta in base allo stato "da_fare" di fase-5.1/fase-6.1 in `piano.yaml`, non verificata contro eventuali dati già presenti nel sistema attuale (Bookly, backend menù attuale) — da confermare prima dello scaffolding se sussiste il dubbio.
- Resta punto aperto per il futuro, non trattato da questo ADR: il contenuto della tab "Integrazioni future", lasciata intenzionalmente vuota — lo schema va progettato quando TheFork o WhatsApp/SMS diventeranno requisiti reali.
- **Con questo ADR si esaurisce l'intero elenco degli ADR del punto 3 di `tracciamento-processo-adr-dag.md`**: nessun ADR della sequenza resta da scrivere. Prossimo passaggio: punto 4 ("Composizione — Passo 1 in Cursor").

## Emendamento a §1 (2026-10-04) — mittenti email (po-01)

**Stato dell'emendamento**: accettata (2026-10-04, su passaggio esplicito dell'umano). Lo stato `accettata` dell'ADR nel suo insieme non cambia.

Modifica solo il campo `mittenti-resend` della tab Comunicazioni di §1. Il resto di §1 (le altre tab, `contatti-notifiche-staff`) e i permessi di §5 restano invariati. Punto aperto di origine: `po-01` in `piano.yaml` (un solo posto per scopo).

### Verifiche su cui poggia

- `@payloadcms/email-resend` 3.89.0: `defaultFromAddress` e `defaultFromName` sono stringhe fissate alla creazione dell'adapter, che in `payload.config.ts` avviene alla costruzione della config, prima che il database sia disponibile. Un Global non può quindi fornirle. Lo stesso adapter rispetta invece il campo `from` passato a `payload.sendEmail` per il singolo invio.
- Le email native di Payload (`forgotPassword`, `sendVerificationEmail`) usano sempre i default dell'adapter. Oggi non sono usate: `Users` ha `disableLocalStrategy` e le email di attivazione e reset passano da `payload.sendEmail` senza `from` (`lib/auth/localEmail/send.ts`).
- Catalogo (verificato su `cursor-rules` `e691823`, identico alla copia del progetto): `email/01a-resend.mdc` elenca `RESEND_FROM_ADDRESS` e `RESEND_FROM_NAME` come variabili d'ambiente; `email/01-email-invarianti.mdc` vieta di cambiare il from-address tra un invio e l'altro in produzione e richiede SPF, DKIM e DMARC verificati prima di ogni invio.

### Decisione

Due sorgenti, ciascuna per uno scopo, senza sovrapposizione e senza fallback.

1. **Mittente di sistema**: variabili d'ambiente `RESEND_FROM_ADDRESS` e `RESEND_FROM_NAME` (nomi invariati). Sono il default dell'adapter e valgono per le email di sistema verso lo staff: attivazione account, reset password, notifiche ai `contatti-notifiche-staff`.
2. **Mittenti verso i clienti**: array `mittenti-resend` del Global, un record per sito, usato per le email destinate agli ospiti dei due siti.
3. **Nessun fallback.** Se per il sito richiesto non esiste un record, l'invio non parte e l'errore viene registrato nel log. L'email non viene mai inviata dal mittente di sistema al posto di quello mancante. Resta valido l'invariante di catalogo per cui l'utente finale non vede dettagli tecnici del provider.
4. **Struttura del record**: `sito` (select a valori fissi: `vietnamonamour` e `villadoree`, entrambi fin dall'inizio, come prevede `02-convenzioni-payload.mdc` per gli enum aperti; è la chiave con cui il codice cerca il mittente), `nome` (text), `indirizzo` (email). Sostituisce la formula «`mittente`, `dominio-riferimento`/etichetta di scope»: il dominio si ricava dall'indirizzo e un campo separato potrebbe contraddirlo.
5. **Validazione** (Fase 7.3): `indirizzo` normalizzato (trim, minuscolo, formato) e al più un record per `sito`.
6. **Prerequisito operativo, non verificato dal sistema**: prima di inserire un record, il dominio dell'indirizzo deve risultare Verified in Resend. Modificare un record dopo l'avvio in produzione è un'operazione pianificata, non un ritocco.

Rapporto con il catalogo: nessun ADR di catalogo derogato. Le variabili richieste da `01a-resend.mdc` restano; l'array è un meccanismo aggiuntivo di progetto. È una lettura del progetto: `01a-resend.mdc` elenca le variabili ma non vieta altri mittenti.

### Alternative considerate

- **Solo env** — scartata: ogni nuovo mittente richiede un deploy e tutte le email, ospiti compresi, escono con un solo nome e indirizzo. Contraddice l'intento di `riepilogo-sessione-bucket-c.md` §3 (struttura pronta per villadoree.com).
- **Global con env come default e fallback** — scartata: stesso scopo in due posti; una voce mancante o sbagliata fa partire l'email dal mittente sbagliato senza alcuna segnalazione.
- **Solo Global** — non realizzabile: l'adapter richiede un default alla costruzione della config e le email native di Payload lo usano.

### Conseguenze

- **Fase 7.3** costruisce l'array con campi e validazione. Resta senza consumatori fino a Fase 5.
- **Consumatore noto oggi: la conferma di prenotazione di vietnamonamour.com (Fase 5).** `ADR-106` e `ADR-107` non definiscono l'email di conferma. La sottofase che la introduce dovrà leggere il Global con `payload.findGlobal`, usare il record del sito `vietnamonamour`, passare `from` a `payload.sendEmail` e trattare l'assenza del record come errore. Oggi non esiste un arco tra `fase-7.3` e quel consumatore: va aggiunto quando la sottofase viene definita.
- **Sviluppi futuri fuori perimetro.** Altri tipi di email o integrazioni dai due siti non sono previsti da questo progetto. La struttura li copre solo se usano un mittente per sito: aggiungere villadoree.com è un nuovo record, senza migrazione. Mittenti diversi per tipo di email sullo stesso sito richiederebbero un secondo campo (`tipo`) e una migrazione, e non sono coperti qui.
- Rischio residuo: un record con dominio non verificato produce invii mancati visibili solo nel log. Non è previsto un test di invio al salvataggio, perché sarebbe complessità assente dalla documentazione (`core/01-proporzionalita.mdc`); da valutare in 7.3 solo se richiesto.
- Il nome visibile delle email agli ospiti è contenuto del record, da decidere al popolamento.
