# Terza verifica — le correzioni N1–N15 sono recepite e il piano è pronto per Cursor?

- **Repository**: https://github.com/mirkomante/vma_vd-backend-backoffice, ramo `main`
- **SHA di HEAD verificato**: `24710597e0a31829f6789a49c8fcc65a659e46b3` (coincide con quello atteso)
- **Commit controllato**: `2471059` «applica le correzioni della verifica post-audit (N1-N15)» (`git diff 1da6802 HEAD -- docs/piano-sviluppo`)
- **Data**: 2026-10-04
- **Modalità**: sola lettura sul repo. Le esecuzioni sono state fatte in copie di lavoro (`/home/claude/v3w`, `/home/claude/v3p`), con PostgreSQL 16 locale e Node 22. Nessuna modifica al repo, nessun commit.
- **Il codice non è cambiato** [V]: `git diff 1da6802 HEAD --name-only` elenca solo file in `docs/`.
- **Legenda**: **[L]** letto nel repo a HEAD · **[E]** eseguito nel mio sandbox · **[V]** verificato sui sorgenti di Payload 3.89.0 o dei plugin · **[D]** dedotto.

---

## 0. Giudizio

**Cursor può partire dalla 7.0: sì, con riserve.**

- Ho eseguito **tutti i passi di §7.0** su una copia di lavoro, con un database vero [E]: la correzione F2, il controllo del lockfile, il `curl` del 404, `pool.max`, lo script `typecheck`. Tutto funziona come è scritto, **a una condizione che il testo non dice**: nel `.env` di sviluppo devono esserci `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`. Senza, nessun cookie di login locale autentica nessuno e la prova dell'utente disattivato sembra riuscita senza provare nulla (M1). Nel `.env` reale di Mirko ci sono (Fase 2.3), ma Cursor non può saperlo.
- Le riserve sulla 7.0 sono correzioni di testo (M1, M2, M13) e **un'azione umana su F1** (sotto): nessuna blocca l'avvio.
- **La 8.3 è NON PRONTA** (M3): ADR-113 §3 dice che admin e super-admin accedono all'App senza `appRole`, ma i controlli di login dell'App (`lib/auth/userAccess.ts:26`, `userLoginChecks.ts:27`, `appLoginChecks.ts:19`) guardano solo `appRole`. Il testo della 8.3 non lo copre e la sua checklist non lo rileverebbe. È lontana dalla 7.0 nell'ordine di esecuzione, quindi non ferma la partenza.
- **F1 (N13) è accettabile con condizioni**, e ora è un difetto **riprodotto** e non più solo dedotto [E]: con un cookie di sessione valido, un utente `adminRole: admin` ha promosso sé stesso a `super-admin` con `PATCH /api/users/<id>` (HTTP 200, il database mostra `super-admin`). Il cookie l'ho firmato io con il secret del mio `.env` di prova (un admin vero lo ottiene con Google SSO): la prova dimostra l'assenza di controlli lato server, non un percorso di attacco senza credenziali. Condizioni in §3 (N13).

---

## 1. N1–N15

Esito: **13 recepiti come proposti, 1 in modo diverso (N4, equivalente), 1 non applicato per scelta (N13, tracciato)**.

