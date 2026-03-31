import { describe, expect, it } from "vitest";
import { merchantCanAccessPath, merchantCanWrite, requiredFeatureForPath } from "./billing-access.shared";

describe("requiredFeatureForPath", () => {
  it("maps protected app paths to the expected feature", () => {
    expect(requiredFeatureForPath("/app/analytics")).toBe("analytics");
    expect(requiredFeatureForPath("/app/offers/new")).toBe("advancedOffers");
    expect(requiredFeatureForPath("/app/subscriptions")).toBe("subscriptionManagement");
    expect(requiredFeatureForPath("/app/subscription-rule/editor")).toBe("subscriptionRules");
    expect(requiredFeatureForPath("/app/additional")).toBe("automation");
    expect(requiredFeatureForPath("/app/settings")).toBe(null);
  });
});

describe("merchantCanAccessPath", () => {
  it("denies analytics for free merchants", () => {
    const access = merchantCanAccessPath("/app/analytics", {
      planKey: "free",
      planName: "Free",
      status: "active",
    } as never);

    expect(access.allowed).toBe(false);
    expect(access.requiredFeature).toBe("analytics");
  });

  it("allows analytics for active growth merchants", () => {
    const access = merchantCanAccessPath("/app/analytics", {
      planKey: "growth",
      planName: "Growth",
      status: "active",
    } as never);

    expect(access.allowed).toBe(true);
    expect(access.requiredFeature).toBe("analytics");
  });
});

describe("merchantCanWrite", () => {
  it("blocks a frozen paid merchant even without a feature-specific check", () => {
    const access = merchantCanWrite(
      {
        planKey: "growth",
        planName: "Growth",
        status: "frozen",
      } as never,
      null,
    );

    expect(access.allowed).toBe(false);
    expect(access.reason).toBe("billing_inactive");
  });

  it("blocks a feature write when the feature is locked", () => {
    const access = merchantCanWrite(
      {
        planKey: "free",
        planName: "Free",
        status: "active",
      } as never,
      "subscriptionManagement",
    );

    expect(access.allowed).toBe(false);
    expect(access.reason).toBe("feature_locked");
  });

  it("allows an entitled paid merchant to write", () => {
    const access = merchantCanWrite(
      {
        planKey: "scale",
        planName: "Scale",
        status: "active",
      } as never,
      "automation",
    );

    expect(access.allowed).toBe(true);
    expect(access.reason).toBe(null);
  });
});