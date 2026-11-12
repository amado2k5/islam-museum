# Usra Browser — Family and Marriages (متصفح الأسرة والزيجات)

Plan 54 · requested 12 Nov 2026 · built 12 Nov 2026 · lane `usra` · spec `docs/engineering/42-usra-browser-requirements.md`

## What it is

A browser over the one graph listing everything the museum's sources mention
about:

- the most famous marriages in Islam (الزيجات الأشهر في الإسلام),
- Muslim families (أسر المسلمين),
- the details of their dwellings (تفاصيل مساكنهم),
- their livelihood (ومعاشهم),
- the details of their daily life (وتفاصيل عن حياتهم اليومية),
- and their social customs (وعاداتهم الاجتماعية)

in the Qur'an, the Sunnah and hadith, the seerah, the reports of the Companions
and Tabi'in, quotations, and every harvested book — present and future.

## How it works

- `scripts/usra.ts` — a guarded Arabic lexicon in six topical families:
  `zawaj` (marriage, proposal, mahr, walima), `usra` (family, children,
  parents, descendants), `maskan` (dwellings, houses, rooms, household),
  `maisha` (livelihood, maintenance, spending, earning), `yawmi` (daily
  life, sleep, eating, waking) and `adat` (customs, hospitality, gifts,
  neighbours, greeting, isti'dhan).
- Gating: «زواج/زوج» count only beside a marital collocation with the matched
  token excluded from its own window (so «أزواج» meaning pairs/kinds drops
  out); «خطبة» requires marriage context (Friday-sermon matns drop out);
  nafaqa-verbs in divine voice («أنفق عليك») are excluded; publisher «دار»
  names and verified false positives drop out by id. ≈756 passages at build
  time: 344 quran, 225 sunnah, 25 seerah, 162 books. A book harvested later
  brings its family-life mentions automatically.
- Corpus sections: `quran`, `sunnah`, `seerah`, `books`, `curated`; topic
  chips per family. Famous marriages read the graph's own
  `spouse_of`/`child_of`/`parent_of` edges plus `event/marriage-of-fatima-and-ali`.
- Curated records carry `usra-browser` (plus `usra-marriages`, `usra-family`,
  `usra-homes`, `usra-livelihood`, `usra-daily`, `usra-customs` section tags).

## Records

- 31 existing records tagged in place: `practice/nikah`, `practice/mahr`,
  `practice/walima`, `practice/aqiqa`, `practice/aqiqah`, `practice/tahnik`,
  `practice/khitan`, `practice/ikram-al-dayf`, `practice/adab-al-akl`,
  `practice/adab-al-majlis`, `practice/greeting-salam`,
  `practice/birr-al-walidayn`, `practice/kafalat-al-yatim`;
  `concept/mahr`, `concept/mahram`, `concept/jahili-marriage-forms`,
  `concept/shighar-exchange-marriage`, `concept/taadud-al-zawajat`,
  `concept/tazwij-marriage-contracting`, `concept/walima-fiqh`,
  `concept/nikah-al-amah`, `concept/nikah-munhi-anhu`, `concept/adl-nikah`,
  `concept/anat-marriage-slave`, `concept/jiwar`, `concept/kiswa`,
  `concept/al-muasharah-bil-maruf`, `concept/hadiyya-fiqh`, `concept/aqiqa`,
  `concept/nikah-fiqh`; `event/marriage-of-fatima-and-ali`.
- 5 new cited `concept` seeds: `usra`, `maskan`, `maisha`, `istidhan`,
  `diyafa` — trilingual label/summary/prose, cited to the Tanzil Qur'an,
  the two Sahihs, al-Adab al-Mufrad and the Kuwaiti Fiqh Encyclopaedia;
  `based_on` edges to the naming ayahs (16:72, 16:80, 24:58–59, 30:21, 4:34).
  All `status.review: draft` until a human reads them.

## Ship list

- `site/src/lib/usra.ts`, `site/src/pages/[lang]/usra/index.astro`,
  `site/src/scripts/usra-filter.ts`; trilingual `usra:` i18n blocks;
  Explore-menu entry and landing card.
- `/api/v1/usra.json` (section, `usra_kind`, `topics`, `signals`, work, ref,
  edges); documented in `docs/data/README.md`, `site/public/openapi/v1.json`
  and `llms.txt`; register `docs/site/browsers.md`; lanes; status; CANARY.

## Next waves

- More family-life concepts (hijra households, nursing/raḍāʿa, khulʿ, idda)
  as cited drafts; deeper Companion/Tabi'in household anecdote mining;
  seerah/books fill automatically as those corpora are harvested;
  human read promotes drafts.
