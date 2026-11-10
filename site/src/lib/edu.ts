// Education programme data (docs/delegation/education-master-plan.md): the five age bands and the passport stamps.
// Build-time loaders with the same shape checks the tests make, so a broken file fails the build, not a visitor.
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { repoPath } from "./paths";
import type { Lang } from "./i18n";

export interface Tri { ar: string; en: string; ur: string }
export interface BandActivity { id: string; href: string; glyph: string; label_key: string }
export interface Band {
  id: string;
  ages: { min: number; max: number };
  name: Tri;
  ages_label: Tri;
  voice: Tri;
  glyph: string;
  palette: string;
  wing: "sighar" | "shabab";
  hub: string;
  stateless: boolean;
  activities: BandActivity[];
  next: string | null;
}
export interface Stamp {
  id: string;
  band: string;
  icon: string;
  href: string;
  label: Tri;
  earn: { key: string; rule: string };
}

const pick = (t: Tri, lang: Lang): string => t[lang] ?? t.ar;

let bandsCache: Band[] | null = null;
export function loadBands(): Band[] {
  if (bandsCache) return bandsCache;
  const raw = parse(readFileSync(repoPath("edu/bands.yaml"), "utf8")) as { bands?: Band[] };
  const bands = raw?.bands ?? [];
  if (bands.length !== 5) throw new Error(`edu/bands.yaml: expected 5 bands, found ${bands.length}`);
  for (let i = 0; i < bands.length; i++) {
    const b = bands[i];
    const expectNext = bands[i + 1]?.id ?? null;
    if (b.next !== expectNext) throw new Error(`edu/bands.yaml: band ${b.id} must ladder to ${expectNext}`);
    for (const l of ["ar", "en", "ur"] as const) {
      if (!b.name?.[l] || !b.ages_label?.[l] || !b.voice?.[l]) throw new Error(`edu/bands.yaml: band ${b.id} lacks ${l} strings`);
    }
  }
  bandsCache = bands;
  return bands;
}

let stampsCache: Stamp[] | null = null;
export function loadStamps(): Stamp[] {
  if (stampsCache) return stampsCache;
  const raw = parse(readFileSync(repoPath("edu/stamps.yaml"), "utf8")) as { stamps?: Stamp[] };
  const stamps = raw?.stamps ?? [];
  if (!stamps.length) throw new Error("edu/stamps.yaml: no stamps");
  const bandIds = new Set(loadBands().map((b) => b.id));
  const seen = new Set<string>();
  for (const s of stamps) {
    if (seen.has(s.id)) throw new Error(`edu/stamps.yaml: duplicate stamp ${s.id}`);
    seen.add(s.id);
    if (!bandIds.has(s.band)) throw new Error(`edu/stamps.yaml: stamp ${s.id} names unknown band ${s.band}`);
    if (!/^(list-min|number-min|keys-min|prefix-keys-min):\d+$|^prefix-any$/.test(s.earn?.rule ?? "")) throw new Error(`edu/stamps.yaml: stamp ${s.id} has an unknown rule`);
  }
  stampsCache = stamps;
  return stamps;
}

export interface BandView {
  id: string; name: string; agesLabel: string; voice: string; glyph: string; palette: string; wing: string;
  hub: string; stateless: boolean; ages: { min: number; max: number };
  activities: { id: string; href: string; glyph: string; label: string; stamps: string[] }[];
  next: BandView | null;
}

/** Band for one language; activity labels come from the `kids:` i18n block (label_key), stamps matched by href. */
export function viewBands(lang: Lang, kidsT: Record<string, string>): BandView[] {
  const bands = loadBands();
  const stamps = loadStamps();
  const views: BandView[] = bands.map((b) => ({
    id: b.id,
    name: pick(b.name, lang),
    agesLabel: pick(b.ages_label, lang),
    voice: pick(b.voice, lang),
    glyph: b.glyph,
    palette: b.palette,
    wing: b.wing,
    hub: `/${lang}${b.hub}`,
    stateless: b.stateless,
    ages: b.ages,
    activities: b.activities.map((a) => {
      const label = kidsT[a.label_key];
      if (!label) throw new Error(`edu/bands.yaml: activity ${a.id} names a kids i18n key that does not exist: ${a.label_key}`);
      return { id: a.id, href: `/${lang}${a.href}`, glyph: a.glyph, label, stamps: stamps.filter((s) => s.href === a.href).map((s) => s.id) };
    }),
    next: null,
  }));
  views.forEach((v, i) => { v.next = views[i + 1] ?? null; });
  return views;
}

export interface StampView { id: string; band: string; icon: string; href: string; label: string }
export function viewStamps(lang: Lang, band?: string): StampView[] {
  return loadStamps()
    .filter((s) => !band || s.band === band)
    .map((s) => ({ id: s.id, band: s.band, icon: s.icon, href: `/${lang}${s.href}`, label: pick(s.label, lang) }));
}

/** The rule payload the client reads to award stamps (no labels: those are in the HTML already). */
export const stampRules = () => loadStamps().map((s) => ({ id: s.id, band: s.band, key: s.earn.key, rule: s.earn.rule }));

export interface FamilyActivity { week: number; icon: string; title: Tri; text: Tri; href: string }
let actsCache: FamilyActivity[] | null = null;
/** The 52 family activities of the weekly sheet (edu/family-activities.yaml), one per ISO week. */
export function loadFamilyActivities(): FamilyActivity[] {
  if (actsCache) return actsCache;
  const raw = parse(readFileSync(repoPath("edu/family-activities.yaml"), "utf8")) as { activities?: FamilyActivity[] };
  const acts = raw?.activities ?? [];
  if (acts.length !== 52) throw new Error(`edu/family-activities.yaml: expected 52 activities, found ${acts.length}`);
  acts.forEach((a, i) => {
    if (a.week !== i + 1) throw new Error(`edu/family-activities.yaml: activity ${i + 1} has week ${a.week}`);
    for (const l of ["ar", "en", "ur"] as const) if (!a.title?.[l] || !a.text?.[l]) throw new Error(`edu/family-activities.yaml: week ${a.week} lacks ${l}`);
  });
  actsCache = acts;
  return acts;
}
