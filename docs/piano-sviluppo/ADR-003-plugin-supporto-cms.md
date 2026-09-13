# ADR — Plugin di supporto CMS (SEO, Redirects, i18n)

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-09-13
**Arco di decisione**: Fase 1 (Setup, abilitazione i18n a livello di intero progetto Payload) → Fase 4.1 (scaffolding Collection `pages` + Global sito, `ADR-001-modello-contenuti-siti-esterni.md`) → Fase 4.2 (plugin di supporto CMS: SEO, Redirects, i18n) — `arco-01`, `arco-02` di `piano.yaml`. I due archi impongono vincoli di sequenza opposti rispetto a fase-4.1: `arco-01` (fase-1 → fase-4.1) obbliga ad abilitare la localizzazione **prima** che fase-4.1 inserisca contenuti reali; `arco-02` (fase-4.1 → fase-4.2) impone che Collection `pages` e Global sito esistano già **prima** che i plugin SEO/Redirects possano essere configurati.

## Contesto

Fase 4.2 raggruppa tre feature di supporto CMS individuate nell'analisi dei due siti esterni (`riepilogo-sessione-cms-siti-esterni.md` §3): plugin SEO ufficiale, plugin Redirects, localizzazione i18n nativa Payload. Le prime due dipendono direttamente dallo scaffolding già deciso in `ADR-001-modello-contenuti-siti-esterni.md` (Collection `pages` + Global sito, fase-4.1): il plugin SEO opera per singola pagina e il plugin Redirects usa `pages` come target interno del campo `to` — entrambi richiedono che la Collection esista già (`arco-02`).

La terza, la localizzazione, ha un vincolo di sequenza opposto e trasversale a tutto il progetto Payload, non solo ai due siti esterni: va abilitata già in fase-1 (Setup), prima che fase-4.1 inserisca contenuti reali nella Collection `pages`, perché convertire in `localized: true` un campo di testo già popolato comporta una migrazione manuale del valore esistente — vincolo tecnico documentato di Payload, non aggirabile a posteriori (`arco-01`, `riepilogo-sessione-cms-siti-esterni.md` §3.3). Questo ADR fissa quindi tre decisioni sotto lo stesso nodo "plugin di supporto", ma non tutte eseguibili nello stesso momento del piano.

Il comportamento esatto di `defaultLocale`/`fallbackLocale`, lasciato parzialmente aperto nella sessione originale, è stato chiuso nella successiva chiusura Bucket A (`punti-aperti-bucket-a-d.md`) e viene incorporato qui.

## Decisione

1. **Plugin SEO ufficiale** — confermato senza obiezioni: meta title/description/immagine per pagina, integrato nel frontend (§3.1).

2. **Plugin Redirects** — confermato. Aggiunge una Collection `redirects` con campi `from` (URL sorgente) e `to` (relationship interna a `pages` oppure URL esterno libero), più un tipo di redirect configurabile (301/302). Non è automatico: il plugin fornisce solo la struttura dati, è il frontend Next.js (tipicamente in middleware) a leggerla e applicare l'HTTP redirect; le voci vanno inserite manualmente in admin. Le URL sorgente (`from`) andranno raccolte da Google Search Console (sezione "Pagine") o, in mancanza di accesso alla proprietà, da una ricerca `site:` — compilazione una tantum al lancio del nuovo sito, non un impegno ricorrente (§3.2).

