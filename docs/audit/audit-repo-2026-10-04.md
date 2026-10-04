# Audit di coerenza e correttezza — `vma_vd-backend-backoffice`

- **Repository**: https://github.com/mirkomante/vma_vd-backend-backoffice, ramo `main`
- **SHA di HEAD verificato**: `bb95fdade20e233b8ad5ced8526b6fae323ce256` (2026-10-04 14:37 +0200, «docs(adr-108): accetta il terzo emendamento; allinea riferimenti obsoleti»)
- **Data audit**: 2026-10-04
- **Modalità**: sola lettura. Clone di lavoro fresco; per le prove su Payload ho usato una copia scratch (`pnpm install --frozen-lockfile --ignore-scripts`). Nessuna modifica al repo, nessun commit.
- **Già controllato il 2026-10-04, non rifatto**: YAML valido, 42 archi senza cicli né orfani.

**Legenda delle evidenze**

- **[L]** letto nel repo a quell'SHA.
- **[V]** verificato sui sorgenti di Payload 3.89.0 o dei plugin 3.89.0 (installati nel clone di prova), oppure eseguito.
- **[D]** dedotto: ragionamento sul codice letto, non provato a runtime.

**Limite dichiarato**: Postgres non è installabile nel sandbox (apt 404), quindi nessuna prova a runtime. I rilievi F1, F2, F3 e F24 sono [L]+[V]/[D], non riprodotti.

---

## 1. Tabella dei rilievi

Gravità: **B** = bloccante per Cursor · **P** = da correggere prima della fase interessata · **A** = da annotare.

**Nessun rilievo bloccante (B)** nelle parti lette: la Fase 7.1, prossimo passo del piano, è eseguibile. Una tab senza campi supera `buildConfig` in 3.89.0 [V].

