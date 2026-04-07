# Kịch bản quay screen demo cho PM

## Mục tiêu

Video này cần cover đủ 4 nhóm nội dung PM đã yêu cầu:

1. Main features: merchant app, internal portal, storefront widget.
2. Billing flow: merchant setup subscription và accept charge.
3. 404 issue: nếu thấy 404 thì mở Inspect > Network, bật Preserve log để giữ request chain.
4. Mobile và browsers: xem nhanh trên mobile mode, Chrome, và Safari.

Mục tiêu thực tế của video không phải quay mọi pixel của hệ thống, mà là chứng minh 3 điều:

- app đã có các surface chính và có thể đi qua luồng nghiệp vụ thật
- billing flow có đường đi rõ ràng và nếu lỗi 404 xuất hiện thì đã capture đủ dữ liệu để debug
- storefront widget và internal portal không phải mock screen, mà gắn vào cùng một hệ thống SubBulk

## Bối cảnh hệ thống để bám khi quay

SubBulk hiện có các surface chính sau:

- Embedded merchant app trong Shopify Admin với menu: Analytics, Billing, Subscriptions, Subscription rule, Settings, Privacy.
- Internal admin portal riêng với menu: Merchants, Packages, Admins.
- Storefront widget chạy qua theme app block và runtime dưới `/apps/subbulk/*`.
- Billing page nằm ở `/app/billing`.
- Billing return / reconciliation page nằm ở `/app/welcome`.

## Độ dài khuyến nghị

- Bản gọn: 6 đến 8 phút.
- Bản an toàn, đủ evidence cho PM: 8 đến 10 phút.

Khuyến nghị quay bản 8 đến 10 phút để không phải quay lại nếu PM hỏi thiếu billing evidence hoặc thiếu mobile/browser evidence.

## Chuẩn bị trước khi bấm record

## 1. Chuẩn bị dữ liệu và tab

Trước khi quay, nên mở sẵn các tab sau:

1. Shopify Admin với embedded app SubBulk đang login.
2. Trang Billing của merchant app.
3. Một product page ngoài storefront đã gắn widget.
4. Internal portal đã login sẵn.
5. Chrome DevTools có thể mở nhanh cho phần Network.

Nếu được, chuẩn bị sẵn các điều kiện dữ liệu sau:

1. Có ít nhất 1 product đã nằm trong Widget-enabled products.
2. Có ít nhất 1 subscription rule đã tạo để trang rule không bị empty state.
3. Có ít nhất 1 subscription contract để trang Subscriptions có dữ liệu thật.
4. Billing page có ít nhất 1 plan khả dụng để bấm sang confirmation flow.

## 2. Chuẩn bị môi trường billing

Video có thể rơi vào 1 trong 2 mode sau:

### Mode A: Managed pricing đã sẵn sàng

Dấu hiệu khi vào Billing page:

- có nút `Open Shopify pricing page`
- hoặc từng plan có nút `Change to this plan`

Đây là mode đẹp nhất để quay vì đúng production story.

### Mode B: Managed pricing chưa publish, dùng test fallback

Dấu hiệu khi vào Billing page:

- có banner `Shopify-hosted pricing is not published yet`
- có card `Manual test billing fallback is active`
- từng plan Premium hoặc Ultra có nút `Start monthly test charge` hoặc `Start annual test charge`

Mode này vẫn quay được, miễn là nói rõ đây là local/dev fallback để test luồng approve charge trước khi hosted pricing publish xong.

## 3. Chuẩn bị browser cho phần cuối video

PM yêu cầu Chrome và Safari.

Lưu ý thực tế:

- Nếu máy quay là Linux thì không có Safari native để quay trực tiếp.
- Phương án an toàn là quay Chrome local trước, sau đó quay Safari bằng BrowserStack, LambdaTest, hoặc một máy Mac riêng.
- Nếu chưa có Safari thật, trong video có thể nói rõ: `I verified Chrome locally; Safari is captured on a separate macOS session.`

## Cấu trúc video khuyến nghị

## Flow tổng thể

1. Intro rất ngắn.
2. Merchant app main features.
3. Internal admin portal.
4. Storefront widget trên product page.
5. Billing flow.
6. Nếu có 404 thì giữ nguyên video, mở Network tab và debug request chain.
7. Mobile mode và browser coverage.
8. Kết thúc ngắn.

