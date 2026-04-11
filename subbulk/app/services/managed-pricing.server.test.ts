import { afterEach, describe, expect, it } from "vitest";
import {
  getManagedPricingPageState,
  getManagedPricingPageUrl,
} from "./managed-pricing.server";

const originalEnv = {
  SHOPIFY_MANAGED_PRICING_APP_HANDLE: process.env.SHOPIFY_MANAGED_PRICING_APP_HANDLE,
  SHOPIFY_MANAGED_PRICING_READY: process.env.SHOPIFY_MANAGED_PRICING_READY,
};

afterEach(() => {
  if (originalEnv.SHOPIFY_MANAGED_PRICING_APP_HANDLE === undefined) {
    delete process.env.SHOPIFY_MANAGED_PRICING_APP_HANDLE;
  } else {
    process.env.SHOPIFY_MANAGED_PRICING_APP_HANDLE =
      originalEnv.SHOPIFY_MANAGED_PRICING_APP_HANDLE;
  }

  if (originalEnv.SHOPIFY_MANAGED_PRICING_READY === undefined) {
    delete process.env.SHOPIFY_MANAGED_PRICING_READY;
  } else {
    process.env.SHOPIFY_MANAGED_PRICING_READY =
      originalEnv.SHOPIFY_MANAGED_PRICING_READY;
  }
});

describe("managed pricing helpers", () => {
  it("reports an unconfigured state when no app handle is set", () => {
    delete process.env.SHOPIFY_MANAGED_PRICING_APP_HANDLE;
    delete process.env.SHOPIFY_MANAGED_PRICING_READY;

    expect(getManagedPricingPageState("demo-shop.myshopify.com")).toEqual({
      appHandle: null,
      configured: false,
      ready: false,
      url: null,
    });
  });

  it("keeps the URL null until managed pricing is marked ready", () => {
    process.env.SHOPIFY_MANAGED_PRICING_APP_HANDLE = "subbulk";
    process.env.SHOPIFY_MANAGED_PRICING_READY = "false";

    expect(getManagedPricingPageState("Demo-Shop.myshopify.com")).toEqual({
      appHandle: "subbulk",
      configured: true,
      ready: false,
      url: null,
    });
  });

  it("builds the Shopify pricing plans URL once the feature is ready", () => {
    process.env.SHOPIFY_MANAGED_PRICING_APP_HANDLE = "subbulk";
    process.env.SHOPIFY_MANAGED_PRICING_READY = "ready";

    expect(getManagedPricingPageUrl("Demo-Shop.myshopify.com")).toBe(
      "https://admin.shopify.com/store/demo-shop/charges/subbulk/pricing_plans",
    );
  });
});
