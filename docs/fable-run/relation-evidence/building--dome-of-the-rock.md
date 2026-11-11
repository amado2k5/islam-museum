# building/dome-of-the-rock

Neighbours before: 1. Relations added: 6.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| located_in -> place/al-aqsa-mosque | «قبة الصخرة بيت مثمّن تعلوه قبة، قائم في صحن [[building/al-aqsa-mosque\|المسجد الأقصى]] في [[place/jerusalem\|القدس]]» <br> «قبة الصخرة في صحن المسجد الأقصى؛ وصفها المقدسي لعين رأت نحو سنة 375هـ» | {cite:ahsan-al-taqasim p. 143} {cite:wikidata} <br> {cite:ahsan-al-taqasim p. 144} | content/ar/building/dome-of-the-rock.md, section «موجز». The prose links `building/al-aqsa-mosque`; `located_in` takes a place, and `place/al-aqsa-mosque` is the record of the same sanctuary as a site, whose own summary says the name covers the whole walled enclosure <br> data/building/dome-of-the-rock.yaml, `summary.ar` |
| commissioned_by -> person/abd-al-malik-ibn-marwan | «ويذكر محمد قباني أن [[person/abd-al-malik-ibn-marwan\|عبد الملك بن مروان]] أمر سنة 72هـ ببناء مسجد فوق الصخرة» | {cite:umayyad-birth-to-fall-2006 p.163} {cite:umayyad-birth-to-fall-2006 p.161} | content/ar/building/dome-of-the-rock.md, section «موجز» |
| written_about_by -> person/al-muqaddasi | «ووصفها [[person/al-muqaddasi\|المقدسي]] في [[work/ahsan-al-taqasim\|أحسن التقاسيم]]، وهو كتاب أتمّه سنة 375هـ» <br> «وصفها المقدسي لما رآها نحو سنة 375هـ.» | {cite:ahsan-al-taqasim p. 12} {cite:ahsan-al-taqasim p. 143} <br> {cite:ahsan-al-taqasim p. 144} | content/ar/building/dome-of-the-rock.md, section «موجز» <br> content/ar/building/dome-of-the-rock.md, section «وصف المقدسي» |
| mentioned_in -> work/ahsan-al-taqasim | «ووصفها [[person/al-muqaddasi\|المقدسي]] في [[work/ahsan-al-taqasim\|أحسن التقاسيم]]، وهو كتاب أتمّه سنة 375هـ» <br> «وصفها المقدسي لما رآها نحو سنة 375هـ.» | {cite:ahsan-al-taqasim p. 12} {cite:ahsan-al-taqasim p. 143} <br> {cite:ahsan-al-taqasim p. 144} | content/ar/building/dome-of-the-rock.md, section «موجز» <br> content/ar/building/dome-of-the-rock.md, section «وصف المقدسي» |
| written_about_by -> person/ibn-fadl-allah-al-umari | «ثم وصف [[person/ibn-fadl-allah-al-umari\|ابن فضل الله العمري]] في [[work/masalik-al-absar\|مسالك الأبصار]] المسجد الأقصى والصخرة على ما استقر عليه البناء إلى سنة 743هـ» <br> «يصف [[person/ibn-fadl-allah-al-umari\|ابن فضل الله العمري]] في [[work/masalik-al-absar\|مسالك الأبصار]] المسجد الأقصى والصخرة «على ما استقر عليه بناؤه إلى سنة ثلاث وأربعين وسبعمائة»» | {cite:umari-masalik-1924 p.177} {cite:umari-masalik-1924 p.178} <br> {cite:umari-masalik-1924 p.177} {cite:umari-masalik-1924 p.178} | content/ar/building/dome-of-the-rock.md, section «موجز» <br> content/ar/building/dome-of-the-rock.md, section «صفتها سنة 743هـ عند العمري» |
| mentioned_in -> work/masalik-al-absar | «ثم وصف [[person/ibn-fadl-allah-al-umari\|ابن فضل الله العمري]] في [[work/masalik-al-absar\|مسالك الأبصار]] المسجد الأقصى والصخرة على ما استقر عليه البناء إلى سنة 743هـ» <br> «يصف [[person/ibn-fadl-allah-al-umari\|ابن فضل الله العمري]] في [[work/masalik-al-absar\|مسالك الأبصار]] المسجد الأقصى والصخرة «على ما استقر عليه بناؤه إلى سنة ثلاث وأربعين وسبعمائة»» | {cite:umari-masalik-1924 p.177} {cite:umari-masalik-1924 p.178} <br> {cite:umari-masalik-1924 p.177} {cite:umari-masalik-1924 p.178} | content/ar/building/dome-of-the-rock.md, section «موجز» <br> content/ar/building/dome-of-the-rock.md, section «صفتها سنة 743هـ عند العمري» |

In the quotations a wikilink's pipe is written `\|` so that the table renders; the record has a plain pipe.

Already in the file before this run: `located_in -> place/jerusalem`, the one neighbour.

The lead section «موجز» was deepened by a prose writer while this run was working. It now names the builder with a citation, which the record did not do when the run began, so `commissioned_by` was added. All quotations were cut from the file as it stood at the end of the run.

Looked for and not found as records: the short book «سلسلة العسجد في صفة الصخرة والمسجد» and its author Taj al-Din Ahmad ibn Amin al-Mulk, from whom al-Umari copies. `grep -rlE "سلسلة العسجد|Silsilat al-.?asjad" data/work` and `grep -rlE "تاج الدين.*أمين الملك" data/person` give nothing.

Could have been added but the record does not cite it: nothing.

Supported by the record and left out: `site_of -> event/isra-and-miraj`. The lead reports, as its source's saying, that the ascent was from the Rock; that is said of the Rock, before the building stood, and is given as one author's statement. `person/ahmad-zaki-pasha`, the editor, of whom the record says «سافر إلى فلسطين ليطبق هذه البيانات على المبنى» at p.10: a visit to check figures, not a written account. `building/al-aqsa-mosque` and `building/al-haram-al-sharif` exist, but no registered predicate links a building to a building.
