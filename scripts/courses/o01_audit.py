#!/usr/bin/env python3
"""Statement 1: the audit is measured. Inventories the course class from the repository and the live site.

Every number in docs/courses-mission/AUDIT.md is a line of this oracle's output.
  python3 scripts/courses/o01_audit.py [--save] [--offline] [--at <commit>]   # --at measures data/course at another commit
"""
import collections, re, sys, yaml, subprocess, os
from lib import Oracle, ROOT, BASELINE, PRODUCTION, sh

at = sys.argv[sys.argv.index("--at") + 1] if "--at" in sys.argv else None
o = Oracle("01", "the audit is measured: course tree, schema use and live surface" + (f" (data read at {at[:10]})" if at else ""))


def read(path):
    if at:
        r = subprocess.run(f"git show {at}:{path}", shell=True, cwd=ROOT, capture_output=True, text=True)
        return r.stdout if r.returncode == 0 else None
    p = os.path.join(ROOT, path)
    return open(p, encoding="utf-8").read() if os.path.exists(p) else None


files = sh(f"git ls-tree --name-only {at or 'HEAD'} data/course/").splitlines()
cs = {}
for f in files:
    d = yaml.safe_load(read(f))
    cs[d["id"]] = d
kinds = collections.Counter(d["kind"] for d in cs.values())
o.note(f"records in data/course: {len(cs)}; by kind: {dict(sorted(kinds.items()))}")
review = collections.Counter((d.get("status") or {}).get("review") for d in cs.values())
o.note(f"status.review: {dict(review)}")
roots = [i for i, d in cs.items() if not d.get("part_of")]
o.note(f"tree roots (no part_of): {roots}")
orph = [i for i, d in cs.items() if d.get("part_of") and d["part_of"] not in cs]
o.note(f"records whose part_of is not a course record: {orph}")
prose = {l: len([f for f in sh(f"git ls-tree --name-only {at or 'HEAD'} content/{l}/course/").splitlines() if f.endswith(".md")]) for l in ("ar", "en", "ur")}
o.note(f"prose files under content/<lang>/course: {prose}")

lessons = {i: d for i, d in cs.items() if d["kind"] == "lesson"}
exps = [(i, e) for i, d in lessons.items() for e in d.get("expectations", [])]
o.note()
o.note(f"lessons: {len(lessons)}; expectation entries on lessons: {len(exps)}; distinct codes: {len(set(e['code'] for _, e in exps))}")
for lang in ("ar", "ur"):
    same = [(i, e["code"]) for i, e in exps if e["text"].get(lang) is not None and e["text"].get(lang).strip() == e["text"].get("en", "").strip()]
    miss = [(i, e["code"]) for i, e in exps if e["text"].get(lang) is None]
    o.note(f"PILOT DEFECT (a) lesson expectation texts whose `{lang}` is a byte copy of `en`: {len(same)} of {len(exps)}; with no `{lang}` at all: {len(miss)}")
unit_exps = [(i, e) for i, d in cs.items() if d["kind"] == "unit" for e in d.get("expectations", [])]
o.note(f"expectation entries on units: {len(unit_exps)}: " + "; ".join(f"{i.split('/')[1]} {e['code']}='{e['text'].get('en')}'" for i, e in unit_exps))

conns = [(i, c) for i, d in cs.items() for c in d.get("connections", [])]
o.note()
o.note(f"connections: {len(conns)} on {len(set(i for i, _ in conns))} records; per lesson min/max: {min(len(d.get('connections', [])) for d in lessons.values())}/{max(len(d.get('connections', [])) for d in lessons.values())}")
o.note(f"  by position: {dict(collections.Counter(c.get('position', '(none)') for _, c in conns))}")
o.note(f"  by kind: {dict(collections.Counter(c['kind'] for _, c in conns).most_common())}")
with_entity = [(i, c) for i, c in conns if c.get("entity")]
o.note(f"  with an entity link: {len(with_entity)}; without: {len(conns) - len(with_entity)}; distinct entities: {len(set(c['entity'] for _, c in with_entity))}")
unresolved = sorted(set(c["entity"] for _, c in with_entity if read(f"data/{c['entity']}.yaml") is None))
o.note(f"  entity links that are not a record file (stub or missing): {len(unresolved)} {unresolved}")
nosrc = [(i, c["title"]["en"]) for i, c in conns if not c.get("sources")]
o.note(f"  connections with no source: {len(nosrc)} {nosrc}")
srcs = collections.Counter(s for _, c in conns for s in c.get("sources", []))
o.note(f"  sources cited by connections: {dict(srcs.most_common())}")


def entity_sources(eid):
    """Every source id the entity's own record names (data file, anywhere) or cites in its prose."""
    out = set()
    t = read(f"data/{eid}.yaml") or ""
    out |= set(re.findall(r"source/[a-z0-9-]+", t)) | {"source/" + s for s in re.findall(r"\{cite:([a-z0-9-]+)", t)}
    for l in ("ar", "en", "ur"):
        t = read(f"content/{l}/{eid}.md") or ""
        out |= {"source/" + s for s in re.findall(r"\{cite:([a-z0-9-]+)", t)}
    return out


