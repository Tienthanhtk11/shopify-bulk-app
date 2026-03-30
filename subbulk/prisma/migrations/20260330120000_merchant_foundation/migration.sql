-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "shopDomain" TEXT NOT NULL,
    "shopGid" TEXT,
    "shopName" TEXT,
    "email" TEXT,
    "countryCode" TEXT,
    "currencyCode" TEXT,
    "timezone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uninstalledAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantPlan" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "shopifySubscriptionGid" TEXT,
    "planKey" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "billingModel" TEXT NOT NULL DEFAULT 'MANAGED_PRICING',
    "billingInterval" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "isTest" BOOLEAN NOT NULL DEFAULT false,
    "activatedAt" TIMESTAMP(3),
    "currentPeriodEndAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "rawPayloadJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchantPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantEvent" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "source" TEXT NOT NULL,
    "payloadJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchantEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantDataDeletionRequest" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "scopeJson" TEXT NOT NULL DEFAULT '{}',
    "completedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "auditNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchantDataDeletionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_shopDomain_key" ON "Merchant"("shopDomain");

-- CreateIndex
CREATE INDEX "MerchantPlan_merchantId_idx" ON "MerchantPlan"("merchantId");

-- CreateIndex
CREATE INDEX "MerchantPlan_merchantId_status_idx" ON "MerchantPlan"("merchantId", "status");

-- CreateIndex
CREATE INDEX "MerchantEvent_merchantId_idx" ON "MerchantEvent"("merchantId");

-- CreateIndex
CREATE INDEX "MerchantEvent_merchantId_type_idx" ON "MerchantEvent"("merchantId", "type");

-- CreateIndex
CREATE INDEX "MerchantDataDeletionRequest_merchantId_idx" ON "MerchantDataDeletionRequest"("merchantId");

-- CreateIndex
CREATE INDEX "MerchantDataDeletionRequest_merchantId_status_idx" ON "MerchantDataDeletionRequest"("merchantId", "status");

-- AddForeignKey
ALTER TABLE "MerchantPlan" ADD CONSTRAINT "MerchantPlan_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantEvent" ADD CONSTRAINT "MerchantEvent_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantDataDeletionRequest" ADD CONSTRAINT "MerchantDataDeletionRequest_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;