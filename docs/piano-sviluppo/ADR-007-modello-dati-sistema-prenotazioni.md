# ADR — Modello dati del sistema di prenotazioni

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-09-13
**Arco di decisione**: Fase 5.3 (`arco-11`, `arco-12` di `piano.yaml` — Global "Impostazioni prenotazioni", Collection "Eccezioni giorno", Collection "Prenotazioni") → Fase 5.4 (Integrazione push Google Calendar) e Fase 5.5 (Backoffice `(app)` prenotazioni). **Dipende da `ADR-006-ciclo-vita-prenotazione.md`** (`arco-09`): i cinque stati della prenotazione e le transizioni ammesse sono una **dipendenza reale**, non un riferimento di stile — vengono riusati qui esattamente come fissati in quell'ADR, senza essere ridecisi né modificati. Questo ADR si limita a impiegarli per chiudere lo schema completo del campo `stato` e il dettaglio dei controlli automatici che lo leggono/scrivono.

## Contesto

`ADR-006-ciclo-vita-prenotazione.md` ha fissato **solo** gli stati e le transizioni della prenotazione, rimandando esplicitamente a questo ADR lo schema dati completo delle tre strutture della Fase 5.3 (Global "Impostazioni prenotazioni", Collection "Eccezioni giorno", Collection "Prenotazioni"), il dettaglio implementativo dei cinque controlli automatici, la policy di conservazione/anonimizzazione GDPR e l'integrazione con Google Calendar. Con gli stati ora chiusi, questo ADR può fissare quello schema senza lasciare aperto nessuno dei punti che condizionano sia la Fase 5.4 (integrazione calendario) sia la Fase 5.5 (backoffice `(app)`).

Lo schema qui documentato integra tre fonti prodotte in momenti distinti, tutte già chiuse:

- `riepilogo-sessione-sistema-prenotazioni.md` §5 — schema di base delle tre strutture e i cinque controlli automatici;
- `riepilogo-sessione-gdpr-prenotazioni.md` §2/§3 — periodo di conservazione, meccanismo di anonimizzazione, campo `anonimizzata`;
- `riepilogo-sessione-bucket-c.md` §2 — integrazione push Google Calendar, campo `google-calendar-event-id`, che sostituisce l'ipotesi originaria di feed iCal sottoscrivibile.

## Decisione

### 1. Global "Impostazioni prenotazioni"

| Campo | Tipo Payload | Obbligatorio | Note |
|---|---|---|---|
| `servizi` | `array` (2 voci fisse) | sì | ogni voce contiene i 4 campi sotto |
| ↳ `nome` | `select` (pranzo / cena) | sì | valori fissi, non testo libero — evita refusi nei riferimenti da altre collection |
| ↳ `orario-inizio` | `date` (timeOnly) | sì | |
| ↳ `orario-fine` | `date` (timeOnly) | sì | deve essere successivo a `orario-inizio`, validato via hook |
| ↳ `durata-slot` | `select` (15 / 30 / 60 minuti) | sì | valori chiusi |
| `capienza-massima` | `number` | sì | minimo 1, **unica per tutto il locale**, non per servizio |
| `giorni-riposo-settimanale` | `select` con `hasMany: true` | no | |
| `soglia-gruppo-numeroso-attiva` | `checkbox` | — | default `false` |
| `soglia-gruppo-numeroso` | `number` | condizionale | visibile/obbligatorio solo se il checkbox sopra è attivo |
| `chiusure-annuali` | `array` (nel Global, non Collection separata) | no | lista che il gestore apre raramente, gestita in un'unica schermata |
| ↳ `data` | `date` (dayOnly) | sì | |
| ↳ `etichetta` | `text` | no | es. "Natale", "Ferragosto" |

Funzione di supporto: pulsante in admin/backoffice che precompila `chiusure-annuali` con le festività italiane note, restando modificabile a mano.

