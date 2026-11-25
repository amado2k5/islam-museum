// Counts which museum media records could become an Atlas image round, by the rule in src/images.ts (decision
// record G-0008). Run from gaming/:
//   npx tsx --tsconfig tsconfig.json games/atlas/tools/survey-images.ts [--out <file.json>]
//
// It reads data/media/, the records each one says it depicts, the places those are tied to, and the image hosts in
// the museum's content security policy (site/public/_headers). It changes nothing in the museum and writes one
// report. Take the count again whenever media records have been added: the report says whether there are enough
// pictures for a schedule yet.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { LANGS } from "../src/pack";
import { IMAGE_SCHEDULE_NEEDS, imageHosts, imageSupply, judgeImage, placeQualifies, type ImageRound, type Rec } from "../src/images";

const ROOT = resolve(fileURLToPath(new URL("../../../../", import.meta.url)));
const outAt = process.argv.indexOf("--out");
const OUT = outAt > 0 ? resolve(process.argv[outAt + 1]!) : resolve(ROOT, "docs/gaming/evidence/m2/atlas/image-survey.json");

const cache = new Map<string, Rec | null>();
const find = (id: string): Rec | null => {
  if (cache.has(id)) return cache.get(id)!;
  const path = join(ROOT, "data", `${id}.yaml`);
  let rec: Rec | null = null;
  if (/^[a-z]+\/[a-z0-9][a-z0-9-]*$/.test(id) && existsSync(path)) {
    try {
      rec = parse(readFileSync(path, "utf8")) as Rec;
    } catch {
      rec = null;
    }
  }
  cache.set(id, rec);
  return rec;
};
const ids = (cls: string) =>
  readdirSync(join(ROOT, "data", cls))
    .filter((f) => f.endsWith(".yaml"))
    .sort()
    .map((f) => `${cls}/${f.slice(0, -".yaml".length)}`);
const tally = (into: Record<string, number>, key: string) => (into[key] = (into[key] ?? 0) + 1);
const sorted = (counts: Record<string, number>) => Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)));

const hosts = imageHosts(readFileSync(join(ROOT, "site/public/_headers"), "utf8"));
if (hosts.size === 0) throw new Error("site/public/_headers: no image hosts found in the content security policy");
const ctx = { find, hosts };

const byKind: Record<string, number> = {};
const byLicence: Record<string, number> = {};
const depictedClass: Record<string, number> = {};
const leftOut: Record<string, number> = {};
const rounds: Array<ImageRound & { altLanguages: string[] }> = [];
const mediaOf = new Map<string, number>(); // how many media records depict each building
const media = ids("media");
for (const id of media) {
  const rec = find(id);
  if (!rec) {
    tally(leftOut, "unreadable record");
    continue;
  }
  tally(byKind, String(rec.kind));
  tally(byLicence, String(rec.license));
  const depicted = (Array.isArray(rec.depicts) ? rec.depicts : []).map(String);
  // A record that depicts two objects is counted once under "object".
  for (const cls of new Set(depicted.map((d) => d.split("/")[0]!))) tally(depictedClass, cls);
  for (const d of depicted) if (d.startsWith("building/")) mediaOf.set(d, (mediaOf.get(d) ?? 0) + 1);
  const verdict = judgeImage(rec, ctx);
  if (!verdict.ok) tally(leftOut, verdict.why);
  else rounds.push({ ...verdict.round, altLanguages: LANGS.filter((l) => typeof (rec.alt as Rec | undefined)?.[l] === "string") });
}

// What the museum's building records could supply if each had a picture: the same join an image round would use.
const buildings = { records: 0, namingOnePlace: 0, onePlaceThatQualifies: 0, ofThoseWithWikidataId: 0, ofThoseWithAMediaRecord: 0, withAnyMediaRecord: mediaOf.size };
for (const id of ids("building")) {
  const rec = find(id);
  if (!rec) continue;
  buildings.records++;
  const places = new Set<string>();
  if (typeof rec.location === "string") places.add(rec.location);
  for (const r of Array.isArray(rec.relations) ? rec.relations : []) if (r && typeof r === "object" && (r as Rec).type === "located_in" && typeof (r as Rec).target === "string") places.add(String((r as Rec).target));
  if (places.size !== 1) continue;
  buildings.namingOnePlace++;
  const place = find([...places][0]!);
  if (!place || !placeQualifies(place) || "sensitivity" in rec) continue;
  buildings.onePlaceThatQualifies++;
  if ((rec.external_ids as Rec | undefined)?.wikidata) buildings.ofThoseWithWikidataId++;
  if (mediaOf.has(id)) buildings.ofThoseWithAMediaRecord++;
}
const places = ids("place");
const qualifyingPlaces = places.filter((id) => {
  const p = find(id);
  return p !== null && placeQualifies(p);
}).length;

const pick = (question: ImageRound["question"], held: boolean) => rounds.filter((r) => r.question === question && r.held === held);
const whereFree = pick("where", false);
const report = {
  surveyed: {
    commit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim(),
    date: execFileSync("git", ["show", "-s", "--format=%cs", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim(),
  },
  mediaRecords: media.length,
  byKind: sorted(byKind),
  byLicence: sorted(byLicence),
  mediaRecordsByClassOfWhatTheyDepict: sorted(depictedClass),
  imageHostsAllowedByTheMuseum: [...hosts].sort(),
  placesThatCanBeScoredAgainst: { records: places.length, qualifying: qualifyingPlaces },
  // The question as the game would ask it: a picture of a place or a building, under a free licence.
  whereIsThis: imageSupply(whereFree),
  // Counted apart: a different question (the GDD's artifact-origin mode), and a licence held for the founder.
  whereWasThisMade: imageSupply(pick("made", false)),
  underALicenceHeldForTheFounder: { whereIsThis: imageSupply(pick("where", true)), whereWasThisMade: imageSupply(pick("made", true)) },
  everythingCountedTogether: imageSupply(rounds),
  needs: IMAGE_SCHEDULE_NEEDS,
  enoughForAWeeklyImageRound: imageSupply(whereFree).weekly,
  enoughForADailyImageRound: imageSupply(whereFree).daily,
  rounds: rounds.sort((a, b) => (a.question + a.media < b.question + b.media ? -1 : 1)),
  leftOut: sorted(leftOut),
  buildings,
};
writeFileSync(OUT, JSON.stringify(report, null, 1) + "\n");
console.log(JSON.stringify(report, null, 1));
console.error(`written: ${OUT}`);
