# Shopify Submission Checklist

Use this checklist to prepare `subscription-bulk-app` for Shopify public distribution and App Store review.

This checklist now includes two layers:

- baseline requirements to submit and pass public App Store review
- category-specific requirements that matter because this app provides both subscription and discount functionality, and are also relevant for any future Built for Shopify push

## 0. Current Go / No-Go

Current status: `NO-GO`

Hard blockers before submission:

- `Distribution -> Manage listing -> Pricing content` is not ready yet.
- Shopify-hosted managed pricing page still returns `404` because listing / pricing setup is not complete.
- Protected customer data approval work is still pending because the app requests `read_customers` and `read_orders`.
- Submission package assets are incomplete: listing copy, screenshots, demo instructions, support docs, privacy policy URL, and review instructions.

Do not submit until all items in sections 1 through 7 are complete.

## 1. Partner Dashboard Setup

Goal: unlock `Manage listing` and complete the public app distribution flow.

- [ ] Confirm the app distribution type is `Shopify App Store`.
- [ ] Open `Partners -> Apps -> subscription-bulk-app -> Distribution`.
- [ ] Complete all required steps in `Manage submission` until `Manage listing` becomes available.
- [ ] Confirm the app name used in listing matches the app identity and branding direction.
- [ ] Record the final public app handle used by Shopify Admin for billing and listing.

Evidence to keep:

- screenshot of `Distribution` page showing listing is available
- screenshot of app handle / listing state

## 2. Listing Content

Goal: make the app reviewable and merchant-facing.

- [ ] Write an English app subtitle with a clear merchant benefit.
- [ ] Write an English app introduction.
- [ ] Write app details focused on merchant outcomes, not internal implementation.
- [ ] Add 4 to 6 feature bullets.
- [ ] Add app categories / tags that match the actual product.
- [ ] Add developer website URL.
- [ ] Add privacy policy URL.
- [ ] Add support URL or support portal URL.
- [ ] Add any FAQ / documentation link that helps reviewers and merchants.
- [ ] Add install eligibility notes if the app is only suitable for stores using Online Store / subscription products.

Assets required:

- [ ] App icon
- [ ] Feature image or short promo video
- [ ] 3 to 6 screenshots of the real product
- [ ] Demo store URL

Evidence to keep:

- screenshot of completed `Manage listing`
- copy doc used for listing fields

## 3. Pricing and Billing

Goal: make Shopify billing reviewable and functional.

- [ ] In `Manage listing -> Published languages -> English -> Pricing content`, enable `Managed pricing`.
- [ ] Add at least one public pricing plan.
- [ ] Add plan descriptions for English.
- [ ] If using free + paid tiers, ensure pricing content matches in-app plan names closely enough to avoid reviewer confusion.
- [ ] Set the welcome link for each plan to the billing return flow in the app.
- [ ] Verify the app can open the Shopify-hosted pricing page without `404`.
- [ ] Verify merchants can move between plans without reinstalling the app.
- [ ] Verify the billing return flow updates the internal merchant snapshot correctly.
- [ ] Capture a real or test subscription and map identifiers for production billing reconciliation.

Submission gate:

- [ ] `Open Shopify pricing page` works
- [ ] `Change to this plan` works
- [ ] No `404` on any billing path

Evidence to keep:

- video of plan upgrade / downgrade flow
- screenshot of pricing content
- screenshot of successful hosted pricing page

## 4. Protected Customer Data

Goal: align scopes, data handling, and Partner Dashboard approvals.

Because the app requests `read_customers` and `read_orders`, treat this as protected customer data work.

- [ ] Open `Partners -> Apps -> subscription-bulk-app -> API access requests`.
- [ ] Request protected customer data access.
- [ ] Request only the minimum fields actually required.
- [ ] Complete `Data protection details` truthfully.
- [ ] Confirm privacy policy describes what customer/order data is processed and why.
- [ ] Confirm retention behavior is documented.
- [ ] Confirm production and test data are kept separate.
- [ ] Confirm staff access to customer data is limited.
- [ ] Confirm incident response / data protection basics are documented internally.

Decision point:

- [ ] Re-check whether `read_customers` is truly needed for MVP submission.
- [ ] Re-check whether `read_orders` is truly needed for MVP submission.
- [ ] If either scope is not essential, remove it before submission to reduce review friction.

## 5. In-App Product Readiness

Goal: ensure the reviewer can install, configure, and use the app without getting stuck.

