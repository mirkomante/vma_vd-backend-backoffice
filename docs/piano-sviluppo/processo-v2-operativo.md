# Processo di sviluppo v2 — `cursor-rules` + `cursor-payload-template`

> Documento operativo. Consolida le decisioni prese nelle sessioni precedenti in un piano costruibile. Non sostituisce i riepiloghi già prodotti (`riepilogo-v2-flusso-processo.md`) — li traduce in azioni.
>
> **Vive in questo repository** (`cursor-payload-template`), pur descrivendo il processo per entrambi i repository. Citato anche da `cursor-rules` (`README.md`, `tools/check-rules.js`) tramite rimando esterno — non duplicare il contenuto lì.

## 1. Obiettivi del processo

- Ridurre l'ambiguità nel passaggio tra pianificazione (Claude) ed esecuzione (Cursor), senza eliminare la prosa dove la prosa è appropriata.
- Far emergere le contraddizioni tra file di regole/fasi invece di lasciare che un agente le risolva silenziosamente scegliendo una lettura plausibile.
- Restare praticabile per un solista (con un'estensione minima e già definita per 2-3 persone), evitando il costo di un modello di processo troppo dettagliato o troppo rigido.
- Distinguere in modo netto cosa può essere verificato meccanicamente da cosa richiede giudizio umano, e non promettere rigore dove non è stato costruito.
- Mantenere separati il catalogo riutilizzabile (regole invarianti, template di fase) dall'istanza di un singolo progetto, con cicli di vita indipendenti.

## 2. Descrizione del processo

Il processo si articola su due repository, ciascuno con un proprio ciclo di manutenzione, più un flusso per-progetto che li combina:

- **`cursor-rules`**: regole `.mdc` organizzate per cartella (`core/`, `payload-pattern/`, `auth/`, `email/`, `stack/`). Ogni file porta un frontmatter di stato (`bozza | validato | superato`). Una modifica a un file dentro `auth/`, `email/` o `stack/` innesca un passo fisso di revisione con Composer ("confronta questo file con gli altri dello stesso asse, segnala contraddizioni"). Un secondo controllo, meccanico e non basato su un agente, verifica che i pattern glob di ogni regola coprano davvero i file che dovrebbero coprire.

- **`cursor-payload-template`**: contiene i file di fase (master + varianti), ciascuno con il proprio frontmatter di stato e una sezione `## Incoerenze note` per marcare esplicitamente ambiguità non risolte.

- **Per ogni progetto reale**: il **DAG di progetto** (`docs/piano-sviluppo/piano.yaml`) è costruito direttamente da Claude a Passo 0, come output della sessione di pianificazione — non filtrato da un catalogo. Ogni arco è tipizzato: **arco di output** (una fase produce ciò che serve a un'altra) o **arco di decisione** (una scelta condiziona più fasi). Gli archi di decisione indicano dove serve un ADR. Ogni progetto aggiunge inoltre regole locali specifiche non presenti nel catalogo `cursor-rules`: è questo l'evento frequente durante l'esecuzione, più frequente della modifica al catalogo condiviso, quindi lo stesso meccanismo di revisione per asse descritto sopra si applica anche a queste aggiunte, non solo alla composizione iniziale del progetto. A fine di ogni fase, si registra un confronto tra ciò che il file di fase richiedeva e ciò che Cursor ha effettivamente prodotto.

- **Tre funzioni** attraversano il processo (non ruoli con autorità gerarchica, salvo la soglia descritta al punto 4): chi pianifica (Claude), chi esegue (Cursor), chi valida (l'utente). Nessun artefatto passa da bozza a validato senza il passaggio del Validatore. Chi esegue non è un canale neutro: davanti a una specifica ambigua o contraddittoria, Cursor sceglie una lettura ed esegue — è un partecipante con un proprio processo percepito, non solo uno strumento, e va trattato come tale nel changelog di fine fase (vedi Fase 4).

## 3. Basi nella letteratura tecnica

Non l'articolo discusso nelle sessioni precedenti, ma i principi/fonti a cui quell'articolo stesso rimanda, più alcuni aggiunti per completezza:

- **Il processo come artefatto descrivibile**: L. Osterweil, *"Software Processes are Software Too"*, ICSE 1987. Base concettuale per trattare `cursor-rules`/template come un oggetto progettabile e revisionabile, non solo come documentazione.
- **Ruoli, artefatti, tool come elementi minimi di un modello di processo**: A. Fuggetta, *"Software Process: A Roadmap"*, ICSE 2000 ("Future of Software Engineering"). Fonte diretta della tripartizione usata per decidere cosa formalizzare nella v2 (frontmatter di stato per gli artefatti, trigger per i tool, funzioni nominate per i ruoli).
- **Tolleranza-ma-esposizione dell'inconsistenza**: R. Balzer, *"Tolerating Inconsistency"*, ICSE 1991. Base diretta della sezione `## Incoerenze note`, con un limite dichiarato: il meccanismo di Balzer prevede che i marcatori sia segnalino sia schermino i consumatori sensibili dall'inconsistenza; `## Incoerenze note` implementa solo la prima metà (segnalazione in prosa), non la seconda (schermatura).
- **Grafi aciclici diretti e ordinamento topologico**: teoria dei grafi classica (algoritmo di Kahn per l'ordinamento topologico); la stessa struttura, applicata alla schedulazione di attività, precede il software engineering nelle reti PERT/CPM della ricerca operativa (anni '50). Base per il DAG di fasi/varianti.
- **Separazione core/varianti (master/addenda)**: D. Parnas, *"On the Design and Development of Program Families"*, 1976. Il concetto di "famiglia di programmi" — un nucleo comune più punti di variazione espliciti — corrisponde direttamente al pattern master/variante già in uso nel template.
- **Verifica meccanica vs giudizio di validità**: la distinzione verification/validation ("stiamo costruendo il prodotto correttamente" vs "stiamo costruendo il prodotto corretto") origina in B. Boehm, *"Guidelines for Verifying and Validating Software Requirements and Design Specifications"*, Euro IFIP 79, 1979, pp. 711–719, ripresa in Boehm, *"Verifying and Validating Software Requirements and Design Specifications"*, IEEE Software 1(1), 1984, pp. 75–88. (Boehm, *"Software Engineering"*, IEEE Trans. Computers, 1976 esiste come riferimento correlato ma non è la fonte della distinzione.) Base del criterio usato per decidere cosa automatizzare (verifica sintattica/strutturale: script) e cosa lasciare a un controllo umano o ad agente (giudizio di correttezza semantica: contenuto di una regola, di un ADR, di una fase).
- **Costo dei modelli di processo troppo dettagliati**: G. Cugola, C. Ghezzi, *"Software Processes: a Retrospective and a Path to the Future"*, Software Process: Improvement and Practice, 4(3), 1998; A. Fuggetta, E. Di Nitto, *"Software Process"*, FOSE 2014 — retrospettive puntuali sulle PSEE (Process-centered Software Engineering Environments) degli anni '90: i modelli abbastanza formali da essere eseguibili sono costati più di quanto valessero in molti contesti reali. Base del principio di proporzionalità già in uso (niente varianti finché non servono; niente motore di enactment).

## 4. Compiti operativi per costruirlo, a partire dalla struttura attuale

### 4.1 — `cursor-rules`

- [x] Aggiungere un frontmatter `stato: bozza | validato | superato` a ogni file `.mdc` esistente (valore iniziale: `validato`, dato che sono già passati per revisione). *(fatto 2026-08-30 — 13/13 file, verificato con `check-schema` sul repo reale)*
- [x] Creare `tools/check-rules.js` (o script bash equivalente) con due sottocomandi distinti, eseguiti in sequenza obbligata:
  - `check-schema`: verifica che ogni `.mdc` abbia frontmatter parsabile e conforme — delimitatori chiusi, tipi corretti (`globs` come stringa comma-separated, `alwaysApply` booleano lowercase), campi obbligatori presenti incluso `stato`. Non richiede fixture. Intercetta il guasto più frequente: file saltato in silenzio da Cursor.
  - `check-globs`: verifica che i pattern glob di ogni regola coprano davvero i file che dovrebbero coprire. Presuppone `check-schema` superato; se `check-schema` fallisce, `check-globs` non viene eseguito. *(entrambi fatti 2026-08-30, dettagli in `README.md` del repository — sezione "Decisioni prese e perché")*
- [x] Creare una cartella `__fixtures__/` con un albero di file di esempio rappresentativo (`middleware.ts`, `lib/auth/session.ts`, `login/page.tsx`, `payload.config.ts`, ecc.), usata solo da `check-globs`. *(fatto 2026-08-30 — 21 fixture, baseline confermata in `expected-coverage.json`; l'audit pattern-per-pattern ha trovato e corretto 3 buchi di copertura reali nei glob auth/db, vedi log del repository)*
- [x] Documentare nel `README.md` del repository il trigger di revisione: quali cartelle, quando modificate, richiedono il passo fisso di Composer, e il testo esatto del prompt standard da usare. *(fatto 2026-08-30, sezione "Trigger di revisione e verifica meccanica")*

### 4.2 — `cursor-payload-template`

- [x] Aggiungere la sezione `## Incoerenze note` (vuota) in coda a ogni file master di fase esistente (`fase-1-setup.md`, `fase-2-login.md`, `fase-3-deploy.md`). *(fatto 2026-08-30 — solo i 3 master, non le varianti)*
- [x] Aggiungere lo stesso frontmatter di stato ai file di fase e alle varianti. *(fatto 2026-08-30 — 9 file, master + varianti; nessuno aveva frontmatter prima. Deliberatamente distinto dal campo "Stato" già esistente a livello di sottofase, stesso nome ma scopo diverso)*
- [x] Aggiornare `00-come-eseguire-il-piano.md` aggiungendo: le tre funzioni nominate e la regola di validazione; il sanity check iniziale di coerenza con Composer prima di iniziare l'esecuzione, più il trigger di revisione per ogni aggiunta di regola locale durante l'esecuzione; le istruzioni per costruire il DAG di progetto a Passo 0 con tipizzazione degli archi (output / decisione). *(fatto 2026-08-30 — "Passo 0" diviso in Passo 0/decisioni e Passo 1/composizione, rispecchiando la Fase1/Fase2 di §5 sotto; tutti i riferimenti incrociati a "Passo 0" negli altri file del repository aggiornati di conseguenza)*
- [x] Aggiungere un template minimo di ADR — passo standard, non facoltativo: si scrive per ogni arco di decisione del DAG di progetto, non solo per le decisioni che si discostano dagli invarianti standard. Le due categorie si sovrappongono ma non coincidono: un arco di decisione può restare dentro gli invarianti standard e comunque condizionare più fasi a valle, il che basta a richiedere l'ADR. *(fatto 2026-08-30 — `ADR-template.md` in root, copiato in ogni progetto a Passo 1)*
- [x] Aggiungere al changelog di fine fase il confronto Ufficiale-vs-Percepito-vs-Osservato (non solo Ufficiale-vs-Osservato): quando Cursor risolve un'ambiguità o una contraddizione nella specifica scegliendo una lettura, quella lettura va dichiarata da Cursor stesso prima o durante l'esecuzione, non ricostruita a posteriori guardando il codice prodotto. Aggiornare il prompt standard di fine fase per chiederlo esplicitamente. *(fatto 2026-08-30, sezione "Alla chiusura della sessione" di `00-come-eseguire-il-piano.md`)*

### 4.3 — Estensione a 2-3 persone (solo se/quando serve)

**Chiarimento terminologico**, perché "soglia di partecipanti" e "soglia di persone umane" non coincidono e la differenza non è ovvia a distanza di tempo: utente + agente sono già **due partecipanti** al processo — soglia superata dalla prima sessione in solitaria, non solo quando si aggiunge un secondo umano. Per questo il meccanismo di annotazione del Percepito (la lettura che Cursor dichiara di aver scelto davanti a un'ambiguità) non è stato lasciato in attesa qui: è già stato spostato e reso operativo in §4.2, attivo da subito.

Quello che resta genuinamente condizionato a un **secondo essere umano** (non un secondo partecipante qualsiasi) è solo l'arbitraggio:

- [ ] Aggiungere al `00-come-eseguire-il-piano.md` la riga di arbitraggio ("chi decide in caso di disaccordo sulla validazione"). Ha senso solo tra due giudizi umani indipendenti e paritari che possono disaccordare tra loro sulla validazione di uno stesso artefatto — scenario impossibile nel rapporto utente-agente, dove l'ultima parola sulla validazione è già e sempre dell'utente (§2: "nessun artefatto passa da bozza a validato senza il passaggio del Validatore"), quindi non c'è disaccordo paritario da arbitrare finché il secondo partecipante è l'agente. Attivabile solo quando si aggiunge davvero un secondo umano al processo.

### 4.4 — Perché non c'è un catalogo (e quando ricostruirlo)

`piano-catalogo.yaml`, il campo `variant_axis` e l'appendice Mermaid non fanno parte di questa versione del processo. Non è un'omissione: con un solo asse di variante oggi esistente (generale vs Payload) e un DAG di progetto lineare di tre fasi, un catalogo con validatore a sé non farebbe nulla che un `depends_on` nel DAG di progetto (§2) non faccia già. Senza un verificatore che lo giustifichi, sarebbe una notazione formale senza un problema da risolvere.

Il catalogo torna giustificato quando si verifica **una** di queste condizioni:

- arriva il **terzo asse di variante** (oggi ce n'è uno: generale vs Payload);
- il DAG di progetto **smette di essere lineare**: una fase dipende da due rami non consecutivi, o due fasi sono eseguibili in parallelo;
- l'estrazione manuale del sottoinsieme di regole/fasi per un nuovo progetto richiede **più di cinque minuti**.

Finché nessuna delle tre si verifica, il DAG di progetto resta l'unico artefatto di grafo nel sistema.

## 5. Istruzioni per l'uso, per progetto nuovo

**Fase 0 — manutenzione toolkit** (solo se le rules sono state toccate di recente): eseguire `tools/check-rules.js check-schema` su tutti i `.mdc` in `cursor-rules`; solo se supera, eseguire `check-globs` contro le fixture. Se `check-schema` fallisce, correggere il frontmatter prima di procedere — verificare la copertura dei glob su un file che Cursor sta comunque saltando non ha senso.

**Fase 1 — decisioni di progetto**: scegliere le varianti a Passo 0 con Claude; costruire il DAG di progetto come output della stessa sessione, tipizzando ogni arco (output / decisione); per ogni arco di decisione, scrivere subito un ADR breve — passo standard, non facoltativo; compilare i file di fase con `stato: bozza`.

**Fase 2 — composizione**: copiare le cartelle `.mdc` scelte in `.cursor/rules/`; copiare i file di fase in `docs/piano-sviluppo/`; salvare il DAG di progetto prodotto a Fase 1 come `docs/piano-sviluppo/piano.yaml`.

**Fase 3 — sanity check iniziale**: prima del primo prompt di sviluppo, una revisione di coerenza con Composer sull'insieme appena composto. Copre la composizione iniziale, non le aggiunte successive (vedi Fase 4).

**Fase 4 — esecuzione fase per fase**: prompt su Cursor come di consueto. Ogni volta che si aggiunge una regola locale di progetto (non proveniente dal catalogo `cursor-rules`), eseguire lo stesso passo di revisione già definito in §2: confrontare la nuova regola con gli invarianti sullo stesso asse, non l'intero insieme. A fine di ogni fase, aggiornare `stato: validato`, scrivere nel changelog il confronto Ufficiale-vs-Percepito-vs-Osservato — includendo, quando Cursor ha dovuto risolvere un'ambiguità o una contraddizione, quale lettura ha scelto — e annotare eventuali scarti irrisolti in `## Incoerenze note`. Se emerge un bug nella regola stessa (es. glob mancante), correggerlo prima in `cursor-rules`, rilanciare `tools/check-rules.js check-globs`, poi propagare la correzione alla copia nel progetto.

## 6. Punti da chiudere prima che la v2 sia pienamente operativa

- [x] Script `tools/check-rules.js` (sottocomandi `check-schema` e `check-globs`) — *(fatto 2026-08-30, vedi §4.1 sopra)*.
- [x] Prova pratica: riscrittura di una fase reale (`fase-2-login.md`) con ADR dove applicabile. *(fatto 2026-08-30 — 3 archi di decisione su 10 sottofasi classificate; 3 ADR scritte (`ADR-001`/`002`/`003` in `cursor-payload-template`), rimandi inseriti nel file di fase. Giudizio: miglioramento reale, non cerimonia — esempio concreto in `ADR-002`, motivazione dell'isolamento istanze SSO altrimenti sparsa su tre file senza spiegazione completa in nessuno. Esito procedurale non previsto da §4.2: emersa la distinzione **ADR di catalogo** (decisioni nel file master, valide per ogni progetto) vs **ADR di progetto** (deviazioni da una decisione di catalogo) — documentata in `00-come-eseguire-il-piano.md` Passo 0, non qui)*
