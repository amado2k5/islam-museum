#!/usr/bin/env python3
"""Statement 11: boundaries held. No page outside the courses surface changes its rendered output, except the two
changes the user asked for by name; no account, tracking or new external service is introduced.

The brief's boundary was "/ur/ untouched; nothing outside the courses surface changes". On 12 November 2026 the user
widened it twice, in writing: (a) everything in Arabic, English AND Urdu; (b) a section on the homepage presenting the
courses experience, and an Education Explorer card in the homepage's list of explorers. This oracle checks the boundary
as widened: those changes and nothing else.

Compared against the base: the commit of main this branch last merged (`git merge-base HEAD origin/main`). By then main
already held the mission's earlier phases (the Arabic and English surface, which reached it through release/uat), so
the surface's own files appear here as modified, not only as added; they are the surface and may change. Everything
else is held to the boundary.

1. From git: every file added under site/ belongs to the courses surface; the only existing files modified are the
   courses home, the homepage component and the three string files; each string file gains one top-level key and one
   entry in the explorers list and loses nothing; no layout, stylesheet, shared component or shell script changed (so
   every entity page is drawn by untouched code); no existing Urdu prose file is modified (new Urdu course files are added).
2. Rendered bytes: the three /learn/ hubs are byte-identical to the base's build; each homepage is byte-identical to
   the base's once the two additions (the courses section, the Education Explorer card) are cut out of it.
3. No account, tracking or external service in the added files; the script stores its own localStorage keys only.

  npm run graph && npm run derive && npx tsx scripts/time-browser.ts && npx tsx scripts/time-browser-explorer.ts
  python3 scripts/courses/o11_boundaries.py [--save]        # two scoped builds, about three minutes
"""
import filecmp, os, re, shutil, subprocess, yaml
from lib import Oracle, ROOT, sh
from scoped_build import build

BASE = sh("git merge-base HEAD origin/main")
o = Oracle("11", "boundaries held: nothing outside the courses surface changes except the homepage additions the user asked for; no account or tracking (statement 11)")
o.note(f"base: {BASE[:10]} (the commit of main this branch was cut from)")

# ---- 1. from git
changed = [l.split("\t") for l in sh(f"git diff --name-status {BASE} HEAD -- site i18n").splitlines() if l.strip()]
added = [c[-1] for c in changed if c[0] == "A"]
modified = [c[-1] for c in changed if c[0] != "A"]
o.note("Files under site/ and i18n/ that differ from the base:")
for c in changed:
    o.note(f"  {c[0]}  {c[-1]}")