### 2. Collection "Eccezioni giorno"

Evento singolo legato a una data precisa, per costruzione non ricorrente: chiudere uno slot/servizio/giornata in una data specifica non ha alcun effetto sulle date successive.

| Campo | Tipo Payload | Obbligatorio | Note |
|---|---|---|---|
| `data` | `date` (dayOnly) | sì | |
| `tipo` | `select` (orario-personalizzato / chiusura-servizio / chiusura-slot-specifici / chiusura-giornata) | sì | determina i campi visibili sotto |
| `servizio` | `select` (pranzo / cena) | condizionale | nascosto se `tipo = chiusura-giornata` |
| `nuovo-orario-inizio` | `date` (timeOnly) | condizionale | visibile solo se `tipo = orario-personalizzato` |
| `nuovo-orario-fine` | `date` (timeOnly) | condizionale | visibile solo se `tipo = orario-personalizzato` |
| `slot-chiusi` | `array` di `date` (timeOnly), `hasMany` | condizionale | visibile solo se `tipo = chiusura-slot-specifici` |
| `nota` | `text` | no | facoltativo, es. "pieno su TheFork" |

**Vincoli confermati**:
- Un solo record per (`data` + `servizio`): duplicato bloccato via hook `beforeValidate`.
- Sovrapposizione con chiusure/riposo già esistenti (`chiusure-annuali` o `giorni-riposo-settimanale`): segnalata in UI, **non bloccata** — resta possibile salvare comunque.
- `slot-chiusi` **non è un campo a digitazione libera**: nel backoffice il manager seleziona da una lista di slot calcolati automaticamente (checkbox), in base a orario/durata del servizio in quella data, tramite la stessa logica di calcolo condivisa con il form pubblico di prenotazione (endpoint dedicato, es. `GET /api/slot-candidati?data=...&servizio=...`). La struttura dati resta comunque un array di orari; a cambiare è solo l'input. L'hook di validazione `beforeValidate` resta presente come rete di sicurezza lato server anche su questo campo.

### 3. Collection "Prenotazioni"

| Campo | Tipo Payload | Obbligatorio | Note |
|---|---|---|---|
| `nome` | `text` | sì | |
| `cognome` | `text` | sì | |
| `email` | `email` | sì | |
| `cellulare` | `text` | sì | validazione formato via hook |
| `data-ora` | `date` (dayAndTime) | sì | campo unico (non separato in data/ora), base per tutti i controlli automatici |
| `numero-persone` | `number` | sì | minimo 1 |
| `consenso-privacy` | `checkbox` | sì | deve risultare `true`; assolve l'obbligo di informativa (art. 13 GDPR) |
| `note` | `textarea` | no | facoltativo |
| `servizio` | `select` (pranzo / cena) | sì | **dedotto automaticamente** da `data-ora` via hook nella prenotazione online; resta modificabile dallo staff in inserimento manuale |
| `stato` | `select` (confermata / in-attesa-conferma / rifiutata / cancellata / no-show) | sì | default `confermata` — **i cinque valori e le transizioni ammesse sono quelli fissati in `ADR-006-ciclo-vita-prenotazione.md`, ereditati qui senza modifiche** |
| `canale` | `select` (sito / telefono / di persona / TheFork) | sì | valori chiusi ma pensati per essere estesi facilmente (una voce = una riga) |
| `token-cancellazione` | `text` | — | generato da hook alla creazione, non editabile |
| `annullata-da` | `select` (utente / staff) | condizionale | visibile solo se `stato` è `cancellata` o `rifiutata` |
| `motivo-annullamento` | `text` | no | facoltativo, stesse condizioni sopra |
| `anonimizzata` | `checkbox` | — | default `false`; a `true` quando i campi identificativi sono stati svuotati (job schedulato o azione manuale) — vedi §5 |
| `google-calendar-event-id` | `text` | — | non editabile in UI, scritto da hook; id dell'evento creato via push su Google Calendar, usato per aggiornare/cancellare l'evento quando la prenotazione cambia stato — vedi §4.5 |

