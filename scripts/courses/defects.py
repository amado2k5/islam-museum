#!/usr/bin/env python3
"""The vision pass's defect register (statement 9): docs/courses-mission/vision/defects.json.

Builds the register from the reviewers' own tables (round-N/review-*.md) and the decisions below. A defect is either
  fix       changed in the code; it counts as closed only when a LATER fresh reviewer confirms it gone on a re-taken
            screenshot (round-N/confirm-*.md, a table of `id | verdict | what the reviewer sees`), or
  register  left standing, with the reason (pilot data this mission does not edit; a deliberate design choice;
            a reviewer's claim that a measurement disproves; a capture artefact).
Nothing is closed by this script's author: `status` comes only from the confirm tables.

  python3 scripts/courses/defects.py          # rebuild defects.json from the review and confirm tables
"""
import glob, json, os, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
V = os.path.join(ROOT, "docs", "courses-mission", "vision")

PILOT = "Pilot data. The text, label or structure comes from the pilot's records, which this mission does not rewrite; listed in PUBLISH.md."
DESIGN = "By design: "
REGISTER = {
    "AR-3": PILOT + " The lesson text holds an unisolated parenthetical with a Latin word inside Arabic.",
    "AR-4": "Not a defect as far as the reviewer could tell ('possible'): in right-to-left text an opening bracket is drawn as ')' at the right of its phrase. The source label's spacing is the source record's.",
    "AR-5": PILOT + " The strand summary's parenthetical is wrapped in direction isolates, as the repository rule requires, and breaks across lines.",
    "AR-15": "Disproved by measurement: o03_taps.mjs measures every control of the surface at 390 px and finds none under 44 px high. The reviewer judged the visible text, not the tap area.",
    "AR-16": DESIGN + "the previous/next row spans the lesson column (760 px); prose is set narrower, at the site's reading measure.",
    "AR-20": PILOT + " The strand labels contain an em dash that can end a wrapped breadcrumb line.",
    "AR-22": "One course exists today, so the finder is short; the space fills as courses are ingested.",
    "AR-24": PILOT + " The pilot omitted strand A (STEM skills); the audit lists it.",
    "EN-3": DESIGN + "classroom view is the same page and scrolls; the bar is fixed to the bottom of the screen, and the page keeps a bottom margin so the last line clears it.",
    "EN-5": DESIGN + "classroom view is the same page and scrolls; the bar is fixed to the bottom of the screen, and the page keeps a bottom margin so the last line clears it.",
    "EN-21": PILOT + " A connection title an 11-year-old will not follow; drafts are not reworded by this mission.",
    "EN-22": PILOT + " An ungrammatical sentence in a connection text; drafts are not reworded by this mission.",
    "EN-23": "Disproved by measurement: o03_taps.mjs measures every control of the surface at 390 px and finds none under 44 px high. The reviewer judged the visible text, not the tap area.",
    "EN-28": DESIGN + "'I can now' is a self-assessment the student ticks; marking the lesson done does not tick it for them, and the ticks are not stored.",
    "EN-29": DESIGN + "'I can now' is a self-assessment the student ticks; marking the lesson done does not tick it for them, and the ticks are not stored.",
    "EN-32": DESIGN + "the check is built from the records with no authored content, so the wrong-answer line cannot name a card; it sends the student back to the cards.",
    "EN-38": DESIGN + "a done lesson keeps its number in a filled ring; the word 'Done' beside it, enlarged in round 2, carries the state.",
    "EN-39": PILOT + " The pilot omitted strand A (STEM skills); the audit lists it.",
    "EN-40": PILOT + " The strand labels and summaries carry the curriculum's letters and codes.",
    "EN-41": "One course exists today, so the finder is short; the space fills as courses are ingested.",
    "EN-42": "One course exists today, so the finder is short; the space fills as courses are ingested.",
    "EN-43": "The page's name ('Syllabus Browser') is the pilot's string, shared with the Urdu page. Renaming the surface is the founder's decision; listed in PUBLISH.md.",
    "EN-48": DESIGN + "the previous/next row spans the lesson column (760 px); prose is set narrower, at the site's reading measure.",
    "EN-49": DESIGN + "the previous/next row spans the lesson column (760 px); prose is set narrower, at the site's reading measure.",
    "EN-53": DESIGN + "the lesson's plain-words brief comes first; the official codes follow for teachers and parents, as the brief requires.",
    "EN-54": "Low: the reviewer found the record-page link's wording unclear; it is a footnote-sized link for readers who want the graph record.",
    "EN-55": "Disproved by measurement: o10_nojs.mjs chooses every option with scripts off and sees exactly one feedback line each time (22 of 22 lessons); the reveals are native <details>. A still image cannot show it.",
    "EN-63": "Low: the handout ends where the lesson ends.",
}
REGISTER.update({
    "EN-18": "Partly fixed in round 3 by data: `person/al-jazari` now links the real record `person/al-jazari-engineer` (alias search). `work/kitab-al-hiyal` has no record; it stays shown and unlinked. " + PILOT,
    "EN-50": "Capture artefact: the 'You are here' rail is sticky, and a full-page capture draws it once, beside the top of the lesson. On a screen it stays in view.",
    "EN-56": DESIGN + "marking the step being read needs a script; with scripts off the rail is a plain list of links.",
    "AR-23": "Not the surface's: with scripts off the site's own header menu makes the Arabic page start scrolled sideways on a phone (the same 196 px on production today). The surface's content is intact (o10_nojs.mjs). Listed for the founder in PUBLISH.md.",
    "NEN-1": "Disproved by measurement: o10_nojs.mjs answers the check with scripts off on every lesson. A still image cannot show a response.",
    "NEN-2": DESIGN + "on a phone the steps rail wraps to further lines instead of running off the screen (round-1 defect EN-7).",
    "NAR-3": DESIGN + "on a phone the steps rail wraps to further lines instead of running off the screen (round-1 defect EN-7).",
    "NAR-4": DESIGN + "below 1080 px the 'You are here' list follows the lesson, where it serves as the way on; the banner strip and breadcrumb carry the position above.",
    "NAR-5": "The same as AR-16, registered there.",
    "NEN-4": PILOT + " `object/astrolabe`, `building/maragha-observatory` and `work/kitab-al-hiyal` have no record; the one-line note can wrap on a phone.",
})
CAPTURE = {"AR-12", "AR-13", "EN-24", "EN-25", "EN-26", "EN-27", "EN-50"}  # sticky bars drawn mid-page by the capture; the capture now shoots from the top


