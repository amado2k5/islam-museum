# Person/place geo enrichment — consolidated merge report

Consolidation of three parallel enrichment worktrees into `devin-person-full-merge`
(base fast-forwarded to `origin/main` 5e85e2dbcf; sources were based on f2644ef3ed).
Source worktrees and the main checkout were not modified. Nothing committed.

- A: `devin-person-full-a` — report `docs/reports/person-place-geo-a.md`
- B: `devin-person-full-b` — report `docs/reports/person-place-geo-b.md`
- C: `devin-person-full-c` — report `docs/reports/person-place-geo-c.md`

## Person coverage

Changed `data/person/*.yaml` per source, checked against the alphabetical ranges over
the full person index (11,310 files):

| Source | Range | Files changed | Inside range | Outside range |
|--------|-------|---------------|--------------|---------------|
| A | 1–3770 | 2,793 | 2,793 | 0 |
| B | 3771–7540 | 3,140 | 3,140 | 0 |
| C | 7541–11310 | 1,181 | 1,181 | 0 |

Total person files applied: 7,114 (+1 further person file touched by a dedup
retarget = 7,115 modified/new person paths in the worktree). No person path was
written by more than one agent; no field-merge was needed for persons.

## Other classes merged

- `data/source/`: 2 files (cgie-encyclopaedia, tarajm-com) from A.
- `data/language/indonesian.yaml` from B.
- `data/_stubs.d/`: A's edits to `claude-ocr-harvest-i`, `devin-batch25a`,
  `lib-kamil-v2`, `screen-index`; plus 6 stub lines removed during consolidation
  for places actually written (`place/ani`, `place/abu-dhabi`, `place/gwalior`,
  `place/dubai`, `place/bhopal`, `place/birmingham`). No unrelated stub entries
  were touched.
- `docs/reports/`: all three source reports kept verbatim.
- `data/event/mamun-egypt-entry.yaml` and `data/time-browser-media-index.json`:
  retargeted `place/egypt` → `place/misr` (dedup side-effect, consistent).

## Places

Changed `data/place/*.yaml` per source: A 662, B 1,065, C 140; union 1,774 paths.

- **1,686 paths** written by exactly one agent: copied verbatim.
- **88 paths** written by 2–3 agents: semantic YAML merge (label/summary merged
  per language preferring the richer text; external_ids/sources/aliases/
  historical_names unioned; coordinates taken from the record with the best
  `coordinate_precision`; `kind` by majority or richest record on tie; provenance
  rewritten as `run: person-place-geo-merge` with `merged_from` listing the
  contributing runs; all kept `status.review: draft`).
- Post-merge fixes: stray `global`/wrong secondary regions removed from
  bangladesh, bengal, canada, china, india, libya, malaysia, nigeria, portugal,
  senegal, somalia, baku (→ persia-central-asia only), mostar (→ anatolia-balkans),
  kuwait-city (→ arabia). Dict-valued `education` blocks restored on al-andalus,
  armenia, yemen after a union bug (caught by the validator).

## Deduplication (canonical meaning, not filename)

Checked every new place against all places by `external_ids.wikidata`,
`external_ids.geonames`, ar/en/ur labels, kind, coordinates and region.
38 duplicate records folded into 36 canonical entities; the loser's id was added
to the winner's `aliases`, every `place/<loser>` reference in `data/`, `content/`
and the media index retargeted (241 files), and the redundant file deleted. No
`-2` slugs exist.

Merged (duplicate → canonical): belbis→bilbays, aceh→atjeh, afshona→afshana,
afyonkarahisar→afyon, prusac→ak-hisar, al-ahsa-city→al-ahsa, faiyum→al-fayyum,
el-fustat→al-fustat, giza→al-jizah, karkh→al-karkh, hebron→al-khalil,
seleucia-ctesiphon→al-madain, ctesiphon→al-madain, almer-a→almeria,
qatif→al-qatif, al-salihiyah→al-salihiyya, babylon→babil, bahrain→bahrayn,
beirut→bayrut, qur-ubah→cordoba, crete→iqritish, egypt→misr, gabala→jabala,
hillah→hilla, khwarazm→khwarizm, m-laga→malaga, ma-r→majrit, mallorca→majorca,
silvan→mayyafariqin, osh→ush, safed→safad, sindh→sind, suez→suways,
tbilisi→tiflis, termez→tirmidh, usa→united-states,
uae→united-arab-emirates. Winner regions were re-pinned where the thin dup had
polluted the union (al-ahsa, al-karkh, almeria, hilla, al-qatif, sind, bahrayn,
tiflis, al-madain).

