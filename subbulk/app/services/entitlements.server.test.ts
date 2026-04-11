import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveEntitlements } from "./entitlements.server";

describe("resolveEntitlements", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-11T10:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the base free feature matrix when no plan is present", () => {
    const result = resolveEntitlements(null);

    expect(result.planKey).toBe("free");
    expect(result.planName).toBe("Free");
    expect(result.isPaid).toBe(false);
    expect(result.hasActivePlanAccess).toBe(true);
    expect(result.features).toMatchObject({
      settings: true,
      widgetProducts: true,
      subscriptionRules: true,
      subscriptionManagement: false,
      analytics: false,
      automation: false,
    });
  });

  it("unlocks paid growth features when the billing status is active", () => {
    const result = resolveEntitlements({
      planKey: "growth",
      planName: "Growth",
      status: "active",
      currentPeriodEndAt: new Date("2026-05-01T00:00:00.000Z"),
    } as never);

    expect(result.planKey).toBe("growth");
    expect(result.planName).toBe("Premium");
    expect(result.isPaid).toBe(true);
    expect(result.hasActivePlanAccess).toBe(true);
    expect(result.features.analytics).toBe(true);
    expect(result.features.automation).toBe(false);
  });

  it("marks active paid plans with canceledAt as cancel_scheduled while preserving access", () => {
    const result = resolveEntitlements({
      planKey: "scale",
      planName: "Ultra",
      status: "active",
      canceledAt: new Date("2026-04-10T00:00:00.000Z"),
      currentPeriodEndAt: new Date("2026-04-20T00:00:00.000Z"),
    } as never);

    expect(result.billingStatus).toBe("cancel_scheduled");
    expect(result.isCancellationScheduled).toBe(true);
    expect(result.hasActivePlanAccess).toBe(true);
    expect(result.features.automation).toBe(true);
  });

  it("falls back to the base matrix once a cancelled paid plan has already expired", () => {
    const result = resolveEntitlements({
      planKey: "growth",
      planName: "Premium",
      status: "cancelled",
      currentPeriodEndAt: new Date("2026-03-01T00:00:00.000Z"),
      canceledAt: new Date("2026-02-20T00:00:00.000Z"),
    } as never);

    expect(result.isPaid).toBe(false);
    expect(result.hasActivePlanAccess).toBe(false);
    expect(result.features.analytics).toBe(false);
    expect(result.features.subscriptionRules).toBe(true);
  });
});
