// Shared by the two harvesters of the Pillars and Branches of Faith Browser
// (scripts/harvest-arkan-hadithapi.ts, scripts/harvest-arkan-ocr.ts; docs/plan/61-arkan-browser.md):
// the wording of labels and summaries per signal, the umbrella each theme's passages point at,
// and the cleaner that leaves honorific formulas out (the UI renders them).
import type { ArkanTopic } from "./arkan.js";

/** The record each theme's passages mention. */
export const ARKAN_ANCHOR: Record<ArkanTopic, string> = {
  islam: "concept/five-pillars",
  iman: "concept/arkan-al-iman",
  shuab: "concept/shuab-al-iman",
  khisal: "concept/khisal-al-mumin",
};
export const TOPIC_SAYS: Record<ArkanTopic, [string, string, string]> = {
  islam: ["أركان الإسلام", "the pillars of Islam", "ارکانِ اسلام"],
  iman: ["أركان الإيمان", "the pillars of faith", "ارکانِ ایمان"],
  shuab: ["شعب الإيمان", "the branches of faith", "ایمان کی شاخیں"],
  khisal: ["خصال المؤمن", "the traits of the believer", "مومن کی خصلتیں"],
};
/** What each signal says, for the label and the summary, in the three languages. */
export const SAYS: Record<string, [string, string, string]> = {
  "islam:arkan-al-islam": ["أركان الإسلام", "the pillars of Islam", "ارکانِ اسلام"],
  "islam:buniya": ["ما بُني عليه الإسلام", "what Islam is built on", "وہ جن پر اسلام کی بنیاد ہے"],
  "islam:ma-al-islam": ["تعريف الإسلام بأعماله", "Islam defined by its acts", "اسلام کی تعریف اس کے اعمال سے"],
  "islam:khams": ["الصلاة والزكاة والصوم والحج مجتمعة", "the prayer, the zakat, the fast and the pilgrimage named together", "نماز، زکوٰۃ، روزہ اور حج ایک ساتھ"],
  "islam:shahada-salat-zakat": ["الشهادة والصلاة والزكاة", "the testimony, the prayer and the zakat", "شہادت، نماز اور زکوٰۃ"],
  "iman:arkan-al-iman": ["أركان الإيمان", "the pillars of faith", "ارکانِ ایمان"],
  "iman:an-tumina": ["الإيمان بالله وملائكته وكتبه ورسله", "belief in God, His angels, His books and His messengers", "اللہ، اس کے فرشتوں، کتابوں اور رسولوں پر ایمان"],
  "iman:qadar": ["الإيمان بالقدر", "belief in the decree", "تقدیر پر ایمان"],
  "iman:ma-al-iman": ["السؤال عن الإيمان وجوابه", "the question about faith and its answer", "ایمان کے بارے میں سوال اور اس کا جواب"],
  "iman:article": ["ركن من أركان الإيمان", "one of the articles of faith", "ایمان کا ایک رکن"],
  "iman:bath": ["الإيمان بالبعث", "belief in the resurrection", "دوبارہ اٹھائے جانے پر ایمان"],
  "shuab:shuab": ["شعب الإيمان", "the branches of faith", "ایمان کی شاخیں"],
  "shuab:bid-wa-sabun": ["الإيمان بضع وسبعون شعبة", "faith as seventy-odd branches", "ایمان کی ستر سے کچھ اوپر شاخیں"],
  "shuab:min-al-iman": ["ما عُدّ من الإيمان", "what is counted as part of faith", "جو ایمان میں سے گنا گیا"],
  "shuab:iman-quality": ["حلاوة الإيمان وكماله", "the sweetness and completeness of faith", "ایمان کی مٹھاس اور اس کا کمال"],
  "shuab:la-yuminu": ["ما لا يتم الإيمان إلا به", "what faith is not complete without", "جس کے بغیر ایمان مکمل نہیں"],
  "shuab:man-kana-yuminu": ["عمل معلَّق بالإيمان بالله واليوم الآخر", "an act tied to belief in God and the Last Day", "اللہ اور یومِ آخرت پر ایمان سے جڑا عمل"],
  "shuab:wa-huwa-mumin": ["ما يرتفع معه الإيمان حين الفعل", "what faith is lifted by at the moment of the act", "وہ عمل جس کے وقت ایمان اٹھ جاتا ہے"],
  "shuab:afdal-al-amal": ["الإيمان أفضل الأعمال", "faith as the best of deeds", "ایمان بہترین عمل"],
  "shuab:mithqal": ["تفاضل الإيمان في القلوب", "the degrees of faith in hearts", "دلوں میں ایمان کے درجے"],
  "khisal:haqq": ["حق المؤمن على المؤمن", "what a believer owes a believer", "مومن کا مومن پر حق"],
  "shuab:ziyada": ["زيادة الإيمان ونقصانه", "faith increasing and decreasing", "ایمان کا بڑھنا اور گھٹنا"],
  "khisal:khisal": ["خصال المؤمن", "the traits of the believer", "مومن کی خصلتیں"],
  "khisal:min-kunna-fih": ["خصال من كنّ فيه", "traits that, found in a person, mark faith", "وہ خصلتیں جو جس میں ہوں"],
  "khisal:mathal-al-mumin": ["مَثَل المؤمن", "the likeness of the believer", "مومن کی مثال"],
  "khisal:al-mumin": ["وصف المؤمن", "a description of the believer", "مومن کا وصف"],
  "khisal:al-muslim": ["وصف المسلم", "a description of the Muslim", "مسلمان کا وصف"],
};

const HONORIFICS = /\s*(?:صلى\s+الله\s+عليه\s+وسلم|صلى\s+الله\s+عليه\s+وآله\s+وسلم|رضى\s+الله\s+عن(?:ه|ها|هما|هم)|رضي\s+الله\s+عن(?:ه|ها|هما|هم)|عليه\s+السلام|عليهما\s+السلام|عليهم\s+السلام|رحمه\s+الله)/g;
const MARKS = /[ً-ٰٟۖ-ۭـ]/;
/** Drop honorific formulas and the edition's directional marks. */
export function clean(raw: string): string {
  // match honorifics on a vowel-less shadow, cut the same spans from the vowelled text
  const map: number[] = [];
  let shadow = "";
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (MARKS.test(c)) continue;
    shadow += c;
    map.push(i);
  }
  const cuts: [number, number][] = [];
  for (const m of shadow.matchAll(HONORIFICS)) {
    const a = map[m.index!];
    const last = m.index! + m[0].length;
    const b = last < map.length ? map[last] : raw.length;
    cuts.push([a, b]);
  }
  let out = "";
  let at = 0;
  for (const [a, b] of cuts) { out += raw.slice(at, a); at = b; }
  out += raw.slice(at);
  return out.replace(/[‎‏‪-‮]/g, "").replace(/\s+([،.])/g, "$1").replace(/\s+/g, " ").trim();
}
/** Honorific formulas spelled in a way the cleaner does not cut: such a text is skipped, not repaired. */
export const HONORIFIC_LEFT = /رض[يى] ا*لل?ه|رضوان ا+لله|صل[يى] ا*لل?ه|عليه وسلم|عليه السلام|عليهم السلام|عليها السلام|عليه الصلاة|رحمه الله|رحمهم الله|رحمة الله عليه|قدس الله|كرم الله وجهه|ﷺ|ﷻ/;
export const q = (s: string) => JSON.stringify(s);
export const uniq = <T,>(xs: T[]) => [...new Set(xs)];