| ID | Grav. | File:riga | Evidenza |
|---|---|---|---|
| F1 | P (8.3; codice già in produzione) | `lib/auth/userAccess.ts:73-82` (update), `:66` (solo il create controlla `data.adminRole`); `collections/Users.ts:65-74` | [L][D] Per un `admin`, `usersUpdateAccess` restituisce solo il filtro `{adminRole:{not_equals:'super-admin'}}`, applicato al documento di destinazione. Il campo `adminRole` non ha `access` e nessun hook controlla il valore in ingresso. Un `admin` può quindi portare sé stesso (o un altro admin) a `super-admin`. ADR-113:26 dice che l'admin non può «creare, modificare e cancellare» i super-admin. [V] `updateByID.js` passa `data` ad `access.update`, ma `update.js:50-54` (aggiornamento in blocco) no: un controllo solo in `access.update` non copre `PATCH /api/users?where=…`. |
| F2 | P (7.4 e 8.3) | `lib/auth/userAccess.ts:22,40`; `lib/auth/jwt/isolatedJwtAuthStrategies.ts:106-135,157-215`; `fase-7:137-148`, `fase-8:76-78` | [L] Solo `canAccessAdminPanel` controlla `active`. `isStaffAdminRequest`, `isSuperAdminRequest` e le strategie JWT (che ricaricano l'utente) non lo fanno. Un utente disattivato con cookie valido conserva i permessi via REST fino alla scadenza del token. [V] `tokenExpiration` non è impostato in `Users.ts`: il default di Payload è 7200 s (`collections/config/defaults.js:127,141`). Le funzioni `access` di 7.4 e 8.3 non citano `active`. |
| F3 | P (7.4) | `fase-7:20,141-144`; `ADR-109:75`; `ADR-112:18` | [V] In `payload/dist/fields/hooks/afterRead/promise.js:225` un campo viene nascosto solo se dichiara `access.read`. Un campo senza `access.read` è leggibile da chiunque superi l'accesso del Global. Il piano apre il Global in lettura anonima per la tab Orari e chiusure e poi «restringe sui singoli campi»: ogni campo di Calendario, Comunicazioni (`resendSenders`, `staffNotificationContacts` con email dello staff) e Integrazioni dimenticato diventa pubblico. |
| F4 | P (4.3 Parte A) | `fase-4:191`, `ADR-104:17`, `collections/Users.ts:36-46,211-226` | [L][V] `users` non ha `useAPIKey`. La strategia API-key di Payload (`auth/strategies/apiKey.js`) autentica per hash e non controlla `active` né i ruoli. La creazione utenti rifiuta chi ha entrambi i ruoli `none` (`Users.ts:211-226`). L'«utente tecnico a sola lettura per sito» non è realizzabile senza una decisione di schema. |
| F5 | P (4.2) | `fase-4:162,171`; `ADR-113:34`; `ADR-105:18` | [V] Il plugin Redirects 3.89.0 (`dist/index.js`) imposta `access: {read: ()=>true, ...overrides.access}`; `create/update/delete` restano al default di Payload (qualunque autenticato). «Redirects accessibile solo agli admin» contraddice la lettura REST anonima che i siti usano per applicare i redirect. Il plugin genera una sola collection (`slug` da `overrides.slug`); campo `type` 301/302 solo se si passa `redirectTypes`. |
| F6 | P (5.2/5.6) | `.cursor/rules/payload-pattern/01-architettura.mdc:23-26`; `ADR-105:19`; `ADR-107:57`; `payload.config.ts:26-72` | [L] La regola vieta qualunque CORS. Il form pubblico «Prenota un tavolo» e `GET /api/slot-candidati` sono chiamati dal browser di due siti su altra origine: servono `cors` (e `csrf`) in config, che oggi non esistono. Nessun ADR dichiara la deroga a questa regola. |
| F7 | P (4.4A, 5.3, 6.4, 6.5) | `collections/ActivityLog.ts:32-40`; `lib/activityLog/constants.ts:1-8`; `fase-4:146,232`; `fase-6:304,370`; `fase-7:69` | [L] In `activity-log` il campo `user` è `required: true` (e `user_id NOT NULL` nella migrazione iniziale); `eventType` non ha valori per azioni di sistema; non c'è un campo per l'id dell'evento o della build. Il piano chiede di registrare esiti di revalidation, job Scheduler, rebuild e anonimizzazione, che non hanno un utente. |
| F8 | P (5.3/5.4, GDPR) | `ADR-107:88,93`; `ADR-106:50` | [L] L'anonimizzazione azzera nome, cognome, email, cellulare, note, motivo e token. L'evento Google Calendar delle prenotazioni `confermata` si rimuove solo all'uscita da `confermata` verso `cancellata`/`no-show`. Una prenotazione servita resta `confermata`: nome e telefono restano nel calendario oltre i 90 giorni. |
| F9 | P (go-live Fase 6) | `ADR-110:25`; `payload.config.ts:44-47` | [L] ADR-110 giustifica `db-f1-micro` con `pool: { max: 3 }` «lato adapter Payload». Il codice imposta solo `connectionString`: il default del pool non è 3. Il limite di connessioni di `db-f1-micro` non è verificato. |
| F10 | P (4.1/6.2) | `package.json:32`; `CHANGELOG:204` | [V] `graphql ^17.0.2` contro peer `^16.8.1` sia in `payload` sia in `@payloadcms/next`. Il CHANGELOG registra un 500 su `POST /api/graphql` in 1.3 (race ESM su `graphql@17`) e dice «non riprodotto» in 1.6 (riga 201). L'endpoint GraphQL resta esposto (`graphQL.disable` assente) e col go-live le collection pubbliche saranno interrogabili anche da lì. |
| F11 | P (6.5) | `piano.yaml:620-631` (arco-19), `:42-47`; `fase-4:218`; `fase-6:364` | [L] arco-19 impone 4.4 → 6.5 e dice «meccanismo verificato» in 4.4. `fase-4:218` dice che 4.4 non contiene nulla del meccanismo Cloud Build; l'ordine di esecuzione mette 6.5 prima di 4.x. L'arco non rappresenta una dipendenza reale. |
| F12 | P (6.2) | `fase-6:270,276` contro `:21,41,204,32` | [L] `specialOnly` (campo nuovo su `fixed-menus`) è «da inserire prima del congelamento dei nomi», che avviene alla chiusura di 6.2. 6.3 (dove nasce `special-days` e dove si decide `specialOnly`) viene dopo 6.2 e 6.8: la scadenza non è rispettabile. |
| F13 | P (6.8/go-live) | `ADR-110:35`; `piano.yaml:493-518` (arco-26/27); `fase-6` (checklist di 6.0–6.8) | [L] arco-26/27 e ADR-110 §3 chiedono la rivalutazione HA come «voce della checklist di chiusura» del go-live. Nessuna checklist di Fase 6 la contiene. |
| F14 | P (Fase 5) | `fase-7:66`; `ADR-107:26,48,71`; `ADR-109:141` | [L] `fase-7:66` dice che `lunch`/`dinner` devono coincidere con `servizio` di ADR-107 «oggi `pranzo`/`cena`»: i due insiemi sono diversi. ADR-107 non è emendato. Il piano dice che 5.x userà gli stessi nomi, ma non scrive come. |
| F15 | A | `fase-4:27` contro `:224` | [L] «4.3 Parte A e 4.4 Parte A possono procedere in parallelo» contro «4.4 Parte A dipende da 4.3 Parte A». |
| F16 | A | `ADR-102:20,34` contro `ADR-105:18-19,40`, `ADR-112 §1` | [L] ADR-102 dice che form pubblico e menù «restano REST+token»; ADR-105 e ADR-112 dicono letture senza token (il token è solo per la preview). |
| F17 | A (4.2) | `fase-4:161` | [V] Nel plugin SEO 3.89.0 il gruppo `meta` non è `localized` (`dist/index.js:22-28`); i sotto-campi non li ho letti. Va dichiarato in 4.2 come override esplicito. |
| F18 | A | `fase-7:95`, `ADR-107:55`, `ADR-109:142-143` | [V][D] `DatePicker.js:65-67` normalizza a mezzogiorno solo `dayOnly`/`default`/`monthOnly`. Pulsante festività, App, import ed Eccezioni giorno devono scrivere la stessa forma di data, altrimenti il controllo duplicati («un solo record per data+servizio») e il confronto con `annualClosures` falliscono. |
| F19 | A | `fase-6:304`; `ADR-105` (nota 2026-10-04) | [L] Un solo secret condiviso per tutti gli endpoint Scheduler (6.4 e 5.3), servizio pubblico, nessun rate limit citato. |
| F20 | A (5.3) | `ADR-105:19`; `ADR-107:86` | [D] Create anonimo senza `access.create` per campo (`stato`, `canale`, `anonimizzata`, `token-cancellazione`, `google-calendar-event-id`). Controllo capienza in hook senza lock: due richieste concorrenti possono superare la capienza. Nei documenti letti non compaiono anti-spam né rate limit. |
| F21 | A | `00-piano-generale.md:31,101-105,113`; `piano.yaml:110`; `fase-8:154`; `piano.yaml:574-578,598`; `ADR-108:7`; `tracciamento-processo-adr-dag.md:125-130` | [L] Fase 4 «🔶 in corso» nel piano generale e `da_fare` in `piano.yaml:110` (4.0 è `fatto`). `00-piano-generale:101-105` è testo di template ormai superato. «vedi sopra» (riga 113) rimanda a una nota non più presente e sull'allow-list: CHANGELOG:163 la dà per popolata. `fase-8:154` dice «le quattro righe» su una tabella di 5. «Piatti/Vini/Birra» è superato dal terzo emendamento (`piano.yaml:574-578,598`, `ADR-108:7`). In `tracciamento…` restano da spuntare file di fase che esistono. |
| F22 | A | `piano.yaml:541-553,717-725`; `fase-8:27,168` | [L] `fase-8:168` dichiara le dipendenze di 8.5 da 8.2 e dai campi/permessi di Fase 7 (7.2, 7.4). Negli archi esistono 8.3→8.5 e 7.2→8.5, ma non 8.2→8.5 né 7.4→8.5. |
| F23 | A | `ADR-109:180`, `ADR-113:68` contro `fase-7:141`, `ADR-112:18` | [L] ADR-109 e ADR-113 dicono che il Global «non è pubblico per default» e rimandano la forma di esposizione ad ADR-111; fase-7 e ADR-112 hanno già deciso la lettura anonima della sola tab Orari e chiusure. |
| F24 | P (4.1) | `fase-4:104-146` (4.1), `ADR-105:18`, `ADR-104:17` | [V] Nel `find` REST (`collections/endpoints/find.js:8`) `draft` è un parametro di query accettato da chiunque. Con `versions.drafts` e `access.read` pubblico, `find.js:75,103-104` combina solo il `where` restituito dall'`access`: nessun filtro automatico su `_status`. Con un `read` che restituisce `true` per gli anonimi, `GET /api/pages-vma?draft=true` espone le bozze. 4.1 non specifica come l'accesso in lettura distingue pubblicato da bozza. |
| F25 | P (6.1) | `fase-6:11,93`; `piano.yaml:187`; `fase-8:193`, `:11`; `fase-8:27,193` | [L] 6.1 «Dipende da: Fase 7 e Fase 8 completate». Fase 8 comprende 8.6, che è `bloccata` fino a 6.6 e 8.5 (`fase-8:193`, arco-36/37), e 6.6 dipende da 6.1 e 6.2. «Fase 8 completata» non è soddisfacibile prima di 6.1. |
| F26 | A | `tsconfig.json`, `.gitignore:75` | [V] Su un clone pulito `tsc --noEmit` dà 2 errori (`LayoutProps` in `app/layout.tsx:2` e `app/(frontend)/layout.tsx:22`): è un tipo globale generato da Next in `next-env.d.ts`/`.next/types`, gitignorati. Non è un difetto del codice, ma non esiste un passo che lo faccia in modo riproducibile prima del type-check (il `Dockerfile` lo ottiene con `next build`). `pnpm lint`: 0 errori, 8 warning nelle due migrazioni (parametri `payload`/`req` inutilizzati). |
| F27 | A | `piano.yaml:9,146,161`; `ADR-107:17`; `ADR-109:11`; `00-piano-generale:22` | [L] `riepilogo-sessione-bucket-c.md` è citato 23 volte come fonte di decisioni (push Google Calendar, riferimento calendario, ordine del job) ma non è nel repo né nel Project. I rimandi `bucket-c §N` non sono verificabili da nessuna parte. |

---

## 2. Correzioni proposte (testo esatto)

### F1 — escalation a super-admin (`collections/Users.ts`, hook `beforeValidate`)

Aggiungere in testa all'hook `beforeValidate` esistente (copre sia l'aggiornamento singolo sia quello in blocco; gli script con `overrideAccess` non hanno `req.user` e non sono toccati):

