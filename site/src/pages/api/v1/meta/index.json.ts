import type { APIRoute } from "astro";
import { graph, realNodes } from "../../../../lib/graph";

const CLASSES = [
  "person", "group", "polity", "event", "period", "journey", "place", "building", "object",
  "media", "work", "passage", "concept", "language", "practice", "exhibit", "question", "source", "dataset", "listing", "screen", "job",
] as const;

export const GET: APIRoute = () => {
  const classes = CLASSES.filter((k) => realNodes.some((n) => n.class === k));
  const body = JSON.stringify({
    version: "v1",
    generated: graph.generated,
    classes,
    docs: "https://github.com/amado2k5/islam-museum/blob/main/docs/plan/09-ai-content-pipeline.md",
    license: { prose: "CC BY-SA 4.0", data: "CC0 1.0" },
  }, null, 1);
  return new Response(body, { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
