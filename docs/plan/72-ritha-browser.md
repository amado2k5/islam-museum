# 72. Elegy and Death-Announcement Browser — متصفح أشهر ما قيل في الرثاء والنعي

A build-time browser over the one graph for the most famous words said in elegy (الرثاء) and in announcing a death (النعي), with the condolences (التعزية) and the reports of weeping and wailing (البكاء والنياحة) that surround them — in the Qur'an, the Sunnah, the seerah, the reports of the Companions and the Successors and every harvested book. Requested by the founder on 20 November 2026.

## What it is

- **Detector** `scripts/ritha.ts`: a guarded Arabic lexicon over passage text — the elegy words (رثاء، مرثية، يرثي), the announcement words (نعى، ينعى، النعي، الناعي), condolence (تعزية، عزّى), fixed formulas (the istirja', «إن لله ما أخذ وله ما أعطى», «الصبر عند الصدمة الأولى», «اللهم أجرني في مصيبتي», «وا أبتاه», the Najashi and Ja'far's-family reports), wailing (نياحة، لطم الخدود، شق الجيوب) and weeping only beside a death. Qur'an verses come from a reviewed table, never a lexicon. Out: «نعت» (description), «عزاه إلى» (source attribution), «ورثه» (inheritance), weeping out of awe of God. Four kinds: `ritha`, `nay`, `taziya`, `bukaa`.
- **Corpus sections** quran / sunnah / seerah / books / curated, classified from the work's genre and unit; a book harvested later lands automatically.
- **Page** `/[lang]/ritha/`: a black-edged death-notice frame, the four mourning banners (`sig/RithaDoors.astro`), the famous formulas, kind chips, filter and the corpus sections, paged.
- **Harvesters** `scripts/harvest-ritha-hadithapi.ts` (the seven hadith-api Arabic editions) and `scripts/harvest-ritha-ocr.ts` (OCR'd books, 40-word excerpts, never a verse); both write five-language records.
- **Curated spine** tagged `ritha-browser` + `ritha-kind-<kind>`: the new umbrella `concept/ritha-wal-nay` with full prose in five languages, and nineteen existing records tagged in place (the fiqh concepts of ritha', na'y, ta'ziya, niyaha and nadb; the events of the Prophet's grief for Ja'far, the death of Ibrahim and of the Prophet; the elegy works of Hassan, Ka'b ibn Malik and Labid).
- **Surface**: Explore menu under texts, landing card, `browser-registry`, `/api/v1/ritha.json`, OpenAPI, `llms.txt`.
- **Spec**: `docs/engineering/64-ritha-browser-requirements.md` keeps the founder's brief for production acceptance testing.

## Status (20 November 2026, `npx tsx scripts/ritha-audit.ts`)

607 records: 33 Qur'an verses, 268 Sunnah reports, 52 seerah excerpts, 233 excerpts from other books and 21 curated records; by kind 236 elegy, 171 death announcement, 98 condolence, 102 weeping and wailing. Of these, 395 passages were harvested on 20 November 2026 (74 hadith-api reports, 321 OCR excerpts from 38 books). On 20 November 2026 the work records of Siyar A'lam al-Nubala' and Tarikh al-Islam were added and 80 excerpts harvested from them. Not yet done: more hadith books as the Hadith Library lands, and more curated named elegies (al-Khansa' for Sakhr, Labid for Arbad, Abu Dhu'ayb's ode) as their records are built.
