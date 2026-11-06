# Muslim Inventions Browser: decisions

## D-000 — Founder's standing authorization (4 November 2026)

The following ten points are transcribed verbatim from the founder's operative prompt. They govern this lane; they do not relax `AGENTS.md`, the change gates, source policy or no-go registry.

1. **Run unattended for as many hours as it takes.** Do not stop to ask a question. Do not wait for a human reply at any point. When a decision is needed, research it, decide it yourself by the rules in section 10, write the decision and its reasoning in `docs/inventions/decisions.md`, and continue.
2. **Install and use any tool on this Mac** that helps: Homebrew packages, `uv`/`pip` packages, `npm` packages, `aria2c`, `ia` (Internet Archive CLI), `ocrmypdf`, `tesseract` (ara, eng, fas, tur, urd), `poppler` (`pdftotext`, `pdftoppm`), `pandoc`, `ImageMagick`, `qpdf`, `ollama` / MLX with open-weight models for local drafts and translations, ComfyUI Desktop and Draw Things (already installed) for image generation, Apple Vision for OCR, Google Chrome for the web, Playwright for live checks, DuckDB/SQLite for indexes. Prefer what `docs/plan/15-local-harvest.md` already names. No paid service, no cloud model call from scripts (`AGENTS.md`: models only in the building phase; you are the model in the building phase).
3. **Download any book, PDF, map, image, dataset or page** that enriches the content: Wikipedia and Wikidata dumps or API pages, Internet Archive scans, HathiTrust full-view, public-domain editions of al-Jazari, the Banu Musa, Taqi al-Din, Ibn al-Haytham, al-Zahrawi, al-Razi, Ibn Sina, al-Biruni, Jabir, the Fihrist; museum collection records and open-access images (Met, British Museum, Smithsonian, Louvre, V&A, David Collection, Museum of Islamic Art Doha, Khalili, Istanbul Museum of the History of Science and Technology in Islam, Chester Beatty, Bodleian, BnF Gallica, Qatar Digital Library, Wellcome); Google Patents and USPTO records for modern inventions; EI2/EI3, DİA (`islamansiklopedisi.org.tr`), Encyclopaedia Iranica, MuslimHeritage/FSTC (leads only, section 6.3), Sezgin, Rashed, Hill, al-Hassan. **Everything downloaded lives outside git**, at `~/islam-museum-harvest/inventions/<source-slug>/` (create it; it is outside the repository and outside iCloud, per `docs/plan/15-local-harvest.md` §2). What enters git is only what `docs/sources-policy.md` allows: facts in `data/`, the museum's own prose, citations with page numbers, at most a 40-word cited quotation. Never commit a PDF, OCR text, page image, dump or claims table.
4. **The `submission-impacting` sign-off is granted in advance** for exactly this: adding the `invention` class (22 classes become 23), its enums and predicates, the `inventions:` ties on existing classes, and the new `/api/v1/invention/*`, `/api/v1/inventions.json` and `/api/v1/inventions/chains.json` routes. Label the commit `submission-impacting` and update the claims register (`docs/outreach/unesco-nomination-dossier.md` A.5) and the evidence map (`docs/outreach/dpga-evidence-map.md`) in the same commit, as `docs/ai-change-gates.md` §3 requires. Adding content inside the lane afterwards is `non-impacting`.
5. **Commit, push, open pull requests, and merge them yourself** once the local gates pass (`AGENTS.md`, canary workflow step 5; `main` accepts PRs only). Do not wait for review. Never force-push, never `git add -A`, never rewrite history, never overwrite another agent's work: three-way merge every time `origin/main` moved.
6. **Never deploy.** Merged is not live. Do not run `deploy.yml` or `deploy-uat.yml`, not by `gh workflow run`, not from the Actions tab. At the end of each phase write in `docs/inventions/progress.md` what the founder must deploy and whether a Worker or workflow file is among the merged files.
7. **Targets:** at least 100 inventions fully written and live-ready; then the next 100; then the next 100; and onward until the sources run dry (section 12). Never trade depth for count: the rich-first-pass rule of `docs/agents/content-standards.md` applies to every invention.
8. **Research freely, with every means on this Mac** (founder, 4 November 2026, 23:02): any book, any website, the museum's existing data; **the internet through Google Chrome on this Mac** (the installed browser, with its sign-ins, for pages that a script cannot fetch, for museum collection searches, Google Patents, HathiTrust full view, JSTOR or publisher pages the founder's accounts can open; read and take notes, never scrape in a way a site forbids, never commit what the sources policy keeps out); **any local AI model** (Ollama, MLX, ComfyUI, Draw Things) for drafts, translations, classification, embeddings and images, with the model named in the record's `provenance`; **Apple Vision** (the `Vision` framework through a short Swift or `pyobjc` script, or `macOS` Live Text) for OCR of scanned pages, maps and manuscript images in Arabic, Persian, Ottoman Turkish, Urdu and Latin scripts, alongside `tesseract` and `ocrmypdf`; keep the OCR text in the harvest folder, cite the page, and never commit it.
9. **Scope and order** (founder, 23:01): the inventions are those created by **Sunni Muslims**, in any field or domain, anywhere and at any time (section 3's inclusion rule says how the maker's faith and tradition are established and how the uncertain cases are handled); the work **begins with the first era of Islam and moves forward toward the present**, so the first hundred lean to the early centuries and each later hundred continues in time. **Every invention has an image**: an existing museum image, a free-to-use image found online, or an AI rendering of the invention produced through the museum's illustrations pipeline (section 8.3).
10. **Founder-supplied resources are approved** (founder, 4 November 2026): the Internet Archive copies of *1001 Inventions*, the CNN, National Geographic and History Hit articles, and anything else listed in section 6.3a may be read and used as that section says.

Scope of the sign-off is limited to the exact class, enums, predicates, existing-class ties and API routes named in item 4. Any other submission-impacting change requires its own approval and matching outreach updates. No deployment is authorized.

## D-001 — Use the existing `ideas` wing (4 November 2026)

**Question:** Which existing wing should invention records use?

**Rule applied:** Section 10 of the operative prompt says choose only from `schema/enums/wings.yaml`; no new wing is approved in Phase 0.

**Decision:** Use `ideas` consistently. `science` is not in the current enum, and the records primarily describe knowledge, techniques and systems rather than a new museum wing. Revisit only through an approved proposal if the taxonomy changes.

**Touches:** Phase 1 invention examples/schema and later invention records; no current data change.

## D-002 — Census measures recorded roles and prose literally (4 November 2026)

**Question:** How should the census count the prompt's scientist/person pool?

**Rule applied:** Reproduce the prompt's listed role signals while accounting for the repository's existing `roles:` and `story_roles:` shapes.

**Decision:** Count each requested role from both fields, de-duplicate persons for the pool total, and report per-role counts separately. The prose signal is exactly `invent|اختر|ابتكر` over English and Arabic prose files. These are leads, not invention claims.

**Touches:** `scripts/report/inventions-census.ts`, `docs/inventions/README.md`, and generated coverage.

## D-003 — Keep the current product version for Phase 0 (4 November 2026)

**Question:** Does the planning/census work require a release version bump?

**Rule applied:** `docs/engineering/15-release-notes-and-versioning.md` defines a minor bump for a new feature, page, wing, class or endpoint, and says other entries accumulate under the current version.

**Decision:** Phase 0 adds internal planning documents and a census command, but no reader-facing feature, data class, page or endpoint. Keep package version `0.1.0`; initialize the empty `CANARY.md` with a `v0.1.0` block and a reader-facing note. The schema/API and browser-home phases will receive the required minor bumps.

**Touches:** `CANARY.md`; no package version change.

## D-004 — Use the repository date calendar model (5 November 2026)

**Question:** How should invention dates preserve a Hijri date when the Phase 1 example uses `calendar: hijri`?

**Rule applied:** `schema/_base.schema.json` permits only `julian` and `gregorian` for `calendar`; `hijri` is a separate string field. The Hijri conversion helpers also accept only those civil calendars.

**Decision:** Keep the existing date schema. Record a source's Hijri date in `hijri`; use `calendar` only when the source explicitly identifies a Julian or Gregorian civil calendar. Do not write `calendar: hijri`, and do not invent an EDTF conversion or calendar designation. Correct the Phase 1 example accordingly.

**Touches:** `docs/inventions/schema.md` and future invention dates; no schema expansion.

## D-005 — Defer the unapproved invention timeline endpoint (5 November 2026)

**Question:** Should Phase 1 also add `/api/v1/inventions/timeline.json`, which appears in the operative prompt's later browser requirements?

**Rule applied:** D-000 item 4 grants submission-impacting approval only for `/api/v1/invention/*`, `/api/v1/inventions.json` and `/api/v1/inventions/chains.json`. The timeline route is outside that exact authorization.

**Decision:** Do not implement the timeline endpoint in Phase 1. The structured `era.first_attested` data remains available through the approved class and dataset endpoints. A timeline endpoint requires a separate approved proposal and matching outreach updates if it changes submission claims.

**Touches:** Phase 1 API scope and future browser work; no route added.

## D-006 — Base the Phase 1 release on the refreshed canary history (5 November 2026)

**Question:** Which product release version should record the Phase 1 class and API after `origin/main` advances?

**Rule applied:** `docs/engineering/15-release-notes-and-versioning.md` says a new class or endpoint takes a minor product-version bump, and the top `CANARY.md` block is the version shown to readers. The refreshed `origin/main` (`6d78f41539`) restores the release history through v1.1.0; its root `package.json` remains at 0.1.0.

**Decision:** Preserve the complete recovered `CANARY.md` from `origin/main` and add v1.2.0 for Phase 1. Do not retain the Phase 0 branch's temporary v0.1.0/v0.2.0 release-note history over the recovered product history, and keep the root package version at 0.1.0, matching `origin/main`; the public product version comes from `CANARY.md`.

**Touches:** `CANARY.md`, `package.json`, `package-lock.json`; no API version change.

## D-007 — Keep the Ibn Khalaf al-Muradi mechanism as a lead (5 November 2026)

**Question:** Can the intermittent gearing attributed to Ibn Khalaf al-Muradi be promoted to an invention record from the sources currently available?

**Rule applied:** Sections 3, 6.3 and 10 require a cited basis for the maker's Muslim identity and Sunni inclusion, and require popular summaries to remain leads until the technical claim is checked against specialist literature or the primary text. Faith is not inferred from a name, language, place or period.

**Decision:** Keep the candidate at `[~]`. TDV's “HİYEL” and Al-Hassani's secondary summary identify a useful mechanism lead, but no maker-faith basis or verified device-level primary evidence was established. Hill's cited books were not available as open text and Samsó's review could not be accessed; do not create an invention or person record on this evidence.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-008 — Keep the Sistan windmill and saqiya claims unresolved (5 November 2026)

**Question:** Do the screened sources establish a qualifying Muslim-origin claim for the Sistan vertical-axis windmill or a specific Muslim improvement to the saqiya?

**Rule applied:** A technology's existence or transmission in Muslim lands is not proof of Muslim invention. An inherited device may be recorded only with its precursor and a sourced, specific improvement; state-party and popular accounts are leads, not independent technical evidence.

**Decision:** Keep both candidates at `[~]`. The Sistan sources leave the era and origin unsettled and identify no qualifying maker; Wilson's accessible abstract places saqiya and related water technologies before Islamic expansion but does not identify a later Muslim improvement. Do not state an origin or improvement until a specific maker and contribution are supported.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-009 — Keep al-Khujandi's instrument claims as leads (5 November 2026)

**Question:** Can the Fakhri sextant, a separate mural quadrant, or the *shamila* be promoted to invention records?

**Rule applied:** A record needs a specific, sourced contribution and a source-backed Sunni inclusion basis. Conflicting technical claims remain attributed to their sources; no maker's faith or tradition is inferred from name, origin or patronage.

**Decision:** Keep all three at `[~]`. The Cheikho scan's introduction places the Fakhri sextant at Rayy, and pp. 68-69 preserve an account attributed to al-Biruni after he saw it; the text describes a meridian installation and a one-sixth-circle arc. Its apparatus notes a corrected reading of sixty divisions, while the exact scale precision remains unsettled against Van Brummelen's 10-arcminute account and MacTutor's seconds claim. Neither the Mawsu'a passage nor the Cheikho text establishes al-Khujandi's Sunni tradition, despite the existing person record's `traditions: [sunni]`. The sources do not establish that the mural quadrant is distinct from the Fakhri sextant, and the *shamila* still lacks an inspected primary account. Correct the location to Rayy, preserve the possible overlap, and retain all three leads until identity and attribution requirements are met.

**Touches:** `docs/inventions/queue.yaml`, `docs/inventions/research.md`, and the external source registry; no museum data or prose change.

## D-010 — Keep al-Farghani's astronomy concepts as leads (5 November 2026)

**Question:** Do the 15 queue leads derived from al-Farghani's astronomy concepts establish 15 inventions?

**Rule applied:** Section 3 treats scientific concepts as leads, not automatic invention claims. A record needs a source-backed distinct contribution and a maker whose Muslim and Sunni basis is recorded in the person record.

**Decision:** Keep the 15 candidates at `[~]`. The cited 1669 edition and the existing work record establish that the treatise discusses eclipses, the zodiac, epicycles and eccentric orbs, celestial motions, heliacal rising, parallax, the lunar year, stars, solstices and equinoxes, distances and sizes; they do not establish that al-Farghani originated each topic. The lunar-year arithmetic and fixed-star motion warrant comparison with earlier sources, but neither is promoted on the current evidence. `person/al-farghani` has no `faith` block, so do not create invention records until both contribution and maker eligibility are supported.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-011 — Keep the qibla-methods lead unresolved (5 November 2026)

**Question:** Does al-Umari's account establish a Muslim invention of determining the qibla by stars, winds, mountains or rivers?