Deliberately kept separate after inspection (same or similar label, different
entity): amol (Āmol, Māzandarān) vs amul (Āmul on the Jayḥūn); helwan (Egypt) vs
hulwan (Zagros); sur (Oman) vs tyre (Lebanon); badr vs podor; al-mansura (Sind) vs
mansoura (Egypt) vs mansura-tlemcen; hyderabad-sindh vs hyderabad;
algeria (country) vs algiers (city); tunis vs tunisia; zanzibar city vs
zanzibar-islands; gorgan city vs jurjan province; isfahan vs isfahan-province;
kalat vs khanate-of-kalat; kerman vs kirman.

Pre-existing duplicates that were already on `main` before this merge (e.g.
al-meriyya vs almeria) were left untouched and noted, per the golden-set rule.

## Unresolved risks

- Many thin agent-created places carry `regions: [global]` (unassigned) or
  templated summaries ("City (Wikidata Q…)"); they are honest draft-tier records
  and need a later enrichment pass, not silent fixes.
- Coordinate divergence >0.5° flagged during merges on country-level centroids
  (afghanistan, algeria, badakhshan, bangladesh, canada, china, india, pakistan,
  portugal, somalia) — the best-precision version's point was kept; all remain
  `approx`-level records.
- `al-ahsa-city` carried wikidata Q98972377; its identity vs al-Ahsa oasis should
  be re-checked by a reviewer (merged into `place/al-ahsa` as an alias).
- `ma-r`/`almer-a`/`m-laga` slug spellings came from agent transliteration; they
  now live only as aliases of majrit/almeria/malaga.
- `place/herat` (and several persons such as person/naguib-mahfouz) still warn
  "is now written" in `_stubs` lists — pre-existing on `main`, not introduced by
  this merge; left for the owning lane.

## Validation

- `npm run validate`: **0 errors**, 8,412 warnings (51989 entities, 86072 prose
  files); authenticity 0 errors; extremism 0 errors; decision checks 220/220,
  sweep clean.
- `npm run graph`: 53,978 nodes (51,989 entities, 1,989 stubs), 104,552 edges.
- First consolidation run produced 7 errors (self-alias + education-shape +
  levels mismatch); all fixed in-worktree. Remaining warnings pre-date the merge.

## Second wave (reconciliation pass)

After the first consolidation each source worktree produced a second wave.
Deltas were detected by comparing current source state against the previously
applied file lists and file bytes (retarget-normalised); only real changes were
re-applied.

### Second-wave person coverage

| Source | Pass | New/changed person files applied | In range |
|--------|------|----------------------------------|----------|
| A | 4 | 7 | 7/7 |
| B | 3 | 85 | 85/85 |
| C | 2 | 2 | 2/2 |

Cumulative person files applied: 7,208 (+1 retarget-touched = 7,209 person paths
modified/new). Unresolved-person counts reported by the agents after their
latest passes: A 631, B 133, C 2,128 (merge confirmed all applied files were
in-range; these unresolved figures were not independently re-derived).

### Second-wave places

- **21 new place files from B**: bulandshahr, chhachh, coventry,
  davis-california, dubai, ghazipur, golra-sharif, kresek, los-angeles,
  madavoor, mansehra-district, mianwali-district, nanauta, new-york-city,
  phulwari-sharif, pindi-gheb, south-korea, tanda-ambedkar, turangzai, ulakan,
  washington-dc. Checked against every existing place by wikidata/geonames ids
  and ar/en/ur labels: **no canonical duplicates**; no `-2` slugs.
- `place/chhachh` coordinates (24.73, 68.5, Sindh) were checked: the historic
  Chhach of Sindh sits there; kept as `coordinate_precision: approx` with the
  agent's wikidata note rather than inventing a Punjab correction.
