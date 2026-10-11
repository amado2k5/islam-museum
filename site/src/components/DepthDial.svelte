<script lang="ts">
  // Depth dial: Brief | Standard | Deep. Works by setting data-depth on the article; without JS everything reads fine.
  interface Props { labels: { label: string; brief: string; standard: string; deep: string }; target?: string }
  let { labels, target = "entity-article" }: Props = $props();
  let depth = $state<"brief" | "standard" | "deep">("standard");

  function set(d: "brief" | "standard" | "deep") {
    depth = d;
    const el = document.getElementById(target);
    if (!el) return;
    el.dataset.depth = d;
    el.querySelectorAll<HTMLDetailsElement>("details[data-role]").forEach((x) => (x.open = d === "deep"));
    try { localStorage.setItem("depth", d); } catch {}
  }

  $effect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("depth"); } catch {}
    if (saved === "brief" || saved === "standard" || saved === "deep") set(saved);
  });
</script>

<div class="depth-dial" role="group" aria-label={labels.label}>
  <span class="lbl">{labels.label}</span>
  {#each [["brief", labels.brief], ["standard", labels.standard], ["deep", labels.deep]] as [key, text]}
    <button type="button" aria-pressed={depth === key} onclick={() => set(key as "brief" | "standard" | "deep")}>{text}</button>
  {/each}
</div>

<style>
  .depth-dial { display: inline-flex; align-items: center; gap: 4px; font-family: var(--sans); font-size: 0.85rem; background: var(--panel); border-radius: 999px; padding: 3px; }
  :global(html[lang="ar"]) .depth-dial { font-family: var(--ar-body); font-size: 0.95rem; }
  .lbl { padding-inline: 10px 6px; color: var(--muted); }
  button { border: 0; background: transparent; color: var(--fg); padding: 4px 12px; border-radius: 999px; cursor: pointer; font: inherit; }
  button[aria-pressed="true"] { background: var(--bg); box-shadow: 0 0 0 1px var(--gold); }
</style>
