# Messaggio globale — specifica di schermata (`/app/menu/message`, voce Messaggio globale)

**Stato**: design chiuso il 2026-10-15 con le risposte di Mirko alle sei domande di impostazione (messaggio senza limite di lunghezza, «Togli il messaggio» con conferma, indicatore di pubblicazione con l'ora quando il file è leggibile) e la conferma della demo; restano da confermare le assunzioni della sezione 10. È l'unica schermata del Menù che **non è un elenco**: una pagina con un solo campo, nel modello dei moduli di pagina (D7, come gli Orari).

**Si implementa in**: `fase-6` sottofase 6.6 (backoffice «Menù»; non ancora nel repo). Dipende da 8.2 (shell), 8.3 (guardia), 6.1 (Global `menu-general`), 6.4 (`disponibilita.json`: il messaggio vi entra e cambia senza ricompilare) e dalla lettura del file di disponibilità lato server (sezione 2).

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D1, D5, D6, D7, D8, D9, D10), `fase-6-menu-digitale.md` §§6.1, 6.4, 6.6, `ADR-109` §2, `ADR-112` (§3 `disponibilita.json` e lettura circa ogni cinque minuti), `schermate/orari/spec.md` (stesso modello di pagina con «Salva modifiche» e «Annulla modifiche»).

**File del pacchetto** (stessa cartella): `mockup.html` (mockup statico annotato, con un messaggio attivo) e screenshot di riferimento. Stato iniziale: `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` (pagina intera). Telefono: `390-inglese-aperto-chiaro.png`, `390-modificato-chiaro.png`, `390-salvato-chiaro.png`, `390-pubblicazione-chiaro.png`, `390-file-non-leggibile-chiaro.png`, `390-nessun-messaggio-chiaro.png`, `390-togli-chiaro.png`, `390-tolto-chiaro.png`, `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-errore-azione-chiaro.png`. Il mockup usa `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`.

---

## 1. Obiettivo e accesso

Il manager (e admin e super-admin) scrive, cambia o toglie l'avviso breve mostrato sul menù pubblico (per esempio «oggi cucina chiusa»), in italiano e, se vuole, in inglese. Il messaggio **compare senza ricompilare**: cambia `disponibilita.json`. Funziona da telefono e da notebook.

- **Accesso**: `canAccessSection(user, 'menu')`. Non autenticato → `/app/login`. Sezione non consentita non raggiungibile nemmeno dall'URL. Aggiornare il Global: staff Admin o manager App attivo (`canUpdateMenuGeneralRequest`).
- **Messaggio vuoto vuol dire nessun messaggio**: non c'è un interruttore a parte. «Togli il messaggio» svuota i due testi.
- **Fuori perimetro**: il banner di chiusura (lo compone il frontend da orari e chiusure, `fase-6` §6.1), il banner di un giorno speciale (schermata dei giorni speciali), qualunque orario.
- **Nessun pulsante «Ricompila il menù pubblico»**: non serve per questa schermata.

## 2. Collegamento ai dati

Global `menu-general` (`fase-6` §6.1), con la Local API **con la sessione dell'utente** (`overrideAccess: false`).

| Elemento | Campo | Note |
|---|---|---|
| Messaggio | `globalMessage` (testo, **localizzato**) | Facoltativo; **nessun limite di lunghezza** (decisione di Mirko, 2026-10-15; debito di verifica, sezione 10). Il campo è un testo breve: i **ritorni a capo si tolgono** mentre si scrive (diventano uno spazio) |
| Traduzione inglese | `globalMessage`, locale `en` | Facoltativa con ripiego sull'italiano (D10); badge «Presente» se non vuota, «Manca» altrimenti |

**Cosa si legge**
- Il Global, per i due testi salvati.
- **L'oggetto pubblico `disponibilita.json`**, **lato server** e solo in lettura: il documento ha `updatedAt` (ISO UTC) e, se c'è un messaggio, `globalMessage` con `it` e `en` (`ADR-112` §3). **Regola del file** (`buildGlobalMessage`): se manca un testo, il file ripete l'altro (`it` = italiano oppure inglese se l'italiano è vuoto; `en` = inglese oppure italiano); se mancano entrambi la chiave non c'è. Il server dell'App lo legge con lo stesso accesso al bucket con cui lo scrive (`resolveAvailabilityStorage().readCurrentObject()` e `parseAvailabilityJsonFromGcs`, `lib/menu/availability/`). **Non verificato su Cloud Run**; se non è leggibile (bucket non configurato, come in sviluppo, o errore) la schermata va **senza ora** (stato «file non leggibile»).
- **`updatedAt` del file, non del Global** (in produzione quello del Global non cambia con sole modifiche localizzate, osservato il 2026-10-13: `fase-6` §6.6). Il file si riscrive solo se il contenuto (senza `updatedAt`) cambia, e il suo `updatedAt` cambia anche per altre modifiche di disponibilità: per questo la schermata dice «Menù pubblico aggiornato alle {HH:mm}» (ora del file, in Europe/Rome) e **non** «messaggio pubblicato alle».

