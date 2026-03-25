/**
 * SubBulk — logic giá tier + subscription (đồng bộ với confirmed-product-spec).
 */

export type BulkTier = {
  qtyBreakpoint: number;
  priceAfterDiscount: number;
  bulkPrice: number;
};

export type DiscountType = "PERCENTAGE" | "FIXED";

export function roundMoney(amount: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(amount * f) / f;
}

export function parseBulkTiers(raw: unknown): BulkTier[] {
  if (!Array.isArray(raw)) return [];
  const tiers: BulkTier[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const qty = Number(r.qtyBreakpoint);
    const pad = Number(r.priceAfterDiscount);
    const bulk = Number(r.bulkPrice);
    if (
      !Number.isFinite(qty) ||
      !Number.isFinite(pad) ||
      !Number.isFinite(bulk) ||
      qty < 1
    ) {
      continue;
    }
    tiers.push({
      qtyBreakpoint: Math.floor(qty),
      priceAfterDiscount: pad,
      bulkPrice: bulk,
    });
  }
  return tiers.sort((a, b) => a.qtyBreakpoint - b.qtyBreakpoint);
}

export function activeTier(
  tiers: BulkTier[],
  quantity: number,
): BulkTier | null {
  if (tiers.length === 0) return null;
  const q = Math.max(1, Math.floor(quantity));
  let current = tiers[0]!;
  for (const t of tiers) {
    if (q >= t.qtyBreakpoint) current = t;
  }
  return current;
}

export function oneTimeUnitPrice(tier: BulkTier): number {
  return tier.priceAfterDiscount;
}

export function oneTimeTotal(tier: BulkTier, quantity: number): number {
  const q = Math.max(1, Math.floor(quantity));
  return roundMoney(oneTimeUnitPrice(tier) * q);
}

export function subscriptionUnitPricePercent(
  tier: BulkTier,
  percentOff: number,
): number {
  const p = Math.min(100, Math.max(0, percentOff));
  return roundMoney(oneTimeUnitPrice(tier) * (1 - p / 100));
}

export function subscriptionTotalPercent(
  tier: BulkTier,
  quantity: number,
  percentOff: number,
): number {
  const q = Math.max(1, Math.floor(quantity));
  const p = Math.min(100, Math.max(0, percentOff));
  /** Một lần làm tròn trên tổng (không làm tròn unit trung gian) để khớp ví dụ spec $72.17. */
  const raw = oneTimeUnitPrice(tier) * (1 - p / 100) * q;
  return roundMoney(raw);
}

/** Fixed amount trừ trên tổng hóa đơn (không chia per unit). */
export function subscriptionTotalFixed(
  tier: BulkTier,
  quantity: number,
  fixedOff: number,
): number {
  const q = Math.max(1, Math.floor(quantity));
  const subtotal = oneTimeUnitPrice(tier) * q;
  const off = Math.max(0, fixedOff);
  return roundMoney(Math.max(0, subtotal - off));
}

export function savingsVsMinimumTier(
  tiers: BulkTier[],
  tier: BulkTier,
  quantity: number,
  mode: "one_time" | "subscription",
  discountType: DiscountType,
  discountValue: number,
): number {
  const minTier = tiers[0];
  if (!minTier || minTier.qtyBreakpoint === tier.qtyBreakpoint) return 0;
  const q = Math.max(1, Math.floor(quantity));
  let baseline: number;
  let actual: number;
  if (mode === "one_time") {
    baseline = roundMoney(minTier.priceAfterDiscount * q);
    actual = oneTimeTotal(tier, q);
  } else if (discountType === "PERCENTAGE") {
    baseline = subscriptionTotalPercent(minTier, q, discountValue);
    actual = subscriptionTotalPercent(tier, q, discountValue);
  } else {
    baseline = subscriptionTotalFixed(minTier, q, discountValue);
    actual = subscriptionTotalFixed(tier, q, discountValue);
  }
  return roundMoney(Math.max(0, baseline - actual));
}

export function tierQuantityLabel(
  tier: BulkTier,
  tiers: BulkTier[],
  index: number,
): string {
  const next = tiers[index + 1];
  if (!next) return `${tier.qtyBreakpoint}+`;
  const upper = next.qtyBreakpoint - 1;
  if (upper <= tier.qtyBreakpoint) return `${tier.qtyBreakpoint}+`;
  return `${tier.qtyBreakpoint}–${upper}`;
}
