# Distillati, elenco e modulo — specifica di schermata (`/app/menu/spirits`, voce Distillati)

**Stato**: design rivisto il 2026-10-14 dopo le risposte di Mirko; restano da confermare le assunzioni della sezione 10. È la schermata dei vini senza la geografia a cascata, l'anno e il prezzo al calice, con l'invecchiamento; **senza la capacità** (i distillati si servono solo al bicchiere) e con grado e invecchiamento a scelta. Qui si dicono per intero struttura e testi, e si rimanda a `schermate/vini/spec.md` solo per ciò che è identico.

**Si implementa in**: `fase-6` sottofase 6.6 (backoffice «Menù»; non ancora nel repo). Dipende da 8.2 (shell), 8.3 (guardia), 6.2 (collection `spirits` e tassonomie), 6.4 (disponibilità), 6.5 (ricompilazione) e dalla Parte 0 di 6.6 (permessi di cancellazione e registro).

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D1, D5, D6, D8, D9, D10, D13, D14, D15), `fase-6-menu-digitale.md` §§6.1, 6.2, 6.4, 6.5, 6.6, 6.8, `ADR-108` (nota sui formati del 2026-10-14), `ADR-112` (nota sui formati del 2026-10-14), `ADR-113` (emendamento del 2026-10-14), `ADR-115` (nota del 2026-10-14), `schermate/vini/spec.md` e `schermate/piatti/spec.md`.

**File del pacchetto** (stessa cartella): `mockup.html` (mockup statico annotato) e screenshot di riferimento. Stato iniziale: `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` (pagina intera). Telefono: `390-filtri-chiaro.png`, `390-filtri-attivi-chiaro.png`, `390-modulo-chiaro.png`, `390-modulo-inglese-aperto-chiaro.png`, `390-modulo-fondo-chiaro.png`, `390-nuovo-chiaro.png`, `390-nuovo-errori-chiaro.png`, `390-disponibilita-chiaro.png`, `390-elimina-chiaro.png`, `390-eliminato-chiaro.png`, `390-piu-di-100-distillati-chiaro.png`, `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-vuoto-chiaro.png`, `390-nessun-risultato-chiaro.png`, `390-errore-azione-chiaro.png`. Notebook: `1280-modulo-chiaro.png`. Il mockup usa `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`.

---

## 1. Obiettivo e accesso

Il manager (e admin e super-admin) vede i distillati della carta per tipologia, abilita e disabilita un distillato con un tocco, crea, modifica ed elimina un distillato, e può avviare la ricompilazione del menù pubblico. Funziona da telefono e da notebook.

- **Accesso**: `canAccessSection(user, 'menu')`. Non autenticato → `/app/login`. Sezione non consentita non raggiungibile nemmeno dall'URL.
- **Cancellazione** (D14): il manager elimina un distillato, con conferma. Nessuna relazione punta ai distillati, quindi non c'è il caso «in uso» dei piatti. **Disabilitare** è l'interruttore.
- **Nessun «Terminato»**: la disponibilità è binaria (`ADR-108`, `fase-6` §6.2).
- **Si servono solo al bicchiere** (Mirko, 2026-10-14): il prezzo è unico, quello del bicchiere, e **la capacità non si gestisce nell'App**; il campo `volume` resta nella collection, invariato, come possibile integrazione futura.
- **Fuori perimetro**: le tassonomie (tipologie, paesi) si gestiscono nell'Admin; il pulsante «Ricompila il menù pubblico» è condiviso con Piatti e Vini, e la sua posizione definitiva si decide con la schermata di integrazione.

## 2. Collegamento ai dati

Collection `spirits` (`fase-6` §6.2), con la Local API **con la sessione dell'utente** (`overrideAccess: false`): il manager legge, crea, modifica e cancella (emendamento ad `ADR-113` del 2026-10-14); un utente senza ruolo non può nulla.

