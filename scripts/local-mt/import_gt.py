#!/usr/bin/env python3
"""Imports a Word file translated by Google Translate (document translation) back into museum records.

Pilot of 19 November 2026 (founder's request): a plain-text Word file of English prose, built by a script that hides
citations behind [[N]] markers, wraps link labels as <xN>label</xN> and opens each record with a paragraph
"#### n ####", was translated on translate.google.com and downloaded. This script splits the translated file back into
records with the JSON map written beside the English file, puts the citations and link ids back, runs the same checks
as scripts/local-mt/translate.py against the English source, and writes content/<lang>/<class>/<slug>.md only for the
records that pass. A record that fails is left alone, so the local model translates it later.

    python3 scripts/local-mt/import_gt.py --lang es --map pilot-map.json --docx translated.docx --log gt-es.log

Always from English. Nothing here calls Google: the upload and download are done by hand in a browser.
"""
import argparse, collections, html, json, os, re, sys, time, zipfile

import yaml

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from translate import BROKEN, FIXED_HEADINGS, LEVELED, ROOT, check, restore  # noqa: E402

REC = re.compile(r"^\s*#{3,4}\s*(\d+)\s*#{3,4}\s*$")
ERA = {"es": [(r"(\d) (?:AH|d\. ?H\.|A\.H\.)(?![\w.])", r"\1 H"), (r"(\d) (?:BCE|a\. ?e\. ?c\.|AEC)(?![\w.])", r"\1 a. C."), (r"(\d) (?:CE|e\. ?c\.|EC)(?![\w.])", r"\1 d. C.")],
       "fr": [(r"(\d) (?:AH|A\.H\.)(?![\w.])", r"\1 H"), (r"(\d) (?:BCE|av\. ?n\. ?è\.)(?![\w.])", r"\1 av. J.-C."), (r"(\d) (?:CE|EC|de notre ère)(?![\w.])", r"\1 apr. J.-C.")]}


