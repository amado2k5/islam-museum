# Tafsir Sha'rawi (Khawatir, scan title «تفسير الشعراوي») pages 501 to 1000: progress

Owner: harvest run `tafsir-sharawi-501-1000`. Branch `harvest/tafsir-sharawi-501-1000`, one pull request against `main`, not merged by the agent.

## State

- Last page reached and written: **530** (of 501 to 1000).
- Source entity: `source/tafsir-sharawi-khawatir-scan` (created in batch 1). Edition not identified; flagged unverified in its `reliability_note`. Citations use the scan's page index.
- Claims table (not in git): scratchpad `tafsir/claims-501-1000.md`.

## Batches

| batch | pages | new entities | reused entities (extra source or text) | commit |
|---|---|---|---|---|
| 1 | 501 to 530 | 2 (`concept/al-naskh`, `concept/al-taabbud`) + 1 source | 2 (`event/change-of-qibla`, `concept/zakat`) | see PR |

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
