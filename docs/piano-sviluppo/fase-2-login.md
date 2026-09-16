---
stato: validato
---

# Fase 2 — Login

> Dettaglio operativo. Riferimento comportamentale: tutte le regole in `.cursor/rules/`, in particolare `auth/01-autenticazione-invarianti.mdc` (+ variante provider auth scelta), `email/01-email-invarianti.mdc` (+ variante provider email scelta), `payload-pattern/02-convenzioni-payload.mdc` e `core/02-processo-lavoro-agente.mdc`. Su quando serve una specifica di progetto dedicata, vedi il paragrafo subito sotto.

**Quando serve davvero una specifica di autenticazione dedicata**: questo file e le regole in `.cursor/rules/` già coprono schema `users`, allow-list, guardrail, `activityLog`, e — nel file di variante — il comportamento specifico del provider scelto. Una specifica di progetto separata (`docs/specifica-login-*.md`) va scritta **solo per le deviazioni** da questo standard (es. una policy password diversa, un ruolo `appRole` con permessi non banali, un requisito di compliance non coperto qui) — non per ripetere quanto è già generico in questo file e nelle regole. Se il progetto non devia da nulla, non serve nessuna specifica auth dedicata: questo file e le regole bastano da soli come riferimento.

Aggiornare lo stato di ogni sottofase qui sotto e nel file indice `00-piano-generale.md` non appena completata.

**Prerequisito**: Fase 1 chiusa (✅ su tutte le sottofasi in `fase-1-setup.md`).

**Nota sull'ordine pratico**: l'ordine numerato sotto segue la logica della specifica. In pratica, per poter testare `/admin` fin da subito, conviene eseguire la sottofase **2.8 (seed super-admin)** subito dopo la **2.1 (collection users)**, prima ancora di completare l'integrazione del provider SSO — così si ha un modo di autenticarsi in Admin anche mentre il login SSO non è ancora pronto. Segnalare questa deviazione pratica non è una violazione del piano, è una sequenza di esecuzione più comoda a parità di passi.

---

## 2.1 — Collection `users`

**Stato**: ✅ fatto

**Obiettivo**: unica collection `users` con lo schema definitivo dei ruoli, pronta ad accogliere sia utenti SSO sia utenti locali.

> **Decisione documentata**: schema ruoli baseline (`adminRole`/`appRole` separati, non cumulabili) — vedi `ADR-001-schema-ruoli-baseline.md`. Un progetto che estende l'enum di `appRole` non ridiscute questa ADR, la eredita; una deviazione dalla separazione stessa richiede una nuova ADR di progetto che la referenzi.

**Checklist**:
- Creare la collection `users` con i campi: `email` (text, required, unique — funge anche da username per il login locale), `adminRole` (select singolo: none/admin/super-admin), `appRole` (select singolo: none/[ruoli App del progetto]), `active` (checkbox, default true).
- Non aggiungere un campo `roles` cumulativo unico: i due ruoli sono campi separati, non cumulabili all'interno della stessa area.
- Il campo `password` è gestito nativamente da Payload (auth abilitata sulla collection): non ricostruire un meccanismo di hashing custom.
- Implementare la validazione custom sul campo `password` secondo la policy password decisa per il progetto (Payload impone nativamente solo un minimo di 8 caratteri).
- Campo `loginMethod` (o equivalente) che distingue **SSO esterno** da **locale**: tipicamente un Admin pannello userà sempre SSO, un utente App potrà usare SSO o locale a seconda della policy del progetto.
- Non implementare in questa sottofase l'enforcement dei permessi per singola sezione App: è rimandato per natura allo sviluppo di quelle sezioni. Qui basta che lo schema di `appRole` sia corretto.
- Scrivere comunque, fin da ora, lo stub di una funzione centralizzata di controllo permessi per sezione (es. `canAccessSection`), anche se nessuna sezione la richiama ancora — la collocazione fisica definitiva del file resta un punto aperto, da decidere solo quando si svilupperà la prima sezione App che la userà davvero, non ora.
- Access control della collection: la creazione di utenti con credenziali locali va ristretta secondo la regola generale (vedi 2.8 più sotto e `auth/01-autenticazione-invarianti.mdc`) — non ogni utente può avere una password.

