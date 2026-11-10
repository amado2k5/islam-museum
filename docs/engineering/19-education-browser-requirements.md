# Education Browser — requirements and production checklist

The School Syllabus Browser: a student picks country → province/board → grade →
subject and opens a syllabus page where every lesson is woven with connections
to Islam and Muslims — Qur'an, hadith, scholars, inventions, careers, stories —
from every generation. The goal is to connect what students learn at school
with the Islamic tradition and the Muslim world.

This document is the acceptance spec. Any agent can test production
(`https://islam.museum`) or a build against it. Status: **shipped** (merged to
`main` in PRs #5808, #5881, #5883, #5884, #5889, #5890; CANARY v1.9.0).

## 1 · Functional requirements

| # | Requirement | Where it lives |
|---|---|---|
| F1 | Student flow: country → province/board → grade → subject → open the syllabus | `/{lang}/learn/courses/` picker (`site/src/pages/[lang]/learn/courses/index.astro`, `site/src/islands/LearnPicker.svelte`) |
| F2 | The syllabus opens as course pages: subject → strands/units → lessons | `/{lang}/course/<slug>/` via `site/src/pages/[lang]/[class]/[slug].astro` + `EntityLayout.astro` |
| F3 | Every lesson carries Muslim connections positioned **before**, **within** or **after** the lesson content | `connections[]` on `data/course/*-*.yaml`, rendered by `site/src/components/ConnCard.astro` |
| F4 | Connection kinds: quran, hadith, scholar, invention, career, story, reflection, place, object | `connections[].kind`, `i18n/*.yaml` `syllabus.kinds` |
| F5 | Connections link into the knowledge graph (entity pages or stubs), never standalone text only | `connections[].entity` / `.ref` → graph nodes or `data/_stubs.yaml` |
| F6 | Curriculum expectations shown per lesson with official codes (B2.1, C2.3 …) | `expectations[]` |
| F7 | Pilot = the **full** Ontario (Canada, English board) Grade 6 Science and Technology course: 4 strands (Biodiversity, Flight, Electrical Phenomena, Space), 16 lessons | `data/course/ca-on-*.yaml` — 23 records |
| F8 | Picker reachable from the education hub `/learn/` (📚 card), the top nav (Learn → card), the landing page tour section, and the footer | `site/src/pages/[lang]/learn/index.astro`, `BaseLayout.astro`, `Landing.astro` |
| F9 | Works without JavaScript: the picker degrades to static course cards; every course page is fully readable without JS | `<noscript>` + server-rendered fallback in `learn/courses/index.astro` |

## 2 · Data and content requirements

| # | Requirement |
|---|---|
| D1 | `course` is a registered graph class (`scripts/lib.ts`, `schema/enums/kinds.yaml`, `schema/course.schema.json`) with kinds `jurisdiction, grade, subject, unit, lesson`, nested by `part_of` |
| D2 | Every record cites the curriculum source (`source/ontario-science-tech-2022`); every claim-carrying connection cites a source |
| D3 | All generated content is `status.review: draft` with `generated_by` provenance — never self-promoted to published |
| D4 | Qur'an is referenced as `sura:ayah` refs (e.g. `16:79`), never typed text |
| D5 | Arabic-script parentheses wrapped in U+2066…U+2069 isolates (applies to `ar` **and** `ur` fields) |
| D6 | Missing link targets registered in `data/_stubs.yaml`; when a real entity is later written, the stub must be removed (validator warns otherwise) |
| D7 | Documented in `docs/plan/02-content-model.md` (class table), `docs/site/browsers.md` (Education row), `docs/status.md` (Tour/Learn row), `CANARY.md` v1.9.0 |

## 3 · Language requirements

| # | Requirement |
|---|---|
| L1 | All three site languages: `label`, `summary`, `subject_name`, `expectations[].text`, `connections[].title/text` carry `ar`, `en`, `ur` |
| L2 | Prose exists in `content/{ar,en,ur}/course/` — 23 files each |
| L3 | Official curriculum expectation statements stay in English in all languages (they are quoted codes); unit-level "overall expectations" lines are translated |
| L4 | `i18n/{ar,en,ur}.yaml` carry the full `syllabus.*` block (picker labels, kind names, expectations, noscript text) |
| L5 | Arabic and Urdu pages render RTL; English LTR; language switcher alternates resolve |

## 4 · Production verification checklist

Run these against `https://islam.museum` after any deploy:

- [ ] `/{lang}/learn/` for each lang shows the **Syllabus Browser** card → links to `/{lang}/learn/courses/`
- [ ] `/en/learn/courses/` and `/ar/learn/courses/` and `/ur/learn/courses/` return 200; the cascading selects resolve to "Grade 6 Science and Technology" (or the static card lists it without JS)
- [ ] `/en/course/ca-on-g6-science/` lists the **4 strands as unit cards in curriculum order** (B→C→D→E, labelled "Units" not "Lessons")
- [ ] Each unit page lists its 4 lessons
- [ ] `/en/course/ca-on-g6-sci-fly-1/` shows: expectations `C2.2`/`C2.3`, a **Qur'an card before** the lesson (16:79), a **story card within** (Abbas ibn Firnas) linking to `person/abbas-ibn-firnas`
- [ ] Same lesson in `/ar/` and `/ur/` renders RTL with translated labels, cards and prose
- [ ] `/{lang}/` landing tour section links to the Syllabus Browser
- [ ] `/api/v1/course/ca-on-g6-sci-fly-1.json` returns the entity JSON
- [ ] Pagefind indexes the course pages (search for "four forces of flight" / "قوى الطيران")
- [ ] `npm run validate` → 0 errors; `npm run build` generates the pages in all three languages
- [ ] Draft badge/notice present — content is not marked reviewed/verified

## 5 · Known gaps / roadmap

- More countries, boards, grades and subjects (pilot is one course by design)
- Urdu prose is an AI draft pending human review (as is all generated content)
- No `order` field on units; order comes from `lessons[]` listing — keep curriculum order when adding courses

## 6 · Key files

`schema/course.schema.json`, `data/course/`, `content/{ar,en,ur}/course/`,
`site/src/pages/[lang]/learn/courses/index.astro`, `site/src/islands/LearnPicker.svelte`,
`site/src/components/ConnCard.astro`, `site/src/layouts/EntityLayout.astro`,
`site/src/pages/[lang]/[class]/[slug].astro`, `i18n/{ar,en,ur}.yaml` (`syllabus.*`).
