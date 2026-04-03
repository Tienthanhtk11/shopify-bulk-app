# SubBulk Overview

## Purpose

SubBulk là một Shopify app self-hosted tập trung vào hai nhóm giá trị chính cho merchant:

- subscription commerce: tạo, đồng bộ, hiển thị, và self-service subscription flows
- bulk pricing: cấu hình giá theo số lượng trên product page và đảm bảo logic discount chạy đúng trong checkout

Ngoài embedded Shopify app cho merchant, hệ thống còn có một internal admin portal riêng để đội vận hành xử lý merchant, plan snapshots, internal notes, và admin accounts.

## Primary Surfaces

Hệ thống hiện có các surface chính sau:

1. Embedded merchant app trong Shopify Admin
2. Theme app extension cho storefront widget
3. Shopify discount function cho checkout pricing logic
4. App proxy customer portal tại `/apps/subbulk/portal`
5. Customer Account UI extension tại `shopify.com/account/profile`
6. Internal admin portal tại `admin-app.thanhpt.online`

## Primary Actors

1. Merchant admin
Người cài app, cấu hình widget, billing, subscription rules, và theo dõi dữ liệu subscription.

2. Customer / buyer
Người mua subscription products và tự quản lý subscription của mình qua customer portal hoặc Customer Account UI extension.

3. Internal operator
Người thuộc team nội bộ dùng admin portal để theo dõi merchant, plan, billing exceptions, notes, và admin access.

4. Shopify platform
Nguồn sự thật cho auth, billing, subscriptions, payment methods, webhooks, customer account surfaces, và hosted pricing.

## Product Scope Today

### Merchant-facing

- analytics dashboard cho subscription health
- billing page với current plan, entitlement visibility, managed pricing entry
- subscription contract visibility trong admin
- subscription rule builder cho selling plans
- widget product management cho bulk pricing
- widget styling/settings và theme editor deep links
- privacy / data deletion controls
- customer self-service qua app proxy portal và Customer Account UI extension

### Internal-only

- merchant operations portal
- package definition management
- internal admin account management
- merchant notes và manual plan overrides

## Core Business Flows

### Merchant setup flow

1. Merchant cài app và hoàn tất OAuth
2. Merchant vào embedded app
3. Merchant chọn sản phẩm bật widget
4. Merchant cấu hình bulk pricing và subscription rule
5. Merchant chỉnh widget copy, colors, layout trong Settings
6. Merchant mở theme editor để đặt block vào product template

### Billing and access flow

1. Merchant vào Billing page
2. App đọc latest internal billing snapshot
3. Entitlement matrix quyết định merchant có được dùng route/action nào không
4. Khi managed pricing đã publish, merchant đổi plan trên Shopify-hosted pricing page
5. Merchant quay lại `/app/welcome` để reconcile billing state về DB nội bộ

### Customer self-service flow

1. Customer mua subscription product
2. Subscription contract được Shopify tạo
3. Customer vào app proxy portal hoặc Customer Account UI extension
4. Hệ thống chỉ cho phép thao tác trên contract thuộc đúng customer hiện tại
5. Customer pause, resume, hoặc cancel subscription

## Technical Shape

### Application model

- backend chính là Shopify Remix app chạy self-hosted
- DB chính là PostgreSQL dùng Prisma
- extension code nằm trong `extensions/`
- hosted pricing và nhiều primitive quan trọng vẫn do Shopify kiểm soát

### Deployment model

- web app chạy trong Docker stack ở `/home/krizpham/thanhpt-stack`
- Customer Account UI extension, theme extension, và discount function được release qua `shopify app deploy`
- backend deploy và Shopify extension release là hai quy trình khác nhau

## Current Plan Model

Merchant-facing plan names hiện tại:

1. Free
2. Premium
3. Ultra

Internal plan keys tương ứng:

1. `free`
2. `growth`
3. `scale`

## Source Of Truth In Code

- embedded merchant routes: `app/routes/app.*`
- billing and entitlement logic: `app/services/billing.server.ts`, `app/services/billing-access.shared.ts`, `app/services/entitlements.server.ts`
- plan catalog: `app/services/admin-plan-catalog.shared.ts`
- subscription domain: `app/models/subscription-contracts.server.ts`, `app/models/subscription-rule.server.ts`
- customer portal: `app/routes/apps.subbulk.portal.tsx`
- customer account extension endpoint: `app/routes/apps.subbulk.customer-account.subscriptions.ts`
- customer account UI extension: `extensions/sub-bulk-customer-account/src/ProfileBlock.jsx`
- widget products and settings: `app/models/widget-enabled-product.server.ts`, `app/models/widget-settings.server.ts`
- internal admin portal: `app/routes/admin.*`

## Known Boundaries

Một số việc không thể hoàn tất chỉ bằng code trong repo:

- Shopify App Store listing content
- Partner Dashboard managed pricing configuration
- protected customer data review
- final public app review package

## Operational Caveats

1. Backend Docker deploy không tự publish Shopify extensions.
2. Customer Account UI extension chỉ cập nhật live sau khi release app version mới bằng Shopify CLI.
3. Managed pricing link phải được publish trong Partner Dashboard trước khi app nên hiển thị nút chuyển plan cho merchant.
4. Billing state nội bộ chỉ đáng tin sau khi reconciliation với Shopify đã chạy.

## Why This System Needs Documentation

Hệ thống có nhiều surface khác nhau và nhiều phần source of truth nằm ở cả code nội bộ lẫn Shopify platform. Nếu không có technical docs, dev mới rất dễ:

- deploy nhầm chỉ backend mà quên release extension
- sửa plan names merchant-facing không khớp internal mapping
- thay đổi billing gating sai chỗ
- bỏ sót customer ownership guards ở subscription actions