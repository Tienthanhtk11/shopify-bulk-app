import type { CustomerSubscriptionContractRow } from "../models/subscription-contracts.server";

export type CustomerSubscriptionActionIntent = "pause" | "resume" | "cancel";

export const CUSTOMER_SUBSCRIPTION_ACTION_SUCCESS_MESSAGE: Record<
  CustomerSubscriptionActionIntent,
  string
> = {
  pause: "Your subscription has been paused.",
  resume: "Your subscription has been resumed.",
  cancel: "Your subscription has been cancelled.",
};

export function isSupportedCustomerSubscriptionAction(
  value: string,
): value is CustomerSubscriptionActionIntent {
  return value === "pause" || value === "resume" || value === "cancel";
}

export function validateCustomerSubscriptionAction(
  contract: Pick<CustomerSubscriptionContractRow, "status">,
  intent: CustomerSubscriptionActionIntent,
) {
  if (intent === "pause") {
    return contract.status === "ACTIVE"
      ? null
      : "Only active subscriptions can be paused.";
  }

  if (intent === "resume") {
    return contract.status === "PAUSED"
      ? null
      : "Only paused subscriptions can be resumed.";
  }

  return contract.status === "CANCELLED"
    ? "Cancelled subscriptions cannot be changed anymore."
    : null;
}

export function getCustomerSubscriptionMutation(
  intent: CustomerSubscriptionActionIntent,
) {
  if (intent === "pause") {
    return {
      query: `#graphql
        mutation PauseCustomerSubscription($id: ID!) {
          subscriptionContractPause(subscriptionContractId: $id) {
            userErrors { message }
          }
        }`,
      payloadPath: "subscriptionContractPause",
    } as const;
  }

  if (intent === "resume") {
    return {
      query: `#graphql
        mutation ResumeCustomerSubscription($id: ID!) {
          subscriptionContractActivate(subscriptionContractId: $id) {
            userErrors { message }
          }
        }`,
      payloadPath: "subscriptionContractActivate",
    } as const;
  }

  return {
    query: `#graphql
      mutation CancelCustomerSubscription($id: ID!) {
        subscriptionContractCancel(subscriptionContractId: $id) {
          userErrors { message }
        }
      }`,
    payloadPath: "subscriptionContractCancel",
  } as const;
}