- Second-wave edits to previously merged places (adra, afghanistan, doha,
  riyadh, tehran, karachi, london, mostar, rabat, yemen, zanjan, and ~75 more
  overlapping paths) were re-run through the semantic merge; all region fixes,
  education-block restores and dedup folds re-applied.
- Dedup winner aliases/provenance verified again after the re-merge; loser
  files re-deleted; 74 files re-retargeted (all residual loser-slug mentions
  are intentional alias/provenance-note lines).

### Second-wave validation

- `npm run validate`: **0 errors**, 8,412 warnings (52,009 entities, 86,072
  prose files); authenticity 0 errors; extremism 0 errors; decisions 220/220.
- `npm run graph`: 53,998 nodes (52,009 entities, 1,989 stubs), 104,764 edges.

## Third wave (reconciliation pass)

### Third-wave person coverage

| Source | Pass | People resolved | Person files applied | In range |
|--------|------|-----------------|----------------------|----------|
| A | 5 | ~220 (Wikidata place claims) | 215 | 215/215 |
| B | 4 | 27 | 27 | 27/27 |
| C | 3 | 1,023 | 1,022 (+6 re-edits) | all |

Cumulative person paths changed/new in the worktree: **8,473**.

### Third-wave places

- New place files: A 82, B 6, C 627 (plus re-created wave-1/2 losers re-deleted).
- Multi-agent overlapping place paths now **276** — all re-merged semantically;
  ~90 region/kind corrections applied where an agent's `global`,
  `andalus-europe` or `levant-iraq` generic value contradicted the place's
  actual geography (Balkan/Anatolian cities → `anatolia-balkans`, Iranian cities
  → `persia-central-asia`, Egyptian governorates → `egypt-nile`, Gulf cities →
  `arabia`, Uganda/Kampala/Aksum → `east-africa`, etc.).
- Kind corrections: `mamilla-cemetery` → site, `mount-qasioun` → mountain,
  `larissa` → city, `south-africa`/`byzantine-empire`/`arabian-peninsula` →
  region; wrong-language summary lines picked by the length heuristic were
  replaced with the correct agent's text.

### Third-wave deduplication

11 additional duplicates folded (loser → canonical): ak-ehir → aksehir,
ayd-n → aydin, esfarayen → isfarayin, madrid → majrit, tripoli →
tripoli-al-sham, jowzjan-province → jawzjan, ahvaz → al-ahwaz,
antakya → antakiya, jannat-al-mu-alla → jannat-al-mualla,
washington-d-c → washington-dc, turkestan → turkistan. Loser ids added to
`aliases`; 22 reference files retargeted. Cumulative dedup: **49 records into
47 canonical entities**.

Homonym split (intentionally kept separate): `place/aksaray` = the Istanbul
Fatih quarter (Q123751); `place/aksaray-q182025` = Aksaray city (Q182025) —
agent C's own Q-suffixed disambiguation kept; agent B's city record folded into
the -q182025 file; two ambiguous A/B person references retargeted to the city.
`place/akhisar` (Manisa, Turkey) vs `place/ak-hisar` (Prusac, Bosnia) share the
Arabic name آق حصار but are different places — kept separate.

### Polity-vs-place boundary (preserved)

~28 new `data/place/` files duplicate `data/polity/` entities by meaning
(abbasid-caliphate, umayyad-caliphate, rashidun-caliphate, fatimid-caliphate,
almohad-caliphate, ayyubid-dynasty, buyid-dynasty, seljuk-empire,
timurid-empire, mughal-empire, ottoman-empire, byzantine-empire, safavid-iran,
afsharid-iran, qajar-iran, durrani-empire, bornu-empire, deccan-sultanates,
marinid-dynasty, mamluk-sultanate-of-egypt, nabhani-dynasty, kazakh-khanate,
kingdom-of-aksum, adal-sultanate, caliphate-of-c-rdoba, sheba, indonesia,
kingdom-of-egypt). They were kept as place-class records (they carry the
geographic footprint that person relations point at) — cross-class aliasing is
not possible and retargeting `place/*` references to `polity/*` would corrupt
the boundary. Flagged for reviewer decision; no content deleted.

