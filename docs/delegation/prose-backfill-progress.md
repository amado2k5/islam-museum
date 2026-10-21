# `prose-backfill` lane progress

Lane doc: `docs/agents/lanes/prose-backfill.md`. Ranked work list: `docs/delegation/empty-records-priority.md` (regenerated 21 Oct 2026, 33,522 entities on main).

## Baseline (21 Oct 2026)

- Missing Arabic prose: 13,986 entities (13,466 excluding meta-classes `source/ media/ listing/ dataset/ language/ passage/quran-*`).
- Thin (<800 bytes) Arabic prose: 13,203 files (6,551 excluding meta-classes).
- Missing by class: building 5,469 · person 4,194 · event 2,402 · work 1,168 · group 104 · concept 22 · place 16 · object 4 · (passage/journey/polity/practice/question/screen: small tails, see report).
- Thin by class: person 2,051 · place 1,477 · object 490 · event 322 · work 195 · group 73 · concept 56 · building 55.
- The 13 empty `period/*` pages from the October report are all written — tier closed.

## Position

Top of `empty-records-priority.md`, class `building` missing list is rank-sorted by links; the linked-head of the whole report is `person/nafi-mawla-ibn-umar` (560 inbound), `person/hisham-ibn-urwa` (489), `person/zayd-ibn-aslam` (340) — these sit under `person`, not `building`, so the true start is the person missing-list.

## Batches

### 001 — 21 Oct 2026 (commit in this push)

Trilingual prose (ar+en+ur) for 13 `person` entities at the linked-head of the report. Sources read on the page in the harvest OCR library:

- `person/nafi-mawla-ibn-umar` (560 inbound) — wafayat-ayan, ihsan-abbas v5 tarjama (unpaged OCR → bare cite)
- `person/hisham-ibn-urwa` (489) — wafayat-ayan v6 tarjama (bare cite)
- `person/zayd-ibn-khalid-al-juhani` (32) — ibn-hajar-isaba p.515
- `person/muhammad-ibn-al-munkadir` — deferred: entry not yet located on the page
- `person/abu-bakr-ibn-abd-al-rahman-ibn-al-harith`, `person/amr-ibn-shuayb`, `person/malik-ibn-abi-amir-al-asbahi` — deferred to next batch
- `person/abu-umama-ibn-sahl-ibn-hunayf` (24) — ibn-hajar-isaba p.1620-1
- `person/sahl-ibn-hunayf` (14) — usd-al-ghaba p.364-5
- `person/abu-qatada-al-ansari` (12) — ibn-hajar-isaba p.1747
- `person/abu-waqid-al-laythi` (12) — ibn-hajar-isaba p.268
- `person/amir-ibn-rabia` — deferred: his isti-ab/usd-ghaba entry not yet pulled
- `person/abdallah-ibn-abdallah-ibn-umar` (8) — ibn-hajar-isaba p.908
- `person/abd-al-rahman-ibn-kab-ibn-malik` (8) — ibn-hajar-isaba p.823
- `person/suhayl-ibn-bayda` (7) — ibn-hajar-isaba p.629
- `person/umm-kulthum-bint-abi-bakr` (5) — ibn-hajar-isaba p.2030-1
- `person/asim-ibn-umar` (4) — ibn-hajar-isaba p.746
- `person/abu-humayd-al-saidi` (4) — ibn-hajar-isaba p.1653

Validation: 0 errors; tests pass; coverage regenerated. Urdu translations shipped in the same commit per AGENTS.md.
