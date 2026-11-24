# 68. Tajwid and Tilawah Browser («متصفح تجويد وتلاوة القرآن») — original requirements and acceptance spec

**Status:** built 23 November 2026, awaiting merge and the founder's deploy and production validation · **Lane:** `tajwid` · **Plan:** `docs/plan/76-tajwid-tilawah-browser.md` · **Shipped:** `/[lang]/tajwid/`, `/api/v1/tajwid.json`, `sig/TajwidMap.astro`

This page keeps the founder's request as he gave it, the requirements read out of it, and tests an agent can run against production. It is the reference for any later check of the feature.

## The founder's original brief (23 November 2026, in chat; mixed Arabic and English, kept in his words, shortened only where he repeated a phrase)

> Use microsd instead of Mac main drive. Get latest from main, clone the repo to a separate folder then start working on **«متصفح تجويد وتلاوة القرآن»** where it should list all the mentioned and written «تجويد وتلاوة القرآن» that are in quran, seerah, sunna, tabi3een stories, quotes, mentioned and written in books that were harvested and any future harvested book if it has a «تجويد وتلاوة القرآن» should be viewable here. Add a box for it on landing page and in navigation menus. Make sure this is done end to end and full detailed proses and make it ready for production at the end of this.
>
> This is only about «تجويد وتلاوة القرآن» and everything mentioned about «تجويد وتلاوة القرآن» anywhere in any of the sunni books or quran or sunna or sera. Find all the instances where «تجويد وتلاوة القرآن» were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes, details.
>
> Also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production.
>
> You can use mac browser to browse to any web page, to get any information or download any books, you can use mac apple vision to OCR and then harvest those OCRd books or you can find any other online website that you can decide whether or not can be authentic and trusted as a source and get from it information to fully enrich and fill detailed proses.
>
> When context is tight, just commit and push and continue. Do not wait for build/test or ci. Make the changes in all the website languages. Make the browser/explorer for this have a unique UI that is relevant to its content, similar to how unique all the other browser/explorers are on the website. In the end commit, push, raise PR and merge it. Then delete all the files and folder related to this work from the microsd.

## Requirements

- **TJ-R1 — One browser, one graph.** `/[lang]/tajwid/` lists records of the one graph, computed at build time by `scripts/tajwid.ts`. No side table, no page-only dataset.
- **TJ-R2 — The Qur'an on recitation.** Every ayah whose wording speaks of reciting the Qur'an enters only through the reviewed table `TAJWID_QURAN_REFS` (three groups: the measure of recitation — tartil; the etiquette of reciting and hearing — adab; the recitation taught and heard — taalim), shown in mushaf order with its text from the frozen record and a link to its verse page. Verse text is never typed.
- **TJ-R3 — Detection in every harvested text.** A guarded Arabic lexicon (after `tajwidFold` removes vowel marks and joins the alef forms) plus English patterns match each non-Qur'an passage's `text`, `text_search`, Arabic label/summary and English fields, in seven topic families: tartil, adab, ahkam, qurra, mutun, maqamat, taalim. `TAJWID_EXCLUDE` is the curated escape hatch for false positives.
- **TJ-R4 — Future books.** A passage of a book harvested after this date appears on the next build with no code change and no tagging, in the corpus its work's genre gives it: `quran`, `sunnah` (genre `hadith` or unit `hadith`), `seerah` (genre `sira`), `tafsir` (genre `tafsir`), else `books`.
- **TJ-R5 — Curated records.** Records tagged `tajwid-browser` plus one `tajwid-<section>` tag join the curated chapters: `ahkam`, `adab`, `taalim`, `qurra`, `mutun`, `maqamat`. A record without a section tag falls into `ahkam`.
- **TJ-R6 — Full prose.** Every new curated record has detailed prose, written in Arabic first, with its sources listed and cited in the text.
- **TJ-R7 — Seven languages.** The page, the landing card, the Explore entry, every interface string, and every new record's label, summary and prose ship in Arabic, English, Urdu, French, Spanish, Turkish and Indonesian.
- **TJ-R8 — Unique UI.** `sig/TajwidMap.astro` («خريطة مخارج الحروف»): the map of the seventeen makharij in five regions from the Jazariyya — throat, tongue, lips, the empty mouth and the nose — each letter placed at its makhraj with the chapter's counts; the verse strip; the corpus and curated sections; readable without JavaScript.
- **TJ-R9 — Discovery.** Landing card, Explore menu entry (group `texts`), the row in `docs/site/browsers.md` and in `docs/site/signature-views.md`.
- **TJ-R10 — API.** `/api/v1/tajwid.json` with `section` and `topics` per item, documented in `site/public/openapi/v1.json` (operation `getTajwid`), `llms.txt` and `docs/data/README.md`.
- **TJ-R11 — Search.** The landing header, the signature view's title and each chapter heading sit inside `data-pagefind-body`; the long lists carry `data-pagefind-ignore`.
- **TJ-R12 — Never a dead end.** Every card links to the record's ordinary entity page.
- **TJ-R13 — Sources and safety.** No honorifics typed; no Qur'an text typed; every record cites defined sources; nothing from or about a blocked organisation; weak or disputed reports labelled as such where the source grades them.
- **TJ-R14 — Harvest.** The public-domain teaching mutun are harvested as passage records with `ref` per chapter, machine-readable provenance in all seven languages, and rows in `docs/library/harvest-register.yaml`. Done in this run: Tuhfat al-Atfal (8 chapters, 61 bayts) and al-Muqaddima al-Jazariyya (16 chapters, 107 bayts) from Arabic Wikisource (CC BY-SA 4.0).
- **TJ-R15 — Tests.** `scripts/features-api.test.ts` lists `tajwid.json` among the feature exports and covers the verse table, the lexicon, the corpora and the sections.

