# Ke Hoach Trien Khai Merchant Licensing Va Data Deletion

## Muc Tieu

- Tao merchant domain doc lap voi `Session`.
- Them nen tang cho licensing/billing state trong app.
- Them UI de merchant tu yeu cau xoa du lieu da luu trong app.
- Them compliance webhooks toi thieu de ho tro data lifecycle.
- Giu lai metadata toi thieu cho install/uninstall va billing history.

## Pham Vi Se Code Trong Dot Nay

1. Tao schema va migration cho cac bang merchant co ban:
   - `Merchant`
   - `MerchantPlan`
   - `MerchantEvent`
   - `MerchantDataDeletionRequest`
2. Tao service layer cho merchant va privacy deletion flow.
3. Tu dong upsert merchant record khi vao app admin.
4. Them route `/app/privacy` de merchant gui yeu cau xoa du lieu.
5. Mo rong `app/uninstalled` webhook de cap nhat merchant lifecycle.
6. Them scaffold cho compliance webhooks:
   - `customers/data_request`
   - `customers/redact`
   - `shop/redact`
7. Chay test va xu ly loi lien quan den thay doi.

## Ngoai Pham Vi Dot Nay

- Managed Pricing config trong Partner Dashboard.
- Full billing gate redirect sang plan selection page.
- Full entitlement engine theo tung plan.
- Async worker/queue hoan chinh cho data deletion jobs.
- Internal merchant admin screens.

## Thu Tu Trien Khai

### Buoc 1. Schema va migration

- Mo rong `prisma/schema.prisma`.
- Tao migration de luu merchant, plan, event va deletion request.

### Buoc 2. Service layer

- Them `merchant.server.ts`.
- Them `privacy.server.ts`.
- Dong goi logic upsert merchant, log events, tao deletion request.

### Buoc 3. Gan vao app root

- Update loader trong `app/routes/app.tsx`.
- Sau `authenticate.admin`, upsert merchant va cap nhat `lastSeenAt`.

### Buoc 4. Privacy UI

- Tao route `app/routes/app.privacy.tsx`.
- Hien danger zone va form xac nhan 2 buoc.
- Submit tao `MerchantDataDeletionRequest`.

### Buoc 5. Webhooks

- Update `webhooks.app.uninstalled.tsx` de mark merchant uninstalled va ghi event.
- Them 3 webhook routes compliance voi xu ly co ban va audit log.

### Buoc 6. Test

- Chay `npm run build` neu can.
- Chay `npm test`.
- Chay `npx prisma generate` neu schema thay doi.
- Sua cac loi do thay doi gay ra truoc khi ket thuc.

## Nguyen Tac Luu Tru Du Lieu

- Xoa du lieu van hanh va cau hinh theo delete request.
- Van giu metadata toi thieu cho install/uninstall va billing history.
- Khong xoa audit trail toi thieu phuc vu doi chieu va nghia vu phap ly.

## Cach Update Memory

- Sau moi buoc lon hoan tat, cap nhat `subbulk/memory.md`:
  - da lam gi
  - thay doi file nao
  - con ton dong gi

## Tieu Chi Hoan Thanh

- Co file plan ro rang.
- Co code schema + service + UI privacy + webhook scaffold.
- App build/test pass o muc lien quan.
- `memory.md` da duoc cap nhat sau moi buoc lon.