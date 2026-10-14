#!/usr/bin/env python3
"""Generate the museum's Qur'an records from the verified, frozen Tanzil files (docs/plan/15 §6.3 steps 4-5).
The Uthmani text is copied exactly as in the Tanzil file; nothing here writes, completes or corrects any Qur'an text.
Outputs: data/work/quran.yaml, data/source/tanzil-quran.yaml, 114 sura + 6,236 ayah passage files, verbatim copies of the source files
(data/work/quran-source/), and the checksums that scripts/validate.ts re-checks on every build.
Usage: HARVEST=~/islam-museum-harvest python scripts/harvest/quran/generate.py"""
import hashlib, json, os, shutil, sys
from pathlib import Path
import yaml
sys.path.insert(0, str(Path(__file__).resolve().parent))
from suras import AYAT, NAMES

HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
REPO = Path(__file__).resolve().parents[3]
U = HARVEST / "raw/quran/tanzil-uthmani-v1.1.txt"
S = HARVEST / "raw/quran/tanzil-simple-clean-v1.1.txt"
SRC_DIR = REPO / "data/work/quran-source"


def parse(path: Path) -> dict:
    out, notice = {}, []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("#"):
            notice.append(line); continue
        if not line.strip():
            continue
        s, a, t = line.split("|", 2)
        out[(int(s), int(a))] = t
    out["notice"] = "\n".join(notice)
    return out


def scalar(s: str) -> str:
    """A YAML double-quoted scalar that round-trips the exact code points."""
    q = json.dumps(s, ensure_ascii=False)
    if yaml.safe_load("v: " + q)["v"] != s:
        q = json.dumps(s, ensure_ascii=True)
        assert yaml.safe_load("v: " + q)["v"] == s
    return q


u, sc = parse(U), parse(S)
notice = u.pop("notice"); sc.pop("notice")
assert len(u) == 6236 and len(sc) == 6236 and set(u) == set(sc)

SRC_DIR.mkdir(parents=True, exist_ok=True)
for p in (U, S):
    shutil.copyfile(p, SRC_DIR / p.name)          # verbatim copies, notice included
sha = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in (U, S)}
for p in (U, S):
    assert hashlib.sha256((SRC_DIR / p.name).read_bytes()).hexdigest() == sha[p.name]

HEADER = "# Qur'an text: Tanzil Project v1.1 (https://tanzil.net), verbatim and unchanged. Licence notice: data/work/quran-source/. Never edit the text by hand.\n"
GEN = '"scripts/harvest/quran/generate.py; text byte-identical to Tanzil v1.1"'

(REPO / "data/source").mkdir(parents=True, exist_ok=True)
(REPO / "data/source/tanzil-quran.yaml").write_text(f"""id: source/tanzil-quran
class: source
kind: reference_data
type: webpage
label: {{ en: "Tanzil Project, Qur'an text v1.1", ar: "مشروع تنزيل، نص القرآن الإصدار 1.1" }}
summary: {{ en: "The verified Qur'an text (Uthmani and Simple Clean) used verbatim by the museum, under Tanzil's terms of use." }}
title: "Tanzil Quran Text (Uthmani and Simple Clean), version 1.1"
publisher: Tanzil Project
URL: https://tanzil.net/download/
language: ar
reliability_note: "Verified text distributed by the Tanzil Project. Terms: verbatim copies only, attribution to Tanzil with a link to tanzil.net, and the copyright notice kept in every copy."
open_access: true
status: {{ review: draft, completeness: 3, generated_by: {GEN} }}
""", encoding="utf-8")

