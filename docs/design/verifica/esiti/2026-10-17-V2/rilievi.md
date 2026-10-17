# Rilievi di V2 (Piatti, dopo I2): 2026-10-17

Assegnati dalla chat di design dopo la lettura del resoconto dell'agente (commit `3b23235`), dei risultati in `esiti/2026-10-17-locale-prod/` e `esiti/2026-10-17-locale-dev/`, e del **confronto visivo (C10)** degli screenshot reali con quelli di riferimento in `docs/design/schermate/piatti/` (elenco a 390 px, modulo a 390 px). **V2 è incompleto** (vedi «Limiti di V2»): i rilievi qui sotto sono quelli certi; dopo la correzione si rifà la verifica (V2 bis, passo 14b del piano) e ne possono uscire altri.

## Rilievi P (bloccano la chat successiva)

| Id | Dove | Misurato / visto | Atteso | Causa probabile |
|---|---|---|---|---|
| P1 | pagina Piatti, tutte le viste | `shell-margine-contenuto` su `/app/menu`: 32 px a 390 e 40 px a 768 e 1280; il pulsante «Nuovo piatto» è largo 326 px | 16 px a 390 e 24 px da 768; il pulsante largo 358 px (la colonna) | **Margine doppio**: `components/app/dishes/dishes-page.tsx` riga 364 ha `px-4` dentro il contenitore, ma la shell dà già `p-4 md:p-6` (`components/app/shell/app-shell.tsx` riga 29) |
| P2 | scheda mobile dell'elenco (390 px) | Il prezzo sta accanto al nome e l'etichetta «Terminato» accanto all'interruttore: il nome ha circa 20 px (`piatti-colonna-elenco` nameW = 20) e si legge «Banh…», «Crem…», «Gate…» | Come `390-chiaro.png`: nome sopra e prezzo (con il badge) sotto; interruttore con l'etichetta «Terminato» **sotto**; nome circa 137 px su 358 (decisioni D13) | Struttura della scheda in `dish-row-card.tsx` e in `menu-content-row-actions.tsx` (etichetta visibile sotto l'interruttore, non accanto) |
| P3 | modulo (nuovo, nuovo con errori, allergeni, 390 px, chiaro e scuro: C2 ×6) | Il trigger «Traduzione inglese (facoltativa)» è 358×38 px; tre elementi 16×16 px (caselle) | Nessun elemento sotto 44 px con il tocco (D6, specifica §9 punto 2) | Il trigger del blocco condiviso `localized-translation-collapsible.tsx` non ha l'altezza da tocco; la casella dentro `Field`/`FieldLabel` non estende l'area cliccabile a 44 px (le deviazioni D6 vanno nel componente, non nella schermata) |
| P4 | modulo, campo Categoria | Il menu mostra l'**identificativo** (per esempio «513») e non il nome della categoria | Il nome della categoria selezionata (come «Antipasti» in `390-modulo-chiaro.png`) | Il valore del `Select` non è associato all'etichetta della voce |
| P5 | modulo, Allergeni | Le voci sono testo senza bordo e la selezione quasi non si vede; manca il titolo «Allergeni» sopra «Seleziona quelli presenti nel piatto.» e il conteggio non è «Selezionati: N.» sulla stessa riga | Pulsanti a scelta multipla con bordo (non selezionati) e riempimento scuro con testo chiaro (selezionati), come `390-modulo-chiaro.png` e `390-modulo-allergeni-chiaro.png`; titolo «Allergeni» e «Seleziona quelli presenti nel piatto. Selezionati: 2.» | `dish-allergens-field.tsx` |
| P6 | blocchi condivisi e modulo | Mancano le icone del riferimento: «+» su «Nuovo piatto», lente nel campo di ricerca, icona a cursori (SlidersHorizontal) sul pulsante «Filtri»; l'intestazione del gruppo ha nome e conteggio nello stesso grassetto («Dolci 9 piatti»); il contenuto delle schede è allineato in alto; Prezzo e Categoria sono uno sotto l'altro; i pulsanti del foglio sono «Annulla, Salva» | Come i PNG di riferimento: icone presenti; nome del gruppo in grassetto e conteggio più piccolo e attenuato («Antipasti **3 piatti**»); contenuto delle schede centrato in verticale; Prezzo (€) e Categoria affiancati; ordine «Salva, Annulla» (specifica §6, Modulo) | `menu-page-header.tsx`, `menu-filter-sheet.tsx`, `dish-category-group.tsx`, `dish-form-sheet.tsx`, `dishes-page.tsx`. **Sono blocchi condivisi: si correggono ora perché le altre sette schermate li ereditano** |

## Rilievi A (non bloccano)

| Id | Cosa | Azione |
|---|---|---|
| A1 | `C2-mouse`: altezza 64 px nel modulo a 1280 px | Chiuso: era il campo multiriga «Descrizione»; il controllo comune ora esclude `textarea` (`controlli-6.6.json`) |
| A2 | `shell-margine-contenuto` ancora misurato su `/app/menu` | Si risolve con P1; il lanciatore non deve più misurarlo su `/app/menu` (nota del controllo, `controlli-8.2.json` v4) |

## Difetti del lanciatore (non sono rilievi dell'app: si correggono in V2 bis)

1. `piatti-terminato`: timeout sul `combobox` «Stato» (il filtro Stato sta nel foglio «Filtri»: va aperto prima); la correzione non è stata rieseguita.
2. Più righe FALLITO hanno un `misurato` che non dice che cosa è stato misurato (`piatti-modulo-inglese`: «fallback en name»; `piatti-tassonomie`: «categorie UI»; `piatti-ordine-100`: «banner 100/101»). **Ogni FALLITO e AVVISO deve riportare i valori reali misurati e attesi**, altrimenti non si può giudicare se il difetto è dell'app o del controllo. Questi tre restano da rivalutare dopo la riesecuzione.
3. `piatti-azioni-pagina` confrontava con la larghezza dell'elemento `main` (390 px) e non con la colonna (358 px): controllo corretto nel JSON.
4. Gli stati pesanti di C1 (più di 100 piatti, caricamento, errore di caricamento, vuoto) sono stati saltati dopo un timeout: la riesecuzione non deve abortire tutto il giro; se uno stato supera il tempo, NON PROVATO con il motivo e si prosegue.
5. `piatti-elimina-concorrenza` non implementato; `piatti-confronto-visivo` eseguito su un sottoinsieme di stati.

## Controlli corretti dalla chat di design (non dall'agente)

- `piatti-stati-ui`, `-stati-ui` delle altre tre schermate: lo stato «vuoto» non si può provare con il database popolato: spostato in un controllo a parte `-stato-vuoto`, NON PROVABILE (si giudica nel confronto visivo).
- `piatti-accesso` e gli analoghi: NON PROVABILE per sempre (nessun utente di prova ha l'App ma non il Menù); la guardia è coperta da `scripts/verify-roles-8_3.ts`.
- `piatti-azioni-pagina`: riferimento = colonna. `*-colonna-elenco`: FALLITO se il nome della scheda è sotto 100 px (130 px per Vini, Distillati e Bevande).

## Limiti di V2

La riesecuzione L2 su locale-prod è stata interrotta dopo circa 17 minuti; gli esiti del menu vengono da una run parziale precedente; `piatti-terminato` non è stato rieseguito dopo la correzione; stati C1 pesanti e confronto visivo incompleti. **Esiti OK**: shell 387 righe senza FALLITO, accesso 34/34, console di sviluppo pulita (CONSOLE 4/4, `piatti-console` 2/2), WebKit giro essenziale, e sul menu: `RICOMPILA-ASSENTE`, `piatti-elimina-libero`, `-bloccato`, `-permessi`, `-registro`, `piatti-persistenza`, `piatti-modulo-campi`, `-footer`, `-validazione`, `piatti-filtri-ricerca`, `piatti-disabilita`, `piatti-testi`, `piatti-nomi-accessibili`, `piatti-righe-azioni`.

## Debiti NON PROVATO che restano

`nav-pannello-telefono` (V6), `piatti-elimina-concorrenza` (V2 bis), controlli online (V6), controlli rinviati alla 6.5, `shell-menu-utente` icone Admin (L3), stato vuoto (confronto visivo).

## Prossimi passi

1. **F2** (Composer): correggere P1–P6 (passo 14).
2. **V2 bis** (agente di verifica): correggere i difetti del lanciatore e rifare L2 completo su Piatti (passo 14b).
3. Solo dopo, passo 15 (VC3).
