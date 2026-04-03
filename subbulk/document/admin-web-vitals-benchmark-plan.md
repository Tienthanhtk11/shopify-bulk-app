# Admin Web Vitals Benchmark Plan

## Goal

Tài liệu này mô tả cách benchmark trước submission cho 4 route embedded chính của SubBulk trên VM hiện tại.

Mục tiêu là tạo một `lab gate` nội bộ trước khi dựa vào field data của Shopify Partner Dashboard.

## Important Constraint

Shopify đánh giá Built for Shopify admin performance theo `field data`:

- p75 trong 28 ngày
- cần ít nhất 100 calls cho từng metric
- metric lấy từ embedded admin experience thật

Vì vậy benchmark trên VM không thay thế được Partner Dashboard. Nó chỉ dùng để:

- phát hiện bottleneck trước submission
- so sánh trước/sau khi tối ưu
- ngăn regression trước release

## Routes In Scope

Benchmark 4 route embedded chính sau:

1. `/app/analytics`
2. `/app/subscriptions`
3. `/app/settings`
4. `/app/billing`

Trong script benchmark, các route này được gọi thông qua embedded admin base URL, ví dụ:

`https://admin.shopify.com/store/<store-handle>/apps/<app-handle>`

Script sẽ tự append các suffix:

- `/analytics`
- `/subscriptions`
- `/settings`
- `/billing`

## Metrics And Thresholds

### Shopify targets

- LCP < 2500 ms
- CLS < 0.1
- INP < 200 ms

### Recommended internal lab targets

Để có safety margin trước field data thật, nên dùng target nội bộ chặt hơn:

- LCP < 2200 ms
- CLS < 0.05
- INP < 150 ms

## Why These Routes

### Analytics

Rủi ro chính:

- data-heavy cards
- aggregated metrics
- nhiều khối nội dung cùng render

Interaction benchmark:

- click nav link `Subscriptions`

### Subscriptions

Rủi ro chính:

- list rendering
- search/filter/sort interactions
- badges/status pills

Interaction benchmark:

- click filter `Active`
- gõ vào ô search

### Settings

Rủi ro chính:

- nhiều controlled inputs
- rerender khi typing
- live preview cập nhật theo state

Interaction benchmark:

- gõ vào `Widget heading`

### Billing

Rủi ro chính:

- nhiều cards và plan matrix
- banners/visibility states
- shell navigation cost

Interaction benchmark:

- click nav link `Settings`

## VM Benchmark Strategy

### Mode

Chạy benchmark trong browser profile có login Shopify Admin sẵn.

Lý do:

- embedded app performance phải đo trong admin thật
- app proxy / embedded shell / app bridge behavior chỉ đại diện khi vào từ admin thật

### Browser profile

Script hỗ trợ persistent `userDataDir` cho Chrome/Chromium profile.

Khuyến nghị:

1. chạy lần đầu ở chế độ headful
2. login thủ công vào Shopify admin
3. để script reuse lại profile này cho các lần sau

## Setup

### Install dependencies

```bash
cd /home/krizpham/shopify-bulk-app/subbulk
npm install --prefix ./.bench-tools puppeteer
```

Lý do dùng `.bench-tools`:

- tránh đụng `node_modules` chính của project nếu VM có issue ownership/permissions
- script đã hỗ trợ tự load Puppeteer từ `.bench-tools/node_modules`

### First run with manual login

```bash
cd /home/krizpham/shopify-bulk-app/subbulk
SHOPIFY_BENCH_BASE_URL="https://admin.shopify.com/store/<store-handle>/apps/<app-handle>" \
SHOPIFY_BENCH_HEADLESS=false \
SHOPIFY_BENCH_USER_DATA_DIR="$PWD/.bench/chrome-profile" \
npm run bench:admin-vitals
```

Script sẽ mở browser, cho phép login thủ công, rồi chờ anh nhấn Enter ở terminal để tiếp tục.

### Repeat run after login is saved

```bash
cd /home/krizpham/shopify-bulk-app/subbulk
SHOPIFY_BENCH_BASE_URL="https://admin.shopify.com/store/<store-handle>/apps/<app-handle>" \
SHOPIFY_BENCH_HEADLESS=true \
SHOPIFY_BENCH_USER_DATA_DIR="$PWD/.bench/chrome-profile" \
SHOPIFY_BENCH_ITERATIONS=7 \
npm run bench:admin-vitals
```

## Environment Variables

### Required

- `SHOPIFY_BENCH_BASE_URL`

Ví dụ:

`https://admin.shopify.com/store/test-shop/apps/subscription-bulk-app/app`

### Optional

- `SHOPIFY_BENCH_HEADLESS`
- `SHOPIFY_BENCH_USER_DATA_DIR`
- `SHOPIFY_BENCH_ITERATIONS`
- `SHOPIFY_BENCH_WAIT_AFTER_LOAD_MS`
- `SHOPIFY_BENCH_WAIT_AFTER_INTERACTION_MS`
- `SHOPIFY_BENCH_OUTPUT_DIR`
- `PUPPETEER_EXECUTABLE_PATH`
- `SHOPIFY_BENCH_DISABLE_LOGIN_PROMPT`

## Output

Script sẽ tạo file JSON trong:

- `document/benchmark-results/`

Mỗi route sẽ có:

- số lần chạy
- p75 của LCP/CLS/INP
- pass/fail theo threshold Shopify
- số liệu từng run để dễ diff trước/sau tối ưu

## How To Read Results

### If only one route fails

Tập trung tối ưu route đó trước, không cần chạm toàn app ngay.

### If CLS fails

Kiểm tra:

- banner render muộn
- card height đổi sau load
- font/layout shift
- async text blocks đẩy nội dung xuống

### If LCP fails

Kiểm tra:

- blocking font/css
- data fetch chậm ở loader
- quá nhiều card/list render đồng thời
- route shell nặng trước khi paint chính

### If INP fails

Kiểm tra:

- controlled inputs rerender quá nhiều
- list filtering/sorting làm JS block main thread
- interaction kích hoạt nhiều component update cùng lúc

## Recommended Routine Before Submission

1. chạy benchmark 5 vòng ở VM
2. sửa hotspot lớn nhất
3. chạy lại 7 đến 10 vòng
4. chỉ khi p75 lab ổn định mới bắt đầu giai đoạn field-data warm-up trên Shopify

## Suggested Internal Gate

Chỉ nên cân nhắc submission khi cả 4 route đều đạt ít nhất:

- LCP p75 < 2200 ms
- CLS p75 < 0.05
- INP p75 < 150 ms

Nếu chỉ vừa đủ sát ngưỡng Shopify, rủi ro field data fail vẫn còn cao.

## Source Of Truth

- benchmark script: `scripts/admin-web-vitals-benchmark.mjs`
- embedded shell: `app/routes/app.tsx`
- benchmarked pages:
  - `app/routes/app.analytics.tsx`
  - `app/routes/app.subscriptions.tsx`
  - `app/routes/app.settings.tsx`
  - `app/routes/app.billing.tsx`