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
18. Entitlement status hardening:
   * updated `app/services/entitlements.server.ts` so non-free plans only unlock paid features when billing status is `active` or `trialing`
   * inactive paid statuses such as `frozen` and `canceled` now fall back to the Free feature surface instead of retaining paid access
   * updated `app/routes/app.billing.tsx` to show a billing-resolution message when the latest paid plan is not currently active
   * added test coverage in `app/services/partner-billing.test.ts` for Partner Dashboard plan mapping and inactive-plan entitlement locking
19. Validation for entitlement status hardening:
   * `npm test` passed (13 tests)
   * `npm run build` passed
   * `docker compose config` passed
   * live `deletion_job_runner` continued returning `200` with empty queue after the app-side changes
20. Billing reconciliation and action-level write gating:
   * added `app/services/merchant-billing.server.ts` to reconcile `currentAppInstallation.activeSubscriptions` into the internal merchant billing snapshot on demand
   * added `app/routes/app.welcome.tsx` as a managed-pricing return/reconciliation destination that refreshes billing state before merchants continue into the app
   * extended `app/services/billing.server.ts` with action-level write checks so writes can be blocked even when a user reaches a page but billing is inactive
   * wired action-level guards into write actions for offers, subscription rules, widget products, and settings
   * updated `app/routes/app.billing.tsx` to surface a `writeBlocked` reason when a merchant is redirected there from a blocked write action
   * updated production `.env` with exact current plan names (`Free`, `Growth`, `Scale`) while leaving GID mappings blank until valid live identifiers are available from real billing data or Partner Dashboard export
21. Validation for reconciliation + write-gate round:
   * `npm test` passed (13 tests)
   * `npm run build` passed
   * pre-existing CSS warning remains unchanged during build
   * exact Partner Dashboard subscription GIDs are still unavailable from runtime data because the current production DB has no `MerchantPlan` snapshots and the stored offline Shopify token returned an invalid-token Admin API response
22. Standalone internal admin portal:
   * added a separate cookie-based internal admin auth flow in `app/services/internal-admin-portal.server.ts`
   * added standalone portal routes:
     - `app/routes/admin.login.tsx`
     - `app/routes/admin.tsx`
     - `app/routes/admin.merchants.tsx`
     - `app/routes/admin.merchants.$merchantId.tsx`
     - `app/routes/admin.logout.tsx`
   * portal now runs independently from Shopify embedded auth and is intended for `admin-app.thanhpt.online`
   * added root redirect so requests hitting `admin-app.thanhpt.online/` go directly to `/admin/login`
   * added Caddy host mapping for `admin-app.thanhpt.online`
   * added env vars:
     - `INTERNAL_ADMIN_SESSION_SECRET`
     - `INTERNAL_ADMIN_PORTAL_ACCOUNTS`
   * provisioned a temporary internal admin account in production env so the portal can be used immediately after DNS is added
23. Validation for standalone admin portal round:
   * `npm test` passed (13 tests)
   * `npm run build` passed
   * pre-existing CSS warning remains unchanged during build
24. Merchant management and merchant package operations in the standalone portal:
   * added `app/services/admin-plan-catalog.shared.ts` with a Seal-inspired `Free` / `Growth` / `Scale` package catalog for internal ops
   * added `listMerchantSubscriptionOverview()` in `app/models/merchant.server.ts` so the internal portal can see each merchant's latest plan, entitlement state, and blocked-paid risk in one query
   * added internal portal management helpers in `app/models/merchant.server.ts`:
     - `updateMerchantStatusById()`
     - `createAdminMerchantPlanSnapshot()`
     - `createMerchantInternalNote()`
   * expanded `app/routes/admin.merchants.tsx` with merchant search, status filter, package filter, and blocked-paid visibility
   * added `app/routes/admin.subscriptions.tsx` as the internal package-management screen showing the plan catalog plus current merchant package assignments
   * expanded `app/routes/admin.merchants.$merchantId.tsx` with operational controls to:
     - update merchant status
     - assign a merchant package snapshot
     - add internal notes
     - inspect enabled entitlement features alongside plan history and lifecycle events
   * updated `app/routes/admin.tsx` navigation to expose the new `Packages` area inside the standalone portal
