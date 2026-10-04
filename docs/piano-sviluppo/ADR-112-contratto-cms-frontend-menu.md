# ADR — Contratto CMS ↔ frontend del menù digitale (letture REST e `disponibilita.json`)

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-10-04
**Arco di decisione**: Fase 6.2 → Fase 6.4 (`arco-32`): il frontend del menù (6.7) è sviluppato in un altro progetto, quindi l'interfaccia lato CMS va fissata prima dello scaffolding delle collection (6.2) e del file di disponibilità (6.4). Chiude il punto aperto `po-06`. Nessuna deviazione da un default di catalogo. Applica `ADR-105-strategia-rendering-comunicazione-siti-esterni.md` (letture pubbliche senza token, `disponibilita.json` su GCS, rebuild manuale) e rimanda a `ADR-108-modello-dati-menu-digitale.md` per il modello dati.

## Contesto

- Il **menù digitale** (`menu.vietnamonamour.com`) è un'applicazione Next.js a **generazione statica pura** (SSG, `output: 'export'`, decisione del 2026-09-12) su Firebase Hosting, in un altro progetto e **fuori dal perimetro di questo piano** (6.7). Legge il CMS **solo quando viene compilata**; a runtime il browser del cliente non contatta il CMS e legge soltanto `disponibilita.json`. È distinto dai **due siti** (vietnamonamour.com e villadoree.com), che usano ISR on-demand (`ADR-105`) e hanno un proprio contratto (`ADR-111`): il menù si gestisce dal manager nel backoffice `(app)`, i siti nell'Admin. Questo piano fornisce al menù digitale le letture di contenuto e il file di disponibilità.
- `ADR-105` ha già deciso: letture REST dirette senza token, `disponibilita.json` su GCS letto dal browser ogni circa cinque minuti, rebuild manuale con un pulsante nel backoffice. Non ha fissato **forma delle richieste, nomi dei campi, schema del file né variabili d'ambiente**.
- Il prototipo `vtn-menu-ristorante-next` legge le collection con REST standard (100 per pagina), ha un suo schema di `disponibilita.json` con chiavi italiane e calcola apertura e festività dai dati del Global «generali». Il frontend attuale (`vietnamonamour-nodejs`, ramo `vtn-backend-api-data`) usa invece endpoint già raggruppati di `vtn-backend`.

## Decisione

**1. Letture di contenuto: REST standard di Payload, senza token.** Il frontend legge a build-time `GET /api/{collection}` e `GET /api/globals/{slug}`. Nessun endpoint custom: la composizione delle pagine sta nel frontend.
- **Collection e Global pubblici in lettura** (accesso anonimo): piatti, vini, distillati, bevande, menu fissi e categorie, servizi, categorie e tassonomie, Giorni Speciali e il Global «Generali» del menù. Scrittura secondo `ADR-113`. Di `impostazioni-sistema` si leggono pubblicamente **solo i campi della tab Orari e chiusure** (accesso per campo, `ADR-109` §5 come emendato); le altre tab restano riservate.
- **Voci disabilitate incluse**, con un flag (`disabled`): così riattivare una voce non richiede un rebuild. Una voce **nuova** sì.
- **Forma delle richieste**: `locale=it|en` passato **sempre in modo esplicito** (con il ripiego incrociato di `ADR-103`); paginazione con `limit=100`, finché non ci sono altre pagine; `depth` quanto basta per le relazioni (per esempio 2 per Paese e regione di un vino). Ordinamento: per nome, come oggi, salvo un campo esplicito introdotto in seguito.
- **Nomi congelati** (slug delle collection e `name` dei campi): decisi all'inizio di 6.2 e congelati alla chiusura di 6.2, come in Fase 4. Dopo, ogni modifica è una modifica di schema con migrazione e rompe il frontend. L'elenco va nel CHANGELOG come base del contratto.

**2. Sezioni nel codice del frontend.** Le sette pagine (business lunch, degustazione, carta, dolci, bevande, vini, distillati) e le categorie di ciascuna sono configurazione del frontend. Il CMS fornisce categorie e voci, non la mappa del menù. Un Global di configurazione resta possibile in future versioni.

**3. `disponibilita.json`**: stato in tempo reale di piatti e voci. **Orari, chiusure e giorni speciali non ci sono**: una loro modifica richiede il rebuild del menù (decisione del 2026-10-04).

