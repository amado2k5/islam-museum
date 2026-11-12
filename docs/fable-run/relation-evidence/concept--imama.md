# concept/imama

Neighbours before: 0. Relations added: 4.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| influenced -> group/imamiyya | «الإمامة، كما يعرضها أحمد أمين في ضحى الإسلام، أهم مسألة يدور عليها كلام الإمامية. فهي مركز بحوثهم، وإليها ترجع أكثر المسائل الفرعية، وحولها يدور أكثر الخلاف بينهم وبين أهل السنة.» and «يصف أحمد أمين الإمامة بأنها الملوّن لعقيدة الإمامية.» | {cite:duha-islam p.850} on both | content/ar/concept/imama.md, sections «موجز» and «الرأي الأكاديمي» |
| mentioned_in -> work/al-kafi | «ويصف الكافي الإمامة بأنها «منزلة الأنبياء وإرث الأوصياء، خلافة الله وخلافة الرسول».» Also: «هذا العرض من كتاب الكافي للكليني كما ينقله أحمد أمين ... يذكر الكافي أن للإمام صلة روحية بالله من جنس صلة الأنبياء والرسل.» | {cite:duha-islam p.850-852} | content/ar/concept/imama.md, section «الإمامية الاثنا عشرية» |
| mentioned_in -> work/duha-al-islam | «الإمامة، كما يعرضها أحمد أمين في ضحى الإسلام، أهم مسألة يدور عليها كلام الإمامية.» | {cite:duha-islam p.850} | content/ar/concept/imama.md, section «موجز» |
| written_about_by -> person/ahmad-amin | «يصف أحمد أمين الإمامة بأنها الملوّن لعقيدة الإمامية.» | {cite:duha-islam p.850} | content/ar/concept/imama.md, section «الرأي الأكاديمي» |

How the targets were identified:

- group/imamiyya is labelled «الإمامية» and cites the same pages of the same book.
- work/al-kafi is «الكافي في علم الدين لمحمد بن يعقوب الكليني» (not the two other works named al-Kafi in `data/work/`).
- work/duha-al-islam is «ضحى الإسلام لأحمد أمين»; person/ahmad-amin already writes `authored -> work/duha-al-islam`.

`written_about_by` is the inverse name of `wrote_about` (person to any class); `mentioned_in` is the inverse name of `mentions` (work to concept).

Looked for and not found as records:
- «أهل السنة» as a group: `ls data/group | grep -iE "ahl-al-sunna|sunni"` gives nothing.

Could have been added but the record does not state it in a form a registered predicate carries:
- person/al-kulayni. The prose names him only as the author of al-Kafi ⁦(«كتاب الكافي للكليني»)⁩; he is one step away through work/al-kafi.
- concept/umma, concept/consultation-shura, concept/shura-in-islam. The Sunni position «يجعلون الإمامة مفوضة إلى اختيار الأمة وشوراها» {cite:duha-islam p.850} is one tradition's view held in the `perspectives` block; no registered predicate says "entrusted to the choice of", and a plain edge would state it as the museum's own.
