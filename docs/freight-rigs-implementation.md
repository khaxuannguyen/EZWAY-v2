# SEA and AIR mechanical freight stories — 2026-10-12

Continuation of HEAD `4c2d7b9`, preserving the completed SEA pickup rig and historical posters, vector assets, sequences, reports and tests. Only the public freight components, assets, documentation and related tests changed. No API/tracking/EZWAY OS change or deployment.

## Delivery

Strategy C: photographic 2.5D components with independent transforms and explicit contact geometry. No Blender or freight model files were available. These are AI illustration parts, not footage or a true 3D simulation. Source images, full prompts, alpha-margin packaging and hashes are recorded in `freight-rig-extension-{source,prompts,assets}.json`; the original SEA pickup provenance remains in its existing documents.

| Milestone | Implementation | Validation |
| --- | --- | --- |
| 1 SEA pickup | Existing reach-stacker lock/lift/placement preserved in first half of SEA progress | Existing native desktop/mobile proof plus preservation test |
| 2 SEA shipping | Rigid truck/cargo travel, trolley and two cables, spreader lock, container lift/traverse/lower, deck support and release, cargo travels with departing vessel | Native desktop/mobile forward and reverse screenshots; contact and clearance tests |
| 3 AIR loading | Loader approaches; two fixed-length scissor arms raise level platform and pallet; cargo crosses actual hold opening and is occluded by fuselage; platform lowers and loader withdraws before door closes | Native desktop/mobile lift/insertion/closed/reverse screenshots; scissor and ordering tests |
| 4 AIR departure | Taxi and squared acceleration, rotating wheels, nose rotation around rear main-wheel contact, then vertical liftoff/climb and independent gear folding/retraction | Native desktop/mobile rotation/liftoff/climb screenshots; main-contact and gear sequencing tests |
| 5 Robustness | Mobile pins scene with captions below; desktop pins panel; image sources gated by proximity, decoded before GSAP; reduced motion static; listeners/observers/context cleaned on unmount or failure | Build, TypeScript, ESLint, 33 tests and six mocked fallback cases; native no horizontal overflow and no console errors observed |

## Progress and support

Both timelines have six phases and are controlled only by GSAP ScrollTrigger `scrub: true`. No autoplay, timer or motion based on elapsed time. Pure pose functions permit arbitrary forward/reverse seeks. Environment blending accompanies changes of location; mechanical objects retain independent positions.

SEA boundaries: .06, .24, .50, .63, .90. Progress 0–.50 maps into the original pickup function without rewriting it. Cargo remains fixed relative to truck until .665; crane locks before lift. Lift .665–.715, traverse .715–.80, lower .80–.86, release .86–.90. After .90 vessel and cargo share the same departure offset. The camera tracks the high lift and the environment follows the same vertical pan.

AIR boundaries: .08, .20, .44, .65, .84. Approach .08–.20; platform lift .20–.30; cargo insertion .30–.42. Loaded cargo stays on the hold floor when platform lowers .43–.49. Loader clears .49–.58, door closes .58–.62, taxi .62–.65. Acceleration .65–.84. Nose pitch begins .755 with main contact retained until .825. Liftoff starts .825, gear folds and draws into the fuselage .875–.965. The gear is behind the fuselage so retraction uses physical occlusion.

## Verification artifacts

Workspace `outputs/freight-rigs-motion-proof.json` records native wheel input, actual scroll positions and poses with individual desktop/mobile screenshots. It records a stationary hold and matching forward/reverse states. `freight-rigs-fallback-verification.json` is React/JSDOM proof of preference/asset/GSAP fallbacks and cleanup; it is explicitly not browser/GPU evidence. `FREIGHT-RIGS-MOTION-REPORT.html` collects the visible proof and test results.

The local production preview is port 3002. Lighthouse reports measure the initial homepage through the local gzip proxy; they do not certify animation FPS or low-end device GPU behavior. Browser QA used 1440×900 and 390×844 viewports on this computer. No claim of 60 FPS on all devices or CAD-level mechanical accuracy.

## Limits and preserved alternatives

Flat photographic parts cannot reproduce full depth or arbitrary camera angles. The camera therefore stays side-on; fine detail and relative machine scale remain illustrative. Higher fidelity would require a licensed 3D rig or one coherent render sequence. Historical 192-frame sequence specifications remain future optional upgrades, not a prerequisite for the delivered component-based Strategy C scenes. No unrelated independent generated frames or prerecorded video are used.


Final visual audit update: see `final-visual-motion-audit.md`. Trailer/stacker clearance, scissor base contacts, crane shadow fade and .22-second common timeline smoothing have been corrected. Small cutouts were resampled from preserved originals. Premium photoreal and physical low-end-device acceptance are pending.