Pre-existing duplicates on `main` left untouched: antakiya vs antioch (the new
`antakya` record was folded into `antakiya`), al-meriyya vs almeria,
gorgan vs jurjan (city vs province), kalat vs khanate-of-kalat, kerman vs
kirman, isfahan vs isfahan-province, tunis vs tunisia, algeria vs algiers,
zanzibar vs zanzibar-islands, amol vs amul, helwan vs hulwan, sur vs tyre,
badr vs podor, the three Mansuras.

### Third-wave validation

- `npm run validate`: **0 errors**, 8,435 warnings; **52,494 entities**, 86,072
  prose files; authenticity 0 errors; extremism 0 errors; decisions 220/220.
- `npm run graph`: **54,483 nodes** (52,494 entities, 1,989 stubs),
  **109,304 edges**.

## Fourth wave (reconciliation pass)

### Fourth-wave person coverage

| Source | Pass | Delta applied | In range |
|--------|------|---------------|----------|
| A | 6 (running) | 227 person files | 227/227 |
| B | 5 | 29 person files | 29/29 |
| C | 4 | 245 person files | 245/245 |

(501 new paths + 13 re-edits = 514 person files re-copied; files that only
differed by dedup retargets were skipped.)

### Final coverage / unresolved (per agent reports, latest passes)

- **A**: 227 of the consolidated 416-file unresolved list resolved in pass 6 →
  **189 unresolved** of 3,770 (≈95% carry a person→place edge).
- **B**: 50 of 127 resolved in pass 5 → **77 unresolved** of 3,770 (≈98%).
- **C**: 250 of the consolidated 1,128-file list resolved → **878 remaining**
  on that list (of 3,770 in-range persons; mostly thin draft cards).

### Fourth-wave places

- New place files: A 7 (biqa, cambridge, lalish, maarrat-al-numan, scotland,
  sicily, yamama), B 0, C 20 (district/province gazetteer records).
- Dedup merges: `ma-arrat-nu-man` → `maarrat-al-numan`, `sicily` → `siqilliya`,
  `yamama` → `al-yamama` (aliases kept, references retargeted; one stale stub
  line for `place/al-yamama` removed from `data/_stubs.d/devin-people.yaml`).
- Region/kind corrections: `ko-arl-district`, `prizren-municipality` →
  anatolia-balkans; `dhaka-division` → province/south-asia.
- A reported 5 of its "new places" were actually `building/*` entities — those
  person edges retargeted to `building/*` by the agent, preserved as authored.
- 26 historical-state place files had wikidata IDs stripped by A where the ID
  belongs to the matching `polity/*` record — preserved as authored.
- Aksaray homonym split re-applied after the re-merge (Istanbul quarter at
  `place/aksaray`, city at `place/aksaray-q182025`).
- Cumulative dedup across all waves: **52 records folded into 50 canonical
  entities**. No `*-2` slugs.

### Fourth-wave validation

- `npm run validate`: **0 errors**, 8,452 warnings; **52,515 entities**,
  86,072 prose files; authenticity 0; extremism 0; decisions 220/220.
- `npm run graph`: **54,503 nodes** (52,515 entities, 1,988 stubs),
  **110,596 edges**.

## Fifth wave (reconciliation pass, verified deltas)

### Fifth-wave real deltas (verified, not reported)

- **A: no new deltas.** 0 new person paths, 0 new places, no content re-edits;
  only the `lib-kamil-v2` stub file differed and only by this merge's own
  `place/ani` removal. A's reported "416→227" was a stale summary; nothing to
  apply.
- **B**: 41 new person files + 1 re-edit (makhrama-ibn-nawfal), all in range;
  no new places.
- **C**: 113 new person files (all in range) + 24 new place paths
  (abha, balochistan, berkeley, brest, eritrea, france, gonbad-e-kavus,
  gothenburg, gresik, gujranwala, gujrat, guyana, jhelum, kelantan, linkoping,
  marseille, montreal, philadelphia, quetta, sargodha, sylhet + re-writes of
  bangladesh/pakistan/united-states which re-merged cleanly).

### Fifth-wave place review

- Collision check of all 24 C paths vs canonical slugs/labels/aliases/
  wikidata/geonames: no canonical duplicates. `gujrat` (Punjab city) kept
  separate from `gujarat` (Indian state) — homograph.
