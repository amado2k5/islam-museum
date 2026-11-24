// Drives bing.com/translator in headed Chrome: insertText the chunk, wait for
// translation, append to answers/<batch>.txt, ledger each result. Resume-safe.
//   node scripts/local-mt/bing_paste.mjs --dir .../retry3/paste --lang tr,id,fr,es [--limit N]
import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 ? process.argv[i + 1] : d; };
const DIR = arg("dir"), LANGS = arg("lang", "tr,id,fr,es").split(","), LIMIT = +arg("limit", 0);
const SHARD = (arg("shard", "0/1")).split("/").map(Number);  // K/N: this worker takes files where idx % N == K
const ANS = path.join(DIR, "answers"); fs.mkdirSync(ANS, { recursive: true });
const LEDGER = path.join(DIR, `bing-ledger-${SHARD[0]}.json`);
const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, "utf8")) : {};
const save = () => fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1));
const srcOf = f => { const m = f.match(/^r3-(tr|id|fr|es)-(\d+)/);
  return (m[1] === "fr" || m[1] === "es") && m[2] !== "03" ? "en" : "ar"; };
const batchOf = f => f.match(/^(r3-\w+-\d+)/)[1];

const browser = await chromium.launch({ headless: false, channel: "chrome" }).catch(() => chromium.launch({ headless: false }));
const page = await browser.newPage();
page.setDefaultTimeout(20000);
let done = 0, curSrc = null, curTo = null;

for (const lang of LANGS) {
  const ldir = path.join(DIR, lang);
  if (!fs.existsSync(ldir)) continue;
  const files = fs.readdirSync(ldir).filter(f => f.endsWith(".txt")).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .filter((_, i) => i % SHARD[1] === SHARD[0]);
  for (const f of files) {
    const key = `${lang}/${f}`;
    if (ledger[key] && !ledger[key].failed) continue;
    const src = srcOf(f), text = fs.readFileSync(path.join(ldir, f), "utf8");
    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      try {
        if (src !== curSrc || lang !== curTo) {
          await page.goto(`https://www.bing.com/translator?from=${src}&to=${lang}`, { waitUntil: "domcontentloaded" });
          await page.waitForSelector("#tta_input_ta");
          curSrc = src; curTo = lang;
        } else {
          await page.fill("#tta_input_ta", "");
        }
        // Bing caps the box at ~1000 chars: paste in ≤950-char pieces split on
        // line boundaries (never inside a marker line), collect outputs in order.
        const pieces = [];
        const push = t => {
          while (t.length > 950) {
            let cut = t.lastIndexOf(" ", 950); if (cut < 400) cut = 950;
            pieces.push(t.slice(0, cut)); t = t.slice(cut).trimStart();
          }
          if (t) pieces.push(t);
        };
        for (const line of text.split("\n")) {
          if (line.length <= 950 && pieces.length && (pieces[pieces.length - 1] + "\n" + line).length <= 950)
            pieces[pieces.length - 1] += "\n" + line;
          else push(line);
        }
        const outs = [];
        for (const pc of pieces) {
          await page.fill("#tta_input_ta", "");
          await page.click("#tta_input_ta");
          await page.keyboard.insertText(pc);
          let prev = "", stable = 0, o = "";
          for (let i = 0; i < 120; i++) {
            await page.waitForTimeout(500);
            o = (await page.evaluate(() => document.querySelector("#tta_output_ta")?.textContent || "")).trim();
            if (o && o !== "..." && o === prev) { if (++stable >= 2) break; } else stable = 0;
            prev = o;
          }
          if (!o || o === "...") throw new Error("empty output piece");
          outs.push(o);
        }
        const out = outs.join("\n");
        const mi = (text.match(/#### \d+ ####/g) || []).length;
        const mo = (out.match(/#### \d+ ####/g) || []).length;
        fs.appendFileSync(path.join(ANS, batchOf(f) + ".txt"), out + "\n\n");
        ledger[key] = { markers_in: mi, markers_out: mo, chars: text.length };
        save(); console.log(`${key} OK markers ${mo}/${mi}`);
        ok = true;
      } catch (e) {
        console.log(`${key} a${attempt + 1}: ${e.message.split("\n")[0]}`);
        curSrc = null; await page.waitForTimeout(3000);
      }
    }
    if (!ok) { ledger[key] = { failed: true }; save(); console.log(`${key} FAILED`); }
    if (LIMIT && ++done >= LIMIT) { await browser.close(); process.exit(0); }
    await page.waitForTimeout(300);
  }
}
await browser.close();
