# Bevande, elenco e modulo — specifica di schermata (`/app/menu/drinks`, voce Bevande)

**Stato**: design chiuso il 2026-10-14 con le decisioni di Mirko: capacità a scelta (25, 33, 50, 75 cl), grado a scelta (3%–12%, come vini e distillati), allergeni non gestiti nell'App. Restano da confermare le assunzioni della sezione 10. È la schermata dei distillati con il **nome localizzato**, il **paese facoltativo** e una capacità propria; qui si dicono per intero struttura e testi, e si rimanda a `schermate/vini/spec.md` e `schermate/distillati/spec.md` solo per ciò che è identico.

**Si implementa in**: `fase-6` sottofase 6.6 (backoffice «Menù»; non ancora nel repo). Dipende da 8.2 (shell), 8.3 (guardia), 6.2 (collection `drinks` e tassonomie), 6.4 (disponibilità), 6.5 (ricompilazione) e dalla Parte 0 di 6.6 (permessi di cancellazione e registro).

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D1, D5, D6, D8, D9, D10, D13, D14, D15), `fase-6-menu-digitale.md` §§6.1, 6.2, 6.4, 6.5, 6.6, 6.8, `ADR-108` (nota sui formati del 2026-10-14), `ADR-112` (nota sui formati del 2026-10-14), `ADR-113` (emendamento del 2026-10-14), `ADR-115` (nota del 2026-10-14), `schermate/vini/spec.md`, `schermate/distillati/spec.md`.

**File del pacchetto** (stessa cartella): `mockup.html` (mockup statico annotato) e screenshot di riferimento. Stato iniziale: `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` (pagina intera). Telefono: `390-filtri-chiaro.png`, `390-filtri-attivi-chiaro.png`, `390-modulo-chiaro.png`, `390-modulo-inglese-aperto-chiaro.png`, `390-modulo-fondo-chiaro.png`, `390-nuovo-chiaro.png`, `390-nuovo-errori-chiaro.png`, `390-disponibilita-chiaro.png`, `390-elimina-chiaro.png`, `390-eliminato-chiaro.png`, `390-piu-di-100-bevande-chiaro.png`, `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-vuoto-chiaro.png`, `390-nessun-risultato-chiaro.png`, `390-errore-azione-chiaro.png`. Notebook: `1280-modulo-chiaro.png`. Il mockup usa `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`.

---

## 1. Obiettivo e accesso

Il manager (e admin e super-admin) vede le bevande della carta, birre comprese, per tipologia; le abilita e disabilita con un tocco; ne crea, modifica ed elimina; e può avviare la ricompilazione del menù pubblico. Funziona da telefono e da notebook.

- **Accesso**: `canAccessSection(user, 'menu')`. Non autenticato → `/app/login`. Sezione non consentita non raggiungibile nemmeno dall'URL.
- **Cancellazione** (D14): il manager elimina una bevanda, con conferma. **Nessuna relazione punta alle bevande** (verificato nelle migrazioni: solo le tabelle figlie e quella dei documenti bloccati di Payload, in cascade), quindi non c'è il caso «in uso» dei piatti. **Disabilitare** è l'interruttore.
- **Nessun «Terminato»**: la disponibilità è binaria (`ADR-108`, `fase-6` §6.2).
- **Allergeni non gestiti nell'App** (Mirko, 2026-10-14): il campo `allergens` resta nella collection e si modifica nell'Admin; nell'App non c'è la scelta degli allergeni (possibile integrazione futura). L'import (6.8) non li imposta per le bevande (solo per i piatti).
- **Birre**: la collection le include con la tipologia «Birre» (`ADR-108`); l'import non le porta (1 birra nello snapshot), quindi la tipologia «Birre» si crea a mano nell'Admin e poi le birre si inseriscono da qui.
- **Fuori perimetro**: le tassonomie (tipologie, paesi) si gestiscono nell'Admin; il pulsante «Ricompila il menù pubblico» è condiviso con Piatti, Vini e Distillati e la sua posizione definitiva si decide con la schermata di integrazione.

