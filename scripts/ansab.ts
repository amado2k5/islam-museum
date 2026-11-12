// The Genealogies, Peoples, Butun and Prophets' Tree Browser's shared reads
// (docs/plan/55-ansab-browser.md): which passage records mention lineages, tribes and peoples,
// the tribal subdivisions (البطون) and the prophets' tree — by name, by the class terms (النسب، الأنساب،
// القبيلة، البطون، شجرة الأنبياء), or by the canonical `mentions` edges already in the graph —
// and which corpus section each belongs to. Detection runs at build time over the compiled
// graph, so a nasab, tribe, matn or prophets'-tree mention in any harvested book — and in every
// book harvested later — appears without a tagging step. Curated records join through the
// `ansab-browser` tag instead.
//
// The lexicon is deliberately narrow: unvocalized Arabic makes «تميم» collide with the adjective
// "complete", «سليم» with the name, «الروم» with بيت الروم, «متن» with the back of an animal or
// the matn of a hadith, «بني» with any "sons of", and «عاد» with the verb "he returned".
// Names are therefore matched on the passage matn only (text_search/text, never the label or
// the summary), ambiguous forms are context-gated, and ANSAB_EXCLUDE / ANSAB_TOPIC_EXCLUDE are
// the curated escape hatches for verified false positives.
import type { Node } from "./build-graph.js";

export const ANSAB_TAG = "ansab-browser";
/**
 * The browser's domain sections on the home page; a record's `ansab-<section>` tag places it,
 * untagged automatic members land in `mentioned` — the self-growing shelf. The corpus split
 * (Qur'an / Sunnah / seerah / other books) happens per subject page through `ansabCorpusOf`.
 */
export const ANSAB_SECTIONS = ["shajara", "tribes", "peoples", "butun", "curated", "mentioned"] as const;
export type AnsabSection = (typeof ANSAB_SECTIONS)[number];
export type AnsabCorpus = "quran" | "sunnah" | "seerah" | "books";
export const ANSAB_CORPORA: AnsabCorpus[] = ["quran", "sunnah", "seerah", "books"];

/**
 * The canonical subject index: the lineage figures of the prophets' tree (the agreed chain to
 * Adnan, the disputed links between Adnan and Ismail, and the prophets on Ibrahim's two lines),
 * the tribes and peoples, the butun clans, and the nasab concepts. Records are matched by id;
 * a subject missing from the graph simply renders nothing.
 */
