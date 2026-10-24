# Proposal: sources register for three hadith websites

Status: **proposal, not applied.** Awaiting founder approval under `docs/ai-change-gates.md` section 1.
Date: 25 October 2026. Checked in Chrome only; no API calls.

## 1. Files this proposal touches

- Creates: this file (`docs/delegation/source-register-proposal.md`), docs only.
- Does not touch: `docs/attribution.md`, `scripts/harvest/sources.yaml`, `scripts/harvest/library/books.yaml`, `data/source/*`, or any content. Those would change only after approval, in a separate commit.

## 2. Intent

Record how far each site can be relied on, and for what. The register gives each site a status, the evidence for it, and what it would take to upgrade it.

## 3. Why

A Wikipedia citation shows that editors use a site. It does not show that the site is authentic (`docs/sources-policy.md`: Wikipedia is a pointer, not a source). Nothing in this proposal rests on Wikipedia alone.

## 4. Risk rating

`non-impacting`. Docs only, no site, schema, submission or licence change. Any later change to `docs/attribution.md` or the harvest registry would be assessed separately.

## 5. Status vocabulary

- **reference (scoped)**: may be cited for the stated scope, with the edition checked. Not for hadith text alone.
- **reference (edition-dependent)**: may point to a book, but the printed edition must be cited instead of the site.
- **not verified**: do not cite.

## 6. The three sites

### 6.1 dorar.net (Al-Durar al-Saniyya)

| Field | Evidence |
|---|---|
| Owner (site's own claim) | Says it is supervised by Alawi bin Abd al-Qadir al-Saqqaf. Homepage: `https://dorar.net` |
| Method (site's own page) | Hadith methodology, `https://dorar.net/article/77`: grades are the verdicts of named scholars, with attribution to the scholar who gave them. Each book's editions are listed. A linguistic review follows. No claim of manuscript collation. |
| Independent use | Arabic Wikipedia: about 460 articles link to dorar.net. English Wikipedia: about 31 (search `insource:"dorar.net"`) |
| Checked by us | File row 1080 matches Dorar's Abu Dawud text (Dorar's own number 1272; chain `حفص بن عمر`, `شعبة`). Wording checked: the matn is identical. |
| Gap | The "about" page (`https://dorar.net/about`) loads only its title. No independent audit found. |
| **Proposed status** | **reference (scoped)**: for grades attributed to named scholars, and as a pointer to the edition each grade came from. Not a substitute for the edition itself. |
| To upgrade | An independent review of its grading, or a published audit. |

### 6.2 ablibrary.net (Ahl al-Bayt Digital Library)

| Field | Evidence |
|---|---|
| Owner | Arabic Wikipedia: a non-profit run by a Shia organization, founded 1996, with volunteer contributors. Its about page names the founder as the Shia scholar Ali al-Kurani al-Amili (d. before the current edition). Homepage: `https://ablibrary.net` |
| Self-description (`https://ablibrary.net/about`) | Describes thousands of books "from all schools of thought". Some books were machine-extracted from PDFs and are labelled "machine-extracted". Users can correct texts. AI tools are used for search. No authentication process is described. |
| Independent use | Arabic Wikipedia: about 38 articles link to ablibrary.net. English Wikipedia: about 11 |
| Checked by us | File rows 877 and 1867 match Abu Dawud texts on ablibrary.net. For 877 the page shows the text just before hadith 1042, so its number is about 1041 (a snippet, not confirmed on the page). Our file's numbering differs. |
| Gap | No edition is named per text on the pages checked. No independent audit found. |
| **Proposed status** | **reference (edition-dependent)**: may be used to point to a book. Always cite the printed edition, and flag machine-extracted texts. Shia-run: label the host wherever it is cited. |
| To upgrade | Per-book edition metadata visible on each text page, and a published correction policy. |

### 6.3 hadithbd.com (Bangla Hadith)

| Field | Evidence |
|---|---|
| Owner | Privacy policy names the developer, Rokonul Haque, as building the Bangla Hadith app and site |
| Self-description | Says its Bangla hadith content is open to all. Lists 92,930 hadith. Lists two Abu Dawud editions: Albani Academy, 5,274 hadith; Islamic Foundation, 5,184 hadith (`https://www.hadithbd.com/hadith/`). Announces a Sahih Ibn Hibban print edition with Albani and Arnaut grading (notice, 19 Oct 2026). No methodology page found. |
| Independent use | Arabic Wikipedia: 2 articles link to hadithbd.com. English Wikipedia: 5 |
| Checked by us | File row 1867 matches a hadithbd.com page (Sunan Abu Dawood, Islamic Foundation edition, number 2180, from a Google snippet). Rows 877 and 1080 were not checked on hadithbd. Its homepage showed a Cloudflare check on one load. |
| Gap | No method, no editorial statement, no named reviewers. |
| **Proposed status** | **not verified**. Do not cite for hadith text. It may be used only to point to the edition names it lists, after those editions are checked. |
| To upgrade | A published method, named reviewers, and per-text edition citation. |

## 7. Not covered: the Abu Dawud JSON file

Status: **not verified**. Origin: `~/Downloads/hadith-api-master/books/abu-daud.json` (the README matches `gadingnst/hadith-api`). It has 4,419 entries, numbered 1 to 4,590 with gaps. It matches neither Albani's 5,274 nor the Islamic Foundation's 5,184 edition count (see 6.3). Three samples matched published texts in other sources. That is not enough to adopt the file. Next steps would need a named edition and a larger sample, and any import must keep verbatim text out of git (`docs/sources-policy.md`).

## 8. What happens if approved

1. Add a `reliability_note` to each site's entry in `docs/attribution.md`, using the statuses above.
2. Record each site's status in the harvest registry only where a harvest step uses it.
3. No site is labelled "golden" or "trusted" on the basis of citations.

## 9. Open questions for the founder

- Should status "reference (scoped)" for Dorar cover all its grades, or only grades attributed to named scholars?
- Should ablibrary's machine-extracted texts be excluded from citation entirely?
