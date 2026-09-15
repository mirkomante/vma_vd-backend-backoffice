---
stato: validato
---

# Fase 1 — Setup progetto

> Dettaglio operativo. L'architettura è già coperta da `payload-pattern/01-architettura.mdc` — non serve una specifica di progetto per questo. Se il progetto ha una specifica di autenticazione dedicata per deviazioni dallo standard (es. `specifica-login-payloadcms.md`), è rilevante solo a partire da Fase 2, non qui. Riferimento comportamentale: tutte le regole in `.cursor/rules/`, in particolare `01-architettura.mdc`, `01-proporzionalita.mdc` e `02-processo-lavoro-agente.mdc`.

Aggiornare lo stato di ogni sottofase qui sotto e nel file indice `00-piano-generale.md` non appena completata.

---

## 1.1 — Inizializzazione progetto Next.js

**Stato**: ✅ fatto

**Obiettivo**: avere un progetto Next.js funzionante (App Router), pronto ad accogliere PayloadCMS.

**Checklist**:
- Creare il progetto Next.js con App Router (non Pages Router).
- Usare TypeScript fin dall'inizializzazione (coerente con `01-stile-codice.mdc`).
- Verificare che il progetto parta in locale con il comando di sviluppo standard, prima di procedere oltre.
- Non installare ancora Tailwind né Payload in questo passo: un passo alla volta, per isolare eventuali problemi.

**Se qualcosa non si installa**: fermarsi e seguire la regola sui problemi di installazione (`02-processo-lavoro-agente.mdc`) — riportare l'errore esatto e le istruzioni per risolverlo, senza forzare versioni o workaround non concordati.

---

## 1.2 — Installazione e configurazione PayloadCMS v3

**Stato**: ✅ fatto

**Obiettivo**: PayloadCMS v3 installato **dentro** il progetto Next.js esistente (non come progetto separato), secondo l'architettura a origine unica.

**Checklist**:
- Installare PayloadCMS v3 seguendo il percorso di integrazione ufficiale "dentro un progetto Next.js esistente", non il percorso "crea nuovo progetto Payload standalone".
- Verificare che l'installazione generi il route group `(payload)` dentro la cartella `/app` del progetto, come previsto dalla specifica architetturale — non una cartella/app separata.
- Non modificare a mano i file generati dentro `(payload)` in questo momento: sono gestiti da Payload.
- Configurare il file di configurazione principale di Payload (`payload.config.ts` o equivalente) con i valori minimi richiesti per l'avvio (secret dell'applicazione, adapter database — vedi 1.3 — collection iniziali vuote/placeholder; la collection `users` vera e propria verrà definita in Fase 2).
- Il "secret" dell'applicazione (usato da Payload per firmare la sessione) va gestito come variabile d'ambiente, mai hardcoded nel codice.

