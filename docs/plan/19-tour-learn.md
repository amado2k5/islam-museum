# 19 · Tour / Learn — guided pathways through the museum

_Added 12 October 2026 at the founder's request. Status: planned; the tab, the landing-page and coverage-page notices are live and say it is in the making; the pathways themselves are not written yet._

## 1. Why

The museum is large on purpose: nine wings, four cross-cutting entrances, thousands of linked pages. A newcomer who lands on a page about a battle, a scholar or a concept can follow the Connections panel forever and still not know what to read next, what it adds up to, or when they have understood something. The risk is that breadth feels like a maze.

**Tour / Learn** is the answer: a new top-level tab (with its own place in the main menu and on the landing page) that offers **pathways**: short, ordered, goal-directed routes through the museum. A visitor says what they want to understand, picks a pathway, and is walked through it one step at a time, or shown the whole route at once. The rest of the museum is untouched: the wings, halls, labels, Questions, Exhibits, Screening Room, Themes and Wander stay exactly as they are, and a pathway is only a guide laid over them.

## 2. What a pathway is

A pathway has:

- **A goal, stated as an outcome.** Always something the visitor will know or be able to place, never something they are expected to believe or do. Example: *"After this path you can place the first revelation, the move to Abyssinia, the boycott and the Year of Sorrow in order, say who protected the Prophet in Mecca and why it mattered, and read the dates the sources disagree on."* Every outcome is checkable against the cited steps.
- **A kind** (what sort of understanding it builds, see §4): a phase of history, a group of personalities, a group of events, an idea or practice, a place, a text or science, an art or object, living culture today, a hard question with its voices.
- **An audience and level** (new to the subject, student, teacher, family and children), and an honest **time** (10 minutes, 30 minutes, 2 hours, a week of evenings).
- **Steps** (usually 5 to 15). Each step points at something that already exists in the museum: a label (person, place, event, concept, work, object …), a passage, a question, an exhibit room, a map or timeline view with its filter, a screen title. A step carries a one-line framing note in Arabic, *why this comes next*, *what to notice*, and a depth hint (Brief, Standard or Deep) so the visitor can skim or dig. Optional side steps ("go deeper", "the other view") branch off without breaking the main line.
- **Prerequisites and onward paths:** what to do first if this is too steep, and where to go after.
- **A closing recap** ("what you now know"), with each point linked to the step that supports it, and a printable handout for teachers.

Pathways are made of the museum's own reviewed pages. A pathway never contains facts of its own that are not already on the pages it links to, so everything stays cited.

## 3. What the visitor sees

- **The tab.** Main menu: *Tour / Learn* (Arabic: *جولة وتعلّم*), at `/ar/learn/`. Until the first pathways are ready the page explains the feature and says it is being built (this is live now).
- **The chooser.** One plain question, *What do you want to understand?*, with doors by goal (an era, people, events, an idea, a place, a text, a hard question), by who the visitor is (newcomer, student, teacher, family), and by time available. No chat box and no model: the chooser filters the precomputed catalogue.
- **A pathway page.** The goal and who it is for, time, level and prerequisites at the top; then two ways to travel:
  - **Step by step:** one card at a time (framing note, the page or view embedded or linked, Next and Back, a progress bar, "skip", "go deeper").
  - **See it all:** the whole route at once as a list, a timeline and a map where the steps have dates and places, so the shape of the subject is visible before it is walked.
- **Progress without an account.** Where the visitor is on each pathway, bookmarks and notes live in the browser only (`localStorage`), exportable as a URL or a printable sheet, exactly like "My tour" in `04-experience.md` §5.
- **Everywhere else.** A label that belongs to pathways shows "Part of these pathways" with the next step; the Atrium, the landing page and the coverage page all point to the tab.
- **Not overwhelming by design:** at most one recommended pathway per goal on the first screen, a "start here" path for each audience, and every pathway ends with a short list of next paths, never an open-ended menu.

