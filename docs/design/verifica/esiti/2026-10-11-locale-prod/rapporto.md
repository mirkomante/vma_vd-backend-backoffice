# Esito verifica — locale-prod — 2026-10-11
Commit: 2ca023005c5a · Lanciatore: 1.0.0 · Browser: (in corso) · Controlli: controlli-8.2.json v1

## Riepilogo
OK: 1620 · FALLITO: 85 · AVVISO: undefined · NON PROVATO: 3

## Esiti
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| C9 | — | — | OK | exit 0 | exit 0 | pnpm ui:check |
| verify-link-valido | — | — | NON PROVATO | — | — | facoltativo: token reale monouso non ottenuto |
| shell-admin-link | — | — | NON PROVATO | — | — | NON PROVABILE con utente solo App (adminRole none) |
| C1 | login/iniziale | telefono-360/chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login |
| C3 | login/iniziale | telefono-360/chiaro | OK | dark assente | dark assente | /app/login |
| acc-fuori-shell | login/iniziale | telefono-360/chiaro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | telefono-360/chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-margine | login/iniziale | telefono-360/chiaro | OK | 16 px | 16 px sotto 768 | /app/login |
| acc-icona | login/iniziale | telefono-360/chiaro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | telefono-360/chiaro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | telefono-360/chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | telefono-360/chiaro | OK | Google bg lab(7.78201 -0.0000149012 0), Accedi bg lab(100 0 0) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login |
| C2 | login/iniziale | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login |
| C3 | login/iniziale | telefono-390/chiaro | OK | dark assente | dark assente | /app/login |
| acc-fuori-shell | login/iniziale | telefono-390/chiaro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | telefono-390/chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-colonna | login/iniziale | telefono-390/chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login |
| acc-margine | login/iniziale | telefono-390/chiaro | OK | 16 px | 16 px sotto 768 | /app/login |
| acc-icona | login/iniziale | telefono-390/chiaro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | telefono-390/chiaro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | telefono-390/chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | telefono-390/chiaro | OK | Google bg lab(7.78201 -0.0000149012 0), Accedi bg lab(100 0 0) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login |
| C2-mouse | login/iniziale | notebook-1280/chiaro | AVVISO | fuori intervallo: 22, 22 px (tutte: 36,32,32,36,22,22…) | altezze in [28, 48] px | /app/login |
| C3 | login/iniziale | notebook-1280/chiaro | OK | dark assente | dark assente | /app/login |
| acc-fuori-shell | login/iniziale | notebook-1280/chiaro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | notebook-1280/chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-colonna | login/iniziale | notebook-1280/chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login |
| acc-icona | login/iniziale | notebook-1280/chiaro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | notebook-1280/chiaro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | notebook-1280/chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | notebook-1280/chiaro | OK | Google bg lab(7.78201 -0.0000149012 0), Accedi bg lab(100 0 0) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login |
| C2 | login/iniziale | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login |
| C3 | login/iniziale | tablet-820/chiaro | OK | dark assente | dark assente | /app/login |
| acc-fuori-shell | login/iniziale | tablet-820/chiaro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | tablet-820/chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-colonna | login/iniziale | tablet-820/chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login |
| acc-icona | login/iniziale | tablet-820/chiaro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | tablet-820/chiaro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | tablet-820/chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | tablet-820/chiaro | OK | Google bg lab(7.78201 -0.0000149012 0), Accedi bg lab(100 0 0) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | telefono-360/scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login |
| C3 | login/iniziale | telefono-360/scuro | OK | dark presente | dark presente | /app/login |
| C3-no-lampo | login/iniziale | telefono-360/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login |
| acc-fuori-shell | login/iniziale | telefono-360/scuro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | telefono-360/scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-margine | login/iniziale | telefono-360/scuro | OK | 16 px | 16 px sotto 768 | /app/login |
| acc-icona | login/iniziale | telefono-360/scuro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | telefono-360/scuro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | telefono-360/scuro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | telefono-360/scuro | OK | Google bg lab(90.952 0 -0.0000119209), Accedi bg oklab(0.999998 -0.00000980496 0.0000234246 / 0.045) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login |
| C2 | login/iniziale | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login |
| C3 | login/iniziale | telefono-390/scuro | OK | dark presente | dark presente | /app/login |
| C3-no-lampo | login/iniziale | telefono-390/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login |
| acc-fuori-shell | login/iniziale | telefono-390/scuro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | telefono-390/scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-colonna | login/iniziale | telefono-390/scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login |
| acc-margine | login/iniziale | telefono-390/scuro | OK | 16 px | 16 px sotto 768 | /app/login |
| acc-icona | login/iniziale | telefono-390/scuro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | telefono-390/scuro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | telefono-390/scuro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | telefono-390/scuro | OK | Google bg lab(90.952 0 -0.0000119209), Accedi bg oklab(0.999998 -0.00000980496 0.0000234246 / 0.045) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login |
| C2-mouse | login/iniziale | notebook-1280/scuro | AVVISO | fuori intervallo: 22, 22 px (tutte: 36,32,32,36,22,22…) | altezze in [28, 48] px | /app/login |
| C3 | login/iniziale | notebook-1280/scuro | OK | dark presente | dark presente | /app/login |
| C3-no-lampo | login/iniziale | notebook-1280/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login |
| acc-fuori-shell | login/iniziale | notebook-1280/scuro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | notebook-1280/scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-colonna | login/iniziale | notebook-1280/scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login |
| acc-icona | login/iniziale | notebook-1280/scuro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | notebook-1280/scuro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | notebook-1280/scuro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | notebook-1280/scuro | OK | Google bg lab(90.952 0 -0.0000119209), Accedi bg oklab(0.999998 -0.00000980496 0.0000234246 / 0.045) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login |
| C2 | login/iniziale | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login |
| C3 | login/iniziale | tablet-820/scuro | OK | dark presente | dark presente | /app/login |
| C3-no-lampo | login/iniziale | tablet-820/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login |
| acc-fuori-shell | login/iniziale | tablet-820/scuro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | tablet-820/scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-colonna | login/iniziale | tablet-820/scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login |
| acc-icona | login/iniziale | tablet-820/scuro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | tablet-820/scuro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | tablet-820/scuro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | tablet-820/scuro | OK | Google bg lab(90.952 0 -0.0000119209), Accedi bg oklab(0.999998 -0.00000980496 0.0000234246 / 0.045) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | telefono-360/sistema-chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login |
| C3 | login/iniziale | telefono-360/sistema-chiaro | OK | dark assente | dark assente | /app/login |
| acc-fuori-shell | login/iniziale | telefono-360/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | telefono-360/sistema-chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-margine | login/iniziale | telefono-360/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login |
| acc-icona | login/iniziale | telefono-360/sistema-chiaro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | telefono-360/sistema-chiaro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | telefono-360/sistema-chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | telefono-360/sistema-chiaro | OK | Google bg lab(7.78201 -0.0000149012 0), Accedi bg lab(100 0 0) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login |
| C2 | login/iniziale | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login |
| C3 | login/iniziale | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/login |
| acc-fuori-shell | login/iniziale | telefono-390/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | telefono-390/sistema-chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-colonna | login/iniziale | telefono-390/sistema-chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login |
| acc-margine | login/iniziale | telefono-390/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login |
| acc-icona | login/iniziale | telefono-390/sistema-chiaro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | telefono-390/sistema-chiaro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | telefono-390/sistema-chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | telefono-390/sistema-chiaro | OK | Google bg lab(7.78201 -0.0000149012 0), Accedi bg lab(100 0 0) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login |
| C2-mouse | login/iniziale | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 22, 22 px (tutte: 36,32,32,36,22,22…) | altezze in [28, 48] px | /app/login |
| C3 | login/iniziale | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/login |
| acc-fuori-shell | login/iniziale | notebook-1280/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | notebook-1280/sistema-chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-colonna | login/iniziale | notebook-1280/sistema-chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login |
| acc-icona | login/iniziale | notebook-1280/sistema-chiaro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | notebook-1280/sistema-chiaro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | notebook-1280/sistema-chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | notebook-1280/sistema-chiaro | OK | Google bg lab(7.78201 -0.0000149012 0), Accedi bg lab(100 0 0) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login |
| C2 | login/iniziale | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login |
| C3 | login/iniziale | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/login |
| acc-fuori-shell | login/iniziale | tablet-820/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | tablet-820/sistema-chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-colonna | login/iniziale | tablet-820/sistema-chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login |
| acc-icona | login/iniziale | tablet-820/sistema-chiaro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | tablet-820/sistema-chiaro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | tablet-820/sistema-chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | tablet-820/sistema-chiaro | OK | Google bg lab(7.78201 -0.0000149012 0), Accedi bg lab(100 0 0) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | telefono-360/sistema-scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login |
| C3 | login/iniziale | telefono-360/sistema-scuro | OK | dark presente | dark presente | /app/login |
| C3-no-lampo | login/iniziale | telefono-360/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login |
| acc-fuori-shell | login/iniziale | telefono-360/sistema-scuro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | telefono-360/sistema-scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-margine | login/iniziale | telefono-360/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login |
| acc-icona | login/iniziale | telefono-360/sistema-scuro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | telefono-360/sistema-scuro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | telefono-360/sistema-scuro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | telefono-360/sistema-scuro | OK | Google bg lab(90.952 0 -0.0000119209), Accedi bg oklab(0.999998 -0.00000980496 0.0000234246 / 0.045) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login |
| C2 | login/iniziale | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login |
| C3 | login/iniziale | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/login |
| C3-no-lampo | login/iniziale | telefono-390/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login |
| acc-fuori-shell | login/iniziale | telefono-390/sistema-scuro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | telefono-390/sistema-scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-colonna | login/iniziale | telefono-390/sistema-scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login |
| acc-margine | login/iniziale | telefono-390/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login |
| acc-icona | login/iniziale | telefono-390/sistema-scuro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | telefono-390/sistema-scuro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | telefono-390/sistema-scuro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | telefono-390/sistema-scuro | OK | Google bg lab(90.952 0 -0.0000119209), Accedi bg oklab(0.999998 -0.00000980496 0.0000234246 / 0.045) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login |
| C2-mouse | login/iniziale | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 22, 22 px (tutte: 36,32,32,36,22,22…) | altezze in [28, 48] px | /app/login |
| C3 | login/iniziale | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/login |
| C3-no-lampo | login/iniziale | notebook-1280/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login |
| acc-fuori-shell | login/iniziale | notebook-1280/sistema-scuro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | notebook-1280/sistema-scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-colonna | login/iniziale | notebook-1280/sistema-scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login |
| acc-icona | login/iniziale | notebook-1280/sistema-scuro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | notebook-1280/sistema-scuro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | notebook-1280/sistema-scuro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | notebook-1280/sistema-scuro | OK | Google bg lab(90.952 0 -0.0000119209), Accedi bg oklab(0.999998 -0.00000980496 0.0000234246 / 0.045) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/iniziale | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login |
| C2 | login/iniziale | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login |
| C3 | login/iniziale | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/login |
| C3-no-lampo | login/iniziale | tablet-820/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login |
| acc-fuori-shell | login/iniziale | tablet-820/sistema-scuro | OK | 0 elementi shell | 0 | /app/login |
| acc-collegamenti-sottolineati | login/iniziale | tablet-820/sistema-scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login |
| acc-colonna | login/iniziale | tablet-820/sistema-scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login |
| acc-icona | login/iniziale | tablet-820/sistema-scuro | OK | 40×40 | 40×40 | /app/login |
| login-testi | login/iniziale | tablet-820/sistema-scuro | FALLITO | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","sep":true,"labels":["Email","Password"],"links":["Accedi con Google","Password dimenticata?","Torna al sito"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login |
| login-titolo-documento | login/iniziale | tablet-820/sistema-scuro | OK | Accesso · Area App | Accesso · Area App | /app/login |
| login-gerarchia | login/iniziale | tablet-820/sistema-scuro | OK | Google bg lab(90.952 0 -0.0000119209), Accedi bg oklab(0.999998 -0.00000980496 0.0000234246 / 0.045) | sfondi Google e Accedi diversi; Google ≈ primary | /app/login |
| C1 | login/rifiutato | telefono-360/chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C3 | login/rifiutato | telefono-360/chiaro | OK | dark assente | dark assente | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | telefono-360/chiaro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | telefono-360/chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-margine | login/rifiutato | telefono-360/chiaro | OK | 16 px | 16 px sotto 768 | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | telefono-360/chiaro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C2 | login/rifiutato | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?authFailed=1 |
| C3 | login/rifiutato | telefono-390/chiaro | OK | dark assente | dark assente | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | telefono-390/chiaro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | telefono-390/chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-colonna | login/rifiutato | telefono-390/chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login?authFailed=1 |
| acc-margine | login/rifiutato | telefono-390/chiaro | OK | 16 px | 16 px sotto 768 | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | telefono-390/chiaro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C2-mouse | login/rifiutato | notebook-1280/chiaro | AVVISO | fuori intervallo: 22, 22 px (tutte: 36,32,32,36,22,22…) | altezze in [28, 48] px | /app/login?authFailed=1 |
| C3 | login/rifiutato | notebook-1280/chiaro | OK | dark assente | dark assente | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | notebook-1280/chiaro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | notebook-1280/chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-colonna | login/rifiutato | notebook-1280/chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | notebook-1280/chiaro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C2 | login/rifiutato | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?authFailed=1 |
| C3 | login/rifiutato | tablet-820/chiaro | OK | dark assente | dark assente | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | tablet-820/chiaro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | tablet-820/chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-colonna | login/rifiutato | tablet-820/chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | tablet-820/chiaro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | telefono-360/scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C3 | login/rifiutato | telefono-360/scuro | OK | dark presente | dark presente | /app/login?authFailed=1 |
| C3-no-lampo | login/rifiutato | telefono-360/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | telefono-360/scuro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | telefono-360/scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-margine | login/rifiutato | telefono-360/scuro | OK | 16 px | 16 px sotto 768 | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | telefono-360/scuro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C2 | login/rifiutato | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?authFailed=1 |
| C3 | login/rifiutato | telefono-390/scuro | OK | dark presente | dark presente | /app/login?authFailed=1 |
| C3-no-lampo | login/rifiutato | telefono-390/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | telefono-390/scuro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | telefono-390/scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-colonna | login/rifiutato | telefono-390/scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login?authFailed=1 |
| acc-margine | login/rifiutato | telefono-390/scuro | OK | 16 px | 16 px sotto 768 | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | telefono-390/scuro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C2-mouse | login/rifiutato | notebook-1280/scuro | AVVISO | fuori intervallo: 22, 22 px (tutte: 36,32,32,36,22,22…) | altezze in [28, 48] px | /app/login?authFailed=1 |
| C3 | login/rifiutato | notebook-1280/scuro | OK | dark presente | dark presente | /app/login?authFailed=1 |
| C3-no-lampo | login/rifiutato | notebook-1280/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | notebook-1280/scuro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | notebook-1280/scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-colonna | login/rifiutato | notebook-1280/scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | notebook-1280/scuro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C2 | login/rifiutato | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?authFailed=1 |
| C3 | login/rifiutato | tablet-820/scuro | OK | dark presente | dark presente | /app/login?authFailed=1 |
| C3-no-lampo | login/rifiutato | tablet-820/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | tablet-820/scuro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | tablet-820/scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-colonna | login/rifiutato | tablet-820/scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | tablet-820/scuro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | telefono-360/sistema-chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C3 | login/rifiutato | telefono-360/sistema-chiaro | OK | dark assente | dark assente | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | telefono-360/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | telefono-360/sistema-chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-margine | login/rifiutato | telefono-360/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | telefono-360/sistema-chiaro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C2 | login/rifiutato | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?authFailed=1 |
| C3 | login/rifiutato | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | telefono-390/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | telefono-390/sistema-chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-colonna | login/rifiutato | telefono-390/sistema-chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login?authFailed=1 |
| acc-margine | login/rifiutato | telefono-390/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | telefono-390/sistema-chiaro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C2-mouse | login/rifiutato | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 22, 22 px (tutte: 36,32,32,36,22,22…) | altezze in [28, 48] px | /app/login?authFailed=1 |
| C3 | login/rifiutato | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | notebook-1280/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | notebook-1280/sistema-chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-colonna | login/rifiutato | notebook-1280/sistema-chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | notebook-1280/sistema-chiaro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C2 | login/rifiutato | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?authFailed=1 |
| C3 | login/rifiutato | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | tablet-820/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | tablet-820/sistema-chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-colonna | login/rifiutato | tablet-820/sistema-chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | tablet-820/sistema-chiaro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | telefono-360/sistema-scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C3 | login/rifiutato | telefono-360/sistema-scuro | OK | dark presente | dark presente | /app/login?authFailed=1 |
| C3-no-lampo | login/rifiutato | telefono-360/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | telefono-360/sistema-scuro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | telefono-360/sistema-scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-margine | login/rifiutato | telefono-360/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | telefono-360/sistema-scuro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C2 | login/rifiutato | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?authFailed=1 |
| C3 | login/rifiutato | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/login?authFailed=1 |
| C3-no-lampo | login/rifiutato | telefono-390/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | telefono-390/sistema-scuro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | telefono-390/sistema-scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-colonna | login/rifiutato | telefono-390/sistema-scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login?authFailed=1 |
| acc-margine | login/rifiutato | telefono-390/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | telefono-390/sistema-scuro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C2-mouse | login/rifiutato | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 22, 22 px (tutte: 36,32,32,36,22,22…) | altezze in [28, 48] px | /app/login?authFailed=1 |
| C3 | login/rifiutato | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/login?authFailed=1 |
| C3-no-lampo | login/rifiutato | notebook-1280/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | notebook-1280/sistema-scuro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | notebook-1280/sistema-scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-colonna | login/rifiutato | notebook-1280/sistema-scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | notebook-1280/sistema-scuro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| C1 | login/rifiutato | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login?authFailed=1 |
| C2 | login/rifiutato | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?authFailed=1 |
| C3 | login/rifiutato | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/login?authFailed=1 |
| C3-no-lampo | login/rifiutato | tablet-820/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?authFailed=1 |
| acc-fuori-shell | login/rifiutato | tablet-820/sistema-scuro | OK | 0 elementi shell | 0 | /app/login?authFailed=1 |
| acc-collegamenti-sottolineati | login/rifiutato | tablet-820/sistema-scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?authFailed=1 |
| acc-colonna | login/rifiutato | tablet-820/sistema-scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login?authFailed=1 |
| acc-icona | login/rifiutato | tablet-820/sistema-scuro | OK | 40×40 | 40×40 | /app/login?authFailed=1 |
| avviso-login-rifiutato | login/rifiutato | telefono-390/chiaro | OK | testo presente | Accesso non riuscito. Se ritieni di dove… | /app/login?authFailed=1 |
| C1 | login/password-aggiornata | telefono-360/chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C3 | login/password-aggiornata | telefono-360/chiaro | OK | dark assente | dark assente | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | telefono-360/chiaro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | telefono-360/chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-margine | login/password-aggiornata | telefono-360/chiaro | OK | 16 px | 16 px sotto 768 | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | telefono-360/chiaro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C2 | login/password-aggiornata | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?reset=1 |
| C3 | login/password-aggiornata | telefono-390/chiaro | OK | dark assente | dark assente | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | telefono-390/chiaro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | telefono-390/chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-colonna | login/password-aggiornata | telefono-390/chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login?reset=1 |
| acc-margine | login/password-aggiornata | telefono-390/chiaro | OK | 16 px | 16 px sotto 768 | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | telefono-390/chiaro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C2-mouse | login/password-aggiornata | notebook-1280/chiaro | AVVISO | fuori intervallo: 22, 22 px (tutte: 36,32,32,36,22,22…) | altezze in [28, 48] px | /app/login?reset=1 |
| C3 | login/password-aggiornata | notebook-1280/chiaro | OK | dark assente | dark assente | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | notebook-1280/chiaro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | notebook-1280/chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-colonna | login/password-aggiornata | notebook-1280/chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | notebook-1280/chiaro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C2 | login/password-aggiornata | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?reset=1 |
| C3 | login/password-aggiornata | tablet-820/chiaro | OK | dark assente | dark assente | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | tablet-820/chiaro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | tablet-820/chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-colonna | login/password-aggiornata | tablet-820/chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | tablet-820/chiaro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | telefono-360/scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C3 | login/password-aggiornata | telefono-360/scuro | OK | dark presente | dark presente | /app/login?reset=1 |
| C3-no-lampo | login/password-aggiornata | telefono-360/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | telefono-360/scuro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | telefono-360/scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-margine | login/password-aggiornata | telefono-360/scuro | OK | 16 px | 16 px sotto 768 | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | telefono-360/scuro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C2 | login/password-aggiornata | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?reset=1 |
| C3 | login/password-aggiornata | telefono-390/scuro | OK | dark presente | dark presente | /app/login?reset=1 |
| C3-no-lampo | login/password-aggiornata | telefono-390/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | telefono-390/scuro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | telefono-390/scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-colonna | login/password-aggiornata | telefono-390/scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login?reset=1 |
| acc-margine | login/password-aggiornata | telefono-390/scuro | OK | 16 px | 16 px sotto 768 | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | telefono-390/scuro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C2-mouse | login/password-aggiornata | notebook-1280/scuro | AVVISO | fuori intervallo: 22, 22 px (tutte: 36,32,32,36,22,22…) | altezze in [28, 48] px | /app/login?reset=1 |
| C3 | login/password-aggiornata | notebook-1280/scuro | OK | dark presente | dark presente | /app/login?reset=1 |
| C3-no-lampo | login/password-aggiornata | notebook-1280/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | notebook-1280/scuro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | notebook-1280/scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-colonna | login/password-aggiornata | notebook-1280/scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | notebook-1280/scuro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C2 | login/password-aggiornata | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?reset=1 |
| C3 | login/password-aggiornata | tablet-820/scuro | OK | dark presente | dark presente | /app/login?reset=1 |
| C3-no-lampo | login/password-aggiornata | tablet-820/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | tablet-820/scuro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | tablet-820/scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-colonna | login/password-aggiornata | tablet-820/scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | tablet-820/scuro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | telefono-360/sistema-chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C3 | login/password-aggiornata | telefono-360/sistema-chiaro | OK | dark assente | dark assente | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | telefono-360/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | telefono-360/sistema-chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-margine | login/password-aggiornata | telefono-360/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | telefono-360/sistema-chiaro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C2 | login/password-aggiornata | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?reset=1 |
| C3 | login/password-aggiornata | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | telefono-390/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | telefono-390/sistema-chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-colonna | login/password-aggiornata | telefono-390/sistema-chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login?reset=1 |
| acc-margine | login/password-aggiornata | telefono-390/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | telefono-390/sistema-chiaro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C2-mouse | login/password-aggiornata | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 22, 22 px (tutte: 36,32,32,36,22,22…) | altezze in [28, 48] px | /app/login?reset=1 |
| C3 | login/password-aggiornata | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | notebook-1280/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | notebook-1280/sistema-chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-colonna | login/password-aggiornata | notebook-1280/sistema-chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | notebook-1280/sistema-chiaro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C2 | login/password-aggiornata | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?reset=1 |
| C3 | login/password-aggiornata | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | tablet-820/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | tablet-820/sistema-chiaro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-colonna | login/password-aggiornata | tablet-820/sistema-chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | tablet-820/sistema-chiaro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | telefono-360/sistema-scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C3 | login/password-aggiornata | telefono-360/sistema-scuro | OK | dark presente | dark presente | /app/login?reset=1 |
| C3-no-lampo | login/password-aggiornata | telefono-360/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | telefono-360/sistema-scuro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | telefono-360/sistema-scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-margine | login/password-aggiornata | telefono-360/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | telefono-360/sistema-scuro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C2 | login/password-aggiornata | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?reset=1 |
| C3 | login/password-aggiornata | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/login?reset=1 |
| C3-no-lampo | login/password-aggiornata | telefono-390/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | telefono-390/sistema-scuro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | telefono-390/sistema-scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-colonna | login/password-aggiornata | telefono-390/sistema-scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login?reset=1 |
| acc-margine | login/password-aggiornata | telefono-390/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | telefono-390/sistema-scuro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C2-mouse | login/password-aggiornata | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 22, 22 px (tutte: 36,32,32,36,22,22…) | altezze in [28, 48] px | /app/login?reset=1 |
| C3 | login/password-aggiornata | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/login?reset=1 |
| C3-no-lampo | login/password-aggiornata | notebook-1280/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | notebook-1280/sistema-scuro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | notebook-1280/sistema-scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-colonna | login/password-aggiornata | notebook-1280/sistema-scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | notebook-1280/sistema-scuro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| C1 | login/password-aggiornata | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login?reset=1 |
| C2 | login/password-aggiornata | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login?reset=1 |
| C3 | login/password-aggiornata | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/login?reset=1 |
| C3-no-lampo | login/password-aggiornata | tablet-820/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login?reset=1 |
| acc-fuori-shell | login/password-aggiornata | tablet-820/sistema-scuro | OK | 0 elementi shell | 0 | /app/login?reset=1 |
| acc-collegamenti-sottolineati | login/password-aggiornata | tablet-820/sistema-scuro | OK | underline, underline | underline su tutti i collegamenti sotto la scheda | /app/login?reset=1 |
| acc-colonna | login/password-aggiornata | tablet-820/sistema-scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login?reset=1 |
| acc-icona | login/password-aggiornata | tablet-820/sistema-scuro | OK | 40×40 | 40×40 | /app/login?reset=1 |
| avviso-login-password-aggiornata | login/password-aggiornata | telefono-390/chiaro | OK | testo presente | Password aggiornata. Puoi accedere con l… | /app/login?reset=1 |
| C1 | forgot/iniziale | telefono-360/chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/forgot |
| C3 | forgot/iniziale | telefono-360/chiaro | OK | dark assente | dark assente | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | telefono-360/chiaro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | telefono-360/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-margine | forgot/iniziale | telefono-360/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/forgot |
| acc-icona | forgot/iniziale | telefono-360/chiaro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | telefono-360/chiaro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | telefono-360/chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | telefono-360/chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/forgot |
| C2 | forgot/iniziale | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot |
| C3 | forgot/iniziale | telefono-390/chiaro | OK | dark assente | dark assente | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | telefono-390/chiaro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | telefono-390/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-colonna | forgot/iniziale | telefono-390/chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/forgot |
| acc-margine | forgot/iniziale | telefono-390/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/forgot |
| acc-icona | forgot/iniziale | telefono-390/chiaro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | telefono-390/chiaro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | telefono-390/chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | telefono-390/chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/forgot |
| C2-mouse | forgot/iniziale | notebook-1280/chiaro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/forgot |
| C3 | forgot/iniziale | notebook-1280/chiaro | OK | dark assente | dark assente | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | notebook-1280/chiaro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | notebook-1280/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-colonna | forgot/iniziale | notebook-1280/chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/forgot |
| acc-icona | forgot/iniziale | notebook-1280/chiaro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | notebook-1280/chiaro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | notebook-1280/chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | notebook-1280/chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/forgot |
| C2 | forgot/iniziale | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot |
| C3 | forgot/iniziale | tablet-820/chiaro | OK | dark assente | dark assente | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | tablet-820/chiaro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | tablet-820/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-colonna | forgot/iniziale | tablet-820/chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/forgot |
| acc-icona | forgot/iniziale | tablet-820/chiaro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | tablet-820/chiaro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | tablet-820/chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | tablet-820/chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | telefono-360/scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/forgot |
| C3 | forgot/iniziale | telefono-360/scuro | OK | dark presente | dark presente | /app/login/forgot |
| C3-no-lampo | forgot/iniziale | telefono-360/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | telefono-360/scuro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | telefono-360/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-margine | forgot/iniziale | telefono-360/scuro | OK | 16 px | 16 px sotto 768 | /app/login/forgot |
| acc-icona | forgot/iniziale | telefono-360/scuro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | telefono-360/scuro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | telefono-360/scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | telefono-360/scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/forgot |
| C2 | forgot/iniziale | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot |
| C3 | forgot/iniziale | telefono-390/scuro | OK | dark presente | dark presente | /app/login/forgot |
| C3-no-lampo | forgot/iniziale | telefono-390/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | telefono-390/scuro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | telefono-390/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-colonna | forgot/iniziale | telefono-390/scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/forgot |
| acc-margine | forgot/iniziale | telefono-390/scuro | OK | 16 px | 16 px sotto 768 | /app/login/forgot |
| acc-icona | forgot/iniziale | telefono-390/scuro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | telefono-390/scuro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | telefono-390/scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | telefono-390/scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/forgot |
| C2-mouse | forgot/iniziale | notebook-1280/scuro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/forgot |
| C3 | forgot/iniziale | notebook-1280/scuro | OK | dark presente | dark presente | /app/login/forgot |
| C3-no-lampo | forgot/iniziale | notebook-1280/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | notebook-1280/scuro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | notebook-1280/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-colonna | forgot/iniziale | notebook-1280/scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/forgot |
| acc-icona | forgot/iniziale | notebook-1280/scuro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | notebook-1280/scuro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | notebook-1280/scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | notebook-1280/scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/forgot |
| C2 | forgot/iniziale | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot |
| C3 | forgot/iniziale | tablet-820/scuro | OK | dark presente | dark presente | /app/login/forgot |
| C3-no-lampo | forgot/iniziale | tablet-820/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | tablet-820/scuro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | tablet-820/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-colonna | forgot/iniziale | tablet-820/scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/forgot |
| acc-icona | forgot/iniziale | tablet-820/scuro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | tablet-820/scuro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | tablet-820/scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | tablet-820/scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | telefono-360/sistema-chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/forgot |
| C3 | forgot/iniziale | telefono-360/sistema-chiaro | OK | dark assente | dark assente | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | telefono-360/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | telefono-360/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-margine | forgot/iniziale | telefono-360/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/forgot |
| acc-icona | forgot/iniziale | telefono-360/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | telefono-360/sistema-chiaro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | telefono-360/sistema-chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | telefono-360/sistema-chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/forgot |
| C2 | forgot/iniziale | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot |
| C3 | forgot/iniziale | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | telefono-390/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | telefono-390/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-colonna | forgot/iniziale | telefono-390/sistema-chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/forgot |
| acc-margine | forgot/iniziale | telefono-390/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/forgot |
| acc-icona | forgot/iniziale | telefono-390/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | telefono-390/sistema-chiaro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | telefono-390/sistema-chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | telefono-390/sistema-chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/forgot |
| C2-mouse | forgot/iniziale | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/forgot |
| C3 | forgot/iniziale | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | notebook-1280/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | notebook-1280/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-colonna | forgot/iniziale | notebook-1280/sistema-chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/forgot |
| acc-icona | forgot/iniziale | notebook-1280/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | notebook-1280/sistema-chiaro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | notebook-1280/sistema-chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | notebook-1280/sistema-chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/forgot |
| C2 | forgot/iniziale | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot |
| C3 | forgot/iniziale | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | tablet-820/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | tablet-820/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-colonna | forgot/iniziale | tablet-820/sistema-chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/forgot |
| acc-icona | forgot/iniziale | tablet-820/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | tablet-820/sistema-chiaro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | tablet-820/sistema-chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | tablet-820/sistema-chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | telefono-360/sistema-scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/forgot |
| C3 | forgot/iniziale | telefono-360/sistema-scuro | OK | dark presente | dark presente | /app/login/forgot |
| C3-no-lampo | forgot/iniziale | telefono-360/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | telefono-360/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | telefono-360/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-margine | forgot/iniziale | telefono-360/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/forgot |
| acc-icona | forgot/iniziale | telefono-360/sistema-scuro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | telefono-360/sistema-scuro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | telefono-360/sistema-scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | telefono-360/sistema-scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/forgot |
| C2 | forgot/iniziale | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot |
| C3 | forgot/iniziale | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/login/forgot |
| C3-no-lampo | forgot/iniziale | telefono-390/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | telefono-390/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | telefono-390/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-colonna | forgot/iniziale | telefono-390/sistema-scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/forgot |
| acc-margine | forgot/iniziale | telefono-390/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/forgot |
| acc-icona | forgot/iniziale | telefono-390/sistema-scuro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | telefono-390/sistema-scuro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | telefono-390/sistema-scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | telefono-390/sistema-scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/forgot |
| C2-mouse | forgot/iniziale | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/forgot |
| C3 | forgot/iniziale | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/login/forgot |
| C3-no-lampo | forgot/iniziale | notebook-1280/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | notebook-1280/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | notebook-1280/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-colonna | forgot/iniziale | notebook-1280/sistema-scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/forgot |
| acc-icona | forgot/iniziale | notebook-1280/sistema-scuro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | notebook-1280/sistema-scuro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | notebook-1280/sistema-scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | notebook-1280/sistema-scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/iniziale | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/forgot |
| C2 | forgot/iniziale | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot |
| C3 | forgot/iniziale | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/login/forgot |
| C3-no-lampo | forgot/iniziale | tablet-820/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot |
| acc-fuori-shell | forgot/iniziale | tablet-820/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/forgot |
| acc-collegamenti-sottolineati | forgot/iniziale | tablet-820/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot |
| acc-colonna | forgot/iniziale | tablet-820/sistema-scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/forgot |
| acc-icona | forgot/iniziale | tablet-820/sistema-scuro | OK | 40×40 | 40×40 | /app/login/forgot |
| login-testi | forgot/iniziale | tablet-820/sistema-scuro | FALLITO | {"h1":"Password dimenticata","desc":"Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni.","sep":false,"labels":["Email"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/forgot |
| login-titolo-documento | forgot/iniziale | tablet-820/sistema-scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/forgot |
| login-gerarchia | forgot/iniziale | tablet-820/sistema-scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/forgot |
| C1 | forgot/inviata | telefono-360/chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | telefono-360/chiaro | OK | dark assente | dark assente | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | telefono-360/chiaro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | telefono-360/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-margine | forgot/inviata | telefono-360/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | telefono-360/chiaro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C2 | forgot/inviata | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | telefono-390/chiaro | OK | dark assente | dark assente | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | telefono-390/chiaro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | telefono-390/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-colonna | forgot/inviata | telefono-390/chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/forgot?sent=1 |
| acc-margine | forgot/inviata | telefono-390/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | telefono-390/chiaro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C2-mouse | forgot/inviata | notebook-1280/chiaro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | notebook-1280/chiaro | OK | dark assente | dark assente | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | notebook-1280/chiaro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | notebook-1280/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-colonna | forgot/inviata | notebook-1280/chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | notebook-1280/chiaro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C2 | forgot/inviata | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | tablet-820/chiaro | OK | dark assente | dark assente | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | tablet-820/chiaro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | tablet-820/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-colonna | forgot/inviata | tablet-820/chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | tablet-820/chiaro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | telefono-360/scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | telefono-360/scuro | OK | dark presente | dark presente | /app/login/forgot?sent=1 |
| C3-no-lampo | forgot/inviata | telefono-360/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | telefono-360/scuro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | telefono-360/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-margine | forgot/inviata | telefono-360/scuro | OK | 16 px | 16 px sotto 768 | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | telefono-360/scuro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C2 | forgot/inviata | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | telefono-390/scuro | OK | dark presente | dark presente | /app/login/forgot?sent=1 |
| C3-no-lampo | forgot/inviata | telefono-390/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | telefono-390/scuro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | telefono-390/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-colonna | forgot/inviata | telefono-390/scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/forgot?sent=1 |
| acc-margine | forgot/inviata | telefono-390/scuro | OK | 16 px | 16 px sotto 768 | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | telefono-390/scuro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C2-mouse | forgot/inviata | notebook-1280/scuro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | notebook-1280/scuro | OK | dark presente | dark presente | /app/login/forgot?sent=1 |
| C3-no-lampo | forgot/inviata | notebook-1280/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | notebook-1280/scuro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | notebook-1280/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-colonna | forgot/inviata | notebook-1280/scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | notebook-1280/scuro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C2 | forgot/inviata | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | tablet-820/scuro | OK | dark presente | dark presente | /app/login/forgot?sent=1 |
| C3-no-lampo | forgot/inviata | tablet-820/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | tablet-820/scuro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | tablet-820/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-colonna | forgot/inviata | tablet-820/scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | tablet-820/scuro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | telefono-360/sistema-chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | telefono-360/sistema-chiaro | OK | dark assente | dark assente | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | telefono-360/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | telefono-360/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-margine | forgot/inviata | telefono-360/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | telefono-360/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C2 | forgot/inviata | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | telefono-390/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | telefono-390/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-colonna | forgot/inviata | telefono-390/sistema-chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/forgot?sent=1 |
| acc-margine | forgot/inviata | telefono-390/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | telefono-390/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C2-mouse | forgot/inviata | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | notebook-1280/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | notebook-1280/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-colonna | forgot/inviata | notebook-1280/sistema-chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | notebook-1280/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C2 | forgot/inviata | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | tablet-820/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | tablet-820/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-colonna | forgot/inviata | tablet-820/sistema-chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | tablet-820/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | telefono-360/sistema-scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | telefono-360/sistema-scuro | OK | dark presente | dark presente | /app/login/forgot?sent=1 |
| C3-no-lampo | forgot/inviata | telefono-360/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | telefono-360/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | telefono-360/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-margine | forgot/inviata | telefono-360/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | telefono-360/sistema-scuro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C2 | forgot/inviata | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/login/forgot?sent=1 |
| C3-no-lampo | forgot/inviata | telefono-390/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | telefono-390/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | telefono-390/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-colonna | forgot/inviata | telefono-390/sistema-scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/forgot?sent=1 |
| acc-margine | forgot/inviata | telefono-390/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | telefono-390/sistema-scuro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C2-mouse | forgot/inviata | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/login/forgot?sent=1 |
| C3-no-lampo | forgot/inviata | notebook-1280/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | notebook-1280/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | notebook-1280/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-colonna | forgot/inviata | notebook-1280/sistema-scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | notebook-1280/sistema-scuro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| C1 | forgot/inviata | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/forgot?sent=1 |
| C2 | forgot/inviata | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/forgot?sent=1 |
| C3 | forgot/inviata | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/login/forgot?sent=1 |
| C3-no-lampo | forgot/inviata | tablet-820/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/forgot?sent=1 |
| acc-fuori-shell | forgot/inviata | tablet-820/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/forgot?sent=1 |
| acc-collegamenti-sottolineati | forgot/inviata | tablet-820/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/forgot?sent=1 |
| acc-colonna | forgot/inviata | tablet-820/sistema-scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/forgot?sent=1 |
| acc-icona | forgot/inviata | tablet-820/sistema-scuro | OK | 40×40 | 40×40 | /app/login/forgot?sent=1 |
| avviso-forgot-inviata | forgot/inviata | telefono-390/chiaro | OK | testo presente | Se l’indirizzo è in archivio, riceverai … | /app/login/forgot?sent=1 |
| C1 | reset/iniziale | telefono-360/chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C3 | reset/iniziale | telefono-360/chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | telefono-360/chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | telefono-360/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-margine | reset/iniziale | telefono-360/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | telefono-360/chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | telefono-360/chiaro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | telefono-360/chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | telefono-360/chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C2 | reset/iniziale | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova |
| C3 | reset/iniziale | telefono-390/chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | telefono-390/chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | telefono-390/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-colonna | reset/iniziale | telefono-390/chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/reset?token=prova |
| acc-margine | reset/iniziale | telefono-390/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | telefono-390/chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | telefono-390/chiaro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | telefono-390/chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | telefono-390/chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C2-mouse | reset/iniziale | notebook-1280/chiaro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/reset?token=prova |
| C3 | reset/iniziale | notebook-1280/chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | notebook-1280/chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | notebook-1280/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-colonna | reset/iniziale | notebook-1280/chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | notebook-1280/chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | notebook-1280/chiaro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | notebook-1280/chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | notebook-1280/chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C2 | reset/iniziale | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova |
| C3 | reset/iniziale | tablet-820/chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | tablet-820/chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | tablet-820/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-colonna | reset/iniziale | tablet-820/chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | tablet-820/chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | tablet-820/chiaro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | tablet-820/chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | tablet-820/chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | telefono-360/scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C3 | reset/iniziale | telefono-360/scuro | OK | dark presente | dark presente | /app/login/reset?token=prova |
| C3-no-lampo | reset/iniziale | telefono-360/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | telefono-360/scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | telefono-360/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-margine | reset/iniziale | telefono-360/scuro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | telefono-360/scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | telefono-360/scuro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | telefono-360/scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | telefono-360/scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C2 | reset/iniziale | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova |
| C3 | reset/iniziale | telefono-390/scuro | OK | dark presente | dark presente | /app/login/reset?token=prova |
| C3-no-lampo | reset/iniziale | telefono-390/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | telefono-390/scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | telefono-390/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-colonna | reset/iniziale | telefono-390/scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/reset?token=prova |
| acc-margine | reset/iniziale | telefono-390/scuro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | telefono-390/scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | telefono-390/scuro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | telefono-390/scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | telefono-390/scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C2-mouse | reset/iniziale | notebook-1280/scuro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/reset?token=prova |
| C3 | reset/iniziale | notebook-1280/scuro | OK | dark presente | dark presente | /app/login/reset?token=prova |
| C3-no-lampo | reset/iniziale | notebook-1280/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | notebook-1280/scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | notebook-1280/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-colonna | reset/iniziale | notebook-1280/scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | notebook-1280/scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | notebook-1280/scuro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | notebook-1280/scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | notebook-1280/scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C2 | reset/iniziale | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova |
| C3 | reset/iniziale | tablet-820/scuro | OK | dark presente | dark presente | /app/login/reset?token=prova |
| C3-no-lampo | reset/iniziale | tablet-820/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | tablet-820/scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | tablet-820/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-colonna | reset/iniziale | tablet-820/scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | tablet-820/scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | tablet-820/scuro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | tablet-820/scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | tablet-820/scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | telefono-360/sistema-chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C3 | reset/iniziale | telefono-360/sistema-chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | telefono-360/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | telefono-360/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-margine | reset/iniziale | telefono-360/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | telefono-360/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | telefono-360/sistema-chiaro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | telefono-360/sistema-chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | telefono-360/sistema-chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C2 | reset/iniziale | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova |
| C3 | reset/iniziale | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | telefono-390/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | telefono-390/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-colonna | reset/iniziale | telefono-390/sistema-chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/reset?token=prova |
| acc-margine | reset/iniziale | telefono-390/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | telefono-390/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | telefono-390/sistema-chiaro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | telefono-390/sistema-chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | telefono-390/sistema-chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C2-mouse | reset/iniziale | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/reset?token=prova |
| C3 | reset/iniziale | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | notebook-1280/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | notebook-1280/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-colonna | reset/iniziale | notebook-1280/sistema-chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | notebook-1280/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | notebook-1280/sistema-chiaro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | notebook-1280/sistema-chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | notebook-1280/sistema-chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C2 | reset/iniziale | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova |
| C3 | reset/iniziale | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | tablet-820/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | tablet-820/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-colonna | reset/iniziale | tablet-820/sistema-chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | tablet-820/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | tablet-820/sistema-chiaro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | tablet-820/sistema-chiaro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | tablet-820/sistema-chiaro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | telefono-360/sistema-scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C3 | reset/iniziale | telefono-360/sistema-scuro | OK | dark presente | dark presente | /app/login/reset?token=prova |
| C3-no-lampo | reset/iniziale | telefono-360/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | telefono-360/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | telefono-360/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-margine | reset/iniziale | telefono-360/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | telefono-360/sistema-scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | telefono-360/sistema-scuro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | telefono-360/sistema-scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | telefono-360/sistema-scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C2 | reset/iniziale | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova |
| C3 | reset/iniziale | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/login/reset?token=prova |
| C3-no-lampo | reset/iniziale | telefono-390/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | telefono-390/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | telefono-390/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-colonna | reset/iniziale | telefono-390/sistema-scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/reset?token=prova |
| acc-margine | reset/iniziale | telefono-390/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | telefono-390/sistema-scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | telefono-390/sistema-scuro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | telefono-390/sistema-scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | telefono-390/sistema-scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C2-mouse | reset/iniziale | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/reset?token=prova |
| C3 | reset/iniziale | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/login/reset?token=prova |
| C3-no-lampo | reset/iniziale | notebook-1280/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | notebook-1280/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | notebook-1280/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-colonna | reset/iniziale | notebook-1280/sistema-scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | notebook-1280/sistema-scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | notebook-1280/sistema-scuro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | notebook-1280/sistema-scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | notebook-1280/sistema-scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/iniziale | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/reset?token=prova |
| C2 | reset/iniziale | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova |
| C3 | reset/iniziale | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/login/reset?token=prova |
| C3-no-lampo | reset/iniziale | tablet-820/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova |
| acc-fuori-shell | reset/iniziale | tablet-820/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova |
| acc-collegamenti-sottolineati | reset/iniziale | tablet-820/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova |
| acc-colonna | reset/iniziale | tablet-820/sistema-scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/reset?token=prova |
| acc-icona | reset/iniziale | tablet-820/sistema-scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova |
| login-testi | reset/iniziale | tablet-820/sistema-scuro | FALLITO | {"h1":"Nuova password","desc":"Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra.","sep":false,"labels":["Nuova password"],"links":["Torna al login"]} | {"h1":"Area App","desc":"Accedi con Google oppure con email e password.","google":"Accedi con Google","accedi":"Accedi","labels":["Email","Password"],"links":["Password dimenticata?","Torna al sito"]} | /app/login/reset?token=prova |
| login-titolo-documento | reset/iniziale | tablet-820/sistema-scuro | OK | Accesso · Area App | Accesso · Area App | /app/login/reset?token=prova |
| login-gerarchia | reset/iniziale | tablet-820/sistema-scuro | FALLITO | elementi non trovati | sfondi Google e Accedi diversi; Google ≈ primary | /app/login/reset?token=prova |
| C1 | reset/link-scaduto | telefono-360/chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | telefono-360/chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | telefono-360/chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | telefono-360/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-margine | reset/link-scaduto | telefono-360/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | telefono-360/chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C2 | reset/link-scaduto | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | telefono-390/chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | telefono-390/chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | telefono-390/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-colonna | reset/link-scaduto | telefono-390/chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/reset?token=prova&resetFailed=1 |
| acc-margine | reset/link-scaduto | telefono-390/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | telefono-390/chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C2-mouse | reset/link-scaduto | notebook-1280/chiaro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | notebook-1280/chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | notebook-1280/chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | notebook-1280/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-colonna | reset/link-scaduto | notebook-1280/chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | notebook-1280/chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C2 | reset/link-scaduto | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | tablet-820/chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | tablet-820/chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | tablet-820/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-colonna | reset/link-scaduto | tablet-820/chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | tablet-820/chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | telefono-360/scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | telefono-360/scuro | OK | dark presente | dark presente | /app/login/reset?token=prova&resetFailed=1 |
| C3-no-lampo | reset/link-scaduto | telefono-360/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | telefono-360/scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | telefono-360/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-margine | reset/link-scaduto | telefono-360/scuro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | telefono-360/scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C2 | reset/link-scaduto | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | telefono-390/scuro | OK | dark presente | dark presente | /app/login/reset?token=prova&resetFailed=1 |
| C3-no-lampo | reset/link-scaduto | telefono-390/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | telefono-390/scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | telefono-390/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-colonna | reset/link-scaduto | telefono-390/scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/reset?token=prova&resetFailed=1 |
| acc-margine | reset/link-scaduto | telefono-390/scuro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | telefono-390/scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C2-mouse | reset/link-scaduto | notebook-1280/scuro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | notebook-1280/scuro | OK | dark presente | dark presente | /app/login/reset?token=prova&resetFailed=1 |
| C3-no-lampo | reset/link-scaduto | notebook-1280/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | notebook-1280/scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | notebook-1280/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-colonna | reset/link-scaduto | notebook-1280/scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | notebook-1280/scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C2 | reset/link-scaduto | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | tablet-820/scuro | OK | dark presente | dark presente | /app/login/reset?token=prova&resetFailed=1 |
| C3-no-lampo | reset/link-scaduto | tablet-820/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | tablet-820/scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | tablet-820/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-colonna | reset/link-scaduto | tablet-820/scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | tablet-820/scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | telefono-360/sistema-chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | telefono-360/sistema-chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | telefono-360/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | telefono-360/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-margine | reset/link-scaduto | telefono-360/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | telefono-360/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C2 | reset/link-scaduto | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | telefono-390/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | telefono-390/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-colonna | reset/link-scaduto | telefono-390/sistema-chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/reset?token=prova&resetFailed=1 |
| acc-margine | reset/link-scaduto | telefono-390/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | telefono-390/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C2-mouse | reset/link-scaduto | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | notebook-1280/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | notebook-1280/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-colonna | reset/link-scaduto | notebook-1280/sistema-chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | notebook-1280/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C2 | reset/link-scaduto | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | tablet-820/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | tablet-820/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-colonna | reset/link-scaduto | tablet-820/sistema-chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | tablet-820/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | telefono-360/sistema-scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | telefono-360/sistema-scuro | OK | dark presente | dark presente | /app/login/reset?token=prova&resetFailed=1 |
| C3-no-lampo | reset/link-scaduto | telefono-360/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | telefono-360/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | telefono-360/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-margine | reset/link-scaduto | telefono-360/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | telefono-360/sistema-scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C2 | reset/link-scaduto | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/login/reset?token=prova&resetFailed=1 |
| C3-no-lampo | reset/link-scaduto | telefono-390/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | telefono-390/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | telefono-390/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-colonna | reset/link-scaduto | telefono-390/sistema-scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/reset?token=prova&resetFailed=1 |
| acc-margine | reset/link-scaduto | telefono-390/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | telefono-390/sistema-scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C2-mouse | reset/link-scaduto | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 22 px (tutte: 32,36,22…) | altezze in [28, 48] px | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/login/reset?token=prova&resetFailed=1 |
| C3-no-lampo | reset/link-scaduto | notebook-1280/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | notebook-1280/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | notebook-1280/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-colonna | reset/link-scaduto | notebook-1280/sistema-scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | notebook-1280/sistema-scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/link-scaduto | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/reset?token=prova&resetFailed=1 |
| C2 | reset/link-scaduto | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset?token=prova&resetFailed=1 |
| C3 | reset/link-scaduto | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/login/reset?token=prova&resetFailed=1 |
| C3-no-lampo | reset/link-scaduto | tablet-820/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset?token=prova&resetFailed=1 |
| acc-fuori-shell | reset/link-scaduto | tablet-820/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/reset?token=prova&resetFailed=1 |
| acc-collegamenti-sottolineati | reset/link-scaduto | tablet-820/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset?token=prova&resetFailed=1 |
| acc-colonna | reset/link-scaduto | tablet-820/sistema-scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/reset?token=prova&resetFailed=1 |
| acc-icona | reset/link-scaduto | tablet-820/sistema-scuro | OK | 40×40 | 40×40 | /app/login/reset?token=prova&resetFailed=1 |
| avviso-reset-link-scaduto | reset/link-scaduto | telefono-390/chiaro | OK | testo presente | Il link non è valido o è scaduto. Se rit… | /app/login/reset?token=prova&resetFailed=1 |
| C1 | reset/senza-token | telefono-360/chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/reset |
| C3 | reset/senza-token | telefono-360/chiaro | OK | dark assente | dark assente | /app/login/reset |
| acc-fuori-shell | reset/senza-token | telefono-360/chiaro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | telefono-360/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-margine | reset/senza-token | telefono-360/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/reset |
| acc-icona | reset/senza-token | telefono-360/chiaro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/reset |
| C2 | reset/senza-token | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset |
| C3 | reset/senza-token | telefono-390/chiaro | OK | dark assente | dark assente | /app/login/reset |
| acc-fuori-shell | reset/senza-token | telefono-390/chiaro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | telefono-390/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-colonna | reset/senza-token | telefono-390/chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/reset |
| acc-margine | reset/senza-token | telefono-390/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/reset |
| acc-icona | reset/senza-token | telefono-390/chiaro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/reset |
| C2-mouse | reset/senza-token | notebook-1280/chiaro | AVVISO | fuori intervallo: 22 px (tutte: 22…) | altezze in [28, 48] px | /app/login/reset |
| C3 | reset/senza-token | notebook-1280/chiaro | OK | dark assente | dark assente | /app/login/reset |
| acc-fuori-shell | reset/senza-token | notebook-1280/chiaro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | notebook-1280/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-colonna | reset/senza-token | notebook-1280/chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/reset |
| acc-icona | reset/senza-token | notebook-1280/chiaro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/reset |
| C2 | reset/senza-token | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset |
| C3 | reset/senza-token | tablet-820/chiaro | OK | dark assente | dark assente | /app/login/reset |
| acc-fuori-shell | reset/senza-token | tablet-820/chiaro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | tablet-820/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-colonna | reset/senza-token | tablet-820/chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/reset |
| acc-icona | reset/senza-token | tablet-820/chiaro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | telefono-360/scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/reset |
| C3 | reset/senza-token | telefono-360/scuro | OK | dark presente | dark presente | /app/login/reset |
| C3-no-lampo | reset/senza-token | telefono-360/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset |
| acc-fuori-shell | reset/senza-token | telefono-360/scuro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | telefono-360/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-margine | reset/senza-token | telefono-360/scuro | OK | 16 px | 16 px sotto 768 | /app/login/reset |
| acc-icona | reset/senza-token | telefono-360/scuro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/reset |
| C2 | reset/senza-token | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset |
| C3 | reset/senza-token | telefono-390/scuro | OK | dark presente | dark presente | /app/login/reset |
| C3-no-lampo | reset/senza-token | telefono-390/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset |
| acc-fuori-shell | reset/senza-token | telefono-390/scuro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | telefono-390/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-colonna | reset/senza-token | telefono-390/scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/reset |
| acc-margine | reset/senza-token | telefono-390/scuro | OK | 16 px | 16 px sotto 768 | /app/login/reset |
| acc-icona | reset/senza-token | telefono-390/scuro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/reset |
| C2-mouse | reset/senza-token | notebook-1280/scuro | AVVISO | fuori intervallo: 22 px (tutte: 22…) | altezze in [28, 48] px | /app/login/reset |
| C3 | reset/senza-token | notebook-1280/scuro | OK | dark presente | dark presente | /app/login/reset |
| C3-no-lampo | reset/senza-token | notebook-1280/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset |
| acc-fuori-shell | reset/senza-token | notebook-1280/scuro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | notebook-1280/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-colonna | reset/senza-token | notebook-1280/scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/reset |
| acc-icona | reset/senza-token | notebook-1280/scuro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/reset |
| C2 | reset/senza-token | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset |
| C3 | reset/senza-token | tablet-820/scuro | OK | dark presente | dark presente | /app/login/reset |
| C3-no-lampo | reset/senza-token | tablet-820/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset |
| acc-fuori-shell | reset/senza-token | tablet-820/scuro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | tablet-820/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-colonna | reset/senza-token | tablet-820/scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/reset |
| acc-icona | reset/senza-token | tablet-820/scuro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | telefono-360/sistema-chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/reset |
| C3 | reset/senza-token | telefono-360/sistema-chiaro | OK | dark assente | dark assente | /app/login/reset |
| acc-fuori-shell | reset/senza-token | telefono-360/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | telefono-360/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-margine | reset/senza-token | telefono-360/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/reset |
| acc-icona | reset/senza-token | telefono-360/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/reset |
| C2 | reset/senza-token | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset |
| C3 | reset/senza-token | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/login/reset |
| acc-fuori-shell | reset/senza-token | telefono-390/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | telefono-390/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-colonna | reset/senza-token | telefono-390/sistema-chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/reset |
| acc-margine | reset/senza-token | telefono-390/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/reset |
| acc-icona | reset/senza-token | telefono-390/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/reset |
| C2-mouse | reset/senza-token | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 22 px (tutte: 22…) | altezze in [28, 48] px | /app/login/reset |
| C3 | reset/senza-token | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/login/reset |
| acc-fuori-shell | reset/senza-token | notebook-1280/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | notebook-1280/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-colonna | reset/senza-token | notebook-1280/sistema-chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/reset |
| acc-icona | reset/senza-token | notebook-1280/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/reset |
| C2 | reset/senza-token | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset |
| C3 | reset/senza-token | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/login/reset |
| acc-fuori-shell | reset/senza-token | tablet-820/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | tablet-820/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-colonna | reset/senza-token | tablet-820/sistema-chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/reset |
| acc-icona | reset/senza-token | tablet-820/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | telefono-360/sistema-scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/reset |
| C3 | reset/senza-token | telefono-360/sistema-scuro | OK | dark presente | dark presente | /app/login/reset |
| C3-no-lampo | reset/senza-token | telefono-360/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset |
| acc-fuori-shell | reset/senza-token | telefono-360/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | telefono-360/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-margine | reset/senza-token | telefono-360/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/reset |
| acc-icona | reset/senza-token | telefono-360/sistema-scuro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/reset |
| C2 | reset/senza-token | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset |
| C3 | reset/senza-token | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/login/reset |
| C3-no-lampo | reset/senza-token | telefono-390/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset |
| acc-fuori-shell | reset/senza-token | telefono-390/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | telefono-390/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-colonna | reset/senza-token | telefono-390/sistema-scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/reset |
| acc-margine | reset/senza-token | telefono-390/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/reset |
| acc-icona | reset/senza-token | telefono-390/sistema-scuro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/reset |
| C2-mouse | reset/senza-token | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 22 px (tutte: 22…) | altezze in [28, 48] px | /app/login/reset |
| C3 | reset/senza-token | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/login/reset |
| C3-no-lampo | reset/senza-token | notebook-1280/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset |
| acc-fuori-shell | reset/senza-token | notebook-1280/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | notebook-1280/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-colonna | reset/senza-token | notebook-1280/sistema-scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/reset |
| acc-icona | reset/senza-token | notebook-1280/sistema-scuro | OK | 40×40 | 40×40 | /app/login/reset |
| C1 | reset/senza-token | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/reset |
| C2 | reset/senza-token | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/reset |
| C3 | reset/senza-token | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/login/reset |
| C3-no-lampo | reset/senza-token | tablet-820/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/reset |
| acc-fuori-shell | reset/senza-token | tablet-820/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/reset |
| acc-collegamenti-sottolineati | reset/senza-token | tablet-820/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/reset |
| acc-colonna | reset/senza-token | tablet-820/sistema-scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/reset |
| acc-icona | reset/senza-token | tablet-820/sistema-scuro | OK | 40×40 | 40×40 | /app/login/reset |
| avviso-reset-senza-token | reset/senza-token | telefono-390/chiaro | OK | testo presente | Il link non è valido o è scaduto. Se rit… | /app/login/reset |
| C1 | verify/senza-token | telefono-360/chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/verify |
| C3 | verify/senza-token | telefono-360/chiaro | OK | dark assente | dark assente | /app/login/verify |
| acc-fuori-shell | verify/senza-token | telefono-360/chiaro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | telefono-360/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-margine | verify/senza-token | telefono-360/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/verify |
| acc-icona | verify/senza-token | telefono-360/chiaro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/verify |
| C2 | verify/senza-token | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify |
| C3 | verify/senza-token | telefono-390/chiaro | OK | dark assente | dark assente | /app/login/verify |
| acc-fuori-shell | verify/senza-token | telefono-390/chiaro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | telefono-390/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-colonna | verify/senza-token | telefono-390/chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/verify |
| acc-margine | verify/senza-token | telefono-390/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/verify |
| acc-icona | verify/senza-token | telefono-390/chiaro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/verify |
| C2-mouse | verify/senza-token | notebook-1280/chiaro | AVVISO | fuori intervallo: 22 px (tutte: 22…) | altezze in [28, 48] px | /app/login/verify |
| C3 | verify/senza-token | notebook-1280/chiaro | OK | dark assente | dark assente | /app/login/verify |
| acc-fuori-shell | verify/senza-token | notebook-1280/chiaro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | notebook-1280/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-colonna | verify/senza-token | notebook-1280/chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/verify |
| acc-icona | verify/senza-token | notebook-1280/chiaro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/verify |
| C2 | verify/senza-token | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify |
| C3 | verify/senza-token | tablet-820/chiaro | OK | dark assente | dark assente | /app/login/verify |
| acc-fuori-shell | verify/senza-token | tablet-820/chiaro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | tablet-820/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-colonna | verify/senza-token | tablet-820/chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/verify |
| acc-icona | verify/senza-token | tablet-820/chiaro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | telefono-360/scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/verify |
| C3 | verify/senza-token | telefono-360/scuro | OK | dark presente | dark presente | /app/login/verify |
| C3-no-lampo | verify/senza-token | telefono-360/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify |
| acc-fuori-shell | verify/senza-token | telefono-360/scuro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | telefono-360/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-margine | verify/senza-token | telefono-360/scuro | OK | 16 px | 16 px sotto 768 | /app/login/verify |
| acc-icona | verify/senza-token | telefono-360/scuro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/verify |
| C2 | verify/senza-token | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify |
| C3 | verify/senza-token | telefono-390/scuro | OK | dark presente | dark presente | /app/login/verify |
| C3-no-lampo | verify/senza-token | telefono-390/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify |
| acc-fuori-shell | verify/senza-token | telefono-390/scuro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | telefono-390/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-colonna | verify/senza-token | telefono-390/scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/verify |
| acc-margine | verify/senza-token | telefono-390/scuro | OK | 16 px | 16 px sotto 768 | /app/login/verify |
| acc-icona | verify/senza-token | telefono-390/scuro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/verify |
| C2-mouse | verify/senza-token | notebook-1280/scuro | AVVISO | fuori intervallo: 22 px (tutte: 22…) | altezze in [28, 48] px | /app/login/verify |
| C3 | verify/senza-token | notebook-1280/scuro | OK | dark presente | dark presente | /app/login/verify |
| C3-no-lampo | verify/senza-token | notebook-1280/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify |
| acc-fuori-shell | verify/senza-token | notebook-1280/scuro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | notebook-1280/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-colonna | verify/senza-token | notebook-1280/scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/verify |
| acc-icona | verify/senza-token | notebook-1280/scuro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/verify |
| C2 | verify/senza-token | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify |
| C3 | verify/senza-token | tablet-820/scuro | OK | dark presente | dark presente | /app/login/verify |
| C3-no-lampo | verify/senza-token | tablet-820/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify |
| acc-fuori-shell | verify/senza-token | tablet-820/scuro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | tablet-820/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-colonna | verify/senza-token | tablet-820/scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/verify |
| acc-icona | verify/senza-token | tablet-820/scuro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | telefono-360/sistema-chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/verify |
| C3 | verify/senza-token | telefono-360/sistema-chiaro | OK | dark assente | dark assente | /app/login/verify |
| acc-fuori-shell | verify/senza-token | telefono-360/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | telefono-360/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-margine | verify/senza-token | telefono-360/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/verify |
| acc-icona | verify/senza-token | telefono-360/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/verify |
| C2 | verify/senza-token | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify |
| C3 | verify/senza-token | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/login/verify |
| acc-fuori-shell | verify/senza-token | telefono-390/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | telefono-390/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-colonna | verify/senza-token | telefono-390/sistema-chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/verify |
| acc-margine | verify/senza-token | telefono-390/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/verify |
| acc-icona | verify/senza-token | telefono-390/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/verify |
| C2-mouse | verify/senza-token | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 22 px (tutte: 22…) | altezze in [28, 48] px | /app/login/verify |
| C3 | verify/senza-token | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/login/verify |
| acc-fuori-shell | verify/senza-token | notebook-1280/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | notebook-1280/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-colonna | verify/senza-token | notebook-1280/sistema-chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/verify |
| acc-icona | verify/senza-token | notebook-1280/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/verify |
| C2 | verify/senza-token | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify |
| C3 | verify/senza-token | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/login/verify |
| acc-fuori-shell | verify/senza-token | tablet-820/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | tablet-820/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-colonna | verify/senza-token | tablet-820/sistema-chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/verify |
| acc-icona | verify/senza-token | tablet-820/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | telefono-360/sistema-scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/verify |
| C3 | verify/senza-token | telefono-360/sistema-scuro | OK | dark presente | dark presente | /app/login/verify |
| C3-no-lampo | verify/senza-token | telefono-360/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify |
| acc-fuori-shell | verify/senza-token | telefono-360/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | telefono-360/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-margine | verify/senza-token | telefono-360/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/verify |
| acc-icona | verify/senza-token | telefono-360/sistema-scuro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/verify |
| C2 | verify/senza-token | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify |
| C3 | verify/senza-token | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/login/verify |
| C3-no-lampo | verify/senza-token | telefono-390/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify |
| acc-fuori-shell | verify/senza-token | telefono-390/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | telefono-390/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-colonna | verify/senza-token | telefono-390/sistema-scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/verify |
| acc-margine | verify/senza-token | telefono-390/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/verify |
| acc-icona | verify/senza-token | telefono-390/sistema-scuro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/verify |
| C2-mouse | verify/senza-token | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 22 px (tutte: 22…) | altezze in [28, 48] px | /app/login/verify |
| C3 | verify/senza-token | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/login/verify |
| C3-no-lampo | verify/senza-token | notebook-1280/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify |
| acc-fuori-shell | verify/senza-token | notebook-1280/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | notebook-1280/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-colonna | verify/senza-token | notebook-1280/sistema-scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/verify |
| acc-icona | verify/senza-token | notebook-1280/sistema-scuro | OK | 40×40 | 40×40 | /app/login/verify |
| C1 | verify/senza-token | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/verify |
| C2 | verify/senza-token | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify |
| C3 | verify/senza-token | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/login/verify |
| C3-no-lampo | verify/senza-token | tablet-820/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify |
| acc-fuori-shell | verify/senza-token | tablet-820/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/verify |
| acc-collegamenti-sottolineati | verify/senza-token | tablet-820/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify |
| acc-colonna | verify/senza-token | tablet-820/sistema-scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/verify |
| acc-icona | verify/senza-token | tablet-820/sistema-scuro | OK | 40×40 | 40×40 | /app/login/verify |
| avviso-verify-senza-token | verify/senza-token | telefono-390/chiaro | OK | testo presente | Il link non è valido o è già stato usato… | /app/login/verify |
| C1 | verify/token-non-valido | telefono-360/chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | telefono-360/chiaro | OK | dark assente | dark assente | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | telefono-360/chiaro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | telefono-360/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-margine | verify/token-non-valido | telefono-360/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | telefono-360/chiaro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C2 | verify/token-non-valido | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | telefono-390/chiaro | OK | dark assente | dark assente | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | telefono-390/chiaro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | telefono-390/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-colonna | verify/token-non-valido | telefono-390/chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/verify?token=prova |
| acc-margine | verify/token-non-valido | telefono-390/chiaro | OK | 16 px | 16 px sotto 768 | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | telefono-390/chiaro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C2-mouse | verify/token-non-valido | notebook-1280/chiaro | AVVISO | fuori intervallo: 22 px (tutte: 22…) | altezze in [28, 48] px | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | notebook-1280/chiaro | OK | dark assente | dark assente | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | notebook-1280/chiaro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | notebook-1280/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-colonna | verify/token-non-valido | notebook-1280/chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | notebook-1280/chiaro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C2 | verify/token-non-valido | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | tablet-820/chiaro | OK | dark assente | dark assente | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | tablet-820/chiaro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | tablet-820/chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-colonna | verify/token-non-valido | tablet-820/chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | tablet-820/chiaro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | telefono-360/scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | telefono-360/scuro | OK | dark presente | dark presente | /app/login/verify?token=prova |
| C3-no-lampo | verify/token-non-valido | telefono-360/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | telefono-360/scuro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | telefono-360/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-margine | verify/token-non-valido | telefono-360/scuro | OK | 16 px | 16 px sotto 768 | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | telefono-360/scuro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C2 | verify/token-non-valido | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | telefono-390/scuro | OK | dark presente | dark presente | /app/login/verify?token=prova |
| C3-no-lampo | verify/token-non-valido | telefono-390/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | telefono-390/scuro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | telefono-390/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-colonna | verify/token-non-valido | telefono-390/scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/verify?token=prova |
| acc-margine | verify/token-non-valido | telefono-390/scuro | OK | 16 px | 16 px sotto 768 | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | telefono-390/scuro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C2-mouse | verify/token-non-valido | notebook-1280/scuro | AVVISO | fuori intervallo: 22 px (tutte: 22…) | altezze in [28, 48] px | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | notebook-1280/scuro | OK | dark presente | dark presente | /app/login/verify?token=prova |
| C3-no-lampo | verify/token-non-valido | notebook-1280/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | notebook-1280/scuro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | notebook-1280/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-colonna | verify/token-non-valido | notebook-1280/scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | notebook-1280/scuro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C2 | verify/token-non-valido | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | tablet-820/scuro | OK | dark presente | dark presente | /app/login/verify?token=prova |
| C3-no-lampo | verify/token-non-valido | tablet-820/scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | tablet-820/scuro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | tablet-820/scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-colonna | verify/token-non-valido | tablet-820/scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | tablet-820/scuro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | telefono-360/sistema-chiaro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | telefono-360/sistema-chiaro | OK | dark assente | dark assente | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | telefono-360/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | telefono-360/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-margine | verify/token-non-valido | telefono-360/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | telefono-360/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C2 | verify/token-non-valido | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | telefono-390/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | telefono-390/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-colonna | verify/token-non-valido | telefono-390/sistema-chiaro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/verify?token=prova |
| acc-margine | verify/token-non-valido | telefono-390/sistema-chiaro | OK | 16 px | 16 px sotto 768 | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | telefono-390/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C2-mouse | verify/token-non-valido | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 22 px (tutte: 22…) | altezze in [28, 48] px | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | notebook-1280/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | notebook-1280/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-colonna | verify/token-non-valido | notebook-1280/sistema-chiaro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | notebook-1280/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C2 | verify/token-non-valido | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | tablet-820/sistema-chiaro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | tablet-820/sistema-chiaro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-colonna | verify/token-non-valido | tablet-820/sistema-chiaro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | tablet-820/sistema-chiaro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | telefono-360/sistema-scuro | OK | 360 vs innerWidth 360 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | telefono-360/sistema-scuro | OK | dark presente | dark presente | /app/login/verify?token=prova |
| C3-no-lampo | verify/token-non-valido | telefono-360/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | telefono-360/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | telefono-360/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-margine | verify/token-non-valido | telefono-360/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | telefono-360/sistema-scuro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C2 | verify/token-non-valido | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/login/verify?token=prova |
| C3-no-lampo | verify/token-non-valido | telefono-390/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | telefono-390/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | telefono-390/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-colonna | verify/token-non-valido | telefono-390/sistema-scuro | OK | 358 px | 358 px (min(384, 390-2*16)) | /app/login/verify?token=prova |
| acc-margine | verify/token-non-valido | telefono-390/sistema-scuro | OK | 16 px | 16 px sotto 768 | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | telefono-390/sistema-scuro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C2-mouse | verify/token-non-valido | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 22 px (tutte: 22…) | altezze in [28, 48] px | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/login/verify?token=prova |
| C3-no-lampo | verify/token-non-valido | notebook-1280/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | notebook-1280/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | notebook-1280/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-colonna | verify/token-non-valido | notebook-1280/sistema-scuro | OK | 384 px | 384 px (min(384, 1280-2*24)) | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | notebook-1280/sistema-scuro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| C1 | verify/token-non-valido | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/login/verify?token=prova |
| C2 | verify/token-non-valido | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/login/verify?token=prova |
| C3 | verify/token-non-valido | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/login/verify?token=prova |
| C3-no-lampo | verify/token-non-valido | tablet-820/sistema-scuro | OK | nessuna mutazione dopo load | nessuna variazione classe <html> dopo DOMContentLoaded | /app/login/verify?token=prova |
| acc-fuori-shell | verify/token-non-valido | tablet-820/sistema-scuro | OK | 0 elementi shell | 0 | /app/login/verify?token=prova |
| acc-collegamenti-sottolineati | verify/token-non-valido | tablet-820/sistema-scuro | OK | underline | underline su tutti i collegamenti sotto la scheda | /app/login/verify?token=prova |
| acc-colonna | verify/token-non-valido | tablet-820/sistema-scuro | OK | 384 px | 384 px (min(384, 820-2*24)) | /app/login/verify?token=prova |
| acc-icona | verify/token-non-valido | tablet-820/sistema-scuro | OK | 40×40 | 40×40 | /app/login/verify?token=prova |
| avviso-verify-token-non-valido | verify/token-non-valido | telefono-390/chiaro | OK | testo presente | Il link non è valido o è già stato usato… | /app/login/verify?token=prova |
| verify/link-valido | — | — | NON PROVATO | — | — | facoltativo: serve un utente di prova con token di attivazione vero, che si consuma una volta sola; se non si riesce a ottenerlo, NON PROVATO |
| reset-senza-token-vuoto | reset/senza-token | telefono-390/chiaro | OK | 0 | 0 | /app/login/reset |
| C3-cambio-sistema | login | notebook-1280/sistema | OK | dopo emulate dark: true; con cookie light ignore OS: true | dark con system+OS scuro; no cambio con cookie light/dark fisso | emulateMedia prefers-color-scheme |
| g1 | guardia /app | notebook-1280/chiaro | OK | http://localhost:3000/app/login | /app/login | status 200 |
| g2 | guardia /app/menu | notebook-1280/chiaro | OK | http://localhost:3000/app/login | /app/login | status 200 |
| g2 | guardia /app/hours | notebook-1280/chiaro | OK | http://localhost:3000/app/login | /app/login | status 200 |
| g2 | guardia /app/reservations | notebook-1280/chiaro | OK | http://localhost:3000/app/login | /app/login | status 200 |
| C1 | shell/home | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app |
| C2 | shell/home | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app |
| C2 | shell/home (menu aperto) | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/home (menu utente) | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/home | telefono-390/chiaro | OK | dark assente | dark assente | /app |
| home-testi | shell/home | telefono-390/chiaro | FALLITO | {"h1":"Area App","desc":"Scegli una sezione.","cards":[{"href":"/app/reservations"},{"href":"/app/menu"},{"href":"/app/hours"}]} | [{"titolo":"Prenotazioni","descrizione":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","descrizione":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","descrizione":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}] | /app |
| home-colonne | shell/home | telefono-390/chiaro | OK | 1 colonne | 1 | /app |
| shell-barra-alta | shell/home | telefono-390/chiaro | OK | 56 px | 56 px | /app |
| shell-nomi-accessibili | shell/home | telefono-390/chiaro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app |
| C2-mouse | shell/home | notebook-1280/chiaro | AVVISO | fuori intervallo: 84, 84, 84 px (tutte: 48,32,32,32,48,28,84,84,84…) | altezze in [28, 48] px | /app |
| C3 | shell/home | notebook-1280/chiaro | OK | dark assente | dark assente | /app |
| home-testi | shell/home | notebook-1280/chiaro | FALLITO | {"h1":"Area App","desc":"Scegli una sezione.","cards":[{"href":"/app/reservations"},{"href":"/app/menu"},{"href":"/app/hours"}]} | [{"titolo":"Prenotazioni","descrizione":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","descrizione":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","descrizione":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}] | /app |
| home-colonne | shell/home | notebook-1280/chiaro | OK | 3 colonne | 3 | /app |
| shell-barra-alta | shell/home | notebook-1280/chiaro | OK | 56 px | 56 px | /app |
| shell-nomi-accessibili | shell/home | notebook-1280/chiaro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | soglia-767/chiaro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app |
| C3 | shell/home | soglia-767/chiaro | OK | dark assente | dark assente | /app |
| home-testi | shell/home | soglia-767/chiaro | FALLITO | {"h1":"Area App","desc":"Scegli una sezione.","cards":[{"href":"/app/reservations"},{"href":"/app/menu"},{"href":"/app/hours"}]} | [{"titolo":"Prenotazioni","descrizione":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","descrizione":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","descrizione":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}] | /app |
| home-colonne | shell/home | soglia-767/chiaro | OK | 1 colonne | 1 | /app |
| shell-nomi-accessibili | shell/home | soglia-767/chiaro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | soglia-768/chiaro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app |
| C3 | shell/home | soglia-768/chiaro | OK | dark assente | dark assente | /app |
| home-testi | shell/home | soglia-768/chiaro | FALLITO | {"h1":"Area App","desc":"Scegli una sezione.","cards":[{"href":"/app/reservations"},{"href":"/app/menu"},{"href":"/app/hours"}]} | [{"titolo":"Prenotazioni","descrizione":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","descrizione":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","descrizione":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}] | /app |
| home-colonne | shell/home | soglia-768/chiaro | OK | 2 colonne | 2 | /app |
| shell-barra-alta | shell/home | soglia-768/chiaro | OK | 56 px | 56 px | /app |
| shell-nomi-accessibili | shell/home | soglia-768/chiaro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app |
| C2 | shell/home | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app |
| C2 | shell/home (menu utente) | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/home | tablet-820/chiaro | OK | dark assente | dark assente | /app |
| home-testi | shell/home | tablet-820/chiaro | FALLITO | {"h1":"Area App","desc":"Scegli una sezione.","cards":[{"href":"/app/reservations"},{"href":"/app/menu"},{"href":"/app/hours"}]} | [{"titolo":"Prenotazioni","descrizione":"Elenco, eccezioni giorno, impostazioni","href":"/app/reservations"},{"titolo":"Menù","descrizione":"Piatti, vini, bevande, distillati, menù fissi","href":"/app/menu"},{"titolo":"Orari","descrizione":"Ristorante, B&B, giorni di riposo, chiusure","href":"/app/hours"}] | /app |
| home-colonne | shell/home | tablet-820/chiaro | OK | 2 colonne | 2 | /app |
| shell-nomi-accessibili | shell/home | tablet-820/chiaro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app |
| C2 | shell/home | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app |
| C2 | shell/home (menu aperto) | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/home (menu utente) | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/home | telefono-390/scuro | OK | dark presente | dark presente | /app |
| shell-barra-alta | shell/home | telefono-390/scuro | OK | 56 px | 56 px | /app |
| shell-nomi-accessibili | shell/home | telefono-390/scuro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app |
| C2-mouse | shell/home | notebook-1280/scuro | AVVISO | fuori intervallo: 84, 84, 84 px (tutte: 48,32,32,32,48,28,84,84,84…) | altezze in [28, 48] px | /app |
| C3 | shell/home | notebook-1280/scuro | OK | dark presente | dark presente | /app |
| shell-barra-alta | shell/home | notebook-1280/scuro | OK | 56 px | 56 px | /app |
| shell-nomi-accessibili | shell/home | notebook-1280/scuro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | soglia-767/scuro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app |
| C3 | shell/home | soglia-767/scuro | OK | dark presente | dark presente | /app |
| shell-nomi-accessibili | shell/home | soglia-767/scuro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | soglia-768/scuro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app |
| C3 | shell/home | soglia-768/scuro | OK | dark presente | dark presente | /app |
| shell-barra-alta | shell/home | soglia-768/scuro | OK | 56 px | 56 px | /app |
| shell-nomi-accessibili | shell/home | soglia-768/scuro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app |
| C2 | shell/home | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app |
| C2 | shell/home (menu utente) | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/home | tablet-820/scuro | OK | dark presente | dark presente | /app |
| shell-nomi-accessibili | shell/home | tablet-820/scuro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app |
| C2 | shell/home | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app |
| C2 | shell/home (menu aperto) | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/home (menu utente) | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/home | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app |
| shell-barra-alta | shell/home | telefono-390/sistema-chiaro | OK | 56 px | 56 px | /app |
| shell-nomi-accessibili | shell/home | telefono-390/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app |
| C2-mouse | shell/home | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 84, 84, 84 px (tutte: 48,32,32,32,48,28,84,84,84…) | altezze in [28, 48] px | /app |
| C3 | shell/home | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app |
| shell-barra-alta | shell/home | notebook-1280/sistema-chiaro | OK | 56 px | 56 px | /app |
| shell-nomi-accessibili | shell/home | notebook-1280/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | soglia-767/sistema-chiaro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app |
| C3 | shell/home | soglia-767/sistema-chiaro | OK | dark assente | dark assente | /app |
| shell-nomi-accessibili | shell/home | soglia-767/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | soglia-768/sistema-chiaro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app |
| C3 | shell/home | soglia-768/sistema-chiaro | OK | dark assente | dark assente | /app |
| shell-barra-alta | shell/home | soglia-768/sistema-chiaro | OK | 56 px | 56 px | /app |
| shell-nomi-accessibili | shell/home | soglia-768/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app |
| C2 | shell/home | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app |
| C2 | shell/home (menu utente) | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/home | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app |
| shell-nomi-accessibili | shell/home | tablet-820/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app |
| C2 | shell/home | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app |
| C2 | shell/home (menu aperto) | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/home (menu utente) | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/home | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app |
| shell-barra-alta | shell/home | telefono-390/sistema-scuro | OK | 56 px | 56 px | /app |
| shell-nomi-accessibili | shell/home | telefono-390/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app |
| C2-mouse | shell/home | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 84, 84, 84 px (tutte: 48,32,32,32,48,28,84,84,84…) | altezze in [28, 48] px | /app |
| C3 | shell/home | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app |
| shell-barra-alta | shell/home | notebook-1280/sistema-scuro | OK | 56 px | 56 px | /app |
| shell-nomi-accessibili | shell/home | notebook-1280/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | soglia-767/sistema-scuro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app |
| C3 | shell/home | soglia-767/sistema-scuro | OK | dark presente | dark presente | /app |
| shell-nomi-accessibili | shell/home | soglia-767/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | soglia-768/sistema-scuro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app |
| C3 | shell/home | soglia-768/sistema-scuro | OK | dark presente | dark presente | /app |
| shell-barra-alta | shell/home | soglia-768/sistema-scuro | OK | 56 px | 56 px | /app |
| shell-nomi-accessibili | shell/home | soglia-768/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/home | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app |
| C2 | shell/home | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app |
| C2 | shell/home (menu utente) | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/home | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app |
| shell-nomi-accessibili | shell/home | tablet-820/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app |
| C1 | shell/segnaposto-menu | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/menu |
| C2 | shell/segnaposto-menu | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/menu |
| C2 | shell/segnaposto-menu (menu aperto) | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/segnaposto-menu (menu utente) | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-menu | telefono-390/chiaro | OK | dark assente | dark assente | /app/menu |
| shell-barra-alta | shell/segnaposto-menu | telefono-390/chiaro | OK | 56 px | 56 px | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | telefono-390/chiaro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| shell-segnaposto | shell/segnaposto-menu | telefono-390/chiaro | OK | Piatti / Questa sezione sarà disponibile a breve. | Piatti + descrizione segnaposto | /app/menu |
| C1 | shell/segnaposto-menu | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/menu |
| C2-mouse | shell/segnaposto-menu | notebook-1280/chiaro | AVVISO | fuori intervallo: 20 px (tutte: 48,32,32,32,48,28,20…) | altezze in [28, 48] px | /app/menu |
| C3 | shell/segnaposto-menu | notebook-1280/chiaro | OK | dark assente | dark assente | /app/menu |
| shell-barra-alta | shell/segnaposto-menu | notebook-1280/chiaro | OK | 56 px | 56 px | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | notebook-1280/chiaro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | soglia-767/chiaro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app/menu |
| C3 | shell/segnaposto-menu | soglia-767/chiaro | OK | dark assente | dark assente | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | soglia-767/chiaro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | soglia-768/chiaro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app/menu |
| C3 | shell/segnaposto-menu | soglia-768/chiaro | OK | dark assente | dark assente | /app/menu |
| shell-barra-alta | shell/segnaposto-menu | soglia-768/chiaro | OK | 56 px | 56 px | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | soglia-768/chiaro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/menu |
| C2 | shell/segnaposto-menu | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/menu |
| C2 | shell/segnaposto-menu (menu utente) | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-menu | tablet-820/chiaro | OK | dark assente | dark assente | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | tablet-820/chiaro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/menu |
| C2 | shell/segnaposto-menu | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/menu |
| C2 | shell/segnaposto-menu (menu aperto) | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/segnaposto-menu (menu utente) | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-menu | telefono-390/scuro | OK | dark presente | dark presente | /app/menu |
| shell-barra-alta | shell/segnaposto-menu | telefono-390/scuro | OK | 56 px | 56 px | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | telefono-390/scuro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/menu |
| C2-mouse | shell/segnaposto-menu | notebook-1280/scuro | AVVISO | fuori intervallo: 20 px (tutte: 48,32,32,32,48,28,20…) | altezze in [28, 48] px | /app/menu |
| C3 | shell/segnaposto-menu | notebook-1280/scuro | OK | dark presente | dark presente | /app/menu |
| shell-barra-alta | shell/segnaposto-menu | notebook-1280/scuro | OK | 56 px | 56 px | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | notebook-1280/scuro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | soglia-767/scuro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app/menu |
| C3 | shell/segnaposto-menu | soglia-767/scuro | OK | dark presente | dark presente | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | soglia-767/scuro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | soglia-768/scuro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app/menu |
| C3 | shell/segnaposto-menu | soglia-768/scuro | OK | dark presente | dark presente | /app/menu |
| shell-barra-alta | shell/segnaposto-menu | soglia-768/scuro | OK | 56 px | 56 px | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | soglia-768/scuro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/menu |
| C2 | shell/segnaposto-menu | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/menu |
| C2 | shell/segnaposto-menu (menu utente) | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-menu | tablet-820/scuro | OK | dark presente | dark presente | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | tablet-820/scuro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/menu |
| C2 | shell/segnaposto-menu | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/menu |
| C2 | shell/segnaposto-menu (menu aperto) | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/segnaposto-menu (menu utente) | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-menu | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/menu |
| shell-barra-alta | shell/segnaposto-menu | telefono-390/sistema-chiaro | OK | 56 px | 56 px | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | telefono-390/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/menu |
| C2-mouse | shell/segnaposto-menu | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 20 px (tutte: 48,32,32,32,48,28,20…) | altezze in [28, 48] px | /app/menu |
| C3 | shell/segnaposto-menu | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/menu |
| shell-barra-alta | shell/segnaposto-menu | notebook-1280/sistema-chiaro | OK | 56 px | 56 px | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | notebook-1280/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | soglia-767/sistema-chiaro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app/menu |
| C3 | shell/segnaposto-menu | soglia-767/sistema-chiaro | OK | dark assente | dark assente | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | soglia-767/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | soglia-768/sistema-chiaro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app/menu |
| C3 | shell/segnaposto-menu | soglia-768/sistema-chiaro | OK | dark assente | dark assente | /app/menu |
| shell-barra-alta | shell/segnaposto-menu | soglia-768/sistema-chiaro | OK | 56 px | 56 px | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | soglia-768/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/menu |
| C2 | shell/segnaposto-menu | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/menu |
| C2 | shell/segnaposto-menu (menu utente) | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-menu | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | tablet-820/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/menu |
| C2 | shell/segnaposto-menu | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/menu |
| C2 | shell/segnaposto-menu (menu aperto) | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/segnaposto-menu (menu utente) | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-menu | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/menu |
| shell-barra-alta | shell/segnaposto-menu | telefono-390/sistema-scuro | OK | 56 px | 56 px | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | telefono-390/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/menu |
| C2-mouse | shell/segnaposto-menu | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 20 px (tutte: 48,32,32,32,48,28,20…) | altezze in [28, 48] px | /app/menu |
| C3 | shell/segnaposto-menu | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/menu |
| shell-barra-alta | shell/segnaposto-menu | notebook-1280/sistema-scuro | OK | 56 px | 56 px | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | notebook-1280/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | soglia-767/sistema-scuro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app/menu |
| C3 | shell/segnaposto-menu | soglia-767/sistema-scuro | OK | dark presente | dark presente | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | soglia-767/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | soglia-768/sistema-scuro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app/menu |
| C3 | shell/segnaposto-menu | soglia-768/sistema-scuro | OK | dark presente | dark presente | /app/menu |
| shell-barra-alta | shell/segnaposto-menu | soglia-768/sistema-scuro | OK | 56 px | 56 px | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | soglia-768/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-menu | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/menu |
| C2 | shell/segnaposto-menu | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/menu |
| C2 | shell/segnaposto-menu (menu utente) | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-menu | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/menu |
| shell-nomi-accessibili | shell/segnaposto-menu | tablet-820/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/menu |
| C1 | shell/segnaposto-hours | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/hours |
| C2 | shell/segnaposto-hours | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/hours |
| C2 | shell/segnaposto-hours (menu aperto) | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/segnaposto-hours (menu utente) | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-hours | telefono-390/chiaro | OK | dark assente | dark assente | /app/hours |
| shell-barra-alta | shell/segnaposto-hours | telefono-390/chiaro | OK | 56 px | 56 px | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | telefono-390/chiaro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| shell-segnaposto | shell/segnaposto-hours | telefono-390/chiaro | OK | Orari / Questa sezione sarà disponibile a breve. | Orari + descrizione segnaposto | /app/hours |
| C1 | shell/segnaposto-hours | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/hours |
| C2-mouse | shell/segnaposto-hours | notebook-1280/chiaro | OK | tutte in [28,48] | altezze in [28, 48] px | /app/hours |
| C3 | shell/segnaposto-hours | notebook-1280/chiaro | OK | dark assente | dark assente | /app/hours |
| shell-barra-alta | shell/segnaposto-hours | notebook-1280/chiaro | OK | 56 px | 56 px | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | notebook-1280/chiaro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | soglia-767/chiaro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app/hours |
| C3 | shell/segnaposto-hours | soglia-767/chiaro | OK | dark assente | dark assente | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | soglia-767/chiaro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | soglia-768/chiaro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app/hours |
| C3 | shell/segnaposto-hours | soglia-768/chiaro | OK | dark assente | dark assente | /app/hours |
| shell-barra-alta | shell/segnaposto-hours | soglia-768/chiaro | OK | 56 px | 56 px | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | soglia-768/chiaro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/hours |
| C2 | shell/segnaposto-hours | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/hours |
| C2 | shell/segnaposto-hours (menu utente) | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-hours | tablet-820/chiaro | OK | dark assente | dark assente | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | tablet-820/chiaro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/hours |
| C2 | shell/segnaposto-hours | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/hours |
| C2 | shell/segnaposto-hours (menu aperto) | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/segnaposto-hours (menu utente) | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-hours | telefono-390/scuro | OK | dark presente | dark presente | /app/hours |
| shell-barra-alta | shell/segnaposto-hours | telefono-390/scuro | OK | 56 px | 56 px | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | telefono-390/scuro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/hours |
| C2-mouse | shell/segnaposto-hours | notebook-1280/scuro | OK | tutte in [28,48] | altezze in [28, 48] px | /app/hours |
| C3 | shell/segnaposto-hours | notebook-1280/scuro | OK | dark presente | dark presente | /app/hours |
| shell-barra-alta | shell/segnaposto-hours | notebook-1280/scuro | OK | 56 px | 56 px | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | notebook-1280/scuro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | soglia-767/scuro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app/hours |
| C3 | shell/segnaposto-hours | soglia-767/scuro | OK | dark presente | dark presente | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | soglia-767/scuro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | soglia-768/scuro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app/hours |
| C3 | shell/segnaposto-hours | soglia-768/scuro | OK | dark presente | dark presente | /app/hours |
| shell-barra-alta | shell/segnaposto-hours | soglia-768/scuro | OK | 56 px | 56 px | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | soglia-768/scuro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/hours |
| C2 | shell/segnaposto-hours | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/hours |
| C2 | shell/segnaposto-hours (menu utente) | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-hours | tablet-820/scuro | OK | dark presente | dark presente | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | tablet-820/scuro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/hours |
| C2 | shell/segnaposto-hours | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/hours |
| C2 | shell/segnaposto-hours (menu aperto) | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/segnaposto-hours (menu utente) | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-hours | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/hours |
| shell-barra-alta | shell/segnaposto-hours | telefono-390/sistema-chiaro | OK | 56 px | 56 px | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | telefono-390/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/hours |
| C2-mouse | shell/segnaposto-hours | notebook-1280/sistema-chiaro | OK | tutte in [28,48] | altezze in [28, 48] px | /app/hours |
| C3 | shell/segnaposto-hours | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/hours |
| shell-barra-alta | shell/segnaposto-hours | notebook-1280/sistema-chiaro | OK | 56 px | 56 px | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | notebook-1280/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | soglia-767/sistema-chiaro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app/hours |
| C3 | shell/segnaposto-hours | soglia-767/sistema-chiaro | OK | dark assente | dark assente | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | soglia-767/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | soglia-768/sistema-chiaro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app/hours |
| C3 | shell/segnaposto-hours | soglia-768/sistema-chiaro | OK | dark assente | dark assente | /app/hours |
| shell-barra-alta | shell/segnaposto-hours | soglia-768/sistema-chiaro | OK | 56 px | 56 px | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | soglia-768/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/hours |
| C2 | shell/segnaposto-hours | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/hours |
| C2 | shell/segnaposto-hours (menu utente) | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-hours | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | tablet-820/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/hours |
| C2 | shell/segnaposto-hours | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/hours |
| C2 | shell/segnaposto-hours (menu aperto) | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/segnaposto-hours (menu utente) | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-hours | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/hours |
| shell-barra-alta | shell/segnaposto-hours | telefono-390/sistema-scuro | OK | 56 px | 56 px | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | telefono-390/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/hours |
| C2-mouse | shell/segnaposto-hours | notebook-1280/sistema-scuro | OK | tutte in [28,48] | altezze in [28, 48] px | /app/hours |
| C3 | shell/segnaposto-hours | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/hours |
| shell-barra-alta | shell/segnaposto-hours | notebook-1280/sistema-scuro | OK | 56 px | 56 px | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | notebook-1280/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | soglia-767/sistema-scuro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app/hours |
| C3 | shell/segnaposto-hours | soglia-767/sistema-scuro | OK | dark presente | dark presente | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | soglia-767/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | soglia-768/sistema-scuro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app/hours |
| C3 | shell/segnaposto-hours | soglia-768/sistema-scuro | OK | dark presente | dark presente | /app/hours |
| shell-barra-alta | shell/segnaposto-hours | soglia-768/sistema-scuro | OK | 56 px | 56 px | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | soglia-768/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-hours | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/hours |
| C2 | shell/segnaposto-hours | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/hours |
| C2 | shell/segnaposto-hours (menu utente) | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-hours | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/hours |
| shell-nomi-accessibili | shell/segnaposto-hours | tablet-820/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/hours |
| C1 | shell/segnaposto-reservations | telefono-390/chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/reservations |
| C2 | shell/segnaposto-reservations | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/reservations |
| C2 | shell/segnaposto-reservations (menu aperto) | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/segnaposto-reservations (menu utente) | telefono-390/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-reservations | telefono-390/chiaro | OK | dark assente | dark assente | /app/reservations |
| shell-barra-alta | shell/segnaposto-reservations | telefono-390/chiaro | OK | 56 px | 56 px | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | telefono-390/chiaro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| shell-segnaposto | shell/segnaposto-reservations | telefono-390/chiaro | OK | Prenotazioni / Questa sezione sarà disponibile a breve. | Prenotazioni + descrizione segnaposto | /app/reservations |
| C1 | shell/segnaposto-reservations | notebook-1280/chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/reservations |
| C2-mouse | shell/segnaposto-reservations | notebook-1280/chiaro | AVVISO | fuori intervallo: 20 px (tutte: 48,32,32,32,48,28,20…) | altezze in [28, 48] px | /app/reservations |
| C3 | shell/segnaposto-reservations | notebook-1280/chiaro | OK | dark assente | dark assente | /app/reservations |
| shell-barra-alta | shell/segnaposto-reservations | notebook-1280/chiaro | OK | 56 px | 56 px | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | notebook-1280/chiaro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | soglia-767/chiaro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app/reservations |
| C3 | shell/segnaposto-reservations | soglia-767/chiaro | OK | dark assente | dark assente | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | soglia-767/chiaro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | soglia-768/chiaro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app/reservations |
| C3 | shell/segnaposto-reservations | soglia-768/chiaro | OK | dark assente | dark assente | /app/reservations |
| shell-barra-alta | shell/segnaposto-reservations | soglia-768/chiaro | OK | 56 px | 56 px | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | soglia-768/chiaro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | tablet-820/chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/reservations |
| C2 | shell/segnaposto-reservations | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/reservations |
| C2 | shell/segnaposto-reservations (menu utente) | tablet-820/chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-reservations | tablet-820/chiaro | OK | dark assente | dark assente | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | tablet-820/chiaro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | telefono-390/scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/reservations |
| C2 | shell/segnaposto-reservations | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/reservations |
| C2 | shell/segnaposto-reservations (menu aperto) | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/segnaposto-reservations (menu utente) | telefono-390/scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-reservations | telefono-390/scuro | OK | dark presente | dark presente | /app/reservations |
| shell-barra-alta | shell/segnaposto-reservations | telefono-390/scuro | OK | 56 px | 56 px | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | telefono-390/scuro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | notebook-1280/scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/reservations |
| C2-mouse | shell/segnaposto-reservations | notebook-1280/scuro | AVVISO | fuori intervallo: 20 px (tutte: 48,32,32,32,48,28,20…) | altezze in [28, 48] px | /app/reservations |
| C3 | shell/segnaposto-reservations | notebook-1280/scuro | OK | dark presente | dark presente | /app/reservations |
| shell-barra-alta | shell/segnaposto-reservations | notebook-1280/scuro | OK | 56 px | 56 px | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | notebook-1280/scuro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | soglia-767/scuro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app/reservations |
| C3 | shell/segnaposto-reservations | soglia-767/scuro | OK | dark presente | dark presente | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | soglia-767/scuro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | soglia-768/scuro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app/reservations |
| C3 | shell/segnaposto-reservations | soglia-768/scuro | OK | dark presente | dark presente | /app/reservations |
| shell-barra-alta | shell/segnaposto-reservations | soglia-768/scuro | OK | 56 px | 56 px | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | soglia-768/scuro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | tablet-820/scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/reservations |
| C2 | shell/segnaposto-reservations | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/reservations |
| C2 | shell/segnaposto-reservations (menu utente) | tablet-820/scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-reservations | tablet-820/scuro | OK | dark presente | dark presente | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | tablet-820/scuro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | telefono-390/sistema-chiaro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/reservations |
| C2 | shell/segnaposto-reservations | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/reservations |
| C2 | shell/segnaposto-reservations (menu aperto) | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/segnaposto-reservations (menu utente) | telefono-390/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-reservations | telefono-390/sistema-chiaro | OK | dark assente | dark assente | /app/reservations |
| shell-barra-alta | shell/segnaposto-reservations | telefono-390/sistema-chiaro | OK | 56 px | 56 px | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | telefono-390/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | notebook-1280/sistema-chiaro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/reservations |
| C2-mouse | shell/segnaposto-reservations | notebook-1280/sistema-chiaro | AVVISO | fuori intervallo: 20 px (tutte: 48,32,32,32,48,28,20…) | altezze in [28, 48] px | /app/reservations |
| C3 | shell/segnaposto-reservations | notebook-1280/sistema-chiaro | OK | dark assente | dark assente | /app/reservations |
| shell-barra-alta | shell/segnaposto-reservations | notebook-1280/sistema-chiaro | OK | 56 px | 56 px | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | notebook-1280/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | soglia-767/sistema-chiaro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app/reservations |
| C3 | shell/segnaposto-reservations | soglia-767/sistema-chiaro | OK | dark assente | dark assente | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | soglia-767/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | soglia-768/sistema-chiaro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app/reservations |
| C3 | shell/segnaposto-reservations | soglia-768/sistema-chiaro | OK | dark assente | dark assente | /app/reservations |
| shell-barra-alta | shell/segnaposto-reservations | soglia-768/sistema-chiaro | OK | 56 px | 56 px | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | soglia-768/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | tablet-820/sistema-chiaro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/reservations |
| C2 | shell/segnaposto-reservations | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | /app/reservations |
| C2 | shell/segnaposto-reservations (menu utente) | tablet-820/sistema-chiaro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-reservations | tablet-820/sistema-chiaro | OK | dark assente | dark assente | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | tablet-820/sistema-chiaro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | telefono-390/sistema-scuro | OK | 390 vs innerWidth 390 | scrollWidth <= innerWidth | /app/reservations |
| C2 | shell/segnaposto-reservations | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/reservations |
| C2 | shell/segnaposto-reservations (menu aperto) | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | pannello menu |
| C2 | shell/segnaposto-reservations (menu utente) | telefono-390/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-reservations | telefono-390/sistema-scuro | OK | dark presente | dark presente | /app/reservations |
| shell-barra-alta | shell/segnaposto-reservations | telefono-390/sistema-scuro | OK | 56 px | 56 px | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | telefono-390/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | notebook-1280/sistema-scuro | OK | 1280 vs innerWidth 1280 | scrollWidth <= innerWidth | /app/reservations |
| C2-mouse | shell/segnaposto-reservations | notebook-1280/sistema-scuro | AVVISO | fuori intervallo: 20 px (tutte: 48,32,32,32,48,28,20…) | altezze in [28, 48] px | /app/reservations |
| C3 | shell/segnaposto-reservations | notebook-1280/sistema-scuro | OK | dark presente | dark presente | /app/reservations |
| shell-barra-alta | shell/segnaposto-reservations | notebook-1280/sistema-scuro | OK | 56 px | 56 px | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | notebook-1280/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | soglia-767/sistema-scuro | OK | 767 vs innerWidth 767 | scrollWidth <= innerWidth | /app/reservations |
| C3 | shell/segnaposto-reservations | soglia-767/sistema-scuro | OK | dark presente | dark presente | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | soglia-767/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | soglia-768/sistema-scuro | OK | 768 vs innerWidth 768 | scrollWidth <= innerWidth | /app/reservations |
| C3 | shell/segnaposto-reservations | soglia-768/sistema-scuro | OK | dark presente | dark presente | /app/reservations |
| shell-barra-alta | shell/segnaposto-reservations | soglia-768/sistema-scuro | OK | 56 px | 56 px | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | soglia-768/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| C1 | shell/segnaposto-reservations | tablet-820/sistema-scuro | OK | 820 vs innerWidth 820 | scrollWidth <= innerWidth | /app/reservations |
| C2 | shell/segnaposto-reservations | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | /app/reservations |
| C2 | shell/segnaposto-reservations (menu utente) | tablet-820/sistema-scuro | OK | nessun elemento | nessun elemento sotto 44 px | dropdown utente |
| C3 | shell/segnaposto-reservations | tablet-820/sistema-scuro | OK | dark presente | dark presente | /app/reservations |
| shell-nomi-accessibili | shell/segnaposto-reservations | tablet-820/sistema-scuro | OK | nessuno | nessun testo inglese elencato | /app/reservations |
| webkit-giro-essenziale | shell/home | telefono-390/chiaro/WebKit | OK | login, home, menu, menu utente senza errore pagina | flusso essenziale WebKit | WebKit 26.0 |
| shell-uscita | shell/home | notebook-1280/chiaro | OK | POST 303 Location:/app/login token:true /app→login:true log:true | 303, Location relativo, login finale, cookie assente, activity logout | http://localhost:3000/app/login |

## Non provato (e perché)
- verify-link-valido: facoltativo: token reale monouso non ottenuto
- shell-admin-link: NON PROVABILE con utente solo App (adminRole none)
- verify/link-valido: facoltativo: serve un utente di prova con token di attivazione vero, che si consuma una volta sola; se non si riesce a ottenerlo, NON PROVATO

## Anomalie dell'ambiente
- Lanciatore v1.0.0 (prima esecuzione): controlli non ancora implementati nel runner e quindi assenti da questa tabella — da dichiarare NON PROVATO in design: `login-campi`, `login-link-destinazioni`, `forgot-testi`, `forgot-titolo-documento`, `reset-testi`, `reset-campi`, `verify-testi`, `acc-avvisi`, `acc-spazi-16`, `acc-padding-scheda`, `acc-centratura`, `home-nessuna-riga-di-stato`, `shell-margine-contenuto`, `shell-passaggio-768`, `shell-sticky`, `shell-menu-voci`, `shell-blocco-in-cima`, `shell-blocco-utente`, `shell-menu-utente`, `shell-tema-scelta`, `shell-percorso-voce-attiva`.
- **FALLITI sospetti (difetto del lanciatore, non misura dell’app):** `login-testi` / `login-gerarchia` eseguiti anche su pagine diverse da `/app/login` (path `includes '/app/login'`); `login-testi` su login iniziale include il collegamento Google nell’elenco `links` pur essendo testo corretto; `home-testi` non legge titolo/descrizione schede (solo `href`). Da rivalutare dopo correzione del runner.
- Metadato browser nel front matter resta «(in corso)»; esecuzione reale: Chromium 140.0.7339.186 (Playwright 1.55.1 build 1193), WebKit 26.0 (build 2203).
