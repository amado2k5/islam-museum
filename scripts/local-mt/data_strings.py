#!/usr/bin/env python3
"""Short texts inside data records (titles, summaries, the title and body of an exhibit's rooms) through Google
Translate's document translation, always from English (founder's instruction, 20 November 2026: he uploads the Word
files by hand in his own browser; the browser the agent drives is refused).

    data_strings.py build  --lang es [--cls all] [--words 950000]   writes <dir>/gtd-es-01-en.docx, gtd-es-01.json, ...
    data_strings.py import --name gtd-es-01 --docx FILE             writes the missing values of that file's language
    data_strings.py names  --lang es                                person titles in French or Spanish: the English form

A Word file holds, per distinct English text that the language lacks, one marker paragraph "#### n ####" and one
paragraph of English. Only a missing value is written; an existing translation is never replaced. A value is added as
one line at the end of its language block (or inside the braces of a one-line block), so the rest of the record keeps
its bytes; every record is re-read after the change and must equal the old record plus the new values.

Left out on purpose: the Qur'an passage records (frozen, guarded by a commit hook); the title of a `source` record (a bibliographic title is not translated), and the title of a
`person` in French and Spanish (the English transliteration is used, as most French titles written before this did)."""
import argparse, collections, glob, json, os, re, sys, zipfile
from xml.sax.saxutils import escape
import yaml

Loader = getattr(yaml, "CSafeLoader", yaml.SafeLoader)
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ap = argparse.ArgumentParser(); ap.add_argument("cmd", choices=["build", "import", "names"]); ap.add_argument("--cls", default="all")
ap.add_argument("--name"); ap.add_argument("--lang", choices=["ur", "fr", "es"]); ap.add_argument("--docx"); ap.add_argument("--words", type=int, default=950000)
ap.add_argument("--dir", default="/Volumes/exmicroSD/islam-museum-local-mt/gt"); ap.add_argument("--fields", default="label,summary,rooms[].title,rooms[].body")
a = ap.parse_args(); FIELDS = a.fields.split(",")
ARABIC = re.compile(r"[؀-ۿ]")
HONORIFIC = re.compile(r"ﷺ|صلی اللہ علیہ|علیہ السلام|رضی اللہ عن|رحمۃ اللہ علیہ|رحمہ اللہ|paix (soit )?sur lui|que Dieu l['’]agrée|que la paz sea con|la paz sea con él|bendiciones de (?:Dios|Al[áa]h?) sean con|que Dios esté complacido con|(?:Dios|Al[áa]h?) esté complacido con él|bénédictions (?:de Dieu|d['’]Allah) (?:soient )?sur lui", re.I)
STRIP = re.compile(r"[\(（]?\s*(?:ﷺ|صلی اللہ علیہ و(?:آلہ و)?سلم|علیہ(?:ما|م)? السلام|رضی اللہ (?:تعالیٰ )?عن(?:ہ|ہا|ہم|ہما)|رحمۃ اللہ علیہ|رحمہ اللہ)\s*[\)）]?")


def classes():
    return sorted(d for d in os.listdir(os.path.join(ROOT, "data")) if os.path.isdir(os.path.join(ROOT, "data", d)) and not d.startswith("_") and (a.cls == "all" or d in a.cls.split(",")))


# The Qur'an passage records (data/passage/quran-*.yaml) are frozen: a commit guard refuses any change to them, so they
# are never read for texts and never written.
def files(): return [f for c in classes() for f in sorted(glob.glob(os.path.join(ROOT, "data", c, "*.yaml"))) if not (c == "passage" and os.path.basename(f).startswith("quran-"))]
cls_of = lambda f: os.path.basename(os.path.dirname(f))


def blocks(d):
    """(path, mapping) for every language block the fields name."""
    for f in FIELDS:
        if "[]." in f:
            lst, key = f.split("[].")
            for i, item in enumerate(d.get(lst) or []):
                if isinstance(item, dict) and isinstance(item.get(key), dict): yield f"{lst}[{i}].{key}", item[key]
        elif isinstance(d.get(f), dict): yield f, d[f]


def wanted(cls, path, lang):
    """Whether this field of this class is machine-translated into this language."""
    if path == "label" and cls == "source": return False
    if path == "label" and cls == "person" and lang in ("fr", "es"): return False
    return True


