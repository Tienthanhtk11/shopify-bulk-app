-- CreateTable
CREATE TABLE "SubscriptionRule" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Subscribe & save',
    "internalName" TEXT,
    "planSelectorLabel" TEXT NOT NULL DEFAULT 'Deliver every',
    "discountType" TEXT NOT NULL,
    "discountValue" TEXT NOT NULL,
    "planIntervalsJson" TEXT NOT NULL DEFAULT '[]',
    "sellingPlanGroupGid" TEXT,
    "defaultSellingPlanGid" TEXT,
    "productScope" TEXT NOT NULL DEFAULT 'WIDGET_ENABLED',
    "explicitProductGidsJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionRule_shop_key" ON "SubscriptionRule"("shop");
