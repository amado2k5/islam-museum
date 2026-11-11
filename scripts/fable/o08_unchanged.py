#!/usr/bin/env python3
"""Statement 8, last clause: the rest of the site renders exactly as before.

Two proofs, both mechanical.

1. What the branch changed under site/ and i18n/, from git: the only existing site file touched is the homepage
   component (the entry link); everything else is new files of the Tour; the i18n files gain one top-level key each.
2. Rendered bytes: the homepage and the nine wing landings, in Arabic, English and Urdu, are built twice by the same
   scoped production build over the SAME data (the current graph artifact): once with the baseline commit's site
   source, scripts and strings, once with the branch's. Every page must be byte-identical, except the Arabic and
   English homepages, whose only difference must be the entry link.

Entity pages are not rendered here (there are about 162,000 of them); for them the proof is part 1: the entity layout
and everything it imports are untouched.

  npm run graph && npm run derive && python3 scripts/fable/o08_unchanged.py      # about ten minutes (two builds)
"""
import filecmp, os, re, shutil, subprocess
from fable import Oracle, BASELINE, ROOT, sh

o = Oracle("08b", "the rest of the site renders exactly as before (statement 8, last clause)", needs_graph=False)

# ---- 1. what changed, from git ----
changed = [l.split("\t") for l in sh(f"git diff --name-status {BASELINE} HEAD -- site i18n").splitlines() if l.strip()]
added = [c[-1] for c in changed if c[0] == "A"]
modified = [c[-1] for c in changed if c[0] != "A"]
o.note("Files under site/ and i18n/ that differ from the baseline commit:")
for c in changed:
    o.note(f"  {c[0]}  {c[-1]}")
tour_new = lambda f: f.startswith("site/src/pages/[lang]/grand-tour/") or f in ("site/src/lib/grand-tour.ts", "site/src/components/GrandTourRibbon.astro", "site/public/shell/grand-tour.js")
o.check("every added site file belongs to the Tour", all(tour_new(f) for f in added), ", ".join(f for f in added if not tour_new(f)))
allowed_mod = {"site/src/components/Landing.astro", "i18n/ar.yaml", "i18n/en.yaml", "i18n/ur.yaml"}
o.check("the only existing files modified are the homepage component and the three string files", set(modified) <= allowed_mod, ", ".join(sorted(set(modified) - allowed_mod)))
land = sh(f"git diff {BASELINE} HEAD -- site/src/components/Landing.astro")
plus = [l[1:] for l in land.splitlines() if l.startswith("+") and not l.startswith("+++")]
minus = [l for l in land.splitlines() if l.startswith("-") and not l.startswith("---")]
o.check("the homepage component gains one import and one link, on the line that already held the day cards, and nothing else changes", len(plus) == 2 and len(minus) == 1 and "grand-tour" in plus[0] and plus[1].strip().startswith(minus[0][1:].strip()) and "tourPath(lang)" in plus[1] and "TOUR_LANGS.includes(lang)" in plus[1], f"{len(plus)} lines added, {len(minus)} replaced")
for lang in ("ar", "en", "ur"):
    d = sh(f"git diff -U0 {BASELINE} HEAD -- i18n/{lang}.yaml")
    removed = [l for l in d.splitlines() if l.startswith("-") and not l.startswith("---")]
    top = [l[1:] for l in d.splitlines() if l.startswith("+") and not l.startswith("+++") and re.match(r"\+[A-Za-z_]", l)]
    o.check(f"i18n/{lang}.yaml gains exactly one top-level key, grand_tour, and loses nothing", not removed and top == ["grand_tour:"], f"removed {len(removed)}; new top-level keys {top}")
o.check("no existing stylesheet, layout or shell script changed", not sh(f"git diff --name-only --diff-filter=MDR {BASELINE} HEAD -- site/src/styles site/src/layouts site/public/shell site/src/scripts"))
o.check("the Tour adds no script to the site's bundle: its one script is a plain file under shell/", not [f for f in added if f.startswith("site/src/scripts/")] and "site/public/shell/grand-tour.js" in added)

