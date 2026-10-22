#!/usr/bin/env node
// islam.museum — local command-center dashboard generator.
// Scans data/, content/, stubs, lanes and the harvest drive, then writes a
// self-contained index.html (all data inlined — works over file://).
// NOT part of the public site. Run: node tools/dashboard/generate.mjs

import { readdirSync, readFileSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = process.env.MUSEUM_ROOT || new URL('../../', import.meta.url).pathname;
const HARVEST = '/Volumes/exmicroSD/islam-museum-harvest/books';
const LANGS = ['ar', 'en', 'ur'];

const list = (d) => { try { return readdirSync(d); } catch { return []; } };
const isDir = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };

/* ---------- entities ---------- */
const classes = {};
const predicateCounts = {};
const centuryHist = {};            // hijri century -> {born,died} counts (persons only for born)
const completeness = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, none: 0 };
let wikidataCount = 0, totalRels = 0, entitiesWithSources = 0;

for (const cls of list(join(ROOT, 'data'))) {
  const dir = join(ROOT, 'data', cls);
  if (!isDir(dir) || cls.startsWith('_') || cls === 'source') continue;
  let n = 0;
  for (const f of list(dir)) {
    if (!f.endsWith('.yaml')) continue;
    n++;
    const t = readFileSync(join(dir, f), 'utf8');
    const c = t.match(/completeness:\s*(\d)/);
    completeness[c ? c[1] : 'none'] = (completeness[c ? c[1] : 'none'] ?? 0) + 1;
    if (/wikidata:/.test(t)) wikidataCount++;
    if (/^sources:/m.test(t)) entitiesWithSources++;
    for (const m of t.matchAll(/type:\s*([a-z_]+)/g)) {
      predicateCounts[m[1]] = (predicateCounts[m[1]] ?? 0) + 1;
      totalRels++;
    }
    for (const m of t.matchAll(/hijri:\s*"?0*(\d{1,4})"?/g)) {
      const yr = parseInt(m[1], 10);
      if (yr >= 1 && yr <= 1500) {
        const c = Math.floor((yr - 1) / 100) + 1;
        centuryHist[c] = centuryHist[c] ?? {};
        centuryHist[c][cls] = (centuryHist[c][cls] ?? 0) + 1;
      }
    }
  }
  classes[cls] = n;
}

// per-class wikidata linkage
const wdByClass = {};
for (const cls of Object.keys(classes)) {
  let w = 0;
  for (const f of list(join(ROOT, 'data', cls))) {
    if (f.endsWith('.yaml') && readFileSync(join(ROOT, 'data', cls, f), 'utf8').includes('wikidata:')) w++;
  }
  wdByClass[cls] = w;
}

/* ---------- prose ---------- */
const prose = {}; // prose[lang][cls] = count
const proseFiles = {}; // proseFiles[lang][cls] = Set of slugs
for (const lang of LANGS) {
  prose[lang] = {}; proseFiles[lang] = {};
  for (const cls of list(join(ROOT, 'content', lang))) {
    const dir = join(ROOT, 'content', lang, cls);
    if (!isDir(dir)) continue;
    const files = list(dir).filter((f) => f.endsWith('.md'));
    prose[lang][cls] = files.length;
    proseFiles[lang][cls] = new Set(files.map((f) => f.replace(/\.md$/, '')));
  }
}

// per-class coverage table
const entitySlugs = {}; // cls -> Set(slugs)
for (const cls of Object.keys(classes)) {
  entitySlugs[cls] = new Set(list(join(ROOT, 'data', cls)).filter((f) => f.endsWith('.yaml')).map((f) => f.replace(/\.yaml$/, '')));
}
const classTable = Object.keys(classes).sort((a, b) => classes[b] - classes[a]).map((cls) => {
  const ent = classes[cls];
  const ar = entitySlugs[cls].size ? [...entitySlugs[cls]].filter((s) => proseFiles.ar[cls]?.has(s)).length : 0;
  const en = entitySlugs[cls].size ? [...entitySlugs[cls]].filter((s) => proseFiles.en[cls]?.has(s)).length : 0;
  const ur = entitySlugs[cls].size ? [...entitySlugs[cls]].filter((s) => proseFiles.ur[cls]?.has(s)).length : 0;
  const pct = ent ? Math.round((ar / ent) * 100) : 0;
  return { cls, ent, ar, en, ur, missing: ent - ar, pct };
});

