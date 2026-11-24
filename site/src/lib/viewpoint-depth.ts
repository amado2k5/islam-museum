// Depth blocks of the viewpoint pages (founder request, 23 November 2026, ported onto the nine viewpoints on 24 November):
// questions answered from the museum's own question records, a first-week list, a table of figures shared with Christianity and
// Judaism, and shelves of resources (listing records whose own websites were opened and read on 23 November 2026).
// Everything points at records already in the graph; nothing here is a new claim. Text: `vpdepth` in i18n/<lang>.yaml.
import type { Viewpoint } from "./viewpoints";

/** Question records each viewpoint puts up front, in order (ids are `question/<slug>`). */
export const QUESTIONS: Record<Viewpoint, string[]> = {
  new: ["what-is-islam", "what-are-five-pillars", "who-was-muhammad", "what-is-the-quran", "why-no-alcohol", "what-is-birr", "what-is-hijab", "what-is-jihad", "what-is-difference-sunni-shia", "what-is-qadar", "what-is-the-afterlife", "what-is-sabr"],
  back: ["what-is-salah", "why-five-daily-prayers", "what-is-dhikr", "what-is-niyya", "what-is-sabr", "what-is-ihsan", "what-is-taqwa", "what-is-dua"],
  five: ["what-is-ijtihad", "what-is-ijma", "what-is-fiqh", "must-a-layperson-follow-one-madhhab", "what-is-sanad", "what-is-tafsir", "what-is-ihsan", "do-the-texts-of-revelation-yield-certainty"],
  curious: ["what-is-islam", "who-was-muhammad", "what-is-the-quran", "what-are-five-pillars", "what-is-mosque", "what-is-ramadan", "what-is-hajj", "what-is-kaaba"],
  doubt: ["what-is-islam", "who-was-muhammad", "what-is-the-quran", "what-is-tawhid", "who-was-isa", "what-is-the-afterlife", "what-is-qadar", "what-is-jihad", "what-is-sharia", "is-human-evolution-compatible-with-islam", "why-five-daily-prayers", "why-fast-in-ramadan"],
  research: ["what-is-sanad", "what-is-hadith", "what-is-difference-quran-hadith", "what-is-tafsir", "what-is-fiqh", "what-is-ijma", "what-is-ijtihad", "are-the-seven-readings-the-seven-ahruf", "is-the-order-of-the-suras-fixed-by-revelation", "do-the-texts-of-revelation-yield-certainty"],
  learn: ["what-is-niyya", "what-is-ihsan", "what-is-taqwa", "what-is-ikhlas", "what-is-sabr", "what-is-tawakkul", "what-is-dhikr", "what-is-ilm", "what-is-adab", "must-a-layperson-follow-one-madhhab"],
  challenge: ["what-is-jihad", "what-is-sharia", "what-is-hijab", "why-is-riba-forbidden", "why-is-gambling-forbidden", "what-is-the-hadd-for-drinking-wine", "what-is-talaq", "what-were-the-crusades", "who-were-the-khawarij", "what-is-difference-sunni-shia", "who-was-aisha"],
  pass: ["what-is-islam", "what-are-five-pillars", "who-was-muhammad", "what-is-the-quran"],
};

/** The first-week list of "New to Islam": question records, each with a tick box that is not saved. */
export const CHECKLIST: Partial<Record<Viewpoint, string[]>> = {
  new: ["what-is-shahada", "what-is-wudu", "what-is-ghusl", "what-is-salah", "what-is-adhan", "what-is-halal", "what-is-dua", "what-is-birr", "what-is-ramadan", "what-is-zakat"],
};

/** Figures the Qur'an and the Bible and Torah traditions share (question records): a table for views that ask how Islam compares. */
export const COMPARE: Viewpoint[] = ["new", "curious", "doubt", "challenge"];
export const COMPARE_IDS: string[] = ["who-was-adam", "who-was-nuh", "who-was-ibrahim", "who-was-musa", "who-was-dawud", "who-was-sulayman", "who-was-yunus", "who-was-yusuf", "who-was-isa"];

/** Shelves of checked resources: listing ids (`listing/<slug>`); the shelf title is `vpdepth.shelves.<key>`. */
export const SHELVES: Record<Viewpoint, { key: string; ids: string[] }[]> = {
  new: [
    { key: "support", ids: ["new-muslim-care", "newmuslim-net", "convert-muslim-foundation", "rabata-convert-care", "mcc-east-bay-convert-care", "iera"] },
    { key: "places", ids: ["zabihah", "halaltrip", "muslim-pro", "islamicfinder", "halalbooking"] },
    { key: "books", ids: ["mecca-books", "dar-us-salam-usa", "islamic-bookstore-com", "kube-publishing", "goodword-books", "white-thread-press"] },
    { key: "dress", ids: ["haute-hijab", "modanisa", "verona-collection"] },
    { key: "learn", ids: ["almaghrib", "yaqeen", "quran-com", "islamqa"] },
    { key: "help", ids: ["cair", "mend", "tell-mama"] },
  ],
  back: [
    { key: "places", ids: ["islamicfinder", "muslim-pro", "halaltrip", "zabihah"] },
    { key: "learn", ids: ["almaghrib", "yaqeen", "quran-com", "islamqa"] },
    { key: "books", ids: ["kube-publishing", "mecca-books", "white-thread-press"] },
  ],
  five: [
    { key: "books", ids: ["turath-publishing", "white-thread-press", "kube-publishing", "mecca-books"] },
    { key: "learn", ids: ["almaghrib", "yaqeen", "quran-com", "sunnah-com"] },
  ],
  curious: [
    { key: "learn", ids: ["yaqeen", "quran-com", "islamqa"] },
    { key: "books", ids: ["kube-publishing", "mecca-books"] },
  ],
  doubt: [
    { key: "learn", ids: ["yaqeen", "quran-com", "sunnah-com", "islamqa"] },
    { key: "books", ids: ["kube-publishing", "mecca-books"] },
  ],
  research: [{ key: "texts", ids: ["quran-com", "sunnah-com", "islam360", "yaqeen"] }],
  learn: [
    { key: "learn", ids: ["almaghrib", "yaqeen", "quran-com", "sunnah-com", "islamqa"] },
    { key: "tools", ids: ["muslim-pro", "tarteel", "islamicfinder"] },
    { key: "books", ids: ["kube-publishing", "white-thread-press", "turath-publishing", "mecca-books"] },
  ],
  challenge: [{ key: "texts", ids: ["quran-com", "sunnah-com", "yaqeen"] }],
  pass: [],
};