- [ ] Fresh install redirects correctly through OAuth.
- [ ] Reinstall works after uninstall.
- [ ] Embedded app loads without auth loops.
- [ ] Main navigation is usable.
- [ ] Billing page loads without broken actions.
- [ ] Subscription rule flow works on a clean store.
- [ ] Storefront widget can be enabled through the theme app extension flow.
- [ ] App proxy storefront flow works.
- [ ] Customer portal can view subscriptions and self-service actions.
- [ ] Privacy / deletion page works.
- [ ] Uninstall webhook works cleanly.
- [ ] Compliance webhooks are registered and handled.

Reviewer-facing rule:

- [ ] No visible `404`
- [ ] No visible `500`
- [ ] No dead-end flows
- [ ] Error states are understandable

## 6. Subscription App Review Readiness

Goal: satisfy the category-specific expectations for subscription apps.

Baseline category checks:

- [ ] Verify subscription creation and management uses Shopify subscription primitives rather than a custom recurring billing model.
- [ ] Verify the app uses the Selling Plan API for selling plan creation and management.
- [ ] Verify the app uses the Subscription Contract API to manage live subscription agreements.
- [ ] Verify the app uses the Customer Payment Method API where future recurring payments depend on stored payment methods.

- [ ] Theme app extension works on supported themes.
- [ ] Subscription option is rendered on product pages through a theme app block that is compatible with Online Store 2.0.
- [ ] Subscription purchase flow is understandable on product pages.
- [ ] Pricing disclosure is clear on product, cart, and order detail pages.
- [ ] Selling plan name, price, and savings are clearly displayed anywhere subscription information appears.
- [ ] Subscription UI matches the merchant theme by default for color palette, font, font size, and font weight.
- [ ] Customer portal is accessible from the expected customer path.
- [ ] Customer subscription management is exposed through Customer Account UI extensions, not only through a custom external portal.
- [ ] Pause / resume / cancel flows are tested end to end.
- [ ] Subscription details show enough information for customers to self-serve.
- [ ] Admin-side configuration syncs correctly with storefront behavior.

Evidence to keep:

- screen recording of storefront purchase flow
- screen recording of customer portal management flow
- screen recording of admin configuration flow

## 7. Discount App Review Readiness

Goal: satisfy the category-specific expectations for discount apps.

- [ ] Verify all merchant-facing discount logic uses Shopify discount primitives.
- [ ] Verify custom discount behavior is implemented with Shopify Discount Functions and/or native discount APIs.
- [ ] Verify the app does not create draft orders to simulate custom discounts.
- [ ] If the app creates multiple redeem codes for one discount, verify it uses `discountRedeemCodeBulkAdd` instead of creating many duplicate discounts.
- [ ] Verify the Shopify Discounts page links into an embedded app page where the merchant can create the corresponding discount.
- [ ] Verify any discount create / details link resolves to a high-quality embedded workflow, not a dead end or generic homepage.
- [ ] Verify discount configuration UI follows App Design Guidelines and clearly explains what discount will be created.
- [ ] Verify discount behavior is testable from merchant setup to cart / checkout outcome.

Evidence to keep:

- screen recording of merchant creating a discount from Shopify admin
- screenshot of the create-discount entry point and resulting embedded screen
- test case showing discount function output matches merchant configuration

## 8. Support, Policy, and Review Package

Goal: make the reviewer self-sufficient.

- [ ] Prepare a support contact email.
- [ ] Prepare a support page or FAQ.
- [ ] Prepare a privacy policy page.
- [ ] Prepare a short reviewer guide in English.
- [ ] Prepare test store URL.
- [ ] Prepare test account / reviewer credentials if needed.
- [ ] Prepare a 2 to 5 minute screencast showing install, setup, billing, storefront widget, and customer portal.
- [ ] Write review instructions with exact click path and expected outcomes.

Reviewer guide should include:

- app purpose
- install steps
- required theme / storefront setup
- how to test billing
- how to test customer portal
- any known non-obvious prerequisites

## 9. Final Dry Run Before Submission

Run this as a final gate on a clean development store.

- [ ] Install app from scratch
- [ ] Complete onboarding
- [ ] Enable storefront surface
- [ ] Create or view subscription configuration
- [ ] Create or view discount configuration from the embedded app flow
- [ ] Open billing page
- [ ] Upgrade or switch plan successfully
- [ ] Return through billing welcome flow successfully
- [ ] Verify entitlements update correctly
- [ ] Verify storefront subscription pricing presentation is correct on product, cart, and order detail surfaces
- [ ] Verify discount logic applies through supported Shopify primitives, not draft-order hacks
- [ ] Verify customer portal actions work
- [ ] Verify no critical console or backend errors during the run

