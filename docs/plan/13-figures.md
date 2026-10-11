# 13 · Figures — everyone who mattered to the story, for it and against it

> **Scope note.** The museum speaks from Sunni Islam (Ahl al-Sunna wa'l-Jama'a). Other Muslim communities are covered as history and fact, described with respect, but not presented as parallel framings of Islam. The full rule is in [`docs/scope.md`](../scope.md).

The People wing so far is built around the faithful: prophets, family, Companions, scholars, rulers, scientists, poets. This document widens it to **every person of significance to the story of Islam, anywhere, at any time, in any role**: those who carried it, those who fought it, those who protected it without sharing it, those who left it, those who studied it from outside, those who attacked it in print, and those who changed sides. A museum that shows only the admired half of the cast cannot explain the story.

## 1. The rule: significance, not sympathy

A person belongs in the museum when reliable sources document that they **changed, shaped, opposed, protected, recorded or interpreted** the story of Islam or of Muslims. Belief is not the test, and neither is our approval.

Three commitments follow:

1. **The museum has no heroes and no villains in its own voice.** It never writes "enemy of Islam" or "defender of the faith" as its own judgement. It records what a person did, who called them what, and when, each with a source.
2. **"For" and "against" are roles in time, not labels on a person.** Umar ibn al-Khattab opposed the early Muslims and then became the second caliph. Khalid ibn al-Walid commanded the Meccan cavalry at Uhud and later the Muslim armies. Hulagu destroyed Baghdad in 1258; his great-grandson Ghazan became Muslim in 1295. A fixed label would be wrong for all of them.
3. **Every side gets the same care.** An opponent's page has the same anatomy, the same sourcing rule and the same depth dial as a scholar's. A critic's argument is stated as its holder would state it, then the responses are stated the same way.

## 2. Data model

No new class. Two additions to `person` (and to `group` and `polity`, which play the same roles), and a handful of predicates.

### 2.1 `story_roles[]` — what part they played, when, toward whom

```yaml
id: person/umar-ibn-al-khattab
story_roles:
  - { role: opponent, toward: group/early-muslims, start: { edtf: "0613~" }, end: { edtf: "0616~" },
      status: tradition, sources: [source/ibn-ishaq-guillaume] }
  - { role: convert, start: { edtf: "0616~" }, status: tradition, sources: [...] }
  - { role: companion, start: { edtf: "0616~" } }
  - { role: ruler, toward: polity/rashidun-caliphate, start: { edtf: "0634" }, end: { edtf: "0644" } }
```

Role vocabulary (`schema/enums/story-roles.yaml`), grouped for the People hall:

