import prisma from "../db.server";
import { resolveEntitlements } from "../services/entitlements.server";
import { listAdminPlanDefinitions } from "../services/admin-plan-catalog.server";

type MerchantSessionLike = {
  shop: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

function safeJson(value: unknown) {
  return JSON.stringify(value ?? {});
}

function parseJsonObject(value: string | null | undefined) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
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

export async function listMerchantSubscriptionOverview() {
  const merchants = await prisma.merchant.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      plans: {
        orderBy: [{ createdAt: "desc" }],
        take: 1,
      },
    },
  });
  const catalog = await listAdminPlanDefinitions();
  const catalogMap = new Map(catalog.map((item) => [item.key, item]));

  return merchants.map((merchant) => {
    const latestPlan = merchant.plans[0] ?? null;
    const entitlements = resolveEntitlements(latestPlan);
    const planCatalog = catalogMap.get(entitlements.planKey) || null;
    return {
      merchantId: merchant.id,
      shopDomain: merchant.shopDomain,
      merchantStatus: merchant.status,
      email: merchant.email,
      latestPlan,
      entitlements,
      catalog: planCatalog,
      latestPlanMeta: parseJsonObject(latestPlan?.rawPayloadJson),
      isBlockedPaidMerchant:
        entitlements.planKey !== "free" && !entitlements.hasActivePlanAccess,
    };
  });
}

export async function listMerchantAdminSummaries() {
  const merchants = await prisma.merchant.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      plans: {
        orderBy: [{ createdAt: "desc" }],
        take: 12,
      },
      events: {
        orderBy: [{ createdAt: "desc" }],
        take: 20,
      },
    },
  });

  const catalog = await listAdminPlanDefinitions();
  const catalogMap = new Map(catalog.map((item) => [item.key, item]));

  return merchants.map((merchant) => {
    const latestPlan = merchant.plans[0] ?? null;
    const entitlements = resolveEntitlements(latestPlan);
    const planCatalog = catalogMap.get(entitlements.planKey) || null;

    return {
      merchantId: merchant.id,
      shopDomain: merchant.shopDomain,
      merchantStatus: merchant.status,
      email: merchant.email,
      installedAt: merchant.installedAt,
      uninstalledAt: merchant.uninstalledAt,
      latestPlan,
      entitlements,
      catalog: planCatalog,
      latestPlanMeta: parseJsonObject(latestPlan?.rawPayloadJson),
      isBlockedPaidMerchant:
        entitlements.planKey !== "free" && !entitlements.hasActivePlanAccess,
      plans: merchant.plans,
      events: merchant.events,
    };
  });
}

export async function createManualMerchant(input: {
  actor: string;
  shopDomain: string;
  shopName?: string;
  email?: string;
  countryCode?: string;
  currencyCode?: string;
  timezone?: string;
}) {
  const merchant = await prisma.merchant.create({
    data: {
      shopDomain: input.shopDomain,
      shopName: input.shopName || null,
      email: input.email || null,
      countryCode: input.countryCode || null,
      currencyCode: input.currencyCode || null,
      timezone: input.timezone || null,
      status: "active",
      installedAt: new Date(),
      lastSeenAt: new Date(),
    },
  });

  await prisma.merchantEvent.create({
    data: {
      merchantId: merchant.id,
      type: "merchant.created.manual",
      severity: "info",
      source: "internal.portal",
      payloadJson: safeJson({
        actor: input.actor,
        shopName: input.shopName || null,
        email: input.email || null,
      }),
    },
  });

  return merchant;
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

export async function updateMerchantStatusById(input: {
  merchantId: string;
  status: string;
  actor: string;
  note?: string;
}) {
  const merchant = await prisma.merchant.update({
    where: { id: input.merchantId },
    data: {
      status: input.status,
      uninstalledAt: input.status === "uninstalled" ? new Date() : null,
      lastSeenAt: new Date(),
    },
  });

  await prisma.merchantEvent.create({
    data: {
      merchantId: merchant.id,
      type: "merchant.status.updated",
      severity: input.status === "disabled" ? "warning" : "info",
      source: "internal.portal",
      payloadJson: safeJson({
        actor: input.actor,
        status: input.status,
        note: input.note || null,
      }),
    },
  });

  return merchant;
}

export async function createMerchantInternalNote(input: {
  merchantId: string;
  actor: string;
  note: string;
  severity?: string;
}) {
  return prisma.merchantEvent.create({
    data: {
      merchantId: input.merchantId,
      type: "merchant.internal_note",
      severity: input.severity || "info",
      source: "internal.portal",
      payloadJson: safeJson({
        actor: input.actor,
        note: input.note,
      }),
    },
  });
}

export async function createAdminMerchantPlanSnapshot(input: {
  merchantId: string;
  actor: string;
  planKey: string;
  planName: string;
  status: string;
  billingInterval?: string | null;
  isTest?: boolean;
  note?: string;
}) {
  const plan = await prisma.merchantPlan.create({
    data: {
      merchantId: input.merchantId,
      planKey: input.planKey,
      planName: input.planName,
      status: input.status,
      billingInterval: input.billingInterval ?? null,
      isTest: input.isTest ?? false,
      activatedAt: input.status === "active" || input.status === "trialing" ? new Date() : null,
      rawPayloadJson: safeJson({
        source: "internal.portal",
        actor: input.actor,
        note: input.note || null,
      }),
    },
  });

  await prisma.merchantEvent.create({
    data: {
      merchantId: input.merchantId,
      type: "merchant.plan.assigned",
      severity: "info",
      source: "internal.portal",
      payloadJson: safeJson({
        actor: input.actor,
        planKey: input.planKey,
        planName: input.planName,
        status: input.status,
        billingInterval: input.billingInterval ?? null,
        isTest: input.isTest ?? false,
        note: input.note || null,
      }),
    },
  });

  return plan;
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