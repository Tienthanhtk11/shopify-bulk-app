import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { listCustomerSubscriptionContracts } from "../models/subscription-contracts.server";
import { authenticate, unauthenticated } from "../shopify.server";

type CustomerAccountIntent = "pause" | "resume" | "cancel";

const ACTION_SUCCESS_MESSAGE: Record<CustomerAccountIntent, string> = {
  pause: "Your subscription has been paused.",
  resume: "Your subscription has been resumed.",
  cancel: "Your subscription has been cancelled.",
};

function normalizeCustomerIdentifier(value: string | null) {
  if (!value) return null;

  if (value.startsWith("gid://shopify/Customer/")) {
    return value;
  }

  if (/^\d+$/.test(value)) {
    return `gid://shopify/Customer/${value}`;
  }

  return null;
}

function extractMyshopifyDomain(value: string | null | undefined) {
  if (!value) return null;

  const matchedDomain = value.match(/([a-z0-9][a-z0-9-]*\.myshopify\.com)/i)?.[1];
  if (matchedDomain) return matchedDomain.toLowerCase();

  try {
    const hostname = new URL(value).hostname;
    if (hostname.endsWith(".myshopify.com")) {
      return hostname.toLowerCase();
    }
  } catch {
    return null;
  }

  return null;
}

function resolveShopDomain(sessionToken: { dest?: string | null; iss?: string | null }) {
  return (
    extractMyshopifyDomain(sessionToken.dest) ??
    extractMyshopifyDomain(sessionToken.iss) ??
    null
  );
}

function buildPortalUrl(shop: string | null) {
  if (!shop) return "";
  return `https://${shop}/apps/subbulk/portal`;
}

function isSupportedIntent(value: string): value is CustomerAccountIntent {
  return value === "pause" || value === "resume" || value === "cancel";
}

async function mutateCustomerSubscriptionContract(
  admin: Awaited<ReturnType<typeof unauthenticated.admin>>["admin"],
  intent: CustomerAccountIntent,
  contractId: string,
) {
  if (intent === "pause") {
    const response = await admin.graphql(
      `#graphql
      mutation PauseCustomerSubscription($id: ID!) {
        subscriptionContractPause(subscriptionContractId: $id) {
          userErrors { message }
        }
      }`,
      { variables: { id: contractId } },
    );
    const payload = await response.json();
    return payload.data?.subscriptionContractPause?.userErrors?.[0]?.message ?? null;
  }

  if (intent === "resume") {
    const response = await admin.graphql(
      `#graphql
      mutation ResumeCustomerSubscription($id: ID!) {
        subscriptionContractActivate(subscriptionContractId: $id) {
          userErrors { message }
        }
      }`,
      { variables: { id: contractId } },
    );
    const payload = await response.json();
    return payload.data?.subscriptionContractActivate?.userErrors?.[0]?.message ?? null;
  }

  const response = await admin.graphql(
    `#graphql
    mutation CancelCustomerSubscription($id: ID!) {
      subscriptionContractCancel(subscriptionContractId: $id) {
        userErrors { message }
      }
    }`,
    { variables: { id: contractId } },
  );
  const payload = await response.json();
  return payload.data?.subscriptionContractCancel?.userErrors?.[0]?.message ?? null;
}

function buildCorsErrorResponse(status: number, error: string) {
  return json(
    {
      error,
      contracts: [],
    },
    {
      status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ ok: request.method === "GET" });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const sessionTokenValue = formData.get("session_token");

  const headers = new Headers(request.headers);
  if (typeof sessionTokenValue === "string" && sessionTokenValue.trim()) {
    headers.set("authorization", `Bearer ${sessionTokenValue.trim()}`);
  }

  const authenticatedRequest = new Request(request.url, {
    method: request.method,
    headers,
  });

  let cors;
  let sessionToken;

  try {
    ({ cors, sessionToken } = await authenticate.public.customerAccount(authenticatedRequest));
  } catch (error) {
    if (error instanceof Response) {
      return buildCorsErrorResponse(error.status || 401, error.statusText || "Unauthorized");
    }

    return buildCorsErrorResponse(401, "Unauthorized");
  }

  try {
    const customerId = normalizeCustomerIdentifier(sessionToken.sub);
    if (!customerId) {
      return cors(
        json(
          {
            error: "The current customer could not be identified.",
            contracts: [],
          },
          { status: 400 },
        ),
      );
    }

    const shop = resolveShopDomain(sessionToken);
    if (!shop) {
      return cors(
        json(
          {
            error: "The current shop could not be identified.",
            contracts: [],
          },
          { status: 400 },
        ),
      );
    }

    const { admin } = await unauthenticated.admin(shop);
    const intent = String(formData.get("intent") || "").trim().toLowerCase();
    const contractId = String(formData.get("contractId") || "").trim();
    let success = "";

    if (intent) {
      if (!isSupportedIntent(intent)) {
        return cors(
          json(
            {
              error: "This action is not supported.",
              contracts: [],
            },
            { status: 400 },
          ),
        );
      }

      if (!contractId.startsWith("gid://shopify/SubscriptionContract/")) {
        return cors(
          json(
            {
              error: "The subscription reference is invalid.",
              contracts: [],
            },
            { status: 400 },
          ),
        );
      }

      const existingContracts = await listCustomerSubscriptionContracts(admin, customerId, 50);
      if (!existingContracts.some((contract) => contract.id === contractId)) {
        return cors(
          json(
            {
              error: "This subscription does not belong to the current customer.",
              contracts: existingContracts,
            },
            { status: 403 },
          ),
        );
      }

      const mutationError = await mutateCustomerSubscriptionContract(admin, intent, contractId);
      if (mutationError) {
        return cors(
          json(
            {
              error: mutationError,
              contracts: existingContracts,
            },
            { status: 400 },
          ),
        );
      }

      success = ACTION_SUCCESS_MESSAGE[intent];
    }

    const contracts = await listCustomerSubscriptionContracts(admin, customerId, 20);

    return cors(
      json({
        contracts,
        success,
        portalUrl: buildPortalUrl(shop),
      }),
    );
  } catch (error) {
    return cors(
      json(
        {
          error:
            error instanceof Error
              ? error.message
              : "SubBulk could not load subscriptions for this customer.",
          contracts: [],
        },
        { status: 500 },
      ),
    );
  }
};