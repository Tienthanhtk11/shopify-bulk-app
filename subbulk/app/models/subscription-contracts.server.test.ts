import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildSubscriptionAnalytics,
  buildSubscriptionStatusCounts,
  type SubscriptionContractRow,
} from "./subscription-contracts.server";

function buildRow(
  overrides: Partial<SubscriptionContractRow>,
): SubscriptionContractRow {
  return {
    id: "gid://shopify/SubscriptionContract/1",
    shortId: "1",
    status: "ACTIVE",
    createdAt: "2026-04-01T00:00:00.000Z",
    nextBillingDate: null,
    lastPaymentStatus: null,
    paymentMethodLabel: null,
    paymentMethodStatus: "ON_FILE",
    customerName: "Jane Doe",
    customerEmail: "jane@example.com",
    lineTitle: "Coffee subscription",
    quantity: 1,
    ...overrides,
  };
}

describe("buildSubscriptionStatusCounts", () => {
  it("counts each status bucket", () => {
    const rows: SubscriptionContractRow[] = [
      buildRow({ status: "ACTIVE" }),
      buildRow({ id: "2", shortId: "2", status: "PAUSED" }),
      buildRow({ id: "3", shortId: "3", status: "CANCELLED" }),
    ];

    expect(buildSubscriptionStatusCounts(rows)).toEqual({
      active: 1,
      paused: 1,
      cancelled: 1,
    });
  });
});

describe("buildSubscriptionAnalytics", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-11T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("builds production-facing analytics summaries from the contract rows", () => {
    const rows: SubscriptionContractRow[] = [
      buildRow({
        id: "1",
        shortId: "1",
        status: "ACTIVE",
        createdAt: "2026-04-08T00:00:00.000Z",
        nextBillingDate: "2026-04-15T00:00:00.000Z",
        lineTitle: "Coffee subscription",
        quantity: 2,
      }),
      buildRow({
        id: "2",
        shortId: "2",
        status: "ACTIVE",
        createdAt: "2026-03-28T00:00:00.000Z",
        nextBillingDate: "2026-04-30T00:00:00.000Z",
        lineTitle: "Coffee subscription",
        quantity: 1,
      }),
      buildRow({
        id: "3",
        shortId: "3",
        status: "CANCELLED",
        createdAt: "2026-02-20T00:00:00.000Z",
        lineTitle: "Tea subscription",
        quantity: 3,
      }),
    ];

    const result = buildSubscriptionAnalytics(rows);

    expect(result.total).toBe(3);
    expect(result.statusCounts).toEqual({
      active: 2,
      paused: 0,
      cancelled: 1,
    });
    expect(result.activeRate).toBeCloseTo(66.666, 2);
    expect(result.churnRate).toBeCloseTo(33.333, 2);
    expect(result.recentCreated).toBe(2);
    expect(result.previousCreated).toBe(1);
    expect(result.growthRate).toBe(100);
    expect(result.dueIn7Days).toBe(1);
    expect(result.dueIn30Days).toBe(2);
    expect(result.averageQuantity).toBe(2);
    expect(result.topProducts[0]).toEqual({
      title: "Coffee subscription",
      contracts: 2,
    });
    expect(result.newestContracts[0]?.shortId).toBe("1");
    expect(result.healthSummary).toContain("Churn is relatively high");
  });
});
