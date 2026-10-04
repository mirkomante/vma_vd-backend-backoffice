# Verifica delle modifiche dopo l'audit — `vma_vd-backend-backoffice`

- **Repository**: https://github.com/mirkomante/vma_vd-backend-backoffice, ramo `main`
- **SHA di HEAD verificato**: `1da6802d29fcd922325faa5b9f457a1368a2a14b` (coincide con quello atteso)
- **Intervallo controllato**: `bb95fda..1da6802` (6ac96bf, 299b2c4, f9d8544, bc3c9d8, 9af3fb4, 1da6802)
- **Data**: 2026-10-04
- **Modalità**: sola lettura. Clone fresco e copie di lavoro con `pnpm install --frozen-lockfile --ignore-scripts`. Nessuna modifica al repo, nessun commit.
- **Il codice non è cambiato** [V]: `git diff bb95fda HEAD --name-only` elenca solo file in `docs/`. `payload.config.ts:45` ha ancora `pool` senza `max`; `lib/auth/userAccess.ts` è identico. Quindi niente di ciò che segue è «risolto nel codice»: i rilievi sul codice sono istruzioni per Cursor.
- **Legenda delle evidenze**: **[L]** letto nel repo a HEAD · **[V]** verificato eseguendo o leggendo i sorgenti di Payload 3.89.0, dei plugin o del template di catalogo · **[D]** dedotto.
- **Stati**: RISOLTO (correzione documentale applicata) · ISTRUZIONE PER CURSOR (passi, prove e checklist in una fase) · TRACCIATO (decisione o responsabile esterno) · NON RISOLTO.
- **Non rifatti**: YAML valido (rieseguito `yaml.safe_load`: ok) e 48 archi senza cicli. Ho solo riprodotto il conteggio: 48 archi, nessun id duplicato, nessun arco verso nodi inesistenti.

**Esito in breve**: nessun rilievo dell'audit è NON RISOLTO. 11 sono RISOLTI (F7 anche come istruzione), 10 sono ISTRUZIONE PER CURSOR, 6 sono TRACCIATI. Condivido tutte le deviazioni dal mio testo, con una riserva su F1 e un completamento su F5 e F12. Ho trovato **un difetto nelle istruzioni di §7.0** (la prova di F2 non è eseguibile come scritta) e **una verifica del lockfile che fa fermare Cursor a torto** (N1, N2). Nessun rilievo è bloccante per Cursor in senso stretto, ma N1 e N2 vanno corretti prima di eseguire la 7.0. Nel CHANGELOG non ci sono più voci su correzioni di codice non fatte.

---

## 1. Stato dei 27 rilievi

«Come proposto» indica se la mia correzione è stata applicata alla lettera, in modo diverso ma equivalente, o in modo diverso e migliore/peggiore.

