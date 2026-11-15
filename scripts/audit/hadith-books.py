#!/usr/bin/env python3
"""The books (kutub) of the six hadith collections, and each museum report filed under its book (audit S22).

The museum's reports of Bukhari, Muslim, Abu Dawud, al-Tirmidhi, al-Nasa'i and Ibn Majah were taken from the open
hadith-api dataset (source/hadith-api-fawazahmed0), which also carries each edition's division into books with the
first and last report of each. This script reads that division and
  1. writes one chapter record per book, `passage/<prefix>-kitab-NN` (unit chapter, ref kitab-NN), part of the work;
  2. adds a `part_of` edge from every museum report to its book, but only when the report's own text is found in the
     dataset report of the same number (the dataset's number, or its `arabicnumber` for records numbered the other
     way). A report whose text does not match stays unfiled and is printed.
The Arabic titles are the collections' own headings as carried by the hadith-json dataset
(source/hadith-json-ahmedbaset), matched to the hadith-api division by the English name; honorific formulas and
vowel marks are taken off. Nothing else is taken from that dataset.

Input: the edition files, downloaded once into .cache/hadith/ (eng-<e>.json and ara-<e>.json from
cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/<lang>-<e>.min.json; hj-<e>.json from
raw.githubusercontent.com/AhmedBaset/hadith-json/main/db/by_book/the_9_books/<e>.json).
Usage: python3 scripts/audit/hadith-books.py [collection ...]     (default: all six)
Idempotent: an existing book record is rewritten, an existing part_of edge to a book is left alone.
"""
import json, os, re, sys, glob, unicodedata
import yaml

C = {
  "bukhari":  dict(work="work/sahih-al-bukhari",  ar="صحيح البخاري",  en="Sahih al-Bukhari",   ur="صحیح بخاری",   src="source/sahih-al-bukhari"),
  "muslim":   dict(work="work/sahih-muslim",      ar="صحيح مسلم",     en="Sahih Muslim",       ur="صحیح مسلم",    src="source/sahih-muslim"),
  "abudawud": dict(work="work/sunan-abi-dawud",   ar="سنن أبي داود",  en="Sunan Abi Dawud",    ur="سنن ابی داؤد", src="source/sunan-abi-dawud"),
  "tirmidhi": dict(work="work/jami-al-tirmidhi",  ar="جامع الترمذي",  en="Jami' al-Tirmidhi",  ur="جامع ترمذی",   src="source/jami-al-tirmidhi"),
  "nasai":    dict(work="work/sunan-al-nasai",    ar="سنن النسائي",   en="Sunan al-Nasa'i",    ur="سنن نسائی",    src="source/sunan-al-nasai"),
  "ibnmajah": dict(work="work/sunan-ibn-majah",   ar="سنن ابن ماجه",  en="Sunan Ibn Majah",    ur="سنن ابن ماجہ", src="source/sunan-ibn-majah"),
}
RUN = "hadith-library-books-2026-11-15"

def bare(s):
    s = "".join(c for c in unicodedata.normalize("NFC", s) if not ("ً" <= c <= "ْ" or c in "ٰـ"))
    s = re.sub(r"\s*(صلى الله عليه وسلم|صلى الله عليه وآله وسلم|ﷺ|رضي الله عنهم?ا?|عليهم? السلام|رحمهم? الله)", "", s)
    return re.sub(r"\s+", " ", s.replace("ى ", "ي ").strip())
def urdu(s):
    return (s.replace("ك", "ک").replace("ي", "ی").replace("ى", "یٰ").replace("ة", "ۃ").replace("ه", "ہ").replace("أ", "ا").replace("إ", "ا"))
def norm(s):
    s = "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c))
    s = re.sub("[أإآٱ]", "ا", s).replace("ى", "ي").replace("ة", "ه")
    return re.sub(r"[^ء-ي]", "", s)
