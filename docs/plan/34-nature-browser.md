# Plan 34 — Nature Explorer (مستكشف الطبيعة)

_Requested by the founder 9 November 2026: "an animals, insects, living organisms browser that shows all the stories, ahadith, quran verses, stories in islam about animals, insects, living organisms, fish, sea, trees, nature — a simple name, maybe Nature Explorer."_

## 1. What it is

A browser over the one graph that gathers every museum record about the natural
world in the Qur'an, the hadith collections and the tradition: the animals, birds,
insects and small creatures, sea creatures, plants and trees, and the phenomena of
creation (rain, mountains, thunder, winds, night and day, sun, moon, stars, water,
earth, heavens). It follows the Ghayb Browser's architecture (plan 33): records
are ordinary `concept` records tagged `nature-browser` + `nature-<section>`, never
a side table; the passages point at them with `mentions` edges; the pages are
composed from `.cache/graph.json` at build time.

## 2. Records

- 82 `concept` records of the new kind `natural` (one line added to
  `schema/enums/kinds.yaml`), each with trilingual label and summary written in
  the docent voice, `wings: [living]`, themes from `animals-and-mercy`,
  `water-and-animals`, `environment-and-climate` and `cosmology-and-creation`,
  and `status.review: draft` with a `provenance` block — draft until a human
  reads them (founder ruling of 8 Nov 2026).
- ~543 `mentions` edges written once on the passage records (Qur'an ayahs with
  `source/tanzil-quran`, hadith reports with the passage's own source); the
  concepts see them as computed `mentioned_in` inverses.
- `related_to` edges from the creature records to the persons, events and
  existing concepts they touch (Solomon, Thamud, the Year of the Elephant,
  `concept/ant-in-hadith`, `concept/cat-in-hadith`, `concept/anam`, …).

## 3. Sections (tags)

`nature-land` (land animals), `nature-bird`, `nature-insect`, `nature-sea`,
`nature-plant`, `nature-cosmos` — the founder's taxonomy (animals, insects,
living organisms, fish/sea, trees, nature).

## 4. Pages

- `/[lang]/nature/` — the home: lede, method note, section index with counts, a
  client-side filter over the trilingual labels and summaries, and the cards.
  Header block carries `data-pagefind-body`; the lists are `data-pagefind-ignore`.
- `/[lang]/nature/<slug>/` — the subject page: trilingual summary, the Qur'an
  ayahs that mention the record rendered from the frozen Tanzil `text` of the
  passage records (never typed), the page language's translation from the same
  records, the hadith cards linking to the reports' own pages, and the related
  records. Each subject links to its ordinary entity page too.

## 5. Surface

- `site/src/lib/nature.ts` (shared reads), `site/src/lib/nav.ts` (`nature` key,
  `ready: true`), `i18n/{en,ar,ur}.yaml` (`explore.pages.nature` + `nature:` block
  in the same commit), `/api/v1/nature.json` via `scripts/export-api.ts`
  (`FEATURE_EXPORTS`), documented in `docs/data/README.md`,
  `site/public/openapi/v1.json` and `llms.txt`. Register row in
  `docs/site/browsers.md`, plan index, `docs/agents/lanes.md` (`nature` lane),
  `docs/status.md`, `CANARY.md`.

## 6. Status

Built 9 November 2026 (70 records, ~450 edges, pages, i18n, API export, Explore
entry and landing card); wave 2 added 12 records (planets, meteors, deep sea,
fish, lion, moth, seeds and grain, the tree of Eden, fire, dust and clay, gold
and silver, east and west) and ~93 more edges for 82 records and ~543 edges.
Records are draft-tier until a human reads them; nothing goes live until the
founder deploys.
