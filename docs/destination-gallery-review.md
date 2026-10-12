# Destination gallery — 2026-10-12

Replaced only the homepage section `#tuyen-van-chuyen` with six full-image editorial cards, a stronger introduction and a shared quotation CTA. No tracking, SEA/AIR, OS, database or deployment changes.

## Layout and interactions

- Desktop: three columns, two rows, 460px cards.
- Tablet: two columns, 450px cards.
- Mobile: native horizontal scroll snap, 430px cards and next-card peek. Keyboard focus reveals off-screen links.
- Hover: 4px lift, 1.035 image zoom and subtle arrow movement. Focus: visible 3px outline. Reduced-motion CSS removes transforms/transitions.
- All six cards and the shared CTA use the existing `/gia-cuoc#yeu-cau` flow. No new claims about prices, transit time or coverage.

## Assets

Six photorealistic **AI-generated illustrations**, created with OpenAI ImageGen. These are not documentary photographs or EZWAY-owned facilities. Full prompts and original filenames are in `destination-gallery-assets.json`. Originals remain in the local Codex generated-images directory. Europe uses a Paris/Berlin/Rome triptych.

Twelve WebP files: 600×750 and 960×1200, quality 82. Total variants: 1,661,790 bytes. Six 600px images total 523,060 bytes; six 960px images total 1,138,730 bytes. Browser selects one variant per image. Lazy loading, async decoding, dimensions and fixed card geometry reserve layout space. No new client JavaScript or external image requests.

Six local SVG flags from [FlagCDN](https://flagcdn.com/), whose provider describes them as based on Wikimedia Commons vectors. Source URLs are recorded in the manifest. Flags replace emoji only within this section.

Asset packaging: `node scripts/prepare-destination-assets.mjs <original-image-directory>` with the existing Sharp asset tooling. This rebuilds destination WebPs only and preserves originals.

## Actual browser checks

Production preview inspected through the Codex in-app browser:

- 1440×900: three columns; both rows reviewed; all six photos loaded; no page overflow.
- 768×1024: two columns, 334.5px each; no page overflow. Also checked 820px.
- 390×844: horizontal scroll moved from 4px to 313px and snapped to Canada. Keyboard focus revealed Europe at scrollLeft 1504px. No page overflow.
- Canada keyboard focus: `rgb(8,126,164) solid 3px` outline.
- Europe CTA clicked: `/gia-cuoc#yeu-cau` opened with the real “Chuẩn bị yêu cầu báo giá” heading visible. All card/shared hrefs were checked against that existing target. No form submitted.
- Final homepage console error/warning log empty.

Visual issue fixed: centre-cropping cut upper landmark details. Photos now anchor to the top, with flags on the right to avoid covering the US torch. Readability and hover were visually reviewed. Reduced motion is implemented in CSS; no physical-device/OS reduced-motion test is claimed.

Evidence: workspace `outputs/destination-gallery/` contains desktop top/bottom, tablet 768px, mobile intro/card/swipe/Europe screenshots. Capture quality reflects the browser preview surface.

## Validation

`npm run build`, `npx tsc --noEmit`, `npm run lint`: successful. `npm test`: 36 passed, zero failures. Existing build warnings about middleware convention and Vite JSON import attributes are unrelated. No new Lighthouse/FPS measurement claimed. No production deployment.
