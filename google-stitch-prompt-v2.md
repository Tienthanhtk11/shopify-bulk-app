# Google Stitch Prompt V2: Internal Shopify Subscription + Bulk Pricing App

Copy everything below into Google Stitch.

---

You are a senior product designer, Shopify UX specialist, SaaS product strategist, and conversion-focused commerce designer.

Design a complete product design package for an internal Shopify app called `SubBulk`.

This app is for one internal Shopify store, not a public app-first product. However, it still needs to be designed with production quality, operational clarity, and Shopify-native patterns.

## 1. Product Definition

Design a Shopify app that combines:

1. Subscription selling similar to Seal Subscriptions
2. Bulk pricing on the product page using data from Shopify product metafields

Both are equally important.

This is not just a widget. The product includes:

1. Storefront purchase widget
2. Merchant admin
3. Customer portal
4. Pricing logic that previews correctly on the product page and is intended to carry through into cart/checkout behavior

## 2. Highest-Priority Product Goal

The most important part of the product is the storefront experience near the buy box.

Priority order:

1. Storefront widget near the product price
2. Correct pricing logic
3. Merchant admin
4. Subscription backend configuration
5. Customer portal

## 3. Storefront Placement Requirement

The widget must appear directly under or next to the product price/buy-box area so it feels like one cohesive pricing and purchase module.

Do not design it as a detached section far below the product form.

Preferred behavior:

1. If theme integration allows, the main large product price can also update based on quantity and purchase option
2. If that is too theme-dependent, the widget itself must still clearly show the correct active price and total cost

## 4. Bulk Pricing Data Source

Bulk pricing is entered manually by the merchant in a Shopify `product metafield` as JSON.

Use this exact JSON shape:

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

Interpret the fields exactly this way:

1. `qtyBreakpoint`
   - the starting quantity for the tier
   - example: `11` means `11+`

2. `priceAfterDiscount`
   - the actual one-time unit price for that quantity tier
   - this is the real base price for calculations
   - it does NOT include subscription discount yet

3. `bulkPrice`
   - a reference/original display price
   - useful for display only
   - not the core field used for pricing calculations

## 5. Core Pricing Logic

This logic must be reflected precisely in the UX and screens.

### One-time purchase

1. Determine active tier by quantity
2. `one-time unit price = activeTier.priceAfterDiscount`
3. `one-time total = one-time unit price x quantity`

### Subscribe & save with percentage discount

1. Determine active tier by quantity
2. `one-time unit price = activeTier.priceAfterDiscount`
3. `subscription unit price = one-time unit price minus percentage discount`
4. `subscription total = subscription unit price x quantity`

### Subscribe & save with fixed amount discount

1. Determine active tier by quantity
2. `one-time unit price = activeTier.priceAfterDiscount`
3. `subtotal = one-time unit price x quantity`
4. `subscription total = subtotal minus fixed amount discount`

Important:

- the fixed amount discount is applied to the total invoice, not per unit
- because of that, the UI should emphasize final total more than a fake per-unit value when fixed discount is used

## 6. Product Scope

Design the app as a production-ready phase 1 for one internal store.

### Must-have in Phase 1

#### Storefront

1. Buy-box integration
2. Purchase options
3. One-time purchase option
4. Subscribe & save option
5. Savings badge
6. `Deliver every ...` dropdown for multiple subscription plans
7. Subscription details row
8. Bulk pricing table
9. Quantity selector
10. Total cost live update
11. Active tier highlight

#### Merchant admin

1. Subscription offers management
2. Selling plan / frequency settings
3. Subscription discount settings
4. Widget customization
5. Basic stats:
   - active subscriptions
   - paused subscriptions
   - cancelled subscriptions

#### Customer portal

1. Subscription list
2. Subscription detail
3. Pause
4. Resume
5. Cancel
6. Show next charge date

### Later

1. Skip next order
2. Change frequency
3. Change quantity
4. Change shipping address
5. Update payment method
6. Order history
7. Payment calendar
8. Email reminders
9. Cancellation management rules
10. Product swap
11. Prepaid subscriptions
12. Passwordless portal access
13. Delivery/shipping profile logic
14. API/webhook access
15. Multi-language widget text

## 7. Subscription Requirements

Subscription support must include:

1. Multiple subscription plans on one product
2. One default plan selected by merchant
3. UI rendered as a single dropdown:
   - `Deliver every ...`
4. Discount types:
   - percentage
   - fixed amount

## 8. Variant Handling

In phase 1:

1. Bulk pricing applies at the product level
2. All variants of a product share the same bulk pricing table
3. The storefront still needs to work on products that have variant selectors

## 9. Customer Portal Scope

The portal in phase 1 should be intentionally limited but polished.

Must-have actions:

1. Pause subscription
2. Resume subscription
3. Cancel subscription

Subscription detail should show:

1. Product
2. Status
3. Frequency
4. Next charge date

## 10. What You Must Produce

Return a complete design package with this structure:

### A. Product Summary

