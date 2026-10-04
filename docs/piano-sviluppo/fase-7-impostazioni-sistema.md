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

**7.0 → 7.1 → 7.2 → 7.3 → 7.4.** La 7.0 è una manutenzione del codice esistente (nessun campo del Global). 7.2 e 7.3 sono indipendenti nei contenuti ma modificano lo stesso file di Global: si eseguono in sequenza, una chat Composer per sottofase. 7.4 viene per ultima perché i permessi agiscono sui campi già esistenti. La fase si esegue prima di Fase 8 e Fase 6 (`00-piano-generale.md`, «Ordine di esecuzione corrente»).

## Principi trasversali per questa fase

1. **Nomi fissati prima di scrivere codice.** Slug e `name` dei campi sono decisi all'inizio di 7.1 e **congelati alla chiusura di 7.3**, quando tutti i campi esistono: dopo, ogni ridenominazione è una modifica di schema con migrazione e rompe i consumatori (Fasi 5 e 6, via Local API). Nessun alias, nessun fallback tra nomi diversi.
2. **Convenzione lingua**: nomi di campi, funzioni e file in **inglese**; etichette dell'interfaccia in **italiano** (`stack/01-stile-codice.mdc`). Lo scostamento da ADR-109 è chiuso dal secondo Emendamento a §1 (2026-10-04).
3. **Nessun deploy prima della migrazione.** `main` fa deploy automatico su Cloud Run: per ogni sottofase che cambia lo schema, la migrazione va **applicata su Cloud SQL prod prima del push** (`pnpm payload migrate` via Auth Proxy, `docs/operativo/cloud-sql-produzione.md`).
4. **Commit solo dopo verifica runtime** (non solo TypeScript), push manuale. Voce di CHANGELOG per ogni commit.

---

## 7.0 — Manutenzione: correzioni dall'audit (F2, F9, F10, F26)

**Stato**: 🔲 da fare

**Dipende da**: Fase 3 chiusa e 4.0 completata. Nessuna migrazione, nessuna nuova risorsa GCP, nessun campo nuovo.

**Obiettivo**: quattro correzioni piccole al codice già in produzione, emerse dall'audit di coerenza del 2026-10-04 (`docs/audit/audit-repo-2026-10-04.md`), prima che le Fasi 7, 8 e 6 aggiungano codice sopra. Il rilievo F1 (un `admin` può promuoversi a `super-admin`) **non è in questa sottofase**: è affidato al template (`po-10`). L'aggiornamento di Payload **non è** in questa sottofase.

