# Misura delle aree di tocco (C2)

Algoritmo di riferimento, già usato per le schermate disegnate (rilievi P3 e P4). **Non si accorcia e non si ammorbidisce**: vale l'area cliccabile reale, non il riquadro visibile.

Si esegue nella pagina (`page.evaluate`) con il profilo a tocco (`isMobile: true`, `hasTouch: true`), così `pointer-coarse:` si applica. Restituisce l'elenco degli elementi che **non** arrivano a 44 px; l'esito è positivo solo con l'elenco vuoto.

Regole che l'algoritmo applica:
- si considerano `button`, `a[href]`, `input` (non nascosti), `textarea`, `select` e gli elementi con ruolo `combobox`, `checkbox`, `switch`, `tab`, `menuitem`;
- un elemento con lato minore già ≥ 44 px passa subito;
- gli altri si portano al centro dello schermo e si prova a 21,5 px dal centro nelle quattro direzioni (`elementFromPoint`): il punto deve cadere sull'elemento o sulla sua etichetta (`label for`);
- si saltano gli elementi coperti dal velo di un foglio o di una finestra (non sono interattivi in quel momento);
- vanno misurati **anche con il menu utente aperto, il pannello del menu aperto (telefono) e dopo ogni interazione che mostra nuovi controlli**: un elemento non visibile non si misura da solo.

```js
(()=>{const sel='button,a[href],input:not([type=hidden]):not([aria-hidden=true]),textarea,select,[role=combobox],[role=checkbox],[role=switch],[role=tab],[role=menuitem]';const out=[];
const labelsOf=e=>{const ids=[e.id,...[...(e.parentElement?e.parentElement.querySelectorAll('input'):[])].map(i=>i.id)].filter(Boolean);return ids.flatMap(id=>[...document.querySelectorAll('label[for="'+id+'"]')])};
const hitOk=(e,x,y)=>{const t=document.elementFromPoint(x,y);if(!t)return false;if(t===e||e.contains(t))return true;return labelsOf(e).some(l=>t===l||l.contains(t))};
document.querySelectorAll(sel).forEach(e=>{if(e.closest('[data-demo]'))return;const r0=e.getBoundingClientRect();if(r0.width<2||r0.height<2||getComputedStyle(e).visibility==='hidden')return;if(Math.min(r0.width,r0.height)>=44)return;
e.scrollIntoView({block:'center',inline:'center'});const r=e.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;
if(!hitOk(e,cx,cy))return; /* coperto da velo o fuori vista: non interattivo */
let ok=true;for(const [dx,dy] of [[-21.5,0],[21.5,0],[0,-21.5],[0,21.5]]){const x=cx+dx,y=cy+dy;if(x<0||y<0||x>innerWidth||y>innerHeight)continue;if(!hitOk(e,x,y))ok=false}
if(!ok)out.push((e.getAttribute('aria-label')||e.innerText||e.id).trim().slice(0,28).replace(/\n/g,' ')+' '+Math.round(r.width)+'x'+Math.round(r.height))});return out})()
```

Con il mouse (`notebook-1280`, senza tocco) NON si applica la soglia di 44 px: le altezze compatte sono volute (controllo `C2-mouse`).
