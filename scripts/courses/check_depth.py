#!/usr/bin/env python3
"""The mechanical half of the depth rubric (docs/courses/depth-rubric.md, section 8).

  python3 scripts/courses/check_depth.py course/<subject-slug> [course/<subject-slug> ...]
  python3 scripts/courses/check_depth.py --all-enriched      # every course with at least one depth section
  python3 scripts/courses/check_depth.py --lesson course/<lesson-slug>   # one lesson, while writing

Prints `DEPTH: GREEN` or every failing line and `DEPTH: RED`. It reads the files only: no graph build is needed.
What it cannot judge (whether a question needs reasoning, whether an attribution is fair) is the reader's check, section 9.
"""
import os, re, sys
from lib import ROOT, courses, tree, entity_sources

# heading -> key, per language; the order of KEYS is the order the rubric asks for
KEYS = ["go", "why", "two", "mis", "how", "think", "museum"]
HEAD = {
    "en": {"Go deeper": "go", "Why they did it": "why", "Two views": "two", "Often misunderstood": "mis", "How do we know?": "how", "Think about it": "think", "Into the museum": "museum"},
    "ar": {"تعمّق": "go", "لماذا فعلوا ذلك؟": "why", "رأيان": "two", "خطأ شائع": "mis", "كيف نعرف؟": "how", "فكّر في هذا": "think", "إلى المتحف": "museum"},
}
REQUIRED = {"go", "think", "museum"}
ELEMENTARY_FORBIDDEN = {"why", "two", "mis", "how"}       # Grades 1-5: one idea done well
GO_MAX = {1: 110, 2: 160, 3: 200}                          # words, with slack over the rubric's upper bound
LINKS = {1: (2, 3), 2: (2, 4), 3: (2, 5)}  # the rubric aims at 3+ from Grade 6; two is the floor, never padded
HONORIFICS = ["ﷺ", "صلى الله عليه وسلم", "عليه السلام", "رضي الله عنه", "رضي الله عنها", "رحمه الله", "(pbuh)", "(PBUH)", "peace be upon him"]
ARABIC = re.compile(r"[؀-ۿ]")

fails, notes = [], []


def read(path):
    p = os.path.join(ROOT, path)
    return open(p, encoding="utf-8").read() if os.path.exists(p) else None


def sections(md):
    body = md.split("---", 2)[-1]
    out, cur = [], None
    for line in body.splitlines():
        m = re.match(r"^##\s+(.*?)\s*$", line)
        if m:
            cur = [m.group(1), []]
            out.append(cur)
        elif cur:
            cur[1].append(line)
    return [(h, "\n".join(b).strip()) for h, b in out]


def plain(t):
    t = re.sub(r"\[\[[^\]|]+\|([^\]]*)\]\]", r"\1", t)
    t = re.sub(r"\[\[([^\]]+)\]\]", r"\1", t)
    t = re.sub(r"\{cite:[^}]*\}", " ", t)
    t = t.replace("⁦", "").replace("⁩", "")
    t = re.sub(r"[*_`]", "", t)
    t = t.translate(str.maketrans({"“": '"', "”": '"', "‘": "'", "’": "'", " ": " "}))
    return re.sub(r"\s+", " ", t).strip()


def words(t):
    return len(plain(t).split())


def band_of(cs, lesson_id):
    p = lesson_id
    while p in cs:
        if cs[p].get("kind") == "grade":
            g = cs[p].get("grade_number")
            return 1 if g <= 5 else 2 if g <= 8 else 3
        p = cs[p].get("part_of")
    return None


def record_text(eid):
    """Everything a record says in English: its data file and its English prose (the evidence column quotes this)."""
    return plain((read(f"data/{eid}.yaml") or "") + "\n" + (read(f"content/en/{eid}.md") or ""))


