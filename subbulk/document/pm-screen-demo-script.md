# Kịch Bản Quay Screen Demo Cho PM

## Mục tiêu video

Video này cần cover đủ 4 yêu cầu PM:

1. Main features: merchant app, internal portal, storefront widget.
2. Billing flow: merchant chọn plan và accept charge.
3. 404 issue: nếu gặp 404 thì mở Inspect > Network, bật Preserve log để giữ request trace.
4. Mobile & browsers: quay nhanh trên mobile viewport, Chrome, và Safari.

Mục tiêu tốt nhất là ra một video khoảng 8 đến 12 phút, quay liền mạch, ít cắt, ưu tiên chứng minh hệ thống đang chạy end-to-end hơn là dựng video quá đẹp.

## Tóm tắt sản phẩm để nói mở đầu

Có thể dùng phần mở đầu này gần như nguyên văn:

> Đây là SubBulk, một Shopify app self-hosted kết hợp ba lớp chính. Thứ nhất là embedded merchant app trong Shopify Admin để merchant cấu hình billing, subscriptions, rules và widget settings. Thứ hai là internal admin portal để team vận hành quản lý merchant, package và admin access. Thứ ba là storefront layer gồm theme widget trên product page, Shopify discount logic và customer self-service surfaces.

## Các surface thực tế trong repo

Để tránh nói sai khi quay, đây là các surface đang có thật trong code:

- Merchant embedded app: `/app/analytics`, `/app/billing`, `/app/subscriptions`, `/app/subscription-rule`, `/app/settings`, `/app/privacy`
- Widget products flow: `/app/widget-products`
- Billing return flow: `/app/welcome`
- App proxy customer portal: `/apps/subbulk/portal`
- Customer Account endpoint: `/apps/subbulk/customer-account/subscriptions`
- Internal admin portal: `/admin`, `/admin/merchants`, `/admin/subscriptions`, `/admin/admins`

## Chuẩn bị trước khi quay

### 1. Chuẩn bị data và môi trường

Trước khi bấm record, nên kiểm tra:

- Merchant app login được trong dev store.
- Internal admin portal login được.
- Có ít nhất 1 store đã cài app và có dữ liệu merchant snapshot.
- Có ít nhất 1 sản phẩm đã được add vào danh sách widget-enabled products.
- Nếu muốn quay storefront widget đẹp, nên có 1 product page đã gắn block `SubBulk purchase options` trong theme editor.
- Nếu muốn quay customer-facing self-service, nên có sẵn ít nhất 1 subscription contract trong store.

### 2. Chuẩn bị browser và cửa sổ

- Dùng Chrome làm browser chính để quay demo đầy đủ.
- Mở sẵn DevTools nhưng chưa dock nếu muốn giữ màn hình sạch lúc đầu.
- Mở sẵn một tab Shopify Admin merchant app.
- Mở sẵn một tab internal portal.
- Mở sẵn một tab storefront product page có widget.
- Nếu quay app proxy portal hoặc customer account extension, mở sẵn tab customer side.

### 3. Chuẩn bị cho phần 404 debug

Quan trọng: nếu PM muốn xem 404 khi billing flow chạy local, đừng quay lại từ đầu. Cứ giữ nguyên recording và làm đúng flow debug sau:

1. Mở DevTools.
2. Chuyển sang tab Network.
3. Tick `Preserve log`.
4. Reproduce lại click mở billing hoặc accept charge.
5. Click request bị 404.
6. Show rõ URL, status code, redirect chain, request headers, response headers nếu có.

### 4. Chuẩn bị cho clip Safari

Máy Linux hiện tại không chạy Safari native. Vì vậy clip Safari nên được quay riêng trên Mac hoặc BrowserStack nếu PM bắt buộc cần thấy Safari thật.

Trong script này tôi vẫn để sẵn đoạn nói và shot list cho Safari để anh có thể quay bổ sung sau.

## Cấu trúc video đề xuất

Đề xuất timeline:

1. Intro và product map: 30 đến 45 giây
2. Merchant app main features: 3 đến 4 phút
3. Internal admin portal: 1.5 đến 2 phút
4. Storefront widget: 1 đến 1.5 phút
5. Billing flow và accept charge: 1.5 đến 2 phút
6. 404 debug branch nếu xảy ra: 1 đến 2 phút
7. Mobile và browsers: 45 đến 90 giây
8. Kết: 15 giây

## Shot-by-shot script chi tiết

## Phần 1. Intro

### Mục tiêu

Đặt context thật nhanh để PM hiểu đây không phải chỉ là một màn admin đơn lẻ.

