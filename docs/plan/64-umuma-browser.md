# Umuma Browser — Motherhood in Islam (متصفح الأمومة في الإسلام)

Plan 64 · requested 16 Nov 2026 · built 16 Nov 2026 · lane `umuma` · spec `docs/engineering/56-umuma-browser-requirements.md`

## What it is

A browser over the one graph listing everything the museum's sources mention
about motherhood in Islam (الأمومة في الإسلام):

- the mother and her standing (الأم ومكانتها),
- pregnancy (الحمل),
- childbirth (الولادة),
- nursing and milk-kinship (الرضاعة),
- the custody and raising of children (الحضانة والتربية),
- and dutifulness to parents — the mother first (بر الوالدين)

in the Qur'an, the Sunnah and hadith, the seerah, the reports of the Companions
and Tabi'in, quotations, and every harvested book — present and future.

## How it works

- `scripts/umuma.ts` — a guarded Arabic lexicon in six topical families:
  `umm` (the mother and her standing, أمهات المؤمنين), `haml` (pregnancy),
  `wilada` (childbirth, مخاض, نفاس), `radaa` (nursing, فطام, فصال),
  `tarbiya` (custody, raising, كفالة اليتيم) and `birr` (dutifulness to
  parents, صلة الرحم).
- Gating: bare «أم» counts only beside family vocabulary («أم القرى»,
  «أم الكتاب» and «أمة» excluded); «حمل» counts in the pregnancy sense only
  beside pregnancy vocabulary (carrying/transport excluded); «ولد» the boy
  is out and only the birth forms count; «بر» counts only beside parent
  vocabulary; verified false positives drop out by id. A book harvested
  later brings its motherhood mentions automatically.
- Corpus sections: `quran`, `sunnah`, `seerah`, `books`, `curated`; topic
  chips per family. Mothers on record read the graph's own `child_of` edges
  to female person records — no side list.
- Signature view `sig/UmumaLines.astro`: the six lines of motherhood — one
  ruled line per topic, a disc per corpus section sized by its record count,
  each disc a link; readable without JavaScript
  (`docs/site/signature-views.md` rules 1–6).
- Curated records carry `umuma-browser` (plus `umuma-quran`, `umuma-sunnah`,
  `umuma-seerah`, `umuma-books`, `umuma-curated` section tags).

## Records

- 20 existing records tagged in place: `concept/umm`,
  `concept/ummahat-al-muminin`, `concept/rada`, `concept/rada-suckling-fiqh`,
  `concept/istilad-umm-al-walad`; `practice/birr-al-walidayn`,
  `practice/aqiqa`, `practice/aqiqah`, `practice/kafalat-al-yatim`,
  `practice/tahnik`; `person/amina-bint-wahb`, `person/maryam`,
  `person/hajar`, `person/khadija`, `person/fatima`,
  `person/sumayya-bint-khayyat`, `person/halima-al-sadiyya`, `person/asiya`,
  `person/fatima-bint-asad`.
- 5 new cited `concept` seeds: `umuma`, `haml`, `wilada`, `hidana`,
  `birr-al-umm` — trilingual label/summary/prose, cited to the Tanzil
  Qur'an, the two Sahihs, the Muwatta, Sunan Abi Dawud and the Kuwaiti Fiqh
  Encyclopaedia; `based_on` edges to the naming ayahs (31:14, 46:15, 19:23).
  All `status.review: draft` until a human reads them.

## Ship list

- `site/src/lib/umuma.ts`, `site/src/pages/[lang]/umuma/[...page].astro`,
  `site/src/components/sig/UmumaLines.astro`,
  `site/src/scripts/umuma-filter.ts`; trilingual `umuma:` i18n blocks;
  Explore-menu entry and landing card.
- `/api/v1/umuma.json` (section, `topics`, `signals`, work, ref, edges);
  documented in `docs/data/README.md`, `site/public/openapi/v1.json` and
  `llms.txt`; register `docs/site/browsers.md`; lanes; status; CANARY.

## Next waves

- More motherhood concepts (nafaqa on the nursing mother, idda, milk-aunts,
  umm al-walad cases) as cited drafts; deeper Companion/Tabi'in mothers
  mining as seerah and biographical corpora fill; human read promotes
  drafts.