```ts
const incomingAdminRole = (data as UserWriteData | undefined)?.adminRole
const actor = req.user as UserAccessFields | null
if (
  actor &&
  incomingAdminRole === 'super-admin' &&
  actor.adminRole !== 'super-admin' &&
  (originalDoc as UserAccessFields | undefined)?.adminRole !== 'super-admin'
) {
  throw new ValidationError({
    collection: 'users',
    errors: [{ message: 'Solo un super-admin può assegnare il ruolo super-admin.', path: 'adminRole' }],
  })
}
```

Aggiungere una prova per ruolo (REST e Local API con `overrideAccess: false`) a `fase-8` §8.3: «un `admin` che imposta `adminRole: super-admin` su sé stesso o su un altro admin è rifiutato, anche con `PATCH /api/users?where=…`».

### F2 — `active` in ogni `access`

Aggiungere a `fase-7` §7.4 e `fase-8` §8.3: «Ogni funzione `access` verifica `active !== false` oltre al ruolo, con la stessa regola di `canAccessAdminPanel`. `isStaffAdminRequest`, `isSuperAdminRequest` e le nuove funzioni per `manager` condividono un unico helper che esclude gli utenti disattivati; prova: un utente con `active: false` e cookie valido riceve 403 su ogni risorsa.»

