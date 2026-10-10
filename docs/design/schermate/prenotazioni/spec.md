# Prenotazioni, elenco — specifica di schermata (`/app/reservations`)

**Stato**: design confermato il 2026-10-10 (struttura a due schede confermata da Mirko). Le assunzioni sul dominio della sezione 10 sono **da confermare** prima di consegnare la schermata a Cursor.

**Si implementa in**: `fase-5` sottofase 5.5 (backoffice `(app)` prenotazioni; non ancora nel repo). Dipende da 8.2 (shell), 8.3 (guardia) e dalle Fasi 5.3 (Collection `Prenotazioni`) e 5.4 (calendario).

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D1–D9), `ADR-106` (ciclo di vita), `ADR-107` (modello dati, controlli, GDPR), `ADR-113` (permessi), `docs/design/schermate/orari/spec.md` (schermata gemella).

**File del pacchetto** (stessa cartella): `mockup.html` (mockup statico annotato, scheda «Giorno» di sabato 10 ottobre 2026) e screenshot di riferimento. Stato iniziale: `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` (pagina intera). Stati su telefono: `390-da-confermare-chiaro.png`, `390-dettaglio-confermata-passata-chiaro.png`, `390-dettaglio-in-attesa-chiaro.png`, `390-dettaglio-cancellata-chiaro.png`, `390-filtri-chiaro.png`, `390-filtri-attivi-chiaro.png`, `390-nuova-chiaro.png`, `390-nuova-errori-chiaro.png`, `390-conferma-cancella-chiaro.png`, `390-conferma-rifiuta-chiaro.png`, `390-conferma-noshow-chiaro.png`, `390-conferma-anonimizza-chiaro.png`, `390-avviso-chiaro.png`, `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-giorno-vuoto-chiaro.png`, `390-nessun-risultato-chiaro.png`, `390-anonimizzate-chiaro.png`, `390-errore-azione-chiaro.png`. Su notebook: `1280-menu-azioni-chiaro.png`, `1280-dettaglio-chiaro.png`. Il mockup usa `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`. Negli screenshot l'«adesso» simulato è sabato 10 ottobre 2026, 15:30.

---

## 1. Obiettivo e accesso

Il manager (e admin e super-admin) vede le prenotazioni del ristorante per giorno, gestisce quelle in attesa di conferma, e agisce su ognuna secondo il suo stato. Funziona da telefono e da notebook (requisito di base, sezione 0 di `decisioni-layout-app.md`).

- **Accesso**: `canAccessSection(user, 'reservations')`. Non autenticato → `/app/login`. Sezione non consentita non raggiungibile nemmeno dall'URL.
- **Fuori perimetro**: «Eccezioni giorno» e «Impostazioni prenotazioni» (altre voci del menu, altre schermate); la cancellazione da parte del cliente (link con token, `ADR-107` §4.4); la sincronizzazione con Google Calendar (5.4), che parte dagli hook, non da questa schermata.

## 2. Collegamento ai dati

Collection `Prenotazioni`, con la Local API **con la sessione dell'utente** (`overrideAccess: false`). I nomi definitivi dei campi si fissano in 5.3 (la Collection non è ancora nel repo; `ADR-107` li scrive in italiano, ma per `impostazioni-sistema` si è scelto l'inglese camelCase): qui si usano i nomi di `ADR-107` §3 come riferimento.

| Elemento | Campo (`ADR-107` §3) | Note |
|---|---|---|
| Ora e giorno | `data-ora` | Il giorno si calcola nel fuso di Roma |
| Nome | `cognome`, `nome` | Mostrati «Cognome Nome»; vuoti se `anonimizzata` |
| Persone | `numero-persone` | |
| Servizio | `servizio` (`lunch` / `dinner`) | Etichette Pranzo / Cena |
| Canale | `canale` (sito, telefono, di persona, TheFork) | |
| Stato | `stato` (confermata, in-attesa-conferma, rifiutata, cancellata, no-show) | `ADR-106`; transizioni solo quelle ammesse |
| Telefono, email, note | `cellulare`, `email`, `note` | |
| Annullata da, motivo | `annullata-da` (utente / staff), `motivo-annullamento` | Per Cancellata e Rifiutata |
| Anonimizzata | `anonimizzata` | Dati identificativi svuotati |