def docx(paras, path):
    doc = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'
           + "".join(f'<w:p><w:r><w:t xml:space="preserve">{escape(p)}</w:t></w:r></w:p>' for p in paras) + "</w:body></w:document>")
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
        z.writestr("_rels/.rels", '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
        z.writestr("word/document.xml", doc)


def write_values(f, text, old, adds, L):
    """Insert the (path, value) pairs into the record's text; returns the new text, or raises."""
    lines = text.split("\n")
    def find(path):
        mm = re.fullmatch(r"(\w+)\[(\d+)\]\.(\w+)", path)
        if not mm:
            i = next(k for k, l in enumerate(lines) if l == f"{path}:" or l.startswith(f"{path}: ")); ind = 0
            if lines[i] != f"{path}:": return ("flow", i)
        else:
            lst, idx, key = mm.group(1), int(mm.group(2)), mm.group(3)
            s = next(k for k, l in enumerate(lines) if l == f"{lst}:"); item = -1; i = None
            first = next(l for l in lines[s + 1:] if l.strip()); base = len(first) - len(first.lstrip(" "))
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
        child = len(lines[i + 1]) - len(lines[i + 1].lstrip(" "))
        return ("block", j, child)
    places = [(find(p), p, v) for p, v in adds]
    for place, p, v in sorted(places, key=lambda x: -x[0][1]):
        q = json.dumps(v, ensure_ascii=False)
        if place[0] == "block": lines.insert(place[1], " " * place[2] + f"{L}: {q}")
        else:
            l = lines[place[1]]; m = re.fullmatch(r"(.*?)(\s*)\}(\s*)", l)
            if not m or "{" not in l: raise ValueError(f"{p}: neither a block nor a one-line mapping")
            lines[place[1]] = f"{m.group(1)}, {L}: {q}{m.group(2)}}}{m.group(3)}"
    new_text = "\n".join(lines); new = yaml.load(new_text, Loader=Loader); want = yaml.load(text, Loader=Loader)
    for p, v in adds:
        mm = re.fullmatch(r"(\w+)\[(\d+)\]\.(\w+)", p)
        (want[mm.group(1)][int(mm.group(2))][mm.group(3)] if mm else want[p])[L] = v
    if new != want: raise ValueError("record changed beyond the new values")
    return new_text


def apply(L, value_for):
    """Write value_for(cls, path, english) (or None) into every block that lacks L."""
    written = records = failed = 0; why = collections.Counter()
    for f in files():
        text = open(f, encoding="utf-8").read()
        if f"\n{L}:" in text and False: pass
        try: old = yaml.load(text, Loader=Loader)
        except Exception: continue
        if not isinstance(old, dict): continue
        adds = []
        for path, m in blocks(old):
            en = m.get("en")
            if m.get(L) or not isinstance(en, str) or not en.strip(): continue
            v = value_for(cls_of(f), re.sub(r"\[\d+\]", "[]", path), en)
            if v: adds.append((path, v))
        if not adds: continue
        try: new_text = write_values(f, text, old, adds, L)
        except Exception as e:
            failed += 1; why[str(e)[:60]] += 1; continue
        open(f, "w", encoding="utf-8").write(new_text); written += len(adds); records += 1
    return written, records, failed, why


if a.cmd == "names":
    w, r, bad, why = apply(a.lang, lambda cls, path, en: " ".join(en.split()) if cls == "person" and path == "label" else None)
    print(f"{a.lang}: person titles copied from English: {w} in {r} records; records not written {bad} {dict(why)}"); sys.exit(0)

if a.cmd == "build":
    L = a.lang; strings, seen = [], set()
    for f in files():
        try: d = yaml.load(open(f, encoding="utf-8"), Loader=Loader)
        except Exception: continue
        if not isinstance(d, dict): continue
        for path, m in blocks(d):
            en = m.get("en")
            if isinstance(en, str) and en.strip() and not m.get(L) and wanted(cls_of(f), re.sub(r"\[\d+\]", "[]", path), L) and en not in seen:
                seen.add(en); strings.append(en)
    parts, cur, w = [], [], 0
    for s in strings:
        n = len(s.split()) + 3
        if cur and w + n > a.words: parts.append(cur); cur, w = [], 0
        cur.append(s); w += n
    if cur: parts.append(cur)
    for k, part in enumerate(parts, 1):
        name = f"gtd-{L}-{k:02d}"
        docx([p for n, s in enumerate(part, 1) for p in (f"#### {n} ####", " ".join(s.split()))], f"{a.dir}/{name}-en.docx")
        json.dump({"lang": L, "strings": part}, open(f"{a.dir}/{name}.json", "w", encoding="utf-8"), ensure_ascii=False)
        print(f"{name}\ttexts {len(part)}\twords {sum(len(s.split()) for s in part)}\tbytes {os.path.getsize(f'{a.dir}/{name}-en.docx')}")
    print(f"{L}: {len(strings)} distinct texts in {len(parts)} files"); sys.exit(0)

mp = json.load(open(f"{a.dir}/{a.name}.json", encoding="utf-8")); L, strings = mp["lang"], mp["strings"]
x = zipfile.ZipFile(a.docx).read("word/document.xml").decode("utf-8")
paras = ["".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", p)) for p in re.findall(r"<w:p[ >].*?</w:p>", x, re.S)]
paras = [re.sub(r"\s+", " ", p.replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"').replace("&apos;", "'").replace("&amp;", "&")).strip() for p in paras]
tr, cur = {}, None
for p in paras:
    m = re.fullmatch(r"#{3,4}\s*(\d+)\s*#{3,4}", p)
    if m: cur = int(m.group(1)); tr[cur] = []
    elif cur is not None and p: tr[cur].append(p)
good, bad = {}, collections.Counter()
for n, en in enumerate(strings, 1):
    t = " ".join(tr.get(n, [])).strip(); why = None
    # Google Translate adds a blessing after "the Prophet" in Urdu; the museum types no honorific (the site renders
    # them), so the formula is taken out and the sentence kept. Anything left over is still refused below.
    t = re.sub(r"\s+([،۔؛:])", r"\1", re.sub(r"\s{2,}", " ", STRIP.sub(" ", t))).strip()
    # the same in Spanish and French: "(la paz sea con él)", ", que la paz y las bendiciones de Alá sean con él", "(paix sur lui)"
    if L == "es": t = re.sub(r"\s*\((?:que )?la paz(?: y las bendiciones(?: de (?:Dios|Al[áa]h?))?)? sean? con (?:él|ella|ellos|ambos)\)|,\s*(?:que )?la paz(?: y las bendiciones(?: de (?:Dios|Al[áa]h?))?)? sean? con (?:él|ella|ellos|ambos)", "", t, flags=re.I)
    if L == "fr": t = re.sub(r"\s*\((?:que )?(?:la )?paix(?: et (?:les )?bénédictions(?: (?:de Dieu|d['’]Allah))?)? (?:soi(?:en)?t )?sur (?:lui|elle|eux)\)|,\s*(?:que )?(?:la )?paix(?: et (?:les )?bénédictions(?: (?:de Dieu|d['’]Allah))?)? (?:soi(?:en)?t )?sur (?:lui|elle|eux)", "", t, flags=re.I)
    t = re.sub(r"\s+([,.;:)])", r"\1", t) if L != "ur" else t
    if not t: why = "missing"
    elif HONORIFIC.search(t): why = "typed honorific"
    elif "﴿" in t or "﴾" in t: why = "Qur'an brackets"
    elif "####" in t: why = "marker inside the text"
    elif L == "ur" and not ARABIC.search(t): why = "not in Urdu script"
    elif L != "ur" and ARABIC.search(t) and not ARABIC.search(en): why = "Arabic script in a Latin-script language"
    elif len(en.split()) >= 6 and t == " ".join(en.split()): why = "left in English"
    elif len(en) > 40 and not (0.4 <= len(t) / len(en) <= 2.6): why = "length ratio"
    if why: bad[why] += 1; continue
    if True:  # a parenthetical that holds Arabic script is wrapped in direction isolates, in every language (AGENTS.md, rule of 6 Nov 2026)
        t = re.sub(r"(?<!⁦)\(([^()]*[؀-ۿ][^()]*)\)(?!⁩)", "⁦(\\1)⁩", t)
    good[en] = t
w, r, failed, why = apply(L, lambda cls, path, en: good.get(en) if wanted(cls, path, L) else None)
print(f"{a.name} ({L}): texts in file {len(strings)}; usable {len(good)}; refused {sum(bad.values())} {dict(bad)}; values written {w} in {r} records; records not written {failed} {dict(why)}")
