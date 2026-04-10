import type { AdminApiContext } from "@shopify/shopify-app-remix/server";
import type { MerchantPlan } from "../../generated/prisma/client";
import type { EntitledFeatureKey } from "./entitlements.shared";
import { getLatestMerchantPlan, recordMerchantEvent, upsertMerchantFromSession } from "../models/merchant.server";
import { getAdminPlanCatalogItem } from "./admin-plan-catalog.shared";
import { merchantCanWrite } from "./billing-access.shared";
import { reconcileMerchantBillingFromAdmin } from "./merchant-billing.server";
import type { InternalPlanKey } from "./partner-billing.server";
export { merchantCanAccessPath, merchantCanWrite, requiredFeatureForPath } from "./billing-access.shared";

function buildLockedFeatureRedirect(requiredFeature: EntitledFeatureKey) {
  const query = new URLSearchParams();
  query.set("lockedFeature", requiredFeature);
  query.set("upgradePlan", "premium");
  return `/app/settings?${query.toString()}`;
}

type MerchantSessionLike = {
  shop: string;
  email?: string | null;
};

export type BillingInterval = "monthly" | "annual";

type ShopifySubscriptionInput = {
  name: string;
  returnUrl: string;
  replacementBehavior: "APPLY_IMMEDIATELY" | "STANDARD";
  test: boolean;
  lineItems: Array<{
    plan: {
      appRecurringPricingDetails: {
        price: {
          amount: number;
          currencyCode: string;
        };
        interval: "EVERY_30_DAYS" | "ANNUAL";
      };
    };
  }>;
};

const APP_SUBSCRIPTION_CREATE_MUTATION = `#graphql
  mutation AppSubscriptionCreate(
    $name: String!
    $returnUrl: URL!
    $lineItems: [AppSubscriptionLineItemInput!]!
    $replacementBehavior: AppSubscriptionReplacementBehavior
    $test: Boolean
  ) {
    appSubscriptionCreate(
      name: $name
      returnUrl: $returnUrl
      lineItems: $lineItems
      replacementBehavior: $replacementBehavior
      test: $test
    ) {
      appSubscription {
        id
        name
      }
      confirmationUrl
      userErrors {
        field
        message
      }
    }
  }
`;

const APP_SUBSCRIPTION_CANCEL_MUTATION = `#graphql
  mutation AppSubscriptionCancel($id: ID!, $prorate: Boolean) {
    appSubscriptionCancel(id: $id, prorate: $prorate) {
      appSubscription {
        id
        name
        status
        test
        currentPeriodEnd
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function isTruthyEnvFlag(value: string | undefined) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["1", "true", "yes", "on", "ready"].includes(normalized);
}

function normalizeBillingInterval(value: FormDataEntryValue | string | null | undefined): BillingInterval {
  return String(value || "monthly").trim().toLowerCase() === "annual" ? "annual" : "monthly";
}

function parsePriceAmount(value: string) {
  const normalized = String(value || "").replace(/[^0-9.]/g, "").trim();
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Unsupported billing amount: ${value}`);
  }

  return parsed;
}

function getIntervalDetails(interval: BillingInterval) {
  return interval === "annual"
    ? {
        label: "Annual",
        priceField: "yearlyPrice" as const,
        shopifyInterval: "ANNUAL" as const,
      }
    : {
        label: "Monthly",
        priceField: "monthlyPrice" as const,
        shopifyInterval: "EVERY_30_DAYS" as const,
      };
}

function planRank(planKey: InternalPlanKey) {
  if (planKey === "scale") return 2;
  if (planKey === "growth") return 1;
  return 0;
}

