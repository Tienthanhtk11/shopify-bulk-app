# Deployment And Operations

## Purpose

Tài liệu này mô tả cách build, deploy, smoke check, và rollback SubBulk trong môi trường hiện tại.

## Deployment Model

SubBulk có hai loại artifact phải hiểu tách biệt:

1. Self-hosted web app
- Shopify Remix backend
- embedded merchant app
- internal admin portal
- app proxy routes
- reconciliation routes

2. Shopify-hosted app version artifacts
- Customer Account UI extension
- theme app extension
- discount function
- các app extensions khác nằm trong `extensions/`

Điểm quan trọng:

- Docker deploy chỉ cập nhật self-hosted web app
- `shopify app deploy` mới release app version và extension bundles lên Shopify

## Production Infrastructure

Production stack hiện nằm ở:

- `/home/krizpham/thanhpt-stack`

Service chính:

1. `postgres`
2. `shopify_app`
3. `deletion_job_runner`
4. `caddy`

Ngoài SubBulk, cùng stack còn chứa ERP services, nên cần cẩn thận không ảnh hưởng phần còn lại khi thay đổi compose.

Source of truth: `/home/krizpham/thanhpt-stack/docker-compose.yml`, `/home/krizpham/thanhpt-stack/Caddyfile`

## Domains

Các domain hiện dùng:

1. `app.thanhpt.online`
2. `thanhpt.online`
3. `admin-app.thanhpt.online`

`app.thanhpt.online` và `thanhpt.online` reverse proxy về cùng service `shopify_app:3000`.

## Standard Commands

### Local build

```bash
cd /home/krizpham/shopify-bulk-app/subbulk
npm run build
```

### Local tests

```bash
cd /home/krizpham/shopify-bulk-app/subbulk
npm test
```

### Local dev

```bash
cd /home/krizpham/shopify-bulk-app/subbulk
npm run dev
```

### Production Docker deploy

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

### Release Shopify app version and extensions

```bash
cd /home/krizpham/shopify-bulk-app/subbulk
shopify app deploy --allow-updates --message "..."
```

### Billing audit

```bash
cd /home/krizpham/shopify-bulk-app/subbulk
npm run audit:billing-live
```

## When To Use Which Deploy Path

### Rebuild Docker only

Dùng khi thay đổi:

- Remix routes
- Prisma/runtime server code
- internal admin portal
- app proxy portal
- embedded app UI/server logic

### Run `shopify app deploy` only

Dùng khi thay đổi chỉ nằm ở:

- `extensions/sub-bulk-customer-account/**`
- `extensions/subbulk-buy-box/**`
- `extensions/subbulk-discount/**`

### Run both

Dùng khi một feature chạm cả backend và extension surfaces.

Ví dụ:

- thêm data mới cho customer account extension và cũng sửa server endpoint cấp dữ liệu cho extension
- sửa customer portal trên app proxy và đồng thời sửa Customer Account UI extension

## Smoke Checks

### HTTP smoke checks

```bash
curl -I https://app.thanhpt.online/auth/login
curl -I https://admin-app.thanhpt.online/admin/login
```

### Container health

```bash
cd /home/krizpham/thanhpt-stack
docker compose ps shopify_app
```

### Billing sanity

1. mở Billing page trong embedded app
2. xác minh current plan hiển thị đúng
3. nếu managed pricing đã publish, xác minh nút open pricing page hoạt động

### Customer surfaces sanity

1. app proxy portal mở được với context Shopify hợp lệ
2. Customer Account UI extension hiển thị được subscriptions
3. pause/resume/cancel vẫn hoạt động

## Special Operational Rules

### Customer Account UI extension

Thay đổi ở Customer Account UI extension sẽ không visible chỉ bằng Docker deploy. Phải release app version bằng Shopify CLI.

Đây là một trong các điểm dễ gây nhầm nhất khi debug production.

### Managed pricing

Billing page chỉ nên hiện link plan switching khi:

1. pricing content trong Partner Dashboard đã hoàn chỉnh
2. hosted pricing page không còn `404`
3. env `SHOPIFY_MANAGED_PRICING_READY` đã bật

### App proxy route checks

Không nên coi việc `curl` trực tiếp app proxy trả `400` là lỗi production, vì route này cần context/chữ ký từ Shopify.

## Background Jobs

Deletion flow đang chạy qua service `deletion_job_runner` trong Docker stack.

Ops cần nhớ:

1. nếu service này dừng, deletion requests có thể bị kẹt ở `pending` hoặc `processing`
2. khi điều tra deletion flow, phải kiểm tra cả logs của `shopify_app` và `deletion_job_runner`

## Rollback Model Today

Hiện chưa có release image tagging riêng cho `shopify_app`.

Rollback an toàn nhất hiện tại:

1. checkout revision cuối cùng đã biết ổn
2. rebuild lại `shopify_app` từ Docker stack
3. chạy smoke checks tối thiểu
4. nếu thay đổi trước đó có liên quan extensions, release lại app version tương ứng trên Shopify nếu cần

## Common Failure Modes

### 1. UI extension không đổi dù đã rebuild Docker

Nguyên nhân thường là chưa chạy `shopify app deploy`.

### 2. Merchant bị redirect về Billing bất ngờ

Nguyên nhân thường là:

- feature chưa thuộc plan
- billing status của plan paid đang inactive

### 3. Hosted pricing page bị `404`

Nguyên nhân thường là:

- pricing content chưa publish xong trong Partner Dashboard
- app handle hoặc locale setup chưa khớp

### 4. Payment method hoặc payment status không hiện như mong đợi

Nguyên nhân có thể là:

- shop chưa chấp nhận scope mới
- Shopify chưa có dữ liệu charge attempt cho contract đó

## Source Of Truth In Code And Infra

- app build/test commands: `package.json`
- compose stack: `/home/krizpham/thanhpt-stack/docker-compose.yml`
- reverse proxy: `/home/krizpham/thanhpt-stack/Caddyfile`
- managed pricing gating: `app/services/managed-pricing.server.ts`
- billing audit: `scripts/billing-live-audit.ts`

## Minimum Release Checklist

Trước mỗi release quan trọng, tối thiểu nên làm:

1. `npm run build`
2. `npm test`
3. xác định thay đổi này cần Docker deploy, Shopify app deploy, hay cả hai
4. deploy đúng loại artifact
5. chạy smoke checks cho login, billing, và surface vừa chạm
6. nếu chạm customer actions, test pause/resume/cancel end-to-end