**Rule applied:** A method may qualify, but a queue concept is not an invention without an attributable maker or a specifically documented Muslim contribution; cited source passages must also be verified.

**Decision:** Keep the candidate at `[~]`. The concept cites al-Umari's 1924 edition for four methods, but its source record says the passages were read from OCR and not checked against the images. The account describes practices of multiple lands and names no maker or specific innovation. Verify the scan and trace a maker/contribution before considering a record.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-012 — Scope the chess lead to attributed variants (5 November 2026)

**Question:** Can chess itself, or one of its variants reported in Muslim sources, enter the browser as a Sunni Muslim invention?

**Rule applied:** The browser requires a Muslim maker and Sunni basis, and distinguishes an invention from the transmission or description of an older game. A documented variant may be a separate lead if its maker and contribution can be verified.

**Decision:** Do not treat chess as a Muslim-origin invention. Encyclopaedia Iranica and TDV trace the game to Indian antecedents and its early passage through Persia into Muslim societies. Keep only the specific variant lead open: OCR of al-Mas'udi's *Muruj al-dhahab* calls the seven-by-eight *jawarihiyya* form newly devised in the author's time but does not name its maker; the OCR has not been checked against the scan. Neither al-Mas'udi's nor al-Suli's existing person record contains a faith basis. The candidate remains `[~]` pending a named maker, the specific contribution, and Sunni eligibility.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-013 — Exclude five unrelated concept signals (5 November 2026)

**Question:** Do the *kadhib*, *luzum*, *qadar*, *ri'aya* or Yawm Arafa concepts describe inventions or transmissions for this browser?

**Rule applied:** A census hit is only a lead. The queue excludes material that does not describe a created invention, improvement, production method, institution or transmission, with a source-backed reason for each exclusion.

**Decision:** Mark all five `[-]`. Their cited records describe, respectively, a legal and moral category, a legal term, a creed doctrine, a spiritual and ethical station, and a pilgrimage day with its rulings. None identifies a created technology or cultural form within the browser's scope. Keep their source records in the museum; the exclusion applies only to this invention queue.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-014 — Keep khalwa and Nasta'liq as unresolved cultural leads (5 November 2026)

**Question:** Can the historical development of Sufi khalwa or Nasta'liq script be attributed to an eligible Sunni Muslim maker?

**Rule applied:** A cultural practice or form can be considered, but inclusion still requires a specific, sourced contribution and a source-backed Sunni maker; a gradual or legendary attribution must remain explicit and contested.

**Decision:** Keep both at `[~]`. The khalwa source describes later retreat practices without naming an originator or dating a particular method. The Nasta'liq reference describes gradual development from naskh and ta'liq, alongside a legend naming Mir Ali Tabrizi; the existing Mir Ali record has no `faith` block. Do not select one attribution or create an invention record until the contribution and maker eligibility are supported.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-015 — Exclude seven unrelated museum census signals (5 November 2026)

**Question:** Do the two passage records and five work records identify inventions or transmissions within the browser's scope?

**Rule applied:** Museum census hits are leads only. Exclude a record-linked signal when its cited source identifies a different kind of work and no specific invention, improvement, production method or transmission.

**Decision:** Mark all seven `[-]`. Arba'un 5 is a religious-practice hadith record, Qur'an 2:108 is a canonical passage record, the two *Aqida* works are creed treatises, and the three lecture/television series concern historical narrative, religious biography or the speaker's scientific-miracle interpretations. Their existing sources establish these identities, not an invention claim. The exclusions apply only to this queue; no museum record is changed.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-016 — Exclude the generic chess-transmission lead (5 November 2026)

**Question:** Does the game's early passage into Muslim societies establish a qualifying Muslim transmission record?

**Rule applied:** A transmission is in scope only when a Muslim transmitter's specific act is itself the record; general diffusion of an inherited game is not a Muslim invention.

**Decision:** Mark `chess-transmission` `[-]`. TDV and Encyclopaedia Iranica trace chess from Indian antecedents through Persia into Muslim societies but do not identify a discrete Muslim transmitter's act or a specific adaptation in this lead. Keep the separately scoped *jawarihiyya* variant at `[~]` pending verification of its maker, contribution and Sunni basis.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-017 — Keep waqf as a historical-development lead (5 November 2026)

**Question:** Does the current waqf lead support a comparison with the English trust or a single invention attribution?

**Rule applied:** Do not imply institutional equivalence or a singular inventor without source-backed evidence; keep gradual institutional development distinct from a specific contribution.

**Decision:** Keep the candidate at `[~]` but remove the English-trust comparison from its label and flags. The TDV entry describes waqf as developing over time from individual endowments and does not identify a single inventor or establish the proposed comparison. Verify a specific early contribution and eligible maker before considering a record.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-018 — Keep barid as a possible Umayyad systematization (5 November 2026)

**Question:** Does Mu'awiya's organization of the barid qualify as an original invention or a specific Muslim improvement?

**Rule applied:** Distinguish an original invention from adaptation of earlier systems; require a source-backed contribution and maker eligibility before promotion.

**Decision:** Keep the candidate at `[~]` as a possible systematization/improvement, not an original invention. TDV attributes the first systematic Umayyad postal organization and the added intelligence function to Mu'awiya, while Iranica traces courier networks to Achaemenid and Sasanian antecedents and notes Byzantine influence. The exact institutional change and the source-backed Sunni eligibility basis still need verification. The Cambridge repository's thesis file is padlocked and was not used.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-019 — Narrow the minaret lead to the Fustat mosque episode (5 November 2026)

**Question:** Does the early minaret lead establish that Maslama ibn Mukhallad invented the minaret as an architectural form?

**Rule applied:** Distinguish an original form from adaptation of earlier structures and distinguish a patron or organizer from the maker. A queue lead also needs a source-backed Sunni basis for its named maker before promotion.

**Decision:** Narrow the lead to the minarets attributed to Maslama's expansion of the Mosque of Amr at Fustat, and link the existing Maslama and mosque records. TDV reports minarets added to the mosque in 53/673; the museum's cited *Futūḥ Miṣr* and Yeomans account describe the expansion and corner towers, with Yeomans reporting Creswell's proposed Roman-tower model. These sources identify an organizer/patron, not the builders, and the Maslama person record has no `faith` block. Keep `[~]`; do not call this the invention of the minaret unless the earlier architectural forms, specific contribution and maker eligibility are established.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-020 — Keep the fountain-pen attribution unresolved (5 November 2026)

**Question:** Does the fountain-pen lead attributed to al-Mu'izz identify a qualifying Muslim maker?

**Rule applied:** Commissioning a device does not establish who made it. A lead remains open until the contribution and the maker's source-backed Muslim and Sunni eligibility are established; inaccessible source text is not treated as evidence.

**Decision:** Keep the candidate at `[~]` and add C. E. Bosworth's 1981 Oxford Academic DOI as a bibliographic lead. The publisher page returned HTTP 403, so the article was not read and its reported account was not used as evidence. Britannica identifies al-Mu'izz as a Fatimid caliph and the Fatimids as Ismaili; if he is asserted as the maker, that would not meet this browser's Sunni inclusion rule. The actual maker and the specific device claim remain unverified.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-021 — Narrow the tiraz lead to the inscription shift (5 November 2026)

**Question:** Does the tiraz lead establish a Muslim invention of textile production?

**Rule applied:** Separate an inherited craft from a specifically evidenced adaptation, and distinguish the ruler who orders a policy from the craftsperson who makes an object. The named maker still needs a source-backed Sunni basis.

**Decision:** Narrow the lead to the reported Umayyad shift from Greek to Arabic inscriptions on tiraz and link the existing Abd al-Malik ibn Marwan person record. TDV describes earlier Persian and Byzantine textile precedents and associates the inscription change with Abd al-Malik, but this does not establish a new textile-making technique or identify the makers. His person record has no `faith` block. Keep `[~]` pending evidence for the specific adaptation, its maker and eligibility.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-022 — Keep the Greek-fire adaptation lead unresolved (5 November 2026)

**Question:** Does the current lead identify a specific Muslim adaptation of Byzantine Greek fire, with an eligible maker?

**Rule applied:** A general claim of transmission or use is insufficient without a defined Muslim act or improvement, a named maker and a source-backed Sunni basis. Do not use inaccessible or unauthorized source copies as evidence.

**Decision:** Keep the candidate at `[~]` and add John Haldon's 2006 Cambridge chapter as a bibliographic lead. Cambridge's contents record verifies the chapter citation, but its full text was not accessed; the available Internet Archive scan is an unofficial community upload whose authorization could not be established, so it and its OCR were not used. No specific adaptation, maker or date has been established in this screen.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-023 — Keep the three early bimaristan claims separate (5 November 2026)

**Question:** Do Rufayda's medical tent, al-Walid's Damascus facility and Harun al-Rashid's Baghdad bimaristan establish a single early hospital invention?

**Rule applied:** Do not merge distinct claims or dates into a “first hospital” narrative. Each candidate must identify the specific medical or institutional contribution, distinguish patron from practitioner, represent earlier models and contributors, and establish maker eligibility from sources.

**Decision:** Keep the three leads separate and at `[~]`, linked to the existing Rufayda, al-Walid and Harun al-Rashid person records. TDV's bimaristan entry describes three different cases: a tent for wounded people, a Damascus facility for lepers and blind people, and a Baghdad hospital modeled on Jundishapur. The dates and institution types are not interchangeable, and no screen here establishes a discrete invention or decisive improvement by an eligible named maker.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-024 — Keep early timekeeping leads specific and unresolved (5 November 2026)

**Question:** Do the mosque gnomon/sundial and Umayyad/Fatimid court-clock leads establish an original Muslim timekeeping invention?

**Rule applied:** Distinguish an inherited instrument or its use from a documented Muslim improvement, and identify the specific instrument, maker and date before promotion.

**Decision:** Keep both candidates at `[~]`. TDV's “SAAT” and “GÜNEŞ SAATİ” articles discuss earlier Egyptian, Babylonian and Greek timekeeping traditions alongside later Islamic use and particular refinements, but the screened passages do not identify a maker for the proposed early mosque installation or establish an original invention. Require a defined Muslim contribution; split the clock lead by period and instrument before assigning any attribution.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-025 — Keep hisba open only for a specific institutional change (5 November 2026)

**Question:** Does the hisba and market-inspector lead identify a Muslim invention?

**Rule applied:** An institution or office can qualify only through a documented creation, adaptation or improvement with an attributable, eligible maker; naming a role alone is insufficient.

**Decision:** Keep the candidate at `[~]`. The registered TDV hisba entry supplies institutional and legal context but does not establish a single inventor or a specific early change by a named maker. Do not equate the existence of market oversight with invention of the institution.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-026 — Keep the al-Razi clinical distinction as a lead (5 November 2026)

**Question:** Does the current evidence establish that al-Razi first distinguished smallpox from measles as an eligible Sunni Muslim maker?

**Rule applied:** A popular-source claim is a lead only; establish priority from medical sources and the named maker's Muslim/Sunni basis from the person record or reliable biography before promotion.

**Decision:** Keep the candidate at `[~]` and link `person/al-razi-abu-bakr`. The existing person record repeats the priority claim from the popular *Al-Mubdi'un* program, but has no `faith` block; the primary *Kitab al-Judari wa-l-Hasba* and comparative medical history were not read in this screen. Do not treat the claim as established or infer the maker's faith.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-027 — Keep al-Zahrawi's surgical leads unverified (5 November 2026)

**Question:** Do the catgut-suture and surgical-instrument leads establish a specific invention by an eligible Sunni maker?

**Rule applied:** Verify the primary passage and earlier use before assigning novelty; the named maker must have a source-backed Muslim/Sunni basis. A census or popular claim does not replace those checks.

**Decision:** Keep the two candidates at `[~]` with separate verification flags. No existing Abu al-Qasim al-Zahrawi person record was found in the repository, and this screen did not read *al-Tasrif* or a scholarly medical-history source. Do not promote the general claims about catgut or the treatise's instrument illustrations to invention records until the specific contribution, comparison and maker eligibility are supported.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-028 — Retain Ammar's hollow needle as a primary-source lead (5 November 2026)

**Question:** Does the primary text establish the hollow cataract needle as an eligible Sunni Muslim invention?

**Rule applied:** A maker's first-person priority claim is evidence of attribution, not independent proof of priority. Verify the text against the page image, compare earlier surgery, and establish the maker's source-backed Muslim/Sunni basis before promotion.

**Decision:** Keep the candidate at `[~]` and add Max Meyerhof's 1937 Wellcome Library edition as a primary-source lead. Visual inspection of the Spanish translation at printed pp. 19–21 confirms that Ammar attributes to himself the devising and use of a hollow cataract needle, claims no one had operated with it before him, and describes its hollow channel and triangular openings; a manuscript note gives Tiberias/Baghdad variants. An accessible third-party extract of the EI3 entry reports that later sources repeat Ammar's claim without independent evidence and that medieval accounts dispute whether this operation could be performed; official access to that entry was not verified, so it remains a research lead only. The Arabic facsimile has not been compared with the translation, and neither independent priority nor the maker's faith/tradition is established. Do not write an invention record yet.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum data or prose change.

## D-029 — Refine the barid improvement question (5 November 2026)

**Question:** Does the source evidence establish a specific change to the barid system, and is Mu'awiya's maker eligibility ready for promotion?

**Rule applied:** Record an evidenced adaptation or improvement with its precursor; do not promote a candidate unless the maker's Muslim/Sunni basis is cited in the person's `faith` block.

**Decision:** The full TDV “Berîd” entry establishes the attributed change within early Islamic postal practice: earlier caliphs used official couriers, while Mu'awiya established the first systematic Umayyad postal organization and added an intelligence function; Abd al-Malik later developed it further. Iranica documents Achaemenid and Sasanian courier networks and Byzantine influence, but the screened sources do not compare those earlier systems' intelligence functions. Replace the broad queue flag with `compare-intelligence-function-with-earlier-postal-systems`; keep the candidate at `[~]` pending that comparison and the source-backed maker basis. The existing Mu'awiya `faith` entry has no source list, and its related `source/ibn-hajar-isaba` record is draft with edition details unconfirmed. Do not infer eligibility from his Companion role.