/* ---------- stubs & sources & lanes ---------- */
const stubLanes = list(join(ROOT, 'data/_stubs.d')).filter((f) => f.endsWith('.yaml')).map((f) => {
  const t = readFileSync(join(ROOT, 'data/_stubs.d', f), 'utf8');
  return { file: f.replace(/\.yaml$/, ''), stubs: (t.match(/^-?\s*id:/gm) ?? []).length };
}).sort((a, b) => b.stubs - a.stubs);
const sourceCount = list(join(ROOT, 'data/source')).filter((f) => f.endsWith('.yaml')).length;
const lanes = list(join(ROOT, 'docs/delegation/library')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));

/* ---------- harvest ---------- */
const harvest = { available: existsSync(HARVEST), categories: [] };
if (harvest.available) {
  for (const cat of list(HARVEST).sort()) {
    const catDir = join(HARVEST, cat);
    if (!isDir(catDir)) continue;
    let books = 0, scans = 0, ocrdScans = 0, noOcr = 0;
    for (const book of list(catDir)) {
      const bookDir = join(catDir, book);
      if (!isDir(bookDir)) continue;
      books++;
      let hasOcr = false;
      for (const scan of list(bookDir)) {
        const sd = join(bookDir, scan);
        if (!isDir(sd)) continue;
        scans++;
        if (existsSync(join(sd, 'book.txt'))) { ocrdScans++; hasOcr = true; }
      }
      if (!hasOcr) noOcr++;
    }
    harvest.categories.push({ cat, books, scans, ocrdScans, noOcr });
  }
}

/* ---------- book pipeline (harvest → canon) ---------- */
const HROOT = '/Volumes/exmicroSD/islam-museum-harvest';
const pipeline = { available: existsSync(HROOT) };
if (pipeline.available) {
  const rd = (p) => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
  // candidates.json: archive.org book candidates identified for download
  try {
    const cands = JSON.parse(rd(join(HROOT, 'library/candidates.json')) ?? '[]');
    pipeline.candidates = cands.length;
    pipeline.candidatesByTopic = {};
    for (const c of cands) pipeline.candidatesByTopic[c.topic ?? '?'] = (pipeline.candidatesByTopic[c.topic ?? '?'] ?? 0) + 1;
  } catch { pipeline.candidates = 0; pipeline.candidatesByTopic = {}; }
  // download lists: URL + target path lines; pending = target missing
  let dlTotal = 0, dlDone = 0;
  for (const f of ['download_list.tsv', 'download_list2.tsv']) {
    const t = rd(join(HROOT, 'library', f));
    if (!t) continue;
    for (const line of t.split('\n')) {
      if (!line.trim() || !line.includes('\t')) continue;
      dlTotal++;
      const target = line.split('\t').pop().trim().replace('/Users/ahmedabdelaal/islam-museum-harvest', HROOT);
      if (existsSync(target)) dlDone++;
    }
  }
  pipeline.downloadQueue = { total: dlTotal, done: dlDone, pending: dlTotal - dlDone };
  // raw/library PDFs = downloaded, awaiting OCR
  let rawPdfs = 0;
  const countPdf = (dir) => { for (const e of list(dir)) { const p = join(dir, e); if (isDir(p)) countPdf(p); else if (e.toLowerCase().endsWith('.pdf')) rawPdfs++; } };
  try { countPdf(join(HROOT, 'raw/library')); } catch {}
  pipeline.downloadedPdfs = rawPdfs;
  // OCR queue: books queued for OCR → pending if no book.txt under books/<cat>/<book>
  let oqTotal = 0, oqPending = 0;
  const oq = rd(join(HROOT, 'library/queue.txt'));
  if (oq) for (const line of oq.split('\n')) {
    const l = line.trim();
    if (!l || l.startsWith('#') || !l.endsWith('.pdf')) continue;
    oqTotal++;
    const bookDir = join(HROOT, 'books', l.replace(/\/[^/]+\.pdf$/, ''));
    let done = false;
    for (const s of list(bookDir)) if (isDir(join(bookDir, s)) && existsSync(join(bookDir, s, 'book.txt'))) done = true;
    if (!done) oqPending++;
  }
  pipeline.ocrQueue = { total: oqTotal, pending: oqPending };
  // extraction queue (mining backlog)
  const eq = rd(join(HROOT, 'library/extraction-queue.md'));
  pipeline.extractionQueue = eq ? (eq.match(/^\d+\./gm) ?? []).length : null;
}
// canon = source records in git; harvested = books/ dirs (computed above)
pipeline.sourceRecords = sourceCount;
pipeline.harvestedBooks = harvest.categories.reduce((a, c) => a + c.books, 0);
pipeline.harvestedScans = harvest.categories.reduce((a, c) => a + c.ocrdScans, 0);
pipeline.notYetHarvested = (pipeline.downloadedPdfs ?? 0) - 0; // downloaded but not OCR'd books estimated below
pipeline.awaitingOcrBooks = Math.max(0, (pipeline.downloadedPdfs ?? 0) - pipeline.harvestedScans);

