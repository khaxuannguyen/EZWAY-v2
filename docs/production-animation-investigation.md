# Production animation investigation — 2026-10-12

Production under test: ezway.vn, Sites version20, deployed source ddb569e. Local starting HEAD b899bf5, clean before changes. No redesign/asset changes, no D1/Zalo/tracking/business/OS edits, no production deploy or cache purge during this investigation.

## Findings with real JavaScript browser evidence

Owner reports Chrome laptop static, phone working; says reduced motion is not intentionally enabled. This is NOT treated as proof of the browser media query. Connected interactive browser is Codex IAB/Chromium; external Chrome is unavailable (`Browser is not available: chrome`). The owner's exact Chrome session/OS media preference, extensions, WebGL failures and service worker state cannot yet be read. Do not claim this laptop-specific Globe root cause is proven or the whole production issue resolved.

Normal desktop production: Globe ready, engine three.js r186, running=true, frame counter1133→5232, 59.9 FPS rolling sample. Mobile viewport390×844 on desktop hardware:30.0FPS, frames2651, cpu0.43ms/max0.70ms, heap15.8MB, reduced=false. Desktop normal sample0.36ms CPU, max0.80ms. One page-wide long task in sample; FPS is Globe render rate, not SEA/AIR FPS or physical phone measurement.

Real production scroll changed SEA container translate(620,501.588)→(536,422.532), lifted it to y=-641.338, put it on vessel and moved vessel x1000→1900. AIR pallet x4262→2970 at y159.325; aircraft x0→2779/y-819.326/pitch-11.5767deg. Reverse scroll restored aircraft to x0/y0/pitch0 with pallet partially out. These are browser DOM transforms driven by real page scroll, not synthetic pose unit tests alone.

### Reproduced production defect

Fast mobile scroll while photographic rigs/GSAP initialize late: SEA pin spacer exists and ends at translateY3882px, section/stage animated=true/rigReady=true, all12 SEA images decoded, but stage progress stays0 and machinery stays at initial pose. Later AIR progresses0.135→0.697 while SEA still0. Not an image404 or reduced-motion case. Warm/slow desktop pass often works, so an unconditional production failure would be an inaccurate diagnosis.

Root mechanism: late AIR initialization calls global ScrollTrigger.refresh(), invalidating/restoring upstream SEA timeline. GSAP3.15 ScrollTrigger restores scrubbed animation through animation.totalProgress(prevProgress,true), suppressing callbacks. The app publishes custom freight-progress events only from timeline.onUpdate; the rig therefore misses the restored progress and can remain at a reset pose even when pin/animation state has advanced. The same event-only bridge is used by AIR, so it is vulnerable to later refreshes as well.

Regression test uses real GSAP: draw .43, reset0, restore .93 with suppressEvents=true; callback-driven pose remains0. Explicit refresh publication restores .93 and reverse .27.

## Fix and diagnostics

- Separate shared renderProgress from timeline.onUpdate, publish the restored actual animation progress in ScrollTrigger.onRefresh. Keep original scrub, phases, poses, photographs and geometry. No forced current-scroll seek that would remove scrub smoothing.
- GSAP/import/ScrollTrigger initialization reports fixed safe codes; release loading latch in finally, revert partial context and permit explicit retry after a failure. Previously loading stayed true after rejection, silently preventing retry.
- SEA/AIR decode failure reports safe asset-decode code; fallback is preserved.
- Globe reports fixed engine-import/webgl-init/texture-load/shader-compile/context-lost codes, deduplicated per element. No raw errors, customer data, secret values or credential URLs logged.
- Globe DOM diagnostics expose motionPreference, motionState, visible and stopReason alongside existing frame/FPS counters. UI no longer offers an enabled stop control while loading/fallback. Reduced motion defaults to static, shows explanatory status and explicit Bật chuyển động; explicit play may override only after user choice, pause still wins, later OS preference changes restore system behavior.

## After-fix validation

Local production build, actual browser mobile fast-scroll scenario: after AIR initializes/refreshes, SEA stage and restored timeline both0.859608, correct vessel pose, then SEA0.999999→1. AIR0.125→0.874 with takeoff y-192.341/pitch-10.2345deg; reverse back0.125 restores ground pose. No warning/error logs. Desktop SEA progresses0.538 with moving truck/loaded container. Globe59.9FPS desktop,30FPS mobile viewport; fresh-page pause gives user-paused/paused UI, resume gives playing/running=true.

Headless installed Chrome via Lighthouse with --force-prefers-reduced-motion: lightweight UI displays reduced status and Bật chuyển động, Earth rendered, zero console errors. Actual click-to-override under this forced Chrome profile is not independently exercised (policy unit test covers it). Interactive tests use connected Chromium, not the owner's external Chrome. Cache-disabled/hard-refresh/extension/service-worker inspection on that external session and physical-device/thermal tests remain incomplete. Normal reload plus fresh Lighthouse profile used; no blanket purge. No continuous video backend available; screenshots and sampled DOM evidence are not claimed as60FPS video.

Build/lint/TypeScript and55tests pass, including real-GSAP regression. No fixed build deployed to production or staging yet; owner explicitly requires confirmation before deployment. Production-after-fix acceptance remains pending that approval. Laptop-specific Globe failure also needs its actual diagnostic state rather than speculation.

## Deployment/cache audit

Live HTML Cache-Control no-store,must-revalidate; CSP is report-only, not enforcing a block. All HTML-referenced hashed CSS/JS assets audited return200 with correct text/css or text/javascript MIME. Every rig image inspected has complete=true and positive naturalWidth. Earth WebP returns200 with application/octet-stream on platform; connected Chromium successfully decodes and renders it, so this MIME observation is not established as root cause. No repository service-worker asset found; actual old service worker on owner's Chrome not observable here.

## Evidence

Workspace outputs/earth-globe/: production-motion-samples.json; prod-scroll-0..4.png; prod-air-takeoff.png; production-mobile-motion.json; prod-mobile-stuck.png; fixed-mobile-motion.json; fix-mobile-sea.png; fix-mobile-air.png; fix-mobile-globe.png; fix-desktop-sea.png; reduced-motion-local.json/jpg. Mobile samples from the first rapid pass precede late readiness; subsequent browser inspection proved decoded/ready but SEA progress0. Fixed samples are LOCAL, do not mislabel them production.

Files: freight-story-section.tsx, sea-pickup-rig.tsx, air-freight-rig.tsx, globe.tsx, hero-globe/earth-engine.ts, lib/animation-diagnostics.ts and test/animation-diagnostics.test.ts. New commit is the checkpoint containing this report, git log -1.