25. Validation for merchant management and package-ops round:
   * `npm test` passed (13 tests)
   * `npm run build` passed
   * pre-existing CSS warning remains unchanged during build
26. True package management for internal admin portal:
   * added Prisma model `AdminPlanDefinition` plus migration `20260330183000_admin_plan_definitions` so package definitions are now stored in the database
   * seeded default `free`, `growth`, and `scale` package definitions from the existing commercial model
   * added `app/services/admin-plan-catalog.server.ts` to load, ensure, and update package definitions from Prisma instead of relying only on hardcoded catalog data
   * updated `app/routes/admin.subscriptions.tsx` so the `Packages` screen now supports editing:
     - display name
     - monthly and yearly pricing
     - tagline
     - best-for description
     - merchant-facing highlights
     - ops highlights
     - active/public flags
     - sort order
   * updated `app/models/merchant.server.ts` and `app/routes/admin.merchants.$merchantId.tsx` so merchant package assignment now uses the persisted package definitions when internal admins assign packages to merchants
27. Validation for true package management round:
   * `npx prisma generate` passed
   * `npm test` passed (13 tests)
   * `npm run build` passed
   * pre-existing CSS warning remains unchanged during build
28. Merchant list detail popup and timeline view:
   * replaced the brittle `View detail` navigation in `app/routes/admin.merchants.tsx` with an inline popup opened directly from the merchant list
   * added `listMerchantAdminSummaries()` in `app/models/merchant.server.ts` so each merchant row can bring install lifecycle, package history, and event timeline into the popup
   * popup now shows:
     - install / uninstall lifecycle
     - package registration and change history inferred from `MerchantPlan` snapshots
     - lifecycle event feed from `MerchantEvent`
   * this keeps internal operators on the main merchant list while still exposing the key operational history quickly
29. Validation for merchant popup round:
   * `npm test` passed (13 tests)
   * `npm run build` passed
   * pre-existing CSS warning remains unchanged during build
30. Internal admin accounts moved into the database:
   * added Prisma model `InternalAdminAccount` and migration `20260330193000_internal_admin_accounts`
   * added `app/services/internal-admin-accounts.server.ts` for bootstrap, hashing, login verification, listing, create, update, and delete
   * updated `app/services/internal-admin-portal.server.ts` so portal login/session now validates against DB-backed admin accounts instead of reading credentials directly from env on every login
   * added `app/routes/admin.admins.tsx` and linked it from `app/routes/admin.tsx` so the standalone portal now supports admin list + add/edit/delete flows
31. Merchant-facing default navigation and billing plan selection improvements:
   * changed embedded app home flow so `/app` now redirects to Analytics via `app/routes/app._index.tsx`
   * updated `app/routes/app.tsx` so the primary home nav entry now opens Analytics first
   * expanded `app/routes/app.billing.tsx` to show the merchant's current plan plus visible package cards from the DB-backed package catalog
   * added `app/services/managed-pricing.server.ts` with `SHOPIFY_MANAGED_PRICING_APP_HANDLE` support so Billing can link merchants to Shopify's hosted pricing-plan page for plan changes/upgrades
32. Prisma client generation hardening for this workspace:
   * moved Prisma client generation output to `generated/prisma` because the old `node_modules/.prisma` target was root-owned and blocked `prisma generate`
   * updated local Prisma imports to use the generated repo path and server-side `createRequire` runtime loading in `app/db.server.ts`
33. Validation for admin-account + billing-entry round:
   * `npx prisma generate` passed after moving client output to `generated/prisma`
   * `npm test` passed (13 tests)
   * `npm run build` passed
   * pre-existing build warnings remain unchanged:
     - `NODE_ENV=production` in `.env`
     - CSS minify warning around `@media (--p-breakpoints-md-up) and print`
34. Production rollout for DB-backed admin accounts and merchant entry/billing updates:
   * updated production `.env` to set `SHOPIFY_MANAGED_PRICING_APP_HANDLE=subscription-bulk-app`
   * cleared `INTERNAL_ADMIN_PORTAL_ACCOUNTS` in production env after seeding the first admin into DB
   * removed the exposed admin password from `/home/krizpham/shopify-bulk-app/report.md`