- Region corrections: eritrea → east-africa, gonbad-e-kavus →
  persia-central-asia, quetta/sargodha → south-asia.
- Full pipeline re-run idempotently (semantic merges, region/kind fixes,
  dedup folds incl. re-created wave-4 losers, aksaray homonym split,
  education-block restores). No `*-2` slugs.

### Exact person coverage (recomputed from `data/person/*.yaml`)

Schema-valid place predicates (`born_in`, `died_in`, `buried_in`, `lived_in`,
`traveled_to`, `ruler_of`, `ruled_over`) targeting `place/*`:

| Range | Covered | Unresolved | Coverage | Place edges |
|-------|---------|------------|----------|-------------|
| A (1–3770) | 3,581 | 189 | 95.0% | 4,506 |
| B (3771–7540) | 3,705 | 65 | 98.3% | 5,382 |
| C (7541–11310) | 3,000 | 770 | 79.6% | 4,168 |

(Totals 11,310 persons; B's unresolved is lower than the reported 36–77 because
the computed set counts every predicate type, incl. older edges.)

### Fifth-wave validation

- `npm run validate`: **0 errors**, ~8.5k warnings (pre-existing);
  **52,530 entities**, 86,072 prose files; authenticity 0; extremism 0;
  decisions 220/220.
- `npm run graph`: **54,518 nodes** (52,530 entities, 1,988 stubs),
  **110,916 edges**.

## Sixth wave (reconciliation pass, verified deltas)

### Sixth-wave real deltas (verified, not reported)

- **A: zero** — confirmed again; no new paths, no content re-edits.
- **B**: 31 new person files, all in range; no new places.
- **C**: 22 new person files, all in range; 7 place paths touched
  (ahmadnagar, bahmani, somalia, tafilalt, terengganu, ternate, tunisia).

### Sixth-wave place review

- Collision check of all 7 C paths vs canonical slugs/labels/aliases/
  wikidata/geonames:
  - `ahmadnagar` (Q403244, historic Deccan city) merged with `ahilyanagar`
    (Q223517, the 2023-renamed same city) → canonical `place/ahmadnagar`;
    `place/ahilyanagar` added to aliases; 2 person references retargeted
    (chand-bibi, bahadur-nizam-shah).
  - `bahmani` duplicates `polity/bahmani-sultanate` by meaning — kept as the
    place-class realm record per the standing polity-boundary decision
    (flagged, not deleted).
  - `tunisia`/`tunis`, country vs city — kept separate as before.
- Full pipeline re-run idempotently (semantic merges on 279 overlap paths,
  region/kind fixes, dedup folds, aksaray split, education restores).
  Cumulative dedup across all waves: **53 records folded into 51 canonical
  entities**. No `*-2` slugs.

### Exact person coverage (recomputed)

| Range | Covered | Unresolved | Coverage | Place edges |
|-------|---------|------------|----------|-------------|
| A (1–3770) | 3,581 | 189 | 95.0% | 4,506 |
| B (3771–7540) | 3,736 | 34 | 99.1% | 5,413 |
| C (7541–11310) | 3,022 | 748 | 80.2% | 4,191 |

### Sixth-wave validation

- `npm run validate`: **0 errors**, ~8.5k warnings (pre-existing);
  **52,534 entities**, 86,072 prose files; authenticity 0; extremism 0;
  decisions 220/220.
- `npm run graph`: **54,521 nodes** (52,534 entities, 1,987 stubs),
  **111,020 edges**.

## Seventh wave — B-only delta (ed381b49)

### Verified deltas

- **B only** (A and C still running; their worktrees not touched):
  29 person files applied (13 new paths + 16 re-edits: baha-al-dawla,
  bahram-i/ii, balash-ibn-firuz, farrukhzad-khosrow, fathali-hijab-shirazi,
  ibrahim-quli-qutb-shah, idris-shah-i-of-perak, ivan-iii-moscow,
  jafar-al-khatti, jashnasdah, khurrazad-khosrow, kisra-ibn-mihrajashnas,
  mahmud-shah-bahmani, mansur-ad-din-of-adal, mansur-ibn-nuh + new paths
  bad-al-kurdi, iraq-ibn-mansur-khwarazmshah, ishaq-ibn-ali-murabiti,
  jabala-ibn-al-ayham, janibeg-khan, karsasf-ibn-qaramard-al-kakuyi,
  khosrow-ii, mansa-musa, mansa-sulayman, mansur-umar-ibn-ali-rasuli,
  mari-jata, mawdud-ibn-masud, mengu-timur-dashti) — all in range.