### F3 — `access.read` su ogni campo non pubblico

Aggiungere a `fase-7` §7.4: «Ogni campo delle tab Calendario, Comunicazioni e Integrazioni dichiara `access.read` riservato ad admin e super-admin (default: nessuno). Test di non regressione: `GET /api/globals/impostazioni-sistema?locale=it` anonimo restituisce solo le chiavi della tab Orari e chiusure; ogni nuovo campo viene aggiunto a questo test.»

### F4 — token per le bozze

Aggiungere a `fase-4` §4.3 Parte A, in «Letture in `draft: true`»: «L'accesso in lettura alle bozze usa una collection dedicata `api-clients` (`auth: { useAPIKey: true, disableLocalStrategy: true }`, un record per sito, sola lettura su `pages-*` e `impostazioni-*`), separata da `users`; nessuna modifica alla validazione dei ruoli di `users`. Da confermare in ADR-111.»

### F5 — Redirects

Sostituire la prima voce della checklist di `fase-4` §4.2: «Redirects: due istanze di `redirectsPlugin`, una per sito (`overrides.slug: 'redirects-vma'` con `collections: ['pages-vma']`; `overrides.slug: 'redirects-villadoree'` con `collections: ['pages-villadoree']`); `access.read` pubblico; `create`, `update`, `delete` con `({ req }) => isStaffAdminRequest(req)`; `redirectTypes: ['301','302']`. Verificare a runtime che le due istanze convivano (non provato).»

