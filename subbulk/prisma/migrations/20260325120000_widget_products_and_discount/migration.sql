-- AlterTable
ALTER TABLE "WidgetSettings" ADD COLUMN "defaultSubscriptionDiscountType" TEXT NOT NULL DEFAULT 'PERCENTAGE';
ALTER TABLE "WidgetSettings" ADD COLUMN "defaultSubscriptionDiscountValue" TEXT NOT NULL DEFAULT '10';

-- CreateTable
CREATE TABLE "WidgetEnabledProduct" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "productGid" TEXT NOT NULL,
    "productTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WidgetEnabledProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WidgetEnabledProduct_shop_productGid_key" ON "WidgetEnabledProduct"("shop", "productGid");

-- CreateIndex
CREATE INDEX "WidgetEnabledProduct_shop_idx" ON "WidgetEnabledProduct"("shop");
