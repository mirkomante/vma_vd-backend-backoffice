# Piatti, elenco e modulo — specifica di schermata (`/app/menu`, voce Piatti)

**Stato**: chiusa il 2026-10-10; **rivista il 2026-10-14** per tre decisioni successive di Mirko: reset di «terminato» all'inizio del servizio successivo (2026-10-12), azioni di riga con icone visibili al posto del menu «⋯» (D13, 2026-10-14) e cancellazione dei piatti da parte del manager (D14, 2026-10-14). Gestione delle due lingue: alternativa B scelta da Mirko. Le scelte della sezione 10 sono state confermate da Mirko il 2026-10-10 (l'ordine è per nome, corretto dopo la verifica di `ADR-112`).

**Si implementa in**: `fase-6` sottofase 6.6 (backoffice «Menù»; non ancora nel repo). Dipende da 8.2 (shell), 8.3 (guardia), 6.2 (collection `dishes`), 6.4 (disponibilità) e 6.5 (ricompilazione).

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D1–D10, D13, D14), `fase-6-menu-digitale.md` §§6.1, 6.2, 6.4, 6.5, 6.6, `ADR-108` (emendamento del 2026-10-14), `ADR-112`, `ADR-113` (emendamento del 2026-10-14), `ADR-115` (nota del 2026-10-14), `riepilogo-sessione-varianti-porzione-piatto.md` (il piatto non ha varianti: la quantità vive nella composizione del menu fisso).

**File del pacchetto** (stessa cartella): `mockup.html` (mockup statico annotato) e screenshot di riferimento. Stato iniziale: `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` (pagina intera). Telefono: `390-filtri-chiaro.png`, `390-filtri-attivi-chiaro.png`, `390-modulo-chiaro.png`, `390-modulo-inglese-aperto-chiaro.png`, `390-modulo-allergeni-chiaro.png`, `390-modulo-fondo-chiaro.png`, `390-nuovo-chiaro.png`, `390-nuovo-errori-chiaro.png`, `390-terminato-chiaro.png`, `390-disabilita-chiaro.png`, `390-elimina-chiaro.png`, `390-elimina-bloccata-chiaro.png`, `390-eliminato-chiaro.png`, `390-ricompila-chiaro.png`, `390-ricompila-avviata-chiaro.png`, `390-ricompilazione-in-corso-chiaro.png`, `390-piu-di-100-piatti-chiaro.png`, `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-vuoto-chiaro.png`, `390-nessun-risultato-chiaro.png`, `390-errore-azione-chiaro.png`. Notebook: `1280-modulo-chiaro.png`. Il mockup usa `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`.

---

## 1. Obiettivo e accesso

Il manager (e admin e super-admin) vede i piatti del menù per categoria, segna «terminato» con un tocco, disabilita e abilita, crea, modifica ed elimina un piatto, e può avviare la ricompilazione del menù pubblico. Funziona da telefono e da notebook (requisito di base, sezione 0 di `decisioni-layout-app.md`).

- **Accesso**: `canAccessSection(user, 'menu')`. Non autenticato → `/app/login`. Sezione non consentita non raggiungibile nemmeno dall'URL.
- **Cancellazione** (D14): il manager può **eliminare** un piatto, con conferma; non lo può eliminare se è in un menù fisso (il database rifiuta la cancellazione, `ADR-108`, nota del 2026-10-13: l'App lo dice prima, con l'elenco dei menù). **Disabilitare** è un'altra azione e resta sempre possibile. Le tassonomie (categorie dei piatti, allergeni) non si eliminano dall'App: restano all'admin, nell'Admin.
- **Fuori perimetro**: le altre voci della sezione (vini, bevande, distillati, menù fissi) hanno la loro schermata; le tassonomie (categorie, allergeni) si creano nell'Admin; la validazione di allergeni e flag (`ADR-108` §10).

## 2. Collegamento ai dati

Collection `dishes` (`fase-6` §6.2), con la Local API **con la sessione dell'utente** (`overrideAccess: false`), così valgono i permessi: il manager legge, crea, modifica e cancella (emendamento ad `ADR-113` del 2026-10-14); un utente senza ruolo non può nulla.

