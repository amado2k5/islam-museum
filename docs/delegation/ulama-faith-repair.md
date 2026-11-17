# Ulama wave repair — 17 November 2026

Branch `repair/ulama-faith-wave`, worktree detached at `origin/main` `cfa07b15d2`.
`npm run validate` on that commit reported **527 errors** across the ulama /
origins-faith wave commits of 17 November 2026 (waves `ulama-wave2` and
`ulama-m500-w*`). This note records every error class, the count, and the
mapping decision applied. No validator was weakened and no content was deleted
to silence an error; every fix preserves the attestation or fact in the note or
the correct field.

## Error counts per class

| Class | Errors | Files touched |
|---|---|---|
| Prose front matter missing opening `---` (`frontmatter id/lang "undefined"`) | 240 (120 files × 2) | 120 `content/{ar,en,ur}/person/*.md` |
| `URL must match format "uri"` (raw Arabic in Wikipedia URLs) | 75 | 75 `data/source/wikipedia-*.yaml` |
| `must have required property 'title'` | 40 | 40 `data/source/wikipedia-*.yaml` |
| `/faith/0/value must be equal to one of the allowed values` | 74 | 74 `data/person/*.yaml` |
| `faith[0]: … needs two independent sources` (modern-figures ruling 3) | 61 | 61 `data/person/*.yaml` |
| `person "…" exists twice` (homonyms) | 27 | 27 pairs |
| `/regions/0 must be equal to one of the allowed values` | 7 | 7 `data/person/*.yaml` |
| `/born/status must be equal to one of the allowed values` | 1 | 1 `data/person/*.yaml` |
| `summary.ur: wrap Arabic-script parentheses in U+2066 … U+2069` | 2 | 2 `data/person/*.yaml` |
| **Total** | **527** | |

(Faith enum and two-source classes overlap on 3 files — `person/ali-al-sistani`,
`person/ali-shariati`, `person/muhammad-baqir-al-sadr` — for 132 distinct person
files repaired.)

## Fixes applied

### 1. Prose front matter (240 errors)

The wave-2 commit `a9875f885f` wrote 120 prose files (40 persons × ar/en/ur)
with the front-matter keys but **without the opening `---` delimiter**, so the
parser saw no front matter at all. Fix: prepended `---` to each file, matching
the exact front-matter shape used by the sibling Muslim-500 wave files
(`id`, `lang`, `source_lang`, `translators`).

### 2. Wikipedia source records (115 errors)

- **URL format (75):** `URL:` fields carried raw Arabic article slugs
  (e.g. `https://ar.wikipedia.org/wiki/ابن_باز`). Percent-encoded the path
  (`%D8%A7%D8%A8%D9%86_%D8%A8%D8%A7%D8%B2`), same address — the shape used by
  every pre-existing `wikipedia-*-ar` source record.
- **Missing `title` (40):** added `title:` derived from the article slug in the
  record's own `URL` (e.g. `title: "Ali Shariati"`,
  `title: "يوسف إدريس"`), plus the conventional
  `author: [{ family: "Wikipedia contributors", given: "" }]` line used by the
  existing Wikipedia source records. 23 files overlapped both classes.

### 3. Faith values (135 errors across 132 files)

Per `docs/agents/lanes/modern-figures.md` ruling 3 (two independent sources
naming the school or order; doubt stays `unknown` with readings preserved) and
the `person/islam-behery` precedent:

- **`value: islam` → `unknown` (71 records).** `islam` is not a faith enum
  value. These notes read "public figure within the Muslim world; no sourced
  renunciation". Each now reads `value: unknown`, `basis: unknown`, note kept
  and appended: *"The subject is Muslim by self-description and public context;
  no school or tradition is stated, so the value is recorded as unknown."*
- **`value: sunni` / `sunni-shafii` / `shia` → `unknown` (61 records).**
  Valid-looking values settled on a single source. Each now reads
  `value: unknown`, `basis: unknown`, the original attestation kept and
  appended: *"This attestation is preserved here, but under the
  two-independent-sources rule for modern figures a single source does not
  settle a school or order, so the value is recorded as unknown."*
