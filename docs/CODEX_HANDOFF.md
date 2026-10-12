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

# Active milestone — public lead intake, 2026-10-12

This section supersedes the prior destination-only next-step paragraph while preserving that handoff. Base HEAD for this task: 3804129. No pre-existing uncommitted changes.

Completed: old form audit; shared three-step desktop/mobile wizard; six card preselection; all 27 EU member destinations confirmed by owner; public POST API; actual local D1 persistence and transactional job; idempotency/rate/honeypot/consent/size validation; official Zalo provider; retry/leases/recorded statuses; optional Resend fallback adapter; privacy copy and real browser screenshots. Build/TypeScript/lint pass; 43 tests pass. Two synthetic QA records persisted after preview restart. Secrets in ignored .dev.vars only; zero client-bundle secret matches.

Not complete: real Zalo delivery. Token getMe succeeded (bot.iLzRkGYl, groups allowed), but getUpdates has returned 408/no event even after owner reported sending a test. Group invite is not a chat ID. ZALO_NOTIFICATIONS_ENABLED=false and recipient list empty. Do not invent a recipient, auto-allowlist unrelated events or claim SENT. Real email credentials absent. Production D1 not provisioned/deployed; local config UUID is only a placeholder.

Important files: lib/quotes/{config,validation,repository,notifications}.ts; app/api/public/quote-requests/route.ts; app/api/internal/lead-jobs/route.ts; app/components/consultation/*; migrations/leads/0001_public_leads.sql; worker.ts; vite.config.ts; wrangler.leads.jsonc; test/quote-leads.test.ts; docs/quote-forms-audit.md; docs/public-leads-operations.md; docs/public-leads-acceptance.md. Current checkpoint is the commit containing this handoff; use git log -1 for exact hash.

Preview remains http://127.0.0.1:3002/#tuyen-van-chuyen. Screenshots in workspace outputs/quote-consultation/. Local DB remains .wrangler/state/v3/d1/. Local cron must be drained via authenticated POST /api/internal/lead-jobs; production preserves worker.scheduled + five-minute cron.

Exact next step: run node scripts/zalo-bot-check.mjs updates while owner @mentions the correct bot with EZWAY TEST in the authorized group. Verify GROUP chat.id belongs to that group, configure ZALO_BOT_ADMIN_CHAT_IDS privately, enable notifications, restart preview with updated ignored secrets, and submit a marked synthetic request to prove database and real Zalo confirmation. Never send customer data to a discovered PRIVATE chat without owner authorization. Then record message ID/status, update acceptance report. Provision production public D1 and email only in approved rollout. No deploy without user approval. SEA/AIR are owner-accepted; do not redesign. Tracking/OS untouched.

# Active milestone — Zalo delivery and rollout preparation, 2026-10-12

This entry supersedes the previous missing-chat-ID next step. Base 94c9dcd. Bot getMe: BASIC, can_join_groups=true. GROUP EZWAY TEST event received; configured that approved group privately and enabled Zalo. Owner confirmed connection message f21002b78025f27cab33. PRIVATE test event also received but not allowlisted because group works.

Critical runtime fix: Workers reject redirect:error before fetch; Node accepts it. Changed Zalo/email to redirect:manual, never follow credential-bearing redirects. Real workerd regression added. Actual mobile lead EZWQ-20261012-AF816BA0A667449D9E74A51213CB5A70 stored and SENT with provider ID 07973c198f8ffdd6a499; owner confirmed exact lead in group. Same-key replay returned same ID and delivery attempt stayed 1. Three pre-fix synthetic jobs remain NEEDS_REVIEW; no bulk reset/replay/delete.

Reliability: per-delivery bounded attempts and timestamps (local migration 0002 applied), uncertain Zalo timeout/crash held for review, fallback preserved, authenticated aggregate queue health and sanitized probe, scheduled aggregate attention marker. Remote D1 build-target guard and explicit staging/production template prepared. All 48 tests, TypeScript/lint/build pass. Client/history secret scans clean; no customer logs. Screenshot outputs/zalo-automation/mobile-lead-success.png.

Current preview remains port 3002, local persistent D1 only. No staging/production creation, migration or deploy. Cloudflare CLI not authenticated. Email sender contact@ezway.vn and receiver admin.ezway@gmail.com configured privately, but Resend key/domain verification absent: real email NOT_CONFIGURED.

Important new files: lib/quotes/health.ts, lib/quotes/deployment-config.ts, migrations/leads/0002_delivery_attempts.sql, wrangler.leads.remote.example.jsonc, test/worker-fetch-contract.test.ts, docs/zalo-production-readiness.md. Updated notifications, private job endpoint, Worker, Vite config, diagnostic CLI and tests. UI/gallery/SEA/AIR/tracking/OS untouched.

Exact next steps: obtain/configure server-side email API key and verify ezway.vn sender domain; perform a marked actual email fallback test and record provider ID. Obtain authorized Cloudflare login and explicit staging rollout approval before creating a dedicated staging D1/Worker. Use the prepared runbook, never deploy local placeholder config, never migrate production without approval. Verify production backups/retention/cron/attention alerting during approved rollout. No need to repeat bot research or redesign UI. Current checkpoint is the commit containing this entry; git log -1 identifies it.

# Active milestone — cinematic Hero Earth, 2026-10-12

Base clean 59f7150. Globe-only replacement of Canvas dotted rendering with Three r186 WebGL, NASA BMNG local textures, real geographic six routes, depth-tested great-circle arcs, animated signal/transition, accessible selector/pause/quotation link and responsive performance modes. Details and actual limitations: docs/earth-globe-audit.md. No SEA/AIR/gallery/header/tracking/wizard/API/D1/Zalo/OS changes; no production deploy or form submissions.

Build/lint/TypeScript and 51 tests pass. Browser desktop 59.9 FPS; mobile viewport 30 FPS cap (desktop hardware, not physical phone). Lighthouse local mobile 62→58; LCP 8702.6→8388.5 ms, CLS0, TBT55→242 ms. Engine deferred 1.8 s behind stable server-rendered poster/UI. Do not claim all performance metrics improved. Images and raw reports in workspace outputs/earth-globe. Browser recording unavailable; no fake video. See report for unforced reduced-motion/context restore and physical-device testing limits.

Preview port3002 active. Isolated baseline server stopped, source retained outside repository under work/qa-globe-baseline-59f7150. Final commit is git log -1 containing this entry. Next: owner visual review on preview, optionally physical phone / continuous motion recording and production-equivalent compressed measurements. Maintain Globe-only scope; previous email/staging rollout items remain separate and require their existing authorization.

# Production live — 2026-10-12

Owner explicitly authorized push and deploy. Globe141a3c5 and managed-hosting preparation ddb569e pushed to origin/ezway-public-redesign-2026; Sites source main also synchronized using short-lived stdin-only credential. Sites version20 deployed successfully from ddb569e770bd7c5e967c2f6009f96101d1509937. Deployment appgdep_6accc89dece48191be21c75bcfded325; environment revision2. Canonical custom domain https://ezway.vn active, SSL active; platform URL https://ezway-logistics-vietnam.khoahamhoc-2576.chatgpt.site. Public audience preserved.

Dedicated managed D1 binding EZWAY_LEADS_DB provisioned by Sites with schema-only migrations in drizzle/ (same SQL as immutable migrations/leads originals). Avoid duplicate local binding. No direct Cloudflare CLI deploy/local-placeholder deployment, customer imports or OS access. Sites production credentials configured privately. Build/lint/TypeScript and52tests pass; archive has no private env files, build secret scan zero matches.

Live HTTP: homepage200 and new Globe markup; Earth asset200; private jobs without auth401. Browser production Globe ready / three.js r186, no warning/error logs. Authenticated read-only health200: failed0, needsReview0, waitingConfig0, overdue0, requiresAttentionfalse. Zalo probe200: configuredtrue, httpStatus200, oktrue, elapsed131ms. No synthetic production lead sent. Email backup remains NOT_CONFIGURED (no Resend key); platform cron execution not yet independently demonstrated. Do not claim full production form-to-group delivery was tested: local test previously human confirmed; production readiness checked through storage health/probe.

Evidence screenshot outputs/earth-globe/production.png; archive outputs/ezway-production.tar.gz outside repo. Packaging on Windows required PATH Git/bin and TAR_OPTIONS=--force-local, no plugin source edits. Preview localhost3002 restarted. This documentation-only checkpoint does not change website assets/runtime from deployed ddb569e. Next: use live website; optional owner-authorized marked production lead smoke test and email/cron verification. Globe audit performance limits remain in docs/earth-globe-audit.md.

# Active investigation — production animation bug, 2026-10-12

Owner reports Chrome laptop static, phone working; new prompt explicitly forbids deploying the fix without confirmation. Version20/ddb569e still live. Do NOT apply earlier generic deployment permission to this new fix. No business/D1/Zalo/tracking/OS/asset redesign changes.

Real production browser normal desktop Globe runs59.9FPS/mobile viewport30FPS; SEA/AIR transform and reverse-scroll changes observed. Reproduced separate cold/rapid mobile initialization failure: SEA pin reaches end but stage progress0 even after all images decoded and rigReady/animated true; AIR subsequently progresses normally. Root cause: ScrollTrigger.refresh restores scrubbed timeline with suppressEvents=true while our custom photographic pose bridge only listens to timeline.onUpdate. Late AIR init/global refresh can therefore leave SEA at stale0. Fixed by explicitly publishing actual timeline progress onRefresh; retain scrub. Real GSAP regression proves suppressed callback/restoration. Local actual mobile fast pass now keeps SEA at.859608 after AIR refresh then1; AIR takes off/reverses. Added initialization/decode/shader/context-loss safe diagnostics, loading-latch finally/retry and honest Globe reduced-motion/pause UI with explicit user play.

55tests/build/lint/TypeScript pass. Headless Chrome forced-reduced Lighthouse screenshot validates reduced message/Bật chuyển động with zero console errors. Owner's external Chrome unavailable in browser connector; exact laptop Globe root remains unconfirmed. Need browser-specific stopReason/motionPreference/error data after an approved diagnostic deployment or connect that Chrome. Do not claim all three root causes are one or full production fix proven. Docs/production-animation-investigation.md has evidence and limits. Screenshots/raw DOM samples outputs/earth-globe. No video recording backend. Preview3002 running patched production build.

Next: obtain explicit confirmation for deploying this patch; then publish through existing public Sites project, preserving binding/environment/migrations and no production lead submission. Read actual production counters/progress/stopReason on laptop scenario, verify motion before reporting full resolution. Existing source credential may expire; mint fresh through native tool if needed. Packaging requires Git/bin PATH and TAR_OPTIONS=--force-local; NEVER package dist/server/.dev.vars. No further D1/secret reconfiguration required.

# Approved motion fix deployed — version21

Owner confirmed “Cho phép deploy bản sửa”.41aa56be88553d227d1feb7f74ee2dd9e5b40bd5 published as Sites version21; deployment appgdep_6accd9b5529c8191a2dadb540eb5284f succeeded2026-10-12T13:00:27Z. Existing public audience/domain and environment revision2 preserved. No D1/Zalo/tracking/OS configuration changes or production lead writes.55tests/build/lint/TypeScript pass. Artifact excludes private env files. Preview3002 restarted.

Production mobile fast-load verification now SEA stage1/timeline1/phase5 with departing container/vessel rather than version20 stale0. Actual scroll samples SEA.859564→1; AIR.124923→.874148, pallet entering, takeoff y-192.32/pitch-10.2344, reverse.125042ground. Globe30FPS mobile viewport, playing/normal/visible/running; desktop normal startup and frame growth. No console errors. Evidence production-v21-motion.json and production-v21-sea/air.png in outputs/earth-globe. Docs/production-animation-investigation.md updated with rollout result.

Pending: owner response to exact Chrome laptop after Ctrl+Shift+R. Phone works; external Chrome connector unavailable. Do not claim laptop Globe problem fully resolved without actual diagnostic state/owner confirmation. If still static, collect Globe motionPreference/motionState/stopReason/frames and fixed safe console error code on that session. No new redesign, asset changes or business mutation. This is documentation-only checkpoint after deployed41aa56b; source/assets remain identical.

# Active milestone — white-label public tracking, 2026-10-12

Owner requested API-to-UI provider privacy; explicit no deploy until approved. Started clean e6b81a5. Current production remains version21/41aa56b; NO deploy or production settings change in this task. New server allowlisted DTO toPublicTracking for four found-return branches. Upstream clients/parsers/routing/timeout/cache/credentials/status normalization/public-security unchanged. No OS/D1/Zalo/animation edits.

Public UI no longer imports normalized runtime or returns carrierCode/trackingUrl/nested upstream hrefs. Service SEA/AIR based only on explicit service token; neutral text removes named suppliers/domains/URLs while preserving state/time/geography/order/count. Fixed official last-mile URLs for explicit UPS/DHL variants/FedEx, DPD UK only; others recognized name-only. No country-based carrier assignment or arbitrary supplied URL adoption. NamDe inferred UPS requires full1Z reference. Related links use validated supported lookupCode, ordinary same-site anchor ensures initial query lookup mounts; ZAT numeric child IDs remain code/copy/text because current router only supports ZVN lookup. No fake child links.

63tests/build/lint/TypeScript pass. New tests include actual GET code via transport-only harness and all normalizers/DTO/private cache/rate limits. Production-build client scan zero upstream markers. Browser fixture-only QA across UPS/DHL/DPD/unknown/NamDe/twoZVN: no markers in DOM, external guard correct, local child click causes new GET, copy toast, mobile no overflow. Network fixture responses recorded, zero leaks. HTTP View Source homepage/tracking/About zero markers. Local LIVE Worker named user samples: twoZVN200/11events and KSN200/13events, no public markers/fields; no real customer payload saved. NamDe live not probed in this pass, only authorized synthetic fixtures.

Docs/white-label-tracking-review.md explains scope, URL evidence and test limits. Screenshot/network evidence outputs/white-label-tracking. Preview3002 remains actual implementation; fixture proxy is temporary and must not be confused with customer lookup. No publication/credential/config mutations. Exact next step: owner review and explicit release approval, then Sites deployment preserving bindings/environment. Do not deploy using earlier motion-fix approval; this request separately requires confirmation.

# Approved white-label tracking deployed — version22

This supersedes the prior white-label no-deploy state. Owner explicitly approved “OKE deloy đi”. Runtime source fbd7a2ff4bd88d3285a10ce26440cd7d273cae76 pushed and published as Sites version22, deployment appgdep_6acd0d0a20608191a37f290e9cc1b43b succeeded2026-10-12T16:39:05Z. Public audience/custom domain and environment revision2 retained; no env/binding/migration/OS/Zalo/animation changes. Archive excludes ignored private env files.63tests/build/lint/TypeScript passed before release with unchanged runtime source.

Actual ezway.vn JSON: ZVN202622246 and ZVN202622248200/11events;320240648427200/13events. All private,no-store and zero upstream name/domain/URL fields/carrierCode. Browser ZVN202622248 result rendered with five initially visible events, no error, no upstream DOM/link leakage. Aggregate-only evidence production-dom-v22.json; blank lookup screenshot production-tracking-v22.png in outputs/white-label-tracking. No real customer payload/screenshots stored. Preview3002 restarted. NamDe remains synthetic verification only; no live NamDe check claimed. This checkpoint only updates release documentation; production runtime stays fbd7a2f. No pending release action for this milestone.