## 2. Collegamento ai dati

Collection `drinks` (`fase-6` §6.2), con la Local API **con la sessione dell'utente** (`overrideAccess: false`): il manager legge, crea, modifica e cancella (emendamento ad `ADR-113` del 2026-10-14); un utente senza ruolo non può nulla.

| Elemento | Campo | Note |
|---|---|---|
| Nome | `name` (**localizzato**) | Obbligatorio in italiano; l'inglese è facoltativo con ripiego sull'italiano (D10) |
| Descrizione | `description` (localizzato) | Facoltativa, italiano e inglese |
| Traduzione inglese | `name` e `description`, locale `en` | Badge «Presente» se almeno uno dei due non è vuoto, «Manca» altrimenti |
| Capacità | `volume` (testo) | Una forma canonica: «25 cl», «33 cl», «50 cl», «75 cl». Select; facoltativa |
| Grado | `abv` (testo) | Forma canonica da «3%» a «12%», a passi di 0,5 («5%», «5,5%»). Select, come nei vini e nei distillati (Mirko, 2026-10-14); facoltativo, vuoto per le analcoliche. Un valore già salvato fuori elenco (come «4,9%») resta visibile e salvabile |
| Prezzo | `price` (numero) | Obbligatorio; mostrato e scritto con la virgola. Un solo prezzo, quello della voce con la sua capacità |
| Tipologia | `type` → `drink-types` | Obbligatoria; **solo scelta**, nessun pulsante per crearne |
| Paese | `country` → `countries` | **Facoltativo**; opzioni: solo i paesi con `enabled` vero; prima voce «Nessun paese» per svuotarlo |
| Allergeni | `allergens` → `allergens` | **Non gestiti nell'App** (sopra) |
| Disabilitato | `disabled` | Assenza a tempo indefinito; l'interruttore «Disponibile» è il suo contrario |

**Interrogazioni**
- Elenco: tutte le bevande, disabilitate comprese, raggruppate per tipologia. **Ordine: per nome** (in italiano), sia le tipologie sia le bevande (`ADR-112` §1). Ricerca sul nome. Filtri: tipologia, paese e stato (Tutte, Abilitate, Disabilitate).
- **Ricerca, filtri e ordine nella richiesta** (`where` e `sort`), non nel browser. `limit=100`, come il contratto di `ADR-112`. Lo snapshot ha **13 bevande**, lontano dal limite, ma il comportamento è quello degli altri elenchi: oltre 100 compare «Mostrate 100 bevande su {totale}» con «Mostra altre bevande», che legge la pagina successiva con la stessa condizione e lo stesso ordine. Mai troncare in silenzio.
- Opzioni dei menu a tendina **filtrate nella query**: paesi con `enabled` vero; tipologie tutte. **Un valore già salvato resta visibile** nel campo anche se ora fuori elenco.
- Stato mostrato: **Disabilitata** se `disabled`, altrimenti **Disponibile**.
- **Validazione dei formati nel server** (D15): `volume` e `abv` della collection `drinks` hanno una funzione `validate` che accetta solo le forme canoniche (sopra) o il campo vuoto; vale per App, Admin e REST. Un valore già salvato e non modificato non blocca il salvataggio (da provare in Parte A, come per i vini). L'import (6.8) e le prove di 6.2 devono scrivere valori conformi; l'import normalizza già la capacità, e il grado va aggiunto (i valori fuori elenco vanno riportati al passo più vicino o segnalati dal report a secco).

**Operazioni**: abilita/disabilita (aggiorna `disabled`, effetto immediato); salva (crea o modifica, con la validazione sopra); elimina (cancellazione fisica, D14, dopo conferma).

**Effetti sul menù pubblico**
- Abilita/disabilita riscrive `disponibilita.json` (6.4), entro pochi secondi, senza ricompilazione.
- Bevande nuove e modifiche ai contenuti compaiono **dopo la ricompilazione** (6.5): l'avviso lo ricorda.
- **Eliminazione**: l'hook `afterDelete` riscrive il file di disponibilità; la bevanda sparisce dal menù pubblico alla ricompilazione; ogni cancellazione lascia una riga nel registro attività (`eventType: delete`, `area: app`, collection, identificativo, nome, nessun dato personale; `ADR-115`, nota del 2026-10-14).

