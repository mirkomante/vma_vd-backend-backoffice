# Rilievi del confronto visivo (C10): Servizi e Menù fissi, 2026-10-20

Assegnati dalla chat di design confrontando i **28 screenshot** già salvati in `img/` con i PNG di riferimento in `docs/design/schermate/servizi/` e `menu-fissi/`. I 28 file sono: **16 a 390 px chiaro** e 12 per elenco e modulo a 1280 px e in scuro (elenco in 4 varianti e modulo in 2 per ciascuna schermata). Confrontati: i 16 a 390 chiaro, l'elenco di Menù fissi a 1280 px e l'elenco di Servizi e di Menù fissi a 390 scuro (il tema scuro è a posto, e conferma P4). Stati confrontati: Servizi (elenco, modulo, nuovo con errori, conferma di eliminazione), Menù fissi (elenco, categorie, modulo, nuovo con errori, conferma di eliminazione, modulo della categoria). **Non confrontati**: `modulo-piatti` e `modulo-servizi` (il foglio non è scorso fino alla sezione), `disponibilita`, `modulo-inglese-aperto`, l'elenco di Servizi a 1280 px, il modulo a 1280 px e gli stati senza screenshot (eliminato, errori simulati, caricamento, vuoto, scegli-piatti, visibilità).

Il lavoro di questa settimana sullo strumento non aveva prodotto nessuno di questi rilievi: il confronto visivo, fatto sugli screenshot che già c'erano, ne trova **sette**.

## Rilievi P (bloccano la chiusura)

