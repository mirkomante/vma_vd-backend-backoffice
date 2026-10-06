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
6. **Convenzioni per la Payload 4** (`ADR-116`, accettata): nel codice nuovo `overrideAccess` e `depth` sempre espliciti, `versions` esplicito su ogni collection e Global nuovi, nessun nuovo `TypedUser` (il cast passa da `asUserAccessFields`), nessuna API che la guida della 4 rimuove o cambia (`useAPIKey`, `lexicalHTML`, `typescriptSchema`, `allowLocalizedWithinLocalized`, `min`/`max` su relationship e upload, `afterOperation` con `operation: 'read'`), script con `payload run` e nessun `config.bin`.

---

## 8.1 — Installazione e verifica di shadcn/ui

**Stato**: ✅ fatto (2026-10-06)

**Dipende da**: Fase 4.0 e Fase 7 completate.

**Obiettivo**: shadcn/ui funzionante in `(app)`, senza effetti su Admin né `(frontend)`.

**Verifica di compatibilità** (non è una decisione): sulla documentazione aggiornata di shadcn/ui, controllare che supporti insieme Next 16.3.5, React 19 e Tailwind v4 in modalità CSS-first (senza `tailwind.config`). **Se qualcosa non è compatibile, fermarsi e riferire**, senza forzare l'installazione.

**Isolamento** (dal repo): poiché `app/globals.css` è condiviso da `(app)` e `(frontend)`, i token e lo stile base di shadcn vanno in un CSS dedicato di `(app)`, importato solo dal suo layout, e non in `globals.css`.

`components.json` (creato dalla CLI) deve indicare come file CSS quello dedicato di `(app)` (campo `tailwind.css`) e `tailwind.config` vuoto (Tailwind v4 senza file di configurazione). Dopo `shadcn init`, `git diff app/globals.css` deve essere vuoto: se la CLI l'ha modificato, annullare e correggere `components.json`. Verificare i nomi dei campi sulla documentazione aggiornata di shadcn, come già richiesto sopra.

**Dipendenze**: si installano i componenti solo quando servono alle sottofasi 8.2–8.5. Le librerie che shadcn aggiunge (utilità di classi, icone, ecc.) vanno elencate nel CHANGELOG con la versione fissata.