### F6 — CORS e abuso del form

Nuovo `ADR-114` «Form pubblico prenotazioni: CORS e protezione dall'abuso», con deroga citata a `payload-pattern/01-architettura.mdc` («Nessuna configurazione CORS»). Contenuto minimo: `cors` e `csrf` limitati a `SITE_VMA_PUBLIC_URL`; `access.create` per campo sulla collection Prenotazioni (`stato`, `canale`, `anonimizzata`, `token-cancellazione`, `google-calendar-event-id` non scrivibili da richieste anonime); rate limit e anti-spam; forma della risposta senza dati di altre prenotazioni.

### F7 — log di sistema

Emendamento a `payload-pattern/03-log-azioni.mdc` per questo progetto, da decidere prima di 6.4: «`activity-log.user` facoltativo; nuovo `eventType` `systemAction`; nuovo campo `detail` (testo, per esempio id build o esito); migrazione.» Alternativa, da annotare in `fase-4` §4.4 e `fase-6` §§6.4–6.5: «le azioni di sistema si registrano in Cloud Logging, non in `activity-log`».

### F8 — anonimizzazione e calendario

Aggiungere a `ADR-107` §5 (emendamento): «L'anonimizzazione elimina prima l'evento Google Calendar collegato (`google-calendar-event-id`), poi svuota il campo e i dati identificativi.» Stessa riga nella checklist di 5.4.

### F9 — pool

Opzione A, in `payload.config.ts`: `pool: { connectionString: process.env.DATABASE_URL || '', max: 3 }`, e in `cloud-run-produzione.md`: «`--max-instances` per servizio tale che istanze × 3 non superi `max_connections` dell'istanza Cloud SQL (da verificare in 3.1)». Opzione B: nota di chiarimento in ADR-110 che toglie il riferimento a `pool: { max: 3 }`.

### F10 — graphql

`package.json`: `"graphql": "^16.8.1"` (stessa riga `package.json:32`). In aggiunta, in `payload.config.ts`: `graphQL: { disable: true }`, con riga di CHANGELOG, dato che nessun consumatore pianificato usa GraphQL.

### F11 — arco-19

In coda alla descrizione di `arco-19` (`piano.yaml`): «Arco informativo: ADR-105 è accettata e 4.4 non produce nulla per 6.5; non impone un ordine di esecuzione (vale `meta.ordine_esecuzione`).»

### F12 — `specialOnly`

In `fase-6` §6.2, aggiungere alla riga `fixed-menus`: «`specialOnly` (checkbox, falso)». In §6.3 sostituire «(**campo nuovo**, da approvare e da inserire prima del congelamento dei nomi, o con una migrazione additiva)» con «(campo già creato in 6.2)». Il caso di prova di 6.3 resta invariato.

### F13 — HA

Aggiungere alla checklist di 6.8, voce di esecuzione in produzione: «- [ ] Rivalutazione esplicita dell'HA di Cloud SQL (ADR-110 §3, arco-26 e arco-27): decisione e data annotate in `docs/operativo/cloud-sql-produzione.md`.» Nella checklist di chiusura di 5.3: la stessa voce.

### F14 — valori di `servizio`

In `fase-7:66`, sostituire con: «I valori `lunch`/`dinner` sono quelli che la Fase 5 userà per `servizio`.» Aggiungere in `ADR-107` una nota di chiarimento: «`servizio` (Eccezioni giorno, Prenotazioni) e `servizi[].nome` assumono i valori `lunch` e `dinner` (ADR-109, secondo emendamento); etichette «Pranzo» e «Cena».»

### F15 — `fase-4:27`

Sostituire con: «4.3 Parte A precede 4.4 Parte A (ADR-111 nasce in 4.3 e si completa in 4.4).»

### F16 — ADR-102

