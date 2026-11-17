# 69. Munazarat Browser — متصفح المناظرات

A build-time browser over the one graph for every debate and disputation the museum's sources carry — between Islam and the other religions and inside the ummah — «حجة بالحجة ودليل بالدليل وتاريخ بالتاريخ وكلمة بالكلمة».

## What it is

- **Detector** `scripts/munazarat.ts`: a guarded Arabic lexicon over passage text — مناظرة nouns and مُناظَر verbs, the جدال/محاجّة/احتجاج/خصومة family, and the مباهلة/نبتهل anchors — returning matched signals, a `munazarat_kind` (debate/mention) and an `opponent` class (scriptuaries/polytheists/intra/other). Guarded exclusions drop the li'an oath, حَجّ pilgrimage and braid senses. Any future harvested book joins automatically.
- **Corpus sections** quran / sunnah / seerah / books / curated, classified from work genre and unit.
- **Page** `/[lang]/munazarat/` (`site/src/pages/[lang]/munazarat/[...page].astro`): localized lede, method note, opponent chips, corpus sections, client filter, pagination; the signature view `sig/MunazaratFloor.astro` («حلبة المناظرة») draws a three-column flow opponent → kind → corpus.
- **Curated spine** (tagged `munazarat-browser` + `munazarat-<opponent>`): three new records — `event/mubahala-of-najran`, `event/ibn-abbas-khawarij-debate`, `event/jafar-debate-at-najashi-court` — each with full trilingual prose citing ibn-hisham-sira, sahih-muslim, musnad-ahmad and al-bidaya-wal-nihaya; plus eight existing events tagged in place (umar-ii-debate-with-kharijites, khatib-tripoli-munazara-447, yahya-zubayri-mubahala, delegation-of-najran, arbitration-of-siffin, mihna-of-the-quran, ibn-al-mulaqqin-mihna-780, mihnat-ghulam-khalil).
- **Surface**: Explore menu under texts, landing explorer card, `browser-registry`, `/api/v1/munazarat.json`, OpenAPI, `llms.txt`, `docs/data/README.md`.
- **Spec**: `docs/engineering/61-munazarat-browser-requirements.md` keeps the founder's brief verbatim for production acceptance testing.

## Status

Built on branch `munazarat-browser` on the microSD clone; merged to `main`. The seerah section fills as seerah passages are harvested; more named debates (Baghdad kalam assemblies, the Mihna interrogations, Ibn Taymiyya's disputations, the modern debate tradition) are the standing enrichment direction.
