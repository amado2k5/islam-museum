#!/usr/bin/env python3
"""Public-claims audit: the figures any public statement about the museum has to agree with.

Standing rule: AGENTS.md, "Truth in every public claim" (founder instruction, 15 November 2026).
Ledger and open items: docs/audit/public-claims-audit-2026-11-15.md.

What it reads: data/ (every record file), site/src/lib/grand-tour.ts and tour/grand-tour.yaml. Nothing else, and it
writes nothing. No dependencies: the YAML is read by pattern, as scripts/report/canon.py and the scripts/fable oracles
read it, so every figure below is a count of files that match a stated pattern, not a parse of the graph. Where the
site's own numbers exist (site/src/lib/numbers.ts, /api/v1/meta/counts.json) those are the published figures; this
report is the cross-check and the breakdown they do not give.

Usage:
  python3 scripts/report/claims_audit.py            # Markdown to stdout
  python3 scripts/report/claims_audit.py --root .   # the same, from another working directory

Definitions (keep them in step with the ledger when one changes):
  content record    a file under data/<class>/ other than class `source`; `_stubs.d` is not counted
  AI-named          `generated_by` names a model, agent or vendor (the AI pattern below)
  script-made       `generated_by` is present and names none (the Qur'an text from Tanzil is the bulk)
  book source       a source record whose `type` is book, chapter, manuscript or thesis
  wiki source       a source record whose text carries a wikipedia.org or wikidata.org address, or the general
                    `source/wikidata` record
  preliminary card  a record whose own text says its sources are "not yet checked on the page"
                    (the Wikidata-import cards described in docs/outreach/unesco-nomination-dossier.md A.5)
"""
import argparse, collections, os, re, subprocess, sys

AI = re.compile(r"devin|claude|muse|copilot|codex|gemini|grok|gpt|antigravity|cursor|haiku|sonnet|opus|kiro|qwen|llama|swe-\d", re.I)
BOOK_TYPES = {"book", "chapter", "manuscript", "thesis"}
PRELIM = re.compile(r"not yet checked on the page|لم تُراجع مصادره على الصفحة")
SRC_ID = re.compile(r"source/[A-Za-z0-9_][A-Za-z0-9_.\-]*")


def read(path):
    with open(path, encoding="utf-8", errors="replace") as f:
        return f.read()


