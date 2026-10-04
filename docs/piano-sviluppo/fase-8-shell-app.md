---
stato: validato
---

# Fase 8 — Shell dell'Area App `(app)` + shadcn/ui (infrastruttura condivisa del backoffice)

> Dettaglio operativo. Fase di dominio specifica del progetto (non ereditata dal catalogo). Riferimenti: `ADR-102-divisione-area-di-gestione.md` (con la nota del 2026-10-04), `ADR-113-ruoli-permessi-admin-app.md`, `ADR-109-global-impostazioni-sistema.md` (terzo emendamento), `ADR-107-modello-dati-sistema-prenotazioni.md` §2; `fase-7-impostazioni-sistema.md`, `fase-2-login.md`. Regole: `core/01-proporzionalita.mdc`, `core/04-changelog-commit.mdc`, `stack/01-stile-codice.mdc`, `payload-pattern/01-architettura.mdc`, `email/01-email-invarianti.mdc`.

Aggiornare lo stato di ogni sottofase qui sotto e in `00-piano-generale.md` non appena completata.

**Prerequisito**: Fase 3 chiusa, Fase 4.0 e Fase 7 completate (ordine in `00-piano-generale.md`). Nessuna nuova risorsa GCP.

---

## Perimetro e decisioni già prese (da non riaprire)

