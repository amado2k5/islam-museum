# Verifier report: the run's numbers, re-derived

Written by a fresh-context verifier that did not produce the numbers. Checked on 2026-11-11 between 10:50 and 11:05 EST.

- Repository HEAD: `efe522d7d1d8b530f2892896aa9c483640c87e26`. Graph artifact `.cache/graph.json`: `commit` field is the same commit, so it is not stale. It was not rebuilt.
- Files checked: `docs/fable-run/NUMBERS.md` (as written at 10:48, sha256 `1855347505207d16...`) and the board block of `docs/fable-run/VERIFICATION.md` (12 rows; the block was unchanged when the rest of that file was edited at 10:58).
- Read-only apart from this file. No oracle, data file or captured output was edited. `board.py`, `o08_unchanged.py`, `o06_search.mjs`, the validator, `npm run graph` and builds were not run. Python was run with `-B` so no bytecode was left behind.

## Result in short

| What | Checked | MATCH | DIFFERS |
|---|---|---|---|
| `NUMBERS.md`, "after" column | 22 values | 22 | 0 |
| `NUMBERS.md`, "before" column, against the captured file each cell names | 18 values | 18 | 0 |
| `NUMBERS.md`, "before" column, against what its header says it is (the frozen baseline `e1d7212`) | 18 values | 16 | 2 |
| Board lines, against their captured outputs | 12 lines | 12 | 0 |
| Board lines re-run by me (10 of 12; two are not to be re-run) | 10 lines | 10 | 0 |
| Board header and tally | 3 claims | 2 | 1 (the working tree has moved since) |
| Pass 2, the eight groups recomputed with my own code | 8 groups | 8 | 0 |

The two real differences are both in the "before" column and have one cause: the three-hop reachability "before" was not measured at the baseline. Details in section 4.

## 1. `NUMBERS.md`, the "after" column

"Re-run" is the oracle the row is read from, run by me at HEAD against the same artifact. Every re-run was byte-identical to its captured output except one header line (see 3, "uncommitted paths"). "Recomputed" is my own code (section 7), which uses none of `scripts/fable/`.

| # | Measure | Published | Re-run | Recomputed | Verdict |
|---|---|---|---|---|---|
| 1 | Records in the graph | 54,135 | 54,135 | 54,135 (graph); 54,135 data files | MATCH |
| 2 | Relations as authored | 66,784 | 66,784 | 66,784 (edges with `inverse` false) | MATCH (definition note N4) |
| 3 | Review state draft | 35,436 | 35,436 | 35,436 (graph and data files) | MATCH |
| 4 | Review state published | 18,699 | 18,699 | 18,699 (graph and data files) | MATCH |
| 5 | Records with no relation in either direction | 22,033 | 22,033 | 22,033 | MATCH |
| 6 | Canon records | 824 | 824 | 824 (graph); 824 (`importance:` lines in data files) | MATCH |
| 7 | Cornerstones | 271 | 271 | 271 (graph and data files) | MATCH |
| 8 | Cornerstones that sit in no wing | 0 | 0 | 0 | MATCH |
| 9 | Hijri centuries 1 to 14 with no cornerstone | none empty | none empty | none empty; per-century counts equal the oracle's table | MATCH |
| 10 | Wings with no cornerstone | none | none | none; per-wing counts equal the oracle's table | MATCH |
| 11 | Dead-end cornerstones | 12 (7 isolated, 5 leaves) | 12 (7, 5) | 12 (7 with none, 5 with one); the same twelve records | MATCH |
| 12 | Published within three hops of a cornerstone | 7,114 of 18,699 (38.0%) | same | 7,114 of 18,699 (38.0%); the same count at every distance | MATCH |
| 13 | The same without source, media, dataset | 9,631; 7,114 (73.9%) | same | 9,631; 7,114 (73.9%) | MATCH |
| 14 | Tour stops | 40 | 40 | 40 `- id:` lines, 40 distinct | MATCH |
| 15 | Records that hang off the Tour's path | 5963 | 5963 | 5,963 | MATCH (definition note N3) |
| 16 | Tour leads of 150 to 250 words | 80 of 80 | 80 of 80 | 80 of 80; all 80 word counts equal the oracle's table | MATCH |
| 17 | Tour leads with an uncited sentence | 0 | 0 | 0 | MATCH |
| 18 | Contradictions found | 130 | 130 | 130 register entries, 130 distinct keys | MATCH (wording note N5) |
| 19 | ... fixed | 38 | 38 | 38 | MATCH |
| 20 | ... standing in the register | 84 | 84 | 84 | MATCH |
| 21 | ... read and found consistent | 8 | 8 | 8 | MATCH |
| 23 | Absences: found, stub, absent | 24, 1, 6 | 24, 1, 6 | 24, 1, 6 (`scripts/fable/absences.json`) | MATCH |

Row 22 (search) has no "after" value: the table says it was not measured.

## 2. `NUMBERS.md`, the "before" column

