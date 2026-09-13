---
stato: validato
---

# Fase 2 — Variante provider auth: Google OAuth

> Istruzioni operative per le sottofasi **2.3, 2.4, 2.5** (e integrazione di **2.10**) di `fase-2-login.md`. Da allegare insieme a `fase-2-login.md` nella chat dedicata a quella sottofase. Vedi anche `auth/01a-google-oauth.mdc` nel catalogo regole per le convenzioni architetturali che questa variante rispetta.

---

## 2.3 — Setup credenziali Google OAuth

**Questo è un passaggio esterno a Cursor.**

**Checklist per l'umano**:
- Creare (o riusare) un progetto su Google Cloud Console.
- Configurare l'OAuth consent screen in modalità **Internal** (limitato all'organizzazione Google Workspace) — o **External** se il progetto non ha un Workspace organizzativo (vedi nota sotto).
- Creare credenziali OAuth 2.0 (Client ID e Client Secret) di tipo "Web application".
- Registrare i redirect URI necessari — **attenzione**: serviranno redirect URI distinti per l'istanza Admin e per l'istanza App (vedi 2.4/2.5), sia per l'ambiente locale (`http://localhost:3000/...`) sia, più avanti, per l'ambiente di produzione (vedi Fase 3).
- Scope richiesti: `openid`, `email`, `profile`.
- Comunicare all'agente Client ID e Client Secret (da inserire come variabili d'ambiente, mai hardcoded).

**Checklist per l'agente (dopo conferma umana)**:
- Salvare Client ID/Secret come variabili d'ambiente (`.env`, non committate).
- Verificare che `.gitignore` le escluda.
- Documentare in una nota operativa interna dove/come si trovano queste credenziali per chi gestirà il sistema in futuro.

**Nota**: il codice deve essere scritto in modo da funzionare identicamente se in futuro il progetto Google Cloud passerà da Internal a External (o viceversa), senza refactoring — Client ID, Secret, redirect URI, scope restano gli stessi tra le due modalità. Il lavoro di branding specifico per External (homepage separata, privacy policy, dominio verificato) è fuori scope qui.

---

## 2.4 — Plugin `payload-oauth2` — istanza Admin

**Obiettivo**: login Google funzionante su `/admin`, con validazione dominio e whitelist-per-record.

**Checklist**:
- Installare `payload-oauth2`. **Prima di procedere**: verificare la compatibilità della versione del plugin con la versione di Payload in uso in questo progetto (changelog del plugin, issue aperte) — alcuni comportamenti documentati più sotto (il problema noto sul callback JWT) sono legati a versioni specifiche e potrebbero non applicarsi, o applicarsi diversamente, a una combinazione di versioni differente.
- Configurare un'istanza del plugin dedicata all'Area Admin, con `strategyName`, `authorizePath` e `callbackPath` propri e distinti da quelli dell'istanza App (2.5) — requisito tecnico del plugin, non negoziabile.
- Impostare `onUserNotFoundBehavior: "error"` per garantire la whitelist-per-record (nessun utente creato al volo).
- Implementare `getUserInfo` in modo che restituisca **solo** `email` e `sub` — mai altri campi, per non rischiare di sovrascrivere `adminRole`/`appRole`/`active` ad ogni login (vedi `auth/01a-google-oauth.mdc`).
- Implementare la validazione del claim `hd` **dentro l'hook `getToken`**, decodificando l'`id_token` direttamente — non basandosi sul solo endpoint REST `userinfo` di Google, che di norma non restituisce `hd`. Il dominio va verificato contro l'allow-list del Global (2.2).
- Un errore lanciato nell'hook deve produrre lo stesso `failureRedirect` generico già previsto per tutti gli altri casi di rifiuto.
- Configurare la login view nativa di `/admin/login` in modo che mostri **solo** il bottone Google (nessun form locale visibile qui).
- Verificare che il flusso non tocchi mai il campo `password` del record.

---

## 2.5 — Plugin `payload-oauth2` — istanza App

**Obiettivo**: login Google funzionante su `/app`, stessa logica dell'istanza Admin ma su strategyName/path distinti.

**Checklist**:
- Configurare una seconda istanza del plugin, dedicata all'Area App, con `strategyName`, `authorizePath`, `callbackPath` distinti da quelli dell'istanza Admin.
- Riusare la stessa logica di validazione `hd` e lo stesso `getUserInfo` ristretto — non duplicare la logica scrivendola due volte: estrarla in un punto condiviso se il plugin lo consente, altrimenti documentare chiaramente che le due configurazioni devono restare allineate manualmente.
- Verificare che il bottone Google sulla pagina di login custom dell'App usi questa istanza e non quella Admin.

**Attenzione — problema noto**: il callback predefinito del plugin `payload-oauth2` firma il JWT con `jose.SignJWT`, diverso da `jwtSign` nativo di Payload usato dal login locale — questo può causare un redirect fallito dopo un login riuscito (record creato in `activityLog` ma redirect su una pagina di login con errore), specialmente in combinazione con Server Components Next.js che leggono la sessione lato server. Se capita, la soluzione verificata è un callback OAuth custom registrato su `users` **prima** del plugin, che usa `jwtSign` nativo invece del callback predefinito. Documentare questa deviazione esplicitamente se necessaria: non è una violazione del piano, è un fix noto per questo plugin specifico.

---

## 2.10 (parte Google) — Verifiche specifiche del provider

Ad integrazione della checklist generica in `fase-2-login.md` § 2.10:
- Ai punti 3-4 (login SSO Admin/App): verificare che il consent screen Google mostri l'app correttamente e che il redirect post-login funzioni su entrambe le istanze.
- Al punto 6 (identità non autorizzata): testare sia il caso "utente non censito ma dominio whitelisted" sia il caso "account Google fuori dall'organizzazione Workspace" (se consent screen Internal) — quest'ultimo produce un blocco lato Google **prima** del callback applicativo, con un messaggio nativo di Google, non il messaggio generico dell'app: è un comportamento atteso, non un bug da correggere.

---

Al termine, torna a `fase-2-login.md` e prosegui con le sottofasi successive.
