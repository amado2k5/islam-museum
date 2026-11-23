#!/usr/bin/env python3
"""Generic localized-string Word round for the turkish-indonesian lane (azure docx batches).

Covers what data_strings.py does not: i18n/<lang>.yaml and every other yaml tree with
{ar,en,...} language blocks (edu/, kids/, tour/, cards/, datasets/, wt3/, surah-maps/ ...).

  build: walk the given yaml roots, take each `ar:` string in a language block that has
         no <lang>: sibling yet (or every scalar of i18n/ar.yaml), write docx files
         ys-<NNN>-ar.docx + ys-<NNN>.json maps into --dir.
  import: read the Azure-translated docx, check markers/counts, write the values as
         <lang>: siblings next to their `ar:` key (i18n: mirror ar.yaml structure into
         i18n/<lang>.yaml), refuse honorific/Qur'an-bracket/unchanged texts.

    python3 scripts/local-mt/yaml_strings.py build  --lang tr --dir WORK --roots i18n edu kids tour cards datasets wt3 surah-maps
    python3 scripts/local-mt/yaml_strings.py import --lang tr --dir WORK --docx WORK/tr/ys-001-ar.docx --map WORK/ys-001.json
"""
import argparse, glob, json, os, re, sys, zipfile
from xml.sax.saxutils import escape

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MARK = re.compile(r"^#### (\d+) ####$")
ARABIC = re.compile(r"[\u0600-\u06FF]")
HONORIFIC = re.compile(r"ﷺ|صلی اللہ علیہ|علیہ السلام|رضی اللہ عن|رحمۃ اللہ علیہ|رحمہ اللہ|sallallahu|aleyhi ve sellem|aleyhisselam|shallallahu|alaihissalam|alaihis salam", re.I)
QURAN_BRACKETS = re.compile(r"[﴾﴿]")

LANG_KEYS = ("ar", "en", "ur", "fr", "es", "tr", "id")
SKIP_DIRS = {"content", "data", "site", "workers", "node_modules", ".git", "docs", "schema", "scripts"}
SKIP_VALUES = re.compile(r"^(ltr|rtl|[a-z]{2}(-[A-Z]{2})?|\d+(\.\d+)?|true|false|[a-z0-9_./:@+-]+)$", re.I)


