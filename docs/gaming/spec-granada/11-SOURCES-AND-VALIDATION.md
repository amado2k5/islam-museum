# Source register and implementation research queue
## Historical source leads checked 25 November 2026
These public institutional pages were retrieved during specification preparation. They support broad context only; inspect and cite exact claim-level evidence before putting facts in the game. They do not grant rights to all images or data. Existing museum records and repository citation policy remain the primary integration source.

| Source | Supports / investigate | Caveat |
|---|---|---|
| [UNESCO: Alhambra, Generalife and Albayzín](https://whc.unesco.org/en/list/314/) | Architectural heritage, irrigation engineering, urban context | Present-day site description, not full 1475 reconstruction |
| [Patronato: history](https://www.alhambra-patronato.es/en/discover/alhambra-y-generalife/history) | Nasrid foundation and later historical layers | Verify date of every building |
| [Patronato: Alhambra and Generalife](https://www.alhambra-patronato.es/en/discover/alhambra-y-generalife) | Palatine city and capital context | Rights separate from historical facts |
| [Patronato: urban structure](https://www.alhambra-patronato.es/en/edificios-lugares/estructura-urbana) | Court city and buildings, later additions | Exclude later layers from 1475 scene |
| [Patronato: water ponds](https://www.alhambra-patronato.es/en/edificios-lugares/water-ponds) | Darro, Sultan's Canal, Generalife and Alhambra hydraulic connection | Game water network is simplified, not engineering reconstruction |
| [Patronato: irrigation systems in the Vega](https://www.alhambra-patronato.es/en/disfrutar/irrigation-systems-in-the-city-and-the-vega-of-granada) | Nasrid-era water and agricultural research lead | Event description, follow scholarly sources for specifics |
| [Met: Art of the Nasrid period](https://www.metmuseum.org/es/essays/the-art-of-the-nasrid-period-1232-1492) | Dynasty date range, royal city, art and trade context | Confirm language and object rights individually |
| [Met: Iberian Peninsula 1400–1600](https://www.metmuseum.org/ja/toah/ht/08/eusi) | Late Nasrid period and fall in 1492 | Broad chronology; verify exact scenario conditions |
| [Met: textile fragment](https://www.metmuseum.org/art/collection/search/450734) | Nasrid silk geometric design | Object-specific image license required |
| [Met: geometric panel](https://www.metmuseum.org/art/collection/search/457717) | Carved ornament | Do not generate sacred or unknown text |
| [Archnet: Nasrid timeline](https://www.archnet.org/collections/2367) | Port commerce, silk, dried fruits, ceramics and architectural context | Validate regional/date specificity |
| [islam.museum](https://islam.museum) | Existing knowledge graph and source-linked entries | Repository discovery needed; no live catalogue audit here |

## Outstanding historical work
Find exact museum record IDs, multilingual labels, appropriate historic maps/coordinates, era-specific buildings, crop calendars for Vega and other regions, irrigation topology, trade commodity/route documentation, textiles and manufacturing stages, period clothing and transport, coin/currency terminology, political chronology and names, and evidence for scenario dates. Do not treat proposed prices or population as real. For modern elevation, land cover and map datasets verify terms, attribution, data quality and permission for redistribution. Modern geographic geometry does not establish historic borders. Do not guess from image details. Build a claim matrix: assertion, record ID, source URL/date/page, quotation if permitted, claim class, reviewer, asset license and scope. Document missing/disputed items. If impossible to establish, use explicitly fictional reconstruction or omit. Independent historical review required.

## Engineering starting resources (reference links; recheck current versions and policy in Claude)
- [Three.js docs](https://threejs.org/docs/) and [Babylon.js documentation](https://doc.babylonjs.com/): renderer evaluation, material/asset pipeline.
- [WebGPU specification](https://www.w3.org/TR/webgpu/) and [MDN WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API): capability detection and device features; [GPUDevice.lost](https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/lost) explicitly covers device-loss handling.
- [glTF specification](https://registry.khronos.org/glTF/) and [KTX](https://www.khronos.org/ktx/): portable 3D and texture standards.
- [Blender manual](https://docs.blender.org/manual/en/latest/): development-time asset production.
- [Playwright](https://playwright.dev/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [MDN IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), [OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system): tests, accessibility and persistence.
- [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), [crossOriginIsolated](https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated), [iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe): isolation design; refer to V2 threat model.
- [Factorio mod API](https://lua-api.factorio.com/latest/) and [mod.io docs](https://docs.mod.io/): design patterns for creator tooling, not permission to execute foreign code or reuse assets.
- [Cloudflare docs](https://developers.cloudflare.com/): inspect actual deployment and future services; no plan or entitlement assumptions.
- [Chrome releases](https://chromereleases.googleblog.com/) and [Edge release notes](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-relnote-stable-channel): verify at test date, feature-test actual device.
- [Claude Code documentation](https://code.claude.com/docs/en/overview), [effort](https://platform.claude.com/docs/en/build-with-claude/effort): refer to V2 operating protocol; verify actual available model settings.
- [itch.io HTML5](https://itch.io/docs/creators/html5), [CrazyGames developer](https://developer.crazygames.com/), [Poki developer](https://developers.poki.com/), [Coolmath Games developer](https://developers.coolmathgames.com/): verify current size, embedding, policy, SDK, AI disclosure and contract terms before export or submission. No eligibility asserted here.

Other source leads are inherited from the V2 archive, with the original evidence limits. This specification does not independently benchmark commercial games, current Fable examples or all third-party portal policies. Use current official documentation at implementation time and record versioned decisions.