```
{
  "schemaVersion": 1,
  "updatedAt": "2026-10-04T09:20:20.172Z",
  "dishes":     { "<id>": { "status": "available" | "soldOut" | "hidden" } },
  "wines":      { "<id>": { "status": "available" | "hidden" } },
  "drinks":     { "<id>": { "status": "available" | "hidden" } },
  "spirits":    { "<id>": { "status": "available" | "hidden" } },
  "fixedMenus": { "<id>": { "status": "available" | "hidden" } },
  "services":   { "<id>": { "status": "available" | "hidden" } },
  "globalMessage": { "it": "…", "en": "…" }
}
```
- `soldOut` = «terminato per servizio» (solo piatti, ADR-108 §3); `hidden` = `disabilitato`. Gli identificativi sono quelli numerici di Payload, usati come chiavi stringa.
- Ogni gruppo elenca **tutte** le voci con il loro stato corrente. Chiavi in **inglese camelCase**; l'oggetto per voce lascia spazio a campi aggiuntivi senza rompere il formato.
- `globalMessage` (avviso immediato, es. «oggi cucina chiusa») **resta nel file**, come nel prototipo; è assente quando non c'è un messaggio. È localizzato.
- `updatedAt` è un istante ISO 8601 in UTC; `schemaVersion` cambia solo per modifiche incompatibili, concordate con il frontend.
- **Lettura**: il browser interroga il file circa ogni cinque minuti, con cache breve (al massimo 60 secondi); il file sta in un bucket GCS a lettura pubblica con CORS per il dominio del menù. Se non è raggiungibile, il frontend mostra gli stati del build. Scrittura del file e reset di `soldOut` ai confini di servizio: sottofase 6.4.

**4. Orario locale.** Gli orari dei servizi sono testo `HH:mm` in **ora locale del ristorante** (`ADR-109`, secondo emendamento). Il frontend li confronta con l'ora corrente in **Europe/Rome**, non con quella del fuso del visitatore. Giorni di riposo, chiusure annuali e giorni speciali, presenti nel build, si valutano allo stesso modo.

**5. Pubblicazione.** Per vedere sul menù pubblico una voce nuova, una modifica ai servizi, agli orari, alle chiusure o ai giorni speciali, serve il rebuild («Ricompila il menù pubblico», sottofase 6.5). Gli stati `disabled` e `soldOut` di voci esistenti passano dal file di disponibilità senza rebuild.

**6. Variabili d'ambiente del menù digitale** (un nome per variabile, nessun alias; i due siti hanno variabili proprie, fissate in `ADR-111`):

| Variabile | Uso |
|---|---|
| `MENU_CMS_URL` | URL base del CMS, letto dal menù digitale solo a build-time |
| `NEXT_PUBLIC_MENU_AVAILABILITY_URL` | URL di `disponibilita.json`, letto dal browser |

Le variabili lato CMS per bucket e Scheduler sono definite in 6.4.

## Alternative considerate

- **Endpoint dedicati già composti** (come `/vini/raggruppati-per-tipologia` di `vtn-backend`) — scartata: serve codice custom nel CMS e la composizione resta comunque nel frontend (decisione 2).
- **Sezioni nel CMS** (Global di configurazione, come nel prototipo) — scartata: la mappa è fissa e cambia di rado.
- **Orari, chiusure e giorni speciali nel file di disponibilità** — scartata: cambiano di rado e si pubblicano con il rebuild.
- **Escludere le voci disabilitate dalle letture pubbliche** — scartata: riattivarle richiederebbe un rebuild.
- **Chiavi del file in italiano**, come nel prototipo — scartata: convenzione del progetto (inglese per i nomi nel codice).

## Conseguenze

- **Fase 6.2**: accesso pubblico in lettura per collection e Global del menù; nomi congelati alla chiusura (`ADR-108`, emendamenti: Servizi e campi `localized`).
- **Fase 6.4**: generazione del file secondo questo schema; bucket a lettura pubblica con CORS; cache breve; reset ai confini di servizio. Si lega a `po-04` (Cloud Scheduler, GCS, IAM).
- **Fase 6.5**: il pulsante di rebuild è lo strumento di pubblicazione di tutto ciò che non passa dal file.
- **Fase 7.4**: la tab Orari e chiusure è leggibile anche da richieste anonime; le altre tab no. `fase-7` è aggiornata.
- **`ADR-111`** (contratto con i due siti) usa lo stesso meccanismo per gli orari pubblici (ristorante, check-in e check-out).
- **`po-06` chiuso.**
- **Non verificato**: `docs/STATO.md` del prototipo non è stato letto a fondo; il comportamento di CORS e cache su GCS si prova in 6.4.
