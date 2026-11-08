# Canon batch 01 — agent-prepared authenticity proposals

Status: **proposal, with founder** (`[~]` in `docs/coverage-programme/phase-02-queue.md`).
Authority: **the founder already decided `accept` for all 25 batch-01 books on 31 Oct 2026** (`docs/coverage-programme/phase-02-batch01-evidence.md`) — but the register's evidence bar (two school sources + named edition + basis) was unmet, so no entries were written. This proposal supplies that missing evidence under the dec-133 delegation (agent-prepared, founder approves the batch). **Reconciliation rule:** where the founder's accept-all stands and evidence now verifies Sunni school, the entry is `accept`; where the gate's own rules force otherwise (non-Sunni or unverified school — `accept` requires `school: sunni`), the entry becomes `label` — a mechanical gate conversion, not a re-decision, and the founder may override at approval. Process per dec-133: founder approves the batch, then entries are written (`decided_by: founder`).

Prepared: 2026-11-08 by devin-swe2. **Audit revision 2026-11-08:** corrected after independent second-opinion review (Muse) — Isfahani school evidence was inverted (C1), Ibn Arabi recommendation strengthened to label/other (H2), Sarraj/Mubarak reason texts corrected (M6). **Two disclosures the founder must weigh (H1/M7):** (a) every accept rests on ONE T4 infobox while policy §8 asks for two independent sources — the register header claims a "one school source is enough, founder ruling 31 Oct 2026" that has no record in the repo; confirm that ruling or supply second sources. (b) 13 of 16 accepts lack a complete named_edition — approval should be minuted as "school decisions approved, conditional on edition completion" since the validator cannot write accepts until editions are named. Evidence gathered 8 Nov 2026 from English Wikipedia article infoboxes/wikitext (T4 reference) and archive.org item metadata for the harvested carriers (T3/T4). Nothing below is invented: where evidence is missing it says so.

## How to read this

- **Two different kinds of evidence, kept separate.** `authenticity_basis` (why the work is genuine) for these pre-print books rests on **manuscript tradition and institutional holdings** — the harvested carriers are library scans (Bibliotheca Alexandrina `AAlexandrina-*`/`BBib-Alex-*`, named digital-edition uploads). `named_edition` (`publisher_any` + `editor_any`) is only the **harvest-matching rule** — it names the modern print/tahqiq edition the fetcher should prefer; it is not proof the work is authentic. Older books need no publisher to be authentic.
- **accept** candidates still need a complete `named_edition` before they can be written to the register — the validator requires both fields for every accept, even manuscript-based ones. Where edition evidence is missing it says "edition TBD"; a policy question about whether institutional provenance should satisfy accept without a print edition is recorded in the decision inbox (`docs/decisions/inbox/canon-accept-manuscript-basis.yaml`).
- **label** proposals carry `school: unverified` where Wikipedia states no denomination — the conservative reading of "doubt defaults to unknown".
- Three books (`diwan-ibn-arabi`, `diwan-mutanabbi`, `jawab-sahih-ibn-taymiyya`) have **no harvested copy** (no manifest entry). Work-level decisions are still possible (precedent: sunan-abi-dawud was decided on the catalogue record before any copy), but there is nothing to admit yet.

## Proposed decisions

### accept (school: sunni, evidence verified)

