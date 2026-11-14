// Hard block on terrorist-organisation content (docs/agents/content-safety.md).
// Pure functions so the check and its tests share one definition.

/** Phrases that look like a blocked name but are not (docs/agents/content-safety.md section 3). Removed before matching. */
export const NON_MATCHES: RegExp[] = [
  /Marj Dabiq/gi,
  /مرج دابق|مرج دابِق/g,
  /Taf[sś]ir al-Manar/gi,
  /تفسير المنار/g,
  /\bIbn[- ]Hamas\b/gi,
  /ابن حماس/g,
  /\bIsis Copia\b/g,
  /Islamic State of Afghanistan/g,
  /Origins of the Islamic State/g,
  /Islamic States in Java/g,
  /Public Freedoms in the Islamic State/g,
  /\bthe Islamic State\b(?= (?:\(|\[|as a|and its|in the|is the|of the (?:Prophet|early)))/g,
  /taliban[ -]ilm|طالبان علم|طالبا علم/gi,
  /hizb Allah|Hizb Allah/g,
  /Hudayr al-Kata'?ib|حضير الكتائب/gi,
  /Hamasa\b|Hamasah/gi,
  /Ançar Dine/g,
  /أنصار الإسلام الأرثوذكسي/g,
  /\(al-qa'ida\)/gi,
  /The Islamic State(?= and The Islamic Personality)/g,
];

/** Blocked names. Case-sensitive acronyms first, then names, then Arabic. Each carries a label for the error message.
 * Expanded 2026-11-14 from the official designation lists (EU Common Position 2001/931 list and ISIL/Al-Qaida
 * regime, US State Dept FTO + OFAC SDGT, Public Safety Canada, UN ISIL/Al-Qaida sanctions list, UK proscribed
 * organisations, Australia Criminal Code list, NZ designated entities). Seven further designated names whose
 * patterns also catch founder-kept existing records were ruled on by the founder on 14 November 2026: six
 * (Ansarallah/the Houthis, the IRGC, Ansar Dine, Hizb ut-Tahrir, Ansar al-Islam, the Sudanese Muslim
 * Brotherhood) are patterned below, with the surviving neutral mentions listed as exceptions and the
 * Haidara homonym guarded by a non-match; the seventh, Al-Andalus Media, stays held until the founder rules
 * on one ambiguous existing record (content-safety.md section 2). */
export const BLOCKED: { label: string; re: RegExp }[] = [
  { label: "ISIS/ISIL", re: /\b(?:ISIS|ISIL|ISWAP|AQAP|AQIM|AQIS|TTP|JNIM|GIA|HASAM|MUJAO)\b/ },
  { label: "Islamic State (group)", re: /\bIslamic State\b/ },
  {
    label: "blocked organisation",
    re: /\b(?:daesh|boko haram|abu sayyaf|al[- ]?qa'?[ie]da|al[- ]?qaida|al[- ]?shabaab|jabhat al[- ]?nusra|al[- ]?nusra|nusra front|hay'?at tahrir al[- ]?sham|hurras al[- ]?din|hamas|qassam brigades|hezbollah|hizbollah|hizballah|hizbullah|kata'?ib hezbollah|harakat al[- ]?nujaba|taliban|tehrik-i-taliban|tehrik-e-taliban|lashkar-e-taiba|lashkar-e-jhangvi|jaish-e-mohammed|haqqani network|harkat-ul-mujahideen|harakat ul[- ]?mujahidin|hizbul mujahideen|indian mujahideen|jemaah islamiyah|jemaah islamiyyah|jemaah anshorut tauhid|jammat[- ]ul mujahideen bangladesh|jama'?atul mujahideen bangladesh|ansar al[- ]?sharia|ansarullah bangla|ansaru|ansar bayt al[- ]?maqdis|asbat al[- ]?ansar|palestinian islamic jihad|abdallah azzam brigades|abdullah azzam brigades|al[- ]?ashtar brigades|al[- ]?murabitoun|al[- ]?muwaqi'?un bil dima|signed[- ]in[- ]blood battalion|al[- ]?gama'?a al[- ]?islamiyya|gama'?a al[- ]?islamiyya|al[- ]?jama'?a al[- ]?islamiyya|al[- ]?ittihad al[- ]?islamiya|caucasus emirate|imarat kavkaz|egyptian islamic jihad|islamic jihad group|islamic jihad union|eastern turkistan islamic movement|turkistan islamic party|fatemiyoun|macina liberation front|front de lib[ée]ration du macina|harakat al[- ]?sabireen|hezb[- ]e islami gulbuddin|international relief fund for the afflicted and needy|islamic movement of uzbekistan|islamic army of aden|jama'?at nusrat al[- ]?islam wal[- ]?muslimin|jaysh al[- ]?muhajirin wal[- ]?ansar|jund al[- ]?aqsa|jund al[- ]?khalifa|movement for oneness and jihad in west africa|ummah tameer[- ]e[- ]nau|lebanese muslim brotherhood|ansarallah|ansar allah|houthis?|al[- ]houthi|irgc|islamic revolutionary guard corps|revolutionary guards?|pasdaran|sepah|hizb ?ut[- ]tahrir|hizb al[- ]tahrir|ansar al[- ]islam|ansar al[- ]dine|ansar eddine|ansar dine|sudanese muslim brotherhood|muslim brotherhood in sudan|sudanese islamic movement)\b/i,
  },
  { label: "blocked media wing", re: /\b(?:amaq|rumiyah|as[- ]sahab|al[- ]malahem|az[- ]zallaqa|al[- ]kataib media|al[- ]furqan media|al[- ]hayat media|i'?tisam media|al[- ]aqsa tv|almanar\.com|al[- ]manar (?:tv|channel|television))\b/i },
  { label: "Dabiq/Rumiyah magazine", re: /\*(?:Dabiq|Rumiyah)\*|\b(?:Dabiq|Rumiyah) (?:magazine|issue)|magazine,? \*?(?:Dabiq|Rumiyah)|issues? of \*?(?:Dabiq|Rumiyah)/i },
  {
    label: "blocked organisation (Arabic/Urdu)",
    re: /داعش|تنظيم القاعدة|تنظيم الدولة الإسلامية|حركة حماس|كتائب القسام|حزب الله اللبناني|ميليشيا حزب الله|جبهة النصرة|هيئة تحرير الشام|بوكو حرام|حركة طالبان|تحریک طالبان|افغان طالبان|پاکستانی طالبان|طالبان(?:\s+(?:حکومت|رہنما|قیادت|حكومة|الأفغانية|الأفغانية|أفغانستان|افغانستان|پاکستان|باكستان))|حركة الشباب المجاهدين|جبہۃ النصرہ|کتائب حزب اللہ|حزب اللہ لبنان|جند الأقصى|تنظيم حراس الدين|الحوثي|الحرس الثوري|حزب التحرير|أنصار الدين|أنصار الإسلام|انصار الاسلام|الإخوان المسلمون في السودان|سپاه پاسداران|پاسداران/,
  },
];

export interface Hit { label: string; text: string }

/** Every blocked name found in `text` after the non-matches are removed. */
export function findBlocked(text: string): Hit[] {
  let t = text;
  for (const nm of NON_MATCHES) t = t.replace(nm, " ");
  const hits: Hit[] = [];
  for (const { label, re } of BLOCKED) {
    const m = re.exec(t);
    if (m) hits.push({ label, text: m[0] });
  }
  return hits;
}

/** Entity ids ("class/slug") listed in backticks in the exceptions document. */
export function parseExceptions(md: string): Set<string> {
  const ids = new Set<string>();
  for (const m of md.matchAll(/^- `([a-z_]+\/[^`]+)`/gm)) ids.add(m[1]);
  return ids;
}

/** "class/slug" for a data or content path, or null for files that are not entities. */
export function entityOfPath(p: string): string | null {
  const m = /^(?:data|content)\/(?:[a-z]{2}\/)?([a-z_]+)\/([^/]+)\.(?:yaml|md)$/.exec(p.replace(/\\/g, "/"));
  return m && !m[2].startsWith("_") ? `${m[1]}/${m[2]}` : null;
}