### Thao tác

1. Bắt đầu ở tab merchant app hoặc một note ngắn có tên dự án.
2. Phóng to vừa phải để text dễ đọc.
3. Nói 20 đến 30 giây đầu về 3 surface chính.

### Lời thoại gợi ý

> Trong demo này tôi sẽ đi qua ba nhóm chính của SubBulk. Đầu tiên là merchant embedded app trong Shopify Admin. Thứ hai là internal operations portal cho team nội bộ. Thứ ba là storefront widget và customer-facing subscription surfaces. Sau đó tôi sẽ show billing flow, nếu có 404 tôi sẽ giữ nguyên recording và mở Network tab với Preserve log để debug luôn.

## Phần 2. Merchant App Main Features

### Mục tiêu

Chứng minh merchant app có các trục chính: analytics, subscriptions, rules, widget products/settings, billing.

### Thứ tự quay khuyến nghị

Quay theo thứ tự này để mạch logic rõ:

1. Analytics
2. Subscriptions
3. Subscription rule
4. Widget products
5. Settings
6. Billing

### 2.1 Analytics

#### Mở màn

- Vào `Analytics` từ nav bên trái hoặc nav embedded.
- Dừng 3 đến 5 giây để PM đọc overview cards.

#### Điểm cần chỉ

- Tổng subscriptions
- Active, paused, cancelled
- Merchant có một dashboard để theo dõi health subscription business

#### Lời thoại gợi ý

> Đây là merchant-facing analytics dashboard. Merchant có thể xem tổng số contracts, active, paused, cancelled và dùng nó như một operational snapshot để theo dõi health của subscription business.

### 2.2 Subscriptions

#### Mở màn

- Chuyển sang `Subscriptions`.
- Show khu vực cards đầu trang và bảng danh sách contract.

#### Điểm cần chỉ

- Search theo customer, email, contract id, product title
- Filter theo status
- Sort theo next billing date hoặc created date
- Payment method summary
- Last payment status khi Shopify đã có dữ liệu

#### Thao tác cụ thể

1. Click filter status, ví dụ `ACTIVE` rồi quay lại `ALL`.
2. Gõ một query mẫu vào ô search.
3. Chỉ vào một row và nói rõ payment method / payment status.

#### Lời thoại gợi ý

> Ở phần Subscriptions, merchant có thể search, filter và sort các contract hiện có. Mỗi contract có next billing date, created date, quantity, payment method summary và last payment status nếu Shopify đã ghi nhận billing attempt.

### 2.3 Subscription Rule

#### Mở màn

- Chuyển sang `Subscription rule`.

#### Điểm cần chỉ

- Rule title
- Internal name
- Plan selector label
- Multiple intervals
- Discount type và discount value
- Explicit product scope
- Đồng bộ selling plan group lên Shopify

#### Thao tác cụ thể

1. Scroll từ trên xuống để PM thấy rule builder không chỉ là một form nhỏ.
2. Chỉ vào các interval như monthly hoặc weekly.
3. Nếu có nút save/sync, chỉ vào nhưng không nhất thiết phải submit nếu data live đang ổn.

#### Lời thoại gợi ý

> Đây là rule builder cho subscription experience. Merchant có thể định nghĩa nhiều interval, chọn percentage hoặc fixed discount, set label hiển thị cho storefront và sync cấu hình này thành selling plan group trên Shopify.

### 2.4 Widget Products

#### Mở màn

- Mở trực tiếp `/app/widget-products` nếu menu không expose sẵn.

#### Điểm cần chỉ

- Resource picker flow để chọn sản phẩm
- Danh sách widget-enabled products
- Không add trùng sản phẩm
- Bulk pricing JSON theo từng sản phẩm
- Deep link từ Discounts admin về đúng màn này

#### Thao tác cụ thể

1. Show ít nhất một sản phẩm đã nằm trong danh sách.
2. Nếu an toàn, mở bulk pricing editor cho một sản phẩm.
3. Chỉ vào JSON tiers để PM hiểu widget lấy data theo product.

#### Lời thoại gợi ý

> Ở màn Widget products, merchant chọn sản phẩm nào sẽ bật SubBulk widget. Với từng sản phẩm, hệ thống lưu bulk pricing JSON và tránh duplicate nếu merchant add lại cùng product.

### 2.5 Settings

#### Mở màn

- Chuyển sang `Settings`.

#### Điểm cần chỉ

- Heading widget
- Purchase options label
- Footer text
- Free shipping note
- Màu primary và accent
- Font family
- Border radius / thickness
- Toggle savings badge, compare-at price, subscription details
- Live preview
- Link mở theme editor

