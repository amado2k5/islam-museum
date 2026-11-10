# Poetry passages and a poetry browser: plan

Status: proposal (non-impacting). Not yet approved. Branch: `claude/islamic-poetry-passages-5nct16`.
Prompt for the executing agent: `docs/delegation/poetry-passages-prompt.md`.

## 1. What exists today

- **Poem works**: 39 files in `data/work/` with `kind: poem` (`status.md` says 36; reconcile during the work). Examples: Hassan ibn Thabit's elegies and replies, Ka'b ibn Malik, Labid's elegies, Zibriqan's boasts, `qasidat-banat-suad`, `tarjuman-al-ashwaq`, `diwan-al-mutanabbi` (kind: book, scanned locally).
- **Poetry anthology page**: `site/src/pages/[lang]/words/poetry/index.astro` groups poem works under their poet (via `authored` edges) and lists them. It links to works, not to verses. It has no verse text, no search and no filter.
- **Passages**: `schema/passage.schema.json` already allows `unit: poem-line`, but no data uses it (units in use: `ayah`, `hadith`, `sura`, `chapter`). `work` on a passage points at `work/<id>`.
- **Poems have no passages**: no `passage/*` record names a poem work.
- **Browser model**: the Qur'an reader (`words/quran/`) and hadith library (`words/hadith/`) are the patterns to copy for navigation, search (Pagefind is on) and entity links.
- **Lane**: `lib-exp-poetry-adab` (`docs/delegation/library/poetry-adab.md`) already covers al-Mutanabbi, al-Isfahani and adab sources. This plan uses poem works from that lane and the existing `poet` people.

## 2. The rule that limits the text (decision needed)

`docs/sources-policy.md` §4 says verbatim text beyond a 40-word quotation stays out of the repository. Qur'an is the only exception. Existing hadith passages carry full Arabic text, so the policy and the data already disagree; that is a separate question for the founder.

For poetry, this plan takes the strict reading unless the founder says otherwise:

- **Arabic verse (`text`)**: each passage holds one bayt (a verse, two hemistichs) or one short run of at most 40 words, with the source page cited. Longer poems are split into several passages, one per bayt or short run, so every passage stays within the quotation limit.
- **Translations**: the museum's own English and Urdu rendering, written from reading the poem (not a sentence-by-sentence rewording of a copyrighted translation). Marked `translations.<lang>.license: CC-BY-SA` or the museum's licence, and not copied from any translator.
- **Summaries and context**: the museum's own words, Arabic first, with `{cite:...}` after each fact.

Alternative for the founder to choose: allow full pre-1930 Arabic text from public-domain editions (the poets are mostly pre-1000 AH, so their text is PD). That needs an explicit ruling in `sources-policy.md` before any full poem goes in. Until then, the plan does not depend on it.

## 3. Data model

Each passage (`data/passage/poem-<work-slug>-<bayt>.yaml`):

```yaml
id: passage/poem-hassan-kunna-muluk-al-nas-01
class: passage
unit: poem-line
work: work/hassan-poem-kunna-muluk-al-nas
ref: "1"              # bayt number in the cited edition
label: { ar: "...", en: "..." }
text: "..."           # one bayt or a run of at most 40 words
summary: { ar: "...", en: "..." }   # museum's own words, cited
translations:
  en: { text: "...", license: CC-BY-SA }   # museum's own rendering
  ur: { text: "...", license: CC-BY-SA }
sources: [source/...]
provenance: { layer: own-research, source: "...", generated_by: "...", model: "...", run: "..." }
status: { review: published, completeness: 2 }
```

- Add `metre` (`bahr`, e.g. `tawil`, `basit`, `kamil`) and `rhyme` (`rawiy` letter) as optional fields in `passage.schema.json`. Taxonomy in a new `schema/enums/metres.yaml` (16 classical metres plus `other`).
- Add `bayt` as the field name for bayt number instead of reusing `ref`, if the validator allows it; otherwise keep `ref` and document it.
- Relation: passage `work` points at the poem. Do not duplicate `authored` edges; the poet comes from the work.
- Limit: 6 to 12 passages per poem for the first pass (the strongest bayts, plus the opening and closing), so the browser has depth without copying whole poems.

## 4. Poetry browser

Extend `/{lang}/words/poetry/`, do not create a second page:

1. **Verses view** (new tab on the same page): a list of all `poem-line` passages, each showing the Arabic bayt, the museum's translation, the poem title and the poet. Sorted by poet (death date) then poem, as the current page does.
2. **Filters**: poet, poem, metre, rhyme letter, genre (`madih`, `hija`, `ritha`, `ghazal`, `fakhr`, `hikma`, `other`). Plain links first; add JS only if the page works without it.
3. **Search**: Pagefind over Arabic and translation text. Exclude `data-pagefind-ignore` on the existing list only if it duplicates results.
4. **Poem page**: the existing work page lists its bayts in order when passages exist.
5. **Person page**: poet pages link to their verses.
6. **Accessibility**: Arabic text with `lang="ar" dir="rtl"`, alt text not needed (no images), WCAG 2.2 AA, no JS needed to read.

## 5. Phases

| Phase | Work | Gate |
|---|---|---|
| 0 | Founder decides §2 (strict vs full PD text) and approves this plan | Written approval |
| 1 | Schema: `poem-line` fields, `metres.yaml`, validator passes on the empty set | `npm run validate` 0 errors |
| 2 | Pilot: 3 poems (Hassan `kunna-muluk-al-nas`, Labid's elegies, `qasidat-banat-suad`), 6 to 12 bayts each, with sources and translations | Every bayt cited; ≤40 words per passage; `npm test` |
| 3 | Browser: verses view, filters, Pagefind, poem and person links | `npm run build`; manual check at phone width and in RTL |
| 4 | Remaining poem works, in batches of at most 25 passages | Same gates per batch; coverage regenerated (`npm run coverage`) |

Phase 2 is the decision point: after the pilot, check the output against this plan before scaling.

## 6. Risks and checks

- **Copyright**: no full modern poem (Shawqi, Hafiz Ibrahim, Adonis, Qabbani and others are not PD in translation). Modern poets in scope only with excerpts and own translations.
- **Attribution of the bayt number**: verse numbering differs between editions. Every passage cites the edition and page.
- **Authenticity**: a poem's attribution is a claim. Use `status` or a doubt marker when the source gives a disputed attribution (e.g. Hassan's and Zibriqan's exchanges).
- **Honorifics**: no ﷺ or «رضي الله عنه» typed in text; the UI renders them.
- **No Qur'an text** in poems that quote it; use `[[passage/quran-<sura>-<aya>|label]]`.
- **Haram content**: wine poetry (khamriyya) is part of the adab record. Describe it, do not endorse it; cite the source and keep the museum's voice neutral.
- **Submissions**: adding content is non-impacting; any change to the record counts or class list is `submission-impacting` (`docs/ai-change-gates.md` §3).

## 7. Open questions for the founder

1. Strict excerpts (recommended) or full pre-1930 Arabic text from PD editions for poems?
2. Should the existing hadith passages with full text be reviewed against the same policy? (Out of scope here; noted.)
3. Browser on the existing `/words/poetry/` page (recommended) or a new `/words/poetry/verses/`?
