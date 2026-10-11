# Prototipo di design dell'Area App: ripristino dell'ambiente

Sorgenti e script con cui la chat di design ha prodotto prototipi, mockup statici e screenshot (stato al 2026-10-10). **Non fanno parte dell'applicazione**: non stanno nel codice del progetto, e questo file zip non viene letto da `pnpm lint`.

Il file system della chat di design non sopravvive tra una chat e l'altra: per disegnare nuove schermate si ripristina così.

## 1. Repo e prototipo
```
git clone https://github.com/mirkomante/vma_vd-backend-backoffice.git /home/claude/vma_vd-backend-backoffice
mkdir -p /home/claude/mock && cd /home/claude/mock
unzip /home/claude/vma_vd-backend-backoffice/docs/design/prototipo-sorgenti.zip
npm install
```
`npm install` scarica circa 530 MB (React 19.2.8, Tailwind 4.3.3, `@base-ui/react`, `lucide-react`, `geist`, `esbuild`, `shadcn`).

## 2. Cartella di uscita
Gli script scrivono in `/mnt/user-data/outputs/docs/design/`: va riempita con quella del repo prima di rigenerare.
```
mkdir -p /mnt/user-data/outputs && cp -r /home/claude/vma_vd-backend-backoffice/docs /home/claude/vma_vd-backend-backoffice/scripts /mnt/user-data/outputs/
cp -r /home/claude/vma_vd-backend-backoffice/.cursor /mnt/user-data/outputs/
```
Gli zip di consegna si costruiscono confrontando `/mnt/user-data/outputs/{docs,scripts,.cursor}` con il repo clonato (pull prima): solo i file nuovi o diversi.

## 3. Costruire e provare
```
cd /home/claude/mock
npx esbuild src/main.tsx --bundle --minify --outfile=dist/app.js --define:process.env.NODE_ENV='"production"' --tsconfig=tsconfig.json --log-level=warning
npx @tailwindcss/cli -i input.css -o dist/app.css --minify
python3 page_build.py          # pagine HTML complete in dist/
python3 build_static.py        # mockup statici annotati + assets/mockup.css
python3 shots_orari.py; python3 shots_prenotazioni.py; python3 shots_piatti.py; python3 shots_shell_accesso.py
```
- Gli screenshot usano Playwright con Chromium (`it_browser.py`): `pip install playwright && playwright install chromium` se non c'è.
- **Per cercare gli avvisi di Base UI compilare in sviluppo** (`--define:process.env.NODE_ENV='"development"'`, senza `--minify`): la compilazione di produzione non li stampa.
- Misura delle aree di tocco: `measure_touch.js` (si esegue nella pagina con Playwright, vedi gli script degli screenshot).

## 4. Aggiungere un componente shadcn nuovo
Serve il sorgente del registro, al commit usato finora:
```
git clone https://github.com/shadcn-ui/ui /home/claude/shadcn-src/ui && cd /home/claude/shadcn-src/ui && git checkout 2d3f1cd
cd /home/claude/mock && python3 aggiungi_componente.py <nome>
```
Poi applicare a mano le deviazioni D6 e T1 (`docs/design/installazione-componenti-ui.md`) e registrarle in `deviazioni.json`.

## 5. Dove sta cosa
- `src/components/ui/`: i componenti shadcn **già modificati** (D6 e T1). `src/layouts.tsx`: shell e menu. `src/orari.tsx`, `prenotazioni.tsx`, `piatti.tsx`, `accesso.tsx`, `home.tsx`, `lingue.tsx`, `filters.tsx`: le schermate.
- `ann.js`: annotazione dei mockup statici (`data-component`, `data-block`...). `gen_gallery.py`: pagine con alternative da provare. `deviazioni.json`: registro delle modifiche ai componenti.
- Il comportamento dei prototipi rispetto al codice reale: i moduli di accesso non inviano nulla; i dati sono di esempio.
- `ui-check-copia.mjs`: copia dello script `scripts/ui-check.mjs` del repo, che fa fede.
