# Delegation: Prophetic-era people (for Devin)

_Created 11 October 2026. Paste the prompt below into Devin, working from its own clone of the repository. Tracking: see "Parallel work" in `docs/status.md`. Work arrives as pull requests from branches named `devin/people-batch-*`; nothing is pushed to main directly._

**Ownership split (so no work is repeated):** Devin owns `data/person/**` (new files only), the Prophetic-era `data/group/**`, its own `data/source/**` additions, `content/*/person/**` for its people, and `data/_stubs.d/devin-people.yaml`. The maintainer's session owns schema, scripts, site, i18n, events, places, periods, maps, the Qur'an records and the local harvest.

---

```
You are contributing content to islam.museum, an open, free, all-digital museum of Islam, built as a knowledge graph in git. Work ONLY in your own clone of the repository (github.com/amado2k5/islam-museum). Never push to main. Work on branches named devin/people-batch-NN and open one pull request per batch.

YOUR TASK: author the "Prophetic-era people" lane: person entities (and a few group entities) for the people around the Prophet Muhammad, on every side of the story, as DRAFT content with real, verifiable sources. This is Phase 1 of docs/plan/06-roadmap.md, with the significance rule of docs/plan/13-figures.md.

READ FIRST (in the repo, in this order)
00. docs/collaboration.md (NEW): never ignore, discard or revert another session's work; before every batch and every push, fetch origin/main, read what is new, and merge it with yours. Duplicates are merged (keep the richer entity, alias the other, carry over sources), never deleted. Also docs/language.md (Arabic first) which postdates this prompt: write Arabic label/summary/prose first; English is optional.
0. docs/scope.md (NEW, decided 11 Oct 2026): Sunni Islam is the museum's default and main frame; every other view is welcome and must be labelled before it is stated
1. CLAUDE.md (non-negotiable rules)
2. docs/status.md (project state)
3. docs/plan/13-figures.md (sections 1, 2, 3, 5: the significance rule, story_roles, faith, labelled, editorial rules)
4. docs/plan/05-editorial.md (voice, perspectives, sourcing, sensitive content)
5. docs/plan/02-content-model.md sections 1-9 (data model, dates, perspectives)
6. Example files: data/person/ibn-sina.yaml, data/person/abu-bakr.yaml (perspectives + story_roles), data/person/ali-ibn-abi-talib.yaml, data/event/ghadir-khumm.yaml, content/en/person/ibn-sina.md, content/ar/person/ibn-sina.md
7. templates/person.yaml and templates/person.md, docs/style-guide.md

SETUP
npm install
npm run validate        # must print 0 errors before you start and before every commit
npm test                # must stay green
(Optional: npm install --prefix site && npm run build to see pages; it takes under a minute. Use your own ports and folders. Do not touch ~/islam-museum-harvest, any .venv-* folder, any tmux session, or port 4321: those belong to someone else's machine.)

WHAT TO CREATE, IN THIS ORDER (batches of AT MOST 25 entities each, one PR per batch)
Batch A, the Prophet's family and household: Khadija bint Khuwaylid, Aisha, Fatima, Hasan, Husayn, Zaynab bint Ali, Hamza ibn Abd al-Muttalib, Abbas ibn Abd al-Muttalib, Abu Talib, Halima al-Sa'diyya, Zayd ibn Haritha, Umm Salama, Hafsa, Safiyya bint Huyayy, Abd al-Muttalib, Umm Ayman.
Batch B, Companions: Umar ibn al-Khattab, Uthman ibn Affan, Bilal ibn Rabah, Salman al-Farisi, Abu Dharr al-Ghifari, Khalid ibn al-Walid, Sa'd ibn Abi Waqqas, Abu Hurayra, Abdullah ibn Abbas, Abdullah ibn Mas'ud, Mu'adh ibn Jabal, Nusayba bint Ka'b (Umm Umara), Sumayya bint Khayyat, Ja'far ibn Abi Talib, Abu Ubayda ibn al-Jarrah, Amr ibn al-As, Zayd ibn Thabit, Mus'ab ibn Umayr.
Batch C, the world Islam was born into and the Meccan opposition: Waraqa ibn Nawfal, Zayd ibn Amr (the hanifs), Abraha, the Negus of Aksum, Heraclius, Khosrow II, Abu Jahl, Abu Lahab, Umm Jamil, Umayya ibn Khalaf, Uqba ibn Abi Mu'ayt, al-Walid ibn al-Mughira, al-Nadr ibn al-Harith, Utba ibn Rabi'a.
Batch D, opponents who became Muslims, protectors, and Medina's allies and rivals: Abu Sufyan ibn Harb, Hind bint Utba, Ikrima ibn Abi Jahl, Suhayl ibn Amr, Wahshi ibn Harb, Safwan ibn Umayya, Mut'im ibn Adi, Abdullah ibn Ubayy, Ka'b ibn al-Ashraf, Abdullah ibn Salam, Malik ibn Awf al-Nasri.
Batch E, rival claimants and the Ridda: Musaylima, Sajah, Tulayha, al-Aswad al-Ansi.
Batch F, groups (data/group): Quraysh, the early Muslim community (early-muslims), Banu Hashim, Ansar, Muhajirun, Ahl al-Bayt, Hawazin, Thaqif, the Jewish communities of Khaybar (jews-of-khaybar), Banu Qaynuqa, Banu Nadir, Banu Qurayza.
Do NOT create or edit: person/muhammad, person/abu-bakr, person/ali-ibn-abi-talib, person/ibn-sina (they exist; leave them alone). Skip anyone you cannot source properly; say so in the PR.

EXACT SLUGS ALREADY REFERENCED BY EXISTING EVENTS (use these ids so links resolve): person/khadija, person/abu-talib, person/hamza, person/abu-jahl, person/abu-sufyan-ibn-harb, person/khalid-ibn-al-walid, person/malik-ibn-awf, group/quraysh, group/early-muslims, group/jews-of-khaybar, group/hawazin, group/thaqif. When you create one of these, delete its line from data/_stubs.yaml (delete lines only; never reformat that file). Other slugs: ASCII lowercase hyphenated from the common English transliteration (person/umar-ibn-al-khattab, person/uthman-ibn-affan, person/bilal-ibn-rabah ...). Check data/ and data/_stubs.yaml for an existing slug before choosing.

HOW EACH PERSON ENTITY MUST LOOK (copy the structure of data/person/abu-bakr.yaml)
- id, class: person, label {en, ar} (Arabic name exact), summary {en, ar} (one sentence each; Arabic must be correct, natural Arabic; if unsure, leave ar out and the validator will warn rather than guessing)
- gender; born/died with EDTF, calendar julian, precision, status (scriptural|tradition|historical|debated|legend), sources. Add hijri ONLY where a source gives it (the validator rejects CE/Hijri pairs more than ~2 years apart). NEVER invent a date: use "~" (approximate) or "?" or a decade and say so in note.
- roles, traditions, periods: [period/prophetic-era] (or period/rashidun etc. as fits), regions, wings: [people], themes (from schema/enums/themes.yaml)
- story_roles[]: time-scoped, sourced, from schema/enums/story-roles.yaml. For opponents/persecutors: record the documented act and dates; role "opponent"/"persecutor" only where sources document it; add later roles when they changed sides (convert, protector...).
- faith[]: with basis (tradition/documented/debated); never inferred from name or family.
- labelled[]: epithets given by others, each with its owner (who said it) and sources.
- relations[] using ONLY predicates in schema/predicates.yaml (born_in, died_in, buried_in, lived_in, child_of, spouse_of, sibling_of, member_of, participated_in, fought, protected, persecuted, allied_with, convert...). Targets must exist in data/ or be declared as stubs (see below). Event targets that already exist: event/hijra, event/battle-of-badr, event/battle-of-uhud, event/battle-of-the-trench, event/treaty-of-hudaybiyya, event/battle-of-khaybar, event/conquest-of-mecca, event/battle-of-hunayn, event/expedition-to-tabuk, event/farewell-pilgrimage, event/ghadir-khumm, event/saqifa, event/death-of-the-prophet, event/pledges-of-aqaba, event/first-migration-to-abyssinia, event/first-revelation, event/year-of-sorrow, event/boycott-of-banu-hashim, event/marriage-to-khadija. Place ids that exist: place/mecca, medina, taif, badr, uhud, khaybar, tabuk, hudaybiyya, ghadir-khumm, aksum, jerusalem. Use participated_in (person -> event); do NOT edit the event files.
- perspectives[]: whenever the person or their role is contested, and ALWAYS for: Abu Talib, Umar, Uthman, Aisha, Fatima, Abu Sufyan, Abu Hurayra, Khalid ibn al-Walid, the succession figures, Abdullah ibn Ubayy. SCOPE RULE (docs/scope.md, enforced by the validator): the FIRST entry must be tradition sunni (or sunni-hanafi/-maliki/-shafii/-hanbali where the schools differ), then academic, then any other view (shia-twelver, shia-ismaili, shia-zaydi, ibadi, ahmadiyya...). Every entry carries its tradition label; each is cited. The Sunni entry is the main text. Present other views accurately and respectfully, by their own self-designations, never as the museum's voice. In prose, name the community before stating its doctrine ("In Twelver Shia tradition, ...", "Ismaili sources hold that ..."), never the reverse.
- sources: at least TWO independent real sources per entity; the validator requires source ids that exist in data/source/. External_ids (wikidata QID, viaf...) only if you verified them on wikidata.org; otherwise omit.
- status: { review: draft, completeness: 1-3, generated_by: "Devin; <date>" }. Always draft. NEVER set reviewed or verified.
- sensitivity: none, or as policy requires. Never any figurative depiction of prophets.
For the 12-15 most important people per batch also write prose: content/en/person/<slug>.md and content/ar/person/<slug>.md with headings Brief, Life, Legacy (and a :::perspectives block where contested), using [[class/slug]] links and {cite:source-slug p.N} citations that resolve to existing sources. Others get the YAML only.

SOURCES (data/source/*.yaml, class: source)
Use real, checkable scholarship and verify every bibliographic detail on the web (publisher record, library catalogue, WorldCat/Google Books/JSTOR). Good sources: Ibn Ishaq/Guillaume (exists: source/ibn-ishaq-guillaume), Watt (source/watt-1953-mecca, source/watt-1956-medina), Lings (source/lings-1983); add e.g. Ibn Sa'd (Kitab al-Tabaqat al-Kabir, English translation by Bewley), al-Tabari's History (SUNY translation, specific volumes), Encyclopaedia of Islam (EI2/EI3) and Encyclopaedia Iranica entries, Cambridge History of Islam, Oxford Islamic Studies Online, M. Hinds/Donner on early Islam, Hawting, Crone. Wikipedia and Wikidata are POINTERS to find sources, never citations. If you cannot find two real sources for a fact, leave the fact out or flag it as debated; never fabricate a citation, page number, ISBN or date. Before creating a source file, check data/source/ for an existing one and reuse it. If two branches create the same source slug, keep main's version when you rebase.

HARD RULES (from CLAUDE.md and docs/plan/05 and 13)
- Research starts from Sunni sources and Sunni scholarship (e.g. Ibn Sa'd, al-Tabari, al-Dhahabi's Siyar, Ibn Hajar's al-Isaba, the canonical hadith collections, EI2/EI3), then academic scholarship, then other communities' sources. Without a label, "Islam", "Muslims", "the tradition holds" and "scholars agree" mean the Sunni position.
- Voice: warm, precise, neutral docent. Describe, never prescribe. No honorifics typed into prose or labels (no "peace be upon him", "radiyallahu anhu", no "ﷺ"): the UI renders them from data.
- Significance, not sympathy: opponents, critics and allies are included. Describe the act and attribute the judgement. NEVER write "enemy of Islam" or any equivalent in the museum's own voice (record such epithets only in labelled[] with their owner). Roles are time-scoped.
- Never infer anyone's religion from a name or family. Only dead people in this task (Prophetic era), so no living-person issues.
- Never write, quote from memory, complete or correct Qur'an text. If you need to point to the Qur'an, use a reference such as passage/quran-33-6 (these records exist: passage/quran-<sura>-<ayah>) in relations (revealed_about / mentioned_in); do not retype verses.
- Arabic and English are both first-class. Arabic must be accurate; do not machine-translate carelessly.
- No images, no AI-generated portraits.

DO NOT TOUCH (other work is happening there in parallel): schema/, scripts/, site/, i18n/, docs/plan/, .github/, geo/, data/event/, data/place/, data/period/, data/screen/, data/work/quran*, data/passage/, templates/, package*.json, any existing file you did not create (except deleting your own entities' lines from data/_stubs.yaml). If you need a schema change, a new predicate, a new enum value or a new role, do NOT make it: write docs/requests/devin-<topic>.md describing exactly what you need and why, use the closest existing option meanwhile, and mention it in the PR.
If your entities reference targets that do not exist yet (e.g. a place or person outside your lists), declare them in YOUR OWN file data/_stubs.d/devin-people.yaml (format: - { id: person/slug, label: { en: "Name" } }), never in data/_stubs.yaml.

WORKFLOW PER BATCH
1. git fetch origin && git checkout -b devin/people-batch-A origin/main
2. Create the files. Prefer YAML flow style like the existing examples.
3. npm run validate  -> 0 errors (warnings about missing Arabic or sources must be reduced to the minimum; explain each remaining one in the PR). npm test -> green.
4. git pull --rebase origin main before opening the PR.
5. Commit with a conventional message: "content: people batch A (<n> entities, draft)". Open a PR into main. The PR body must list: entities added; sources added (with the URL you verified each on); any fact you were unsure about; any request files; any stub you resolved.
6. Start the next batch from a fresh branch off origin/main. Do not wait for merge if the next batch does not depend on the previous one.

DEFINITION OF DONE
Batches A-F merged or open as PRs; npm run validate shows 0 errors on every branch; every entity has >= 2 verified real sources, en label/summary and ar label/summary, correct story_roles with dates marked approximate where the sources are, perspectives where contested, status draft; PR descriptions are honest about uncertainty. Report back with a short summary: counts per batch, anything skipped and why, requests filed.
```