**Interrogazioni**
- **Scheda «Giorno»**: tutte le prenotazioni con `data-ora` nel giorno scelto, in ogni stato, ordinate per ora. I **totali di gruppo** («attive», «coperti») si calcolano sull'intero giorno e non cambiano con ricerca e filtri.
- **Attive** = `confermata` + `in-attesa-conferma` (la stessa regola della capienza, `ADR-107` §4.3).
- **Scheda «Da confermare»**: tutte le prenotazioni `in-attesa-conferma`, di qualsiasi data, per `data-ora` crescente. Il numero nell'etichetta della scheda è il loro totale.

**Operazioni** (ognuna si salva subito, D9): conferma, rifiuta, cancella, segna no-show, modifica, nuova, anonimizza. Il server verifica le transizioni (`ADR-106`): una non ammessa, per esempio perché un altro utente ha già cambiato lo stato, è rifiutata e la schermata mostra l'errore dell'azione.
- **Anonimizza ora** usa la stessa logica del job giornaliero (`ADR-107` §5): elimina prima l'evento Google Calendar collegato, poi svuota nome, cognome, email, cellulare, note, motivo e token.
- **Servizio**: dedotto dall'ora con la stessa funzione dell'hook (`ADR-107` §4.1), non duplicata. Il prototipo usa un'approssimazione fissa (prima delle 16:00 = Pranzo) solo per mostrare il comportamento.

## 3. Albero blocchi → componenti → varianti

Ricavato dal mockup annotato (`Componente (variante, dimensione)`).

| Blocco (`data-block`) | Contenuto | Componenti |
|---|---|---|
| `topbar` | Pulsante del menu, briciola «Prenotazioni › Elenco» | `SidebarTrigger`, `Separator`, `Breadcrumb` (con `BreadcrumbLink`) |
| `contenitore-elenco` | Colonna dell'elenco (D8) | composizione, sezione 8 |
| `intestazione-pagina` | Titolo, descrizione, azione principale | `Button (default, lg)` con icona |
| `sotto-navigazione` | Schede Giorno e Da confermare | `Tabs (line)`, `TabsTrigger` ×2, `Badge (secondary)` con il conteggio |
| `navigazione-giorno` | Giorno precedente, data, successivo, Oggi | `Button (outline, icon)` ×2, `Input (type date)`, `Button (outline, default)` |
| `ricerca-filtri` | Ricerca e pulsante Filtri con il numero | `Input`, `Button (outline, default)`, `Badge (default)` |
| `filtri-attivi` | Etichette rimovibili | `Button (secondary, sm)` con icona |
| `giorno-corrente` | Data per esteso | testo |
| `gruppo-lunch`, `gruppo-dinner` | Intestazione del gruppo con i totali, poi tabella e schede | testo (`h2`), vedi sotto |
| `elenco-tabella` (da 768 px) | Ora, Nome, Persone, Canale, Stato, azioni | `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell`, `Button (link)` sul nome, `Badge`, `Button (ghost, icon)` con `DropdownMenu` |
| `elenco-schede` (sotto 768 px) | Una scheda per prenotazione: ora, nome, persone e canale, stato | `Card (sm)`, `Badge`, il tutto in un `button` |
| (stato) `da-confermare` | Una scheda per prenotazione in attesa, con Conferma e Rifiuta | `Card`, `Button (default)`, `Button (outline)`, `Button (ghost, sm)` «Dettagli» |
| (stato) dettaglio | Foglio con i dati, i contatti e le azioni dello stato | `Sheet`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `Badge`, `Button (outline, sm)` come collegamento `tel:` e `mailto:`, `SheetFooter`, `Button (default / outline / destructive / ghost, lg)` |
| (stato) modulo | Nuova prenotazione e modifica | `Sheet`, `FieldGroup`, `Field`, `FieldLabel`, `Input` (data, ora, numero, testo, telefono, email), `Select`, `Textarea`, `Checkbox`, `FieldError`, `FieldDescription`, `Button (lg)` Salva e Annulla |
| (stato) conferme | Cancella, Rifiuta, No-show, Anonimizza | `AlertDialog`, `Field` + `Input` per il motivo, `Button (destructive | default)`, `Spinner` |
| (stato) caricamento | Quattro blocchi | `Skeleton` |
| (stato) avvisi | Esito, errore di caricamento, errore dell'azione | `Alert (default | destructive)`, `AlertTitle`, `AlertDescription` |

La shell (barra laterale, menu utente, tema) è quella di D1–D4 e non fa parte di questa specifica.

## 4. Layout e regole responsive

