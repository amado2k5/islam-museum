#!/usr/bin/env python3
"""Short strings inside data records (labels, summaries, the title and body of an exhibit's rooms) through Google
Translate's document translation, always from English (founder's instruction, 20 November 2026: he uploads the Word
file by hand in his own browser; the browser the agent drives is refused).

    data_strings.py build  --cls exhibit --name gtd-exhibit        writes <dir>/<name>-en.docx and <dir>/<name>.json
    data_strings.py import --name gtd-exhibit --lang ur --docx F   writes the missing <lang> values into the records

The Word file is one marker paragraph "#### n ####" followed by one paragraph of English, per distinct string.
Only a missing value is written; an existing translation is never replaced. A value is inserted as one new line at
the end of its language block, so the rest of the record keeps its bytes; every record is re-read after the change
and must equal the old record plus the new values."""
import argparse, glob, json, os, re, sys, zipfile
from xml.sax.saxutils import escape
import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ap = argparse.ArgumentParser(); ap.add_argument("cmd", choices=["build", "import"]); ap.add_argument("--cls", default="exhibit")
ap.add_argument("--name", required=True); ap.add_argument("--lang", choices=["ur", "fr", "es"]); ap.add_argument("--docx")
ap.add_argument("--dir", default="/Volumes/exmicroSD/islam-museum-local-mt/gt"); ap.add_argument("--fields", default="label,summary,rooms[].title,rooms[].body")
a = ap.parse_args(); FIELDS = a.fields.split(",")
ARABIC = re.compile(r"[؀-ۿ]"); LATIN = re.compile(r"[A-Za-zÀ-ÿ]")
HONORIFIC = re.compile(r"ﷺ|صلی اللہ علیہ|علیہ السلام|رضی اللہ عن|رحمۃ اللہ علیہ|رحمہ اللہ|paix (soit )?sur lui|que Dieu l['’]agrée|que la paz sea con|la paz sea con él|que Dios esté complacido con", re.I)


def blocks(d):
    """(path, mapping) for every language block the fields name."""
    for f in FIELDS:
        if "[]." in f:
            lst, key = f.split("[].")
            for i, item in enumerate(d.get(lst) or []):
                if isinstance(item, dict) and isinstance(item.get(key), dict): yield f"{lst}[{i}].{key}", item[key]
        elif isinstance(d.get(f), dict): yield f, d[f]


