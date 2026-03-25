# GPT-5.4 Build Prompt V2: Internal Shopify Subscription + Bulk Pricing App

Copy everything below into GPT-5.4.

---

You are a senior Shopify app engineer, full-stack product architect, and production-minded implementation partner.

Your task is to build a real internal Shopify app for one store.

The app is called `SubBulk`.

This is not a generic subscription app and not a simple pricing widget.
It is a combined:

1. subscription app
2. bulk pricing app
3. storefront purchase widget
4. merchant admin
5. customer subscription portal

The app must be built as production-ready phase 1 software for one internal store, using Shopify-native architecture where appropriate.

## 1. Mission

Build an internal Shopify app that delivers:

1. a product-page buy-box widget near the product price
2. one-time purchase vs subscribe-and-save purchase options
3. bulk pricing tiers loaded from Shopify product metafield JSON
4. multiple subscription plans with a single `Deliver every ...` dropdown
5. merchant settings for subscription offers and discounts
6. customer portal with pause/resume/cancel
7. pricing logic that previews correctly on product page and is enforced as correctly as possible in cart/checkout using Shopify-native capabilities

## 2. Product Priorities

Respect this priority order:

1. storefront widget near the price area
2. correct pricing logic
3. merchant admin
4. subscription backend
5. customer portal

## 3. Working Model

You should act like you have repo and terminal access.

You must:

1. inspect the workspace first
2. reuse existing app structure if present
3. implement code, not just plans
4. make file edits directly
5. run validation/tests when feasible
6. continue until the app is coherent and substantially implemented

## 4. Important Product Truths

This app is for one internal store.

That means:

1. optimize for the real use case over broad App Store generalization
2. still use sound Shopify architecture
3. theme integration can include store-specific assumptions if needed
4. merchant UX can be streamlined for the known business

## 5. Core Storefront Requirement

The storefront widget must be visually integrated with the buy box.

Specifically:

1. place it directly under or next to the product price and purchase controls
2. it should feel like part of the pricing/purchase module
3. do not build it as a detached section far below the form

Preferred behavior:

1. if feasible cleanly for the theme, also update the main large product price based on quantity and purchase option
2. if that is too theme-dependent, at minimum the widget itself must always display the active correct price and total

## 6. Exact Bulk Pricing Metafield Schema

Use this exact product metafield JSON shape:

```json
[
  {
    "qtyBreakpoint": 1,
    "priceAfterDiscount": 7.39,
    "bulkPrice": 9.29
  },
  {
    "qtyBreakpoint": 11,
    "priceAfterDiscount": 7.29,
    "bulkPrice": 9.09
  }
]
```

Interpretation:

1. `qtyBreakpoint`
   - starting quantity for the tier
   - example: `11` means `11+`

2. `priceAfterDiscount`
   - the true one-time unit price for the tier
   - this is the real pricing field used for calculations
   - it does not include subscription discount

3. `bulkPrice`
   - reference/original display price only
   - useful to show in UI if desired
   - not the field that drives the actual one-time final price

## 7. Exact Pricing Logic

You must implement this exact logic.

### One-time purchase

1. determine active tier by quantity from `qtyBreakpoint`
2. `oneTimeUnitPrice = activeTier.priceAfterDiscount`
3. `oneTimeTotal = oneTimeUnitPrice * quantity`

### Subscription purchase with percentage discount

1. determine active tier
2. `oneTimeUnitPrice = activeTier.priceAfterDiscount`
3. `subscriptionUnitPrice = oneTimeUnitPrice * (1 - percentDiscount)`
4. `subscriptionTotal = subscriptionUnitPrice * quantity`

### Subscription purchase with fixed amount discount

1. determine active tier
2. `oneTimeUnitPrice = activeTier.priceAfterDiscount`
3. `subtotal = oneTimeUnitPrice * quantity`
4. `subscriptionTotal = subtotal - fixedAmount`

Important:

1. fixed amount discount is applied to the invoice total, not per unit
2. because of that, frontend display for fixed-amount discount should emphasize final total
3. do not fabricate a misleading per-unit number if the platform surface makes that ambiguous

## 8. Pricing Display Rules

Implement UI and logic so that:

1. `priceAfterDiscount` is treated as the true active one-time price
2. subscription discount is always applied on top of `priceAfterDiscount`
3. `bulkPrice` can be displayed as a reference price, but not used as the source of truth for one-time final price

Example:

For tier:

```json
{ "qtyBreakpoint": 11, "priceAfterDiscount": 7.29, "bulkPrice": 9.09 }
```

If the subscription discount is 10% and quantity is 11:

1. one-time unit price = `7.29`
2. subscription unit price = `6.561`
3. final total = `6.561 * 11`, rounded appropriately

## 9. Subscription Scope

Implement a real subscription flow using Shopify-native subscription capabilities.

Must support:

1. one-time purchase
2. subscribe & save
3. multiple subscription plans per product
4. one default plan selected by merchant
5. dropdown UI:
   - `Deliver every ...`
6. discount types:
   - percentage
   - fixed amount

## 10. Variant Handling

In phase 1:

1. bulk pricing is product-level
2. all variants of a product share the same bulk pricing table
3. the storefront widget must still behave correctly when variant selectors are present

