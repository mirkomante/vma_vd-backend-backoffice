---
stato: bozza
---

# Esportazione dei dati del menù dal backend attuale (`vtn-backend`)

Nota operativa per la sottofase **6.8** (import dei dati esistenti) e per l'emendamento del 2026-10-04 ad `ADR-108-modello-dati-menu-digitale.md`.

## Scopo

Produrre lo **snapshot JSON** da cui lo script di import legge i dati. Si rifà il giorno dell'import: il vecchio sistema resta in uso e i dati cambiano.

## Sorgente

API v1 di produzione di `vtn-backend`: `https://vtn-backend-203473363873.europe-west1.run.app/api/v1`. È pubblica, solo GET, senza autenticazione; limite di 100 richieste al minuto per IP (documentazione `docs/api` del repository `vtn-backend`). Il parametro `?all=true` include le voci con `inLista` falso.

## Comandi

```
B=https://vtn-backend-203473363873.europe-west1.run.app/api/v1
mkdir vtn-export && cd vtn-export
for e in health piatti menu-fisso vini birre liquori bevande cocktails servizi allergeni categorie-piatti categoria-menu-fisso nazioni regioni zone tipologie-vino tipologie-birra tipologie-liquore tipologie-bevanda tipologie-cocktail; do
  curl -sS "$B/$e?all=true" -o "$e.json"
done
python3 - <<'EOF'
import json,urllib.request
B="https://vtn-backend-203473363873.europe-west1.run.app/api/v1"
for c in json.load(open("categoria-menu-fisso.json"))["data"]:
    urllib.request.urlretrieve(f"{B}/menu-fisso/categoria/{c['id']}/dettagli?all=true", f"menu-fisso-dettagli-{c['id']}.json")
EOF
```

## Cosa l'API non restituisce

- I record cancellati (`deletedAt`).
- `GET /piatti` esclude per scelta i piatti con `soloMenuFissi`: si trovano nei menu fissi (`menu-fisso.json` e file di dettaglio). Nello snapshot di riferimento sono solo due varianti, che non si importano.
- I **menu fissi** (`menu-fisso.json` e file di dettaglio) si esportano solo come **riferimento per la ricomposizione a mano**: non si importano (`ADR-108`, emendamento).
- I menu speciali (per esempio San Valentino) non compaiono nelle categorie esportate e non si importano (`ADR-108`, emendamento).

## Controlli sull'esito

- Ogni file ha `"success": true` e `meta.count` uguale alla lunghezza di `data`.
- Confronto con lo snapshot di riferimento del 2026-10-04: piatti 44 (3 nascosti), menu fissi 8, vini 90 (13 nascosti), distillati 38 (6 nascosti), bevande 13, birre 1, cocktail 2, servizi 3, allergeni 14.
- Scostamenti importanti rispetto a questi numeri vanno spiegati prima di lanciare l'import.

## Note

- Lo snapshot **non si committa**: si rigenera a ogni uso.
- I dati sono pubblici (la stessa carta è sul sito), ma l'URL dell'API di produzione non va ripetuto in altri documenti.
