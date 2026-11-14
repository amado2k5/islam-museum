# Canary — islam.museum release notes

The museum's public release notes: every change that lands on `main`, recorded in
reader's language in the same commit that makes the change. Newest release first.
The site build reads the version and date from the top block below and shows them
in the footer of every page and on the changelog page (`/{lang}/changelog/`).

Rules for every agent and contributor (`docs/engineering/15-release-notes-and-versioning.md`):
append your entry under the current version block, grouped by kind — Added, Changed,
Fixed, Removed, Performance, Tests, Data, Breaking, Rolled back. Write what changed
and why it matters, never a bare commit message. If your change bumps the version,
open a new block on top with the new version and today's date.

---

## v1.30.1 — 2026-11-14
### Changed
- **The museum's block on terrorist-organisation content now covers the last seven designated names in full.** On the founder's ruling, Ansarallah (the Houthis), Iran's Islamic Revolutionary Guard Corps, Ansar Dine, Hizb ut-Tahrir, Ansar al-Islam and the Sudanese Muslim Brotherhood are now caught by the build's extremism check, under a complete ban: no propaganda material about them, in support of them or from them anywhere in the museum, in existing records or in future ones. Every existing record was audited mention by mention before the check was widened, and none contains any such material; the neutral historical mentions that remain (a corps commander's biography, a Nobel laureate's exile, a film that condemns the group it depicts) are recorded as the founder's exceptions, and two unrelated bodies that share a name — a Malian Sufi movement and a Nigerian society — are protected as non-matches. The content-safety rule now also lists where each of the seven classifications comes from, with the official designation lists' addresses. One name, Al-Andalus Media, is designated and banned in full, but its automatic check awaits the founder's ruling on a single ambiguous company name in one existing record.
### Data
- **Canon of Medicine, Fann 2 Ta'lim 2 part 2, chapters 19 to 29 (scan pp. 147 to 153): twenty-one concept records in Arabic, English and Urdu.** The causes of pain in general and Ibn Sina's reading of Galen on separation of continuity, active and passive qualities, the fifteen named kinds of pain and the cause of each, the causes of the ease of pain, what pain brings about, the causes of pleasure, how motion, corrupt humours and winds cause pain, indigestion and repletion, and the weakness of the organs by its seats, by evacuation and by sympathy. Drafts with a provenance block, cited to printed pages of the Dar al-Kutub al-Ilmiyya edition. Chapter 27 is only a cross-reference and has no record; garbled OCR lines on pp. 150 to 152 were left out. Ta'lim 3 begins on p. 154.
- **Two more places have prose in Arabic, English and Urdu (Lane B1, packet 16).** Al-Rastan and Irbid are described from the German Archaeological Institute's iDAI.gazetteer record (number, preferred name, type, other names and cross-links). No Yaqut entry exists for either in volumes 1 and 2; all drafts.