| Elemento | Campo | Note |
|---|---|---|
| Nome, Descrizione | `name`, `description` (localizzati) | Italiano obbligatorio per il nome; inglese facoltativo con ripiego sull'italiano |
| Traduzione inglese | gli stessi campi, locale `en` | Badge «Presente» se `name` o `description` in inglese non sono vuoti, «Manca» altrimenti |
| Prezzo | `price` (numero) | Mostrato e scritto con la virgola («9,00») |
| Categoria | `category` → `dish-categories` | Obbligatoria; **solo scelta**, nessun pulsante per crearne |
| Allergeni | `allergens` → `allergens` (molti) | Le opzioni sono i record della tassonomia (14 normativi), con il nome nella lingua dell'interfaccia; non una lista fissa nel codice |
| Caratteristiche | `glutenFree`, `dairyFree`, `vegan`, `eggFree` | Quattro caselle |
| Terminato | `soldOut` | Temporaneo: si azzera **all'inizio del servizio successivo** (`startTime` di pranzo e cena in Impostazioni di sistema; decisione del 2026-10-12, `fase-6` §6.4) |
| Scadenza di «Terminato» | calcolata, non salvata | Il prossimo `startTime` di pranzo o cena dopo l'istante attuale, dagli orari di `impostazioni-sistema` letti con la sessione dell'utente (sezione 8, `lib/`). Se gli orari non sono configurati l'indicazione non compare |
| Disabilitato | `disabled` | Assenza a tempo indefinito |

**Interrogazioni**
- Elenco: tutti i piatti, disabilitati compresi, raggruppati per categoria. **Ordine: per nome**, sia le categorie sia i piatti dentro ciascuna (come il contratto del menù pubblico, `ADR-112` §1: «per nome, come oggi, salvo un campo esplicito introdotto in seguito»); se un giorno esiste un campo di ordinamento, l'elenco lo segue. Quali categorie compaiono in quale pagina del menù pubblico è configurazione del frontend (`ADR-112` §2): il backoffice non la mostra. Ricerca sul nome (italiano e inglese).
- **Ricerca, filtri e ordine si applicano nella richiesta** (condizione `where` e `sort` della Local API), non nel browser dopo aver letto tutto. Così l'eventuale paginazione futura (sezione 10) non cambia la schermata. La richiesta usa `limit=100`, come il contratto di `ADR-112` (oggi i piatti sono 44). Filtri: categoria, stato (Disponibili, Terminati, Disabilitati), «Senza allergeni dichiarati» (nessun allergene selezionato: aiuta la revisione di 6.8, non è una validazione).
- Stato mostrato: **Disabilitato** se `disabled`, altrimenti **Terminato** se `soldOut`, altrimenti **Disponibile**. Entrambi valgono **ovunque** il piatto compare, menù fissi compresi (un solo piatto, un solo stato: `ADR-108` §4).
- **Prima di eliminare**: i menù fissi che contengono il piatto (`fixed-menus` con `dishes.dish` uguale all'identificativo; titolo e numero, al massimo tre nomi nell'elenco), letti con la sessione dell'utente. Se ce n'è almeno uno l'App non offre l'eliminazione. Il rifiuto del database (`fixed_menus_dishes.dish_id` è `NOT NULL` con `ON DELETE set null`) resta come rete di sicurezza per il caso in cui il piatto venga aggiunto a un menù fisso tra l'apertura della finestra e la conferma.

