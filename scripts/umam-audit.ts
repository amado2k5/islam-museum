// Audit for the Umam Browser (docs/plan/67-umam-browser.md): enumerate the members the shared
// detector admits, report section counts, list every passage caught by the name lexicon (for
// false-positive review) and flag members that have no `mentions` edges yet. Runs on the compiled
// graph: npx tsx scripts/umam-audit.ts [--verbose]
import { compile } from "./build-graph.js";
import { umamMembers, umamMatches, umamTagSections, UMAM_TAG, UMAM_SECTIONS } from "./umam.js";

const VERBOSE = process.argv.includes("--verbose");
const c = compile();
const members = umamMembers(c.nodes, c.edges);
const bySection = new Map<string, number>();
for (const m of members) bySection.set(m.sections[0], (bySection.get(m.sections[0]) ?? 0) + 1);
console.log(`TOTAL ${members.length}`);
for (const s of UMAM_SECTIONS) console.log(`  ${s}: ${bySection.get(s) ?? 0}`);

// mentions-edge health: members with no incoming mentions (targets nothing yet names)
const mentioned = new Set<string>();
for (const e of c.edges) if (!e.inverse && e.type === "mentions") mentioned.add(e.to);
const memberIds = new Set(members.map((m) => m.node.id));
const silent = members.filter((m) => m.node.class !== "passage" && !mentioned.has(m.node.id));
console.log(`members with no incoming mentions edges: ${silent.length}`);
if (VERBOSE) for (const m of silent) console.log(`  silent ${m.node.id} (${m.sections.join("+")})`);

// tagged records missing a section tag (they file by class default — acceptable but noisy)
const noSec = members.filter((m) => m.node.tags.includes(UMAM_TAG) && umamTagSections(m.node).length === 0);
console.log(`tagged records with no um-<section> tag (class default): ${noSec.length}`);
if (VERBOSE) for (const m of noSec) console.log(`  nosec ${m.node.id} -> ${m.sections[0]}`);

// lexicon hits on passages without a mentions edge — the review list for UMAM_EXCLUDE
const lexOnly = members.filter((m) => m.node.class === "passage" && umamMatches(m.node).length && !m.node.data.work?.toString().includes("quran"));
const edgeSet = new Set<string>();
for (const e of c.edges) if (!e.inverse && e.type === "mentions" && memberIds.has(e.to)) edgeSet.add(e.from);
const review = lexOnly.filter((m) => !edgeSet.has(m.node.id));
console.log(`passages filed by the lexicon alone (no mentions edge): ${review.length}`);
if (VERBOSE) for (const m of review) console.log(`  lex ${m.node.id}\t${umamMatches(m.node).join(",")}\t${String(m.node.data.text_search ?? m.node.data.text ?? "").replace(/\s+/g, " ").slice(0, 140)}`);
