# Lane `modern-figures`: modern-era figures whose work is media and public work

_Opened 24 October 2026 on the founder's instruction. Binding with `AGENTS.md`, `docs/ai-change-gates.md`, `docs/agents/publication-standard.md`, the Wikipedia broad rule (founder-approved, applied to `AGENTS.md` and `docs/sources-policy.md`) and `docs/delegation/wikipedia-broad-rule-proposal.md`._

## Mission

Create museum person records for modern-era figures whose influence on Muslims was exercised mainly through **video production, broadcasting and social work** rather than books — the founder's inclusion criterion: sustained public work reaching at least ~100,000 Muslims (men) or ~50,000 (women). The model entry is `person/amr-khaled` (landed 24 Oct 2026, PR #1512): copy its shape exactly.

## The model (per person)

1. **Source entities first** (registration before use):
   - `data/source/wikipedia-<slug>-en.yaml` — kind `reference_data`, type `web`; the article's recorded revision date in `issued` and `publisher`; reliability_note stating the Wikipedia rule (a fact is used only where the article cites a source for it) and the date checked.
   - `data/source/wikipedia-<slug>-ar.yaml` — the Arabic article, where one exists (omit and note in provenance when none).
   - `data/source/wikidata-<slug>.yaml` — the Wikidata item: dates, identifiers, official links.
   - A shared press source entity (TIME, BBC, …) only when the record actually cites it; reuse an existing entity when present.
2. **Data** `data/person/<slug>.yaml`: label {ar, en, ur}; full names; gender; trilingual summary; roles; wings `[people, living]` for the living, `[people]` for the deceased (themes/periods only as facts support); born/died blocks with per-field `sources`; relations (`born_in`, `lived_in`) only to place records that exist; `external_ids.wikidata`; `sources`; `provenance` (layer `own-research`, an explicit source string naming the articles, the QID and the checks, `generated_by`, `run: modern-figures-batch-<n>`); `status: { review: published, generated_by }`.
3. **Faith discipline (from the model):** `faith.value` is `sunni` only when **two** of the person's sources independently give the school; otherwise `unknown` with basis `unknown` and a note saying what each source gives (the Amr Khaled note is the template). Never assert a school from one infobox. **Shia mapping (founder, 24 Oct 2026):** the enum has no generic `shia` value; where two sources attest "Shia" without naming a branch and the context supports it (e.g. an Iranian figure in Iran's Twelver tradition), record `shia-twelver` with basis `documented` and state the mapping plainly in the note — the sources named Shia, the branch is the founder's mapping. Where the context does not support a branch, the value stays `unknown` with the attestations in the note. First application: `person/shirin-ebadi`.
4. **Prose** `content/{ar,en,ur}/person/<slug>.md`, frontmatter (id, lang, source_lang: ar, translators: []):
   - Arabic: rich first pass in the model's sections as the facts allow — موجز (with the notability anchor) · النشأة والتعليم · البدايات والمسيرة · البرامج والأعمال (the media/social work is the core of this lane) · المشروعات والمبادرات · المواقف والنقد (attributed; opens with the model's disclaimer that these are reported positions, not the museum's verdict) · المؤلفات (where any) · الحياة الشخصية (restraint: no family detail beyond what understanding the work needs) · الأثر والجمهور · المراجع.
   - English: a full mirror of the Arabic. Urdu: a shorter version (lead + key sections), as in the model.
   - Every fact-stating sentence carries `{cite:<source-id>}`. Facts only where the underlying article cites a source (charter §3 of the broad rule); audience/follower numbers are platform figures, dated, never stated as museum facts.

## Rules

- Batches ≤ 25 entities per commit, grouped by batch id in the progress file. `npm run cite-check -- <ids>` per batch; `npm run validate` at batch checkpoints (the founder's standing instruction: the full test suite and CI are deferred to his Mac — note the deferral in the progress file).
- Skip-and-log: a figure who cannot be verified to the charter standard (no Wikipedia article with cited facts and no Wikidata item) is skipped in the progress file with the reason — never forced, never invented. **Founder amendment (24 Oct 2026) — the channel queue (§2/§3 of the founder's harvest) is exempt from skip-and-log:** every channel in the founder's list yields a person record for its author. Identify the author from the channel name, its description and the links in its About/description; source from Wikipedia/Wikidata where present, otherwise from the channel itself (registered as a `data/source/` entity — a primary source for the author's identity, work and reach, never independent corroboration) plus trusted profiles (news, institutional bios, publisher pages, official sites) found via those links. Where sources are thin the record is minimal and the prose shorter — but nothing is invented, and the faith two-source rule is unchanged (a dawah channel is not a school attestation). One record per person: multiple channels of one author are noted in that person's record. A name is logged as unidentifiable only when no author identity can be established from any source, with the searches recorded in the progress file.
- Enrichment of an existing skeleton record keeps its existing sources and facts; the lane adds the model sources and prose and completes the provenance string.
- No site/, schema/, i18n/ or outreach changes in this lane. Contested or living figures: describe, attribute, label — no verdict in the museum's voice.

## Queue

- **Batch 1** — scholars and preachers (15): al-Sha'rawi, Ali Gomaa, Ahmed el-Tayeb, al-Qaradawi, Tantawi, Ahmed Raza Khan, Kuftaro, Nursi, Deedat, Hamka, Sayyid Qutb, Abu Ghudda, Menk + enrich al-Albani, Hasyim Asy'ari.
- **Batch 2** — public and political figures (18) + enrich Ahmad Dahlan: Sadat, Farouk, Musharraf, Nawaz Sharif, Malala, Ibn-e-Insha, Junaid Jamshed, Deddy Corbuzier, Erdoğan, Gül, Özal, Kısakürek, Davutoğlu, Erbakan, Yazıcıoğlu, Bahçeli, Erbaş, Emine Erdoğan.
- **Batch 3** — remaining figures (16): Bülent Ersoy, Ebru Gündeş, al-Sharaa, Asma al-Assad, Quwatli, Lamia al-Hariri, Mamlouk, Muallem, Manaf Tlass, Arnous, Mustafa Tlass, Turkmani, Riad al-Asaad, Ayman Hariri, Maher Zain, Abdullah II.
- **Next queue (verification first):** the channel persons of the founder's harvest lists (Abdelkafy, Othman Al-Khamees, Alafasy, Abdul Basit, Qunaibi, Ahmed Elsayed, Mogahed, Hala Samir, Al-Muaiqly, Raad Al-Kurdi, Al-Dosari, Islam Sobhi, Hijab, Ali Dawah, Azhar Idrus, …) — each enters only after the same Wikipedia/Wikidata verification pass. Figures the harvest flags as likely non-Sunni (e.g. Muslim Al-Waeli) are excluded unless the founder directs otherwise.
