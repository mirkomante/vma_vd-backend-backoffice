#!/usr/bin/env python3
"""Porta in src/components/ui un componente shadcn base-nova con i `cn-*` già risolti (come fa la CLI).
Uso: python3 aggiungi_componente.py <nome>      (es. calendar)
Poi applicare a mano le deviazioni D6 e T1 di docs/design/installazione-componenti-ui.md.
Richiede il sorgente di shadcn in /home/claude/shadcn-src/ui (vedi README-ripristino.md)."""
import re, sys
R='/home/claude/shadcn-src/ui/apps/v4/registry/'
nome=sys.argv[1]
css=open(R+'styles/style-nova.css').read()
m={n:' '.join(b.split()) for n,b in re.findall(r'\n  \.(cn-[\w-]+)\s*\{\s*@apply\s+([^;]*);\s*\}',css)}
t=open(R+f'bases/base/ui/{nome}.tsx').read().replace('@/registry/bases/base/ui/','@/components/ui/')
t=re.sub(r'(?<![\w-])cn-[\w-]+',lambda mm:m.get(mm.group(0),''),t)
open(f'src/components/ui/{nome}.tsx','w').write(t); print('scritto src/components/ui/%s.tsx'%nome)
