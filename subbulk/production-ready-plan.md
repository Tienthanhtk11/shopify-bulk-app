# SubBulk Production-Ready Plan

Updated: 2026-03-31

## Goal

Hoàn tất các hạng mục còn thiếu để đưa SubBulk từ trạng thái `đã dùng được nội bộ` sang trạng thái `MVP production-ready`, với trọng tâm là:

- hoàn thiện customer portal
- chốt billing reconciliation với dữ liệu Shopify live
- thêm regression coverage cho các flow quan trọng
- xác nhận browser-level trên production
- dọn các warning và tài liệu vận hành còn thiếu

## Current Baseline

Đã có sẵn và đang chạy production:

- storefront bulk pricing widget
- subscription + bulk discount stacking đúng ở checkout
- merchant data foundation và lifecycle events
- privacy deletion flow + background deletion runner
- billing snapshot + entitlement gate cơ bản
- standalone internal admin portal
- merchant operations, package operations, và internal admin accounts trong portal admin
- Docker deployment path ổn định qua `/home/krizpham/thanhpt-stack`

## Remaining Workstreams

### 1. Customer Portal Completion

Status: `done`

Mục tiêu:

- hoàn thiện luồng customer-facing để khách có thể xem và quản lý subscription một cách end-to-end

Phạm vi cần chốt:

- xem trạng thái subscription hiện tại
- pause / resume / cancel nếu scope sản phẩm yêu cầu
- hiển thị next billing / cadence / plan details rõ ràng
- xử lý empty state, lỗi Shopify API, và các trường hợp subscription không đồng bộ

Đầu ra mong muốn:

- customer portal route hoàn chỉnh
- UI states đầy đủ
- xác nhận bằng test hoặc manual verification script

Tiêu chí hoàn thành:

- user có thể hoàn tất các hành động chính mà không cần can thiệp DB thủ công
- portal không còn là partial implementation

### 2. Live Billing Reconciliation Hardening

Status: `blocked`

Mục tiêu:

- chốt mapping giữa billing state thực tế trên Shopify và internal `planKey`

Phạm vi cần chốt:

- thu thập live subscription GIDs / identifiers thực tế
- xác nhận mapping exact name + GID cho `free`, `growth`, `scale`
- kiểm tra reconciliation khi merchant đổi plan rồi quay lại app
- xác nhận entitlement update đúng sau plan change hoặc plan inactive

Đầu ra mong muốn:

- env mapping production hoàn chỉnh
- test coverage cho các case mapping quan trọng
- tài liệu vận hành khi đổi plan hoặc khi reconciliation sai

Tiêu chí hoàn thành:

- không còn phụ thuộc vào assumption hoặc dữ liệu giả cho plan mapping production

Blocker hiện tại:

- production DB hiện chỉ có 1 `MerchantPlan` snapshot do internal portal gán tay (`planKey=free`, `planName=Free`), chưa có live Shopify billing snapshot hoặc `shopifySubscriptionGid`
- live audit command hiện query được `currentAppInstallation.activeSubscriptions`, nhưng kết quả đang rỗng nên chưa có managed-pricing identifier thật để chốt `PARTNER_PLAN_*_GIDS`
- cần tạo hoặc kích hoạt một managed pricing subscription thật trên store đang gắn production backend, sau đó rerun live billing capture để điền `PARTNER_PLAN_*_GIDS` nếu Shopify trả subscription GIDs tương ứng

### 3. Regression Test Coverage For Critical Flows

Status: `in progress`

Mục tiêu:

- thêm coverage cho các flow đã thay đổi nhiều và có rủi ro regression cao

Ưu tiên test:

- merchant list -> merchant detail nested route behavior
- admin account create / update / delete actions
- merchant note add action
- billing gate và write gate
- package definition update flow

Đầu ra mong muốn:

- thêm unit/integration tests ở các service và route logic trọng yếu
- nếu phù hợp, thêm script manual verification checklist cho các flow UI khó test tự động

Tiêu chí hoàn thành:

- các bug kiểu hook-order, action response mismatch, hoặc entitlement regression có khả năng được chặn trước khi deploy