| ID | Stato | Evidenza | Nota |
|---|---|---|---|
| N1 | RECEPITO COME PROPOSTO | `fase-7:71` | Procedura eseguita [E]: funziona con prerequisiti non scritti e un ordine migliorabile. Vedi §4 e M1. Il testo dice ancora «per quanto si deduce dal codice, rispondevano 200»: ora è verificato (M2). |
| N2 | RECEPITO COME PROPOSTO | `fase-7:62`, `:46` | Eseguito [E]: 18 righe modificate (`<`/`>`), tutte di `graphql`. Il testo dice «circa 18 righe»: l'output di `diff` ne ha 32 con le intestazioni dei blocchi (M13). |
| N3 | RECEPITO COME PROPOSTO | `fase-7:72`, `:64` | Eseguito [E]: `POST /api/graphql` risponde 200 prima e 404 dopo; `GET` 405 in entrambi i casi; playground 200 in sviluppo. |
| N4 | RECEPITO IN MODO DIVERSO | `fase-7:59` | Condivido. Vedi §3. |
| N5 | RECEPITO COME PROPOSTO | `fase-4:169`, `:176`; `piano.yaml:132` | Verificato che due istanze coesistono [V][E]: §3 (N5). |
| N6 | RECEPITO COME PROPOSTO | `fase-8:81`, `fase-7:203` | Testo corretto. |
| N7 | RECEPITO COME PROPOSTO | `00-piano-generale.md:41`, `:104`; `CHANGELOG` («archiviato») | Ordine con la 7.0 e `po-10` presenti. |
| N8 | RECEPITO COME PROPOSTO | `ADR-115:7`; `piano.yaml:812-823` | `arco-43/44` ora `decisione`; ADR-115 non dice più «nessun arco nuovo». Su §§8–9: §3. |
| N9 | RECEPITO COME PROPOSTO | `ADR-115:24-25` | Con un'osservazione sul volume di `availability-write` (M8). |
| N10 | RECEPITO COME PROPOSTO | `piano.yaml:844` (`arco-47`) | Presente e coerente con `fase-6:94`. |
| N11 | RECEPITO COME PROPOSTO | `fase-6:284` | Voce di checklist 6.3 presente. |
| N12 | RECEPITO COME PROPOSTO | `tracciamento…:130`; `piano.yaml:18` | «6.0–6.8» e convenzione sugli archi. |
| N13 | NON RECEPITO (scelta) → TRACCIATO | `piano.yaml:1043-1048`; `fase-8:80,86`; `segnalazione…:70` | Accettabile con condizioni: §3. |
| N14 | RECEPITO COME PROPOSTO | `segnalazione…:22,53` | Causa 5 e voce 4 della checklist presenti. |
| N15 | RECEPITO COME PROPOSTO | `fase-4:140,145` | `isManagerOrStaff` definita; prova estesa a `/:id` e al Global. |

Il **testo** di N1–N15 è presente per intero. Non ho trovato nessun caso di «recepito» solo nel CHANGELOG senza che il file di fase sia cambiato.

---

## 2. Le scelte che si discostano dal mio testo

Rimando a §3 per le quattro scelte che mi chiedevi di valutare (N4, N5, N13, N8). Una conferma in più su F1, prima.

**F1 riprodotto** [E]. Nella copia di lavoro: due super-admin locali (seed), un terzo utente `adminRole: admin` creato da uno dei due, un JWT firmato con il secret di prova e il claim `strategy: local-jwt`, `PATCH /api/users/3` con `{"adminRole":"super-admin"}` → **HTTP 200** e `select admin_role from users` → `super-admin`. `/api/users/me` con lo stesso cookie mostrava prima `adminRole: admin`. Questo conferma la diagnosi di `segnalazione…` e di `fase-8:80`. Non ho provato `PATCH /api/users?where=…` (in blocco).

---

## 3. Valutazione delle scelte

### N4 — nessun numero per `max_connections`. **Condivido.**

[L] `fase-7:59` dice di non scrivere numeri e di leggere `SHOW max_connections;` con `scripts/prod-db.sh`, e il `--max-instances` da `gcloud run services describe`. Ho cercato una fonte ufficiale: la documentazione di Cloud SQL (`docs.cloud.google.com/sql/docs/postgres/instance-settings`) conferma che Cloud SQL **gestisce il valore in automatico in base alla memoria**, ma nei risultati non compare il numero per `db-f1-micro`. La fonte da cui avevo ricavato 25 era secondaria (doc.nais.io) e non l'ho trovata confermata. Ritiro il numero. Il rimando a una verifica sull'istanza è la scelta giusta; il comando `SHOW max_connections;` va eseguito con l'utente applicativo e vale per l'istanza di cui si legge, non per un altro tier.

### N5 — due istanze del plugin Redirects. **Condivido, ed è verificato.**

