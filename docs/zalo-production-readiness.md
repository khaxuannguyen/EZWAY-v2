# Zalo automation and production readiness — 2026-10-12

Base checkpoint `94c9dcd`. Existing wizard/gallery/SEA/AIR/tracking preserved. No deployment or remote migration performed.

## Real Zalo diagnosis and acceptance

| Probe | Actual result |
|---|---|
| getMe | HTTP 200, ok=true, account_type=BASIC, can_join_groups=true, bot.iLzRkGYl |
| getWebhookInfo | HTTP 200, ok=false, error_code=404, “Not Found”; no configured webhook URL returned |
| getUpdates | HTTP 200, ok=true, GROUP chat and EZWAY TEST received after 13,326ms |
| Group sendMessage | HTTP 200, ok=true, message ID f21002b78025f27cab33 |
| Human confirmation | Owner confirmed connection test appeared in the authorized group |

Group capability was not the blocker. A valid group event was previously missing, so the invite URL could not be used as an API chat ID. A new live mention/test event now proves membership and identifies the correct GROUP chat. A PRIVATE test event was also received and authorized for testing, but it was not added to recipients because the group works. Earlier missing group events cannot be attributed conclusively to membership versus timing; no unsupported root-cause claim.

Receiving mode during diagnosis: successful long polling. No webhook registered/deleted and no localhost webhook. Notification delivery is outbound-only to the fixed authorized group; normal lead sending does not depend on incoming events. If an inbound webhook is added later, use public HTTPS plus `X-Bot-Api-Secret-Token` verification as required by the [official webhook documentation](https://docs.zaloplatforms.com/docs/BOT/webhook).

### Actual runtime defect fixed

CLI connectivity initially worked while website jobs failed before reaching Zalo. Workerd rejects `redirect: 'error'` with TypeError; Node accepts it. Isolated real-workerd probe reproduced this: error mode rejected before any outbound request, manual mode returned HTTP 200/ok=true. Switched Zalo/email/probe fetches to `manual`; redirects are not followed, keeping credentials on the intended origin. Added a real workerd regression test, not just a Node fetch mock. Worker getMe after fix: HTTP 200/ok=true, 137ms.

### Form → D1 → group proven

- Browser mobile 390×844 submitted a marked synthetic lead.
- Request: `EZWQ-20261012-AF816BA0A667449D9E74A51213CB5A70`.
- D1: delivery SENT; job DONE; attempt_count=1.
- Provider message ID: `07973c198f8ffdd6a499`.
- Owner explicitly confirmed receipt of the matching lead in the group.
- Same-key/body HTTP replay: 201, same request ID, same provider message ID, attempt_count still 1. No second notification.
- Screenshot: workspace `outputs/zalo-automation/mobile-lead-success.png`.

Three earlier synthetic QA deliveries remain UNCERTAIN/NEEDS_REVIEW from the pre-fix runtime failure. Their leads remain intact. They were not automatically replayed or deleted. The unsupported redirect was rejected before outbound sending; operator review can resolve these known test records separately. Do not bulk-reset uncertain deliveries or apply that inference to unrelated future timeouts.

## Reliability changes

- Added non-destructive local migration `0002_delivery_attempts.sql`: per-channel attempt counts/timestamps.
- Fixed unbounded email retries when Zalo configuration is absent; maximum five provider attempts per delivery.
- Confirmed SENT deliveries preserve message IDs and are skipped.
- Explicit provider transient rejections retry with backoff. Zalo network/timeout, malformed confirmation or interrupted SENDING become UNCERTAIN/NEEDS_REVIEW; no automatic duplicate-prone replay. Email fallback can continue. Resend retries use a stable idempotency key.
- Stale Zalo SENDING is reviewed after lease expiry, not blindly resent. Concurrent drains claim once.
- Authenticated `GET /api/internal/lead-jobs` returns aggregate failure/review/config/15-minute overdue counts; no customer data or lead list. `?probe=zalo` is also authenticated and returns sanitized provider metadata only.
- Scheduled processing emits only aggregate `EZWAY_LEAD_QUEUE_ATTENTION` when attention is needed. Configure platform alerting on that marker before launch; no paid monitoring account was created.

No provider guarantees exactly-once Zalo delivery. This implementation avoids automatic replay of unconfirmed sends; an operator must reconcile them with the group before resending. Customer lead storage remains independent of delivery failures.

## Email backup — not live yet

Owner supplied addresses: sender `contact@ezway.vn`, backup recipient `admin.ezway@gmail.com`. Stored in ignored local environment config. Resend API key is absent, and ezway.vn sender-domain verification has not been demonstrated. Adapter, timeout/retry/idempotency and provider-message-ID persistence tested; actual email sending NOT_CONFIGURED. No email claimed delivered.

Cloudflare session is not authenticated on this machine, so Email Service/account bindings and remote D1 cannot be inspected. Cloudflare Email Service is a possible official alternative, but account eligibility, verified sender and permitted recipients still require verification. No SMTP, paid signup or live account change performed. See [Cloudflare Email Service](https://developers.cloudflare.com/email-service/) and [Resend API](https://resend.com/docs/api-reference/emails/send-email).

## D1 rollout preparation

| Environment | State |
|---|---|
| Local | Real persisted D1; migrations 0001/0002 applied; mobile write/read/replay and real Zalo verified |
| Staging | Config prepared only; not created, migrated or deployed |
| Production | Config prepared only; not created, migrated or deployed |

`wrangler.leads.remote.example.jsonc` contains explicit separate environment bindings with deliberately invalid placeholder IDs. Copy to ignored root `wrangler.leads.remote.jsonc` and fill dedicated real IDs only during an approved rollout. Never use the OS database. Staging/production IDs must differ and be verified against their database names/account.

Build target defaults to local. Remote builds require `EZWAY_DEPLOY_TARGET=staging|production` plus `EZWAY_LEADS_STAGING_DB_ID` or `EZWAY_LEADS_PRODUCTION_DB_ID`. Missing/placeholder remote UUIDs fail immediately. This is a build configuration guard, not a remote deployment action. The generated `dist/server/wrangler.json` still needs review before any deploy; never deploy a local-target artifact.

### Commands prepared, NOT executed

After staging approval/account access:

1. `npx wrangler d1 create ezway-public-leads-staging` — record returned UUID and configure staging only.
2. `npx wrangler d1 migrations list EZWAY_LEADS_DB --env staging --remote --config wrangler.leads.remote.jsonc`.
3. `npx wrangler d1 migrations apply EZWAY_LEADS_DB --env staging --remote --config wrangler.leads.remote.jsonc`.
4. Build staging target with its UUID, inspect generated Worker config/bindings/cron, configure secrets on that specific staging Worker, and deploy only under explicit staging approval.
5. Repeat synthetic mobile/D1/Zalo/timeout/fallback/replay checks; staging group notifications must be clearly TEST-marked.

Production requires separate approval, UUID, Worker secrets and migrations. Secret bindings: ZALO_BOT_TOKEN, approved ZALO_BOT_ADMIN_CHAT_IDS, ZALO_NOTIFICATIONS_ENABLED, QUOTE_RATE_SALT, LEAD_JOB_SECRET; optional RESEND_API_KEY/LEAD_EMAIL_FROM/LEAD_EMAIL_TO. Keep NEXT_OTEL_FETCH_DISABLED=1 and outbound credential URLs out of tracing. No customer import or historical data mutation.

Backups: inspect D1 version/plan and obtain a Time Travel bookmark before approved migration. Cloudflare documents 7-day Free/30-day Paid recovery for supported D1; verify the actual account rather than assuming the plan. Private exports, if needed, belong outside public assets/Git with access and retention controls. Restore overwrites data and requires separate approval. See [D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/). No restore/export/remote migration performed.

## Security and final checks

- 105 client assets scanned: zero bot/KSN/job/email secret matches.
- Tracked files and full current Git history scanned: zero existing secret-value matches.
- `.wrangler/logs`: no log files/no matches; no provider URL/token/customer body logged by app.
- Public lead GET remains unsupported; private health/drain require bearer secret; no public lead list or status mutation.
- 48 tests pass, including real workerd redirect compatibility, timeout ambiguity, bounded email retries, stale/concurrent sends and remote-placeholder rejection.
- TypeScript, lint and production build pass; mobile console empty.
- No changes to consultation UI, gallery visuals, SEA/AIR, tracking or EZWAY OS.

Remaining launch dependencies: Resend key + verified sending domain (or verified Cloudflare Email Service configuration); authorized Cloudflare account access; explicit staging/production rollout approval; production secret/binding/cron/monitoring verification; approved retention/backup deletion policy. Zalo group delivery itself is now confirmed end-to-end locally.
