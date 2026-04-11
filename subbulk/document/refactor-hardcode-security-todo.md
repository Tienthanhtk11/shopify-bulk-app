# Refactor To-Do List: Hard-code Removal and Security Hardening

## Scope
This to-do list converts the approved remediation plan into implementation work for the current SubBulk codebase. It is ordered by dependency so the app can move toward fail-fast config, safer admin auth, reduced sensitive-data retention, and less environment coupling without breaking runtime behavior.

## Validation rule
- [ ] Run `npm run lint` after each completed implementation step or PR-sized batch.
- [ ] Do not merge copy, config, or security refactors unless lint passes again after the latest edit set.

## Current hotspots confirmed in code
- Config is still read directly from `process.env` in multiple runtime paths, including `app/shopify.server.ts`, `app/services/billing.server.ts`, `app/services/internal-admin-portal.server.ts`, `app/routes/app.tsx`, and `vite.config.ts`.
- Internal admin session still falls back to a default secret and hard-codes the admin host in `app/services/internal-admin-portal.server.ts`.
- Runtime bootstrap from `INTERNAL_ADMIN_PORTAL_ACCOUNTS` is still active in `app/services/internal-admin-accounts.server.ts`.
- Compliance webhook routes already summarize payloads, but current summaries still retain customer and shop identifiers in `app/services/compliance.server.ts`.
- Billing logs and merchant events still persist sensitive operational URLs and raw GraphQL results in `app/routes/app.billing.tsx` and `app/services/billing.server.ts`.
- Bulk discount activation still hard-codes a Shopify Function ID in `app/routes/app.settings.tsx`.
- Customer account extension still hard-codes the public app URL in `extensions/sub-bulk-customer-account/src/ProfileBlock.jsx`.
- Internal admin dashboard still shows placeholder KPI values in `app/routes/admin._index.tsx`.
- User-facing strings are still mixed between English and Vietnamese across app routes, model-thrown errors, and admin help text. Confirmed hotspots include `app/routes/app.settings.tsx`, `app/routes/app.offers.new.tsx`, `app/routes/app.subscription-rule.editor.tsx`, `app/routes/app.widget-products.tsx`, `app/routes/app.offers.$id.tsx`, `app/models/subscription-offer.server.ts`, and `app/models/widget-enabled-product.server.ts`.
- Some inline comments and developer-facing notes are still written in Vietnamese, especially in `app/lib/*`, `app/routes/apps.subbulk.subscription-preview.ts`, and extension config/comments. These should be normalized where they affect maintainability for an English-only codebase.
- The codebase also contains wording inconsistencies and likely typo cleanup work that should be handled while normalizing copy, not as a separate later pass.

## Phase 0: Baseline and sequencing
- [ ] Freeze the target env contract before refactor: `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_APP_URL`, `DATABASE_URL`, `INTERNAL_ADMIN_SESSION_SECRET`, `JOB_RUNNER_SECRET`, `INTERNAL_ADMIN_HOSTS`, `SHOPIFY_BULK_DISCOUNT_FUNCTION_ID`.
- [ ] Confirm whether `SHOPIFY_ADMIN_APP_HANDLE` remains supported as optional config or is removed entirely in favor of a safe in-app fallback.
- [ ] Confirm whether historical `MerchantEvent.payloadJson` must remain readable for non-compliance events so the scrub migration only touches compliance types.

## Phase 1: Central config and fail-fast boot

### 1.1 Create a single config module
- [ ] Add `app/config.server.ts` as the only server-side runtime config entrypoint.
- [ ] Implement validation helpers for required strings, URL parsing, CSV parsing, placeholder rejection, and UUID/function ID parsing.
- [ ] Export a typed `serverConfig` object with normalized values.
- [ ] Reject production-like placeholder values such as `development-only-secret` and `bmg-bulk-subscription`.

### 1.2 Move server runtime off scattered env reads
- [ ] Refactor `app/shopify.server.ts` to read from `serverConfig` instead of `process.env`.
- [ ] Refactor `app/services/billing.server.ts` to read `SHOPIFY_APP_URL`, admin app handle policy, and new function/config values from `serverConfig`.
- [ ] Refactor `app/services/internal-admin-portal.server.ts` to use `serverConfig.internalAdminSessionSecret` and `serverConfig.internalAdminHosts`.
- [ ] Refactor `app/lib/app-proxy-signature.server.ts` to remove the `https://localhost` fallback if not explicitly intended.
- [ ] Refactor any remaining direct env reads found in app runtime paths.

### 1.3 Fail-fast boot coverage
- [ ] Ensure app startup fails clearly when required config is missing or invalid.
- [ ] Ensure routes/actions that depend on optional config return a deliberate config error instead of silently degrading.

### 1.4 Tests for config
- [ ] Add unit tests for missing required config.
- [ ] Add unit tests for placeholder rejection.
- [ ] Add unit tests for `INTERNAL_ADMIN_HOSTS` CSV parsing.
- [ ] Add unit tests for `SHOPIFY_BULK_DISCOUNT_FUNCTION_ID` parsing.

## Phase 2: Internal admin auth hardening