Lý do sắp thứ tự như vậy:

- PM thấy ngay product breadth trước.
- Billing được đặt sau khi người xem đã hiểu app không chỉ có một screen.
- 404 branch nằm ngay trong billing section nên context không bị mất.
- Mobile/browser nằm cuối để quay nhanh trên đúng screen đã mở sẵn.

## Shot list chi tiết theo timeline

## Shot 1. Intro

### Mốc thời gian

- 0:00 đến 0:20

### Thao tác trên màn hình

1. Mở merchant app tại trang Analytics hoặc Billing.
2. Zoom ở mức dễ đọc, không quá nhỏ.
3. Để sidebar và TitleBar hiện rõ.

### Câu nói gợi ý bằng tiếng Anh

`This is a quick end-to-end demo of SubBulk. I will show the merchant app, the internal operations portal, the storefront widget, the billing approval flow, and a quick mobile and browser pass.`

### Mục tiêu của shot này

- thiết lập kỳ vọng ngay từ đầu
- cho PM biết video sẽ cover đúng checklist đã yêu cầu

## Shot 2. Merchant app overview

### Mốc thời gian

- 0:20 đến 2:20

### Thao tác trên màn hình

1. Ở sidebar của embedded app, lướt qua các menu:
   Analytics
   Billing
   Subscriptions
   Subscription rule
   Settings
   Privacy
2. Vào Analytics.
3. Dừng khoảng 5 đến 8 giây để thấy các card như:
   Total contracts
   Active rate
   Churn rate
   30-day growth
4. Scroll nhẹ xuống để thấy các khối:
   Subscription health
   Billing outlook
   Subscription growth
   Status distribution
5. Chuyển sang Subscriptions.
6. Chỉ nhanh các khả năng filter, search, sort, và counters Active / Paused / Cancelled.
7. Nếu có dữ liệu thật, click vào một dòng hoặc scroll để lộ các field như next billing date, payment method summary, last payment status.
8. Chuyển sang Subscription rule.
9. Nếu đã có rule, chỉ vào các thông tin như number of covered products, interval count, discount summary.
10. Nếu có nút `Edit rule`, bấm vào rồi quay lại danh sách sau 3 đến 5 giây.
11. Chuyển sang Settings.
12. Dừng ở live preview của widget và các field custom như heading, colors, font, savings badge, compare-at price.
13. Nếu có theme editor URL sẵn, chỉ vào nút mở Theme Editor nhưng chưa cần bấm ngay.
14. Chuyển sang Privacy trong 3 đến 4 giây để chứng minh có compliance surface.

### Câu nói gợi ý bằng tiếng Anh

`This is the embedded merchant app inside Shopify Admin. The merchant can review subscription analytics, manage billing access, inspect subscription contracts, configure the subscription rule, customize the storefront widget, and access privacy controls.`

`On Analytics, we show contract totals, active and churn health, near-term billing outlook, and growth signals from the latest subscription data.`

`On Subscriptions, the merchant can search by customer, product, or contract, and see payment method and last payment status when Shopify provides it.`

`On Subscription rule, the merchant configures the selling-plan experience and product coverage. On Settings, the merchant controls the widget copy, colors, display options, and preview.`

### Những điểm nhất định phải có trên video

1. Thấy rõ đây là embedded Shopify app chứ không phải standalone page.
2. Thấy menu merchant app đầy đủ.
3. Thấy ít nhất 1 màn có dữ liệu thật, không chỉ empty state.
4. Thấy live preview hoặc customization ở Settings để nối sang storefront widget phần sau.

## Shot 3. Internal portal overview

### Mốc thời gian

- 2:20 đến 3:40

### Thao tác trên màn hình

1. Chuyển sang internal portal.
2. Nếu đang ở dashboard `/admin`, dừng vài giây để thấy:
   Systems Operational
   Total traffic or merchant summary
   Active sessions
   System Telemetry
3. Chuyển sang Merchants.
4. Chỉ rõ có merchant list, status filter, package filter, search, export XML, create merchant.
5. Scroll một chút để thấy merchant rows và actions.
6. Nếu an toàn, mở một merchant detail hoặc popup detail.
7. Chuyển sang Packages.
8. Chỉ 3 tier hiện tại: Free, Premium, Ultra; rồi chỉ Assigned Merchants phía dưới.
9. Chuyển nhanh sang Admins để chứng minh có internal access management.

