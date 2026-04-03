# Pricing Plan Proposal

## Purpose

Tài liệu này đề xuất cách chia feature hiện tại của SubBulk thành ba gói thương mại:

1. Free
2. Premium
3. Ultra

Mục tiêu là:

- bám sát feature matrix đang được thực thi trong code
- tránh bán những capability mà hệ thống chưa thật sự enforce hoặc chưa thật sự hoàn thiện
- tạo nền tảng để viết listing content, pricing content, sales docs, và reviewer docs

## Pricing Anchors From Current Code

Theo plan catalog hiện tại:

1. Free -> `$0`
2. Premium -> `$29/month` hoặc `$290/year`
3. Ultra -> `$79/month` hoặc `$790/year`

Source of truth: `app/services/admin-plan-catalog.shared.ts`

## Guiding Principles

1. Free chỉ nên giữ onboarding và storefront setup basics.
2. Premium nên là gói “đủ dùng cho merchant production”.
3. Ultra nên bán giá trị ở operational maturity, advanced workflow readiness, và support lane, không chỉ thêm vài checkbox nhỏ.
4. Internal admin portal không được tính là merchant-facing value để bán plan.

## Proposed Packaging

### Free

Định vị:

- thử nghiệm app
- cấu hình nền tảng storefront cơ bản
- đánh giá fit trước khi merchant đi vào subscription operations đầy đủ

Nên bao gồm:

- widget settings
- widget product selection
- bulk pricing metafield configuration
- theme editor placement flow
- storefront widget styling và preview
- privacy page và deletion request entry
- billing page để xem current plan và lý do feature bị khóa

Không nên bao gồm:

- subscriptions dashboard đầy đủ
- subscription rule builder
- analytics dashboard
- customer self-service management flows như một commercial promise chính

Thông điệp bán hàng:

- launch storefront widget foundation without committing to a paid plan

### Premium

Định vị:

- gói production mặc định cho phần lớn merchant subscription

Nên bao gồm toàn bộ Free, cộng thêm:

- subscription operations trong admin
- subscription rule builder
- selling plan configuration
- analytics dashboard
- customer self-service portal
- Customer Account UI extension subscription management
- payment method / billing status visibility khi Shopify có dữ liệu

Đây nên là gói merchant hiểu rằng họ đã có:

- cấu hình subscription hoàn chỉnh
- vận hành subscription hằng ngày
- self-service cho customer
- visibility đủ dùng cho retention operations

Thông điệp bán hàng:

- run your subscription program with full merchant operations and customer self-service

### Ultra

Định vị:

- gói cho merchant cần support/ops mạnh hơn và sẵn sàng cho advanced capabilities

Nên bao gồm toàn bộ Premium, cộng thêm:

- automation-ready positioning
- premium operations positioning
- priority support
- các advanced/coming-soon surfaces được đóng gói dưới nhãn cao cấp khi đã sẵn sàng

Ghi chú quan trọng:

Trong code hiện tại, entitlement `automation` và `prioritySupport` là hai khác biệt rõ nhất giữa Premium và Ultra. Vì vậy nếu muốn Ultra bán thuyết phục hơn, roadmap nên bổ sung ít nhất một capability merchant-visible nữa cho tier này trong tương lai.

Thông điệp bán hàng:

- scale recurring revenue operations with priority support and advanced workflow readiness

## Proposed Commercial Matrix

### Feature categories

1. Storefront setup
2. Subscription operations
3. Analytics and reporting
4. Customer self-service
5. Commercial controls
6. Premium ops/support

### Suggested mapping

| Feature category | Free | Premium | Ultra |
| --- | --- | --- | --- |
| Storefront widget setup | Yes | Yes | Yes |
| Widget styling and preview | Yes | Yes | Yes |
| Widget product selection | Yes | Yes | Yes |
| Bulk pricing metafield management | Yes | Yes | Yes |
| Billing page and plan visibility | Yes | Yes | Yes |
| Subscription contract operations | No | Yes | Yes |
| Subscription rule builder | No | Yes | Yes |
| Analytics dashboard | No | Yes | Yes |
| Customer self-service portal | No | Yes | Yes |
| Customer Account UI extension actions | No | Yes | Yes |
| Automation surfaces | No | No | Yes |
| Priority support | No | No | Yes |

## Reviewer-Friendly Naming Guidance

Khi viết pricing content, dùng đúng merchant-facing names sau:

1. Free
2. Premium
3. Ultra

Không nên dùng `Growth` hoặc `Scale` trong listing/pricing copy, vì đó là internal terminology.

## Suggested Pricing Content Angles

### Free

- Configure your widget and bulk pricing foundations
- Test storefront fit before rolling out subscription operations
- Keep setup lightweight while your team validates the experience

### Premium

- Build and operate subscriptions from one admin workspace
- Give customers self-service pause, resume, and cancel actions
- Track subscription health with merchant-facing analytics

### Ultra

- Everything in Premium plus high-touch support positioning
- Unlock scale-oriented workflows and advanced operations readiness
- Best for brands that want premium subscription operations coverage

## Risks In Current Packaging

1. Free currently still exposes some setup power, so messaging must make clear that production operations unlock on paid plans.
2. Ultra is currently more differentiated by support/positioning than by a large volume of unique merchant-visible features.
3. “Advanced offers” is still labeled as legacy in entitlement naming, so it should not become a major public marketing headline yet unless product language is refreshed.

## Recommendation

Nếu cần publish pricing content ngay, nên dùng cách chia này:

1. Free = setup and evaluation tier
2. Premium = main production tier
3. Ultra = premium operations and support tier

Nếu cần tối ưu commercial clarity hơn trong vòng tiếp theo, nên bổ sung thêm ít nhất một merchant-visible advanced capability chỉ dành cho Ultra để tăng khoảng cách giá trị với Premium.