(REPO / "data/work/quran.yaml").write_text(f"""id: work/quran
class: work
kind: book
genre: [scripture]
label: {{ en: "The Qur'an", ar: القرآن }}
summary:
  en: "The scripture of Islam, which Muslims believe was revealed to the Prophet Muhammad; 114 suras and 6,236 verses in the Hafs reading as given by the Tanzil text."
  ar: "كتاب الإسلام المقدس، يؤمن المسلمون بأنه أُنزل على النبي محمد؛ 114 سورة و6236 آية برواية حفص كما في نص تنزيل."
wings: [words]
themes: [scripture-and-its-sciences]
regions: [arabia]
language: language/arabic
structure: "114 suras, 6,236 verses"
sensitivity: sacred
text_source:
  name: "Tanzil Project, Quran Text v1.1"
  url: https://tanzil.net/download/
  files:
    - {{ path: data/work/quran-source/tanzil-uthmani-v1.1.txt, sha256: {sha['tanzil-uthmani-v1.1.txt']}, use: text }}
    - {{ path: data/work/quran-source/tanzil-simple-clean-v1.1.txt, sha256: {sha['tanzil-simple-clean-v1.1.txt']}, use: text_search }}
  frozen: "2026-10-11"
  rule: "The text in passage/quran-* files must equal these files exactly; scripts/validate.ts checks it on every build."
provenance: {{ layer: by, source: tanzil-quran-v1.1 }}
sources: [source/tanzil-quran]
status: {{ review: draft, completeness: 2, generated_by: {GEN} }}
""", encoding="utf-8")

# Sura chronology (docs/plan/21 §C.6): the Cairo (1924) edition's order of revelation and Meccan/Medinan classification,
# as carried in Tanzil's quran-data.xml. A well-known ordering, not a unanimous one; the site labels it as such.
REVELATION_ORDER = [96,68,73,74,1,111,81,87,92,89,93,94,103,100,108,102,107,109,105,113,114,112,53,80,97,91,85,95,106,101,75,104,77,50,90,86,54,38,7,72,36,25,35,19,20,56,26,27,28,17,10,11,12,15,6,37,31,34,39,40,41,42,43,44,45,46,51,88,18,16,71,14,21,23,32,52,67,69,70,78,79,82,84,30,29,83,2,8,3,33,60,4,99,57,47,13,55,76,65,98,59,24,22,63,58,49,66,64,61,62,48,5,9,110]
MEDINAN = {2,3,4,5,8,9,13,22,24,33,47,48,49,55,57,58,59,60,61,62,63,64,65,66,76,98,99,110}
ORDER_OF = {s: i + 1 for i, s in enumerate(REVELATION_ORDER)}

pdir = REPO / "data/passage"
shutil.rmtree(pdir, ignore_errors=True); pdir.mkdir(parents=True)
for i, ((ar, en), n) in enumerate(zip(NAMES, AYAT), 1):
    (pdir / f"quran-{i}.yaml").write_text(f"""id: passage/quran-{i}
class: passage
unit: sura
work: work/quran
ref: "{i}"
sura: {i}
revelation_order: {ORDER_OF[i]}
revelation_place: {"medinan" if i in MEDINAN else "meccan"}
label: {{ en: "Sura {i}: {en}", ar: {scalar(f'سورة {ar}')} }}
summary:
  en: "Sura {i} of the Qur'an, {en}, has {n} verses."
  ar: {scalar(f'السورة {i} من القرآن، سورة {ar}، وعدد آياتها {n}.')}
wings: [words]
themes: [scripture-and-its-sciences]
relations:
  - {{ type: part_of, target: work/quran }}
sensitivity: sacred
provenance: {{ layer: by, source: tanzil-quran-v1.1 }}
sources: [source/tanzil-quran]
status: {{ review: draft, completeness: 1, generated_by: {GEN} }}
""", encoding="utf-8")
    for a in range(1, n + 1):
        (pdir / f"quran-{i}-{a}.yaml").write_text(HEADER + f"""id: passage/quran-{i}-{a}
class: passage
unit: ayah
work: work/quran
ref: "{i}:{a}"
sura: {i}
aya: {a}
label: {{ en: "Qur'an {i}:{a}", ar: {scalar(f'القرآن {i}:{a}')} }}
summary:
  en: "Qur'an {i}:{a} (sura {en}, verse {a})."
  ar: {scalar(f'القرآن {i}:{a} (سورة {ar}، الآية {a}).')}
text: {scalar(u[(i, a)])}
text_search: {scalar(sc[(i, a)])}
relations:
  - {{ type: part_of, target: passage/quran-{i} }}
sensitivity: sacred
provenance: {{ layer: by, source: tanzil-quran-v1.1 }}
sources: [source/tanzil-quran]
status: {{ review: draft, completeness: 1, generated_by: {GEN} }}
""", encoding="utf-8")
print("generated work/quran, 114 suras, 6236 ayat; sha256", sha)
