#!/usr/bin/env python3
"""The ingestion gate for one course (docs/courses-mission/PIPELINE.md, step 7). A course is "ingested" only when this
prints `RESULT: GREEN`, `npm run validate` prints `0 errors` and cite-check prints `0 fail`.

  python3 scripts/courses/check_course.py course/<subject-slug> --official .cache/curricula/<slug>/official.json [--strict] [--save]

A course is a subject record with everything above it (grade, jurisdiction) and below it (units, lessons).
What is checked, and why each exists:

  TREE        the subject hangs under a grade under a jurisdiction; units under the subject; lessons under units.
  DRAFT       every record is status.review: draft with status.generated_by. Pipeline output is never published.
  SOURCE      every record cites the curriculum source, which is a source record whose URL is the authority's.
  FIDELITY    every expectation code exists in the authority's document, and the text in the authority's language
              equals quote_official(official text) exactly (scripts/courses/lib.py: the 40-word quotation rule).
  COVERAGE    every specific expectation of the authority's document is either in a lesson or in the gap register.
  LANGUAGE    no text is a copy of another language's text passed off as a translation. Arabic is required on
              labels, summaries and connection texts; with --strict, so are English and Urdu, on those and on the
              expectations. A language not yet translated is absent, never copied.
  MAPPING     every connection links a real record (not a stub), which the alias search can find; a Qur'an connection
              links the passage record and cites only the Tanzil source.
  PROVENANCE  every source a connection cites was already cited by its linked record at the baseline commit:
              the enrichment says nothing the museum did not already cite.
  GAPS        every gap-register entry names its expectation and shows at least two searches that found nothing usable.
  PROSE       every record has Arabic and English prose with the right front matter; a lesson's has a Brief.

--strict is for courses the pipeline produced: every lesson must have at least one connection and every connection an
entity. Without it (the pilot), those two are reported but do not fail.
"""
import json, os, re, sys, yaml
from lib import Oracle, ROOT, BASELINE, courses, tree, exists, baseline_has, quote_official, entity_sources

args = sys.argv[1:]
sid = args[0]
official_path = args[args.index("--official") + 1] if "--official" in args else None
strict = "--strict" in args
slug = sid.split("/")[1]
o = Oracle("course", f"ingestion gate for {sid}" + (" (strict)" if strict else ""))
o.out_dir = os.path.join(ROOT, "docs", "courses", "gates")  # a course's gate output lives with the course's other files
cs = courses()
import lib as _lib
_mine = [u for u in _lib.UNPARSEABLE if u[0].startswith(slug)]
for u in _lib.UNPARSEABLE:
    o.note(f"course file that does not parse{' (THIS course)' if u in _mine else ' (another course; skipped)'}: {u[0]}: {u[1]}")
o.check("every record file of this course parses", not _mine, ", ".join(u[0] for u in _mine))
if sid not in cs or cs[sid].get("kind") != "subject":
    o.check("the subject record exists", False, sid)
    o.done(f"check-{slug}")
subj = cs[sid]
ids = tree(cs, sid)
recs = {i: cs[i] for i in ids}
up, p = [], subj.get("part_of")
while p in cs:
    up.append(p)
    p = cs[p].get("part_of")
units = [i for i in ids if recs[i]["kind"] == "unit"]
lessons = [i for i in ids if recs[i]["kind"] == "lesson"]
o.note(f"records: 1 subject, {len(units)} units, {len(lessons)} lessons; above it: {up}")

# ---- TREE
kinds_up = [cs[i]["kind"] for i in up]
o.check("TREE the subject hangs under a grade under a jurisdiction", kinds_up[:1] == ["grade"] and "jurisdiction" in kinds_up, str(kinds_up))
bad = [i for i in units if recs[i].get("part_of") != sid] + [i for i in lessons if recs[i].get("part_of") not in units]
o.check("TREE units hang on the subject and lessons on units", not bad and len(lessons) > 0, ", ".join(bad))
listed = [(i, x) for i in [sid] + units for x in recs[i].get("lessons", []) if x not in recs or recs[x].get("part_of") != i]
o.check("TREE every `lessons:` list names its own children", not listed, str(listed))
dup = [i for i in units + [sid] if len({recs[c].get("order") for c in ids if recs[c].get("part_of") == i}) != len([c for c in ids if recs[c].get("part_of") == i])]
o.check("TREE siblings have distinct `order`", not dup, ", ".join(dup))

# ---- DRAFT
allrecs = {**recs, **{i: cs[i] for i in up}}
notdraft = [i for i, d in allrecs.items() if (d.get("status") or {}).get("review") != "draft" or not (d.get("status") or {}).get("generated_by")]
o.check("DRAFT every record is draft and names what generated it", not notdraft, ", ".join(notdraft))