### 4. Controlli automatici via hook

I cinque controlli automatici sono condizionati dal ciclo di vita fissato in `ADR-006` (che li elenca come eredità, senza specificarli), e sono qui dettagliati:

1. **Deduzione di `servizio` da `data-ora`**: confronta l'orario di `data-ora` con gli intervalli `orario-inizio`/`orario-fine` dei due `servizi` nel Global "Impostazioni prenotazioni"; applicata alla prenotazione online, non vincolante per l'inserimento manuale dello staff (che può correggerla).
2. **Verifica soglia gruppo numeroso**: se `soglia-gruppo-numeroso-attiva` è `true` e `numero-persone` supera `soglia-gruppo-numeroso`, lo stato di creazione è `in-attesa-conferma` invece di `confermata` — questa è la sola condizione che determina lo stato di partenza tra i due ammessi dalla transizione "Creazione →" di `ADR-006`.
3. **Verifica capienza residua dello slot**: capienza massima del Global meno le prenotazioni già `confermata`/`in-attesa-conferma` sullo stesso slot, tenendo conto degli eventuali `slot-chiusi` provenienti da "Eccezioni giorno" per quella data e servizio.
4. **Blocco della cancellazione utente oltre il termine**: una richiesta di cancellazione da parte dell'utente (via `token-cancellazione`) è rifiutata se `data-ora` dista meno di un'ora dal momento della richiesta; la cancellazione da parte dello staff non è soggetta a questo vincolo, coerentemente con la transizione "Confermata → Cancellata" di `ADR-006`.
5. **Sincronizzazione push con Google Calendar**: su create/update/delete della prenotazione, limitata alle sole prenotazioni in stato `confermata` — crea/aggiorna l'evento quando lo stato entra o resta in `confermata`, lo rimuove quando lo stato esce da `confermata` verso `cancellata` o `no-show` (coerente con `ADR-006`, che riserva il push al solo stato `confermata`). L'id dell'evento creato è scritto nel campo `google-calendar-event-id`, usato per le successive operazioni di aggiornamento/rimozione.

### 5. Policy GDPR — conservazione e anonimizzazione

