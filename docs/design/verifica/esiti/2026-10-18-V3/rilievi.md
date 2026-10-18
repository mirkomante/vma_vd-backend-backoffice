# Rilievi di V3 (Vini, Distillati, Bevande): 2026-10-18

Assegnati dalla chat di design dopo la lettura del resoconto dell'agente, dei risultati (`esiti/2026-10-18-locale-prod/risultati.json`, commit `8acc58f`) e del codice. **V3 è incompleto**: dei 33 FALLITO, molti hanno un `misurato` che non dice che cosa è stato misurato, e il giro ha richiesto circa due ore. Un solo difetto dell'app è certo; per altri tre serve una misura vera prima di assegnare un P.

## Rilievi P (bloccano la chat successiva)

| Id | Dove | Misurato / visto | Atteso | Causa |
|---|---|---|---|---|
| P1 | modulo di Vini, Distillati e Bevande: paese (e regione, denominazione, classificazione dei vini) salvati ma non più nell'elenco (per esempio un paese poi disabilitato) | `vini-origine-fuori-filtro`: «paese salvato non visibile» | il campo mostra il **nome** del valore salvato e il valore resta salvabile (specifica §7 punto 6) | `buildSelectItems(…, values.countryId)` non riceve l'etichetta: per un valore fuori elenco la mappa usa l'identificativo come etichetta (`wine-form-sheet.tsx` righe 146–165: per la regione l'etichetta passata è di nuovo l'identificativo; in `spirit-form-sheet.tsx` e `drink-form-sheet.tsx` il paese non ha etichetta). Il nome va letto dal record salvato e passato come `savedLabel` |

## Da verificare prima di assegnare un P (la misura è insufficiente)

| Id | Misurato | Perché non assegno ancora |
|---|---|---|
| `C2` sulla finestra di eliminazione (Vini, Distillati, Bevande, 390 px) | pulsanti «Indietro» ed «Elimina» 274×42 px | è lo stesso componente (`MenuDeleteDialog`) di Piatti, dove il controllo passa; i pulsanti hanno `pointer-coarse:h-11` (44 px): 42 non corrisponde a nessuna delle due altezze. Va rimisurato nello stesso contesto di Piatti |
| `vini-origine-cascata` | «regioni Italia assenti», poi timeout nel clic su «Friuli Venezia Giulia» (l'opzione esiste ma il clic non riesce) | può essere l'app (regioni non caricate) o il lanciatore (opzione non cliccabile nel popup su schermo stretto): servono le regioni lette dalla pagina e quelle della collection |
| `*-tassonomie` («tipologie vuote»), `*-persistenza` («create read»), `vini-formati-ui` e `*-modulo-inglese` («badge Presente») | misure che non dicono che cosa è stato letto | stessa famiglia di difetti già vista in Piatti (V2): lettura delle opzioni prima che si carichino e creazione tramite il modulo che non seleziona la tipologia. Probabile lanciatore |

## Difetti del lanciatore (non sono rilievi dell'app)

1. `*-elimina-registro-permessi` dà FALLITO perché la parte «utente senza ruolo» non è provabile (schema Users): una parte non provabile deve dare NON PROVATO per quella parte (la guardia è coperta da `verify-roles-8_3`), non FALLITO per tutto il controllo.
2. Misure poco leggibili (punto sopra): ogni FALLITO e AVVISO deve riportare i valori reali.
3. **Tempi**: il giro ha richiesto circa due ore e ha alzato il tempo massimo di locale-prod da 25 a 45 minuti per far passare le tre schermate: è la direzione sbagliata. Il rimedio è il passo «VC-tempi» (tempi massimi per controllo e per stato, una schermata per giro imposta dal lanciatore, build riusata, rilancio mirato dei soli controlli, uscita pulita).
4. Il confronto visivo salta gli stati «vuoto» con un AVVISO (database pieno): è atteso e non va segnalato come difetto.

## Rilievi A (non bloccano)

| Id | Cosa | Azione |
|---|---|---|
| A1 | `*-colonna-elenco`: AVVISO con nome della scheda 178 px (atteso circa 172, soglia 10 px) | nessuna: dentro la soglia; il lanciatore segnala AVVISO perché non riconosce il layout |
| A2 | Distillati e Bevande restano molto simili (pagina 79 %, azioni 67 %) | debito già registrato, da valutare in I6 |

## Che cosa è stato verificato davvero

Elenco, gruppi, disponibilità, filtri (anche a cascata per l'origine dei vini), bulk da 101 con «Mostra altri», formati dal server, capacità non gestita dei distillati, paese facoltativo delle bevande, eliminazione, console di sviluppo pulita, 200 screenshot (80 Vini, 60 Distillati, 60 Bevande). Regressione veloce di shell, Piatti, home e navigazione: OK. Gli stati «vuoto», `*-ricompila`, `*-accesso`, i controlli online restano NON PROVATI per natura.

## Prossimi passi

1. **F3** (Composer): P1 e verifica nel codice dei tre punti «da verificare» (passo 16c).
2. **VC-tempi** (agente del lanciatore): tempi, una schermata per giro, rilancio mirato (passo 16d).
3. **V3 bis**: rilancio dei soli controlli che hanno dato FALLITO, misurati davvero (passo 16e, pochi minuti).
4. Poi VC4 (passo 18).