**Touches:** `docs/inventions/queue.yaml`, `docs/inventions/research.md` and this decision log; no museum data or prose change.

## D-030 — Exclude six non-invention census signals (5 November 2026)

**Question:** Do the linked early-chronology museum records identify an invention lead?

**Rule applied:** A person, event, or religious narrative is not an invention signal without a specific created invention, improvement, production method, or transmission. Record exclusions with sources and leave the underlying museum records untouched.

**Decision:** Exclude the queue signals for Amr ibn al-As, al-Zubayr ibn al-Awwam, the first pledge of al-Aqaba, the re-excavation of Zamzam, the prostration at surat al-Najm, and Aisha. Their linked records document political/military roles, a pledge and teaching mission, a pre-Islamic excavation of an existing well, a religious narrative, and scholarship/transmission, respectively; none establishes a specific qualifying invention. The excluded entries retain their linked museum records and source citations.

**Touches:** `docs/inventions/queue.yaml`, `docs/inventions/research.md` and this decision log; no museum data or prose change.

## D-031 — Exclude generic kohl and miswak practices (5 November 2026)

**Question:** Do the broad kohl-cosmetic and miswak leads identify inventions made by eligible Sunni Muslim makers?

**Rule applied:** An inherited practice is not attributed as a Muslim invention without evidence of a specific Muslim-created contribution and a named, eligible maker. Exclusions must be supported by defined sources.

**Decision:** Exclude the generic kohl and miswak candidates. The open-access Riesmeier et al. article states that kohl has been used since at least 5000 BCE and analyzes ancient Egyptian containers; the King Saud University page for al-Sadhan's review reports chewing-stick use in Babylonia about 7,000 years ago and later among Greek, Roman and Egyptian societies. Neither source identifies a specific Muslim invention or maker. If a distinct, source-backed Muslim refinement is found later, it must be queued as a separate candidate. At the time of D-031, keep the turban candidate at `[~]` pending its separate screen; D-032 records the subsequent source-based decision.

**Touches:** two new source records in `data/source/`, two exclusions in `docs/inventions/queue.yaml`, and `docs/inventions/research.md`; no existing museum person or practice record changed.

## D-032 — Exclude the generic turban lead (5 November 2026)

**Question:** Does the broad turban lead identify a Sunni Muslim invention?

**Rule applied:** A garment with pre-Islamic antecedents is not attributed as a Muslim invention without evidence of a specific Muslim-created form, production method or other improvement and a named eligible maker.

**Decision:** Exclude the generic turban candidate. The TDV İslâm Ansiklopedisi “SARIK” entry traces wrapped headwear to ancient times, cites Babylonian and Persian use, and says the turban was known among Arabs before Islam. This closes only the broad garment lead; any independently sourced Muslim refinement or distinctive form must be queued separately.

**Touches:** `data/source/tdv-sarik.yaml`, `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no existing museum clothing or person record changed.

## D-033 — Keep Rufayda's tent as an unresolved institutional lead (5 November 2026)

**Question:** Does the account of Rufayda al-Aslamiyya's tent establish an invention or medical institution attributable to her?

**Rule applied:** A hospital or medical practice may qualify, but the source chain, specific contribution and meaning of “first” must be clear before writing an invention record. Attribute historical claims to their sources and distinguish temporary care tents from permanent hospitals.

**Decision:** Keep the candidate at `[~]`. The TDV “BÎMÂRİSTAN” entry explicitly calls Rufayda's tent during the Battle of the Trench the first Islamic bimaristan and a mobile war hospital, citing Ibn Hisham (II, p. 239) and Ahmad Isa (p. 9). The same entry later reports al-Maqrizi's claim that al-Walid established the first Islamic hospital in 88/707. Rufayda's existing person record contains a Sunni faith field with `basis: tradition`; the unresolved question is the tent's institutional novelty and how the different “first” claims are defined. The TDV-cited Ibn Hisham passage was not independently verified. The available OCR for a different Wüstenfeld edition covers juz' 4 (7–11 AH), not the Battle of the Trench, and cannot verify this citation. Do not promote or exclude the candidate on the current evidence.

**Touches:** `data/source/tdv-bimaristan.yaml`, `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum person record changed.

## D-034 — Exclude Ibn Taymiyya's generic person-census signal (5 November 2026)

**Question:** Does the generic census hit for Ibn Taymiyya identify a specific invention lead?

**Rule applied:** A person-record match is only a discovery signal; exclude it when the linked record and its cited sources identify no specific invention, improvement, production method or transmission in scope.

**Decision:** Exclude this queue signal only. The linked record presents Ibn Taymiyya as a Hanbali jurist and theologian and documents his creed work and historical roles; this candidate names no technical or cultural contribution. The record remains unchanged, and the exclusion makes no claim about the full extent of his scholarship.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum person or work record changed.

## D-035 — Exclude Kamal Khujandi's timekeeping census signal (5 November 2026)

**Question:** Does the generic timekeeping census hit for Kamal Khujandi identify a relevant invention contribution?

**Rule applied:** A person-record match is only a discovery signal; exclude it when the linked record and its cited sources identify no specific invention, improvement, production method or transmission in scope.

**Decision:** Exclude this queue signal only. Paul E. Losensky's Encyclopaedia Iranica entry describes Khujandi as a Persian poet and Sufi shaikh, and discusses his khanqah, disciples and divan; it identifies no timekeeping or other specific invention contribution. The exclusion does not treat Sufism as disqualifying and does not alter Khujandi's person record.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum person or work record changed.

## D-036 — Exclude Ulubatlı Hasan's generic person-census signal (5 November 2026)

**Question:** Does the generic timekeeping census hit for Ulubatlı Hasan identify a specific invention contribution?

**Rule applied:** A person-record match is only a discovery signal; exclude it when the linked record and its cited sources identify no specific invention, improvement, production method or transmission in scope.

**Decision:** Exclude this queue signal only. The linked biography concerns Hasan's contested historicity and his reported role as Sultan Mehmed II's standard-bearer during the conquest of Constantinople; it identifies no timekeeping or other invention contribution. The queue exclusion does not resolve the historical debate or alter the person record.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum person record changed.

## D-037 — Exclude the Alpujarras Rebellion event-census signal (5 November 2026)

**Question:** Does the generic timekeeping event-census hit for the Alpujarras Rebellion identify a specific invention?

**Rule applied:** An event-record match is only a discovery signal; exclude it when the linked event and cited account identify no particular invention, technical change, production method or transmission.

**Decision:** Exclude this queue signal only. The linked event account describes a political and military revolt and its planning, but names no particular technical or cultural invention, improvement, or transmission. This does not claim that the revolt had no military innovation; it closes only this generic event hit, which made no such claim.

**Touches:** `docs/inventions/queue.yaml` and `docs/inventions/research.md`; no museum event record changed.

## D-038 — Launch the browser with one invention (5 November 2026)

**Question:** Should the browser wait for a full first batch, or ship as soon as one record meets every gate?

**Rule applied:** The founder asked to ship to production as soon as possible; a record is published once it cites defined sources (`docs/agents/publication-standard.md`), and the browser shows an "in the making" badge and build-time counts.

**Decision:** Ship the browser home, the invention page sections and the Explore entry with one record, `invention/pulmonary-circulation`, sourced from West 2008 (Journal of Applied Physiology) and the Wellcome WMS Or. 51 catalogue record. The external precursor and dependent labels may carry Urdu (`ur`) alongside the required Arabic and English. Later records follow the batch queue.

**Touches:** `data/invention/`, `content/{ar,en,ur}/invention/`, `site/src/pages/[lang]/inventions/`, `site/src/components/Invention*.astro`, `site/src/lib/inventions.ts`, `i18n/*.yaml`, `scripts/gen-schema.ts`, `scripts/check-site.ts`.

## D-039 — Publish Rufayda's tent as a contested "first hospital" (5 November 2026)

**Question:** Can Rufayda's tent be published although the sources disagree on what the first hospital in Islam was?

**Rule applied:** One cited source is enough for a fact (`docs/agents/publication-standard.md`); a contested attribution uses the `perspectives` block, Sunni first, then academic, with no verdict (AGENTS.md, voice and scope); a maker needs a sourced Sunni faith basis.

