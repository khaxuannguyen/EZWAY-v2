# Public lead intake — acceptance checkpoint, 2026-10-12

Historical checkpoint `94c9dcd`. Zalo group delivery has since been verified end-to-end; see [zalo-production-readiness.md](./zalo-production-readiness.md) for current acceptance and remaining rollout dependencies.

## Delivered

One shared three-step route/cargo/contact wizard. Native accessible modal with focus restoration, Escape/backdrop close and scroll locking; responsive full-screen mobile. Existing landmark gallery retained. Six cards preselect US/CA/AU/NZ/GB/EU; EU requires a member country (all 27 confirmed by owner, list checked against [EU official countries](https://european-union.europa.eu/principles-countries-history/eu-countries_en)). Optional city/postcode, origin city, AIR/SEA/advice, optional measurements and unknown-weight selection. Required contact and explicit privacy consent. No invented quote, transit guarantee or cargo acceptance. No uploads enabled without storage.

Consultation forms now share `POST /api/public/quote-requests`, a D1 repository and a durable job outbox. Header/general CTAs use the same dialog. Source captured for gallery/header/contact/quote/public entries. Existing purchase and tracking submit logic preserved. Privacy/contact/FAQ descriptions updated to actual behavior.

## Verified data path

1. Direct local HTTP POST returned 201 with request `EZWQ-20261012-F7283BDF71BA4488B7957C986E200C8F`.
2. Real mobile browser Canada wizard completed and POSTed; success displayed `EZWQ-20261012-BCA993C01E664CD9A75ED4F97B32ED09`.
3. Private D1 SQL after preview restart returned both requests, status NEW, correct `quote_form` and `destination_gallery` sources. Storage is `.wrangler/state/v3/d1/`, independent of the preview process.
4. Replaying the first idempotency key returned the same request ID. Database still had only those two QA records.
5. Delivery columns correctly recorded NOT_CONFIGURED for Zalo/email. Mock-fetch tests confirmed formatter payload/recipient, timeout+email failure preserving lead, retry success with provider message ID, and no resend after confirmed delivery.

**Real FORM → BACKEND → D1 is verified. Real D1 → Zalo send is not yet verified.** Token getMe succeeded; chat discovery returned no event (408), so no approved API chat ID is configured. No external notification was claimed or sent. Email configuration also absent. These are launch blockers for unattended lead delivery, not UI-only omissions.

## Browser QA

Codex in-app browser: desktop 1440×900 and mobile 390×844. Clicked all six cards, read selected values: US/CA/AU/NZ/GB/EU. EU next step without country showed validation. Mobile route/cargo/contact steps completed; blank contact submission showed required name/phone/consent errors, values remained. Successful submission showed persisted request ID. Native horizontal gallery and prior SEA/AIR visuals retained.

Screenshots: workspace `outputs/quote-consultation/desktop-route.png`, `desktop-eu-validation.png`, `mobile-route.png`, `mobile-cargo.png`, `mobile-contact.png`, `mobile-success.png`.

## Security and tests

- D1 atomic batch rollback on storage failure tested; no returned fake request ID.
- EU/consent/honeypot/measurement server rejection tested.
- Persistent hashed-IP rate limit: ten/hour; raw IP not stored in application table.
- HTTP GET lead endpoint: 405; unauthorized job drain: 401; cross-origin POST: 403; oversized body: 400.
- Payload <=12KB, strings/values bounded, server normalization and SQL parameters, random request UUIDs, unique idempotency keys.
- No public list/status mutation/attachment endpoint; no customer data in app logs/analytics/query strings.
- Token/client scan: 105 production-client files, zero matches for bot/KSN/job/rate secrets.
- TypeScript, lint and build successful at checkpoint. 43 tests pass (36 existing, seven new lead tests).

## Outstanding / limits

1. Capture and verify the authorized Zalo group chat ID, configure allowlist and enable sending; use a synthetic marked lead for real delivery acceptance.
2. Before approved deployment: provision production D1 independently, apply migration, bind server secrets and preserve cron handler. Local placeholder is not production storage.
3. Configure real email fallback sender/recipient/provider credentials if desired. Current fallback remains NOT_CONFIGURED.
4. Owner to approve retention duration/purge/backup process and confirm staffed direct-Zalo hotline account. Operator-only lead access/deletion documented, no automatic deletion policy invented.
5. Zalo has no documented sendMessage idempotency key: response-loss/crash can duplicate an unconfirmed notification; confirmed sends and submissions are deduplicated. Stable request ID included. No exactly-once claim.

No production deploy. No changes to EZWAY OS, tracking APIs, SEA/AIR animation code or assets. See `quote-forms-audit.md` and `public-leads-operations.md` for baseline and setup details.
