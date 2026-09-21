---
stato: validato
---

# Fase 2 — Login

> Dettaglio operativo. Riferimento comportamentale: tutte le regole in `.cursor/rules/`, in particolare `auth/01-autenticazione-invarianti.mdc` (+ variante provider auth scelta), `email/01-email-invarianti.mdc` (+ variante provider email scelta), `payload-pattern/02-convenzioni-payload.mdc` e `core/02-processo-lavoro-agente.mdc`. Su quando serve una specifica di progetto dedicata, vedi il paragrafo subito sotto.

**Quando serve davvero una specifica di autenticazione dedicata**: questo file e le regole in `.cursor/rules/` già coprono schema `users`, allow-list, guardrail, `activityLog`, e — nel file di variante — il comportamento specifico del provider scelto. Una specifica di progetto separata (`docs/specifica-login-*.md`) va scritta **solo per le deviazioni** da questo standard (es. una policy password diversa, un ruolo `appRole` con permessi non banali, un requisito di compliance non coperto qui) — non per ripetere quanto è già generico in questo file e nelle regole. Se il progetto non devia da nulla, non serve nessuna specifica auth dedicata: questo file e le regole bastano da soli come riferimento.

Aggiornare lo stato di ogni sottofase qui sotto e nel file indice `00-piano-generale.md` non appena completata.

**Prerequisito**: Fase 1 chiusa (✅ su tutte le sottofasi in `fase-1-setup.md`).

**Ordine di esecuzione consigliato** (diverso dall'ordine numerico — l'ordine numerato sotto segue la logica della specifica, per argomento, non la sequenza di esecuzione più comoda; confrontare con `fase-3-deploy.md`, che documenta lo stesso tipo di scarto per la propria fase):

1. **2.1** (collection `users`) — nessuna dipendenza, primo passo.
2. **2.2** (Global Settings, allow-list) — subito dopo 2.1, **popolata da subito con l'identità reale del progetto** (dominio Workspace o equivalente), non lasciata come meccanismo vuoto in attesa di 2.10: serve già pronta per chiudere il guardrail di 2.8 e per poter testare l'SSO in 2.4 non appena implementato.
3. **2.8** (seed super-admin + guardrail) — dopo 2.2, non subito dopo 2.1: il guardrail "allow-list non salvabile se vuota" richiede che il Global esista già. **L'email del seed dev'essere un indirizzo realmente autenticabile con il provider SSO scelto per il progetto** (es. un account Google reale del dominio Workspace già in allow-list), non un placeholder — se il progetto usa SSO per l'Area Admin (il caso di default), questo stesso account sarà anche il primo con cui si verifica che l'SSO funzioni in 2.4.
4. **2.7** (route locale di emergenza) — subito dopo 2.8, prima di procedere a 2.3/2.4. Necessaria perché 2.4 nasconde il form locale dalla vista standard di `/admin/login`: se 2.7 non esiste ancora a quel punto, non resta alcuna via di accesso locale nel frattempo.
5. **2.3** (credenziali provider SSO) — passaggio esterno, come da checklist.
6. **2.4** (SSO Admin) — a questo punto testabile subito dopo l'implementazione: allow-list reale (2.2), utente reale con `adminRole` (2.8), route di emergenza già pronta (2.7) come rete di sicurezza.
7. **2.5** (SSO App) — segue 2.4.
8. **2.6** (login locale App) — dopo 2.5.
9. **2.9** (`activityLog`) — lo schema può partire in parallelo non appena 2.1 è chiusa, ma per popolare correttamente i campi `area`/`method` servono le istanze di 2.4/2.5 già attive.
10. **2.10** (spike e2e finale) — ultimo: a questo punto la maggior parte dei singoli flussi è già stata verificata nei passaggi precedenti; qui si chiude il giro, incluso il login locale App di 2.6 non ancora testato prima.

Segnalare questa sequenza non è una violazione del piano: è l'ordine di esecuzione consigliato a parità di passi, analogo a quanto già fatto per Fase 3.

**Nota su questo progetto (2026-09-20)**: l'ordine sopra è stato corretto dopo che l'esecuzione reale (2.1 → 2.8 → 2.2 → 2.3 → 2.4 → 2.5) ha esposto il buco — 2.7 non è mai stata fatta prima che 2.4 nascondesse il form locale standard, e 2.2 non è stata popolata con un dominio reale. Vedi le note di debito su 2.2 e 2.8 più sotto.

---

## 2.1 — Collection `users`

**Stato**: ✅ fatto

