# Confirmed Product Spec: Internal Shopify Subscription + Bulk Pricing App

Updated: 2026-03-25

## 1. Mục tiêu sản phẩm

Xây một app Shopify hoàn chỉnh cho `1 store nội bộ`, kết hợp hai phần có tầm quan trọng ngang nhau:

1. Subscription app kiểu Seal Subscriptions
2. Bulk pricing trên product page, đọc dữ liệu từ `product metafield`

App này không phải chỉ là một widget hiển thị giá. Nó phải bao gồm:

1. Storefront purchase widget
2. Merchant admin để quản lý subscription và widget
3. Customer portal để khách quản lý subscription
4. Logic pricing đúng ở product page và áp thật vào cart/checkout trong phạm vi Shopify cho phép

## 2. Định nghĩa sản phẩm đã chốt

### 2.1 Trọng tâm sản phẩm

Ưu tiên theo đúng tinh thần app:

1. Widget ngoài storefront
2. Logic giá đúng ở cart/checkout
3. Admin cho merchant
4. Subscription backend
5. Customer portal

### 2.2 Loại app

- Internal app cho một store nội bộ
- Production-ready gần hoàn chỉnh ngay ở phase 1
- Không phải MVP demo đơn giản

## 3. Storefront widget

### 3.1 Vị trí widget

Widget phải được đặt `sát ngay dưới hoặc cạnh vùng giá mặc định`, để nhìn như cùng một cụm với buy box.

Không mong muốn:

- block rời nằm quá xa phía dưới
- section bị tách khỏi giá và nút mua

Mức tích hợp mong muốn:

1. Ưu tiên cập nhật được cả giá lớn ở đầu buy box nếu làm sạch với theme
2. Nếu không thể làm sạch với theme trong phase 1 thì vẫn phải cập nhật đầy đủ trong widget

### 3.2 Nội dung bắt buộc của widget

1. Heading kiểu `Buy More, Save More`
2. `Purchase options`
3. Radio/card `One-time purchase`
4. Radio/card `Subscribe & save`
5. Badge tiết kiệm subscription
6. Dropdown `Deliver every ...` khi chọn subscription
7. Dòng `Subscription details`
8. Bảng bulk pricing
9. Quantity selector
10. Total cost live update
11. Nút Add to cart của theme vẫn nằm ngay dưới cụm này

### 3.3 Hành vi bắt buộc của widget

Khi customer đổi quantity:

1. Tự xác định tier đúng
2. Highlight tier đúng trong bảng
3. Cập nhật giá hiển thị
4. Cập nhật total cost

Khi customer chọn `One-time purchase`:

1. Giá hiển thị lấy theo `priceAfterDiscount` của tier đang active
2. Total cost = `priceAfterDiscount * quantity`

Khi customer chọn `Subscribe & save`:

1. Giá nền để tính subscription vẫn lấy từ `priceAfterDiscount` của tier đang active
2. Sau đó mới áp thêm subscription discount
3. Nếu discount là `%`, có thể hiển thị rõ đơn giá sau discount
4. Nếu discount là `fixed amount on invoice`, nên ưu tiên hiển thị rõ total sau discount thay vì cố ép ra đơn giá / unit

### 3.4 Hiển thị giá mong muốn

Mục tiêu hiển thị:

1. Nếu có thể, giá lớn của product cũng đổi theo option và quantity
2. Nếu không thể làm sạch trên mọi theme ở phase 1, ít nhất cụm widget phải hiển thị giá đúng tuyệt đối

## 4. Bulk pricing

### 4.1 Nguồn dữ liệu

Bulk pricing được nhập trực tiếp bởi merchant trong `product metafield` của Shopify.

Phase 1:

- áp theo `product`
- tất cả variants của product dùng chung một bảng bulk pricing

### 4.2 JSON metafield đã chốt

```json
[
  {
    "qtyBreakpoint": 1,
    "priceAfterDiscount": 7.39,
    "bulkPrice": 9.29
  },
  {
    "qtyBreakpoint": 11,
    "priceAfterDiscount": 7.29,
    "bulkPrice": 9.09
  }
]
```