- The three bare-`shia` records (`ali-al-sistani`, `ali-shariati`,
  `muhammad-baqir-al-sadr`) are Twelver-context figures, but each cites only
  one source; the Shia→`shia-twelver` mapping rule itself requires two
  independent texts, so they settle as `unknown` with the Twelver attestation
  preserved in the note.
- `basis` set to `unknown` throughout, matching the settled-unknown precedents
  (`amr-khaled`, `messali-hadj`, `mohammad-khatami`).

### 4. Regions (7 errors)

Invalid strings mapped per person to the nearest valid enum member:

| Record | Was | Now | Basis |
|---|---|---|---|
| `ahmad-tijani-bin-ali-cisse` | `west-africa` | `west-africa-sahel` | Senegalese shaykh, Kaolack |
| `ibrahim-traore` | `west-africa` | `west-africa-sahel` | Burkinabe officer |
| `fatemeh-zahra-sheikhabadi` | `middle-east` | `persia-central-asia` | Iranian, Hormozgan |
| `mustafa-abu-sway` | `middle-east` | `levant-iraq` | Palestinian, Jerusalem |
| `usama-al-azhari` | `middle-east` | `egypt-nile` | Egyptian, Alexandria |
| `uthman-taha` | `middle-east` | `levant-iraq` | Syrian, Aleppo |
| `shavkat-mirziyoyev` | `central-asia` | `persia-central-asia` | Uzbek president (enum bundles Persia+Central Asia; same value used by other Uzbek figures) |

### 5. Date status (1 error)

`person/fatemeh-zahra-sheikhabadi` `born.status: speculative` is not in the
enum (`scriptural, tradition, historical, debated, legend`). Removed the
`status` key: the EDTF `2016~` already carries the approximation and the note
states no source gives a birth date. `status` is optional in the date schema.

### 6. Urdu parentheses (2 errors)

`person/mahir-al-fahl` (`(عللِ حدیث)`) and `person/tahani-amer` (`(تھن فلم)`)
summary.ur parentheticals wrapped in U+2066 … U+2069 per the Arabic-parentheses
rule.

### 7. Duplicate persons (27 errors)

Every pair is the same person filed twice — the wave-2/m500 records duplicated
established records under spelling-variant slugs. Merged per the validator's
own instruction and the `person/umm-maabad` precedent: the richer record keeps
its id, gains `aliases: [person/<duplicate>]` (the id still resolves, site
redirects), the duplicate's top-level `sources` are unioned in, a `faith`
block or `external_ids` block is ported where the survivor lacked one, and the
duplicate's data file and trilingual prose files are removed.

Survivor (kept) ← duplicate (aliased away):

- `abd-al-fattah-abu-ghudda` ← `abd-al-fattah-abu-ghuddah`
- `ahmed-el-tayeb` ← `ahmad-al-tayyeb` (joins existing alias `ahmad-al-tayyib`)
- `ahmad-amin` ← `ahmed-amin`
- `ahmed-shawqi` ← `ahmad-shawqi`
- `ali-mustafa-musharrafa` ← `ali-moustafa-mosharafa`
- `allal-al-fassi` ← `allal-al-fasi`
- `fatema-mernissi` ← `fatima-mernissi`
- `hafiz-ibrahim` ← `hafez-ibrahim`
- `husain-ahmad-madani` ← `hussain-ahmad-madani`
- `ismail-ibn-musa-menk` ← `mufti-menk`
- `mahmud-sami-al-barudi` ← `mahmoud-sami-al-barudi`
- `mahmoud-shaltut` ← `mahmud-shaltut` *(wave record richer: full trilingual
  prose; ported themes, periods, the al-Buhayra relation and occupations)*
- `mostafa-mahmoud` ← `mustafa-mahmoud`
- `muhammad-awwama` ← `muhammad-awwamah` *(wave record richer: trilingual
  prose; ported external_ids, periods, the Aleppo born_in relation and
  occupations)*
