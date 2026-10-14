# 20 · Differences of opinion — one lead opinion, more opinions beneath

_Added 12 October 2026 at the founder's request. Status: the data fields, the validator rules and the entity-page component are built and live on one example (`concept/iman`); the index page, the compare view and the bulk authoring are planned._

## 1. The idea

Many topics in the museum are not single-answer topics: a definition of iman, the order of the caliphs, whether the Qur'an is created, how a battle began, who a person was. For every such topic the page states **the question**, shows **one opinion first**, and puts **the other opinions beneath it** under a "More opinions (n)" disclosure. Each opinion has a short **headline** (its stance in one line), a **label** (the school or view), the **people and works that hold it**, its **basis** (the passages, books and arguments it rests on) and its **sources**. Nobody is told which one to believe: the museum describes, attributes and labels (`docs/scope.md`).

The museum already had a `perspectives` block (one entry per tradition). This document extends it so that it can express what the museum actually meets:

- several opinions **inside** one tradition (the four madhhabs, the Ash'ari, Maturidi and Athari positions are all Sunni);
- the **question** the opinions answer, in a sentence;
- **who** holds each opinion and **where** it is found (links, not just text);
- a **permalink** to each opinion.

## 2. Rules (editorial)

1. **Lead opinion.** The first opinion is Sunni (any `sunni*` tradition), per `docs/scope.md`. The choice of which Sunni opinion leads follows the source the entry is built from (for a creed book, that book's own position), then the order `sunni`, `sunni-hanafi`, `sunni-maliki`, `sunni-shafii`, `sunni-hanbali`. A visitor's "preferred school first" setting (planned) reorders only among Sunni opinions and hides none.
2. **Standing tag.** Each opinion shows a chip: *Main reference* (Sunni), *Secondary opinion* (academic, or a Sunni position the entry marks as outside the mainstream), *Other opinion* (any other tradition); see the addendum to `docs/scope.md`. The tag is derived from the tradition unless `standing` is set.
3. **Order beneath.** Further Sunni opinions, then `academic`, then every other view, each labelled before it is stated (validator-enforced).
4. **No verdict.** Never "the correct view", "the stronger opinion" or "the majority view" in the museum's voice. A source may say so; the museum then attributes it («رجّح ابن حجر…»).
5. **A view is described in its own words** where its own books are available, not only through its critics. If only a critic's description is at hand, the entry says so and the view is marked as to be added.
6. **Every opinion cites a source** (warning today; error when the entry is promoted to `reviewed`). Evidence entries point at passages, works or sources; quotation limits apply (at most 40 words).
7. **An entry that records only one book's position says so** and lists what is still to be added (as the creed entries from al-Tahawi do). Contested entries need Tier A review before promotion.
8. **Disagreement about facts** (a date, a number, who did what) stays as dated claims with `status: debated` and their own sources (`02-content-model.md`), shown in the same component as opinions when the page has an `issue`.

## 3. Data (what an editor writes)

On any entity, in `data/<class>/<slug>.yaml`:

```yaml
issue:
  ar: ما حقيقة الإيمان: هل هو تصديق بالقلب وإقرار باللسان، أم يدخل فيه العمل ويزيد وينقص؟
  en: What is the reality of iman: …
perspectives:
  - tradition: sunni                    # label and ordering key (schema/enums/traditions.yaml)
    id: ahl-al-hadith                   # permalink: #op-ahl-al-hadith
    stance: { ar: الإيمان قول وفعل، يزيد وينقص, en: Iman is speech and action… }   # the headline
    summary: { ar: …, en: … }           # two or three sentences, attributed
    holders: [person/al-bukhari]        # persons, groups or works that hold it
    evidence:                           # the basis
      - { ref: source/sahih-al-bukhari, note: { ar: كتاب الإيمان، الباب الأول } }
      - { ref: passage/quran-2-285 }
    sources: [source/sahih-al-bukhari]  # where the museum read it
  - tradition: sunni-hanafi
    id: aqida-tahawiyya
    …
```

All new fields are optional, so every existing `perspectives` block stays valid. In prose the same content may be written as a `:::perspectives` block (`- **Label**: text`), which the page renders with the same lead-and-more layout (label and text only; use the data fields when holders and evidence are wanted).

Validator (`scripts/validate.ts`): opinion ids unique within the entity; holders and evidence references resolve; two or more opinions without an `issue` warn; an opinion with no source warns; the Sunni-first order is an error (unchanged). Tests are in `scripts/pipeline.test.ts`.

## 4. Objects (what is a "topic" in the graph)

- **Embedded, not a new class (now).** An opinion belongs to the entity it is about, so it lives in that entity's `perspectives`. That keeps one file per topic and one review per entry, and `perspectives` already works across all 21 classes.
- **Holders make opinions navigable.** `holders` links an opinion to people, groups and works. The graph build will derive the reverse index ("Positions held" on a person or work page, "Opinions in this school" on a group page) without anyone writing the inverse edge.
- **Relation to other mechanisms.** `question` entities are plain-language visitor questions and can point at an entity's `issue`; `tensions[]` are hard-question cards with at least two cited voices and stay for the hardest cases; dated `debated` claims carry factual disagreement.
- **Promotion rule.** If an issue needs its own page because many entities share it (for example the status of the sinner across iman, takfir, shafa'a and the afterlife), it becomes a `question` or `concept` entity that the others link to, and the opinions are written once there.

## 5. UI and pages

Entity page (built):
- A section "Opinions on the question" (الآراء في المسألة) with the **question** in one line, the **first opinion** in full (label, headline, text, holders as chips, basis as chips with a note, sources), then a native `<details>` disclosure "More opinions (n)" holding the others as cards, each labelled before its text. No JavaScript is needed to read it; choosing the **Deep** depth opens the disclosure.
- Each opinion has an anchor (`#op-<id>`), so a person or a question page can link straight to it.

Pages (planned, in order):
1. **Differences index** `/ar/opinions/`: every entity that has two or more opinions, with its question, the headlines of its opinions and the schools involved; filterable by wing, theme and school. It doubles as the museum's list of what is contested and what is still thin (it reads the same validator data as the coverage page).
2. **Compare view** on concept groups and theme hubs: a table with the issues as rows and the schools as columns, each cell the headline of that school's opinion with a link; empty cells say "not yet written" rather than hiding the gap.
3. **Positions held**: the reverse index on person, group and work pages.
4. **Search and filters**: a "has differing opinions" facet in search; Pagefind indexes opinion headlines.
5. **Tour / Learn**: a hard-question pathway (`19-tour-learn.md`) gives each opinion its own step and ends without a verdict.
6. **Print and handouts**: the disclosure prints expanded.

## 6. Authoring and AI assistance (building phase only)

The library pipeline (`docs/delegation/local-model-library-prompt.md`) gets one more claim kind, `opinion`: the extractor proposes `{issue, stance, holder, quote, page}` from a creed, tafsir, fiqh or history text; the quote check and the second-family judge apply as for every claim; a person writes or reviews the entry. Entries are built book by book, so the first version of an issue often has one opinion and says what is to be added; later books add siblings to the same `issue`.

## 7. Rollout

| When | What |
|---|---|
| Done (12 Oct 2026) | Schema fields (`issue`, `id`, `stance`, `holders`, `evidence`), validator rules and tests, the entity-page component, English and Arabic strings, one worked example (`concept/iman`: the hadith scholars' and the Hanafi creed's definitions). |
| Done (12 Oct 2026, second step) | `issue` and anchors on the 37 data entries that had two or more perspectives; a source on five opinions that the cited works plainly carry (11 opinions still cite nothing and the validator lists them); Ibn Qudama's Lum'at al-I'tiqad added as a second opinion on 14 of the Tahawi creed concepts and a third on `concept/iman`. |
| Done (13 Oct 2026, third step) | 30 prose opinion blocks moved to the data form (18 entries with Arabic text, 12 al-Isaba report variants); the Ash'ari report of the creed (Maqalat al-Islamiyyin) added on 13 concepts with new traditions `sunni-ashari` and `sunni-maturidi`; the Wasitiyya on 14. |
| Next | Headlines (`stance`) and holders for the older entries; the Maturidi view and the Ash'ari and Maturidi schools' own books; Ibn Abi al-Izz's Sharh al-Tahawiyya as a source that describes other views in its own words. |
| Phase 2 | The differences index, positions-held, compare view, search facet. |
| Phase 3 | Preferred-school ordering among Sunni opinions; the opinion claim kind in the library pipeline at volume. |
