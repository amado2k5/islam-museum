#!/usr/bin/env python3
"""Check a translation file against its claims file: same shape and counts, nothing empty, no honorifics, no quotation marks,
Urdu parentheticals isolated. Usage: check_tr.py <claims.json> <claims.tr.json>"""
import json, re, sys
c = json.load(open(sys.argv[1], encoding="utf8")); t = json.load(open(sys.argv[2], encoding="utf8"))
bad = []
if t.get("episode") != c.get("episode"): bad.append("episode differs")
for k, langs in (("title", ("en", "ur", "fr", "es")), ("summary", ("ar", "ur", "fr", "es"))):
    for l in langs:
        if not str(t.get(k, {}).get(l, "")).strip(): bad.append(f"{k}.{l} empty")
secs = t.get("sections", [])
if len(secs) != len(c["sections"]): bad.append(f"{len(secs)} sections, claims file has {len(c['sections'])}")
HON = re.compile(r"رض[يى] ا*لل?ه|رضوان ا+لله|صل[يى] ا*لل?ه|عليه وسلم|عليه السلام|عليهم السلام|عليها السلام|عليه الصلاة|رحمه الله|رحمهم الله|رحمة الله عليه|قدس الله|كرم الله وجهه|ﷺ|ﷻ|رضی اللہ|صلی اللہ|علیہ السلام|علیہا السلام|علیہم السلام|رحمۃ اللہ|peace be upon|PBUH|paz sea con|que la paix|sallallah", re.I)
texts = [t.get("title", {}), t.get("summary", {})]
for i, (s, cs) in enumerate(zip(secs, c["sections"])):
    for l in ("ur", "fr", "es"):
        if not str(s.get(f"topic_{l}", "")).strip(): bad.append(f"section {i}: topic_{l} empty")
        arr = s.get(f"claims_{l}", [])
        if len(arr) != len(cs["claims_en"]): bad.append(f"section {i}: claims_{l} has {len(arr)}, expected {len(cs['claims_en'])}")
        for x in arr:
            if not str(x).strip(): bad.append(f"section {i}: empty claim in {l}")
        texts.append({f"c{l}": " ".join(map(str, arr)), f"t{l}": s.get(f"topic_{l}", "")})
for d in texts:
    for key, v in d.items():
        v = str(v)
        if HON.search(v): bad.append(f"honorific in {key}: {v[:40]}")
        if re.search(r"[\"“”«»„]", v): bad.append(f"quotation mark in {key}: {v[:40]}")
        if re.search(r"[﴿﴾]", v): bad.append(f"scripture mark in {key}")
        if key in ("ur", "cur", "tur", "ar"):
            for m in re.finditer(r"(?<!⁦)\([^()]*[؀-ۿ][^()]*\)", v): bad.append(f"plain Arabic-script parenthetical in {key}: {m.group()[:30]}")
print(f"{len(secs)} sections, {len(bad)} problems")
for b in bad[:40]: print(" -", b)
sys.exit(1 if bad else 0)
