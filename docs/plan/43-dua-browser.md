# Plan 43 — Du'a Browser (متصفح الأدعية)

_Requested by the founder 11 November 2026: "start working on متصفح الأدعية
where it should list all the mentioned and written الأدعية that are in quran,
seerah, sunna, tabi3een stories, quotes, mentioned and written in books that
were harvested and any future harvested book if it has a الأدعية should be
viewable here. add a box for it on landing page and in navigation menus. make
sure this is done end to end and full detailed proses and make it ready for
production at the end of this. this is only about الأدعية and everything
mentioned about الأدعية anywhere in any of the sunni books or quran or sunna
or sera. find all the instances where الأدعية were mentioned or part of quotes
from quran, sunnah, Hadith, seerah or from sahaba and tabi3een and add those
stories, mentions, quotes, details. also add this in engineering documents as
the original requirements to allow AI later on to test and validate it when it
is in production."_

## 1. What it is

A browser over the one graph that gathers every supplication the museum's
sources mention or write: the Qur'anic prayers of the prophets, the du'as of
the two Sahihs, the Muwatta and the Sunan, the supplications of the Companions
and the Successors, what the seerah books carry, and every du'a in every
harvested book — plus the curated records on supplication itself. It follows
the Dream Browser architecture: passages are ordinary graph nodes found at
build time by a shared detector; curated records carry the `dua-browser` tag;
there is no side table and no second list.

The key mechanism: **passages are not tagged — they are detected.**
`scripts/dua.ts` matches a guarded lexicon over each passage's own
`text_search`/`text` — never labels or summaries, which are museum metadata
(the «كتاب الدعاء» chapter name of a hadith collection is not evidence). A
du'a in a book harvested next month appears here the day its passage record
lands — the founder's "any future harvested book" requirement, met by the
detector rather than by tagging.

## 2. Scope — what counts as a du'a

In scope: anything addressed to God as supplication —

- **Address formulas**: «اللهم»، «ربنا»، «يا رب/أيا رب»، «فيقول ربي»، and
  «ربِ/ربي» followed by a whitelisted supplication follower («رب اغفر»، «رب
  اشرح»، «رب انصر»…; «هو ربي لا إله إلا هو» stays out).
- **Supplication verbs**: «يدعو ربه/ربنا/الله»، «سأل الله»، «يدعو له/لهم»
  (for someone), «ودعا لي بالبركة»، «ادع لنا ربك»، «يدعو ب…» with blessing or
  divine objects («اللهم إني أعوذ» family).
- **God's own speech**: «من يدعوني فأستجيب»، «إذا سألني عبدي»، «أجيب دعوة
  الداع»، «ادعوني أستجب لكم»، «ادع على المشركين».
- **Isti'adha and istighfar**: «أعوذ/نعوذ/يتعوذ/استعيذ/أستغفر/يستغفر» — refuge
  and forgiveness formulas. Refuge *in* a created being («يعوذون برجال من
  الجن») is excluded.
- **The supplicant formula**: «ما من داع يدعو» — gated on a nearby answer-word
  («يستجاب») so the da'wa sense «داع يدعو إلى هدى» stays out.
- **«حسبي الله ونعم الوكيل»** — the prophets' reliance formula.
- **Passages about du'a**: «دعاء»، «أدعية»، «دعوات»، «دعوة» (gated — not the
  da'wa senses «دعوة إلى/من»، not «دعوة تكذب»), «يتضرع/ابتهل»، «سميع الدعاء»،
  «لا يسأم الإنسان من دعاء الخير».

Out of scope (verified): calls to false gods («ادعوا شركاءكم»، «يدعون من
dون الله ما لا يضرهم»), the da'wa senses of «دعوة/يدعو» (preaching, inviting,
summons — «دعا بماء»، «دعا له بسوط»، «دعي بني شجع لحرب محمد»), the claim
«ادعى» ("he claimed"), and bare tasbih («سبحان الله»، «الحمد لله» alone).
Known false positives are excluded by id in `DUA_EXCLUDE`. Every passage is
marked `formula` when it carries an actual supplication and `mention` when it
is only about one.

## 3. Records

- **355 passage records detected** in the current corpus: 253 Qur'an ayahs
  (`work/quran`) and 102 sunnah reports (`work/muwatta-malik` 32,
  `sahih-muslim` 27, `sahih-al-bukhari` 21, `sunan-ibn-majah` 8,
  `jami-al-tirmidhi` 6, `sunan-abi-dawud` 5, `sunan-al-nasai` 2,
  `arbaun-nawawi` 1) — 321 formula, 34 mention. Seerah and books sections are
  empty until those corpora carry dua passages; they fill automatically.
- **9 curated records tagged in place**: three practices (`practice/dua` —
  the rich umbrella record that already existed, `practice/istikhara`,
  `practice/nadhr`) and six concepts (`istighfar`, `mawatin-al-ijaba`,
  `concept/nadhr`, `tawassul`, `al-salat-ala-al-nabi`,
  `al-dua-ala-al-nafs-wal-awlad`). Reuse-before-create: no new record was
  needed for the umbrella — `practice/dua` already carries trilingual prose.
- **`basis_for → practice/dua` edges** on all 355 detected passages, each
  citing the passage's own source (the corpus already used this edge from
  the Prophet's du'a hadiths to the practice).

## 4. Sections (the corpus, not a topic taxonomy)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر
الكتب · `curated` السجلات المنتقاة — derived from each passage's work
(`work/quran`, genre `hadith`/`sira` or `unit: hadith`) and from the
`dua-browser` tag on curated records.

## 5. Pages

- `/[lang]/dua/` — the home: lede, status count, method note, API link,
  section chips with counts, a client-side filter over trilingual labels,
  summaries, work names and text excerpts, and the cards. Header block
  carries `data-pagefind-body`; the lists are `data-pagefind-ignore`.
- Every card links to the **ordinary entity page** of its record
  (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/`).

## 6. Surface

- `scripts/dua.ts` — the shared detector + corpus classifier + section tag
  reader (used by both `scripts/export-api.ts` and `site/src/lib/dua.ts`).
- `site/src/lib/dua.ts` (shared reads), `site/src/lib/nav.ts` (`dua` key,
  `ready: true`), `site/src/pages/[lang]/dua/index.astro`,
  `site/src/scripts/dua-filter.ts`, `i18n/{ar,en,ur}.yaml`
  (`explore.pages.dua` + `dua:` block in the same commit),
  `/api/v1/duas.json` via `FEATURE_EXPORTS`, documented in
  `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.
  Landing card + Explore menu entry via `explorePages`. Register rows in
  `docs/site/browsers.md`, plan index, `docs/agents/lanes.md` (`dua` lane),
  `docs/status.md`, `CANARY.md` (v1.16.0).
- `docs/engineering/31-dua-browser-requirements.md` — the requirements and
  production checklist for later validation (`DUA-R..`).

## 7. Status

Built 11 November 2026: 355 detected passages + 9 curated records =
364 items in `/api/v1/duas.json` (253 quran, 102 sunnah; seerah/books fill as
those corpora are harvested), the `/[lang]/dua/` page in three languages, the
landing card and Explore menu entry, full API docs.
New records are draft-tier until a human reads them; nothing goes live until
the founder deploys. Future enrichment waves: seerah and books passages as
they are harvested, supplication-themed books (al-Adhkar, al-Madad, Ibn
Taymiyya's al-Da'awat, al-Ghazali's Ihya'), deeper Companion/Tabi'in anecdote
mining, and the `DUA-R..` production checklist.
