// Shared by the two harvesters of the Rulings Browser (scripts/harvest-ahkam-hadithapi.ts,
// scripts/harvest-ahkam-ocr.ts; docs/plan/73-ahkam-browser.md): the wording of labels and
// summaries per signal in the five languages, and the record each theme's passages point at.
// The cleaner that leaves honorific formulas out is the one the arkan harvesters use.
import type { AhkamTopic } from "./ahkam.js";

export { clean, HONORIFIC_LEFT, q, uniq } from "./arkan-harvest-lib.js";

/** ar, en, ur, fr, es. */
export type Five = [string, string, string, string, string];
export const LANGS5 = ["ar", "en", "ur", "fr", "es"] as const;

/** The record each theme's passages mention. */
export const AHKAM_ANCHOR: Record<AhkamTopic, string> = {
  fard: "concept/fard",
  "fard-ayn": "concept/fard-ayn",
  "fard-kifaya": "concept/fard-kifaya",
  taat: "concept/taa",
  wajib: "concept/wajib-fiqh",
  mustahabb: "concept/nadb",
  haram: "concept/haram-hukm",
  makruh: "concept/makruh",
  saghair: "concept/minor-sins-saghair",
  mubah: "concept/ibaha",
};

export const BROWSER_NAME: Five = [
  "متصفح الفروض والواجبات والطاعات والمستحبات والمكروهات والمحرمات وصغائر الذنوب",
  "The Rulings Browser (obligations, acts of obedience, recommended, disliked and forbidden acts, and minor sins)",
  "فرائض، واجبات، طاعات، مستحبات، مکروہات، محرمات اور صغیرہ گناہوں کا براؤزر",
  "Le Navigateur des statuts légaux (obligations, actes d'obéissance, actes recommandés, réprouvés et interdits, péchés mineurs)",
  "El Explorador de las calificaciones legales (obligaciones, actos de obediencia, actos recomendados, reprobados y prohibidos, y pecados menores)",
];