| Elemento | Campo | Note |
|---|---|---|
| Nome | `name` (non localizzato) | Obbligatorio. Il nome del distillato non si traduce |
| Descrizione | `description` (localizzato) | Italiano facoltativo; inglese facoltativo con ripiego sull'italiano |
| Traduzione inglese | `description`, locale `en` | Badge «Presente» se non vuota, «Manca» altrimenti |
| Invecchiamento | `aging` (testo) | Forma canonica «5 anni», «7 anni», «10 anni», «12 anni», «18 anni» o «24 anni». Select; facoltativo |
| Capacità | `volume` (testo) | **Non si gestisce nell'App**: nessun campo nel modulo né colonna in elenco. Il campo resta nella collection e l'import continua a scriverlo come oggi; si riprende solo se servirà (possibile integrazione futura) |
| Grado | `abv` (testo) | Forma canonica da «30%» a «45%», a passi di 1 (mezzi punti non previsti). Select; facoltativo. Un valore già salvato fuori elenco (come «43,5%» o «46%») resta visibile e salvabile |
| Prezzo | `price` (numero) | Obbligatorio; mostrato e scritto con la virgola. **Unico, al bicchiere**: i distillati non hanno il prezzo al calice né quello della bottiglia. L'etichetta del modulo dice «Prezzo al bicchiere (€)» |
| Tipologia | `type` → `spirit-types` | Obbligatoria; **solo scelta**, nessun pulsante per crearne |
| Paese | `country` → `countries` | Obbligatorio; opzioni: solo i paesi con `enabled` vero |
| Disabilitato | `disabled` | Assenza a tempo indefinito; l'interruttore «Disponibile» è il suo contrario |