3. **Localizzazione i18n nativa Payload** — abilitata a livello di intero progetto già in fase-1, non rimandata a fase-4:
   - `locales`: `it`, `en`.
   - `defaultLocale: 'it'` — riguarda esclusivamente la lingua d'interfaccia dell'Admin nativo e del backoffice `(app)` (entrambi in italiano) e i casi limite in cui una chiamata non specifica alcuna locale (es. Local API/script interni). Non determina la lingua dei contenuti dei siti (§3.3, chiusura Bucket A).
   - **`locale` esplicito obbligatorio** in ogni richiesta REST dai due siti esterni verso l'API Payload — `it` per vietnamonamour.com, `en` per villadoree.com nella release 1. È questa la regola che stabilisce davvero la lingua vista da ciascun sito, non il default di progetto; va rispettata come convenzione di codice fin dallo scaffolding (chiusura Bucket A).
   - **`fallbackLocale` bidirezionale** (`it → en`, `en → it`), come rete di sicurezza per singoli campi non ancora tradotti — utile soprattutto in vista della release 2 bilingue. Non sostituisce né interagisce con la regola precedente: agisce solo a livello di campo mancante dentro la locale già esplicitamente richiesta (chiusura Bucket A).
   - **Campi testuali marcati `localized: true` da subito**, in fase di scaffolding (fase-4.1), prima che si inserisca qualunque contenuto reale nelle Collection `pages` — evita il problema di migrazione dati di Payload sui campi già popolati (§3.3).

```ts
localization: {
  locales: [
    { label: 'Italiano', code: 'it', fallbackLocale: 'en' },
    { label: 'English',  code: 'en', fallbackLocale: 'it' },
  ],
  defaultLocale: 'it',
  fallback: true,
}
```

## Alternative considerate

- Rimandare l'abilitazione della localizzazione al momento in cui servirà davvero la seconda lingua (release 2) — scartata: comporterebbe convertire in `localized: true` campi già popolati con contenuti reali, con perdita/migrazione manuale del valore esistente; abilitarla da subito, in fase di sviluppo/analisi, non ha alcun costo (§3.3).
- `defaultLocale` differenziato per sito (IT per vietnamonamour.com, EN per villadoree.com) — scartata: non supportata da Payload, che ammette un solo `defaultLocale` per l'intero progetto; da qui la necessità della regola separata del `locale` esplicito obbligatorio per determinare la lingua del sito (§3.3).
- Rilevamento automatico dei cambi URL per il plugin Redirects — non disponibile nel plugin e non giustificato costruirlo ad-hoc: la raccolta manuale via Google Search Console o ricerca `site:` è sufficiente per una compilazione una tantum al lancio (§3.2).
- Applicazione del redirect lato Payload invece che nel frontend Next.js — non prevista dal plugin, che fornisce solo la struttura dati; nessun elemento in sessione giustifica di spostare quella responsabilità fuori dal frontend, che resta l'unico punto che intercetta le richieste in ingresso ai due siti (§3.2).

## Conseguenze

- Fase-1 (Setup, ereditata dal catalogo) eredita un requisito di dominio applicativo non generico: la configurazione `localization` deve essere già presente a questo stadio, non solo introdotta in fase-4 — deviazione rispetto al template puro, da annotare in `fase-1-setup.md` quando verrà copiato/scritto (Passo 1).
- Fase-4.1 (scaffolding Collection `pages` + Global, `ADR-001-modello-contenuti-siti-esterni.md`) eredita l'obbligo di marcare `localized: true` sui campi testuali già in questa fase, prima di qualunque content population reale (fase-4.6, bloccata da fase-4.5).
- Fase-4.2 (questo ADR) può procedere per i plugin SEO e Redirects solo a valle di fase-4.1 — `arco-02`, coerente con `ADR-001-modello-contenuti-siti-esterni.md`.
- La raccolta delle sole URL sorgente (`from`) del plugin Redirects è anticipabile senza rischio; la compilazione completa (`from` → `to`) resta invece bloccata a fase-4.6, perché il campo `to` richiede pagine destinazione già esistenti come record (vincolo di sequenza già annotato in `piano.yaml`, fase-4.6, e in `riepilogo-sessione-bucket-c.md` §4).
- Ogni sviluppo dei due frontend Next.js eredita l'obbligo di passare `locale` esplicito in ogni chiamata REST verso Payload — convenzione di codice vincolante, non solo nota di progetto.
- Resta punto aperto, non bloccante: verificare in fase di scaffolding se l'Admin UI di Payload mostri il valore di fallback anche in editing, o il campo vuoto per segnalare "da tradurre" — comportamento di default da controllare quando si arriva a costruire i field (§3.3).
