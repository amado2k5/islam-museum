# 76 — Tajwid and Tilawah Browser («متصفح تجويد وتلاوة القرآن»)

_Written 23 November 2026 on the founder's chat instruction of the same day. The request, kept in his words, the requirements read out of it and the production tests are in [`docs/engineering/68-tajwid-browser-requirements.md`](../engineering/68-tajwid-browser-requirements.md). Status: **built, awaiting merge and the founder's deploy**._

Gate labels (`docs/ai-change-gates.md` section 3): `non-impacting` for the records and the page; the change touches `site/src/lib/nav.ts` and `site/src/components/Landing.astro`, so the pull request is labelled `rewrites-all-pages`.

## 1. What the browser is

A front door over the one graph (`docs/site/browsers.md` section 1) for tajwid and tilawah — the recitation of the Qur'an, its measure, its rules and its etiquette, its melodies, its teachers and its teaching texts. Three layers:

1. **The Qur'an on its recitation.** The ayahs of the frozen Tanzil text whose wording speaks of reciting the Qur'an — the command «ورتل القرآن ترتيلا», the etiquette of the one who recites and the one who hears, and the recitation taught and heard — shown with their text from the frozen records, from a reviewed table in `scripts/tajwid.ts`.
2. **What the harvested texts say.** Every passage record (hadith, seerah, tafsir, history, letters, the tajwid books themselves) whose wording speaks of tajwid and tilawah, found at build time by a guarded lexicon over Arabic and English fields. A book harvested later adds its passages with no code change, filed by its work's genre into `quran`, `sunnah`, `seerah`, `tafsir` or `books`.
3. **Curated chapters.** Records tagged `tajwid-browser` + `tajwid-<section>`: `ahkam` (the rules: makharij, sifat, mudud, ghunna, qalqala, waqf), `adab` (the etiquette), `taalim` (the teaching and learning), `qurra` (the reciters and teachers), `mutun` (the teaching texts), `maqamat` (the melodies).

Route: `/[lang]/tajwid/`. API: `/api/v1/tajwid.json`. Signature view: `sig/TajwidMap.astro` («خريطة مخارج الحروف» — the map of the letters' articulation points, from the Jazariyya's count of seventeen makharij in five regions).

## 2. Method and sources

- **Reviewed verse table.** `TAJWID_QURAN_REFS` in `scripts/tajwid.ts`, in three groups: the measure of recitation (tartil), the etiquette of reciting and hearing (adab), the recitation taught and heard (taalim). A verse enters the page only through this table — no Qur'an text is ever typed.
- **Guarded lexicon.** One spelling fold (vowel marks and Qur'anic marks dropped, alef forms joined) over each passage's `text`, `text_search`, Arabic label and Arabic summary, plus the English fields; bare words that are false-positive prone are excluded from the patterns, and `TAJWID_EXCLUDE` is the escape hatch for anything a later audit flags.
- **Harvested mutun.** Tuhfat al-Atfal (61 bayts) and al-Muqaddima al-Jazariyya (107 bayts) were taken verbatim from their Arabic Wikisource pages (CC BY-SA 4.0; the authors died 1198 AH and 833 AH) and filed as `unit: other` passage records, one per chapter, tagged `tajwid-harvest-tuhfat` / `tajwid-harvest-jazariyya`, citing `source/ar-wikisource`. The register rows are in `docs/library/harvest-register.yaml`.
- **Voice.** Each ruling and judgement is attributed to its holder; the museum's voice gives no verdict.

## 3. What is not done

- No human has read the new records, the harvested bayts or their translations.
- The detected passages are not reviewed one by one; `TAJWID_EXCLUDE` is the place for a false positive when one is found.
- The Shatibiyya and Tayyibat al-Nashr were not harvested in this run (the Jazariyya and the Tuhfa cover the matn layer); they enter automatically the day their passages arrive, and the `mutun` chapter already lists their `work` records.
- The `maqamat` section rests on the records the graph holds; the debate over reciting with melodic modes belongs in curated prose, each view under its holder.

## 4. Next steps (lane `tajwid`)

1. A read of the detected passages, with exclusions recorded in `TAJWID_EXCLUDE`.
2. Harvest the Shatibiyya and Tayyibat al-Nashr from their Wikisource pages on the same pattern.
3. Curated records for the remaining ahkam chapters (each madd, the waqf signs of the mushaf), for the maqamat debate with its cited voices, and for the teaching line (katatib, ijaza, the ard).
4. A human read of all new prose and translations.