#### Thao tác cụ thể

1. Scroll chậm từ controls xuống live preview.
2. Nếu muốn làm video sinh động, đổi tạm một màu hoặc text ngắn rồi save, sau đó show preview thay đổi.
3. Chỉ vào nút mở theme editor nếu có.

#### Lời thoại gợi ý

> Đây là phần widget customization. Merchant có thể chỉnh copy, màu, font, badge, compare-at price và xem preview ngay trong app trước khi publish ra storefront.

### 2.6 Billing

#### Mở màn

- Chuyển sang `Billing`.

#### Điểm cần chỉ

- Current plan
- Latest billing status
- Plan cards
- Managed pricing ready hay chưa ready
- Trạng thái fallback test charge nếu local/dev đang dùng

#### Lời thoại gợi ý

> Billing page là nơi merchant thấy current plan, latest billing status và các package khả dụng. Nếu Shopify managed pricing đã publish thì merchant sẽ được đưa sang Shopify-hosted pricing page. Nếu local/dev chưa publish xong thì hệ thống có thể dùng test billing fallback để vẫn demo được accept charge flow.

## Phần 3. Internal Admin Portal

### Mục tiêu

Chứng minh team nội bộ có một portal tách biệt với embedded app để vận hành merchant và package.

### Thứ tự quay khuyến nghị

1. Dashboard `/admin`
2. Merchants `/admin/merchants`
3. Packages `/admin/subscriptions`
4. Nếu còn thời gian, lướt `Admins`

### 3.1 Admin Dashboard

#### Điểm cần chỉ

- Systems Operational overview
- Traffic / active sessions / blocked paid / telemetry feed
- Đây là surface nội bộ, không phải merchant-facing

#### Lời thoại gợi ý

> Đây là internal operations dashboard. Nó tách biệt khỏi merchant app và được dùng cho monitoring nhanh: số merchant, active sessions, blocked paid merchants và recent events.

### 3.2 Merchants

#### Điểm cần chỉ

- Merchant intelligence list
- Filter theo status và package
- Search merchant theo domain hoặc email
- Merchant detail drill-down
- Nút export XML và new merchant intake

#### Thao tác cụ thể

1. Gõ query vào ô search.
2. Đổi status filter hoặc package filter.
3. Mở một merchant detail nếu data live ổn định.

#### Lời thoại gợi ý

> Ở portal nội bộ, team vận hành có thể tìm merchant, filter theo trạng thái, xem plan hiện tại và mở detail workspace cho từng store. Đây là lớp quản trị nội bộ, không nằm trong pricing plan bán cho merchant.

### 3.3 Packages

#### Điểm cần chỉ

- Free / Premium / Ultra package cards
- Monthly và yearly pricing
- Visibility toggle
- Assigned merchants table

#### Lời thoại gợi ý

> Trang Packages cho internal team quản lý commercial package definitions, merchant coverage và visibility của plan catalog. Đây là nơi map giữa merchant-facing plans và entitlement logic trong hệ thống.

## Phần 4. Storefront Widget

### Mục tiêu

Chứng minh merchant configuration thực sự đi ra storefront, không dừng ở admin.

### Nên quay ở đâu

- Một product page ngoài storefront đã gắn block `SubBulk purchase options`
- Nếu có thể, chọn một sản phẩm có bulk tiers và selling plans thật

### Điểm cần chỉ

- Widget hiển thị trong product section
- Bulk pricing tiers
- One-time purchase và subscribe-and-save
- Giá preview / compare-at / savings badge
- Text và màu sắc phản ánh settings merchant vừa cấu hình

### Thao tác cụ thể

1. Refresh product page để PM thấy widget load tự nhiên.
2. Đổi quantity hoặc chọn option mua nếu UI đang hỗ trợ ngay trên theme.
3. Chỉ vào copy, badge, note, plan selector.

### Lời thoại gợi ý

> Đây là storefront widget render trên product page qua theme app extension. Merchant control toàn bộ phần copy, màu sắc và display options trong embedded app, còn bulk pricing tiers và selling plan data được áp dụng ở đây để buyer thấy trải nghiệm mua rõ ràng hơn.

### Câu nói nên thêm nếu muốn tăng độ tin cậy

> Như vậy luồng merchant config không dừng ở admin UI. Nó thực sự đi ra storefront layer.

## Phần 5. Billing Flow Và Merchant Accept Charge

### Mục tiêu

Đây là phần PM yêu cầu rõ nhất, nên quay chậm và không cắt nếu có thể.

### Có 2 nhánh quay

