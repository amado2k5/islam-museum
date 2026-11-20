# 72 — Dictionaries Browser («متصفح المعاجم»): proposal

_Written 20 November 2026 on the founder's chat instruction: harvest the dictionaries, their authors and everything about them, publish them in the museum, make the most important ones fully readable, and list the sources. Status: **proposal, awaiting approval of section 5 (the text route)**. Nothing in `data/`, `content/` or `site/` has been changed for it._

Gate labels (`docs/ai-change-gates.md` section 3): the record and page work is `non-impacting`; the full-text route in section 5 is **submission-impacting** (it adds a licence posture and a new `/api/v1/` export, and it widens the sources policy).

## 1. What the browser is

A front door over the one graph, as every browser is (`docs/site/browsers.md` section 1). No side table.

- **Works.** Each dictionary is a `work` record (kind `dictionary`; sub-kind from the genre list below), linked to its author (`person`), to the dictionaries it draws on and that draw on it, to its editions (`source` records), and to its commentaries and abridgements.
- **Authors.** Each lexicographer is a `person` record with role-scoped `story_roles`, teachers and students, and a sourced biography. Sect or school only with its source.
- **Entries (the readable text).** Entries of the dictionaries chosen for full reading, one `passage` per headword or root (the model the poetry reader uses, `docs/delegation/poetry-passages-plan.md`), cited to edition and page.
- **Pages.** `/[lang]/maajim/` (home, signature view, filter by genre, century, author, arrangement method), `/maajim/<slug>/` for a work, a root/headword lookup across the dictionaries that are readable, and the chain of dependence between works.
- **Genres** (from the two research rounds): general Arabic lexicons; Qur'anic vocabulary; gharīb al-ḥadīth; terminology; fiqh vocabulary; thematic and synonym works; geographic dictionaries; loanwords; etymology and morphology; solecisms; proverbs; modern; bilingual and Orientalist.
- **Five languages** for every label, summary and interface string (`AGENTS.md`); prose in `content/ar/` first.

## 2. Scope of the first run

The 40 pre-modern works and about 45 authors in `docs/delegation/gemini/dictionaries-browser-prompt-b-history.md` (seven batches). Modern in-copyright dictionaries (al-Wasīṭ, al-Kabīr, Mukhtār ʿUmar, Doha, Sharjah, Hans Wehr) are described and linked, never hosted.

## 3. Sources and what has been established

- Two Gemini research rounds, each checked by an agent (20 November 2026). Checked findings: the Shamela book IDs for 29 works resolve; no open structured dataset exists (`mysamai/m3ajim` is CC BY-NC 4.0, Jawāmiʿ al-Kalim is "other", `wizsk/arabic_lexicons` is GPL-3.0 and bundles in-copyright works, `app-furqan/quran-app-data` carries no standard licence).
- Open and unproven: the licence of Lane's Lexicon in Perseus's own distribution, the Sharjah permission contact, the Hawramani reuse statement.
- The history, authors and controversies come from Gemini prompt B (answers not yet received) and are verified by an agent page by page before a record is written; classical sources (al-Suyūṭī's *al-Muzhir*, *Bughyat al-Wuʿāt*, *Inbāh al-Ruwāt*, *Muʿjam al-Udabāʾ*, *Wafayāt al-Aʿyān*, al-Zirikli's *al-Aʿlām*) are cited with volume and page.
- Every record lists its sources and where they came from (`provenance`), and the browser has a sources page that lists each harvested text, the edition, the scan or file it came from, and its licence status.

## 4. What exists already

The harvest store holds OCR of the Būlāq-era and modern prints of *Lisān al-ʿArab* (two registers: `lisan-arab`, `lisan-arab-ibn-manzur`), *al-Qāmūs al-Muḥīṭ* and *al-Ṣiḥāḥ* (`docs/library/harvest-register.yaml`; stored under `~/islam-museum-harvest/books/lugha/`). Checked 20 November 2026: the OCR is too noisy to publish as a reading text (a sample page of the *Qāmūs* OCR reads «الاما الا ا ال ا الوب و لر يتاتيا» where the print has ordinary words). It is usable to locate pages and to mine facts, not to display entries. `data/work/al-qamus-al-muhit.yaml` and `data/work/al-muhkam-ibn-sida.yaml` already exist and are reused, not duplicated.

## 5. The decision the founder must make: where the readable text comes from

`docs/sources-policy.md` keeps verbatim text beyond 40 words out of git, with two exceptions: the Qur'an (Tanzil) and pre-1930 public-domain poem lines in `passage` records. Reading a dictionary in full needs a third exception. The authors died between 175 and 1205 AH, so the works are out of copyright; the question is the transcription. Options:

| Route | Clean? | Rights | Cost |
|---|---|---|---|
| **A. Key or OCR a pre-1925 print** (Būlāq 1300–07 AH *Lisān*, Būlāq 1272 AH *Qāmūs*, Būlāq 1865 *Ṣiḥāḥ*, Būlāq *Mukhaṣṣaṣ*, Cairo 1306 AH *Tāj*) with a modern Arabic OCR model, then correct entry headwords against a second print | Medium; headwords good, definitions need checking | Clear: the print is public domain, no modern editor's text | Slow; quality gated by a measured error rate per page |
| **B. Take Shamela's text where its card marks "base text only"** and strip footnotes by script | High | Not granted: the Shamela project states no redistribution licence and the Hugging Face copy limits itself to "research and personal use" | Fast; legal risk on the museum |
| **C. Link out only** (ship the works, authors and history, link each entry to the host that serves it) | n/a | None needed | Fast; no reading inside the museum, which is what was asked |
| **D. Ask Shamela and the scholars' publishers for written permission** | High | Clean once granted | Waits on others |

Recommendation: **A for a pilot of three works** (*Ṣiḥāḥ*, *Mukhtār al-Ṣiḥāḥ* only if a pre-1930 print is found, *al-Mufradāt* only if a pre-1930 print is found; otherwise *Asās al-Balāgha* 1882 Cairo), measured and published with the error rate stated on the page; **C for everything else meanwhile**; **D in parallel**. B is not recommended. The choice is the founder's and is recorded in the decision ledger when made.

## 6. Files this proposal will touch once approved

- `data/work/`, `data/person/`, `data/source/` new records (about 40, 45 and 60); `data/passage/` entries for the pilot only.
- `content/{ar,en,ur,fr,es}/work/` and `/person/` prose for those records.
- `schema/enums/` (work kinds), `schema/predicates.yaml` only if an existing predicate does not fit (none expected).
- `site/src/pages/[lang]/maajim/` and its components; `i18n/{ar,en,ur,fr,es}.yaml` keys; `site/src/lib/` helpers.
- `/api/v1/maajim/` exports; `docs/data/README.md`, `site/public/openapi/v1.json`, `llms.txt`.
- `docs/site/browsers.md`, `docs/plan/00-README.md`, `docs/agents/lanes.md` (new lane `maajim`), `docs/status.md`, `docs/library/harvest-register.yaml` (state changes only), `CANARY.md`.
- `docs/sources-policy.md` (the new exception), only on approval of the route.

## 7. Order of work

1. Founder approves this proposal and picks a route in section 5.
2. Gemini prompt B answers return; an agent verifies each, records are written in batches of at most 25.
3. Works, authors, sources: first the ten recommended imports, then the rest.
4. Browser pages, API, search, five languages.
5. Pilot full text under the chosen route, with measured accuracy shown to the reader.
6. Validate, test, build, then a pull request; the founder deploys.