| Family | Roles |
|---|---|
| **Carriers** | `prophet-figure` (Qur'anic) · `family-of-the-prophet` · `companion` · `successor` · `scholar` · `jurist` · `transmitter` · `preacher` · `saint` (as venerated by a named tradition) · `reformer` · `revivalist` · `founder` (of a school, order, movement, institution) · `missionary` |
| **Power** | `ruler` · `commander` · `official` · `patron` · `legislator` (laws that shaped Muslim life) · `colonial-administrator` · `resistance-leader` |
| **Opposition** | `opponent` (political or social) · `military-opponent` · `persecutor` (documented acts against Muslims as Muslims) · `rival-claimant` (to prophethood, the caliphate, the imamate, mahdi-ship) · `rebel` |
| **Protection and friendship** | `protector` · `ally` · `host` (gave refuge) · `interlocutor` (received an embassy or letter, debated, negotiated) · `collaborator` (worked alongside across faiths: translators, physicians, ministers) |
| **Crossing** | `convert` (to Islam) · `left-islam` (self-declared, or recorded by sources for the dead) · `changed-sides` (derived when opposition and carrying roles follow each other) |
| **The pen** | `critic` · `polemicist` · `apologist` · `orientalist-scholar` · `historian` · `translator` (of the Qur'an or major texts) · `traveller-observer` · `journalist` · `artist-on-islam` (wrote, painted, filmed it) |
| **Knowledge and culture** | `scientist` · `physician` · `philosopher` · `poet` · `artist` · `architect` · `traveller` · `merchant` |
| **Victims and witnesses** | `martyr` (as regarded by a named tradition) · `victim` · `witness` |

Every role is **time-scoped, sourced, and may carry a `perspective`**. Where traditions disagree about the role itself, both are stored: Abu Talib is `protector` in all accounts, while whether he died a Muslim is recorded as a `debated` claim with Sunni and Shia perspectives.

A derived, read-only **stance lens** is computed for browsing: `carried` · `opposed` · `protected` · `changed` · `observed from outside` · `contested`. It is a filter, never text on the page.

### 2.2 `faith[]` — religious identity as documented, never inferred

```yaml
faith:
  - { value: arabian-polytheism, basis: tradition, end: { edtf: "0616~" } }
  - { value: sunni, basis: tradition, start: { edtf: "0616~" } }     # later sectarian labels applied with care
```

`basis ∈ {self-identified, documented, tradition, debated, unknown}`. Values extend the traditions enum with `christian` (and its churches), `jewish`, `zoroastrian`, `hindu`, `buddhist`, `sabian`, `manichaean`, `arabian-polytheism`, `hanif`, `deist`, `atheist-or-sceptic`, `other`, `unknown`. For **living people** only `self-identified` is accepted, and silence is recorded as `unknown`. A name, a birthplace or a family is never evidence of belief.

### 2.3 Predicates added

`fought`/`fought_by` (domain person, group, polity; time-scoped; linked to the `event`) · `allied_with` (symmetric) · `protected`/`protected_by` · `persecuted`/`persecuted_by` · `debated_with` (symmetric) · `corresponded_with` (symmetric) · `critic_of`/`criticised_by` (target may be a person, work, concept or group) · `responded_to`/`answered_by` (work to work, for refutations and replies) · `wrote_about`/`subject_of` · `condemned`/`condemned_by` (formal acts: fatwa, council, court, with the document as source) · `converted_under`/`received_conversion_of` · `ruled_over`/`ruled_by` for non-Muslim rulers of Muslim populations, and the reverse.

`opposed`/`opposed_by` (already in v0.1) stays for general opposition; the new ones are precise.

### 2.4 Labels given by others

```yaml
labelled:
  - { label: { ar: "عدو الله", en: "enemy of God" }, by: "early sira tradition", sources: [...], status: tradition }
  - { label: { en: "Sword of God", ar: "سيف الله" }, by: person/muhammad, status: tradition, sources: [...] }
```

Honorific and hostile epithets are data with an owner. The UI shows them under "How others named them", attributed.

## 3. Who this adds: lanes and seed figures

The existing 150 (`06-roadmap.md`) stay. These lanes add roughly **250 seed figures**; every name below is a candidate that passes through the pipeline and its two-source rule before it is published. Lanes are for coverage planning; a person sits in as many as their roles place them.

**The world Islam was born into** — Abraha · Waraqa ibn Nawfal · Bahira (as tradition) · Zayd ibn Amr and the hanifs · Quss ibn Sa'ida · Heraclius · Khosrow II · the Negus of Aksum · al-Muqawqis · Abd al-Muttalib

**The Meccan opposition** — Abu Jahl · Abu Lahab and Umm Jamil · Umayya ibn Khalaf · Uqba ibn Abi Mu'ayt · al-Walid ibn al-Mughira · al-Nadr ibn al-Harith · Utba ibn Rabi'a

**Opponents who became Muslims** — Abu Sufyan · Hind bint Utba · Khalid ibn al-Walid · Amr ibn al-As · Ikrima ibn Abi Jahl · Suhayl ibn Amr · Wahshi ibn Harb · Safwan ibn Umayya

**Protectors and friends outside the community** — Abu Talib (perspectives) · Mut'im ibn Adi · the Negus · Mukhayriq · the Christian delegation of Najran (as interlocutors)

**Medina: allies, rivals, defectors** — Abdullah ibn Ubayy · Ka'b ibn al-Ashraf · Huyayy ibn Akhtab · Abdullah ibn Salam · Safiyya bint Huyayy (already in the spine)

**Rival claimants and the Ridda** — Musaylima · Sajah · Tulayha (who later returned to Islam) · al-Aswad al-Ansi

**Every side of the first civil wars** (perspectives mandatory) — Talha · al-Zubayr · Mu'awiya · Amr ibn al-As · Abu Musa al-Ash'ari · Ibn Muljam · Yazid I · Ubayd Allah ibn Ziyad · Umar ibn Sa'd · al-Hurr ibn Yazid · Abd Allah ibn al-Zubayr · al-Hajjaj ibn Yusuf · al-Mukhtar

**Sceptics and freethinkers within Islamic civilisation** — Ibn al-Rawandi · Abu Bakr al-Razi (as critic of prophecy, per the reports about him) · al-Ma'arri · Ibn al-Muqaffa'

**Non-Muslims who built the civilisation** — Hunayn ibn Ishaq · the Bukhtishu physicians · Thabit ibn Qurra · Yuhanna ibn Masawayh · Hasdai ibn Shaprut · Samuel ibn Naghrillah · Maimonides · Raja Todar Mal and Man Singh at Akbar's court

**Byzantium, Latin Christendom, the Crusades** — John of Damascus · Theophanes · Charles Martel · Charlemagne (and his embassy with Harun al-Rashid) · Pope Urban II · Peter the Venerable and Robert of Ketton (the first Latin Qur'an, 1143) · Godfrey of Bouillon · Baldwin IV · Reynald of Châtillon · Richard I · Frederick II · Francis of Assisi (his meeting with al-Kamil) · Louis IX · Ramon Llull · Thomas Aquinas · Riccoldo da Monte di Croce · Dante · Nicholas of Cusa

**The Mongols** — Genghis Khan · Hulagu · Kitbuqa · Doquz Khatun · Berke (the first Mongol ruler to become Muslim) · Ghazan · Öljeitü · Timur (perspectives)

**Iberia and the Reconquista** — Rodrigo Díaz (El Cid) · Alfonso VI · Ferdinand III · Isabella and Ferdinand · Cardinal Cisneros · Hernando de Talavera · Philip III (expulsion of the Moriscos, 1609) · Boabdil (Muhammad XII)

**Early modern encounters** — Vasco da Gama · Afonso de Albuquerque · Martin Luther (on the Turks; his preface to the 1543 Basel Qur'an) · Elizabeth I (correspondence with Murad III and Ahmad al-Mansur) · Shivaji · Guru Nanak and the Sikh Gurus in Mughal India (perspectives) · Sabbatai Zevi

**Enlightenment and Romantic Europe** — George Sale · Voltaire · Edward Gibbon · Goethe · Napoleon in Egypt · Thomas Carlyle · Lamartine · Washington Irving · Thomas Jefferson (his Qur'an) · Richard Burton · Johann Burckhardt

**Scholars from outside** (orientalists and historians, with the critiques of them) — Silvestre de Sacy · Gustav Weil · William Muir · Theodor Nöldeke · Ignaz Goldziher · Christiaan Snouck Hurgronje · Louis Massignon · H. A. R. Gibb · Joseph Schacht · W. Montgomery Watt · Annemarie Schimmel · Marshall Hodgson · Bernard Lewis · John Wansbrough · Patricia Crone · Edward Said (as critic of the field)

**Colonial rule and those who resisted it** — Lord Cromer · Hubert Lyautey · T. E. Lawrence · Mark Sykes and François Georges-Picot · Arthur Balfour · Gertrude Bell · Aleksey Yermolov · alongside Abd al-Qadir al-Jaza'iri (in the spine) · Imam Shamil · Omar Mukhtar · Muhammad Ahmad (the Mahdi of Sudan) · Sayyid Mohammed Abdullah Hassan · Abd el-Krim · Diponegoro · Tipu Sultan

**Friends and allies in modern times** — Mahatma Gandhi (the Khilafat movement) · Leo Tolstoy (his correspondence on Islam) · others as sources establish

**Converts** (self-identified or documented) — Marmaduke Pickthall · Muhammad Asad · Abdullah Quilliam · Isabelle Eberhardt · René Guénon · Martin Lings · Malcolm X and Muhammad Ali (in the spine) · Yusuf Islam · Kareem Abdul-Jabbar · Murad Hofmann · Maryam Jameelah

**People who left Islam, and modern critics** (living-person rules; self-description only) — a small, carefully sourced set, each with their own stated position and the principal responses: for example Ayaan Hirsi Ali · Ibn Warraq (a pen name) · Taslima Nasrin · and authors of works that drew condemnation, recorded by the act and its reception rather than by a stance we assign: Salman Rushdie and *The Satanic Verses* (1988), with the 1989 fatwa and the responses to it from all sides

**Anti-Muslim politics and polemic, past and present** — recorded as documented public positions and acts: Geert Wilders (*Fitna*) · Oriana Fallaci · Theo van Gogh · and the movements and laws involved, as `group` and `event` entities

**Persecution and mass violence against Muslims** — recorded first as **events** with victims at the centre, with the responsible people and bodies named where courts or scholarship have established responsibility: the expulsions from Iberia · the Russian conquest of the Caucasus and the Circassian expulsion · the 1944 deportations of Chechens, Ingush and Crimean Tatars · the Bosnian genocide (ICTY judgments: Radovan Karadžić, Ratko Mladić) · the Rohingya crisis · the treatment of Uyghurs (perspectives, with sources named) · the Christchurch attack of 2019 (perpetrator minimised: see §5)

**Violence in the name of Islam, and the Muslim responses** — Juhayman al-Otaybi (1979) · Osama bin Laden · Abu Bakr al-Baghdadi · covered soberly under the Today wing's rules, never from their own material, each paired with the scholarly refutations (the Amman Message, the 2014 Open Letter to al-Baghdadi) and with their Muslim victims

**Other lanes to fill by the same method** — Jews of Muslim lands · Eastern Christian leaders under Muslim rule (patriarchs, catholicoi) · Zoroastrian, Hindu, Buddhist and Sikh counterparts · African kings who resisted or adopted Islam · Chinese emperors and officials in relation to Muslims · American and European politicians whose decisions shaped Muslim lives · journalists and film-makers who shaped the image of Islam (linked to `12-screen-index.md`)

## 4. Finding everyone: discovery method

Names from memory are a start, not a method. The harvest (`15-local-harvest.md`) finds figures by structure:

1. **From the museum's own events.** Every `event` has participants on every side. A battle without its opposing commander is incomplete, so the validator warns when a conflict event names only one side.
2. **From the polities.** Every state that fought, allied with, ruled or was ruled by a Muslim polity yields its rulers and commanders for the period of contact.
3. **From the works.** Every author of a significant work about Islam, for or against, in any language: translations of the Qur'an, polemics, refutations, travelogues, histories. Wikidata lists about 2,000 items with Islam as their main subject; their authors are candidates.
4. **From the biographical dictionaries.** The classical *tabaqat* literature names opponents, rivals and interlocutors alongside the scholars; OpenITI makes it searchable.
5. **From the grid.** The period × region coverage grid of `09-ai-content-pipeline.md` §3 gains a rule: each cell needs figures in at least four role families, including opposition and outside observers, before it counts as covered.
6. **From the Screen index and the Themes atlas.** A film's subject, a conference's convener, a law's author.
7. **Importance score** as in `09` §3 (sitelinks, scholarly reference works, graph demand, search demand), so significance is measured the same way for a caliph and for a critic.

## 5. Editorial rules for this wider cast

These extend `05-editorial.md`.

- **Describe the act, attribute the judgement.** "Abu Lahab opposed his nephew's preaching and is condemned by name in the Qur'an (surah 111)" states a role and a scriptural fact. "Abu Lahab was evil" is not museum prose.
- **State the strongest version of each side.** A critic's argument is summarised so that the critic would recognise it; the responses are summarised so that their authors would. The page links both to their sources. The museum does not referee.
- **Do not reproduce abuse.** Polemic is described and cited, not quoted at length. Slurs, caricatures of the Prophet and hate imagery are never displayed; where such an item is historically important it is described in words.
- **Perpetrators of recent mass violence get a minimal record.** Name, date, the act, the court outcome. No portrait, no manifesto, no biography that could serve as publicity. The event page is about the victims and the response.
- **Living people:** only public, sourced facts; their stance only in their own words or by formal public acts; no speculation about belief; correction and removal channel; two reviewers.
- **Leaving and entering Islam** are recorded only from the person's own statements, or for historical figures from the sources, with the calendar date and without commentary.
- **Sectarian opponents are not "enemies".** Figures who fought other Muslims are presented through the Sunni account with the academic view in `perspectives`, and the other community's view of them in `other_views`. The same person may be a `rebel` in the Sunni account and a `saint` to another community, and the page shows both, labelled.
- **Outside scholars** are presented with their contribution and with the critiques made of them, including the critique of orientalism and the replies to it.
- **Honorifics and curses** from the tradition are rendered only by the honorifics toggle from data, attributed, and never typed into prose.
- **Kid mode** shows opposition figures in plain, unfrightening language and hides `violence` and `contested` content.

## 6. How it appears

- **"Place in the story" panel** on every person, group and polity page: their roles as chips with dates, each linked to the events that justify it.
- **"Stance over time" strip** under the life dates: a single line that changes colour as roles change, so Umar, Khalid, Berke's house and Malcolm X can be read at a glance.
- **People hall facets:** *Carriers* · *Opponents and critics* · *Protectors and allies* · *Changed sides* · *Rival claimants* · *Observers and scholars from outside* · *Non-Muslims in the story* (already planned, now populated) · filters by faith (as documented), era, region, role.
- **Both sides of every event:** conflict and debate pages list participants by side with equal weight; treaties show the signatories of each party.
- **Debates as pairs:** a critic's work and its refutations are linked with `responded_to`, and rendered as a thread through time, for example the long exchange from John of Damascus through Riccoldo and Luther's edition to the modern period, with Muslim replies alongside.
- **Network hall:** an "encounters" layer of `debated_with`, `corresponded_with`, `allied_with` and `fought` edges across faith lines.
- **Path finder** now crosses the line: "connect Maimonides to Saladin", "connect Frederick II to al-Kamil".

## 7. Roadmap

- **Phase 0:** `story_roles`, `faith`, `labelled` in the person, group and polity schemas; the role enum; the new predicates; the one-sided-conflict warning in the validator.
- **Phase 1 (with the spine):** the Prophetic-era cast complete on all sides (about 60 additional figures), so every one of the 90 sira events names its participants; plus 40 from later lanes. **+100 figures**, bringing the spine to 250 people.
- **Phase 2:** the remaining lanes of §3 to 250 additional figures; "Stance over time" strip; People hall facets; encounters layer.
- **Phase 3–4:** authors of the polemical and apologetic literature with their works linked; outside scholars with bibliographies; non-Muslim communities under Muslim rule.
- **Ongoing:** the four-role-family rule on the coverage grid; structured discovery from events, polities and works.

## 8. Risks

| Risk | Mitigation |
|---|---|
| The museum is accused of honouring enemies or of smearing critics | The charter principle of significance, not sympathy, stated on "How to read this museum"; identical page anatomy for all; attribution of every judgement |
| Labelling a living person's belief or hostility | Self-identification only; formal public acts only; Tier A review; removal channel |
| Becoming a platform for hate or for extremist notoriety | Describe, do not reproduce; minimal-record rule; no media from violent groups |
| Sectarian dispute over who was right in the civil wars | Roles carry the Sunni account and the academic view in perspectives; other communities' views in a labelled other_views note; no polemic |
| Binary "with/against" thinking flattens the story | Roles are plural and time-scoped; the stance lens is derived and never printed |
| Endless scope | Importance score; lanes with counts; coverage rule per grid cell |
| Defamation | Facts with sources; court findings cited as such; prompt correction |

## 9. Acceptance tests

1. `person/umar-ibn-al-khattab` shows an opposition role ending and a Companion role beginning around 616, each sourced; the stance strip changes once.
2. `event/battle-of-uhud` lists commanders on both sides; removing one side triggers the validator warning.
3. `person/abu-talib` shows `protector` in all perspectives and a `debated` claim about his faith with the Sunni and academic columns and a Twelver Shia other-views note.
4. A living critic's page contains no faith value other than a cited self-description, and fails validation if `basis` is anything else.
5. A polemical work and three refutations render as one dated thread via `responded_to`.
6. The People hall filter "Changed sides" returns Khalid ibn al-Walid, Abu Sufyan and Ghazan.
7. No page contains "enemy of Islam" or an equivalent outside an attributed `labelled` entry (lint).
8. The page for a perpetrator of a recent mass attack has no image and no body text beyond the minimal record.