| | Telefono (sotto 768 px) | Schermo largo (da 768 px) |
|---|---|---|
| Shell | Barra in alto con pulsante del menu; il menu è un pannello laterale | Barra laterale fissa da 16 rem |
| Colonna | Tutta la larghezza, margine 16 px | Centrata, larga al massimo `max-w-5xl` (64 rem), margine 24 px: a 1280 px è 976 px |
| Azione principale | A tutta larghezza | Allineata a destra, accanto al titolo |
| Navigazione del giorno | Una riga: freccia, data (si allarga), freccia, «Oggi» | Una riga |
| Ricerca e Filtri | Una riga: ricerca (si allarga) e «Filtri» | Una riga |
| Elenco | Schede (alte 60 px) | Tabella (sei colonne) con menu azioni in riga |
| Azioni di una riga | Si apre il dettaglio con un tocco | Nome cliccabile e menu «⋯» |
| Foglio (filtri, dettaglio, modulo) | Dal basso, altezza massima 90 % dello schermo con scorrimento | Da destra |
| Dimensioni dei controlli | Dispositivo touch (`pointer-coarse`): ≥ 44 px (D6) | Con mouse: misure standard di Nova |

Nessuno scorrimento orizzontale a 360, 390 e 1280 px. Le barre agganciate richiedono `overflow-x: clip` in `app-ui.css` (P1 di `decisioni-layout-app.md`).