## Acceptance tests (production)

1. `/ar/tajwid/`, `/en/tajwid/`, `/ur/tajwid/`, `/fr/tajwid/`, `/es/tajwid/`, `/tr/tajwid/` and `/id/tajwid/` return 200 and show the title, lede, status line, makhraj map and chapter titles in that language.
2. With JavaScript off, the whole page is readable: the map is inline SVG and every list is in the HTML.
3. The Qur'an strip holds exactly the tabled verses — among them 73:4 («ورتل القرآن ترتيلا»), 25:32, 2:121, 75:16–19, 7:204, 16:98, 96:1–5, 62:2 — each linking to `/[lang]/passage/quran-<sura>-<aya>/`.
4. `GET /api/v1/tajwid.json` returns `feature: "tajwid-browser"` and items each carrying `section` and `topics`; the tabled verses carry `section: "quran"`; the «خيركم من تعلم القرآن وعلمه» hadith carries `section: "sunnah"` and `topics: ["taalim"]`.
5. The makhraj map shows five regions and the letters of each, and links to `work/al-jazariyya` and `person/ibn-al-jazari`.
6. The curated chapters include `concept/tajwid` (ahkam), `concept/tartil` (ahkam, topic tartil), `practice/tajwid` and `practice/sujud-tilawa` (adab), `work/al-jazariyya`, `work/tuhfat-al-atfal`, `work/al-shatibiyya`, `work/al-nashr-fi-al-qiraat-al-ashr`, `work/tayyibat-al-nashr`, `work/ghayat-al-nihaya-fi-tabaqat-al-qurra` (mutun) and `person/ibn-al-jazari`, `person/al-shatibi`, `person/abu-amr-al-dani`, `person/ubayy-ibn-kab`, `person/musab-ibn-umayr`, `person/al-bara-ibn-azib`, `person/ubada-ibn-al-samit` (qurra / taalim).
7. The harvested chapters `passage/tuhfat-atfal-b01-05` through `b58-61` and `passage/jazariyya-muqaddima` through `jazariyya-khatima` appear under `books` and open with their matn text and a sources list citing `source/ar-wikisource`.
8. A passage that only holds a bare «قرأ» ("he read") in ordinary prose is not listed.
9. The home page shows the browser's card in the Explore section, and the Explore menu lists it under the texts group, in all seven languages.
10. `/api/v1/tajwid.json` is in `/openapi/v1.json` (operation `getTajwid`) and in `/llms.txt`.
11. After any later harvest that adds a passage containing «أحكام التجويد», the count in the status line rises on the next build with no code change.

## What this build does not claim

- The detected passages are not read one by one; a false positive goes on record in `TAJWID_EXCLUDE` when found.
- The Wikisource transcriptions are copied verbatim but not checked against a printed edition; each passage record says so.
- The Shatibiyya and Tayyibat al-Nashr are listed as `work` records but their matns are not yet harvested.
- No human has read the new prose, the harvested bayts or their translations.
