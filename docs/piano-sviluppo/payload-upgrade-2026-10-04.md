# Aggiornamento di Payload: 3.x più recente e preparazione alla 4

**Data dell'analisi:** 2026-10-04
**Ambito:** sola analisi, nessuna modifica al repository. Le prove sono state fatte in cloni separati fuori dal repo (HEAD `bb95fda` di `main`).
**Stato di partenza:** `payload` e tutti i `@payloadcms/*` a `3.89.0` esatta; Next 16.3.5; React 19.2.8; `payload-oauth2` 1.0.21; `jose` 5.9.6; `graphql ^17.0.2`; Node 24; pnpm 11.18.0.

## 0. Sintesi

| Domanda | Risposta |
|---|---|
| Ultima 3.x stabile | **3.90.2**, 2026-09-23 |
| Aggiornare? | **Sì**, a 3.90.2, con le condizioni del § 1.6 |
| Avvisi di sicurezza tra 3.89.0 e 3.90.2 | Sì: la 3.90.0 contiene «critical security fixes». Identificativi GHSA/CVE non recuperati (§ 1.2) |
| La migrazione generata è vuota? | **No**: aggiunge una colonna `reset_password_requested_at` a `users` (§ 1.3) |
| Esiste una 4? | **Solo come canary**: `4.0.0-canary.37`, 2026-09-24. Nessuna beta, RC o stabile (§ 2.1) |
| Quando migrare alla 4 | Dopo le Fasi 7, 8 e 6 e solo con una RC o stabile (§ 2.5) |

## 1. Parte 1: aggiornamento alla 3.x più recente

### 1.1 Versione

Versioni stabili tra la nostra e l'ultima (date di pubblicazione su npm):

| Versione | Data |
|---|---|
| 3.89.0 | 2026-09-10 |
| 3.90.0 | 2026-09-18 |
| 3.90.1 | 2026-09-18 |
| 3.90.2 | 2026-09-23 |

Il dist-tag `latest` di `payload` su npm è `3.90.2`. Il tag `canary` è `4.0.0-canary.37` e il tag `beta` è fermo a `3.0.0-beta.135`, quindi nessun rischio di confondere una pre-release con la stabile.

Contenuto delle release:

- **3.90.0:** sicurezza e rotture, vedi sotto.
- **3.90.1:** correzione sulle query `where` nei campi relationship annidati, più due modifiche di manutenzione (template, telemetria).
- **3.90.2:** correzioni in `next` (`trailingSlash`, un `include` libsql non valido) e in alcuni plugin; nessuna rottura.

### 1.2 Sicurezza tra 3.89.0 e 3.90.2

