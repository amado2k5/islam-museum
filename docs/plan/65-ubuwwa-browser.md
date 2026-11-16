# Ubuwwa Browser — Fatherhood in Islam (متصفح الأبوة في الإسلام)

Plan 65 · requested 16 Nov 2026 (founder, in chat — the approved proposal) · built 16 Nov 2026 · spec `docs/engineering/57-ubuwwa-browser-requirements.md`

## What it is

A browser over the one graph listing everything the museum's sources mention
about the father and fatherhood in Islam (الأب والأبوة في الإسلام):

- the fathers of the Qur'an — Ibrahim and his du'a, Ya'qub and Yusuf,
  Luqman's counsel, Zakariyya's prayer, the house of 'Imran;
- dutifulness to the parents (بر الوالدين) and the warning of 'uquq;
- the Prophet as a father, and the fathers of the Companions and the Tabi'in;
- paternity and lineage (النسب والانتساب);
- the orphan whose father is lost (اليتيم);

in the Qur'an, the Sunnah and hadith, the seerah, the reports of the
Companions and Tabi'in, quotations, and every harvested book — present and
future.

## How it works

- `scripts/ubuwwa.ts` — a guarded Arabic lexicon in five topical families:
  `ab` (the father and fatherhood), `birr` (dutifulness and disobedience to
  the parents), `tarbiyya` (raising, counsel and the father's testament),
  `nasab` (paternity and lineage) and `yatm` (the orphan).
- Gating: the kunya «أبو فلان» names a man and reports no fatherhood, so
  bare «أبو» never counts — only possessed, plural and vocative father forms
  («أبوه»، «أبيه»، «آباء»، «يا أبت»، «والده»); child vocabulary («ولده»،
  «أولاده»، «يا بني») counts only beside a father word in the same ±40-char
  window (God's «يا بني آدم» drops out); «بر» counts only beside the
  parents; verified false positives are excluded by id.
- Corpus sections: `quran`, `sunnah`, `seerah`, `books`, `curated`; topic
  chips per family. The famous fathers read the graph's own `parent_of` and
  `child_of` edges — a recorded mother never enters the fathers list.
- Curated records carry `ubuwwa-browser` (plus `ubuwwa-<section>` or
  `ubuwwa-curated` section tags where a corpus applies). A book harvested
  later brings its fatherhood mentions automatically.

## Records

- New cited `concept` seed: `ubuwwa` — trilingual label/summary/prose,
  cited to Tanzil, the two Sahihs and al-Adab al-Mufrad, `based_on` edges to
  the naming ayahs (17:23, 31:13, 46:15), `status.review: published` per
  the founder's 15 Nov 2026 ruling (dec-20261115-286).
- Existing records tagged `ubuwwa-browser` in place: `concept/huquq-al-walidayn`,
  `concept/huquq-al-abna`, `concept/aqiqa`, `concept/hadanah-custody`,
  `concept/ansab`, `concept/intisab`, `concept/uquq-al-walidayn`,
  `concept/yatim-fiqh`, `concept/wilayat-al-mal-al-yatim`,
  `practice/birr-al-walidayn`, `practice/kafalat-al-yatim`, `practice/aqiqa`,
  `practice/aqiqah`, `practice/tahnik`.

## Ship list

- `scripts/ubuwwa.ts`, `site/src/lib/ubuwwa.ts`,
  `site/src/pages/[lang]/ubuwwa/[...page].astro`,
  `site/src/scripts/ubuwwa-filter.ts`; trilingual `ubuwwa:` i18n blocks and
  `explore.pages.ubuwwa` entries; Explore-menu `people` group entry and
  landing card (SVG motif + accent).
- `/api/v1/ubuwwa.json` (section, topics, signals, work, ref); documented in
  `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`;
  registered in `site/src/lib/browser-registry.ts`, `docs/site/browsers.md`,
  `docs/agents/lanes.md`, `docs/status.md` and `CANARY.md`; expected filename
  added to `scripts/features-api.test.ts`.

## Next waves

- Deeper Companion/Tabi'in father-and-child anecdote mining; a dedicated
  fatherhood source book (al-Birr wa'l-ṣila of Ibn al-Jawzi or the birr
  chapters of al-Adab al-Mufrad) harvested when a verifiable copy is
  processed; seerah/books sections fill automatically as those corpora grow;
  human read of the AI prose.
