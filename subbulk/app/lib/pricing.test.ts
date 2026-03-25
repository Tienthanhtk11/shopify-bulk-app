import { describe, expect, it } from "vitest";
import {
  activeTier,
  oneTimeTotal,
  parseBulkTiers,
  subscriptionTotalFixed,
  subscriptionTotalPercent,
  tierQuantityLabel,
} from "./pricing";

describe("parseBulkTiers", () => {
  it("parses valid JSON array", () => {
    const raw = [
      { qtyBreakpoint: 1, priceAfterDiscount: 7.39, bulkPrice: 9.29 },
      { qtyBreakpoint: 11, priceAfterDiscount: 7.29, bulkPrice: 9.09 },
    ];
    const tiers = parseBulkTiers(raw);
    expect(tiers).toHaveLength(2);
    expect(tiers[0]!.qtyBreakpoint).toBe(1);
    expect(tiers[1]!.priceAfterDiscount).toBe(7.29);
  });

  it("rejects invalid rows", () => {
    expect(parseBulkTiers(null)).toEqual([]);
    expect(parseBulkTiers({})).toEqual([]);
    expect(parseBulkTiers([{ qtyBreakpoint: 0 }])).toEqual([]);
  });

  it("sorts by breakpoint", () => {
    const tiers = parseBulkTiers([
      { qtyBreakpoint: 11, priceAfterDiscount: 7, bulkPrice: 9 },
      { qtyBreakpoint: 1, priceAfterDiscount: 8, bulkPrice: 10 },
    ]);
    expect(tiers[0]!.qtyBreakpoint).toBe(1);
  });
});

describe("activeTier", () => {
  const tiers = parseBulkTiers([
    { qtyBreakpoint: 1, priceAfterDiscount: 7.39, bulkPrice: 9.29 },
    { qtyBreakpoint: 11, priceAfterDiscount: 7.29, bulkPrice: 9.09 },
  ]);

  it("uses tier 1 for qty 1–10", () => {
    expect(activeTier(tiers, 1)!.qtyBreakpoint).toBe(1);
    expect(activeTier(tiers, 10)!.qtyBreakpoint).toBe(1);
  });

  it("uses tier 11 for qty 11+", () => {
    expect(activeTier(tiers, 11)!.qtyBreakpoint).toBe(11);
    expect(activeTier(tiers, 100)!.qtyBreakpoint).toBe(11);
  });
});

describe("oneTimeTotal", () => {
  const tiers = parseBulkTiers([
    { qtyBreakpoint: 1, priceAfterDiscount: 7.39, bulkPrice: 9.29 },
    { qtyBreakpoint: 11, priceAfterDiscount: 7.29, bulkPrice: 9.09 },
  ]);

  it("matches spec: 11 * 7.29", () => {
    const t = activeTier(tiers, 11)!;
    expect(oneTimeTotal(t, 11)).toBe(80.19);
  });
});

describe("subscriptionTotalPercent", () => {
  const tiers = parseBulkTiers([
    { qtyBreakpoint: 11, priceAfterDiscount: 7.29, bulkPrice: 9.09 },
  ]);
  const t = tiers[0]!;

  it("matches spec: 10% off unit then * qty", () => {
    expect(subscriptionTotalPercent(t, 11, 10)).toBe(72.17);
  });
});

describe("subscriptionTotalFixed", () => {
  const tiers = parseBulkTiers([
    { qtyBreakpoint: 11, priceAfterDiscount: 7.29, bulkPrice: 9.09 },
  ]);
  const t = tiers[0]!;

  it("subtracts fixed from subtotal", () => {
    expect(subscriptionTotalFixed(t, 11, 2)).toBe(78.19);
  });
});

describe("tierQuantityLabel", () => {
  const tiers = parseBulkTiers([
    { qtyBreakpoint: 1, priceAfterDiscount: 7, bulkPrice: 9 },
    { qtyBreakpoint: 11, priceAfterDiscount: 6, bulkPrice: 8 },
  ]);

  it("formats ranges", () => {
    expect(tierQuantityLabel(tiers[0]!, tiers, 0)).toBe("1–10");
    expect(tierQuantityLabel(tiers[1]!, tiers, 1)).toBe("11+");
  });
});
