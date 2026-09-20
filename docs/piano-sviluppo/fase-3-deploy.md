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

**Stato**: 🔲 da fare

**Obiettivo**: istanza di produzione del database pronta, sostituta di quella locale, con region e rete allineate alle scelte prese per l'ambiente cloud (§ 3.2).

**Checklist di chiusura sottofase (valida per qualunque variante — verificare dopo aver seguito il file di variante)**:
- [ ] La connection string di produzione è pronta, non annotata in chiaro da nessuna parte — andrà direttamente nel gestore di secret dell'ambiente cloud scelto (§ 3.2).
- [ ] `.env.example` aggiornato con un commento che indica che il valore reale è di produzione (nessuna credenziale reale nel file).

---

## 3.2 — Build container, secret e deploy

**Stato**: 🔲 da fare

**Obiettivo**: immagine container funzionante, secret configurati con accesso scoped, servizio raggiungibile con pipeline di deploy continuo attiva.

### Parte A — Build del container (agente, indipendente dal resto, può partire subito)

**Checklist**:
- [ ] Scrivere `Dockerfile` multi-stage e `.dockerignore` secondo lo standard fisso del progetto (vedi `stack/01-stile-codice.mdc`) — non è specifico di questa fase, è già una convenzione dello stack.
- [ ] Verificare che la build di produzione passi (`tsc --noEmit`, `lint`, `build`) in locale prima di affidarsi alla pipeline cloud per scoprire eventuali errori.
- [ ] **Allineamento variabile URL pubblico**: verificare che un'unica variabile d'ambiente (es. `SERVER_URL`) sia usata coerentemente in tutto il codice per l'URL pubblico dell'app — non introdurre variabili parallele (es. una versione `NEXT_PUBLIC_*` e una server-only che divergono).
- [ ] Conferma umana sui punti aperti: versione Node LTS e `output: 'standalone'` (già standard fisso, verificare che siano applicati).

> **Nota**: se durante la build emerge un errore di prerendering perché una pagina/layout protetto chiama il database durante `next build` (nessun DB disponibile nel container di build), la soluzione tipica è forzare il rendering dinamico su quella route (es. `export const dynamic = 'force-dynamic'`) — non è una violazione del piano, è una conseguenza nota di avere route protette che richiedono dati a runtime.

### Parte B — Secret e configurazione/deploy sull'ambiente cloud

> **Sottofase a variante (cloud).** Le istruzioni operative dipendono dall'ambiente cloud scelto. Seguire il file corrispondente, poi tornare qui:
> - Google Cloud Run → `fase-3-cloud-gcp.md`
> - Azure / AWS → *(quando disponibili nel catalogo)*

**Stato**: 🔲 da fare

**Obiettivo**: tutte le variabili d'ambiente e i segreti necessari configurati in modo sicuro (mai in chiaro nel repository), servizio deployato e raggiungibile via pipeline automatica.

**Checklist di chiusura sottofase (valida per qualunque variante)**:
- [ ] Ogni credenziale/segreto (DB, provider auth, provider email, secret applicativo) è in un gestore di secret dedicato dell'ambiente cloud, non in variabili d'ambiente in chiaro dove evitabile.
- [ ] L'accesso ai secret è scoped al servizio che ne ha bisogno, non concesso a livello di intero progetto/account.
- [ ] La pipeline di deploy è automatica (push su un branch di riferimento → build → deploy), non un comando manuale eseguito ad ogni release.
- [ ] Verificato con un push di test che il trigger si attiva, la build parte, e il servizio risponde su una richiesta di base.
- [ ] **Provider email (variante)**: dominio mittente verificato presso il provider scelto (per Resend: stato "Verified" in dashboard — vedi `email/01a-resend.mdc`). La scelta del percorso è stata fatta a §2.6 di `fase-2-email-resend.md`: se lì si era scelto di restare sul sandbox, qui va risolto — un dominio reale va verificato prima di andare in produzione, il sandbox non raggiunge utenti reali. Se invece a §2.6 era già stato verificato un dominio provvisorio/di sviluppo, qui va sostituito con il dominio reale del progetto (vedi nota sotto).

**Nota** (solo se a §2.6 è stato usato un dominio provvisorio/di sviluppo, non quello finale): ripetere qui la verifica dominio presso il provider email con il dominio reale del progetto (nuovi record DNS, nuova propagazione) e aggiornare `RESEND_FROM_ADDRESS`/`RESEND_FROM_NAME` (o equivalenti) di conseguenza — stesso pattern del rimando auth descritto in § 3.3 per il dominio personalizzato dell'app.

---

## 3.3 — Auth in produzione e spike cookie HTTPS

> **Sottofase a variante (provider auth).** Le istruzioni operative per la registrazione delle credenziali/redirect di produzione dipendono dal provider scelto. Seguire il file corrispondente, poi tornare qui:
> - Google OAuth → `fase-3-auth-google-oauth.md`
> - *(altri provider, quando disponibili nel catalogo)*

**Stato**: 🔲 da fare

**Obiettivo**: login funzionante in produzione con l'URL reale assegnato dal deploy; chiusura dello spike rimandato da Fase 2 (comportamento del cookie httpOnly dietro proxy/load balancer HTTPS).

**Nessuna modifica di codice prevista** — il codice legge già la variabile URL pubblico (§ 3.2 Parte A) e i path auth sono fissi. Questa sottofase è configurazione + spike manuale.