Nota di chiarimento in `ADR-102` §4 e Conseguenze: «Letture di contenuto pubblicato e form pubblico: REST senza token (ADR-105, ADR-112). Il token API è riservato alla preview delle bozze (ADR-104).»

### F17 — SEO

In `fase-4` §4.2, sostituire «campi meta `localized`» con: «`@payloadcms/plugin-seo` con `fields` override che marca `localized: true` i campi `title` e `description` del gruppo `meta` (il gruppo non lo è di default in 3.89.0).»

### F18 — forma delle date

Aggiungere a `fase-7` §7.2: «`annualClosures[].date` si scrive sempre come giorno intero a mezzogiorno UTC (stessa forma del selettore Payload `dayOnly`); lo stesso helper in `lib/` è usato da pulsante festività, sezione Orari dell'App, Eccezioni giorno e import.»

### F19 — secret Scheduler

Nota in `ADR-105`: «Il confronto del secret è a tempo costante; il secret è distinto per scopo (`SCHEDULER_SECRET_AVAILABILITY`, `SCHEDULER_SECRET_ANONYMIZATION`) oppure gli endpoint verificano il token OIDC del service account dello Scheduler. Scelta da annotare in 6.0.»

### F20 — Prenotazioni

Aggiungere a `fase-5` (da scrivere) e a `ADR-114`: «Il controllo di capienza e la creazione avvengono nella stessa transazione, con blocco per slot (`SELECT … FOR UPDATE` oppure vincolo di unicità equivalente); prova di concorrenza con due richieste simultanee sullo stesso slot.»

### F21 — allineamenti

- `piano.yaml:110`: `stato: "in_corso"` (4.0 `fatto`, 4.1–4.4 `da_fare`).
- `fase-8:154`: «Le cinque righe della tabella verificate…».
- `00-piano-generale.md`: eliminare le righe 101-105 (testo di template) e riscrivere la riga 113 senza «vedi sopra».
- `piano.yaml:574-578,598` e `ADR-108:7`: «Piatti/Vini/Bevande» al posto di «Piatti/Vini/Birra».
- `tracciamento-processo-adr-dag.md:125-130`: spuntare i file di fase che esistono (4, 6, 7; non 5).

### F22 — archi di 8.5

Aggiungere a `piano.yaml`:

```yaml
  - id: arco-41
    da: fase-8.2
    a: fase-8.5
    tipo: output
    descrizione: "La sezione Orari usa il layout e la navigazione dell'App (8.2)."
    adr: null
    fonte: "fase-8-shell-app.md §8.5"

  - id: arco-42
    da: fase-7.4
    a: fase-8.5
    tipo: output
    descrizione: "Permessi di campo su impostazioni-sistema (appRole manager sulla sola tab Orari e chiusure)."
    adr: null
    fonte: "fase-7-impostazioni-sistema.md §7.4, ADR-113"
```

### F23 — esposizione degli orari

Nota di chiarimento in `ADR-109` e `ADR-113` (`Conseguenze`, voce ADR-111): «La lettura anonima della sola tab Orari e chiusure è decisa in `ADR-112` §1 e `fase-7` §7.4; ADR-111 indica solo se i siti la usano con la stessa REST.»

### F24 — bozze via REST

Aggiungere a `fase-4` §4.1, «Permessi»: «`access.read` delle collection `pages-*` (e dei Global con `versions.drafts`): `({ req }) => (isManagerOrStaff(req.user) ? true : { _status: { equals: 'published' } })`, dove `isManagerOrStaff` richiede utente attivo con `adminRole` `manager`, `admin` o `super-admin` (stesso helper di F2).» Aggiungere alla checklist di 4.1: «- [ ] `GET /api/pages-vma?draft=true&locale=it` e `GET /api/pages-villadoree?draft=true&locale=en`, anonimi, restituiscono solo documenti pubblicati.»

### F25 — prerequisito di 6.1

- `fase-6:11`: «**Prerequisito**: Fase 3 chiusa, Fase 4.0, Fase 7 e Fase 8.1–8.5 completate (8.6 resta bloccata fino a 6.6, `arco-36`, `arco-37`).»
- `fase-6:93` (6.1): «**Dipende da**: Fase 7 e Fase 8.3 completate (valore `manager` di `adminRole`, `admin.hidden`). Non dipende da 6.0.»
- `piano.yaml:187`: «Si esegue dopo fase-7 e fase-8 (8.1–8.5; 8.6 dopo 6.6).»

