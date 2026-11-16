# Bunuwwa Browser — Sonhood and Daughterhood in Islam (متصفح البنوة في الإسلام)

Plan 63 · requested 16 Nov 2026 · built 16 Nov 2026 · lane `bunuwwa` · spec `docs/engineering/55-bunuwwa-browser-requirements.md`

## What it is

A browser over the one graph listing everything the museum's sources mention
about sonhood and daughterhood (البنوة) — sons, daughters, offspring and the
whole filial bond — in the Qur'an, the Sunnah and hadith, the seerah, the
reports and stories of the Companions and Tabi'in, quotations, and every
harvested book — present and future.

## How it works

- `scripts/bunuwwa.ts` — a guarded Arabic lexicon in six topical families:
  `banun` (sons and daughters; possessed forms of ابن/ابنة/ولد plus the
  plurals, «يا بني», الأنثى, الموءودة), `dhurriyya` (ذرية، نسل، عقب، بني
  إسرائيل، بني آدم), `birr` (الوالدين، بر الوالدين، العقوق، «لا تقل لهما
  أف»، «اخفض جناح الذل»), `yatim` (يتيم، يتامى، رضاعة، فطام، حمل),
  `huquq` (حضانة، عقيقة، تحنيك، تسمية، «للذكر مثل حظ الأنثيين»، ميراث
  gated on children vocabulary) and `qisas` (غلام، لقمان، الذبيح، ابنا آدم).
- Gating: bare «ابن» never counts — it stands in every isnad and
  patronymic chain — only possessed relational forms (ابنه، ابنتها، ابني…)
  do; «ميراث» counts only in a 40-character window with children words;
  verified false positives are excluded by id. A book harvested later
  brings its filial mentions automatically.
- Corpus sections: `quran`, `sunnah`, `seerah`, `books`, `curated`; topic
  chips per family. The famous parents and children read the graph's own
  `child_of` edges where an endpoint carries `bunuwwa-browser`.
- Curated records carry `bunuwwa-browser` (plus `bunuwwa-concepts`).

## Records

- 16 existing records tagged in place: `practice/birr-al-walidayn`,
  `practice/kafalat-al-yatim`, `practice/aqiqa`, `practice/aqiqah`,
  `practice/tahnik`; `concept/birr`, `concept/huquq-al-walidayn`,
  `concept/uquq-al-walidayn`, `concept/huquq-al-abna`, `concept/yatim-fiqh`,
  `concept/wilayat-al-mal-al-yatim`, `concept/aqiqa`,
  `concept/hadanah-custody`, `concept/nasl`, `concept/walad-fiqh`;
  `event/counsels-of-luqman-to-his-son`.
- 19 famous parents and children tagged in place for the `child_of`
  section: `person/{adam,nuh,ibrahim,lut,ishaq,yaqub,zakariyya,
  imran-father-of-maryam,luqman-al-akbar,muhammad,ismail,yusuf,maryam,
  fatima,hasan-ibn-ali,husayn-ibn-ali,zaynab-bint-muhammad,
  ruqayya-bint-muhammad,umm-kulthum-bint-muhammad,abdullah-ibn-muhammad,
  ibrahim-ibn-muhammad}`.
- 4 new cited `concept` seeds: `bunuwwa`, `radaa`, `mawuuda`, `dhurriyya`
  — trilingual label/summary/prose, cited to the Tanzil Qur'an, the two
  Sahihs and the Kuwaiti Fiqh Encyclopaedia; `based_on` edges to the
  naming ayahs (17:23, 31:14, 4:36, 46:15, 2:233, 4:23, 81:8–9,
  16:58–59, 3:34, 3:38, 8:28, 25:74). All `status.review: draft`.

## Site surface

- `site/src/lib/bunuwwa.ts` — `bunuwwaItems`, `bunuwwaChildren`
  (child_of pairs with a tagged endpoint).
- `site/src/pages/[lang]/bunuwwa/[...page].astro` — trilingual page,
  signature view `sig/BunuwwaLines.astro` (a ruled line per topic, a disc
  per corpus section), `scripts/bunuwwa-filter.ts` client filter.
- Explore-menu entry (`people` group) and landing card, all three
  languages in the same commit.
- `/api/v1/bunuwwa.json` (export-api.ts) — section, topics, signals,
  work, ref, excerpt, edges; openapi + llms.txt + `docs/data/README.md`.

## What remains

- Seerah and book sections fill as those corpora are harvested; deeper
  Companion/Tabi'i filial reports; human read of the draft records; the
  `BUNUWWA_EXCLUDE` list grows as false positives are verified.
