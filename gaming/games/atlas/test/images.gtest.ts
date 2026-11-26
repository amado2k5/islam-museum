// The rule for which media records may become an image round (G-0008), tested on records written for the test.
// The museum's real count is taken by tools/survey-images.ts and kept in docs/gaming/evidence/m2/atlas/.
import { describe, expect, it } from "vitest";
import { IMAGE_SCHEDULE_NEEDS, fold, imageHosts, imageSupply, judgeImage, placeQualifies, usableImages, type ImageRound, type Rec } from "../src/images";

const HOSTS = new Set(["upload.wikimedia.org", "framemark.vam.ac.uk"]);
const place = (id: string, extra: Rec = {}): Rec => ({ id, class: "place", kind: "city", coordinates: [37.18, -3.6], coordinate_precision: "site", label: { ar: "غرناطة", en: "Granada" }, ...extra });
const records: Record<string, Rec> = {
  "place/granada": place("place/granada"),
  "place/somewhere-vague": place("place/somewhere-vague", { coordinate_precision: "approx", label: { ar: "موضع", en: "Somewhere" } }),
  "place/a-province": place("place/a-province", { kind: "region", label: { ar: "إقليم", en: "A province" } }),
  "place/fez": place("place/fez", { coordinates: [34.06, -5.0], label: { ar: "فاس", en: "Fez" } }),
  "building/a-palace": { id: "building/a-palace", class: "building", kind: "palace", label: { ar: "قصر", en: "A palace" }, location: "place/granada", relations: [{ type: "located_in", target: "place/granada" }] },
  "building/two-homes": { id: "building/two-homes", class: "building", kind: "mosque", label: { en: "Two homes" }, location: "place/granada", relations: [{ type: "located_in", target: "place/fez" }] },
  "building/nowhere": { id: "building/nowhere", class: "building", kind: "mosque", label: { en: "Nowhere" } },
  "building/vague": { id: "building/vague", class: "building", kind: "fort", label: { en: "Vague" }, location: "place/somewhere-vague" },
  "building/guarded": { id: "building/guarded", class: "building", kind: "shrine", label: { en: "Guarded" }, location: "place/granada", sensitivity: "high" },
  "object/a-bowl": { id: "object/a-bowl", class: "object", kind: "ceramic", label: { en: "A bowl" }, made_in: "place/fez" },
  "object/a-lamp": { id: "object/a-lamp", class: "object", kind: "lamp", label: { en: "A lamp" }, relations: [{ type: "made_in", target: "place/fez" }] },
  "object/unplaced": { id: "object/unplaced", class: "object", kind: "glass", label: { en: "Unplaced" } },
  "object/a-folio": { id: "object/a-folio", class: "object", kind: "folio", label: { en: "A folio" }, made_in: "place/fez" },
  "person/someone": { id: "person/someone", class: "person", label: { en: "Someone" } },
  "concept/an-idea": { id: "concept/an-idea", class: "concept", label: { en: "An idea" } },
};
const ctx = { find: (id: string) => records[id] ?? null, hosts: HOSTS };
const photo = (extra: Rec = {}): Rec => ({ id: "media/a-photo", class: "media", kind: "image", license: "CC-BY-SA", creator: "A. Photographer", url: "https://upload.wikimedia.org/wikipedia/commons/a/ab/File.jpg", depicts: ["building/a-palace"], alt: { en: "A courtyard" }, ...extra });
const why = (rec: Rec): string => {
  const v = judgeImage(rec, ctx);
  return v.ok ? "accepted" : v.why;
};

