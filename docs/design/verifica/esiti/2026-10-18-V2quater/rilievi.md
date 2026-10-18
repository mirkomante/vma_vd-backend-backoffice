# Rilievi di V2 quater (Piatti, dopo F2): 2026-10-18

Assegnati dalla chat di design dopo la lettura del resoconto dell'agente (commit `0c0f4e8`), dei risultati e del **confronto visivo (C10)** degli screenshot nuovi con quelli di riferimento (elenco, modulo, allergeni, modulo con errori, filtri a 390 px). Esito automatico: 0 FALLITO su menu, shell e Orari; lint a 0 errori.

## Rilievi P (bloccano la chat successiva)

**Nessuno.** I sei P di V2 sono corretti:

| P | Esito | Evidenza |
|---|---|---|
| P1 margine doppio | Corretto | pulsante 358×44 su colonna 358 px; margine della shell invariato |
| P2 scheda mobile | Corretto | nome 140 px; nome sopra, prezzo e badge sotto, «Terminato» sotto l'interruttore: come il riferimento |
| P3 aree di tocco | Corretto | C2 vuoto nei sei stati del modulo; trigger «Traduzione inglese» da 44 px; casella: radice 44 px con il quadratino visibile da 16 px (misure di Composer; vedi A3) |
| P4 `Select` | Corretto | il modulo mostra il nome della categoria; i filtri «Tutte le categorie» e «Tutti» |
| P5 allergeni | Corretto per aspetto e tocco | pulsanti con bordo, titolo «Allergeni», «Seleziona quelli presenti nel piatto. Selezionati: N.»; lo stato selezionato non si vede negli screenshot (vedi A4) |
| P6 blocchi condivisi | Corretto | icone «+», lente e cursori; intestazione del gruppo con conteggio attenuato; «Salva, Annulla» nel modulo; «Applica, Azzera» nei filtri |

## Rilievi A (non bloccano)

| Id | Cosa | Azione |
|---|---|---|
| A1 | Prezzo e Categoria sono affiancati solo da 768 px (`grid-cols-1 md:grid-cols-2`); nel PNG di riferimento a 390 px sono affiancati | **Accettato**: la specifica non lo chiede e i nomi lunghi delle categorie starebbero stretti. Resta la scelta di F2 |
| A2 | Nel PNG di riferimento `390-nuovo-errori-chiaro.png` il prezzo vuoto dice «Campo obbligatorio.»; l'app e la specifica dicono «Inserisci un prezzo valido (es. 9,50).» | Il PNG è obsoleto, l'app è giusta (il controllo `piatti-modulo-validazione` è OK) |
| A3 | La misura dei due rettangoli della casella (radice e quadratino) non era un controllo | Nuovo controllo `piatti-casella-misure` (`controlli-6.6.json`), lo implementa il passo 15 (VC3) |
| A4 | Negli screenshot nessun allergene era selezionato: lo stato selezionato non si confronta col riferimento | Nuovo controllo `piatti-allergeni-selezione`, lo implementa il passo 15 (VC3) |

## Difetti del lanciatore (per VC3)

1. **Gli screenshot C10 sono scattati senza il contesto touch dei controlli**: il pulsante «Nuovo piatto» misura 358×44 px nei controlli ma nello screenshot è alto circa 35 px, e i campi dei filtri 32 px invece di 44 px. Il confronto con i PNG di riferimento (disegnati con le misure del tocco) non può giudicare le dimensioni. Vanno scattati con il tocco attivo, come C2.
2. **`C2-mouse` segnala ancora la `textarea` a 64 px** (AVVISO) anche se `controlli-6.6.json` la esclude: il selettore del lanciatore è fisso.
3. Mancano i due controlli nuovi (A3, A4).

## Debiti NON PROVATO che restano

`piatti-stato-vuoto` (confronto visivo, DB popolato), `nav-pannello-telefono` (V6), `piatti-accesso` (coperto da `verify-roles-8_3`), controlli online (V6), controlli rinviati alla 6.5, icone Admin del menu utente (L3). Il confronto visivo è stato fatto su 5 stati a 390 px (elenco, modulo, allergeni, nuovo con errori, filtri); gli altri stati (terminato, disabilita, elimina, eliminato, errori, caricamento, vuoto, più di 100, 1280 px, scuro) sono giudicati dai controlli automatici.

## Prossimi passi

Il passo 13 (V2) è chiuso. Passo 15 (VC3): implementare i controlli di Vini, Distillati e Bevande e correggere i tre difetti del lanciatore qui sopra.
