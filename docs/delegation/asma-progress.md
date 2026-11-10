# Asma ul Husna Browser — progress

Lane `asma` (`docs/agents/lanes/asma.md`); plan `docs/plan/29-asma-browser.md` approved 9 Nov 2026.

## 2026-11-09 — phases 1 to 3 (Devin, branch devin/asma-browser-proposal)

- Schema: `divine-name` kind on `concept`; `order` + `name_meta` (transliteration, root, enumeration) fields; validator requires order 1–99, enumeration and a source. `npm run schema` regenerated the class schemas (also picked up the pending `zahiri` tradition enum — generated files had drifted).
- Records: all 99 `concept/asma-*` in 4 batches of ≤ 25, trilingual label + summary, Tirmidhi order, `part_of` the umbrella, sources `jami-al-tirmidhi` + `jala-afham-ibn-qayyim`, all draft with provenance.
- Seed edges: `mentions` from quran-1-1, 1-3, 2-255, 17-110, 59-1, 59-22, 59-23, 59-24 (each edge verified against the passage's own Tanzil text) and from muslim-2677 to the umbrella.
- Browser: `site/src/lib/asma.ts`, `/[lang]/asma/` (numbered grid + vowel-insensitive filter via `scripts/asma-filter.ts`), `/[lang]/asma/<slug>/` (hero + grouped sections: Qur'an, hadith, seerah, sahaba, saliheen, paired names, prose, record link), `asma:` i18n in ar/en/ur, `explorePages` entry (menu + landing card auto), `/api/v1/asma.json` + docs/data README + openapi + llms.txt rows.

## Next

- Edge growth per name (only cited occurrences); `exemplifies` edges for sahaba/saliheen stories; `related_to` pairing edges; Ibn Majah `enumeration` flags where it differs.
- Phase 4 story prose waves: `content/{ar,en,ur}/concept/asma-*.md`, batches ≤ 25.
- Await: founder's go-live decision and deploy; checks (`npm run validate`, `npm test`, `npm run build`) before push.