describe("which media records may become an image round", () => {
  it("accepts a freely licensed photograph of a building tied to one scoreable place", () => {
    const v = judgeImage(photo(), ctx);
    expect(v).toEqual({ ok: true, round: { media: "media/a-photo", question: "where", subject: "building/a-palace", place: "place/granada", licence: "CC-BY-SA", held: false, host: "upload.wikimedia.org", creator: "A. Photographer" } });
  });

  it("accepts a photograph of the place itself, and lets a concept ride along as context", () => {
    const v = judgeImage(photo({ depicts: ["place/granada", "concept/an-idea"] }), ctx);
    expect(v.ok && v.round.place).toBe("place/granada");
    expect(v.ok && v.round.question).toBe("where");
  });

  it("asks where an object was made, from the field or the relation, and never where it is kept", () => {
    for (const subject of ["object/a-bowl", "object/a-lamp"]) {
      const v = judgeImage(photo({ depicts: [subject] }), ctx);
      expect(v.ok && v.round.question).toBe("made");
      expect(v.ok && v.round.place).toBe("place/fez");
    }
    expect(why(photo({ depicts: ["object/unplaced"] }))).toMatch(/names no place/);
  });

  it("refuses an AI illustration, a drawing and a map: none of them shows the place", () => {
    expect(why(photo({ kind: "illustration", license: "AI-GENERATED" }))).toMatch(/AI-generated/);
    expect(why(photo({ kind: "illustration", license: "CC0" }))).toMatch(/not a photograph/);
    expect(why(photo({ kind: "map", license: "CC0" }))).toMatch(/not a photograph/);
  });

  it("counts a licence held for the founder apart, and refuses one that is not on the list", () => {
    const v = judgeImage(photo({ license: "VAM-NC", url: "https://framemark.vam.ac.uk/collections/X/full/!768,/0/default.jpg", depicts: ["object/a-bowl"] }), ctx);
    expect(v.ok && v.round.held).toBe(true);
    expect(why(photo({ license: "All rights reserved" }))).toMatch(/not usable/);
    expect(why(photo({ license: undefined }))).toMatch(/missing/);
  });

  it("refuses an image the museum's content security policy would block, and one with no file", () => {
    expect(why(photo({ url: "https://example.org/picture.jpg" }))).toMatch(/content security policy/);
    expect(why(photo({ url: "http://upload.wikimedia.org/x.jpg" }))).toMatch(/content security policy/);
    expect(why(photo({ url: undefined }))).toBe("no image file");
    const own = judgeImage(photo({ url: undefined, files: { webp: "/media/x.webp" } }), ctx);
    expect(own.ok && own.round.host).toBe("self");
  });

  it("needs an author to credit where the licence asks for one, and not where it does not", () => {
    expect(why(photo({ creator: undefined }))).toMatch(/names none/);
    expect(why(photo({ creator: undefined, license: "CC-BY" }))).toMatch(/names none/);
    expect(why(photo({ creator: undefined, license: "CC0" }))).toBe("accepted");
    expect(why(photo({ creator: undefined, license: "PD" }))).toBe("accepted");
  });

  it("refuses a credit that would give the answer away", () => {
    expect(why(photo({ creator: "Granada Tourist Board" }))).toMatch(/contains the answer/);
    expect(why(photo({ creator: "تصوير مكتب غَرْناطة" }))).toMatch(/contains the answer/);
    expect(fold("Qurṭuba")).toBe("qurtuba");
  });

  it("refuses a picture of a person, and anything marked sensitive", () => {
    expect(why(photo({ depicts: ["building/a-palace", "person/someone"] }))).toBe("depicts a person");
    expect(why(photo({ sensitivity: "high" }))).toBe("marked sensitive");
    expect(why(photo({ depicts: ["building/guarded"] }))).toMatch(/subject is marked sensitive/);
  });

  it("refuses a subject with no place, two places, or a place a guess cannot be scored against", () => {
    expect(why(photo({ depicts: [] }))).toBe("names no subject");
    expect(why(photo({ depicts: ["concept/an-idea"] }))).toMatch(/not a place, a building or an object/);
    expect(why(photo({ depicts: ["building/a-palace", "object/a-bowl"] }))).toMatch(/more than one/);
    expect(why(photo({ depicts: ["building/missing"] }))).toMatch(/no record/);
    expect(why(photo({ depicts: ["building/nowhere"] }))).toMatch(/names no place/);
    expect(why(photo({ depicts: ["building/two-homes"] }))).toMatch(/more than one place/);
    expect(why(photo({ depicts: ["building/vague"] }))).toMatch(/cannot be scored/);
    expect(why(photo({ depicts: ["place/a-province"] }))).toMatch(/cannot be scored/);
  });

  it("never makes a picture question of a manuscript page", () => {
    expect(why(photo({ depicts: ["object/a-folio"] }))).toMatch(/manuscript page/);
  });

  it("applies the pack's own test of a place", () => {
    expect(placeQualifies(records["place/granada"]!)).toBe(true);
    expect(placeQualifies(records["place/somewhere-vague"]!)).toBe(false);
    expect(placeQualifies({ ...records["place/granada"]!, label: { en: "Granada" } })).toBe(false);
    expect(placeQualifies({ ...records["place/granada"]!, coordinates: undefined })).toBe(false);
  });
});

describe("the image hosts the museum allows", () => {
  it("are read from the content security policy, and a comment is not a policy", () => {
    const headers = ["/*", "  # Content-Security-Policy: img-src https://not-this.example", "  Content-Security-Policy: default-src 'self'; img-src 'self' data: blob: https://upload.wikimedia.org https://images.metmuseum.org; font-src 'self'; connect-src 'self' https://api.islam.museum"].join("\n");
    expect([...imageHosts(headers)].sort()).toEqual(["images.metmuseum.org", "upload.wikimedia.org"]);
    expect(imageHosts("/*\n  X-Content-Type-Options: nosniff").size).toBe(0);
  });
});

describe("whether there are enough pictures for a schedule", () => {
  const round = (n: number, placeNo: number, subject = `building/b${n}`): ImageRound => ({ media: `media/m${n}`, question: "where", subject, place: `place/p${placeNo}`, licence: "CC0", held: false, host: "upload.wikimedia.org", creator: "" });

  it("says four pictures are not enough", () => {
    const supply = imageSupply([0, 1, 2, 3].map((n) => round(n, n)));
    expect(supply).toMatchObject({ images: 4, places: 4, usableWeekly: 4, weekly: false, daily: false });
  });

  it("counts a subject once and a place only as often as it may return in a year", () => {
    const sixtyInOnePlace = Array.from({ length: 60 }, (_, n) => round(n, 0));
    expect(usableImages(sixtyInOnePlace, IMAGE_SCHEDULE_NEEDS.weekly.perPlace)).toBe(2);
    expect(imageSupply(sixtyInOnePlace).weekly).toBe(false);
    const twoPhotosOfOneBuilding = [round(0, 0, "building/same"), round(1, 0, "building/same")];
    expect(usableImages(twoPhotosOfOneBuilding, 2)).toBe(1);
  });

  it("says yes at fifty-two pictures over twenty-six places, and at a year's worth for a daily round", () => {
    const weekly = Array.from({ length: 52 }, (_, n) => round(n, n % 26));
    expect(imageSupply(weekly)).toMatchObject({ usableWeekly: 52, weekly: true, daily: false });
    expect(imageSupply(weekly.slice(1)).weekly).toBe(false);
    const daily = Array.from({ length: 365 }, (_, n) => round(n, n % 92));
    expect(imageSupply(daily).daily).toBe(true);
  });
});