I did not check out the baseline and did not rebuild its graph. "Captured file" is the value in the output file the row names. The last value column is extra to the brief: the baseline artifact the run built (`graph-baseline.json`, in the run's scratch folder; its `commit` field is `e1d721298ab4b2494a4c8f04d3defcde1808b939`) was still on disk, so I ran my own code on it; and for prose I read the baseline files with `git show e1d7212:<path>`.

| # | Measure | Published | Captured file says | My code on the baseline | Verdict |
|---|---|---|---|---|---|
| 1 | Records in the graph | 54,135 | 54,135 (`00-baseline-before.out`) | 54,135 | MATCH |
| 2 | Relations as authored | 66,719 | 66,719 | 66,719 | MATCH |
| 3 | Review state draft | 35,436 | 35,436 | 35,436 | MATCH |
| 4 | Review state published | 18,699 | 18,699 | 18,699 | MATCH |
| 5 | No relation in either direction | 22,056 | 22,056 | 22,056 | MATCH |
| 6 | Canon records | 824 | 824 | 824 | MATCH |
| 7 | Cornerstones | 270 | 270 | 270 | MATCH |
| 8 | Cornerstones in no wing | 48 | 48 | 48 | MATCH |
| 9 | Hijri centuries with no cornerstone | empty: [12] | empty: [12] (`o01-canon-before.out`) | the 12th only | MATCH |
| 10 | Wings with no cornerstone | today, made | today, made | today, made | MATCH |
| 11 | Dead-end cornerstones | 29 (23 isolated, 6 leaves) | 29 (23, 6) (`o04-reachability-before.out`) | 29 (23, 6) | MATCH the file and the baseline, but see D3: the file is not a baseline measurement |
| 12 | Published within three hops | 7,087 of 18,699 (37.9%) | 7,087 of 18,699 (37.9%) | **7,081** of 18,699 (37.9%) | MATCH the file; **DIFFERS** from the baseline (D1) |
| 13 | The same without source, media, dataset | 9,631; 7,087 (73.6%) | 9,631; 7,087 (73.6%) | 9,631; **7,081 (73.5%)** | MATCH the file; **DIFFERS** from the baseline (D2) |
| 14 | Tour stops | 0 (no Tour) | typed in `numbers.py`, no file | `tour/grand-tour.yaml` does not exist at `e1d7212` | MATCH |
| 16 | Tour leads of 150 to 250 words | 1 of 84 | 83 of 84 outside the range (`o03-tour_prose-before.out`) | 1 of 84 for the file's 42 stops; all 84 word counts equal the file's table | MATCH; not like for like with "80 of 80" (D4) |
| 17 | Tour leads with an uncited sentence | 54 | 54 | 54 for the file's 42 stops | MATCH; not like for like (D4) |
| 22 | Search, canon record first (production) | 2 of 50 | 2 of 50 (2 PASS lines, 48 FAIL lines, 50 queries in `search-queries.json`) | not re-run (network) | MATCH the file |
| 23 | Subjects the register called missing | 31 | 31 (`o07-absences.out`) | `docs/canon.md` at `e1d7212` lists 29 entries, two of them pairs: 31 split | MATCH |

## 3. The board (`VERIFICATION.md`, between the BOARD markers)

"Captured" is the last line of the captured output the row names. "Re-run" is the last line of my own run of the row's command at HEAD.

| Statement | Board state and last line | Captured | Re-run | Verdict |
|---|---|---|---|---|
| 1 canon | GREEN (12 checks passed) | same | same | MATCH |
| 2 Tour coverage | GREEN (9 checks passed) | same | same | MATCH |
| 3 Tour prose | GREEN (6 checks passed) | same | same (cite-check 40 pass, 0 fail) | MATCH |
| 4 reachability | NOT-GREEN (2 failed: dead ends; three hops) | same | same | MATCH |
| 5 contradictions | GREEN (5 checks passed) | same | same | MATCH |
| 6 search | NOT-GREEN (48 of 50), production, not re-run, last run at `91dc7a62d3` | same | not run (as instructed) | MATCH the file |
| 7 absences | GREEN (5 checks passed) | same | same | MATCH |
| 8 vision | NOT-GREEN (2 failed: no reviewer lists; no defect register) | same | same at the time I ran it (other agents were still writing under `vision/`) | MATCH |
| 8 (rest of the site) | GREEN (17 checks passed), not re-run, last run at `37f69b054c` | same | not run (as instructed) | MATCH the file (note N1) |
| 9 no JavaScript | GREEN | same | same (served from the existing `.cache/fable-dist`; nothing built) | MATCH |
| 11 remote | GREEN (18 checks passed) | same | same (6 phases, 3 checks each, asked of the host with `gh api`) | MATCH |
| 12 baseline | GREEN (2 checks passed) | same | same | MATCH |
| Tally | "9 of 12 oracle runs end GREEN" | 9 GREEN, 3 NOT-GREEN | | MATCH |
| Header | measured at `efe522d7d1`, graph rebuilt from that commit | every re-run output names that commit for HEAD and for the graph, except rows 6 and 8 (rest), which the board itself marks | | MATCH |
| Header | "uncommitted paths under the measured folders: 0" | 0 in every captured output | **1** in every re-run | DIFFERS now (D5) |

## 4. The differences, and what I believe

**D1. Published records within three hops of a cornerstone, "before": published 7,087, at the frozen baseline 7,081.**
The header of `NUMBERS.md` says "Before" is the frozen baseline (main at `e1d7212`). This cell was read from `o04-reachability-before.out`, and that file's own header says it was not run at the baseline: HEAD `f07d617b73`, graph built from `1401a5cc97`, three uncommitted paths, a stale-artifact warning, and "cornerstones: 271". The baseline has 270 cornerstones. Between the baseline and `1401a5cc97` the run's own century-floor change (`18fa4222d3`) raised `person/ahmed-iii-uthmani` from importance 2 to 1; the data diff between the two commits is 51 one-line changes (50 `wings`, 1 `importance`) and the edge count is the same (133,438), so the relations are the baseline's and only the cornerstone set differs.
My code on the baseline artifact gives 7,081 with the baseline's 270 cornerstones, and exactly 7,087 when that one record is added as a cornerstone. So the published value is right for the file it names and wrong for the column it sits in, by 6 records. This is a definition difference, not a bug in the oracle or in my code: the run took "before" to be the state at `1401a5cc97`; the table header says the baseline. Read at the baseline, the run's gain is 7,081 to 7,114 (+33), of which 6 came from making one more record a cornerstone and 27 from relations. The published table shows +27. The percentage (37.9%) is the same either way.

**D2. The same measure without source, media and dataset records, "before": published 7,087 (73.6%), at the frozen baseline 7,081 (73.5%).** Same cause as D1. The denominator 9,631 is right.

**D3. Five "before" cells are not baseline measurements, though the header says the column is.** Rows 11, 12, 13 are read from a run at graph `1401a5cc97`; rows 16 and 17 from a run of the working tree at `f07d617b73`. The "Read from (before)" column prints those commits, so the table contradicts its own header rather than hiding anything. Row 11 survives: the dead-end count is 29 (23, 6) at the baseline too, because the promoted record is not a dead end. Rows 12 and 13 do not survive (D1, D2). Rows 16 and 17 are D4.

**D4. Tour leads, "before": the population is not the one in the "after" column.** At the baseline there was no Tour, so there is no baseline stop list. The before file was run over a 42-stop manifest that existed only mid-run; today's manifest has 40 stops (`work/quran` and `period/contemporary-era` left). I reproduced the before file from baseline prose: all 84 word counts and all 84 uncited-sentence counts equal its table, so the prose it measured was the baseline's. The published "1 of 84" and "54" are correct for 42 stops. For the 40 stops that are in the Tour now, the baseline values are **1 of 80** and **50**. I count this as a match with a caveat, not an error: "1 of 84 before, 80 of 80 after" compares two different lists.

**D5. "Uncommitted paths under the measured folders: 0" was true when the board ran and is 1 now.** `scripts/fable/numbers.py` was edited at 10:47, after the board ran at 10:46, and is uncommitted. It is the only line by which my re-runs differ from the captured outputs. It has a consequence for the next checker: `NUMBERS.md` is produced by that uncommitted file. I ran it with its one write diverted to scratch and it reproduces `NUMBERS.md` byte for byte. The committed `numbers.py` at HEAD produces a different table: no "Wings with no cornerstone" row, and two cells typed by hand ("1 (the 12th)" and "1 of 84") with a prose source note in place of a file. The values agree; the provenance does not. Also uncommitted when I checked: `NUMBERS.md`, `VERIFICATION.md` and nine captured outputs that the table or the board read (`o01-canon-before`, `o03-tour_prose`, `o04-reachability`, `o05`, `o07`, `o08`, `o08b`, `o09`, `o11`), with three more modified (`o00`, `o01`, `o02`). Someone re-deriving from the pushed branch at `efe522d7d1` cannot regenerate the table or the board until these are committed.

## 5. Notes that are not differences

**N1. Row "8 (rest of the site)" is one site change behind.** Its GREEN was measured at `37f69b054c`. Since then `site/src/pages/[lang]/grand-tour/complete.astro` changed (2 lines, in `933eedc1c6`). The set of site and string files that differ from the baseline is still the ten the captured output lists, and the changed file is a Tour page, so I expect the result to hold; it has not been measured at the commit the board header names. The board says so in the row.

**N2. `o01-canon-before.out` and `00-baseline-before.out` say HEAD `e1d721298a` with 2 and 3 uncommitted paths.** They were run in a checkout of the baseline with this branch's oracle files copied in. I checked four of the first file's results (48 wingless; wings today and made empty; century 12 empty; the cornerstone count of every century, and 100 undated) and all eight of the second file's published counts with my own code on the baseline artifact: all agree.

**N3. The completion-room count (5,963) counts `related_to` edges.** The dead-end and hop measures say `related_to` is never counted. The definition in `VERIFICATION.md` for this count says "at least one relation", any type, so 5,963 is right by its own definition and by the brief's. A second system that carries the "meaningful relation" rule over would get **5,871**; one that counts stubs would get 5,972. Either direction or outgoing only makes no difference (every edge has its inverse in the artifact).

**N4. "Relations as authored" (66,784) is the artifact's edges with `inverse` false, not relation statements in the data files.** The artifact stores one canonical direction per relation. A regex count of the `relations:` blocks in `data/` gives 68,251 items (67,928 distinct): 5,455 of them are written in the direction the artifact flags as the inverse, 280 authored edges join a pair of records that no `relations:` block names (predicates such as `awarded`, `described`, `improved`, which come from other fields), and 14 authored edges in the artifact are exact duplicates of another (66,770 distinct). I did not reconcile this further. The published number is correct for the definition the oracle prints; the label "as authored" invites the other reading.

**N5. "Cross-record contradictions found: 130" counts detector findings.** Eight of them were read and found consistent, so 122 are contradictions (38 fixed, 84 standing). The three rows under it say this.

**N6. Three cells are typed in `numbers.py`, not lifted from an output:** "0 (no Tour)", "not swept" and "this branch could not be built here; not measured". Its docstring says nothing is typed by hand. The first is true (checked above).

**N7. The "@ commit" in the "Read from" columns means three different things:** the graph's commit (o00, o02, o04, o05, o07), the oracle run's HEAD (o01, o03), and for the search row the HEAD of the checkout that ran the test (`91dc7a62d3`), not the commit of the site it measured (`8d1b0ef9`).

**N8. One stop is reported as floating that the stated anchor rule would date.** `o02` lists `work/ihya-ulum-al-din` among the seven stops with no date. `VERIFICATION.md` says a work with no date takes its author's death. The record names its author in `authors: [person/al-ghazali-abu-hamid]`, but the oracle looks only for an `authored` edge and the graph has none between the two (502 of the 680 works with an `authors` field have no such edge; three are cornerstones: this one, `work/jami-al-bayan`, `work/sahih-al-bukhari`). With the author's death (505 AH) the stop falls in century 6, between stops 25 and 27, so order and century coverage are unchanged and no published number moves. Six stops float by the rule; the oracle prints seven.

**N9. The eight groups under other readings.** Where a definition could be read two ways I ran both. Dead ends with `related_to` counted: 11 (6, 5). Word counts counting every whitespace token (punctuation left behind by a removed citation included) are 8 to 10 higher per lead in the five stops I printed; the oracle and my count both drop tokens with no letter or digit. Wings from the graph's `wings` list and from each stop's data file are the same for all 40 stops. Centuries of the stops by my own reading of the anchor rule: every century from 1 to 14 holds a dated stop, and no dated stop runs backwards.

**N10. Outside my scope, file match only.** The integration-point numbers added to `VERIFICATION.md` at 10:58 (54,358 records; 6183 off the path; 7,123 of 18,699) equal the outputs under `oracle-output/integration/`. I did not recompute them: I do not have that graph.

## 6. What I did not check

- The search numbers against production (network), and the unchanged-site comparison (two builds). File match only, as instructed.
- The detectors' findings themselves: I counted the register by status and re-ran the oracle; I did not re-detect with my own code.
- Whether the oracles' definitions are the right ones. I checked that the numbers follow from the definitions as written, and said where a second reading gives another number.

## 7. My code

Standard library only. None of it imports from `scripts/fable/`. Run from the repository root.

### 7.1 `verify_numbers.py`: the eight groups of pass 2

```python
#!/usr/bin/env python3
"""Independent recomputation of the run's numbers (verifier pass 2). Standard library only.
Uses none of scripts/fable/*. Run from the repository root:  python3 -B verify_numbers.py
"""
import json, re, sys, os
from collections import Counter, defaultdict, deque

G = json.load(open(".cache/graph.json", encoding="utf-8"))
nodes, edges = G["nodes"], G["edges"]
print("graph commit:", G.get("commit"), "| nodes:", len(nodes), "| edges:", len(edges))

# ---------- 1. records, draft, published ----------
real = {n["id"]: n for n in nodes if n["stub"] is False}
assert len(real) == sum(1 for n in nodes if not n["stub"])
def rev(n):
    st = n["data"].get("status")
    return st.get("review") if isinstance(st, dict) else None
rc = Counter(rev(n) for n in real.values())
print("1. records (stub false):", len(real), "| stubs:", len(nodes) - len(real))
print("1. review states among records:", dict(rc))

# ---------- 2. canon, cornerstones ----------
def imp(n):
    return n["data"].get("importance")
canon = [i for i, n in real.items() if imp(n) in (1, 2)]
corner = sorted(i for i, n in real.items() if imp(n) == 1)
stub_canon = [n["id"] for n in nodes if n["stub"] and imp(n) in (1, 2)]
odd_imp = Counter(repr(imp(n)) for n in nodes if imp(n) not in (None, 1, 2))
print("2. canon (importance 1 or 2, non-stub):", len(canon), "| cornerstones (importance 1):", len(corner),
      "| stubs carrying importance:", len(stub_canon), "| other importance values:", dict(odd_imp))
# the same two counts straight from the data files (no graph)
file_imp = Counter()
for cls in sorted(os.listdir("data")):
    d = os.path.join("data", cls)
    if not os.path.isdir(d):
        continue
    for f in os.listdir(d):
        if f.endswith(".yaml"):
            m = re.search(r"^importance:[ \t]*([0-9]+)", open(os.path.join(d, f), encoding="utf-8", errors="replace").read(), re.M)
            if m:
                file_imp[int(m.group(1))] += 1
print("2. from data/*/*.yaml top-level `importance:` lines:", dict(file_imp), "-> canon", file_imp[1] + file_imp[2], "cornerstones", file_imp[1])

# no-wing cornerstones (graph `wings` list) and wings holding a cornerstone
WINGS = ["time", "place", "people", "ideas", "objects", "words", "living", "today", "made"]
print("2b. cornerstones with empty wings list (graph):", sum(1 for i in corner if not real[i].get("wings")))
cw = Counter(w for i in corner for w in (real[i].get("wings") or []))
print("2b. cornerstones per wing (graph):", {w: cw[w] for w in WINGS}, "| wings with none:", [w for w in WINGS if not cw[w]])

# ---------- relations (extra, for the o00 rows) ----------
authored = sum(1 for e in edges if not e.get("inverse"))
touch = set()
for e in edges:
    touch.add(e["from"]); touch.add(e["to"])
print("x. relations as authored (inverse false):", authored, "| all edges:", len(edges))
print("x. records with no edge in either direction:", sum(1 for i in real if i not in touch))

# ---------- 3. tour stops ----------
man = open("tour/grand-tour.yaml", encoding="utf-8").read()
stops = [m.group(1).strip() for m in re.finditer(r"^[ \t]*-[ \t]*id:[ \t]*(\S+)[ \t]*$", man, re.M)]
print("3. `- id:` lines in tour/grand-tour.yaml:", len(stops), "| distinct:", len(set(stops)))
print("3. stops not a non-stub node:", [s for s in stops if s not in real])
print("3. stops not a cornerstone:", [s for s in stops if s in real and imp(real[s]) != 1])
wings_graph = set(w for s in stops for w in (real[s].get("wings") or []))
def file_wings(i):
    t = open(f"data/{i}.yaml", encoding="utf-8").read()
    m = re.search(r"^wings:[ \t]*\[([^\]\n]*)\]", t, re.M)
    if m:
        return [w.strip().strip("'\"") for w in m.group(1).split(",") if w.strip()]
    m = re.search(r"^wings:[ \t]*\n((?:[ \t]*-[ \t]*\S+[ \t]*\n)+)", t, re.M)
    return re.findall(r"-[ \t]*['\"]?(\w+)", m.group(1)) if m else []
wings_file = set(w for s in stops for w in file_wings(s))
print("3. wings covered (graph `wings`):", [w for w in WINGS if w in wings_graph], len(wings_graph & set(WINGS)), "of 9; missing:", [w for w in WINGS if w not in wings_graph])
print("3. wings covered (data file `wings:`):", len(wings_file & set(WINGS)), "of 9; values outside the nine:", sorted((wings_graph | wings_file) - set(WINGS)))
print("3. stops whose graph wings differ from their data file:", [s for s in stops if sorted(real[s].get("wings") or []) != sorted(file_wings(s))])
print("3. stops per wing:", {w: sum(1 for s in stops if w in (real[s].get("wings") or [])) for w in WINGS})

# ---------- 4. completion room ----------
stopset = set(stops)
hang_any = set()          # either direction, any type, non-stub, not a stop
hang_out = set()          # only edges whose `from` is a stop (what a one-directional reading would give)
for e in edges:
    a, b = e["from"], e["to"]
    if a in stopset and b in real and b not in stopset:
        hang_any.add(b); hang_out.add(b)
    if b in stopset and a in real and a not in stopset:
        hang_any.add(a)
print("4. completion room (either direction, any type):", len(hang_any), "| from-stop direction only:", len(hang_out))
hang_stub = set()
for e in edges:
    a, b = e["from"], e["to"]
    if a in stopset and b not in stopset: hang_stub.add(b)
    if b in stopset and a not in stopset: hang_stub.add(a)
print("4. the same if stubs were counted:", len(hang_stub))
stop_pairs = {tuple(sorted((e["from"], e["to"]))) for e in edges if e["from"] in stopset and e["to"] in stopset and e["from"] != e["to"]}
print("4. pairs of stops with an edge between them:", len(stop_pairs))

# ---------- 5. dead-end cornerstones ----------
adj = defaultdict(set)
for e in edges:
    if e["type"] == "related_to":
        continue
    a, b = e["from"], e["to"]
    if a in real and b in real and a != b:
        adj[a].add(b); adj[b].add(a)
iso = [i for i in corner if len(adj[i]) == 0]
leaf = [i for i in corner if len(adj[i]) == 1]
print("5. dead-end cornerstones:", len(iso) + len(leaf), "(none:", len(iso), ", one:", len(leaf), ")")
print("   none:", iso)
print("   one :", [(i, next(iter(adj[i]))) for i in leaf])
# sensitivity: counting a self-loop as a neighbour, or counting related_to
adj_all = defaultdict(set)
for e in edges:
    a, b = e["from"], e["to"]
    if a in real and b in real and a != b:
        adj_all[a].add(b); adj_all[b].add(a)
print("5. (sensitivity) with related_to counted: none", sum(1 for i in corner if len(adj_all[i]) == 0), "one", sum(1 for i in corner if len(adj_all[i]) == 1))
print("5. (sensitivity) self-loop edges on real nodes, non related_to:", sum(1 for e in edges if e["from"] == e["to"] and e["type"] != "related_to"))

# ---------- 6. published within three hops ----------
def bfs(sources):
    dist = {s: 0 for s in sources}
    q = deque(sources)
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist
dist = bfs(corner)
published = [i for i, n in real.items() if rev(n) == "published"]
by_d = Counter(dist.get(i, -1) for i in published)
within = sum(c for d, c in by_d.items() if 0 <= d <= 3)
print("6. published:", len(published), "| at distance 0..3:", within, f"({100 * within / len(published):.1f}%)", "| by distance:", dict(sorted(by_d.items())))
subj = [i for i in published if i.split("/")[0] not in ("source", "media", "dataset")]
subj_within = sum(1 for i in subj if 0 <= dist.get(i, -1) <= 3)
print("6b. published, not source/media/dataset:", len(subj), "| within three hops:", subj_within, f"({100 * subj_within / len(subj):.1f}%)")
print("6b. published source/media/dataset records within three hops:", within - subj_within)
allw = sum(1 for i in real if 0 <= dist.get(i, -1) <= 3)
print("6c. all records within three hops:", allw, "of", len(real))
# sensitivity for the "before" column: the same search on TODAY's graph without the one cornerstone raised during the run
d270 = bfs([c for c in corner if c != "person/ahmed-iii-uthmani"])
print("6d. (sensitivity) today's graph, cornerstones minus person/ahmed-iii-uthmani: published within three hops:",
      sum(1 for i in published if 0 <= d270.get(i, -1) <= 3))

# ---------- 7. lead word counts for three stops ----------
def lead(path):
    lines = open(path, encoding="utf-8").read().split("\n")
    start = next(k for k, l in enumerate(lines) if l.startswith("## "))
    end = next((k for k in range(start + 1, len(lines)) if lines[k].startswith("## ")), len(lines))
    return "\n".join(lines[start + 1:end])
def reader_words(md):
    t = re.sub(r"\{cite:[^}]*\}", "", md)                    # citation markers are not words
    t = re.sub(r"\[\[[^\]|]*\|([^\]]*)\]\]", r"\1", t)        # [[id|label]] -> label
    t = re.sub(r"\[\[([^\]]*)\]\]", r"\1", t)                 # [[id]] -> id (none expected in a lead)
    toks = t.split()
    strict = [w for w in toks if any(ch.isalnum() for ch in w)]   # a token of punctuation alone is not a word
    return len(strict), len(toks)
for sid in ["person/ibn-khaldun", "event/battle-of-badr", "object/kiswa", "building/kaaba", "person/abu-bakr"]:
    out = []
    for lang in ("ar", "en"):
        s, a = reader_words(lead(f"content/{lang}/{sid}.md"))
        out.append(f"{lang} {s} (all whitespace tokens: {a})")
    print("7.", sid, "|", " | ".join(out))

# ---------- 8. contradictions register ----------
reg = json.load(open("docs/fable-run/contradictions/register.json", encoding="utf-8"))
ent = reg["entries"] if isinstance(reg, dict) else reg
print("8. register entries:", len(ent), "| by status:", dict(Counter(e.get("status") for e in ent)), "| distinct keys:", len({e.get("key") for e in ent}))
```

Output at `efe522d7d1`:

```text
graph commit: efe522d7d1d8b530f2892896aa9c483640c87e26 | nodes: 56030 | edges: 133568
1. records (stub false): 54135 | stubs: 1895
1. review states among records: {'published': 18699, 'draft': 35436}
2. canon (importance 1 or 2, non-stub): 824 | cornerstones (importance 1): 271 | stubs carrying importance: 0 | other importance values: {}
2. from data/*/*.yaml top-level `importance:` lines: {1: 271, 2: 553} -> canon 824 cornerstones 271
2b. cornerstones with empty wings list (graph): 0
2b. cornerstones per wing (graph): {'time': 55, 'place': 30, 'people': 106, 'ideas': 32, 'objects': 29, 'words': 14, 'living': 10, 'today': 2, 'made': 1} | wings with none: []
x. relations as authored (inverse false): 66784 | all edges: 133568
x. records with no edge in either direction: 22033
3. `- id:` lines in tour/grand-tour.yaml: 40 | distinct: 40
3. stops not a non-stub node: []
3. stops not a cornerstone: []
3. wings covered (graph `wings`): ['time', 'place', 'people', 'ideas', 'objects', 'words', 'living', 'today', 'made'] 9 of 9; missing: []
3. wings covered (data file `wings:`): 9 of 9; values outside the nine: []
3. stops whose graph wings differ from their data file: []
3. stops per wing: {'time': 7, 'place': 2, 'people': 22, 'ideas': 2, 'objects': 5, 'words': 1, 'living': 2, 'today': 1, 'made': 1}
4. completion room (either direction, any type): 5963 | from-stop direction only: 5963
4. the same if stubs were counted: 5972
4. pairs of stops with an edge between them: 27
5. dead-end cornerstones: 12 (none: 7 , one: 5 )
   none: ['concept/al-hadith-al-nabawi', 'object/ardabil-carpet', 'period/abbasid-fragmentation', 'period/buyid-seljuk-fatimid-era', 'period/contemporary-era', 'period/gunpowder-empires', 'period/modern-era']
   one : [('concept/sharia', 'concept/ibada'), ('polity/delhi-sultanate', 'place/delhi'), ('polity/seljuk-empire', 'place/nishapur'), ('polity/timurid-empire', 'polity/safavid-iran'), ('practice/eid-al-fitr', 'work/muktatafat-mena-al-seera')]
5. (sensitivity) with related_to counted: none 6 one 5
5. (sensitivity) self-loop edges on real nodes, non related_to: 0
6. published: 18699 | at distance 0..3: 7114 (38.0%) | by distance: {-1: 10891, 0: 106, 1: 3763, 2: 1427, 3: 1818, 4: 335, 5: 252, 6: 65, 7: 24, 8: 10, 9: 4, 10: 2, 11: 1, 12: 1}
6b. published, not source/media/dataset: 9631 | within three hops: 7114 (73.9%)
6b. published source/media/dataset records within three hops: 0
6c. all records within three hops: 28609 of 54135
6d. (sensitivity) today's graph, cornerstones minus person/ahmed-iii-uthmani: published within three hops: 7108
7. person/ibn-khaldun | ar 158 (all whitespace tokens: 167) | en 237 (all whitespace tokens: 246)
7. event/battle-of-badr | ar 177 (all whitespace tokens: 187) | en 247 (all whitespace tokens: 257)
7. object/kiswa | ar 158 (all whitespace tokens: 166) | en 233 (all whitespace tokens: 241)
7. building/kaaba | ar 171 (all whitespace tokens: 180) | en 234 (all whitespace tokens: 243)
7. person/abu-bakr | ar 204 (all whitespace tokens: 213) | en 249 (all whitespace tokens: 258)
8. register entries: 130 | by status: {'registered': 84, 'fixed': 38, 'not-a-contradiction': 8} | distinct keys: 130
```

### 7.2 `verify_before.py`: the "before" column on the baseline artifact (extra)

Argument: a graph artifact built at the baseline commit. I used the one the run left in its scratch folder.

```python
#!/usr/bin/env python3
"""The 'before' column recomputed on a graph artifact built at the baseline commit (extra to the brief).
  python3 -B verify_before.py <path to graph-baseline.json>
Standard library only; uses none of scripts/fable/*.
"""
import json, sys
from collections import Counter, defaultdict, deque

G = json.load(open(sys.argv[1], encoding="utf-8"))
nodes, edges = G["nodes"], G["edges"]
print("graph commit:", G.get("commit"), "| generated:", G.get("generated"), "| nodes:", len(nodes), "| edges:", len(edges))
real = {n["id"]: n for n in nodes if n["stub"] is False}
rev = lambda n: (n["data"].get("status") or {}).get("review")
imp = lambda n: n["data"].get("importance")
print("records:", len(real), "| review:", dict(Counter(rev(n) for n in real.values())))
canon = [i for i, n in real.items() if imp(n) in (1, 2)]
corner = sorted(i for i, n in real.items() if imp(n) == 1)
print("canon:", len(canon), "| cornerstones:", len(corner), "| cornerstones with no wing:", sum(1 for i in corner if not real[i].get("wings")))
WINGS = ["time", "place", "people", "ideas", "objects", "words", "living", "today", "made"]
cw = Counter(w for i in corner for w in (real[i].get("wings") or []))
print("wings with no cornerstone:", [w for w in WINGS if not cw[w]])
print("relations as authored:", sum(1 for e in edges if not e.get("inverse")))
touch = set()
for e in edges:
    touch.add(e["from"]); touch.add(e["to"])
print("records with no relation in either direction:", sum(1 for i in real if i not in touch))

adj = defaultdict(set)
for e in edges:
    a, b = e["from"], e["to"]
    if e["type"] != "related_to" and a in real and b in real and a != b:
        adj[a].add(b); adj[b].add(a)
iso = [i for i in corner if not adj[i]]
leaf = [i for i in corner if len(adj[i]) == 1]
print("dead-end cornerstones:", len(iso) + len(leaf), "(none:", len(iso), ", one:", len(leaf), ")")

def within3(sources, pop):
    dist = {s: 0 for s in sources}
    q = deque(sources)
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                q.append(v)
    return sum(1 for i in pop if 0 <= dist.get(i, -1) <= 3)
published = [i for i, n in real.items() if rev(n) == "published"]
subj = [i for i in published if i.split("/")[0] not in ("source", "media", "dataset")]
w = within3(corner, published)
print(f"published within three hops of a cornerstone ({len(corner)} cornerstones): {w} of {len(published)} ({100 * w / len(published):.1f}%)")
ws = within3(corner, subj)
print(f"the same without source/media/dataset: {len(subj)}; within three hops: {ws} ({100 * ws / len(subj):.1f}%)")
# what the run's "before" file measured: the same edges, plus the cornerstone the run itself raised (person/ahmed-iii-uthmani)
plus = sorted(set(corner) | {"person/ahmed-iii-uthmani"})
w2 = within3(plus, published)
print(f"with person/ahmed-iii-uthmani added as a cornerstone ({len(plus)}): {w2} of {len(published)} ({100 * w2 / len(published):.1f}%); subject: {within3(plus, subj)}")
print("is person/ahmed-iii-uthmani a dead end here:", len(adj["person/ahmed-iii-uthmani"]) < 2, "| its importance here:", imp(real["person/ahmed-iii-uthmani"]))
```

Output:

```text
graph commit: e1d721298ab4b2494a4c8f04d3defcde1808b939 | generated: 2026-11-11T07:17:01-05:00 | nodes: 56030 | edges: 133438
records: 54135 | review: {'published': 18699, 'draft': 35436}
canon: 824 | cornerstones: 270 | cornerstones with no wing: 48
wings with no cornerstone: ['today', 'made']
relations as authored: 66719
records with no relation in either direction: 22056
dead-end cornerstones: 29 (none: 23 , one: 6 )
published within three hops of a cornerstone (270 cornerstones): 7081 of 18699 (37.9%)
the same without source/media/dataset: 9631; within three hops: 7081 (73.5%)
with person/ahmed-iii-uthmani added as a cornerstone (271): 7087 of 18699 (37.9%); subject: 7087
is person/ahmed-iii-uthmani a dead end here: False | its importance here: 2
```

### 7.3 `verify_extras.py`: every lead now and at the baseline, centuries, small counts (extra)

```python
#!/usr/bin/env python3
"""Extra recomputations beyond the brief's eight groups (verifier). Standard library only; none of scripts/fable/*.
  python3 -B verify_extras.py [<graph-baseline.json>]
Read-only: the only git commands are `git show <commit>:<path>` and `git rev-parse`.
"""
import json, math, re, subprocess, sys
from collections import Counter, defaultdict

BASE = "e1d721298ab4b2494a4c8f04d3defcde1808b939"
OUT = "docs/fable-run/oracle-output/"

def show(commit, path):
    r = subprocess.run(["git", "show", f"{commit}:{path}"], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None

# ---------- A. every lead of every stop, now (working tree) and at the baseline (git show) ----------
def lead_of(text):
    lines = text.split("\n")
    start = next((k for k, l in enumerate(lines) if l.startswith("## ")), None)
    if start is None:
        return None
    end = next((k for k in range(start + 1, len(lines)) if lines[k].startswith("## ")), len(lines))
    return "\n".join(lines[start + 1:end])

def as_read(md):
    t = re.sub(r"\{cite:[^}]*\}", "", md)
    t = re.sub(r"\[\[[^\]|]*\|([^\]]*)\]\]", r"\1", t)
    return re.sub(r"\[\[([^\]]*)\]\]", r"\1", t)

def nwords(md):
    return sum(1 for w in as_read(md).split() if any(c.isalnum() for c in w))

def uncited(md):
    """Sentences of four words or more with no citation in them; a marker straight after the closing mark belongs to that sentence."""
    t = re.sub(r"\{cite:[^}]*\}", " \x00 ", md)
    t = " ".join(t.split())
    t = re.sub(r"([.!?؟۔])\s*\x00", " \x00\\1", t)
    n = 0
    for s in re.split(r"(?<=[.!?؟۔])\s+", t):
        if "\x00" not in s and nwords(s) >= 4:
            n += 1
    return n

def table_rows(name):
    rows = []
    for l in open(OUT + name, encoding="utf-8"):
        m = re.match(r"\s*(\d+) \| (\S+/\S+)\s*\|\s*(\d+|none)\s*\|\s*(\d+|none)\s*\|\s*(\S+)/(\S+)\s*\|", l)
        if m:
            rows.append((m.group(2), m.group(3), m.group(4), m.group(5), m.group(6)))
    return rows

def summarise(rows_named, getter, label):
    inr = tot = unc_leads = mism = 0
    for rid, far, fen, uar, uen in rows_named:
        for lang, fcount, func in (("ar", far, uar), ("en", fen, uen)):
            txt = getter(rid, lang)
            ld = lead_of(txt) if txt else None
            if ld is None:
                print(f"   {label}: {rid} [{lang}] has no lead"); continue
            n, u = nwords(ld), uncited(ld)
            tot += 1; inr += 150 <= n <= 250; unc_leads += u > 0
            if str(n) != fcount or str(u) != func:
                mism += 1; print(f"   {label}: {rid} [{lang}] mine words={n} uncited={u}; file says words={fcount} uncited={func}")
    print(f"A. {label}: leads {tot}; 150-250 words: {inr} of {tot}; leads with an uncited sentence: {unc_leads}; cells that differ from the file: {mism}")

now_rows = table_rows("o03-tour_prose.out")
bef_rows = table_rows("o03-tour_prose-before.out")
print("A. rows in o03-tour_prose.out:", len(now_rows), "| rows in o03-tour_prose-before.out:", len(bef_rows))
man = [m.group(1) for m in re.finditer(r"^[ \t]*-[ \t]*id:[ \t]*(\S+)[ \t]*$", open("tour/grand-tour.yaml", encoding="utf-8").read(), re.M)]
print("A. after-table rows equal the manifest, in order:", [r[0] for r in now_rows] == man)
print("A. stops in the before file that are not stops now:", [r[0] for r in bef_rows if r[0] not in man], "| stops now not in the before file:", [s for s in man if s not in [r[0] for r in bef_rows]])
summarise(now_rows, lambda rid, lang: open(f"content/{lang}/{rid}.md", encoding="utf-8").read(), "working tree vs o03-tour_prose.out")
summarise(bef_rows, lambda rid, lang: show(BASE, f"content/{lang}/{rid}.md"), "baseline prose (git show e1d7212), the before file's 42 stops, vs o03-tour_prose-before.out")
bef_by = {r[0]: r for r in bef_rows}
summarise([bef_by[s] for s in man if s in bef_by], lambda rid, lang: show(BASE, f"content/{lang}/{rid}.md"), "baseline prose, today's 40 stops only (like for like)")

# ---------- B. centuries: the Tour's stops and the cornerstones, from the definition in VERIFICATION.md ----------
OWN = {"person": ["died", "floruit", "born"], "event": ["date.start"], "building": ["built"], "object": ["made"], "work": ["composed"],
       "period": ["start"], "polity": ["start"], "place": ["founded"], "group": ["founded"]}
def year(d):
    m = re.match(r"\s*(-?\d{1,4})", str(d.get("edtf", ""))) if isinstance(d, dict) else None
    return int(m.group(1)) if m else None
def hijri(d):
    m = re.match(r"\s*(-?\d{1,4})", str(d.get("hijri", "")))
    return (int(m.group(1)), "stated") if m else (math.floor((year(d) - 622) * 33 / 32) + 1, "arithmetic")
def own_date(n):
    for key in OWN.get(n["class"], []):
        d = n["data"]
        for part in key.split("."):
            d = d.get(part) if isinstance(d, dict) else None
        if year(d) is not None:
            return d
    return None
cent = lambda hy: 0 if hy < 1 else (hy - 1) // 100 + 1

def centuries(path, label, stops=None):
    G = json.load(open(path, encoding="utf-8"))
    by = {n["id"]: n for n in G["nodes"] if not n["stub"]}
    authors = defaultdict(list)
    for e in G["edges"]:
        if e["type"] == "authored" and not e.get("inverse"):
            authors[e["to"]].append(e["from"])
    corner = [i for i, n in by.items() if n["data"].get("importance") == 1]
    c = Counter(); undated = 0
    for i in corner:
        d = own_date(by[i])
        if d is None: undated += 1
        else: c[min(cent(hijri(d)[0]), 15)] += 1
    print(f"B. {label} (graph commit {G.get('commit')[:10]}): cornerstones by Hijri century of own date:", {k: c[k] for k in range(16)}, "| undated:", undated, "| empty among 1..14:", [k for k in range(1, 15) if not c[k]])
    if stops:
        sc = defaultdict(list); fl = []
        for k, s in enumerate(stops, 1):
            n = by[s]; d = own_date(n)
            if d is None and n["class"] == "work":
                ds = [by[a]["data"].get("died") for a in authors.get(s, []) if a in by and year(by[a]["data"].get("died")) is not None]
                d = max(ds, key=year) if ds else None
            if d is None: fl.append(f"{k} {s}")
            else: sc[min(cent(hijri(d)[0]), 15)].append(k)
        print("B. stops by century:", {k: sc[k] for k in range(16)})
        print("B. centuries 1..14 with no dated stop:", [k for k in range(1, 15) if not sc[k]], "| stops with no date of their own or their author's:", fl)
        # river order: dated stops never run backwards (CE year of the own date)
        ys = [(k, year(own_date(by[s]))) for k, s in enumerate(stops, 1) if own_date(by[s]) is not None]
        print("B. dated stops that run backwards:", [(a, b) for a, b in zip(ys, ys[1:]) if b[1] < a[1]])
centuries(".cache/graph.json", "this branch", man)
if len(sys.argv) > 1:
    centuries(sys.argv[1], "baseline artifact")

# ---------- C. small counts read straight from their own files ----------
ab = json.load(open("scripts/fable/absences.json", encoding="utf-8"))["subjects"]
print("C. absences.json subjects:", len(ab), dict(Counter(s["status"] for s in ab)))
s6 = open(OUT + "o06-search-production.out", encoding="utf-8").read()
print("C. o06 captured output: [PASS] lines", len(re.findall(r"^\[PASS\]", s6, re.M)), "| [FAIL] lines", len(re.findall(r"^\[FAIL\]", s6, re.M)),
      "| queries in search-queries.json:", (lambda q: len(q["queries"]) if isinstance(q, dict) and "queries" in q else len(q))(json.load(open("scripts/fable/search-queries.json", encoding="utf-8"))))
```

Output:

```text
A. rows in o03-tour_prose.out: 40 | rows in o03-tour_prose-before.out: 42
A. after-table rows equal the manifest, in order: True
A. stops in the before file that are not stops now: ['work/quran', 'period/contemporary-era'] | stops now not in the before file: []
A. working tree vs o03-tour_prose.out: leads 80; 150-250 words: 80 of 80; leads with an uncited sentence: 0; cells that differ from the file: 0
A. baseline prose (git show e1d7212), the before file's 42 stops, vs o03-tour_prose-before.out: leads 84; 150-250 words: 1 of 84; leads with an uncited sentence: 54; cells that differ from the file: 0
A. baseline prose, today's 40 stops only (like for like): leads 80; 150-250 words: 1 of 80; leads with an uncited sentence: 50; cells that differ from the file: 0
B. this branch (graph commit efe522d7d1): cornerstones by Hijri century of own date: {0: 8, 1: 67, 2: 12, 3: 14, 4: 6, 5: 8, 6: 8, 7: 11, 8: 6, 9: 6, 10: 10, 11: 4, 12: 1, 13: 2, 14: 7, 15: 1} | undated: 100 | empty among 1..14: []
B. stops by century: {0: [2, 3], 1: [4, 5, 8, 10, 11, 12, 13, 14, 15], 2: [16, 17, 18], 3: [19, 20], 4: [21, 22], 5: [24], 6: [25, 27], 7: [28, 29], 8: [30, 31], 9: [32, 33, 34], 10: [35], 11: [36], 12: [37], 13: [38], 14: [39], 15: []}
B. centuries 1..14 with no dated stop: [] | stops with no date of their own or their author's: ['1 building/kaaba', '6 concept/five-pillars', '7 practice/salah', '9 practice/hajj', '23 building/al-azhar', '26 work/ihya-ulum-al-din', '40 object/kiswa']
B. dated stops that run backwards: []
B. baseline artifact (graph commit e1d721298a): cornerstones by Hijri century of own date: {0: 8, 1: 67, 2: 12, 3: 14, 4: 6, 5: 8, 6: 8, 7: 11, 8: 6, 9: 6, 10: 10, 11: 4, 12: 0, 13: 2, 14: 7, 15: 1} | undated: 100 | empty among 1..14: [12]
C. absences.json subjects: 31 {'found': 24, 'absent': 6, 'stub-only': 1}
C. o06 captured output: [PASS] lines 2 | [FAIL] lines 48 | queries in search-queries.json: 50
```

### 7.4 How the table generator was re-run without writing

`numbers.py` writes `NUMBERS.md`. To re-run it read-only I replaced `open` for write modes with a scratch path and compared:

```python
import builtins, os, runpy, sys
real_open = builtins.open
def guarded(file, mode="r", *a, **k):
    if any(c in mode for c in "wax+"):
        file = os.path.join(sys.argv[1], "NUMBERS.rerun.md")   # scratch folder, outside the repository
    return real_open(file, mode, *a, **k)
builtins.open = guarded
runpy.run_path("scripts/fable/numbers.py", run_name="__main__")
# then: diff docs/fable-run/NUMBERS.md <scratch>/NUMBERS.rerun.md   -> identical
```