Submission gate:

- [ ] One uninterrupted screen recording from install to successful core workflow
- [ ] No manual intervention from developer shell is needed during reviewer flow

## 10. Recommended Order Of Execution

Use this order to avoid rework:

1. Finish `Manage submission` until `Manage listing` is available.
2. Finish listing content and policy links.
3. Enable managed pricing and remove the `404` billing blocker.
4. Complete protected customer data requests and scope review.
5. Validate subscription-specific and discount-specific requirements against the actual implementation.
6. Prepare screenshots, demo store, and screencast.
7. Run full dry run on a clean dev store.
8. Submit only after billing and reviewer instructions are complete.

## 11. Built For Shopify Delta

These items are especially important if the long-term goal is `Built for Shopify`, even if public submission happens first.

- [ ] Track whether the app has enough paid installs, reviews, and rating to become BFS-eligible later.
- [ ] Measure Shopify admin Web Vitals: LCP, CLS, and INP.
- [ ] Measure storefront performance impact and keep the Lighthouse drop within Shopify limits.
- [ ] Confirm the app home page shows useful merchant status / reporting, not only navigation.
- [ ] Confirm primary workflows stay inside Shopify admin.
- [ ] Confirm premium features are clearly labeled and disabled both visually and functionally when not available.
- [ ] Confirm there are no manipulative upgrade messages, misleading claims, or distracting UX patterns.

## 12. My Current Assessment

Current probability of passing immediately if submitted now: `low`

Probability after sections 1 through 4 are complete and a clean dry run is captured: `reasonable`

Biggest remaining risks:

- Shopify hosted billing flow still not reviewable
- protected customer data approval / scope justification
- subscription and discount category-specific review gaps are not fully validated yet
- incomplete submission artifacts
- reviewer encountering a broken or unclear setup path

## 13. Codebase Audit Snapshot (2026-03-31)

Status legend:

- `pass`: confirmed by code in the repository
- `gap`: missing in code or contradicted by current known behavior
- `manual`: external Partner Dashboard work or end-to-end verification still required

### 1. Partner Dashboard Setup

- `pass` Confirm the app distribution type is `Shopify App Store`.
- `manual` Open `Partners -> Apps -> subscription-bulk-app -> Distribution`.
- `gap` Complete all required steps in `Manage submission` until `Manage listing` becomes available.
- `manual` Confirm the app name used in listing matches the app identity and branding direction.
- `manual` Record the final public app handle used by Shopify Admin for billing and listing.

### 2. Listing Content

- `gap` English listing copy is not present as a finalized submission package in the repo.
- `gap` Developer website, privacy policy URL, support URL, and FAQ / docs URLs are not prepared as submission assets.
- `gap` Feature image / promo video, screenshots, and demo store URL are not present as a submission-ready package.

### 3. Pricing and Billing

- `manual` Enable `Managed pricing` in Partner Dashboard and create pricing content.
- `manual` Add public pricing plans and English plan descriptions.
- `gap` In-app plan naming vs final Shopify pricing content is not yet validated.
- `manual` Set the welcome link for each plan in Partner Dashboard.
- `partial` Shopify-hosted pricing still returns `404` outside the app today, but the embedded billing page now suppresses that broken link until managed pricing is published.
- `gap` Merchants cannot currently switch plans successfully because the hosted pricing page is not ready.
- `pass` Billing return flow exists and reconciles billing state in the app.
- `gap` Real or test subscription capture for production mapping is still missing.

### 4. Protected Customer Data

- `gap` Protected customer data approval in Partner Dashboard is still pending.
- `gap` The app now also requests `read_customer_payment_methods` for subscription self-service visibility, so protected data review and scope justification remain unresolved.
- `pass` Compliance webhooks for `customers/data_request`, `customers/redact`, and `shop/redact` are configured.
- `pass` The embedded app has an in-app privacy / deletion flow.
- `partial` Retention behavior is explained in-app, but external privacy policy and data protection paperwork are still missing.
- `manual` Staff access controls, incident response, and formal data protection evidence still need non-code validation.

### 5. In-App Product Readiness

