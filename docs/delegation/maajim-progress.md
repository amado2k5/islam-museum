# Dictionaries Browser (`maajim`): progress and trusted sources

Lane `maajim`, plan `docs/plan/72-dictionaries-browser.md`. Started 20 November 2026. Kept current by every agent that works on the browser.

## State on 20 November 2026

- Browser home `/{lang}/maajim/` with the signature view *Three doors to one root*, a reader of *al-Ṣiḥāḥ* (Bulaq 1282/1865) at `/{lang}/maajim/sihah/`, `/api/v1/maajim.json`.
- About 38 dictionary `work` records tagged `maajim-browser` (works 1 to 43 of the research list where a TDV İslâm Ansiklopedisi article could be read), about 60 TDV source records (`source/dia-*`), 1,228 page `passage` records for the Bulaq *al-Ṣiḥāḥ* (machine reading; accuracy sample stated on each page).
- Not done: works 44 to 48 except Doha (Cairo *al-Kabīr*, Matn al-lugha, Mukhtār ʿUmar, Sharjah) have no record; Lane and Doha are recorded (20 November 2026) and described only; the *Ṣiḥāḥ* entry marks (6,382 on 1,214 pages, 20 November 2026) are a model's reading of machine text, checked by script (95% exact match) and by eye on three pages only, and some roots are misread; Gemini claims about manuscripts, printings and controversies that rest on sources not yet opened are not in any record.

## Trust criteria used by this lane (the agent's own, recorded for audit, 20 November 2026)

A source may carry a claim in a record only when all of these hold:

1. **Opened.** An agent opened the page in the session and saw the claim. A claim that a research assistant reported from a URL the agent has not opened stays `UNVERIFIED` and out of the record. (Gemini's own register of 20 November 2026 states that its URLs were "cited ... from subagent web search and browsing outputs" and that it extracted licence text for none of the 680, so no Gemini-cited source counts as opened.)
2. **Named specialist or institution**, with an edition, volume or page where the source has one.
3. **Stable address, free to read.** A paywalled source may be named as further reading but carries no claim.
4. **The claim is the source's own,** not a summary by a bookshop, an AI page or a forum.
5. **Facts, not text.** Records take facts and the museum's own words. Text beyond 40 words is stored only from a pre-1930 public-domain printing (`docs/sources-policy.md`, dictionaries clause).

## Tiers for the 680 URLs in Gemini's register

Counts are URLs in `source_register_batches_1_to_10.md`; the tier says what the lane does with the source, not that the source is good or bad.

| Tier | Sources (URLs cited) | Use |
|---|---|---|
| **A: used and checked in session** | islamansiklopedisi.org.tr (66); archive.org item metadata (51); Wikidata labels only for identifiers (33); PerseusDL/lexica README (CC BY-SA 4.0); **opened 20 November 2026 and passed:** arabica.dohainstitute.org (10 entries, including Baalbaki's overview of the classical dictionaries, named specialist authors: Ramzi Baalbaki, Qusay al-Afandi, Muhammad Iqbal Farhat, Khattab Khattab), the National Library of Tunisia catalogue (bibliotheque.nat.tn: printings of *Lisān al-ʿArab* and *al-Qāmūs*), the al-Raqq al-Manshur catalogue (app.alreq.com: manuscript counts only) | May carry a claim; every one is a `source/` record that says what it was used for |
| **B: promising, open and check before first use** | amgadcenter.com (14: the pages open but the manuscript tables did not come through as text); asjp.cerist.dz (7) and dergipark.org.tr (5), open journals (home pages open, no article read yet); search.mandumah.com (8); gallica.bnf.fr; ar.wikisource.org (7: opens, holds the preface of *Fiqh al-lugha* only); digitale-sammlungen.de (opens, no record text came through) | A first claim from one of these is checked on the page and recorded as that source's registration |
| **C: reading copies, used to look, not to cite** | app.turath.io (27), ketabonline.com (28), shamela.ws, ablibrary.net (14), waqfeya.net (11), lib.eshia.ir (6), islamweb.net (11), thahabi.org, hz.turathalanbiaa.com | Used to read a classical work and check a quotation or a page; the terms of ketabonline forbid reproduction and none of these grants republication, so the museum cites the printed work and edition, not the site |
| **D: never a source** | qaf.ai (35, AI summary pages); bookshop and aggregator listings (23); blogs and forums (5); Google search URLs (12); ar.wikipedia.org (29) and en.wikipedia.org (15) for prose or any contested claim | Not cited. Wikipedia and Wikidata serve only for identifiers and entity facts under the rule in `AGENTS.md` |

## What happened when Tier B was opened (20 November 2026)

Opened and registered: ten Arabica entries (a further three on 20 November 2026: the overview of the classical dictionaries, the word *muʿjam*, al-Bakrī), two catalogue records of the National Library of Tunisia, one al-Raqq al-Manshur page. Blocked (HTTP 403 to an automated reader): catalog.hathitrust.org and iranicaonline.org. Opened with nothing usable as text: amgadcenter.com manuscript tables, digitale-sammlungen.de, openlibrary.org. Arabica's date for al-Rāghib's death (412 AH, from a date on a manuscript of *al-Mufradāt*) differs from the TDV entry's view that the date is very uncertain; the record cites both and states neither as settled.

## Open items for the lane

- Arabica's sitemap (1,237 pages) was filtered for dictionary titles and only these entries were found; the remaining dictionary history lives in the overview and in the Doha Historical Dictionary's own pages; open a first article from ASJP or DergiPark; try HathiTrust and Iranica through a browser.
- Re-check any record whose summary relies on a claim that Gemini reported without a TDV article behind it.
- Ask the founder's go-ahead before registering a source family in `scripts/harvest/sources.yaml` (`docs/agents/source-families.md`).
- The rights question for the *Ṣiḥāḥ* text and the modern dictionaries is unchanged: no written permission has been sought from Shamela or from the publishers.
