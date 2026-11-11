# 32 · Divine and Prophetic Miracles Browser — requirements and production checklist

_The feature requirements for «متصفح المعجزات الإلهية ومعجزات الرسل» (the
Miracles Browser — every mention of the divine miracles and the prophets'
miracles in the Qur'an, the Sunnah, the seerah, Companion and Tabi'i reports
and every harvested book), as requested by the founder and delivered in
`docs/plan/44-miracles-browser.md`. Written so any person or AI agent can
validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement has an
id (`MIR-R..`), a "how to check" line, and the artifact that proves it._

## 0. The original request (verbatim)

> "start working on متصفح المعجزات الالهية ومعجزات الرسل where it should list
> all the mentioned and written المعجزات الالهية ومعجزات الرسل that are in
> quran, see rah, sunna, tabi3een stories , quotes , mentioned and written in
> books that were harvested and any future harvested book if it has a المعجزات
> الالهية ومعجزات الرسل should be viewable here. add a box for it on landing
> page and in navigation menus. make sure this is done end to end and full
> detailed proses and make it ready for production at the end of this. this is
> only about المعجزات الالهية ومعجزات الرسل and everything mentioned about
> المعجزات الالهية ومعجزات الرسل anywhere in any of the sunni books or quran
> or sunna or sera. find all the instances where المعجزات الالهية ومعجزات
> الرسل Were mentioned or part of quotes from quran, sunnah, Hadith, seerah
> or from sa7aba and tabi3een and add those stories, mentions, quotes,
> details. also add this in engineering documents as the original requirements
> to allow AI later on to test and validate it when it is in production."

Scope notes recorded during planning:

- «المعجزات الإلهية» **includes the cosmic-sign verses** (الآيات الكونية — the
  signs of creation: «أفلا ينظرون»، «وما في السماوات والأرض») — confirmed by the
  founder.
- Subject pages are **per prophet and/or per miracle** — the browser keeps a
  subject index of the miracle-bearing prophets and the miracle concepts/events.
- One miracle book is mined into passages (the Tathbit Dalail corpus).
- The route is `/miracles/`; the public English name is **"Miracles Browser."**

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| MIR-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `miracles-browser` (+ optional `miracles-<section>`) | `grep -rl "miracles-browser" data/` — hits under `data/*/` `relations:`/tags only; `scripts/lib.ts` `CLASSES` unchanged |
| MIR-R02 | Five sections derived from the corpus, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `curated` السجلات المنتقاة | `MIRACLE_SECTIONS` in `scripts/miracles.ts`; `site/src/lib/miracles.ts` |
| MIR-R03 | **Automatic inclusion of future harvested books**: a miracle mentioned in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «ومن معجزات النبي أنه نبع الماء من بين أصابعه» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `miracles.json` with `section:"books"`; then remove the fixture |
| MIR-R04 | Detection is over passage-owned text only (`text_search`, `text` fallback) — never labels, summaries, isnads or work names, so a chapter titled «كتاب المعجزات» does not create hits | `miracleTopicsOf` in `scripts/miracles.ts`; a fixture passage whose label says «معجزة» but whose text does not must NOT be detected |
| MIR-R05 | Arabic diacritics, tatweel and hamza seats are normalized before matching; patterns are written in natural orthography and run through the same normalizer, so «ءَ»، «أ/إ/آ»، «ة/ه»، «ى/ي»، «ؤ/و»، «ئ/ي» never drift | `normalizeMiracleArabic`; fixture «أَلْقِ عَصَاكَ» (fully vocalised) is detected |
| MIR-R06 | Corpus-aware detection: the Qur'an is judged on the patterns alone; the Sunnah/seerah likewise; the general **books** corpus additionally requires the miracle lexicon (معجز/خارق/اعجاز/دلائل/براهين/علامات/حجة/سلطان…) in the passage, so an ordinary book that merely mentions «عصا» or «ناقة» does not enter | `MIRACLE_CONTEXT` + the `resolved === "books"` gate in `miracleTopicsOf`; `scripts/features-api.test.ts` «book-x-2» case |
| MIR-R07 | «معجز/معجزه» is gated out of the Qur'an corpus (there it is the verb «يُعجِز» = to defeat, e.g. «وما أنتم بمعجزين»), and counts in the books corpus only beside miracle vocabulary | `passage/quran-*` «معجزين» verses must NOT produce the `doctrine` topic; a books passage «ومن معجزاته أنه…» must |
| MIR-R08 | «أعجاز نخل» is palm-roots, not inimitability: the i'jaz patterns carry `none` gates on «أعجاز نخل/النخل/نخيل» | `passage/quran-54-20`, `passage/quran-69-7` must NOT produce `i3jaz`/`doctrine` from «أعجاز نخل» |
| MIR-R09 | Ambiguous lexemes are gated by collocation, never counted bare: «صالح» (righteous adjective), «عاد» (returned), «موس» inside «موسم» (season), «فر» (flee), «حبا» (love), «قدير» (divine attribute), «خسف» (humiliation ≠ lunar eclipse), «الكرامة» (generosity vs «ذو الكرامة»), «المن» (manna only beside Banu Isra'il), «مائدة» (dining table), «التابوت» (covenant chest vs Musa's basket) | the detector's per-topic `all`/`none` gates in `scripts/miracles.ts`; spot-check `scripts/muj-scan.ts` output for the listed false-positive families |
| MIR-R10 | Bounded co-occurrence: event topics require the object and its sign-word inside a bounded window (e.g. «عصا … ثعبان/حيّة/بيضاء» ~30 chars; «ناقة … صالح/ثمود/عقر/يوم معلوم»), so an unrelated mention does not count | `scripts/miracles.ts` SPECS `.{0,N}` windows; a fixture «أخذ العصا ومشى» alone must NOT produce `staff` |
| MIR-R11 | The Prophet's-signs topic covers the canonical sign reports: water from between the fingers («نبع الماء من بين أصابعه»), the weeping trunk («بكاء الجذع»), the eclipses («كسوف الشمس»/«خسوف القمر»), the three days of veiling, «صدق الله رسوله الرؤيا» — each gated so generic «بكي»/«جذع»/«كسوف» do not fire alone | `prophet-signs` patterns; fixture «بكى الرجل» must NOT fire; fixture «نبع الماء من بين أصابعه» must |
| MIR-R12 | The cosmic-sign topic («cosmic-signs») catches the sign-of-creation formulas — «أفلا ينظرون/يتفكرون/يتدبرون»، «إن في خلق السماوات»، «وما في السماوات والأرض»، «لهم في السماوات»، «ربنا ما خلقت هذا باطلاً»، «كيف رفعناها/بسطناها»، «يسبح له ما في السماوات» — and is classified `kind:"sign"` | `MIRACLE_TOPIC_KIND["cosmic-signs"] === "sign"`; `passage/quran-3-190/191` detected |
| MIR-R13 | Known false positives excluded by id in `MIRACLES_EXCLUDE` / `MIRACLE_TOPIC_EXCLUDE` — the escape hatch for verified misses after corpus review | `scripts/miracles.ts`; the sets are populated from `scripts/muj-scan.ts` review |

