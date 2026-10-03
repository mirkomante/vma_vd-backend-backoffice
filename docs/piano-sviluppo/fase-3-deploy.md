---
stato: validato
---

# Fase 3 — Deploy

> Dettaglio operativo. Riferimenti: `fase-1-setup.md` § 1.3 (percorso DB locale → produzione — vedi anche il file di variante DB); lo spike cookie produzione (§ 3.3) è già descritto qui e nel file di variante auth, non richiede una specifica di progetto dedicata salvo deviazioni. Riferimento comportamentale: tutte le regole in `.cursor/rules/`, in particolare `core/01-proporzionalita.mdc`, `core/02-processo-lavoro-agente.mdc`, e i file di variante DB/cloud/auth scelti per questo progetto.

Aggiornare lo stato di ogni sottofase qui sotto e in `00-piano-generale.md` non appena completata.

**Prerequisito**: Fase 2 chiusa (✅ su tutte le sottofasi in `fase-2-login.md`, salvo rimandi espliciti documentati).

**Rimando da Fase 2 § 2.10**: lo spike di login in **produzione** (comportamento del cookie httpOnly su HTTPS dietro proxy/load balancer) va eseguito qui, in § 3.3, non in Fase 2. Non esiste un ambiente di staging separato: un solo deploy, quello di produzione — terminologia uniformata di conseguenza in tutto questo file e in `00-piano-generale.md`.

