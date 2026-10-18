# Esito V3 bis — locale-prod — 2026-10-18

Commit: `4437057201b5` · Lanciatore: 3.5.0 (L1) · Browser: Chromium 140.0.7339.186 · Controlli: `controlli-6.6.json` v1  
Profilo/tema usati: `telefono-390` / `chiaro` (minimo richiesto). Build: prima esecuzione rifatta, poi riusata (`ea125c60c28e…`).

## Riepilogo

| Esito | N |
|---|---|
| OK | 4 |
| FALLITO | 15 |
| AVVISO | 0 |
| NON PROVATO | 1 |

## Esiti (misurato · atteso · classificazione agente)

| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Classificazione |
|---|---|---|---|---|---|---|
| vini-origine-fuori-filtro | vini (flusso) | telefono-390/chiaro | FALLITO | `paese salvato non visibile` (paese disabilitato via Local API, poi ripristinato in `finally`) | Nome del paese salvato visibile nel campo Paese (spec §7.6) | difetto dell'app |
| vini-origine-cascata | vini (flusso) | telefono-390/chiaro | FALLITO | `regioni Italia assenti`; opzione «Friuli Venezia Giulia» nel DOM ma non cliccabile (timeout 30 s) | Cascata Paese→Regione→Denominazione; regioni Italia con Friuli/Collio; Giappone senza regioni | controllo dubbio (opzione presente ma non visibile al clic) |
| vini-tassonomie | vini | telefono-390/chiaro | OK | `tipologie (5): Bianchi \| Champagne \| Rosati \| Rossi \| Spumanti` | Opzioni allineate alle collection; Libano assente se disabilitato | corretto |
| vini-persistenza | vini | telefono-390/chiaro | FALLITO | `tipologia=Bianchi; paese=Filippine; API found=false price=n/a; create read` | Record creato da UI leggibile da Local API con tutti i campi | difetto del lanciatore |
| vini-formati-ui | vini | telefono-390/chiaro | FALLITO | `volume opzioni (0):`; `grado UI=12,8%`; voci capacità attese assenti dalla listbox | Opzioni capacità/grado da server; salvataggio grado 12,8% | difetto del lanciatore |
| vini-modulo-inglese | vini | telefono-390/chiaro | FALLITO | `badge: atteso «Presente» nel foglio` (record con EN impostato) | Badge «Manca» / «Presente»; lettura locale `en` con ripiego | controllo dubbio (badge non trovato in `innerText` del foglio) |
| vini-elimina-registro-permessi | vini | telefono-390/chiaro | FALLITO | `registro delete manager; norole: NON PROVATO (coperto da scripts/verify-roles-8_3.ts)` | Riga registro delete; norole coperto da script ruoli | difetto del lanciatore |
| C2 | vini/elimina | telefono-390/chiaro | FALLITO | `Indietro 274x42; Elimina 274x42` | Nessun elemento sotto 44 px | controllo dubbio |
| distillati-origine-fuori-filtro | — | — | NON PROVATO | Controllo non definito in `controlli-6.6.json` | Come vini §7.6 (se aggiunto in futuro) | — |
| distillati-tassonomie | distillati | telefono-390/chiaro | OK | `tipologie (7): Amari e Liquori \| Calvados \| … \| Whisky` | Opzioni tipologia da collection | corretto |
| distillati-persistenza | distillati | telefono-390/chiaro | FALLITO | `tipologia=Amari e Liquori; paese=Filippine; API found=false price=n/a; create read` | Persistenza create/read da UI | difetto del lanciatore |
| distillati-modulo-inglese | distillati | telefono-390/chiaro | FALLITO | `badge: atteso «Presente» nel foglio` | Badge Manca/Presente + ripiego EN | controllo dubbio |
| distillati-elimina-registro-permessi | distillati | telefono-390/chiaro | FALLITO | `registro delete manager; norole: NON PROVATO (coperto da scripts/verify-roles-8_3.ts)` | Registro + permessi staff | difetto del lanciatore |
| C2 | distillati/elimina | telefono-390/chiaro | FALLITO | `Indietro 274x42; Elimina 274x42` | Nessun elemento sotto 44 px | controllo dubbio |
| bevande-tassonomie | bevande | telefono-390/chiaro | OK | `tipologie (3): Calde \| Fredde \| Vietnamite` | Opzioni tipologia | corretto |
| bevande-persistenza | bevande | telefono-390/chiaro | FALLITO | `tipologia=Calde; paese=—; API found=false price=n/a; create read` | Persistenza create/read | difetto del lanciatore |
| bevande-modulo-inglese | bevande | telefono-390/chiaro | FALLITO | `badge: atteso «Presente» nel foglio` | Badge Manca/Presente | controllo dubbio |
| bevande-paese-facoltativo | bevande | telefono-390/chiaro | OK | `ok` | Paese facoltativo in creazione | corretto |
| bevande-elimina-registro-permessi | bevande | telefono-390/chiaro | FALLITO | `registro delete manager; norole: NON PROVATO (coperto da scripts/verify-roles-8_3.ts)` | Registro + permessi staff | difetto del lanciatore |
| C2 | bevande/elimina | telefono-390/chiaro | FALLITO | `Indietro 274x42; Elimina 274x42` (giro 3; riga sovrascritta dai merge C2 successivi ma misura identica a vini/distillati) | Nessun elemento sotto 44 px | controllo dubbio |
| C2 | piatti/elimina-libero | telefono-390/chiaro | OK | `nessun elemento` | Nessun elemento sotto 44 px | corretto (confronto: stesso dialogo non segnala 42 px) |

## Non provato

- **distillati-origine-fuori-filtro**: id assente dal JSON dei controlli (nessun analogo di `vini-origine-fuori-filtro` per Distillati/Bevande).

## Note operative

- Il merge `--solo` delle righe C2 tra giri consecutivi lascia in `risultati.json` l’ultima schermata aggiornata per C2; le misure bevande/elimina sono state confermate nel giro dedicato bevande prima del merge.
- Pulizia: prefisso `verify-ui-` eliminato (`deleted: 0` residui); porte 3000/3100/3200 libere a fine ogni giro.
