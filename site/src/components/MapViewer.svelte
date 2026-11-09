<script lang="ts">
  import { animate } from "motion";
  import { computePosition, flip, offset, shift } from "@floating-ui/dom";
  import { ChevronLeft, ChevronRight, Minus, Moon, Plus, RotateCcw, Sun } from "@lucide/svelte";
  import { hijriToCivil } from "../../../scripts/hijri/convert";

  type Span = { earliest: number; latest: number };
  type Item = { id: string; cls: string; slug: string; label: string; summary?: string; href: string; span?: Span; coordinates?: [number, number]; regions?: string[]; degree?: number; mapPositions?: Record<string, [number, number]>; worldTransform?: string };
  type Link = { from: string; to: string; type: string };
  type Region = { id: string; label: string; path: string; fitPath: string; tint: number; labelX: number; labelY: number; worldTransform: string };

  let { items = [], links = [], worldPaths = [], mapRegions = [], lang = "ar", t = {} }: { items: Item[]; links: Link[]; worldPaths?: string[]; mapRegions?: Region[]; lang?: string; t?: Record<string, any> } = $props();
  const rtl = lang !== "en";
  const tt = (k: string, fb: string) => t?.[k] ?? fb;

  const AH_YEAR_MIN = -74;
  const AH_YEAR_MAX = 1448;
  const STEP = 10;
  const W = 1000;
  const H = 560;
  const C = { x: 500, y: 265 };
  const regions = mapRegions;
  const regionBounds: Record<string, [number, number, number, number]> = {
    "andalus-europe": [35, 55, -12, 25], maghreb: [18, 38, -18, 35], "west-africa-sahel": [0, 24, -20, 35],
    "egypt-nile": [20, 34, 24, 38], "east-africa": [-15, 22, 30, 55], arabia: [10, 33, 32, 61],
    "levant-iraq": [28, 40, 32, 50], "anatolia-balkans": [35, 50, 18, 48], "persia-central-asia": [25, 48, 44, 75],
    "south-asia": [5, 36, 60, 98], "southeast-asia": [-12, 22, 92, 130], "china-east-asia": [18, 54, 72, 132],
  };
  const regionById = new Map(regions.map((r) => [r.id, r]));
  const itemById = new Map(items.map((n) => [n.id, n]));
  const placeIds = new Set(items.filter((n) => n.cls === "place" && n.coordinates).map((n) => n.id));
  const linkPairs = links.filter((l) => !l.type.startsWith("inverse:"));

  let level = $state<"world" | "region" | "city" | "focus">("world");
  let hijriYear = $state(11);
  let selectedRegion = $state("arabia");
  let selectedPlace = $state("place/mecca");
  let selectedEntity = $state("person/muhammad");
  let hoverId = $state<string | null>(null);
  let hoverLink = $state<string | null>(null);
  let zoom = $state(1);
  let orbitShift = $state(0);
  let orbitPage = $state(0);
  let focusPage = $state(0);
  let panX = $state(0);
  let panY = $state(0);
  let detail = $state<Item | null>(null);
  let dragging = $state(false);
  let dragDistance = $state(0);
  let dragX = $state(0);
  let dragY = $state(0);
  let stageEl = $state<HTMLElement>();
  let tipEl = $state<HTMLElement>();
  let isLight = $state(false);
  let pointer = $state({ x: 0, y: 0 });

  const visiblePlaces = $derived(items.filter((n) => n.cls === "place" && n.coordinates && temporalActive(n, year)));
  const activeRegions = $derived(regions.filter((r) => items.some((n) => (n.regions ?? []).includes(r.id) && temporalActive(n, year))));
  const regionPlaces = $derived(visiblePlaces.filter((n) => (n.regions ?? []).includes(selectedRegion)).sort((a, b) => a.label.localeCompare(b.label, "ar")));
  const selectedPlaceNode = $derived(temporalActive(itemById.get(selectedPlace), year) ? itemById.get(selectedPlace) : regionPlaces[0]);
  const activeWorldTransform = $derived(
    level === "world" ? "translate(0 0) scale(1)" :
    level === "region" ? regionById.get(selectedRegion)?.worldTransform ?? "translate(0 0) scale(1)" :
    selectedPlaceNode?.worldTransform ?? regionById.get(selectedRegion)?.worldTransform ?? "translate(0 0) scale(1)"
  );
  const selectedEntityNode = $derived(temporalActive(itemById.get(selectedEntity), year) ? itemById.get(selectedEntity) : undefined);
  const ORBIT_PAGE_SIZE = 18;
  const orbitBase = $derived(connectedTo(selectedPlace).filter((n) => temporalActive(n, year)).sort(rank));
  const orbitPageCount = $derived(Math.max(1, Math.ceil(orbitBase.length / ORBIT_PAGE_SIZE)));
  const orbitItems = $derived(orbitBase.slice(Math.min(orbitPage, orbitPageCount - 1) * ORBIT_PAGE_SIZE, (Math.min(orbitPage, orbitPageCount - 1) + 1) * ORBIT_PAGE_SIZE));
  const FOCUS_PAGE_SIZE = 14;
  const focusBase = $derived(selectedEntityNode ? graphLinks(selectedEntityNode.id).filter((l) => temporalActive(itemById.get(otherEnd(l, selectedEntityNode.id)), year)) : []);
  const focusPageCount = $derived(Math.max(1, Math.ceil(focusBase.length / FOCUS_PAGE_SIZE)));
  const focusLinks = $derived(focusBase.slice(Math.min(focusPage, focusPageCount - 1) * FOCUS_PAGE_SIZE, (Math.min(focusPage, focusPageCount - 1) + 1) * FOCUS_PAGE_SIZE));
  const focusItems = $derived(focusLinks.map((l) => itemById.get(otherEnd(l, selectedEntityNode!.id))).filter(Boolean) as Item[]);
  const placeConnections = $derived(selectedEntityNode ? graphLinks(selectedEntityNode.id).filter((l) => otherEnd(l, selectedEntityNode!.id) === selectedPlace).length : 0);
  const year = $derived(hijriToCivil({ y: hijriYear, m: 7, d: 1 }).date.y);
  const tooltip = $derived(hoverId ? itemById.get(hoverId) : null);
  const yearLabel = $derived(hijriYear <= 0 ? tt("year_bh", "{y} ق.هـ").replace("{y}", String(-hijriYear)) : tt("year_ah", "{y} هـ").replace("{y}", String(hijriYear)));
  const mapAria = $derived(tt("map_aria", "خريطة العالم الإسلامي في سنة {y}").replace("{y}", yearLabel));
  const canBack = $derived(level !== "world");
  const previewLevel = $derived(level === "focus" ? "city" : level === "city" ? "region" : "world");
  const previewTransform = $derived(previewLevel === "city" ? selectedPlaceNode?.worldTransform ?? regionById.get(selectedRegion)?.worldTransform ?? "translate(0 0) scale(1)" : previewLevel === "region" ? regionById.get(selectedRegion)?.worldTransform ?? "translate(0 0) scale(1)" : "translate(0 0) scale(1)");

  function activeAt(n: Item | undefined, y: number) {
    if (!n) return false;
    if (!n.span) return true;
    return y >= Math.floor(n.span.earliest) && y <= Math.ceil(n.span.latest);
  }
  const PLACE_DATED = new Set(["born_in","died_in","buried_in","lived_in","traveled_to","ruler_of","ruled_over","occurred_at","site_of","located_in","wrote_in","built","founded","visited_by"]);
  function temporalActive(n: Item | undefined, y: number) {
    if (!n) return false;
    if (n.span) return activeAt(n, y);
    return linkPairs.some((l) => {
      if (!PLACE_DATED.has(l.type)) return false;
      if (l.from !== n.id && l.to !== n.id) return false;
      const other = itemById.get(otherEnd(l, n.id));
      return other?.id !== n.id && !!other?.span && activeAt(other, y);
    });
  }
  function rank(a: Item, b: Item) {
    const score = (n: Item) => (n.cls === "event" ? 2 : n.cls === "person" ? 3 : n.cls === "building" ? 1 : 0) + (n.degree ?? 0) / 100;
    return score(b) - score(a) || a.label.localeCompare(b.label, "ar");
  }
  function connectedTo(placeId: string) {
    const out = new Map<string, Item>();
    for (const l of linkPairs) {
      if (l.from === placeId && itemById.has(l.to)) out.set(l.to, itemById.get(l.to)!);
      if (l.to === placeId && itemById.has(l.from)) out.set(l.from, itemById.get(l.from)!);
    }
    return [...out.values()].filter((n) => n.id !== placeId);
  }
  function graphLinks(id: string) {
    return linkPairs.filter((l) => l.from === id || l.to === id);
  }
  function otherEnd(l: Link, id: string) { return l.from === id ? l.to : l.from; }
  const EDGE_EN: Record<string, string> = { born_in: "born in", died_in: "died in", lived_in: "lived in", occurred_at: "occurred at", located_in: "in", site_of: "site of", built: "built", built_by: "built by", teacher_of: "taught", student_of: "studied under", spouse_of: "spouse", parent_of: "parent of", child_of: "child", sibling_of: "sibling", fought: "fought", allied_with: "allied with", opposed: "opposed", participated_in: "participated in", had_participant: "participant in", visited_by: "visited", traveled_to: "traveled to", wrote_in: "wrote in", ruled_over: "ruled", ruler_of: "ruler of", influenced: "influenced", influenced_by: "influenced by", patron_of: "patron of", patronized_by: "patronized by", member_of: "member of", has_member: "member", caused: "caused", caused_by: "caused by", mentions: "mentions", mentioned_in: "mentioned in", about: "about", subject_of: "subject" };
  function edgeLabel(type: string) {
    if (lang === "en") return EDGE_EN[type] ?? type.replaceAll("_", " ");
    return ({
      born_in: "وُلد في, died_in: "توفي في", lived_in: "عاش في", occurred_at: "وقع في", located_in: "في", site_of: "موقع", built: "بنى", built_by: "بُني بأمر", teacher_of: "علّم", student_of: "تعلّم من", spouse_of: "قرين", parent_of: "والد", child_of: "ابن", sibling_of: "أخ", fought: "قاتل", allied_with: "حالف", opposed: "عارض", participated_in: "شارك في", had_participant: "شارك فيه", visited_by: "زار", traveled_to: "سافر إلى", wrote_in: "كتب في", ruled_over: "حكم", ruler_of: "حاكم", influenced: "أثّر في", influenced_by: "تأثّر بـ", patron_of: "رعى", patronized_by: "رعاه", member_of: "عضو في", has_member: "عضوه", caused: "سبّب", caused_by: "نتج عن", mentions: "يذكر", mentioned_in: "مذكور في", about: "عن", subject_of: "موضوعه"
    } as Record<string, string>)[type] ?? EDGE_EN[type] ?? type.replaceAll("_", " ");
  }
  function project(n: Item) {
    const exact = n.mapPositions?.[selectedRegion];
    if (exact) return { x: exact[0], y: exact[1] };
    const [minLat, maxLat, minLon, maxLon] = regionBounds[selectedRegion] ?? [-60, 75, -180, 180];
    const [lat, lon] = n.coordinates!;
    return { x: 160 + ((lon - minLon) / (maxLon - minLon || 1)) * 680, y: 445 - ((lat - minLat) / (maxLat - minLat || 1)) * 365 };
  }
  function placePos(n: Item) {
    return project(n);
  }
  function orbitPos(i: number, total: number) {
    const angle = -Math.PI / 2 + (i / Math.max(total, 1)) * Math.PI * 2 + orbitShift / 150;
    return { x: C.x + Math.cos(angle) * 330, y: C.y + Math.sin(angle) * 185, a: angle };
  }
  function focusPos(i: number, total: number) {
    const angle = -Math.PI / 2 + (i / Math.max(total, 1)) * Math.PI * 2;
    return { x: C.x + Math.cos(angle) * 345, y: C.y + Math.sin(angle) * 190 };
  }
  function resetView() { panX = 0; panY = 0; }
  function openRegion(id: string) { selectedRegion = id; level = "region"; zoom = 1; resetView(); hoverId = null; }
  function openPlace(id: string) { selectedPlace = id; level = "city"; orbitShift = 0; orbitPage = 0; zoom = 1; resetView(); hoverId = null; selectedEntity = id; }
  function openEntity(id: string) {
    const node = itemById.get(id);
    selectedEntity = id;
    if (node?.cls === "place") {
      selectedPlace = id;
      selectedRegion = node.regions?.[0] ?? selectedRegion;
      level = "city";
      orbitPage = 0;
    } else { level = "focus"; focusPage = 0; }
    zoom = 1; resetView(); hoverId = null;
  }
  function back() {
    detail = null; hoverId = null; resetView();
    if (level === "focus") level = "city";
    else if (level === "city") level = "region";
    else if (level === "region") level = "world";
  }
  function centerClick() {
    if (!selectedEntityNode) return;
    if (selectedEntityNode.id === selectedPlace && placeConnections > 0) detail = selectedEntityNode;
    else if (selectedEntityNode.id === selectedPlace) detail = selectedEntityNode;
    else detail = selectedEntityNode;
  }
  function symbolClick(id: string) {
    if (selectedEntity !== id) selectedEntity = id;
    else detail = itemById.get(id) ?? null;
  }
  function dragStart(e: PointerEvent) { dragging = true; dragDistance = 0; dragX = e.clientX; dragY = e.clientY; }
  function dragMove(e: PointerEvent) {
    const box = stageEl?.getBoundingClientRect();
    if (box) pointer = { x: e.clientX - box.left, y: e.clientY - box.top };
    if (!dragging) return;
    const dx = e.clientX - dragX;
    const dy = e.clientY - dragY;
    dragDistance += Math.hypot(dx, dy);
    panX += dx;
    panY += dy;
    clampPan();
    dragX = e.clientX;
    dragY = e.clientY;
  }
  function dragEnd() { dragging = false; }
  function clampPan() {
    const s = stageEl?.getBoundingClientRect();
    if (!s) return;
    const mx = Math.max(0, (zoom - 1) * s.width / 2);
    const my = Math.max(0, (zoom - 1) * s.height / 2);
    panX = Math.min(mx, Math.max(-mx, panX));
    panY = Math.min(my, Math.max(-my, panY));
  }
  $effect(() => { zoom; clampPan(); });
  function wasClick() { return dragDistance < 8; }
  function toggleTheme() {
    const root = document.documentElement;
    const currentlyDark = root.getAttribute("data-theme") === "dark" || (!root.hasAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    const next = currentlyDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    isLight = next === "light";
    try { localStorage.setItem("theme", next); } catch {}
  }
  $effect(() => {
    const theme = document.documentElement.getAttribute("data-theme");
    isLight = theme === "light" || (!theme && !matchMedia("(prefers-color-scheme: dark)").matches);
  });

  $effect(() => {
    level;
    if (stageEl && !matchMedia("(prefers-reduced-motion: reduce)").matches) animate(stageEl, { opacity: [0.48, 1], scale: [0.86, 1] }, { duration: 0.58, ease: [0.22, 1, 0.36, 1] });
  });
  $effect(() => {
    if (!tooltip || !tipEl || !stageEl) return;
    const point = { getBoundingClientRect: () => DOMRect.fromRect({ x: pointer.x, y: pointer.y, width: 1, height: 1 }) };
    computePosition(point, tipEl, { placement: "top-start", middleware: [offset(14), flip(), shift({ padding: 14 })] }).then(({ x, y }) => {
      tipEl.style.left = `${x}px`;
      tipEl.style.top = `${y}px`;
    });
  });
  function orbitPrev() { orbitPage = Math.max(0, orbitPage - 1); }
  function orbitNext() { orbitPage = Math.min(orbitPageCount - 1, orbitPage + 1); }
  function focusPrev() { focusPage = Math.max(0, focusPage - 1); }
  function focusNext() { focusPage = Math.min(focusPageCount - 1, focusPage + 1); }
  function adjustYear(delta: number) { hijriYear = Math.min(AH_YEAR_MAX, Math.max(AH_YEAR_MIN, Math.round(hijriYear + delta))); orbitPage = 0; focusPage = 0; hoverId = null; hoverLink = null; detail = null; }
  function clsName(n: Item) { return t?.cls?.[n.cls] ?? ({ person: "شخصية", event: "حدث", place: "مكان", building: "مبنى", work: "مؤلَّف", group: "جماعة", journey: "رحلة" } as Record<string, string>)[n.cls] ?? n.cls; }
  const ICON_PATHS: Record<string, string> = {
    mecca: "M-14,-7 L6,-13 L16,-6 L16,12 L-4,18 L-14,10 Z M-14,-7 L-4,-1 L16,-6 M-4,-1 L-4,18 M-8,6 L10,1",
    medina: "M-19,14 L-19,-3 Q0,-17 19,-3 L19,14 Z M-8,14 L-8,2 Q0,-7 8,2 L8,14 M-24,14 L-24,-9 L-20,-14 L-16,-9 L-16,14 M16,14 L16,-9 L20,-14 L24,-9 L24,14",
    "al-watir": "M-16,9 A16,8 0 1,0 16,9 A16,8 0 1,0 -16,9 M-16,9 L-16,-7 A16,8 0 0,1 16,-7 L16,9 M0,-21 L0,-8 M-7,-21 L7,-21 M-5,-8 L5,-8 L5,0 L-5,0 Z",
    asfan: "M-18,14 L-18,2 L-8,-10 L2,2 L8,-6 L18,14 Z M-6,14 L-6,5 L2,5 L2,14 M-20,18 Q-8,21 0,18 T20,18",
    "al-khandama": "M-20,14 L-12,-9 L-4,-1 L4,-18 L20,14 Z M-10,14 L-3,5 L7,14",
    jerusalem: "M-16,14 L-16,-2 L-8,-10 L0,-14 L8,-10 L16,-2 L16,14 Z M-8,14 L-8,2 Q0,-4 8,2 L8,14",
    quba: "M-18,14 L-18,-4 L-8,-4 L-8,-12 L-2,-12 L-2,-4 L8,-4 L8,-12 L14,-12 L14,-4 L18,-4 L18,14 Z",
    uhud: "M-20,15 L-9,-10 L-2,-2 L5,-15 L20,15 Z M-7,-3 L1,4 L8,-5",
    "ghar-hira": "M-20,15 L-8,-14 L3,-4 L12,15 Z M-4,15 Q-4,5 4,5 Q12,5 12,15",
    "ghar-thawr": "M-19,15 L-10,-12 L-2,-4 L7,-18 L19,15 Z M-2,15 Q-2,6 6,6 Q14,6 14,15",
    badr: "M-18,14 L-4,8 L8,11 L20,6 M-12,4 L-4,-12 L4,4 L12,-12 M-8,-4 L8,-4",
    khaybar: "M-18,14 L-18,-8 L-8,-8 L-8,-14 L-2,-14 L-2,-8 L8,-8 L8,-14 L14,-14 L14,-8 L18,-8 L18,14 Z M-4,14 L-4,2 L4,2 L4,14",
    jeddah: "M-18,12 L18,12 M-14,4 L-6,10 L4,3 L14,10 M-8,-14 L-8,4 M-8,-14 L8,-4 L-8,-4",
    taif: "M-20,14 L-10,-9 L-2,-2 L6,-16 L20,14 Z M-13,14 L-13,3 L13,3 L13,14",
    tabuk: "M-17,14 L-17,-9 L17,-9 L17,14 Z M-12,-9 L-12,-15 L-6,-15 L-6,-9 M6,-9 L6,-15 L12,-15 L12,-9 M-5,14 L-5,1 L5,1 L5,14",
    yanbu: "M-18,12 L18,12 M-12,4 L-4,10 L4,4 L14,10 M0,-17 L0,4 M-5,-11 L5,-11 M-3,-17 L3,-17",
    muscat: "M-18,14 L-18,-5 L-11,-5 L-11,-14 L-5,-14 L-5,-5 L5,-5 L5,-14 L11,-14 L11,-5 L18,-5 L18,14 Z M-14,14 L14,14",
    sanaa: "M-16,15 L-16,-12 L-8,-16 L0,-12 L0,15 Z M4,15 L4,-10 L16,-14 L16,15 Z M-12,-8 L-4,-8 M-12,-2 L-4,-2 M8,-6 L14,-6 M8,0 L14,0",
    aden: "M-20,11 Q-10,16 0,11 T20,11 M-12,4 L-2,-8 L8,4 M-4,4 L12,4 M-14,12 L14,12",
    zabid: "M-16,14 L-16,-5 L-8,-5 L-8,-13 L-2,-13 L-2,-5 L8,-5 L8,-13 L14,-13 L14,-5 L16,-5 L16,14 Z M-4,14 L-4,2 L4,2 L4,14",
    "ghadir-khumm": "M-18,10 Q-8,15 0,10 T18,10 M-10,3 Q0,9 10,3 M0,-17 L0,3 M-7,-11 L7,-11",
    hudaybiyya: "M-14,14 L-14,-14 L10,-14 Q16,-7 10,0 L-14,0 M-8,8 L14,8 M-8,-8 L6,-8 M-8,-2 L10,-2",
    baghdad: "M0,-18 A18,18 0 1,1 -0.1,-18 M0,-12 A12,12 0 1,0 -0.1,-12 M-18,0 L18,0 M0,-18 L0,18",
    damascus: "M-17,14 L-17,-2 L-9,-2 L-9,-12 L-3,-12 L-3,-2 L7,-2 L7,-12 L13,-12 L13,-2 L17,-2 L17,14 Z M-5,14 L-5,2 L5,2 L5,14",
    aleppo: "M-18,14 L-18,-6 L18,-6 L18,14 Z M-14,-6 L-10,-13 L-6,-6 M6,-6 L10,-13 L14,-6 M-5,14 L-5,1 L5,1 L5,14",
    hama: "M0,0 m-14,0 a14,14 0 1,0 28,0 a14,14 0 1,0 -28,0 M0,-14 L0,14 M-14,0 L14,0 M-10,-10 L10,10 M10,-10 L-10,10 M0,14 L0,20 M-10,20 L10,20",
    kufa: "M-18,14 L-18,-8 L-9,-8 L-9,-16 L-3,-16 L-3,-8 L7,-8 L7,-16 L13,-16 L13,-8 L18,-8 L18,14 Z",
    basra: "M-18,12 Q-8,17 0,12 T18,12 M-14,4 L-6,10 L4,4 L14,10 M-4,-14 L-4,4 M-4,-14 L8,-5 L-4,-5",
    samarra: "M-3,15 L-3,-16 L3,-16 L3,15 Z M-7,-13 A8,3 0 1,0 7,-13 M-9,-7 A11,4 0 1,0 9,-7 M-11,0 A13,5 0 1,0 11,0 M-13,8 A15,6 0 1,0 13,8",
    mosul: "M-15,15 L-15,-13 L-10,-13 L-6,15 Z M0,15 L0,-8 L10,-8 L10,15 Z M-20,15 L14,15",
    mutah: "M-14,15 L-14,-15 L-8,-15 L-8,15 Z M8,15 L8,-15 L14,-15 L14,15 Z M-14,-8 L14,-8 M-14,2 L14,2",
    cairo: "M-20,15 L-8,-11 L4,15 Z M-8,15 L4,-7 L16,15 Z M-20,15 L20,15",
    alexandria: "M-18,12 Q-8,17 0,12 T18,12 M0,-16 L0,10 M-6,-10 L6,-10 M-3,-16 L3,-16 M-10,12 L10,12",
    cordoba: "M-18,14 L-18,-10 L18,-10 L18,14 Z M-14,14 L-14,0 Q-8,-8 -2,0 L-14,0 M-2,14 L-2,0 Q4,-8 10,0 L-2,0 M10,14 L10,0 Q16,-8 18,0",
    seville: "M-8,15 L-8,-16 L8,-16 L8,15 Z M-11,-10 L11,-10 M-11,-3 L11,-3 M-11,4 L11,4 M-12,-16 L12,-16 M-4,-21 L4,-21",
    granada: "M-18,14 L-18,-4 Q-9,-16 0,-4 Q9,-16 18,-4 L18,14 Z M-10,14 L-10,0 L10,0 L10,14",
    toledo: "M-18,11 Q-9,1 0,11 T18,11 M-14,11 L-14,-10 L14,-10 L14,11 M-6,-10 L-6,-18 L6,-18 L6,-10",
    palermo: "M-17,14 L-17,-2 L-8,-2 L-8,-10 L-2,-10 L-2,-2 L7,-2 L7,-10 L13,-10 L13,-2 L17,-2 L17,14 Z",
    istanbul: "M-20,14 L-20,-2 Q-10,-18 0,-2 Q10,-18 20,-2 L20,14 Z M-24,14 L-24,-10 M24,14 L24,-10 M-27,-10 L-21,-10 M21,-10 L27,-10",
    bursa: "M-18,14 L-18,-4 Q0,-18 18,-4 L18,14 Z M-14,-4 L-14,-13 M14,-4 L14,-13",
    edirne: "M-18,14 L-18,-4 Q0,-18 18,-4 L18,14 Z M-22,14 L-22,-16 M-14,14 L-14,-16 M14,14 L14,-16 M22,14 L22,-16",
    konya: "M-16,14 L-16,-2 Q0,-18 16,-2 L16,14 Z M0,-18 L0,14 M-8,6 Q0,-1 8,6",
    sarajevo: "M-20,10 Q-10,-2 0,10 T20,10 M-16,10 L-16,-8 L16,-8 L16,10 M-10,-8 L-10,-15 L10,-15 L10,-8",
    fez: "M-18,14 L-18,-6 L18,-6 L18,14 Z M-14,14 L-14,2 Q-8,-7 -2,2 L-14,2 M-2,14 L-2,2 Q4,-7 10,2 L-2,2",
    kairouan: "M-16,14 L-16,-6 L-4,-6 L-4,-16 L4,-16 L4,-6 L16,-6 L16,14 Z M-20,14 L20,14 M-8,14 L-8,2 L8,2 L8,14",
    marrakesh: "M-7,15 L-7,-18 L7,-18 L7,15 Z M-10,-12 L10,-12 M-10,-5 L10,-5 M-10,2 L10,2 M-13,15 L13,15 M0,-23 L0,-18",
    tlemcen: "M-10,15 L-10,-16 L10,-16 L10,15 Z M-14,-9 L14,-9 M-14,-2 L14,-2 M-14,5 L14,5 M-16,15 L16,15",
    timbuktu: "M-18,14 L-18,-2 L-9,-2 L-9,-15 L-3,-15 L-3,-2 L5,-2 L5,-19 L11,-19 L11,-2 L18,-2 L18,14 Z",
    gao: "M-18,14 L-18,-4 L-8,-4 L-8,-16 L0,-22 L8,-16 L8,-4 L18,-4 L18,14 Z",
    kano: "M-18,14 L-18,-6 L-10,-6 L-10,-14 L-4,-14 L-4,-6 L6,-6 L6,-14 L12,-14 L12,-6 L18,-6 L18,14 Z",
    zanzibar: "M-20,10 Q-8,15 2,10 T20,10 M-12,3 L-2,-9 L10,3 M-4,3 L12,3 M-2,-9 L-2,3",
    aksum: "M-7,16 L-7,-20 L7,-20 L7,16 Z M-10,-20 L10,-20 M-7,-12 L7,-12 M-7,-4 L7,-4 M-7,4 L7,4",
    bukhara: "M-8,15 L-8,-18 L8,-18 L8,15 Z M-12,-18 L12,-18 M-12,-12 L12,-12 M-12,-5 L12,-5 M-12,2 L12,2 M-14,15 L14,15",
    samarkand: "M-19,14 L-19,-2 Q-11,-16 -3,-2 Q0,-18 3,-2 Q11,-16 19,-2 L19,14 Z M-7,14 L-7,2 L7,2 L7,14",
    merv: "M-16,14 L-16,-2 Q0,-20 16,-2 L16,14 Z M-8,14 L-8,2 L8,2 L8,14",
    khiva: "M-8,15 L-8,-18 L8,-18 L8,15 Z M-11,-18 L11,-18 M-11,-11 L11,-11 M-11,-4 L11,-4 M-11,3 L11,3 M-15,15 L15,15",
    nishapur: "M-15,14 L-15,-2 Q0,-17 15,-2 L15,14 Z M-5,-17 L-5,-24 M-9,-20 L-1,-20",
    rayy: "M-9,15 L-9,-17 L9,-17 L9,15 Z M-12,-17 L12,-17 M-12,-10 L12,-10 M-12,-3 L12,-3 M-12,4 L12,4",
    hamadan: "M-15,14 L-15,-3 Q0,-19 15,-3 L15,14 Z M0,-19 L0,-25 M-4,-22 L4,-22",
    isfahan: "M-19,14 L-19,-4 Q-10,-19 0,-4 Q10,-19 19,-4 L19,14 Z M-23,14 L-23,-10 M23,14 L23,-10",
    shiraz: "M-18,14 L-18,-6 L-8,-6 L-8,-16 L8,-16 L8,-6 L18,-6 L18,14 Z M-5,14 L-5,0 L5,0 L5,14",
    tabriz: "M-17,14 L-17,-8 L17,-8 L17,14 Z M-12,-8 L-12,-15 L-6,-15 L-6,-8 M6,-8 L6,-15 L12,-15 L12,-8 M-4,14 L-4,1 L4,1 L4,14",
    delhi: "M-7,15 L-7,-20 L7,-20 L7,15 Z M-10,-20 L10,-20 M-10,-14 L10,-14 M-10,-7 L10,-7 M-10,0 L10,0 M-10,7 L10,7",
    agra: "M-18,14 L-18,-2 Q0,-20 18,-2 L18,14 Z M-23,14 L-23,-8 M23,14 L23,-8 M-8,14 L-8,3 L8,3 L8,14",
    lahore: "M-18,14 L-18,-6 L-8,-6 L-8,-16 L-2,-16 L-2,-6 L6,-6 L6,-16 L12,-16 L12,-6 L18,-6 L18,14 Z",
    multan: "M-15,14 L-15,-2 Q0,-18 15,-2 L15,14 Z M-7,14 L-7,3 L7,3 L7,14 M0,-18 L0,-24",
    dhaka: "M-18,14 L-18,-5 L-9,-5 L-9,-14 L-3,-14 L-3,-5 L5,-5 L5,-14 L11,-14 L11,-5 L18,-5 L18,14 Z",
    malacca: "M-20,11 Q-8,16 0,11 T20,11 M-14,3 L-4,-9 L10,3 M-6,3 L12,3 M-4,-9 L-4,3",
    quanzhou: "M-10,15 L-10,-16 L10,-16 L10,15 Z M-14,-12 L14,-12 M-14,-5 L14,-5 M-14,2 L14,2 M-14,9 L14,9 M-5,-16 L5,-22",
    xian: "M-9,15 L-9,-18 L9,-18 L9,15 Z M-14,-12 L14,-12 M-14,-5 L14,-5 M-14,2 L14,2 M-14,9 L14,9 M-4,-18 L4,-24",
    kashgar: "M-18,14 L-18,-5 L18,-5 L18,14 Z M-12,-5 L-12,-12 L-6,-12 L-6,-5 M6,-5 L6,-12 L12,-12 L12,-5 M-5,14 L-5,0 L5,0 L5,14",
  };
  function iconPath(n: Item) {
    return ICON_PATHS[n.slug] ?? (n.cls === "building"
      ? "M-18,14 L-18,-8 L0,-18 L18,-8 L18,14 Z M-7,14 L-7,0 L7,0 L7,14"
      : "M-18,14 L-18,-6 L-8,-6 L-8,-15 L0,-15 L0,-6 L12,-6 L12,14 Z M-3,14 L-3,3 L6,3 L6,14");
  }
  function nodeShape(n: Item, r = 20) {
    if (n.cls === "event") return `M0,${-r} L${r},0 L0,${r} L${-r},0 Z`;
    if (n.cls === "building") return `M${-r},${-r * .75} L${r},${-r * .75} L${r},${r * .75} L${-r},${r * .75} Z M${-r * .35},${r * .75} L${-r * .35},0 L${r * .35},0 L${r * .35},${r * .75}`;
    if (n.cls === "place") return `M0,${-r} L${r * .9},${-r * .45} L${r * .9},${r * .45} L0,${r} L${-r * .9},${r * .45} L${-r * .9},${-r * .45} Z`;
    if (n.cls === "work") return `M${-r * .85},${-r * .65} L${r * .85},${-r * .65} L${r * .85},${r * .65} L${-r * .85},${r * .65} Z M${-r * .5},${-r * .25} L${r * .5},${-r * .25} M${-r * .5},${r * .15} L${r * .5},${r * .15}`;
    if (n.cls === "journey") return `M${-r},${r * .55} C${-r * .5},${-r * .65} ${r * .5},${-r * .65} ${r},${r * .55} M0,${-r * .75} A${r * .18},${r * .18} 0 1,0 0,${-r * .39}`;
    if (n.cls === "group" || n.cls === "polity") return `M0,${-r} L${r * .95},${-r * .3} L${r * .6},${r} L${-r * .6},${r} L${-r * .95},${-r * .3} Z`;
    if (n.cls === "object") return `M${-r * .8},${-r * .5} L${r * .8},${-r * .5} L${r * .8},${r * .5} L${-r * .8},${r * .5} Z M${-r * .8},0 L${r * .8},0`;
    return `M0,${-r} A${r},${r} 0 1,1 0,${r} A${r},${r} 0 1,1 0,${-r}`;
  }
</script>

<section class="map-viewer" class:light={isLight} aria-label={tt("viewer", "عارض خريطة الإسلام")}>
  <div class="toolbar ui">
    <button class="ctrl icon" onclick={back} disabled={!canBack} aria-label={tt("back", "عودة")}><RotateCcw size={16} /><span>{tt("back", "عودة")}</span></button>
    <div class="crumbs" aria-live="polite">
      <span>{tt("world", "العالم")}</span>
      {#if level !== "world"}<span>‹ {regionById.get(selectedRegion)?.label}</span>{/if}
      {#if level === "city" || level === "focus"}<span>‹ {selectedPlaceNode?.label}</span>{/if}
      {#if level === "focus"}<span>‹ {selectedEntityNode?.label}</span>{/if}
    </div>
    <div class="zoom" role="group" aria-label={tt("zoom", "تكبير الخريطة")}>
      <button class="icon" onclick={() => zoom = Math.max(1, zoom - .5)} aria-label={tt("zoom_out", "تصغير")}><Minus size={15} /></button>
      <input type="range" min="1" max="4" step=".25" bind:value={zoom} aria-label={tt("zoom_bar", "شريط التكبير")} />
      <button class="icon" onclick={() => zoom = Math.min(4, zoom + .5)} aria-label={tt("zoom_in", "تكبير")}><Plus size={15} /></button>
      <button class="icon" onclick={toggleTheme} aria-label={isLight ? tt("theme_dark", "الوضع الداكن") : tt("theme_light", "الوضع الفاتح")}>{#if isLight}<Moon size={15} />{:else}<Sun size={15} />{/if}</button>
      <button class="preview-button" disabled={!canBack} onclick={back} aria-label={canBack ? tt("level_up", "المستوى الأعلى") : tt("world", "العالم")}>
        <svg class="preview" viewBox="0 0 120 72" aria-hidden="true">
          <rect width="120" height="72" rx="8" />
          <g transform={`scale(.12) ${previewTransform}`}>
            {#each worldPaths as d}<path class="preview-world" d={d} />{/each}
            {#if previewLevel === "world"}
              {#each activeRegions as r}<path class="preview-region" d={r.path} />{/each}
            {:else}
              {#if regionById.get(selectedRegion)}<path class="preview-region selected" d={regionById.get(selectedRegion)!.path} />{/if}
            {/if}
          </g>
        </svg>
      </button>
    </div>
  </div>

  <div class="stage" bind:this={stageEl} class:dragging onpointerdown={dragStart} onpointermove={dragMove} onpointerup={dragEnd} onpointercancel={dragEnd} style={`--zoom:${zoom};--panx:${panX}px;--pany:${panY}px`}>
    <svg class="scene" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={mapAria}>
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width={W} height={H} class="sea" rx="24" />
      <g class="world-map" aria-hidden="true" transform={activeWorldTransform}>
        {#each worldPaths as d}<path d={d} />{/each}
      </g>

      {#if level === "world"}
        <g class="regions">
          {#each activeRegions as r}
            <path d={r.path} class="region" style={`--tint:${r.tint}`} class:hover={hoverId === r.id} onmouseenter={() => hoverId = r.id} onmouseleave={() => hoverId = null} onclick={() => wasClick() && openRegion(r.id)} tabindex="0" role="button" aria-label={r.label} onkeydown={(e) => e.key === "Enter" && openRegion(r.id)} />
            {#if hoverId === r.id}<text x={r.labelX} y={r.labelY} class="region-label">{r.label}</text>{/if}
          {/each}
        </g>
      {/if}

      {#if level === "region"}
        {@const r = regionById.get(selectedRegion)}
        {#if r}
          <path d={r.fitPath} class="region selected" style="--tint:.09" />
        {/if}
        {#each regionPlaces as p, i}
          {@const pos = placePos(p)}
          <g class="place" class:hover={hoverId === p.id} transform={`translate(${pos.x} ${pos.y}) scale(.42)`} onmouseenter={() => hoverId = p.id} onmouseleave={() => hoverId = null} onclick={() => wasClick() && openPlace(p.id)} tabindex="0" role="button" aria-label={p.label} onkeydown={(e) => e.key === "Enter" && openPlace(p.id)}>
            <circle r="34" class="halo" />
            <path d={iconPath(p)} class="wire" />
          </g>
        {/each}
      {/if}

      {#if level === "city"}
        {#if selectedPlaceNode}
          <g class="back-symbol" transform={`translate(${C.x} ${C.y}) scale(5)`} class:hover={hoverId === selectedPlaceNode.id} onmouseenter={() => hoverId = selectedPlaceNode.id} onmouseleave={() => hoverId = null} onclick={() => symbolClick(selectedPlaceNode.id)} tabindex="0" role="button" aria-label={selectedPlaceNode.label} onkeydown={(e) => e.key === "Enter" && symbolClick(selectedPlaceNode.id)}>
            <circle r="29" class="hit" />
            <path d={iconPath(selectedPlaceNode)} class="wire" />
          </g>
          <line x1="80" y1={C.y - 105} x2="920" y2={C.y - 105} class="horizon" />
          {#each orbitItems as n, i}
            {@const pos = orbitPos(i, orbitItems.length)}
            <g class="orb" class:hover={hoverId === n.id} transform={`translate(${pos.x} ${pos.y})`} onmouseenter={() => hoverId = n.id} onmouseleave={() => hoverId = null} onclick={() => openEntity(n.id)} tabindex="0" role="button" aria-label={n.label} onkeydown={(e) => e.key === "Enter" && openEntity(n.id)}>
              {#if hoverId === n.id}<line x1="0" y1="0" x2={C.x - pos.x} y2={C.y - pos.y} class="live-link" />{/if}
              <path d={nodeShape(n, n.cls === "person" ? 17 : 15)} class="node" />
              <text y="45" class="node-label">{hoverId === n.id ? n.label : ""}</text>
            </g>
          {/each}
          {#if orbitItems.length === 0}<text x={C.x} y={C.y + 170} text-anchor="middle" class="empty">{tt("empty", "لا توجد مواد موثّقة لهذا المكان في هذه السنة بعد.")}</text>{/if}
        {/if}
      {/if}

      {#if level === "focus" && selectedEntityNode && selectedPlaceNode}
        <g class="back-symbol focus-back" transform={`translate(${C.x} ${C.y}) scale(6.5)`} class:hover={hoverId === selectedPlaceNode.id} onmouseenter={() => hoverId = selectedPlaceNode.id} onmouseleave={() => hoverId = null} onclick={() => symbolClick(selectedPlaceNode.id)} tabindex="0" role="button" aria-label={selectedPlaceNode.label} onkeydown={(e) => e.key === "Enter" && symbolClick(selectedPlaceNode.id)}>
          <circle r="29" class="hit" />
          <path d={iconPath(selectedPlaceNode)} class="wire" />
        </g>
        {#each focusLinks as l, i}
          {@const n = itemById.get(otherEnd(l, selectedEntityNode.id))!}
          {@const pos = focusPos(i, focusLinks.length)}
          <g class="linkgroup" class:hover={hoverLink === `${l.from}|${l.to}|${l.type}`} onmouseenter={() => { hoverLink = `${l.from}|${l.to}|${l.type}`; hoverId = n.id }} onmouseleave={() => { hoverLink = null; hoverId = null; }}>
            <line x1={C.x} y1={C.y} x2={pos.x} y2={pos.y} class="spoke" />
            <text x={(C.x + pos.x) / 2} y={(C.y + pos.y) / 2 - 7} class="link-label">{hoverLink === `${l.from}|${l.to}|${l.type}` ? edgeLabel(l.type) : ""}</text>
          </g>
          <g class="orb" transform={`translate(${pos.x} ${pos.y})`} onclick={() => openEntity(n.id)} tabindex="0" role="button" aria-label={n.label} onkeydown={(e) => e.key === "Enter" && openEntity(n.id)} onmouseenter={() => hoverId = n.id} onmouseleave={() => hoverId = null}>
            <path d={nodeShape(n, n.cls === "person" ? 18 : 16)} class="node" />
            <text y="44" class="node-label">{hoverId === n.id ? n.label : ""}</text>
          </g>
        {/each}
        <g class="center-node" onclick={centerClick} tabindex="0" role="button" aria-label={selectedEntityNode.label} onkeydown={(e) => e.key === "Enter" && centerClick()}>
          <circle cx={C.x} cy={C.y} r="66" class="main" />
          <text x={C.x} y={C.y + 6} text-anchor="middle" class="main-label">{selectedEntityNode.label}</text>
          <text x={C.x} y={C.y + 34} text-anchor="middle" class="sub-label">{clsName(selectedEntityNode)} · {tt("details", "اضغط للتفاصيل")}</text>
        </g>
      {/if}
    </svg>

    {#if level === "city" && orbitPageCount > 1}
      <button class="orbit-nav prev" disabled={orbitPage === 0} onclick={orbitPrev} onpointerdown={(e) => e.stopPropagation()} aria-label={tt("prev_items", "المواد السابقة")}><ChevronLeft size={20} /><span>{tt("prev", "السابق")}</span></button>
      <output class="orbit-count">{Math.min(orbitPage, orbitPageCount - 1) + 1} / {orbitPageCount}</output>
      <button class="orbit-nav next" disabled={orbitPage >= orbitPageCount - 1} onclick={orbitNext} onpointerdown={(e) => e.stopPropagation()} aria-label={tt("more_items", "المزيد من المواد")}><span>{tt("more", "المزيد")}</span><ChevronRight size={20} /></button>
    {/if}
    {#if level === "focus" && focusPageCount > 1}
      <button class="orbit-nav prev" disabled={focusPage === 0} onclick={focusPrev} onpointerdown={(e) => e.stopPropagation()} aria-label={tt("prev_links", "العلاقات السابقة")}><ChevronLeft size={20} /><span>{tt("prev", "السابق")}</span></button>
      <output class="orbit-count">{Math.min(focusPage, focusPageCount - 1) + 1} / {focusPageCount}</output>
      <button class="orbit-nav next" disabled={focusPage >= focusPageCount - 1} onclick={focusNext} onpointerdown={(e) => e.stopPropagation()} aria-label={tt("more_links", "المزيد من العلاقات")}><span>{tt("more", "المزيد")}</span><ChevronRight size={20} /></button>
    {/if}

    {#if tooltip}
      <div class="tip ui" bind:this={tipEl} role="status"><b>{tooltip.label}</b><span>{clsName(tooltip)}</span></div>
    {/if}

    <div class="timebar ui" dir={rtl ? "rtl" : "ltr"}>
      <button class="icon" onpointerdown={(e) => e.stopPropagation()} onclick={() => adjustYear(-STEP)} aria-label={tt("prev_year", "سنة هجرية سابقة")}>{#if rtl}<ChevronRight size={18} />{:else}<ChevronLeft size={18} />{/if}</button>
      <input type="range" min={AH_YEAR_MIN} max={AH_YEAR_MAX} step="1" bind:value={hijriYear} aria-label={tt("year", "السنة الهجرية")} />
      <button class="icon" onpointerdown={(e) => e.stopPropagation()} onclick={() => adjustYear(STEP)} aria-label={tt("next_year", "سنة هجرية تالية")}>{#if rtl}<ChevronLeft size={18} />{:else}<ChevronRight size={18} />{/if}</button>
      <output>{yearLabel}</output>
    </div>
  </div>

  {#if detail}
    <div class="overlay" role="dialog" aria-modal="true" aria-label={detail.label} onclick={(e) => e.target === e.currentTarget && (detail = null)}>
      <article class="detail panel">
        <button class="close" onclick={() => detail = null} aria-label={tt("close", "إغلاق")}>×</button>
        <p class="eyebrow">{clsName(detail)}</p>
        <h2>{detail.label}</h2>
        <p>{detail.summary ?? tt("no_summary", "لم تُكتب لمحة عربية لهذه المادة بعد.")}</p>
        <div class="actions"><a class="chip" href={detail.href}>{tt("open", "افتح صفحة المادة")}</a><button class="chip" onclick={() => detail = null}>{tt("continue", "تابع الخريطة")}</button></div>
      </article>
    </div>
  {/if}
</section>

<style>
  .map-viewer { --gold2:#d4af37; --dark:#070707; --gold-soft:rgba(212,175,55,.16); color:var(--fg); position:relative; z-index:1; height:min(82vh,720px); min-height:420px; margin:0 0 1.5rem; background:var(--bg); overflow:hidden; border-radius:14px; }
  .map-viewer.light { background:var(--ivory); }
  .toolbar { position:absolute; z-index:5; inset-inline:16px; top:14px; display:flex; align-items:center; justify-content:space-between; gap:14px; }
  .ctrl,.zoom button,.timebar button { background:var(--panel); border:1px solid var(--line); color:var(--fg); border-radius:999px; padding:5px 14px; cursor:pointer; font:inherit; }
  .icon { display:inline-flex; align-items:center; justify-content:center; gap:6px; min-width:34px; min-height:34px; }
  .ctrl:disabled { opacity:.4; cursor:default; }
  .crumbs { display:flex; gap:8px; flex-wrap:wrap; color:var(--muted); font-size:.95rem; }
  .zoom { display:flex; align-items:center; gap:7px; }
  .zoom input { width:90px; accent-color:var(--gold); }
  .preview-button { padding:0; overflow:hidden; border-radius:8px; }
  .preview-button:disabled { opacity:.65; cursor:default; }
  .preview { width:74px; height:44px; display:block; background:#090909; border:1px solid var(--gold); }
  .preview rect { fill:transparent; }
  .preview-world { fill:rgba(212,175,55,.03); stroke:rgba(212,175,55,.55); stroke-width:3; }
  .preview-region { fill:rgba(212,175,55,.22); stroke:var(--gold); stroke-width:4; }
  .preview-region.selected { fill:rgba(212,175,55,.34); }
  .stage { position:absolute; inset:0; border:0; border-radius:0; overflow:hidden; background:var(--panel); touch-action:pan-y; }
  .map-viewer.light .stage,.map-viewer.light .preview { background:var(--ivory); }
  .scene { display:block; width:100%; height:100%; direction:ltr; transform:translate(var(--panx),var(--pany)) scale(var(--zoom)); transform-origin:center; transition:transform .12s ease-out; }
  .stage.dragging { cursor:grabbing; }
  .sea { fill:#090909; }
  .map-viewer.light .sea { fill:var(--ivory); }
  .world-map path { fill:rgba(212,175,55,.025); stroke:var(--gold); stroke-width:.6; vector-effect:non-scaling-stroke; opacity:.48; }
  .region { fill:rgba(212,175,55,var(--tint)); stroke:var(--gold); stroke-width:1.2; cursor:pointer; transition:filter .2s, fill .2s, stroke .2s; }
  .region:hover,.region.hover,.region.selected { fill:rgba(212,175,55,calc(var(--tint) + .20)); stroke:#f0d37a; filter:url(#glow); }
  .region-label { fill:#d4af37; font-family:var(--ar-body); font-size:16px; text-anchor:middle; pointer-events:none; paint-order:stroke; stroke:#090909; stroke-width:4px; }
  .map-viewer.light .region-label { fill:#755b10; stroke:var(--ivory); }
  .place,.orb,.center-node,.back-symbol { cursor:pointer; }
  .halo { fill:rgba(212,175,55,.08); stroke:rgba(212,175,55,.3); }
  .hit { fill:transparent; pointer-events:all; }
  .place:hover .halo,.place.hover .halo { fill:rgba(212,175,55,.24); }
  .wire,.back-symbol .wire { fill:none; stroke:#f0d37a; stroke-width:1.5; vector-effect:non-scaling-stroke; }
  .back-symbol .wire { opacity:.26; }
  .back-symbol.focus-back .wire { opacity:.18; }
  .back-symbol:hover .wire { opacity:.62; filter:url(#glow); }
  .horizon { stroke:var(--gold); opacity:.45; }
  .node { fill:#090909; stroke:#d4af37; stroke-width:1.7; transition:fill .2s,stroke .2s,filter .2s; }
  .map-viewer.light .node { fill:var(--ivory); }
  .orb:hover .node,.orb.hover .node { fill:rgba(212,175,55,.42); stroke:#f5dc82; filter:url(#glow); }
  .node-label,.link-label { fill:#f5dc82; font-family:var(--ar-body); font-size:15px; text-anchor:middle; paint-order:stroke; stroke:#090909; stroke-width:4px; pointer-events:none; }
  .map-viewer.light .node-label,
  .map-viewer.light .link-label { fill:#6f550b; stroke:var(--ivory); }
  .live-link,.spoke { stroke:#f0d37a; stroke-width:1.2; opacity:.65; }
  .linkgroup:hover .spoke { stroke-width:3; opacity:1; filter:url(#glow); }
  .main { fill:rgba(212,175,55,.26); stroke:#f5dc82; stroke-width:2; filter:url(#glow); }
  .main-label { fill:#f6dfa0; font-family:var(--ar-body); font-size:17px; pointer-events:none; }
  .sub-label { fill:#c5a345; font-family:var(--ar-body); font-size:10px; pointer-events:none; }
  .map-viewer.light .main-label { fill:#604a0b; }
  .map-viewer.light .sub-label { fill:#80651c; }
  .empty { fill:var(--muted); font-family:var(--ar-body); font-size:20px; }
  .orbit-nav { position:absolute; z-index:4; top:50%; transform:translateY(-50%); min-width:104px; height:44px; border-radius:999px; border:1px solid rgba(212,175,55,.7); background:rgba(9,9,9,.82); color:#f0d37a; display:flex; align-items:center; justify-content:center; gap:7px; padding:0 15px; cursor:pointer; backdrop-filter:blur(10px); font-family:var(--ar-body); font-size:14px; }
  .orbit-nav:hover:not(:disabled) { background:rgba(212,175,55,.2); }
  .orbit-nav:disabled { opacity:.32; cursor:default; }
  .orbit-nav.prev { left:18px; }
  .orbit-nav.next { right:18px; }
  .orbit-count { position:absolute; z-index:3; top:calc(50% + 34px); right:28px; color:#c9a845; font-family:var(--ar-body); font-size:12px; }
  .map-viewer.light .orbit-nav { background:rgba(247,243,234,.76); color:#6f550b; }
  .tip { position:absolute; left:18px; top:18px; z-index:3; width:max-content; max-width:min(320px,80%); background:rgba(9,9,9,.88); color:#f6dfa0; border:1px solid var(--gold); border-radius:12px; padding:8px 12px; pointer-events:none; display:flex; gap:8px; align-items:center; box-shadow:0 10px 34px rgba(0,0,0,.24); }
  .map-viewer.light .tip { background:rgba(247,243,234,.94); color:#604a0b; }
  .tip span { opacity:.75; font-size:.85rem; }
  .timebar { position:absolute; left:18px; right:18px; bottom:14px; display:grid; grid-template-columns:auto 1fr auto minmax(76px,auto); gap:10px; align-items:center; background:rgba(9,9,9,.82); border:1px solid rgba(212,175,55,.45); border-radius:999px; padding:8px 12px; }
  .map-viewer.light .timebar { background:rgba(247,243,234,.9); }
  .timebar input { width:100%; accent-color:var(--gold); }
  .timebar output { color:#f5dc82; min-width:70px; text-align:center; }
  .map-viewer.light .timebar output { color:#604a0b; }
  .overlay { position:fixed; inset:0; z-index:50; display:grid; place-items:center; padding:22px; background:rgba(0,0,0,.62); }
  .detail { max-width:620px; width:100%; border:1px solid var(--gold); box-shadow:0 20px 80px rgba(0,0,0,.35); position:relative; }
  .close { position:absolute; top:10px; inset-inline-end:10px; border:0;background:transparent;color:var(--fg);font-size:1.8rem;cursor:pointer; }
  .actions { display:flex; gap:10px; margin-top:18px; }
  .actions .chip { border:1px solid var(--gold); cursor:pointer; }
  @media (max-width:720px) { .toolbar { align-items:flex-start; flex-direction:column; } .zoom { width:100%; } .preview { margin-inline-start:auto; } .region-label { font-size:20px; } .timebar { left:10px; right:10px; grid-template-columns:auto 1fr auto; } .timebar output { grid-column:1/-1; } }
</style>