/* ---------- derived ---------- */
const totalEntities = Object.values(classes).reduce((a, b) => a + b, 0);
const totalAr = classTable.reduce((a, r) => a + r.ar, 0);
const totalEn = classTable.reduce((a, r) => a + r.en, 0);
const totalUr = classTable.reduce((a, r) => a + r.ur, 0);
const totalMissingAr = totalEntities - totalAr;
const totalBooks = harvest.categories.reduce((a, c) => a + c.books, 0);
const totalScans = harvest.categories.reduce((a, c) => a + c.scans, 0);
const totalOcrd = harvest.categories.reduce((a, c) => a + c.ocrdScans, 0);

const DATA = {
  generated: new Date().toISOString(),
  totals: { entities: totalEntities, ar: totalAr, en: totalEn, ur: totalUr, missingAr: totalMissingAr, relations: totalRels, sources: sourceCount, wikidata: wikidataCount, entitiesWithSources },
  classTable, prose, completeness, centuryHist,
  predicates: Object.entries(predicateCounts).sort((a, b) => b[1] - a[1]).slice(0, 25),
  stubLanes, lanes,
  harvest: { available: harvest.available, categories: harvest.categories, totalBooks, totalScans, totalOcrd },
  pipeline, wdByClass,
  wikidataLane: {
    candidates: 82296, processed: 82296, created: 2233, linked: 731, skipped: 79472,
    createdByClass: { person: 2004, building: 191, group: 28, polity: 3, concept: 5, practice: 1, place: 1 },
    skipTop: [['modern mosque list item', 72503], ['modern / post-1800 / out-of-scope / deferred', 4877], ['thin, deferred', 40], ['deferred — batch cap', 39], ['no confirmed source', 188], ['create-failed: file exists', 71]],
  },
};

