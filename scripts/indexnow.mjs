#!/usr/bin/env node
/**
 * Tells IndexNow (Bing, Yandex, Naver, Seznam, Yep...) which pages changed.
 *
 *   node scripts/indexnow.mjs                 URLs changed in the last commit (git diff HEAD~1 HEAD)
 *   node scripts/indexnow.mjs --all          every URL in the live sitemaps (one-time bootstrap)
 *   node scripts/indexnow.mjs --sitemaps      only the sitemap index and sitemaps
 *   add --dry-run to print what would be sent without sending it
 *
 * The islam.museum sitemap (@astrojs/sitemap) carries no <lastmod>, so changed
 * URLs are derived from the files the last commit touched instead:
 *   data/<class>/<slug>.yaml      ->  /ar/<class>/<slug>/  +  /en/<class>/<slug>/
 *   content/<lang>/<class>/<slug>.md  ->  /<lang>/<class>/<slug>/
 * Anything else that changed (templates, styles, i18n) is covered by
 * re-submitting the sitemap index, which prompts a recrawl.
 *
 * The key is site/public/<key>.txt, served at https://islam.museum/<key>.txt.
 * Nothing is sent unless this script is run: the deploy workflow runs it after
 * a deploy. Needs a checkout with at least fetch-depth 2 for the default mode.
 */
import { readFile, readdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const siteUrl = (process.env.PUBLIC_SITE_URL || 'https://islam.museum').replace(/\/$/, '');
const host = new URL(siteUrl).host;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH_SIZE = 10000; // IndexNow accepts up to 10,000 URLs per request.
// Right after a fresh deploy IndexNow can take a few minutes to re-fetch the key
// file and briefly answers 403 SiteVerificationNotCompleted: retry through that.
const MAX_ATTEMPTS = 8;
const RETRY_DELAY_MS = 20000;

const args = process.argv.slice(2);
const flag = name => args.includes(`--${name}`);
const dryRun = flag('dry-run');

const keyFileName = (await readdir('site/public')).find(name => /^[a-fA-F0-9-]{8,128}\.txt$/.test(name));
if (!keyFileName) throw new Error('No IndexNow key file in site/public/ (expected <key>.txt).');
const key = (await readFile(`site/public/${keyFileName}`, 'utf-8')).trim();
const keyLocation = `${siteUrl}/${keyFileName}`;

const unescape = value => value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

async function urlsFromGit() {
  let out;
  try {
    ({ stdout: out } = await execFileAsync('git', ['diff', '--name-status', 'HEAD~1', 'HEAD']));
  } catch {
    console.log('No HEAD~1 (shallow or first commit); falling back to sitemap ping.');
    return null;
  }
  const urls = new Set();
  let entityChanges = 0;
  for (const line of out.split('\n')) {
    const m = line.match(/^[AMDRC]\d*\s+(.+)$/);
    if (!m) continue;
    const f = m[1].trim();
    let dm = f.match(/^data\/([^/]+)\/([^/]+)\.yaml$/);
    if (dm) {
      const [, cls, slug] = dm;
      urls.add(`${siteUrl}/ar/${cls}/${slug}/`);
      urls.add(`${siteUrl}/en/${cls}/${slug}/`);
      entityChanges++;
      continue;
    }
    dm = f.match(/^content\/(ar|en)\/([^/]+)\/([^/]+)\.md$/);
    if (dm) {
      const [, lang, cls, slug] = dm;
      urls.add(`${siteUrl}/${lang}/${cls}/${slug}/`);
      entityChanges++;
    }
  }
  return { urls: [...urls], entityChanges };
}

async function urlsFromLiveSitemaps() {
  const indexXml = await (await fetch(`${siteUrl}/sitemap.xml`)).text();
  const sitemapUrls = [...indexXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => unescape(m[1]));
  const urls = [];
  for (const sm of sitemapUrls) {
    const xml = await (await fetch(sm)).text();
    for (const lm of xml.matchAll(/<loc>(.*?)<\/loc>/g)) urls.push(unescape(lm[1]));
  }
  return { urls, sitemapUrls };
}

let urlList;
let sitemapUrls = [`${siteUrl}/sitemap.xml`];
if (flag('all') || flag('sitemaps')) {
  const live = await urlsFromLiveSitemaps();
  sitemapUrls = live.sitemapUrls.length ? live.sitemapUrls : sitemapUrls;
  urlList = flag('sitemaps') ? [`${siteUrl}/sitemap.xml`, ...sitemapUrls] : [...live.urls, ...sitemapUrls];
} else {
  const git = await urlsFromGit();
  if (git === null) {
    urlList = sitemapUrls;
  } else if (git.urls.length === 0) {
    console.log('No entity pages changed in the last commit; pinging sitemaps only.');
    urlList = sitemapUrls;
  } else {
    console.log(`${git.entityChanges} entity file changes -> ${git.urls.length} page URLs.`);
    urlList = [...git.urls, ...sitemapUrls];
  }
}

urlList = [...new Set(urlList)];
if (urlList.length === 0) {
  console.log('Nothing to submit.');
  process.exit(0);
}

console.log(`${dryRun ? '[dry run] Would submit' : 'Submitting'} ${urlList.length} URLs to IndexNow as ${host} (key file ${keyLocation}).`);
if (dryRun) {
  for (const url of urlList.slice(0, 20)) console.log(`  ${url}`);
  if (urlList.length > 20) console.log(`  ... and ${urlList.length - 20} more`);
  process.exit(0);
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
for (let i = 0; i < urlList.length; i += BATCH_SIZE) {
  const batch = urlList.slice(i, i + BATCH_SIZE);
  const batchNumber = i / BATCH_SIZE + 1;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key, keyLocation, urlList: batch })
    });
    if (response.ok) {
      console.log(`Batch ${batchNumber} (${batch.length} URLs): ${response.status} ${response.statusText}`);
      break;
    }
    const text = await response.text();
    if (response.status === 403 && text.includes('SiteVerificationNotCompleted') && attempt < MAX_ATTEMPTS) {
      console.log(`Batch ${batchNumber}: key verification pending (attempt ${attempt}/${MAX_ATTEMPTS}), retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await sleep(RETRY_DELAY_MS);
      continue;
    }
    console.error(`Batch ${batchNumber} (${batch.length} URLs): ${response.status} ${response.statusText}\n${text}`);
    process.exitCode = 1;
    break;
  }
}