**Decision:** Publish `invention/rufayda-medical-tent` as kind `institution`, attribution status `contested`. The facts (her tent in the mosque, her care for the wounded, Sa'd ibn Mu'adh moved there at the Trench, the Prophet's visits) come from Ibn Hajar's *al-Isaba* pp. 566 and 1871–1872, verified on the page images, which also record al-Bukhari's sound chain. The perspectives are: Isaba (Sunni, main; describes the tent, makes no priority claim), al-Maqrizi via TDV (Sunni, secondary; first hospital is al-Walid's in 88/707) and TDV (academic; first bimaristan was the mobile war hospital in Rufayda's tent). Rufayda is the maker (keeper of the tent); her faith entry now cites *al-Isaba* entry 11222. The dependents (al-Walid, Harun, the Sawad mobile hospital) are listed as later institutions without a claimed direct line. Ibn Hisham is cited only as TDV's reference because the local OCR does not cover the passage.

**Touches:** `data/invention/rufayda-medical-tent.yaml`, `data/media/prophets-mosque-1908-mirat-al-haramayn.yaml`, `data/media/diagram-rufayda-tent.yaml`, `data/person/rufayda-al-aslamiyya.yaml`, `content/{ar,en,ur}/invention/rufayda-medical-tent.md`, `site/src/components/InventionDiagram.astro`, `i18n/*.yaml`, `docs/inventions/*`.

## D-040 — Record Maslama as the commissioner of the first minarets (5 November 2026)

**Question:** Who is the maker of the first minarets when the sources name the governor who ordered them but not the builders?

**Rule applied:** Record only what the cited sources say; the maker roles in `schema` include `commissioner` for the person who ordered or funded the work; every maker needs a sourced faith entry.

**Decision:** Publish `invention/minaret` (kind `structure`, status `original`, 53/673, al-Fustat) with Maslama ibn Mukhallad al-Ansari as `commissioner`. The facts come from *Futuh Misr* pp. 178–179, al-Maqrizi's *Khitat* scan pp. 1996–1997, *al-Isaba* p. 1413 (entry 8248), Yeomans p. 20 and TDV "MİNARE" ¶1–¶8. Bilal's ustuwana, the Damascus temenos towers and watch/signal/lighthouse towers are external precursors; the Umayyad Damascus, Qayrawan, Ibn Tulun and classical Ottoman minarets are external dependents, stated only as the sources state them. Maslama's person record gains a Sunni faith entry (tradition, *al-Isaba* 8248), an Urdu label and the invention tie. The invention diagram becomes a generic data-driven chain (up to four precursors and four dependents, maker names and Hijri year), used for every record whose `media.diagram` points at it.

**Touches:** `data/invention/minaret.yaml`, `data/source/tdv-minare.yaml`, `data/media/mosque-of-amr-minaret-2011.yaml`, `data/media/diagram-minaret.yaml`, `data/person/maslama-ibn-mukhallad-al-ansari.yaml`, `content/{ar,en,ur}/invention/minaret.md`, `site/src/components/InventionDiagram.astro`, `i18n/*.yaml`, `docs/inventions/*`.

## D-041 — Record the barid as an improvement commissioned by Mu'awiya (5 November 2026)

**Question:** How should a system that existed under the Persians and Byzantines, and whose first Islamic organiser is reported in two ways, be recorded?

**Rule applied:** Record only what the cited sources say; `attribution.status: improvement` covers an earlier system adapted and organised anew; every maker needs a sourced faith entry; a range of years cannot be written as a Hijri string.

**Decision:** Publish `invention/barid` (kind `system`, domain `institutions-systems`, Damascus, status `improvement`, status_today `transformed`) with Mu'awiya ibn Abi Sufyan as `commissioner`, since al-Qalqashandi says Persian dihqans and Byzantine officials built it for him. The facts come from *Subh al-A'sha* vol. 14 pp. 367–370, al-Suyuti's *Tarikh al-Khulafa* p. 332 and TDV "BERÎD" pp. 498–501. The second report crediting Abd al-Malik is stated in the basis and prose with al-Askari's reconciliation (Mu'awiya set it up, Abd al-Malik perfected it), with no verdict; Abd al-Malik stays a dependent, not a maker. `first_attested` is the EDTF range of Mu'awiya's caliphate (661/680, derived) with no Hijri string, following the reign-range convention of existing event records, so the diagram shows no year. Mu'awiya's Sunni faith entry gains `source/ibn-hajar-isaba` (entry 8366, p. 1431) and the invention tie. The image is a CC BY-SA 4.0 Commons map of Yemeni barid stations after Ibn Khurradadhbih, labelled as the Abbasid-era network.

**Touches:** `data/invention/barid.yaml`, `data/media/barid-stations-yemen-map.yaml`, `data/media/diagram-barid.yaml`, `data/person/muawiya-ibn-abi-sufyan.yaml`, `content/{ar,en,ur}/invention/barid.md`, `docs/inventions/*`.

## D-042 — Record al-Walid's bimaristan as a contested first, with no city (6 November 2026)

**Question:** How should al-Maqrizi's statement that al-Walid ibn Abd al-Malik was "the first to build a maristan in Islam" be recorded, when Rufayda's tent is already published as a candidate first and the modern sources place the house in Damascus without a primary citation?

**Rule applied:** Record only what the cited sources say; a contested "first" is set out with labelled perspectives and no verdict; a draft source cannot carry a fact; every maker needs a sourced faith entry.

**Decision:** Publish `invention/walid-bimaristan` (kind `institution`, domain `medicine-surgery`, polity the Umayyad caliphate, 88 AH = 706/707 derived, status `contested`) with al-Walid as `commissioner`. The claim and its details (physicians on paid allowances, lepers confined and given allowances, a guide for each blind person) come from al-Maqrizi's *Khitat* scan p. 2336, with the pre-Islamic reports he gives first (a legendary Coptic king, Hippocrates' «أصدولين») recorded as precursors, and Ibn Tulun's maristan (scan p. 2337) as a dependent. Ibn Kathir's *al-Bidaya* vol. 5 p. 176 (`source/bidaya-ilmiyya-v5`, new) and al-Suyuti's *Tarikh al-Khulafa* pp. 366–367 give al-Walid's building programme and the contrary judgements of him, attributed and without verdict. No city is given: neither al-Maqrizi nor the TDV passage read names one for the house, and `source/salabi-umayyad-state-2020` was not used because it is a draft whose read pages do not include the passage. Rufayda's tent now lists this record as its first dependent. The image is Nur al-Din's later Damascus bimaristan (CC BY 2.0, Commons), labelled as such. Main also had a YAML parse error since #4126 (an unquoted `: ` in Mu'awiya's provenance run); it is fixed here, and the same pattern in al-Walid's record.

**Touches:** `data/invention/walid-bimaristan.yaml`, `data/invention/rufayda-medical-tent.yaml`, `data/media/nur-al-din-bimaristan-entrance.yaml`, `data/media/diagram-walid-bimaristan.yaml`, `data/source/bidaya-ilmiyya-v5.yaml`, `data/person/al-walid-ibn-abd-al-malik.yaml`, `data/person/muawiya-ibn-abi-sufyan.yaml`, `content/{ar,en,ur}/invention/walid-bimaristan.md`, `docs/inventions/*`.

## D-043 — Record the Islamic tiraz as an improvement commissioned by Abd al-Malik (6 November 2026)

**Question:** The tiraz band on royal cloth is older than Islam, and the primary report about Abd al-Malik ibn Marwan concerns writing at the head of papyrus rolls, not cloth. How should the record frame the invention, its maker and its date?

**Rule applied:** Record only what the cited sources say; keep a cautious "among the first" as cautious; every maker needs a sourced faith entry; a year range with no Hijri statement in the sources is recorded as derived.

**Decision:** Publish `invention/tiraz` (kind `institution`, domain `materials-industry`, period Umayyad, era `0685/0695` derived, attribution `improvement`, status today `transformed`) with Abd al-Malik as `commissioner`. Al-Baladhuri's *Futuh al-Buldan* pp. 335–336 («في أمر القراطيس») gives the papyrus account: he was «من أول من أحدث» the writing at the head of the rolls, from Surat al-Ikhlas and other remembrance of God; the Byzantine threat; and Khalid ibn Yazid's advice to ban Byzantine dinars, strike coinage and stop papyrus going to the Byzantines. Al-Suyuti's *Tarikh al-Khulafa* pp. 358–359 adds al-Askari's *al-Awa'il* and the dinars of 75 AH. The move to cloth (Abd al-Malik's letter to Abd al-Aziz ibn Marwan in Egypt) and the later history come from the TDV entry "TIRÂZ" (`source/tdv-tiraz`, vol. 41 pp. 112–114). Ibn Khaldun's *Muqaddima* p. 256 gives the definition, the Persian precursor, the dar al-tiraz and the later dynasties; he names no first maker. The prose says plainly which source speaks of papyrus and which of cloth. Abd al-Malik's faith entry (Sunni, basis tradition) rests on al-Suyuti p. 356 (Ibn Sa'd: «عابداً ناسكاً بالمدينة»; Abu al-Zinad counts him among the jurists of Medina). The hero image is the Met's CC0 tiraz fragment 31.19.2 (about 892–902), linked remotely; the ruler named in its inscription is not stated, because the museum page could not be read.

**Touches:** `data/invention/tiraz.yaml`, `data/source/tdv-tiraz.yaml`, `data/media/met-tiraz-fragment-448561.yaml`, `data/media/diagram-tiraz.yaml`, `data/person/abd-al-malik-ibn-marwan.yaml`, `content/{ar,en,ur}/invention/tiraz.md`, `docs/inventions/*`.

## D-044 — Record algebra as al-Khwarizmi's improvement: the first ordered science of equations (6 November 2026)

**Question:** Equations were solved in Egypt, Babylon, Greece and India long before al-Khwarizmi, and modern historians doubt that his book was the first on al-jabr. What can the record say he made, and how is the priority question shown?

**Rule applied:** Record only what the cited sources say; a priority claim with dissent goes in `perspectives`, Sunni first, then academic; every maker needs a sourced faith entry; a reign range with no stated year is recorded as derived.

**Decision:** Publish `invention/algebra` (kind `method`, domain `mathematics`, era `0813/0833` derived from al-Ma'mun's reign, attribution `improvement`, status today `transformed`) with al-Khwarizmi as `inventor`. The record's claim is the gathering of equation-solving into an independent science (three kinds of term, six types, a rule and a geometric proof for each), not the solving of equations as such. The book itself is read in the Cairo 1939 edition (`source/khwarizmi-jabr-cairo-1939`, scan pages, OCR read against the scan): preface and purpose pp. 29–30, the six types pp. 31–32, the worked example "a square and ten roots equal thirty-nine" pp. 32–33, the proofs pp. 35–43, the "impossible" case p. 35, the closing rule p. 43, the jabr step in worked problems pp. 51–53, the Book of Bequests from p. 83; the editors' introduction pp. 13–26 gives the precursors, the Fihrist commentators, Abu Kamil, al-Khayyam, the Bodleian copy of 743 AH, Rosen 1831, Robert of Chester and the words algebra, algorithm, algorismus and guarismo. Ibn Khaldun's *Muqaddima* pp. 495–496 is the Sunni perspective: the first to write in the art was al-Khwarizmi, then Abu Kamil, with the Andalusian commentaries. The TDV entry "CEBİR" by İhsan Fazlıoğlu (registered as `source/tdv-cebir`, vol. 7 pp. 195–201) is the academic perspective: broad agreement on his priority, Abu Barza's claim for Ibn Turk and Abu Kamil's rebuttal, and the modern doubts. Al-Khwarizmi's faith entry (Sunni, basis self-identified) rests on his preface (scan pp. 29–30); no source read names his school, so the value follows the museum's Sunni frame. The hero image is a public-domain Bodleian scan of MS. Huntington 214 from Wikimedia Commons, linked remotely; the text does not claim it is the same copy the Cairo edition used.

**Touches:** `data/invention/algebra.yaml`, `data/source/tdv-cebir.yaml`, `data/media/bodleian-huntington-214-algebra.yaml`, `data/media/diagram-algebra.yaml`, `data/person/al-khwarizmi.yaml`, `content/{ar,en,ur}/invention/algebra.md`, `docs/inventions/*`.

## D-045 — Record the Tabula Rogeriana as al-Idrisi's improvement, commissioned by Roger II (7 November 2026)

**Question:** World maps and the seven climes are older than al-Idrisi, and his preface gives Roger II, a Christian king, the leading part in the inquiry. What can the record say was made, by whom, and where?

**Rule applied:** Record only what the cited sources say; every maker needs a sourced faith entry; a Hijri month with a stated Julian month is recorded as derived; a fact no source states (here the silver disc's fate) is not written.

**Decision:** Publish `invention/tabula-rogeriana` (kind `system`, domain `navigation-geography`, first attested `1154-01` / `0548-10` derived, attribution `improvement`, status today `replaced`, origin `place/palermo` with no polity because the museum has no Norman Sicily polity record) with al-Idrisi as `inventor` and Roger II as `commissioner`. The record's claim is the method and plan (fifteen years of comparing books and travellers' reports, distances tested on a drawing board with iron measures, a silver disc of 400 Roman ratl, and seventy sectional maps each followed by its description), not the world map or the climes as such. The preface is read in the Cairo 2002 edition (`source/nuzhat-al-mushtaq-2002`, scan page equal to printed page): basmala p. 3, Roger's titles p. 4, the inquiry and the books pp. 5–6, the disc p. 6, the naming in Shawwal 548 p. 7, the climes p. 9, the seventy maps p. 13. The TDV entry "İDRÎSÎ, Şerîf" by Ramazan Şeşen (registered as `source/tdv-idrisi-serif`, vol. 21 pp. 493–495) gives the life, the Ptolemaic school, the abridgements, *Uns al-muhaj*, the Rome 1592, Paris 1619, Leiden 1970–84 and Miller editions, and the Köprülü 955 manuscript. Al-Idrisi's faith entry (Sunni, basis self-identified) rests on his basmala and blessing on the Prophet (p. 3), with no school named; Roger's (Christian, documented) rests on al-Idrisi's own title for him (p. 4). The hero image is Konrad Miller's public-domain assembled copy from Wikimedia Commons, linked remotely; the round world map found in some manuscripts is a later addition and is not used.

**Touches:** `data/invention/tabula-rogeriana.yaml`, `data/source/tdv-idrisi-serif.yaml`, `data/media/miller-tabula-rogeriana.yaml`, `data/media/diagram-tabula-rogeriana.yaml`, `data/person/al-idrisi-muhammad-ibn-abd-allah.yaml`, `data/person/roger-of-sicily.yaml`, `content/{ar,en,ur}/invention/tabula-rogeriana.md`, `docs/inventions/*`.

## D-046 — Record the camera obscura as Ibn al-Haytham's improvement, a method of proof (8 November 2026)

**Question:** Light passing through a small hole into a dark room is an everyday sight that Ibn al-Haytham himself calls familiar, and popular accounts call him the inventor of the camera. What can the record claim?

**Decision:** Publish `invention/camera-obscura` as kind `method` (optics-physics, abbasid-golden, attribution `improvement`, status today `transformed`, origin `place/cairo`) with Ibn al-Haytham as `improver`. The claim is the systematic, repeatable test in *Kitab al-Manazir*, Book 1: the dark room with dust or smoke, the intercepting body and the ruler for the light of the sun, moon, stars and fire (ch. 3, scan pp. 73–75), the cone of light through fine holes during an eclipse (scan pp. 77–78), and the candles before one aperture showing that lights travel straight and do not mix (ch. 6, scan pp. 171–172). The text is read in Sabra's Kuwait 1983 edition (`source/manazir-sabra-1983`), where the printed page equals the scan page minus one; the source record's reliability note now says so. The first-attested date (1037/1038, Hijri 429, derived) rests on the third list of his works in Ibn Abi Usaybi'a, which runs to the end of 429 AH and includes the *Manazir* (scan p. 27); no composition date is claimed. The Latin translation lacks the first three chapters of Book 1 (scan pp. 49–50), so the prose says the dark-room chapter did not reach Latin readers while the candles experiment did. The TDV entry "İBNÜ'l-HEYSEM" by Hüseyin Gazi Topdemir (vol. 21, 2000, pp. 82–87) is registered as `source/tdv-ibnul-heysem`. Ibn al-Haytham's faith entry (Sunni, self-identified) rests on the basmala opening his book (scan p. 60) and on his treatises against Ibn al-Rawandi, against Abu Bakr al-Razi on prophethood and against the Mu'tazila listed by TDV. The 1572 *Opticae thesaurus* title page was rejected as hero image because it shows a nude figure; the hero is the Commons page "Tanqih al-Manazir.JPG" (CC BY-SA 3.0, Danieliness), linked remotely. Rashed's "two Ibn al-Haythams" thesis and Sabra's 1998 rejection are reported without a verdict.

**Touches:** `data/invention/camera-obscura.yaml`, `data/source/tdv-ibnul-heysem.yaml`, `data/source/manazir-sabra-1983.yaml`, `data/media/tanqih-al-manazir-page.yaml`, `data/media/diagram-camera-obscura.yaml`, `data/person/ibn-al-haytham.yaml`, `content/{ar,en,ur}/invention/camera-obscura.md`, `docs/inventions/*`.

## D-047 — Record algorism as al-Khwarizmi's transmission of Indian reckoning (8 November 2026)

**Question:** Popular accounts credit al-Khwarizmi with "inventing the algorithm" or even the numerals. What can the record claim?

**Decision:** Publish `invention/algorism` as kind `method` (mathematics, abbasid-golden, attribution `transmission`, status today `living`, origin `place/baghdad`) with al-Khwarizmi as `transmitter`. The numerals and the decimal place-value system are Indian; Indian reckoning had already reached Baghdad with Brahmagupta's *Siddhanta* c. 154/770–71. The claim is his book *Kitab al-Hisab al-Hindi*, through which, per the TDV entry "HÂRİZMÎ, Muhammed b. Mûsâ" by İhsan Fazlıoğlu (vol. 16, 1997, pp. 224–227, registered as `source/tdv-harizmi`), the numerals and decimal system entered the Islamic world, and whose 12th-century Latin translation (Cambridge; Boncompagni 1857, Vogel 1963, Allard 1992) carried them, with zero, to the West (Cairo 1939 edition of *al-Jabr*, scan p. 25). The dependents — *Carmen de Algorismo*, *Algorismus vulgaris*, Latin *Algorismus* and Spanish *guarismo*, and the word *algorithm* — are cited to scan pp. 25–26. The first-attested range 813/847 is derived from al-Ma'mun's accession and the last datable mention (al-Wathiq's sickbed, 232 AH); no composition date is claimed. The decimal structure of number words is quoted from his own *al-Jabr* preface (scan p. 30), and Ibn Khaldun (*Muqaddima* pp. 494–495) supplies the definition of arithmetic and its daily use. His faith entry (Sunni) rests on the preface (scan pp. 29–30) and on Toomer's inference reported by TDV, which also rejects the "al-Majusi al-Qutrabbulli" reading. The hero image is the public-domain Commons scan "Dixit algorizmi.png" (Cambridge UL Ii.6.5), linked remotely.

