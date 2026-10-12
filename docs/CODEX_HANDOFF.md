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