def top_status_review(text):
    """`review:` inside the record's own top-level `status:` key, inline or block form."""
    m = re.search(r"^status:[ \t]*(\{[^\n]*\})?[ \t]*\n?((?:[ \t]+[^\n]*\n?)*)", text, re.M)
    if not m:
        return "(none)"
    body = (m.group(1) or "") + (m.group(2) or "")
    r = re.search(r"review:\s*\"?([a-z_\-]+)", body)
    return r.group(1) if r else "(none)"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
    args = ap.parse_args()
    root = os.path.abspath(args.root)
    data = os.path.join(root, "data")

    # --- source records -------------------------------------------------------------------------------------------
    src_type, src_wiki = {}, {}
    src_dir = os.path.join(data, "source")
    for fn in sorted(os.listdir(src_dir)):
        if not fn.endswith(".yaml"):
            continue
        t = read(os.path.join(src_dir, fn))
        sid = "source/" + fn[:-5]
        m = re.search(r"^type:\s*(\S+)", t, re.M)
        src_type[sid] = m.group(1) if m else "?"
        src_wiki[sid] = sid == "source/wikidata" or bool(re.search(r"wikipedia\.org|wikidata\.org", t, re.I))
    n_src = len(src_type)
    n_src_book = sum(1 for v in src_type.values() if v in BOOK_TYPES)
    n_src_wiki = sum(1 for v in src_wiki.values() if v)

    # --- content records ------------------------------------------------------------------------------------------
    by_class = collections.Counter()
    review = collections.Counter()
    made = collections.Counter()               # AI-named / script-made / no tag
    made_published = collections.Counter()     # the same, among review: published
    grounding = collections.Counter()
    cited = collections.Counter()
    for cls in sorted(os.listdir(data)):
        d = os.path.join(data, cls)
        if not os.path.isdir(d) or cls == "source" or cls.startswith("_"):
            continue
        for dp, _dn, fns in os.walk(d):
            for fn in fns:
                if not fn.endswith(".yaml"):
                    continue
                t = read(os.path.join(dp, fn))
                by_class[cls] += 1
                rv = top_status_review(t)
                review[rv] += 1
                tags = re.findall(r"generated_by:\s*\"?([^\"\n}]+)", t)
                kind = "no tag" if not tags else ("AI-named" if any(AI.search(x) for x in tags) else "script-made")
                made[kind] += 1
                if rv == "published":
                    made_published[kind] += 1
                srcs = {s for s in SRC_ID.findall(t) if s in src_type}
                for s in srcs:
                    cited[s] += 1
                if PRELIM.search(t):
                    grounding["preliminary card (sources not yet checked on the page)"] += 1
                elif not srcs:
                    grounding["no source record cited"] += 1
                elif any(src_type[s] in BOOK_TYPES for s in srcs):
                    grounding["cites at least one book source"] += 1
                elif all(src_wiki[s] for s in srcs):
                    grounding["Wikipedia or Wikidata only"] += 1
                else:
                    grounding["other sources only (text editions online, datasets, websites, catalogues)"] += 1
    n = sum(by_class.values())

    # --- the Grand Tour -------------------------------------------------------------------------------------------
    tour_langs, tour_stops = "?", "?"
    p = os.path.join(root, "site", "src", "lib", "grand-tour.ts")
    if os.path.exists(p):
        m = re.search(r"TOUR_LANGS[^=]*=\s*\[([^\]]*)\]", read(p))
        if m:
            tour_langs = ", ".join(re.findall(r"\"([a-z]+)\"", m.group(1)))
    p = os.path.join(root, "tour", "grand-tour.yaml")
    if os.path.exists(p):
        tour_stops = len(re.findall(r"^\s*- id:\s*\S+", read(p), re.M))
    course_kinds = collections.Counter()
    cdir = os.path.join(data, "course")
    if os.path.isdir(cdir):
        for fn in os.listdir(cdir):
            if fn.endswith(".yaml"):
                m = re.search(r"^kind:\s*(\S+)", read(os.path.join(cdir, fn)), re.M)
                course_kinds[m.group(1) if m else "?"] += 1

    try:
        head = subprocess.run(["git", "-C", root, "log", "-1", "--format=%h %ad", "--date=short"], capture_output=True, text=True).stdout.strip()
    except OSError:
        head = ""

    def pct(x, of):
        return f"{100 * x / of:.1f}%" if of else "n/a"

    out = []
    out.append(f"Measured at `{head or 'unknown commit'}` by `python3 scripts/report/claims_audit.py`. Counts are pattern matches over `data/`.")
    out.append("")
    out.append("| Measure | Count | Share |")
    out.append("|---|---|---|")
    out.append(f"| Record files under `data/` (content + source) | {n + n_src:,} | |")
    out.append(f"| Source (bibliography) records | {n_src:,} | {pct(n_src, n + n_src)} of all |")
    out.append(f"| ... of type book, chapter, manuscript or thesis | {n_src_book:,} | {pct(n_src_book, n_src)} of sources |")
    out.append(f"| ... Wikipedia or Wikidata pages | {n_src_wiki:,} | {pct(n_src_wiki, n_src)} of sources |")
    out.append(f"| Content records (everything but sources) | {n:,} | |")
    for k in ("draft", "published"):
        out.append(f"| Content records in review state `{k}` | {review[k]:,} | {pct(review[k], n)} |")
    other = n - review["draft"] - review["published"]
    out.append(f"| Content records in any other review state, or none | {other:,} | {pct(other, n)} |")
    for k in ("AI-named", "script-made", "no tag"):
        out.append(f"| Content records whose `generated_by` is {k} | {made[k]:,} | {pct(made[k], n)} |")
    pub = review["published"]
    out.append(f"| `published` content records whose `generated_by` is AI-named | {made_published['AI-named']:,} | {pct(made_published['AI-named'], pub)} of published |")
    for k, v in grounding.most_common():
        out.append(f"| Grounding: {k} | {v:,} | {pct(v, n)} |")
    out.append(f"| Grand Tour stops (`tour/grand-tour.yaml`) | {tour_stops} | |")
    out.append(f"| Grand Tour languages (`TOUR_LANGS`) | {tour_langs} | |")
    out.append(f"| Education Explorer: subject courses / lessons | {course_kinds['subject']} / {course_kinds['lesson']} | |")
    out.append("")
    out.append("| Content records by class | Count |")
    out.append("|---|---|")
    for k, v in by_class.most_common():
        out.append(f"| {k} | {v:,} |")
    out.append("")
    out.append("| Most-cited source records | Type | Content records citing it |")
    out.append("|---|---|---|")
    for s, v in cited.most_common(15):
        out.append(f"| `{s}` | {src_type[s]}{' (wiki)' if src_wiki[s] else ''} | {v:,} |")
    print("\n".join(out))


if __name__ == "__main__":
    sys.exit(main())
