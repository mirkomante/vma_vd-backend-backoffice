# Vini, elenco e modulo — specifica di schermata (`/app/menu/wines`, voce Vini)

**Stato**: design rivisto il 2026-10-14 dopo le risposte di Mirko; restano da confermare le assunzioni della sezione 10. Decisioni di Mirko che lo reggono (2026-10-14): interruttore «Disponibile» a un tocco, matita e cestino (D13, D14); raggruppamento per tipologia; filtro per origine (paese → regione → denominazione); classificazione che segue il paese; «Mostra altri vini»; capacità e grado a scelta e anno numerico validato (D15).

**Si implementa in**: `fase-6` sottofase 6.6 (backoffice «Menù»; non ancora nel repo). Dipende da 8.2 (shell), 8.3 (guardia), 6.2 (collection `wines` e tassonomie), 6.4 (disponibilità: `disabled` riscrive il file), 6.5 (ricompilazione) e dalla Parte 0 di 6.6 (permessi di cancellazione e registro).

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D1, D5, D6, D8, D9, D10, D13, D14, D15), `fase-6-menu-digitale.md` §§6.1, 6.2, 6.4, 6.5, 6.6, 6.8, `ADR-108` (emendamento e nota sui formati del 2026-10-14), `ADR-112` (nota sui formati del 2026-10-14), `ADR-113` (emendamento del 2026-10-14), `ADR-115` (nota del 2026-10-14), `schermate/piatti/spec.md` (stessa struttura: qui si dicono solo le differenze).

**File del pacchetto** (stessa cartella): `mockup.html` (mockup statico annotato) e screenshot di riferimento. Stato iniziale: `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` (pagina intera). Telefono: `390-filtri-chiaro.png`, `390-filtri-origine-chiaro.png`, `390-filtri-attivi-chiaro.png`, `390-modulo-chiaro.png`, `390-modulo-origine-chiaro.png`, `390-modulo-inglese-aperto-chiaro.png`, `390-modulo-fondo-chiaro.png`, `390-nuovo-chiaro.png`, `390-nuovo-errori-chiaro.png`, `390-origine-senza-regioni-chiaro.png`, `390-errore-geografia-chiaro.png`, `390-errore-anno-chiaro.png`, `390-disponibilita-chiaro.png`, `390-elimina-chiaro.png`, `390-eliminato-chiaro.png`, `390-piu-di-100-vini-chiaro.png`, `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-vuoto-chiaro.png`, `390-nessun-risultato-chiaro.png`, `390-errore-azione-chiaro.png`. Notebook: `1280-modulo-chiaro.png`. Il mockup usa `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`.

---

## 1. Obiettivo e accesso

Il manager (e admin e super-admin) vede i vini della carta per tipologia, abilita e disabilita un vino con un tocco, crea, modifica ed elimina un vino, e può avviare la ricompilazione del menù pubblico. Funziona da telefono e da notebook (requisito di base, sezione 0 di `decisioni-layout-app.md`).

