#!/usr/bin/env python3
"""Everything a connection text may be written from: one record's own data, prose and sources. Nothing else.

  python3 scripts/courses/entity_brief.py person/al-khwarizmi [--lang ar|en|both] [--full]

Prints the record's labels, summary, dated fields, the sources it cites (the only sources a connection to it may cite)
and its prose in Arabic and English with the citation markers left in, so each sentence you restate keeps its source.
Long prose is cut to its first 2,500 characters per language (some records run to 12,000 words); --full prints it all.
If the fact you want is not printed here, the museum does not hold it: do not write it.
"""
import os, re, sys, yaml

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def main():
    eid = sys.argv[1]
    lang = sys.argv[sys.argv.index("--lang") + 1] if "--lang" in sys.argv else "both"
    full = "--full" in sys.argv
    f = os.path.join(ROOT, "data", eid + ".yaml")
    if not os.path.exists(f):
        raise SystemExit(f"{eid}: NOT A RECORD (no data/{eid}.yaml). A stub is not a record. Run find_entity.py with more spellings.")
    raw = open(f, encoding="utf-8").read()
    d = yaml.safe_load(raw)
    print(f"RECORD {eid}   status.review: {(d.get('status') or {}).get('review')}")
    print(f"label: {d.get('label')}")
    for k in ("kind", "roles", "born", "died", "date", "built", "start", "end", "periods", "regions", "themes", "author", "located_in"):
        if d.get(k) is not None:
            print(f"{k}: {str(d[k])[:300]}")
    for l in ("ar", "en"):
        if lang in (l, "both") and (d.get("summary") or {}).get(l):
            print(f"\nsummary.{l}: {d['summary'][l]}")
    edu = (d.get("education") or {}).get("did_you_know") or {}
    for l in ("ar", "en"):
        if lang in (l, "both") and edu.get(l):
            print(f"\neducation.did_you_know.{l}: {edu[l]}")
    srcs = set(re.findall(r"source/[a-z0-9-]+", raw)) | {"source/" + s for s in re.findall(r"\{cite:([a-z0-9-]+)", raw)}
    for l in ("ar", "en"):
        p = os.path.join(ROOT, "content", l, eid + ".md")
        if os.path.exists(p):
            t = open(p, encoding="utf-8").read()
            srcs |= {"source/" + s for s in re.findall(r"\{cite:([a-z0-9-]+)", t)}
            if lang in (l, "both"):
                body = t.split('---', 2)[-1].strip()
                cut = "" if full or len(body) <= 2500 else f"\n[... {len(body) - 2500} more characters: run again with --full to read them before you restate anything from further down]"
                print(f"\n----- prose ({l}) -----\n{body if full else body[:2500]}{cut}")
    print("\n----- SOURCES THIS RECORD CITES (a connection to it may cite only these) -----")
    for s in sorted(srcs):
        sf = os.path.join(ROOT, "data", s + ".yaml")
        lab = ""
        if os.path.exists(sf):
            lab = (yaml.safe_load(open(sf, encoding="utf-8")).get("label") or {}).get("en", "")
        print(f"  {s}   {lab if os.path.exists(sf) else '(NOT A SOURCE RECORD: do not cite)'}")


if __name__ == "__main__":
    main()