**Verifica compatibilità (2026-10-06)** — documentazione ufficiale shadcn/ui ([Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4), [components.json](https://ui.shadcn.com/docs/components-json)): supporto esplicito a Tailwind v4 (`@theme`, `@theme inline`) e React 19; `tailwind.config` vuoto in v4. Next.js App Router coperto dalla guida [Installation / Next.js](https://ui.shadcn.com/docs/installation/next) (nessun vincolo di versione minima Next oltre allo stack del progetto). **Init eseguito con CLI `shadcn@4.21.3`**; dipendenze runtime pin in `package.json`: `shadcn@4.21.2`, `cn@0.4.0`, `class-variance-authority@0.7.1`, `lucide-react@1.52.0`, `tw-animate-css@1.4.0`. Helper `lib/utils.ts` (re-export `cn`). Nessun componente UI committato (prova `button` rimossa).

**Isolamento CSS — rischi risolti o documentati**:

1. **Collisione `--background` / `--foreground`**: `app/globals.css` definisce ancora `--background` e `--foreground` su `:root` (e `prefers-color-scheme: dark`) per `(frontend)` e stile base condiviso. In `(app)` il layout importa prima `globals.css`, poi `app/(app)/app-ui.css`: i token shadcn sullo stesso `:root` del documento `/app` **sovrascrivono** quelli legacy solo nell’html di `(app)` (documento separato da `/` e `/admin`). Il `<body>` dell’App usa classi Tailwind semantiche (`bg-background`, `text-foreground`, `font-sans`) invece del `color`/`background` hardcoded di `globals.css` su `body`. **Dark mode**: shadcn usa la variante `@custom-variant dark` (classe `.dark` sull’antenato); `globals.css` usa `@media (prefers-color-scheme: dark)` su `:root`. Fino alla 8.2 non si applica `.dark` su `/app`: palette shadcn resta in tema chiaro; `prefers-color-scheme` in `globals` può ancora influire su `color-scheme` dell’html. Allineamento dark (classe vs media query) resta decisione di shell in 8.2.

2. **Entry Tailwind dedicata (correzione 8.1b, 2026-10-06)**: `app/(app)/app-ui.css` è l’unica entry CSS di `(app)` — apre con `@import 'tailwindcss'`, poi `@import 'tw-animate-css'` e `@import 'shadcn/tailwind.css'`, `@source` su `./**` (route group `(app)`) e `../../components/**` (componenti shadcn in `@/components`), `@custom-variant dark`, `@theme inline`, token `:root`/`.dark`, `@layer base` shadcn (`border-border`, `bg-background`/`text-foreground` su `body`). Il layout `(app)` importa **solo** `app-ui.css`, non `../globals.css`. `app/globals.css` resta per `(frontend)` e **non va modificato** (`git diff app/globals.css` vuoto). Le utility semantiche (`bg-background`, `bg-primary`, `text-muted-foreground`, `border-border`, `bg-card`, `bg-destructive`, …) sono generate **in questa entry**: con la 8.1 iniziale (token in `app-ui.css` senza `@import 'tailwindcss'` ma layout che importava ancora `globals.css`) su clone pulito risultavano assenti nel CSS servito a `/app/login` (probe temporaneo + `grep -c '\.bg-primary'` sui CSS linkati). Font: `--font-sans` → `var(--font-geist-sans)`, `--font-mono` → `var(--font-geist-mono)` (niente riferimento circolare); in `/app` non si applica più `font-family: Arial` di `globals.css` — Geist dal layout. Da `globals.css` in `(app)` si portano solo regole utili senza colori fissi su `body` (`html`/`body` overflow, reset `*`/`a`, stile `.google-oauth-login-button` per login); **non** portati: `:root` legacy `--background`/`--foreground`, `body` con colori Arial, `@media (prefers-color-scheme: dark)` su `html` (`color-scheme`).

**Prova isolamento CSS (prod locale, `pnpm build && PORT=3001 pnpm start`)** — HTML con `curl` su `/admin`, `/`, `/app/login`; sha256 di ogni CSS linkato; sui CSS di `/app/login`, `grep -c` delle utility semantiche (con probe temporaneo in `(app)` durante la prova). Token shadcn (`sidebar-primary`, `--radius:`) assenti nei CSS di `/admin` e `/`. Dopo 8.1b: utility semantiche presenti su `/app/login`; Admin invariato (stessi sha256 per file); su `/` il chunk `globals` può essere **spezzato** in due file (stesso byte totali, ordine link diverso dal monolite pre-8.1b) — verificare resa vetrina se serve. Confronto visivo `/app/login` (chiaro/scuro OS) e Admin/frontend: azione umana.

**Checklist di chiusura sottofase**:
- [x] Esito della verifica di compatibilità documentato nel CHANGELOG.
- [x] `pnpm build` passa; `/app`, `/app/login` e `/admin` si caricano (prod locale; caricamento pagina non verificato visivamente).
- [x] Isolamento token shadcn verificato via `curl`+`grep` sui CSS (Admin e `/` esclusi).
- [x] Correzione 8.1b: entry Tailwind in `app-ui.css`, layout senza `globals.css`; utility semantiche verificate su `/app/login` (probe + `grep -c`).
- [x] `git diff app/globals.css` vuoto dopo init (contenuto shadcn spostato in `app/(app)/app-ui.css`, `components.json` → `tailwind.css` su quel file).
- [x] Voce di CHANGELOG.

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
4. **Matrice di `fase-2-login.md`**: aggiungere il caso del manager nell'Admin (SSO obbligato, nessun permesso sugli utenti). Correggere anche l'etichetta della riga A («Solo Admin»: con 5-bis l'admin ha accesso anche all'App) e aggiungere alla checklist di 2.6 il controllo `adminRole !== 'none'` nel login locale dell'App.
5. **Sezioni**: `AppSection` = `menu` | `hours` | `reservations`. `canAccessSection(user, section)`: falso se l'utente non è attivo; vero per tutte e tre se `adminRole` è `admin` o `super-admin` o se `appRole` è `manager`; falso altrimenti. La regola vive in un solo punto: `canAccessSection(user, section)` richiama `canAccessAppArea(user)` (5-bis) per tutte e tre le sezioni (nessuna distinzione per sezione: il manager è unico, `ADR-113` §3).
5-bis. **Accesso all'App di admin e super-admin** (ADR-113 §3): `canAccessAppArea` oggi vale solo per `appRole ≠ none` e governa il login Google dell'App (`lib/auth/googleOAuth/userLoginChecks.ts`, area `app`) e il login locale (`lib/auth/localLogin/appLoginChecks.ts`). Va estesa: vero per un utente attivo (`isActiveUser`) con `adminRole` `admin` o `super-admin`, oppure con `appRole: manager`; falso per `adminRole: manager` senza `appRole`. Il login locale dell'App è **solo per utenti con `adminRole: none`**: `assertUserAllowedForAppLocalLogin` (`lib/auth/localLogin/appLoginChecks.ts`) rifiuta ogni utente con `adminRole` diverso da `none`, qualunque sia `appRole`, con lo stesso messaggio generico (`ADR-004`; stessa regola `adminRole !== 'none'` di `localPasswordGuard.ts`). Oggi non è vero (verificato il 2026-10-04): un utente creato come utente App con login locale e poi promosso ad `adminRole: admin` con `loginMethod: sso` conserva `hash` e `salt` ed entra su `/app` con la password locale; con la regola di 5-bis lo stesso varrebbe anche con `appRole: none`. Aggiornare anche il commento di `lib/auth/localLogin/appLoginChecks.ts` («il confronto password fallisce da solo»), che dopo questa regola non è più vero.
6. **Admin nascosto al manager** (`admin.hidden` con funzione, che in Payload 3.89.0 riceve l'utente): oggi per Users, registro attività, «Identità autorizzate» e `impostazioni-sistema`. Per le collection di menù e prenotazioni si applica quando vengono create (Fase 5 e 6). Finché la Fase 4.1 non crea le risorse del CMS, il manager vedrà un Admin vuoto.
7. **Accesso**: nascondere non basta; verificare via REST e Local API che il manager (`adminRole`) non legga né scriva le risorse non sue.
8. **Prerequisito operativo, non di codice**: chi usa l'Admin come manager entra con Google SSO con un dominio abilitato per l'Admin in «Identità autorizzate».
9. **Escalation a super-admin** (audit 2026-10-04, F1; il difetto è già nel codice in produzione): oggi un `admin` può impostare `adminRole: super-admin` su sé stesso o su un altro admin, perché `usersUpdateAccess` filtra solo il documento di destinazione e il campo non ha `access`. Si corregge con un controllo in `beforeValidate` (vale anche per `PATCH /api/users?where=…`, dove `access.update` non riceve `data`): solo un super-admin può assegnare `super-admin`. Prova per ruolo: un `admin` che imposta `adminRole: super-admin` su sé stesso o su un altro admin è rifiutato, via REST (aggiornamento in blocco compreso) e via Local API con `overrideAccess: false`. Il difetto è nel pattern di catalogo (`payload-pattern/04-…`, `ADR-004`): segnalazione scritta il 2026-10-04 per il template (`po-10`; il testo non è più in questo repo: `git show 0e82351^:docs/piano-sviluppo/segnalazione-catalogo-escalation-super-admin.md`); l'invio è indipendente da questo progetto: il template si aggiorna nel suo progetto per le applicazioni future. Il controllo si applica in questa sottofase come descritto nel blocco «Controllo di F1» qui sotto (verificato su `PATCH` singolo e in blocco il 2026-10-04); l'8.3 non si chiude senza la prova e non attende il template.
10. **Utenti disattivati**: la regola è già applicata dagli helper (`isActiveUser`, `fase-7` §7.0); `canAccessSection` la usa e la prova di chiusura la verifica.

**Controllo di F1 (voce 9)** — da implementare in `collections/Users.ts`, nell'hook `beforeValidate` già esistente (non in `access.update`): copre sia l'update singolo sia quello in blocco; gli script con `overrideAccess` non hanno `req.user` e non ne sono toccati. Schema, da adattare ai nomi e ai tipi già presenti nel file (`UserWriteData`, `UserAccessFields`, `ValidationError`, gli argomenti dell'hook):

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

**Non** adottare al suo posto: (a) solo una funzione `access.update` che legge `data` (non copre l'update in blocco); (b) nascondere `adminRole` nell'interfaccia (la REST resta aperta); (c) un `access.update` di campo riservato ai super-admin (troppo largo: impedirebbe all'admin anche le modifiche legittime tra `none` e `admin`).

**Checklist di chiusura sottofase**:
- [ ] Migrazione generata, committata e applicata su Cloud SQL prod **prima** del push.
- [ ] Prova per ruolo: super-admin, admin, manager (`adminRole`), manager (solo `appRole`), manager con entrambi, utente senza ruoli.
- [ ] **Escalation a super-admin** (audit F1, `po-10`): un `admin` che imposta `adminRole: super-admin` su sé stesso o su un altro admin è rifiutato, via REST (anche `PATCH /api/users?where=…`) e via Local API con `overrideAccess: false`. L'8.3 non si chiude senza questa prova: la correzione arrivi o no dal template, il controllo di riferimento è il blocco «Controllo di F1» della voce 9.
- [ ] Utente con `active: false` e cookie ancora valido: `canAccessSection` falsa per le tre sezioni e 403 su ogni risorsa (helper `isActiveUser` della 7.0; audit F2).
- [ ] Super-admin con `appRole: none`: login Google su `/app/login` → `/app`; `adminRole: manager` senza `appRole`: rifiutato con il messaggio generico (audit M3). Prerequisito: il dominio dell'utente di prova ha `allowApp` vero in «Identità autorizzate».
- [ ] Un utente con `adminRole` diverso da `none` e `hash`/`salt` residui (creato come utente App con login locale e poi promosso con `loginMethod: sso`) è rifiutato da `POST /api/users/login/app`, con `appRole: manager` e con `appRole: none`. Procedura sul database di sviluppo: (1) creare dall'Admin un utente `adminRole: none`, `appRole: manager`, `loginMethod: local`, con password; (2) **verificare l'email** (link di attivazione, oppure in sviluppo `update users set email_verified = true where email = '…'`): senza, ogni login dell'App è rifiutato e la prova non dimostra nulla; (3) **controllo positivo**: `curl -i -X POST http://localhost:3000/api/users/login/app --data-urlencode 'email=…' --data-urlencode 'password=…'` risponde 302 a `/app`; (4) promuoverlo con `PATCH` (con il cookie di un admin o super-admin, per esempio la sessione dell'Admin) a `adminRole: admin` e `loginMethod: sso` (la password non viene toccata, `hash` e `salt` restano); (5) lo stesso `curl` ora risponde 302 a `/app/login?authFailed=1`, con `appRole: manager` e dopo averlo portato a `appRole: none`; (6) eliminare l'utente di prova (audit R1, S1).
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

**Contenuto dell'email «Account creato»** (italiano): l'indirizzo dell'Admin (`/admin`) se `adminRole` non è `none`, e/o dell'App (`/app/login`) se `appRole` non è `none` oppure `adminRole` è `admin` o `super-admin` (accesso derivato, ADR-113 §3); l'indicazione di accedere con l'account Google del dominio; a chi rivolgersi per problemi di accesso (testo generico, «chi ti ha creato l'account», salvo diversa indicazione). Gli indirizzi si costruiscono con `APP_PUBLIC_URL`. Nota: l'accesso all'App con Google richiede che il dominio dell'utente abbia `allowApp` vero in «Identità autorizzate»; l'email non lo garantisce.

**Pulsante «Reinvia email di attivazione»** nel form utente dell'Admin:
- **Visibile** se il login include la modalità locale ed `emailVerified` è falso; non per gli utenti solo SSO né per quelli già verificati.
- **Chi può premerlo**: admin e super-admin.
- **Effetto**: genera un nuovo token di verifica e invia l'email. Il token è uno solo: **il link precedente smette di funzionare**.
- **Esito**: messaggio all'admin di invio riuscito o di errore generico, senza dettagli del provider. Le email di sistema verso gli utenti restano come oggi (un errore di invio finisce solo nel log).
- **Realizzazione**: un endpoint con controllo del ruolo e un componente del form (classe A).

**Prove**: in sviluppo con invio reale (come in Fase 2.6); in produzione nella 8.6.

**Checklist di chiusura sottofase**:
- [ ] Le cinque righe della tabella verificate, comprese quelle senza invio: una seconda attivazione non rimanda l'email.
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
- [ ] Prova per ruolo: il manager modifica e salva; l'admin pure; un utente senza ruolo è rifiutato. La prova dell'admin si fa sia dopo un login su `/app/login` sia con la sessione aperta dall'Admin: `canAccessSection` è l'unica guardia, nessuna rotta richiede una strategia di login specifica.
- [ ] Un valore non `HH:mm` viene rifiutato; le righe del pulsante festività corrispondono a quelle dell'Admin.
- [ ] Le modifiche si vedono nell'Admin (admin e super-admin) e viceversa.
- [ ] CHANGELOG.

---

## 8.6 — Verifica in produzione di login locale ed email

**Stato**: ⏸ bloccata

**Condizione di sblocco**: sezioni dell'App sviluppate (6.6 e 8.5; `arco-36`, `arco-37`). **Vincolo**: da completare prima del primo accesso reale dei manager (`po-03`).

**Perché**: login locale dell'App ed email di attivazione sono coperti solo in sviluppo (Fase 2.10). In Fase 3.3 non sono stati rieseguiti in produzione; la chiave Resend risulta montata su Cloud Run (conferma dell'umano, non verificata sul servizio).

**Debito tecnico (documentato, fuori perimetro 7.4 — da affrontare in questa sottofase o prima del primo manager reale)**:
1. **`hashLocalPassword`** (`lib/auth/localCredentials/hash.ts`): oggi scrive ancora hash **legacy** (PBKDF2 25.000 iter, 512 byte hex), mentre Payload 3.90.2 su `update` con `enableFields` usa **`pbkdf2-sha256-v1:`** (600.000 iter, 32 byte). Allineare la creazione/hash dell’hook al formato v1 così create e update non divergono. **`verifyLocalPassword`** accetta già entrambi i formati (commit `efc9f30`, CHANGELOG Fixed).
2. **Commento in `hashLocalCredentialsBeforeChange.ts`**: descrive Payload che hash in update con `enableFields`, ma l’hook sovrascrive con legacy in create; il testo non riflette più il comportamento reale su `update` (Payload v1 vs hook legacy). Aggiornare commento quando si allinea `hashLocalPassword`.

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
