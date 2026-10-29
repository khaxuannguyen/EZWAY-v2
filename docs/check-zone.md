# Australia zone lookup

Route: `/check-zone`. Linked from the shared desktop/mobile navigation, footer and tracking page. Existing production Site: `appgprj_6a8d2b66d65881918faf4f98f0830f4c` on ezway.vn.

## Source and mapping

Input: owner-supplied `checkzone.xlsx`, sheets `ZONE AUSPOST` and `ZONE AU-TOLL`. Stored values only; workbook instructions and formulas are not executed. Local JSON is fetched only on the zone page. No upstream service or geocoding is required for lookup.

- Aupost A4:F9094: 9,091 postcode records. B state, C transit, D description, E AIR-AU/AIR-AUF, F AIR-AU-DL/AIR-AU-DL-BH.
- Toll A5:E16289: 16,285 suburb records across 2,646 postcodes. A postcode, B suburb, C state, D transit, E Standard billing zone.
- Toll F5:I2615: 2,611 independent Priority postcode records. F postcode, G transit, H billing zone, I estimated domestic days after Melbourne pickup.

All postcode keys preserve/pad leading zeros to four characters. Priority must never inherit Standard's adjacent suburb, state or transit. Multiple Standard suburbs require an explicit selection. Raw `CHECK` / `Check Case by Case` values remain manual checks. An absent record means unavailable in this supplied dataset, not a definitive refusal by the carrier. Aupost state NAT is retained verbatim.

The sheet's K15 remote fee formula references an external workbook, not supplied. No remote fee or total surcharge is calculated. Toll's source oversize note is shown separately; no Aupost package-limit policy is inferred from the reference screenshot.

## Updating the source

Run `python scripts/import-au-zones.py /path/to/checkzone.xlsx` with the same two-sheet structure. Review counts and the generated data diff, update count controls in the tests if the source changed, then run the tests and build. Importer prints the source SHA256 for provenance. Original workbook is not published.

## Verification

68 tests pass including postcode formatting, all table counts, independent Priority lookup, suburb-specific variation, manual flags and absent services. TypeScript passes. Browser verified 0800, 2168/ASHCROFT, 320px mobile layout and desktop overflow bounds. Existing Worker, tracking API, lead storage, environment and Site audience are unchanged.
