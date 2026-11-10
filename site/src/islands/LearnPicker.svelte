<script lang="ts">
  // Education Browser picker: jurisdiction (country + board) -> grade -> subject. Falls back to a static course list without JS (rendered by the page).
  interface Node { id: string; kind: string; parent?: string; label: string; summary: string; grade?: number; order?: number }
  interface Props { nodes: Node[]; labels: { country: string; grade: string; subject: string; open: string }; lang: string }
  let { nodes, labels, lang }: Props = $props();
  const href = (id: string) => `/${lang}/course/${id.split("/")[1]}/`;

  const kids = (parent: string | undefined, kind: string) =>
    nodes.filter((n) => n.kind === kind && n.parent === parent).sort((a, b) => (a.order ?? a.grade ?? 0) - (b.order ?? b.grade ?? 0));

  const jurisdictions = nodes.filter((n) => n.kind === "jurisdiction");
  let jur = $state(jurisdictions[0]?.id ?? "");
  let grade = $state("");
  let subject = $state("");

  const grades = $derived(kids(jur, "grade"));
  const subjects = $derived(kids(grade, "subject"));
  $effect(() => { if (grades.length && !grades.some((g) => g.id === grade)) grade = grades[0].id; });
  $effect(() => { if (subjects.length && !subjects.some((s) => s.id === subject)) subject = subjects[0].id; });
</script>

<div class="learn-picker">
  <label>{labels.country}
    <select bind:value={jur}>
      {#each jurisdictions as j}<option value={j.id}>{j.label}</option>{/each}
    </select>
  </label>
  <label>{labels.grade}
    <select bind:value={grade} disabled={!grades.length}>
      {#each grades as g}<option value={g.id}>{g.label}</option>{/each}
    </select>
  </label>
  <label>{labels.subject}
    <select bind:value={subject} disabled={!subjects.length}>
      {#each subjects as s}<option value={s.id}>{s.label}</option>{/each}
    </select>
  </label>
  {#if subject}
    <a class="go" href={href(subject)}>{labels.open} →</a>
  {/if}
</div>

<style>
  .learn-picker { display: flex; flex-wrap: wrap; gap: 14px 18px; align-items: end; font-family: var(--sans); }
  :global(html[lang="ar"]) .learn-picker { font-family: var(--ar-body); }
  label { display: grid; gap: 6px; font-size: .9rem; color: var(--muted); min-width: 200px; flex: 1 1 200px; }
  select { font: inherit; color: var(--fg); background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; }
  .go { font-weight: 600; background: var(--fg); color: var(--bg); text-decoration: none; padding: 10px 20px; border-radius: 10px; white-space: nowrap; }
</style>
