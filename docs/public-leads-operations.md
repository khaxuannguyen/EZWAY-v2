# Public website lead intake — operations

## Storage and deployment boundary

Lead data belongs only to ezway.vn. D1 binding: `EZWAY_LEADS_DB`. Local database: `ezway-public-leads`, persisted at `.wrangler/state/v3/d1/`. This is a real SQLite/D1 local store, not an in-memory mock. No EZWAY OS API/database used.

Local initialization: `npx wrangler d1 migrations apply EZWAY_LEADS_DB --local --config wrangler.leads.jsonc`.

The UUID ending `0001` in local configs is a **local placeholder**, not a provisioned production database. Before any approved deployment, provision a separate public-leads D1, replace the local placeholder in deployment binding configuration with its actual ID, apply migrations to that database, verify backups/access and preserve the `worker.ts` entry plus cron triggers. `.openai/hosting.json` is unchanged (existing d1/r2 null). Production storage has not been provisioned and nothing has been deployed. A missing binding/salt returns 503, not accepted success.

## Data flow

Wizard → same-origin POST → bounded JSON/schema/consent/honeypot validation → persistent rate counter → transactional lead+outbox job → awaited bounded dispatch → recorded delivery status. Cron retries due jobs every five minutes on Workers. `worker.scheduled` returns the dispatch promise; no fire-and-forget work.

Public API only returns accepted request ID. No GET/list/update lead API. Unique UUID-based request ID and unique idempotency key; changed payload with reused key returns 409. The D1 batch rolls back the lead if the job insert fails.

Private maintenance: `POST /api/internal/lead-jobs` with `Authorization: Bearer <LEAD_JOB_SECRET>`; it returns counts only. For local testing use a server-side script that loads ignored `.dev.vars`, never put that secret in a URL or frontend. Local preview does not automatically run cron; use this private drain. Production must preserve scheduled handler/triggers.

## Zalo configuration

Official [sendMessage](https://docs.zaloplatforms.com/docs/BOT/apis/sendMessage): fixed HTTPS endpoint, plain text up to 2000 characters, requires actual chat ID. Token is server-only. Secrets in ignored `.dev.vars` locally; production Worker secret bindings must be configured separately.

- `ZALO_BOT_TOKEN`: supplied token stored privately, never committed.
- `ZALO_BOT_ADMIN_CHAT_IDS`: comma-separated **approved API chat IDs**, not phone numbers/invite links; at most five receivers.
- `ZALO_NOTIFICATIONS_ENABLED=true`: only after confirming recipients and successful test.
- `QUOTE_RATE_SALT`, `LEAD_JOB_SECRET`: random server secrets, already generated locally.
- `NEXT_OTEL_FETCH_DISABLED=1`: disable Vinext outbound fetch tracing; additionally ensure production platform logs never record credential-bearing Zalo API URLs. Do not enable verbose outbound tracing for this provider.

Token checked via official [getMe](https://docs.zaloplatforms.com/docs/BOT/apis/getMe): valid `bot.iLzRkGYl`, group capability true. At this checkpoint [getUpdates](https://docs.zaloplatforms.com/docs/BOT/apis/getUpdates) returned `ok:false,error_code:408` (no event), including after owner reported sending a test. Group invite URL cannot safely be substituted for `message.chat.id`. No real sendMessage executed yet. Notifications remain disabled and stored statuses are NOT_CONFIGURED. `getWebhookInfo` returned error 404; no webhook was changed.

Operator checks: `node scripts/zalo-bot-check.mjs`; `node scripts/zalo-bot-check.mjs updates`. The latter prints only chat ID/type and whether a test marker was received. Have the owner add the correct bot, mention it with “EZWAY TEST”, and verify the GROUP event belongs to the authorized group before setting the allowlist. Do not auto-allowlist arbitrary inbound chats or send customer data to a private chat discovered during setup.

## Reliability and email

Atomic job claims with a 120s lease prevent concurrent dispatch. Confirmed SENT recipients are skipped on retries. Five provider attempts, exponential delays (1/2/4/8 minutes, capped at an hour), then FAILED jobs retained for operator review. Waiting for configuration retains lead/job without fake delivery success. Timeout/network/transient errors retry; permanent rejections are recorded. Lead saved before provider calls; customer acceptance only concerns persistence.

**Zalo sendMessage does not document a provider idempotency key.** If it accepts a message but its response is lost, or the worker crashes before recording confirmation, a retry can produce a duplicate notification. Stable EZWQ ID enables recognition; no exactly-once claim. Confirmed deliveries and concurrent requests are deduplicated. Operators must review FAILED/uncertain jobs before resetting them.

Email fallback uses official [Resend send-email](https://resend.com/docs/api-reference/emails/send-email), with a stable idempotency header. It requires `RESEND_API_KEY`, a verified `LEAD_EMAIL_FROM` and authorized `LEAD_EMAIL_TO`. None have been supplied; fallback adapter is implemented/tested but real email delivery is NOT_CONFIGURED. No SMTP/address invented. Email failure does not remove a lead or stop recorded retries.

Only Cloudflare/D1 administrators can inspect leads using private database tooling; no public admin UI. Review status via private SQL, scoped to this database. Handle correction/deletion requests through the existing hotline with identity verification and scoped SQL inside a transaction; never expose exports publicly. Retention duration/automatic purge has not been approved: no automatic deletion runs. Agree on a duration and backup deletion process before launch; current privacy copy explains purpose and operator-managed deletion rather than inventing a policy.

## Uploads and direct chat

No upload feature: hosting has no R2 binding; do not accept files without secure storage/type/size policy. Customers can discuss photos directly. Secondary Zalo links use `https://zalo.me/0523666966`, the existing business hotline; owner must confirm this phone is the intended staffed Zalo account before production launch. Direct-chat link does not replace submission or prove message delivery.
