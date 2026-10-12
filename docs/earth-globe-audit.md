# Hero Earth Globe — audit and acceptance, 2026-10-12

Base: `59f7150`, clean checkout on `ezway-public-redesign-2026`. No previous changes were reset. Current commit: the commit containing this report (`git log -1`). Preview: http://127.0.0.1:3002/. No production deployment.

## Audit and scope

Previous Globe: client-loaded Canvas 2D dotted sphere, approximate display positions and painted curves. Reused Hero slot, six markets, existing flag assets and quotation destination contract. Replaced only Globe rendering/UI/styles and added Three.js, geographic utilities, assets, tests and documentation. No SEA/AIR, gallery, header/nav, tracking, wizard logic, lead API, D1, Zalo or OS source changes. No form submitted during this audit.

## Implemented

- Three.js r186, one real WebGL sphere/context; NASA Earth texture, directional day/night shader, ocean specular response and thin Fresnel atmosphere. No postprocessing, clouds/night-light textures or unverified operational metrics.
- HCMC 10.8231/106.6297, Los Angeles, Toronto, Sydney, Auckland, London and Brussels at prompt coordinates. Spherical great-circle interpolation, distance-dependent lift, depth-tested arcs/nodes/signals, projected occluded labels. These are representative cities, explicitly labelled illustrations rather than live operations.
- 1.15-second smooth quaternion transition, route fade/draw, 4.2-second pulse/trail. Latest selection replaces transition target; no accumulated timelines. Gentle ±2° idle yaw drift over 120 seconds preserves both endpoints, rather than full-spin rotation which loses selected routes. Small desktop pointer parallax.
- Accessible six chips, keyboard/focus, aria-pressed and live route caption, pause control, prefers-reduced-motion static rendering. Consultation link uses existing destination/source hooks; browser confirmed US selected in the existing modal without submission.
- Stable server-rendered lightweight poster/UI, separate engine chunk starts 1.8 seconds after mount. Cleanup cancels pending startup, animation, observers/listeners and disposes GPU resources. Offscreen/hidden-tab rendering stops. Context-loss and texture-error fallback handlers.
- Mobile/low-core: 48×32 sphere, 1024 texture, DPR ≤1.25, 30 FPS cap. Desktop: 80×56, 2048, DPR ≤1.75; adaptive DPR 1/30 FPS if sustained measured FPS <25. No frame-driven React state updates.

## Actual measurements

Same local Vite/workerd preview, Chrome headless Lighthouse mobile default simulated throttling, `--disable-gpu --no-first-run`, one run per version. Local server does not represent production compression/CDN/network. No claim of production Lighthouse 90+.

| Metric | Before (59f7150) | Final |
|---|---:|---:|
| Lighthouse performance | 62 | 58 |
| Simulated LCP | 8,702.6 ms | 8,388.5 ms |
| TBT | 55 ms | 242 ms |
| CLS | 0 | 0 |
| Total transferred page bytes | 2,569,924 | 2,962,239 |

First WebGL implementation scored 56 / LCP 13,976.9 ms: heavy renderer and replacement poster delayed the LCP candidate. Splitting stable lightweight UI from delayed engine fixed that regression. Final LCP improves 3.6%; performance remains 4 points lower and TBT increases 187 ms due to engine initialization. This tradeoff remains, not reported as a performance improvement. Renderer chunk is ~543 KB uncompressed; production gzip is materially smaller but was not used to disguise this comparison.

Actual interactive Codex browser, separate from Lighthouse, 2-second rolling samples:

| Viewport | FPS | Mean JS render submission | Max sample | JS heap | Draw calls |
|---|---:|---:|---:|---:|---:|
| Desktop 1440×900 | 59.9 | 0.35 ms | 0.80 ms | 21.1 MB | 17 |
| Mobile viewport 390×844 | 30.0 (intentional cap) | 0.55 ms | 0.90 ms | 20.1 MB | 17 |

One page-wide long task observed in each sample period; observer counts the whole page after engine startup, not isolated GPU tasks. Heap is whole-page Chrome JS heap, not GPU memory or proof against leaks. These mobile dimensions run on the desktop host, not a physical low-end phone. Real phone thermals, GPU timing and long-session memory stability remain unverified. Tablet 820×1180 layout verified, no page overflow. Offscreen counter settled at 2237 and stayed unchanged on subsequent inspection; running=false. Rapid US→CA→AU and keyboard Enter selection verified; no runtime errors in normal browser.

## Validation and limitations

Build, TypeScript and lint pass; 51 tests pass including geographic unit-radius, axes/UV alignment, endpoints, raised arc, reverse symmetry, coincident/antipodal cases and all-six view framing. Baseline archive was moved outside the repo after comparison so generated baseline files do not contaminate lint/type checks.

Six selected-route screenshots show both origin and destination labels. Desktop/tablet/mobile inspected in browser. Disabled-WebGL Lighthouse run produced the lightweight Earth poster; Three logs expected context-creation errors, caught by UI fallback. Context-restoration, texture-failure, OS reduced-motion and hidden-tab paths reviewed in code but not forced interactively by this browser backend. Lifecycle disposal exists; no claim of exhaustive leak testing.

Browser backend exposes screenshots and interaction, no video recording capability. No fabricated video supplied. Static images prove visual states, not continuous-motion recording; use the live preview to review motion. No claim of physical-device QA.

## Evidence

Workspace output directory: `../../outputs/earth-globe` relative to repository. Files: before-desktop.png, before-mobile.png, before-mobile-globe.png; after-desktop.png, after-mobile-top.png, after-mobile-globe.png, after-tablet.png; route-US/CA/AU/NZ/GB/EU.png; baseline-mobile.report.html/json, after-mobile.report.html/json, fallback-mobile (JSON) and fallback-mobile.jpg. Six-route images were captured on the WebGL engine before the final loader-only optimization; geometry/shaders and route poses are unchanged.

## Asset provenance

NASA Earth Observatory Blue Marble Next Generation, July 2004, topography/bathymetry, Reto Stöckli / NASA GSFC. Source and usage policy are documented in public/assets/globe/README.md. Local WebP: 1024×512 70,684 bytes and 2048×1024 234,046 bytes, quality 85. No remote runtime texture requests or reference-site assets.
