import type { AdminApiContext } from "@shopify/shopify-app-remix/server";
import { getLatestMerchantPlan, recordMerchantEvent, syncMerchantPlanSnapshot } from "../models/merchant.server";
import { extractSubscriptionTimeline } from "./merchant-plan-timeline.shared";
import { resolvePartnerDashboardPlan } from "./partner-billing.server";

type ActiveSubscriptionSnapshot = {
  subscriptionGid: string | null;
  name: string;
  lineItemPlanNames: string[];
  status: string;
  isTest: boolean;
  billingInterval: string | null;
  activatedAt: Date | null;
  currentPeriodEndAt: Date | null;
  trialEndsAt: Date | null;
  canceledAt: Date | null;
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

function extractLineItemPlanNames(lineItems: unknown) {
  if (!Array.isArray(lineItems) || lineItems.length === 0) return [] as string[];

  return lineItems
    .map((lineItem) => {
      if (typeof lineItem !== "object" || lineItem === null) return null;
      const lineItemRecord = lineItem as Record<string, unknown>;
      const plan =
        typeof lineItemRecord.plan === "object" && lineItemRecord.plan !== null
          ? (lineItemRecord.plan as Record<string, unknown>)
          : null;

      return readString(plan?.name) || readString(lineItemRecord.name);
    })
    .filter((value): value is string => Boolean(value));
}

function planPriority(planKey: ActiveSubscriptionSnapshot["matchedPlanKey"]) {
  if (planKey === "scale") return 3;
  if (planKey === "growth") return 2;
  return 1;
}

function statusPriority(status: string) {
  if (status === "active") return 4;
  if (status === "trialing") return 3;
  if (status === "accepted") return 2;
  if (status === "pending") return 1;
  return 0;
}

function selectPrimarySnapshot(snapshots: ActiveSubscriptionSnapshot[]) {
  return [...snapshots].sort((left, right) => {
    const statusDelta = statusPriority(right.status) - statusPriority(left.status);
    if (statusDelta !== 0) return statusDelta;

    const planDelta = planPriority(right.matchedPlanKey) - planPriority(left.matchedPlanKey);
    if (planDelta !== 0) return planDelta;

    if (left.isTest !== right.isTest) {
      return Number(left.isTest) - Number(right.isTest);
    }

    return left.name.localeCompare(right.name);
  })[0];
}

function toSnapshot(subscription: Record<string, unknown>): ActiveSubscriptionSnapshot {
  const name = String(subscription.name || "Managed plan");
  const subscriptionGid = readString(subscription.id);
  const lineItemPlanNames = extractLineItemPlanNames(subscription.lineItems);
  const timeline = extractSubscriptionTimeline(subscription);
  const resolvedPlan = resolvePartnerDashboardPlan({
    planName: name,
    shopifySubscriptionGid: subscriptionGid,
    lineItemPlanNames,
  });

  return {
    subscriptionGid,
    name,
    lineItemPlanNames,
    status: normalizeStatus(subscription.status),
    isTest: readBoolean(subscription.test),
    billingInterval: extractBillingInterval(subscription.lineItems),
    activatedAt: timeline.activatedAt,
    currentPeriodEndAt: timeline.currentPeriodEndAt,
    trialEndsAt: timeline.trialEndsAt,
    canceledAt: timeline.canceledAt,
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
    latestPlan.shopifySubscriptionGid === next.subscriptionGid &&
    String(latestPlan.activatedAt || "") === String(next.activatedAt || "") &&
    String(latestPlan.currentPeriodEndAt || "") === String(next.currentPeriodEndAt || "") &&
    String(latestPlan.trialEndsAt || "") === String(next.trialEndsAt || "") &&
    String(latestPlan.canceledAt || "") === String(next.canceledAt || "")
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
          createdAt
          currentPeriodEnd
          trialDays
          lineItems {
            id
            plan {
              name
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

  const primary = selectPrimarySnapshot(snapshots);
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
      activatedAt: primary.activatedAt,
      currentPeriodEndAt: primary.currentPeriodEndAt,
      trialEndsAt: primary.trialEndsAt,
      canceledAt: primary.canceledAt,
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

  if (primary.matchedBy === "default") {
    await recordMerchantEvent({
      shopDomain,
      type: "billing.reconciled.unmapped_subscription",
      source: "admin.reconcile",
      severity: "warning",
      payload: {
        primary,
        totalSubscriptions: snapshots.length,
      },
    });
  }

  return {
    subscriptions: snapshots,
    persisted: changed,
    reason: changed ? ("snapshot_updated" as const) : ("unchanged" as const),
  };
}