- **New place `place/perak`** (Malaysian state/sultanate, Q188953): checked
  against all canonical slugs/labels/aliases/wikidata/geonames — no duplicate;
  copied verbatim (ar/en/ur labels+summaries, approx coords, draft,
  own-research provenance).
- B's report refreshed in `docs/reports/person-place-geo-b.md`.

### Exact person coverage (recomputed)

| Range | Covered | Unresolved | Coverage | Place edges |
|-------|---------|------------|----------|-------------|
| A (1–3770) | 3,581 | 189 | 95.0% | 4,506 |
| B (3771–7540) | 3,765 | 5 | 99.9% | 5,452 |
| C (7541–11310) | 3,022 | 748 | 80.2% | 4,191 |

### Seventh-wave validation

- `npm run validate`: **0 errors**, ~8.5k warnings (pre-existing);
  **52,535 entities**, 86,072 prose files; authenticity 0; extremism 0;
  decisions 220/220.
- `npm run graph`: **54,522 nodes** (52,535 entities, 1,987 stubs),
  **111,094 edges**.

## Eighth wave — A-only delta (afef5eb6)

### Verified deltas

- **A only** (C still running; its worktree not touched): **173 new person
  files**, all in range 1–3770; 0 re-edits on previously applied paths.
- **New place `place/aphrodisias`** (ancient Caria, Q181303): checked against
  all canonical slugs/labels/aliases/wikidata/geonames — no duplicate; copied
  and region corrected andalus-europe → anatolia-balkans (Asia Minor).
- A's report refreshed in `docs/reports/person-place-geo-a.md`.

### Exact person coverage (recomputed)

| Range | Covered | Unresolved | Coverage | Place edges |
|-------|---------|------------|----------|-------------|
| A (1–3770) | 3,754 | 16 | 99.6% | 4,734 |
| B (3771–7540) | 3,765 | 5 | 99.9% | 5,452 |
| C (7541–11310) | 3,022 | 748 | 80.2% | 4,191 |

### Eighth-wave validation

- `npm run validate`: **0 errors**, 8,454 warnings (pre-existing);
  **52,536 entities**, 86,072 prose files; authenticity 0; extremism 0;
  decisions 220/220.
- `npm run graph`: **54,523 nodes** (52,536 entities, 1,987 stubs),
  **111,548 edges**.

## Ninth wave — C-only delta (7f0f9932)

### Verified deltas

- **C only** (A and B already consolidated): **445 new person files**, all in
  range 7541–11310; 0 re-edits on previously applied paths.
- **49 place paths** touched by C. Collision-checked every new file against
  canonical slugs/labels/aliases/wikidata/geonames plus `building/*` and
  `polity/*`:
  - `beirut` and `khwarazm` re-appeared as source files; re-folded into
    `bayrut`/`khwarizm` (existing dedup pairs) — 10 reference files retargeted.
  - `adal` (label collides with `polity/adal`), `sasanian-empire` (polity
    exists), `bahmani` (polity exists): kept as place-class realm records per
    the standing polity-boundary decision — person→place predicates require
    `place/*` targets; flagged, not deleted.
  - `golconda` (fort city) kept separate from `golconda-sultanate` (polity);
    `gujrat`-style homographs checked; `saray` (Golden Horde capital) kept
    separate from `saray-j-k`.
  - Country/state gazetteer additions (australia, bahamas, california,
    connecticut, denmark, ethiopia, florida, georgia-us, guyana-era, kenya,
    niger, tanzania, zimbabwe, united-kingdom, spain, portugal, france …):
    region fixes applied (ethiopia/kenya/nairobi/mombasa → east-africa,
    niger → west-africa-sahel, samsun → anatolia-balkans, tanta → egypt-nile).
