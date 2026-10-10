# Modello di specifica per schermata

Si copia in `docs/design/schermate/<nome>/spec.md` e si compila. Ricavato dalle tre specifiche scritte finora (`orari`, `prenotazioni`, `piatti`), che ne sono gli esempi. **Scopo**: dare a Cursor (Composer) tutto ciò che serve per implementare la schermata senza dover decidere nulla di presentazionale. Ciò che qui non è scritto, Cursor non lo inventa: si ferma e chiede (regola `.cursor/rules/ui/01-ui-app-invarianti.mdc`).

**Come si usa**: la chat di design scrive la specifica con mockup e screenshot; l'umano la approva e fa il commit; Cursor la implementa; la chat di design verifica gli screenshot consegnati.

## Intestazione

```
# <Schermata>, <parte> — specifica di schermata (`/app/<percorso>`)

**Stato**: <chiusa il AAAA-MM-GG | design chiuso, scelte da confermare>. <Chi ha scelto che cosa.>
**Si implementa in**: <file di fase e sottofase>. Dipende da <sottofasi>.
**Riferimenti**: decisioni-layout-app.md (<D…>), <ADR>, <file di fase>.
**File del pacchetto**: mockup.html + screenshot (elenco completo dei PNG, con i nomi).
```

Regola dei nomi dei PNG: `<larghezza>-<tema>.png` per lo stato iniziale a pagina intera (`390-chiaro`, `390-scuro`, `1280-chiaro`, `1280-scuro`); `390-<stato>-chiaro.png` e `1280-<stato>-chiaro.png` per gli altri stati. Ogni PNG è citato nella specifica e ogni PNG citato esiste.

## 1. Obiettivo e accesso
Chi fa che cosa, da quali dispositivi. Guardia di accesso (`canAccessSection(user, '<sezione>')`), cosa succede a chi non è autenticato o non ha la sezione, **fuori perimetro** (cosa questa schermata non fa).

## 2. Collegamento ai dati
Tabella **elemento della schermata → campo → note** (collection o Global, tipo, localizzazione, formato mostrato e scritto). Poi:
- **Interrogazioni**: che cosa si legge, filtri, **ordine**, limite; dove si applicano ricerca e filtri (nella richiesta, non nel browser); totali e come si calcolano.
- **Operazioni**: ognuna con il suo effetto, la transizione ammessa e dove la verifica il server.
- **Effetti collaterali** (file di disponibilità, calendario, ricompilazione) e che cosa mostra la schermata a riguardo.
- Lettura e scrittura **con la sessione dell'utente** (`overrideAccess: false`); la logica e la validazione riusano `lib/`, non si duplicano.

## 3. Albero blocchi → componenti → varianti
Tabella **blocco (`data-block`) → contenuto → componenti con variante e dimensione** (`Componente (variante, dimensione)`), ricavata dal mockup annotato. Comprende anche i blocchi che compaiono solo in certi stati (fogli, finestre, avvisi). La shell non si ripete.

