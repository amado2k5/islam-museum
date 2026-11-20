/**
 * Harvest the passages that name an obligation (individual or communal), an act of obedience,
 * a recommended, a disliked or a permitted act, or the minor sins, from books already OCR'd on
 * the harvest drive (Apple Vision text in <book>/<scan>/pages.json) into data/passage/, for the
 * Rulings Browser (docs/plan/73-ahkam-browser.md): the books of usul al-fiqh that define the
 * degrees (al-Risala, al-Burhan, al-Mustasfa, al-Muwafaqat, Irshad al-Fuhul), the books of
 * fiqh, the hadith commentaries, the seerah, the biographies and reports of the Companions and
 * the Successors, the books of renunciation, and the histories. No PDF, OCR text or page image
 * enters git — only an excerpt of at most 40 words per page, cited to the work and the scan
 * page (docs/sources-policy.md).
 *
 * A page is a candidate when the browser's own detector (scripts/ahkam.ts) fires on a 40-word
 * window of it with a strong signal of a theme other than «المحرمات» (those pages were excerpted
 * for the Halal and Haram Browser); the densest pages of each book are kept, up to the book's
 * cap, never two neighbouring pages. Qur'an text is never typed: a window is skipped when it
 * carries a quotation marker or shares any four consecutive words with a verse. Windows the OCR
 * garbled are skipped too, and so are windows with an honorific formula the cleaner cannot cut,
 * and pages another harvest already excerpted. A book whose work or source record is missing is
 * skipped, so a book harvested later is added by one line in BOOKS.
 *
 * Usage: npx tsx scripts/harvest-ahkam-ocr.ts <harvest books dir> [--dry] [--only <prefix>]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ahkamFold, ahkamHitsOfText, AHKAM_TOPICS } from "./ahkam.js";
import { AHKAM_ANCHOR, BROWSER_NAME, clean, five, HONORIFIC_LEFT, q, SAYS, uniq } from "./ahkam-harvest-lib.js";

const ROOT = process.argv[2];
const DRY = process.argv.includes("--dry");
const ONLY = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const OUT_DIR = "data/passage";
if (!ROOT || ROOT.startsWith("--")) throw new Error("usage: harvest-ahkam-ocr.ts <books dir> [--dry] [--only <prefix>]");

/** `scan` limits a book to one scan folder when the source record describes one volume only. */
interface Book { dir: string; scan?: string; prefix: string; work: string; source: string; ar: string; en: string; ur: string; cap: number }
const BOOKS: Book[] = [
  { dir: "usul/risala-shafii", scan: "noor-book.com-2_20240118", prefix: "risala-shafii", work: "work/al-risala-shafii", source: "source/risala-shafii", ar: "الرسالة للشافعي", en: "al-Shafi'i's al-Risala", ur: "الرسالہ، شافعی", cap: 80 },
  { dir: "usul/mustasfa", scan: "1_20200201_20200201_1051", prefix: "mustasfa-v1", work: "work/al-mustasfa", source: "source/mustasfa-hafiz-v1", ar: "المستصفى للغزالي، الجزء الأول", en: "al-Ghazali's al-Mustasfa, vol. 1", ur: "المستصفیٰ، غزالی، جلد 1", cap: 80 },
  { dir: "usul/mustasfa-ghazali", scan: "AAlexandrina-187868", prefix: "mustasfa-tijariyya", work: "work/al-mustasfa", source: "source/mustasfa-tijariyya-1356-v1", ar: "المستصفى للغزالي، طبعة التجارية", en: "al-Ghazali's al-Mustasfa, the Tijariyya printing", ur: "المستصفیٰ، غزالی، طبع تجاریہ", cap: 50 },
  { dir: "usul/irshad-fuhul", scan: "AAlexandrina-106570", prefix: "irshad-fuhul", work: "work/irshad-al-fuhul", source: "source/irshad-al-fuhul-dar-al-fikr", ar: "إرشاد الفحول للشوكاني", en: "al-Shawkani's Irshad al-Fuhul", ur: "ارشاد الفحول، شوکانی", cap: 60 },
  { dir: "usul/burhan-juwayni", scan: "Pdf0881", prefix: "burhan-juwayni", work: "work/al-burhan-fi-usul-al-fiqh", source: "source/burhan-juwayni-mostafa", ar: "البرهان للجويني", en: "al-Juwayni's al-Burhan", ur: "البرہان، جوینی", cap: 60 },
  { dir: "fiqh/umm-shafii", scan: "AloumShafiee", prefix: "umm-shafii", work: "work/kitab-al-umm", source: "source/kitab-al-umm-wafa-v8", ar: "الأم للشافعي", en: "al-Shafi'i's al-Umm", ur: "الام، شافعی", cap: 40 },
  { dir: "fiqh/majmu-nawawi", scan: "BBib-Alex-09307", prefix: "majmu-nawawi", work: "work/al-majmu-sharh-al-muhadhdhab", source: "source/majmu-irshad-v8", ar: "المجموع للنووي", en: "al-Nawawi's al-Majmu'", ur: "المجموع، نووی", cap: 40 },
  { dir: "fiqh/hidaya-marghinani", scan: "20260610_20260610_0648", prefix: "hidaya", work: "work/al-hidayah-marghinani", source: "source/hidaya-bakdash-v1", ar: "الهداية للمرغيناني", en: "al-Marghinani's al-Hidaya", ur: "ہدایہ، مرغینانی", cap: 40 },
  { dir: "fiqh/badai-sanai", scan: "hanafi_01_20150718", prefix: "badai-sanai", work: "work/badai-al-sanai", source: "source/badai-sanai-ilmiyya-v1", ar: "بدائع الصنائع للكاساني", en: "al-Kasani's Bada'i' al-Sana'i'", ur: "بدائع الصنائع، کاسانی", cap: 40 },
  { dir: "fiqh/muhalla", scan: "mohalafsm-01", prefix: "muhalla-v1", work: "work/al-muhalla-ibn-hazm", source: "source/muhalla-dar-ibn-hazm-2016-v1", ar: "المحلى لابن حزم، الجزء الأول", en: "Ibn Hazm's al-Muhalla, vol. 1", ur: "المحلیٰ، ابن حزم، جلد 1", cap: 40 },
  { dir: "adab-zuhd/ihya-ulum-din", prefix: "ihya", work: "work/ihya-ulum-al-din", source: "source/ihya-shamela-dar-al-marifa", ar: "إحياء علوم الدين للغزالي", en: "al-Ghazali's Ihya' 'Ulum al-Din", ur: "احیاء علوم الدین، غزالی", cap: 15 },
  { dir: "adab-zuhd/zuhd-ahmad", prefix: "zuhd-ahmad", work: "work/kitab-al-zuhd-ahmad-ibn-hanbal", source: "source/zuhd-ahmad-dkim-1983", ar: "الزهد لأحمد بن حنبل", en: "Ahmad ibn Hanbal's Kitab al-Zuhd", ur: "کتاب الزہد، احمد بن حنبل", cap: 15 },
  { dir: "adab-zuhd/zuhd-ibn-mubarak", prefix: "zuhd-ibn-mubarak", work: "work/kitab-al-zuhd-ibn-al-mubarak", source: "source/zuhd-ibn-mubarak-azami-scan", ar: "الزهد لابن المبارك", en: "Ibn al-Mubarak's Kitab al-Zuhd", ur: "کتاب الزہد، ابن المبارک", cap: 15 },
  { dir: "aqeedah/kitab-iman-ibn-taymiyya", prefix: "kitab-iman-ibn-taymiyya", work: "work/kitab-al-iman-ibn-taymiyya", source: "source/kitab-iman-ibn-taymiyya", ar: "كتاب الإيمان لابن تيمية", en: "Ibn Taymiyya's Kitab al-Iman", ur: "کتاب الایمان، ابن تیمیہ", cap: 10 },
  { dir: "aqeedah/sharh-tahawiyya", prefix: "sharh-tahawiyya", work: "work/sharh-aqida-tahawiyya", source: "source/sharh-tahawiyya-ibn-abi-al-izz", ar: "شرح العقيدة الطحاوية لابن أبي العز", en: "Ibn Abi al-'Izz's commentary on the Tahawi creed", ur: "شرح عقیدہ طحاویہ، ابن ابی العز", cap: 10 },
  { dir: "fiqh/bidayat-mujtahid", prefix: "bidayat-mujtahid", work: "work/bidayat-al-mujtahid", source: "source/bidaya-bakri-bayt-al-afkar", ar: "بداية المجتهد لابن رشد", en: "Ibn Rushd's Bidayat al-Mujtahid", ur: "بدایۃ المجتہد، ابن رشد", cap: 25 },
  { dir: "fiqh/fiqh-mawsua-noor-doc", prefix: "mawsua-fiqhiyya", work: "work/al-mawsua-al-fiqhiyya-al-kuwaitiyya", source: "source/fiqh-mawsua-noor-doc", ar: "الموسوعة الفقهية الكويتية", en: "the Kuwaiti Encyclopaedia of Fiqh", ur: "موسوعہ فقہیہ کویتیہ", cap: 25 },
  { dir: "fiqh/fiqh-sunna", prefix: "fiqh-sunna", work: "work/fiqh-al-sunnah-sabiq", source: "source/sabiq-fiqh-al-sunnah", ar: "فقه السنة لسيد سابق", en: "Sayyid Sabiq's Fiqh al-Sunna", ur: "فقہ السنہ، سید سابق", cap: 25 },
  { dir: "fiqh/mudawwana", prefix: "mudawwana", work: "work/al-mudawwana-al-kubra", source: "source/al-mudawwana-al-kubra", ar: "المدونة الكبرى", en: "al-Mudawwana al-Kubra", ur: "المدونۃ الکبریٰ", cap: 25 },
  { dir: "fiqh/mughni-ibn-qudama", prefix: "mughni", work: "work/al-mughni", source: "source/mughni-ibn-qudama", ar: "المغني لابن قدامة", en: "Ibn Qudama's al-Mughni", ur: "المغنی، ابن قدامہ", cap: 25 },
  { dir: "hadith/adab-mufrad", prefix: "adab-mufrad", work: "work/al-adab-al-mufrad", source: "source/al-adab-al-mufrad", ar: "الأدب المفرد للبخاري", en: "al-Bukhari's al-Adab al-Mufrad", ur: "الادب المفرد، بخاری", cap: 15 },
  { dir: "hadith/fath-bari", prefix: "fath-bari", work: "work/fath-al-bari", source: "source/fath-al-bari", ar: "فتح الباري لابن حجر", en: "Ibn Hajar's Fath al-Bari", ur: "فتح الباری، ابن حجر", cap: 15 },
  { dir: "hadith/fath-bari-ibn-rajab", prefix: "fath-bari-ibn-rajab", work: "work/fath-al-bari-ibn-rajab", source: "source/fath-al-bari-ibn-rajab-1417", ar: "فتح الباري لابن رجب", en: "Ibn Rajab's Fath al-Bari", ur: "فتح الباری، ابن رجب", cap: 15 },
  { dir: "hadith/jami-tirmidhi", prefix: "jami-tirmidhi", work: "work/jami-al-tirmidhi", source: "source/jami-al-tirmidhi", ar: "جامع الترمذي", en: "Jami' al-Tirmidhi", ur: "جامع ترمذی", cap: 15 },
  { dir: "hadith/jami-ulum-hikam", prefix: "jami-ulum-hikam", work: "work/jami-ulum-hikam", source: "source/ibn-rajab-jami-ulum-hikam", ar: "جامع العلوم والحكم لابن رجب", en: "Ibn Rajab's Jami' al-'Ulum wa-l-Hikam", ur: "جامع العلوم والحکم، ابن رجب", cap: 15 },
  { dir: "hadith/mishkat-masabih", prefix: "mishkat-masabih", work: "work/mishkat-al-masabih", source: "source/mishkat-al-masabih", ar: "مشكاة المصابيح", en: "Mishkat al-Masabih", ur: "مشکاۃ المصابیح", cap: 15 },
  { dir: "hadith/musannaf-abd-al-razzaq", prefix: "musannaf-abd-al-razzaq", work: "work/al-musannaf-abd-al-razzaq", source: "source/musannaf-abd-al-razzaq", ar: "مصنف عبد الرزاق", en: "the Musannaf of 'Abd al-Razzaq", ur: "مصنف عبد الرزاق", cap: 15 },
  { dir: "hadith/musannaf-ibn-abi-shayba", prefix: "musannaf-ibn-abi-shayba", work: "work/al-musannaf-ibn-abi-shayba", source: "source/al-musannaf-ibn-abi-shayba", ar: "مصنف ابن أبي شيبة", en: "the Musannaf of Ibn Abi Shayba", ur: "مصنف ابن ابی شیبہ", cap: 15 },
  { dir: "hadith/riyad-salihin", prefix: "riyad-salihin", work: "work/riyad-al-salihin", source: "source/riyad-al-salihin", ar: "رياض الصالحين للنووي", en: "al-Nawawi's Riyad al-Salihin", ur: "ریاض الصالحین، نووی", cap: 15 },
  { dir: "hadith/sahih-ibn-hibban", prefix: "sahih-ibn-hibban", work: "work/sahih-ibn-hibban", source: "source/sahih-ibn-hibban", ar: "صحيح ابن حبان", en: "Sahih Ibn Hibban", ur: "صحیح ابن حبان", cap: 15 },
  { dir: "hadith/sharh-nawawi-muslim", prefix: "sharh-nawawi-muslim", work: "work/al-minhaj-sharh-sahih-muslim", source: "source/sharh-sahih-muslim-al-nawawi", ar: "شرح النووي على صحيح مسلم", en: "al-Nawawi's commentary on Sahih Muslim", ur: "شرح نووی بر صحیح مسلم", cap: 15 },
  { dir: "hadith/shuab-iman", scan: "Shiab_Al_Iman", prefix: "shuab-iman-v10", work: "work/shuab-al-iman", source: "source/shuab-iman-dar-al-rushd-v10", ar: "شعب الإيمان للبيهقي، الجزء العاشر", en: "al-Bayhaqi's Shu'ab al-Iman, vol. 10", ur: "شعب الایمان، بیہقی، جلد 10", cap: 15 },
  { dir: "hadith/shuab-iman", scan: "shiman", prefix: "shuab-iman-v2", work: "work/shuab-al-iman", source: "source/shuab-iman-dki-zaghlul-v2", ar: "شعب الإيمان للبيهقي، الجزء الثاني", en: "al-Bayhaqi's Shu'ab al-Iman, vol. 2", ur: "شعب الایمان، بیہقی، جلد 2", cap: 15 },
  { dir: "hadith/targhib-tarhib", prefix: "targhib-tarhib", work: "work/al-targhib-wa-al-tarhib-mundhiri", source: "source/targhib-tarhib-qayyima", ar: "الترغيب والترهيب للمنذري", en: "al-Mundhiri's al-Targhib wa-l-Tarhib", ur: "الترغیب والترہیب، منذری", cap: 15 },
  { dir: "lugha/lisan-arab", prefix: "lisan-arab", work: "work/lisan-al-arab", source: "source/lisan-al-arab-dar-sadir", ar: "لسان العرب لابن منظور", en: "Ibn Manzur's Lisan al-'Arab", ur: "لسان العرب، ابن منظور", cap: 10 },
  { dir: "lugha/sahah-jawhari", prefix: "sahah-jawhari", work: "work/al-sihah-jawhari", source: "source/sihah-attar-1979-v1", ar: "الصحاح للجوهري", en: "al-Jawhari's al-Sihah", ur: "الصحاح، جوہری", cap: 10 },
  { dir: "medicine-science/canon-ibn-sina-print-v1", prefix: "qanun-v1", work: "work/al-qanun-fi-al-tibb", source: "source/canon-ibn-sina-print-v1", ar: "القانون في الطب لابن سينا ج1", en: "Ibn Sina's Canon of Medicine, vol. 1", ur: "القانون فی الطب، ابن سینا ج1", cap: 10 },
  { dir: "medicine-science/canon-ibn-sina-print-v2", prefix: "qanun-v2", work: "work/al-qanun-fi-al-tibb", source: "source/canon-ibn-sina-print-v2", ar: "القانون في الطب لابن سينا ج2", en: "Ibn Sina's Canon of Medicine, vol. 2", ur: "القانون فی الطب، ابن سینا ج2", cap: 10 },
  { dir: "medicine-science/canon-ibn-sina-print-v3", prefix: "qanun-v3", work: "work/al-qanun-fi-al-tibb", source: "source/canon-ibn-sina-print-v3", ar: "القانون في الطب لابن سينا ج3", en: "Ibn Sina's Canon of Medicine, vol. 3", ur: "القانون فی الطب، ابن سینا ج3", cap: 10 },
  { dir: "medicine-science/hawi-razi", prefix: "hawi-razi", work: "work/al-hawi-fi-al-tibb", source: "source/hawi-razi-dar-kutub-ilmiyya", ar: "الحاوي في الطب للرازي", en: "al-Razi's al-Hawi fi al-Tibb", ur: "الحاوی فی الطب، رازی", cap: 10 },
  { dir: "medicine-science/sharh-tashrih-qanun-ibn-nafis", prefix: "sharh-tashrih-qanun", work: "work/sharh-tashrih-al-qanun", source: "source/sharh-tashrih-qanun-print", ar: "شرح تشريح القانون لابن النفيس", en: "Ibn al-Nafis's Commentary on the Anatomy of the Canon", ur: "شرح تشریح القانون، ابن النفیس", cap: 10 },
  { dir: "quran-sciences/burhan-zarkashi", prefix: "burhan-zarkashi", work: "work/al-burhan-fi-ulum-al-quran-zarkashi", source: "source/burhan-dar-al-hadith-2006", ar: "البرهان في علوم القرآن للزركشي", en: "al-Zarkashi's al-Burhan fi 'Ulum al-Qur'an", ur: "البرہان فی علوم القرآن، زرکشی", cap: 10 },
  { dir: "quran-sciences/hirz-amani-shatibi", prefix: "hirz-amani-shatibi", work: "work/hirz-al-amani-wa-wajh-al-tahani", source: "source/hirz-al-amani-wa-wajh-al-tahani", ar: "حرز الأماني ووجه التهاني للشاطبي", en: "al-Shatibi's Hirz al-Amani wa-Wajh al-Tahani", ur: "حرز الامانی ووجہ التہانی، شاطبی", cap: 10 },
  { dir: "quran-sciences/itqan", prefix: "itqan", work: "work/al-itqan-fi-ulum-al-quran", source: "source/itqan-suyuti", ar: "الإتقان في علوم القرآن للسيوطي", en: "al-Suyuti's al-Itqan fi 'Ulum al-Qur'an", ur: "الاتقان فی علوم القرآن، سیوطی", cap: 10 },
  { dir: "quran-sciences/manahil-irfan", prefix: "manahil-irfan", work: "work/manahil-al-irfan", source: "source/manahil-irfan-sabt", ar: "تهذيب مناهل العرفان في علوم القرآن", en: "the digest of Manahil al-'Irfan fi 'Ulum al-Qur'an", ur: "تہذیب مناہل العرفان فی علوم القرآن", cap: 10 },
  { dir: "quran-sciences/nashr-ibn-jazari", prefix: "nashr-ibn-jazari", work: "work/al-nashr-fi-al-qiraat-al-ashr", source: "source/nashr-dahman-damascus-1345-v1", ar: "النشر في القراءات العشر لابن الجزري", en: "Ibn al-Jazari's al-Nashr fi al-Qira'at al-'Ashr", ur: "النشر فی القراءات العشر، ابن الجزری", cap: 10 },
  { dir: "quran-sciences/taysir-dani", prefix: "taysir-dani", work: "work/al-taysir-fi-al-qiraat-al-sab", source: "source/taysir-pretzl-istanbul-1930", ar: "التيسير في القراءات السبع للداني", en: "al-Dani's al-Taysir fi al-Qira'at al-Sab'", ur: "التیسیر فی القراءات السبع، دانی", cap: 10 },
  { dir: "sahaba/hayat-sahaba", prefix: "sahaba-hayat-sahaba", work: "work/hayat-al-sahaba", source: "source/hayat-al-sahaba-kandahlawi-sabbani", ar: "حياة الصحابة للكاندهلوي", en: "al-Kandahlawi's Hayat al-Sahaba", ur: "حیاۃ الصحابہ، کاندھلوی", cap: 15 },
  { dir: "sahaba/hilyat-awliya", prefix: "sahaba-hilyat-awliya", work: "work/hilyat-al-awliya", source: "source/hilyat-al-awliya-dar-al-kutub-al-ilmiyya-1988", ar: "حلية الأولياء لأبي نعيم", en: "Abu Nu'aym's Hilyat al-Awliya'", ur: "حلیۃ الاولیاء، ابو نعیم", cap: 15 },
  { dir: "sahaba/isaba", prefix: "sahaba-isaba", work: "work/al-isaba-fi-tamyiz-al-sahaba", source: "source/isaba", ar: "الإصابة لابن حجر", en: "Ibn Hajar's al-Isaba", ur: "الاصابہ، ابن حجر", cap: 15 },
  { dir: "sahaba/isti-ab", prefix: "sahaba-isti-ab", work: "work/al-istiab", source: "source/isti-ab-ibn-abd-al-barr", ar: "الاستيعاب لابن عبد البر", en: "Ibn 'Abd al-Barr's al-Isti'ab", ur: "الاستیعاب، ابن عبد البر", cap: 15 },
  { dir: "sahaba/safwat-safwa", prefix: "sahaba-safwat-safwa", work: "work/sifat-al-safwa", source: "source/sifat-al-safwa-tartusi-2012", ar: "صفة الصفوة لابن الجوزي", en: "Ibn al-Jawzi's Sifat al-Safwa", ur: "صفۃ الصفوہ، ابن الجوزی", cap: 15 },
  { dir: "sahaba/siyar-alam-nubala", prefix: "siyar-alam-nubala", work: "work/siyar-alam-al-nubala", source: "source/siyar-alam-nubala", ar: "سير أعلام النبلاء للذهبي", en: "al-Dhahabi's Siyar A'lam al-Nubala'", ur: "سیر اعلام النبلاء، ذہبی", cap: 15 },
  { dir: "sahaba/usd-ghaba", prefix: "sahaba-usd-ghaba", work: "work/usd-al-ghaba", source: "source/usd-al-ghaba", ar: "أسد الغابة لابن الأثير", en: "Ibn al-Athir's Usd al-Ghaba", ur: "اسد الغابہ، ابن الاثیر", cap: 15 },
  { dir: "seerah/dalail-nubuwwa-abu-nuaym", prefix: "dalail-nubuwwa-abu-nuaym", work: "work/dalail-al-nubuwwa-abu-nuaym", source: "source/dalail-al-nubuwwa-abu-nuaym", ar: "دلائل النبوة لأبي نعيم", en: "Abu Nu'aym's Dala'il al-Nubuwwa", ur: "دلائل النبوۃ، ابو نعیم", cap: 10 },
  { dir: "seerah/dalail-nubuwwa-bayhaqi", prefix: "dalail-nubuwwa-bayhaqi", work: "work/dalail-al-nubuwwa-bayhaqi", source: "source/dalail-al-nubuwwa-bayhaqi", ar: "دلائل النبوة للبيهقي", en: "al-Bayhaqi's Dala'il al-Nubuwwa", ur: "دلائل النبوۃ، بیہقی", cap: 10 },
  { dir: "seerah/maghazi-waqidi", prefix: "maghazi-waqidi", work: "work/kitab-al-maghazi", source: "source/al-waqidi-maghazi", ar: "المغازي للواقدي", en: "al-Waqidi's Maghazi", ur: "المغازی، واقدی", cap: 10 },
  { dir: "seerah/qisas-anbiya-ibn-kathir", prefix: "qisas-anbiya-ibn-kathir", work: "work/qisas-al-anbiya-ibn-kathir", source: "source/qisas-al-anbiya-ibn-kathir-iqra-ebook", ar: "قصص الأنبياء لابن كثير", en: "Ibn Kathir's Qisas al-Anbiya'", ur: "قصص الانبیاء، ابن کثیر", cap: 10 },
  { dir: "seerah/rawd-unuf", prefix: "rawd-unuf", work: "work/al-rawd-al-unuf", source: "source/al-rawd-al-unf", ar: "الروض الأنف للسهيلي", en: "al-Suhayli's al-Rawd al-Unuf", ur: "الروض الانف، سہیلی", cap: 10 },
  { dir: "seerah/sira-ibn-hisham", prefix: "sira-ibn-hisham", work: "work/sira-ibn-ishaq-ibn-hisham", source: "source/ibn-hisham-sira", ar: "السيرة النبوية لابن هشام", en: "Ibn Hisham's Sira", ur: "سیرت ابن ہشام", cap: 10 },
  { dir: "seerah/subul-huda", prefix: "subul-huda", work: "work/subul-al-huda-wa-al-rashad", source: "source/subul-huda-salihi", ar: "سبل الهدى والرشاد للصالحي", en: "al-Salihi's Subul al-Huda wa-l-Rashad", ur: "سبل الہدیٰ والرشاد، صالحی", cap: 10 },
  { dir: "seerah/zad-maad", prefix: "zad-maad", work: "work/zad-al-maad", source: "source/zad-al-maad", ar: "زاد المعاد لابن القيم", en: "Ibn al-Qayyim's Zad al-Ma'ad", ur: "زاد المعاد، ابن القیم", cap: 10 },
  { dir: "sunnah-aqeedah/ibana-ibn-batta", prefix: "ibana-ibn-batta", work: "work/ibana-al-kubra-ibn-batta", source: "source/ibana-kubra-muti-iman", ar: "الإبانة الكبرى لابن بطة، كتاب الإيمان", en: "Ibn Batta's al-Ibana al-Kubra, the Book of Faith", ur: "الابانۃ الکبریٰ، ابن بطہ، کتاب الایمان", cap: 10 },
  { dir: "sunnah-aqeedah/kitab-sunnah-abdullah-ahmad", prefix: "sunna-abdullah-ahmad", work: "work/kitab-al-sunnah-abdullah-ibn-ahmad", source: "source/sunna-abdullah-ahmad-hamdan-1441", ar: "كتاب السنة لعبد الله بن أحمد", en: "'Abd Allah ibn Ahmad's Kitab al-Sunna", ur: "کتاب السنہ، عبد اللہ بن احمد", cap: 10 },
  { dir: "sunnah-aqeedah/kitab-sunnah-khallal", prefix: "sunna-khallal", work: "work/kitab-al-sunnah-khallal", source: "source/kitab-al-sunna-khallal-al-hamdan-2018", ar: "كتاب السنة للخلال", en: "al-Khallal's Kitab al-Sunna", ur: "کتاب السنہ، خلال", cap: 10 },
  { dir: "sunnah-aqeedah/sharh-usul-itiqad", prefix: "sharh-usul-itiqad", work: "work/sharh-usul-itiqad-lalakai", source: "source/sharh-usul-itiqad-basira", ar: "شرح أصول اعتقاد أهل السنة للالكائي", en: "al-Lalaka'i's Sharh Usul I'tiqad Ahl al-Sunna", ur: "شرح اصول اعتقاد اہل السنہ، لالکائی", cap: 10 },
  { dir: "tabaqat/tabaqat-huffaz", prefix: "tabaqat-huffaz", work: "work/tazkirat-al-huffaz", source: "source/tabaqat-huffaz", ar: "تذكرة الحفاظ للذهبي", en: "al-Dhahabi's Tadhkirat al-Huffaz", ur: "تذکرۃ الحفاظ، ذہبی", cap: 15 },
  { dir: "tabaqat/tabaqat-ibn-saad", prefix: "tabaqat-ibn-saad", work: "work/al-tabaqat-al-kubra-ibn-sad", source: "source/tabaqat-ibn-sad", ar: "الطبقات الكبرى لابن سعد", en: "Ibn Sa'd's al-Tabaqat al-Kubra", ur: "الطبقات الکبریٰ، ابن سعد", cap: 15 },
  { dir: "tafsir/tafsir-ibn-kathir", prefix: "tafsir-ibn-kathir", work: "work/tafsir-ibn-kathir", source: "source/tafsir-ibn-kathir", ar: "تفسير ابن كثير", en: "Ibn Kathir's Tafsir", ur: "تفسیر ابن کثیر", cap: 10 },
  { dir: "tafsir/tafsir-qurtubi", prefix: "tafsir-qurtubi", work: "work/al-jami-li-ahkam-al-quran", source: "source/jami-ahkam-quran-resala-v1", ar: "الجامع لأحكام القرآن للقرطبي", en: "al-Qurtubi's al-Jami' li-Ahkam al-Qur'an", ur: "الجامع لاحکام القرآن، قرطبی", cap: 10 },
  { dir: "tareekh/ansab-ashraf", prefix: "ansab-ashraf", work: "work/ansab-al-ashraf", source: "source/ansab-al-ashraf", ar: "أنساب الأشراف للبلاذري", en: "al-Baladhuri's Ansab al-Ashraf", ur: "انساب الاشراف، بلاذری", cap: 10 },
  { dir: "tareekh/bidaya-nihaya", prefix: "bidaya-nihaya", work: "work/al-bidaya-wal-nihaya", source: "source/al-bidaya-wal-nihaya", ar: "البداية والنهاية لابن كثير", en: "Ibn Kathir's al-Bidaya wa-l-Nihaya", ur: "البدایہ والنہایہ، ابن کثیر", cap: 10 },
  { dir: "tareekh/fihrist-ibn-nadim", prefix: "fihrist-ibn-nadim", work: "work/al-fihrist", source: "source/fihrist-ibn-al-nadim", ar: "الفهرست لابن النديم", en: "Ibn al-Nadim's al-Fihrist", ur: "الفہرست، ابن الندیم", cap: 10 },
  { dir: "tareekh/futuh-misr", prefix: "futuh-misr", work: "work/futuh-misr", source: "source/futuh-misr-amir-1999", ar: "فتوح مصر لابن عبد الحكم", en: "Ibn 'Abd al-Hakam's Futuh Misr", ur: "فتوح مصر، ابن عبد الحکم", cap: 10 },
  { dir: "tareekh/kamil-tarikh", prefix: "kamil-tarikh", work: "work/al-kamil-fi-al-tarikh", source: "source/kamil-ibn-al-athir", ar: "الكامل في التاريخ لابن الأثير", en: "Ibn al-Athir's al-Kamil fi al-Tarikh", ur: "الکامل فی التاریخ، ابن الاثیر", cap: 10 },
  { dir: "tareekh/kashf-zunun", prefix: "kashf-zunun", work: "work/kashf-al-zunun", source: "source/kashf-zunun-furqan", ar: "كشف الظنون لحاجي خليفة", en: "Hajji Khalifa's Kashf al-Zunun", ur: "کشف الظنون، حاجی خلیفہ", cap: 10 },
  { dir: "tareekh/muntazam", prefix: "muntazam", work: "work/al-muntazam-ibn-al-jawzi", source: "source/muntazam-ibn-al-jawzi", ar: "المنتظم لابن الجوزي", en: "Ibn al-Jawzi's al-Muntazam", ur: "المنتظم، ابن الجوزی", cap: 10 },
  { dir: "tareekh/muqaddima-ibn-khaldun", prefix: "muqaddima-ibn-khaldun", work: "work/al-muqaddima", source: "source/muqaddima-ibn-khaldun", ar: "مقدمة ابن خلدون", en: "Ibn Khaldun's Muqaddima", ur: "مقدمہ ابن خلدون", cap: 10 },
  { dir: "tareekh/muruj-dhahab", prefix: "muruj-dhahab", work: "work/muruj-al-dhahab", source: "source/muruj-al-dhahab", ar: "مروج الذهب للمسعودي", en: "al-Mas'udi's Muruj al-Dhahab", ur: "مروج الذہب، مسودی", cap: 10 },
  { dir: "tareekh/subh-asha", prefix: "subh-asha", work: "work/subh-al-asha", source: "source/subh-al-asha-cairo-v1", ar: "صبح الأعشى للقلقشندي", en: "al-Qalqashandi's Subh al-A'sha", ur: "صبح الاعشیٰ، قلقشندی", cap: 10 },
  { dir: "tareekh/tarikh-baghdad", prefix: "tarikh-baghdad", work: "work/tarikh-baghdad-khatib", source: "source/tarikh-baghdad-khatib", ar: "تاريخ بغداد للخطيب البغدادي", en: "al-Khatib al-Baghdadi's Tarikh Baghdad", ur: "تاریخ بغداد، خطیب بغدادی", cap: 10 },
  { dir: "tareekh/tarikh-dimashq", prefix: "tarikh-dimashq", work: "work/tarikh-dimashq", source: "source/tarikh-dimashq-ibn-asakir-fikr-1995", ar: "تاريخ دمشق لابن عساكر", en: "Ibn 'Asakir's History of Damascus", ur: "تاریخ دمشق، ابن عساکر", cap: 10 },
  { dir: "tareekh/tarikh-islam-dhahabi", prefix: "tarikh-islam-dhahabi", work: "work/tarikh-islam-dhahabi", source: "source/tarikh-islam-dhahabi", ar: "تاريخ الإسلام للذهبي", en: "al-Dhahabi's Tarikh al-Islam", ur: "تاریخ الاسلام، ذہبی", cap: 10 },
  { dir: "tareekh/tarikh-tabari", prefix: "tarikh-tabari", work: "work/tarikh-al-rusul-wa-al-muluk", source: "source/tarikh-al-tabari", ar: "تاريخ الطبري", en: "al-Tabari's History", ur: "تاریخ طبری", cap: 10 },
  { dir: "tareekh/wafayat-ayan", prefix: "wafayat-ayan", work: "work/wafayat-al-ayan", source: "source/wafayat-ayan", ar: "وفيات الأعيان لابن خلكان", en: "Ibn Khallikan's Wafayat al-A'yan", ur: "وفیات الاعیان، ابن خلکان", cap: 10 },
  { dir: "usul/muwafaqat", prefix: "muwafaqat", work: "work/al-muwafaqat", source: "source/muwafaqat", ar: "الموافقات للشاطبي", en: "al-Shatibi's al-Muwafaqat", ur: "الموافقات، شاطبی", cap: 25 },
];

