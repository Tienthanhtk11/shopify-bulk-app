import type { MerchantPlan } from "../../generated/prisma/client";
import { getCanonicalPlanName } from "./admin-plan-catalog.shared";
import type { InternalPlanKey } from "./partner-billing.server";
import type { EntitledFeatureKey } from "./entitlements.shared";

const ACTIVE_PLAN_STATUSES = new Set(["active", "trialing"]);

export type MerchantEntitlements = {
  planKey: InternalPlanKey;
  planName: string;
  isPaid: boolean;
  billingStatus: string;
  hasActivePlanAccess: boolean;
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
    subscriptionRules: false,
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

function hasPaidAccess(status: string) {
  return ACTIVE_PLAN_STATUSES.has(status);
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
  const billingStatus = normalizePlanStatus(plan?.status);
  const planKey: InternalPlanKey = rawPlanKey.includes("scale")
    ? "scale"
    : rawPlanKey.includes("growth")
      ? "growth"
      : "free";
  const hasActivePlanAccess = planKey === "free" || hasPaidAccess(billingStatus);
  const resolvedFeatures = hasActivePlanAccess ? resolveFeatureMatrix(planKey) : baseFeatures();

  return {
    planKey,
    planName: getCanonicalPlanName(plan?.planKey || plan?.planName || planKey),
    isPaid: planKey !== "free" && hasActivePlanAccess,
    billingStatus,
    hasActivePlanAccess,
    features: resolvedFeatures,
  };
}