def paragraphs(path):
    x = zipfile.ZipFile(path).read("word/document.xml").decode("utf-8")
    return [html.unescape("".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", m.group(0), re.S))) for m in re.finditer(r"<w:p[ >].*?</w:p>|<w:p/>", x, re.S)]


def tidy(s):
    s = s.replace(" ", " ").replace(" ", " ")
    s = re.sub(r"<\s*(/?)\s*x\s*(\d+)\s*>", r"<\1x\2>", s, flags=re.I)  # "< x1 >", "</ X1>"
    s = re.sub(r"\[\s*\[\s*(\d+)\s*\]\s*\]", r"[[\1]]", s)
    return re.sub(r" {2,}", " ", s).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", required=True, choices=["es", "fr"])
    ap.add_argument("--map", required=True)
    ap.add_argument("--docx", required=True)
    ap.add_argument("--log", required=True)
    ap.add_argument("--out", default=ROOT)
    ap.add_argument("--date", default=time.strftime("%Y-%m-%d"), help="day the file was translated on translate.google.com")
    a = ap.parse_args()
    lang, records, paras = a.lang, json.load(open(a.map, encoding="utf-8")), paragraphs(a.docx)
    chunks, cur = {}, None  # record number -> its translated paragraphs
    for p in paras:
        m = REC.match(p)
        if m: cur = int(m.group(1)); chunks[cur] = []
        elif cur is not None: chunks[cur].append(p)
    tally = collections.Counter()
    with open(a.log, "a", encoding="utf-8") as lg:
        def note(event, ident, **kw):
            tally[kw.get("reason", event).split(":")[0]] += 1
            lg.write(json.dumps({"t": time.strftime("%Y-%m-%dT%H:%M:%S"), "event": event, "id": ident, **kw}, ensure_ascii=False) + "\n")

        for n, rec in enumerate(records, 1):
            ident = rec["id"]; target = os.path.join(a.out, "content", lang, ident + ".md")
            if os.path.exists(target): note("skipped", ident, reason="already translated"); continue
            raw = open(os.path.join(ROOT, "content", "en", ident + ".md"), encoding="utf-8").read()
            m = re.match(r"^---\n(.*?)\n---\n?(.*)$", raw, re.S)
            todo = [l for l in rec["lines"] if "en" in l]
            got = chunks.get(n)
            try:
                if not m: raise ValueError("no frontmatter")
                fm, body = yaml.safe_load(m.group(1)), m.group(2)
                if LEVELED.search(body) or BROKEN.search(body): raise ValueError("held")
                if body.split("\n") != [l["fixed"] if "fixed" in l else l["prefix"] + l["en"] for l in rec["lines"]]:
                    raise ValueError("English changed since the file was built")
                if got is None or len(got) != len(todo): raise ValueError("paragraphs do not line up")
                out, it = [], iter(got)
                for l in rec["lines"]:
                    if "fixed" in l: out.append(l["fixed"]); continue
                    tr, head = tidy(next(it)), l["prefix"].startswith("#")
                    if head and l["en"].strip() in FIXED_HEADINGS[lang]: out.append(l["prefix"] + FIXED_HEADINGS[lang][l["en"].strip()]); continue
                    for star in ("**", "*"):  # Markdown emphasis must survive as written
                        if l["en"].count(star) != tr.count(star): raise ValueError("emphasis marks changed")
                    if re.search(r"\*\s+[^*]+\s+\*", tr) and not re.search(r"\*\s+[^*]+\s+\*", l["en"]): raise ValueError("emphasis marks changed")
                    done = restore(tr, l["kept"], l["links"])
                    if done is None or not done.strip(): raise ValueError("markers lost")
                    for pat, rep in ERA[lang]: done = re.sub(pat, rep, done)
                    if lang == "es":  # the lane's term is "suní" (the validator reads the first perspectives label by it)
                        done = re.sub(r"\b([Ss])unitas\b", r"\1uníes", done); done = re.sub(r"\b([Ss])unita\b", r"\1uní", done)
                        done = re.sub(r"^\*\*Punto de vista suní", "**Visión suní", done)
                        if re.match(r"\*\*Sunni", l["en"]) and not re.match(r"\*\*(?:(?:Visión|Posición|Postura|Opinión) )?[Ss]unn?í", done): raise ValueError("Sunni label reworded")
                    if head and not l["en"].endswith("."): done = done.rstrip(".")
                    out.append(l["prefix"] + done)
                tr_body = "\n".join(out)
                problem = check(body, tr_body, lang)
                if problem: raise ValueError(problem)
                new = {"id": ident, "lang": lang, "source_lang": "en",
                       "translators": [f"Google Translate (document translation on translate.google.com, {a.date}), draft translation"]}
                for k, v in fm.items():
                    if k not in ("id", "lang", "source_lang", "translators", "provenance", "translation_of"): new[k] = v
                new["provenance"] = {"generated_by": "scripts/local-mt/import_gt.py (spanish lane, Google Translate document pilot, managed by Claude Code)",
                                     "model": "google-translate", "run": f"gt-docs-{lang}-{a.date}", "source": f"content/en/{ident}.md"}
                text = "---\n" + yaml.safe_dump(new, allow_unicode=True, sort_keys=False, width=10000, default_flow_style=None).rstrip("\n") + "\n---\n" + tr_body
                if not text.endswith("\n"): text += "\n"
                os.makedirs(os.path.dirname(target), exist_ok=True)
                with open(target + ".tmp", "w", encoding="utf-8") as f: f.write(text)
                os.replace(target + ".tmp", target)
                note("ok", ident, words=len(body.split()))
            except ValueError as e:
                note("failed", ident, reason=str(e)[:200])
                with open(a.log + ".failed", "a", encoding="utf-8") as ff: ff.write(f"{ident}\t{e}\n")
    print(f"{lang}: {len(records)} records in the file; " + ", ".join(f"{k} {v}" for k, v in tally.most_common()))


if __name__ == "__main__":
    main()