- Full pipeline re-run idempotently (semantic merges, region/kind fixes,
  dedup folds incl. re-created losers, aksaray split, education restores).
  Cumulative dedup across all waves: **55 records folded into 53 canonical
  entities**. No `*-2` slugs; a stray retargeted `ahilyanagar.yaml` dup file
  removed.

### Exact person coverage (recomputed)

| Range | Covered | Unresolved | Coverage | Place edges |
|-------|---------|------------|----------|-------------|
| A (1–3770) | 3,754 | 16 | 99.6% | 4,734 |
| B (3771–7540) | 3,765 | 5 | 99.9% | 5,452 |
| C (7541–11310) | 3,467 | 303 | 92.0% | 4,712 |

### Ninth-wave validation

- `npm run validate`: **0 errors**, ~8.5k warnings (pre-existing);
  **52,568 entities**, 86,072 prose files; authenticity 0; extremism 0;
  decisions 220/220.
- `npm run graph`: **54,555 nodes** (52,568 entities, 1,987 stubs),
  **112,598 edges**.

## Final residual deltas (wave 10)

### Verified deltas

- **A**: 10 new person files + `place/tib` (al-Tib on the Tigris, Wasit
  district; unique — no collision; copied, source tarajm-com).
- **B**: 1 person file (`iyad-ibn-nizar`).
- **C**: 99 person files; 2 of them (`chaudhry-ghulam-abbas`,
  `mirwaiz-yusuf-shah`) were out of C's range (positions 4156 and 7430 — B's
  lane) and were **not applied**. 9 place paths touched: anjouan, bornu,
  china, hasma, hisn-muslama, khandesh, prizren, tonekabon + re-created loser
  `aceh` (re-folded into `atjeh`; 1 reference retargeted). `bornu` (Bornu
  empire, Sahel) kept separate from `brno` (Czech city) despite the ar
  homograph برنو. `prizren` kept separate from `prizren-municipality`.
- Reports refreshed for all three agents.

### Exact person coverage (recomputed, final)

| Range | Covered | Unresolved | Coverage | Place edges |
|-------|---------|------------|----------|-------------|
| A (1–3770) | 3,764 | 6 | 99.8% | 4,745 |
| B (3771–7540) | 3,766 | 4 | 99.9% | 5,453 |
| C (7541–11310) | 3,564 | 206 | 94.5% | 4,811 |

Residual unresolved list (216 person ids) written to
`docs/reports/unresolved-person-places.txt`.

### Final validation

- `npm run validate`: **0 errors**, ~8.5k warnings (pre-existing);
  **52,576 entities**, 86,072 prose files; authenticity 0; extremism 0;
  decisions 220/220.
- `npm run graph`: **54,563 nodes** (52,576 entities, 1,987 stubs),
  **112,820 edges**.
- No `*-2` slugs; cumulative dedup across all waves: **~56 records folded into
  ~54 canonical entities**.

## Files intentionally not merged

None. Every changed path in the three source worktrees was applied (persons in
assigned ranges) or merged/deduplicated (places). The merge worktree was
fast-forwarded to `origin/main` 5e85e2dbcf first; the 42 files changed on main
since f2644ef3ed do not overlap any source-changed path.

## Note for the committer

Per `AGENTS.md`, a `CANARY.md` entry under the current version block should be
appended at commit time (this consolidation was left uncommitted per
instructions).

## Final residual pass (this worktree, `docs/reports/unresolved-person-places.txt`)

A last bilingual research pass over the 216 residuals (216 person files listed in
`docs/reports/unresolved-person-places.txt` after the fifth wave): each record's
full YAML was read (labels/aliases/nisba/periods/regions/notes/sources/
external_ids), Wikidata items were re-queried for place claims (P19/P20/P119/
P551/P937, wbgetentities, 94 QIDs), and movement/residence context in the
recorded sources was applied. Edges added only where defensible; broad
region/country targets used per the standing rule, always `confidence: low`
unless the source text itself names the place (`medium`).

### Results

- **179 person files resolved** with schema-valid person→place edges
  (`born_in`, `died_in`, `buried_in`, `lived_in`, `traveled_to`,
  `ruled_over`), citing each record's own `sources`.
