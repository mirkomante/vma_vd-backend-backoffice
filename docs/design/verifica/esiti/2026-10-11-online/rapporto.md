# Esito verifica — online — 2026-10-11
Commit: 2ca023005c5a · Lanciatore: 1.0.0 · Browser: fetch · Controlli: controlli-8.2.json v1

## Riepilogo
OK: 6 · FALLITO: 0 · AVVISO: undefined · NON PROVATO: 0

## Esiti
| Id | Schermata/stato | Profilo/tema | Esito | Misurato | Atteso | Evidenza |
|---|---|---|---|---|---|---|
| on1 | /app/login | — | OK | 200, h1 true | 200 + h1 Area App | https://vma-vd-backend-backoffice-git-437074136999.europe-west1.run.app |
| on2 | /app | — | OK | 307 → /app/login | redirect a /app/login su origine pubblica | https://vma-vd-backend-backoffice-git-437074136999.europe-west1.run.app |
| on3 | POST /app/logout | — | OK | 303 Location:/app/login Set-Cookie:payload-token=; Expires=Sun, 11 Oct 2026 09:25:13 GMT; Path=… | 303, Location ok, Set-Cookie payload-token | https://vma-vd-backend-backoffice-git-437074136999.europe-west1.run.app |
| on4 | /app/login/reset | — | OK | 0 controlli in main | 0 | https://vma-vd-backend-backoffice-git-437074136999.europe-west1.run.app |
| on5 | reset token+resetFailed | — | OK | alert+password: true | avviso e campo password | https://vma-vd-backend-backoffice-git-437074136999.europe-west1.run.app |
| on6 | /app/login/verify | — | OK | 200, messaggio:true | 200 + GENERIC_VERIFY_FAILURE_MESSAGE | https://vma-vd-backend-backoffice-git-437074136999.europe-west1.run.app |

## Non provato (e perché)
- (nessuno)

## Anomalie dell'ambiente
- (nessuna)