**Checklist di chiusura sottofase (valida per qualunque variante — verificare dopo aver seguito il file di variante)**:
- [ ] Login tramite il provider SSO scelto funzionante su Admin e su App, con l'URL reale di produzione.
- [ ] Cookie di sessione verificato `HttpOnly` **e** `Secure` in produzione (non solo `HttpOnly` come in locale — `Secure` richiede HTTPS, presente solo in produzione).
- [ ] Login locale funzionante in produzione (flusso email attivazione incluso, se applicabile).
- [ ] Tentativo con un'identità non autorizzata → rifiuto con messaggio generico, verificato anche in produzione.

**Attenzione per il futuro** (solo da tenere a mente, nessuna azione ora): se in futuro verrà collegato un dominio personalizzato al posto dell'URL assegnato dal cloud, sia la variabile URL pubblico sia le credenziali/redirect del provider auth andranno aggiornate di nuovo — ripetere questa sottofase.

---

## 3.4 — Bootstrap super-admin e dati iniziali

**Stato**: 🔲 da fare

**Obiettivo**: primo accesso Admin possibile su ambiente deployato, con database di produzione ancora vuoto.

**Checklist**:
- [ ] Eseguire lo script di seed **da locale**, puntato temporaneamente al database di produzione — non un job dedicato sull'ambiente cloud per un'operazione una tantum: introdurrebbe una risorsa infrastrutturale permanente da mantenere solo per questo, sproporzionato (vedi `core/01-proporzionalita.mdc`; per il dettaglio del perché nello specifico ambiente cloud scelto, vedi il file di variante cloud).
- [ ] **Attenzione al secret applicativo**: puntare il database locale a quello di produzione non basta da solo — usare anche il secret applicativo (es. quello che firma le sessioni) **di produzione**, lo stesso già salvato nel gestore di secret (§ 3.2), non quello di sviluppo.
- [ ] Mini-procedura operativa: backup del proprio `.env` locale → sovrascrivere temporaneamente le variabili necessarie con i valori di produzione → eseguire il seed → **ripristinare subito** il proprio `.env` di sviluppo, prima di riprendere a lavorare in locale.
- [ ] Verificare **prima in locale/test** che lo script di seed sia effettivamente idempotente, prima di lanciarlo sul database di produzione.
- [ ] Verificare il login locale di emergenza in produzione — accesso confermato.
- [ ] Confermare se serve o meno una migrazione di dati pregressi (dipende dal progetto: se si parte da database vuoto, nessuna azione).
- [ ] Configurare l'allow-list identità (Global Settings) in produzione come super-admin; verificare che il guardrail anti-lista-vuota sia attivo anche qui.

---

## 3.5 — Verifica chiusura fase

**Stato**: 🔲 da fare

**Obiettivo**: confermare che Fase 3 sia effettivamente conclusa, con l'intero sistema funzionante in produzione, prima di considerarla chiusa.

**Checklist**:
- [ ] Checklist e2e completa in produzione: login SSO Admin, login SSO App, login locale App, accesso di emergenza super-admin, rifiuto identità non autorizzata, rifiuto utente non censito — tutti verificati tra § 3.3 e § 3.4.
- [ ] Test pendenti eventualmente rimandati da Fase 2 § 2.10 (es. verifica record `logout`/`accessDenied` in `activityLog`): eseguiti qui se non già fatto.
- [ ] Verificare che il logging tecnico (richieste HTTP, errori applicativi) sia visibile nel sistema di logging nativo dell'ambiente cloud scelto, senza configurazione aggiuntiva necessaria (per il dettaglio specifico, vedi il file di variante cloud).
- [ ] Verificare **separatamente** che i record `activityLog` siano consultabili (pannello Admin o query diretta alla collection): è un log applicativo su DB, canale distinto dal logging tecnico nativo del cloud — non vi compare per definizione (vedi `payload-pattern/03-log-azioni.mdc`).
- [ ] **Alert minimi**: decidere esplicitamente se servono già a questa scala o se vanno rimandati (coerente con `core/01-proporzionalita.mdc`) — non lasciare la decisione implicita.
- [ ] Build confermata OK dai deploy precedenti.
- [ ] `00-piano-generale.md` aggiornato (Fase 3 → ✅); `CHANGELOG.md` bumpato alla versione corrispondente.

---

## Note di apertura fase

- **Fuori scope Fase 3** (esplicitamente rimandato, salvo richiesta esplicita): dominio personalizzato/DNS avanzato **per l'hosting dell'app** (l'app resta sull'URL assegnato dal cloud — vedi § 3.3), CDN, monitoring dedicato oltre agli alert minimi di § 3.5, eventuale migrazione a un tier di database superiore (annotare quando ci si avvicina all'uso reale — per il dettaglio vedi il file di variante DB). **Non rientra in questo rimando il dominio per l'invio email** (§ 3.2, variante email): senza un dominio verificato presso il provider, l'invio in produzione resta sul sandbox e non raggiunge utenti reali, quindi va gestito comunque in questa fase — anche con un dominio provvisorio se quello definitivo non è ancora confermato.
- **Proporzionalità**: nessuna duplicazione dev/staging/prod con seed o guardrail diversi non previsti in documentazione — un solo script di seed, un solo utente DB, un solo set di guardrail, validi ovunque.

## Incoerenze note

*(Nessuna al momento. Sezione per segnalare esplicitamente contraddizioni o ambiguità non risolte tra questo file e altri — vedi `processo-v2-operativo.md` §3, Balzer 1991.)*
