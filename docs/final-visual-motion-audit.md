# Final visual and motion audit — 2026-10-12

Baseline: `1e74ae8` on `ezway-public-redesign-2026`, initially clean. This continues the existing rigs. Public freight code/assets only; no tracking, API or EZWAY OS edits and no production deployment.

**Result: functional 2.5D motion verified after contact fixes; premium photoreal acceptance remains pending.** Flat photographic parts, mixed source perspective, static water and simplified lighting cannot be certified as a physically coherent premium 3D scene. Real low-end phones and GPU presented-frame measurements were unavailable. These limits are not replaced by unit-test PASS claims.

## Evidence and method

Workspace `outputs/final-freight-audit/FINAL-VISUAL-MOTION-AUDIT.html` contains four final SEA/AIR desktop/mobile videos, baseline videos, 15 key screenshots, raw measurements, findings and limitations. Browser inputs were native wheel events through the documented browser tool, including full forward/reverse runs and rapid 95% seeks. No injected scroll/progress or synthetic animation frames. The separate localhost:3005 audit proxy adds measurement controls; it is outside the repo and never enters production. Clean preview remains localhost:3002.

Videos use consecutive actual browser raster captures and their wall-clock timestamps, encoded as VFR MP4 without interpolation. Capture throughput was approximately 7–10 frames/s; these are continuity/contact evidence, not a 60 FPS compositor recording or proof of displayed FPS. Frame cadence was separately measured with requestAnimationFrame and PerformanceObserver; no-recorder runs are reported separately from video runs. Browser viewport tests used 1440×900 and 390×844 on this computer; mobile viewport is not a physical mobile device.

## Defects fixed

1. Trailer rear and stacker front wheel overlapped in the same projected plane. The stacker now travels 25 units during handoff rather than 110; its telescopic boom reaches the cargo while maintaining a 15-unit minimum separation from the trailer envelope. Wrist/contact invariants and reversibility remain intact.
2. Both lower AIR scissor bearings floated about 35 world units above the chassis rail. Base anchor corrected from 520 to 555, calibrated to the photographed rail. Fixed-length bars still support the level platform.
3. Direct `scrub: true` stepped at each discrete wheel event. The common timeline now uses a short .22-second GSAP catch-up; all parts use the same interpolated pose. Once catch-up completes, holding scroll keeps the pose stationary. This is smoothing linked to the scroll target, not autoplay. See [official GSAP scrub documentation](https://www.gsap.com/docs/v3/Plugins/ScrollTrigger/).
4. Cargo ground shadow disappeared at one hard progress threshold during crane lift. It now fades continuously with lift and remains absent over water.
5. Eight small rig assets were decoded at excessive source sizes. Resampled from preserved original sources; aircraft, vessel, crane and environment masters unchanged. New extension asset bytes: 2,075,942 → 1,407,082 (-32.2%). Actual unique loaded rig bitmap RGBA estimate: 66.05 → 50.78 MiB (-15.27 MiB). JS heap and bitmap estimates are separate; this estimate is not total resident GPU memory.

## Performance findings

No-recorder desktop/mobile runs: rAF cadence roughly 137–142 callbacks/s on this host; p95 around 7.1 ms. This host's high callback rate does not certify 144 presented FPS or mobile device performance. Raw per-frame logs retain all slow frames, long tasks and heap samples.

One AIR desktop run had a 548.8 ms frame gap near the beginning with no corresponding long task; a repeat did not reproduce that gap, but reached 83.5 ms and recorded one long task. Cause is not isolated; it may involve browser/host scheduling or rendering, so occasional stalls remain an audit limitation. SEA desktop/mobile also had individual slow frames. No console errors were observed in the measured mechanical journeys.

Render-attribution diagnostics retained two long-animation-frame entries of 54.7/56.3 ms with zero blocking duration and no script attribution. A further run omitted intermediate accessibility snapshots and reached p99 7.1 ms, but still recorded a 97.2 ms maximum and one 82 ms long task near the end. This narrows the evidence but does not establish a causal script fix; no data was discarded or an unproven GPU fix claimed. Raw diagnostic logs are included in the report directory.

An explicitly synthetic mobile-viewport stress run added 12 ms of busy main-thread work per frame: SEA/AIR around 67–69 callbacks/s, p95 about 20.9 ms; SEA had one long task and an 83.5 ms max frame. This is a stress test, not CPU throttling equivalent to a named phone. Real low-end Android/iOS testing is still required before device-level acceptance.

Lighthouse mobile: prior 88 versus audit run 89; LCP about 3.42 s and TBT 52 ms. The one-point difference is within normal run variability, not a claimed material improvement. The LCP element is the hero heading; layout CSS, fonts and framework/client startup dominate first render. Freight image sources are gated by proximity. Broader hero/framework optimization would require separate validation; no unrelated redesign was introduced to chase a score.

## Acceptance limits and next required resources

Container lift/travel/chassis support/crane/vessel handoff, pallet hold entry/occlusion, loader clearing, door closing, nose rotation, liftoff and gear retraction are visually evidenced. Unit tests cover contact/clearance and deterministic reverse behavior, but cannot validate photographic perspective or certify mechanical engineering accuracy.

For premium photoreal approval: one coherent licensed 3D scene/rig or render sequence with unified camera, light, shadows and water interaction; validate gear bogie behavior and door geometry against the chosen aircraft. Also obtain real low-end Android and iOS device sessions and a supported compositor recorder/profiler. Existing 2.5D assets and all historical work remain preserved in Git and prior artifacts.
