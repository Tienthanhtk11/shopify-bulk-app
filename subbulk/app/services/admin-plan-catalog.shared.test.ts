import { describe, expect, it } from "vitest";
import {
  getAdminPlanCatalogItem,
  getCanonicalPlanName,
  normalizePlanDisplayName,
} from "./admin-plan-catalog.shared";

describe("getCanonicalPlanName", () => {
  it("maps legacy growth and scale aliases to the merchant-facing catalog labels", () => {
    expect(getCanonicalPlanName("growth")).toBe("Premium");
    expect(getCanonicalPlanName("premium")).toBe("Premium");
    expect(getCanonicalPlanName("scale")).toBe("Ultra");
    expect(getCanonicalPlanName("ultra")).toBe("Ultra");
  });

  it("falls back to Free for unknown values", () => {
    expect(getCanonicalPlanName("enterprise")).toBe("Free");
    expect(getCanonicalPlanName(undefined)).toBe("Free");
  });
});

describe("normalizePlanDisplayName", () => {
  it("normalizes blank or legacy display names to the canonical catalog names", () => {
    expect(normalizePlanDisplayName("growth", "")).toBe("Premium");
    expect(normalizePlanDisplayName("scale", "Ultra")).toBe("Ultra");
    expect(normalizePlanDisplayName("growth", "growth")).toBe("Premium");
  });

  it("preserves custom display names when they do not match the legacy aliases", () => {
    expect(normalizePlanDisplayName("growth", "Premium Plus")).toBe("Premium Plus");
  });
});

describe("getAdminPlanCatalogItem", () => {
  it("returns the matching catalog item when the key exists", () => {
    expect(getAdminPlanCatalogItem("scale")?.name).toBe("Ultra");
  });

  it("falls back to the Free plan for unknown keys", () => {
    expect(getAdminPlanCatalogItem("legacy-pro")?.key).toBe("free");
  });
});
