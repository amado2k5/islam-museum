# 29 · The Asma ul Husna Browser: proposal

Status: **proposal, awaiting the founder's approval.** Nothing in schema, data, site, i18n or the canon changes until it is approved (`docs/ai-change-gates.md` §1). This document is the only file this change adds, together with its row in `docs/plan/00-README.md`.

Requested by the founder in chat, 9 November 2026: «megaplan — متصفح أسماء الله الحسنى. All the 99 names; when each name is clicked it should show all the relevant stories from hadith, seerah, sahaba and saliheen, and from Quran.»

## 0 · What the browser is for, and what it is not

The browser gives every one of the ninety-nine names its own page: the name, its transliteration and meaning, and then the stories that manifest it — the Qur'an passages that carry it, the hadith reports that invoke it, the seerah events that show it, and the Companions and the righteous whose recorded lives exemplify it. Each section links out to the museum's own records, never to a side table: a name page is a reading of the one graph through a single word of praise.

The browser describes, it does not prescribe. It does not tell the reader how to invoke, count or memorise the names; it shows where each name stands in the sources the museum has cited. The enumeration itself is presented as the sources give it: the well-known list of Jami' al-Tirmidhi (3507) is the spine, the differing names of the Ibn Majah list (3861) are labelled where they differ, and no verdict is given between enumerations.

## 1 · What the repository already has (checked 9 November 2026)

