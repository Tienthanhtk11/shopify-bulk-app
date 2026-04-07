# Bảng So Sánh Tính Năng Theo Plan

## Ghi chú quan trọng

- Đây là bảng theo entitlement hiện tại trong app.
- Với plan trả phí, feature chỉ thực sự mở khi billing status là `active` hoặc `trialing`.
- Nếu merchant ở Premium hoặc Ultra nhưng billing inactive, app sẽ khóa lại các feature trả phí và đẩy về Billing page.
- Internal admin portal không thuộc plan bán cho merchant.

## Tóm tắt nhanh

| Nhóm tính năng | Free | Premium | Ultra |
|---|---|---|---|
| Settings / widget styling | Yes | Yes | Yes |
| Widget products / bulk pricing config | Yes | Yes | Yes |
| Subscription management | No | Yes | Yes |
| Subscription rule builder | No | Yes | Yes |
| Advanced offers | No | Yes | Yes |
| Analytics | No | Yes | Yes |
| Automation-ready features | No | No | Yes |
| Priority support positioning | No | No | Yes |
| Merchant admin internal capability | No | No | No |

## Bảng chi tiết dễ nhìn

| Tính năng | Free | Premium | Ultra | Ghi chú |
|---|---|---|---|---|
| Current plan và Billing page | Yes | Yes | Yes | Merchant nào cũng xem được Billing page |
| Widget settings | Yes | Yes | Yes | Chỉnh heading, label, màu, font, preview |
| Widget-enabled products | Yes | Yes | Yes | Add product, remove product, lưu bulk pricing JSON |
| Bulk pricing storefront preparation | Yes | Yes | Yes | Thuộc nhóm `widgetProducts` |
| Subscription rule builder | Yes | Yes | Yes | Free đã được mở để merchant mới có thể cấu hình rule builder |
| Multi-interval selling plans | Yes | Yes | Yes | Weekly / monthly, nhiều interval |
| Sync selling plan group to Shopify | Yes | Yes | Yes | Đi theo flow subscription rule |
| Subscription contracts list | No | Yes | Yes | Thuộc nhóm `subscriptionManagement` |
| Search / filter subscriptions | No | Yes | Yes | Theo customer, email, contract, product |
| Payment method summary | No | Yes | Yes | Nếu Shopify có dữ liệu |
| Last payment status visibility | No | Yes | Yes | Nếu Shopify đã ghi billing attempt |
| Advanced offers | No | Yes | Yes | Thuộc entitlement `advancedOffers` |
| Analytics dashboard | No | Yes | Yes | Thuộc entitlement `analytics` |
| Automation / additional workflows | No | No | Yes | Thuộc entitlement `automation` |
| Priority support positioning | No | No | Yes | Thuộc entitlement `prioritySupport` |
| Internal admin portal | No | No | No | Không phải merchant-facing plan feature |

## Diễn giải theo từng plan

## Free

Plan Free hiện phù hợp cho merchant mới cài app và mới setup storefront.

Merchant dùng được:

- Billing page để xem current plan
- Widget settings
- Widget products
- Subscription rule builder
- Cấu hình bulk pricing JSON cho sản phẩm đã bật widget
- Cấu hình selling plan intervals cơ bản
- Chuẩn bị storefront widget và theme placement

Merchant chưa dùng được:

- Analytics
- Subscription management
- Subscription rule builder
- Advanced offers
- Automation
- Priority support

## Premium

Plan Premium mở toàn bộ nhóm merchant operations chính.

Merchant dùng được:

- Mọi thứ trong Free
- Analytics dashboard
- Subscription management
- Subscription rule builder
- Advanced offers

Merchant chưa dùng được:

- Automation
- Priority support

## Ultra

Plan Ultra là full merchant-facing package hiện tại.

Merchant dùng được:

- Mọi thứ trong Premium
- Automation-ready features
- Priority support positioning

## Mapping entitlement thật trong code

### Free

Enabled:

- `settings`
- `widgetProducts`
- `subscriptionRules`

Locked:

- `subscriptionManagement`
- `advancedOffers`
- `analytics`
- `automation`
- `prioritySupport`
- `merchantAdmin`

### Premium

Enabled khi billing active:

- `settings`
- `widgetProducts`
- `subscriptionManagement`
- `subscriptionRules`
- `advancedOffers`
- `analytics`

Locked:

- `automation`
- `prioritySupport`
- `merchantAdmin`

### Ultra

Enabled khi billing active:

- `settings`
- `widgetProducts`
- `subscriptionManagement`
- `subscriptionRules`
- `advancedOffers`
- `analytics`
- `automation`
- `prioritySupport`

Locked:

- `merchantAdmin`

## Cách nói ngắn gọn với PM

Có thể tóm tắt như sau:

- Free: setup storefront widget và bulk pricing cơ bản.
- Premium: mở merchant operations đầy đủ cho subscriptions và analytics.
- Ultra: full package gồm Premium cộng thêm automation và priority support positioning.

## Lưu ý để tránh hiểu nhầm khi test

- Nếu shop mới install app và đang ở Free, các màn như Analytics, Subscriptions, Subscription rule sẽ bị redirect sang Billing.
- Điều này là đúng theo entitlement hiện tại, không phải backend crash.
- Widget products và Settings mới là nhóm feature merchant có thể dùng ngay ở Free.