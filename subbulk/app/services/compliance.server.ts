type JsonObject = Record<string, unknown>;

export const COMPLIANCE_EVENT_TYPES = [
  "compliance.customers_data_request",
  "compliance.customers_redact",
  "compliance.shop_redact",
] as const;

const COMPLIANCE_IDENTIFIER_KEYS = new Set([
  "shopid",
  "shopdomain",
  "customerid",
  "datarequestid",
  "shop_id",
  "shop_domain",
  "customer_id",
  "data_request_id",
  "customer",
  "data_request",
  "orders_requested",
  "orders_to_redact",
]);

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

  return {
    webhook: "customers/data_request",
    ordersRequestedCount: asArray(root.orders_requested).length,
    hasCustomerReference: Boolean(asNumber(asObject(root.customer).id)),
    hasDataRequestReference: Boolean(asNumber(asObject(root.data_request).id)),
    containsProtectedCustomerData: false,
    localCustomerDataStored: false,
    notes: [
      "App does not persist dedicated customer profiles in the local database.",
      "Compliance webhook payloads are stored as sanitized summaries only.",
    ],
  };
}

export function summarizeCustomersRedactPayload(payload: unknown) {
  const root = asObject(payload);

  return {
    webhook: "customers/redact",
    hasCustomerReference: Boolean(asNumber(asObject(root.customer).id)),
    ordersToRedactCount: asArray(root.orders_to_redact).length,
    action: "customer_data_redacted_in_local_audit_trail",
  };
}

export function summarizeShopRedactPayload(payload: unknown) {
  const root = asObject(payload);

  return {
    webhook: "shop/redact",
    hasShopReference: Boolean(asNumber(root.shop_id) || asString(root.shop_domain)),
    action: "shop_data_redacted",
    localRetentionState: "merchant_profile_minimized_and_operational_data_wiped",
  };
}

export function buildRedactedPayload(reason: string, metadata?: Record<string, unknown>) {
  return {
    redacted: true,
    reason,
    ...(metadata ?? {}),
  };
}

export function payloadContainsComplianceIdentifiers(payload: unknown): boolean {
  if (Array.isArray(payload)) {
    return payload.some((value) => payloadContainsComplianceIdentifiers(value));
  }

  if (!payload || typeof payload !== "object") {
    return false;
  }

  return Object.entries(payload as JsonObject).some(([key, value]) => {
    if (COMPLIANCE_IDENTIFIER_KEYS.has(key)) {
      return true;
    }

    return payloadContainsComplianceIdentifiers(value);
  });
}