**Touches:** `data/invention/algorism.yaml`, `data/source/tdv-harizmi.yaml`, `data/media/dixit-algorizmi-cambridge.yaml`, `data/media/diagram-algorism.yaml`, `data/person/al-khwarizmi.yaml`, `content/{ar,en,ur}/invention/algorism.md`, `docs/inventions/*`.

## D-048 — Record the hisba as a Medinan institution commissioned by Umar (5 November 2026)

**Question:** The hisba is an office, not a device, and the sources place the first market officers in the Prophet's time; orientalists derived it from the Greek agoranomos or the Byzantine prefect. Who is the maker, and what is claimed?

**Decision:** Publish `invention/hisba` as kind `institution` (institutions-systems, first-century, attribution `contested`, status today `transformed`, origin `place/medina`, polity `polity/rashidun-caliphate`) with Umar ibn al-Khattab as `commissioner`: TDV "HİSBE" names the officers he appointed over the Medina market (al-Sa'ib ibn Yazid, Abd Allah ibn Utba, Sulayman ibn Abi Hathma, and reportedly al-Shifa' bint Abd Allah). The Prophet's inspection of the market and his appointments are told in the prose only; he is not recorded as a maker. `first_attested` is Umar's caliphate, 634/644, status `tradition`, derived, because no source read dates an appointment. Perspectives: the Sunni hisba manuals (Ibn Taymiyya pp. 11, 16–17; Ibn al-Ukhuwwa p. 53; Ibn Khaldun p. 221) and TDV as main; the orientalist Greek/Byzantine derivation, reported by TDV, as `other`, without a verdict. The agoranomos/prefect is recorded only as a claimed precursor. Umar's faith entry gains sources (Ibn Taymiyya p. 17 calls him amir al-mu'minin; TDV). The hero image is the Walters Art Museum's stamped Umayyad glass pound weight of 743 (public domain, remote Commons URL), captioned as an example of sealed weights without claiming a muhtasib issued it.

**Touches:** `data/invention/hisba.yaml`, `data/media/walters-476-glass-weight.yaml`, `data/media/diagram-hisba.yaml`, `data/person/umar-ibn-al-khattab.yaml`, `content/{ar,en,ur}/invention/hisba.md`, `docs/inventions/*`, `CANARY.md`.

## D-049 — Record the waqf as an original institution first founded by Umar (5 November 2026)

**Question:** D-017 kept the waqf as a lead, together with a comparison to the English trust. Who is the maker, what is claimed, and does the trust comparison stand?

**Decision:** Publish `invention/waqf` as kind `institution` (institutions-systems, prophetic-era, first-century, attribution `original` with no perspectives, status today `living`, origin `place/medina`, no polity) with Umar ibn al-Khattab as `commissioner`, the first known founder of a waqf with his own property. The formula itself, "hold back the capital and give the yield in charity", comes in the Prophet's words to Umar in al-Bukhari (al-Bugha scan p. 1207, hadith 2737; p. 1222, hadith 2764); the Prophet is not recorded as a maker. Institutional history (Diwan al-Ahbas, the 307/919 deed, endowed madrasas, imarets, the 1548 cash waqf, the Evkaf ministry of 1826) is taken from TDV "VAKIF" (Günay §fiqh, Yediyıldız §history). The English-trust comparison is dropped: no source read supports it. The Hürrem Sultan endowment charter (TIEM 2192, 964/1556–57) is the hero image; the source read does not identify which of her endowments it records, and the article says so.

**Touches:** `data/invention/waqf.yaml`, `data/source/tdv-vakif.yaml`, `data/media/hurrem-sultan-waqfiyya-tiem-2192.yaml`, `data/media/diagram-waqf.yaml`, `data/person/umar-ibn-al-khattab.yaml`, `content/{ar,en,ur}/invention/waqf.md`, `docs/inventions/*`, `CANARY.md`.

## D-050 — Record Harun's Baghdad bimaristan as institutional transmission (5 November 2026)

**Question:** Is the Baghdad hospital a new invention, an improvement on Jundishapur or the transfer of an earlier model? How are its Muslim patron and Christian physicians credited?

**Decision:** Publish `invention/harun-bimaristan`, kind `institution`, attribution `transmission`, with Harun al-Rashid as `commissioner`. TDV explicitly calls it a hospital on the Jundishapur model and names Jibril ibn Bukhtishu in its establishment, Abu Yuhanna Masawayh as director and his son as successor. The interval `0786/0809` bounds the foundation within Harun's reign; no opening year or Hijri year is invented. Later Baghdad hospitals are institutional successors, not proof of this building's plan, admission policy, finances or services. The Barmakids' Indian-medicine hospital is a separate foundation in the narrative. The existing CC BY photograph of Nur al-Din's hospital is reused, explicitly identified in all three articles as Damascus centuries later, not Harun's building; the diagram is a relationship chain, not a reconstruction.

**Identity:** Harun's sourced Muslim identity rests on al-Suyuti's biography, pp. 456–457, with p. 457 checked on the scan; Sunni follows the museum's explicit default-frame rule. TDV's `BUHTÎŞÛ‘` introduction identifies the family as Nestorian Christian. Correct Jibril's unsourced `[sunni]` tag to `traditions: []` with sourced `faith: christian`; preserve the other biography and its existing date rather than settling unrelated discrepancies. He remains named and credited in the article, not included as a Sunni Muslim maker.

**Scope and risk:** `non-impacting`, content within the founder-approved inventions lane. No schema, code, UI, Worker, workflow or submission-document changes. Ibn Abi Usaybia and Ibn al-Nadim are references reported by TDV, not independently read primary pages.

**Touches:** `data/invention/harun-bimaristan.yaml`, `data/source/tdv-{bimaristan,buhtisu}.yaml`, `data/person/{harun-al-rashid,jibril-ibn-bukhtishu}.yaml`, `data/media/diagram-harun-bimaristan.yaml`, `content/{ar,en,ur}/invention/harun-bimaristan.md`, the inventions queue/research/progress/census, `docs/coverage.md` and `CANARY.md`.

## D-051 — Record Ibn Tulun's endowed patient-care institution (5 November 2026)

**Question:** Does another bimaristan add a distinct documented contribution rather than inflate the count with a building? What do the conflicting foundation dates and priority claims permit?

**Decision:** Publish `invention/ibn-tulun-bimaristan`, kind `institution`, attribution `improvement`, with Ahmad ibn Tulun as commissioner. Al-Maqrizi's quotation from the Tulunid biography describes endowed properties, admission exclusions, custody of clothes and money, supplied dress and bedding, medicines and food until recovery, and discharge with belongings returned. This is the specific institutional development recorded, not invention of hospitals or unprecedented priority for each procedure. Link to `invention/waqf` as the explicitly documented financial/legal basis; do not infer direct copying by a later hospital. No direct dependents or spread are established.

**Limits:** Al-Maqrizi quotes 259 AH from al-Kindi and 261 AH from the biography; TDV gives 872 CE. Keep a debated, derived `0872/0875` interval, not an invented opening year or construction-start explanation. Attribute the biography's “no earlier Egyptian hospital” claim alongside TDV's Fath ibn Khaqan foundation of 861; do not adopt priority as this record's claim. Preserve soldiers/mamluks as exclusions rather than describe universal access. The sixty thousand dinars are expenditure on the hospital and its income-producing estate, not annual expenditure or patient allowances. The primary anecdote says pomegranate from Arish; TDV says apple. Retain the discrepancy, with no retrospective psychiatric diagnosis or endorsement of restraints.

**Identity and image:** TDV's biography documents hadith and Hanafi study; record that evidence and the explicit Sunni default frame, not an inference from name or ancestry. The CC BY 3.0 Berthold Werner mosque photograph is contextual only: al-Maqrizi says the hospital left no trace. The diagram is a relationship chain, not a reconstruction.

**Scope and risk:** `non-impacting`, content within the approved inventions lane. No schema, code, UI, Worker, workflow or submission-document changes.

**Touches:** the new invention, source `tdv-ahmed-b-tolun`, two media records, the commissioner's faith/invention/source blocks, ar/en/ur articles, inventions queue/research/progress/census, generated `docs/coverage.md` and `CANARY.md`.

## D-052 — Record the endowed Nizamiyya network, not invention of the madrasa (6 November 2026)

**Question:** Can the broad madrasa/ijaza lead become a precise institutional contribution without repeating a first-university story?

**Decision:** Publish `invention/nizamiyya-madrasa`, kind `institution`, attribution `improvement`, with Nizam al-Mulk as commissioner. The contribution is the multi-city programme joining endowments, teaching and service posts, books, accommodation and student maintenance. TDV documents Baghdad's Shafi'i conditions and other foundations, and explicitly rejects first-madrasa priority. The Baghdad opening of 459/1067 is the dated exemplar, not the first network foundation: Nishapur is earlier with an unknown exact date. Earlier madrasas and waqf are separate precursors. Later institutions followed the model; no European university, degree or ijaza priority is claimed.

**Evidence and limits:** Read TDV's Nizamiyya article (vol. 33, pp. 188–191), its Nizam al-Mulk biography (pp. 194–196), and Ibn Jubayr's existing local scan pp. 193 and 202, checking both images. The traveller witnesses later endowed schools and a gathering, not the opening. The patron's Sunni affiliation is explicit in the biography, not inferred. Do not copy the encyclopedia's first-primary-source references as independently read. Preserve uncertainty over damage in 1258 and closure. The later Mustansiriyya courtyard photograph, CC BY-SA 4.0, is explicitly contextual, not the Nizamiyya or a reconstruction. The broad ijaza lead remains unresolved.

**Coupled correction:** The existing Baghdad building summary called it the first Nizamiyya and placed al-Juwayni there before al-Shirazi. Correct only this directly reused exemplar's summaries, add Urdu and the new defined source, and preserve its original provenance. TDV places al-Juwayni at Nishapur; Ibn al-Sabbagh gave Baghdad's first lesson and al-Shirazi followed twenty days later.

**Scope and risk:** `non-impacting`, sourced content in the approved inventions lane. Five new entities; no schema, UI, code, Worker, workflow or submission-document changes.

**Touches:** new invention, two TDV sources, two media records, patron's identity/tie, reused building summary/source/provenance, ar/en/ur articles, inventions documentation and generated reports, `CANARY.md`.

## D-053 — Record the elephant clock's documented performance, not a first robot (6 November 2026)

**Question:** What specific al-Jazari contribution can be attributed without converting popular robot and hidden-mechanism summaries into unsupported facts?

**Decision:** Publish `invention/elephant-clock`, timekeeping, kind `device`, attribution `improvement`, with the newly resolved `person/al-jazari-engineer` as improver. No existing canonical record for the mechanical engineer was found; do not confuse him with the recitation scholar Ibn al-Jazari or Ibn al-Razzaz Said. TDV calls him an Islamic scholar, records Artuqid service and places his engineering in earlier traditions; record the explicit Sunni default frame, not an independently attested personal school. Supply complete ar/en/ur person and invention articles.

**Evidence:** Read TDV CEZERÎ (1993, vol. 7, pp. 505–506) and the Met's 57.51.23 overview, metadata and Leoni Catalogue Entry in the browser after direct fetch returned 429. The catalogue gives the half-hour sequence: rider/bird motion, falcon's pellet, dragon, vessel, gong and counting accumulated balls. Its overview mentions a whistle. Treat these as attributed descriptions. The 1205 date is TDV's completion of the book, not a proven physical-machine construction date. The surviving pictured folio is Farrukh's 715/1315 copy, probably Syria or Iraq, not the original machine.

**Limits and media:** Do not use the generated search summaries' hidden bowl, reset, seasonal-hour or priority claims: they were not verified in the primary text or authoritative passage read. TDV's general gravity/float discussion is not a full elephant-clock blueprint. No modern robot lineage or a single copied precursor is proven. Earlier engineering traditions and later illustrated copies form the diagram's chain. Use the actual public-domain Met folio, visually inspected outside git, not an AI reconstruction; its figures are generic manuscript figures, not prophets or Companions. This is a specific device record at the brief's minor-invention depth, not a history claiming invention of timekeeping.

**Scope and risk:** `non-impacting`, approved inventions content. Six new entities, six prose files; no schema, code, UI, Worker, workflow or submission-document changes.

**Touches:** invention, person, two sources and two media records; ar/en/ur invention and person articles; inventions documentation and generated reports; `CANARY.md`.

## D-054 — Record al-Jazari's paired-piston pump without a universal pumping priority claim (6 November 2026)

**Question:** Can the existing double-acting suction-pump lead be completed with an explained mechanism, a licensed actual image and a distinction between the medieval design and modern reconstruction?

**Decision:** Publish `invention/jazari-double-piston-pump`, mechanics-automata, kind `device`, attribution `improvement`, with the existing engineer as improver. TDV's final paragraph describes waterwheel, vertical/horizontal gears, rim pin, slotted rod, fixed pivot and reciprocating piston rods; use that actual account. Al-Hassani's survey supports the synchronized suction-pump pair. The book date is preserved as 1205/1206: TDV and al-Hassani differ, and the museum calls the design c.1205. No invented construction day, well site, numerical output or labour saving.

**Attribution and limits:** Attribute TDV's first-known-suction-pipe and early-engine/modern-engineering assessment to its author, not an independently proven worldwide priority or direct transfer to a specific steam engine. General Hellenistic/Banu Musa context is not an exact pump prototype. Keep the crank/connecting-rod queue lead separate rather than count each mechanism as newly verified. This is a minor-depth record of a particular device, not a comprehensive history of pumps.

**Media and surviving witness:** Use the actual medieval pump drawing reproduced in al-Hassani's figure 6, identified as Topkapi MS Ahmet III 3472, under PD for the old two-dimensional artwork/reproduction. Do not reuse the copyrighted modern figure 7 model or infer the Science Museum photograph's licence from CC0 catalogue data/CC BY text. The Commons files tried show other water-raising devices, not this paired-piston pump, and are not used. Science Museum Group 1976-482 is explicitly a half-size model; its made field is not a reconstruction manufacture date and its dimensions are not original-machine measurements.

