#!/usr/bin/env python3
"""Extract ordered isnad chains from hadith passage summaries (docs/plan/06 Phase 3: isnad mini-graphs).

Hadith summaries in data/passage/*.yaml state the chain in prose ("يروي مالك عن نافع عن
عبد الله بن عمر أن رسول الله…" or Arba'un's "من طريق القاسم بن محمد عن عمته عائشة").
Unordered `mentions` edges lose the sequence, so this script writes a `chain:` array of
person ids — first narrator nearest the work — only when every link resolves. When the
report's matn reaches the Prophet ("أن رسول الله…" marfu'), person/muhammad is appended
as the terminal; mawquf reports stop at their last stated narrator. Anonymous ellipses
("أبيه", "أمه", "جده") never resolve to a person id: the report is left chain-less
rather than guessed.

Run: python3 scripts/harvest/hadith/chains.py [--dry-run]
"""
import re, sys
from pathlib import Path
import yaml

REPO = Path(__file__).resolve().parents[3]
PASSAGES = REPO / "data" / "passage"
DRY = "--dry-run" in sys.argv

# ---- Arabic normalization (diacritics, alif forms, ta marbuta, hamza seats) ----
_DIAC = re.compile(r"[ً-ٰٟۡ-ۨ]")
def norm(s: str) -> str:
    s = _DIAC.sub("", s)
    s = s.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا")
    s = s.replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي")
    s = re.sub(r"\bابي\b", "ابو", s)  # أبي/أبو is a case ending on the same kunya
    return re.sub(r"\s+", " ", s).strip()

# ---- person index: full entities + stubs, keyed by normalized label/alias ----
def load_person_index():
    idx = {}
    for f in sorted((REPO / "data" / "person").glob("*.yaml")):
        d = yaml.safe_load(f.read_text()) or {}
        pid = d.get("id") or f"person/{f.stem}"
        for lab in [*(d.get("label") or {}).values(), *(d.get("aliases") or [])]:
            if isinstance(lab, str) and lab.strip():
                idx.setdefault(norm(lab), []).append(pid)
    for f in list((REPO / "data").glob("_stubs*.yaml")) + sorted((REPO / "data" / "_stubs.d").glob("*.yaml")):
        for s in yaml.safe_load(f.read_text()) or []:
            pid = s.get("id", "")
            if not pid.startswith("person/"):
                continue
            for lab in (s.get("label") or {}).values():
                if isinstance(lab, str) and lab.strip():
                    idx.setdefault(norm(lab), []).append(pid)
    return idx

