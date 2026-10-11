/** Algoritmo da docs/design/verifica/misura-tocco.md */
export const TOUCH_MEASURE_FN = `(()=>{const sel='button,a[href],input:not([type=hidden]):not([aria-hidden=true]),textarea,select,[role=combobox],[role=checkbox],[role=switch],[role=tab],[role=menuitem]';const out=[];
const labelsOf=e=>{const ids=[e.id,...[...(e.parentElement?e.parentElement.querySelectorAll('input'):[])].map(i=>i.id)].filter(Boolean);return ids.flatMap(id=>[...document.querySelectorAll('label[for="'+id+'"]')])};
const hitOk=(e,x,y)=>{const t=document.elementFromPoint(x,y);if(!t)return false;if(t===e||e.contains(t))return true;return labelsOf(e).some(l=>t===l||l.contains(t))};
document.querySelectorAll(sel).forEach(e=>{if(e.closest('[data-demo]'))return;const r0=e.getBoundingClientRect();if(r0.width<2||r0.height<2||getComputedStyle(e).visibility==='hidden')return;if(Math.min(r0.width,r0.height)>=44)return;
e.scrollIntoView({block:'center',inline:'center'});const r=e.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;
if(!hitOk(e,cx,cy))return;
let ok=true;for(const [dx,dy] of [[-21.5,0],[21.5,0],[0,-21.5],[0,21.5]]){const x=cx+dx,y=cy+dy;if(x<0||y<0||x>innerWidth||y>innerHeight)continue;if(!hitOk(e,x,y))ok=false}
if(!ok)out.push((e.getAttribute('aria-label')||e.innerText||e.id).trim().slice(0,28).replace(/\\n/g,' ')+' '+Math.round(r.width)+'x'+Math.round(r.height))});return out})()`
