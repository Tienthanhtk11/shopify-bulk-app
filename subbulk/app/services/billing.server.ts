import type { MerchantPlan } from "@prisma/client";
import type { EntitledFeatureKey } from "./entitlements.shared";
import { resolveEntitlements } from "./entitlements.server";

export function requiredFeatureForPath(pathname: string) {
  if (pathname.startsWith("/app/analytics")) return "analytics" as const;
  if (pathname.startsWith("/app/offers")) return "advancedOffers" as const;
  if (pathname.startsWith("/app/subscriptions")) return "subscriptionManagement" as const;
  if (pathname.startsWith("/app/subscription-rule")) return "subscriptionRules" as const;
  if (pathname.startsWith("/app/additional")) return "automation" as const;
  return null;
}

export function merchantCanAccessPath(pathname: string, plan: MerchantPlan | null) {
  const requiredFeature = requiredFeatureForPath(pathname) as EntitledFeatureKey | null;
  if (!requiredFeature) {
    return { allowed: true, requiredFeature: null };
  }

  const entitlements = resolveEntitlements(plan);
  return {
    allowed: entitlements.features[requiredFeature],
    requiredFeature,
  };
}