- La [release 3.90.0](https://github.com/payloadcms/payload/releases/tag/v3.90.0) è dichiarata «critical security fixes» e consiglia di aggiornare anche se nessuna voce elencata ci riguarda. Il [post del 2026-09-18](https://payloadcms.com/posts/blog/payload-security-update-available-for-3x-and-40) dice che sono stati pubblicati avvisi di sicurezza per 3.90.0 e 4.0.0-canary.34, con versioni colpite, severità e impatto in ciascuno.
- **Limite:** non sono riuscito a recuperare gli identificativi GHSA/CVE di quegli avvisi. La pagina advisory raggiungibile era una copia vecchia (fermava al 27 agosto) e OSV non li elencava ancora. Le severità singole quindi **non sono verificate**. Le note di release omettono volutamente i dettagli di exploit.
- Altri avvisi trovati su OSV, per completezza:
  - `CVE-2026-93363` (storage-vercel-blob, 25/9): non usiamo quell'adapter.
  - `GHSA-jg8r-5jh2-v2xj` / `CVE-2026-11779` (sblocco account): per OSV l'ultima versione colpita è la 3.88.0.
- **Conseguenza per il piano:** il vincolo hard «Payload >= 3.73.0 (CVE-2026-25544)» in `piano.yaml` (`meta.vincoli_hard`) va alzato a **>= 3.90.0**.

### 1.3 Cambiamenti che ci toccano

**Schema (verificato).** La 3.90.0 aggiunge il campo `resetPasswordRequestedAt` alle collection con auth. Nel nostro progetto la colonna compare anche con `disableLocalStrategy: { enableFields: true }`. `payload migrate:create` su un DB con le migrazioni attuali ha generato:

```sql
ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
```

La `down` fa `DROP COLUMN`. La colonna è nullable e la modifica è additiva. `payload-types.ts` cambia di 2 righe (`resetPasswordRequestedAt?: string | null` in `User` e in `UsersSelect`).

**Rotture dichiarate nelle note 3.90.0 e relativo effetto su di noi** (letto nel codice del repo, non provato a runtime salvo dove indicato):

| Voce delle note | Ci riguarda? |
|---|---|
| Password reset azzera i lockout, forgot-password rallentato (nuovo campo) | Sì per lo schema (sopra). I nostri endpoint `forgot-password`/`reset-password` scrivono i token direttamente con `payload.update`, quindi è probabile che il nuovo throttling non li copra: da provare |
| Cambio password revoca le altre sessioni | Non pertinente: `useSessions: false` |
| Scheduled publish, upload, SVG/XML, client upload, Azure, `skipSafeFetch`, fetch di file esterni, tetto multipart 50 MB, Form Builder, join polimorfici | No: nessun uso nel repo |
| API key non leggibili dopo la generazione | No: nessun `useAPIKey` |
| Lexical da 0.41 a 0.50 (nel lockfile) | Solo se avremo funzioni Lexical custom; oggi `lexicalEditor()` è usato senza personalizzazioni |

**Intersezione con la 3.89.0 (già nostra):** la 3.89.0 ha già backportato le modifiche ai default di accesso dei job. Non usiamo i job.

**Verifica aggiuntiva, nuova rispetto alle note di release.** Nel codice installato di 3.90.2 la strategia JWT integrata di Payload (`auth/strategies/jwt.js`) rifiuta i token privi di `authVersion: 1` nell'header protetto, e `jwtSign` lo aggiunge. Nella 3.89.0 questo controllo non c'è. Le nostre strategie isolate (`lib/auth/jwt/isolatedJwtAuthStrategies.ts`) verificano il token con `jose` e **non** controllano l'header. Conseguenze (deduzione, non provata a runtime):

- I token già emessi dalla 3.89.0 dovrebbero restare accettati dalle nostre strategie; la strategia integrata di Payload li rifiuterebbe. Con `tokenExpiration` di 7200 s, il caso dura al massimo due ore.
- Il nostro codice non usa `saveToJWT` (grep nel repo), quindi lo scenario che il controllo mira a impedire non si applica oggi. Resta consigliabile far controllare `JWT_AUTH_VERSION` (esportato da `payload` in 3.90.2) anche alle strategie isolate, perché la Parte 2 mostra che la 4 lo richiede.

### 1.4 Compatibilità

| Componente | Requisito di 3.90.2 (da npm) | Nostra versione | Esito |
|---|---|---|---|
| Next (`@payloadcms/next`) | `>=16.3.3 <17.0.0` (più intervalli per 15.x) | 16.3.5 | compatibile |
| React (`richtext-lexical`, plugin-seo) | `^19.0.1 \|\| ^19.1.2 \|\| ^19.2.1` | 19.2.8 | compatibile |
| Node (`engines` di `payload`) | `^18.20.2 \|\| >=20.9.0` | 24 | compatibile |
| `payload-oauth2` | peer `payload ^3` (ultima su npm: 1.0.21, 2026-05-12) | 1.0.21 | compatibile sulla carta; provato solo il caricamento (vedi 1.5) |
| `graphql` | peer `^16.8.1` | `^17.0.2` | **peer non soddisfatto**, identico anche con la 3.89.0; non introdotto dall'aggiornamento |
| `@payloadcms/plugin-seo`, `plugin-redirects` (Fase 4.2) | versione 3.90.2 disponibile, peer `payload 3.90.2` e React come sopra | non installati | da installare allineati a 3.90.2 |

### 1.5 Prove nel clone

Ambiente: Node 24.21.0, pnpm 11.18.0, PostgreSQL **16** locale (produzione: 18, Cloud SQL), variabili fittizie (`PAYLOAD_SECRET`, `DATABASE_URL`, `APP_PUBLIC_URL`, `GOOGLE_CLIENT_*`, `RESEND_*`). Il baseline è il clone della 3.89.0 provato nelle stesse condizioni.

| Prova | Baseline 3.89.0 | 3.90.2 |
|---|---|---|
| `pnpm install` | OK (`--frozen-lockfile`) | OK (lockfile aggiornato: +464/−265 righe) |
| `pnpm peers check` | solo `graphql` | solo `graphql` (identico) |
| `next typegen` + `tsc --noEmit` | exit 0 | exit 0 |
| `generate:types` | diff zero rispetto al file committato (solo con le variabili OAuth fittizie impostate) | +2 righe (`resetPasswordRequestedAt`) |
| `payload migrate` sulle migrazioni esistenti | OK | OK |
| `migrate:create` | n/d | migrazione di una colonna (§ 1.3) |
| `migrate`, `migrate:down`, `migrate` | n/d | tutte e tre OK; la colonna sparisce e ricompare |
| `next build` | OK | OK, 12 pagine, TypeScript di Next senza errori |
| Avvio del build e risposte HTTP (`/admin`, `/admin/login`, `/app/login`, `/api/users/me`, `/api/access`, 403 anonimi su `/api/users`, `/api/globals/settings`, `/api/activity-log`, login locale) | codici e corpi identici | codici e corpi identici |
| `payload run` (`seed:super-admin`) | non eseguito | OK, crea l'utente tramite gli hook; eseguito con `NODE_ENV` non production, quindi con push dello schema attivo |

**Nota sulla build.** Il sandbox non raggiunge `fonts.googleapis.com` (HTTP 403), quindi il primo tentativo di build è fallito su `next/font/google`. Nei due cloni ho sostituito le chiamate `Geist`/`Geist_Mono` dei layout con oggetti fissi (stesse variabili CSS). Il repo non è stato toccato. Sulla pipeline reale (Cloud Build) la rete c'è e questo passaggio non serve.

**Che cosa non si può provare senza database o credenziali reali (e non l'ho provato):**

- Flussi Google OAuth (due istanze `google-admin` e `google-app`) e callback.
- Invio email con Resend (attivazione, reset): con credenziali fittizie non si possono eseguire; i flussi `forgot-password` e `reset-password` non sono stati percorsi.
- Login locale con un utente vero, emissione e verifica di un cookie JWT.
- PostgreSQL 18 e Cloud SQL (provato su PostgreSQL 16 locale).
- Cloud Build, immagine Docker standalone, Cloud Run.
- Query e hook su `localization` con contenuti veri; la Local API con `overrideAccess: false` e l'accesso a livello di campo, che finora hanno poco codice nel repo (le collection di dominio non esistono ancora).
- Endpoint `/api/graphql`.

### 1.6 Conclusione

**Possiamo aggiornare a 3.90.2: sì**, alle condizioni seguenti.

1. La build su Cloud Build (placeholder del Dockerfile) passa.
2. La migrazione `add-reset-password-requested-at` viene generata, riletta (deve contenere solo l'`ADD COLUMN`) e committata prima del deploy.
3. In sviluppo, con Postgres e credenziali di prova, si percorrono almeno: login Admin Google, login locale App, attivazione, forgot e reset password.
4. Si decide se far verificare `authVersion` alle strategie isolate (consigliato; non è un blocco).

Rischio residuo: i flussi di § 1.5 non provati, in particolare quelli di email e OAuth.

### 1.7 Piano per Cursor

**Passi (un ramo, un commit dopo la verifica a runtime):**

1. In `package.json`: `payload` e `@payloadcms/db-postgres`, `email-resend`, `next`, `richtext-lexical`, `translations`, `ui` a `3.90.2`, versioni esatte. Nessun altro pacchetto cambia.
2. `pnpm install` e commit del `pnpm-lock.yaml` (Cloud Build usa `--frozen-lockfile`).
3. Con `APP_PUBLIC_URL`, `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` impostati, `pnpm generate:types`. Atteso: solo 2 righe in `payload-types.ts`.
4. Su un DB locale con le migrazioni già applicate: `pnpm migrate:create add-reset-password-requested-at`, poi `pnpm migrate`. Atteso: un solo `ALTER TABLE "users" ADD COLUMN`. Se compare altro, fermarsi.
5. `pnpm exec next typegen`, `pnpm exec tsc --noEmit`, `pnpm build` con i placeholder del Dockerfile.
6. Verifica a runtime in sviluppo (condizione 3 del § 1.6).
7. In `piano.yaml` e `00-piano-generale.md`: alzare il vincolo hard a `>= 3.90.0`; voce in `CHANGELOG.md` (§ `[Unreleased]` → `Changed`).

**Produzione:**

1. `pnpm payload migrate` da locale su Cloud SQL, via proxy (procedura di `scripts/prod-db.sh`), **prima** del deploy.
2. Deploy con Cloud Build.
3. Dopo il deploy, un login Google e un login locale reali.

**Ripristino:**

- Applicativo: ridistribuire la revisione precedente di Cloud Run. La 3.89.0 funziona con la colonna presente (additiva, nullable).
- Schema: lasciare la colonna oppure `pnpm payload migrate:down` (verificato sul DB di prova).
- Sessioni: i token emessi dalla 3.90.2 portano l'header `authVersion`; con la 3.89.0 il campo extra dell'header non è usato (da provare).

**Dove registrarlo nel piano** (proposta, da confermare): un nodo `fase-7.0` in `piano.yaml` (`origine: dominio-applicativo`, stato `da_fare`), inserito in `meta.ordine_esecuzione` prima di `fase-7`, con questo file come riferimento. Nessun ADR nuovo: l'aggiornamento resta nella stessa linea 3.x, non è un arco di decisione. Le Fasi 7, 8 e 6 partono dopo il commit.

## 2. Parte 2: preparazione alla 4

### 2.1 Esiste una 4 e in che stato

- **Sì, solo come canary.** Su npm esistono 38 versioni `4.0.0-canary.N`, dalla `canary.0` (2026-06-04) alla `canary.37` (2026-09-24), più build `4.0.0-internal.*`. Il dist-tag `canary` punta a `4.0.0-canary.37`.
- **Non ci sono** beta, RC o stabile della 4.
- **Non ho trovato una data di uscita ufficiale.**
- Esiste una [guida ufficiale 3.0 → 4.0](https://github.com/payloadcms/payload/blob/main/docs/migration-guide/v4) nel ramo `main` (letta da un clone sparse, commit `15d051b`, 2026-10-02). Sull'overview di `main` è già elencata come percorso di aggiornamento.
- Le note di `canary.37` e della 3.89.0 sono nelle [release di GitHub](https://github.com/payloadcms/payload/releases). Le stesse correzioni di sicurezza della 3.90.0 sono state pubblicate in `4.0.0-canary.34`.

### 2.2 Requisiti della 4 (dalla guida ufficiale)

| Requisito | Nostro stato |
|---|---|
| Node ≥ 24.15.0 | Node 24.x: da verificare la patch del Dockerfile (`node:24-alpine`) |
| Next ≥ 16.2.6 | 16.3.5: ok |
| **TypeScript ≥ 6.0.3** | `typescript ^5` (installato 5.9.3): **da cambiare** |
| Codemod `npx @payloadcms/codemod` | Disponibile |

### 2.3 Rotture annunciate e impatto sul progetto

La colonna «Stato» indica se ho letto la sezione (L) o solo l'intestazione (I) della guida.

| Rottura nella guida | Impatto sulle nostre funzioni | Stato |
|---|---|---|
| `overrideAccess` diventa `false` di default nella Local API (anche per `payload.jobs.*`) | Alto: le Fasi 7, 8 e 6 usano la Local API; ogni chiamata senza l'opzione cambia comportamento. Nessun errore di compilazione | L |
| `TypedUser` → `User`; `UntypedUser` e `ClientUser` rimossi; `User` senza firma di indice; `req.user` è `AuthenticatedUser` | Alto: il codice usa `TypedUser` e fa cast sui campi custom (`adminRole`, `appRole`, …) | L |
| JWT con `authVersion: 1` nell'header; token senza il marker rifiutati; token rifiutato se la collection ha `disableLocalStrategy` abilitato | **Incerto**: `Users` ha `disableLocalStrategy: { enableFields: true }` e strategie custom basate su `jose`. Se la forma a oggetto conta come «abilitato», i token locali sarebbero rifiutati | L (la frase sulla forma a oggetto è un'interpretazione mia) |
| Versioni attive di default su collection e global (le auth escluse) | Medio: ogni collection di dominio nuova ottiene tabelle `_versions` e una migrazione, salvo `versions: false` | L |
| Authorship (`createdBy`/`updatedBy`) attivo di default | Medio: aggiunge relazioni a ogni collection e ai plugin che non rinunciano (anche `plugin-redirects` della Fase 4.2) e richiede migrazioni | L |
| Profondità di default da 2 a 1 (`defaultDepth: 2` per conservare) | Medio: le query senza `depth` esplicito popolano meno relazioni | L |
| Lettura delle versioni eredita il `read` della collection | Basso oggi (nessuna collection pubblica con versioni) | L |
| `bin` → `cli.commands` | Medio: usiamo `payload run <script>`. Non ho verificato se `payload run` esiste ancora nella 4 | L (sezione `bin`); `payload run` non verificato |
| `migrateCLI` rimosso | Basso: usiamo i comandi `payload migrate*` | L |
| Lexical da 0.41 a 0.52, rimozione di `lexicalHTML`/`HTMLConverterFeature`, `jsonSchema` al posto di `typescriptSchema`, forma di `payload-types.ts` cambiata, ogni block genera un'interfaccia | Medio-basso: dipende da funzioni Lexical custom e dai tipi generati | I |
| Storage adapter sotto `storage`, upload via endpoint condiviso | Non rilevante finché non usiamo upload (storage dei media è aperto in Fase 4.2) | I |
| `localization.defaultLocalePublishOption` rimosso, pubblicazione sul locale attivo | Basso: oggi nessuna collection con bozze | I |
| `min`/`max` rimossi da relationship e upload, `allowLocalizedWithinLocalized` rimosso, `abortOnLimit` di default `true` | Da evitare nei nuovi campi | I |
| API key: sha1 rimosso, nuovo `apiKeyLast4`, `enableAPIKey` rimosso | Non rilevante: nessun `useAPIKey` | I |
| Hook `afterOperation`: `operation: 'read'` rimosso | Da evitare in nuovi hook | I |
| `useLocale` può restituire `null`; `next/navigation` sostituito da `RouterAdapter`; `@payloadcms/next/{client,rsc,templates}` rimossi | Solo se useremo componenti Admin custom con questi hook; `AppLocalPasswordField` e `AdminGoogleLoginBefore` esistono già | I |

### 2.4 `payload-oauth2` e la 4

- Il pacchetto dichiara `payload ^3` come peer e l'ultima versione su npm è la 1.0.21 (2026-05-12). **Non ho trovato nulla** (release, issue, note) che dica che supporterà la 4.
- Il nostro `patchUsersAuthStrategiesPlugin` e le strategie isolate dipendono dal comportamento interno del plugin (nomi delle strategie, forma del JWT, campo `sub`). Una 4 con `authVersion` obbligatorio e tipi di utente nuovi rende probabile che serva lavoro su questo punto. È una deduzione, non una verifica.
- Un'[esercitazione di terzi su canary.37](https://github.com/lolevbeer/site/pull/205) (fonte non ufficiale) conclude «aspettare beta o RC» e segnala modifiche all'interfaccia utente non documentate.

### 2.5 Che cosa fare oggi in 3.x e quando migrare

**Da fare già nelle Fasi 7, 8 e 6** (costo basso, evita il lavoro di bonifica dopo):

1. **Passare sempre `overrideAccess` esplicito** in ogni chiamata Local API (`true` per script e seed, `false` con `user` quando si agisce per conto di un utente). Questo evita il cambio silenzioso della 4.
2. **Passare sempre `depth` esplicito** nelle query.
3. **Dichiarare `versions` esplicito** (`false` o la configurazione voluta) su ogni collection e global nuovo; valutare `authorship: false` solo dopo aver verificato che la proprietà esiste già in 3.x (non verificato).
4. **Usare un solo alias di tipo utente** in `lib/` (ad esempio `type AppUser = ...`) invece di importare `TypedUser` ovunque, così la sostituzione con `User`/`AuthenticatedUser` avviene in un punto.
5. **Non usare API che la guida segnala come rimosse** (I, non lette in dettaglio): `useAPIKey`, `lexicalHTML`/`HTMLConverterFeature`, `typescriptSchema`, `allowLocalizedWithinLocalized`, `min`/`max` su relationship e upload, `afterOperation` con `operation: 'read'`.
6. **Registrare ogni script come file separato con `payload run`** e non aggiungere `config.bin`.

**Quando migrare.** Dopo che le Fasi 7, 8 e 6 sono chiuse, e solo quando esiste una RC o una stabile della 4, perché oggi:

- non c'è una beta o RC;
- `payload-oauth2` non dichiara supporto;
- c'è l'incognita sul JWT con `disableLocalStrategy`.

Prima di allora, una prova su ramo con la canary per chiudere le due incognite (JWT e `payload-oauth2`). Proposta: un punto aperto `po-10` in `piano.yaml`, con scadenza «prima di avviare la migrazione alla 4» e registrazione in un ADR di progetto.

## 3. Tabella verificato / dedotto

| # | Affermazione | Stato | Base |
|---|---|---|---|
| 1 | 3.90.2 è l'ultima stabile, 2026-09-23 | Verificato | dist-tag `latest` su npm; release di GitHub |
| 2 | Versioni intermedie 3.90.0 (18/9), 3.90.1 (18/9) | Verificato | npm, release di GitHub |
| 3 | La 3.90.0 contiene correzioni di sicurezza critiche | Verificato | Note di release, post del 18/9 |
| 4 | Severità e identificativi GHSA/CVE della 3.90.0 | **Non verificato** | Non recuperati |
| 5 | Migrazione generata: una colonna in `users`, non vuota | Verificato | `migrate:create` su Postgres 16 di prova |
| 6 | Migrazione applicabile, annullabile e riapplicabile | Verificato | `migrate`, `migrate:down`, `migrate` su Postgres 16 |
| 7 | La 3.89.0 funziona con la colonna presente | Dedotto | Colonna additiva e nullable; non provato |
| 8 | Next 16.3.5 e React 19.2.8 compatibili | Verificato (peer) + build | peer di npm; `next build` OK |
| 9 | `payload-oauth2` 1.0.21 compatibile | Dedotto | peer `payload ^3`; caricamento del plugin non rotto nella build e nell'avvio; flussi OAuth non provati |
| 10 | Peer `graphql ^16.8.1` non soddisfatto con `^17` | Verificato | `pnpm peers check`; identico a 3.89.0 |
| 11 | Build e tipi OK su 3.90.2 | Verificato | `tsc`, `generate:types`, `next build` nei cloni (con font stubbate nel sandbox) |
| 12 | Risposte HTTP identiche tra 3.89.0 e 3.90.2 sulle route provate | Verificato | Probe delle route elencate in § 1.5 |
| 13 | `payload run` funziona su 3.90.2 | Verificato | `seed:super-admin` nel clone |
| 14 | Le rotture di 3.90.0 su upload, storage, API key, Form Builder, join non ci toccano | Dedotto | Lettura del repo (nessun uso); non provato |
| 15 | Gli endpoint custom `forgot-password`/`reset-password` non ricevono il nuovo throttling | **Dedotto** | Scrivono direttamente i token con `payload.update`; non provato |
| 16 | 3.90.2 rifiuta, nella strategia integrata, i JWT senza `authVersion`; la nostra strategia isolata non lo controlla | Verificato (codice) / Dedotto (conseguenze) | `node_modules/payload/dist/auth/strategies/jwt.js`; effetto sulle sessioni non provato |
| 17 | La 4 esiste solo come canary (ultima `canary.37`, 24/9) | Verificato | npm |
| 18 | Requisiti della 4: Node ≥ 24.15.0, Next ≥ 16.2.6, TypeScript ≥ 6.0.3 | Verificato | Guida ufficiale (`v4.mdx`) |
| 19 | Rotture della 4 su `overrideAccess`, tipi utente, versions, authorship, depth, JWT, CLI | Verificato (lettura) | Guida ufficiale (sezioni lette); impatto su di noi dedotto |
| 20 | `disableLocalStrategy: { enableFields: true }` potrebbe far rifiutare i token nella 4 | **Dedotto** | Interpretazione della guida; da provare sulla canary |
| 21 | `payload run` esiste ancora nella 4 | **Non verificato** | Guida: `bin` → `cli.commands` |
| 22 | `payload-oauth2` non ha supporto dichiarato per la 4 | Verificato (assenza di prove) | npm: peer `^3`; nessuna nota trovata. La compatibilità reale è sconosciuta |
| 23 | `authorship` esiste già in 3.x | **Non verificato** | Il controllo sui tipi di 3.90.2 non ha dato risultato (la mia ricerca ha restituito nulla) |
| 24 | Voci «I» della tabella 2.3 (lettura solo dell'intestazione) | Non verificato nel dettaglio | Guida ufficiale, solo titoli |

## 4. Fonti

- npm: <https://registry.npmjs.org/payload> (versioni, date, dist-tag, peer), `@payloadcms/next`, `richtext-lexical`, `db-postgres`, `email-resend`, `plugin-seo`, `plugin-redirects`, `payload-oauth2`, `next`, `react`.
- Release 3.90.0: <https://github.com/payloadcms/payload/releases/tag/v3.90.0>
- Release 3.90.1: <https://github.com/payloadcms/payload/releases/tag/v3.90.1>
- Release 3.90.2: <https://github.com/payloadcms/payload/releases/tag/v3.90.2>
- Elenco release (incluse 4.0.0-canary.37 e 3.89.0): <https://github.com/payloadcms/payload/releases>
- Avviso di sicurezza: <https://payloadcms.com/posts/blog/payload-security-update-available-for-3x-and-40>
- Pagina advisory del repo (copia obsoleta): <https://github.com/payloadcms/payload/security/advisories>
- OSV: <https://osv.dev/vulnerability/payload> e <https://osv.dev/vulnerability/GHSA-jg8r-5jh2-v2xj>
- Guida di migrazione 3.0 → 4.0: <https://github.com/payloadcms/payload/blob/main/docs/migration-guide/v4> (file `docs/migration-guide/v4.mdx`, commit `15d051b`)
- Prova di terzi su canary.37 (non ufficiale): <https://github.com/lolevbeer/site/pull/205>
- Codice installato di `payload@3.90.2` (`dist/auth/strategies/jwt.js`) nel clone di prova.
