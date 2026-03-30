# Bao Cao Trien Khai SubBulk

## Tinh Nang Da Hoan Thanh

- Widget subscription tren storefront thong qua theme app extension.
- Khoi lua chon mua hang tren trang san pham.
- Preview discount theo tung shop va bo widget settings cho storefront.
- Customer portal de xem va tu quan ly subscription.
- Danh sach subscription trong customer portal.
- Cac thao tac trong portal: tam dung, tiep tuc, huy.
- Ho tro New Customer Accounts qua Customer Account UI extension.
- Danh sach subscription hien truc tiep tren trang Profile cua customer.
- Cac thao tac tu phuc vu ngay trong Customer Account: tam dung, tiep tuc, huy.
- Tong quan trang thai subscription trong Customer Account: Tong so, Dang hoat dong, Tam dung, Da huy.
- Bang quan ly subscription hien dai tren trang Profile cua customer.
- Trang admin cau hinh widget settings.
- Trang admin kiem soat san pham nao duoc hien widget.
- Trang admin quan ly subscription rules va subscription offers.

## Cac Man Hinh Da Co

- Trang san pham storefront voi widget `SubBulk purchase options`.
- Customer portal tai `/apps/subbulk/portal`.
- Trang Profile trong Customer Account voi block `SubBulk subscriptions`.
- Trang Admin Settings de cau hinh widget.
- Trang Admin Widget Products de bat tat widget theo san pham.
- Trang Admin Subscriptions de merchant theo doi subscription.
- Cac trang admin cho subscription rules va offers.

## Cac Diem Can Cai Thien

- Them modal xac nhan truoc khi huy.
- Tiep tuc tinh chinh UI bang Customer Account.
- Them filter hoac tab cho cac trang thai Dang hoat dong, Tam dung, Da huy.
- Them pagination hoac lazy loading cho customer co nhieu subscription.
- Hien thi ro hon tan suat subscription va selling plan details.
- Them cac thao tac nang cao nhu bo qua don tiep theo, doi tan suat, doi so luong.
- Dong bo logic giua portal va Customer Account de giam trung lap.
- Tang logging va monitoring cho cac public routes.
- Them test tu dong cho cac luong tam dung, tiep tuc, huy.
- Them E2E test cho storefront va Customer Account.
- Xu ly canh bao CSS build con lai.
- Cai thien giao dien mobile cho bang subscription.
- Cai thien error state va empty state cho customer.
- Can nhac bo portal neu Customer Account self-service da du.

## Thiet Ke Tinh Nang Dang Ky Merchant Va Goi License

### Quyết Định San Pham Dua Tren Shopify

- Su dung Shopify Managed Pricing lam mo hinh license chinh cho public app nay.
- Ly do: Shopify tu host trang gia, xu ly recurring billing, free trial, proration, charge approval va cap nhat billing voi it custom code hon so voi tu dung Billing API.
- Phu hop voi app hien tai: SubBulk co ve can cac goi co dinh theo chu ky, khong phai usage billing phuc tap, nen phu hop voi gioi han cua Managed Pricing.
- Gioi han quan trong: Managed Pricing chi ho tro cac goi recurring co dinh. Neu sau nay can usage-based billing, can mot thiet ke billing khac.

### Mo Hinh Thuong Mai De Xuat

- Public plans: toi da 3 goi hien thi chinh.
- De xuat bo goi:
	- Free: cho phep cai app, cau hinh gioi han, onboarding kieu sandbox.
	- Growth: day du widget, quan ly rules, merchant analytics, support co ban.
	- Scale: toan bo tinh nang cua Growth cong them support nang cao, onboarding premium, va cac tinh nang analytics hoac automation se co sau nay.
- Private plans tuy chon: dung private plans cua Shopify cho merchant enterprise hoac merchant co thoa thuan rieng.
- Chu ky billing: uu tien co ca thang va nam.
- Trial: 7 den 14 ngay cho cac goi tra phi.