MINE = ("site/src/lib/courses.ts", "site/src/components/CoursesStyle.astro", "site/src/components/CourseCard.astro", "site/src/components/CoursesPromo.astro", "site/src/components/courses.css", "site/src/components/courses-promo.css", "site/public/shell/courses.js", "site/src/components/CoursesLegacy.astro")
mine = lambda f: f.startswith("site/src/pages/[lang]/learn/courses/") or f in MINE
o.check("every added site file belongs to the courses surface", all(mine(f) for f in added), ", ".join(f for f in added if not mine(f)))
allowed = {"site/src/components/Landing.astro", "i18n/ar.yaml", "i18n/en.yaml", "i18n/ur.yaml"}
outside = sorted(f for f in set(modified) if not mine(f) and f not in allowed)
o.check("outside the courses surface, the only existing files modified are the homepage component and the three string files", not outside, ", ".join(outside))
for lang in ("ar", "en", "ur"):
    was = yaml.safe_load(subprocess.run(["git", "show", f"{BASE}:i18n/{lang}.yaml"], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
    now = yaml.safe_load(open(os.path.join(ROOT, "i18n", f"{lang}.yaml"), encoding="utf-8"))
    n_was, n_now = len(was.pop("courses", {}) or {}), len(now.pop("courses", {}) or {})
    entry = now["explore"]["pages"].pop("courses", None)
    was["explore"]["pages"].pop("courses", None)
    o.check(f"i18n/{lang}.yaml changes only inside its `courses` block ({n_was} keys before, {n_now} now) and by one explorers entry; every other string is unchanged", was == now and entry is not None and n_now >= n_was)
land = sh(f"git diff -U0 {BASE} HEAD -- site/src/components/Landing.astro")
lminus = [l for l in land.splitlines() if l.startswith("-") and not l.startswith("---")]
lplus = [l for l in land.splitlines() if l.startswith("+") and not l.startswith("+++")]
o.note(f"homepage component: {len(lplus)} lines added, {len(lminus)} replaced")
o.check("the homepage component changes only by additions (one existing line, the explorers list, is extended)", len(lminus) == 1 and "const EXPLORE" in lminus[0] and all(("courses" in l.lower() or l[1:].strip().startswith("//")) for l in lplus), "; ".join(lminus)[:200])
shell = [f for f in sh(f"git diff --name-only --diff-filter=MDR {BASE} HEAD -- site/src/styles site/src/layouts site/src/islands site/src/scripts site/public/shell site/astro.config.mjs").splitlines() if not mine(f)]
o.check("no layout, stylesheet, island or shell script changed (the surface's own script aside)", not shell, ", ".join(shell))
comp = [f for f in sh(f"git diff --name-only --diff-filter=MDR {BASE} HEAD -- site/src/components").splitlines() if f != "site/src/components/Landing.astro" and not mine(f)]
o.check("no existing component changed other than the homepage component", not comp, ", ".join(comp))
ur_mod = sh(f"git diff --name-only --diff-filter=MDR {BASE} HEAD -- content/ur")
o.check("no existing Urdu prose file is modified, renamed or deleted (Urdu course files are only added)", not ur_mod, ur_mod.replace("\n", ", ")[:300])
other = [f for f in sh(f"git diff --name-only {BASE} HEAD -- data content").splitlines() if not (f.startswith("data/course/") or re.match(r"content/(ar|en|ur)/course/", f) or re.match(r"data/source/ontario-curriculum-[a-z0-9-]+\.yaml$", f))]
o.check("under data/ and content/ only course records, course prose and Ontario curriculum source records changed", not other, ", ".join(other[:8]))
src_mod = sh(f"git diff --name-only --diff-filter=MDR {BASE} HEAD -- data/source")
o.check("no existing source record is modified", not src_mod, src_mod.replace("\n", ", "))

# ---- 2. rendered bytes
base_dir = os.path.join(ROOT, ".courses-base")
out_new, out_old = os.path.join(ROOT, ".cache", "courses-dist"), os.path.join(ROOT, ".cache", "courses-dist-base")
if os.path.isdir(base_dir):
    shutil.rmtree(base_dir)
os.makedirs(base_dir)
try:
    subprocess.run(f"git archive {BASE} site/src site/public/shell | tar -x -C '{base_dir}'", shell=True, check=True, cwd=ROOT)
    o.note()
    o.note("branch build:   " + build())
    o.note("base build:     " + build(os.path.join(base_dir, "site"), out_old))
    o.note("  (the base build uses the base's site/src; i18n/ and the data are the branch's, whose differences under i18n/ are the added keys checked above)")
finally:
    shutil.rmtree(base_dir)
same = []
for p in [f"{l}/learn/index.html" for l in ("ar", "en", "ur")]:
    a, b = os.path.join(out_old, p), os.path.join(out_new, p)
    ok = os.path.exists(a) and os.path.exists(b) and filecmp.cmp(a, b, shallow=False)
    same.append(ok)
    o.note(f"  {'identical' if ok else 'DIFFERENT'}  /{p}  ({os.path.getsize(b) if os.path.exists(b) else 'missing'} bytes)")
o.check("the three /learn/ hubs are byte-identical to the base's build", all(same), f"{sum(same)} of 3 identical")
home_ok = []
for l in ("ar", "en", "ur"):
    a = open(os.path.join(out_old, l, "index.html"), encoding="utf-8").read()
    b = open(os.path.join(out_new, l, "index.html"), encoding="utf-8").read()
    n_sec = len(re.findall(r'<section class="band cxp"', b))
    cut = re.sub(r'<section class="band cxp".*?</section>', "", b, count=1, flags=re.S)
    n_card = len(re.findall(r'data-thumb="courses"', cut))
    cut = re.sub(r'<li class="xcard"[^>]*>\s*<div class="thumb"[^>]*data-thumb="courses".*?</li>', "", cut, count=1, flags=re.S)
    ws = lambda s: re.sub(r"\s+", " ", s)
    ok = ws(cut) == ws(a)
    home_ok.append(ok and n_sec == 1 and n_card == 1)
    o.note(f"  /{l}/ homepage: courses sections {n_sec}, Education Explorer cards {n_card}; with those two cut out, {'identical to the base' if ok else 'STILL DIFFERENT from the base'} (whitespace between tags ignored); {len(b) - len(a)} bytes added")
o.check("each homepage differs from the base only by the courses section and the Education Explorer card", all(home_ok), f"{sum(home_ok)} of 3")

# ---- 3. no account, tracking or external service
bad = []
surface = [f for f in sh("git ls-files site").splitlines() if mine(f)]
o.note(f"files of the courses surface read for network calls and storage: {len(surface)}")
for f in surface:
    t = open(os.path.join(ROOT, f), encoding="utf-8").read()
    for pat in (r"https?://", r"\bfetch\(", r"XMLHttpRequest", r"sendBeacon", r"document\.cookie", r"<iframe", r"<form", r"WebSocket", r"navigator\.(geolocation|mediaDevices)", r"sessionStorage", r"indexedDB"):
        if re.search(pat, t):
            bad.append(f"{f}: {pat}")
o.check("the surface's files hold no network call, cookie, third-party address, form, or storage other than localStorage", not bad, "; ".join(sorted(set(bad))))
js = open(os.path.join(ROOT, "site/public/shell/courses.js"), encoding="utf-8").read()
keys = sorted(set(re.findall(r'"(courses:[a-z]+)"', js)))
o.check("the script writes only its own localStorage keys", keys == ["courses:done", "courses:last", "courses:probe"], str(keys))
o.done("o11-boundaries")
