import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../db.server", () => ({
  default: {},
}));
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
      shopDomain: "test-6-423.myshopify.com",
      host: "YWRtaW4uc2hvcGlmeS5jb20vc3RvcmUvdGVzdC02LTQyMw==",
    });

    expect(result.name).toBe("SubBulk Premium Monthly");
    expect(result.returnUrl).toBe(
      "https://admin.shopify.com/store/test-6-423/apps/bmg-bulk-subscription/app/settings",
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
      shopDomain: "test-6-423.myshopify.com",
      host: "YWRtaW4uc2hvcGlmeS5jb20vc3RvcmUvdGVzdC02LTQyMw==",
    });

    expect(result.name).toBe("SubBulk Ultra Annual");
    expect(result.returnUrl).toBe(
      "https://admin.shopify.com/store/test-6-423/apps/bmg-bulk-subscription/app/settings",
    );
    expect(result.lineItems[0]?.plan.appRecurringPricingDetails.price.amount).toBe(790);
    expect(result.lineItems[0]?.plan.appRecurringPricingDetails.interval).toBe("ANNUAL");
  });

  it("derives host from shop when the billing page request no longer carries host", () => {
    const result = buildManualTestSubscriptionInput({
      appUrl: "https://app.thanhpt.online",
      planKey: "growth",
      billingInterval: "monthly",
      shopDomain: "test-7-2027.myshopify.com",
    });

    expect(result.returnUrl).toBe(
      "https://admin.shopify.com/store/test-7-2027/apps/bmg-bulk-subscription/app/settings",
    );
  });

  it("uses Shopify standard replacement behavior for paid downgrades", () => {
    const result = buildManualTestSubscriptionInput({
      appUrl: "https://app.thanhpt.online",
      planKey: "growth",
      billingInterval: "monthly",
      shopDomain: "test-7-2027.myshopify.com",
      currentPlanKey: "scale",
      currentBillingInterval: "annual",
    });

    expect(result.replacementBehavior).toBe("STANDARD");
  });

  it("falls back to the app billing return route when shop domain is unavailable", () => {
    const result = buildManualTestSubscriptionInput({
      appUrl: "https://app.thanhpt.online",
      planKey: "growth",
      billingInterval: "monthly",
      host: "YWRtaW4uc2hvcGlmeS5jb20vc3RvcmUvdGVzdC02LTQyMw==",
    });

    expect(result.returnUrl).toBe(
      "https://app.thanhpt.online/billing/return?host=YWRtaW4uc2hvcGlmeS5jb20vc3RvcmUvdGVzdC02LTQyMw%3D%3D&embedded=1",
    );
  });

  it("rejects Free because no paid charge is needed", () => {
    expect(() =>
      buildManualTestSubscriptionInput({
        appUrl: "https://app.thanhpt.online",
        planKey: "free",
        billingInterval: "monthly",
      }),
    ).toThrow("only support paid plans");
  });
});
