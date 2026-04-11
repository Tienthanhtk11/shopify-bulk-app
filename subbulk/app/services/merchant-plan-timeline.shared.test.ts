import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  extractSubscriptionTimeline,
  extractWebhookSubscriptionTimeline,
  isExpiredMerchantPlan,
  isMerchantPlanCancellationScheduled,
  parseTimelineDate,
} from "./merchant-plan-timeline.shared";

describe("parseTimelineDate", () => {
  it("returns null for invalid values", () => {
    expect(parseTimelineDate("not-a-date")).toBeNull();
    expect(parseTimelineDate(undefined)).toBeNull();
  });

  it("parses valid ISO strings", () => {
    expect(parseTimelineDate("2026-04-11T12:00:00.000Z")?.toISOString()).toBe(
      "2026-04-11T12:00:00.000Z",
    );
  });
});

describe("extractSubscriptionTimeline", () => {
  it("derives trial end dates from createdAt and trialDays when explicit trial dates are missing", () => {
    const result = extractSubscriptionTimeline({
      created_at: "2026-04-01T00:00:00.000Z",
      current_period_end: "2026-05-01T00:00:00.000Z",
      trial_days: 14,
    });

    expect(result.activatedAt?.toISOString()).toBe("2026-04-01T00:00:00.000Z");
    expect(result.currentPeriodEndAt?.toISOString()).toBe("2026-05-01T00:00:00.000Z");
    expect(result.trialEndsAt?.toISOString()).toBe("2026-04-15T00:00:00.000Z");
  });

  it("supports the webhook wrapper helper", () => {
    const result = extractWebhookSubscriptionTimeline({
      activatedAt: "2026-04-02T00:00:00.000Z",
      canceled_at: "2026-04-20T00:00:00.000Z",
    });

    expect(result.activatedAt?.toISOString()).toBe("2026-04-02T00:00:00.000Z");
    expect(result.canceledAt?.toISOString()).toBe("2026-04-20T00:00:00.000Z");
  });
});

describe("merchant plan lifecycle helpers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-11T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("detects when a paid plan has expired", () => {
    expect(
      isExpiredMerchantPlan({
        planKey: "growth",
        currentPeriodEndAt: "2026-04-01T00:00:00.000Z",
      }),
    ).toBe(true);

    expect(
      isExpiredMerchantPlan({
        planKey: "free",
        currentPeriodEndAt: "2026-04-01T00:00:00.000Z",
      }),
    ).toBe(false);
  });

  it("detects cancellation scheduling only while access is still alive", () => {
    expect(
      isMerchantPlanCancellationScheduled({
        planKey: "growth",
        status: "active",
        canceledAt: "2026-04-10T00:00:00.000Z",
        currentPeriodEndAt: "2026-04-20T00:00:00.000Z",
      }),
    ).toBe(true);

    expect(
      isMerchantPlanCancellationScheduled({
        planKey: "growth",
        status: "cancelled",
        canceledAt: "2026-03-01T00:00:00.000Z",
        currentPeriodEndAt: "2026-03-15T00:00:00.000Z",
      }),
    ).toBe(false);
  });
});
