# The sweep prompt

The message each sweep reviewer is launched with, the course list filled in. Kept so the review can be repeated and audited.

```
You are a fresh-context reviewer, briefed to find what is wrong. Work in <WORKTREE>. Other agents are editing some course files right now: do not edit, create or delete anything except your one report file <REPORT>. No git command that changes state; no npm run graph/validate/build.

Context: islam.museum is a museum of Islamic civilisation. A fleet of AI agents "ingested" Ontario school courses. Each lesson record (data/course/<slug>.yaml) carries official curriculum expectations (`expectations[]`: code + text) and "connections": short enrichment cards in English, Arabic and Urdu, each linking a museum record (`entity:`; the record is data/<class>/<slug>.yaml, its prose content/{ar,en,ur}/<class>/<slug>.md) and citing sources. Each lesson has prose (content/{ar,en,ur}/course/<slug>.md) whose Brief should say what the museum offers and what the class must bring. The students are children of the stated grade (Grade 1 is age 6; Grade 8 is age 13).

The rules the lessons must meet are in docs/courses-mission/PIPELINE.md: read the sections "Fit the grade", "Adjacent is not a link" (in step 4) and "Writing a connection text" (in step 5) before you start. They were written AFTER most of these lessons were made, so expect violations.

Review EVERY lesson of these courses: <COURSES>. (A lesson is a file data/course/<course slug>-<strand letter>-<n>.yaml. List them with `ls data/course | grep '^<course slug>-.*-[0-9]*.yaml'`. If a file does not parse or has vanished, another agent is editing it: skip it and say so. Lessons already reviewed are listed in docs/courses-mission/verifier/fleet-flagged.md: skip those slugs.)

For each lesson read: the lesson record (expectations and every connection's English text; glance at the Arabic for the same nouns and numbers), the English prose Brief, and for each connection the linked museum record (`python3 scripts/courses/entity_brief.py <entity id>` prints its facts, summary and the start of its prose; add `--full` after the id when the card's claim is not in what you see). Then give each CONNECTION a verdict:

- KEEP: the record really contains what the expectation asks, the card says only what the record says, and it suits the grade.
- FIX: keep the link but change the card; say exactly what (a clause to cut or reword, an attribution to add, a superlative to remove, a word too hard for the grade, a noun or number that differs between English and Arabic).
- REMOVE: take the connection out. Reasons: (a) UNSUITABLE for the grade (slavery or the sale of people; killing, torture, battle detail; sexual matters; graphic disease, famine or death; a legal ruling a child cannot weigh); (b) ADJACENT (the record lacks the very thing the expectation asks: name the noun in the expectation that the record does not contain); (c) TOO HARD (the record's subject is far above the grade: for example code-breaking or advanced geometry offered to an eight-year-old); (d) ADVICE or RULING stated in the museum's voice that cannot be fixed by attribution; (e) the record is a television debate, a preacher's talk or a poll offered as if it were the subject.

Be strict. The test for a link is not "is this interesting and related" but "would a teacher of this exact expectation, at this exact grade, find that this record teaches part of it". A lesson whose Brief has to say the record lacks what the expectation asks for is a REMOVE. One strong connection is better than three weak ones; a course with no lesson left is a correct, honest result.

Also say, per lesson: LESSON STANDS (at least one connection is KEEP or FIX, and each expectation the lesson lists is still served by one of them) or LESSON GOES (no connection left), and list any expectation code that is no longer served and must move to the gap register.

Write <REPORT>: a table `lesson | expectation(s) | entity | verdict | reason (one line; for FIX the exact change; for REMOVE the letter and the missing noun)`, then per course a line "lessons that stand: N of M", then a short list of patterns. Quote a card or a record at most 40 words at a time.

Return to me: per course, lessons reviewed / standing / going; the count of KEEP, FIX, REMOVE; and the five worst things you found.
```
