# Proposal: extremism firewall (audit and rule)

Status: **proposed, awaiting the founder's written approval** (`docs/ai-change-gates.md` §1).
Date: 7 November 2026. Author: Claude (claude-sonnet-5-5), Claude Code desktop.
Risk label: **non-impacting** for this document and the audit. The enforcement steps in §4 are labelled where they could touch a filed submission.

> **Founder decision, 7 November 2026 (section 3.1): exclude all mention** of the listed organisations, not only their sources and voice. The file-by-file dry run is `docs/delegation/extremism-firewall-manifest.md`. Execution waits for the founder's go on that list (removals are submission-impacting).

## 1. What was asked

The founder pasted a brief asking every agent to (a) audit existing and incoming content, URLs and citations for links to modern terrorist organisations and their propaganda wings, (b) flag modern extremist vocabulary and framing applied to classical history, (c) halt and warn on a violation, and (d) rewrite tainted-source topics from an academic, art-historical or archaeological angle. It listed two blacklists: designated organisations (ISIS and affiliates, Al-Qaeda and affiliates, Levantine, South Asian and other regional groups) and their media wings (Amaq, Al-Hayat, Al-Furqan, Al-I'tisam, Naba, Dabiq, Rumiyah, As-Sahab, Al-Malahem, Al-Andalus, Al-Kataib, Az-Zallaqa, Inspire, Al-Manar, Al-Aqsa TV).

## 2. Audit result (read-only, nothing edited)

Searched `data/`, `content/`, `schema/`, `scripts/`, `site/src/` with word boundaries, case-sensitive for acronyms.

| Check | Result |
|---|---|
| **Sources published by a listed propaganda outlet** (`data/source/`, publisher, URL, title) | **None.** The only name matches are Arabic words ("hayat" = life, "i'tisam" = adherence) in book titles. |
| **Any cited Dabiq, Rumiyah, Inspire, Amaq or Naba issue as a source** | None. Dabiq appears once, as the magazine that named three living scholars as apostates, in `content/en/person/yasir-qadhi.md`. That is the museum recording a threat against a scholar, not citing the magazine as authority. |
| **Entities about a listed organisation** (a `group/` or `polity/` page for ISIS, Hamas, Taliban and so on) | **None exist.** |
| Acronym hits (ISIS, ISIL, AQAP) | 40 matches in 32 files. Every one is a person biography, a film or series card, or a draft event card describing the group as the adversary or the event's context. |
| Name hits (Taliban 103, Hamas 45, Al-Qaeda 27, Nusra 17, Hezbollah 4, Daesh 3, Boko Haram 3) | Same pattern: biographies of scholars, politicians and victims, plus Wikipedia pointer sources. |
| Arabic hits (داعش 52, جبهة النصرة 16, حزب الله 12, تنظيم القاعدة 7) | Same pattern. |
| **False positives to whitelist** | *Marj Dabiq* (the 1516 battle and place, `event/marj-dabiq-922`, `place/marj-dabiq`). *Tafsir al-Manar* (Rashid Rida's commentary, `work/tafsir-al-manar`). *Hudayr al-Kata'ib* (a Companion of the Ansar). *al-Shabab* meaning "youth", and Al-Shabab the Saudi football club. *Hamas* inside *Ibn Hamas*. |

Conclusion: there is no propaganda-sourced or group-authored content in the repository today. The exposure is in framing and in scope, not in sources.

## 3. Items that need a founder decision

These are not edited. Each is a judgment about scope, not a defect.

1. **The brief says content "related to" the listed groups is "completely excluded".** Read literally it would remove biographies of people who fought, survived or condemned these groups (Ahmad Shah Massoud, Yasir Qadhi, Omar Suleiman, Ali Gomaa, Amr Khaled, Ilwad Elman, King Abdullah II, Benazir Bhutto) and the films about them (*Al-Dawla*, *Four Daughters*, *Al-Halibah*). It conflicts with the museum's rule that opponents, critics and victims are included, and with the standing rule that every exclusion is held for the founder. **Recommendation:** keep the firewall on *source and voice* (the museum never cites, quotes, links or adopts the language of these groups) and keep neutral, attributed, cited mention of them as context. Please confirm or choose the literal reading.
2. **Entities that sit nearest the line**, for a read by the founder: `person/ahmed-al-sharaa` (founder of Jabhat al-Nusra, later HTS, now Syria's president); `person/eyad-qunaibi` (the page records his praise for al-Nusra); `person/sayyid-qutb` (influence on armed groups; already framed with attributed views); `person/yusuf-al-qaradawi` (Hamas-adjacent statements); `person/riad-al-asaad`.
3. **13 draft event cards** about the Syrian and Iraqi wars and Lebanon (for example `battle-of-al-qaryatayn-2015`, `deir-ez-zor-offensive-2014`, `operation-density-2006`, `ansariya-ambush-1997`). All say "its sources are not yet checked". They name a group as a party to a battle. Decide whether modern-war cards belong in the museum at all, and if so require sources before publication.
4. **One organisation outside the brief's lists but worth the same check:** *Labbaik Media Cell* (media cell of Tehreek-e-Labbaik Pakistan, added in wave 194, 6 November 2026). The party has been banned and unbanned by the Pakistani state; the page should record that with a source, whatever the founder decides.

## 4. Proposed enforcement (needs approval before any of it is built)

| Step | Files | Label |
|---|---|---|
| A. Add a **Content safety** rule to `AGENTS.md` and §6 of `docs/ai-change-gates.md`: never cite, link, quote or adopt the phrasing of a listed group or media wing; mention them only as cited, attributed context; strip extremist framing from tainted sources and rewrite academically. | `AGENTS.md`, `docs/ai-change-gates.md` | non-impacting |
| B. Add the two lists as data, `schema/enums/extremist-media.yaml` (organisations, aliases in Arabic and Latin, media wings), kept out of prose so the rule is editable without code changes. | `schema/enums/` | non-impacting |
| C. Add a validator check in `scripts/validate.ts`: **error** if any `data/source/*` publisher, title or URL matches a listed media wing or organisation as publisher; **warning** (not error) when a listed organisation is named in a person or event body without a `{cite:}` in the same paragraph; an allowlist for Marj Dabiq, Tafsir al-Manar, Hudayr al-Kata'ib. | `scripts/validate.ts`, test | non-impacting (validator behaviour only; no count or licence changes) |
| D. Add the same check to the harvest and enrichment intake (`scripts/harvest/`) so a scraped page from a listed outlet is rejected before it becomes a source. | `scripts/harvest/*` | non-impacting; separate proposal because the harvest lane is another agent's area |
| E. A vocabulary lint for the *Dabiq/Inspire* register (takfir labels applied to named Muslims in the museum's voice, "enemy of Islam" and equivalents, "caliphate" used as a present-tense political claim). Existing rule already bans "enemy of Islam"; this extends it as a warning. | `scripts/validate.ts` | non-impacting |

Not proposed: deleting any entity, or changing counts or classes. If the founder chooses the literal reading in §3.1, removals are `submission-impacting` (§3 of the change gates) and would update the claims register in the same commit.

## 5. How to approve

Reply in chat with one of: **A** (rule only), **A+B+C** (rule, data, validator), **all** (A to E, D as its own later proposal), or changes. The decision on §3.1 comes first because it fixes what step C checks.
