# Ukhuwwa Browser — Brotherhood in Islam (متصفح الأخوة في الإسلام)

Plan 63 · requested 16 Nov 2026 · lane `ukhuwwa` · spec `docs/engineering/55-ukhuwwa-browser-requirements.md`

## What it is

A browser over the one graph listing everything the museum's sources mention
about brotherhood — including sisterhood — in Islam (الأخوة في الإسلام):

- brotherhood and sisterhood terms and affirmations (إخوة، أخ، أخت، إخوان),
- mu'akhat — the formal brothering of Muhajirun and Ansar and its echoes,
- love for God's sake and mutual love between believers (الحب في الله),
- the rights and duties brothers and sisters owe one another (حقوق الإخوة),
- altruism, aid and solidarity (الإيثار، النصرة، البنيان، الجسد الواحد),
- and the warnings against what breaks brotherhood — envy, mutual hatred,
  estrangement, bad suspicion, backbiting and tale-bearing — as the
  contrary of brotherhood counted part of its literature,

in the Qur'an, the Sunnah and hadith, the seerah, the reports of the
Companions and Tabi'in, quotations, and every harvested book — present and
future.

## How it works

- `scripts/ukhuwwa.ts` — a guarded Arabic lexicon in six topical families:
  `ikwha` (brother/sibling terms), `muakhat` (brothering, Muhajirun–Ansar
  pairing), `hubb` (love for God's sake, union of hearts), `huquq`
  (brother's rights, duties), `ithar` (altruism, aid, bunyan/jasad
  solidarity similes) and `tahdhir` (envy, hatred, estrangement, bad
  suspicion, ghiba/namima against a brother).
- Gating: «يؤثر» verbs count only beside «على» (the altruism reading);
  bare «أثرة» requires a brother word in context (the vocalized «أَثَارَة»
  = remnant normalizes to the same token, e.g. 46:4); «عضد/سند» matches
  only in the brother-collocation «أخاه عضداً/سنداً»; the drug name
  «دم الأخوين», publisher noise and verified false positives drop out by
  id in `UKHUWWA_EXCLUDE`. ≈444 passages at build time: 63 quran,
  252 sunnah, 16 seerah, 113 books. A book harvested later brings its
  brotherhood mentions automatically.
- Corpus sections: `quran`, `sunnah`, `seerah`, `books`, `curated`; topic
  chips per family. Brotherhood pairs read the graph's own `sibling_of`
  edges plus `event/brotherhood-of-muhajirun-and-ansar`.
- Curated records carry `ukhuwwa-browser` (concepts additionally
  `ukhuwwa-concepts`).

## Records

- 2 existing records tagged in place: `concept/ukhuwwa`,
  `event/brotherhood-of-muhajirun-and-ansar`.
- 5 new cited `concept` seeds: `muakhat`, `hubb-fi-allah`,
  `huquq-al-ikhwan`, `ithar`, `tabaghud-wa-qatia` — trilingual
  label/summary/prose, cited to Sahih al-Bukhari, Sahih Muslim, the
  Muwatta, Sunan Abi Dawud, al-Adab al-Mufrad and the Tanzil Qur'an;
  `related_to`/`based_on` edges to `concept/ukhuwwa` and the mu'akhat
  event. `status.review: published` per the founder's ruling
  dec-20261115-286 (defined sources cited on each record).

## Ship list

- `site/src/lib/ukhuwwa.ts`, `site/src/pages/[lang]/ukhuwwa/[...page].astro`,
  `site/src/scripts/ukhuwwa-filter.ts`,
  `site/src/components/sig/UkhuwwaBonds.astro` (signature view over
  `sibling_of` edges with text alternative); trilingual `ukhuwwa:` i18n
  blocks; Explore-menu entry and landing card.
- `/api/v1/ukhuwwa.json` (section, `topics`, `signals`, work, ref, edges);
  documented in `docs/data/README.md`, `site/public/openapi/v1.json` and
  `llms.txt`; register `docs/site/browsers.md`,
  `docs/site/signature-views.md`; lanes; status; CANARY.

## Verification record

- Detector sampled over the compiled graph (72,268 nodes): 444 records
  after false-positive fixes — 63 quran / 252 sunnah / 16 seerah /
  113 books; topics ikwha 333, tahdhir 59, hubb 42, huquq 21, ithar 39,
  muakhat 11. Fixes verified: «دم الأخوين» (drug name, Canon of
  Medicine), «عذابين» stray match, generic «يؤثر», «أَثَارَة» remnant
  (46:4), «عضد الدولة» proper noun. Quran anchors re-verified after
  gating: 3:103, 8:63, 49:10, 59:9.
- Quality gate (validate/test/build) waived by requester; not run.
  Recorded per the honest-status rule.

## Next waves

- More brotherhood concepts (ukht al-raḍāʿa, jiwar/al-jiran bonds,
  muwalat) as cited drafts; deeper Companion/Tabi'in anecdote mining;
  seerah/books fill automatically as those corpora are harvested;
  further harvesting via browser/OCR pipeline if the founder wants
  additional works ingested.
