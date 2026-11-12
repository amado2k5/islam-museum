# 55 · Genealogies, Peoples, Butun and Prophets' Tree Browser (متصفح الأنساب والأعراق والبطون وشجرة الأنبياء والمرسلين)

Status: built 2026-11-19 (draft records; nothing live until the founder deploys). Lane `ansab`. Acceptance spec: `docs/engineering/43-ansab-browser-requirements.md` (`ANS-R..`), which carries the founder's original request verbatim.

## 1 · What the founder asked for

One combined browser — «متصفح الأنساب والأعراق والبطون وشجرة الأنبياء والمرسلين» — that lists **everything mentioned and written** about genealogies (الأنساب), ethnicities/peoples/tribes (الأعراق), the tribal subdivisions (البطون), and the tree of the prophets and messengers (شجرة الأنبياء والمرسلين), wherever it occurs: in the Qur'an, the Sunnah and hadith, the seerah, the reports and stories of the Companions and the Tabi'in, every book already harvested into the museum, and **any book harvested later** — its mentions must appear here automatically, with a landing-page card and navigation-menu entries, end to end and production-ready. The founder clarified: one browser with internal sections (not several), البطون means the tribal subdivisions (the clan tier below the tribe — renamed from المتون on the founder's follow-up instruction, 12 Nov 2026; the mutūn works stay as ordinary work records outside this browser), the prophets' tree includes the disputed upper links, and local gates may be skipped on this pass.

## 2 · Shape

A browser over the one graph — no side table, no second graph — in the exact file-for-file shape of the messengers/akhlaq/places browsers:

| Piece | Where |
|---|---|
| Build-time detector + shared taxonomy | `scripts/ansab.ts` |
| Site-side reads (subjects, feed, passages per corpus, related, chain) | `site/src/lib/ansab.ts` |
| Trilingual home `/{lang}/ansab/` | `site/src/pages/[lang]/ansab/index.astro` |
| Trilingual subject pages `/{lang}/ansab/<slug>/` | `site/src/pages/[lang]/ansab/[slug].astro` |
| Progressive-enhancement filter | `site/src/scripts/ansab-filter.ts` (page readable with no JS) |
| i18n `ansab:` block + `explore.pages.ansab` | `i18n/{ar,en,ur}.yaml` |
| Explore menu + landing card (tree icon, steel-blue accent) | `site/src/lib/nav.ts`, `site/src/components/Landing.astro` |
| Static API `/api/v1/ansab.json` | `scripts/export-api.ts` (`ansabApiData`, subjects index + items) |
| API docs | `docs/data/README.md`, `site/public/openapi/v1.json`, `site/src/pages/llms.txt.ts` |
| Registers | `docs/site/browsers.md`, `docs/plan/00-README.md`, `docs/plan/06-roadmap.md`, `docs/agents/lanes.md`, `docs/status.md`, `CANARY.md` (v1.26.0) |

## 3 · The sections

- **شجرة الأنبياء والمرسلين (`shajara`)** — the prophets' tree: the agreed chain `person/muhammad` ← `abdullah-ibn-abd-al-muttalib` ← … ← `person/adnan`; the twenty-eight **disputed links** between Adnan and `person/qaydar`/`ismail`/`ibrahim` on the transmitted Ibn Ishaq / al-Tabari / Ibn Sa'd order (عدنان بن أُدّ بن أدد بن الحميسع بن سلمان بن عوف بن بوز بن قموال بن أُبيّ بن العوّام بن ناشد بن حزا بن بلداس بن يدلاف بن طابخ بن جاحم بن ناهش بن ماخي بن عيص بن عبق بن ضعيد بن نبت بن ماشح بن النشطان بن أدر بن الذرع بن عبد بن أحمر بن نابت بن قيدار بن إسماعيل); and Ibrahim's two lines (Ismail → Muhammad; Ishaq → … → Isa ibn Maryam). `ANSAB_PROPHET_CHAIN` marks each link `agreed: true|false`; disputed links render dashed on the home tree and carry a «حلقة مختلَف فيها» chip on their pages — the three-part scholarly framing already in `concept/nasab-al-nabi` and `concept/waqf-al-nasab-inda-maadd`, never asserted as settled fact.
- **القبائل والبطون (`tribes`)** — `group` records of kind tribe/clan/family: Quraysh and its clans, Aws/Khazraj, Tamim, Hawazin, Thaqif, Ghatafan, the Hijazi Jewish tribes, 'Aad and Thamud, and the rest of the Adnani/Qahtani houses.
- **الأعراق والشعوب (`peoples`)** — `group` records of kind people/population: Arabs, Ajam, Persians, Rum, Habasha, Copts, Turks, Berbers, Kurds, Mongols, Banu Isra'il.
- **البطون (`butun`)** — `group` records for the tribal subdivisions, the tier below the tribe and above the fakhidh: the clans of Quraysh (Hashim, al-Muttalib, Abd Manaf, Abd Shams, Abd al-Dar, Makhzum, Jumah, Sahm, Zuhra, Taym, Adi, Umayya), of Aws and Khazraj (al-Najjar, Abd al-Ashhal, Zafar, Haritha, al-Harith, Salima, Zurayq, Bayada, Amr ibn Awf, Khatma, Waqif, Maghala, al-Ajlan, Dubayb, Sa'ida, Salul), and of Hawazin and Qays (Darim, Hanzala, Fazara, Murra, Kilab, Nasr, Jusham, Uqayl, Sa'd ibn Bakr).
- **سجلات عن الأنساب (`curated`)** — the nasab concepts.
- **سائر المذكورات (`mentioned`)** — self-growing shelf: records reached by detection or tag without a section tag.

## 4 · Detection (future harvested books enter automatically)

`scripts/ansab.ts` runs at build over the compiled graph: subject-name patterns (each lineage link, tribe, people and clan name), generic class patterns (النسب، القبيلة، البطون، شجرة الأنبياء), all matched on the **passage matn only** (`text_search`/`text`, never labels or isnads) with imlaei normalisation; ambiguous forms gated («عاد» only as قوم عاد / عاد الأولى / إرم ذات العماد; «تميم» only as بني تميم; English fallbacks on the en translation only). `ANSAB_EXCLUDE`/`ANSAB_TOPIC_EXCLUDE` are the false-positive escape hatches. Canonical `mentions` edges join the same feed. Corpus classification: `work/quran` or `unit: ayah` → `quran`; `genre: sira` → `seerah`; `genre: hadith` or `unit: hadith` → `sunnah`; else `books`.

## 5 · Data written for the lane

- **43 new `person` records** with trilingual draft prose and cited sources (`source/mubarakpuri-raheeq`, `ibn-hisham-sira`, `tarikh-al-tabari`, `tabaqat-ibn-sad`): the 28 disputed links + the agreed links missing from the graph (kilab-ibn-murrah, murra-ibn-kab, kab-ibn-luayy, luayy-ibn-ghalib, ghalib-ibn-fihr, malik-ibn-al-nadr, al-nadr-ibn-kinana, kinana-ibn-khuzayma, khuzayma-ibn-mudrika, udd-ibn-adnan…); six that turned out to pre-exist were restored to their richer originals and tagged in place (maadd, nizar, mudar, mudrika, fihr, qusayy). `child_of` edges connect the whole chain.
- **Collisions fixed in the same commit:** the Ansari `person/malik-ibn-al-nadr` (father of Anas) was retargeted to `person/malik-ibn-al-nadr-al-ansari` in `umm-sulaym` and the stub ledger — the Qurashi ancestor keeps the base slug; `person/kilab-ibn-murrah` replaces the stub entry; duplicate tribe records deferred to the richer existing slugs (`al-aws`, `banu-qaynuqa`, `banu-qurayza`, `banu-dabba`, `banu-ghifar`, `banu-lakhm`, `banu-hamdan`, `banu-shayban`, `banu-taghlib`, `banu-tamim`, `banu-sulaym`) tagged in place.
- **10 new `group` records** (`abs`, `muzayna`, `ashja`, `yarbu`, `banu-abd-manaf`, `aad`, `al-ajam`, `al-rum`, `al-habasha`, `al-qibt`, `banu-israil`) and **15 new `work` records** for the butun, all trilingual draft prose.
- **Tagging:** `ansab-browser` + `ansab-<section>` on ~100 records (20 tree persons, 48 tribes, 11 peoples, 9 existing butun, 6 nasab concepts).

## 6 · Honesty rules honoured

Disputed lineage is displayed because the founder asked for the full tree, but it is labelled «مختلف فيه» at every surface — chip, dashed outline, tooltip, section description, record prose; the agreed part is distinguished; nothing above Ibrahim is asserted. All new records are `status.review: draft` with `provenance`, one cited source minimum, no honorifics typed, no Qur'an text typed (frozen passage records only), and Arabic-parenthesis isolation preserved.

## 7 · What's next

Human read of the draft records; `mentions` edges on the strongest detected passages where a human confirms them; seerah/book sections keep filling as those corpora are harvested (no work needed — detection is build-time); further tribes/butun waves as the corpus grows.