## 2. Sections, subjects and topics

| Id | Requirement | How to check |
|---|---|---|
| MIR-R14 | Each detected passage carries `section` ∈ {quran, sunnah, seerah, books, curated} derived from its work's genre (`miracleCorpusOf`) | `site/src/lib/miracles.ts`; `/api/v1/miracles.json` rows |
| MIR-R15 | `kind` ∈ {event, sign, mention} is derived from the strongest topic hit: narrated miracle events > cosmic signs > meta mentions | `MIRACLE_TOPIC_KIND`; API `kind` field |
| MIR-R16 | The subject index `MIRACLE_SUBJECTS` covers the miracle-bearing prophets (person/muhammad, ibrahim, ismail, isa-ibn-maryam, zakariyya, yahya, yusuf, musa, harun, sulayman, ayyub, yunus, al-khidr, nuh, hud, salih, shuayb, lut, talut) and the miracle concepts/events (mujiza, al-tahaddi-bil-quran, ijaz-al-quran, al-ayat-al-kawniyya-wal-mujiza, karamat-al-awliya, inshiqaq-al-qamar, descent-of-isa, isra-and-miraj, year-of-the-elephant-and-birth, ayat-musa-al-tis) | `MIRACLE_SUBJECTS`; `/miracles/` subject grid; `/api/v1/miracles.json` `subjects` |
| MIR-R17 | Topic→subject mapping: each topic lands on its prophet/concept — `staff`→musa+harun, `sea`→musa, `she-camel`→salih, `ad/thamud/madyan/lut-destruction`→hud/salih/shuayb/lut, `pharaoh-destruction`→musa, `moon`→muhammad+inshiqaq-al-qamar, `isra-miraj`→muhammad+isra-and-miraj, `descent`/`clay-bird`/`table`→isa, `cradle`→isa+yahya, `annunciation`→zakariyya+yahya, `dreams`→yusuf, `fish`→yunus+al-khidr, `ark`→nuh, `basket`→musa, `healing`→isa+ayyub, `sulayman`→sulayman, `covenant-ark`→talut, `elephant`→muhammad+the-event, `prophet-signs`→muhammad, `cosmic-signs`→al-ayat-al-kawniyya-wal-mujiza, `challenge`→al-tahaddi-bil-quran, `i3jaz`→ijaz-al-quran, `karamat`→karamat-al-awliya, `doctrine`/`unnamed`/`generic-destruction`→mujiza | `MIRACLE_TOPIC_SUBJECTS`; subject pages group correctly |
| MIR-R18 | Canonical `mentions` edges into the subject set join the feed and subject index even when the topic map is generic — a miracle passage that names its prophet lands on that prophet's page | `site/src/lib/miracles.ts` `edgeSubjects`; a fixture passage with `mentions→person/musa` and `text` containing «معجزة» appears under person/musa |
| MIR-R19 | The meta topics — `doctrine` (معجزة/إعجاز/دلائل/براهين/علامات النبوة), `challenge` (هاتوا بسورة/مثل هذا القرآن/فلياتوا/بشر مثلنا/سحر مبين rejection formulas), `i3jaz`, `karamat` (gated), `unnamed` (كل نبي أوتي آيات) — are detected as `kind:"mention"` | `passage/quran-17-88` («قُل لَّئِنِ اجْتَمَعَتِ الْإِنسُ وَالْجِنُّ»), `passage/quran-2-23` («فَأْتُوا بِسُورَةٍ») detected |
| MIR-R20 | The narrated event topics are detected as `kind:"event"`: moon, isra-miraj, descent, staff, sea, provision, fire, she-camel, the five destruction groups + generic-destruction, elephant, fish, ark, basket, healing, clay-bird, cradle, table, sulayman, dreams, annunciation, covenant-ark, prophet-signs | `MIRACLE_TOPIC_KIND`; the Qur'an miracle ayahs land in `section:"quran"` |
| MIR-R21 | Curated records join through `miracles-browser` (+ `miracles-<section>`) tags — the concept/event records that gather the miracle complex are tagged in place | `miracleTagSection`; `grep -rl "miracles-browser" data/` |

