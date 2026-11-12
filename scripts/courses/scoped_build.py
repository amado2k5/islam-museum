#!/usr/bin/env python3
"""A scoped production build for the courses-mission oracles.

The same `astro build`, config, layouts, components, styles and data as the real site, over a page tree that holds only
the pages the oracles look at:
    /[lang]/learn/courses/**   the courses surface
    /[lang]/learn/index        a neighbour, for the boundary oracle
    /[lang]/ and /             the homepage, which carries the section on the courses experience
A full build renders about 164,000 pages; this one renders a few dozen in about a minute. The method is the Grand Tour
run's (scripts/fable/scoped-build.sh on release/uat): site/src is copied verbatim into a sibling folder at the same depth,
so every relative import resolves as in the real tree.

    python3 scripts/courses/scoped_build.py                      # needs .cache/graph.json and .cache/derived (npm run graph && npm run derive)
    python3 scripts/courses/scoped_build.py --src <site folder> --out <folder>   # the same build over another site source

Astro derives hashed names from the source path, so two builds are comparable byte for byte only when built at the same
path: --src lets o11_boundaries.py build the baseline's site source through this same folder.
"""
import os, shutil, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TMP = os.path.join(ROOT, ".courses-site")
CFG = os.path.join(ROOT, "site", ".astro-courses.config.mjs")
PAGES = ["[lang]/learn/courses", "[lang]/learn/index.astro", "[lang]/index.astro", "index.astro"]


def build(src=None, out=None):
    src = src or os.path.join(ROOT, "site")
    out = out or os.path.join(ROOT, ".cache", "courses-dist")
    for folder in (TMP, out):
        if os.path.isdir(folder):
            shutil.rmtree(folder)
    try:
        os.makedirs(os.path.join(TMP, "src", "pages", "[lang]", "learn"))
        os.makedirs(os.path.join(TMP, "public", "api", "v1", "meta"))
        for d in ("components", "data", "islands", "layouts", "lib", "scripts", "styles"):
            if os.path.isdir(os.path.join(src, "src", d)):
                shutil.copytree(os.path.join(src, "src", d), os.path.join(TMP, "src", d))
        for p in PAGES:
            a, b = os.path.join(src, "src", "pages", p), os.path.join(TMP, "src", "pages", p)
            if os.path.isdir(a):
                shutil.copytree(a, b)
            elif os.path.exists(a):
                shutil.copy(a, b)
        os.symlink(os.path.join(ROOT, "site", "node_modules"), os.path.join(TMP, "node_modules"))
        for f in ("shell", "brand", "vendor", "favicon.svg", "favicon-32.png", "favicon-64.png", "apple-touch-icon.png"):
            a = os.path.join(src, "public", f)
            if os.path.isdir(a):
                shutil.copytree(a, os.path.join(TMP, "public", f))
            elif os.path.exists(a):
                shutil.copy(a, os.path.join(TMP, "public", f))
        counts = os.path.join(ROOT, "site", "public", "api", "v1", "meta", "counts.json")
        if os.path.exists(counts):
            shutil.copy(counts, os.path.join(TMP, "public", "api", "v1", "meta", "counts.json"))
        with open(CFG, "w") as f:
            f.write('import base from "./astro.config.mjs";\n'
                    f'export default {{ ...base, srcDir: "{TMP}/src", publicDir: "{TMP}/public", outDir: "{out}", integrations: base.integrations.filter((i) => i.name !== "@astrojs/sitemap") }};\n')
        r = subprocess.run(["npx", "astro", "build", "--config", ".astro-courses.config.mjs"], cwd=os.path.join(ROOT, "site"), capture_output=True, text=True)
        if r.returncode:
            print(r.stdout[-3000:], r.stderr[-3000:])
            raise SystemExit("scoped build FAILED")
    finally:
        if os.path.isdir(TMP):
            shutil.rmtree(TMP)
        if os.path.exists(CFG):
            os.remove(CFG)
    n = sum(1 for _d, _s, fs in os.walk(out) for f in fs if f == "index.html")
    probe = os.path.join(out, "en", "learn", "courses", "index.html")
    if "<style" not in open(probe, encoding="utf-8").read():
        raise SystemExit("scoped build FAILED: the built pages carry no stylesheet")
    head = subprocess.run("git rev-parse --short HEAD", shell=True, cwd=ROOT, capture_output=True, text=True).stdout.strip()
    dirty = len(subprocess.run("git status --porcelain -- site data content i18n", shell=True, cwd=ROOT, capture_output=True, text=True).stdout.splitlines())
    line = f"scoped build: {n} pages -> {os.path.relpath(out, ROOT)}, stylesheet inlined (site source {os.path.relpath(src, ROOT)}; repository commit {head}; uncommitted paths under site/ data/ content/ i18n/: {dirty})"
    print(line)
    return line


if __name__ == "__main__":
    a = sys.argv[1:]
    build(a[a.index("--src") + 1] if "--src" in a else None, a[a.index("--out") + 1] if "--out" in a else None)
