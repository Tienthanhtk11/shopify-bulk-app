# Merchant Features

## Purpose

Tài liệu này liệt kê toàn bộ tính năng merchant-facing hiện có trong SubBulk, phục vụ cho:

- định nghĩa gói plan thương mại
- thống nhất ngôn ngữ giữa PM, sales, support, và dev
- làm source cho pricing content, reviewer guide, và roadmap sản phẩm

## Feature Groups

### 1. Analytics Dashboard

Merchant có thể:

- xem tổng số subscription contracts
- xem số lượng active, paused, cancelled
- xem active rate, churn rate, growth rate
- xem top subscribed products
- xem contracts mới tạo gần đây
- xem billing outlook trong 7 ngày và 30 ngày tới
- xem average quantity trên subscription orders
- xem health summary để đánh giá retention/tăng trưởng

Giá trị thương mại:

- giúp merchant theo dõi subscription business health mà không cần export thủ công

### 2. Billing And Plan Access

Merchant có thể:

- xem current plan
- xem latest billing status
- xem matrix plan hiện có
- xem feature highlights của từng plan
- mở Shopify-hosted pricing page khi managed pricing đã publish
- quay lại billing welcome flow sau khi đổi plan

Hệ thống tự làm:

- chặn route nếu feature không thuộc plan
- chặn write actions nếu billing inactive
- giải thích vì sao một feature đang bị khóa

Giá trị thương mại:

- giảm support tickets kiểu “vì sao tôi không dùng được feature này”

### 3. Subscription Operations

Merchant có thể:

- xem danh sách subscription contracts
- filter theo trạng thái
- search theo customer name, email, contract id, product title
- sort theo created date hoặc next billing date
- xem quantity per subscription
- xem next billing date
- xem created date
- xem payment method summary do Shopify trả về
- xem last payment status khi Shopify có dữ liệu

Giá trị thương mại:

- giúp merchant vận hành subscription hiện tại mà không cần mở nhiều tool khác nhau

### 4. Subscription Rule Builder

Merchant có thể:

- tạo subscription rule cho storefront
- chỉnh title hiển thị của rule
- chỉnh internal name
- chỉnh plan selector label
- chọn explicit product scope
- cấu hình nhiều interval trong cùng một rule
- cấu hình interval weekly hoặc monthly
- cấu hình discount type `PERCENTAGE` hoặc `FIXED`
- cấu hình discount value cho từng interval
- sync rule lên Shopify selling plan group
- recreate selling plan group khi cấu hình lõi thay đổi

Giá trị thương mại:

- merchant có thể tự cấu hình subscribe-and-save experience mà không cần support thao tác tay trong admin Shopify

### 5. Widget Product Management

Merchant có thể:

- chọn sản phẩm bằng Shopify Resource Picker
- thêm nhiều sản phẩm vào danh sách bật widget
- chống duplicate khi thêm lại cùng sản phẩm
- gỡ sản phẩm khỏi widget list
- lưu bulk pricing JSON theo từng sản phẩm
- deep link từ Discounts admin vào đúng màn cấu hình sản phẩm

Giá trị thương mại:

- giảm friction khi merchant cần mở rộng widget sang nhiều sản phẩm

### 6. Widget Styling And Preview

Merchant có thể:

- chỉnh heading của widget
- chỉnh purchase options label
- chỉnh subscription footer
- chỉnh free shipping note
- chỉnh màu primary accent
- chỉnh màu border / savings
- chọn font family
- chỉnh border radius
- chỉnh border thickness
- bật hoặc tắt savings badge
- bật hoặc tắt compare-at price
- bật hoặc tắt subscription details
- bật custom CSS
- xem live preview ngay trong app
- mở theme editor để đặt block vào product template

Giá trị thương mại:

- widget bớt “generic app UI”, hòa vào theme merchant hơn

### 7. Discount And Checkout Enablement

Merchant có thể:

- lưu default subscription discount để storefront preview có dữ liệu hợp lý
- bật backend bulk discount bằng Shopify Function

Hệ thống hỗ trợ:

- bulk pricing + subscription discount stacking đúng trong checkout
- không dùng draft-order workaround

Giá trị thương mại:

- đảm bảo logic giá ở storefront và checkout nhất quán, giảm dispute về giá

### 8. Customer Self-Service Portal

Customer của merchant có thể:

- vào app proxy portal để xem subscriptions của chính mình
- search subscriptions
- xem next billing date, created date, quantity
- xem payment method label
- xem last payment status khi Shopify đã ghi nhận charge attempt
- pause subscription
- resume subscription
- cancel subscription

Merchant được hưởng lợi:

- giảm ticket support cho các yêu cầu tự phục vụ cơ bản

### 9. Customer Account UI Extension

Customer của merchant có thể:

- xem subscriptions ngay trong Shopify Customer Account
- xem counts active/paused/cancelled
- xem payment method summary
- pause, resume, cancel trực tiếp tại profile page
- nhận native Shopify toast feedback cho các action

Merchant được hưởng lợi:

- self-service nằm ngay trong ecosystem của Shopify, ít phụ thuộc vào portal ngoài hơn

### 10. Privacy And Data Controls

Merchant có thể:

- vào trang privacy trong app
- tạo deletion request cho operational data

Hệ thống hỗ trợ:

- xử lý deletion request theo background job
- giữ minimal metadata cho reconciliation, support, và compliance

## Packaging Notes

Để đóng gói thương mại, các nhóm feature tự nhiên là:

1. Storefront setup and widget branding
2. Subscription operations and analytics
3. Customer self-service
4. Billing and commercial controls
5. Premium operations and priority support

## Source Of Truth In Code

- analytics: `app/routes/app.analytics.tsx`
- billing: `app/routes/app.billing.tsx`
- subscriptions: `app/routes/app.subscriptions.tsx`
- subscription rule builder: `app/routes/app.subscription-rule.editor.tsx`
- widget products: `app/routes/app.widget-products.tsx`
- widget settings: `app/routes/app.settings.tsx`
- privacy: `app/routes/app.privacy.tsx`
- app proxy portal: `app/routes/apps.subbulk.portal.tsx`
- customer account extension: `extensions/sub-bulk-customer-account/src/ProfileBlock.jsx`

## Caveats

1. Một số feature commercial như managed pricing phụ thuộc Partner Dashboard chứ không chỉ repo code.
2. Payment method visibility và last payment status phụ thuộc dữ liệu Shopify thật; không phải shop nào cũng có đầy đủ dữ liệu ngay.
3. Internal admin portal không nên tính vào pricing plans bán cho merchant.