function normalizeStoreHandle(shopDomain: string) {
  return shopDomain.replace(/\.myshopify\.com$/i, "").trim().toLowerCase();
}

function isTruthyEnvFlag(value: string | undefined) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["1", "true", "yes", "on", "ready"].includes(normalized);
}

export function getManagedPricingPageState(shopDomain: string) {
  const appHandle = String(process.env.SHOPIFY_MANAGED_PRICING_APP_HANDLE || "").trim();
  const managedPricingReady = isTruthyEnvFlag(
    process.env.SHOPIFY_MANAGED_PRICING_READY,
  );

  if (!appHandle) {
    return {
      appHandle: null,
      configured: false,
      ready: false,
      url: null,
    };
  }

  const storeHandle = normalizeStoreHandle(shopDomain);
  if (!storeHandle) {
    return {
      appHandle,
      configured: true,
      ready: false,
      url: null,
    };
  }

  return {
    appHandle,
    configured: true,
    ready: managedPricingReady,
    url: managedPricingReady
      ? `https://admin.shopify.com/store/${storeHandle}/charges/${appHandle}/pricing_plans`
      : null,
  };
}

export function getManagedPricingPageUrl(shopDomain: string) {
  return getManagedPricingPageState(shopDomain).url;
}