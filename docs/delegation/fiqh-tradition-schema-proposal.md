# Proposal: split `school` into `fiqh_affiliation` and `theological_tradition`

Status: **approved as a separate governance proposal** (founder ruling Q4-d, 2026-11-08). Not part of canon batch-01; stopgap `label`/`other` used for Ibn Arabi meanwhile.

## Problem

The authenticity register's single `school` enum (`sunni/shia/mutazili/ibadi/other/unverified`) cannot express scholars whose jurisprudential affiliation and theological tradition differ — Ibn Arabi (Maliki/Zahiri fiqh, Akbari aqidah/tasawwuf), al-Jahiz (Sunni-adjacent adab, Mu'tazili theology), al-Sarraj (Sunni frame, formative Sufi manual). Forcing one axis misstates the record or erases the contest the museum's doctrine says to preserve.

## Proposal

Replace/augment `school` with two fields:

- `fiqh_affiliation`: the author's school of jurisprudence — `hanafi/shafii/maliki/hanbali/zahiri/jafari/ibadi/none-attested/unverified`
- `theological_tradition`: creed/movements — `sunni-athari/sunni-asari/mutazili/shia-twelver/shia-ismaili/shia-zaydi/sufi-akbari/sufi-sunni/ibadi/other/unverified`

`school` may remain as a derived display field for backwards compatibility during migration.

## Touch points

- `scripts/harvest/library/authenticity.yaml` (schema + existing entries)
- `scripts/check-authenticity.ts` (validation rules per axis)
- `scripts/harvest/library/authenticity_gate.py` (matching unaffected — edition-based)
- `docs/delegation/authenticity-policy-proposal.md` §8 (school-check wording)
- `docs/delegation/canon-batch-01-proposal.md` and future batches (evidence columns)

## Open questions for the founder

1. Does `accept` still require `theological_tradition: sunni-*` only, or is a labelled non-Sunni tradition with verified fiqh acceptable as `label` (current behaviour, made explicit)?
2. Migration: backfill existing entries or apply to new decisions only?
3. Enum naming — Arabic-first labels needed for any UI surfacing.
