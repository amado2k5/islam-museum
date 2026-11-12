#!/usr/bin/env python3
"""Graph density by school subject: how many museum records a course in that subject could honestly link.

A record counts when it is real (not a stub), has prose in Arabic or English (a connection is written from prose), and
falls in the subject by the museum's own fields: its `themes`, a person's `roles`, or its class. The rules are below,
one line per subject, so a different rule gives a different number and anyone can change it and re-run.

This measures the supply side only. It does not say a curriculum asks for these records; the mapping step decides that.

  npm run graph && python3 scripts/courses/density.py [--save]
"""
import json, os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
g = json.load(open(os.path.join(ROOT, ".cache", "graph.json"), encoding="utf-8"))
real = [n for n in g["nodes"] if not n["stub"] and n["class"] not in ("source", "media", "passage", "course", "dataset", "listing", "screen", "award", "question", "exhibit")]
prose = lambda n: bool((n.get("prose") or {}).get("ar") or (n.get("prose") or {}).get("en"))
roles = lambda n: set((n.get("data") or {}).get("roles") or [])
themes = lambda n: set(n.get("themes") or [])

SUBJECTS = {
    "History and social studies (societies, states, events, cities)": lambda n: n["class"] in ("event", "polity", "period") or (n["class"] == "person" and roles(n) & {"ruler", "caliph", "sultan", "emir", "vizier", "general", "governor", "historian", "statesman"}) or themes(n) & {"politics-governance-and-authority", "cities", "trade-and-finance", "history-writing-and-social-thought", "battles", "wars-and-campaigns"},
    "Geography (places, travel, maps)": lambda n: n["class"] == "place" or themes(n) & {"geography-and-cartography", "travel", "cities"} or (n["class"] == "journey") or (n["class"] == "person" and roles(n) & {"geographer"}),
    "World religions and ethics": lambda n: n["class"] in ("practice", "concept") or themes(n) & {"worship-and-the-pillars", "creed", "ethics-and-character", "sacred-space-and-pilgrimage", "sacred-time", "scripture-and-its-sciences"},
    "Art, architecture and design": lambda n: n["class"] in ("building", "object") or themes(n) & {"architecture", "arts-of-the-book", "music", "dress", "mosques"} or (n["class"] == "person" and roles(n) & {"calligrapher", "artist", "musician"}),
    "Language and literature": lambda n: themes(n) & {"literature", "linguistics", "translation-and-transmission", "libraries-paper-and-the-book"} or (n["class"] == "person" and roles(n) & {"poet", "writer", "translator"}) or n["class"] == "language",
    "Science: astronomy, earth and space": lambda n: themes(n) & {"astronomy-and-timekeeping", "cosmology-and-creation"} or (n["class"] == "person" and roles(n) & {"astronomer"}),
    "Science: life, health and environment": lambda n: themes(n) & {"medicine", "health-body-death", "animals-and-mercy", "water-and-animals", "environment-and-climate"} or (n["class"] == "person" and roles(n) & {"physician"}),
    "Science: matter, energy, engineering": lambda n: themes(n) & {"engineering-and-technology"} or n["class"] == "invention" or (n["class"] == "person" and roles(n) & {"engineer", "scientist"}),
    "Mathematics": lambda n: themes(n) & {"mathematics"} or (n["class"] == "person" and roles(n) & {"mathematician"}),
    "Philosophy and logic": lambda n: themes(n) & {"philosophy-and-logic"} or (n["class"] == "person" and roles(n) & {"philosopher"}),
}
lines = [f"DENSITY: museum records a course could link, by school subject (graph built from commit {str(g.get('commit'))[:10]}; real records considered: {len(real)})", "", f"{'subject':66s} {'records':>8s} {'with prose':>11s}"]
rows = []
for name, rule in SUBJECTS.items():
    hits = [n for n in real if rule(n)]
    rows.append((name, len(hits), sum(1 for n in hits if prose(n))))
for name, a, b in sorted(rows, key=lambda r: -r[2]):
    lines.append(f"{name:66s} {a:8d} {b:11d}")
lines += ["", "A record can fall in more than one subject. 'With prose' is the number a connection can be written from."]
print("\n".join(lines))
if "--save" in sys.argv:
    open(os.path.join(ROOT, "docs", "courses-mission", "oracle-output", "density.out"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
