import type { MerchantPlan } from "@prisma/client";
import type { InternalPlanKey } from "./partner-billing.server";
import type { EntitledFeatureKey } from "./entitlements.shared";

export type MerchantEntitlements = {
  planKey: InternalPlanKey;
  planName: string;
  isPaid: boolean;
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

export function resolveEntitlements(plan: MerchantPlan | null): MerchantEntitlements {
  const rawPlanKey = normalizePlanKey(plan?.planKey || plan?.planName || "free");
  const planKey: InternalPlanKey = rawPlanKey.includes("scale")
    ? "scale"
    : rawPlanKey.includes("growth")
      ? "growth"
      : "free";

  if (planKey === "scale") {
    const features = baseFeatures();
    return {
      planKey,
      planName: plan?.planName || "Scale",
      isPaid: true,
      features: {
        ...features,
        subscriptionManagement: true,
        subscriptionRules: true,
        advancedOffers: true,
        analytics: true,
        automation: true,
        prioritySupport: true,
      },
    };
  }

  if (planKey === "growth") {
    const features = baseFeatures();
    return {
      planKey,
      planName: plan?.planName || "Growth",
      isPaid: true,
      features: {
        ...features,
        subscriptionManagement: true,
        subscriptionRules: true,
        advancedOffers: true,
        analytics: true,
      },
    };
  }

  return {
    planKey: "free",
    planName: plan?.planName || "Free",
    isPaid: false,
    features: baseFeatures(),
  };
}