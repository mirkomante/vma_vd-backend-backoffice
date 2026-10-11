(()=>{const pas=s=>s.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join('');
 document.querySelectorAll('[data-demo]').forEach(x=>x.remove());
 document.querySelectorAll('[data-slot]').forEach(e=>{ if(!e.hasAttribute('data-component')) e.setAttribute('data-component',pas(e.getAttribute('data-slot'))) });
 const map={};let n=0;const ren=v=>v.replace(/base-ui-[A-Za-z0-9_:\\-]+/g,m=>map[m]||(map[m]='ui-'+(++n)));
 document.querySelectorAll('*').forEach(e=>{['id','for','aria-labelledby','aria-describedby','aria-controls'].forEach(a=>{if(e.hasAttribute(a))e.setAttribute(a,ren(e.getAttribute(a)))})});
 const r=document.getElementById('root').cloneNode(true);r.querySelectorAll('script,style').forEach(x=>x.remove());return r.innerHTML})()