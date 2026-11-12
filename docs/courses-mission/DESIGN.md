# The courses surface: design

> **Note, 12 November 2026.** This record was written when the surface was built for Arabic and English and Urdu kept the pilot page. On the user's instruction the surface is now built in Urdu too, the legacy page (`CoursesLegacy.astro`) is removed, and the homepage carries a section and an explorer card for it (`CoursesPromo.astro`). Where the text below says "Arabic and English" or mentions the legacy page, read it with this note. The Urdu pages and the homepage section have not had a vision review.

Phase 2 of the courses mission. This is the concept the prototype builds, and the reasoning a future agent needs to extend it without breaking it. It is an evolution of one surface of islam.museum. Nothing outside `/[lang]/learn/courses/` changes.

What it is for: a student studying an ordinary school subject meets Islamic civilisation inside that subject, in the lessons of their own curriculum, with every claim cited.

## 1. The student's jobs, and what each one became

The design is argued from five jobs. Each has a pattern, and each pattern has a check that measures it.

| Job | Pattern | Measured by |
|---|---|---|
| **Find my course fast.** I know my country, grade and subject, nothing else. | The home is a finder: school system, then a row per grade, then one button per subject. One more tap on the course map reaches any lesson. No form, no dropdown, no script. | `o03_taps.mjs`: every lesson at most three interactions from the home, by search and by real taps at 390 px. |
| **Know where I am.** | Position is on every lesson page three times: the breadcrumb (course and strand), the banner strip ("Lesson 2 of 4", dots, "6 of 16 in the course"), and the rail ("You are here": the strand's lessons, this one marked, done ones filled). Done and next are painted from local state; the home offers "Pick up where you stopped". | Screenshots `state-*`; the no-script oracle checks the position is in the HTML. |
| **Learn in small loops.** | A lesson is five numbered steps on one page: the goal, before you start, the lesson, carry it further, check yourself. Steps that a lesson has no content for are left out and the numbers close up. | `o10_nojs.mjs`: every step, card and check is present and visible on every lesson. |
| **Feel the civilisation, not a lecture.** | The enrichment is the visual centre: a discovery card, the only white, bordered, shadowed object on the page, tied to a gold thread that runs down the lesson. Each card opens a door into the museum. | The vision pass. |
| **Work in a real classroom.** | One plain script of about 5 KB, no framework, no island. A print layout that turns the lesson into a handout. A classroom view that shows one step at a time, large, driven by the arrow keys. | Screenshots `print-*` and `state-classroom-*`; page weight in section 8. |

## 2. Information architecture

Three page types, one tree.

```
/[lang]/learn/courses/                         home: the finder          (Arabic, English; Urdu keeps the pilot page)
/[lang]/learn/courses/<subject>/               course map                (Arabic, English)
/[lang]/learn/courses/<subject>/<lesson>/      lesson                    (Arabic, English)
```

The data tree is jurisdiction → grade → subject → strand → lesson. The surface flattens it to three levels because a student does not think in five: the home resolves jurisdiction, grade and subject together, the course map shows strands and lessons together, the lesson is the lesson. Strands and grades do not get pages of their own in this surface.

The record pages `/[lang]/course/<slug>/` are untouched. They remain the graph's page for each record (the museum's rule is that every feature is graph, API and search). A lesson page links to its record page at the foot. Which of the two is the canonical address for search engines is an open decision, listed in `PUBLISH.md`.

**How three taps holds as the catalogue grows.** With up to three school systems the home shows every system open, and a course is one tap away (two to a lesson, which is what the oracle measures today). With more, each system is a closed disclosure and opening one is the first tap: system, course, lesson. A system's body is a grid of grades by subjects, so a system with twelve grades and eight subjects is still one screen of buttons. The bound breaks only if a single course map cannot show all its lessons as links; a course of two hundred lessons would need the strands collapsed, and that is the limit to design for next.

## 3. The lesson loop

