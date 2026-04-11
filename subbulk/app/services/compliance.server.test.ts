import { describe, expect, it } from "vitest";
import {
  buildRedactedPayload,
  summarizeCustomersDataRequestPayload,
  summarizeCustomersRedactPayload,
  summarizeShopRedactPayload,
} from "./compliance.server";

describe("compliance.server", () => {
  it("summarizes customers/data_request without storing direct identifiers", () => {
    const summary = summarizeCustomersDataRequestPayload({
      shop_id: 954889,
      shop_domain: "example.myshopify.com",
      orders_requested: [1, 2, 3],
      customer: {
        id: 191167,
        email: "john@example.com",
        phone: "555-625-1199",
      },
      data_request: {
        id: 9999,
      },
    });

    expect(summary).toEqual({
      shopId: 954889,
      shopDomain: "example.myshopify.com",
      customerId: 191167,
      dataRequestId: 9999,
      ordersRequestedCount: 3,
      containsProtectedCustomerData: false,
      notes: [
        "App does not persist dedicated customer profiles in the local database.",
        "Compliance webhook payloads are stored as sanitized summaries only.",
      ],
    });
  });

  it("summarizes customers/redact with count-only order details", () => {
    const summary = summarizeCustomersRedactPayload({
      shop_id: 954889,
      shop_domain: "example.myshopify.com",
      customer: {
        id: 191167,
        email: "john@example.com",
      },
      orders_to_redact: [299938, 280263],
    });

    expect(summary).toEqual({
      shopId: 954889,
      shopDomain: "example.myshopify.com",
      customerId: 191167,
      ordersToRedactCount: 2,
      action: "customer_data_redacted_in_local_audit_trail",
    });
  });

  it("summarizes shop/redact with minimal payload", () => {
    expect(
      summarizeShopRedactPayload({
        shop_id: 954889,
        shop_domain: "example.myshopify.com",
      }),
    ).toEqual({
      shopId: 954889,
      shopDomain: "example.myshopify.com",
      action: "shop_data_redacted",
    });
  });

  it("builds a redacted payload envelope", () => {
    expect(buildRedactedPayload("customers_redact", { shopDomain: "example.myshopify.com" })).toEqual({
      redacted: true,
      reason: "customers_redact",
      shopDomain: "example.myshopify.com",
    });
  });
});