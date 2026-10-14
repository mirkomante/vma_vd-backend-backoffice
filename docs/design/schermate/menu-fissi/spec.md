# Menù fissi, elenco, categorie e composizione — specifica di schermata (`/app/menu/fixed`, voce Menù fissi)

**Stato**: design chiuso il 2026-10-14 con le risposte di Mirko alle quattro domande di impostazione (foglio con due viste, frecce per l'ordine, almeno un piatto, visibilità precompilata dalla categoria); restano da confermare le assunzioni della sezione 10. È la schermata più ricca del Menù: **due schede** («Menù fissi» e «Categorie») e un modulo che compone il menù scegliendo i piatti. Struttura e comportamenti comuni sono quelli di `schermate/vini/spec.md` e `schermate/servizi/spec.md`; qui si dicono per intero testi e differenze.

**Si implementa in**: `fase-6` sottofase 6.6 (backoffice «Menù»; non ancora nel repo). Dipende da 8.2 (shell), 8.3 (guardia), 6.2 (collection `fixed-menus`, `fixed-menu-categories`, `dishes`, `menu-services`), 6.3 (giorni speciali), 6.4 (disponibilità), 6.5 (ricompilazione) e dalla Parte 0 di 6.6 (permessi di cancellazione e registro). Nella revisione di produzione di 6.8 questa è la schermata con cui si ricompongono a mano le 2 categorie e gli 8 menù fissi dopo l'import.

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D1, D5, D6, D8, D9, D10, D13, D14, D15), `fase-6-menu-digitale.md` §§6.2, 6.3, 6.4, 6.5, 6.6, 6.8, `ADR-108` (§2 sulla visibilità, note del 2026-10-13 e del 2026-10-14), `ADR-112` (nota del 2026-10-14), `ADR-113` (emendamento del 2026-10-14), `ADR-115` (nota del 2026-10-14), `schermate/piatti/spec.md` §7.14 (stato dei piatti nella composizione), `schermate/servizi/spec.md`.

**File del pacchetto** (stessa cartella): `mockup.html` (mockup statico annotato, scheda «Menù fissi») e screenshot di riferimento. Stato iniziale: `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` (pagina intera). Telefono: `390-categorie-chiaro.png`, `390-categorie-vuoto-chiaro.png`, `390-categoria-modulo-chiaro.png`, `390-categoria-nuova-errori-chiaro.png`, `390-modulo-chiaro.png`, `390-modulo-piatti-chiaro.png`, `390-modulo-servizi-chiaro.png`, `390-modulo-inglese-aperto-chiaro.png`, `390-scegli-piatti-chiaro.png`, `390-nuovo-chiaro.png`, `390-nuovo-errori-chiaro.png`, `390-nuovo-senza-categorie-chiaro.png`, `390-visibilita-categoria-chiaro.png`, `390-visibilita-avviso-chiaro.png`, `390-disponibilita-chiaro.png`, `390-elimina-chiaro.png`, `390-elimina-senza-uso-chiaro.png`, `390-eliminato-chiaro.png`, `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-vuoto-chiaro.png`, `390-errore-azione-chiaro.png`. Notebook: `1280-modulo-chiaro.png`, `1280-scegli-piatti-chiaro.png`. Il mockup usa `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`.

---

## 1. Obiettivo e accesso

Il manager (e admin e super-admin) vede i menù fissi raggruppati per categoria, li abilita e disabilita con un tocco, ne crea, modifica ed elimina, compone ogni menù scegliendo e ordinando i piatti, collega i servizi, e gestisce le categorie nella scheda «Categorie»; può avviare la ricompilazione del menù pubblico. Funziona da telefono e da notebook.

- **Accesso**: `canAccessSection(user, 'menu')`. Non autenticato → `/app/login`. Sezione non consentita non raggiungibile nemmeno dall'URL.
- **Cancellazione** (D14): il manager **elimina un menù fisso**, con conferma; sparisce in silenzio dai giorni speciali che lo contengono (cascade, `ADR-108` nota del 2026-10-13: `special_days_rels` → `fixed_menus`), e la conferma lo dichiara. Le **categorie non si eliminano**: si disabilitano (la categoria è obbligatoria sul menù fisso, e il database rifiuterebbe la cancellazione di una categoria in uso). **Disabilitare** un menù è l'interruttore, senza avvisi.
- **Categorie** (decisione del 2026-10-14): non sono tassonomie ma contenuti, e le gestisce il manager qui: crea, modifica, disabilita; non elimina. Nessuna voce di menu a parte: sono la scheda «Categorie» di questa schermata.
- **Nessuna categoria** (stato di produzione prima della revisione): il pulsante «Nuovo menù fisso» resta attivo e il campo Categoria del modulo, vuoto e disabilitato, dice «Nessuna categoria: creane una nella scheda Categorie»; il salvataggio resta bloccato da «Scegli una categoria.».
- **Fuori perimetro**: i giorni speciali e la loro composizione (schermata a parte); la creazione di piatti e servizi (si fa nelle loro schermate); il pulsante «Ricompila il menù pubblico» è condiviso con le altre liste, e la sua posizione definitiva si decide con la schermata di integrazione.