One lesson, one page, read top to bottom.

1. **The goal** ("What your class asks"). The lesson's brief in plain words (the `Brief` section of its prose), then the curriculum expectations with their codes.
2. **Before you start.** The `before` connections: a thought to carry in.
3. **The lesson.** The teaching sections of the prose, with the `within` connections woven between them on the gold thread, then "Try this".
4. **Carry it further.** The `after` connections: where the lesson leads in the museum.
5. **Check yourself.** A recognition question, one or two tell-it-back prompts, the "I can now" list, and "Mark this lesson done".

Then the way on: previous and next lesson, or back to the map after the last one. A lesson is never a dead end.

**Where "within" goes.** The record says only `within`. The rule is fixed in `weave()` in `site/src/lib/courses.ts`: with *s* sections and *k* cards, card *i* follows section ⌈*i*·*s*/(*k*+1)⌉. One card in a two-section lesson sits between the two. Cards never open the lesson (that is `before`) and never pile up after the first section, which is what the pilot page did. If a curriculum needs a card pinned to a named section, the smallest schema extension is an optional `after_section` on the connection; it is not added here because no record needs it yet.

## 4. The card

A discovery card has, top to bottom: its kind (Qur'an, scholar, story, invention, place, object, hadith, career, reflection) and reference; a title; for a Qur'an card the verse itself; the text; the door; the source.

- **The door** is the graph one tap away: the record's name, the first 180 characters of its own summary, and "Open in the museum". It is a link the size of a button, not a chip.
- **A record that is not written yet is shown, never linked.** Five of the pilot's fourteen linked ids are stubs. The card names the subject, says "This record is not written yet", and does not send a student to an empty page.
- **The verse is never typed.** A reference shaped `sura:aya` is resolved to the museum's passage record and the verse is printed from that record's frozen Tanzil text. The pilot's Qur'an cards paraphrase the verse and do not link it; the surface now shows the verse and links the passage without changing a record.
- **The source is on the card.** Every card names its source and links the source's record.

The card's summary line is the linked record's own summary, whatever it says. Where that summary is about something far from the lesson (the pilot's al-Jahiz card meets a record whose summary is about a different book of his), the mismatch is visible. That is a content finding, not a layout one, and it is the pipeline's reason for writing connection texts from the record itself (`PIPELINE.md`).

## 5. Closing the loop, without writing anything new

The self-check adds no authored content. It is built at build time from the lesson's own records (`buildCheck()`), so it cannot say anything the records do not.

- **Recognition.** "Which of these did you meet in this lesson?" One right answer (a record this lesson links) and two from other lessons of the same course, chosen and ordered by a hash of the lesson id, so the page is the same on every build. Shown only when the lesson links at least one record.
- **Tell it back.** "In your own words: what does al-Jahiz have to do with this lesson?" The student answers in their head or on paper, then opens "Compare with the card", which shows the card's own text.
- **I can now.** The lesson's expectations as a checklist. It is a self-assessment, printed on the handout.
- **Mark this lesson done.** One button; the only thing the surface stores.

The limit, stated plainly: this is recall of what the lesson showed, not a test of the science. A mastery check of the curriculum content needs authored questions, which is content work for a human-read pipeline, not something to generate at build.

## 6. State, without accounts

Two `localStorage` keys in the student's browser. Nothing is sent anywhere; there is no account, cookie, or server.

| Key | Holds | Written when |
|---|---|---|
| `courses:done` | `{"<course>/<lesson>": "YYYY-MM-DD"}` | The student presses "Mark this lesson done" (again to undo). |
| `courses:last` | The last lesson opened: slugs, title, path. | A lesson page loads. |

From these: the home's resume banner, the map's filled numbers, "next up" ring, progress line and "Continue" button, and the rail's filled numbers. The keys are separate from the museum passport on purpose: a later phase can read `courses:done` into a passport stamp without this surface depending on the passport.

## 7. With JavaScript disabled

Everything a student needs is in the HTML. The finder is links inside native disclosures. The steps are anchors. The check is radio buttons whose feedback is shown by CSS (`input:checked ~ .cx-fb`) and native `<details>`. Previous and next are links. What needs a script is hidden until the script runs: the done button, print, classroom view, the resume banner and the progress line. A note on the home and the map says progress needs JavaScript and that every lesson opens without it.

## 8. Visual language

An extension of the museum's design system, not a new one. Tokens used: `--gold`, `--gold-text`, `--lapis`, `--panel`, `--card`, `--rule`, `--line`, `--muted`, `--link`, the type stacks, `--measure`. Classes reused: `.wrap`, `.ui`, `.flip` (arrows that mirror in right-to-left), `.no-print`, the inner-page banner (`PageHeader`, wing tint `ideas`). New classes all begin `cx-`.

- **The thread.** A thin vertical rule along the lesson (on the right in Arabic). Curriculum prose sits beside it plainly; each discovery is a card tied to it by a gold diamond. The student's subject is the line; the museum is what hangs on it.
- **Hierarchy by surface.** Prose has no box. Discoveries are white cards with a border. "Try this" and doors are sand panels. Nothing else is boxed, so the eye lands on the discoveries.
- **Numbers.** Step numbers and lesson numbers are gold rings; a done lesson's ring is filled.
- **Arabic first.** Card titles use the Arabic display face; labels that are uppercase and letter-spaced in English are set in normal Arabic text at a larger size, because Arabic has no capitals and must not be letter-spaced. Layout uses logical properties throughout, so the thread, the rail and the diamonds mirror by themselves.
- **Touch.** Every link and control is at least 44 px high.
- **Weight.** The stylesheet is written into courses pages only (`courses.css`, read as text by `CoursesStyle.astro`); the script is a plain file under `/shell/`. An edit to either rewrites the courses pages and no other page.

## 9. Language honesty

A curriculum is written in its authority's language. `expectationView()` treats a text as translated only if the record carries one for the page's language that is not a byte copy of the official text. Otherwise it shows the official text, set in its own language and direction, labelled "Official wording, in English (not yet translated)". The pilot stored English under `ar` for all 29 expectations; the Arabic pages now say so instead of passing it off.

## 10. The classroom

- **Classroom view.** One step of the loop at a time at 135% size, the site chrome hidden, a bar with Back, Next and Leave, driven by the arrow keys, Page Up, Page Down and Esc. It is the same page, so a teacher can leave the view and scroll.
- **Print.** The handout drops the navigation and tools, prints the codes in outline, replaces each tell-it-back reveal with a ruled line to write on, and keeps the "I can now" checklist.
- **School hardware.** No framework is loaded by the surface; pages are static HTML; the fonts and header are the site's own.
- What it does not do: it cannot collect answers from a class. There is no server, and the master plan already ruled that out.

## 11. Extending it without breaking it

- All logic is in `site/src/lib/courses.ts`. Pages only lay out what it returns. A new curriculum needs no code: add records under `data/course/` and prose under `content/<lang>/course/`, and the home, map and lessons appear.
- Lessons hung directly on a subject (no strand) are handled: they form one unnamed strand.
- The section headings that mean "brief" and "try this" are matched by name (`Brief`, `موجز`, `Try this`, `جرّب هذا`). A curriculum prose file that uses other headings shows them as ordinary teaching sections.
- To add a language to the surface, add it to `COURSE_LANGS` and add its `courses:` strings. The home keeps `CoursesLegacy` for any language not in the list; delete that component only when the list covers every site language.
- Do not move the styles into an Astro `<style>` block or into `site/src/styles/`. The first puts them on the Urdu page, the second on every page of the site. `o11_boundaries.py` fails in both cases.
- Run the four oracles after any change: `o03_taps.mjs`, `o10_nojs.mjs`, `o11_boundaries.py`, and the vision capture.