### 4.3 Ý nghĩa fields

1. `qtyBreakpoint`
   - mốc bắt đầu của tier
   - ví dụ `11` nghĩa là tier áp từ `11+`

2. `bulkPrice`
   - giá tham khảo/gốc để hiển thị
   - không phải nguồn chính để tính final one-time price

3. `priceAfterDiscount`
   - giá one-time thực tế của 1 sản phẩm khi quantity đạt tier đó
   - chưa bao gồm subscription discount

### 4.4 Cách xác định tier

Ví dụ:

```json
[
  { "qtyBreakpoint": 1, "priceAfterDiscount": 7.39, "bulkPrice": 9.29 },
  { "qtyBreakpoint": 11, "priceAfterDiscount": 7.29, "bulkPrice": 9.09 }
]
```

Khi quantity = `1..10`

- tier active là breakpoint `1`
- one-time price = `7.39`

Khi quantity = `11+`

- tier active là breakpoint `11`
- one-time price = `7.29`

### 4.5 Hiển thị bảng bulk pricing

Bảng cần hiển thị:

1. Cột Quantity range
2. Cột Price
3. Highlight tier đang active
4. Có thể dùng `bulkPrice` như giá tham khảo nếu muốn hiện song song theo design, nhưng giá có hiệu lực để tính toán là `priceAfterDiscount`

## 5. Subscription

### 5.1 Phạm vi phase 1

Subscription là tính năng bắt buộc ngay phase 1.

Cần có:

1. Widget chọn `One-time purchase` / `Subscribe & save`
2. Nhiều subscription plans trên một product
3. Merchant chọn default plan
4. Discount subscription dạng `%`
5. Discount subscription dạng `fixed amount`
6. Customer portal cơ bản

### 5.2 UI chọn plan

Nếu product có nhiều subscription plans, phase 1 hiển thị:

- `1 dropdown Deliver every ...`

Không dùng radio list trong phase 1.

### 5.3 Discount types đã chốt

Hỗ trợ:

1. Percentage discount
2. Fixed amount discount

### 5.4 Cách tính giá subscription

Nguồn sự thật để tính subscription phải là:

- lấy từ `priceAfterDiscount` của tier active
- không lấy từ `bulkPrice`

#### Trường hợp percentage discount

Ví dụ:

- quantity = `11`
- tier active `11+`
- `priceAfterDiscount = 7.29`
- discount subscription = `10%`

Khi đó:

- one-time unit price = `7.29`
- subscription unit price = `7.29 * (1 - 10%) = 6.561`
- làm tròn theo currency rules

#### Trường hợp fixed amount discount

Discount fixed amount được chốt là:

- `trừ trên tổng hóa đơn`
- không trừ trên từng unit

Ví dụ:

- quantity = `11`
- one-time unit price = `7.29`
- subtotal trước sub discount = `80.19`
- fixed discount = `$2`
- subscription total = `78.19`

Do đây là discount trên total, phase 1 nên ưu tiên hiển thị:

1. one-time unit price
2. discount on total
3. final total

Không bắt buộc phải ép thành một subscription unit price cố định trong mọi UI surface.

## 6. Công thức giá phase 1

### 6.1 One-time purchase

1. Tìm tier active từ `qtyBreakpoint`
2. `oneTimeUnitPrice = activeTier.priceAfterDiscount`
3. `oneTimeTotal = oneTimeUnitPrice * quantity`

### 6.2 Subscription purchase với percentage discount

1. Tìm tier active
2. `oneTimeUnitPrice = activeTier.priceAfterDiscount`
3. `subscriptionUnitPrice = oneTimeUnitPrice * (1 - subscriptionPercent)`
4. `subscriptionTotal = subscriptionUnitPrice * quantity`

### 6.3 Subscription purchase với fixed amount discount

1. Tìm tier active
2. `oneTimeUnitPrice = activeTier.priceAfterDiscount`
3. `subtotal = oneTimeUnitPrice * quantity`
4. `subscriptionTotal = subtotal - fixedAmount`