### 2.1 Session cookie hardening
- [ ] Update `app/services/internal-admin-portal.server.ts` to remove the fallback secret entirely.
- [ ] Change internal admin cookie `sameSite` from `lax` to `strict`.
- [ ] Keep current behavior where disabled accounts lose access on the next request.

### 2.2 Host detection via config
- [ ] Replace hard-coded `admin-app.thanhpt.online` in `isInternalAdminHost()` with `INTERNAL_ADMIN_HOSTS` from `serverConfig`.
- [ ] Update all dependent routes, especially `app/routes/_index/route.tsx`, to rely on config-based host detection.
- [ ] Remove hard-coded admin host copy from UI/docs where it implies a fixed deployment host.

### 2.3 Remove runtime bootstrap auth path
- [ ] Remove `ensureInternalAdminBootstrap()` from request-time auth flow in `app/services/internal-admin-accounts.server.ts`.
- [ ] Deprecate `INTERNAL_ADMIN_PORTAL_ACCOUNTS` from runtime authentication.
- [ ] Add a one-time CLI bootstrap script, for example `scripts/admin-bootstrap.ts`.
- [ ] Add an npm script such as `admin:bootstrap` to `package.json`.
- [ ] Support CLI inputs for email, display name, password, and `--force-reset-password`.
- [ ] Ensure bootstrap writes directly to `InternalAdminAccount` and exits with clear errors.

### 2.4 Tests for admin hardening
- [ ] Add unit tests for session config rejecting missing secret.
- [ ] Add unit tests for host resolution from `INTERNAL_ADMIN_HOSTS`.
- [ ] Add unit tests for disabled-account session invalidation.
- [ ] Add CLI tests or at least smoke coverage for the bootstrap script.

## Phase 3: Compliance audit sanitization and retention minimization

### 3.1 Introduce a shared sanitize/audit helper
- [ ] Replace the current summary helpers in `app/services/compliance.server.ts` with a shared sanitizer that produces summary-only audit payloads.
- [ ] New summary contract should allow only `topic`, `receivedAt`, `requestId` if present, `source`, and `status`.
- [ ] Do not persist customer id, email, access token, request body, or webhook payload fragments.

### 3.2 Route-level compliance updates
- [ ] Update `app/routes/webhooks.customers.data_request.tsx` to store sanitized summary only.
- [ ] Update `app/routes/webhooks.customers.redact.tsx` to store sanitized summary only.
- [ ] Update `app/routes/webhooks.shop.redact.tsx` to keep operational deletion behavior while only persisting sanitized audit summary.
- [ ] Review `app/routes/app.privacy.tsx` for any event logging still persisting identifiable request details.

### 3.3 Event logging hardening
- [ ] Add a dedicated helper in `app/models/merchant.server.ts` for sanitized compliance event writes rather than passing arbitrary payloads through `recordMerchantEvent()`.
- [ ] Decide whether `recordMerchantEvent()` remains generic or gains an allowlist mode for sensitive event types.
- [ ] Remove any event payloads that currently store `confirmationUrl`, `returnUrl`, raw GraphQL errors, or entire result objects unless strictly required.

### 3.4 Historical data scrub
- [ ] Add a Prisma migration or post-migration scrub script for historical `MerchantEvent` rows with types `compliance.customers_data_request` and `compliance.customers_redact`.
- [ ] Replace historical `payloadJson` for those rows with a marker such as `{ "redacted": true, "mode": "summary-only" }`.
- [ ] Confirm whether `compliance.shop_redact` historical rows are also scrubbed or only normalized.

### 3.5 Tests for compliance
- [ ] Add unit tests for the sanitize helper to verify customer id/email/token/body are removed.
- [ ] Add integration tests hitting compliance webhook actions and asserting summary-only persistence.
- [ ] Add regression coverage ensuring operational deletion still runs for `shop/redact`.

## Phase 4: Remove remaining environment hard-codes and runtime coupling

### 4.1 Customer account extension app URL generation
- [ ] Remove `const APP_URL = 'https://app.thanhpt.online'` from `extensions/sub-bulk-customer-account/src/ProfileBlock.jsx`.
- [ ] Add a pre-build/pre-dev generator that emits extension config from `SHOPIFY_APP_URL` into a generated file.
- [ ] Ensure generated files are ignored if they are environment-specific and should not be committed.
- [ ] Make extension build fail clearly when `SHOPIFY_APP_URL` is missing.
- [ ] Verify built output no longer contains the old hard-coded domain.

### 4.2 Bulk discount function ID config
- [ ] Replace the hard-coded function ID in `app/routes/app.settings.tsx` with `serverConfig.shopifyBulkDiscountFunctionId`.
- [ ] Update any helper scripts such as `create_discount_2.js` that still hard-code a function ID.
- [ ] Return a deliberate config error when the function ID is absent.

### 4.3 Billing return URL/admin handle cleanup
- [ ] Remove the default app handle fallback `bmg-bulk-subscription` from `app/services/billing.server.ts`.
- [ ] If `SHOPIFY_ADMIN_APP_HANDLE` is missing, fall back to a safe internal return path rather than constructing a possibly wrong admin URL.
- [ ] Stop logging `confirmationUrl` in `app/routes/app.billing.tsx`.
- [ ] Stop storing `confirmationUrl`, `returnUrl`, and raw GraphQL payloads in merchant events unless there is a strong operational need and sanitization policy.

