# Billing And Entitlements

## Purpose

Tài liệu này mô tả cách SubBulk quyết định merchant được dùng feature nào, lúc nào write actions bị chặn, và managed pricing của Shopify nối vào hệ thống hiện tại ra sao.

## Current Plan Model

### Merchant-facing names

1. Free
2. Premium
3. Ultra

### Internal keys

1. `free`
2. `growth`
3. `scale`

### Current plan catalog

1. Free
- price: `$0`
- focus: onboarding, widget setup basics

2. Premium
- price: `$29/month` hoặc `$290/year`
- focus: full subscription operations, rule builder, analytics

3. Ultra
- price: `$79/month` hoặc `$790/year`
- focus: everything in Premium plus automation-ready positioning and priority support

Source of truth: `app/services/admin-plan-catalog.shared.ts`

## Entitlement Resolution Model

Entitlements được tính từ `MerchantPlan` snapshot gần nhất trong DB nội bộ.

### Inputs

- `planKey`
- `planName`
- `status`

### Status behavior

Paid access chỉ được xem là active khi billing status thuộc một trong hai giá trị:

1. `active`
2. `trialing`

Nếu merchant đang ở plan paid nhưng status không active/trialing, app sẽ coi paid access là inactive và trả merchant về base free features.

Source of truth: `app/services/entitlements.server.ts`

## Feature Matrix

### Free

Enabled:

- settings
- widgetProducts

Locked:

- subscriptionManagement
- subscriptionRules
- advancedOffers
- analytics
- automation
- prioritySupport
- merchantAdmin

### Premium

Enabled khi billing active:

- settings
- widgetProducts
- subscriptionManagement
- subscriptionRules
- advancedOffers
- analytics

Locked:

- automation
- prioritySupport
- merchantAdmin

### Ultra

Enabled khi billing active:

- settings
- widgetProducts
- subscriptionManagement
- subscriptionRules
- advancedOffers
- analytics
- automation
- prioritySupport

Locked:

- merchantAdmin

## Route Access Gating

Một số route chỉ cho vào nếu merchant có feature tương ứng:

- `/app/analytics` -> `analytics`
- `/app/offers` -> `advancedOffers`
- `/app/subscriptions` -> `subscriptionManagement`
- `/app/subscription-rule` -> `subscriptionRules`
- `/app/additional` -> `automation`

Nếu merchant không đủ quyền, app sẽ redirect sang `/app/billing` kèm query giải thích feature bị khóa.

Source of truth: `app/services/billing-access.shared.ts`, `app/routes/app.tsx`

## Write Access Gating

Write access bị chặn trong hai trường hợp:

1. merchant cố dùng action thuộc feature chưa có trong plan
2. merchant đang ở paid plan nhưng billing inactive

Khi đó app sẽ redirect về Billing page với reason:

- `feature_locked`
- `billing_inactive`

Source of truth: `app/services/billing.server.ts`, `app/services/billing-access.shared.ts`

## Managed Pricing Integration

### What Shopify owns

Shopify-managed pricing chịu trách nhiệm cho:

- hosted pricing page
- plan selection UI trong admin Shopify
- recurring subscription billing lifecycle
- free trial logic
- proration behavior

### What SubBulk owns

SubBulk chịu trách nhiệm cho:

- internal plan snapshot trong DB
- entitlement matrix
- current plan rendering trong app
- billing reconciliation sau khi merchant approve plan
- gating route/action theo entitlement hiện tại

## Managed Pricing Readiness Flags

Billing page chỉ hiện direct link sang hosted pricing page nếu cả hai điều kiện đúng:

1. `SHOPIFY_MANAGED_PRICING_APP_HANDLE` đã được set
2. `SHOPIFY_MANAGED_PRICING_READY` được bật thành truthy

Nếu app handle có nhưng `READY` chưa bật, app sẽ cố tình ẩn link để tránh merchant/reviewer rơi vào Shopify-hosted `404`.

Source of truth: `app/services/managed-pricing.server.ts`, `app/routes/app.billing.tsx`

## Billing Return Flow

Welcome link của managed pricing nên trỏ về `/app/welcome`.

Flow:

1. Merchant đổi plan trên Shopify pricing page
2. Shopify redirect merchant về `/app/welcome`
3. Loader của route này gọi billing reconciliation
4. Internal merchant snapshot được refresh từ Shopify state mới nhất
5. Merchant tiếp tục dùng app với entitlement mới

Source of truth: `app/routes/app.welcome.tsx`

## Plan Mapping Risks

Các rủi ro chính hiện tại:

1. merchant-facing names và internal keys dễ lệch nhau nếu chỉnh copy thiếu thống nhất
2. live managed-pricing identifiers có thể chưa được map đầy đủ vào env nếu production chưa có subscription thật
3. status paid nhưng inactive có thể gây nhầm là “merchant đang ở Premium/Ultra mà sao bị khóa”

## Operational Rules

1. Khi đổi merchant-facing plan names, phải kiểm tra cả plan catalog và billing mapping.
2. Khi publish managed pricing, phải test lại hosted pricing page không còn `404`.
3. Sau khi merchant đổi plan, phải xác nhận `/app/welcome` reconcile đúng internal snapshot.
4. Không nên bật `SHOPIFY_MANAGED_PRICING_READY` trước khi Pricing content trong Partner Dashboard đã hoàn chỉnh.

## Source Of Truth In Code

- plan catalog: `app/services/admin-plan-catalog.shared.ts`
- entitlements: `app/services/entitlements.server.ts`, `app/services/entitlements.shared.ts`
- billing access: `app/services/billing.server.ts`, `app/services/billing-access.shared.ts`
- managed pricing link state: `app/services/managed-pricing.server.ts`
- merchant billing UI: `app/routes/app.billing.tsx`
- reconciliation return flow: `app/routes/app.welcome.tsx`

## Quick Debug Checklist

Nếu merchant báo không dùng được feature:

1. kiểm tra latest `MerchantPlan` snapshot trong DB
2. kiểm tra `planKey`, `planName`, `status`
3. kiểm tra feature đó map vào entitlement key nào
4. kiểm tra route/action có yêu cầu feature đó không
5. nếu là issue pricing page, kiểm tra `SHOPIFY_MANAGED_PRICING_APP_HANDLE` và `SHOPIFY_MANAGED_PRICING_READY`
6. nếu merchant vừa đổi plan, xác minh đã đi qua `/app/welcome` chưa