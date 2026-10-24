# Content standards: what a good entity looks like

## Rich first pass, for every topic

Rule (founder, 26 October 2026): write the full, detailed prose and as many well-sourced details as the sources allow in the first pass. This applies to every class of entity and every topic, not only people: a person, a book, an article, a thesis, a website, a building, an object, an image, a place, an event, a concept, or a practice.

- Gather the sources first (defined source entities; Wikipedia and Wikidata for entity facts; the press and institutional sources they cite), then write the complete prose in Arabic (canonical), English and Urdu in the same commit.
- Include every fact, programme, work, institution, travel, relationship, recognition and reported criticism that the sources support, each cited to a defined source entity.
- Show contested or reported criticism as a labelled perspective, not a verdict, and say when the primary statements have not yet been checked.
- Do not defer enrichment to later runs or phases. Later work is revision only: correcting, reaffirming, or extending with new sources, never completing a thin first draft.
- A lead (an item not yet verified) is recorded as a lead with its reason. Leads are not a reason to leave prose thin.

Applies to every agent and human who writes or changes an entity. The rules that never bend are in [`AGENTS.md`](../../AGENTS.md). This document says how to meet them and lists the mistakes that have actually happened (each cost a repair). The validator enforces the first group; reviewers and the next agent enforce the rest. Fixing a defect you find, in anyone's merged work, is everyone's job.

_Origin: written 11 October 2026 after a review found defects the validator missed, extended after main once broke._

## 1. Copy the shape of what is on main

Before you create an entity of a class, open two existing ones of that class from different authors. Gold examples: `data/event/expedition-of-al-sawiq.yaml` with `content/ar/event/expedition-of-al-sawiq.md` (events); `data/person/umm-ayman.yaml`, `data/person/sad-ibn-ubada.yaml` with its prose (people); `data/source/sahih-al-bukhari.yaml` (sources); `data/practice/salah.yaml`, `data/concept/iman.yaml` (practices, concepts). If your output looks different from main, yours is wrong. Voice and style: `docs/style-guide.md`, `docs/language.md`, `docs/scope.md`.

## 2. Hard rules the validator enforces

1. **No honorifics typed anywhere** (prose, labels, summaries, notes): not ﷺ, «صلى الله عليه وسلم», «عليه السلام», «رضي الله عنه», «رحمه الله». The UI renders them. Write «النبي», «إبراهيم», «أبو بكر». Strip them from anything you extract.
2. **No Qur'an text in prose or data.** Not even in ﴿ ﴾. Link it: `[[passage/quran-2-144|البقرة 144]]`; add a `revealed_about`/`based_on` relation when the source names the occasion. The only source of ayah text is the frozen Tanzil files.
3. **Prose lives only in `content/<lang>/<class>/<slug>.md`**, with front matter (`id`, `lang`, `source_lang`, `translators`) and `## موجز` first. Data lives only in `data/<class>/<slug>.yaml`. A `.yaml` under `content/` is never rendered.
4. **Schema shapes** (the validator tells you the rest): `wings` is a list of strings from `{people, place, time, ideas, objects, words, living, today, made}`, never relations; relations go under `relations: [{ type, target, role?, sources }]`. Hijri strings are quoted (`hijri: "0008"`). `source` entities: `kind` in `{primary, secondary, tertiary, reference_data}`, `type: book`, `title` a plain string, `label` with `ar`, `author: [{ family, given }]`, `language: ar`. `provenance` carries `layer: own-research`, `source`, `generated_by`, `model`, `run`.

## 3. Rules reviewers check

_These rules describe a good record. Publication itself needs only the bar in `docs/agents/publication-standard.md` — citations to defined sources, provenance recorded, no review._

5. **Cite where the museum looks.** Every entity has a top-level `sources: [source/...]`. A citation inside `provenance` alone does not count. One source is enough for any fact, dated or not; a second source strengthens a record but is never required. Cite as `{cite:<source-id> p.N}` after every sentence that states a fact.
6. **Typed relations, never `related_to`.** Use `part_of`/`has_part`, `caused`/`caused_by`, `occurred_at`, `had_participant` (with `role`), `member_of`, `child_of`, `spouse_of`, `sibling_of`, `based_on`, and so on from `schema/predicates.yaml`. `related_to` means you did not decide.
7. **Complete the entity.** Events: `wings`, `periods`, `regions`, `date` with `calendar` and `status`, `sides` with commanders when it is a fight, `occurred_at` a place. Places: `kind`, `part_of`, coordinates only from `docs/plan/16` §6 or Wikidata (say which). People: `names[]` with nasab, `gender`, `roles`, `traditions`, `faith` with basis.
8. **Dates must agree.** A Hijri month and an EDTF month must be the same time (Shawwal 3 AH is March 625, not June). Convert with `scripts/hijri/`, mark conversions `derived`, put the book's words in `note`. Use the parent event's date for a part of it. Hijri exactly as the source words it; never invent a day.
9. **Honest provenance.** `generated_by` is the tool or model that really wrote it; records enter as `status.review: published` under `docs/agents/publication-standard.md`. A page number you did not read on the page is a flagged guess, not a citation.
10. **Reuse before you create.** Search `data/` by Arabic name and by ASCII slug, and read `names[]` of existing people (spellings differ: ابن/بن, أبو/أبي). If an id you need duplicates an existing entity, use the existing id and, only if your spelling is already referenced elsewhere, add yours to the existing entity's `aliases`. Do not create a stub for something that exists. Source entities: `ls data/source | grep <name>` first.
11. **Link entities in prose**: `[[class/slug|الاسم]]` on the first mention of each person, place, group, event; short sentences; define terms on first use.

