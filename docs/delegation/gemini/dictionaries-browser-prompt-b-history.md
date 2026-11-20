# Gemini prompt B: history and authors of the dictionaries (متصفح المعاجم)

Prepared 20 November 2026 for the Dictionaries Browser («متصفح المعاجم»). It follows two
Gemini rounds whose answers were checked by an agent before use:

1. The catalogue of 50 works (sources, ranked list). The history sections for works 14–50
   were one line each, and the background sources were four modern titles.
2. The gap research (Shamela book IDs, source terms, datasets, APIs, first printings).
   Findings that matter here: no open structured dataset exists; the texts of the
   pre-modern authors are out of copyright, but every digital transcription found carries a
   restriction or none stated; the plan is to key text from pre-1925 printings.

This prompt asks only for what is still missing: depth of history, controversies, the
reception chain, manuscripts, and the authors. It is run once per batch.

Rules for using the answers (`docs/ai-change-gates.md`, `docs/agents/publication-standard.md`):

- Bring each answer back to an agent before anything is written to `data/` or `content/`.
  Every date, page, identifier and quotation is checked against the page it names;
  "UNVERIFIED" items stay unverified.
- A madhhab, school or sect is recorded only with the source that states it.
- Nothing from Gemini enters a record as a quotation of more than 40 words.

## The prompt

Replace the `BATCH` line with one row of the batch table below, then paste into Gemini
(Deep Research mode if available).

```text
This continues research for islam.museum's «متصفح المعاجم» (Dictionaries Browser), an
open, free museum of Islam (prose CC BY-SA 4.0, data CC0). For each work in the BATCH
below, write the full history of the work and of its author. An earlier answer gave one
line for most of these; I need depth. Use live web search and open the pages.

BATCH: [paste one batch here]

Rules:
- Every statement carries its source: a classical work with volume and page where you can
  see it, or a modern study with page, or a URL you opened. No source, no statement.
- Never invent a date, page, quotation, manuscript shelf-mark or edition. Write
  "UNVERIFIED" where you could not see it yourself.
- Dates as Hijri / CE. Where sources disagree on a date, give each with who reports it.
- An author's madhhab, theological school or sect is stated ONLY with the source that says
  so, named. Where sources disagree (e.g. al-Rāghib al-Iṣfahānī, Ibn Manẓūr), report each
  view and who holds it; give no verdict.
- Neutral, descriptive tone. No honorific phrases after names.
- Do not use or cite material from extremist or militant organisations or their media.

FOR EACH WORK
1. Composition: when, where, for whom, how long it took, patron, the author's stated aim
   (from his own مقدمة where there is one — summarise it, cite it).
2. Arrangement and method, and what was new compared with its predecessors.
3. Sources it draws on, and which later dictionaries draw on it.
4. Reception chain, with titles, authors and death dates: abridgements (مختصرات),
   supplements (تكملات، ذيول), corrections and critiques (استدراكات، نقد، حواشٍ),
   commentaries, rearrangements, versifications, and translations into Persian, Turkish,
   Urdu or European languages.
5. Manuscripts: the important surviving copies, the library and shelf-mark, any autograph
   or copy read to the author, with a catalogue reference.
6. Print history: first printing (press, city, year), other notable printings, the
   critical edition scholars use today and its editor, and known faults of each edition.
7. Controversies: disputed authorship, accusations of error, تصحيف or plagiarism, rivalries,
   charges that definitions lean to a theological position, and modern scholarly debate.
   For each: who said it, where, and who answered.

FOR EACH AUTHOR (and each named abridger, commentator and critic, more briefly)
Full name with kunya, laqab and nisba; birth and death dates and places; where he lived,
studied and taught; teachers and students; posts held; travels; other works; notable
episodes; how he died where reported. Identifiers: Wikidata QID, VIAF, and OpenITI author
URI (look in github.com/OpenITI under the death-year folder, e.g. 0711IbnManzur).

WHERE TO READ MORE
For each author, cite the entry (volume and page) in as many of these as you can open:
إنباه الرواة للقفطي، معجم الأدباء لياقوت، وفيات الأعيان، سير أعلام النبلاء، بغية الوعاة
للسيوطي، البلغة للفيروزآبادي، نزهة الألباء، طبقات النحويين واللغويين للزبيدي، المزهر
للسيوطي، كشف الظنون، الأعلام للزركلي; and in Brockelmann GAL, Sezgin GAS vol. 8,
Encyclopaedia of Islam (2nd/3rd ed.), Encyclopaedia Iranica, TDV İslâm Ansiklopedisi
(islamansiklopedisi.org.tr — open access, link the article), حسين نصار «المعجم العربي»,
Haywood, and Baalbaki. Say which of these are free to read online and give the link.

OUTPUT
One section per work with the seven headings above, then one per author. End with a
"Could not verify" list and a "Sources disagree" list. If too long, stop at a clean
boundary and tell me to say "continue"; do not shorten to fit.
```

## Batches

Run in this order: the ten recommended imports come first.

| # | `BATCH` line |
|---|---|
| 1 | لسان العرب، القاموس المحيط، الصحاح، تاج العروس، مختار الصحاح |
| 2 | كتاب العين، تهذيب اللغة، جمهرة اللغة، معجم مقاييس اللغة، مجمل اللغة |
| 3 | أساس البلاغة، المفردات في غريب القرآن، النهاية في غريب الحديث والأثر، المصباح المنير، Lane's Arabic-English Lexicon |
| 4 | المحكم والمحيط الأعظم، المخصص، العباب الزاخر، التكملة والذيل والصلة، محيط المحيط |
| 5 | معجم البلدان، معجم ما استعجم، التعريفات، الكليات، كشاف اصطلاحات الفنون، دستور العلماء، مفاتيح العلوم |
| 6 | عمدة الحفاظ، الفائق في غريب الحديث، غريب الحديث لأبي عبيد، المغرب في ترتيب المعرب، طلبة الطلبة، تحرير ألفاظ التنبيه، الزاهر في غريب ألفاظ الشافعي |
| 7 | فقه اللغة وسر العربية، الفروق اللغوية، المعرب للجواليقي، شفاء الغليل، الاشتقاق، ديوان الأدب، درة الغواص، مجمع الأمثال |

Modern and in-copyright works (المعجم الوسيط، المعجم الكبير، معجم متن اللغة، معجم اللغة
العربية المعاصرة، Doha, Sharjah, Hans Wehr) are not in these batches: the museum can
describe them but not host them, so their history is a later, smaller run.

## Status

| Batch | Sent | Answer received | Checked by an agent |
|---|---|---|---|
| 1–7 | no | no | no |
