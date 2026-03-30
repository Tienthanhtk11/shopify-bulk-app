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

## Implementation Progress (March 30, 2026)
1. Added root-level implementation plan at `/home/krizpham/shopify-bulk-app/plan.md`.
2. Current execution scope for this coding round:
   * merchant core schema
   * merchant service layer
   * privacy deletion request UI
   * uninstall + compliance webhook scaffold
3. External items still out of scope for this round:
   * Partner Dashboard managed pricing configuration
   * full plan selection redirect flow
   * full entitlement engine and background deletion worker
4. Completed schema foundation:
   * updated `prisma/schema.prisma`
   * added migration `prisma/migrations/20260330120000_merchant_foundation/migration.sql`
   * new tables: `Merchant`, `MerchantPlan`, `MerchantEvent`, `MerchantDataDeletionRequest`
5. Completed first implementation slice:
   * added `app/models/merchant.server.ts`
   * added merchant upsert in `app/routes/app.tsx`
   * added merchant privacy UI in `app/routes/app.privacy.tsx`
   * extended `webhooks.app.uninstalled.tsx` to mark merchant uninstall lifecycle
   * added webhook routes for app subscription updates and compliance topics
   * updated `shopify.app.toml` with billing and compliance webhook subscriptions
6. Current limitation of this slice:
   * data deletion is processed synchronously inside the request instead of a background worker
   * billing webhook currently stores raw snapshots/events but does not yet implement a full entitlement engine
7. Validation results:
   * `npx prisma generate` passed
   * `npm test` passed (9 tests)
   * `npm run build` passed
   * build still shows the pre-existing CSS warning related to `@media (--p-breakpoints-md-up) and print`
8. Completed step: entitlement engine + billing gate
   * added `app/services/entitlements.server.ts`
   * added `app/services/billing.server.ts`
   * added `app/routes/app.billing.tsx`
   * root app loader now reads the latest merchant plan and gates premium routes
   * current premium gating scope is intentionally narrow: analytics and offers
9. Completed step: async deletion job flow
   * merchant privacy form now creates `pending` deletion requests instead of deleting synchronously
   * added queue processor route `app/routes/jobs.deletion-requests.tsx`
   * queue processor is protected by `JOB_RUNNER_SECRET` via `x-job-secret`
   * deletion request statuses now move through `pending` -> `processing` -> `completed` or `failed`
10. Completed step: merchant admin list/detail pages
   * added internal admin guard via `INTERNAL_ADMIN_SHOPS` and `INTERNAL_ADMIN_EMAILS`
   * added `app/routes/app.merchants.tsx`
   * added `app/routes/app.merchants.$merchantId.tsx`
   * merchant detail page now exposes plan history, event log, deletion requests, and manual request processing
11. Validation results for second implementation round:
   * `npx prisma generate` passed
   * `npm test` passed (9 tests)
   * `npm run build` passed after entitlement, async deletion, and merchant admin additions
   * pre-existing CSS warning remains unchanged during build
12. Production hotfix for auth route health probe:
   * investigated live containers `thanhpt-shopify_app-1` and `thanhpt-caddy-1`
   * confirmed app root returned `200`, while `HEAD /auth/login` returned `500`
   * root cause was Shopify auth parsing on `HEAD` requests in `app/routes/auth.login/route.tsx`
   * added a narrow guard to return the normal loader shape for `HEAD` before calling `login(request)`
   * hardened the auth page component to fall back to `{}` when `errors` is absent
13. Validation results for auth hotfix:
   * `npm test` passed (9 tests)
   * `npm run build` passed
   * rebuilt the live `shopify_app` container from `/home/krizpham/thanhpt-stack`
   * verified production responses: `HEAD /auth/login` -> `200`, `GET /auth/login` -> `200`
   * pre-existing CSS warning remains unchanged during build
14. Billing plan mapping hardening:
   * added `app/services/partner-billing.server.ts` as the single place to map Partner Dashboard plans -> internal `planKey`
   * mapping now supports exact aliases and exact subscription GIDs via env vars:
     - `PARTNER_PLAN_FREE_NAMES`, `PARTNER_PLAN_FREE_GIDS`
     - `PARTNER_PLAN_GROWTH_NAMES`, `PARTNER_PLAN_GROWTH_GIDS`
     - `PARTNER_PLAN_SCALE_NAMES`, `PARTNER_PLAN_SCALE_GIDS`
   * updated `webhooks.app.subscriptions_update.tsx` to store canonical internal plan keys instead of slugifying billing names
   * billing snapshot now also tries to persist billing interval, test flag, and resolved mapping metadata in raw payload
15. Deletion queue scheduling:
   * added `deletion_job_runner` service to `/home/krizpham/thanhpt-stack/docker-compose.yml`
   * runner uses `curlimages/curl` and calls `POST http://shopify_app:3000/jobs/deletion-requests` on a loop
   * runner authenticates with `JOB_RUNNER_SECRET` and uses `DELETION_JOB_INTERVAL_SECONDS` for cadence
   * updated `.env.example` and `README.md` with the new scheduling + billing mapping env vars
16. Entitlement matrix expansion:
   * expanded `app/services/entitlements.server.ts` to a plan matrix for `Free`, `Growth`, and `Scale`
   * free keeps widget setup basics; growth unlocks merchant operations; scale adds automation + priority support flags
   * expanded route gate coverage in `app/services/billing.server.ts` for:
     - `/app/subscriptions`
     - `/app/subscription-rule`
     - `/app/offers`
     - `/app/analytics`
     - `/app/additional`
   * updated `app/routes/app.billing.tsx` to show the full feature matrix instead of only two booleans
17. Validation and production deploy for billing + scheduler round:
    * `npm test` passed (9 tests)
    * `npm run build` passed
    * `docker compose config` passed after adding the new runner service
    * initial inline shell loop for `deletion_job_runner` failed to parse in production, so it was replaced with `/home/krizpham/thanhpt-stack/deletion-job-runner.sh`
    * added `JOB_RUNNER_SECRET` and `DELETION_JOB_INTERVAL_SECONDS` to production `.env`
    * redeployed `shopify_app` and `deletion_job_runner`
    * verified production logs:
       - `HEAD /auth/login` -> `200`
       - `POST /jobs/deletion-requests` -> `200`
       - runner log shows `processed: 0` when queue is empty
