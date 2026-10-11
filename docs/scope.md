# Scope note: Sunni Islam is the default and main frame

**Decision (founder, 11 October 2026).** islam.museum researches and presents Islam from the standpoint of Sunni Islam, *Ahl al-Sunna wa'l-Jama'a*: the Qur'an; the Sunna as transmitted in the canonical Sunni hadith collections; the four schools of law (Hanafi, Maliki, Shafi'i, Hanbali); the Ash'ari, Maturidi and Athari creeds; and the Sufi orders within Sunni Islam. When the museum's own voice says "Islam", "Muslims", "the tradition holds" or "scholars agree" without a label, it means this. Research for every entity starts from Sunni sources and Sunni scholarship.

**Other points of view are welcome, and always labelled.** The museum is free to mention any other view: Shia (Twelver, Ismaili, Zaydi), Ibadi, Ahmadiyya, Quranist, the Nation of Islam, academic and non-Muslim perspectives, and anything else the story needs. The one rule is that **a non-Sunni view is named before it is stated**, so a reader never assumes the museum is speaking from it. In prose: "In Twelver Shia tradition, …", "Ismaili sources hold that …", "Historians outside the tradition generally argue …". In data: every `perspectives` entry carries its `tradition`, the Sunni entry comes first and is the default shown, and the UI prints the label of every other entry prominently before its text.

**What this means in practice.**
- The Sunni account is the main text of every page. Other communities' positions appear after it, clearly labelled, never unlabelled and never first.
- Everyone and everything is still covered: Shia, Ibadi and other polities (Fatimids, Buyids, Safavids, Qarmatians, the Imamate of Oman), figures, events (Karbala, Siffin, the founding of Cairo), places, works and `group` entries with `kind: denomination`. They are described factually and respectfully, by their self-designations, with sources, without polemics, slurs or mockery.
- The Figures policy (docs/plan/13) and the Themes atlas (docs/plan/14) keep their full scope: everyone significant, for and against, every theme including sects and splits.
- The welcoming-to-all principle, the descriptive voice and the sensitive-content rules in docs/plan/05 stand unchanged.

**Mechanics.**
- `perspectives[]` holds every view that matters for a topic. Order: `sunni` or `sunni-*` entries first, then `academic`, then any other tradition. The validator requires a Sunni entry whenever the block exists and requires a `tradition` on every entry; it rejects an unlabelled entry and a block whose first entry is not Sunni.
- `schema/enums/traditions.yaml` keeps every value so people, groups and polities can be classified as what they were and so labels are consistent.
- The UI renders the Sunni entry as the main column under the heading "Sunni tradition (the museum's frame)" and each further entry under its own label ("Twelver Shia view", "Academic view", "Ibadi view").
- A prose lint flags sentences that state a non-Sunni doctrine without a preceding label in the same sentence or the one before.

**Where visitors see it.** The About page and *How to read this museum* carry one sentence: "This museum describes Islam from the standpoint of the Sunni tradition. Other views are included and are always labelled as such."
