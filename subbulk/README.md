# SubBulk

SubBulk là một Shopify app nội bộ, kết hợp 2 trục chính:

- subscription app kiểu Seal Subscriptions
- bulk pricing trên product page, đọc dữ liệu từ product metafield

Ngoài embedded merchant app, repo này còn có một standalone internal admin portal chạy dưới `admin-app.thanhpt.online` để vận hành merchant, package, và internal admin accounts.

## Current Status

Trạng thái hiện tại: dùng được thật cho nội bộ, đã deploy production bằng Docker, và các trục chính đã có nền vận hành.

Đã hoàn thành mức cơ bản:

- storefront bulk pricing widget
- Shopify discount stacking logic cho bulk + subscription
- merchant data model, lifecycle, event log, deletion requests
- billing snapshot + entitlement gate cơ bản
- async deletion runner
- standalone internal admin portal
- merchant operations trong admin portal
- package management trong admin portal
- internal admin account management

Chưa hoàn tất hoàn toàn để gọi là MVP production-ready khép kín:

- customer portal đã usable nhưng chưa được browser-verify đầy đủ cho toàn bộ lifecycle trên production mới nhất
- browser-level regression verification đầy đủ trên production
- exact live billing identifier mapping với Shopify production data

## Module Checklist

Checklist rất ngắn để bám tiến độ:

- Storefront widget + bulk pricing logic: `xong`
- Shopify discount stacking ở cart/checkout: `xong`
- Merchant data model + lifecycle + event log: `xong`
- Privacy deletion flow + background runner: `xong`
- Billing snapshot + entitlement gate cơ bản: `xong`
- Managed pricing entry/link từ merchant app: `xong`
- Customer portal subscription management: `xong mức cơ bản + đã có ownership guard server-side`
- Merchant embedded admin cho store operator: `xong mức cơ bản`
- Internal admin portal standalone: `xong mức cơ bản`
- Merchant operations trong admin portal: `xong mức cơ bản`
- Package management trong admin portal: `xong mức cơ bản`
- Internal admin account management: `xong mức cơ bản`
- Production deploy flow bằng Docker: `xong`
- Production browser-level regression verification đầy đủ: `chưa xong`
- Build hygiene và warning cleanup: `xong`

## Major Implemented Areas

### 1. Storefront + Checkout Pricing

- Widget storefront nằm trong theme extension `extensions/subbulk-buy-box`
- Bulk pricing đọc từ product metafield
- Subscription + bulk discount stacking đã được sửa đúng bằng Shopify Product Discount Function
- Final checkout pricing không còn bị sai khi cart line có selling plan

### 2. Merchant Data Foundation

Prisma đã có các nhóm dữ liệu chính:

- `Merchant`
- `MerchantPlan`
- `MerchantEvent`
- `MerchantDataDeletionRequest`
- `AdminPlanDefinition`
- `InternalAdminAccount`
- các bảng subscription/widget settings của app

### 3. Billing + Entitlements

- có billing snapshot nội bộ cho merchant
- có entitlement matrix cho `Free`, `Growth`, `Scale`
- có route-level và action-level write gating
- có managed pricing entry qua `SHOPIFY_MANAGED_PRICING_APP_HANDLE`
- có reconciliation route để refresh billing state khi merchant quay lại app

### 4. Privacy + Background Jobs

- merchant có thể tạo deletion request
- deletion request đi qua trạng thái `pending -> processing -> completed/failed`
- background processing chạy qua route `/jobs/deletion-requests`
- Docker stack có `deletion_job_runner` gọi job route theo chu kỳ

### 5. Internal Admin Portal

Portal admin standalone dùng cookie auth riêng, không phụ thuộc embedded Shopify auth.

Các màn chính:

- `/admin/login`
- `/admin`
- `/admin/merchants`
- `/admin/merchants/:merchantId`
- `/admin/subscriptions`
- `/admin/admins`

Các capability hiện có:

- tìm kiếm và lọc merchant
- click domain merchant hoặc nút `Detail` để mở merchant detail
- tạo merchant thủ công
- export merchant XML
- cập nhật merchant status
- assign package snapshot
- thêm internal note
- chỉnh package definitions từ DB
- tạo/sửa/xóa internal admin account

Các cập nhật UX gần nhất đã lên production:

- merchant list dùng nested route thật cho merchant detail
- fix crash React khi navigate client-side vào merchant detail
- package screen dùng toast thay cho banner cứng
- save button rõ ràng hơn và có trạng thái `Saving...`
- internal admin account actions dùng toast + reset form
- merchant detail note dùng toast + reset form

## Production Deployment

### Nguồn sự thật để deploy backend

Lưu ý quan trọng:

- `shopify app deploy` chỉ publish app version và extension lên Shopify
- nó không deploy backend Remix tự host của repo này

Muốn code backend hoặc admin portal lên production, phải rebuild Docker stack tại:

- `/home/krizpham/thanhpt-stack`

Lệnh deploy thực tế:

```bash
cd /home/krizpham/thanhpt-stack
docker compose up -d --build shopify_app
```

Container backend production hiện tại:

- `thanhpt-shopify_app-1`

Portal admin production:

- `admin-app.thanhpt.online`

App production dùng chung container backend với merchant embedded app.

## Local Development

### Prerequisites

- Node.js phù hợp với `package.json`
- npm
- Shopify CLI
- PostgreSQL

### Useful Commands

```bash
npm install
npm run build
npm test
npx prisma generate
npm run dev
```

Nếu cần start production-style local server sau khi build:

```bash
npm run setup
npm run start
```

## Important Environment Variables

### Billing / plan mapping

