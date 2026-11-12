# Courses audit: what exists today, measured

Phase 1 of the courses mission. Every number here is a line of a committed, re-runnable measurement; the "Evidence" column names it. Nothing in this phase changes a course record or a page.

- **A** = `python3 scripts/courses/o01_audit.py --at 800467e93e` → `oracle-output/o01-audit-before.out` (repository at the baseline, plus the live site).
- **B** = the fresh-context verifier's report, `verifier/pilot-expectations.md` (the pilot's expectations against the Ministry's own text).
- **C** = `python3 scripts/courses/find_entity.py …` → `oracle-output/o01-alias-search.out`.
- **D** = `npm run validate` at the baseline → `oracle-output/gate-validate-baseline.out`.
- **E** = a second fresh-context verifier's independent recount of sections 1 to 4, `verifier/audit-numbers.md`: 47 claims, 45 matching, none mismatching, 2 only partly checkable, and the overstatements it found corrected below.

## 1. The tree

| Fact | Value | Evidence |
|---|---|---|
| Records in `data/course/` | 23: 1 jurisdiction, 1 grade, 1 subject, 4 units (strands), 16 lessons | A |
| Shape | One rooted tree, no orphan: `ca-on-english` → `ca-on-g6` → `ca-on-g6-science` → 4 strands → 4 lessons each | A |
| Review state | 23 of 23 `draft` | A |
| Prose files | 23 each in `content/ar/course`, `content/en/course`, `content/ur/course` (a lesson's prose is a brief, two or three teaching sections and a "Try this") | A |
| Live on production | Yes: all 23 records answer 200 in Arabic and in English on https://islam.museum (production commit `8d1b0ef9`, v1.10.0) | A |

The 23 records are drafts and they are live. The founder's ruling that AI output goes live only after a human read (8 November 2026) postdates the pilot's merge; this audit records the fact and changes nothing.

## 2. The schema as the pilot used it

`schema/course.schema.json`: `kind` (jurisdiction, grade, subject, unit, lesson), `part_of`, `order`, jurisdiction fields (`country`, `region`, `board`, `language_of_instruction`), `grade_number`, `subject_name`, `curriculum_ref`, `lessons[]`, `expectations[]` (`code`, localized `text`), `connections[]` (`position` before/within/after, `kind` from nine values, optional `entity`, optional `ref`, localized `title` and `text`, `sources[]`).

| Fact | Value | Evidence |
|---|---|---|
| Expectation entries on lessons | 29 (27 distinct codes) | A |
| Expectation entries on units | 4, each a placeholder ("Overall expectations, strand B"), not the Ministry's text | A, B |
| Connections | 33 on 16 lessons, 1 to 3 per lesson; before 8, within 13, after 12 | A |
| Connection kinds | story 9, scholar 6, quran 5, career 4, reflection 4, invention 3, hadith 1, place 1; `object` never used | A |
| Connections with an `entity` link | 15 of 33 (14 distinct entities); 18 connections link to nothing in the graph | A |
| Sources cited by connections | 5 distinct: `hill-1993` 23 times, `tanzil-quran` 8, `hourani-1991` 3, `sahih-al-bukhari` 1, `sahih-muslim` 1 | A |

## 3. Defects in the pilot data (named here, never copied forward)

**(a) The Arabic and Urdu expectation texts are English.** 29 of 29 lesson expectation entries carry, under `ar` and under `ur`, a byte copy of the English string. The live Arabic lesson page prints the English sentence as if it were Arabic. Evidence: A.

**(b) The expectations are not the Ministry's.** A fresh-context verifier fetched Grade 6 from the Ministry's own content service and compared all 29 entries. None is the official wording. 6 are shortened or reworded versions of the right expectation; 17 sit under a code that officially names a different expectation; 6 match no official expectation. The pilot also swaps two strands: officially C is Matter and Energy (electricity) and D is Structures and Mechanisms (flight); the pilot files flight under C and electricity under D, so every electricity and flight code points at the other strand's text. Strand A (STEM skills) is absent. Evidence: B, with the full 29-row table. The classification "nearest official counterpart" is the verifier's judgement; the texts compared are literal.

**(c) Five of the 14 linked entities are not records.** `person/al-jazari`, `person/sultan-bin-salman`, `object/astrolabe`, `building/maragha-observatory` and `work/kitab-al-hiyal` are stubs: a student who taps them lands on a page with no account. An alias search finds that two of the five exist under another id (`person/al-jazari-engineer`, `person/sultan-bin-salman-al-saud`) and that the other three have real neighbours (`group/banu-musa`, `place/maragha`, several astrolabe inventions and works) but no record of their own. Evidence: A, C.

**(d) No connection is written from its entity's own sources.** Of the 15 entity-linked connections, 10 link a record that exists, and for all 10 none of the connection's cited sources is cited anywhere in the linked record (the other 5 link stubs, which have nothing to cite; they are defect (c)). `person/al-jahiz`, for example, cites Ibn al-Nadim, Ibn Khallikan, al-Mas'udi and the Encyclopaedia of Islam; the connection about him cites Hill's *Islamic Science and Engineering*, a book the record never uses, whose own source record says "bibliographic details to be verified". 23 of the 33 connections cite that book (21 cite it alone, 2 with one other), and no connection can name a page, because a connection's source is a bare id. The comparison is by source id: it would miss a record citing the same work under another id; the verifier found no such case. Evidence: A; the numbers in this paragraph were corrected after the fresh-context recount (`verifier/audit-numbers.md`), which found the first wording ("all 15", "rest on that one book") stronger than the evidence.

**(e) Qur'an connections do not link to the passage.** 5 of 5 carry a `ref` (for example `6:38`) and none links the museum's passage record, so the verse itself is not one tap away. Evidence: A.

## 4. The surface

| Fact | Value | Evidence |
|---|---|---|
| Courses home | `site/src/pages/[lang]/learn/courses/index.astro`, 42 lines: three `<select>` controls in one island (`LearnPicker`) and one card per subject | A |
| What the served HTML links to | 1 course link (the subject). Without JavaScript the three selects do nothing | A |
| Lesson pages | Ordinary entity pages (`/[lang]/course/<slug>/`) drawn by the shared `EntityLayout`; a connection is one small bordered card (`ConnCard`, 17 lines) | A |
| Home to a lesson | 3 interactions at best: subject, strand, lesson. The subject page links to its 4 strands and to no lesson | A |
| Inside a lesson | 3 connection cards on the sampled lesson; no link to the next or previous lesson; no self-check; nothing remembers where the student was | A |
| Position in the tree | A lesson shows its parent strand only | A |

What the surface does not do, against the student's jobs: it cannot be resumed; a lesson is a dead end (the only way on is back); all "within" connections are stacked after the first section whatever the lesson says; the enrichment has the visual weight of a footnote; there is no print layout of a lesson, no classroom view and no check.

## 5. Context outside the class

- The education master plan (`docs/delegation/education-master-plan.md`, 23 October 2026) defines five age bands and a mechanics bank adapted to a static site. Grade 6 falls in Storytellers (10–12). Its relevant mechanics: mastery checks not scores, retrieval practice, print as a first-class output, one-tap classroom entry, progress in `localStorage`, and no live aggregation because there is no server.
- Twelve `exhibit/pathway-*` records map Ontario courses that are *about* Islam or world history to museum trails. They are a different class and a different idea (a course about the museum's subject); the `course` class is the reverse (the museum inside an ordinary subject). This mission does not touch them.
- The validator fails on main at the baseline: 16 errors, none in a course record. Evidence: D.