[V] Nel sorgente di `@payloadcms/plugin-redirects` 3.89.0 il campo `from` è `unique` e `to.reference` ha `relationTo: pluginConfig.collections`. [E] Con due istanze (`overrides.slug: 'redirects-vma'` con `collections: ['pages-vma']` e `'redirects-villadoree'` con `['pages-villadoree']`, più `overrides.access` per `create/update/delete` e `redirectTypes: ['301','302']`) `buildConfig` produce le due collection, ciascuna con `relationTo` della propria collection di pagine, `read` pubblico del plugin intatto, i tre `access` sovrascritti e il campo `type`. Il comportamento a runtime con Postgres (due tabelle, due schede nell'Admin) non l'ho provato. I nomi `redirects-vma` e `redirects-villadoree` vanno bene.

### N13 — il controllo di F1 non va in 7.0. **Accettabile, con cinque condizioni.**

Ragioni per accettarlo: il difetto nasce nel pattern del template e correggerlo solo nel progetto lo lascerebbe nel catalogo per i progetti futuri; richiede un account `admin` già esistente; la correzione è già scritta (codice nella segnalazione) ed è in 8.3 come passo e come voce di checklist (`fase-8:80,86`), quindi non dipende dalla risposta del template.

Condizioni:
1. **Prima della 7.0 l'umano controlla l'elenco degli utenti con `adminRole: admin`** (`select email, admin_role from users where admin_role = 'admin'`) e conferma che sono tutti fidati. L'esposizione dura per tutta la 7.x e la 8.1–8.2: il difetto è ora riprodotto.
2. **L'invio della segnalazione ha una data.** `po-10.responsabile` c'è (`piano.yaml:1046`), ma la `scadenza` è «prima di fase-8.3», non una data di invio. Aggiungere a `registrazione`: «invio entro la fine della Fase 7».
3. **Nessun nuovo `adminRole: admin` fino alla 8.3** (già scritto in `piano.yaml:1048` e `segnalazione…:70`). Vale anche per la creazione di admin da parte di Cursor negli script o nei dati di prova.
4. **In 8.3 il controllo è incondizionato.** `fase-8:86` dice «Se la correzione è già arrivata dal template, verificarla; altrimenti si applica qui»; `:80` dice «appena arriva dal catalogo, al più tardi in questa sottofase». Rendere esplicito che l'8.3 non può chiudersi senza la prova e che il codice di riferimento è quello della segnalazione (§ «Fix proposto»). Testo esatto in M2.
5. **Nessuna 8.3 senza prova di F1 anche per `PATCH` in blocco** (già nella checklist: `fase-8:86`).

### N8 — precisazioni 8 e 9 in ADR-115. **Accettabili come correzione solo in parte.**

- La riga dell'arco (`ADR-115:7`) è una correzione di fatto: va bene in linea.
- Il punto 8 (hook di cancellazione invariato) è una **precisazione**: ho verificato che `purgeActivityLogForUserBeforeDelete` cancella per `where: { user: { equals: userId } }` [L, `purgeForUserBeforeDelete.ts`], quindi le voci di sistema con `user` vuoto non sono toccate. Corretta.
- Il punto 9 (elenco chiuso di chiavi di `detail`) è una **decisione nuova**: vincola il codice delle sottofasi 4.4, 5.3, 6.4 e 6.5. Nel progetto le modifiche a un ADR accettato sono sezioni datate («Emendamento», «Nota di chiarimento», con la riga «accettata su passaggio esplicito dell'umano»: `ADR-108:162-164,215-217,236-238`, `ADR-109:94-96`). Un punto nuovo inserito nel corpo della decisione, senza data e senza quella riga, non segue la convenzione. Non è un problema pratico (lo stesso giorno, stesso ADR, nessun consumatore ancora scritto), ma preferirei una nota separata. Testo in M8.

---

## 4. Esecuzione di §7.0 (copia di lavoro: `v3w`, Node 22, Postgres 16)

| Passo di §7.0 | Esito [E] | Note |
|---|---|---|
| Seed del primo e del secondo super-admin (`pnpm seed:super-admin` con `SEED_SUPERADMIN_EMAIL` e `…PASSWORD`) | **Funziona** | Con password conforme alla policy (`Second1234x`). Con `weak`: `Seed super-admin non riuscito: La password deve contenere almeno 8 caratteri.` (exit 1, nessun utente creato). Il seed gira con `push` attivo e crea lo schema nel database puntato da `DATABASE_URL`. |
| Login su `/admin/login/local` | **Funziona con un prerequisito** | `POST /api/users/login/local` (form `email`, `password`) → 302 a `/admin` e cookie `payload-token`. **Senza `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` nel `.env`** il cookie viene emesso ma non autentica: `GET /api/users/me` risponde `{"user":null}` e `GET /api/users`, `/api/activity-log`, `/api/globals/settings` rispondono 403 anche per un super-admin attivo. Con le variabili (valori fittizi bastano) funziona. Causa: `patchUsersAuthStrategiesPlugin` è nei `plugins` solo se `isGoogleOAuthConfigured()` (`payload.config.ts:59-61`; `lib/auth/googleOAuth/env.ts`), e registra le strategie `local-jwt`. |
| Disattivazione del secondo dal primo | **Funziona** | `PATCH /api/users/2` `{"active":false}` → 200, via REST con il cookie del bootstrap. Non provato dall'interfaccia Admin. Il guardrail dell'ultimo super-admin locale non scatta perché resta il bootstrap con credenziali. |
| Prima della correzione: utente disattivato con cookie valido | **200** su `/api/users`, `/api/activity-log`, `/api/globals/settings` | Conferma F2 a runtime. |
| F2 come scritto (`isActiveUser` e le quattro funzioni) | **403** sulle tre risorse dopo il riavvio del dev server; il super-admin attivo resta a 200 | **Senza riavvio i 200 restano**: Payload tiene in memoria le funzioni di `access` e l'hot reload non le sostituisce. Cursor deve riavviare `pnpm dev` dopo la modifica (M1). Con la correzione, `GET /api/users/me` del disattivato risponde 403. |
| Lockfile: i due `sed` e il `diff` | **18 righe modificate**, tutte di `graphql` | `specifier`, `version`, `resolution`, `engines` e 5 righe `graphql: <versione>`. Il `diff` stampa 32 righe contando le intestazioni dei blocchi. Il diff grezzo è di 88 righe (`44+/44-`). Risolve `graphql 16.14.2`. |
| `pnpm peers check` | **Prima: `✕ unmet peer graphql` (installato 17.0.2, richiesto `^16.8.1`); dopo: `No peer dependency issues found`** | Corretto, la prova copre il difetto. |
| `curl -i -X POST …/api/graphql` | **Prima 200, dopo 404**; `GET` 405 in entrambi i casi; playground 200 in sviluppo | Come scritto. Il 404 in produzione del playground l'ho letto, non provato: `playground.js:9` e il default `disablePlaygroundInProduction: true` [V]. |
| `pool: { …, max: 3 }` | Applicato senza errori | Il dev server avvia; non ho misurato il numero di connessioni. |
| `typecheck` su clone pulito | **Funziona** | Con `.next` e `next-env.d.ts` rimossi: `next typegen && tsc --noEmit` senza errori. |
| `pnpm lint` | 0 errori, 8 avvisi (nelle due migrazioni) | |
| `pnpm build` | **Non eseguito** | Font di Google non raggiungibili dal sandbox. |

**Altro eseguito per la 7.1.** [E] Un Global con quattro tab, due senza campi, genera con `payload migrate:create` una migrazione valida; con tutte le tab senza campi genera `CREATE TABLE "impostazioni_sistema"` (solo `id`, `updated_at`, `created_at`). La checklist della 7.1 («migrazione generata, committata e applicata») è quindi soddisfacibile. Il rendering Admin della scheda vuota **non** l'ho verificato (il dev server è andato in panic di Turbopack dopo i miei cambi in `migrations/`: artefatto del mio ambiente).

---

## 5. Prontezza per sottofase

Criterio: passi univoci · nessun riferimento a file o decisioni inesistenti · prove eseguibili · checklist coerente col testo · nessuna contraddizione con ADR e altre sottofasi.

| Sottofase | Verdetto | Riserve o blocchi |
|---|---|---|
| **7.0** | **PRONTA CON RISERVE** | M1 (prerequisiti e ordine della prova dell'utente disattivato); M2 (testo «si deduce» → «verificato»); M13 (conteggio righe del lockfile). Azione umana su F1 (N13, condizione 1). `pnpm build` non verificato. |
| **7.1** | **PRONTA CON RISERVE** | `fase-7:92` («Dipende da: 4.0») non cita la 7.0 (M11). Rendering Admin di una tab vuota non verificato; la migrazione sì [E]. |
| **7.2** | **PRONTA CON RISERVE** | La checklist (`fase-7:156`) chiede «Riportato nel file di fase 5 (da scrivere)»: voce non eseguibile da Cursor (M10). Il pulsante festività è un componente custom: serve rigenerare la import map (`pnpm generate:importmap`), non detto nel testo [D]. |
| **7.3** | **PRONTA** | Campi, normalizzazione, unicità per `site`, nomi congelati e migrazione sono scritti. Tra 7.3 e 7.4 il Global è ristretto ad admin (default di 7.1), quindi nessun campo è pubblico prima che 7.4 applichi `access.read` per campo. |
| **7.4** | **PRONTA CON RISERVE** | La prova di non regressione dice «solo le chiavi della tab Orari e chiusure», ma la risposta contiene anche `id`, `createdAt`, `updatedAt`, `globalType` [E] (M4). `fase-7:199` descrive il livello di Global solo per la lettura: manca l'accesso in scrittura del manager `appRole` (M5). |
| **8.1** | **PRONTA CON RISERVE** | `fase-8:49` chiede token e stile in un CSS dedicato, ma non dice come impedire che la CLI di shadcn scriva in `app/globals.css` (M9). |
| **8.2** | **PRONTA CON RISERVE** | Tre passaggi da confermare con l'umano prima del codice (`fase-8:102`): è un passo di processo voluto, non un difetto. Dipende da M3 per i ruoli che vedono le sezioni. |
| **8.3** | **NON PRONTA** | M3: l'accesso derivato di admin e super-admin all'App non è realizzabile con i soli passi scritti; la checklist non lo rileverebbe. Resta valida la regola su F1 (N13). |
| **8.4** | **PRONTA CON RISERVE** | M14: l'email «Account creato» cita l'indirizzo dell'App solo se `appRole ≠ none` (`fase-8:146`), in contrasto con M3 dopo la correzione. Dipende da 8.3. |
| **8.5** | **PRONTA CON RISERVE** | La prova «il manager modifica… l'admin pure» (`fase-8:182`) richiede che l'admin entri nell'App: dipende da M3. Dipende da 7.2, 7.4, 8.2, 8.3. |

**Ordine di esecuzione** [L]: `piano.yaml:43-48` e `00-piano-generale.md:40-45` coincidono: 4.0 → 7.0 → 7 → 8 → 6 → (4.1–4.4, 5). Ordini interni: Fase 7: 7.0 → 7.4 (`fase-7:25`); Fase 8: 8.1 → 8.3 → 8.2 → 8.4 → 8.5 (`fase-8:27`), coerente con `arco-38` e `arco-41/42`. `arco-47` (8.3 → 6.1) è coerente. Manca un arco 7.0 → 4.1 (M7).

---

## 6. Nuovi rilievi

Gravità: **B** = bloccante per Cursor · **P** = da correggere prima della fase interessata · **A** = da annotare. (Numero progressivo `M` per distinguerli da N1–N15.)

| ID | Gr. | Dove | Evidenza | Correzione proposta (testo esatto) |
|---|---|---|---|---|
| M1 | **P (prima della 7.0)** | `fase-7:71` | [E] Senza `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` nel `.env` la prova dà 403 per un motivo sbagliato. Senza riavvio del dev server i 200 restano dopo la correzione. Il controllo positivo sta alla fine (punto 5). Mancano i comandi per ottenere e usare il cookie. Il seed gira contro la `DATABASE_URL` dell'ambiente: un `.env` che punta a produzione creerebbe un super-admin lì. | Sostituire il punto con: «- **Prova a runtime in sviluppo** (Postgres locale). **Prerequisiti**: `DATABASE_URL` del `.env` punta al database di **sviluppo** (`127.0.0.1:5432`), mai a Cloud SQL (il seed crea un super-admin); `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `APP_PUBLIC_URL` sono valorizzati (senza, le strategie dei cookie non sono registrate: nessun cookie autentica e ogni richiesta risponde 403, quindi la prova sembra riuscita senza provare nulla). L'utente di prova deve avere `adminRole` `admin` o `super-admin`: un utente solo App è già escluso e non prova nulla. (1) Creare il primo e il secondo super-admin: `SEED_SUPERADMIN_EMAIL=<email 1> SEED_SUPERADMIN_PASSWORD=<password conforme> pnpm seed:super-admin`, poi lo stesso con `<email 2>` e `<password 2>` (il guardrail dell'ultimo super-admin locale non blocca la disattivazione del secondo finché resta il primo, attivo, con credenziali di bootstrap). (2) Avviare `pnpm dev`. Cookie: `curl -c jar1.txt -X POST http://localhost:3000/api/users/login/local -d 'email=<email 1>' --data-urlencode 'password=<password 1>'` e lo stesso per il secondo con `jar2.txt` (risposta 302). (3) **Controllo positivo, prima di disattivare**: con `jar2.txt`, `GET /api/users/me` mostra l'utente e `GET /api/users`, `/api/activity-log`, `/api/globals/settings` rispondono 200. (4) Disattivare il secondo dal primo (Admin, oppure `curl -b jar1.txt -X PATCH http://localhost:3000/api/users/<id del secondo> -H 'Content-Type: application/json' -d '{"active":false}'`). (5) Con `jar2.txt`, `GET /api/users`, `/api/activity-log` e `/api/globals/settings` rispondono **403**; con `jar1.txt` 200. (6) **Riavviare `pnpm dev` dopo ogni modifica alle funzioni di `access`**: Payload le tiene in memoria e l'hot reload non le sostituisce. (7) Eliminare il secondo utente (è disattivato, il guardrail non lo blocca).» |
| M2 | A | `fase-7:71`; `segnalazione…:6`; `fase-8:80,86` | [E] Il 200 prima della correzione è stato verificato; F1 riprodotto (§2). | `fase-7:71`: sostituire «(prima della modifica, per quanto si deduce dal codice, rispondevano 200)» con «(prima della modifica rispondevano 200: verificato dal pianificatore il 2026-10-04 a `2471059`)». `segnalazione…:6`: sostituire «**Non riprodotto a runtime** (nessun database nell'ambiente dell'audit)» con «**Riprodotto a runtime il 2026-10-04** su una copia di lavoro con PostgreSQL locale: `PATCH /api/users/<id>` con `{"adminRole":"super-admin"}` eseguito da un `admin` restituisce 200 e il ruolo cambia (cookie firmato con il secret di prova; `PATCH` in blocco non provato)». `fase-8:80`, in coda: «Il codice è quello della segnalazione (§ «Fix proposto»); l'8.3 non si chiude senza la prova, anche se il template non ha ancora risposto.» |
| M3 | **P (prima della 8.3; la 8.3 è NON PRONTA)** | `fase-8:76` (punto 5 di 8.3); `ADR-113:41`; `lib/auth/userAccess.ts:26`; `lib/auth/googleOAuth/userLoginChecks.ts:27`; `lib/auth/localLogin/appLoginChecks.ts:19` | [L] ADR-113 §3: «`super-admin`, `admin`: Tutte e tre. L'accesso è **derivato da `adminRole`**: non serve nessun `appRole`». `canAccessAppArea` vale solo per `appRole ≠ none` e governa `assertUserAllowedForOAuthLogin` (area `app`) e `assertUserAllowedForAppLocalLogin`. Un admin senza `appRole` non può accedere a `/app/login` con Google; arriva all'App solo se ha già una sessione Admin [D: `payload.auth` risolve la strategia `google-admin`]. 8.3 modifica `canAccessAdminPanel` e `canAccessSection`, non `canAccessAppArea` né i controlli di login. | In `fase-8` §8.3, dopo il punto 5: «5-bis. **Accesso all'App di admin e super-admin**: `canAccessAppArea` oggi vale solo per `appRole ≠ none` e governa il login Google dell'App (`lib/auth/googleOAuth/userLoginChecks.ts`, area `app`) e il login locale (`lib/auth/localLogin/appLoginChecks.ts`). Va estesa: vero per un utente attivo (`isActiveUser`) con `adminRole` `admin` o `super-admin`, oppure con `appRole: manager`; falso per `adminRole: manager` senza `appRole` (ADR-113 §3). Il login locale resta escluso per gli admin (`ADR-004`).» Nella checklist: «- [ ] Super-admin con `appRole: none`: login Google su `/app/login` → `/app`; `adminRole: manager` senza `appRole`: rifiutato con il messaggio generico.» |
| M4 | A | `fase-7:201`, `:211` | [E] `GET /api/globals/settings` con un utente autorizzato restituisce `allowedDomains`, `id`, `createdAt`, `updatedAt` e `globalType`. «Solo le chiavi della tab Orari e chiusure» è falso alla lettera. | `fase-7:201` e `:211`: sostituire «restituisce **solo** le chiavi della tab Orari e chiusure» con «restituisce **solo** le chiavi della tab Orari e chiusure (`services`, `weeklyClosedDays`, `annualClosures`, `bnb`) più i campi di sistema `id`, `createdAt`, `updatedAt` e `globalType`». |
| M5 | A | `fase-7:199` | [L] Descrive solo la lettura a livello di Global. Il manager `appRole` modifica la tab Orari (tabella di 7.4): serve anche `access.update` del Global aperto a lui, con il limite per campo. | In `fase-7` §7.4, dopo «Accesso a livello di Global…»: «Anche `access.update` del Global ammette admin, super-admin e `appRole: manager` (attivi); sui campi delle tab Calendario, Comunicazioni e Integrazioni `access.update` è riservato ad admin e super-admin, così un `update` del manager su quei campi viene scartato o rifiutato (prova in checklist).» |
| M6 | A | `piano.yaml:761` (`arco-38`, `tipo: decisione`); `piano.yaml:973` (`archi: ["arco-33", "arco-34"]`) | [E] Calcolato: l'unico arco `decisione` che non compare in nessuna voce di `adr_da_scrivere`. Non è una regressione di 2471059. | `piano.yaml:973`: `archi: ["arco-33", "arco-34", "arco-38"]`. |
| M7 | A | `fase-4:140`; `piano.yaml` (archi) | [L] 4.1 dipende ora da `isActiveUser` (7.0) per `isManagerOrStaff`, ma non c'è un arco `fase-7.0` → `fase-4.1`. | Aggiungere a `piano.yaml`: `- id: arco-48` / `da: fase-7.0` / `a: fase-4.1` / `tipo: output` / `descrizione: "isActiveUser (7.0) è la base di isManagerOrStaff, che governa l'accesso in lettura alle pagine in 4.1."` / `adr: null` / `fonte: "fase-4-cms-siti-esterni.md §4.1 (Bozze via REST)"`. |
| M8 | A | `ADR-115:25`; `fase-6:300-303` | [L] `availability-write` è nell'elenco chiuso, ma 6.4 riscrive il file a ogni cambio di `disabled`/`soldOut`: una voce per ogni tocco del manager, volume non previsto. Punti 8 e 9 sono nel corpo della decisione, senza data né accettazione registrata. | Togliere i punti 8–9 dal corpo e aggiungere in coda: «## Precisazioni (2026-10-04) — accettate su passaggio esplicito dell'umano **[da registrare]** / 1. `users.beforeDelete` e `purgeActivityLogForUserBeforeDelete` restano invariati: la cancellazione di un utente elimina le sue voci; le voci di sistema (`user` vuoto) non sono toccate. / 2. `detail` comincia con una chiave di azione da un elenco chiuso (`availability-reset`, `availability-write-failed`, `rebuild-started`, `revalidation`, `anonymization`), seguita da esito e dettagli. `availability-write-failed` registra solo gli errori di scrittura del file: le riscritture riuscite non si registrano (una per ogni cambio di stato del manager).» |
| M9 | **P (prima della 8.1)** | `fase-8:23,49` | [L] `components.json` non esiste (`:23`); `:49` dice di mettere token e stile in un CSS dedicato di `(app)`, non come configurare la CLI. [D] Il campo `tailwind.css` di `components.json` indica dove la CLI di shadcn scrive le variabili. Non l'ho verificato (la registry di shadcn non è raggiungibile dal sandbox). | In `fase-8` §8.1, dopo «Isolamento (dal repo)…»: «`components.json` (creato dalla CLI) deve indicare come file CSS quello dedicato di `(app)` (campo `tailwind.css`) e `tailwind.config` vuoto (Tailwind v4 senza file di configurazione). Dopo `shadcn init`, `git diff app/globals.css` deve essere vuoto: se la CLI l'ha modificato, annullare e correggere `components.json`. Verificare i nomi dei campi sulla documentazione aggiornata di shadcn, come già richiesto sopra.» |
| M10 | A | `fase-7:156`; `fase-7:149` | [L] Voce di checklist («Riportato nel file di fase 5 (da scrivere)») non eseguibile da Cursor. La nota di `fase-5.1` in `piano.yaml:160` dice già «Nasce senza i tre campi orario/chiusura (ADR-109 §3)». Il pulsante festività è un componente custom: nel repo la import map è in `app/(payload)/admin/importMap.js` e c'è lo script `generate:importmap`. | Sostituire `fase-7:156` con: «- [ ] La nota di `fase-5.1` in `piano.yaml` dice già che «Impostazioni prenotazioni» nasce senza questi campi (ADR-109 §3): verificata, nessuna modifica.» Aggiungere in `:149`, in coda: «Dopo il componente custom: `pnpm generate:importmap` e commit di `app/(payload)/admin/importMap.js`.» |
| M11 | A | `fase-7:92` (7.1) | [L] 7.1 dichiara «Dipende da: 4.0 completata», ma `fase-7:25` dice 7.0 → 7.1 e 7.1 userà le funzioni `access` aggiornate in 7.0. | `fase-7:92`: «**Dipende da**: 4.0 completata e 7.0 (utenti disattivati senza permessi: le funzioni `access` del Global usano gli helper aggiornati).» |
| M12 | A | `piano.yaml:1046` | [E] `po-10` è l'unico punto aperto con un campo `responsabile`: gli altri `po-NN` non lo hanno e la convenzione non lo prevede. | Aggiungere alla convenzione in testa a `piano.yaml` (dopo `piano.yaml:18`): «- un punto aperto può portare `responsabile` (chi lo chiude) quando non è il pianificatore o Cursor». |
| M13 | A | `fase-7:62` | [E] Il testo dice «circa 18 righe»; il `diff` ne stampa 32 con le intestazioni dei blocchi, le righe modificate sono 18. | Sostituire «(circa 18 righe)» con «(18 righe modificate, cioè quelle che iniziano con `<` o `>`; l'output di `diff` ne mostra 32 con le intestazioni dei blocchi)». |
| M14 | A | `fase-8:146` | [L] L'email «Account creato» cita l'indirizzo dell'App «se `appRole` non è `none`». Con M3 corretta, un admin senza `appRole` ha accesso all'App. | `fase-8:146`: sostituire con «…e/o dell'App (`/app/login`) se `appRole` non è `none` oppure `adminRole` è `admin` o `super-admin` (accesso derivato, ADR-113 §3)…». |

**Regressioni introdotte da 2471059.** Nessun riferimento rotto: ho cercato `arco-NN`, `po-NN`, `fase-N.M` e nomi di file in tutti i documenti (esclusi `docs/audit/`); restano solo `fase-2.10`, `fase-3.3`, `fase-3.4` (sottofasi dei file di catalogo, non nodi del DAG) e i rimandi storici a file di catalogo e a MongoDB, già noti. Affermazioni contraddittorie introdotte dal commit: nessuna. Gli unici punti coerenti-ma-incompleti sono M7 (arco mancante) e M14. **CHANGELOG** (`CHANGELOG.md:64` e le voci vicine): nessuna voce descrive codice cambiato; l'unica voce sulle correzioni di 2471059 elenca solo cambi di documenti, e tutti quelli che ho controllato sono presenti nei file. **Conteggio archi** [E]: 49, nessun duplicato, nessun arco verso nodi inesistenti, nessun ciclo. **Copia archiviata**: `docs/audit/audit-verifica-2026-10-04.md` coincide con il file che avevo prodotto (nessuna differenza).

---

## 7. Resta aperto per natura, e di chi è

| Voce | Di chi | Nota |
|---|---|---|
| F1 / `po-10`: verifica degli admin attuali e invio della segnalazione al template | **Umano** | Prima della 7.0 (N13, condizione 1); data di invio da fissare (condizione 2). |
| F27: `riepilogo-sessione-bucket-c.md` assente | **Umano** | Citato da `piano.yaml`, `ADR-107`, `ADR-109`; non è nel repo né nel Project. |
| Valori reali di F9: `max_connections` dell'istanza e `--max-instances` attuale | **Umano** | `fase-7:59` dà i comandi. |
| Prove a runtime: tutto ciò che il codice non fa ancora | **Cursor** | 7.0 (F2, F10), 4.1 (F24), 4.2 (F5), 7.4, 8.3 (F1, F2), migrazione di ADR-115 in 6.4. |
| ADR-111 (contratto con i siti, F4) e ADR-114 (CORS e abuso del form, F6, F20) | **Pianificatore** | `piano.yaml:932` per ADR-114; ADR-111 in 4.3 Parte A. |
| `fase-5-sistema-prenotazioni.md` | **Pianificatore** | Le voci F6, F8, F13, F14, F20 sono nelle note di `fase-5.x` in `piano.yaml:162-178`. |
| Verifica in produzione di login locale ed email (8.6) | **Umano**, dopo 6.6 e 8.5 | `po-03`. |
| **In più**: M3 (accesso derivato di admin all'App) | **Pianificatore** | Prima della 8.3. |
| **In più**: segnalazione F2 al template | **Umano** | La segnalazione ha un paragrafo «Osservazione correlata (F2)» dichiarato non verificato nel template (`segnalazione…`); dopo la 7.0 si può dire che F2 è corretto nel progetto. |

---

## 8. Non verificato, e perché

- **`pnpm build`**: non eseguito (font di Google non raggiungibili). L'affermazione su «build riuscito» in `fase-7:46` resta del pianificatore.
- **Rendering Admin** di un Global con tab vuote: il dev server è andato in panic di Turbopack in questo sandbox. Verificate la generazione della migrazione e lo schema, non la pagina.
- **`PATCH /api/users?where=…`** (aggiornamento in blocco) e la correzione di F1: non provati. F1 è riprodotto solo per `PATCH` singolo.
- **Disattivazione dall'interfaccia Admin**: provata solo via REST.
- **Plugin Redirects con due istanze a runtime**: verificato solo `buildConfig`.
- **Comportamento della CLI di shadcn** (M9): non verificato, la registry non è raggiungibile.
- **Cloud SQL**: nessun numero ufficiale di `max_connections` per `db-f1-micro` (N4).
- **Rendering delle sezioni 8.2, 8.4, 8.5**: non esistono ancora; la prontezza è giudicata sul testo e sul codice esistente.
- **Parti non rilette**: `fase-1`, `fase-2`, `fase-3`, `docs/operativo/*` (salvo quelle citate), `riepiloghi` del Project.
- **Cookie del login locale**: ho usato quello emesso da `/api/users/login/local` e, per F1, un JWT firmato da me; il flusso Google SSO non è stato provato.