### Câu nói gợi ý bằng tiếng Anh

`This is the standalone internal operations portal. It is separate from the embedded merchant app and is used by our internal team to manage merchants, packages, notes, and admin access.`

`The Merchants area gives operations visibility into merchant status, billing risk, and package coverage. The Packages area manages the Free, Premium, and Ultra commercial definitions and merchant assignments.`

### Mục tiêu của shot này

- tách bạch rõ merchant-facing app và internal-only portal
- cho PM thấy hệ thống không chỉ có storefront widget mà còn có operations tooling

## Shot 4. Storefront widget on product page

### Mốc thời gian

- 3:40 đến 5:10

### Thao tác trên màn hình

1. Mở storefront product page có gắn widget.
2. Scroll đến đúng vùng widget trên product detail.
3. Dừng lại để thấy:
   purchase options
   buy more / save more messaging
   subscribe-and-save option
   quantity pricing tiers nếu đang render
   compare-at price hoặc savings badge nếu đang bật
4. Nếu widget có variant, đổi quantity hoặc lựa chọn để widget re-render.
5. Quay lại tab Settings trong merchant app để chỉ live preview và nối câu chuyện rằng merchant chỉnh ở đây, storefront phản ánh ở đây.
6. Nếu tiện, quay thêm trang Widget products để chỉ product enablement list và bulk pricing JSON editor.

### Câu nói gợi ý bằng tiếng Anh

`This is the storefront surface. The widget is rendered on the product page through the theme app block, and the merchant controls its content and styling from the embedded app.`

`The widget supports quantity-based pricing, subscription messaging, and storefront display controls such as savings badges, compare-at pricing, and custom styling.`

### Nếu muốn tăng độ thuyết phục

Quay một nhịp rất ngắn như sau:

1. mở Settings
2. đổi một label nhỏ hoặc color
3. save
4. refresh storefront product page
5. chỉ đúng chỗ thay đổi

Nếu môi trường đang ổn định, đây là shot rất tốt vì nó chứng minh widget và merchant app đang nối thật với nhau.

## Shot 5. Billing flow chuẩn

### Mốc thời gian

- 5:10 đến 7:20

### Thao tác trên màn hình trước khi click bất kỳ nút billing nào

1. Vào lại merchant app, mở Billing.
2. Cho thấy rõ các phần:
   Current plan
   Latest billing status
   Current package and available plans
   Enabled features
3. Trước khi bấm đổi plan, mở DevTools.
4. Vào tab Network.
5. Tick `Preserve log`.
6. Giữ DevTools mở ở cạnh màn hình hoặc dock bên dưới.

Đây là bước rất quan trọng. Dù billing chạy thành công, vẫn nên quay thao tác bật `Preserve log` trước. Nếu 404 xuất hiện, video sẽ có luôn evidence, không cần quay lại.

### Câu nói gợi ý bằng tiếng Anh

`I am opening the Billing page now. Before I trigger the plan change, I am enabling Preserve log in the Network tab so that if a 404 appears, we keep the full request chain for debugging.`

### Nhánh A: Managed pricing ready

Thực hiện nếu có các nút như `Open Shopify pricing page` hoặc `Change to this plan`.

#### Thao tác

1. Click `Open Shopify pricing page` hoặc `Change to this plan` ở plan Premium hoặc Ultra.
2. Chờ Shopify-hosted pricing or approval page mở ra.
3. Trên trang Shopify confirmation, chỉ nhanh plan name và pricing.
4. Click approve / accept charge.
5. Chờ redirect về app.
6. Khi về `/app/welcome`, dừng ở màn `Billing reconciliation complete`.
7. Chỉ 3 phần:
   Latest internal plan
   Active Shopify subscription
   Access unlocked right now
8. Click `Open billing` để quay về Billing page.
9. Cho PM thấy `Current plan` và `Latest billing status` đã cập nhật.

#### Câu nói gợi ý bằng tiếng Anh

`Here the merchant is moving from the in-app billing screen into the Shopify-hosted pricing and charge approval flow.`

