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
- **Ten more places have prose in Arabic, English and Urdu (Lane B1, packet 9).** Shaizar, Djerba, Turbessel and Asilah carry a Pleiades section (title, number, class, span of years, recorded names, description); Urmia, Gelibolu, İskenderun, Philadelphia, Berkeley, Asilah and Berat carry an iDAI.gazetteer section (class, parent, names, linked identifiers). Urmia is also told from Yaqut al-Hamawi's entry in the Mu'jam al-buldan (vol. 1, scan pp. 206 to 207: its distance from the lake, the claim that it was Zoroaster's city, Yaqut's visit in 617 AH, its distances from Tabriz and Irbil) and İskenderun from his entry on Iskandaruna (vol. 1, scan p. 238). All draft, every sentence cited.
- **Sirat al-Hadi ila al-Haqq, printed pages 120 to 129 (batch 16).** Nine new event records (more wine-penalty reports; retaliation for a slave's blows and an extra lash; al-Hadi's gatherings; his admonition on intention and self-training; the people of al-A'sum and Bayt Yathi'; the peace between Banu Rabi'a and Khirfan and al-Subay'; the Najran governor's letter and the meeting at Iyan; the reconciling of Khawlan and Banu Salman at Madhab with the cloud report; Ibn Bustam's safe-conduct and the arrival at Sa'da), three person records and six place records, each in Arabic, English and Urdu, all draft with provenance; the work record gains one section and the ledger a new resume point.
- **Canon of Medicine, Fann 2 chapters 15 to 18 (scan pp. 131 to 140): twenty-three concept records in Arabic, English and Urdu.** How food and drink act on the body by quality, element and whole substance; potential heat and cold; the four degrees of drugs; the classes of food, drug and poison; fine and coarse foods and good and bad chyme; water in the body, the best springs and running waters, signs and weighing of good water, boiling and purifying, rain, wells and standing waters and their diseases, snow, mineral waters and water as a drink; retention and evacuation; and the causes that are neither necessary nor harmful, acting by contact or ingestion. Each is cited to the printed volume and page, draft with provenance.