| ID | Stato | Evidenza | Come proposto | Nota |
|---|---|---|---|---|
| F1 | TRACCIATO | `piano.yaml:1033` (po-10); `segnalazione-catalogo-escalation-super-admin.md`; `fase-8:80,86` | Diverso: non corretto nel progetto | Vedi §2 (F1) e N13. Il difetto resta nel codice in produzione (`userAccess.ts:73-82`) fino alla 8.3. |
| F2 | ISTRUZIONE PER CURSOR | `fase-7:50-56` (§7.0 passo 1), `:71`; `fase-7:203,211-212`; `fase-8:87`; `piano.yaml:826,834` (arco-45/46) | Diverso e migliore: corregge il codice esistente in 7.0 invece di prescrivere la regola alle sole 7.4 e 8.3 | Il test di §7.0 non è eseguibile come scritto: N1. |
| F3 | ISTRUZIONE PER CURSOR | `fase-7:201,211` | Alla lettera | Prova di non regressione presente. |
| F4 | TRACCIATO | `fase-4:196,205` | Diverso (opzione, non prescrizione) | Equivalente per effetto; la scelta resta ad ADR-111. Condivido. |
| F5 | ISTRUZIONE PER CURSOR (parziale) | `fase-4:175-176` | Diverso: contraddizione corretta, decisione lasciata aperta | La decisione è già determinata dal sorgente del plugin: N5. |
| F6 | TRACCIATO | `piano.yaml:932` (ADR-114 `da_scrivere` prima di fase-5.2); note `piano.yaml:162,178` | Diverso e migliore | La nota apre anche l'alternativa «tramite il server del sito», che io non avevo. |
| F7 | RISOLTO + ISTRUZIONE PER CURSOR | `ADR-115` (`:19-23`); `fase-6:298,327,396`; `fase-4:238,246`; `piano.yaml:810-825` | In sostanza la mia opzione A, più ADR | Coerente con `03-log-azioni.mdc` e `ActivityLog.ts` con tre note: N8, N9. |
| F8 | TRACCIATO | `ADR-107:116-122` (nota); `piano.yaml:170` | Equivalente | La checklist di 5.4 non esiste (file di Fase 5 da scrivere): la voce vive solo nella nota. |
| F9 | ISTRUZIONE PER CURSOR | `fase-7:57-59` (§7.0 passo 2) | Diverso e migliore: non scrive valori ignoti | Ho aggiunto un dato: N4. |
| F10 | ISTRUZIONE PER CURSOR | `fase-7:60-64` | Alla lettera, con la scelta di non eliminare le route | Verifica del lockfile da riformulare: N2; prova del 404 da precisare: N3. |
| F11 | RISOLTO | `piano.yaml:635-637` | Alla lettera | |
| F12 | RISOLTO | `fase-6:272` | Diverso | Condivido con un completamento: N11. |
| F13 | ISTRUZIONE PER CURSOR | `fase-6:252`; `piano.yaml:166` (voce per 5.3) | Alla lettera | |
| F14 | RISOLTO | `ADR-107:116-122`; `fase-7:118` | Equivalente | |
| F15 | RISOLTO | `fase-4:27` | Alla lettera | |
| F16 | RISOLTO | `ADR-102:47-49` | Alla lettera | |
| F17 | ISTRUZIONE PER CURSOR | `fase-4:164,172` | Equivalente | Segnala giustamente che i sotto-campi diversi da `title`/`description` sono da verificare. |
| F18 | ISTRUZIONE PER CURSOR | `fase-7:147,153` (checklist 7.2) | Alla lettera | |
| F19 | RISOLTO | `ADR-105:73-75`; `fase-6:68-69,84,308,415-416` | Opzione 1 (due secret) | Condivido. |
| F20 | TRACCIATO | `piano.yaml:166,178,932` | Equivalente | Transazione, blocco per slot e prova di concorrenza sono nelle note e in ADR-114. |
| F21 | RISOLTO (parziale) | `piano.yaml:111`; `fase-8:158`; `00-piano-generale.md` (righe tolte); `ADR-108:7` lasciato | Equivalente; ADR-108 deviazione condivisa | Restano due residui: N7, N12. |
| F22 | RISOLTO | `piano.yaml:794-809` (arco-41/42) | Alla lettera | |
| F23 | RISOLTO | `ADR-109` e `ADR-113` (note in coda) | Alla lettera | |
| F24 | ISTRUZIONE PER CURSOR | `fase-4:140,145` | Alla lettera | Helper non definito e prova da estendere: N15. |
| F25 | RISOLTO | `fase-6:11,94`; `piano.yaml:187` | Alla lettera | Manca l'arco 8.3 → 6.1: N10. |
| F26 | ISTRUZIONE PER CURSOR | `fase-7:65` | Alla lettera | Verificato: funziona (vedi §3). |
| F27 | TRACCIATO | `tracciamento-processo-adr-dag.md:129` | Equivalente | Nessun responsabile né data: è dell'umano. |

---

## 2. Scelte che si discostano dal mio testo

**F12 — `specialOnly` non creato in 6.2. Condivido, con un completamento.** [L] `special-days` stesso nasce in 6.3 (`fase-6:262`), dopo la chiusura di 6.2: il congelamento non può quindi vietare le aggiunte, solo ridenominazioni e rimozioni, come dice il principio 1 (`fase-6:41`). La frase nuova (`fase-6:272`) è coerente. Mancano però due cose nella 6.3: N11.

**F4 — vincolo annotato, scelta ad ADR-111. Condivido.** [L] `fase-4:196` riporta tutti i fatti (nessun `useAPIKey` su `users`, creazione rifiutata senza ruoli, la strategia API-key non controlla `active` né i ruoli) e `fase-4:205` impone la decisione prima di chiudere 4.3 Parte A. L'opzione `api-clients` è una proposta, non una prescrizione: è meno rischiosa della mia formulazione.

**F5 — contraddizione corretta, scelta aperta. Condivido la correzione, non l'apertura.** [L] `fase-4:175` ora dice lettura pubblica e scrittura ai soli admin tramite `overrides.access`, coerente con quanto il plugin fa (`read: ()=>true`, il resto al default). [V] Nel sorgente del plugin (`plugin-redirects/dist/index.js`) il campo `from` ha `unique: true` e `to.reference` ha `relationTo: pluginConfig.collections`. Questo decide la scelta: N5.

