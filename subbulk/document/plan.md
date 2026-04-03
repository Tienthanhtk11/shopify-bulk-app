# Technical Documentation Plan

Mục tiêu của kế hoạch này là tạo ra một bộ tài liệu kỹ thuật đủ rõ để:

- PM hiểu phạm vi hệ thống, dependencies, rủi ro, và roadmap tài liệu
- dev mới có thể onboard nhanh, deploy an toàn, và maintain hệ thống mà không phải đọc toàn bộ codebase từ đầu
- team vận hành có runbook đủ dùng khi billing, subscription, storefront widget, hoặc deploy phát sinh sự cố

## 1. Deliverables

Bộ tài liệu nên được viết thành nhiều file nhỏ trong cùng thư mục `document/`, thay vì dồn tất cả vào một file lớn.

Danh sách tài liệu đề xuất:

1. `overview.md`
Mô tả ngắn hệ thống, business purpose, các surface chính, actor chính, và glossary.

2. `architecture.md`
Mô tả kiến trúc tổng thể: Shopify embedded app, app proxy portal, Customer Account UI extension, theme extension, discount function, internal admin portal, PostgreSQL, background jobs, Docker deployment.

3. `merchant-features.md`
Mô tả toàn bộ merchant-facing capabilities theo nhóm: analytics, billing, subscription operations, widget management, customer self-service, privacy.

4. `billing-and-entitlements.md`
Mô tả plan model, entitlement gates, managed pricing, billing reconciliation, các env liên quan, và cách map plan từ Shopify về internal snapshot.

5. `subscription-domain.md`
Mô tả subscription rule, selling plan group sync, subscription contract reading, customer action flows pause/resume/cancel, và các rule/guard quan trọng.

6. `storefront-and-extensions.md`
Mô tả theme app extension, widget-enabled products, metafields, discount function, app proxy portal, Customer Account UI extension, và deployment semantics của extension.

7. `data-model.md`
Mô tả Prisma models cốt lõi, quan hệ giữa bảng, data ownership, audit trail, deletion requests, và dữ liệu nào là operational vs compliance-critical.

8. `integrations.md`
Mô tả các tích hợp Shopify APIs, webhook topics, session/auth flows, payment method access, protected customer data implications.

9. `deployment-and-operations.md`
Mô tả local dev, build, Docker deploy, Shopify app deploy, rollback hiện tại, smoke checks, scheduled deletion job, production verification checklist.

10. `testing-and-regression.md`
Mô tả current automated test coverage, các luồng cần manual QA, regression hotspots, và release checklist trước khi deploy.

11. `security-privacy-compliance.md`
Mô tả protected customer data, privacy/deletion handling, webhook compliance, staff access boundaries, và các external review blockers.

12. `known-gaps-and-roadmap.md`
Mô tả những gap còn tồn tại, technical debt, blockers external với Shopify, và thứ tự xử lý đề xuất.

## 2. Priority Order

Không nên viết tất cả cùng lúc. Thứ tự hợp lý để nhanh tạo giá trị:

1. `overview.md`
2. `architecture.md`
3. `merchant-features.md`
4. `billing-and-entitlements.md`
5. `deployment-and-operations.md`
6. `subscription-domain.md`
7. `storefront-and-extensions.md`
8. `data-model.md`
9. `integrations.md`
10. `testing-and-regression.md`
11. `security-privacy-compliance.md`
12. `known-gaps-and-roadmap.md`

Lý do:

- PM cần `overview`, `architecture`, `merchant-features`, `known-gaps-and-roadmap` sớm nhất
- dev maintain cần `billing-and-entitlements`, `deployment-and-operations`, `subscription-domain`, `storefront-and-extensions` sớm nhất
- các tài liệu sâu hơn như `data-model` và `integrations` có thể hoàn thiện sau khi khung tổng thể đã ổn

## 3. Suggested Structure Per Document

Để bộ tài liệu đồng nhất, mỗi file nên theo cấu trúc gần giống nhau:

1. Purpose
2. Scope
3. Primary actors or systems
4. Main flows
5. Source of truth in code
6. Operational notes
7. Risks / caveats
8. Open questions

Riêng các file kỹ thuật sâu hơn nên có thêm:

- dependency map
- failure modes
- debugging entry points
- test references

## 4. Source Of Truth Mapping

Khi viết tài liệu, nên luôn chỉ rõ source of truth trong codebase để dev sau không phải đoán.

Các cụm source chính hiện tại:

- merchant embedded routes: `app/routes/app.*`
- customer portal app proxy: `app/routes/apps.subbulk.portal.tsx`
- customer account extension endpoint: `app/routes/apps.subbulk.customer-account.subscriptions.ts`
- customer account UI extension: `extensions/sub-bulk-customer-account/src/ProfileBlock.jsx`
- theme extension: `extensions/subbulk-buy-box/**`
- discount function: `extensions/subbulk-discount/**`
- billing / plan logic: `app/services/managed-pricing.server.ts`, `app/services/billing.server.ts`, `app/services/partner-billing.server.ts`, `app/services/admin-plan-catalog.shared.ts`
- entitlements: `app/services/entitlements.server.ts`, `app/services/entitlements.shared.ts`
- subscription domain: `app/models/subscription-contracts.server.ts`, `app/models/subscription-rule.server.ts`, `app/models/subscription-offer.server.ts`
- widget settings and widget-enabled products: `app/models/widget-settings.server.ts`, `app/models/widget-enabled-product.server.ts`
- privacy / deletion: `app/routes/app.privacy.tsx`, `jobs.deletion-requests`, `deletion-job-runner.sh`
- internal admin portal: `app/routes/admin.*`, `app/services/internal-admin.server.ts`
- database schema: `prisma/schema.prisma`
- deployment stack: `/home/krizpham/thanhpt-stack`

