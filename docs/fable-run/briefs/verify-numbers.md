# Brief: re-derive the run's numbers (fresh-context verifier)

You did not produce these numbers. Your job is to recompute them and say where they are wrong.

## What you are checking

A run on this repository published a table of numbers, `docs/fable-run/NUMBERS.md`, and a board,
`docs/fable-run/VERIFICATION.md`. Each number is supposed to come from an oracle: a committed script under
`scripts/fable/` whose captured output is in `docs/fable-run/oracle-output/`. An independent agent from another system
will re-derive every number and publish where we are wrong. You go first.

## Two passes

**Pass 1: re-run.** For each row of `NUMBERS.md` and each line of the board, run the command the board gives (the
oracle file's own header also shows how) and compare its output with the captured output file and with the published
number. The graph artifact `.cache/graph.json` is already built from the current commit; do not rebuild it unless an
oracle tells you it is stale (`npm run graph`, about one minute). Do not run `o08_unchanged.py` (ten minutes, two
builds), `o06_search.mjs` (network) or `board.py`; for those, check only that the published number matches the
captured output file.

**Pass 2: recompute independently.** For the numbers below, do NOT use the run's scripts. Write your own short code
(Python standard library; read `.cache/graph.json` directly, or the files under `data/`, `content/`, `tour/`) from the
definition given, and compare.

1. Records in the graph (nodes with `stub` false), and how many have `data.status.review` equal to `draft` and to
   `published`.
2. Canon records (nodes with `data.importance` 1 or 2) and cornerstones (`data.importance` 1).
3. Tour stops: the `- id:` lines of `tour/grand-tour.yaml`. Check each is a cornerstone. From each stop's own `wings`
   list, the set of wings covered (nine exist: time, place, people, ideas, objects, words, living, today, made).
4. The completion room's count: distinct non-stub nodes that share at least one edge (either direction, any type) with
   at least one stop, not counting the stops themselves.
5. Dead-end cornerstones: cornerstones with fewer than two distinct non-stub neighbours, ignoring edges of type
   `related_to`. How many have none, how many have one.
6. Published records within three hops of a cornerstone: breadth-first search from all cornerstones together over
   edges between non-stub nodes, ignoring `related_to`, undirected; count published records at distance 0 to 3.
7. For three Tour stops of your choice: count the words of the first `## ` section of `content/ar/<id>.md` and
   `content/en/<id>.md` the way a reader sees them (drop `{cite:...}` markers; turn `[[id|label]]` into `label`) and
   compare with the table in `docs/fable-run/oracle-output/o03-tour_prose.out`.
8. Contradictions: count the entries of `docs/fable-run/contradictions/register.json` by `status`.

Where your number differs from the published one, work out why: a different definition (say which reading of the
definition each side took), a bug in the run's script, or a bug in yours. Say which you believe and why.

## What you write

`docs/fable-run/verifier/numbers.md`: a table, one row per number: the published value, the value you got by
re-running, the value you got by recomputing (where asked), MATCH or DIFFERS, and for every DIFFERS the explanation.
Include the code you wrote for pass 2 in the file (in fenced blocks) so the next checker can run it.

## Limits

Read-only except for that one file (and scratch files outside the repository). No git commands that change state.
Do not edit any oracle or data file: I act on what you find.

## Report back (short)

How many numbers matched, and every difference in a line each with your explanation.
