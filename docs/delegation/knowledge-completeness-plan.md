# Knowledge-completeness programme — plan

_Author: Devin (SWE-2 Medium), 23 Oct 2026. This is Phase 0 of the knowledge-completeness work order of 23 Oct 2026: a baseline audit and the lane definitions for Phases 1–5. Production began on the founder's go-ahead of 23 Oct 2026. Amended 24 Oct 2026: phases no longer stop at their boundaries for the owner's sign-off; a phase exits when its exit criteria (§3, as amended) are recorded in its progress file, and the next phase starts._

## 1. Baseline audit (recomputed 23 Oct 2026 on `origin/main` cdc4b6813)

Totals: **34,792 entities**, 1,742 wanted stubs (`data/_stubs*`), average **1.285 sources per entity**. Numbers below were recomputed directly over `data/` and `content/` (read-only scripts); `docs/coverage.md` agrees within a few records.

### 1.1 Prose depth, by class (meta-classes excluded)

Meta-classes excluded from prose counts per `lanes/prose-backfill.md`: `source/*`, `media/*`, `listing/*`, `dataset/*`, `language/*`, `passage/quran-*`.

| Class | Missing `content/ar/` | Thin (<800 bytes) | Full prose |
|---|---|---|---|
| building | 5,460 | — | 131 |
| person | 3,211 | 2,695 | 2,492 |
| event | 2,357 | 590 | 1,405 |
| work | 1,153 | 213 | 92 |
| place | 9 | 1,475 | 208 |
| passage (non-quran) | — | 1,039 | — |
| object | 4 | 490 | 22 |
| concept | 10 | 134 | 681 |
| question | — | 182 | 38 |
| exhibit | — | 296 | — |
| screen | — | 234 | — |
| group | 104 | — | 253 |
| polity | 82 | — | 93 |
| practice | 1 | — | 59 |
| **Total** | **12,391** | **7,598** | **7,530** |

The live ranked queue `docs/delegation/empty-records-priority.md` (computed 21 Oct) reported 13,986 missing / 6,551 thin excluding meta; my recount differs slightly because the prose-backfill lane has since landed 68 batches (1,487 records) — the queue file is stale and must be regenerated at Phase 1 start (the lane doc already requires re-ranking after large merges).

### 1.2 Completeness distribution (`status.completeness`)

| Level | Entities |
|---|---|
| 0 | 3 |
| 1 | 28,802 |
| 2 | 5,907 |
| 3 | 63 |
| 4–5 | 0 |
| unset | 17 |

Nothing in the corpus reaches completeness 4–5; only 63 records sit at 3.

### 1.3 Thin layers

- `practice`: **60** records (the prompt said 53; growth since). Five pillars exist (`salah`, `wudu`, `zakat`, `sawm-ramadan`, `hajj`, `umrah`) but as single cards — no conditions/integrals/invalidators structure, no per-madhhab `perspectives`, no linked fiqh `concept` layer.
- `concept`: 825 · `question`: 220.
- `passage/quran-*` ayah records: 6,236 frozen records, plus `mentions` edges on 570 ayat — but no tafsir layer at all (no `commentary_on` edges; see §3.3).
- Modern era: **3,065** entities carry `period/modern-era` (1,143), `period/colonial-era` (1,346) or `period/contemporary-era` (576); only **602** entities have an explicit `edtf` year ≥1900. Wings `living` = 36, `today` = 6 — the "living" wing is nearly empty.

### 1.4 Sources and dated facts

| Sources per entity | Count |
|---|---|
| 0 | 306 |
| 1 | 25,906 |
| 2 | 7,699 |
| 3+ | 881 |

- **7,038** entities contain a dated field (`born`/`died`/`date`/`founded`/`built`…); **6,245 of them (89%) are single-sourced.**
- Wikidata-import provenance: **~11,700 records** carry a `wikidata-*` run tag — the largest single-source cohort and the Phase 5 starting cohort.
- Top-5,000 most-linked tier (inbound-link ranking recomputed): average **1.417** sources per entity — already above the corpus 1.285 but below the 1.6 target; prose state of that tier: 6 missing, **1,739 thin**, 2,536 full; completeness: 3,091 at 1, 1,140 at 2, only 38 at ≥3.
- Inbound links: 21,975 entities have ≥1 link, 12,817 have zero. Link-count thresholds: rank 500 = 44 links, 1,000 = 19, 2,000 = 10, 3,000 = 7, 5,000 = 4.