35. Merchant console action hardening:
    * `app/routes/admin.merchants.tsx` now gives the visible merchant actions real behavior instead of dead UI:
       - `Export XML` posts to a server action and returns an XML export attachment
       - `New Merchant` opens a live intake form that creates a merchant record in Prisma and redirects into the detail workspace
       - `Control` is now an explicit working link/button per row to the merchant detail route
    * `app/models/merchant.server.ts` now includes `createManualMerchant()` for operator-created merchant records and emits a `merchant.created.manual` event
    * `app/routes/admin.merchants.$merchantId.tsx` was hardened so header actions are real:
       - `Audit Log` jumps to the event section
       - `Save Snapshot` submits the package snapshot form
    * merchant detail workspace now fills additional real merchant profile data: store name, email, country, currency, timezone, install time, and last-seen signal
   * redeployed `shopify_app` and `deletion_job_runner` from `/home/krizpham/thanhpt-stack`
   * fixed runtime Prisma client resolution in `app/db.server.ts` so the built server bundle can load `generated/prisma` correctly inside the container
35. Production verification after redeploy:
   * root app entry now returns `302 Location: /app/analytics?...` for Shopify shop-entry traffic
   * standalone portal login works against the DB-backed admin account and `/admin/admins` renders successfully
   * live container env confirms `SHOPIFY_MANAGED_PRICING_APP_HANDLE=subscription-bulk-app` and no plain-text bootstrap admin credentials remain in env
36. Internal admin portal visual redesign:
   * redesigned `app/routes/admin.tsx` into a darker operations-console shell with active navigation, stronger typography, and system-status cards
   * redesigned `app/routes/admin.login.tsx` into a split modern login screen with a technology-oriented visual style
   * restyled `app/routes/admin.merchants.tsx`, `app/routes/admin.subscriptions.tsx`, `app/routes/admin.admins.tsx`, and `app/routes/admin.merchants.$merchantId.tsx` into the same dark glassmorphism UI language
37. Merchant navigation and production deploy stabilization:
   * the merchant list no longer uses the earlier inline popup flow as the active UX; `app/routes/admin.merchants.tsx` now uses proper route navigation again via `/admin/merchants/:merchantId`
   * merchant row actions were normalized so the row CTA now reads `Detail` instead of `Control`
   * merchant domain text in the table is now a working link to the merchant detail screen
   * `app/routes/admin.merchants.tsx` now renders nested merchant detail routes through `Outlet` when `merchantId` is present
   * production initially looked stale because source edits had not been reflected in the live Docker image; the correct deploy path remains rebuilding `shopify_app` from `/home/krizpham/thanhpt-stack`
38. Merchant detail route crash fix:
   * after the deploy, client-side navigation from `/admin/merchants` into merchant detail hit a production React minified error #300
   * root cause was hook order instability in `app/routes/admin.merchants.tsx` caused by returning `<Outlet />` before all hooks had executed
   * fixed by computing `filteredMerchants` before the conditional nested-route return so hook order is stable between list and detail transitions
   * rebuilt and redeployed production successfully after this fix
39. Package management UX refinement:
   * `app/routes/admin.subscriptions.tsx` now uses transient toast notifications instead of a persistent status banner
   * save buttons were restyled to look like explicit actions and now show a `Saving...` state while the form is submitting
   * package presentation was normalized to the three canonical business packages visible to operators: `Free`, `Premium`, and `Ultra`
   * internal storage keys still map to `free`, `growth`, and `scale`, with UI naming resolved through `getCanonicalPlanName()`
   * short package description/tagline editing was changed from single-line input to multiline textarea so longer copy is fully visible and editable
   * these package-screen changes were built and redeployed to production successfully
