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

**Stato**: ✅ fatto

**Obiettivo**: Payload configurato per usare, in locale durante lo sviluppo, il database scelto per questo progetto (variante decisa al Passo 0, prima di iniziare la Fase 1 — vedi `00-come-eseguire-il-piano.md`).

> **Sottofase a variante**: le istruzioni operative concrete dipendono dal database scelto. Seguire il file corrispondente, poi tornare qui:
> - MongoDB → `fase-1-db-mongodb.md`
> - PostgreSQL → `fase-1-db-postgres.md` *(quando disponibile nel catalogo)*

**Checklist di chiusura sottofase (valida per qualunque variante — verificare dopo aver seguito il file di variante)**:
- [x] La connessione al database locale è verificata (Payload si avvia senza errori di connessione).
- [x] La stringa/i parametri di connessione sono in una variabile d'ambiente (`.env`), mai hardcoded.
- [x] `.gitignore` esclude `.env`.
- [x] `.env.example` riflette la variabile d'ambiente richiesta, con un commento che indica che il valore è per sviluppo locale — non l'ambiente di produzione, che si affronta in Fase 3.

**Nota**: l'ambiente cloud del database (creazione istanza di produzione, credenziali, connection string di produzione) non entra in questa sottofase — verrà affrontato in Fase 3.

**Eseguito (2026-09-15)**: PostgreSQL 18.3 locale già in ascolto su `127.0.0.1:5432`; database `vma_vd_dev` e utente applicativo `vma_vd_app` già presenti. Adapter `postgresAdapter` su `DATABASE_URL` e `push` solo fuori da production già configurati in 1.2; Payload `3.89.0` soddisfa il requisito `>= 3.73.0`. All'avvio Payload ha creato le tabelle di sistema (incluso il `users` di default del CMS — la collection di dominio resta Fase 2). `/admin` reindirizza a `/admin/create-first-user` (atteso a questo stadio). Migrazioni `payload migrate` non generate qui: `push: true` è ammesso in sviluppo, le migrazioni si committano prima della Fase 3. Warning non bloccante: `POST /api/graphql` 500 per race ESM su `graphql@17` — non è un errore di connessione.

---

## 1.4 — Installazione e configurazione Tailwind CSS

**Stato**: ✅ fatto

**Obiettivo**: Tailwind disponibile per lo styling del route group App (l'Area Admin ha già il proprio styling nativo da Payload e non va toccata).

**Checklist**:
- [x] Installare Tailwind seguendo il percorso di integrazione standard per Next.js App Router.
- [x] Configurare i percorsi di scan (`content`) in modo da includere il route group App e i componenti condivisi, **escludendo** la necessità di toccare i file auto-generati di `(payload)`.
- [x] Verificare che una classe Tailwind di prova, applicata in una pagina placeholder del route group App, produca l'effetto atteso in locale.
- [x] Non introdurre altre librerie di componenti UI in questo passo, salvo diversa conferma (coerente con `01-stile-codice.mdc`).

**Eseguito (2026-09-15)**: Tailwind CSS v4 con `@tailwindcss/postcss` e `postcss.config.mjs`. Direttive `@import` / `@source` in `app/globals.css` limitate a `app/(app)/**` e `components/**` (cartella condivisa ancora assente). Route group `(app)` con layout html/body dedicato e placeholder `/app` (`app/(app)/app/page.tsx`) con classi di prova (`bg-emerald-600`, ecc.). `(payload)` non importa `globals.css`; shadcn/ui rimandato a fasi successive.

---

## 1.5 — Verifica struttura cartelle secondo l'architettura decisa

**Stato**: ✅ fatto

**Obiettivo**: confermare che la struttura fisica del progetto rispecchi l'architettura di `01-architettura.mdc` prima di costruire qualunque funzionalità sopra.

**Checklist**:
- [x] Verificare che dentro `/app` esistano, come cartelle separate e riconoscibili, tutti e tre i route group previsti da `01-architettura.mdc`: `(payload)` (auto-generato, non toccato), `(app)` custom dell'Area App, e `(frontend)` per il sito pubblico.
- [x] Verificare che non esista alcuna configurazione CORS, alcun secondo progetto, alcun deploy separato: un solo `package.json`, un solo processo di build.
- [x] Verificare che la cartella `/app` di progetto non venga confusa, in nessun file di configurazione o commento, con il path URL `/app` dell'Area App (sono due cose distinte).
- [x] Documentare in breve (commento o nota nel `README.md` del progetto) dove si trova cosa, per chi arriverà dopo.

**Eseguito (2026-09-15)**: i tre route group sono già presenti da 1.2/1.4 (`app/(payload)/`, `app/(app)/`, `app/(frontend)/`). Un solo `package.json`, un solo `next.config.ts` con `withPayload`, nessun CORS/`SameSite=None`/Bearer nel codice. Il README di `create-next-app` citava ancora `app/page.tsx` (inesistente): sostituito con mappa URL ↔ cartelle e avvio `pnpm`. Commenti di disambiguazione su `app/(frontend)/layout.tsx`, `app/(frontend)/page.tsx`, `app/(app)/layout.tsx` (già presente su `app/(app)/app/page.tsx`). `fase-1-db-postgres.md` allineato alla 1.3 già chiusa (checkbox + nota eseguito).

---

## 1.6 — Primo avvio locale e verifica di raggiungibilità

**Stato**: ✅ fatto

**Obiettivo**: avere una conferma concreta, non solo teorica, che l'installazione funziona end-to-end prima di chiudere la fase.

**Checklist**:
- [x] Avviare il progetto in locale.
- [x] Verificare che `/admin` sia raggiungibile e mostri il pannello Payload (anche se privo di collection utili — potrebbe chiedere di creare il primo utente Payload di default, cosa attesa a questo stadio e non ancora la collection `users` finale della Fase 2).
- [x] Verificare che una pagina placeholder del route group App (path `/app`) sia raggiungibile e mostri lo styling Tailwind applicato in 1.4.
- [x] Verificare che la home page pubblica (`/`) sia raggiungibile.
- [x] Annotare eventuali warning in console che non bloccano l'avvio, per non perderli, ma non necessariamente risolverli ora se non richiesto per procedere (es. è normale un warning sul provider email non ancora configurato: verrà affrontato in Fase 2).

**Eseguito (2026-09-15)**: `pnpm dev` già in ascolto su `http://localhost:3000` (Next.js 16.3.5 / Turbopack, PID Node sulla 3000). Verifica browser:
- `/` → 200, vetrina `create-next-app` ("To get started, edit the page.tsx file.")
- `/app` → 200, placeholder Area App con badge `bg-emerald-600` applicato (testo bianco, `border-radius` 8px)
- `/admin` → 200, reindirizza a `/admin/create-first-user` (Welcome / Create first user) — atteso, nessun utente Payload ancora; non è la collection `users` di Fase 2

**Warning non bloccanti** (non risolti qui):
- `WARN: No email adapter provided. Email will be written to console.` — atteso; Resend è Fase 2.
- Esperimento Turbopack `turbopackServerFastRefresh` in avvio — warning Next.js, non blocca le tre route.
- `POST /api/graphql` 500 per race ESM su `graphql@17` (`ERR_INTERNAL_ASSERTION`) — già visto in 1.3 nella stessa sessione `pnpm dev`; **non riprodotto** nel passaggio browser 1.6 (`/`, `/app`, `/admin` e `/api/users/me` tutti 200). Non blocca l'Admin REST; GraphQL non è usato in Fase 1.
- Riavvio automatico precedente perché `.next/dev` era stato cancellato a caldo: il server si è ripreso da solo (`Ready`).

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