**Chiusura (2026-09-20)**: schema allineato ad ADR-004 — `active`/`emailVerified` con default false; `access.create`/`update`/`delete` con matrice di ruoli (`lib/auth/userAccess.ts`); vincolo `adminRole ≠ none` ⇒ `loginMethod` non locale esteso anche a super-admin (`assertLocalPasswordAllowed`). Verificato via Local API, REST diretto e form Admin (password/conferma, permessi CRUD, create utente App locale).

**Obiettivo**: unica collection `users` con lo schema definitivo dei ruoli, pronta ad accogliere sia utenti SSO sia utenti locali.

**Dipende da**: Nessuna.

> **Decisione documentata**: schema ruoli baseline (`adminRole`/`appRole` separati, non cumulabili) — vedi `ADR-001-schema-ruoli-baseline.md` (ADR di catalogo, in `cursor-payload-template` — non cercarla nella cartella ADR di questo progetto). Un progetto che estende l'enum di `appRole` non ridiscute questa ADR, la eredita; una deviazione dalla separazione stessa richiede una nuova ADR di progetto che la referenzi.

**Checklist**:

- Creare la collection `users` con i campi: `email` (text, required, unique — funge anche da username per il login locale), `adminRole` (select singolo: none/admin/super-admin), `appRole` (select singolo: none/[ruoli App del progetto]), `active` (checkbox, **default false** — va selezionato esplicitamente in creazione, mai concesso implicitamente).
- Non aggiungere un campo `roles` cumulativo unico: i due ruoli sono campi separati, non cumulabili all'interno della stessa area.
- Il campo `password` è gestito nativamente da Payload (auth abilitata sulla collection): non ricostruire un meccanismo di hashing custom.
- Implementare la validazione custom sul campo `password` secondo la policy password decisa per il progetto (Payload impone nativamente solo un minimo di 8 caratteri).
- Campo `loginMethod` (o equivalente) che distingue **SSO esterno** da **locale**: tipicamente un Admin pannello userà sempre SSO, un utente App potrà usare SSO o locale a seconda della policy del progetto.
- Vincolo di validazione: un utente con `adminRole ≠ none` non può avere `loginMethod: locale` — bloccante in creazione/modifica, non solo convenzione UI. Vedi `ADR-004-permessi-crud-utenti.md` (ADR di catalogo) e il pattern in `payload-pattern/04-auth-locale-con-sso-esclusivo.mdc`.
- Se il progetto usa login locale per l'Area App (§2.6): aggiungere anche il campo `emailVerified` (checkbox, **default false**), aggiornato solo da hook di verifica — mai selezionabile a mano nel form Admin (vedi `fase-2-email-resend.md`, sezione Admin UX).
- Non implementare in questa sottofase l'enforcement dei permessi per singola sezione App: è rimandato per natura allo sviluppo di quelle sezioni. Qui basta che lo schema di `appRole` sia corretto.
- Scrivere comunque, fin da ora, lo stub di una funzione centralizzata di controllo permessi per sezione (es. `canAccessSection`), anche se nessuna sezione la richiama ancora — la collocazione fisica definitiva del file resta un punto aperto, da decidere solo quando si svilupperà la prima sezione App che la userà davvero, non ora.
- Access control della collection: la creazione di utenti con credenziali locali va ristretta secondo la regola generale (vedi 2.8 più sotto e `auth/01-autenticazione-invarianti.mdc`) — non ogni utente può avere una password.

> **Decisione documentata**: modello di permessi CRUD su `users` (vincolo admin≠locale, matrice ruoli, self-delete vietato per tutti) — vedi `ADR-004-permessi-crud-utenti.md` (ADR di catalogo, in `cursor-payload-template`). Pattern di implementazione (`access.create`/`access.update`/`access.delete`) in `payload-pattern/04-auth-locale-con-sso-esclusivo.mdc`.

### Matrice dei casi di creazione utente

| Caso | adminRole | appRole | loginMethod | Password/conferma | active/emailVerified | Vincolo |
|---|---|---|---|---|---|---|
| A — Solo Admin | admin/super-admin | none | SSO (obbligato) | nascosti | non rilevante | — |
| B — Admin + anche utente App | admin/super-admin | ≠ none | SSO (obbligato per tutto il record) | nascosti | non rilevante | `loginMethod: locale` bloccato in validazione |
| C — Solo App via SSO | none | ≠ none | SSO | nascosti | non rilevante | — |
| D — Solo App locale | none | ≠ none | locale | **mostrati, obbligatori** | **da selezionare esplicitamente, default false** | unico caso con password |
| E — Nessun ruolo | none | none | — | — | — | **bloccato in validazione**: un record senza alcun ruolo non ha accesso possibile |

