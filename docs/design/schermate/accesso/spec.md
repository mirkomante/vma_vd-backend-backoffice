# Accesso — specifica delle quattro pagine (`/app/login`, `forgot`, `reset`, `verify`)

**Stato**: chiusa il 2026-10-10. Le scelte della sezione 10 sono state confermate da Mirko lo stesso giorno.

**Si implementa in**: `fase-8-shell-app.md` §8.2 (migrazione ai componenti shadcn). **Non cambia i flussi, le rotte, i campi né i messaggi**: cambia solo il livello presentazionale. Il login e il reset non devono regredire (checklist di 8.2).

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D11), `fase-2-login.md`, `fase-8-shell-app.md` §8.2, `lib/auth/loginMessages.ts`, `lib/auth/localEmail/messages.ts`, `.cursor/rules/auth/` (invarianti dell'autenticazione).

**File del pacchetto** (stessa cartella): mockup statici `mockup-login.html`, `mockup-forgot.html`, `mockup-reset.html`, `mockup-verify.html` (stato iniziale di ciascuna pagina) e screenshot di riferimento. Login: `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png`. Stati su telefono: `390-login-errore-chiaro.png`, `390-login-reset-ok-chiaro.png`, `390-forgot-chiaro.png`, `390-forgot-inviata-chiaro.png`, `390-reset-chiaro.png`, `390-reset-fallito-chiaro.png`, `390-reset-senza-token-chiaro.png`, `390-verify-ok-chiaro.png`, `390-verify-fallita-chiaro.png`. Notebook: `1280-login-errore-chiaro.png`. I mockup usano `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`.

---

## 1. Obiettivo e accesso

Chi ha un account dell'App entra con Google o con email e password, recupera la password, la reimposta dal link ricevuto, o conferma l'indirizzo dal link dell'email di attivazione.

- Le pagine sono **pubbliche** (nessuna guardia) e **non stanno nella shell**: nessuna barra laterale né barra in alto.
- **Fuori perimetro**: l'accesso all'Admin (resta il Payload standard); l'invio delle email (`fase-8` §8.4); la logica di accesso (`lib/auth/**`).

## 2. Collegamento ai dati

I moduli sono **form HTML nativi con POST**, senza JavaScript: l'esito torna come reindirizzamento con un parametro nell'indirizzo. Il design non cambia questo meccanismo.

| Pagina | Invio | Campi | Parametri nell'indirizzo |
|---|---|---|---|
| `/app/login` | `POST /api/users/login/app`; Google: collegamento a `googleOAuthAppAuthorizeHref()` | `email` (`autocomplete="username"`), `password` (`current-password`), entrambi obbligatori | `authFailed=1` (accesso rifiutato), `reset=1` (password aggiornata) |
| `/app/login/forgot` | `POST /api/users/forgot-password/app` | `email` (`username`), obbligatoria | `sent=1` (richiesta inviata) |
| `/app/login/reset` | `POST /api/users/reset-password/app` | `token` (nascosto), `password` (`new-password`, almeno 8 caratteri), obbligatoria | `token` (nell'indirizzo), `resetFailed=1` |
| `/app/login/verify` | nessuno: il link porta già il `token`, verificato dal server (`verifyAppEmailToken`) | — | `token` |

**Messaggi** (di `lib/`, **non si riscrivono**):
- `GENERIC_LOGIN_FAILURE_MESSAGE`: «Accesso non riuscito. Se ritieni di dover avere accesso, contatta l’amministratore.»
- `RESET_SUCCESS_MESSAGE`: «Password aggiornata. Puoi accedere con le nuove credenziali.»
- `GENERIC_FORGOT_PASSWORD_SENT_MESSAGE`: «Se l’indirizzo è in archivio, riceverai un’email con le istruzioni. Controlla anche lo spam.»
- `GENERIC_RESET_FAILURE_MESSAGE`: «Il link non è valido o è scaduto. Se ritieni di dover avere accesso, contatta l’amministratore.»
- `VERIFY_SUCCESS_MESSAGE`: «Indirizzo confermato. Puoi accedere all’Area App.»
- `GENERIC_VERIFY_FAILURE_MESSAGE`: «Il link non è valido o è già stato usato. Se ritieni di dover avere accesso, contatta l’amministratore.»

## 3. Albero blocchi → componenti → varianti

Comune alle quattro pagine (`data-block` dai mockup):

| Blocco | Contenuto | Componenti |
|---|---|---|
| `pagina-accesso` | Pagina centrata, margine 16 px (24 px da `md`) | composizione |
| `intestazione-accesso` | Icona in un quadrato con `bg-primary`, titolo (`h1`), descrizione | testo |
| (scheda) | Contiene avvisi, pulsanti e modulo | `Card`, `CardContent` |
| `avviso` | Esito o errore, con icona | `Alert (default | destructive)`, `AlertDescription` |
| Pulsante Google (login) | «Accedi con Google», collegamento a tutta larghezza; **accesso principale** | `<a>` con le classi di `buttonVariants({ size: "lg" })` (aspetto di `Button (default, lg)`; è un collegamento: niente `Button render`, vedi la regola UI) |
| `separatore-oppure` (login) | Linea, «oppure», linea | `Separator` ×2 |
| `modulo-accesso` | Campi e pulsante di invio | `FieldGroup`, `Field`, `FieldLabel`, `Input`, `Button (default, lg)` nelle pagine con il solo modulo (forgot, reset); `Button (outline, lg)` nel login, dove è l'accesso secondario |
| `collegamenti` | Collegamenti sotto la scheda | `<a>` o `Link` con le classi di `buttonVariants({ variant: "link" })`, sottolineati (aspetto di `Button (link)`; niente `Button render`, vedi la regola UI) |

Pagine: **login** (avviso facoltativo, Google, separatore, modulo email e password, «Password dimenticata?», «Torna al sito»); **forgot** (avviso facoltativo, modulo con la sola email, «Torna al login»); **reset** (avviso facoltativo, modulo con la nuova password se c'è il token, «Torna al login»); **verify** (solo l'avviso, «Vai al login»).

## 4. Layout e regole responsive

- Colonna centrata, larga al massimo `max-w-sm` (24 rem), al centro della pagina in verticale e in orizzontale (`min-h-dvh`); margine 16 px sotto `md`, 24 px da `md`.
- Su telefono e su notebook il disegno è lo stesso: cambia solo la distanza dai bordi. Nessuna differenza di struttura tra i due.
- Pulsanti e campi a tutta larghezza della scheda; collegamenti centrati sotto la scheda.
- **Dimensioni dei controlli**: dispositivo touch (`pointer-coarse`): ≥ 44 px (D6); con mouse, misure standard di Nova.
- Nessuno scorrimento orizzontale a 360, 390 e 1280 px.

## 5. Stati

| Pagina | Stato | Cosa si vede | Riferimento |
|---|---|---|---|
| login | Iniziale | Intestazione, scheda con Google, «oppure», campi e «Accedi», collegamenti | `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` |
| login | Accesso rifiutato (`authFailed=1`) | Avviso rosso in testa alla scheda | `390-login-errore-chiaro.png`, `1280-login-errore-chiaro.png` |
| login | Password aggiornata (`reset=1`) | Avviso di conferma in testa alla scheda | `390-login-reset-ok-chiaro.png` |
| forgot | Iniziale | Descrizione, campo email, «Invia istruzioni» | `390-forgot-chiaro.png` |
| forgot | Richiesta inviata (`sent=1`) | Avviso di conferma sopra il modulo | `390-forgot-inviata-chiaro.png` |
| reset | Iniziale (token presente) | Descrizione con la regola della password, campo, «Aggiorna password» | `390-reset-chiaro.png` |
| reset | Link scaduto (`resetFailed=1`, token presente) | Avviso rosso e il modulo | `390-reset-fallito-chiaro.png` |
| reset | Senza token | Avviso rosso, **nessun modulo** | `390-reset-senza-token-chiaro.png` |
| verify | Link valido | Avviso di conferma | `390-verify-ok-chiaro.png` |
| verify | Link non valido o già usato | Avviso rosso | `390-verify-fallita-chiaro.png` |

I moduli sono invii nativi: **non c'è uno stato «invio in corso»** (la pagina si ricarica con l'esito).

## 6. Testi

Tutti in italiano. I messaggi degli avvisi sono quelli di `lib/` (sezione 2).

| Pagina | Testi |
|---|---|
| login | Titolo «Area App»; descrizione «Accedi con Google oppure con email e password.»; pulsanti «Accedi con Google» e «Accedi»; separatore «oppure»; campi «Email» e «Password»; collegamenti «Password dimenticata?» e «Torna al sito» (porta a `/`) |
| forgot | Titolo «Password dimenticata»; descrizione «Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.»; campo «Email»; pulsante «Invia istruzioni»; collegamento «Torna al login» |
| reset | Titolo «Nuova password»; descrizione «Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.»; campo «Nuova password»; pulsante «Aggiorna password»; collegamento «Torna al login» |
| verify | Titolo «Conferma email»; nessuna descrizione; collegamento «Vai al login» |
| tutte | Titolo del documento «Accesso · Area App» |

Il separatore «oppure» si mostra in maiuscolo con lo stile del progetto (`uppercase`), ma il testo resta «oppure».

## 7. Comportamenti

1. **Invio**: i moduli partono con POST verso le rotte della sezione 2, senza JavaScript. Il browser controlla i campi obbligatori e la lunghezza minima prima dell'invio; i suoi messaggi di validazione sono quelli del browser, nella lingua del browser (non personalizzabili senza JavaScript).
2. **Esito**: dopo l'invio il server reindirizza con il parametro della sezione 2 e la pagina mostra l'avviso corrispondente. Un solo avviso alla volta, in testa alla scheda (login, reset, verify) o sopra il modulo (forgot).
3. **Accesso con Google**: è un collegamento (navigazione completa), non un modulo; il testo è «Accedi con Google», senza logo.
4. **Gerarchia dei pulsanti nel login**: **«Accedi con Google» è l'accesso principale** (pieno, scuro); «Accedi» con email e password è secondario (contorno). Nelle pagine con un solo modulo (forgot, reset) il pulsante di invio è pieno. *(scelta di Mirko)*
5. **Reset senza token**: nessun campo né pulsante, solo l'avviso e il collegamento al login.
6. **Avvisi**: in errore `role="alert"` e icona di errore; in conferma `role="status"` e icona di conferma. Il colore non è l'unico segnale: c'è sempre l'icona e il testo.
7. **Collegamenti**: sottolineati sempre (non solo al passaggio del mouse), in modo da riconoscerli come tali.
8. **Tema**: le pagine seguono il tema scelto sul dispositivo (D4), senza lampo; senza scelta, il tema del sistema. Non hanno il menu per cambiarlo.
9. **Rotte e parametri invariati**: il design non rinomina rotte né parametri.

## 8. Componenti da installare e da comporre

- **Da installare** (8.2): `card`, `field`, `label`, `input`, `button`, `alert`, `separator` (con le deviazioni di `installazione-componenti-ui.md`).
- **Componenti di composizione** (`components/app/`): la pagina di accesso (colonna, intestazione con icona, scheda, collegamenti), l'avviso di accesso (un `Alert` con icona e ruolo), il collegamento sottolineato (un `a` o `Link` con le classi di `buttonVariants`, variante link). Sostituiscono `components/auth/AppAuthField.tsx`, `GoogleOAuthLoginLink.tsx`, `LoginFailureNotice.tsx` e `LoginInfoNotice.tsx`, che **si eliminano** alla migrazione. `components/auth/AdminGoogleLoginBefore.tsx` è dell'Admin e resta.
- **Da rimuovere**: da `app/(app)/app-ui.css` la classe `.google-oauth-login-button` e la sua variante `:hover` (restano in `app/globals.css`, che serve l'Admin). Fatto questo `pnpm ui:check` non segnala più C2.
- **Eccezioni alla regola UI** (`ui-check-allow`): `<input type="hidden" name="token">` nel modulo di reset non è un controllo dell'interfaccia e `ui:check` lo esclude già; nessun'altra prevista. I `form` nativi sono ammessi.
- **Logica pura in `lib/`**: nessuna nuova (i messaggi e le regole restano in `lib/auth/**`).

## 9. Checklist di accettazione

Valgono i controlli comuni **C1, C2, C3, C5, C6, C9, C10** del modello di specifica (C4, C7 e C8 non si applicano: pagine pubbliche, senza dati dell'App né barre agganciate). In più:

1. **Nessuna regressione dei flussi** (checklist di 8.2): accesso con email e password; accesso con Google; richiesta di reset; reset con token valido e scaduto; conferma email con link valido e usato. Stesse rotte, stessi campi, stessi parametri.
2. **Messaggi**: ognuno è identico alla costante di `lib/` (provato confrontando il testo mostrato con la costante), nei dieci stati della sezione 5.
3. **Pagine fuori dalla shell**: nessuna barra laterale né barra in alto.
4. **Reset senza token**: nessun campo né pulsante nel documento.
5. **Collegamenti**: tutti sottolineati senza passaggio del mouse; area di tocco ≥ 44 px su touch.
6. **Campi**: nome, tipo e `autocomplete` come nella sezione 2; il campo della nuova password ha `minlength` 8.
7. **Avvisi**: `role="alert"` per gli errori, `role="status"` per le conferme; ogni avviso ha l'icona.
8. **`ui:check` pulito**: nessun colore della palette né prefisso `dark:` (oggi 17 e 14 nelle pagine di accesso e nella home), nessun elemento nativo (oggi i tre `<button class="google-oauth-login-button">`), nessuna classe personalizzata in `app-ui.css`.
9. **Tema**: chiaro, scuro e Sistema, anche a pagina appena caricata.

## 10. Scelte confermate, assunzioni e debiti

**Scelte confermate**: il design non cambia flussi, rotte, campi e messaggi (invariante dell'autenticazione).

**Scelte confermate da Mirko il 2026-10-10**
- Scheda centrata con icona e titolo sopra, al posto della colonna senza scheda di oggi.
- Collegamenti sempre sottolineati.
- Titolo del documento «Accesso · Area App».
- «Torna al sito» resta, con stile attenuato.

**Da decidere o verificare**
- **Utente già autenticato che apre `/app/login`**: oggi vede comunque la pagina di accesso; si può reindirizzare a `/app`. Non deciso.
- **Il tema nelle pagine di accesso** richiede che la scelta del dispositivo sia leggibile prima del disegno (per esempio da un cookie); è lo stesso meccanismo della shell.
- **Messaggi di validazione del browser** (campo vuoto, email non valida): nella lingua del browser. Personalizzarli richiederebbe JavaScript, in contrasto con i moduli nativi.

**Debiti futuri**
- **Togliere l'accesso con email e password** (previsto da Mirko in futuro): nel login si tolgono il separatore «oppure», il modulo e il collegamento «Password dimenticata?»; le pagine `forgot`, `reset` e `verify` non servono più. Il blocco del modulo è già separato, quindi non cambia il resto della pagina.
- Logo di Google sul pulsante; mostra password; limite di tentativi con messaggio dedicato.
