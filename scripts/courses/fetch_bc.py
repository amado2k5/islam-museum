#!/usr/bin/env python3
"""Fetch one British Columbia course from the Ministry of Education and Child Care's curriculum site and archive it.

The province publishes its curriculum at https://curriculum.gov.bc.ca as web pages: for each course, its Big Ideas,
its Curricular Competencies and its Content learning standards. The page is the authority's own publication.

  python3 scripts/courses/fetch_bc.py social-studies/8/core bc-social-studies-8
      # <the page's path under /curriculum/>  <archive slug>

British Columbia publishes NO codes for its learning standards. The schema needs a code, so this fetcher assigns one
from the document's own order and marks it as the museum's: `§BI1`, `§C3`, `§CC5` (Big Idea 1, Content standard 3,
Curricular Competency 5). The `§` says "numbered by the museum, in the authority's order; not an official code".
The page's elaborations (sample topics, key questions) are not extracted: they are the Ministry's suggestions, not standards.

Writes .cache/curricula/<slug>/page.html and official.json (never committed) and the manifest docs/courses/curricula/<slug>.json.
"""
import datetime, hashlib, html, json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BASE = "https://curriculum.gov.bc.ca/curriculum/"
SECTIONS = [("Big Ideas", "BI"), ("Content", "C"), ("Curricular Competency", "CC")]


def text(s):
    s = re.sub(r"<[^>]+>", " ", s or "")
    return re.sub(r"\s+", " ", html.unescape(s).replace(" ", " ")).strip()


def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    path, slug = sys.argv[1].strip("/"), sys.argv[2]
    out = os.path.join(ROOT, ".cache", "curricula", slug)
    os.makedirs(out, exist_ok=True)
    url = BASE + path
    dest = os.path.join(out, "page.html")
    r = subprocess.run(["curl", "-sL", "-m", "120", "-A", "Mozilla/5.0 (curriculum archive)", "-o", dest, "-w", "%{http_code}", url], capture_output=True, text=True)
    if r.stdout.strip() != "200":
        raise SystemExit(f"FETCH FAILED ({r.stdout.strip()}): {url}\nDo not fill the gap from memory or a third-party copy. Stop and report.")
    t = open(dest, encoding="utf-8", errors="replace").read()
    # the page's own course heading (e.g. "Social Studies 8"); the <title> is the site's name
    h = re.search(r'<h1[^>]*>(.*?)</h1>', t, re.S) or re.search(r'class="[^"]*page-title[^"]*"[^>]*>(.*?)<', t, re.S)
    title = text(h.group(1)) if h else ""
    if not title:
        subj, grade = path.split("/")[0], path.split("/")[1]
        title = f"{subj.replace('-', ' ').title()} {grade.upper() if not grade.isdigit() else grade}" + ("" if path.split("/")[-1] == "core" else " — " + path.split("/")[-1].replace("-", " ").title())
    marks = [(m.start(), m.group(1)) for m in re.finditer(r'<h2 lang="en"[^>]*>(Big Ideas|Content|Curricular Competency)</h2>', t)]
    strands = []
    for k, (pos, name) in enumerate(marks):
        chunk = t[pos: marks[k + 1][0] if k + 1 < len(marks) else len(t)]
        abbr = dict(SECTIONS)[name]
        items = []
        for m in re.finditer(r'<span class="field-content">(.*?)</span></div>', chunk, re.S):
            body = m.group(1)
            a = re.search(r'<a [^>]*class="node\d+"[^>]*>(.*?)</a>', body, re.S)
            s = text(a.group(1)) if a else text(re.split(r'<div class="alert', body)[0])
            if s and s not in [i["text"] for i in items]:
                items.append({"code": f"§{abbr}{len(items) + 1}", "text": s})
        if items:
            strands.append({"letter": abbr, "title": name if name != "Curricular Competency" else "Curricular Competencies", "overall": [{"code": f"§{abbr}", "title": name, "text": name, "specific": items}]})
    if not strands or not any(s["letter"] == "C" for s in strands):
        raise SystemExit("EXTRACTION FAILED: no Content learning standards found on the page. Check the path; stop and report; do not invent standards.")
    official = {"course": title, "path": path, "strands": strands, "codes": "assigned by the museum from the document's order (marked §); the authority publishes none"}
    json.dump(official, open(os.path.join(out, "official.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    sha = lambda f: hashlib.sha256(open(os.path.join(out, f), "rb").read()).hexdigest()
    manifest = {
        "slug": slug, "authority": "British Columbia Ministry of Education and Child Care", "course": title,
        "curriculum": {"title": title, "url": url},
        "retrieved_utc": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "addresses": {"page.html": url}, "sha256": {f: sha(f) for f in ("page.html", "official.json")},
        "codes": official["codes"],
        "counts": {s["title"]: len(s["overall"][0]["specific"]) for s in strands},
        "note": "Raw files are archived under .cache/curricula/<slug>/ and are not committed (docs/sources-policy.md). Re-run this script to fetch them again.",
    }
    os.makedirs(os.path.join(ROOT, "docs", "courses", "curricula"), exist_ok=True)
    json.dump(manifest, open(os.path.join(ROOT, "docs", "courses", "curricula", slug + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"fetched {url} -> .cache/curricula/{slug}/ ; manifest docs/courses/curricula/{slug}.json ; course title: {title!r}")
    for s in strands:
        print(f"  {s['title']}: {len(s['overall'][0]['specific'])} standards")


if __name__ == "__main__":
    main()