def docx(paras, path):
    doc = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
           + "".join(f'<w:p><w:r><w:t xml:space="preserve">{escape(p)}</w:t></w:r></w:p>' for p in paras) + "</w:body></w:document>")
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
        z.writestr("_rels/.rels", '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
        z.writestr("word/document.xml", doc)


files = sorted(glob.glob(os.path.join(ROOT, "data", a.cls, "*.yaml")))
if a.cmd == "build":
    strings, seen = [], {}
    for f in files:
        d = yaml.safe_load(open(f, encoding="utf-8"))
        for _, m in blocks(d):
            en = m.get("en")
            if isinstance(en, str) and en.strip() and not all(m.get(l) for l in ("ur", "fr", "es")) and en not in seen:
                seen[en] = len(strings); strings.append(en)
    paras = [p for n, s in enumerate(strings, 1) for p in (f"#### {n} ####", " ".join(s.split()))]
    docx(paras, f"{a.dir}/{a.name}-en.docx"); json.dump(strings, open(f"{a.dir}/{a.name}.json", "w", encoding="utf-8"), ensure_ascii=False)
    print(f"{a.name}\tstrings {len(strings)}\twords {sum(len(s.split()) for s in strings)}\tbytes {os.path.getsize(f'{a.dir}/{a.name}-en.docx')}"); sys.exit(0)

L = a.lang; strings = json.load(open(f"{a.dir}/{a.name}.json", encoding="utf-8"))
x = zipfile.ZipFile(a.docx).read("word/document.xml").decode("utf-8")
paras = ["".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", p)) for p in re.findall(r"<w:p[ >].*?</w:p>", x, re.S)]
paras = [re.sub(r"\s+", " ", p.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"').replace("&apos;", "'")).strip() for p in paras]
tr, cur = {}, None
for p in paras:
    m = re.fullmatch(r"#{3,4}\s*(\d+)\s*#{3,4}", p)
    if m: cur = int(m.group(1)); tr[cur] = []
    elif cur is not None and p: tr[cur].append(p)
good, bad = {}, {}
for n, en in enumerate(strings, 1):
    t = " ".join(tr.get(n, [])).strip(); why = None
    # Google Translate adds a blessing after "the Prophet" in Urdu; the museum types no honorific (the site renders
    # them), so the formula is taken out and the sentence kept. Anything left over is still refused below.
    t = re.sub(r"[\(（]?\s*(?:ﷺ|صلی اللہ علیہ و(?:آلہ و)?سلم|علیہ(?:ما|م)? السلام|رضی اللہ (?:تعالیٰ )?عن(?:ہ|ہا|ہم|ہما)|رحمۃ اللہ علیہ|رحمہ اللہ)\s*[\)）]?", " ", t)
    t = re.sub(r"\s+([،۔؛:])", r"\1", re.sub(r"\s{2,}", " ", t)).strip()
    if not t: why = "missing"
    elif HONORIFIC.search(t): why = "typed honorific"
    elif "﴿" in t or "﴾" in t: why = "Qur'an brackets"
    elif L == "ur" and not ARABIC.search(t): why = "not in Urdu script"
    elif L != "ur" and ARABIC.search(t) and not ARABIC.search(en): why = "Arabic script in a Latin-script language"
    elif len(en.split()) >= 6 and t == " ".join(en.split()): why = "left in English"
    elif len(en) > 40 and not (0.4 <= len(t) / len(en) <= 2.6): why = f"length ratio {len(t) / len(en):.2f}"
    if why: bad[en] = why; continue
    if L == "ur":  # a parenthetical that holds Arabic script is wrapped in direction isolates (AGENTS.md, rule of 6 Nov 2026)
        t = re.sub(r"(?<!⁦)\(([^()]*[؀-ۿ][^()]*)\)(?!⁩)", "⁦(\\1)⁩", t)
    good[en] = t
written = records = 0
for f in files:
    text = open(f, encoding="utf-8").read(); old = yaml.safe_load(text); lines = text.split("\n"); adds = []
    for path, m in blocks(old):
        en = m.get("en")
        if m.get(L) or not isinstance(en, str) or en not in good: continue
        adds.append((path, good[en]))
    if not adds: continue
    # find the line range of each block: "<indent>label:" then children at a deeper indent
    def find(path):
        mm = re.fullmatch(r"(\w+)\[(\d+)\]\.(\w+)", path)
        if not mm:
            i = next(k for k, l in enumerate(lines) if l == f"{path}:"); ind = 0
        else:
            lst, idx, key = mm.group(1), int(mm.group(2)), mm.group(3)
            s = next(k for k, l in enumerate(lines) if l == f"{lst}:"); item = -1; i = None
            first = next(l for l in lines[s + 1:] if l.strip()); base = len(first) - len(first.lstrip(" "))  # the list may be indented
            for k in range(s + 1, len(lines)):
                l = lines[k]
                if l.strip() and len(l) - len(l.lstrip(" ")) < base: break
                if l.startswith(" " * base + "- "): item += 1
                if item == idx and l in (" " * base + f"- {key}:", " " * (base + 2) + f"{key}:"): i = k; break
            if i is None: raise ValueError(path)
            ind = base + 2
        j = i + 1
        while j < len(lines) and (not lines[j].strip() or len(lines[j]) - len(lines[j].lstrip(" ")) > ind): j += 1
        while not lines[j - 1].strip(): j -= 1
        return j, ind + 2
    try:
        for path, val in sorted(adds, key=lambda pv: -find(pv[0])[0]):
            j, ind = find(path); lines.insert(j, " " * ind + f"{L}: " + json.dumps(val, ensure_ascii=False))
        new_text = "\n".join(lines); new = yaml.safe_load(new_text)
        want = yaml.safe_load(text)
        for path, val in adds:
            mm = re.fullmatch(r"(\w+)\[(\d+)\]\.(\w+)", path)
            (want[mm.group(1)][int(mm.group(2))][mm.group(3)] if mm else want[path])[L] = val
        if new != want: raise ValueError("record changed beyond the new values")
    except Exception as e:
        print("NOT written", os.path.relpath(f, ROOT), e); continue
    open(f, "w", encoding="utf-8").write(new_text); written += len(adds); records += 1
import collections
print(f"{L}: strings in file {len(strings)}; usable {len(good)}; refused {len(bad)} {dict(collections.Counter(bad.values()))}; values written {written} in {records} records")
