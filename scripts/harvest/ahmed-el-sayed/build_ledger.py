#!/usr/bin/env python3
"""Build harvest/ahmed-el-sayed/ledger.tsv and the recordings map from the pages written by fetch_feed.py.

One row per unique episode of Ahmed El-Sayed's public podcast feed (SoundCloud), deduplicated by the track id. Metadata
only: titles, dates, durations and the feed's own URLs. The feed owner's contact address is never read.

Merge rule (re-runnable): the ledger is the project's memory. When it already exists, the columns `status`,
`records_created`, `pr`, `also_on` and `note` of an existing row are kept as they are and only new episodes are added, so
running this again after the feed grows never resets finished work.

Usage: build_ledger.py <pages-dir> [--ledger harvest/ahmed-el-sayed/ledger.tsv] [--map site/src/data/recordings-ahmed-el-sayed.json]
Standard library only.
"""
import argparse, csv, json, re, sys, unicodedata
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from email.utils import parsedate_to_datetime
from pathlib import Path

NS = {"itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd"}
COLUMNS = ["episode_id", "show", "episode_no", "title_ar", "date", "duration", "canonical_url", "audio_url", "also_on",
           "status", "records_created", "pr", "show_slug", "locator", "track_id", "note"]
KEEP = ["status", "records_created", "pr", "also_on", "note"]  # never overwritten on a re-run

