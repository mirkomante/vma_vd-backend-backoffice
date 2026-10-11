import base64
def build(flag,out,title,emoji,value='1'):
    b=base64.b64encode(open('/home/claude/mock/node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2','rb').read()).decode()
    css=open('/home/claude/mock/dist/app.css').read(); js=open('/home/claude/mock/dist/app.js').read()
    font="@font-face{font-family:'Geist';src:url(data:font/woff2;base64,%s) format('woff2');font-weight:100 900;font-display:swap}"%b
    html=f'''<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{title}</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E{emoji}%3C/text%3E%3C/svg%3E"><style>{font+css}</style></head><body><div id="root"></div><script>window.{flag}={value}</script><script>{js}</script></body></html>'''
    open(out,'w').write(html)
def build_new():
    import json
    for n in ['login','login-errore','login-reset-ok','forgot','forgot-inviata','reset','reset-fallito','reset-senza-token','verify-ok','verify-fallita']:
        build('__X__',f'/home/claude/mock/dist/acc-{n}.html','Area App: accesso','🔑',json.dumps(n))
    for v in ['senza-righe','con-righe','vuota','segnaposto-piatti','segnaposto-orari','segnaposto-prenotazioni']:
        build('__H2__',f'/home/claude/mock/dist/home-{v}.html','Area App: home','🏠',json.dumps(v))
def build_all():
    build_new()
    build('__D__','/home/claude/mock/dist/piatti.html','Area App: Piatti','🍜'); build('__P__','/home/claude/mock/dist/prenotazioni.html','Area App: Prenotazioni','📅'); build('__O__','/home/claude/mock/dist/orari.html','Area App: Orari','🕒')
if __name__=='__main__': build_all()
