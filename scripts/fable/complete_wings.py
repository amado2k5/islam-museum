#!/usr/bin/env python3
"""Give every cornerstone a wing, so no cornerstone is absent from all nine halls.

At the mission baseline 48 of the 270 cornerstones had `wings: []`: they appeared on no wing page. This script fills the
field by rule, never by taste:

  CLASS_WING   the wing the museum's own plan assigns the class (docs/plan/01-vision.md section 5), which is also the wing
               most tagged records of that class already carry (the script prints that tally from data/ as its evidence).
  EXPLICIT     three additions that the class rule cannot reach, each with the reason it rests on.

It touches only records with `importance: 1`, only the `wings:` line, and never removes a wing a record already has.

  python3 scripts/fable/complete_wings.py            # report only
  python3 scripts/fable/complete_wings.py --write    # edit data/, at most 25 records per run (one commit per run)
"""
import collections, os, re, sys

CLASS_WING = {"period": "time", "polity": "time", "practice": "living", "work": "words", "group": "people"}
EXPLICIT = {
    "period/contemporary-era": (["time", "today"], "the era the Today wing describes: 'the people of the present' (i18n wings.today); plan section 5 lists '21st-century events' under Today"),
    "building/al-azhar": (["today"], "plan section 5 names Al-Azhar as a Today example; the record's own prose calls it one of Cairo's most important mosques today"),
    "object/kiswa": (["made"], "the record's own prose says it is made today in the Kiswa workshop in Mecca by two hundred craftsmen; Made is 'what Muslims make today'"),
}
WINGS = ["time", "place", "people", "ideas", "objects", "words", "living", "today", "made"]
LINE = re.compile(r"^wings:[ \t]*\[([^\]\n]*)\][ \t]*$", re.M)


def records():
    for cls in sorted(os.listdir("data")):
        d = os.path.join("data", cls)
        if os.path.isdir(d) and not cls.startswith("_"):
            for f in sorted(os.listdir(d)):
                if f.endswith(".yaml"):
                    yield cls, f"{cls}/{f[:-5]}", os.path.join(d, f)


def wings_of(text):
    m = LINE.search(text)
    if m:
        return [w.strip() for w in m.group(1).split(",") if w.strip()], "flow"
    b = re.search(r"^wings:[ \t]*\n((?:[ \t]*-[ \t]*\w+[ \t]*\n)+)", text, re.M)
    if b:
        return re.findall(r"-[ \t]*(\w+)", b.group(1)), "block"
    return None, None


def main():
    write = "--write" in sys.argv
    tally = collections.defaultdict(collections.Counter)
    todo = []
    for cls, rid, path in records():
        text = open(path, encoding="utf-8").read()
        wings, style = wings_of(text)
        for w in wings or []:
            tally[cls][w] += 1
        if not re.search(r"^importance:\s*1\s*$", text, re.M):
            continue
        have = wings or []
        want = list(have)
        if not have and cls in CLASS_WING:
            want.append(CLASS_WING[cls])
        for w in EXPLICIT.get(rid, ([], ""))[0]:
            if w not in want:
                want.append(w)
        if want != have:
            todo.append((rid, path, text, have, want, style))
    print("evidence: wings carried by tagged records of each ruled class (all records, before this change)")
    for cls, wing in CLASS_WING.items():
        t = tally[cls]
        print(f"  {cls:9} -> {wing:7} carried by {t[wing]} of {sum(t.values())} wing tags on {cls} records; full tally {dict(t.most_common())}")
    print(f"cornerstones to change: {len(todo)}" + (f"; writing the first {min(25, len(todo))}" if write else ""))
    for rid, path, text, have, want, style in (todo[:25] if write else todo):
        why = EXPLICIT[rid][1] if rid in EXPLICIT else f"class rule: {rid.split('/')[0]} -> {CLASS_WING[rid.split('/')[0]]}"
        print(f"  {rid}: {have} -> {want}  ({why})")
        if write:
            if style != "flow":
                sys.exit(f"{path}: wings is not a one-line list; edit by hand")
            new = LINE.sub("wings: [" + ", ".join(want) + "]", text, count=1)
            open(path, "w", encoding="utf-8").write(new)
    left = 0
    for cls, rid, path in records():
        text = open(path, encoding="utf-8").read()
        if re.search(r"^importance:\s*1\s*$", text, re.M) and not (wings_of(text)[0]):
            left += 1
    print(f"cornerstones with no wing after this run: {left}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