Explain:

1. what the app is
2. who it is for
3. what makes it different
4. why the buy-box experience is the center of the product

### B. PRD

Include:

1. business goal
2. user problems
3. success metrics
4. phase 1 scope
5. later scope
6. assumptions
7. constraints

### C. Information Architecture

Include these app sections:

1. Dashboard
2. Subscription Offers
3. Selling Plans / Frequency Settings
4. Subscription Discount Settings
5. Widget Customization
6. Customer Portal
7. Stats / Overview
8. Storefront surfaces

### D. User Flows

Map these flows in detail:

1. Merchant creates subscription offer
2. Merchant configures plan frequencies
3. Merchant configures subscription discount
4. Merchant adds product metafield JSON for bulk pricing
5. Buyer lands on product page
6. Buyer changes quantity
7. Buyer switches between one-time and subscription
8. Buyer selects subscription frequency
9. Buyer adds to cart
10. Customer manages subscription in portal

For each flow include:

1. trigger
2. user steps
3. screens
4. key system feedback
5. failure states

### E. Screen Inventory

Group screens into:

1. Merchant Admin
2. Storefront Widget States
3. Customer Portal
4. Empty / Error / Loading / Warning States

For each screen provide:

1. screen name
2. purpose
3. user
4. entry point

### F. Detailed Screen Specs

Create detailed specs for at least:

1. Dashboard
2. Subscription offers list
3. Create/edit subscription offer
4. Selling plan settings
5. Subscription discount settings
6. Widget customization
7. Product page widget default state
8. Product page widget one-time selected
9. Product page widget subscription selected
10. Product page widget quantity changed
11. Product page widget fixed-discount mode
12. Product page widget with variants present
13. Customer portal subscription list
14. Customer portal subscription detail
15. Pause modal
16. Resume action state
17. Cancel confirmation flow

For each screen include:

1. objective
2. layout
3. key components
4. displayed data
5. primary action
6. secondary action
7. validations
8. loading state
9. success state
10. error state
11. responsive notes

### G. Storefront Widget UX Rules

Define exact behavior for:

1. how purchase option cards look
2. how prices appear on the right side of those cards
3. how the savings badge works
4. how the `Deliver every ...` dropdown behaves
5. how the bulk pricing table is rendered
6. how the active tier row is highlighted
7. how quantity affects price
8. how quantity affects total cost
9. how the widget behaves when the product has variants
10. how the widget behaves if the theme price above it can also be updated
11. fallback behavior if the theme price cannot be cleanly updated

Include special handling for:

1. percentage subscription discount
2. fixed amount discount on total invoice

### H. Pricing Display Rules

This section must be explicit.

Define how the UI should display:

1. one-time unit price
2. subscription unit price for percentage discounts
3. final total
4. fixed amount discount on invoice
5. bulk price as reference display

Important:

The final answer must clearly differentiate:

1. `bulkPrice` as display/reference
2. `priceAfterDiscount` as true one-time active price
3. additional subscription discount on top of `priceAfterDiscount`

### I. Admin Rules And Settings

Design settings for:

1. multiple subscription plans per product
2. default selected plan
3. discount type selector
4. discount value input
5. widget customization options

### J. Portal Rules

Define:

1. which actions are available in phase 1
2. when pause/resume/cancel is shown
3. how next charge date is displayed
4. safe confirmation UX for destructive actions

### K. Component Inventory

List reusable components, including:

1. purchase option card
2. savings badge
3. deliver-every dropdown
4. bulk pricing tier table
5. quantity stepper
6. total cost panel
7. subscription details row
8. stat card
9. confirmation modal
10. portal action row

For each:

1. purpose
2. variants
3. states

### L. Copy Suggestions

Provide practical English copy for:

1. widget title
2. purchase options heading
3. one-time label
4. subscribe & save label
5. savings badge
6. quantity label
7. total cost label
8. subscription details row
9. pause confirmation
10. cancel confirmation
11. stats labels

### M. Responsive Notes

Provide guidance for:

1. mobile storefront
2. desktop storefront
3. Shopify admin desktop
4. portal mobile

### N. Accessibility Guidance

Include:

1. radio group semantics
2. dropdown accessibility
3. table accessibility
4. quantity control accessibility
5. focus states
6. screen-reader clarity for pricing changes

## 11. Visual Style Direction

The design should feel:

1. premium
2. conversion-focused
3. simple
4. native enough for Shopify
5. more polished than a generic utility widget

Storefront direction:

1. soft cards
2. clear spacing
3. strong pricing hierarchy
4. easy-to-scan tier table
5. visually strong total cost area

Admin direction:

1. practical
2. operational
3. clean forms
4. clear status indicators

## 12. Output Quality Rules

1. Be concrete, not generic.
2. Reflect the exact pricing logic above.
3. Do not redesign the product into a simpler app.
4. Treat the buy-box widget as the hero feature.
5. Design for a real internal production app, not a concept mockup only.

Now produce the full design package.
