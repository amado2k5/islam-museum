// The Heroes of Islam explorer (docs/plan/71-heroes-explorer.md): the six virtue trails and their heroes,
// read from the exhibit records' rooms at build time — the trail records are the single source of truth.
import { byId } from "./graph";
import type { Node } from "../../../scripts/build-graph";

export interface Virtue { key: string; trailId: string; accent: string; }

export const VIRTUES: Virtue[] = [
  { key: "sacrifice", trailId: "exhibit/hero-sacrifice", accent: "#8a4a2e" },
  { key: "courage", trailId: "exhibit/hero-courage", accent: "#4a6e8a" },
  { key: "mercy", trailId: "exhibit/hero-mercy", accent: "#2e7d52" },
  { key: "generosity", trailId: "exhibit/hero-generosity", accent: "var(--gold)" },
  { key: "knowledge", trailId: "exhibit/hero-knowledge", accent: "#2a7b88" },
  { key: "steadfastness", trailId: "exhibit/hero-steadfastness", accent: "#6b4a8a" },
];

export interface HeroRoom { title: Record<string, string>; body: Record<string, string>; person: Node; features: string[] }
export interface Trail { virtue: Virtue; node: Node; heroes: HeroRoom[] }

const localOf = (x: unknown): Record<string, string> => (x && typeof x === "object" ? (x as Record<string, string>) : {});

export const trails: Trail[] = VIRTUES.flatMap((virtue) => {
  const node = byId.get(virtue.trailId);
  if (!node) throw new Error(`heroes: missing trail record ${virtue.trailId}`);
  const rooms = (node.data?.rooms ?? []) as { title?: unknown; body?: unknown; features?: string[] }[];
  const heroes = rooms.flatMap((r) => {
    const features = r.features ?? [];
    const personId = features.find((f) => f.startsWith("person/"));
    const person = personId ? byId.get(personId) : undefined;
    return person ? [{ title: localOf(r.title), body: localOf(r.body), person, features }] : [];
  });
  return [{ virtue, node, heroes }];
});

export const heroCount = trails.reduce((n, t) => n + t.heroes.length, 0);