## 2. Lane definitions (Phases 1–5)

Collision check performed against `docs/agents/lanes.md` (23 Oct 2026): none of the names below exist in the registry. Overlaps are stated per lane.

### Phase 1 — `prose-backfill-2` (prose depth, sibling lane)

- **Scope.** Raise prose depth on the same ranked queue as `prose-backfill`, on a disjoint partition so no record is worked twice.
- **Queue split.** Regenerate `empty-records-priority.md` at lane start. Partition rule: `prose-backfill` continues **thin files (<800 bytes) top-down** as it already does; `prose-backfill-2` takes the **missing-prose tier ranked by inbound links, top-down, starting at the head of the list** — and stops before the zero-link tail (the ~12.8k zero-link records stay with the original lane's class-by-class sweep). The boundary is restated in both progress files at each regeneration.
- **Content rule.** Each record goes to **completeness ≥3**: sourced Arabic prose in the house section structure (`## موجز` + class sections), **with English and Urdu prose in the same batch** — the ar+en+ur same-commit rule of `AGENTS.md` (in force since 18 Oct) applied strictly. (The existing `prose-backfill` lane's ar-only convention predates the rule; the new lane follows the rule and notes batches for `en-translation`'s progress file anyway.)
- **Sourcing.** Written from sources already cited in the record, or real book sources found per the lane doc — never Wikipedia/Wikidata alone.
- **Batch order.** Missing prose ranked by inbound links, grouped by class and by source so one book is mined once.
- **Target.** Top-5,000 tier: thin 1,739 → 0 and completeness ≥3 on the tier (currently 38). Broader target from the work order: 5,000 records raised to completeness ≥3. Progress reported every 10 batches from regenerated coverage.
- **Registration at Phase 1 start:** `docs/agents/lanes/prose-backfill-2.md` + registry row; progress `docs/delegation/prose-backfill-2-progress.md`; branch `content/prose-backfill-2`; stubs `data/_stubs.d/prose-backfill-2.yaml`; prefix `content(prose-backfill-2)`.

### Phase 2 — `practice-fiqh` (practice & applied fiqh)

- **Scope.** Practice and applied fiqh as documented knowledge — `practice` records plus the linked fiqh `concept` records. Distinct from `lib-exp-usul-fiqh-depth` (Claude-owned book mining of al-Shafi'i, al-Juwayni, al-Ghazali, al-Shatibi, Ibn Rushd, Ibn Qudama **and the Mawsu'a Fiqhiyya headwords, actively in progress** — currently mining the Kuwaiti encyclopedia at headword «ابن», scan p.1456). Collision protocol: this lane reads `docs/delegation/library/usul-fiqh-depth.md` before every batch; headwords that lane has mined or is mining are **recorded in the progress file and skipped** — this lane extends `practice` records and their links, it does not re-mine headwords the book lane owns.
- **Content (batch order).**
  1. Five pillars end-to-end: purification (wudu/ghusl/tayammum conditions & invalidators), prayer (fard, sunna, congregational, traveller, funeral, make-ups, Friday, Eid, khawf, kusuf — several `practice/salat-*` cards already exist and are extended, not duplicated), fasting (Ramadan, make-ups, kaffara, i'tikaf), zakat per asset class (money, crops, livestock, trade goods, zakat al-fitr), hajj and umrah rites step by step (ihram, tawaf, sa'i, wuquf, hady…).
  2. Everyday layer: prayer times & qibla, janaza, marriage & divorce procedures as documented, dietary rules & slaughter, oaths, dress and greeting etiquettes — each a record, not an essay.
  3. Linked `concept` records the practices name (arkān, shurūt, mubṭilāt, nisāb…).
- **School differences** go in `perspectives` with `issue`, attributed to named school sources (`docs/plan/20-opinions.md` structure: Sunni first, academic next, others last, no verdict). Contemporary applications (zakat on salaries/savings, medical fasting questions, air-travel prayer) are recorded only as attributed positions of named published scholarly bodies or works, cited.
- **Source corpora.** Fiqh works already extracted on the harvest drive: `fiqh-sunna`, `majmu-nawawi`, `mughni-ibn-qudama`, `bidayat-mujtahid(-ibn-rushd)`, `hidaya-marghinani`, `mudawwana`, `umm-shafii`, `radd-muhtar`, and the Kuwaiti Fiqh Encyclopedia (`fiqh-mawsua-kuwaitiyya-noor-v3`, 18,079-page OCR verified) — facts and page references per `mining-sources.md`; encyclopedia text summarised in our words, never copied.
- **Target.** `practice` 60 → **300+** records (the prompt's baseline of 53 is superseded by the recount), plus the linked fiqh `concept` records (estimated 150–250, counted at phase end).
- **Registration at Phase 2 start:** `docs/agents/lanes/practice-fiqh.md`; progress `docs/delegation/practice-fiqh-progress.md`; branch `content/practice-fiqh`; stubs `data/_stubs.d/practice-fiqh.yaml`; prefix `content(practice-fiqh)`.

### Phase 3 — `lib-tafsir-ibn-kathir` (tafsir layer)

- **Scope.** Mine Tafsir Ibn Kathir per `lanes/library.md` + `mining-sources.md` + `categories/tafsir.md`: own-words summaries of the commentary per passage, key excerpts ≤40 words, attributed to the mufassir with page.
- **Link mechanism — no schema change needed.** The predicate `commentary_on` (inverse `has_commentary`) already exists in `schema/predicates.yaml`, and `passage/quran-<sura>-<aya>` records carry `mentions` edges. Tafsir coverage = `commentary_on` edges from the Ibn Kathir `work`/`source` record to ayah records plus short attributed explanation notes on those records, exactly as `categories/tafsir.md` prescribes. No new predicate proposed.
- **Text.** `tafsir-ibn-kathir` is in `books.yaml` (cat `tafsir`, line 93) and already extracted on the harvest drive (`books/tafsir/tafsir-ibn-kathir/`); edition/item and page offset recorded in the progress file before batch 1.
- **Batch order.** Introduction + mufassir biography (batch 1), then al-Fatiha, then Ya-Sin, al-Kahf, al-Mulk, ar-Rahman, al-Waqi'a, then Juz 'Amma complete (suras 78–114), then mushaf order from al-Baqara.
- **Per-sura record counts** (ayah records touched by `commentary_on` edges): Fatiha 7 · Ya-Sin 83 · Kahf 110 · Mulk 30 · Rahman 78 · Waqi'a 96 · Juz 'Amma ~564 ≈ **968 ayah records** this phase, plus ~30 tafsir-concept records and the mufassir/source layer.
- **Where commentators differ:** `perspectives` per content-standards §13a; where Ibn Kathir transmits a position, attributed to him with the page; doubt markers («يقال», weak reports) preserved as `status: debated`.
- **Target.** The six named surahs + Juz 'Amma fully covered; intro/biography/source layer complete.
- **Collision check:** no `lib-tafsir-*` lane exists; `lib-exp-qisas-prophets` mines Ibn Kathir's *Qisas al-Anbiya'* — a different book, noted for the shared author. `Tafsir al-Manar` hits in `lib-exp-modern-muslim-writers` point at this lane per the registry's own note.
- **Registration at Phase 3 start:** `docs/agents/lanes/lib-tafsir-ibn-kathir.md`; progress `docs/delegation/library/tafsir-ibn-kathir.md`; branch `content/lib-tafsir-ibn-kathir`; stubs `data/_stubs.d/lib-tafsir-ibn-kathir.yaml`; prefix `content(lib-tafsir-ibn-kathir)`.

### Phase 4 — `modern-century` (1900 → today)

- **Scope.** Entities and events of the modern century: scholars and thinkers, universities and academies, publishing and media institutions, revival and reform movements, conferences and organisations, the institutional history of Islam in Europe, the Americas, Africa and Asia. Coordinate with `lib-exp-modern-muslim-writers` (Claude-owned, book mining): this lane does entities/events/institutions, **not their books**.
- **Living-person discipline.** Public documented facts only; two sources for every dated fact; no evaluative claims about living persons; contested characterisations only as attributed `perspectives` or omitted.
- **Source corpora.** The modern survey works already in the canon and harvest (`tarikh-islam-hasan-ibrahim` — already the single most-cited source, 6,849 inbound links; `al-aalam`; Azhar Academy series titles already prose-covered by `prose-backfill`), the modern institutions named in wanted stubs, plus per-entity book sources per mining rules — never Wikidata alone.
- **Cohort.** ~1,500 entities/events at **completeness ≥2** with prose, prioritised by (a) inbound-link rank on the modern-era subset (the 3,065 records above, of which most are stubs and draft cards), (b) wanted stubs naming modern institutions/persons, (c) the zero-prose modern cohort. The exact ranked list is produced at lane start from a regenerated priority report.
- **Target.** Wing `living` 36 → several hundred; `contemporary-era` coverage expanded with sourced records; prose on every lane-written entity (ar+en+ur same batch).
- **Registration at Phase 4 start:** `docs/agents/lanes/modern-century.md`; progress `docs/delegation/modern-century-progress.md`; branch `content/modern-century`; stubs `data/_stubs.d/modern-century.yaml`; prefix `content(modern-century)`.

### Phase 5 — second sources and review preparation

- **Scope.** Sweep the single-source dated-fact cohort — **6,245 entities** — starting with the ~11,700-record `wikidata-*` provenance cohort, adding a genuine second source per dated fact or confirming an explicit `needs_source`/flag.
- **Order.** Top-5,000 most-linked tier first (its flagged/single-source dated facts), then the rest of the dated cohort by inbound links.
- **Target.** Average sources per entity on the top-5,000 tier **1.417 → ≥1.6** (corpus-wide 1.285 → reported alongside), measured by coverage regeneration; every dated fact on the swept records two-sourced or explicitly flagged.
- **Publication.** Records are published under `docs/agents/publication-standard.md`: citations to defined sources and recorded provenance are the whole bar — no review step, and one source is enough for any fact. (The former review-packet system, and the short-lived promotion protocol that replaced it, were both abolished on 24 Oct 2026.)

## 3. Targets and execution order

| Phase | Lane | Primary measurable target |
|---|---|---|
| 1 | `prose-backfill-2` | 5,000 records to completeness ≥3; top-5k tier thin 1,739 → 0 |
| 2 | `practice-fiqh` | `practice` 60 → ≥300 + linked fiqh concepts |
| 3 | `lib-tafsir-ibn-kathir` | 6 named surahs + Juz 'Amma ≈ 968 ayah records with `commentary_on` coverage |
| 4 | `modern-century` | ~1,500 modern entities/events at completeness ≥2 with prose |
| 5 | second-sources sweep | top-5k tier avg sources 1.417 → ≥1.6; records published under the publication standard |

Execution in the order 1 → 5. A phase boundary is an exit check, not a stop (amended 24 Oct 2026): the phase exits when its metrics are recorded in its progress file — its coverage delta achieved and zero unresolved contested flags — and the next phase starts. Phases may overlap when their queues are disjoint; the queue split and the usul-fiqh collision protocol keep them so.

## 4. Explicitly not in this programme

Per the work order: other traditions' primary-text lanes (e.g. a Shia library lane — a charter decision for the founder; surfaced here as a noted need, not opened); audio/recitation and media infrastructure; any UI/layout/site-code change; any schema/class/predicate/enum change (each goes to the founder via a request file if the need surfaces); the graph explorer, search configuration, and the 2026-10-23 fix-prompt items (Claude's work order).

## 5. Reporting

- **Per batch:** progress-file update (records done, duplicates skipped, flags raised) + regenerated `docs/coverage.md` in the same commit.
- **Per phase:** a completion section appended to this file with before/after coverage numbers, plus a short summary to the owner. Lane registrations (lane doc + registry row + progress file + stubs file) happen in each phase's first batch PR, not before.
