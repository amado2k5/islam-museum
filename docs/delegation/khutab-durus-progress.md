# Lane `khutab-durus` — progress

Lane document: `docs/agents/lanes/khutab-durus.md`. Proposal: `docs/plan/25-khutab-durus-explorer.md` (approved by the founder, PR #2656, merged 31 Oct 2026).

## Next step

The founder approved bulk download (31 Oct 2026): Jamharat Khutab al-'Arab 3 vols (EPUB text layer, sha256 in `SHA256SUMS`, `meta.json`) is in `$HARVEST/books/khutab/jamharat-khutab-al-arab/` — text layer usable (~62k Arabic words vol 1, OCR noise noted). Next: pilot batch of sermon `work` entities from Jamharat + sira/hadith records (claims table shown to the founder first), then website `work kind: website` entities for the verified archives, then a first small audio pilot on islamway.

## Log

- 31 Oct 2026 — Worktree `~/Documents/GitHub/islam-museum-khutab`, branch `claude/khutab-durus-explorer`. Proposal PR #2656 merged. Schema landed: `work.kind: lecture`, `sermon_type` enum, `delivered`/`delivered_by` and `relies_on`/`relied_on_by` predicates, roles `khatib`/`imam`/`preacher`, work fields (`delivered`, `host`, `audience`, `occasion`, `ruler_at_time`, `book_studied`, `order`, `duration`, `delivery_date_status`, `consequence`, `reception`), validator rules + `scripts/khutab.test.ts` (6 tests). `delivered.by` added to the three existing `kind: sermon` works. Found while regenerating schemas: `_base.schema.json` on main carried `kids`, `did_you_know` and a region order `gen-schema.ts` could not reproduce (latent bug); restored parity in `gen-schema.ts` so regeneration is now lossless — reported here for the founder.

## Robots and terms (recorded per source before any bulk access)

- `ar.islamway.net/robots.txt` (read 31 Oct 2026): open to crawlers except `/phpAdsNew/`, `/openx/`, `*/poster$`, `*/qr-code$` (Googlebot-Image) and `/bundles/viewers/pdfjs*`. Terms page still to be read before bulk download.
- `manaratalharamain.gov.sa/robots.txt` (31 Oct 2026): not retrievable via fetch; verify in the browser before use.

## §1a canon-gate checks (processed check, 31 Oct 2026; Sunni verification table shown to the founder before any books.yaml edit)

| Book | Processed check | Sunni check (Wikipedia/Wikidata) | Action |
|---|---|---|---|
| Jamharat Khutab al-'Arab (Ahmad Zaki Safwat, d. 1986) | not in data/work or books.yaml (`jamharat-ansab` is a different book) | Safwat: Sunni Egyptian scholar (verify on record) | candidate `cat: khutab`; EPUB text layer already in `$HARVEST` |
| Diwan Khutab Ibn Nubata (d. 374 AH) | not found | Sunni (verify infobox) | candidate |
| al-Yaqut fi al-Khutab, al-Tabsira, Bustan al-Wa'izin (Ibn al-Jawzi) | `work/al-tabsira-fi-al-waz`, `work/bustan-al-waizin` exist (al-Yaqut not found) | Ibn al-Jawzi Sunni Hanbali (known) | reuse existing entities; al-Yaqut candidate |
| Lata'if al-Ma'arif (Ibn Rajab) | `work/lataif-al-maarif` exists | Sunni Hanbali | existing entity |
| Amali al-Shajari | not found | Sunni (verify) | candidate |
| Amali al-Qali | `work/amali-al-qali` exists | Sunni | existing entity |
| Modern collections (Ibn Uthaymin, al-Ghazali, al-Tantawi, Kishk, ministry volumes) | not found | Sunni | candidates, verify editions |

## Excluded items (reason, gate, override)

_ none yet — per the founder's rule nothing is excluded without his verification _

## Batches landed (to 31 Oct 2026)

- Batch 1 (PR #2671): 8 sermon works from Jamharat v1 — the Prophet's Meccan address; accession sermons of Abu Bakr, Umar, Uthman; Abu Bakr's sermon on the Prophet's death; Ibn Mas'ud's and Ali's Kufa khutab; Aktham ibn Sayfi. Collection work/jamharat-khutab-al-arab + source/jamharat-khutab-al-arab-safwat-1352.
- Batch 2 (PR #2672): 7 Umayyad-era sermons (al-Hasan sulh, both Zubayrids opponent-cited, Mu'awiya II, al-Walid, Sulayman, Umar b. Abd al-Aziz patron-cited) + 4 kind:website entities (manarat-al-haramain, droos-al-haramain, islamway, alukah) + 3 group stubs.
- 44 authorised source families registered (PR #2666); cat: khutab canon entries (PR #2665); schema + lane (PR #2661).

- Batch 3 (31 Oct 2026, founder-approved vol 3 candidate list, narrowed): 5 Abbasid-era sermon works from Jamharat v3 with ar/en/ur prose — Dawud ibn Ali in Kufa (EPUB p.7), al-Saffah's second Friday in Kufa (p.11), al-Nafs al-Zakiyya in Medina (p.37), Tahir ibn al-Husayn in Baghdad (p.118), al-Ma'mun on Harun's death (p.119). Narrowed from ~20 because the remaining candidates have damaged OCR or no firm date; they stay on the list. Cite anchors are EPUB page indices, not printed page numbers (not yet checked against the printed pages).

- Batch 4 (31 Oct 2026, continuing the vol 3 list): 2 more works — Dawud ibn Ali's rebuke of al-Saffah (EPUB p.10; date approximate, early al-Saffah, 132–136 AH) and Harun al-Rashid's accession sermon (p.82; date inferred from p.81, the death of al-Hadi, 170 AH). Rejected as unready: p.76 (Ibn Utba condolence, speaker's name unclear in OCR), p.84 (a testament, not a sermon), p.218 (Qadi Iyad's piece quotes Qur'an passages; OCR too damaged), p.225 (Abu Bakr ibn Muhammad, attribution disputed in the book itself; body mostly footnote), p.361 (index only, no body read), p.26 (Mansur at Makka, year not in the text). These are not dropped: they stay open for a later pass with better OCR or a firm date.

- Backfill (31 Oct 2026): ar/en/ur prose files added for the 15 batch 1–2 works. Each is a one-paragraph summary restating the entity's already-cited facts, cited to the Jamharat source. This is not the rich first pass: the source pages were not re-read, so the prose is short and needs enrichment against the EPUB pages.

- Batch 1–2 source audit (31 Oct 2026, vol 2 pages checked): three entries do not match their source pages and need the founder's ruling before any rewrite. (a) `khutbat-umar-ibn-abd-al-aziz-madina`: vol 2 pp. 203–211 hold Umar ibn Abd al-Aziz's sermons as caliph (his first sermon on taking office, p. 203), not a Medina sermon under al-Walid; the Medina label is unverified. (b) `khutbat-sulayman-ibn-abd-al-malik`: the sermons on vol 2 p. 306 are by a Khurasan commander calling to depose Sulayman, not by Sulayman; no Sulayman sermon was found. (c) `khutbat-abdullah-ibn-al-zubayr-makka`: vol 2 p. 524 lists his "sermon on the day he was killed" in the index only; the body was not located. Nothing rejected; these await the founder's ruling.

## Indexed totals

22 sermon works written (batches 1–4); 4 website works; 44 source entities; era coverage: prophetic, rashidun, zubayrid/umayyad; countries: Hijaz, Iraq, Syria; speakers: 11; formats: text (book pages), websites.
