import type { AdminApiContext } from "@shopify/shopify-app-remix/server";
import { recordMerchantEvent, upsertMerchantFromSession } from "../models/merchant.server";
import { getAdminPlanCatalogItem } from "./admin-plan-catalog.shared";
import type { InternalPlanKey } from "./partner-billing.server";

export type BillingTestFallbackInterval = "monthly" | "annual";

type BillingTestFallbackState = {
  enabled: boolean;
  testOnly: boolean;
};

type ManualTestSubscriptionInput = {
  name: string;
  returnUrl: string;
  replacementBehavior: "APPLY_IMMEDIATELY";
  test: true;
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

function normalizeInterval(value: FormDataEntryValue | string | null | undefined): BillingTestFallbackInterval {
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

function getIntervalDetails(interval: BillingTestFallbackInterval) {
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

export function getBillingTestFallbackState(): BillingTestFallbackState {
  return {
    enabled: isTruthyEnvFlag(process.env.SHOPIFY_BILLING_TEST_FALLBACK_ENABLED),
    testOnly: true,
  };
}

export function buildManualTestSubscriptionInput(input: {
  appUrl: string;
  planKey: InternalPlanKey;
  billingInterval?: BillingTestFallbackInterval | string | null;
  currencyCode?: string;
}): ManualTestSubscriptionInput {
  const appUrl = String(input.appUrl || "").trim();
  if (!appUrl) {
    throw new Error("SHOPIFY_APP_URL must be configured before creating a test billing subscription.");
  }

  if (input.planKey === "free") {
    throw new Error("The manual test billing fallback only supports paid plans.");
  }

  const plan = getAdminPlanCatalogItem(input.planKey);
  if (!plan) {
    throw new Error(`Plan definition not found for key: ${input.planKey}`);
  }
  const interval = normalizeInterval(input.billingInterval);
  const intervalDetails = getIntervalDetails(interval);
  const amount = parsePriceAmount(plan[intervalDetails.priceField]);
  const returnUrl = new URL("/app/welcome", appUrl);
  returnUrl.searchParams.set("billingFallback", "1");
  returnUrl.searchParams.set("planKey", input.planKey);
  returnUrl.searchParams.set("billingInterval", interval);

  return {
    name: `SubBulk ${plan.name} ${intervalDetails.label} Test`,
    returnUrl: returnUrl.toString(),
    replacementBehavior: "APPLY_IMMEDIATELY",
    test: true,
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

export async function createManualTestSubscription(input: {
  admin: AdminApiContext;
  shopDomain: string;
  planKey: InternalPlanKey;
  billingInterval?: BillingTestFallbackInterval | string | null;
}) {
  const fallbackState = getBillingTestFallbackState();
  if (!fallbackState.enabled) {
    throw new Error("Manual test billing fallback is disabled in this environment.");
  }

  // Fetch or ensure merchant exists to get their currencyCode
  const merchant = await recordMerchantEvent({
    shopDomain: input.shopDomain,
    type: "billing.fetch_context",
    source: "billing.manual_test",
    payload: { planKey: input.planKey }
  }).then(() => upsertMerchantFromSession({ shop: input.shopDomain } as any));

  const variables = buildManualTestSubscriptionInput({
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

  if (graphErrors.length > 0 || userErrors.length > 0 || !confirmationUrl) {
    const message = [...graphErrors, ...userErrors, !confirmationUrl ? "Shopify did not return a confirmation URL." : null]
      .filter((value): value is string => Boolean(value))
      .join(" ");

    await recordMerchantEvent({
      shopDomain: input.shopDomain,
      type: "billing.test_subscription.failed",
      source: "billing.manual_test",
      severity: "warning",
      payload: {
        planKey: input.planKey,
        billingInterval: normalizeInterval(input.billingInterval),
        errors: graphErrors,
        userErrors,
        rawResult: result,
      },
    });

    throw new Error(message || "Unable to create the test subscription.");
  }

  await recordMerchantEvent({
    shopDomain: input.shopDomain,
    type: "billing.test_subscription.created",
    source: "billing.manual_test",
    payload: {
      planKey: input.planKey,
      billingInterval: normalizeInterval(input.billingInterval),
      confirmationUrl,
      returnUrl: variables.returnUrl,
      subscriptionId: payload?.appSubscription?.id || null,
      subscriptionName: payload?.appSubscription?.name || variables.name,
    },
  });

  return {
    confirmationUrl,
    returnUrl: variables.returnUrl,
  };
}