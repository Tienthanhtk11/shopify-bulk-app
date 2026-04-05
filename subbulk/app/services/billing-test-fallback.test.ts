import { afterEach, describe, expect, it } from "vitest";
import {
  buildManualTestSubscriptionInput,
  getBillingTestFallbackState,
} from "./billing-test-fallback.server";

const originalEnv = {
  SHOPIFY_BILLING_TEST_FALLBACK_ENABLED: process.env.SHOPIFY_BILLING_TEST_FALLBACK_ENABLED,
};

afterEach(() => {
  if (originalEnv.SHOPIFY_BILLING_TEST_FALLBACK_ENABLED === undefined) {
    delete process.env.SHOPIFY_BILLING_TEST_FALLBACK_ENABLED;
  } else {
    process.env.SHOPIFY_BILLING_TEST_FALLBACK_ENABLED = originalEnv.SHOPIFY_BILLING_TEST_FALLBACK_ENABLED;
  }
});

describe("getBillingTestFallbackState", () => {
  it("returns disabled when the env flag is missing", () => {
    delete process.env.SHOPIFY_BILLING_TEST_FALLBACK_ENABLED;

    expect(getBillingTestFallbackState()).toEqual({
      enabled: false,
      testOnly: true,
    });
  });

  it("returns enabled when the env flag is truthy", () => {
    process.env.SHOPIFY_BILLING_TEST_FALLBACK_ENABLED = "true";

    expect(getBillingTestFallbackState()).toEqual({
      enabled: true,
      testOnly: true,
    });
  });
});

describe("buildManualTestSubscriptionInput", () => {
  it("builds a monthly Premium test charge", () => {
    const result = buildManualTestSubscriptionInput({
      appUrl: "https://app.thanhpt.online",
      planKey: "growth",
      billingInterval: "monthly",
    });

    expect(result.name).toBe("SubBulk Premium Monthly Test");
    expect(result.returnUrl).toBe(
      "https://app.thanhpt.online/app/welcome?billingFallback=1&planKey=growth&billingInterval=monthly",
    );
    expect(result.test).toBe(true);
    expect(result.replacementBehavior).toBe("APPLY_IMMEDIATELY");
    expect(result.lineItems).toEqual([
      {
        plan: {
          appRecurringPricingDetails: {
            price: {
              amount: 29,
              currencyCode: "USD",
            },
            interval: "EVERY_30_DAYS",
          },
        },
      },
    ]);
  });

  it("builds an annual Ultra test charge", () => {
    const result = buildManualTestSubscriptionInput({
      appUrl: "https://app.thanhpt.online/",
      planKey: "scale",
      billingInterval: "annual",
    });

    expect(result.name).toBe("SubBulk Ultra Annual Test");
    expect(result.returnUrl).toBe(
      "https://app.thanhpt.online/app/welcome?billingFallback=1&planKey=scale&billingInterval=annual",
    );
    expect(result.lineItems[0]?.plan.appRecurringPricingDetails.price.amount).toBe(790);
    expect(result.lineItems[0]?.plan.appRecurringPricingDetails.interval).toBe("ANNUAL");
  });

  it("rejects Free because no paid charge is needed", () => {
    expect(() =>
      buildManualTestSubscriptionInput({
        appUrl: "https://app.thanhpt.online",
        planKey: "free",
        billingInterval: "monthly",
      }),
    ).toThrow("only supports paid plans");
  });
});