# Canonical isnad names that are unambiguous inside hadith chains even though other
# people share the short form. Context: transmission from collectors to Companions.
ALIASES = {
    "مالك": "person/malik-ibn-anas",
    "مالك بن انس": "person/malik-ibn-anas",
    "نافع": "person/nafi-al-madani",                      # Nafi' mawla Ibn Umar, Malik's shaykh
    "ابن عمر": "person/abdullah-ibn-umar",
    "عبد الله بن عمر": "person/abdullah-ibn-umar",
    "عبد الله بن عمرو": "person/abdullah-ibn-umar",       # printed editions vary عمر/عمرو
    "ابن شهاب": "person/muhammad-ibn-shihab-al-zuhri",
    "ابن شهاب الزهري": "person/muhammad-ibn-shihab-al-zuhri",
    "محمد بن شهاب": "person/muhammad-ibn-shihab-al-zuhri",
    "محمد بن شهاب الزهري": "person/muhammad-ibn-shihab-al-zuhri",
    "الزهري": "person/muhammad-ibn-shihab-al-zuhri",
    "الاعرج": "person/abd-al-rahman-ibn-hurmuz-al-araj",
    "عايشه": "person/aisha",
    "عايشه ام المومنين": "person/aisha",
    "ام سلمه": "person/umm-salama",
    "حفصه": "person/hafsa",
    "ميمونه": "person/maymuna-bint-al-harith",
    "زينب بنت جحش": "person/zaynab-bint-jahsh",
    "ام حبيبه": "person/umm-habiba-bint-abi-sufyan",
    "صفيه بنت حيي": "person/safiyya-bint-huyayy",
    "صفيه بنت عبد المطلب": "person/safiyya-bint-abd-al-muttalib",
    "انس": "person/anas-ibn-malik",
    "انس بن مالك": "person/anas-ibn-malik",
    "ابو هريره": "person/abu-hurayra",
    "عبد الله بن مسعود": "person/abdullah-ibn-masud",
    "ابن مسعود": "person/abdullah-ibn-masud",
    "عبد الله بن عباس": "person/abdullah-ibn-abbas",
    "ابن عباس": "person/abdullah-ibn-abbas",
    "جابر بن عبد الله": "person/jabir-ibn-abdullah",
    "جابر": "person/jabir-ibn-abdullah",
    "سعد بن ابي وقاص": "person/saad-ibn-abi-waqqas",
    "عمر بن الخطاب": "person/umar-ibn-al-khattab",
    "ابو سعيد الخدري": "person/abu-said-al-khudri",
    "ابو ذر": "person/abu-dharr-al-ghifari",
    "سهل بن سعد": "person/sahl-ibn-sad-al-saidi",
    "سهل بن سعد الساعدي": "person/sahl-ibn-sad-al-saidi",
    "زيد بن ثابت": "person/zayd-ibn-thabit",
    "محمد بن سيرين": "person/muhammad-ibn-sirin",
    "سعيد بن المسيب": "person/said-ibn-al-musayyab",
    "القاسم بن محمد": "person/al-qasim-ibn-muhammad",
    "سالم بن عبد الله": "person/salim-ibn-abdallah-ibn-umar",
    "سالم بن عبد الله بن عمر": "person/salim-ibn-abdallah-ibn-umar",
    "سفيان الثوري": "person/sufyan-al-thawri",
    "يحيي بن سعيد": "person/yahya-ibn-said-al-ansari",
    "يحيي بن سعيد الانصاري": "person/yahya-ibn-said-al-ansari",
    "زيد بن اسلم": "person/zayd-ibn-aslam",
    "هشام بن عروه": "person/hisham-ibn-urwa",
    "عروه": "person/urwa-ibn-al-zubayr",
    "عروه بن الزبير": "person/urwa-ibn-al-zubayr",
    "خارج بن زيد": "person/kharija-ibn-zayd-ibn-thabit",
    "خارج بن زيد بن ثابت": "person/kharija-ibn-zayd-ibn-thabit",
    "سليمان بن يسار": "person/sulayman-ibn-yasar",
    "عبد الله بن دينار": "person/abdallah-ibn-dinar",
    "عمرو بن دينار": "person/amr-ibn-dinar",
    "ربيعه بن ابي عبد الرحمن": "person/rabia-ibn-abi-abd-al-rahman",
    "ربيعه الراي": "person/rabia-ibn-abi-abd-al-rahman",
    "ربيعه": "person/rabia-ibn-abi-abd-al-rahman",         # Rabī'a al-Ra'y, the Muwatta's Rabi'a
    "ابو بكر بن عبد الرحمن": "person/abu-bakr-ibn-abd-al-rahman-ibn-al-harith",
    "حميرن": "person/humran-ibn-aban",
    "حمران": "person/humran-ibn-aban",
    "السايب بن يزيد": "person/al-saib-ibn-yazid",
    "حسين بن علي": "person/husayn-ibn-ali",
    "نافع مولي ابن عمر": "person/nafi-al-madani",
    "نافع مولي عبد الله بن عمر": "person/nafi-al-madani",
    "جعفر بن محمد": "person/jafar-al-sadiq",              # Ja'far al-Sadiq, the Madinan isnad figure
    "جعفر بن محمد بن علي": "person/jafar-al-sadiq",
    "طاووس": "person/tawus-ibn-kaysan",
    "طاووس اليماني": "person/tawus-ibn-kaysan",
    "ابن محيريز": "person/ibn-muhayriz",
    "عبد الله بن محيريز": "person/ibn-muhayriz",
    "ابو جعفر القاري": "person/abu-jafar-al-qari",
    "ايوب بن ابو تميمه": "person/ayyub-al-sakhtiyani",
    "ايوب بن ابو تميمه السختياني": "person/ayyub-al-sakhtiyani",
    "ايوب السختياني": "person/ayyub-al-sakhtiyani",
    "ابن ابو مليكه": "person/abdallah-ibn-abi-mulayka",    # the Muwatta's Ibn Abi Mulayka
    "عبد الله بن ابو مليكه": "person/abdallah-ibn-abi-mulayka",
    "النبي": "person/muhammad",
    "رسول الله": "person/muhammad",
    "محمد": "person/muhammad",
}

