#!/usr/bin/env python3
"""Compare committed course expectations (git 62712390bf copies in .cache/verifier/repo)
with the Ministry text extracted from .cache/verifier/official_g4.json."""
import json,re,sys,yaml,os
R='.cache/verifier/'
off={}
for k,(code,raw,t) in json.load(open(R+'official_g4.json')).items(): off[code]=t
def strip_eg(t,variant):
    # replace each parenthetical beginning "(e.g." (balanced parentheses) with "[…]"
    out='';i=0
    while i<len(t):
        if t.startswith('(e.g.',i):
            depth=0;j=i
            while j<len(t):
                if t[j]=='(':depth+=1
                elif t[j]==')':
                    depth-=1
                    if depth==0:break
                j+=1
            out+='[…]';i=j+1
        else: out+=t[i];i+=1
    return out
def cap(t,variant):
    s=strip_eg(t,variant)
    w=s.split(' ')
    if variant=='marker_counts':
        n=len(w)
    else:
        n=len([x for x in w if x!='[…]'])
    if n>40:
        return ' '.join(w[:40])+' …'
    return s
def classify(code,en):
    if code not in off: return 'NOT-FOUND/WRONG-CODE',''
    o=off[code]
    if en==o: return 'EXACT',o
    for v in ('marker_counts','marker_free'):
        if en==cap(o,v): return 'EXACT-UNDER-RULE'+('' if v=='marker_counts' else '(marker-not-counted)'),cap(o,v)
    return 'DIFFERENT',cap(o,'marker_counts')

# overall expectations (official, from the same extraction)
import html
d=json.load(open(R+'g4.json'));mc=d['modular_content']
def txt(h):
    h=re.sub(r'<br\s*/?>',' ',h);h=re.sub(r'<[^>]+>','',h);return re.sub(r'\s+',' ',html.unescape(h)).strip()
for sk in ['sshg___grade_4___a_5409498','sshg___grade_4___a__copy_']:
    for ok in mc[sk]['elements']['overall_expectations']['value']:
        o=mc[ok];off[o['elements']['title_index']['value']]=txt(o['elements']['content']['value'])
rows=[]
for f in ['ca-on-g4-ss-a','ca-on-g4-ss-a-1','ca-on-g4-ss-a-2','ca-on-g4-ss-a-3']:
    y=yaml.safe_load(open(R+'repo/'+f+'.yaml'))
    for e in y.get('expectations',[]): rows.append((f,e['code'],e['text']['en']))
y=yaml.safe_load(open(R+'repo/ca-on-g4-social-studies.yaml'))
for e in y['gaps']: rows.append(('gap-register',e['code'],e['text']))
from collections import Counter
c=Counter();seen=Counter()
print('| record | code | class | notes |');print('|---|---|---|---|')
for f,code,en in rows:
    seen[code]+=1
    cl,exp=classify(code,en)
    c[cl.split('(')[0]+('' if '(' not in cl else '*')]+=1
    note=''
    if cl.startswith('DIFFERENT'): note='stored: '+en+' || rule-output: '+exp
    print(f'| {f} | {code} | {cl} | {note} |')
print(c)
specific={k for k in off if '.' in k}
print('official specific',len(specific),sorted(specific))
print('missing',sorted(specific-set(seen)),'dups',[k for k,v in seen.items() if v>1],'extra',sorted(set(seen)-set(off)))