**Operazioni**: salva (scrive italiano e inglese nel Global; l'hook `afterChange` riscrive il file); togli (svuota i due testi, stesso hook).

**Effetti sul menù pubblico**
- Il file cambia in pochi secondi; **il menù pubblico lo rilegge circa ogni cinque minuti** (cache fino a 60 secondi, `ADR-112`): chi ha la pagina aperta lo vede entro circa cinque minuti, chi la apre dopo entro un minuto. Per questo gli avvisi dicono «entro pochi minuti» e non «pochi secondi».
- Se la scrittura del file fallisce, il job di riconciliazione (circa ogni 5 minuti, `ADR-112`) la ripete e il guasto sta nel registro attività; l'indicatore resta su «In pubblicazione…».

## 3. Albero blocchi → componenti → varianti

| Blocco (`data-block`) | Contenuto | Componenti |
|---|---|---|
| `topbar` | Pulsante del menu, briciola «Menù › Messaggio globale» | `SidebarTrigger`, `Separator`, `Breadcrumb` |
| `intestazione-pagina` | Titolo e descrizione | testo (`h1`, `p`) |
| `stato-pubblicato` | «Sul menù pubblico»: il messaggio presente nel file, l'ora o «In pubblicazione…» | sezione con bordo (`div`), `Spinner` |
| `modulo-messaggio` | Messaggio, traduzione inglese | `FieldGroup`, `Field`, `Textarea`, `Collapsible`, `Badge (outline)`, `FieldDescription` |
| `azioni-pagina` | «Salva modifiche», «Annulla modifiche», «Togli il messaggio» | `Button (default, lg)`, `Button (outline, lg)` |
| (stato) togli | Conferma «Togliere il messaggio?» | `AlertDialog`, `Button (destructive)`, `Button (outline)`, `Spinner` |
| (stato) caricamento, avvisi | Due blocchi; esiti ed errori | `Skeleton`, `Alert (default \| destructive)` |

## 4. Layout e regole responsive

| | Telefono (sotto 768 px) | Schermo largo (da 768 px) |
|---|---|---|
| Colonna | Tutta la larghezza, margine 16 px | Centrata, larga al massimo `max-w-2xl` (42 rem): una pagina di un solo campo non ha bisogno di più |
| Pulsanti di pagina | In colonna a tutta larghezza: «Salva modifiche», «Annulla modifiche», «Togli il messaggio» | In riga: «Salva modifiche» e «Annulla modifiche» a sinistra, «Togli il messaggio» a destra (`sm:ml-auto`) |
| Messaggio | Area di testo di tre righe, a tutta larghezza | Idem |
| Dimensioni dei controlli | Dispositivo touch (`pointer-coarse`): ≥ 44 px (D6) | Con mouse: misure standard di Nova |

Nessuno scorrimento orizzontale a 360, 390 e 1280 px.

## 5. Stati

| Stato | Cosa si vede | Riferimento |
|---|---|---|
| Messaggio attivo (iniziale) | Riquadro «Sul menù pubblico» con il testo e «Menù pubblico aggiornato alle {ora}»; campo con lo stesso testo; «Salva modifiche» e «Annulla modifiche» disabilitati; «Togli il messaggio» attivo | `*-chiaro.png`, `*-scuro.png` |
| Modificato | Il testo del campo cambia; «Salva modifiche» e «Annulla modifiche» si attivano | `390-modificato-chiaro.png` |
| Traduzione inglese aperta | Message con il suggerimento sul ripiego | `390-inglese-aperto-chiaro.png` |
| Salvato | Avviso «Messaggio salvato»; il riquadro mostra il nuovo testo e l'ora del file | `390-salvato-chiaro.png` |
| In pubblicazione | Il file non ha ancora il testo salvato: nel riquadro resta il testo vecchio con «In pubblicazione…» e uno `Spinner` | `390-pubblicazione-chiaro.png` |
| File non leggibile | Nessuna ora e nessun «In pubblicazione…»: il riquadro dice «Messaggio salvato: «{testo}»» | `390-file-non-leggibile-chiaro.png` |
| Nessun messaggio | Il riquadro dice «Nessun messaggio.»; campo vuoto; «Togli il messaggio» non c'è | `390-nessun-messaggio-chiaro.png` |
| Togli | Finestra «Togliere il messaggio?», «Il testo si perde.» | `390-togli-chiaro.png` |
| Tolto | Avviso «Messaggio tolto»; il riquadro dice «Nessun messaggio.» | `390-tolto-chiaro.png` |
| Errore dell'azione | Avviso rosso; nulla cambia | `390-errore-azione-chiaro.png` |
| Caricamento, errore di caricamento | Due blocchi `Skeleton`; solo avviso rosso con «Riprova» | `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png` |

## 6. Testi

Tutti in italiano; `{…}` sono dinamici.

| Dove | Testo |
|---|---|
| Titolo | Messaggio globale / Un avviso breve sul menù pubblico, per esempio «oggi cucina chiusa». Compare senza ricompilare. |
| Riquadro | «Sul menù pubblico» / «{testo del file}» oppure «Nessun messaggio.» / «Menù pubblico aggiornato alle {HH:mm}. Chi ha la pagina aperta lo vede entro circa cinque minuti.» oppure «In pubblicazione…» / con il file non leggibile: «Messaggio salvato: «{testo}»» oppure «Nessun messaggio.» e nessuna riga sull'ora |
| Campo | Messaggio («Un avviso breve, per esempio «oggi cucina chiusa». Vuoto vuol dire nessun messaggio.») · «Traduzione inglese (facoltativa)» con «Manca» o «Presente», Message («Facoltativa. Se resta vuota, il menù mostra il testo italiano.») |
| Pulsanti | Salva modifiche («Salvataggio…») · Annulla modifiche · Togli il messaggio |
| Avvisi | Messaggio salvato / «Il menù pubblico lo mostra entro pochi minuti.» · Messaggio tolto / «Il menù pubblico non lo mostra più entro pochi minuti.» |
| Togli | «Togliere il messaggio?» / «Il testo si perde.» / Indietro, Togli |
| Errore dell'azione | Operazione non riuscita / Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore. |
| Errore di caricamento | Impossibile caricare il messaggio / Riprova tra qualche istante; se il problema continua, avvisa l’amministratore. / Riprova |

## 7. Comportamenti

1. **Modello di pagina** (D7): «Salva modifiche» e «Annulla modifiche» sono attivi solo se qualcosa è cambiato rispetto al salvato; «Annulla modifiche» ripristina il salvato. Il salvataggio non chiede conferma.
2. **Salvataggio**: scrive i due testi, mostra l'avviso e avvia l'indicatore. Mentre si salva i pulsanti sono disabilitati e c'è lo `Spinner`; in errore l'avviso rosso lascia il campo com'è.
3. **Indicatore di pubblicazione**: dopo il salvataggio la schermata rilegge il file (lato server) finché contiene il testo salvato (il confronto usa la regola del file: il testo italiano, o l'inglese se l'italiano è vuoto); fino ad allora dice «In pubblicazione…» con il testo vecchio. Quando il testo coincide mostra l'ora del file. Se il file non è leggibile non mostra l'ora né «In pubblicazione…». Se la scrittura del file tarda o fallisce, l'indicatore resta su «In pubblicazione…» finché il job di riconciliazione non la ripete (circa 5 minuti): non c'è un tempo massimo a schermo.
4. **Togli il messaggio**: il pulsante c'è solo se esiste un messaggio salvato; apre la conferma; «Togli» svuota i due testi, mostra l'avviso e riporta la pagina allo stato «Nessun messaggio». Se fallisce nulla cambia e compare l'errore.
5. **A capo**: il campo non accetta ritorni a capo (diventano spazi), anche incollando.
6. **Spazi ai bordi**: si tolgono al salvataggio.
7. **Nessun limite di lunghezza**: scelta di Mirko; una lunghezza eccessiva si valuta nell'uso reale (sezione 10).
8. **Tema e tocco**: come D4 e D6.

## 8. Componenti da installare e da comporre

- **Da installare**: nessun componente oltre a quelli già richiesti da Orari e dalle altre schermate del Menù (`textarea`, `collapsible`, `alert-dialog`, `skeleton`, `alert`, `badge`, `spinner`).
- **Componenti di composizione** (`components/app/`, solo con componenti di `components/ui`): barra dei pulsanti di pagina (come negli Orari), riquadro «Sul menù pubblico», conferma «Togli il messaggio».
- **Eccezioni alla regola UI** (`ui-check-allow`): nessuna.
- **Logica pura in `lib/`** (con test): pulizia del testo (ritorni a capo e spazi ai bordi), **riassunto del file pubblicato** (da `disponibilita.json`: messaggio italiano effettivo e `updatedAt`, con ritorno `null` se non leggibile o non valido) e **testo effettivo di un messaggio** (la regola di `buildGlobalMessage`, per il confronto con il file) e formato dell'ora in Europe/Rome.

## 9. Checklist di accettazione

Si verifica con Playwright. Controlli comuni **C1–C10** di `modello-specifica-schermata.md`. Specifici:

1. **Nessuno scorrimento orizzontale** a 360, 390 e 1280 px in tutte le viste. *Misurato nel prototipo il 2026-10-15 in pagina, con la traduzione aperta e con la conferma «Togli»: nessuno.*
2. **Aree di tocco** a 390 px con tocco simulato (C2): nessun elemento sotto 44 px. *Misurato nel prototipo nelle stesse viste: nessuno.*
3. **Pulsanti di pagina**: «Salva modifiche» e «Annulla modifiche» disabilitati senza modifiche, attivi con modifiche; «Annulla modifiche» ripristina il salvato; «Togli il messaggio» presente solo con un messaggio salvato. *Provato nel prototipo, «Annulla modifiche» compreso.*
4. **A capo**: «Domani chiusi» + ritorno a capo + «per ferie.» diventa «Domani chiusi per ferie.», anche incollando. *Provato nel prototipo inserendo un testo con un ritorno a capo; l'incolla non provato.*
5. **Salvataggio e pubblicazione**: dopo «Salva modifiche» compare «Messaggio salvato» e il riquadro mostra il nuovo testo con l'ora del file; con la pubblicazione lenta compare «In pubblicazione…» finché il file non ha il testo. *Provato nel prototipo.*
6. **File non leggibile**: senza bucket (o con errore di lettura) il riquadro mostra «Messaggio salvato: «{testo}»» senza ora e senza «In pubblicazione…». *Provato nel prototipo.*
7. **Lettura del file lato server**: con il bucket configurato la schermata legge `disponibilita.json` con le credenziali del servizio e mostra `updatedAt` in Europe/Rome; con un oggetto non valido o assente si comporta come «file non leggibile». *Non verificato su Cloud Run.*
8. **Il file riceve il messaggio**: dopo il salvataggio `disponibilita.json` contiene `globalMessage.it` e `globalMessage.en` (con un solo testo compilato, il file ripete l'altro, come in `buildGlobalMessage`); dopo «Togli» la chiave `globalMessage` non c'è; con solo l'inglese compilato l'indicatore confronta l'inglese.
9. **Togli**: conferma; svuota i due testi; avviso «Messaggio tolto»; il riquadro dice «Nessun messaggio.» e il pulsante sparisce. *Provato nel prototipo.*
10. **Lingue**: traduzione chiusa per default e aperta se esiste; con l'inglese vuoto una lettura `locale=en` ricade sull'italiano.
11. **Permessi**: manager (`appRole`), admin e super-admin possono salvare e togliere; un utente senza ruolo no (`canUpdateMenuGeneralRequest`); la lettura del Global per la pagina usa la sessione dell'utente.
12. **Stati e testi**: come negli screenshot e nella sezione 6.
13. **Temi, accesso, `pnpm ui:check`**: C3, C4 (`canAccessSection(user, 'menu')`), C9.
14. **Confronto visivo** con i PNG di riferimento a 390 e 1280 px, in tema chiaro e scuro (C10).

## 10. Scelte confermate, assunzioni e debiti

**Scelte confermate da Mirko il 2026-10-15**
- **Nessun limite di lunghezza**, con un debito di verifica nell'uso reale.
- **«Togli il messaggio» con conferma breve** («Il testo si perde.»).
- **Indicatore di pubblicazione con l'ora** letta da `disponibilita.json`, se possibile; altrimenti senza ora (verificato nel codice: possibile lato server; ripiego «file non leggibile»).
- **«Entro pochi minuti»** al posto di «entro pochi secondi» in tutti gli avvisi (anche delle altre schermate).

**Assunzioni ancora da confermare** (il design le usa; vanno confermate prima di consegnare la schermata a Cursor)
1. **Area di testo di tre righe** e non un campo di una riga, perché senza limite il testo può essere lungo; i ritorni a capo si tolgono.
2. **Etichetta «Menù pubblico aggiornato alle {ora}»**: è l'ora del file (che cambia anche per altre modifiche di disponibilità), non quella del messaggio.
3. **«In pubblicazione…» senza tempo massimo**: nessun avviso di ritardo oltre l'indicatore.
4. **«Annulla modifiche» e «Salva modifiche»** come negli Orari, invece di un solo «Salva».
5. **Nessuna anteprima** di come appare il banner sul menù pubblico.

**Debiti futuri e punti aperti**
- **Lunghezza del messaggio**: verificare nell'uso reale e con il frontend (6.7) come si comporta un testo lungo nel banner; se serve, un tetto (anche solo nell'interfaccia) e un contatore.
- **Lettura di `disponibilita.json` lato server**: da provare su Cloud Run (permessi del servizio sul bucket in lettura) e in sviluppo con `MENU_AVAILABILITY_IN_MEMORY`.
- **Messaggio per fascia o per data** (per esempio «solo stasera»): non previsto; per quello esistono i giorni speciali.
- **Testo libero a locale chiuso** (`messaggioChiusura` del prototipo originale): non si porta; se servirà si aggiunge dopo con una migrazione (`fase-6` §6.1).
