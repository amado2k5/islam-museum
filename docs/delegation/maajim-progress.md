# Dictionaries Browser (`maajim`): progress and trusted sources

Lane `maajim`, plan `docs/plan/72-dictionaries-browser.md`. Started 20 November 2026. Kept current by every agent that works on the browser.

## State on 20 November 2026

- Browser home `/{lang}/maajim/` with the signature view *Three doors to one root*, a reader of *al-Ṣiḥāḥ* (Bulaq 1282/1865) at `/{lang}/maajim/sihah/`, `/api/v1/maajim.json`.
- About 38 dictionary `work` records tagged `maajim-browser` (works 1 to 43 of the research list where a TDV İslâm Ansiklopedisi article could be read), about 60 TDV source records (`source/dia-*`), 1,228 page `passage` records for the Bulaq *al-Ṣiḥāḥ* (machine reading; accuracy sample stated on each page).
- Not done: works 41, 44 to 48 (Lane, Cairo *al-Kabīr*, Matn al-lugha, Mukhtār ʿUmar, Doha, Sharjah) have no record; the *Ṣiḥāḥ* text is not split into entries; Gemini claims about manuscripts, printings and controversies that rest on sources not yet opened are not in any record.

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
| **A: used and checked in session** | islamansiklopedisi.org.tr (66); archive.org item metadata (51); Wikidata labels only for identifiers (33); PerseusDL/lexica README (CC BY-SA 4.0) | May carry a claim; every one is a `source/` record that says what it was used for |
| **B: promising, open and check before first use** | app.alreq.com (19, manuscript and printing catalogue); amgadcenter.com (14, manuscript indices); arabica.dohainstitute.org (7); asjp.cerist.dz (7) and dergipark.org.tr (5), open journals; search.mandumah.com (8); iranicaonline.org; catalog.hathitrust.org (7), gallica.bnf.fr and bibliotheque.nat.tn (6), library catalogues for first printings; ar.wikisource.org (7) | A first claim from one of these is checked on the page and recorded as that source's registration |
| **C: reading copies, used to look, not to cite** | app.turath.io (27), ketabonline.com (28), shamela.ws, ablibrary.net (14), waqfeya.net (11), lib.eshia.ir (6), islamweb.net (11), thahabi.org, hz.turathalanbiaa.com | Used to read a classical work and check a quotation or a page; the terms of ketabonline forbid reproduction and none of these grants republication, so the museum cites the printed work and edition, not the site |
| **D: never a source** | qaf.ai (35, AI summary pages); bookshop and aggregator listings (23); blogs and forums (5); Google search URLs (12); ar.wikipedia.org (29) and en.wikipedia.org (15) for prose or any contested claim | Not cited. Wikipedia and Wikidata serve only for identifiers and entity facts under the rule in `AGENTS.md` |

## Open items for the lane

- Open the Tier B sources one at a time and register each that passes, in `data/source/` with a `reliability_note`.
- Re-check any record whose summary relies on a claim that Gemini reported without a TDV article behind it.
- Ask the founder's go-ahead before registering a source family in `scripts/harvest/sources.yaml` (`docs/agents/source-families.md`).
- The rights question for the *Ṣiḥāḥ* text and the modern dictionaries is unchanged: no written permission has been sought from Shamela or from the publishers.