def check_lesson(cs, lid, evidence_rows):
    slug = lid.split("/")[1]
    band = band_of(cs, lid)
    conn_entities = [c.get("entity") for c in cs[lid].get("connections", []) if c.get("entity")]
    found = {}
    for lang in ("ar", "en"):
        md = read(f"content/{lang}/{lid}.md")
        if md is None:
            fails.append(f"{slug} [{lang}]: no prose file")
            continue
        secs = sections(md)
        deep = [(HEAD[lang][h], b) for h, b in secs if h in HEAD[lang]]
        other = HEAD["en" if lang == "ar" else "ar"]
        for h, _b in secs:
            if h in other:
                fails.append(f"{slug} [{lang}]: heading '{h}' belongs to the other language")
        keys = [k for k, _ in deep]
        found[lang] = keys
        if not keys:
            continue
        if len(set(keys)) != len(keys):
            fails.append(f"{slug} [{lang}]: a depth heading appears twice")
        if keys != sorted(keys, key=KEYS.index):
            fails.append(f"{slug} [{lang}]: sections out of the rubric's order: {keys}")
        for k in REQUIRED - set(keys):
            fails.append(f"{slug} [{lang}]: required section missing: {k}")
        if band == 1:
            for k in ELEMENTARY_FORBIDDEN & set(keys):
                fails.append(f"{slug} [{lang}]: section '{k}' is not used in Grades 1-5")
        names = [h for h, _ in secs]
        tryi = [i for i, h in enumerate(names) if re.match(r"^(Try this|جرّب هذا|جرب هذا)$", h)]
        depi = [i for i, h in enumerate(names) if h in HEAD[lang]]
        if tryi and depi and max(depi) > tryi[0]:
            fails.append(f"{slug} [{lang}]: depth sections must come before 'Try this'")
        linked_here, cited = set(conn_entities), set()
        for k, body in deep:
            where = f"{slug} [{lang}] {k}"
            if not body:
                fails.append(f"{where}: empty section")
            for line in body.splitlines():
                if line.lstrip().startswith(">"):
                    fails.append(f"{where}: block quote (quote inline, at most 40 words)")
                    break
            if re.search(r"[﴿﴾]", body):
                fails.append(f"{where}: Qur'an brackets: the text of the Qur'an is never typed")
            for h in HONORIFICS:
                if h in body:
                    fails.append(f"{where}: typed honorific '{h}'")
            if re.search(r"<[a-zA-Z/][^>]*>", body):
                fails.append(f"{where}: raw HTML")
            for m in re.finditer(r"\(([^()]*)\)", body):
                if ARABIC.search(m.group(1)) and body[max(0, m.start() - 1):m.start()] != "⁦":
                    fails.append(f"{where}: a parenthesis holding Arabic script is not wrapped in U+2066 ... U+2069: ({m.group(1)[:30]})")
            for m in re.finditer(r"\[\[([^\]|]+)(?:\|[^\]]*)?\]\]", body):
                eid = m.group(1)
                if read(f"data/{eid}.yaml") is None:
                    fails.append(f"{where}: [[{eid}]] is not a record")
                elif not eid.startswith("passage/") and read(f"content/{lang}/{eid}.md") is None and read(f"content/ar/{eid}.md") is None and read(f"content/en/{eid}.md") is None:
                    fails.append(f"{where}: [[{eid}]] has no prose: it gives the student nothing to read")
                linked_here.add(eid)
            cited |= {(k, s) for s in re.findall(r"\{cite:([a-z0-9-]+)", body)}
            for q in re.findall(r"“([^”]*)”|«([^»]*)»|\"([^\"]*)\"", body):
                n = len(plain("".join(q)).split())
                if n > 40:
                    fails.append(f"{where}: a quotation of {n} words (40 at most)")
            if k == "think" and not re.search(r"[?؟]\s*$", plain(body)):
                fails.append(f"{where}: 'Think about it' must end in a question")
            if k == "go":
                n = words(body)
                if band and n > GO_MAX[band]:
                    fails.append(f"{where}: {n} words, over the band's limit of {GO_MAX[band]}: one thing seen closely, not a second summary")
                if not re.search(r"\{cite:", body):
                    fails.append(f"{where}: no citation: every factual sentence carries its record's citation")
            if k == "museum":
                n = len(re.findall(r"\[\[", body))
                lo, hi = LINKS.get(band, (2, 5))
                if n < lo or n > hi:
                    fails.append(f"{where}: {n} links (this band asks for {lo} to {hi})")
        allowed = set()
        for e in linked_here:
            allowed |= entity_sources(e)
        for k, s in sorted(cited):
            if "source/" + s not in allowed:
                fails.append(f"{slug} [{lang}] {k}: {{cite:{s}}} is not cited by any record this lesson links (rubric 5.4)")
    a, e = found.get("ar", []), found.get("en", [])
    if a != e:
        fails.append(f"{slug}: Arabic and English do not carry the same depth sections: ar={a} en={e}")
    if e:
        rows = [r for r in evidence_rows if r[0] == slug]
        if not rows:
            fails.append(f"{slug}: no rows under '## Depth layer' in the evidence file")
        for r in rows:
            eid, quoted = r[3].strip("` "), r[4]
            if read(f"data/{eid}.yaml") is None:
                fails.append(f"{slug} evidence: '{eid}' is not a record")
                continue
            text = record_text(eid)
            frags = [f.strip() for q in re.findall(r'"([^"]+)"', plain(quoted)) for f in re.split(r"\s*\.\.\.\s*|\s*…\s*", q) if f.strip()]
            if not frags:
                fails.append(f"{slug} evidence ({eid}): no quoted record sentence")
            for f in frags:
                if len(f.split()) > 40:
                    fails.append(f"{slug} evidence ({eid}): a quotation over 40 words")
                if f.rstrip(".,;:") not in text:
                    fails.append(f"{slug} evidence ({eid}): not found in the record: \"{f[:80]}\"")
    return bool(e)