Everything is static: precomputed pages and client-side filtering over a small JSON index. No server, no database and no AI at runtime (`03-architecture.md` §13).

## 4. The planning-phase task: the top 300 pathways

During the planning (building) phase the museum uses AI, as it does for all drafting, to **propose the top 300 pathways** that anyone could try to learn and explore, with their goals, audiences, step lists and the gaps each one exposes. The list is reviewed and ordered by people; it is not generated at runtime and never by a model talking to visitors.

### 4.1 The target mix (300)

| Kind | Pathways | Examples of the goal |
|---|---|---|
| Eras and phases | 40 | The Meccan period · the Medinan period · the Rashidun · the Umayyads · the House of Wisdom age · the Crusades from the Muslim side · the Mongols and after · the three gunpowder empires · colonial and modern eras |
| Personalities and groups | 55 | The ten promised paradise · the women around the Prophet · the four imams · the six hadith compilers · the narrators of the most hadith · the opponents who became Muslims · rulers who shaped an age · the scientists of one century |
| Events grouped together | 40 | Every ghazwa and sariyya in order · the two migrations to Abyssinia · the road to the conquest of Mecca · the first civil war · the fall of Baghdad · a famous journey |
| Ideas, beliefs and practices | 45 | The five pillars · what the shahada commits to · how prayer is built · zakat and waqf · tawhid and the names of God · what the schools of law are · how a hadith is graded |
| Places and cities | 30 | Mecca, Medina, Jerusalem · Cordoba · Baghdad · Timbuktu · Isfahan · Cairo · Istanbul · Samarkand · Kuala Lumpur |
| Texts and sciences | 30 | How the Qur'an was transmitted · reading a tafsir · the Muwatta to the Sahih · Ibn Sina's Canon · algebra and the algorithm · optics |
| Art, architecture and objects | 20 | The mosque in every region · calligraphy · geometry and the arabesque · manuscripts · textiles |
| Living culture today | 15 | The Islamic year · festivals · food and halal · Muslim nations in numbers · institutions |
| Hard questions with their voices | 15 | Each is a tension-card path: two or more cited voices, no verdict (`14-themes-atlas.md`) |
| Starter paths by audience and time | 10 | *Islam in 30 minutes*, a family path, a children's path, a teacher's week, a researcher's entry path |
| **Total** | **300** | |

### 4.2 How the 300 are chosen

1. **Demand first.** Candidates come from what newcomers actually ask: the Questions list, the high-linked Arabic Wikipedia titles and categories already in the harvest, and the themes atlas. Each candidate is scored on how many people would want it and how well it fits the goal.
2. **Feasibility.** A pathway is only worth proposing if the graph can support it. The pass measures how many of its steps already exist and are reviewed, and lists the missing entities, which feed the harvest and writing queues directly (the same gap-batch mechanism as `docs/delegation/gap-batches.md`).
3. **Balance.** The Sunni frame leads; other views are labelled and included; opponents, critics and allies appear with time-scoped roles; no region or century is allowed to dominate; no pathway ends on a verdict.
4. **Sequence.** Within each pathway the order is chosen for learning (what must be known first), not for alphabet or chronology alone; every pathway is within 5 to 15 steps and a stated time.
5. **De-duplication.** Overlapping pathways are merged or cross-linked, so 300 means 300 distinct goals.

### 4.3 What the planning pass produces

A reviewed catalogue in `docs/pathways/catalogue.yaml` (one record per pathway: id, title, goal, kind, audience, level, minutes, step references, prerequisites, onward paths, theme and wing tags, a `readiness` figure and the list of missing entities, `status: proposed`) plus a short report: the ranking, what is thin, and the first 20 pathways recommended to build because the graph already supports them. Provenance records the models and prompts used; everything starts as `proposed` and nothing is marked reviewed by the AI.

## 5. Data model