**Eseguito (2026-09-16)**: collection `users` in `collections/Users.ts` registrata in `payload.config.ts` con auth nativa Payload, campi `adminRole`/`appRole`/`loginMethod`/`active`, accesso Admin tramite `access.admin` (admin o super-admin attivi). Policy password di catalogo in `lib/auth/passwordPolicy.ts` (hook `beforeValidate`); guardrail password locale parziale in `lib/auth/localPasswordGuard.ts` (Admin non super-admin e `loginMethod: sso`); stub `canAccessSection` in `lib/auth/canAccessSection.ts`. `appRole`: `none` | `manager` (ADR-102). Guardrail completi (ultimo super-admin, seed) in 2.8.

---

## 2.2 — Global "Settings" — allow-list identità autorizzate

**Stato**: 🔲 da fare

**Obiettivo**: allow-list delle identità autorizzate (domini, tenant, o equivalente a seconda del provider SSO scelto), gestita da pannello Admin, pronta a differenziare i permessi per area.

**Checklist**:
- Creare un Global (non una Collection) chiamato `Settings` o equivalente.
- Campo array (non `hasMany` testuale) con sotto-campi: l'identificatore rilevante per il provider scelto (es. `domain` per Google Workspace) e flag per area (`allowAdmin`, `allowApp`).
- Hook `beforeValidate`/`beforeChange`: trim, lowercase, validazione formato, prevenzione duplicati.
- Access control in scrittura ristretto al solo ruolo `super-admin` (campo `adminRole`).
- Implementare qui il guardrail "non salvabile se vuoto" (hook sulla Global): era in checklist 2.8, ma è stato rimandato esplicitamente (scelta b, 2026-09-16) perché questa Global non esisteva ancora. Non è coperto da 2.8; va fatto insieme allo schema, non lasciato implicito.


**Nota**: per il dettaglio specifico di cosa significa "identità autorizzata" per il provider scelto (dominio Workspace, tenant Azure AD, ecc.), vedi il file di variante auth corrispondente.

---

## 2.3 — Setup credenziali provider SSO

> **Sottofase a variante (provider auth).** Le istruzioni operative dipendono dal provider scelto. Seguire il file corrispondente, poi tornare qui:
> - Google OAuth → `fase-2-auth-google-oauth.md`
> - *(altri provider, quando disponibili nel catalogo)*

**Stato**: 🔲 da fare

**Obiettivo**: credenziali del provider SSO scelto pronte per l'integrazione.

**Questo è un passaggio esterno a Cursor.** Seguire la regola dedicata in `core/02-processo-lavoro-agente.mdc`: non assumere che sia già stato fatto, fermarsi e attendere conferma.

**Checklist di chiusura sottofase (valida per qualunque variante — verificare dopo aver seguito il file di variante)**:
- [ ] Credenziali (client ID/secret o equivalente) salvate come variabili d'ambiente, mai hardcoded.
- [ ] `.gitignore` le esclude.
- [ ] Documentata una nota operativa interna su dove/come si trovano queste credenziali, per chi gestirà il sistema in futuro.

---

## 2.4 — Integrazione provider SSO — istanza Admin

> **Sottofase a variante (provider auth).** Vedi file di variante: `fase-2-auth-google-oauth.md` (o equivalente).

**Stato**: 🔲 da fare

**Obiettivo**: login tramite il provider SSO scelto funzionante su `/admin`, con validazione identità e whitelist-per-record.

> **Decisione documentata**: isolamento delle istanze SSO tra Admin e App — vedi `ADR-002-isolamento-istanze-sso.md`.

