// Deep links to sunnah.com. Their public URL scheme is {collection}:{number};
// only collections whose global hadith numbering matches our `ref` get report links.
// The Muwatta's numbering (book.report, Fulaani edition) does not map, so it links
// at collection level only. Jami' al-Ulum wa-l-Hikam is not on sunnah.com.
const COLLECTIONS: Record<string, string> = {
  "work/sahih-al-bukhari": "bukhari",
  "work/sahih-muslim": "muslim",
  "work/muwatta-malik": "malik",
  "work/arbaun-nawawi": "nawawi40",
};
const REPORT_LINKABLE = new Set(["work/sahih-al-bukhari", "work/sahih-muslim", "work/arbaun-nawawi"]);

export const sunnahCollection = (work?: string) => (work && COLLECTIONS[work] ? `https://sunnah.com/${COLLECTIONS[work]}` : undefined);

export const sunnahReport = (work: string, ref?: string | number) =>
  ref !== undefined && REPORT_LINKABLE.has(work) && /^\d+$/.test(String(ref)) ? `https://sunnah.com/${COLLECTIONS[work]}:${ref}` : undefined;

/** A book (kitab) of a hadith collection: a chapter record whose reference is `kitab-<n>`. A chapter record of any
 *  other reference is a page-numbered excerpt, which is listed with the reports and never as a book (audit S22). */
export const isKitab = (n: { class: string; data: Record<string, unknown> }): boolean =>
  n.class === "passage" && n.data.unit === "chapter" && /^kitab-/.test(String(n.data.ref ?? ""));
