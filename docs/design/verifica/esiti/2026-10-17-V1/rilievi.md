# Rilievi di V1 (shell, home, navigazione): 2026-10-17

Assegnati dalla chat di design dopo la lettura del rapporto (`rapporto.md`, commit `4f165a4` e `3c3b777`).

## Rilievi P (bloccano la chat successiva)

**Nessuno.** Nessun FALLITO riguarda l'app: i controlli della home e della navigazione sono OK in tutti i profili e i temi eseguiti, la console di sviluppo è pulita (0 errori, 0 avvisi) a 390 e 1280 px, e la regressione della shell è OK (449 OK, 0 FALLITO nel secondo giro).

## Rilievi A (non bloccano)

| Id | Schermata | Cosa | Azione |
|---|---|---|---|
| A1 | home | `home-riga-menu-stati` chiedeva `aria-busy` sullo Skeleton, ma lo Skeleton è decorativo (`aria-hidden`) e nessuna specifica richiede `aria-busy` | **Chiuso**: corretto il testo del controllo in `controlli-6.6.json` (la chat di design lo possiede); l'app non cambia |
| A2 | navigazione | `nav-pannello-telefono` NON PROVATO: servono tutte e otto le voci accese | Si prova in V6 (con `telefono-390-basso`) |
| A3 | shell | `shell-menu-utente` NON PROVATO a metà (icone di «Vai all'Admin»): il profilo di prova non ha `canAccessAdminPanel` | Debito della 8.2 (evidenza A24), si prova in L3 con un utente con accesso all'Admin |

## Difetti del lanciatore (non sono rilievi dell'app)

| Controllo | Difetto | Esito |
|---|---|---|
| `shell-menu-voci` | Il conteggio dei collegamenti includeva il blocco «Area App» in cima alla barra (un `SidebarMenuButton` con link a `/app`): la verifica era `>= 3` e lo nascondeva; VC1 l'ha resa `=== enabledCount` senza restringere il selettore. Misurato 4 invece di 3 | **Corretto** in `3c3b777` (conteggio solo dentro `[data-sidebar="group"]`); secondo giro: `navLinks: 3`, OK |
| `menu-payload.ts`, `replacePacchetto('menu')`, filtro percorsi `CONSOLE` | Tre difetti lasciati da VC1 | **Corretti** da V1 in `4f165a4` |

## Debiti NON PROVATO che restano

`nav-pannello-telefono` (V6), `shell-menu-utente` icone Admin (L3), controlli online (V6, dopo il deploy), controlli rinviati alla 6.5.

Nota di processo: nella 8.2 il controllo `shell-menu-voci` è di livello 2 e non girava in L1: per questo il difetto è emerso solo in V1.
