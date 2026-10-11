# Scope note: the museum speaks from Sunni Islam

**Decision (founder, 11 October 2026).** islam.museum presents Islam as understood by *Ahl al-Sunna wa'l-Jama'a*: the Qur'an; the Sunna as transmitted in the canonical Sunni hadith collections; the four schools of law (Hanafi, Maliki, Shafi'i, Hanbali); the Ash'ari, Maturidi and Athari creeds; and the Sufi orders within Sunni Islam. When the museum's own voice says "Islam", "Muslims", "the tradition holds" or "scholars agree", it means this.

**What this excludes as a framing.** Shia Islam (Twelver, Ismaili, Zaydi), Ibadi Islam, the Ahmadiyya, Quranists, the Nation of Islam and other groups are **not** presented as parallel framings of Islam. Their doctrines do not appear as equal "perspective" columns, their legal rulings are not the museum's rulings, and their theological claims are not the museum's claims.

**What this does not exclude.** The story of Islam cannot be told without them, so they remain in the museum **as history and as fact**:
- polities (Fatimids, Buyids, Safavids, Qarmatians, the Imamate of Oman), figures, events (Karbala, Siffin, the Fatimid founding of Cairo), places, works and `group` entries with `kind: denomination` are all covered;
- they are described in the docent voice: factually, respectfully, by their self-designations, with sources, without polemics, slurs or mockery;
- where a reader needs it to understand history or a living community, a short labelled note states what that group holds ("Twelver Shia tradition holds that…"), placed beneath the Sunni account, never alongside it as an equal column;
- the Figures policy (docs/plan/13) and the Themes atlas (docs/plan/14) keep their full scope: everyone significant, for and against, every theme including sects and splits.

**Mechanics.**
- `perspectives[]` is for differences **within** Sunni Islam (madhhabs, creeds, Sufi and Salafi currents, reformist and traditional readings) and for the academic or historical view set against the tradition's account. Allowed `tradition` values in `perspectives`: `sunni`, `sunni-*`, `academic`.
- `other_views[]` (same shape as `perspectives`) records the positions of other groups where historically necessary; rendered as a labelled note.
- `schema/enums/traditions.yaml` keeps every value, because people, groups and polities must be classified as what they were.
- The validator rejects a `perspectives` entry whose `tradition` is outside the allowed set and points to `other_views`.
- Existing Phase 1 events that carry Shia entries in `perspectives` (Ghadir Khumm, Saqifa, Karbala when written) move those entries to `other_views`.

**Where visitors see it.** The About page and *How to read this museum* carry one sentence: "This museum describes Islam as understood in the Sunni tradition. Other Muslim communities are part of the story and are described with respect." The welcoming-to-all principle, the neutral descriptive voice and the sensitive-content rules in docs/plan/05 stand unchanged: a visitor from any community should find their community described accurately and never attacked.