# (slug, pattern on the normalised first segment, Arabic title as published, English gloss). Order matters: the first match wins.
SHOWS = [
    ("seerah-2026", r"^سيره رسول الله", "سيرة رسول الله", "The Biography of the Messenger of God (2026)"),
    ("seerah-lilmuslihin", r"^السيره النبويه للمصلحين", "السيرة النبوية للمصلحين", "The Prophetic Biography for Reformers"),
    ("khayr-al-qurun", r"^خير القرون", "خير القرون", "The Best of Generations"),
    ("tariq-ila-bayt-al-maqdis", r"^الطريق الي بيت المقدس", "الطريق إلى بيت المقدس", "The Road to Jerusalem"),
    ("umma-bayna-ihtilalayn", r"^الامه بين احتلالين", "الأمة بين احتلالين", "The Ummah between Two Occupations"),
    ("yawm-al-furqan", r"^يوم الفرقان", "يوم الفرقان... يوم بدر العظيم", "The Day of Criterion: the Great Day of Badr"),
    ("riyad-al-salihin", r"^رياض الصالحين", "رياض الصالحين (أنوار السنة المحمدية)", "Riyad al-Salihin (Lights of the Prophetic Sunnah)"),
    ("anwar-al-sahihayn", r"^انوار الصحيحين", "أنوار الصحيحين", "Lights of the Two Sahihs"),
    ("sharh-al-minhaj", r"^شرح المنهاج من ميراث النبوه", "شرح المنهاج من ميراث النبوة", "Commentary on al-Minhaj min Mirath al-Nubuwwa"),
    ("minhaj-lil-jil-al-sa-id", r"^المنهاج من ميراث النبوه للجيل الصاعد", "المنهاج من ميراث النبوة للجيل الصاعد", "al-Minhaj min Mirath al-Nubuwwa for the Rising Generation"),
    ("minhaj-audiobook", r"^المنهاج من ميراث النبوه", "المنهاج من ميراث النبوة (كتاب صوتي)", "al-Minhaj min Mirath al-Nubuwwa (audiobook)"),
    ("anwar-al-anbiya", r"^انوار الانبياء", "أنوار الأنبياء", "Lights of the Prophets"),
    ("madarasat-al-anam", r"^مدارسه سوره الانعام", "مدارسة سورة الأنعام", "A Study of Surat al-An'am"),
    ("maqasid-al-suwar", r"^مقاصد (السور|سوره)", "مقاصد السور", "The Aims of the Surahs"),
    ("maqasid-madarij-al-salikin", r"^مقاصد مدارج السالكين", "مقاصد مدارج السالكين", "The Aims of Madarij al-Salikin"),
    ("safwat-al-fawaid", r"^صفوه الفوائد", "صفوة الفوائد", "The Choicest Benefits"),
    ("haqiba-aqida", r"^الحقيبه الشرعيه$", "الحقيبة الشرعية: العقيدة", "The Sharia Toolkit: Creed"),
    ("haqiba-tafsir-jil", r"^الحقيبه الشرعيه للجيل الصاعد", "الحقيبة الشرعية للجيل الصاعد: التفسير", "The Sharia Toolkit for the Rising Generation: Tafsir"),
    ("manhaj-islahi-anfal-tawba", r"^المنهج الاصلاحي من سورتي الانفال", "المنهج الإصلاحي من سورتي الأنفال والتوبة", "The Reform Method from Surat al-Anfal and al-Tawba"),
    ("tajarib-islahiyya", r"^التجارب الاصلاحيه في العصر الحديث", "التجارب الإصلاحية في العصر الحديث", "Reform Experiences in the Modern Era"),
    ("fadail-al-sahaba-ghaith-al-sari", r"^فضائل الصحابه", "فضائل الصحابة (غيث الساري)", "Virtues of the Companions (Ghayth al-Sari)"),
    ("ghaith-al-sari", r"^(احمد السيد )?غيث الساري", "غيث الساري من هدايات البخاري", "Ghayth al-Sari: Guidance from al-Bukhari"),
    ("ihya-minhaj-al-nubuwwa", r"^احياء منهاج النبوه", "إحياء منهاج النبوة", "Reviving the Prophetic Method"),
    ("zad-al-muslihin", r"^زاد المصلحين", "زاد المصلحين", "Provisions of the Reformers"),
    ("siyasa-shar-iyya-ibn-taymiyya", r"^شرح كتاب السياسه الشرعيه", "شرح كتاب السياسة الشرعية لابن تيمية", "Commentary on Ibn Taymiyya's al-Siyasa al-Shar'iyya"),
    ("suwiyyat-al-mu-min", r"^سويه المؤمن", "سوية المؤمن", "The Balance of the Believer"),
    ("anwar-al-salihin", r"^انوار الصالحين", "أنوار الصالحين", "Lights of the Righteous"),
    ("ufuq-podcast", r"^بودكاست افق", "بودكاست أُفُق", "Ufuq Podcast"),
    ("asila-wa-tawasul", r"^اسئله وتواصل", "أسئلة وتواصل", "Questions and Contact"),
    ("asila-al-jil", r"^اسئله الجيل", "أسئلة الجيل", "Questions of the Generation"),
    ("bawsalat-al-muslih", r"^بوصله المصلح", "بوصلة المصلح", "The Reformer's Compass"),
    ("tasil-qadaya-al-mar-a", r"^التاصيل المنهجي لقضايا المراه", "التأصيل المنهجي لقضايا المرأة", "A Methodical Grounding of Women's Questions"),
    ("abjadiyyat-al-thaqafa", r"^ابجديات الثقافه", "أبجديات الثقافة", "The ABCs of Culture"),
    ("sina-at-al-murabbi", r"^صناعه المربي", "صناعة المربي", "Making the Educator"),
    ("tarikh-al-fikr-al-gharbi", r"^تاريخ الفكر الغربي الحديث", "تاريخ الفكر الغربي الحديث", "History of Modern Western Thought"),
    ("bina-al-aqida-lil-jil", r"^بناء العقيده للجيل الصاعد", "بناء العقيدة للجيل الصاعد", "Building Creed for the Rising Generation"),
    ("sharh-nazm-al-mu-in", r"^شرح \(نظم المعين\)", "شرح (نظم المعين) في الحديث", "Commentary on Nazm al-Mu'in on Hadith"),
    ("uli-al-azm", r"^اولو العزم", "أولو العزم", "The Messengers of Firm Resolve"),
    ("li-yuhibbani-allah", r"^لكي يحبني الله", "لكي يحبني الله", "So That God Loves Me"),
    ("al-hidaya-al-ma-rifiyya", r"^الهدايه المعرفيه", "الهداية المعرفية", "Epistemic Guidance"),
    ("wa-qad-ahsana-bi", r"^وقد احسن بي", "وقد أحسن بي", "And He Was Good to Me"),
    ("thumma-ji-ta-ala-qadar", r"^ثم جئت علي قدر", "ثم جئت على قدر يا موسى", "Then You Came, O Moses, at the Decreed Time"),
    ("ibrahim-alladhi-waffa", r"^ابراهيم الذي وفي", "إبراهيم الذي وفّى", "Abraham Who Fulfilled"),
    ("qayyimiyyat", r"^قيميات", "قيّميّات", "Qayyimiyyat"),
    ("al-tafkir-al-naqid", r"^التفكير الناقد", "التفكير الناقد للجيل الصاعد", "Critical Thinking for the Rising Generation"),
    ("sham-bayt-al-maqdis", r"(الشام|بيت المقدس|المسجد الاقصي|الوارثون|ايناس المرابطين)", "الشام وبيت المقدس (تجميع مستنتج من العناوين)", "Greater Syria and Jerusalem (grouping inferred from titles)"),
]
INFERRED = {"sham-bayt-al-maqdis"}
AUTHOR_TAIL = re.compile(r"\s*\|\s*(الشيخ\s+)?(احمد|أحمد)\s+(السي[دّ]+|السيّد)\s*$")
HONORIFIC = re.compile(r"\s*(ﷺ|صلى الله عليه وسلم|صلي الله عليه وسلم|عليه السلام|عليه الصلاة والسلام)\s*")
AR_DIGITS = str.maketrans("٠١٢٣٤٥٦٧٨٩", "0123456789")


def norm(s):
    s = s.translate(AR_DIGITS)
    s = re.sub(r"[ً-ْـ]", "", s)
    for a, b in (("ى", "ي"), ("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ة", "ه")):
        s = s.replace(a, b)
    return s