function chooseReplacementBehavior(input: {
  currentPlanKey?: string | null;
  currentBillingInterval?: string | null;
  targetPlanKey: InternalPlanKey;
  targetBillingInterval: BillingInterval;
}): ShopifySubscriptionInput["replacementBehavior"] {
  const currentPlanKey = String(input.currentPlanKey || "free").trim().toLowerCase();
  const currentRank = planRank(
    currentPlanKey.includes("scale") ? "scale" : currentPlanKey.includes("growth") ? "growth" : "free",
  );
  const targetRank = planRank(input.targetPlanKey);
  const currentInterval = normalizeBillingInterval(input.currentBillingInterval);

  if (currentRank === 0) return "APPLY_IMMEDIATELY";
  if (targetRank > currentRank) return "APPLY_IMMEDIATELY";
  if (targetRank === currentRank && input.targetBillingInterval === "annual" && currentInterval === "monthly") {
    return "APPLY_IMMEDIATELY";
  }

  return "STANDARD";
}

function deriveEmbeddedHost(shopDomain: string | null | undefined) {
  const normalizedShop = String(shopDomain || "").trim().toLowerCase();
  if (!normalizedShop.endsWith(".myshopify.com")) return null;

  const shopHandle = normalizedShop.replace(/\.myshopify\.com$/i, "");
  const adminPath = `admin.shopify.com/store/${shopHandle}`;
  return Buffer.from(adminPath, "utf8").toString("base64");
}

function deriveShopHandle(shopDomain: string | null | undefined) {
  const normalizedShop = String(shopDomain || "").trim().toLowerCase();
  if (!normalizedShop.endsWith(".myshopify.com")) return null;

  return normalizedShop.replace(/\.myshopify\.com$/i, "");
}

function buildAdminAppReturnUrl(shopDomain: string | null | undefined) {
  const shopHandle = deriveShopHandle(shopDomain);
  if (!shopHandle) return null;

  const appHandle = String(process.env.SHOPIFY_ADMIN_APP_HANDLE || "bmg-bulk-subscription").trim();
  if (!appHandle) return null;

  return `https://admin.shopify.com/store/${shopHandle}/apps/${appHandle}/app/settings`;
}

export function getShopifyBillingState() {
  return {
    enabled: isTruthyEnvFlag(process.env.SHOPIFY_BILLING_TEST_FALLBACK_ENABLED),
    testMode: true,
  };
}

export function buildShopifySubscriptionInput(input: {
  appUrl: string;
  planKey: InternalPlanKey;
  billingInterval?: BillingInterval | string | null;
  currencyCode?: string;
  shopDomain?: string | null;
  host?: string | null;
  currentPlanKey?: string | null;
  currentBillingInterval?: string | null;
}): ShopifySubscriptionInput {
  const appUrl = String(input.appUrl || "").trim();
  if (!appUrl) {
    throw new Error("SHOPIFY_APP_URL must be configured before creating a Shopify billing subscription.");
  }

  if (input.planKey === "free") {
    throw new Error("Shopify billing subscriptions only support paid plans.");
  }

  const plan = getAdminPlanCatalogItem(input.planKey);
  if (!plan) {
    throw new Error(`Plan definition not found for key: ${input.planKey}`);
  }

  const billingState = getShopifyBillingState();
  const interval = normalizeBillingInterval(input.billingInterval);
  const intervalDetails = getIntervalDetails(interval);
  const amount = parsePriceAmount(plan[intervalDetails.priceField]);
  const adminReturnUrl = buildAdminAppReturnUrl(input.shopDomain);
  const returnUrl = adminReturnUrl ? new URL(adminReturnUrl) : new URL("/billing/return", appUrl);

  if (!adminReturnUrl) {
    const resolvedHost = input.host || deriveEmbeddedHost(input.shopDomain);
    if (input.shopDomain) {
      returnUrl.searchParams.set("shop", input.shopDomain);
    }
    if (resolvedHost) {
      returnUrl.searchParams.set("host", resolvedHost);
      returnUrl.searchParams.set("embedded", "1");
    }
  }

  return {
    name: `SubBulk ${plan.name} ${intervalDetails.label}`,
    returnUrl: returnUrl.toString(),
    replacementBehavior: chooseReplacementBehavior({
      currentPlanKey: input.currentPlanKey,
      currentBillingInterval: input.currentBillingInterval,
      targetPlanKey: input.planKey,
      targetBillingInterval: interval,
    }),
    test: billingState.testMode,
    lineItems: [
      {
        plan: {
          appRecurringPricingDetails: {
            price: {
              amount,
              currencyCode: input.currencyCode || "USD",
            },
            interval: intervalDetails.shopifyInterval,
          },
        },
      },
    ],
  };
}