`After the merchant accepts the charge, Shopify returns to the app welcome route, where we reconcile the latest billing state back into the internal merchant snapshot before the user continues.`

`Back on the Billing page, the current plan and accessible feature set reflect the updated billing state.`

### Nhánh B: Test fallback flow trong local/dev

Thực hiện nếu Billing page hiện card `Manual test billing fallback is active` và nút `Start monthly test charge` hoặc `Start annual test charge`.

#### Thao tác

1. Nói rõ đây là fallback cho local/dev khi managed pricing chưa publish xong.
2. Click `Start monthly test charge` cho plan Premium hoặc Ultra.
3. Chờ Shopify confirmation page.
4. Click accept charge.
5. Chờ redirect về `/app/welcome`.
6. Giống nhánh A: chỉ vào `Billing reconciliation complete`, `Latest internal plan`, `Active Shopify subscription`.
7. Quay lại Billing page để chứng minh state đã được refresh.

#### Câu nói gợi ý bằng tiếng Anh

`In this local environment, the production hosted pricing page is not fully published yet, so I am using the manual test billing fallback. It still uses Shopify charge approval and returns through the same billing reconciliation path.`

### Những gì PM cần nhìn thấy trong đoạn billing

1. Merchant xuất phát từ trang Billing của app.
2. Có click thật sang Shopify charge page hoặc pricing page.
3. Có bước accept charge thật.
4. Có quay lại app qua `/app/welcome`.
5. Có thấy state sau reconcile.

## Shot 6. Nếu có 404, giữ nguyên video và debug ngay

### Mốc thời gian

- Chỉ quay nhánh này nếu lỗi thật xảy ra

### Nguyên tắc quan trọng

Không cắt video ngay khi thấy 404. PM đang cần đúng đoạn này để xác định có phải chỉ là local configuration issue hay không.

### Thao tác chi tiết

1. Giữ nguyên screen 404 khoảng 2 đến 3 giây để thấy URL và context.
2. Mở hoặc focus vào DevTools > Network.
3. Xác nhận `Preserve log` đang bật.
4. Chọn request bị lỗi gần nhất trong chain.
5. Click vào request đó và mở lần lượt:
   Headers
   Response
   Initiator hoặc Timing nếu có ích
6. Scroll để lộ các thông tin chính:
   Request URL
   Status code
   Redirect chain nếu có
   Response body nếu có text lỗi
7. Nếu có nhiều redirect 3xx trước 404, click từng request để PM thấy chính xác lỗi rơi ở bước nào.

### Câu nói gợi ý bằng tiếng Anh

`The page returned a 404, so I am checking the preserved Network log to capture the exact request chain.`

`I want to confirm whether this is a local configuration issue, a managed-pricing publication issue, or a wrong redirect target in this environment.`

`Here are the failing request URL, the status code, and the redirect sequence leading to the 404.`

### Các điểm nên chỉ rõ bằng miệng nếu nhìn thấy trong Network

1. 404 xảy ra ở Shopify-hosted pricing page hay ở app return URL.
2. Trước đó có redirect thành công hay không.
3. URL có đúng app handle hay không.
4. Có đang quay từ local environment hay production-like environment hay không.

### Ghi chú kỹ thuật để anh tự hiểu khi quay

Trong repo này, billing UI cố tình ẩn direct managed-pricing link nếu managed pricing chưa publish xong, nhằm tránh rơi vào Shopify-hosted 404. Vì vậy, nếu vẫn có 404 thì nhiều khả năng nằm ở một trong các nhóm sau:

1. cấu hình local hoặc env khác với dự kiến
2. managed pricing app handle hoặc publication state chưa đúng
3. redirect target sau accept charge không khớp môi trường đang quay

## Shot 7. Mobile mode

### Mốc thời gian

- 7:20 đến 8:10

### Thao tác trên màn hình

1. Quay lại storefront product page có widget.
2. Mở Chrome DevTools.
3. Bật Device Toolbar.
4. Chọn một preset như iPhone 14 Pro hoặc Pixel 7.
5. Refresh page.
6. Scroll chậm từ product info xuống widget.
7. Nếu widget có CTA hoặc selectors, tap thử một lần để chứng minh usable.

### Câu nói gợi ý bằng tiếng Anh

