# M1 — Public consultation audit, 2026-10-12

Baseline HEAD: `3804129`. Git clean at start. Source inspected: `app/client-forms.tsx`, all consultation call sites, API routes, hosting bindings and privacy page.

| Entry point before this task | Actual action | API / storage / notification | Success and spam behavior |
|---|---|---|---|
| Six destination cards | Navigate to `/gia-cuoc#yeu-cau`, no preselection | None | Navigation only |
| Header/shared quote CTA | Navigate to pricing form | None | Navigation only |
| Hero/process/SEA/AIR quote CTA | Scroll to `#bao-gia` | None | Navigation only |
| Homepage quote form | Client validation, build text, copy/hotline | None; browser memory only | “Nội dung đã sẵn sàng”; no server acceptance claim; no server spam protection |
| Pricing quote form | Same ConsultationForm | None | Same behavior |
| Contact form/page/footer | Same ConsultationForm, contact variant | None | Same behavior |
| Purchase form | Build purchase text for manual contact | None | Separate function, preserved |
| Tracking | Existing server partner lookup | Existing tracking endpoint | Preserved; outside lead implementation |

Data path verified from submit handler: `preventDefault → FormData → validation → setPreparedMessage`; no fetch, action, persistence, email or Zalo call. The existing privacy page explicitly stated no lead API. Consequently requests were not captured by the server; no historical stored lead backlog exists in this repository. It is impossible to infer how many users filled or abandoned those browser-only forms.

New consultation entries share one wizard and `/api/public/quote-requests`. Destination cards preselect their route; generic CTAs open the same dialog; embedded quote/contact forms use the same component and backend. Header and destination sources are explicit. SEA/AIR CTA targets work through the shared handler without changing their animation files. Purchase and tracking remain separate and unchanged.

References reviewed for flow organization: [DHL](https://www.dhl.com/vn-en/home/express.html), [FedEx](https://www.fedex.com/en-vn/shipping.html), [UPS](https://wwwapps.ups.com/ctc/request?loc=vi_VN), [Freightos](https://www.freightos.com/). EZWAY uses route/cargo/contact steps without prices or delivery promises.