### Hanh Trinh Merchant

1. Merchant cai app.
2. OAuth hoan tat va app tao moi hoac cap nhat merchant record.
3. Root embedded app kiem tra billing entitlement.
4. Neu merchant chua co entitlement tra phi hop le, chuyen huong sang trang chon goi do Shopify host.
5. Merchant chon goi va phe duyet subscription charge.
6. Shopify chuyen huong ve route chao mung cua app kem theo thong tin charge.
7. App xac minh trang thai billing bang du lieu billing tu Shopify Admin, khong chi dua vao query string sau redirect.
8. App luu snapshot cua plan dang hieu luc va entitlement vao co so du lieu rieng.
9. Merchant tiep tuc qua onboarding checklist.
10. Trong suot vong doi merchant, thay doi billing duoc dong bo tu billing checks cua Shopify cong voi billing webhooks.

### Phan Cua Shopify Va Phan Cua App

- Shopify quan ly:
	- trang chon goi duoc host san
	- luong phe duyet charge
	- recurring billing thuc te
	- proration va deferral khi doi goi
	- huy subscription tu dong khi uninstall
	- theo doi trial cua managed pricing
- App quan ly:
	- merchant record va lifecycle state noi bo
	- feature entitlements ben trong san pham
	- onboarding state va setup checklist
	- billing status snapshot phuc vu van hanh noi bo
	- support tools, ghi chu noi bo, risk flags, health dashboard
	- xu ly compliance webhooks va quy trinh xoa du lieu

### Cac Domain Noi Bo Can Bo Sung

- Merchant
	- ban ghi chuan cho moi shop
	- ton tai xuyen suot uninstall va reinstall
- MerchantInstallation
	- theo doi lich su cai, go cai dat, cai lai
- MerchantPlan
	- goi dang dang ky, chu ky billing, trial state, entitlement dang hieu luc
- MerchantBillingEvent
	- theo doi nang goi, ha goi, huy, freeze, phe duyet, declined
- MerchantEntitlement
	- cac feature flags thuc su duoc app su dung
- MerchantOnboarding
	- checklist va tien do onboarding
- MerchantHealthSnapshot
	- anh chup suc khoe van hanh hien tai cua merchant
- MerchantEvent
	- audit trail cho onboarding, billing, compliance va support

### De Xuat Prisma Models

- Merchant
	- id
	- shopDomain
	- shopGid
	- shopName
	- email
	- countryCode
	- currencyCode
	- timezone
	- status
	- installedAt
	- uninstalledAt
	- lastSeenAt
- MerchantPlan
	- id
	- merchantId
	- shopifySubscriptionGid
	- planKey
	- planName
	- billingModel
	- billingInterval
	- status
	- isTest
	- activatedAt
	- currentPeriodEndAt
	- trialEndsAt
	- canceledAt
	- rawPayloadJson
- MerchantEntitlement
	- id
	- merchantId
	- planKey
	- maxEnabledProducts
	- allowAdvancedAnalytics
	- allowPrioritySupport
	- allowMultiRuleSetup
	- allowFuturePremiumFeatures
	- effectiveFrom
	- effectiveTo
- MerchantOnboarding
	- merchantId
	- appInstalled
	- planSelected
	- billingApproved
	- widgetConfigured
	- productsSelected
	- subscriptionRuleCreated
	- themeWidgetVerified
	- firstCustomerActivityDetected
	- completedAt
- MerchantEvent
	- id
	- merchantId
	- type
	- severity
	- source
	- payloadJson
	- createdAt

### Mo Hinh Trang Thai Cot Loi

- Merchant status:
	- pending_install
	- active
	- frozen
	- uninstalled
	- disabled
- Plan status:
	- none
	- pending_approval
	- active
	- trialing
	- canceled
	- frozen
	- declined
- Onboarding status:
	- not_started
	- in_progress
	- complete
	- blocked

