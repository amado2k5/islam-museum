# Plan 38 — Four Madhhabs Browser (متصفح المذاهب الأربعة)

_Requested by the founder 10 November 2026 (verbatim, kept for the acceptance spec in
`docs/engineering/26-madhahib-browser-requirements.md`): "start working on متصفح المذاهب
الأربعة where it should list all the mentioned and written المذاهب الأربعة that are in tabi3een
stories, quotes, mentioned and written in books that were harvested and any future harvested
book if it has a المذاهب الأربعة should be viewable here. add a box for it on landing page and
in navigation menus. make sure this is done end to end and full detailed proses and make it
ready for production at the end of this. this is only about المذاهب الأربعة and everything
mentioned about المذاهب الأربعة anywhere in any of the sunni books. find all the instances where
المذاهب الأربعة were mentioned or part of quotes from sa7aba and tabi3een and add those stories,
mentions, quotes, details. also add this in engineering documents as the original requirements
to allow AI later on to test and validate it when it is in production."_

_Founder decisions in the same session: the browser is a **topic hub** — not every fiqh record
that happens to name a school; **other already-modeled schools** (Zahiri, Ja'fari, Ibadiyya)
appear in a clearly labelled section, never as if they were among the four; the work clone
lives on the microSD at `/Volumes/exmicroSD/islam-museum-madhahib` and is deleted after merge;
the corpus mining runs "everything now" — every harvested book that mentions the four madhhabs
is processed as far as the session allows, committing in waves._

## 1. What it is

A browser over the one graph that gathers everything the museum knows about the four Sunni
legal schools — Hanafi, Maliki, Shafi'i and Hanbali — and their place in the tradition: the
four imams, the schools themselves, the other schools the tradition recorded (Zahiri, Ja'fari,
Ibadiyya — labelled), the salaf and tabi'in forebears on whom the fiqh was built, the canonical
books of the schools and the comparative literature, the fiqh/usul concepts the schools turn
on, and **every work, passage, event, exhibit or question whose `mentions` edge names a madhhab
group or the madhhab concept** — the «الذكر في المصادر» corpus.

It follows the Jinn & Devils and Dream browsers' architecture (plans 37, 35): records are
ordinary graph records, never a side table; membership is computed at build time by
`scripts/madhahib.ts` from tags and edges; the pages are composed from `.cache/graph.json`.

## 2. Membership rule (the future-harvest contract)

A record is in the browser when either holds:

- **Tags:** it carries `madhahib-browser` plus at least one `mh-<section>` tag; or
- **Edges:** it has a forward `mentions` edge (domain `work`, `passage`, `media`, `event`,
  `exhibit`, `question`) to a madhhab target:

| mentions → | sections gained |
|---|---|
| `group/hanafi-madhhab` | `dhikr` + `hanafi` |
| `group/maliki-madhhab` | `dhikr` + `maliki` |
| `group/shafii-madhhab` | `dhikr` + `shafii` |
| `group/hanbali-madhhab` | `dhikr` + `hanbali` |
| `group/zahiri-madhhab`, `group/jafari-madhhab`, `group/ibadiyya` | `dhikr` + `ukhra` |
| `concept/madhhab` | `dhikr` |

So the "any future harvested book" requirement is mechanical: when a mining lane writes a
`mentions` edge from a work or passage record to a madhhab group/concept, the record appears in
the right sections on the next build — no code change. `source`-class records sit outside the
`mentions` domain, so a harvested book that exists only as a `source/` record joins through
`madhahib-browser` + `mh-dhikr` (+ school) tags instead. Both paths are documented here, in the
lane row and in the requirements spec so future agents follow the contract.

## 3. Sections (tags `mh-<id>`)

| tag | section | contents |
|---|---|---|
| `mh-aima` | الأئمة الأربعة | the four imams (Abu Hanifa, Malik, al-Shafi'i, Ahmad) — the section the brief names first |
| `mh-hanafi` / `mh-maliki` / `mh-shafii` / `mh-hanbali` | each school | the group record, the imam, canonical books, major scholars, and — via `mentions` edges — every source that discusses that school |
| `mh-ukhra` | مذاهب أخرى | Zahiri, Ja'fari and Ibadiyya groups and their founders, labelled as other schools |
| `mh-salaf` | السلف والتابعون | the tabi'in forebears and formative generation the imams learned from |
| `mh-kutub` | الكتب | canonical literature of the schools plus comparative/history-of-madhhabs works |
| `mh-mafahim` | المفاهيم | the madhhab concept, ijtihad, qiyas, istihsan, taqlid, ikhtilaf and the questions around them |
| `mh-dhikr` | الذكر في المصادر | the mentions corpus — works, passages, events, exhibits and questions whose `mentions` edges name a madhhab (edge-derived) or that are tagged in |

A record may carry several `mh-*` tags and appears in each of its sections (the jinn-devils
precedent).

## 4. Pages

- `/[lang]/madhahib/` — the home: lede, status count, method note, API link, section chips
  with counts, a client-side filter over trilingual labels, summaries, work names, class names
  and excerpts (vowel-insensitive Arabic, progressive enhancement only), and the card grid.
  The header block carries `data-pagefind-body`; the lists are `data-pagefind-ignore`.
  Cards link to the records' ordinary entity pages — this browser adds no subject pages of its
  own because every member already has one (`/person/`, `/group/`, `/work/`, `/concept/`,
  `/source/`, `/passage/` …), which keeps prose, mentions and relations on the entity page
  where the graph already renders them.
- No `[slug].astro`: the browser is a topic hub; subject detail lives on the entity pages.

## 5. Surface

- `scripts/madhahib.ts` — the shared membership detector (`MADHABIB_TAG`, `MADHABIB_SECTIONS`,
  `madhahibMembers`), used by both the site lib and the API export.
- `site/src/lib/madhahib.ts` — `madhahibItems`, `madhahibById`, `mentionedBy` (records that
  `mentions` a given record).
- `site/src/pages/[lang]/madhahib/index.astro`, `site/src/scripts/madhahib-filter.ts`.
- `i18n/{ar,en,ur}.yaml` — `explore.pages.madhahib` + the `madhahib:` block, same commit.
- `site/src/lib/nav.ts` (`madhahib` key, `ready: true` — feeds the Explore menu and the
  landing-page card), `site/src/components/Landing.astro` (thumb + accent).
- `/api/v1/madhahib.json` — written by `scripts/export-api.ts` (`madhahibRows`, mirroring the
  companions special-case), documented in `docs/data/README.md`,
  `site/public/openapi/v1.json` and `llms.txt`; `scripts/features-api.test.ts` updated.
- Registers: `docs/site/browsers.md`, `docs/plan/00-README.md`, `docs/plan/06-roadmap.md`,
  `docs/agents/lanes.md` (`madhahib` lane), `docs/status.md`, `CANARY.md` (v1.11.0 — new
  feature ⇒ minor bump), `docs/coverage.md` regenerated with data changes.

## 6. Content waves

1. **Tag the existing graph** — groups, imams (incl. the missing `founder_of` edge for Ahmad),
   the salaf forebears already in `data/person/`, the canonical `work/` records of each school,
   the comparative literature, and the fiqh/usul concepts; `member_of`/`authored` edges where
   the records support them.
2. **Corpus scan** — one pass over the harvested OCR corpus on the microSD
   (`/Volumes/exmicroSD/islam-museum-harvest/{books,extracted}/**/*.txt`) for «المذاهب
   الأربعة» and its variants plus per-school enumerations; map each hit book to its `work/` or
   `source/` record; write `mentions` edges (works) or `madhahib-browser`+`mh-*` tags
   (source-only records) with page cites; spot-verify doubtful OCR against page images.
3. **Tabi'in quotes and stories** — statements by the Successors and their successors about
   ijtihad, ra'y, qiyas and the imams themselves, mined from the tabaqat/rijal/fiqh books;
   enrich the person records (ar first, en+ur same commit, `status.review: draft`,
   `{cite:… p.N}`) and create the missing formative-generation scholars the pages document.
4. **Ship** — gates per commit (`npm run validate`, `npm test`, `npm run coverage`,
   cite-check on new records), PR → merge, then the microSD clone is deleted.

## 7. Out of scope

- Not every record whose text mentions a school name — the ~18k lexical hits are mostly
  ordinary fiqh statements («عند الحنفية…»); the browser is the curated hub plus the
  works/passages that discuss the schools as such (the founder's "topic hub" decision).
- No verdicts on which school is right; contested questions keep `perspectives`.
- No verbatim book text beyond ≤40-word cited quotations; source files stay out of git.
