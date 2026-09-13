# ADR — Ciclo di vita della prenotazione

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-09-13
**Arco di decisione**: Fase 5.3 (`arco-09` di `piano.yaml` — Collection `Prenotazioni`) → Fase 5.5 (Backoffice `(app)` prenotazioni). Dominio indipendente (sistema di prenotazioni): nessuna dipendenza dagli ADR #1–#5 (dominio CMS siti esterni). Condiziona a sua volta l'ADR #7 (`ADR — Modello dati del sistema di prenotazioni`, `arco-11`/`arco-12`): gli stati fissati qui devono esistere prima che quell'ADR possa chiudere lo schema completo della Collection.

## Contesto

La Collection `Prenotazioni` (Fase 5.3) necessita di un campo stato con valori e transizioni ammesse fissati prima che la Fase 5.5 (backoffice `(app)`) possa stabilire quali azioni sono disponibili in quale stato, e prima che i controlli automatici elencati in `riepilogo-sessione-sistema-prenotazioni.md` §5 possano essere specificati in dettaglio — deduzione di `servizio`, verifica soglia gruppo numeroso, verifica capienza residua, blocco cancellazione utente oltre il termine, sincronizzazione push con Google Calendar: tutti questi controlli leggono o scrivono lo stato della prenotazione, quindi il ciclo di vita va fissato per primo.

Questo ADR fissa **solo** gli stati e le transizioni ammesse. Lo schema dati completo della Collection `Prenotazioni` (i campi elencati in §5, la policy GDPR di retention/anonimizzazione, l'integrazione push con Google Calendar) resta materia dell'ADR #7 — non viene ridecisa né anticipata qui, solo referenziata come eredità.

## Decisione

**Cinque stati**:

1. **Confermata** — stato di default alla creazione (form pubblico sul sito o inserimento manuale dello staff), salvo soglia gruppo numeroso attiva.
2. **In attesa di conferma** — solo se la prenotazione supera la soglia di gruppo numeroso (quando quella policy opzionale è attiva nel Global "Impostazioni prenotazioni").
3. **Rifiutata** — lo staff non può accogliere una prenotazione in stato "in attesa di conferma".
4. **Cancellata** — prenotazione già confermata, cancellata dall'utente (entro un'ora prima del servizio) o dallo staff (in qualunque momento).
5. **No-show** — marcata manualmente dallo staff dopo lo svolgimento del servizio, per una prenotazione confermata il cui cliente non si è presentato.

**Transizioni ammesse**:

- Creazione → Confermata (default) oppure → In attesa di conferma (se soglia gruppo superata)
- In attesa di conferma → Confermata (approvazione staff) oppure → Rifiutata (staff non può accogliere)
- Confermata → Cancellata (utente entro il termine, o staff in qualunque momento)
- Confermata → No-show (dopo il servizio)

Nessun'altra transizione è ammessa: non esiste un percorso diretto da "in attesa di conferma" a "cancellata" o "no-show", né un percorso di ritorno da uno stato terminale (rifiutata / cancellata / no-show) verso uno stato precedente.

## Alternative considerate

- **Storico esplicito delle modifiche (versionamento)** — scartato: la modifica di una prenotazione confermata (data, ora, numero persone, note) aggiorna i campi restando nello stesso stato, senza conservare la versione precedente. Nessun requisito di audit trail emerso a giustificarne il costo di modellazione.
- **Stato dedicato "Conclusa"/"Completata"** — scartato: una prenotazione confermata con data-ora già passata non richiede un cambio di stato dedicato. Il solo passaggio del tempo non genera un evento di dominio distinto da "no-show", che resta l'unico esito post-servizio da marcare esplicitamente.
- **Unificare "Rifiutata" e "Cancellata" in un solo stato terminale negativo** — scartato: tenerle distinte permette di distinguere in statistiche future "il cliente ha cancellato" da "non abbiamo potuto accettarla" — due eventi di segno opposto per la relazione col cliente, che meritano un conteggio separato.

## Conseguenze

La Fase 5.5 (backoffice `(app)`) eredita questo ciclo di vita come vincolo sulla logica applicativa: le azioni proposte all'utente dipendono dallo stato corrente della prenotazione (es. "rifiuta" disponibile solo su "in attesa di conferma", "segna no-show" disponibile solo su "confermata" con data-ora passata), e nessuna azione può produrre una transizione non elencata sopra.

I controlli automatici elencati in `riepilogo-sessione-sistema-prenotazioni.md` §5 sono condizionati da questo ciclo di vita ma **non vengono riprogettati qui** — restano ereditati come riferimento, da specificare nel dettaglio implementativo nell'ADR #7:

- deduzione automatica di `servizio` da `data-ora`;
- verifica della soglia gruppo numeroso, che determina se lo stato di creazione è "confermata" o "in attesa di conferma";
- verifica della capienza residua dello slot;
- blocco della cancellazione utente oltre il termine di un'ora prima del servizio;
- sincronizzazione push con Google Calendar, limitata alle prenotazioni in stato "confermata" (creazione/aggiornamento dell'evento quando lo stato entra o resta in "confermata"; rimozione dell'evento quando lo stato esce da "confermata" verso "cancellata" o "no-show").

Restano punti aperti, non bloccanti per questo ADR: lo schema completo dei campi della Collection `Prenotazioni` (incluso il campo `stato` stesso, come `select` sui cinque valori qui definiti), la policy di retention/anonimizzazione GDPR, e il dettaglio implementativo dell'integrazione Google Calendar — tutti oggetto dell'ADR #7 ("Modello dati del sistema di prenotazioni"), che dipende da questo ADR per gli stati già fissati.
