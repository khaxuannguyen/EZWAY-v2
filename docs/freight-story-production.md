# EZWAY freight — asset gate and production specification

Latest status on 2026-10-12: **SEA and AIR component motion delivered and verified under Strategy C (photographic 2.5D)**.

See `freight-rigs-implementation.md` for the continuation of all five milestones, independent mechanical parts, native desktop/mobile proof and measured limits. The historical poster/frame specifications below are preserved for reference and possible future 3D rendering upgrades.

Historical status before the current continuation: SEA now renders independent photographic cutouts with a deterministic articulated 2.5D pickup/placement rig. Milestone 1 has native browser forward/reverse/hold proof on desktop and mobile. AIR remains a poster; SEA port transfer, vessel departure, AIR loading and AIR takeoff are not implemented. This is not full acceptance of the twelve-action freight story. The old posters, vector assets/timeline and tests remain preserved. See `sea-pickup-implementation.md`, `sea-rig-assets.json` and `sea-rig-prompts.json` for the new renderer and its limits.

## Available resources and selected strategy

- Existing React/Vinext public application and GSAP/ScrollTrigger preserved.
- Built-in image_gen created the two original poster illustrations. Complete prompts and provenance: `freight-asset-provenance.json`.
- No Blender executable found on PATH or checked standard installation directories; no `.blend`, `.glb`, or `.fbx` freight models found in this workspace.
- Generated matching side-elevation cutouts now exist for the reach-stacker body, telescopic boom, spreader, container and truck, plus one empty environment plate. No licensed coherent SEA port/AIR rig or rendered sequence is available. No purchase, external license agreement, or production deployment performed.
- Selected strategy C for SEA milestone 1: an actual articulated photographic 2.5D rig, with independent transforms, explicit hinge/wrist/chassis anchors, rotating tires and contact shadows. The canvas sequence infrastructure stays available for coherent future renders. AIR still has no motion; no diagonal plane-cutout movement has been substituted for takeoff.
- Native generated sources are 1672×941, below the requested minimum desktop source width of 1920. They are not silently upscaled. Replace with ≥1920×1080 mastered posters before final visual acceptance.
- AIR poster is intentionally a cropped composition; its wing extends beyond the image edge. AI details are provisional, not evidence of actual fleet ownership or mechanically verified operations.

## Current delivered assets

See `freight-asset-manifest.json` for exact browser paths, dimensions, sizes, and outstanding roles. Only optimized WebP posters are distributed in public/. Original generated PNGs remain outside public/. Stock/licensed source packages are absent. Generated images contain only EZWAY branding; no reference-site image or proprietary animation was copied. Generated provenance does not establish exclusive copyright or third-party clearance.

## Exact outstanding render packages

Each story requires one approved, continuous 192-frame master with consistent geometry. All frame indices start at 0000; maximum 0191. Do not generate independent frames with imagegen.

Deliver two optimized sizes from the **same master render**:

| Variant | Browser dimensions | Template | Target bytes/frame |
| --- | --- | --- | --- |
| desktop | 1600×900 | /assets/freight-story/{sea,air}/frames/desktop/{frame}.webp | ≤180 KB average, ≤512 KB hard limit |
| mobile | 960×540 | /assets/freight-story/{sea,air}/frames/mobile/{frame}.webp | ≤80 KB average |

Deliver separate ≥1920×1080 original posters and 960×540 browser poster variants. For portrait framing retain loading contacts in a safe central region, or deliver an approved mobile-specific camera crop with the same timeline. No need for transparent object packages when using full-scene frames.

Budget: first visible poster ≤320 KB desktop / ≤150 KB mobile. Six decoded cached frames ≈34.6 MB desktop / 12.4 MB mobile, plus canvas and up to two in-flight decoded images. Peak bitmap budget ≈46.1 MB desktop / 16.6 MB mobile, plus canvas. DPR cap 1.5; two concurrent requests; six-frame rolling neighborhood; 8-second request deadline. Do not preload all 192 frames. Desktop full library average target ≤34.6 MB/story and mobile ≤15.4 MB/story, delivered progressively only as needed.

### SEA production direction

40-foot ISO container 12.192×2.438×2.591 m; primary cargo navy steel with realistic ribs/corner castings. A credible reach stacker, rated spreader and correctly scaled tractor/chassis. Use side/three-quarter 50 mm camera, ground plane Z=0, daylight from upper left, restrained navy/steel palette. Place truck and vessel where correct loading equipment can actually reach. Do not use reach stacker to load the ocean vessel. Maintain object IDs, materials, camera continuity and contact shadow geometry across all shots.

