---
stato: validato
---

# Fase 7 — Global `impostazioni-sistema` (configurazione tecnica trasversale)

> Dettaglio operativo. Fase di dominio specifica del progetto (non ereditata dal catalogo). Riferimenti: `ADR-109-global-impostazioni-sistema.md` (con l'**Emendamento a §1 del 2026-10-04** sui mittenti email), `ADR-102-divisione-area-di-gestione.md` §6, `ADR-113-ruoli-permessi-admin-app.md`, `ADR-107-modello-dati-sistema-prenotazioni.md` §1 (emendato da ADR-109 §3); `riepilogo-sessione-bucket-c.md` §3, `riepilogo-sessione-impostazioni-sistema.md`. Regole: `core/01-proporzionalita.mdc`, `core/04-changelog-commit.mdc`, `payload-pattern/02-convenzioni-payload.mdc`, `stack/01-stile-codice.mdc`, `email/01a-resend.mdc`.

Aggiornare lo stato di ogni sottofase qui sotto e in `00-piano-generale.md` non appena completata.

**Prerequisito**: Fase 3 chiusa (v0.3.0) e Fase 4.0 completata (`localization` attiva, migrazione `_locales` già applicata). Nessuna nuova risorsa GCP. La fase **non dipende dalla shell `(app)`** (Fase 8): crea i campi e i permessi. Il manager li modificherà nella sezione Orari dell'App (Fase 8.5, `ADR-113`); admin e super-admin possono già modificarli nell'Admin nativo.

---

## Perimetro e decisioni già prese (da non riaprire)

- Un solo Global, slug **`impostazioni-sistema`**, a 4 tab (Orari e chiusure, Calendario, Comunicazioni, Integrazioni future): ADR-109 §1.
- **Orari e chiusure sono la fonte unica** per menù e prenotazioni. I Global «Impostazioni prenotazioni» (5.1) e «Generali» del menù (6.1) **nascono senza quei campi** (ADR-109 §§2–3; `arco-21`, `arco-22`, direzione invertita il 2026-10-03). Questa fase **non crea** quei due Global.
- **Mittenti email** (Emendamento a §1, accettato): mittente di sistema nelle env `RESEND_FROM_ADDRESS`/`RESEND_FROM_NAME`, **invariate**; mittenti verso i clienti nell'array del Global, **un record per sito** (`vietnamonamour`, `villadoree`); **nessun fallback** tra le due sorgenti.
- **Permessi** (ADR-109 §5 come emendato dal terzo emendamento, e `ADR-113`): nell'Admin il manager non accede a questo Global; admin e super-admin hanno tutto; l'utente con `appRole: manager` legge e modifica solo la tab Orari e chiusure, dall'App; la lettura pubblica (anonima) della stessa tab è prevista da `ADR-112`. Meccanismo: funzione `access` nativa **a livello di singolo campo**, non di tab.
- Nessun segreto in campi Payload: il Global ospita solo riferimenti non sensibili. **Nessun campo `localized`**: è configurazione tecnica, non contenuto dei siti.

## Ordine di dipendenza reale

**7.0 → 7.0b → 7.1 → 7.2 → 7.3 → 7.4.** La 7.0 è una manutenzione del codice esistente (nessun campo del Global); la 7.0b aggiorna Payload e precede ogni sottofase che genera migrazioni. 7.2 e 7.3 sono indipendenti nei contenuti ma modificano lo stesso file di Global: si eseguono in sequenza, una chat Composer per sottofase. 7.4 viene per ultima perché i permessi agiscono sui campi già esistenti. La fase si esegue prima di Fase 8 e Fase 6 (`00-piano-generale.md`, «Ordine di esecuzione corrente»).

## Principi trasversali per questa fase

1. **Nomi fissati prima di scrivere codice.** Slug e `name` dei campi sono decisi all'inizio di 7.1 e **congelati alla chiusura di 7.3**, quando tutti i campi esistono: dopo, ogni ridenominazione è una modifica di schema con migrazione e rompe i consumatori (Fasi 5 e 6, via Local API). Nessun alias, nessun fallback tra nomi diversi.
2. **Convenzione lingua**: nomi di campi, funzioni e file in **inglese**; etichette dell'interfaccia in **italiano** (`stack/01-stile-codice.mdc`). Lo scostamento da ADR-109 è chiuso dal secondo Emendamento a §1 (2026-10-04).
3. **Nessun deploy prima della migrazione.** `main` fa deploy automatico su Cloud Run: per ogni sottofase che cambia lo schema, la migrazione va **applicata su Cloud SQL prod prima del push** (`pnpm payload migrate` via Auth Proxy, `docs/operativo/cloud-sql-produzione.md`).
4. **Commit solo dopo verifica runtime** (non solo TypeScript), push manuale. Voce di CHANGELOG per ogni commit.
5. **Convenzioni per la Payload 4** (`ADR-116`, accettata): nel codice nuovo `overrideAccess` e `depth` sempre espliciti, `versions` esplicito su ogni collection e Global nuovi, nessun nuovo `TypedUser` (il cast passa da `asUserAccessFields`), nessuna API che la guida della 4 rimuove o cambia (`useAPIKey`, `lexicalHTML`, `typescriptSchema`, `allowLocalizedWithinLocalized`, `min`/`max` su relationship e upload, `afterOperation` con `operation: 'read'`), script con `payload run` e nessun `config.bin`.

---

## 7.0 — Manutenzione: correzioni dall'audit (F2, F9, F10, F26)

**Stato**: ✅ fatto (2026-10-05)

**Dipende da**: Fase 3 chiusa e 4.0 completata. Nessuna migrazione, nessuna nuova risorsa GCP, nessun campo nuovo.

**Obiettivo**: quattro correzioni piccole al codice già in produzione, emerse dall'audit di coerenza del 2026-10-04 (`docs/audit/audit-repo-2026-10-04.md`), prima che le Fasi 7, 8 e 6 aggiungano codice sopra. Il rilievo F1 (un `admin` può promuoversi a `super-admin`) **non è in questa sottofase**: è affidato al template (`po-10`). L'aggiornamento di Payload **non è** in questa sottofase: è la 7.0b, subito dopo.

**Riferimenti**: audit F2, F9, F10, F26; `ADR-110` (pool di connessioni); §7.4 di questo file e `fase-8-shell-app.md` §8.3 (regola dell'utente disattivato); `core/04-changelog-commit.mdc`.

**Verificato dal pianificatore** (2026-10-04, copia di lavoro del repo a `f9d8544`, Node 22 e senza database): con `graphql` a `^16.8.1` il lockfile cambia solo per `graphql` (da 17.0.2 a 16.14.2; 88 righe nel diff grezzo, 18 dopo la normalizzazione del suffisso `(graphql@…)`); `pnpm lint` dà 0 errori e 8 avvisi (nelle due migrazioni); `next typegen` e `tsc --noEmit` senza errori; `pnpm peers check` pulito; `pnpm build` riuscito (con i font di Google sostituiti, solo nel sandbox); nel codice di `@payloadcms/next` il gestore GraphQL risponde 404 quando `graphQL.disable` è attivo. Se l'esecuzione dà un esito diverso, **fermarsi** e riferire.

**Azione umana prima di iniziare** (`po-10`, F1): controllare chi ha oggi `adminRole: admin` (con il proxy acceso: `./scripts/prod-db.sh -- psql "postgresql://vma-vd-user@127.0.0.1:5433/vma-vd-backoffice?sslmode=disable" -c "select email, admin_role, active from users where admin_role = 'admin';"`; `psql` chiede la password dell'utente del database e non legge il `.env`) e confermare che sono tutti fidati. Fino alla correzione di F1 (8.3) non creare nuovi utenti con `adminRole: admin`, nemmeno negli script o nei dati di prova.

**Passi** (in quest'ordine, un solo commit):

1. **F2 — utente disattivato**, in `lib/auth/userAccess.ts`:
   - nuova funzione esportata `isActiveUser(user)`: vera se l'utente esiste e `user.active !== false` (la stessa regola che `canAccessAdminPanel` già usa);
   - `canAccessAdminPanel` e `canAccessAppArea` la usano al posto del controllo diretto di `active`;
   - `isSuperAdminRequest` e `isStaffAdminRequest` restituiscono falso se l'utente non è attivo;
   - `usersDeleteAccess` inizia con `if (!isStaffAdminRequest(req) || !req.user) return false`;
   - **non toccare** `getAdminRole`, `canCreateUser` e `usersUpdateAccess` (passano già da `isStaffAdminRequest`), le strategie JWT, gli hook, `collections/ActivityLog.ts` e `globals/Settings.ts` (usano già gli helper).
   - Perché: oggi solo `canAccessAdminPanel` e `canAccessAppArea` guardano `active`. Un utente disattivato con il cookie ancora valido (fino a 7200 secondi) conserva i permessi via REST su `users`, `activity-log` e `settings`. L'helper è il punto unico che 7.4 e 8.3 riusano (`arco-45`, `arco-46`).
2. **F9 — pool di connessioni**:
   - in `payload.config.ts`: `pool: { connectionString: ..., max: 3 }`, con un commento che rimanda a `ADR-110` e al vincolo `--max-instances` × 3;
   - in `docs/operativo/cloud-run-produzione.md`, prima della sezione «OAuth — redirect_uri localhost in produzione», nuova sezione «Connessioni al database»: l'adapter apre al massimo 3 connessioni per istanza; le connessioni di Cloud Run sono `--max-instances` × 3 e devono restare sotto il `max_connections` dell'istanza Cloud SQL, lasciando spazio a `scripts/prod-db.sh` e alle migrazioni da locale; **valori** (indicati dall'umano il 2026-10-04): Cloud Run ha al massimo 4 istanze, quindi al massimo 4 × 3 = 12 connessioni; il `max_connections` predefinito di `db-f1-micro` è 25, da confermare con `./scripts/prod-db.sh -- psql "postgresql://vma-vd-user@127.0.0.1:5433/vma-vd-backoffice?sslmode=disable" -c "SHOW max_connections;"` prima di chiudere la sezione. Margine: 25 − 12 = 13, di cui di solito 3 riservate al superuser di PostgreSQL, quindi circa 10 per le sessioni dal proxy e per le migrazioni da locale. Scrivere i valori nella sezione **con questa attribuzione**; se `SHOW max_connections;` dà un numero diverso, usare quello e segnalarlo.
3. **F10 — graphql**:
   - in `package.json`: `"graphql": "^16.8.1"` (peer di Payload 3.89.0; la 17 non lo soddisfaceva); poi `pnpm install`;
   - `pnpm-lock.yaml` cambia solo per `graphql`: la versione risolta passa da 17.0.2 a 16.x e le chiavi di `payload`, `@payloadcms/*` e `payload-oauth2` cambiano soltanto nel suffisso `(graphql@…)`, quindi il diff grezzo è di circa 90 righe e **non va usato** come controllo. Controllo: `git show HEAD:pnpm-lock.yaml | sed -E 's/graphql@[0-9]+\.[0-9]+\.[0-9]+/graphql@X/g' > /tmp/old.yaml`, poi `sed -E 's/graphql@[0-9]+\.[0-9]+\.[0-9]+/graphql@X/g' pnpm-lock.yaml > /tmp/new.yaml`, poi `diff /tmp/old.yaml /tmp/new.yaml`: devono restare solo le righe `specifier`, `version`, `resolution` e `engines` del blocco di `graphql` e le righe `graphql: <versione>` dei pacchetti che lo dichiarano (18 righe modificate, cioè quelle che iniziano con `<` o `>`; l'output di `diff` ne mostra 32 con le intestazioni dei blocchi). Se compare un altro pacchetto con una versione diversa, **fermarsi**. La 16.x risolta può essere più recente di 16.14.2;
   - in `payload.config.ts`: `graphQL: { disable: true }` subito dopo `secret`, con un commento (nessun consumatore GraphQL pianificato);
   - **non eliminare** le route `app/(payload)/api/graphql` e `app/(payload)/api/graphql-playground`: con la disattivazione `POST /api/graphql` risponde 404 (la route esporta solo `POST` e `OPTIONS`). Il playground (`/api/graphql-playground`) resta raggiungibile in sviluppo anche con `disable`; in produzione risponde 404.
4. **F26 — controllo dei tipi riproducibile**: in `package.json`, script `"typecheck": "next typegen && tsc --noEmit"` subito dopo `lint`. `LayoutProps` è un tipo generato da Next e non è nei file versionati, quindi `tsc` da solo fallisce su un clone pulito. Non modificare le regole di catalogo.

**Verifiche tecniche** (prima del commit):

- `pnpm lint`, `pnpm typecheck` e `pnpm build` senza errori (la build usa i segnaposto del `Dockerfile`).
- `pnpm peers check` senza problemi (prima della modifica segnala `graphql` come peer non soddisfatto).
- **Prova a runtime in sviluppo** (Postgres locale). **Prerequisiti**: `DATABASE_URL` del `.env` punta al database di **sviluppo** (`127.0.0.1:5432`), mai a Cloud SQL (il seed crea un super-admin); `PAYLOAD_SECRET` valorizzato; `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `APP_PUBLIC_URL` sono valorizzati (senza, le strategie dei cookie non sono registrate: nessun cookie autentica e ogni richiesta risponde 403, quindi la prova sembra riuscita senza provare nulla). L'utente di prova deve avere `adminRole` `admin` o `super-admin`: un utente solo App è già escluso e non prova nulla. (1) Creare il primo e il secondo super-admin: `SEED_SUPERADMIN_EMAIL=<email 1> SEED_SUPERADMIN_PASSWORD=<password conforme> pnpm seed:super-admin`, poi lo stesso con `<email 2>` e `<password 2>` (il guardrail dell'ultimo super-admin locale non blocca la disattivazione del secondo finché resta il primo, attivo, con credenziali di bootstrap). (2) Avviare `pnpm dev` **dopo** aver applicato i passi 1–4 di questa sottofase (se era già avviato, riavviarlo). Cookie: `curl -c jar1.txt -X POST http://localhost:3000/api/users/login/local --data-urlencode 'email=<email 1>' --data-urlencode 'password=<password 1>'` e lo stesso per il secondo con `jar2.txt` (risposta 302). (3) **Controllo positivo, prima di disattivare**: con `jar2.txt`, `GET /api/users/me` mostra l'utente (l'`id` del secondo è nel JSON di questa risposta) e `GET /api/users`, `/api/activity-log` e `/api/globals/settings` rispondono 200. (4) Disattivare il secondo dal primo (Admin, oppure `curl -b jar1.txt -X PATCH http://localhost:3000/api/users/<id del secondo> -H 'Content-Type: application/json' -d '{"active":false}'`). (5) Con `jar2.txt`, `GET /api/users`, `/api/activity-log` e `/api/globals/settings` rispondono **403**; con `jar1.txt` 200. Prima della modifica rispondevano 200 (verificato dalla chat di verifica il 2026-10-04 a `2471059`). (6) **Riavviare `pnpm dev` dopo ogni modifica alle funzioni di `access`**: Payload le tiene in memoria e l'hot reload non le sostituisce. (7) Eliminare il secondo utente (è disattivato, il guardrail non lo blocca). (8) Eliminare `jar1.txt` e `jar2.txt`: contengono cookie di sessione e non sono ignorati da `.gitignore`.
- `curl -i -X POST http://localhost:3000/api/graphql -H 'Content-Type: application/json' -d '{"query":"{__typename}"}'` risponde 404 (prima della modifica la risposta non è 404). Una `GET` risponde 405 in ogni caso, quindi non prova nulla.
- Login Google (Admin e App) e login locale funzionano ancora.
- Se una prova fallisce, **non fare push**: `main` fa deploy automatico su Cloud Run.

**Checklist di chiusura sottofase**:
- [x] `isActiveUser` esportata e usata dalle cinque funzioni indicate; nessun altro file modificato in `lib/auth`.
- [x] `pool.max: 3` e sezione «Connessioni al database» in `cloud-run-produzione.md`, con i valori indicati dall'umano (4 istanze, `max_connections` 25 da confermare con `SHOW max_connections;`) e la loro attribuzione.
- [x] `graphql ^16.8.1`, lockfile cambiato solo per `graphql`, `graphQL.disable: true`, route GraphQL non eliminate.
- [x] Script `typecheck` presente e funzionante su un clone pulito.
- [x] Verifiche tecniche eseguite; quelle non eseguite sono dichiarate come tali nel CHANGELOG.
- [x] CHANGELOG: voci in `Added` (script), `Fixed` (F2, F9, F10) e `Tests`, **solo per ciò che è stato eseguito**.
- [x] Messaggio di commit suggerito: `fix(auth,db): utenti disattivati senza permessi, pool a 3, GraphQL spento`.
- [x] Aggiornare lo stato di 7.0 in questo file, in `piano.yaml` e in `00-piano-generale.md`.

---

## 7.0b — Aggiornamento di Payload a 3.90.2

**Stato**: ✅ fatto (2026-10-05)

**Dipende da**: 7.0 completata (`graphql ^16.8.1`, script `typecheck`). **Una chat Composer a sé**, un commit. **Con migrazione**: vale la regola «migrazione su Cloud SQL prod prima del push».

**Obiettivo**: portare `payload` e i `@payloadcms/*` da 3.89.0 a **3.90.2**, l'ultima stabile (2026-09-23). La 3.90.0 contiene «critical security fixes» (identificativi degli avvisi non recuperati dal report). Resta nella linea 3.x: nessun ADR, nessun arco di decisione.

**Riferimenti**: `docs/audit/payload-upgrade-2026-10-04.md` (§ 1, in particolare § 1.7); `ADR-116` per le convenzioni verso la 4; `core/04-changelog-commit.mdc`.

**Verificato dalla chat 2** (2026-10-04, baseline `bb95fda`, PostgreSQL 16, variabili fittizie; **la combinazione con le correzioni della 7.0 non è ancora stata provata**): `pnpm install` OK; `pnpm peers check` identico alla baseline; `next typegen` e `tsc --noEmit` senza errori; `generate:types` +2 righe (`resetPasswordRequestedAt`); migrazioni esistenti applicabili; `migrate:create` genera una sola colonna; `migrate`, `migrate:down`, `migrate` riusciti; `next build` OK (con i font di Google sostituiti nel sandbox); risposte HTTP identiche sulle route provate; `payload run` (`seed:super-admin`) OK. **Se l'esecuzione dà un esito diverso, fermarsi** e riferire.

**Non provato**: flussi Google OAuth (due istanze), invio email con Resend (attivazione, reset), login locale con un cookie reale, PostgreSQL 18 e Cloud SQL, Cloud Build e Cloud Run, il throttling dei nostri endpoint `forgot-password` e `reset-password`.

**Azioni umane prima di iniziare**: credenziali Google di sviluppo e una chiave Resend di sviluppo nel `.env` (`docs/operativo/credenziali-resend.md`); Cloud SQL Auth Proxy per la migrazione in produzione. Un database locale **vuoto** per il passo 4 e per la prova del ripristino; `APP_PUBLIC_URL=http://localhost:3000` nel `.env` di sviluppo (oggi manca: nella 7.0 è stato passato solo al processo `pnpm dev`).

**Passi** (in quest'ordine, un solo commit, dopo la verifica a runtime):

1. In `package.json`: `payload`, `@payloadcms/db-postgres`, `@payloadcms/email-resend`, `@payloadcms/next`, `@payloadcms/richtext-lexical`, `@payloadcms/translations` e `@payloadcms/ui` a `3.90.2`, **versioni esatte**. Nessun altro pacchetto cambia direttamente.
2. `pnpm install` e commit di `pnpm-lock.yaml` (Cloud Build usa `--frozen-lockfile`). Controlli: `git diff package.json` mostra solo le sette righe; il lockfile cambia di circa 700 righe (nel clone di prova +464/−265), perché cambiano anche le dipendenze transitive (per esempio Lexical da 0.41 a 0.50); `pnpm peers check` pulito (dopo la 7.0 non segnala più `graphql`). Se cambia un pacchetto diretto non elencato, **fermarsi**.
3. `pnpm generate:types` con `APP_PUBLIC_URL`, `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` impostati (senza, i plugin OAuth non si registrano e il file cambia in modo diverso). Atteso: **solo 2 righe** in `payload-types.ts` (`resetPasswordRequestedAt` in `User` e in `UsersSelect`).
4. Su un **database locale vuoto**, creato apposta (per esempio `vma_vd_migr`; mai quello di sviluppo e mai Cloud SQL) con `DATABASE_URL` puntato lì: `pnpm migrate` per applicare le migrazioni esistenti, poi `pnpm migrate:create add-reset-password-requested-at` e `pnpm migrate`. Sul database di sviluppo (`vma_vd_dev`, allineato con `push`) `pnpm migrate` si ferma con «dev mode … data loss» e chiede conferma (`docs/operativo/cloud-sql-produzione.md`): non usarlo per questo passo. Atteso: **un solo** `ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;` (la `down` fa `DROP COLUMN`). Se compare altro, **fermarsi**. La prova del ripristino (`pnpm payload migrate:down`, poi di nuovo `pnpm migrate`) si fa sullo stesso database vuoto.
5. `pnpm typecheck`, `pnpm lint` e `pnpm build` con i segnaposto del `Dockerfile`, senza errori.
6. **Verifica a runtime in sviluppo** (Postgres locale, credenziali di prova): login Admin con Google; login locale dell'App; attivazione di un utente; `forgot-password` e `reset-password`. Per gli ultimi due, annotare se il nuovo throttling della 3.90.0 interferisce con i nostri endpoint (deduzione del report, non provata). Nel database di sviluppo `push` aggiunge la colonna da solo: la migrazione **non** va lanciata lì.
7. In `piano.yaml` (`meta.vincoli_hard`): il vincolo diventa «Payload >= 3.90.0 — correzioni di sicurezza critiche della 3.90.0; CVE-2026-25544 già coperta da 3.73.0». `00-piano-generale.md` non riporta il vincolo: non toccarlo per questo. **Non** modificare la regola di catalogo `stack/01a-db-postgres.mdc` né la voce storica già spuntata di `fase-1-db-postgres.md`: annotare lo scostamento in CHANGELOG.
8. Voci di CHANGELOG (`Changed`, `Tests`) **solo per ciò che è stato eseguito**.

**Produzione**:

1. `pnpm payload migrate` da locale su Cloud SQL, tramite il proxy (`scripts/prod-db.sh`), **prima** del push.
2. Push (`main` fa il deploy con Cloud Build).
3. Dopo il deploy, un login Google e un login locale reali (azione umana).

**Ripristino**: applicativo, ridistribuire la revisione precedente di Cloud Run (la 3.89.0 funziona con la colonna presente: additiva e nullable); schema, lasciare la colonna oppure `pnpm payload migrate:down` (provato nel clone); sessioni, i token emessi dalla 3.90.2 portano l'header `authVersion` e con la 3.89.0 il campo non è usato (da provare).

**Fuori da questa sottofase**: far verificare `authVersion` (`JWT_AUTH_VERSION`, esportato da `payload` 3.90.2) alle strategie isolate di `lib/auth/jwt/`. È consigliato dal report ma non è un blocco, e la 4 lo richiede: resta un rinviato (A), da riprendere con `po-11`.

**Checklist di chiusura sottofase**:
- [x] Sette pacchetti a `3.90.2` esatta; `git diff package.json` solo su quelle righe; lockfile committato; `pnpm peers check` pulito.
- [x] `payload-types.ts` cambia solo di 2 righe.
- [x] Migrazione `add-reset-password-requested-at` generata, riletta (solo l'`ADD COLUMN`), applicata sul database vuoto `vma_vd_migr` (passo 4) e committata; su `vma_vd_dev` la colonna è aggiunta da `push`, senza `pnpm migrate`.
- [x] `pnpm typecheck`, `pnpm lint` e `pnpm build` senza errori.
- [x] Verifica a runtime eseguita (login locale App, attivazione via verify, forgot e reset); ciò che non è stato eseguito è dichiarato nel CHANGELOG.
- [x] Vincolo hard alzato a `>= 3.90.0` in `piano.yaml` (`meta.vincoli_hard`); regola di catalogo e voci storiche non toccate.
- [x] Migrazione applicata su Cloud SQL prod **prima** del push; login reali dopo il deploy (umano, 2026-10-05: migrate, push e smoke test OK).
- [x] CHANGELOG, stato di 7.0b aggiornato in questo file, in `piano.yaml` e in `00-piano-generale.md`.
- [x] Messaggio di commit suggerito: `chore(deps): aggiorna Payload a 3.90.2 (correzioni di sicurezza)`.

---

## 7.1 — Scheletro del Global e nomi

**Stato**: ✅ fatto (2026-10-06)

**Dipende da**: 4.0 completata, 7.0 (utenti disattivati senza permessi: le funzioni `access` del Global usano gli helper aggiornati) e 7.0b (Payload 3.90.2 e la sua migrazione).

**Obiettivo**: registrare il Global `impostazioni-sistema` con le 4 tab e il default di accesso più restrittivo (solo admin e super-admin), senza ancora i campi di 7.2 e 7.3.

**Riferimenti**: `ADR-109` §§1, 5; `globals/Settings.ts` (modello di Global con `access` per ruolo; la sua etichetta Admin «Identità autorizzate» deve restare distinta da quella di questo Global).

**Decisioni prese il 2026-10-04** (ADR-109 non le fissa, o le fissa in modo diverso da convenzione e codice; registrate nel secondo Emendamento a §1 di ADR-109):

1. **Nomi dei campi** in inglese camelCase, etichette in italiano. ADR-109 (e ADR-107) usano nomi italiani con trattino (`orario-inizio`, `mittenti-resend`); la convenzione di progetto e il codice esistente (`adminRole`, `allowedDomains`) usano l'inglese camelCase. Tabella confermata:

   | ADR-109 | `name` nel codice | Tipo |
   |---|---|---|
   | `servizi` | `services` | array, esattamente 2 righe |
   | ↳ `nome` | `name` | select, valori `lunch` / `dinner` (etichette Pranzo / Cena) |
   | ↳ `orario-inizio` / `orario-fine` | `startTime` / `endTime` | text `HH:mm` (ora locale, senza fuso) |
   | `giorni-riposo-settimanale` | `weeklyClosedDays` | select `hasMany`, `monday`…`sunday` |
   | `chiusure-annuali` | `annualClosures` | array |
   | ↳ `data` / `etichetta` | `date` / `label` | date solo giorno / text |
   | gruppo B&B (solo vietnamonamour.com) | `bnb` | group |
   | ↳ check-in / check-out | `checkInTime` / `checkOutTime` | text `HH:mm` |
   | `google-calendar-id` | `googleCalendarId` | text |
   | `mittenti-resend` | `resendSenders` | array |
   | ↳ `sito` / nome / indirizzo | `site` / `name` / `address` | select / text / email |
   | `contatti-notifiche-staff` | `staffNotificationContacts` | array |
   | ↳ `nome` / `email` | `name` / `email` | text / email |

   I valori `lunch`/`dinner` sono quelli che la Fase 5 userà per `servizio` (Eccezioni giorno e Prenotazioni): `ADR-107` li scriveva `pranzo`/`cena` e una nota di chiarimento (2026-10-04) li allinea, come i valori in inglese di `ADR-109` (secondo emendamento). ADR-109 non viene riscritto; questo file è il riferimento per i nomi.
2. **Tab non nominati** (solo `label`), come nei Global dei siti (Fase 4): la disposizione si può cambiare senza toccare il percorso dei dati. ADR-109 riporta tra parentesi degli identificativi (`orari-chiusure`, …) che qui sono letti come descrittivi, non come `name` dei tab.
3. **Una migrazione per sottofase** (7.1–7.3), come in Fase 4.
4. **Nessun `activityLog`** su questo Global: nessun requisito documentato (`payload-pattern/03-log-azioni.mdc`: collegarlo solo quando un requisito reale lo richiede).

**Verifica tecnica**: la tab «Integrazioni future» non ha campi (ADR-109 §1). Verificato su Payload **3.90.2** (2026-10-06): `buildConfig`, `migrate:create` e Admin accettano tab con `fields: []`; la tab «Integrazioni future» si apre senza errori.

**Checklist di chiusura sottofase**:
- [x] Global registrato con slug `impostazioni-sistema` e le 4 tab; nomi confermati dall'umano.
- [x] Prova per ruolo: admin e super-admin lo vedono; un utente con solo `appRole` non entra nell'Admin.
- [x] Migrazione generata, committata e applicata su Cloud SQL prod **prima** del push (umano, 2026-10-06).
- [x] Voce di CHANGELOG.

---

## 7.2 — Orari e chiusure (fonte unica)

**Stato**: 🔲 da fare

**Dipende da**: 7.1.

**Obiettivo**: tab «Orari e chiusure» con `services`, `weeklyClosedDays`, `annualClosures` e il gruppo `bnb` (ADR-109 §1 e terzo emendamento), più il pulsante che precompila `annualClosures` con le festività italiane (ADR-107 §1, spostato da ADR-109 §3). L'indicazione sulla colazione del B&B **non** è un campo di questo Global: è testo della pagina del sito, nel CMS.

**Riferimenti**: `ADR-109` §§1–3.

**Validazione**: `services` ha esattamente due righe, una per `lunch` e una per `dinner` (lettura di «2 voci fisse» in ADR-109); `startTime`, `endTime`, `checkInTime` e `checkOutTime` accettano solo `HH:mm` a 24 ore (`^([01]\d|2[0-3]):[0-5]\d$`) e un valore diverso viene rifiutato.

**Orari come testo** (secondo Emendamento a §1 di ADR-109): `startTime`, `endTime`, `checkInTime` e `checkOutTime` sono l'ora locale del ristorante, senza data né fuso. Non si usa un campo `date`: in Payload 3.89.0 è una colonna `timestamp with time zone` e, per il solo orario, il selettore non normalizza data né fuso.

**Forma delle date di chiusura** (audit 2026-10-04): `annualClosures[].date` si scrive sempre come giorno intero a mezzogiorno UTC, la forma che produce il selettore `dayOnly` di Payload (che normalizza a mezzogiorno solo `dayOnly`, `default` e `monthOnly`, non `timeOnly`). Lo stesso helper in `lib/` lo usano il pulsante festività, la sezione Orari dell'App, le Eccezioni giorno (Fase 5) e l'import; altrimenti il controllo duplicati (un solo record per data e servizio) e il confronto con le chiusure annuali falliscono.

**Pulsante festività** (funzione di supporto già prevista, componente custom dell'Admin, classe A): chiede l'anno e aggiunge a `annualClosures` le 12 festività nazionali di quell'anno (1 gennaio, 6 gennaio, Pasqua, Lunedì dell'Angelo, 25 aprile, 1 maggio, 2 giugno, 15 agosto, 1 novembre, 8 dicembre, 25 dicembre, 26 dicembre), con etichette in italiano. Pasqua si calcola con una funzione senza nuove dipendenze (algoritmo gregoriano). Le date già presenti non vengono duplicate. Le righe restano modificabili e cancellabili a mano. La funzione che calcola le festività e la validazione `HH:mm` stanno in `lib/` come funzioni pure, perché le riusa la sezione Orari dell'App (Fase 8.5). Dopo il componente custom: `pnpm generate:importmap` e commit di `app/(payload)/admin/importMap.js`.

**Checklist di chiusura sottofase**:
- [ ] Campi (compreso il gruppo `bnb`), validazione sul numero di servizi e sul formato `HH:mm`.
- [ ] Pulsante festività funzionante, risultato modificabile a mano.
- [ ] `annualClosures[].date` si scrive sempre come giorno intero a mezzogiorno UTC, con un helper unico in `lib/` (pulsante festività e, in seguito, App, Eccezioni giorno e import lo riusano): il controllo duplicati e il confronto con le chiusure annuali restano coerenti (audit F18).
- [ ] Migrazione applicata su Cloud SQL prod prima del push.
- [ ] La nota di `fase-5.1` in `piano.yaml` dice già che «Impostazioni prenotazioni» nasce senza questi campi (ADR-109 §3): verificata, nessuna modifica.

---

## 7.3 — Riferimenti tecnici (Calendario, Comunicazioni, Integrazioni future)

**Stato**: 🔲 da fare

**Dipende da**: 7.2.

**Obiettivo**: le altre tre tab di ADR-109 §1, così come ridefinite dall'Emendamento a §1.

**Campi**:
- **Calendario**: `googleCalendarId`, riferimento non sensibile. Resta **vuoto**: lo valorizza e lo consuma la 5.4 (`arco-24`).
- **Comunicazioni**: `resendSenders` (un record per `site`; `name`; `address`) e `staffNotificationContacts` (`name`, `email`).
- **Integrazioni future**: nessun campo.

**Validazioni** (`payload-pattern/02-convenzioni-payload.mdc`, hook di normalizzazione): `address` e `email` normalizzati (trim, minuscolo, formato); al più un record di `resendSenders` per `site`.

**Vincoli dall'Emendamento a §1**: l'env `RESEND_FROM_*` e `lib/email/env.ts` **non si toccano** in questa fase; non è previsto un test di invio al salvataggio; il prerequisito «dominio Verified in Resend prima di inserire un record» è operativo e non verificato dal sistema.

**Checklist di chiusura sottofase**:
- [ ] Campi, normalizzazione e unicità per `site`; nessun consumatore collegato.
- [ ] **Nomi congelati**: elenco degli slug e dei `name` riportato nel CHANGELOG.
- [ ] Migrazione applicata su Cloud SQL prod prima del push.

---

## 7.4 — Permessi granulari campo-per-campo

**Stato**: 🔲 da fare

**Dipende da**: 7.3 (campi esistenti). Non dipende dal nuovo valore `manager` di `adminRole` (Fase 8.3): usa i valori già esistenti.

**Obiettivo**: applicare i permessi di `ADR-113` con la funzione `access` nativa a livello di campo, senza funzionalità custom (`arco-23`).

| Chi | Permessi su `impostazioni-sistema` |
|---|---|
| `admin`, `super-admin` | Lettura e modifica di tutte le tab |
| `appRole: manager` | Lettura e modifica della sola tab Orari e chiusure (chiusure e gruppo `bnb` compresi), dall'App |
| Richiesta anonima | Sola lettura dei campi della tab Orari e chiusure (servono al menù pubblico, `ADR-112`) |
| Altri | Nessun accesso alle altre tab |

**Accesso a livello di Global**: deve ammettere gli admin, `appRole: manager` e la lettura anonima, altrimenti nessuno di loro potrebbe leggere alcun campo; la restrizione alle sole tab consentite sta sui singoli campi.

**Scrittura a livello di Global**: anche `access.update` del Global ammette admin, super-admin e `appRole: manager` (attivi); sui campi delle tab Calendario, Comunicazioni e Integrazioni `access.update` è riservato ad admin e super-admin, così un `update` del manager su quei campi viene scartato o rifiutato (prova in checklist).

**Campi non pubblici** (audit 2026-10-04): in Payload 3.89.0 un campo è nascosto solo se dichiara `access.read`; un campo senza `access.read` è leggibile da chiunque superi l'accesso del Global. Ogni campo delle tab Calendario, Comunicazioni e Integrazioni dichiara quindi `access.read` riservato ad admin e super-admin (default: nessuno). Test di non regressione: `GET /api/globals/impostazioni-sistema?locale=it` anonimo restituisce solo le chiavi della tab Orari e chiusure (`services`, `weeklyClosedDays`, `annualClosures`, `bnb`) più i campi di sistema `id`, `createdAt`, `updatedAt` e `globalType`; ogni campo nuovo si aggiunge al test.

**Utente disattivato** (audit 2026-10-04): la regola è già implementata in 7.0 (`isActiveUser`); qui si applica alle nuove funzioni `access` e si prova sul Global. Ogni funzione `access` verifica `active !== false` oltre al ruolo, come `canAccessAdminPanel`. `isStaffAdminRequest`, `isSuperAdminRequest` e le funzioni per `appRole: manager` condividono un unico helper che esclude gli utenti disattivati. Prova: un utente con `active: false` e cookie ancora valido riceve 403 su ogni risorsa (il token vale fino a 7200 secondi, il valore predefinito di `tokenExpiration`).

**Nascondere il Global dall'Admin** a `adminRole: manager` (`admin.hidden` con funzione): si implementa e si verifica in **Fase 8.3**, insieme al nuovo valore del ruolo.

**Verifiche tecniche** (non ancora fatte): prova per ruolo via Local API e REST (admin, super-admin, utente con `appRole: manager`, utente senza ruoli, richiesta anonima) su lettura e scrittura di ogni campo; rifiuto o scarto di un `update` su un campo non consentito.

**Checklist di chiusura sottofase**:
- [ ] Prova per ruolo su ogni campo.
- [ ] Ogni campo delle tab Calendario, Comunicazioni e Integrazioni dichiara `access.read` riservato ad admin e super-admin; `GET /api/globals/impostazioni-sistema?locale=it`, anonimo, restituisce **solo** le chiavi della tab Orari e chiusure (`services`, `weeklyClosedDays`, `annualClosures`, `bnb`) più i campi di sistema `id`, `createdAt`, `updatedAt` e `globalType`. Test di non regressione: ogni campo nuovo si aggiunge (audit F3).
- [ ] Un `update` di un utente `appRole: manager` sui campi delle tab Calendario, Comunicazioni o Integrazioni è scartato o rifiutato; sulla tab Orari e chiusure è accettato. La prova rilegge il valore con un admin (o dal database) dopo l'`update` del manager: su un campo vietato deve essere quello di prima, sulla tab Orari e chiusure quello nuovo. In 3.89.0 un campo vietato è scartato in silenzio (verificato il 2026-10-04): non ci si aspetta un errore.
- [ ] Un utente con `active: false` e cookie ancora valido riceve 403 sul Global (helper `isActiveUser` della 7.0; audit F2).
- [ ] Nessuna modifica di schema (solo `access`), quindi nessuna migrazione.
- [ ] Voce di CHANGELOG.

---

## Variabili d'ambiente introdotte dalla Fase 7

**Nessuna.** `RESEND_FROM_ADDRESS` e `RESEND_FROM_NAME` restano come sono (nomi invariati, un nome per variabile, senza alias).

## Incoerenze note e punti aperti

- **Accesso del manager all'Admin (risolto).** Definito da `ADR-113` (accettata): `adminRole` ottiene il valore `manager`, solo per il CMS dei siti; gli orari si modificano nell'App (Fase 8.5).
- **`servizi[].nome` in due Global.** ADR-109 §3 lascia `servizi[].nome` e `durata-slot` in «Impostazioni prenotazioni», mentre gli orari dei servizi stanno qui: il legame è solo il nome, con rischio di disallineamento. Da gestire in 5.1.
- **Assenza di migrazione dati** (ADR-109 §2): assunta in base allo stato `da_fare` di 5.1 e 6.1, non verificata contro dati già presenti in Bookly o nel backend attuale del menù.
