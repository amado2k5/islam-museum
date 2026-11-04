# Canary — islam.museum release notes

The museum's public release notes: every change that lands on `main`, recorded in
reader's language in the same commit that makes the change. Newest release first.
The site build reads the version and date from the top block below and shows them
in the footer of every page and on the changelog page (`/{lang}/changelog/`).

Rules for every agent and contributor (`docs/engineering/15-release-notes-and-versioning.md`):
append your entry under the current version block, grouped by kind — Added, Changed,
Fixed, Removed, Performance, Tests, Data, Breaking, Rolled back. Write what changed
and why it matters, never a bare commit message. If your change bumps the version,
open a new block on top with the new version and today's date.

---

## v1.1.0 — 2026-11-03

### Data
- **Library harvest from the OCR'd books** (batch 1): 72 records written or enriched with full Arabic, English and Urdu prose from 6 books on the harvest drive (artandarchitectureofislamiccairo, fadail-sahaba-ahmad, khwarizmi-algebra, minhaj-sunna, nallino-al-battini-opus-astronomicium-pars-1-3-1899, tamhid-ibn-abd-al-barr); new records: 16 person, 10 source, 9 work, 6 concept, 6 question, 1 building, 1 place; 34 existing records enriched. Every fact cites the book's edition and page.
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 96).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 95).
- **Harvest drive: missing books acquired**: 22 books the library plans named but the drive lacked (among them Sunan Abi Dawud with al-Khattabi's Ma'alim, Hilyat al-Awliya', al-Muhalla, al-Khallal's al-Sunna, Ibn Khuzayma's Kitab al-Tawhid, al-Ash'ari's al-Ibana, Nuzhat al-Nazar, Irshad al-Fuhul, Ibn Nubata's sermons, Ibn Uthaymin's sermons, al-Jahiz's al-Hayawan, Uyun al-Akhbar, Ibn Hawqal and Ibn Hayyan) were downloaded from open archive.org items with checksums, OCR'd on the founder's Mac and queued for harvest; six new titles are added to the library canon (`books.yaml`).
- **Harvest drive OCR complete**: the last four library scans without text (the 1916–1929 Cairo printings of the Hamasa of Abu Tammam, the Mufaddaliyyat, al-Zawzani's commentary on the Mu'allaqat and al-Barquqi's commentary on the diwan of Hassan ibn Thabit) were read with Apple Vision, so every one of the 1,401 library PDFs now has page text for mining; the OCR status record and the harvest ledger are updated, and a new `lib-ocr-harvest` lane is registered for the 198 OCR'd books that no record cited yet.
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 94).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 93).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 92).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 91).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 90).
- **Persons**: 19 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 89).
- **Persons**: 21 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 88).
- **Persons**: 21 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 87).
- **Persons**: 21 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 86).
- **Persons**: 21 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 85).
- **Persons**: 20 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 84).
- **Persons**: 21 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 83).
- **Persons**: 21 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 82).
- **Persons**: 22 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 81).
- **Persons**: 22 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 80).
- **Persons**: 22 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 79).
- **Persons**: 22 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 78).
- **Persons**: 23 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 77).
- **Persons**: 22 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 76).
- **Persons**: 23 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 75).
- **Persons**: 23 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 74).
- **Persons**: 23 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 73).
- **Persons**: 24 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 72).
- **Persons**: 4 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 71).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 70).
- **Persons**: 2 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 69).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 68).
- **Persons**: 4 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 67).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 66).
- **Persons**: 19 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 65).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 64).
- **Persons**: 13 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 63).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 62).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 61).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 60).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 59).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 58).
- **Persons**: 24 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 57).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 56).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 55).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 54).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 53).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 52).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 51).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 50).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 49).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 48).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 47).
- **Persons**: 9 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 46).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 45).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 44).
- **Persons**: 24 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 43).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 42).
- **Persons**: 24 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 41).
- **Persons**: 25 more records with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 40).
- **People**: 25 more biographies with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep, batch 39).
- **People**: 25 more biographies with full Arabic, English and Urdu prose moved from draft to published (prose-fill sweep).
- **25 new contemporary biographies**: preachers, teachers and Qur'an reciters followed by millions — from Pakistan, Indonesia, Bangladesh, Turkey, Egypt and France — each with full Arabic, English and Urdu pages and sources.