/** What each signal says, for the label and the summary. */
export const SAYS: Record<string, Five> = {
  "fard:farida": ["الفريضة والفرائض", "the obligation (farida)", "فریضہ اور فرائض", "l'obligation (farida)", "la obligación (farida)"],
  "fard:farada-allah": ["ما فرضه الله ورسوله", "what God and His Messenger made obligatory", "جو اللہ اور اس کے رسول نے فرض کیا", "ce que Dieu et Son Messager ont rendu obligatoire", "lo que Dios y Su Mensajero hicieron obligatorio"],
  "fard:farada-ala": ["ما فُرض على الناس", "what was made obligatory on people", "جو لوگوں پر فرض کیا گیا", "ce qui a été imposé aux gens", "lo que se impuso a la gente"],
  "fard:fard": ["الفرض", "the obligatory (fard)", "فرض", "l'obligatoire (fard)", "lo obligatorio (fard)"],
  "fard:kutiba": ["ما كُتب على المؤمنين", "what was prescribed for the believers", "جو مومنوں پر لکھ دیا گیا", "ce qui a été prescrit aux croyants", "lo que se prescribió a los creyentes"],
  "fard:maktuba": ["الصلاة المكتوبة", "the prescribed prayer", "فرض نماز", "la prière prescrite", "la oración prescrita"],
  "fard-ayn:fard-ayn": ["فرض العين", "the individual obligation (fard 'ayn)", "فرضِ عین", "l'obligation individuelle (fard 'ayn)", "la obligación individual (fard 'ayn)"],
  "fard-ayn:ala-kull": ["ما وجب على كل مسلم", "a duty laid on every Muslim", "جو ہر مسلمان پر لازم ہے", "un devoir imposé à chaque musulman", "un deber impuesto a cada musulmán"],
  "fard-kifaya:fard-kifaya": ["فرض الكفاية", "the communal obligation (fard kifaya)", "فرضِ کفایہ", "l'obligation collective (fard kifaya)", "la obligación colectiva (fard kifaya)"],
  "fard-kifaya:saqata-an-al-baqin": ["ما إذا قام به البعض سقط عن الباقين", "what is lifted from the rest when some carry it out", "جسے کچھ لوگ ادا کر دیں تو باقیوں سے ساقط ہو جاتا ہے", "ce dont les autres sont déchargés quand certains l'accomplissent", "lo que deja de obligar a los demás cuando algunos lo cumplen"],
  "taat:taat": ["الطاعات", "the acts of obedience", "طاعات", "les actes d'obéissance", "los actos de obediencia"],
  "taat:taat-allah": ["طاعة الله ورسوله", "obedience to God and His Messenger", "اللہ اور اس کے رسول کی اطاعت", "l'obéissance à Dieu et à Son Messager", "la obediencia a Dios y a Su Mensajero"],
  "taat:ataa-allah": ["من أطاع الله ورسوله", "whoever obeys God and His Messenger", "جس نے اللہ اور اس کے رسول کی اطاعت کی", "celui qui obéit à Dieu et à Son Messager", "quien obedece a Dios y a Su Mensajero"],
  "taat:taa": ["الطاعة والمعصية", "obedience and disobedience", "اطاعت اور معصیت", "l'obéissance et la désobéissance", "la obediencia y la desobediencia"],
  "taat:sam-wa-taa": ["السمع والطاعة", "hearing and obeying", "سننا اور ماننا", "écouter et obéir", "oír y obedecer"],
  "taat:taa-bare": ["الطاعة", "obedience", "اطاعت", "l'obéissance", "la obediencia"],
  "wajib:wajib": ["الواجب", "the obligatory (wajib)", "واجب", "l'obligatoire (wajib)", "lo obligatorio (wajib)"],
  "wajib:wujub": ["الوجوب", "obligation (wujub)", "وجوب", "l'obligation (wujub)", "la obligatoriedad (wujub)"],
  "wajib:yajib": ["ما يجب على المكلف", "what is binding on the person addressed", "جو مکلف پر واجب ہے", "ce qui s'impose à la personne responsable", "lo que obliga a la persona responsable"],
  "wajib:yajib-an": ["ما يجب", "what must be done", "جو واجب ہے", "ce qui doit être fait", "lo que debe hacerse"],
  "wajib:law-wajabat": ["«لو قلت نعم لوجبت»", "'had I said yes, it would have become obligatory'", "«اگر میں ہاں کہہ دیتا تو واجب ہو جاتا»", "« si j'avais dit oui, cela serait devenu obligatoire »", "«si hubiera dicho que sí, se habría hecho obligatorio»"],
  "wajib:haqq-ala": ["حق على كل مسلم", "a right due from every Muslim", "ہر مسلمان پر حق", "un droit dû par chaque musulman", "un derecho debido por cada musulmán"],
  "wajib:azma": ["عزمة من عزمات الله", "a firm command of God", "اللہ کے قطعی احکام میں سے ایک", "un commandement ferme de Dieu", "un mandato firme de Dios"],
  "wajib:hatm": ["الحتم", "the binding (hatm)", "حتمی حکم", "le contraignant (hatm)", "lo vinculante (hatm)"],
  "wajib:haqq-al-muslim": ["حق المسلم على المسلم", "what a Muslim owes a Muslim", "مسلمان کا مسلمان پر حق", "ce qu'un musulman doit à un musulman", "lo que un musulmán debe a otro musulmán"],
  "mustahabb:mustahabb": ["المستحب", "the recommended (mustahabb)", "مستحب", "le recommandé (mustahabb)", "lo recomendado (mustahabb)"],
  "mustahabb:mandub": ["المندوب", "the recommended (mandub)", "مندوب", "le recommandé (mandub)", "lo recomendado (mandub)"],
  "mustahabb:nafila": ["النافلة والنوافل", "the supererogatory (nafila)", "نفل اور نوافل", "le surérogatoire (nafila)", "lo supererogatorio (nafila)"],
  "mustahabb:tatawwu": ["التطوع", "the voluntary act (tatawwu')", "تطوع ⁦(نفلی عمل)⁩", "l'acte volontaire (tatawwu')", "el acto voluntario (tatawwu')"],
  "mustahabb:not-wajib": ["ما ليس بواجب", "what is said not to be obligatory", "جو واجب نہیں", "ce qui est dit non obligatoire", "lo que se dice que no es obligatorio"],
  "mustahabb:lawla-an-ashuqq": ["«لولا أن أشق على أمتي»", "'were it not that I would burden my community'", "«اگر مجھے اپنی امت پر مشقت کا خیال نہ ہوتا»", "« si je ne craignais d'accabler ma communauté »", "«si no temiera agobiar a mi comunidad»"],
  "mustahabb:khashyat-an-tufrad": ["ما تُرك خشية أن يُفرض", "what was left for fear it would be made obligatory", "جو فرض ہو جانے کے اندیشے سے چھوڑا گیا", "ce qui fut délaissé de crainte qu'il ne devienne obligatoire", "lo que se dejó por temor a que se hiciera obligatorio"],
  "mustahabb:sunna-muakkada": ["السنن المؤكدة والرواتب", "the emphasised and regular sunnas", "سننِ مؤکدہ اور رواتب", "les sunnas appuyées et régulières", "las sunnas enfatizadas y regulares"],
  "mustahabb:targhib": ["الترغيب في العمل", "encouragement to an act", "عمل کی ترغیب", "l'encouragement à un acte", "el estímulo a un acto"],
  "mustahabb:li-man-sha": ["ما جُعل لمن شاء", "what is left to whoever wishes", "جو چاہنے والے کے لیے چھوڑا گیا", "ce qui est laissé à qui le veut", "lo que se deja a quien quiera"],
  "mustahabb:nadb-bare": ["الندب", "recommendation (nadb)", "ندب", "la recommandation (nadb)", "la recomendación (nadb)"],
  "haram:haram": ["الحرام", "the forbidden (haram)", "حرام", "l'interdit (haram)", "lo prohibido (haram)"],
  "haram:la-yahill": ["ما لا يحل", "what is not lawful", "جو حلال نہیں", "ce qui n'est pas licite", "lo que no es lícito"],
  "haram:harrama-allah": ["ما حرّم الله ورسوله", "what God and His Messenger forbade", "جو اللہ اور اس کے رسول نے حرام کیا", "ce que Dieu et Son Messager ont interdit", "lo que Dios y Su Mensajero prohibieron"],
  "haram:harrama-ala": ["ما حُرّم على الناس", "what was forbidden to people", "جو لوگوں پر حرام کیا گیا", "ce qui a été interdit aux gens", "lo que se prohibió a la gente"],
  "haram:harramna": ["التحريم", "forbidding", "حرام ٹھہرانا", "l'interdiction", "la prohibición"],
  "haram:tahrim": ["التحريم", "forbidding (tahrim)", "تحریم", "l'interdiction (tahrim)", "la prohibición (tahrim)"],
  "haram:muharramat": ["المحرمات ومحارم الله", "the forbidden things", "محرمات", "les choses interdites", "las cosas prohibidas"],
  "haram:maharim": ["المحارم", "the forbidden things (maharim)", "محارم", "les interdits (maharim)", "lo vedado (maharim)"],
  "makruh:makruh": ["المكروه", "the disliked (makruh)", "مکروہ", "le réprouvé (makruh)", "lo reprobado (makruh)"],
  "makruh:karaha": ["الكراهة", "dislike (karaha)", "کراہت", "la réprobation (karaha)", "la reprobación (karaha)"],
  "makruh:karaha-bare": ["الكراهة", "dislike (karaha)", "کراہت", "la réprobation (karaha)", "la reprobación (karaha)"],
  "makruh:kana-yakrah": ["ما كان يُكره", "what used to be disliked", "جو ناپسند کیا جاتا تھا", "ce qui était réprouvé", "lo que se reprobaba"],
  "makruh:kariha-lakum": ["ما كرهه الله للناس", "what God disliked for people", "جو اللہ نے لوگوں کے لیے ناپسند کیا", "ce que Dieu a réprouvé pour les gens", "lo que Dios reprobó para la gente"],
  "makruh:fuqaha-karihu": ["ما كرهه الفقهاء", "what the jurists disliked", "جسے فقہاء نے مکروہ کہا", "ce que les juristes ont réprouvé", "lo que los juristas reprobaron"],
  "makruh:lam-yuzam": ["نهي لم يُعزم فيه", "a prohibition that was not made firm", "وہ ممانعت جس میں سختی نہیں کی گئی", "une interdiction qui ne fut pas rendue ferme", "una prohibición que no se hizo firme"],
  "makruh:karih": ["ما كُره", "what was disliked", "جو ناپسند کیا گیا", "ce qui fut réprouvé", "lo que se reprobó"],
  "saghair:saghair": ["صغائر الذنوب", "the minor sins", "صغیرہ گناہ", "les péchés mineurs", "los pecados menores"],
  "saghair:muhaqqarat": ["محقرات الذنوب", "the sins held to be slight", "وہ گناہ جنہیں معمولی سمجھا جاتا ہے", "les péchés tenus pour légers", "los pecados tenidos por leves"],
  "saghair:lamam": ["اللمم", "the lamam (small faults)", "لمم ⁦(چھوٹی لغزشیں)⁩", "le lamam (fautes légères)", "el lamam (faltas leves)"],
  "saghair:ijtinab-al-kabair": ["ما يُكفَّر باجتناب الكبائر", "what is expiated when the major sins are avoided", "جو کبیرہ گناہوں سے بچنے پر معاف ہو جاتا ہے", "ce qui est expié quand les grands péchés sont évités", "lo que se expía cuando se evitan los pecados mayores"],
  "saghair:zina-al-ayn": ["زنا العين واللسان", "the 'adultery' of the eye and the tongue", "آنکھ اور زبان کا زنا", "l'« adultère » de l'œil et de la langue", "el «adulterio» del ojo y de la lengua"],
  "saghair:israr": ["الإصرار على الذنب", "persistence in a sin", "گناہ پر اصرار", "la persistance dans le péché", "la persistencia en el pecado"],
  "mubah:mubah": ["المباح", "the permitted (mubah)", "مباح", "le permis (mubah)", "lo permitido (mubah)"],
  "mubah:rukhsa": ["الرخصة", "the concession (rukhsa)", "رخصت", "la dispense (rukhsa)", "la dispensa (rukhsa)"],
  "mubah:azima-rukhsa": ["الرخصة والعزيمة", "the concession and the original rule", "رخصت اور عزیمت", "la dispense et la règle d'origine", "la dispensa y la regla original"],
  "mubah:afw": ["ما سُكت عنه فهو عفو", "what was passed over in silence and so pardoned", "جس سے سکوت کیا گیا وہ معاف ہے", "ce qui fut passé sous silence et donc pardonné", "lo que se pasó en silencio y quedó dispensado"],
  "mubah:la-junah": ["ما لا حرج فيه", "what carries no blame", "جس میں کوئی حرج نہیں", "ce qui n'entraîne aucun blâme", "lo que no acarrea reproche"],
  "mubah:la-bas": ["ما لا بأس به", "what is said to be no harm", "جس میں کوئی مضائقہ نہیں", "ce qui est dit sans inconvénient", "lo que se dice que no tiene inconveniente"],
};

/** The five-language label block as one YAML line. */
export const five = (v: Record<(typeof LANGS5)[number], string>, quote: (s: string) => string) =>
  `{ ${LANGS5.map((l) => `${l}: ${quote(v[l])}`).join(", ")} }`;