## 5. Documentation Objectives By Audience

### PM

PM cần đọc nhanh và trả lời được:

- hệ thống này làm gì
- merchant thấy những gì
- hiện đang có những gói tính năng nào
- blocker nào còn nằm ở Shopify Partner Dashboard hoặc compliance
- nếu bàn giao dev khác thì effort tài liệu và maintenance nằm ở đâu

### Developer

Dev mới cần đọc và làm được:

- chạy local
- deploy production
- hiểu luồng billing / entitlements
- hiểu luồng subscription rule và customer self-service
- biết file nào sửa cho từng surface
- biết chỗ nào cần `shopify app deploy` và chỗ nào cần Docker rebuild

### Operations / Reviewer Support

Người vận hành cần đọc và làm được:

- smoke check production
- kiểm tra logs đúng chỗ
- xác minh app proxy / admin / embedded app còn sống
- hiểu vì sao extension changes không đi cùng backend deploy
- biết rollback tối thiểu đang làm thế nào

## 6. Writing Rules

Để bộ tài liệu maintain được lâu dài, nên dùng các rule này:

- viết bằng tiếng Anh nếu tài liệu dùng cho PM/reviewer/dev đa quốc gia; nếu chủ yếu nội bộ Việt Nam thì có thể viết song ngữ nhưng phải nhất quán
- ưu tiên mô tả theo flow thực tế, không theo module code thuần túy
- tránh copy-paste code dài vào tài liệu
- luôn ghi rõ assumptions và known limitations
- khi mô tả config hoặc deploy, ghi command thật đang dùng trong repo hiện tại
- khi mô tả plan/feature, dùng merchant-facing names `Free`, `Premium`, `Ultra`
- khi mô tả internal mapping, ghi thêm internal keys `free`, `growth`, `scale`

## 7. Execution Plan

### Phase 1: Foundation Docs

Mục tiêu:

- tạo bộ khung đủ để PM và dev mới hiểu hệ thống

Bao gồm:

- `overview.md`
- `architecture.md`
- `merchant-features.md`
- `billing-and-entitlements.md`

Definition of done:

- PM đọc 4 file này và hiểu được product scope, pricing surfaces, dependency với Shopify, và các blocker chính
- dev mới đọc 4 file này và biết sửa feature merchant ở đâu

### Phase 2: Maintainability Docs

Mục tiêu:

- giúp dev maintain được production system an toàn

Bao gồm:

- `deployment-and-operations.md`
- `subscription-domain.md`
- `storefront-and-extensions.md`
- `data-model.md`

Definition of done:

- dev mới có thể tự deploy
- dev mới có thể trace một flow từ UI xuống DB / Shopify API
- team hiểu rõ source of truth của từng surface

### Phase 3: Risk And Compliance Docs

Mục tiêu:

- giảm rủi ro khi handoff, audit, hoặc submit review

Bao gồm:

- `integrations.md`
- `testing-and-regression.md`
- `security-privacy-compliance.md`
- `known-gaps-and-roadmap.md`

Definition of done:

- team có runbook rõ cho regression testing
- team hiểu protected customer data implications
- team có backlog kỹ thuật rõ ràng thay vì knowledge nằm rải rác trong chat hoặc memory

## 8. Immediate Next Writing Tasks

Current status:

Đã tạo:

1. `overview.md`
2. `merchant-features.md`
3. `billing-and-entitlements.md`
4. `deployment-and-operations.md`
5. `pricing-plan-proposal.md`

Các tài liệu nên viết tiếp trong lần làm việc tiếp theo:

1. `architecture.md`
2. `storefront-and-extensions.md`
3. `subscription-domain.md`
4. `data-model.md`
5. `testing-and-regression.md`

Đây là nhóm tài liệu tiếp theo có giá trị cao nhất cho maintainability và handoff kỹ thuật.

## 9. Acceptance Criteria For The Full Documentation Set

Bộ tài liệu được xem là đủ tốt khi đạt các điều kiện sau:

- một PM mới có thể hiểu product và blockers sau 30 đến 45 phút đọc
- một dev mới có thể xác định đúng file cần sửa cho từng major flow sau 1 đến 2 giờ đọc
- một dev mới có thể deploy bản cập nhật không đụng billing/extension sai cách
- tài liệu không mâu thuẫn với source of truth trong code hiện tại
- các external blockers của Shopify được phân biệt rõ với các việc có thể fix trong code

## 10. Notes

README hiện đã có một phần `Merchant Feature Inventory` để làm nguồn đầu vào cho tài liệu `merchant-features.md` và cho việc chia plan thương mại.

Thư mục `document/` hiện đã có bộ tài liệu khởi đầu cho PM/dev handoff, gồm overview, merchant features, billing, operations, và pricing proposal.

Khi bắt đầu viết bộ docs chi tiết, nên tái sử dụng nội dung từ:

- `README.md`
- `production-ready-plan.md`
- `shopify-submission-checklist.md`
- `memory.md`
- repo memories trong `/memories/repo/`

nhưng cần chuẩn hóa lại ngôn ngữ và loại bỏ những ghi chú tạm thời chỉ phù hợp cho chat/debug session.