def found(t, full):
    if len(t) < 12: return False
    return any(w in full for w in (t[:18], t[max(0, len(t) // 2 - 9):max(0, len(t) // 2 - 9) + 18], t[-18:]))
def q(s): return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'

def run(e):
    c = C[e]
    eng = json.load(open(f".cache/hadith/eng-{e}.json")); ara = json.load(open(f".cache/hadith/ara-{e}.json")); hj = json.load(open(f".cache/hadith/hj-{e}.json"))
    names = {x["english"].strip().lower(): bare(x["arabic"]) for x in hj["chapters"]}
    books = []
    for k, en in eng["metadata"]["sections"].items():
        if not en.strip(): continue
        d = eng["metadata"]["section_details"][k]
        books.append(dict(n=int(k), en=en.strip(), ar=names[en.strip().lower()], first=d["hadithnumber_first"], last=d["hadithnumber_last"]))
    width = 2 if len(books) < 100 else 3
    rid = lambda b: f"passage/{e}-kitab-{b['n']:0{width}d}"
    for b in books:
        en_t = re.sub(r"\s+", " ", b["en"])
        y = [
            f"id: {rid(b)}", "class: passage", "unit: chapter", f"work: {c['work']}", f'ref: "kitab-{b["n"]:0{width}d}"',
            "label:", f"  ar: {q(c['ar'] + '، ' + b['ar'])}", f"  en: {q(c['en'] + ', Book ' + str(b['n']) + ': ' + en_t)}", f"  ur: {q(c['ur'] + '، ' + urdu(b['ar']))}",
            "summary:",
            f"  ar: {q('القسم ' + str(b['n']) + ' من ' + c['ar'] + ' في تقسيم قاعدة بيانات الحديث المفتوحة التي أُخذت منها سجلات المتحف، وعنوانه «' + b['ar'] + '»، ويضم فيها النصوص من ' + str(b['first']) + ' إلى ' + str(b['last']) + ' بترقيمها. يضع المتحف تحت هذا الكتاب ما عنده من سجلات هذه النصوص.')}",
            f"  en: {q('Book ' + str(b['n']) + ' of ' + c['en'] + ' (' + en_t + ') in the division of the open hadith dataset the museum took its reports from: reports ' + str(b['first']) + ' to ' + str(b['last']) + ' in that dataset\'s numbering. The museum files its records of these reports under this book; printed editions divide and number the collection differently.')}",
            f"  ur: {q(c['ur'] + ' کی کتاب ' + str(b['n']) + '، عنوان «' + urdu(b['ar']) + '»، اس کھلے حدیث ڈیٹا سیٹ کی تقسیم کے مطابق جس سے میوزیم کے ریکارڈ لیے گئے: اس کی ترقیم میں روایات ' + str(b['first']) + ' تا ' + str(b['last']) + '۔ میوزیم ان روایات کے اپنے ریکارڈ اسی کتاب کے تحت رکھتا ہے۔')}",
            "relations:", f"  - {{ type: part_of, target: {c['work']} }}",
            "provenance:", "  layer: own-research",
            f'  source: "fawazahmed0/hadith-api (Unlicense), edition eng-{e}: metadata.sections and section_details, book {b["n"]}; Arabic title from AhmedBaset/hadith-json, {e}.json, matched by the English name"',
            '  generated_by: "Claude Code"', "  model: claude-fable-5-2", f"  run: {RUN}",
            f"sources: [{c['src']}, source/hadith-api-fawazahmed0, source/hadith-json-ahmedbaset]",
            'status: { review: published, completeness: 1, generated_by: "Claude Code (claude-fable-5-2), from the dataset\'s own division; no report text stored" }', "",
        ]
        open(f"data/{rid(b)}.yaml", "w", encoding="utf-8").write("\n".join(y))
    byn, bya = {}, {}
    for h in ara["hadiths"]:
        byn[str(h["hadithnumber"])] = h; bya.setdefault(str(h.get("arabicnumber")).split(".")[0], []).append(h)
    book_of = lambda num: next((b for b in books if b["first"] <= num <= b["last"]), None)
    filed, unfiled, kept = 0, [], 0
    for p in sorted(glob.glob("data/passage/*.yaml")):
        t = open(p, encoding="utf-8").read()
        if f"work: {c['work']}\n" not in t or "\nunit: hadith\n" not in t: continue
        d = yaml.safe_load(t); m = re.match(r"^(\d+)", str(d.get("ref")))
        if any(r.get("type") == "part_of" and "-kitab-" in str(r.get("target")) for r in (d.get("relations") or [])): kept += 1; continue
        txt = norm(str(d.get("text") or "")); h = None
        if m and txt:
            k = str(int(m.group(1))); h = byn.get(k)
            if not (h and found(txt, norm(h["text"]))): h = next((x for x in bya.get(k, []) if found(txt, norm(x["text"]))), None)
        b = book_of(h["hadithnumber"]) if h else None
        if not b: unfiled.append(d["id"]); continue
        line = f"  - {{ type: part_of, target: {rid(b)} }}"
        L = t.split("\n"); i = next((j for j, l in enumerate(L) if l == "relations:"), None)
        if i is None:
            j = next(j for j, l in enumerate(L) if l.startswith(("provenance:", "sources:", "status:"))); L[j:j] = ["relations:", line]
        else: L.insert(i + 1, line if L[i + 1].startswith(" ") else line.strip())
        t2 = "\n".join(L); d2 = yaml.safe_load(t2)
        assert {k: v for k, v in d2.items() if k != "relations"} == {k: v for k, v in d.items() if k != "relations"}, p
        open(p, "w", encoding="utf-8").write(t2); filed += 1
    print(f"{e}: {len(books)} books written; {filed} reports filed, {kept} already filed, {len(unfiled)} left unfiled: {' '.join(unfiled)}")

for e in (sys.argv[1:] or list(C)): run(e)
