// Audit S34: one name per explorer. Compares each Explore menu label (i18n explore.pages.<key>.title) with the H1 and the
// <title> of the page the menu opens, on a built site, and lists the "in the making" eyebrows.
//   npx tsx scripts/audit/s34-names.ts [dist-dir]     (default .cache/audit-dist)
import { readFileSync, existsSync } from "node:fs";
import { parse } from "yaml";
const R = process.cwd(); const DIST = process.argv[2] ?? `${R}/.cache/audit-dist`;
const nav=readFileSync(R+"/site/src/lib/nav.ts","utf8");
const pages=[...nav.matchAll(/\{ key: "([a-z-]+)", href: `\/\$\{lang\}\/([^`]*)`/g)].map(m=>({key:m[1],path:m[2]}));
const dec=(s:string)=>s.replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim();
for (const lang of ["en","ar"]) { const T=parse(readFileSync(`${R}/i18n/${lang}.yaml`,"utf8")); let bad=0;
  for (const p of pages) { const f=`${DIST}/${lang}/${p.path}index.html`; if(!existsSync(f)){console.log(lang,p.key,"NOT BUILT",p.path);continue}
    const h=readFileSync(f,"utf8"); const h1=dec((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)||[])[1]||""); const title=dec((h.match(/<title>([^<]*)/)||[])[1]||"").replace(/ · (Islam Museum|متحف الإسلام)$/,"");
    const menu=T.explore.pages[p.key]?.title; const eyebrow=dec((h.match(/border-radius:50%;background:var\(--gold\)"><\/span>([^<]*)/)||[])[1]||"");
    const same=menu===h1.replace(/ \d[\d,]* (fatwas|فتوى)$/,"")&&menu===title;
    if(!same){bad++;console.log(`${lang} ${p.key}: menu="${menu}" | h1="${h1.slice(0,60)}" | title="${title.slice(0,60)}"`)}
    if(eyebrow&&/making|Growing|قيد|ينمو/i.test(eyebrow)) console.log(`   eyebrow ${lang} ${p.key}: "${eyebrow}"`);
  } console.log(lang,"mismatches:",bad,"of",pages.length); }