## 4. Layout e regole responsive
Tabella **elemento × telefono (sotto 768 px) × schermo largo (da 768 px)**: shell, colonna e larghezza (D8), azioni di pagina, elenco o modulo, fogli, dimensioni dei controlli. Segue, se serve, la **matrice delle azioni** (stato × azioni, nell'ordine in cui compaiono). Si dichiara: nessuno scorrimento orizzontale a 360, 390 e 1280 px.

## 5. Stati
Tabella **stato → cosa si vede → riferimento (PNG o testo)**. Obbligatori per ogni schermata con dati: caricamento, errore di caricamento (con «Riprova»), vuoto, nessun risultato (se ci sono filtri), errore dell'azione, esito (avviso). Per i moduli: errori di validazione, salvataggio in corso, errore del server. Per le liste lunghe: elenco parziale. Uno stato non disegnato **non si scrive**: si aggiunge prima al mockup.

## 6. Testi
Tabella **dove → testo**, tutti in italiano, con `{…}` per le parti dinamiche. Comprende titoli, descrizioni, etichette, segnaposto, nomi accessibili, errori (con l'indicazione di quelli che vengono da `lib/`, da non riscrivere), avvisi, conferme. Una nota sul **singolare e plurale** («1 persona», «N persone»).

## 7. Comportamenti
Elenco numerato, uno per comportamento, scritto in modo che si possa verificare: apertura e chiusura dei fogli, quando una barra compare, che cosa fa ogni azione, cosa succede dopo (avviso, chiusura, aggiornamento della riga), mentre si salva, in caso di errore, dopo un errore di validazione (primo campo non valido in vista e con il focus), uscita con modifiche non salvate se si tratta di una pagina-modulo.

## 8. Componenti da installare e da comporre
- **Da installare**: componenti di `components/ui` oltre a quelli già presenti, con le deviazioni di `installazione-componenti-ui.md` da applicare.
- **Componenti di composizione** (`components/app/`): nome, che cosa raggruppa e da quali componenti è fatto. Un componente non elencato qui non si crea.
- **Eccezioni alla regola UI** (`ui-check-allow`): ciascuna con il motivo, per esempio «scheda tappabile intera: `button` che contiene una `Card`».
- **Logica pura in `lib/`** (con test): funzioni che la schermata chiama.

## 9. Checklist di accettazione
Si verifica con Playwright (viewport e, per il tocco, `is_mobile` e `has_touch`). Sul telefono i confronti si fanno con **misure geometriche**, non con la differenza di pixel (due acquisizioni a pagina intera dello stesso prototipo differiscono del 6,6 %).

**Controlli comuni** (valgono per ogni schermata; la specifica li richiama e aggiunge i propri, senza riscriverli):
- **C1** Nessuno scorrimento orizzontale a 360, 390 e 1280 px, in tutte le viste e gli stati.
- **C2** Aree di tocco a 390 px con tocco simulato, misurate sull'area cliccabile (a 21,5 px dal centro nelle quattro direzioni), con ogni elemento portato al centro dello schermo e senza contare gli elementi coperti dal velo di un foglio o di una finestra: nessun elemento sotto 44 px.
- **C3** Temi: chiaro, scuro e Sistema; con sistema scuro e Sistema la pagina è scura.
- **C4** Accesso: `canAccessSection` falsa → la sezione non è raggiungibile dall'URL; un utente senza ruolo è rifiutato; provato per ruolo.
- **C5** Testi: coincidono con la tabella della sezione 6, singolare e plurale compresi.
- **C6** Stati: ognuno come nello screenshot di riferimento.
- **C7** Persistenza e permessi: lettura e scrittura con la sessione dell'utente (`overrideAccess: false`); la rilettura dà gli stessi valori.
- **C8** Barre agganciate (se ci sono): dopo uno scorrimento di 600 px la barra in alto ha `top = 0` e, se presente, la barra di salvataggio ha `bottom` uguale all'altezza della finestra.
- **C9** `pnpm ui:check` senza errori.
- **C10** Confronto visivo con i PNG a 390 e 1280 px, in tema chiaro e scuro: rilievi etichettati **P** (da correggere prima della fase successiva) e **A** (non bloccanti).

**Controlli specifici**: elenco numerato, ciascuno con la misura (numero, selettore, valore atteso). Evitare formulazioni non verificabili («si vede bene»).

## 10. Scelte confermate, assunzioni e debiti
Tre gruppi, sempre separati:
- **Scelte confermate** (con data e chi le ha confermate).
- **Assunzioni sul dominio** che gli ADR non chiudono: il design le usa e vanno confermate prima di consegnare la schermata a Cursor.
- **Debiti futuri e punti aperti**: ciò che si rimanda, e come lo si è predisposto perché l'aggiunta sia semplice.

## Confezionamento del pacchetto (a cura della chat di design)

1. `mockup.html` statico e annotato (`data-screen`, `data-block`, `data-component`, `data-variant`, `data-size`), identico al prototipo approvato a 1280 px (differenza 0,0 % in chiaro e in scuro), con `assets/mockup.css` rigenerato per tutte le schermate.
2. Screenshot di tutti gli stati della sezione 5, con i nomi della regola sopra.
3. `spec.md` compilata; ogni PNG citato esiste e viceversa.
4. Aggiornare `README.md` di `docs/design`, `decisioni-layout-app.md` (rilievi della prova, punti aperti) e il CHANGELOG.