Pathways reuse the existing `exhibit` class (`02-content-model.md`: `kind ∈ {exhibition, story, tour, lesson, trail}`, `audience[]`, `duration_minutes`, `rooms[]`, `prerequisites[]`) rather than adding a twenty-third class: `lesson` and `trail` are guided pathways, `tour` the broad ones. Fields to add when the maintainer lane implements this (schema change, validator rules, tests):

- `goal` and `outcomes[]` (localized; each outcome names the steps that support it);
- `path_kind` (one of the kinds in §4.1), `level`, `audience`;
- on each room/step: `note` (framing), `why_next`, `notice`, `depth` (brief | standard | deep), `optional`, `branch_of`;
- `next[]` (onward pathways).

Validator rules: every step reference resolves; 5 to 15 steps; the stated time matches the steps; no dead ends (every path has a prerequisite or an onward path); every outcome is supported by a step; no step points at a stub or an unreviewed entity in a path marked `ready`; Arabic goal and notes are required; honorific, Qur'an-text and verdict rules apply to the notes like any prose (`docs/agents/content-standards.md`). A coverage report lists pathways by readiness so unfinished ones show as "coming soon" with exactly what is missing.

## 6. Editorial rules specific to pathways

- A goal describes understanding, never conversion or obligation; nothing prescribes.
- The Sunni frame is the default; any other view is labelled before it is stated and sits in a clearly marked side step, never silently inside the main line.
- Hard-question pathways give each voice its own cited step and end with the open question, not an answer.
- Every framing note stays within what the linked page says; a note that adds a fact adds it to the page first.
- Children's paths use the kid-mode text and avoid sensitive material; teachers' paths come with a printable handout and discussion questions.

## 7. Rollout

| When | What |
|---|---|
| Now (Phase 1) | The tab, the landing-page card, the menu entry and a coverage-page notice, all saying the feature is being built (live). This plan. |
| Phase 1 | The planning pass of §4: the 300-pathway catalogue and report; schema and validator rules; the first 10 pathways written by hand around what is already in the museum (the Prophetic era is deep enough today for the first ones: the Meccan period, the two migrations to Abyssinia, the road to the conquest of Mecca, the women around the Prophet, the Companions of the second pledge). |
| Phase 2 | The step-by-step player and "see it all" views, the chooser, local progress, printable handouts, 60 pathways. |
| Phase 3 | 150 pathways across all kinds; "Part of these pathways" on labels; pathway readiness in the coverage dashboard. |
| Phase 4 | All 300, then English and other languages translated from the Arabic. |

Success: a newcomer reaches a pathway goal in under 30 seconds from the landing page; completion rate of started pathways; share of pathways at `ready` with all steps reviewed; every pathway's gaps closed or listed.

## 8. Relationship to the rest of the museum

- **Exhibits and tours** (`04-experience.md`): curated narrative exhibits stay as they are; pathways are the structured, goal-directed form and live under the same class.
- **My tour** (bookmarks): a personal list; a pathway can be saved into it.
- **Questions:** a question can end with "Follow the path"; a pathway can start from a question.
- **Themes and halls:** a theme hub lists its pathways; halls and the Atrium point to the tab.
- **Coverage:** pathways give the coverage page its most useful new measure, how many goals the museum can already teach end to end.

## 9. Acceptance scenarios

1. **Layla**, new to the subject, opens the tab, chooses *a phase of history* and *30 minutes*, and gets one recommended path with its goal in two lines and a step-by-step view.
2. **A teacher** opens *the second pledge of al-Aqaba*, sees the whole route as a list, timeline and map, prints the handout and the discussion questions.
3. **A student** starts *the opponents who became Muslims*, skips two optional steps, and reaches a recap whose every line links to a cited page.
4. **A visitor** opens a hard-question path and finds each voice labelled and cited and no verdict.
5. **The maintainer** opens the coverage page and sees which of the 300 pathways are ready and exactly which entities each unfinished one still needs.