- **L'App è un route group `(app)`** (URL `/app`) della stessa applicazione Next.js di Payload. Comunica con Payload in-process, con la Local API e con la stessa sessione: nessun token, nessuna CORS (`ADR-102`, `payload-pattern/01-architettura.mdc`).
- **Tre sezioni**: `menu` (Menù), `hours` (Orari di vietnamonamour.com: ristorante e B&B), `reservations` (Prenotazioni). Identificativi in inglese, etichette in italiano. Rotte: `/app/menu`, `/app/hours`, `/app/reservations`.
- **Chi accede**: admin e super-admin a tutte e tre, in modo derivato da `adminRole`; il manager (`appRole`) a tutte e tre; `ADR-113`.
- **UI**: shadcn/ui (`ui_kit` in `piano.yaml`), mobile-first, interfaccia in italiano.
- **Questa fase non costruisce** il contenuto delle sezioni Menù (6.6) e Prenotazioni (5.5), né i contenuti dei siti (CMS nell'Admin). Le chiusure per data (Eccezioni giorno, `ADR-107` §2) stanno in Prenotazioni, non in Orari.

**Stato attuale del repo (verificato)**: esistono il layout `app/(app)/layout.tsx`, `/app` (placeholder della Fase 1), `/app/login`, `/app/login/verify`, `/forgot`, `/reset`. `canAccessSection` è uno stub che restituisce sempre `false` e nessuna route lo invoca. shadcn/ui non è installato. Versioni: Next 16.3.5, React 19.2.8, Tailwind `^4.3.3` con `@tailwindcss/postcss`; non esistono `components.json` né `tailwind.config`. `app/globals.css` è importato da `(app)` e da `(frontend)`, non da `(payload)`.

## Ordine di dipendenza reale

**8.1 → 8.3 → 8.2 → 8.4 → 8.5**, con **8.6 bloccata**. Gli identificativi non indicano l'ordine di esecuzione: la navigazione della 8.2 mostra le sezioni consentite da `canAccessSection`, che la 8.3 implementa (`arco-38`). 8.3 e 8.4 modificano entrambe la collection `users`: si eseguono in sequenza, una chat Composer per sottofase. Fuori fase: 8.5 dipende da 7.2 e 7.4 (`arco-35`, campi e permessi); 6.6 e 5.5 dipendono da questa fase (`arco-30`, `arco-31`); 4.1 dipende dalla 8.3 (`arco-33`).

## Principi trasversali per questa fase

1. **Nomi fissati prima di scrivere codice**: identificativi delle sezioni, rotte, nomi delle funzioni di guardia. Nessun alias.
2. **Convenzione lingua**: nomi in inglese, testi dell'interfaccia in italiano (`stack/01-stile-codice.mdc`).
3. **Nessun deploy prima della migrazione**: le sottofasi 8.3 e 8.4 cambiano lo schema; ogni migrazione va applicata su Cloud SQL prod **prima del push** su `main` (`docs/operativo/cloud-sql-produzione.md`).
4. **Commit solo dopo verifica runtime**, push manuale. Voce di CHANGELOG per ogni commit.
5. **Isolamento**: lo stile di `(app)` non tocca l'Admin (`(payload)`) né `(frontend)`.

---

## 8.1 — Installazione e verifica di shadcn/ui

**Stato**: 🔲 da fare

**Dipende da**: Fase 4.0 e Fase 7 completate.

**Obiettivo**: shadcn/ui funzionante in `(app)`, senza effetti su Admin né `(frontend)`.

**Verifica di compatibilità** (non è una decisione): sulla documentazione aggiornata di shadcn/ui, controllare che supporti insieme Next 16.3.5, React 19 e Tailwind v4 in modalità CSS-first (senza `tailwind.config`). **Se qualcosa non è compatibile, fermarsi e riferire**, senza forzare l'installazione.

**Isolamento** (dal repo): poiché `app/globals.css` è condiviso da `(app)` e `(frontend)`, i token e lo stile base di shadcn vanno in un CSS dedicato di `(app)`, importato solo dal suo layout, e non in `globals.css`.

**Dipendenze**: si installano i componenti solo quando servono alle sottofasi 8.2–8.5. Le librerie che shadcn aggiunge (utilità di classi, icone, ecc.) vanno elencate nel CHANGELOG con la versione fissata.

**Checklist di chiusura sottofase**:
- [ ] Esito della verifica di compatibilità documentato nel CHANGELOG.
- [ ] `pnpm build` passa; `/app`, `/app/login` e `/admin` si caricano.
- [ ] L'Admin e `(frontend)` non cambiano aspetto.
- [ ] Voce di CHANGELOG.

---

## 8.3 — Ruoli e guardia di accesso

**Stato**: 🔲 da fare

**Dipende da**: 8.1 (ordine di esecuzione: prima della 8.2).

**Obiettivo**: implementare `ADR-113`: nuovo ruolo e guardia per sezione.

**Riferimenti**: `ADR-113`, `ADR-004` e `ADR-001` di catalogo, `fase-2-login.md`, `lib/auth/roles.ts`, `lib/auth/userAccess.ts`, `lib/auth/canAccessSection.ts`.

**Contenuto**:
1. **Schema**: valore `manager` in `adminRole` (`none`, `manager`, `admin`, `super-admin`). Migrazione dell'enum Postgres.
2. **Admin**: `canAccessAdminPanel` ammette `manager` (restando falso se `active` è falso). `isStaffAdminRequest` non cambia: il manager non legge né modifica utenti.
3. **Vincolo SSO**: il guard esistente usa `adminRole !== 'none'`; non va modificato. Verificare con una prova che un utente con `adminRole: manager` e login locale venga rifiutato.
4. **Matrice di `fase-2-login.md`**: aggiungere il caso del manager nell'Admin (SSO obbligato, nessun permesso sugli utenti).
5. **Sezioni**: `AppSection` = `menu` | `hours` | `reservations`. `canAccessSection(user, section)`: falso se l'utente non è attivo; vero per tutte e tre se `adminRole` è `admin` o `super-admin` o se `appRole` è `manager`; falso altrimenti.
6. **Admin nascosto al manager** (`admin.hidden` con funzione, che in Payload 3.89.0 riceve l'utente): oggi per Users, registro attività, «Identità autorizzate» e `impostazioni-sistema`. Per le collection di menù e prenotazioni si applica quando vengono create (Fase 5 e 6). Finché la Fase 4.1 non crea le risorse del CMS, il manager vedrà un Admin vuoto.
7. **Accesso**: nascondere non basta; verificare via REST e Local API che il manager (`adminRole`) non legga né scriva le risorse non sue.
8. **Prerequisito operativo, non di codice**: chi usa l'Admin come manager entra con Google SSO con un dominio abilitato per l'Admin in «Identità autorizzate».

**Checklist di chiusura sottofase**:
- [ ] Migrazione generata, committata e applicata su Cloud SQL prod **prima** del push.
- [ ] Prova per ruolo: super-admin, admin, manager (`adminRole`), manager (solo `appRole`), manager con entrambi, utente senza ruoli.
- [ ] `canAccessSection` verificata per le tre sezioni; nessuna route la elude.
- [ ] Rifiuto di login locale per `adminRole: manager` verificato.
- [ ] Matrice di `fase-2-login.md` aggiornata; CHANGELOG.

---

## 8.2 — Layout `(app)` mobile-first e navigazione

**Stato**: 🔲 da fare

**Dipende da**: 8.1 e 8.3 (`arco-38`).

**Obiettivo**: la shell dell'App: intestazione, navigazione per le tre sezioni, uscita, e `/app` come pagina iniziale al posto del placeholder della Fase 1.

**Passaggi da confermare con l'umano prima di scrivere codice** (nessun documento li fissa):
1. Il pattern di navigazione su telefono e su schermo largo (per esempio barra in basso e menu laterale).
2. Il contenuto di `/app`: schede di accesso alle sole sezioni consentite.
3. Se chi ha accesso all'Admin vede un collegamento a `/admin` nell'App.

**Comportamento**: le sezioni mostrate e le rotte `/app/menu`, `/app/hours`, `/app/reservations` passano da `canAccessSection`. Chi non è autenticato va a `/app/login`.

**Checklist di chiusura sottofase**:
- [ ] Navigazione e `/app` verificate su telefono e su desktop, per ogni ruolo.
- [ ] Una sezione non consentita non è raggiungibile nemmeno digitando l'URL.
- [ ] Il login e il reset di `/app/login` non regrediscono.
- [ ] CHANGELOG.

---

## 8.4 — Email di account per gli utenti

**Stato**: 🔲 da fare

**Dipende da**: 8.3 (stessa collection `users`). Non dipende dalla shell: agisce nell'Admin.

**Obiettivo**: due funzioni richieste il 2026-10-04.

**Quando parte quale email** (mittente di sistema, `RESEND_FROM_*`, primo emendamento di `ADR-109`):

| Evento | Utente | Email |
|---|---|---|
| Creazione | Login locale (`local` o `sso-and-local`) con password | Attivazione (come oggi) |
| Creazione | `loginMethod: sso`, `active` vero | «Account creato» (una sola volta) |
| Creazione | `loginMethod: sso`, `active` falso | Nessuna |
| `active` passa da falso a vero | `loginMethod: sso`, email mai inviata | «Account creato» |
| `active` passa da falso a vero | `loginMethod: sso`, email già inviata | Nessuna |

Gli utenti `sso-and-local` ricevono solo l'email di attivazione.

**Una sola volta per utente**, con un campo nuovo `accountCreatedEmailSentAt` (data e ora) nella collection `users`:
- Lo scrive solo il server, dopo un invio riuscito. È di sola lettura e visibile ad admin e super-admin. Per le richieste degli utenti, creazione e modifica sono negate; l'hook scrive con `overrideAccess`.
- Non va negata anche la lettura: un campo con lettura, creazione e modifica tutte negate non compare nel `doc` degli hook della stessa collection (`payload-pattern/04-auth-locale-con-sso-esclusivo.mdc`).
- Se l'invio fallisce il campo resta vuoto, quindi la prima attivazione successiva riprova.
- La scrittura del campo non deve rilanciare l'invio (flag nel contesto della richiesta).
- **Creazioni da script**: `pnpm seed:super-admin` crea un utente `sso` con `active: true` (verificato in `scripts/seed-super-admin.ts`); non deve inviare l'email.
- **Utenti già esistenti**: il campo parte vuoto, senza riempimento retroattivo. Un utente SSO già attivo riceverebbe l'email solo se un admin lo disattivasse e lo riattivasse.
- Comporta una **migrazione**.

**Contenuto dell'email «Account creato»** (italiano): l'indirizzo dell'Admin (`/admin`) se `adminRole` non è `none`, e/o dell'App (`/app/login`) se `appRole` non è `none`; l'indicazione di accedere con l'account Google del dominio; a chi rivolgersi per problemi di accesso (testo generico, «chi ti ha creato l'account», salvo diversa indicazione). Gli indirizzi si costruiscono con `APP_PUBLIC_URL`.

**Pulsante «Reinvia email di attivazione»** nel form utente dell'Admin:
- **Visibile** se il login include la modalità locale ed `emailVerified` è falso; non per gli utenti solo SSO né per quelli già verificati.
- **Chi può premerlo**: admin e super-admin.
- **Effetto**: genera un nuovo token di verifica e invia l'email. Il token è uno solo: **il link precedente smette di funzionare**.
- **Esito**: messaggio all'admin di invio riuscito o di errore generico, senza dettagli del provider. Le email di sistema verso gli utenti restano come oggi (un errore di invio finisce solo nel log).
- **Realizzazione**: un endpoint con controllo del ruolo e un componente del form (classe A).

**Prove**: in sviluppo con invio reale (come in Fase 2.6); in produzione nella 8.6.

**Checklist di chiusura sottofase**:
- [ ] Le quattro righe della tabella verificate, comprese quelle senza invio: una seconda attivazione non rimanda l'email.
- [ ] Invio fallito (simulato): il campo resta vuoto e la successiva attivazione riprova.
- [ ] `pnpm seed:super-admin` non invia l'email.
- [ ] Migrazione generata, committata e applicata su Cloud SQL prod **prima** del push.
- [ ] Pulsante: visibilità corretta per ogni combinazione di login ed `emailVerified`; non invocabile da un manager.
- [ ] Il link inviato dal pulsante verifica l'account; quello precedente non funziona.
- [ ] CHANGELOG.

---

## 8.5 — Sezione Orari

**Stato**: 🔲 da fare

**Dipende da**: 8.2, 8.3, e da Fase 7 (campi 7.2, permessi 7.4; `arco-34`, `arco-35`).

**Obiettivo**: la schermata `/app/hours` in cui il manager modifica gli orari di vietnamonamour.com.

**Contenuto**: tab Orari e chiusure di `impostazioni-sistema`: orari dei due servizi, giorni di riposo settimanale, chiusure annuali (con il pulsante delle festività) e check-in e check-out del B&B. Legge e scrive con la Local API **con la sessione dell'utente** (`overrideAccess: false`), così valgono i permessi di `ADR-113`.

**Vincoli**:
- Gli orari sono testo `HH:mm` a 24 ore; validazione e funzione di calcolo delle festività sono quelle di `lib/` della Fase 7.2, non duplicate.
- Campi adatti al telefono, messaggi di errore in italiano, conferma del salvataggio.
- **Fuori perimetro**: le chiusure per data (Eccezioni giorno) restano in Prenotazioni (5.2, 5.5).

**Pubblicazione sul menù** (decisione del 2026-10-04, `po-06`): orari, chiusure e giorni speciali non entrano in `disponibilita.json`; una loro modifica richiede il rebuild del menù, dal pulsante «Ricompila il menù pubblico» (sottofase 6.5). Questa sezione non ricompila il menù da sola.

**Checklist di chiusura sottofase**:
- [ ] Prova per ruolo: il manager modifica e salva; l'admin pure; un utente senza ruolo è rifiutato.
- [ ] Un valore non `HH:mm` viene rifiutato; le righe del pulsante festività corrispondono a quelle dell'Admin.
- [ ] Le modifiche si vedono nell'Admin (admin e super-admin) e viceversa.
- [ ] CHANGELOG.

---

## 8.6 — Verifica in produzione di login locale ed email

**Stato**: ⏸ bloccata

**Condizione di sblocco**: sezioni dell'App sviluppate (6.6 e 8.5; `arco-36`, `arco-37`). **Vincolo**: da completare prima del primo accesso reale dei manager (`po-03`).

**Perché**: login locale dell'App ed email di attivazione sono coperti solo in sviluppo (Fase 2.10). In Fase 3.3 non sono stati rieseguiti in produzione; la chiave Resend risulta montata su Cloud Run (conferma dell'umano, non verificata sul servizio).

**Piano di prova proposto** (da confermare allo sblocco; lo esegue l'umano):
1. Controllo di configurazione: `RESEND_API_KEY` montato, `RESEND_FROM_*` presenti, `APP_PUBLIC_URL` con HTTPS e senza slash finale.
2. Creazione di un utente App di prova dall'Admin di produzione, con un'email diversa da quella del super-admin (un `adminRole ≠ none` non può avere login locale).
3. Email di attivazione: arrivo, mittente, intestazioni SPF e DKIM, base del link. Poi login su `/app/login`.
4. Casi negativi: login prima della verifica rifiutato con messaggio generico; password errata.
5. «Password dimenticata»: arrivo, reset entro un'ora, accesso con la nuova password.
6. Pulsante di reinvio (8.4) ed email «Account creato» per un utente SSO di prova.
7. Registro attività in produzione; cancellazione dell'utente di prova.

---

## Variabili d'ambiente introdotte dalla Fase 8

**Nessuna.** Si usano `RESEND_FROM_ADDRESS`, `RESEND_FROM_NAME` e `APP_PUBLIC_URL`, già esistenti.

## Incoerenze note e punti aperti

- **Ordine interno** (8.1 → 8.3 → 8.2): proposto perché la navigazione dipende dalla guardia. Se si preferisce l'ordine per numero, la 8.2 si verifica con una guardia provvisoria.
- **Placeholder Fase 1**: `app/(app)/app/page.tsx` e il testo «placeholder Fase 1» in `app/(app)/layout.tsx` vengono sostituiti dalla 8.2.
- **Token di attivazione senza scadenza**: lato server non è controllata (commento in `lib/auth/localEmail/tokens.ts`); il reset dura un'ora. Non si cambia (proporzionalità).
- **Orari sul menù pubblico**: risolto il 2026-10-04: le modifiche richiedono il rebuild del menù (vedi 8.5).
