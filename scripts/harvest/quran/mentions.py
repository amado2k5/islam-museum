#!/usr/bin/env python3
"""Cross-link Qur'an ayat to the entities they name (Phase 3).

For every data/passage/quran-S-A.yaml record we scan the normalized ayah text
for a curated list of unambiguous proper names and add `mentions` edges to the
matching person/place/group/event/building ids, sourced to source/tanzil-quran.

Conservative by design:
- Only names that are unambiguous as raw tokens, or that are gated behind a
  context pattern (صالح only after أخاهم/أخوهم; عاد only in its fixed
  collocations), are linked.
- يحيى is excluded: normalized يحيي collides with the verb يُحيي.
- أحد, مصر, النبي/رسول الله and generic titles are excluded.
- Missing entities are declared in data/_stubs.d/quran-mentions.yaml.

Run AFTER generate.py (and translations.py); it is idempotent — existing
mentions edges are never duplicated.

Usage: python3 scripts/harvest/quran/mentions.py [--apply]
"""
import re, sys
from pathlib import Path
import yaml

REPO = Path(__file__).resolve().parents[3]
PDIR = REPO / "data" / "passage"
SRC = "source/tanzil-quran"

# --- normalization (same scheme as scripts/harvest/hadith/chains.py) ---------
_DIAC = re.compile(r'[ً-ٰٟۡ-ۭۨ]')
def norm(s: str) -> str:
    s = _DIAC.sub('', s)
    for a, b in [('أ', 'ا'), ('إ', 'ا'), ('آ', 'ا'), ('ٱ', 'ا'),
                 ('ى', 'ي'), ('ة', 'ه'), ('ؤ', 'و'), ('ئ', 'ي')]:
        s = s.replace(a, b)
    return s

# --- the curated name map ----------------------------------------------------
# Each entry: (compiled pattern, [target ids]).
# A single-token name N is matched as (?:^|\s)[بلوفسك]{0,2}N ا? — allowing the
# common clitic prefixes and an accusative alif on triptote names.
T = r'(?:^|\s)[بلوفسك]{0,2}'
def tok(name: str, ids, acc: bool = True):
    suf = 'ا?' if acc else ''
    return (re.compile(T + re.escape(name) + suf + r'(?=\s|$)'), ids)

PATTERNS = [
    # Prophets and named people — unambiguous tokens
    tok('ابراهيم', ['person/ibrahim']),
    tok('اسماعيل', ['person/ismail']),
    tok('اسحاق',   ['person/ishaq']),
    tok('يعقوب',   ['person/yaqub']),
    tok('يوسف',    ['person/yusuf']),
    tok('ايوب',    ['person/ayyub']),
    tok('موسي',    ['person/musa'], acc=False),
    tok('هارون',   ['person/harun']),
    tok('داود',    ['person/dawud']),
    tok('سليمان',  ['person/sulayman']),
    tok('يونس',    ['person/yunus']),
    tok('شعيب',    ['person/shuayb']),
    tok('لوط',     ['person/lut']),
    tok('نوح',     ['person/nuh']),
    tok('عيسي',    ['person/isa-ibn-maryam'], acc=False),
    tok('المسيح',  ['person/isa-ibn-maryam']),
    tok('مريم',    ['person/maryam']),
    tok('ادم',     ['person/adam']),
    tok('محمد',    ['person/muhammad']),
    tok('فرعون',   ['person/firawn']),
    tok('هامان',   ['person/haman']),
    tok('قارون',   ['person/qarun']),
    tok('جالوت',   ['person/jalut']),
    tok('طالوت',   ['person/talut']),
    tok('السامري', ['person/al-samiri']),
    tok('عزير',    ['person/uzair']),
    tok('زكريا',   ['person/zakariya']),
    tok('ادريس',   ['person/idris']),
    tok('الياس',   ['person/ilyas']),
    tok('اليسع',   ['person/al-yasa']),
    tok('لقمان',   ['person/luqman-al-hakim']),
    tok('هود',     ['person/hud']),
    tok('ابليس',   ['person/iblis']),
    tok('جبريل',   ['person/jibril']),
    tok('ميكال',   ['person/mikail']),
    tok('هاروت',   ['person/harut']),
    tok('ماروت',   ['person/marut']),
    tok('ابي لهب', ['person/abu-lahab'], acc=False),
    # مكة: no س-prefix — سمكها (79:28) is a different word
    (re.compile(r'(?:^|\s)[بلوف]{0,2}مكه(?=\s|$)'), ['place/makkah']),
    tok('ببكه',    ['place/makkah'], acc=False),
    tok('ام القري',['place/makkah'], acc=False),
    tok('يثرب',    ['place/yathrib']),
    tok('مدين',    ['place/madyan']),
    tok('ارم',     ['place/iram']),
    tok('الجودي',  ['place/judi']),
    tok('سينين',   ['place/tur-sina']),
    tok('سيناي',   ['place/tur-sina'], acc=False),  # سيناء normalizes to سيناي
    tok('بدر',     ['place/badr', 'event/battle-of-badr']),
    tok('حنين',    ['place/wadi-hunayn', 'event/battle-of-hunayn']),
    tok('عرفات',   ['place/arafat']),
    tok('الاحقاف', ['place/al-ahqaf']),
    tok('بابل',    ['place/babil']),
    tok('الكعبه',  ['building/kaaba']),
    tok('البيت العتيق', ['building/kaaba'], acc=False),
    tok('البيت الحرام', ['building/kaaba'], acc=False),
    tok('المسجد الحرام', ['building/masjid-al-haram'], acc=False),
    tok('المسجد الاقصي', ['building/al-aqsa-mosque'], acc=False),
    tok('المشعر الحرام', ['place/muzdalifah'], acc=False),
    tok('الصفا والمروه', ['place/al-safa', 'place/al-marwa'], acc=False),
    tok('ثمود',    ['group/thamud']),
    tok('سبا',     ['group/saba'], acc=False),
    tok('قريش',    ['group/quraysh']),
    tok('ياجوج',   ['group/yajuj-majuj']),
    tok('ماجوج',   ['group/yajuj-majuj']),
    tok('الروم',   ['group/al-rum']),
    tok('اصحاب الكهف',  ['group/ashab-al-kahf'], acc=False),
    tok('اصحاب الفيل',  ['group/ashab-al-fil'], acc=False),
    tok('اصحاب الرس',   ['group/ashab-rass'], acc=False),
    tok('اصحاب الاخدود', ['group/ashab-ukhdud'], acc=False),
    tok('قوم تبع', ['group/qawm-tubba'], acc=False),
    # context-gated / multi-word names
    (re.compile(r'(?:اخاهم|اخوهم|النبي|نجينا)\s+صالح'), ['person/salih']),
    (re.compile(r'بن[يو] اسراييل'), ['group/banu-israil']),
    (re.compile(r'ال عمران'), ['group/al-imran']),
    (re.compile(r'(?:بنت|ابنت) عمران'), ['person/imran']),
    (re.compile(r'ال ياسين'), ['person/ilyas']),
    (re.compile(r'ذ[ياو] القرنين'), ['person/dhu-al-qarnayn']),
    (re.compile(r'ذ[ياو] الكفل'), ['person/dhu-al-kifl']),
    (re.compile(r'ذا النون'), ['person/yunus']),
    (re.compile(r'ابن مريم'), ['person/isa-ibn-maryam']),
    (re.compile(r'امرا[ته] فرعون'), ['person/asiya', 'person/firawn']),
    (re.compile(r'قضي زيد\b'), ['person/zayd-ibn-haritha']),
    (re.compile(r'احمد\b'), ['person/muhammad']),
    # عاد only inside its fixed collocations (the token is also the verb "return")
    (re.compile(r'(?:اخا|اخاهم|اخوهم|قوم|كذبت|الي|بعد|في|فتلك|فاما|واما|اما|الر?سلنا الي)\s+عاد'
                r'|عاد(?:ا)?\s+(?:الاولي|وثمود|وفرعون|فاهلكوا|فاستكبروا|كفروا|بالقاره|المرسلين)'
                r'|بعاد\b|وعاد\b|عاد\s+وثمود'), ['group/aad']),
]

