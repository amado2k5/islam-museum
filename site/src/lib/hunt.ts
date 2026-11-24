// The treasure hunt (docs/site/viewpoints.md, phase 2). The seven stops, their riddles and the line that leads to the next stop
// are the rooms of the record below; this file holds only what is language-neutral: the words accepted as an answer and the
// page a hint points to.
export const HUNT_ID = "exhibit/hunt-seven-places";
export const HUNT_VERSE = "passage/quran-96-1";
/** Per room: the hint's record and the words that count as the answer, already folded as in /shell/hunt.js. */
export const HUNT_KEYS: { hint: string; keys: string[] }[] = [
  { hint: "place/jabal-al-nur", keys: ["hira", "hiraa", "حراء", "حرا"] },
  { hint: "place/mecca", keys: ["arqam", "erkam", "الارقم", "ارقم"] },
  { hint: "event/hijra", keys: ["thawr", "thaur", "thor", "sawr", "sevr", "tsur", "tsaur", "ثور"] },
  { hint: "place/medina", keys: ["quba", "qoba", "kuba", "قباء", "قبا"] },
  { hint: "place/jerusalem", keys: ["rock", "rocher", "roca", "sakhra", "sahra", "kubbetussahra", "batu", "صخره", "الصخره", "صخرا", "چٹان"] },
  { hint: "person/uqba-ibn-nafi", keys: ["qayrawan", "kairouan", "kairuan", "kayrevan", "qairawan", "qairouan", "kairawan", "القيروان", "قيروان"] },
  { hint: "place/baghdad", keys: ["wisdom", "hikma", "hikmah", "hikmat", "hikmet", "beytulhikme", "beytulhikma", "bilgelik", "sagesse", "sabiduria", "kebijaksanaan", "الحكمه", "حكمه", "حكمت"] },
];
export const huntPath = (lang: string) => `/${lang}/hunt/`;
