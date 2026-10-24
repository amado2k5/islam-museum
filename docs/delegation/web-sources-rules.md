# Rules for websites and the items they hold

Status: applied in code on 26 October 2026 (`scripts/check-authenticity.ts`, `scripts/harvest/library/authenticity.yaml`). Part of the authenticity policy (`docs/delegation/authenticity-policy-proposal.md`). A submission-impacting change: the claims register (`docs/outreach/unesco-nomination-dossier.md`, A.5) has a row for it.

## 1. Why websites are allowed

Books are not the only source. Much of the useful material is on websites: encyclopaedias, scholarly encyclopaedias such as Dorar, open access journals, university repositories, theses, whitepapers, research papers, museum catalogues. The framework must let us use them, without treating every site as equally reliable.

## 2. Two levels: the carrier and the item

- **Carrier**: the site that holds the material. It gets a tier (T1 to T5) and a status, and a list of the uses it allows.
- **Item**: each book, article, thesis, whitepaper, research paper, artefact or image on that site. Each item gets its own decision (accept, label or reject) by the founder, and its own ledger record. A good carrier does not make a bad item acceptable, and a weak carrier can still hold an item that is validated another way (for example, a thesis with a named institution and a catalogue record).

## 3. Kinds

| Kind | What it is | Typical tier | Typical use |
|---|---|---|---|
| `website` | A site that carries other items | T3 to T5 | Pointer, grades, facts |
| `book` | A printed or digitised book with a named edition | T1 | Text (quoted matter), grades |
| `catalogue` | A library or archive catalogue record | T2 | Identity, edition, provenance |
| `article` | A journal or magazine article | T3 when peer-reviewed | Facts, the author's view labelled as such |
| `thesis` | A dissertation held by a university | T3 | Facts, research findings, citations |
| `whitepaper` | A report by an organisation | T2 or T4 | Facts about the organisation, background |
| `research-paper` | A paper in a conference or preprint series | T3 | Facts, method, findings |
| `artefact`, `image` | A museum object or picture | T2 or T3 | Identity and provenance, not text |

## 4. Uses

- `pointer`: to locate a book, article or record. Every source may be a pointer, unless it is T5 or not verified, where pointer is the only use.
- `grades`: attributed verdicts, such as a hadith grade with the scholar who gave it. Needs an attribution to a named person and a named book.
- `facts`: dates, names, places and identifiers. Needs at least one T1, T2 or T3 source.
- `text`: quoted matter. Needs a T1 source, or a valid sample of 30 or more rows checked against a named edition.

A T5 or not-verified carrier may only be a pointer. A site may never be used for `text` without the sample.

## 5. Accepting an item from a website

An article, thesis or whitepaper from a website is accepted on the same terms as a book:

1. Its author is identified (named person or named body), and the author's standing is checked on two independent sources, as for books.
2. Its identity is checked: title, author, date, and an identifier where one exists (DOI, handle, ISBN, repository identifier).
3. Its carrier is recorded with the date it was retrieved, and a snapshot or archive link where possible.
4. Peer-reviewed and institutional items (journal, university, catalogue) are preferred. Blogs and personal sites are T5 and can only be pointers.
5. The founder records the decision and the reason.

## 6. Records

- A website has a record in `docs/authenticity-ledger/websites/<id>.yaml`: its owner, tier, status, uses, retrieval date and checks.
- Each item from a website has a record in `docs/authenticity-ledger/books/` (or a new items folder when the first item of that kind is added). A record holds metadata only, never the text.

## 7. Images, video and audio

Media is accepted per item, on the same two levels (carrier and item). The validator enforces, for every media decision that is not a reject:

- a **licence** from `schema/enums/licenses.yaml` (CC0, CC-BY, CC-BY-SA, PD, VAM-NC today; the list is read at run time, so a new licence has to be added there first);
- a **carrier**: the museum, archive or site it came from;
- an explicit `religious_figure_depicted: true|false`. A depiction of a prophet or a Companion is an error, so the item must be rejected (AGENTS.md: no figurative depictions of prophets or Companions);
- an explicit `ai_generated: true|false`. AI-generated media must declare `portrait: false`; an AI-generated portrait is an error (AGENTS.md: no AI-generated portraits).

Video and audio follow the same rules. Images from a museum's open-licence collection (for example Met CC0) are T2 carriers; images from a Wikimedia-type archive are checked item by item.

## 8. What is not yet automated

- Only the register rules above are enforced. Item records for articles, theses and whitepapers are not generated yet; they are written by hand until a generator is added.
- Retrieval snapshots (Wayback or local hash) are recorded by hand.
- DOI and repository checks are manual.