def docx(paras, path):
    doc = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
           + "".join(f'<w:p><w:r><w:t xml:space="preserve">{escape(p)}</w:t></w:r></w:p>' for p in paras) + "</w:body></w:document>")
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
        z.writestr("_rels/.rels", '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
        z.writestr("word/document.xml", doc)


def read_docx(path):
    """paragraph texts of a docx, in order."""
    x = zipfile.ZipFile(path).read("word/document.xml").decode("utf-8")
    return [re.sub(r"<[^>]+>", "", p).replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&") for p in re.findall(r"<w:p[ >].*?</w:p>", x, re.S)]


def lang_blocks(node, path, out):
    """Every (path, mapping) that looks like a language block: has 'ar' and at least one other lang key."""
    if isinstance(node, dict):
        keys = set(node)
        if "ar" in keys and keys & set(LANG_KEYS) - {"ar"} and all(not isinstance(node.get(k), (dict, list)) for k in keys & set(LANG_KEYS)):
            out.append((path, node))
        else:
            for k, v in node.items(): lang_blocks(v, f"{path}.{k}" if path else str(k), out)
    elif isinstance(node, list):
        for i, v in enumerate(node): lang_blocks(v, f"{path}[{i}]", out)


def yaml_files(roots):
    if isinstance(roots, str): roots = roots.split()
    for r in roots:
        base = os.path.join(ROOT, r)
        if os.path.isfile(base): yield base
        for f in sorted(glob.glob(base + "/**/*.yaml", recursive=True) + glob.glob(base + "/**/*.yml", recursive=True)): yield f


def build_i18n(a):
    """One docx per chunk covering every string scalar of i18n/ar.yaml."""
    src = yaml.safe_load(open(os.path.join(ROOT, "i18n", "ar.yaml"), encoding="utf-8"))
    segs = []
    def walk(node, path):
        if isinstance(node, dict):
            for k, v in node.items(): walk(v, f"{path}.{k}" if path else str(k))
        elif isinstance(node, list):
            for i, v in enumerate(node): walk(v, f"{path}[{i}]")
        elif isinstance(node, str) and node.strip() and ARABIC.search(node):
            segs.append((path, node))
    walk(src, "")
    chunks, words, part = [], 0, []
    for p, t in segs:
        part.append((p, t)); words += len(t.split())
        if len(part) >= 1200: chunks.append(part); part = []
    if part: chunks.append(part)
    out = []
    for n, ch in enumerate(chunks, 1):
        name = f"ys-i18n-{n:03d}"
        paras = [p for i, (p, t) in enumerate(ch, 1) for p in (f"#### {i} ####", " ".join(t.split()))]
        docx(paras, os.path.join(a.dir, name + "-ar.docx"))
        json.dump([{"path": p, "src": t} for p, t in ch], open(os.path.join(a.dir, name + ".json"), "w", encoding="utf-8"), ensure_ascii=False)
        out.append((name, len(ch), sum(len(t.split()) for _, t in ch)))
    return out


def build_roots(a):
    """Every ar: scalar inside a language block lacking <lang>, across the given roots."""
    segs = []
    for f in yaml_files(a.roots):
        if "/i18n/" in f or os.path.basename(f) in ("ar.yaml", "en.yaml", "ur.yaml", "fr.yaml", "es.yaml", "tr.yaml", "id.yaml") and f.endswith((".yaml", ".yml")) and "/i18n/" in f.replace("\\", "/"):
            continue
        rel = os.path.relpath(f, ROOT)
        try: d = yaml.safe_load(open(f, encoding="utf-8"))
        except Exception: continue
        blocks = []
        lang_blocks(d, "", blocks)
        for path, m in blocks:
            v = m.get("ar")
            if isinstance(v, str) and v.strip() and not m.get(a.lang) and ARABIC.search(v) and not SKIP_VALUES.match(v.strip()):
                segs.append({"file": rel, "path": path, "src": v})
    chunks = [segs[i:i + 1200] for i in range(0, len(segs), 1200)]
    out = []
    for n, ch in enumerate(chunks, 1):
        name = f"ys-{n:03d}"
        paras = [p for i, s in enumerate(ch, 1) for p in (f"#### {i} ####", " ".join(s["src"].split()))]
        docx(paras, os.path.join(a.dir, name + "-ar.docx"))
        json.dump(ch, open(os.path.join(a.dir, name + ".json"), "w", encoding="utf-8"), ensure_ascii=False)
        out.append((name, len(ch), sum(len(s["src"].split()) for s in ch)))
    return out


def clean_translation(t, src, a):
    why = None
    if HONORIFIC.search(t): why = "honorific"
    elif QURAN_BRACKETS.search(t): why = "Qur'an brackets"
    elif len(ARABIC.findall(t)) > max(4, len(t) * 0.5): why = "still in Arabic"
    elif len(src.split()) >= 6 and " ".join(t.split()) == " ".join(src.split()): why = "left untranslated"
    return None if why else t, why


def set_nested(root, path, value):
    """Set a dotted path with [i] indexes inside a yaml-loaded tree, creating missing dicts/lists."""
    parts = re.findall(r"[^.\[\]]+|\[\d+\]", path)
    cur = root
    for i, p in enumerate(parts):
        last = i == len(parts) - 1
        nxt_is_idx = not last and parts[i + 1].startswith("[")
        if p.startswith("["):
            idx = int(p[1:-1])
            while len(cur) <= idx: cur.append(None)
            if last: cur[idx] = value
            else:
                if not isinstance(cur[idx], (dict, list)):
                    cur[idx] = [] if nxt_is_idx else {}
                cur = cur[idx]
        else:
            if last: cur[p] = value
            else:
                if p not in cur or not isinstance(cur[p], (dict, list)):
                    cur[p] = [] if nxt_is_idx else {}
                cur = cur[p]
    return True


def main():
    global a
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["build", "import"])
    ap.add_argument("--lang", required=True, choices=["tr", "id"])
    ap.add_argument("--dir", required=True)
    ap.add_argument("--roots", default="edu kids tour cards datasets wt3 surah-maps")
    ap.add_argument("--docx", default="")
    ap.add_argument("--txt", default="", help="a plain-text answer (text_round.py output): one paragraph per line")
    ap.add_argument("--map", default="")
    ap.add_argument("--i18n", action="store_true", help="build: process i18n/ar.yaml instead of --roots")
    a = ap.parse_args()
    os.makedirs(a.dir, exist_ok=True)

    if a.cmd == "build":
        rows = build_i18n(a) if a.i18n else build_roots(a)
        for name, n, w in rows: print(f"{name}\tsegments {n}\twords {w}")
        return

    # import
    records = json.load(open(a.map, encoding="utf-8"))
    paras = open(a.txt, encoding="utf-8").read().split("\n") if a.txt else read_docx(a.docx)
    cur, texts = None, {}
    for p in paras:
        m = MARK.match(p.strip())
        if m: cur = int(m.group(1)); texts[cur] = []
        elif cur is not None: texts[cur].append(p.strip())
    ok = failed = 0
    by_file = {}
    for i, rec in enumerate(records, 1):
        t = " ".join(texts.get(i, []))
        if not t: failed += 1; continue
        t, why = clean_translation(t, rec["src"], a)
        if why: failed += 1; print("failed", rec.get("path", i), why); continue
        if "file" in rec:
            by_file.setdefault(rec["file"], []).append((rec["path"], t))
        else:
            by_file.setdefault("I18N", []).append((rec["path"], t))
        ok += 1
    print(f"{a.lang}: {len(records)} segments; ok {ok}, failed {failed}")
    for f, items in by_file.items():
        if f == "I18N":
            fp = os.path.join(ROOT, "i18n", f"{a.lang}.yaml")
            d = yaml.safe_load(open(fp, encoding="utf-8")) if os.path.exists(fp) else {}
            if d is None: d = {}
            for path, t in items: set_nested(d, path, t)
            yaml.safe_dump(d, open(fp, "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=200)
            print("wrote", fp, len(items))
        else:
            fp = os.path.join(ROOT, f)
            d = yaml.safe_load(open(fp, encoding="utf-8"))
            for path, t in items:
                parts = path.split(".")
                key, parent = parts[-1], d
                for p in parts[:-1]:
                    mm = re.fullmatch(r"(.*)\[(\d+)\]", p)
                    parent = parent[mm.group(1)][int(mm.group(2))] if mm else parent[p]
                mm = re.fullmatch(r"(.*)\[(\d+)\]", key)
                if mm:
                    lst, idx = parent[mm.group(1)], int(mm.group(2))
                    if isinstance(lst[idx], dict): lst[idx][a.lang] = t
                    else: lst[idx] = {"ar": lst[idx], a.lang: t}
                else:
                    parent[key][a.lang] = t
            yaml.safe_dump(d, open(fp, "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=200)
            print("wrote", f, len(items))


if __name__ == "__main__":
    main()
