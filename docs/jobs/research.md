# Job Browser: research method

Part of the Job Browser plan. Master plan: [`README.md`](README.md). Binding with `docs/agents/publication-standard.md` (citations to defined sources plus provenance; one source is enough for any fact), `docs/sources-policy.md` (any source may be read and rewritten in the museum's own words with a citation; no verbatim text beyond a 40-word cited quotation; no source files in git), `docs/agents/content-standards.md` (rich first pass) and the founder's classification discipline as the modern-figures rulings of 1 November 2026 state it.

## 1. The order of research, for every job

1. **The museum itself.** The graph first: who holds the job today (the roles bootstrap and the prose leads in [`taxonomy.md`](taxonomy.md)), who taught whom (`student_of`, `teacher_of`), which groups exist (`member_of`, the one guild, the 25 orders), which works exist (`work/maalim-al-qurba-fi-ahkam-al-hisba`, `work/al-muqaddima`, `work/al-fihrist`, the eleven `tabaqat-*`), and the EI2 and DİA material already harvested into `data/source/` (`source/encyclopaedia-of-islam-2` with PDF-page anchors; 18 `source/tdv-*` articles). The museum's harvested books are cited as the source entities they already are.
2. **The classical literature of the job.** Hisba manuals (al-Shayzari's *Nihayat al-Rutba fi Talab al-Hisba*; Ibn al-Ukhuwwa's *Ma'alim al-Qurba*, in canon under the `lib-exp-siyasa-hisba` lane; Ibn Taymiyya's *al-Hisba*); the crafts and sciences chapters of Ibn Khaldun's *Muqaddima* (`source/muqaddima-ibn-khaldun`); al-Jahiz on trades; al-Biruni on pharmacy (`lib-exp-medicine-science` lane); the Ikhwan al-Safa epistle on the crafts; futuwwa and guild texts; adab al-qadi and adab al-tabib literature; the tabaqat, which are organised by profession and era (al-Sulami for the Sufis, Ibn Abi Usaybi'a for the physicians, al-Suyuti and Ibn al-Jazari for the reciters, al-Jumahi for the poets, al-Mizzi and Ibn Hajar for the transmitters). Each book read is registered as a `data/source/` entity (`docs/sources-policy.md` §6, with a `reliability_note`) before it is cited, and in the harvest canon under the canon gate when it is a Sunni book to mine.
3. **Reference works online.** EI2 and EI3, DİA (`islamansiklopedisi.org.tr`, one source entity per article as the `tdv-*` records do), Encyclopaedia Iranica (the `iranica-*` pattern), Oxford Islamic Studies: for origins, chronology, geography and organisation. Every article cited gets its own source entity with the URL, the author and the date read.
4. **Museum and library collections online** for tools, workplaces and surviving output: the Met, the V&A, the Louvre, the British Museum, the David Collection, MIA Doha, Topkapı. An object page cited is a `reference_data` source entity with the accession number in the title; where the museum already has the object as an `object/` record, the record is linked in `tools` or `outputs` and tagged back with a `jobs:` entry.
5. **Wikidata and Wikipedia as leads only.** P106 (occupation) and the articles' own references point the writer to a checkable source; a published occupation claim lands on that source, never on the structured field. Where a Wikipedia article is the only source for a fact and the article cites a source for it, the broad rule (`docs/delegation/wikipedia-broad-rule-proposal.md`) applies as it does for persons: a `wikipedia-<slug>-<lang>` source entity, the revision recorded, the fact used only where the article cites it.
6. **Modern scholarship and the living job.** For jobs that survive (calligraphy, Qur'an recitation, the traditional crafts, the mutawwif): guild and union histories, UNESCO intangible-heritage files (training, transmission, threats, in the files' own words rewritten), professional associations' own sites for the modern form, each registered as a source entity.

## 2. Source entities Phase 1 creates

Checked against `data/source/` on 1 November 2026: none of these exists yet.

