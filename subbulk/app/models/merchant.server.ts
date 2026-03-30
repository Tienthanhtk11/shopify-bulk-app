import prisma from "../db.server";

type MerchantSessionLike = {
  shop: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

function safeJson(value: unknown) {
  return JSON.stringify(value ?? {});
}

export async function getMerchantByShopDomain(shopDomain: string) {
  return prisma.merchant.findUnique({ where: { shopDomain } });
}

export async function upsertMerchantFromSession(session: MerchantSessionLike) {
  const shopName = session.shop.replace(/\.myshopify\.com$/i, "");

  return prisma.merchant.upsert({
    where: { shopDomain: session.shop },
    create: {
      shopDomain: session.shop,
      shopName,
      email: session.email ?? null,
      status: "active",
      installedAt: new Date(),
      lastSeenAt: new Date(),
    },
    update: {
      shopName,
      email: session.email ?? undefined,
      status: "active",
      lastSeenAt: new Date(),
      uninstalledAt: null,
    },
  });
}

export async function recordMerchantEvent(input: {
  shopDomain: string;
  type: string;
  source: string;
  severity?: string;
  payload?: unknown;
}) {
  const merchant = await getMerchantByShopDomain(input.shopDomain);
  if (!merchant) return null;

  return prisma.merchantEvent.create({
    data: {
      merchantId: merchant.id,
      type: input.type,
      source: input.source,
      severity: input.severity ?? "info",
      payloadJson: safeJson(input.payload),
    },
  });
}

export async function markMerchantUninstalled(shopDomain: string) {
  const merchant = await getMerchantByShopDomain(shopDomain);
  if (!merchant) return null;

  const updated = await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      status: "uninstalled",
      uninstalledAt: new Date(),
      lastSeenAt: new Date(),
    },
  });

  await recordMerchantEvent({
    shopDomain,
    type: "app.uninstalled",
    source: "webhook",
    payload: { shopDomain },
  });

  return updated;
}