- `data/concept/asma-allah-al-husna.yaml` — the umbrella concept (kind `belief`, wikidata Q83875) with trilingual `education.did_you_know`, citing Bukhari and Muslim for «إن لله تسعة وتسعين اسمًا مائة إلا واحدًا من أحصاها دخل الجنة», and sources that already include `source/jala-afham-ibn-qayyim`, `source/sahih-al-bukhari`, `source/sahih-muslim`, `source/tafsir-tabari-shakir-v01` and four Assabile lesson sources. Trilingual prose exists at `content/{ar,en,ur}/concept/asma-allah-al-husna.md`. The ninety-nine individual names are **not** records.
- **Passages** (`data/passage/`): 6,350 frozen-Tanzil Qur'an ayah records (`passage/quran-<sura>-<aya>`; text never typed) and about 3,800 hadith and other passages (`passage/muslim-*`, `passage/muwatta-*`, `passage/arbaun-*`, …). Qur'an is referenced as `[[passage/quran-<s>-<a>|label]]` in prose.
- **Predicates that already fit** (`schema/predicates.yaml`): `mentions`/`mentioned_in` (domain passage, work, event, exhibit, question → range includes concept), `exemplifies`/`exemplified_by` (person → concept — the sahaba and saliheen hook), `part_of` (name → umbrella concept), `related_to` (paired names), `revealed_about` where a verse was revealed concerning a name.
- **Concept kinds enum** (`schema/enums/kinds.yaml`): `belief, doctrine, legal, ethical, discipline, art_form, architectural_element, scientific, political, social, term`. No `divine-name` yet.
- **Browser precedent:** `site/src/pages/[lang]/jobs/index.astro` + `site/src/lib/jobs.ts` — build-time accessors over the compiled graph, counts computed at build and never baked into shared layouts (`tools/deploy/shell-paths.list` discipline). Entity pages run through `site/src/pages/[lang]/[class]/[slug].astro` → `EntityLayout.astro`, which already renders inverse relations; the name page needs grouped, headed sections instead of one chip row.
- **Named sources already filed** for this domain: `source/jala-afham-ibn-qayyim` (Ibn Qayyim al-Jawziyya's names chapter; authenticity ledger `docs/authenticity-ledger/books/asma-ul-husna-ibn-qayyim-jala.yaml`), `source/salamoccasions-99-names-journal`, `data/work/al-amad-al-aqsa-sharh-asma-allah.yaml`, `data/work/fatwa-subki-ah-as-divine-name.yaml`, and the four Assabile recordings on the umbrella record.
- **Verse-tag data already in git:** `surah-maps/059-al-hashr.yaml` (the names of 59:22–24) and `surah-maps/017-al-isra.yaml` mark divine-name mentions per verse — a ready seed for `mentions` edges.
- `cards/lists/` holds lightweight flip-card lists (`asma-yaum-al-qiyama`, `asma-al-ashhur-al-hijriyya`); the browser itself must be graph records per the never-bend rule, so card lists stay as they are.
- No `data/_stubs.d/asma.yaml` yet.

## 2 · The data model (proposed)

### 2.1 Classes and kinds

- **Each of the 99 names** = `concept` with a new kind `divine-name` (new enum value under `concept`, the same pattern as `fatwa-collection` under `work` — the class list quoted by the submissions does not change).
- **The set** = the existing `concept/asma-allah-al-husna`; every name `part_of` it.
- No new entity class, no new predicate required (section 2.3).

### 2.2 Fields

Reuse existing fields where one fits. Names are proposals.

| Group | Field | Shape | Notes |
|---|---|---|---|
| Identity | `label` | {ar: «الرحمن», en: "Ar-Rahman — The Most Merciful", ur} | The Arabic name alone, as listed; no honorifics |
| | `summary` | {ar, en, ur} | One cited line of meaning; the page lede |
| Order | `order` | integer 1–99 | New field on `concept` (schema change, needs approval); drives the grid |
| Lexical | `name_meta.transliteration` | string | e.g. "al-Raḥmān" |
| | `name_meta.root` | string | Arabic root, e.g. «ر-ح-م» |
| | `name_meta.enumeration` | list of enum: `tirmidhi`, `ibn-majah`, `other` | Which canonical list carries the name; differences labelled, no verdict |
| Set | `part_of` (existing predicate) | → `concept/asma-allah-al-husna` | |
| Pairing | `related_to` (existing) | → another divine-name concept | Paired/linked names (الرحمن/الرحيم، الأول/الآخر) |
| Sources | `sources[]` | source records | The enumeration source plus at least one defined source per name (Jala' al-Afham where available) |
| Provenance | `provenance`, `status.review: draft` | existing blocks | AI output stays draft until a human reads |

### 2.3 Edges (existing predicates only)

| Edge | Predicate | Name-page section |
|---|---|---|
| `passage` (quran) → name | `mentions` | «في القرآن» — the occurrence list |
| `passage` (hadith) → name | `mentions` | «في الحديث» |
| `event` (seerah) → name | `mentions` | «في السيرة» |
| `person` (sahabi) → name | `exemplifies` | «من قصص الصحابة» |
| `person` (salih) → name | `exemplifies` | «من قصص الصالحين» |
| name → `concept/asma-allah-al-husna` | `part_of` | set membership |
| name ↔ name | `related_to` | paired names |

Each edge is written once on the source side with its `sources` citation; inverses are computed at build. A sahaba/saliheen classification comes from the person record (story roles and era), not a new flag.

### 2.4 Curated story prose

- `content/ar/concept/asma-<slug>.md` first, `content/en/` and `content/ur/` in the **same commit**, all `status.review: draft` with `provenance`.
- House rules apply (`cards/stories/SCHEMA.md` and the never-bend rules): the museum's own words; Qur'an referenced as `[[passage/quran-…|label]]`, never typed; quotations ≤ 40 words with page; no honorifics; popular stories not established get a «لم يثبت» caution rather than removal; Arabic parentheses isolated (U+2066/U+2069); the Sunni frame stated, other views labelled.
- Stories come in batches of ≤ 25 records per commit.

### 2.5 The enumeration

The spine is the Tirmidhi list (Jami' al-Tirmidhi 3507), ordered 1–99 — appendix A lists every slug. The Ibn Majah list (3861) differs on a handful of names (for example الواحد/الأحد ordering and أسماء like الغني/الغنيّ spellings); the `enumeration` field records which lists carry each name and the landing page notes the difference in one labelled sentence, cited.

## 3 · Browser design (proposed)

### 3.1 Routes and components

- `/[lang]/asma/` — landing: Pagefind header block (`data-pagefind-body`: title, lede, status line), the founding hadith with citation, then the 99-grid: numbered cards, Arabic name large, gloss beneath, in canonical order with an alphabetical toggle and a no-JS-safe filter input (Job Browser pattern). The grid sits inside `data-pagefind-ignore`.
- `/[lang]/asma/<slug>/` — per-name page: hero (name, transliteration, root, meaning), then the five headed sections — «في القرآن» (passage chips with refs), «في الحديث», «في السيرة» (event cards), «من قصص الصحابة» and «من قصص الصالحين» (person cards plus the curated prose) — then paired names, sources and the umbrella link. Sections with no records hide; prose carries the page when edges are still thin. The canonical entity page `/[lang]/concept/<slug>/` continues to resolve and cross-links to the asma page (and back), as the Job Browser does for `/job/` and `/jobs/`.
- `site/src/lib/asma.ts` — build-time accessors over the compiled graph (`jobNodes`-style): ordered names, per-name grouped lookups (`passagesMentioning`, `eventsMentioning`, `personsExemplifying`), enumeration counts.
- i18n: an `asma:` block in `i18n/{ar,en,ur}.yaml` in the same commit (title, lede, badge, five section titles, empty-state lines, status line).
- Explore-menu entry and landing card marked «قيد الإعداد» until the founder flips it live (plan-21 precedent).

### 3.2 Data flow and hosting

Everything is build-time SSG over the compiled graph; no runtime calls and no AI at runtime. The only hosting check is whether the build emits a data folder outside the existing `api` export path — if it does, that folder joins `R2_DATA_DIRS` (`workers/site/src/route.js`), `workers/r2-sync/batch/publish.mjs`, `run_worker_first` and the two `deploy.yml` removal lines, labelled **`submission-impacting`** for separate sign-off. The design targets zero new folders, so the R2 lists stay untouched.

### 3.3 Search and API

- `/api/v1/asma.json` — the 99 names: order, slug, transliteration, root, trilingual label/summary, enumeration, edge counts per section — added to `scripts/export-api.ts` with a row in `docs/data/README.md`, a path in `site/public/openapi/v1.json` and a line in `site/src/pages/llms.txt.ts`. The generic concept exports already carry the records.
- Landing carries `data-pagefind-body`; name pages are entity pages (auto-indexed); the long grid is ignored.

## 4 · Content plan

- **Records:** 99 `concept` records in 4 commits of ≤ 25, trilingual label + summary at creation (the never-bend language rule), each with `order`, `name_meta`, `part_of` and ≥ 1 source.
- **Edges, seeded then grown:** surah-map tags (59:22–24, 17:110–111) first; then per-name Qur'an occurrences verified against Tanzil refs and a defined tafsir/fiqh source where a story is told; hadith occurrences from the filed collections (Bukhari, Muslim, Muwatta, arbaun); seerah events and sahaba/saliheen persons where a cited story exists — no edge on a guess.
- **Prose waves:** stories per name in batches of ≤ 25, starting with the ten names with the densest graph neighbourhoods.

## 5 · The lane

- Lane name: `asma`.
- Scope: the 99 `divine-name` records, their edges, the browser pages and the per-name story prose.
- Files, after approval: `docs/agents/lanes/asma.md`, `docs/delegation/asma-progress.md`, `data/_stubs.d/asma.yaml` when the first stub is needed, a row in `docs/agents/lanes.md`, a row in `docs/status.md`. Owner line set by the founder.

## 6 · Files this proposal touches, and risk labels

| File | Intent | Label |
|---|---|---|
| `docs/plan/29-asma-browser.md` (new) | This proposal | `non-impacting` |
| `docs/plan/00-README.md` | One row for plan 29 | `non-impacting` |
| `schema/enums/kinds.yaml` | Add `divine-name` under `concept` | `non-impacting`; enum change, needs approval |
| `schema/concept.schema.json` | `order` integer, `name_meta` block | `non-impacting`; needs approval |
| `scripts/validate.ts` | divine-name needs order, enumeration, ≥ 1 source; paired `related_to` stays inside the kind | `non-impacting`; needs approval |
| `data/concept/asma-*.yaml` | 99 records, batches ≤ 25 | `non-impacting` inside the lane |
| `content/{ar,en,ur}/concept/asma-*.md` | Trilingual story prose | `non-impacting` inside the lane |
| `data/passage/*`, `data/event/*`, `data/person/*` | `mentions` / `exemplifies` edges with sources | `non-impacting` inside the lane |
| `site/src/lib/asma.ts`, `site/src/pages/[lang]/asma/{index,[slug]}.astro` | Browser pages | `non-impacting`; new route needs approval |
| `i18n/{ar,en,ur}.yaml` | `asma:` keys | `non-impacting`; new keys need approval |
| `scripts/export-api.ts`, `site/public/openapi/v1.json`, `docs/data/README.md`, `site/src/pages/llms.txt.ts` | `/api/v1/asma.json` | `non-impacting`; needs approval |
| `docs/site/browsers.md`, `docs/agents/lanes.md`, `docs/status.md`, `docs/agents/lanes/asma.md`, `docs/delegation/asma-progress.md`, `CANARY.md`, `docs/coverage.md` | Register, lane, status, canary, coverage | `non-impacting` |
| `workers/*`, `.github/workflows/deploy.yml`, `docs/outreach/*` | Untouched — unless a new R2 folder proves necessary, then separate `submission-impacting` approval | — |

## 7 · Acceptance tests

- The validator accepts `divine-name` records and rejects one without `order`, `enumeration` or a source.
- Exactly 99 `divine-name` records, `order` unique 1–99, each `part_of concept/asma-allah-al-husna`, each with trilingual `label` + `summary`.
- `/[lang]/asma/` renders the full grid in ar/en/ur with JS off; every name links to its page.
- Every name page shows its five sections; each listed record exists and is cited; empty sections are absent from the markup.
- `/api/v1/asma.json` exports the set; the browser is findable by name in Pagefind in all three languages.
- No typed Qur'an text, no typed honorifics, Arabic parentheses isolated, `npm run validate` + `npm test` + `npm run build` pass, `npm run coverage` regenerated, CANARY entry appended.

## 8 · Order of work after approval

1. Approve this proposal (and, separately, any `submission-impacting` item if one appears).
2. Phase 1: enum + schema + validator; the 99 records in 4 batches; umbrella `part_of` edges.
3. Phase 2: seed edges (surah-maps → quran passages; cited hadith; events; persons).
4. Phase 3: browser pages, i18n, API export, register/lane/status rows, landing card «قيد الإعداد».
5. Phase 4: curated trilingual story prose, batches ≤ 25, spot-checks logged in the lane file.

## 9 · Decisions for the founder

- Approve kind `divine-name`, the `order` and `name_meta` fields, and the validator rules in section 6.
- Confirm the Tirmidhi list as the ordered spine, with Ibn Majah differences labelled through `enumeration`.
- Confirm sahaba/saliheen links use `exemplifies` (versus a dedicated `stories:` field).
- Go-live timing for the landing card and the Explore entry.

## Appendix A · The 99 names, Tirmidhi order

| # | Slug | Name |
|---|---|---|
| 1 | asma-al-rahman | الرحمن |
| 2 | asma-al-rahim | الرحيم |
| 3 | asma-al-malik | الملك |
| 4 | asma-al-quddus | القدوس |
| 5 | asma-al-salam | السلام |
| 6 | asma-al-mumin | المؤمن |
| 7 | asma-al-muhaymin | المهيمن |
| 8 | asma-al-aziz | العزيز |
| 9 | asma-al-jabbar | الجبار |
| 10 | asma-al-mutakabbir | المتكبر |
| 11 | asma-al-khaliq | الخالق |
| 12 | asma-al-bari | البارئ |
| 13 | asma-al-musawwir | المصور |
| 14 | asma-al-ghaffar | الغفار |
| 15 | asma-al-qahhar | القهار |
| 16 | asma-al-wahhab | الوهاب |
| 17 | asma-al-razzaq | الرزاق |
| 18 | asma-al-fattah | الفتاح |
| 19 | asma-al-alim | العليم |
| 20 | asma-al-qabid | القابض |
| 21 | asma-al-basit | الباسط |
| 22 | asma-al-khafid | الخافض |
| 23 | asma-al-rafi | الرافع |
| 24 | asma-al-muizz | المعز |
| 25 | asma-al-mudhill | المذل |
| 26 | asma-al-sami | السميع |
| 27 | asma-al-basir | البصير |
| 28 | asma-al-hakam | الحكم |
| 29 | asma-al-adl | العدل |
| 30 | asma-al-latif | اللطيف |
| 31 | asma-al-khabir | الخبير |
| 32 | asma-al-halim | الحليم |
| 33 | asma-al-azim | العظيم |
| 34 | asma-al-ghafur | الغفور |
| 35 | asma-al-shakur | الشكور |
| 36 | asma-al-ali | العلي |
| 37 | asma-al-kabir | الكبير |
| 38 | asma-al-hafiz | الحفيظ |
| 39 | asma-al-muqit | المقيت |
| 40 | asma-al-hasib | الحسيب |
| 41 | asma-al-jalil | الجليل |
| 42 | asma-al-karim | الكريم |
| 43 | asma-al-raqib | الرقيب |
| 44 | asma-al-mujib | المجيب |
| 45 | asma-al-wasi | الواسع |
| 46 | asma-al-hakim | الحكيم |
| 47 | asma-al-wadud | الودود |
| 48 | asma-al-majid | المجيد |
| 49 | asma-al-baith | الباعث |
| 50 | asma-al-shahid | الشهيد |
| 51 | asma-al-haqq | الحق |
| 52 | asma-al-wakil | الوكيل |
| 53 | asma-al-qawiyy | القوي |
| 54 | asma-al-matin | المتين |
| 55 | asma-al-waliyy | الولي |
| 56 | asma-al-hamid | الحميد |
| 57 | asma-al-muhsi | المحصي |
| 58 | asma-al-mubdi | المبدئ |
| 59 | asma-al-muid | المعيد |
| 60 | asma-al-muhyi | المحيي |
| 61 | asma-al-mumit | المميت |
| 62 | asma-al-hayy | الحي |
| 63 | asma-al-qayyum | القيوم |
| 64 | asma-al-wajid | الواجد |
| 65 | asma-al-maajid | الماجد |
| 66 | asma-al-wahid | الواحد |
| 67 | asma-al-ahad | الأحد |
| 68 | asma-al-samad | الصمد |
| 69 | asma-al-qadir | القادر |
| 70 | asma-al-muqtadir | المقتدر |
| 71 | asma-al-muqaddim | المقدم |
| 72 | asma-al-muakhkhir | المؤخر |
| 73 | asma-al-awwal | الأول |
| 74 | asma-al-akhir | الآخر |
| 75 | asma-al-zahir | الظاهر |
| 76 | asma-al-batin | الباطن |
| 77 | asma-al-wali | الوالي |
| 78 | asma-al-mutaali | المتعالي |
| 79 | asma-al-barr | البر |
| 80 | asma-al-tawwab | التواب |
| 81 | asma-al-muntaqim | المنتقم |
| 82 | asma-al-afuww | العفو |
| 83 | asma-al-rauf | الرؤوف |
| 84 | asma-malik-al-mulk | مالك الملك |
| 85 | asma-dhu-al-jalal-wal-ikram | ذو الجلال والإكرام |
| 86 | asma-al-muqsit | المقسط |
| 87 | asma-al-jami | الجامع |
| 88 | asma-al-ghaniyy | الغني |
| 89 | asma-al-mughni | المغني |
| 90 | asma-al-mani | المانع |
| 91 | asma-al-darr | الضار |
| 92 | asma-al-nafi | النافع |
| 93 | asma-al-nur | النور |
| 94 | asma-al-hadi | الهادي |
| 95 | asma-al-badi | البديع |
| 96 | asma-al-baqi | الباقي |
| 97 | asma-al-warith | الوارث |
| 98 | asma-al-rashid | الرشيد |
| 99 | asma-al-sabur | الصبور |
