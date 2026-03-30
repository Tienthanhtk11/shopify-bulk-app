# SubBulk App - Project Status & Memory

## Current State
**Status:** App is stable and the major Bulk Discount + Subscription Discount stacking bug has been fully resolved via Shopify Product Discount Functions.

## Recent Bug Fixes (March 28, 2026)
**Issue:** The Subscription Discount (e.g. 50%) and the Bulk Quantity Discount tiers were not stacking correctly in the checkout. The final price for an item with a Selling Plan was incorrectly calculated as just the single bulk discounted price ($46.99) instead of the bulk discounted price WITH the subscription applied ($23.50).

**Root Cause:**
* Shopify's Native Checkout automatically applies the Selling Plan discount to the `CartLine.cost.amountPerQuantity`. When a $100 base product has a 50% discount subscription, `amountPerQuantity` becomes $50.
* Our Shopify Function (`extensions/subbulk-discount/src/run.ts`) was pulling this `$50` and blindly subtracting the target bulk price (e.g. $46.99), resulting in only a ~$3 backend discount. As a result, the cart price incorrectly stayed at $46.99.
* Furthermore, the frontend widget calculates discounts using the store's global `subscriptionPercent` rule from the database via an App Proxy, while the WASM Function has no direct access to the Remix Database to know what that percentage is.

**Resolution:**
1. Modified `extensions/subbulk-discount/src/run.graphql` to pull both `line.cost.compareAtAmountPerQuantity` and the Selling Plan details.
2. Updated `extensions/subbulk-discount/src/run.ts`:
   * The function now explicitly compares `compareAtAmountPerQuantity` (the original base price, e.g. $100) vs `amountPerQuantity` (the subscription price, e.g. $50) to dynamically back-calculate the `subRatio` (e.g. 0.50). Includes fallback regex parsing on the Selling Plan name.
   * The Bulk Tier price (e.g. $46.99) is then discounted by this identical `subRatio` (46.99 * 50% = 23.495).
   * The function then calculates the strict per-unit difference ($50 - 23.495 = $26.505) and issues a `fixedAmount` discount combined with `appliesToEachItem: true`, correctly scaling across cart quantities (e.g. 5 items = $117.50).
3. The WASM Shopify Function was successfully compiled and re-deployed via `npx shopify app deploy --force` (App version Release 33).
4. Verified end-to-end functionality via an automated browser checkout simulation on the development store `test-11111...`.

## Tech Stack & Architecture
* **Frontend Widget:** Liquid / Vanilla JS (`extensions/subbulk-buy-box/assets/subbulk-widget.js`)
* **Backend:** Remix (+ PostgreSQL, deployed as a Docker container in the `thanhpt-stack` VM)
* **Discounts:** Shopify Product Discount Functions API (WASM extension at `extensions/subbulk-discount/`)
* **Data Sources:** Bulk pricing tiers are serialized into native product metafields under `app.bulk_pricing`.
