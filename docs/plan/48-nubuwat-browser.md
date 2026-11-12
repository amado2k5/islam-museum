# Plan 48 — Nubuwat Browser (متصفح النبؤات وأسرار القرآن ومعجزاته)

_Requested by the founder: "megaplan — use microsd instead of Mac main drive, get
latest from main, clone the repo to a separate folder then start working on نبؤات
الرسول وأسرار وخبايا ومعجزات القران where it should list all the mentioned and
written نبؤات الرسول وأسرار وخبايا ومعجزات القران that are in quran, seerah,
sunna, tabi3een stories, quotes, mentioned and written in books that were
harvested and any future harvested book if it has a نبؤات الرسول وأسرار وخبايا
ومعجزات القران should be viewable here. add a box for it on landing page and
in navigation menus. make sure this is done end to end and full detailed
proses and make it ready for production at the end of this. this is only about
نبؤات الرسول وأسرار وخبايا ومعجزات القران and everything mentioned about نبؤات
الرسول وأسرار وخبايا ومعجزات القران anywhere in any of the sunni books or quran
or sunna or sera. find all the instances where نبؤات الرسول وأسرار وخبايا
ومعجزات القران were mentioned or part of quotes from quran, sunnah, Hadith,
seerah or from sahaba and tabi3een and add those stories, mentions, quotes,
details. also add this in engineering documents as the original requirements
to allow AI later on to test and validate it when it is in production."_

## 1. What it is

A browser over the one graph that gathers every prophecy of the Prophet, every
proof of prophethood, every secret and marvel of the Qur'an, every miracle of
the Prophet, every report of unseen knowledge and every eschatological
prediction the museum's sources carry: the Qur'anic announcements, the «من
بعدي» reports of the two Sahihs, the Muwatta and the Sunan, the proofs-of-
prophethood genre (دلائل النبوة), the inimitability and secrets literature, the
seerah and history books, the stories and quotations of the Companions and
Successors, and every such mention in every harvested book — plus the curated
records on prophethood itself. It follows the Du'a and Magic Browser
architecture: passages are ordinary graph nodes found at build time by a shared
detector; curated records carry the `nubuwat-browser` tag; there is no side
table and no second list.

The key mechanism: **passages are not tagged — they are detected.**
`scripts/nubuwat.ts` matches a guarded lexicon over each passage's own
`text`/`text_search`/labels/summaries, in seven topic families:

- `nubuwwa` — prophethood and its proofs: خاتم النبيين، دلائل/علامات/براهين
  النبوة، ادعاء النبوة، منذر/نذير أمته، بشارة، صدق ما قال.
- `nubuwat` — prophecies and predictions: من بعدي، بعدي يأتي/يخرج/يقوم،
  سيأتي زمان، لا تقوم الساعة حتى، يأتي في آخر الزمان، يؤتى به.
- `muajizat` — miracles of the Prophet: معجز، انشقاق القمر، بكاء الشجرة،
  تكثير الطعام، الإسراء والمعراج، شق الصدر، النبع من بين الأصابع، النور بين
  عينيه، تسبيح الحجارة، خوارق العادات.
- `ijaz` — the Qur'an's inimitability: إعجاز، مثل هذا القرآن، ائتوا بسورة،
  فلن يأتوا بمثله، لو اجتمع الإنس والجن، بلاغة/فصاحة/نظم.
- `asrar` — secrets of the Qur'an: أسرار/خبايا/باطن/ظاهر القرآن، كليات
  وجزئيات، ظاهر وباطن، لطائف، عجائب، جواهر، كنوز، أحكام، ناسخ ومنسوخ،
  متشابه ومحكم، مكية ومدنية.
- `ilm-ghayb` — unseen knowledge: علم الغيب، يعلم ما في الصدور، ما تكنه
  صدورهم، يعلم ما بين أيديهم وما خلفهم، لا يحيطون به علما، وسع كل شيء علما،
  يكتمون/يخفون/مكتوم/مستور.
- `akhira` — eschatological prophections: يوم القيامة، الساعة، الدجال،
  المهدي، عيسى ينزل، يأجوج ومأجوج، آخر الزمان.

Ambiguous forms count only beside a domain collocation in the same passage
(the magic.ts/eschatology.ts strong/weak/context model); verified false
positives live in `NUBUWAT_EXCLUDE`. English signals mirror the museum's own
translations.

## 2. Sections

Five corpus sections, derived from each record's work and genre at build time:

- `quran` — the frozen Qur'an passages.
- `sunnah` — the hadith collections (genre `hadith` or hadith-unit passages).
- `seerah` — the seerah books (genre `sira`).
- `books` — every other harvested work (poetry, history, tafsir, fiqh…).
- `curated` — records tagged `nubuwat-browser`, optionally refined by
  `nubuwat-<section>` and `nubuwat-<topic>` tags.

Works harvested later land in the right section automatically the day their
passage records enter the graph.

## 3. Surface

- `site/src/lib/nubuwat.ts` — `nubuwatItems` over `realNodes`: tagged or
  detected records with section, work node and topic chips.
- `site/src/pages/[lang]/nubuwat/index.astro` — trilingual page for ar/en/ur:
  badge, breadcrumb, title, lede, build-time status, method note, API link,
  section chips with counts, filter input, per-section card grid with
  work/ref lines, topic chips, excerpts; `data-pagefind-body` on the header,
  `data-pagefind-ignore` on the filterable list; full list readable without
  JavaScript.
- `site/src/scripts/nubuwat-filter.ts` — NFKC + Arabic-diacritic + alef +
  case + whitespace normalization over `data-search`.
- `site/src/lib/nav.ts` — `nubuwat` key in `ExplorePage` and the explore list.
- `site/src/components/Landing.astro` — landing card with decorative SVG and
  accent colour.
- `i18n/{ar,en,ur}.yaml` — `nubuwat:` UI block (title, lede, badge, status,
  method, api, filter labels, topic labels, five section titles/descs) and
  `explore.pages.nubuwat` (title, desc, menu).

## 4. API

`scripts/export-api.ts` `FEATURE_EXPORTS` gains `nubuwat.json`
(feature `nubuwat-browser`): detected or tagged nodes, fields
kind/work/ref/unit/text/sura/aya/wings/themes/tags, plus `section` and
`topics` extras. Documented in `docs/data/README.md`,
`site/public/openapi/v1.json` and `site/src/pages/llms.txt.ts`.

## 5. Data wave

Bounded initial mining from the OCR'd dalā'il books on the SD card:
al-Bayhaqi's *Dalā'il al-Nubuwwa* and Abū Nu'aym's *Khalā'il al-Nubwwa* —
~35–40 sourced passage records, ≤25 per batch, plus any missing work record.
Every mined record keeps its source reference and provenance; nothing is
invented.

## 6. Gates

`npm run validate` (0 errors), `npm test` (all pass), `npm run build` for the
site change. Registers updated: `docs/site/browsers.md`, `docs/plan/00-README.md`,
roadmap, `docs/agents/lanes.md`, `docs/status.md`, `CANARY.md` (v1.17.0),
coverage regen if required. Ship as `devin/nubuwat-browser`, PR to main.
