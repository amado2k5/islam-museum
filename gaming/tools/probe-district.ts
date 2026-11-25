// Prints the size of the reference district for a seed. Usage: npx tsx tools/probe-district.ts [seed]
import { generateDistrict } from "../packages/worldkit/src/district/generate";
import { makeTexture, TEXTURE_KINDS } from "../packages/worldkit/src/textures";

const seed = Number(process.argv[2] ?? 7);
let t = performance.now();
const scene = generateDistrict(seed);
const genMs = performance.now() - t;
t = performance.now();
for (const k of TEXTURE_KINDS) makeTexture(k, seed, 512);
const texMs = performance.now() - t;
const by: Record<string, number> = {};
for (const c of scene.chunks) by[c.material] = (by[c.material] ?? 0) + c.mesh.indices.length / 3;
console.log(JSON.stringify({ seed, genMs: Math.round(genMs), texMs: Math.round(texMs), stats: scene.stats, trianglesByMaterial: by, instances: Object.fromEntries(scene.instances.map((b) => [b.id, b.count])), lamps: scene.lamps.length / 3, paths: scene.dynamics.paths.length, landmarks: Object.keys(scene.landmarks) }, null, 1));
