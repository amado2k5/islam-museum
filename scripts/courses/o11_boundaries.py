#!/usr/bin/env python3
"""Statement 11: boundaries held. /ur/ untouched; no page outside the courses surface changes its rendered output;
no account, tracking or new external service introduced.

Compared against the integration base: release/uat with phase 1 merged (commit 841cdc52c4), which is what this branch
was merged with before the surface was built. Everything the branch differs by, under site/ and i18n/, is this mission's.

Three proofs, all mechanical.
1. From git: every file the mission added under site/ belongs to the courses surface; the only existing files it
   modified are the courses home and the Arabic and English string files, which gain one top-level key and lose nothing;
   no layout, stylesheet, shared component or shell script changed (so every entity page, including /course/<slug>/, is
   drawn by untouched code); nothing Urdu changed: not i18n/ur.yaml, not content/ur/, not a `ur:` value in data/.
2. Rendered bytes: the Urdu courses home and the three /learn/ hubs are built twice by the same scoped production build
   over the same data, once with the integration base's site source and once with the branch's, and must be identical
   byte for byte.
3. No account, tracking or external service: the files the mission added contain no network call, no cookie, no
   third-party address and no form that posts anywhere; the script stores two localStorage keys and nothing else.

  npm run graph && npm run derive && python3 scripts/courses/o11_boundaries.py [--save]      # two scoped builds, about two minutes
"""
import filecmp, os, re, shutil, subprocess
from lib import Oracle, ROOT, sh
from scoped_build import build

BASE = "841cdc52c4a90eb7fbb14b462b86757f63d4b587"
o = Oracle("11", "boundaries held: Urdu untouched, the rest of the site renders as before, no account or tracking (statement 11)")
o.note(f"integration base: {BASE[:10]} (release/uat with phase 1 merged)")

# ---- 1. from git
changed = [l.split("\t") for l in sh(f"git diff --name-status {BASE} HEAD -- site i18n").splitlines() if l.strip()]
added = [c[-1] for c in changed if c[0] == "A"]
modified = [c[-1] for c in changed if c[0] != "A"]
o.note("Files under site/ and i18n/ that differ from the integration base:")
for c in changed:
    o.note(f"  {c[0]}  {c[-1]}")
mine = lambda f: f.startswith("site/src/pages/[lang]/learn/courses/") or f in ("site/src/lib/courses.ts", "site/src/components/CoursesStyle.astro", "site/src/components/CourseCard.astro", "site/src/components/CoursesLegacy.astro", "site/src/components/courses.css", "site/public/shell/courses.js")
o.check("every added site file belongs to the courses surface", all(mine(f) for f in added), ", ".join(f for f in added if not mine(f)))
allowed = {"site/src/pages/[lang]/learn/courses/index.astro", "i18n/ar.yaml", "i18n/en.yaml"}
o.check("the only existing files modified are the courses home and the Arabic and English string files", set(modified) <= allowed, ", ".join(sorted(set(modified) - allowed)))
for lang in ("ar", "en"):
    d = sh(f"git diff -U0 {BASE} HEAD -- i18n/{lang}.yaml")
    removed = [l for l in d.splitlines() if l.startswith("-") and not l.startswith("---")]
    top = [l[1:] for l in d.splitlines() if l.startswith("+") and not l.startswith("+++") and re.match(r"\+[A-Za-z_]", l)]
    o.check(f"i18n/{lang}.yaml gains exactly one top-level key, courses, and loses nothing", not removed and top == ["courses:"], f"removed {len(removed)}; new top-level keys {top}")
o.check("no layout, stylesheet, existing component, island or shell script changed", not sh(f"git diff --name-only --diff-filter=MDR {BASE} HEAD -- site/src/styles site/src/layouts site/src/components site/src/islands site/src/scripts site/public/shell site/astro.config.mjs"))
o.check("the surface adds no script to the site's bundle: its one script is a plain file under shell/", not [f for f in added if f.startswith("site/src/scripts/")] and "site/public/shell/courses.js" in added)
ur_files = sh(f"git diff --name-only {BASE} HEAD -- i18n/ur.yaml content/ur 'site/src/pages/ur'")
o.check("no Urdu string file, Urdu prose file or Urdu page changed", not ur_files, ur_files.replace("\n", ", "))
data_diff = sh(f"git diff -U0 {BASE} HEAD -- data")
ur_lines = [l for l in data_diff.splitlines() if re.match(r"^[-+]\s+ur:", l)]
o.check("no `ur:` value in data/ was added, changed or removed", not ur_lines, f"{len(ur_lines)} lines")
built_ur = [p for p in ("ur/learn/courses/ca-on-g6-science",) if os.path.isdir(os.path.join(ROOT, ".cache", "courses-dist", p))]

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
    o.note("  (the base build uses the integration base's site/src; i18n/ and the data are the branch's, whose only differences under i18n/ are the added key checked above)")
finally:
    shutil.rmtree(base_dir)
pages = ["ur/learn/courses/index.html"] + [f"{l}/learn/index.html" for l in ("ar", "en", "ur")]
same = []
for p in pages:
    a, b = os.path.join(out_old, p), os.path.join(out_new, p)
    ok = os.path.exists(a) and os.path.exists(b) and filecmp.cmp(a, b, shallow=False)
    same.append(ok)
    o.note(f"  {'identical' if ok else 'DIFFERENT'}  /{p}  ({os.path.getsize(b) if os.path.exists(b) else 'missing'} bytes)")
o.check("the Urdu courses home and the three /learn/ hubs are byte-identical to the integration base's build", all(same), f"{sum(same)} of {len(pages)} identical")
ur_new = sorted(d for d in os.listdir(os.path.join(out_new, "ur", "learn", "courses")))
o.check("no Urdu page of the new surface is generated (the Urdu courses folder holds only its home)", ur_new == ["index.html"], str(ur_new))

# ---- 3. no account, tracking or external service
bad = []
for f in added:
    t = open(os.path.join(ROOT, f), encoding="utf-8").read()
    for pat in (r"https?://", r"\bfetch\(", r"XMLHttpRequest", r"sendBeacon", r"document\.cookie", r"<iframe", r"<form", r"WebSocket", r"navigator\.(geolocation|mediaDevices)", r"sessionStorage", r"indexedDB"):
        for m in re.finditer(pat, t):
            bad.append(f"{f}: {pat}")
o.check("the added files hold no network call, cookie, third-party address, form, or storage other than localStorage", not bad, "; ".join(sorted(set(bad))))
js = open(os.path.join(ROOT, "site/public/shell/courses.js"), encoding="utf-8").read()
keys = sorted(set(re.findall(r'"(courses:[a-z]+)"', js)))
o.check("the script writes only its own localStorage keys", keys == ["courses:done", "courses:last", "courses:probe"], str(keys))
o.done("o11-boundaries")
