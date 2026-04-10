import type { MerchantPlan } from "../../generated/prisma/client";
import { getCanonicalPlanName } from "./admin-plan-catalog.shared";
import type { InternalPlanKey } from "./partner-billing.server";
import type { EntitledFeatureKey } from "./entitlements.shared";
import { isExpiredMerchantPlan, isMerchantPlanCancellationScheduled } from "./merchant-plan-timeline.shared";

const ACTIVE_PLAN_STATUSES = new Set(["active", "trialing"]);

export type MerchantEntitlements = {
  planKey: InternalPlanKey;
  planName: string;
  isPaid: boolean;
  billingStatus: string;
  hasActivePlanAccess: boolean;
  isCancellationScheduled: boolean;
  accessEndsAt: Date | null;
  features: Record<EntitledFeatureKey, boolean>;
};

function normalizePlanKey(value: string | null | undefined) {
  return String(value || "free")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "") || "free";
}

function baseFeatures() {
  return {
    settings: true,
    widgetProducts: true,
    subscriptionManagement: false,
    subscriptionRules: true,
    advancedOffers: false,
    analytics: false,
    automation: false,
    prioritySupport: false,
    merchantAdmin: false,
  } satisfies Record<EntitledFeatureKey, boolean>;
}

function normalizePlanStatus(value: string | null | undefined) {
  return String(value || "none")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "") || "none";
}

function hasPaidAccess(plan: MerchantPlan | null, status: string) {
  if (ACTIVE_PLAN_STATUSES.has(status)) {
    return true;
  }

  if (status === "cancelled" || status === "canceled") {
    return !isExpiredMerchantPlan(plan);
  }

  return false;
}

function resolveFeatureMatrix(planKey: InternalPlanKey) {
  const features = baseFeatures();

  if (planKey === "scale") {
    return {
      ...features,
      subscriptionManagement: true,
      subscriptionRules: true,
      advancedOffers: true,
      analytics: true,
      automation: true,
      prioritySupport: true,
    };
  }

  if (planKey === "growth") {
    return {
      ...features,
      subscriptionManagement: true,
      subscriptionRules: true,
      advancedOffers: true,
      analytics: true,
    };
  }

  return features;
}

export function resolveEntitlements(plan: MerchantPlan | null): MerchantEntitlements {
  const rawPlanKey = normalizePlanKey(plan?.planKey || plan?.planName || "free");
  const normalizedStatus = normalizePlanStatus(plan?.status);
  const planKey: InternalPlanKey = rawPlanKey.includes("scale")
    ? "scale"
    : rawPlanKey.includes("growth")
      ? "growth"
      : "free";
  const isCancellationScheduled = isMerchantPlanCancellationScheduled(plan);
  const billingStatus = isCancellationScheduled && normalizedStatus === "active"
    ? "cancel_scheduled"
    : normalizedStatus;
  const hasActivePlanAccess = planKey === "free" || hasPaidAccess(plan, normalizedStatus);
  const resolvedFeatures = hasActivePlanAccess ? resolveFeatureMatrix(planKey) : baseFeatures();

  return {
    planKey,
    planName: getCanonicalPlanName(plan?.planKey || plan?.planName || planKey),
    isPaid: planKey !== "free" && hasActivePlanAccess,
    billingStatus,
    hasActivePlanAccess,
    isCancellationScheduled,
    accessEndsAt: plan?.currentPeriodEndAt ?? null,
    features: resolvedFeatures,
  };
}