const QURAN_MARK = /[﴾﴿{}]|قوله تعالي|قوله تعالى|قال تعالي|قال تعالى|قال الله|عز وجل|قوله سبحانه|قول الله|الآية/;
/** Honorific formulas as the OCR misreads them: «وضى الله عنه»، «صلابن عليه ولم». Such a window is skipped. */
const LOOSE_HONORIFIC = /ض[يى] ?الل|الله عن(?:ه|ها|هما|هم)(?=$|[\s،.])|عليه و?لم(?=$|[\s،.])|صل[ايى]? ?[ء-ي]{0,4} عليه|سبحانه وتعال|رحم[ةه] الله/;
/** One spelling for the comparison with the Qur'an and the vocabulary: alef forms, final ya and ta marbuta folded. */
const norm = (w: string) => ahkamFold(w).replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^ء-ي]/g, "");
/** Every run of four consecutive words of the Qur'an, and the vocabulary of the museum's Qur'an and hadith passages. */
const QURAN_4GRAMS = new Set<string>();
const VOCAB = new Set<string>();
for (const f of readdirSync(OUT_DIR)) {
  const isQuran = /^quran-\d+-\d+\.yaml$/.test(f);
  if (!isQuran && !/^(?:bukhari|muslim|tirmidhi|nasai|abudawud|ibnmajah|muwatta|riyad|arbaun)-/.test(f)) continue;
  const raw = readFileSync(join(OUT_DIR, f), "utf8");
  const m = raw.match(isQuran ? /^text_search: "(.*)"$/m : /^text: "(.*)"$/m);
  if (!m) continue;
  const ws = m[1].split(/\s+/).map(norm).filter(Boolean);
  for (const w of ws) VOCAB.add(w);
  if (isQuran) for (let i = 0; i + 4 <= ws.length; i++) QURAN_4GRAMS.add(ws.slice(i, i + 4).join(" "));
}
/** The testimony and the faith formula are verse wordings too; they are the runs an excerpt may share. */
const ALLOWED = new Set(([] as string[]).map((s) => s.split(" ").map(norm).join(" ")));
const known = (w: string) => VOCAB.has(w) || VOCAB.has(w.replace(/^[وفبلك]/, "")) || VOCAB.has(w.replace(/^[وفبلك]?ال/, "")) || VOCAB.has(w.replace(/^[وفبلك]?لل/, ""));
function quotesQuran(ws: string[]): boolean {
  for (let i = 0; i + 4 <= ws.length; i++) { const g = ws.slice(i, i + 4).join(" "); if (QURAN_4GRAMS.has(g) && !ALLOWED.has(g)) return true; }
  return false;
}