export const ANSAB_SUBJECTS = [
  // شجرة الأنبياء — the agreed chain Adnan → Muhammad (الجزء المتفق عليه)
  "person/muhammad", "person/abdullah-ibn-abd-al-muttalib", "person/abd-al-muttalib",
  "person/hashim-ibn-abd-manaf", "person/abd-manaf-ibn-qusayy", "person/qusayy-ibn-kilab",
  "person/kilab-ibn-murrah", "person/murra-ibn-kab", "person/kab-ibn-luayy", "person/luayy-ibn-ghalib",
  "person/ghalib-ibn-fihr", "person/fihr-ibn-malik", "person/malik-ibn-al-nadr",
  "person/al-nadr-ibn-kinana", "person/kinana-ibn-khuzayma", "person/khuzayma-ibn-mudrika",
  "person/mudrika-ibn-ilyas", "person/ilyas-ibn-mudar", "person/mudar-ibn-nizar",
  "person/nizar-ibn-maadd", "person/maadd-ibn-adnan", "person/adnan",
  // شجرة الأنبياء — the disputed links Adnan → Ismail (الجزء المختلف فيه), Ibn Ishaq/al-Tabari order
  "person/udd-ibn-adnan", "person/adad-ibn-udd", "person/al-humaysa-ibn-adad",
  "person/salman-ibn-al-humaysa", "person/awf-ibn-salman", "person/buz-ibn-awf",
  "person/qamwal-ibn-buz", "person/ubayy-ibn-qamwal", "person/al-awwam-ibn-ubayy",
  "person/nashid-ibn-al-awwam", "person/haza-ibn-nashid", "person/bildas-ibn-haza",
  "person/yadlaf-ibn-bildas", "person/tabikh-ibn-yadlaf", "person/jahim-ibn-tabikh",
  "person/nahish-ibn-jahim", "person/makhi-ibn-nahish", "person/ays-ibn-makhi",
  "person/abaq-ibn-ays", "person/daid-ibn-abaq", "person/nabt-ibn-daid", "person/mashih-ibn-nabt",
  "person/al-nashtan-ibn-mashih", "person/udr-ibn-al-nashtan", "person/al-dhara-ibn-udr",
  "person/abd-ibn-al-dhara", "person/ahmar-ibn-abd", "person/nabit-ibn-ahmar", "person/qaydar",
  "person/ismail", "person/ibrahim",
  // شجرة الأنبياء — Ibrahim's two lines to the prophets (Ismail → Muhammad; Ishaq → Isa)
  "person/ishaq", "person/yaqub", "person/yusuf", "person/musa", "person/harun", "person/dawud",
  "person/sulayman", "person/zakariyya", "person/yahya", "person/isa-ibn-maryam",
  // القبائل والأنساب — the tribes and clans
  "group/quraysh",
     
  "group/banu-nadir", "group/banu-qaynuqa", "group/banu-qurayza", "group/jewish-tribes-of-hijaz",
  "group/al-aws", "group/al-khazraj", "group/khuzaa", "group/aad", "group/thamud", "group/banu-tamim",
  "group/hawazin", "group/thaqif", "group/ghatafan", "group/hudhayl", "group/banu-sulaym",
  "group/aslam", "group/juhayna", "group/muzayna", "group/banu-ghifar", "group/ashja", "group/al-azd",
  "group/banu-lakhm", "group/ghassan", "group/banu-hamdan", "group/himyar", "group/madhhij", "group/qudaa",
  "group/tayy", "group/banu-shayban", "group/bakr-ibn-wail", "group/banu-taghlib", "group/abd-al-qays",
  "group/kinda", "group/banu-dabba", "group/yarbu", "group/kinana", "group/murad", "group/anmar-ibn-nizar",
  "group/abs", "group/banu-amir-ibn-sasaa", "group/banu-asad", "group/banu-abbas",
  // الأعراق — the peoples
  "group/arabs", "group/al-ajam", "group/persians", "group/al-rum", "group/turks",
  "group/al-habasha", "group/al-qibt", "group/berbers", "group/kurds", "group/banu-israil",
  "group/mongols",
  // البطون — the tribal subdivisions (بطون قريش والأنصار والقبائل)
  "group/ba-alawi",
  "group/banu-abd-al-ashhal",
  "group/banu-abd-dar",
  "group/banu-abd-manaf",
  "group/banu-abd-shams",
  "group/banu-adi",
  "group/banu-al-ajlan",
  "group/banu-al-anbar",
  "group/banu-al-dil",
  "group/banu-al-harith-al-khazraj",
  "group/banu-al-harith-ibn-fihr",
  "group/banu-al-harith",
  "group/banu-al-mulawwah",
  "group/banu-al-muttalib",
  "group/banu-al-najjar",
  "group/banu-amir-ibn-luayy",
  "group/banu-amir",
  "group/banu-amr-ibn-awf",
  "group/banu-asad-ibn-abd-al-uzza",
  "group/banu-awf-ibn-al-khazraj",
  "group/banu-bayada",
  "group/banu-darim",
  "group/banu-dhuhl-ibn-shayban",
  "group/banu-dubaya-ibn-zayd",
  "group/banu-dubayb",
  "group/banu-dula",
  "group/banu-fazara",
  "group/banu-hammud",
  "group/banu-hanzala",
  "group/banu-haritha-al-aws",
  "group/banu-hashim",
  "group/banu-ijl",
  "group/banu-jafn",
  "group/banu-jumah",
  "group/banu-jusham",
  "group/banu-khatma",
  "group/banu-kilab",
  "group/banu-maghala",
  "group/banu-makhzum",
  "group/banu-mazyad",
  "group/banu-minqar",
  "group/banu-muharib-ibn-fihr",
  "group/banu-mujashi-ibn-darim",
  "group/banu-murra",
  "group/banu-nabit",
  "group/banu-nasr",
  "group/banu-nawfal-ibn-abd-manaf",
  "group/banu-qays-ibn-thalaba",
  "group/banu-sad-ibn-bakr",
  "group/banu-sahm",
  "group/banu-saida",
  "group/banu-salim-ibn-awf",
  "group/banu-salima",
  "group/banu-salul",
  "group/banu-tahm",
  "group/banu-taym-allat",
  "group/banu-taym",
  "group/banu-thalaba-ibn-amr",
  "group/banu-ubayd-ibn-zayd",
  "group/banu-umayya-ibn-zayd",
  "group/banu-umayya",
  "group/banu-uqayl",
  "group/banu-wail-ibn-qasit",
  "group/banu-waqif",
  "group/banu-yashkur",
  "group/banu-zafar-al-aws",
  "group/banu-zuhra",
  "group/banu-zurayq",
  "group/dajaima",
  "group/sufa",
  "group/tore-clan",
  // nasab concepts
  "concept/nasab", "concept/ansab", "concept/nasab-al-nabi", "concept/ahl-al-nasab",
  "concept/waqf-al-nasab-inda-maadd", "concept/luhuq-nasab-fiqh",
] as const;
export type AnsabSubjectId = (typeof ANSAB_SUBJECTS)[number];
export const ANSAB_SUBJECT_SET = new Set<string>(ANSAB_SUBJECTS);

