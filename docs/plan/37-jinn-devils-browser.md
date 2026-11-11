# Plan 35 — Jinn & Devils Browser (متصفح الشياطين والجن)

_Requested by the founder 10 November 2026 (verbatim, kept for the acceptance spec in
`docs/engineering/25-jinn-devils-requirements.md`): "start working on متصفح الشياطين والجن
where it should list all the mentioned and written Jinn and demons/devil that are in quran,
sunnah, any of seerah and any dreams mentioned and written in books that were harvested and
any future harvested book if it has a Jinn and demons/devil should be viewable here. add a box
for it on landing page and in navigation menus. make sure this is done end to end and full
detailed proses and make it ready for production at the end of this. this is only about Jinn
and demons/devil and everything mentioned about angels in quran, sunnah, serrah, anywhere in
any of the sunni books. also add this in engineering documents as the original requirements to
allow AI later on to test and validate it when it is in production."_

_Second instruction, same day: "find all the instances where jinn and devil/demons met or
interacted with humans in the quran, seerah, sunna, quotes from sa7aba and tabi3een and add
those stories, mentions, quotes" — and angel–human interactions from the same sources._

## 1. What it is

A browser over the one graph that gathers every museum record about jinn, devils and demons,
angels, and the dreams that carry them: the beings themselves, their kinds, the encounters and
interaction stories the Qur'an, the hadith collections, the seerah and the Companion and Tabi'i
reports record, and the dream literature (Ibn Sirin's tafsir of dreams and the dream-science
concepts). It follows the Ghayb and Nature browsers' architecture (plans 33, 34): records are
ordinary graph records tagged `jinn-devils-browser` + `jd-<section>`, never a side table; the
passages point at them with `mentions` edges; the pages are composed from `.cache/graph.json`
at build time.

## 2. Records

- New `jinn` and `devil` concept kinds added to `schema/enums/kinds.yaml` and regenerated
  (`angel` already existed for the parallel Angels Browser branch).
- New records seeded draft-tier (`status.review: draft` + `provenance`, trilingual):
  `concept/jinn-anwa` (kinds of jinn), `event/jinn-delegation` (the jinn delegation to the
  Prophet, Sahih Muslim), `event/sihr-against-the-prophet` and `person/labid-ibn-al-asam`
  (the bewitching of the Prophet). More interaction waves (angels → jinn → devils → dreams)
  follow in the same pattern.
- 29 existing records tagged in place (the jinn, qareen, Iblis, shayatin, waswas, sihr,
  kahana, ghul, dream-science concepts, the Prophet-era kahins, the Badr/Uhud angel events
  and Dihya) via `scripts/tag-jinn-devils.py` — idempotent, mapping table in the script.
- `scripts/harvest/jinn-devils/mentions.py` — conservative, idempotent harvester over every
  `data/passage/` record (Qur'an ayahs + hadith collections): unambiguous lexical forms only
  (الجن as a whole token so الجنة/الجنود never match; إبليس; شيطان/شياطين; وسواس; لوّامة;
  the سحر domain; كهانة; قرين in hadith corpora only; مارد/عفريت/غول/سيّاط; رويا/تعبير الرؤيا).
  First run: 97 passage records gained `mentions` edges — ~150 edges in total across
  sihr, shayatin, jinn, ruya, taabir, kahana, waswasa, lammas, ghul and jinn-anwa targets.
  Future harvested books get the same edges automatically on re-run — that is the founder's
  "any future harvested book" requirement.
- The angels section reads BOTH tags: `jd-angels` records and every `angels-browser`-tagged
  record, so this browser is complete whether or not the parallel Angels Browser branch has
  landed, and the two browsers share angel records without file conflicts.

## 3. Sections (tags)

`jd-jinn` (the jinn), `jd-devils` (devils and demons), `jd-angels` (angels), `jd-dreams`
(dreams and dream literature). A record may carry several `jd-*` tags (e.g. the qareen is
jinn and devil-associated); it then appears in each of its sections.

## 4. Pages

- `/[lang]/jinn-devils/` — the home: lede, method note, section index with counts, a
  client-side filter over the trilingual labels and summaries, and the cards. Header block
  carries `data-pagefind-body`; the lists are `data-pagefind-ignore`.
- `/[lang]/jinn-devils/<slug>/` — the subject page: trilingual summary, the Qur'an ayahs
  that mention the record rendered from the frozen Tanzil `text` of the passage records
  (never typed), the page language's translation from the same records, the hadith cards
  linking to the reports' own pages, and the related records. Each subject links to its
  ordinary entity page too.

## 5. Surface

- `site/src/lib/jinn-devils.ts` (shared reads), `site/src/lib/nav.ts` (`jinn-devils` key,
  `ready: true` — this feeds both the Explore menu and the landing-page card),
  `i18n/{en,ar,ur}.yaml` (`explore.pages.jinn-devils` + `jinn-devils:` block in the same
  commit), `site/src/scripts/jinn-devils-filter.ts`,
  `/api/v1/jinn-devils.json` via `scripts/export-api.ts` (`FEATURE_EXPORTS`, picking
  `jinn-devils-browser` OR `angels-browser` tags), documented in `docs/data/README.md`,
  `site/public/openapi/v1.json` and `llms.txt`. Register row in `docs/site/browsers.md`,
  lane `jinn-devils` in `docs/agents/lanes.md`, `docs/status.md`, `CANARY.md`.

## 6. Status

Built 10 November 2026: schema kinds, 29 tags, 4 seed records, the mentions harvester
(97 passage records, ~150 edges), the browser pages in three languages, the Explore entry,
the landing card, `/api/v1/jinn-devils.json`, OpenAPI, `llms.txt` and the requirements spec
(`docs/engineering/25-jinn-devils-requirements.md`). Records are draft-tier until a human
reads them; nothing goes live until the founder deploys.

Interaction waves 2–17 landed through 11 November 2026 (PRs #5992–#6017): the core
encounter stories (cave of the three men, jinn delegation, Solomon's court, Pharaoh's
sorcerers, Adam's fall, the bewitching of the Prophet, the ifrit of the Night Journey,
the snake-jinn of Medina, the well and sleeper shaytan hadiths, the dream-ruling and
Prophet-dream reports, the qareen records, Harut/Marut/Labid/Balam person promotions,
the muezzin adhan witness, and the wave-14/16/17 person and event tagging sweeps). A
keyword audit over the whole `data/passage/` corpus confirmed the explicit
shaytan/jinn/dream/angel material of the current harvest is surfaced; what remains is
tracked in the spec's §12 — human review of draft records, the production acceptance
run, re-running the mentions harvester after each future book harvest, and manual
story waves only when a newly harvested book adds named encounters. See
`docs/engineering/25-jinn-devils-requirements.md` §12 for the authoritative remaining-work
list.
