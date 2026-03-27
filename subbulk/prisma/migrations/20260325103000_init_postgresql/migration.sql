-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionOffer" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "productGid" TEXT NOT NULL,
    "sellingPlanGroupGid" TEXT,
    "defaultSellingPlanGid" TEXT,
    "discountType" TEXT NOT NULL,
    "discountValue" TEXT NOT NULL,
    "planIntervalsJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WidgetSettings" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "buyMoreHeading" TEXT NOT NULL DEFAULT 'Buy More, Save More',
    "purchaseOptionsLabel" TEXT NOT NULL DEFAULT 'Purchase options',
    "primaryColorHex" TEXT NOT NULL DEFAULT '#D73C35',
    "accentGreenHex" TEXT NOT NULL DEFAULT '#2E7D32',
    "subscriptionFooter" TEXT NOT NULL DEFAULT 'Powered by SubBulk',
    "freeShippingNote" TEXT NOT NULL DEFAULT 'Free Shipping on all orders over $99.99',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WidgetSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubscriptionOffer_shop_idx" ON "SubscriptionOffer"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "WidgetSettings_shop_key" ON "WidgetSettings"("shop");
