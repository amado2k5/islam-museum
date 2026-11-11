# Plan 35 — Dream Browser (متصفح الأحلام)

_Requested by the founder 10 November 2026: "start working on متصفح الأحلام where it should list all the mentioned and written dreams that are in quran, sunnah, any of seerah and any dreams mentioned and written in books that were harvested and any future harvested book if it has a dream should be viewable here. add a box for it on landing page and in navigation menus."_

## 1. What it is

A browser over the one graph that gathers every dream the museum's sources
mention: the Qur'anic verses of vision and dream, the dream hadiths of the
two Sahihs, the Muwatta and the Sunan, what the seerah books carry, and every
dream in every harvested book — plus the curated records on the science of
dreams itself. It follows the Ghayb/Nature architecture: passages are ordinary
graph nodes found at build time by a shared detector; curated records carry
the `dream-browser` tag; there is no side table and no second list.

The key difference from the tagged browsers: **passages are not tagged — they
are detected.** `scripts/dreams.ts` matches unambiguous Arabic dream
vocabulary (`في المنام`, `رؤيا`, `أحلام`, `أضغاث`, `معبّر`, the saw-in-sleep
formula `رأى … في النوم`, the `أريت` report formula) and English "dream"
against each passage's own text, search text, label and summary. A dream in a
book harvested next month appears here the day its passage record lands —
that is the founder's "any future harvested book" requirement, met by the
detector rather than by tagging.

## 2. Records

- 34 passage records detected in the current corpus: 15 Qur'an ayahs
  (`work/quran`), 18 sunnah reports (`work/muwatta-malik`, `sahih-al-bukhari`,
  `sahih-muslim`, `jami-al-tirmidhi`), 1 poetry passage.
- 4 new `concept` records, draft-tier with trilingual label, summary and
  prose: `concept/ahlam` (the umbrella — the three kinds of dream-talk),
  `concept/kitab-al-ruya` (the hadith genre), `concept/mubashshirat` (dreams
  as glad tidings), `concept/ahlam-al-anbiya` (the prophets' dreams).
- 5 existing concept records tagged in place: `ruya-fiqh`, `taabir-al-ruya`,
  `al-hulm`, `ihtilam`, `tafsir-al-ahlam-al-yawm`.
- `mentions → concept/ahlam` edges on all 15 Qur'an ayahs and all 18 sunnah
  passages (each with its own source; the poetry passage's harvested format
  carries no `relations` block); `mentions → concept/ahlam-al-anbiya`
  on the 8 narrative prophetic-dream ayahs.

## 3. Sections (the corpus, not a topic taxonomy)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر
الكتب · `concepts` علم الرؤيا — derived from each passage's work (genre
`hadith`/`sira` or `unit: hadith`, `work/quran` first) and from the
`dream-<section>` tag on curated records.

## 4. Pages

- `/[lang]/dreams/` — the home: lede, status count, method note, API link,
  section chips with counts, a client-side filter over trilingual labels,
  summaries, work names and text excerpts, and the cards. Header block
  carries `data-pagefind-body`; the lists are `data-pagefind-ignore`.
- Every card links to the **ordinary entity page** of its record
  (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`) — the passage
  pages already render matn, chain and citations.

## 5. Surface

- `scripts/dreams.ts` — the shared detector + corpus classifier + section
  tag reader (used by both `scripts/export-api.ts` and `site/src/lib/dreams.ts`).
- `site/src/lib/dreams.ts` (shared reads), `site/src/lib/nav.ts` (`dreams`
  key, `ready: true`), `site/src/pages/[lang]/dreams/index.astro`,
  `site/src/scripts/dreams-filter.ts`, `i18n/{ar,en,ur}.yaml` (`explore.pages.dreams`
  + `dreams:` block in the same commit), `/api/v1/dreams.json` via
  `FEATURE_EXPORTS`, documented in `docs/data/README.md`,
  `site/public/openapi/v1.json` and `llms.txt`. Landing card + Explore menu
  entry via `explorePages`. Register rows in `docs/site/browsers.md`, plan
  index, `docs/agents/lanes.md` (`dreams` lane), `docs/status.md`, `CANARY.md`.
- `docs/engineering/23-dream-browser-requirements.md` — the requirements and
  production checklist for later validation.

## 6. Detection rules (what counts as a dream)

In scope: true dream reports and mentions — `رؤيا`, `الرؤيا`, `منام`,
`أحلام`, `أضغاث أحلام`, `حديث نفس`, `معبّر`/`مؤول`/`تؤل`, the
saw-in-sleep formulas, `أريت` ("I was shown"), and English "dream" in the
museum's own translations. Standalone «تعبير» is out: it means "expression"
(`تعبيراً عما رآه`, Muwatta 1:187) and every genuine interpretation passage
carries رؤيا/أحلام/منام anyway.

Out of scope (verified false positives): waking sight (`أرى في نافذة`),
the vision of God (`رؤية`), similes (`كأنه`, `كأني`, `فكأنما`), the
bird-brains insult (`أحلام العصافير` — excluded by phrase and by the
`DREAM_EXCLUDE` escape hatch), forbearance (`حلم` alone), glad tidings
without dreams (`تبشّر`), and poetic metaphor unless the poem literally
reports a dream.

## 7. Status

Built 10 November 2026: 34 detected passages + 9 tagged concepts = 43 items
in `/api/v1/dreams.json` (15 quran, 18 sunnah, 1 books, 9 concepts; seerah
empty until seerah passages are harvested), the `/[lang]/dreams/` page in
three languages, the landing card and Explore menu entry, full API docs.
New records are draft-tier until a human reads them; nothing goes live
until the founder deploys. Future enrichment waves: seerah passages as they
are harvested, `mentions` edges on more hadith passages, and any new dream
book that enters the corpus.
