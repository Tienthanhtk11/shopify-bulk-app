import { describe, expect, it } from "vitest";
import {
  CUSTOMER_SUBSCRIPTION_ACTION_SUCCESS_MESSAGE,
  getCustomerSubscriptionMutation,
  isSupportedCustomerSubscriptionAction,
  validateCustomerSubscriptionAction,
} from "./customer-subscription-actions.shared";

describe("customer subscription action helpers", () => {
  it("accepts only supported action intents", () => {
    expect(isSupportedCustomerSubscriptionAction("pause")).toBe(true);
    expect(isSupportedCustomerSubscriptionAction("resume")).toBe(true);
    expect(isSupportedCustomerSubscriptionAction("cancel")).toBe(true);
    expect(isSupportedCustomerSubscriptionAction("delete")).toBe(false);
  });

  it("returns stable success messages", () => {
    expect(CUSTOMER_SUBSCRIPTION_ACTION_SUCCESS_MESSAGE.pause).toContain("paused");
    expect(CUSTOMER_SUBSCRIPTION_ACTION_SUCCESS_MESSAGE.resume).toContain("resumed");
    expect(CUSTOMER_SUBSCRIPTION_ACTION_SUCCESS_MESSAGE.cancel).toContain("cancelled");
  });

  it("allows only valid state transitions", () => {
    expect(validateCustomerSubscriptionAction({ status: "ACTIVE" }, "pause")).toBeNull();
    expect(validateCustomerSubscriptionAction({ status: "ACTIVE" }, "cancel")).toBeNull();
    expect(validateCustomerSubscriptionAction({ status: "ACTIVE" }, "resume")).toBe(
      "Only paused subscriptions can be resumed.",
    );

    expect(validateCustomerSubscriptionAction({ status: "PAUSED" }, "resume")).toBeNull();
    expect(validateCustomerSubscriptionAction({ status: "PAUSED" }, "cancel")).toBeNull();
    expect(validateCustomerSubscriptionAction({ status: "PAUSED" }, "pause")).toBe(
      "Only active subscriptions can be paused.",
    );

    expect(validateCustomerSubscriptionAction({ status: "CANCELLED" }, "cancel")).toBe(
      "Cancelled subscriptions cannot be changed anymore.",
    );
    expect(validateCustomerSubscriptionAction({ status: "CANCELLED" }, "resume")).toBe(
      "Only paused subscriptions can be resumed.",
    );
  });

  it("maps each intent to the expected Shopify mutation", () => {
    expect(getCustomerSubscriptionMutation("pause").payloadPath).toBe(
      "subscriptionContractPause",
    );
    expect(getCustomerSubscriptionMutation("resume").payloadPath).toBe(
      "subscriptionContractActivate",
    );
    expect(getCustomerSubscriptionMutation("cancel").payloadPath).toBe(
      "subscriptionContractCancel",
    );
  });
});