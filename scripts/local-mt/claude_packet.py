#!/usr/bin/env python3
"""Packets for translation by a Claude agent (founder's instruction, 19 November 2026: the records that the document
services could not bring back whole are translated by Claude itself, one agent at a time).

    claude_packet.py make  --lang es --words 14000 --max-record 5000   print the ids of the next packet
    claude_packet.py check --lang es <id> [<id> ...]                   check written files against the English

The check is the importer's own (translate.check): same link ids, citations, headings, paragraphs, length, no typed
honorific, not left in English. A file that fails is reported and left for the agent to fix."""
import argparse, os, re, sys

import yaml

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from translate import BROKEN, LEVELED, ROOT, check, queue  # noqa: E402

ap = argparse.ArgumentParser(); ap.add_argument("cmd", choices=["make", "check"]); ap.add_argument("--lang", required=True, choices=["es", "fr"])
ap.add_argument("--words", type=int, default=14000); ap.add_argument("--max-record", type=int, default=5000)
ap.add_argument("--taken", default="/Volumes/exmicroSD/islam-museum-local-mt/fr-taken.txt"); ap.add_argument("ids", nargs="*")
a = ap.parse_args()
body = lambda p: re.match(r"^---\n(.*?)\n---\n?(.*)$", open(p, encoding="utf-8").read(), re.S)
if a.cmd == "make":
    skip = set(l.strip() for l in open(a.taken, encoding="utf-8")) if a.lang == "fr" and os.path.exists(a.taken) else set()
    total, out = 0, []
    for i in queue(a.lang, [], skip):
        m = body(os.path.join(ROOT, "content", "en", i + ".md"))
        if not m or LEVELED.search(m.group(2)) or BROKEN.search(m.group(2)): continue
        w = len(m.group(2).split())
        if w > a.max_record: continue
        if out and total + w > a.words: continue
        out.append(i); total += w
        if total > a.words * 0.9: break
    print("\n".join(out)); print(f"# {len(out)} records, {total} English words", file=sys.stderr)
else:
    bad = 0
    for i in a.ids:
        en, tr = body(os.path.join(ROOT, "content", "en", i + ".md")), os.path.join(ROOT, "content", a.lang, i + ".md")
        if not os.path.exists(tr): print(f"MISSING {i}"); bad += 1; continue
        m = body(tr)
        if not m: print(f"FAIL {i}: no frontmatter"); bad += 1; continue
        fm = yaml.safe_load(m.group(1)); problem = check(en.group(2), m.group(2), a.lang)
        if not problem and (fm.get("id") != i or fm.get("lang") != a.lang or fm.get("source_lang") != "en" or "provenance" not in fm or "translators" not in fm): problem = "frontmatter: id, lang, source_lang: en, translators and provenance are required"
        if not problem and en.group(2).count("*") != m.group(2).count("*"): problem = "the number of Markdown asterisks differs from the English"
        print(f"FAIL {i}: {problem}" if problem else f"ok   {i}"); bad += bool(problem)
    sys.exit(1 if bad else 0)