### 4.4 Internal admin dashboard cleanup
- [ ] Replace placeholder KPI cards in `app/routes/admin._index.tsx`.
- [ ] Remove fake values like `0.02%`, `14ms`, and fabricated growth percentages.
- [ ] Keep only DB-derived metrics that can be computed reliably from merchant/plan/event data.
- [ ] If no reliable metric exists yet, show neutral empty-state copy instead of synthetic numbers.

### 4.5 English-only copy normalization and typo cleanup
- [ ] Replace all Vietnamese user-facing messages with English in actions, loaders, banners, forms, and toast responses.
- [ ] Prioritize routes already confirmed to contain Vietnamese strings: `app/routes/app.settings.tsx`, `app/routes/app.offers.new.tsx`, `app/routes/app.subscription-rule.editor.tsx`, `app/routes/app.widget-products.tsx`, and `app/routes/app.offers.$id.tsx`.
- [ ] Replace Vietnamese server error messages thrown from model and helper layers with English, including `app/models/subscription-offer.server.ts`, `app/models/subscription-rule.server.ts`, and `app/models/widget-enabled-product.server.ts`.
- [ ] Normalize English wording for consistency across similar flows, for example `discount`, `settings`, `subscription`, `widget`, `product selection`, and `invalid JSON` errors.
- [ ] Fix spelling, capitalization, and punctuation issues while translating copy. Do not preserve typo-for-typo behavior.
- [ ] Review whether any Vietnamese copy is intentionally merchant-facing for a specific market. If not explicitly required, standardize on English only.
- [ ] Review mixed-language labels and explanatory text inside `app.widget-products` and related onboarding/setup surfaces so the UI does not switch languages mid-flow.
- [ ] Review extension-facing and storefront-facing strings for language consistency if they are shipped to merchants or customers.

## Phase 5: Docs, env templates, and operational cleanup
- [ ] Update `.env.example` to include the new env contract and remove personal domains/secrets.
- [ ] Update `README.md` to describe config requirements, bootstrap flow, and admin host configuration without personal deployment defaults.
- [ ] Update `Dockerfile` examples to use neutral placeholders only.
- [ ] Update `Caddyfile` examples to use environment-neutral placeholders only.
- [ ] Review docs under `document/` for hard-coded deployment domains such as `admin-app.thanhpt.online` and `app.thanhpt.online`.
- [ ] Review demo docs, especially compliance demo scripts, so they do not instruct operators to inspect raw sensitive payloads.
- [ ] Normalize repository docs and operational notes to English where they are part of the maintained engineering workflow, unless a document is intentionally kept bilingual.
- [ ] Fix spelling mistakes in docs while updating terminology so copy cleanup does not stop at runtime strings only.

## Phase 6: Test/runtime hygiene
- [ ] Fix the current ESLint test-rule blocker: `eslint-plugin-jest` cannot detect a Jest version while linting Vitest-based files such as `app/lib/pricing.test.ts`.
- [ ] Either configure the Jest plugin with an explicit compatible version, scope Jest-only rules away from Vitest files, or replace the test lint setup with a Vitest-aware configuration.
- [ ] Add or align Prisma `binaryTargets` for local macOS and Linux runtime if test execution still fails across environments.
- [ ] Verify `prisma` and `@prisma/client` stay version-locked after changes.
- [ ] Add a test path that proves `npm test` exits cleanly after the refactor.
- [ ] Add an extension/build smoke test to verify generated config is present before extension compilation.

## Suggested implementation order
1. Central config module and fail-fast validation.
2. Internal admin session/host hardening.
3. Remove runtime bootstrap and add CLI bootstrap.
4. Compliance sanitizer and event logging contract changes.
5. Historical scrub migration.
6. Extension URL generation and bulk discount function config.
7. Billing log/payload cleanup and admin handle fallback removal.
8. Dashboard KPI cleanup.
9. English-only runtime copy and typo cleanup.
10. Docs/env template cleanup.
11. Final test stabilization and regression pass.

## Definition of done
- [ ] App boot fails immediately when required secrets/config are missing.
- [ ] Internal admin no longer authenticates from env-provided runtime bootstrap accounts.
- [ ] Internal admin host detection is fully config-driven.
- [ ] Compliance webhooks no longer persist raw or identifying payload data.
- [ ] Billing and admin flows no longer log or persist unnecessary sensitive URLs/payloads.
- [ ] Customer account extension no longer embeds a fixed production domain.
- [ ] Bulk discount activation no longer depends on a hard-coded function UUID.
- [ ] Internal admin dashboard displays only real metrics or explicit empty states.
- [ ] User-facing runtime copy is English-only unless a specific localized surface is explicitly retained.
- [ ] Spelling and terminology are consistent across admin, billing, widget, and subscription flows.
- [ ] Docs and examples no longer contain personal production domains or secrets.