- **37 remain unresolved** (rewritten list in
  `docs/reports/unresolved-person-places.txt`).
- **0 new place files** were needed — every edge targets an existing canonical
  place (jazirat-al-arab, medina, hijaz, uhud, iraq, baghdad, basra, kufa,
  samarra, al-sham, damascus, aleppo, misr, al-anbar, al-hira, taif, khurasan,
  iran, alamut, nineveh, jerusalem, palestine, oman, yemen→(none), maghreb,
  tunis, india, pakistan, saudi-arabia, minangkabau, anatolia, ottoman-empire,
  bosnia, albania, russia, khalkhal-county, china, italy, switzerland,
  united-states).
- **Mechanism notes**: relation lines normalised to the repo's two-space list
  style where legacy single-space items existed in the same block (22 files).

### Resolution methods used

- Recorded `regions` field → canonical broad place (arabia→jazirat-al-arab,
  anatolia-balkans+Ottoman-era→ottoman-empire/bosnia/albania/anatolia,
  levant-iraq+Abbasid-era→iraq/baghdad/basra, persia-central-asia→iran,
  maghreb→maghreb/tunis, south/southeast-asia→india/pakistan/minangkabau).
- Nisba → place: al-Anbari→al-anbar, al-Thaqafi→taif, al-Makhzumi→mecca,
  al-Tifrishi→iran, al-Saji→basra, Maghrebi→maghreb, Petrelali→albania,
  Pruscak/Shashtari/Gaibi/Tardic→bosnia, Panjpiri→pakistan.
- Wikidata claims: P19 (alamut via Maymun-Diz, russia via Aksay, pakistan via
  Panjpir), P119 (khalkhal-county), P937 (tunis), P119-building corroboration
  (aleppo).
- Source-text attestation: wanai→al-sham+misr (fiqh mawsua), qahtaba→khurasan+
  died_in iraq (al-Tabari), zadanfarrukh→died_in iraq, mujir-al-din→died_in
  damascus (Shadharat), umayyad/abbasid court figures→baghdad/samarra.
- Companion records (Isaba/sira sources) → lived_in medina; Umm Ma'bad→hijaz;
  Wahb ibn Qabus→died_in uhud.
- Tradition figures: yunus→nineveh, yusuf→misr, sulayman→ruled_over jerusalem,
  zakariyya/yahya→palestine, talut→ruled_over palestine, qarun→misr (all
  `confidence: low`, notes mark the tradition basis).
- Western figures: sun-tzu→china, covey/oncken→united-states,
  pareto→italy+switzerland.

### Unresolved taxonomy (37, with attempted searches)

- **Mythic/proverbial/fictional**: iblis, habil, qabil, nuh (antediluvian
  placement differs across traditions), shahrazad, siyawush-ibn-kaykaus,
  ustath, bidukh, al-haym-ibn-al-haym, thaun-al-falatuni, niyulaus
  (which Nicolaus is not confirmed).
- **Modern online figures with no published location** (channel notes already
  record that no source names a place): aisha-khalid, athea-iqbal,
  mostafa-arrid, muhammad-jalal, orthodox-muslim, the-muslim-mum,
  the-muslimah-ideas, sadeel, wejdan-al-ali, thom-defilet.
- **Genealogical/tribal names without geographic anchorage** (searched
  nisba+father names in Arabic; sources give lineage only): amr-ibn-uds,
  anmar-ibn-nizar, muzabbad, najah-ibn-salama, salman-ibn-mujalid,
  uqayl-ibn-bilal, turayfa-ibn-hajiza, thumama-al-ufi, saeed-ibn-muzahim,
  umar-ibn-yazid-al-asadi, tayhan-ibn-abjar, sawran, yazid-ibn-tazwan,
  nasr-al-qushuri, najib-al-din-abd-al-latif, zaynab-bint-radi-al-din-al-amiri.

### Validation (this pass)

- `npm run validate`: **0 errors**, 8,455 warnings (pre-existing);
  52,576 entities; authenticity 0; extremism 0; decisions 220/220.
- `npm run graph`: **54,563 nodes** (52,576 entities, 1,987 stubs),
  **113,194 edges**.