EDGE = '  - { type: mentions, target: %s, sources: [' + SRC + '] }\n'


def targets_for(text_norm: str) -> set:
    out = set()
    for pat, ids in PATTERNS:
        if pat.search(text_norm):
            out.update(ids)
    return out


def main():
    apply = '--apply' in sys.argv
    stats = {}
    files_changed = 0
    samples = []
    for f in sorted(PDIR.glob('quran-*-*-*.yaml')) or sorted(PDIR.glob('quran-*-*.yaml')):
        if not re.match(r'quran-\d+-\d+\.yaml$', f.name):
            continue
        d = yaml.safe_load(f.read_text(encoding='utf-8'))
        # text_search is Tanzil's Imlaei-normalized line; the Uthmani `text`
        # drops letters (إبرٰهـۧم) and cannot be matched against names.
        tnorm = ' ' + norm(d.get('text_search', d.get('text', ''))).replace('  ', ' ') + ' '
        tgts = targets_for(tnorm)
        if not tgts:
            continue
        existing = {r.get('target') for r in (d.get('relations') or []) if isinstance(r, dict)}
        new = sorted(t for t in tgts if t not in existing)
        if not new:
            continue
        for t in new:
            stats[t] = stats.get(t, 0) + 1
        files_changed += 1
        if len(samples) < 25:
            samples.append((f.stem, new))
        if not apply:
            continue
        txt = f.read_text(encoding='utf-8')
        lines = txt.splitlines(keepends=True)
        out, in_rel, inserted = [], False, False
        for i, ln in enumerate(lines):
            out.append(ln)
            if ln.startswith('relations:'):
                in_rel = True
                continue
            if in_rel and not inserted:
                if ln.startswith('  - '):
                    continue  # keep consuming relation lines
                # first non-relation line: insert before it
                for t in new:
                    out.insert(len(out) - 1, EDGE % t)
                inserted = True
                in_rel = False
        f.write_text(''.join(out), encoding='utf-8')
    print(f"{'APPLIED' if apply else 'DRY'}: {files_changed} ayah records would gain/did gain edges")
    for t, n in sorted(stats.items(), key=lambda kv: -kv[1]):
        print(f"  {n:5d}  {t}")
    for stem, new in samples:
        print(' ', stem, '->', ', '.join(new))


if __name__ == '__main__':
    main()
