# SEA pickup — critical mechanical animation fix

Overall delivery: **PARTIAL. Milestone 1 works; milestones 2–5 are not complete.**

## Preservation and scope

Started from clean `4ffc92f`, inspected the previous `cfb88d4` GSAP timeline and retained its source. No reset, checkout replacement or deletion. Prior SEA/AIR photographic posters remain on disk. Only public freight components, asset packaging, documentation and tests changed. No tracking API, EZWAY OS or production deployment.

## Selected engine and motion

Strategy C: independent photorealistic bitmap cutouts, not frames of unrelated AI scenes. Six generated assets are in `public/assets/freight-story/sea/rig-v1/`. Full source hashes and alpha-crop coordinates are in `sea-rig-assets.json`; generation prompts are in `sea-rig-prompts.json`. Packaging only trims transparent margins and encodes WebP. The boom uses two clipped portions of the same cutout: the fixed outer section rotates at the body hinge and the inner section slides along its axis, preserving a mechanical overlap. Nothing stretches the boom during motion.

Reused the older choreography's lock/lift/rigid cargo transfer/lower/release order, forward/backward GSAP control, lazy import, matchMedia and cleanup. The previous port-gantry geometry was not reused as a reach stacker. New explicit side-elevation kinematics replace its position constants.

Shared camera coordinates: 1600×900. Ground contact y=650. Trailer corner support datum y=571. A nominal 20-foot container is rendered 347 units long with its height assigned from 6.058×2.591 m; its end pose x=536 aligns the two trailer corner supports at approximately x=536 and x=883. The generated artwork itself is a photographic illustration, not a certified CAD representation; this is a 2.5D visual rig, not a load-rated physical simulation. The truck cutout was corrected with imagegen to retract its landing support leg for transport; source wheels are sampled at their actual centers for rolling layers.

| Progress | Mechanical action |
| --- | --- |
| 0–.12 | Machine approaches; wheels roll with travelled distance |
| .12–.24 | Spreader lowers to the container corner datum |
| .24–.48 | Locked cargo lifts; boom articulates, shadow softens |
| .48–.68 | Raised cargo/machine advance; empty truck enters |
| .68–.86 | Cargo lowers exactly to chassis contact |
| .86–1 | Cargo stays supported; spreader releases/retracts |

These are **six substeps of milestone 1**, not the six completed full SEA story phases. The six end-to-end process descriptions remain accessible as site content, not as proof that those actions are animated.

`seaPickupPose(progress)` is a pure seekable pose function. GSAP ScrollTrigger drives a linear progress clock with `scrub: true`; each update applies the corresponding pose. There is no autoplay, timer or cumulative movement. The boom endpoint is solved from the spreader mount and fixed wrist offset. While locked, the spreader bottom and container top share a datum. After support, container bottom stays at the chassis deck while the spreader and body move independently. Frame-sequence mapping also now uses the requested `Math.round` formula.

Desktop/tablet pins the panel; mobile pins only the complete photo/caption stage. One common camera scale preserves alignment; desktop crops only excess background, mobile retains the full landscape composition. All assets must decode before pinning starts. Reduced motion retains a stationary rig, full process text and links without loading GSAP. Image failure stops motion and exposes a text fallback. Missing GSAP retains the static rig. Cleanup disconnects resize/proximity observers and reverts ScrollTrigger.

## Proof and checks

Browser proof uses real wheel input in the in-app browser on the local production build, with read-only DOM object geometry and transform snapshots. No scripted progress setting or synthetic rendered scene was used as browser evidence. Desktop ground/lift/placement/reverse and mobile equivalents are separate screenshots. A large scroll seek reaches the supported end pose; returning reaches the exact prior pose. An interval without wheel input held the same pose. See `outputs/sea-rig-motion-proof.json` and the milestone report outside the repo.

26 unit tests pass: 3 new mechanical invariant tests, 3 sequence/cache tests, 3 preserved legacy SVG tests and 17 tracking/security tests. Legacy SVG tests are not evidence for current photographic motion. New invariant tests check contact before/after lift, boom endpoint versus wrist over 1001 poses, locked spreader attachment, bounded telescoping overlap, arbitrary seeks and stationary supported cargo. A separate React/JSDOM check covers reduced motion, missing image, missing motion dependency and observer cleanup; it is not GPU QA.

Build, TypeScript, lint and whitespace checks pass. Desktop 1440×900 and mobile 390×844 browser checks show no horizontal overflow. Final sequential Lighthouse measurements through the local gzip proxy: desktop performance/accessibility/best-practices/SEO 100/100/100/100, LCP 0.733 s, CLS .0225, TBT 0 ms; mobile 89/100/100/100, LCP 3.383 s, CLS 0, TBT 36.5 ms. No rig asset requests occur during initial home navigation; the rig's six WebPs total 567,516 bytes and load only within 900px of the stage. These are local lab measurements, not production CDN or moving-rig FPS results. No video capture capability is exposed by the enabled browser tools; ten progression screenshots/geometry states and the invariant verifier are supplied. Physical low-end device FPS is unmeasured. AI hardware geometry/materials, occlusion and illumination remain provisional visual assets; no claim of EZWAY fleet ownership or engineering validation.

## Remaining resource gate

Local audit again found no Blender executable on PATH/standard locations and no freight `.blend`, `.glb`, `.gltf` or `.fbx` source package. [Official Blender portable downloads](https://www.blender.org/download/) are available, so installing the renderer is technically solvable; the missing executable alone is not the remaining blocker. Searches did not establish an immediately usable, licensed, mechanically rigged freight asset package in this session.

To continue coherent rendering, the exact missing assets are:

- SEA port: a quay crane with separate trolley/hoist/spreader and container vessel with valid deck contact anchors, plus matching quay/water camera/environment. The current backdrop's cranes/vessels are baked distant scenery; moving that backdrop cannot count as vessel departure.
- AIR loading: aircraft with interior cargo opening and separate operable door, high-loader with articulated lift/platform and matching pallet; loading contacts and occlusion must agree.
- AIR takeoff: the same aircraft with separate landing gear/wheels and an animation/camera package showing acceleration, main-gear-supported rotation, liftoff, gear retraction and climb. A translated aircraft poster cannot meet this requirement.

Supply/import a licensed PBR `.blend`/`.glb` rig with materials/textures, or deliver continuous mastered frames from that same scene using the sequence templates in `freight-story-production.md`. Matching separated 2.5D object packages with verified pivots/contact anchors are also acceptable where perspective stays fixed. Do not enable a sequence until its real assets pass continuity/mechanical QA. Milestones 2–4 remain gated and have no motion PASS or completion claim.