**Passaggio da confermare con l'umano**: se l'installazione richiede la generazione di un secret casuale, generarlo e chiedere conferma su dove salvarlo (variabile d'ambiente locale `.env`, da non committare — verificare che `.gitignore` lo escluda già).

---

## 1.3 — Configurazione connessione al database (locale, sviluppo)

**Stato**: 🔲 da fare

**Obiettivo**: Payload configurato per usare, in locale durante lo sviluppo, il database scelto per questo progetto (variante decisa al Passo 0, prima di iniziare la Fase 1 — vedi `00-come-eseguire-il-piano.md`).

> **Sottofase a variante**: le istruzioni operative concrete dipendono dal database scelto. Seguire il file corrispondente, poi tornare qui:
> - MongoDB → `fase-1-db-mongodb.md`
> - PostgreSQL → `fase-1-db-postgres.md` *(quando disponibile nel catalogo)*

**Checklist di chiusura sottofase (valida per qualunque variante — verificare dopo aver seguito il file di variante)**:
- [ ] La connessione al database locale è verificata (Payload si avvia senza errori di connessione).
- [ ] La stringa/i parametri di connessione sono in una variabile d'ambiente (`.env`), mai hardcoded.
- [ ] `.gitignore` esclude `.env`.
- [ ] `.env.example` riflette la variabile d'ambiente richiesta, con un commento che indica che il valore è per sviluppo locale — non l'ambiente di produzione, che si affronta in Fase 3.

**Nota**: l'ambiente cloud del database (creazione istanza di produzione, credenziali, connection string di produzione) non entra in questa sottofase — verrà affrontato in Fase 3.

---

## 1.4 — Installazione e configurazione Tailwind CSS

**Stato**: 🔲 da fare

**Obiettivo**: Tailwind disponibile per lo styling del route group App (l'Area Admin ha già il proprio styling nativo da Payload e non va toccata).

**Checklist**:
- [ ] Installare Tailwind seguendo il percorso di integrazione standard per Next.js App Router.
- [ ] Configurare i percorsi di scan (`content`) in modo da includere il route group App e i componenti condivisi, **escludendo** la necessità di toccare i file auto-generati di `(payload)`.
- [ ] Verificare che una classe Tailwind di prova, applicata in una pagina placeholder del route group App, produca l'effetto atteso in locale.
- [ ] Non introdurre altre librerie di componenti UI in questo passo, salvo diversa conferma (coerente con `01-stile-codice.mdc`).

---

## 1.5 — Verifica struttura cartelle secondo l'architettura decisa

**Stato**: 🔲 da fare

**Obiettivo**: confermare che la struttura fisica del progetto rispecchi l'architettura di `01-architettura.mdc` prima di costruire qualunque funzionalità sopra.

**Checklist**:
- [ ] Verificare che dentro `/app` esistano, come cartelle separate e riconoscibili, tutti e tre i route group previsti da `01-architettura.mdc`: `(payload)` (auto-generato, non toccato), `(app)` custom dell'Area App, e `(frontend)` per il sito pubblico.
- [ ] Verificare che non esista alcuna configurazione CORS, alcun secondo progetto, alcun deploy separato: un solo `package.json`, un solo processo di build.
- [ ] Verificare che la cartella `/app` di progetto non venga confusa, in nessun file di configurazione o commento, con il path URL `/app` dell'Area App (sono due cose distinte).
- [ ] Documentare in breve (commento o nota nel `README.md` del progetto) dove si trova cosa, per chi arriverà dopo.

---

## 1.6 — Primo avvio locale e verifica di raggiungibilità

**Stato**: 🔲 da fare

**Obiettivo**: avere una conferma concreta, non solo teorica, che l'installazione funziona end-to-end prima di chiudere la fase.

**Checklist**:
- [ ] Avviare il progetto in locale.
- [ ] Verificare che `/admin` sia raggiungibile e mostri il pannello Payload (anche se privo di collection utili — potrebbe chiedere di creare il primo utente Payload di default, cosa attesa a questo stadio e non ancora la collection `users` finale della Fase 2).
- [ ] Verificare che una pagina placeholder del route group App (path `/app`) sia raggiungibile e mostri lo styling Tailwind applicato in 1.4.
- [ ] Verificare che la home page pubblica (`/`) sia raggiungibile.
- [ ] Annotare eventuali warning in console che non bloccano l'avvio, per non perderli, ma non necessariamente risolverli ora se non richiesto per procedere (es. è normale un warning sul provider email non ancora configurato: verrà affrontato in Fase 2).

---

## 1.7 — Verifica finale di chiusura fase

**Stato**: 🔲 da fare

**Obiettivo**: verificare che la fase sia effettivamente conclusa e pronta per la Fase 2 — non è il punto in cui si fa "il commit della fase": ogni sottofase precedente ha già il proprio commit locale (vedi `00-come-eseguire-il-piano.md`, policy commit per sottofase). Questo è un controllo di chiusura, non un'operazione Git a sé.

**Checklist**:
- [ ] Verificare che ogni sottofase da 1.1 a 1.6 abbia effettivamente un commit locale corrispondente — se qualcuna ne è priva, farlo ora prima di considerare la fase chiusa.
- [ ] Verificare che `.gitignore` escluda correttamente `.env`, `node_modules`, cartelle di build.
- [ ] Verificare che nessun segreto (secret Payload, credenziali database) sia finito per errore in un file tracciato da Git, in nessuno dei commit della fase.
- [ ] Se manca ancora il push dei commit di questa fase, ricordarlo esplicitamente all'umano: il push resta un'azione manuale da GitHub Desktop, l'agente non lo esegue.
- [ ] Aggiornare lo stato a ✅ per tutte le sottofasi completate, sia in questo file sia in `00-piano-generale.md`.

---

## Note di chiusura fase

Al termine della Fase 1, prima di iniziare `fase-2-login.md`:
- [ ] Confermare con l'umano che l'ambiente di sviluppo è stabile (nessun errore bloccante al riavvio).
- [ ] Segnalare esplicitamente qualunque deviazione da questo piano avvenuta durante l'esecuzione (es. una versione di libreria diversa da quella prevista, un passaggio saltato, un cambio di package manager), così da tenerne conto in Fase 2.

## Incoerenze note

*(Nessuna al momento. Sezione per segnalare esplicitamente contraddizioni o ambiguità non risolte tra questo file e altri — vedi `processo-v2-operativo.md` §3, Balzer 1991.)*