### Chien Luoc Entitlement

- Khong dung truc tiep ten plan billing trong toan bo app.
- Map ten plan cua Shopify sang `planKey` noi bo.
- Map `planKey` sang entitlements tai mot noi duy nhat.
- Vi du:
	- free -> chi preview widget, toi da 5 san pham bat widget, khong co advanced analytics
	- growth -> day du widget, day du rules, analytics, support tieu chuan
	- scale -> toan bo growth, them cac tinh nang automation nang cao trong tuong lai va support premium
- Cach nay giup tranh viec doi copy marketing cua plan tren Shopify lam vo logic trong app.

### Thiet Ke Man Hinh

#### 1. Billing Gate

- Vi tri: root loader cua app hoac layout bao ve cao nhat.
- Muc tieu: chan truy cap vao cac routes premium neu merchant chua co goi hop le dang hoat dong.
- Hanh vi:
	- neu da co active plan, cho di tiep
	- neu chua co plan, chuyen huong sang trang gia do Shopify host
	- neu plan dang pending hoac frozen, hien billing resolution screen

#### 2. Man Hinh Chao Mung Va Xac Nhan Goi

- Route vi du: `/app/welcome`
- Muc tieu: xac nhan charge approval sau khi Shopify redirect ve tu trang chon goi.
- Hien thi:
	- goi da chon
	- trang thai billing
	- CTA cho buoc tiep theo
	- bat dau onboarding checklist

#### 3. Trang Billing Cua Merchant

- Route vi du: `/app/billing`
- Hien thi:
	- goi hien tai
	- chu ky billing
	- so ngay trial con lai
	- ngay gia han tiep theo
	- trang thai hien tai
	- cac tinh nang da mo khoa
	- CTA nang goi
	- CTA ha goi
	- CTA lien he support cho private plan

#### 3b. Trang Bao Mat Va Xoa Du Lieu

- Route vi du: `/app/privacy`
- Muc tieu: cho merchant tu gui yeu cau xoa du lieu da luu trong app.
- Hien thi:
	- mo ta ro nhung du lieu se bi xoa
	- mo ta ro nhung metadata van duoc giu lai o muc toi thieu
	- canh bao day la hanh dong khong the hoan tac
	- checkbox xac nhan
	- buoc xac nhan lan hai bang cach nhap ten shop hoac nhap `DELETE`
	- button `Yeu cau xoa du lieu da luu trong app`
	- trang thai yeu cau: chua gui, dang xu ly, da hoan tat, that bai
- Luu y UX:
	- dat trong khu vuc `Danger zone`
	- khong dat gan cac nut thao tac thong thuong de tranh bam nham
	- can link sang privacy policy ngay trong khu vuc nay

#### 4. Trang Admin Noi Bo Cho Merchant

- Danh cho team noi bo, khong phai merchant-facing.
- Hien thi:
	- ho so merchant
	- trang thai plan theo Shopify
	- entitlement snapshot
	- tien do onboarding
	- health state
	- cac incidents va su kien compliance gan day

### Thiet Ke Routes Va Services

- Them service layer:
	- `app/services/merchant.server.ts`
	- `app/services/billing.server.ts`
	- `app/services/entitlements.server.ts`
	- `app/services/compliance.server.ts`
- Them routes:
	- `app/routes/app.welcome.tsx`
	- `app/routes/app.billing.tsx`
	- `app/routes/webhooks.customers.data_request.tsx`
	- `app/routes/webhooks.customers.redact.tsx`
	- `app/routes/webhooks.shop.redact.tsx`
	- `app/routes/webhooks.app.subscriptions_update.tsx`

### Cac Webhook Can Co Cho Bo Tinh Nang Nay

- Mandatory compliance webhooks de du dieu kien phan phoi tren App Store:
	- `customers/data_request`
	- `customers/redact`
	- `shop/redact`
- Cac lifecycle webhooks da lien quan san:
	- `app/uninstalled`
	- `app/scopes_update`