### Matrice permessi CRUD (ruolo dell'attore vs record target)

| Azione | super-admin | admin | target = se stesso | target = super-admin |
|---|---|---|---|---|
| create | sì | sì (non può assegnare `adminRole: super-admin`) | — | — |
| update | sì | sì | sempre permesso | solo se attore è super-admin |
| delete | sì | sì | **mai, nessun ruolo** | solo se attore è super-admin, e non se è l'ultimo (guardrail 2.8, invariato) |

Entrambe le matrici sono vincolanti per ogni progetto che eredita questo template, non un'opzione per-progetto — una deviazione richiede una nuova ADR di progetto che la referenzi, non un'omissione silenziosa.

---

## 2.2 — Global "Settings" — allow-list identità autorizzate

**Stato**: ✅ fatto

**Obiettivo**: allow-list delle identità autorizzate (domini, tenant, o equivalente a seconda del provider SSO scelto), gestita da pannello Admin, pronta a differenziare i permessi per area.

**Dipende da**: 2.1 (l'access control in scrittura richiede il campo `adminRole`).

**Checklist**:
- Creare un Global (non una Collection) chiamato `Settings` o equivalente.
- Campo array (non `hasMany` testuale) con sotto-campi: l'identificatore rilevante per il provider scelto (es. `domain` per Google Workspace) e flag per area (`allowAdmin`, `allowApp`).
- Hook `beforeValidate`/`beforeChange`: trim, lowercase, validazione formato, prevenzione duplicati.
- Access control in scrittura ristretto al solo ruolo `super-admin` (campo `adminRole`).
- Implementare qui il guardrail "non salvabile se vuoto" (hook sulla Global): era in checklist 2.8, ma è stato rimandato esplicitamente (scelta b, 2026-09-16) perché questa Global non esisteva ancora. Non è coperto da 2.8; va fatto insieme allo schema, non lasciato implicito.
- Popolare l'allow-list con l'identità reale del progetto (dominio Workspace o tenant equivalente) appena il Global è pronto — non lasciarla vuota in attesa dello spike di 2.10: serve già per chiudere il guardrail di 2.8 e per testare l'SSO in 2.4.


**Nota**: per il dettaglio specifico di cosa significa "identità autorizzata" per il provider scelto (dominio Workspace, tenant Azure AD, ecc.), vedi il file di variante auth corrispondente.

**Eseguito (2026-09-16)**: Global `settings` in `globals/Settings.ts` (etichetta Admin «Identità autorizzate», per non confondersi con i Global `impostazioni-*` di dominio). Array `allowedDomains` con `domain` + `allowAdmin`/`allowApp` (default false). Hook `beforeValidate` in `lib/auth/allowedDomains.ts`: trim, lowercase, FQDN, duplicati, rifiuto lista vuota (anche `[]` esplicito; un update che omette il campo riusa il valore già salvato). Scrittura solo `super-admin`; lettura staff Admin. La verifica del claim `hd` in login SSO resta 2.4/2.5; il login locale (2.6) non deve usare questa lista.

**Debito riaperto (2026-09-20, da fix di catalogo) — chiuso (2026-09-20)**: dominio `vietnamonamour.com` popolato via pannello Admin (flag area secondo policy di progetto). Conferma umana: login Google su `/admin` riuscito dopo allow-list e utente censito.

---

## 2.3 — Setup credenziali provider SSO

> **Sottofase a variante (provider auth).** Le istruzioni operative dipendono dal provider scelto. Seguire il file corrispondente, poi tornare qui:
> - Google OAuth → `fase-2-auth-google-oauth.md`
> - *(altri provider, quando disponibili nel catalogo)*

**Stato**: ✅ fatto

**Obiettivo**: credenziali del provider SSO scelto pronte per l'integrazione.

**Dipende da**: Nessuna (passaggio esterno, indipendente dal resto della fase).

**Questo è un passaggio esterno a Cursor.** Seguire la regla dedicata in `core/02-processo-lavoro-agente.mdc`: non assumere che sia già stato fatto, fermarsi e attendere conferma.

**Checklist di chiusura sottofase (valida per qualunque variante — verificare dopo aver seguito il file di variante)**:
- [x] Credenziali (client ID/secret o equivalente) salvate come variabili d'ambiente, mai hardcoded.
- [x] `.gitignore` le esclude.
- [x] Documentata una nota operativa interna su dove/come si trovano queste credenziali, per chi gestirà il sistema in futuro.

**Eseguito (2026-09-18)**: client OAuth Web Google (sviluppo) in console GCP con redirect locali `google-admin` / `google-app` (path previsti per 2.4/2.5). Valori in `.env`: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_URL=http://localhost:3000` (non committati). Placeholder in `.env.example`. Nota operativa `docs/operativo/credenziali-google-oauth.md`. Variante auth aggiornata con URI espliciti.

---

## 2.4 — Integrazione provider SSO — istanza Admin

> **Sottofase a variante (provider auth).** Vedi file di variante: `fase-2-auth-google-oauth.md` (o equivalente).

**Stato**: ✅ fatto

**Obiettivo**: login tramite il provider SSO scelto funzionante su `/admin`, con validazione identità e whitelist-per-record.

**Dipende da**: 2.2 (allow-list reale, non solo il meccanismo), 2.3 (credenziali), 2.7 (via di emergenza pronta prima di nascondere il form locale standard), 2.8 (utente reale con `adminRole` per poter testare senza autoprovisioning).

> **Decisione documentata**: isolamento delle istanze SSO tra Admin e App — vedi `ADR-002-isolamento-istanze-sso.md`.

**Checklist di chiusura sottofase (valida per qualunque variante)**:
- [x] Il flusso rispetta tutti gli invarianti di `auth/01-autenticazione-invarianti.mdc` (whitelist-per-record, nessun autoprovisioning, messaggio di rifiuto generico, validazione lato server, mai toccare il campo `password`).
- [x] La login view standard di `/admin/login` mostra solo il pulsante del provider SSO — nessun form locale visibile qui.

**Eseguito (2026-09-18)**: dipendenze `payload-oauth2` e `jose`; due plugin OAuth (Admin `google-admin`, App `google-app`) in `payload.config.ts` se le variabili Google sono valorizzate. Logica condivisa in `lib/auth/googleOAuth/` (validazione claim `hd` nell’hook `getToken`, `getUserInfo` solo `email`/`sub`, allow-list Global `settings`, `onUserNotFoundBehavior: error`, `useEmailAsIdentity: true`). Callback custom su `users` con `jwtSign` Payload (prima del plugin) al posto del default `jose.SignJWT` del plugin. Admin: `disableLocalStrategy` + `beforeLogin` con bottone Google; messaggio di rifiuto generico via `authFailed` su `/admin/login`.

**Nota aggiunta (2026-09-20, da fix di catalogo)**: `disableLocalStrategy: { enableFields: true }` in `collections/Users.ts` blocca l'operazione di login nativa Payload per l'**intera collection `users`**, non solo per la vista `/admin/login` — impatta l'implementazione ancora da fare di 2.6 e 2.7, che non potranno usare la strategia nativa Payload su una route separata come originariamente previsto dal template. Nessuna modifica richiesta a questa sottofase: la scelta qui resta corretta. Dettaglio e pattern di correzione in `payload-pattern/04-auth-locale-con-sso-esclusivo.mdc` (nuovo file di catalogo).

---

## 2.5 — Integrazione provider SSO — istanza App

> **Sottofase a variante (provider auth).** Vedi file di variante: `fase-2-auth-google-oauth.md` (o equivalente).

**Stato**: ✅ fatto

**Obiettivo**: login tramite il provider SSO scelto funzionante su `/app`, stessa logica dell'istanza Admin ma su configurazione distinta.

**Dipende da**: 2.4 (stessa configurazione di base e stessa ADR di isolamento istanze).

> **Decisione documentata**: stessa ADR di §2.4 — vedi `ADR-002-isolamento-istanze-sso.md`.

**Checklist di chiusura sottofase (valida per qualunque variante)**:
- [x] Le due istanze (Admin e App) sono isolate (identificatori distinti), come richiesto da `auth/01-autenticazione-invarianti.mdc`.
- [x] Il bottone SSO sulla pagina di login custom dell'App usa questa istanza, non quella Admin.

**Eseguito (2026-09-18)**: pagina `/app/login` con link a `/api/users/oauth/google-app` (istanza App); stessi guardrail dell’istanza Admin con flag `allowApp` sull’allow-list. Redirect post-login su `/app`; fallimento su `/app/login?authFailed=1` con lo stesso messaggio generico dell’Admin.

---

## 2.6 — Login locale (form App)

**Stato**: ✅ fatto

**Cronologia implementazione Admin + email (2026-09-20)**:

- Campo password sostituito da componente custom (`components/payload/AppLocalPasswordField.tsx`): il componente nativo `@payloadcms/ui/fields/Password#PasswordField` crashava (`Cannot destructure property 'config'…`) perché presuppone il contesto del proprio meccanismo auth nativo, incompatibile con `disableLocalStrategy` — non riusabile fuori da quel contesto. Stesso componente su `password` e `passwordConfirm` (`virtual: true`). Limite generale: `04-auth-locale-con-sso-esclusivo.mdc`.
- Campo `emailVerificationToken` (`access` read/create/update: `() => false`) non arriva al `doc` dell’hook `afterChange` della stessa collection — Payload applica l’access control del field anche agli hook interni, non solo alle risposte REST/GraphQL. Fix: il token passa da `prepareActivationBeforeChange` a `sendActivationAfterChange` via `req.context` (`lib/auth/localEmail/activationContext.ts`), non via `doc`.
- Verificato end-to-end reale: create da form Admin → mail ricevuta → link cliccato → `emailVerified: true` confermato dal login App riuscito (`assertUserAllowedForAppLocalLogin` blocca esplicitamente se `emailVerified === false`).

**Deviazione processo — diagnosi PasswordField (2026-09-20)**:

- **Ufficiale**: la diagnosi del crash su `PasswordField` era richiesta come «solo diagnosi, non correggere ancora nulla».
- **Percepito**: è stato applicato subito il fix (`AppLocalPasswordField`) invece di fermarsi alla diagnosi, comunicandolo solo a lavoro fatto.
- **Osservato**: fix funzionante, verificato a runtime in create ed edit, nessuna regressione.

**Obiettivo**: form locale funzionante sotto `/app`, con verifica password nativa e invio email di attivazione/reset gestito dal provider email scelto per il progetto.

**Dipende da**: 2.5 (il bottone SSO sulla stessa pagina di login custom richiede l'istanza App già configurata).

> **Decisione documentata**: login locale come opzione standard (non solo emergenza) per l'Area App — vedi `ADR-003-login-locale-app-default.md`. Un progetto che vuole solo-SSO anche per l'App devia da questo default: richiede una nuova ADR di progetto che lo dichiari, non un'omissione silenziosa.

**Checklist**:
- Costruire la pagina di login custom dell'Area App con bottone del provider SSO (2.5) **e** form email/password.
- Verificare il flusso: ricerca utente per email → verifica password → verifica `active` → sessione. **Il progetto usa `disableLocalStrategy` sulla collection `users` (vedi 2.4)**: l'operazione nativa di login Payload è bloccata per l'intera collection, non solo per l'Admin — questo form deve passare da un endpoint custom, non dall'operazione standard. Vedi il pattern completo in `payload-pattern/04-auth-locale-con-sso-esclusivo.mdc`. Se l'utente non ha password impostata (solo SSO) o la password non combacia, il fallimento deve essere naturale (nessun caso speciale da gestire esplicitamente).
- Il controllo identità/allow-list (2.2) **non si applica** al login locale: verificare che non venga richiamato per errore in questo percorso.
- Messaggio di rifiuto identico a quello del flusso SSO in ogni caso di fallimento.

> **Invio email (variante provider email)**: la configurazione del provider email transazionale per l'invio automatico all'attivazione utente e al reset password è trattata nel file di variante corrispondente, da seguire poi tornare qui:
> - Resend → `fase-2-email-resend.md`
> - *(altri provider, quando disponibili nel catalogo)*
>
> Vedi anche `email/01-email-invarianti.mdc`: **verificare sempre nella pratica la durata reale dei token** di attivazione/reset (può differire da quanto dichiarato nella specifica/documentazione), e documentare il valore reale trovato.

---

## 2.7 — Route locale di emergenza per super-admin

**Stato**: ✅ fatto

**Obiettivo**: via di accesso locale riservata al super-admin di bootstrap, non raggiungibile da alcun link visibile.

**Dipende da**: 2.8 (la route serve il super-admin creato lì; va chiusa prima di 2.4, che nasconde il form locale dalla vista standard — già avvenuto su questo progetto, vedi nota di debito su 2.8).

**Checklist**:
- Creare la route `/admin/login/local` (o percorso equivalente), non linkata da nessuna UI standard di Payload né dell'App.
- **Il progetto usa `disableLocalStrategy` sulla collection `users` (vedi 2.4)**: l'operazione nativa di login Payload è bloccata per l'intera collection, non disponibile nemmeno su questa route separata — implementarla con un endpoint custom secondo il pattern in `payload-pattern/04-auth-locale-con-sso-esclusivo.mdc`.
- Verificare che sia accessibile **solo** digitando l'URL direttamente, non tramite navigazione da `/admin/login`.
- Scrivere la nota operativa interna che documenta l'esistenza e lo scopo di questa route, per chi gestirà il sistema — coerente con la regola di documentazione obbligatoria. Senza questa nota, la route rischia di essere dimenticata proprio nel momento in cui serve davvero.

**Eseguito (2026-09-20)**: hook `beforeChange` PBKDF2-SHA256 in `lib/auth/localCredentials/`; verifica password in `verifyLocalPassword` contro `bootstrapCredentialHash`/`Salt` (non hash/salt standard); endpoint `POST /api/users/login/local` con `generatePayloadCookie` e richiamo esplicito hook `beforeLogin`/`afterLogin`; pagina `/admin/login/local` (form minimo, non linkata); `useSessions: false` su `users`. Nota operativa `docs/operativo/login-locale-emergenza-admin.md`. **Ridisegno ADR-004 (2026-09-20)**: ammissione endpoint via `bootstrapCredentialHash`; nessun rate-limit dedicato (lacuna preesistente, nota in operativo).

---

## 2.8 — Script di seed super-admin + guardrail

**Stato**: ✅ fatto

**Obiettivo**: primo super-admin creato in modo ripetibile, e i due vincoli minimi di sicurezza attivi.

**Dipende da**: 2.1 (schema `users`), 2.2 (il guardrail anti-lista-vuota richiede che il Global esista già).

**Checklist**:
- Scrivere uno script di seed che crei un utente super-admin locale (email + password fornite come parametri o variabili d'ambiente, non hardcoded nel codice sorgente).
- **Se il progetto usa un provider SSO per l'Area Admin (il caso di default)**: l'email del super-admin di bootstrap dev'essere un indirizzo realmente autenticabile con quel provider (es. per Google OAuth, un account Google reale del dominio Workspace già inserito in allow-list, 2.2) — non un placeholder. Il super-admin di bootstrap non è solo l'account per l'accesso locale di emergenza: è anche, di norma, il primo account con cui si verifica che l'SSO funzioni (2.4). *Su questo progetto si è deciso di tenere due identità separate — vedi nota di debito.*
- Implementare il vincolo: non è possibile eliminare o disattivare (`active = false`) l'ultimo super-admin locale rimasto — validazione applicativa sulla collection `users`.
- Implementare il vincolo: non è possibile salvare l'allow-list identità (Global, 2.2) se risulterebbe vuota.
- Implementare il vincolo: nessun altro utente Admin può essere creato con credenziali locali oltre al/ai super-admin di bootstrap — a livello di access control sulla collection.
- Non implementare elementi non richiesti dalla specifica del progetto (es. procedura "vetro da rompere" fuori applicazione, audit log dedicato per interventi di emergenza, differenziazione di processo tra ambienti per il seed) — coerente con `core/01-proporzionalita.mdc`.

**Eseguito (2026-09-16, aggiornato 2026-09-20)**: script `scripts/seed-super-admin.ts` (`pnpm seed:super-admin`) con email/password da env; crea super-admin con `loginMethod: sso` e credenziali emergenza in `bootstrapCredential*` (PBKDF2 via `hashLocalPassword`); idempotente se l'email è già bootstrap attivo (`bootstrapCredentialHash` presente). Migrazione record legacy: `pnpm migrate:bootstrap-credentials` (copia hash/salt → bootstrap, stessa password di emergenza). Guardrail ultimo bootstrap in `lib/auth/lastLocalSuperAdmin.ts` (criterio: `bootstrapCredentialHash`, delete / `active = false` / declassamento `adminRole`). Access control + `assertLocalPasswordAllowed`: nessun ruolo Admin con `loginMethod` locale o `password` sul profilo standard; App (`adminRole: none`) invariata. Nessun ramo seed diverso per ambiente.

**Chiuso in 2.2 — vincolo allow-list vuota (scelta b)**: implementato insieme allo schema del Global `settings`, non in questo passo.

**Debito riaperto (2026-09-20, da fix di catalogo)**, due punti distinti:

1. **Identità del seed** — **chiuso (2026-09-20)**: decisione **due identità separate** confermata in produzione dati. Il Gmail del seed resta solo emergenza locale (2.7); creato in `users` un secondo account `@vietnamonamour.com` (solo SSO) per l’Area Admin. Conferma umana: login Google su `/admin` OK.
2. **Hook di hashing mancante** — **chiuso (2026-09-20, con 2.7)**: hook `beforeChange` in `lib/auth/localCredentials/` + endpoint `/api/users/login/local` con verifica manuale. Il record seed esistente resta valido senza rigenerazione.

---

## 2.9 — Collection `activityLog` (eventi di autenticazione)

**Stato**: ✅ fatto

**Obiettivo**: log applicativo unico e condiviso tra Admin e App; eventi auth implementati: login, logout, accesso negato (con utente identificato).

**Dipende da**: 2.1 (schema minimo per lo hook `afterLogin`/`afterLogout`); per popolare correttamente `area`/`method` servono anche 2.4 e 2.5 già attive.

> **Meccanismo generale**: lo schema completo della collection `activityLog` e il pattern di popolamento via hook — inclusa la parte non legata all'auth (azioni CRUD su documenti, e perché non serve un log API separato: gli hook di collection intercettano già Local API/REST/GraphQL/Admin allo stesso modo) — sono definiti una volta sola in `payload-pattern/03-log-azioni.mdc`, non ripetuti qui. Questa sottofase **istanzia** quel meccanismo per gli eventi di autenticazione: i primi, e per questa fase gli unici, ad essere attivati.
>
> **Dipendenza non ancora validata**: `payload-pattern/03-log-azioni.mdc` ha `stato: bozza` — non ha ancora superato la revisione standard (Composer + verifica meccanica). Lo schema sotto è affidabile per la parte auth (già in uso), ma verificare lo stato corrente del file prima di considerarlo un riferimento assestato per le parti non-auth.

**Checklist**:
- Creare la collection `activityLog` secondo lo schema generale di `payload-pattern/03-log-azioni.mdc` (non `loginEvents` — nome scelto per accogliere altri eventi futuri senza migrazione di schema). Per questa sottofase servono solo i campi lato auth dello schema: `user` (relationship a `users`), `timestamp` (automatico), `area` (select: admin/app, opzionale), `eventType` (login/logout/accessDenied), `method` (select: sso/local).
- Popolare `activityLog` dall'hook `afterLogin` della collection `users` — si attiva indipendentemente da quale istanza/area ha autenticato, perché vive sulla collection e non sulla singola istanza del plugin/provider.
- Popolare logout da hook `afterLogout`; accessi negati quando l'utente è identificato in `users`.
- `area` e `method` derivano dal contesto della strategia/istanza che ha autenticato (identificatori distinti tra le istanze, 2.4/2.5, forniscono già questa informazione).
- **2.6/2.7 useranno endpoint custom** (per via di `disableLocalStrategy`, vedi `payload-pattern/04-auth-locale-con-sso-esclusivo.mdc`): gli hook `afterLogin`/`afterLogout` non scattano da soli su quel percorso — verificare che l'endpoint li richiami esplicitamente, altrimenti `activityLog` resta silenziosamente incompleto per quei login.
- **Non attivare ancora** i campi `collection`/`documentId` dello schema generale, né agganciare hook di logging ad altre collection: restano fuori scope finché una specifica di progetto non richiede esplicitamente di tracciare azioni CRUD su una collection specifica — coerente con `core/01-proporzionalita.mdc` (vedi `payload-pattern/03-log-azioni.mdc`, sezione "Attivazione: decisione di progetto, non default"). Non è un'omissione silenziosa: è la stessa distinzione meccanismo/attivazione descritta lì, applicata qui.

**Eseguito (2026-09-20)**: collection `activity-log` in `collections/ActivityLog.ts` (schema `payload-pattern/03-log-azioni.mdc`, campi CRUD presenti ma non popolati); scrittura centralizzata in `lib/activityLog/logActivity.ts`; hook `afterLogin`/`afterLogout` su `users` (`lib/activityLog/userAuthHooks.ts`); `area`/`method` da `_strategy` Payload o contesto OAuth; accessi negati con utente censito in callback Google (`lib/auth/googleOAuth/callbackEndpoint.ts`) e login locale Admin (`lib/auth/localLogin/endpoint.ts`). Logout via operazione Payload nativa coperto da `afterLogout`; endpoint custom 2.6 dovranno richiamare gli hook come già fa 2.7 per `afterLogin`.

---

## 2.10 — Spike di test end-to-end con credenziali reali

**Stato**: ✅ fatto

**Obiettivo**: conferma pratica, non solo di codice, che il flusso di login funziona davvero nell'ambiente reale.

**Dipende da**: 2.1–2.9 (tutte le sottofasi precedenti).

**Checklist**:
1. Avviare l'app in locale con le due istanze del provider SSO configurate (Admin e App).
2. Creare un record utente in `users` con identità reale, ruolo admin o super-admin (o richiedere all'umano di indicarne uno esistente).
3. Login SSO su `/admin`: verificare autenticazione riuscita e che il cookie autentichi anche una chiamata REST (es. endpoint utente corrente).
4. Ripetere lo stesso su `/app` (istanza separata).
5. Login locale su `/app` con un utente locale di test.
6. Tentativo con un'identità non autorizzata (fuori allow-list) → verificare rifiuto con messaggio generico. Per il dettaglio di come si presenta questo scenario nel provider scelto, vedi il file di variante auth.
7. Ripetere i punti rilevanti sull'ambiente di produzione, per verificare il comportamento del cookie httpOnly su HTTPS dietro proxy/load balancer, prima del rilascio definitivo — **da eseguire in Fase 3** (§ 3.3), non qui: non bloccante per chiudere Fase 2.

**Non serve** un framework di test automatizzato per questo spike: è manuale, una tantum, in fase di sviluppo — non va rimandato al deploy né trasformato in un'infrastruttura di test permanente (coerente con `core/01-proporzionalita.mdc`).

**Eseguito (2026-09-21, dev locale)**:

- SSO `/admin` e `/app` con account Workspace in allow-list: cookie `payload-token` valido; `/api/users/me` con `strategy`/`_strategy` coerenti (`google-admin` vs `google-app`) dopo fix claim JWT `strategy` e plugin `patchUsersAuthStrategiesPlugin` (prima del fix, entrambe le istanze payload-oauth2 accettavano lo stesso JWT e vinceva sempre `google-admin`).
- Rifiuto in-app: account `@vietnamonamour.com` non censito → messaggio generico su Admin e App. Con OAuth GCP **Internal**, identità fuori organizzazione (es. `@dude.it`) viene bloccata da Google (`403 org_internal`) **prima** del callback — perimetro aggiuntivo, non sostituto del test allow-list lato app.
- Login locale App (regressione): 302 `/app`, sessione valida; matrice casi A–E e CRUD (create/update/delete) verificata in sequenza (Local API + HTTP).
- Forgot/reset password App: `POST /forgot-password/app` → `forgot?sent=1`; reset con utente reale verificato a mano; fix `passwordConfirm` sull’endpoint reset (allineamento hook `beforeValidate`); token monouso e assenza campi sensibili in read verificati.
- Punto checklist **7** (cookie HTTPS in produzione): **rimandato a Fase 3** § 3.3, esplicitamente non chiuso qui.
- Utenti di test `*@spike.local` creati durante lo spike: eliminati dal DB (inclusi log `activity-log` collegati).

---

## Note di chiusura fase

Al termine della Fase 2, prima di iniziare `fase-3-deploy.md`:
- [x] Sottofasi 2.1–2.10 marcate ✅ in questo file e in `00-piano-generale.md` (punto 7 di 2.10 rimandato a Fase 3 § 3.3, segnalato esplicitamente in § 2.10 sopra).
- [ ] Segnalare esplicitamente qualunque deviazione dal piano avvenuta durante l'esecuzione (es. un fix non previsto, un comportamento diverso da quello atteso in una libreria/plugin), così da tenerne conto nelle fasi successive.
- [ ] Verificare che nessun test dev pendente sia rimasto "in sospeso silenzioso": se qualcosa è stato rimandato a Fase 3, deve essere esplicitamente scritto in `fase-3-deploy.md`, non solo nella cronologia della chat.

Fuori scope di Fase 2 (salvo diversa indicazione della specifica di progetto): enforcement permessi per singola sezione App, evoluzione futura del provider SSO (es. cambio di modalità o migrazione a un provider diverso), eventType di `activityLog` non legati all'autenticazione — schema e meccanismo generale per estenderli sono già pronti in `payload-pattern/03-log-azioni.mdc`, ma attivarli su una collection specifica resta una decisione di progetto esplicita, non implicita in questo file.

## Incoerenze note

*(Nessuna al momento. Sezione per segnalare esplicitamente contraddizioni o ambiguità non risolte tra questo file e altri — vedi `processo-v2-operativo.md` §3, Balzer 1991.)*