Tùy môi trường hiện tại mà anh chọn 1 trong 2 nhánh dưới đây.

### Nhánh A. Managed pricing đã sẵn sàng

Dùng khi Billing page có nút `Open Shopify pricing page` hoặc `Change to this plan`.

#### Thao tác

1. Từ merchant app, mở `Billing`.
2. Chỉ current plan hiện tại.
3. Click `Open Shopify pricing page` hoặc nút đổi plan.
4. Trên trang Shopify-hosted pricing, chọn plan cần demo.
5. Click accept / approve charge.
6. Để Shopify redirect quay lại `/app/welcome`.
7. Ở màn `Billing welcome`, chỉ rõ reconciliation đã complete.
8. Click `Open billing` để quay về Billing page và cho PM thấy current plan/status đã cập nhật.

#### Lời thoại gợi ý

> Đây là luồng production billing dự kiến. Merchant đi từ Billing page trong app sang Shopify-hosted pricing page, approve charge ở đó, rồi quay lại Billing welcome để hệ thống reconcile Shopify billing state về internal merchant snapshot.

### Nhánh B. Managed pricing chưa publish, dùng manual test billing fallback

Dùng khi Billing page đang hiện khối `Manual test billing fallback is active` và các nút như `Start monthly test charge`.

#### Thao tác

1. Từ `Billing`, chỉ rõ banner test fallback.
2. Nói đây là test-only path cho local/dev store.
3. Click `Start monthly test charge` hoặc `Start annual test charge` ở Premium hoặc Ultra.
4. Shopify mở confirmation page.
5. Merchant accept charge.
6. Sau redirect, show màn `Billing welcome`.
7. Chỉ vào badge reconciliation reason và latest internal plan.
8. Quay lại Billing để show current plan mới.

#### Lời thoại gợi ý

> Trong local hoặc dev store, nếu managed pricing chưa publish hoàn chỉnh, app có test fallback để vẫn demo được flow accept charge. Charge này là test charge của Shopify Billing API, sau khi merchant approve thì hệ thống vẫn quay về Billing welcome và reconcile state giống production path.

### Điểm cần nhấn mạnh khi quay billing

- `Billing welcome` là return destination để đồng bộ billing state về DB nội bộ.
- Current plan và billing status không chỉ là text tĩnh, nó phụ thuộc snapshot reconciliation.
- Nếu plan paid inactive thì feature gating sẽ khóa các route cần entitlement paid.

## Phần 6. Nếu Gặp 404 Trong Billing Flow

### Mục tiêu

PM yêu cầu rõ: nếu 404 xuất hiện thì cần network log để xác định đó có phải config issue local hay không.

### Kịch bản nên nói ngay khi lỗi xuất hiện

> Tôi đang giữ nguyên recording và mở Network tab để capture redirect chain. Tôi sẽ bật Preserve log, reproduce lại request, rồi show request nào trả 404 để phân biệt đây là code issue hay là managed pricing/config issue trong môi trường local.

### Thao tác bắt buộc

1. Mở `Inspect`.
2. Chuyển sang `Network`.
3. Tick `Preserve log`.
4. Clear log một lần cho sạch.
5. Re-run click mở pricing page hoặc accept charge.
6. Lọc theo `Doc` hoặc `Fetch/XHR` nếu cần.
7. Click request bị `404`.
8. Show các mục sau:
   - Request URL
   - Status code
   - Initiator
   - Redirect chain
   - Response headers nếu có

### Điều cần nói để PM hiểu đúng

> Nếu request 404 nằm ở Shopify-hosted pricing page hoặc redirect target của Shopify, khả năng cao đây là managed pricing readiness hoặc local configuration issue, không nhất thiết là bug ở route embedded app. Billing page trong app đã có guard để tránh show link khi managed pricing chưa được mark ready, nhưng ở local flow vẫn cần nhìn vào request chain để chốt nguyên nhân.

### Những nguyên nhân hợp lý để nói trên video nếu thấy 404

- Managed pricing content chưa publish xong trong Partner Dashboard
- App handle hoặc locale chưa khớp
- Store chưa có quyền thấy private pricing plan
- Redirect target đang đúng logic nhưng môi trường local chưa đủ config Shopify side

## Phần 7. Mobile Demo

### Mục tiêu

Cho PM thấy UI không vỡ ở mobile, đặc biệt ở storefront widget hoặc customer portal.

### Thứ tự khuyến nghị

1. Dùng Chrome DevTools device toolbar.
2. Chuyển sang iPhone 12 hoặc iPhone 14 viewport.
3. Demo storefront widget trước.
4. Nếu có dữ liệu, demo thêm app proxy customer portal `/apps/subbulk/portal`.

