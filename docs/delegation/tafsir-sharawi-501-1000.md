# Tafsir Sha'rawi (Khawatir, scan title «تفسير الشعراوي») pages 501 to 1000: progress

Owner: harvest run `tafsir-sharawi-501-1000`. Branch `harvest/tafsir-sharawi-501-1000`, one pull request against `main`, not merged by the agent.

## State

- Last page reached and written: **696** (of 501 to 1000). Batches 1 to 4 (501 to 596) and batch 5 (597 to 696) are committed; batch 5 is in its own commit.
- Source entity: `source/tafsir-sharawi-khawatir-scan-pp-501-1000` (created in batch 1). Edition not identified; flagged unverified in its `reliability_note`. Citations use the scan's page index.
- Claims table (not in git): scratchpad `tafsir/claims-501-1000.md`.

## Batches

| batch | pages | new entities | reused entities (extra source or text) | commit |
|---|---|---|---|---|
| 1 | 501 to 530 | 2 (`concept/al-naskh`, `concept/al-taabbud`) + 1 source | 2 (`event/change-of-qibla`, `concept/zakat`) | 6530d3f22 |
| 2 | 531 to 554 | 3 (`concept/al-tanzih`, `concept/al-kun-fa-yakun`, `concept/al-ard-masjid-wa-tahur`) | 1 (`concept/ahl-al-kitab`) | c74b79bb7 |
| 3 | 555 to 580 | 4 (`concept/al-yaqin`, `concept/al-balagh`, `concept/al-qawaid-min-al-bayt`) | 3 (`person/ibrahim`, `concept/hawa`, `event/isra-and-miraj`) | 56de692e2 |
| 4 | 581 to 596 | 3 (`concept/al-rizq-al-rububi`, `concept/al-wasiyya-al-diniyya`) | 5 (`concept/hurmat-al-haram-makka`, `concept/niyya`, `concept/tawba`, `concept/islam-din`, `concept/al-sunna-al-nabawiyya`) | eaa8cf539 |
| 5 | 597 to 696 | 10 (`concept/ism-al-ab-fi-al-quran`, `concept/millat-ibrahim`, `concept/sibghat-allah`, `concept/ikhlas`, `concept/nasab-al-iman`, `concept/shukr`, `concept/istirja`, `concept/salawat-min-allah`, `concept/al-sai-bayn-al-safa-wal-marwa`, `concept/al-laana`) | 10 (`concept/kasb`, `event/change-of-qibla`, `concept/ummat-wasat`, `concept/al-taabbud`, `concept/ahl-al-kitab`, `concept/tawakkul`, `concept/sabr`, `concept/tawba`, `concept/tawhid`, `concept/ibtila`) | (this commit) |

Batch 5 notes: pages 655 to 658 are the printed index and are skipped. Verses 2:165 to 2:168 (pages 693 to 697) are read but no entity was written for them yet. Two passages cited as Sha'rawi's view are contested and carry a scope note (the sa'y as a pillar; the lineage of the descendants). The Azar reading (p. 598) is Sha'rawi's alone; other exegetes are not entered.

## Flags for review

- `person/sad-ibn-muadh`: the scan (page 502) calls Sa'd a rabbi of the Jews; the entity records him as chief of the Aws. Not changed; reviewer to decide.
- The Qur'an text the scan prints is never copied; verses are referenced by passage id only.
- Anecdotes in the scan without a named book (page 518, the night patrol) are not entered.
- Other views on naskh and on the reasons for rulings (usul scholars, academic, other) are not yet entered; each perspectives block says so.

## Translation

- New entities: Arabic first, English and Urdu drafts in the same commit (`status.review: draft`).
- Reused entities: Sha'rawi paragraph added in Arabic, English and Urdu.

## Next

Pages 531 onward: continue in page order in batches of about 30 pages, keeping the same rhythm (claims table, entities, checks, commit).