- **Periodo di conservazione**: 90 giorni da `data-ora` (data del servizio, non data di creazione della prenotazione), applicato in modo **uniforme a tutti gli stati** (confermata, cancellata, rifiutata, no-show) — nessuna differenziazione di policy tra stati.
- **Meccanismo**: job schedulato a frequenza giornaliera (Cloud Scheduler, stesso pattern già in uso per il menù digitale). Cerca in "Prenotazioni" i record con `data-ora` più vecchia di 90 giorni e `anonimizzata = false`; svuota `nome`, `cognome`, `email`, `cellulare`, `note`, `motivo-annullamento`, `token-cancellazione`; imposta `anonimizzata = true`. Restano intatti `data-ora`, `numero-persone`, `stato`, `servizio`, `canale` per le statistiche gestionali.
- **Cancellazione anticipata su richiesta (art. 17 GDPR)**: pulsante manuale "Anonimizza ora" nel backoffice, sulla singola prenotazione — stessa logica del job schedulato, invocata puntualmente su un record invece che in batch.
- **Base giuridica**: il campo `consenso-privacy` resta invariato nello schema (assolve l'obbligo di informativa, art. 13 GDPR). La base giuridica corretta da citare nel testo dell'informativa non è però il consenso dell'interessato, ma l'**esecuzione di misure precontrattuali richieste dall'interessato** (art. 6.1.b) — il consenso in senso proprio servirebbe solo per finalità ulteriori non necessarie al servizio (es. newsletter). Questa è **solo un'annotazione per chi redigerà l'informativa: nessuna modifica tecnica implicata**.

## Alternative considerate

- **Feed iCal sottoscrivibile per il calendario del manager** (scelta iniziale di `riepilogo-sessione-sistema-prenotazioni.md` §3, no OAuth, nessun token da mantenere) — **scartata**: i client calendario (Google Calendar in particolare) aggiornano i feed esterni sottoscritti con una cadenza lenta e non configurabile (tipicamente ore), fuori dal nostro controllo, e non soddisfa il requisito di aggiornamento quasi in tempo reale già garantito dal sistema attuale. Sostituita da **scrittura push diretta su Google Calendar via API** (§4.5). **Costo accettato consapevolmente**: mantenimento di credenziali OAuth/service account — questa è una deviazione esplicita rispetto alla motivazione originaria ("niente token da mantenere") con cui la scelta iniziale era stata giustificata. L'allegato `.ics` nell'email di conferma al cliente resta invariato: la revisione riguarda solo il calendario del manager.
- **Capienza distinta per servizio o per slot con concetto di turnover** — scartata: il sistema attualmente in uso (Bookly) conferma capienza per slot senza un concetto di durata/turnover; confermata comunque una capienza unica per l'intero locale nel nuovo sistema, non per servizio.
- **Collection separata per le chiusure annuali** — scartata: è una lista che il gestore apre raramente, più adatta a un array gestito in un'unica schermata del Global "Impostazioni prenotazioni" che a una Collection con l'overhead di CRUD proprio.
- **"Eccezioni giorno" come evento ricorrente** — scartata: la ricorrenza settimanale è già coperta da `giorni-riposo-settimanale` nel Global; l'eccezione puntuale serve solo per deroghe legate a una data precisa, senza effetto sulle date successive.
- **`slot-chiusi` a digitazione libera** — scartata: rischio di errori di formato e disallineamento con gli orari reali dei servizi; sostituita da selezione da lista calcolata condivisa col form pubblico, con l'hook di validazione mantenuto come rete di sicurezza.

## Conseguenze

- **Fase 5.4** (Integrazione push Google Calendar) eredita il campo `google-calendar-event-id` e gli hook di sincronizzazione su create/update/delete descritti in §4.5, filtrati alle sole prenotazioni `confermata`.
- **Fase 5.5** (Backoffice `(app)`) eredita: le azioni disponibili condizionate dallo stato restano quelle di `ADR-006` (non ridiscusse qui); il componente custom per la selezione di `slot-chiusi` (§2); il pulsante "Anonimizza ora" sulla singola prenotazione (§5).
- Il job giornaliero di anonimizzazione richiede l'ambiente Cloud Scheduler già previsto in Fase 3 (`arco-25` di `piano.yaml`).
- **Punto esplicitamente aperto e non bloccante**: la scelta delle credenziali/service account per la scrittura push su Google Calendar (riuso dell'account già in uso oggi dal sistema attuale, o un nuovo service account dedicato al nuovo backend) è **deferita alla fase di implementazione** — non condiziona né lo schema dati né gli hook fissati in questo ADR.
- Restano punti aperti per il futuro, non trattati da questo ADR:
  - il flusso dettagliato di coordinamento tra la cancellazione di una prenotazione ancora futura e un'anonimizzazione anticipata richiesta su quella stessa prenotazione (art. 17 GDPR);
  - un eventuale identificatore pseudonimizzato per tracciare pattern di no-show ricorrenti sullo stesso cliente nel tempo, se questo diventerà un requisito reale — oggi l'anonimizzazione a 90 giorni elimina ogni collegamento tra prenotazioni della stessa persona;
  - la riconciliazione campo-per-campo tra il Global "Impostazioni prenotazioni" e il Global "Generali" del menù digitale, per una fonte unica di orari/chiusure del ristorante — resta materia dell'**ADR — Global di configurazione trasversale (`impostazioni-sistema`)**, bloccato fino alla sessione dedicata alla struttura a tab.
