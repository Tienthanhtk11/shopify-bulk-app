import { describe, expect, it } from "vitest";
import { resolvePartnerDashboardPlan } from "./partner-billing.server";
import { resolveEntitlements } from "./entitlements.server";

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
});
