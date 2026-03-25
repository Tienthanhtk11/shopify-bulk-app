-- CreateTable
CREATE TABLE "SubscriptionOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "productGid" TEXT NOT NULL,
    "sellingPlanGroupGid" TEXT,
    "defaultSellingPlanGid" TEXT,
    "discountType" TEXT NOT NULL,
    "discountValue" TEXT NOT NULL,
    "planIntervalsJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WidgetSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "buyMoreHeading" TEXT NOT NULL DEFAULT 'Buy More, Save More',
    "purchaseOptionsLabel" TEXT NOT NULL DEFAULT 'Purchase options',
    "primaryColorHex" TEXT NOT NULL DEFAULT '#D73C35',
    "accentGreenHex" TEXT NOT NULL DEFAULT '#2E7D32',
    "subscriptionFooter" TEXT NOT NULL DEFAULT 'Powered by SubBulk',
    "freeShippingNote" TEXT NOT NULL DEFAULT 'Free Shipping on all orders over $99.99',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "SubscriptionOffer_shop_idx" ON "SubscriptionOffer"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "WidgetSettings_shop_key" ON "WidgetSettings"("shop");