**Matrice delle azioni** (dettaglio e menu di riga mostrano esattamente queste, nell'ordine indicato; «Anonimizza ora» sta separata e per ultima):

| Stato | Azioni |
|---|---|
| Confermata, data-ora **futura** | Modifica, Cancella prenotazione, Anonimizza ora |
| Confermata, data-ora **passata** | Modifica, Cancella prenotazione, Segna no-show, Anonimizza ora |
| In attesa di conferma | Conferma, Rifiuta, Modifica, Anonimizza ora |
| Rifiutata, Cancellata, No-show | Anonimizza ora |
| Anonimizzata (qualsiasi stato) | Nessuna |

Una In attesa non si «cancella»: `ADR-106` non ammette quella transizione, si usa «Rifiuta». La logica è una funzione pura in `lib/` (stato, data-ora, adesso, anonimizzata → azioni), con test.

## 5. Stati

| Stato | Cosa si vede | Riferimento |
|---|---|---|
| Giorno con prenotazioni | Gruppi Pranzo e Cena con totali; righe non attive attenuate | `*-chiaro.png`, `*-scuro.png` |
| Scheda «Da confermare» | Schede con data, ora, servizio, persone, canale, note; Conferma e Rifiuta in vista | `390-da-confermare-chiaro.png` |
| Dettaglio | Foglio con i dati e le azioni dello stato (matrice della sezione 4) | `390-dettaglio-*.png`, `1280-dettaglio-chiaro.png` |
| Menu di riga (notebook) | Le azioni dello stato | `1280-menu-azioni-chiaro.png` |
| Filtri | Foglio con Servizio, Stato, Canale, «Applica», «Azzera» | `390-filtri-chiaro.png` |
| Filtri attivi | Etichette rimovibili, numero sul pulsante, elenco ristretto | `390-filtri-attivi-chiaro.png` |
| Nuova prenotazione | Modulo vuoto (data del giorno corrente della scheda) | `390-nuova-chiaro.png` |
| Errori del modulo | Messaggi sotto i campi; il primo campo non valido ha il focus | `390-nuova-errori-chiaro.png` |
| Conferma cancella / rifiuta / no-show / anonimizza | Finestra con titolo, spiegazione, motivo (solo cancella e rifiuta) | `390-conferma-*.png` |
| Esito | Avviso in testa («Prenotazione confermata», con nome, data e ora) | `390-avviso-chiaro.png` |
| Errore dell'azione | Avviso rosso dentro la finestra o il foglio; nessuna modifica | `390-errore-azione-chiaro.png` |
| Caricamento | Quattro blocchi `Skeleton`; la navigazione resta | `390-caricamento-chiaro.png` |
| Errore di caricamento | Solo avviso rosso con «Riprova» | `390-errore-caricamento-chiaro.png` |
| Giorno senza prenotazioni | Messaggio e «Nuova prenotazione» | `390-giorno-vuoto-chiaro.png` |
| Nessun risultato | Messaggio e «Azzera filtri» | `390-nessun-risultato-chiaro.png` |
| Prenotazioni anonimizzate | Riga con «Dati anonimizzati» in corsivo e senza azioni | `390-anonimizzate-chiaro.png` |

## 6. Testi

Tutti in italiano; `{…}` sono dinamici.

| Dove | Testo |
|---|---|
| Titolo | Prenotazioni / Prenotazioni del ristorante. / Nuova prenotazione |
| Schede | Giorno · Da confermare ({n}) |
| Navigazione | Nomi accessibili «Giorno precedente», «Giorno successivo», «Giorno»; pulsante «Oggi» |
| Ricerca e filtri | Segnaposto «Cerca per nome o telefono»; pulsante «Filtri» (con il numero); etichette rimovibili con nome accessibile «Rimuovi filtro {etichetta}» |
| Giorno | {Data per esteso, iniziale maiuscola}, es. «Sabato 10 ottobre 2026» |
| Gruppo | {Pranzo \| Cena} {1 attiva \| N attive} · {1 coperto \| N coperti} |
| Colonne | Ora, Nome, Persone, Canale, Stato, (Azioni, solo per lo screen reader) |
| Riga | {1 persona \| N persone} · {Canale}; «Dati anonimizzati» se anonimizzata |
| Stati | Confermata, In attesa di conferma, Rifiutata, Cancellata, No-show |
| Canali, servizi | Sito, Telefono, Di persona, TheFork; Pranzo, Cena |
| Da confermare | {Nome}; {data breve} alle {ora} · {Servizio}; {persone} · {Canale}; note; «Dettagli», «Conferma», «Rifiuta»; vuoto: «Nessuna prenotazione in attesa di conferma.» |
| Foglio filtri | Filtri / Restringi l’elenco del giorno. / Servizio, Stato, Canale / Tutti i servizi, Tutti gli stati, Tutti i canali / Applica, Azzera |
| Dettaglio | Titolo {Cognome Nome} o «Dati anonimizzati»; «{data per esteso} alle {ora} · {Servizio}»; Persone, Canale, Telefono, Email, Note, Annullata da ({Staff \| Cliente}), Motivo; per le anonimizzate «I dati personali sono stati cancellati. Restano data, persone, stato, servizio e canale.» |
| Azioni | Modifica, Conferma, Rifiuta, Cancella prenotazione, Segna no-show, Anonimizza ora |
| Modulo | Nuova prenotazione / Inserimento manuale (telefono, di persona, TheFork). · Modifica prenotazione / La modifica non cambia lo stato. · Data, Ora, Persone, Servizio, Canale, Cognome, Nome, Cellulare, Email, Note · «Il servizio è dedotto dall’ora; puoi cambiarlo.» · «Informativa privacy comunicata al cliente» (solo nuova) · Salva («Salvataggio…»), Annulla |
| Errori del modulo | Campo obbligatorio. · Almeno 1 persona. · Indirizzo email non valido. · Serve la conferma dell’informativa privacy. |
| Conferma cancella | Cancellare la prenotazione di {nome}? / La prenotazione passa a Cancellata e viene tolta dal calendario. Non si può annullare. / Motivo (facoltativo) / Indietro, Cancella prenotazione |
| Conferma rifiuta | Rifiutare la prenotazione di {nome}? / La prenotazione passa a Rifiutata. Non si può annullare. / Motivo (facoltativo) / Indietro, Rifiuta prenotazione |
| Conferma no-show | Segnare {nome} come no-show? / Il cliente non si è presentato. Non si può annullare. / Indietro, Segna no-show |
| Conferma anonimizza | Anonimizzare i dati di {nome}? / Nome, cognome, email, telefono e note vengono cancellati in modo definitivo. Restano data, persone, stato, servizio e canale. Non si può annullare. / Indietro, Anonimizza ora |
| Esito | Prenotazione confermata · cancellata · rifiutata · aggiunta · modificata · anonimizzata; «Segnata come no-show»; sotto: «{nome} · {data breve} alle {ora}» (per l'anonimizzata «{data breve} alle {ora}») |
| Errore dell'azione | Operazione non riuscita / Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore. |
| Errore di caricamento | Impossibile caricare le prenotazioni / Riprova tra qualche istante; se il problema continua, avvisa l’amministratore. / Riprova |
| Vuoti | Nessuna prenotazione per questo giorno. (+ «Nuova prenotazione») · Nessun risultato con questi filtri. (+ «Azzera filtri») |

**Singolare e plurale**: «1 persona», «1 coperto», «1 attiva» al singolare; negli altri casi al plurale.

## 7. Comportamenti

1. **Giorno**: le frecce spostano di un giorno, «Oggi» torna alla data corrente, il campo data accetta qualsiasi giorno. La scheda si apre su oggi.
2. **Ricerca**: filtra mentre si scrive su nome, cognome, telefono ed email; le prenotazioni anonimizzate non si trovano.
3. **Filtri**: si impostano nel foglio e si applicano con «Applica»; «Azzera» rimette tutti a «Tutti». Ogni filtro attivo compare come etichetta rimovibile; il pulsante mostra il loro numero. Servono a restringere il giorno, non la scheda «Da confermare».
4. **Gruppi**: un gruppo compare solo se ha righe dopo ricerca e filtri. Le prenotazioni non attive (Rifiutata, Cancellata, No-show) restano nell'elenco ma attenuate; non entrano nei totali.
5. **Dettaglio**: tocco sulla scheda (telefono), clic sul nome (notebook). Il telefono e l'email sono collegamenti `tel:` e `mailto:`.
6. **Azioni**: solo quelle della matrice. «Conferma» è immediata (transizione positiva) e produce l'avviso. Cancella e Rifiuta aprono la conferma con il motivo facoltativo (salvato in `motivo-annullamento`, con `annullata-da` = staff). Segna no-show e Anonimizza ora aprono la conferma senza motivo. Tutte irreversibili (lo dice il testo).
7. **Dopo un'azione**: la finestra e il foglio si chiudono, la riga cambia stato, compare l'avviso in testa (resta fino alla prossima azione).
8. **Mentre si salva** (circa un secondo nel prototipo): pulsanti disabilitati, `Spinner` e «Salvataggio…»; la finestra non si chiude.
9. **Errore dell'azione**: avviso rosso nella finestra o nel foglio che l'ha avviata; nulla cambia e si può riprovare.
10. **Modifica e nuova**: stesso modulo. In nuova, Canale offre Telefono, Di persona, TheFork (non Sito); la conferma dell'informativa è obbligatoria. In modifica non c'è la casella e Canale include Sito. Il servizio si deduce dall'ora finché non lo si cambia a mano. Campi obbligatori: data, ora, persone (almeno 1), cognome, nome, cellulare, email (formato valido). Con errori: nessun salvataggio, messaggi sotto i campi, primo campo non valido in vista e con il focus.
11. **Da confermare**: Conferma è immediata; Rifiuta apre la conferma con il motivo; «Dettagli» apre il dettaglio. Quando l'ultima viene gestita compare «Nessuna prenotazione in attesa di conferma.».
12. **Anonimizzate**: riga con «Dati anonimizzati» in corsivo, nessuna azione, dettaglio con la spiegazione.
13. **Nuova prenotazione**: dopo il salvataggio la scheda mostra il giorno della nuova prenotazione.
14. **Tema e tocco**: come D4 e D6.

## 8. Componenti da installare e da comporre

- **Da installare** (oltre a quelli di shell e di Orari): `tabs`, `table`, `badge`, `textarea`, `checkbox`, `skeleton`, `spinner`, `dropdown-menu`, `select`, `card`. Con le deviazioni del registro di `decisioni-layout-app.md` (D6): in particolare `tabs` (scheda alta 44 px), `breadcrumb` (area del collegamento), `sheet` (altezza massima e scorrimento), `checkbox` (area di tocco).
- **Componenti di composizione** (`components/app/`, solo con componenti di `components/ui`; rilievo P2): colonna dell'elenco (`max-w-5xl`), gruppo di servizio (intestazione con totali, tabella e schede), riga di prenotazione (variante riga di tabella e variante scheda), scheda «da confermare», dettaglio, modulo.
- **Logica pura in `lib/`** (con test): azioni per stato (matrice sezione 4), totali di gruppo, conteggio delle attive, formato dei testi con singolare e plurale.

## 9. Checklist di accettazione

Si verifica con Playwright (viewport e, per il tocco, `is_mobile` e `has_touch`). Sul telefono i confronti si fanno con **misure geometriche**, non con la differenza di pixel.

1. **Nessuno scorrimento orizzontale** a 360, 390 e 1280 px in tutte le viste (giorno, da confermare, fogli, finestre, stati).
2. **Aree di tocco** a 390 px con tocco simulato, misurate sull'area cliccabile (non solo sul riquadro) e senza contare gli elementi coperti dal velo di un foglio o di una finestra: nessun elemento sotto 44 px in giorno, da confermare, filtri, dettaglio, modulo, conferme.
3. **Colonna e elenco**: a 1280 px la colonna è larga 976 px (mai più di 1024 px) e si vede la tabella, non le schede; a 390 px si vedono le schede (alte 60 px) e non la tabella.
4. **Totali**: per ogni giorno e servizio, «attive» e «coperti» coincidono con le confermate più le in attesa, e non cambiano con ricerca e filtri.
5. **Matrice delle azioni**: per ogni stato (e per confermata passata e futura) le azioni nel dettaglio e nel menu di riga coincidono con la tabella; nessuna azione fuori tabella. Il server rifiuta le transizioni non ammesse (prova via Local API).
6. **No-show**: assente su una confermata con data-ora futura, presente non appena è passata (provato con un orario simulato).
7. **Cancella e Rifiuta**: salvano lo stato, `annullata-da` = staff e il motivo se scritto; poi la finestra e il foglio si chiudono e compare l'avviso con il testo corretto.
8. **Anonimizza**: dopo l'azione i dati identificativi sono vuoti e `anonimizzata` è vera; l'evento del calendario è rimosso (dopo la 5.4); la riga mostra «Dati anonimizzati» e non ha azioni.
9. **Da confermare**: il conteggio sulla scheda è il totale delle in attesa di ogni data; ordine crescente per data-ora; Conferma immediata; Rifiuta con conferma.
10. **Filtri e ricerca**: Applica e Azzera; etichette rimovibili e numero sul pulsante; «Nessun risultato…» con «Azzera filtri»; la ricerca trova nome, cognome, telefono ed email e non le anonimizzate.
11. **Modulo**: campi obbligatori, errori sotto i campi, focus sul primo non valido; servizio dedotto dall'ora finché non modificato; Canale senza «Sito» in nuova; casella dell'informativa solo in nuova.
12. **Persistenza e permessi**: nuova e modifica si salvano con la sessione dell'utente (`overrideAccess: false`) e la rilettura dà gli stessi valori; consentiti manager (`appRole`), admin e super-admin; un utente senza ruolo è rifiutato.
13. **Stati**: caricamento, errore di caricamento con «Riprova», errore dell'azione, giorno vuoto, nessun risultato, anonimizzate: come negli screenshot.
14. **Testi**: coincidono con la sezione 6, singolare e plurale compresi («1 persona», «1 coperto»).
15. **Temi**: chiaro, scuro e Sistema.
16. **Accesso**: `canAccessSection(user, 'reservations')` falsa → sezione non raggiungibile dall'URL.
17. **`pnpm ui:check`** passa.
18. **Confronto visivo** con i PNG di riferimento a 390 e 1280 px, in tema chiaro e scuro: rilievi etichettati P e A.

## 10. Assunzioni da confermare e punti aperti

**Assunzioni sul dominio** (l'`ADR` non le chiude; il design le usa, vanno confermate):

- **Modifica** consentita solo su Confermata e In attesa, non sulle finali né sulle anonimizzate. `ADR-106` dice solo che la modifica di una confermata non cambia lo stato.
- **Inserimento manuale**: canali Telefono, Di persona, TheFork (non Sito).
- **Informativa privacy**: la casella «Informativa privacy comunicata al cliente» serve perché lo schema richiede `consenso-privacy` vero; il testo va deciso con chi redige l'informativa.
- **Capienza e soglia gruppo numeroso** nell'inserimento manuale: il design non blocca né avvisa. L'`ADR` non dice se lo staff può superarle; se la soglia si applica, una nuova prenotazione grande partirebbe «In attesa di conferma» e la schermata dovrebbe dirlo.
- **Prenotazione in attesa con data passata**: resta in «Da confermare»; nessuna transizione la chiude da sola.
- **Testo «viene tolta dal calendario»** nella conferma di cancellazione: vale quando la 5.4 è attiva.

**Da decidere o verificare**
- **Indirizzo della scheda e del giorno** (es. `?giorno=2026-10-10&scheda=da-confermare`) per tornare allo stesso punto dopo un ricaricamento: non deciso.
- **Aggiornamento in tempo reale** (un altro utente cambia una prenotazione mentre la schermata è aperta): il design prevede solo l'errore al momento dell'azione.
- **Servizio fuori dagli orari** (un'ora che non cade in nessun servizio): comportamento della deduzione da definire in 5.3.
- **Ordine delle righe con la stessa ora**: non definito.
- **Selettore di data** nativo (come in Orari); formato mostrato secondo il browser.
- **Notifica dell'esito**: avviso in pagina (come in Orari).