# ---- 2. rendered bytes: baseline templates against branch templates, same data ----
base = os.path.join(ROOT, ".fable-base")
out_new, out_old = os.path.join(ROOT, ".cache", "fable-dist"), os.path.join(ROOT, ".cache", "fable-dist-base")
shutil.rmtree(base, ignore_errors=True)
os.makedirs(base)
try:
    # the baseline commit's site source, extracted beside the repository; both builds then run from the same folder
    subprocess.run(f"git archive {BASELINE} site/src | tar -x -C '{base}'", shell=True, check=True, cwd=ROOT)
    script = os.path.join(ROOT, "scripts", "fable", "scoped-build.sh")
    r1 = subprocess.run(["sh", script], cwd=ROOT, capture_output=True, text=True)
    r2 = subprocess.run(["sh", script], cwd=ROOT, capture_output=True, text=True, env={**os.environ, "FABLE_SRC": os.path.join(base, "site"), "FABLE_OUT": out_old})
    o.note()
    o.note("branch build:   " + (r1.stdout.strip().splitlines() or ["(no output)"])[-1].replace(ROOT, "."))
    o.note("baseline build: " + (r2.stdout.strip().splitlines() or ["(no output)"])[-1].replace(ROOT, "."))
    o.note("  (the baseline build uses the baseline commit's site/src; scripts/, i18n/ and the data are the branch's, whose only differences under those folders are listed above)")
    o.check("both scoped builds completed", r1.returncode == 0 and r2.returncode == 0, (r1.stderr[-300:] + r2.stderr[-300:]).strip())
finally:
    shutil.rmtree(base, ignore_errors=True)

if os.path.isdir(out_old) and os.path.isdir(out_new):
    old_pages = sorted(os.path.relpath(os.path.join(d, f), out_old) for d, _, fs in os.walk(out_old) for f in fs if f == "index.html")
    same, differ, missing = [], [], []
    for rel in old_pages:
        b = os.path.join(out_new, rel)
        if not os.path.exists(b):
            missing.append(rel)
        elif filecmp.cmp(os.path.join(out_old, rel), b, shallow=False):
            same.append(rel)
        else:
            differ.append(rel)
    new_only = sorted(os.path.relpath(os.path.join(d, f), out_new) for d, _, fs in os.walk(out_new) for f in fs if f == "index.html" and not os.path.exists(os.path.join(out_old, os.path.relpath(os.path.join(d, f), out_new))))
    o.note(f"pages rendered by the baseline's templates: {len(old_pages)}; byte-identical under the branch's templates: {len(same)}; different: {len(differ)}; missing: {len(missing)}")
    o.note(f"pages only the branch renders: {len(new_only)} ({sum(1 for p in new_only if '/grand-tour/' in '/' + p)} under grand-tour/)")
    o.check("no existing page is missing from the branch build", not missing, ", ".join(missing))
    o.check("every page the branch adds is under /ar/grand-tour/ or /en/grand-tour/", all(re.match(r"(ar|en)/grand-tour/", p) for p in new_only), ", ".join(p for p in new_only if not re.match(r"(ar|en)/grand-tour/", p)))
    home = ["ar/index.html", "en/index.html", "index.html"]  # index.html is the Arabic homepage served at the site root
    o.check("the only pages whose bytes differ are the Arabic and English homepages (the root page is the Arabic homepage)", sorted(differ) == home, ", ".join(differ))
    js = lambda d: sorted(f for f in os.listdir(os.path.join(d, "_astro")) if f.endswith(".js"))
    o.check("the bundled script files are the same files, with the same hashed names, in both builds", js(out_old) == js(out_new), f"{len(js(out_old))} in the baseline build, {len(js(out_new))} in the branch build")
    ur = [p for p in old_pages if p.startswith("ur/")]
    o.check("every /ur/ page is byte-identical, and no /ur/ page is added", all(p in same for p in ur) and not any(p.startswith("ur/") for p in new_only), f"{len(ur)} /ur/ pages compared")
    link = re.compile(r'<p class="ui" style="margin:1\.6rem 0 0"><a class="btn btn-lapis" href="/(ar|en)/grand-tour/">[^<]*<span class="flip" aria-hidden="true">→</span></a></p>')
    for rel in differ:
        a = open(os.path.join(out_old, rel), encoding="utf-8").read()
        b = open(os.path.join(out_new, rel), encoding="utf-8").read()
        stripped, n = link.subn("", b)
        o.check(f"{rel}: with the one entry link taken out, the page is byte-identical to the baseline's", n == 1 and stripped == a, f"{n} entry link(s) found; {len(b) - len(a)} bytes longer")
o.finish()
