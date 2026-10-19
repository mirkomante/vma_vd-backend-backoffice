#!/bin/zsh
# Guardiano dei giri di ui:verify. Uso (in un terminale a parte, si ferma con Ctrl+C):
#   zsh scripts/ui-verify/watch.sh [limite_secondi_stesso_passo=150] [avviso|kill]
# Controlla ogni 15 secondi .next/ui-verify-progress.log: allarme se il passo non cambia da più del limite o se il log
# non viene scritto da più di 90 secondi (il battito ogni 30 secondi non scatta: thread principale bloccato).
# Con "kill" ferma il giro (SIGTERM), poi chiude daemon Payload, browser e server sulle porte 3100, 3200 e 31997.
# Non tocca la porta 3000 (pnpm dev).
cd "$(dirname "$0")/../.." || exit 1
LOG=.next/ui-verify-progress.log
LIMIT=${1:-150}
MODE=${2:-avviso}
prev=""; since=$(date +%s)
while true; do
  sleep 15
  pid=$(pgrep -f "scripts/ui-verify/run.mjs" | head -1)
  if [[ -z "$pid" ]]; then prev=""; since=$(date +%s); printf "%s nessun giro attivo\n" "$(date +%T)"; continue; fi
  now=$(date +%s)
  mt=$(stat -f %m "$LOG" 2>/dev/null || echo 0)
  key=$(tail -n 1 "$LOG" 2>/dev/null | awk -F' [|] ' '{print $2" | "$3" | "$4}')
  if [[ "$key" != "$prev" ]]; then prev="$key"; since=$now; fi
  same=$(( now - since )); quiet=$(( now - mt ))
  printf "%s giro %s | %s | stesso passo da %ss | log fermo da %ss\n" "$(date +%T)" "$pid" "$key" "$same" "$quiet"
  if (( same > LIMIT || quiet > 90 )); then
    printf "ALLARME: giro fermo su: %s\n" "$key"
    osascript -e "display notification \"Giro fermo: $key\" with title \"ui-verify\" sound name \"Glass\"" 2>/dev/null
    if [[ "$MODE" == "kill" ]]; then
      printf "%s fermo il giro (SIGTERM) e pulisco\n" "$(date +%T)"
      pkill -TERM -f "scripts/ui-verify/run.mjs"; sleep 10
      pkill -f "scripts/ui-verify/menu-payload.ts"; pkill -f headless_shell
      for p in 3100 3200 31997; do lsof -ti :$p | xargs kill 2>/dev/null; done
      prev=""; since=$(date +%s)
    fi
  fi
done
