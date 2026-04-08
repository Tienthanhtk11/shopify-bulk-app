import type { AdminApiContext } from "@shopify/shopify-app-remix/server";
import type { MerchantPlan } from "../../generated/prisma/client";
import type { EntitledFeatureKey } from "./entitlements.shared";
import { getLatestMerchantPlan, recordMerchantEvent, upsertMerchantFromSession } from "../models/merchant.server";
import { getAdminPlanCatalogItem } from "./admin-plan-catalog.shared";
import { merchantCanWrite } from "./billing-access.shared";
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
  replacementBehavior: "APPLY_IMMEDIATELY";
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
  const returnUrl = new URL("/app/welcome", appUrl);
  returnUrl.searchParams.set("billingSource", "shopify");
  returnUrl.searchParams.set("planKey", input.planKey);
  returnUrl.searchParams.set("billingInterval", interval);

  return {
    name: `SubBulk ${plan.name} ${intervalDetails.label}`,
    returnUrl: returnUrl.toString(),
    replacementBehavior: "APPLY_IMMEDIATELY",
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