- **Accesso**: `canAccessSection(user, 'menu')`. Non autenticato → `/app/login`. Sezione non consentita non raggiungibile nemmeno dall'URL.
- **Cancellazione** (D14): il manager elimina un vino, con conferma. Nessuna relazione punta ai vini, quindi non c'è il caso «in uso» dei piatti. **Disabilitare** è un'altra azione (l'interruttore) e resta sempre possibile.
- **Nessun «Terminato»**: la disponibilità dei vini è binaria (`ADR-108`, `fase-6` §6.2): c'è solo `disabled`.
- **Fuori perimetro**: le tassonomie (tipologie, paesi, regioni, denominazioni, classificazioni) si creano e si modificano nell'Admin; il pulsante «Ricompila il menù pubblico» è un componente condiviso con Piatti, la cui posizione definitiva si decide con la schermata di integrazione; la validazione allergeni/flag (`ADR-108` §10) non riguarda i vini.

## 2. Collegamento ai dati

Collection `wines` (`fase-6` §6.2), con la Local API **con la sessione dell'utente** (`overrideAccess: false`): il manager legge, crea, modifica e cancella (emendamento ad `ADR-113` del 2026-10-14); un utente senza ruolo non può nulla.

| Elemento | Campo | Note |
|---|---|---|
| Nome | `name` (non localizzato) | Obbligatorio. Il nome del vino non si traduce |
| Descrizione | `description` (localizzato) | Italiano facoltativo; inglese facoltativo con ripiego sull'italiano |
| Traduzione inglese | `description`, locale `en` | Badge «Presente» se non vuota, «Manca» altrimenti |
| Cantina | `winery` (testo) | Testo libero |
| Anno | `year` (testo) | Forma canonica: quattro cifre tra 1900 e l'anno corrente, oppure «NV» (senza annata). Campo numerico validato con la casella «Senza annata (NV)» (D15) |
| Capacità | `volume` (testo) | Una forma canonica: «25 cl», «33 cl», «37,5 cl», «50 cl», «75 cl», «150 cl». Select; facoltativa |
| Grado | `abv` (testo) | Forma canonica «13%» o «13,5%», da 5% a 20% a passi di 0,5. Select; facoltativo |
| Formato dei tre campi | — | Il tipo resta testo (contratto congelato in 6.2); la forma canonica è imposta dalla validazione del server, quindi vale anche per Admin e REST (sotto) |
| Prezzo | `price` (numero) | Obbligatorio; mostrato e scritto con la virgola («28,00») |
| Prezzo al calice | `glassPrice` (numero) | Facoltativo, stesso formato |
| Tipologia | `type` → `wine-types` | Obbligatoria; **solo scelta**, nessun pulsante per crearne |
| Paese | `country` → `countries` | Obbligatorio; opzioni: solo i paesi con `enabled` vero |
| Regione | `region` → `regions` | Facoltativa; opzioni: le regioni del paese scelto con `enabled` vero |
| Denominazione | `appellation` → `appellations` | Facoltativa; opzioni: le denominazioni della regione scelta |
| Classificazione | `classification` → `classifications` | Facoltativa; opzioni: le classificazioni del paese scelto |
| Disabilitato | `disabled` | Assenza a tempo indefinito; l'interruttore «Disponibile» dell'elenco è il suo contrario |

**Interrogazioni**
- Elenco: tutti i vini, disabilitati compresi, raggruppati per tipologia. **Ordine: per nome**, sia le tipologie sia i vini dentro ciascuna (`ADR-112` §1). Ricerca sul nome e sulla cantina. Filtri: tipologia, **origine** (paese, regione, denominazione, a cascata come nel modulo) e stato (Tutti, Abilitati, Disabilitati). La classificazione non è un filtro: è un disciplinare di qualità, non un'origine.
- **Ricerca, filtri e ordine si applicano nella richiesta** (`where` e `sort` della Local API), non nel browser. La richiesta usa `limit=100`, come il contratto di `ADR-112`. Lo snapshot di riferimento ha **90 vini** (13 nascosti, `docs/operativo/export-menu-vtn-backend.md`): il limite è vicino. Oltre 100 compare l'avviso «Mostrati 100 vini su {totale}» con il pulsante «Mostra altri vini», che legge la pagina successiva con la stessa condizione e lo stesso ordine (proposta, sezione 10).
- **Opzioni dei menu a tendina, filtrate nella query** (non nascoste nell'interfaccia): paesi con `enabled` vero; regioni con `country` uguale al paese scelto e `enabled` vero; denominazioni con `region` uguale alla regione scelta; classificazioni con `country` uguale al paese scelto; tipologie tutte. Le stesse condizioni valgono per le opzioni del **filtro per origine** (paesi abilitati, regioni del paese, denominazioni della regione): sono i valori delle tassonomie, non solo quelli che hanno vini. **Un valore già salvato resta visibile** nel campo anche se ora fuori filtro (per esempio un paese poi disabilitato).
- Stato mostrato: **Disabilitato** se `disabled`, altrimenti **Disponibile**.
- **Validazione dei formati nel server** (D15): `year`, `volume` e `abv` della collection `wines` hanno una funzione `validate` che accetta solo le forme canoniche (sopra) o il campo vuoto; vale per App, Admin e REST. **Un valore già salvato e non modificato non blocca il salvataggio** (per esempio disabilitare un vino con grado «12,8%» importato non deve fallire): da verificare in Parte A con il comportamento di Payload 3.90.2 sull'aggiornamento parziale (non verificato). I messaggi sono in italiano (sezione 6). L'import e le prove di 6.2 devono scrivere valori conformi (`fase-6` §§6.6 e 6.8).

**Operazioni**
- Abilita/Disabilita: aggiorna `disabled`; effetto immediato.
- Salva (crea o modifica): validazione sotto; la coerenza geografica la verifica il server (`validateWineGeography`, 6.2), l'interfaccia la rende impossibile da sbagliare con la cascata e mostra comunque l'errore del server se arriva.
- Elimina: cancellazione fisica (D14), dopo conferma.

**Effetti sul menù pubblico**
- Abilita/disabilita riscrive `disponibilita.json` (6.4) e compare entro pochi secondi, senza ricompilazione.
- Vini nuovi e modifiche ai contenuti compaiono **dopo la ricompilazione** (6.5): l'avviso lo ricorda.
- **Eliminazione**: l'hook `afterDelete` riscrive il file di disponibilità; il vino sparisce dal menù pubblico alla ricompilazione; ogni cancellazione lascia una riga nel registro attività (`eventType: delete`, `area: app`, collection, identificativo, nome, nessun dato personale; `ADR-115`, nota del 2026-10-14).

## 3. Albero blocchi → componenti → varianti

Come `schermate/piatti/spec.md` §3, con queste differenze (`Componente (variante, dimensione)`).

| Blocco (`data-block`) | Contenuto | Componenti |
|---|---|---|
| `topbar` | Pulsante del menu, briciola «Menù › Vini» | `SidebarTrigger`, `Separator`, `Breadcrumb` (con `BreadcrumbLink`) |
| `intestazione-pagina` | Titolo, descrizione, due azioni | `Button (default, lg)` «Nuovo vino» e `Button (outline, lg)` «Ricompila il menù pubblico», con icona |
| `ricerca-filtri` | Ricerca (nome o cantina) e pulsante Filtri con il numero | `Input`, `Button (outline, default)`, `Badge (default)` |
| `filtri-attivi` | Etichette rimovibili (togliere un livello dell'origine toglie anche quelli sotto) | `Button (secondary, sm)` con icona |
| `gruppo-<tipologia>` | Intestazione con il conteggio, poi tabella e schede | testo (`h2`), vedi sotto |
| `elenco-tabella` (da 768 px) | Nome (con cantina e anno sotto, badge «Disabilitato» accanto), Origine, Prezzo (con il calice sotto), Disponibile, azioni | `Table` a colonne fisse, `Badge (outline)`, `Switch`, `Button (ghost, icon)` ×2: matita e cestino |
| `elenco-schede` (sotto 768 px) | Nome, cantina e anno, prezzo e calice, badge «Disabilitato», interruttore «Disponibile», matita, cestino | `Card (sm)`, `Badge (outline)`, `Switch`, `Button (ghost, icon)` ×2 |
| (stato) filtri | Foglio con Tipologia, Paese, Regione, Denominazione, Stato | `Sheet`, `Field`, `Select`, `Button (lg)` Applica e Azzera |
| (stato) modulo | Nuovo vino e modifica, in quattro sezioni (`dati`, `origine`, `prezzi`, `disponibilita`) | `Sheet`, `FieldGroup`, `FieldSet`, `FieldLegend`, `Field`, `Input`, `Textarea`, `Collapsible` (traduzione), `Badge (outline)`, `Select` ×7, `Checkbox` (senza annata), `Switch`, `FieldDescription`, `FieldError`, `Button (lg)` Salva e Annulla |
| (stato) elimina | Conferma «Eliminare {nome}?» | `AlertDialog`, `Button (destructive)`, `Button (outline)`, `Spinner` |
| (stato) ricompila | Conferma della ricompilazione (componente condiviso con Piatti) | `AlertDialog`, `Button (default)`, `Spinner` |
| (stato) caricamento | Quattro blocchi | `Skeleton` |
| (stato) avvisi | Esito, elenco parziale, errore di caricamento, errore dell'azione | `Alert (default \| destructive)`, `AlertTitle`, `AlertDescription` |

La shell (barra laterale con le otto voci di «Menù», menu utente, tema) è quella di D1–D4 e non fa parte di questa specifica.

## 4. Layout e regole responsive

| | Telefono (sotto 768 px) | Schermo largo (da 768 px) |
|---|---|---|
| Shell | Barra in alto con pulsante del menu; il menu è un pannello laterale | Barra laterale fissa da 16 rem |
| Colonna | Tutta la larghezza, margine 16 px | Centrata, larga al massimo `max-w-5xl`: a 1280 px è 976 px |
| Azioni di pagina | In colonna, «Nuovo vino» per prima, poi «Ricompila il menù pubblico» | In riga, «Ricompila» a sinistra e «Nuovo vino» a destra |
| Elenco | Schede: nome, cantina e anno, prezzo e calice a sinistra (il nome si tronca con i puntini; misurato 172 px su 358); a destra interruttore «Disponibile» con etichetta, matita, cestino | Tabella a **colonne fisse** (Origine 14 rem, Prezzo 7 rem, Disponibile 7 rem, azioni 6 rem; il resto al nome), così le colonne restano allineate da un gruppo all'altro |
| Righe disabilitate | Attenuate, badge «Disabilitato»; l'interruttore resta attivo (serve a riabilitare) | Idem; il badge sta accanto al nome |
| Foglio (filtri, modulo) | Dal basso, altezza massima 90 % dello schermo con scorrimento; pulsanti agganciati in fondo, affiancati | Da destra; pulsanti agganciati in fondo, affiancati |
| Modulo | Una colonna; Anno a tutta larghezza con la casella «Senza annata (NV)» sotto; Capacità e Grado affiancati; Prezzo e Prezzo al calice affiancati | Idem |
| Dimensioni dei controlli | Dispositivo touch (`pointer-coarse`): ≥ 44 px (D6) | Con mouse: misure standard di Nova |

Nessuno scorrimento orizzontale a 360, 390 e 1280 px.

## 5. Stati

| Stato | Cosa si vede | Riferimento |
|---|---|---|
| Elenco | Gruppi per tipologia con il conteggio; righe disabilitate attenuate | `*-chiaro.png`, `*-scuro.png` |
| Abilita o disabilita | L'interruttore cambia, avviso «Vino disabilitato» o «Vino abilitato»; la riga si attenua o torna normale | `390-disponibilita-chiaro.png` |
| Filtri | Foglio con Tipologia, Paese, Stato, Applica, Azzera | `390-filtri-chiaro.png` |
| Filtri attivi | Etichette rimovibili e numero sul pulsante | `390-filtri-attivi-chiaro.png` |
| Filtri per origine | Foglio con Paese, Regione e Denominazione scelti (esempio Italia › Friuli Venezia Giulia › Collio) | `390-filtri-origine-chiaro.png` |
| Modulo | Dati, Origine, Prezzi, Disponibilità | `390-modulo-chiaro.png`, `390-modulo-origine-chiaro.png`, `390-modulo-fondo-chiaro.png`, `1280-modulo-chiaro.png` |
| Traduzione inglese aperta | Description con il suggerimento sul ripiego | `390-modulo-inglese-aperto-chiaro.png` |
| Origine per un paese senza regioni | Regione, Denominazione e Classificazione disabilitate, ciascuna con il suo messaggio | `390-origine-senza-regioni-chiaro.png` |
| Nuovo vino | Modulo vuoto | `390-nuovo-chiaro.png` |
| Errori del modulo | Messaggi sotto i campi; il primo campo non valido ha il focus | `390-nuovo-errori-chiaro.png` |
| Errore di coerenza geografica | L'errore del server sotto Regione, il campo ha il focus | `390-errore-geografia-chiaro.png` |
| Errore sull'anno | «Inserisci un anno di quattro cifre tra 1900 e {anno corrente}.» sotto il campo, che ha il focus | `390-errore-anno-chiaro.png` |
| Errore dell'azione | Avviso rosso nel foglio che l'ha avviata; nulla cambia | `390-errore-azione-chiaro.png` |
| Elimina | Finestra «Eliminare {nome}?», «Non si può annullare.», pulsanti «Indietro» ed «Elimina» | `390-elimina-chiaro.png` |
| Vino eliminato | Il vino sparisce dall'elenco; avviso «Vino eliminato» con il richiamo alla ricompilazione | `390-eliminato-chiaro.png` |
| Più di 100 vini | Avviso in testa all'elenco con «Mostra altri vini» | `390-piu-di-100-vini-chiaro.png` |
| Caricamento | Quattro blocchi `Skeleton` | `390-caricamento-chiaro.png` |
| Errore di caricamento | Solo avviso rosso con «Riprova» | `390-errore-caricamento-chiaro.png` |
| Nessun vino | Messaggio e «Nuovo vino» | `390-vuoto-chiaro.png` |
| Nessun risultato | Messaggio e «Azzera filtri» | `390-nessun-risultato-chiaro.png` |

La conferma di ricompilazione e i suoi esiti sono quelli di `schermate/piatti/` (stessi testi, stesso componente) e non si ridisegnano qui.

## 6. Testi

Tutti in italiano; `{…}` sono dinamici.

| Dove | Testo |
|---|---|
| Titolo | Vini / La carta dei vini del ristorante. / Nuovo vino · Ricompila il menù pubblico |
| Ricerca | Segnaposto «Cerca un vino o una cantina»; pulsante «Filtri» (con il numero); etichette rimovibili, nome accessibile «Rimuovi filtro {etichetta}» |
| Foglio filtri | Filtri / Restringi l’elenco dei vini. / Tipologia («Tutte le tipologie» + le tipologie), Paese («Tutti i paesi» + i paesi abilitati), Regione («Tutte le regioni»; segnaposto «Scegli prima il paese» o «Nessuna regione per questo paese»), Denominazione («Tutte le denominazioni»; «Scegli prima la regione» o «Nessuna denominazione per questa regione»), Stato (Tutti, Abilitati, Disabilitati) / Applica, Azzera |
| Gruppo | {Tipologia} {1 vino \| N vini} |
| Colonne | Nome, Origine, Prezzo, Disponibile, (Azioni, solo per lo screen reader) |
| Riga | Sotto il nome: «{cantina} · {anno}» (le parti vuote non compaiono); origine «{paese} · {regione}» (solo il paese se manca la regione); prezzo «{28,00} €» e, sotto, «calice {7,00} €» se c'è |
| Stato | Badge «Disabilitato» (nessun badge sul vino disponibile); nome accessibile dell'interruttore «Disponibile: {nome}»; etichetta visibile «Disponibile» su telefono |
| Azioni di riga | Nomi accessibili «Modifica {nome}» ed «Elimina {nome}». Nessun testo visibile: sono icone (D13) |
| Avvisi rapidi | Vino abilitato · Vino disabilitato / «Il menù pubblico si aggiorna entro pochi secondi.» |
| Avvisi di salvataggio | Vino aggiunto · Vino salvato / «Per vederlo sul menù pubblico serve «Ricompila il menù pubblico».» |
| Elimina | «Eliminare {nome}?» / «Non si può annullare.» / Indietro, Elimina. Esito: «Vino eliminato» / «Per toglierlo dal menù pubblico serve «Ricompila il menù pubblico».» Errore imprevisto: «Operazione non riuscita» / «Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore.» |
| Modulo, titolo | Nuovo vino («Il vino compare nel menù pubblico dopo la ricompilazione.») · Modifica vino («{nome}») |
| Modulo, sezioni | Dati: Nome, Cantina, Anno (casella «Senza annata (NV)»), Capacità e Grado (segnaposto «Scegli»; prima voce «Non indicata» e «Non indicato»; «Capacità e grado si scelgono da un elenco, così i dati restano uniformi.», con in più «Un valore non in elenco resta finché non lo cambi.» se il vino ne ha uno), Descrizione, «Traduzione inglese (facoltativa)» con «Manca» o «Presente», Description («Facoltativa. Se resta vuota, il menù mostra il testo italiano. Il nome del vino non si traduce.») · Origine: Tipologia, Paese (segnaposto «Scegli»), Regione, Denominazione, Classificazione («Le classificazioni mostrate seguono il paese scelto.») · Prezzi: Prezzo (€), Al calice (€) («Il prezzo al calice è facoltativo.») · Disponibilità: «Disabilitato» («Assente a tempo indefinito: il vino non compare nel menù.») · Salva («Salvataggio…»), Annulla |
| Segnaposto della cascata | Prima voce dei campi facoltativi, per svuotarli: «Nessuna regione», «Nessuna denominazione», «Nessuna classificazione». Regione: «Scegli prima il paese» (senza paese), «Facoltativa» (con regioni), «Nessuna regione per questo paese» (senza regioni; il campo è disabilitato). Denominazione: «Scegli prima la regione», «Facoltativa», «Nessuna denominazione per questa regione». Classificazione: «Scegli prima il paese», «Facoltativa», «Nessuna classificazione per questo paese» |
| Errori del modulo | Campo obbligatorio. · Scegli una tipologia. · Scegli un paese. · Inserisci un prezzo valido (es. 28,50). · Inserisci un prezzo valido (es. 7,00). (quest'ultimo per il prezzo al calice, se compilato e non valido) · Inserisci un anno di quattro cifre tra 1900 e {anno corrente}. |
| Errori di coerenza geografica | Vengono da `lib/` (`validateWineGeography`): «La regione selezionata non appartiene al paese indicato.», «La denominazione selezionata non appartiene alla regione indicata.», «Per indicare una denominazione è necessario selezionare anche la regione corrispondente.» **Da non riscrivere**: l'interfaccia li mostra sotto il campo indicato dal server |
| Errori dei formati (server) | Vengono da `lib/` (funzioni `validate` di `year`, `volume`, `abv`): «L'anno deve avere quattro cifre, tra 1900 e {anno corrente}, oppure essere NV.», «La capacità deve essere una tra: 25 cl, 33 cl, 37,5 cl, 50 cl, 75 cl, 150 cl.», «Il grado deve andare da 5% a 20% a passi di 0,5 (per esempio 13% o 13,5%).» L'App li mostra sotto il campo indicato dal server; non si riscrivono |
| Elenco parziale | Mostrati 100 vini su {totale} / Restringi l’elenco con la ricerca o i filtri, oppure mostra gli altri. / Mostra altri vini |
| Errore dell'azione | Operazione non riuscita / Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore. |
| Errore di caricamento | Impossibile caricare i vini / Riprova tra qualche istante; se il problema continua, avvisa l’amministratore. / Riprova |
| Vuoti | Nessun vino in carta. (+ «Nuovo vino») · Nessun risultato con questi filtri. (+ «Azzera filtri») |

**Singolare e plurale**: «1 vino» al singolare, negli altri casi «N vini».

## 7. Comportamenti

1. **Abilita e disabilita con un tocco**: l'interruttore «Disponibile» salva subito (D9) e mostra l'avviso; se il salvataggio fallisce nulla cambia e compare l'errore. L'interruttore è attivo anche sulle righe disabilitate. Acceso vuol dire non disabilitato.
2. **Apertura del modulo**: con la matita della riga. Il nome non è un collegamento e la scheda non è tappabile (D13). «Nuovo vino» apre lo stesso modulo vuoto.
3. **Elimina**: il cestino apre la conferma «Eliminare {nome}?» (D9, azione irreversibile); «Elimina» cancella, chiude la finestra, toglie la riga e mostra l'avviso. Se la cancellazione fallisce nulla cambia e compare l'errore imprevisto nella finestra. Mentre si elimina: pulsanti disabilitati, `Spinner`. Il vino disabilitato si può eliminare come gli altri. Nessun testo suggerisce di disabilitare: l'interruttore è nella riga.
4. **Traduzione inglese**: chiusa per default, si apre da sola se il vino ha già una descrizione inglese. Il badge dice «Manca» o «Presente». Il nome non ha traduzione.
5. **Cascata dell'origine**: Regione resta disabilitata finché manca il paese o se il paese non ha regioni; Denominazione finché manca la regione o se la regione non ha denominazioni; Classificazione finché manca il paese o se il paese non ne ha. **Cambiando il paese** si svuotano regione e denominazione, e la classificazione si svuota se non appartiene al nuovo paese. **Cambiando la regione** si svuota la denominazione. I campi disabilitati dicono perché nel segnaposto (sezione 6). I campi facoltativi hanno come prima voce «Nessuna …» per tornare al campo vuoto.
5b. **Campi a scelta** (D15): Capacità e Grado sono elenchi con una voce «Non indicata» per svuotarli; **Anno** è un campo numerico (solo cifre, quattro al massimo) con la casella «Senza annata (NV)»: spuntandola il campo si svuota e si disabilita e si salva «NV»; togliendola il campo torna disponibile. Un valore già salvato fuori elenco (o un anno non valido importato) resta visibile e salvabile finché non lo si cambia; scegliendo un altro valore non si torna indietro.
6. **Valore salvato fuori filtro**: aprendo un vino il cui paese, regione, denominazione o classificazione non è più tra le opzioni (per esempio un paese poi disabilitato), il campo lo mostra comunque; cambiarlo lo toglie dalla scelta.
7. **Validazione**: nome obbligatorio; prezzo obbligatorio e numerico (virgola o punto, al massimo due decimali); prezzo al calice, se compilato, con lo stesso formato; tipologia e paese obbligatori; anno, se compilato, di quattro cifre tra 1900 e l'anno corrente (oppure «NV»). Con errori: nessun salvataggio, messaggi sotto i campi, primo campo non valido in vista e con il focus. Capacità e grado sono a scelta e non hanno errori di campo.
8. **Coerenza geografica dal server**: se il server rifiuta (regione non del paese, denominazione non della regione, denominazione senza regione) il messaggio sta sotto il campo indicato, che ha il focus; le altre modifiche restano nel modulo.
9. **Salvataggio**: si salva subito (D9). Mentre dura: pulsanti disabilitati, `Spinner`, «Salvataggio…». A buon fine il foglio si chiude e compare l'avviso che ricorda la ricompilazione. In errore l'avviso rosso resta nel foglio.
10. **Filtri e ricerca**: come nelle altre liste (D5): foglio con Applica e Azzera, etichette rimovibili, numero sul pulsante. I gruppi senza righe non compaiono. La ricerca trova il nome e la cantina. **Filtro per origine**: Regione è attiva solo con un paese che ha regioni e Denominazione solo con una regione che ha denominazioni; cambiare il paese azzera regione e denominazione; togliere dall'elenco l'etichetta del paese toglie anche regione e denominazione, togliere la regione toglie la denominazione. Il filtro si applica nella richiesta (`country`, `region`, `appellation`).
11. **Foglio con modulo lungo**: i pulsanti Salva e Annulla restano agganciati in fondo mentre il contenuto scorre.
12. **Elenco parziale**: se il totale supera il limite della richiesta, compare l'avviso con «Mostra altri vini»; il pulsante carica la pagina successiva e l'avviso sparisce quando sono tutti caricati. Mai troncare in silenzio.
13. **Ordine**: tipologie e vini per nome, senza distinzione tra maiuscole e minuscole e con le regole dell'italiano.
14. **Tema e tocco**: come D4 e D6.

## 8. Componenti da installare e da comporre

- **Da installare**: nessun componente oltre a quelli già richiesti da shell, Orari, Prenotazioni e Piatti.
- **Componenti di composizione** (`components/app/`, solo con componenti di `components/ui`; rilievo P2): colonna dell'elenco (`max-w-5xl`, condivisa con Piatti), gruppo per tipologia (intestazione, tabella a colonne fisse e schede), riga di vino (variante riga di tabella e variante scheda, con interruttore, matita e cestino), modulo del vino con le sue quattro sezioni e la traduzione a scomparsa, **selezione a cascata** di paese, regione, denominazione e classificazione, conferma di eliminazione (condivisa con Piatti, variante «libera»), pulsante «Ricompila il menù pubblico» con la sua conferma (condiviso con Piatti).
- **Eccezioni alla regola UI** (`ui-check-allow`): nessuna.
- **Logica pura in `lib/`** (con test): stato mostrato (disabilitato, disponibile), filtro dell'elenco, conteggio per tipologia, formato del prezzo con la virgola (lo stesso dei piatti), testi con singolare e plurale, **opzioni e azzeramento della cascata** (dato lo stato del modulo e il campo cambiato: quali campi si svuotano e quali si disabilitano, con il loro segnaposto) le condizioni `where` delle opzioni (paesi abilitati, regioni del paese, denominazioni della regione, classificazioni del paese), **le forme canoniche di anno, capacità e grado** (elenchi, validatori e funzioni di normalizzazione) in un solo modulo, usato dall'interfaccia, dalle funzioni `validate` dei campi e dall'import (6.8), e il **filtro per origine** (condizione e azzeramento a cascata).

## 9. Checklist di accettazione

Si verifica con Playwright (viewport e, per il tocco, `is_mobile` e `has_touch`). Controlli comuni **C1–C10** di `modello-specifica-schermata.md`. Controlli specifici:

1. **Nessuno scorrimento orizzontale** a 360, 390 e 1280 px in tutte le viste (elenco, fogli, finestre, stati). *Misurato nel prototipo il 2026-10-14: 0 su 23 combinazioni.*
2. **Aree di tocco** a 390 px con tocco simulato (C2): nessun elemento sotto 44 px in elenco, filtri, modulo (con e senza traduzione aperta, con un paese senza regioni), nuovo, conferma di eliminazione, ricompila. *Misurato nel prototipo: nessuno sotto 44 px.*
3. **Colonna e elenco**: a 1280 px la colonna è larga 976 px (mai più di 1024), si vede la tabella e non le schede; a 390 px si vedono le schede e non la tabella. *Misurato nel prototipo.*
4. **Colonne fisse**: le colonne Origine, Prezzo, Disponibile e azioni hanno la stessa posizione orizzontale in tutti i gruppi a 1280 px.
5. **Azioni di riga**: ogni riga ha l'interruttore «Disponibile», la matita e il cestino, tutti a 44 px a 390 px con tocco simulato, con i nomi accessibili della sezione 6; il nome non è cliccabile; nessun menu «⋯».
6. **Abilita e disabilita**: un tocco cambia lo stato, il vino passa alla voce giusta del filtro «Stato», compare l'avviso; `disponibilita.json` cambia entro pochi secondi (dopo la 6.4). L'interruttore è attivo anche sui vini disabilitati.
7. **Ricompilazione**: come in Piatti (il pulsante apre la conferma; un secondo avvio ravvicinato mostra «già in corso»; un utente senza ruolo non può invocarla).
8. **Modulo**: nome, tipologia, paese e prezzo obbligatori con i messaggi della sezione 6; focus sul primo campo non valido; il prezzo accetta «28», «28,5», «28,50» e «28.50» e rifiuta «abc» e tre decimali; il prezzo al calice vuoto è accettato.
8b. **Campi a scelta**: la capacità offre «Non indicata», 25, 33, 37,5, 50, 75 e 150 cl; il grado «Non indicato» e da 5% a 20% a passi di 0,5; l'anno accetta 1900, 2022 e l'anno corrente, rifiuta 1899, l'anno successivo, «12» e valori con lettere (il campo accetta solo cifre); la casella NV svuota e disabilita l'anno e salva «NV»; un valore salvato fuori elenco (grado «12,8%») resta visibile e il vino si salva senza cambiarlo.
8c. **Formati dal server**: una richiesta diretta (REST o Admin) con anno «99», capacità «70 cl» o grado «12,8%» torna con il messaggio della sezione 6; la stessa richiesta con un valore canonico passa; **disabilitare un vino che ha già un valore non canonico non fallisce** (se Payload non lo consente, si decide in Parte A come eccezione).
9. **Cascata**: scegliendo Italia compaiono le sue regioni abilitate; scegliendo una regione con denominazioni (Friuli Venezia Giulia) compaiono Carso e Collio; cambiando il paese si svuotano regione e denominazione; con un paese senza regioni (per esempio Giappone) Regione e Classificazione sono disabilitate con il messaggio; con un paese diverso da Italia e Francia la classificazione non offre le sigle italiane o francesi.
10. **Opzioni filtrate nella query**: un paese con `enabled` falso (Libano) non compare nel menu; una regione non abilitata (Sicilia) non compare; le richieste di regioni, denominazioni e classificazioni portano la condizione sul paese o sulla regione (controllo sulla richiesta, non sul DOM).
11. **Valore salvato fuori filtro**: un vino con il paese poi disabilitato mostra comunque quel paese nel modulo.
12. **Coerenza dal server**: una richiesta con regione non del paese (inviata con una chiamata diretta) torna con il messaggio della sezione 6 e l'interfaccia lo mostra sotto Regione con il focus.
13. **Lingue**: traduzione chiusa per default; si apre se esiste; badge «Manca» o «Presente» coerente; con l'inglese vuoto una lettura `locale=en` ricade sull'italiano.
14. **Eliminazione**: conferma, il vino sparisce, compare «Vino eliminato»; la riga di registro (`eventType: delete`, `area: app`, collection, identificativo, nome) esiste; `disponibilita.json` non contiene più l'identificativo entro pochi secondi; consentita a manager (`appRole`), admin e super-admin, rifiutata a un utente senza ruolo.
15. **Tassonomie a sola scelta**: Tipologia, Paese, Regione, Denominazione e Classificazione offrono solo i valori esistenti; nessun pulsante per crearne; nessuna eliminazione di tassonomie nell'App.
16. **Persistenza e permessi**: nuovo e modifica si salvano con la sessione dell'utente (`overrideAccess: false`) e la rilettura dà gli stessi valori.
17. **Filtri e ricerca**: Applica e Azzera; etichette rimovibili e numero sul pulsante; la ricerca trova il nome e la cantina; con 101 vini nel database la richiesta restituisce 100, compare «Mostrati 100 vini su 101» e «Mostra altri vini» carica il centounesimo.
17b. **Filtro per origine**: Regione è disabilitata senza paese o con un paese senza regioni; scegliendo Italia › Friuli Venezia Giulia › Collio l'elenco mostra solo i vini con quell'origine; la richiesta porta le condizioni su paese, regione e denominazione (controllo sulla richiesta); togliere l'etichetta del paese toglie anche le altre due.
18. **Ordine**: tipologie e vini per nome; ricerca, filtri e ordine arrivano dalla richiesta.
19. **Stati**: caricamento, errore di caricamento con «Riprova», errore dell'azione, nessun vino, nessun risultato, elenco parziale: come negli screenshot.
20. **Testi**: coincidono con la sezione 6, singolare e plurale compresi («1 vino»).
21. **Temi, accesso, `pnpm ui:check`**: C3, C4 (`canAccessSection(user, 'menu')`), C9.
22. **Confronto visivo** con i PNG di riferimento a 390 e 1280 px, in tema chiaro e scuro (C10).

## 10. Scelte confermate, assunzioni e debiti

**Scelte confermate da Mirko il 2026-10-14**
- **Interruttore «Disponibile»** a un tocco su ogni riga (non l'occhio), più matita e cestino; niente menu «⋯» (D13).
- **Raggruppamento per tipologia**, in ordine per nome.
- **Filtro per origine** (paese → regione → denominazione), a cascata come nel modulo.
- **Classificazione filtrata dal paese** scelto nel modulo: aiuto dell'interfaccia, non validazione; un valore salvato fuori filtro resta visibile.
- **Elenco parziale con «Mostra altri vini»** (limite 100 della richiesta).
- **Eliminazione** del vino da parte del manager, con conferma (D14).
- **Campi a scelta (D15)**: capacità a scelta tra 25, 33, 37,5, 50, 75 e 150 cl; grado a scelta da 5% a 20% a passi di 0,5 (letto come conferma di «capacità e grado a scelta»); **anno numerico validato** con «Senza annata (NV)»; validazione nel server; normalizzazione nell'import (6.8) con il report a secco esteso alle forme distinte di anno e grado.

**Assunzioni ancora da confermare** (il design le usa; vanno confermate prima di consegnare la schermata a Cursor)
1. **Ricerca** sul nome e sulla cantina.
2. **Elenco**: la denominazione e la classificazione non compaiono in tabella (solo «paese · regione»); si vedono nel modulo.
3. **Anno**: l'estremo basso 1900 e quello alto (l'anno corrente, non il successivo).
4. **Grado**: i passi di 0,5% da 5% a 20%; un grado come 12,8% si arrotonda scegliendo dall'elenco.
5. **Pulsante «Ricompila il menù pubblico»** in intestazione come in Piatti, in attesa della schermata di integrazione.
6. **Tabella a colonne fisse**: Piatti oggi ha le colonne che si spostano da un gruppo all'altro; si allinea quando si implementa.

**Debiti futuri e punti aperti**
- **Forme reali di anno e grado nello snapshot**: non verificate (lo snapshot è fuori dal repo, in `~/vtn-export-2026-10-12`). Il report a secco esteso le elencherà e le liste e le regole di normalizzazione si fissano su quei dati prima dell'import di produzione. L'import normalizza oggi solo la capacità (forme note «75cl», «75 cl», «50 cl»).
- **Aggiornamento parziale e validazione**: se Payload valida tutto il documento a ogni salvataggio, un vino importato con un valore non canonico non si potrebbe disabilitare: la regola «un valore non modificato non blocca» va provata in Parte A.
- **Paginazione completa** oltre «Mostra altri vini» (ricerca e filtri già nella richiesta).
- **Allergeni sui vini** (solfiti): non previsti da `ADR-108`, non si decide qui.
- **Esito della ricompilazione**: come in Piatti, la schermata dice solo «avviata» (6.5).
- **Distillati e Bevande**: gli stessi principi (D15) per grado, capacità e, per i distillati, invecchiamento; gli elenchi si fissano con le loro schermate.