## 3. Albero blocchi → componenti → varianti

Come `schermate/distillati/spec.md` §3, con queste differenze (`Componente (variante, dimensione)`).

| Blocco (`data-block`) | Contenuto | Componenti |
|---|---|---|
| `topbar` | Pulsante del menu, briciola «Menù › Bevande» | `SidebarTrigger`, `Separator`, `Breadcrumb` |
| `intestazione-pagina` | Titolo, descrizione, due azioni | `Button (default, lg)` «Nuova bevanda» e `Button (outline, lg)` «Ricompila il menù pubblico» |
| `ricerca-filtri`, `filtri-attivi` | Ricerca (nome), pulsante Filtri con il numero, etichette rimovibili | `Input`, `Button (outline, default)`, `Badge (default)`, `Button (secondary, sm)` |
| `gruppo-<tipologia>` | Intestazione con il conteggio, poi tabella e schede | testo (`h2`) |
| `elenco-tabella` (da 768 px) | Nome (con capacità e grado sotto, badge «Disabilitata» accanto), Paese (vuoto se manca), Prezzo, Disponibile, azioni | `Table` a colonne fisse, `Badge (outline)`, `Switch`, `Button (ghost, icon)` ×2: matita e cestino |
| `elenco-schede` (sotto 768 px) | Nome, capacità e grado, prezzo e paese (se c'è), badge «Disabilitata», interruttore «Disponibile», matita, cestino | `Card (sm)`, `Badge (outline)`, `Switch`, `Button (ghost, icon)` ×2 |
| (stato) filtri | Foglio con Tipologia, Paese, Stato | `Sheet`, `Field`, `Select`, `Button (lg)` |
| (stato) modulo | Nuova bevanda e modifica, in quattro sezioni (`dati`, `origine`, `prezzi`, `disponibilita`) | `Sheet`, `FieldGroup`, `FieldSet`, `FieldLegend`, `Field`, `Input`, `Textarea`, `Collapsible` (traduzione con Name e Description), `Badge (outline)`, `Select` ×4, `Switch`, `FieldDescription`, `FieldError`, `Button (lg)` |
| (stato) elimina, ricompila, caricamento, avvisi | Come i vini | `AlertDialog`, `Skeleton`, `Alert` |

## 4. Layout e regole responsive

Come `schermate/distillati/spec.md` §4, con queste differenze.

| | Telefono (sotto 768 px) | Schermo largo (da 768 px) |
|---|---|---|
| Elenco | Schede: nome, «{capacità} · {grado}», «{prezzo} · {paese}» (senza il paese se manca) a sinistra (il nome si tronca con i puntini; misurato 172 px su 358); a destra interruttore «Disponibile» con etichetta, matita, cestino | Tabella a **colonne fisse** (Paese 11 rem, Prezzo 7 rem, Disponibile 7 rem, azioni 6 rem; il resto al nome); la cella del paese resta vuota se manca |
| Modulo | Una colonna; Capacità e Grado affiancati | Idem |

Nessuno scorrimento orizzontale a 360, 390 e 1280 px.

## 5. Stati

| Stato | Cosa si vede | Riferimento |
|---|---|---|
| Elenco | Gruppi per tipologia con il conteggio; righe disabilitate attenuate | `*-chiaro.png`, `*-scuro.png` |
| Abilita o disabilita | L'interruttore cambia, avviso «Bevanda disabilitata» o «Bevanda abilitata» | `390-disponibilita-chiaro.png` |
| Filtri, filtri attivi | Foglio con Tipologia, Paese, Stato; etichette rimovibili | `390-filtri-chiaro.png`, `390-filtri-attivi-chiaro.png` |
| Modulo | Dati (Nome, Capacità e Grado a scelta, Descrizione, traduzione), Tipologia e paese, Prezzo, Disponibilità | `390-modulo-chiaro.png`, `390-modulo-fondo-chiaro.png`, `1280-modulo-chiaro.png` |
| Traduzione inglese aperta | Name e Description, con il suggerimento sul ripiego | `390-modulo-inglese-aperto-chiaro.png` |
| Nuova bevanda, errori | Modulo vuoto; messaggi sotto i campi | `390-nuovo-chiaro.png`, `390-nuovo-errori-chiaro.png` |
| Errore dell'azione | Avviso rosso nel foglio che l'ha avviata; nulla cambia | `390-errore-azione-chiaro.png` |
| Elimina, eliminata | Conferma «Eliminare {nome}?»; avviso «Bevanda eliminata» | `390-elimina-chiaro.png`, `390-eliminato-chiaro.png` |
| Più di 100 bevande | Avviso in testa con «Mostra altre bevande» | `390-piu-di-100-bevande-chiaro.png` |
| Caricamento, errore di caricamento, nessuna bevanda, nessun risultato | Come i vini | `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-vuoto-chiaro.png`, `390-nessun-risultato-chiaro.png` |

La conferma di ricompilazione è quella di `schermate/piatti/`.

## 6. Testi

Tutti in italiano, **al femminile** («bevanda»); `{…}` sono dinamici.

| Dove | Testo |
|---|---|
| Titolo | Bevande / Le bevande del ristorante, birre comprese. / Nuova bevanda · Ricompila il menù pubblico |
| Ricerca | Segnaposto «Cerca una bevanda»; pulsante «Filtri» (con il numero); etichette rimovibili, nome accessibile «Rimuovi filtro {etichetta}» |
| Foglio filtri | Filtri / Restringi l’elenco delle bevande. / Tipologia («Tutte le tipologie» + le tipologie), Paese («Tutti i paesi» + i paesi abilitati), Stato (Tutte, Abilitate, Disabilitate) / Applica, Azzera |
| Gruppo | {Tipologia} {1 bevanda \| N bevande} |
| Colonne | Nome, Paese, Prezzo, Disponibile, (Azioni, solo per lo screen reader) |
| Riga | Sotto il nome: «{capacità} · {grado}» (le parti vuote non compaiono); prezzo «{4,50} €»; su telefono «{prezzo} · {paese}», senza il paese se manca |
| Stato | Badge «Disabilitata»; nome accessibile dell'interruttore «Disponibile: {nome}»; etichetta visibile «Disponibile» su telefono |
| Azioni di riga | «Modifica {nome}» ed «Elimina {nome}» (nomi accessibili, nessun testo visibile) |
| Avvisi rapidi | Bevanda abilitata · Bevanda disabilitata / «Il menù pubblico si aggiorna entro pochi secondi.» |
| Avvisi di salvataggio | Bevanda aggiunta · Bevanda salvata / «Per vederla sul menù pubblico serve «Ricompila il menù pubblico».» |
| Elimina | «Eliminare {nome}?» / «Non si può annullare.» / Indietro, Elimina. Esito: «Bevanda eliminata» / «Per toglierla dal menù pubblico serve «Ricompila il menù pubblico».» |
| Modulo, titolo | Nuova bevanda («La bevanda compare nel menù pubblico dopo la ricompilazione.») · Modifica bevanda («{nome}») |
| Modulo, sezioni | Dati: Nome, Capacità e Grado (segnaposto «Scegli»; prima voce «Non indicata» e «Non indicato»; «Capacità e grado si scelgono da un elenco, così i dati restano uniformi. Il grado è vuoto per le analcoliche.», con in più «Un valore non in elenco resta finché non lo cambi.» se la bevanda ne ha uno), Descrizione, «Traduzione inglese (facoltativa)» con «Manca» o «Presente», Name (segnaposto: il nome italiano), Description («Facoltativa. Se resta vuota, il menù mostra il testo italiano.») · Tipologia e paese: Tipologia (segnaposto «Scegli»), Paese (segnaposto «Facoltativo», prima voce «Nessun paese») · Prezzo: Prezzo (€) · Disponibilità: «Disabilitata» («Assente a tempo indefinito: la bevanda non compare nel menù.») · Salva («Salvataggio…»), Annulla |
| Errori del modulo | Campo obbligatorio. · Scegli una tipologia. · Inserisci un prezzo valido (es. 4,50). (Capacità, grado e paese sono facoltativi e non hanno errori di campo.) |
| Errori dei formati (server) | Vengono da `lib/` (funzioni `validate` di `volume` e `abv`): «La capacità deve essere una tra: 25 cl, 33 cl, 50 cl, 75 cl.», «Il grado deve essere un valore da 3% a 12%, a passi di 0,5 (per esempio 5% o 5,5%).» L'App li mostra sotto il campo indicato dal server; non si riscrivono |
| Elenco parziale | Mostrate 100 bevande su {totale} / Restringi l’elenco con la ricerca o i filtri, oppure mostra le altre. / Mostra altre bevande |
| Errore dell'azione | Operazione non riuscita / Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore. |
| Errore di caricamento | Impossibile caricare le bevande / Riprova tra qualche istante; se il problema continua, avvisa l’amministratore. / Riprova |
| Vuoti | Nessuna bevanda in carta. (+ «Nuova bevanda») · Nessun risultato con questi filtri. (+ «Azzera filtri») |

**Singolare e plurale**: «1 bevanda» al singolare, negli altri casi «N bevande».

## 7. Comportamenti

Quelli di `schermate/vini/spec.md` §7, tranne la cascata dell'origine, l'anno e il prezzo al calice, che qui non esistono. In sintesi:

1. **Abilita e disabilita con un tocco**: l'interruttore «Disponibile» salva subito (D9), anche sulle righe disabilitate; se fallisce nulla cambia e compare l'errore.
2. **Apertura del modulo** con la matita; il nome non è un collegamento e la scheda non è tappabile (D13).
3. **Elimina**: il cestino apre la conferma; «Elimina» cancella e mostra l'avviso; l'errore resta nella finestra. Nessun testo suggerisce di disabilitare.
4. **Traduzione inglese** (D10): chiusa per default, si apre se esiste un nome o una descrizione inglese; il campo Name ha come segnaposto il nome italiano e, vuoto, il menù mostra l'italiano.
5. **Capacità e grado a scelta** (D15): due elenchi con la voce «Non indicata» o «Non indicato» per svuotarli. Capacità 25, 33, 50 o 75 cl; grado da 3% a 12% a passi di 0,5. In elenco il grado compare come «5,5%». Un valore già salvato fuori elenco (per esempio «20 cl» o «4,9%» importati) resta tra le opzioni e nella riga, e non impedisce di salvare altro; scegliendo un altro valore non si torna indietro. Un grado come 4,9% si sceglie al passo più vicino (5%): con i mezzi punti non si rappresentano i valori intermedi.
6. **Paese facoltativo**: il campo parte vuoto («Facoltativo»); la voce «Nessun paese» lo svuota; in elenco la cella del paese è vuota se manca.
7. **Validazione**: nome (italiano), tipologia e prezzo obbligatori; prezzo numerico (virgola o punto, al massimo due decimali). Con errori: nessun salvataggio, messaggi sotto i campi, primo campo non valido in vista e con il focus. Capacità, grado e paese non hanno errori di campo.
8. **Salvataggio**: subito (D9), con `Spinner` e «Salvataggio…»; a buon fine il foglio si chiude e compare l'avviso che ricorda la ricompilazione; in errore l'avviso rosso resta nel foglio.
9. **Filtri e ricerca**: come nelle altre liste (D5); la ricerca trova il nome italiano. I gruppi senza righe non compaiono.
10. **Elenco parziale**: «Mostra altre bevande» carica la pagina successiva.
11. **Ordine**: tipologie e bevande per nome, senza distinzione tra maiuscole e minuscole e con le regole dell'italiano.
12. **Tema e tocco**: come D4 e D6.

## 8. Componenti da installare e da comporre

- **Da installare**: nessun componente oltre a quelli già richiesti da shell, Orari, Prenotazioni, Piatti e Vini.
- **Componenti di composizione** (`components/app/`, solo con componenti di `components/ui`): gli stessi di vini e distillati, con la traduzione a scomparsa che contiene anche il nome (come nei piatti) e il paese facoltativo. **Non** servono la cascata dell'origine, la casella «Senza annata» né la scelta degli allergeni.
- **Eccezioni alla regola UI** (`ui-check-allow`): nessuna.
- **Logica pura in `lib/`** (con test): stato mostrato, filtro dell'elenco, conteggio per tipologia, formato del prezzo con la virgola, testi con singolare e plurale, e **le forme canoniche di capacità e grado delle bevande** (elenchi, validatori e funzioni di normalizzazione) nello stesso modulo di `lib/menu/` che serve ai vini e ai distillati, usato da interfaccia, funzioni `validate` e import.

## 9. Checklist di accettazione

Si verifica con Playwright. Controlli comuni **C1–C10** di `modello-specifica-schermata.md`. Specifici:

1. **Nessuno scorrimento orizzontale** a 360, 390 e 1280 px in tutte le viste (elenco, fogli, finestre, stati). *Misurato nel prototipo il 2026-10-14 in elenco, filtri, nuovo, modulo (anche con la traduzione aperta), conferma di eliminazione ed elenco parziale: nessuno.*
2. **Aree di tocco** a 390 px con tocco simulato (C2): nessun elemento sotto 44 px in tutte le viste. *Misurato nel prototipo nelle stesse viste: nessuno.*
3. **Colonna e elenco**: a 1280 px la colonna è larga 976 px; tabella da 768 px, schede sotto. *Misurato nel prototipo.*
4. **Colonne fisse**: Paese, Prezzo, Disponibile e azioni nella stessa posizione in tutti i gruppi a 1280 px.
5. **Azioni di riga**: interruttore «Disponibile», matita e cestino a 44 px, con i nomi accessibili della sezione 6; il nome non è cliccabile; nessun menu «⋯».
6. **Abilita e disabilita**: un tocco cambia lo stato, la bevanda passa alla voce giusta del filtro «Stato», compare l'avviso; `disponibilita.json` cambia entro pochi secondi (dopo la 6.4).
7. **Ricompilazione**: come in Piatti.
8. **Modulo**: nome, tipologia e prezzo obbligatori (capacità, grado e paese no); focus sul primo campo non valido; il prezzo accetta «4», «4,5», «4,50» e «4.50» e rifiuta «abc» e tre decimali. **Non ci sono i campi degli allergeni.** *Provato nel prototipo: un modulo vuoto dà tre errori (nome, tipologia, prezzo).*
9. **Grado**: l'elenco offre «Non indicato» e da 3% a 12% a passi di 0,5 (19 valori); il grado vuoto è accettato; un valore salvato fuori elenco resta visibile e la bevanda si salva senza cambiarlo; scegliendo un valore si salva «5,5%». *Provato nel prototipo.*
10. **Capacità**: offre «Non indicata», 25, 33, 50 e 75 cl; un valore salvato fuori elenco (20 cl) resta visibile e la bevanda si salva senza cambiarlo. *Provato nel prototipo.*
11. **Paese facoltativo**: «Nessun paese» svuota il campo e la bevanda si salva; in elenco la cella è vuota. *Provato nel prototipo.*
12. **Formati dal server**: una richiesta diretta (REST o Admin) con capacità «20 cl» o grado «4,9%» torna con il messaggio della sezione 6; con un valore canonico passa; **disabilitare una bevanda che ha già un valore non canonico non fallisce** (se Payload non lo consente, si decide in Parte A come eccezione).
13. **Tassonomie a sola scelta**: Tipologia e Paese offrono solo i valori esistenti (i paesi solo con `enabled` vero: Libano non compare); nessun pulsante per crearne; nessuna eliminazione di tassonomie nell'App.
14. **Lingue**: traduzione chiusa per default e aperta se esiste un nome o una descrizione inglese; badge coerente; con l'inglese vuoto una lettura `locale=en` ricade sull'italiano per nome e descrizione.
15. **Eliminazione**: conferma, la bevanda sparisce, compare «Bevanda eliminata»; la riga di registro esiste; `disponibilita.json` non contiene più l'identificativo; consentita a manager (`appRole`), admin e super-admin, rifiutata a un utente senza ruolo.
16. **Persistenza e permessi**: nuovo e modifica si salvano con la sessione dell'utente (`overrideAccess: false`) e la rilettura dà gli stessi valori.
17. **Filtri e ricerca**: Applica e Azzera; etichette rimovibili e numero sul pulsante; con 101 bevande la richiesta restituisce 100, compare «Mostrate 100 bevande su 101» e «Mostra altre bevande» carica la centounesima.
18. **Ordine**: tipologie e bevande per nome; ricerca, filtri e ordine arrivano dalla richiesta.
19. **Stati e testi**: come negli screenshot e nella sezione 6, singolare e plurale e il femminile compresi («Abilitate», «Disabilitata»).
20. **Temi, accesso, `pnpm ui:check`**: C3, C4 (`canAccessSection(user, 'menu')`), C9.
21. **Confronto visivo** con i PNG di riferimento a 390 e 1280 px, in tema chiaro e scuro (C10).

## 10. Scelte confermate, assunzioni e debiti

**Scelte confermate da Mirko il 2026-10-14**
- **Capacità a scelta**: 25, 33, 50 e 75 cl (senza 20 cl), con «Non indicata».
- **Grado a scelta**, come vini e distillati, per uniformare (prima proposto come campo numerico).
- **Allergeni non gestiti nell'App** (restano nella collection e nell'Admin).
- Come vini e distillati: interruttore «Disponibile», matita, cestino (D13, D14); «Mostra altre bevande»; validazione dei formati nel server e normalizzazione nell'import (D15).