# ---- SOURCE
csrc = [s for s in subj.get("sources", [])]
src_ok = bool(csrc) and all(exists(s) for s in csrc)
o.check("SOURCE the subject cites a curriculum source that is a source record", src_ok, str(csrc))
missing_src = [i for i, d in recs.items() if not set(csrc) & set(d.get("sources", []))]
o.check("SOURCE every record of the course cites the curriculum source", not missing_src, ", ".join(missing_src))

# ---- FIDELITY and COVERAGE
gap_path = os.path.join(ROOT, "docs", "courses", "gaps", slug + ".yaml")
gaps = (yaml.safe_load(open(gap_path, encoding="utf-8")) or {}).get("gaps", []) if os.path.exists(gap_path) else []
if official_path:
    off = json.load(open(os.path.join(ROOT, official_path), encoding="utf-8"))
    juris = next((cs[i] for i in up if cs[i]["kind"] == "jurisdiction"), {})
    lang = (juris.get("language_of_instruction") or ["en"])[0]
    spec = {s["code"]: s["text"] for st in off["strands"] for ov in st["overall"] for s in ov["specific"]}
    overall = {ov["code"]: ov["text"] for st in off["strands"] for ov in st["overall"]}
    o.note(f"authority's document: {official_path}: {len(off['strands'])} strands, {len(overall)} overall and {len(spec)} specific expectations; official language `{lang}`")
    exact = short = 0
    wrong = []
    for i in lessons + units:
        for e in recs[i].get("expectations", []):
            src = spec.get(e["code"]) or overall.get(e["code"])
            mine = (e.get("text") or {}).get(lang, "")
            if src is None:
                wrong.append(f"{i.split('/')[1]} {e['code']}: no such code in the authority's document")
            elif mine == src:
                exact += 1
            elif mine == quote_official(src):
                short += 1
            else:
                wrong.append(f"{i.split('/')[1]} {e['code']}: text differs from the authority's")
    o.note(f"expectation entries: {exact + short + len(wrong)}; identical to the official text: {exact}; identical under the 40-word quotation rule (examples marked […], long texts cut with …): {short}; wrong: {len(wrong)}")
    o.check("FIDELITY every expectation is the authority's code and text", not wrong and exact + short > 0, " | ".join(wrong[:8]) + (f" (+{len(wrong) - 8} more)" if len(wrong) > 8 else ""))
    in_lessons = {e["code"] for i in lessons for e in recs[i].get("expectations", [])}
    in_gaps = {g.get("code") for g in gaps}
    uncovered = sorted(set(spec) - in_lessons - in_gaps)
    both = sorted(in_lessons & in_gaps)
    o.note(f"specific expectations in a lesson: {len(set(spec) & in_lessons)}; in the gap register: {len(set(spec) & in_gaps)}; in neither: {len(uncovered)}")
    o.check("COVERAGE every specific expectation is in a lesson or in the gap register", not uncovered, ", ".join(uncovered))
    o.check("COVERAGE no expectation is both taught and registered as a gap", not both, ", ".join(both))
    badgap = [g.get("code") for g in gaps if g.get("code") not in spec or g.get("text") != quote_official(spec.get(g.get("code"), "")) or len(g.get("searches", [])) < 2 or not g.get("why")]
    o.check("GAPS every gap entry carries the official code and text, at least two searches, and the reason", not badgap, ", ".join(map(str, badgap)))
else:
    o.note("no --official file given: FIDELITY, COVERAGE and GAPS are not checked in this run")

# ---- LANGUAGE
def localized(d, path=""):
    if isinstance(d, dict):
        if d and all(re.fullmatch(r"[a-z]{2,3}", str(k)) for k in d) and all(isinstance(v, str) for v in d.values()):
            yield path, d
        else:
            for k, v in d.items():
                yield from localized(v, f"{path}.{k}" if path else str(k))
    elif isinstance(d, list):
        for n, v in enumerate(d):
            yield from localized(v, f"{path}[{n}]")
copies, no_ar = [], []
for i, d in recs.items():
    for path, loc in localized({k: d.get(k) for k in ("label", "summary", "subject_name", "expectations", "connections")}):
        langs = list(loc)
        for a in range(len(langs)):
            for b in range(a + 1, len(langs)):
                if loc[langs[a]].strip() == loc[langs[b]].strip() and len(loc[langs[a]]) > 3:
                    copies.append(f"{i.split('/')[1]} {path}: {langs[a]} = {langs[b]}")
        if "ar" not in loc and not path.startswith("expectations"):
            no_ar.append(f"{i.split('/')[1]} {path}")
o.note(f"texts that are a byte copy of another language's text: {len(copies)}")
o.check("LANGUAGE no text is a copy of another language passed off as a translation", not copies, " | ".join(copies[:6]) + (f" (+{len(copies) - 6} more)" if len(copies) > 6 else ""))
o.check("LANGUAGE Arabic is present on every label, summary and connection", not no_ar, " | ".join(no_ar[:6]))
if strict:
    miss = [f"{i.split('/')[1]} {path}: no {l}" for i, d in recs.items() for path, loc in localized({k: d.get(k) for k in ("label", "summary", "subject_name", "expectations", "connections")}) for l in ("ar", "en", "ur") if l not in loc]
    o.check("LANGUAGE (strict) every text is present in Arabic, English and Urdu", not miss, " | ".join(miss[:6]) + (f" (+{len(miss) - 6} more)" if len(miss) > 6 else ""))
