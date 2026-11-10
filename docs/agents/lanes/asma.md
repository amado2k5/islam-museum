# Lane: `asma` — the Asma ul Husna Browser

Plan: [`docs/plan/29-asma-browser.md`](../../plan/29-asma-browser.md) (approved by the founder in chat, 9 November 2026).
Progress file: [`docs/delegation/asma-progress.md`](../../delegation/asma-progress.md).

## Scope

- The 99 `concept/asma-*` records of kind `divine-name` (Tirmidhi enumeration, `order` 1–99), each `part_of concept/asma-allah-al-husna`, trilingual label and summary, `name_meta` (transliteration, root, enumeration).
- Edges: `mentions` from `passage/*` (quran and hadith) and `event/*` (seerah), `exemplifies` from `person/*` (sahaba and saliheen), `related_to` between paired names — each edge citing a source.
- The browser pages `/[lang]/asma/` and `/[lang]/asma/<slug>/`, `site/src/lib/asma.ts`, the `asma:` i18n blocks, `/api/v1/asma.json`, and the register rows (browsers.md, status.md, plan index).
- Trilingual story prose `content/{ar,en,ur}/concept/asma-*.md` in waves of ≤ 25.

## Done (9 November 2026)

- Phase 1: `divine-name` kind, `order` + `name_meta` schema fields, validator rule; the 99 records in 4 commits.
- Phase 2 (seed): verified `mentions` edges — the Hashr close 59:22–24 (12 names), ayat al-kursi 2:255 (4 names), Fatiha 1:1 and 1:3, al-Isra 17:110, al-Aziz/al-Hakim at 59:1; Muslim 2677 → the umbrella concept.
- Phase 3: browser pages, filter script, i18n ar/en/ur, `/api/v1/asma.json` export + its three doc rows, explore entry and landing card (auto from `explorePages`).

## Next

- Grow edges per name against cited occurrences (tafsir-backed where a story is told); sahaba/saliheen `exemplifies` edges where a cited story exists — never on a guess.
- Phase 4: curated trilingual story prose per name, batches ≤ 25, starting with the names with the densest neighbourhoods; spot-checks logged in the progress file.
- `related_to` pairing edges (الرحمن/الرحيم، الأول/الآخر، الظاهر/الباطن، …).
- Ibn Majah enumeration flags (`name_meta.enumeration`) where the list differs.

Requirements: `docs/engineering/19-asma-browser-requirements.md` (ids ASMA-R01–R44, production checklist §7).

## Rules to remember

- Qur'an text never typed; reference `[[passage/quran-<s>-<a>|label]]`. No honorifics. Arabic parentheses isolated (U+2066/U+2069). AI prose stays `status.review: draft` with provenance. ≤ 25 entities per commit; CANARY entry each commit.