/** Class-level chips for passages about genealogy, tribes, butun or the tree without naming one. */
export const ANSAB_GENERIC_TOPICS = ["nasab", "tribes", "butun", "prophets-tree"] as const;
export type AnsabGenericTopic = (typeof ANSAB_GENERIC_TOPICS)[number];
export type AnsabTopic = AnsabSubjectId | AnsabGenericTopic;

/** Passage records whose only lexical hit is a known false positive, verified by reading. */
export const ANSAB_EXCLUDE = new Set<string>([]);
/** Single-topic exclusions for verified false positives. */
export const ANSAB_TOPIC_EXCLUDE = new Set<string>([]);

const DIACRITICS = /[ً-ٰٟۡ-ۭۨـ]/g;
/** Imlaei-style normalization for matching: hamza seats and final alif/ya unified. */
export function normalizeAnsabArabic(s: string): string {
  return s
    .replace(DIACRITICS, "")
    .replace(/[أإٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي");
}

const BOUNDARY = String.raw`(?=\s|$|[،,.;:!؟?()\[\]{}«»"'\-ـ])`;
/** A token name with clitic prefixes and the common case/number suffixes. */
function tok(name: string, suffix = "(?:ا|ه|ي|هم|هن|كم|كن|نا|ك)?"): RegExp {
  return new RegExp(String.raw`(?:^|\s)[بلوفسك]{0,2}` + name + suffix + BOUNDARY);
}
/** A fixed phrase that must not sit inside a longer word; a leading clitic is allowed. */
function phrase(p: string): RegExp {
  const esc = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(String.raw`(?<![ء-ي])[وبلفسكا]{0,2}` + esc + String.raw`(?![ء-ي])`);
}
const gphrase = (p: string): RegExp => {
  const esc = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(String.raw`(?<![ء-ي])` + esc + String.raw`(?![ء-ي])`);
};

/** Unambiguous subject names — the lineage links, tribes, peoples and clan names. */
const SUBJECT_PATTERNS: Partial<Record<AnsabSubjectId, RegExp[]>> = {
  "person/muhammad": [tok("محمد"), phrase("محمد بن عبد الله"), phrase("خاتم النبيين")],
  "person/abdullah-ibn-abd-al-muttalib": [phrase("عبد الله بن عبد المطلب"), phrase("عبدالله بن عبد المطلب")],
  "person/abd-al-muttalib": [tok("عبد المطلب"), phrase("شيبه بن هاشم"), phrase("شيبه الحمد")],
  "person/hashim-ibn-abd-manaf": [phrase("هاشم بن عبد مناف"), phrase("بني هاشم"), phrase("بنو هاشم"), phrase("البيت الهاشمي"), phrase("الهاشميون"), phrase("الهاشميين")],
  "person/abd-manaf-ibn-qusayy": [phrase("عبد مناف بن قصي"), phrase("عبد مناف"), phrase("بني عبد مناف"), phrase("بنو عبد مناف")],
  "person/qusayy-ibn-kilab": [phrase("قصي بن كلاب"), phrase("قصي")],
  "person/kilab-ibn-murrah": [phrase("كلاب بن مره")],
  "person/murra-ibn-kab": [phrase("مره بن كعب")],
  "person/kab-ibn-luayy": [phrase("كعب بن لوي")],
  "person/luayy-ibn-ghalib": [phrase("لوي بن غالب"), phrase("بني لوي")],
  "person/ghalib-ibn-fihr": [phrase("غالب بن فهر")],
  "person/fihr-ibn-malik": [phrase("فهر بن مالك"), phrase("قريش بن فهر")],
  "person/malik-ibn-al-nadr": [phrase("مالك بن النضر")],
  "person/al-nadr-ibn-kinana": [phrase("النضر بن كنانه")],
  "person/kinana-ibn-khuzayma": [phrase("كنانه بن خزيمه")],
  "person/khuzayma-ibn-mudrika": [phrase("خزيمه بن مدركه")],
  "person/mudrika-ibn-ilyas": [phrase("مدركه بن الياس")],
  "person/ilyas-ibn-mudar": [phrase("الياس بن مضر")],
  "person/mudar-ibn-nizar": [phrase("مضر بن نزار"), gphrase("مضر"), gphrase("المضريه")],
  "person/nizar-ibn-maadd": [phrase("نزار بن معد"), phrase("بني نزار")],
  "person/maadd-ibn-adnan": [phrase("معد بن عدنان"), phrase("بني معد")],
  "person/adnan": [phrase("عدنان"), phrase("العدنانيون"), phrase("العدنانية"), phrase("عدناني"), phrase("عدنانيه")],
  "person/ismail": [tok("اسماعيل"), phrase("بني اسماعيل"), phrase("ولد اسماعيل")],
  "person/ibrahim": [tok("ابراهيم")],
  "person/ishaq": [tok("اسحاق")],
  "person/yaqub": [tok("يعقوب")],
  "person/yusuf": [tok("يوسف")],
  "person/musa": [tok("موسي")],
  "person/harun": [tok("هارون")],
  "person/dawud": [tok("داود")],
  "person/sulayman": [tok("سليمان")],
  "person/zakariyya": [tok("زكريا")],
  "person/isa-ibn-maryam": [tok("عيسي"), tok("المسيح"), phrase("ابن مريم"), phrase("عيسي ابن مريم")],
  "person/qaydar": [phrase("قيدار"), phrase("قيدر")],
  // tribes
  "group/quraysh": [tok("قريش"), phrase("قريشيه"), phrase("القرشيون"), phrase("القرشيين")],
  "group/banu-hashim": [phrase("بني هاشم"), phrase("بنو هاشم"), phrase("الهاشميون"), phrase("الهاشميه")],
  "group/banu-abd-manaf": [phrase("بني عبد مناف"), phrase("بنو عبد مناف")],
  "group/banu-umayya": [phrase("بني اميه"), phrase("بنو اميه"), phrase("الامويون"), phrase("الامويين"), phrase("امويه")],
  "group/banu-abd-shams": [phrase("بني عبد شمس"), phrase("بنو عبد شمس"), phrase("عبد شمس")],
  "group/banu-makhzum": [phrase("بني مخزوم"), phrase("بنو مخزوم"), phrase("المخزوميون")],
  "group/banu-zuhra": [phrase("بني زهره"), phrase("بنو زهره"), phrase("الزهريون")],
  "group/banu-al-najjar": [phrase("بني النجار"), phrase("بنو النجار"), phrase("بني نجار")],
  "group/banu-nadir": [phrase("بني النضير"), phrase("بنو النضير"), phrase("النضير")],
  "group/banu-qaynuqa": [phrase("قينقاع"), phrase("بني قينقاع")],
  "group/banu-qurayza": [phrase("قريظه"), phrase("بني قريظه")],
  "group/jewish-tribes-of-hijaz": [phrase("يهود المدينه"), phrase("يهود خيبر"), phrase("قبائل اليهود")],
  "group/al-aws": [phrase("الاوس"), phrase("بني الاوس"), phrase("اوسيه"), phrase("الاوس والخزرج"), phrase("اوس وخزرج")],
  "group/al-khazraj": [phrase("الخزرج"), phrase("بني الخزرج"), phrase("خزرجيه"), phrase("الاوس والخزرج")],
  "group/khuzaa": [phrase("خزاعه"), phrase("بني خزاعه")],
  "group/aad": [phrase("قوم عاد"), phrase("عاد الاولي"), phrase("عاد الثانيه"), phrase("بني عاد"), phrase("عادا الاولي"), phrase("ارم ذات العماد")],
  "group/thamud": [phrase("ثمود"), phrase("قوم ثمود"), phrase("بني ثمود")],
  "group/banu-tamim": [phrase("بني تميم"), phrase("بنو تميم"), phrase("تميميه")],
  "group/hawazin": [phrase("هوازن"), phrase("بني هوازن"), phrase("هوازنيه")],
  "group/thaqif": [phrase("ثقيف"), phrase("بني ثقيف"), phrase("الثقيفون"), phrase("ثقفيه")],
  "group/ghatafan": [phrase("غطفان"), phrase("بني غطفان")],
  "group/hudhayl": [phrase("هذيل"), phrase("بني هذيل")],
  "group/banu-sulaym": [phrase("بني سليم"), phrase("بنو سليم"), phrase("سليميه")],
  "group/aslam": [phrase("اسلم"), phrase("بني اسلم")],
  "group/juhayna": [phrase("جهينه"), phrase("بني جهينه")],
  "group/muzayna": [phrase("مزينه"), phrase("بني مزينه")],
  "group/banu-ghifar": [phrase("غفار"), phrase("بني غفار"), phrase("الغفاريون")],
  "group/ashja": [phrase("اشجع"), phrase("بني اشجع")],
  "group/al-azd": [phrase("الازد"), phrase("بني الازد"), phrase("ازديه")],
  "group/banu-lakhm": [phrase("لخم"), phrase("بني لخم"), phrase("اللخميون"), phrase("المناذره")],
  "group/ghassan": [phrase("غسان"), phrase("بني غسان"), phrase("الغساسنه")],
  "group/banu-hamdan": [phrase("همدان"), phrase("بني همدان")],
  "group/himyar": [phrase("حمير"), phrase("بني حمير"), phrase("الاحماريون"), phrase("الحميريون")],
  "group/madhhij": [phrase("مذحج"), phrase("بني مذحج")],
  "group/qudaa": [phrase("قضاعه"), phrase("بني قضاعه")],
  "group/tayy": [phrase("طيء"), phrase("بني طيء"), phrase("الطائييون")],
  "group/banu-shayban": [phrase("شيبان"), phrase("بني شيبان")],
  "group/bakr-ibn-wail": [phrase("بكر بن وايل"), phrase("بني بكر"), phrase("البكريون")],
  "group/banu-taghlib": [phrase("تغلب"), phrase("بني تغلب")],
  "group/abd-al-qays": [phrase("عبد القيس"), phrase("بني عبد القيس")],
  "group/kinda": [phrase("كنده"), phrase("بني كنده")],
  "group/banu-dabba": [phrase("ضبه"), phrase("بني ضبه")],
  "group/yarbu": [phrase("يربوع"), phrase("بني يربوع")],
  "group/kinana": [phrase("كنانه"), phrase("بني كنانه")],
  "group/murad": [phrase("مراد"), phrase("بني مراد")],
  "group/anmar-ibn-nizar": [phrase("انمار بن نزار"), phrase("بني انمار")],
  "group/abs": [phrase("عبس"), phrase("بني عبس")],
  "group/banu-amir-ibn-sasaa": [phrase("بني عامر"), phrase("بنو عامر"), phrase("عامر بن صعصعه")],
  "group/banu-asad": [phrase("بني اسد"), phrase("بنو اسد"), phrase("الاسديون")],
  "group/banu-abbas": [phrase("بني العباس"), phrase("بنو العباس"), phrase("العباسيون"), phrase("العباسيه")],
  // peoples
  "group/arabs": [phrase("العرب"), phrase("اعراب"), phrase("الاعراب"), phrase("العراب")],
  "group/al-ajam": [phrase("العجم"), phrase("الاعاجم"), phrase("اعجميه")],
  "group/persians": [phrase("الفرس"), phrase("الفارسيه"), phrase("فارس")],
  "group/al-rum": [phrase("الروم"), phrase("بني الاصفر"), phrase("الروميه")],
  "group/turks": [phrase("الترك"), phrase("الاتراك"), phrase("التركيه")],
  "group/al-habasha": [phrase("الحبشه"), phrase("الحبش"), phrase("الحبشيون")],
  "group/al-qibt": [phrase("القبط"), phrase("الاقباط"), phrase("القبطيه")],
  "group/berbers": [phrase("البربر"), phrase("الامازيغ")],
  "group/kurds": [phrase("الاكراد"), phrase("الكرد")],
  "group/banu-israil": [phrase("بني اسراييل"), phrase("بنو اسراييل"), phrase("الاسراييليون")],
  "group/mongols": [phrase("التتر"), phrase("المغول")],
  // البطون — the tribal subdivisions
  "group/banu-al-muttalib": [phrase("بني المطلب"), phrase("بنو المطلب")],
  "group/banu-abd-dar": [phrase("بني عبد الدار"), phrase("بنو عبد الدار")],
  "group/banu-jumah": [phrase("بني جمح"), phrase("بنو جمح")],
  "group/banu-sahm": [phrase("بني سهم"), phrase("بنو سهم")],
  "group/banu-taym": [phrase("بني تيم"), phrase("بنو تيم")],
  "group/banu-adi": [phrase("بني عدي بن كعب"), phrase("بنو عدي")],
  "group/banu-abd-al-ashhal": [phrase("بني عبد الاشهل"), phrase("بنو عبد الاشهل")],
  "group/banu-zafar-al-aws": [phrase("بني ظفر"), phrase("بنو ظفر"), phrase("بني زعوراء"), phrase("بنو زعوراء")],
  "group/banu-haritha-al-aws": [phrase("بني حارثه"), phrase("بنو حارثه")],
  "group/banu-al-harith-al-khazraj": [phrase("بني الحارث"), phrase("بنو الحارث")],
  "group/banu-salima": [phrase("بني سالمه"), phrase("بنو سالمه")],
  "group/banu-zurayq": [phrase("بني زريق"), phrase("بنو زريق")],
  "group/banu-bayada": [phrase("بني بياضه"), phrase("بنو بياضه")],
  "group/banu-amr-ibn-awf": [phrase("بني عمرو بن عوف"), phrase("بنو عمرو بن عوف")],
  "group/banu-khatma": [phrase("بني ختمه"), phrase("بنو ختمه")],
  "group/banu-waqif": [phrase("بني واقف"), phrase("بنو واقف")],
  "group/banu-maghala": [phrase("بني مغاله"), phrase("بنو مغاله")],
  "group/banu-al-ajlan": [phrase("بني الاجلان"), phrase("بنو الاجلان")],
  "group/banu-dubayb": [phrase("بني ضبيبه"), phrase("بنو ضبيبه")],
  "group/banu-saida": [phrase("بني ساعده"), phrase("بنو ساعده")],
  "group/banu-salul": [phrase("بني سلول"), phrase("بنو سلول")],
  "group/banu-darim": [phrase("بني دارم"), phrase("بنو دارم")],
  "group/banu-hanzala": [phrase("بني حنظله"), phrase("بنو حنظله")],
  "group/banu-fazara": [phrase("بني فزاره"), phrase("بنو فزاره"), phrase("الفزاريون"), phrase("الفزاري")],
  "group/banu-murra": [phrase("بني مره"), phrase("بنو مره")],
  "group/banu-kilab": [phrase("بني كلاب"), phrase("بنو كلاب")],
  "group/banu-nasr": [phrase("بني نصر"), phrase("بنو نصر")],
  "group/banu-jusham": [phrase("بني جشم"), phrase("بنو جشم")],
  "group/banu-uqayl": [phrase("بني عقيل"), phrase("بنو عقيل"), phrase("العقيليون"), phrase("العقيلي")],
  "group/banu-sad-ibn-bakr": [phrase("بني سعد بن بكر"), phrase("بنو سعد بن بكر")],
  "group/banu-al-anbar": [phrase("بني العنبر من تميم"), phrase("بنو العنبر من تميم")],
  "group/banu-al-dil": [phrase("بني الديل"), phrase("بنو الديل")],
  "group/banu-al-harith-ibn-fihr": [phrase("بني الحارث بن فهر"), phrase("بنو الحارث بن فهر")],
  "group/banu-al-harith": [phrase("بني الحارث بن فهر"), phrase("بنو الحارث بن فهر")],
  "group/banu-al-mulawwah": [phrase("بني الملوّح"), phrase("بنو الملوّح")],
  "group/banu-amir-ibn-luayy": [phrase("بني عامر بن لؤي"), phrase("بنو عامر بن لؤي")],
  "group/banu-amir": [phrase("بني عامر بن لؤي"), phrase("بنو عامر بن لؤي")],
  "group/banu-asad-ibn-abd-al-uzza": [phrase("بني أسد بن عبد العزى"), phrase("بنو أسد بن عبد العزى")],
  "group/banu-awf-ibn-al-khazraj": [phrase("بني عوف بن الخزرج"), phrase("بنو عوف بن الخزرج")],
  "group/banu-dhuhl-ibn-shayban": [phrase("بني ذهل بن شيبان"), phrase("بنو ذهل بن شيبان")],
  "group/banu-dubaya-ibn-zayd": [phrase("بني ضبيعة بن زيد"), phrase("بنو ضبيعة بن زيد")],
  "group/banu-dula": [phrase("بني الضليع من جذام"), phrase("بنو الضليع من جذام")],
  "group/banu-hammud": [phrase("بني حمود"), phrase("بنو حمود")],
  "group/banu-ijl": [phrase("بني عجل"), phrase("بنو عجل")],
  "group/banu-jafn": [phrase("بني جفنة"), phrase("بنو جفنة")],
  "group/banu-mazyad": [phrase("بني مزيد الأسديون"), phrase("بنو مزيد الأسديون")],
  "group/banu-minqar": [phrase("بني منقر"), phrase("بنو منقر")],
  "group/banu-muharib-ibn-fihr": [phrase("بني محارب بن فهر"), phrase("بنو محارب بن فهر")],
  "group/banu-mujashi-ibn-darim": [phrase("بني مجاشع بن دارم"), phrase("بنو مجاشع بن دارم")],
  "group/banu-nabit": [phrase("بني النبيت"), phrase("بنو النبيت")],
  "group/banu-nawfal-ibn-abd-manaf": [phrase("بني نوفل بن عبد مناف"), phrase("بنو نوفل بن عبد مناف")],
  "group/banu-qays-ibn-thalaba": [phrase("بني قيس بن ثعلبة"), phrase("بنو قيس بن ثعلبة")],
  "group/banu-salim-ibn-awf": [phrase("بني سالم بن عوف"), phrase("بنو سالم بن عوف")],
  "group/banu-tahm": [phrase("بني تيم بن مرة"), phrase("بنو تيم بن مرة")],
  "group/banu-taym-allat": [phrase("بني تيم اللات بن ثعلبة"), phrase("بنو تيم اللات بن ثعلبة")],
  "group/banu-thalaba-ibn-amr": [phrase("بني ثعلبة بن عمرو"), phrase("بنو ثعلبة بن عمرو")],
  "group/banu-ubayd-ibn-zayd": [phrase("بني عبيد بن زيد"), phrase("بنو عبيد بن زيد")],
  "group/banu-umayya-ibn-zayd": [phrase("بني أمية بن زيد"), phrase("بنو أمية بن زيد")],
  "group/banu-wail-ibn-qasit": [phrase("بني وائل بن قاسط"), phrase("بنو وائل بن قاسط")],
  "group/banu-yashkur": [phrase("بني يشكر"), phrase("بنو يشكر")],
};

/** Class-level mentions: genealogy talk, tribe talk, butun talk, the prophets' tree. */
const GENERIC_PATTERNS: [AnsabGenericTopic, RegExp[]][] = [
  ["nasab", [
    gphrase("النسب"), gphrase("الانساب"), gphrase("نسبه"), gphrase("نسبها"), gphrase("انسابهم"),
    gphrase("النسابون"), gphrase("النسابين"), gphrase("نسابه"), gphrase("النسابه"), gphrase("منتسب"),
    gphrase("ينتسب"), gphrase("انتساب"), gphrase("سلاله"), gphrase("السلاله"), gphrase("عقبه"),
    gphrase("ذريته"), gphrase("ذريتها"), gphrase("النسل"), gphrase("جهره النسب"), gphrase("شجره النسب"),
    gphrase("نسب النبي"), gphrase("نسب الرسول"), gphrase("شجره الانبياء"),
  ]],
  ["tribes", [
    gphrase("القبيله"), gphrase("القبايل"), gphrase("قبايل العرب"), gphrase("العشيره"),
    gphrase("العشاير"), gphrase("الحي"), gphrase("الاحياء"), gphrase("بطون قريش"), gphrase("قبايل اليمن"),
    gphrase("قبايل الحجاز"), gphrase("قبايل نجد"), gphrase("القحطانيون"), gphrase("قحطانيه"),
    gphrase("قحطاني"), gphrase("العدنانيون"), gphrase("عدنانيه"), gphrase("عدناني"),
  ]],
  ["butun", [
    gphrase("البطن"), gphrase("البطون"), gphrase("بطون قريش"), gphrase("بطون القبيله"),
    gphrase("بطن من"), gphrase("بطونه"), gphrase("بطونها"), gphrase("الفخذ"), gphrase("الافخاذ"),
    gphrase("فخذه"), gphrase("افخاذها"), gphrase("الفصيله"), gphrase("الفصايل"), gphrase("العماره"),
  ]],
  ["prophets-tree", [
    gphrase("شجره الانبياء"), gphrase("شجره النبيين"), gphrase("شجره الرسل"),
    gphrase("نسل الانبياء"), gphrase("ذريه الانبياء"), gphrase("نسب الانبياء"),
    gphrase("نسب النبي"), gphrase("نسب الرسول"), gphrase("سلسله النسب"),
  ]],
];

/** English fallbacks for the museum's own translations (matn translations only). */
const EN_GENERIC: [AnsabGenericTopic, RegExp][] = [
  ["nasab", /\blineage\b|\bgenealogy\b|\bgenealogical\b|\bdescent\b/i],
  ["tribes", /\btribes?\b|\bclans?\b/i],
  ["butun", /\bbutun\b|\bbatun\b|\btribal subdivisions?\b|\bclan subdivisions?\b/i],
];

/** The Arabic matn a passage is judged on: frozen text_search first, then the matn text. */
const arabicMatnOf = (n: Node): string =>
  normalizeAnsabArabic(String(n.data.text_search ?? n.data.text ?? ""));
/** English is read only from the matn translation, never the label or summary. */
const englishMatnOf = (n: Node): string => {
  if (n.data.work === "work/quran") return "";
  const tr = n.data.translations as Record<string, { text?: string }> | undefined;
  return [tr?.en?.text].filter(Boolean).join(" ");
};

/** The ansab topics a passage mentions, detected from its own matn. */
export function ansabTopicsOf(n: Node): AnsabTopic[] {
  if (n.class !== "passage" || n.stub || ANSAB_EXCLUDE.has(n.id)) return [];
  const ar = ` ${arabicMatnOf(n)} `;
  const en = englishMatnOf(n).toLowerCase();
  const topics = new Set<AnsabTopic>();
  for (const [id, pats] of Object.entries(SUBJECT_PATTERNS) as [AnsabSubjectId, RegExp[]][]) {
    if (pats.some((p) => p.test(ar))) topics.add(id);
  }
  for (const [topic, pats] of GENERIC_PATTERNS) if (pats.some((p) => p.test(ar))) topics.add(topic);
  for (const [topic, pat] of EN_GENERIC) if (pat.test(en)) topics.add(topic);
  for (const t of [...topics]) if (ANSAB_TOPIC_EXCLUDE.has(`${n.id}:${t}`)) topics.delete(t);
  return [...topics];
}

/** True when the passage's own matn mentions a lineage, tribe, people, matn or the tree. */
export function isAnsabPassage(n: Node): boolean {
  return ansabTopicsOf(n).length > 0;
}

/**
 * Which corpus an ansab passage belongs to, from its work: the frozen Qur'an, the hadith
 * collections (genre `hadith` or a hadith-unit passage), the seerah books (genre `sira`), and
 * every other harvested work. Works not yet harvested land in the right section by their genre
 * the day their passages arrive.
 */
export function ansabCorpusOf(workId: string | undefined, genre: string[] | undefined, unit: string | undefined): AnsabCorpus {
  if (workId === "work/quran" || unit === "ayah") return "quran";
  if (genre?.includes("sira")) return "seerah";
  if (genre?.includes("hadith") || unit === "hadith") return "sunnah";
  return "books";
}

/** The section of a record: its `ansab-<section>` tag when registered, class fallback, else `mentioned`. */
export function ansabSectionOf(n: Node): AnsabSection {
  const tag = n.tags.find((t) => t.startsWith("ansab-") && t !== ANSAB_TAG);
  const id = tag?.slice(6) ?? "";
  if ((ANSAB_SECTIONS as readonly string[]).includes(id)) return id as AnsabSection;
  if (n.class === "group") return n.data.kind === "people" || n.data.kind === "population" ? "peoples" : "tribes";
  return n.tags.includes(ANSAB_TAG) ? "curated" : "mentioned";
}

/**
 * The prophets' tree, oldest ancestor first: the agreed chain Adnan → Muhammad then the disputed
 * links between Ismail and Adnan and Ibrahim's two lines. `agreed: false` marks the segment the
 * genealogists dispute (above Adnan), rendered in its own visual style — the three-part division
 * of concept/nasab-al-nabi.
 */
export interface AnsabChainLink { id: string; agreed: boolean }
export const ANSAB_PROPHET_CHAIN: AnsabChainLink[] = [
  { id: "person/ibrahim", agreed: true },
  { id: "person/ismail", agreed: true },
  { id: "person/qaydar", agreed: false },
  { id: "person/nabit-ibn-ahmar", agreed: false },
  { id: "person/ahmar-ibn-abd", agreed: false },
  { id: "person/abd-ibn-al-dhara", agreed: false },
  { id: "person/al-dhara-ibn-udr", agreed: false },
  { id: "person/udr-ibn-al-nashtan", agreed: false },
  { id: "person/al-nashtan-ibn-mashih", agreed: false },
  { id: "person/mashih-ibn-nabt", agreed: false },
  { id: "person/nabt-ibn-daid", agreed: false },
  { id: "person/daid-ibn-abaq", agreed: false },
  { id: "person/abaq-ibn-ays", agreed: false },
  { id: "person/ays-ibn-makhi", agreed: false },
  { id: "person/makhi-ibn-nahish", agreed: false },
  { id: "person/nahish-ibn-jahim", agreed: false },
  { id: "person/jahim-ibn-tabikh", agreed: false },
  { id: "person/tabikh-ibn-yadlaf", agreed: false },
  { id: "person/yadlaf-ibn-bildas", agreed: false },
  { id: "person/bildas-ibn-haza", agreed: false },
  { id: "person/haza-ibn-nashid", agreed: false },
  { id: "person/nashid-ibn-al-awwam", agreed: false },
  { id: "person/al-awwam-ibn-ubayy", agreed: false },
  { id: "person/ubayy-ibn-qamwal", agreed: false },
  { id: "person/qamwal-ibn-buz", agreed: false },
  { id: "person/buz-ibn-awf", agreed: false },
  { id: "person/awf-ibn-salman", agreed: false },
  { id: "person/salman-ibn-al-humaysa", agreed: false },
  { id: "person/al-humaysa-ibn-adad", agreed: false },
  { id: "person/adad-ibn-udd", agreed: false },
  { id: "person/udd-ibn-adnan", agreed: false },
  { id: "person/adnan", agreed: true },
  { id: "person/maadd-ibn-adnan", agreed: true },
  { id: "person/nizar-ibn-maadd", agreed: true },
  { id: "person/mudar-ibn-nizar", agreed: true },
  { id: "person/ilyas-ibn-mudar", agreed: true },
  { id: "person/mudrika-ibn-ilyas", agreed: true },
  { id: "person/khuzayma-ibn-mudrika", agreed: true },
  { id: "person/kinana-ibn-khuzayma", agreed: true },
  { id: "person/al-nadr-ibn-kinana", agreed: true },
  { id: "person/malik-ibn-al-nadr", agreed: true },
  { id: "person/fihr-ibn-malik", agreed: true },
  { id: "person/ghalib-ibn-fihr", agreed: true },
  { id: "person/luayy-ibn-ghalib", agreed: true },
  { id: "person/kab-ibn-luayy", agreed: true },
  { id: "person/murra-ibn-kab", agreed: true },
  { id: "person/kilab-ibn-murrah", agreed: true },
  { id: "person/qusayy-ibn-kilab", agreed: true },
  { id: "person/abd-manaf-ibn-qusayy", agreed: true },
  { id: "person/hashim-ibn-abd-manaf", agreed: true },
  { id: "person/abd-al-muttalib", agreed: true },
  { id: "person/abdullah-ibn-abd-al-muttalib", agreed: true },
  { id: "person/muhammad", agreed: true },
];
