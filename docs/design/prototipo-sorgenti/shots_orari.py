import re, subprocess, io, os, sys
sys.path.insert(0,'/home/claude/mock')
from it_browser import *
from PIL import Image, ImageChops
OUT='/mnt/user-data/outputs/docs/design'; PK=f'{OUT}/schermate/orari'; PO=PK
PROTO='file:///home/claude/mock/dist/orari.html'; STATIC=f'file://{PK}/mockup.html'
HIDE="[data-demo]{display:none!important}"
def save(png,name): Image.open(io.BytesIO(png)).convert('RGB').save(f'{PK}/{name}',optimize=True)
def pct(A,B):
    if A.size!=B.size: return ('dimensioni diverse',A.size,B.size)
    d=ImageChops.difference(A,B).convert('L').point(lambda v:255 if v>24 else 0); h=d.histogram(); return round(100*h[255]/(A.size[0]*A.size[1]),3)
with sync_playwright() as p:
    b=launch(p); sizes={}
    def ctx(w,h,touch,scheme):
        kw=dict(viewport={'width':w,'height':h},locale='it-IT',color_scheme=scheme)
        if touch: kw.update(is_mobile=True,has_touch=True)
        return b.new_context(**kw)
    def page(w,h,touch,scheme):
        c=ctx(w,h,touch,scheme); pg=c.new_page(); pg.goto(PROTO); pg.add_style_tag(content=HIDE); pg.wait_for_timeout(800); return c,pg
    for tag,w,h,t in [('390',390,844,True),('1280',1280,900,False)]:
        for sch,it in [('light','chiaro'),('dark','scuro')]:
            c,pg=page(w,h,t,sch); save(pg.screenshot(full_page=True),f'{tag}-{it}.png'); c.close()
    def phone(name,action,full=False):
        c,pg=page(390,844,True,'light'); action(pg); pg.wait_for_timeout(700); pg.evaluate("window.scrollTo(0,0)") if name in('390-errore-chiaro.png','390-salvato-chiaro.png','390-errore-server-chiaro.png') else None
        pg.wait_for_timeout(200); save(pg.screenshot(full_page=full),name); c.close()
    def demo(v): return lambda pg:(pg.evaluate("document.querySelector('[data-demo]').style.display='block'") if False else None, pg.evaluate(f"""(()=>{{const s=document.querySelector('select[aria-label="Stato demo"]');s.value='{v}';s.dispatchEvent(new Event('change',{{bubbles:true}}))}})()"""))
    phone('390-errore-chiaro.png',lambda pg:(pg.fill('#lunch-start',''),pg.get_by_role('button',name='Salva modifiche').click()))
    phone('390-salvato-chiaro.png',lambda pg:(pg.fill('#dinner-end','23:30'),pg.get_by_role('button',name='Salva modifiche').click(),pg.wait_for_timeout(1300)))
    phone('390-foglio-chiusura-chiaro.png',lambda pg:pg.get_by_label('Modifica chiusura Natale').click())
    phone('390-conferma-rimozione-chiaro.png',lambda pg:pg.get_by_role('button',name='Rimuovi festività di un anno').click())
    phone('390-salvataggio-chiaro.png',demo('salvataggio'))
    phone('390-errore-server-chiaro.png',demo('errore-server'))
    phone('390-non-configurato-chiaro.png',demo('non-configurato'))
    phone('390-errore-caricamento-chiaro.png',demo('errore-caricamento'))
    phone('390-uscita-chiaro.png',lambda pg:(pg.fill('#bnb-in','15:30'),pg.locator('[data-slot=sidebar-trigger]').click(),pg.wait_for_timeout(500),pg.get_by_role('link',name='Vini').click()))
    # fedeltà a 1280
    def shot(url,scheme,dark):
        c=b.new_context(viewport={'width':1280,'height':900},locale='it-IT',color_scheme=scheme); pg=c.new_page(); pg.goto(url); pg.add_style_tag(content=HIDE)
        if dark and url==STATIC: pg.evaluate("document.documentElement.classList.add('dark')")
        pg.wait_for_timeout(900); s=pg.screenshot(full_page=True); c.close(); return Image.open(io.BytesIO(s)).convert('RGB')
    for sch in ('light','dark'):
        A=shot(PROTO,sch,sch=='dark'); B=shot(STATIC,sch,sch=='dark')
        d=ImageChops.difference(A,B).convert('L').point(lambda v:255 if v>24 else 0); h=d.histogram()
        print('fedeltà 1280',sch,'-> pixel diversi %:',round(100*h[255]/(A.size[0]*A.size[1]),3),'| stessa dimensione',A.size==B.size)
    pg=b.new_context(viewport={'width':1280,'height':900}).new_page(); pg.goto(STATIC)
    print('annotazioni:',pg.evaluate("({slot:document.querySelectorAll('[data-slot]').length,senzaComponent:[...document.querySelectorAll('[data-slot]')].filter(e=>!e.hasAttribute('data-component')).length,demo:document.querySelectorAll('[data-demo]').length,script:document.scripts.length})"))
    b.close()
for f in sorted(os.listdir(PK)): print(f'{os.path.getsize(PK+"/"+f)/1024:7.0f} KB  {f}')
