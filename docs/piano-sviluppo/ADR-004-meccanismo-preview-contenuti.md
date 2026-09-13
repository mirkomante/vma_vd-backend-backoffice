# ADR — Meccanismo di preview dei contenuti

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-09-13
**Arco di decisione**: Fase 4.1 (`arco-04` di `piano.yaml` — Collection `pages` e Global sito) → Fase 4.3 (Meccanismo di preview). Dipende da `ADR-001-modello-contenuti-siti-esterni.md`: la Collection `pages` deve già esistere. Condiziona a sua volta la Fase 4.4 (`arco-05`/`arco-19`, `ADR — Strategia di rendering e comunicazione con i siti esterni`), per il vincolo Draft Mode/Cookies chiuso in questo ADR.

## Contesto

I manager devono poter vedere il contenuto di una pagina non ancora pubblicata prima di renderla pubblica, sia per vietnamonamour.com sia per villadoree.com. I due siti sono renderizzati da Next.js come processi separati dal progetto Payload (niente Local API, niente `overrideAccess`), quindi qualunque meccanismo di preview deve passare per l'API REST di Payload con autenticazione a token. Serve fissare questo meccanismo prima che la Fase 4.3 possa partire, e prima che la Fase 4.4 possa scegliere la modalità di compilazione Next.js dei due siti, perché — come emerso in chiusura Bucket A — il meccanismo scelto porta con sé un vincolo tecnico che esclude a priori una delle opzioni di compilazione.

## Decisione

**Draft Preview** (non Live Preview, non replica interna dei siti).

Meccanismo: dal punto di gestione contenuti (`(payload)`/Admin) parte un link firmato (token) verso una route `/api/preview` di ciascun sito esterno. La route valida il token, attiva il Draft Mode di Next.js (cookie httpOnly scoped al dominio del sito) e reindirizza alla pagina reale. La pagina, lato server, se rileva Draft Mode attivo, interroga l'API REST di Payload con `draft: true` e un token API — non Local API, non `overrideAccess`, perché i siti sono processi separati da Payload. Un visitatore normale, senza quel cookie, riceve solo i contenuti pubblicati: stessa pagina, stesso codice, nessuna differenza di rendering tra bozza e pubblicato.

**Vincolo tecnico incorporato** (emerso in chiusura Bucket A, 2026-09-12): Draft Mode e Cookies non sono supportati da Next.js con `output: 'export'` puro — richiedono un runtime Node per-request. Questo esclude lo static export puro come modalità di compilazione per vietnamonamour.com e villadoree.com. Non riguarda il menù digitale (menu.vietnamonamour.com), che resta SSG puro e non usa Draft Mode.

## Alternative considerate

- **Live Preview nativa di Payload** (client-side e server-side) — scartata: vive solo nell'Edit View dell'Admin Panel nativo, andrebbe comunque ricostruita come Edit View custom; la variante server-side richiede comunque un fetch REST remoto con token per leggere le bozze (stesso onere della Draft Preview) sommato al costo di iframe/postMessage, senza offrire editing in pagina — quello resta il Visual Editor Enterprise a pagamento, fuori scope.
- **Replica interna dei siti in un'area di anteprima dentro il progetto Payload** — scartata: rischio di drift tra la replica e il sito reale (due implementazioni separate), raddoppio della manutenzione.

## Conseguenze

La Fase 4.3 eredita l'implementazione concreta: route `/api/preview` su entrambi i siti esterni, generazione del link firmato lato `(payload)`, gestione del token API REST per le letture in `draft: true`.

La Fase 4.4 eredita il vincolo tecnico come precondizione già chiusa: lo static export puro è escluso per i due siti CMS, la scelta resta ristretta a SSR pieno o ISR selettivo — decisione che quell'ADR deve solo documentare, non riaprire.

Il requisito iniziale di "editing in pagina" resta esplicitamente derubricato a "preview affidabile del contenuto salvato": non è una funzione fornita da nessuna delle opzioni valutate in questa sessione, salvo passare al Visual Editor Enterprise a pagamento — punto aperto non riconsiderato da questo ADR.