| Id | Dove | Realtà | Riferimento e specifica | Causa nel codice |
|---|---|---|---|---|
| P1 | Fogli di modifica di Servizi, Menù fissi e Categoria | titolo «Modifica servizio (verify-ui-…-serv-mod)» con il nome tra parentesi, che a capo copre la «x» di chiusura | titolo «Modifica servizio» e il nome come sottotitolo grigio, come nei fogli di Piatti, Vini, Distillati e Bevande (spec §6) | `components/app/services/service-form-sheet.tsx` riga 76: `` `${SERVIZI_FORM_EDIT_TITLE} (${editName})` ``; stesso schema nei fogli del menù fisso e della categoria |
| P2 | Piè dei fogli di Servizi, Menù fissi e Categoria | «Annulla» sopra «Salva», a tutta larghezza, uno per riga | «Salva» e «Annulla» affiancati, «Salva» a sinistra, agganciati al fondo (come negli altri fogli, corretto in F2 per Piatti) | `service-form-sheet.tsx` riga 148: `<SheetFooter className="border-t border-border px-4 py-4">` senza `flex-row gap-2` e con l'ordine dei pulsanti invertito |
| P3 | Modulo del menù fisso | mancano i titoli di sezione | titoli «Dati», «Categoria e visibilità», «Piatti», «Servizi» e «Disponibilità» sopra i rispettivi gruppi (spec menu-fissi §6, Modulo del menù) | `components/app/fixed-menus/fixed-menu-form-sheet.tsx` |
| P4 | Menù fissi: elenco e scheda Categorie | il pulsante «Nuovo menù fisso» (e «Nuova categoria») sta **sopra** le schede; le schede sono riquadri con il bordo | le schede stanno subito sotto la descrizione, poi la frase («6 menù fissi, raggruppati per categoria.»), **poi** il pulsante a tutta larghezza, dentro la scheda; le schede sono testo con una sottolineatura sotto quella attiva, senza riquadro (spec §4 e §6, decisione A53) | `components/app/fixed-menus/fixed-menus-shell.tsx` (stile delle schede e posizione dell'azione) |
| P5 | Scheda Categorie: righe | sotto l'interruttore non c'è nessuna etichetta | etichetta visibile «Attiva» sotto l'interruttore sul telefono (spec: «Attiva: {nome}» con etichetta visibile) | `MENU_FISSI_CATEGORY_TOGGLE_LABEL = 'Attiva'` esiste ma non viene mostrata nella riga |
| P6 | Conferma di eliminazione del menù fisso usato dai giorni speciali | «Verrà tolto anche da **1 1** giorno speciale: …» (e con N giorni: «N N giorni speciali») | «Verrà tolto anche da 1 giorno speciale: {data}. Non si può annullare.» | `lib/menu/formatCascadeDeleteDescription.ts`: `pluralizeIt(count, '1 giorno speciale', `${count} giorni speciali`)`, ma `pluralizeIt` antepone già il numero: va `pluralizeIt(count, 'giorno speciale', 'giorni speciali')`, con un test (il test esistente non intercetta il difetto). Il caso dei servizi (`menù fisso`/`menù fissi`) è già corretto |
| P7 | Foglio della categoria: riga «Disabilitata» | l'interruttore sta a sinistra, il testo a destra | testo a sinistra e interruttore a destra, come in Servizi e come nel riferimento | `components/app/fixed-menus/fixed-menu-category-form-sheet.tsx` |

## Estensione ai cataloghi (Vini, Distillati, Bevande)

Per i cataloghi **non è mai stato fatto** un confronto con le demo. Gli screenshot del 18 ottobre (precedenti a F3 e F-SEL) mostrano già, per **Distillati**, gli stessi difetti **P1** (titolo «Modifica distillato (verify-ui-distillati-mod)») e **P2** (pulsanti «Annulla» sopra «Salva»), oltre ai difetti poi corretti da F-SEL (`__empty__`, campi su due righe); per **Vini** e **Bevande** i fogli sono stati scattati a metà animazione (si vede solo l'overlay) e non sono confrontabili. L'elenco di Vini e di Distillati corrisponde ai riferimenti. Quindi **P1 e P2 valgono per tutti e sei i fogli** (Vini, Distillati, Bevande, Servizi, Menù fissi, Categoria) e F4 li corregge dappertutto; il confronto completo dei cataloghi si fa con gli screenshot nuovi di T1e (Parte B). **P4 vale anche a 1280 px**: nel riferimento il pulsante «Nuovo menù fisso» sta sulla stessa riga della frase di conteggio, a destra; nell'app sta in alto a destra accanto al titolo.

## Rilievi A (non bloccano)

| Id | Cosa |
|---|---|
| A1 | Prezzo nel modulo non formattato con due decimali («2», «30» invece di «2,00», «18,00»); vale anche per Piatti. Da fare, ma dopo i P. |
| A2 | Nello stato di errore le etichette dei campi dovrebbero essere rosse (nel riferimento lo sono); nell'app restano nere. |
| A3 | Nella conferma di eliminazione l'app scrive «lunedì 1 giugno 2099» (con il giorno della settimana, come chiede il controllo `menu-fissi-elimina-usato`); il PNG di riferimento ha «14 febbraio 2027». Si tiene l'app e si aggiorna il PNG alla prossima occasione. |
| A4 | Intestazione del gruppo («verify-ui-…-cat **1 menù · Sempre**»): la parte «1 menù · Sempre» è più scura che nel riferimento (grigio attenuato). |

## Difetti dello strumento (non sono rilievi dell'app)

- Gli screenshot di `modulo-piatti`, `modulo-servizi` e degli altri stati del foglio non fanno scorrere il foglio fino alla sezione: mostrano sempre l'inizio del modulo.
- Mancano gli screenshot degli stati: servizi (eliminato, errore-azione, caricamento, errore-caricamento, vuoto) e menù fissi (scegli-piatti, visibilita-categoria, visibilita-avviso, disponibilita, eliminato, errore-azione, caricamento, errore-caricamento, vuoto, categorie-vuoto, nuovo-senza-categorie).

## Prossimi passi

1. **F4** (Composer): correzione di P1–P7 (passo 21), senza giri di verifica.
2. **T1e** (versione ridotta): gli screenshot mancanti, con il foglio scorso fino alla sezione, dopo F4.
3. Confronto visivo degli stati rimasti e a 1280 px.
