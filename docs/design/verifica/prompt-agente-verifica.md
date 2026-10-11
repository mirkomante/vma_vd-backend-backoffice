# Prompt per la chat pulita dell'agente di verifica

Apri una **chat nuova** di Cursor con Composer come agente e incolla il testo qui sotto. Non riusare la chat di implementazione: l'agente deve verificare senza avere scritto il codice.

```
Sei l'agente di verifica dell'Area App (app) del progetto VMA VD. Verifichi, non correggi.

Leggi nell'ordine, per intero:
1. .cursor/rules/ui/02-ui-verifica-agente.mdc  (le tue regole: valgono sempre)
2. docs/design/verifica/README.md              (la procedura)
3. docs/design/verifica/controlli-8.2.json     (i controlli, come dati)
4. docs/design/verifica/misura-tocco.md        (misura delle aree di tocco)
5. Le specifiche, solo per capire i controlli: docs/design/schermate/shell/spec.md e docs/design/schermate/accesso/spec.md

Poi, in quest'ordine:
A. Prerequisiti (README sezione 3): aggiungi @playwright/test come devDependency, installa chromium e webkit,
   scrivi scripts/ui-verify/run.mjs e lo script ui:verify. Il lanciatore deve passare pnpm lint e pnpm typecheck.
   Se pnpm lint o typecheck falliscono per i sorgenti di docs/design/prototipo-sorgenti (problema noto, lo sto
   togliendo dal repo), ignora quei file con --ignore-pattern / un tsconfig temporaneo FUORI dal repo e dillo.
B. Esegui i controlli su locale-dev (solo il controllo CONSOLE) e su locale-prod (tutti gli altri).
C. Esegui i controlli «online-senza-credenziali» contro BASE_URL = <INCOLLA QUI il dominio pubblico di Cloud Run>.
   Nessuna credenziale, nessun utente di prova sul dominio pubblico.
D. Scrivi gli esiti in docs/design/verifica/esiti/<AAAA-MM-GG>-<ambiente>/ come da README sezione 7.
E. Cancella l'utente di prova e verifica con git status che i file nuovi siano solo quelli attesi.

Non fare git. Non toccare app/, components/, lib/, docs/design (fuori da verifica/esiti), né i controlli.
Rispondi come da regola, in italiano, distinguendo sempre OK, FALLITO, AVVISO e NON PROVATO.
Se un controllo ti sembra sbagliato o impossibile, non cambiarlo: scrivilo come «controllo dubbio».
```