/* ---------- html ---------- */
const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>islam.museum — command center</title>
<style>
:root{--bg:#0e1116;--card:#171c24;--ink:#e8e4da;--mut:#8b93a1;--gold:#c9a227;--teal:#4ec9b0;--red:#e06060;--blue:#5b9bd5;--line:#262d38}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 -apple-system,"SF Pro",system-ui,sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:28px 20px 60px}
h1{font-size:22px;letter-spacing:.02em;margin:0 0 4px}h1 span{color:var(--gold)}
.sub{color:var(--mut);font-size:12px;margin-bottom:26px}
h2{font-size:13px;text-transform:uppercase;letter-spacing:.12em;color:var(--mut);margin:34px 0 12px;border-bottom:1px solid var(--line);padding-bottom:6px}
.grid{display:grid;gap:12px}.g4{grid-template-columns:repeat(auto-fit,minmax(160px,1fr))}.g3{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}.g2{grid-template-columns:repeat(auto-fit,minmax(340px,1fr))}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px}
.big{font-size:30px;font-weight:700;font-variant-numeric:tabular-nums}.lab{color:var(--mut);font-size:12px;margin-top:2px}
.bar{height:6px;background:var(--line);border-radius:3px;margin-top:8px;overflow:hidden}.bar i{display:block;height:100%;border-radius:3px}
table{width:100%;border-collapse:collapse;font-size:12.5px}td,th{padding:5px 8px;text-align:left;border-bottom:1px solid var(--line);font-variant-numeric:tabular-nums}
th{color:var(--mut);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.06em}
td.num,th.num{text-align:right}
.mini{height:4px;background:var(--line);border-radius:2px;min-width:60px}.mini i{display:block;height:100%;border-radius:2px;background:var(--teal)}
.warn{color:var(--red)}.ok{color:var(--teal)}.acc{color:var(--gold)}
.hist{display:flex;align-items:flex-end;gap:3px;height:110px;padding-top:8px}
.hist div{flex:1;background:var(--blue);border-radius:2px 2px 0 0;position:relative;min-height:2px}
.hist div span{position:absolute;bottom:100%;left:0;right:0;text-align:center;font-size:9px;color:var(--mut)}
.histx{display:flex;gap:3px;font-size:9px;color:var(--mut)}.histx div{flex:1;text-align:center}
.plan{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px 18px;font-size:13px}
.plan li{margin:6px 0}
code{background:#0a0d11;padding:1px 6px;border-radius:4px;color:var(--gold)}
</style></head><body><div class="wrap">
<h1>islam.museum <span>command center</span></h1>
<div class="sub">local only · generated __GEN__</div>
<div id="app"></div>
<h2>The megaplan — where we are going</h2>
<div class="plan">
<p><b>Goal:</b> the whole of Islam — faith, civilization, peoples, places, texts, objects, living culture — as an Arabic-first knowledge graph in git, published as a static museum. The work splits into: <b>(a)</b> prose coverage of what the graph already knows, <b>(b)</b> entity coverage of what the books still hold, <b>(c)</b> new books still to harvest.</p>
<ol>
<li><b>Prose backlog (biggest lever):</b> ~13k entities lack Arabic prose — buildings (~5.5k), works (~1.2k), second-tier persons/events (~6k). Buildings: most are Wikidata imports the sources never name — realistic target is the famous subset; works: Kashf al-Zunun + Fihrist lanes; persons/events: tabaqat + tarikh lanes.</li>
<li><b>Entity backlog:</b> unmined harvest — juz' 2/3/10/11 of Subki; rijal set (Tahdhib al-Kamal, Mizan, Jarh wa'l-Ta'dil, Thiqat Ibn Hibban, al-Tarikh al-Kabir); tarikh set (Tabari, Tarikh Dimashq, Shadharat al-Dhahab); geography set (Mu'jam al-Buldan, Mu'jam ma Ustu'jima); 'alam al-Zirikli for modern-era persons; khitat al-Maqrizi + Azraqi + Wafa' al-Wafa' for buildings/places.</li>
<li><b>Gaps needing new scans:</b> Tarikh Baghdad vols. 10 (first ~100pp) &amp; 11 waw section; Kashf vol. 2; al-Kamil AH 41-294; Isaba residual.</li>
<li><b>Translation parity:</b> en/ur prose lags ar on ~300 files; rule is now trilingual-per-commit so the gap only shrinks.</li>
</ol>
<p>Suggested prompts this data supports: <code>"continue"</code> (next batch on the active lane), <code>"fill prose for buildings/places"</code>, <code>"open the rijal lane"</code>, <code>"open the works lane (Kashf/Fihrist)"</code>, <code>"list books to scan next"</code>.</p>
</div>
</div>
<script>
const D = __DATA__;
const fmt = n => n.toLocaleString('en-US');
const card = (v,l,c)=>'<div class="card"><div class="big" style="color:'+(c||'var(--ink)')+'">'+fmt(v)+'</div><div class="lab">'+l+'</div></div>';
const bar = (pct,c)=>'<div class="bar"><i style="width:'+pct+'%;background:'+c+'"></i></div>';
let h = '<div class="grid g4">'
 + card(D.totals.entities,'entities')
 + card(D.totals.relations,'relation edges')
 + card(D.totals.ar,'Arabic prose files','var(--teal)')
 + card(D.totals.missingAr,'entities with NO ar prose','var(--red)')
 + card(D.totals.en,'English prose','var(--blue)')
 + card(D.totals.ur,'Urdu prose','var(--blue)')
 + card(D.totals.sources,'source records','var(--gold)')
 + card(D.totals.wikidata,'entities with wikidata id')
 + '</div>';