export async function createShopifySubscription(input: {
  admin: AdminApiContext;
  shopDomain: string;
  planKey: InternalPlanKey;
  billingInterval?: BillingInterval | string | null;
  host?: string | null;
  currentPlan?: MerchantPlan | null;
}) {
  const billingState = getShopifyBillingState();
  if (!billingState.enabled) {
    throw new Error("Shopify billing is disabled in this environment.");
  }

  const merchant = await recordMerchantEvent({
    shopDomain: input.shopDomain,
    type: "billing.fetch_context",
    source: "billing.shopify",
    payload: { planKey: input.planKey },
  }).then(() => upsertMerchantFromSession({ shop: input.shopDomain } as MerchantSessionLike));

  const variables = buildShopifySubscriptionInput({
    appUrl: process.env.SHOPIFY_APP_URL || "",
    planKey: input.planKey,
    billingInterval: input.billingInterval,
    currencyCode: merchant?.currencyCode || "USD",
    shopDomain: input.shopDomain,
    host: input.host,
    currentPlanKey: input.currentPlan?.planKey,
    currentBillingInterval: input.currentPlan?.billingInterval,
  });

  const response = await input.admin.graphql(APP_SUBSCRIPTION_CREATE_MUTATION, { variables });
  const result = await response.json() as {
    data?: {
      appSubscriptionCreate?: {
        appSubscription?: {
          id?: string | null;
          name?: string | null;
        } | null;
        confirmationUrl?: string | null;
        userErrors?: Array<{
          field?: string[] | null;
          message?: string | null;
        }> | null;
      } | null;
    };
    errors?: Array<{ message?: string | null }> | null;
  };

  const payload = result.data?.appSubscriptionCreate;
  const graphErrors = Array.isArray(result.errors)
    ? result.errors.map((error) => error?.message).filter((message): message is string => Boolean(message))
    : [];
  const userErrors = Array.isArray(payload?.userErrors)
    ? payload.userErrors.map((error) => error?.message).filter((message): message is string => Boolean(message))
    : [];
  const confirmationUrl = String(payload?.confirmationUrl || "").trim();
  const normalizedInterval = normalizeBillingInterval(input.billingInterval);

  if (graphErrors.length > 0 || userErrors.length > 0 || !confirmationUrl) {
    const message = [...graphErrors, ...userErrors, !confirmationUrl ? "Shopify did not return a confirmation URL." : null]
      .filter((value): value is string => Boolean(value))
      .join(" ");

    await recordMerchantEvent({
      shopDomain: input.shopDomain,
      type: "billing.subscription.failed",
      source: "billing.shopify",
      severity: "warning",
      payload: {
        planKey: input.planKey,
        billingInterval: normalizedInterval,
        billingMode: billingState.testMode ? "test" : "live",
        errors: graphErrors,
        userErrors,
        rawResult: result,
      },
    });

    throw new Error(message || "Unable to create the Shopify billing subscription.");
  }

  await recordMerchantEvent({
    shopDomain: input.shopDomain,
    type: "billing.subscription.created",
    source: "billing.shopify",
    payload: {
      planKey: input.planKey,
      billingInterval: normalizedInterval,
      billingMode: billingState.testMode ? "test" : "live",
      confirmationUrl,
      returnUrl: variables.returnUrl,
      subscriptionId: payload?.appSubscription?.id || null,
      subscriptionName: payload?.appSubscription?.name || variables.name,
    },
  });

  return {
    confirmationUrl,
    returnUrl: variables.returnUrl,
    testMode: billingState.testMode,
  };
}

