# Esito verifica — locale-prod — 2026-10-11
Commit: 240651befe85 · Lanciatore: 2.0.0 · Browser: — · Controlli: controlli-8.2.json v2

## Riepilogo
OK: 2608 · FALLITO: 72 · AVVISO: 0 · NON PROVATO: 11 · Controlli distinti nel JSON: 55

## Esiti compatti

### OK (raggruppati)
- **acc-avvisi**: OK in 160/160 combinazioni
- **acc-centratura**: OK in 160/160 combinazioni
- **acc-collegamenti-sottolineati**: OK in 160/160 combinazioni
- **acc-colonna**: OK in 120/120 combinazioni
- **acc-fuori-shell**: OK in 160/160 combinazioni
- **acc-icona**: OK in 160/160 combinazioni
- **acc-margine**: OK in 80/80 combinazioni
- **acc-spazi-16**: OK in 160/160 combinazioni
- **AMBIENTE**: OK in 1/1 combinazioni
- **avviso-forgot-inviata**: OK in 16/16 combinazioni
- **avviso-login-password-aggiornata**: OK in 16/16 combinazioni
- **avviso-login-rifiutato**: OK in 16/16 combinazioni
- **avviso-reset-link-scaduto**: OK in 16/16 combinazioni
- **avviso-reset-senza-token**: OK in 16/16 combinazioni
- **avviso-verify-senza-token**: OK in 16/16 combinazioni
- **avviso-verify-token-non-valido**: OK in 16/16 combinazioni
- **C1**: OK in 152/152 combinazioni
- **C2**: OK in 160/160 combinazioni
- **C2-mouse**: OK in 56/56 combinazioni
- **C3**: OK in 240/240 combinazioni
- **C3-cambio-sistema**: OK in 1/1 combinazioni
- **C3-no-lampo**: OK in 80/80 combinazioni
- **C9**: OK in 1/1 combinazioni
- **forgot-testi**: OK in 16/16 combinazioni
- **forgot-titolo-documento**: OK in 32/32 combinazioni
- **g1**: OK in 1/1 combinazioni
- **g2**: OK in 3/3 combinazioni
- **home-colonne**: OK in 5/5 combinazioni
- **home-testi**: OK in 5/5 combinazioni
- **login-campi**: OK in 16/16 combinazioni
- **login-gerarchia**: OK in 16/16 combinazioni
- **login-link-destinazioni**: OK in 16/16 combinazioni
- **login-testi**: OK in 16/16 combinazioni
- **login-titolo-documento**: OK in 48/48 combinazioni
- **reset-campi**: OK in 32/32 combinazioni
- **reset-senza-token-vuoto**: OK in 1/1 combinazioni
- **shell-barra-alta**: OK in 48/48 combinazioni
- **shell-blocco-in-cima**: OK in 1/1 combinazioni
- **shell-blocco-utente**: OK in 1/1 combinazioni
- **shell-margine-contenuto**: OK in 48/48 combinazioni
- **shell-menu-voci**: OK in 1/1 combinazioni
- **shell-nomi-accessibili**: OK in 79/79 combinazioni
- **shell-segnaposto**: OK in 3/3 combinazioni
- **shell-sticky**: OK in 8/8 combinazioni
- **shell-uscita**: OK in 1/1 combinazioni
- **verify-testi**: OK in 32/32 combinazioni
- **acc-padding-scheda**: OK in 144/160 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **shell-menu-utente**: OK in 1/2 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **shell-percorso-voce-attiva**: OK in 67/79 combinazioni (con fallimenti o avvisi su altre combinazioni)
- **shell-passaggio-768**: OK in 4/8 combinazioni (con fallimenti o avvisi su altre combinazioni)