def clean_title(raw):
    """The title as published, without typed honorifics (the museum's rule) and without the trailing author segment."""
    t = unicodedata.normalize("NFC", raw)
    t = HONORIFIC.sub(" ", t)
    t = re.sub(r"\s*\|\s*(الشيخ\s+)?أحمد\s+(السيّد|السيد)\s*$", "", t.strip())
    return re.sub(r"\s+", " ", t).strip()


def find_number(segs, prefix_len):
    rest = segs[0][prefix_len:]
    m = re.search(r"\d+", rest)
    if m:
        return int(m.group())
    for seg in segs[1:]:
        if re.fullmatch(r"\d+", seg.strip()):
            return int(seg)
        m = re.search(r"(\d+)\s*\)?\s*$", seg)
        if m:
            return int(m.group(1))
    return None


def read_items(pages):
    items = {}
    for page in sorted(Path(pages).glob("page-*.xml")):
        for it in ET.parse(page).getroot().iter("item"):
            guid = it.findtext("guid") or ""
            track = guid.rsplit("/", 1)[-1]
            when = parsedate_to_datetime(it.findtext("pubDate")).date().isoformat()
            enc = it.find("enclosure")
            items[track] = dict(track=track, title=it.findtext("title") or "", date=when, link=it.findtext("link") or "",
                                dur=(it.findtext("itunes:duration", namespaces=NS) or "").strip(),
                                audio=(enc.get("url") if enc is not None else ""))
    return items


def classify(item):
    t = norm(clean_title(item["title"]))
    segs = [s.strip() for s in t.split("|") if s.strip()]
    first = segs[0] if segs else t
    for slug, pat, ar, en in SHOWS:
        m = re.search(pat, first)
        if m and (slug != "sham-bayt-al-maqdis" or True):
            n = None
            if slug == "ufuq-podcast":
                n = int(segs[-1]) if segs and re.fullmatch(r"\d+", segs[-1]) else None
            elif slug in ("sham-bayt-al-maqdis", "maqasid-al-suwar"):
                n = None
            else:
                n = find_number(segs, m.end())
            return slug, ar, n
    return "standalone", "محاضرات منفردة", None


def build(items, old_rows):
    rows = []
    for track, it in items.items():
        slug, show_ar, n = classify(it)
        rows.append(dict(it, slug=slug, show=show_ar, n=n))
    count = Counter((r["slug"], r["n"]) for r in rows if r["n"] is not None)
    out = []
    for r in sorted(rows, key=lambda r: (r["slug"], r["date"], r["track"])):
        unique = r["n"] is not None and count[(r["slug"], r["n"])] == 1
        eid = f"{r['slug']}-{r['n']:03d}" if unique else f"{r['slug']}-t{r['track']}"
        loc = f"{r['slug']}/ep{r['n']}" if unique else f"{r['slug']}/ep{r['track']}"
        row = {"episode_id": eid, "show": r["show"], "episode_no": "" if r["n"] is None else str(r["n"]),
               "title_ar": clean_title(r["title"]), "date": r["date"], "duration": r["dur"], "canonical_url": r["link"],
               "audio_url": r["audio"], "also_on": "", "status": "listed", "records_created": "0", "pr": "",
               "show_slug": r["slug"], "locator": loc, "track_id": r["track"], "note": ""}
        notes = []
        if r["slug"] in INFERRED:
            notes.append("show grouping inferred from the title; confirm against a playlist")
        if r["n"] is not None and not unique:
            notes.append("printed number repeats inside the show (numbered per book, season or module); locator uses the track id")
        if r["slug"] == "standalone":
            notes.append("not matched to a named series; date is the SoundCloud upload date")
        if notes:
            row["note"] = "; ".join(notes)
        old = old_rows.get(r["track"])
        if old:
            for k in KEEP:
                row[k] = old.get(k, row[k])
        out.append(row)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pages")
    ap.add_argument("--ledger", default="harvest/ahmed-el-sayed/ledger.tsv")
    ap.add_argument("--map", default="site/src/data/recordings-ahmed-el-sayed.json")
    a = ap.parse_args()
    ledger = Path(a.ledger)
    old = {}
    if ledger.exists():
        with ledger.open(encoding="utf8", newline="") as f:
            for row in csv.DictReader(f, delimiter="\t"):
                old[row["track_id"]] = row
    rows = build(read_items(a.pages), old)
    ledger.parent.mkdir(parents=True, exist_ok=True)
    with ledger.open("w", encoding="utf8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS, delimiter="\t", lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    recordings = defaultdict(dict)
    for r in rows:
        series, ep = r["locator"].split("/ep")
        recordings[series][ep] = {"media": r["audio_url"], "page": r["canonical_url"]}
    Path(a.map).write_text(json.dumps({k: dict(sorted(v.items(), key=lambda kv: int(kv[0]))) for k, v in sorted(recordings.items())}, ensure_ascii=False, indent=1) + "\n", encoding="utf8")
    print(f"{len(rows)} episodes, {len(recordings)} shows -> {ledger}")


if __name__ == "__main__":
    main()