40. Toast-only admin action feedback and latest production status:
   * `app/routes/admin.admins.tsx` now uses toast-only feedback for create, update, and delete admin actions instead of a fixed banner
   * successful admin actions now reset the exact submitted form after completion
   * `app/routes/admin.merchants.$merchantId.tsx` now uses toast-only feedback for adding internal notes and resets the note form on success
   * latest local validation passed with `npm run build`
   * latest production redeploy was completed successfully from `/home/krizpham/thanhpt-stack` and `shopify_app` is up with the new admin/admin-note toast-reset behavior live
   * current known build warnings remain unchanged and non-blocking:
     - `.env` contains `NODE_ENV=production`
     - CSS minify warning around `@media (--p-breakpoints-md-up) and print`
   * deployed the refreshed admin portal UI to production and confirmed the app container restarted cleanly
37. Stitch-based Merchant Packages redesign:
    * downloaded the exported Stitch HTML and screenshot for the `Merchant Packages` screen into `stitch-export/merchant-packages/`
    * refactored `app/routes/admin.tsx` so the standalone admin shell now follows the Stitch layout more closely with:
       - compact left rail navigation
       - fixed top operations bar
       - Inter / Manrope / Space Grotesk typography
       - Material Symbols icon treatment
    * refactored `app/routes/admin.subscriptions.tsx` so the `Packages` screen now mirrors the Stitch composition more closely with:
       - three KPI tiles for Free / Growth / Scale merchant counts
       - three package cards styled like the Stitch design while preserving live save actions
       - an `Assigned Merchants` data table styled to match the exported screen language
    * validation results for the Stitch redesign round:
       - `npm run build` passed
       - no TypeScript errors were reported in the edited files
       - pre-existing build warnings remain unchanged:
          - `NODE_ENV=production` in `.env`
          - CSS minify warning around `@media (--p-breakpoints-md-up) and print`
41. Production-ready hardening round:
   * billing reconciliation was hardened so plan resolution now considers normalized GID candidates plus line-item plan names, and subscription reconciliation no longer depends on Shopify array order
   * extracted pure billing access logic into `app/services/billing-access.shared.ts` and added focused regression coverage for billing path/write gates
   * customer portal routes now share `app/services/customer-portal-access.shared.ts` so server-side actions verify the submitted `contractId` actually belongs to the current customer before pause/resume/cancel mutations run
   * removed unsupported `NODE_ENV=production` from `.env` and switched embedded/admin Polaris CSS to `/public/polaris-styles.css`, a patched static copy that avoids the vendor custom-media build warning
   * latest validation passed with:
      - `npm test -- app/services/customer-portal-access.shared.test.ts app/services/billing.test.ts app/services/partner-billing.test.ts`
      - `npm run build` with the previous `.env` and Polaris CSS warnings removed
   * latest production redeploy from `/home/krizpham/thanhpt-stack` completed successfully and minimal smoke checks confirmed:
      - `https://app.thanhpt.online/auth/login` -> `200`
      - `https://admin-app.thanhpt.online/admin/login` -> `200`
      - direct `curl` to `/apps/subbulk/portal` can still return `400` without Shopify app-proxy context, which is expected
42. Live billing mapping audit on production:
   * runtime bug found in `app/db.server.ts`: source runtime and bundled SSR runtime expect different relative paths to the generated Prisma client; fixed with a dual-path loader that tries `../generated/prisma/client` and then `../../generated/prisma/client`
   * production DB currently contains only one `MerchantPlan` row and it is an internal admin assignment (`planKey=free`, `planName=Free`, raw payload source `internal.portal`), not a live Shopify billing snapshot
   * no production `MerchantPlan` row currently has `shopifySubscriptionGid`, and no `billing.%unmapped%` merchant events exist yet
   * added reusable audit command `npm run audit:billing-live` backed by `scripts/billing-live-audit.ts`
   * validated audit command against the live DB and Shopify session state; result showed the offline session is healthy, but `currentAppInstallation.activeSubscriptions` is currently empty
   * result: exact production `PARTNER_PLAN_*_GIDS` still cannot be finalized from live data until a real managed-pricing subscription exists to inspect
   * latest validation after the Prisma loader fix: `npm run build` passed cleanly
   * one intermediate deploy briefly returned `502` because the single-path fix worked in source runtime but broke the bundled server; the follow-up dual-path fix was redeployed and production recovered (`/auth/login` -> `200`)