**Scope and risk:** `non-impacting`, approved inventions content. Five new entities, three new prose files, direct maker tie/prose extension and lane documentation/reports; no schema, UI, code, Worker, workflow or submission-document changes.

**Touches:** invention, two sources, two media records, the existing al-Jazari person; ar/en/ur invention articles and person extensions; inventions documentation and generated reports; `CANARY.md`.

## D-055 — Publish the peacock washer as a documented design, with construction uncertain (6 November 2026)

**Question:** Can the hand-washing automaton lead be completed without turning a surviving drawing into a surviving or certainly constructed machine?

**Decision:** Narrow the lead to `invention/jazari-peacock-washer`, a specific device/design, attribution `improvement`, with the existing engineer as `describer`. Cleveland's recto catalogue expressly says construction is uncertain; preserve that in the summary, date note, attribution, impact, today and kids surfaces. Its verso catalogue explains fill/pour, rising float, soap door, towel door and drain. No first-washing/soap/robot or modern-dispenser descent claim. Preserve TDV's 1205 and Cleveland's 1206 book dates, distinct from the 1315 Syrian copy.

**Reuse and correction:** Reuse `object/jahiz-tawus` and `media/photo-jahiz-tawus`, not duplicate IDs. Their directly reused Arabic labels incorrectly assigned the folio to the Book of Theriac; correct labels/summaries/source against the actual catalogue, retaining the object's original status and prose. Add proper trilingual image alt/caption, source and provenance, preserving original attribution. Use the actual CC0 recto as hero rather than the two-side composite; inspect both sides outside git. Catalogue measurements describe paper, not the machine. Link the folio in `examples`.

**Object metadata flag:** Attempting a standard AI provenance block exposed an inherited conflict: `object.provenance` is an array in its class schema but an object in the base schema; cite-check expects the latter. Do not change shared schema/checker in this content batch or claim a publication upgrade for the existing object. Keep its original prose/status, record the limited factual correction and attribution in the existing generated_by string, and put the full new account in the properly provenanced invention article. The object-schema repair needs a separate scoped proposal/PR; this is not a request to weaken validation.

**Other screening:** Read TDV MUKARNAS in full (Selçuk Mülayim, vol. 31, 2020, pp. 126–128). Its anonymous/disputed origins cannot honestly supply the currently required named person in `makers` (`scripts/gen-schema.ts` minItems 1). Keep that lead open and flag the modelling limit. Do not invent an artisan, recast a late patron as the original inventor, or change schema outside this content batch.

**Scope and risk:** `non-impacting`, approved inventions content. Three new entities and three new invention prose files; direct maker/folio/media enrichment, lane documentation/reports; no code, schema, UI, Worker, workflow or submission-document changes.

**Touches:** invention, source, diagram, existing person/object/photo records; ar/en/ur invention and maker prose; inventions documentation and generated reports; `CANARY.md`.

## D-056 — Al-Kindi's letter-frequency method (6 November 2026)

**Approved scope:** D-000 content lane, non-impacting. Add `data/invention/frequency-analysis-al-kindi.yaml`, three defined sources, manuscript image and relationship-diagram records, complete ar/en/ur invention prose; extend existing `person/al-kindi` faith/perspectives/tie and matching prose, preserving prior attribution. Update queue, research, progress, generated coverage and canary. No schema, code, deployment or submission change.

**Evidence/decision:** Read the actual Arabic critical text in the1987 Damascus edition: printed213–226,235–241,259, editorial94–97 and201; inspect primary213/216/236 and the title page. The core is counting a same-language sample and ciphertext, matching ranks, then checking adjacency and conventional openings; the author explicitly warns about short messages. TDV's MUAMMA first section independently supports the attribution and calls this the earliest surviving treatise, not invention of concealment itself. Major-method depth; preserve an undated ninth-century composition, not a fabricated year or commission date.

**Identity:** Kaya's TDV discussion documents defence of Islam but disputes Mu'tazili classification, reporting contrary scholarly readings. Record Muslim basis and debated Sunni default, not an asserted personal self-designation; put the museum/Sunni-reference reading first and reported academic classification second on the person, naming that the originals were not read. No verdict.

**Limits/media:** The primary table has corrected counts and three omitted letters: do not republish a supposedly exact permanent frequency distribution. Do not promise to break modern encryption or invent a European transfer route. Inspect the PD Commons manuscript detail as a title/opening illustration, not a portrait or proof of a shelfmark/copy date. PDF/OCR/renders remain outside git; the PDF has an actual CC BY-SA4.0 VRT permission record. A search-supplied English DOI opened a404 in the browser and is rejected, not cited.

## D-057 — Baghdad papermaking as a named act of transmission (6 November 2026)

**Approved scope:** D-000 content lane, non-impacting. Add `data/invention/baghdad-papermaking.yaml`, three historical reference sources and the photograph's metadata source, contextual photograph and relationship-diagram records, complete ar/en/ur invention prose; extend existing `person/al-fadl-ibn-yahya-al-barmaki` with faith/perspectives, the transmission tie and matching prose, retaining its original authorship and citations. Update queue, research, progress, generated coverage and canary. No code, schema, UI, Worker, workflow or submission-document changes.

**Evidence/decision:** Osman Ersoy's TDV KAGIT explicitly attributes the proposal for the Baghdad workshop to al-Fadl ibn Yahya and dates it to 178 AH/794–795. Jonathan M. Bloom's actual Iranica PAPER i independently supports manufacture in Baghdad by the end of the eighth century, but does not independently verify that precise year or patron. Record the named proposal as `transmission`, with `transmitter` as al-Fadl's role: not invention of paper, identification of its anonymous craftspeople or invention of a water-powered machine. The broad Samarkand lead remains open; add this narrower Baghdad candidate separately.

**Identity:** Hakki Dursun Yildiz's TDV BERMEKILER names al-Fadl personally among the 802 pilgrimage party and associates him with Ramadan mosque lighting. This is a cited biographical basis, not an inference from name, office, family or Persian origins. The Sunni label is the museum's explicit default, not a documented personal madhhab declaration. Carry labelled perspectives for Yildiz's account and the hostile poetry he reports questioning the family's Islam; do not turn an attributed family allegation into a personal fact or verdict.

**Limits and disagreement:** Start with the Sunni reference's transmission account, then Bloom's academic critique of the Talas-prisoner explanation and of poorly evidenced early Iranian paper stories. Do not silently harmonize TDV's Sasanian-use assertion with Bloom's explicit lack-of-hard-evidence assessment. Cite classical authors only as reported by the references: their actual editions were not read for this batch. Neither a surviving Baghdad workshop, its exact equipment, output, costs nor a direct route from it to every later mill is established.

**Media:** Enric's CC BY-SA4.0 photograph of bark preparation at Meros, Konigil, dated 5 April 2018 in actual Commons metadata, is contextual modern craft imagery, not the Baghdad workshop or proof of its fiber recipe. Inspect it outside git. Reject an automatically cycling historical GIF as the hero; use a static photograph with explicit trilingual context and alt text. The generic build-time chain is not a reconstruction of workshop machinery.

## D-058 — Hold the Banu Musa lamp without weakening identity evidence (6 November 2026)

**Scope:** D-000 content research, non-impacting; research notes, queue and progress only. Do not change the three existing maker records or publish an invention on a guessed religious affiliation.

**Decision:** Arthur Daemmrich's Smithsonian article identifies model96 as the combined oil-refilling and wick-advancing lamp and describes its float, chain, counterweight, pulley, toothed wheel and rod. This is adequate device-level evidence, not proof of unlimited operation or invention of every lamp. TDV, Casulleras, Pingree and the Dictionary of Scientific Biography describe the brothers' work without explicitly establishing the personal faith required by the lane. The popular NoonPost survey explicitly groups them among Muslim engineers, but its shared death dates and other readily visible chronological errors make it an unsuitable replacement for the deliberately unknown identity entries. Keep the candidate open; neither close it as non-Muslim nor manufacture a personal Sunni declaration.

**Access/media:** The public1981 Arabic edition's item page and BookReader work in the shared browser. Its PDF file host returned500 and the browser download timed out; Search Inside returned a server error. These are distinct failures, not proof that all of Archive.org is unavailable. Selected front matter and contents were inspected, not the full primary model96 description. Commons offers a PD-Art historical lamp image, but its incomplete copy/collection metadata must remain explicit. Hill's modern redraw and the Smithsonian composite are not automatically licensed for reuse.

## D-059 — Research the universal astrolabe as invention21 (6 November 2026)

**Approved proposal:** D-000 content lane, non-impacting. Subject: al-Zarqali's universal astrolabe plate, not invention of the astrolabe itself. Intended paths: `data/invention/universal-astrolabe-al-zarqali.yaml`; scholarly and museum `data/source/` records; licensed image and relationship-diagram `data/media/` records; complete `content/{ar,en,ur}/invention/universal-astrolabe-al-zarqali.md`; the existing `person/al-zarqali` identity/tie and matching prose, preserving earlier authorship; queue, research, progress, canary and generated coverage.

**Evidence requirements:** Read the technical account and distinguish the ordinary latitude-specific astrolabe, Ibn Baso's universal plate and the later surviving sapheas. Verify dates and the named improvement without assigning the date of a surviving copy to the original design. A documented Muslim basis and the explicitly labelled museum default frame are separate from a personal school declaration. Do not reuse Louvre photography merely because its catalogue is public. No code, schema, UI, Worker, workflow or submission-document changes.

**Outcome:** Publish the specific zarqaliyya improvement with al-Zarqali as improver, an eleventh-century design date and no priority over all universal instruments. Puig's complete biography and Bir et al.'s selected technical pages establish projection, grids, horizon ruler, variants and documentary transmission. Independent reconstruction of Ibn Baso's design or a direct workshop genealogy was not completed and is not asserted. Bibliotheca Alexandrina explicitly names al-Zarqali among Muslim astronomers; the Sunni field explicitly records the museum default, not personal school attestation. The licensed Codex photograph is a display copy, not an original; Louvre LAD2019.001 is a separate circa1224 catalogue witness, whose photographs are not reused. All17 sections ship in Arabic, English and Urdu, with directly related maker passages updated and original authorship retained. No primary manuscript or complete operating manual reading is claimed.

## D-060 — Research al-Zahrawi's stone-fragmenting instrument as invention22 (6 November 2026)

**Approved proposal:** Non-impacting research/content batch under D-000. Investigate the named al-mishab in the surgical book of *al-Tasrif*, not invention of surgery, modern bladder lithotripsy or every instrument in the encyclopaedia. Intended paths, conditional on actual evidence: a specifically scoped `data/invention/` record and complete17-section Arabic-first/English/Urdu articles; a reusable sourced maker record and matching prose if none exists; defined scholarly, institutional and primary-text source records; licensed historical or contextual media and a generic relationship diagram; queue, research, progress, canary and regenerated coverage/census. No code, schema, UI, Worker, workflow or deployment.

**Research requirements:** Distinguish the impacted urethral-stone drill from bladder-stone forceps and incisional lithotomy. Read the actual medical-history paper and relevant translated primary description, verify its real publication metadata, and attribute later priority/lineage claims rather than repeat a survey's superlatives. A search synthesis already gave conflicting journal/page/translator information and is discovery only, not a source. Verify the named Muslim identity and explicitly separate the Sunni default from personal school testimony. Locate and inspect compliant media; an open-access article does not make its NC-licensed figures suitable museum media. Present historical mechanics, not instructions for performing surgery.

**Outcome:** Publish the specific documented drill as a minor instrument improvement, with al-Zahrawi as describer and the author's experience clearly attributed. Do not adjudicate first lithotripsy, infer a surviving original, conflate bladder and urethral tools, or give clinical instructions. Complete SMJ translation/commentary and TDV entries supply the evidence, including explicit named Muslim classification and source-limited biography. A new fully sourced trilingual maker record was required after duplicate checks. The circa390/1000 date belongs to the encyclopaedia, and the later death/court-service evidence remains labelled. The inspected PD-Art image is explicitly contextual and not identified as the drill; modern NC figures are excluded. Keep the broader instruments candidate open. Four source records, two media records and complete17-section trilingual invention prose are included.

## D-061 — Hold the proposed post-conversion al-Samawal calculation (6 November 2026)

**Approved scope:** Non-impacting research under D-000; queue, research and progress only. Do not alter the existing maker's identity or create an invention from an unverified chronology.

**Decision:** MacTutor, Adel Anbouba's Dictionary of Scientific Biography entry and Ihsan Fazlioglu's complete TDV entry distinguish the youthful *al-Bahir* from later arithmetic writings and report conversion in1163. TDV identifies *al-Kitab al-Qiwami fi al-hisab al-Hindi* as a work on roots and decimal arithmetic, but the readable entry does not date its composition. The proposed1172 date remains unverified. Earlier algebra cannot simply be relabelled as a post-conversion contribution. Keep a specifically scoped lead open, not an exclusion of the person or a claim that his later contribution did not exist.

**Access/limits:** The actual Springer page for Rashed's1978 paper, DOI10.1007/BF00350534, offers paid access; its contents were not read. No payment or access restriction was bypassed. The De Gruyter reprint did not expose readable content. Search syntheses contradicted one another and wrongly attributed claims to readable sources: they are not evidence. The Britannica landing page labels its opening summary AI-generated; do not cite that summary as scholarship. No Iranica article was obtained.

## D-062 — Al-Kindi's calculation of compound-drug qualities as invention23 (6 November 2026)

