import { describe, expect, it } from "vitest";
import { resolvePartnerDashboardPlan } from "./partner-billing.server";
import { resolveEntitlements } from "./entitlements.server";
import { isMerchantPlanCancellationScheduled } from "./merchant-plan-timeline.shared";

describe("resolvePartnerDashboardPlan", () => {
  it("maps exact plan names from env-compatible aliases", () => {
    const resolved = resolvePartnerDashboardPlan({ planName: "Growth" });
    expect(resolved.planKey).toBe("growth");
    expect(resolved.matchedBy).toBe("name");
  });

  it("falls back to heuristics when needed", () => {
    const resolved = resolvePartnerDashboardPlan({ planName: "Scale Annual" });
    expect(resolved.planKey).toBe("scale");
    expect(resolved.matchedBy).toBe("heuristic");
  });

  it("maps by gid when env provides a full Shopify gid", () => {
    process.env.PARTNER_PLAN_SCALE_GIDS = "gid://shopify/AppSubscription/12345";

    const resolved = resolvePartnerDashboardPlan({
      shopifySubscriptionGid: "gid://shopify/AppSubscription/12345",
      planName: "Managed plan",
    });

    expect(resolved.planKey).toBe("scale");
    expect(resolved.matchedBy).toBe("gid");

    delete process.env.PARTNER_PLAN_SCALE_GIDS;
  });

  it("uses line item plan names as a secondary signal", () => {
    const resolved = resolvePartnerDashboardPlan({
      planName: "Managed plan",
      lineItemPlanNames: ["SubBulk Premium Monthly"],
    });

    expect(resolved.planKey).toBe("growth");
    expect(resolved.matchedBy).toBe("heuristic");
  });
});

describe("resolveEntitlements", () => {
  it("locks paid features when the latest plan is frozen", () => {
    const entitlements = resolveEntitlements({
      planKey: "growth",
      planName: "Growth",
      status: "frozen",
    } as never);

    expect(entitlements.planKey).toBe("growth");
    expect(entitlements.hasActivePlanAccess).toBe(false);
    expect(entitlements.isPaid).toBe(false);
    expect(entitlements.features.subscriptionManagement).toBe(false);
    expect(entitlements.features.analytics).toBe(false);
  });

  it("unlocks scale-only features for active scale plans", () => {
    const entitlements = resolveEntitlements({
      planKey: "scale",
      planName: "Scale",
      status: "active",
    } as never);

    expect(entitlements.hasActivePlanAccess).toBe(true);
    expect(entitlements.isPaid).toBe(true);
    expect(entitlements.features.automation).toBe(true);
    expect(entitlements.features.prioritySupport).toBe(true);
  });

  it("keeps paid access until the current period ends after auto-renew is cancelled", () => {
    const entitlements = resolveEntitlements({
      planKey: "growth",
      planName: "Growth",
      status: "cancelled",
      currentPeriodEndAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    } as never);

    expect(entitlements.hasActivePlanAccess).toBe(true);
    expect(entitlements.isPaid).toBe(true);
    expect(entitlements.isCancellationScheduled).toBe(true);
    expect(entitlements.billingStatus).toBe("cancelled");
    expect(entitlements.features.subscriptionManagement).toBe(true);
  });

  it("marks active plans with canceledAt as cancel-scheduled", () => {
    const entitlements = resolveEntitlements({
      planKey: "growth",
      planName: "Growth",
      status: "active",
      canceledAt: new Date(),
      currentPeriodEndAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    } as never);

    expect(entitlements.hasActivePlanAccess).toBe(true);
    expect(entitlements.isPaid).toBe(true);
    expect(entitlements.isCancellationScheduled).toBe(true);
    expect(entitlements.billingStatus).toBe("cancel_scheduled");
  });
});

describe("isMerchantPlanCancellationScheduled", () => {
  it("returns true when canceledAt is set before the period end", () => {
    expect(isMerchantPlanCancellationScheduled({
      planKey: "growth",
      status: "active",
      canceledAt: new Date(),
      currentPeriodEndAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })).toBe(true);
  });

  it("returns false after the paid period has already expired", () => {
    expect(isMerchantPlanCancellationScheduled({
      planKey: "growth",
      status: "cancelled",
      canceledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      currentPeriodEndAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    })).toBe(false);
  });
});