**Checklist di chiusura sottofase (valida per qualunque variante)**:
- [ ] Il flusso rispetta tutti gli invarianti di `auth/01-autenticazione-invarianti.mdc` (whitelist-per-record, nessun autoprovisioning, messaggio di rifiuto generico, validazione lato server, mai toccare il campo `password`).
- [ ] La login view standard di `/admin/login` mostra solo il pulsante del provider SSO — nessun form locale visibile qui.

---

## 2.5 — Integrazione provider SSO — istanza App

> **Sottofase a variante (provider auth).** Vedi file di variante: `fase-2-auth-google-oauth.md` (o equivalente).

**Stato**: 🔲 da fare

**Obiettivo**: login tramite il provider SSO scelto funzionante su `/app`, stessa logica dell'istanza Admin ma su configurazione distinta.

> **Decisione documentata**: stessa ADR di §2.4 — vedi `ADR-002-isolamento-istanze-sso.md`.

**Checklist di chiusura sottofase (valida per qualunque variante)**:
- [ ] Le due istanze (Admin e App) sono isolate (identificatori distinti), come richiesto da `auth/01-autenticazione-invarianti.mdc`.
- [ ] Il bottone SSO sulla pagina di login custom dell'App usa questa istanza, non quella Admin.

---

## 2.6 — Login locale (form App)

**Stato**: 🔲 da fare

**Obiettivo**: form locale funzionante sotto `/app`, con verifica password nativa e invio email di attivazione/reset gestito dal provider email scelto per il progetto.

> **Decisione documentata**: login locale come opzione standard (non solo emergenza) per l'Area App — vedi `ADR-003-login-locale-app-default.md`. Un progetto che vuole solo-SSO anche per l'App devia da questo default: richiede una nuova ADR di progetto che lo dichiari, non un'omissione silenziosa.

**Checklist**:
- Costruire la pagina di login custom dell'Area App con bottone del provider SSO (2.5) **e** form email/password.
- Verificare il flusso: ricerca utente per email → verifica password via strategia nativa Payload → verifica `active` → sessione. Se l'utente non ha password impostata (solo SSO) o la password non combacia, il fallimento deve essere naturale (nessun caso speciale da gestire esplicitamente).
- Il controllo identità/allow-list (2.2) **non si applica** al login locale: verificare che non venga richiamato per errore in questo percorso.
- Messaggio di rifiuto identico a quello del flusso SSO in ogni caso di fallimento.

> **Invio email (variante provider email)**: la configurazione del provider email transazionale per l'invio automatico all'attivazione utente e al reset password è trattata nel file di variante corrispondente, da seguire poi tornare qui:
> - Resend → `fase-2-email-resend.md`
> - *(altri provider, quando disponibili nel catalogo)*
>
> Vedi anche `email/01-email-invarianti.mdc`: **verificare sempre nella pratica la durata reale dei token** di attivazione/reset (può differire da quanto dichiarato nella specifica/documentazione), e documentare il valore reale trovato.

---

## 2.7 — Route locale di emergenza per super-admin

**Stato**: 🔲 da fare

**Obiettivo**: via di accesso locale riservata al super-admin di bootstrap, non raggiungibile da alcun link visibile.

**Checklist**:
- Creare la route `/admin/login/local` (o percorso equivalente), non linkata da nessuna UI standard di Payload né dell'App.
- Deve usare la stessa strategia nativa di Payload per il login locale, non un sistema a parte.
- Verificare che sia accessibile **solo** digitando l'URL direttamente, non tramite navigazione da `/admin/login`.
- Scrivere la nota operativa interna che documenta l'esistenza e lo scopo di questa route, per chi gestirà il sistema — coerente con la regola di documentazione obbligatoria. Senza questa nota, la route rischia di essere dimenticata proprio nel momento in cui serve davvero.

---

## 2.8 — Script di seed super-admin + guardrail