**Approved proposal:** Non-impacting content batch under D-000. Add `data/invention/kindi-drug-degrees.yaml`, complete17-section `content/{ar,en,ur}/invention/kindi-drug-degrees.md`, the defined Prioreschi source, compliant contextual image metadata if needed, and a generic relationship-diagram record. Extend existing `person/al-kindi` only with the sourced invention tie and matching trilingual prose, preserving earlier authorship, identity caveats and theological perspectives. Update queue, research, progress, canary and regenerated coverage/census. No code, schema, UI, Worker, workflow or submission-document changes.

**Evidence:** Read all four printed pages17–20 of Plinio Prioreschi, “Al-Kindi, A Precursor Of The Scientific Revolution”, JISHIM2002/2. It distinguishes Galen's four qualitative degrees, al-Kindi's mathematical interpretation, the separate formulary, Gerard's twelfth-century translation and Bacon's difficulty assessment. Record a bounded improvement of an inherited model, not invention of medicine, a clinically proven formula, modern pharmacology or an established direct lineage to modern dosing. Source-level praise and universal-priority claims stay attributed. No original *De gradibus* manuscript, McVaugh edition or Bacon text was independently read.

**Identity/media/depth:** Reuse the already sourced Muslim basis and explicitly debated Sunni museum frame on the maker; do not silently settle that disagreement. A minor historical method receives800–1500 Arabic main-body words and complete English/Urdu translations. Use an inspected licensed contextual pharmacy object or manuscript, clearly distinguished from al-Kindi's own equipment; the generic chain is not a prescription or a technical reconstruction. The article is historical explanation, not treatment or compounding advice.

**Outcome:** Complete17-section prose in all three languages, with1074 Arabic/1273 English/1509 Urdu main-body words. Published as a bounded improvement, with century-only contextual dating and explicit limits on location, clinical efficacy and lineage. Reused the maker without settling the affiliation dispute. Two sources and two media records support the historical account and inspected later CC0 jar; the jar is not an authenticated personal object. Validation and4/4 citation checks pass without changing a rule.

## D-063 — Al-Khazini's refined hydrostatic balance as invention24 (6 November 2026)