### 6.4 Quy tắc hiển thị phase 1

1. Với `% discount`, có thể hiển thị final unit price rõ ràng
2. Với `fixed amount on invoice`, ưu tiên hiển thị final total chính xác
3. Nếu Shopify cart/checkout không cho hiện đúng unit price như storefront trên mọi theme/surface, phase 1 chấp nhận ưu tiên `final pricing đúng`

## 7. Cart / checkout

### 7.1 Mục tiêu

Ưu tiên:

1. Nếu làm được, cart line hiển thị đúng final unit price
2. Nếu Shopify surface bị giới hạn, phase 1 chấp nhận hiển thị theo kiểu có discount line miễn là final pricing đúng

### 7.2 Kỳ vọng thực tế

Storefront là nơi cần hiển thị đẹp nhất và rõ nhất.

Cart/checkout cần đảm bảo:

1. logic giá đúng
2. không lệch với tier đã chọn
3. subscription discount áp đúng sau bulk pricing

## 8. Merchant admin

### 8.1 Must-have phase 1

1. Subscription offers management
2. Selling plan / frequency settings
3. Subscription discount settings
4. Widget customization
5. Active / paused / cancelled subscription stats

### 8.2 Later

1. Payment calendar
2. Email reminder / renewal reminder
3. Cancellation rules nâng cao
4. Product swap
5. Prepaid subscriptions
6. Passwordless portal access
7. Delivery/shipping profile logic
8. API / webhook access
9. Multi-language widget text

## 9. Customer portal

### 9.1 Must-have phase 1 actions

1. Pause subscription
2. Resume subscription
3. Cancel subscription

### 9.2 Portal detail cần hiển thị

1. Product
2. Status
3. Frequency
4. Next charge date

### 9.3 Later

1. Skip next order
2. Change frequency
3. Change quantity
4. Change shipping address
5. Update payment method
6. Order history liên quan subscription

## 10. Danh sách tính năng hoàn chỉnh

### 10.1 Storefront

1. Buy box integration sát vùng giá
2. Purchase options selector
3. One-time purchase pricing
4. Subscribe & save pricing
5. Deliver every dropdown
6. Subscription details row
7. Bulk pricing table
8. Quantity selector
9. Live total cost
10. Tier highlight
11. Optional sync với main product price nếu theme cho phép clean integration

### 10.2 Merchant admin

1. Subscription offers list
2. Create/edit subscription offers
3. Product assignment
4. Multiple selling plans per product
5. Default plan selection
6. Discount type config
7. Discount value config
8. Widget customization settings
9. Basic subscription stats

### 10.3 Customer portal

1. Subscription list
2. Subscription detail
3. Pause
4. Resume
5. Cancel
6. Show next charge date

## 11. Phase planning

### 11.1 Phase 1

1. Product page widget hoàn chỉnh
2. Bulk pricing từ product metafield
3. Subscription plan dropdown
4. Subscription discount logic `%` và `fixed amount`
5. Cart/checkout pricing logic đúng trong phạm vi Shopify cho phép
6. Merchant admin cho offer/settings/stats
7. Customer portal: pause/resume/cancel + detail

### 11.2 Phase 2 / later

1. Skip next order
2. Change frequency
3. Change quantity
4. Change shipping address
5. Update payment method
6. Order history
7. Advanced Seal-like admin features
8. Email and retention flows
9. Localization

## 12. Ghi chú tư vấn quan trọng

1. `priceAfterDiscount` mới là giá one-time thực tế dùng để tính toán
2. `bulkPrice` chỉ nên dùng như giá tham khảo hiển thị
3. Subscription discount luôn áp sau bulk pricing
4. Với `fixed amount on invoice`, nên thiết kế UI nhấn mạnh vào total hơn là ép về unit price
5. Cần chuẩn bị tâm lý rằng việc đồng bộ hoàn hảo giữa hiển thị unit price ở storefront và cách cart/checkout render discount line có thể phụ thuộc vào giới hạn của Shopify surface