- `muhammad-ibn-salih-al-uthaymin` ← `muhammad-ibn-al-uthaymeen`
- `ramadan-al-buti-muhammad-said` ← `muhammad-said-ramadan-al-bouti`
- `muhammad-sayyid-tantawi` ← `muhammad-sayyid-tantawy`
- `muhammad-zakariya-kandhlawi` ← `muhammad-zakariyya-kandhlawi`
- `muqbil-ibn-hadi-al-wadii` ← `muqbil-bin-hadi-al-wadii`
- `rached-ghannouchi` ← `rachid-ghannouchi`
- `ragheb-al-sergani` ← `ragheb-al-sirjani`
- `saleh-al-fawzan` ← `salih-al-fawzan`
- `seyed-hossein-nasr` ← `seyyed-hossein-nasr`
- `shams-al-haqq-al-azimabadi` ← `shams-al-haqq-azimabadi`
- `suad-saleh` ← `suad-salih`
- `tariq-jameel` ← `tariq-jamil`
- `wahba-zuhayli` ← `wahbah-al-zuhayli`

## Flag for the founder

`person/hashim-al-baghdadi` was created by wave 2 (`a9875f885f`) and received
only the mechanical faith repair here (`islam` → `unknown`). Whether a record
for the Islamic State's leader belongs in the museum at all is a content-safety
question above this repair's scope: the record exists on `main`,
`check-extremism` passes, and it is **not** listed in
`docs/delegation/extremism-firewall-exceptions.md` — a founder ruling on
keeping or removing it is recommended.

## Verification

- `npm run validate` — see PR body for the final error count (target: 0 errors;
  pre-existing warnings unchanged).
- All edited YAML re-parsed with `yaml.safe_load`; every merged survivor carries
  exactly one `aliases` claim per duplicate id.
- Commands: scripted edits reviewed per class; no validator, schema or
  check script touched.

— Devin (SWE-2 High), 17 November 2026
Troubleshooting note for future waves: the ulama pipeline must (a) emit the
opening `---` in prose front matter, (b) percent-encode non-ASCII `URL`s and
always emit `title`, (c) reuse `reuse before you create` — check
`data/person/` for an existing record under spelling variants before writing a
new slug, and (d) apply the faith two-source rule at write time.

## Post-repair finding (masked by the 527 errors)

Once `validate.ts` reached zero errors the `&&` chain ran the later checks for
the first time on this tree and `check-extremism` flagged one pre-existing
latent error: `content/en/person/sayyid-al-qemany.md` glossed the book title
«الحزب الهاشمي وقيام الدولة الإسلامية» as "…the Founding of the Islamic
State" — the capital-S bigram matches the blocked-organisation pattern. The
book is about the first (7th-century) Islamic polity, i.e. the generic
"Islamic state" that `AGENTS.md` lists as a not-match; the gloss now reads
"…the Founding of the Islamic state" (lowercase common noun). No validator,
pattern list or exception was touched.

## Second wave landed mid-repair (origin/main moved)

While this branch was in flight, `origin/main` gained three commits —
ulama waves 151–200 (`08f481f476`, PR #7380) and 201–250 (`b084c1c37f`,
PR #7383) plus an AMJA fatwa batch (`6a77edff7f`, PR #7382) — written by the
same pipeline with the same defects. Merged `origin/main` cleanly (zero
path overlap) and re-validated: **50 new errors**, all in the new wave
files, fixed the same way:

| Class | Errors | Fix |
|---|---|---|
| Modern faith two-source (ruling 3) | 24 | `value`/`basis` → `unknown`, attestation kept in note |
| Invalid faith enum `shia` | 1 | `person/tayyaba-bukhari-khanum` → `shia-twelver` (two sources + Twelver context: Jamiat al-Zahra / hawza of Qom; mapping stated in note) |
| `URL must match format "uri"` | 2 | percent-encoded `Köhler`, `Kavazović` in de/en Wikipedia slugs |
| Missing front matter entirely | 24 (12 files × 2) | added the full `id`/`lang`/`source_lang`/`translators` block to 4 persons × ar/en/ur (these files had no front matter at all, unlike wave 1 which had only lost the opening `---`) |
| **Total** | **50** | |

Also normalised a double U+2066/U+2069 wrap the pipeline emitted in
`person/khaled-al-bakar` `summary.ur` (`⁦⁦(لبنان)⁩⁩` → `⁦(لبنان)⁩`). No new
homonym, region, date-status or title defects in this wave.