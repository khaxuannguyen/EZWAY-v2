# White-label public tracking — release review, 2026-10-12

Base clean e6b81a5. Owner approved release with “OKE deloy đi”. Implementation commit fbd7a2ff4bd88d3285a10ce26440cd7d273cae76 is deployed as production version22. No OS, Globe/SEA/AIR, D1, Zalo, credentials or business integration changes.

## Audit and implementation

Previous public API serialized NormalizedTracking, including carrierCode/trackingUrl/lastMileWebsite and nested related trackingUrl. UI used lastMileWebsite ?? trackingUrl and direct related links. Homepage labels/benefit copy, tracking metadata and About tracking bullet named upstreams.

New server toPublicTracking() creates a fresh allowlisted DTO for every successful lookup branch. Internal normalization remains available privately and unchanged. No spread of normalized object. Public DTO excludes upstream trackingUrl, carrierCode, nested trackingUrl, raw responses and integration metadata. Human text removes provider names/domains/URLs (including encoded URLs) with neutral facility wording. Event order, timestamps, state verbs, location geography and number of parcels preserved; tests include negative delivery and returned/held text, not just happy-path delivery. Technical statusClass limited to known display states. SEA/AIR service labels only mapped from explicit service tokens, never destination country.

Front-end imports PublicTracking as a type only; no normalization/client/secret import shipped. UI retains current layout, copy controls, counts and timeline. It removes internal carrier row; external link has carrier-specific label, HTTPS/hostname/path guard, target=_blank, rel=noopener noreferrer and no-referrer policy. Timeline details use sanitized event text. No CSS hiding.

Tracking integration files lib/ksn-tracking.ts, lib/zat-tracking.ts, lib/nam-de-tracking.ts and lib/public-security.ts have zero diff. API route diff is only mapper import plus four found-response conversions. Lookup order, timeout, redirects, credentials, cache, status normalization, rate limiting and error HTTP statuses unchanged.

## Last-mile policy

Carrier must be explicit recognized lastMileCarrier, not country, carrierCode or upstream URL. NamDe's inferred UPS flag additionally requires its full standard1Z reference (18 characters); otherwise keep the reference but do not claim UPS. Separate final-mile code is only shown when it is a distinct reference rather than the current EZWAY lookup identifier.

