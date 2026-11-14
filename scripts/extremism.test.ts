import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { entityOfPath, findBlocked, parseExceptions } from "./lib/extremism";

const blocked = (t: string) => findBlocked(t).length > 0;

describe("extremism hard block: names that must be caught", () => {
  it.each([
    "He was threatened by ISIS in 2017.",
    "the fight against Daesh",
    "al-Qaeda claimed it",
    "Al-Qaida in Iraq",
    "a Hamas leader",
    "Hezbollah's rocket stores",
    "the Taliban took Kabul",
    "Jabhat al-Nusra and Hay'at Tahrir al-Sham",
    "Boko Haram kidnapped",
    "the Islamic State declared a caliphate",
    "published in *Dabiq* magazine",
    "an issue of Dabiq",
    "source: Amaq News Agency",
    "As-Sahab Media",
    "almanar.com.lb",
    "تنظيم داعش",
    "حركة حماس",
    "جبهة النصرة",
    "افغان طالبان کی حکومت",
    "a JNIM communiqué",
    "TTP claimed the attack",
    "the GIA in Algeria",
    "Jama'at Nusrat al-Islam wal-Muslimin",
    "Ansaru in northern Nigeria",
    "the Abdallah Azzam Brigades",
    "Al-Murabitoun in the Sahel",
    "the Gama'a al-Islamiyya in Egypt",
    "Caucasus Emirate fighters",
    "Egyptian Islamic Jihad merged into it",
    "the Islamic Movement of Uzbekistan",
    "Lashkar-e-Jhangvi",
    "Hizbul Mujahideen",
    "Jund al-Aqsa",
    "جند الأقصى",
    "تنظيم حراس الدين",
    "Ansarallah took Sana'a",
    "the Houthis captured the capital",
    "الحوثيون سيطروا على صنعاء",
    "he commanded the IRGC",
    "the Islamic Revolutionary Guard Corps announced",
    "الحرس الثوري الإسلامي",
    "سپاہ پاسداران انقلاب اسلامی",
    "Ansar Dine ruled Timbuktu in 2012",
    "Ansar Eddine in northern Mali",
    "أنصار الدين في مالي",
    "he founded Hizb ut-Tahrir in 1953",
    "a Hizbut Tahrir Indonesia activist",
    "حزب التحرير الإسلامي",
    "an assassination attempt by Ansar al-Islam",
    "انصار الاسلام",
    "the Sudanese Muslim Brotherhood",
    "الإخوان المسلمون في السودان",
  ])("blocks %s", (t) => expect(blocked(t)).toBe(true));
});

describe("extremism hard block: non-matches that must pass", () => {
  it.each([
    "the Battle of Marj Dabiq in 1516",
    "died at Dabiq in 99 AH",
    "Rashid Rida's Tafsir al-Manar",
    "Ibn Hamas narrated from his uncle",
    "pen name Isis Copia",
    "Minister of Defence of the Islamic State of Afghanistan",
    "Hitti, The Origins of the Islamic State",
    "an Islamic state governed by law",
    "the Hamasa anthology of Abu Tammam",
    "Hudayr al-Kata'ib of the Aws",
    "al-Shabab football club of Riyadh",
    "طالبان علم",
    "طالبانِ علم تمہاری طرف آئیں",
    "جلال طالباني",
    "حزب الله هم الغالبون",
    "مرج دابق",
    "the quietists (al-qa'ida)",
    "the isis of the Nile goddess cult",
    "the Sepahsalar Mosque in Tehran",
    "Haïdara founded the Ançar Dine movement in 1991",
    "كان من أنصار الإسلام الأرثوذكسي",
    "كونوا أنصار الله",
    "Hasan al-Banna founded the Muslim Brotherhood in Egypt",
    "the Ansar-Ud-Deen Society of Nigeria",
  ])("allows %s", (t) => expect(blocked(t)).toBe(false));
});

describe("extremism exceptions list", () => {
  const md = readFileSync("docs/delegation/extremism-firewall-exceptions.md", "utf8");
  const ids = parseExceptions(md);
  it("lists the founder-approved records and each still exists", () => {
    expect(ids.size).toBeGreaterThan(100);
    for (const id of ids) expect(existsSync(`data/${id}.yaml`), id).toBe(true);
  });
  it("never lists the records the founder had removed", () => {
    for (const id of ["person/ahmed-yassin", "person/ahmed-al-sharaa"]) {
      expect(ids.has(id)).toBe(false);
      expect(existsSync(`data/${id}.yaml`), id).toBe(false);
    }
  });
  it("maps data and content paths to entity ids", () => {
    expect(entityOfPath("data/person/x.yaml")).toBe("person/x");
    expect(entityOfPath("content/ar/person/x.md")).toBe("person/x");
    expect(entityOfPath("data/_stubs.d/a.yaml")).toBeNull();
  });
});