**Riferimenti**: audit F2, F9, F10, F26; `ADR-110` (pool di connessioni); §7.4 di questo file e `fase-8-shell-app.md` §8.3 (regola dell'utente disattivato); `core/04-changelog-commit.mdc`.

**Verificato dal pianificatore** (2026-10-04, copia di lavoro del repo a `f9d8544`, Node 22 e senza database): con `graphql` a `^16.8.1` il lockfile cambia solo per `graphql` (da 17.0.2 a 16.14.2); `pnpm lint` dà 0 errori e 8 avvisi (nelle due migrazioni); `next typegen` e `tsc --noEmit` senza errori; `pnpm peers check` pulito; `pnpm build` riuscito (con i font di Google sostituiti, solo nel sandbox); nel codice di `@payloadcms/next` il gestore GraphQL risponde 404 quando `graphQL.disable` è attivo. Se l'esecuzione dà un esito diverso, **fermarsi** e riferire.

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
   - in `docs/operativo/cloud-run-produzione.md`, prima della sezione «OAuth — redirect_uri localhost in produzione», nuova sezione «Connessioni al database»: l'adapter apre al massimo 3 connessioni per istanza; le connessioni di Cloud Run sono `--max-instances` × 3 e devono restare sotto il `max_connections` dell'istanza Cloud SQL, lasciando spazio a `scripts/prod-db.sh` e alle migrazioni da locale; **da verificare**: il `max_connections` dell'istanza e il `--max-instances` impostato oggi. **Non scrivere questi due valori**: non sono noti.
3. **F10 — graphql**:
   - in `package.json`: `"graphql": "^16.8.1"` (peer di Payload 3.89.0; la 17 non lo soddisfaceva); poi `pnpm install`;
   - `git diff pnpm-lock.yaml` deve mostrare modifiche solo per `graphql`: se cambiano altri pacchetti, **fermarsi**;
   - in `payload.config.ts`: `graphQL: { disable: true }` subito dopo `secret`, con un commento (nessun consumatore GraphQL pianificato);
   - **non eliminare** le route `app/(payload)/api/graphql` e `app/(payload)/api/graphql-playground`: con la disattivazione l'endpoint risponde 404.
4. **F26 — controllo dei tipi riproducibile**: in `package.json`, script `"typecheck": "next typegen && tsc --noEmit"` subito dopo `lint`. `LayoutProps` è un tipo generato da Next e non è nei file versionati, quindi `tsc` da solo fallisce su un clone pulito. Non modificare le regole di catalogo.

**Verifiche tecniche** (prima del commit):

- `pnpm lint`, `pnpm typecheck` e `pnpm build` senza errori (la build usa i segnaposto del `Dockerfile`).
- `pnpm peers check` senza problemi.
- **Prova a runtime in sviluppo**, con Postgres locale: un utente con `active: false` e cookie ancora valido riceve 403 su `/api/users`, `/api/activity-log` e `/api/globals/settings`; un super-admin attivo continua ad avere accesso.
- `/api/graphql` risponde 404.
- Login Google (Admin e App) e login locale funzionano ancora.
- Se una prova fallisce, **non fare push**: `main` fa deploy automatico su Cloud Run.

**Checklist di chiusura sottofase**:
- [ ] `isActiveUser` esportata e usata dalle cinque funzioni indicate; nessun altro file modificato in `lib/auth`.
- [ ] `pool.max: 3` e sezione «Connessioni al database» in `cloud-run-produzione.md`, senza valori inventati.
- [ ] `graphql ^16.8.1`, lockfile cambiato solo per `graphql`, `graphQL.disable: true`, route GraphQL non eliminate.
- [ ] Script `typecheck` presente e funzionante su un clone pulito.
- [ ] Verifiche tecniche eseguite; quelle non eseguite sono dichiarate come tali nel CHANGELOG.
- [ ] CHANGELOG: voci in `Added` (script), `Fixed` (F2, F9, F10) e `Tests`, **solo per ciò che è stato eseguito**.
- [ ] Messaggio di commit suggerito: `fix(auth,db): utenti disattivati senza permessi, pool a 3, GraphQL spento`.
- [ ] Aggiornare lo stato di 7.0 in questo file, in `piano.yaml` e in `00-piano-generale.md`.

---

## 7.1 — Scheletro del Global e nomi

**Stato**: 🔲 da fare

**Dipende da**: 4.0 completata.

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

**Verifica tecnica**: la tab «Integrazioni future» non ha campi (ADR-109 §1). Verificare che Payload 3.89 accetti una tab senza campi; in caso contrario, segnalarlo prima di scegliere una soluzione.

**Checklist di chiusura sottofase**:
- [ ] Global registrato con slug `impostazioni-sistema` e le 4 tab; nomi confermati dall'umano.
- [ ] Prova per ruolo: admin e super-admin lo vedono; un utente con solo `appRole` non entra nell'Admin.
- [ ] Migrazione generata, committata e applicata su Cloud SQL prod **prima** del push.
- [ ] Voce di CHANGELOG.

---

## 7.2 — Orari e chiusure (fonte unica)

**Stato**: 🔲 da fare

**Dipende da**: 7.1.

**Obiettivo**: tab «Orari e chiusure» con `services`, `weeklyClosedDays`, `annualClosures` e il gruppo `bnb` (ADR-109 §1 e terzo emendamento), più il pulsante che precompila `annualClosures` con le festività italiane (ADR-107 §1, spostato da ADR-109 §3). L'indicazione sulla colazione del B&B **non** è un campo di questo Global: è testo della pagina del sito, nel CMS.

**Riferimenti**: `ADR-109` §§1–3.

**Validazione**: `services` ha esattamente due righe, una per `lunch` e una per `dinner` (lettura di «2 voci fisse» in ADR-109); `startTime`, `endTime`, `checkInTime` e `checkOutTime` accettano solo `HH:mm` a 24 ore (`^([01]\d|2[0-3]):[0-5]\d$`) e un valore diverso viene rifiutato.

**Orari come testo** (secondo Emendamento a §1 di ADR-109): `startTime`, `endTime`, `checkInTime` e `checkOutTime` sono l'ora locale del ristorante, senza data né fuso. Non si usa un campo `date`: in Payload 3.89.0 è una colonna `timestamp with time zone` e, per il solo orario, il selettore non normalizza data né fuso.

**Forma delle date di chiusura** (audit 2026-10-04): `annualClosures[].date` si scrive sempre come giorno intero a mezzogiorno UTC, la forma che produce il selettore `dayOnly` di Payload (che normalizza a mezzogiorno solo `dayOnly`, `default` e `monthOnly`, non `timeOnly`). Lo stesso helper in `lib/` lo usano il pulsante festività, la sezione Orari dell'App, le Eccezioni giorno (Fase 5) e l'import; altrimenti il controllo duplicati (un solo record per data e servizio) e il confronto con le chiusure annuali falliscono.

**Pulsante festività** (funzione di supporto già prevista, componente custom dell'Admin, classe A): chiede l'anno e aggiunge a `annualClosures` le 12 festività nazionali di quell'anno (1 gennaio, 6 gennaio, Pasqua, Lunedì dell'Angelo, 25 aprile, 1 maggio, 2 giugno, 15 agosto, 1 novembre, 8 dicembre, 25 dicembre, 26 dicembre), con etichette in italiano. Pasqua si calcola con una funzione senza nuove dipendenze (algoritmo gregoriano). Le date già presenti non vengono duplicate. Le righe restano modificabili e cancellabili a mano. La funzione che calcola le festività e la validazione `HH:mm` stanno in `lib/` come funzioni pure, perché le riusa la sezione Orari dell'App (Fase 8.5).

**Checklist di chiusura sottofase**:
- [ ] Campi (compreso il gruppo `bnb`), validazione sul numero di servizi e sul formato `HH:mm`.
- [ ] Pulsante festività funzionante, risultato modificabile a mano.
- [ ] Migrazione applicata su Cloud SQL prod prima del push.
- [ ] Riportato nel file di fase 5 (da scrivere) che «Impostazioni prenotazioni» nasce senza questi campi; nel file di fase 6 (scritto) è già riportato per «Generali» (6.1).

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

**Campi non pubblici** (audit 2026-10-04): in Payload 3.89.0 un campo è nascosto solo se dichiara `access.read`; un campo senza `access.read` è leggibile da chiunque superi l'accesso del Global. Ogni campo delle tab Calendario, Comunicazioni e Integrazioni dichiara quindi `access.read` riservato ad admin e super-admin (default: nessuno). Test di non regressione: `GET /api/globals/impostazioni-sistema?locale=it` anonimo restituisce solo le chiavi della tab Orari e chiusure; ogni campo nuovo si aggiunge al test.

**Utente disattivato** (audit 2026-10-04): ogni funzione `access` verifica `active !== false` oltre al ruolo, come `canAccessAdminPanel`. `isStaffAdminRequest`, `isSuperAdminRequest` e le funzioni per `appRole: manager` condividono un unico helper che esclude gli utenti disattivati. Prova: un utente con `active: false` e cookie ancora valido riceve 403 su ogni risorsa (il token vale fino a 7200 secondi, il valore predefinito di `tokenExpiration`).

**Nascondere il Global dall'Admin** a `adminRole: manager` (`admin.hidden` con funzione): si implementa e si verifica in **Fase 8.3**, insieme al nuovo valore del ruolo.

**Verifiche tecniche** (non ancora fatte): prova per ruolo via Local API e REST (admin, super-admin, utente con `appRole: manager`, utente senza ruoli, richiesta anonima) su lettura e scrittura di ogni campo; rifiuto o scarto di un `update` su un campo non consentito.

**Checklist di chiusura sottofase**:
- [ ] Prova per ruolo su ogni campo.
- [ ] Nessuna modifica di schema (solo `access`), quindi nessuna migrazione.
- [ ] Voce di CHANGELOG.

---

## Variabili d'ambiente introdotte dalla Fase 7

**Nessuna.** `RESEND_FROM_ADDRESS` e `RESEND_FROM_NAME` restano come sono (nomi invariati, un nome per variabile, senza alias).

## Incoerenze note e punti aperti

- **Accesso del manager all'Admin (risolto).** Definito da `ADR-113` (accettata): `adminRole` ottiene il valore `manager`, solo per il CMS dei siti; gli orari si modificano nell'App (Fase 8.5).
- **`servizi[].nome` in due Global.** ADR-109 §3 lascia `servizi[].nome` e `durata-slot` in «Impostazioni prenotazioni», mentre gli orari dei servizi stanno qui: il legame è solo il nome, con rischio di disallineamento. Da gestire in 5.1.
- **Assenza di migrazione dati** (ADR-109 §2): assunta in base allo stato `da_fare` di 5.1 e 6.1, non verificata contro dati già presenti in Bookly o nel backend attuale del menù.
