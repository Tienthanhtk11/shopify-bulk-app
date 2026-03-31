import { describe, expect, it } from "vitest";
import {
  customerOwnsContract,
  isValidSubscriptionContractGid,
  normalizeCustomerGid,
} from "./customer-portal-access.shared";

describe("customer portal access helpers", () => {
  it("normalizes numeric customer ids into Shopify gids", () => {
    expect(normalizeCustomerGid("12345")).toBe("gid://shopify/Customer/12345");
  });

  it("accepts already normalized customer gids", () => {
    expect(normalizeCustomerGid("gid://shopify/Customer/999")).toBe(
      "gid://shopify/Customer/999",
    );
  });

  it("rejects malformed customer identifiers", () => {
    expect(normalizeCustomerGid("customer-123")).toBeNull();
    expect(normalizeCustomerGid("   ")).toBeNull();
    expect(normalizeCustomerGid(null)).toBeNull();
  });

  it("validates subscription contract gids", () => {
    expect(isValidSubscriptionContractGid("gid://shopify/SubscriptionContract/1")).toBe(true);
    expect(isValidSubscriptionContractGid("gid://shopify/Customer/1")).toBe(false);
    expect(isValidSubscriptionContractGid("")).toBe(false);
  });

  it("checks whether a contract belongs to the current customer", () => {
    expect(
      customerOwnsContract(
        [
          { id: "gid://shopify/SubscriptionContract/1" },
          { id: "gid://shopify/SubscriptionContract/2" },
        ],
        "gid://shopify/SubscriptionContract/2",
      ),
    ).toBe(true);

    expect(
      customerOwnsContract(
        [{ id: "gid://shopify/SubscriptionContract/1" }],
        "gid://shopify/SubscriptionContract/9",
      ),
    ).toBe(false);
  });
});