### Điểm cần chỉ

- Widget vẫn nằm gọn trong product layout
- Text không tràn
- Buttons còn bấm được
- Subscription cards hoặc portal cards vẫn đọc được

### Lời thoại gợi ý

> Đây là quick mobile check bằng browser inspect tool. Tôi đang chuyển sang mobile viewport để xác nhận storefront widget và customer-facing surfaces vẫn giữ được layout, spacing và thao tác cơ bản.

## Phần 8. Browser Coverage

### Chrome

Chrome là browser chính để quay full demo. Chỉ cần nói ngắn:

> Phần lớn demo này đang được quay trên Chrome vì đây cũng là browser thuận tiện nhất để inspect billing redirects và network trace.

### Safari

Vì máy Linux không có Safari native, nên clip Safari nên được quay riêng trên Mac. Kịch bản cho clip Safari chỉ cần 20 đến 30 giây:

1. Mở cùng product page storefront.
2. Refresh page.
3. Show widget load ổn.
4. Nếu có thể, mở merchant app hoặc portal một màn ngắn.

Lời thoại gợi ý:

> Đây là quick Safari pass để xác nhận surface chính vẫn render ổn ngoài Chrome. Mục tiêu ở đây là browser sanity check, không cần lặp lại toàn bộ flow billing.

## Phần 9. Kết Video

### Lời kết gợi ý

> Tóm lại, SubBulk hiện có merchant embedded app cho cấu hình và vận hành, internal portal cho team nội bộ, storefront widget cho buyer-facing experience, cùng billing flow có thể đi qua Shopify-hosted pricing hoặc test fallback tùy môi trường. Nếu có 404 trong billing, Network Preserve log sẽ là cách nhanh nhất để phân biệt config issue với product bug.

## Checklist thao tác nhanh để quay mượt

- Tắt notification desktop trước khi quay.
- Zoom browser khoảng 110% đến 125% nếu text nhỏ.
- Pin sẵn 3 tab: merchant, admin portal, storefront.
- Chỉ dùng một dev store xuyên suốt video để câu chuyện liền mạch.
- Nếu billing dễ fail, quay sẵn một take merchant features trước, sau đó quay billing take riêng.
- Nếu 404 xuất hiện, không dừng recording, chuyển thẳng sang Network debug.

## Runbook quay nhanh 1 take

Nếu anh muốn quay rất nhanh theo thứ tự tối ưu, đi đúng chuỗi này:

1. Intro 20 giây.
2. Merchant app: Analytics -> Subscriptions -> Subscription rule -> Widget products -> Settings -> Billing.
3. Internal portal: Dashboard -> Merchants -> Packages.
4. Storefront product page có widget.
5. Billing flow accept charge.
6. Nếu lỗi thì DevTools > Network > Preserve log > reproduce.
7. Mobile viewport trên storefront hoặc portal.
8. Safari clip quay bổ sung riêng.

## Bản nói siêu ngắn nếu PM chỉ cần video ngắn

Nếu anh muốn một bản 3 đến 5 phút, chỉ quay:

1. Merchant app: Settings + Billing + Subscriptions.
2. Internal portal: Merchants.
3. Storefront widget trên product page.
4. Billing accept charge.
5. Nếu có 404 thì bật Preserve log và show request chain.

## Ghi chú thực tế theo codebase hiện tại

- Merchant nav thật đang có: Analytics, Billing, Subscriptions, Subscription rule, Settings, Privacy.
- Widget product management có route riêng tại `/app/widget-products`.
- Internal portal là surface tách riêng, không phải merchant-facing pricing feature.
- Billing page có guard để ẩn Shopify-hosted pricing link nếu managed pricing chưa sẵn sàng, nhằm tránh reviewer hoặc merchant rơi vào `404` không cần thiết.
- Local/dev có thể dùng manual test billing fallback để vẫn demo accept charge flow.
- `Billing welcome` là màn nên show rõ sau khi accept charge vì đây là nơi reconcile Shopify billing state về snapshot nội bộ.

## Nếu anh muốn gửi video kèm note cho PM

Có thể copy đoạn này vào tin nhắn gửi cùng video:

> I recorded the demo across the main merchant app, the internal operations portal, and the storefront widget. I also included the billing acceptance flow and, if a 404 appears, I captured the Network log with Preserve Log enabled so we can distinguish a local configuration issue from an actual product bug. I added a quick mobile pass in Chrome DevTools, and Safari can be provided as a separate short pass from a Mac environment.