- Billing webhook nen co de dong bo vong doi cua plan:
	- `app_subscriptions/update`
	- neu sau nay dung one-time charge, bo sung `app_purchases_one_time/update`

### Compliance Va Quy Tac Luu Tru Du Lieu

- `app/uninstalled`:
	- danh dau merchant da uninstall
	- thu hoi quyen truy cap dang hoat dong trong app
	- dung cac merchant jobs dinh ky
	- giu lai ban ghi noi bo toi thieu trong khi cho redact workflow
- `shop/redact`:
	- xoa hoac an danh du lieu cua shop trong DB
	- xoa cau hinh merchant va du lieu lien quan den customer, tru khi phap ly bat buoc phai giu
- `customers/redact`:
	- xoa du lieu ca nhan cua customer lien quan den merchant
- `customers/data_request`:
	- tap hop cac du lieu co the xuat ra va hoan tat quy trinh van hanh trong thoi gian Shopify yeu cau

### Co Che Merchant Tu Yeu Cau Xoa Du Lieu

- App nen co them co che self-service de merchant chu dong yeu cau xoa du lieu cua shop ngay trong giao dien admin cua app.
- Co che nay khong thay the mandatory compliance webhooks cua Shopify, ma la mot kenh yeu cau truc tiep tu merchant.
- Luong xu ly de xuat:
	1. Merchant vao trang `Privacy` hoac `Data settings`.
	2. Merchant doc ro pham vi du lieu se bi xoa va metadata se duoc giu lai.
	3. Merchant xac nhan hanh dong bang checkbox va buoc xac nhan lan hai.
	4. App tao `MerchantDataDeletionRequest` voi trang thai `pending`.
	5. App dua merchant vao che do han che cac thao tac ghi neu can.
	6. Job nen chay bat dong bo de xoa du lieu va ghi lai ket qua.
	7. Sau khi xoa xong, request chuyen sang `completed` va them audit event.
- Du lieu nen xoa:
	- widget settings
	- widget enabled products
	- subscription rules va subscription offers luu trong DB noi bo
	- ghi chu noi bo lien quan den merchant
	- health snapshots chi tiet
	- ban sao du lieu customer hoac cac cache lien quan neu co
	- log co chua du lieu ca nhan, neu khong co nghia vu phap ly phai giu
- Du lieu nen giu lai o muc toi thieu:
	- lich su cai dat va go cai dat
	- lich su goi dang ky va billing status
	- subscription charge id hoac subscription gid
	- audit records toi thieu cho uninstall, billing, va delete request
	- metadata can thiet cho doi chieu tai chinh, chong gian lan, hoac nghia vu phap ly
- Cach giu lai du lieu khuyen nghi:
	- khong giu lai ban sao day du cua cau hinh merchant sau khi xoa
	- chi giu metadata toi thieu va uu tien an danh hoa hoac pseudonymize neu co the
	- tach ro `du lieu van hanh` va `billing/audit metadata duoc giu lai`
- Model nen them:
	- `MerchantDataDeletionRequest`
- `MerchantDataDeletionRequest` nen co:
	- id
	- merchantId
	- requestedBy
	- requestedAt
	- status
	- scopeJson
	- completedAt
	- failureReason
	- auditNotes

### Nguyen Tac Product Cho Nut Xoa Du Lieu

- Khong nen dat ten nut la `Xoa tai khoan` neu he thong van giu lai metadata toi thieu.
- Ten de xuat ro nghia hon:
	- `Yeu cau xoa du lieu da luu trong app`
	- hoac `Xoa du lieu cau hinh va van hanh cua shop`
- Can mo ta ro ngay trong UI:
	- du lieu cau hinh va du lieu van hanh trong app se bi xoa
	- lich su cai dat, go cai dat, va metadata billing/subscription toi thieu van duoc giu lai cho muc dich doi chieu, van hanh va nghia vu phap ly