| Source entity (proposed id) | Kind | For |
|---|---|---|
| `source/nihayat-al-rutba-shayzari` | primary, book | muhtasib, the market crafts, physician, pharmacist, baker, weaver |
| `source/maalim-al-qurba-ibn-al-ukhuwwa` | primary, book | the same, with Ibn al-Ukhuwwa's additions on scribes and copyists (the `work/` record exists; the `source/` record is created as the lane cites it) |
| `source/al-hisba-ibn-taymiyya` | primary, book | muhtasib |
| `source/al-fihrist-ibn-al-nadim` | primary, book | copyist, translator, bookbinder, papermaker (the `work/al-fihrist` record exists) |
| `source/uyun-al-anba-ibn-abi-usaybia` | primary, book | physician, surgeon, oculist, pharmacist |
| `source/akhbar-al-qudat-wakii` | primary, book | qadi |
| `source/tabaqat-al-shuara-jumahi` | primary, book | poet (the `work/tabaqat-al-shuara` record exists) |
| `source/ghayat-al-nihaya-ibn-al-jazari` | primary, book | qari |
| `source/rasail-ikhwan-al-safa-crafts` | primary, book | the crafts epistle |
| `source/ei2-<article>` is **not** created: EI2 articles are cited by volume and PDF page on `source/encyclopaedia-of-islam-2` as the `ei2` lane does | | |
| `source/tdv-<article>` | reference_data, web | one per DİA article read (kadı, vezir, hattat, müstensih, mimar, tabip, müneccim, tacir, muhaddis, müderris) |
| `source/iranica-<article>` | reference_data, web | one per Iranica article read |
| `source/met-<accession>`, `source/bm-<accession>`, `source/vam-<accession>` | reference_data, web | object pages for tools and output |
| `source/unesco-ich-<element>` | reference_data, web | living crafts (calligraphy, the miniature, the carpet) |

Each is registered before the first citation, with `reliability_note`, `open_access`, `URL` or edition, and the date read, in the shape of `source/tdv-ahmed-pasa-bursali` and `source/encyclopaedia-of-islam-2`.

## 3. The classification discipline, applied to jobs

The founder's rulings for faith (`docs/agents/lanes/modern-figures.md`, 1 November 2026) transfer word for word:

- **Attestation of the person himself.** A job is recorded only where a source says this person held, practised or was appointed to it. Family background, descent, a relative's office, a hereditary title, a category filing or a structured-data field (P106, an infobox "occupation") never settle it on their own. They open a lead.
- **Doubt is preserved, never resolved by guesswork.** Two sources that disagree (qadi of Basra or of Kufa; vizier or chancery head) produce `status: debated` with both readings in the note. Transmitted material without a checkable chain is `status: tradition`.
- **Headship never counts.** The head of a Sufi order is `job/sufi-shaykh` because a source says he guided disciples, not because he inherited the zawiya.
- **No modern analogy in a historical record.** A "life coach" is matched to the murshid shelf only on the Phase 5 crosswalk page, which is labelled as analogy and written into no record.
- **Report what is excluded.** Every occupation a writer declines to record (no source, or doubt too wide for `debated`) is logged in `progress.md` with the record id, the reason and the gate, as the founder's standing rule for excluded items requires. Nothing is rejected on the agent's own judgement of a source's worth; the founder decides.

## 4. The research trail in provenance

Every job record and every swept person record says, in `provenance`:

```yaml
provenance:
  layer: own-research
  source: "EI2 vol. 4 pp. 373–375 (art. Kadi); DİA 'KADI' (read 3 Nov 2026); al-Shayzari, Nihayat al-Rutba, ch. 1; Ibn Khaldun, Muqaddima, ch. 3 §31; museum graph: 124 holders from roles, 674 prose leads read"
  generated_by: "Claude Code"
  model: "claude-fable-5-1"
  run: "jobs-p1-b01"
```

The same facts go in the commit trailers (`AI-Agent`, `AI-Model`, `AI-Editor`), and `npm run cite-check -- <ids>` runs on every batch before it is committed; a batch is committed only when the cite-check line reads "0 fail" and the validate line reads "0 errors", each asserted as its own step.