`This is a quick mobile pass using the browser device inspector. The goal here is to confirm that the widget remains readable, usable, and visually stable on a mobile viewport.`

### Nếu còn thời gian

Làm thêm 1 nhịp mobile trong merchant app Billing page hoặc Settings page để PM thấy embedded app cũng không vỡ layout hoàn toàn ở viewport hẹp. Tuy nhiên storefront widget vẫn là ưu tiên chính của phần mobile.

## Shot 8. Chrome và Safari

### Mốc thời gian

- 8:10 đến 9:00

### Cách quay tối ưu

#### Chrome

1. Giữ nguyên một trong các surface chính, tốt nhất là storefront widget hoặc Billing page.
2. Nói rõ đây là run trong Chrome.
3. Scroll hoặc click một tương tác nhẹ.

#### Safari

Nếu có máy Mac hoặc cloud browser:

1. Mở cùng page tương tự.
2. Lặp lại một tương tác ngắn.
3. Không cần quay lại toàn bộ flow billing; chỉ cần chứng minh UI load và tương tác cơ bản.

Nếu chưa có Safari native ngay lúc quay bản đầu:

1. ghi rõ ở lời nói hoặc trong email gửi kèm rằng Chrome được quay local
2. Safari sẽ được attach bằng một pass riêng trên macOS session

### Câu nói gợi ý bằng tiếng Anh

`This quick pass is in Chrome.`

`And this is the same surface in Safari, to confirm the app loads and the core UI remains usable across browsers.`

## Shot 9. Closing

### Mốc thời gian

- 9:00 đến 9:20

### Thao tác trên màn hình

1. Quay lại merchant Billing page hoặc storefront widget.
2. Để screen ổn định, không click thêm.

### Câu nói gợi ý bằng tiếng Anh

`That concludes the demo. We covered the merchant app, the internal portal, the storefront widget, the billing approval path, the 404 capture method if it occurs, and a quick mobile and browser check.`

## Phiên bản siêu ngắn nếu anh chỉ có 4 đến 5 phút

Nếu PM chỉ cần bản ngắn, giữ đúng thứ tự sau:

1. Merchant app: Analytics, Subscriptions, Settings.
2. Internal portal: Dashboard, Merchants, Packages.
3. Storefront product page với widget.
4. Billing page, bật Network Preserve log, chạy approve charge.
5. Mobile viewport trên storefront widget.

Tuy nhiên bản ngắn có rủi ro là thiếu ngữ cảnh cho 404 hoặc thiếu bằng chứng browser coverage.

## Checklist quay xong trước khi gửi PM

Xem lại video và đảm bảo có đủ các mục sau:

1. Thấy rõ merchant app navigation.
2. Thấy rõ internal portal navigation.
3. Thấy storefront widget trên product page thật.
4. Thấy billing page trước khi click.
5. Thấy DevTools Network với `Preserve log` trước bước billing redirect.
6. Thấy Shopify confirmation hoặc pricing page.
7. Thấy merchant accept charge.
8. Thấy quay về `/app/welcome` hoặc ít nhất return screen sau reconcile.
9. Nếu có 404, thấy request URL và response trong Network tab.
10. Có ít nhất một pass mobile.
11. Có ít nhất một pass Chrome và một pass Safari, hoặc có note rõ Safari được quay riêng trên macOS/cloud browser.

## Lời khuyên để quay mượt, ít phải làm lại

1. Nói chậm hơn bình thường khoảng 10 đến 15 phần trăm.
2. Mỗi lần chuyển screen, dừng 1 đến 2 giây trước khi nói tiếp.
3. Đừng lia chuột quá nhanh; PM cần đọc được label chính trên màn hình.
4. Trong billing flow, tuyệt đối đừng quên bật `Preserve log` trước khi click.
5. Nếu gặp lỗi thật, đừng hoảng và đừng tắt tab; đoạn lỗi đó lại là evidence giá trị nhất cho PM.

## Gợi ý câu mở đầu và câu kết cực ngắn để dùng ngay

### Mở đầu

`This is a short end-to-end SubBulk demo covering the merchant app, the internal portal, the storefront widget, the billing approval flow, and a quick mobile and browser check.`

### Kết thúc

`We have now covered the main product surfaces, the billing flow, the 404 capture path if it occurs, and quick responsive and browser validation.`