**Interrogazioni**
- Elenco: tutti i distillati, disabilitati compresi, raggruppati per tipologia. **Ordine: per nome**, sia le tipologie sia i distillati (`ADR-112` §1). Ricerca sul nome. Filtri: tipologia, paese e stato (Tutti, Abilitati, Disabilitati). Non c'è un filtro per regione: i distillati hanno solo il paese.
- **Ricerca, filtri e ordine nella richiesta** (`where` e `sort`), non nel browser. `limit=100`, come il contratto di `ADR-112`. Lo snapshot di riferimento ha **38 distillati** (6 nascosti), lontano dal limite, ma il comportamento è lo stesso dei vini: oltre 100 compare «Mostrati 100 distillati su {totale}» con «Mostra altri distillati», che legge la pagina successiva con la stessa condizione e lo stesso ordine. Mai troncare in silenzio.
- Opzioni dei menu a tendina **filtrate nella query** (non nascoste nell'interfaccia): paesi con `enabled` vero; tipologie tutte. **Un valore già salvato resta visibile** nel campo anche se ora fuori elenco.
- Stato mostrato: **Disabilitato** se `disabled`, altrimenti **Disponibile**.
- **Validazione dei formati nel server** (D15): `abv` e `aging` della collection `spirits` hanno una funzione `validate` che accetta solo le forme canoniche (sopra) o il campo vuoto; vale per App, Admin e REST. `volume` non si valida (non lo gestisce l'App). Un valore già salvato e non modificato non blocca il salvataggio (da provare in Parte A, come per i vini). L'import (6.8) e le prove di 6.2 devono scrivere valori conformi.

**Operazioni**: abilita/disabilita (aggiorna `disabled`, effetto immediato); salva (crea o modifica, con la validazione sopra); elimina (cancellazione fisica, D14, dopo conferma).

**Effetti sul menù pubblico**
- Abilita/disabilita riscrive `disponibilita.json` (6.4), entro pochi secondi, senza ricompilazione.
- Distillati nuovi e modifiche ai contenuti compaiono **dopo la ricompilazione** (6.5): l'avviso lo ricorda.
- **Eliminazione**: l'hook `afterDelete` riscrive il file di disponibilità; il distillato sparisce dal menù pubblico alla ricompilazione; ogni cancellazione lascia una riga nel registro attività (`eventType: delete`, `area: app`, collection, identificativo, nome, nessun dato personale; `ADR-115`, nota del 2026-10-14).

## 3. Albero blocchi → componenti → varianti

Come `schermate/vini/spec.md` §3, con queste differenze (`Componente (variante, dimensione)`).

| Blocco (`data-block`) | Contenuto | Componenti |
|---|---|---|
| `topbar` | Pulsante del menu, briciola «Menù › Distillati» | `SidebarTrigger`, `Separator`, `Breadcrumb` |
| `intestazione-pagina` | Titolo, descrizione, due azioni | `Button (default, lg)` «Nuovo distillato» e `Button (outline, lg)` «Ricompila il menù pubblico» |
| `ricerca-filtri` | Ricerca (nome) e pulsante Filtri con il numero | `Input`, `Button (outline, default)`, `Badge (default)` |
| `filtri-attivi` | Etichette rimovibili | `Button (secondary, sm)` con icona |
| `gruppo-<tipologia>` | Intestazione con il conteggio, poi tabella e schede | testo (`h2`) |
| `elenco-tabella` (da 768 px) | Nome (con invecchiamento e grado sotto, badge «Disabilitato» accanto), Paese, Prezzo, Disponibile, azioni | `Table` a colonne fisse, `Badge (outline)`, `Switch`, `Button (ghost, icon)` ×2: matita e cestino |
| `elenco-schede` (sotto 768 px) | Nome, invecchiamento e grado, prezzo e paese, badge «Disabilitato», interruttore «Disponibile», matita, cestino | `Card (sm)`, `Badge (outline)`, `Switch`, `Button (ghost, icon)` ×2 |
| (stato) filtri | Foglio con Tipologia, Paese, Stato | `Sheet`, `Field`, `Select`, `Button (lg)` |
| (stato) modulo | Nuovo distillato e modifica, in quattro sezioni (`dati`, `origine`, `prezzi`, `disponibilita`) | `Sheet`, `FieldGroup`, `FieldSet`, `FieldLegend`, `Field`, `Input`, `Textarea`, `Collapsible`, `Badge (outline)`, `Select` ×4, `Switch`, `FieldDescription`, `FieldError`, `Button (lg)` |
| (stato) elimina, ricompila, caricamento, avvisi | Come i vini | `AlertDialog`, `Skeleton`, `Alert` |

## 4. Layout e regole responsive

Come `schermate/vini/spec.md` §4, con queste differenze.

| | Telefono (sotto 768 px) | Schermo largo (da 768 px) |
|---|---|---|
| Elenco | Schede: nome, «{invecchiamento} · {grado}», «{prezzo} · {paese}» a sinistra (il nome si tronca con i puntini; misurato 172 px su 358); a destra interruttore «Disponibile» con etichetta, matita, cestino | Tabella a **colonne fisse** (Paese 11 rem, Prezzo 7 rem, Disponibile 7 rem, azioni 6 rem; il resto al nome) |
| Modulo | Una colonna; Invecchiamento e Grado affiancati | Idem |

Nessuno scorrimento orizzontale a 360, 390 e 1280 px.

## 5. Stati

| Stato | Cosa si vede | Riferimento |
|---|---|---|
| Elenco | Gruppi per tipologia con il conteggio; righe disabilitate attenuate | `*-chiaro.png`, `*-scuro.png` |
| Abilita o disabilita | L'interruttore cambia, avviso «Distillato disabilitato» o «Distillato abilitato» | `390-disponibilita-chiaro.png` |
| Filtri, filtri attivi | Foglio con Tipologia, Paese, Stato; etichette rimovibili | `390-filtri-chiaro.png`, `390-filtri-attivi-chiaro.png` |
| Modulo | Dati (Nome, Invecchiamento e Grado a scelta, Descrizione, traduzione), Origine, Prezzo, Disponibilità | `390-modulo-chiaro.png`, `390-modulo-fondo-chiaro.png`, `1280-modulo-chiaro.png` |
| Traduzione inglese aperta | Description con il suggerimento sul ripiego | `390-modulo-inglese-aperto-chiaro.png` |
| Nuovo distillato, errori | Modulo vuoto; messaggi sotto i campi | `390-nuovo-chiaro.png`, `390-nuovo-errori-chiaro.png` |
| Errore dell'azione | Avviso rosso nel foglio che l'ha avviata; nulla cambia | `390-errore-azione-chiaro.png` |
| Elimina, eliminato | Conferma «Eliminare {nome}?»; avviso «Distillato eliminato» | `390-elimina-chiaro.png`, `390-eliminato-chiaro.png` |
| Più di 100 distillati | Avviso in testa con «Mostra altri distillati» | `390-piu-di-100-distillati-chiaro.png` |
| Caricamento, errore di caricamento, nessun distillato, nessun risultato | Come i vini | `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-vuoto-chiaro.png`, `390-nessun-risultato-chiaro.png` |

La conferma di ricompilazione è quella di `schermate/piatti/`.

## 6. Testi

Tutti in italiano; `{…}` sono dinamici.

| Dove | Testo |
|---|---|
| Titolo | Distillati / I distillati del ristorante. / Nuovo distillato · Ricompila il menù pubblico |
| Ricerca | Segnaposto «Cerca un distillato»; pulsante «Filtri» (con il numero); etichette rimovibili, nome accessibile «Rimuovi filtro {etichetta}» |
| Foglio filtri | Filtri / Restringi l’elenco dei distillati. / Tipologia («Tutte le tipologie» + le tipologie), Paese («Tutti i paesi» + i paesi abilitati), Stato (Tutti, Abilitati, Disabilitati) / Applica, Azzera |
| Gruppo | {Tipologia} {1 distillato \| N distillati} |
| Colonne | Nome, Paese, Prezzo, Disponibile, (Azioni, solo per lo screen reader) |
| Riga | Sotto il nome: «{invecchiamento} · {grado}» (le parti vuote non compaiono); prezzo «{9,00} €»; su telefono «{prezzo} · {paese}» |
| Stato | Badge «Disabilitato»; nome accessibile dell'interruttore «Disponibile: {nome}»; etichetta visibile «Disponibile» su telefono |
| Azioni di riga | «Modifica {nome}» ed «Elimina {nome}» (nomi accessibili, nessun testo visibile) |
| Avvisi rapidi | Distillato abilitato · Distillato disabilitato / «Il menù pubblico si aggiorna entro pochi secondi.» |
| Avvisi di salvataggio | Distillato aggiunto · Distillato salvato / «Per vederlo sul menù pubblico serve «Ricompila il menù pubblico».» |
| Elimina | «Eliminare {nome}?» / «Non si può annullare.» / Indietro, Elimina. Esito: «Distillato eliminato» / «Per toglierlo dal menù pubblico serve «Ricompila il menù pubblico».» |
| Modulo, titolo | Nuovo distillato («Il distillato compare nel menù pubblico dopo la ricompilazione.») · Modifica distillato («{nome}») |
| Modulo, sezioni | Dati: Nome, Invecchiamento e Grado (segnaposto «Scegli»; prima voce «Non indicato»; «Invecchiamento e grado si scelgono da un elenco, così i dati restano uniformi.», con in più «Un valore non in elenco resta finché non lo cambi.» se il distillato ne ha uno), Descrizione, «Traduzione inglese (facoltativa)» con «Manca» o «Presente», Description («Facoltativa. Se resta vuota, il menù mostra il testo italiano. Il nome del distillato non si traduce.») · Origine: Tipologia, Paese (segnaposto «Scegli») · Prezzo: «Prezzo al bicchiere (€)» («I distillati si servono solo al bicchiere.») · Disponibilità: «Disabilitato» («Assente a tempo indefinito: il distillato non compare nel menù.») · Salva («Salvataggio…»), Annulla |
| Errori del modulo | Campo obbligatorio. · Scegli una tipologia. · Scegli un paese. · Inserisci un prezzo valido (es. 9,50). (Invecchiamento e grado sono a scelta e non hanno errori di campo.) |
| Errori dei formati (server) | Vengono da `lib/` (funzioni `validate` di `aging` e `abv`): «L'invecchiamento deve essere uno tra: 5, 7, 10, 12, 18, 24 anni.», «Il grado deve essere un valore intero da 30% a 45%.» L'App li mostra sotto il campo indicato dal server; non si riscrivono |
| Elenco parziale | Mostrati 100 distillati su {totale} / Restringi l’elenco con la ricerca o i filtri, oppure mostra gli altri. / Mostra altri distillati |
| Errore dell'azione | Operazione non riuscita / Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore. |
| Errore di caricamento | Impossibile caricare i distillati / Riprova tra qualche istante; se il problema continua, avvisa l’amministratore. / Riprova |
| Vuoti | Nessun distillato in carta. (+ «Nuovo distillato») · Nessun risultato con questi filtri. (+ «Azzera filtri») |

**Singolare e plurale**: «1 distillato» al singolare, negli altri casi «N distillati».

## 7. Comportamenti

Quelli di `schermate/vini/spec.md` §7, tranne la cascata dell'origine, l'anno e il prezzo al calice, che qui non esistono. In sintesi:

1. **Abilita e disabilita con un tocco**: l'interruttore «Disponibile» salva subito (D9), anche sulle righe disabilitate; se fallisce nulla cambia e compare l'errore.
2. **Apertura del modulo** con la matita; il nome non è un collegamento e la scheda non è tappabile (D13).
3. **Elimina**: il cestino apre la conferma; «Elimina» cancella e mostra l'avviso; l'errore resta nella finestra. Nessun testo suggerisce di disabilitare.
4. **Traduzione inglese**: chiusa per default, si apre se esiste; il nome non ha traduzione.
5. **Grado e invecchiamento a scelta** (D15): due elenchi con la voce «Non indicato» per svuotarli. Grado da 30% a 45% a passi di 1; invecchiamento 5, 7, 10, 12, 18 o 24 anni. In elenco il grado compare come «43%», l'invecchiamento come «12 anni». Un valore già salvato fuori elenco (per esempio «43,5%», «46%» o «4 anni» importati) resta tra le opzioni e nella riga, e non impedisce di salvare altro; scegliendo un altro valore non si torna indietro.
6. **Capacità**: non c'è nel modulo né in elenco. Salvando un distillato il campo `volume` non si tocca (resta quello che c'è).
7. **Validazione**: nome obbligatorio; prezzo obbligatorio e numerico (virgola o punto, al massimo due decimali); tipologia e paese obbligatori. Con errori: nessun salvataggio, messaggi sotto i campi, primo campo non valido in vista e con il focus. Invecchiamento e grado sono a scelta e non hanno errori di campo.
8. **Salvataggio**: subito (D9), con `Spinner` e «Salvataggio…»; a buon fine il foglio si chiude e compare l'avviso che ricorda la ricompilazione; in errore l'avviso rosso resta nel foglio.
9. **Filtri e ricerca**: come nelle altre liste (D5); la ricerca trova il nome. I gruppi senza righe non compaiono.
10. **Elenco parziale**: «Mostra altri distillati» carica la pagina successiva.
11. **Ordine**: tipologie e distillati per nome, senza distinzione tra maiuscole e minuscole e con le regole dell'italiano.
12. **Tema e tocco**: come D4 e D6.

## 8. Componenti da installare e da comporre

- **Da installare**: nessun componente oltre a quelli già richiesti da shell, Orari, Prenotazioni, Piatti e Vini.
- **Componenti di composizione** (`components/app/`, solo con componenti di `components/ui`): gli stessi dei vini, con gruppo per tipologia, riga di distillato (tabella e scheda), modulo del distillato, conferma di eliminazione e pulsante «Ricompila» condivisi. **Non** servono la selezione a cascata né la casella «Senza annata».
- **Eccezioni alla regola UI** (`ui-check-allow`): nessuna.
- **Logica pura in `lib/`** (con test): stato mostrato, filtro dell'elenco, conteggio per tipologia, formato del prezzo con la virgola, testi con singolare e plurale, e **le forme canoniche di grado e invecchiamento dei distillati** (elenchi, validatori e funzioni di normalizzazione) nello stesso modulo di `lib/menu/` che serve ai vini, usato da interfaccia, funzioni `validate` e import.

## 9. Checklist di accettazione

Si verifica con Playwright. Controlli comuni **C1–C10** di `modello-specifica-schermata.md`. Specifici:

1. **Nessuno scorrimento orizzontale** a 360, 390 e 1280 px in tutte le viste (elenco, fogli, finestre, stati). *Misurato nel prototipo il 2026-10-14 in elenco, filtri, modulo, nuovo, errore sul grado, conferma di eliminazione, ricompila ed elenco parziale: nessuno.*
2. **Aree di tocco** a 390 px con tocco simulato (C2): nessun elemento sotto 44 px in tutte le viste. *Misurato nel prototipo nelle stesse viste: nessuno.*
3. **Colonna e elenco**: a 1280 px la colonna è larga 976 px; tabella da 768 px, schede sotto. *Misurato nel prototipo.*
4. **Colonne fisse**: Paese, Prezzo, Disponibile e azioni nella stessa posizione in tutti i gruppi a 1280 px.
5. **Azioni di riga**: interruttore «Disponibile», matita e cestino a 44 px, con i nomi accessibili della sezione 6; il nome non è cliccabile; nessun menu «⋯».
6. **Abilita e disabilita**: un tocco cambia lo stato, il distillato passa alla voce giusta del filtro «Stato», compare l'avviso; `disponibilita.json` cambia entro pochi secondi (dopo la 6.4).
7. **Ricompilazione**: come in Piatti.
8. **Modulo**: nome, tipologia, paese e prezzo obbligatori; focus sul primo campo non valido; il prezzo accetta «9», «9,5», «9,50» e «9.50» e rifiuta «abc» e tre decimali; l'etichetta del prezzo è «Prezzo al bicchiere (€)»; **non c'è alcun campo per la capacità**.
9. **Grado e invecchiamento**: il grado offre «Non indicato» e da 30% a 45% a passi di 1; l'invecchiamento «Non indicato», 5, 7, 10, 12, 18 e 24 anni; un valore salvato fuori elenco (grado «43,5%») resta visibile e il distillato si salva senza cambiarlo. *Provato nel prototipo.*
10. **Capacità non gestita**: salvando un distillato da App il valore di `volume` nel database non cambia; l'import continua a scriverlo come oggi.
11. **Formati dal server**: una richiesta diretta (REST o Admin) con grado «46%» o invecchiamento «4 anni» torna con il messaggio della sezione 6; con un valore canonico passa; **disabilitare un distillato che ha già un valore non canonico non fallisce** (se Payload non lo consente, si decide in Parte A come eccezione).
12. **Tassonomie a sola scelta**: Tipologia e Paese offrono solo i valori esistenti (i paesi solo con `enabled` vero: Libano non compare); nessun pulsante per crearne; nessuna eliminazione di tassonomie nell'App; un valore salvato fuori elenco resta visibile.
13. **Lingue**: traduzione chiusa per default, si apre se esiste; badge coerente; con l'inglese vuoto una lettura `locale=en` ricade sull'italiano.
14. **Eliminazione**: conferma, il distillato sparisce, compare «Distillato eliminato»; la riga di registro esiste; `disponibilita.json` non contiene più l'identificativo; consentita a manager (`appRole`), admin e super-admin, rifiutata a un utente senza ruolo.
15. **Persistenza e permessi**: nuovo e modifica si salvano con la sessione dell'utente (`overrideAccess: false`) e la rilettura dà gli stessi valori.
16. **Filtri e ricerca**: Applica e Azzera; etichette rimovibili e numero sul pulsante; con 101 distillati la richiesta restituisce 100, compare «Mostrati 100 distillati su 101» e «Mostra altri distillati» carica il centounesimo.
17. **Ordine**: tipologie e distillati per nome; ricerca, filtri e ordine arrivano dalla richiesta.
18. **Stati e testi**: come negli screenshot e nella sezione 6, singolare e plurale compresi.
19. **Temi, accesso, `pnpm ui:check`**: C3, C4 (`canAccessSection(user, 'menu')`), C9.
20. **Confronto visivo** con i PNG di riferimento a 390 e 1280 px, in tema chiaro e scuro (C10).

## 10. Scelte confermate, assunzioni e debiti

**Scelte confermate da Mirko il 2026-10-14**
- **Capacità tolta** dall'App (possibile integrazione futura, se servirà): nessun campo né colonna; `volume` resta nella collection.
- **Grado a scelta da 30% a 45%.**
- **Invecchiamento a scelta**: 5, 7, 10, 12, 18 e 24 anni.
- **Prezzo unico, al bicchiere**: i distillati si servono solo al bicchiere, non in bottiglia.
- Come i vini: interruttore «Disponibile», matita e cestino (D13, D14); «Mostra altri distillati» (confermato per i vini); validazione dei formati nel server e normalizzazione nell'import (D15).

**Assunzioni ancora da confermare** (il design le usa; vanno confermate prima di consegnare la schermata a Cursor)
1. **Grado a passi di 1** (30, 31, … 45), non di 0,5: letto così da «da 30 a 45». Con i mezzi punti sarebbero 31 voci.
2. **Valori fuori elenco** (grado oltre 45 o con decimali, invecchiamento diverso dalle sei voci): restano visibili e salvabili; se il report a secco ne mostra molti si allargano gli elenchi.
3. **Sotto riga dell'elenco**: «{invecchiamento} · {grado}»; il paese in una colonna a parte in tabella.
4. **Ricerca** sul solo nome; **filtri** Tipologia, Paese e Stato.
5. **Pulsante «Ricompila il menù pubblico»** in intestazione come in Piatti e Vini, in attesa della schermata di integrazione.
6. **L'import** continua a scrivere `volume` come oggi (forme «75 cl» e «50 cl» normalizzate) anche se l'App non lo mostra.

**Debiti futuri e punti aperti**
- **Forme reali di grado e invecchiamento** dei distillati nello snapshot: non verificate (fuori dal repo, `~/vtn-export-2026-10-12`). Il report a secco esteso le elencherà; le liste e la normalizzazione si fissano su quei dati prima dell'import di produzione.
- **Aggiornamento parziale e validazione**: come per i vini, da provare in Parte A.
- **Capacità**: da reintegrare nel modulo solo se servirà (stessa lista o una propria).
- **Paginazione completa** oltre «Mostra altri distillati».
- **Esito della ricompilazione**: come in Piatti, la schermata dice solo «avviata» (6.5).