def evidence(subject_slug):
    t = read(f"docs/courses/evidence/{subject_slug}.md") or ""
    body = t.split("## Depth layer", 1)[1] if "## Depth layer" in t else ""
    # while several writers share one course, each keeps its rows in a file of its own and names it here; a coordinator
    # moves the rows into the evidence file before the course is shipped
    extra = os.environ.get("DEPTH_EVIDENCE_EXTRA")
    if extra and os.path.exists(extra):
        body += "\n" + open(extra, encoding="utf-8").read()
    rows = []
    for line in body.splitlines():
        if line.startswith("|") and not re.match(r"^\|\s*(Lesson|-+)\s*\|", line):
            cells = [c.strip() for c in re.split(r"(?<!\\)\|", line.strip().strip("|"))]
            if len(cells) >= 5:
                rows.append(cells[:4] + [" | ".join(cells[4:])])
    return rows


def main():
    cs = courses()
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    subjects = [i for i, d in cs.items() if d.get("kind") == "subject"]
    def subject_of(lid):
        p = lid
        while p in cs and cs[p].get("kind") != "subject":
            p = cs[p].get("part_of")
        return p
    if "--lesson" in sys.argv:
        todo = {}
        for lid in args:
            todo.setdefault(subject_of(lid), []).append(lid)
    else:
        if "--all-enriched" in sys.argv:
            args = subjects
        todo = {s: [i for i in tree(cs, s) if cs[i].get("kind") == "lesson"] for s in args}
    enriched = total = 0
    for s, lessons in sorted(todo.items()):
        rows = evidence(s.split("/")[1])
        n = sum(check_lesson(cs, l, rows) for l in sorted(lessons))
        if "--all-enriched" in sys.argv and n == 0:
            continue
        enriched += n
        total += len(lessons)
        if n < len(lessons) and "--lesson" not in sys.argv:
            notes.append(f"{s}: {n} of {len(lessons)} lessons carry a depth layer")
        print(f"{s}: {n}/{len(lessons)} lessons with a depth layer")
    for n in notes:
        print("note:", n)
    for f in fails:
        print("FAIL", f)
    print(f"\n{enriched} of {total} lessons checked carry a depth layer; {len(fails)} failing line(s)")
    print("DEPTH: GREEN" if not fails else "DEPTH: RED")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