## 11. Customer Portal Scope

Build phase 1 portal with only these must-have actions:

1. pause subscription
2. resume subscription
3. cancel subscription

The portal detail must show:

1. product
2. status
3. frequency
4. next charge date

Later features like skip/change frequency/change quantity/address/payment/order history are not required in phase 1 unless the existing codebase makes one of them trivial.

## 12. Merchant Admin Scope

Build these phase 1 admin capabilities:

1. subscription offers management
2. selling plan / frequency settings
3. subscription discount settings
4. widget customization
5. stats for:
   - active subscriptions
   - paused subscriptions
   - cancelled subscriptions

Do not spend phase 1 time on:

1. payment calendar
2. email reminders
3. advanced cancellation rules
4. product swap
5. prepaid subscriptions
6. passwordless portal
7. shipping profile logic
8. public API/webhooks
9. multilingual widget text

## 13. Cart / Checkout Goal

Preferred outcome:

1. cart line displays the correct final unit price if feasible
2. if Shopify surfaces limit exact display behavior, phase 1 may fall back to discount-line-style rendering as long as final pricing is correct

Implementation rule:

1. storefront preview logic and pricing enforcement logic must use the same tier-selection rules
2. prioritize correctness of final pricing over forcing an exact unit-price display where the platform does not support it cleanly

## 14. Technical Guidance

Use Shopify-native architecture wherever appropriate.

Prefer:

1. official Shopify app stack already present in repo
2. TypeScript
3. server-side validation
4. centralized pricing logic
5. shared utility functions for tier parsing and selection

Architecture should likely include:

1. embedded admin app
2. Theme App Extension for storefront widget
3. Shopify-native subscription integration
4. customer account / portal implementation aligned to Shopify capabilities
5. pricing enforcement layer compatible with the store setup

If a platform limitation blocks a perfect implementation, choose the safest compatible path and document it clearly.

## 15. Required Shared Logic Modules

Centralize and reuse these:

1. metafield JSON parser
2. tier validation
3. active tier selector
4. one-time price calculator
5. subscription price calculator for percentage discount
6. subscription total calculator for fixed discount
7. currency rounding helpers
8. widget display formatter helpers

## 16. Required Admin UX

Implement routes/pages for at least:

1. dashboard
2. subscription offers list
3. create/edit offer
4. selling plan settings
5. subscription discount settings
6. widget customization

These screens must support:

1. clean loading states
2. clear validation
3. useful empty states
4. success feedback
5. practical merchant language

## 17. Required Storefront Widget UX

Implement a widget similar in spirit to the provided references.

It must include:

1. title like `Buy More, Save More`
2. `Purchase options`
3. one-time purchase card with active price on the right
4. subscribe & save card with active price on the right
5. savings badge
6. `Deliver every ...` dropdown when subscription is selected
7. `Subscription details` row
8. quantity/price table
9. quantity selector
10. total cost panel

Behavior:

1. changing quantity updates active tier
2. changing quantity updates displayed price and total
3. one-time selection uses `priceAfterDiscount`
4. subscription selection applies subscription discount after `priceAfterDiscount`
5. fixed amount discount mode must present total clearly

## 18. Required Portal UX

Portal should be intentionally narrow but polished.

Include:

1. subscription list
2. subscription detail
3. pause action
4. resume action
5. cancel action
6. next charge date display

Use safe confirmation flows for destructive actions.

## 19. Data Modeling Expectations

Create or adapt a schema for at least:

1. Shop
2. SubscriptionOffer
3. ProductSubscriptionAssignment
4. SellingPlan mapping entities
5. SubscriptionDiscountConfig
6. WidgetCustomizationSettings
7. Subscription stats snapshot or query layer
8. Portal permissions/settings if needed

If the app can rely on Shopify as source of truth for some subscription entities, keep only the necessary local config and mappings.

## 20. Testing Requirements

Add practical tests for:

1. metafield parsing
2. tier selection
3. one-time price calculation
4. subscription percentage calculation
5. fixed amount total calculation
6. invalid metafield handling

Also add a manual QA checklist covering:

1. quantity changes
2. switching one-time / subscription
3. multiple plan selection
4. add-to-cart behavior
5. cart pricing result
6. portal actions

## 21. Delivery Expectations

Do not stop after planning.

Work through:

1. repo inspection
2. architecture alignment
3. implementation
4. verification
5. documentation

In your final response include:

1. what you built
2. what remains
3. known Shopify/platform limitations
4. exact commands to run
5. exact files changed

## 22. Non-Negotiable Rules

1. `priceAfterDiscount` is the real one-time active price
2. `bulkPrice` is display/reference only
3. subscription discount applies after tier pricing
4. fixed amount subscription discount applies to invoice total, not per unit
5. bulk pricing is product-level in phase 1
6. all variants share the same bulk pricing table in phase 1
7. storefront widget must sit near the buy box
8. if updating the native theme price is too theme-dependent, keep the widget pricing authoritative for phase 1

## 23. Final Instruction

Build the app in the current workspace as far as possible. If some parts depend on store credentials, subscription APIs, or deployment setup, still implement the code structure and clearly describe the exact activation steps.