h += '<h2>Prose coverage by class (Arabic-first)</h2><div class="card"><table><tr><th>class</th><th class="num">entities</th><th class="num">ar prose</th><th class="num">en</th><th class="num">ur</th><th class="num">missing ar</th><th style="width:30%">coverage</th></tr>';
for (const r of D.classTable) {
  const pc = r.pct;
  const c = pc>80?'var(--teal)':pc>40?'var(--gold)':'var(--red)';
  h += '<tr><td><b>'+r.cls+'</b></td><td class="num">'+fmt(r.ent)+'</td><td class="num">'+fmt(r.ar)+'</td><td class="num">'+fmt(r.en)+'</td><td class="num">'+fmt(r.ur)+'</td><td class="num warn">'+fmt(r.missing)+'</td><td><div class="mini"><i style="width:'+pc+'%;background:'+c+'"></i></div></td><td class="num">'+pc+'%</td></tr>';
}
h += '</table></div>';

h += '<h2>What is left to write (top gaps, Arabic)</h2><div class="card"><table><tr><th>class</th><th class="num">missing</th><th style="width:50%">share of gap</th></tr>';
const gaps = D.classTable.filter(r=>r.missing>0).sort((a,b)=>b.missing-a.missing).slice(0,12);
const maxG = gaps[0]?.missing||1;
for (const r of gaps) h += '<tr><td>'+r.cls+'</td><td class="num warn">'+fmt(r.missing)+'</td><td><div class="mini"><i style="width:'+Math.round(r.missing/maxG*100)+'%;background:var(--red)"></i></div></td></tr>';
h += '</table></div>';

h += '<h2>Book pipeline — candidates → canon</h2>';
if (!D.pipeline.available) h += '<div class="card warn">harvest drive not mounted — pipeline unknown</div>';
else {
  const P = D.pipeline;
  h += '<div class="grid g4" style="margin-bottom:12px">'
    + card(P.candidates,'candidates identified (archive.org)','var(--mut)')
    + card(P.downloadedPdfs,'PDFs downloaded','var(--blue)')
    + card(P.harvestedBooks,'books OCRd into harvest/books','var(--teal)')
    + card(P.sourceRecords,'source records in canon (git)','var(--gold)')
    + '</div>';
  // funnel
  const stages = [
    ['candidates identified', P.candidates],
    ['download queue — pending', P.downloadQueue?.pending ?? 0],
    ['download queue — done', P.downloadQueue?.done ?? 0],
    ['PDFs on disk (raw/library)', P.downloadedPdfs],
    ['OCR queue — pending', P.ocrQueue?.pending ?? 0],
    ['OCR queue — done', (P.ocrQueue?.total ?? 0) - (P.ocrQueue?.pending ?? 0)],
    ['books OCRd (harvest/books)', P.harvestedBooks],
    ['scan volumes OCRd', P.harvestedScans],
    ['source records in canon', P.sourceRecords],
  ];
  const smax = Math.max(...stages.map(s=>s[1]),1);
  h += '<div class="card"><div class="lab" style="margin-bottom:8px">the funnel — where every book stands'+(P.extractionQueue!=null?' · extraction queue (mining backlog): <b>'+P.extractionQueue+'</b> books':'')+'</div><table>';
  for (const [n,v] of stages) h+='<tr><td>'+n+'</td><td class="num">'+fmt(v)+'</td><td><div class="mini"><i style="width:'+Math.round(v/smax*100)+'%;background:var(--gold)"></i></div></td></tr>';
  h += '</table>';
  if (P.candidatesByTopic && Object.keys(P.candidatesByTopic).length) {
    h += '<div class="lab" style="margin:10px 0 6px">candidates by topic</div><table>';
    const tmax = Math.max(...Object.values(P.candidatesByTopic));
    for (const [t,n] of Object.entries(P.candidatesByTopic).sort((a,b)=>b[1]-a[1])) h+='<tr><td>'+t+'</td><td class="num">'+n+'</td><td><div class="mini"><i style="width:'+Math.round(n/tmax*100)+'%;background:var(--blue)"></i></div></td></tr>';
    h += '</table>';
  }
  h += '</div>';
}

