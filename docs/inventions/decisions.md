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