untr = sum(1 for i in lessons for e in recs[i].get("expectations", []) if "ar" not in (e.get("text") or {}))
o.note(f"lesson expectation texts with no Arabic yet (shown in the official language, labelled): {untr}")

# ---- MAPPING and PROVENANCE
KINDS = {"reflection", "story", "scholar", "invention", "career", "quran", "hadith", "place", "object"}
conns = [(i, c) for i in lessons for c in recs[i].get("connections", [])]
shape = [f"{i.split('/')[1]}: {c.get('title', {}).get('en')}" for i, c in conns if c.get("position") not in ("before", "within", "after") or c.get("kind") not in KINDS or not c.get("sources") or not (c.get("title") or {}).get("en") or not (c.get("text") or {}).get("en")]
o.check("MAPPING every connection has a position, a kind, a title, a text and at least one source", not shape, " | ".join(shape))
linked = [(i, c) for i, c in conns if c.get("entity")]
stubs = sorted({c["entity"] for _, c in linked if not exists(c["entity"])})
o.note(f"connections: {len(conns)}; linking a record: {len(linked)}; distinct records: {len({c['entity'] for _, c in linked})}; links that are not a record: {len(stubs)} {stubs}")
o.check("MAPPING every linked entity is a real record", not stubs, ", ".join(stubs))
qbad = []
for i, c in conns:
    if c.get("kind") == "quran":
        m = re.fullmatch(r"(\d+):(\d+)", str(c.get("ref", "")))
        if not m or c.get("entity") != f"passage/quran-{m.group(1)}-{m.group(2)}" or not exists(c.get("entity", "x/x")) or c.get("sources") != ["source/tanzil-quran"]:
            qbad.append(f"{i.split('/')[1]} {c.get('ref')}")
o.check("MAPPING every Qur'an connection links its passage record and cites only the Tanzil text", not qbad, ", ".join(qbad))
unknown_src = sorted({s for _, c in conns for s in c.get("sources", []) if not exists(s)})
o.check("PROVENANCE every cited source is a source record", not unknown_src, ", ".join(unknown_src))
new_src = sorted({s for _, c in conns for s in c.get("sources", []) if not baseline_has(f"data/{s}.yaml")})
o.check("PROVENANCE every source a connection cites existed at the baseline commit", not new_src, ", ".join(new_src))
notown = []
for i, c in linked:
    if not exists(c["entity"]):
        continue
    own = entity_sources(c["entity"], BASELINE) | ({"source/tanzil-quran"} if c["entity"].startswith("passage/quran-") else set())
    extra = [s for s in c.get("sources", []) if s not in own]
    if extra:
        notown.append(f"{i.split('/')[1]} -> {c['entity']}: {extra}")
o.note(f"entity-linked connections citing a source their record did not cite at the baseline: {len(notown)} of {len(linked)}")
o.check("PROVENANCE every source a connection cites was already cited by its linked record at the baseline", not notown, " | ".join(notown[:6]) + (f" (+{len(notown) - 6} more)" if len(notown) > 6 else ""))
loose = [f"{i.split('/')[1]}: {c['title'].get('en')}" for i, c in conns if not c.get("entity")]
empty = [i.split("/")[1] for i in lessons if not recs[i].get("connections")]
o.note(f"connections with no entity link: {len(loose)}; lessons with no connection: {len(empty)}")
if strict:
    o.check("MAPPING (strict) every connection links a record", not loose, " | ".join(loose[:6]))
    o.check("MAPPING (strict) every lesson has at least one connection", not empty, ", ".join(empty))

# ---- PROSE
pbad = []
for i, d in recs.items():
    for l in (("ar", "en", "ur") if strict else ("ar", "en")):
        f = os.path.join(ROOT, "content", l, i + ".md")
        if not os.path.exists(f):
            pbad.append(f"{l}/{i.split('/')[1]}: missing")
            continue
        t = open(f, encoding="utf-8").read()
        if f"id: {i}" not in t or f"lang: {l}" not in t:
            pbad.append(f"{l}/{i.split('/')[1]}: front matter")
        elif d["kind"] == "lesson" and not re.search(r"^## (Brief|موجز|مختصر)\s*$", t, re.M):
            pbad.append(f"{l}/{i.split('/')[1]}: no Brief section")
o.check("PROSE every record has prose in Arabic and English (and Urdu when strict) with the right front matter; lessons have a Brief", not pbad, " | ".join(pbad[:8]))
o.done(f"check-{slug}")