**F21 — intestazione di ADR-108 (riga 7) lasciata. Condivido.** [L] L'ADR è `accettata` e il terzo emendamento dichiara di sostituire il §6 (`ADR-108:236-253`): l'intestazione descrive l'arco originale. Ritoccarla riscriverebbe una decisione accettata. Il rischio che qualcuno crei una collection «Birra» leggendo solo la riga 7 è basso e mitigato dall'emendamento in coda e da `fase-6:24`.

**F1 — segnalazione al template. Condivido la sede, non l'attesa.** Vedi sotto.

- **Accuratezza della segnalazione** [V]. Ho clonato `cursor-payload-template` (HEAD `461f54e`, 2026-09-20). `ADR-004-permessi-crud-utenti.md:16` dice che in `create` un admin non assegna `super-admin`; `:17` dice per `update` solo «ogni utente può modificare il proprio record; un record con `adminRole: super-admin` è modificabile solo da un attore super-admin». La diagnosi della segnalazione è quindi esatta: la restrizione sul valore in ingresso c'è solo per `create`. Anche la matrice di `fase-2-login.md:75-76` del progetto lo conferma (riga `update`, colonna admin: «sì»). Le citazioni di codice del progetto sono giuste (`userAccess.ts:66,73-82`); l'intervallo `Users.ts:186-230` per `beforeValidate` è corto (l'hook arriva a `:279`), un dettaglio.
- **Completezza per chi la riceve: manca un pezzo.** `ADR-004:17` dice che **ogni utente** può modificare il proprio record. Letta alla lettera nel template, questa riga permette a qualunque utente di cambiarsi `adminRole` da solo (nel progetto non avviene perché `usersUpdateAccess` richiede già uno staff admin). La segnalazione copre solo l'aggiramento da parte di un admin. Aggiungere alla «Causa radice»: «5. Nel template `ADR-004` riga `update` consente a ogni utente di modificare il proprio record senza escludere i campi di ruolo (`adminRole`, `appRole`, `active`, `loginMethod`): in un progetto che implementi la riga alla lettera ogni utente può promuoversi. Il controllo sul valore in ingresso dei campi di ruolo va previsto per tutti gli attori, non solo per l'admin.» E alla checklist: «`ADR-004` riga `update`: nessun attore, nemmeno su sé stesso, imposta `adminRole`, `appRole`, `active` o `loginMethod` oltre ciò che la matrice gli concede.»
- **Il frammento di codice proposto è corretto per il caso descritto** [L][D]: copre `PATCH` singolo e in blocco (l'hook gira anche quando `access.update` non riceve `data`); gli script con `overrideAccess` non hanno `req.user`. Non l'ho eseguito.
- **Non dice chi la invia.** `piano.yaml:1033` (po-10) e il CHANGELOG parlano di «segnalato al catalogo il 2026-10-04» (`fase-8:80`), ma il file è nel repo del progetto e nulla indica che sia arrivato al repo del template (`ADR-115` dice invece di un'altra segnalazione «non inviata»). Va detto quale delle due cose è vera.
- **Sul rinvio fino alla 8.3** (N13): l'esposizione dura per tutta la 7.0, 7.1–7.4 e 8.1, cioè mesi di lavoro. Il difetto richiede un account `admin` già esistente e ostile o compromesso, quindi la gravità reale è moderata. Il progetto rinvia legittimamente (correzione nel pattern, non nel progetto), ma il rinvio non ha né una misura provvisoria tracciata né un responsabile. Preferirei applicare il controllo in 7.0 (sono 12 righe in `collections/Users.ts` e una prova), in parallelo alla segnalazione; se si resta con po-10, la misura provvisoria dev'essere in `piano.yaml`, non solo nel testo della segnalazione.

**F7 — ADR-115. Coerente, con tre note.** [L]
- Con `03-log-azioni.mdc`: la regola riserva a Cloud Logging i log tecnici (`:10`), prevede `eventType` come enum aperto che include «eventuali altri eventi applicativi del progetto» (`:29`) e lascia fuori gli endpoint che non passano da un'operazione di collection, da documentare a parte (`:20`): ADR-115 fa esattamente questo (`ADR-115:7`, `:23`). `detail` è un campo generico che la regola sconsiglia «finché non li richiede un evento realmente progettato» (`:34`), ma qui ci sono quattro eventi progettati: ammesso, con la nota N9.
- Con `ActivityLog.ts`: `user` è oggi `required: true` (`:32-40`), `eventType` usa `ACTIVITY_LOG_EVENT_TYPES` da `constants.ts`, `collection` e `documentId` hanno `condition` solo su `create/update/delete` (`:69-85`): ADR-115 li prevede tutti (punti 1-4) e la 6.4 li ripete in un solo passo (`fase-6:298`). L'`access` della collection non cambia (`create: () => false`; la scrittura passa da `overrideAccess: true`), come dice il punto 5.
- La migrazione attesa (rimozione di NOT NULL, aggiunta valore enum e colonna) è dichiarata non verificata (`ADR-115:34`): resta tale. Non ho potuto generarla (nessun database).

**F19 — due secret per scopo. Condivido** [L]. Nomi coerenti in `ADR-105:73-75`, `fase-6:68-69,84,308,415-416` e `piano.yaml:192` (nota di 6.0). Nessun riferimento superstite al vecchio `SCHEDULER_SECRET`/`scheduler-shared-secret` nei file correnti (i soli «secret condiviso» rimasti sono nomi storici in `ADR-105:62`, nel CHANGELOG e in `piano.yaml`, po-04, e nella riga `fase-6:296`).

---

## 3. Qualità delle istruzioni per Cursor

### 3.1 `fase-7-impostazioni-sistema.md` §7.0

**Affermazioni su Payload 3.89.0 e sul tooling, verificate sul clone di HEAD:**

| Affermazione di §7.0 | Esito | Evidenza |
|---|---|---|
| `graphQL.disable` → 404 | **Corretta per `POST /api/graphql`** | [V] `@payloadcms/next/dist/routes/graphql/handler.js:88-92`: `if (payload.config.graphQL?.disable) return new Response(null, {status: 404})`. Il playground ha una logica diversa: vedi N3. |
| Con `graphql ^16.8.1` il lockfile cambia solo per `graphql` (17.0.2 → 16.14.2) | **Vera nelle versioni, fuorviante nel testo** | [V] Ho riprodotto la modifica: la versione cambia solo per `graphql`; il diff testuale è di 44 righe aggiunte e 44 tolte, perché ogni chiave di `payload`, `@payloadcms/*` e `payload-oauth2` porta il suffisso `(graphql@…)`. Vedi N2. |
| `pnpm peers check` pulito | **Corretta, e prova il difetto** | [V] Dopo: «No peer dependency issues found». Su `package.json` e lockfile di HEAD (`graphql 17.0.2`): `✕ unmet peer graphql … Wanted ^16.8.1` per `@payloadcms/next`, `@payloadcms/graphql`, `payload`, e `graphql-scalars`. Quindi la prova copre il difetto. |
| `next typegen` e `tsc --noEmit` senza errori su clone pulito | **Corretta** | [V] `next typegen` genera i tipi; `tsc --noEmit` esce senza errori; `git status` dopo non mostra file non ignorati. Lo script `typecheck` di §7.0 passo 4 funziona. |
| `pnpm lint`: 0 errori e 8 avvisi | **Corretta** | [V] Misurato a `bb95fda`; il codice è identico a HEAD. |
| `pool: { connectionString, max: 3 }` è un'opzione valida | **Corretta** | [V] `@payloadcms/db-postgres/dist/types.d.ts:47`: `pool: PoolConfig`. |
| `pnpm build` riuscito | **Non verificata** | Dipende dai font di Google, bloccati nel sandbox. |
| Utente disattivato con cookie valido: 403 su `/api/users`, `/api/activity-log`, `/api/globals/settings` | **Esito 403 corretto; procedura non eseguibile come scritta** | [V] `executeAccess.js` lancia `Forbidden` quando l'`access` restituisce `false` e `disableErrors` non è impostato; il gestore REST dei Global non lo imposta. Per ottenere l'utente di prova: N1. |
| Cookie valido fino a 7200 s | **Corretta** | [V] `collections/config/defaults.js:127,141`; `Users.ts` non imposta `tokenExpiration`. Le strategie JWT ricaricano l'utente senza controllare `active` (`isolatedJwtAuthStrategies.ts:106-135`). |

**Ordine dei passi.** Giusto: F2, F9, F10, F26, poi verifiche e un solo commit. L'`install` di F10 precede `typecheck`/`build`, come serve. Un ritocco: scrivere lo script `typecheck` per primo permetterebbe a Cursor di usarlo anche dopo F2, ma non cambia il risultato.

**Prove che coprono il difetto.** F2: sì, a patto di N1. F9: nessuna prova a runtime (ragionevole, il valore si legge in config; la sezione di `cloud-run-produzione.md` è una verifica per l'umano). F10: sì (`peers check` prima e dopo; 404). F26: sì (clone pulito).

**Completezza.** Fermarsi su esito diverso è prescritto (`fase-7:46`). La voce Tests del CHANGELOG è «solo per ciò che è stato eseguito» (checklist 7.0): giusto per `core/04-changelog-commit.mdc`.

### 3.2 Checklist che l'audit richiedeva

| Sottofase | Prova richiesta | Presente | Note |
|---|---|---|---|
| 4.1 | F24: `?draft=true` anonimo non restituisce bozze | Sì (`fase-4:145`) | Solo l'elenco: N15. |
| 4.2 | F5 permessi dei Redirects; F17 SEO `localized` | Sì (`:171-176`) | Scelta una/due collection aperta: N5. |
| 4.3 | F4 meccanismo del token | Sì (`:205`) | Decisione, non prova: coerente con F4. |
| 4.4 | F7 esito come `systemAction` | Sì (`:246`) | |
| 6.4 | F7 migrazione e voci; F19 | Sì (`fase-6:298,327`) | Il «secret nell'intestazione» (`:324`) potrebbe nominare `SCHEDULER_SECRET_AVAILABILITY`. Rifiuto di un secret errato è tra le verifiche tecniche (`:315`). |
| 6.5 | F7 avvio rebuild registrato | Sì (`:396`) | |
| 7.2 | F18 helper unico delle date | Sì (`fase-7:153`) | |
| 7.4 | F2, F3 | Sì (`:211-212`) | Il testo di §7.4 (`:203`) descrive F2 come ancora da fare: N6. |
| 8.3 | F1, F2 | Sì (`fase-8:86-87`) | Il codice del controllo F1 sta nella segnalazione, non in 8.3: N13. |

---

## 4. Nuovi rilievi

Gravità: **B** = bloccante per Cursor · **P** = da correggere prima della fase interessata · **A** = da annotare.

| ID | Gr. | Dove | Evidenza | Correzione proposta (testo esatto) |
|---|---|---|---|---|
| N1 | **P (prima della 7.0)** | `fase-7:71` | [L][V] Il test chiede «un utente con `active: false` e cookie ancora valido» senza dire come averlo. Un utente solo App è già escluso (`adminRole: none`) e non prova nulla; un admin è SSO (Google); il super-admin di bootstrap non si può disattivare se è l'ultimo locale (`lastLocalSuperAdmin.ts`, `assertNotLastLocalSuperAdmin`). | Sostituire la riga con: «- **Prova a runtime in sviluppo** (Postgres locale). L'utente di prova deve avere `adminRole` `admin` o `super-admin`: un utente solo App è già escluso e non prova nulla. (1) `pnpm seed:super-admin` con un'email diversa da quella del bootstrap, così esiste un secondo super-admin locale (il guardrail dell'ultimo super-admin locale non blocca la disattivazione finché ne resta un altro). (2) Accedere con il secondo su `/admin/login/local` e copiare il cookie `payload-token`. (3) Dal primo super-admin, nell'Admin, disattivare il secondo (`active` falso). (4) Con il cookie del punto 2: `GET /api/users`, `GET /api/activity-log` e `GET /api/globals/settings` rispondono 403. (5) Con la sessione del primo super-admin gli stessi tre rispondono 200. (6) Eliminare l'utente di prova.» |
| N2 | **P (prima della 7.0)** | `fase-7:62` | [V] «`git diff pnpm-lock.yaml` deve mostrare modifiche solo per `graphql`: se cambiano altri pacchetti, fermarsi». Il diff reale ha 88 righe cambiate e nomina `payload`, `@payloadcms/*`, `payload-oauth2` (suffissi `(graphql@…)` nelle chiavi). Cursor vedrebbe «altri pacchetti» e si fermerebbe a torto. Normalizzando `graphql@17.0.2` e `graphql@16.14.2` nello stesso token, restano solo le righe di `graphql` (`specifier`, `version`, `resolution`, `engines`, e `graphql: <versione>` nei pacchetti che lo dichiarano). | Sostituire con: «`pnpm-lock.yaml` cambia solo per `graphql`: la versione risolta passa da 17.0.2 a 16.x e le chiavi di `payload`, `@payloadcms/*` e `payload-oauth2` cambiano soltanto nel suffisso `(graphql@…)`. Controllo: sostituire `graphql@<versione>` con `graphql@X` nei due lockfile (vecchio e nuovo) e confrontarli con `diff`; devono restare solo `specifier`, `version`, `resolution`, `engines` di `graphql` e le righe `graphql: <versione>` dei pacchetti che lo dichiarano. Se compare un altro pacchetto con una versione diversa, **fermarsi**. La 16.x risolta può essere più recente di 16.14.2.» |
| N3 | A | `fase-7:61-64,72` | [V] `/api/graphql` espone solo `POST` e `OPTIONS` (`route.ts`): una `GET` risponde 405 prima e dopo, quindi «risponde 404» non prova nulla. `@payloadcms/next/dist/routes/graphql/playground.js:9`: con `NODE_ENV` diverso da `production` il playground risponde 200 anche con `graphQL.disable`; in produzione risponde 404 (il default di `disablePlaygroundInProduction` è `true`, `config/defaults.js:52,127`). | Sostituire «`/api/graphql` risponde 404» con: «`curl -i -X POST http://localhost:3000/api/graphql -H 'Content-Type: application/json' -d '{"query":"{__typename}"}'` risponde 404 (prima della modifica la risposta non è 404). Una `GET` risponde 405 in ogni caso. `/api/graphql-playground` resta raggiungibile in sviluppo anche con `disable`; in produzione risponde 404.» E in `:64`: «con la disattivazione `POST /api/graphql` risponde 404» (non «l'endpoint»). |
| N4 | A | `fase-7:58` | [L] La sezione da scrivere dice di non scrivere `max_connections` né `--max-instances` perché ignoti. Fonte secondaria (doc.nais.io, non Google): «l'istanza più piccola ha 25 connessioni». Con 3 connessioni per istanza, oltre 8 istanze superano 25. Non verificato sulla documentazione ufficiale di Cloud SQL. | Aggiungere alla sezione «Connessioni al database»: «Da verificare sulla documentazione di Cloud SQL: una fonte secondaria indica 25 connessioni di default per l'istanza più piccola (`db-f1-micro`); con 3 connessioni per istanza, `--max-instances` non può superare 8 meno lo spazio per `scripts/prod-db.sh` e le migrazioni da locale.» |
| N5 | **P (4.2)** | `fase-4:176` | [V] `plugin-redirects/dist/index.js`: `from` ha `unique: true`; `to.reference` ha `relationTo: pluginConfig.collections`; ogni istanza aggiunge una collection con `overrides.slug`. Con una collection sola i due siti non possono avere lo stesso `from` (per esempio `/privacy`) e `to` può puntare a pagine dell'altro sito. | Sostituire la riga con: «- [ ] Decisione annotata: **due istanze del plugin, una per sito** (`overrides.slug` distinti, `collections` distinte: `pages-vma` e `pages-villadoree`). Motivo: il campo `from` del plugin è `unique` nella collection e `to` è una relazione a collection di pagine: con una collection sola i due siti non potrebbero avere lo stesso percorso sorgente e un redirect potrebbe puntare a pagine dell'altro sito. Verificare a runtime che le due istanze convivano.» |
| N6 | A | `fase-8:81`; `fase-7:203` | [L] `fase-8:81`: «`isStaffAdminRequest` e `isSuperAdminRequest` oggi non controllano `active` (regola e prova in `fase-7` §7.4)». Dopo la 7.0 non è più vero, e la regola è in §7.0, non in §7.4. `fase-7:203` descrive l'helper come da fare. | `fase-8:81`: «10. **Utenti disattivati**: la regola è già applicata dagli helper (`isActiveUser`, `fase-7` §7.0); `canAccessSection` la usa e la prova di chiusura la verifica.» `fase-7:203`, in apertura: «Già implementata in 7.0 (`isActiveUser`); qui si applica alle nuove funzioni `access` e si prova sul Global.» |
| N7 | A | `00-piano-generale.md:103,41-45`; `CHANGELOG.md` (voce «da archiviare in `docs/audit/`») | [L] «Punti aperti: nessuno» è falso con `po-10` aperto (`piano.yaml:1033`). L'«Ordine di esecuzione corrente» non cita la 7.0 (`piano.yaml:44` sì). Una voce di CHANGELOG dice ancora «da archiviare», mentre una voce successiva dice «archiviato». | `00-piano-generale.md:103`: sostituire «Punti aperti: nessuno (…)» con «Punto aperto: `po-10` (F1, escalation a super-admin; scadenza prima della 8.3)». Dopo la riga 41: «**Fase 7.0** — manutenzione dopo l'audit (F2, F9, F10, F26), prima della 7.1». CHANGELOG: togliere «(da archiviare in `docs/audit/`)». |
| N8 | A | `ADR-115:7`; `piano.yaml:810-825`; `piano.yaml:15-17` | [L] `ADR-115:7`: «Nessun arco nuovo in `piano.yaml`», ma `piano.yaml` aggiunge `arco-43` e `arco-44` e `adr_da_scrivere` li elenca per ADR-115. Inoltre i due archi sono `tipo: output` con `adr` valorizzato, mentre l'intestazione del file dice che l'`adr` serve agli archi `decisione` e che «un arco output non lo richiede (adr: null)». | `ADR-115:7`: sostituire «Nessun arco nuovo in `piano.yaml`: la decisione tocca quattro sottofasi.» con «`piano.yaml`: `arco-43` (6.4 → 4.4) e `arco-44` (6.4 → 5.3); la 6.5 dipende già dalla 6.4 (`arco-18`).» `piano.yaml:810-825`: `tipo: decisione` per arco-43 e arco-44. |
| N9 | A | `ADR-115:19,21`; `Users.ts:284-293`; `initial_schema.ts` | [L] Con `user` facoltativo la FK `ON DELETE SET NULL` di `activity_log.user_id` (già nella migrazione iniziale) torna compatibile; l'hook `purgeActivityLogForUserBeforeDelete` (introdotto per il NOT NULL) diventa ridondante, ma ADR-115 non dice se resta. Inoltre `detail` è testo libero: con esempi come `availability-reset: ok` il filtro per azione dipende dal formato. | Aggiungere a ADR-115 Decisione: «8. `users.beforeDelete` e `purgeActivityLogForUserBeforeDelete` restano invariati: la cancellazione di un utente elimina le sue voci; le voci di sistema (`user` vuoto) non sono toccate. 9. `detail` comincia con una chiave di azione da un elenco chiuso (`availability-reset`, `availability-write`, `rebuild-started`, `revalidation`, `anonymization`), seguita da esito e dettagli.» |
| N10 | **P (6.1)** | `fase-6:94`; `piano.yaml` (archi) | [L] 6.1 dichiara «Dipende da: Fase 7 e Fase 8.3», ma non c'è un arco 8.3 → 6.1 (esistono 7.2 → 6.1 e 8 → 6.6). | Aggiungere a `piano.yaml`: `- id: arco-47` / `da: fase-8.3` / `a: fase-6.1` / `tipo: output` / `descrizione: "Valore manager di adminRole e admin.hidden (8.3): le tassonomie e il Global Generali nascono con i permessi di ADR-113."` / `adr: null` / `fonte: "fase-6-menu-digitale.md §6.1 (Dipende da)"`. |
| N11 | A | `fase-6:272,283-286` (checklist 6.3) | [L] La 6.3 aggiunge dopo il congelamento `special-days` e `specialOnly` (`fixed-menus`), ma né la checklist né il contratto lo riportano; ADR-112 §1 dice che i menu fissi sono letti in pubblico, quindi il frontend deve sapere di escludere `specialOnly` dalle pagine normali. | Aggiungere alla checklist di 6.3: «- [ ] `special-days` e `specialOnly` riportati nel CHANGELOG come aggiunta al contratto di 6.2, con una nota di chiarimento ad `ADR-112` (i menu fissi con `specialOnly` vero non compaiono nelle pagine normali del menù).» |
| N12 | A | `tracciamento-processo-adr-dag.md:130`; `piano.yaml` (nodi) | [L] `:130` dice «sottofasi 6.1–6.7», ma la fase ha 6.0–6.8. [V] Con la definizione «nodo senza alcun arco» restano 8 nodi: `fase-4`, `4.6`, `5.2`, `6.3`, `7`, `7.1`, `8.1`, `8.4`: gli stessi 8 a `bb95fda`, quindi non è una regressione, ma «né orfani» vale solo con un'altra definizione (nodi con relazioni dichiarate nei file di fase ma non nel DAG: per esempio 8.1 → 8.3 in `fase-8:65`, 6.3 dipende da 6.2 in `fase-6:260`). | `tracciamento…:130`: «(sottofasi 6.0–6.8)». Nell'intestazione di `piano.yaml` (convenzioni): «Gli archi modellano output e decisioni tra fasi; gli ordini interni a una fase sono nei file di fase.» |
| N13 | A | `piano.yaml:1033-1038` (po-10); `fase-8:80,86`; `segnalazione…:63-70` | [L] po-10 non ha responsabile né misura provvisoria; la misura («non assegnare `adminRole: admin` a nuovi utenti e controllare chi lo ha oggi») sta solo nella segnalazione. L'8.3 rimanda al «controllo in `beforeValidate`» ma il testo è nella segnalazione. | Aggiungere a po-10: `responsabile: "umano (invio al template e verifica degli admin attuali)"` e alla `registrazione`: «Misura provvisoria: elenco degli utenti con `adminRole: admin` verificato dall'umano; nessuna nuova assegnazione di `admin` fino alla correzione.» In `fase-8:80`: «Il controllo da applicare è nella segnalazione, § «Fix proposto».» |
| N14 | A | `segnalazione-catalogo-escalation-super-admin.md` | [V] Vedi §2 (F1): manca la causa 5 (self-update in `ADR-004:17`). | Testo in §2 (F1). |
| N15 | A | `fase-4:140,145` | [L] `isManagerOrStaff` non è definita in nessun file; la prova copre solo l'elenco. [D] Lo stesso `draft=true` vale per `GET /api/pages-*/:id` e per i Global con `versions.drafts`. | `fase-4:140`: dopo «…dove `isManagerOrStaff`…» aggiungere «(nuova funzione in `lib/auth/userAccess.ts`, costruita su `isActiveUser` di 7.0)». Checklist: aggiungere «e `GET /api/pages-vma/:id?draft=true`, `GET /api/globals/impostazioni-vma?draft=true`». |

Nessun altro rilievo: non ho trovato riferimenti rotti a file, `arco-NN`, `po-NN` o nodi `fase-N.M` introdotti dalle modifiche. Gli unici rimandi a sottofasi non presenti come nodi (`fase-2.10`, `fase-3.3`, `fase-3.4`) riguardano le sottofasi dei file di catalogo, già presenti prima e non nodi di `piano.yaml`.

### Controllo del CHANGELOG (punto 4)

[L] Le cinque voci su F2, F9, F10 e F26 non ci sono più: la ricerca di `F2`, `F9`, `F10`, `F26`, `typecheck`, `pool`, `graphQL`, `isActiveUser` e `max: 3` dà solo la voce che registra la 7.0 «da eseguire» (`CHANGELOG:61`) e quella che dichiara la rimozione (`:69`). Nessuna voce dichiara codice cambiato. Due imprecisioni minori: la voce `:61` dice che la 7.0 è registrata in `00-piano-generale.md`, dove compare solo nel «Prossimo passo» (N7); la voce `:62` non cita F24 tra le prove portate in 4.1.

---

## 5. Ciò che resta aperto per natura, e di chi è

| Voce | Di chi | Nota |
|---|---|---|
| F1 / po-10: correzione nel template e nel progetto | Umano (invio e verifica admin); Cursor in 7.0 o in 8.3 | Vedi N13 e §2. |
| F27: `riepilogo-sessione-bucket-c.md` assente | Umano | Da caricare nel Project, se esiste. Citato in 23 punti. |
| Prove a runtime (tutto ciò che il codice non ancora fa) | Cursor | 7.0 (F2, F10), 4.1 (F24), 4.2 (F5), 7.4 (F2, F3), 8.3 (F1, F2), migrazione di ADR-115 in 6.4. |
| ADR-111 (contratto con i siti, F4) | Pianificatore, in 4.3 Parte A | Decide il token delle bozze. |
| ADR-114 (CORS e abuso del form, F6, F20) | Pianificatore, prima di 5.2 | |
| Voci per il file di Fase 5 | Pianificatore | `piano.yaml:162,166,170,178`: F6, F8, F13, F14, F20. |
| Valori di F9 | Umano | `max_connections` dell'istanza e `--max-instances` attuale (N4). |

---

## 6. Non verificato, e perché

- **Runtime**: nessun database nel sandbox. Le prove che richiedono Postgres (F1, F2, F3, F24, la migrazione di ADR-115) restano dedotte dal codice e dai sorgenti di Payload.
- **`pnpm build`**: non eseguito (font di Google non raggiungibili). L'affermazione di §7.0 sul build riuscito è del pianificatore.
- **`pnpm lint`** a HEAD: non rieseguito. Il codice è identico a `bb95fda`, dove ha dato 0 errori e 8 avvisi.
- **ADR-115**: la migrazione che Payload genera per rendere `user` facoltativo (dichiarata non verificata dall'ADR); il comportamento di `purgeActivityLogForUserBeforeDelete` (file non letto: lo cito da `Users.ts:14,291`).
- **Plugin Redirects con due istanze**: letto nel codice, non eseguito. **`access.read` con `_status` su `draft=true`**: dedotto da `find.js`, non eseguito; `findByID` e i Global con bozze non letti (N15).
- **Cloud SQL `max_connections` di `db-f1-micro`**: solo una fonte secondaria (doc.nais.io); la documentazione ufficiale non è stata letta.
- **Segnalazione F1**: verificata contro `cursor-payload-template` a `461f54e` (2026-09-20), non contro eventuali commit successivi; non so se la segnalazione sia stata inviata.
- **Parti non rilette**: `fase-1`, `fase-2`, `fase-3` (salvo `fase-2-login.md:65-77`), `docs/operativo/*`, `00-come-eseguire-il-piano.md`; non toccati dall'intervallo.
- **Riepiloghi nel Project** e `riepilogo-sessione-bucket-c.md`: non aperti; i rimandi `§N` restano non confrontati.