PROPHET = "person/muhammad"
# the report reaches the Prophet when the matn clause after the isnad names him;
# bound to the clause's first sentence so a *following* route doesn't bleed in.
def reached_prophet(tail: str) -> bool:
    clause = re.split(r"[؛.]|،\s*(?:و?عن|وروي|ويروي|ويقول|وذكر)\b", tail[:200], maxsplit=1)[0]
    return bool(re.search(r"رسول الله|النبي", clause))

# Kin possessives that prefix a named person: "عمته عائشة" → resolve "عائشة".
KIN_PREFIX = re.compile(r"^(?:عمته|عمها|عمه|عما|ابيه|ابيها|ابيهما|ابه|اباه|امه|امها|امهما|امها|اخيه|اخته|جدته|جده|زوجته|مولاه|مولاته|ابنته|بنت|خاله|خالته|خاله بنت)\s+")
# Pure kin links with no name: never resolve.
KIN_ONLY = re.compile(r"^(?:عمته|عمها|عمه|عما|ابيه|ابيها|ابيهما|ابه|اباه|امه|امها|امهما|اخيه|اخته|جدته|جده|زوجته|مولاه|مولاته|ابنته|خاله|خالته)(?:\s+مرسلا)?\.?$")
# Trailing epithets that are descriptors, not part of the name: "عائشة زوج النبي" → "عائشة".
EPITHET_TAIL = re.compile(r"\s+(?:زوج النبي|زوجه|ام المومنين|رضي الله عنها?|رضي الله عنهما|صلي الله عليه وسلم|عليه السلام|عليه الصلاه والسلام|عليهم السلام|مرسلا|بمثل ذلك|وغيره|الانصاري|المدني|المكي|الكوفي|البصري)$")
# Matn fragments that leak after a colon: "أبو هريرة: أخبر النبي" → "أبو هريرة".
MATN_TAIL = re.compile(r"[:：].*$")

def resolve(name: str, idx, local):
    """name → person id or None. Local (mentions) candidates win; alias beats global."""
    n = norm(name)
    if not n or KIN_ONLY.match(n):
        return None
    # strip leading kin possessive then keep the remainder as the name
    n = MATN_TAIL.sub("", n).strip() or n
    n = KIN_PREFIX.sub("", n) or n
    n = EPITHET_TAIL.sub("", n) or n
    # "عطاء بن يسار وبسر بن سعيد والأعرج": a 'و'-joined name is a parallel branch,
    # not one narrator — flattening it would be wrong, so the chain is left unwritten
    if re.search(r"\sو\S", n):
        return None
    if KIN_ONLY.match(n):
        return None
    if n in ALIASES:
        return ALIASES[n]
    cands = idx.get(n)
    if cands:
        uniq = sorted(set(cands))
        # prefer a candidate the record already mentions
        hit = [c for c in uniq if c in local]
        if len(hit) == 1:
            return hit[0]
        if len(uniq) == 1:
            return uniq[0]
        return uniq[0] if len(uniq) <= 2 else None  # same name, two stubs → canonical id
    # containment match: "عمرة بنت عبد الرحمن" ⊂ label "عمرة بنت عبد الرحمن الأنصارية",
    # or nisba-augmented names: "الأعرج عبد الرحمن بن هرمز" ⊃ label "عبد الرحمن بن هرمز"
    matches = {pid for k, v in idx.items() if (k.startswith(n + " ") or k.endswith(" " + n) or n.endswith(" " + k)) for pid in v}
    hit = sorted(p for p in matches if p in local)
    if len(hit) == 1:
        return hit[0]
    if len(matches) == 1:
        return next(iter(matches))
    if len(matches) == 2:
        return min(matches, key=len)  # identical labels on two stubs → canonical id
    return None