def tables(pattern, cols):
    rows = {}
    for f in sorted(glob.glob(os.path.join(V, pattern))):
        rnd = os.path.basename(os.path.dirname(f))
        for line in open(f, encoding="utf-8"):
            m = re.match(r"^\|\s*((?:AR|EN|N)[A-Z0-9]*-\d+)\s*\|(.*)\|\s*$", line)
            if m:
                parts = [x.strip() for x in m.group(2).split("|")]
                rows[m.group(1)] = dict(zip(cols, parts), round=rnd, source=os.path.relpath(f, ROOT))
    return rows


def main():
    found = tables("round-*/review-*.md", ["file", "where", "severity", "defect"])
    confirm = tables("round-*/confirm-*.md", ["verdict", "seen"])
    out = []
    for i, d in found.items():
        decision = "register" if i in REGISTER else "fix"
        e = {"id": i, "found_in": d["round"], "severity": d["severity"], "file": d["file"], "where": d["where"], "defect": d["defect"], "decision": decision}
        if i in REGISTER:
            e["reason"] = REGISTER[i]
        if i in CAPTURE:
            e["note"] = "The reviewer marked this 'possible capture artefact'. The capture was changed to shoot from the top of the page; a later reviewer still has to confirm the state reads correctly."
        c = confirm.get(i)
        if c:
            e["confirmed_in"], e["verdict"], e["seen"] = c["round"], c["verdict"].lower(), c["seen"]
        e["status"] = "registered" if decision == "register" else ("closed" if c and c["verdict"].lower().startswith("gone") else ("still present" if c else "awaiting a later reviewer"))
        out.append(e)
    json.dump({"defects": out}, open(os.path.join(V, "defects.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    import collections
    print(f"defects: {len(out)};", dict(collections.Counter(e["status"] for e in out)))


if __name__ == "__main__":
    main()