### FALLITO
- **acc-padding-scheda** (reset/iniziale, telefono-360/chiaro): misurato `-362 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, telefono-360/chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, telefono-390/chiaro): misurato `-384 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, telefono-390/chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, notebook-1280/chiaro): misurato `-433 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, notebook-1280/chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, tablet-820/chiaro): misurato `-552 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, tablet-820/chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, telefono-360/scuro): misurato `-362 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, telefono-360/scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, telefono-390/scuro): misurato `-384 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, telefono-390/scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, notebook-1280/scuro): misurato `-433 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, notebook-1280/scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, tablet-820/scuro): misurato `-552 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, tablet-820/scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, telefono-360/sistema-chiaro): misurato `-362 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, telefono-360/sistema-chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, telefono-390/sistema-chiaro): misurato `-384 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, telefono-390/sistema-chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, notebook-1280/sistema-chiaro): misurato `-433 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, notebook-1280/sistema-chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, tablet-820/sistema-chiaro): misurato `-552 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, tablet-820/sistema-chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, telefono-360/sistema-scuro): misurato `-362 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, telefono-360/sistema-scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, telefono-390/sistema-scuro): misurato `-384 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, telefono-390/sistema-scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, notebook-1280/sistema-scuro): misurato `-433 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, notebook-1280/sistema-scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **acc-padding-scheda** (reset/iniziale, tablet-820/sistema-scuro): misurato `-552 px` · atteso `16 px padding scheda` · /app/login/reset?token=prova
- **reset-testi** (reset/iniziale, tablet-820/sistema-scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova
- **reset-testi** (reset/link-scaduto, telefono-360/chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, telefono-390/chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, notebook-1280/chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, tablet-820/chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, telefono-360/scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, telefono-390/scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, notebook-1280/scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, tablet-820/scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, telefono-360/sistema-chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, telefono-390/sistema-chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, notebook-1280/sistema-chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, tablet-820/sistema-chiaro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, telefono-360/sistema-scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, telefono-390/sistema-scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, notebook-1280/sistema-scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **reset-testi** (reset/link-scaduto, tablet-820/sistema-scuro): misurato `{"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]}` · atteso `{"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al log` · /app/login/reset?token=prova&resetFailed=1
- **home-nessuna-riga-di-stato** (shell/home, telefono-390/chiaro): misurato `card /app/reservations: 3 righe testo; card /app/menu: 3 righe testo; card /app/hours: 3 righe testo` · atteso `nessuna riga di stato` · /app
- **shell-menu-utente** (shell/home, telefono-390/chiaro): misurato `[]` · atteso `Tema+Esci, no Admin` · /app
- **home-nessuna-riga-di-stato** (shell/home, notebook-1280/chiaro): misurato `card /app/reservations: 3 righe testo; card /app/menu: 3 righe testo; card /app/hours: 3 righe testo` · atteso `nessuna riga di stato` · /app
- **runtime-shell** (shell/home, notebook-1280/chiaro): misurato `locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('menuitemradio', { name: 'Chiaro' })
    - locator resolved to <div tabindex="-1" data-unchecked="" id="base-ui-_r_3_" role` · atteso `iterazione completata` · /app
- **home-nessuna-riga-di-stato** (shell/home, soglia-767/chiaro): misurato `card /app/reservations: 3 righe testo; card /app/menu: 3 righe testo; card /app/hours: 3 righe testo` · atteso `nessuna riga di stato` · /app
- **shell-passaggio-768** (shell/home, soglia-767/chiaro): misurato `desktopVis=0px pannello=384px` · atteso `no barra fissa; pannello ~288px` · /app
- **home-nessuna-riga-di-stato** (shell/home, soglia-768/chiaro): misurato `card /app/reservations: 3 righe testo; card /app/menu: 3 righe testo; card /app/hours: 3 righe testo` · atteso `nessuna riga di stato` · /app
- **home-nessuna-riga-di-stato** (shell/home, tablet-820/chiaro): misurato `card /app/reservations: 3 righe testo; card /app/menu: 3 righe testo; card /app/hours: 3 righe testo` · atteso `nessuna riga di stato` · /app
- **shell-passaggio-768** (shell/home, soglia-767/scuro): misurato `desktopVis=0px pannello=384px` · atteso `no barra fissa; pannello ~288px` · /app
- **shell-passaggio-768** (shell/home, soglia-767/sistema-chiaro): misurato `desktopVis=0px pannello=384px` · atteso `no barra fissa; pannello ~288px` · /app
- **shell-passaggio-768** (shell/home, soglia-767/sistema-scuro): misurato `desktopVis=0px pannello=384px` · atteso `no barra fissa; pannello ~288px` · /app
- **shell-percorso-voce-attiva** (shell/segnaposto-menu, soglia-767/chiaro): misurato `crumbs=MenùPiatti›Menù›Menù›Menù›Piatti›Piatti›Piatti; active=` · atteso `{"breadcrumb":["Menù","Piatti"],"active":"Piatti"}` · /app/menu
- **shell-percorso-voce-attiva** (shell/segnaposto-menu, soglia-767/scuro): misurato `crumbs=MenùPiatti›Menù›Menù›Menù›Piatti›Piatti›Piatti; active=` · atteso `{"breadcrumb":["Menù","Piatti"],"active":"Piatti"}` · /app/menu
- **shell-percorso-voce-attiva** (shell/segnaposto-menu, soglia-767/sistema-chiaro): misurato `crumbs=MenùPiatti›Menù›Menù›Menù›Piatti›Piatti›Piatti; active=` · atteso `{"breadcrumb":["Menù","Piatti"],"active":"Piatti"}` · /app/menu
- **shell-percorso-voce-attiva** (shell/segnaposto-menu, soglia-767/sistema-scuro): misurato `crumbs=MenùPiatti›Menù›Menù›Menù›Piatti›Piatti›Piatti; active=` · atteso `{"breadcrumb":["Menù","Piatti"],"active":"Piatti"}` · /app/menu
- **shell-percorso-voce-attiva** (shell/segnaposto-hours, soglia-767/chiaro): misurato `crumbs=Orari›Orari›Orari›Orari; active=` · atteso `{"breadcrumb":["Orari"],"active":"Orari"}` · /app/hours
- **shell-percorso-voce-attiva** (shell/segnaposto-hours, soglia-767/scuro): misurato `crumbs=Orari›Orari›Orari›Orari; active=` · atteso `{"breadcrumb":["Orari"],"active":"Orari"}` · /app/hours
- **shell-percorso-voce-attiva** (shell/segnaposto-hours, soglia-767/sistema-chiaro): misurato `crumbs=Orari›Orari›Orari›Orari; active=` · atteso `{"breadcrumb":["Orari"],"active":"Orari"}` · /app/hours
- **shell-percorso-voce-attiva** (shell/segnaposto-hours, soglia-767/sistema-scuro): misurato `crumbs=Orari›Orari›Orari›Orari; active=` · atteso `{"breadcrumb":["Orari"],"active":"Orari"}` · /app/hours
- **shell-percorso-voce-attiva** (shell/segnaposto-reservations, soglia-767/chiaro): misurato `crumbs=PrenotazioniElenco›Prenotazioni›Prenotazioni›Prenotazioni›Elenco›Elenco›Elenco; active=` · atteso `{"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"}` · /app/reservations
- **shell-percorso-voce-attiva** (shell/segnaposto-reservations, soglia-767/scuro): misurato `crumbs=PrenotazioniElenco›Prenotazioni›Prenotazioni›Prenotazioni›Elenco›Elenco›Elenco; active=` · atteso `{"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"}` · /app/reservations
- **shell-percorso-voce-attiva** (shell/segnaposto-reservations, soglia-767/sistema-chiaro): misurato `crumbs=PrenotazioniElenco›Prenotazioni›Prenotazioni›Prenotazioni›Elenco›Elenco›Elenco; active=` · atteso `{"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"}` · /app/reservations
- **shell-percorso-voce-attiva** (shell/segnaposto-reservations, soglia-767/sistema-scuro): misurato `crumbs=PrenotazioniElenco›Prenotazioni›Prenotazioni›Prenotazioni›Elenco›Elenco›Elenco; active=` · atteso `{"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"}` · /app/reservations
- **webkit-giro-essenziale** (shell/home, telefono-390/chiaro/WebKit 26.0): misurato `page.waitForURL: Timeout 20000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://localhost:3100/app/login"
===========` · atteso `flusso essenziale WebKit` · 26.0

### AVVISO
- (nessuno)

### NON PROVATO
- **verify-link-valido** (—, —): misurato `—` · atteso `—` · facoltativo: token reale monouso non ottenuto
- **shell-admin-link** (—, —): misurato `—` · atteso `—` · NON PROVABILE con utente solo App (adminRole none)
- **verify/link-valido** (—, —): misurato `—` · atteso `—` · facoltativo: serve un utente di prova con token di attivazione vero, che si consuma una volta sola; se non si riesce a ottenerlo, NON PROVATO
- **CONSOLE** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **on1** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **on2** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **on3** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **on4** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **on5** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **on6** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione
- **shell-tema-scelta** (—, —): misurato `—` · atteso `—` · controllo non eseguito dal lanciatore in questa esecuzione

## Tabella controlli distinti (JSON)
| Id | Esito sintetico (OK/totale combinazioni) |
|---|---|
| AMBIENTE | OK (1/1) |
| C1 | OK (152/152) |
| C2 | OK (160/160) |
| C2-mouse | OK (56/56) |
| C3 | OK (240/240) |
| C3-cambio-sistema | OK (1/1) |
| C3-no-lampo | OK (80/80) |
| C9 | OK (1/1) |
| CONSOLE | NON PROVATO (0/1) |
| acc-avvisi | OK (160/160) |
| acc-centratura | OK (160/160) |
| acc-collegamenti-sottolineati | OK (160/160) |
| acc-colonna | OK (120/120) |
| acc-fuori-shell | OK (160/160) |
| acc-icona | OK (160/160) |
| acc-margine | OK (80/80) |
| acc-padding-scheda | FALLITO (144/160) |
| acc-spazi-16 | OK (160/160) |
| forgot-testi | OK (16/16) |
| forgot-titolo-documento | OK (32/32) |
| g1 | OK (1/1) |
| g2 | OK (3/3) |
| home-colonne | OK (5/5) |
| home-nessuna-riga-di-stato | FALLITO (0/5) |
| home-testi | OK (5/5) |
| login-campi | OK (16/16) |
| login-gerarchia | OK (16/16) |
| login-link-destinazioni | OK (16/16) |
| login-testi | OK (16/16) |
| login-titolo-documento | OK (48/48) |
| on1 | NON PROVATO (0/1) |
| on2 | NON PROVATO (0/1) |
| on3 | NON PROVATO (0/1) |
| on4 | NON PROVATO (0/1) |
| on5 | NON PROVATO (0/1) |
| on6 | NON PROVATO (0/1) |
| reset-campi | OK (32/32) |
| reset-senza-token-vuoto | OK (1/1) |
| reset-testi | FALLITO (0/32) |
| shell-admin-link | NON PROVATO (0/1) |
| shell-barra-alta | OK (48/48) |
| shell-blocco-in-cima | OK (1/1) |
| shell-blocco-utente | OK (1/1) |
| shell-margine-contenuto | OK (48/48) |
| shell-menu-utente | FALLITO (1/2) |
| shell-menu-voci | OK (1/1) |
| shell-nomi-accessibili | OK (79/79) |
| shell-passaggio-768 | FALLITO (4/8) |
| shell-percorso-voce-attiva | FALLITO (67/79) |
| shell-segnaposto | OK (3/3) |
| shell-sticky | OK (8/8) |
| shell-tema-scelta | NON PROVATO (0/1) |
| shell-uscita | OK (1/1) |
| verify-testi | OK (32/32) |
| webkit-giro-essenziale | FALLITO (0/1) |

## Tabella completa (fallimenti, avvisi, non provato)
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| acc-padding-scheda | reset/iniziale | telefono-360/chiaro | FALLITO | -362 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | telefono-360/chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | telefono-390/chiaro | FALLITO | -384 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | telefono-390/chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | notebook-1280/chiaro | FALLITO | -433 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | notebook-1280/chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | tablet-820/chiaro | FALLITO | -552 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | tablet-820/chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | telefono-360/scuro | FALLITO | -362 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | telefono-360/scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | telefono-390/scuro | FALLITO | -384 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | telefono-390/scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | notebook-1280/scuro | FALLITO | -433 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | notebook-1280/scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | tablet-820/scuro | FALLITO | -552 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | tablet-820/scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | telefono-360/sistema-chiaro | FALLITO | -362 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | telefono-360/sistema-chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | telefono-390/sistema-chiaro | FALLITO | -384 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | telefono-390/sistema-chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | notebook-1280/sistema-chiaro | FALLITO | -433 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | notebook-1280/sistema-chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | tablet-820/sistema-chiaro | FALLITO | -552 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | tablet-820/sistema-chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | telefono-360/sistema-scuro | FALLITO | -362 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | telefono-360/sistema-scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | telefono-390/sistema-scuro | FALLITO | -384 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | telefono-390/sistema-scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | notebook-1280/sistema-scuro | FALLITO | -433 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | notebook-1280/sistema-scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| acc-padding-scheda | reset/iniziale | tablet-820/sistema-scuro | FALLITO | -552 px | 16 px padding scheda | /app/login/reset?token=prova |
| reset-testi | reset/iniziale | tablet-820/sistema-scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova |
| reset-testi | reset/link-scaduto | telefono-360/chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | telefono-390/chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | notebook-1280/chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | tablet-820/chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | telefono-360/scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | telefono-390/scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | notebook-1280/scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | tablet-820/scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | telefono-360/sistema-chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | telefono-390/sistema-chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | notebook-1280/sistema-chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | tablet-820/sistema-chiaro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | telefono-360/sistema-scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | telefono-390/sistema-scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | notebook-1280/sistema-scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| reset-testi | reset/link-scaduto | tablet-820/sistema-scuro | FALLITO | {"h1":"Nuova password","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","labels":["Nuova password"],"button":"Aggiorna password","links":["Torna al login"]} | /app/login/reset?token=prova&resetFailed=1 |
| verify/link-valido | — | — | NON PROVATO | — | — | facoltativo: serve un utente di prova con token di attivazione vero, che si consuma una volta sola; se non si riesce a ottenerlo, NON PROVATO |
| home-nessuna-riga-di-stato | shell/home | telefono-390/chiaro | FALLITO | card /app/reservations: 3 righe testo; card /app/menu: 3 righe testo; card /app/hours: 3 righe testo | nessuna riga di stato | /app |
| shell-menu-utente | shell/home | telefono-390/chiaro | FALLITO | [] | Tema+Esci, no Admin | /app |
| home-nessuna-riga-di-stato | shell/home | notebook-1280/chiaro | FALLITO | card /app/reservations: 3 righe testo; card /app/menu: 3 righe testo; card /app/hours: 3 righe testo | nessuna riga di stato | /app |
| runtime-shell | shell/home | notebook-1280/chiaro | FALLITO | locator.click: Timeout 30000ms exceeded. Call log:   - waiting for getByRole('menuitemradio', { name: 'Chiaro' })     - locator resolved to <div tabindex="-1" data-unchecked="" id="base-ui-_r_3_" role="menuitemradio" aria-checked="false" data-slot="dropdown-menu-radio-item" class="relative flex cursor-default items-center gap-1.5 rounded-md py-1 pointer-coarse:py-3 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:s…>…</div>   - attempting click action     2 × waiting for element to be visible, enabled and stable       - element is not stable     - retrying click action     - waiting 20ms     - waiting for element to be visible, enabled and stable     - element is not stable   - retrying click action     - waiting 100ms     - waiting for element to be visible, enabled and stable   - element was detached from the DOM, retrying  | iterazione completata | /app |
| home-nessuna-riga-di-stato | shell/home | soglia-767/chiaro | FALLITO | card /app/reservations: 3 righe testo; card /app/menu: 3 righe testo; card /app/hours: 3 righe testo | nessuna riga di stato | /app |
| shell-passaggio-768 | shell/home | soglia-767/chiaro | FALLITO | desktopVis=0px pannello=384px | no barra fissa; pannello ~288px | /app |
| home-nessuna-riga-di-stato | shell/home | soglia-768/chiaro | FALLITO | card /app/reservations: 3 righe testo; card /app/menu: 3 righe testo; card /app/hours: 3 righe testo | nessuna riga di stato | /app |
| home-nessuna-riga-di-stato | shell/home | tablet-820/chiaro | FALLITO | card /app/reservations: 3 righe testo; card /app/menu: 3 righe testo; card /app/hours: 3 righe testo | nessuna riga di stato | /app |
| shell-passaggio-768 | shell/home | soglia-767/scuro | FALLITO | desktopVis=0px pannello=384px | no barra fissa; pannello ~288px | /app |
| shell-passaggio-768 | shell/home | soglia-767/sistema-chiaro | FALLITO | desktopVis=0px pannello=384px | no barra fissa; pannello ~288px | /app |
| shell-passaggio-768 | shell/home | soglia-767/sistema-scuro | FALLITO | desktopVis=0px pannello=384px | no barra fissa; pannello ~288px | /app |
| shell-percorso-voce-attiva | shell/segnaposto-menu | soglia-767/chiaro | FALLITO | crumbs=MenùPiatti›Menù›Menù›Menù›Piatti›Piatti›Piatti; active= | {"breadcrumb":["Menù","Piatti"],"active":"Piatti"} | /app/menu |
| shell-percorso-voce-attiva | shell/segnaposto-menu | soglia-767/scuro | FALLITO | crumbs=MenùPiatti›Menù›Menù›Menù›Piatti›Piatti›Piatti; active= | {"breadcrumb":["Menù","Piatti"],"active":"Piatti"} | /app/menu |
| shell-percorso-voce-attiva | shell/segnaposto-menu | soglia-767/sistema-chiaro | FALLITO | crumbs=MenùPiatti›Menù›Menù›Menù›Piatti›Piatti›Piatti; active= | {"breadcrumb":["Menù","Piatti"],"active":"Piatti"} | /app/menu |
| shell-percorso-voce-attiva | shell/segnaposto-menu | soglia-767/sistema-scuro | FALLITO | crumbs=MenùPiatti›Menù›Menù›Menù›Piatti›Piatti›Piatti; active= | {"breadcrumb":["Menù","Piatti"],"active":"Piatti"} | /app/menu |
| shell-percorso-voce-attiva | shell/segnaposto-hours | soglia-767/chiaro | FALLITO | crumbs=Orari›Orari›Orari›Orari; active= | {"breadcrumb":["Orari"],"active":"Orari"} | /app/hours |
| shell-percorso-voce-attiva | shell/segnaposto-hours | soglia-767/scuro | FALLITO | crumbs=Orari›Orari›Orari›Orari; active= | {"breadcrumb":["Orari"],"active":"Orari"} | /app/hours |
| shell-percorso-voce-attiva | shell/segnaposto-hours | soglia-767/sistema-chiaro | FALLITO | crumbs=Orari›Orari›Orari›Orari; active= | {"breadcrumb":["Orari"],"active":"Orari"} | /app/hours |
| shell-percorso-voce-attiva | shell/segnaposto-hours | soglia-767/sistema-scuro | FALLITO | crumbs=Orari›Orari›Orari›Orari; active= | {"breadcrumb":["Orari"],"active":"Orari"} | /app/hours |
| shell-percorso-voce-attiva | shell/segnaposto-reservations | soglia-767/chiaro | FALLITO | crumbs=PrenotazioniElenco›Prenotazioni›Prenotazioni›Prenotazioni›Elenco›Elenco›Elenco; active= | {"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"} | /app/reservations |
| shell-percorso-voce-attiva | shell/segnaposto-reservations | soglia-767/scuro | FALLITO | crumbs=PrenotazioniElenco›Prenotazioni›Prenotazioni›Prenotazioni›Elenco›Elenco›Elenco; active= | {"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"} | /app/reservations |
| shell-percorso-voce-attiva | shell/segnaposto-reservations | soglia-767/sistema-chiaro | FALLITO | crumbs=PrenotazioniElenco›Prenotazioni›Prenotazioni›Prenotazioni›Elenco›Elenco›Elenco; active= | {"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"} | /app/reservations |
| shell-percorso-voce-attiva | shell/segnaposto-reservations | soglia-767/sistema-scuro | FALLITO | crumbs=PrenotazioniElenco›Prenotazioni›Prenotazioni›Prenotazioni›Elenco›Elenco›Elenco; active= | {"breadcrumb":["Prenotazioni","Elenco"],"active":"Elenco"} | /app/reservations |
| webkit-giro-essenziale | shell/home | telefono-390/chiaro/WebKit 26.0 | FALLITO | page.waitForURL: Timeout 20000ms exceeded. =========================== logs =========================== waiting for navigation until "load"   navigated to "http://localhost:3100/app/login" ============================================================ | flusso essenziale WebKit | 26.0 |
| CONSOLE | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| on1 | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| on2 | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| on3 | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| on4 | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| on5 | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| on6 | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |
| shell-tema-scelta | — | — | NON PROVATO | — | — | controllo non eseguito dal lanciatore in questa esecuzione |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- verify/link-valido: facoltativo: serve un utente di prova con token di attivazione vero, che si consuma una volta sola; se non si riesce a ottenerlo, NON PROVATO
- CONSOLE: controllo non eseguito dal lanciatore in questa esecuzione
- on1: controllo non eseguito dal lanciatore in questa esecuzione
- on2: controllo non eseguito dal lanciatore in questa esecuzione
- on3: controllo non eseguito dal lanciatore in questa esecuzione
- on4: controllo non eseguito dal lanciatore in questa esecuzione
- on5: controllo non eseguito dal lanciatore in questa esecuzione
- on6: controllo non eseguito dal lanciatore in questa esecuzione
- shell-tema-scelta: controllo non eseguito dal lanciatore in questa esecuzione

## Anomalie dell'ambiente
- shell shell/home notebook-1280/chiaro: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('menuitemradio', { name: 'Chiaro' })
    - locator resolved to <div tabindex="-1" data-unchecked="" id="base-ui-_r_3_" role="menuitemradio" aria-checked="false" data-slot="dropdown-menu-radio-item" class="relative flex cursor-default items-center gap-1.5 rounded-md py-1 pointer-coarse:py-3 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:s…>…</div>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  - retrying click action
    - waiting 100ms
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