| Phase / scroll | Frames | Required action and acceptance |
| --- | --- | --- |
| 1 / 0–1/6 | 0000–0023 | Yard reveal; empty truck stops; reach stacker prepares; wheels contact pavement. |
| 2 / 1/6–2/6 | 0024–0063 | Boom aligns; spreader engages four corner fittings; lifts vertically; container remains rigid relative to spreader, shadow follows height. |
| 3 / 2/6–3/6 | 0064–0103 | Position above chassis; lower until chassis contact; subtle suspension settling; release only after contact; retract boom. |
| 4 / 3/6–4/6 | 0104–0119 | Truck accelerates towards quay; correct rolling wheels and camera follow; loaded container fixed to chassis. |
| 5 / 4/6–5/6 | 0120–0167 | Ship-to-shore crane engages; lifts clear; trolley traverses over ship; lowers into stow position; releases after deck contact. |
| 6 / 5/6–1 | 0168–0191 | Wider view; vessel leaves berth, credible water/wake and ocean depth; final message/CTA. |

### AIR production direction

Use one originally modeled or licensed twin-engine widebody freighter; record model-specific dimensional sheet, landing gear arrangement and door sill height. No partner airline livery. Main-deck loader MUST align with the appropriate main-deck opening. Typical pallet base about 2.44×3.18 m, final dimensions must match chosen aircraft. Camera/light continuity as SEA; gate-free airport apron, safety clearances. All equipment clears before taxi. Takeoff main gear remains on runway until rotation/lift-off; gear retracts only after positive climb.

| Phase / scroll | Frames | Required action and acceptance |
| --- | --- | --- |
| 1 / 0–1/6 | 0000–0015 | Parked aircraft; correct cargo door open; pallet/dolly and high loader staging. |
| 2 / 1/6–2/6 | 0016–0031 | Loader approaches and aligns with door; dolly positions pallet safely. |
| 3 / 2/6–3/6 | 0032–0079 | Transfer pallet to loader; elevate platform to sill; pallet rolls into hold without disappearance through fuselage; loader disengages; door closes. |
| 4 / 3/6–4/6 | 0080–0095 | Clear equipment; closed door; apron-to-taxiway transition and camera reposition preserving aircraft identity. |
| 5 / 4/6–5/6 | 0096–0167 | Runway acceleration; nose rotation; main wheels leave runway; visible climb with correct engine/wing/gear geometry. |
| 6 / 5/6–1 | 0168–0191 | Climb through atmospheric sky; gear sequence consistent; final message/CTA. |

## Integration gate

1. Obtain original models or licenses permitting public distribution of rendered derivatives; preserve source packages privately and record attribution obligations.
2. Render both continuous masters; review all contact points and six phase boundaries at 0%, 20%, 40%, 60%, 80%, 100%, both directions. Reject camera/object discontinuities, missing/flickering frames, false brand partnership and implausible mechanics.
3. Export optimized frame variants, copy only browser derivatives into public/. Run a full dimension/path/size validation, record SHA256 hashes.
4. Add a `sequence` entry to `FREIGHT_VISUALS` containing count 192, desktop/mobile variants and the six frameRanges above. Set `approved: true` and `status: 'sequence-approved'` only after passing this gate. Merely setting the flag does not constitute acceptance.
5. Verify canvas decoding, reverse and fast seek, missing/slow frames, reduced motion, resize/orientation, routes away/back, trigger cleanup and browser memory. Capture 12 actual desktop progression screenshots plus tablet/mobile evidence.
6. Tune scroll distance and composition with actual frames; remeasure Lighthouse/network/peak memory. Do not claim mid-range mobile FPS from synthetic Lighthouse alone.

## Implemented engine behavior

SSR photographic `<picture>`; mobile source selection; lazy asynchronous decode; image error text fallback; accessible native details for all six steps and usable CTAs. No compulsory long pinning for poster-only mode. Approved sequences use scoped GSAP matchMedia, six labels and normalized progress dispatch to the canvas. Single active caption; late CTA; hash anchors preserved. Cache is LRU, closes evicted/late ImageBitmaps, aborts on unmount, suppresses endless retries of missing frames, and discards superseded queued requests. Canvas draws on requested frame changes/resize rather than a perpetual RAF loop. Missing requested frames show the poster instead of a stale unrelated scene. Reduced motion avoids GSAP/frame fetching.

## Not yet verified / not delivered

Physical mechanical motion, all 12 motion phases, 12 phase-progress screenshots, actual frame continuity/decoding/GPU peak memory, real device smoothness, slow-network sequence behavior, production source-resolution target and full third-party clearance remain open. Build/unit tests and still-poster browser review cannot close those criteria. Production remains unchanged; EZWAY OS was not accessed.
