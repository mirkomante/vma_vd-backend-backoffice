# Rilievi della verifica V6d (2026-10-21)

Chat di design. Fonti: matrice C1/C2/C3 (`esiti/2026-10-21-V6d-r2/`), screenshot (`esiti/2026-10-21-V6d-r3/`, 37 immagini, confrontate con i mockup di `docs/design/schermate/`), codice letto. **Confronto visivo**: 13 coppie su 37 esaminate una per una (Giorni speciali: elenco 390 e 1280, conferma di eliminazione, modulo, nuovo con errori, sovrapposizione; Messaggio globale: modificato, togli, file non leggibile, nessun messaggio; Bevande: elenco e filtri; Vini: elenco a 1280). Le altre 24 sono varianti a tema scuro o a 1280 degli stessi stati e **non sono state esaminate una per una**.

## P (da correggere nel passo 29)

| Id | Schermata | Misurato | Atteso | Dove |
|---|---|---|---|---|
| P1 | Vini, Distillati, Bevande, Giorni speciali, Messaggio globale (telefono 390, chiaro e scuro) | Nella finestra di conferma «Indietro» e «Elimina» (o «Togli») misurano 274×42 px (277×42 a scuro su Vini e Distillati) | Nessun elemento sotto 44 px (`misura-tocco.md`) | Matrice C2, 9 FALLITO in `r2`; stesso componente per cinque schermate. Servizi e Menù fissi risultavano conformi al T1e: capire perché |
| P2 | Giorni speciali, foglio del modulo a telefono | Pulsanti impilati: «Annulla» sopra «Salva», a tutta larghezza | Affiancati «Salva \| Annulla» agganciati in fondo (spec «Foglio del modulo», mockup `390-modulo-chiaro.png`); gli altri fogli usano `flex-row gap-2` | `components/app/special-days/special-day-form-sheet.tsx` (riga ~300: `flex w-full flex-col gap-2 sm:flex-row sm:justify-end`) |
| P3 | Giorni speciali, tabella da 768 px | La riga «Messaggio: …» non è troncata e invade la colonna Ambito, sovrapponendosi a «Solo pranzo» | Troncata con i puntini nella colonna Data (mockup `1280-chiaro.png`) | Cella Data della tabella |
| P4 | Giorni speciali, scheda a telefono | Con un sottotitolo lungo interruttore, matita e cestino vanno a capo su due righe | Una sola riga: interruttore «Attivo», matita, cestino (mockup `390-chiaro.png`) | Riga della scheda |
| P5 | Giorni speciali, testi | Giorno della settimana con l'iniziale maiuscola dentro una frase: «Eliminare il giorno speciale di Domenica 12 luglio 2099?» e sottotitolo del foglio «Mercoledì 8 luglio 2099» | «di domenica …» e «mercoledì …» in minuscolo (mockup `390-elimina-chiaro.png`, `390-modulo-chiaro.png`); nell'elenco resta maiuscolo | Formattazione della data nei testi della finestra e del foglio |

## A (non bloccano, non si toccano nel passo 29)

| Id | Schermata | Osservazione |
|---|---|---|
| A1 | Giorni speciali, modulo | Il riquadro informativo non ha l'icona ⓘ del mockup |
| A2 | Giorni speciali, modulo | L'etichetta del campo in errore («Data», «Ambito») resta nera: nel mockup è rossa insieme al bordo |
| A3 | Messaggio globale | La barra dei pulsanti è agganciata in fondo allo schermo; nel mockup sta sotto il contenuto. La spec dice «come negli Orari»: da confrontare con gli Orari |
| A4 | Tutte | «Ricompila il menù pubblico» assente: bandiera spenta, 6.5 |
| A5 | Giorni speciali, modulo | Il titolo di gruppo dei menù fissi è in grassetto nero; nel mockup è grigio e piccolo |
| A6 | Cataloghi, screenshot | I campi a tendina del foglio «Filtri» sono alti 32 px nello screenshot (mockup 44): lo screenshot non usa il profilo a tocco; la matrice C2, che lo usa, li misura conformi |
| A7 | Messaggio globale, screenshot | Mancano il messaggio «Messaggio salvato» e la riga «Menù pubblico aggiornato alle…»: lo stato è preparato senza passare dal salvataggio e il file non è leggibile in locale (copre il passo 30) |

## Non provato (eccezione firmata, policy §6)

Sei stati che la matrice non riesce a preparare, 20 prove ciascuno: Vini (`origine-senza-regioni`, `errore-geografia`, `errore-anno`), Giorni speciali (`modulo-inglese-aperto`, `data-passata`), Messaggio globale (`inglese-aperto`); più circa 30 `ERRORE-STRUMENTO` sporadici dello stesso tipo. Gli stati di errore e di caricamento (28e) non si fanno, per decisione di Mirko del 2026-10-21; si riaprono se i test umani rilevano problemi.

## Esito del passo 29 (F6), 2026-10-21

Commit `41b9092` (base `69fafbc`). Verificato dalla chat di design nel codice, con `typecheck`, ESLint a zero warning sui cinque file di codice, `ui:check`, `e2e:wire` e i 130 test di `lib/`, e negli screenshot di Giorni speciali (`v6f-screenshots`, confrontati con i mockup).

| Id | Esito | Evidenza |
|---|---|---|
| P1 | **Era una misura sbagliata, non un difetto dell'app** | Lo zoom di apertura della finestra riduceva la scala al 95 % mentre C2 misurava: 44×0,95 ≈ 42 e 288×0,95 ≈ 274 (al T1e, a animazione conclusa, i pulsanti erano 288×44). La chat di design aveva classificato P1 come difetto: errore di classificazione. Corretto togliendo lo zoom da `components/ui/alert-dialog.tsx` e portando i pulsanti a `size="lg"` (deviazione D6 annotata in `installazione-componenti-ui.md`). C2 ripetuto: 163 OK, 0 FALLITO |
| P2 | Corretto | Piè di foglio `flex-row gap-2`, «Salva» a sinistra e «Annulla» a destra, come il mockup (screenshot `modulo` 390) |
| P3 | Corretto | Messaggio troncato con i puntini nella colonna Data, senza sovrapposizione (screenshot `elenco` 1280) |
| P4 | Corretto | Interruttore con etichetta, matita e cestino su una sola riga (screenshot `elenco` 390) |
| P5 | Corretto | «di domenica 12 luglio 2099» e sottotitolo «mercoledì 8 luglio 2099» (screenshot `elimina` e `modulo` 390); nell'elenco resta maiuscolo |

**Scostamenti dal passo**: righe di codice dell'app toccate 107 contro il limite duro di 80 (l'agente se n'è accorto e ha proseguito); screenshot e giri (a), (b), (c) in `esiti/2026-10-21-F6a`, `-F6b`, `-F6c`. Giro (a): 29 OK, 2 skipped, 0 FALLITO; giro (b): 163 OK, 0 FALLITO, 25 ERRORE-STRUMENTO invariati (stati non preparabili); giro (c): 19 OK, 7 ERRORE-STRUMENTO, 8 NON PROVATO (stati non preparabili o fuori piano). I sette A restano aperti e non bloccano.