## 3. Surfaces

| Id | Requirement | How to check |
|---|---|---|
| MIR-R22 | Home `/[lang]/miracles/` in ar/en/ur: lede, status line, method note, subject grid, five corpus sections, filter, no-JS full list | open `/ar/miracles/`, `/en/miracles/`, `/ur/miracles/` |
| MIR-R23 | Subject pages `/[lang]/miracles/<slug>/` for every `MIRACLE_SUBJECTS` member that exists: summary, grouped Qur'an ayahs (Arabic text + translation), Sunnah/seerah/book reports, related records | `/en/miracles/musa/`, `/ar/miracles/isa-ibn-maryam/` |
| MIR-R24 | Landing-page card and navigation-menu entry in all three languages | `/` shows the Miracles card; Explore menu lists it |
| MIR-R25 | Pagefind indexing: title, lede and headings inside `data-pagefind-body`; the feed list is `data-pagefind-ignore` with its own filter | search «معجزة»/«miracle» on the site finds the browser |
| MIR-R26 | API `/api/v1/miracles.json`: `{generated, feature:"miracles-browser", subjects, items}` — items carry `id`, `class`, `section`, `kind`, `subjects`, `topics`, `work`, `ref`, `unit`, `text`/`sura`/`aya`, `connections`, `prose` | `curl https://api.islam.museum/api/v1/miracles.json` |
| MIR-R27 | OpenAPI `/miracles.json` path, `llms.txt` line and `docs/data/README.md` row document the endpoint | `site/public/openapi/v1.json`, `site/src/pages/llms.txt.ts`, `docs/data/README.md` |
| MIR-R28 | i18n: `miracles:` UI block and `explore.pages.miracles` in `i18n/{ar,en,ur}.yaml`; topic labels under `miracles.topics`; section titles under `miracles.sections` | `i18n/*.yaml` |
| MIR-R29 | Accessibility WCAG 2.2 AA: semantic headings, `aria-labelledby` on sections, labelled filter input, keyboard-operable, no-JS readable, Arabic RTL correct | axe/Lighthouse pass on `/miracles/` |
| MIR-R30 | Deploy-churn: nothing count/date/version-bearing baked into shared layouts; page script is a plain file under `site/src/scripts/` | `tools/deploy/shell-paths.list` unchanged by this feature |

## 4. Acceptance checklist (production)

- [ ] MIR-R01..MIR-R13 detector truth table verified on production data
- [ ] MIR-R14..MIR-R21 sections/subjects/topics/edges/tags verified
- [ ] MIR-R22..MIR-R30 surfaces verified on islam.museum
- [ ] `npm run validate` 0 errors · `npm test` all pass · `npm run build` clean
- [ ] Human read promotes the draft records (AI output is draft-tier)
