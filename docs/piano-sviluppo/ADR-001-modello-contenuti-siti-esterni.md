# ADR — Modello contenuti dei siti esterni

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-09-13
**Arco di decisione**: Fase 4.1 (scaffolding Collection `pages` + Global sito) → Fase 4.5 (definizione dei Block del layout builder) — `arco-03` di `piano.yaml`. Il modello contenuti scelto in 4.1 condiziona la forma della definizione dei Block quando arriverà il design.

## Contesto

Il progetto gestisce due siti esterni dallo stesso backend Payload — vietnamonamour.com (rifacimento completo da WordPress 2014) e villadoree.com (oggi solo landing page) — entrambi con alberatura confermata piatta: un solo livello sotto Home, nessuna vera sotto-sezione annidata (`riepilogo-sessione-cms-siti-esterni.md` §1).

Serve un modello di contenuti prima che possa partire lo scaffolding (fase-4.1), che non dipende dal design e può quindi iniziare subito, a differenza della definizione dei Block del layout builder (fase-4.5), bloccata finché il design dei due siti non sarà pronto (§6). La scelta qui condiziona anche lo sviluppo dei due frontend Next.js e la configurazione dei Global Payload, ed è precondizione per l'ADR — Plugin di supporto CMS e per l'ADR — Meccanismo di preview dei contenuti, entrambi dipendenti dall'esistenza della Collection `pages` (§8).

## Decisione

1. **Collection `pages`, una per sito, alberatura flat**: nessuna gerarchia nested-docs. Ogni pagina ha `slug` + un campo `layout` di tipo **Blocks** (Hero, RichText, Gallery, CTA...), non un rich-text libero monolitico — mantiene il controllo sul design lasciando al manager la libertà di comporre/ordinare le sezioni (§1/§2).
2. **Un solo Global "Impostazioni sito" per sito**, non header/footer separati, organizzato con `tabs`: **Generali** (ragione sociale/P.IVA, indirizzo, contatti, social, copyright), **Header** (`mainNav`), **Footer** (`footerNav`, qui vive Privacy Policy). Slug: `impostazioni-vma` (vietnamonamour.com) e `impostazioni-villadoree` (villadoree.com) — due Global distinti per nome, non uno condiviso (§2).
3. **Campo Link riusabile interno/esterno** per popolare `mainNav`/`footerNav`: relationship a `pages` se interno, URL libero se esterno, opzione "apri in nuova scheda" — copre sia le voci interne (Ristorante, Camere...) sia quelle esterne (Book Now → Amenitiz, WhatsApp) (§2).

## Alternative considerate

- Gerarchia parent/child tra pagine (plugin nested-docs) — scartata: entrambe le alberature sono piatte, un solo livello sotto Home, nessuna vera sotto-sezione da modellare (§1).
- Rich-text libero monolitico per il corpo pagina — scartato: perde il controllo sul design; Blocks lascia la stessa libertà compositiva al manager restando dentro componenti definiti nel codice (§2).
- Header/Footer come Global separati (pattern base del Website Template ufficiale Payload) — scartato in favore di un solo Global "Impostazioni sito" per sito con tab Generali/Header/Footer, pattern "site settings global" riconosciuto anche nella documentazione ufficiale (§2).
- Un unico Global condiviso tra i due siti — scartato: essendo un solo progetto Payload per due siti esterni, i Global non possono avere istanze multiple con lo stesso slug (§2).

## Conseguenze

- Lo scaffolding di `pages` e dei due Global (fase-4.1) può partire subito: slug, title, campi SEO ed elenco pagine sono già definiti (§1), indipendentemente dal design.
- Il contenuto del campo `layout` resta bloccato (fase-4.5) fino al design reale: ogni Block corrisponde 1:1 a un componente visivo, definirlo prima rischia di doverlo riscrivere da zero (§6).
- Precondizione per l'**ADR — Plugin di supporto CMS**: il plugin SEO opera per pagina e il plugin Redirects referenzia `pages` come target `to` interno — entrambi richiedono che la Collection esista già.
- Precondizione per l'**ADR — Meccanismo di preview dei contenuti**: la preview opera sui contenuti di `pages` e dei Global qui definiti.
- Se in futuro "Apartments" (villadoree.com) evolve verso una pagina per singolo appartamento (punto aperto, non deciso — §5), il pattern coerente resta una Collection dedicata `apartments`, additiva, non un nested-docs sotto `pages`. Questa ADR non risolve quel punto, lo eredita come vincolo di coerenza per quando/se si presenterà.
- La localizzazione (`localized: true` sui campi testuali) va abilitata in fase di scaffolding su questi stessi campi, prima di qualunque content population reale — dettaglio proprio dell'ADR — Plugin di supporto CMS, ma il modello di campi qui deciso è ciò su cui quella marcatura si applicherà.
