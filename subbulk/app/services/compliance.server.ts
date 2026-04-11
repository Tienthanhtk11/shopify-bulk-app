type JsonObject = Record<string, unknown>;

function asObject(value: unknown): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as JsonObject;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

export function summarizeCustomersDataRequestPayload(payload: unknown) {
  const root = asObject(payload);
  const customer = asObject(root.customer);
  const dataRequest = asObject(root.data_request);

  return {
    shopId: asNumber(root.shop_id),
    shopDomain: asString(root.shop_domain),
    customerId: asNumber(customer.id),
    dataRequestId: asNumber(dataRequest.id),
    ordersRequestedCount: asArray(root.orders_requested).length,
    containsProtectedCustomerData: false,
    notes: [
      "App does not persist dedicated customer profiles in the local database.",
      "Compliance webhook payloads are stored as sanitized summaries only.",
    ],
  };
}

export function summarizeCustomersRedactPayload(payload: unknown) {
  const root = asObject(payload);
  const customer = asObject(root.customer);

  return {
    shopId: asNumber(root.shop_id),
    shopDomain: asString(root.shop_domain),
    customerId: asNumber(customer.id),
    ordersToRedactCount: asArray(root.orders_to_redact).length,
    action: "customer_data_redacted_in_local_audit_trail",
  };
}

export function summarizeShopRedactPayload(payload: unknown) {
  const root = asObject(payload);

  return {
    shopId: asNumber(root.shop_id),
    shopDomain: asString(root.shop_domain),
    action: "shop_data_redacted",
  };
}

export function buildRedactedPayload(reason: string, metadata?: Record<string, unknown>) {
  return {
    redacted: true,
    reason,
    ...(metadata ?? {}),
  };
}