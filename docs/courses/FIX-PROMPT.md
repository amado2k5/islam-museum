# The fix prompt

The message a fix agent is launched with after a reviewer's verdicts, the lesson list filled in. Kept so the corrections can be audited.

```
Work in the repository at <WORKTREE> (stay in this directory). Other agents are working on other courses in this worktree: touch ONLY the files of the lessons and courses named below. No git command that changes state; do not run npm run graph, validate, test or any build.

A fresh reviewer read a set of lessons the fleet made and gave a verdict on each. The review is <REVIEW> — read it fully before you start; it gives, per lesson, the verdict, the evidence and the exact change wanted. Your job is to apply the verdicts for these lessons: <LESSONS>.

How a lesson is built: data/course/<slug>.yaml (expectations[], connections[] with title/text in en, ar, ur, an entity and sources), prose in content/{ar,en,ur}/course/<slug>.md (a Brief, sections, Try this), the course's gap register docs/courses/gaps/<subject slug>.yaml, its evidence table docs/courses/evidence/<subject slug>.md and its run log docs/courses/runs/<subject slug>.md. The rules for writing a card are in docs/courses-mission/PIPELINE.md, sections "Fit the grade" and "Writing a connection text": read both.

For KEEP-BUT-FIX: make exactly the change the reviewer asks, in all three languages (en, ar, ur), so the three still say the same thing. Open the linked record first (`python3 scripts/courses/entity_brief.py <entity id> --full`) and write only what it says, with its own attribution: a ruling, a remedy or a judgement is always "X held / the <named body> ruled / <author> writes", never "the record says" and never in the museum's own voice. A health, diet, fasting, pregnancy or contagion card must not read as advice: it says who held the view and when, and the lesson's Brief gains one plain sentence that this is the history of a view and not medical or religious guidance. Do not add a fact the record does not state.

For MOVE-TO-GAP of one connection: delete that connection from the lesson; remove any sentence in the lesson's three prose files that names that record; delete its rows from the evidence table. If the lesson still has at least one connection it stays, and its Brief must still be true (fix it if it described the removed card). If an expectation was served only by the removed connection, move that expectation out of the lesson into the gap register.

For MOVE-TO-GAP of a whole lesson (or a lesson left with no connection): delete the lesson record and its three prose files; remove it from its unit's `lessons:` list; add each of its expectations to the gap register with `code`, `text` (copy the expectation's `en` text exactly from the lesson record before you delete it), `why` (the reviewer's reason, in one sentence) and `searches` (at least two: the record(s) that were tried and why they did not fit); delete its evidence rows. If the unit now has no lesson, delete the unit record and its three prose files and remove it from the subject's `lessons:` list. If the subject now has no unit, delete the subject record and its three prose files too: the course ends "gap only" (its gap register, evidence, run log and curriculum manifest stay). Never delete a grade record or anything outside the course.

A gap-register entry's `text` must be byte-identical to the expectation text the lesson carried (the gate compares it with the official text under the quotation rule).

After the changes, for each course you touched that still has records, run:
  python3 scripts/courses/check_course.py course/<subject slug> --official .cache/curricula/<archive slug>/official.json --strict --save
(the archive slug is in docs/courses/curricula/: find the manifest whose course matches; the gate must print RESULT: GREEN) and
  npx tsx scripts/cite-check.ts $(ls data/course | grep '^<subject slug>' | sed 's/.yaml//; s|^|course/|')
(last line must contain `0 fail`).

Append to each touched course's run log a section "Corrections after the fleet review" listing every change: lesson, verdict, what was removed or rewritten (old clause → new clause for each language), and any verdict you judged wrong and did not apply, with the reason.

Report back: per lesson, what you did in one line; the gate and cite-check last lines per course; and anything you did not apply and why.
```