- `PARTNER_PLAN_FREE_NAMES`
- `PARTNER_PLAN_GROWTH_NAMES`
- `PARTNER_PLAN_SCALE_NAMES`
- `PARTNER_PLAN_FREE_GIDS`
- `PARTNER_PLAN_GROWTH_GIDS`
- `PARTNER_PLAN_SCALE_GIDS`
- `SHOPIFY_MANAGED_PRICING_APP_HANDLE`

### Background jobs

- `JOB_RUNNER_SECRET`
- `DELETION_JOB_INTERVAL_SECONDS`

### Internal admin portal

- `INTERNAL_ADMIN_SESSION_SECRET`

Lưu ý:

- internal admin accounts hiện đã nằm trong DB
- không còn nên dùng `INTERNAL_ADMIN_PORTAL_ACCOUNTS` như nguồn auth runtime chính

## Known Gaps Before MVP Production-Ready

Đây là những hạng mục còn thiếu quan trọng nhất:

1. chưa có vòng browser regression đầy đủ trên production cho các flow chính sau deploy mới nhất
2. billing reconciliation với live Shopify identifiers chưa chốt sạch bằng production data thật
3. production store hiện query được `currentAppInstallation.activeSubscriptions` nhưng đang trả rỗng, nên chưa có live paid subscription identifier để điền `PARTNER_PLAN_*_GIDS`
4. admin flow mới chưa có test coverage đủ sâu cho regression prevention
5. chưa có release tagging/rollback workflow riêng ngoài redeploy từ source revision trước đó

## Ops Quick Reference

### Deploy backend production

```bash
cd /home/krizpham/thanhpt-stack
docker compose up -d --build shopify_app
```

### Check runtime status

```bash
cd /home/krizpham/thanhpt-stack
docker compose ps
docker compose logs --tail=200 shopify_app
docker compose logs --tail=200 deletion_job_runner
```

### Minimal HTTP smoke checks

```bash
curl -I https://app.thanhpt.online/auth/login
curl -I https://admin-app.thanhpt.online/admin/login
```

### Live billing audit

```bash
npm run audit:billing-live
```

Nếu Postgres không reachable từ host với `DATABASE_URL` mặc định, chạy command với `DATABASE_URL` override tới DB thực tế trước khi audit.

Lưu ý:

- app proxy customer portal `/apps/subbulk/portal` cần request có context/chữ ký từ Shopify; gọi thẳng bằng `curl` có thể trả `400` là bình thường
- smoke check production gần nhất sau deploy mới đã xác nhận `app.thanhpt.online/auth/login` và `admin-app.thanhpt.online/admin/login` trả `200`

### Rollback hiện tại

Hiện chưa có release image tagging riêng cho `shopify_app`.

Rollback an toàn nhất lúc này là:

1. checkout source revision cuối cùng đã biết là ổn trong `/home/krizpham/shopify-bulk-app/subbulk`
2. rebuild lại từ `/home/krizpham/thanhpt-stack`
3. chạy lại minimal smoke checks ở trên

## Notes For Future Changes

- Khi sửa `app/routes/admin.merchants.tsx`, phải giữ tất cả hooks ở trên nhánh `if (merchantId) return <Outlet />` để tránh lặp lại lỗi hook order trên production.
- Khi sửa admin portal routes, nhớ rằng source edit chỉ có hiệu lực sau khi rebuild `shopify_app` từ Docker stack.
- Khi sửa `app/routes/apps.subbulk.portal.tsx`, phải luôn xác minh `contractId` thực sự thuộc `logged_in_customer_id` ở server side trước khi gọi pause/resume/cancel mutation.
- Embedded/admin login hiện tải Polaris từ `/public/polaris-styles.css`, là bản vá tĩnh sinh từ Polaris upstream để tránh warning build custom-media của vendor CSS.
- `app/db.server.ts` phải resolve Prisma runtime theo cả hai layout source/build; hiện code thử lần lượt `../generated/prisma/client` rồi `../../generated/prisma/client` để tương thích cả local runtime script lẫn SSR bundle production.
- `npm run audit:billing-live` là command chuẩn để kiểm tra offline session, latest `MerchantPlan`, `billing.%unmapped%` events, và live `currentAppInstallation.activeSubscriptions` trong một lần chạy.
- Project memory chi tiết hơn hiện được lưu tại `memory.md` trong thư mục này và repo memory nội bộ của Copilot.

- [Shopify App Remix](https://shopify.dev/docs/api/shopify-app-remix) provides authentication and methods for interacting with Shopify APIs.
- [Shopify App Bridge](https://shopify.dev/docs/apps/tools/app-bridge) allows your app to seamlessly integrate your app within Shopify's Admin.
- [Polaris React](https://polaris.shopify.com/) is a powerful design system and component library that helps developers build high quality, consistent experiences for Shopify merchants.
- [Webhooks](https://github.com/Shopify/shopify-app-js/tree/main/packages/shopify-app-remix#authenticating-webhook-requests): Callbacks sent by Shopify when certain events occur
- [Polaris](https://polaris.shopify.com/): Design system that enables apps to create Shopify-like experiences

## Resources

- [Remix Docs](https://remix.run/docs/en/v1)
- [Shopify App Remix](https://shopify.dev/docs/api/shopify-app-remix)
- [Introduction to Shopify apps](https://shopify.dev/docs/apps/getting-started)
- [App authentication](https://shopify.dev/docs/apps/auth)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [App extensions](https://shopify.dev/docs/apps/app-extensions/list)
- [Shopify Functions](https://shopify.dev/docs/api/functions)
- [Getting started with internationalizing your app](https://shopify.dev/docs/apps/best-practices/internationalization/getting-started)