# ---- chain segment extractors (run on normalized text: bare alef, ى→ي, ة→ه) ----
# each returns (names, tail): tail is the text following the chain so the caller can
# tell a report that reaches the Prophet (marfu') from one that stops at a Companion.
def split_names(seg: str):
    seg = re.split(r"\s+(?:ان|انه|انها|انهما|قال|يقول|كذا|عنهما|عنهن|عنه|عنها|اخبرته|اخبرتها|اخبرهما)\b", seg)[0]
    return [x.strip() for x in re.split(r"\s+عن\s+", seg) if x.strip()]

def muwatta_chain(ar: str):
    m = re.search(r"(?:يرويه?|بلغ|حدث|سمع|قال)\s+(?:يحيي بن يحيي(?: عن)?\s+)?(مالك عن .+?)(?=[،؛.]|\s+ان\b|\s+انه\b|\s+قال\b|$)", ar)
    if not m:
        m = re.search(r"(مالك عن .+?)(?=[،؛.]|\s+ان\b|\s+انه\b|\s+قال\b|$)", ar)
    if not m:
        return None
    return split_names(m.group(1)), ar[m.end(1):]

def arbaun_chain(ar: str):
    m = re.search(r"من (?:طريق|روايه) (.+?)(?=[،؛.]|\s+و(?:اخرج|خرجه|في|هي|قد|له|عند)\b|\s+يقول\b|\s+يجعله\b|$)", ar)
    if not m:
        return None
    # the Arba'un are all prophetic hadiths: the stated route ends at the Companion,
    # and the Prophet is the terminal of every report in the collection.
    return split_names(m.group(1)), "ان رسول الله"

def file_chain(ar: str, work: str):
    ar = norm(ar)
    if "muwatta" in work:
        return muwatta_chain(ar)
    if "arbaun" in work or "nawawi" in work:
        return arbaun_chain(ar)
    return None

def main():
    idx = load_person_index()
    wrote = skipped = partial = 0
    unresolved_freq = {}
    for f in sorted(PASSAGES.glob("*.yaml")):
        if not re.match(r"(muwatta|arbaun)-", f.name):
            continue
        text = f.read_text()
        if "\nchain:" in text:
            continue
        d = yaml.safe_load(text) or {}
        ar = (d.get("summary") or {}).get("ar", "")
        got = file_chain(ar, d.get("work", ""))
        if not got:
            skipped += 1
            continue
        names, tail = got
        local = {r["target"] for r in d.get("relations", []) if r.get("type") == "mentions"}
        chain, fails = [], []
        for name in names:
            pid = resolve(name, idx, local)
            (chain if pid else fails).append(pid or name)
        if fails:
            partial += 1
            for x in fails:
                unresolved_freq[x] = unresolved_freq.get(x, 0) + 1
            continue
        # append the Prophet only when the report's matn reaches him (marfu');
        # mawquf reports end at their Companion link
        if reached_prophet(tail) and (not chain or chain[-1] != PROPHET):
            chain.append(PROPHET)
        if len(chain) < 2:
            skipped += 1
            continue
        # insert `chain: […]` after the `unit:` line, flow-seq matching file style
        line = "chain: [" + ", ".join(chain) + "]"
        new = re.sub(r"(?m)^(unit: .+)$", r"\1\n" + line, text, count=1)
        if new == text:
            skipped += 1
            continue
        if not DRY:
            f.write_text(new)
        wrote += 1
    print(f"wrote {wrote}, no-segment {skipped}, partial/unresolved {partial}")
    for k, v in sorted(unresolved_freq.items(), key=lambda kv: -kv[1])[:25]:
        print(f"  unresolved {v:4d}  {k}")

if __name__ == "__main__":
    main()