### 4. Production Browser Verification Round

Status: `in progress`

Mục tiêu:

- chạy một vòng kiểm thử trực tiếp trên production hoặc staging production-like để xác nhận các flow cốt lõi

Checklist verification:

- merchant embedded app vào được `/app`
- billing redirect / return flow hoạt động
- internal admin login hoạt động
- merchant list filter / click domain / click `Detail` hoạt động
- package save hiện toast và lưu đúng
- admin CRUD hiện toast và reset form đúng
- merchant note add hiện toast và reset form đúng
- deletion runner không lỗi sau deploy

Đầu ra mong muốn:

- một checklist pass/fail ngắn kèm timestamp

Tiêu chí hoàn thành:

- toàn bộ luồng chính đều được xác nhận bằng browser sau deploy gần nhất

### 5. Build Hygiene Cleanup

Status: `done`

Mục tiêu:

- dọn các warning build cũ để pipeline sạch hơn và giảm nhiễu khi theo dõi lỗi mới

Phạm vi cần chốt:

- xử lý `NODE_ENV=production` trong `.env`
- xử lý CSS minify warning quanh `@media (--p-breakpoints-md-up) and print`

Đầu ra mong muốn:

- `npm run build` sạch warning hoặc còn warning nhưng có lý do rõ ràng được tài liệu hóa

Tiêu chí hoàn thành:

- build output đủ sạch để dùng như signal đáng tin cho release

### 6. Production Ops Documentation Cleanup

Status: `done`

Mục tiêu:

- tinh gọn tài liệu để người tiếp quản hoặc chính team sau này có thể deploy, verify, và xử lý sự cố nhanh

Phạm vi cần chốt:

- chuẩn hóa README, memory, và deployment notes
- thêm mục rollback / log locations / health checks
- thêm checklist release ngắn

Đầu ra mong muốn:

- tài liệu ngắn, đúng hiện trạng, không còn lệch với deploy path thực tế

Tiêu chí hoàn thành:

- một kỹ sư mới có thể đọc docs và tự deploy + verify mà không cần hỏi lại lịch sử hội thoại

## Recommended Execution Order

1. Live Billing Reconciliation Hardening
2. Regression Test Coverage For Critical Flows
3. Customer Portal Completion
4. Build Hygiene Cleanup
5. Production Browser Verification Round
6. Production Ops Documentation Cleanup

Lý do thứ tự này:

- billing là nguồn sự thật cho entitlement và production correctness
- test coverage nên có trước khi đụng thêm các flow lớn của customer portal
- browser verification nên làm sau khi các thay đổi còn lại đã xong để tránh verify lặp nhiều lần

## Concrete Deliverables By Phase

### Phase A. Billing + Safety Net

- chốt env mapping production cho live plans
- thêm tests cho billing mapping, write gate, merchant route behavior
- xác nhận reconciliation sau plan change

### Phase B. Customer-Facing Completion

- hoàn thiện customer portal UX và actions
- bổ sung error states và loading states
- verify hành vi với dữ liệu subscription thật

### Phase C. Release Hardening

- dọn warning build
- chạy browser verification round đầy đủ
- chốt tài liệu deploy, rollback, health check

## Definition Of Done For MVP Production-Ready

SubBulk được coi là đạt mức MVP production-ready khi đồng thời thỏa các điều kiện sau:

- customer portal không còn partial cho các luồng subscription chính
- live billing mapping không còn phụ thuộc assumption chưa kiểm chứng
- các flow admin và billing quan trọng có regression coverage cơ bản
- production browser verification pass cho toàn bộ luồng chính
- build không còn warning kỹ thuật mơ hồ hoặc đã được giải thích rõ
- tài liệu deploy và vận hành phản ánh đúng đường chạy thật của hệ thống

## Suggested Tracking Format

Trạng thái theo dõi đề xuất cho từng workstream:

- `not started`
- `in progress`
- `blocked`
- `done`

Khi bắt đầu làm từng workstream, nên cập nhật thêm:

- owner
- file chính bị tác động
- command validate
- production verification result