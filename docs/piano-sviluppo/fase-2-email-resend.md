---
stato: validato
---

# Fase 2 — Variante provider email: Resend

> Istruzioni operative per la parte di invio email della sottofase **2.6** di `fase-2-login.md`. Da allegare insieme a `fase-2-login.md` nella chat dedicata a quella sottofase. Vedi anche `email/01a-resend.mdc` nel catalogo regole per le convenzioni che questa variante rispetta.

---

## 2.6 (parte email) — Invio email di attivazione e reset password via Resend

**Scelta del dominio mittente — decisione da prendere qui, non vincolata**: prima di configurare `RESEND_FROM_ADDRESS`, scegliere tra due percorsi, entrambi legittimi:
- **(a) Restare sul sandbox Resend** (`onboarding@resend.dev` o equivalente) e rimandare la verifica di un dominio reale alla Fase 3 (§3.2 di `fase-3-deploy.md`) — più veloce ora, ma il sandbox non invia a indirizzi arbitrari: non permette di validare la deliverability reale (finire in spam, blacklist) prima del deploy.
- **(b) Verificare già ora un sottodominio dedicato all'invio transazionale** (consigliato) — del dominio finale del progetto se già noto, oppure di un dominio di sviluppo già posseduto (es. `dev-mail.tuodominio.it`, riusabile su più progetti) se il dominio finale non è ancora deciso. Permette di testare la deliverability reale fin da questa sottofase. **Sempre un sottodominio, mai il dominio radice**: isola la reputazione di invio ed evita conflitti con l'SPF/MX già esistente sul dominio radice per la posta reale dell'azienda.

Se si sceglie (b) con un dominio diverso da quello finale del progetto, annotarlo esplicitamente (es. in cima a `00-piano-generale.md`): andrà sostituito con il dominio reale prima del go-live (vedi `fase-3-deploy.md` §3.2).

**Scelta di progetto (2026-09-20)**: percorso **(b) sottodominio verificato**. Sottodominio **`mail.vietnamonamour.com`** — stato **Verified** in Resend. Mittente: `info@mail.vietnamonamour.com`, nome «Backoffice - Vietnamonamour». Credenziali in `.env` (`RESEND_API_KEY`, `RESEND_FROM_*`). Test invio (attivazione/reset) da chiudere in 2.6 / spike 2.10.

**Checklist**:
- **Prima di procedere**: verificare la compatibilità della versione di `@payloadcms/email-resend` con la versione di Payload in uso in questo progetto — il comportamento sulla durata reale dei token descritto più sotto è stato verificato su una versione specifica e potrebbe differire su un'altra.
- Configurare l'adapter `@payloadcms/email-resend` in `payload.config.ts`.
- Variabili d'ambiente: `RESEND_API_KEY`, `RESEND_FROM_ADDRESS`, `RESEND_FROM_NAME` — in `.env`/`.env.example`, mai hardcoded.
- Se l'autenticazione locale disabilita la strategia nativa Payload (`disableLocalStrategy`, spesso necessario per convivere con un login SSO sulla stessa collection — vedi `auth/01-autenticazione-invarianti.mdc`), il flusso automatico nativo di invio email all'attivazione **non parte da solo**: va agganciato esplicitamente via hook (es. `afterChange` al create di un utente locale).
- Costruire le pagine di verifica email e reset password lato App (non quelle native `/admin/...`, bloccate da `disableLocalStrategy`): un link di attivazione dedicato (es. `/app/login/verify?token=...`), una pagina di conferma con esito, endpoint dedicati per richiesta/conferma reset.
- Evitare invii duplicati: se un hook custom invia già l'email di verifica, assicurarsi che il flusso nativo di Payload (se ancora parzialmente attivo) non ne invii una seconda.


**Admin UX — campo `emailVerified`**: il campo (schema in `fase-2-login.md` §2.1) ha `default: false` e va aggiornato **solo** dall'hook che processa la conferma del token — mai esposto come checkbox liberamente modificabile nel form Admin. Uno staff Admin non deve poter marcare "email confermata" a mano: vanificherebbe lo scopo della verifica.

**Verifica obbligatoria — durata reale dei token** (vedi `email/01-email-invarianti.mdc`): non fidarsi del valore dichiarato in specifica o documentazione. In Event Manager, a fronte di una specifica che dichiarava 24h per entrambi i token, il comportamento verificato nella versione di Payload in uso era: reset password con scadenza reale di **1 ora** (`forgotPassword.expiration` di default), token di verifica email **senza scadenza lato server**. Verificare il comportamento reale sulla versione di Payload del progetto corrente e documentarlo, senza introdurre configurazione custom per "correggerlo" se non esplicitamente richiesto.

**Verificato su Payload 3.89.0 (2026-09-20, lettura del sorgente in `node_modules/payload`)**:
- reset password: scadenza **1 ora** (`3600000` ms — `forgotPassword.expiration` di default in `forgotPasswordOperation`);
- token di verifica email nativo: **nessun controllo di scadenza lato server** (`verifyEmailOperation` confronta solo `_verificationToken`).
Su questo progetto le operazioni native `forgotPassword` / `resetPassword` / `verifyEmail` sono `Forbidden` con `disableLocalStrategy`: gli endpoint App (`/forgot-password/app`, `/reset-password/app`, pagina `/app/login/verify`) replicano gli stessi default, senza scadenza sul token di attivazione. Nessuna configurazione custom introdotta per “correggere” i valori.

**Limite noto Resend — allegati con `content_id` (CID)**: se in fasi successive del progetto servirà incorporare immagini inline in un'email (es. un QR code nel corpo, non come allegato scaricabile), l'adapter `@payloadcms/email-resend` non lo supporta: servirà una chiamata REST diretta all'API Resend per quell'invio specifico. Non riguarda questa sottofase (qui le email sono solo testuali/link), ma va tenuto presente per non essere sorpresi più avanti.

---

Al termine, torna a `fase-2-login.md`, sottofase 2.6, e completa la checklist generica lì elencata (form, verifica password, messaggio di rifiuto) prima di passare a 2.7.
