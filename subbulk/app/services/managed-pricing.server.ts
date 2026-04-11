import { readManagedPricingConfig } from "../config.server";

function normalizeStoreHandle(shopDomain: string) {
  return shopDomain.replace(/\.myshopify\.com$/i, "").trim().toLowerCase();
}

export function getManagedPricingPageState(shopDomain: string) {
  const { appHandle, ready: managedPricingReady } = readManagedPricingConfig();

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