- Can co audit trail cho hanh dong nay de support team co the doi chieu ve sau.

### Luong Van Hanh Khi Doi Goi

- Nang goi:
	- merchant chon goi cao hon
	- Shopify tu xu ly proration
	- app nhan redirect sau approval va sau do nhan billing update webhook
	- app refresh entitlement ngay sau xac nhan va refresh lai khi webhook den
- Ha goi:
	- merchant chon goi thap hon
	- thoi diem hieu luc co the bi deferral tuy theo quy tac billing cua Shopify
	- app can hien trang thai scheduled downgrade neu Shopify cho biet goi cu van con hieu luc den het chu ky
- Uninstall:
	- Shopify tu dong huy subscription
	- app chuyen merchant sang `uninstalled`
- Billing account bi dong bang:
	- app subscription co the bi freeze
	- app nen chuyen merchant sang `frozen` va hien huong dan xu ly

### Chinh Sach Truy Cap De Xuat

- Merchant goi Free duoc truy cap:
	- install flow
	- onboarding co ban
	- lua chon san pham gioi han
	- preview-only hoac mot phan tinh nang bi gioi han
- Merchant goi Paid duoc truy cap:
	- day du widget configuration
	- day du subscription rule management
	- trang analytics cho subscriptions
	- toan bo tinh nang premium cho merchant
- Merchant frozen hoac canceled:
	- chi doc o billing page va support page
	- chan cac write actions phu thuoc vao paid entitlement

### De Xuat Backlog

#### Phase 1: Nen tang billing

- Them merchant va plan models.
- Dua vao `planKey` noi bo va bang map entitlement.
- Them billing gate o root app.
- Them routes `/app/welcome` va `/app/billing`.
- Cau hinh Managed Pricing trong Partner Dashboard.

#### Phase 2: Dong bo lifecycle

- Them compliance webhooks.
- Them webhook `APP_SUBSCRIPTIONS_UPDATE`.
- Luu billing events va doi chieu lai plan status.
- Them workflows cho uninstall va redact.

#### Phase 3: Van hanh merchant

- Them trang danh sach va chi tiet merchant cho team noi bo.
- Them onboarding checklist state.
- Them support notes va event timeline cho merchant.
- Them health snapshot va cac billing risk flags.

#### Phase 4: Cong cu tang truong

- Them private plan support.
- Them playbook noi bo cho discount va trial extension.
- Them risk alerts chu dong cho merchant frozen, declined, hoac onboarding chua hoan tat.

### Tieu Chi Nghiem Thu

- Merchant moi co the cai app, duoc chuyen den trang chon goi, phe duyet goi, va quay lai app voi billing state da duoc xac minh.
- App luu merchant record doc lap voi Shopify session record.
- App map duoc billing state cua Shopify sang entitlement noi bo va gate premium routes mot cach nhat quan.
- App xu ly dung cac tinh huong nang goi, ha goi, uninstall, reinstall, va frozen billing.
- App co xu ly mandatory compliance webhooks theo yeu cau de phan phoi tren App Store.
- Nhan su van hanh noi bo xem duoc plan, entitlement, onboarding state, va lifecycle events cua merchant.
- Merchant co the tu gui yeu cau xoa du lieu trong app thong qua UI an toan, co xac nhan 2 buoc.
- Sau khi xu ly xong, du lieu cau hinh va du lieu van hanh cua merchant trong app bi loai bo, trong khi lich su install/uninstall va metadata billing/subscription toi thieu van duoc giu lai.

### Khuyen Nghi Cuoi Cung

- Doi voi app nay, uu tien chon Managed Pricing truoc.
- Xay domain merchant noi bo xoay quanh billing state cua Shopify, thay vi tu xay mot he thong license rieng.
- Tach billing status, entitlement state, va compliance lifecycle thanh 3 concern rieng.
- Implement compliance webhooks va merchant records truoc khi dua plan-based access control vao production.
