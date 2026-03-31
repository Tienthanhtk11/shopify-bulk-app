function normalizeStoreHandle(shopDomain: string) {
  return shopDomain.replace(/\.myshopify\.com$/i, "").trim().toLowerCase();
}

export function getManagedPricingPageUrl(shopDomain: string) {
  const appHandle = String(process.env.SHOPIFY_MANAGED_PRICING_APP_HANDLE || "").trim();
  if (!appHandle) {
    return null;
  }

  const storeHandle = normalizeStoreHandle(shopDomain);
  if (!storeHandle) {
    return null;
  }

  return `https://admin.shopify.com/store/${storeHandle}/charges/${appHandle}/pricing_plans`;
}