## 4. Voice: describe, attribute, label

12. **No judgement in the museum's voice.** Not «تمرد», «أعداء الله», «محاولة يائسة», «رأس المنافقين», «خيانة» as our own words. Write what happened («انسحب بنحو ثلث الجيش»), then give the judgement to someone with the page: «ويرى صاحب الرحيق المختوم أنه أراد…», «وتصفه المصادر بأنه…». A motive is never stated as fact unless the source states it as fact, and then it is attributed.
13. **Contested matters get a `perspectives` block**: Sunni position(s) first, each labelled (`**أهل السنة: <scholar or school>**`), then the academic view, then any other view, each cited. If you only have the Sunni source, write the Sunni block and say in the page («ما لم يُذكر هنا») that the academic and other views are still to be added; do not assert them from memory.
13a. **Differences of opinion are structured.** When a topic has more than one position, write `issue` (the question) and one `perspectives` entry per opinion with `tradition`, `id`, `stance` (one-line headline), `summary` (attributed, short), `holders`, `evidence` and `sources`; the first entry is Sunni and leads, the rest follow in the order Sunni, academic, other, each labelled; never state a verdict; the main reference is Sunni Islam and its wasatiyya, and every other opinion is tagged secondary or other (`standing`, derived from the tradition if not set; `docs/scope.md` addendum, `docs/plan/20-opinions.md`). A book that gives only one position yields one entry that says what is still to be added.
13b. **`traditions[]` on a person lists the traditions that count the person as theirs, never a tradition that only has a view of them.** Aisha, Abu Bakr, Umar, Uthman and Abu Hurayra are `[sunni]`; the Twelver Shia view of them belongs in `perspectives` (tagged other). A person claimed by more than one tradition (the Prophet, Ali, Fatima, Hasan, Husayn, Khadija, Hamza, Abu Talib) lists each. The infobox labels the row "Counted among", and `faith[]` stays the person's own recorded faith with its basis.
14. **Doubt markers are data.** Every doubt marker the source prints («ويقال»، «قيل»، «يروى»، «ضعيف»، «واه»، «متروك»، «يُشك فيه») becomes `status: debated`, `confidence: low`, a note quoting the marker, or a perspectives entry. Weak chains are recorded as weak, with the critic's verdict attributed. Nothing is silently dropped, and no hadith or report is graded in the museum's own voice.
15. **Quotations ≤ 40 words**, verbatim, in quotation marks, with page. Everything else is the museum's own words: read any source, copyrighted or not, and write what it says in the docent voice with the page cited (`docs/sources-policy.md`). A claims table keeps every sentence traceable to a page; a page-by-page retelling or a sentence-by-sentence rewording is not the museum's text.

## 5. Mistakes that have actually happened

- Overwriting a shared file: `data/_stubs.yaml` was replaced by an 18-line fragment and main went to 183 errors. Shared files are append-only (`docs/agents/workflow.md` §6).
- Hiding bad data with a crash guard in `scripts/` instead of repairing the data.
- A symlink `node_modules -> ../another-clone/node_modules` committed by accident; it breaks installs for everyone.
- Honorifics (ﷺ) in 16 places, which the validator silently missed because of a regex bug (`\b` before a non-word glyph).
- Typed Qur'an verses in three pages; a prose file saved as `.yaml`; `related_to` on every event; wrong EDTF month; entities with only `provenance.sources`.
- Stubs that duplicated existing people (`person/abd-allah-ibn-ubayy` for `person/abdullah-ibn-ubayy`).
- A test that passed locally and failed after rebase because it read global warnings: scope tests to their own fixture file.
- Pushing after a failing check because commands were chained with `;`.

## 6. Before you commit: the 60-second check

```
npm run validate && npm test
grep -rnE "ﷺ|صلى الله عليه|عليه السلام|رضي الله ع|﴿" <your files>     # expect nothing
grep -n "related_to" <your data files>                               # expect nothing, or a reason
grep -L "^sources:" <your data files>                                # expect nothing
git diff --stat origin/main                                          # only your paths; no mass deletions
```