- `manual` Fresh install redirects correctly through OAuth.
- `manual` Reinstall works after uninstall.
- `manual` Embedded app loads without auth loops across clean-store scenarios.
- `pass` Main navigation exists in the embedded app through App Bridge `NavMenu`.
- `pass` Billing page renders and intentionally hides the external pricing action until managed pricing is ready.
- `manual` Subscription rule flow still needs a clean-store end-to-end test.
- `pass` Storefront widget is implemented as a theme app extension plus app-side configuration flow.
- `pass` App proxy storefront flow is configured in app config and used by storefront routes.
- `pass` Customer portal self-service code exists for view / pause / resume / cancel flows.
- `pass` Privacy / deletion page exists and queues deletion requests.
- `pass` Uninstall webhook is implemented.
- `pass` Compliance webhooks are registered and handled.
- `pass` Reviewer-facing `no visible 404` is materially improved in-app because the billing screen no longer routes to the broken hosted pricing page before publish-ready setup.
- `manual` `no visible 500` still needs full regression verification.
- `partial` Major dead-end flows were tightened: billing no longer sends merchants to a known `404`, and the Discounts deep link now opens the embedded bulk-pricing configuration screen.
- `pass` Several error states are explicit and understandable, especially in privacy and customer portal flows.

### 6. Subscription App Review Readiness

- `pass` Subscription creation and management uses Shopify subscription primitives instead of a custom recurring billing model.
- `pass` The app uses Selling Plan APIs and selling plan groups for subscription configuration.
- `pass` The app uses Subscription Contract mutations for pause / resume / cancel flows.
- `partial` Code now reads `SubscriptionContract.customerPaymentMethod` and surfaces payment-method state in admin/customer views, but live validation still depends on merchants accepting the new `read_customer_payment_methods` scope.
- `pass` A theme app extension exists for the storefront subscription surface.
- `pass` Subscription options are rendered through a theme app block compatible with Online Store 2.0 product templates.
- `manual` Product-page subscription purchase flow still needs end-to-end UX validation on a clean store.
- `partial` Product and cart pricing disclosure have code evidence, but order-detail disclosure is not yet evidenced in this audit.
- `partial` Selling plan name, price, and savings are surfaced in the storefront widget logic, but not yet fully validated across all required surfaces.
- `gap` Automatic theme-style matching is not yet strongly evidenced; current widget styling appears partly app-defined rather than clearly theme-derived by default.
- `pass` Customer portal entry points exist through storefront and customer-account surfaces.
- `pass` Customer Account UI extension exists and supports subscription management actions, not just display.
- `manual` Pause / resume / cancel flows still need final end-to-end verification on a live store.
- `pass` Subscription details shown to customers include status, quantity, next billing, and creation date.
- `manual` Admin-side configuration sync with storefront behavior still needs final QA evidence.

### 7. Discount App Review Readiness

- `pass` Merchant-facing discount logic is implemented with Shopify discount primitives.
- `pass` Custom discount behavior is implemented with a Shopify Product Discount Function.
- `pass` No code evidence was found that uses draft orders to simulate discounts.
- `gap` No code evidence was found for `discountRedeemCodeBulkAdd`; if multi-code redeem flows are added later, this remains an open requirement.
- `pass` Discount extension `create` / `details` paths now open the embedded widget-products configuration workflow instead of redirecting to analytics.
- `pass` The Discounts-page deep link quality requirement is materially met by routing merchants into the real bulk-pricing configuration surface.
- `manual` Discount configuration UX still needs a targeted review against App Design Guidelines.
- `partial` Discount behavior is testable in code and extension logic, but still needs submission-grade merchant flow evidence.

### 8. Support, Policy, and Review Package

- `gap` Support contact email is not prepared in the submission package.
- `gap` Public support page or FAQ is not prepared.
- `gap` Public privacy policy page is not prepared as a submission artifact.
- `gap` Reviewer guide, test credentials, screencast, and formal review instructions are not prepared.

### 9. Final Dry Run Before Submission

- `manual` Full clean-store dry run is still pending.
- `partial` Billing switch / upgrade path remains externally blocked by unpublished Shopify-managed pricing, but the in-app workflow now avoids exposing that broken route.
- `manual` Subscription and discount flows still need one uninterrupted reviewer-style recording.
- `gap` `No manual intervention from developer shell` cannot be claimed yet.

### 11. Built For Shopify Delta

- `gap` BFS install, review, and rating thresholds are not in evidence.
- `manual` Shopify admin Web Vitals and storefront Lighthouse impact are not yet measured for this audit.
- `pass` The app homepage has meaningful analytics / reporting content rather than only navigation.
- `partial` Primary workflows mostly stay inside Shopify admin, but some critical external setup still exists and billing currently exits to a broken hosted page.
- `pass` Premium features are visually labeled and disabled on the billing page.
- `manual` Full dark-pattern / misleading-copy audit still needs human review across all surfaces.