Fixed official destinations verified from primary pages: [UPS tracking](https://www.ups.com/track), [DHL tracking on its official home](https://www.dhl.com/), [FedEx Vietnam tracking](https://www.fedex.com/vi-vn/tracking.html), [DPD UK Follow My Parcel](https://track.dpd.co.uk/search). No arbitrary URL from a supplier is ever used for external href; no guessed deep-link query or parcel code is sent to a carrier. DHL/DHL Express/DHL eCommerce use official DHL home with its tracking input. DPD URL only if market is explicitly UK/GB/United Kingdom/Great Britain/Anh; DPD other markets are name-only until appropriate endpoints verified.

USPS, Canada Post, Royal Mail and Australia Post names are recognized when explicitly supplied, but remain name-only (no unverified endpoints). This supported-name list does not mean any particular shipment uses them. Unknown/unrecognized carriers get no external button. No independent carrier API confirmation is claimed: shipment association comes from existing normalized upstream evidence, not geographic guessing.

## Related parcels

Only validated lookupCode is sent to the UI; href is always /tra-cuu?code=<encoded-code>. Current successfully looked-up code is supported. Other related parcels need supported routing plus matching code in a recognized internal lookup URL, or ZVN format for ZAT. Arbitrary identifier alone does not prove lookup support. Numeric ZAT child package IDs cannot independently enter the existing ZAT route (router uses ZVN prefix), so preserve codes/copy/status/count but do not invent a link. Do not rewrite or disable backend routing to force those IDs through another supplier.

Internal navigation uses an ordinary same-site anchor, deliberately ensuring the existing initial-query lookup runs on mount; a same-page client Link could update the URL without rerunning its [] effect. Actual browser click verified new API lookup for the chosen related fixture.

## Verification

Build, lint, TypeScript and63tests pass. Eight new tests cover all three source normalizers, both existing ZVN fixtures, nested allowlist/immutability, negative state/time/location/order preservation, fixed UPS/DHL/DPD/FedEx URLs, wrong protocol/userinfo/suffix host/port/redirect rejection, unknown carriers, incomplete UPS evidence, supported related code validation and actual GET route branches. Route integration harness transpiles the real route, substitutes only upstream transport/fixture lookup and exercises real normalization/public mapper/security response. Rate-limit429, validation400 and private no-store headers verified; positive source priority preserved.

Built production client JS/HTML scan: zero upstream name/domain markers. Local HTTP View Source for homepage/tracking/About:200 and zero markers. HTML metadata description is neutral. No full-history reset or credential change.

Live LOCAL Worker lookup with existing private credentials, user-authorized sample codes: both ZVN samples return200/11events; supplied KSN sample returns200/13events. All public JSON checks report no upstream name/domain/URL/carrierCode leakage, private no-store. Only aggregate results recorded, no real customer payloads in report. NamDe verification in this pass uses synthetic fixture through real parser/GET route/UI; no live NamDe customer lookup claimed.

Browser actual production-build UI on fixture-only QA proxy: UPS, DHL Express, DPD UK, unknown courier, NamDe UPS reference and both ZVN fixtures. All rendered HTML checks zero provider markers. Unknown courier and ZVN have no external links; related hrefs local only. Click related parcel issued actual browser GET for new code; copy showed success toast. Desktop/mobile390×844 checked, no mobile horizontal overflow, no browser error/warning logs. QA responses clearly marked isMock; fixture harness never processes customer codes. Actual browser network traffic recorded at QA server:8requests initially, no leaking DTO and all private no-store. This is network-request evidence, not a claim of opening external Chrome's DevTools UI. UPS target=_blank click exercised, but new external tab is delegated outside connected IAB tab inventory; destination content verified via official web source, not falsely claimed as inspected popup. No physical-device or external Chrome click test claimed.

## Evidence and release

Workspace outputs/white-label-tracking: browser-network-fixtures.json (synthetic only), browser-dom-cases.json, view-source-audit.json, desktop-ups-fixture.png, mobile-zvn-fixture.png, unknown-carrier-fixture.png. Browser QA proxy/harness is local tooling only; no mock setup in production source. Actual preview http://127.0.0.1:3002/tra-cuu.

Files: new lib/public-tracking.ts, lib/last-mile-carriers.ts, test/public-tracking.test.ts and test/helpers/tracking-api-harness.ts; changed API found responses, tracking UI/page metadata, homepage tracking content/benefit and About tracking bullet. No CSS/layout redesign or upstream-client/parser edits. Commit containing this report is git log -1.

Approved production release: Sites version22, saved version appgprj_6a8d2b66d65881918faf4f98f0830f4c~appgver_446bb499d1888191b6baccc52b483764; deployment appgdep_6acd0d0a20608191a37f290e9cc1b43b succeeded at 2026-10-12T16:39:05Z. Exact pushed source fbd7a2ff4bd88d3285a10ce26440cd7d273cae76. Archive validated without local secret files/development directories. Existing public audience, ezway.vn domain and environment revision2 preserved; no binding or migration changes.

Post-deploy live https://ezway.vn/api/tracking checks: ZVN202622246 and ZVN202622248 return200/11events each; 320240648427 returns200/13events. All three public JSON bodies have zero upstream markers/URL fields/carrierCode and private, no-store headers. Production browser rendered ZVN202622248 result with five initially visible timeline events, no error state, no upstream DOM markers or upstream links. No real customer payload saved. Evidence: outputs/white-label-tracking/production-dom-v22.json and production-tracking-v22.png (blank production lookup page). Preview3002 restarted. This report update is documentation only; deployed runtime source remains fbd7a2f.