## 2. Collegamento ai dati

Collection `fixed-menus` (`fase-6` §6.2) e `fixed-menu-categories`, con la Local API **con la sessione dell'utente** (`overrideAccess: false`): il manager legge, crea, modifica e, per i soli menù, cancella (emendamento ad `ADR-113` del 2026-10-14); un utente senza ruolo non può nulla.

| Elemento | Campo | Note |
|---|---|---|
| Nome del menù | `name` (**localizzato**) | Obbligatorio in italiano; inglese facoltativo con ripiego sull'italiano (D10) |
| Descrizione | `description` (localizzato) | Facoltativa, italiano e inglese |
| Prezzo | `price` (numero) | Obbligatorio; mostrato e scritto con la virgola |
| Categoria | `category` → `fixed-menu-categories` | Obbligatoria; solo scelta tra le categorie esistenti |
| Visibilità | `visibility` (`always` / `lunch_only` / `dinner_only`) | Obbligatoria, predefinita «Sempre»; si **precompila dalla categoria** (sezione 7) |
| Solo giorni speciali | `specialOnly` (casella) | Se attivo, il menù non compare nelle pagine normali del menù pubblico, solo tramite i giorni speciali |
| Piatti | `dishes` (elenco: `dish` obbligatorio e `portion` localizzata facoltativa) | **L'ordine dell'elenco è l'ordine di visualizzazione.** Nessun doppione (`validateFixedMenuDishesField`: «Lo stesso piatto non può comparire più di una volta in questo menu fisso.»): la scelta dei piatti non lo permette. L'App chiede **almeno un piatto** (il modello ammette anche l'elenco vuoto) |
| Porzione | `portion` (testo localizzato) | Facoltativa; solo se la quantità nel menù differisce da quella alla carta (esempio «2 pezzi») |
| Servizi | `services` → `menu-services` (molti) | Caselle con nome e prezzo; facoltativi |
| Disabilitato | `disabled` | Assenza a tempo indefinito; l'interruttore «Disponibile» è il suo contrario |
| Categoria: nome | `name` (localizzato) | Obbligatorio; inglese facoltativo |
| Categoria: visibilità | `visibility` | Obbligatoria, predefinita «Sempre» (Degustazione sempre, Business lunch solo pranzo, `ADR-108`) |
| Categoria: disabilitata | `disabled` | Assenza a tempo indefinito; l'interruttore «Attiva» è il suo contrario |

**Interrogazioni**
- Elenco: tutti i menù fissi, disabilitati compresi, raggruppati per categoria. **Ordine: per nome**, sia le categorie sia i menù (`ADR-112` §1). Nessuna ricerca né filtro: sono 8 menù in 2 categorie. Nella richiesta (`sort`), non nel browser. `limit=100` come il contratto; il caso «oltre 100» non si verificherà e vale la regola degli altri elenchi (avviso con «Mostra altri menù fissi»), non disegnata.
- Opzioni dei menu a tendina e delle caselle: categorie (**solo quelle non disabilitate, più quella già salvata sul menù**); piatti (tutti, con il loro stato: Disabilitato, Terminato); servizi (tutti, con il prezzo). Un valore già salvato resta visibile anche se fuori elenco.
- **Prima di eliminare un menù**: i giorni speciali che lo contengono (`special-days` con `content.fixedMenus` uguale all'identificativo; date, al massimo tre, poi «e altri {N}»), letti con la sessione dell'utente. Non blocca: serve a dire dove sparirà.
- Stato mostrato: **Disabilitato** se `disabled`, altrimenti disponibile.

**Operazioni**: abilita/disabilita un menù o una categoria (aggiorna `disabled`); salva un menù (crea o modifica, con la validazione sopra); salva una categoria; elimina un menù (cancellazione fisica, D14, dopo conferma). Il salvataggio di un menù riscrive in blocco il suo elenco di piatti e di servizi.

**Effetti sul menù pubblico**
- Abilita/disabilita riscrive `disponibilita.json` (6.4), entro pochi secondi, senza ricompilazione.
- Menù e categorie nuovi e modifiche ai contenuti compaiono **dopo la ricompilazione** (6.5): l'avviso lo ricorda.
- **Eliminazione**: l'hook `afterDelete` riscrive il file di disponibilità; il menù sparisce dai giorni speciali subito e dal menù pubblico alla ricompilazione; ogni cancellazione lascia una riga nel registro attività (`eventType: delete`, `area: app`, collection, identificativo, nome e numero dei giorni speciali che lo usavano, nessun dato personale; `ADR-115`, nota del 2026-10-14). Un giorno speciale può restare senza menù attivi (`ADR-112`: in quel caso non si applica).

## 3. Albero blocchi → componenti → varianti

| Blocco (`data-block`) | Contenuto | Componenti |
|---|---|---|
| `topbar` | Pulsante del menu, briciola «Menù › Menù fissi» (e «› Categorie» nella scheda) | `SidebarTrigger`, `Separator`, `Breadcrumb` |
| `intestazione-pagina` | Titolo, descrizione, «Ricompila il menù pubblico» | `Button (outline, lg)` |
| `schede` | «Menù fissi» e «Categorie» | `Tabs`, `TabsList (line)`, `TabsTrigger` |
| scheda Menù fissi | Conteggio e «Nuovo menù fisso»; un gruppo per categoria con intestazione «{categoria} {N menù} · {visibilità}» | `Button (default, lg)`, testo (`h2`) |
| `elenco-tabella` (da 768 px) | Nome (con badge «Solo giorni speciali» e «Disabilitato» e, sotto, «{N} piatti»), Visibilità, Prezzo, Disponibile, azioni | `Table` a colonne fisse, `Badge (secondary \| outline)`, `Switch`, `Button (ghost, icon)` ×2: matita e cestino |
| `elenco-schede` (sotto 768 px) | Nome; «{prezzo} · {visibilità} · {N piatti}»; badge; interruttore «Disponibile», matita, cestino | `Card (sm)`, `Badge`, `Switch`, `Button (ghost, icon)` ×2 |
| scheda Categorie | Conteggio e «Nuova categoria»; elenco di schede: nome, «{visibilità} · {N menù}», badge «Disabilitata», interruttore «Attiva», matita (**nessun cestino**) | `Card (sm)`, `Badge (outline)`, `Switch`, `Button (ghost, icon)` |
| (stato) modulo del menù, vista «modulo» | Sezioni `dati`, `categoria-visibilita`, `piatti`, `servizi`, traduzione, `disponibilita` | `Sheet`, `FieldGroup`, `FieldSet`, `FieldLegend`, `Field`, `Input`, `Textarea`, `Select` ×2, `Switch` ×2, `Checkbox` (servizi), `Collapsible`, `Badge`, `Alert`, `Button (lg \| outline \| ghost, icon)`, `FieldDescription`, `FieldError` |
| (stato) modulo del menù, vista «Scegli piatti» | Freccia indietro, ricerca, piatti raggruppati per categoria con casella, «Fatto ({N})» e Annulla | `Sheet` (stesso foglio), `Input`, `FieldSet`, `FieldLegend`, `Field`, `Checkbox`, `Badge`, `Button (lg)` |
| (stato) modulo della categoria | Nome, traduzione, visibilità, disabilitata | `Sheet`, `Field`, `Input`, `Collapsible`, `Select`, `Switch`, `Button (lg)` |
| (stato) elimina | Conferma «Eliminare {nome}?» con il cascade dichiarato | `AlertDialog`, `Button (destructive)`, `Button (outline)`, `Spinner` |
| (stato) ricompila, caricamento, avvisi | Come le altre liste | `AlertDialog`, `Skeleton`, `Alert` |

## 4. Layout e regole responsive

| | Telefono (sotto 768 px) | Schermo largo (da 768 px) |
|---|---|---|
| Colonna | Tutta la larghezza, margine 16 px | Centrata, larga al massimo `max-w-5xl`: a 1280 px è 976 px |
| Schede | Riga con scorrimento orizzontale solo se non entra | Riga normale |
| Azioni di pagina | «Ricompila il menù pubblico» a tutta larghezza; «Nuovo menù fisso» e «Nuova categoria» dentro la scheda, a tutta larghezza | «Ricompila» a destra del titolo; «Nuovo …» a destra nella scheda |
| Elenco dei menù | Schede: nome, «prezzo · visibilità · N piatti» (misurato 172 px per il nome su 358); a destra interruttore «Disponibile», matita, cestino | Tabella a **colonne fisse** (Visibilità 8 rem, Prezzo 7 rem, Disponibile 7 rem, azioni 6 rem; il resto al nome) |
| Righe disabilitate | Attenuate, badge «Disabilitato» | Idem |
| Foglio del menù | Dal basso, altezza massima 90 % con scorrimento; pulsanti agganciati in fondo, affiancati | Da destra; pulsanti agganciati in fondo, affiancati |
| Piatto nel modulo | Riquadro: nome numerato con badge e tre pulsanti 44 px (su, giù, togli) sulla stessa riga; sotto la porzione a tutta larghezza | Idem |
| Cambio di vista nel foglio | Passando a «Scegli piatti» il foglio torna in cima; tornando al modulo si rivede la sezione «Piatti» | Idem |
| Dimensioni dei controlli | Dispositivo touch (`pointer-coarse`): ≥ 44 px (D6) | Con mouse: misure standard di Nova |

Nessuno scorrimento orizzontale a 360, 390 e 1280 px.

## 5. Stati

| Stato | Cosa si vede | Riferimento |
|---|---|---|
| Elenco dei menù | Gruppi per categoria con conteggio e visibilità; righe disabilitate attenuate | `*-chiaro.png`, `*-scuro.png` |
| Scheda Categorie | Elenco con interruttore «Attiva», matita, numero di menù | `390-categorie-chiaro.png` |
| Nessuna categoria | Messaggio «Nessuna categoria. Creane una per poter comporre i menù fissi.» e «Nuova categoria» | `390-categorie-vuoto-chiaro.png` |
| Modulo della categoria | Nome, traduzione, visibilità, disabilitata; errore sul nome | `390-categoria-modulo-chiaro.png`, `390-categoria-nuova-errori-chiaro.png` |
| Modulo del menù | Dati, categoria e visibilità, piatti, servizi, traduzione, disponibilità | `390-modulo-chiaro.png`, `390-modulo-piatti-chiaro.png`, `390-modulo-servizi-chiaro.png`, `1280-modulo-chiaro.png` |
| Traduzione inglese aperta | Name, Description e le porzioni dei piatti che ne hanno | `390-modulo-inglese-aperto-chiaro.png` |
| Scegli piatti | Ricerca e piatti per categoria con casella; Disabilitato e Terminato segnati | `390-scegli-piatti-chiaro.png`, `1280-scegli-piatti-chiaro.png` |
| Nuovo menù, errori | Modulo vuoto; messaggi sotto i campi | `390-nuovo-chiaro.png`, `390-nuovo-errori-chiaro.png` |
| Nuovo menù senza categorie | Campo Categoria disabilitato con il messaggio | `390-nuovo-senza-categorie-chiaro.png` |
| Visibilità dalla categoria | Scelta la categoria «Business lunch», la visibilità diventa «Solo pranzo»; scelta una visibilità incompatibile, avviso «non comparirà mai» | `390-visibilita-categoria-chiaro.png`, `390-visibilita-avviso-chiaro.png` |
| Abilita o disabilita | L'interruttore cambia, avviso «Menù fisso disabilitato» o «abilitato» | `390-disponibilita-chiaro.png` |
| Elimina, usato da giorni speciali | Conferma con «Verrà tolto anche da {N} giorni speciali: {date}.» | `390-elimina-chiaro.png` |
| Elimina, non usato | Conferma semplice | `390-elimina-senza-uso-chiaro.png` |
| Menù eliminato | La riga sparisce; avviso «Menù fisso eliminato» con il richiamo alla ricompilazione | `390-eliminato-chiaro.png` |
| Errore dell'azione | Avviso rosso nel foglio che l'ha avviata; nulla cambia | `390-errore-azione-chiaro.png` |
| Caricamento, errore di caricamento, nessun menù | Come le altre liste | `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-vuoto-chiaro.png` |

La conferma di ricompilazione è quella di `schermate/piatti/`. Non ci sono gli stati «filtri», «nessun risultato» ed «elenco parziale».

## 6. Testi

Tutti in italiano; `{…}` sono dinamici.

| Dove | Testo |
|---|---|
| Titolo | Menù fissi / I menù a prezzo fisso e le loro categorie. / Ricompila il menù pubblico |
| Schede | Menù fissi · Categorie |
| Scheda Menù fissi | «{1 menù fisso \| N menù fissi}, raggruppati per categoria.» (senza menù la frase non compare) · Nuovo menù fisso |
| Gruppo | «{Categoria}» e, accanto, «{1 menù \| N menù} · {Sempre \| Solo pranzo \| Solo cena}»; con la categoria disabilitata si aggiunge «· categoria disabilitata» |
| Colonne | Nome, Visibilità, Prezzo, Disponibile, (Azioni, solo per lo screen reader) |
| Riga | Sotto il nome «{1 piatto \| N piatti}»; badge «Solo giorni speciali» e «Disabilitato»; prezzo «{18,00} €»; su telefono «{prezzo} · {visibilità} · {N piatti}» |
| Stato | Nome accessibile dell'interruttore «Disponibile: {nome}»; etichetta visibile «Disponibile» su telefono |
| Azioni di riga | «Modifica {nome}» ed «Elimina {nome}» (nomi accessibili, nessun testo visibile) |
| Avvisi rapidi | Menù fisso abilitato · Menù fisso disabilitato / «Il menù pubblico si aggiorna entro pochi secondi.» |
| Avvisi di salvataggio | Menù fisso aggiunto · Menù fisso salvato / «Per vederlo sul menù pubblico serve «Ricompila il menù pubblico».» |
| Elimina | «Eliminare {nome}?» / menù usato: «Verrà tolto anche da {1 giorno speciale \| N giorni speciali}: {date}. Non si può annullare.» (date al massimo tre, poi «e altri {N}»); menù non usato: «Non si può annullare.» / Indietro, Elimina. Esito: «Menù fisso eliminato» / «Per toglierlo dal menù pubblico serve «Ricompila il menù pubblico».» |
| Scheda Categorie | «{1 categoria \| N categorie}, in ordine per nome.» · Nuova categoria; riga: «{visibilità} · {1 menù \| N menù}», badge «Disabilitata», interruttore «Attiva: {nome}» con etichetta «Attiva»; vuoto: «Nessuna categoria. Creane una per poter comporre i menù fissi.» (+ «Nuova categoria») |
| Modulo della categoria | Nuova categoria («Raggruppa i menù fissi nel menù pubblico.») · Modifica categoria («{nome}») / Nome · «Traduzione inglese (facoltativa)» con «Manca» o «Presente», Name («Facoltativa. Se resta vuota, il menù mostra il testo italiano.») · Visibilità («Quando la categoria compare nelle pagine del menù pubblico.») con Sempre, Solo pranzo, Solo cena · «Disabilitata» («Assente a tempo indefinito: la categoria non compare nel menù.») / Salva, Annulla. Errore: Campo obbligatorio. Avvisi: Categoria aggiunta · Categoria salvata · Categoria abilitata · Categoria disabilitata |
| Modulo del menù, titolo | Nuovo menù fisso («Il menù compare nel menù pubblico dopo la ricompilazione.») · Modifica menù fisso («{nome}») |
| Modulo del menù, dati | Nome · Descrizione · Prezzo (€) |
| Modulo del menù, categoria e visibilità | Categoria (segnaposto «Scegli»; senza categorie, campo disabilitato: «Nessuna categoria: creane una nella scheda Categorie») · Visibilità («Quando compare nel menù pubblico. Vale insieme alla visibilità della categoria.») con Sempre, Solo pranzo, Solo cena · «Solo giorni speciali» («Se attivo, il menù non compare nelle pagine normali del menù pubblico, solo tramite i giorni speciali.») |
| Avvisi di visibilità | Informativo, se la categoria è limitata e il menù è «Sempre»: «La categoria «{nome}» compare solo {a pranzo \| a cena}: anche questo menù compare solo {a pranzo \| a cena}.» Di errore (rosso, non blocca il salvataggio), se le due visibilità non si incrociano: «La categoria «{nome}» compare solo {a pranzo \| a cena} e il menù solo {a cena \| a pranzo}: non comparirà mai.» Nessun avviso se coincidono |
| Modulo del menù, piatti | «Piatti» / «Nessun piatto nel menù.» (a elenco vuoto) / per ogni piatto «{N}. {nome}» con badge «Disabilitato» o «Terminato» · nomi accessibili «Sposta su {nome}», «Sposta giù {nome}», «Togli {nome} dal menù» · Porzione («Facoltativa, per esempio «2 pezzi».») / «Aggiungi piatti» (elenco vuoto) o «Aggiungi o togli piatti» / «La porzione serve solo se la quantità nel menù è diversa da quella alla carta.» / errore «Aggiungi almeno un piatto.» |
| Vista «Scegli piatti» | Titolo «Scegli piatti» con freccia («Indietro al modulo») / «Spunta i piatti del menù. Quelli già scelti sono spuntati.» / ricerca «Cerca un piatto» / piatti per categoria con casella e badge / «Nessun piatto trovato.» / «Fatto ({N})» e Annulla |
| Modulo del menù, servizi | Una casella per servizio: «{nome} · {prezzo} €» |
| Modulo del menù, traduzione | «Traduzione inglese (facoltativa)» con «Manca» o «Presente» / Name (segnaposto: il nome italiano), Description, e «Porzioni» con un campo per ogni piatto che ha la porzione italiana (segnaposto: la porzione italiana) / «Facoltativa. Quello che resta vuoto, il menù lo mostra in italiano.» |
| Modulo del menù, disponibilità | «Disabilitato» («Assente a tempo indefinito: il menù fisso non compare nel menù.») · Salva («Salvataggio…»), Annulla |
| Errori del modulo | Campo obbligatorio. (nome e prezzo) · Inserisci un prezzo valido (es. 18,00). · Scegli una categoria. · Aggiungi almeno un piatto. |
| Errore dell'azione | Operazione non riuscita / Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore. |
| Errore di caricamento | Impossibile caricare i menù fissi / Riprova tra qualche istante; se il problema continua, avvisa l’amministratore. / Riprova |
| Vuoto | Nessun menù fisso. (+ «Nuovo menù fisso») |

**Singolare e plurale**: «1 menù fisso», «1 piatto», «1 giorno speciale», «1 categoria» al singolare; negli altri casi il plurale («menù» è invariabile).

## 7. Comportamenti

1. **Abilita e disabilita con un tocco** (menù e categorie): l'interruttore salva subito (D9), anche sulle righe disabilitate; se fallisce nulla cambia e compare l'errore.
2. **Apertura del modulo** con la matita; il nome non è un collegamento e la scheda non è tappabile (D13). «Nuovo menù fisso» e «Nuova categoria» aprono il loro modulo vuoto.
3. **Elimina un menù**: il cestino legge i giorni speciali che lo contengono e apre la conferma, che dice dove verrà tolto. «Elimina» cancella, chiude la finestra, toglie la riga e mostra l'avviso. Se la cancellazione fallisce nulla cambia e compare l'errore imprevisto nella finestra. Nessun testo suggerisce di disabilitare. **Le categorie non hanno il cestino.**
4. **Composizione dei piatti nello stesso foglio** (due viste): «Aggiungi (o togli) piatti» passa alla vista «Scegli piatti» (il foglio torna in cima; la ricerca filtra per nome e le caselle sono quelle dei piatti già scelti). «Fatto» applica la scelta: i piatti tolti escono dal menù, quelli aggiunti si mettono **in fondo**, gli altri mantengono ordine e porzione; «Annulla» e la freccia tornano al modulo senza cambiare nulla. Tornando al modulo si rivede la sezione «Piatti». Nessuna finestra sopra un'altra.
5. **Ordine dei piatti**: le frecce «Sposta su» e «Sposta giù» scambiano il piatto con il vicino; «Sposta su» è disabilitata sul primo e «Sposta giù» sull'ultimo. Nessun trascinamento (col dito non è affidabile). **Togli** toglie il piatto dal menù (non lo elimina dai piatti) e non chiede conferma, perché «Aggiungi piatti» lo rimette.
6. **Piatti disabilitati o terminati**: restano scegliibili e si vede il loro stato in elenco e nella vista di scelta (`schermate/piatti/spec.md` §7.14); un piatto disabilitato in un menù si vede come tale, ma non lo si toglie in automatico.
7. **Porzione**: facoltativa e per piatto; se c'è, nella traduzione inglese compare il campo della porzione inglese.
8. **Categoria e visibilità**: scegliendo la categoria di un menù **nuovo** o a visibilità non ancora toccata, la visibilità del menù si **precompila** da quella della categoria (Business lunch → Solo pranzo; Degustazione → Sempre). Una volta cambiata a mano, scegliere un'altra categoria non la sovrascrive. Aprendo un menù esistente la visibilità non cambia. **Regola per il menù pubblico** (nota di `ADR-108` e `ADR-112`): un menù compare nelle pagine del menù pubblico solo quando lo consentono sia la sua visibilità sia quella della categoria (intersezione); l'App avvisa quando la categoria restringe il menù («solo a pranzo») o quando le due non si incrociano («non comparirà mai»); l'avviso non blocca il salvataggio.
9. **Nessuna categoria**: il campo Categoria è disabilitato e dice «Nessuna categoria: creane una nella scheda Categorie»; si può compilare il resto, ma il salvataggio dà «Scegli una categoria.». Si crea la categoria nella scheda e si torna al menù.
10. **Validazione**: nome (italiano), prezzo, categoria e almeno un piatto obbligatori; prezzo numerico (virgola o punto, al massimo due decimali). Con errori: nessun salvataggio, messaggi sotto i campi, primo campo non valido in vista e con il focus. Categoria: solo il nome è obbligatorio.
11. **Traduzione inglese** (D10): chiusa per default, si apre se esiste un nome, una descrizione o una porzione inglese; i campi vuoti ripiegano sull'italiano.
12. **Salvataggio**: subito (D9), con `Spinner` e «Salvataggio…»; a buon fine il foglio si chiude e compare l'avviso che ricorda la ricompilazione; in errore l'avviso rosso resta nel foglio. Il salvataggio di un menù scrive in una volta dati, piatti (con ordine e porzioni) e servizi.
13. **Disabilitare una categoria**: non cambia i menù, che restano collegati; l'effetto sul menù pubblico è quello di ogni voce disabilitata (6.4) e di `ADR-112`; non si avvisa.
14. **Ordine**: categorie e menù per nome, senza distinzione tra maiuscole e minuscole e con le regole dell'italiano; i piatti nel menù seguono l'ordine scelto.
15. **Tema e tocco**: come D4 e D6.

## 8. Componenti da installare e da comporre

- **Da installare**: `tabs` (già nel prototipo, previsto da Prenotazioni 5.5), e nessun altro oltre a quelli già richiesti dalle altre schermate del Menù (`checkbox`, `collapsible`, `alert-dialog`, `select`, `switch`, `table`).
- **Componenti di composizione** (`components/app/`, solo con componenti di `components/ui`): scheda con elenco per categoria (condiviso nello scheletro con vini e servizi), riga di menù (tabella e scheda), elenco delle categorie, modulo del menù con le sue sezioni, **elenco ordinabile dei piatti** (riga con frecce, porzione e «Togli»), **vista «Scegli piatti»** (ricerca e caselle raggruppate), avviso di visibilità, modulo della categoria, conferma di eliminazione con il cascade dichiarato, pulsante «Ricompila» condiviso.
- **Eccezioni alla regola UI** (`ui-check-allow`): nessuna.
- **Logica pura in `lib/`** (con test): stato mostrato, ordine per nome, formato del prezzo con la virgola, testi con singolare e plurale; **spostamento di un elemento nell'elenco** e **applicazione della scelta dei piatti** (tolti, aggiunti in fondo, ordine e porzioni degli altri invariati); **visibilità efficace** di un menù (intersezione di menù e categoria) con il testo dell'avviso; **precompilazione della visibilità dalla categoria**; testo della conferma di eliminazione con le date (al massimo tre, poi «e altri {N}»), riusabile dai servizi.

## 9. Checklist di accettazione

Si verifica con Playwright. Controlli comuni **C1–C10** di `modello-specifica-schermata.md`. Specifici:

1. **Nessuno scorrimento orizzontale** a 360, 390 e 1280 px in tutte le viste. *Misurato nel prototipo il 2026-10-14 in elenco, categorie, modulo del menù, «Scegli piatti», nuovo, modulo della categoria e conferma di eliminazione: nessuno.*
2. **Aree di tocco** a 390 px con tocco simulato (C2): nessun elemento sotto 44 px in tutte le viste, comprese le frecce e «Togli» dei piatti e le caselle della vista di scelta. *Misurato nel prototipo nelle stesse viste: nessuno.*
3. **Colonna e elenco**: a 1280 px la colonna è larga 976 px; tabella da 768 px, schede sotto. *Misurato nel prototipo.*
4. **Azioni di riga**: interruttore «Disponibile», matita e cestino sui menù; interruttore «Attiva» e matita sulle categorie, **senza cestino**; nessun menu «⋯». *Provato nel prototipo: nelle categorie 0 cestini, 2 matite, 2 interruttori.*
5. **Abilita e disabilita** (menù e categorie): un tocco cambia lo stato e compare l'avviso; `disponibilita.json` cambia entro pochi secondi (dopo la 6.4).
6. **Composizione**: «Aggiungi o togli piatti» apre la vista «Scegli piatti» con il foglio in cima; «Fatto» toglie i piatti deselezionati, aggiunge quelli spuntati in fondo e lascia ordine e porzioni degli altri; «Annulla» e la freccia non cambiano nulla; tornando al modulo si vede la sezione «Piatti». *Provato nel prototipo con quattro piatti, una ricerca («pho») e due scelte.*
7. **Ordine**: «Sposta su» è disabilitata sul primo piatto e «Sposta giù» sull'ultimo; ogni spostamento scambia due piatti e l'ordine salvato è quello letto dopo la rilettura (`depth=2`). *Provato nel prototipo.*
8. **Nessun doppione**: la scelta dei piatti non permette lo stesso piatto due volte; una richiesta diretta con un doppione torna con «Lo stesso piatto non può comparire più di una volta in questo menu fisso.» (`validateFixedMenuDishesField`).
9. **Almeno un piatto**: un modulo senza piatti non si salva e dà «Aggiungi almeno un piatto.»; il modello ammette comunque l'elenco vuoto per Admin e REST. *Provato nel prototipo: un modulo vuoto dà quattro errori (nome, prezzo, categoria, piatti).*
10. **Porzione e traduzione**: la porzione si salva per piatto; nella traduzione inglese compaiono i campi delle sole porzioni compilate; con l'inglese vuoto una lettura `locale=en` ricade sull'italiano per nome, descrizione e porzioni.
11. **Visibilità dalla categoria**: scegliendo «Business lunch» in un menù nuovo la visibilità diventa «Solo pranzo»; una scelta manuale non si sovrascrive cambiando categoria; con visibilità incompatibile compare l'avviso «non comparirà mai» e il salvataggio resta possibile; aprendo un menù esistente la visibilità non cambia. *Provato nel prototipo.*
12. **Nessuna categoria**: il campo Categoria è disabilitato con il messaggio e «Nuovo menù fisso» è attivo; il salvataggio dà «Scegli una categoria.». *Provato nel prototipo con la categoria vuota.*
13. **Categorie**: creazione, modifica e disabilitazione dal manager; **eliminazione rifiutata** (REST e Admin comprese per il manager); il conteggio dei menù per categoria è corretto.
14. **Servizi e piatti collegati**: i servizi spuntati si salvano come relazione molti-a-molti; i piatti compaiono con il loro stato (Disabilitato, Terminato) in elenco e nella vista di scelta.
15. **Eliminazione**: per un menù usato dai giorni speciali la conferma dice «Verrà tolto anche da {N} giorni speciali: {date}.» con le date giuste; dopo l'eliminazione il menù non è più nei giorni speciali che lo contenevano (cascade verificato sul database); per un menù non usato la conferma è semplice; compare «Menù fisso eliminato»; la riga di registro esiste (con il numero dei giorni speciali); consentita a manager, admin e super-admin, rifiutata a un utente senza ruolo. *Testi provati nel prototipo con tre menù (due usati, uno no).*
16. **Persistenza e permessi**: nuovo e modifica si salvano con la sessione dell'utente (`overrideAccess: false`) e la rilettura (`depth=2`) dà gli stessi valori, nello stesso ordine.
17. **Tassonomie e categorie**: la scelta della categoria offre le categorie esistenti non disabilitate (più quella già salvata); nessun pulsante per creare piatti o servizi dal modulo.
18. **Ordine delle liste**: categorie e menù per nome; l'ordine arriva dalla richiesta.
19. **Stati e testi**: come negli screenshot e nella sezione 6, singolare e plurale compresi.
20. **Temi, accesso, `pnpm ui:check`**: C3, C4 (`canAccessSection(user, 'menu')`), C9.
21. **Confronto visivo** con i PNG di riferimento a 390 e 1280 px, in tema chiaro e scuro (C10).

## 10. Scelte confermate, assunzioni e debiti

**Scelte confermate da Mirko il 2026-10-14**
- **Foglio con due viste** (modulo e «Scegli piatti») invece di una pagina intera.
- **Frecce su/giù** per l'ordine dei piatti, senza trascinamento.
- **Almeno un piatto** per salvare (controllo dell'App).
- **Visibilità precompilata dalla categoria** e regola dell'intersezione per il menù pubblico (nota di `ADR-108` e `ADR-112`).
- Già deciso prima: scheda «Categorie» dentro «Menù fissi», senza cestino sulle categorie; campo Categoria vuoto con il messaggio e «Nuovo menù fisso» attivo; interruttore, matita, cestino sui menù (D13, D14); cascade dichiarato nella conferma.

**Assunzioni ancora da confermare** (il design le usa; vanno confermate prima di consegnare la schermata a Cursor)
1. **Elenco senza ricerca né filtri**, raggruppato per categoria, con nome, prezzo, visibilità, numero di piatti e badge.
2. **Nuovi piatti aggiunti in fondo** all'elenco; per metterli altrove si usano le frecce.
3. **«Togli» senza conferma**, perché non elimina il piatto e «Aggiungi piatti» lo rimette.
4. **Categorie nel menu a tendina**: solo quelle non disabilitate, più quella già salvata sul menù.
5. **Piatti disabilitati o terminati** si possono scegliere (con il badge) e non vengono tolti in automatico.
6. **Traduzione delle porzioni** nella traduzione inglese, solo per i piatti che hanno la porzione italiana.
7. **L'avviso «non comparirà mai»** non blocca il salvataggio (il modello lo permette e la visibilità può cambiare dopo).
8. **Disabilitare una categoria** non avvisa e non tocca i menù collegati.

**Debiti futuri e punti aperti**
- **Frontend (6.7)**: applicare l'intersezione di visibilità tra menù e categoria e l'ordine dei piatti; la regola è in `ADR-108` e `ADR-112`.
- **Anteprima del menù composto** (come lo vedrà il cliente): non prevista; si valuta dopo la revisione di produzione.
- **Copia di un menù** (duplicare un menù per farne uno simile): non prevista.
- **Esito della ricompilazione**: come in Piatti, la schermata dice solo «avviata» (6.5).
- **Giorni speciali** che restano senza menù attivi dopo l'eliminazione di un menù: si vede nella schermata dei giorni speciali (da disegnare).
