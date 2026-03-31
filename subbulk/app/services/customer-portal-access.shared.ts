export type ContractRef = {
  id: string;
};

export function normalizeCustomerGid(value: string | null | undefined) {
  if (!value) return null;

  const normalized = value.trim();
  if (!normalized) return null;

  if (normalized.startsWith("gid://shopify/Customer/")) {
    return normalized;
  }

  if (/^\d+$/.test(normalized)) {
    return `gid://shopify/Customer/${normalized}`;
  }

  return null;
}

export function isValidSubscriptionContractGid(value: string | null | undefined) {
  return typeof value === "string" && value.startsWith("gid://shopify/SubscriptionContract/");
}

export function customerOwnsContract(
  contracts: ContractRef[],
  contractId: string,
) {
  return contracts.some((contract) => contract.id === contractId);
}