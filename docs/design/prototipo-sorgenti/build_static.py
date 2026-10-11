import re, subprocess, os, sys
sys.path.insert(0,'/home/claude/mock')
from it_browser import *
OUT='/mnt/user-data/outputs/docs/design'; ANN=open('/home/claude/mock/ann.js').read()
HEAD='''<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Area App: %(t)s (mockup statico)</title>
<link rel="stylesheet" href="../../assets/mockup.css">
</head>
<body data-screen="%(s)s">
<!-- Mockup statico della schermata %(t)s (%(r)s), %(st)s.
     Generato dal prototipo approvato; non si modifica a mano. Attributi: data-screen, data-block,
     data-component, data-variant, data-size. Vedi spec.md per stati, testi, comportamenti. -->
%(inner)s
</body>
</html>
'''
SCREENS=[('orari','orari','Orari','/app/hours','stato iniziale senza modifiche'),
         ('prenotazioni','prenotazioni','Prenotazioni','/app/reservations','scheda «Giorno» di sabato 10 ottobre 2026, nessun filtro'),
         ('piatti','piatti','Piatti','/app/menu (voce Piatti)','elenco dei piatti raggruppato per categoria, nessun filtro'),
         ('shell','home-senza-righe','Shell e home','/app','home senza righe di stato (come nella 8.2)'),
         ('accesso','acc-login','Accesso, pagina di login','/app/login','stato iniziale'),
         ('accesso','acc-forgot','Accesso, password dimenticata','/app/login/forgot','stato iniziale'),
         ('accesso','acc-reset','Accesso, nuova password','/app/login/reset','stato iniziale con token valido'),
         ('accesso','acc-verify-ok','Accesso, conferma email','/app/login/verify','link valido')]
FILES={'accesso':{'acc-login':'mockup-login.html','acc-forgot':'mockup-forgot.html','acc-reset':'mockup-reset.html','acc-verify-ok':'mockup-verify.html'}}
with sync_playwright() as p:
    b=launch(p)
    for pkg,page,t,r,st in SCREENS:
        c=b.new_context(viewport={'width':1280,'height':900},locale='it-IT'); pg=c.new_page(); pg.goto(f'file:///home/claude/mock/dist/{page}.html'); pg.wait_for_timeout(700)
        inner=pg.evaluate(ANN); c.close()
        fname=FILES.get(pkg,{}).get(page,'mockup.html')
        new=HEAD%dict(t=t,s=pkg if pkg!='accesso' else page.replace('acc-','accesso-'),r=r,st=st,inner=inner)
        os.makedirs(f'{OUT}/schermate/{pkg}',exist_ok=True); path=f'{OUT}/schermate/{pkg}/{fname}'
        if os.path.exists(path): print(pkg,fname,'invariato:',open(path).read()==new)
        open(path,'w').write(new)
    b.close()
srcs='\n'.join(f"@source '{OUT}/schermate/{k}/{FILES.get(k,{}).get(pg_,'mockup.html')}';" for k,pg_,_,_,_ in SCREENS)
css=open('/home/claude/mock/input.css').read().replace("@source './src/**/*.{ts,tsx}';",srcs)+"\n@font-face{font-family:'Geist';src:url('./Geist-Variable.woff2') format('woff2');font-weight:100 900;font-display:swap}\n"
open('/home/claude/mock/input-static.css','w').write(css)
subprocess.run(f"cd /home/claude/mock && npx @tailwindcss/cli -i input-static.css -o {OUT}/assets/mockup.css --minify >/dev/null 2>&1 && sed -i '1i /* Generato dal prototipo di design (token di app-ui.css con le modifiche di decisioni-layout-app.md). Non si modifica a mano. */' {OUT}/assets/mockup.css",shell=True,check=True)
print('mockup.css',round(os.path.getsize(f'{OUT}/assets/mockup.css')/1024),'KB')