### F26 — type-check riproducibile

Aggiungere a `package.json` uno script, per esempio `"typecheck": "next typegen && tsc --noEmit"`, e citarlo in `core/03-validazione-testing` oppure nel README. Da confermare che `next typegen` esista in Next 16.3.5 (non verificato).

### F27 — fonte mancante

Aggiungere in `tracciamento-processo-adr-dag.md` una riga: «`riepilogo-sessione-bucket-c.md`: citato da `piano.yaml`, ADR-107, ADR-109; non presente né nel repo né nel Project; i rimandi `bucket-c §N` non sono verificabili.» Opzione: caricare il file nel Project.

---

## 3. Verificato e corretto

**Fatto contro codice**

- **Fase 4.0 [L]**: `localization` e `i18n` in `payload.config.ts:28-39` sono identici a ADR-103 e a `fase-4` §4.0 (`locales`, `defaultLocale: 'it'`, `fallback: true`, `supportedLanguages: { it }`, `fallbackLanguage: 'it'`). `@payloadcms/translations` è dipendenza diretta a 3.89.0. La migrazione `20261003_155849_localization_enum` crea solo l'enum `_locales` e `migrations/index.ts` la registra.
- **Fase 8, «Stato attuale del repo (verificato)» [L]**: confermato in tutto. `canAccessSection` è uno stub che ritorna `false` e nessuno lo importa; `AppSection` ha due valori; Next 16.3.5, React 19.2.8, Tailwind `^4.3.3` con `@tailwindcss/postcss`; nessun `components.json` né `tailwind.config`; `app/globals.css` è importato da `(app)` e `(frontend)`; il testo «placeholder Fase 1» c'è in `app/(app)/layout.tsx:20`.
- **8.3 e 8.4 [L]**: `lib/auth/localPasswordGuard.ts` usa `adminRole !== 'none'`, quindi `manager` è già coperto dal vincolo «solo SSO» senza modifiche. `scripts/seed-super-admin.ts` crea `loginMethod: 'sso'` con `active: true`, come dice `fase-8:138`.
- **Fase 3 e documenti operativi [L]**: servizio `vma-vd-backend-backoffice-git`, service account di runtime, istanza `vma-vd:europe-west1:vma-vd-database`, `scripts/prod-db.sh`: coerenti tra `docs/operativo/*`, `scripts/` e `Dockerfile`.
- **Cookie [L]**: `auth.cookies.secure` in produzione e `sameSite: Lax` in `Users.ts:37-41`, come da `cloud-run-produzione.md`.
- **Numeri del seed [L]**: 13 Paesi (12 abilitati), 16 regioni (15), 3 denominazioni, 6 classificazioni, 14 allergeni coincidono tra ADR-108 (primo emendamento) e `fase-6` §6.1.
- **ADR e `piano.yaml` [L]**: gli stati dei 12 ADR esistenti coincidono con quelli del corpo dei file (`accettata`); ADR-111 è `da_scrivere` e tutti i rimandi a ADR-111 sono prospettici.
- **Coerenza del DAG con l'ordine di esecuzione [L]**: letti tutti gli archi. L'unica incoerenza logica è arco-19 (F11); i prerequisiti di fase sono incoerenti in F25.

**Voci «non verificato» dei file di fase, risolte oggi su Payload 3.89.0 [V]**

| Voce | Dove | Esito |
|---|---|---|
| Una tab senza campi è accettata? | `fase-7:71` | Sì: `buildConfig` accetta `{label:'Integrazioni future', fields: []}` (prova eseguita). Il rendering dell'Admin non è verificato. |
| Tab non nominati: la disposizione si cambia senza toccare il percorso dei dati? | `fase-4:47` | Sì: `UnnamedTab` ha `label` e non ha `name` (`fields/config/types.d.ts:656-667`): nessun segmento nel percorso dati. |
| `admin.preview` esiste? | `fase-4:196` | Sì, `preview?: GeneratePreviewURL` per collection (`types.d.ts:439`) e Global (`:202`). |
| `admin.hidden` con funzione: riceve l'utente? | `fase-8:77`, `ADR-113:50` | Sì, ma con tipi diversi: collection `{user: ClientUser}`, Global `{user: PayloadRequest['user']}`. L'effetto a runtime per ruolo non è verificato. |
| Un campo `date` è `timestamp with time zone`? | `ADR-109 §1 emend. 2` | Sì (le migrazioni di Payload usano `timestamp(3) with time zone`); il selettore non normalizza `timeOnly` (`DatePicker.js:49-67`). |
| `defaultLocale` non è la lingua dell'interfaccia | `ADR-103` nota | Coerente col comportamento di Payload: l'interfaccia dipende da `i18n`. |

