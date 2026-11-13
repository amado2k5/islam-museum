#!/usr/bin/env python3
"""Audit S18: turn a section-style browser template into a paginated one (site/src/lib/paged.ts). One-off tool, kept
for the record of what was done to the 26 templates. It refuses a template that does not have the family's shape.
  python3 scripts/audit/paginate-codemod.py <dir under site/src/pages/[lang]/> [...]"""
import re, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
PAGES = ROOT / "site/src/pages/[lang]"
for d in sys.argv[1:]:
    p = PAGES / d / "index.astro"
    s = p.read_text(encoding="utf8")
    depth = d.count("/") + 1
    up = "../" * (depth + 2)
    def one(pattern, flags=0):
        m = re.findall(pattern, s, flags)
        if len(m) != 1: raise SystemExit(f"{d}: expected one match of {pattern!r}, found {len(m)}")
        return re.search(pattern, s, flags)
    gsp = one(r"export function getStaticPaths\(\) \{ return LANGS\.map\(\(lang\) => \(\{ params: \{ lang \}, props: \{ lang \} \}\)\); \}")
    ids = one(r"(?m)^const sectionIds(?:: [A-Za-z\[\]]+)? = (.+);$")
    sec = one(r"(?m)^const sections = sectionIds\.map\(\(id\) => \(\{ id, items: (\w+)\.filter\(\(i\) => (.+?)\) \}\)\)\.filter\(\(s\) => s\.items\.length > 0\);$")
    items, pred = sec.group(1), sec.group(2)
    lab = one(r"<h3 id=\{`t-\$\{s\.id\}`\}[^>]*>\{([^}]+\?\? s\.id)\}</h3>")
    label_expr = lab.group(1)
    title = one(r"<BaseLayout lang=\{lang\} title=\{([\w.]+)\.title\} description=\{[\w.]+\.lede\} path=\{`/\$\{lang\}/" + re.escape(d) + r"/`\}>")
    G = title.group(1)
    s = s.replace(gsp.group(0), f"""export function getStaticPaths() {{
  // the landing, and a sub-page for every page of rows of each section longer than the landing shows (site/src/lib/paged.ts)
  const ids = {ids.group(1)};
  return pagedStaticPaths(LANGS, ids.map((id) => ({{ id: String(id), count: {items}.filter((i) => {pred}).length }})));
}}""")
    s = s.replace(sec.group(0), sec.group(0) + f"""
const paged = pageView(sections, Astro.props as PagedProps, `/${{lang}}/{d}/`);
const pagedLabel = (s: {{ id: string }}) => {label_expr};
const pagedTitle = paged.landing ? {G}.title : `${{{G}.title}} · ${{pagedLabel(paged.sections[0])}}${{paged.pager && paged.pager.pageNo > 1 ? ` · ${{paged.pager.pageNo}}` : ""}}`;""")
    s = s.replace(title.group(0), f"<BaseLayout lang={{lang}} title={{pagedTitle}} description={{{G}.lede}} path={{paged.path}}>")
    n = s.count("href={`#t-${s.id}`}")
    if n != 1: raise SystemExit(f"{d}: {n} section chips")
    s = s.replace("href={`#t-${s.id}`}", "href={`${paged.home}#t-${s.id}`}")
    body = one(r"\{sections\.map\(\(s\) => \(\n(\s*)<section data-")
    s = s.replace(body.group(0), body.group(0).replace("{sections.map(", "{paged.sections.map("))
    i = s.index("{s.items.map((i) => (")
    j = s.index("</ol>", i) + len("</ol>")
    indent = re.search(r"\n(\s*)</ol>$", s[:j]).group(1)
    s = s[:j] + f"\n{indent}<PagedNav lang={{lang}} paged={{paged}} section={{s}} label={{pagedLabel(s)}} />" + s[j:]
    if s.count("<div data-pagefind-body>") != 1: raise SystemExit(f"{d}: pagefind body")
    s = s.replace("<div data-pagefind-body>", "<div data-pagefind-body={paged.landing || undefined}>")
    imp = f'import BaseLayout from "{up}layouts/BaseLayout.astro";'
    if s.count(imp) != 1: raise SystemExit(f"{d}: layout import")
    s = s.replace(imp, imp + f'\nimport PagedNav from "{up}components/PagedNav.astro";\nimport {{ pagedStaticPaths, pageView, type PagedProps }} from "{up}lib/paged";')
    p.write_text(s, encoding="utf8")
    subprocess.check_call(["git", "mv", str(p), str(PAGES / d / "[...page].astro")])
    print(f"{d}: paginated ({items}, label {label_expr})")
