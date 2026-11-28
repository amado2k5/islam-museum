// Measures terrain, collision, and z-fighting for Granada buildings.
// Usage: npx tsx --tsconfig tsconfig.json tools/granada-standing-gates.ts <out dir>
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { serveWorkspace } from "./serve";
const [outArg] = process.argv.slice(2);
if (!outArg) throw new Error("usage: granada-standing-gates.ts <out dir>");
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const served = await serveWorkspace();
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--mute-audio", "--window-size=1960,1160", "--window-position=0,0", "--force-device-scale-factor=1"] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("favicon")) errors.push(m.text()); });
await page.goto(served.base + "/games/granada/index.html?lang=en&fresh=1&seed=7&music=off&q=high");
await page.waitForFunction("Boolean(window.__GR__ && window.__GR__.ready)");
await page.locator("#brief-start").click();
await page.waitForFunction("window.__GR__.threeD === 'on'", undefined, { timeout: 180000 });
// Get building positions and check terrain
const terrain = await page.evaluate(`(() => {
  const s = window.__GR__.stage();
  const buildings = s.info().buildings || [];
  const results = [];
  for (const b of buildings) {
    const x = b.x, z = b.z;
    // Ray-cast down from above to find ground height
    const ray = new s.THREE.Raycaster(new s.THREE.Vector3(x, 100, z), new s.THREE.Vector3(0, -1, 0));
    const hits = ray.intersectObjects(s.scene.children, true);
    const groundHit = hits.find(h => h.object.userData.isGround || h.object.name.includes('ground') || h.object.name.includes('terrain'));
    const groundY = groundHit ? groundHit.point.y : null;
    const floatAmount = groundY !== null ? b.y - groundY : null;
    results.push({ name: b.name, x, z, buildingY: b.y, groundY, floatAmount });
  }
  return results;
})()`);
// Get building bounding boxes and check for overlaps
const collisions = await page.evaluate(`(() => {
  const s = window.__GR__.stage();
  const buildings = s.info().buildings || [];
  const boxes = buildings.map(b => {
    const box = new s.THREE.Box3();
    // Approximate bounding box from position and typical size
    box.min.set(b.x - 5, b.y, b.z - 5);
    box.max.set(b.x + 5, b.y + 10, b.z + 5);
    return { name: b.name, box };
  });
  const overlaps = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (boxes[i].box.intersectsBox(boxes[j].box)) {
        overlaps.push({ a: boxes[i].name, b: boxes[j].name });
      }
    }
  }
  return overlaps;
})()`);
// Check shadow settings (note: renderer not directly accessible via stage)
const shadows = { note: "Shadow settings require direct renderer access; not measurable via stage() API" };
const result = { terrain, collisions, shadows, errors, out };
writeFileSync(`${out}/standing-gates.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
await served.close();
