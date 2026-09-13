# Come eseguire il piano con Composer

> Procedimento operativo per condurre le sessioni di lavoro. Le regole in `.cursor/rules/` si applicano automaticamente in ogni chat, senza bisogno di allegarle: questo documento riguarda invece cosa fare *tu* prima e durante ogni sessione — struttura delle chat, prerequisiti, documenti da allegare.

## Le tre funzioni del processo

Tre funzioni attraversano ogni sessione — non ruoli con autorità gerarchica tra loro, salvo la regola di validazione qui sotto:

- **Chi pianifica** (Claude): produce il DAG di progetto, gli ADR, le decisioni di Passo 0.
- **Chi esegue** (Cursor/Composer): scrive il codice dentro le fasi già pianificate. Non è un canale neutro — davanti a una specifica ambigua o contraddittoria, sceglie una lettura ed esegue. Quella lettura va dichiarata da Cursor stesso prima o durante l'esecuzione (vedi "Alla chiusura della sessione" sotto), non ricostruita a posteriori guardando il codice prodotto.
- **Chi valida** (tu): nessun artefatto — file di fase, ADR, regola `.mdc` — passa da `stato: bozza` a `stato: validato` senza il tuo passaggio esplicito.

## Passo 0 — Decisioni di progetto

Prima di comporre qualunque file:

1. Scegliere, per questo progetto: provider auth, provider email, database, ambiente cloud (vedi il catalogo `cursor-rules` per le opzioni disponibili). Package manager (pnpm) e UI kit di base (shadcn/ui) sono fissi, nessuna scelta da fare.
2. Costruire il **DAG di progetto**: Claude lo produce direttamente come output di questa stessa sessione di pianificazione — non è filtrato da un catalogo. Ogni arco va tipizzato:
   - **arco di output**: una fase produce ciò che serve a un'altra (es. Fase 1 → Fase 2, ambiente locale pronto).
   - **arco di decisione**: una scelta condiziona più fasi a valle (es. provider auth scelto in Fase 2 → condiziona anche Fase 3, spike cookie in produzione).
3. Per **ogni arco di decisione** appena tipizzato, scrivere subito un ADR breve usando `ADR-template.md` — passo standard, non facoltativo. Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle: "arco di decisione" e "deviazione dagli invarianti" si sovrappongono ma non coincidono, e basta la prima per richiedere l'ADR.

   **ADR di catalogo vs ADR di progetto**: alcuni file master (es. `fase-2-login.md`) incorporano già decisioni valide per ogni progetto che adotta il template — restano nel repo catalogo come riferimento (es. `ADR-001-schema-ruoli-baseline.md`, `ADR-002-isolamento-istanze-sso.md`, `ADR-003-login-locale-app-default.md`), non si copiano a Passo 1. Se questo progetto **eredita** una di queste decisioni senza modificarla, non serve una nuova ADR: basta il rimando già presente nel file di fase. Se invece questo progetto **devia** da una decisione di catalogo (es. Area App solo-SSO invece di SSO+locale), quella deviazione è un'ADR di progetto a sé, che referenzia l'ADR di catalogo scartata invece di riscriverla.

## Passo 1 — Composizione

Una volta prese le decisioni di Passo 0:

1. Copiare in `.cursor/rules/` del progetto: tutto `core/`, tutto `payload-pattern/` (se il progetto adotta l'architettura a 4 aree), e **una sola variante per asse** da `auth/`, `email/`, `stack/` (database e cloud).
2. Copiare in `docs/piano-sviluppo/` i file di fase generici (`fase-1-setup.md`, `fase-2-login.md`, `fase-3-deploy.md`, questo file, `00-piano-generale.md`, `ADR-template.md`) e i corrispondenti **file di variante per fase** (es. `fase-1-db-mongodb.md`, `fase-2-auth-google-oauth.md`, `fase-2-email-resend.md`, `fase-3-db-mongodb.md`, `fase-3-cloud-gcp.md`, `fase-3-auth-google-oauth.md` — solo quelli pertinenti alle varianti scelte al Passo 0). Salvare il DAG prodotto al Passo 0 come `docs/piano-sviluppo/piano.yaml`.
3. Compilare i placeholder di `00-piano-generale.md`: nome progetto, sezione "Varianti adottate in questo progetto", e il paragrafo di apertura di `core/01-proporzionalita.mdc` in `.cursor/rules/` (tipo di progetto, scala attesa, criticità).
4. Creare da zero, in `docs/`, le specifiche di progetto necessarie (es. una specifica di autenticazione se si personalizza il comportamento oltre gli invarianti) — non sono un template, vanno scritte per questo progetto.

Passo 0 e Passo 1 si fanno una volta sola, non si ripetono ad ogni sessione.

## Sanity check iniziale

Prima del primo prompt di sviluppo su Fase 1 sottofase 1.1: una revisione di coerenza con Cursor Composer sull'insieme appena composto (regole + file di fase + `piano.yaml`), non solo su un singolo asse. Stesso prompt standard usato per le revisioni per asse (vedi README di `cursor-rules`):

> Confronta questo file con gli altri file dello stesso asse (stessa cartella), segnala contraddizioni.

— qui esteso all'insieme completo appena composto, non a una singola cartella.

Copre solo la composizione iniziale. Le aggiunte successive durante l'esecuzione (regole locali di progetto) seguono invece il trigger descritto sotto, in "Durante la sessione".

## Struttura delle chat: una per sottofase

- Aprire **una nuova chat Composer per ogni sottofase** (es. una chat per 1.2, una per 2.4), non una chat per l'intera fase.
- **Eccezione**: sottofasi strettamente accoppiate possono condividere una chat se separarle creerebbe più confusione che beneficio — capita tipicamente quando due sottofasi consecutive configurano la stessa integrazione da due lati speculari (es. due istanze dello stesso plugin/provider, una per area), dove la coerenza tra le due configurazioni è più importante della loro separazione netta.
- **Perché non una chat per fase intera**: una fase con molte sottofasi e dettagli tecnici diversi, tenuta in un'unica chat lunga, degrada il contesto e aumenta il rischio che l'agente perda di vista dettagli decisi all'inizio della conversazione.
- **Perché non una chat per singola checklist item**: sarebbe eccessivamente frammentato rispetto alla granularità con cui il piano è già scritto; la sottofase è l'unità di lavoro naturale.

## Prima di aprire una chat: prerequisiti

Verificare, prima di iniziare:

- La sottofase precedente nello stesso file di fase è marcata ✅ (o comunque conclusa), oppure la dipendenza è esplicitamente diversa (es. un ordine pratico alternativo segnalato in cima al file di fase).
- Se la sottofase ha un **passaggio esterno** collegato (es. un database locale da avere installato e in esecuzione, credenziali di un provider auth/email da procurarsi): quel passaggio esterno è già stato completato, non lasciarlo scoprire all'agente a metà sessione. Il file di fase segnala sempre quando una sottofase ha questo tipo di dipendenza.
- Le variabili d'ambiente necessarie (`.env`) per la sottofase sono già impostate in locale, se dipendono da un passaggio esterno appena completato.

## Cosa allegare a ogni chat

Le regole `.cursor/rules/*.mdc` sono automatiche: **non vanno mai allegate manualmente**, Cursor le carica da sola.

Da allegare esplicitamente (riferendoli nel primo messaggio della chat, non necessariamente come file upload se già nel repo — basta indicare il percorso a Composer):

1. **Il file della fase corrente**, con l'indicazione della sottofase specifica su cui si sta lavorando (es. *"leggi `docs/piano-sviluppo/fase-2-login.md`, sottofase 2.4, e procedi"*).
2. **Se la sottofase è marcata "a variante"** nel file di fase (es. 2.3/2.4/2.5 per l'auth, 1.3 per il database, 3.1/3.2/3.3 per database/cloud/auth in produzione): allegare anche il file di variante corrispondente per questo progetto (es. `fase-2-auth-google-oauth.md`) — il file di fase generico da solo non contiene le istruzioni operative concrete per quella sottofase.
3. **La sezione rilevante della specifica di progetto**, se la sottofase fa riferimento a una sezione specifica (ogni sottofase dei file di fase la cita già — basta chiedere a Composer di leggerla prima di procedere).
4. **Non serve allegare `00-piano-generale.md`** in ogni chat: è utile solo quando si vuole dare una visione d'insieme, non per il lavoro puntuale su una sottofase.

**Esempi di primo messaggio**:
- Sottofase semplice: *"Leggi `docs/piano-sviluppo/fase-1-setup.md`, sottofase 1.1, e procedi."*
- Sottofase a variante: *"Leggi `docs/piano-sviluppo/fase-1-setup.md`, sottofase 1.3, e `docs/piano-sviluppo/fase-1-db-mongodb.md`, e procedi."* — entrambi i file, il secondo contiene le istruzioni operative concrete.
- Sottofasi accoppiate (vedi eccezione sopra): *"Leggi `docs/piano-sviluppo/fase-2-login.md`, sottofasi 2.4 e 2.5 insieme (due istanze dello stesso plugin OAuth, una per area — vanno tenute coerenti), e `docs/piano-sviluppo/fase-2-auth-google-oauth.md`, e procedi."*

## Durante la sessione

- Far leggere a Composer il file di fase (e il file di variante, se pertinente) e la sezione di specifica **prima** di scrivere codice, non dopo.
- Applicare la validazione di codice ad ogni passaggio (vedi `core/03-validazione-testing.mdc`) — non serve chiederlo esplicitamente, è una regola sempre attiva, ma se Composer sembra saltarla, richiamarla.
- Proporre (o accettare la proposta di Composer per) un test in ambiente dev solo quando la sottofase raggiunge un punto concretamente verificabile a runtime — non ad ogni riga.
- Se durante la sessione si aggiunge una **regola locale di progetto** (non proveniente dal catalogo `cursor-rules`): applicare lo stesso passo di revisione già descritto per gli assi del catalogo (vedi README di `cursor-rules`) — confrontarla con gli invarianti sullo stesso asse, non con l'intero insieme delle regole. Questo è l'evento più frequente durante l'esecuzione, più della modifica al catalogo condiviso: non va saltato solo perché la regola è "solo per questo progetto".

## Alla chiusura della sessione

- Aggiornare lo stato della sottofase completata (🔲 → ✅) sia nel file di fase sia in `00-piano-generale.md`, prima di chiudere la chat.
- **Aggiornare `docs/piano-sviluppo/CHANGELOG.md`** con una voce sotto `[Unreleased]` che descrive cosa è stato fatto, inclusi esiti di test (positivi o negativi) — vedi `core/04-changelog-commit.mdc` per la checklist completa di pre-commit. Se durante la sessione Cursor ha dovuto risolvere un'ambiguità o una contraddizione nella specifica scegliendo una lettura, la voce deve includere tre cose distinte, non solo due: cosa prevedeva il piano (**Ufficiale**), quale lettura Cursor dichiara di aver scelto — chiesto esplicitamente in chat **prima o durante** l'esecuzione, non ricostruito dopo guardando il codice prodotto (**Percepito**), e cosa risulta davvero nel codice/comportamento a runtime (**Osservato**). Se non c'è stata nessuna ambiguità da risolvere, il Percepito non serve — la voce resta a due parti come sempre.
- Se durante la sessione è emersa una deviazione dal piano (versione diversa, scelta diversa da quella prevista, punto aperto risolto in un modo non anticipato), annotarla nel file di fase stesso, nella sottofase corrispondente — non lasciarla solo nella cronologia della chat, che potrebbe non essere più consultabile in futuro.
- Fare un commit Git a fine sessione (o a fine sottofase, se la sessione copre più di una sottofase), con messaggio che indichi la sottofase completata — non accumulare più sottofasi in un commit unico, per poter tornare indietro con precisione se necessario.
- **Divisione dei compiti sul commit**: l'agente prepara e crea il commit in locale (`git add` + `git commit`, messaggio descrittivo della sottofase). Il **push resta un'azione manuale dell'umano**, da GitHub Desktop (o equivalente) — l'agente non esegue il push. Questo è coerente con la prudenza generale sulle azioni che pubblicano/inviano qualcosa all'esterno: il commit locale è reversibile e a basso rischio, il push rende le modifiche visibili sul remote (ed eventualmente ad altri, se il repo è condiviso), quindi resta una conferma esplicita dell'umano.

## Prerequisiti generali per fase (oltre a quelli di sottofase)

- **Fase 1**: repository Git inizializzato e collegato, cartella `.cursor/rules/` popolata secondo il Passo 1 sopra.
- **Fase 2**: Fase 1 chiusa (✅ su tutte le sottofasi in `fase-1-setup.md`), ambiente locale verificato stabile. Prima di iniziare le sottofasi che richiedono un passaggio esterno (setup credenziali provider auth, provider email): avere già pronti, o sapere di doverli richiedere durante la sessione, gli accessi/credenziali necessari per le varianti scelte al Passo 0.
- **Fase 3**: Fase 2 chiusa (✅ su tutte le sottofasi in `fase-2-login.md`). Prima di iniziare, avere già pronti: accesso con billing abilitato all'ambiente cloud scelto, repository Git collegabile alla pipeline di deploy, accesso alla console del database di produzione, credenziali del provider email già in uso in Fase 2 (per il valore di produzione dell'indirizzo mittente, da confermare).
- **Fase 4 in poi**: prerequisiti specifici del dominio di questo progetto — da definire quando si scrive la Fase 4 (non fanno parte di questo template).
