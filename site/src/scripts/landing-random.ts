// Landing page: shows a random featured entry in each wing card (the HTML carries the pool's first entry, so no-JS readers
// still get one), and fills "Last updated" from the deploy stamp written by deploy.yml (hidden when the file is missing).
interface Feat { h: string; l: string; s: string }

const poolEl = document.querySelector<HTMLScriptElement>("script[data-feat-pool]");
if (poolEl) {
  const pools: Record<string, Feat[]> = JSON.parse(poolEl.textContent || "{}");
  document.querySelectorAll<HTMLAnchorElement>("a[data-feat]").forEach((a) => {
    const pool = pools[a.dataset.feat ?? ""] ?? [];
    if (pool.length < 2) return;
    const x = pool[Math.floor(Math.random() * pool.length)];
    a.href = x.h;
    a.querySelector(".feat-l bdi")!.textContent = x.l;
    a.querySelector(".feat-s")!.textContent = x.s;
  });
}

const stamp = document.querySelector<HTMLElement>("[data-last-updated]");
if (stamp) {
  fetch("/api/v1/meta/deploy.json").then((r) => (r.ok ? r.json() : null)).then((d: { deployed_at?: string } | null) => {
    const t = d?.deployed_at ? new Date(d.deployed_at) : null;
    if (!t || isNaN(t.getTime())) return;
    const when = new Intl.DateTimeFormat(stamp.dataset.locale, { dateStyle: "long", timeStyle: "short", hourCycle: "h23", timeZone: "UTC" }).format(t);
    const time = document.createElement("time");
    time.dateTime = t.toISOString();
    time.textContent = (stamp.dataset.tpl ?? "{date}").replace("{date}", when);
    stamp.replaceChildren(time);
    stamp.hidden = false;
  }).catch(() => {});
}
