# Harvest progress: Sha'rawi tafsir (Khawatir scan), pages 1039-1500

Owner: branch `harvest/tafsir-sharawi-1039-1500`, started from `origin/harvest/tafsir-sharawi-1001-1500`. Source edition: `source/tafsir-sharawi-khawatir-scan-vol-2` (edition and publisher unverified against the title page; see the source entity).

**Review note:** pages 1001-1038 are on PR #444 (`harvest/tafsir-sharawi-1001-1500`). This branch was cut from that branch, so its pull request contains those commits too and needs its own review later, after PR #444 is decided.

## Status

- Last scan page reached: **1238** (of 1039-1500). Pages 1239-1500 are not yet mined.
- Covered so far: Al-Baqara 244-285 on pp. 1039-1238, with the verse of the Throne (2:255) on pp. 1103-1110.
- Batch 2 (pages 1139-1238, Al-Baqara 260-285) added 13 draft entities, listed below.

## Batch 1 (pages 1039-1138)

Entities created (21), each with `status.review: draft`, a `provenance` block, and ar, en and ur prose in the same commit:

- Person: `person/talut`.
- Concepts: `concept/qard-hasan`, `concept/asking-for-a-king-for-jihad`, `concept/small-group-victory-over-many`, `concept/sacred-relics-and-sakina`, `concept/divine-repelling-of-people`, `concept/conflict-between-falsehoods`, `concept/al-mizan`, `concept/prophetic-knowledge-of-the-unseen`, `concept/tanzih-of-divine-attributes`, `concept/free-choice-and-compulsion`, `concept/divine-attributes-salaf-and-khalaf` (contested, with a perspectives block), `concept/kursi-allah`, `concept/names-in-ayat-al-kursi`, `concept/discoveries-as-hidden-secrets`, `concept/revival-after-death-stories`, `concept/abraham-and-the-one-who-argued`, `concept/taghut`, `concept/wilayat-allah`, `concept/imarat-al-ard`, `concept/no-compulsion-in-religion` (contested, with a perspectives block).

Entities reused and linked, not changed: `concept/tafdil-al-rusul` (2:253), `concept/quran-miracle-for-every-age` (2:253 and the miracle argument), `concept/ghayb` and `concept/shafaa` (unseen knowledge and intercession), `concept/tawhid` (la ilaha illa Allah, 2:255; Sha'rawi's material on it is not yet added), `concept/al-infaq-fi-sabil-allah` and `concept/al-infaq-al-amm` (2:254; not yet extended), `concept/ikrah` (legal compulsion; the theological verse entry is `concept/no-compulsion-in-religion`), `concept/qadar`, `concept/asma-allah-al-husna`, `concept/al-ummi`, `concept/ummat-wasat`, `concept/sabr`, `person/muhammad-mutawalli-al-shaarawi`. Persons `person/dawud` and `person/ibrahim` exist and are the obvious targets for the Dawud and Abraham material; they are not yet linked.

Claims table: scratchpad `claims-1039-1500.md` (not in git).

## Batch 2 (pages 1139-1238)

Entities created (13), draft, with ar, en and ur prose in the same commit: `concept/rizq-al-salb`, `concept/mann-and-adha`, `concept/public-and-secret-charity`, `concept/guidance-and-provision`, `concept/ahl-al-suffa`, `concept/debt-writing-and-witnessing` (contested, with a perspectives block), `concept/amanah`, `concept/divine-ownership-of-all-things`, `concept/people-of-the-heights-and-the-scales`, `concept/inner-thoughts-and-accountability` (with a perspectives block), `concept/diversity-of-talents-and-interdependence`, `concept/hikma`, `concept/three-sources-of-economy`.

Reused and not changed: `concept/riba` (2:275-281, Sha'rawi's long commentary is recorded in the claims table only; a later pass should extend the entity), `concept/zakat`, `concept/sadaqa`, `concept/taqwa`, `practice/nadhr`, `concept/ihsan`, `concept/tawba`, `person/al-hasan-al-basri`, `concept/qard-hasan` (extended in the claims table only), `concept/imarat-al-ard`.

Claims table for pages 1139-1238 is in the scratchpad (`claims-1139-1222.md` and `claims-1039-1500.md`), not in git.

Notes:
- `person/talut` is listed in the shared `data/_stubs.yaml`; the validator asks for that stub line to be removed. Left untouched because the shared file is append-only.
- Several reported claims are dated or historical and are flagged in the claims table as not checked: the economists cited for riba (p. 1189-1190), the orientalists on the grammar of 2:280 (p. 1204), the jurists on zakat as creditor's right (p. 1209), and the Fatima and Umar anecdotes (pp. 1150, 1229).

## Contested points

- Sacred relics (pp. 1048-1051): Sha'rawi holds that relics should be kept. Other views not checked.
- Attributes such as the hand of God (p. 1104): salaf and khalaf approaches as Sha'rawi reports them. The salaf and khalaf positions are his report and have not been checked against their books.
- No compulsion in religion (pp. 1111-1114): his distinction between compulsion into belief and compulsion to duties, and his reading of the jizya and early weakness, are not checked against historical sources.
- Abraham and the one who argued (pp. 1121-1129): the identification with Nimrud is an exegetes' view he reports.
- Revival stories (pp. 1130-1138): the identification of the passer-by with 'Uzayr is reported as the view of most scholars; the family narratives are not checked against their sources.

For every contested entity the academic and other views are not yet checked, and each entity says so.

## Known gaps

- Relations: all new entities have `relations: []`. Links are prose links only. Typed relations (for example `based_on` to the passages) need the passage-side predicates and are a clean-up step.
- Reused entities that Sha'rawi extends (`concept/tawhid`, `concept/al-infaq-fi-sabil-allah`, `concept/ghayb`) are not yet edited; the material is in the claims table for a later pass.
- The edition is unverified. Citations use the scan page index (`p.N`), not a printed page number; every page must be checked against a printed copy.
- Several hadiths and narratives are cited inside Sha'rawi's footnotes or stories (Abu Dhar on the kursi, the Abu Hurayra report, the 'Uzayr narrative) and are recorded as his citations, not checked.
- Passage ids are used in prose only where the passage exists in `data/passage/`.

## Next

Batch 2 (pages 1139-1238), then 1239-1338, 1339-1438, 1439-1500. Each batch: read in windows, claims table in the scratchpad, entities in one commit with coverage regenerated, `npm run validate` at 0 errors, `verify_cites.py` at 0 problems.