**Effetti sul menù pubblico**
- «Terminato» e abilita/disabilita riscrivono `disponibilita.json` (6.4) entro pochi secondi; il menù pubblico lo rilegge circa ogni cinque minuti (`ADR-112`) e li mostra entro pochi minuti, senza ricompilazione. Un «terminato» segnato fuori da un servizio (la mattina prima del pranzo, tra pranzo e cena, la sera) sparisce all'apertura successiva: è la conseguenza accettata il 2026-10-12, e l'indicazione di scadenza la rende visibile.
- Piatti nuovi e modifiche ai contenuti (nome, descrizione, prezzo, categoria, allergeni, caratteristiche) compaiono **dopo la ricompilazione** (6.5). Per questo dopo il salvataggio l'avviso lo ricorda.
- **Eliminazione**: cancellazione fisica; `disponibilita.json` si riscrive (l'hook `afterDelete` della 6.4) e il piatto sparisce dal menù pubblico alla ricompilazione. Ogni cancellazione lascia una riga nel registro attività (`eventType: delete`, `area: app`, collection, identificativo, nome e numero di riferimenti, nessun dato personale; `ADR-115`, nota del 2026-10-14). Nessuna migrazione: il valore `delete` esiste già.

## 3. Albero blocchi → componenti → varianti

Ricavato dal mockup annotato (`Componente (variante, dimensione)`).

| Blocco (`data-block`) | Contenuto | Componenti |
|---|---|---|
| `topbar` | Pulsante del menu, briciola «Menù › Piatti» | `SidebarTrigger`, `Separator`, `Breadcrumb` (con `BreadcrumbLink`) |
| `contenitore-elenco` | Colonna dell'elenco (D8) | composizione, sezione 8 |
| `intestazione-pagina` | Titolo, descrizione, due azioni | `Button (default, lg)` «Nuovo piatto» e `Button (outline, lg)` «Ricompila il menù pubblico», con icona |
| `ricerca-filtri` | Ricerca e pulsante Filtri con il numero | `Input`, `Button (outline, default)`, `Badge (default)` |
| `filtri-attivi` | Etichette rimovibili | `Button (secondary, sm)` con icona |
| `gruppo-<categoria>` | Intestazione con il conteggio, poi tabella e schede | testo (`h2`), vedi sotto |
| `elenco-tabella` (da 768 px) | Nome, Prezzo, Stato, Terminato, azioni | `Table`, `TableRow`, `TableCell`, nome come testo (non è un collegamento), `Badge` per Terminato e Disabilitato con sotto l'indicazione di scadenza, `Switch`, `Button (ghost, icon)` ×3: matita (Modifica), occhio barrato o aperto (Disabilita o Abilita) e cestino (Elimina) |
| `elenco-schede` (sotto 768 px) | Nome e prezzo, stato e scadenza, interruttore «Terminato», matita, occhio, cestino | `Card (sm)`, `Badge`, indicazione di scadenza, `Switch`, `Button (ghost, icon)` ×3 (matita, occhio, cestino) |
| (stato) filtri | Foglio con Categoria, Stato, casella | `Sheet`, `Field`, `Select`, `Checkbox`, `Button (lg)` Applica e Azzera |
| (stato) modulo | Nuovo piatto e modifica | `Sheet`, `FieldGroup`, `Field`, `Input`, `Textarea`, `Collapsible` (traduzione), `Badge (outline)`, `Select`, `FieldSet` + `ToggleGroup (outline, multiple)` (allergeni), `Checkbox` ×4 (caratteristiche), `Switch` ×2 (disponibilità), `FieldError`, `Button (lg)` Salva e Annulla |
| (stato) ricompila | Conferma della ricompilazione | `AlertDialog`, `Button (default)`, `Spinner` |
| (stato) elimina | Conferma («Eliminare {nome}?») oppure «Non si può eliminare» con l'elenco dei menù | `AlertDialog`, `Button (destructive)`, `Button (outline)` per «Indietro» e «Chiudi», `Spinner` |
| (stato) caricamento | Quattro blocchi | `Skeleton` |
| (stato) avvisi | Esito, elenco parziale, errore di caricamento, errore dell'azione | `Alert (default | destructive)`, `AlertTitle`, `AlertDescription` |

La shell (barra laterale, menu utente, tema) è quella di D1–D4 e non fa parte di questa specifica.

## 4. Layout e regole responsive

| | Telefono (sotto 768 px) | Schermo largo (da 768 px) |
|---|---|---|
| Shell | Barra in alto con pulsante del menu; il menu è un pannello laterale | Barra laterale fissa da 16 rem |
| Colonna | Tutta la larghezza, margine 16 px | Centrata, larga al massimo `max-w-5xl` (64 rem): a 1280 px è 976 px |
| Azioni di pagina | In colonna, **«Nuovo piatto» per prima** (azione principale in alto), poi «Ricompila il menù pubblico» | In riga, «Ricompila» a sinistra e «Nuovo piatto» a destra |
| Elenco | Schede: nome e prezzo a sinistra (il nome si tronca con i puntini se non entra), a destra interruttore «Terminato» con etichetta, matita, occhio e cestino (a 390 px il nome ha circa 137 px su 358) | Tabella con cinque colonne; nell'ultima, matita, occhio e cestino |
| Stato | Badge solo per Terminato e Disabilitato; per Disponibile nessun badge (lo dice il nome accessibile). Sotto il badge «Terminato», riga discreta «fino all’apertura della cena» | Testo discreto «Disponibile»; badge per gli altri, con la stessa riga sotto «Terminato» |
| Righe disabilitate | Attenuate; l'interruttore «Terminato» è disabilitato | Idem |
| Foglio (filtri, modulo) | Dal basso, altezza massima 90 % dello schermo con scorrimento; **i pulsanti restano agganciati in fondo**, affiancati | Da destra; pulsanti agganciati in fondo, affiancati |
| Allergeni | Pulsanti a scelta multipla che vanno a capo (14 voci, 6 righe a 390 px) | Idem |
| Dimensioni dei controlli | Dispositivo touch (`pointer-coarse`): ≥ 44 px (D6) | Con mouse: misure standard di Nova |

Nessuno scorrimento orizzontale a 360, 390 e 1280 px. Le barre agganciate richiedono `overflow-x: clip` in `app-ui.css` (P1 di `decisioni-layout-app.md`).

## 5. Stati

| Stato | Cosa si vede | Riferimento |
|---|---|---|
| Elenco | Gruppi per categoria con il conteggio; righe disabilitate attenuate | `*-chiaro.png`, `*-scuro.png` |
| Terminato con un tocco | L'interruttore cambia, avviso «Piatto segnato come terminato» con la scadenza | `390-terminato-chiaro.png` |
| Disabilita con un tocco | L'occhio barrato disabilita, l'avviso lo dice; la riga si attenua e l'occhio diventa aperto (Abilita) | `390-disabilita-chiaro.png` |
| Elimina (piatto libero) | Finestra «Eliminare {nome}?», «Non si può annullare.», pulsanti «Indietro» ed «Elimina» | `390-elimina-chiaro.png` |
| Elimina (piatto in uso) | Finestra «Non si può eliminare {nome}» con l'elenco dei menù fissi che lo usano; un solo pulsante, «Chiudi» | `390-elimina-bloccata-chiaro.png` |
| Piatto eliminato | Il piatto sparisce dall'elenco; avviso «Piatto eliminato» con il richiamo alla ricompilazione | `390-eliminato-chiaro.png` |
| Filtri | Foglio con Categoria, Stato, «Senza allergeni dichiarati», Applica, Azzera | `390-filtri-chiaro.png` |
| Filtri attivi | Etichette rimovibili e numero sul pulsante | `390-filtri-attivi-chiaro.png` |
| Modulo | Nome, Descrizione, Traduzione inglese a scomparsa, Prezzo, Categoria, Allergeni, Caratteristiche, Disponibilità | `390-modulo-chiaro.png`, `390-modulo-allergeni-chiaro.png`, `390-modulo-fondo-chiaro.png`, `1280-modulo-chiaro.png` |
| Traduzione inglese aperta | Name e Description con il suggerimento sul ripiego | `390-modulo-inglese-aperto-chiaro.png` |
| Nuovo piatto | Modulo vuoto | `390-nuovo-chiaro.png` |
| Errori del modulo | Messaggi sotto i campi; il primo campo non valido ha il focus | `390-nuovo-errori-chiaro.png` |
| Ricompila | Conferma con la spiegazione; poi avviso «Ricompilazione avviata» o «già in corso» | `390-ricompila-chiaro.png`, `390-ricompila-avviata-chiaro.png`, `390-ricompilazione-in-corso-chiaro.png` |
| Errore dell'azione | Avviso rosso nel foglio che l'ha avviata; nulla cambia | `390-errore-azione-chiaro.png` |
| Più di 100 piatti | Avviso in testa all'elenco: «Mostrati 100 piatti su 137» e come restringere | `390-piu-di-100-piatti-chiaro.png` |
| Caricamento | Quattro blocchi `Skeleton` | `390-caricamento-chiaro.png` |
| Errore di caricamento | Solo avviso rosso con «Riprova» | `390-errore-caricamento-chiaro.png` |
| Nessun piatto | Messaggio e «Nuovo piatto» | `390-vuoto-chiaro.png` |
| Nessun risultato | Messaggio e «Azzera filtri» | `390-nessun-risultato-chiaro.png` |

## 6. Testi

Tutti in italiano; `{…}` sono dinamici.

| Dove | Testo |
|---|---|
| Titolo | Piatti / Il menù digitale del ristorante. / Nuovo piatto · Ricompila il menù pubblico |
| Ricerca | Segnaposto «Cerca un piatto»; pulsante «Filtri» (con il numero); etichette rimovibili, nome accessibile «Rimuovi filtro {etichetta}» |
| Foglio filtri | Filtri / Restringi l’elenco dei piatti. / Categoria («Tutte le categorie» + le categorie), Stato (Tutti, Disponibili, Terminati, Disabilitati), «Senza allergeni dichiarati» / Applica, Azzera |
| Gruppo | {Categoria} {1 piatto \| N piatti} |
| Colonne | Nome, Prezzo, Stato, Terminato, (Azioni, solo per lo screen reader) |
| Scadenza di «Terminato» | Riga sotto il badge: «fino all’apertura della {cena \| del pranzo}» ({cena \| pranzo} è il prossimo servizio che apre; «di domani» solo se non apre oggi). Senza l'orario: scelta di Mirko, 2026-10-14. Orari non configurati: la riga non compare |
| Stati | Disponibile (testo), Terminato, Disabilitato (badge); nome accessibile della scheda «{nome}, {prezzo}, {stato}» |
| Interruttore | «Terminato» (etichetta visibile su telefono; nome accessibile «Terminato: {nome}») |
| Azioni di riga | Nomi accessibili «Modifica {nome}», «Disabilita {nome}» / «Abilita {nome}» ed «Elimina {nome}». Nessun testo visibile: sono icone (D13) |
| Avvisi rapidi | Piatto segnato come terminato · Piatto di nuovo disponibile · Piatto disabilitato · Piatto abilitato / «Il menù pubblico si aggiorna entro pochi minuti.» Dopo «terminato» si aggiunge: «Torna disponibile da solo all’apertura della {cena \| del pranzo}.» |
| Avvisi di salvataggio | Piatto aggiunto · Piatto salvato / «Per vederlo sul menù pubblico serve «Ricompila il menù pubblico».» |
| Elimina | Conferma: «Eliminare {nome}?» / «Non si può annullare.» / Indietro, Elimina. Piatto in uso: «Non si può eliminare {nome}» / «È usato in {1 menù fisso \| N menù fissi}: {nomi}. Toglilo da lì, poi potrai eliminarlo.» / Chiudi. I nomi sono al massimo tre, poi «e altri {N}». Esito: «Piatto eliminato» / «Per toglierlo dal menù pubblico serve «Ricompila il menù pubblico».» Errore imprevisto (compreso il rifiuto del database): «Operazione non riuscita» / «Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore.» Nessun testo suggerisce di disabilitare: l'occhio è nella riga |
| Conferma ricompila | Ricompilare il menù pubblico? / La pubblicazione richiede alcuni minuti. Serve per vedere piatti nuovi e modifiche ai contenuti, ai servizi, agli orari, alle chiusure e ai giorni speciali. «Terminato» e «disabilitato» valgono già. / Indietro, Ricompila |
| Esito ricompila | Ricompilazione avviata / Il menù pubblico si aggiorna tra alcuni minuti. · Una ricompilazione è già in corso / Attendi che finisca prima di avviarne un'altra. |
| Modulo | Nuovo piatto («Il piatto compare nel menù pubblico dopo la ricompilazione.») · Modifica piatto («{nome}») · Nome, Descrizione · «Traduzione inglese (facoltativa)» con «Manca» o «Presente» · Name, Description · «Facoltativa. Se resta vuota, il menù mostra il testo italiano.» · Prezzo (€), Categoria (segnaposto «Scegli») · Allergeni «Seleziona quelli presenti nel piatto.» + « Selezionati: {n}.» · Caratteristiche: Senza glutine, Senza latticini, Vegano, Senza uova · Disponibilità: «Terminato per il servizio» («Temporaneo: si azzera da solo all’apertura della {cena \| del pranzo}.»; con gli orari non configurati: «Temporaneo: si azzera da solo all’inizio del servizio successivo.»), «Disabilitato» («Assente a tempo indefinito: il piatto non compare nel menù.») · Salva («Salvataggio…»), Annulla |
| Errori del modulo | Campo obbligatorio. · Inserisci un prezzo valido (es. 9,50). · Scegli una categoria. |
| Elenco parziale | Mostrati 100 piatti su {totale} / Restringi l’elenco con la ricerca o i filtri per trovare gli altri. |
| Errore dell'azione | Operazione non riuscita / Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore. |
| Errore di caricamento | Impossibile caricare i piatti / Riprova tra qualche istante; se il problema continua, avvisa l’amministratore. / Riprova |
| Vuoti | Nessun piatto nel menù. (+ «Nuovo piatto») · Nessun risultato con questi filtri. (+ «Azzera filtri») |

**Singolare e plurale**: «1 piatto» al singolare, negli altri casi «N piatti».

## 7. Comportamenti

1. **Terminato con un tocco**: l'interruttore dell'elenco salva subito (D9) e mostra l'avviso con la scadenza; se il salvataggio fallisce, nulla cambia e compare l'errore. Su un piatto disabilitato l'interruttore è disabilitato.
2. **Disabilita / Abilita**: con l'occhio della riga (D13), salva subito e mostra l'avviso; è reversibile, quindi senza conferma. Un piatto disabilitato resta nell'elenco, attenuato, con l'occhio aperto.
2b. **Elimina**: il cestino della riga legge i menù fissi che contengono il piatto. Se non ce n'è, apre la conferma («Eliminare {nome}?», D9: azione irreversibile); «Elimina» cancella, chiude la finestra, toglie la riga e mostra l'avviso. Se ce n'è almeno uno, apre la finestra «Non si può eliminare», senza pulsante di cancellazione. Se la cancellazione fallisce (rete, rifiuto del database) nulla cambia e compare l'errore imprevisto nella finestra, che resta aperta. Mentre si elimina: pulsanti disabilitati, `Spinner`. Il piatto disabilitato si può eliminare come gli altri.
3. **Apertura del modulo**: con la matita della riga. Il nome non è un collegamento e la scheda non è tappabile (D13). «Nuovo piatto» apre lo stesso modulo vuoto.
3b. **Scadenza di «Terminato»**: la riga sotto il badge, l'avviso e la descrizione dell'interruttore nel modulo usano lo stesso testo, calcolato dalla stessa funzione di `lib/` (sezione 8). Si ricalcola a ogni apertura della pagina; non si aggiorna da sola a pagina aperta.
4. **Traduzione inglese**: chiusa per default, si apre da sola se il piatto ha già una traduzione. Il badge dice «Manca» o «Presente». Il campo `Name` mostra come segnaposto il nome italiano. Se l'inglese resta vuoto il menù pubblico usa l'italiano.
5. **Validazione**: nome obbligatorio; prezzo obbligatorio e numerico (virgola o punto, al massimo due decimali); categoria obbligatoria. Con errori: nessun salvataggio, messaggi sotto i campi, primo campo non valido in vista e con il focus.
6. **Allergeni e caratteristiche**: scelta libera, nessuna validazione tra i due gruppi (`ADR-108` §10 è fuori perimetro). Il numero dei selezionati si aggiorna.
7. **Disponibilità nel modulo**: gli stessi due interruttori dell'elenco. «Terminato» è disabilitato se il piatto è disabilitato.
8. **Salvataggio**: si salva subito (D9). Mentre dura: pulsanti disabilitati, `Spinner`, «Salvataggio…». A buon fine il foglio si chiude e compare l'avviso che ricorda la ricompilazione. In errore l'avviso rosso resta nel foglio.
9. **Ricompila il menù pubblico**: apre la conferma; «Ricompila» avvia la pubblicazione. Un secondo avvio ravvicinato viene ignorato con il messaggio «già in corso» (`fase-6` §6.5). L'esito della pubblicazione non si mostra qui (6.5).
10. **Filtri e ricerca**: come nelle altre liste (D5): foglio con Applica e Azzera, etichette rimovibili, numero sul pulsante. I gruppi senza righe non compaiono.
11. **Foglio con modulo lungo**: i pulsanti Salva e Annulla restano agganciati in fondo mentre il contenuto scorre.
12. **Elenco parziale**: se il totale supera il limite della richiesta, compare l'avviso in testa all'elenco (mai troncare in silenzio). Finché non c'è la paginazione, si trovano gli altri piatti con ricerca e filtri.
13. **Ordine**: categorie e piatti per nome, senza distinzione tra maiuscole e minuscole e con le regole dell'italiano.
14. **Piatto disabilitato**: è disabilitato ovunque, anche dentro i menù fissi; nella schermata dei menù fissi la riga di quel piatto mostrerà che è disabilitato (da disegnare con quella schermata).
15. **Tema e tocco**: come D4 e D6.

## 8. Componenti da installare e da comporre

- **Da installare** (oltre a quelli di shell, Orari e Prenotazioni): `switch`, `toggle-group` (già per Orari), `collapsible`. Il piatto non usa più `dropdown-menu` per le righe (resta nel menu utente della shell). Con le deviazioni del registro di `decisioni-layout-app.md` (D6): in particolare `switch` (area di tocco), `checkbox` (area da 46 px), `sheet` (footer agganciato, altezza massima e scorrimento), `breadcrumb`.
- **Componenti di composizione** (`components/app/`, solo con componenti di `components/ui`; rilievo P2): colonna dell'elenco (`max-w-5xl`), gruppo per categoria (intestazione, tabella e schede), riga di piatto (variante riga di tabella e variante scheda, con matita, occhio e indicazione di scadenza), modulo del piatto con la sezione della traduzione a scomparsa, selezione degli allergeni, pulsante «Ricompila il menù pubblico» con la sua conferma, conferma di eliminazione (varianti piatto libero e piatto in uso).
- **Logica pura in `lib/`** (con test): stato mostrato (disabilitato, terminato, disponibile), filtro dell'elenco, conteggio per categoria, formato del prezzo con la virgola, testi con singolare e plurale, l'**elenco dei menù fissi che usano un piatto** (interrogazione con la sessione dell'utente) e **il prossimo confine di servizio dopo un istante** (`nextServiceStartBoundaryAfter` o nome equivalente) in `lib/menu/availability/serviceBoundaries.ts`: oggi il modulo ha `listServiceStartBoundariesBetween` e `maxBoundaryAtOrBefore`, ma non il confine successivo. Va nello stesso file perché la regola resti in un posto solo: passare da `startTime` a `endTime` resta una modifica unica. Il testo «all’apertura della cena» si compone con il servizio restituito.

## 9. Checklist di accettazione

Si verifica con Playwright (viewport e, per il tocco, `is_mobile` e `has_touch`). Sul telefono i confronti si fanno con **misure geometriche**, non con la differenza di pixel.

1. **Nessuno scorrimento orizzontale** a 360, 390 e 1280 px in tutte le viste (elenco, fogli, finestre, stati).
2. **Aree di tocco** a 390 px con tocco simulato, misurate sull'area cliccabile (a 21,5 px dal centro nelle quattro direzioni) e senza contare gli elementi coperti dal velo: nessun elemento sotto 44 px in elenco, filtri, modulo (con e senza traduzione aperta), nuovo piatto, conferma.
3. **Colonna e elenco**: a 1280 px la colonna è larga 976 px (mai più di 1024) e si vede la tabella, non le schede; a 390 px si vedono le schede e non la tabella.
4. **Azioni di pagina**: a 390 px «Nuovo piatto» sta sopra «Ricompila il menù pubblico»; a 1280 px sono in riga.
5. **Terminato e abilita/disabilita**: un tocco (interruttore o occhio) cambia lo stato, il piatto passa alla voce giusta del filtro «Stato», compare l'avviso; `disponibilita.json` cambia entro pochi secondi (dopo la 6.4). Su un piatto disabilitato l'interruttore è disabilitato.
6. **Ricompilazione**: il pulsante apre la conferma; un secondo avvio ravvicinato mostra «già in corso»; un utente senza ruolo non può invocarla.
7. **Modulo**: nome, prezzo e categoria obbligatori con i messaggi della sezione 6; focus sul primo campo non valido; il prezzo accetta «9,5», «9,50» e «9.50» e rifiuta «abc» e tre decimali.
8. **Lingue**: traduzione chiusa per default; si apre se esiste; badge «Manca» o «Presente» coerente con i campi; con l'inglese vuoto una lettura `locale=en` del piatto ricade sull'italiano.
9. **Tassonomie a sola scelta**: Categoria e Allergeni offrono solo i valori esistenti (letti dalle collection); nessun pulsante per crearne.
10. **Persistenza e permessi**: nuovo e modifica si salvano con la sessione dell'utente (`overrideAccess: false`) e la rilettura dà gli stessi valori; consentiti manager (`appRole`), admin e super-admin; un utente senza ruolo è rifiutato; **il manager può cancellare** un piatto non usato (D14), un utente senza ruolo no.
11. **Filtri e ricerca**: Applica e Azzera; etichette rimovibili e numero sul pulsante; «Senza allergeni dichiarati» mostra solo i piatti senza allergeni; la ricerca trova il nome italiano e quello inglese.
12. **Footer del foglio**: scorrendo il modulo i pulsanti restano al fondo della finestra, affiancati e alti 44 px.
13. **Stati**: caricamento, errore di caricamento con «Riprova», errore dell'azione, nessun piatto, nessun risultato: come negli screenshot.
14. **Testi**: coincidono con la sezione 6, singolare e plurale compresi («1 piatto»).
15. **Temi**: chiaro, scuro e Sistema.
16. **Accesso**: `canAccessSection(user, 'menu')` falsa → sezione non raggiungibile dall'URL.
17. **`pnpm ui:check`** passa.
18. **Ordine e interrogazione**: categorie e piatti per nome; ricerca, filtri e ordine arrivano dalla richiesta (non dal browser): con 101 piatti nel database la richiesta restituisce 100 e l'avviso «Mostrati 100 piatti su 101» compare.
19. **Disabilitato ovunque**: un piatto disabilitato non compare nel menù pubblico né alla carta né dentro un menu fisso (prova con il frontend di prova della 6.5).
20. **Scadenza di «Terminato»**: con orari di pranzo e cena configurati, segnando «terminato» (a) prima del pranzo, (b) tra pranzo e cena, (c) dopo la cena, il testo dice rispettivamente «all’apertura del pranzo», «della cena», «del pranzo di domani»; con gli orari vuoti l'indicazione non compare; la funzione di `lib/` ha test per i tre casi e per il passaggio dell'ora legale; il piatto torna disponibile all'orario indicato (prova con `availability-reset` in sviluppo).
21. **Azioni di riga**: ogni riga ha matita, occhio e cestino, tutti a 44 px a 390 px con tocco simulato, con i nomi accessibili della sezione 6; il nome non è cliccabile e non c'è alcun menu «⋯» di riga.
22. **Eliminazione**: (a) piatto libero: conferma, il piatto sparisce, compare «Piatto eliminato», la riga di registro (`eventType: delete`, `area: app`, collection, identificativo, nome e riferimenti) esiste, `disponibilita.json` non contiene più l'identificativo entro pochi secondi; (b) piatto in un menù fisso: finestra «Non si può eliminare» con i nomi corretti (al massimo tre, poi «e altri N»), nessuna richiesta di cancellazione, il piatto resta; (c) piatto aggiunto a un menù fisso tra l'apertura della finestra e la conferma: l'azione ricontrolla l'uso al momento della conferma e mostra la finestra «Non si può eliminare {nome}» con l'elenco aggiornato (scelta del 2026-10-17: è il messaggio più utile); se il rifiuto arriva invece dal database, per una corsa fra il controllo e la cancellazione, dà «Operazione non riuscita»; in entrambi i casi nulla cambia e il piatto resta; (d) consentito a manager (`appRole`), admin e super-admin, rifiutato a un utente senza ruolo; (e) categorie e allergeni non offrono né mostrano alcuna eliminazione nell'App.
23. **Confronto visivo** con i PNG di riferimento a 390 e 1280 px, in tema chiaro e scuro: rilievi etichettati P e A.

## 10. Scelte confermate e debiti

**Scelte confermate da Mirko il 2026-10-10**

- **Ordine**: per nome (categorie e piatti), come il menù pubblico (`ADR-112` §1). L'assunzione iniziale «ordine di inserimento» era sbagliata ed è stata sostituita dopo la verifica degli ADR.
- **Ricerca** sul nome italiano e inglese.
- **Reset di «terminato»** (decisione di Mirko del 2026-10-12, sostituisce quella del 2026-10-10): «terminato» si azzera all'**inizio del servizio successivo** (`startTime` di pranzo e cena in Impostazioni di sistema; `fase-6` §6.4). Conseguenza accettata: un «terminato» segnato tra i due servizi, o la sera per il pranzo del giorno dopo, sparisce all'apertura. «Da verificare con l'uso se cambiare»; passare a `endTime` è una modifica in una sola funzione. L'indicazione «fino all’apertura della cena» è la scelta di Mirko del 2026-10-14, senza l'orario.
- **Azioni di riga** (D13, 2026-10-14): matita per modificare; interruttore «Terminato»; occhio per disabilitare e abilitare; cestino per eliminare; nessun menu «⋯».
- **Cancellazione** (D14, 2026-10-14): il manager elimina i piatti; non se sono in un menù fisso (con l'elenco dei menù, senza tentare la cancellazione); con la conferma «Non si può annullare.». Emendamento ad `ADR-113` §3 e ad `ADR-108` §9. Il «cascade come per l'admin» scelto da Mirko vale per servizi e menù fissi; per i piatti il database rifiuta, e l'App traduce il rifiuto in un messaggio chiaro (scelta confermata da Mirko il 2026-10-14).
- **Piatto disabilitato**: è disabilitato ovunque, menù fissi compresi; lo stesso vale per «terminato».
- **«Tris di nem»** (un mix di tre tipi): è un piatto a sé, non una porzione. La quantità di un piatto base dentro un menu fisso resta `portion`.
- **`soloMenuFissi`**: non si aggiunge ora (vedi i debiti).

**Debiti futuri, da tenere in conto perché l'aggiunta sia semplice**

- **Paginazione oltre 100 piatti**: oggi i piatti sono 44 e `ADR-112` usa `limit=100` «finché non ci sono altre pagine». Per renderla semplice: ricerca, filtri e ordine stanno già nella richiesta (sezione 2), l'avviso di elenco parziale evita di troncare in silenzio, e il raggruppamento per categoria si calcola sui piatti letti. Quando servirà, si aggiunge un pulsante «Mostra altri piatti» in fondo all'elenco (stesso `Button` del progetto) che legge la pagina successiva; i totali per categoria e il resto della schermata restano uguali.
- **`soloMenuFissi`** (piatto che esiste solo dentro un menu fisso e non va alla carta): una casella «solo per menu fisso», falsa per default, con una migrazione additiva e un filtro nell'elenco. Ha effetto solo quando il frontend pubblico (6.7, fuori perimetro) la legge; per questo si aggiunge insieme a quel bisogno. Il punto del modulo che la ospiterebbe è la sezione «Caratteristiche». Oggi non esiste alcun piatto con questa esigenza (le due varianti «2 Nem» non si importano).

**Ancora aperti**
- **Esito della ricompilazione**: la conferma di fine pubblicazione non è in 6.5; la schermata dice solo «avviata».
- **Traduzioni**: se in futuro le lingue diventano più di due, il blocco «Traduzione inglese» va rivisto.
- Le stesse alternative (due lingue, foglio, filtri) valgono per vini, bevande e menù fissi; ogni voce avrà la sua schermata.