notown = []
for i, c in with_entity:
    es = entity_sources(c["entity"])
    if not any(s in es for s in c.get("sources", [])):
        notown.append(f"{i.split('/')[1]} -> {c['entity']} cites {c.get('sources')}")
o.note(f"PILOT DEFECT (provenance) entity-linked connections none of whose sources is cited by the linked record itself: {len(notown)} of {len(with_entity)}")
for x in notown:
    o.note("    " + x)
quran = [(i, c) for i, c in conns if c["kind"] == "quran"]
o.note(f"  quran connections: {len(quran)}; with a `ref`: {len([1 for _, c in quran if c.get('ref')])}; with an entity link to a passage record: {len([1 for _, c in quran if str(c.get('entity', '')).startswith('passage/')])}")
hon = [i for i, d in cs.items() if re.search("ﷺ|صلى الله عليه|عليه السلام|رضي الله عن|رحمه الله", yaml.safe_dump(d, allow_unicode=True))]
o.note(f"  records with a typed honorific: {len(hon)}")

# ---- the surface in the repository
o.note()
page = "site/src/pages/[lang]/learn/courses/index.astro"
src = read(page)
o.note(f"surface source: {page}: {len(src.splitlines())} lines; islands used: {re.findall(r'islands/(\\w+)', src)}")
el = read("site/src/layouts/EntityLayout.astro")
o.note(f"lesson rendering: site/src/layouts/EntityLayout.astro, {len([l for l in el.splitlines() if 'course' in l])} lines mention `course`; connection card: site/src/components/ConnCard.astro ({len(read('site/src/components/ConnCard.astro').splitlines())} lines)")
o.note(f"pages under /learn/: {sorted(x for x in os.listdir(os.path.join(ROOT, 'site/src/pages/[lang]/learn')))}")

# ---- the live site
if "--offline" not in sys.argv:
    o.note()
    def get(u):
        # curl, not urllib: the system Python on macOS ships without the CA bundle the site's certificate needs
        r = subprocess.run(["curl", "-sL", "-m", "40", "-w", "\n%{http_code}", PRODUCTION + u], capture_output=True, text=True)
        body, _, code = r.stdout.rpartition("\n")
        return int(code or 0), body
    st, stamp = get("/api/v1/meta/deploy.json")
    o.note(f"production stamp ({st}): {' '.join(stamp.split())}")
    live = {}
    for lang in ("ar", "en"):
        st, html = get(f"/{lang}/learn/courses/")
        links = sorted(set(re.findall(rf'href="/{lang}/course/([a-z0-9-]+)/"', html)))
        o.note(f"live /{lang}/learn/courses/: HTTP {st}, {len(html)} bytes, <select> controls: {html.count('<select')}, distinct course links in the served HTML: {len(links)} {links}")
        ok = 0
        for i in cs:
            s, h = get(f"/{lang}/course/{i.split('/')[1]}/")
            live[(lang, i)] = (s, h)
            ok += s == 200
        o.note(f"live /{lang}/course/<slug>/ pages answering 200: {ok} of {len(cs)}")
    # shortest path home -> lesson on the live site, counting interactions: with JS the picker is 3 selects (preselected) + open = 1 click to the subject; then unit, then lesson
    for lang in ("ar", "en"):
        s, subj = live[(lang, "course/ca-on-g6-science")]
        units = sorted(set(re.findall(rf'href="/{lang}/course/([a-z0-9-]+)/"', subj)) & {i.split("/")[1] for i, d in cs.items() if d["kind"] == "unit"})
        direct = sorted(set(re.findall(rf'href="/{lang}/course/([a-z0-9-]+)/"', subj)) & {i.split("/")[1] for i in lessons})
        o.note(f"live /{lang}/ subject page links to {len(units)} units and {len(direct)} lessons directly => shortest home->lesson path today: home -> subject (1) -> unit (2) -> lesson (3){'' if not direct else ' or 2 via direct links'}")
        s, les = live[(lang, "course/ca-on-g6-sci-bio-1")]
        o.note(f"live /{lang}/ lesson bio-1: connection cards rendered: {les.count('conn-card')}; next/previous-lesson link present: {'yes' if re.search(r'ca-on-g6-sci-bio-2', les) else 'no'}; any self-check/quiz markup: {'yes' if re.search('quiz|self-check|data-check', les) else 'no'}; untranslated expectation shown in Arabic page: {'yes' if lang == 'ar' and 'Assess the importance of biodiversity' in les else ('n/a' if lang == 'en' else 'no')}")

o.check("the tree is one rooted tree (one root, no orphan)", len(roots) == 1 and not orph)
o.check("every record is draft (pipeline output is never self-published)", set(review) == {"draft"}, str(dict(review)))
o.done("o01-audit" + ("-before" if at else ""))
