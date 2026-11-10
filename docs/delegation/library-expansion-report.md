# Library expansion: report

Workstream prompt of 18 Oct 2026. Coordinator: library-expansion (Claude).

## Stage reached

- **Done:** ten lanes registered in `docs/agents/lanes.md` and `docs/status.md`; ten progress files created under `docs/delegation/library/` (`medicine-science`, `sufism`, `poetry-adab`, `siyasa-hisba`, `heresiography-polemics`, `qiraat-grammar`, `qisas-prophets`, `regional-histories-travel`, `usul-fiqh-depth`, `modern-muslim-writers`).
- **Not started:** the download, OCR, distillation, verification and publication stages. The prompt holds them until the lanes commit is on `origin/main`.
- **Not started:** per-lane worker agents. The coordinator has not spawned them.

## Per lane

| Lane | Located | Downloaded | OCRed | Distilled | Verified | Published | Entities |
|---|---|---|---|---|---|---|---|
| medicine-science | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| sufism | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| poetry-adab | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| siyasa-hisba | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| heresiography-polemics | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| qiraat-grammar | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| qisas-prophets | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| regional-histories-travel | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| usul-fiqh-depth | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| modern-muslim-writers | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Duplicates found

Pre-check only (`grep -ril` over `data/`, 18 Oct 2026). Hit counts are title-token matches, not confirmed duplicates. Each lane checks its own list before adding a book.

- Al-Hikam (Ibn Ata' Allah): no text in `data/`. `lib-jami-ulum-hikam` is Ibn Rajab's commentary on the Forty Hadith, a different book.
- Al-Mawardi, Ibn Khaldun al-Muqaddima and Ibn Hazm al-Fisal: already in the canon (hits in `data/`).

## Blocked

None yet.

## Gates hit

None yet. The lanes commit is `non-impacting` (registry and progress files only).

## Decisions needed from the founder

1. Confirm the lane count and slugs as listed above.
2. Confirm that new books may be added to `scripts/harvest/library/books.yaml` in each lane's own commit.
3. Confirm the 50 GiB free-space floor on `/Volumes/exmicroSD` before downloads (`df` shows the volume is mounted).