**Ordine di dipendenza reale** (diverso dall'ordine numerico — utile per sapere cosa può partire subito):
- § 3.1 (database di produzione) e la Parte A di § 3.2 (build del container) non dipendono da nulla, possono partire subito e in parallelo.
- Il resto di § 3.2 (secret e configurazione/deploy sull'ambiente cloud scelto) dipende da § 3.1 completata (serve la connection string).
- § 3.3 (auth in produzione) dipende dall'URL pubblico assegnato dal deploy in § 3.2.
- § 3.4 (bootstrap) dipende solo dal database raggiungibile (§ 3.1); può iniziare in parallelo a § 3.3.
- § 3.5 (verifica chiusura) dipende da § 3.2, 3.3 e 3.4 tutti completati.

---

## 3.1 — Database di produzione

> **Sottofase a variante (database).** Le istruzioni operative dipendono dal database scelto. Seguire il file corrispondente, poi tornare qui:
> - MongoDB → `fase-3-db-mongodb.md`
> - PostgreSQL → `fase-3-db-postgres.md` *(quando disponibile nel catalogo)*

**Stato**: ✅ fatto (2026-09-29)

**Obiettivo**: istanza di produzione del database pronta, sostituta di quella locale, con region e rete allineate alle scelte prese per l'ambiente cloud (§ 3.2).

**Checklist di chiusura sottofase (valida per qualunque variante — verificare dopo aver seguito il file di variante)**:
- [x] La connection string di produzione è pronta, non annotata in chiaro da nessuna parte — andrà direttamente nel gestore di secret dell'ambiente cloud scelto (§ 3.2).
- [x] `.env.example` aggiornato con un commento che indica Cloud SQL / produzione (nessuna credenziale reale nel file).
- [x] Migrazioni Payload committate **e** applicate su Cloud SQL prod (`migrations/`, `pnpm payload migrate` via Auth Proxy su `127.0.0.1:5433` — vedi `docs/operativo/cloud-sql-produzione.md`).

---

## 3.2 — Build container, secret e deploy

**Stato**: ✅ fatto (2026-10-03) — URL pubblico prod: **`APP_PUBLIC_URL`** a runtime (emendamento post-deploy § 3.3; vedi `docs/operativo/app-public-url.md`)

**Obiettivo**: immagine container funzionante, secret configurati con accesso scoped, servizio raggiungibile con pipeline di deploy continuo attiva.

### Parte A — Build del container (agente, indipendente dal resto, può partire subito)

**Checklist**:
- [x] Scrivere `Dockerfile` multi-stage e `.dockerignore` secondo lo standard fisso del progetto (vedi `stack/01-stile-codice.mdc`) — non è specifico di questa fase, è già una convenzione dello stack.
- [x] Verificare che la build di produzione passi (`tsc --noEmit`, `lint`, `build`) in locale prima di affidarsi alla pipeline cloud per scoprire eventuali errori.
- [x] **Allineamento variabile URL pubblico**: **`APP_PUBLIC_URL`** a runtime per OAuth (`getGoogleOAuthServerURL()` → `getAppPublicURL()`) e email; fallback dev `NEXT_PUBLIC_URL`. **Emendamento 2026-10-03:** non usare `NEXT_PUBLIC_*` nel build Docker (Next inlined → OAuth localhost in prod). Vedi `docs/operativo/app-public-url.md`.
- [x] Node **24** LTS (`node:24-alpine` nel Dockerfile, `engines.node`: `24.x.x` allineato a runtime Cloud Run `nodejs24`) e `output: 'standalone'` in `next.config.ts`.

> **Nota**: se durante la build emerge un errore di prerendering perché una pagina/layout protetto chiama il database durante `next build` (nessun DB disponibile nel container di build), la soluzione tipica è forzare il rendering dinamico su quella route (es. `export const dynamic = 'force-dynamic'`) — non è una violazione del piano, è una conseguenza nota di avere route protette che richiedono dati a runtime.

### Parte B — Secret e configurazione/deploy sull'ambiente cloud

> **Sottofase a variante (cloud).** Le istruzioni operative dipendono dall'ambiente cloud scelto. Seguire il file corrispondente, poi tornare qui:
> - Google Cloud Run → `fase-3-cloud-gcp.md`
> - Azure / AWS → *(quando disponibili nel catalogo)*

**Stato**: ✅ fatto (2026-10-03)

**Obiettivo**: tutte le variabili d'ambiente e i segreti necessari configurati in modo sicuro (mai in chiaro nel repository), servizio deployato e raggiungibile via pipeline automatica.

**Checklist di chiusura sottofase (valida per qualunque variante)**:
- [x] Ogni credenziale/segreto (DB, provider auth, provider email, secret applicativo) è in un gestore di secret dedicato dell'ambiente cloud, non in variabili d'ambiente in chiaro dove evitabile.
- [x] L'accesso ai secret è scoped al servizio che ne ha bisogno, non concesso a livello di intero progetto/account.
- [x] La pipeline di deploy è automatica (push su un branch di riferimento → build → deploy), non un comando manuale eseguito ad ogni release.
- [x] Verificato con push/trigger su `main`: Cloud Build (Docker + deploy) OK; servizio raggiungibile (richiesta base es. `/`).
- [x] **Provider email (variante)**: dominio `mail.vietnamonamour.com` già Verified in Fase 2 §2.6 (percorso b); `RESEND_FROM_*` su Cloud Run come env plain.

**Eseguito (2026-10-03)**: Secret Manager + servizio `europe-west1`, connettore Cloud SQL, runtime SA `vma-vd-backoffice-run`, deploy continuo GitHub `main`. Nota operativa IAM e troubleshooting: `docs/operativo/cloud-run-produzione.md`, dettaglio GCP `fase-3-cloud-gcp.md`.

**Nota** (solo se a §2.6 è stato usato un dominio provvisorio/di sviluppo, non quello finale): ripetere qui la verifica dominio presso il provider email con il dominio reale del progetto (nuovi record DNS, nuova propagazione) e aggiornare `RESEND_FROM_ADDRESS`/`RESEND_FROM_NAME` (o equivalenti) di conseguenza — stesso pattern del rimando auth descritto in § 3.3 per il dominio personalizzato dell'app.

---

## 3.3 — Auth in produzione e spike cookie HTTPS

> **Sottofase a variante (provider auth).** Le istruzioni operative per la registrazione delle credenziali/redirect di produzione dipendono dal provider scelto. Seguire il file corrispondente, poi tornare qui:
> - Google OAuth → `fase-3-auth-google-oauth.md`
> - *(altri provider, quando disponibili nel catalogo)*

**Stato**: ✅ fatto (2026-10-03) — spike prod da Fase 2 § 2.10 punto 7 chiuso. Perimetro Google **Internal** (dominio esterno bloccato da Google prima del callback): verificato a parte, non sostituto del rifiuto lato app.

**Obiettivo**: login funzionante in produzione con l'URL reale assegnato dal deploy; chiusura dello spike rimandato da Fase 2 (comportamento del cookie httpOnly dietro proxy/load balancer HTTPS).

**Emendamento codice (2026-10-03):** `users.auth.cookies.secure` in produzione — Payload non imposta `Secure` di default; spike prod mostrava solo `HttpOnly`. Vedi `collections/Users.ts` e `docs/operativo/cloud-run-produzione.md` § cookie sessione.

**Checklist di chiusura sottofase (valida per qualunque variante — verificare dopo aver seguito il file di variante)**:
- [x] Login tramite il provider SSO scelto funzionante su Admin e su App, con l'URL reale di produzione. Conferma umana 2026-10-03 (Google OAuth, URL Cloud Run + `APP_PUBLIC_URL`).
- [x] Cookie di sessione verificato `HttpOnly` **e** `Secure` in produzione. Conferma umana 2026-10-03 post-deploy commit `708007b` (`payload-token` su Cloud Run HTTPS).
- [x] Login locale funzionante in produzione (flusso email attivazione incluso, se applicabile). **Admin emergenza** `/admin/login/local` ✅ (§ 3.4). **App** login locale + email attivazione in prod: **non rieseguiti** (coperti in dev § 2.10; Resend prod non nel perimetro di questo spike).
- [x] Tentativo con un'identità non autorizzata → rifiuto con messaggio generico, verificato anche in produzione. Conferma umana 2026-10-03: `@vietnamonamour.com` **non censito** in `users` → messaggio generico su **Admin** (Google SSO) e **Area App** (Google SSO); stesso testo su `/app/login` con form locale+Google visibile.

**Attenzione per il futuro** (solo da tenere a mente, nessuna azione ora): se in futuro verrà collegato un dominio personalizzato al posto dell'URL assegnato dal cloud, sia la variabile URL pubblico sia le credenziali/redirect del provider auth andranno aggiornate di nuovo — ripetere questa sottofase.

---

## 3.4 — Bootstrap super-admin e dati iniziali

**Stato**: ✅ fatto (2026-10-03)

**Obiettivo**: primo accesso Admin possibile su ambiente deployato, con database di produzione ancora vuoto.

**Checklist**:
- [x] Eseguire lo script di seed **da locale**, puntato temporaneamente al database di produzione — non un job dedicato sull'ambiente cloud per un'operazione una tantum: introdurrebbe una risorsa infrastrutturale permanente da mantenere solo per questo, sproporzionato (vedi `core/01-proporzionalita.mdc`; per il dettaglio del perché nello specifico ambiente cloud scelto, vedi il file di variante cloud). Esecuzione: Auth Proxy `5433`, `DATABASE_URL` + `PAYLOAD_SECRET` + `SEED_SUPERADMIN_*` prod inline (credenziali seed da Secret Manager, distinte da dev); `./scripts/prod-db.sh -- env … pnpm seed:super-admin` → log «creato utente».
- [x] **Attenzione al secret applicativo**: puntare il database locale a quello di produzione non basta da solo — usare anche il secret applicativo (es. quello che firma le sessioni) **di produzione**, lo stesso già salvato nel gestore di secret (§ 3.2), non quello di sviluppo.
- [x] Mini-procedura operativa: backup del proprio `.env` locale → sovrascrivere temporaneamente le variabili necessarie con i valori di produzione → eseguire il seed → **ripristinare subito** il proprio `.env` di sviluppo, prima di riprendere a lavorare in locale. *In questa sessione:* equivalente rispettato passando **solo inline** al comando, `.env` restato dev — vedi `docs/operativo/cloud-sql-produzione.md`.
- [x] Verificare **prima in locale/test** che lo script di seed sia effettivamente idempotente, prima di lanciarlo sul database di produzione. Copertura: Fase 2.8 in dev; secondo run su prod opzionale (atteso messaggio «già presente»).
- [x] Verificare il login locale di emergenza in produzione — accesso confermato (`/admin/login/local`, stessa sessione bootstrap).
- [x] Confermare se serve o meno una migrazione di dati pregressi (dipende dal progetto: se si parte da database vuoto, nessuna azione). Cloud SQL prod: solo schema migrate § 3.1, nessun dato legacy → skip.
- [x] Configurare l'allow-list identità (Global Settings) in produzione come super-admin; verificare che il guardrail anti-lista-vuota sia attivo anche qui. Implicito dal successo SSO Admin/App Workspace in prod (dominio + utente censiti).

---

## 3.5 — Verifica chiusura fase

**Stato**: ✅ fatto (2026-10-03)

**Obiettivo**: confermare che Fase 3 sia effettivamente conclusa, con l'intero sistema funzionante in produzione, prima di considerarla chiusa.

**Checklist**:
- [x] Checklist e2e completa in produzione: login SSO Admin, login SSO App, login locale App, accesso di emergenza super-admin, rifiuto identità non autorizzata, rifiuto utente non censito — tutti verificati tra § 3.3 e § 3.4.
- [x] Test pendenti eventualmente rimandati da Fase 2 § 2.10 (es. verifica record `logout`/`accessDenied` in `activityLog`): eseguiti qui se non già fatto.
- [x] Verificare che il logging tecnico (richieste HTTP, errori applicativi) sia visibile nel sistema di logging nativo dell'ambiente cloud scelto, senza configurazione aggiuntiva necessaria (per il dettaglio specifico, vedi il file di variante cloud).
- [x] Verificare **separatamente** che i record `activityLog` siano consultabili (pannello Admin o query diretta alla collection): è un log applicativo su DB, canale distinto dal logging tecnico nativo del cloud — non vi compare per definizione (vedi `payload-pattern/03-log-azioni.mdc`).
- [x] **Alert minimi**: decidere esplicitamente se servono già a questa scala o se vanno rimandati (coerente con `core/01-proporzionalita.mdc`) — non lasciare la decisione implicita.
- [x] Build confermata OK dai deploy precedenti.
- [x] `00-piano-generale.md` aggiornato (Fase 3 → ✅); `CHANGELOG.md` bumpato alla versione corrispondente.

**Eseguito (2026-10-03, conferma umana)**:

- **E2e prod (incrocio § 3.3/3.4)**: SSO Admin/App, emergenza `/admin/login/local`, utente non censito, perimetro Google Internal — già chiusi in § 3.3/3.4. **Login locale App + email attivazione in prod: non rieseguiti** (rimando esplicito da § 3.3; copertura dev § 2.10) — non conteggiati come ✅ prod in questa chiusura fase.
- **`activityLog` prod**: collection consultabile in Admin; `logout` OK; `accessDenied` OK (password errata su `/admin/login/local` → messaggio generico «Accesso non riuscito…», record `accessDenied` in Registro attività).
- **Cloud Logging** (`fase-3-cloud-gcp.md` § 3.5): richieste HTTP visibili in Log Explorer (`run.googleapis.com/requests`), es. 200/302 e 404 su pagina inesistente — senza configurazione aggiuntiva.
- **Alert minimi**: **rimandati** (proporzionalità; log e revisioni Cloud Run sufficienti a questa scala).
- **Build/deploy**: conferma da pipeline § 3.2 e revisioni Cloud Run post-fix auth (`583eb24`, `708007b`).

---

## Note di apertura fase

- **Fuori scope Fase 3** (esplicitamente rimandato, salvo richiesta esplicita): dominio personalizzato/DNS avanzato **per l'hosting dell'app** (l'app resta sull'URL assegnato dal cloud — vedi § 3.3), CDN, monitoring dedicato oltre agli alert minimi di § 3.5, eventuale migrazione a un tier di database superiore (annotare quando ci si avvicina all'uso reale — per il dettaglio vedi il file di variante DB). **Non rientra in questo rimando il dominio per l'invio email** (§ 3.2, variante email): senza un dominio verificato presso il provider, l'invio in produzione resta sul sandbox e non raggiunge utenti reali, quindi va gestito comunque in questa fase — anche con un dominio provvisorio se quello definitivo non è ancora confermato.
- **Proporzionalità**: nessuna duplicazione dev/staging/prod con seed o guardrail diversi non previsti in documentazione — un solo script di seed, un solo utente DB, un solo set di guardrail, validi ovunque.

## Incoerenze note

- **Ordine § 3.3 vs § 3.4 (2026-10-03)**: `fase-3-auth-google-oauth.md` suggerisce di completare lo spike § 3.3 prima di § 3.4; in pratica lo spike e2e (SSO, cookie `Secure`, rifiuti) richiede allow-list e utenti in DB prod → sequenza adottata: Parte A § 3.3 → § 3.4 bootstrap → spike § 3.3. Nessuna modifica codice; solo ordine operativo documentato qui.