**Approved proposal:** Non-impacting content batch under D-000. Add `data/invention/balance-of-wisdom.yaml`, complete17-section Arabic-first/English/Urdu articles, three defined sources (Hall's DSB entry, Khanikoff's1859 extracts and Penn's LJS386 catalogue), inspected manuscript-image metadata and a generic relationship diagram. Enrich the existing `person/al-khazini` and matching trilingual prose, preserving the original import's authorship and explicitly unread al-A'lam reference. Update queue, research, progress, canary and generated coverage/census. No code, schema, UI, Worker, workflow or submission-document changes.

**Evidence and boundaries:** Hall distinguishes al-Asfizari's two movable pans from al-Khazini's further calibration refinements; record improvement, not invention of hydrostatics, the indicator tongue or all five-pan balances. The515 AH/1121–1122 pair dates the treatise, not an independently dated surviving instrument. Sensitivity is an attributed historical claim, not a modern replication. Binary-alloy analysis assumes known constituents and approximately additive volumes; it is not universal chemical identification. Documentary survival and later quotation do not establish continuous workshop transmission.

**Identity/media/depth:** Visually read printed pp1,3–4 of the1859 edition. On p3 the author's own preface identifies Muhammad as his prophet: this, not his name, ancestry, enslavement or court, supplies the Muslim basis. Sunni remains the labelled museum default for the Seljuq milieu, not personal school testimony. Hall's technical sections and attribution are read; his warning about errors in the old translation remains explicit. Penn describes LJS386 as undated, approximately1250?–1350?, not Commons' narrower circa1270; use the institution's range. The inspected fol80v diagram is a later manuscript witness, not an autograph, photograph of hardware or proven working reconstruction. Penn explicitly places the images in the public domain. Treat this as a major instrument article and meet the1500-word Arabic main-body floor with full English/Urdu counterparts.

**Outcome:** Complete17-section invention articles with1523 Arabic/1688 English/1932 Urdu main-body words excluding headings, references and citation tokens. Three source records, two media records and a sourced trilingual maker biography accompany the improvement record. Validation reports0 errors;4/4 targeted citation checks pass. Generated graph verifies exactly one forward/inverse maker relation; coverage/census count24 inventions and513 leads. Tests/local builds remain skipped at the founder's request; no build or deployment success claimed.

## D-064 — Al-Karaji's arithmetic of algebraic expressions as invention25 (6 November 2026)

**Approved proposal:** Non-impacting content batch under D-000. Add `data/invention/karaji-polynomial-arithmetic.yaml` and complete17-section Arabic-first/English/Urdu articles; defined MacTutor, TDV, HESS2020, Woepcke1853 and Commons-image sources; licensed modern explanatory media and a generic relationship diagram. Enrich existing `person/al-karaji` and its matching prose while preserving the original Claude-authored scaffold attribution. Add a specifically scoped queue entry without closing the wider binomial-priority lead; update research, progress, canary and generated coverage/census. No code, schema, UI, Worker, workflow or submission-document changes.

**Scope and evidence:** Actual MacTutor technical biography and bibliography, complete TDV entry, HESS's verified printed p762 identity paragraph, and actual printed pp3–4 of Woepcke's1853 notice are read. Record operations on powers and composite algebraic quantities as an improvement of earlier algebra, not invention of modern symbolism, general polynomial division, rigorous modern induction or the first coefficient triangle worldwide. Preserve differing scholarly assessments of how fully geometry was displaced. Modern notation and the2014 image are teaching aids, not manuscript reproductions. Meet the major-method1500-word Arabic floor with full English/Urdu counterparts.

**Identity, dates and access:** Ataie-Ashtiani and Simmons explicitly identify the named mathematician as Muslim on actual p762; “Islamic mathematics,” a name or a Buyid patron alone is not the basis. Sunni remains the labelled museum default for the Abbasid/Baghdad milieu, not personal school testimony; TDV's Buyid political patronage is not recast as Sunni or taken as the person's faith. No contrary personal affiliation is named in the read sources. Do not copy the HESS paper's internally inconsistent Razi-contemporary chronology or turn its speculative translation-movement comment into a fact. Use century-level work dating, not the overprecise MacTutor birth header. Google reader PA1/PA2 actually show printed3/4: cite the printed pages. The1853 extracts are not the complete primary treatise. Google text fetch403 and screenshot instability were not successful readings; the actual public reader images were retrieved and visually read without bypassing restrictions. The inspected modern expansion is CC BY-SA3.0 and explicitly distinct from historical notation.

**Outcome before integration:** All17 sections and matching maker prose in three languages; main-body depth1527 Arabic/1663 English/1918 Urdu words excluding headings, references and citation tokens. Validation0 errors;4/4 targeted citation checks. Graph:51,432 nodes/82,402 edges, exactly25 invention nodes and unique maker `improved`/`improved_by` and precursor `built_on`/`enabled` edges. Coverage/census:514 leads,475 active/39 excluded,281 prose-hit files. The initial checker guessed an inexistent `precursor_of` name; inspected actual edges and reran exact assertions for the registered predicates successfully, without altering graph code. Licence uses the schema's generic `CC-BY-SA`, with actual3.0 in credit/link. Perspectives begin with an explicitly editorial Sunni museum frame, not an invented historical Sunni technical verdict. Tests/local builds remain skipped at founder request; no build/deployment success claimed.

## D-065 — Al-Uqlidisi's decimal-fraction methods as invention26 (6 November 2026)

**Approved proposal:** Non-impacting content batch under D-000. Add `data/invention/decimal-fractions-al-uqlidisi.yaml` and full17-section Arabic-first/English/Urdu prose; defined MacTutor, TDV, Saidan DSB-reproduction and Commons-chart sources; inspected CC0 modern explanatory image and generic relationship diagram. Enrich existing `person/al-uqlidisi-ahmad-ibn-ibrahim` and its three prose files, retaining Devin provenance, Claude translation attribution and the cited legacy biographical estimate. Add a narrow completed queue entry without pretending the broader al-Uqlidisi/al-Kashi lead is complete; update research, progress, canary and generated reports. No code, UI, Worker, workflow, schema or submission-file changes.

**Scope and evidence:** MacTutor's complete authored biography/bibliography and Hüseyin Gazi Topdemir's complete TDV entry pp25–26 are read, as is A. S. Saidan's actual DSB reproduction linked by MacTutor. Treat direct decimal-fraction operations and a units-place mark in the Damascus341/952–953 treatise as an improvement of inherited arithmetic, not invention of base-ten numerals or the modern decimal point. Preserve Saidan's versus Rashed's disagreement over conceptual completeness without a verdict. The four-part book's pen-and-paper adaptations provide context, not another counted invention. Major-method target1500+ Arabic main-body words with full translations.

**Identity and limitations:** MacTutor explicitly quotes Saidan's named Muslim classification; this is the faith basis, not “Islamic mathematics,” a name or Damascus. Sunni is separately the museum's explicit default for the documented Islamic Damascus milieu, not personal school evidence; no contrary personal affiliation is named in the read sources. Distinguish composition341/952–953 from surviving-copy1157 and uncertain life dates. The linked PDF is an Encyclopedia.com print reproduction, not original printed DSB pp544–546; actual inspection of its second page shows missing arrays/formulae, so no successful reading of those figures is claimed. Modern computed teaching sequences are labelled as such, never invented transcriptions. The1973 Arabic edition,1978 translation and Rashed's original are not independently read. The CC0 chart's current upload is2025 while its creator describes2023: both are modern, and its decimal dot is not the historical units mark.

**Outcome before integration:** Complete17-section Arabic/English/Urdu articles with1515/1605/1768 main-body words; matching enrichment preserves original person/translation attribution and makes the inherited approximate death explicit in EDTF. Four sources, inspected CC0 modern image and generic diagram. Validation49,531 entities/84,731 prose files,0 errors/8403 warnings; authenticity0 errors/1 warning; targeted citations4/4. Graph51,439 nodes/82,408 edges, exactly26 invention nodes and unique maker/precursor forward/inverse edges. Generated reports:515 leads,476 active/39 excluded,286 prose-hit files. Tests/local builds skipped at founder request; no build/deployment claim.

## D-066 — Al-Zarqali's independent equatorium as invention27 (6 November 2026)

**Approved proposal:** Non-impacting content batch under D-000. Add `data/invention/equatorium-al-zarqali.yaml` with complete17-section Arabic-first/English/Urdu prose; defined MacTutor biography, Cambridge comparison-project and Commons-photograph sources, reusing Puig and Bibliotheca Alexandrina; inspected licensed contextual photograph and generic relationship diagram. Append the new tie and matching section to existing `person/al-zarqali`, retaining original authorship and the universal-astrolabe tie. Complete the existing queue lead, not a duplicate; update research, progress, canary and generated coverage/census. No code, schema, UI, Worker, workflow or submission-document changes.

**Decision and evidence:** Puig explicitly dates construction/use treatises approximately1080/1081 and1081/1082, dedicated to al-Mu'tamid, and identifies Ibn al-Samh's circa1025/1026 predecessor. The improvement is an independent instrument consolidating the planetary deferents and associated circles on both sides of one plate and the epicycles on a second plate. It is not seven independent planetary plates, the universal astrolabe, or invention of every equatorium. Treat as a bounded instrument refinement with the800–1500-word Arabic depth band and complete translations. Do not assign a precise construction city: the dedication and uncertain1081–1085 departure chronology do not settle it.

**Attribution and limits:** MacTutor's actual biography explicitly names al-Zarqali as Muslim and warns against the exaggerated Kepler comparison. The museum's Sunni default is separately labelled; no personal madhhab declaration is manufactured. The Mercury oval is the instrumental representation within inherited planetary geometry, not evidence that he formulated heliocentric orbital laws. Preserve the difference between dedicated treatises and surviving original hardware. The primary construction/use treatises and Comes1991 were not independently read; do not pretend a catalogue/search hit supplies their contents.

**Media/comparison:** The visually inspected Reptonix photograph is CC BY3.0, unchanged: a later equatorium at World Museum Liverpool, described on Commons as circa1600, possibly French. It is neither al-Zarqali's original nor its reconstruction. The Cambridge institutional account concerns the separate late-fourteenth-century John Westwyk manuscript and a modern model; its authorship correction and accuracy report must never be attached to al-Zarqali's design. LoC and CUDL access checks were blocked, not successful manuscript readings. No source scans enter git. Tests/local builds remain skipped at founder request; never deploy or claim an unperformed build.

**Outcome before integration:** Complete17-section Arabic/English/Urdu articles,1105/1246/1369 main-body words; three new sources, licensed inspected contextual image, generic diagram and matching maker enrichment. Validation49,537 entities/84,734 prose files,0 errors/8403 warnings; authenticity0 errors/1 warning; targeted citations4/4. Graph51,445 nodes/82,410 edges, exactly27 invention nodes with unique maker/inverse edges and no invented dependency on the universal plate. Census515 leads (476 active/39 excluded),288 prose-hit files. The validator's runtime origin requirement is satisfied with existing broad `place/al-andalus`, not a guessed city. No test/build or deployment result claimed.

## D-067 — Al-Biruni's mountain-and-horizon Earth measurement as invention28 (6 November 2026)

**Approved proposal:** Non-impacting content batch under D-000. Add `data/invention/al-biruni-earth-radius.yaml`, full17-section Arabic-first/English/Urdu articles, defined Jamil Ali translation/TDV/MacTutor/Maslikov-abstract/Commons sources and licensed explanatory-image/generic-diagram records. Extend existing `person/al-biruni-muhammad-ibn-ahmad` with cited faith/perspectives, the method tie and matching trilingual prose while retaining Devin/Claude authorship and unrelated dates. Complete the existing queue lead; update research, progress, canary and generated coverage/census. No new place is needed: use the existing Ghaznavid polity as broad origin context and name Nandana in text, without invented coordinates. No code, schema, UI, Worker, workflow or submission-document changes.

**Primary evidence:** The founder's147-page PDF is not Arabic: visually verified Jamil Ali's English translation published by the American University of Beirut, with February1967 preface. Read translator ix–xii and actual printed183–191, visually checking188–189/figures55–56. PDF spreads100/101/102 correspond to printed184–185/186–187/188–189; centre numbers219–224 are the Cairo Arabic edition's page markers, not this translation's printed pages. The text gives the Nandana experiment,0;34-degree dip,652;3,18 local cloth cubits for height and12,803,337;2,9 cubits for radius. Exact-arithmetic verification reconstructs the printed ratio. No claim to reading the original Arabic manuscript or the whole book.

**Priority decision:** Publish `attribution.status: contested`, maker role `describer`. The translator's preface calls the method the author's own invention, but the actual text explicitly reports Sanad ibn Ali using the same principle under al-Ma'mun. Preserve both voices and the earlier named account; do not claim first Earth measurement, discovery of sphericity, a newly invented trigonometric identity or an invented precise experiment year. Dating is the416/1025 treatise witness, not an asserted1025 field visit. Major-method1500+ Arabic main-body words with complete translations.

**Identity:** Britannica explicitly identifies the named man as Muslim; Tümer discusses his commitment to Islam. Sunni is a debated frame, not unqualified self-testimony. Tümer disputes inference from a patron and reports Abdullah Ni'me's Shia and Taqi Danishpazhuh's Zaydi classifications; retain the Sunni reading first and those reported alternatives with citations and no verdict, as operative brief§3(b) explicitly permits for al-Biruni. The originals of those modern affiliations and the classical passages Tümer cites were not independently read.

**Precision and media:** MacTutor's favourable modern-kilometre comparison is not silently reconciled with Maslikov2019's actual abstract warning about accuracy and uncertain historical length units. Only that abstract/bibliography, not the Russian full paper, is read. The modern formula includes the cosine numerator: `r=h*cos(alpha)/(1-cos(alpha))`; a search synthesis omitted it and is rejected as evidence. Nevit Dilmen's inspected2010 geometry diagram is CC BY-SA3.0; it is a modern schematic, not historical artwork, a measured mountain profile or proof of the file description's accuracy claims. All source scans/OCR/images remain outside git. Tests/local builds remain skipped at founder request; never deploy.

**Outcome before integration:** All17 canonical sections,1768 Arabic/2022 English/2161 Urdu main-body words. Five defined sources, inspected licensed image and generic chain, existing maker's method tie/faith/perspectives/trilingual enrichment; old Devin/Claude authorship retained. Validate49,545 entities/84,737 prose files,0 errors/8403 warnings; authenticity0 errors/1 warning; targeted citations4/4. Graph51,453 nodes/82,412 edges with28 inventions and unique describer/inverse pair, no false dependency. Census515 leads (476 active/39 excluded),292 prose-hit files. Source metadata and four English headings corrected to existing schema/canonical patterns after initial validation; no gate weakened. Era follows the existing1020s camera-obscura record's Abbasid-golden grouping. Next integrate reviewed main and rerun gates.

## D-068 — Al-Battani's sine-table computation as invention29 (6 November 2026)

**Approved proposal:** Non-impacting bounded-refinement batch under D-000. Add `data/invention/battani-sine-table-methods.yaml` and full17-section trilingual prose; define actual TDV/MacTutor/Commons sources and licensed triangle/generic-chain media. Extend `data/source/nallino-albatenii-opus-astronomicum.yaml` with the newly inspected pages while preserving prior provenance. Enrich existing `person/al-battani` data/prose with a documented faith basis and distinct method tie, retaining earlier authorship and labelled identity discussion. Complete the existing museum-person queue lead, not a second generic trigonometry entity; update lane progress/research, canary and generated reports. No code/schema/UI/workflow/Worker/submission changes or new place. Keep the spherical-sine-law lead separate and unresolved.

**Scope/priority:** Improvement, not first invention of sine, interpolation, every trigonometric function or the spherical sine law. Actual primary chapter3 constructs half-chords of doubled arcs, tabulates at half-degree intervals on radius60, gives forward proportional interpolation and inverse lookup, and recovers full chords by doubling the half-angle sine. It explicitly retains Ptolemy's diameter120 convention. Use the bounded800–1500 Arabic main-body band, with complete translations. First-attestation date is an explicitly open latest-lifetime bound `../0929` (317 AH death), not a guessed writing year or borrowed observational epoch.

**Evidence/identity:** Personally read Latin chapter3 printed9–11 (scan98–100), visually inspected Arabic printed13–17 (scans1139 down to1135; Arabic part is reverse-ordered in this bound PDF), plus author's opening printed6 (scan1146). Read Nallino's actual Latin faith argument scan25/printedXVI: he bases Muslim identity on the book's preface and formulas, not merely the name Muhammad. The opening's actual religious declaration agrees; do not reproduce Qur'an text or honorifics. Sunni remains the labelled museum frame of the documented Abbasid Raqqa milieu, not personal school testimony; preserve the earlier named Sabian-identity debate. MacTutor's name-only inference is not this batch's faith basis.

**Limits and media:** Read actual selected TDV Ferruh Müftüoğlu entry6(1992),9–10 and MacTutor O'Connor/Robertson November1999 biography/technical/footer passages. They disagree on translation chronology: TDV's Spanish translation century is internally inconsistent with Alfonso X, and MacTutor's1116 Latin date differs from other accounts; do not publish those unverified dates or a first-tangent headline. TheOtherJesse's inspected original6 July2007 `TrigonometryTriangle.svg` is author-released PD; use its archived2007 version, not claim to have inspected the revised2024 rendering. It is a modern explanatory right triangle, not a historical page or proof of priority. Fakhri's earlier D-009 hold remains: the newly reread biographies do not resolve its maker's Sunni milieu, and scale claims differ. Source scans/OCR stay outside git; tests/builds skipped by founder; never deploy.

**Date representation:** Initial validation correctly rejected the free-text Hijri bound. Existing `hijri` accepts only a single structured date; storing `0317` would falsely suggest an exact composition year. Keep valid EDTF `../0929`, explain the sourced317 AH/929 endpoint in the date note and all three articles, and omit the incompatible optional Hijri field. Existing display retains the literal open EDTF interval; no date-renderer/schema edits or fabricated chronology. All17 canonical headings match; main-body words1013 Arabic/1156 English/1322 Urdu before final gates.

## D-069 — Ibn Firnas's reported winged flight as invention30 (6 November 2026)

**Approved proposal:** Non-impacting bounded-experiment content batch under D-000. Add `data/invention/firnas-reported-winged-flight.yaml`, full17-section trilingual prose (800–1500 Arabic main-body words for this single bounded account, not a history of aviation), four actual source entities (TDV, Lienhard/UH, Islamweb identity discussion, Commons bridge metadata), two media records and maker tie. Enrich existing `person/abbas-ibn-firnas` data/trilingual prose and reused `source/nafh-tib-maqqari`/`source/tarikh-islam-hasan-ibrahim`, retaining Devin attribution and conflicting accounts. Complete existing `ibn-firnas-glider-account` lead, update lane records/canary and regenerate reports. No code/schema/UI/workflow/Worker/submission changes; no new place or invented artifact.

**Actual evidence:** Read Maqqari's Arabic entry160, Ihsan Abbas edition3:374, at `https://shamela.ws/book/1002/1783` (raw HTML title independently confirms volume/page), plus continuation3:375. It reports feathers, two wings, distance described qualitatively, injury on landing and lack of a tail; no precise dimensions, elapsed flight time, measured distance, launch tower or event year. Editor cites *al-Mughrib*1:333 and *al-Muqtabis* fol256b; their original flight passages were not independently read, so this is not multiple independent eyewitness evidence. The four locally harvested Maqqari files do not include the needed volume3: do not claim the online passage was checked against a local volume3 image.

**Identity and corrections:** Personally read OCR and **visually inspected Hasan Ibrahim Hasan volume4 printed378/PDF scan382**; it explicitly calls him Muslim, so no name/country inference. Title/imprint images7–8 confirm volume4, Dar al-Jil/Maktabat al-Nahda al-Misriyya,14th edition1416/1996. Correct the existing maker citations that treated382 as a print page. Hasan says he rose unharmed; Maqqari and TDV report injury. Preserve these as labelled positions, not resolve by preference. Read actual Kasım Kırbıyık TDV entry1(1988),24, and full Lienhard UH episode1910 including its8 July2009 caveat about no primary material for Armen Firman. Read actual Islamweb406804's Ibn Firnas identity discussion only: it rejects establishing atheism from the reported accusations. Sunni default is separately labelled for Andalusi Umayyad Cordoba, not personal school testimony; retain reported criticism with named attribution and no museum verdict.

**Attribution/date/media:** `contested` reported experiment, not first verified flight or invention of modern aviation. Uncertain `0875?` is explicitly Lienhard's conventional secondary date, not a date supplied by Maqqari; no invented Hijri date or duration/distance. No asserted transmission to Eilmer, Leonardo or the Wrights. JSTOR White article could not be read; search summaries/quotations are not sources. Hero is **Edmundo Sáez's inspected21 February2014 night photograph of the modern Abbas Ibn Firnas Bridge in Cordoba**, CC BY-SA4.0 verified from actual Commons licence link; it is commemorative context, not a flying device/reconstruction, and no opening year or engineering attribution is inferred. Generic chain compares the narrated bird imitation with the reported experiment, not fabrication plans. No dangerous recreation instructions; sources/binaries remain outside git. Tests/builds remain skipped by founder; never deploy.

**Written/gates:** All17 canonical sections;925 Arabic/979 English/1129 Urdu main-body words. Six defined sources (four new), two media; existing maker enriched with explicit Muslim basis and labelled faith discussion, prior Devin attribution retained. Corrected source URI encoding and Urdu first-perspective label after validation findings, not validator rules. Validate49,558 entities/84,743 prose files,0 errors/8402 warnings; authenticity0 errors/1 warning; citations4/4. Graph51,466 nodes/82,418 edges,30 invention nodes, unique claimed inventor/inverse pair and no false dependency. Census515 leads/476 active/39 excluded,266 person leads,299 prose hits. Next integrate reviewed main and rerun gates.

## D-070 — Ziryab's reported fifth oud string as invention31 (6 November 2026)

**Approved proposal:** Non-impacting bounded-refinement batch under D-000, completing existing `ziryab-fifth-string` lead. Add `data/invention/ziryab-fifth-string.yaml`, full17-section Arabic-first prose and English/Urdu translations (800–1500 Arabic main-body words), four defined sources (TDV biography, Reynolds2008, Al Jazeera2022 biographical feature, Cleveland1918.350) and one generic diagram record. Enrich existing `person/ziryab` and its three prose files, reused `media/photo-ud-shami` and `source/nafh-tib-maqqari`, preserving prior Devin attribution. Update queue, lane research/progress/canary and regenerate reports. Reuse existing oud object and photograph, no duplicate artifact. No code/schema/site/Worker/workflow or submission change.

**Read evidence:** Actual Maqqari Arabic3:122–129 via Shamela1531–1538, especially3:126 at1535, whose raw HTML title confirms printed page. The account adds a red string between mathlath and mathna, using an older four-string/humour analogy and a fifth soul analogy; eagle-quill plectrum is a separate reported refinement, not the invention of plucked strings. Read actual complete Fazli Arslan/Fatih Erkocoglu TDV biography44(2013),464–465. Actual Reynolds2008 article portions at155–156,158–166 compare Ibn Hayyan's multiple sources with Maqqari's idealized composite; do not claim independent reading of Ibn Hayyan's original or claim Reynolds experimentally disproved the fifth string. Contested attribution and Sunni-first/academic perspectives preserve the evidentiary distance, not absolute priority or a modern instrument genealogy.

**Identity/date:** Actual Al Jazeera14 June2022 biographical feature explicitly presents Ziryab in its **Muslim Scholars** series. This named editorial biographical classification is the Muslim basis, not his name, parentage, patron or music; it is not a self-declaration of belief. Reynolds's probable convert-parent inference is attributed and is NOT used as faith proof. Sunni is separately the default frame under operative brief3/docs/scope.md for the documented Abbasid/Umayyad milieu with no contrary denomination in the read biographies, not an attested personal school. Use ninth-century `08XX` as broad reported event period, not a dated surviving instrument or a contemporary attestation. Do not invent a birth year, precise invention year or Hijri year; TDV death238/852 is sourced, while other chronologies remain attributed.

**Media and limits:** Inspected actual Cleveland catalogue/API and full567×900 photograph of accession1918.350: West Asia, late1800s–early1900s, wood/gut/metal, CC0, Charles G. King Jr. collection/gift of Ralph King. Reuse `object/ud-shami` and `media/photo-ud-shami` as explicitly much later comparison, NOT Ziryab's instrument, reconstruction, verified string count or archaeological confirmation. Generic chain is inherited four-string oud → attributed fifth-string modification, not a guaranteed guitar/lute descent. No historical portrait, medical humour claim, ruling on music or unsupported first-conservatory/food-invention claim. Source files stay outside git. Tests/local builds remain skipped at founder request; never deploy.

**Written/gates:** All17 canonical headings per language,1053 Arabic/1163 English/1308 Urdu main-body words. Six new entities take49,558→49,564; complete maker/trilingual prose and reused source/media enrichment preserve Devin/Haiku attribution. Initial missing discipline corrected to existing `music`, never validator rules. Validate49,564 entities/84,746 prose files,0 errors/8402 warnings; authenticity0 errors/1 warning; targeted citations4/4. Graph51,472 nodes/82,424 edges, exactly31 inventions; unique `improved`/`improved_by` pair and no false dependency. Census515 total/476 active/39 excluded,266 person leads,305 prose hits. Exact shapes, licensed image, disputed attribution, Sunni-first perspectives and century/date assertions pass. Reviewed independent main #4227–#4230, only separate CANARY Data additions overlap; integrate and rerun before publishing. No tests/local build/deployment.
