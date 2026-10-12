# CODEX HANDOFF — EZWAY public website

Updated: 2026-10-12. Scope: only destination gallery `#tuyen-van-chuyen`.

## Git checkpoint

Base: `780f2afc9ade411a40fae8714c7988d353f1470f`. Earlier accepted rigs: `1e74ae8`. The destination checkpoint is the commit containing this handoff; read its exact hash with `git log -1 --format=%H`. Do not reset to the base. Git was clean when this task started. Previous work is preserved.

## Completed

- Six AI landmark illustrations and six local SVG flags (US/CA/AU/NZ/GB/EU).
- Data-driven section, editorial intro, desktop 3×2, tablet two columns, mobile horizontal snap.
- Route codes, names, logistics copy, gradients, hover/focus/active and reduced-motion CSS.
- Cards and general CTA keep the real quotation flow.
- 600/960px WebP variants, lazy loading and reserved image geometry.
- Browser checks at 1440/768/390px: photos/flags, keyboard focus, native horizontal scroll, quote CTA and console.
- Build, TypeScript, lint and all 36 tests successful.

## Current state and next step

Implementation and QA complete. No known blocking issue in this section. Next step: owner visual review of preview/screenshots. Do not redesign without feedback. No production deployment; deployment needs explicit authorization.

SEA/AIR are accepted by the owner: do not redesign them. Do not modify EZWAY OS, tracking API, secrets, database or unrelated sections.

## Files

- `app/page.tsx`: only destination import/replacement and removal of obsolete routes array.
- `app/components/destinations/destination-routes.ts`: six markets.
- `app/components/destinations/destination-section.tsx`: server-rendered section.
- `app/components/destinations/destination.css`: scoped layout/interactions.
- `public/assets/destinations/v1/`: WebPs and flags.
- `docs/destination-gallery-assets.json`: prompts, source filenames and flag URLs.
- `scripts/prepare-destination-assets.mjs`: packaging.
- `docs/destination-gallery-review.md`: verification/provenance/limitations.
- Workspace `outputs/destination-gallery/`: screenshots.

## Preview and restart

http://127.0.0.1:3002/#tuyen-van-chuyen

Run `npm start -- --port 3002`. Stop preview before build on Windows to avoid locked dist files. After build copy ignored `.dev.vars` into `dist/server/.dev.vars` without printing it, then restart. Never commit/expose credentials.

Original ImageGen PNG directory: `C:/Users/KHA DEP TRAI/.codex/generated_images/01a12604-524e-7ed2-99a4-6c98f68c11aa/`. Do not regenerate assets or repeat research unless a concrete issue is reported.