**Assunzioni ancora da confermare** (il design le usa; vanno confermate prima di consegnare la schermata a Cursor)
1. **Grado: da 3% a 12% a passi di 0,5** (19 voci). L'estremo e il passo sono miei: il confronto è vini 5%–20% a passi di 0,5 e distillati 30%–45% a passi di 1. Con questi passi un grado come 4,9% o 6,6% si sceglie al passo più vicino; se serve di più si restringe il passo o si alza l'estremo.
2. **Nome in inglese nella traduzione** (D10): oltre alla descrizione si traduce il nome, perché `name` è localizzato.
3. **Paese facoltativo** nel modulo e nei filtri, con «Nessun paese» per svuotarlo; il filtro per paese non ha una voce «Senza paese».
4. **Sotto riga dell'elenco**: «{capacità} · {grado}»; il paese in una colonna a parte in tabella.
5. **Ricerca** sul solo nome italiano; **filtri** Tipologia, Paese e Stato.
6. **Pulsante «Ricompila il menù pubblico»** in intestazione, in attesa della schermata di integrazione.
7. **Birre**: la tipologia «Birre» si crea a mano nell'Admin dopo l'import; nessun trattamento speciale nell'App.

**Debiti futuri e punti aperti**
- **Forme reali di grado e capacità** nello snapshot (`~/vtn-export-2026-10-12`, fuori repo): non verificate, salvo le forme di capacità note all'import. Il report a secco esteso le elencherà prima dell'import di produzione e dirà quanti gradi cadono fuori dai passi di 0,5.
- **Aggiornamento parziale e validazione**: come per vini e distillati, da provare in Parte A.
- **Allergeni delle bevande nell'App**: da reintegrare solo se serviranno (stesse scelte multiple dei piatti).
- **Paginazione completa** oltre «Mostra altre bevande».
- **Esito della ricompilazione**: come in Piatti, la schermata dice solo «avviata» (6.5).