h += '<h2>Harvest drive — books &amp; OCR</h2>';
if (!D.harvest.available) h += '<div class="card warn">harvest drive not mounted</div>';
else {
  h += '<div class="grid g4" style="margin-bottom:12px">'+card(D.harvest.totalBooks,'book folders')+card(D.harvest.totalScans,'scan volumes')+card(D.harvest.totalOcrd,'OCRed scans','var(--teal)')+card(D.harvest.categories.reduce((a,c)=>a+c.noOcr,0),'books with no OCR','var(--red)')+'</div>';
  h += '<div class="card"><table><tr><th>category</th><th class="num">books</th><th class="num">scan vols</th><th class="num">OCRed</th><th class="num">no OCR</th><th style="width:30%">OCR coverage</th></tr>';
  for (const c of D.harvest.categories.filter(c=>c.books>0).sort((a,b)=>b.books-a.books)) {
    const p = c.scans?Math.round(c.ocrdScans/c.scans*100):0;
    h += '<tr><td>'+c.cat+'</td><td class="num">'+c.books+'</td><td class="num">'+c.scans+'</td><td class="num">'+c.ocrdScans+'</td><td class="num warn">'+c.noOcr+'</td><td><div class="mini"><i style="width:'+p+'%"></i></div></td><td class="num">'+p+'%</td></tr>';
  }
  h += '</table></div>';
}

h += '<h2>Graph depth</h2><div class="grid g2"><div class="card"><div class="lab" style="margin-bottom:8px">completeness levels (entity record depth)</div><table>';
const cnames = {0:'0 — id only',1:'1 — minimal',2:'2 — basic',3:'3 — good',4:'4 — rich',5:'5 — exhaustive',none:'unset'};
const cmax = Math.max(...Object.values(D.completeness));
for (const k of ['none','0','1','2','3','4','5']) if(D.completeness[k]) h+='<tr><td>'+cnames[k]+'</td><td class="num">'+fmt(D.completeness[k])+'</td><td><div class="mini"><i style="width:'+Math.round(D.completeness[k]/cmax*100)+'%;background:var(--gold)"></i></div></td></tr>';
h += '</table></div><div class="card"><div class="lab" style="margin-bottom:8px">top relation predicates</div><table>';
const pmax = D.predicates[0]?.[1]||1;
for (const [p,n] of D.predicates.slice(0,15)) h+='<tr><td>'+p+'</td><td class="num">'+fmt(n)+'</td><td><div class="mini"><i style="width:'+Math.round(n/pmax*100)+'%;background:var(--blue)"></i></div></td></tr>';
h += '</table></div></div>';

// century histogram (persons/events only)
h += '<h2>Hijri-century density (dated facts in person/event records)</h2><div class="card">';
const cents = [];
for (let c=1;c<=15;c++){ const v=D.centuryHist[c]||{}; cents.push((v.person||0)+(v.event||0)); }
const cmax2 = Math.max(...cents,1);
h += '<div class="hist">';
cents.forEach((n,i)=>{ h+='<div style="height:'+Math.max(2,Math.round(n/cmax2*100))+'%" title="'+(i+1)+'c AH: '+fmt(n)+'"><span>'+(n?'':i+1)+'</span></div>'; });
h += '</div><div class="histx">'+cents.map((n,i)=>'<div>'+(i+1)+'</div>').join('')+'</div>';
h += '<div class="lab" style="margin-top:6px">counts of hijri fields per century (1–15 AH)</div></div>';

