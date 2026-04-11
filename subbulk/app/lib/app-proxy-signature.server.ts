import "@shopify/shopify-api/adapters/node";
import { ApiVersion, shopifyApi } from "@shopify/shopify-api";
import { serverConfig } from "../config.server";

/**
 * Validate App Proxy HMAC without loading sessions or refreshing tokens.
 * This is used for public JSON routes so token refresh failures do not turn into 500s.
 */
function proxyValidationApi() {
  const appUrl = serverConfig.shopifyAppUrl;
  return shopifyApi({
    apiKey: serverConfig.shopifyApiKey,
    apiSecretKey: serverConfig.shopifyApiSecret,
    apiVersion: ApiVersion.January25,
    hostName: appUrl.host,
    hostScheme: appUrl.protocol.replace(":", "") || "https",
    isEmbeddedApp: true,
  });
}

/** Mirrors @shopify/shopify-app-remix authenticate/public/appProxy logic. */
export async function isValidAppProxyRequest(request: Request): Promise<boolean> {
  const api = proxyValidationApi();
  const url = new URL(request.url);
  try {
    let searchParams = new URLSearchParams(url.search);
    if (!searchParams.get("index")) {
      searchParams.delete("index");
    }
    let isValid = await api.utils.validateHmac(
      Object.fromEntries(searchParams.entries()),
      { signator: "appProxy" },
    );
    if (!isValid) {
      const cleanPath = url.pathname
        .replace(/^\//, "")
        .replace(/\/$/, "")
        .replaceAll("/", ".");
      const data = `routes%2F${cleanPath}`;
      searchParams = new URLSearchParams(
        `?_data=${data}&${searchParams.toString().replace(/^\?/, "")}`,
      );
      isValid = await api.utils.validateHmac(
        Object.fromEntries(searchParams.entries()),
        { signator: "appProxy" },
      );
      if (!isValid) {
        const sp2 = new URLSearchParams(
          `?_data=${data}._index&${url.search.replace(/^\?/, "")}`,
        );
        isValid = await api.utils.validateHmac(
          Object.fromEntries(sp2.entries()),
          { signator: "appProxy" },
        );
      }
    }
    return isValid;
  } catch {
    return false;
  }
}
