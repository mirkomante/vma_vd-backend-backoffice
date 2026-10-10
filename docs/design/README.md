# docs/design

Design UI/UX dell'Area App `(app)`. L'Admin è quello standard di Payload e non si disegna qui.

| Percorso | Cosa contiene |
|---|---|
| `decisioni-layout-app.md` | Decisioni generali (menu, home, tema, filtri, dimensioni di tocco, salvataggio, larghezza), registro delle deviazioni dai componenti shadcn, rilievi e punti aperti |
| `modello-specifica-schermata.md` | Modello della specifica di schermata, con i controlli comuni di accettazione |
| `installazione-componenti-ui.md` | Come installare i componenti shadcn e le deviazioni D6 da applicare subito dopo |
| `patch-app-ui-css.md` | Le correzioni da applicare a `app/(app)/app-ui.css` all'inizio della 8.2 |
| `schermate/<nome>/` | Un pacchetto per ogni schermata approvata (vedi sotto) |
| `assets/` | `mockup.css` (generato) e il font Geist, usati dai mockup statici |

**Pacchetto di una schermata** (`schermate/<nome>/`):

- `spec.md`: specifica (dati, albero blocchi → componenti → varianti, layout responsive, stati, testi, comportamenti, checklist di accettazione misurabile, punti da definire).
- `mockup.html`: mockup statico, stato iniziale, con `data-screen`, `data-block`, `data-component`, `data-variant`, `data-size`. Si apre in un browser, senza script.
- `<larghezza>-<tema>.png`: screenshot di riferimento dello stato iniziale (`390` e `1280`, `chiaro` e `scuro`).
- `390-<stato>-chiaro.png`: screenshot degli altri stati.

**Cose da sapere**
- `mockup.html` e `assets/mockup.css` sono **generati** dal prototipo di design: non si modificano a mano. Il prototipo non è nel repo.
- I PNG sono riferimenti per il confronto visivo. Sul telefono il confronto si fa con misure geometriche, non con la differenza di pixel (due acquisizioni dello stesso prototipo differiscono del 6,6 %).
- Il mockup statico è identico al prototipo su notebook (differenza 0,0 % a 1280 px, in chiaro e in scuro).

**Pacchetti presenti**: `schermate/orari/`, `schermate/prenotazioni/`, `schermate/piatti/`.

**Regola e controllo per Cursor** (fuori da questa cartella): `.cursor/rules/ui/01-ui-app-invarianti.mdc` (la regola UI di progetto) e `scripts/ui-check.mjs`, da lanciare con `pnpm ui:check` dopo aver aggiunto lo script a `package.json`.