h += '<h2>Wikidata — done, remaining, next</h2><div class="grid g2">'
 + '<div class="card"><div class="lab" style="margin-bottom:8px">the import lane (P140=Islam, finished 20 Oct)</div><table>'
 + '<tr><td>candidates frozen</td><td class="num">'+fmt(D.wikidataLane.candidates)+'</td></tr>'
 + '<tr><td>processed (lane exhausted)</td><td class="num ok">'+fmt(D.wikidataLane.processed)+'</td></tr>'
 + '<tr><td>new records created</td><td class="num ok">'+fmt(D.wikidataLane.created)+'</td></tr>'
 + '<tr><td>existing records linked</td><td class="num">'+fmt(D.wikidataLane.linked)+'</td></tr>'
 + '<tr><td>skipped</td><td class="num warn">'+fmt(D.wikidataLane.skipped)+'</td></tr></table>'
 + '<div class="lab" style="margin:10px 0 6px">created by class · top skip reasons</div><table>';
for (const [k,v] of Object.entries(D.wikidataLane.createdByClass)) h+='<tr><td>'+k+'</td><td class="num">'+fmt(v)+'</td></tr>';
h += '<tr><td colspan="2">&nbsp;</td></tr>';
for (const [k,v] of D.wikidataLane.skipTop) h+='<tr><td>'+k+'</td><td class="num warn">'+fmt(v)+'</td></tr>';
h += '</table></div><div class="card"><div class="lab" style="margin-bottom:8px">wikidata-linked entities per class (live)</div><table>';
const wdmax = Math.max(...Object.values(D.wdByClass));
for (const r of D.classTable) {
  const w = D.wdByClass[r.cls]||0; if(!w) continue;
  h+='<tr><td>'+r.cls+'</td><td class="num">'+fmt(w)+' / '+fmt(r.ent)+'</td><td><div class="mini"><i style="width:'+Math.round(w/wdmax*100)+'%;background:var(--blue)"></i></div></td><td class="num">'+Math.round(w/r.ent*100)+'%</td></tr>';
}
h += '</table><div class="lab" style="margin-top:8px">next: ~5k deferred/thin items revisited case-by-case · 71 file-exists collisions to reconcile · non-P140 waves (events, battles) live in the candidates TSVs.</div></div></div>';

h += '<h2>Lanes &amp; stubs</h2><div class="grid g2"><div class="card"><div class="lab" style="margin-bottom:8px">stub files (placeholder entities awaiting real records)</div><table>';
for (const s of D.stubLanes.slice(0,20)) h+='<tr><td>'+s.file+'</td><td class="num warn">'+fmt(s.stubs)+'</td></tr>';
h += '</table></div><div class="card"><div class="lab" style="margin-bottom:8px">library lanes ('+D.lanes.length+')</div><table>';
for (const l of D.lanes) h+='<tr><td>'+l+'</td></tr>';
h += '</table></div></div>';

document.getElementById('app').innerHTML = h;
</script></body></html>`;

const rendered = html.replace('__DATA__', JSON.stringify(DATA)).replace('__GEN__', new Date().toLocaleString('en-GB'));
const served = `${process.env.HOME}/Library/Application Support/museum-dashboard/index.html`;
try { writeFileSync(served, rendered); console.log('published ->', served); } catch (e) { console.log('served copy failed:', e.message); }
const out = join(ROOT, 'tools/dashboard/index.html');
try { writeFileSync(out, rendered); console.log('dashboard ->', out); } catch { /* mirror clone: no tools dir, served copy is enough */ }
console.log('entities:', totalEntities, '| ar prose:', totalAr, '| missing:', totalMissingAr);