export async function cancelShopifySubscription(input: {
  admin: AdminApiContext;
  shopDomain: string;
  latestPlan?: MerchantPlan | null;
  prorate?: boolean;
}) {
  const latestPlan = input.latestPlan ?? await getLatestMerchantPlan(input.shopDomain);
  let subscriptionGid = latestPlan?.shopifySubscriptionGid || null;

  if (!subscriptionGid) {
    const reconciliation = await reconcileMerchantBillingFromAdmin(input.admin, input.shopDomain);
    const primarySubscription = reconciliation.subscriptions[0] || null;
    subscriptionGid = primarySubscription?.subscriptionGid || null;
  }

  if (!subscriptionGid) {
    throw new Error("No active Shopify subscription was found to cancel.");
  }

  const response = await input.admin.graphql(APP_SUBSCRIPTION_CANCEL_MUTATION, {
    variables: {
      id: subscriptionGid,
      prorate: Boolean(input.prorate),
    },
  });
  const result = await response.json() as {
    data?: {
      appSubscriptionCancel?: {
        appSubscription?: {
          id?: string | null;
          name?: string | null;
          status?: string | null;
          test?: boolean | null;
          currentPeriodEnd?: string | null;
          lineItems?: Array<unknown> | null;
        } | null;
        userErrors?: Array<{
          field?: string[] | null;
          message?: string | null;
        }> | null;
      } | null;
    };
    errors?: Array<{ message?: string | null }> | null;
  };

  const payload = result.data?.appSubscriptionCancel;
  const graphErrors = Array.isArray(result.errors)
    ? result.errors.map((error) => error?.message).filter((message): message is string => Boolean(message))
    : [];
  const userErrors = Array.isArray(payload?.userErrors)
    ? payload.userErrors.map((error) => error?.message).filter((message): message is string => Boolean(message))
    : [];
  const canceledSubscription = payload?.appSubscription || null;

  if (graphErrors.length > 0 || userErrors.length > 0 || !canceledSubscription?.id) {
    const message = [...graphErrors, ...userErrors, !canceledSubscription?.id ? "Shopify did not return the cancelled subscription." : null]
      .filter((value): value is string => Boolean(value))
      .join(" ");

    await recordMerchantEvent({
      shopDomain: input.shopDomain,
      type: "billing.subscription.cancel_failed",
      source: "billing.shopify",
      severity: "warning",
      payload: {
        subscriptionGid,
        prorate: Boolean(input.prorate),
        errors: graphErrors,
        userErrors,
        rawResult: result,
      },
    });

    throw new Error(message || "Unable to cancel the Shopify billing subscription.");
  }

  await recordMerchantEvent({
    shopDomain: input.shopDomain,
    type: "billing.subscription.cancelled",
    source: "billing.shopify",
    payload: {
      subscriptionGid: canceledSubscription.id,
      status: canceledSubscription.status || "cancelled",
      prorate: Boolean(input.prorate),
      currentPeriodEnd: canceledSubscription.currentPeriodEnd || null,
    },
  });

  return {
    subscriptionGid: canceledSubscription.id,
    status: String(canceledSubscription.status || "cancelled").toLowerCase(),
    currentPeriodEnd: canceledSubscription.currentPeriodEnd || null,
    billingInterval: latestPlan?.billingInterval || null,
    isTest: Boolean(canceledSubscription.test ?? latestPlan?.isTest ?? false),
    planName: String(canceledSubscription.name || latestPlan?.planName || "Managed plan"),
  };
}

export async function assertMerchantWriteAccess(input: {
  session: MerchantSessionLike;
  redirect: (url: string) => Response;
  requiredFeature?: EntitledFeatureKey | null;
}) {
  await upsertMerchantFromSession(input.session);
  const latestPlan = await getLatestMerchantPlan(input.session.shop);
  const access = merchantCanWrite(latestPlan, input.requiredFeature ?? null);

  if (!access.allowed) {
    if (access.reason === "feature_locked" && access.requiredFeature) {
      throw input.redirect(buildLockedFeatureRedirect(access.requiredFeature));
    }

    const query = new URLSearchParams();
    if (access.requiredFeature) {
      query.set("required", access.requiredFeature);
    }
    if (access.reason) {
      query.set("writeBlocked", access.reason);
    }
    throw input.redirect(`/app/billing?${query.toString()}`);
  }

  return {
    latestPlan,
    entitlements: access.entitlements,
  };
}