/** Clean an OCR page: footnote digits, Latin, brackets and line breaks go; honorific formulas go. */
function pageWords(text: string): string[] {
  return clean(text.replace(/[A-Za-z0-9٠-٩()\[\]«»"*#_=|/\\<>~^`]+/g, " ").replace(/\s+/g, " ")).split(" ").filter(Boolean);
}

interface Cand { vol: number; scan: string; page: number; text: string; keys: string[]; weight: number }

function bestWindow(words: string[]): { text: string; keys: string[]; weight: number } | null {
  let best: { text: string; keys: string[]; weight: number } | null = null;
  for (let start = 0; start < words.length; start += 8) {
    const slice = words.slice(start, start + 40);
    if (slice.length < 18) break;
    const text = slice.join(" ");
    const folded = ahkamFold(text);
    if (QURAN_MARK.test(folded) || QURAN_MARK.test(text) || HONORIFIC_LEFT.test(folded)) continue;
    if (/[ٱۖ-ۭ]/.test(text)) continue; // Uthmani letters: a verse set in the page
    const ws = slice.map(norm).filter(Boolean);
    const stray = ws.filter((w) => w.length <= 1).length + (slice.length - ws.length);
    if (stray > slice.length * 0.08) continue;
    if (ws.filter(known).length < ws.length * 0.82) continue;
    if (LOOSE_HONORIFIC.test(folded)) continue;
    if (quotesQuran(ws)) continue;
    const hits = ahkamHitsOfText(folded, true);
    if (!hits.some((h) => h.strong && h.topic !== "haram")) continue;
    const keys = uniq(hits.map((h) => `${h.topic}:${h.signal}`));
    // the terms themselves weigh double: a window that says «أركان الإسلام» or «شعب الإيمان» outranks a saying alone
    const weight = keys.filter((k) => !k.startsWith("haram:")).length + 2 * keys.filter((k) => /^fard-ayn:|^fard-kifaya:|:mandub$|:mustahabb$|:makruh$|:saghair$|:muhaqqarat$|:lamam$|:taat$|:mubah$|:wajib$|:farida$|:azima-rukhsa$/.test(k)).length;
    if (!best || weight > best.weight) best = { text: (start > 0 ? "… " : "") + text + (start + 40 < words.length ? " …" : ""), keys, weight };
  }
  return best;
}

const pageFiles = readdirSync(OUT_DIR);
let total = 0;
const perTopic: Record<string, number> = {};
for (const book of BOOKS) {
  if (ONLY && book.prefix !== ONLY) continue;
  if (!existsSync(`data/${book.work}.yaml`) || !existsSync(`data/${book.source}.yaml`)) { console.error(`skip ${book.prefix}: work or source record missing`); continue; }
  const base = join(ROOT, book.dir);
  if (!existsSync(base)) { console.error(`skip ${book.prefix}: ${base} missing`); continue; }
  const scans = readdirSync(base).filter((d) => existsSync(join(base, d, "pages.json")) && (!book.scan || d === book.scan)).sort();
  const cands: Cand[] = [];
  const seenText = new Set<string>();
  scans.forEach((scan, vi) => {
    let pages: { page: number; text?: string }[];
    try { pages = JSON.parse(readFileSync(join(base, scan, "pages.json"), "utf8")); } catch { return; }
    for (const p of pages) {
      if (!p.text || p.text.length < 200) continue;
      const w = bestWindow(pageWords(p.text));
      if (!w) continue;
      const key = w.text.split(" ").map(norm).filter(Boolean).slice(4, 16).join(" ");
      if (seenText.has(key)) continue; // the same edition scanned twice
      seenText.add(key);
      cands.push({ vol: vi + 1, scan, page: p.page, ...w });
    }
  });
  // densest pages first, then spread: never two neighbouring pages
  cands.sort((a, b) => b.weight - a.weight || a.vol - b.vol || a.page - b.page);
  const kept: Cand[] = [];
  for (const c of cands) {
    if (kept.length >= book.cap) break;
    if (kept.some((k) => k.vol === c.vol && Math.abs(k.page - c.page) <= 1)) continue;
    kept.push(c);
  }
  kept.sort((a, b) => a.vol - b.vol || a.page - b.page);
  for (const c of kept) {
    const multi = scans.length > 1;
    const slug = `${book.prefix}-ahkam-${multi ? `${c.vol}-` : ""}${c.page}`;
    const file = join(OUT_DIR, `${slug}.yaml`);
    if (existsSync(file)) continue;
    const pageTail = `-${multi ? `${c.vol}-` : ""}${c.page}.yaml`;
    if (pageFiles.some((f) => f.startsWith(`${book.prefix}-`) && f.endsWith(pageTail))) continue; // another harvest excerpted this page
    const topics = AHKAM_TOPICS.filter((t) => c.keys.some((k) => k.startsWith(`${t}:`)));
    const says = uniq(c.keys.map((k) => SAYS[k]).filter(Boolean).map((s) => s.join("\u0001"))).map((s) => s.split("\u0001"));
    const frEs = /^(.+?)'s (.+)$/.exec(book.en);
    const latin = frEs ? `${frEs[2]} de ${frEs[1]}` : book.en.replace(/^the /, "");
    const where = { ar: `${multi ? `المجلد المصوَّر ${c.vol}، ` : ""}ص ${c.page}`, en: `${multi ? `scan volume ${c.vol}, ` : ""}p. ${c.page}`, ur: `${multi ? `اسکین جلد ${c.vol}، ` : ""}ص ${c.page}`, fr: `${multi ? `volume numérisé ${c.vol}, ` : ""}p. ${c.page}`, es: `${multi ? `volumen digitalizado ${c.vol}, ` : ""}p. ${c.page}` };
    const lead = says.slice(0, 2);
    const label = {
      ar: `${book.ar}، ${where.ar} — ${lead.map((s) => s[0]).join("، ")}`,
      en: `${book.en}, ${where.en} — ${lead.map((s) => s[1]).join("; ")}`,
      ur: `${book.ur}، ${where.ur} — ${lead.map((s) => s[2]).join("، ")}`,
      fr: `${latin}, ${where.fr} — ${lead.map((s) => s[3]).join(" ; ")}`,
      es: `${latin}, ${where.es} — ${lead.map((s) => s[4]).join("; ")}`,
    };
    const summary = {
      ar: `مقطع من ${book.ar}، ${where.ar}، يرد فيه ذكر ${says.map((s) => s[0]).join("، و")}؛ من النسخة المصورة المقروءة آليا، والنص مقتبس بحدود أربعين كلمة وفق سياسة المصادر ولم يُصحَّح. يجمعه ${BROWSER_NAME[0]}.`,
      en: `An excerpt from ${book.en}, ${where.en}, whose wording mentions ${says.map((s) => s[1]).join(", ")}; from the machine-read scan, quoted within forty words per the sources policy and not corrected. ${BROWSER_NAME[1]} lists it.`,
      ur: `${book.ur}، ${where.ur} کا اقتباس جس میں ${says.map((s) => s[2]).join("، ")} کا ذکر ہے؛ مشینی طور پر پڑھی گئی نقل سے، چالیس الفاظ کی حد میں، بغیر تصحیح کے۔ ${BROWSER_NAME[2]} اسے درج کرتا ہے۔`,
      fr: `Un extrait de ${latin}, ${where.fr}, dont le texte mentionne ${says.map((s) => s[3]).join(", ")} ; tiré de la numérisation lue par machine, cité dans la limite de quarante mots selon la politique des sources et non corrigé. ${BROWSER_NAME[3]} le répertorie.`,
      es: `Un extracto de ${latin}, ${where.es}, cuyo texto menciona ${says.map((s) => s[4]).join(", ")}; tomado de la digitalización leída por máquina, citado dentro de cuarenta palabras según la política de fuentes y sin corregir. ${BROWSER_NAME[4]} lo recoge.`,
    };
    const src = `[${book.source}]`;
    const yaml = [
      `id: passage/${slug}`,
      `class: passage`,
      `unit: chapter`,
      `work: ${book.work}`,
      `ref: ${q(multi ? `${c.vol}:${c.page}` : String(c.page))}`,
      `label: ${five(label, q)}`,
      `text: ${q(c.text)}`,
      `summary:`,
      `  ar: ${q(summary.ar)}`,
      `  en: ${q(summary.en)}`,
      `  ur: ${q(summary.ur)}`,
      `  fr: ${q(summary.fr)}`,
      `  es: ${q(summary.es)}`,
      `relations:`,
      ...topics.map((t) => `  - { type: mentions, target: ${AHKAM_ANCHOR[t]}, sources: ${src} }`),
      `provenance: { layer: own-research, source: ${q(`Apple Vision OCR of the scan ${book.dir}/${c.scan}, page ${c.page}; a window of at most 40 words chosen by the rulings detector (scripts/ahkam.ts); OCR text not corrected`)}, generated_by: "Claude (claude-fable-5-2)", model: "claude-fable-5-2", run: "ahkam-ocr-1" }`,
      `sources: ${src}`,
      `status: { review: published, completeness: 1, generated_by: "Claude (claude-fable-5-2) from the OCR'd book; label and summary are the museum's own words in five languages (machine-written, not read by a person); the excerpt is machine-read and not corrected" }`,
      ``,
    ].join("\n");
    if (!DRY) writeFileSync(file, yaml);
    total++;
    for (const t of topics) perTopic[t] = (perTopic[t] ?? 0) + 1;
  }
  console.log(book.prefix, `${kept.length} kept of ${cands.length} candidate pages in ${scans.length} scan(s)`);
}
console.log(`${total} passages ${DRY ? "(dry run)" : "written"}`, perTopic);
