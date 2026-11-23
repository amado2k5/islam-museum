#!/usr/bin/env python3
"""Check a claims file (claims-brief.md) before anything is written from it: shape, entity ids that exist in the graph index,
no typed honorifics, no quotation marks, no scripture marks, Arabic parentheses isolated. Usage: check_claims.py <claims.json> <graph-index.tsv>"""
import json, re, sys
claims = json.load(open(sys.argv[1], encoding="utf8"))
ids = {l.split("\t")[0] for l in open(sys.argv[2], encoding="utf8")}
bad = []
for k in ("episode", "title_ar", "summary_en", "sections", "unmatched", "excluded"):
    if k not in claims: bad.append(f"missing {k}")
HON = re.compile(r"رض[يى] ا*لل?ه|رضوان ا+لله|صل[يى] ا*لل?ه|عليه وسلم|عليه السلام|عليهم السلام|عليها السلام|عليه الصلاة|رحمه الله|رحمهم الله|رحمة الله عليه|قدس الله|كرم الله وجهه|ﷺ|ﷻ|peace be upon|PBUH|\(pbuh\)|may God be pleased", re.I)
SCRIPT = re.compile(r"[﴿﴾]")
n_claims = 0
for i, s in enumerate(claims.get("sections", [])):
    for k in ("topic_en", "topic_ar", "time", "claims_en", "claims_ar", "entities", "stated_sources", "flags"):
        if k not in s: bad.append(f"section {i}: missing {k}")
    if len(s.get("claims_en", [])) != len(s.get("claims_ar", [])): bad.append(f"section {i}: claims_en and claims_ar differ in length")
    for e in s.get("entities", []):
        if e not in ids: bad.append(f"section {i}: unknown id {e}")
    for t in s.get("claims_en", []) + s.get("claims_ar", []) + [s.get("topic_en", ""), s.get("topic_ar", "")]:
        n_claims += 1
        if HON.search(t): bad.append(f"section {i}: honorific in {t[:50]}")
        if SCRIPT.search(t): bad.append(f"section {i}: scripture mark in {t[:50]}")
        if re.search(r"[\"“”«»]", t): bad.append(f"section {i}: quotation mark in {t[:50]}")
        for m in re.finditer(r"(?<!⁦)\([^()]*[؀-ۿ][^()]*\)", t): bad.append(f"section {i}: plain Arabic parenthetical {m.group()[:30]}")
print(f"{len(claims.get('sections', []))} sections, {sum(len(s.get('claims_en', [])) for s in claims.get('sections', []))} claims, {len({e for s in claims.get('sections', []) for e in s.get('entities', [])})} entities, {len(bad)} problems")
for b in bad[:40]: print(" -", b)
sys.exit(1 if bad else 0)
