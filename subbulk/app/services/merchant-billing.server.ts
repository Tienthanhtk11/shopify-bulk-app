import type { AdminApiContext } from "@shopify/shopify-app-remix/server";
import { getLatestMerchantPlan, recordMerchantEvent, syncMerchantPlanSnapshot } from "../models/merchant.server";
import { resolvePartnerDashboardPlan } from "./partner-billing.server";

type ActiveSubscriptionSnapshot = {
  subscriptionGid: string | null;
  name: string;
  status: string;
  isTest: boolean;
  billingInterval: string | null;
  matchedPlanKey: "free" | "growth" | "scale";
  matchedBy: "gid" | "name" | "heuristic" | "default";
  rawPayload: unknown;
};

function readString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function readBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function normalizeStatus(value: unknown) {
  return String(value || "unknown").toLowerCase();
}

function extractBillingInterval(lineItems: unknown) {
  if (!Array.isArray(lineItems) || lineItems.length === 0) return null;

  const firstLineItem =
    typeof lineItems[0] === "object" && lineItems[0] !== null
      ? (lineItems[0] as Record<string, unknown>)
      : null;
  const plan =
    firstLineItem && typeof firstLineItem.plan === "object" && firstLineItem.plan !== null
      ? (firstLineItem.plan as Record<string, unknown>)
      : null;
  const pricingDetails =
    plan && typeof plan.pricingDetails === "object" && plan.pricingDetails !== null
      ? (plan.pricingDetails as Record<string, unknown>)
      : null;

  return readString(pricingDetails?.interval);
}

function toSnapshot(subscription: Record<string, unknown>): ActiveSubscriptionSnapshot {
  const name = String(subscription.name || "Managed plan");
  const subscriptionGid = readString(subscription.id);
  const resolvedPlan = resolvePartnerDashboardPlan({
    planName: name,
    shopifySubscriptionGid: subscriptionGid,
  });

  return {
    subscriptionGid,
    name,
    status: normalizeStatus(subscription.status),
    isTest: readBoolean(subscription.test),
    billingInterval: extractBillingInterval(subscription.lineItems),
    matchedPlanKey: resolvedPlan.planKey,
    matchedBy: resolvedPlan.matchedBy,
    rawPayload: subscription,
  };
}

function snapshotChanged(
  latestPlan: Awaited<ReturnType<typeof getLatestMerchantPlan>>,
  next: ActiveSubscriptionSnapshot,
) {
  if (!latestPlan) return true;

  return !(
    latestPlan.planKey === next.matchedPlanKey &&
    latestPlan.planName === next.name &&
    latestPlan.status === next.status &&
    latestPlan.billingInterval === next.billingInterval &&
    latestPlan.isTest === next.isTest &&
    latestPlan.shopifySubscriptionGid === next.subscriptionGid
  );
}

export async function reconcileMerchantBillingFromAdmin(admin: AdminApiContext, shopDomain: string) {
  const response = await admin.graphql(
    `#graphql
    query SubBulkCurrentAppInstallationSubscriptions {
      currentAppInstallation {
        activeSubscriptions {
          id
          name
          status
          test
          lineItems {
            id
            plan {
              pricingDetails {
                __typename
                ... on AppRecurringPricing {
                  interval
                }
              }
            }
          }
        }
      }
    }`,
  );

  const result = await response.json();
  const subscriptions = Array.isArray(result?.data?.currentAppInstallation?.activeSubscriptions)
    ? result.data.currentAppInstallation.activeSubscriptions
    : [];
  const snapshots = subscriptions
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(toSnapshot);

  if (snapshots.length === 0) {
    await recordMerchantEvent({
      shopDomain,
      type: "billing.reconciled.no_active_subscription",
      source: "admin.reconcile",
      severity: "info",
      payload: result,
    });

    return {
      subscriptions: [],
      persisted: false,
      reason: "no_active_subscription" as const,
    };
  }

  const primary = snapshots[0];
  const latestPlan = await getLatestMerchantPlan(shopDomain);
  const changed = snapshotChanged(latestPlan, primary);

  if (changed) {
    await syncMerchantPlanSnapshot({
      shopDomain,
      planKey: primary.matchedPlanKey,
      planName: primary.name,
      status: primary.status,
      billingInterval: primary.billingInterval,
      isTest: primary.isTest,
      shopifySubscriptionGid: primary.subscriptionGid,
      rawPayload: {
        source: "admin.reconcile",
        matchedBy: primary.matchedBy,
        subscriptions,
      },
    });
  }

  await recordMerchantEvent({
    shopDomain,
    type: "billing.reconciled",
    source: "admin.reconcile",
    severity: changed ? "info" : "debug",
    payload: {
      changed,
      primary,
      totalSubscriptions: snapshots.length,
    },
  });

  return {
    subscriptions: snapshots,
    persisted: changed,
    reason: changed ? ("snapshot_updated" as const) : ("unchanged" as const),
  };
}