export async function listMerchantPlans(shopDomain: string) {
  const merchant = await getMerchantByShopDomain(shopDomain);
  if (!merchant) return [];
  return prisma.merchantPlan.findMany({
    where: { merchantId: merchant.id },
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function getLatestMerchantPlan(shopDomain: string) {
  const merchant = await getMerchantByShopDomain(shopDomain);
  if (!merchant) return null;

  return prisma.merchantPlan.findFirst({
    where: { merchantId: merchant.id },
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function listMerchants() {
  const merchants = await prisma.merchant.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      deletionRequests: {
        orderBy: [{ createdAt: "desc" }],
        take: 1,
      },
      plans: {
        orderBy: [{ createdAt: "desc" }],
        take: 1,
      },
    },
  });

  return merchants.map((merchant) => ({
    ...merchant,
    latestPlan: merchant.plans[0] ?? null,
    latestDeletionRequest: merchant.deletionRequests[0] ?? null,
  }));
}

export async function getMerchantDetailById(id: string) {
  return prisma.merchant.findUnique({
    where: { id },
    include: {
      plans: { orderBy: [{ createdAt: "desc" }] },
      events: { orderBy: [{ createdAt: "desc" }], take: 50 },
      deletionRequests: { orderBy: [{ createdAt: "desc" }] },
    },
  });
}

export async function getLatestDeletionRequest(shopDomain: string) {
  const merchant = await getMerchantByShopDomain(shopDomain);
  if (!merchant) return null;

  return prisma.merchantDataDeletionRequest.findFirst({
    where: { merchantId: merchant.id },
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function wipeOperationalShopData(shopDomain: string) {
  await prisma.$transaction([
    prisma.widgetSettings.deleteMany({ where: { shop: shopDomain } }),
    prisma.widgetEnabledProduct.deleteMany({ where: { shop: shopDomain } }),
    prisma.subscriptionRule.deleteMany({ where: { shop: shopDomain } }),
    prisma.subscriptionOffer.deleteMany({ where: { shop: shopDomain } }),
  ]);
}

export async function scrubMerchantProfile(shopDomain: string) {
  const merchant = await getMerchantByShopDomain(shopDomain);
  if (!merchant) return null;

  return prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      shopName: null,
      email: null,
      countryCode: null,
      currencyCode: null,
      timezone: null,
      lastSeenAt: new Date(),
    },
  });
}

export async function createAndProcessDeletionRequest(input: {
  shopDomain: string;
  requestedBy: string;
  scope?: unknown;
  source: string;
}) {
  const request = await createDeletionRequest(input);
  await processDeletionRequestById(request.id, input.source);
  return prisma.merchantDataDeletionRequest.findUnique({ where: { id: request.id } });
}

export async function createDeletionRequest(input: {
  shopDomain: string;
  requestedBy: string;
  scope?: unknown;
  source: string;
}) {
  const merchant = await getMerchantByShopDomain(input.shopDomain);
  if (!merchant) {
    throw new Error("Merchant not found.");
  }

  const request = await prisma.merchantDataDeletionRequest.create({
    data: {
      merchantId: merchant.id,
      requestedBy: input.requestedBy,
      status: "pending",
      scopeJson: safeJson(
        input.scope ?? {
          widgetSettings: true,
          widgetEnabledProducts: true,
          subscriptionRules: true,
          subscriptionOffers: true,
        },
      ),
      auditNotes: `Requested via ${input.source}`,
    },
  });

  await recordMerchantEvent({
    shopDomain: input.shopDomain,
    type: "merchant.data_deletion.requested",
    source: input.source,
    payload: { requestId: request.id },
  });

  return request;
}

export async function processDeletionRequestById(requestId: string, source = "job") {
  const request = await prisma.merchantDataDeletionRequest.findUnique({
    where: { id: requestId },
    include: { merchant: true },
  });

  if (!request) {
    throw new Error("Deletion request not found.");
  }

  if (request.status === "completed") {
    return request;
  }

  await prisma.merchantDataDeletionRequest.update({
    where: { id: request.id },
    data: { status: "processing" },
  });

  try {
    await wipeOperationalShopData(request.merchant.shopDomain);
    await scrubMerchantProfile(request.merchant.shopDomain);
    await prisma.merchantDataDeletionRequest.update({
      where: { id: request.id },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });
    await recordMerchantEvent({
      shopDomain: request.merchant.shopDomain,
      type: "merchant.data_deletion.completed",
      source,
      payload: { requestId: request.id },
    });
  } catch (error) {
    await prisma.merchantDataDeletionRequest.update({
      where: { id: request.id },
      data: {
        status: "failed",
        failureReason: error instanceof Error ? error.message : "Unknown error",
      },
    });
    throw error;
  }

  return prisma.merchantDataDeletionRequest.findUnique({ where: { id: request.id } });
}

export async function processPendingDeletionRequests(limit = 10) {
  const pending = await prisma.merchantDataDeletionRequest.findMany({
    where: { status: "pending" },
    orderBy: [{ createdAt: "asc" }],
    take: limit,
  });

  const results: Array<{ id: string; status: string }> = [];

  for (const request of pending) {
    try {
      const processed = await processDeletionRequestById(request.id, "job.queue");
      results.push({ id: request.id, status: processed?.status || "completed" });
    } catch {
      results.push({ id: request.id, status: "failed" });
    }
  }

  return results;
}

export async function syncMerchantPlanSnapshot(input: {
  shopDomain: string;
  planKey: string;
  planName: string;
  status: string;
  billingInterval?: string | null;
  isTest?: boolean;
  shopifySubscriptionGid?: string | null;
  rawPayload?: unknown;
}) {
  const merchant = await getMerchantByShopDomain(input.shopDomain);
  if (!merchant) return null;

  return prisma.merchantPlan.create({
    data: {
      merchantId: merchant.id,
      planKey: input.planKey,
      planName: input.planName,
      status: input.status,
      billingInterval: input.billingInterval ?? null,
      isTest: input.isTest ?? false,
      shopifySubscriptionGid: input.shopifySubscriptionGid ?? null,
      rawPayloadJson: safeJson(input.rawPayload),
      activatedAt: input.status === "active" ? new Date() : null,
    },
  });
}