| id | author | school evidence (en.wikipedia.org infobox) | authenticity basis (manuscript/institutional) | harvest carriers | named-edition evidence (modern tahqiq/print) |
|---|---|---|---|---|---|
| adab-katib-ibn-qutayba | Ibn Qutayba (d.276) | Islam / Sunni / Athari | pre-print work; library scans | AAlexandrina-196408, AAlexandrina-195125 | publisher TBD |
| diwan-ibn-arabi | Ibn Arabi (d.638) | Islam / Sunni per infobox BUT infobox creed is "Founder of Akbarism" — his own school, not an attested Sunni creed; writings on the Twelve Imams "popularly received among Shia"; no copy held, attribution debated (audit H2). **Recommend `label`/`other` or hold pending second source + real manuscript basis** — founder decides at approval. | pre-print work; no copy held | none held | edition TBD; no copy |
| hikam-ibn-ataillah | Ibn Ata'illah (d.709) | Islam / Sunni / Maliki / Ashari (article: Ibn Ata Allah al-Iskandari) | pre-print work; library scans | AAlexandrina-095550, Library.mmn_20150920 | publisher TBD |
| ihya-ulum-din | al-Ghazali (d.505) | Islam / Sunni / Shafi'i / Ashari | pre-print work; library scans | aheaa-olom, phptop_gmail, AAlexandrina-000467 (publisher دار الشعب), AAlexandrina-019110 | publisher دار الشعب on one scan; reference edition TBD |
| kashf-mahjub-hujwiri | Ali Hujwiri (d.465) | religion "Sunni Islam" / Sunni / Hanafi (article resolves via Data Ganj Bakhsh → Ali al-Hujwiri) | pre-print work; library scans | ar117myst27, elshandawily519 (uploader الشندويلي) | edition TBD |
| aqida-wasitiyya | Ibn Taymiyya (d.728) | Islam / Sunni / Hanbali / Athari / Tariqa Qadiri | pre-print work; library scans | 4 scans (alfirdwsiy*, 20201231…) | edition TBD |
| aqidat-tahawiyya | al-Tahawi (d.321) | Islam / Sunni / Hanafi (formerly Shafi'i) | pre-print work; library scans | incl. `1995-alaqidah_altahawiya-altahawi` | publisher دار ابن حزم, 1995 confirmed in item metadata; editor TBD |
| daraa-taarud | Ibn Taymiyya | as above | pre-print work; library scans | alhelawy04, elshandawily10410, 1_2026* | edition TBD |
| farq-bayn-firaq-baghdadi | Abd al-Qahir al-Baghdadi (d.429) | Islam / Sunni / Shafi'i / Ashari (article resolves → Abu Mansur al-Baghdadi) | pre-print work; library scans | AAlexandrina-155048, 1492Pdf_201812 | edition TBD |
| fisal-ibn-hazm | Ibn Hazm (d.456) | Islam / Sunni / Zahiri / Independent | pre-print work; library scans | 5 AAlexandrina scans + 20211016 | edition TBD |
| ighathat-lahfan | Ibn al-Qayyim (d.751) | Islam / Sunni / Hanbali / Athari (article: Ibn Qayyim al-Jawziyya) | pre-print work; library scans | iqhatha_lahfane_Ibn_Qaem + 3 | edition TBD |
| ilam-muwaqqiin | Ibn al-Qayyim | as above | pre-print work; library scans | 20250113…, ILMULMUWEQQIN…, pipou92… | edition TBD |
| kitab-iman-ibn-taymiyya | Ibn Taymiyya | as above | pre-print work; library scans | belief_202412, BBib-Alex-10598/10596 | edition TBD |
| lumat-itiqad | Ibn Qudama (d.620) | Islam / Sunni / Hanbali / Athari (article: Ibn Qudama) | pre-print work; library scans | lm3t2 description names editor "ت إسماعيل الجزائري" (Ismail al-Jaza'iri) + 3 | editor الجزائري/al-Jaza'iri named in item description; publisher TBD |
| madarij-salikin | Ibn al-Qayyim | as above | pre-print work; library scans | madsal + 3 | edition TBD |
| jawab-sahih-ibn-taymiyya | Ibn Taymiyya | as above | pre-print work; **no copy held** | none held | edition TBD; no copy |
| risalat-qushayri | al-Qushayri (d.465) | Islam / Sunni / Shafi'i / Ashari | pre-print work; library scans | Library.mmn_20160412, rquchairya | edition TBD (31-Oct evidence: Arabic editor not found) |
| tabaqat-sufiyya-sulami | al-Sulami (d.412) | Islam / Sunni / Shafi'i / Ashari | pre-print work; library scans | BBib-Alex-17435, TabakatSufiya | 31-Oct evidence: Dar al-Kitab al-Arabi 1953 / Maktabat al-Khanji 1986, ed. Nur al-Din Shurayba |
| zuhd-ahmad | Ahmad ibn Hanbal (d.241) | Islam / Sunni / eponym of Hanbali / Athari | pre-print work; library scans | 4 scans (20260306…, 880Pdf, alfirdwsiy…) | 31-Oct evidence: Sharaf 1981 (Penn record) |

### label (school: unverified — admitted, shown "school not verified")

| id | author | why unverified |
|---|---|---|
| aghani-isfahani | Abu al-Faraj al-Isfahani (d.356) | **CORRECTED (audit C1):** scholarly sources describe him as Shi'i/Zaydi-leaning — EI3 (Guenther 2007): "he was a Zaydī Shī'ī"; Britannica: "a Shi'i Muslim"; Iranica treats his Shi'ite leanings as the contention point (some Sunni writers deny them). Wikipedia infobox carries no religion field. → `label`, `school: shia` with the contest stated, or `unverified` if founder prefers — NEVER `sunni`. |
| bayan-tabyin-jahiz | al-Jahiz (d.255/869) | Infobox states **Mu'tazila** (sourced to Encyclopædia Britannica). → `label`, `school: mutazili`, school_evidence = article URL. (He is a complex case — 9th-century litterateur associated with Mu'tazili circles (d. 255 AH/869 CE — before the Buyid takeover of Baghdad, 945); founder may prefer `other`.) |
| diwan-mutanabbi | al-Mutanabbi (d.354) | Poet; infobox has no religion field, body has no school mentions. → `label`, `school: unverified`. No copy held. |
| luma-sarraj | Abu Nasr al-Sarraj (d.378) | Article "Abu Nasr as-Sarraj" has no denomination field; 2 incidental "Sunni" mentions — too thin. Article lead attests "a Sunni sheikh and ascetic" (corrected per audit M6 — my earlier "2 incidental mentions" under-described it). Still one T4 source → `label`, `school: unverified` stands under §8. Edition note: item `al-luma_fit_tasawwuf` description names "ت نيكلسون" (tahqiq Nicholson — Reynold A. Nicholson's edition). |
| maqamat-hariri | al-Harith ibn Hammam al-Hariri (d.516) | Article "Al-Hariri of Basra" (c.1054–1122 = same man) carries no religion fields. → `label`, `school: unverified`. |
| zuhd-ibn-mubarak | Ibn al-Mubarak (d.181) | Infobox `denomination` empty; body places him in Hanafi literature and "Formation of Sunni Schools" context — circumstantial, not a stated school. Article lead attests "traditionalist Sunni Muslim scholar and Hanafi jurist" (corrected per audit M6). Still one T4 source → `label`, `school: unverified` stands under §8; one more independent source would allow accept. (Item `zhdrqmobarak` names editor "ت الأعظمي".) |

## Edition evidence carried forward from the 31-Oct search (`phase-02-batch01-evidence.md`)

The earlier search already named editions for most books — publisher/editor pairs now available for `named_edition` completion: Ibn Arabi critical text ed. al-Mansub (Ninawa, Damascus 2021); Mutanabbi Dar al-Arqam 2015 / Dar al-Kitab al-Arabi 2010 ed. al-Baqai; Hujwiri Nicholson Gibb Memorial (Luzac 1911); Sarraj Nicholson (Brill/Luzac 1914); Ihya Dar Sadir reprint ed. Qal'aji (2000); Fisal Nasr & Umayra, Dar al-Jil 1996; Ilam al-Muwaqqi'in ed. Abd al-Mu'ti Amin Qal'aji (Cairo 1955); Ighathat Dar al-Kutub al-Ilmiyya ed. Ali al-Halabi; Baghdadi ed. Abd al-Mu'ti al-Najjar?/Subayh (Cairo c.1964, Dar al-Talai 2005); Tahawiyya Dar al-Beiruti ed. Shannar / Zam-Zam 2023. These are catalogue-level findings — archive.org metadata matching is still needed before `named_edition` can be written.

## Notes for the founder

1. **al-Jahiz** is the only non-Sunni/school-declared case in the batch — everything else is either verified Sunni or honestly `unverified`.
2. **Ibn Arabi**: the infobox says Sunni, but his school is genuinely contested in scholarship (proponents and critics disagree). If the founder wants the label visible anyway, downgrade to `label`/`other` — the evidence field can carry the debate.
3. **Edition work remaining**: `accept` entries need `named_edition` completed for harvest matching — this is mechanical lookup work (archive.org/WorldCat per book), not a decision. Confirmed so far: دار ابن حزم (Tahawiyya), دار الشعب scan (one Ihya copy — not necessarily the reference edition), editors نيكلسون (Sarraj), الجزائري (Lumat al-I'tiqad), الأعظمي (Ibn al-Mubarak). For pre-print books the *authenticity* basis is manuscript/institutional; the named edition only steers future downloads.
4. **No-copy books** (ibn-arabi, mutanabbi, jawab-sahih): work-level decisions are fine, but nothing enters the collection until a copy is located and checked.
5. This batch covers adab-zuhd + aqeedah only, per queue order (harvest folder, then id). Batches 02+ follow the same procedure.