**Sicurezza, domanda 4 (letture REST anonime con `depth`) [V]**

- Il popolamento delle relazioni **rispetta** l'access control del documento correlato: `relationshipPopulationPromise` passa `overrideAccess` al dataloader, che chiama `findByID` con lo stesso `overrideAccess`. Un documento correlato non leggibile viene sostituito dal suo **id** (commento nel codice: «ids are visible regardless of access controls»).
- Il default di `depth` è 2 e il massimo 10 (`config/defaults.js:47,68`). Nessun `maxDepth` nelle collection.
- La validazione delle query (`validateSearchParams.js`) controlla il permesso di lettura dei **campi** attraversati dal `where`, anche tra collection correlate. Non ho verificato se il controllo copra anche l'`access.read` di collection correlate: lo tratto come non verificato.
- Conseguenza pratica: nella forma pianificata (collection del menù, tassonomie, `pages-*`), la popolazione non apre accessi, a meno dei casi F24 (bozze) e F3 (campi senza `access.read`).

**Altro**

- `pnpm lint`: 0 errori, 8 warning (solo nelle due migrazioni) [V].
- La copia di `tracciamento-processo-adr-dag.md` nel Project è precedente a quella del repo (53 righe di differenza: numerazione dei passaggi 5-7 diversa); vince il repo.

---

## 4. Non verificato, e perché

- **Project knowledge**: non ho aperto i `riepilogo-sessione-*.md` né `punti-aperti-bucket-a-d.md` (salvo il confronto di `tracciamento-processo-adr-dag.md`). Tutti i rimandi `§N` a quei file nel repo sono non confrontati. `riepilogo-sessione-bucket-c.md` non esiste in nessuna delle due fonti (F27).
- **Documenti del repo non letti**: `fase-1-*`, `fase-2-*`, `fase-3-*`, `00-come-eseguire-il-piano.md`, `processo-v2-operativo.md`, `segnalazione-catalogo-app-public-url.md`, `ADR-template.md`, `docs/operativo/*` tranne `cloud-run-produzione.md` e `cloud-sql-produzione.md`. Il rimando a `ADR-004`/`ADR-001` di catalogo è letto solo tramite `ADR-113` e `fase-2-login.md` (quest'ultimo non letto).
- **Codice non letto**: `lib/auth/localLogin/*`, `lib/auth/localEmail/*`, `lib/auth/googleOAuth/` (tranne `pluginOptions.ts`, `userLoginChecks.ts`, `areas.ts`), `components/`, route in `app/`, `scripts/migrate-bootstrap-credentials.ts`, `migrations/*.json`. Non ho confrontato `payload-types.ts` con la config.
- **Runtime**: nessuna prova end-to-end (Postgres non installabile). Non verificati a runtime: F1, F2, F3, F24 (dedotti dal codice e dai sorgenti di Payload), `admin.hidden` per ruolo, rendering Admin di una tab vuota, convivenza di due istanze del plugin Redirects, effetto di `draft=true` con `appendVersionToQueryKey`.
- **Sorgenti Payload non letti**: copertura di `access.read` di collection correlate nella validazione delle query (sezione 3, domanda 4); sotto-campi del plugin SEO; endpoint di refresh del token.
- **`tsc` e `build`**: `tsc` solo parziale (F26); `next build` non eseguito.
- **Esterni (non raggiungibili da qui)**: `max_connections` di `db-f1-micro` (F9), IAM e CORS su GCS e Firebase, listino di Cloud Scheduler, regione del trigger Cloud Build, `RESEND_API_KEY` montato sul servizio (conferma solo dell'umano), stato Verified del dominio Resend.
- **Contenuto dello snapshot JSON dell'import (6.8)**: non disponibile; i conteggi (44 piatti, 90 vini, …) sono quelli dichiarati in ADR-108.
