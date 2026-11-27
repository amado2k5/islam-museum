// The Lamp of the Ages: the destinations and their missions. Every record named here is a museum record (data/<class>/
// <slug>.yaml); tools/build-records.ts copies their labels, summaries, years and coordinates into data/records.json,
// and nothing the game shows about history comes from anywhere else. The travel, the lamp, the jinni who guides and
// the record cards carried in the satchel are fiction, and the page says so.

export interface Question {
  /** "where" asks for a place, "who" for a person. */
  kind: "where" | "who";
  /** The record whose summary the question is about. */
  about: string;
  /** The right answer, a record id. */
  answer: string;
  /** Two wrong answers, record ids. */
  options: [string, string];
  /** An English phrase that stands in the summary of `about` and names the answer (held by a test). */
  evidence: string;
}

export interface Destination {
  id: string;
  /** The place record, which gives the map position. */
  place: string;
  /** The record whose year sets the century on the time dial. */
  when: string;
  /** The figure met here, who may then travel with the player. */
  figure: string;
  /** Records shown at the destination besides the place and the figure. */
  see: string[];
  question: Question;
  /** A record card the player must carry before the lamp opens the way here, or null. */
  needs: string | null;
  /** The record card the player takes away. */
  gives: string;
}

export const DESTINATIONS: readonly Destination[] = [
  {
    id: "baghdad",
    place: "place/baghdad",
    when: "person/al-khwarizmi",
    figure: "person/al-khwarizmi",
    see: ["building/bayt-al-hikma"],
    question: { kind: "where", about: "person/al-khwarizmi", answer: "building/bayt-al-hikma", options: ["building/alhambra", "place/cairo"], evidence: "House of Wisdom" },
    needs: null,
    gives: "work/kitab-al-hisab-al-khwarizmi",
  },
  {
    id: "cordoba",
    place: "place/cordoba",
    when: "event/abd-al-rahman-ii-expands-cordoba-mosque",
    figure: "person/abbas-ibn-firnas",
    see: ["event/abd-al-rahman-ii-expands-cordoba-mosque"],
    question: { kind: "where", about: "person/abbas-ibn-firnas", answer: "place/cordoba", options: ["place/baghdad", "place/timbuktu"], evidence: "Cordoba" },
    needs: null,
    gives: "event/abd-al-rahman-ii-expands-cordoba-mosque",
  },
  {
    id: "cairo",
    place: "place/cairo",
    when: "event/ibn-al-haytham-summoned-to-cairo",
    figure: "person/ibn-al-haytham",
    see: ["event/ibn-al-haytham-summoned-to-cairo"],
    question: { kind: "who", about: "event/ibn-al-haytham-summoned-to-cairo", answer: "person/al-hakim-bi-amr-allah", options: ["person/al-khwarizmi", "person/mansa-musa"], evidence: "al-Ḥākim" },
    needs: "event/abd-al-rahman-ii-expands-cordoba-mosque",
    gives: "work/kitab-al-manazir",
  },
  {
    id: "samarqand",
    place: "place/samarqand",
    when: "event/ulugh-beg-observatory-samarqand",
    figure: "person/ulugh-beg",
    see: ["event/ulugh-beg-observatory-samarqand"],
    question: { kind: "where", about: "person/ulugh-beg", answer: "place/samarqand", options: ["place/cordoba", "place/cairo"], evidence: "Samarqand" },
    needs: "work/kitab-al-hisab-al-khwarizmi",
    gives: "invention/ulugh-beg-zij",
  },
  {
    id: "timbuktu",
    place: "place/timbuktu",
    when: "event/sankore-mosque-timbuktu-730",
    figure: "person/mansa-musa",
    see: ["event/sankore-mosque-timbuktu-730"],
    question: { kind: "where", about: "event/sankore-mosque-timbuktu-730", answer: "place/timbuktu", options: ["place/samarqand", "place/baghdad"], evidence: "Timbuktu" },
    needs: "work/kitab-al-manazir",
    gives: "event/mansa-musa-hajj-724",
  },
];

/** The museum's record on the jinn, linked from the jinni's note so the reader can see what the belief is. */
export const JINN_RECORD = "concept/jinn";

/** Every record id the game shows. */
export function recordIds(): string[] {
  const ids = new Set<string>([JINN_RECORD]);
  for (const d of DESTINATIONS) {
    for (const id of [d.place, d.when, d.figure, ...d.see, d.question.about, d.question.answer, ...d.question.options, d.gives]) ids.add(id);
    if (d.needs) ids.add(d.needs);
  }
  return [...ids].sort();
}

export const destination = (id: string): Destination | undefined => DESTINATIONS.find((d) => d.id === id);
