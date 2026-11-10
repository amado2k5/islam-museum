#!/usr/bin/env python3
"""Turn wikipedia-ar-gaps.tsv into lane batches of at most 25 entities each (docs/agents/workflow.md: small batches, one lane per session).
Lanes are assigned from categories and kind; each batch file lists title_ar, title_en, kind, score so a session can look the person/place up in
OpenITI / its book lane and write the entity from real sources (Wikipedia is a pointer only). Writes $HARVEST/candidates/batches/<lane>-NN.tsv and prints the plan."""
import csv, os, re
from collections import defaultdict
from pathlib import Path
H = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest")); OUT = H / "candidates/batches"; OUT.mkdir(parents=True, exist_ok=True)
for f in OUT.glob("*.tsv"): f.unlink()
rows = list(csv.DictReader(open(H / "candidates/entities/wikipedia-ar-gaps.tsv"), delimiter="\t"))
LANES = [  # (lane, predicate over row)  first match wins
 ("sahabiyat",     lambda r: re.search("صحابيات", r["categories"])),
 ("sahaba",        lambda r: re.search("صحابة|صحابي", r["categories"]) and not re.search("تابع", r["categories"]) and r["kind"].startswith("person")),
 ("tabiun-narrators", lambda r: r["kind"] == "person-narrator" or re.search("تابعي|تابعين|رواة", r["categories"])),
 ("scholars-imams", lambda r: r["kind"] == "person-scholar" or re.search("علماء|فقهاء|محدثين|مفسرين|أئمة", r["categories"])),
 ("rulers-caliphs", lambda r: r["kind"] in ("person-ruler", "person-office") or re.search("خلفاء|سلاطين|ملوك|أمراء|ولاة", r["categories"])),
 ("battles-events", lambda r: r["kind"] == "event-battle"),
 ("mosques-places", lambda r: r["kind"] in ("building-mosque", "place")),
 ("works-books",   lambda r: r["kind"] == "work"),
 ("groups-dynasties", lambda r: r["kind"] == "group" or re.search("دول|سلالات|فرق", r["categories"])),
 ("people-other",  lambda r: r["kind"].startswith("person")),
 ("pages-review",  lambda r: True)]
lanes = defaultdict(list)
for r in rows:
    for name, pred in LANES:
        if pred(r): lanes[name].append(r); break
print(f"{'lane':20}{'candidates':>11}{'batches':>9}")
for name, _ in LANES:
    rs = lanes[name]; rs.sort(key=lambda r: -int(r["score"]))
    for i in range(0, min(len(rs), 500), 25):   # plan the first 20 batches per lane; the rest stay in the gaps file
        with open(OUT / f"{name}-{i//25+1:02d}.tsv", "w") as f:
            f.write("title_ar\ttitle_en\tkind\tscore\tinlinks\tcategories\n")
            for r in rs[i:i+25]: f.write("\t".join([r["title_ar"], r["title_en"], r["kind"], r["score"], r["inlinks"], r["categories"]]) + "\n")
    print(f"{name:20}{len(rs):>11}{min(len(rs),500)//25 + (1 if min(len(rs),500)%25 else 0):>9}")
    for r in rs[:6]: print("     ", r["score"], r["title_ar"], "|", r["title_en"])