### Added
- **Next forty Explorer stories shipped**: #3416 merges the forty person journeys after integrated validation, citation checks and all 318 tests pass; sixteen screened backdrops are already merged in #3414. Completion claims and lane records now name the actual merges. No production or UAT deployment was run.
- **Next forty Explorer journeys verified**: 270 chronological stops across existing cited events, with 120 Arabic/English/Urdu routes checked in the production build and browser. Sixteen new screened backdrops, merged separately in #3414, remove this batch's legacy illustration fallbacks; existing event-language gaps and reserved owner follow-ups remain explicit.
- **Next Timeline Explorer batch, final twenty person stories**: complete the forty-subject definitions and translated subject metadata. Owner-blocked Hamza and Usama proposals are deferred without changing their records or shared images; Abu Sa'id al-Khudri supplies the final slot.
- **Next Timeline Explorer batch, first twenty person stories**: prepare cited chronological journeys with Arabic, English and Urdu subject metadata, reusing existing events rather than inventing dates or links. The preceding forty-story batch is merged in #3400; the new batch retains explicit source-data and image-owner follow-ups.
- **Sixteen native Timeline Explorer backdrops**: eight new adult/kids pairs replace legacy record-illustration fallbacks with screened empty-place scenes. Existing shared images and record illustrations are preserved; these assets ship separately from the next forty stories.
- **Timeline Explorer verification**: the forty new stories pass the full local build and all 120 language-route browser checks; the authorized image correction is merged separately in #3398, resolving the earlier publication blocker. Existing event-language fallbacks and map-selector follow-ups are documented rather than claimed fixed.
- **Safer Timeline Explorer scenery**: ten new adult/kids backdrops override five legacy illustrated scenes, and five shared backdrops with figures are replaced by empty landscapes after explicit founder approval. All fifteen images were visually screened at full size; historical facts and site code are unchanged.
- **Developers page** (`/{lang}/developers/`, Arabic, English, Urdu): the museum's open data and API documented for libraries and builders — endpoints, the node/edge/record schema, worked examples with real responses, sample code, starter prompts for AI coding agents, and an honest list of what is not here yet.
- **Network page** (`/{lang}/network/`): the scholars, institutions and communities in conversation with the museum.
- **Canary release notes**: this file, the changelog page that renders it, and the site version now shown in the footer of every page — so any reader can watch the museum change and know exactly which version they are looking at.
- **A standing rule for every agent** (in the repo's `AGENTS.md`): anyone who changes anything in this repository records the change here in the same commit, then commits, opens a pull request and merges it — finished work is never left sitting locally.
- **Forty more Timeline Explorer stories**: follow twenty places and twenty people through 303 dated, cited stops drawn from existing museum records. Every new subject has Arabic, English and Urdu titles and summaries; individual event text retains the documented Arabic fallback where a translation is missing.

### Fixed
- **Shared Explorer image correction authorized**: five previously blocked backdrops now have screened, people-free replacements following explicit founder approval. The image batch ships separately from the forty new stories; historical dates, facts, relationships and UI code are unchanged.
- **Five Explorer fallback scenes**: ten new adult/kids landscape backdrops prevent five legacy record illustrations with figures from being selected at those stops. Every new image was inspected at full size; the legacy files and other owners' Explorer assets were left unchanged.

### Tests
- **Forty-story Explorer checkpoint**: all 120 built Arabic, English and Urdu routes have been checked in the browser, including desktop/mobile controls and the new Fadak kids backdrop. Local validation, citation checks, 318 tests and the complete site build pass; publication remains blocked by the five shared-image defects tracked in issue #3350.

### Data
- **Clearer subject metadata**: Urdu labels and summaries added to forty existing records, with recorded localization provenance. Missing provenance restored on seven places and one migration event without changing existing event dates or relationships.
- **Honest Explorer image status**: the forty-story batch remains unpublished pending replacement of five shared backdrops that contain figures. The owner request identifies each file and affected story; a prompt or an earlier screening claim is not treated as proof that an image is safe.

### Data
- **Two scholars' pages completed**: Fayz Kashani, the Safavid philosopher and traditionist, and Şeyhülislam Zekeriya Efendi now carry full sourced biographies in Arabic, English and Urdu — both were early draft cards that other pages already linked to.

---

## v1.0.2 — 2026-10-31

### Added
- **Disclaimer page** in all three editions, linked from the footer: what the museum is, how its content is gathered and checked, and the terms on which it is offered.
- **Raisely** added as a fifth voluntary support channel on the Support page.
- **Dataset archived on Zenodo** (27 Oct): the museum's CC0 dataset with a permanent DOI — 10.5281/zenodo.23692511 — so libraries and researchers can cite and keep it forever.

---

## v1.0.1 — 2026-10-17

### Added
- **Kids' wing** («جناح الصغار»): a Hudhud-guided children's wing — Word Garden, Prophet Quest, Kindness Quest, bedtime stories and a teacher's kit — in Arabic and English.

---

## v1.0.0 — 2026-10-11

### Added
- **Public launch of islam.museum**: an Arabic-first digital museum of Islamic history with an English edition, nine wings, and a sourced knowledge graph of people, places, buildings, objects, works, passages, concepts and events — published the same day the domain was registered.