**Stato**: ✅ fatto

**Obiettivo**: primo super-admin creato in modo ripetibile, e i due vincoli minimi di sicurezza attivi.

**Checklist**:
- Scrivere uno script di seed che crei un utente super-admin locale (email + password fornite come parametri o variabili d'ambiente, non hardcoded nel codice sorgente).
- Implementare il vincolo: non è possibile eliminare o disattivare (`active = false`) l'ultimo super-admin locale rimasto — validazione applicativa sulla collection `users`.
- Implementare il vincolo: non è possibile salvare l'allow-list identità (Global, 2.2) se risulterebbe vuota.
- Implementare il vincolo: nessun altro utente Admin può essere creato con credenziali locali oltre al/ai super-admin di bootstrap — a livello di access control sulla collection.
- Non implementare elementi non richiesti dalla specifica del progetto (es. procedura "vetro da rompere" fuori applicazione, audit log dedicato per interventi di emergenza, differenziazione di processo tra ambienti per il seed) — coerente con `core/01-proporzionalita.mdc`.

**Eseguito (2026-09-16)**: script `scripts/seed-super-admin.ts` (`pnpm seed:super-admin`) con email/password da `SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_PASSWORD`; idempotente sulla stessa email se già super-admin locale attivo, rifiuta se l'email esiste con un altro profilo. Guardrail ultimo super-admin locale in `lib/auth/lastLocalSuperAdmin.ts` (delete, `active = false`, e anche declassamento ruolo / passaggio a solo-SSO, altrimenti aggirabile). Access control `canCreateUser` + hook `assertLocalPasswordAllowed` completato: Admin di pannello senza credenziali locali; App e super-admin restano ammessi. Nessun ramo seed diverso per ambiente.

**Pendente — vincolo allow-list vuota (scelta b)**: la Global Settings (2.2) non esiste ancora, sequenza pratica 2.8 subito dopo 2.1. Non è stato creato uno schema minimo anticipato. Il vincolo "non salvabile se vuota" va implementato in 2.2 insieme allo schema; non è implicito né parzialmente coperto.

---

## 2.9 — Collection `activityLog` (eventi di autenticazione)

**Stato**: 🔲 da fare

**Obiettivo**: log applicativo unico e condiviso tra Admin e App; eventi auth implementati: login, logout, accesso negato (con utente identificato).

> **Meccanismo generale**: lo schema completo della collection `activityLog` e il pattern di popolamento via hook — inclusa la parte non legata all'auth (azioni CRUD su documenti, e perché non serve un log API separato: gli hook di collection intercettano già Local API/REST/GraphQL/Admin allo stesso modo) — sono definiti una volta sola in `payload-pattern/03-log-azioni.mdc`, non ripetuti qui. Questa sottofase **istanzia** quel meccanismo per gli eventi di autenticazione: i primi, e per questa fase gli unici, ad essere attivati.
>
> **Dipendenza non ancora validata**: `payload-pattern/03-log-azioni.mdc` ha `stato: bozza` — non ha ancora superato la revisione standard (Composer + verifica meccanica). Lo schema sotto è affidabile per la parte auth (già in uso), ma verificare lo stato corrente del file prima di considerarlo un riferimento assestato per le parti non-auth.

**Checklist**:
- Creare la collection `activityLog` secondo lo schema generale di `payload-pattern/03-log-azioni.mdc` (non `loginEvents` — nome scelto per accogliere altri eventi futuri senza migrazione di schema). Per questa sottofase servono solo i campi lato auth dello schema: `user` (relationship a `users`), `timestamp` (automatico), `area` (select: admin/app, opzionale), `eventType` (login/logout/accessDenied), `method` (select: sso/local).
- Popolare `activityLog` dall'hook `afterLogin` della collection `users` — si attiva indipendentemente da quale istanza/area ha autenticato, perché vive sulla collection e non sulla singola istanza del plugin/provider.
- Popolare logout da hook `afterLogout`; accessi negati quando l'utente è identificato in `users`.
- `area` e `method` derivano dal contesto della strategia/istanza che ha autenticato (identificatori distinti tra le istanze, 2.4/2.5, forniscono già questa informazione).
- **Non attivare ancora** i campi `collection`/`documentId` dello schema generale, né agganciare hook di logging ad altre collection: restano fuori scope finché una specifica di progetto non richiede esplicitamente di tracciare azioni CRUD su una collection specifica — coerente con `core/01-proporzionalita.mdc` (vedi `payload-pattern/03-log-azioni.mdc`, sezione "Attivazione: decisione di progetto, non default"). Non è un'omissione silenziosa: è la stessa distinzione meccanismo/attivazione descritta lì, applicata qui.

---

## 2.10 — Spike di test end-to-end con credenziali reali

**Stato**: 🔲 da fare

**Obiettivo**: conferma pratica, non solo di codice, che il flusso di login funziona davvero nell'ambiente reale.

**Questo passaggio richiede credenziali/ambiente reali (vedi 2.3) — coordinarsi con l'umano prima di eseguirlo.**

**Checklist**:
1. Avviare l'app in locale con le due istanze del provider SSO configurate (Admin e App).
2. Creare un record utente in `users` con identità reale, ruolo admin o super-admin (o richiedere all'umano di indicarne uno esistente).
3. Login SSO su `/admin`: verificare autenticazione riuscita e che il cookie autentichi anche una chiamata REST (es. endpoint utente corrente).
4. Ripetere lo stesso su `/app` (istanza separata).
5. Login locale su `/app` con un utente locale di test.
6. Tentativo con un'identità non autorizzata (fuori allow-list) → verificare rifiuto con messaggio generico. Per il dettaglio di come si presenta questo scenario nel provider scelto, vedi il file di variante auth.
7. Ripetere i punti rilevanti sull'ambiente di produzione, per verificare il comportamento del cookie httpOnly su HTTPS dietro proxy/load balancer, prima del rilascio definitivo — **da eseguire in Fase 3**, non qui: non bloccante per chiudere Fase 2.

**Non serve** un framework di test automatizzato per questo spike: è manuale, una tantum, in fase di sviluppo — non va rimandato al deploy né trasformato in un'infrastruttura di test permanente (coerente con `core/01-proporzionalita.mdc`).

---

## Note di chiusura fase

Al termine della Fase 2, prima di iniziare `fase-3-deploy.md`:
- [ ] Sottofasi 2.1–2.10 marcate ✅ in questo file e in `00-piano-generale.md` (il punto 7 di 2.10, se rimandato a Fase 3, va segnalato esplicitamente come tale, non semplicemente ✅).
- [ ] Segnalare esplicitamente qualunque deviazione dal piano avvenuta durante l'esecuzione (es. un fix non previsto, un comportamento diverso da quello atteso in una libreria/plugin), così da tenerne conto nelle fasi successive.
- [ ] Verificare che nessun test dev pendente sia rimasto "in sospeso silenzioso": se qualcosa è stato rimandato a Fase 3, deve essere esplicitamente scritto in `fase-3-deploy.md`, non solo nella cronologia della chat.

Fuori scope di Fase 2 (salvo diversa indicazione della specifica di progetto): enforcement permessi per singola sezione App, evoluzione futura del provider SSO (es. cambio di modalità o migrazione a un provider diverso), eventType di `activityLog` non legati all'autenticazione — schema e meccanismo generale per estenderli sono già pronti in `payload-pattern/03-log-azioni.mdc`, ma attivarli su una collection specifica resta una decisione di progetto esplicita, non implicita in questo file.

## Incoerenze note

*(Nessuna al momento. Sezione per segnalare esplicitamente contraddizioni o ambiguità non risolte tra questo file e altri — vedi `processo-v2-operativo.md` §3, Balzer 1991.)*
